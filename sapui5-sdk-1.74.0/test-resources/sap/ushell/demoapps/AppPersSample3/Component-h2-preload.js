//@ui5-bundle sap/ushell/demo/AppPersSample3/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/AppPersSample3/Component.js":function(){// ${copyright}

(function () {
    "use strict";
    /*global jQuery, sap*/

    // define a root UIComponent which exposes the main view
    jQuery.sap.declare("sap.ushell.demo.AppPersSample3.Component");
    jQuery.sap.require("sap.ui.core.UIComponent");

    // new Component
    sap.ui.core.UIComponent.extend("sap.ushell.demo.AppPersSample3.Component", {

        oMainView : null,

        metadata : {
            manifest: "json"
        },

        createContent : function () {
            this.oMainView = sap.ui.xmlview("sap.ushell.demo.AppPersSample3.App");
            return this.oMainView;
        }
    });

}());
},
	"sap/ushell/demo/AppPersSample3/manifest.json":'{\n    "_version": "1.4.0",\n    "sap.app": {\n        "_version": "1.1.0",\n        "id": "sap.ushell.demo.AppPersSample3",\n        "type": "application",\n        "applicationVersion": {\n            "version": "1.1.0"\n        },\n        "i18n": "i18n/i18n.properties",\n        "title": "{{title}}",\n        "subTitle": "{{subtitle}}",\n        "description": "{{description}}",\n        "ach": "CA-UI2-INT-FE",\n        "crossNavigation": {\n            "inbounds": {\n                "inb" :{\n                    "semanticObject": "Action",\n                    "action": "toappperssample3",\n                    "signature": {\n                        "parameters": {},\n                        "additionalParameters": "allowed"\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "technology": "UI5",\n        "icons": {\n            "icon": "sap-icon://table-chart"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "dependencies": {\n            "minUI5Version":"1.28",\n            "libs": {\n                "sap.m": {\n                    "minVersion": "1.28"\n                }\n            }\n        },\n        "contentDensities": {\n            "compact": false,\n            "cozy": true\n        },\n        "services": {\n            "Personalization": {\n                "factoryName": "sap.ushell.ui5service.Personalization"\n            }\n        }\n    }\n}\n'
},"sap/ushell/demo/AppPersSample3/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demo/AppPersSample3/App.controller.js":["sap/m/TablePersoController.js","sap/ushell/services/Personalization.js"],
"sap/ushell/demo/AppPersSample3/App.view.xml":["sap/m/Button.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/HBox.js","sap/m/Input.js","sap/m/Label.js","sap/m/List.js","sap/m/Panel.js","sap/m/Select.js","sap/m/StandardListItem.js","sap/m/Table.js","sap/m/Text.js","sap/m/Toolbar.js","sap/m/ToolbarSpacer.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppPersSample3/App.controller.js"],
"sap/ushell/demo/AppPersSample3/Component.js":["sap/ui/core/UIComponent.js"]
}});
