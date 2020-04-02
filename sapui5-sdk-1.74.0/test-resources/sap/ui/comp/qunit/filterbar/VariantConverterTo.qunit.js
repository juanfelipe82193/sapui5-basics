/* globals QUnit */

sap.ui.define([
	"sap/ui/comp/smartfilterbar/FilterProvider",
	"sap/ui/comp/filterbar/VariantConverterTo",
	"sap/ui/generic/app/navigation/service/SelectionVariant"

], function(
	FilterProvider,
	VariantConverterTo,
	SelectionVariant
) {
	"use strict";

	var oInternalFilters = [
		{
			"group": "__$INTERNAL$",
			"name": "Bukrs",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": true
		}, {
			"group": "__$INTERNAL$",
			"name": "Gjahr",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": true
		}, {
			"group": "FieldGroup1",
			"name": "GSBER",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "FieldGroup1",
			"name": "PRCTR",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "CUSTOM_GROUP",
			"name": "MyOwnFilterField",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "FieldGroup2",
			"name": "ANLN1",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "FieldGroup2",
			"name": "ANLN2",
			"partOfCurrentVariant": false,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "Id",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "Belnr",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "Buzei",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "Kunnr",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "Augbl",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "Dmbtr",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "Sgtxt",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "Umskz",
			"partOfCurrentVariant": false,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "Zuonr",
			"partOfCurrentVariant": false,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "Blart",
			"partOfCurrentVariant": false,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "Hwaer",
			"partOfCurrentVariant": false,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "Name1",
			"partOfCurrentVariant": false,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "KOSTL",
			"partOfCurrentVariant": false,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "HKONT",
			"partOfCurrentVariant": false,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "SHKZG",
			"partOfCurrentVariant": false,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "AUFNR",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "BUDAT",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "BLDAT",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}, {
			"group": "LineItems",
			"name": "SAKNR",
			"partOfCurrentVariant": true,
			"visibleInFilterBar": false
		}
	];
	var oInternalOriginal = {
		"Bukrs": {
			"value": "",
			"ranges": [],
			"items": [
				{
					"key": "F001",
					"text": "Tools Inc. Europe (F001)"
				}
			]
		},
		"Gjahr": {
			"value": "2012",
			"ranges": [],
			"items": []
		},
		"GSBER": {
			"value": null,
			"ranges": [],
			"items": [
				{
					"key": "ML04",
					"text": "ML04"
				}
			]
		},
		"PRCTR": {
			"value": null,
			"ranges": [],
			"items": [
				{
					"key": "DDDDDDD",
					"text": "DDDDDDD"
				}, {
					"key": "ADFASDFASD",
					"text": "ADFASDFASD"
				}
			]
		},
		"ANLN1": {
			"value": "FRANZ",
			"ranges": [],
			"items": []
		},
		"ANLN2": {
			"value": null,
			"ranges": [],
			"items": []
		},
		"Id": {
			"value": null,
			"ranges": [
				{
					"exclude": false,
					"operation": "GT",
					"keyField": "Id",
					"value1": "47",
					"value2": ""
				}, {
					"exclude": false,
					"operation": "BT",
					"keyField": "Id",
					"value1": "id10",
					"value2": "id21"
				}, {
					"exclude": false,
					"operation": "EQ",
					"keyField": "Id",
					"value1": "Id1",
					"value2": ""
				}, {
					"exclude": false,
					"operation": "Contains",
					"keyField": "Id",
					"value1": "Id0",
					"value2": ""
				}
			],
			"items": []
		},
		"Belnr": {
			"value": "",
			"ranges": [
				{
					"exclude": false,
					"operation": "EndsWith",
					"keyField": "Belnr",
					"value1": "FRANZ",
					"value2": ""
				}, {
					"exclude": false,
					"operation": "StartsWith",
					"keyField": "Belnr",
					"value1": "FRANZ",
					"value2": ""
				}, {
					"exclude": false,
					"operation": "Contains",
					"keyField": "Belnr",
					"value1": "FRANZ",
					"value2": ""
				}
			],
			"items": []
		},
		"Buzei": {
			"value": null,
			"ranges": [
				{
					"exclude": false,
					"operation": "EQ",
					"keyField": "Buzei",
					"value1": 111,
					"value2": ""
				}
			],
			"items": []
		},
		"Kunnr": {
			"value": null,
			"ranges": [],
			"items": [
				{
					"key": "AFU_14",
					"text": "AFU_14 KG (AFU_14)"
				}, {
					"key": "AFU_13",
					"text": "AFU_13 VERTRIEBS GMBH (AFU_13)"
				}, {
					"key": "14",
					"text": "MAIER (14)"
				}
			]
		},
		"Augbl": {
			"value": null,
			"ranges": [
				{
					"exclude": false,
					"operation": "Contains",
					"keyField": "Augbl",
					"value1": "1112",
					"value2": ""
				}
			],
			"items": []
		},
		"Dmbtr": {
			"value": null,
			"ranges": [
				{
					"exclude": false,
					"operation": "BT",
					"keyField": "Dmbtr",
					"value1": 100,
					"value2": 200
				}
			],
			"items": []
		},
		"Sgtxt": {
			"value": null,
			"ranges": [],
			"items": []
		},
		"Umskz": {
			"value": null,
			"ranges": [],
			"items": []
		},
		"Zuonr": {
			"value": null,
			"ranges": [],
			"items": []
		},
		"Blart": {
			"value": null,
			"ranges": [],
			"items": []
		},
		"Hwaer": {
			"value": null,
			"ranges": [],
			"items": []
		},
		"Name1": {
			"value": null,
			"ranges": [],
			"items": []
		},
		"KOSTL": {
			"value": null,
			"ranges": [],
			"items": []
		},
		"HKONT": {
			"value": null,
			"ranges": [],
			"items": []
		},
		"SHKZG": {
			"value": null,
			"items": []
		},
		"AUFNR": {
			"value": null,
			"ranges": [],
			"items": []
		},
		"BUDAT": {
			"low": "2014-12-09T23:00:00.000Z",
			"high": "2014-12-19T23:00:00.000Z"
		},
		"BLDAT": "2014-12-11T23:00:00.000Z",
		"SAKNR": {
			"value": null,
			"ranges": [],
			"items": [
				{
					"key": "54000",
					"text": "54000"
				}, {
					"key": "34555",
					"text": "34555"
				}, {
					"key": "1600",
					"text": "1600"
				}, {
					"key": "1010",
					"text": "1010"
				}
			]
		}
	};
	var oSuiteResult = {
		"SelectionVariantID": "id_1418632009069_83",
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
				"PropertyName": "ANLN2",
				"Ranges": []
			}, {
				"PropertyName": "Id",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "GT",
						"Low": "47",
						"High": null
					}, {
						"Sign": "I",
						"Option": "BT",
						"Low": "id10",
						"High": "id21"
					}, {
						"Sign": "I",
						"Option": "EQ",
						"Low": "Id1",
						"High": null
					}, {
						"Sign": "I",
						"Option": "CP",
						"Low": "*Id0*",
						"High": null
					}
				]
			}, {
				"PropertyName": "Belnr",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "CP",
						"Low": "*FRANZ",
						"High": null
					}, {
						"Sign": "I",
						"Option": "CP",
						"Low": "FRANZ*",
						"High": null
					}, {
						"Sign": "I",
						"Option": "CP",
						"Low": "*FRANZ*",
						"High": null
					}
				]
			}, {
				"PropertyName": "Buzei",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "EQ",
						"Low": "111",
						"High": null
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
						"Low": "*1112*",
						"High": null
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
				"PropertyName": "Umskz",
				"Ranges": []
			}, {
				"PropertyName": "Zuonr",
				"Ranges": []
			}, {
				"PropertyName": "Blart",
				"Ranges": []
			}, {
				"PropertyName": "Hwaer",
				"Ranges": []
			}, {
				"PropertyName": "Name1",
				"Ranges": []
			}, {
				"PropertyName": "KOSTL",
				"Ranges": []
			}, {
				"PropertyName": "HKONT",
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
						"Low": "54000",
						"High": null
					}, {
						"Sign": "I",
						"Option": "EQ",
						"Low": "34555",
						"High": null
					}, {
						"Sign": "I",
						"Option": "EQ",
						"Low": "1600",
						"High": null
					}, {
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
				"PropertyName": "SHKZG",
				"PropertyValue": {
					"value": null,
					"items": []
				}
			}, {
				"PropertyName": "BLDAT",
				"PropertyValue": "2014-12-11T23:00:00.000Z"
			}
		]
	};

	QUnit.module("sap.ui.comp.filterbar.VariantConverterTo", {
		beforeEach: function() {
			this.oVariantConverter = new VariantConverterTo();
		},
		afterEach: function() {
		}
	});

	QUnit.test("Checking the convertToSuiteFormat method", function(assert) {

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return null;
			}
		};
		var sResult = this.oVariantConverter.convert("id_1418632009069_83", oInternalFilters, JSON.stringify(oInternalOriginal), oFilterBar);
		assert.equal(sResult, JSON.stringify(oSuiteResult));

	});

	QUnit.test("Checking the convertToSuiteFormat method: DateTime interval", function(assert) {

		var bUTC = true;

		var oMetaData = [
			{
				"groupName": "LineItems",
				"fields": [
					{
						"fieldName": "BUDAT",
						"type": "Edm.DateTime",
						"filterRestriction": "interval",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			isInUTCMode: function() {
				return bUTC;
			}
		};

		var oInternalFilters = [
			{
				"group": "LineItems",
				"name": "BUDAT",
				"partOfCurrentVariant": true,
				"visibleInFilterBar": false
			}
		];

		var oInternalOriginal = {
			"BUDAT": {
				"low": new Date(2014, 11, 10),
				"high": null
			}
		};

		var oExpectedUTCResult = {
			"SelectionVariantID": "id_1418632009069_83",
			"SelectOptions": [
				{
					"PropertyName": "BUDAT",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "2014-12-10T00:00:00.000",
							"High": "2014-12-10T00:00:00.000"
						}
					]
				}
			]
		};

		var sResult = this.oVariantConverter.convert("id_1418632009069_83", oInternalFilters, JSON.stringify(oInternalOriginal), oFilterBar);
		assert.equal(sResult, JSON.stringify(oExpectedUTCResult));

		oFilterBar._oFilterProvider = null;
	});

	QUnit.test("Checking multiple date fields", function(assert) {

		var bUTC = true;

		var oMetaData = [
			{
				"groupName": "LineItems",
				"fields": [
					{
						"fieldName": "BLDAT",
						"type": "Edm.DateTime",
						"filterRestriction": "multiple",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			isInUTCMode: function() {
				return bUTC;
			}
		};

		var oInternalFilters = [
			{
				"group": "LineItems",
				"name": "BLDAT",
				"partOfCurrentVariant": true,
				"visibleInFilterBar": false
			}
		];

		var oInternalOriginal = {
			"BLDAT": {
				"value": null,
				"items": [],
				"ranges": [
					{
						"exclude": false,
						"operation": "EQ",
						"keyField": "BLDAT",
						"value1": new Date(2015, 2, 1),
						"value2": "",
						"tokenText": "=Mar 1, 2015"
					}, {
						"exclude": false,
						"operation": "EQ",
						"keyField": "BLDAT",
						"value1": new Date(2015, 7, 31),
						"value2": "",
						"tokenText": "=Aug 31, 2015"
					}, {
						"exclude": false,
						"operation": "EQ",
						"keyField": "BLDAT",
						"value1": new Date(2015, 7, 2),
						"value2": "",
						"tokenText": "=Aug 2, 2015"
					}
				]
			}
		};

		var oExpectedUTCResult = {
			"SelectionVariantID": "id_1418632009069_83",
			"SelectOptions": [
				{
					"PropertyName": "BLDAT",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "2015-03-01T00:00:00.000",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "2015-08-31T00:00:00.000",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "2015-08-02T00:00:00.000",
							"High": null
						}
					]
				}
			]
		};

		var sResult = this.oVariantConverter.convert("id_1418632009069_83", oInternalFilters, JSON.stringify(oInternalOriginal), oFilterBar);
		assert.equal(sResult, JSON.stringify(oExpectedUTCResult));
	});

	QUnit.test("Checking single date field", function(assert) {

		var bUTC = true;

		var oMetaData = [
			{
				"groupName": "LineItems",
				"fields": [
					{
						"fieldName": "BLDAT",
						"type": "Edm.DateTime",
						"filterRestriction": "single",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			isInUTCMode: function() {
				return bUTC;
			}
		};

		var oInternalFilters = [
			{
				"group": "LineItems",
				"name": "BLDAT",
				"partOfCurrentVariant": true,
				"visibleInFilterBar": false
			}
		];

		var oInternalOriginal = {
			"BLDAT": new Date(2015, 7, 14)
		};

		var oExpectedUTCResult = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "BLDAT",
					"PropertyValue": "2015-08-14T00:00:00.000"
				}
			]
		};

		var sResult = this.oVariantConverter.convert("", oInternalFilters, JSON.stringify(oInternalOriginal), oFilterBar);
		assert.equal(sResult, JSON.stringify(oExpectedUTCResult));
	});

	QUnit.test("Checking custom data", function(assert) {
		var oInternalOriginal = {
			_CUSTOM: {
				Scaling: 0,
				Decimal: 2,
				ProfitLossType: 3,
				CurrencyType: 10,
				EmptyValue: ""
			}
		};

		var oExpectedResult = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "Scaling",
					"PropertyValue": "0"
				}, {
					"PropertyName": "Decimal",
					"PropertyValue": "2"
				},

				{
					"PropertyName": "ProfitLossType",
					"PropertyValue": "3"
				}, {
					"PropertyName": "CurrencyType",
					"PropertyValue": "10"
				}, {
					"PropertyName": "EmptyValue",
					"PropertyValue": ""
				}
			]
		};

		var sResult = this.oVariantConverter.convert("", oInternalFilters, JSON.stringify(oInternalOriginal), {});
		assert.equal(sResult, JSON.stringify(oExpectedResult));

		var oSelectVariant = new SelectionVariant(sResult);
		assert.ok(oSelectVariant);
	});

	QUnit.test("Checking custom data with array of values", function(assert) {
		var oInternalOriginal = {
			"_CUSTOM": {
				"ActivityArea": ["0100", "0110"]
			}
		};

		var oExpectedResult = {
			"SelectionVariantID": "",
			"SelectOptions": [{
				"PropertyName": "ActivityArea",
				"Ranges": [
					{
						"Sign": "I",
						"Option": "EQ",
						"Low": "0100",
						"High": null
					},
					{
						"Sign": "I",
						"Option": "EQ",
						"Low": "0110",
						"High": null
					}
				]
			}]
		};

		var sResult = this.oVariantConverter.convert("", [], JSON.stringify(oInternalOriginal), {});
		assert.deepEqual(JSON.parse(sResult), oExpectedResult);
	});


	QUnit.test("Checking Edm.Time", function(assert) {

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
						"fieldName": "TIME2",
						"type": "Edm.Time",
						"filterRestriction": "single",
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

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			}
		};

		var oInternalFilters = [
			{
				"group": "LineItems",
				"name": "TIME",
				"partOfCurrentVariant": true,
				"visibleInFilterBar": false
			}, {
				"group": "LineItems",
				"name": "TIME2",
				"partOfCurrentVariant": true,
				"visibleInFilterBar": false
			}, {
				"group": "LineItems",
				"name": "TIME3",
				"partOfCurrentVariant": true,
				"visibleInFilterBar": false
			}
		];

		var oInternalOriginal = {
			"TIME": {
				"value": null,
				"ranges": [
					{
						"exclude": false,
						"operation": "EQ",
						"keyField": "TIME",
						"value1": "2016-08-26T20:00:00.000Z",
						"value2": null
					}
				],
				"items": []
			},
			"TIME3": {
				"value": "",
				"ranges": [
					{
						"exclude": false,
						"operation": "BT",
						"keyField": "TIME3",
						"value1": "2016-08-26T00:05:00.000Z",
						"value2": "2016-08-26T20:00:00.000Z"
					}
				],
				"items": []
			},
			"TIME2": "2016-08-26T20:00:00.000Z"
		};

		var oExpectedNonUTCResult = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "TIME",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "2016-08-26T20:00:00.000",
							"High": null
						}
					]
				}, {
					"PropertyName": "TIME3",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "2016-08-26T00:05:00.000",
							"High": "2016-08-26T20:00:00.000"
						}
					]
				}
			],
			"Parameters": [
				{
					"PropertyName": "TIME2",
					"PropertyValue": "2016-08-26T20:00:00.000"
				}
			]
		};

		var sResult = this.oVariantConverter.convert("", oInternalFilters, JSON.stringify(oInternalOriginal), oFilterBar);
		assert.equal(sResult, JSON.stringify(oExpectedNonUTCResult));

		var oSelectVariant = new SelectionVariant(sResult);
		assert.ok(oSelectVariant);
	});

	QUnit.test("Checking range with value", function(assert) {

		var oMetaData = [
			{
				"groupName": "LineItems",
				"fields": [
					{
						"fieldName": "NAME",
						"type": "Edm.String",
						"filterRestriction": "auto",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			}
		};

		var oInternalOriginal = {
			"NAME": {
				"value": "SUNNY",
				"ranges": [],
				"items": []
			}
		};

		var oExpectedResult = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "NAME",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "SUNNY",
							"High": null
						}
					]
				}
			]
		};

		var sResult = this.oVariantConverter.convert("", [
			{
				name: "NAME"
			}
		], JSON.stringify(oInternalOriginal), oFilterBar);
		assert.equal(sResult, JSON.stringify(oExpectedResult));

		var oSelectVariant = new SelectionVariant(sResult);
		assert.ok(oSelectVariant);

		sResult = this.oVariantConverter.convert("", [
			{
				name: "NAME"
			}
		], JSON.stringify(oInternalOriginal), oFilterBar, false);
		assert.equal(sResult, JSON.stringify(oExpectedResult));

		oSelectVariant = new SelectionVariant(sResult);
		assert.ok(oSelectVariant);

	});

	QUnit.test("Checking simple custom filter", function(assert) {

		var oMetaData = [
			{
				"groupName": "BASIC",
				"fields": [
					{
						"fieldName": "TaxEntityId",
						"type": "Edm.String",
						"isCustomFilterField": true,
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			}
		};

		var oInternalOriginal = {
			"_CUSTOM": {
				"TaxEntityId": ""
			}
		};

		var oExpectedResult = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "TaxEntityId",
					"PropertyValue": ""
				}
			]
		};

		var sResult = this.oVariantConverter.convert("", [
			{
				name: "TaxEntityId"
			}
		], JSON.stringify(oInternalOriginal), oFilterBar);
		assert.equal(sResult, JSON.stringify(oExpectedResult));

		var oSelectVariant = new SelectionVariant(sResult);
		assert.ok(oSelectVariant);

		assert.equal(oSelectVariant.getParameter("TaxEntityId"), oExpectedResult.Parameters[0].PropertyValue);

	});

	QUnit.test("Checking basic search", function(assert) {

		var sBasicSearchName = null;

		var oMetaData = [
			{
				"groupName": "BASIC",
				"fields": [
					{
						"fieldName": "TaxEntityId",
						"type": "Edm.String",
						"isCustomFilterField": true,
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			},
			getBasicSearchName: function() {
				return sBasicSearchName;
			},
			getBasicSearchValue: function() {
				return "SEARCH";
			}
		};

		var oInternalOriginal = {
			"_CUSTOM": {
				"TaxEntityId": ""
			}
		};

		var oExpectedResult = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "TaxEntityId",
					"PropertyValue": ""
				}
			]
		};

		var oExpectedResult2 = {
			"SelectionVariantID": "",
			"Parameters": [
				{
					"PropertyName": "TaxEntityId",
					"PropertyValue": ""
				}, {
					"PropertyName": "$EntitySet.basicSearch",
					"PropertyValue": "SEARCH"

				}
			]
		};

		var sResult = this.oVariantConverter.convert("", [
			{
				name: "TaxEntityId"
			}
		], JSON.stringify(oInternalOriginal), oFilterBar);
		assert.equal(sResult, JSON.stringify(oExpectedResult));

		var oSelectVariant = new SelectionVariant(sResult);
		assert.ok(oSelectVariant);

		sBasicSearchName = "$EntitySet.basicSearch";
		sResult = this.oVariantConverter.convert("", [
			{
				name: "TaxEntityId"
			}
		], JSON.stringify(oInternalOriginal), oFilterBar);
		assert.equal(sResult, JSON.stringify(oExpectedResult2));

		oSelectVariant = new SelectionVariant(sResult);
		assert.ok(oSelectVariant);

	});

	QUnit.test("Checking simple custom filter Api:13", function(assert) {

		var oMetaData = [
			{
				"groupName": "BASIC",
				"fields": [
					{
						"fieldName": "TaxEntityId",
						"type": "Edm.String",
						"isCustomFilterField": true,
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			}
		};

		var oInternalOriginal = {
			"_CUSTOM": {
				"TaxEntityId": ""
			}
		};

		var oExpectedResult = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "TaxEntityId",
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

		var sResult = this.oVariantConverter.convert("", [
			{
				name: "TaxEntityId"
			}
		], JSON.stringify(oInternalOriginal), oFilterBar, "13.0");
		assert.equal(sResult, JSON.stringify(oExpectedResult));

		var oSelectVariant = new SelectionVariant(sResult);
		assert.ok(oSelectVariant);

		assert.equal(oSelectVariant.getSelectOption("TaxEntityId")[0].Low, oExpectedResult.SelectOptions[0].Ranges[0].Low);

	});

	QUnit.test("Checking Edm.Time Api:13", function(assert) {

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
						"fieldName": "TIME2",
						"type": "Edm.Time",
						"filterRestriction": "single",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}, {
						"fieldName": "$Parameter.P_TIME3",
						"type": "Edm.Time",
						"filterRestriction": "single",
						"isCustomFilterField": false,
						"groupId": "_BASIC"
					}
				]
			}
		];

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			}
		};

		var oInternalFilters = [
			{
				"group": "LineItems",
				"name": "TIME",
				"partOfCurrentVariant": true,
				"visibleInFilterBar": false
			}, {
				"group": "LineItems",
				"name": "TIME2",
				"partOfCurrentVariant": true,
				"visibleInFilterBar": false
			}, {
				"group": "LineItems",
				"name": "$Parameter.P_TIME3",
				"partOfCurrentVariant": true,
				"visibleInFilterBar": false
			}
		];

		var oInternalOriginal = {
			"TIME": {
				"value": null,
				"ranges": [
					{
						"exclude": false,
						"operation": "EQ",
						"keyField": "TIME",
						"value1": "2016-08-26T20:00:00.000Z",
						"value2": null
					}
				],
				"items": []
			},
			"TIME2": {
				"value": "2016-08-26T00:05:00.000Z",
				"ranges": [
					{
						"exclude": false,
						"operation": "EQ",
						"keyField": "TIME2",
						"value1": "2016-08-26T00:05:00.000Z",
						"value2": null
					}
				],
				"items": []
			},
			"$Parameter.P_TIME3": "2016-08-26T20:00:00.000Z"
		};

		var oExpectedResult = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "TIME",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "2016-08-26T20:00:00.000",
							"High": null
						}
					]
				}, {
					"PropertyName": "TIME2",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "2016-08-26T00:05:00.000",
							"High": null
						}
					]
				}
			],
			"Parameters": [
				{
					"PropertyName": "P_TIME3",
					"PropertyValue": "2016-08-26T20:00:00.000"
				}
			]
		};

		var sResult = this.oVariantConverter.convert("", oInternalFilters, JSON.stringify(oInternalOriginal), oFilterBar, "13.0");
		assert.equal(sResult, JSON.stringify(oExpectedResult));

		var oSelectVariant = new SelectionVariant(sResult);
		assert.ok(oSelectVariant);
	});

	QUnit.test("Checking single value interval for Edm.DateTimeOffset", function(assert) {

		var oInternalFilters = [
			{
				"group": "_BASIC",
				"name": "FieldInterval",
				"partOfCurrentVariant": true,
				"visibleInFilterBar": true
			}
		];
		var oDummy = {};
		oDummy.parseValue = function(sValue) { return new Date(sValue);};
		var oMetaData = [
			{
				"groupName": "BASIC",
				"fields": [
					{
						"fieldName": "FieldInterval",
						"type": "Edm.DateTimeOffset",
						"groupId": "_BASIC",
						filterRestriction: "interval",
						ui5Type: oDummy
					}
				]
			}
		];
		var oInternalOriginal = {
			"FieldInterval": {
				low: "2016-08-26T00:05:00.000Z - 2017-09-26T00:15:00.000Z",
				high: null
			}
		};

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			}
		};

		var oExpectedResult = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "FieldInterval",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "2016-08-26T00:05:00.000Z",
							"High": "2017-09-26T00:15:00.000Z"
						}
					]
				}
			]
		};

		var sResult = this.oVariantConverter.convert("", oInternalFilters, JSON.stringify(oInternalOriginal), oFilterBar, "13.0");
		assert.equal(sResult, JSON.stringify(oExpectedResult));

		oInternalOriginal = {
			"FieldInterval": {
				low: "2016-08-26T00:05:00.000Z",
				high: null
			}
		};

		oExpectedResult = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "FieldInterval",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "2016-08-26T00:05:00.000Z",
							"High": null
						}
					]
				}
			]
		};

		sResult = this.oVariantConverter.convert("", oInternalFilters, JSON.stringify(oInternalOriginal), oFilterBar, "13.0");
		assert.equal(sResult, JSON.stringify(oExpectedResult));

	});

	QUnit.test("Checking single value interval", function(assert) {

		var oInternalFilters = [
			{
				"group": "_BASIC",
				"name": "FieldInterval",
				"partOfCurrentVariant": true,
				"visibleInFilterBar": true
			}
		];

		var oMetaData = [
			{
				"groupName": "BASIC",
				"fields": [
					{
						"fieldName": "FieldInterval",
						"type": "Edm.Int32",
						"groupId": "_BASIC",
						filterRestriction: "interval"
					}
				]
			}
		];
		var oInternalOriginal = {
			"FieldInterval": {
				low: "1-100",
				high: null
			}
		};

		var oFilterBar = {
			getFilterBarViewMetadata: function() {
				return oMetaData;
			}
		};

		var oExpectedResult = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "FieldInterval",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "1",
							"High": "100"
						}
					]
				}
			]
		};

		var sResult = this.oVariantConverter.convert("", oInternalFilters, JSON.stringify(oInternalOriginal), oFilterBar, "13.0");
		assert.equal(sResult, JSON.stringify(oExpectedResult));

		oInternalOriginal = {
			"FieldInterval": {
				low: "-1--100",
				high: null
			}
		};
		oExpectedResult = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "FieldInterval",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "-1",
							"High": "-100"
						}
					]
				}
			]
		};

		sResult = this.oVariantConverter.convert("", oInternalFilters, JSON.stringify(oInternalOriginal), oFilterBar, "13.0");
		assert.equal(sResult, JSON.stringify(oExpectedResult));

		oInternalOriginal = {
			"FieldInterval": {
				low: "100",
				high: null
			}
		};
		oExpectedResult = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "FieldInterval",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "100",
							"High": null
						}
					]
				}
			]
		};

		sResult = this.oVariantConverter.convert("", oInternalFilters, JSON.stringify(oInternalOriginal), oFilterBar, "13.0");
		assert.equal(sResult, JSON.stringify(oExpectedResult));

		oInternalOriginal = {
			"FieldInterval": {
				low: "-1",
				high: null
			}
		};
		oExpectedResult = {
			"SelectionVariantID": "",
			"SelectOptions": [
				{
					"PropertyName": "FieldInterval",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "-1",
							"High": null
						}
					]
				}
			]
		};

		sResult = this.oVariantConverter.convert("", oInternalFilters, JSON.stringify(oInternalOriginal), oFilterBar, "13.0");
		assert.equal(sResult, JSON.stringify(oExpectedResult));

	});
	QUnit.start();
});
