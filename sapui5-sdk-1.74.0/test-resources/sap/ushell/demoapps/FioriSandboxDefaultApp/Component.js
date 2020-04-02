// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.FioriSandboxDefaultApp.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.FioriSandboxDefaultApp.Component", {

	metadata : {

		version : "1.74.0",

		library : "sap.ushell.demo.FioriSandboxDefaultApp",

		includes : [ ],

		dependencies : {
			libs : [ "sap.m" ],
			components : []
		},
        config: {
            "title": "Fiori Sandbox Default App",
            //"resourceBundle" : "i18n/i18n.properties",
            //"titleResource" : "shellTitle",
            "icon" : "sap-icon://Fiori2/F0429"
        }
	},

	createContent : function() {
		return sap.ui.xmlview("sap.ushell.demo.FioriSandboxDefaultApp.App");
	},
    exit : function() {
        //Sample use of addActivity API
        sap.ushell.services.AppConfiguration.addActivity({
            icon: "sap-icon://Fiori2/F0429",
            title: 'Sample Activity Entry',
            appType: 'OVP',
            appId: "#Action-todefaultapp",
            url: "#Action-todefaultapp"
        });
    }
});
