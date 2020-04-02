sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/core/routing/HashChanger",
	"sap/ushell/sample/OpaFLPSandbox/localService/mockserver"
], function (Opa5, HashChanger, mockserver) {
	"use strict";

	return Opa5.extend("sap.ushell.sample.OpaFLPSandbox.test.integration.pages.Common", {
		iStartMyApp: function (oOptions) {
			var sHash = oOptions && oOptions.hash && "&" + oOptions.hash || "";
			return this.waitFor({
				success: function () {
					// restart the mock server every time the application is opened
					if (!(oOptions && oOptions.resetMockData === false)) {
						mockserver.getMockServer().destroy();
						mockserver.init();
					}

					// create new instance to reset hash
					new HashChanger().setHash("SampleApplication-display" + sHash);
				}
			});
		},
		iGoToHomeScreen: function () {
			return this.waitFor({
				success: function () {
					new HashChanger().setHash("Shell-home");
				}
			});
		}
	});
});
