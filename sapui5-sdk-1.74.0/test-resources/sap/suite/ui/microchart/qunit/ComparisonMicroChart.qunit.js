/*global QUnit, sinon */
sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/microchart/ComparisonMicroChart",
	"sap/suite/ui/microchart/ComparisonMicroChartData",
	"sap/m/Size",
	"sap/suite/ui/microchart/ComparisonMicroChartViewType",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/m/ColumnListItem",
	"sap/m/Table",
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/m/FlexBox",
	"sap/ui/core/TooltipBase",
	"sap/suite/ui/microchart/library",
	"./TestUtils"
], function (jQuery, ComparisonMicroChart, ComparisonMicroChartData, Size, ComparisonMicroChartViewType, Device, JSONModel,
			 ColumnListItem, Table, GenericTile, TileContent, FlexBox, TooltipBase, microchartLibrary, TestUtils) {
	"use strict";

	jQuery.sap.initMobile();


	var fnCallback, fnBarCallback;

	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function() {
			this.fnStubIsInitialized = sinon.stub(sap.ui.getCore(), "isInitialized");
			this.fnSpyAttachInit = sinon.spy(sap.ui.getCore(), "attachInit");
			this.fnSpyHandleCoreInitialized = sinon.spy(ComparisonMicroChart.prototype, "_handleCoreInitialized");
			this.fnStubThemeApplied = sinon.stub(sap.ui.getCore(), "isThemeApplied");
			this.fnStubAttachThemeApplied = sinon.stub(sap.ui.getCore(), "attachThemeChanged").callsFake(function(fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.fnSpyHandleThemeApplied = sinon.spy(ComparisonMicroChart.prototype, "_handleThemeApplied");
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

	QUnit.test("Core not loaded and theme not loaded", function(assert) {
		//Arrange
		this.fnStubIsInitialized.returns(false);
		this.fnStubThemeApplied.returns(false);

		//Act
		var oChart = new ComparisonMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.fnSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core not loaded and theme loaded", function(assert) {
		//Arrange
		this.fnStubIsInitialized.returns(false);
		this.fnStubThemeApplied.returns(true);

		//Act
		var oChart = new ComparisonMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.notCalled, "Method Core.attachThemeChanged has not been called.");
		assert.ok(this.fnSpyHandleThemeApplied.notCalled, "Method _handleThemeApplied has not been called.");
	});

	QUnit.test("Core loaded and theme not loaded", function(assert) {
		//Arrange
		this.fnStubIsInitialized.returns(true);
		this.fnStubThemeApplied.returns(false);

		//Act
		var oChart = new ComparisonMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.fnSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core loaded and theme loaded", function(assert) {
		//Arrange
		this.fnStubIsInitialized.returns(true);
		this.fnStubThemeApplied.returns(true);

		//Act
		var oChart = new ComparisonMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.notCalled, "Method Core.attachThemeChanged has not been called.");
		assert.ok(this.fnSpyHandleThemeApplied.notCalled, "Method _handleThemeApplied has not been called.");
	});

	QUnit.module("Handling of sap.m.Size.Responsive", {
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Setting size property to sap.m.Size.Responsive leads to isResponsive === true", function(assert) {
		//Arrange
		this.oChart = new ComparisonMicroChart({
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
		this.oChart = new ComparisonMicroChart();
		//Act
		var oResult = this.oChart.setSize(Size.Responsive);
		//Assert
		assert.deepEqual(oResult, this.oChart, "Control instance returned");
	});

	QUnit.test("setSize does nothing in case of same value", function(assert) {
		//Arrange
		this.oChart = new ComparisonMicroChart({
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
		this.oChart = new ComparisonMicroChart({
			size: Size.Responsive
		}).placeAt("qunit-fixture");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(this.oChart.getIsResponsive(), "Chart is in Responsive mode for size Responsive");
	});

	QUnit.test("sap.m.Size.Responsive changed to sap.m.Size.L leads to isResponsive === false", function(assert) {
		//Arrange
		this.oChart = new ComparisonMicroChart({
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

	QUnit.module("Properties", {
		beforeEach : function() {
			this.oChart = new ComparisonMicroChart("chart", {
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Default Property Values", function(assert) {
		assert.equal(this.oChart.getSize(), Size.Auto, "size is sap.m.Size.Auto");
		assert.equal(this.oChart.getScale(), "", "scale is ''");
		assert.equal(this.oChart.getView(), ComparisonMicroChartViewType.Normal, "view is Normal");
		assert.deepEqual(this.oChart.getColorPalette(), [], "colorPalette is []");
		assert.equal(this.oChart.getShrinkable(), false, "shrinkable is false");
		assert.equal(this.oChart.getIsResponsive(), false, "isResponsive is false");
	});

	QUnit.module("Rendering tests - ComparisonMicroChart", {
		beforeEach: function() {
			this.oCC = new ComparisonMicroChart("comparison-chart", {
				size: "M",
				scale: "M",
				view: ComparisonMicroChartViewType.Normal,
				data: [
					new ComparisonMicroChartData({
						title: "Americas",
						value: 10,
						color: "Good",
						displayValue: "10M"
					}),
					new ComparisonMicroChartData({
						title: "EMEA",
						value: 20,
						color: "Critical",
						displayValue: "18M"
					}),
					new ComparisonMicroChartData({
						title: "EMEA",
						value: 20,
						color: "Critical",
						displayValue: "18M"
					})
				],
				shrinkable: false,
				height: "400px"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oCC.destroy();
		}
	});

	QUnit.test("Comparison chart rendered.", function(assert) {
		assert.ok(jQuery.sap.domById("comparison-chart"), "Comparison chart was rendered successfully");
		assert.equal(jQuery.sap.byId("comparison-chart-chart-item-0-title").text(), "Americas", "Title was rendered successfully");
		assert.equal(jQuery.sap.byId("comparison-chart-chart-item-0-value").text(), "10MM", "Value was rendered successfully");
	});

	QUnit.test("Tooltip with non-whitespace characters is rendered", function(assert) {
		// Arrange
		var sTooltip = "Not empty";
		this.oCC.setTooltip(sTooltip);
		// Act
		this.oCC._addTitleAttribute();
		// Assert
		assert.equal(this.oCC.$().attr("title"),"Not empty" + this.oCC._getAltSubText(), "Non-whitespace toltip has been rendered");
	});

	QUnit.test("Function _addTitleAttribute adds the tooltip correctly in the fixed size chart", function(assert) {
		//Arrange
		var sTooltip = "The Tooltip";
		this.oCC.setTooltip(sTooltip);
		sap.ui.getCore().applyChanges();
		// Act
		this.oCC._addTitleAttribute();
		//Assert
		assert.equal(this.oCC.$().attr("title"), sTooltip + this.oCC._getAltSubText(), "The tooltip has been added to the correct DOM element");
	});

	QUnit.test("Function _removeTitleAttribute removes the tooltip correctly from the fixed size chart", function(assert) {
		//Arrange
		var sTooltip = "The Tooltip";
		this.oCC.setTooltip(sTooltip);
		sap.ui.getCore().applyChanges();
		this.oCC._addTitleAttribute();
		// Act
		this.oCC._removeTitleAttribute();
		//Assert
		assert.ok(!this.oCC.$().attr("title"), "The tooltip has been removed from the correct DOM element");
	});

	QUnit.test("Function _addTitleAttribute adds the tooltip correctly in the responsive chart", function(assert) {
		//Arrange
		var sTooltip = "The Tooltip";
		this.oCC.setTooltip(sTooltip);
		this.oCC.setIsResponsive(true);
		sap.ui.getCore().applyChanges();
		// Act
		this.oCC._addTitleAttribute();
		//Assert
		assert.equal(this.oCC.$().find(".sapSuiteCpMCVerticalAlignmentContainer").attr("title"), sTooltip + this.oCC._getAltSubText(), "Tooltip has been added");
	});

	QUnit.test("Function _removeTitleAttribute removes the tooltip correctly from the responsive chart", function(assert) {
		//Arrange
		var sTooltip = "The Tooltip";
		this.oCC.setTooltip(sTooltip);
		this.oCC.setIsResponsive(true);
		sap.ui.getCore().applyChanges();
		this.oCC._addTitleAttribute();
		// Act
		this.oCC._removeTitleAttribute();
		//Assert
		assert.ok(!this.oCC.$().find(".sapSuiteCpMCVerticalAlignmentContainer").attr("title"), "Tooltip has been removed");
	});

	QUnit.test("Tooltip of the bar is used in the tooltip of the chart", function(assert) {
		var oSpyGetBarAltText = sinon.spy(this.oCC, "_getBarAltText");
		// Act
		this.oCC.getTooltip_AsString();
		// Assert
		assert.ok(oSpyGetBarAltText.callCount, this.oCC.getData().length, "Function _getBarAltText called for each bar of the chart");
	});

	QUnit.test("Function _getBarAltText returns correct default tooltip", function(assert) {
		// Act
		var oBar = this.oCC.getData()[0];
		var sMeaning = this.oCC._getLocalizedColorMeaning(oBar.getColor());
		var sDefaultBarText = oBar.getTitle() + " " + oBar.getDisplayValue() + this.oCC.getScale() + " " + sMeaning;
		// Act
		var sBarTooltipText = this.oCC._getBarAltText(0);
		// Assert
		assert.ok(sBarTooltipText, sDefaultBarText, "Default tooltip in correct format has been returned");
	});

	QUnit.test("Function _getBarAltText returns value if tooltip has been explicitly set on bar", function(assert) {
		// Act
		var oBar = this.oCC.getData()[0];
		var sBarTooltip = "The Tooltip of a bar";
		oBar.setTooltip(sBarTooltip);
		// Act
		var sBarTooltipText = this.oCC._getBarAltText(0);
		// Assert
		assert.ok(sBarTooltipText, sBarTooltip, "_calculateBarContainerHeight is called");
	});

	QUnit.test("If the tooltip of the bar is set to whitespace, then no tooltip is displayed on the bar level", function(assert) {
		// Arrange
		var oBar = this.oCC.getData()[1];
		var sBarTooltip = "    ";
		oBar.setTooltip(sBarTooltip);
		oBar.attachEvent("press", {},function(){} );
		// Act
		sap.ui.getCore().applyChanges();
		var $Bar = jQuery(oBar.getParent().$().find(".sapSuiteCpMCChartBar")[1]);
		// Assert
		assert.equal($Bar.attr("title"), "", "The tooltip on the bar level is suppressed");
	});

	QUnit.test("The bar with empty tooltip will not result in an extra line in the composite tooltip of the chart", function(assert) {
		// Arrange
		var oBar = this.oCC.getData()[1];
		var sBarTooltip = "";
		oBar.setTooltip(sBarTooltip);
		// Act
		var iCountNewlines = this.oCC.getTooltip_AsString().match(/\n/g).length;
		// Assert
		assert.equal(iCountNewlines, 2, "Exactly two newlines has been rendered: before the last entry of the composite tooltip");
	});

	QUnit.test("Chart item height calculation for non-Firefox browser", function(assert) {
		// Arrange
		var iHeight = parseFloat(this.oCC.$().find(".sapSuiteCpMCVerticalAlignmentContainer").css("height"));
		var iBarCount = this.oCC.getData().length;
		var aBarContainers = this.oCC.$().find(".sapSuiteCpMCChartItem");
		var iExpectedBarContainerHeight = Math.round(iHeight / iBarCount) + "px";
		// Act
		// Assert
		var iActualBarContainerHeight = Math.round(parseFloat(aBarContainers.css("height")) + parseFloat(aBarContainers.css("margin-bottom"))) + "px";
		assert.equal(iActualBarContainerHeight, iExpectedBarContainerHeight, "Bar container item height is calculated as alignment container height / bar count");
	});

	QUnit.skip("_adjustBars calls _calculateBarContainerHeight method when the bar count is not 0", function(assert) {
		// Arrange
		var iHeight = parseFloat(this.oCC.$().find(".sapSuiteCpMCVerticalAlignmentContainer").css("height"));
		var iBarCount = this.oCC.getData().length;

		var spyCalculateBarContainerHeight = sinon.spy(this.oCC, "_calculateBarContainerHeight");
		// Act
		this.oCC._adjustBars();
		// Assert
		assert.ok(spyCalculateBarContainerHeight.called, "_calculateBarContainerHeight is called");
		assert.ok(spyCalculateBarContainerHeight.calledWith(sinon.match(Device.browser.firefox), iHeight, iBarCount), "_calculateBarContainerHeight is called with flag for Firefox, height, bar count");
	});

	QUnit.skip("_adjustBars doesn't call _calculateBarContainerHeight method when the bar count is 0", function(assert) {
		sinon.stub(this.oCC, "getData").returns([]);
		var spyCalculateBarContainerHeight = sinon.spy(this.oCC, "_calculateBarContainerHeight");
		// Act
		this.oCC._adjustBars();
		// Assert
		assert.ok(spyCalculateBarContainerHeight.notCalled, "_calculateBarContainerHeight is not called");
	});

	QUnit.skip("_calculateBarContainerHeight calculates the height as individual item height sum for firefox, non-responsive, normal mode", function(assert) {
		// Arrange
		var bFirefox = true;
		var bResponsive = false;
		var sView = "Normal";
		var iHeight = 13;
		var iBarCount = 2;
		var iHeaderHeight = this.oCC.$().find(".sapSuiteCpMCChartItemHeader").outerHeight(true);
		var iBarHeight = this.oCC.$().find(".sapSuiteCpMCChartBar").outerHeight(true);
		var iExpectedHeight = iHeaderHeight + iBarHeight;

		sinon.stub(this.oCC, "getIsResponsive").returns(bResponsive);
		sinon.stub(this.oCC, "getView").returns(sView);
		// Act
		var iActualHeight = this.oCC._calculateBarContainerHeight(bFirefox, iHeight, iBarCount);
		// Assert
		assert.equal(iActualHeight, iExpectedHeight, "Height is calculated correctly");
	});

	QUnit.skip("_calculateBarContainerHeight calculates the height as a height barcount division for non-firefox, responsive, wide mode", function(assert) {
		// Arrange
		var bFirefox = false;
		var iHeight = 13;
		var iBarCount = 2;
		var iExpectedHeight = iHeight / iBarCount;
		// Act
		var iActualHeight = this.oCC._calculateBarContainerHeight(bFirefox, iHeight, iBarCount);
		// Assert
		assert.equal(iActualHeight, iExpectedHeight, "Height is calculated correctly");
	});

	QUnit.module("Test chart data calculation", {
		beforeEach: function(assert) {
			this.oChart = new ComparisonMicroChart("test-chart");
		},
		afterEach: function(assert) {
			this.oChart.destroy();
		}
	});

	QUnit.test("One bar test", function(assert) {
		var oChartData = new ComparisonMicroChartData({
			value: 10
		});
		this.oChart.addData(oChartData);

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.length, 1, "One bar calculated");
		assert.equal(aResult[0].value, 100, "One bar takes 100%");
		assert.equal(aResult[0].negativeNoValue, 0, "One bar takes 100%");
		assert.equal(aResult[0].positiveNoValue, 0, "One bar takes 100%");
	});

	QUnit.test("Two positive bars test", function(assert) {
		this.oChart.addData(new ComparisonMicroChartData({
			value: 10
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: 20
		}));

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.length, 2, "Two bars calculated");

		assert.equal(aResult[0].value, 50, "First bar takes 50%");
		assert.equal(aResult[0].negativeNoValue, 0, "First bar takes 50%");
		assert.equal(aResult[0].positiveNoValue, 50, "First bar takes 50%");

		assert.equal(aResult[1].value, 100, "Second bar takes 100%");
		assert.equal(aResult[1].negativeNoValue, 0, "Second bar takes 100%");
		assert.equal(aResult[1].positiveNoValue, 0, "Second bar takes 100%");
	});

	QUnit.test("Two positive and one negative bars test", function(assert) {
		this.oChart.addData(new ComparisonMicroChartData({
			value: 20
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: 40
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: -20
		}));

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.length, 3, "Three bars calculated");

		assert.equal(aResult[0].value, 33, "First bar takes 33%");
		assert.equal(aResult[0].negativeNoValue, 33, "First bar takes 33%");
		assert.equal(aResult[0].positiveNoValue, 34, "First bar takes 33%");

		assert.equal(aResult[1].value, 67, "Second bar takes 67%");
		assert.equal(aResult[1].negativeNoValue, 33, "Second bar takes 67%");
		assert.equal(aResult[1].positiveNoValue, 0, "Second bar takes 67%");

		assert.equal(aResult[2].value, 33, "Third bar takes -33%");
		assert.equal(aResult[2].negativeNoValue, 0, "Third bar takes -33%");
		assert.equal(aResult[2].positiveNoValue, 67, "Third bar takes -33%");
	});

	QUnit.test("More than three bars", function(assert) {
		this.oChart.addData(new ComparisonMicroChartData({
			value: 20
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: 40
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: -20
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: 50
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: -80
		}));

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.length, 5, "Five bars calculated");

		assert.equal(aResult[0].value, 15, "First bar takes 15%");
		assert.equal(aResult[0].negativeNoValue, 62, "First bar takes 62%");
		assert.equal(aResult[0].positiveNoValue, 23, "First bar takes 23%");

		assert.equal(aResult[1].value, 31, "Second bar takes 31%");
		assert.equal(aResult[1].negativeNoValue, 62, "Second bar takes 62%");
		assert.equal(aResult[1].positiveNoValue, 7, "Second bar takes 7%");

		assert.equal(aResult[2].value, 15, "Third bar takes 15%");
		assert.equal(aResult[2].negativeNoValue, 47, "Third bar takes 47%");
		assert.equal(aResult[2].positiveNoValue, 38, "Third bar takes 38%");
	});

	QUnit.test("Zero value handled", function(assert) {
		this.oChart.addData(new ComparisonMicroChartData({
			value: 20
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: 0
		}));

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.length, 2, "Two bars calculated");

		assert.equal(aResult[0].value, 100, "First bar takes 100%");
		assert.equal(aResult[0].negativeNoValue, 0, "First bar takes 100%");
		assert.equal(aResult[0].positiveNoValue, 0, "First bar takes 100%");

		assert.equal(aResult[1].value, 0, "Second bar takes 0");
		assert.equal(aResult[1].negativeNoValue, 0, "Second bar takes 0");
		assert.equal(aResult[1].positiveNoValue, 100, "Second bar takes 0");
	});

	QUnit.test("Large positive value handled 1", function(assert) {
		this.oChart.addData(new ComparisonMicroChartData({
			value: 200000
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: 10
		}));

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.length, 2, "Two bars calculated");

		assert.equal(aResult[0].value, 100, "First bar takes 100%");
		assert.equal(aResult[0].negativeNoValue, 0, "First bar takes 100%");
		assert.equal(aResult[0].positiveNoValue, 0, "First bar takes 100%");

		assert.equal(aResult[1].value, 1, "Second bar takes 1%");
		assert.equal(aResult[1].negativeNoValue, 0, "Second bar takes 1%");
		assert.equal(aResult[1].positiveNoValue, 99, "Second bar takes 1%");
	});

	QUnit.test("Large positive value handled 2", function(assert) {
		this.oChart.addData(new ComparisonMicroChartData({
			value: 200000
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: 10
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: -20
		}));

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.length, 3, "Three bars calculated");

		assert.equal(aResult[0].value, 99, "First bar takes 99%");
		assert.equal(aResult[0].negativeNoValue, 1, "First bar takes 99%");
		assert.equal(aResult[0].positiveNoValue, 0, "First bar takes 99%");

		assert.equal(aResult[1].value, 1, "Second bar takes 1%");
		assert.equal(aResult[1].negativeNoValue, 1, "Second bar takes 1%");
		assert.equal(aResult[1].positiveNoValue, 98, "Second bar takes 1%");

		assert.equal(aResult[2].value, 1, "Third bar takes -1%");
		assert.equal(aResult[2].negativeNoValue, 0, "Third bar takes -1%");
		assert.equal(aResult[2].positiveNoValue, 99, "Third bar takes -1%");
	});

	QUnit.test("Large negative value handled 1", function(assert) {
		this.oChart.addData(new ComparisonMicroChartData({
			value: -200000
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: -20
		}));

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.length, 2, "Two bars calculated");

		assert.equal(aResult[0].value, 100, "First bar takes -100%");
		assert.equal(aResult[0].negativeNoValue, 0, "First bar takes -100%");
		assert.equal(aResult[0].positiveNoValue, 0, "First bar takes -100%");

		assert.equal(aResult[1].value, 1, "Second bar takes -1%");
		assert.equal(aResult[1].negativeNoValue, 99, "Second bar takes -1%");
		assert.equal(aResult[1].positiveNoValue, 0, "Second bar takes -1%");
	});

	QUnit.test("Large negative value handled 2", function(assert) {
		this.oChart.addData(new ComparisonMicroChartData({
			value: -200000
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: 10
		}));
		this.oChart.addData(new ComparisonMicroChartData({
			value: -20
		}));

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.length, 3, "Three bars calculated");

		assert.equal(aResult[0].value, 99, "First bar takes -99%");
		assert.equal(aResult[0].negativeNoValue, 0, "First bar takes -99%");
		assert.equal(aResult[0].positiveNoValue, 1, "First bar takes -99%");

		assert.equal(aResult[1].value, 1, "Second bar takes 1%");
		assert.equal(aResult[1].negativeNoValue, 99, "Second bar takes 1%");
		assert.equal(aResult[1].positiveNoValue, 0, "Second bar takes 1%");

		assert.equal(aResult[2].value, 1, "Third bar takes -1%");
		assert.equal(aResult[2].negativeNoValue, 98, "Third bar takes -1%");
		assert.equal(aResult[2].positiveNoValue, 1, "Third bar takes -1%");
	});

	QUnit.test("Min value chart test", function(assert) {
		var oChartData = new ComparisonMicroChartData({
			value: 10
		});
		this.oChart.addData(oChartData);
		this.oChart.setMinValue(-10);

		var aResult = this.oChart._calculateChartData();

		assert.equal(this.oChart.getMinValue(), -10, "Min value set correctly");
		assert.equal(aResult[0].value, 50, "Bar takes 50%");
		assert.equal(aResult[0].negativeNoValue, 50, "Bar takes 50% negative value");
		assert.equal(aResult[0].positiveNoValue, 0, "Bar takes 0% positive value");
	});

	QUnit.test("Max value chart test", function(assert) {
		var oChartData = new ComparisonMicroChartData({
			value: 10
		});
		this.oChart.addData(oChartData);
		this.oChart.setMaxValue(20);

		var aResult = this.oChart._calculateChartData();

		assert.equal(this.oChart.getMaxValue(), 20, "Max value set correctly");
		assert.equal(aResult[0].value, 50, "Bar takes 50%");
		assert.equal(aResult[0].negativeNoValue, 0, "Bar takes 0% negative value");
		assert.equal(aResult[0].positiveNoValue, 50, "Bar takes 50% positive value");
	});

	QUnit.test("Min/Max value chart test", function(assert) {
		var oChartData = new ComparisonMicroChartData({
			value: 10
		});
		this.oChart.addData(oChartData);
		this.oChart.setMinValue(-10);
		this.oChart.setMaxValue(20);

		var aResult = this.oChart._calculateChartData();

		assert.equal(this.oChart.getMinValue(), -10, "Min value set correctly");
		assert.equal(this.oChart.getMaxValue(), 20, "Max value set correctly");
		assert.equal(aResult[0].value, 33, "Bar takes 33%");
		assert.equal(aResult[0].negativeNoValue, 33, "Bar takes 33% negative value");
		assert.equal(aResult[0].positiveNoValue, 34, "Bar takes 34% positive value");
	});

	QUnit.test("Min/Max value chart test wrong values", function(assert) {
		var oChartData = new ComparisonMicroChartData({
			value: 10
		});
		this.oChart.addData(oChartData);
		this.oChart.setMinValue("-10,5%3");
		this.oChart.setMaxValue("20$");

		var aResult = this.oChart._calculateChartData();

		assert.ok(isNaN(this.oChart.getMinValue()), "Min value was not set because of wrong value");
		assert.ok(isNaN(this.oChart.getMaxValue()), "Max value was not set because of wrong value");
		assert.equal(aResult[0].value, 100, "Min and Max values were not set: bar takes 100%");
		assert.equal(aResult[0].negativeNoValue, 0, "Min and Max values were not set: no negative part");
		assert.equal(aResult[0].positiveNoValue, 0, "Min and Max values were not set: no positive part");
	});

	QUnit.test("Min/Max value chart test inside range values", function(assert) {
		var oChartData1 = new ComparisonMicroChartData({
			value: -30
		});
		var oChartData2 = new ComparisonMicroChartData({
			value: 70
		});
		this.oChart.addData(oChartData1);
		this.oChart.addData(oChartData2);
		this.oChart.setMinValue(-20);
		this.oChart.setMaxValue(30);

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult[0].negativeNoValue, 0, "Min value was ignored: no negative part for the lowest value");
		assert.equal(aResult[1].positiveNoValue, 0, "Max value was ignored: no positive part for the highest value");
	});

	QUnit.test("One bar test", function(assert) {
		var oChartData = new ComparisonMicroChartData({
			value: 10
		});
		this.oChart.addData(oChartData);

		var aResult = this.oChart._calculateChartData();

		assert.equal(aResult.length, 1, "One bar calculated");
		assert.equal(aResult[0].value, 100, "One bar takes 100%");
		assert.equal(aResult[0].negativeNoValue, 0, "One bar takes 100%");
		assert.equal(aResult[0].positiveNoValue, 0, "One bar takes 100%");
	});

	QUnit.test("Size M with isResponsive false sets Size M", function(assert) {
		//Arrange
		this.oChart.applySettings({
			size: "M",
			isResponsive: false
		});
		sap.ui.getCore().applyChanges();
		//Act
		//Assert
		assert.notOk(this.oChart.getIsResponsive(), "Chart is not in Responsive mode for size M");
		assert.equal(this.oChart.getSize(), "M", "Chart has Size M'");
	});

	QUnit.module("Press event tests - ComparisonMicroChart",  {
		beforeEach: function() {
			fnCallback = sinon.spy();
			fnBarCallback = sinon.spy();

			this.oCC = new ComparisonMicroChart("comparison-chart", {
				size: "M",
				scale: "M",
				view: ComparisonMicroChartViewType.Normal,
				data: [new ComparisonMicroChartData({
					title: "Americas",
					value: 10,
					color: "Good",
					displayValue: "10M",
					press: fnBarCallback
				}), new ComparisonMicroChartData({
					title: "EMEA",
					value: 20,
					color: "Critical",
					displayValue: "18M",
					press: fnBarCallback
				})],
				shrinkable: false,
				height: "400px",
				press: fnCallback
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oCC.destroy();
		}
	});

	QUnit.test("Test press behavior", function(assert) {
		jQuery(".sapSuiteCpMCChartContent").focus().click();
		sap.ui.getCore().applyChanges();
		assert.equal(fnCallback.callCount, 1, "Chart press handler called.");

		jQuery(".sapSuiteCpMCChartBar:eq(1)").focus().click();
		sap.ui.getCore().applyChanges();
		assert.equal(fnBarCallback.callCount, 1, "Bar press handler called.");

		this.oCC.detachPress(fnCallback);

		jQuery(".sapSuiteCpMCChartContent").focus().click();
		sap.ui.getCore().applyChanges();
		assert.equal(fnCallback.callCount, 1, "Chart press handler still has call count of 1 because the handler was detached.");

		this.oCC.attachPress(fnCallback);

		jQuery(".sapSuiteCpMCChartContent").focus().click();
		sap.ui.getCore().applyChanges();
		assert.ok(fnCallback.calledTwice, "Chart press handler now has call count of 2.");
	});

	QUnit.module("Clone the bar - sap.suite.ui.microchart.ComparisonMicroChart", {
		beforeEach: function() {
			this.oCC = new ComparisonMicroChart("comparison-chart", {
				size: "M",
				scale: "M",
				view: ComparisonMicroChartViewType.Normal,
				data: [new ComparisonMicroChartData({
					title: "Americas",
					value: 10,
					color: "Good",
					displayValue: "10M"
				}), new ComparisonMicroChartData({
					title: "EMEA",
					value: 20,
					color: "Critical",
					displayValue: "18M"
				})],
				shrinkable: false,
				height: "400px"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oCC.destroy();
		}
	});

	QUnit.test("Test clone the bar", function(assert) {
		assert.ok(this.oCC.getData().length === 2, "Two bars in Comparison Chart");
		this.oCC.addData(this.oCC.getData()[0].clone());
		sap.ui.getCore().applyChanges();
		assert.ok(this.oCC.getData().length === 3, "Three bars in Comparison Chart");
	});

	QUnit.module("Responsiveness tests - sap.suite.ui.microchart.ComparisonMicroChart", {
		beforeEach: function() {
			this._oCC = new ComparisonMicroChart("comparison-chart", {
				isResponsive: true,
				scale: "M",
				view: ComparisonMicroChartViewType.Normal,
				data: [new ComparisonMicroChartData({
					title: "Americas",
					value: 10,
					color: "Good",
					displayValue: "10M"
				}), new ComparisonMicroChartData({
					title: "EMEA",
					value: 20,
					color: "Critical",
					displayValue: "18M"
				}), new ComparisonMicroChartData({
					title: "APAC",
					value: -20,
					color: "Error",
					displayValue: "-20"
				})],
				shrinkable: false
			});
			this._oFB = new FlexBox("cc-fb", {
				items: [this._oCC],
				renderType: "Bare"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this._oFB.destroy();
			this._oCC.destroy();
		}
	});

	QUnit.skip("Vertical responsiveness: decreasing fonts", function(assert) {
		//Arrange
		this._oFB.setWidth("16rem");
		this._oFB.setHeight("8rem");
		this._oFB.rerender();
		var iMediumFont = parseInt(this._oCC.$().find(".sapSuiteCpMCChartItemValue").css("font-size"));
		this._oFB.setWidth("16rem");
		this._oFB.setHeight("3.5rem");
		this._oFB.rerender();
		var iSmallFont = parseInt(this._oCC.$().find(".sapSuiteCpMCChartItemValue").css("font-size"));

		//Assert
		assert.equal(this._oCC.$().hasClass("sapSuiteCpMCSmallFont"), true, "Added CSS class that commands to use small fonts");
		assert.equal(iSmallFont < iMediumFont, true, "Font size decrease had actually occured: " + iSmallFont + " < " + iMediumFont);
	});

	QUnit.skip("Vertical responsiveness: bars disappears", function(assert) {
		//Arrange
		this._oFB.setWidth("8rem");
		this._oFB.setHeight("3rem");
		this._oFB.rerender();

		//Assert
		assert.notEqual(this._oCC.$().css("display"),"none", "Chart has not disappeared yet");
		assert.equal(this._oCC.$().find(".sapSuiteCpMCChartBar>div").css("display"),"none", "Bars has disappeared");
	});

	QUnit.skip("Vertical responsiveness: chart disappears", function(assert) {
		//Arrange
		this._oFB.setWidth("8rem");
		this._oFB.setHeight("0.4rem");
		this._oFB.rerender();

		//Assert
		assert.equal(this._oCC.$().css("display"),"none", "Chart has disappeared");
	});
	QUnit.skip("Horizontal responsiveness: decreasing fonts", function(assert) {
		//Arrange
		this._oFB.setWidth("16rem");
		this._oFB.setHeight("8rem");
		this._oFB.rerender();
		var iMediumFont = parseInt(this._oCC.$().find(".sapSuiteCpMCChartItemValue").css("font-size"));
		this._oFB.setWidth("3rem");
		this._oFB.setHeight("8rem");
		this._oFB.rerender();
		var iSmallFont = parseInt(this._oCC.$().find(".sapSuiteCpMCChartItemValue").css("font-size"));

		//Assert
		assert.equal(this._oCC.$().hasClass("sapSuiteCpMCSmallFont"), true, "Added CSS class that commands to use small fonts");
		assert.equal(iSmallFont < iMediumFont, true, "Font size decrease had actually occured: " + iSmallFont + " < " + iMediumFont);
	});

	QUnit.skip("Horizontal responsiveness: chart disappears", function(assert) {
		//Arrange
		this._oFB.setWidth("1rem");
		this._oFB.setHeight("8rem");
		this._oFB.rerender();

		//Assert
		assert.equal(this._oCC.$().css("display"),"none", "Chart has disappeared");
	});

	QUnit.test("All items can be seen when enough space", function(assert) {
		//Arrange
		this._oFB.setWidth("10.5rem");
		this._oFB.setHeight("4.5rem");
		this._oFB.rerender();

		//Assert
		this._oCC.$().find(".sapSuiteCpMCChartItem").each(function() {
			assert.ok(jQuery(this).is(":visible"), "Item is visible");
		});
	});

	QUnit.test("Items get removed when there is not enought vertical space", function(assert) {
		//Arrange
		this._oFB.setWidth("10.5rem");
		this._oFB.setHeight("4rem");
		this._oFB.rerender();

		//Assert
		var aItems = this._oCC.$().find(".sapSuiteCpMCChartItem");

		assert.ok(aItems.eq(0).is(":visible"), "Item is visible");
		assert.ok(aItems.eq(1).is(":visible"), "Item is visible");
		assert.ok(!aItems.eq(2).is(":visible"), "Item is hidden");
	});

	QUnit.test("More items get removed when there is not enought vertical space", function(assert) {
		//Arrange
		this._oFB.setWidth("10.5rem");
		this._oFB.setHeight("0.01rem");
		this._oFB.rerender();

		//Assert
		var aItems = this._oCC.$().find(".sapSuiteCpMCChartItem");

		assert.ok(aItems.eq(0).is(":visible"), "Item item is never hidden because of min-height");
		assert.ok(!aItems.eq(1).is(":visible"), "Item is hidden");
		assert.ok(!aItems.eq(2).is(":visible"), "Item is hidden");
	});

	QUnit.test("All items shown in size of generic tile content because of proportional width resizing", function(assert) {
		//Arrange
		this._oFB.setWidth("144px");
		this._oFB.setHeight("62px");
		this._oFB.rerender();

		//Assert
		this._oCC.$().find(".sapSuiteCpMCChartItem").each(function() {
			assert.ok(jQuery(this).is(":visible"), "Item is visible");
		});
	});

	QUnit.module("Responsiveness adjustments for the use within GenericTile", {
		beforeEach: function() {
			this.oChart = new ComparisonMicroChart().addStyleClass("sapUiSmallMargin");
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
		var oRemoveMarginCallback = sinon.spy(microchartLibrary, "_removeStandardMargins");
		//Act
		this.oChart.onBeforeRendering();
		//Assert
		assert.ok(oRemoveMarginCallback.called, "Library function that removes standard margins has been called.");
	});

	QUnit.module("Tooltip behavior", {
		beforeEach: function() {
			this.oChart = new ComparisonMicroChart();
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

	QUnit.test("Model exists, control is bound, tooltip aggregataion is not bound", function(assert) {
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
					cells : [new ComparisonMicroChart({
						data : [new ComparisonMicroChartData({
							title : "Otto",
							value : "4711"
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
		assert.ok(oChart.getTooltip_AsString(), "Tooltip is empty, default tooltip as string appears");
		assert.notOk(oChart.isBound("tooltip"), "Tooltip is bound");
		//Cleanup
		oTable.destroy();
		oModel.destroy();
	});

	QUnit.module("Execution of functions onAfterRendering", {
		beforeEach: function() {
			this.oChart = new ComparisonMicroChart().placeAt("qunit-fixture");
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

	QUnit.module("Keyboard navigation", {
		beforeEach: function() {
			this.oPressHandlerChart = sinon.spy();
			this.oPressHandlerBar = sinon.spy();
			this.oChart = new ComparisonMicroChart("comparison-chart1", {
				data: [
					new ComparisonMicroChartData({
						title: "Americas",
						value: 10,
						press: this.oPressHandlerBar}),
					new ComparisonMicroChartData({
						title: "Americas2",
						value: 10,
						press: this.oPressHandlerBar}),
					new ComparisonMicroChartData({
						title: "EMEA",
						value: 20,
						press: this.oPressHandlerBar})
				],
				height: "400px",
				press: this.oPressHandlerChart
			}).placeAt("qunit-fixture");
			this.oChart1 = new ComparisonMicroChart("comparison-chart2", {
				data: [
					new ComparisonMicroChartData({
						title: "Americas",
						value: 10,
						press: this.oPressHandlerBar})
				],
				height: "400px",
				press: this.oPressHandlerChart
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			sinon.spy(this.oChart, "firePress");
			sinon.spy(this.oChart.getData()[0], "firePress");
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
			this.oChart1.destroy();
			this.oChart1 = null;
		}
	});

	QUnit.test("Enter button is pressed (chart)", function(assert) {
		//Arrange
		var $Chart = this.oChart.$(),
			oEventEnter = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $Chart
			};
		//Act
		this.oChart.onsapenter(oEventEnter);
		//Assert
		assert.equal(this.oChart.firePress.callCount, 1, "Press event is fired for chart");
		assert.equal(this.oChart.getData()[0].firePress.callCount, 0, "Press event is not fired for the first bar");
	});

	QUnit.test("Enter button is pressed (bar)", function(assert) {
		//Arrange
		var $FirstBar = this.oChart.$().find(".sapSuiteCpMCChartBar")[0],
			oFirstBar = this.oChart.getData()[0],
			oEventEnter = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $FirstBar
			};
		//Act
		this.oChart.onsapenter(oEventEnter);
		//Assert
		assert.equal(this.oChart.firePress.callCount, 0, "Press event is not fired for chart");
		assert.equal(oFirstBar.firePress.callCount, 1, "Press event is fired for the first bar");
	});

	QUnit.test("Space button is pressed (chart)", function(assert) {
		//Arrange
		var $Chart = this.oChart.$(),
			oFirstBar = this.oChart.getData()[0],
			oEventEnter = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $Chart
			};
		//Act
		this.oChart.onsapspace(oEventEnter);
		//Assert
		assert.equal(this.oChart.firePress.callCount, 1, "Press event is fired for chart");
		assert.equal(oFirstBar.firePress.callCount, 0, "Press event is not fired for the first bar");
	});

	QUnit.test("Space button is pressed (bar)", function(assert) {
		//Arrange
		var $FirstBar = this.oChart.$().find(".sapSuiteCpMCChartBar")[0],
			oFirstBar = this.oChart.getData()[0],
			oEventEnter = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $FirstBar
			};
		//Act
		this.oChart.onsapspace(oEventEnter);
		//Assert
		assert.equal(this.oChart.firePress.callCount, 0, "Press event is not fired for chart");
		assert.equal(oFirstBar.firePress.callCount, 1, "Press event is fired for the first bar");
	});

	QUnit.test("Down arrow button is pressed", function(assert) {
		//Arrange
		var $FirstBar = this.oChart.$().find(".sapSuiteCpMCChartBar").eq(0),
			$SecondBar = this.oChart.$().find(".sapSuiteCpMCChartBar").eq(1),
			oEventDown = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $FirstBar
			};
		//Act
		this.oChart.onsapdown(oEventDown);
		//Assert
		assert.equal($FirstBar.attr("tabindex"), null, "The first bar does not have tabindex after down arrow button was clicked");
		assert.notEqual($SecondBar.attr("tabindex"), null, "The second bar has tabindex after down arrow button was clicked");
	});

	QUnit.test("Up arrow button is pressed", function(assert) {
		//Arrange
		var $FirstBar = this.oChart.$().find(".sapSuiteCpMCChartBar").eq(0),
			$SecondBar = this.oChart.$().find(".sapSuiteCpMCChartBar").eq(1),
			oEventDown = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $FirstBar},
			oEventUp = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $SecondBar};
		//Act
		this.oChart.onsapdown(oEventDown);
		this.oChart.onsapup(oEventUp);
		//Assert
		assert.equal($SecondBar.attr("tabindex"), null, "The second bar does not have tabindex after up arrow button was clicked");
		assert.notEqual($FirstBar.attr("tabindex"), null, "The first bar has tabindex after up arrow button was clicked");
	});

	QUnit.test("Home button is pressed", function(assert) {
		//Arrange
		var $FirstBar = this.oChart.$().find(".sapSuiteCpMCChartBar").eq(0),
			$LastBar = this.oChart.$().find(".sapSuiteCpMCChartBar").eq(2),
			oEventHome = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $LastBar};
		this.oChart.onclick(oEventHome);
		//Act
		this.oChart.onsaphome(oEventHome);
		//Assert
		assert.notEqual($FirstBar.attr("tabindex"), null, "The first bar has tabindex after home button is clicked");
	});

	QUnit.test("End button is pressed", function(assert) {
		//Arrange
		var $FirstBar = this.oChart.$().find(".sapSuiteCpMCChartBar").eq(0),
			$LastBar = this.oChart.$().find(".sapSuiteCpMCChartBar").eq(2),
			oEventEnd = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $FirstBar};
		this.oChart.onclick(oEventEnd);
		//Act
		this.oChart.onsapend(oEventEnd);
		//Assert
		assert.notEqual($LastBar.attr("tabindex"), null, "The last bar has tabindex after end button is clicked");
	});

	QUnit.test("When mousedown is pressed on a bar, the chart focus line color is changed", function(assert) {
		//Arrange
		var $Chart = this.oChart.$(),
			$FirstBar = $Chart.find(".sapSuiteCpMCChartBar").eq(0),
			oEvent = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $FirstBar};
		//Act
		$Chart.focus();
		var sChartOutlineColorBefore = $Chart.css("outline-color");
		this.oChart._resolveFocus(oEvent);
		//Assert
		var sChartOutlineColor = $Chart.css("outline-color");
		assert.notEqual(sChartOutlineColorBefore, sChartOutlineColor, "When bar is clicked, the chart outline color is changed");
	});

	QUnit.test("When mousedown is pressed on a bar, the chart focus line color is changed", function(assert) {
		//Arrange
		var $Chart = this.oChart.$(),
			$FirstBar = $Chart.find(".sapSuiteCpMCChartBar").eq(0),
			oEventBar = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $FirstBar},
			oEvent = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $Chart};
		//Act
		$Chart.focus();
		var sChartOutlineColorBefore = $Chart.css("outline-color");
		this.oChart._resolveFocus(oEventBar);
		var sChartOutlineColorClickBar = $Chart.css("outline-color");
		this.oChart._resolveFocus(oEvent);
		//Assert
		var sChartOutlineColor = $Chart.css("outline-color");
		assert.notEqual(sChartOutlineColorBefore, sChartOutlineColorClickBar, "When bar is clicked, the chart outline color is changed");
		assert.equal(sChartOutlineColorBefore, sChartOutlineColor, "When chart is clicked, the chart outline color is reversed");
	});

	QUnit.test("Tab next button is pressed", function(assert) {
		//Arrange
		var $Chart = this.oChart.$(),
			$Chart1 = this.oChart1.$(),
			$FirstBar = $Chart.find(".sapSuiteCpMCChartBar").eq(0),
			$FirstBar1 = $Chart1.find(".sapSuiteCpMCChartBar").eq(0),
			oEventTabNext = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $FirstBar},
			oEventClick = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $FirstBar1};
		this.oChart1.onclick(oEventClick);
		this.oChart.onclick(oEventTabNext);
		var sOutlineColor = $Chart1.css("outline-color");
		//Act
		this.oChart.onsaptabnext(oEventTabNext);
		//Assert
		assert.equal(sOutlineColor, $Chart1.css("outline-color"), "The outline color was reversed when tab next was pressed");
	});

	QUnit.test("Tab previous button is pressed", function(assert) {
		//Arrange
		var $Chart = this.oChart.$(),
			$FirstBar = $Chart.find(".sapSuiteCpMCChartBar").eq(0),
			oEventBar = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $FirstBar},
			oEventTabPrevious = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){},
				target: $FirstBar};
		var sChartOutlineColorBefore = $Chart.css("outline-color");
		this.oChart._resolveFocus(oEventBar);
		//Act
		this.oChart.onsaptabprevious(oEventTabPrevious);
		//Assert
		var sChartOutlineColor = $Chart.css("outline-color");
		assert.equal(sChartOutlineColorBefore, sChartOutlineColor, "When tab previous is clicked, the chart outline color is reversed");
	});

	QUnit.module("Title attribute is added and removed when mouse enters and leaves", {
		beforeEach: function() {
			this.oChart = new ComparisonMicroChart("comparison-chart", {
				size: "M",
				scale: "M",
				view: ComparisonMicroChartViewType.Normal,
				data: [new ComparisonMicroChartData({
					title: "Americas",
					value: 10,
					color: "Good",
					displayValue: "10M"
				}), new ComparisonMicroChartData({
					title: "EMEA",
					value: 20,
					color: "Critical",
					displayValue: "18M"
				})],
				shrinkable: false,
				height: "400px"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
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

	QUnit.test("Tooltip is showed when mouse enters chart", function(assert) {
		// Arrange
		this.oChart.setTooltip("This is a tooltip");
		sap.ui.getCore().applyChanges();
		// Act
		this.oChart.$().trigger("mouseenter");
		// Assert
		assert.equal(this.oChart.$().attr("title"), "This is a tooltip" + this.oChart._getAltSubText(), "The title attribute is added when mouse enters the chart");
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
			this.oChart = new ComparisonMicroChart();
			this.oChart.setAggregation("tooltip", "ComparisonMicroChart");
		},
		afterEach : function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method getAccessibilityInfo returns correct information", function(assert) {
		// Arrange
		var oExpectedAccessibilityInformation = {
			description: "ComparisonMicroChart",
			type: this.oChart._getAccessibilityControlType()
		};

		// Act
		var oAccessibilityInformation = this.oChart.getAccessibilityInfo();

		// Assert
		assert.deepEqual(oAccessibilityInformation, oExpectedAccessibilityInformation, "An object with the correct properties has been returned.");
	});

	QUnit.module("Rendering tests for no data placeholder", {
		beforeEach: function() {
			this.oChart = new ComparisonMicroChart("comparisonMicroChart").placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("No data rendered when no data given", function(assert) {
		assert.ok(jQuery.sap.domById("comparisonMicroChart"), "Control was rendered");
		var a$NoDataElement = jQuery.sap.byId(this.oChart.getId()).find(".sapSuiteUiMicroChartNoData");
		assert.equal(a$NoDataElement.length, 1, "No data placeholder shold be rendered");
	});

	QUnit.test("No data in aria-label", function(assert) {
		assert.equal(this.oChart.$().attr("role"), "img", "chart aria role was rendered successfully");
		assert.ok(this.oChart.$().attr("aria-label").indexOf("No data") > -1, "The aria-label includes no data");
	});

	TestUtils.initSizeModule(ComparisonMicroChart, "sapSuiteCpMCSize");

	QUnit.module("Shrinkable", {
		beforeEach: function() {
			this.oChart = new ComparisonMicroChart({
				size: "M",
				view: ComparisonMicroChartViewType.Normal,
				data: [
					new ComparisonMicroChartData({
						title: "Americas",
						value: 10,
						color: "Good",
						displayValue: "10M"
					}),
					new ComparisonMicroChartData({
						title: "EMEA",
						value: 20,
						color: "Critical",
						displayValue: "18M"
					}),
					new ComparisonMicroChartData({
						title: "EMEA",
						value: 20,
						color: "Critical",
						displayValue: "18M"
					})
				],
				shrinkable: true
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Chart has correct height, all items are visible", function(assert) {
		assert.equal(this.oChart.$().width(), 168, "width is correctt");
		assert.equal(this.oChart.$().height(), 72, "height is correct");

		this.oChart.addData(
			new ComparisonMicroChartData({
				title: "EMEA2",
				value: 30,
				color: "Critical",
				displayValue: "18M"
			})
		);
		sap.ui.getCore().applyChanges();
		assert.equal(Math.ceil(this.oChart.$()[0].getBoundingClientRect().height), 96, "height is correct");

		this.oChart.addData(
				new ComparisonMicroChartData({
					title: "EMEA3",
					value: 30,
					color: "Critical",
					displayValue: "18M"
				})
		);
		sap.ui.getCore().applyChanges();
		assert.equal(Math.ceil(this.oChart.$()[0].getBoundingClientRect().height), 120, "height is correct");

	});

	QUnit.module("View type", {
		beforeEach: function() {
			this.oChart = new ComparisonMicroChart({
				size: "M",
				data: [
					new ComparisonMicroChartData({
						title: "Americas",
						value: 10,
						color: "Good",
						displayValue: "10M"
					}),
					new ComparisonMicroChartData({
						title: "EMEA",
						value: 20,
						color: "Critical",
						displayValue: "18M"
					}),
					new ComparisonMicroChartData({
						title: "EMEA",
						value: 20,
						color: "Critical",
						displayValue: "18M"
					})
				],
				shrinkable: true
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("default view", function(assert) {
		assert.notOk(this.oChart._shouldUseWideView(), "_shouldUseWideView returns false");
		assert.notOk(this.oChart.$().hasClass("sapSuiteCpMCLookWide"), "sapSuiteCpMCLookWide is not used");
	});

	QUnit.test("wide view", function(assert) {
		this.oChart.setView(ComparisonMicroChartViewType.Wide);

		sap.ui.getCore().applyChanges();

		assert.ok(this.oChart._shouldUseWideView(), "_shouldUseWideView returns true");
		assert.ok(this.oChart.$().hasClass("sapSuiteCpMCLookWide"), "sapSuiteCpMCLookWide is used");
	});

	QUnit.test("default view with bigger width", function(assert) {
		this.oChart.setWidth("500px");

		sap.ui.getCore().applyChanges();

		assert.notOk(this.oChart._shouldUseWideView(), "_shouldUseWideView returns false");
		assert.notOk(this.oChart.$().hasClass("sapSuiteCpMCLookWide"), "sapSuiteCpMCLookWide is not used");
	});

	QUnit.test("wide view with small width", function(assert) {
		this.oChart.setView(ComparisonMicroChartViewType.Wide);
		this.oChart.setWidth("100px");

		sap.ui.getCore().applyChanges();

		assert.ok(this.oChart._shouldUseWideView(), "_shouldUseWideView returns true");
		assert.ok(this.oChart.$().hasClass("sapSuiteCpMCLookWide"), "sapSuiteCpMCLookWide is used");
	});

	QUnit.test("responsive view with small width", function(assert) {
		this.oChart.setView(ComparisonMicroChartViewType.Responsive);
		this.oChart.setWidth("100px");

		sap.ui.getCore().applyChanges();

		assert.notOk(this.oChart._shouldUseWideView(), "_shouldUseWideView returns false");
		assert.notOk(this.oChart.$().hasClass("sapSuiteCpMCLookWide"), "sapSuiteCpMCLookWide is not used");
	});

	QUnit.test("responsive view with bigger width", function(assert) {
		this.oChart.setView(ComparisonMicroChartViewType.Responsive);
		this.oChart.setWidth("500px");

		sap.ui.getCore().applyChanges();

		assert.ok(this.oChart._shouldUseWideView(), "_shouldUseWideView returns true");
		assert.ok(this.oChart.$().hasClass("sapSuiteCpMCLookWide"), "sapSuiteCpMCLookWide is used");
	});


});

