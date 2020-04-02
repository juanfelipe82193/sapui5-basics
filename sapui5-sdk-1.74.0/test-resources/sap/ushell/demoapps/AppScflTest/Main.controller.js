sap.ui.controller("AppScflTest.Main", {
	onInit : function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init('AppScflTest', this);
	}
});