// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/datajs",
    "sap/ui/thirdparty/URI",
    "sap/ushell/components/tiles/utils",
    "sap/ushell/components/tiles/utilsRT",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/services/AppType",
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/base/util/UriParameters"
], function (
    OData,
    URI,
    utils,
    utilsRT,
    AppLifeCycle,
    Config,
    AppType,
    library,
    JSONModel,
    jQuery,
    UriParameters
) {
    "use strict";

    // shortcut for sap.m.GenericTileScope
    var GenericTileScope = library.GenericTileScope;

    var GenericTileMode = library.GenericTileMode;

    /* global hasher */

    /* eslint-disable no-useless-escape */ // TODO: remove eslint-disable

    sap.ui.getCore().loadLibrary("sap.m");
    sap.ui.controller("sap.ushell.components.tiles.applauncherdynamic.DynamicTile", {
        // handle to control/cancel browser's setTimeout()
        timer: null,
        _aDoableObject: {},
        // handle to control/cancel data.js OData.read()
        oDataRequest: null,
        sConfigNavigationTargetUrlOld: "",
        REFRESH_INTERVAL_MIN: 10,

        constructTargetUrlWithSapSystem: function (sNavigationTargetUrl, sSystem) {
            var oUrlParser,
                oHash;

            if (sSystem) { // propagate system to target application
                oUrlParser = sap.ushell.Container.getService("URLParsing");
                // when the navigation url is hash we want to make sure system parameter is in the parameters part
                // BCP 1780450594
                if (oUrlParser.isIntentUrl(sNavigationTargetUrl)) {
                    oHash = oUrlParser.parseShellHash(sNavigationTargetUrl);
                    if (!oHash.params) {
                        oHash.params = {};
                    }
                    oHash.params["sap-system"] = sSystem;
                    sNavigationTargetUrl = "#" + oUrlParser.constructShellHash(oHash);
                } else {
                    sNavigationTargetUrl += ((sNavigationTargetUrl.indexOf("?") < 0) ? "?" : "&")
                        + "sap-system=" + sSystem;
                }
            }
            return sNavigationTargetUrl;
        },

        onInit: function () {
            var oView = this.getView(),
                oViewData = oView.getViewData(),
                oTileApi = oViewData.chip,
                oConfig = utilsRT.getConfiguration(oTileApi, oTileApi.configurationUi.isEnabled(), false),
                oModel,
                sKeywords,
                aKeywords,
                that = this,
                sNavigationTargetUrlInit = oConfig.navigation_target_url,
                sSystem;

            this.sConfigNavigationTargetUrlOld = oConfig.navigation_target_url;
            jQuery.sap.log.setLevel(2, "sap.ushell.components.tiles.applauncherdynamic.DynamicTile");

            this.bIsRequestCompleted = false;
            this.oShellModel = AppLifeCycle.getElementsModel();
            sSystem = oTileApi.url.getApplicationSystem();
            this.navigationTargetUrl = this.constructTargetUrlWithSapSystem(sNavigationTargetUrlInit, sSystem);
            /**
             * Model of the applauncher tile consisting of
             *   config (tile configuration),
             *   data (dyanmic data read from a data source)
             *   nav (target URL set to '' in case of Admin UI), and
             *   search (highlight terms)
             */
            oModel = new JSONModel({
                sizeBehavior: Config.last("/core/home/sizeBehavior"),
                wrappingType: Config.last("/core/home/wrappingType"),
                config: oConfig,
                mode: oConfig.display_mode || GenericTileMode.ContentMode,
                data: utilsRT.getDataToDisplay(oConfig, {
                    number: ((oTileApi.preview && oTileApi.preview.isEnabled()) ? 1234 : "...")
                }),
                nav: { navigation_target_url: (oTileApi.configurationUi && oTileApi.configurationUi.isEnabled() ? "" : this.navigationTargetUrl) },
                search: {
                    display_highlight_terms: []
                }
            });
            oView.setModel(oModel);
            // listen for changes of the size behavior, as the end user can change it in the settings,(if enabled)
            this._aDoableObject = Config.on("/core/home/sizeBehavior").do(function (sSizeBehavior) {
                oModel.setProperty("/sizeBehavior", sSizeBehavior);
            });

            // implement types contact
            // default is Tile
            if (oTileApi.types) {
                oTileApi.types.attachSetType(function (sType) {
                    if (that.tileType != sType) {
                        var oModel = that.getView().getModel();
                        if (sType === "link") {
                            oModel.setProperty("/mode", GenericTileMode.LineMode);
                        } else {
                            oModel.setProperty("/mode", oModel.getProperty("/config/display_mode") || GenericTileMode.ContentMode);
                        }
                        that.tileType = sType;
                    }
                });
            }

            if (!this.tileType) {
                this.tileType = "tile";
            }

            // implement search contract
            if (oTileApi.search) {
                // split and clean keyword string (may be comma + space delimited)
                sKeywords = oView.getModel().getProperty("/config/display_search_keywords");
                aKeywords = sKeywords
                    .split(/[, ]+/)
                    .filter(function (n, i) { return n && n !== ""; });

                // add title, subtitle, info and number unit (if present) to keywords for better FLP searching
                if (oConfig.display_title_text && oConfig.display_title_text !== "" &&
                    aKeywords.indexOf(oConfig.display_title_text) === -1) {
                    aKeywords.push(oConfig.display_title_text);
                }
                if (oConfig.display_subtitle_text && oConfig.display_subtitle_text !== "" &&
                    aKeywords.indexOf(oConfig.display_subtitle_text) === -1) {
                    aKeywords.push(oConfig.display_subtitle_text);
                }
                if (oConfig.display_info_text && oConfig.display_info_text !== "" &&
                    aKeywords.indexOf(oConfig.display_info_text) === -1) {
                    aKeywords.push(oConfig.display_info_text);
                }
                // The Number Unit may not only be a currency but can also be something like "open leave requests"
                // which the user may want to search for.
                // Note: Number unit is the only not translatable property.
                if (oConfig.display_number_unit && oConfig.display_number_unit !== "" &&
                    aKeywords.indexOf(oConfig.display_number_unit) === -1) {
                    aKeywords.push(oConfig.display_number_unit);
                }

                // defined in search contract:
                oTileApi.search.setKeywords(aKeywords);
                oTileApi.search.attachHighlight(
                    function (aHighlightWords) {
                        // update model for highlighted search term
                        oView.getModel().setProperty("/search/display_highlight_terms", aHighlightWords);
                    }
                );
            }

            // implement bag update handler
            if (oTileApi.bag && oTileApi.bag.attachBagsUpdated) {
                // is only called by the FLP for bookmark tiles which have been updated via bookmark service
                oTileApi.bag.attachBagsUpdated(function (aUpdatedBagIds) {
                    if (aUpdatedBagIds.indexOf("tileProperties") > -1) {
                        utils._updateTilePropertiesTexts(oView, oTileApi.bag.getBag("tileProperties"));
                    }
                });
            }

            // implement configuration update handler
            if (oTileApi.configuration && oTileApi.configuration.attachConfigurationUpdated) {
                // is only called by the FLP for bookmark tiles which have been updated via bookmark service
                oTileApi.configuration.attachConfigurationUpdated(function (aUpdatedConfigKeys) {
                    if (aUpdatedConfigKeys.indexOf("tileConfiguration") > -1) {
                        utils._updateTileConfiguration(oView, oTileApi.configuration.getParameterValueAsString("tileConfiguration"));
                    }
                });
            }

            // implement preview contract
            if (oTileApi.preview) {
                oTileApi.preview.setTargetUrl(this.navigationTargetUrl);
                oTileApi.preview.setPreviewIcon(oConfig.display_icon_url);
                oTileApi.preview.setPreviewTitle(oConfig.display_title_text);
                if (oTileApi.preview.setPreviewSubtitle && typeof oTileApi.preview.setPreviewSubtitle === "function") {
                    oTileApi.preview.setPreviewSubtitle(oConfig.display_subtitle_text);
                }
            }

            // implement configurationUi contract: setup configuration UI
            if (oTileApi.configurationUi.isEnabled()) {
                oTileApi.configurationUi.setUiProvider(function () {
                    // attach configuration UI provider, which is essentially a components.tiles.dynamicapplauncher.Configuration
                    var oConfigurationUi = utils.getConfigurationUi(oView, "sap.ushell.components.tiles.applauncherdynamic.Configuration");
                    oTileApi.configurationUi.attachCancel(that.onCancelConfiguration.bind(null, oConfigurationUi));
                    oTileApi.configurationUi.attachSave(that.onSaveConfiguration.bind(null, oConfigurationUi));
                    return oConfigurationUi;
                });

                this.getView().getContent()[0].setTooltip(
                    utils.getResourceBundleModel().getResourceBundle()
                        .getText("edit_configuration.tooltip")
                );
            } else if (!oTileApi.preview || !oTileApi.preview.isEnabled()) {
                if (!sSystem) {
                    sap.ushell.Container.addRemoteSystemForServiceUrl(oConfig.service_url);
                } // else registration is skipped because registration has been done already
                // outside this controller (e.g. remote catalog registration)

                // start fetching data from backend service if not in preview or admin mode
                this.bNeedsRefresh = true;
                this.iNrOfTimerRunning = 0;
            }

            // implement refresh contract
            if (oTileApi.refresh) {
                oTileApi.refresh.attachRefresh(this.refreshHandler.bind(this));
            }

            // implement visible contract
            if (oTileApi.visible) {
                oTileApi.visible.attachVisible(this.visibleHandler.bind(this));
            }

            // attach the tile actions provider for the actions contract
            if (oTileApi.actions) {
                var aActions = oConfig.actions, aExtendedActions;
                if (aActions) {
                    aExtendedActions = aActions.slice();
                } else {
                    aExtendedActions = [];
                }

                var sType = oModel.getProperty("/mode") === GenericTileMode.LineMode ? "link" : "tile",
                    tileSettingsAction = utilsRT.getTileSettingsAction(oModel, this.onSaveRuntimeSettings.bind(this), sType);

                aExtendedActions.push(tileSettingsAction);

                oTileApi.actions.setActionsProvider(function () {
                    return aExtendedActions;
                });
            }
            sap.ui.getCore().getEventBus().subscribe("launchpad", "sessionTimeout", this.stopRequests, this);
        },

        // convenience function to stop browser's timeout and OData calls
        stopRequests: function () {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            if (this.oDataRequest) {
                try {
                    // marking the flow as in-request-abort-flow
                    // reason for it is that the line below (oDataRequest.abort();) invokes the errorHandlerFn method
                    // and inside it we need to know if we reached the errorHandler due to real requst failure OR
                    // request was aborted
                    this.bIsAbortRequestFlow = true;

                    // actual request abort
                    this.oDataRequest.abort();
                } catch (e) {
                    jQuery.sap.log.warning(e.name, e.message);
                }

                // We didn't finish the last refresh, so we need todo one as soon as the tile becomes visible again
                this.bNeedsRefresh = true;

                // remove the flag
                this.bIsAbortRequestFlow = undefined;
            }
        },

        // destroy handler stops requests
        onExit: function () {
            this.stopRequests();
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "sessionTimeout", this.stopRequests, this);
            this._aDoableObject.off();
        },

        // trigger to show the configuration UI if the tile is pressed in Admin mode
        onPress: function (oEvent) {
            var oView = this.getView(),
                oViewData = oView.getViewData(),
                oModel = oView.getModel(),
                sTargetUrl = oModel.getProperty("/nav/navigation_target_url"),
                oTileApi = oViewData.chip,
                oTileConfig = oModel.getProperty("/config");

            //scope is property of generic tile. It's default value is "Display"
            if (oEvent.getSource().getScope && oEvent.getSource().getScope() === GenericTileScope.Display) {
                if (oTileApi.configurationUi.isEnabled()) {

                    oTileApi.configurationUi.display();
                } else if (sTargetUrl) {
                    if (sTargetUrl[0] === "#") {
                        hasher.setHash(sTargetUrl);
                    } else {
                        // add theURL to recent activity log
                        var bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
                        if (bLogRecentActivity) {
                            var oRecentEntry = {
                                title: oTileConfig.display_title_text,
                                appType: AppType.URL,
                                url: oTileConfig.navigation_target_url,
                                appId: oTileConfig.navigation_target_url
                            };
                            sap.ushell.Container.getRenderer("fiori2").logRecentActivity(oRecentEntry);
                        }

                        window.open(sTargetUrl, "_blank");
                    }
                }
            }
        },

        extractData: function (oData) {
            var name,
                aKeys = ["results", "icon", "title", "number", "numberUnit", "info", "infoState", "infoStatus", "targetParams", "subtitle", "stateArrow", "numberState", "numberDigits", "numberFactor"];

            if (typeof oData === "object" && Object.keys(oData).length === 1) {
                name = Object.keys(oData)[0];
                if (Array.prototype.indexOf.call(aKeys, name) === -1) {
                    return oData[name];
                }
            }
            return oData;
        },

        // tile settings action UI save handler
        onSaveRuntimeSettings: function (oSettingsView) {
            var oView = this.getView(),
                oViewModel = oView.getModel(),
                oTileApi = oView.getViewData().chip,
                oConfigToSave = oViewModel.getProperty("/config"),
                oSettingsViewModel = oSettingsView.getModel();

            oConfigToSave.display_title_text = oSettingsViewModel.getProperty("/title");
            oConfigToSave.display_subtitle_text = oSettingsViewModel.getProperty("/subtitle");
            oConfigToSave.display_info_text = oSettingsViewModel.getProperty("/info");
            oConfigToSave.display_search_keywords = oSettingsViewModel.getProperty("/keywords");

            // use bag contract in order to store translatable properties
            var tilePropertiesBag = oTileApi.bag.getBag("tileProperties");
            tilePropertiesBag.setText("display_title_text", oConfigToSave.display_title_text);
            tilePropertiesBag.setText("display_subtitle_text", oConfigToSave.display_subtitle_text);
            tilePropertiesBag.setText("display_info_text", oConfigToSave.display_info_text);
            tilePropertiesBag.setText("display_search_keywords", oConfigToSave.display_search_keywords);

            function logErrorAndReject (oError) {
                jQuery.sap.log.error(oError, null, "sap.ushell.components.tiles.applauncherdynamic.DynamicTile.controller");
            }

            // saving the relevant properteis
            tilePropertiesBag.save(
                // success handler
                function () {
                    jQuery.sap.log.debug("property bag 'tileProperties' saved successfully");

                    // update the local tile's config - saving changes on the Model
                    oViewModel.setProperty("/config", oConfigToSave);

                    // update tile's model for changes to appear immediately
                    // (and not wait for the refresh handler which happens every 10 seconds)
                    oViewModel.setProperty("/data/display_title_text", oConfigToSave.display_title_text);
                    oViewModel.setProperty("/data/display_subtitle_text", oConfigToSave.display_subtitle_text);
                    oViewModel.setProperty("/data/display_info_text", oConfigToSave.display_info_text);

                    // call to refresh model which (due to the binding) will refresh the tile
                    oViewModel.refresh();
                },
                logErrorAndReject // error handler
            );
        },

        // configuration save handler
        onSaveConfiguration: function (oConfigurationView) {
            // the deferred object required from the configurationUi contract
            var oDeferred = jQuery.Deferred(),
                oModel = oConfigurationView.getModel(),
                // tile model placed into configuration model by getConfigurationUi
                oTileModel = oModel.getProperty("/tileModel"),
                oTileApi = oConfigurationView.getViewData().chip,
                aTileNavigationActions = utils.tileActionsRows2TileActionsArray(oModel.getProperty("/config/tile_actions_rows")),
                // get the configuration to save from the model
                configToSave = {
                    display_icon_url: oModel.getProperty("/config/display_icon_url"),
                    display_number_unit: oModel.getProperty("/config/display_number_unit"),
                    service_url: oModel.getProperty("/config/service_url"),
                    service_refresh_interval: oModel.getProperty("/config/service_refresh_interval"),
                    navigation_use_semantic_object: oModel.getProperty("/config/navigation_use_semantic_object"),
                    navigation_target_url: oModel.getProperty("/config/navigation_target_url"),
                    navigation_semantic_object: jQuery.trim(oModel.getProperty("/config/navigation_semantic_object")) || "",
                    navigation_semantic_action: jQuery.trim(oModel.getProperty("/config/navigation_semantic_action")) || "",
                    navigation_semantic_parameters: jQuery.trim(oModel.getProperty("/config/navigation_semantic_parameters")),
                    display_search_keywords: oModel.getProperty("/config/display_search_keywords")
                };
            //If the input fields icon, semantic object and action are failing the input validations, then through an error message requesting the user to enter/correct those fields
            var bReject = utils.checkInputOnSaveConfig(oConfigurationView);
            if (!bReject) {
                bReject = utils.checkTileActions(oConfigurationView);
            }
            if (bReject) {
                oDeferred.reject("mandatory_fields_missing");
                return oDeferred.promise();
            }
            // overwrite target URL in case of semantic object navigation
            if (configToSave.navigation_use_semantic_object) {
                configToSave.navigation_target_url = utilsRT.getSemanticNavigationUrl(configToSave);
                oModel.setProperty("/config/navigation_target_url", configToSave.navigation_target_url);
            }

            // use bag contract in order to store translatable properties
            var tilePropertiesBag = oTileApi.bag.getBag("tileProperties");
            tilePropertiesBag.setText("display_title_text", oModel.getProperty("/config/display_title_text"));
            tilePropertiesBag.setText("display_subtitle_text", oModel.getProperty("/config/display_subtitle_text"));
            tilePropertiesBag.setText("display_info_text", oModel.getProperty("/config/display_info_text"));
            tilePropertiesBag.setText("display_search_keywords", configToSave.display_search_keywords);

            var tileNavigationActionsBag = oTileApi.bag.getBag("tileNavigationActions");
            //forward populating of tile navigation actions array into the bag, to Utils
            utils.populateTileNavigationActionsBag(tileNavigationActionsBag, aTileNavigationActions);

            function logErrorAndReject (oError, oErrorInfo) {
                jQuery.sap.log.error(oError, null, "sap.ushell.components.tiles.applauncherdynamic.DynamicTile.controller");
                oDeferred.reject(oError, oErrorInfo);
            }

            // use configuration contract to write parameter values
            oTileApi.writeConfiguration.setParameterValues(
                { tileConfiguration: JSON.stringify(configToSave) },
                // success handler
                function () {
                    var oConfigurationConfig = utilsRT.getConfiguration(oTileApi, false, false),
                        // get tile config data in admin mode
                        oTileConfig = utilsRT.getConfiguration(oTileApi, true, false),
                        // switching the model under the tile -> keep the tile model
                        oModel = new JSONModel({
                            config: oConfigurationConfig,
                            // keep tile model
                            tileModel: oTileModel
                        });
                    oConfigurationView.setModel(oModel);

                    // update tile model
                    oTileModel.setData({ data: oTileConfig, nav: { navigation_target_url: "" } }, false);
                    if (oTileApi.preview) {
                        oTileApi.preview.setTargetUrl(oConfigurationConfig.navigation_target_url);
                        oTileApi.preview.setPreviewIcon(oConfigurationConfig.display_icon_url);
                        oTileApi.preview.setPreviewTitle(oConfigurationConfig.display_title_text);
                        if (oTileApi.preview.setPreviewSubtitle && typeof oTileApi.preview.setPreviewSubtitle === "function") {
                            oTileApi.preview.setPreviewSubtitle(oConfigurationConfig.display_subtitle_text);
                        }
                    }

                    tilePropertiesBag.save(
                        // success handler
                        function () {
                            jQuery.sap.log.debug("property bag 'tileProperties' saved successfully");
                            // update possibly changed values via contracts
                            if (oTileApi.title) {
                                oTileApi.title.setTitle(
                                    oConfigurationConfig.display_title_text,
                                    // success handler
                                    function () {
                                        oDeferred.resolve();
                                    },
                                    logErrorAndReject // error handler
                                );
                            } else {
                                oDeferred.resolve();
                            }
                        },
                        logErrorAndReject // error handler
                    );

                    tileNavigationActionsBag.save(
                        // success handler
                        function () {
                            jQuery.sap.log.debug("property bag 'navigationProperties' saved successfully");
                        },
                        logErrorAndReject // error handler
                    );
                },
                logErrorAndReject // error handler
            );

            return oDeferred.promise();
        },

        successHandlerFn: function (sRequestUrl, oResult) {
            var oView = this.getView(),
                oModel = oView.getModel(),
                oConfig = oModel.getProperty("/config"),
                oViewData = oView.getViewData(),
                oTileApi = oViewData.chip,
                sSystem = oTileApi.url.getApplicationSystem(),
                oDataToDisplay;

            this.oDataRequest = undefined;

            if (typeof oResult === "object") {

                var uriParamInlinecount = new UriParameters(sRequestUrl).get("$inlinecount");
                if (uriParamInlinecount && uriParamInlinecount === "allpages") {
                    oResult = { number: oResult.__count };
                } else {
                    oResult = this.extractData(oResult);
                }
            } else if (typeof oResult === "string") {
                oResult = { number: oResult };
            }

            if (oViewData.properties && oViewData.properties.info) {
                if (typeof oResult === "object") {
                    oResult.info = oViewData.properties.info;
                }
            }

            oDataToDisplay = utilsRT.getDataToDisplay(oConfig, oResult);

            // set data to display
            oModel.setProperty("/data", oDataToDisplay);

            // Update this.navigationTargetUrl in case that oConfig.navigation_target_url was changed
            // BCP Incident: 1670570695
            if (this.sConfigNavigationTargetUrlOld !== oConfig.navigation_target_url) {
                this.navigationTargetUrl = this.constructTargetUrlWithSapSystem(oConfig.navigation_target_url, sSystem);
                this.sConfigNavigationTargetUrlOld = this.navigationTargetUrl;
            }

            // rewrite target URL
            oModel.setProperty("/nav/navigation_target_url",
                utilsRT.addParamsToUrl(
                    this.navigationTargetUrl,
                    oDataToDisplay
                ));

            var iRefreshInterval = oConfig.service_refresh_interval;
            if (iRefreshInterval > 0) {
                iRefreshInterval = Math.max(iRefreshInterval, this.REFRESH_INTERVAL_MIN);

                jQuery.sap.log.info(
                    "Wait " + iRefreshInterval + " seconds before calling "
                    + oConfig.service_url + " again",
                    null,
                    "sap.ushell.components.tiles.applauncherdynamic.DynamicTile.controller"
                );

                this.refeshAfterInterval(iRefreshInterval);
            }
        },

        // error handler
        errorHandlerFn: function (oMessage, bIsWarning) {

            var oView = this.getView(),
                oModel = oView.getModel(),
                oConfig = oModel.getProperty("/config"),
                sMessage = oMessage && oMessage.message ? oMessage.message : oMessage,
                oResourceBundle = utils.getResourceBundleModel().getResourceBundle();

            this.oDataRequest = undefined;

            if (sMessage === "Request aborted") {
                // Display abort information in English only
                jQuery.sap.log.info(
                    "Data request from service " + oConfig.service_url + " was aborted", null,
                    "sap.ushell.components.tiles.applauncherdynamic.DynamicTile"
                );
            } else {
                if (oMessage.response) {
                    sMessage += " - " + oMessage.response.statusCode + " "
                        + oMessage.response.statusText;
                }

                //TODO: global jquery call found
                var fnLogFunction = bIsWarning ? jQuery.sap.log.warning : jQuery.sap.log.error;

                // Display error in English only
                fnLogFunction("Failed to update data via service\n" +
                    "  service URL: " + oConfig.service_url + "\n" +
                    "  " + sMessage,
                    null,
                    "sap.ushell.components.tiles.applauncherdynamic.DynamicTile");
            }

            if (!this.bIsAbortRequestFlow) {
                oModel.setProperty("/data",
                    utilsRT.getDataToDisplay(oConfig, {
                        number: "???",
                        info: oResourceBundle.getText("dynamic_data.error"),
                        infoState: "Critical"
                    })
                );
            }
        },

        // configuration cancel handler
        onCancelConfiguration: function (oConfigurationView/*, successHandler, errorHandle*/) {
            // re-load old configuration and display
            var oViewData = oConfigurationView.getViewData(),
                oModel = oConfigurationView.getModel(),
                // tile model placed into configuration model by getConfigurationUi
                oTileModel = oModel.getProperty("/tileModel"),
                oTileApi = oViewData.chip,
                oCurrentConfig = utilsRT.getConfiguration(oTileApi, false, false);

            oModel.setData({ config: oCurrentConfig, tileModel: oTileModel }, false);
        },

        // prepares to load data from backend service
        prepareToLoadData: function () {
            var oDynamicTileView = this.getView(),
                oConfig = oDynamicTileView.getModel().getProperty("/config"),
                oTileApi = oDynamicTileView.getViewData().chip,
                sUrl = oConfig.service_url,
                oReferenceResolverService,
                oGetUrlPromise,
                that = this;

            if (!sUrl) {
                this.errorHandlerFn("No service URL given!", true);
                return;
            }

            if (/;o=([;\/?]|$)/.test(sUrl)) { // URL has placeholder segment parameter ;o=
                sUrl = oTileApi.url.addSystemToServiceUrl(sUrl);
            }
            if (this.serviceUrlWithDefaults) {
                // avoid to call resolveUserDefaultParameters again for performance reasons
                oGetUrlPromise = new jQuery.Deferred().resolve({
                    url: this.serviceUrlWithDefaults
                }).promise();
            } else {
                oReferenceResolverService = sap.ushell.Container.getService("ReferenceResolver");
                oGetUrlPromise = oReferenceResolverService.resolveUserDefaultParameters(sUrl);
            }

            oGetUrlPromise
                .done(that.loadData.bind(that))
                .fail(that.errorHandlerFn.bind(that));
        },

        loadData: function (oResult) {
            if (oResult.defaultsWithoutValue && oResult.defaultsWithoutValue.length > 0) {
                this.errorHandlerFn(
                    "The service URL contains User Default(s) with no set value: " + oResult.defaultsWithoutValue.join(", "),
                    true);
                return;
            }

            if (oResult.ignoredReferences && oResult.ignoredReferences.length > 0) {
                this.errorHandlerFn(
                    "The service URL contains invalid Reference(s): " + oResult.ignoredReferences.join(", "),
                    false);
                return;
            }

            var sUrlWithUserDefaults = oResult.url,
                sSAPLogonLanguage,
                sSapClient,
                oRequestHeaders,
                oURI;

            this.serviceUrlWithDefaults = sUrlWithUserDefaults;
            oRequestHeaders = {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                "Accept-Language": (sap.ui && sap.ui.getCore().getConfiguration().getLanguage()) || ""
            };

            if (sap.ushell.Container) {
                sSAPLogonLanguage = sap.ui.getCore().getConfiguration().getSAPLogonLanguage();
                if (sSAPLogonLanguage) {
                    oRequestHeaders["sap-language"] = sSAPLogonLanguage;
                }

                sSapClient = sap.ushell.Container.getLogonSystem() ? sap.ushell.Container.getLogonSystem().getClient() : "";
                oURI = new URI(sUrlWithUserDefaults);
                // Don't add the sap-client if tile url is an absolute url
                if (sSapClient && !oURI.protocol()) {
                    oRequestHeaders["sap-client"] = sSapClient;
                }
            }

            if (sSAPLogonLanguage && sUrlWithUserDefaults.indexOf("sap-language=") === -1) {
                sUrlWithUserDefaults = sUrlWithUserDefaults
                    + (sUrlWithUserDefaults.indexOf("?") >= 0 ? "&" : "?") + "sap-language=" + sSAPLogonLanguage;
            }

            this.oDataRequest = OData.read(
                {
                    requestUri: sUrlWithUserDefaults,
                    headers: oRequestHeaders
                },
                // sucess handler
                this.successHandlerFn.bind(this, sUrlWithUserDefaults),
                this.errorHandlerFn.bind(this)
            ); // End of oData.read
        },

        refreshTile: function () {
            var oView = this.getView(),
                oViewData = oView.getViewData(),
                isVisible = oViewData.chip.visible.isVisible();

            if (isVisible && this.bNeedsRefresh) {
                this.bNeedsRefresh = false;

                if (!this.oDataRequest) {
                    this.prepareToLoadData();
                }
            }
        },

        refeshAfterInterval: function (iRefreshInterval) {
            var that = this;

            this.iNrOfTimerRunning++;

            window.setTimeout(function () {
                that.iNrOfTimerRunning--;
                if (that.iNrOfTimerRunning === 0) {
                    that.bNeedsRefresh = true;
                    that.refreshTile();
                }
            }, iRefreshInterval * 1000);
        },

        refreshHandler: function () {
            this.bNeedsRefresh = true;
            this.refreshTile();
        },

        visibleHandler: function (isVisible) {
            if (isVisible) {
                this.refreshTile();
            } else {
                this.stopRequests();
            }
        }
    });
}, /* bExport= */ false);
