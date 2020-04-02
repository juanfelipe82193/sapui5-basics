sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/CalculationBuilder",
	"sap/suite/ui/commons/CalculationBuilderItem",
	"sap/suite/ui/commons/CalculationBuilderVariable",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (jQuery, CalculationBuilder, CalculationBuilderItem, CalculationBuilderVariable, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	var TestingObjectsForParsing = [
		{
			expression: "1 + 2",
			keys: ["1", "+", "2"]
		},
		{
			expression: "(##)",
			keys: ["(", "", ")"]
		},
		{
			expression: "RoundUp(##, ##) + 2 * 5",
			keys: ["RoundUp", "", ",", "", ")", "+", "2", "*", "5"]
		},
		{
			expression: "Round(RoundUp(RoundDown(6, 55), ##), ##)",
			keys: ["Round", "RoundUp", "RoundDown", "6", ",", "55", ")", ",", "", ")", ",", "", ")"]
		},
		{
			expression: "+",
			keys: ["+"]
		},
		{
			expression: "(1 + TestColumn1)",
			keys: ["(", "1", "+", "TestColumn1", ")"]
		},
		{
			expression: "(1 + TestColumn1 / 5685 - 4aaa)",
			keys: ["(", "1", "+", "TestColumn1", "/", "5685", "-", "4aaa", ")"]
		},
		{
			expression: "1 * 2 (() ABS(##) ABS(##) 4",
			keys: ["1", "*", "2", "(", "(", ")", "ABS", "", ")", "ABS", "", ")", "4"]
		},
		{
			expression: "",
			keys: []
		}
	];

	var TestingObjectsForParsing1 = [
		{
			expression: "1+2",
			keys: ["1+2"]
		},
		{
			expression: "\"1\\2\" - 15",
			keys: ["\"1\\2\"", "-", "15"]
		},
		{
			expression: "\"1\\2\" - 15",
			keys: ["\"1\\2\"", "-", "15"]
		},
		{
			expression: "sqrt(15)",
			keys: ["sqrt", "(", "15", ")"]
		}
	];


	function render(oElement) {
		oElement.placeAt("content");
		sap.ui.getCore().applyChanges();
	}

	QUnit.module("CalculationBuilderInput", {
		beforeEach: function () {
			this.oCalculationBuilder = new CalculationBuilder({
				title: "Calculation Builder",
				variables: [
					new CalculationBuilderVariable({
						key: "TestColumn1",
						items: [
							new CalculationBuilderItem({
								key: 100
							})
						]
					}),
					new CalculationBuilderVariable({
						key: "TestColumn2",
						items: [
							new CalculationBuilderItem({
								key: "TestColumn1"
							})
						]
					})
				]
			});
		},
		afterEach: function () {
			this.oCalculationBuilder.destroy();
		}
	});

	QUnit.test("Parsing string to items", function (assert) {
		var oInput = this.oCalculationBuilder._oInput;

		render(this.oCalculationBuilder);
		assert.expect(2 * TestingObjectsForParsing.length);

		TestingObjectsForParsing.forEach(function (oTestingObject) {
			var aNewItems = oInput._stringToItems(oTestingObject.expression),
				bIsError = false;

			assert.equal(aNewItems.length, oTestingObject.keys.length, "Length is correct.");
			for (var i = 0; (i < aNewItems.length) && (i < oTestingObject.keys.length); i++) {
				bIsError = (aNewItems[i].getKey() !== oTestingObject.keys[i]) && (aNewItems[i] instanceof CalculationBuilderItem);
			}
			assert.notOk(bIsError, "Expression: " + oTestingObject.expression);
		});
	});

	QUnit.test("Parse Items to string", function (assert) {
		var oInputBuilder = this.oCalculationBuilder._oInput,
			fnGenerateItemsArray = function (aKeys) {
				var aItems = [];
				aKeys.forEach(function (sKey) {
					aItems.push(new CalculationBuilderItem({
						key: sKey === "" ? "##" : sKey
					}));
				});
				return aItems;
			};

		assert.expect(TestingObjectsForParsing.length);

		TestingObjectsForParsing.forEach(function (oTestingObject) {
			var sNewExpression = oInputBuilder._itemsToString({
				items: fnGenerateItemsArray(oTestingObject.keys),
				errors: []
			});
			assert.equal(sNewExpression, oTestingObject.expression, "Expression: " + oTestingObject.expression);
		});
	});

	QUnit.test("Test inserting items from Input Toolbar", function (assert) {
		var oCalculationBuilder = this.oCalculationBuilder,
			oInput = oCalculationBuilder._oInput;

		assert.expect(5);
		render(oCalculationBuilder);
		assert.equal(oCalculationBuilder.getExpression(), "");

		oInput._insertItemFromToolbar("abs");
		assert.equal(oCalculationBuilder.getExpression(), "abs()");
		assert.equal(oInput._getCaretPosition(), 6);

		oInput._insertItemFromToolbar("round");
		assert.equal(oCalculationBuilder.getExpression(), "abs(round(, ))");
		assert.equal(oInput._getCaretPosition(), 13);
	});

	QUnit.test("Test empty string", function (assert) {
		var oInput = this.oCalculationBuilder._oInput;

		assert.expect(2);

		assert.ok(oInput._isEmptyItem("&nbsp;&nbsp;"));
		assert.notOk(oInput._isEmptyItem("&nbsp;"));
	});

	QUnit.test("Find current span", function (assert) {
		var oInput = this.oCalculationBuilder._oInput,
			sExpression = "Roun",
			$span;

		assert.expect(1);

		this.oCalculationBuilder.setExpression(sExpression);
		render(this.oCalculationBuilder);
		oInput.$("input").trigger("focus");
		$span = jQuery(oInput._findCurrentSpan());

		assert.equal($span[0].innerText, sExpression);
	});

	QUnit.test("Suggestion test", function (assert) {
		var oCalculationBuilder = this.oCalculationBuilder,
			oInput = oCalculationBuilder._oInput,
			aSuggestionListData;

		assert.expect(5);
		oCalculationBuilder.setExpression("Rou");
		render(oCalculationBuilder);

		oInput._checkSuggestions(3, "Round", true);
		assert.equal(oInput._sSuggestionText, "Round");

		oInput._filterSuggestionList("Round");
		aSuggestionListData = oInput._oSuggestionList.getModel().getData().data;
		assert.equal(aSuggestionListData[0].key, "Round");
		assert.equal(aSuggestionListData[1].key, "RoundDown");
		assert.equal(aSuggestionListData[2].key, "RoundUp");

		oInput._clearSuggestion();
		assert.equal(oInput._sSuggestionText, "");
	});

	QUnit.test("Parsing string to items extended ", function (assert) {
		var oInput = this.oCalculationBuilder._oInput;

		this.oCalculationBuilder.setDisabledDefaultTokens("+;*;SQRT");
		this.oCalculationBuilder.setAllowStringConstants(true);

		render(this.oCalculationBuilder);
		assert.expect(2 * TestingObjectsForParsing1.length);

		TestingObjectsForParsing1.forEach(function (oTestingObject) {
			var aNewItems = oInput._stringToItems(oTestingObject.expression),
				bIsError = false;

			assert.equal(aNewItems.length, oTestingObject.keys.length, "Length is correct.");
			for (var i = 0; (i < aNewItems.length) && (i < oTestingObject.keys.length); i++) {
				bIsError = (aNewItems[i].getKey() !== oTestingObject.keys[i]) && (aNewItems[i] instanceof CalculationBuilderItem);
			}
			assert.notOk(bIsError, "Expression: " + oTestingObject.expression);
		});
	});

	QUnit.test("Empty custom constant ", function (assert) {
		this.oCalculationBuilder.setAllowStringConstants(true);

		this.oCalculationBuilder.setExpression("\"test constant with spaces\"");

		render(this.oCalculationBuilder);

		assert.equal(this.oCalculationBuilder._oInput.$("input").find("span").length, 1, "Only one span is created");

		this.oCalculationBuilder.setAllowStringConstants(false);
		this.oCalculationBuilder.setExpression("\"test constant with spaces\"");
		sap.ui.getCore().applyChanges();

		assert.equal(this.oCalculationBuilder._oInput.$("input").find("span").length, 7, "7 spans are created");
	});

	QUnit.test("Text only ", function (assert) {
		this.oCalculationBuilder.setLayoutType("TextualOnly");
		this.oCalculationBuilder.setExpression("a");

		render(this.oCalculationBuilder);

		assert.equal(this.oCalculationBuilder.getErrors().length, 1, "one error");

		this.oCalculationBuilder.setExpression("1");
		sap.ui.getCore().applyChanges();
		assert.equal(this.oCalculationBuilder.getErrors().length, 0, "no error");
	});

	QUnit.test("Replacement of nbsp; ", function (assert) {
		render(this.oCalculationBuilder);

		this.oCalculationBuilder._setExpression("1" + String.fromCharCode(160) + "a" + String.fromCharCode(160) + "a");
		var ex = this.oCalculationBuilder.getProperty("expression");


		assert.equal(ex.indexOf(String.fromCharCode(160)), -1, "No &nbsp;");
	});

});
