sap.ui.define(function() {

	"use strict";
	return {
		name: "QUnit TestSuite for sap.landvisz",
		defaults: {
			bootCore: true,
			ui5: {
				libs: "sap.landvisz,sap.ui.commons,sap.ui.ux3",
				theme: "sap_goldreflection",
				language: "en-US",
				noConflict: true,
				preload: "false"
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
			module: "./js/Qunit{name}.qunit",
			title: "QUnit test for Landscape {name}"
		},
		tests: {
			CLVEntityAction: {},
			CustomActions: {},
			CustomActionsLarge: {},
			CustomActionsRegular: {},
			DataContainer: {},
			EntityAction: {},
			EntityActions: {},
			IdentificationRegion: {},
			LandscapeEntity: {},
			LandscapeViewer: {},
			LinearRowField: {},
			ModellingStatus: {},
			NestedRowField: {},
			TreeRenderer: {}
		}
	};
});
