sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.navpopover'",
		defaults: {
			group: "NavPopover",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4
			},
			ui5: {
				language: "en-US",
				rtl: false,
				libs: [
					"sap.ui.comp"
				],
				"xx-waitForTheme": true
			},
			coverage: {
				only: "sap/ui/comp",
				branchCoverage: true
			},
			loader: {
				paths: {
					"sap/ui/comp/qunit": "test-resources/sap/ui/comp/qunit/",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/"
				}
			},
			autostart: false,
			module: "./{name}.qunit"
		},
		tests: {
			"NavigationPopoverPersonalization": {
				group: "Navpopover",
				sinon: false
			},
			"NavigationContainer": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/NavigationContainer.js"
				}
			},
			/*
			"ContactDetailsController": {
				group: "Navpopover"
			},
			*/
			"NavigationPopover": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/NavigationPopover.js"
				}
			},
			"NavigationPopoverHandler": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/NavigationPopoverHandler.js"
				}
			},
			"NavigationPopoverHandlerBindingContext": {
				group: "Navpopover"
			},
			"NavigationPopoverLog": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/Log.js"
				}
			},
			"NavigationPopoverUtil": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/Util.js"
				}
			},
			"SemanticObjectController": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/SemanticObjectController.js"
				}
			},
			"SmartLink": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/SmartLink.js"
				}
			},
			"opaTests/LinkContactAnnotation.opa": {
				group: "Navpopover"
			}
			/* Test Fails for unknown reasons. Was excluded for a long time...
			"opaTests/LinkPersonalization.opa": {
				group: "Navpopover"
			},
			*/
		}
	};

	return oUnitTest;
});
