/*global QUnit, sinon */
sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/microchart/BulletMicroChart",
	"sap/m/ValueColor",
	"sap/m/Size",
	"sap/suite/ui/microchart/BulletMicroChartModeType",
	"sap/m/FlexBox",
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/ui/model/json/JSONModel",
	"sap/m/ColumnListItem",
	"sap/suite/ui/microchart/CommonBackgroundType",
	"sap/ui/core/TooltipBase",
	"sap/m/Table",
	"sap/suite/ui/microchart/library",
	"./TestUtils"
], function (jQuery, BulletMicroChart, ValueColor, Size, BulletMicroChartModeType, FlexBox, GenericTile, TileContent,
			 JSONModel, ColumnListItem, CommonBackgroundType, TooltipBase, Table, microchartLibrary, TestUtils) {
	"use strict";

	jQuery.sap.initMobile();


	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function() {
			this.fnStubIsInitialized = sinon.stub(sap.ui.getCore(), "isInitialized");
			this.fnSpyAttachInit = sinon.spy(sap.ui.getCore(), "attachInit");
			this.fnSpyHandleCoreInitialized = sinon.spy(BulletMicroChart.prototype, "_handleCoreInitialized");
			this.fnStubThemeApplied = sinon.stub(sap.ui.getCore(), "isThemeApplied");
			this.fnStubAttachThemeApplied = sinon.stub(sap.ui.getCore(), "attachThemeChanged").callsFake(function(fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.fnSpyHandleThemeApplied = sinon.spy(BulletMicroChart.prototype, "_handleThemeApplied");
		},
		afterEach: function() {
			this.fnStubIsInitialized.restore();
			this.fnSpyAttachInit.restore();
			this.fnSpyHandleCoreInitialized.restore();
			this.fnStubThemeApplied.restore();
			this.fnStubAttachThemeApplied.restore();
			this.fnSpyHandleThemeApplied.restore();
		}
	});

	QUnit.test("Core initialization check - no core, no theme", function(assert) {
		//Arrange
		this.fnStubIsInitialized.returns(false);
		this.fnStubThemeApplied.returns(false);

		//Act
		var oChart = new BulletMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.fnSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core initialization check - no core, but theme", function(assert) {
		//Arrange
		this.fnStubIsInitialized.returns(false);
		this.fnStubThemeApplied.returns(true);

		//Act
		var oChart = new BulletMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.notCalled, "Method Core.attachThemeChanged has not been called.");
		assert.ok(this.fnSpyHandleThemeApplied.notCalled, "Method _handleThemeApplied has not been called.");
	});

	QUnit.test("Core initialization check - core, but no theme", function(assert) {
		//Arrange
		this.fnStubIsInitialized.returns(true);
		this.fnStubThemeApplied.returns(false);

		//Act
		var oChart = new BulletMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.fnSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core initialization check - core and theme", function(assert) {
		//Arrange
		this.fnStubIsInitialized.returns(true);
		this.fnStubThemeApplied.returns(true);

		//Act
		var oChart = new BulletMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.notCalled, "Method Core.attachThemeChanged has not been called.");
		assert.ok(this.fnSpyHandleThemeApplied.notCalled, "Method _handleThemeApplied has not been called.");
	});

	QUnit.module("Properties", {
		beforeEach : function() {
			this.oChart = new BulletMicroChart("chart", {
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Default Property Values", function(assert) {
		assert.equal(this.oChart.getSize(), Size.Auto, "size is sap.m.Size.Auto");
		assert.equal(this.oChart.getMode(), BulletMicroChartModeType.Actual, "mode is Actual");
		assert.equal(this.oChart.getScale(), "", "scale is ''");
		assert.equal(this.oChart.getShowActualValue(), true, "showActualValue is true");
		assert.equal(this.oChart.getShowActualValueInDeltaMode(), false, "showActualValueInDeltaMode is false");
		assert.equal(this.oChart.getShowDeltaValue(), true, "showDeltaValue is true");
		assert.equal(this.oChart.getShowTargetValue(), true, "showTargetValue is true");
		assert.equal(this.oChart.getShowThresholds(), true, "showThresholds is true");
		assert.equal(this.oChart.getShowValueMarker(), false, "showValueMarker is false");
		assert.equal(this.oChart.getActualValueLabel(), "", "actualValueLabel is ''");
		assert.equal(this.oChart.getDeltaValueLabel(), "", "deltaValueLabel is ''");
		assert.equal(this.oChart.getTargetValueLabel(), "", "targetValueLabel is ''");
		assert.equal(this.oChart.getScaleColor(), CommonBackgroundType.MediumLight, "scaleColor is MediumLight");
		assert.equal(this.oChart.getIsResponsive(), false, "isResponsive is false");
	});

	QUnit.module("Rendering tests", {
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Bullet chart rendered", function(assert) {
		this.oChart = new BulletMicroChart("bullet-chart", {
			size: Size.M,
			scale: "M",
			actual: { value: 120, color: ValueColor.Good},
			targetValue: 60,
			forecastValue: 112,
			minValue: 0,
			maxValue: 120,
			showValueMarker: true,
			mode: "Delta",
			thresholds: [ { value: 0, color: ValueColor.Error }]
		}).placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery.sap.domById("bullet-chart"), "Bullet chart was rendered successfully");
		assert.equal(jQuery.sap.byId("bullet-chart-bc-target-value").text(), "60M", "Target label was rendered successfully");
	});

	QUnit.test("Actual value bar not rendered when actual value is 0 and min value is 0", function(assert) {
		this.oChart = new BulletMicroChart("bullet-chart", {
			actual: {
				value: 0,
				color: ValueColor.Good
			},
			minValue: 0,
			maxValue: 120,
			showValueMarker: true
		}).placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		assert.notOk(jQuery.sap.domById("bullet-chart-bc-bar-value"), "Bullet chart actual value bar was not rendered");
	});

	QUnit.test("Actual value bar is rendered when actual value is 0 and min value is -120", function(assert) {
		this.oChart = new BulletMicroChart("bullet-chart", {
			actual: {
				value: 0,
				color: ValueColor.Good
			},
			minValue: -120,
			maxValue: 120,
			showValueMarker: true
		}).placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery.sap.domById("bullet-chart-bc-bar-value"), "Bullet chart actual value bar was rendered");
	});

	QUnit.test("Properties and aggregations are not set from the outside", function(assert) {
		this.oChart = new BulletMicroChart("bullet-chart").placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery.sap.domById("bullet-chart"), "Bullet chart was rendered without errors");
	});

	QUnit.test("Setting size property to sap.m.Size.Responsive leads to isResponsive === true", function(assert) {
		//Arrange
		this.oChart = new BulletMicroChart("bullet-chart", {
			size: Size.M
		}).placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		var bIsResponsive = this.oChart.getIsResponsive();
		//Act
		this.oChart.setSize(Size.Responsive);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(!bIsResponsive, "Chart is not in Responsive mode for size M");
		assert.ok(this.oChart.getIsResponsive(), "Chart is in Responsive mode for size 'Responsive'");
	});

	QUnit.test("setSize return instance", function(assert) {
		//Arrange
		this.oChart = new BulletMicroChart("bullet-chart");
		//Act
		var oResult = this.oChart.setSize(Size.Responsive);
		//Assert
		assert.deepEqual(oResult, this.oChart, "Control instance returned");
	});

	QUnit.test("setSize does nothing in case of same value", function(assert) {
		//Arrange
		this.oChart = new BulletMicroChart("bullet-chart", {
			size: Size.L
		});
		var oSpy = sinon.spy(this.oChart, "rerender");
		//Act
		var oResult = this.oChart.setSize(Size.L);
		//Assert
		assert.deepEqual(oResult, this.oChart, "Control instance returned");
		assert.equal(oSpy.callCount, 0, "Chart not rerendered");
	});

	QUnit.test("sap.m.Size.Responsive leads to isResponsive === true", function(assert) {
		//Arrange
		this.oChart = new BulletMicroChart("bullet-chart", {
			size: Size.Responsive
		}).placeAt("qunit-fixture");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(this.oChart.getIsResponsive(), "Chart is in Responsive mode for size Responsive");
	});

	QUnit.test("sap.m.Size.Responsive changed to sap.m.Size.L leads to isResponsive === false", function(assert) {
		//Arrange
		this.oChart = new BulletMicroChart("bullet-chart", {
			size: Size.Responsive
		}).placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		var oSpy = sinon.spy(this.oChart, "rerender");
		//Act
		this.oChart.setSize(Size.L);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(!this.oChart.getIsResponsive(), "Chart is no longer in Responsive mode for size L");
		assert.equal(oSpy.callCount, 1, "Chart rerendered");
	});

	QUnit.test("showThresholds false", function(assert) {
		//Arrange
		this.oChart = new BulletMicroChart("bullet-chart", {
			actual: {
				value: 0,
				color: ValueColor.Good
			},
			minValue: -120,
			maxValue: 120,
			showValueMarker: true
		}).placeAt("qunit-fixture");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		var $thresholds = this.oChart.$().find(".sapSuiteBMCThreshold");
		assert.equal($thresholds.length, 0, "Thresholds are not rendered");
	});

	QUnit.test("delta value is shown by default in delta mode", function(assert) {
		//Arrange
		this.oChart = new BulletMicroChart("bullet-chart", {
			actual: {
				value: 0,
				color: ValueColor.Good
			},
			targetValue: 60,
			minValue: -120,
			maxValue: 120,
			mode: "Delta"
		}).placeAt("qunit-fixture");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteBMCItemValue").text(), "Δ60", "Delta value shown");
	});

	QUnit.test("delta value is centered", function(assert) {
		//Arrange
		this.oChart = new BulletMicroChart("bullet-chart", {
			actual: {
				value: 0,
				color: ValueColor.Good
			},
			targetValue: 60,
			minValue: -120,
			maxValue: 120,
			mode: "Delta"
		}).placeAt("qunit-fixture");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(this.oChart.$().find(".sapSuiteBMCBarValue").css("left") < this.oChart.$().find(".sapSuiteBMCItemValue").css("left"), "Delta value centered");
	});

	QUnit.test("actual value is shown in delta mode with showActualValueInDeltaMode", function(assert) {
		//Arrange
		this.oChart = new BulletMicroChart("bullet-chart", {
			actual: {
				value: 0,
				color: ValueColor.Good
			},
			targetValue: 60,
			minValue: -120,
			maxValue: 120,
			mode: "Delta",
			showActualValueInDeltaMode: true
		}).placeAt("qunit-fixture");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteBMCItemValue").text(), "0", "Actual value shown");
	});


	QUnit.test("actual value is at the edge of the bar", function(assert) {
		//Arrange
		this.oChart = new BulletMicroChart("bullet-chart", {
			actual: {
				value: -60,
				color: ValueColor.Good
			},
			targetValue: 0,
			minValue: -120,
			maxValue: 120,
			mode: "Delta",
			showActualValueInDeltaMode: true
		}).placeAt("qunit-fixture");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(this.oChart.$().find(".sapSuiteBMCBarValue").css("left") > this.oChart.$().find(".sapSuiteBMCItemValue").css("left"), "Actual value placed correctly");
	});

	QUnit.test("labels are correcetly aligned even with text-align center on outer element", function(assert) {
		//Arrange
		this.oChart = new BulletMicroChart("bullet-chart", {
			actual: {
				value: -60,
				color: ValueColor.Good
			},
			targetValue: 0,
			minValue: -120,
			maxValue: 120,
			mode: "Delta",
			showActualValueInDeltaMode: true
		}).placeAt("qunit-fixture");
		//Act
		sap.ui.getCore().applyChanges();
		this.oChart.$().css("text-align", "center");
		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteBMCTopLabel").css("text-align"), "left", "Label is aligned to left");
		assert.equal(this.oChart.$().find(".sapSuiteBMCBottomLabel").css("text-align"), "left", "Label is aligned to left");
	});


	QUnit.test("Size M with isResponsive false sets Size M", function(assert) {
		//Arrange
		this.oChart = new BulletMicroChart("bullet-chart", {
			size: Size.M,
			isResponsive: false
		}).placeAt("qunit-fixture");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.notOk(this.oChart.getIsResponsive(), "Chart is not in Responsive mode for size M");
		assert.equal(this.oChart.getSize(), "M", "Chart has Size M'");
	});

	QUnit.module("Test chart data calculation", {
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Actual value is a maximal one", function(assert) {
		this.oChart = new BulletMicroChart( {
			size: Size.L,
			scale: "M",
			actual: { value: 120, color: ValueColor.Good},
			targetValue: 60,
			forecastValue: 112,
			minValue: 0,
			maxValue: 120,
			thresholds: [
				{ value: 0, color: ValueColor.Error },
				{ value: 1, color: ValueColor.Critical },
				{ value: 2, color: ValueColor.Critical },
				{ value: 3, color: ValueColor.Error }
			]
		});

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.actualValuePct, 98.05, "Actual value should take 98.05%");
		assert.equal(aResult.targetValuePct, 49, "Target value should be at 49%");
		assert.equal(aResult.forecastValuePct, 91.47, "Forecast value should be at 91.47%");
		assert.equal(aResult.thresholdsPct[0].valuePct, 0, "Threshold should be at 0%");
		assert.equal(aResult.thresholdsPct[1].valuePct, 0.82, "Threshold should be at 0.82%");
		assert.equal(aResult.thresholdsPct[2].valuePct, 1.63, "Threshold should be at 1.63%");
		assert.equal(aResult.thresholdsPct[3].valuePct, 2.45, "Threshold should be at 2.45%");
	});

	QUnit.test("Threshold value is a maximal one", function(assert) {
		this.oChart = new BulletMicroChart( {
			actual: { value: -130, color: ValueColor.Good},
			targetValue: -65,
			forecastValue: -125,
			thresholds: [
				{ value: 0, color: ValueColor.Error },
				{ value: -75, color: ValueColor.Critical },
				{ value: -80, color: ValueColor.Critical },
				{ value: -85, color: ValueColor.Error }
			]
		});

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.actualValuePct, 0.05, "Actual value should be at 0.05%");
		assert.equal(aResult.targetValuePct, 49, "Target value should take 49%");
		assert.equal(aResult.forecastValuePct, 3.77, "Forecast value should be at 3.77%");
		assert.equal(aResult.thresholdsPct[0].valuePct, 98, "Threshold should be at 98%");
		assert.equal(aResult.thresholdsPct[1].valuePct, 41.46, "Threshold should be at 41.46%");
		assert.equal(aResult.thresholdsPct[2].valuePct, 37.69, "Threshold should be at 37.69%");
		assert.equal(aResult.thresholdsPct[3].valuePct, 33.92, "Threshold should be at 33.92%");
	});

	QUnit.test("Min/Max values affect scale", function(assert) {
		this.oChart = new BulletMicroChart( {
			actual: { value: 26, color: ValueColor.Good},
			targetValue: 29,
			forecastValue: 25,
			minValue: 0,
			maxValue: 50,
			showValueMarker: true,
			thresholds: [
				{ value: 21, color: ValueColor.Error },
				{ value: 25, color: ValueColor.Critical },
				{ value: 28, color: ValueColor.Critical },
				{ value: 29, color: ValueColor.Error }
			]
		});

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.actualValuePct, 51.01, "Actual value should be at 51.01%");
		assert.equal(aResult.targetValuePct, 56.84, "Target value should take 56.84%");
		assert.equal(aResult.forecastValuePct, 49, "Forecast value should be at 49%");
		assert.equal(aResult.thresholdsPct[0].valuePct, 41.16, "Threshold should be at 41.16%");
		assert.equal(aResult.thresholdsPct[1].valuePct, 49, "Threshold should be at 49%");
		assert.equal(aResult.thresholdsPct[2].valuePct, 54.88, "Threshold should be at 54.88%");
		assert.equal(aResult.thresholdsPct[3].valuePct, 56.84, "Threshold should be at 56.84%");
	});

	QUnit.test("Actual and target values are 0 in delta mode", function(assert) {
		this.oChart = new BulletMicroChart( {
			actual: { value: 0, color: ValueColor.Good },
			targetValue: 0,
			showValueMarker: true,
			showDeltaValue: true,
			scale: "%",
			mode: BulletMicroChartModeType.Delta,
			thresholds: [
				{ value: -20, color: ValueColor.Error },
				{ value: -10, color: ValueColor.Critical },
				{ value: 10, color: ValueColor.Critical },
				{ value: 20, color: ValueColor.Error }
			]
		});

		var oResult = this.oChart._calculateChartData();

		assert.equal(oResult.actualValuePct, 49.05, "Actual value should be at 49.05%");
		assert.equal(oResult.targetValuePct, 49, "Target value should take 49%");
		assert.equal(oResult.forecastValuePct, 0, "Forecast value should be at 0%");
		assert.equal(oResult.thresholdsPct[0].valuePct, 0.0, "Threshold should be at 0.0%");
		assert.equal(oResult.thresholdsPct[1].valuePct, 24.50, "Threshold should be at 24.50%");
		assert.equal(oResult.thresholdsPct[2].valuePct, 73.50, "Threshold should be at 73.50%");
		assert.equal(oResult.thresholdsPct[3].valuePct, 98.00, "Threshold should be at 98.00%");
	});

	QUnit.module("Responsiveness", {
		beforeEach: function() {
			this._oBC = new BulletMicroChart("bullet-chart", {
				isResponsive: true,
				scale: "M",
				actual: { value: 120, color: ValueColor.Good},
				targetValue: 100,
				forecastValue: 110,
				minValue: 0,
				maxValue: 120,
				showValueMarker: true,
				thresholds: [
					{ value: 0, color: ValueColor.Error },
					{ value: 50, color: ValueColor.Critical },
					{ value: 150, color: ValueColor.Critical },
					{ value: 200, color: ValueColor.Error }
				]
			});
			this._oFB = new FlexBox("cc-fb", {
				renderType: "Bare",
				items: [this._oBC]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this._oFB.destroy();
			this._oBC.destroy();
		}
	});

	QUnit.test("No special look added when big enough", function(assert) {
		//Arrange
		this._oFB.setWidth("5.5rem");
		this._oFB.setHeight("5.5rem");
		this._oFB.rerender();

		//Assert
		assert.notOk(this._oBC.$().hasClass("sapSuiteBMCSmallLook"), true, "No CSS class for small look");
		assert.notOk(this._oBC.$().hasClass("sapSuiteBMCExtraSmallLook"), "No CSS class for extra small look");
	});

	QUnit.test("Small look used when below threshold", function(assert) {
		//Arrange
		this._oFB.setWidth("5.5rem");
		this._oFB.setHeight("3.5rem");
		this._oFB.rerender();

		//Assert
		assert.ok(this._oBC.$().hasClass("sapSuiteBMCSmallLook"), "Added CSS class for small look");
	});

	QUnit.test("Extra small look used when below threshold", function(assert) {
		//Arrange
		this._oFB.setWidth("5.5rem");
		this._oFB.setHeight("1.125rem");
		this._oFB.rerender();

		//Assert
		assert.ok(this._oBC.$().hasClass("sapSuiteBMCExtraSmallLook"), "Added CSS class for extra small look");
	});

	QUnit.test("Vertical responsiveness: disappearance of labels", function(assert) {
		//Arrange
		this._oFB.setWidth("8rem");
		this._oFB.setHeight("3rem");
		this._oFB.rerender();

		//Assert
		assert.equal(this._oBC.$().hasClass("sapSuiteBMCNoLabels"), true, "Added CSS class that signals that labels should be hidden");
		assert.equal(this._oBC.$().find(".sapSuiteBMCTopLabel").css("display"),"none", "Top label is hidden");
		assert.equal(this._oBC.$().find(".sapSuiteBMCBottomLabel").css("display"),"none", "Bottom label is hidden");
	});

	QUnit.test("Vertical responsiveness: font sizes", function(assert) {
		//Arrange
		this._oFB.setWidth("12rem");
		this._oFB.setHeight("7.5rem");
		this._oFB.rerender();
		var bigFont = parseFloat(this._oBC.$().find(".sapSuiteBMCTopLabel").css("font-size"));
		this._oFB.setHeight("3.5rem");
		this._oFB.rerender();
		var smallFont = parseFloat(this._oBC.$().find(".sapSuiteBMCTopLabel").css("font-size"));

		//Assert
		assert.equal(this._oBC.$().hasClass("sapSuiteBMCSmallFont"), true, "Added CSS class that commands to use small fonts");
		assert.ok(smallFont < bigFont, "Font size decrease had actually occured");
	});

	QUnit.test("Vertical responsiveness: height of bar is constant in small look range", function(assert) {
		this._oFB.setWidth("12rem");
		this._oFB.setHeight("55px");
		this._oFB.rerender();
		var iBarHeight = parseFloat(this._oBC.$().find(".sapSuiteBMCBar").css("height"));
		assert.equal(iBarHeight, 12, "Bar has height 12px");

		this._oFB.setHeight("40px");
		this._oFB.rerender();
		iBarHeight = parseFloat(this._oBC.$().find(".sapSuiteBMCBar").css("height"));
		assert.equal(iBarHeight, 12, "Bar has height 12px");

		this._oFB.setHeight("19px");
		this._oFB.rerender();
		iBarHeight = parseFloat(this._oBC.$().find(".sapSuiteBMCBar").css("height"));
		assert.equal(iBarHeight, 12, "Bar has height 12px");

		this._oFB.setHeight("18px");
		this._oFB.rerender();
		iBarHeight = parseFloat(this._oBC.$().find(".sapSuiteBMCBar").css("height"));
		assert.equal(iBarHeight, 12, "Bar has height 12px");
	});


	QUnit.skip("Vertical responsiveness: chart disappears", function(assert) {
		//Arrange
		this._oFB.setWidth("8rem");
		this._oFB.setHeight("1rem");
		this._oFB.rerender();

		//Assert
		assert.equal(this._oBC.$().css("display"),"none", "Last stage of vertical responsiveness: chart disappeared");
	});

	QUnit.skip("Horizontal responsiveness: cannot display labels in medium font, try in small font", function(assert) {
		//Arrange
		this._oFB.setWidth("2.5rem");
		this._oFB.setHeight("8.5rem");
		this._oFB.rerender();

		//Assert
		assert.equal(this._oBC.$().css("display"),"block", "Width is not small enough to make chart disappear");
		assert.equal(this._oBC.$().hasClass("sapSuiteBMCSmallFont"), true, "Added CSS class that commands to use small fonts");
	});


	QUnit.skip("Horizontal responsiveness: chart disappears", function(assert) {
		//Arrange
		this._oFB.setWidth("2rem");
		this._oFB.setHeight("8.5rem");
		this._oFB.rerender();

		//Assert
		assert.equal(this._oBC.$().css("display"),"none", "Last stage of horizontal responsiveness: chart disappeared");
	});

	QUnit.test("Horizontal responsiveness: labels hidden when truncated", function(assert) {
		//Arrange
		this._oFB.setWidth("12rem");
		this._oFB.setHeight("8.5rem");
		this._oBC.setTargetValue(123456789);
		this._oFB.rerender();

		assert.equal(this._oBC.$().find(".sapSuiteBMCTopLabel").css("display"),"block", "Label is shown when there is enough space");


		this._oFB.setWidth("4rem");
		this._oFB.rerender();

		assert.equal(this._oBC.$().find(".sapSuiteBMCTopLabel").css("display"),"none", "Label is hidden when truncated");
	});

	QUnit.test("Horizontal responsiveness: thresholds visible when space", function(assert) {
		//Arrange
		this._oFB.setWidth("12rem");
		this._oFB.setHeight("8.5rem");
		this._oFB.rerender();

		assert.ok(!this._oBC.$().hasClass("sapSuiteBMCThresholdHidden"), "Class is not set");
		assert.equal(this._oBC.$().find(".sapSuiteBMCThreshold").css("visibility"),"visible", "Threshold is visible");
		assert.equal(this._oBC.$().find(".sapSuiteBMCDiamond").css("visibility"),"visible", "Diamond is visible");
	});

	QUnit.test("Horizontal responsiveness: thresholds hidden when width < 96px", function(assert) {
		//Arrange
		this._oFB.setWidth("95px");
		this._oFB.setHeight("8.5rem");
		this._oFB.rerender();

		assert.ok(this._oBC.$().hasClass("sapSuiteBMCThresholdHidden"), "Class is set");
		assert.equal(this._oBC.$().find(".sapSuiteBMCThreshold").css("visibility"),"hidden", "Threshold is hidden");
		assert.equal(this._oBC.$().find(".sapSuiteBMCDiamond").css("visibility"),"hidden", "Diamond is hidden");
	});

	QUnit.module("Responsiveness adjustments for the use within GenericTile", {
		beforeEach: function() {
			this.oChart = new BulletMicroChart().addStyleClass("sapUiSmallMargin");
			this.oGenericTile = new GenericTile("generic-tile", {
				tileContent : new TileContent({
					content : this.oChart
				})
			});
		},
		afterEach: function() {
			this.oGenericTile.destroy();
		}
	});

	QUnit.skip("The MicroChart becomes responsive if it is used in a Generic Tile", function(assert) {
		//Act
		this.oChart.onBeforeRendering();
		//Assert
		assert.ok(this.oChart.getIsResponsive(), "The chart became responsive");
	});

	QUnit.skip("The standard margins are handled if chart is used in a Generic Tile", function(assert) {
		//Arrange
		var oRemoveMarginCallback = sinon.spy(sap.suite.ui.microchart, "_removeStandardMargins");
		//Act
		this.oChart.onBeforeRendering();
		//Assert
		assert.ok(oRemoveMarginCallback.called, "Library function that removes standard margins has been called.");
	});
	QUnit.module("Tooltip behavior", {
		beforeEach: function() {
			this.oChart = new BulletMicroChart();
			this.oModel = new JSONModel({
				size : "M",
				Tooltip : "Custom Tooltip"
			});
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oModel.destroy();
		}
	});

	QUnit.test("Default value for tooltip", function(assert) {
		//Arrange
		//Act
		//Assert
		assert.deepEqual(this.oChart.getTooltip(), "((AltText))", "Default value set correctly");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Model exists, tooltip is not bound", function(assert) {
		//Arrange
		//Act
		this.oChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.deepEqual(this.oChart.getTooltip(), "((AltText))", "Default value set correctly");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Model exists, control is bound, tooltip is not bound", function(assert) {
		//Arrange
		this.oChart.setAggregation("tooltip", new TooltipBase({
			text : "{/Tooltip}"
		}));
		//Act
		this.oChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(this.oChart.getTooltip(), "Tooltip exists");
		assert.deepEqual(this.oChart.getTooltip().getText(), "Custom Tooltip", "Tooltip exists");
		assert.ok(!this.oChart.isBound("tooltip"), "Tooltip is not bound");
	});

	QUnit.test("Model exists, control is bound", function(assert) {
		//Arrange
		var oModel = new JSONModel({
			data : [{
				size : "M",
				Tooltip : "Custom Tooltip"
			}]
		});
		var oTable = new Table({
			items : {
				path : "/data",
				template : new ColumnListItem({
					cells : [new BulletMicroChart({
						forecastValue: 10,
						targetValue: 15,
						minValue: 1,
						maxValue: 5
					})]
				})
			}
		}).setModel(oModel);
		//Act
		sap.ui.getCore().applyChanges();
		var oChart = oTable.getItems()[0].getCells()[0];
		//Assert
		assert.deepEqual(oChart.getTooltip(), "((AltText))", "Binding is empty, so tooltip aggregation is also empty.");
		assert.ok(oChart.getTooltip_AsString(), "Tooltip is empty, default tooltip as string appears");
		assert.notOk(oChart.isBound("tooltip"), "Tooltip is bound");
		//Cleanup
		oTable.destroy();
		oModel.destroy();
	});

	QUnit.module("Execution of functions onAfterRendering", {
		beforeEach: function() {
			this.oChart = new BulletMicroChart().placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			sinon.spy(microchartLibrary, "_checkControlIsVisible");
		},
		afterEach: function() {
			microchartLibrary._checkControlIsVisible.restore();
			this.oChart.destroy();
		}
	});

	QUnit.test("Visibility check", function(assert) {
		//Act
		this.oChart.onAfterRendering();
		//Assert
		assert.ok(microchartLibrary._checkControlIsVisible.calledOnce, "Method _checkControlIsVisible has been called once.");
	});

	QUnit.module("Title attribute is added and removed when mouse enters and leaves", {
		beforeEach: function() {
			this.oChart = new BulletMicroChart("bullet-chart", {
				isResponsive: true,
				scale: "M",
				actual: { value: 120, color: ValueColor.Good },
				targetValue: 100,
				forecastValue: 110,
				minValue: 0,
				maxValue: 120,
				showValueMarker: true,
				thresholds: [
					{ value: 0, color: ValueColor.Error },
					{ value: 50, color: ValueColor.Critical },
					{ value: 150, color: ValueColor.Critical },
					{ value: 200, color: ValueColor.Error }
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Aria-label only includes the standard chart information", function(assert) {
		// Arrange
		var sAriaLabel = this.oChart.getTooltip_AsString();
		this.oChart.setTooltip("This is a tooltip");
		// Act
		sap.ui.getCore().applyChanges();
		// Assert
		assert.equal(sAriaLabel, sAriaLabel, "The aria-label includes only chart information");
		assert.equal(this.oChart.$().attr("title"), null, "The title attribute is not rendered");
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

	QUnit.test("Tooltip is shown when mouse enters chart", function(assert) {
		// Arrange
		this.oChart.setTooltip("This is a tooltip");
		sap.ui.getCore().applyChanges();
		// Act
		this.oChart.$().trigger("mouseenter");
		// Assert
		assert.equal(this.oChart.$().attr("title"), this.oChart.getTooltip_AsString(), "The title attribute is added when mouse enters the chart");
	});

	QUnit.test("Tooltip is removed when mouse leaves chart", function(assert) {
		// Arrange
		this.oChart.setTooltip("This is a tooltip");
		sap.ui.getCore().applyChanges();
		// Act
		this.oChart.$().trigger("mouseenter");
		this.oChart.$().trigger("mouseleave");
		// Assert
		assert.equal(this.oChart.$().attr("title"), null, "The title attribute is removed when mouse leaves the chart");
	});

	QUnit.module("Control provides accessibility information", {
		beforeEach : function() {
			this.oChart = new BulletMicroChart();
			this.oChart.setAggregation("tooltip", "BulletMicroChart");
		},
		afterEach : function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method getAccessibilityInfo returns correct information", function(assert) {
		// Arrange
		var oExpectedAccessibilityInformation = {
			description: "BulletMicroChart",
			type: this.oChart._getAccessibilityControlType()
		};

		// Act
		var oAccessibilityInformation = this.oChart.getAccessibilityInfo();

		// Assert
		assert.deepEqual(oAccessibilityInformation, oExpectedAccessibilityInformation, "An object with the correct properties has been returned.");
	});

	QUnit.module("Rendering tests for no data placeholder", {
		beforeEach: function() {
			this.oChart = new BulletMicroChart("bulletMicroChart").placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("No data rendered when no actual given", function(assert) {
		//Arrange
		//Act
		//Assert
		assert.ok(jQuery.sap.domById("bulletMicroChart"), "Control was rendered");
		var a$NoDataElement = jQuery.sap.byId(this.oChart.getId()).find(".sapSuiteUiMicroChartNoData");
		assert.equal(a$NoDataElement.length, 1, "No data placeholder shold be rendered");
	});

	QUnit.test("No data in aria-label", function(assert) {
		//Arrange
		//Act
		//Assert
		assert.equal(this.oChart.$().attr("role"), "img", "chart aria role was rendered successfully");
		assert.ok(this.oChart.$().attr("aria-label").indexOf("No data") > -1, "The aria-label includes no data");
	});

	TestUtils.initSizeModule(BulletMicroChart, "sapSuiteBMCSize");
});

