//@ui5-bundle sap/ushell/demo/bookmark/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/bookmark/Component.js":function(){/*
 * Copyright (C) 2015 SAP AG or an SAP affiliate company. All rights reserved
 */

//define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.bookmark.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

//new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.bookmark.Component", {
    metadata : {
        "manifest": "json"
    },

    /**
     *  Initialize the application
     *  @returns {sap.ui.core.Control} the content
     */
    createContent: function() {
        jQuery.sap.log.info("sap.ushell.demo.bookmark: Component.createContent");
        this.oMainView = sap.ui.xmlview("sap.ushell.demo.bookmark.bookmark");
        return this.oMainView;
    }

});
},
	"sap/ushell/demo/bookmark/manifest.json":'{\n    "_version": "1.4.0",\n    "sap.app": {\n        "id": "sap.ushell.demo.bookmark",\n        "_version": "1.1.0",\n        "i18n": "i18n/i18n.properties",\n        "type": "application",\n        "applicationVersion": {\n            "version": "1.0.0"\n        },\n        "title": "{{title}}",\n        "description": "{{description}}",\n        "tags": {\n            "keywords": [\n                "{{keyword.sample}}",\n                "{{keyword.demo}}",\n                "{{keyword.flp}}"\n            ]\n        },\n        "ach": "CA-UI2-INT-FE",\n        "crossNavigation": {\n            "inbounds": {\n                "inb": {\n                    "semanticObject": "Action",\n                    "action": "toBookmark",\n                    "signature": {\n                        "parameters": {},\n                        "additionalParameters": "allowed"\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "technology": "UI5",\n        "icons": {\n            "icon": "sap-icon://favorite"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        },\n        "supportedThemes": [\n            "sap_hcb",\n            "sap_bluecrystal"\n        ]\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "dependencies": {\n            "minUI5Version": "1.28",\n            "libs": {\n                "sap.m": {\n                    "minVersion": "1.28"\n                }\n            }\n        },\n        "models": {\n            "i18n": {\n                "type": "sap.ui.model.resource.ResourceModel",\n                "uri": "i18n/i18n.properties"\n            }\n        },\n        "rootView": {\n            "viewName": "sap.ushell.demo.bookmark.bookmark",\n            "type": "XML"\n        },\n        "handleValidation": false,\n        "contentDensities": {\n            "compact": false,\n            "cozy": true\n        }\n    }\n}'
},"sap/ushell/demo/bookmark/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demo/bookmark/Component.js":["sap/ui/core/UIComponent.js"],
"sap/ushell/demo/bookmark/bookmark.view.xml":["sap/m/Bar.js","sap/m/Button.js","sap/m/Input.js","sap/m/Label.js","sap/m/Page.js","sap/m/Panel.js","sap/m/Shell.js","sap/ui/core/Icon.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/form/SimpleForm.js","sap/ushell/demo/bookmark/bookmark.controller.js"]
}});
