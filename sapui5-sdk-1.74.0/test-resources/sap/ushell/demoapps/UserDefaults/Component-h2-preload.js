//@ui5-bundle sap/ushell/demo/UserDefaults/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/UserDefaults/Component.js":function(){// define a root UIComponent which exposes the main view
/*global sap, jQuery, JSONModel*/
jQuery.sap.declare("sap.ushell.demo.UserDefaults.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.UserDefaults.Component", {

    metadata : {
        manifest: "json"
    },

    getAutoPrefixId : function() {
        return true;
    },

    createContent : function() {

        var oMainView = sap.ui.view({
            type : sap.ui.core.mvc.ViewType.XML,
            viewName : "sap.ushell.demo.UserDefaults.view.Main"
        });

        return oMainView;
    },

    init : function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

        // this component should automatically initialize the router!
        this.getRouter().initialize();
    }

});

},
	"sap/ushell/demo/UserDefaults/manifest.json":'{\n\t"_version": "1.4.0",\n\n\t"sap.app": {\n\t\t"_version": "1.1.0",\n\t\t"i18n": "messagebundle.properties",\n\t\t"id": "sap.ushell.demo.UserDefaults",\n\t\t"type": "application",\n\t\t"embeddedBy": "",\n\t\t"title": "{{title}}",\n\t\t"description": "{{description}}",\n\t\t"applicationVersion": {\n\t\t\t"version": "1.1.0"\n\t\t},\n\t\t"ach": "CA-UI2-INT-FE",\n\t\t"dataSources": {},\n\t\t"cdsViews": [],\n\t\t"offline": true,\n\t\t"crossNavigation": {\n\t\t\t"inbounds": {\n\t\t\t\t"inb" :{\n\t\t\t\t\t"semanticObject": "Action",\n\t\t\t\t\t"action": "toUserDefaults",\n\t\t\t\t\t"signature": {\n\t\t\t\t\t\t"parameters": {\n\t\t\t\t\t\t\t  "GLAccount": {\n                                    "defaultValue": {\n                                        "value": "UserDefault.GLAccount",\n                                        "format": "reference"\n                                    },\n                                    "filter": {\n                                        "value": "\\\\d+",\n                                        "format": "regexp"\n                                    },\n                                    "required": false\n                                },\n\t\t\t\t\t\t\t  "CostCenter": {\n                                    "filter": {\n                                        "value": "UserDefault.CostCenter",\n                                        "format": "reference"\n                                    },\n                                    "required": false\n                                }\n\t\t\t\t\t\t},\n\t\t\t\t\t\t"additionalParameters": "allowed"\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t}\n\t},\n\t"sap.ui": {\n\t\t"_version": "1.1.0",\n\n\t\t"technology": "UI5",\n\t\t"icons": {\n\t\t\t "icon": "sap-icon://undefined/favorite"\n\t\t},\n\t\t"deviceTypes": {\n\t\t\t"desktop": true,\n\t\t\t"tablet": true,\n\t\t\t"phone": true\n\t\t},\n\t\t"supportedThemes": [\n\t\t\t"sap_hcb",\n\t\t\t"sap_bluecrystal"\n\t\t],\n\t\t"fullWidth": false\n\t},\n\t"sap.ui5": {\n\t\t"_version": "1.1.0",\n\t\t"resources": {\n\t\t\t"js": []\n\t\t},\n\t\t"dependencies": {\n\t\t\t"minUI5Version":"1.28",\n\t\t\t"libs": {\n\t\t\t\t"sap.m": {\n\t\t\t\t\t"minVersion": "1.28"\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t"models": {},\n\t\t"rootView": {\n\t\t\t"viewName": "sap.ushell.demo.UserDefaults.view.Main",\n\t\t\t"type": "XML"\n\t\t},\n\t\t"handleValidation": false,\n\t\t"config": {},\n\t\t"routing": {\n\t\t\t\t"config": {\n\t\t\t\t\t"routerClass": "sap.m.routing.Router",\n\t\t\t\t\t"viewType": "XML",\n\t\t\t\t\t"viewPath": "sap.ushell.demo.UserDefaults.view",\n\t\t\t\t\t"controlId": "app",\n\t\t\t\t\t"controlAggregation": "detailPages",\n\t\t\t\t\t"async": true\n\t\t\t\t},\n\t\t\t\t"routes": [\n\t\t\t\t\t{\n\t\t\t\t\t\t"pattern": "SimpleEditor",\n\t\t\t\t\t\t"name": "toEditor",\n\t\t\t\t\t\t"target": "editor"\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\t"pattern": "UsedParams",\n\t\t\t\t\t\t"name": "toUsedParams",\n\t\t\t\t\t\t"target": "usedParams"\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\t"pattern": "ShowEvents",\n\t\t\t\t\t\t"name": "toShowEvents",\n\t\t\t\t\t\t"target": "showEvents"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t"targets": {\n\t\t\t\t\t"editor": {\n\t\t\t\t\t\t"viewName": "SimpleEditor"\n\t\t\t\t\t},\n\t\t\t\t\t"usedParams": {\n\t\t\t\t\t\t"viewName": "UsedParams"\n\t\t\t\t\t},\n\t\t\t\t\t"showEvents": {\n\t\t\t\t\t\t"viewName": "ShowEvents"\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t},\n\t\t"contentDensities": {\n\t\t\t"compact": false,\n\t\t\t"cozy": true\n\t\t}\n\t}\n}'
},"sap/ushell/demo/UserDefaults/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demo/UserDefaults/Component.js":["sap/ui/core/UIComponent.js"],
"sap/ushell/demo/UserDefaults/view/List.view.xml":["sap/m/List.js","sap/m/Page.js","sap/m/StandardListItem.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/UserDefaults/view/List.controller.js"],
"sap/ushell/demo/UserDefaults/view/Main.view.xml":["sap/m/SplitApp.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/UserDefaults/view/Main.controller.js"],
"sap/ushell/demo/UserDefaults/view/ShowEvents.view.xml":["sap/m/MessageStrip.js","sap/m/Page.js","sap/m/Text.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/VerticalLayout.js","sap/ushell/demo/UserDefaults/view/ShowEvents.controller.js"],
"sap/ushell/demo/UserDefaults/view/SimpleEditor.view.xml":["sap/m/Button.js","sap/m/HBox.js","sap/m/Input.js","sap/m/InputListItem.js","sap/m/List.js","sap/m/MessageStrip.js","sap/m/Page.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/VerticalLayout.js","sap/ushell/demo/UserDefaults/view/SimpleEditor.controller.js"],
"sap/ushell/demo/UserDefaults/view/UsedParams.view.xml":["sap/m/Button.js","sap/m/InputListItem.js","sap/m/List.js","sap/m/MessageStrip.js","sap/m/Page.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/VerticalLayout.js","sap/ushell/demo/UserDefaults/view/UsedParams.controller.js"]
}});
