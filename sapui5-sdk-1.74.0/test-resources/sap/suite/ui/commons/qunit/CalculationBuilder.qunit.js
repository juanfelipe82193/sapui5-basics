sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/CalculationBuilder",
	"sap/suite/ui/commons/CalculationBuilderItem",
	"sap/suite/ui/commons/CalculationBuilderVariable",
	"sap/suite/ui/commons/library",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (jQuery, CalculationBuilder, CalculationBuilderItem, CalculationBuilderVariable, suiteLibrary, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	var CalculationBuilderOperatorType = suiteLibrary.CalculationBuilderOperatorType,
		CalculationBuilderFunctionType = suiteLibrary.CalculationBuilderFunctionType;

	function render(oElement) {
		oElement.placeAt("content");
		sap.ui.getCore().applyChanges();
	}

	QUnit.module("CalculationBuilder", {
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

	QUnit.test("Test toggle Expression Field", function (assert) {
		var oToggleButton, oExpressionField;

		assert.expect(3);

		render(this.oCalculationBuilder);
		oToggleButton = this.oCalculationBuilder.getToolbar().getContent()[2];
		oExpressionField = jQuery(".sapCalculationBuilderInputOuterWrapper");
		assert.ok(oExpressionField.is(":visible"));

		oToggleButton.firePress();
		sap.ui.getCore().applyChanges();
		assert.ok(oExpressionField.is(":hidden"));

		oToggleButton.firePress();
		sap.ui.getCore().applyChanges();
		assert.ok(oExpressionField.is(":visible"));
	});

	QUnit.test("Test Full screen mode", function (assert) {
		var oFullScreenButton;

		assert.expect(3);

		render(this.oCalculationBuilder);
		assert.equal(jQuery(".sapCalculationBuilderOverlay").length, 0);

		oFullScreenButton = this.oCalculationBuilder.getToolbar().getContent()[4];
		oFullScreenButton.firePress();
		sap.ui.getCore().applyChanges();
		assert.notEqual(jQuery(".sapCalculationBuilderOverlay").length, 0);

		oFullScreenButton.firePress();
		sap.ui.getCore().applyChanges();
		assert.equal(jQuery(".sapCalculationBuilderOverlay").length, 0);
	});

	QUnit.test("Test Enter key press", function (assert) {
		var aItems = [
				new CalculationBuilderItem({
					key: CalculationBuilderFunctionType.RoundUp
				}),
				new CalculationBuilderItem({
					key: 200
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["+"]
				}),
				new CalculationBuilderItem({
					key: "TestColumn1"
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["-"]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderFunctionType.ABS
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType["+"]
				}),
				new CalculationBuilderItem({
					key: 100
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[")"]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[")"]
				})
			],
			oItem, oPopover;

		assert.expect(6);

		// Set expression: RoundUp ( 200 + TestColumn1 - ABS ( + 100 ) )
		aItems.forEach(function (oItem) {
			this.oCalculationBuilder.addItem(oItem);
		}.bind(this));

		oItem = this.oCalculationBuilder.getItems()[0];
		render(this.oCalculationBuilder);
		oPopover = this.oCalculationBuilder._oExpressionBuilder._oPopover;
		assert.notOk(oPopover.isOpen());

		this.oCalculationBuilder._oExpressionBuilder.onsapenter({
			target: oItem.$()[0]
		});
		assert.ok(oPopover.isOpen());
		sap.ui.getCore().applyChanges();

		this.oCalculationBuilder._oExpressionBuilder.onsapenter({
			target: oItem.$()[1]
		});
		assert.ok(oPopover.isOpen());
		sap.ui.getCore().applyChanges();

		this.oCalculationBuilder._oExpressionBuilder.onsapenter({
			target: oItem.$()[3]
		});
		assert.ok(oPopover.isOpen());
		sap.ui.getCore().applyChanges();

		this.oCalculationBuilder._oExpressionBuilder.onsapenter({
			target: oItem.$()[5]
		});
		assert.ok(oPopover.isOpen());
		sap.ui.getCore().applyChanges();

		oPopover.close();
		assert.ok(oPopover.$().is(":hidden"));
	});

	QUnit.test("Deleting items", function (assert) {
		var oItem = new CalculationBuilderItem({
			key: 100
		});

		assert.expect(2);

		this.oCalculationBuilder.addItem(oItem);
		render(this.oCalculationBuilder);
		assert.equal(oItem.getKey(), "100");

		this.oCalculationBuilder._oExpressionBuilder._oCurrentItem = oItem;
		this.oCalculationBuilder._oExpressionBuilder._deleteItem();
		sap.ui.getCore().applyChanges();
		assert.ok(this.oCalculationBuilder.getItems().length === 0);
	});

	QUnit.test("Converting items to template", function (assert) {
		var aConvertedItems,
			aCorrectTemplate = ["", ",", "", ",", ""],
			nCorrectTemplateLength = aCorrectTemplate.length,
			aItems = [
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[""]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[","]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[""]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[","]
				}),
				new CalculationBuilderItem({
					key: CalculationBuilderOperatorType[""]
				})
			];

		assert.expect(1 + nCorrectTemplateLength);

		aConvertedItems = this.oCalculationBuilder._convertToTemplate(aItems);
		assert.equal(aConvertedItems.length, nCorrectTemplateLength);

		for (var i = 0; i < nCorrectTemplateLength; i++) {
			assert.equal(aConvertedItems[i], aCorrectTemplate[i]);
		}
	});

	QUnit.test("Setting expression", function (assert) {
		var sNewExpression = "123 + 456";

		assert.expect(1);

		this.oCalculationBuilder.setExpression(sNewExpression);
		assert.equal(this.oCalculationBuilder.getExpression(), sNewExpression);

		render(this.oCalculationBuilder);
		this.oCalculationBuilder._oExpressionBuilder._fireChange();
		this.oCalculationBuilder._oInput.fireChange();
	});

	QUnit.test("Allowed function", function (assert) {
		var oFunctionMap = this.oCalculationBuilder._getFunctionMap(),
			sFunctionType = CalculationBuilderFunctionType.Case.toLowerCase();

		assert.expect(3);
		assert.notOk(oFunctionMap[sFunctionType].hasOwnProperty("allowed"));

		this.oCalculationBuilder.allowFunction(sFunctionType, false);
		assert.notOk(oFunctionMap[sFunctionType].allowed);

		this.oCalculationBuilder.allowFunction(sFunctionType, true);
		assert.ok(oFunctionMap[sFunctionType].allowed);
	});

	QUnit.test("DefaultSettings", function (assert) {
		// emtpy builder
		var oCalculationBuilder = new CalculationBuilder({});
		render(oCalculationBuilder);

		assert.expect(7);
		assert.equal(oCalculationBuilder.getItems().length, 0, "items length");

		oCalculationBuilder.destroy();
		oCalculationBuilder = new CalculationBuilder({
			items: [
				new CalculationBuilderItem({
					key: "A"
				})
			]
		});
		render(oCalculationBuilder);

		assert.equal(oCalculationBuilder.getItems().length, 1, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "A", "items length");

		oCalculationBuilder.destroy();
		oCalculationBuilder = new CalculationBuilder({
			items: [
				new CalculationBuilderItem({
					key: "A"
				})
			],
			expression: "B"
		});
		render(oCalculationBuilder);

		assert.equal(oCalculationBuilder.getItems().length, 1, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "B", "items length- priority of expression");

		oCalculationBuilder.destroy();
		oCalculationBuilder = new CalculationBuilder({
			expression: "B"
		});
		render(oCalculationBuilder);

		assert.equal(oCalculationBuilder.getItems().length, 1, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "B", "items length");
		oCalculationBuilder.destroy();
	});

	QUnit.test("String constnats", function (assert) {
		// emtpy builder
		var oCalculationBuilder = new CalculationBuilder({
			allowStringConstants: true,
			expression: "\"\" + 5"
		});
		render(oCalculationBuilder);

		assert.equal(oCalculationBuilder.getItems().length, 3, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "\"\"", "item key");

		oCalculationBuilder.setExpression("1");
		sap.ui.getCore().applyChanges();

		assert.equal(oCalculationBuilder.getItems().length, 1, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "1", "item key");

		var oExpressionBuilder = oCalculationBuilder._oExpressionBuilder;
		oExpressionBuilder._oCurrentItem = oCalculationBuilder.getItems()[0];
		oExpressionBuilder._updateOrCreateItem({
			key: "\"\""
		});
		sap.ui.getCore().applyChanges();

		assert.equal(oCalculationBuilder.getItems().length, 1, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "\"\"", "item key");
		assert.equal(oCalculationBuilder.getExpression(), "\"\"", "item key");

		oCalculationBuilder.setExpression("\"a\" + \"\"");
		sap.ui.getCore().applyChanges();

		assert.equal(oCalculationBuilder.getItems().length, 3, "items length");
		assert.equal(oCalculationBuilder.getItems()[0].getKey(), "\"a\"", "item key");
		assert.equal(oCalculationBuilder.getItems()[1].getKey(), "+", "item key");
		assert.equal(oCalculationBuilder.getItems()[2].getKey(), "\"\"", "item key");

		assert.equal(oCalculationBuilder.getExpression(), "\"a\" + \"\"", "item key");

		// allowStringConstants = false
		oCalculationBuilder.setAllowStringConstants(false);
		oCalculationBuilder.setExpression("\"\"");
		sap.ui.getCore().applyChanges();

		assert.equal(oExpressionBuilder._aErrors.length, 1, "item key");
		oCalculationBuilder.setAllowStringConstants(true);
		sap.ui.getCore().applyChanges();
		assert.equal(oExpressionBuilder._aErrors.length, 0, "item key");

		oCalculationBuilder.setExpression("");
		oCalculationBuilder.setAllowStringConstants(false);
		sap.ui.getCore().applyChanges();

		oExpressionBuilder._oCurrentItem = oExpressionBuilder._getNewItem();
		oExpressionBuilder._oCurrentItem._bIsNew = true;
		oExpressionBuilder._updateOrCreateItem({
			key: "\"\""
		});

		sap.ui.getCore().applyChanges();
		assert.equal(oExpressionBuilder._aErrors.length, 1, "item key");

		oCalculationBuilder.destroy();
	});

	QUnit.test("Runtime", function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
			allowStringConstants: true,
			expression: "a + 5"
		});
		render(oCalculationBuilder);
		assert.ok(oCalculationBuilder._oExpressionBuilder._aErrors.length > 0, "Errors");
		assert.ok(oCalculationBuilder.$("input-input").hasClass("sapCalculationBuilderInputError"), "Has error class");


		oCalculationBuilder.addVariable(new CalculationBuilderVariable({
			key: "a"
		}));
		oCalculationBuilder.validate();
		assert.ok(oCalculationBuilder._oExpressionBuilder._aErrors.length === 0, "Errors");
		assert.ok(!oCalculationBuilder.$("input-input").hasClass("sapCalculationBuilderInputError"), "Has error class");

		sap.ui.getCore().applyChanges();
		assert.ok(oCalculationBuilder._oExpressionBuilder._aErrors.length === 0, "Errors");
		assert.ok(!oCalculationBuilder.$("input-input").hasClass("sapCalculationBuilderInputError"), "Has error class");

		oCalculationBuilder.destroy();
	});

	QUnit.test("Error states", function (assert) {
		var oCalculationBuilder = new CalculationBuilder({
			expression: "",
			layoutType: "VisualOnly"
		});
		render(oCalculationBuilder);
		assert.ok(!oCalculationBuilder.$("erroricon").is(":visible"), "Not visible");

		oCalculationBuilder.appendError({
			title: "Maslo"
		});
		oCalculationBuilder.updateErrorsDisplay();

		assert.ok(!oCalculationBuilder.$("erroricon").is(":visible"), "Visible");

		oCalculationBuilder.setLayoutType("TextualOnly");
		sap.ui.getCore().applyChanges();

		assert.ok(!oCalculationBuilder.$("input-input").hasClass("sapCalculationBuilderInputError"), "No Error");

		oCalculationBuilder.appendError({
			title: "Maslo"
		});
		oCalculationBuilder.updateErrorsDisplay();

		assert.ok(oCalculationBuilder.$("input-input").hasClass("sapCalculationBuilderInputError"), "No Error");

		oCalculationBuilder.destroy();
	});
});
