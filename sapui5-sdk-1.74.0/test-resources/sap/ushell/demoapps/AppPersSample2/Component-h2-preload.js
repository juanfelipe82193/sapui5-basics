//@ui5-bundle sap/ushell/demo/AppPersSample2/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/AppPersSample2/Component.js":function(){// ${copyright}
// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.AppPersSample2.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.AppPersSample2.Component", {

    oMainView : null,

    metadata : {
        manifest: "json"
    },

    createContent : function () {
        this.oMainView = sap.ui.xmlview("sap.ushell.demo.AppPersSample2.App");
        return this.oMainView;
    }

});

},
	"sap/ushell/demo/AppPersSample2/manifest.json":'{\r\n  "_version": "1.4.0",\r\n  "sap.app": {\r\n    "_version": "1.1.0",\r\n    "id": "sap.ushell.demo.AppPersSample2",\r\n    "type": "application",\r\n    "i18n": "i18n/i18n.properties",\r\n    "title": "{{title}}",\r\n    "subTitle": "{{subtitle}}",\r\n    "description": "{{description}}",\r\n    "applicationVersion": {\r\n      "version": "1.1.0"\r\n    },\r\n    "ach": "CA-UI2-INT-FE",\r\n    "crossNavigation": {\r\n      "inbounds": {\r\n        "inb" :{\r\n          "semanticObject": "Action",\r\n          "action": "toappperssample2",\r\n          "signature": {\r\n            "parameters": {},\r\n            "additionalParameters": "allowed"\r\n          }\r\n        }\r\n      }\r\n    }\r\n  },\r\n  "sap.ui": {\r\n    "_version": "1.1.0",\r\n    "technology": "UI5",\r\n    "icons": {\r\n      "icon": "sap-icon://provision"\r\n    },\r\n    "deviceTypes": {\r\n      "desktop": true,\r\n      "tablet": true,\r\n      "phone": true\r\n    }\r\n  },\r\n  "sap.ui5": {\r\n    "_version": "1.1.0",\r\n    "dependencies": {\r\n      "minUI5Version":"1.28",\r\n      "libs": {\r\n        "sap.m": {\r\n          "minVersion": "1.28"\r\n        }\r\n      }\r\n    },\r\n    "contentDensities": {\r\n      "compact": false,\r\n      "cozy": true\r\n    },\r\n    "services": {\r\n      "Personalization": {\r\n        "factoryName": "sap.ushell.ui5service.Personalization"\r\n      }\r\n    }\r\n  }\r\n}'
},"sap/ushell/demo/AppPersSample2/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demo/AppPersSample2/App.controller.js":["sap/ushell/demo/AppPersSample2/util/TablePersonalizer.js"],
"sap/ushell/demo/AppPersSample2/App.view.xml":["sap/m/Button.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Label.js","sap/m/Panel.js","sap/m/Table.js","sap/m/Text.js","sap/m/Toolbar.js","sap/m/ToolbarSpacer.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppPersSample2/App.controller.js"],
"sap/ushell/demo/AppPersSample2/Component.js":["sap/ui/core/UIComponent.js"],
"sap/ushell/demo/AppPersSample2/util/TablePersonalizer.js":["sap/m/TablePersoController.js","sap/ushell/services/Personalization.js"]
}});
