sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/CalculationBuilderItem",
	"sap/suite/ui/commons/CalculationBuilder",
	"sap/suite/ui/commons/CalculationBuilderVariable",
	"sap/suite/ui/commons/library",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (jQuery, CalculationBuilderItem, CalculationBuilder, CalculationBuilderVariable, suiteLibrary, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	var CalculationBuilderOperatorType = suiteLibrary.CalculationBuilderOperatorType,
		CalculationBuilderFunctionType = suiteLibrary.CalculationBuilderFunctionType,
		CalculationBuilderItemType = suiteLibrary.CalculationBuilderItemType;

	function render(oElement) {
		oElement.placeAt("content");
		sap.ui.getCore().applyChanges();
	}

	function createCalculationBuilder() {
		return new CalculationBuilder({
			title: "Calculation Builder",
			variables: [
				new CalculationBuilderVariable({
					key: "TestColumn1",
					items: [
						new CalculationBuilderItem({
							key: "TestColumn1"
						}),
						new CalculationBuilderItem({
							key: CalculationBuilderOperatorType["-"]
						}),
						new CalculationBuilderItem({
							key: 3
						})
					]
				}), new CalculationBuilderVariable({
					key: "TestColumn2",
					items: [
						new CalculationBuilderItem({
							key: 1
						})
					]
				}), new CalculationBuilderVariable({
					key: "TestColumn3"
				})
			]
		});
	}

	QUnit.module("CalculationBuilderItem");

	QUnit.test("Syntax error class", function (assert) {
		var oItem0 = new CalculationBuilderItem({
				key: CalculationBuilderOperatorType["+"]
			}),
			oItem1 = new CalculationBuilderItem({
				key: 200
			}),
			oCalculationBuilder = createCalculationBuilder();

		oCalculationBuilder.addItem(oItem0);

		assert.expect(6);
		render(oCalculationBuilder);

		assert.ok(oItem0._getItemError(), "Item0 has syntax error.");
		assert.ok(oItem0.$().hasClass("sapCalculationBuilderItemErrorSyntax"), "Item0's DOM have correct class.");

		oCalculationBuilder.addItem(oItem1);
		render(oCalculationBuilder);
		assert.notOk(oItem0._getItemError(), "Item0 has syntax error.");
		assert.notOk(oItem0.$().hasClass("sapCalculationBuilderItemErrorSyntax"), "Item0's DOM have correct class.");
		assert.notOk(oItem1._getItemError(), "Item1 has syntax error.");
		assert.notOk(oItem1.$().hasClass("sapCalculationBuilderItemErrorSyntax"), "Item1's DOM have correct class.");

		oItem0.destroy();
		oItem1.destroy();
		oCalculationBuilder.destroy();
	});

	QUnit.test("Clone item test", function (assert) {
		var oItem = new CalculationBuilderItem({
				key: CalculationBuilderFunctionType.RoundUp
			}),
			oNewItem = oItem._cloneItem();

		assert.expect(2);

		assert.equal(oItem.getKey(), oNewItem.getKey(), "True");
		oNewItem.setKey(CalculationBuilderOperatorType["+"]);
		assert.notEqual(oItem.getKey(), oNewItem.getKey(), "True");
	});

	QUnit.test("Test whether columns are expandable", function (assert) {
		var oCalculationBuilder = createCalculationBuilder(),
			aItems = [
				new CalculationBuilderItem({
					key: "TestColumn1"
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["+"]
				}),
				new CalculationBuilderItem({
					key: "TestColumn2"
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["+"]
				}),
				new CalculationBuilderItem({
					key: "TestColumn3"
				})
			];

		assert.expect(5);

		aItems.forEach(function (oItem) {
			oCalculationBuilder.addItem(oItem);
		});
		render(oCalculationBuilder);

		assert.ok(aItems[0].isExpandable(), "Column is expandable.");
		assert.notOk(aItems[1].isExpandable(), "Operator + is not expandable.");
		assert.ok(aItems[2].isExpandable(), "Column is expandable.");
		assert.notOk(aItems[3].isExpandable(), "Operator - is not expandable.");
		assert.notOk(aItems[4].isExpandable(), "Column is not expandable.");
	});

	QUnit.test("Expanding columns", function (assert) {
		var oCalculationBuilder = createCalculationBuilder(),
			aItems = [
				new CalculationBuilderItem({
					key: "TestColumn1"
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["+"]
				}),
				new CalculationBuilderItem({
					key: "TestColumn2"
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["-"]
				}),
				new CalculationBuilderItem({
					key: "TestColumn3"
				})
			],
			fnItemsToString = function (aItems) {
				var sItems = "";
				aItems.forEach(function (oItem) {
					sItems += oItem.getKey();
				});
				return sItems;
			};

		assert.expect(3);

		aItems.forEach(function (oItem) {
			oCalculationBuilder.addItem(oItem);
		});
		oCalculationBuilder.getItems()[2]._expandVariable(true);
		assert.equal(fnItemsToString(oCalculationBuilder.getItems()), "TestColumn1+(1)-TestColumn3", "After TestColumn2 expand.");
		oCalculationBuilder.getItems()[0]._expandVariable();
		assert.equal(fnItemsToString(oCalculationBuilder.getItems()), "(TestColumn1-3)+(1)-TestColumn3", "After TestColumn1 expand.");
		oCalculationBuilder.getItems()[1]._expandVariable();
		assert.equal(fnItemsToString(oCalculationBuilder.getItems()), "((TestColumn1-3)-3)+(1)-TestColumn3", "After TestColumn1 expand.");
	});

	QUnit.test("Bracket hover test", function (assert) {
		var oCalculationBuilder = new CalculationBuilder(),
			$items = [],
			$itemsContent = [],
			aItemSet1 = [
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["("]
				}),
				new CalculationBuilderItem({
					key: 2
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["/"]
				}),
				new CalculationBuilderItem({
					key: 5
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[")"]
				})
			],
			aItemSet2 = [
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["("]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[")"]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[")"]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["("]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["("]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[")"]
				})
			],
			aItemSet3 = [
				new CalculationBuilderItem({
					key: CalculationBuilderFunctionType.ABS
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["("]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderFunctionType.ABS
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[")"]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[")"]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[")"]
				})
			];

		var fnCheckAllItemsHasClass = function ($items) {
			var bHasItemClass = false;
			$items.forEach(function ($item) {
				if ($item.hasClass("sapCalculationBuilderBracket")) {
					bHasItemClass = true;
				}
			});
			return bHasItemClass;
		};

		// Set expression: ( 2 / 5 )
		aItemSet1.forEach(function (oItem) {
			oCalculationBuilder.addItem(oItem);
		});
		render(oCalculationBuilder);

		$items.push(jQuery("#" + oCalculationBuilder.getItems()[0].getId()));
		$items.push(jQuery("#" + oCalculationBuilder.getItems()[4].getId()));
		$itemsContent.push(jQuery("#" + oCalculationBuilder.getItems()[0].getId() + "-content"));
		$itemsContent.push(jQuery("#" + oCalculationBuilder.getItems()[4].getId() + "-content"));

		assert.expect(40);

		// + 4 assertion
		$itemsContent[0].trigger("mouseenter");
		assert.ok($items[0].hasClass("sapCalculationBuilderBracket"), "Starting bracket is active.");
		assert.ok($items[1].hasClass("sapCalculationBuilderBracket"), "Ending bracket is active.");
		$itemsContent[0].trigger("mouseleave");
		assert.notOk($items[0].hasClass("sapCalculationBuilderBracket"), "Starting bracket is not active.");
		assert.notOk($items[1].hasClass("sapCalculationBuilderBracket"), "Ending bracket is not active.");

		// + 4 assertion
		$itemsContent[1].trigger("mouseenter");
		assert.ok($items[1].hasClass("sapCalculationBuilderBracket"), "Starting bracket is active.");
		assert.ok($items[0].hasClass("sapCalculationBuilderBracket"), "Ending bracket is active.");
		$itemsContent[1].trigger("mouseleave");
		assert.notOk($items[1].hasClass("sapCalculationBuilderBracket"), "Starting bracket is not active.");
		assert.notOk($items[0].hasClass("sapCalculationBuilderBracket"), "Ending bracket is not active.");

		// Set expression: ( ) ) ( ( )
		oCalculationBuilder.removeAllItems();
		aItemSet2.forEach(function (oItem) {
			oCalculationBuilder.addItem(oItem);
		});
		sap.ui.getCore().applyChanges();

		$items = [];
		$itemsContent = [];

		oCalculationBuilder.getItems().forEach(function (oItem) {
			$items.push(jQuery("#" + oItem.getId()));
			$itemsContent.push(jQuery("#" + oItem.getId() + "-content"));
		});

		// + 7 assertion
		$itemsContent[0].trigger("mouseenter");
		assert.ok($items[0].hasClass("sapCalculationBuilderBracket"));
		assert.ok($items[1].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[2].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[3].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[4].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[5].hasClass("sapCalculationBuilderBracket"));
		$itemsContent[0].trigger("mouseleave");
		assert.notOk(fnCheckAllItemsHasClass($items), "Neither item is active.");

		// + 2 assertion
		$itemsContent[2].trigger("mouseenter");
		assert.notOk(fnCheckAllItemsHasClass($items), "Neither item is active.");
		$itemsContent[2].trigger("mouseleave");
		assert.notOk(fnCheckAllItemsHasClass($items), "Neither item is active.");

		// + 2 assertion
		$itemsContent[3].trigger("mouseenter");
		assert.notOk(fnCheckAllItemsHasClass($items), "Neither item is active.");
		$itemsContent[3].trigger("mouseleave");
		assert.notOk(fnCheckAllItemsHasClass($items), "Neither item is active.");

		// + 7 assertion
		$itemsContent[4].trigger("mouseenter");
		assert.notOk($items[0].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[1].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[2].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[3].hasClass("sapCalculationBuilderBracket"));
		assert.ok($items[4].hasClass("sapCalculationBuilderBracket"));
		assert.ok($items[5].hasClass("sapCalculationBuilderBracket"));
		$itemsContent[4].trigger("mouseleave");
		assert.notOk(fnCheckAllItemsHasClass($items), "Neither item is active.");

		// Function as bracket
		// Set expression: ABS( ( ABS( ) ) )
		oCalculationBuilder.removeAllItems();
		aItemSet3.forEach(function (oItem) {
			oCalculationBuilder.addItem(oItem);
		});
		sap.ui.getCore().applyChanges();

		$items = [];
		$itemsContent = [];

		oCalculationBuilder.getItems().forEach(function (oItem) {
			$items.push(jQuery("#" + oItem.getId()));
			$itemsContent.push(jQuery("#" + oItem.getId() + "-content"));
		});

		// + 7 assertion
		$itemsContent[0].trigger("mouseenter");
		assert.ok($items[0].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[1].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[2].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[3].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[4].hasClass("sapCalculationBuilderBracket"));
		assert.ok($items[5].hasClass("sapCalculationBuilderBracket"));
		$itemsContent[0].trigger("mouseleave");
		assert.notOk(fnCheckAllItemsHasClass($items), "Neither item is active.");

		// + 7 assertion
		$itemsContent[2].trigger("mouseenter");
		assert.notOk($items[0].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[1].hasClass("sapCalculationBuilderBracket"));
		assert.ok($items[2].hasClass("sapCalculationBuilderBracket"));
		assert.ok($items[3].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[4].hasClass("sapCalculationBuilderBracket"));
		assert.notOk($items[5].hasClass("sapCalculationBuilderBracket"));
		$itemsContent[2].trigger("mouseleave");
		assert.notOk(fnCheckAllItemsHasClass($items), "Neither item is active.");

		oCalculationBuilder.destroy();
	});

	QUnit.test("Validate type of item", function (assert) {
		var oCalculationBuilder = createCalculationBuilder(),
			oItem = new CalculationBuilderItem({
				key: CalculationBuilderFunctionType.ABS
			});

		oCalculationBuilder.addItem(oItem);
		render(oCalculationBuilder);

		assert.expect(6);
		assert.equal(oItem.getType(), CalculationBuilderItemType.Function);
		oItem._sType = null;
		sap.ui.getCore().applyChanges();
		assert.equal(oItem.getType(), CalculationBuilderItemType.Function);
		oItem.setKey("TestColumn1");
		sap.ui.getCore().applyChanges();
		assert.equal(oItem.getType(), CalculationBuilderItemType.Variable);
		oItem.setKey("+");
		sap.ui.getCore().applyChanges();
		assert.equal(oItem.getType(), CalculationBuilderItemType.Operator);
		oItem.setKey("");
		sap.ui.getCore().applyChanges();
		assert.equal(oItem.getType(), CalculationBuilderItemType.Empty);
		oItem.setKey("AND");
		sap.ui.getCore().applyChanges();
		assert.equal(oItem.getType(), CalculationBuilderItemType.Operator);
	});

	QUnit.test("Test item press event", function (assert) {
		var oCalculationBuilder = createCalculationBuilder(),
			oItem = new CalculationBuilderItem({
				key: 100
			}),
			oExpressionBuilder = oCalculationBuilder._oExpressionBuilder;

		assert.expect(5);

		oCalculationBuilder.addItem(oItem);
		render(oCalculationBuilder);

		oCalculationBuilder._oExpressionBuilder._selectItem(oItem.$());
		sap.ui.getCore().applyChanges();
		assert.equal(oItem.getId(), jQuery(".ui-selected").attr("id"));
		assert.equal(oExpressionBuilder._oPopover.$().length, 0);

		oItem._buttonPress({
			ctrlCode: false
		});
		sap.ui.getCore().applyChanges();
		assert.equal(jQuery(".ui-selected").length, 0);
		assert.notEqual(oExpressionBuilder._oPopover.$().length, 0);

		oExpressionBuilder._oPopover.close();
		assert.ok(oExpressionBuilder._oPopover.$().is(":hidden"));
	});

	QUnit.test("Test expand confirm message", function (assert) {
		var oCalculationBuilder = createCalculationBuilder(),
			oItem = new CalculationBuilderItem({
				key: "TestColumn1"
			}),
			oDialog;

		assert.expect(2);

		oCalculationBuilder.addItem(oItem);
		render(oCalculationBuilder);
		assert.equal(jQuery(".sapMDialog").length, 0);

		oCalculationBuilder._oExpressionBuilder._handleEnter({
			target: oCalculationBuilder.getItems()[0].$("expandbutton")[0]
		});
		sap.ui.getCore().applyChanges();
		assert.notEqual(jQuery(".sapMDialog").length, 0);

		oDialog = sap.ui.getCore().byId(jQuery(".sapMDialog").attr("id"));
		oDialog.getButtons()[1].firePress();
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("After invalidate item is still focusable", function (assert) {
		var oCalculationBuilder = createCalculationBuilder(),
			oItem = new CalculationBuilderItem({
				key: CalculationBuilderFunctionType.RoundUp
			});

		assert.expect(2);

		oCalculationBuilder.addItem(oItem);
		render(oCalculationBuilder);
		assert.equal(oItem.$()[0], oCalculationBuilder._oExpressionBuilder._oItemNavigation.getItemDomRefs()[0]);

		oItem.invalidate();
		sap.ui.getCore().applyChanges();
		assert.equal(oItem.$()[0], oCalculationBuilder._oExpressionBuilder._oItemNavigation.getItemDomRefs()[0]);
	});

	QUnit.test("If item is Operator Multiplication set label to \"x\"", function (assert) {
		var oItem = new CalculationBuilderItem({
				key: CalculationBuilderOperatorType["*"]
			}),
			oCalculationBuilder = createCalculationBuilder();

		assert.expect(5);
		// assert.notOk(oItem.getLabel());

		oCalculationBuilder.addItem(oItem);
		render(oCalculationBuilder);

		// assert.equal(oItem.getLabel(), "x");
		assert.ok(oItem._isMultiplication());
		assert.notOk(oItem._isAddition());
		assert.notOk(oItem._isSubtraction());
		assert.notOk(oItem._isDivision());
		assert.notOk(oItem._isComma());
	});
});
