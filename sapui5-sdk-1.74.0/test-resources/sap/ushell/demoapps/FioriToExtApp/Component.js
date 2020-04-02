// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.FioriToExtApp.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.FioriToExtApp.Component", {

	metadata : {

		version : "1.74.0",

		library : "sap.ushell.demo.FioriToExtApp",

		includes : [ ],

		dependencies : {
			libs : [ "sap.m" ],
			components : []
		},
        config: {
            "title": "Fiori Sandbox Default App",
            "icon" : "sap-icon://Fiori2/F0429"
        }
	},

	createContent : function() {
		return sap.ui.xmlview("sap.ushell.demo.FioriToExtApp.App");
    }
});
