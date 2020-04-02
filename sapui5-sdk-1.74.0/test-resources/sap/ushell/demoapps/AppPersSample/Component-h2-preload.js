//@ui5-bundle sap/ushell/demo/AppPersSample/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/AppPersSample/Component.js":function(){/*global sap, jQuery */
// define a root UIComponent which exposes the main view

sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.AppPersSample.Component", {

        oMainView : null,

        metadata : {
            manifest: "json"
        },

        createContent : function () {
            this.oMainView = sap.ui.xmlview("sap.ushell.demo.AppPersSample.App");
            return this.oMainView;
        }

    });

});

},
	"sap/ushell/demo/AppPersSample/manifest.json":'{\n    "_version": "1.4.0",\n\n    "sap.app": {\n        "_version": "1.1.0",\n        "id": "sap.ushell.demo.AppPersSample",\n        "type": "application",\n        "i18n": "i18n/i18n.properties",\n        "title": "{{title}}",\n        "subTitle": "{{subtitle}}",\n        "description": "{{description}}",\n        "applicationVersion": {\n            "version": "1.1.0"\n        },\n        "ach": "CA-UI2-INT-FE",\n        "dataSources": {},\n        "cdsViews": [],\n        "offline": true,\n        "crossNavigation": {\n            "inbounds": {\n                "inb" :{\n                    "semanticObject": "Action",\n                    "action": "toappperssample",\n                    "signature": {\n                        "parameters": {},\n                        "additionalParameters": "allowed"\n                    }\n                }\n            }\n\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n\n        "technology": "UI5",\n        "icons": {\n             "icon": "sap-icon://undefined/favorite"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        },\n        "supportedThemes": [\n            "sap_hcb",\n            "sap_bluecrystal"\n        ],\n        "fullWidth": false\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "resources": {\n            "js": [],\n            "css": [{\n                "uri": "css/custom.css",\n                "id": "sap.ushell.demo.AppPersSample.stylesheet"\n            }]\n        },\n        "dependencies": {\n            "minUI5Version":"1.28",\n            "libs": {\n                "sap.m": {\n                    "minVersion": "1.28"\n                }\n            }\n        },\n        "models": {},\n        "rootView": "",\n        "handleValidation": false,\n        "config": {},\n        "routing": {},\n        "contentDensities": {\n            "compact": false,\n            "cozy": true\n        },\n        "services": {\n            "Personalization": {\n                "factoryName": "sap.ushell.ui5service.Personalization"\n            }\n        }\n    }\n}\n'
},"sap/ushell/demo/AppPersSample/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demo/AppPersSample/App.view.xml":["sap/m/Button.js","sap/m/CheckBox.js","sap/m/Panel.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppPersSample/App.controller.js"],
"sap/ushell/demo/AppPersSample/Component.js":["sap/ui/core/UIComponent.js"]
}});
