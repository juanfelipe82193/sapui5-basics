//@ui5-bundle sap/ushell/demotiles/cdm/customtile/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demotiles/cdm/customtile/Component.js":function(){// ${copyright}
(function () {
    "use strict";
    /* global jQuery, sap, window */

    jQuery.sap.declare("sap.ushell.demotiles.cdm.customtile.Component");

    sap.ui.define([
        "sap/ui/core/UIComponent"
    ], function (UIComponent) {
        return UIComponent.extend("sap.ushell.demotiles.cdm.customtile.Component", {
            metadata: {
                "manifest": "json"
            },

            // new API
            tileSetVisible: function (bNewVisibility) {
                // forward to controller
                this._controller.visibleHandler(bNewVisibility);
            },

            // new API
            tileRefresh: function () {
                // forward to controller
                this._controller.refreshHandler(this._controller);
            },

            // new API
            tileSetVisualProperties: function (oNewVisualProperties) {
                // forward to controller
                this._controller.setVisualPropertiesHandler(oNewVisualProperties);
            },

            createContent: function () {
                // For better testing of the core-ext-light load logic
                // some dependencies from it are required here.
                // The core-ext-light should always be loaded before this file,
                // so in the network trace you should not see request for the files below.
                //
                // Note: during local development with the flp_proxy
                // this has the effect, that those files are always loaded
                // independent if core-ext-light was already loaded or not.
                // This is because core-ext-light is empty locally so that
                // local resources are not "hidden" by it.
                sap.ui.require([
                    "sap/m/Table",
                    "sap/m/TimePicker",
                    "sap/m/Tree"
                ], function () {
                    console.log("modules from core-ext-light.js have been loaded");
                });

                var oTile = sap.ui.view({
                    viewName: "sap.ushell.demotiles.cdm.customtile.DynamicTile",
                    type: sap.ui.core.mvc.ViewType.JS
                });

                this._controller = oTile.getController();

                return oTile;
            }
        });
    });

}());
},
	"sap/ushell/demotiles/cdm/customtile/DynamicTile.controller.js":function(){// ${copyright}
(function () {
    "use strict";
    /*global jQuery, OData, sap, setTimeout, hasher */

    var S_NAMESPACE = "sap.ushell.demotiles.cdm.customtile";

    sap.ui.getCore().loadLibrary("sap.m");
    jQuery.sap.require("sap.ui.core.IconPool");
    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.components.tiles.utils");
    jQuery.sap.require("sap.ushell.components.tiles.utilsRT");
    jQuery.sap.require("sap.ui.thirdparty.datajs");

    sap.ui.controller(S_NAMESPACE + ".DynamicTile", {
        // handle to control/cancel browser's setTimeout()
        timer : null,
        // handle to control/cancel data.js OData.read()
        oDataRequest : null,
        _getConfiguration : function(oComponentData) {

            var oProperties = oComponentData.properties || {},
                oStartUpProperties = oComponentData.startupParameters || {},
                oConfig = {};

            // fill config as expected by dynamic tile
            oConfig.display_title_text = oProperties.title || "";
            oConfig.display_subtitle_text = oProperties.subtitle || "";
            oConfig.display_icon_url = oProperties.icon || "";
            oConfig.navigation_target_url = oProperties.targetURL || "";
//            oConfig.navigation_semantic_object = oConfig.navigation_semantic_object || "";
//            oConfig.navigation_semantic_action = oConfig.navigation_semantic_action || "";
//            oConfig.navigation_semantic_parameters = oConfig.navigation_semantic_parameters || "";
//            oConfig.navigation_use_semantic_object = (oConfig.navigation_use_semantic_object === false ? false : true);

            // indicator data source
            if (oProperties.indicatorDataSource) {
                oConfig.service_url = oProperties.indicatorDataSource.path;
                oConfig.service_refresh_interval = oProperties.indicatorDataSource.refresh;
            }
//            oConfig.display_number_unit = oConfig.display_number_unit || "";
//            oConfig.display_number_factor = oConfig.display_number_factor || "";

            // If form factors were not configured yet, use default values
            oConfig.form_factors = { // see tile utils getDefaultFormFactors
                "appDefault": false,
                "manual": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "defaultParam": true
            };

            oConfig.desktopChecked = oConfig.form_factors.manual.desktop;
            oConfig.tabletChecked = oConfig.form_factors.manual.tablet;
            oConfig.phoneChecked = oConfig.form_factors.manual.phone;
            oConfig.manualFormFactor = !(oConfig.form_factors.appDefault) && oConfig.editable;
            oConfig.appFormFactor = oConfig.form_factors.appDefault;

            // tileConfiguration from CDM/App Descriptor (may be personalized)
            if (oProperties.tilePersonalization) {
                oConfig.display_info_text = oProperties.tilePersonalization["info_text"];
            }

            // sap-system is coming from the Start Up Parameters (like for every Fiori app)
            if (oStartUpProperties["sap-system"]) {
                oConfig.sap_system = oStartUpProperties["sap-system"];
            }

            return oConfig;
        },
        onInit: function () {
            var oComponentData = this.getOwnerComponent().getComponentData(),
                oView = this.getView(),
                oConfig = this._getConfiguration(oComponentData),
                oModel,
                sNavigationTargetUrl = oConfig.navigation_target_url,
                sSystem = oConfig.sap_system,
                sBackgroundImageUrl,
                oHash,
                that = this,
                oUrlParser;
            this.bIsDataRequested = true; //false;

            if (sSystem) { // propagate system to target application
                oUrlParser = sap.ushell.Container.getService("URLParsing");
                // when the navigation url is hash we want to make sure system parameter is in the parameters part
                if (oUrlParser.isIntentUrl(sNavigationTargetUrl)) {
                    oHash = oUrlParser.parseShellHash(sNavigationTargetUrl) ;
                    if (!oHash.params) {
                        oHash.params = {};
                    }
                    oHash.params["sap-system"] = sSystem;
                    sNavigationTargetUrl = "#"+ oUrlParser.constructShellHash(oHash);
                } else {
                    sNavigationTargetUrl += ((sNavigationTargetUrl.indexOf("?") < 0) ? "?" : "&")
                        + "sap-system=" + sSystem;
                }
            }
            this.navigationTargetUrl = sNavigationTargetUrl;

            // read background image
            var oApplicationRoot = jQuery.sap.getModulePath(S_NAMESPACE);
            sBackgroundImageUrl = oApplicationRoot + "/" +
                this.getOwnerComponent().getManifestEntry("custom.namespace.of.tile").backgroundImageRelativeToComponent;

            /*
             * Model of the applauncher tile consisting of
             *          config (tile configuration),
             *          data (dyanmic data read from a data source)
             *          nav (target URL set to '' in case of Admin UI), and
             *          search (highlight terms)
             */
            oModel = new sap.ui.model.json.JSONModel({
                config: oConfig,
                data: sap.ushell.components.tiles.utilsRT.getDataToDisplay(oConfig, {
                    number: ( !this.bIsDataRequested ? 0 : "...")
                }),
                backgroundImage: sBackgroundImageUrl,
                nav: {navigation_target_url: sNavigationTargetUrl},
                search: { //TODO remove
                    display_highlight_terms: []
                }
            });
            oView.setModel(oModel);

            //adopt tileSize behavior and updates
            sap.ushell.Container.getServiceAsync("Configuration").then( function (oService) {
                oService.attachSizeBehaviorUpdate( function(sSizeBehavior) {
                    oModel.setProperty("/sizeBehavior", sSizeBehavior);
                }.bind(that));
            });

            // implement types contact
            // default is Tile
            var oTileControl = this.getView().getTileControl();
            this.getView().addContent(oTileControl);

            // Do not retrieve data initially, wait until the visible handler is called
            // otherwise requests may be triggered which are canceled immediately again.
        },

        // loads data once if not in configuration mode
        refreshHandler: function (oDynamicTileController) {
            oDynamicTileController.loadData(0);
        },

        // load data in place in case setting visibility from false to true
        // with no additional timer registered
        visibleHandler: function (isVisible) {
            var oView = this.getView(),
                oConfig = oView.getModel().getProperty("/config"),
                nservice_refresh_interval = oConfig.service_refresh_interval;
            if (isVisible) {
                if (!this.bIsDataRequested) {
                    //tile is visible and data wasn't requested yet
                    this.refreshHandler(this);
                }
                if (nservice_refresh_interval) {
                    //tile is visible and the refresh interval isn't set to 0
                    this.refreshHandler(this);
                }
            } else {
                this.stopRequests();
            }
        },

        setVisualPropertiesHandler: function (oNewProperties) {
            var bChanged = false,
                oData = this.getView().getModel().getProperty("/data");

            if (oNewProperties.title) {
                oData.display_title_text = oNewProperties.title;
                bChanged = true;
            }
            if (oNewProperties.subTitle) {
                oData.display_subtitle_text = oNewProperties.subTitle;
                bChanged = true;
            }
            if (oNewProperties.icon) {
                oData.display_icon_url = oNewProperties.icon;
                bChanged = true;
            }

            if (bChanged) {
                // update model if something changed
                this.getView().getModel().setProperty("/data", oData);
            }
        },

        // convenience function to stop browser's timeout and OData calls
        stopRequests: function () {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            if (this.oDataRequest) {
                try {
                    this.oDataRequest.abort();
                } catch (e) {
                    jQuery.sap.log.warning(e.name,e.message);
                }
            }
        },
        // destroy handler stops requests
        onExit: function () {
            this.stopRequests();
        },
        // trigger to show the configuration UI if the tile is pressed in Admin mode
        onPress: function () {
            var oModel = this.getView().getModel(),
                sTargetUrl = oModel.getProperty("/nav/navigation_target_url");

            if (sTargetUrl) {
                if (sTargetUrl[0] === '#') {
                    hasher.setHash(sTargetUrl);
                } else {
                    window.open(sTargetUrl, '_blank');
                }
            }
        },
        // dynamic data updater
        onUpdateDynamicData: function () {
            var oView = this.getView(),
                oConfig = oView.getModel().getProperty("/config"),
                nservice_refresh_interval = oConfig.service_refresh_interval;
            if (!nservice_refresh_interval) {
                nservice_refresh_interval = 0;
            } else if (nservice_refresh_interval < 10) {
                // log in English only
                jQuery.sap.log.warning(
                    "Refresh Interval " + nservice_refresh_interval
                    + " seconds for service URL " + oConfig.service_url
                    + " is less than 10 seconds, which is not supported. "
                    + "Increased to 10 seconds automatically.",
                    null,
                    "sap.ushell.components.tiles.applauncherdynamic.DynamicTile.controller"
                );
                nservice_refresh_interval = 10;
            }
            if (oConfig.service_url) {
                this.loadData(nservice_refresh_interval);
            }
        },
        extractData : function (oData) {
            var name,
                aKeys = ["results", "icon", "title", "number", "numberUnit", "info", "infoState", "infoStatus", "targetParams", "subtitle", "stateArrow", "numberState", "numberDigits", "numberFactor"];

            if (typeof oData === "object" && Object.keys(oData).length === 1) {
                name = Object.keys(oData)[0];
                if (jQuery.inArray(name, aKeys) === -1) {
                    return oData[name];
                }
            }
            return oData;
        },

        successHandleFn: function (oResult) {
            var oConfig = this.getView().getModel().getProperty("/config");
            this.oDataRequest = undefined;
            var oData = oResult,
                oDataToDisplay;
            if (typeof oResult === "object") {
                var uriParamInlinecount = jQuery.sap.getUriParameters(oConfig.service_url).get("$inlinecount");
                if (uriParamInlinecount && uriParamInlinecount === "allpages") {
                    oData = {number: oResult.__count};
                } else {
                    oData = this.extractData(oData);
                }
            } else if (typeof oResult === "string") {
                oData = {number: oResult};
            }


            // TODO remove entire if as only needed for CDM POC to polish output
            if (oData && oData.results && oData.results[0] && typeof oData.results[0].number === "number") {
                oData = {
                    // remove subtitle + info
                    "number": oData.results[0].number % 101, // make the number smaller
                    "numberState": oData.numberState
                };
            }

            oDataToDisplay = sap.ushell.components.tiles.utilsRT.getDataToDisplay(oConfig, oData);

            // set data to display
            this.getView().getModel().setProperty("/data", oDataToDisplay);

            // rewrite target URL
            this.getView().getModel().setProperty("/nav/navigation_target_url",
                sap.ushell.components.tiles.utilsRT.addParamsToUrl(
                    this.navigationTargetUrl,
                    oDataToDisplay
                ));
        },

        // error handler
        errorHandlerFn: function (oMessage) {
            var oConfig = this.getView().getModel().getProperty("/config");
            this.oDataRequest = undefined;
            var sMessage = oMessage && oMessage.message ? oMessage.message : oMessage,
                oResourceBundle = sap.ushell.components.tiles.utils.getResourceBundleModel()
                    .getResourceBundle();
            if (oMessage.response) {
                sMessage += " - " + oMessage.response.statusCode + " "
                    + oMessage.response.statusText;
            }
            // log in English only
            jQuery.sap.log.error(
                "Failed to update data via service "
                    + oConfig.service_url
                    + ": " + sMessage,
                null,
                "sap.ushell.components.tiles.applauncherdynamic.DynamicTile"
            );
            this.getView().getModel().setProperty("/data",
                sap.ushell.components.tiles.utilsRT.getDataToDisplay(oConfig, {
                    number: "???",
                    info: oResourceBundle.getText("dynamic_data.error"),
                    infoState: "Critical"
                })
            );
        },

        // loads data from backend service
        loadData: function (nservice_refresh_interval) {
            var oDynamicTileView = this.getView(),
                oConfig = oDynamicTileView.getModel().getProperty("/config"),
                sUrl = oConfig.service_url,
                that = this,
                sLanguage,
                iSapClient;
            if (!sUrl) {
                return;
            }
            // TODO still needed?
//            if (/;o=([;\/?]|$)/.test(sUrl)) { // URL has placeholder segment parameter ;o=
//                sUrl = oTileApi.url.addSystemToServiceUrl(sUrl);
//            }
            //set the timer if required
            if (nservice_refresh_interval > 0) {
                // log in English only
                jQuery.sap.log.info(
                    "Wait " + nservice_refresh_interval + " seconds before calling "
                    + oConfig.service_url + " again",
                    null,
                    "sap.ushell.components.tiles.applauncherdynamic.DynamicTile.controller"
                );
                // call again later
                this.timer = setTimeout(that.loadData.bind(that, nservice_refresh_interval, false), (nservice_refresh_interval * 1000));
            }

            // Verify the the Tile visibility is "true" in order to issue an oData request
//            if (oTileApi.visible.isVisible() && !that.oDataRequest) { TODO new api

            if (sap.ushell.Container) {
                sLanguage = sap.ushell.Container.getUser().getLanguage();
                iSapClient = sap.ushell.Container.getLogonSystem() ? sap.ushell.Container.getLogonSystem().getClient() : "";
            }

            if ((sLanguage) && (sUrl.indexOf("sap-language=") == -1)) {
                sUrl = sUrl + (sUrl.indexOf("?") >= 0 ? "&" : "?") + "sap-language=" + sLanguage;
            }
                this.bIsDataRequested = true;
                that.oDataRequest = OData.read(
                    {
                        requestUri: sUrl,
                        headers: {
                            "Cache-Control": "no-cache, no-store, must-revalidate",
                            "Pragma": "no-cache",
                            "Expires": "0",
                            "Accept-Language" :(sap.ui && sap.ui.getCore().getConfiguration().getLanguage()) || "",
                            "sap-client" : (iSapClient || ""),
                            "sap-language" : (sLanguage || "")
                        }
                    },
                    // sucess handler
                    this.successHandleFn.bind(this),
                    this.errorHandlerFn.bind(this)
                ); // End of oData.read
//            }
        }
    });
}());
},
	"sap/ushell/demotiles/cdm/customtile/DynamicTile.view.js":function(){// ${copyright}

(function () {
    "use strict";

    sap.ui.jsview("sap.ushell.demotiles.cdm.customtile.DynamicTile", {
        getControllerName: function () {
            return "sap.ushell.demotiles.cdm.customtile.DynamicTile";
        },

        createContent: function () {
            this.setHeight("100%");
            this.setWidth("100%");
        },

        getTileControl: function () {
            jQuery.sap.require("sap.m.GenericTile");
            var oController = this.getController();

            var oTile = new sap.m.GenericTile({
                mode: sap.m.GenericTileMode.ContentMode,
                header: "{/data/display_title_text}",
                subheader: "{/data/display_subtitle_text}",
                size: "Auto",
                sizeBehavior: "{/sizeBehavior}",
                // custom tile tag:
                backgroundImage: "{/backgroundImage}",
                tileContent: [new sap.m.TileContent({
                    size: "Auto",
                    footer: "{/data/display_info_text}",
                    unit: "{/data/display_number_unit}",
                    // We'll utilize NumericContent for the "Dynamic" content.
                    content: [new sap.m.NumericContent({
                        scale: "{/data/display_number_factor}",
                        value: "{/data/display_number_value}",
                        truncateValueTo: 5, // Otherwise, The default value is 4.
                        indicator: "{/data/display_state_arrow}",
                        valueColor: "{/data/display_number_state}",
                        icon: "{/data/display_icon_url}",
                        width: "100%"
                    })]
                })],
                press: [oController.onPress, oController]
            });
            return oTile;
        }
    });
}());
},
	"sap/ushell/demotiles/cdm/customtile/manifest.json":'{\n    "_version": "1.1.0",\n    "sap.flp": {\n        "type": "tile",\n        "tileSize": "1x1"\n    },\n    "sap.app": {\n        "id": "sap.ushell.demotiles.cdm.customtile",\n        "_version": "1.0.0",\n        "type": "application",\n        "applicationVersion": {\n            "version": "1.0.0"\n        },\n        "title": "Custom Dynamic App Launcher",\n        "description": "Custom Tile",\n        "tags": {\n            "keywords": []\n        },\n        "ach": "CA-UI2-INT-FE",\n        "crossNavigation": {\n            "inbounds": {\n                "Action-customTile": {\n                    "semanticObject": "Action",\n                    "action": "customTile",\n                    "signature": {\n                        "parameters": {}\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "icons": {\n            "icon": "sap-icon://favorite"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "componentName": "sap.ushell.demotiles.cdm.customtile",\n        "dependencies": {\n            "minUI5Version": "1.38",\n            "libs": {\n                "sap.m": {}\n            }\n        },\n        "models": {},\n        "rootView": {\n            "viewName": "sap.ushell.demotiles.cdm.customtile.DynamicTile",\n            "type": "JS"\n        },\n        "handleValidation": false\n    },\n    "custom.namespace.of.tile": {\n        "backgroundImageRelativeToComponent": "custom_tile.png"\n    }\n}'
},"sap/ushell/demotiles/cdm/customtile/Component-preload"
);
