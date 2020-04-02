sap.ui.define(['sap/ui/test/Opa5',
               "sap/ui/test/actions/Press"],
	function(Opa5, Press) {
		"use strict";

		function getFrameUrl (sHash, sUrlParameters) {
			var sUrl = sap.ui.require.toUrl("STTA_MP/app.html");
			sHash = sHash || "";
			sUrlParameters = sUrlParameters ? "?" + sUrlParameters : "";

			if (sHash) {
				sHash = "#STTA_MP-display&/" + (sHash.indexOf("/") === 0 ? sHash.substring(1) : sHash);
			} else {
				sHash = "#STTA_MP-display";
			}

			return sUrl + sUrlParameters + sHash;
		}

		return Opa5.extend("STTA_MP.test.integration.pages.Common", {

			iStartTheApp: function(oOptions) {
				oOptions = oOptions || {};
				// Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
				this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, "serverDelay=50"));
			},

			iTeardownMyApp: function() {
				return this.iTeardownMyAppFrame();
			},

			iLookAtTheScreen: function() {
				return this;
			},

			iClickTheButtonWithId: function(sId, sButtonText) {
				return this.waitFor({
					id: sId,
					actions: new Press(),
					errorMessage: "The " + sButtonText + " button could not be found"
				});
			}
		});
	}
);
