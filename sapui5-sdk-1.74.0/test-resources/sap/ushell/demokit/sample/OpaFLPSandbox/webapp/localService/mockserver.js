sap.ui.define([
	"sap/ui/core/util/MockServer"
], function (MockServer) {
	"use strict";

	var oMockServer;
	var _sMockDataPath = "sap/ushell/sample/OpaFLPSandbox/localService";

	return {
		init: function () {
			var sJsonFilesUrl = jQuery.sap.getModulePath(_sMockDataPath);
			var	sMetadataUrl = jQuery.sap.getModulePath(_sMockDataPath + "/metadata", ".xml");

			oMockServer = new MockServer({
				rootUri: "/my/serviceUrl/"
			});

			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 100
			});

			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sJsonFilesUrl,
				bGenerateMissingMockData: true
			});

			oMockServer.start();

			jQuery.sap.log.info("Running the application with mock data");
		},
		getMockServer: function () {
			return oMockServer;
		}
	};
});