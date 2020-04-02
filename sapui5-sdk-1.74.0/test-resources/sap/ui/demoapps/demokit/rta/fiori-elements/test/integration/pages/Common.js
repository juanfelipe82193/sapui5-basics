/* global QUnit assert */

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/fl/FakeLrepConnectorSessionStorage"
], function(
	Opa5,
	FakeLrepConnectorSessionStorage
) {
	"use strict";

	function getFrameUrl(sHash, sUrlParameters) {
		var sUrl = sap.ui.require.toUrl("sap/ui/demoapps/rta/fiori-elements/test/index" + ".html");
		sHash = sHash || "";
		sUrlParameters = sUrlParameters ? "?" + sUrlParameters : "";

		if (sHash) {
			sHash = "#masterDetail-display&/" + (sHash.indexOf("/") === 0 ? sHash.substring(1) : sHash);
		} else {
			sHash = "#masterDetail-display";
		}

		return sUrl + sUrlParameters + sHash;
	}

	return Opa5.extend("sap.ui.demoapps.rta.fiori-elements.test.integration.pages.Common", {

		iStartTheApp: function(oOptions) {
			oOptions = oOptions || {};
			this.iStartMyAppInAFrame({
				source: getFrameUrl(oOptions.hash, oOptions.urlParameters),
				autoWait: true
			});
		},

		iEnableTheSessionLRep: function() {
			FakeLrepConnectorSessionStorage.enableFakeConnector();
			FakeLrepConnectorSessionStorage.forTesting.synchronous.clearAll();
		},

		iStartTheAppWithDelay: function(sHash, iDelay) {
			this.iStartMyAppInAFrame(getFrameUrl(sHash, "serverDelay=" + iDelay));
		},

		iLookAtTheScreen: function() {
			return this;
		},

		iStartMyAppOnADesktopToTestErrorHandler: function(sParam) {
			this.iStartMyAppInAFrame(getFrameUrl("", sParam));
		},

		createAWaitForAnEntitySet: function(oOptions) {
			return {
				success: function() {
					var bMockServerAvailable = false,
						aEntitySet;

					this.getMockServer().then(function(oMockServer) {
						aEntitySet = oMockServer.getEntitySetData(oOptions.entitySet);
						bMockServerAvailable = true;
					});

					return this.waitFor({
						check: function() {
							return bMockServerAvailable;
						},
						success: function() {
							oOptions.success.call(this, aEntitySet);
						}
					});
				}
			};
		},

		getMockServer: function() {
			return new Promise(function(success) {
				Opa5.getWindow().sap.ui.require(["sap/ui/demoapps/rta/freestyle/localService/mockserver"], function(mockserver) {
					success(mockserver.getMockServer());
				});
			});
		},

		theUnitNumbersShouldHaveTwoDecimals: function(sControlType, sViewName, sSuccessMsg, sErrMsg) {
			var rTwoDecimalPlaces = /^-?\d+\.\d{2}$/;

			return this.waitFor({
				controlType: sControlType,
				viewName: sViewName,
				success: function(aNumberControls) {
					QUnit.ok(aNumberControls.every(function(oNumberControl) {
							return rTwoDecimalPlaces.test(oNumberControl.getNumber());
						}),
						sSuccessMsg);
				},
				errorMessage: sErrMsg
			});
		},

		iWaitUntilTheBusyIndicatorIsGone: function (sId, sViewName) {
			return this.waitFor({
				autoWait: false,
				id: sId,
				viewName: sViewName,
				matchers: function (oRootView) {
					// we set the view busy, so we need to query the parent of the app
					return oRootView.getBusy() === false;
				},
				success: function () {
					assert.ok(true, "the App is not busy anymore");
				},
				errorMessage: "The app is still busy.."
			});
		}

	});

});
