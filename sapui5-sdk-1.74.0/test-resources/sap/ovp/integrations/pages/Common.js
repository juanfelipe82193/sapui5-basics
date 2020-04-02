sap.ui.define(['sap/ui/test/Opa5'], function(Opa5) {
	"use strict";

	// All the arrangements for all Opa tests are defined here
	var Common = Opa5.extend("sap.ovp.test.integrations.pages.Common", {
 
		iStartMyApp : function() {

			// start without debug parameter, loads much faster
			// this.iStartMyAppInAFrame("../../../template/demokit/demokit.html?sap-ui-debug=true&responderOn=true&demoApp=products&sap-ui-language=en_US");
			return this.iStartMyAppInAFrame("/ovp-app/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html?#OVP-App");
		}
	});

	return Common;

});