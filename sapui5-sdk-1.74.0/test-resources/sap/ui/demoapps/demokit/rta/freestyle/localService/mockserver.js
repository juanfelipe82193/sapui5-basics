sap.ui.define([
	"sap/ui/core/util/MockServer",
	"./MockRequests",
	"jquery.sap.xml"
], function(MockServer, MockRequests) {
	"use strict";

	var oMockServer,
		_sAppModulePath = "sap/ui/demoapps/rta/freestyle/",
		_sJsonFilesModulePath = _sAppModulePath + "localService/mockdata";

	return {
		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		init: function(fnGetManifestEntry) {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sJsonFilesUrl = jQuery.sap.getModulePath(_sJsonFilesModulePath),
				//sManifestUrl = jQuery.sap.getModulePath(_sAppModulePath + "manifest", ".json"),
				sEntity = "SEPMRA_C_PD_Product",
				sErrorParam = oUriParameters.get("errorType"),
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
				//oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
				oMainDataSource =  fnGetManifestEntry("sap.app").dataSources.mainService,
				sMetadataUrl = jQuery.sap.getModulePath(_sAppModulePath + oMainDataSource.settings.localUri.replace(".xml", ""), ".xml"),
				// ensure there is a trailing slash
				sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/",
				oMainAnnotations = fnGetManifestEntry("sap.app").dataSources.mainAnnotations,
				sAnnotations = jQuery.sap.serializeXML(jQuery.sap.sjax({
					url: jQuery.sap.getModulePath(_sAppModulePath + oMainAnnotations.settings.localUri.replace(".xml", ""), ".xml"),
					dataType: "xml" }
				).data),
				oRequests;

			oMockServer = new MockServer({
				rootUri: sMockServerUrl
			});
			oRequests = new MockRequests(oMockServer);
			new MockServer({
				rootUri: oMainAnnotations.uri,
				requests: [{
					method: "GET",
					path: new RegExp(""),
					response: function(oXhr) {
						oXhr.respondXML(200, {}, sAnnotations);
						return true;
					}
				}]
			});
			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 50)
			});

			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sJsonFilesUrl,
				bGenerateMissingMockData: true
			});

			var aRequests = oMockServer.getRequests(),
				fnResponse = function(iErrCode, sMessage, aRequest) {
					aRequest.response = function(oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "text/plain;charset=utf-8"
						}, sMessage);
					};
				};

			// handling the metadata error test
			if (oUriParameters.get("metadataError")) {
				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf("$metadata") > -1) {
						fnResponse(500, "metadata Error", aEntry);
					}
				});
			}

			// Handling request errors
			if (sErrorParam) {
				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf(sEntity) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
				});
			}
			//add the app-specific mock implementation to the standard one
			oMockServer.setRequests(aRequests.concat(oRequests.getRequests()));

			MockServer.startAll();

			jQuery.sap.log.info("Running the app with mock data");
		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer} the mockserver instance
		 */
		getMockServer: function() {
			return oMockServer;
		}
	};

});
