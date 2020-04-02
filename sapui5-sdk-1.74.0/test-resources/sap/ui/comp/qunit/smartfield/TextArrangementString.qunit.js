/*global QUnit, sinon*/
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/comp/smartfield/type/String",
	"sap/ui/comp/smartfield/type/TextArrangement",
	"sap/ui/comp/smartfield/type/TextArrangementString",
	"sap/ui/model/ParseException",
	"sap/ui/model/ValidateException",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"sap/m/Input",
	"sap/ui/model/odata/v2/ODataModel"
], function(
	library,
	StringType,
	TextArrangement,
	TextArrangementString,
	ParseException,
	ValidateException,
	SmartField,
	ODataControlFactory,
	Input,
	ODataModel) {
	"use strict";

	var TextInEditModeSource = library.smartfield.TextInEditModeSource;

	QUnit.module("");

	QUnit.test("it should return the name of the data type class", function(assert) {

		// assert
		assert.strictEqual(TextArrangement.prototype.getName.call(), "sap.ui.comp.smartfield.type.TextArrangement");
		assert.strictEqual(TextArrangementString.prototype.getName.call(), "sap.ui.comp.smartfield.type.TextArrangementString");
	});

	QUnit.test("it should return the name of the primary data type class", function(assert) {

		var oPrimaryType = TextArrangementString.prototype.getPrimaryType.call();

		// assert
		assert.strictEqual(oPrimaryType.prototype.getName(), "sap.ui.comp.smartfield.type.String");
	});

	QUnit.module("parse");

	QUnit.test("it should parse the ID only", function(assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "idOnly"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var vValue = oType.parseValue("ipsumID", "string");

		// assert
		assert.ok(Array.isArray(vValue));
		assert.strictEqual(vValue[0], "ipsumID");

		// cleanup
		oType.destroy();
	});

	QUnit.test("it should parse the empty string to null", function(assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "idAndDescription"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var aValues = oType.parseValue("", "string");
		var sID = aValues[0];
		var sDescription = aValues[1];

		// assert
		assert.strictEqual(sID, null);

		// BCP: 1880296799
		assert.strictEqual(sDescription, undefined, "it should NOT update the navigation property description");

		// cleanup
		oType.destroy();
	});

	QUnit.test('it should parse and extract the ID from the formatted value (copy/paste use case)', function(assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "idAndDescription"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var aValues = oType.parseIDAndDescription("GC (Graphics Card)", "string", [undefined, undefined], oFormatOptions);
		var sID = aValues[0];
		var sDescription = oType.sDescription;

		// assert
		assert.strictEqual(sID, "GC");
		assert.strictEqual(sDescription, "Graphics Card");

		// cleanup
		oType.destroy();
	});

	QUnit.test("it should raise a parse exception when the delimiter used to separate the ID from the description is" +
		"duplicated (delimiter collision problem)", function(assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "idAndDescription"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		try {

			// act
			oType.parseValue("GC (Graphics Card (additional details))", "string");
		} catch (oException) {

			// assert
			assert.ok(oException instanceof ParseException);
		}

		// cleanup
		oType.destroy();
	});

	QUnit.test("it should parse the description to the corresponding ID", function(assert) {

		// arrange
		var done = assert.async();
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [{
					ID: "LT",
					Text: "Laptop"
				}];
				mSettings.success(aData);
			}
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var oParseValuePromise = oType.parseValue("Laptop", "string");
		oParseValuePromise.then(function(aValues) {

			// arrange
			var sID = aValues[0];
			var sDescription = oType.sDescription;

			// assert
			assert.strictEqual(sID, "LT");
			assert.strictEqual(sDescription, "Laptop");

			// cleanup
			oType.destroy();
			done();
		});
	});

	QUnit.test("it should parse the ID to the corresponding description", function(assert) {

		// arrange
		var done = assert.async();
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [{
					ID: "LT",
					Text: "Laptop"
				}];
				mSettings.success(aData);
			}
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var oParseValuePromise = oType.parseValue("LT", "string");
		oParseValuePromise.then(function(aValues) {

			// arrange
			var sID = aValues[0];
			var sDescription = oType.sDescription;

			// assert
			assert.strictEqual(sID, "LT");
			assert.strictEqual(sDescription, "Laptop");

			// cleanup
			oType.destroy();
			done();
		});
	});

	QUnit.test("it should raise a validate exception when the description only can not be parsed (associated ID for" +
		"the description not found)", function(assert) {

		// arrange
		var done = assert.async();
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [{
					ID: "SS",
					Text: "Soundstation"
				}];

				mSettings.success(aData);
			}
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var oParseValuePromise = oType.parseValue("foo", "string");

		// assert
		oParseValuePromise.catch(function() {
			assert.ok(true);

			// cleanup
			oType.destroy();
			done();
		});
	});

	QUnit.test("it should raise a validate exception when the description can not be parsed (more IDs for the same" +
		"description test case 1)", function(assert) {

		// arrange
		var done = assert.async();
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};
		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [{
					ID: "SS",
					Text: "Soundstation"
				}, {
					ID: "ST",
					Text: "Soundstation"
				}];

				mSettings.success(aData);
			}
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var oParseValuePromise = oType.parseValue("Soundstation", "string");

		// assert
		oParseValuePromise.catch(function() {
			assert.ok(true);

			// cleanup
			oType.destroy();
			done();
		});
	});

	QUnit.test("it should raise a validate exception when the description can not be parsed (more IDs for the same " +
		"description test case 2)", function(assert) {

		// arrange
		var done = assert.async();
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};

		var sID = "SS";
		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [{
					ID: sID,
					Text: "Soundstation"
				},
				{
					ID: "LT",
					Text: sID
				}, {
					ID: "IP",
					Text: sID
				}];

				mSettings.success(aData);
			}
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var oParseValuePromise = oType.parseValue(sID, "string");
		oParseValuePromise.catch(function() {

			// assert
			assert.ok(true);

			// cleanup
			oType.destroy();
			done();
		});
	});

	QUnit.module("validate");

	QUnit.test("it should raise a validate exception when more descriptions were found for the same ID", function(assert) {

		// arrange
		var aValues = ["PR", undefined];
		var oRejectSpy = sinon.spy();
		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			data: [
				{
					ID: "PR",
					Text: "Product1"
				}, {
					ID: "PR",
					Text: "Product2"
				}
			],
			reject: oRejectSpy
		};

		// act
		var bReturn = TextArrangementString.prototype.validateIDAndDescription(aValues, oSettings);

		// assert
		assert.strictEqual(oRejectSpy.callCount, 1);
		assert.strictEqual(bReturn, false, "it should return false");
		assert.ok(oRejectSpy.args[0][0] instanceof ValidateException);
	});

	QUnit.test("it should not raise a validate exception", function(assert) {

		// arrange
		var aValues = ["PR", undefined];
		var oRejectSpy = sinon.spy();
		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			data: [
				{
					ID: "PR",
					Text: "Product"
				}
			],
			reject: oRejectSpy
		};

		// act
		var bReturn = TextArrangementString.prototype.validateIDAndDescription(aValues, oSettings);

		// assert
		assert.strictEqual(oRejectSpy.callCount, 0);
		assert.strictEqual(bReturn, true);
	});

	QUnit.test("it should return undefined", function(assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};
		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};
		var aValues = ["LT", undefined];

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var vReturn = oType.validateValue(aValues);

		// assert
		assert.strictEqual(vReturn, undefined);

		// cleanup
		oType.destroy();
	});

	QUnit.test("it should call the .validateValue() method of the primary data type", function(assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};
		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};
		var aValues = ["LT", undefined];
		var oPrimaryTypeValidateValueStub = this.stub(StringType.prototype, "validateValue");

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		oType.validateValue(aValues);

		// assert
		assert.strictEqual(oPrimaryTypeValidateValueStub.args[0][0], "LT");
		assert.ok(oPrimaryTypeValidateValueStub.calledOn(oType));

		// cleanup
		oType.destroy();
	});

	QUnit.test("it should not raise a reference error", function(assert) {

		// arrange
		var done = assert.async();
		var oFormatOptions = {
			textArrangement: "idAndDescription"
		};
		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [];
				mSettings.success(aData);
			}
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var vValue = oType.parseValue("ipsum", "string");
		var oValidateValuePromise = oType.validateValue(vValue, "string");

		// assert
		oValidateValuePromise.catch(function() {
			assert.ok(true);

			// cleanup
			oType.destroy();
			done();
		});
	});

	QUnit.test("it should not raise a validate exception when the nullable constraint is set to true and the value " +
		"is empty", function(assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "idAndDescription"
		};

		var oConstraints = {
			nullable: true
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, oConstraints, oSettings);

		// act
		var vValue = oType.parseValue("", "string");
		var vParseValueReturn = oType.validateValue(vValue, "string");

		// assert
		assert.strictEqual(vParseValueReturn, undefined);

		// cleanup
		oType.destroy();
	});

	QUnit.test("it should call the OData model read method", function(assert) {

		// arrange
		var oSmartField = new SmartField({
			textInEditModeSource: TextInEditModeSource.ValueList
		});
		var oInputHosted = new Input();
		var oModel = new ODataModel("serviceURL");
		oSmartField.setModel(oModel);
		var oModelRead = this.spy(oModel, "read");
		oSmartField.setContent(oInputHosted);
		oSmartField._oControl.edit = oInputHosted;
		oSmartField._oFactory = new ODataControlFactory(oModel, oSmartField);
		var oTextArrangementDelegate = oSmartField._oFactory.oTextArrangementDelegate;

		var oFormatOptions = {
			textArrangement: "idAndDescription"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: oTextArrangementDelegate.onBeforeValidateValue.bind(oTextArrangementDelegate)
		};

		this.stub(oSmartField, "getBindingContext").returns({});
		this.stub(oInputHosted, "getBinding").withArgs("value").returns({
			getType: function() {
				return {
					vRawID: "lorem"
				};
			},
			getValue: jQuery.noop
		});

		this.stub(oSmartField, "getControlFactory").returns({
			getDataProperty: function() {
				return {
					keyField: "ID",
					descriptionField: "Text",
					entitySetName: "ProductCategories"
				};
			},
			getMetaData: function() {
				return {
					property: {
						valueListAnnotation: {
							keyField: "ID",
							descriptionField: "Text",
							entitySetName: "ProductCategories"
						},
						valueListEntitySet: {
							name: "ProductCategories"
						}
					}
				};
			}
		});

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var aValues = oType.parseValue("PR", "string");
		oType.validateValue(aValues);

		// assert
		assert.strictEqual(oModelRead.callCount, 1);

		// cleanup
		oSmartField.destroy();
		oType.destroy();
	});

	QUnit.test("it should not invoke the OData model read method to prevent an unnecessary HTTP filter request to be " +
		"sent", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oModel = new ODataModel("serviceURL");
		oSmartField.setModel(oModel);
		var oModelRead = this.spy(oModel, "read");
		oSmartField._oFactory = new ODataControlFactory(oModel, oSmartField);
		var oTextArrangementDelegate = oSmartField._oFactory.oTextArrangementDelegate;

		var oFormatOptions = {
			textArrangement: "idAndDescription"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: oTextArrangementDelegate.onBeforeValidateValue.bind(oTextArrangementDelegate)
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var aValues = oType.parseValue("PR", "string");
		oType.validateValue(aValues);

		// assert
		assert.strictEqual(oModelRead.callCount, 0);

		// cleanup
		oSmartField.destroy();
		oType.destroy();
	});

	QUnit.module("format");

	QUnit.test('it should format the value to "ID (Description)"', function(assert) {

		// arrange
		var aValues = ["PR", "Projector"];
		var oFormatOptions = {
			textArrangement: "idAndDescription"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// act
		var sValue = oType.formatValue(aValues, "string");

		// assert
		assert.strictEqual(sValue, "PR (Projector)");

		// cleanup
		oType.destroy();
	});

	QUnit.test('it should format the value to an empty string (ID only test case)', function(assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "idOnly"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// assert
		assert.strictEqual(oType.formatValue([null, "Lorem Ipsum"], "string"), "");

		// cleanup
		oType.destroy();
	});

	QUnit.test("it should format the value to an empty string (ID and description test case)", function(assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "idAndDescription"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// assert
		assert.strictEqual(oType.formatValue([null, "Lorem Ipsum"], "string"), "");

		// cleanup
		oType.destroy();
	});

	QUnit.test("it should format the value to an empty string (description and ID test case)", function(assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "descriptionAndId"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// assert
		assert.strictEqual(oType.formatValue([null, "Lorem Ipsum"], "string"), "");

		// cleanup
		oType.destroy();
	});

	QUnit.test("it should format the value to an empty string (description only test case)", function(assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		// system under test
		var oType = new TextArrangementString(oFormatOptions, null, oSettings);

		// assert
		assert.strictEqual(oType.formatValue([null, "Lorem Ipsum"], "string"), "");

		// cleanup
		oType.destroy();
	});

	QUnit.start();
});
