//@ui5-bundle sap/ushell/demotiles/cdm/newstile/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/demotiles/cdm/newstile/Component.js":function(){// ${copyright}
(function() {
"use strict";
/* global jQuery, sap, window */

jQuery.sap.declare("sap.ushell.demotiles.cdm.newstile.Component");

sap.ui.define([
               "sap/ui/core/UIComponent"
    ], function(UIComponent) {
        return UIComponent.extend("sap.ushell.demotiles.cdm.newstile.Component", {
            metadata : {
                "manifest": "json"
            },

            // new API (optional)
            tileSetVisible : function(bNewVisibility) {
                // forward to controller
                // not implemented
                //this._controller.visibleHandler(bNewVisibility);
            },

            // new API (optional)
            tileRefresh : function() {
                // forward to controller
                this._controller.refresh(this._controller);
            },

            // new API (mandatory)
            tileSetVisualProperties : function(oNewVisualProperties) {
                // forward to controller
                // NOP: visual properties are not displayed on the tile
            },

            createContent : function() {
                var oTile = sap.ui.view({
                    viewName : "sap.ushell.demotiles.cdm.newstile.NewsTile",
                    type : sap.ui.core.mvc.ViewType.JS,
                    async: true
                });

                oTile.loaded().then(function (oView) {
                    this._controller = oTile.getController();
                }.bind(this));

                return oTile;
            }
        });
});
}());
},
	"sap/ushell/demotiles/cdm/newstile/manifest.json":'{\n    "_version": "1.1.0",\n    "sap.flp": {\n        "type": "tile",\n        "tileSize": "1x2"\n    },\n    "sap.app": {\n        "id": "sap.ushell.demotiles.cdm.newstile",\n        "_version": "1.0.0",\n        "i18n": "news_tile.properties",\n        "type": "application",\n        "applicationVersion": {\n            "version": "1.0.0"\n        },\n        "title": "{{title}}",\n        "description": "{{description}}",\n        "tags": {\n            "keywords": [\n                "{{keyword.news}}", "{{keyword.feeds}}", "RSS"\n            ]\n        },\n        "ach": "CA-UI2-INT-FE",\n        "crossNavigation": {\n            "inbounds": {\n                "My-newsTile": {\n                    "semanticObject": "My",\n                    "action": "newsTile",\n                    "signature": {\n                        "parameters": {}\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "icons": {\n            "icon": "sap-icon://favorite"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        },\n        "supportedThemes": [\n            "sap_hcb",\n            "sap_bluecrystal"\n        ]\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "componentName": "sap.ushell.demotiles.cdm.newstile",\n        "config": {\n            "defaultImage": "",\n            "useDefaultImage": false,\n            "cycleInterval": 7000,\n            "refreshInterval": 0,\n            "feed1": "../../../../sap/ushell/test/feeds/fakenews.rss",\n            "feed2": "",\n            "feed3": "",\n            "feed4": "",\n            "feed5": "",\n            "feed6": "",\n            "feed7": "",\n            "feed8": "",\n            "feed9": "",\n            "feed10": "",\n            "eFilter1": "",\n            "eFilter2": "",\n            "eFilter3": "",\n            "eFilter4": "",\n            "eFilter5": "",\n            "iFilter1": "",\n            "iFilter2": "",\n            "iFilter3": "",\n            "iFilter4": "",\n            "iFilter5": ""\n        },\n        "dependencies": {\n            "minUI5Version": "1.38",\n            "libs": {\n                "sap.m": {}\n            }\n        },\n        "models": {\n            "i18n": {\n                "type": "sap.ui.model.resource.ResourceModel",\n                "uri": "news_tile.properties"\n            }\n        },\n        "rootView": {\n            "viewName": "sap.ushell.demotiles.cdm.newstile.NewsTile",\n            "type": "JS"\n        },\n        "handleValidation": false\n    }\n}'
},"sap/ushell/demotiles/cdm/newstile/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demotiles/cdm/newstile/NewsTile.controller.js":["sap/ushell/demotiles/cdm/newstile/NewsTileUtils.js"],
"sap/ushell/demotiles/cdm/newstile/NewsTile.view.js":["sap/suite/ui/commons/FeedItem.js","sap/suite/ui/commons/FeedTile.js","sap/suite/ui/commons/util/FeedAggregator.js","sap/ui/model/Sorter.js","sap/ushell/demotiles/cdm/newstile/NewsTileUtils.js"]
}});
