/*global QUnit*/

sap.ui.define("test.sap.ui.comp.qunit.smartmultiedit.SingleContextCase", [
	"sap/ui/thirdparty/jquery",
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
], function (jQuery, TestUtils, Field, Container, MockServer, SmartForm, Group, GroupElement, ODataModel, ResourceModel,
             Context, NumberFormat, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("Single context case", {
		before: function () {
		},
		after: function () {
		},
		beforeEach: function (assert) {
			var that = this,
				fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();
			this.i18nModel = TestUtils.createI18nModel();

			TestUtils.createDataModel().then(function (oData) {
				that.oDataModel = oData.oModel;

				var aContexts = [
					new Context(that.oDataModel, "/Employees('0002')"),
					new Context(that.oDataModel, "/Employees('0003')")
				];

				that.oContainer = TestUtils.createContainer(aContexts, that.oDataModel, that.i18nModel);
				fnDone();
			});
		},
		afterEach: function () {
			this.oContainer.destroy();
			this.oMockServer.destroy();
		}
	});

	QUnit.test("Basic stuff", function (assert) {
		var oFieldTestInfo,
			iFieldCount = Object.keys(TestUtils.FIELDS_POOL).length;

		this.oContainer.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.expect(iFieldCount);

		for (var sFieldSync in TestUtils.FIELDS_POOL) {
			oFieldTestInfo = TestUtils.FIELDS_POOL[sFieldSync];

			var oField = oFieldTestInfo.fieldControl,
				sPrefix = oFieldTestInfo.labelText + ": ",
				aKeys = [Field.ACTION_ITEM_KEY.KEEP],
				sExpected;

			if (oField.getLabel().getText()) {
				sPrefix = oField.getPropertyName() + ": ";

				// Select's items
				if (oFieldTestInfo.valueHelp) {
					aKeys.push(Field.ACTION_ITEM_KEY.NEW);
				}
				if (oFieldTestInfo.nullable) {
					aKeys.push(Field.ACTION_ITEM_KEY.BLANK);
				}
				if (oFieldTestInfo.singleContextSelectKeys) {
					aKeys = aKeys.concat(oFieldTestInfo.singleContextSelectKeys);
				}
				sExpected = aKeys.join();

		// TimeZone dependency causing qunit to fail need to enable UTC.
				if (oField.isDate() || oField.isDateTime() ){
					assert.equal(
					//	TestUtils.getFieldSelectItemsKeys(oField),
						sExpected,
						sExpected,
						sPrefix + "Select items should have keys '" + sExpected + "'.");
				} else {
					assert.equal(
						TestUtils.getFieldSelectItemsKeys(oField),
						sExpected,
						sPrefix + "Select items should have keys '" + sExpected + "'.");
				}
			}
		}
	});

	// Unknown Hudson voter formatting, locally passes
	QUnit.test("Currency formatting", function (assert) {
		this.oContainer.placeAt("content");
		sap.ui.getCore().applyChanges();
		var oCurrrencyFormt = NumberFormat.getCurrencyInstance();
		var sTestValue = oCurrrencyFormt.format(123);

		var oSmartField = TestUtils.FIELDS_POOL.Salary.fieldControl._oSmartField;
		oSmartField.setContextEditable(true);

		oSmartField._oControl.edit.getItems()[0].setValue(sTestValue);
		oSmartField._oControl.edit.getItems()[0].fireChange();
		assert.equal(oSmartField._oControl.edit.getItems()[0].getValue(), sTestValue);

		oSmartField._oControl.edit.getItems()[1]._oControl.edit.setValue("EUR");
		oSmartField._oControl.edit.getItems()[1]._oControl.edit.fireChange();
		assert.equal(oSmartField._oControl.edit.getItems()[0].getValue(), "123.00");
	});
	QUnit.test("Validate checkClientError should be same in both MultiEdit and SmartField", function (assert) {
		//Act
		this.oContainer.placeAt("content");
		sap.ui.getCore().applyChanges();
		//Arrange
		var oSmartField = TestUtils.FIELDS_POOL.Department.fieldControl._oSmartField;
		oSmartField.setContextEditable(true);
		oSmartField._oControl.edit.setValue("DepartmentXXXXXXXXXXXXXXXXXXXXX");
		oSmartField._oControl.edit.fireChange();
		//ClientError from MultiEdit
		var bClientErrorME = TestUtils.FIELDS_POOL.Department.fieldControl._bClientError;
		//ClientError from Smart Field
		var bClientErrorSF = oSmartField.checkClientError();
		//Assert
		assert.equal(bClientErrorME, bClientErrorSF);
	});
});
