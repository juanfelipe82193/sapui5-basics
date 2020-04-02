(function() {
	"use strict";

	window["sap-ushell-config"] = {
		defaultRenderer : "fiori2",
		bootstrapPlugins: {
			"RuntimeAuthoringPlugin" : {
				component: "sap.ushell.plugins.rta",
				config: {
					validateAppVersion: false
				}
			},
			"PersonalizePlugin": {
				component: "sap.ushell.plugins.rta-personalize",
				config: {
					validateAppVersion: false
				}
			}
		},
		renderers: {
			fiori2: {
				componentData: {
					config: {
						enableMergeAppAndShellHeaders: true,
						search: "hidden"
					}
				}
			}
		},
		applications: {
			"masterDetail-display": {
				"additionalInformation": "SAPUI5.Component=sap.ui.demoapps.rta.freestyle",
				"applicationType": "URL",
				"url": "../",
				"description": "UI Adaptation at Runtime",
				"title": "Products Manage",
				"applicationDependencies": {
					"self": { name: "sap.ui.demoapps.rta.freestyle" },
					"manifest": true,
					"asyncHints": {
						"libs": [
							{ "name": "sap.ui.core" },
							{ "name": "sap.m" },
							{ "name": "sap.ui.layout" },
							{ "name": "sap.ui.comp" },
							{ "name": "sap.ui.generic.app" },
							{ "name": "sap.uxap" },
							{ "name": "sap.ui.rta" }
						]
					}
				}
			}
		},
		services: {
			NavTargetResolution: {
				config: {
					"runStandaloneAppFolderWhitelist": {
						"*" : true
					},
					"allowTestUrlComponentConfig" : true,
					"enableClientSideTargetResolution": true
				}
			},
			EndUserFeedback: {
				adapter: {
					config: {
						enabled: true
					}
				}
			}
		}
	};

	window.onInit = function() {
		sap.ushell.Container.createRenderer().placeAt("content");
	};

	var __aPrefixMatches = document.location.pathname.match(/(.*)\/test-resources\//);
	var __sPathPrefix = __aPrefixMatches &&  __aPrefixMatches[1] || "";

	document.write('<script src="' + __sPathPrefix + '/test-resources/sap/ushell/bootstrap/sandbox.js" id="sap-ushell-bootstrap"><' + '/script>');
	document.write('<script src="' + __sPathPrefix + '/resources/sap-ui-core.js"' +
			' id="sap-ui-bootstrap"' +
			' data-sap-ui-theme="sap_fiori_3"' +
			' data-sap-ui-language="en"' +
			' data-sap-ui-libs="sap.m,sap.ushell,sap.ui.rta"' +
			' data-sap-ui-compatVersion="edge"' +
			' data-sap-ui-frameOptions="allow"' +
			' data-sap-ui-preload="async"' +
			' data-sap-ui-onInit="onInit"' + '<' + '/script>');
	document.write('<script src="' + __sPathPrefix + '/test-resources/sap/ushell/bootstrap/standalone.js"><' + '/script>');

}());
