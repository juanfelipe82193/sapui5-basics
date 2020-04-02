sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(MockServer) {
	"use strict";

	var oMockServer;

	return {
		_sServiceUrl: "/sap/opu/odata/sap/SEPMRA_SO_MAN/",
		_sAnnotationsUrl: "/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Annotations(TechnicalName='SEPMRA_SO_MAN_ANNO_MDL',Version='0001')/$value/",
		_sModulePath: "Sales_order_Ref.localService",

		/**
		 * Initializes the mock server. You can configure the delay with the URL parameter "serverDelay"
		 * The local mock data in this folder is returned instead of the real data for testing.
		 *
		 * @public
		 */

		init: function() {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sPath = jQuery.sap.getModulePath(this._sModulePath),
				// TODO: replace this at template generator step with Master List Entity Set
				sEntity = "Objects",
				sErrorParam = oUriParameters.get("errorType"),
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500;

			jQuery.sap.log.info("MockServer 2: init");

			oMockServer = new MockServer({
				rootUri: this._sServiceUrl
			});

			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 1000)
			});

			oMockServer.simulate(sPath + "/metadata.xml", {
				sMockdataBaseUrl: sPath,
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
			oMockServer.start();

			///annotiaons
			var oAnnotationsMockServer = new MockServer({
				rootUri: this._sAnnotationsUrl,
				requests: [{
					method: "GET",
					path: new RegExp("annotation\\.xml/([?#].*)?"),
					response: function(oXhr) {
						jQuery.sap.require("jquery.sap.xml");

						var oAnnotations = jQuery.sap.sjax({
							url: sPath + "/annotations.xml",
							dataType: "xml"
						}).data;

						// 		fnHandleXsrfTokenHeader(oXhr, mHeaders);

						oXhr.respondXML(200, {}, jQuery.sap.serializeXML(oAnnotations));
						return true;

					}
				}]

			});

			oAnnotationsMockServer.start();

			jQuery.sap.log.info("Running the app with mock data");
		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer}
		 */
		getMockServer: function() {
			return oMockServer;
		}
	};

});