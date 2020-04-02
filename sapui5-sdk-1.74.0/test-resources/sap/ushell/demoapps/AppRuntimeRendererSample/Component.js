// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.zpoc.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.AppRuntimeRendererSample.Component", {

	metadata : {

		version : "1.74.0",

		library : "sap.ushell.demo.AppRuntimeRendererSample",

		includes : [ ],

		dependencies : {
			libs : [ "sap.m" ],
			components : []
		},
        config: {
            "title": "App Runtime Renderer API Sample",
            "icon" : "sap-icon://Fiori2/F0429",
			fullWidth: true
        }
	},

	createContent : function() {
		return sap.ui.xmlview("sap.ushell.demo.AppRuntimeRendererSample.App");
	}
});
