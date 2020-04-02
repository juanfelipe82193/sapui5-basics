/*global QUnit, sinon */
sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/microchart/LineMicroChart",
	"sap/suite/ui/microchart/HarveyBallMicroChart",
	"sap/suite/ui/microchart/LineMicroChartPoint",
	"sap/suite/ui/microchart/LineMicroChartEmphasizedPoint",
	"sap/ui/Device",
	"sap/ui/core/ResizeHandler",
	"sap/m/FlexBox",
	"sap/ui/core/TooltipBase",
	"sap/ui/model/json/JSONModel",
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/suite/ui/microchart/LineMicroChartRenderer",
	"sap/m/Size",
	"sap/m/ValueColor",
	"sap/suite/ui/microchart/library",
	'sap/ui/core/theming/Parameters',
	"sap/suite/ui/microchart/LineMicroChartLine",
	"./TestUtils"
], function (jQuery, LineMicroChart, HarveyBallMicroChart, LineMicroChartPoint, LineMicroChartEmphasizedPoint, Device,
			 ResizeHandler, FlexBox, TooltipBase, JSONModel, GenericTile, TileContent, LineMicroChartRenderer, Size,
			 ValueColor, microchartLibrary, Parameters, LineMicroChartLine, TestUtils) {
	"use strict";

	jQuery.sap.initMobile();


	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function () {
			this.fnStubIsInitialized = sinon.stub(sap.ui.getCore(), "isInitialized");
			this.fnSpyAttachInit = sinon.spy(sap.ui.getCore(), "attachInit");
			this.fnSpyHandleCoreInitialized = sinon.spy(LineMicroChart.prototype, "_handleCoreInitialized");
			this.fnStubThemeApplied = sinon.stub(sap.ui.getCore(), "isThemeApplied");
			this.fnStubAttachThemeApplied = sinon.stub(sap.ui.getCore(), "attachThemeChanged").callsFake(function (fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.fnSpyHandleThemeApplied = sinon.spy(LineMicroChart.prototype, "_handleThemeApplied");
		},
		afterEach: function () {
			this.fnStubIsInitialized.restore();
			this.fnSpyAttachInit.restore();
			this.fnSpyHandleCoreInitialized.restore();
			this.fnStubThemeApplied.restore();
			this.fnStubAttachThemeApplied.restore();
			this.fnSpyHandleThemeApplied.restore();
		}
	});

	QUnit.test("Core initialization check - no core, no theme", function (assert) {
		//Arrange
		this.fnStubIsInitialized.returns(false);
		this.fnStubThemeApplied.returns(false);

		//Act
		var oChart = new LineMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.fnSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core initialization check - no core, but theme", function (assert) {
		//Arrange
		this.fnStubIsInitialized.returns(false);
		this.fnStubThemeApplied.returns(true);

		//Act
		var oChart = new LineMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.notCalled, "Method Core.attachThemeChanged has not been called.");
		assert.ok(this.fnSpyHandleThemeApplied.notCalled, "Method _handleThemeApplied has not been called.");
	});

	QUnit.test("Core initialization check - core, but no theme", function (assert) {
		//Arrange
		this.fnStubIsInitialized.returns(true);
		this.fnStubThemeApplied.returns(false);

		//Act
		var oChart = new LineMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.fnSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core initialization check - core and theme", function (assert) {
		//Arrange
		this.fnStubIsInitialized.returns(true);
		this.fnStubThemeApplied.returns(true);

		//Act
		var oChart = new LineMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.notCalled, "Method Core.attachThemeChanged has not been called.");
		assert.ok(this.fnSpyHandleThemeApplied.notCalled, "Method _handleThemeApplied has not been called.");
	});

	QUnit.module("Device resize Event handling", {
		beforeEach: function () {
			sinon.spy(ResizeHandler, "register");
			sinon.spy(ResizeHandler, "deregister");
			this.oChart = new LineMicroChart("mChart", {
				size: "Responsive",
				points: [
					new LineMicroChartPoint({
						x: 5,
						y: 5
					}),
					new LineMicroChartPoint({
						x: 10,
						y: 10
					}),
					new LineMicroChartPoint({
						x: 20,
						y: 20
					})
				]
			});
			sinon.spy(this.oChart, "_onResize");
			this.oFlexBox = new FlexBox("flexbox", {
				width: "5rem",
				height: "5rem",
				items: [this.oChart],
				renderType: "Bare"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			ResizeHandler.register.restore();
			ResizeHandler.deregister.restore();
			this.oChart._onResize.restore();
			this.oChart.destroy();
			this.oFlexBox.destroy();
		}
	});

	QUnit.test("Attachment and detachment of the resize event handler", function (assert) {
		//Arrange
		//Act
		this.oChart.exit();
		//Assert
		assert.ok(ResizeHandler.register.calledOnce, "The handler for the resize event was attached during the lifecycle of the chart.");
		assert.ok(ResizeHandler.deregister.calledOnce, "The handler for the resize event was detached during the lifecycle of the chart.");
	});

	QUnit.test("Adjustment of the canvas when the resize event is triggered", function (assert) {
		//Arrange
		//Act
		this.oFlexBox.setWidth("3rem");
		this.oFlexBox.rerender();
		//Assert
		assert.equal(this.oChart._onResize.callCount, 2, "The size is adapted on first render and after the resize");
	});

	QUnit.test("Method '_isAnyLabelTruncated' returns false if no labels are passed", function (assert) {
		//Arrange
		//Act
		var bResult = this.oChart._isAnyLabelTruncated(jQuery());

		//Assert
		assert.notOk(bResult, "The function _isAnyLabelTruncated has returned 'false'.");
	});

	QUnit.test("Method '_isAnyLabelTruncated' returns a boolean value", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "_isLabelTruncated").returns(true);
		var $Labels = jQuery("<div />");

		//Act
		var bResult = this.oChart._isAnyLabelTruncated($Labels);

		//Assert
		assert.equal(bResult, true, "The function _isAnyLabelTruncated has returned 'true'.");
	});

	QUnit.test("Top labels are hidden when truncated", function (assert) {
		//Arrange
		this.oChart.setLeftTopLabel("Some very long text...");
		this.oChart.setRightTopLabel("Some very long text...");
		this.oFlexBox.setWidth("7rem");

		//Act
		sap.ui.getCore().applyChanges();

		//Assert
		assert.ok(this.oChart.$().hasClass("sapSuiteLMCNoTopLabels"), "The class has not been added to the chart.");
	});

	QUnit.test("Bottom labels not hidden when truncated", function (assert) {
		//Arrange
		this.oChart.setLeftBottomLabel("Some very long text...");
		this.oChart.setRightBottomLabel("Some very long text...");
		this.oFlexBox.setWidth("7rem");

		//Act
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteLMCLabelsBottom").length, 1, "labels present");
		assert.notOk(this.oChart.$().hasClass("sapSuiteLMCNoBottomLabels"), "The class has not been added to the chart.");
	});


	QUnit.test("Top labels are shown after there is space again", function (assert) {
		//Arrange
		this.oChart.setLeftTopLabel("123456789012345");
		this.oChart.setRightTopLabel("123456789012345");


		this.oFlexBox.setWidth("7rem");
		sap.ui.getCore().applyChanges();
		assert.ok(this.oChart.$().hasClass("sapSuiteLMCNoTopLabels"), "The class has been added to the chart.");

		this.oFlexBox.setWidth("20rem");
		this.oFlexBox.invalidate();
		sap.ui.getCore().applyChanges();
		assert.notOk(this.oChart.$().hasClass("sapSuiteLMCNoTopLabels"), "The class has been removed from the chart.");
	});

	QUnit.test("All labels hidden if the width is too small", function (assert) {
		//Arrange
		this.oChart.setLeftTopLabel("label");
		this.oChart.setRightTopLabel("label");
		this.oChart.setLeftBottomLabel("label");
		this.oChart.setRightBottomLabel("label");
		this.oFlexBox.setWidth("2rem");

		//Act
		sap.ui.getCore().applyChanges();

		//Assert
		assert.ok(this.oChart.$().hasClass("sapSuiteLMCNoLabels"), "The class has been added to the chart.");
		this.oChart.$().find(".sapSuiteLMCLabel").each(function() {
			assert.notOk(jQuery(this).is(":visible"), "Label is not visible");
		});
	});

	QUnit.test("Labels are not truncated when enough space", function (assert) {
		//Arrange
		this.oChart.setLeftTopLabel("Short");
		this.oChart.setRightTopLabel("Short");
		this.oChart.setLeftBottomLabel("Short");
		this.oChart.setRightBottomLabel("Short");
		this.oFlexBox.setWidth("2rem");

		//Act
		sap.ui.getCore().applyChanges();

		//Assert
		assert.notOk(this.oChart.$().hasClass("sapSuiteLMCNoTopLabels"), "The class has not been added to the chart.");
		assert.notOk(this.oChart.$().hasClass("sapSuiteLMCNoBottomLabels"), "The class has not been added to the chart.");
	});

	QUnit.module("Renderer functions", {
		beforeEach: function () {
			this.oRenderer = LineMicroChartRenderer;
		},
		afterEach: function () {
			this.oRenderer = null;
		}
	});

	QUnit.test("Function _isPointEmphasized", function (assert) {
		//Arrange
		var oPoint = new LineMicroChartPoint();

		//Assert
		assert.equal(this.oRenderer._isPointEmphasized(oPoint), false, "The regular point has been sucessfully identified.");
	});

	QUnit.test("Function _isPointEmphasized", function (assert) {
		//Arrange
		var oPoint = new LineMicroChartEmphasizedPoint();

		//Assert
		assert.equal(this.oRenderer._isPointEmphasized(oPoint), true, "The emphasized point has been sucessfully identified.");
	});

	QUnit.test("Function _getQualitativeColor", function (assert) {
		//Arrange
		var oSpy = sinon.spy(this.oRenderer, "_getHexColor");

		for (var i = 1; i <= 50; i++) {
			//Act
			this.oRenderer._getQualitativeColor(i);
		}

		for (i = 0; i < 50; i++) {
			//Assert
			assert.equal(oSpy.args[i][0], "sapUiChartPaletteQualitativeHue" + (i + 1) % 22, "Correct class used");
		}
	});


	QUnit.module("Chart rendering", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mChart", {
				leftTopLabel: "leftTopLabel",
				leftBottomLabel: "leftBottomLabel",
				rightTopLabel: "rightTopLabel",
				rightBottomLabel: "rightBottomLabel",
				points: [
					new LineMicroChartPoint({
						x: 5,
						y: 5
					}),
					new LineMicroChartPoint({
						x: 10,
						y: 10
					}),
					new LineMicroChartPoint({
						x: 20,
						y: 20
					})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Chart is rendered with a LESS parameter color", function (assert) {
		//Arrange
		this.oChart.setColor("sapUiWarningBorder");
		//Act
		this.oChart.rerender();
		//Assert
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold");
		var bSvgLine1ColorCorrect = jQuery.inArray(oSvgLines.eq(0).css("stroke"), ["rgb(249, 164, 41)", "#f9a429"]) >= 0;
		var bSvgLine2ColorCorrect = jQuery.inArray(oSvgLines.eq(1).css("stroke"), ["rgb(249, 164, 41)", "#f9a429"]) >= 0;
		assert.equal(bSvgLine1ColorCorrect, true, "Chart color is applied correctly to the first line");
		assert.equal(bSvgLine2ColorCorrect, true, "Chart color is applied correctly to the second line");
	});

	QUnit.test("Chart is rendered with the second line outside the viewport (X axis)", function (assert) {
		//Arrange
		var sLimit = 10;
		var sLinesCount = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold").length;
		this.oChart.setThreshold(null);
		this.oChart.setMaxXValue(sLimit);
		this.oChart.getPoints()[0].setX(sLimit);
		this.oChart.getPoints()[1].setX(sLimit);
		//Act
		this.oChart.rerender();
		//Assert
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold");
		assert.equal(oSvgLines.length, sLinesCount - 1, "The second line is outside the viewport (X axis) and will not be displayed");
	});

	QUnit.test("Chart is rendered with the second line outside the viewport (Y axis)", function (assert) {
		//Arrange
		var sLimit = 10;
		var sLinesCount = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold").length;
		this.oChart.setThreshold(null);
		this.oChart.setMaxYValue(sLimit);
		this.oChart.getPoints()[0].setY(sLimit);
		this.oChart.getPoints()[1].setY(sLimit);
		//Act
		this.oChart.rerender();
		//Assert
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold");
		assert.equal(oSvgLines.length, sLinesCount - 1, "The second line is outside the viewport (Y axis) and will not be displayed");
	});

	QUnit.module("Responsiveness tests - chart appearance", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mChart", {
				size: "Responsive",
				points: [
					new LineMicroChartPoint({
						x: 5,
						y: 5
					}),
					new LineMicroChartPoint({
						x: 10,
						y: 10
					}),
					new LineMicroChartPoint({
						x: 20,
						y: 20
					})
				]
			});
			this.oFlexBox = new FlexBox("flexbox", {
				width: "5rem",
				height: "5rem",
				items: [this.oChart],
				renderType: "Bare"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oFlexBox.destroy();
			this.oFlexBox = null;
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Responsiveness inside flexbox: adjust to parent", function (assert) {
		//Arrange
		this.oFlexBox.setWidth("8rem");
		this.oFlexBox.setHeight("8rem");
		//Act
		this.oFlexBox.rerender();
		//Assert
		assert.equal(this.oChart.$().height(), "128", "Adjusted after the parent height: 8 rem");
		assert.equal(this.oChart.$().width(), "128", "Adjusted after the parent width: 8 rem");
	});

	QUnit.module("Responsiveness tests - labels and fonts", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mChart", {
				size: "Responsive",
				leftTopLabel: "leftTopLabel",
				leftBottomLabel: "leftBottomLabel",
				rightTopLabel: "rightTopLabel",
				rightBottomLabel: "rightBottomLabel",
				points: [
					new LineMicroChartPoint({
						x: 5,
						y: 5
					}),
					new LineMicroChartPoint({
						x: 10,
						y: 10
					}),
					new LineMicroChartPoint({
						x: 20,
						y: 20
					})
				]
			});
			this.oFlexBox = new FlexBox("flexbox", {
				width: "15rem",
				height: "15rem",
				items: [this.oChart],
				renderType: "Bare"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Chart is rendered with the top and bottom labels visible and proper font size", function (assert) {
		var sLabel1Style = this.oChart.$().find(".sapSuiteLMCLabel").eq(0).css("visibility");
		var sLabel2Style = this.oChart.$().find(".sapSuiteLMCLabel").eq(1).css("visibility");
		var sLabel3Style = this.oChart.$().find(".sapSuiteLMCLabel").eq(2).css("visibility");
		var sLabel4Style = this.oChart.$().find(".sapSuiteLMCLabel").eq(3).css("visibility");
		var bSmallFont = this.oChart.$().hasClass("sapSuiteLMCSmallFont");

		assert.equal(sLabel1Style, "visible", "Label 1 is visible");
		assert.equal(sLabel2Style, "visible", "Label 2 is visible");
		assert.equal(sLabel3Style, "visible", "Label 3 is visible");
		assert.equal(sLabel4Style, "visible", "Label 4 is visible");
		assert.ok(!bSmallFont, "Chart is properly rendered with the labels having the standard font size");
	});

	QUnit.test("Labels are not present if the properties are not set", function (assert) {
		//Arrange
		this.oChart.setLeftBottomLabel(null);
		this.oChart.setRightBottomLabel(null);
		this.oChart.setLeftTopLabel(null);
		this.oChart.setRightTopLabel(null);
		this.oFlexBox.rerender();
		//Act
		//Assert
		var aLabelLeftBottomStyle = this.oChart.$().find(".sapSuiteLMCLeftBottomLabel");
		var aLabelRightBottomStyle = this.oChart.$().find(".sapSuiteLMCRightBottomLabel");
		var aLabelLeftTopStyle = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var aLabelRightTopStyle = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		assert.equal(aLabelLeftBottomStyle.length, 0, "LeftBottomLabel is not present");
		assert.equal(aLabelRightBottomStyle.length, 0, "RightBottomLabel is not present");
		assert.equal(aLabelLeftTopStyle.length, 0, "LeftTopLabel is not present");
		assert.equal(aLabelRightTopStyle.length, 0, "RightTopLabel is not present");
	});

	QUnit.test("Labels are visible and small if chart height lower than 72px", function (assert) {
		//Arrange
		this.oFlexBox.setHeight("72px");
		this.oFlexBox.rerender();
		//Act
		//Assert
		var sFont;
		var sLabelStyle;
		for (var i = 0; i < 3; i++) {
			sLabelStyle = this.oChart.$().find(".sapSuiteLMCLabel").eq(i).css("visibility");
			sFont = this.oChart.$().find(".sapSuiteLMCLabel").eq(i).css("font-size");
			assert.equal(sLabelStyle, "visible", "Label 1 is visible");
			assert.equal(sFont, "12px", "small font size");
		}
	});

	QUnit.test("Top labels are hidden if the chart's height is lower than 2rem", function (assert) {
		//Arrange
		this.oFlexBox.setHeight("2rem");
		this.oFlexBox.rerender();
		//Act
		//Assert
		var sLabel1Style = this.oChart.$().find(".sapSuiteLMCLeftTopLabel").css("display");
		var sLabel2Style = this.oChart.$().find(".sapSuiteLMCRightTopLabel").css("display");
		assert.equal(sLabel1Style, "none", "Label 1 is hidden");
		assert.equal(sLabel2Style, "none", "Label 2 is hidden");
	});

	QUnit.test("Top labels are hidden if the bottom labels are not set and the chart's height is lower than 2rem", function (assert) {
		//Arrange
		this.oFlexBox.setHeight("1rem");
		this.oChart.setLeftBottomLabel(null);
		this.oChart.setRightBottomLabel(null);
		this.oFlexBox.rerender();
		//Act
		//Assert
		var sLabel1Style = this.oChart.$().find(".sapSuiteLMCLeftTopLabel").css("display");
		var sLabel2Style = this.oChart.$().find(".sapSuiteLMCRightTopLabel").css("display");
		assert.equal(sLabel1Style, "none", "Label 1 is hidden");
		assert.equal(sLabel2Style, "none", "Label 2 is hidden");
	});

	QUnit.test("Truncated bottom labels are hidden", function (assert) {
		//Arrange
		this.oFlexBox.setWidth("2.2rem");
		this.oFlexBox.rerender();
		//Act
		//Assert
		var sLabel1Style = this.oChart.$().find(".sapSuiteLMCLeftBottomLabel").css("display");
		var sLabel2Style = this.oChart.$().find(".sapSuiteLMCRightBottomLabel").css("display");
		assert.equal(sLabel1Style, "none", "Label 1 is hidden");
		assert.equal(sLabel2Style, "none", "Label 2 is hidden");
	});

	QUnit.test("Chart is rendered with the bottom labels visible", function (assert) {
		//Arrange
		this.oFlexBox.setWidth("15rem");
		this.oFlexBox.rerender();
		//Act
		//Assert
		var sLabel1Style = this.oChart.$().find(".sapSuiteLMCLeftBottomLabel").css("display");
		var sLabel2Style = this.oChart.$().find(".sapSuiteLMCRightBottomLabel").css("display");
		assert.equal(sLabel1Style, "block", "Label 1 is visible");
		assert.equal(sLabel2Style, "block", "Label 2 is visible");
	});

	QUnit.module("Label Rendering", {
		beforeEach: function () {
			this.oMicroChart = new LineMicroChart("mac", {
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				leftBottomLabel: "June 1",
				rightBottomLabel: "June 30",
				leftTopLabel: "0M",
				rightTopLabel: "80M",
				points: [
					new LineMicroChartEmphasizedPoint({
						show: true,
						color: "Error",
						x: 0,
						y: 100
					}),
					new LineMicroChartEmphasizedPoint({
						show: true,
						color: "Error",
						x: 100,
						y: 0
					})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oMicroChart.destroy();
		}
	});

	QUnit.test("Label texts", function (assert) {
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftTopLabel").text(), "0M", "Top left label was rendered");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightTopLabel").text(), "80M", "Top right label was rendered");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftBottomLabel").text(), "June 1", "Bottom left label was rendered");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightBottomLabel").text(), "June 30", "Bottom right label was rendered");
	});

	QUnit.test("All labels present", function (assert) {
		assert.equal(this.oMicroChart.$().hasClass("sapSuiteLMCNoBottomLabels"), false, "Class indicating no bottom labels is not present");
		assert.equal(this.oMicroChart.$().hasClass("sapSuiteLMCNoTopLabels"), false, "Class indicating no top labels is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftTopLabel").length, 1, "Top left label container class is present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightTopLabel").length, 1, "Top right label container class is present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftBottomLabel").length, 1, "Bottom left label container class is present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightBottomLabel").length, 1, "Bottom right label container class is present");
	});

	QUnit.test("No top labels present", function (assert) {
		//Arrange
		//Act
		this.oMicroChart.setLeftTopLabel(null);
		this.oMicroChart.setRightTopLabel(null);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftTopLabel").length, 0, "Top left label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightTopLabel").length, 0, "Top right label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftBottomLabel").length, 1, "Bottom left label container class is present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightBottomLabel").length, 1, "Bottom right label container class is present");
	});

	QUnit.test("No bottom labels present", function (assert) {
		//Arrange
		//Act
		this.oMicroChart.setLeftBottomLabel(null);
		this.oMicroChart.setRightBottomLabel(null);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftTopLabel").length, 1, "Top left label container class is present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightTopLabel").length, 1, "Top right label container class is present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftBottomLabel").length, 0, "Bottom left label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightBottomLabel").length, 0, "Bottom right label container class is not present");
	});

	QUnit.test("No labels present", function (assert) {
		//Arrange
		//Act
		this.oMicroChart.setLeftTopLabel(null);
		this.oMicroChart.setRightTopLabel(null);
		this.oMicroChart.setLeftBottomLabel(null);
		this.oMicroChart.setRightBottomLabel(null);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftTopLabel").length, 0, "Top left label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightTopLabel").length, 0, "Top right label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftBottomLabel").length, 0, "Bottom left label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightBottomLabel").length, 0, "Bottom right label container class is not present");
	});

	QUnit.test("One top and one bottom label present", function (assert) {
		//Arrange
		//Act
		this.oMicroChart.setLeftTopLabel(null);
		this.oMicroChart.setRightBottomLabel(null);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oMicroChart.$().hasClass("sapSuiteLMCNoBottomLabels"), false, "Class indicating no bottom labels is not present");
		assert.equal(this.oMicroChart.$().hasClass("sapSuiteLMCNoTopLabels"), false, "Class indicating no top labels is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftTopLabel").length, 1, "Top left label container class is present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftTopLabel").text(), "", "Text is empty");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightTopLabel").length, 1, "Top right label container class is present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftBottomLabel").length, 1, "Bottom left label container class is present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightBottomLabel").length, 1, "Bottom right label container class is present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightBottomLabel").text(), "", "Text is empty");
	});

	QUnit.test("showTopLabels false", function (assert) {
		//Arrange
		//Act
		this.oMicroChart.setShowTopLabels(false);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftTopLabel").length, 0, "Top left label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightTopLabel").length, 0, "Top right label container class is present");
	});

	QUnit.test("showBottomLabels false", function (assert) {
		//Arrange
		//Act
		this.oMicroChart.setShowBottomLabels(false);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftBottomLabel").length, 0, "Bottom left label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightBottomLabel").length, 0, "Bottom right label container class is present");
	});

	QUnit.test("showTopLabels & showBottomLabels false", function (assert) {
		//Arrange
		//Act
		this.oMicroChart.setShowTopLabels(false);
		this.oMicroChart.setShowBottomLabels(false);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftTopLabel").length, 0, "Top left label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightTopLabel").length, 0, "Top right label container class is present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftBottomLabel").length, 0, "Bottom left label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightBottomLabel").length, 0, "Bottom right label container class is present");
	});

	QUnit.test("showTopLabels false", function (assert) {
		//Arrange
		//Act
		this.oMicroChart.setShowTopLabels(false);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftTopLabel").length, 0, "Top left label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightTopLabel").length, 0, "Top right label container class is present");
	});

	QUnit.test("showBottomLabels false", function (assert) {
		//Arrange
		//Act
		this.oMicroChart.setShowBottomLabels(false);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftBottomLabel").length, 0, "Bottom left label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightBottomLabel").length, 0, "Bottom right label container class is present");
	});

	QUnit.test("showTopLabels & showBottomLabels false", function (assert) {
		//Arrange
		//Act
		this.oMicroChart.setShowTopLabels(false);
		this.oMicroChart.setShowBottomLabels(false);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftTopLabel").length, 0, "Top left label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightTopLabel").length, 0, "Top right label container class is present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLeftBottomLabel").length, 0, "Bottom left label container class is not present");
		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCRightBottomLabel").length, 0, "Bottom right label container class is present");
	});

	QUnit.module("Property defaults", {
		beforeEach: function () {
			this.oMicroChart = new LineMicroChart("mac").placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oMicroChart.destroy();
		}
	});

	QUnit.test("Threshold property default", function (assert) {
		assert.equal(this.oMicroChart.getThreshold(), 0, "The default value of Threshold is correct");
		assert.equal(this.oMicroChart._bThresholdNull, false, "The internal value of ThresholdNull is false");
		assert.equal(this.oMicroChart.getShowThresholdLine(), true, "The default value of showThresholdLine is correct");
		assert.equal(this.oMicroChart.getShowThresholdValue(), false, "The default value of showThresholdValue is correct");
		assert.equal(this.oMicroChart.getThresholdDisplayValue(), undefined, "The default value of thresholdDisplayValue is correct");
	});

	QUnit.test("Threshold property retrieval", function (assert) {
		this.oMicroChart.setThreshold(null);
		var oThresholdNull = this.oMicroChart.getThreshold();
		var oThresholdNullInternal = this.oMicroChart._bThresholdNull;

		this.oMicroChart.setThreshold(33);
		var oThresholdNumeric = this.oMicroChart.getThreshold();
		var oThresholdNumericInternal = this.oMicroChart._bThresholdNull;

		assert.equal(oThresholdNull, null, "The null value is returned");
		assert.equal(oThresholdNullInternal, true, "The internal value of ThresholdNull is true");
		assert.equal(oThresholdNumeric, 33, "The numeric value of Threshold is returned");
		assert.equal(oThresholdNumericInternal, false, "The internal value of ThresholdNull is false");
	});

	QUnit.test("Size property default", function (assert) {
		assert.equal(this.oMicroChart.getSize(), Size.Auto, "The default value of Size is correct");
	});

	QUnit.test("Color property default", function (assert) {
		assert.equal(this.oMicroChart.getColor(), ValueColor.Neutral, "The default color of the chart is correct");
	});

	QUnit.test("ShowPoints property default", function (assert) {
		assert.equal(this.oMicroChart.getShowPoints(), false, "The default value of showPoints is correct");
	});



	QUnit.module("Responsiveness adjustments for the use within GenericTile", {
		beforeEach: function () {
			this.oChart = new LineMicroChart({size: "Responsive"}).addStyleClass("sapUiSmallMargin");
			this.oGenericTile = new GenericTile("generic-tile", {
				tileContent: new TileContent({
					content: this.oChart
				})
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oGenericTile.destroy();
		}
	});

	QUnit.skip("The standard margins are handled if chart is used in a Generic Tile", function (assert) {
		//Arrange
		var oRemoveMarginCallback = sinon.spy(microchartLibrary, "_removeStandardMargins");
		//Act
		this.oChart.onBeforeRendering();
		//Assert
		assert.ok(oRemoveMarginCallback.called, "Library function that removes standard margins has been called.");
	});

	QUnit.skip("Responsiveness inside generic tile: adjust to parent", function (assert) {
		assert.ok(this.oChart.$().height() > 0, "Adjusted after the parent height");
		assert.ok(this.oChart.$().width() > 0, "Adjusted after the parent width");
	});

	QUnit.module("Responsiveness adjustments for the use within a Div", {
		beforeEach: function () {
			var $fixture = jQuery("#qunit-fixture");
			$fixture.css("width", "50px");
			$fixture.css("height", "50px");
			this.oChart = new LineMicroChart({size: "Responsive"}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Chart inside a simple div", function (assert) {
		//Arrange
		var iChartHeightExpected = Math.round(jQuery(this.oChart.getParent().getRootNode()).height());
		var iChartWidthExpected = Math.round(jQuery(this.oChart.getParent().getRootNode()).width());
		//Act
		//Assert
		assert.equal(this.oChart.$().height(), iChartHeightExpected, "Chart is rendered with the parent height");
		assert.equal(this.oChart.$().width(), iChartWidthExpected, "Chart is rendered with the parent width");
	});

	QUnit.module("Tooltip behavior", {
		beforeEach: function () {
			this.oChart = new LineMicroChart({
				leftTopLabel: "10M",
				points: [
					new LineMicroChartPoint({
						x: 5,
						y: 5
					}),
					new LineMicroChartPoint({
						x: 10,
						y: 10
					}),
					new LineMicroChartPoint({
						x: 20,
						y: 20
					})
				]

			}).placeAt("qunit-fixture");
			this.oModel = new JSONModel({
				size: "M",
				tooltip: "Custom Tooltip"
			});
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oModel.destroy();
		}
	});

	QUnit.test("Default value for tooltip", function (assert) {
		assert.notEqual(this.oChart.getTooltip_AsString(), null, "There is a default value returned by the control");
		assert.equal(this.oChart.getTooltip(), "((AltText))", "There is no tooltip defined by the application");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Null value for tooltip", function (assert) {
		//Arrange
		this.oChart.setTooltip(null);
		//Arrange
		assert.notEqual(this.oChart.getTooltip_AsString(), null, "There is a default tooltip value returned by the control");
	});

	QUnit.test("Tooltip is supressed", function (assert) {
		//Arrange
		this.oChart.setTooltip("");
		//Act
		//Assert
		var sTooltip = this.oChart.getTooltip_AsString();
		assert.equal(this.oChart.getTooltip_AsString(), "", "There is no tooltip");
		assert.ok(sTooltip.length === 0, "The internal control tooltip is empty");
	});

	QUnit.test("Tooltip is shown when mouse enters chart", function (assert) {
		// Arrange
		this.oChart.setTooltip("This is lmc tooltip");
		sap.ui.getCore().applyChanges();
		// Act
		this.oChart.$().trigger("mouseenter");
		// Assert
		assert.equal(this.oChart.$().attr("title"), "This is lmc tooltip", "The title attribute is added when mouse enters the chart");
	});

	QUnit.test("Tooltip is removed when mouse leaves chart", function (assert) {
		// Arrange
		this.oChart.setTooltip("This is dmc tooltip");
		sap.ui.getCore().applyChanges();
		// Act
		this.oChart.$().trigger("mouseenter");
		this.oChart.$().trigger("mouseleave");
		// Assert
		assert.equal(this.oChart.$().attr("title"), null, "The title attribute is removed when mouse leaves the chart");
	});

	QUnit.test("Model exists, tooltip is not bound", function (assert) {
		//Arrange
		//Act
		this.oChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.notEqual(this.oChart.getTooltip_AsString(), null, "Tooltip is provided by the control");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Model exists, control is bound, tooltip is not bound", function (assert) {
		//Arrange
		this.oChart.setAggregation("tooltip", new TooltipBase({
			text: "{/tooltip}"
		}));
		//Act
		this.oChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(this.oChart.getTooltip(), "Tooltip exists");
		assert.deepEqual(this.oChart.getTooltip().getText(), "Custom Tooltip", "Custom tooltip exists");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Custom tooltip set by the application", function (assert) {
		//Arrange
		this.oChart.setTooltip("Custom Tooltip");

		//Act
		var sTooltip = this.oChart.getTooltip_AsString();

		//Assert
		assert.equal(sTooltip, "Custom Tooltip", "Tooltip handed over correctly by the application. No internal tooltip present.");
	});

	QUnit.module("ARIA tests", {
		beforeEach: function () {
			this.oChart = new LineMicroChart({
				leftTopLabel: "0M",
				leftBottomLabel: "June 1",
				rightTopLabel: "80M",
				rightBottomLabel: "June 30",
				points: [
					new LineMicroChartPoint({
						x: 5,
						y: 5
					}),
					new LineMicroChartPoint({
						x: 10,
						y: 10
					}),
					new LineMicroChartPoint({
						x: 20,
						y: 20
					})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Chart rendering", function (assert) {
		var sLabel = this.oChart.getTooltip_AsString();
		var $Chart = this.oChart.$();
		assert.notOk($Chart.attr("title"), "The title is not rendered");
		assert.equal($Chart.attr("role"), "img", "The role is <img>.");
		assert.equal($Chart.attr("aria-label"), sLabel, "The aria-label is correctly set.");
		assert.notEqual($Chart.attr("aria-label").indexOf(this.oChart.getLeftTopLabel()), -1, "The left top label is part of aria-label value.");
		assert.notEqual($Chart.attr("aria-label").indexOf(this.oChart.getLeftBottomLabel()), -1, "The left bottom label is part of aria-label value.");
		assert.notEqual($Chart.attr("aria-label").indexOf(this.oChart.getRightTopLabel()), -1, "The right top label is part of aria-label value.");
		assert.notEqual($Chart.attr("aria-label").indexOf(this.oChart.getRightBottomLabel()), -1, "The right bottom label is part of aria-label value.");
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

	QUnit.module("Keyboard support tests", {
		beforeEach: function () {
			this.oChart = new LineMicroChart({
				leftTopLabel: "0M",
				leftBottomLabel: "June 1",
				rightTopLabel: "80M",
				rightBottomLabel: "June 30"
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			sinon.spy(this.oChart, "firePress");
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Ontap is called (msie)", function (assert) {
		//Arrange
		var oTap = {
				preventDefault: function () {
				},
				stopImmediatePropagation: function () {
				}
			},
			bOriginalMsie = Device.browser.msie;
		oTap.target = this.oChart.$();
		Device.browser.msie = true;
		//Act
		this.oChart.ontap(oTap);
		//Assert
		assert.equal(this.oChart.firePress.called, true, "firePress was called");
		Device.browser.msie = bOriginalMsie;
	});

	QUnit.test("Key down is pressed", function (assert) {
		//Arrange
		var oEventDown = {
			preventDefault: function () {
			},
			which: jQuery.sap.KeyCodes.SPACE,
			stopImmediatePropagation: function () {
			}
		};
		oEventDown.target = this.oChart.$();
		sinon.spy(oEventDown, "preventDefault");
		//Act
		this.oChart.onkeydown(oEventDown);
		//Assert
		assert.equal(this.oChart.firePress.called, false, "firePress was not called");
		assert.equal(oEventDown.preventDefault.called, true, "oEvent preventDefault was called for SPACE key");
	});

	QUnit.test("Key up is pressed", function (assert) {
		//Arrange
		var oEventDown = {
			preventDefault: function () {
			},
			which: jQuery.sap.KeyCodes.ENTER,
			stopImmediatePropagation: function () {
			}
		};
		oEventDown.target = this.oChart.$();
		sinon.spy(oEventDown, "preventDefault");
		//Act
		this.oChart.onkeyup(oEventDown);
		//Assert
		assert.equal(this.oChart.firePress.called, true, "firePress was called for ENTER key");
		assert.equal(oEventDown.preventDefault.called, true, "oEvent preventDefault was called for ENTER key");
	});

	QUnit.test("Space button is pressed", function (assert) {
		//Arrange
		var oEvent = {
			preventDefault: function () {
			},
			stopImmediatePropagation: function () {
			}
		};
		oEvent.target = this.oChart.$();
		//Act
		this.oChart.onsapspace(oEvent);
		//Assert
		assert.equal(this.oChart.firePress.called, true, "firePress was called");
	});

	QUnit.test("Enter button is pressed", function (assert) {
		//Arrange
		var oEvent = {
			preventDefault: function () {
			},
			stopImmediatePropagation: function () {
			}
		};
		oEvent.target = this.oChart.$();
		//Act
		this.oChart.onsapspace(oEvent);
		//Assert
		assert.equal(this.oChart.firePress.called, true, "firePress was called");
	});

	QUnit.test("Click event is called (msie)", function (assert) {
		//Arrange
		var bOriginalMsie = Device.browser.msie;
		Device.browser.msie = true;
		//Act
		this.oChart.onclick();
		//Assert
		assert.equal(this.oChart.firePress.called, true, "firePress was called");
		Device.browser.msie = bOriginalMsie;
	});

	QUnit.module("Threshold rendering", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mac", {
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				leftBottomLabel: "June 1",
				rightBottomLabel: "June 30",
				leftTopLabel: "0M",
				rightTopLabel: "80M",
				showPoints: true,
				points: [
					new LineMicroChartEmphasizedPoint({
						show: true,
						color: "Neutral",
						x: 0,
						y: 100
					}),
					new LineMicroChartEmphasizedPoint({
						show: true,
						color: "Neutral",
						x: 100,
						y: 0
					})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Threshold Line is rendered when inside defined scale", function (assert) {
		//Arrange
		//Act
		this.oChart.setThreshold(50);
		this.oChart.rerender();
		var oThreshold = this.oChart.$().find(".sapSuiteLMCLineThreshold");
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		//Assert
		assert.equal(oThreshold.length, 1, "The threshold is rendered exactly one time");
		assert.deepEqual(oSvgLines[0], oThreshold[0], "The threshold line is the first line in the svg element");
	});

	QUnit.test("Threshold Line is not rendered when the threshold is null", function (assert) {
		//Arrange
		//Act
		this.oChart.setThreshold(null);
		this.oChart.rerender();
		var oThreshold = this.oChart.$().find(".sapSuiteLMCLineThreshold");
		//Assert
		assert.equal(oThreshold.length, 0, "The threshold is not rendered when threshold value is null");
	});

	QUnit.test("Threshold Line is rendered when inside observed scale even if no manual scale is set", function (assert) {
		//Arrange
		//Act
		this.oChart.setMaxYValue(null);
		this.oChart.setMinYValue(null);
		this.oChart.setThreshold(50);
		this.oChart.rerender();
		var oThreshold = this.oChart.$().find(".sapSuiteLMCLineThreshold");
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		//Assert
		assert.equal(oThreshold.length, 1, "The threshold is rendered exactly one time");
		assert.deepEqual(oSvgLines[0], oThreshold[0], "The threshold line is the first line in the svg element");
	});

	QUnit.test("Threshold Line is not rendered, when out of scale", function (assert) {
		//Arrange
		//Act
		this.oChart.setThreshold(150);
		this.oChart.rerender();
		var oThreshold = this.oChart.$().find(".sapSuiteLMCLineThreshold");
		//Assert
		assert.equal(oThreshold.length, 0, "The threshold is not rendered");
	});

	QUnit.test("Threshold Line is rendered when below observed lower scale and manual lower scale is not set", function (assert) {
		//Arrange
		//Act
		this.oChart.setMinYValue(null);
		this.oChart.setThreshold(-50);
		this.oChart.rerender();
		var oThreshold = this.oChart.$().find(".sapSuiteLMCLineThreshold");
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		//Assert
		assert.equal(oThreshold.length, 1, "The threshold is rendered exactly once");
		assert.deepEqual(oSvgLines[0], oThreshold[0], "The threshold line is the first line in the svg element");
	});

	QUnit.test("Threshold Line is rendered when above observed upper scale and manual upper scale is not set", function (assert) {
		//Arrange
		//Act
		this.oChart.setMaxYValue(null);
		this.oChart.setThreshold(150);
		this.oChart.rerender();
		var oThreshold = this.oChart.$().find(".sapSuiteLMCLineThreshold");
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		//Assert
		assert.equal(oThreshold.length, 1, "The threshold is rendered exactly once");
		assert.deepEqual(oSvgLines[0], oThreshold[0], "The threshold line is the first line in the svg element");
	});

	QUnit.test("Threshold Line is rendered when above observed upper scale and no scale is set", function (assert) {
		//Arrange
		//Act
		this.oChart.setMaxYValue(null);
		this.oChart.setMinYValue(null);
		this.oChart.setThreshold(150);
		this.oChart.rerender();
		var oThreshold = this.oChart.$().find(".sapSuiteLMCLineThreshold");
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		//Assert
		assert.equal(oThreshold.length, 1, "The threshold is rendered exactly once");
		assert.deepEqual(oSvgLines[0], oThreshold[0], "The threshold line is the first line in the svg element");
	});

	QUnit.test("Threshold Line is rendered when below observed lower scale and no scale is set", function (assert) {
		//Arrange
		//Act
		this.oChart.setMaxYValue(null);
		this.oChart.setMinYValue(null);
		this.oChart.setThreshold(-50);
		this.oChart.rerender();
		var oThreshold = this.oChart.$().find(".sapSuiteLMCLineThreshold");
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		//Assert
		assert.equal(oThreshold.length, 1, "The threshold is rendered exactly once");
		assert.deepEqual(oSvgLines[0], oThreshold[0], "The threshold line is the first line in the svg element");
	});

	QUnit.test("showThresholdLine", function (assert) {
		this.oChart.setThreshold(50);
		this.oChart.rerender();
		var oThreshold = this.oChart.$().find(".sapSuiteLMCLineThreshold");
		assert.equal(oThreshold.length, 1, "The threshold is rendered exactly once");

		this.oChart.setShowThresholdLine(false);
		this.oChart.rerender();
		oThreshold = this.oChart.$().find(".sapSuiteLMCLineThreshold");
		assert.equal(oThreshold.length, 0, "The threshold is hidden");

		this.oChart.setShowThresholdLine(true);
		this.oChart.rerender();
		oThreshold = this.oChart.$().find(".sapSuiteLMCLineThreshold");
		assert.equal(oThreshold.length, 1, "The threshold is shown again");
	});

	QUnit.test("showThresholdValue", function (assert) {
		var oThresholdValue = this.oChart.$().find(".sapSuiteLMCThresholdLabel");
		assert.equal(oThresholdValue.length, 0, "The threshold value is not visible");

		this.oChart.setShowThresholdValue(true);
		this.oChart.rerender();
		oThresholdValue = this.oChart.$().find(".sapSuiteLMCThresholdLabel");
		assert.equal(oThresholdValue.length, 1, "The threshold value is visible");
		assert.equal(oThresholdValue.text(), this.oChart.getThreshold(), "The threshold value is correct");

		this.oChart.setShowThresholdValue(false);
		this.oChart.rerender();
		oThresholdValue = this.oChart.$().find(".sapSuiteLMCThresholdLabel");
		assert.equal(oThresholdValue.length, 0, "The threshold value is not visible");
	});


	QUnit.test("showThresholdValue with showThresholdLine false", function (assert) {
		this.oChart.setShowThresholdValue(true);
		this.oChart.setShowThresholdLine(false);
		this.oChart.rerender();

		var oThresholdValue = this.oChart.$().find(".sapSuiteLMCThresholdLabel");
		assert.equal(oThresholdValue.length, 0, "The threshold value is not visible");
	});

	QUnit.test("thresholdDisplayValue", function (assert) {
		this.oChart.setShowThresholdValue(true);
		this.oChart.setThresholdDisplayValue("label");
		this.oChart.rerender();

		var oThresholdValue = this.oChart.$().find(".sapSuiteLMCThresholdLabel");
		assert.equal(oThresholdValue.text(), "label", "The threshold value is correct");
	});

	QUnit.test("thresholdDisplayValue hidden when not enough space", function (assert) {
		this.oChart.setShowThresholdValue(true);
		this.oChart.setThresholdDisplayValue("bigger label");

		this.oChart.setWidth("15rem");
		this.oChart.rerender();
		var oThresholdValue = this.oChart.$().find(".sapSuiteLMCThresholdLabel");
		if ( !Device.browser.msie && !Device.browser.edge) {
			assert.ok(oThresholdValue.is(":visible"), "The threshold value is visible");
		}
		this.oChart.setWidth("7rem");
		this.oChart.rerender();
		oThresholdValue = this.oChart.$().find(".sapSuiteLMCThresholdLabel");
		assert.notOk(oThresholdValue.is(":visible"), "The threshold value is not visible");

		this.oChart.setWidth("15rem");
		this.oChart.rerender();
		oThresholdValue = this.oChart.$().find(".sapSuiteLMCThresholdLabel");
		if ( !Device.browser.msie && !Device.browser.edge) {
			assert.ok(oThresholdValue.is(":visible"), "The threshold value is visible");
		}
	});


	QUnit.module("Label colors - EmphasizedPoints", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mac", {
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				leftBottomLabel: "June 1",
				rightBottomLabel: "June 30",
				leftTopLabel: "0M",
				rightTopLabel: "80M",
				showPoints: true,
				threshold: 50,
				points: [
					new LineMicroChartEmphasizedPoint({
						show: true,
						color: "Neutral",
						x: 0,
						y: 100
					}),
					new LineMicroChartEmphasizedPoint({
						show: true,
						color: "Neutral",
						x: 50,
						y: 50
					}),
					new LineMicroChartEmphasizedPoint({
						show: true,
						color: "Neutral",
						x: 100,
						y: 0
					})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Unsemantic - Neither top Label is different from Neutral color if first and last Point has Neutral color", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setColor("Neutral");
		this.oChart.getPoints()[1].setColor("Neutral");
		this.oChart.getPoints()[2].setColor("Neutral");
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.equal(oTopLeftLabel.hasClass("sapSuiteLMCLabelNeutral"), true, "Top left label is Neutral");
		assert.equal(oTopRightLabel.hasClass("sapSuiteLMCLabelNeutral"), true, "Top right label is Neutral");
	});

	QUnit.test("Semantic - Neither top Label is different from Neutral color if first and last Point has Neutral color", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setColor("Neutral");
		this.oChart.getPoints()[1].setColor("Error");
		this.oChart.getPoints()[2].setColor("Neutral");
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.equal(oTopLeftLabel.hasClass("sapSuiteLMCLabelNeutral"), true, "Top left label is Neutral");
		assert.equal(oTopRightLabel.hasClass("sapSuiteLMCLabelNeutral"), true, "Top right label is Neutral");
	});

	QUnit.test("Unsemantic - Neither top Label is different from Neutral color if first and last Point has semantic color but is not shown", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setColor("Error");
		this.oChart.getPoints()[0].setShow(false);
		this.oChart.getPoints()[1].setColor("Neutral");
		this.oChart.getPoints()[1].setShow(true);
		this.oChart.getPoints()[2].setColor("Good");
		this.oChart.getPoints()[2].setShow(false);
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.equal(oTopLeftLabel.hasClass("sapSuiteLMCLabelNeutral"), true, "Top left label is Neutral");
		assert.equal(oTopRightLabel.hasClass("sapSuiteLMCLabelNeutral"), true, "Top right label is Neutral");
	});

	QUnit.test("Semantic - Neither top Label is different from Neutral color if first and last Point has semantic color but is not shown", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setColor("Error");
		this.oChart.getPoints()[0].setShow(false);
		this.oChart.getPoints()[1].setColor("Error");
		this.oChart.getPoints()[1].setShow(true);
		this.oChart.getPoints()[2].setColor("Good");
		this.oChart.getPoints()[2].setShow(false);
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.equal(oTopLeftLabel.hasClass("sapSuiteLMCLabelNeutral"), true, "Top left label is Neutral");
		assert.equal(oTopRightLabel.hasClass("sapSuiteLMCLabelNeutral"), true, "Top right label is Neutral");
	});

	QUnit.test("Semantic - Top labels gain their respective semantic colors if their corresponding points are shown", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setColor("Error");
		this.oChart.getPoints()[0].setShow(true);
		this.oChart.getPoints()[1].setColor("Neutral");
		this.oChart.getPoints()[1].setShow(false);
		this.oChart.getPoints()[2].setColor("Good");
		this.oChart.getPoints()[2].setShow(true);
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.ok(oTopLeftLabel.hasClass("sapSuiteLMCLabelError"), "Top left label is Neutral");
		assert.ok(oTopRightLabel.hasClass("sapSuiteLMCLabelGood"), "Top right label is Neutral");
	});

	QUnit.module("EmphasizedPoints", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mac", {
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				leftBottomLabel: "June 1",
				rightBottomLabel: "June 30",
				leftTopLabel: "0M",
				rightTopLabel: "80M",
				showPoints: true,
				threshold: 50,
				points: [
					new LineMicroChartEmphasizedPoint({
						show: true,
						color: "Neutral",
						x: 0,
						y: 100
					}),
					new LineMicroChartEmphasizedPoint({
						show: true,
						color: "Neutral",
						x: 50,
						y: 50
					}),
					new LineMicroChartEmphasizedPoint({
						show: true,
						color: "Neutral",
						x: 100,
						y: 0
					})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Lines/Points are colored when EmphasizedPoints are used - single semantic chart color and all Points Neutral color", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor("Error");
		this.oChart.rerender();
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold").not(".sapSuiteLMCLineError");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPointError");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Line has a different color from the set chart color");
		assert.equal(oPoints.length, 3, "All Points have the chart color applied");
	});

	QUnit.test("Lines/Points are not colored when EmphasizedPoints are used - single semantic chart color and one Point non Neutral", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor("Error");
		this.oChart.getPoints()[1].setColor("Critical");
		this.oChart.rerender();
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold").not(".sapSuiteLMCLineNeutral");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint").not(".sapSuiteLMCPointNeutral");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Line has a different color from Neutral");
		assert.equal(oPoints.length, 1, "Only one manually set Point has a different color from Neutral");
	});

	QUnit.test("Lines/Points are not colored when EmphasizedPoints are used - composite semantic chart colors", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "Error", below: "Good"});
		this.oChart.rerender();
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold").filter(".sapSuiteLMCLineError, .sapSuiteLMCLineGood");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint").filter(".sapSuiteLMCPointError, .sapSuiteLMCPointGood");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Line has a color Error or Good");
		assert.equal(oPoints.length, 0, "No Point has a color Error or Good");
	});

	QUnit.test("Lines/Points are colored when EmphasizedPoints are used - single hex chart color and all Points Neutral color", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor("#222222");
		this.oChart.rerender();
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold").not(".sapSuiteLMCLineNeutral");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPointNeutral");
		//Assert
		assert.equal(oSvgLines.length, 2, "All Lines are missing the Neutral color");
		assert.equal(oPoints.length, 0, "No Points are colored Neutral");
	});

	QUnit.test("Lines/Points are not colored when EmphasizedPoints are used - single hex chart color and one Point non Neutral", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor("#222222");
		this.oChart.getPoints()[1].setColor("Critical");
		this.oChart.rerender();
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold").not(".sapSuiteLMCLineNeutral");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint").not(".sapSuiteLMCPointNeutral");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Line has a different color from Neutral");
		assert.equal(oPoints.length, 1, "Only one manually set Point has a different color from Neutral");
	});

	QUnit.test("Lines/Points are not colored when EmphasizedPoints are used - composite hex chart colors", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "#222222", below: "#333333"});
		this.oChart.rerender();
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");

		oSvgLines.each(function() {
			assert.ok(jQuery(this).attr("style").indexOf("stroke:#222222") < 0, "above color is not used");
			assert.ok(jQuery(this).attr("style").indexOf("stroke:#333333") < 0, "below color is not used");
		});

		oPoints.each(function() {
			assert.ok(jQuery(this).attr("style").indexOf("background-color:#222222") < 0, "above color is not used");
			assert.ok(jQuery(this).attr("style").indexOf("background-color:#333333") < 0, "below color is not used");
		});
	});

	QUnit.test("Lines are not colored when EmphasizedPoints are using semantical colors", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setColor("Error");
		this.oChart.getPoints()[1].setColor("Critical");
		this.oChart.getPoints()[2].setColor("Good");
		this.oChart.rerender();
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold").not(".sapSuiteLMCLineNeutral");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Line has a different color from Neutral");
	});

	QUnit.test("ShowPoints mode has no influence on display of Points showPoints false", function (assert) {
		//Arrange
		//Act
		this.oChart.setShowPoints(false);
		this.oChart.getPoints()[0].setShow(true);
		this.oChart.getPoints()[1].setShow(false);
		this.oChart.getPoints()[2].setShow(true);
		this.oChart.rerender();
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		var iExpectedPoints = 2;
		//Assert
		assert.equal(oPoints.length, iExpectedPoints, "All shown Points are displayed");
	});

	QUnit.test("ShowPoints mode has no influence on display of Points showPoints true", function (assert) {
		//Arrange
		//Act
		this.oChart.setShowPoints(true);
		this.oChart.getPoints()[0].setShow(true);
		this.oChart.getPoints()[1].setShow(false);
		this.oChart.getPoints()[2].setShow(true);
		this.oChart.rerender();
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		var iExpectedPoints = 2;
		//Assert
		assert.equal(oPoints.length, iExpectedPoints, "All shown Points are displayed");
	});

	QUnit.test("FocusMode is active if EmphasizedPoints are used", function (assert) {
		//Arrange
		//Act
		var bChartFocusMode = this.oChart._getLines()[0]._bFocusMode;
		//Assert
		assert.ok(bChartFocusMode, "Focus Mode is internally set");
	});

	QUnit.test("SemanticMode is not active if no EmphasizedPoints are using colors different from Neutral", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setColor("Neutral");
		this.oChart.getPoints()[1].setColor("Neutral");
		this.oChart.getPoints()[2].setColor("Neutral");
		this.oChart.rerender();
		var bChartSemanticMode = this.oChart.$().hasClass("sapSuiteLMCSemanticMode");
		//Assert
		assert.equal(bChartSemanticMode, false, "Semantic Mode class is not set on chart");
		assert.ok(!this.oChart._bSemanticMode, "Semantic Mode is not internally set");
	});

	QUnit.test("SemanticMode is active if atleast one EmphasizedPoint is using colors different from Neutral which is shown", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setColor("Neutral");
		this.oChart.getPoints()[1].setColor("Error");
		this.oChart.getPoints()[1].setShow(true);
		this.oChart.getPoints()[2].setColor("Neutral");
		this.oChart.rerender();
		var bChartSemanticMode = this.oChart._getLines()[0]._bSemanticMode;
		//Assert
		assert.ok(bChartSemanticMode, "Semantic Mode is internally set");
	});

	QUnit.test("SemanticMode is not active if at least one EmphasizedPoint is using colors different from Neutral but is not shown", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setColor("Neutral");
		this.oChart.getPoints()[1].setColor("Error");
		this.oChart.getPoints()[1].setShow(false);
		this.oChart.getPoints()[2].setColor("Neutral");
		this.oChart.rerender();
		var bChartSemanticMode = this.oChart.$().hasClass("sapSuiteLMCSemanticMode");
		//Assert
		assert.equal(bChartSemanticMode, false, "Semantic Mode class is not set on chart");
		assert.ok(!this.oChart._bSemanticMode, "Semantic Mode is not internally set");
	});

	QUnit.test("EmphasizedPoint will be semantically colored if property color is set", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setColor("Error");
		this.oChart.getPoints()[1].setColor("Critical");
		this.oChart.getPoints()[2].setColor("Good");
		this.oChart.rerender();
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		//Assert
		assert.equal(oPoints.eq(0).hasClass("sapSuiteLMCPointError"), true, "Semantic color correctly applied");
		assert.equal(oPoints.eq(1).hasClass("sapSuiteLMCPointCritical"), true, "Semantic color correctly applied");
		assert.equal(oPoints.eq(2).hasClass("sapSuiteLMCPointGood"), true, "Semantic color correctly applied");
	});

	QUnit.test("EmphasizedPoint fall back to Neutral if property color is incorrect", function (assert) {
		//Arrange
		var sColor = Parameters.get("sapUiChartPaletteQualitativeHue1");
		//Act
		this.oChart.getPoints()[0].setColor("Exotic");
		this.oChart.getPoints()[1].setColor("123456");
		this.oChart.getPoints()[2].setColor(null);
		this.oChart.rerender();
		var aPoints = this.oChart.$().find(".sapSuiteLMCPoint").filter(function() {
			return this.style.backgroundColor == "rgb(88, 153, 218)";
		});
		//Assert
		assert.equal(aPoints.length, 3, "All Points have correct default semantic color applied");

		//Arrange
		//Act
		this.oChart.getPoints()[0].setColor("red");
		this.oChart.getPoints()[1].setColor("#223344");
		this.oChart.getPoints()[2].setColor("rgb(255, 0, 156)");
		this.oChart.rerender();
		aPoints = aPoints = this.oChart.$().find(".sapSuiteLMCPoint").filter(function() {
			return this.style.backgroundColor == "rgb(88, 153, 218)";
		});
		//Assert
		assert.equal(aPoints.length, 0, "All Points have correct default semantic color applied");
	});

	QUnit.test("EmphasizedPoints are not rendered if their show property is false", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setShow(false);
		this.oChart.getPoints()[1].setShow(false);
		this.oChart.getPoints()[2].setShow(false);
		this.oChart.rerender();
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		//Assert
		assert.equal(oPoints.length, 0, "No Point is rendered");
	});

	QUnit.module("Points", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mac", {
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				leftBottomLabel: "June 1",
				rightBottomLabel: "June 30",
				leftTopLabel: "0M",
				rightTopLabel: "80M",
				showPoints: true,
				threshold: 50,
				points: [
					new LineMicroChartPoint({
						x: 0,
						y: 100
					}),
					new LineMicroChartPoint({
						x: 50,
						y: 50
					}),
					new LineMicroChartPoint({
						x: 100,
						y: 0
					})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("In no showPoints mode no points are rendered", function (assert) {
		//Arrange
		//Act
		this.oChart.setShowPoints(false);
		this.oChart.rerender();
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		var iExpectedPoints = 0;
		//Assert
		assert.equal(oPoints.length, iExpectedPoints, "No Points are displayed");
	});

	QUnit.test("ShowPoints mode enabled means all Points are rendered", function (assert) {
		//Arrange
		//Act
		this.oChart.setShowPoints(true);
		this.oChart.rerender();
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		var iExpectedPoints = 3;
		//Assert
		assert.equal(oPoints.length, iExpectedPoints, "All Points are displayed");
	});

	QUnit.test("Lines/Points are colored regardless of the threshold used - single semantic chart color", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor("Error");
		this.oChart.rerender();
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold").filter(".sapSuiteLMCLineError");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint").filter(".sapSuiteLMCPointError");
		//Assert
		assert.equal(oSvgLines.length, 2, "All Lines are colored correctly");
		assert.equal(oPoints.length, 3, "All Points are colored correctly");
	});

	QUnit.test("Lines/Points are colored according to the threshold used - composite semantic chart colors", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "Error", below: "Good"});
		this.oChart.rerender();
		var oSvgLinesError = this.oChart.$().find(".sapSuiteLMCSvgElement line.sapSuiteLMCLineError");
		var oSvgLinesGood = this.oChart.$().find(".sapSuiteLMCSvgElement line.sapSuiteLMCLineGood");
		var oPointsError = this.oChart.$().find(".sapSuiteLMCPoint.sapSuiteLMCPointError");
		var oPointsGood = this.oChart.$().find(".sapSuiteLMCPoint.sapSuiteLMCPointGood");
		//Assert
		assert.equal(oSvgLinesError.length, 1, "Lines above Threshold have correct semantic color");
		assert.equal(oSvgLinesGood.length, 1, "Lines below Threshold have correct semantic color");
		assert.equal(oPointsError.length, 2, "Points above Threshold have correct semantic color");
		assert.equal(oPointsGood.length, 1, "Points below Threshold have correct semantic color");
	});

	QUnit.test("Lines/Points are colored regardless of the threshold used - single hex chart color", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor("#222222");
		this.oChart.rerender();
		//Assert
		//Lines
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold");
		var bSvgLine1ColorCorrect = jQuery.inArray(oSvgLines.eq(0).css("stroke"), ["rgb(34, 34, 34)", "#222222"]) >= 0;
		var bSvgLine2ColorCorrect = jQuery.inArray(oSvgLines.eq(1).css("stroke"), ["rgb(34, 34, 34)", "#222222"]) >= 0;
		//Points
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		var bPoint1ColorCorrect = jQuery.inArray(oPoints.eq(0).css("background-color"), ["rgb(34, 34, 34)", "#222222"]) >= 0;
		var bPoint2ColorCorrect = jQuery.inArray(oPoints.eq(1).css("background-color"), ["rgb(34, 34, 34)", "#222222"]) >= 0;
		var bPoint3ColorCorrect = jQuery.inArray(oPoints.eq(2).css("background-color"), ["rgb(34, 34, 34)", "#222222"]) >= 0;

		assert.ok(bSvgLine1ColorCorrect, "Line 1 has correct color applied");
		assert.ok(bSvgLine2ColorCorrect, "Line 2 has correct color applied");
		assert.ok(bPoint1ColorCorrect, "Point 1 has correct color applied");
		assert.ok(bPoint2ColorCorrect, "Point 2 has correct color applied");
		assert.ok(bPoint3ColorCorrect, "Point 3 has correct color applied");
	});

	QUnit.test("Lines/Points are colored when according to the threshold used - composite hex chart colors", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "#222222", below: "#333333"});
		this.oChart.rerender();
		//Assert
		// Lines (first above threshold, second below threshold)
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold");
		var bSvgLine1ColorCorrect = jQuery.inArray(oSvgLines.eq(0).css("stroke"), ["rgb(34, 34, 34)", "#222222"]) >= 0;
		var bSvgLine2ColorCorrect = jQuery.inArray(oSvgLines.eq(1).css("stroke"), ["rgb(51, 51, 51)", "#333333"]) >= 0;
		// Points (first & second above threshold, third below threshold)
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		var bPoint1ColorCorrect = jQuery.inArray(oPoints.eq(0).css("background-color"), ["rgb(34, 34, 34)", "#222222"]) >= 0;
		var bPoint2ColorCorrect = jQuery.inArray(oPoints.eq(1).css("background-color"), ["rgb(34, 34, 34)", "#222222"]) >= 0;
		var bPoint3ColorCorrect = jQuery.inArray(oPoints.eq(2).css("background-color"), ["rgb(51, 51, 51)", "#333333"]) >= 0;

		assert.ok(bSvgLine1ColorCorrect, "Line 1 above threhsold has correct color applied");
		assert.ok(bSvgLine2ColorCorrect, "Line 2 below threshold has correct color applied");
		assert.ok(bPoint1ColorCorrect, "Point 1 above threshold has correct color applied");
		assert.ok(bPoint2ColorCorrect, "Point 2 above threshold has correct color applied");
		assert.ok(bPoint3ColorCorrect, "Point 3 below threshold has correct color applied");
	});

	QUnit.test("Lines/Points fall back to Neutral if property color is incorrect - single incorrect chart color", function (assert) {
		//Arrange
		var sColor = Parameters.get("sapUiChartPaletteQualitativeHue1");
		//Act
		this.oChart.setColor("Exotic");
		this.oChart.rerender();
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint").filter(function() {
			return this.style.backgroundColor == "rgb(88, 153, 218)";
		});
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold").filter(function() {
			// IE does not convert stroke value to rgb
			return this.style.stroke == Device.browser.msie ? sColor : "rgb(88, 153, 218)";
		});
		//Assert
		assert.equal(oSvgLines.length, 2, "Semantic color correctly applied");
		assert.equal(oPoints.length, 3, "Semantic color correctly applied");
	});

	QUnit.test("Lines/Points fall back to Neutral if color property is correct but Threshold is null", function (assert) {
		//Arrange
		var sColor = Parameters.get("sapUiChartPaletteQualitativeHue1");
		//Act
		this.oChart.setColor({above: "Error", below: "Good"});
		this.oChart.setThreshold(null);
		this.oChart.rerender();
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint").filter(function() {
			return this.style.backgroundColor == "rgb(88, 153, 218)";
		});
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line").not(".sapSuiteLMCLineThreshold").filter(function() {
			// IE does not convert stroke value to rgb
			return this.style.stroke == Device.browser.msie ? sColor : "rgb(88, 153, 218)";
		});
		//Assert
		assert.equal(oSvgLines.length, 2, "Semantic color correctly applied");
		assert.equal(oPoints.length, 3, "Semantic color correctly applied");
	});

	QUnit.test("Neither FocusMode nor SemanticMode is active if single semantic chart color is used", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor("Neutral");
		this.oChart.rerender();
		var bChartSemanticMode = this.oChart._getLines()[0]._bSemanticMode;
		var bChartFocusMode = this.oChart._getLines()[0]._bFocusMode;
		//Assert
		assert.notOk(bChartSemanticMode, "Semantic Mode is not internally set");
		assert.notOk(bChartFocusMode, "Focus Mode is not internally set");
	});

	QUnit.test("Neither FocusMode nor SemanticMode is active if single hex chart color is used", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor("#222222");
		this.oChart.rerender();
		var bChartSemanticMode = this.oChart._getLines()[0]._bSemanticMode;
		var bChartFocusMode = this.oChart._getLines()[0]._bFocusMode;
		//Assert
		assert.notOk(bChartSemanticMode, "Semantic Mode is not internally set");
		assert.notOk(bChartFocusMode, "Focus Mode is not internally set");
	});

	QUnit.test("Only SemanticMode is active if composite hex chart colors are used", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "#222222", below: "#333333"});
		this.oChart.rerender();
		var bChartSemanticMode = this.oChart._getLines()[0]._bSemanticMode;
		var bChartFocusMode = this.oChart._getLines()[0]._bFocusMode;
		//Assert
		assert.ok(bChartSemanticMode, "Semantic Mode is internally set");
		assert.notOk(bChartFocusMode, "Focus Mode is not internally set");
	});

	QUnit.test("Only SemanticMode is active if composite semantic chart colors are used", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "Neutral", below: "Error"});
		this.oChart.rerender();
		var bChartSemanticMode = this.oChart._getLines()[0]._bSemanticMode;
		var bChartFocusMode = this.oChart._getLines()[0]._bFocusMode;
		//Assert
		assert.ok(bChartSemanticMode, "Semantic Mode is internally set");
		assert.notOk(bChartFocusMode, "Focus Mode is not internally set");
	});

	QUnit.test("Only SemanticMode is active even if composite semantic chart colors are used and both are Neutral", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "Neutral", below: "Neutral"});
		this.oChart.rerender();
		var bChartSemanticMode = this.oChart._getLines()[0]._bSemanticMode;
		var bChartFocusMode = this.oChart._getLines()[0]._bFocusMode;
		//Assert
		assert.ok(bChartSemanticMode, "Semantic Mode is internally set");
		assert.notOk(bChartFocusMode, "Focus Mode is not internally set");
	});

	QUnit.test("Neither FocusMode nor SemanticMode is active if composite chart color is incomplete", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "Neutral"});
		this.oChart.rerender();
		var bChartSemanticMode = this.oChart._getLines()[0]._bSemanticMode;
		var bChartFocusMode = this.oChart._getLines()[0]._bFocusMode;
		//Assert
		assert.notOk(bChartSemanticMode, "Semantic Mode is not internally set");
		assert.notOk(bChartFocusMode, "Focus Mode is not internally set");
	});

	QUnit.test("Neither FocusMode nor SemanticMode is active if threshold is null even if composite chart color is correct", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "Error", below: "Good"});
		this.oChart.setThreshold(null);
		this.oChart.rerender();
		var bChartSemanticMode = this.oChart._getLines()[0]._bSemanticMode;
		var bChartFocusMode = this.oChart._getLines()[0]._bFocusMode;
		//Assert
		assert.notOk(bChartSemanticMode, "Semantic Mode is not internally set");
		assert.notOk(bChartFocusMode, "Focus Mode is not internally set");
	});

	QUnit.module("Label colors - Points", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mac", {
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				leftBottomLabel: "June 1",
				rightBottomLabel: "June 30",
				leftTopLabel: "0M",
				rightTopLabel: "80M",
				showPoints: true,
				threshold: 50,
				points: [
					new LineMicroChartPoint({
						x: 0,
						y: 100
					}),
					new LineMicroChartPoint({
						x: 50,
						y: 50
					}),
					new LineMicroChartPoint({
						x: 100,
						y: 0
					})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Labels are Neutral - single semantic color", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor("Error");
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.ok(oTopLeftLabel.hasClass("sapSuiteLMCLabelNeutral"), "Top left label is neutral");
		assert.ok(oTopRightLabel.hasClass("sapSuiteLMCLabelNeutral"), "Top right label is neutral");
	});

	QUnit.test("Labels are colored - composite semantic colors and showPoints", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "Error", below: "Good"});
		this.oChart.setShowPoints(true);
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.ok(oTopLeftLabel.hasClass("sapSuiteLMCLabelError"), "Top left label is semantically colored");
		assert.ok(oTopRightLabel.hasClass("sapSuiteLMCLabelGood"), "Top right label is semantically colored");
	});

	QUnit.test("Labels are not colored - composite semantic colors and non-showPoints", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "Error", below: "Good"});
		this.oChart.setShowPoints(false);
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.ok(oTopLeftLabel.hasClass("sapSuiteLMCLabelNeutral"), "Top left label is neutral");
		assert.ok(oTopRightLabel.hasClass("sapSuiteLMCLabelNeutral"), "Top right label is neutral");
	});

	QUnit.test("Labels are Neutral - single hex color", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor("#222222");
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.ok(oTopLeftLabel.hasClass("sapSuiteLMCLabelNeutral"), "Top left label is neutral");
		assert.ok(oTopRightLabel.hasClass("sapSuiteLMCLabelNeutral"), "Top right label is neutral");
	});

	QUnit.test("Labels are neutral - composite hex colors", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "#222222", below: "#333333"});
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.ok(oTopLeftLabel.hasClass("sapSuiteLMCLabelNeutral"), "Top left label is neutral");
		assert.ok(oTopRightLabel.hasClass("sapSuiteLMCLabelNeutral"), "Top right label is neutral");
	});

	QUnit.test("Labels are colored - composite semantic colors and showPoints - threshold at maxY", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "Error", below: "Good"});
		this.oChart.setShowPoints(true);
		this.oChart.setThreshold(100);
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.ok(oTopLeftLabel.hasClass("sapSuiteLMCLabelError"), "Top left label is semantically colored");
		assert.ok(oTopRightLabel.hasClass("sapSuiteLMCLabelGood"), "Top right label is semantically colored");
	});

	QUnit.test("Labels are colored - composite semantic colors and showPoints - threshold at minY", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "Error", below: "Good"});
		this.oChart.setShowPoints(true);
		this.oChart.setThreshold(0);
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.ok(oTopLeftLabel.hasClass("sapSuiteLMCLabelError"), "Top left label is semantically colored");
		assert.ok(oTopRightLabel.hasClass("sapSuiteLMCLabelError"), "Top right label is semantically colored");
	});

	QUnit.test("Labels are colored - composite semantic colors and showPoints - threshold above maxY", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "Error", below: "Good"});
		this.oChart.setShowPoints(true);
		this.oChart.setThreshold(110);
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.ok(oTopLeftLabel.hasClass("sapSuiteLMCLabelGood"), "Top left label is semantically colored");
		assert.ok(oTopRightLabel.hasClass("sapSuiteLMCLabelGood"), "Top right label is semantically colored");
	});

	QUnit.test("Labels are colored - composite semantic colors and showPoints - threshold below minY", function (assert) {
		//Arrange
		//Act
		this.oChart.setColor({above: "Error", below: "Good"});
		this.oChart.setShowPoints(true);
		this.oChart.setThreshold(-10);
		this.oChart.rerender();
		var oTopLeftLabel = this.oChart.$().find(".sapSuiteLMCLeftTopLabel");
		var oTopRightLabel = this.oChart.$().find(".sapSuiteLMCRightTopLabel");
		//Assert
		assert.ok(oTopLeftLabel.hasClass("sapSuiteLMCLabelError"), "Top left label is semantically colored");
		assert.ok(oTopRightLabel.hasClass("sapSuiteLMCLabelError"), "Top right label is semantically colored");
	});

	QUnit.module("Normalization points tests", {
		beforeEach: function () {
			this.oChart = new LineMicroChart({
				points: [
					new LineMicroChartPoint({
						x: 0,
						y: 100
					}),
					new LineMicroChartPoint({
						x: 50,
						y: 50
					}),
					new LineMicroChartPoint({
						x: 100,
						y: 0
					})
				]
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Points are correctly rendered", function (assert) {
		//first line
		var oLine = this.oChart.$().find("line")[0];
		assert.equal(oLine.getAttribute("x1"), "0%", "First line start point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y1"), "100%", "First line start point y coordinate is correctly set");
		assert.equal(oLine.getAttribute("x2"), "100%", "First line end point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y2"), "100%", "First line end point y coordinate is correctly set");

		//second line
		oLine = this.oChart.$().find("line")[1];
		assert.equal(oLine.getAttribute("x1"), "0%", "Second line start point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y1"), "0%", "Second line start point y coordinate is correctly set");
		assert.equal(oLine.getAttribute("x2"), "50%", "Second line end point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y2"), "50%", "Second line end point y coordinate is correctly set");

		//third line
		oLine = this.oChart.$().find("line")[2];
		assert.equal(oLine.getAttribute("x1"), "50%", "Third line start point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y1"), "50%", "Third line start point y coordinate is correctly set");
		assert.equal(oLine.getAttribute("x2"), "100%", "Third line end point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y2"), "100%", "Third line end point y coordinate is correctly set");
	});

	QUnit.test("Equal Y points are drawn in the middle of the canvas if no threshold present", function (assert) {
		//Arrange
		this.oChart.getPoints()[0].setY(55);
		this.oChart.getPoints()[1].setY(55);
		this.oChart.getPoints()[2].setY(55);
		this.oChart.setThreshold(null);
		//Act
		sap.ui.getCore().applyChanges();
		//Assert

		//first line
		var oLine = this.oChart.$().find("line")[0];
		assert.equal(oLine.getAttribute("x1"), "0%", "First line start point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y1"), "50%", "First line start point y coordinate is correctly set");
		assert.equal(oLine.getAttribute("x2"), "50%", "First line end point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y2"), "50%", "First line end point y coordinate is correctly set");

		//second line
		oLine = this.oChart.$().find("line")[1];
		assert.equal(oLine.getAttribute("x1"), "50%", "Second line start point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y1"), "50%", "Second line start point y coordinate is correctly set");
		assert.equal(oLine.getAttribute("x2"), "100%", "Second line end point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y2"), "50%", "Second line end point y coordinate is correctly set");
	});


	QUnit.test("Points are correctly rendered after setting the scale", function (assert) {
		//Arrange
		this.oChart.setMinXValue(20);
		this.oChart.setMaxXValue(80);
		this.oChart.setMinYValue(20);
		this.oChart.setMaxYValue(80);
		//Act
		sap.ui.getCore().applyChanges();
		//Assert

		//first line
		var oLine = this.oChart.$().find("line")[0];
		assert.equal(oLine.getAttribute("x1"), "0%", "First line start point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y1"), "0%", "First line start point y coordinate is correctly set");
		assert.equal(oLine.getAttribute("x2"), "50%", "First line end point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y2"), "50%", "First line end point y coordinate is correctly set");

		//second line
		oLine = this.oChart.$().find("line")[1];
		assert.equal(oLine.getAttribute("x1"), "50%", "Second line start point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y1"), "50%", "Second line start point y coordinate is correctly set");
		assert.equal(oLine.getAttribute("x2"), "100%", "Second line end point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y2"), "100%", "Second line end point y coordinate is correctly set");

		//third line
		oLine = this.oChart.$().find("line")[2];
		assert.ok(!oLine, "There is no third line available");
	});

	QUnit.test("Points are correctly rendered by setting the scale inside the original canvas", function (assert) {
		//Arrange
		this.oChart.setMinXValue(-50);
		this.oChart.setMaxXValue(150);
		this.oChart.setMinYValue(-50);
		this.oChart.setMaxYValue(150);
		//Act
		sap.ui.getCore().applyChanges();
		//Assert

		//first line
		var oLine = this.oChart.$().find("line")[0];
		assert.equal(oLine.getAttribute("x1"), "0%", "First line start point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y1"), "75%", "First line start point y coordinate is correctly set");
		assert.equal(oLine.getAttribute("x2"), "100%", "First line end point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y2"), "75%", "First line end point y coordinate is correctly set");

		//second line
		oLine = this.oChart.$().find("line")[1];
		assert.equal(oLine.getAttribute("x1"), "25%", "Second line start point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y1"), "25%", "Second line start point y coordinate is correctly set");
		assert.equal(oLine.getAttribute("x2"), "50%", "Second line end point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y2"), "50%", "Second line end point y coordinate is correctly set");

		//third line
		oLine = this.oChart.$().find("line")[2];
		assert.equal(oLine.getAttribute("x1"), "50%", "First line start point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y1"), "50%", "First line start point y coordinate is correctly set");
		assert.equal(oLine.getAttribute("x2"), "75%", "First line end point x coordinate is correctly set");
		assert.equal(oLine.getAttribute("y2"), "75%", "First line end point y coordinate is correctly set");
	});

	QUnit.module("Scaling tests", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mac", {
				leftBottomLabel: "June 1",
				rightBottomLabel: "June 30",
				leftTopLabel: "0M",
				rightTopLabel: "80M",
				showPoints: true,
				threshold: null,
				points: [
					new LineMicroChartPoint({
						x: 50,
						y: 50
					}),
					new LineMicroChartPoint({
						x: 60,
						y: 60
					})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Internal scaling equals set scale", function (assert) {
		//Arrange
		//Act
		this.oChart.setMinXValue(0);
		this.oChart.setMinYValue(0);
		this.oChart.setMaxXValue(100);
		this.oChart.setMaxYValue(100);
		this.oChart.rerender();

		//Assert
		assert.equal(this.oChart._minXScale, this.oChart.getMinXValue(), "Scaling is equal to defined value");
		assert.equal(this.oChart._maxXScale, this.oChart.getMaxXValue(), "Scaling is equal to defined value");
		assert.equal(this.oChart._minYScale, this.oChart.getMinYValue(), "Scaling is equal to defined value");
		assert.equal(this.oChart._maxYScale, this.oChart.getMaxYValue(), "Scaling is equal to defined value");
	});

	QUnit.test("Internal scaling equals observed scale if min/max values are omitted", function (assert) {
		//Arrange
		//Act
		this.oChart.rerender();

		//Assert
		assert.equal(this.oChart._minXScale, 50, "Scaling is equal");
		assert.equal(this.oChart._maxXScale, 60, "Scaling is equal");
		assert.equal(this.oChart._minYScale, 50, "Scaling is equal");
		assert.equal(this.oChart._maxYScale, 60, "Scaling is equal");
	});

	QUnit.test("Internal scaling equals observed scale if min/max values are invalid", function (assert) {
		//Arrange
		//Act
		this.oChart.setMinXValue("min");
		this.oChart.setMinYValue("max");
		this.oChart.setMaxXValue("");
		this.oChart.setMaxYValue("random");
		this.oChart.rerender();

		//Assert
		assert.equal(this.oChart._minXScale, 50, "Scaling is equal");
		assert.equal(this.oChart._maxXScale, 60, "Scaling is equal");
		assert.equal(this.oChart._minYScale, 50, "Scaling is equal");
		assert.equal(this.oChart._maxYScale, 60, "Scaling is equal");
	});

	QUnit.test("MinX greater than MaxX - Chart is empty", function (assert) {
		//Arrange
		//Act
		this.oChart.setMaxXValue(60);
		this.oChart.setMinXValue(70);
		this.oChart.rerender();
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Svg lines are drawn");
		assert.equal(oPoints.length, 0, "No points are drawn");
	});

	QUnit.test("MaxX smaller than MinX - Chart is empty", function (assert) {
		//Arrange
		//Act
		this.oChart.setMinXValue(50);
		this.oChart.setMaxXValue(40);
		this.oChart.rerender();
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Svg lines are drawn");
		assert.equal(oPoints.length, 0, "No points are drawn");
	});

	QUnit.test("MinY greater than MaxY - Chart is empty", function (assert) {
		//Arrange
		//Act
		this.oChart.setMaxYValue(60);
		this.oChart.setMinYValue(70);
		this.oChart.rerender();
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Svg lines are drawn");
		assert.equal(oPoints.length, 0, "No points are drawn");
	});

	QUnit.test("MaxY smaller than MinY - Chart is empty", function (assert) {
		//Arrange
		//Act
		this.oChart.setMinYValue(50);
		this.oChart.setMaxYValue(40);
		this.oChart.rerender();
		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Svg lines are drawn");
		assert.equal(oPoints.length, 0, "No points are drawn");
	});

	QUnit.test("MinX greater than observed MaxX - Chart is empty", function (assert) {
		//Arrange
		//Act
		this.oChart.setMinXValue(61);
		this.oChart.rerender();

		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Svg lines are drawn");
		assert.equal(oPoints.length, 0, "No points are drawn");
		assert.equal(this.oChart._minXScale, this.oChart.getMinXValue(), "Scaling is equal to defined value");
		assert.equal(this.oChart._maxXScale, 60, "Scaling is equal to observed value");
	});

	QUnit.test("MaxX smaller than observed MinX - Chart is empty", function (assert) {
		//Arrange
		//Act
		this.oChart.setMaxXValue(49);
		this.oChart.rerender();

		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Svg lines are drawn");
		assert.equal(oPoints.length, 0, "No points are drawn");
		assert.equal(this.oChart._minXScale, 50, "Scaling is equal to observed value");
		assert.equal(this.oChart._maxXScale, this.oChart.getMaxXValue(), "Scaling is equal to defined value");
	});

	QUnit.test("MinY greater than observed MaxY - Chart is empty", function (assert) {
		//Arrange
		//Act
		this.oChart.setMinYValue(61);
		this.oChart.rerender();

		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Svg lines are drawn");
		assert.equal(oPoints.length, 0, "No points are drawn");
		assert.equal(this.oChart._minYScale, this.oChart.getMinYValue(), "Scaling is equal to defined value");
		assert.equal(this.oChart._maxYScale, 60, "Scaling is equal to observed value");
	});

	QUnit.test("MaxY smaller than observed MinY - Chart is empty", function (assert) {
		//Arrange
		//Act
		this.oChart.setMaxYValue(49);
		this.oChart.rerender();

		var oSvgLines = this.oChart.$().find(".sapSuiteLMCSvgElement line");
		var oPoints = this.oChart.$().find(".sapSuiteLMCPoint");
		//Assert
		assert.equal(oSvgLines.length, 0, "No Svg lines are drawn");
		assert.equal(oPoints.length, 0, "No points are drawn");
		assert.equal(this.oChart._minYScale, 50, "Scaling is equal to observed value");
		assert.equal(this.oChart._maxYScale, this.oChart.getMaxYValue(), "Scaling is equal to defined value");
	});

	QUnit.test("Threshold smaller than observed min Y value without custom scale - internal MinY adjusted to Threshold", function (assert) {
		//Arrange
		//Act
		this.oChart.setThreshold(40);
		this.oChart.rerender();
		//Assert
		assert.equal(this.oChart._minYScale, this.oChart.getThreshold(), "Internal MinY equals set theshold value");
		assert.equal(this.oChart._maxYScale, 60, "Scaling is equal to observed value");
	});

	QUnit.test("Threshold greater than observed max Y value without custom scale - internal MinY adjusted to Threshold", function (assert) {
		//Arrange
		//Act
		this.oChart.setThreshold(70);
		this.oChart.rerender();
		//Assert
		assert.equal(this.oChart._maxYScale, this.oChart.getThreshold(), "Internal MaxY equals set theshold value");
		assert.equal(this.oChart._minYScale, 50, "Scaling is equal to observed value");
	});

	QUnit.test("Threshold smaller than observed min Y value but smaller than minY - internal minY honors set minY", function (assert) {
		//Arrange
		//Act
		this.oChart.setThreshold(40);
		this.oChart.setMinYValue(45);
		this.oChart.rerender();
		//Assert
		assert.equal(this.oChart._minYScale, this.oChart.getMinYValue(), "Internal MinY equals set MinY value");
		assert.equal(this.oChart._maxYScale, 60, "Scaling is equal to observed value");
	});

	QUnit.test("Threshold greater than observed max Y value but greater than minY - internal maxY honors set maxY", function (assert) {
		//Arrange
		//Act
		this.oChart.setThreshold(70);
		this.oChart.setMaxYValue(65);
		this.oChart.rerender();
		//Assert
		assert.equal(this.oChart._maxYScale, this.oChart.getMaxYValue(), "Internal MaxY equals set MaxY value");
		assert.equal(this.oChart._minYScale, 50, "Scaling is equal to observed value");
	});

	QUnit.test("Threshold smaller than manually set scale defined by minY and maxY - internal minY honors set minY", function (assert) {
		//Arrange
		//Act
		this.oChart.setThreshold(40);
		this.oChart.setMinYValue(45);
		this.oChart.setMaxYValue(70);
		this.oChart.rerender();
		//Assert
		assert.equal(this.oChart._minYScale, this.oChart.getMinYValue(), "Internal MinY equals set MinY value");
		assert.equal(this.oChart._maxYScale, this.oChart.getMaxYValue(), "Internal MaxY equals set MaxY value");
	});

	QUnit.test("Threshold greater than manually set scale defined by minY and maxY - internal maxY honors set maxY", function (assert) {
		//Arrange
		//Act
		this.oChart.setThreshold(70);
		this.oChart.setMaxYValue(65);
		this.oChart.setMinYValue(40);
		this.oChart.rerender();
		//Assert
		assert.equal(this.oChart._minYScale, this.oChart.getMinYValue(), "Internal MinY equals set MinY value");
		assert.equal(this.oChart._maxYScale, this.oChart.getMaxYValue(), "Internal MaxY equals set MaxY value");
	});

	QUnit.module("Rendering - Intersections", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mac", {
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				leftBottomLabel: "June 1",
				rightBottomLabel: "June 30",
				leftTopLabel: "0M",
				rightTopLabel: "80M",
				showPoints: true,
				threshold: null,
				points: [
					new LineMicroChartPoint({
						x: 0,
						y: 0
					}),
					new LineMicroChartPoint({
						x: 0,
						y: 0
					})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Intersection Left", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setX(-50);
		this.oChart.getPoints()[0].setY(30);
		this.oChart.getPoints()[1].setX(50);
		this.oChart.getPoints()[1].setY(40);

		this.oChart.rerender();
		var oLine = this.oChart.$().find("line"),
			iLineX1 = parseFloat(oLine[0].getAttribute("x1")),
			iLineX2 = parseFloat(oLine[0].getAttribute("x2")),
			iLineY1 = parseFloat(oLine[0].getAttribute("y1")),
			iLineY2 = parseFloat(oLine[0].getAttribute("y2")),
			oPoint = this.oChart.$().find(".sapSuiteLMCPoint"),
			iLineTop = parseFloat(jQuery(oPoint[0]).css("top")),
			iLineLeft = parseFloat(jQuery(oPoint[0]).css("left"));
		//Assert
		assert.equal(oLine.length, 1, "Only one line is drawn");
		assert.ok(iLineX1 <= 100 && iLineX1 >= 0, "Line start point x coordinate does not intersect with the canvas");
		assert.ok(iLineX2 <= 100 && iLineX2 >= 0, "Line end point x coordinate does not intersect with the canvas");
		assert.ok(iLineY1 <= 100 && iLineY1 >= 0, "Line start point y coordinate does not intersect with the canvas");
		assert.ok(iLineY2 <= 100 && iLineY2 >= 0, "Line end point y coordinate does not intersect with the canvas");
		assert.equal(oPoint.length, 1, "Only one point is drawn");
		assert.ok(iLineTop <= 100 && iLineTop >= 0, "Point does not intersect with the canvas vertically");
		assert.ok(iLineLeft <= 100 && iLineLeft >= 0, "Point does not intersect with the canvas horizontally");
	});

	QUnit.test("Intersection Top", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setX(20);
		this.oChart.getPoints()[0].setY(50);
		this.oChart.getPoints()[1].setX(80);
		this.oChart.getPoints()[1].setY(150);

		this.oChart.rerender();
		var oLine = this.oChart.$().find("line"),
			iLineX1 = parseFloat(oLine[0].getAttribute("x1")),
			iLineX2 = parseFloat(oLine[0].getAttribute("x2")),
			iLineY1 = parseFloat(oLine[0].getAttribute("y1")),
			iLineY2 = parseFloat(oLine[0].getAttribute("y2")),
			oPoint = this.oChart.$().find(".sapSuiteLMCPoint"),
			iLineTop = parseFloat(jQuery(oPoint[0]).css("top")),
			iLineLeft = parseFloat(jQuery(oPoint[0]).css("left"));
		//Assert
		assert.equal(oLine.length, 1, "Only one line is drawn");
		assert.ok(iLineX1 <= 100 && iLineX1 >= 0, "Line start point x coordinate does not intersect with the canvas");
		assert.ok(iLineX2 <= 100 && iLineX2 >= 0, "Line end point x coordinate does not intersect with the canvas");
		assert.ok(iLineY1 <= 100 && iLineY1 >= 0, "Line start point y coordinate does not intersect with the canvas");
		assert.ok(iLineY2 <= 100 && iLineY2 >= 0, "Line end point y coordinate does not intersect with the canvas");
		assert.equal(oPoint.length, 1, "Only one point is drawn");
		assert.ok(iLineTop <= 100 && iLineTop >= 0, "Point does not intersect with the canvas vertically");
		assert.ok(iLineLeft <= 100 && iLineLeft >= 0, "Point does not intersect with the canvas horizontally");
	});

	QUnit.test("Intersection Right", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setX(50);
		this.oChart.getPoints()[0].setY(30);
		this.oChart.getPoints()[1].setX(150);
		this.oChart.getPoints()[1].setY(40);

		this.oChart.rerender();
		var oLine = this.oChart.$().find("line"),
			iLineX1 = parseFloat(oLine[0].getAttribute("x1")),
			iLineX2 = parseFloat(oLine[0].getAttribute("x2")),
			iLineY1 = parseFloat(oLine[0].getAttribute("y1")),
			iLineY2 = parseFloat(oLine[0].getAttribute("y2")),
			oPoint = this.oChart.$().find(".sapSuiteLMCPoint"),
			iLineTop = parseFloat(jQuery(oPoint[0]).css("top")),
			iLineLeft = parseFloat(jQuery(oPoint[0]).css("left"));
		//Assert
		assert.equal(oLine.length, 1, "Only one line is drawn");
		assert.ok(iLineX1 <= 100 && iLineX1 >= 0, "Line start point x coordinate does not intersect with the canvas");
		assert.ok(iLineX2 <= 100 && iLineX2 >= 0, "Line end point x coordinate does not intersect with the canvas");
		assert.ok(iLineY1 <= 100 && iLineY1 >= 0, "Line start point y coordinate does not intersect with the canvas");
		assert.ok(iLineY2 <= 100 && iLineY2 >= 0, "Line end point y coordinate does not intersect with the canvas");
		assert.equal(oPoint.length, 1, "Only one point is drawn");
		assert.ok(iLineTop <= 100 && iLineTop >= 0, "Point does not intersect with the canvas vertically");
		assert.ok(iLineLeft <= 100 && iLineLeft >= 0, "Point does not intersect with the canvas horizontally");
	});

	QUnit.test("Intersection Bottom", function (assert) {
		//Arrange
		//Act
		this.oChart.getPoints()[0].setX(50);
		this.oChart.getPoints()[0].setY(50);
		this.oChart.getPoints()[1].setX(60);
		this.oChart.getPoints()[1].setY(-50);

		this.oChart.rerender();
		var oLine = this.oChart.$().find("line"),
			iLineX1 = parseFloat(oLine[0].getAttribute("x1")),
			iLineX2 = parseFloat(oLine[0].getAttribute("x2")),
			iLineY1 = parseFloat(oLine[0].getAttribute("y1")),
			iLineY2 = parseFloat(oLine[0].getAttribute("y2")),
			oPoint = this.oChart.$().find(".sapSuiteLMCPoint"),
			iLineTop = parseFloat(jQuery(oPoint[0]).css("top")),
			iLineLeft = parseFloat(jQuery(oPoint[0]).css("left"));
		//Assert
		assert.equal(oLine.length, 1, "Only one line is drawn");
		assert.ok(iLineX1 <= 100 && iLineX1 >= 0, "Line start point x coordinate does not intersect with the canvas");
		assert.ok(iLineX2 <= 100 && iLineX2 >= 0, "Line end point x coordinate does not intersect with the canvas");
		assert.ok(iLineY1 <= 100 && iLineY1 >= 0, "Line start point y coordinate does not intersect with the canvas");
		assert.ok(iLineY2 <= 100 && iLineY2 >= 0, "Line end point y coordinate does not intersect with the canvas");
		assert.equal(oPoint.length, 1, "Only one point is drawn");
		assert.ok(iLineTop <= 100 && iLineTop >= 0, "Point does not intersect with the canvas vertically");
		assert.ok(iLineLeft <= 100 && iLineLeft >= 0, "Point does not intersect with the canvas horizontally");
	});

	QUnit.module("Control provides accessibility information", {
		beforeEach: function () {
			this.oChart = new LineMicroChart();
			this.oChart.setAggregation("tooltip", "LineMicroChart");
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method getAccessibilityInfo returns correct information", function (assert) {
		// Arrange
		var oExpectedAccessibilityInformation = {
			description: "LineMicroChart",
			type: this.oChart._getAccessibilityControlType()
		};

		// Act
		var oAccessibilityInformation = this.oChart.getAccessibilityInfo();

		// Assert
		assert.deepEqual(oAccessibilityInformation, oExpectedAccessibilityInformation, "An object with the correct properties has been returned.");
	});

	QUnit.module("Rendering tests for no data placeholder", {
		beforeEach: function () {
			this.oChart = new HarveyBallMicroChart("lineBallMicroChart").placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("No data rendered when no points given", function (assert) {
		//Arrange
		//Act
		//Assert
		assert.ok(jQuery.sap.domById("lineBallMicroChart"), "Control was rendered");
		var a$NoDataElement = jQuery.sap.byId(this.oChart.getId()).find(".sapSuiteUiMicroChartNoData");
		assert.equal(a$NoDataElement.length, 1, "No data placeholder shold be rendered");
	});

	QUnit.test("No data in aria-label", function (assert) {
		//Arrange
		//Act
		//Assert
		assert.equal(this.oChart.$().attr("role"), "img", "chart aria role was rendered successfully");
		assert.ok(this.oChart.$().attr("aria-label").indexOf("No data") > -1, "The aria-label includes no data");
	});

	TestUtils.initSizeModule(LineMicroChart, "sapSuiteLMCSize");

	QUnit.module("Efficient binding", {
		beforeEach: function () {
			this.oModel = new JSONModel({
				lines: [
					{
						points: [
							{"x": 0, "y": 50},
							{"x": 20, "y": 68},
							{"x": 40, "y": 25},
							{"x": 60, "y": 45},
							{"x": 80, "y": 67},
							{"x": 100, "y": 88}
						],
						emphasizedPoints: [
							{"x": 0, "y": -6, "show": true, "color": "Good", emphasized: true},
							{"x": 20, "y": 68, "show": false, emphasized: true},
							{"x": 100, "y": -6}
						]
					}
				]
			});

			this.oMicroChart = new LineMicroChart({
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				leftBottomLabel: "June 1",
				rightBottomLabel: "June 30",
				leftTopLabel: "0M",
				rightTopLabel: "80M"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oModel.destroy();
			this.oMicroChart.destroy();
		}
	});

	QUnit.test("_getPoints", function(assert) {
		this.oMicroChart.bindLines({
			path: "/lines",
			template: new LineMicroChartLine({
				points: {
					path: "points"
				}
			})
		});
		this.oMicroChart.setModel(this.oModel);
		var aLines = this.oMicroChart.getLines();

		assert.equal(aLines.length, 1, "line exist");
		assert.deepEqual(aLines[0].getPoints(), [], "public getPoints returns empty array");
		assert.equal(aLines[0]._getPoints().length, 6, "_getPoints returns correct number of objects");
		assert.ok(aLines[0]._getPoints()[0].getX, "getX method exists");
		assert.ok(aLines[0]._getPoints()[0].getY, "getY method exists");
		assert.ok(aLines[0]._getPoints()[0].getShow, "getShow method exists");
		assert.ok(aLines[0]._getPoints()[0].getColor, "getColor method exists");
		assert.ok(aLines[0]._getPoints()[0].getMetadata, "getMetadata method exists");
	});

	QUnit.test("Points are rendered", function(assert) {
		this.oMicroChart.bindLines({
			path: "/lines",
			template: new LineMicroChartLine({
				points: {
					path: "points"
				}
			})
		});
		this.oMicroChart.setModel(this.oModel);
		this.oMicroChart.invalidate();

		sap.ui.getCore().applyChanges();

		assert.equal(this.oMicroChart.$().find(".sapSuiteLMCLine").length, 5, "all points are rendered");
	});

	QUnit.test("emphasized points", function(assert) {
		this.oMicroChart.bindLines({
			path: "/lines",
			template: new LineMicroChartLine({
				points: {
					path: "emphasizedPoints"
				}
			})
		});
		this.oMicroChart.setModel(this.oModel);
		this.oMicroChart.invalidate();

		sap.ui.getCore().applyChanges();

		var aLines = this.oMicroChart.getLines();

		assert.equal(aLines[0]._getPoints()[0].getColor(), "Good");
		assert.equal(aLines[0]._getPoints()[0].getShow(), true);
		assert.equal(aLines[0]._getPoints()[0].getMetadata().getName(), "sap.suite.ui.microchart.LineMicroChartEmphasizedPoint");

		assert.equal(aLines[0]._getPoints()[1].getColor(), "Neutral", "default value is used");
		assert.equal(aLines[0]._getPoints()[1].getShow(), false);

		assert.equal(aLines[0]._getPoints()[2].getShow(), false, "default value is used");
	});

	QUnit.module("Internal functions with 'points' aggregation", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mChart", {
				leftTopLabel: "leftTopLabel",
				leftBottomLabel: "leftBottomLabel",
				rightTopLabel: "rightTopLabel",
				rightBottomLabel: "rightBottomLabel",
				points: [
					new LineMicroChartPoint({
						x: 5,
						y: 5
					}),
					new LineMicroChartPoint({
						x: 10,
						y: 10
					}),
					new LineMicroChartPoint({
						x: 20,
						y: 20
					})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("_getInternalLine", function(assert) {
		var oLine = this.oChart._getInternalLine();

		assert.ok(oLine, "line exists");
		assert.equal(oLine, this.oChart._getInternalLine(), "same line always returned");
	});

	QUnit.test("_getLines", function(assert) {
		var aLines = this.oChart._getLines();

		assert.equal(aLines.length, 1, "line returned");
		assert.equal(aLines[0], this.oChart._getInternalLine(), "lines taken from internal _line aggregation");
	});

	QUnit.test("_hasData", function(assert) {
		assert.ok(this.oChart._hasData(), "chart has data");
	});

	QUnit.module("Internal functions with 'lines' aggregation", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mChart", {
				leftTopLabel: "leftTopLabel",
				leftBottomLabel: "leftBottomLabel",
				rightTopLabel: "rightTopLabel",
				rightBottomLabel: "rightBottomLabel",
				lines: [
					new LineMicroChartLine(),
					new LineMicroChartLine()
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("_getLines", function(assert) {
		var aLines = this.oChart._getLines();

		assert.equal(aLines.length, 2, "lines returned");
	});

	QUnit.test("_hasData", function(assert) {
		assert.ok(this.oChart._hasData(), "chart has data");
	});

	QUnit.module("LineMicroChartLine", {
		beforeEach: function () {
			this.oChart = new LineMicroChart("mChart", {
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("getColor", function(assert) {
		var oLine = new LineMicroChartLine();
		var sColor = "blue";

		this.oChart.addLine(oLine);

		this.oChart.setColor(sColor);
		assert.equal(oLine.getColor(), sColor, "line returns charts color if not directly set");

		oLine.setColor("red");
		assert.equal(oLine.getColor(), "red", "line returns its own color if directly set");
	});

	QUnit.test("showPoints", function(assert) {
		var oLine = new LineMicroChartLine();
		this.oChart.addLine(oLine);

		this.oChart.setShowPoints(true);
		assert.ok(oLine.getShowPoints(), "line returns charts showPoints if not directly set");

		this.oChart.setShowPoints(false);
		assert.notOk(oLine.getShowPoints(), "line returns charts showPoints if not directly set");

		oLine.setShowPoints(true);
		assert.ok(oLine.getShowPoints(), "line returns its own showPoints if directly set");
	});

	QUnit.test("type", function(assert) {
		var oLine = new LineMicroChartLine();

		assert.equal(oLine.getType(), microchartLibrary.LineType.Solid, "default type is solid");
	});

	QUnit.module("Multiple lines", {
		beforeEach: function () {
			this.oMicroChart = new LineMicroChart({
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				leftBottomLabel: "June 1",
				rightBottomLabel: "June 30",
				leftTopLabel: "0M",
				rightTopLabel: "80M",
				lines: [
					{
						points: [
							new LineMicroChartPoint({
								x: 5,
								y: 5
							}),
							new LineMicroChartPoint({
								x: 10,
								y: 10
							}),
							new LineMicroChartPoint({
								x: 20,
								y: 20
							})
						]
					},
					{
						points: [
							new LineMicroChartEmphasizedPoint({
								x: 0,
								y: -6
							}),
							new LineMicroChartEmphasizedPoint({
								x: 20,
								y: 68
							}),
							new LineMicroChartEmphasizedPoint({
								x: 100,
								y: -6
							})
						]
					}
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oMicroChart.destroy();
		}
	});

	QUnit.test("all lines rendered", function(assert) {
		assert.equal(this.oMicroChart.$().find("g").length, 2, "all lines rendered");
	});


});
