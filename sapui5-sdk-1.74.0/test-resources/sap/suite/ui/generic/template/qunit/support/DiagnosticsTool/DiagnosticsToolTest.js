/*
 * tests for the sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
 */
/*global QUnit*/
sap.ui.define([
	"sap/suite/ui/generic/template/lib/testableHelper",
	"sap/suite/ui/generic/template/support/DiagnosticsTool/DiagnosticsTool",
	"sap/ui/core/support/Support"
], function (testableHelper, DiagnosticsTool, Support) {
	"use strict";

	var oSupportStub,
		oDiagnosticsTool,
		oPrivateStub;

	QUnit.module("support.DiagnosticsTool.DiagnosticsTool", {
		setup: function () {
			oPrivateStub = testableHelper.startTest();
			oSupportStub = Support.getStub();
			oDiagnosticsTool = new DiagnosticsTool(oSupportStub);
		},
		teardown: function () {
			testableHelper.endTest();
		}
	});

	// ------------------------------------ Static ------------------------------------
	/**
	 * Test method fnFormatDate of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnFormatDate", function (assert) {
		// correct formatted dates
		assert.equal(oPrivateStub.DiagnosticsTool_fnFormatDate("20180101"), "1/1/18", "Valid date, short form");
		assert.equal(oPrivateStub.DiagnosticsTool_fnFormatDate("20191231"), "12/31/19", "Valid date, long form");
		// wrong formatted dates
		assert.equal(oPrivateStub.DiagnosticsTool_fnFormatDate("2018010"), "", "Invalid date, missing number");
		assert.equal(oPrivateStub.DiagnosticsTool_fnFormatDate("20180132"), "", "Invalid date, invalid day");
	});

	/**
	 * Test private method fnGetManifestFromAppComponent of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnGetManifestFromAppComponent", function (assert) {
		var oComponent = {},
			oManifest;

		function updateComponent() {
			oComponent = {
				getMetadata: function () {
					return {
						getManifest: function () {
							return oManifest;
						}
					}
				}
			};
		}

		oManifest = undefined;
		updateComponent();
		assert.equal(oPrivateStub.fnGetManifestFromAppComponent(oComponent), undefined, "manifest is undefined");

		oManifest = {};
		updateComponent();
		assert.equal(oPrivateStub.fnGetManifestFromAppComponent(oComponent), undefined, "Empty object");

		oManifest = [];
		updateComponent();
		assert.equal(oPrivateStub.fnGetManifestFromAppComponent(oComponent), undefined, "Empty array");

		oManifest = {test: "Test"};
		updateComponent();
		assert.equal(oPrivateStub.fnGetManifestFromAppComponent(oComponent), oManifest, "Not empty object");

		oManifest = {test: {}};
		updateComponent();
		assert.equal(oPrivateStub.fnGetManifestFromAppComponent(oComponent), oManifest, "Not empty object, deep test");
	});

	// ------------------------------------ Instance ------------------------------------
	/**
	 * Test instantiating of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("Test instantiating of DiagnosticsTool at application instance", function (assert) {
		assert.equal(oSupportStub.getType(), "APPLICATION", "Check support instance type");
		assert.equal(oDiagnosticsTool.isAppPlugin(), true, "Check if plugin is available as application");
		assert.equal(oDiagnosticsTool.isToolPlugin(), true, "Check if plugin is available as tool");
		assert.equal(oDiagnosticsTool.runsAsToolPlugin(), false, "Check if plugin is application");
		assert.equal(oDiagnosticsTool.isActive(), false, "Check if plugin is active");
	});

	/**
	 * Test public method getId of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("getId", function (assert) {
		assert.equal(oDiagnosticsTool.getId(), "sapUiSupportFioriElementsPluginALPLROP", "Check plugin id");
	});

	/**
	 * Test multiple private methods by adding data to aData of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnAddToData, fnAddStringToData, fnAddLinkToData, fnAddGroupHeaderToData", function (assert) {
		oPrivateStub.fnResetData();
		assert.equal(oPrivateStub.fnGetData().length, 0, "Initial data is empty");

		oPrivateStub.fnAddToData("string", "Test", 0, "Test", "");
		assert.equal(oPrivateStub.fnGetData().length, 1, "Add Data: something was added to data");
		oPrivateStub.fnResetData();

		oPrivateStub.fnAddStringToData("Test String", 1, "bla");
		assert.equal(oPrivateStub.fnGetData().length, 1, "Add String: something was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].type, "string", "Add String: type is correct");
		assert.equal(oPrivateStub.fnGetData()[0].name, "Test String", "Add String: name is correct");
		assert.equal(oPrivateStub.fnGetData()[0].value, "bla", "Add String: value is correct");
		assert.equal(oPrivateStub.fnGetData()[0].order, 1, "Add String: order is correct");
		oPrivateStub.fnResetData();

		oPrivateStub.fnAddLinkToData("Test Link", 2, "Show this value", "http://www.google.de");
		assert.equal(oPrivateStub.fnGetData().length, 1, "Add Link: something was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].type, "link", "Add Link: type is correct");
		assert.equal(oPrivateStub.fnGetData()[0].name, "Test Link", "Add Link: name is correct");
		assert.equal(oPrivateStub.fnGetData()[0].value, "Show this value", "Add Link: value is correct");
		assert.equal(oPrivateStub.fnGetData()[0].target, "http://www.google.de", "Add Link: target is correct");
		assert.equal(oPrivateStub.fnGetData()[0].order, 2, "Add Link: order is correct");
		oPrivateStub.fnResetData();

		oPrivateStub.fnAddGroupHeaderToData("Test Group", 3);
		assert.equal(oPrivateStub.fnGetData().length, 1, "Add Group: something was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].type, "group", "Add Group: type is correct");
		assert.equal(oPrivateStub.fnGetData()[0].name, "Test Group", "Add Group: name is correct");
		assert.equal(oPrivateStub.fnGetData()[0].order, 3, "Add Group: order is correct");
		oPrivateStub.fnResetData();
	});

	/**
	 * Test private method fnDisplayError of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnDisplayError", function (assert) {
		oPrivateStub.fnResetData();
		oPrivateStub.fnDisplayError();
		assert.equal(oPrivateStub.fnGetData().length, 1, "Add Error: something was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].name, "Error", "Add Error: name is correct");
		assert.equal(oPrivateStub.fnGetData()[0].value, undefined, "Add Error: empty value is correct");
		assert.equal(oPrivateStub.fnGetData()[0].order, 0, "Add Error: order is correct");
		oPrivateStub.fnResetData();

		oPrivateStub.fnDisplayError("TestError");
		assert.equal(oPrivateStub.fnGetData()[0].value, "TestError", "Add Error: value is correct");
		oPrivateStub.fnResetData();
	});

	/**
	 * Test private method fnAddVersionInfo of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnAddVersionInfo", function (assert) {
		oPrivateStub.fnResetData();
		assert.ok(oPrivateStub.fnAddVersionInfo(1), "Some info about the version was found");
		assert.equal(oPrivateStub.fnGetData().length, 1, "Some info about the version was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].type, "string", "Add UI5 version: type is correct");
		assert.equal(oPrivateStub.fnGetData()[0].name, "OpenUI5 Version", "Add UI5 version: name is correct");
		assert.equal(oPrivateStub.fnGetData()[0].order, 1, "Add UI5 version: order is correct");
		oPrivateStub.fnResetData();
	});

	/**
	 * Test private method fnAddManifestLink of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnAddManifestLink", function (assert) {
		oPrivateStub.fnResetData();
		oPrivateStub.fnSetManifestPath("./demo/manifest.json");
		oPrivateStub.fnSetManifestURL("localhost");
		assert.ok(oPrivateStub.fnAddManifestLink(2), "Add manifest link: method returned success");
		assert.equal(oPrivateStub.fnGetData()[0].value, "demo/manifest.json", "Add manifest link: manifest path got shortened");
		assert.equal(oPrivateStub.fnGetData()[0].target, "localhost", "Add manifest link: target is correct");
		oPrivateStub.fnResetData();

		oPrivateStub.fnSetManifestPath("test/demo/manifest.json");
		assert.ok(oPrivateStub.fnAddManifestLink(2), "Add manifest link: method returned success");
		assert.equal(oPrivateStub.fnGetData()[0].value, "test/demo/manifest.json", "Add manifest link: manifest path is already shortened");
		assert.equal(oPrivateStub.fnGetData().length, 1, "Add manifest link: something was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].type, "link", "Add manifest link: type is correct");
		assert.equal(oPrivateStub.fnGetData()[0].name, "Manifest", "Add manifest link: name is correct");
		assert.equal(oPrivateStub.fnGetData()[0].order, 2, "Add manifest link: order is correct");
		oPrivateStub.fnResetData();
	});

	/**
	 * Test private method fnAddApplicationComponent of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnAddApplicationComponent", function (assert) {
		oPrivateStub.fnResetData();
		oPrivateStub.fnSetManifest({"sap.app": {ach: "TestComponent"}});
		assert.ok(oPrivateStub.fnAddApplicationComponent(3), "Add application component: method returned success");
		assert.equal(oPrivateStub.fnGetData().length, 1, "Add application component: something was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].type, "string", "Add application component: type is correct");
		assert.equal(oPrivateStub.fnGetData()[0].name, "Application Component (ACH)", "Add application component: name is correct");
		assert.equal(oPrivateStub.fnGetData()[0].value, "TestComponent", "Add application component: value is correct");
		assert.equal(oPrivateStub.fnGetData()[0].order, 3, "Add application component: order is correct");
		oPrivateStub.fnResetData();
	});

	/**
	 * Test private method fnAddFloorplanComponent of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnAddFloorplanComponent", function (assert) {
		oPrivateStub.fnResetData();
		oPrivateStub.fnSetManifest({"sap.ovp": {dummy: "Dummy"}});
		assert.ok(oPrivateStub.fnAddFloorplanComponent(4), "Add floorplan: method returned success");
		assert.equal(oPrivateStub.fnGetData().length, 1, "Add floorplan: something was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].type, "string", "Add floorplan: type is correct");
		assert.equal(oPrivateStub.fnGetData()[0].name, "Floorplan Component (ACH)", "Add floorplan: name is correct");
		assert.equal(oPrivateStub.fnGetData()[0].value, "CA-UI5-ST-OVP (sap.ovp)", "Add floorplan: value is correct");
		assert.equal(oPrivateStub.fnGetData()[0].order, 4, "Add floorplan: order is correct");
		oPrivateStub.fnResetData();
	});

	/**
	 * Test private method fnAddODataServiceMetadataLink of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnAddODataServiceMetadataLink", function (assert) {
		oPrivateStub.fnResetData();
		oPrivateStub.fnSetManifest({"sap.app": {dataSources: {dummyDataSource: {uri: "localhost/dummy/odata"}}}});
		assert.ok(oPrivateStub.fnAddODataServiceMetadataLink("dummyDataSource", 5), "Add OData metadata: method returned success");
		assert.equal(oPrivateStub.fnGetData().length, 1, "Add OData metadata: something was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].type, "link", "Add OData metadata: type is correct");
		assert.equal(oPrivateStub.fnGetData()[0].name, "OData Metadata", "Add OData metadata: name is correct");
		assert.equal(oPrivateStub.fnGetData()[0].value, "localhost/dummy/odata/$metadata", "Add OData metadata: value is correct");
		assert.equal(oPrivateStub.fnGetData()[0].order, 5, "Add OData metadata: order is correct");
		oPrivateStub.fnResetData();
	});

	/**
	 * Test private method fnAddAnnotationsLinks of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnAddAnnotationsLinks", function (assert) {
		oPrivateStub.fnResetData();
		oPrivateStub.fnSetsRootPath("localhost/webapp/");
		var oManifest = {
			"sap.app": {
				dataSources: {
					dummyDataSource: {
						settings: {
							annotations: ["dummyAnnotation"]
						}
					},
					dummyAnnotation: {
						uri: "local/annotation.xml"
					}
				}
			}
		};
		oPrivateStub.fnSetManifest(oManifest);
		assert.ok(oPrivateStub.fnAddAnnotationsLinks("dummyDataSource", 5), "Add annotations: method returned success");
		assert.equal(oPrivateStub.fnGetData().length, 1, "Add annotations: something was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].type, "link", "Add annotations: type is correct");
		assert.equal(oPrivateStub.fnGetData()[0].name, "Local Annotation (Prio. 1)", "Add annotations: name is correct");
		assert.equal(oPrivateStub.fnGetData()[0].value, "local/annotation.xml", "Add annotations: value is correct");
		assert.equal(oPrivateStub.fnGetData()[0].target, "localhost/webapp/local/annotation.xml", "Add annotations: target is correct");
		assert.equal(oPrivateStub.fnGetData()[0].order, 5, "Add annotations: order is correct");
		oPrivateStub.fnResetData();
	});

	/**
	 * Test private method fnAddDataSources of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnAddDataSources", function (assert) {
		oPrivateStub.fnResetData();
		oPrivateStub.fnSetsRootPath("localhost/webapp/");
		var oManifest = {
			"sap.app": {
				dataSources: {
					dummyDataSource: {
						uri: "/dummy/odata",
						settings: {
							annotations: ["dummyAnnotation"]
						}
					},
					dummyAnnotation: {
						uri: "local/annotation.xml"
					}
				}
			},
			"sap.ui5": {
				models: {
					"": {
						dataSource: "dummyDataSource"
					}
				}
			}
		};
		oPrivateStub.fnSetManifest(oManifest);
		oPrivateStub.fnAddDataSources(6);
		assert.ok(oPrivateStub.fnGetData().length > 0, "Add data sources: something was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].type, "group", "Add data sources: group type is correct");
		assert.ok(oPrivateStub.fnGetData()[0].order > 6 && oPrivateStub.fnGetData()[0].order < 7, "Add data sources: group order is correct");
		var fOrder = oPrivateStub.fnGetData()[0].order;
		assert.equal(oPrivateStub.fnGetData()[1].type, "link", "Add data sources: metadata type is correct");
		assert.equal(oPrivateStub.fnGetData()[1].value, "/dummy/odata/$metadata", "Add data sources: metadata value is correct");
		assert.ok(oPrivateStub.fnGetData()[1].order > fOrder, "Add data sources: link order is correct");
		fOrder = oPrivateStub.fnGetData()[1].order;
		assert.equal(oPrivateStub.fnGetData()[2].type, "link", "Add data sources: annotation type is correct");
		assert.equal(oPrivateStub.fnGetData()[2].value, "local/annotation.xml", "Add data sources: annotation value is correct");
		assert.ok(oPrivateStub.fnGetData()[2].order > fOrder, "Add data sources: link order is correct");
		oPrivateStub.fnResetData();
	});

	/**
	 * Test private method fnAddFioriID of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnAddFioriID", function (assert) {
		oPrivateStub.fnResetData();
		var oManifest = {"sap.fiori": {registrationIds: ["dummy1", "dummy2"]}};
		oPrivateStub.fnSetManifest(oManifest);

		assert.ok(oPrivateStub.fnAddFioriID(7), "Add Fiori ID: method returned success");
		assert.equal(oPrivateStub.fnGetData().length, 1, "Add Fiori ID: something was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].type, "string", "Add Fiori ID: type is correct");
		assert.equal(oPrivateStub.fnGetData()[0].name, "Fiori IDs", "Add Fiori ID: name is correct");
		assert.equal(oPrivateStub.fnGetData()[0].value, "dummy1, dummy2", "Add Fiori ID: value is correct");
		assert.equal(oPrivateStub.fnGetData()[0].order, 7, "Add Fiori ID: order is correct");
		oPrivateStub.fnResetData();
	});

	/**
	 * Test private method fnAddApplicationID of sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool
	 */
	QUnit.test("fnAddApplicationID", function (assert) {
		oPrivateStub.fnResetData();
		var oManifest = {"sap.app": {id: "dummy1"}};
		oPrivateStub.fnSetManifest(oManifest);

		assert.ok(oPrivateStub.fnAddApplicationID(8), "Add Application ID: method returned success");
		assert.equal(oPrivateStub.fnGetData().length, 1, "Add Application ID: something was added to data");
		assert.equal(oPrivateStub.fnGetData()[0].type, "string", "Add Application ID: type is correct");
		assert.equal(oPrivateStub.fnGetData()[0].name, "Application ID", "Add Application ID: name is correct");
		assert.equal(oPrivateStub.fnGetData()[0].value, "dummy1", "Add Application ID: value is correct");
		assert.equal(oPrivateStub.fnGetData()[0].order, 8, "Add Application ID: order is correct");
		oPrivateStub.fnResetData();
	});
});
