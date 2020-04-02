sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/util/UriParameters",
	"sap/base/Log",
	"jquery.sap.xml"
], function(
	MockServer,
	UriParameters,
	Log
) {
	"use strict";
	var _sAppModulePath = "sap/ui/demoapps/rta/fiorielements/";
	var oUriParameters = new UriParameters(window.location.href);

	var bDemokitAvailable;

	function getDemokitPath(sFileName) {
		if (bDemokitAvailable === false) {
			return bDemokitAvailable;
		}

		var sFilePath = sap.ui.require.toUrl('sap/ui/documentation').replace('resources', 'test-resources') + '/sdk/images/' + sFileName;

		if (typeof bDemokitAvailable !== "boolean") {
			bDemokitAvailable = [200, 301, 302, 304].indexOf(jQuery.ajax({
				async: false,
				url: sFilePath
			}).status) !== -1;
		}

		return bDemokitAvailable && sFilePath;
	}

	var getAbsolutePath = (function() {
		var a = null;
		return function(url) {
			a = a || document.createElement('a');
			a.href = url;
			return a.href.replace(/^.*\/\/[^\/]+/, '');
		};
	})();

	function getImagePath(sFileName){
		return sFileName
			? getAbsolutePath(getDemokitPath(sFileName) || sap.ui.require.toUrl(_sAppModulePath) + '/localService/img/' + sFileName)
			: sFileName
	}

	return {

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		init: function() {
			var sManifestUrl = sap.ui.require.toUrl(_sAppModulePath + "manifest.json"),
				oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data;
			this.createMockServer(oManifest, oUriParameters);
		},

		createMockServer: function(oManifest, oUriParameters) {

			var iAutoRespond = (oUriParameters.get("serverDelay") || 1000),
				oMockServer, dataSource, sMockServerPath, sMetadataUrl,
				oDataSources = oManifest["sap.app"]["dataSources"];

			MockServer.config({
				autoRespond: true,
				autoRespondAfter: iAutoRespond
			});

			for (var property in oDataSources) {
				if (Object.prototype.hasOwnProperty.call(oDataSources, property)) {
					dataSource = oDataSources[property];

					//do we have a mock url in the app descriptor
					if (dataSource.settings && dataSource.settings.localUri) {
						if (typeof dataSource.type === "undefined" || dataSource.type === "OData") {
							oMockServer = new MockServer({
								rootUri: dataSource.uri
							});
							sMetadataUrl = sap.ui.require.toUrl(_sAppModulePath + dataSource.settings.localUri);
							sMockServerPath = sMetadataUrl.slice(0, sMetadataUrl.lastIndexOf("/") + 1);
							oMockServer.simulate(sMetadataUrl , {
								sMockdataBaseUrl: sMockServerPath,
								bGenerateMissingMockData: true
							});
							if (property === "mainService"){
								oMockServer.attachAfter(MockServer.HTTPMETHOD.GET, function (oEvent) {
									var oParameters = oEvent.getParameters();

									if (oParameters.oFilteredData && jQuery.isArray(oParameters.oFilteredData.results)){
										oParameters.oFilteredData.results.forEach(function (oProduct) {
											oProduct.ProductPictureURL = getImagePath(oProduct.ProductPictureURL);
										}.bind(this));
									} else if (oParameters.oEntry && jQuery.type(oParameters.oEntry.ProductPictureURL) === "string") {
										oParameters.oEntry.ProductPictureURL = getImagePath(oParameters.oEntry.ProductPictureURL);
									}
								}.bind(this), "SEPMRA_C_PD_Product");
							}
						} else {
							if (oUriParameters.get("sap-client")) {
								dataSource.uri = dataSource.uri.concat("&sap-client=" + oUriParameters.get("sap-client"));
							}
							var rRegEx = dataSource.uri;
							if (dataSource.type !== "MockRegEx") {
								rRegEx = new RegExp(MockServer.prototype._escapeStringForRegExp(dataSource.uri) + "([?#].*)?");
							}
							sMetadataUrl =  sap.ui.require.toUrl(_sAppModulePath + dataSource.settings.localUri);

							oMockServer = new MockServer({
								requests: [{
									method: "GET",
									path: rRegEx,
									response: function(oXhr) {
										var oAnnotations = jQuery.sap.sjax({
											url: sMetadataUrl,
											dataType: "xml"
										}).data;
										oXhr.respondXML(200, {}, jQuery.sap.serializeXML(oAnnotations));
										return true;
									}
								}]
							});
						}
						oMockServer.start();
						Log.info("Running the app with mock data for " + property);
					}
				}
			}
		}
	};

});
