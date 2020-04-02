sap.ui.define(function() {

	"use strict";
	return {
		name: "QUnit TestSuite for sap.me",
		defaults: {
			title: "{name} - sap.me",
			bootCore: true,
			ui5: {
				libs: "sap.m,sap.me",
				theme: "sap_bluecrystal",
				noConflict: true,
				preload: "auto"
			},
			qunit: {
				version: 2,
				reorder: false
			},
			sinon: {
				version: 4,
				qunitBridge: true,
				useFakeTimers: false
			},
			module: "./{name}.qunit"
		},
		tests: {
			Calendar: {},
			CalendarLegend: {},
			CalendarOffset: {},
			CalendarTZ: {},
			OverlapCalendar: {
				qunit: {
					// 10 seconds timeout for all the tests
					testTimeout: 10000
				},
				ui5: {
					language: "en"
				}
			},
			ProgressIndicator: {},
			TabContainer: {}
		}
	};
});
