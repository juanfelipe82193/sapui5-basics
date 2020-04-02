// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Provides control
sap.ui.define([
    "sap/ushell/services/_VisualizationLoading/VizInstance",
    "sap/ushell/resources",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/GenericTile",
    "sap/m/ImageContent",
    "sap/m/TileContent",
    "sap/m/NumericContent",
    "sap/m/library",
    "sap/ui/core/ComponentContainer",
    "sap/ui/thirdparty/datajs",
    "sap/ui/core/library",
    "sap/ushell/Config",
    "sap/ushell/services/AppType",
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/base/util/restricted/_uniq"
], function (
    VizInstance,
    resources,
    ResourceModel,
    GenericTile,
    ImageContent,
    TileContent,
    NumericContent,
    mobileLibrary,
    ComponentContainer,
    OData,
    coreLibrary,
    Config,
    AppType,
    Log,
    ObjectPath,
    _uniq
) {
    "use strict";

    /* global hasher */

    this.translationBundle = resources.i18n;
    this.TileType = {
        Tile: "tile",
        Link: "link",
        Card: "card"
    };

    /**
     * Constructor for a new
     *
     * @param {string} [sId] The ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] The initial settings for the new control
     * @class A container that arranges Tile controls.
     * @extends sap.ushell.ui.launchpad.VizInstance
     * @constructor
     * @name sap.ushell.ui.launchpad.VizInstanceLocal
     */
    var oVisualization = VizInstance.extend("sap.ushell.ui.launchpad.VizInstanceLocal", /** @lends  sap.ushell.ui.launchpad.VizInstanceLocal.prototype*/ {
        metadata: {
            library: "sap.ushell",
            properties: {
                dataSource: { type: "object", defaultValue: { serviceRefreshInterval: 10000 } }
            }
        },
        renderer: VizInstance.getMetadata().getRenderer()
    });

    /**
     * Updates the tile active state. Inactive dynamic tiles do not send requests
     *
     * @param {boolean} visibility The visualization's updated active state.
     * @since 1.72.0
     */
    oVisualization.prototype.setActive = function (visibility) {
        if (this.getType() !== "sap.ushell.ui.tile.DynamicTile" || this.getDataSource().serviceUrl) {
            return;
        }

        if (this.intervalTimer) {
            window.clearInterval(this.intervalTimer);
            this.intervalTimer = undefined;
        }

        if (visibility) {
            var serviceRefreshInterval = this.getDataSource().serviceRefreshInterval;
            if (serviceRefreshInterval) {
                // interval is configured in seconds, therefore we need to convert it to milliseconds
                serviceRefreshInterval = serviceRefreshInterval * 1000;
            } else {
                // default interval is 10 seconds
                serviceRefreshInterval = 10000;
            }
            this.intervalTimer = window.setInterval(function () {
                OData.read(
                    this.getDataSource().serviceUrl + "?id=" + this.getId() + "&t=" + new Date().getTime(),
                    function () {
                        Log.debug("Dynamic tile service call succeed for tile " + this.getId());
                    },
                    function (sMessage) {
                        Log.debug("Dynamic tile service call failed for tile " + this.getId() + ", error message:" + sMessage);
                    });
            }, serviceRefreshInterval).bind(this);
        }
    };

    /**
     * Triggers a refresh action of a visualization.
     * Typically this action is related to the value presented in dynamic visualizations
     *
     * @since 1.72.0
     */
    oVisualization.prototype.refresh = function () {
        // nothing to do here for the moment as we don't have dynamic data
    };

    oVisualization.prototype._translateTileProperties = function (vizData) {
        /*if (this.translationBundle && i18n && !vizData._isTranslated) {
            var properties = vizData.properties,
                keywords = vizData.keywords;
            properties.title = i18n.getText(properties.title);
            properties.subtitle = i18n.getText(properties.subtitle);
            properties.info = i18n.getText(properties.info);

            if (keywords) {
                for (var keyIdex = 0; keyIdex < keywords.length; keyIdex++) {
                    keywords[keyIdex] = i18n.getText(keywords[keyIdex]);
                }
            }
            vizData._isTranslated = true;
        }*/
    };

    oVisualization.prototype._registerModulePath = function (vizData) {
        var paths = {};
        paths[vizData.namespace.replace(/\./g, "/")] = vizData.path || ".";
        sap.ui.loader.config({ paths: paths });
    };

    oVisualization.prototype._getView = function (vizData) {
        var sError = "unknown error",
            oTileUI,
            sTileType;
        var bIsLink = false;

        // Either we got all the data in the initial init or it is directly passed later on.
        // In case of new data, we use it
        var oVizData = vizData || this.getCatalogTile();

        if (oVizData.isLink) {
            bIsLink = true;
        }

        this._setInitData(oVizData);
        this._translateTileProperties(oVizData);

        if (oVizData.namespace && oVizData.path && oVizData.moduleType) {
            this._registerModulePath(oVizData);
            if (oVizData.moduleType === "UIComponent") {
                oTileUI = new ComponentContainer({
                    component: sap.ui.getCore().createComponent({
                        componentData: { properties: oVizData.properties },
                        name: oVizData.moduleName
                    }),
                    height: "100%",
                    width: "100%"
                });
            } else {
                // XML, JSON, JS, HTML view
                oTileUI = sap.ui.view({
                    viewName: oVizData.moduleName,
                    type: coreLibrary.mvc.ViewType[oVizData.moduleType],
                    viewData: { properties: oVizData.properties },
                    height: "100%"
                });
            }
            return Promise.resolve(oTileUI);
        } else if (oVizData.tileType) {
            // SAPUI5 Control for the standard Static or dynamic tiles
            sTileType = bIsLink ? "Link" : oVizData.tileType;
            if (sTileType) {
                var url = this.getTargetURL();

                try {
                    if (url) {
                        // url may contain binding chars such as '{' and '}' for example in search result app
                        // to avoid unwanted property binding we are setting the url as explicitly
                        // fix csn ticket: 1570026529
                        this.oInnerControl = this._createTileInstance(oVizData, sTileType); // HERE!
                    } else {
                        this.oInnerControl = this._createTileInstance(oVizData, sTileType); // HERE!
                    }
                    this._handleTilePress();
                    this._applyDynamicTileIfoState();

                    return this.oInnerControl;
                } catch (e) {
                    return Promise.resolve(new GenericTile({
                        header: e && (e.name + ": " + e.message) || this.translationBundle.getText("failedTileCreationMsg"),
                        frameType: this._parseTileSizeToGenericTileFormat(oVizData)
                    }));
                }
            } else {
                sError = "TileType: " + this.getType() + " not found!";
            }
        } else {
            sError = "No TileType defined!";
        }
        return Promise.resolve(new GenericTile({
            header: sError,
            frameType: this._parseTileSizeToGenericTileFormat(oVizData)
        }));
    };

    oVisualization.prototype._setInitData = function (vizData) {
        this.setTitle(vizData.properties.title);
        this.setSubtitle(vizData.properties.subtitle);
        this.setFooter(vizData.properties.info);
        this.setIcon(vizData.properties.icon);
        if (vizData.properties.size === "1x2") {
            this.setHeight(1);
            this.setWidth(2);
        } else {
            this.setHeight(1);
            this.setWidth(1);
        }

        var oDatasource = {
            refreshInterval: 10000
        };
        if (vizData.properties.serviceRefreshInterval) {
            oDatasource.refreshInterval = vizData.properties.serviceRefreshInterval;
        }
        if (vizData.properties.serviceUrl) {
            oDatasource.serviceUrl = vizData.properties.serviceUrl;
        }
        this.setDataSource(oDatasource);

        this.setTargetURL(vizData.properties.targetURL || vizData.properties.href);

        this.setType(vizData.tileType);

        var oKeywords = _uniq([
            vizData.title,
            vizData.properties && vizData.properties.subtitle,
            vizData.properties && vizData.properties.info
        ].concat(vizData.keywords || []));
        this.setKeywords(oKeywords.filter(function (n) { return n !== "" && n; }));
    };

    oVisualization.prototype._createTileInstance = function (vizData) {
        var oTileUI,
            oTileImage = new ImageContent({ src: vizData.properties.icon });

        oTileImage.addStyleClass("sapUshellFullWidth");

        switch (vizData.tileType) {
            case "sap.ushell.ui.tile.DynamicTile":
                oTileUI = new GenericTile({
                    header: vizData.properties.title,
                    subheader: vizData.properties.subtitle,
                    frameType: this._parseTileSizeToGenericTileFormat(vizData),
                    tileContent: new TileContent({
                        frameType: this._parseTileSizeToGenericTileFormat(vizData),
                        footer: vizData.properties.info,
                        unit: vizData.properties.numberUnit,
                        // We'll utilize NumericContent for the "Dynamic" content.
                        content: new NumericContent({
                            scale: vizData.properties.numberFactor,
                            value: vizData.properties.numberValue,
                            truncateValueTo: 5, // Otherwise, The default value is 4.
                            indicator: vizData.properties.stateArrow,
                            valueColor: this._parseTileValueColor(vizData.properties.numberState),
                            icon: vizData.properties.icon,
                            width: "100%"
                        })
                    }),
                    press: this._genericTilePressHandler.bind(this)
                });
                break;

            case "sap.ushell.ui.tile.StaticTile":
                oTileUI = new GenericTile({
                    mode: vizData.mode || (vizData.properties.icon ? mobileLibrary.GenericTileMode.ContentMode : mobileLibrary.GenericTileMode.HeaderMode),
                    header: vizData.properties.title,
                    subheader: vizData.properties.subtitle,
                    frameType: this._parseTileSizeToGenericTileFormat(vizData),
                    tileContent: new TileContent({
                        frameType: this._parseTileSizeToGenericTileFormat(vizData),
                        footer: vizData.properties.info,
                        content: oTileImage
                    }),
                    press: this._genericTilePressHandler.bind(this)
                });
                break;

            case "Link":
                oTileUI = new GenericTile({
                    mode: mobileLibrary.GenericTileMode.LineMode,
                    subheader: vizData.properties.subtitle,
                    header: vizData.properties.title,
                    // TODO: The below code is for POC only, should be removed once UI5 provide action buttons for line mode
                    press: function (oEvent) {
                        this._genericTilePressHandler(oEvent);
                    }.bind(this)
                });
                break;

            default:
                var sNewTileType = vizData.tileType.replace(/\./g, "/");
                sap.ui.require([sNewTileType], function () {
                    var TilePrototype = ObjectPath.get(vizData.tileType);
                    oTileUI = new TilePrototype(vizData.properties || {});
                });
        }
        return Promise.resolve(oTileUI);
    };

    oVisualization.prototype._parseTileValueColor = function (tileValueColor) {
        var returnValue = tileValueColor;

        switch (tileValueColor) {
            case "Positive":
                returnValue = "Good";
                break;
            case "Negative":
                returnValue = "Critical";
                break;
        }
        return returnValue;
    };

    oVisualization.prototype._parseTileSizeToGenericTileFormat = function (vizData) {
        return (vizData.properties.size === "1x2") ? "TwoByOne" : "OneByOne";
    };

    // CHECK!
    oVisualization.prototype._handleTilePress = function () {
        if (typeof this.oInnerControl.attachPress === "function") {
            this.oInnerControl.attachPress(function () {
                if (typeof this.oInnerControl.getTargetURL === "function") {
                    var sTargetURL = this.oInnerControl.getTargetURL();
                    if (sTargetURL) {
                        if (sTargetURL[0] === "#") {
                            hasher.setHash(sTargetURL);
                        } else {
                            window.open(sTargetURL, "_blank");
                        }
                    }
                }
            }.bind(this));
        }
    };

    /* CHECK!!!
    * We should change the color of the text in the footer ("info") to be as received in the tile data in the property (infostate).
    * We used to have this functionality when we used the BaseTile. (we added a class which change the text color).
    * Today The GenericTile doesn't support this feature, and it is impossible to change the text color.
    * Since this feature is documented, we should support it - See BCP:1780008386.
    */
    oVisualization.prototype._applyDynamicTileIfoState = function () {
        var fnOrigAfterRendering = this.oInnerControl.onAfterRendering;

        this.oInnerControl.onAfterRendering = function () {
            if (fnOrigAfterRendering) {
                fnOrigAfterRendering.apply(this, arguments);
            }
            var oModel = this.getModel(),
                sDisplayInfoState,
                elDomRef,
                elFooterInfo;

            if (!oModel) {
                return;
            }

            sDisplayInfoState = oModel.getProperty("/data/display_info_state");
            elDomRef = this.getDomRef();
            elFooterInfo = elDomRef.getElementsByClassName("sapMTileCntFtrTxt")[0];

            switch (sDisplayInfoState) {
                case "Negative":
                    // add class for Negative.
                    elFooterInfo.classList.add("sapUshellTileFooterInfoNegative");
                    break;
                case "Neutral":
                    // add class for Neutral.
                    elFooterInfo.classList.add("sapUshellTileFooterInfoNeutral");
                    break;
                case "Positive":
                    // add class for Positive.
                    elFooterInfo.classList.add("sapUshellTileFooterInfoPositive");
                    break;
                case "Critical":
                    // add class for Critical.
                    elFooterInfo.classList.add("sapUshellTileFooterInfoCritical");
                    break;
                default:
                    return;
            }
        };
    };

    // CHECK!
    oVisualization.prototype._genericTilePressHandler = function (oEvent) {
        if (oEvent.getSource().getScope && oEvent.getSource().getScope() === "Display") {
            var targetURL = this.getTargetURL();
            if (targetURL) {
                if (targetURL[0] === "#") {
                    hasher.setHash(targetURL);
                } else {
                    // add the URL to recent activity log
                    var bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
                    if (bLogRecentActivity) {
                        var oRecentEntry = {
                            title: this.getTitle(),
                            appType: AppType.URL,
                            url: targetURL,
                            appId: targetURL
                        };
                        sap.ushell.Container.getRenderer("fiori2").logRecentActivity(oRecentEntry);
                    }
                    window.open(targetURL, "_blank");
                }
            }
        }
    };

    oVisualization.prototype._setVizViewControlPromise = function (vizData) {
        if (vizData) {
            this.oControlPromise = this._getView(vizData);
        } else {
            this.oControlPromise = this._getView();
        }
    };

    return oVisualization;
});
