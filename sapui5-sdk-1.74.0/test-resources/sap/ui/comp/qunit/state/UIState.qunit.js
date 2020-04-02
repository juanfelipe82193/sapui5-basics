/* globals QUnit, sinon */

sap.ui.define([
	"sap/ui/comp/state/UIState",
	"sap/base/util/merge"

], function(
	UIState,
	merge) {
	"use strict";

	QUnit.module("sap.ui.comp.state.UIState", {
		beforeEach: function() {
			this.oUiState = new UIState();
		},
		afterEach: function() {
			this.oUiState.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oUiState, "shall not be null");
	});

	QUnit.test("checking calculateValueTexts", function(assert) {
		var oValueState, oSelectionVariant = {
			SelectOptions: [
				{
					"PropertyName": "Bukrs",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "0001",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "ARG1",
							"High": null
						}
					]
				}
			]
		};

		var oExpectedValueState = {
			Texts: [
				{
					ContextUrl: "",
					Language: "en",
					PropertyTexts: [
						{
							PropertyName: "Bukrs",
							ValueTexts: [
								{
									PropertyValue: "0001",
									Text: "SAP"
								}, {
									PropertyValue: "ARG1",
									Text: "SAP2"
								}
							]
						}
					]
				}
			]
		};

		sinon.stub(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(), "getLanguage").returns("en");

		oValueState = UIState.calculateValueTexts(oSelectionVariant, {});
		assert.ok(!oValueState);

		oSelectionVariant.SelectOptions[0].Ranges[0];
		oValueState = UIState.calculateValueTexts(oSelectionVariant, {
			"Bukrs": {
				ranges: [],
				items: [
					{
						key: "0001",
						text: "SAP"
					}, {
						key: "ARG1",
						text: "SAP2"
					}
				]
			}
		});
		assert.ok(oValueState);
		assert.deepEqual(oValueState, oExpectedValueState);

		sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().getLanguage.restore();
	});

	QUnit.test("checking enrichWithValueTexts", function(assert) {
		var oExpectedResult = {}, oValueState, sPayload, oPayload = {
			"Bukrs": {
				"ranges": [
					{
						"exclude": false,
						"operation": "EQ",
						"keyField": "Bukrs",
						"value1": "0001",
						"value2": null
					}, {
						"exclude": false,
						"operation": "EQ",
						"keyField": "Bukrs",
						"value1": "ARG1",
						"value2": null
					}
				]
			}
		};

		sPayload = JSON.stringify(oPayload);
		merge(oExpectedResult, oPayload);
		oExpectedResult["Bukrs"].ranges.splice(0, 1);
		oExpectedResult["Bukrs"].items = [
			{
				key: "0001",
				text: "SAP"
			}
		];

		oValueState = {
			Texts: [
				{
					ContextUrl: "",
					Language: "en",
					PropertyTexts: [
						{
							PropertyName: "Bukrs",
							ValueTexts: [
								{
									PropertyValue: "0001",
									Text: "SAP"
								}
							]
						}
					]
				}
			]
		};

		sinon.stub(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(), "getLanguage").returns("en");

		var sResult = UIState.enrichWithValueTexts(sPayload, oValueState);
		assert.ok(sResult);
		assert.deepEqual(JSON.parse(sResult), oExpectedResult);

		sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().getLanguage.restore();
	});

	QUnit.module("sap.ui.comp.state.UIState: API", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});
	var fnDefault01 = function(assert, oUiState) {
		assert.equal(oUiState.getPresentationVariant(), undefined);
		assert.equal(oUiState.getSelectionVariant(), undefined);
		assert.equal(oUiState.getVariantName(), undefined);
		assert.equal(oUiState.getValueTexts(), undefined);
	};
	QUnit.test("Defaults", function(assert) {
		fnDefault01(assert, new UIState());
	});

	var fnDefault02 = function(assert, oUiState, oExpectedValue) {
		assert.deepEqual(oUiState.getPresentationVariant(), oExpectedValue);
		assert.equal(oUiState.getSelectionVariant(), undefined);
		assert.equal(oUiState.getVariantName(), undefined);
		assert.equal(oUiState.getValueTexts(), undefined);
	};
	QUnit.test("only presentationVariant", function(assert) {
		var oExpectedValue = {
			ContextUrl: "",
			MaxItems: 3,
			SortOrder: [],
			GroupBy: [],
			Total: [],
			RequestAtLeast: [],
			Visualizations: []
		};
		fnDefault02(assert, new UIState({
			presentationVariant: oExpectedValue
		}), oExpectedValue);
	});

	var fnDefault03 = function(assert, oUiState, oExpectedValue) {
		assert.deepEqual(oUiState.getSelectionVariant(), oExpectedValue);
		assert.equal(oUiState.getPresentationVariant(), undefined);
		assert.equal(oUiState.getVariantName(), undefined);
		assert.equal(oUiState.getValueTexts(), undefined);
	};


	QUnit.test("only selectionVariant", function(assert) {
		var oExpectedValue = {
			SelectionVariantID: "123",
			Parameters: [],
			SelectOptions: []
		};
		fnDefault03(assert, new UIState({
			selectionVariant: oExpectedValue
		}), oExpectedValue);
	});

	var fnDefault04 = function(assert, oUiState, oExpectedValue) {
		assert.equal(oUiState.getVariantName(), oExpectedValue);
		assert.equal(oUiState.getPresentationVariant(), undefined);
		assert.equal(oUiState.getSelectionVariant(), undefined);
		assert.equal(oUiState.getValueTexts(), undefined);
	};
	QUnit.test("only variantName", function(assert) {
		fnDefault04(assert, new UIState({
			variantName: "VariantABC"
		}), "VariantABC");
	});

	var fnDefault05 = function(assert, oUiState, oExpectedValue) {
		assert.deepEqual(oUiState.getValueTexts(), oExpectedValue);
		assert.equal(oUiState.getPresentationVariant(), undefined);
		assert.equal(oUiState.getSelectionVariant(), undefined);
		assert.equal(oUiState.getVariantName(), undefined);
	};
	QUnit.test("only valueTexts", function(assert) {
		fnDefault05(assert, new UIState({
			valueTexts: [
				{
					Language: "DE"
				}
			]
		}), [
			{
				Language: "DE"
			}
		]);
	});

	QUnit.module("sap.ui.comp.state.UIState: createFromSelectionAndPresentationVariantAnnotation", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("Default", function(assert) {
		fnDefault01(assert, UIState.createFromSelectionAndPresentationVariantAnnotation());
		fnDefault01(assert, UIState.createFromSelectionAndPresentationVariantAnnotation(null, undefined, {}));
		fnDefault01(assert, UIState.createFromSelectionAndPresentationVariantAnnotation("", {
			dummy: []
		}, {
			dummy: {}
		}));
	});

	QUnit.test("only presentationVariant", function(assert) {
		fnDefault02(assert, UIState.createFromSelectionAndPresentationVariantAnnotation(null, null, {
			maxItems: "10",
			sortOrderFields: [
				{
					name: "AmountInCompanyCodeCurrency",
					descending: false
				}
			],
			groupByFields: [],
			requestAtLeastFields: []
		}), {
			MaxItems: 10,
			SortOrder: [
				{
					Property: "AmountInCompanyCodeCurrency",
					Descending: false
				}
			],
			GroupBy: [],
			RequestAtLeast: []
		});
	});

	QUnit.test("only selectionVariant", function(assert) {
		fnDefault03(assert, UIState.createFromSelectionAndPresentationVariantAnnotation(null, {
			SelectOptions: [
				{
					PropertyName: {
						PropertyPath: "Bukrs"
					},
					Ranges: [
						{
							Low: {
								String: "0002"
							},
							Option: {
								EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
							},
							Sign: {
								EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"
							}
						}
					]
				}
			]
		}, null), {
			SelectOptions: [
				{
					PropertyName: "Bukrs",
					Ranges: [
						{
							Sign: "I",
							Option: "EQ",
							Low: "0002",
							High: undefined
						}
					]
				}
			]
		});
	});


	QUnit.test("only selectionVariant with parameters", function(assert) {
		var oUiState = UIState.createFromSelectionAndPresentationVariantAnnotation(null, {
			Parameters: [
				{
					PropertyName: {
						PropertyPath: "P_Param1"
					},
					PropertyValue: {
						String: "Value1"
					}
				},
				{
					PropertyName: {
						PropertyPath: "P_Param2"
					},
					PropertyValue: {
						String: "Value2"
					}
				}
			],
			SelectOptions: [
				{
					PropertyName: {
						PropertyPath: "Bukrs"
					},
					Ranges: [
						{
							Low: {
								String: "0002"
							},
							Option: {
								EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
							},
							Sign: {
								EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"
							}
						}
					]
				}
			]
		});

		var oExpectedResult = {
			SelectOptions: [
				{
					PropertyName: "Bukrs",
					Ranges: [
						{
							Sign: "I",
							Option: "EQ",
							Low: "0002",
							High: undefined
						}
					]
				}
			],
			Parameters: [
				{ PropertyName: "P_Param1", PropertyValue: "Value1"},
				{ PropertyName: "P_Param2", PropertyValue: "Value2"}
			]
		};

		assert.deepEqual(oUiState.getSelectionVariant(), oExpectedResult);
	});

	QUnit.test("only variantName", function(assert) {
		fnDefault04(assert, UIState.createFromSelectionAndPresentationVariantAnnotation("variantABC", null, null), "variantABC");
	});

});
