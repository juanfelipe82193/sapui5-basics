sap.ui.define([
		'jquery.sap.global',
		'sap/ui/test/Opa5',
		'sap/ui/test/matchers/PropertyStrictEquals',
		'sap/ui/core/util/MockServer',
        'sap/rules/ui/integration/pages/DecisionTable'
	],
	function (jquery, Opa5, PropertyStrictEquals, MockServer, DecisionTable) {
		"use strict";

		function getFrameUrl(sHash, sUrlParameters, appPath) {
			sHash = sHash || "";
			var sUrl = jQuery.sap.getResourcePath(appPath, ".html");

			if (sUrlParameters) {
				sUrlParameters = "?" + sUrlParameters;
			}

			return sUrl + sUrlParameters + "#" + sHash;
		}

		return Opa5.extend("sap.rules.ui.integration.pages.Common", {

			constructor: function (oConfig) {
				Opa5.apply(this, arguments);

				this._oConfig = oConfig;
			},

			iStartMyApp: function (oOptions) {
				var sUrlParameters;
				oOptions = oOptions || { delay: 0 };

				sUrlParameters = "serverDelay=" + oOptions.delay;
				if (oOptions.sMockFile){

					var oMockServer = new MockServer();
					var oMockUtils = new window.Utils();
					var oMockServerHandler = new window.MockServerHandler(oMockServer, oMockUtils, oOptions.sMockFile);
					jQuery.when(oMockServerHandler.loadJsonFile()).done(function(aRequests){
						oMockServerHandler.setRequests(aRequests);
						oMockServerHandler.start();
					});
				}
				this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, sUrlParameters, oOptions.appPath));
			},

			iLookAtTheScreen: function () {
				return this;
			}

		});
	});
