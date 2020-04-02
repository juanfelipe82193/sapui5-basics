/*global QUnit, sinon */
sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/microchart/RadialMicroChart",
	"sap/suite/ui/microchart/RadialMicroChartRenderer",
	"sap/m/FlexBox",
	"sap/m/ValueColor",
	"sap/ui/core/TooltipBase",
	"sap/m/Size",
	"sap/ui/model/json/JSONModel",
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/suite/ui/microchart/library",
	"./TestUtils"
], function (jQuery, RadialMicroChart, RadialMicroChartRenderer, FlexBox, ValueColor, TooltipBase, Size, JSONModel,GenericTile,TileContent, microchartLibrary, TestUtils) {
	"use strict";

	jQuery.sap.initMobile();


	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function() {
			this.oStubIsInitialized = sinon.stub(sap.ui.getCore(), "isInitialized");
			this.oSpyAttachInit = sinon.spy(sap.ui.getCore(), "attachInit");
			this.oSpyHandleCoreInitialized = sinon.spy(RadialMicroChart.prototype, "_handleCoreInitialized");
			this.oStubThemeApplied = sinon.stub(sap.ui.getCore(), "isThemeApplied");
			this.oStubAttachThemeApplied = sinon.stub(sap.ui.getCore(), "attachThemeChanged").callsFake(function(fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.oSpyHandleThemeApplied = sinon.spy(RadialMicroChart.prototype, "_handleThemeApplied");
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

	QUnit.test("Core initialization check - no core, no theme", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(false);
		this.oStubThemeApplied.returns(false);

		//Act
		var oChart = new RadialMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.oSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core initialization check - no core, but theme", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(false);
		this.oStubThemeApplied.returns(true);

		//Act
		var oChart = new RadialMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.notCalled, "Method Core.attachThemeChanged has not been called.");
		assert.ok(this.oSpyHandleThemeApplied.notCalled, "Method _handleThemeApplied has not been called.");
	});

	QUnit.test("Core initialization check - core, but no theme", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(true);
		this.oStubThemeApplied.returns(false);

		//Act
		var oChart = new RadialMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.oSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core initialization check - core and theme", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(true);
		this.oStubThemeApplied.returns(true);

		//Act
		var oChart = new RadialMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.notCalled, "Method Core.attachThemeChanged has not been called.");
		assert.ok(this.oSpyHandleThemeApplied.notCalled, "Method _handleThemeApplied has not been called.");
	});

	QUnit.module("Rendering tests for different sizes", {
		beforeEach: function() {
			this.oRadialMicroChartXS = new RadialMicroChart("radialMicroChartXS", {
				percentage: 50,
				size: Size.XS,
				press: function(oEvent) {}
			}).placeAt("qunit-fixture");
			this.oRadialMicroChartS = new RadialMicroChart("radialMicroChartS", {
				percentage: 50,
				size: Size.S,
				press: function(oEvent) {}
			}).placeAt("qunit-fixture");
			this.oRadialMicroChartM = new RadialMicroChart("radialMicroChartM", {
				percentage: 50,
				size: Size.M,
				press: function(oEvent) {}
			}).placeAt("qunit-fixture");
			this.oRadialMicroChartL = new RadialMicroChart("radialMicroChartL", {
				percentage: 50,
				size: Size.L,
				press: function(oEvent) {}
			}).placeAt("qunit-fixture");
			this.oRadialMicroChartAuto = new RadialMicroChart("radialMicroChartAuto", {
				percentage: 50,
				size: Size.Auto,
				press: function(oEvent) {}
			}).placeAt("qunit-fixture");
			this.oRadialMicroChartResponsive = new RadialMicroChart("radialMicroChartResponsive", {
				percentage: 50,
				size: Size.Responsive,
				press: function(oEvent) {}
			}).placeAt("qunit-fixture");
			this.oRadialMicroChartDefault = new RadialMicroChart("radialMicroChartDefault", {
				percentage: 50,
				press: function(oEvent) {}
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChartXS.destroy();
			this.oRadialMicroChartS.destroy();
			this.oRadialMicroChartM.destroy();
			this.oRadialMicroChartL.destroy();
			this.oRadialMicroChartAuto.destroy();
			this.oRadialMicroChartResponsive.destroy();
			this.oRadialMicroChartDefault.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("Controls in different sizes rendered", function(assert) {
		//Size XS
		assert.ok(jQuery.sap.domById("radialMicroChartXS"), "Control was rendered");
		assert.ok(this.oRadialMicroChartXS.$().hasClass("sapSuiteRMC") && this.oRadialMicroChartXS.$().hasClass("sapSuiteRMCSizeXS"), "Classes for Size XS correctly applied");
		assert.ok(this.oRadialMicroChartXS.$().find(".sapSuiteRMCInnerContainer").children("svg").hasClass("sapSuiteRMCSvg"), "Classes in SVG for Size XS correctly applied");
		assert.ok(this.oRadialMicroChartXS.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size XS has invisible inside label.");
		assert.notOk(this.oRadialMicroChartXS.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size XS has visible outside label.");
		//SizeS
		assert.ok(jQuery.sap.domById("radialMicroChartS"), "Control was rendered");
		assert.ok(this.oRadialMicroChartS.$().hasClass("sapSuiteRMC") && this.oRadialMicroChartS.$().hasClass("sapSuiteRMCSizeS"), "Classes for Size S correctly applied");
		assert.ok(this.oRadialMicroChartS.$().find(".sapSuiteRMCInnerContainer").children("svg").hasClass("sapSuiteRMCSvg"), "Classes in SVG for Size S correctly applied");
		assert.notOk(this.oRadialMicroChartS.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size S has invisible inside label.");
		assert.ok(this.oRadialMicroChartS.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size S has visible outside label.");
		//Size M
		assert.ok(jQuery.sap.domById("radialMicroChartM"), "Control was rendered");
		assert.ok(this.oRadialMicroChartM.$().hasClass("sapSuiteRMC") && this.oRadialMicroChartM.$().hasClass("sapSuiteRMCSizeM"), "Classes for Size M correctly applied");
		assert.ok(this.oRadialMicroChartM.$().find(".sapSuiteRMCInnerContainer").children("svg").hasClass("sapSuiteRMCSvg"), "Classes in SVG for Size M correctly applied");
		assert.notOk(this.oRadialMicroChartM.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size M has invisible inside label.");
		assert.ok(this.oRadialMicroChartM.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size M has visible outside label.");
		//Size L
		assert.ok(jQuery.sap.domById("radialMicroChartL"), "Control was rendered");
		assert.ok(this.oRadialMicroChartL.$().hasClass("sapSuiteRMC") && this.oRadialMicroChartL.$().hasClass("sapSuiteRMCSizeL"), "Classes for Size L correctly applied");
		assert.ok(this.oRadialMicroChartL.$().find(".sapSuiteRMCInnerContainer").children("svg").hasClass("sapSuiteRMCSvg"), "Classes in SVG for Size L correctly applied");
		assert.notOk(this.oRadialMicroChartL.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size L has invisible inside label.");
		assert.ok(this.oRadialMicroChartL.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size L has visible outside label.");
		//Size Auto
		assert.ok(jQuery.sap.domById("radialMicroChartAuto"), "Control was rendered");
		assert.ok(this.oRadialMicroChartAuto.$().hasClass("sapSuiteRMC") && this.oRadialMicroChartAuto.$().hasClass("sapSuiteRMCSizeAuto"), "Classes for Size Auto correctly applied");
		assert.ok(this.oRadialMicroChartAuto.$().find(".sapSuiteRMCInnerContainer").children("svg").hasClass("sapSuiteRMCSvg"), "Classes in SVG for Size Auto correctly applied");
		assert.notOk(this.oRadialMicroChartAuto.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size Auto has invisible inside label.");
		assert.ok(this.oRadialMicroChartAuto.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size Auto has visible outside label.");
		//Size Responsive
		assert.ok(jQuery.sap.domById("radialMicroChartResponsive"), "Control was rendered");
		assert.ok(this.oRadialMicroChartResponsive.$().hasClass("sapSuiteRMC") && this.oRadialMicroChartResponsive.$().hasClass("sapSuiteRMCSizeResponsive"), "Classes for Size Responsive correctly applied");
		assert.ok(this.oRadialMicroChartResponsive.$().find(".sapSuiteRMCInnerContainer").children("svg").hasClass("sapSuiteRMCSvg"), "Classes in SVG for Size Responsive correctly applied");
		assert.notOk(this.oRadialMicroChartResponsive.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size Responsive has invisible inside label.");
		assert.ok(this.oRadialMicroChartResponsive.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size Responsive has visible outside label.");
		//Default size must be rendered as Auto
		assert.ok(jQuery.sap.domById("radialMicroChartDefault"), "Control was rendered");
		assert.ok(this.oRadialMicroChartDefault.$().hasClass("sapSuiteRMC") && this.oRadialMicroChartDefault.$().hasClass("sapSuiteRMCSizeAuto"), "Classes for default Size correctly applied");
		assert.ok(this.oRadialMicroChartDefault.$().find(".sapSuiteRMCInnerContainer").children("svg").hasClass("sapSuiteRMCSvg"), "Classes in SVG for default size correctly applied");
		assert.notOk(this.oRadialMicroChartDefault.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size Default has invisible inside label.");
		assert.ok(this.oRadialMicroChartDefault.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCLabelHide"), "Size Default has visible outside label.");
	});

	QUnit.module("Rendering tests for 45.5%", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", {
				percentage: 45.5,
				press: function(oEvent) {}
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("Control rendered", function(assert) {
		//Arrange
		//Act
		//Assert
		assert.ok(jQuery.sap.domById("radialMicroChart"), "Control was rendered");
		assert.ok(this.oRadialMicroChart.$().hasClass("sapSuiteUiMicroChartPointer"), "Click and hover class was applied correctly due to press event");
		var a$CircleElementsInRadialChartDom = jQuery.sap.byId(this.oRadialMicroChart.getId()).find("circle");
		assert.equal(a$CircleElementsInRadialChartDom.length, 3, "3 circles were rendered, Background, 2xBorder");
		var a$PathElementsInRadialChartDom = jQuery.sap.byId(this.oRadialMicroChart.getId()).find("path");
		assert.equal(a$PathElementsInRadialChartDom.length, 2, "2 path elements were rendered, completed, not completed");
	});

	QUnit.test("Percentage constructor test", function(assert) {
		//Arrange
		//Act
		var fPercentage = this.oRadialMicroChart.getPercentage();

		//Assert
		assert.equal(fPercentage, 45.5, "Constructor with percentage works");
		assert.equal(this.oRadialMicroChart._getPercentageMode(), true, "Internal property percentageMode was set to true");
	});

	QUnit.test("Percentage set to the same value test", function(assert) {
		//Arrange
		sinon.spy(this.oRadialMicroChart, "setProperty");

		//Act
		this.oRadialMicroChart.setPercentage(45.5);
		var fPercentage = this.oRadialMicroChart.getPercentage();

		//Assert
		assert.equal(fPercentage, 45.5, "Percentage value was not changed");
		assert.equal(this.oRadialMicroChart.setProperty.calledOnce, false, "setProperty was not calledOnce on oRadialMicroChart since the percentage value was the same as the already configured one");
	});

	QUnit.test("Text Color test", function(assert) {
		//Arrange
		//Act
		var sColor = RadialMicroChartRenderer._getTextColorClass(this.oRadialMicroChart);
		//Assert
		assert.equal(sColor, "sapSuiteRMCNeutralTextColor", "Color class for 'Neutral' was correct if nothing was configured (default)");

		//Arrange
		this.oRadialMicroChart.setValueColor(ValueColor.Neutral);
		//Act
		sColor = RadialMicroChartRenderer._getTextColorClass(this.oRadialMicroChart);
		//Assert
		assert.equal(sColor, "sapSuiteRMCNeutralTextColor", "Color class for 'Neutral' was correct");

		//Arrange
		this.oRadialMicroChart.setValueColor(ValueColor.Good);
		//Act
		sColor = RadialMicroChartRenderer._getTextColorClass(this.oRadialMicroChart);
		//Assert
		assert.equal(sColor, "sapSuiteRMCGoodTextColor", "Color class for 'Good' was correct");

		//Arrange
		this.oRadialMicroChart.setValueColor(ValueColor.Error);
		//Act
		sColor = RadialMicroChartRenderer._getTextColorClass(this.oRadialMicroChart);
		//Assert
		assert.equal(sColor, "sapSuiteRMCErrorTextColor", "Color class for 'Error' was correct");

		//Arrange
		this.oRadialMicroChart.setValueColor(ValueColor.Critical);
		//Act
		sColor = RadialMicroChartRenderer._getTextColorClass(this.oRadialMicroChart);
		//Assert
		assert.equal(sColor, "sapSuiteRMCCriticalTextColor", "Color class for 'Critical' was correct");
	});

	QUnit.test("Path Color test", function(assert) {
		//Arrange
		//Act
		var sColor = RadialMicroChartRenderer._getPathColor(this.oRadialMicroChart);
		//Assert
		assert.equal(sColor, "sapSuiteRMCPathNeutral", "Color class for 'Neutral' was correct if nothing was configured (default)");

		//Arrange
		this.oRadialMicroChart.setValueColor(ValueColor.Neutral);
		//Act
		sColor = RadialMicroChartRenderer._getPathColor(this.oRadialMicroChart);
		//Assert
		assert.equal(sColor, "sapSuiteRMCPathNeutral", "Color class for 'Neutral' was correct");

		//Arrange
		this.oRadialMicroChart.setValueColor(ValueColor.Good);
		//Act
		sColor = RadialMicroChartRenderer._getPathColor(this.oRadialMicroChart);
		//Assert
		assert.equal(sColor, "sapSuiteRMCPathGood", "Color class for 'Good' was correct");

		//Arrange
		this.oRadialMicroChart.setValueColor(ValueColor.Error);
		//Act
		sColor = RadialMicroChartRenderer._getPathColor(this.oRadialMicroChart);
		//Assert
		assert.equal(sColor, "sapSuiteRMCPathError", "Color class for 'Error' was correct");

		//Arrange
		this.oRadialMicroChart.setValueColor(ValueColor.Critical);
		//Act
		sColor = RadialMicroChartRenderer._getPathColor(this.oRadialMicroChart);
		//Assert
		assert.equal(sColor, "sapSuiteRMCPathCritical", "Color class for 'Critical' was correct");
	});

	QUnit.test("Property valueColor test for multiple datatypes", function(assert) {
		//Arrange
		this.oRadialMicroChart.setValueColor("#666666");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oRadialMicroChart.getValueColor(), "#666666", "Applying hex value to property works");

		//Arrange
		this.oRadialMicroChart.setValueColor("red");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oRadialMicroChart.getValueColor(), "red", "Applying color string value to property works");

		//Arrange
		this.oRadialMicroChart.setValueColor(ValueColor.Good);
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oRadialMicroChart.getValueColor(), ValueColor.Good, "Applying enum value to property works");

		//Arrange
		this.oRadialMicroChart.setValueColor("Good");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oRadialMicroChart.getValueColor(), "Good", "Applying enum value as string to property works");

		//Arrange
		this.oRadialMicroChart.setValueColor();
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oRadialMicroChart.getValueColor(), ValueColor.Neutral, "Applying no value to property works (neutral is set)");

		//Arrange
		this.oRadialMicroChart.setValueColor("sapUiChartPaletteQualitativeHue5");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oRadialMicroChart.getValueColor(), "sapUiChartPaletteQualitativeHue5", "Applying LESS value to property works");
	});

	QUnit.module("Rendering tests for 0%", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", { percentage: 0.0 }).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("Control rendered", function(assert) {
		//Arrange

		//Act

		//Assert
		assert.ok(jQuery.sap.domById("radialMicroChart"), "Control was rendered");
		assert.ok(!this.oRadialMicroChart.$().hasClass("sapSuiteUiMicroChartPointer"), "Click and hover class was not applied since no press event was configured");
		var a$CircleElementsInRadialChartDom = jQuery.sap.byId(this.oRadialMicroChart.getId()).find("circle");
		assert.equal(a$CircleElementsInRadialChartDom.length, 4, "4 circles were rendered, Background, 2xBorder, inner circle");
		assert.equal(this.oRadialMicroChart.$().find(a$CircleElementsInRadialChartDom[3]).attr("class").trim(), "sapSuiteRMCRemainingCircle", "Incomplete (0%) circle was rendered");
	});

	QUnit.module("Rendering tests for 100%", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", { percentage: 100.0 }).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("Control rendered", function(assert) {
		assert.ok(jQuery.sap.domById("radialMicroChart"), "Control was rendered");
		var a$CircleElementsInRadialChartDom = jQuery.sap.byId(this.oRadialMicroChart.getId()).find("circle");
		assert.equal(a$CircleElementsInRadialChartDom.length, 4, "4 circles were rendered, Background, 2xBorder, inner circle");
	});

	QUnit.module("Rendering tests for percentage < 0%", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", { percentage: -50.0 }).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("Control rendered", function(assert) {
		//Arrange
		var sExpectedTranslationText = this.oRadialMicroChart._oRb.getText("RADIALMICROCHART_PERCENTAGE_TEXT", [0]);

		//Act
		//Assert
		assert.ok(jQuery.sap.domById("radialMicroChart"), "Control was rendered");
		var a$CircleElementsInRadialChartDom = jQuery.sap.byId(this.oRadialMicroChart.getId()).find("circle");
		assert.equal(a$CircleElementsInRadialChartDom.length, 4, "4 circles were rendered, Background, 2xBorder, inner circle");
		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCInsideLabel").text().trim(), sExpectedTranslationText, "Minimum value 0% was applied correctly when configuring value <0");
	});

	QUnit.module("Rendering tests for percentage > 100%", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", { percentage: 150.0 }).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("Control rendered", function(assert) {
		//Arrange
		var sExpectedTranslationText = this.oRadialMicroChart._oRb.getText("RADIALMICROCHART_PERCENTAGE_TEXT", [100]);

		//Act
		//Assert
		assert.ok(jQuery.sap.domById("radialMicroChart"), "Control was rendered");
		var a$CircleElementsInRadialChartDom = jQuery.sap.byId(this.oRadialMicroChart.getId()).find("circle");
		assert.equal(a$CircleElementsInRadialChartDom.length, 4, "4 circles were rendered, Background, 2xBorder, inner circle");
		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCInsideLabel").text().trim(), sExpectedTranslationText, "Maximum value 100% was applied correctly when configuring value >100");
	});

	QUnit.module("Rendering tests for Fraction > Total", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", {
				fraction: 145.5,
				total: 100
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("Control rendered", function(assert) {
		//Arrange
		var sExpectedTranslationText = this.oRadialMicroChart._oRb.getText("RADIALMICROCHART_PERCENTAGE_TEXT", [100]);

		//Act
		//Assert
		assert.ok(jQuery.sap.domById("radialMicroChart"), "Control was rendered");
		var a$CircleElementsInRadialChartDom = jQuery.sap.byId(this.oRadialMicroChart.getId()).find("circle");
		assert.equal(a$CircleElementsInRadialChartDom.length, 4, "4 circles were rendered, Background, 2xBorder, inner circle");
		var oText = this.oRadialMicroChart.$().find(".sapSuiteRMCInsideLabel");
		assert.equal(oText.text().trim(), sExpectedTranslationText, "Maximum value 100% was applied correctly when configuring value >100");
		var oSVG = jQuery.sap.byId(this.oRadialMicroChart.getId()).find("svg");
		assert.equal(oSVG.hasClass("sapSuiteRMCSmallFont"), false, "Class sapSuiteRMCSmallFont is not added to SVG element when accessible size is not used");
	});

	QUnit.module("Rendering tests for Fraction < 0", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", {
				fraction: -45.5,
				total: 100
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("Control rendered", function(assert) {
		//Arrange
		var sExpectedTranslationText = this.oRadialMicroChart._oRb.getText("RADIALMICROCHART_PERCENTAGE_TEXT", [0]);

		//Act
		//Assert
		assert.ok(jQuery.sap.domById("radialMicroChart"), "Control was rendered");
		var a$CircleElementsInRadialChartDom = jQuery.sap.byId(this.oRadialMicroChart.getId()).find("circle");
		assert.equal(a$CircleElementsInRadialChartDom.length, 4, "4 circles were rendered, Background, 2xBorder, inner circle");
		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCInsideLabel").text().trim(), sExpectedTranslationText, "Minimum value 0% was applied correctly when configuring value <0");
	});

	QUnit.module("Rendering tests for no data placeholder", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart").placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("No data rendered when no property given", function(assert) {
		assert.ok(jQuery.sap.domById("radialMicroChart"), "Control was rendered");
		var a$NoDataElement = jQuery.sap.byId(this.oRadialMicroChart.getId()).find(".sapSuiteUiMicroChartNoData");
		assert.equal(a$NoDataElement.length, 1, "No data placeholder shold be rendered");
	});

	QUnit.test("No data in aria-label", function(assert) {
		assert.equal(this.oRadialMicroChart.$().attr("role"), "img", "chart aria role was rendered successfully");
		assert.ok(this.oRadialMicroChart.$().attr("aria-label").indexOf("No data") > -1, "The aria-label includes no data");
	});

	QUnit.module("Chart property binding of percentage", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart({
				percentage: "{/percentage}"
			}).placeAt("qunit-fixture");
			this.oRadialMicroChart.setModel(new JSONModel({
				percentage: 0
			}));
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("PercentageMode with percentage 0 correctly set", function(assert) {
		assert.equal(this.oRadialMicroChart._getPercentageMode(), true, "PercentageMode set even if percentage is 0.");
		assert.equal(this.oRadialMicroChart.getPercentage(), 0, "Percentage has been correctly set.");
	});

	QUnit.module("Hide percentage label randering test", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", { total: 100, size: "Responsive"});
			this.oFlexBox = new FlexBox("rmc-fb", {
				items: [this.oRadialMicroChart],
				alignItems: "Center",
				renderType: "Bare"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Minimum sizes handling", function(assert) {
		this.oFlexBox.setHeight("10px");
		this.oFlexBox.setWidth("10px");

		this.oFlexBox.rerender();

		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCLabelHide"), true, "Inside label hidden");
		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCLabelHide"), false, "Outside label visible");
	});

	QUnit.test("Minimum width reached", function(assert) {
		this.oFlexBox.setHeight("65px");
		this.oFlexBox.setWidth("65px");

		this.oFlexBox.rerender();

		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCLabelHide"), false, "Inside label visible");
		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCLabelHide"), true, "Outside label hidden");
	});

	QUnit.test("Width exceeded", function(assert) {
		this.oFlexBox.setHeight("65px");
		this.oFlexBox.setWidth("35px");

		this.oFlexBox.rerender();

		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCLabelHide"), false, "Inside label hidden");
		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCLabelHide"), true, "Outside label hidden");
	});

	QUnit.test("Render outside label", function(assert) {
		this.oFlexBox.setHeight("30px");
		this.oFlexBox.setWidth("70px");

		this.oFlexBox.rerender();

		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCLabelHide"), true, "Inside label hidden");
		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCLabelHide"), false, "Outside label visible");
	});


	QUnit.test("Size after rendering needs to be the same as parent element.", function(assert) {
		//Arrange
		this.oFlexBox.setHeight("200px");
		this.oFlexBox.setWidth("200px");

		this.oFlexBox.rerender();

		//Act
		var sExpectedHeight = parseFloat(this.oRadialMicroChart.getParent().$().height());
		var sExpectedWidth = parseFloat(this.oRadialMicroChart.getParent().$().width());

		//Assert
		assert.equal(this.oRadialMicroChart.$().height(), sExpectedHeight, "Chart Height is the same as parent element");
		assert.equal(this.oRadialMicroChart.$().width(), sExpectedWidth, "Chart Width is the same as parent element");
	});

	QUnit.module("Align content tests", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", { total: 100, size: "Responsive"});
			this.oFlexBox = new FlexBox("rmc-fb", {
				items: [this.oRadialMicroChart],
				alignItems: "Center",
				renderType: "Bare"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Default behaviour", function(assert) {
		assert.ok(this.oRadialMicroChart.$().find(".sapSuiteRMCVerticalAlignmentContainer").hasClass("sapSuiteRMCAlignLeft"), "Chart is left aligned");
	});

	QUnit.test("Right alignment", function(assert) {
		this.oRadialMicroChart.setAlignContent("Right");
		sap.ui.getCore().applyChanges();

		assert.ok(this.oRadialMicroChart.$().find(".sapSuiteRMCVerticalAlignmentContainer").hasClass("sapSuiteRMCAlignRight"), "Chart is right aligned");
	});

	QUnit.test("Center and left alignment", function(assert) {
		this.oRadialMicroChart.setAlignContent("Center");
		sap.ui.getCore().applyChanges();

		assert.ok(this.oRadialMicroChart.$().find(".sapSuiteRMCVerticalAlignmentContainer").hasClass("sapSuiteRMCAlignCenter"), "Chart is center aligned");

		this.oRadialMicroChart.setAlignContent("Left");
		sap.ui.getCore().applyChanges();

		assert.ok(this.oRadialMicroChart.$().find(".sapSuiteRMCVerticalAlignmentContainer").hasClass("sapSuiteRMCAlignLeft"), "Chart is left aligned after change");

	});

	QUnit.module("Percentage label color tests", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", {
				fraction: 45.5,
				total: 100,
				valueColor: "Neutral"

			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("Neutral color text", function(assert) {
		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCNeutralTextColor"), true, "Inside label has neutral color");
		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCNeutralTextColor"), true, "Outside label has neutral color");
	});

	QUnit.test("Critical color text", function(assert) {
		this.oRadialMicroChart.setValueColor(ValueColor.Critical);

		sap.ui.getCore().applyChanges();

		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCCriticalTextColor"), true, "Inside label has critical color");
		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCCriticalTextColor"), true, "Outside label has critical color");
	});

	QUnit.test("Error color text", function(assert) {
		this.oRadialMicroChart.setValueColor(ValueColor.Error);

		sap.ui.getCore().applyChanges();

		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCErrorTextColor"), true, "Inside label has error color");
		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCErrorTextColor"), true, "Outside label has error color");
	});

	QUnit.test("Good color text", function(assert) {
		this.oRadialMicroChart.setValueColor(ValueColor.Good);

		sap.ui.getCore().applyChanges();

		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCInsideLabel").hasClass("sapSuiteRMCGoodTextColor"), true, "Inside label has good color");
		assert.equal(this.oRadialMicroChart.$().find(".sapSuiteRMCOutsideLabel").hasClass("sapSuiteRMCGoodTextColor"), true, "Inside label has good color");
	});

	QUnit.module("Chart calculation", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", {
				fraction: 45.5,
				total: 100
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("Total and fraction set in constructor", function(assert) {
		var fTotal = this.oRadialMicroChart.getTotal();
		var fFraction = this.oRadialMicroChart.getFraction();
		var fPercentage = this.oRadialMicroChart.getPercentage();

		assert.equal(fTotal, 100, "Total was set correctly in constructor");
		assert.equal(fFraction, 45.5, "Fraction was set correctly in constructor");
		assert.equal(fPercentage, 45.5, "Percentage was calculated correctly setting total and fraction in constructor");
	});

	QUnit.test("Edge case > 99%", function(assert) {
		//Arrange
		this.oRadialMicroChart.setPercentage(99.5);

		//Act
		var fEdgeCasePercentageValue = RadialMicroChartRenderer._getPercentageForCircleRendering(this.oRadialMicroChart);

		//Assert
		assert.equal(fEdgeCasePercentageValue, 99 - RadialMicroChartRenderer.PADDING_WIDTH, "Value between 99.0 and 99.9 are returned as 99 to render the circle properly");
	});

	QUnit.test("Edge case < 1%", function(assert) {
		//Arrange
		this.oRadialMicroChart.setPercentage(0.5);

		//Act
		var fEdgeCasePercentageValue = RadialMicroChartRenderer._getPercentageForCircleRendering(this.oRadialMicroChart);

		//Assert
		assert.equal(fEdgeCasePercentageValue, 1 + RadialMicroChartRenderer.PADDING_WIDTH, "Value between 0 and 0.9 are returned as 1 to render the circle properly");
	});

	QUnit.module("Chart calculation with Total 0", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", {
				fraction: 45.5, total: 0
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.module("Aria and Tooltip", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart({ percentage: 30 }).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("Test method getTooltip_AsString", function(assert) {
		//Arrange
		var sExpectedTranslationText = this.oRadialMicroChart._oRb.getText("RADIALMICROCHART_ARIA_LABEL", [
			this.oRadialMicroChart.getPercentage(),
			this.oRadialMicroChart.getValueColor()
		]);

		//Act
		var sTooltip = this.oRadialMicroChart.getTooltip_AsString();

		//Assert
		assert.ok(sTooltip.indexOf(sExpectedTranslationText) > -1, "Tooltip text matches the expected one");
	});

	QUnit.test("Tooltip by control - Default (neutral)", function(assert) {
		//Arrange
		var sExpectedTranslationText = this.oRadialMicroChart._oRb.getText("RADIALMICROCHART_ARIA_LABEL", [
			this.oRadialMicroChart.getPercentage(),
			this.oRadialMicroChart.getValueColor()
		]);

		//Act
		var sTooltip = this.oRadialMicroChart.getTooltip_AsString();

		//Assert
		assert.ok(sTooltip.indexOf(sExpectedTranslationText) > -1, "Tooltip text matches the expected one");
	});

	QUnit.test("Tooltip by control - Default (neutral) due to CSSColor", function(assert) {
		//Arrange
		var sTestColor = "#666666";
		this.oRadialMicroChart.setValueColor(sTestColor);
		var sExpectedTranslationText = this.oRadialMicroChart._oRb.getText("RADIALMICROCHART_PERCENTAGE_TEXT", [
			this.oRadialMicroChart.getPercentage()
		]);

		//Act
		var sTooltip = this.oRadialMicroChart.getTooltip_AsString();

		//Assert
		assert.ok(sTooltip.indexOf(sExpectedTranslationText) > -1, "Tooltip was created correctly by control");
		assert.equal(this.oRadialMicroChart.getValueColor(), sTestColor, "Hex value wa applied correctly to valueColor property");
	});

	QUnit.test("Tooltip by control - Critical", function(assert) {
		//Arrange
		this.oRadialMicroChart.setValueColor(ValueColor.Critical);
		var sExpectedTranslationText = this.oRadialMicroChart._oRb.getText("RADIALMICROCHART_ARIA_LABEL", [
			this.oRadialMicroChart.getPercentage(),
			this.oRadialMicroChart._getStatusText()
		]);

		//Act
		var sTooltip = this.oRadialMicroChart.getTooltip_AsString();

		//Assert
		assert.ok(sTooltip.indexOf(sExpectedTranslationText) > -1, "Tooltip text matches the expected one");
	});

	QUnit.test("Tooltip by control - Error", function(assert) {
		//Arrange
		this.oRadialMicroChart.setValueColor(ValueColor.Error);
		var sExpectedTranslationText = this.oRadialMicroChart._oRb.getText("RADIALMICROCHART_ARIA_LABEL", [
			this.oRadialMicroChart.getPercentage(),
			this.oRadialMicroChart._getStatusText()
		]);

		//Act
		var sTooltip = this.oRadialMicroChart.getTooltip_AsString();

		//Assert
		assert.ok(sTooltip.indexOf(sExpectedTranslationText) > -1, "Tooltip text matches the expected one");
	});

	QUnit.test("Tooltip as string by application", function(assert) {
		//Arrange
		this.oRadialMicroChart.setTooltip("Custom Tooltip");

		//Act
		var sTooltip = this.oRadialMicroChart.getTooltip_AsString();

		//Assert
		assert.equal(sTooltip, "Custom Tooltip", "Tooltip handed over correctly by application");
	});

	QUnit.test("ARIA-Label by control", function(assert) {
		//Arrange
		var sExpectedTranslationText = this.oRadialMicroChart._oRb.getText("RADIALMICROCHART_ARIA_LABEL", [
			this.oRadialMicroChart.getPercentage(),
			this.oRadialMicroChart.getValueColor()
		]);

		//Act
		var sAriaText = this.oRadialMicroChart.getTooltip_AsString();

		//Assert
		assert.ok(sAriaText.indexOf(sExpectedTranslationText) > -1);
	});

	QUnit.test("ARIA-Label by application", function(assert) {
		//Arrange
		this.oRadialMicroChart.setTooltip("Custom Aria Text based on Tooltip");

		//Act
		var sAriaText = this.oRadialMicroChart.getTooltip_AsString();

		//Assert
		assert.equal(sAriaText, "Custom Aria Text based on Tooltip", "Aria Text handed over correctly by application");
	});

	QUnit.test("ARIA-Label by control and no tooltip", function(assert) {
		//Arrange
		this.oRadialMicroChart.setTooltip("");
		var sExpectedTranslationText = this.oRadialMicroChart._oRb.getText("RADIALMICROCHART_ARIA_LABEL", [
			this.oRadialMicroChart.getPercentage(),
			this.oRadialMicroChart.getValueColor()
		]);

		//Act
		var sAriaText = this.oRadialMicroChart.getTooltip_AsString();
		var sTooltip = this.oRadialMicroChart.getTooltip_AsString();

		//Assert
		assert.equal(sTooltip, "", "Tooltip handed over correctly by application");
	});

	QUnit.test("Tooltip was null", function(assert) {
		//Arrange
		this.oRadialMicroChart.setTooltip(null);

		//Act
		var bEmptyTooltip = this.oRadialMicroChart._isTooltipSuppressed();

		//Assert
		assert.ok(!bEmptyTooltip, "Tooltip was not an empty string (null in this case)");
	});

	QUnit.test("Tooltip was undefined", function(assert) {
		//Arrange
		this.oRadialMicroChart.setTooltip(undefined);

		//Act
		var bEmptyTooltip = this.oRadialMicroChart._isTooltipSuppressed();

		//Assert
		assert.ok(!bEmptyTooltip, "Tooltip was not an empty string (undefined in this case)");
	});

	QUnit.test("Aria-label only includes the standard chart information", function(assert) {
		// Arrange
		this.oRadialMicroChart.setTooltip("This is a tooltip");
		var sAriaLabel = this.oRadialMicroChart.getTooltip_AsString();
		// Act
		sap.ui.getCore().applyChanges();
		// Assert
		assert.equal(this.oRadialMicroChart.$().attr("aria-label"), sAriaLabel, "The aria-label includes only chart information");
		assert.equal(this.oRadialMicroChart.$().attr("title"), null, "The title attribute is not rendered");
	});

	QUnit.test("Test Aria-label and Aria-labelledBy superseding", function(assert) {
		assert.ok(this.oRadialMicroChart.$().attr("aria-label"), "By default, the aria-label attribute is rendered");
		assert.equal(this.oRadialMicroChart.$().attr("aria-labelledBy"), null, "By default, the aria-labelledBy attribute is not rendered");

		this.oRadialMicroChart.addAriaLabelledBy(new sap.m.Text());
		sap.ui.getCore().applyChanges();
		assert.equal(this.oRadialMicroChart.$().attr("aria-label"), null, "When first Control is added to ariaLabelledBy association, the aria-label attribute is not rendered");
		assert.equal(this.oRadialMicroChart.$().attr("aria-labelledBy").split(" ").length, 1, "When first Control is added to ariaLabelledBy association, the aria-labelledBy attribute is rendered and cointains 1 ID");

		this.oRadialMicroChart.addAriaLabelledBy(new sap.m.Button());
		sap.ui.getCore().applyChanges();
		assert.equal(this.oRadialMicroChart.$().attr("aria-label"), null, "When second Control is added to ariaLabelledBy association, the aria-label attribute is not rendered");
		assert.equal(this.oRadialMicroChart.$().attr("aria-labelledBy").split(" ").length, 2, "When second Control is added to ariaLabelledBy association, the aria-labelledBy attribute is rendered and contains 2 IDs");

		this.oRadialMicroChart.removeAllAriaLabelledBy();
		sap.ui.getCore().applyChanges();
		assert.ok(this.oRadialMicroChart.$().attr("aria-label"), "When removed all ariaLabelledBy, the aria-label attribute is rendered");
		assert.equal(this.oRadialMicroChart.$().attr("aria-labelledBy"), null, "When removed all ariaLabelledBy, the aria-labelledBy attribute is not rendered");
	});

	QUnit.test("Tooltip is shown when mouse enters chart", function(assert) {
		// Arrange
		this.oRadialMicroChart.setTooltip("This is a tooltip");
		sap.ui.getCore().applyChanges();
		// Act
		this.oRadialMicroChart.$().trigger("mouseenter");
		// Assert
		assert.equal(this.oRadialMicroChart.$().attr("title"), "This is a tooltip", "The title attribute is added when mouse enters the chart");
	});

	QUnit.test("Tooltip is removed when mouse leaves chart", function(assert) {
		// Arrange
		this.oRadialMicroChart.setTooltip("This is a tooltip");
		sap.ui.getCore().applyChanges();
		// Act
		this.oRadialMicroChart.$().trigger("mouseenter");
		this.oRadialMicroChart.$().trigger("mouseleave");
		// Assert
		assert.equal(this.oRadialMicroChart.$().attr("title"), null, "The title attribute is removed when mouse leaves the chart");
	});

	QUnit.module("Eventhandling", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart({ percentage: 30 }).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("ontap called", function(assert) {
		//Arrange
		sinon.spy(this.oRadialMicroChart, "firePress");

		//Act
		this.oRadialMicroChart.ontap({});

		//Assert
		assert.ok(this.oRadialMicroChart.firePress.calledOnce, "firePress was calledOnce on oRadialMicroChart");
	});

	QUnit.test("onkeydown called on SPACE clicked", function(assert) {
		//Arrange
		var oEvent = {
			which: jQuery.sap.KeyCodes.SPACE,
			preventDefault: function() {}
		};
		sinon.spy(oEvent, "preventDefault");

		//Act
		this.oRadialMicroChart.onkeydown(oEvent);

		//Assert
		assert.ok(oEvent.preventDefault.calledOnce, "preventDefault was calledOnce on oEvent if SPACE was clicked");
	});

	QUnit.test("onkeydown called on ENTER clicked", function(assert) {
		//Arrange
		var oEvent = {
			which: jQuery.sap.KeyCodes.ENTER,
			preventDefault: function() {}
		};
		sinon.spy(oEvent, "preventDefault");

		//Act
		this.oRadialMicroChart.onkeydown(oEvent);

		//Assert
		assert.ok(!oEvent.preventDefault.calledOnce, "preventDefault was not calledOnce on oEvent if ENTER was clicked");
	});

	QUnit.test("onkeyup called on SPACE clicked", function(assert) {
		//Arrange
		var oEvent = {
			which: jQuery.sap.KeyCodes.SPACE,
			preventDefault: function() {}
		};
		sinon.spy(oEvent, "preventDefault");
		sinon.spy(this.oRadialMicroChart, "firePress");

		//Act
		this.oRadialMicroChart.onkeyup(oEvent);

		//Assert
		assert.ok(oEvent.preventDefault.calledOnce, "preventDefault was calledOnce on oEvent if SPACE was clicked");
		assert.ok(this.oRadialMicroChart.firePress.calledOnce, "firePress was calledOnce on oRadialMicroChart if SPACE was clicked");
	});

	QUnit.test("onkeyup called on ENTER clicked", function(assert) {
		//Arrange
		var oEvent = {
			which: jQuery.sap.KeyCodes.ENTER,
			preventDefault: function() {}
		};
		sinon.spy(oEvent, "preventDefault");
		sinon.spy(this.oRadialMicroChart, "firePress");

		//Act
		this.oRadialMicroChart.onkeyup(oEvent);

		//Assert
		assert.ok(oEvent.preventDefault.calledOnce, "preventDefault was calledOnce on oEvent if ENTER was clicked");
		assert.ok(this.oRadialMicroChart.firePress.calledOnce, "firePress was calledOnce on oRadialMicroChart if ENTER was clicked");
	});

	QUnit.test("onkeyup called on TAB clicked", function(assert) {
		//Arrange
		var oEvent = {
			which: jQuery.sap.KeyCodes.TAB,
			preventDefault: function() {}
		};
		sinon.spy(oEvent, "preventDefault");
		sinon.spy(this.oRadialMicroChart, "firePress");

		//Act
		this.oRadialMicroChart.onkeyup(oEvent);

		//Assert
		assert.ok(!oEvent.preventDefault.calledOnce, "preventDefault was not calledOnce on oEvent if TAB was clicked");
		assert.ok(!this.oRadialMicroChart.firePress.calledOnce, "firePress was not calledOnce on oRadialMicroChart if TAB was clicked");
	});

	QUnit.test("attachPress called", function(assert) {
		//Arrange
		sinon.spy(this.oRadialMicroChart, "rerender");

		//Act
		this.oRadialMicroChart.attachPress(fnPressHandler);

		//Assert
		assert.ok(this.oRadialMicroChart.rerender.calledOnce, "rerender was calledOnce on oRadialMicroChart on detachPress/detachEvent");
		assert.ok(hasAttribute("tabindex", this.oRadialMicroChart), "Radial micro chart has attribute tabindex");
		assert.ok(this.oRadialMicroChart.$().hasClass("sapSuiteUiMicroChartPointer"), "Class has been added successfully since press handler was configured");
	});

	QUnit.test("attachEvent called with non press", function(assert) {
		//Arrange
		sinon.spy(this.oRadialMicroChart, "rerender");

		//Act
		this.oRadialMicroChart.attachEvent("tab", fnPressHandler);

		//Assert
		assert.equal(this.oRadialMicroChart.rerender.calledOnce, false, "rerender was not calledOnce on oRadialMicroChart since other event then press was attached");
		assert.equal(hasAttribute("tabindex", this.oRadialMicroChart), false, "Since rerender was not called, radial micro chart does not have attribute tabindex");
		assert.equal(this.oRadialMicroChart.$().hasClass("sapSuiteUiMicroChartPointer"), false, "Since rerender was not called, class has not been added");
	});

	QUnit.test("detachPress called", function(assert) {
		//Arrange
		sinon.spy(this.oRadialMicroChart, "rerender");

		//Act
		this.oRadialMicroChart.detachPress(fnPressHandler);

		//Assert
		assert.ok(this.oRadialMicroChart.rerender.calledOnce, "rerender was calledOnce on oRadialMicroChart on detachPress/detachEvent");
		assert.equal(hasAttribute("tabindex", this.oRadialMicroChart), false, "Radial micro chart has no attribute tabindex");
		assert.equal(this.oRadialMicroChart.$().hasClass("sapSuiteUiMicroChartPointer"), false, "Class has been removed successfully since press handler was not configured");
	});

	QUnit.test("detachEvent called with non press", function(assert) {
		//Arrange
		sinon.spy(this.oRadialMicroChart, "rerender");

		//Act
		this.oRadialMicroChart.detachEvent("tab", fnPressHandler);

		//Assert
		assert.equal(this.oRadialMicroChart.rerender.calledOnce, false, "rerender was not calledOnce on oRadialMicroChart since other event then press was attached");
		assert.equal(hasAttribute("tabindex", this.oRadialMicroChart), false, "Since rerender was not called, radial micro chart does not have attribute tabindex");
		assert.equal(this.oRadialMicroChart.$().hasClass("sapSuiteUiMicroChartPointer"), false, "Since rerender was not called, class has not been added");
	});

	/* --- Helpers --- */

	function fnPressHandler() {}

	function hasAttribute(sAttribute, oCurrentObject) {
		var sAttributeValue = oCurrentObject.$().attr(sAttribute);
		return typeof sAttributeValue !== typeof undefined && sAttributeValue !== false;
	}

	QUnit.module("Control provides accessibility information", {
		beforeEach: function() {
			this.oChart = new RadialMicroChart();
			this.oChart.setAggregation("tooltip", "RadialMicroChart");
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method getAccessibilityInfo returns correct information", function(assert) {
		// Arrange
		var oExpectedAccessibilityInformation = {
			description: "RadialMicroChart",
			type: this.oChart._getAccessibilityControlType()
		};

		// Act
		var oAccessibilityInformation = this.oChart.getAccessibilityInfo();

		// Assert
		assert.deepEqual(oAccessibilityInformation, oExpectedAccessibilityInformation, "An object with the correct properties has been returned.");
	});

	QUnit.module("Tests to check whether RadialMicroChart DOM events are marked for components that needs to know if the event was handled by the RadialMicroChart", {
		beforeEach: function() {
			this.oRadialMicroChart = new RadialMicroChart("radialMicroChart", {percentage: 50, size:"XS"});
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oRadialMicroChart.destroy();
			this.oRadialMicroChart = null;
		}
	});

	QUnit.test("Test touchstart event unmarked & marked cases", function(assert) {
		// Arrange
		var oEvent = {
			setMarked: function() {return true;}
		};

		// Act
		sinon.spy(oEvent, "setMarked");
		this.oRadialMicroChart.ontouchstart(oEvent);

		// Assert
		assert.ok(oEvent.setMarked.notCalled, "touchstart event not marked as press event has no Listeners");

		// Act
		this.oRadialMicroChart.attachPress(function() {});
		this.oRadialMicroChart.ontouchstart(oEvent);

		// Assert
		assert.ok(oEvent.setMarked.calledOnce, "touchstart event is marked as press event has Listeners");
	});

	QUnit.test("Test ontap event unmarked & marked cases", function(assert) {
		// Arrange
		var oEvent = {
			setMarked: function() {return true;}
		};

		// Act
		sinon.spy(oEvent, "setMarked");
		this.oRadialMicroChart.ontap(oEvent);

		// Assert
		assert.ok(oEvent.setMarked.notCalled, "ontap event not marked as press event has no Listeners");

		// Act
		this.oRadialMicroChart.attachPress(function() {});
		this.oRadialMicroChart.ontap(oEvent);

		// Assert
		assert.ok(oEvent.setMarked.calledOnce, "ontap event is marked as press event has Listeners");
	});

	TestUtils.initSizeModule(RadialMicroChart, "sapSuiteRMCSize");
});

