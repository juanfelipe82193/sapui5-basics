sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/util/UriParameters"
], function (MockServer) {
	"use strict";
	return {
		init: function () {
			// create
			var oMockServer = new MockServer({
				rootUri: "/services_kiw/sap/opu/odata/sap/ZCOSTCENTERCOSTSQUERY0020_CDS/"
			});
			var oUriParameters = new UriParameters(window.location.href);
			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: oUriParameters.get("serverDelay") || 1000
			});

			// simulate
			var sPath = sap.ui.require.toUrl("analytics2/localService");
			oMockServer.simulate(sPath + '/ZCOSTCENTERCOSTSQUERY0020_CDS.xml', {
				sMockdataBaseUrl: sPath + '',
				bGenerateMissingMockData: true
			});

			// start
			oMockServer.start();
		}
	};
});
