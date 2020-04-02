//@ui5-bundle sap/ushell/demotiles/cdm/customtile/Component-h2-preload.js
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
	"sap/ushell/demotiles/cdm/customtile/manifest.json":'{\n    "_version": "1.1.0",\n    "sap.flp": {\n        "type": "tile",\n        "tileSize": "1x1"\n    },\n    "sap.app": {\n        "id": "sap.ushell.demotiles.cdm.customtile",\n        "_version": "1.0.0",\n        "type": "application",\n        "applicationVersion": {\n            "version": "1.0.0"\n        },\n        "title": "Custom Dynamic App Launcher",\n        "description": "Custom Tile",\n        "tags": {\n            "keywords": []\n        },\n        "ach": "CA-UI2-INT-FE",\n        "crossNavigation": {\n            "inbounds": {\n                "Action-customTile": {\n                    "semanticObject": "Action",\n                    "action": "customTile",\n                    "signature": {\n                        "parameters": {}\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "icons": {\n            "icon": "sap-icon://favorite"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "componentName": "sap.ushell.demotiles.cdm.customtile",\n        "dependencies": {\n            "minUI5Version": "1.38",\n            "libs": {\n                "sap.m": {}\n            }\n        },\n        "models": {},\n        "rootView": {\n            "viewName": "sap.ushell.demotiles.cdm.customtile.DynamicTile",\n            "type": "JS"\n        },\n        "handleValidation": false\n    },\n    "custom.namespace.of.tile": {\n        "backgroundImageRelativeToComponent": "custom_tile.png"\n    }\n}'
},"sap/ushell/demotiles/cdm/customtile/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demotiles/cdm/customtile/DynamicTile.controller.js":["sap/ui/core/IconPool.js","sap/ui/thirdparty/datajs.js","sap/ushell/components/tiles/utils.js","sap/ushell/components/tiles/utilsRT.js"]
}});
