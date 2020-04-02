//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/tiles/cdm/applauncher/Component.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/library"
], function (UIComponent, coreLibrary) {
    "use strict";

    /* global sap */

    // shortcut for sap.ui.core.mvc.ViewType
    var ViewType = coreLibrary.mvc.ViewType;

    return UIComponent.extend("sap.ushell.components.tiles.cdm.applauncher.Component", {
        metadata: {},

        // create content
        createContent: function () {
            // take tile configuration from manifest - if exists
            // take tile personalization from component properties - if exists
            // merging the tile configuration and tile personalization
            var oComponentData = this.getComponentData();
            var oP13n = oComponentData.properties.tilePersonalization || {};

            // adding sap-system to configuration
            var oStartupParams = oComponentData.startupParameters;
            if (oStartupParams && oStartupParams["sap-system"]) {
                //sap-system is always an array. we take the first value
                oP13n["sap-system"] = oStartupParams["sap-system"][0];
            }

            var oTile = sap.ui.view({
                type: ViewType.JS,
                viewName: "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                viewData: {
                    properties: oComponentData.properties,
                    configuration: oP13n
                },
                async: true
            });

            oTile.loaded().then(function (oView) {
                this._oController = oTile.getController();
            }.bind(this));

            return oTile;
        },

        // interface to be provided by the tile
        tileSetVisualProperties: function (oNewVisualProperties) {
            if (this._oController) {
                this._oController.updatePropertiesHandler(oNewVisualProperties);
            }
        },

        // interface to be provided by the tile
        tileRefresh: function () {
            // empty implementation. currently static tile has no need in referesh handler logic
        },

        // interface to be provided by the tile
        tileSetVisible: function (bIsVisible) {
            // empty implementation. currently static tile has no need in visibility handler logic
        },

        exit: function () {
            this._oController = null;
        }
    });
});
},
	"sap/ushell/components/tiles/cdm/applauncher/StaticTile.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ushell/Config",
    "sap/ushell/services/AppType",
    "sap/ui/model/json/JSONModel",
    "sap/m/library"
], function (
    Controller,
    Config,
    AppType,
    JSONModel,
    mobileLibrary
) {
    "use strict";

    // shortcut for sap.m.GenericTileScope
    var GenericTileScope = mobileLibrary.GenericTileScope;

    /* global hasher */

    return Controller.extend("sap.ushell.components.tiles.cdm.applauncher.StaticTile", {
        _aDoableObject: {},
        _getConfiguration: function () {
            var oConfig = this.getView().getViewData();
            oConfig.properties.sizeBehavior = Config.last("/core/home/sizeBehavior");
            oConfig.properties.wrappingType = Config.last("/core/home/wrappingType");
            return oConfig;
        },

        onInit: function () {
            var oView = this.getView();
            var oModel = new JSONModel();
            oModel.setData(this._getConfiguration());

            // set model, add content
            oView.setModel(oModel);
            // listen for changes of the size behavior, as the end user can change it in the settings,(if enabled)
            this._aDoableObject = Config.on("/core/home/sizeBehavior").do(function (sSizeBehavior) {
                oModel.setProperty("/properties/sizeBehavior", sSizeBehavior);
            });
        },

        onExit: function () {
            this._aDoableObject.off();
        },

        // trigger to show the configuration UI if the tile is pressed in Admin mode
        onPress: function (oEvent) {
            var oTileConfig = this.getView().getViewData().properties;

            if (oEvent.getSource().getScope && oEvent.getSource().getScope() === GenericTileScope.Display) {
                var sTargetURL = this._createTargetUrl();
                if (!sTargetURL) {
                    return;
                }

                if (sTargetURL[0] === "#") {
                    hasher.setHash(sTargetURL);
                } else {
                    // add the URL to recent activity log
                    var bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
                    if (bLogRecentActivity) {
                        var oRecentEntry = {
                            title: oTileConfig.title,
                            appType: AppType.URL,
                            url: oTileConfig.targetURL,
                            appId: oTileConfig.targetURL
                        };
                        sap.ushell.Container.getRenderer("fiori2").logRecentActivity(oRecentEntry);
                    }

                    window.open(sTargetURL, "_blank");
                }
            }
        },

        updatePropertiesHandler: function (oNewProperties) {
            var oTile = this.getView().getContent()[0],
                oTileContent = oTile.getTileContent()[0];

            if (typeof oNewProperties.title !== "undefined") {
                oTile.setHeader(oNewProperties.title);
            }
            if (typeof oNewProperties.subtitle !== "undefined") {
                oTile.setSubheader(oNewProperties.subtitle);
            }
            if (typeof oNewProperties.icon !== "undefined") {
                oTileContent.getContent().setSrc(oNewProperties.icon);
            }
            if (typeof oNewProperties.info !== "undefined") {
                oTileContent.setFooter(oNewProperties.info);
            }
        },

        _createTargetUrl: function () {
            var sTargetURL = this.getView().getViewData().properties.targetURL,
                sSystem = this.getView().getViewData().configuration["sap-system"],
                oUrlParser, oHash;

            if (sTargetURL && sSystem) {
                oUrlParser = sap.ushell.Container.getService("URLParsing");
                // when the navigation url is hash we want to make sure system parameter is in the parameters part
                if (oUrlParser.isIntentUrl(sTargetURL)) {
                    oHash = oUrlParser.parseShellHash(sTargetURL);
                    if (!oHash.params) {
                        oHash.params = {};
                    }
                    oHash.params["sap-system"] = sSystem;
                    sTargetURL = "#" + oUrlParser.constructShellHash(oHash);
                } else {
                    sTargetURL += ((sTargetURL.indexOf("?") < 0) ? "?" : "&") + "sap-system=" + sSystem;
                }
            }
            return sTargetURL;
        },

        _getCurrentProperties: function () {
            var oTile = this.getView().getContent()[0],
                oTileContent = oTile.getTileContent()[0],
                sizeBehavior = Config.last("/core/home/sizeBehavior");

            return {
                title: oTile.getHeader(),
                subtitle: oTile.getSubheader(),
                info: oTileContent.getFooter(),
                icon: oTileContent.getContent().getSrc(),
                sizeBehavior: sizeBehavior
            };
        }
    });
}, /* bExport= */ true);
},
	"sap/ushell/components/tiles/cdm/applauncher/StaticTile.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/GenericTile",
    "sap/m/ImageContent",
    "sap/m/TileContent",
    "sap/ui/core/mvc/JSView"
], function (GenericTile, ImageContent, TileContent) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.tiles.cdm.applauncher.StaticTile", {
        getControllerName: function () {
            return "sap.ushell.components.tiles.cdm.applauncher.StaticTile";
        },
        createContent: function (oController) {
            var oViewDataProperties = this.getViewData().properties;
            this.setHeight("100%");
            this.setWidth("100%");

            return new GenericTile({
                mode: oViewDataProperties.mode || (oViewDataProperties.icon ? "ContentMode" : "HeaderMode"),
                header: oViewDataProperties.title,
                subheader: oViewDataProperties.subtitle,
                size: "Auto",
                sizeBehavior: "{/properties/sizeBehavior}",
                wrappingType: "{/properties/wrappingType}",
                tileContent: new TileContent({
                    size: "Auto",
                    footer: oViewDataProperties.info,
                    content: new ImageContent({ src: oViewDataProperties.icon })
                }),
                press: [oController.onPress, oController]
            });
        }
    });
});
},
	"sap/ushell/components/tiles/cdm/applauncher/i18n/i18n.properties":'\n#XTIT: Title of Static App Launcher\ntitle=Static App Launcher\n',
	"sap/ushell/components/tiles/cdm/applauncher/manifest.json":'{\n    "_version": "1.12.0",\n    "sap.flp": {\n        "type": "tile",\n        "tileSize": "1x1"\n    },\n    "sap.app": {\n        "id": "sap.ushell.components.tiles.cdm.applauncher",\n        "type": "component",\n        "applicationVersion": {\n            "version": "1.0.0"\n        },\n        "title": "{{title}}",\n        "tags": {\n            "keywords": []\n        },\n        "ach": "CA-FE-FLP-COR"\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "technology": "UI5",\n        "icons": {\n            "icon": ""\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        },\n        "supportedThemes": [\n            "sap_hcb",\n            "sap_belize",\n            "sap_belize_plus"\n        ]\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "componentName": "sap.ushell.components.tiles.cdm.applauncher",\n        "dependencies": {\n            "minUI5Version": "1.42",\n            "libs": {\n                "sap.m": {}\n            }\n        },\n        "models": {\n            "i18n": {\n                "type": "sap.ui.model.resource.ResourceModel",\n                "uri": "i18n/i18n.properties"\n            }\n        },\n        "rootView": {\n            "viewName": "sap.ushell.components.tiles.cdm.applauncher.StaticTile",\n            "type": "JS"\n        },\n        "handleValidation": false,\n        "contentDensities": {\n            "compact": true,\n            "cozy": true\n        }\n    }\n}\n'
},"Component-preload"
);
