sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/CalculationBuilder",
	"sap/suite/ui/commons/CalculationBuilderItem",
	"sap/suite/ui/commons/CalculationBuilderVariable",
	"sap/suite/ui/commons/CalculationBuilderFunction",
	"sap/suite/ui/commons/library",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (jQuery, CalculationBuilder, CalculationBuilderItem, CalculationBuilderVariable, CalculationBuilderFunction, suiteLibrary,
			 createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	var CalculationBuilderOperatorType = suiteLibrary.CalculationBuilderOperatorType,
		CalculationBuilderFunctionType = suiteLibrary.CalculationBuilderFunctionType,
		CalculationBuilderItemType = suiteLibrary.CalculationBuilderItemType;

	function render(oElement) {
		oElement.placeAt("content");
		sap.ui.getCore().applyChanges();
	}

	function fnItemsToString(aItems) {
		var sItems = "";
		aItems.forEach(function (oItem) {
			sItems += oItem.getKey();
		});
		return sItems;
	}

	function fnSetItemsFromString(oCalculationBuilder, sExpression) {
		var aNewItems = oCalculationBuilder._oInput._stringToItems(sExpression);

		oCalculationBuilder.removeAllItems();
		aNewItems.forEach(function (oItem) {
			oCalculationBuilder.addItem(oItem);
		});
		return oCalculationBuilder;
	}

	QUnit.module("CalculationBuilderExpression", {
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
				],
				functions: [
					new CalculationBuilderFunction({
						key: "SUM",
						items: [
							new CalculationBuilderItem({
								key: ""
							}),
							new CalculationBuilderItem({
								key: ","
							}),
							new CalculationBuilderItem({
								key: ""
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

	QUnit.test("Select/deselect and move one item to right (next)", function (assert) {
		var oTestObject, $selectedItem, aItems, sExpression;

		var aTestObjects = [{
			startExpression: "1 + + +",
			endExpression: "+ 1 + +",
			direction: "next",
			moves: 1,
			selectedIndex: 0,
			text: "One move to right"
		}, {
			startExpression: "1 + + +",
			endExpression: "+ + + 1",
			direction: "next",
			moves: 4,
			selectedIndex: 0,
			text: "Max right index"
		}];

		assert.expect(aTestObjects.length);
		render(this.oCalculationBuilder);

		for (var i = 0; i < aTestObjects.length; i++) {
			oTestObject = aTestObjects[i];
			sExpression = oTestObject.startExpression;

			for (var iMoves = 0; iMoves < oTestObject.moves; iMoves++) {
				fnSetItemsFromString(this.oCalculationBuilder, sExpression);
				sap.ui.getCore().applyChanges();

				aItems = this.oCalculationBuilder.getItems();
				$selectedItem = jQuery("#" + aItems[oTestObject.selectedIndex + iMoves].getId())[0];

				this.oCalculationBuilder._oExpressionBuilder._selectItem($selectedItem);
				this.oCalculationBuilder._oExpressionBuilder._moveItems(oTestObject.direction);
				sap.ui.getCore().applyChanges();

				sExpression = this.oCalculationBuilder._oInput._getText();
			}

			assert.equal(sExpression, oTestObject.endExpression, oTestObject.text);
		}
	});

	QUnit.test("Select Items from - to", function (assert) {
		var oFirstItem, oSecondItem;

		assert.expect(3);

		fnSetItemsFromString(this.oCalculationBuilder, "+ + + + + +");
		render(this.oCalculationBuilder);
		oFirstItem = this.oCalculationBuilder.getItems()[0];
		oSecondItem = this.oCalculationBuilder.getItems()[3];

		oFirstItem._buttonPress({
			ctrlKey: true
		});
		sap.ui.getCore().applyChanges();
		assert.equal(jQuery(".ui-selected").length, 1);

		oSecondItem._buttonPress({
			shiftKey: true
		});
		sap.ui.getCore().applyChanges();
		assert.equal(jQuery(".ui-selected").length, 4);

		oFirstItem._buttonPress({
			ctrlKey: true
		});
		sap.ui.getCore().applyChanges();
		assert.equal(jQuery(".ui-selected").length, 3);
	});

	QUnit.test("Get Variable by key", function (assert) {
		assert.expect(3);

		assert.equal(this.oCalculationBuilder._oExpressionBuilder._getVariableByKey("TestColumn"), null, "If key is not in columns return null.");
		assert.equal(this.oCalculationBuilder._oExpressionBuilder._getVariableByKey("TestColumn1"), this.oCalculationBuilder.getVariables()[0], "If item is in CalculationBuilder return column.");
		assert.equal(this.oCalculationBuilder._oExpressionBuilder._getVariableByKey("TestColumn2"), this.oCalculationBuilder.getVariables()[1], "If item is in CalculationBuilder return column.");
	});

	QUnit.test("Test Expand all columns", function (assert) {
		var aItems = [
			new CalculationBuilderItem({
				key: "TestColumn2"
			}),
			new CalculationBuilderItem({
				key: CalculationBuilderOperatorType["+"]
			}),
			new CalculationBuilderItem({
				key: 200
			}),
			new CalculationBuilderItem({
				key: CalculationBuilderOperatorType["-"]
			}),
			new CalculationBuilderItem({
				key: "TestColumn1"
			})
		];

		assert.expect(3);

		// Set expression: TestColumn2 + 200 - TestColumn1
		aItems.forEach(function (oItem) {
			this.oCalculationBuilder.addItem(oItem);
		}.bind(this));
		render(this.oCalculationBuilder);

		assert.equal(fnItemsToString(this.oCalculationBuilder.getItems()), "TestColumn2+200-TestColumn1");
		this.oCalculationBuilder._oExpressionBuilder._expandAllVariables();
		sap.ui.getCore().applyChanges();
		assert.equal(fnItemsToString(this.oCalculationBuilder.getItems()), "(TestColumn1)+200-(100)", "Expand all columns.");
		this.oCalculationBuilder._oExpressionBuilder._expandAllVariables();
		assert.equal(fnItemsToString(this.oCalculationBuilder.getItems()), "((100))+200-(100)", "Expand all columns.");
	});

	QUnit.test("Update or create new Item", function (assert) {
		var oExpressionBuilder = this.oCalculationBuilder._oExpressionBuilder,
			oItem;

		assert.expect(8);

		render(this.oCalculationBuilder);

		oExpressionBuilder._oCurrentItem = oExpressionBuilder._getNewItem();
		oExpressionBuilder._oCurrentItem._bIsNew = true;
		oExpressionBuilder._updateOrCreateItem({
			key: "123"
		});
		oItem = this.oCalculationBuilder.getItems()[0];
		assert.ok(oItem._isConstant());
		assert.equal(oItem.getKey(), "123");

		oExpressionBuilder._oCurrentItem = oItem;
		oExpressionBuilder._oCurrentItem._bIsNew = false;
		oExpressionBuilder._updateOrCreateItem({
			key: CalculationBuilderFunctionType.ABS
		});
		assert.ok(oItem._isFunction());
		assert.equal(oItem.getKey(), CalculationBuilderFunctionType.ABS);

		oExpressionBuilder._oCurrentItem = oExpressionBuilder._getNewItem();
		oExpressionBuilder._oCurrentItem._bIsNew = true;
		oExpressionBuilder._updateOrCreateItem({
			key: "TestColumn1"
		});
		oItem = this.oCalculationBuilder.getItems()[1];
		assert.ok(oItem._isVariable());
		assert.equal(oItem.getKey(), "TestColumn1");

		oExpressionBuilder._oCurrentItem = oExpressionBuilder._getNewItem();
		oExpressionBuilder._oCurrentItem._bIsNew = true;
		oExpressionBuilder._updateOrCreateItem({
			key: CalculationBuilderFunctionType.RoundUp
		});
		oItem = this.oCalculationBuilder.getItems()[2];
		assert.ok(oItem._isFunction());
		assert.equal(oItem.getKey(), CalculationBuilderFunctionType.RoundUp);
	});

	QUnit.test("Validation test", function (assert) {
		var aTestingObjects = [
				{expression: "1+2+3", errorCount: 0},
				{expression: "Round(Round(,),)", errorCount: 3},
				{expression: "Round(2, ()", errorCount: 3},
				{expression: "Round( , ) 5", errorCount: 3},
				{expression: "2 + + + * 3", errorCount: 2},
				{expression: "sum(2) 5", errorCount: 1},
				{expression: "-3-(-3)-Round(-(-3), -(-3))", errorCount: 0, text: "Unary minus support"},
				{expression: "+3+(+3)+Round(+(+3), +(+3))", errorCount: 0},
				{expression: "( 1 + TestColumn1 )", errorCount: 0},
				{expression: "+ 1", errorCount: 0},
				{expression: "1 +", errorCount: 1},
				{expression: "1 -", errorCount: 1},
				{expression: "1 /", errorCount: 1},
				{expression: "1 *", errorCount: 1},
				{expression: "ABS ( ) + 5", errorCount: 1},
				{
					errorCount: 0,
					expression: "+ ABS(1) - ABS(2) * ABS(3) / ABS(ABS(4))",
					text: "Before Function can be +, -, *, /, Function"
				},
				{
					errorCount: 0,
					expression: "+ TestColumn1 - TestColumn2 * TestColumn1 / ( TestColumn2 ) + 1 + 2 - 3 * 4 / 5 + ( - 6)",
					text: "After Column or Variable can be +, -, *, /, Function"
				}
			],
			oCalculationBuilder = this.oCalculationBuilder,
			oExpressionBuilder = oCalculationBuilder._oExpressionBuilder,
			oInput = oCalculationBuilder._oInput;

		assert.expect(aTestingObjects.length);
		render(oCalculationBuilder);

		aTestingObjects.forEach(function (oTestingObject) {
			oCalculationBuilder.removeAllItems();
			oInput._stringToItems(oTestingObject.expression).forEach(function (oItem) {
				oCalculationBuilder.addItem(oItem);
			});
			assert.equal(oExpressionBuilder._validateSyntax().length, oTestingObject.errorCount, oTestingObject.text || "");
		});
	});

	QUnit.test("Validation of first/starting Item", function (assert) {
		var aAllowedExpressions = [
				"+ 1", "- 1", "NOT 1"
			],
			aNotAllowedExpressions = [
				"* 1", "/ 1", "AND 1", "OR 1", "XOR 1", "< 1", "> 1", "<= 1", ">= 1", "= 1", "!= 1"
			],
			oCalculationBuilder = this.oCalculationBuilder,
			oExpressionBuilder = oCalculationBuilder._oExpressionBuilder,
			oInput = oCalculationBuilder._oInput;

		var fnTestArray = function (aExpressions, nErrorCount) {
			aExpressions.forEach(function (oExpression) {
				oCalculationBuilder.removeAllItems();
				oInput._stringToItems(oExpression).forEach(function (oItem) {
					oCalculationBuilder.addItem(oItem);
				});
				assert.equal(oExpressionBuilder._validateSyntax().length, nErrorCount, (nErrorCount > 0 ? "Not allowed: " : "Allowed: ") + oExpression);
			});
		};

		assert.expect(aAllowedExpressions.length + aNotAllowedExpressions.length);
		render(oCalculationBuilder);

		fnTestArray(aAllowedExpressions, 0);
		fnTestArray(aNotAllowedExpressions, 1);
	});

	QUnit.test("Add item with wrong Key or Type", function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
				items: [
					new CalculationBuilderItem({
						key: "wrongKey"
					})
				]
			}),
			oItem1 = new CalculationBuilderItem({
				key: CalculationBuilderOperatorType["+"]
			});

		assert.expect(2);
		oCalculationBuilder.addItem(oItem1);
		render(oCalculationBuilder);
		assert.equal(fnItemsToString(oCalculationBuilder.getItems()), "wrongKey+");
		assert.equal(oItem1.getType(), CalculationBuilderItemType.Operator);
		oCalculationBuilder.destroy();
	});

	QUnit.test("Custom tokens", function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
			items: [
				new CalculationBuilderItem({
					key: "CustomFunction"
				}),
				new CalculationBuilderItem({
					key: "CustomOperator"
				})
			],
			operators: [new sap.ui.core.Item({
				key: "CustomOperator",
				text: "custom operator"
			})],
			functions: [new sap.suite.ui.commons.CalculationBuilderFunction({
				key: "CustomFunction",
				label: "Custom function"
			})]
		});

		assert.expect(2);
		render(oCalculationBuilder);
		var aItems = oCalculationBuilder.getItems();

		assert.equal(aItems[0].$().find(".sapCalculationBuilderItemLabel")[0].innerText, "Custom function", "Custom function");
		assert.equal(aItems[1].$().find(".sapCalculationBuilderItemLabel")[0].innerText, "custom operator", "custom operator");
		oCalculationBuilder.destroy();
	});

	QUnit.test("Function \"empty\" items", function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
			items: [
				new CalculationBuilderItem({
					key: "Abs"
				}),
				new CalculationBuilderItem({
					key: ""
				}),
				new CalculationBuilderItem({
					key: ")"
				})
			]
		});

		var oFunction = oCalculationBuilder._getFunctionMap()["round"];

		var fnCompare = function (sKeys) {
			var sItems = oCalculationBuilder.getItems().map(function (oItem) {
				return oItem.getKey();
			}).join(";");

			return sItems.toLowerCase() === sKeys.toLowerCase();
		};

		render(oCalculationBuilder);


		oCalculationBuilder._oExpressionBuilder._oCurrentItem = oCalculationBuilder.getItems()[1];
		oCalculationBuilder._oExpressionBuilder._updateOrCreateItem({
			functionObject: oFunction,
			key: "Round",
			type: "Function"
		});

		assert.expect(4);
		var aKeys = ["abs", "round", "", ",", "", ")", ")"].join(";");
		assert.ok(fnCompare(aKeys), "Function params ABS");
		assert.equal(oCalculationBuilder.getExpression(), "Abs(Round(, ))", "Expression");

		oCalculationBuilder.setExpression("1+");
		sap.ui.getCore().applyChanges();

		// adding new item
		oCalculationBuilder._oExpressionBuilder._oCurrentItem = null;
		oCalculationBuilder._oExpressionBuilder._updateOrCreateItem({
			functionObject: oFunction,
			key: "Round",
			type: "Function"
		});

		var aKeys = ["1", "+", "Round", "", ",", "", ")"].join(";");
		assert.ok(fnCompare(aKeys), "Function params 1+Round");
		assert.equal(oCalculationBuilder.getExpression(), "1 + Round(, )", "Expression");

		oCalculationBuilder.destroy();
	});

	QUnit.test("Set expression tests", function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
			items: [
				new CalculationBuilderItem({
					key: "Abs"
				}),
				new CalculationBuilderItem({
					key: ""
				}),
				new CalculationBuilderItem({
					key: ")"
				})
			]
		});

		render(oCalculationBuilder);

		assert.expect(11);
		assert.equal(oCalculationBuilder.getExpression(), "Abs()", "Expression");

		oCalculationBuilder.setExpression("1 +  1");
		sap.ui.getCore().applyChanges();
		assert.equal(oCalculationBuilder.getExpression(), "1 + 1", "Expression");

		oCalculationBuilder.setExpression("");
		sap.ui.getCore().applyChanges();
		assert.equal(oCalculationBuilder.getExpression(), "", "Expression");
		assert.equal(oCalculationBuilder.getItems().length, 0, "Expression");

		oCalculationBuilder.addItem(new CalculationBuilderItem({
			key: "1"
		}));
		oCalculationBuilder.addItem(new CalculationBuilderItem({
			key: "+"
		}));

		sap.ui.getCore().applyChanges();

		assert.equal(oCalculationBuilder.getExpression(), "1 +", "Expression");
		assert.equal(oCalculationBuilder.getItems().length, 2, "Expression");

		oCalculationBuilder.addItem(new CalculationBuilderItem({
			key: "Abs"
		}));
		oCalculationBuilder.addItem(new CalculationBuilderItem({
			key: ""
		}));
		oCalculationBuilder.addItem(new CalculationBuilderItem({
			key: ")"
		}));
		sap.ui.getCore().applyChanges();

		assert.equal(oCalculationBuilder.getExpression(), "1 + Abs()", "1 + Abs()");
		assert.equal(oCalculationBuilder.getItems().length, 5, "5 Items");

		oCalculationBuilder.removeAllItems();
		sap.ui.getCore().applyChanges();

		assert.equal(oCalculationBuilder.getExpression(), "");
		oCalculationBuilder.addItem(new CalculationBuilderItem({
			key: "+"
		}));

		sap.ui.getCore().applyChanges();
		assert.equal(oCalculationBuilder.$("input-input").text(), "+");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "+");

		oCalculationBuilder.destroy();
	});

	QUnit.test("+/- tests", function (assert) {
		var oCalculationBuilder = new CalculationBuilder();
		oCalculationBuilder.setExpression("10+10");
		render(oCalculationBuilder);
		assert.ok(oCalculationBuilder.getErrors().length === 0, "No error");

		oCalculationBuilder.setExpression("10+ + 10");
		sap.ui.getCore().applyChanges();
		assert.ok(oCalculationBuilder.getErrors().length === 0, "No error");

		oCalculationBuilder.setExpression("10+ + +10");
		sap.ui.getCore().applyChanges();
		assert.ok(oCalculationBuilder.getErrors().length === 1, "1 error");

		oCalculationBuilder.setExpression("10+ + 10");
		sap.ui.getCore().applyChanges();
		assert.ok(oCalculationBuilder.getErrors().length === 0, "No error - test without rendering (just validation)");

		oCalculationBuilder.setExpression("10+ +  + - 10");
		sap.ui.getCore().applyChanges();
		assert.ok(oCalculationBuilder.getErrors().length === 2, "2 errors");

		oCalculationBuilder.setExpression("10+ - 10");
		sap.ui.getCore().applyChanges();
		assert.ok(oCalculationBuilder.getErrors().length === 0, "No error - with minus");

		oCalculationBuilder.setExpression("10 - - 10");
		sap.ui.getCore().applyChanges();
		assert.ok(oCalculationBuilder.getErrors().length === 0, "No error");

		oCalculationBuilder.setExpression("10 - - +10");
		sap.ui.getCore().applyChanges();
		assert.ok(oCalculationBuilder.getErrors().length === 1, "1 error");

		oCalculationBuilder.destroy();
	});
});
