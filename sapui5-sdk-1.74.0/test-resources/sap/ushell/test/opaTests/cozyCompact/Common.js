// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ui/test/Opa5'], function(Opa5) {
	"use strict";

	// All the arrangements for all Opa tests are defined here
	var Common = Opa5.extend("sap.ushell.test.opaTests.stateLean.Common", {

		StartAppWithCozyCompact : function(val) {
			this.iStartMyAppInAFrame("../../shells/demo/ui5appruntime.html?"+ (val? "sap-touch=" + val + "&": "") +"sap-ui-app-id=sap.ushell.demo.letterBoxing#Action-toLetterBoxing");
			return this.waitFor({
				timeout: 15,
				pollingInterval: 5000,
				errorMessage: "Could not load application"
			});
		}
	});

	return Common;
});
