/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/ODataTypes",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/comp/smartfield/Configuration",
	"sap/ui/model/odata/type/String",
	"sap/ui/comp/smartfield/FieldControl",
	"sap/ui/model/ParseException",
	"test-resources/sap/ui/comp/qunit/smartfield/data/TestModel.data"
],function(
	library,
	SmartField,
	ODataTypes,
	ODataControlFactory,
	ODataModel,
	Configuration,
	TypeString,
	FieldControl,
	ParseException,
	TestModelTestData
) {
"use strict";

	QUnit.module("sap.ui.comp.smartfield.ODataTypes", {
		beforeEach: function() {
			this.oParent = {
				getBindingInfo: function() {
					return null;
				},
				getMaxLength: function() {
					return 0;
				},
				getTextInEditModeSource: function() {
					return library.smartfield.TextInEditModeSource.None;
				},
				getMode: function() {
					return "edit";
				},
				getConfiguration: function() {
					return null;
				},
				getControlFactory: function() {
					return {
						_getDisplayBehaviourConfiguration: function() {
							return null;
						},
						oTextArrangementDelegate: {
							onBeforeValidateValue: function() {}
						}
					};
				},
				onBeforeValidateValue: function() {},
				getMandatory: function() {
					return false;
				},
				getClientSideMandatoryCheck: function() {
					return false;
				}
			};

			this.oModel = sinon.createStubInstance(ODataModel);
			this.oModel.getServiceMetadata = function() {
				return TestModelTestData.TestModel;
			};

			this.oMetaData = new ODataTypes(this.oParent);
		},
		afterEach: function() {
			this.oMetaData.destroy();
			this.oParent = null;
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oMetaData);
	});

	QUnit.test("getType shall return custom type", function(assert) {
		var oType = {
			name: "dummyType"
		};

		this.oMetaData._oParent.getBindingInfo = function() {
			return {
				type: oType
			};
		};

		var oResult = this.oMetaData.getType({
			property : {
				type: "Edm.Int64"
			}
		});

		// assert
		assert.strictEqual(oResult.name, "dummyType");
	});

	QUnit.test("getType : Int64", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.Int64"
			}
		});

		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.Int64");

		oType = this.oMetaData.getType();
		assert.notOk(oType);

		oType = this.oMetaData.getType({
			property: {
				type: "Edm.Dummy"
			}
		});
		assert.notOk(oType);
	});

	QUnit.test("getType : Int32", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.Int32"
			}
		});

		// assert
		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.Int32");
	});

	QUnit.test("getType : Int16", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.Int16"
			}
		});

		// assert
		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.Int16");
	});

	QUnit.test("getType : SByte", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.SByte"
			}
		});

		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.SByte");
	});

	QUnit.test("getType : Byte", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.Byte"
			}
		});

		// assert
		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.Byte");
	});

	QUnit.test("getType : Boolean", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.Boolean"
			}
		});

		// assert
		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.model.odata.type.Boolean");
	});

	// BCP: 1880044670
	QUnit.test("it should return an instance of the sap.ui.model.odata.type.Double class", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.Double"
			}
		});

		// assert
		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.Double");
	});

	QUnit.test("getType : String", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.String"
			}
		});

		// assert
		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.String");
	});

	QUnit.test("it should create the composite TextArrangementString data type", function(assert) {

		// arrange
		var sExpectedDisplayBehaviour = library.smartfield.DisplayBehaviour.idAndDescription;
		var oODataModel = new ODataModel("serviceURL");

		var oConfiguration = new Configuration({
			displayBehaviour: sExpectedDisplayBehaviour
		});

		var oSmartField = new SmartField({
			textInEditModeSource: "NavigationProperty",
			configuration: oConfiguration
		});

		oSmartField.setModel(oODataModel);
		var oODataControlFactory = new ODataControlFactory(oODataModel, oSmartField);

		this.stub(oSmartField, "getControlFactory").returns(oODataControlFactory);
		var oProperty = {
			property: {
				type: "Edm.String"
			},
			valueListAnnotation: {}
		};

		var mSettings = {
			composite: true
		};

		// act
		var oODataTypes = new ODataTypes(oSmartField);
		var oStringType = oODataTypes.getType(oProperty, null, null, mSettings);

		// assert
		assert.strictEqual(oStringType.getName(), "sap.ui.comp.smartfield.type.TextArrangementString");
		assert.strictEqual(oStringType.oFormatOptions.textArrangement, sExpectedDisplayBehaviour, 'it should evaluate the "displayBehaviour" setting of the "configuration" aggregation"');

		// cleanup
		oSmartField.destroy();
		oODataControlFactory.destroy();
		oODataTypes.destroy();
		oODataModel.destroy();
	});

	// BCP: 1870074566
	QUnit.test("it should map a simple OData type to a composite OData type", function(assert) {

		// arrange
		var oProperty = {
			property: {
				type: "Edm.String"
			},
			valueListAnnotation: {}
		};

		var mSettings = {
			composite: true
		};

		var mConstraints = {
			maxLength: 3
		};

		var oExternalType = new TypeString(null, mConstraints);
		this.stub(this.oParent, "getBindingInfo").withArgs("value").returns({
			type: oExternalType
		});

		// act
		var oType = this.oMetaData.getType(oProperty, null, mConstraints, mSettings);

		// assert
		assert.strictEqual(oType.getName(), "sap.ui.comp.smartfield.type.TextArrangementString");
		assert.strictEqual(oType.oConstraints.maxLength, 3);

		// cleanup
		oExternalType.destroy();
	});

	// BCP: 1870505874
	QUnit.test("getType() should decorate the data type object to support extra validation features", function(assert) {

		// arrange
		var oProperty = {
			property: {
				type: "Edm.String"
			}
		};

		var oExternalType = new TypeString();
		var oFieldControl = new FieldControl(this.oParent, {});
		oExternalType.oFieldControl = oFieldControl.getMandatoryCheck(oProperty);
		this.stub(this.oParent, "getBindingInfo").withArgs("value").returns({
			type: oExternalType
		});
		this.stub(this.oParent, "getMandatory").returns(true);
		this.stub(this.oParent, "getClientSideMandatoryCheck").returns(true);
		var oParseValueSpy = this.spy(oExternalType, "parseValue");
		var oDestroySpy = this.spy(oExternalType, "destroy");
		var oDecorateType = this.oMetaData.getType(oProperty);

		// act
		try {
			oDecorateType.parseValue("", "string");
		} catch (oException) {
			var MESSAGE = "The mandatory and clientSideMandatoryCheck control properties are set to true, " +
					  "therefore, the control should prevent nulled/empty values to be stored in the binding";

		// assert
			assert.ok(oException instanceof ParseException, MESSAGE);
		}

		assert.strictEqual(oParseValueSpy.callCount, 1, "the .parseValue() method of the original type should be called");

		// cleanup + act
		oDecorateType.destroy();

		// assert
		assert.strictEqual(oDestroySpy.callCount, 1, "the .destroy() method of the original type should be called");
	});

	QUnit.test("getType : Time", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.Time"
			}
		});

		// assert
		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.Time");
	});

	QUnit.test("getType: Guid", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.Guid"
			}
		});

		// assert
		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.Guid");
	});

	QUnit.test("getType : DateTime returning Date", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.DateTime",
				"sap:display-format": "Date"
			}
		});

		// assert
		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.DateTime");
	});

	QUnit.test("getType : DateTime returning DateTime", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.DateTime",
				"display-format" : "none",
				extensions: [{
					name: "display-format",
					value: "none",
					namespace: ""
				}]
			}
		});

		// assert
		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.DateTime");
	});

	QUnit.test("getType : DateTimeOffset returning DateTimeOffset", function(assert) {
		var oType = this.oMetaData.getType({
			property: {
				type: "Edm.DateTimeOffset"
			},
			extensions: {
				"display-format" : {
					value: "Date"
				}
			}
		});

		// assert
		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.DateTimeOffset");
	});

	QUnit.test("getType", function(assert) {
		var oProperty = JSON.parse("{\"property\":{\"name\":\"Amount\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"11\",\"scale\":\"2\",\"documentation\":[{\"text\":null,\"extensions\":[{\"name\":\"Summary\",\"value\":\"Preis fÃ¼r externe Verarbeitung.\",\"attributes\":[],\"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"},{\"name\":\"LongDescription\",\"value\":null,\"attributes\":[],\"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"}]}],\"extensions\":[{\"name\":\"unit\",\"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"extensions\":{\"sap:filterable\":{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:sortable\":{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:unit\":{\"name\":\"unit\",\"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}},\"typePath\":\"Amount\"}");
		var oType = this.oMetaData.getType(oProperty);

		// assert
		assert.strictEqual(oType.getMetadata().getName(), "sap.ui.comp.smartfield.type.Decimal");
	});

	QUnit.test("getUOMDisplayFormatter for non-currency", function(assert) {

		// act
		var fnFormatter = this.oMetaData.getDisplayFormatter({});

		// arrange
		var sMeasure = "10120.01",
			sUnit = "*",
			sFormattedValue1 = fnFormatter(sMeasure, sUnit),
			sFormattedValue2 = fnFormatter(sMeasure);

		// assert
		assert.strictEqual(sFormattedValue1, "");
		assert.strictEqual(sFormattedValue2, "");
	});

	QUnit.test("getUOMDisplayFormatter for currency", function(assert) {
		var fnFormatter = this.oMetaData.getDisplayFormatter({}, {
			currency: true
		});

		// arrange
		var sAmount = "10120.01",
			sCurrency = "*",
			sFormattedValue1 = fnFormatter(sAmount, sCurrency),
			sFormattedValue2 = fnFormatter(sAmount);

		// assert
		assert.strictEqual(sFormattedValue1, "");
		assert.strictEqual(sFormattedValue2, "");
	});

	QUnit.test("getUOMDisplayFormatter it should mask the currency value", function(assert) {
		var fnFormatter = this.oMetaData.getDisplayFormatter({}, {
			currency: true,
			mask: true
		});

		// arrange
		var sAmount = "100",
			sCurrency = "EUR",
			sFormattedValue = fnFormatter(sAmount, sCurrency);

		// assert
		assert.strictEqual(sFormattedValue, "*******");
	});

	// BCP: 1870178649
	QUnit.test("getUOMDisplayFormatter it should format the zero correctly", function(assert) {

		// system under test
		var fnFormatter = this.oMetaData.getUOMDisplayFormatter({});

		// arrange
		var vAmount = 0;
		var sCurrency = "PC";

		// act
		var sFormattedValue = fnFormatter(vAmount, sCurrency);

		// assert
		assert.strictEqual(sFormattedValue, "0" + "\u2008");
	});

	QUnit.test("_getDecimalConstraints", function(assert) {
		var oProperty = JSON.parse("{\"property\":{\"name\":\"Amount\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"11\",\"scale\":\"2\",\"documentation\":[{\"text\":null,\"extensions\":[{\"name\":\"Summary\",\"value\":\"Preis fÃ¼r externe Verarbeitung.\",\"attributes\":[],\"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"},{\"name\":\"LongDescription\",\"value\":null,\"attributes\":[],\"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"}]}],\"extensions\":[{\"name\":\"unit\",\"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"extensions\":{\"sap:filterable\":{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:sortable\":{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:unit\":{\"name\":\"unit\",\"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}},\"typePath\":\"Amount\"}");
		var oResult = this.oMetaData._getDecimalConstraints(oProperty);

		// assert
		assert.equal(oResult.scale, 2);
		assert.equal(oResult.precision, 11);
	});

	QUnit.test("_getDecimalConstraints - no precision", function(assert) {
		var oProperty = JSON.parse("{\"property\":{\"name\":\"Amount\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"11\",\"scale\":\"2\",\"documentation\":[{\"text\":null,\"extensions\":[{\"name\":\"Summary\",\"value\":\"Preis fÃ¼r externe Verarbeitung.\",\"attributes\":[],\"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"},{\"name\":\"LongDescription\",\"value\":null,\"attributes\":[],\"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"}]}],\"extensions\":[{\"name\":\"unit\",\"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"extensions\":{\"sap:filterable\":{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:sortable\":{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:unit\":{\"name\":\"unit\",\"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}},\"typePath\":\"Amount\"}");
		delete oProperty.property.precision;
		var oResult = this.oMetaData._getDecimalConstraints(oProperty);

		// assert
		assert.strictEqual(oResult.scale, 2);
		assert.strictEqual(!oResult.precision, true);
	});

	QUnit.test("_getMaxLength from OData property", function(assert) {
		var oParent = {
			getMaxLength: function() {
				return 0;
			},
			getBindingInfo: function() {
				return null;
			}
		};
		this.oMetaData._oParent = oParent;

		var iLen = this.oMetaData.getMaxLength({ property: { maxLength: 3 } });
		assert.strictEqual(iLen, 3);

		//take the minimum OData and maxLength prop on parent
		oParent.getMaxLength = function() {
			return 10;
		};
		iLen = this.oMetaData.getMaxLength({ property: { maxLength: 5 } });
		assert.strictEqual(iLen, 5);

		//take the minimum OData, maxLength prop on parent and constraint
		oParent.getMaxLength = function() {
			return 10;
		};

		iLen = this.oMetaData.getMaxLength({ property: {  maxLength: 5 } }, {
			constraints : {
				maxLength: 2
			}
		});
		assert.strictEqual(iLen, 2);

		//take the minimum OData, maxLength prop on parent and constraints on type
		oParent.getMaxLength = function() {
			return 10;
		};

		iLen = this.oMetaData.getMaxLength({ property: { maxLength: 5 } }, {
			type: {
				oConstraints : {
					maxLength: 2
				}
			}
		});
		assert.strictEqual(iLen, 2);
	});

	QUnit.test("it should evaluate the nullable constraint", function(assert) {

		// arrange
		var oProperty = JSON.parse("{\"property\":{\"name\":\"Amount\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"11\",\"scale\":\"2\",\"documentation\":[{\"text\":null,\"extensions\":[{\"name\":\"Summary\",\"value\":\"Preis fÃ¼r externe Verarbeitung.\",\"attributes\":[],\"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"},{\"name\":\"LongDescription\",\"value\":null,\"attributes\":[],\"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"}]}],\"extensions\":[{\"name\":\"unit\",\"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"extensions\":{\"sap:filterable\":{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:sortable\":{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:unit\":{\"name\":\"unit\",\"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}},\"typePath\":\"Amount\"}");

		// act
		var mConstraints = this.oMetaData.getConstraints(oProperty.property);

		// assert
		assert.strictEqual(mConstraints.nullable, false);
	});

	QUnit.test("it should evaluate the nullable constraint", function(assert) {

		// arrange
		var oProperty = JSON.parse("{\"property\":{\"name\":\"Amount\",\"type\":\"Edm.Decimal\",\"nullable\":\"true\",\"precision\":\"11\",\"scale\":\"2\",\"documentation\":[{\"text\":null,\"extensions\":[{\"name\":\"Summary\",\"value\":\"Preis fÃ¼r externe Verarbeitung.\",\"attributes\":[],\"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"},{\"name\":\"LongDescription\",\"value\":null,\"attributes\":[],\"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"}]}],\"extensions\":[{\"name\":\"unit\",\"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"extensions\":{\"sap:filterable\":{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:sortable\":{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:unit\":{\"name\":\"unit\",\"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}},\"typePath\":\"Amount\"}");

		// act
		var mConstraints = this.oMetaData.getConstraints(oProperty.property);

		// assert
		assert.strictEqual(mConstraints.nullable, true);
	});

	QUnit.test("_getStringConstraints", function(assert) {

		// arrange
		var oProperty = JSON.parse("{\"property\":{\"name\":\"Amount\",\"type\":\"Edm.Decimal\",\"nullable\":\"false\",\"precision\":\"11\",\"scale\":\"2\",\"documentation\":[{\"text\":null,\"extensions\":[{\"name\":\"Summary\",\"value\":\"Preis fÃ¼r externe Verarbeitung.\",\"attributes\":[],\"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"},{\"name\":\"LongDescription\",\"value\":null,\"attributes\":[],\"children\":[],\"namespace\":\"http://schemas.microsoft.com/ado/2008/09/edm\"}]}],\"extensions\":[{\"name\":\"unit\",\"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},\"extensions\":{\"sap:filterable\":{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:sortable\":{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:label\":{\"name\":\"label\",\"value\":\"Preis\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},\"sap:unit\":{\"name\":\"unit\",\"value\":\"AmountCurrency\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}},\"typePath\":\"Amount\"}");
		this.oMetaData._oParent = {
			getMaxLength: function() {
				return 3;
			},
			getBindingInfo: function() {
				return {
					type: {
						oConstraints : {
							equals: "00001"
						}
					}
				};
			}
		};

		// act
		var mConstraints = this.oMetaData._getStringConstraints(oProperty);

		// assert
		assert.strictEqual(mConstraints.equals, "00001");
		assert.strictEqual(mConstraints.maxLength, 3);
	});

	QUnit.test("getCurrencyType", function(assert) {

		// arrange
		var oProperty = {
			"property": {
			  "name": "Amount",
			  "type": "Edm.Decimal",
			  "nullable": "false",
			  "precision": "11",
			  "scale": "2",
			  "sap:unit": "AmountCurrency"
			}
		};

		// act
		var oCurrencyType = this.oMetaData.getCurrencyType(oProperty);

		// assert
		var oFormatOptions = oCurrencyType.oFormatOptions;
		var oConstraints = oCurrencyType.oConstraints;
		assert.strictEqual(oFormatOptions.precision, 11);
		assert.strictEqual(oFormatOptions.emptyString, 0);
		assert.strictEqual(oFormatOptions.showMeasure, false);
		assert.strictEqual(oFormatOptions.parseAsString, true);
		assert.strictEqual(oConstraints.precision, 11);
		assert.strictEqual(oConstraints.scale, 2);
	});

	// BCP: 1970394800
	QUnit.test('getCurrencyType() should set the "emptyString" format option to null when ' +
				'the EDM Property is nullable', function(assert) {

		// arrange
		var oProperty = {
			"property": {
			  "name": "Amount",
			  "type": "Edm.Decimal",
			  "nullable": "true",
			  "precision": "11",
			  "scale": "2",
			  "sap:unit": "AmountCurrency"
			}
		};

		// act
		var oCurrencyType = this.oMetaData.getCurrencyType(oProperty);

		// assert
		var oFormatOptions = oCurrencyType.oFormatOptions;
		assert.strictEqual(oFormatOptions.emptyString, null);
	});

	QUnit.test("getCurrencyType() should return null", function(assert) {

		// act
		var oCurrencyType = this.oMetaData.getCurrencyType();

		// assert
		assert.strictEqual(oCurrencyType, null);
	});

	QUnit.test("Shall be destructible", function(assert) {
		this.oMetaData.destroy();

		// assert
		assert.ok(this.oMetaData);
		assert.equal(this.oMetaData._oModel, null);
	});

	QUnit.start();
});
