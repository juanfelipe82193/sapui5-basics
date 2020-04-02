// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.letterBoxing.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.letterBoxing.Component", {

	metadata : {

		version : "1.74.0",

		library : "sap.ushell.demo.AppLetterBoxing",

		includes : [ ],

		dependencies : {
			libs : [ "sap.m" ],
			components : []
		},
        config: {
            "title": "App letterBoxing",
            //"resourceBundle" : "i18n/i18n.properties",
            //"titleResource" : "shellTitle",
            "icon" : "sap-icon://Fiori2/F0429",
			fullWidth: true
        }
	},

	createContent : function() {
		return sap.ui.xmlview("sap.ushell.demo.letterBoxing.App");
	}
});
