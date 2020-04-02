sap.ui.define(['sap/ui/test/Opa5'], function(Opa5) {
	"use strict";

	// All the arrangements for all Opa tests are defined here
	var Common = Opa5.extend("sap.ushell.test.opaTests.stateLean.Common", {

		StartFLPAppInLeanState : function() {
			this.iStartMyAppInAFrame("../../shells/demo/FioriLaunchpad.html?appState=lean#Action-toappnavsample");
			return this.waitFor({
				timeout: 15,
				pollingInterval: 5000,
				errorMessage: "Could not load application"
			});
		}
	});

	return Common;
});
