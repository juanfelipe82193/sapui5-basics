sap.ui.define(['sap/ui/core/UIComponent'], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ushell.sample.OpaFLPSandbox.Component", {

		metadata: {
			dependencies: {
				libs: [ "sap.m", "sap.ui.comp", "sap.ushell"]
			},
			config: {
				sample: {
					iframe : "webapp/test/integration/opaTests.qunit.html",
					stretch: true,
					files: [
						"webapp/Component.js",
						"webapp/manifest.json",
						"webapp/view/App.view.xml",
						"webapp/controller/App.controller.js",
						"webapp/view/Master.view.xml",
						"webapp/controller/Master.controller.js",
						"webapp/view/Detail.view.xml",
						"webapp/controller/Detail.controller.js",
						"webapp/localService/LineItems.json",
						"webapp/localService/Objects.json",
						"webapp/localService/mockserver.js",
						"webapp/localService/metadata.xml",
						"webapp/test/flpSandboxMockServer.html",
						"webapp/test/integration/AllJourneys.js",
						"webapp/test/integration/opaTests.qunit.html",
						"webapp/test/integration/journeys/MasterJourney.js",
						"webapp/test/integration/pages/Common.js",
						"webapp/test/integration/pages/Master.js",
						"webapp/test/integration/pages/Detail.js"
					]
				}
			}
		}
	});
}, true);
