(function(){
		// for OPA testing we only need specific apps that are used e.g. for navigation
		// all other apps not part of the uriParams paramter flpApps are removed
		function removeSandboxApps(oApps) {
			var UriParameters = sap.ui.require("sap/base/util/UriParameters");
			var each = sap.ui.require("sap/base/util/each");
			var uriParams = new UriParameters(window.location.href);
			if (uriParams.mParams.flpApps) {
				var sAppToKeep = uriParams.mParams.flpApps[0];
				each(oApps, function(application) {
					if (sAppToKeep.indexOf(application) < 0) {
						delete oApps[application];
					}
				});
			}
		}

		//The fiori launchpad sandbox has some supportablity tools available
		//However inside of this libary the url are wrong, so we need to fix them here
		function fixTheSandboxApps() {
			var config = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config;
			Object.keys(config.inbounds).forEach( function(inbound) {
				var oApp = config.inbounds[inbound];
				oApp.resolutionResult.url = "../../" + oApp.resolutionResult.url;
			});
			//Add trace for all semantic objects
			["EPMProduct", "Supplier", "SalesOrder"].forEach( function(application) {
				var sAppKey = application + "-trace";
				if(!config.applications[sAppKey]) {
					config.applications[sAppKey] = {
						additionalInformation: "SAPUI5.Component=sap.ushell.demo.ReceiveParametersTestApp",
						applicationType: "URL",
						title: "Trace Navigation Parameters",
						description: "Trace Navigation Parameters",
						url: "../../../../../../../test-resources/sap/ushell/demoapps/ReceiveParametersTestApp"
					};
				}
				var sAppKey = application + "-beta";
				if (!config.applications[sAppKey]) {
					config.applications[sAppKey] = {
						additionalInformation: "SAPUI5.Component=sap.ushell.demo.ReceiveParametersTestApp",
						applicationType: "URL",
						title: "Trace Navigation Parameters - Beta Version",
						description: "Trace Navigation Parameters - Beta Version",
						url: "../../../../../../../test-resources/sap/ushell/demoapps/ReceiveParametersTestApp"
					};
				}
			});

		}

		sap.ui.getCore().attachInit(function() {
			"use strict";
			sap.ui.require([
				"utils/mockserver/MockServerLauncher",
				"sap/ui/fl/FakeLrepConnectorLocalStorage",
				"sap/ui/thirdparty/datajs",
				"utils/Utils",
				"sap/suite/ui/generic/template/lib/AjaxHelper",
				"sap/base/util/UriParameters",
				"sap/base/util/each"
			], function (MockServerLauncher, FakeLrepConnectorLocalStorage, datajs, Utils, AjaxHelper, UriParameters, each) {
				var uriParams = new UriParameters(window.location.href);
				function isBackendRequired() {
					var serverUrl = uriParams.get("useBackendUrl"),
					proxyPrefix = serverUrl ? "../../../../../../../proxy/" + serverUrl.replace("://", "/") : "";
					if (proxyPrefix) {
						/* overwrite datajs to change the URL always */
						var fnOrgDataJS = datajs.request;
						datajs.request = function (request, success, error, handler, httpClient, metadata) {
							var sUrl = request.requestUri;
							if (sUrl && typeof sUrl === "string" && sUrl.indexOf("/sap/opu/odata") === 0) {
								request.requestUri = proxyPrefix + sUrl;
							}
							return fnOrgDataJS.apply(this, arguments);
						}
					/* overwrite AjaxHelper to change the URL always */
					var fnOrg$ = AjaxHelper.ajax;
					AjaxHelper.ajax = function(vUrl) {
						if(vUrl){
							var sUrl = vUrl.url;
							if (sUrl && typeof sUrl === "string" && sUrl.indexOf("/sap/opu/odata") === 0) {
								sUrl = proxyPrefix + sUrl;
									vUrl.url = sUrl;
							}
						}
						// if we pass illegal arguments to AjaxHelper.ajax, it will handel them and throw appropriate error.
						return fnOrg$.apply(this, arguments);
					}
						return true;
					}
					return false;
				}

				var oApps = window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications;
				removeSandboxApps(oApps);

				// FakeLrepConnectorLocalStorage not working with UI adaption changes
                var bMockLog = uriParams.get("mockLog") || false;
                console.log("mockLog:" + bMockLog);
				if (uriParams.get("withChange") === "true") {
					sap.ui.fl.FakeLrepConnector.enableFakeConnector("fakeLRepWithChange.json");
				} else {
					FakeLrepConnectorLocalStorage.enableFakeConnector();
				}

				if (!isBackendRequired()) {
					Object.keys(oApps).forEach( function(sApp) {
						var oApp = oApps[sApp];
						var sProject = oApp.url;
						var sManifest = "/manifest.json";
						var sManifestDynamic = Utils.getManifestObject(sProject).manifest;
						if (sManifestDynamic){
							sManifest = "/" + sManifestDynamic + ".json";
						}
						// set up test service for local testing
						AjaxHelper.getJSON(sProject + sManifest).then( function(manifest) {
							MockServerLauncher.startMockServers(sProject, manifest, "application-" + sApp + "-component", undefined, bMockLog);
						});
					});
				}
				fixTheSandboxApps();
				// initialize the ushell sandbox component
				sap.ushell.Container.createRenderer().placeAt("content");
			});


		});
})()
