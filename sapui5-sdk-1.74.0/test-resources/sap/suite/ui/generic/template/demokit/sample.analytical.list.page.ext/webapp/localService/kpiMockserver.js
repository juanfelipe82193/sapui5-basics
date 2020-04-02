sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/util/UriParameters"
], function (MockServer, UriParameters) {
	"use strict";
	return {
		init: function () {
			// create
			var oKpiMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/CZ_PROJECTKPIS_CDS/"
			});
			var oUriParameters = new UriParameters(window.location.href);
			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: oUriParameters.get("serverDelay") || 1000
			});

			// simulate
			var sPath = sap.ui.require.toUrl("analytics2/localService");
			oKpiMockServer.simulate(sPath + '/CZ_PROJECTKPIS.xml', {
				sMockdataBaseUrl: sPath + '',
				bGenerateMissingMockData: true
			});

			// start
			oKpiMockServer.start();
		}
	};
});
