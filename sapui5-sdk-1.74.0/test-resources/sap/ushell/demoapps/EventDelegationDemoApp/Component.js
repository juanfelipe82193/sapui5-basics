// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.EventDelegationDemoApp.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.EventDelegationDemoApp.Component", {

	metadata : {
		"manifest": "json"
	},

	createContent : function() {
		return sap.ui.xmlview("sap.ushell.demo.EventDelegationDemoApp.App");
    }
});
