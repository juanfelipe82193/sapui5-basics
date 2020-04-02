(function() {
	"use strict";
	/**
	 * Note: While adding any new app to demokit/apps and here, make sure -
	 * 1. Batch requests are turned off
	 * 2. LocalUri for the metadata and annotations is correct in the manifest
	 * 3. serviceRegex must be added to be able to detect web service calls
	 * 4. mockDataSets values are used to detect web service calls entity set
	 * ...
	 *
	 * @type {{defaultRenderer: string, renderers: {fiori2: {componentData: {config: {search: string}}}}, ClientSideTargetResolution: {}, NavTargetResolution: {config: {enableClientSideTargetResolution: boolean}}, applications: {v4gwsamplebasic-display: {additionalInformation: string, applicationType: string, title: string, description: string, url: string, mockDataSets: string[], serviceRegex: string}, v4music-display: {additionalInformation: string, applicationType: string, title: string, description: string, url: string, mockDataSets: string[], serviceRegex: string}}}}
	 */

	var __aPrefixMatches = document.location.pathname.match(/(.*)\/test-resources\//);
	var __sPathPrefix = (__aPrefixMatches && __aPrefixMatches[1]) || "";

	window["sap-ushell-config"] = {
		defaultRenderer: "fiori2",
		renderers: {
			fiori2: {
				componentData: {
					config: {
						search: "hidden"
					}
				}
			}
		},
		"ClientSideTargetResolution": {},
		"NavTargetResolution": {
			"config": {
				"enableClientSideTargetResolution": false
			}
		},
		services: {
			// Workaround to get rid of core-ext-light.js loading (they don't exist in testsuite)
			"Ui5ComponentLoader": {
				"config": {
					"amendedLoading": false,
					coreResourcesComplement: {
						name: "dummy-core-ext", // Name of the Bundle
						count: -1, // Number of individual parts of the bundle
						debugName: "core-ext-light-custom-dbg", // Name of the debug resource
						path: "sap/fiori/"
					}
				}
			}
		},
		bootstrapPlugins: {
			"RuntimeAuthoringPlugin": {
				"component": "sap.ushell.plugins.rta",
				"config": {
					validateAppVersion: false
				}
			},
			"PersonalizePlugin": {
				"component": "sap.ushell.plugins.rta-personalize",
				"config": {
					validateAppVersion: false
				}
			}
		},
		applications: {
			"itelo-display": {
				additionalInformation: "SAPUI5.Component=itelo",
				applicationType: "URL",
				title: "Itelo",
				description: "V4 (NON-ABAP)",
				url: "./apps/itelo/webapp"
			},
			"iteloABAP-display": {
				additionalInformation: "SAPUI5.Component=itelo",
				applicationType: "URL",
				title: "Itelo",
				description: "V4 (ABAP)",
				url: "./apps/itelo/webapp"
			},
			"v4musicNode-display": {
				additionalInformation: "SAPUI5.Component=music",
				applicationType: "URL",
				title: "Music",
				description: "V4 Draft (NodeJS)",
				url: "./apps/music/webapp"
			},
			"v4music-display": {
				additionalInformation: "SAPUI5.Component=music",
				applicationType: "URL",
				title: "Music",
				description: "V4 Draft",
				url: "./apps/music/webapp",
				mockDataSets: ["Artists", "I_AIVS_CountryCode", "I_AIVS_Region", "I_MDBU_V4_ArtistName", "I_MDBU_V4_ArtistPerson"],
				serviceRegex: "/sap/opu/odata4/sap/sadl_gw_appmusic_draft/"
			},
			"v4musicReadOnly-display": {
				additionalInformation: "SAPUI5.Component=music",
				applicationType: "URL",
				title: "Music",
				description: "V4 Read Only",
				url: "./apps/music/webapp"
			},
			"v4musicNonDraft-display": {
				additionalInformation: "SAPUI5.Component=music",
				applicationType: "URL",
				title: "Music",
				description: "V4 Non Draft",
				url: "./apps/music/webapp",
				mockDataSets: ["Artists", "I_AIVS_CountryCode", "I_AIVS_Region"],
				serviceRegex: "sap/opu/odata4/sap/sadl_gw_appmusictr_service"
			}
		}
	};

	window.onInit = function() {
		sap.ui.require(["sap/ui/thirdparty/jquery", "sap/ui/fl/FakeLrepConnectorLocalStorage", "local/mockServer"], function(
			jQuery,
			FakeLrepConnectorLocalStorage,
			mockServer
		) {
			//The fiori launchpad sandbox has some supportablity tools available
			//However inside of this libary the url are wrong, so we need to fix them here
			function fixTheSandboxApps() {
				var config = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config;
				Object.keys(config.inbounds).forEach(function(inbound) {
					var oApp = config.inbounds[inbound];
					oApp.resolutionResult.url = oApp.resolutionResult.url.replace("../../../../../", __sPathPrefix + "/");
				});
				//Add trace for all semantic objects
				["v4gwsamplebasic", "v4music"].forEach(function(application) {
					var sAppKey = application + "-trace";
					if (!config.applications[sAppKey]) {
						config.applications[sAppKey] = {
							additionalInformation: "SAPUI5.Component=sap.ushell.demo.ReceiveParametersTestApp",
							applicationType: "URL",
							title: "Trace Navigation Parameters",
							description: "Trace Navigation Parameters",
							url: __sPathPrefix + "/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp"
						};
					}
				});
			}

			function start() {
				fixTheSandboxApps();
				// initialize the ushell sandbox component
				sap.ushell.Container.createRenderer().placeAt("content");
			}

			function isBackendRequired() {
				var uriParams = jQuery.sap.getUriParameters(),
					serverUrl = uriParams.get("useBackendUrl"),
					proxyPrefix = serverUrl ? "/databinding/proxy/" + serverUrl.replace("://", "/") : "";
				if (proxyPrefix) {
					/* overwrite jQuery to change the URL always */
					var fnOrg = jQuery.ajax;
					jQuery.ajax = function(sUrl) {
						if (
							sUrl &&
							typeof sUrl === "string" &&
							(sUrl.indexOf("/sap/opu/odata4") === 0 || sUrl.indexOf("/odata/v4") === 0 || sUrl.indexOf("/catalog") === 0)
						) {
							sUrl = proxyPrefix + sUrl;
							arguments[0] = sUrl; //due to strict mode in line 2
						}
						return fnOrg.apply(this, arguments);
					};
					return true;
				}
				return false;
			}

			//Allow adaptation changes in local storage
			FakeLrepConnectorLocalStorage.enableFakeConnector();

			if (isBackendRequired()) {
				start();
			} else {
				mockServer.mockIt().then(start);
			}
		});
	};

	document.write(
		'<script src="' + __sPathPrefix + '/test-resources/sap/ushell/bootstrap/sandbox.js" id="sap-ushell-bootstrap"><' + "/script>"
	);
	document.write(
		'<script src="' +
			__sPathPrefix +
			'/resources/sap-ui-core.js"' +
			' id="sap-ui-bootstrap"' +
			' data-sap-ui-theme="sap_fiori_3"' +
			' data-sap-ui-language="en"' +
			' data-sap-ui-libs="sap.m,sap.ushell,sap.ui.fl"' +
			' data-sap-ui-compatVersion="edge"' +
			' data-sap-ui-xx-lesssupport="false"' +
			' data-sap-ui-frameOptions="allow"' +
			" data-sap-ui-xx-componentPreload=off " +
			' data-sap-ui-async="true" ' +
			" data-sap-ui-resourceroots='{" +
			'	"sap.fe": "' +
			__sPathPrefix +
			'/resources/sap/fe",' +
			'	"reuselib": "./reuselib",' +
			'	"local": "."' +
			" }'" +
			' data-sap-ui-onInit="onInit">' +
			"<" +
			"/script>"
	);
})();
