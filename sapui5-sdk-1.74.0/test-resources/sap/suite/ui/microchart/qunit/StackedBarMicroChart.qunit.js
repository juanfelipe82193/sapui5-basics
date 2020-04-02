/*global QUnit, sinon */
sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/microchart/StackedBarMicroChart",
	"sap/suite/ui/microchart/AreaMicroChart",
	"sap/suite/ui/microchart/StackedBarMicroChartBar",
	"sap/ui/model/json/JSONModel",
	"sap/m/Table",
	"sap/m/ColumnListItem",
	"sap/m/FlexBox",
	"sap/ui/Device",
	"sap/ui/core/theming/Parameters",
	"sap/m/ValueColor",
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/ui/core/TooltipBase",
	"sap/suite/ui/microchart/StackedBarMicroChartRenderer",
	"sap/suite/ui/microchart/library",
	"./TestUtils"
], function (jQuery, StackedBarMicroChart, AreaMicroChart, StackedBarMicroChartBar, JSONModel, Table, ColumnListItem,
			 FlexBox, Device, Parameters, ValueColor, GenericTile, TileContent, TooltipBase, StackedBarMicroChartRenderer,
			 microchartLibrary, TestUtils) {
	"use strict";

	jQuery.sap.initMobile();


	var oCallback;

	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function() {
			this.oStubIsInitialized = sinon.stub(sap.ui.getCore(), "isInitialized");
			this.oSpyAttachInit = sinon.spy(sap.ui.getCore(), "attachInit");
			this.oSpyHandleCoreInitialized = sinon.spy(StackedBarMicroChart.prototype, "_handleCoreInitialized");
			this.oStubThemeApplied = sinon.stub(sap.ui.getCore(), "isThemeApplied");
			this.oStubAttachThemeApplied = sinon.stub(sap.ui.getCore(), "attachThemeChanged").callsFake(function(fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.oSpyHandleThemeApplied = sinon.spy(StackedBarMicroChart.prototype, "_handleThemeApplied");
		},
		afterEach: function() {
			this.oStubIsInitialized.restore();
			this.oSpyAttachInit.restore();
			this.oSpyHandleCoreInitialized.restore();
			this.oStubThemeApplied.restore();
			this.oStubAttachThemeApplied.restore();
			this.oSpyHandleThemeApplied.restore();
		}
	});

	QUnit.test("Core not loaded and theme not loaded", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(false);
		this.oStubThemeApplied.returns(false);

		//Act
		var oChart = new StackedBarMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.oSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core not loaded and theme loaded", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(false);
		this.oStubThemeApplied.returns(true);

		//Act
		var oChart = new StackedBarMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.oSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core loaded and theme not loaded", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(true);
		this.oStubThemeApplied.returns(false);

		//Act
		var oChart = new StackedBarMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.oSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core loaded and theme loaded", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(true);
		this.oStubThemeApplied.returns(true);

		//Act
		var oChart = new StackedBarMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.oSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.module("Rendering tests - sap.suite.ui.microchart.StackedBarMicroChart", {
		beforeEach: function() {
			this.oChart = new StackedBarMicroChart("stackedbar-chart", {
				size: "M",
				bars: [
					new StackedBarMicroChartBar({
						value: 10,
						valueColor: "#ffffff",
						displayValue: "10M"
					}),
					new StackedBarMicroChartBar({
						value: 20,
						valueColor: "Critical",
						displayValue: "18M"
					})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("StackedBar chart rendered", function(assert) {
		var $Chart = this.oChart.$();
		var $FirstBar = this.oChart.getBars()[0].$();
		var $FirstLabel = $FirstBar.find(":nth-child(1)");

		assert.ok($Chart, "StackedBar chart was rendered successfully");
		assert.ok($Chart.attr("title").length > 0, "StackedBar chart title was rendered successfully");
		assert.ok($Chart.attr("aria-label").length > 0, "StackedBar chart aria label was rendered successfully");
		assert.equal($Chart.attr("role"), "img", "StackedBar chart aria role was rendered successfully");
		assert.ok($Chart.hasClass("sapSuiteStackedMC"), "StackedBar chart class was rendered successfully");
		assert.ok($FirstBar.width(), "StackedBar chart first child width was set successfully");
		assert.ok($FirstBar.hasClass("sapSuiteStackedMCBar"), "StackedBar chart bar class was rendered successfully");
		assert.ok($FirstLabel.hasClass("sapSuiteStackedMCBarLabel"), "StackedBar chart first label class was rendered successfully");
		assert.equal($FirstLabel.html(), "10M", "StackedBar chart first label value was rendered successfully");
		assert.ok($FirstLabel.attr("style").indexOf("color") !== -1, "StackedBar chart first label color was set successfully");
	});

	QUnit.test("Test Aria-label and Aria-labelledBy superseding", function(assert) {
		assert.ok(this.oChart.$().attr("aria-label"), "By default, the aria-label attribute is rendered");
		assert.equal(this.oChart.$().attr("aria-labelledBy"), null, "By default, the aria-labelledBy attribute is not rendered");

		this.oChart.addAriaLabelledBy(new sap.m.Text());
		sap.ui.getCore().applyChanges();
		assert.equal(this.oChart.$().attr("aria-label"), null, "When first Control is added to ariaLabelledBy association, the aria-label attribute is not rendered");
		assert.equal(this.oChart.$().attr("aria-labelledBy").split(" ").length, 1, "When first Control is added to ariaLabelledBy association, the aria-labelledBy attribute is rendered and cointains 1 ID");

		this.oChart.addAriaLabelledBy(new sap.m.Button());
		sap.ui.getCore().applyChanges();
		assert.equal(this.oChart.$().attr("aria-label"), null, "When second Control is added to ariaLabelledBy association, the aria-label attribute is not rendered");
		assert.equal(this.oChart.$().attr("aria-labelledBy").split(" ").length, 2, "When second Control is added to ariaLabelledBy association, the aria-labelledBy attribute is rendered and contains 2 IDs");

		this.oChart.removeAllAriaLabelledBy();
		sap.ui.getCore().applyChanges();
		assert.ok(this.oChart.$().attr("aria-label"), "When removed all ariaLabelledBy, the aria-label attribute is rendered");
		assert.equal(this.oChart.$().attr("aria-labelledBy"), null, "When removed all ariaLabelledBy, the aria-labelledBy attribute is not rendered");
	});

	QUnit.test("StackedBar chart display value rendering as percentage value", function(assert) {
		// Arrange
		var fMaxValue = parseFloat(this.oChart.getMaxValue());
		this.oChart.getBars()[0].setDisplayValue(null);

		// Act
		this.oChart.rerender();

		// Assert
		var $FirstBar = this.oChart.getBars()[0].$();
		var $FirstLabel = $FirstBar.find(":nth-child(1)");
		assert.ok(!fMaxValue, "Chart max value was not defined");
		assert.equal($FirstLabel.html(), "33.3%", "StackedBar chart first label value was rendered successfully as percentage value");
	});

	QUnit.test("StackedBar chart display value rendering as absolute value", function(assert) {
		this.oChart.setMaxValue(100);
		this.oChart.getBars()[0].setDisplayValue(null);
		this.oChart.rerender();
		var fMaxValue = parseFloat(this.oChart.getMaxValue());
		var $FirstBar = this.oChart.getBars()[0].$();
		var $FirstLabel = $FirstBar.find(":nth-child(1)");

		assert.equal(fMaxValue, 100, "Chart max value was defined");
		assert.equal($FirstLabel.html(), "10", "StackedBar chart first label value was rendered successfully as absolute value");
	});

	QUnit.test("StackedBar chart max value rendering", function(assert) {
		// Arrange
		var fMaxValue = parseFloat(this.oChart.getMaxValue());
		var fNewMaxValue = 100;
		var fNewMaxValueInvalid = "100tr";
		// Act
		this.oChart.setMaxValue(fNewMaxValue);
		this.oChart.getBars()[0].setDisplayValue(null);
		var fNewMaxValueReturned = parseFloat(this.oChart.getMaxValue());
		this.oChart.setMaxValue(fNewMaxValueInvalid);
		var fNewMaxValueInvalidReturned = parseFloat(this.oChart.getMaxValue());
		// Assert
		assert.ok(!fMaxValue, "Chart max value was not defined");
		assert.equal(fNewMaxValueReturned, fNewMaxValue, "Chart max value was set to a new value");
		assert.ok(!fNewMaxValueInvalidReturned, "Chart max value was set to an invalid value and ignored");
	});

	QUnit.test("StackedBar chart max value equal bars sum rendering", function(assert) {
		// Arrange
		var fMaxValue = parseFloat(this.oChart.getMaxValue());
		var fNewMaxValue = 30;
		// Act
		this.oChart.setMaxValue(fNewMaxValue);
		this.oChart.getBars()[0].setDisplayValue(null);
		this.oChart.rerender();
		var fNewMaxValueReturned = parseFloat(this.oChart.getMaxValue());
		var $FirstBar = this.oChart.getBars()[0].$();
		var $FirstLabel = $FirstBar.find(":nth-child(1)");
		// Assert
		assert.ok(!fMaxValue, "Chart max value was not defined");
		assert.equal(fNewMaxValueReturned, fNewMaxValue, "Chart max value was set to a new value");
		assert.equal($FirstLabel.html(), "10", "StackedBar chart first label value was rendered successfully as absolute value");
	});

	QUnit.test("StackedBar chart max value less than bars sum rendering", function(assert) {
		// Arrange
		var fMaxValue = parseFloat(this.oChart.getMaxValue());
		var fNewMaxValue = 10;
		// Act
		this.oChart.setMaxValue(fNewMaxValue);
		this.oChart.getBars()[0].setDisplayValue(null);
		this.oChart.rerender();
		var fNewMaxValueReturned = parseFloat(this.oChart.getMaxValue());
		var $FirstBar = this.oChart.getBars()[0].$();
		var $FirstLabel = $FirstBar.find(":nth-child(1)");
		// Assert
		assert.ok(!fMaxValue, "Chart max value was not defined");
		assert.equal(fNewMaxValueReturned, fNewMaxValue, "Chart max value was set to a new value");
		assert.equal($FirstLabel.html(), "33.3%", "StackedBar chart first label value was rendered successfully as percentage value");
	});

	QUnit.test("StackedBar chart tooltip rendering", function(assert) {
		// Arrange
		var sTooltipDefault = this.oChart.getTooltip();
		var sTooltip = this.oChart.getTooltip_AsString();
		var sControlTooltip = "10M\n18M";
		var sNewTooltip = "Text1 Text2 ((AltText)) Text3 Text4";
		// Act
		this.oChart.setTooltip(sNewTooltip);
		var sNewTooltipReturned = this.oChart.getTooltip_AsString();
		// Assert
		assert.equal(sTooltipDefault, "((AltText))", "standard control tooltip was set");
		assert.ok(sTooltip.indexOf(sControlTooltip) !== -1, "internal control tooltip was built");
		assert.ok(sNewTooltipReturned.indexOf("Text1 Text2") !== -1, "custom control tooltip was set");
	});

	QUnit.test("StackedBar chart tooltip standard text", function(assert) {
		// Arrange
		var sNewTooltip = "Text1";
		// Act
		this.oChart.setTooltip(sNewTooltip);
		var sNewTooltipReturned = this.oChart.getTooltip_AsString();
		// Assert
		assert.equal(sNewTooltipReturned, sNewTooltip, "internal control tooltip text was supressed");
	});

	QUnit.test("StackedBar chart no tooltip rendering", function(assert) {
		// Arrange
		var sNewTooltip = " ";
		// Act
		this.oChart.setTooltip(sNewTooltip);
		var sNewTooltipReturned = this.oChart.getTooltip_AsString();
		// Assert
		assert.equal(this.oChart._isTooltipSuppressed(), true, "tooltip was supressed");
		assert.ok(sNewTooltipReturned, "Tooltip is present");
	});

	QUnit.test("Bar tooltip is used in aggregated tooltip", function(assert) {
		var sTooltip = "SPECIAL TOOLTIP";
		this.oChart.getBars()[0].setTooltip(sTooltip);

		assert.ok(this.oChart.getTooltip_AsString().indexOf(sTooltip) > -1, "The tooltip of the bar was found in the aggregated tooltip.");
	});

	QUnit.test("Bar tooltip is suppressed in aggregated tooltip", function(assert) {
		this.oChart.getBars()[0].setAggregation("tooltip", " ");
		var oGetTextStub = sinon.stub(this.oChart._oRb, "getText").withArgs("SEMANTIC_COLOR_CRITICAL").returns("Warning");
		sap.ui.getCore().applyChanges();

		assert.ok(this.oChart.getTooltip_AsString().indexOf("10M") < 0, "The tooltip of the bar was excluded from the aggregated tooltip.");
		this.oChart._oRb.getText.restore();
	});

	QUnit.test("StackedBar chart label color dark brightness - hex color", function(assert) {
		// Arrange
		var oRenderer = this.oChart.getRenderer();
		var sBackgroundColor = "#ffffff";
		// Act
		var sLabelColor = oRenderer._getLabelColor(sBackgroundColor);
		// Assert
		assert.equal(sLabelColor, "#000000", "Label color is dark");
	});

	QUnit.test("StackedBar chart label color dark brightness - short hex color", function(assert) {
		// Arrange
		var oRenderer = this.oChart.getRenderer();
		var sBackgroundColor = "#fff";
		// Act
		var sLabelColor = oRenderer._getLabelColor(sBackgroundColor);
		// Assert
		assert.equal(sLabelColor, "#000000", "Label color is dark");
	});

	QUnit.test("StackedBar chart label color dark brightness - named color", function(assert) {
		// Arrange
		var oRenderer = this.oChart.getRenderer();
		var sBackgroundColor = "white";
		// Act
		var sLabelColor = oRenderer._getLabelColor(sBackgroundColor);
		// Assert
		assert.equal(sLabelColor, "#000000", "Label color is dark");
	});

	QUnit.test("StackedBar chart label color light brightness - hex color", function(assert) {
		// Arrange
		var oRenderer = this.oChart.getRenderer();
		var sBackgroundColor = "#000000";
		// Act
		var sLabelColor = oRenderer._getLabelColor(sBackgroundColor);
		// Assert
		assert.equal(sLabelColor, "#ffffff", "Label color is light");
	});

	QUnit.test("StackedBar chart label color light brightness - short hex color", function(assert) {
		// Arrange
		var oRenderer = this.oChart.getRenderer();
		var sBackgroundColor = "#000";
		// Act
		var sLabelColor = oRenderer._getLabelColor(sBackgroundColor);
		// Assert
		assert.equal(sLabelColor, "#ffffff", "Label color is light");
	});

	QUnit.test("StackedBar chart label color light brightness - named color", function(assert) {
		// Arrange
		var oRenderer = this.oChart.getRenderer();
		var sBackgroundColor = "black";
		// Act
		var sLabelColor = oRenderer._getLabelColor(sBackgroundColor);
		// Assert
		assert.equal(sLabelColor, "#ffffff", "Label color is light");
	});

	QUnit.test("StackedBar last bar doesn't have a border", function(assert) {
		assert.equal(this.oChart.getBars()[0].$().css("border-right-width"), "1px", "First bar has border");
		assert.equal(this.oChart.getBars()[1].$().css("border-right-width"), "0px", "Last bar doesn't have border");
	});

	QUnit.test("Show labels true", function(assert) {
		this.oChart.setShowLabels(true);
		sap.ui.getCore().applyChanges();

		assert.equal(this.oChart.$().find(".sapSuiteStackedMCBarLabel").css("display"), "block", "Labels are visible");
	});

	QUnit.test("Show labels false", function(assert) {
		this.oChart.setShowLabels(false);
		sap.ui.getCore().applyChanges();

		assert.equal(this.oChart.$().find(".sapSuiteStackedMCBarLabel").length, 0, "Labels not visible");
	});

	QUnit.test("StackedBars with value 0 are rendered", function(assert) {
		this.oChart.addBar(
			new StackedBarMicroChartBar({
				value: 0
			})
		);

		this.oChart.insertBar(
			new StackedBarMicroChartBar({
				value: 0
			}), 0
		);

		sap.ui.getCore().applyChanges();

		var $Bars = this.oChart.$().find(".sapSuiteStackedMCContainer").children();

		assert.equal($Bars.eq(0).css("width"), "4px", "bar with 0 value is rendered and has min width set");
		assert.equal($Bars.eq(3).css("width"), "4px", "bar with 0 value is rendered and has min width set");
	});

	TestUtils.initSizeModule(StackedBarMicroChart, "sapSuiteStackedMCSize");

	QUnit.module("Tooltip behavior", {
		beforeEach: function() {
			this.oChart = new StackedBarMicroChart();
			this.oModel = new JSONModel({
				size: "M",
				Tooltip: "Custom Tooltip"
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
			this.oModel.destroy();
			this.oModel = null;
		}
	});

	QUnit.test("Default value for tooltip", function(assert) {
		assert.deepEqual(this.oChart.getTooltip(), "((AltText))", "Default value set correctly");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Model exists, tooltip is not bound", function(assert) {
		this.oChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();

		assert.deepEqual(this.oChart.getTooltip(), "((AltText))", "Default value set correctly");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Model exists, control is bound, tooltip aggregation is not bound", function(assert) {
		// Arrange
		this.oChart.setAggregation("tooltip", new TooltipBase({
			text: "{/Tooltip}"
		}));
		// Act
		this.oChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();
		// Assert
		assert.ok(this.oChart.getTooltip(), "Tooltip exists");
		assert.deepEqual(this.oChart.getTooltip().getText(), "Custom Tooltip", "Tooltip exists");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Model exists, control is bound", function(assert) {
		//Arrange
		var oModel = new JSONModel({
			data: [{
				size: "M",
				Tooltip: "Custom Tooltip"
			}]
		});
		var oTable = new Table({
			items: {
				path: "/data",
				template: new ColumnListItem({
					cells: [new StackedBarMicroChart({
						bars: [new StackedBarMicroChartBar({
							value: 4711
						})]
					})]
				})
			}
		}).setModel(oModel);
		//Act
		sap.ui.getCore().applyChanges();
		var oChart = oTable.getItems()[0].getCells()[0];
		//Assert
		assert.deepEqual(oChart.getTooltip(), "((AltText))", "Binding is empty, so tooltip aggregation is also empty.");
		assert.ok(oChart.getTooltip_AsString().indexOf("100%") > -1, "Binding is empty but display tooltip is not empty.");
		assert.notOk(oChart.isBound("tooltip"), "Tooltip is bound");
		//Cleanup
		oTable.destroy();
		oModel.destroy();
	});

	QUnit.test("Model exists, control is bound, no tooltip", function(assert) {
		//Arrange
		var oModel = new JSONModel({
			data: [{
				size: "M"
			}]
		});
		var oTable = new Table({
			items: {
				path: "/data",
				template: new ColumnListItem({
					cells: [new StackedBarMicroChart()]
				})
			}
		}).setModel(oModel);
		//Act
		sap.ui.getCore().applyChanges();
		var oChart = oTable.getItems()[0].getCells()[0];
		//Assert
		assert.ok(oChart.getTooltip_AsString().indexOf("No data") > -1, "The aria-label includes no data.");
		assert.notOk(oChart.isBound("tooltip"), "Tooltip is bound");
		//Cleanup
		oTable.destroy();
		oModel.destroy();
		oModel.destroy();
	});

	QUnit.module("Test chart data calculation", {
		beforeEach: function(assert) {
			this.oChart = new StackedBarMicroChart("test-chart");
		},
		afterEach: function(assert) {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("One bar with no color", function(assert) {
		// Arrange
		var oChartBar = new StackedBarMicroChartBar({
			value: 10
		});
		// Act
		this.oChart.addBar(oChartBar);
		var aResult = this.oChart._calculateChartData();
		// Assert
		assert.equal(aResult.length, 1, "One bar calculated");
		assert.equal(aResult[0].value, 100, "One bar takes 100%");
		assert.equal(aResult[0].color, "sapUiChartPaletteQualitativeHue1", "When no color, chart color is used");
	});

	QUnit.test("Two bars with no color", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 10
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 20
		}));
		// Act
		var aResult = this.oChart._calculateChartData();
		// Assert
		assert.equal(aResult.length, 2, "Two bars calculated");
		assert.equal(aResult[0].value, 33.3, "First bar takes 33.3%");
		assert.equal(aResult[1].value, 66.7, "Second bar takes 66.7%");
		assert.equal(aResult[0].color, "sapUiChartPaletteQualitativeHue1", "When no color, first chart color is used");
		assert.equal(aResult[1].color, "sapUiChartPaletteQualitativeHue2", "When no color, second chart color is used");
	});

	QUnit.test("More bars with no colors", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 20
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 10
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 30
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 40
		}));
		// Act
		var aResult = this.oChart._calculateChartData();
		// Assert
		assert.equal(aResult.length, 4, "Four bars calculated");
		assert.equal(aResult[0].value, 20, "First bar takes 20%");
		assert.equal(aResult[0].color, "sapUiChartPaletteQualitativeHue1", "When no color, first chart color is used");
		assert.equal(aResult[1].value, 10, "Second bar takes 10%");
		assert.equal(aResult[1].color, "sapUiChartPaletteQualitativeHue2", "When no color, second chart color is used");
		assert.equal(aResult[2].value, 30, "Third bar takes 30%");
		assert.equal(aResult[2].color, "sapUiChartPaletteQualitativeHue3", "When no color, third chart color is used");
		assert.equal(aResult[3].value, 40, "Third bar takes 40%");
		assert.equal(aResult[3].color, "sapUiChartPaletteQualitativeHue4", "When no color, fourth chart color is used");
	});

	QUnit.test("Large positive value handled", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 200000
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 10
		}));
		// Act
		var aResult = this.oChart._calculateChartData();
		// Assert
		assert.equal(aResult.length, 2, "Two bars calculated");
		assert.equal(aResult[0].value, 100, "First bar takes 100%");
		assert.equal(aResult[1].value, 0, "Second bar takes 0%");
	});

	QUnit.test("Max value chart with one bar", function(assert) {
		// Arrange
		var oChartBar = new StackedBarMicroChartBar({
			value: 10
		});
		// Act
		this.oChart.addBar(oChartBar);
		this.oChart.setMaxValue(20);
		var aResult = this.oChart._calculateChartData();
		// Assert
		assert.equal(aResult.length, 2, "One colored bar and one transparent bar calculated");
		assert.equal(this.oChart.getMaxValue(), 20, "Max value set correctly");
		assert.equal(aResult[0].value, 50, "The first bar takes 50%");
		assert.ok(aResult[0].color, "The first bar is colored");
		assert.equal(aResult[1].value, 50, "The second bar takes 50%");
		assert.ok(!aResult[1].color, "The second bar is transparent");
	});

	QUnit.test("Max value chart with two bars", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 10
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 20
		}));
		// Act
		this.oChart.setMaxValue(100);
		var aResult = this.oChart._calculateChartData();
		// Assert
		assert.equal(aResult.length, 3, "Two colored bars and one transparent bar calculated");
		assert.equal(this.oChart.getMaxValue(), 100, "Max value set correctly");
		assert.equal(aResult[0].value, 10, "First bar takes 10%");
		assert.ok(aResult[0].color, "The first bar is colored");
		assert.equal(aResult[1].value, 20, "Second bar takes 20%");
		assert.ok(aResult[1].color, "The second bar is colored");
		assert.equal(aResult[2].value, 70, "Third bar takes 70%");
		assert.ok(!aResult[2].color, "The third bar is transparent");
	});

	QUnit.test("Max value chart equal sum of bars", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 20
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 20
		}));
		// Act
		this.oChart.setMaxValue(30);
		var aResult = this.oChart._calculateChartData();
		// Assert
		assert.equal(aResult.length, 2, "Two colored bars calculated");
		assert.equal(this.oChart.getMaxValue(), 30, "Max value set correctly");
		assert.equal(aResult[0].value, 50, "First bar takes 50%");
		assert.ok(aResult[0].color, "The first bar is colored");
		assert.equal(aResult[1].value, 50, "Second bar takes 50%");
		assert.ok(aResult[1].color, "The second bar is colored");
	});

	QUnit.test("Max value chart less than sum of bars", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 20
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 20
		}));
		// Act
		this.oChart.setMaxValue(20);
		var aResult = this.oChart._calculateChartData();
		// Assert
		assert.equal(aResult.length, 2, "Two colored bars calculated");
		assert.equal(this.oChart.getMaxValue(), 20, "Max value set correctly");
		assert.equal(aResult[0].value, 50, "First bar takes 50%");
		assert.ok(aResult[0].color, "The first bar is colored");
		assert.equal(aResult[1].value, 50, "Second bar takes 50%");
		assert.ok(aResult[1].color, "The second bar is colored");
	});

	QUnit.test("Rounding percentages under 100% - increase percentage max item", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 24.135
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 24.135
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 24.135
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 26.9
		}));
		// Act
		var aResult = this.oChart._calculateChartData();
		var fWidthTotal = 0;
		for (var i = 0; i < aResult.length; i++) {
			fWidthTotal = fWidthTotal + aResult[i].width;
		}
		// Assert
		assert.equal(aResult.length, 4, "Four bars calculated");
		assert.equal(fWidthTotal, 100, "The total percentage width is 100%");
		assert.equal(aResult.length, 4, "Four bars calculated");
		assert.equal(aResult[0].width, 24.3, "First bar width is 24.3%");
		assert.equal(aResult[1].width, 24.3, "Second bar width is 24.3%");
		assert.equal(aResult[2].width, 24.3, "Third bar width is 24.3%");
		assert.equal(aResult[3].width, 27.1, "Fourth bar width is 27.1%");
	});

	QUnit.test("Rounding percentages over 100% - reduce percentage max item", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 28.135
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 28.135
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 28.135
		}));
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 26.9
		}));
		// Act
		var aResult = this.oChart._calculateChartData();
		var fWidthTotal = 0;
		for (var i = 0; i < aResult.length; i++) {
			fWidthTotal = fWidthTotal + aResult[i].width;
		}
		// Assert
		assert.equal(aResult.length, 4, "Four bars calculated");
		assert.equal(fWidthTotal, 100, "The total percentage width is 100%");
		assert.equal(aResult.length, 4, "Four bars calculated");
		assert.equal(aResult[0].width, 25.27, "First bar width is 25.27%");
		assert.equal(aResult[1].width, 25.28, "Second bar width is 25.28%");
		assert.equal(aResult[2].width, 25.28, "Third bar width is 25.28%");
		assert.equal(aResult[3].width, 24.17, "Fourth bar width is 24.17%");
	});

	QUnit.module("Test chart precision", {
		beforeEach: function(assert) {
			this.oChart = new StackedBarMicroChart("test-chart-precision");
			this.oChart.addBar(new StackedBarMicroChartBar({
				value: 40
			}));
			this.oChart.addBar(new StackedBarMicroChartBar({
				value: 100
			}));
			this.oChart.addBar(new StackedBarMicroChartBar({
				value: 60
			}));
			this.oChart.addBar(new StackedBarMicroChartBar({
				value: 10
			}));
		},
		afterEach: function(assert) {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Precision - default value of 1", function(assert) {
		// Arrange
		var iPrecision = this.oChart.getPrecision();
		var aResult = this.oChart._calculateChartData();
		// Act
		// Assert
		assert.equal(iPrecision, 1, "Precision default value of 1");
		assert.equal(aResult[0].value, 19, "First bar takes 19%");
		assert.equal(aResult[1].value, 47.6, "Second bar takes 47.6%");
		assert.equal(aResult[2].value, 28.6, "Third bar takes 28.6%");
		assert.equal(aResult[3].value, 4.8, "Fourth bar takes 4.8%");
	});

	QUnit.test("Precision - value of 0", function(assert) {
		// Arrange
		// Act
		this.oChart.setPrecision(0);
		var iPrecision = this.oChart.getPrecision();
		var aResult = this.oChart._calculateChartData();
		// Assert
		assert.equal(iPrecision, 0, "Precision value of 0");
		assert.equal(aResult[0].value, 19, "First bar takes 19%");
		assert.equal(aResult[1].value, 48, "Second bar takes 48%");
		assert.equal(aResult[2].value, 29, "Third bar takes 29");
		assert.equal(aResult[3].value, 5, "Fourth bar takes 5%");
	});

	QUnit.test("Precision - value of 2", function(assert) {
		// Arrange
		// Act
		this.oChart.setPrecision(2);
		var iPrecision = this.oChart.getPrecision();
		var aResult = this.oChart._calculateChartData();
		// Assert
		assert.equal(iPrecision, 2, "Precision value of 2");
		assert.equal(aResult[0].value, 19.05, "First bar takes 19.05%");
		assert.equal(aResult[1].value, 47.62, "Second bar takes 47.62%");
		assert.equal(aResult[2].value, 28.57, "Third bar takes 28.57");
		assert.equal(aResult[3].value, 4.76, "Fourth bar takes 4.76%");
	});

	QUnit.test("Precision - value of 3", function(assert) {
		this.oChart.setPrecision(3);
		var iPrecision = this.oChart.getPrecision();
		var aResult = this.oChart._calculateChartData();

		assert.equal(iPrecision, 3, "Precision value of 3");
		assert.equal(aResult[0].value, 19.048, "First bar takes 19.048%");
		assert.equal(aResult[1].value, 47.619, "Second bar takes 47.619%");
		assert.equal(aResult[2].value, 28.571, "Third bar takes 28.571");
		assert.equal(aResult[3].value, 4.762, "Fourth bar takes 4.762%");
	});

	QUnit.module("Semantic color classes", {
		beforeEach: function() {
			this.oRenderer = StackedBarMicroChartRenderer;
		}
	});

	QUnit.test("Correct class name for Neutral semantic color", function(assert) {
		assert.equal(this.oRenderer._getValueCssParameter(ValueColor.Neutral), "sapUiNeutralElement", "The correct class name is returned.");
	});
	QUnit.test("Correct class name for Good semantic color", function(assert) {
		assert.equal(this.oRenderer._getValueCssParameter(ValueColor.Good), "sapUiPositiveElement", "The correct class name is returned.");
	});
	QUnit.test("Correct class name for Error semantic color", function(assert) {
		assert.equal(this.oRenderer._getValueCssParameter(ValueColor.Error), "sapUiNegativeElement", "The correct class name is returned.");
	});
	QUnit.test("Correct class name for Critical semantic color", function(assert) {
		assert.equal(this.oRenderer._getValueCssParameter(ValueColor.Critical), "sapUiCriticalElement", "The correct class name is returned.");
	});

	QUnit.module("Test colors", {
		beforeEach: function(assert) {
			this.oChart = new StackedBarMicroChart("chart-colors").placeAt("qunit-fixture");
			this.getHex = function (rgb){
				rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
				return (rgb && rgb.length === 4) ? "#" +
					("0" + parseInt(rgb[1]).toString(16)).slice(-2) +
					("0" + parseInt(rgb[2]).toString(16)).slice(-2) +
					("0" + parseInt(rgb[3]).toString(16)).slice(-2) : '';
			};

			sap.ui.getCore().applyChanges();
		},
		afterEach: function(assert) {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("No color", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 10
		}));
		var sColor = Parameters.get("sapUiChartPaletteQualitativeHue1");
		// Act
		sap.ui.getCore().applyChanges();
		// Assert
		var sBarColor = this.getHex(this.oChart.$().find(".sapSuiteStackedMCBar").css("background-color"));
		assert.equal(sBarColor, sColor, "When no color, chart color is used");
	});

	QUnit.test("Semantic color", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 10, valueColor: "Good"
		}));
		// Act
		this.oChart.rerender();
		var $Bar = this.oChart.$().find(".sapSuiteStackedMCBar");
		// Assert
		assert.ok($Bar.hasClass("sapSuiteStackedMCBarSemanticColorGood"), "Semantic color is supported");
	});

	QUnit.test("Hex color", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 10, valueColor: "#fafafa"
		}));
		var sColor = "rgb(250, 250, 250)";// #fafafa
		// Act
		this.oChart.rerender();
		var sBarColor = this.oChart.$().find(".sapSuiteStackedMCBar").css("background-color");
		// Assert
		assert.equal(sBarColor, sColor, "Hex color is supported");
	});

	QUnit.test("Less parameter color", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 10, valueColor: "sapUiLink"
		}));
		var sColor = Parameters.get("sapUiLink");
		// Act
		this.oChart.rerender();
		// Assert
		var sBarColor = this.getHex(this.oChart.$().find(".sapSuiteStackedMCBar").css("background-color"));
		assert.equal(sBarColor, sColor, "Less parameter color is supported");
	});

	QUnit.test("Invalid color", function(assert) {
		// Arrange
		this.oChart.addBar(new StackedBarMicroChartBar({
			value: 10, valueColor: "sapUiInvalidParameterColor"
		}));
		var sColor = Parameters.get("sapUiChartPaletteQualitativeHue1");
		// Act
		this.oChart.rerender();
		// Assert
		var sBarColor = this.getHex(this.oChart.$().find(".sapSuiteStackedMCBar").css("background-color"));
		assert.equal(sBarColor, sColor, "For invalid color, chart color is used");
	});

	QUnit.module("Press event", {
		beforeEach: function() {
			oCallback = sinon.spy();

			this.oChart = new StackedBarMicroChart("stackedbar-chart", {
				size: "M",
				bars: [new StackedBarMicroChartBar({
					value: 10,
					valueColor: "Good",
					displayValue: "10M"
				}), new StackedBarMicroChartBar({
					value: 20,
					valueColor: "Critical",
					displayValue: "18M"
				})],
				press: oCallback
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Press event propagation", function(assert) {
		var oEvent = {
			stopPropagation: jQuery.noop
		};
		var oSpyPropagation = sinon.spy(oEvent, "stopPropagation");
		this.oChart.onclick(oEvent);
		assert.equal(oSpyPropagation.callCount, 1, "Event stopPropagation was called once");
		oSpyPropagation.restore();
	});

	QUnit.test("Press event propagation", function(assert) {
		this.oChart.detachPress(oCallback);
		var oEvent = {
			stopPropagation: jQuery.noop
		};
		var oSpyPropagation = sinon.spy(oEvent, "stopPropagation");
		this.oChart.onclick(oEvent);
		assert.equal(oSpyPropagation.callCount, 0, "Event stopPropagation was not called");
		oSpyPropagation.restore();
	});

	QUnit.test("Press behavior", function(assert) {
		var $stackMc = jQuery(".sapSuiteStackedMC");
		$stackMc.focus().click();
		sap.ui.getCore().applyChanges();
		assert.equal(oCallback.callCount, 1, "Chart press handler called.");

		this.oChart.detachPress(oCallback);
		$stackMc.focus().click();
		sap.ui.getCore().applyChanges();
		assert.equal(oCallback.callCount, 1, "Chart press handler still has call count of 1 because the handler was detached.");

		this.oChart.attachPress(oCallback);
		$stackMc.focus().click();
		sap.ui.getCore().applyChanges();
		assert.ok(oCallback.calledTwice, "Chart press handler now has call count of 2");
	});

	QUnit.test("Press behavior in msie", function(assert) {
		var $stackMc = jQuery(".sapSuiteStackedMC"),
			bOriginalMsie = Device.browser.msie;
		Device.browser.msie = true;
		$stackMc.focus().click();
		sap.ui.getCore().applyChanges();
		assert.equal(oCallback.callCount, 1, "Chart press handler called.");

		this.oChart.detachPress(oCallback);
		$stackMc.focus().click();
		sap.ui.getCore().applyChanges();
		assert.equal(oCallback.callCount, 1, "Chart press handler still has call count of 1 because the handler was detached.");

		this.oChart.attachPress(oCallback);
		$stackMc.focus().click();
		sap.ui.getCore().applyChanges();
		assert.ok(oCallback.calledTwice, "Chart press handler now has call count of 2");
		Device.browser.msie = bOriginalMsie;
	});

	QUnit.module("Clone the bar", {
		beforeEach: function() {
			this.oChart = new StackedBarMicroChart("stackedbar-chart", {
				size: "M",
				bars: [new StackedBarMicroChartBar({
					value: 10,
					valueColor: "Good",
					displayValue: "10M"
				}), new StackedBarMicroChartBar({
					value: 20,
					valueColor: "Critical",
					displayValue: "18M"
				})]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Test clone the bar", function(assert) {
		assert.ok(this.oChart.getBars().length === 2, "Two bars in the chart");
		this.oChart.addBar(this.oChart.getBars()[0].clone());
		sap.ui.getCore().applyChanges();
		assert.ok(this.oChart.getBars().length === 3, "Three bars in the chart");
	});

	QUnit.module("Responsiveness", {
		beforeEach: function() {
			this.oChart = new StackedBarMicroChart("stackedbar-chart", {
				size: "Responsive",
				bars: [new StackedBarMicroChartBar({
					value: 10,
					valueColor: "Good",
					displayValue: "1000M"
				}), new StackedBarMicroChartBar({
					value: 20,
					valueColor: "Critical",
					displayValue: "18M"
				}), new StackedBarMicroChartBar({
					value: 20,
					valueColor: "Error",
					displayValue: "20M"
				})]
			});
			this.oFlexBox = new FlexBox("stb-fb", {
				items: [this.oChart],
				renderType: "Bare"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oFlexBox.destroy();
			this.oFlexBox = null;
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Responsiveness inside flexbox: adjust to parent", function(assert) {
		this.oFlexBox.setWidth("8rem");
		this.oFlexBox.setHeight("8rem");
		sap.ui.getCore().applyChanges();

		assert.equal(this.oChart.$().height(), "128", "Adjusted after the parent height: 8 rem");
		assert.equal(this.oChart.$().width(), "128", "Adjusted after the parent width: 8 rem");
	});

	QUnit.test("Vertical responsiveness: labels disappear", function(assert) {
		this.oFlexBox.setWidth("8rem");
		this.oFlexBox.setHeight("12px");
		sap.ui.getCore().applyChanges();

		assert.notEqual(this.oChart.$().css("display"), "none", "Chart has not disappeared");
		assert.equal(this.oChart.$().find(".sapSuiteStackedMCBarLabel").css("display"), "none", "Labels has disappeared");
	});

	QUnit.test("Horizontal responsiveness: truncated labels disappears/appears", function(assert) {
		this.oFlexBox.setWidth("1rem");
		this.oFlexBox.setHeight("8rem");
		this.oFlexBox.rerender();

		assert.equal(this.oChart.getBars()[0].$().find(".sapSuiteStackedMCBarLabel").css("display"), "none", "Truncated labels has disappeared");

		this.oFlexBox.setWidth("20rem");
		this.oFlexBox.rerender();

		assert.equal(this.oChart.getBars()[0].$().find(".sapSuiteStackedMCBarLabel").css("display"), "block", "Label appears again when there is space");
	});


	QUnit.module("Responsiveness adjustments for the use within a Div", {
		beforeEach: function() {
			var $fixture = jQuery("#qunit-fixture");
			$fixture.css("width", "50px");
			$fixture.css("height", "30px");
			this.oChart = new StackedBarMicroChart({
				size: "Responsive",
				bars: [new StackedBarMicroChartBar({
					value: 10,
					valueColor: "Good",
					displayValue: "10M"
				})]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Chart inside a simple div", function(assert) {
		var oParent = jQuery(this.oChart.getParent().getRootNode());
		var iChartHeightExpected = Math.round(oParent.height());
		var iChartWidthExpected = Math.round(oParent.width());

		assert.equal(this.oChart.$().height(), iChartHeightExpected, "Chart is rendered with the parent height");
		assert.equal(this.oChart.$().width(), iChartWidthExpected, "Chart is rendered with the parent width");
	});

	QUnit.module("Title attribute is added and removed when mouse enters and leaves", {
		beforeEach: function() {
			this.oChart = new StackedBarMicroChart("stackedbar-chart", {
				size: "M",
				bars: [new StackedBarMicroChartBar({
					value: 10,
					valueColor: "Good",
					displayValue: "10M"
				}), new StackedBarMicroChartBar({
					value: 20,
					valueColor: "Critical",
					displayValue: "18M"
				})]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("The title attribute is added when mouse enters", function(assert) {
		//Arrange
		var $Chart = this.oChart.$();
		//Act
		$Chart.trigger("mouseenter");
		sap.ui.getCore().applyChanges();
		//Assert
		assert.notEqual($Chart.attr("title"), null, "The title attribute is added");
	});

	QUnit.test("The title attribute is removed when mouse leaves", function(assert) {
		//Arrange
		var $Chart = this.oChart.$();
		//Act
		$Chart.trigger("mouseleave");
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal($Chart.attr("title"), null, "The title attribute is removed");
	});

	QUnit.test("The title attribute is removed and added again when mouse leaves and enters again", function(assert) {
		//Arrange
		var $Chart = this.oChart.$();
		//Act
		$Chart.trigger("mouseleave");
		$Chart.trigger("mouseenter");
		sap.ui.getCore().applyChanges();
		//Assert
		assert.notEqual($Chart.attr("title"), null, "The title attribute is added again");
	});

	QUnit.test("The title attribute is removed and recreated when mouse leaves and enters again", function(assert) {
		//Arrange
		var $Chart = this.oChart.$();
		//Act
		$Chart.trigger("mouseleave");
		this.oChart._title = null;
		$Chart.trigger("mouseenter");
		sap.ui.getCore().applyChanges();
		//Assert
		assert.notEqual($Chart.attr("title"), null, "The title attribute is added again");
	});

	QUnit.module("Execution of functions onAfterRendering", {
		beforeEach: function() {
			this.oChart = new StackedBarMicroChart();
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Visibility check", function(assert) {
		//Arrange
		var oSpyCheckControlIsVisible = sinon.spy(microchartLibrary, "_checkControlIsVisible");
		//Act
		this.oChart.onAfterRendering();
		//Assert
		assert.ok(oSpyCheckControlIsVisible.calledOnce, "Method _checkControlIsVisible has been called once.");
		//Restore
		oSpyCheckControlIsVisible.restore();
	});

	QUnit.test("Function check of _onControlIsVisible", function(assert) {
		//Arrange
		var oSpyOnResize = sinon.spy(this.oChart, "_onResize");
		//Act
		this.oChart.onAfterRendering();
		//Assert
		assert.ok(oSpyOnResize.called, "Method _onResize has been called.");
	});

	QUnit.module("Control provides accessibility information", {
		beforeEach : function() {
			this.oChart = new StackedBarMicroChart();
			this.oChart.setAggregation("tooltip", "StackedBarMicroChart");
		},
		afterEach : function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method getAccessibilityInfo returns correct information", function(assert) {
		// Arrange
		var oExpectedAccessibilityInformation = {
			description: "StackedBarMicroChart",
			type: this.oChart._getAccessibilityControlType()
		};

		// Act
		var oAccessibilityInformation = this.oChart.getAccessibilityInfo();

		// Assert
		assert.deepEqual(oAccessibilityInformation, oExpectedAccessibilityInformation, "An object with the correct properties has been returned.");
	});

	QUnit.module("Rendering tests for no data placeholder", {
		beforeEach: function() {
			this.oChart = new AreaMicroChart("stackedBarMicroChart").placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("No data rendered when no bars given", function(assert) {
		assert.ok(jQuery.sap.domById("stackedBarMicroChart"), "Control was rendered");
		var a$NoDataElement = jQuery.sap.byId(this.oChart.getId()).find(".sapSuiteUiMicroChartNoData");
		assert.equal(a$NoDataElement.length, 1, "No data placeholder shold be rendered");
	});

	QUnit.test("No data in aria-label", function(assert) {
		assert.ok(this.oChart.$().attr("aria-label").indexOf("No data") > -1, "The aria-label includes no data");
	});


});

