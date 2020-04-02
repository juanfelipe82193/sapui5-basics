sap.ui.define([
	"sap/ui/generic/app/AppComponent",
	"sap/ui/core/util/MockServer",
	"sap/ui/core/util/DraftEnabledMockServer",
	"utils/Utils",
	"utils/mockserver/MockServerLauncher",
	"sap/ui/fl/FakeLrepConnector",
	"sap/ui/fl/FakeLrepLocalStorage",
	"sap/ui/rta/RuntimeAuthoring",
	"sap/suite/ui/generic/template/lib/AjaxHelper",
	"sap/base/util/UriParameters"
], function (AppComponent, MockServer, DraftEnabledMockServer, Utils, MockServerLauncher, FakeLrepConnector, FakeLrepLocalStorage, RuntimeAuthoring, AjaxHelper, UriParameters) {
	"use strict";

var oUriParameters = new UriParameters(window.location.href);
var sApp = oUriParameters.get("app") || false;
var sProject = oUriParameters.get("project") || false;
var bResponder = oUriParameters.get("responderOn") === "true";
var bWithChange = oUriParameters.get("withChange") === "true";
var sDemoApp = oUriParameters.get("demoApp") || "products";
var bRTA = oUriParameters.get("rta") || false;
var bMockLog = oUriParameters.get("mockLog") || false;
var iAutoRespond = (oUriParameters.get("serverDelay") || 1000);
var sManifest = oUriParameters.get("manifest");
if (!sManifest){
	sManifest = "manifest";
}
console.log("mockLog:" + bMockLog);

//new parameter for session storage
var bSessionStorage = oUriParameters.get("use-session-storage");
if (bSessionStorage) {
	window['use-session-storage'] = true;
}
if (!sApp) {
	var mAppInfo = Utils.getAppInfo(sDemoApp);
	sApp = mAppInfo.moduleName;
	sApp = sApp.replace(/\./g, "/");
	sProject = mAppInfo.modulePath;
	var appPathMap = {};
	appPathMap[sApp] = sProject;
}

sap.ui.loader.config({paths:appPathMap});
if (bResponder) {
	var sManifest = "/manifest.json";
	var sManifestDynamic = Utils.getManifestObject(sProject).manifest;
	if (sManifestDynamic){
		sManifest = "/" + sManifestDynamic + ".json";
	}
	AjaxHelper.getJSON(sProject + sManifest).then( function(data) {
		MockServerLauncher.startMockServers(sProject, data, "__component0", iAutoRespond, bMockLog);

		sap.ui.getCore().attachInit(function() {
			//Fake LREP Local Storage Patch
			if (bWithChange) {
				FakeLrepConnector.enableFakeConnector("fakeLRepWithChange.json");
			} else {
				MockServerLauncher.enableFakeConnector();
			}
			start();
		});
	});
} else {
	start();
}

function start() {

	var oContainer = new sap.ui.core.ComponentContainer({
			name: sApp,
			height: "100%"
		}),
		oShell = new sap.m.Shell("Shell", {
			showLogout: false,
			appWidthLimited: false,
			app: oContainer,
			homeIcon: {
				'phone': 'img/57_iPhone_Desktop_Launch.png',
				'phone@2': 'img/114_iPhone-Retina_Web_Clip.png',
				'tablet': 'img/72_iPad_Desktop_Launch.png',
				'tablet@2': 'img/144_iPad_Retina_Web_Clip.png',
				'favicon': 'img/favicon.ico',
				'precomposed': false
			}
		});

	if (bRTA) {
		var oBox = new sap.m.VBox({
			items: [
				new sap.m.Toolbar({
					content: [
						new sap.m.Button({
							text: "Adapt UI",
							tooltip: "Vendor Layer aka Level-0 is default. User url parameter sap-ui-layer to change",
							press: function(oEvent) {
								var oRta = new RuntimeAuthoring({
									rootControl: oContainer.getComponentInstance()
										.getAggregation('rootControl')
								});
								oRta.start();
							}
						}),
						new sap.m.Button({
							text: "Reset",
							press: function(oEvent) {
								FakeLrepLocalStorage.deleteChanges();
								location.reload();
							}
						})
					]
				}),
				oShell
			]
		}).placeAt('content');
	} else {
		oShell.placeAt('content');
	}
}

function makeCallbackFunction(path) {
	return function(oXHR) {
		oXHR.respondFile(200, {}, path);
	};
}


	return null;
});
