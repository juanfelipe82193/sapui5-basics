/* globals QUnit, sinon */

sap.ui.define([
	"sap/ui/core/Control", "sap/ui/comp/util/DateTimeUtil", "sap/ui/comp/smartfilterbar/FilterProvider", "sap/ui/comp/filterbar/VariantConverterTo", "sap/ui/comp/filterbar/VariantConverterFrom", "sap/ui/generic/app/navigation/service/SelectionVariant", "sap/m/DatePicker", "sap/m/MultiComboBox", "sap/m/MultiInput", "sap/m/DateRangeSelection", "sap/ui/model/json/JSONModel"
], function(Control, DateTimeUtil, FilterProvider, VariantConverterTo, VariantConverterFrom, SelectionVariant, DatePicker, MultiComboBox, MultiInput, DateRangeSelection, JSONModel) {
	"use strict";

	var oSuiteVariant = {
		"SelectionVariantID": "id_1418219091497_173",
		"SelectOptions": [
			{
				"PropertyName": "Bukrs",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "EQ",
						"Low": "F001",
						"High": null
					}
				]
			}, {
				"PropertyName": "Gjahr",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "EQ",
						"Low": "2012",
						"High": null
					}
				]
			}, {
				"PropertyName": "GSBER",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "EQ",
						"Low": "ML04",
						"High": null
					}
				]
			}, {
				"PropertyName": "PRCTR",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "EQ",
						"Low": "DDDDDDD",
						"High": null
					}, {
						"Sign": "I",
						"Option": "EQ",
						"Low": "ADFASDFASD",
						"High": null
					}
				]
			}, {
				"PropertyName": "ANLN1",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "EQ",
						"Low": "FRANZ",
						"High": null
					}
				]
			}, {
				"PropertyName": "Id",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "GT",
						"Low": "47",
						"High": ""
					}, {
						"Sign": "I",
						"Option": "BT",
						"Low": "id10",
						"High": "id21"
					}, {
						"Sign": "I",
						"Option": "EQ",
						"Low": "Id1",
						"High": ""
					}, {
						"Sign": "I",
						"Option": "CP",
						"Low": "Id0",
						"High": ""
					}
				]
			}, {
				"PropertyName": "Belnr",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "CP",
						"Low": "FRANZ",
						"High": ""
					}
				]
			}, {
				"PropertyName": "Buzei",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "EQ",
						"Low": "111",
						"High": ""
					}
				]
			}, {
				"PropertyName": "Kunnr",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "EQ",
						"Low": "AFU_14",
						"High": null
					}, {
						"Sign": "I",
						"Option": "EQ",
						"Low": "AFU_13",
						"High": null
					}, {
						"Sign": "I",
						"Option": "EQ",
						"Low": "14",
						"High": null
					}
				]
			}, {
				"PropertyName": "Augbl",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "CP",
						"Low": "1112",
						"High": ""
					}
				]
			}, {
				"PropertyName": "Dmbtr",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "BT",
						"Low": "100",
						"High": "200"
					}
				]
			}, {
				"PropertyName": "Sgtxt",
				"Ranges": []
			}, {
				"PropertyName": "AUFNR",
				"Ranges": []
			}, {
				"PropertyName": "BUDAT",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "BT",
						"Low": "2014-12-09T23:00:00.000Z",
						"High": "2014-12-19T23:00:00.000Z"
					}
				]
			}, {
				"PropertyName": "SAKNR",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "EQ",
						"Low": "1010",
						"High": null
					}
				]
			}
		],
		"Parameters": [
			{
				"PropertyName": "BLDAT",
				"PropertyValue": "2014-12-11T23:00:00.000Z"
			}
		]
	};

	QUnit.module("sap.ui.comp.filterbar.VariantConverterFrom", {
		beforeEach: function() {
			this.oVariantConverter = new VariantConverterFrom();
		},
		afterEach: function() {
		}
	});

	QUnit.test("Checking the convert method", function(assert) {

		var oMetaData = [
			{
				"groupName": "_BASIC",
				"fields": [
					{
						"fieldName": "Bukrs",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}, {
						"fieldName": "Gjahr",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}
				]
			}, {
				"groupName": "FieldGroup1",
				"groupLabel": "my Field Group 1",
				"fields": [
					{
						"fieldName": "GSBER",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false,
						"groupId": "FieldGroup1"
					}, {
						"fieldName": "PRCTR",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false,
						"groupId": "FieldGroup1"
					}
				]
			}, {
				"groupName": "CUSTOM_GROUP",
				"fields": [
					{
						"fieldName": "MyOwnFilterField",
						"groupId": "CUSTOM_GROUP",
						"control": null,
						"isCustomFilterField": true
					}
				]
			}, {
				"groupName": "GL_ACCOUNT",
				"fields": []
			}, {
				"groupName": "FieldGroup2",
				"groupLabel": "my Field Group 2",
				"fields": [
					{
						"fieldName": "ANLN1",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false,
						"groupId": "FieldGroup2"
					}, {
						"fieldName": "ANLN2",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false,
						"groupId": "FieldGroup2"
					}
				]
			}, {
				"groupName": "LineItems",
				"groupLabel": "LineItems",
				"fields": [
					{
						"fieldName": "Id",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "Belnr",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "Buzei",
						"type": "Edm.Decimal",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "Kunnr",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "Augbl",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "Dmbtr",
						"type": "Edm.Decimal",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "Sgtxt",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "Umskz",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "Zuonr",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "Blart",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "Hwaer",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "Name1",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "KOSTL",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "HKONT",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "SHKZG",
						"type": "Edm.String",
						"filterRestriction": "multiple",
						"isCustomFilterField": false
					}, {
						"fieldName": "AUFNR",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}, {
						"fieldName": "BUDAT",
						"type": "Edm.DateTime",
						"filterRestriction": "interval",
						"isCustomFilterField": false
					}, {
						"fieldName": "BLDAT",
						"type": "Edm.DateTime",
						"filterRestriction": "single",
						"isCustomFilterField": false
					}, {
						"fieldName": "SAKNR",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false
					}
				]
			}
		];

		var oFilterItem = {
			getGroupName: function() {
				return "GROUP";
			}
		};

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineFilterItemByName: function(sName) {
				return oFilterItem;
			},
			determineControlByName: function(sName) {
				return new Control();
			}
		};
		var sSuiteVariant = JSON.stringify(oSuiteVariant);
		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar);
		assert.ok(oResult);

	});

	QUnit.test("Checking the _addRangesAccordingMetaData method with _CUSTOM", function(assert) {

		var oContent = {};
		var oFilterMetaData = {
			isCustomFilterField: true,
			fieldName: "FIELD"
		};
		var aRanges = [
			{
				Low: "VALUE"
			}
		];

		this.oVariantConverter._addRangesAccordingMetaData(oContent, null, oFilterMetaData, aRanges, {}, "");
		assert.ok(oContent._CUSTOM);
		assert.ok(oContent._CUSTOM.FIELD);
		assert.equal(oContent._CUSTOM["FIELD"], "VALUE");
	});

	QUnit.test("Checking the _addRangesAccordingMetaData method with _CUSTOM with array of multiple values", function(assert) {

		var oContent = {};
		var oFilterMetaData = {
			isCustomFilterField: true,
			fieldName: "FIELD"
		};
		var aRanges = [
			{
				Low: "VALUE 1"
			},
			{
				Low: "VALUE 2"
			}
		];

		this.oVariantConverter._addRangesAccordingMetaData(oContent, null, oFilterMetaData, aRanges, {}, "");

		assert.deepEqual(oContent._CUSTOM["FIELD"], ["VALUE 1", "VALUE 2"]);
	});

	QUnit.test("Checking the _addRangesAccordingMetaData method with 'interval'", function(assert) {

		var oControl = {};

		var oContent = {};
		var oFilterMetaData = {
			isCustomFilterField: false,
			fieldName: "FIELD",
			filterRestriction: "interval"
		};

		this.oVariantConverter._addRangesAccordingMetaData(oContent, null, oFilterMetaData, [
			{
				Low: "LOW",
				High: "HIGH"
			}
		], oControl, "");
		assert.ok(oContent.FIELD);
		assert.ok(oContent.FIELD.low);
		assert.equal(oContent.FIELD.low, "LOW");
		assert.ok(oContent.FIELD.high);
		assert.equal(oContent.FIELD.high, "HIGH");

		oContent = {};
		this.oVariantConverter._addRangesAccordingMetaData(oContent, null, oFilterMetaData, [
			{
				Low: "LOW"
			}
		], oControl, "");
		assert.ok(oContent.FIELD);
		assert.ok(oContent.FIELD.low);
		assert.equal(oContent.FIELD.low, "LOW");
		assert.equal(oContent.FIELD.high, null);

		oContent = {};
		this.oVariantConverter._addRangesAccordingMetaData(oContent, null, oFilterMetaData, [
			{
				High: "HIGH"
			}
		], oControl, "");
		assert.ok(oContent.FIELD);
		assert.equal(oContent.FIELD.low, null);
		assert.ok(oContent.FIELD.high);
		assert.equal(oContent.FIELD.high, "HIGH");

	});

	QUnit.test("Checking the _addRangesAccordingMetaData method with 'multiple'", function(assert) {

		var oContent = {};
		var oFilterMetaData = {
			isCustomFilterField: false,
			fieldName: "FIELD",
			filterRestriction: "multiple"
		};

		var aRanges = [
			{
				Low: "LOW",
				High: "HIGH",
				Option: "EQ",
				Sign: "E"
			}
		];

		this.oVariantConverter._addRangesAccordingMetaData(oContent, null, oFilterMetaData, aRanges, new MultiComboBox(), "");
		assert.ok(oContent.FIELD);
		assert.ok(oContent.FIELD.items);
		assert.equal(oContent.FIELD.items.length, 1);
		assert.ok(oContent.FIELD.items[0]);
		assert.equal(oContent.FIELD.items[0].key, "LOW");

		this.oVariantConverter._addRangesAccordingMetaData(oContent, null, oFilterMetaData, aRanges, new MultiInput(), "");
		assert.ok(oContent.FIELD);
		assert.ok(oContent.FIELD.items);
		assert.equal(oContent.FIELD.items.length, 0);
		assert.ok(oContent.FIELD.ranges);
		assert.equal(oContent.FIELD.ranges.length, 1);
		assert.ok(oContent.FIELD.ranges[0]);
		assert.ok(oContent.FIELD.ranges[0].exclude);
		assert.equal(oContent.FIELD.ranges[0].value1, "LOW");

		oContent = {};
		this.oVariantConverter._addRangesAccordingMetaData(oContent, null, oFilterMetaData, aRanges, {}, "");
		assert.ok(oContent.FIELD);
		assert.ok(oContent.FIELD.ranges);
		assert.equal(oContent.FIELD.ranges.length, 1);
		assert.ok(oContent.FIELD.ranges[0]);
		assert.equal(oContent.FIELD.ranges[0].exclude, true);
		assert.equal(oContent.FIELD.ranges[0].operation, "EQ");
		assert.equal(oContent.FIELD.ranges[0].keyField, "FIELD");
		assert.equal(oContent.FIELD.ranges[0].value1, "LOW");
		assert.equal(oContent.FIELD.ranges[0].value2, "HIGH");

	});

	QUnit.test("Checking the _addRangesAccordingMetaData method with 'interval' and DateRangeSelection", function(assert) {
		var oControl = new DateRangeSelection();

		var oMetaData = [
			{
				"groupName": "_BASIC",
				"fields": [
					{
						"fieldName": "KeyDate",
						"type": "Edm.DateTime",
						"filterRestriction": "interval",
						"isCustomFilterField": false,
						"groupId": "_BASIC",
						"control": oControl
					}
				]
			}
		];

		var oSuiteFormat = {
			"SelectionVariantID": "4711",
			"Text": " ",
			"ODataFilterExpression": "",
			"Parameters": [],
			"SelectOptions": [
				{
					"PropertyName": "KeyDate",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "",
							"High": null
						}
					]
				}
			]
		};

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return oControl;
			}
		};

		var sSuiteVariant = JSON.stringify(oSuiteFormat);
		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar);
		assert.ok(oResult);
		assert.ok(oResult.payload);
		assert.equal(oResult.variantId, "4711");

		oResult = JSON.parse(oResult.payload);

		assert.equal(oResult.KeyDate.low, null);
		assert.equal(oResult.KeyDate.high, null);

		var oSelectionvariant = new SelectionVariant(sSuiteVariant);
		assert.ok(oSelectionvariant);
	});

	QUnit.test("Checking the _addRangesAccordingMetaData method with 'single' and DatePicker", function(assert) {
		var oControl = new DatePicker();

		var oMetaData = [
			{
				"groupName": "_BASIC",
				"fields": [
					{
						"fieldName": "KeyDate",
						"type": "Edm.DateTime",
						"filterRestriction": "single",
						"isCustomFilterField": false,
						"groupId": "_BASIC",
						"control": oControl
					}
				]
			}
		];

		var oSuiteFormat = {
			"SelectionVariantID": "4711",
			"Text": " ",
			"ODataFilterExpression": "",
			"Parameters": [],
			"SelectOptions": [
				{
					"PropertyName": "KeyDate",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "",
							"High": null
						}
					]
				}
			]
		};

		var oModel = new JSONModel({
			KeyDate: null
		});

		oControl.setModel(oModel, "TEST");

		oControl.bindProperty('dateValue', "TEST>/KeyDate");

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return oControl;
			}
		};

		var sSuiteVariant = JSON.stringify(oSuiteFormat);
		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar);
		assert.ok(oResult);
		assert.ok(oResult.payload);
		assert.equal(oResult.variantId, "4711");

		oResult = JSON.parse(oResult.payload);

		assert.equal(oResult.KeyDate, null);

		oModel.setData(oResult, true);

	});

	QUnit.test("Checking single DateTime field", function(assert) {
		var bUTC = false;
		var oControl = new DatePicker();

		var oMetaData = [
			{
				"groupName": "_BASIC",
				"fields": [
					{
						"fieldName": "BLDAT",
						"type": "Edm.DateTime",
						"filterRestriction": "single",
						"isCustomFilterField": false,
						"groupId": "_BASIC",
						"control": oControl
					}
				]
			}
		];
		var oParamMetaData = null;

		var oSuiteFormatZ = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "BLDAT",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "2015-08-13T22:00:00.000Z",
							"High": null
						}
					]
				}
			]
		};

		var oSuiteFormat = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "BLDAT",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "2015-08-13T22:00:00.000",
							"High": null
						}
					]
				}
			]
		};

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return oControl;
			},
			isInUTCMode: function() {
				return bUTC;
			},
			getAnalyticalParameters: function() {
				return oParamMetaData;
			}
		};

		var sSuiteVariant = JSON.stringify(oSuiteFormatZ);
		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar);
		assert.ok(oResult);
		assert.ok(oResult.payload);

		oResult = JSON.parse(oResult.payload);

		assert.equal(oResult.BLDAT, "2015-08-13T22:00:00.000Z");

		var oSelectionvariant = new SelectionVariant(sSuiteVariant);
		assert.ok(oSelectionvariant);

		sSuiteVariant = JSON.stringify(oSuiteFormat);
		var oResultResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar);
		assert.ok(oResultResult);
		assert.ok(oResultResult.payload);
		oResult = JSON.parse(oResultResult.payload);
		assert.equal(oResult.BLDAT, "2015-08-13T22:00:00.000Z");


		//TODO: this test is not working anymore when we change the timezone. Because it is not using or testing the VariantconvertFrom I have removed the test.
		// sinon.stub(Date.prototype, "getTimezoneOffset").returns(-2 * 60);

		// bUTC = true;
		// var oDate = DateTimeUtil.localToUtc(new Date(oResult.BLDAT));
		// oResult.BLDAT = oDate.toJSON();

		// var oVariantConverterTo = new VariantConverterTo();
		// oResult = oVariantConverterTo.convert("", [
		// 	{
		// 		name: "BLDAT"
		// 	}
		// ], oResultResult.payload, oFilterBar);
		// assert.ok(oResult);
		// var oResultObj = JSON.parse(oResult);
		// assert.equal(oResultObj.Parameters[0].PropertyValue, "2015-08-14T00:00:00.000");

		// Date.prototype.getTimezoneOffset.restore();
	});

	QUnit.test("Checking multiple DateTime fields", function(assert) {
		var oControl = new DatePicker();

		var oMetaData = [
			{
				"groupName": "_BASIC",
				"fields": [
					{
						"fieldName": "BLDAT",
						"type": "Edm.DateTime",
						"filterRestriction": "multiple",
						"isCustomFilterField": false,
						"groupId": "_BASIC",
						"control": oControl
					}
				]
			}
		];

		var oSuiteFormat = {
			"SelectionVariantID": "id_1418632009069_83",
			"SelectOptions": [
				{
					"PropertyName": "BLDAT",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "2015-02-28T23:00:00.000Z",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "2015-08-30T22:00:00.000Z",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "2015-08-01T22:00:00.000Z",
							"High": null
						}
					]
				}
			]
		};

		var oExpectedResult = {
			"BLDAT": {
				"ranges": [
					{
						"exclude": false,
						"operation": "EQ",
						"keyField": "BLDAT",
						"value1": "2015-02-28T23:00:00.000Z",
						"value2": null
					}, {
						"exclude": false,
						"operation": "EQ",
						"keyField": "BLDAT",
						"value1": "2015-08-30T22:00:00.000Z",
						"value2": null
					}, {
						"exclude": false,
						"operation": "EQ",
						"keyField": "BLDAT",
						"value1": "2015-08-01T22:00:00.000Z",
						"value2": null
					}
				],
				"items": [],
				"value": null
			}
		};

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return oControl;
			},
			_oFilterProvider: {
				_oDateFormatSettings: {
					UTC: false
				}
			}
		};

		var sSuiteVariant = JSON.stringify(oSuiteFormat);
		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar);
		assert.ok(oResult);
		assert.ok(oResult.payload);

		JSON.stringify(oResult.payload);
		var sExpectedResult = JSON.stringify(oExpectedResult);
		assert.equal(oResult.payload, sExpectedResult);

		var oSelectionvariant = new SelectionVariant(sSuiteVariant);
		assert.ok(oSelectionvariant);
	});

	QUnit.test("Checking auto DateTime field", function(assert) {
		var bUTC = false;

		var oControl = new DatePicker();

		var oMetaData = [
			{
				"groupName": "_BASIC",
				"fields": [
					{
						"fieldName": "BLDAT",
						"type": "Edm.DateTime",
						"filterRestriction": "auto",
						"isCustomFilterField": false,
						"groupId": "_BASIC",
						"control": oControl
					}
				]
			}
		];

		var oSuiteFormat = {
			"SelectionVariantID": "id_1418632009069_83",
			"SelectOptions": [
				{
					"PropertyName": "BLDAT",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "2015-02-28T23:00:00.000",
							"High": null
						}
					]
				}
			]
		};
		var oExpectedResult = {
			"BLDAT": {
				"ranges": [
					{
						"exclude": false,
						"operation": "EQ",
						"keyField": "BLDAT",
						"value1": "2015-02-28T23:00:00.000Z",
						"value2": null
					}
				],
				"items": [],
				"value": null
			}
		};

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return oControl;
			},
			isInUTCMode: function() {
				return bUTC;
			}
		};

		var sSuiteVariant = JSON.stringify(oSuiteFormat);
		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar);
		assert.ok(oResult);
		assert.ok(oResult.payload);
		assert.deepEqual(JSON.parse(oResult.payload), oExpectedResult);

		var oSelectionvariant = new SelectionVariant(sSuiteVariant);
		assert.ok(oSelectionvariant);

	});

	QUnit.test("Checking conditiontype filters", function(assert) {

		var oMetaData = [
			{
				"groupName": "_BASIC",
				"fields": [
					{
						"fieldName": "BLDAT",
						"type": "Edm.DateTime",
						"isCustomFilterField": false,
						"groupId": "_BASIC",
						"control": null,
						"conditiontype": {}
					}
				]
			}
		];

		var oSuiteFormat = {
			"SelectionVariantID": "id_1418632009069_83",
			"SelectOptions": [
				{
					"PropertyName": "BLDAT",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "2010-12-31T23:00:00.000Z",
							"High": "2015-12-31T22:59:59.999Z"
						}
					]
				}
			]
		};

		var oExpectedResult = {
			"BLDAT": {
				"ranges": [
					{
						"exclude": false,
						"operation": "BT",
						"keyField": "BLDAT",
						"value1": "2010-12-31T23:00:00.000Z",
						"value2": "2015-12-31T22:59:59.999Z"
					}
				],
				"items": [],
				"value": null
			}
		};

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return null;
			}
		};

		var sSuiteVariant = JSON.stringify(oSuiteFormat);
		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar);
		assert.ok(oResult);
		assert.ok(oResult.payload);

		var sExpectedResult = JSON.stringify(oExpectedResult);
		assert.equal(oResult.payload, sExpectedResult);

		var oSelectionvariant = new SelectionVariant(sSuiteVariant);
		assert.ok(oSelectionvariant);

	});

	QUnit.test("Checking Edm.Time filters", function(assert) {

		var oMetaData = [
			{
				"groupName": "LineItems",
				"fields": [
					{
						"fieldName": "TIME",
						"type": "Edm.Time",
						"filterRestriction": "auto",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}, {
						"fieldName": "TIME3",
						"type": "Edm.Time",
						"filterRestriction": "interval",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oParamMetaData = [
			{
				"fieldName": "$Parameter.P_TIME2",
				"type": "Edm.Time",
				"filterRestriction": "single",
				"groupId": "_BASIC"
			}
		];

		var oSuiteFormat = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "TIME",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "2016-08-26T20:00:00.000Z",
							"High": null
						}
					]
				}, {
					"PropertyName": "TIME3",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "2016-08-26T00:05:00.000Z",
							"High": "2016-08-27T00:05:00.000Z"
						}
					]
				}
			],
			"Parameters": [
				{
					"PropertyName": "TIME2",
					"PropertyValue": "2016-08-26T20:00:00.000Z"
				}
			]
		};

		var oExpectedResult = {
			"$Parameter.P_TIME2": "2016-08-26T20:00:00.000Z",
			"TIME": {
				"ranges": [
					{
						"exclude": false,
						"operation": "EQ",
						"keyField": "TIME",
						"value1": "2016-08-26T20:00:00.000Z",
						"value2": null
					}
				],
				"items": [],
				"value": null
			},
			"TIME3": {
				"ranges": [
					{
						"exclude": false,
						"operation": "BT",
						"keyField": "TIME3",
						"value1": "2016-08-26T00:05:00.000Z",
						"value2": "2016-08-27T00:05:00.000Z"
					}
				],
				"items": [],
				"value": null
			}
		};

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return null;
			},
			getAnalyticalParameters: function() {
				return oParamMetaData;
			}
		};

		var sSuiteVariant = JSON.stringify(oSuiteFormat);
		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar);
		assert.ok(oResult);
		assert.ok(oResult.payload);

		assert.deepEqual(JSON.parse(oResult.payload), oExpectedResult);

		var oSelectionvariant = new SelectionVariant(sSuiteVariant);
		assert.ok(oSelectionvariant);
	});

	QUnit.test("Checking Edm.String filters", function(assert) {

		var oMetaData = [
			{
				"groupName": "LineItems",
				"fields": [
					{
						"fieldName": "S1",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}, {
						"fieldName": "S2",
						"type": "Edm.String",
						"filterRestriction": "single",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}, {
						"fieldName": "S3",
						"type": "Edm.String",
						"filterRestriction": "interval",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}, {
						"fieldName": "S4",
						"type": "Edm.String",
						"filterRestriction": "multiple",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oSuiteFormat = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "S3",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "LOW",
							"High": "HIGH"
						}
					]
				}, {
					"PropertyName": "S4",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "CP",
							"Low": "LOW",
							"High": null
						}
					]
				}
			],
			"Parameters": [
				{
					"PropertyName": "S1",
					"PropertyValue": "VALUE"
				}, {
					"PropertyName": "S2",
					"PropertyValue": "VALUE"
				}
			]
		};

		var oExpectedResult = {
			"S1": {
				"ranges": [
					{
						"exclude": false,
						"operation": "EQ",
						"keyField": "S1",
						"value1": "VALUE",
						"value2": "VALUE"
					}
				],
				"items": [],
				"value": null
			},
			"S2": "VALUE",
			"S3": {
				"low": "LOW",
				"high": "HIGH"
			},
			"S4": {
				"ranges": [
					{
						"exclude": false,
						"operation": "Contains",
						"keyField": "S4",
						"value1": "LOW",
						"value2": null
					}
				],
				"items": [],
				"value": null
			}
		};

		var oSelectionvariant = new SelectionVariant(oSuiteFormat);
		assert.ok(oSelectionvariant);

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return null;
			}
		};

		var sSuiteVariant = JSON.stringify(oSuiteFormat);
		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar, true);
		assert.ok(oResult);
		assert.ok(oResult.payload);

		JSON.stringify(oResult.payload);
		var sExpectedResult = JSON.stringify(oExpectedResult);
		assert.equal(oResult.payload, sExpectedResult);
	});

	QUnit.test("Checking simple filter", function(assert) {

		var oMetaData = [
			{
				"groupName": "BASIC",
				"fields": [
					{
						"fieldName": "NAME",
						"type": "Edm.String",
						"isCustomFilterField": false,
						"filterRestriction": "single",
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return null;
			}
		};

		var oInternalOriginal = {
			"NAME": ""
		};
		var oSuiteFormat = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "NAME",
					"PropertyValue": ""
				}
			]
		};

		var sSuiteVariant = JSON.stringify(oSuiteFormat);

		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar, true);
		assert.ok(oResult);
		assert.ok(oResult.payload);
		assert.deepEqual(oInternalOriginal, JSON.parse(oResult.payload));

		var oSelectVariant = new SelectionVariant(oSuiteFormat);
		assert.ok(oSelectVariant);

		assert.equal(oSelectVariant.getParameter("NAME"), oSuiteFormat.Parameters[0].PropertyValue);

	});

	QUnit.test("Checking basic search", function(assert) {

		var sBasicSearchName = null;

		var oMetaData = [
			{
				"groupName": "BASIC",
				"fields": [
					{
						"fieldName": "NAME",
						"type": "Edm.String",
						"isCustomFilterField": false,
						"filterRestriction": "single",
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return null;
			},
			getBasicSearchName: function() {
				return sBasicSearchName;
			}
		};

		var oInternalOriginal = {
			"NAME": ""
		};
		var oSuiteFormat = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "NAME",
					"PropertyValue": ""
				}, {
					"PropertyName": "$EntitySet.basicSearch",
					"PropertyValue": "SEARCH"
				}
			]
		};

		var sSuiteVariant = JSON.stringify(oSuiteFormat);

		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar, true);
		assert.ok(oResult);
		assert.ok(oResult.payload);
		assert.deepEqual(oInternalOriginal, JSON.parse(oResult.payload));
		assert.ok(!oResult.basicSearch);

		var oSelectVariant = new SelectionVariant(oSuiteFormat);
		assert.ok(oSelectVariant);

		sBasicSearchName = "$EntitySet.basicSearch";
		oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar, true);
		assert.ok(oResult);
		assert.ok(oResult.payload);
		assert.deepEqual(oInternalOriginal, JSON.parse(oResult.payload));
		assert.ok(oResult.basicSearch);
		assert.ok(oResult.basicSearch, "SEARCH");

		oSelectVariant = new SelectionVariant(oSuiteFormat);
		assert.ok(oSelectVariant);

	});

	QUnit.test("Checking simple parameter in strict/non strict mode", function(assert) {

		var oMetaData = [
			{
				"fieldName": "$Parameter.P_NAME",
				"type": "Edm.String",
				"filterRestriction": "single",
				"groupId": "_BASIC"
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return null;
			},
			determineControlByName: function(sName) {
				return null;
			},
			getAnalyticalParameters: function() {
				return oMetaData;
			}
		};

		var oInternalOriginal = {
			"$Parameter.P_NAME": ""
		};
		var oSuiteFormat = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "NAME",
					"PropertyValue": ""
				}
			]
		};

		var sSuiteVariant = JSON.stringify(oSuiteFormat);

		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar, false);
		assert.ok(oResult);
		assert.ok(oResult.payload);
		assert.deepEqual(oInternalOriginal, JSON.parse(oResult.payload));

		oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar, true);
		assert.ok(oResult);
		assert.ok(oResult.payload);
		assert.deepEqual({}, JSON.parse(oResult.payload));
	});

	QUnit.test("Checking simple filter in strict/non strict mode", function(assert) {

		var oMetaData = [
			{
				"groupName": "BASIC",
				"fields": [
					{
						"fieldName": "NAME",
						"type": "Edm.String",
						"filterRestriction": "single",
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return null;
			},
			getAnalyticalParameters: function() {
				return null;
			}
		};

		var oInternalOriginal = {
			"NAME": ""
		};
		var oSuiteFormat = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "NAME",
					"PropertyValue": ""
				}
			]
		};

		var sSuiteVariant = JSON.stringify(oSuiteFormat);

		var oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar, false);
		assert.ok(oResult);
		assert.ok(oResult.payload);
		assert.deepEqual({}, JSON.parse(oResult.payload));

		oResult = this.oVariantConverter.convert(sSuiteVariant, oFilterBar, true);
		assert.ok(oResult);
		assert.ok(oResult.payload);
		assert.deepEqual(oInternalOriginal, JSON.parse(oResult.payload));

	});

	QUnit.test("Checking non strict mode, exact match", function(assert) {

		var oParamMetaData = [
			{
				"fieldName": "$Parameter.P_NAME1",
				"type": "Edm.String",
				"filterRestriction": "single",
				"groupId": "_BASIC"
			}
		];

		var oMetaData = [
			{
				"groupName": "BASIC",
				"fields": [
					{
						"fieldName": "NAME2",
						"type": "Edm.String",
						"filterRestriction": "single",
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return null;
			},
			getAnalyticalParameters: function() {
				return oParamMetaData;
			}
		};

		var oSuiteFormat = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "P_NAME1",
					"PropertyValue": ""
				}
			],

			"SelectOptions": [
				{
					"PropertyName": "NAME2",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "LOW",
							"High": "HIGH"
						}
					]
				}
			]
		};

		sinon.spy(this.oVariantConverter, "_getExactParameterMatch");
		sinon.spy(this.oVariantConverter, "_getExactFilterParameterMatch");

		this.oVariantConverter.convert(JSON.stringify(oSuiteFormat), oFilterBar, false);
		assert.ok(this.oVariantConverter._getExactParameterMatch.calledThrice);
		assert.ok(!this.oVariantConverter._getExactFilterParameterMatch.calledOnce);
	});

	QUnit.test("Checking _getParameterMetaDataNonStrictMode", function(assert) {

		var oParamMetaData = [
			{
				"fieldName": "$Parameter.P_NAME1",
				"type": "Edm.String",
				"filterRestriction": "single",
				"groupId": "_BASIC"
			}
		];

		var oMetaData = [
			{
				"groupName": "BASIC",
				"fields": [
					{
						"fieldName": "NAME2",
						"type": "Edm.String",
						"filterRestriction": "single",
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			determineControlByName: function(sName) {
				return null;
			},
			getAnalyticalParameters: function() {
				return oParamMetaData;
			}
		};

		sinon.spy(this.oVariantConverter, "_getExactParameterMatch");
		sinon.spy(this.oVariantConverter, "_getFilter");

		var oResult = this.oVariantConverter._getParameterMetaDataNonStrictMode("$Parameter.P_NAME1", oFilterBar, true);
		assert.ok(oResult);
		assert.equal(this.oVariantConverter._getExactParameterMatch.callCount, 1);
		assert.equal(this.oVariantConverter._getFilter.callCount, 0);

		this.oVariantConverter._getExactParameterMatch.reset();
		this.oVariantConverter._getFilter.reset();

		oResult = this.oVariantConverter._getParameterMetaDataNonStrictMode("P_NAME1", oFilterBar, true);
		assert.ok(oResult);
		assert.equal(this.oVariantConverter._getExactParameterMatch.callCount, 1);
		assert.equal(this.oVariantConverter._getFilter.callCount, 0);

		this.oVariantConverter._getExactParameterMatch.reset();
		this.oVariantConverter._getFilter.reset();

		oResult = this.oVariantConverter._getParameterMetaDataNonStrictMode("NAME1", oFilterBar, true);
		assert.ok(oResult);
		assert.equal(this.oVariantConverter._getExactParameterMatch.callCount, 2);
		assert.equal(this.oVariantConverter._getFilter.callCount, 0);

		this.oVariantConverter._getExactParameterMatch.reset();
		this.oVariantConverter._getFilter.reset();

		oResult = this.oVariantConverter._getParameterMetaDataNonStrictMode("$Parameter.NAME1", oFilterBar, true);
		assert.ok(oResult);
		assert.equal(this.oVariantConverter._getExactParameterMatch.callCount, 2);
		assert.equal(this.oVariantConverter._getFilter.callCount, 0);

		this.oVariantConverter._getExactParameterMatch.reset();
		this.oVariantConverter._getFilter.reset();

		oResult = this.oVariantConverter._getParameterMetaDataNonStrictMode("NAME2", oFilterBar, true);
		assert.ok(!oResult);
		assert.equal(this.oVariantConverter._getExactParameterMatch.callCount, 2);
		assert.equal(this.oVariantConverter._getFilter.callCount, 0);

		this.oVariantConverter._getExactParameterMatch.reset();
		this.oVariantConverter._getFilter.reset();

		oResult = this.oVariantConverter._getParameterMetaDataNonStrictMode("NAME2", oFilterBar, false);
		assert.ok(oResult);
		assert.equal(this.oVariantConverter._getExactParameterMatch.callCount, 2);
		assert.equal(this.oVariantConverter._getFilter.callCount, 1);

		this.oVariantConverter._getExactParameterMatch.reset();
		this.oVariantConverter._getFilter.reset();

		oResult = this.oVariantConverter._getParameterMetaDataNonStrictMode("$Parameter.NAME2", oFilterBar, false);
		assert.ok(!oResult);
		assert.equal(this.oVariantConverter._getExactParameterMatch.callCount, 2);
		assert.equal(this.oVariantConverter._getFilter.callCount, 1);

		this.oVariantConverter._getExactParameterMatch.reset();
		this.oVariantConverter._getFilter.reset();

		oResult = this.oVariantConverter._getParameterMetaDataNonStrictMode("P_NAME2", oFilterBar, false);
		assert.ok(!oResult);
		assert.equal(this.oVariantConverter._getExactParameterMatch.callCount, 2);
		assert.equal(this.oVariantConverter._getFilter.callCount, 1);

		this.oVariantConverter._getExactParameterMatch.reset();
		this.oVariantConverter._getFilter.reset();

		oResult = this.oVariantConverter._getParameterMetaDataNonStrictMode("HUGO", oFilterBar, false);
		assert.ok(!oResult);
		assert.equal(this.oVariantConverter._getExactParameterMatch.callCount, 2);
		assert.equal(this.oVariantConverter._getFilter.callCount, 1);

		this.oVariantConverter._getExactParameterMatch.reset();
		this.oVariantConverter._getFilter.reset();

		oResult = this.oVariantConverter._getParameterMetaDataNonStrictMode("HUGO", oFilterBar, true);
		assert.ok(!oResult);
		assert.equal(this.oVariantConverter._getExactParameterMatch.callCount, 2);
		assert.equal(this.oVariantConverter._getFilter.callCount, 0);

	});
	QUnit.start();
});
