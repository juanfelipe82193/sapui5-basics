sap.ui.define(function() {

	"use strict";
	return {
		name: "QUnit TestSuite for sap.makit",
		defaults: {
			bootCore: true,
			ui5: {
				libs: "sap.m,sap.makit",
				theme: "sap_bluecrystal",
				noConflict: true,
				preload: "auto"
			},
			qunit: {
				version: 1,
				reorder: false
			},
			sinon: {
				version: "edge",
				qunitBridge: true,
				useFakeTimers: false
			},
			module: "./{name}.qunit"
		},
		tests: {
			Chart: {
				title: "qUnit Page for sap.makit.Chart",
				ui5: {
					libs: "sap.m, sap.makit"
				},
				_page: "test-resources/sap/makit/qunit/Chart.qunit.html"
			},
			CombinationChart: {
				title: "qUnit Page for sap.makit.Chart",
				_alternativeTitle: "qUnit Page for sap.makit.CombinationChart",
				ui5: {
					libs: "sap.m, sap.makit"
				},
				_page: "test-resources/sap/makit/qunit/CombinationChart.qunit.html"
			},
			Layer: {
				title: "qUnit Page for sap.makit.Chart",
				_alternativeTitle: "qUnit Page for sap.makit.CombinationChart",
				ui5: {
					libs: "sap.m, sap.makit"
				},
				_page: "test-resources/sap/makit/qunit/Layer.qunit.html"
			}
		}
	};
});
