/*global QUnit*/

sap.ui.define([
	"test-resources/sap/ui/comp/qunit/smartmultiedit/TestUtils",
	"sap/ui/comp/smartmultiedit/Field",
	"sap/ui/comp/smartmultiedit/Container",
	"sap/ui/core/util/MockServer",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/Context",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (TestUtils, Field, Container, MockServer, SmartForm, Group, GroupElement, ODataModel, ResourceModel,
             Context, NumberFormat, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("Special cases");

	QUnit.test("Editing entity with creatable false and updatable not specified", function (assert) {
		var oMockServer = TestUtils.createMockServer("metadataUncreatable.xml"),
			i18nModel = TestUtils.createI18nModel();

		return TestUtils.createDataModel().then(function (oData) {
			var oDataModel = oData.oModel;

			var aContexts = [
				new Context(oDataModel, "/Employees('0002')"),
				new Context(oDataModel, "/Employees('0003')")
			];

			var oContainer = TestUtils.createContainer(aContexts, oDataModel, i18nModel, TestUtils.createSimpleSmartForm(["FirstName", "LastName"]));
			oContainer.placeAt("content");
			var oFirstNameField = oContainer.getFields()[0];
			oFirstNameField._updateSpecialSelectItems();
			oFirstNameField.setSelectedIndex(1);
			sap.ui.getCore().applyChanges();

			assert.equal(oFirstNameField.getSmartField().getEditable(), true, "Smart Filed should be editable.");

			oContainer.destroy();
			oMockServer.destroy();
		});
	});

	QUnit.test("Combo box without text annotation returns row value", function (assert) {
		var oMockServer = TestUtils.createMockServer("metadata.xml"),
			i18nModel = TestUtils.createI18nModel();

		return TestUtils.createDataModel().then(function (oData) {
			var oDataModel = oData.oModel;

			var aContexts = [
				new Context(oDataModel, "/Employees('0002')"),
				new Context(oDataModel, "/Employees('0003')")
			];

			var oContainer = TestUtils.createContainer(aContexts, oDataModel, i18nModel, TestUtils.createSimpleSmartForm(["GenderWithoutText"]));
			oContainer.placeAt("content");
			var oField = oContainer.getFields()[0];
			oField._updateSpecialSelectItems();
			oField.setSelectedIndex(1);
			sap.ui.getCore().applyChanges();

			var oValue = oField.getRawValue();
			assert.equal(Object.keys(oValue).length, 1, "Row value return only one value");
			assert.strictEqual(oValue.GenderWithoutText, "", "GenderWithoutText value returned");

			oContainer.destroy();
			oMockServer.destroy();
		});
	});

});
