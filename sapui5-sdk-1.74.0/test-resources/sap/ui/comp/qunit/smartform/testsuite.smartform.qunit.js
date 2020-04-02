sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.smartform'",
		defaults: {
			group: "SmartForm",
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
			"Group": {
				group: "SmartForm",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartform/Group.js"
				}
			},
			"GroupElement": {
				group: "SmartForm",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartform/GroupElement.js"
				}
			},
			"SmartForm": {
				group: "SmartForm",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartform/SmartForm.js"
				}
			},
			"flexibility/AddGroupElementAndRenameGroupElement": {
				group: "SmartForm",
				autostart: true,
				sinon: false,
				coverage: {
					only: [
						"sap/ui/comp/smartform/flexibility/changes"
					]
				},
				loader: {
					map: {
						"*": {
							"sap/ui/thirdparty/sinon": "sap/ui/thirdparty/sinon-4" // Force MockServer to work with sinon-4
						}
					}
				}
			},
			"flexibility/CombineSplitGroupElement": {
				group: "SmartForm",
				autostart: true,
				sinon: false,
				coverage: {
					only: [
						"sap/ui/comp/smartform/flexibility/changes"
					]
				},
				loader: {
					map: {
						"*": {
							"sap/ui/thirdparty/sinon": "sap/ui/thirdparty/sinon-4" // Force MockServer to work with sinon-4
						}
					}
				}
			},
			"flexibility/CreateAndRenameGroup": {
				group: "SmartForm",
				sinon: false,
				coverage: {
					only: "sap/ui/comp/smartform/flexibility/changes"
				}
			},
			"flexibility/GroupElementFlexibility": {
				group: "SmartForm",
				coverage: {
					only: "sap/ui/comp/smartform/flexibility/changes"
				}
			},
			"flexibility/MoveAndRemoveGroup": {
				group: "SmartForm",
				sinon: false,
				coverage: {
					only: "sap/ui/comp/smartform/flexibility/changes"
				}
			},
			"flexibility/MoveAndRemoveGroupElement": {
				group: "SmartForm",
				sinon: false,
				coverage: {
					only: "sap/ui/comp/smartform/flexibility/changes"
				}
			},
			"flexibility/RenameTitle": {
				group: "SmartForm",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartform/flexibility/changes"
				}
			},
			"flexibility/RevealGroupElement": {
				group: "SmartForm",
				sinon: false,
				coverage: {
					only: "sap/ui/comp/smartform/flexibility/changes"
				}
			}
		}
	};

	return oUnitTest;
});
