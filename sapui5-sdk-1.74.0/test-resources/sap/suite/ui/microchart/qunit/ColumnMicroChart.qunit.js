/*global QUnit, sinon */
sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/microchart/ColumnMicroChart",
	"sap/suite/ui/microchart/ColumnMicroChartData",
	"sap/suite/ui/microchart/ColumnMicroChartLabel",
	"sap/m/Size",
	"sap/m/FlexBox",
	"sap/ui/model/json/JSONModel",
	"sap/m/ColumnListItem",
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/m/Table",
	"sap/ui/core/TooltipBase",
	"sap/suite/ui/microchart/library",
	"sap/ui/Device",
	"./TestUtils"
], function (jQuery, ColumnMicroChart, ColumnMicroChartData, ColumnMicroChartLabel, Size, FlexBox, JSONModel, ColumnListItem,
			 GenericTile, TileContent, Table, TooltipBase, microchartLibrary, Device, TestUtils) {
	"use strict";

	jQuery.sap.initMobile();


	function pressChart() {
		jQuery.sap.log.info("Chart pressed");
	}

	function pressBar() {
		jQuery.sap.log.info("Bar pressed");
	}

	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function() {
			this.fnStubIsInitialized = sinon.stub(sap.ui.getCore(), "isInitialized");
			this.fnSpyAttachInit = sinon.spy(sap.ui.getCore(), "attachInit");
			this.fnSpyHandleCoreInitialized = sinon.spy(ColumnMicroChart.prototype, "_handleCoreInitialized");
			this.fnStubThemeApplied = sinon.stub(sap.ui.getCore(), "isThemeApplied");
			this.fnStubAttachThemeApplied = sinon.stub(sap.ui.getCore(), "attachThemeChanged").callsFake(function(fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.fnSpyHandleThemeApplied = sinon.spy(ColumnMicroChart.prototype, "_handleThemeApplied");
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
		var oChart = new ColumnMicroChart();

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
		var oChart = new ColumnMicroChart();

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
		var oChart = new ColumnMicroChart();

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
		var oChart = new ColumnMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.fnSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.fnSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.fnStubAttachThemeApplied.notCalled, "Method Core.attachThemeChanged has not been called.");
		assert.ok(this.fnSpyHandleThemeApplied.notCalled, "Method _handleThemeApplied has not been called.");
	});

	QUnit.module("Handling of sap.m.Size.Repsonsive", {
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Setting size property to sap.m.Size.Responsive leads to isResponsive === true", function(assert) {
		//Arrange
		this.oChart = new ColumnMicroChart({
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
		this.oChart = new ColumnMicroChart();
		//Act
		var oResult = this.oChart.setSize(Size.Responsive);
		//Assert
		assert.deepEqual(oResult, this.oChart, "Control instance returned");
	});

	QUnit.test("setSize does nothing in case of same value", function(assert) {
		//Arrange
		this.oChart = new ColumnMicroChart({
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
		this.oChart = new ColumnMicroChart({
			size: Size.Responsive
		}).placeAt("qunit-fixture");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(this.oChart.getIsResponsive(), "Chart is in Responsive mode for size Responsive");
	});

	QUnit.test("sap.m.Size.Responsive changed to sap.m.Size.L leads to isResponsive === false", function(assert) {
		//Arrange
		this.oChart = new ColumnMicroChart({
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

	QUnit.module("events", {
		beforeEach: function() {
			this.oChart = new ColumnMicroChart("test-chart-ev", {
				columns: [{value: 0}, {value: 10}, {value: 10}, {value: 10}, {value: 10}]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("events handling test", function(assert) {
		assert.ok(!this.oChart.hasListeners("press"), "No press event attached to control");
		this.oChart.attachPress(pressChart);
		assert.ok(this.oChart.hasListeners("press"), "Press event attached to control");
		this.oChart.detachPress(pressChart);
		assert.ok(!this.oChart.hasListeners("press"), "Press event detached from control");
		assert.ok(!this.oChart.getColumns()[2].hasListeners("press"), "No press event attached to column 2");
		this.oChart.getColumns()[2].attachPress(pressBar);
		assert.ok(this.oChart.getColumns()[2].hasListeners("press"), "Press event attached to column 2");
		this.oChart.getColumns()[2].detachPress(pressBar);
		assert.ok(!this.oChart.getColumns()[2].hasListeners("press"), "Press event detached from column 2");
	});

	QUnit.module("calcColumnsHeight", {
		beforeEach: function() {
			this.oChart = new ColumnMicroChart("test-chart");
			this.aBars = [];
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("regular", function(assert) {
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 0
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 0.1
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 50
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: -0.1
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: -50
		}));

		var iColumnsNum = this.oChart.getColumns().length;
		for (var i = 0; i < iColumnsNum; i++) {
			this.aBars.push({});
		}

		this.oChart._calcColumnsHeight(100, this.aBars);

		assert.equal(this.aBars[0].height, "1.00%", "Column height");

		assert.equal(this.aBars[1].height, "1.00%", "Column height");

		assert.equal(this.aBars[2].height, "50.00%", "Column height");

		assert.equal(this.aBars[3].height, "1.00%", "Column height");

		assert.equal(this.aBars[4].height, "50.00%", "Column height");
	});

	QUnit.test("not all values are zero", function(assert) {
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 0
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 100
		}));

		var iColumnsNum = this.oChart.getColumns().length;
		for (var i = 0; i < iColumnsNum; i++) {
			this.aBars.push({});
		}

		this.oChart._calcColumnsHeight(100, this.aBars);

		assert.equal(parseInt(this.aBars[0].height), 1, "Column height is set");
		assert.equal(parseInt(this.aBars[0].top), 99, "Column top is set");
	});

	QUnit.test("all values are zero", function(assert) {
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 0
		}));

		var iColumnsNum = this.oChart.getColumns().length;
		for (var i = 0; i < iColumnsNum; i++) {
			this.aBars.push({});
		}

		this.oChart._calcColumnsHeight(100, this.aBars);

		assert.equal(this.aBars[0].height, "1px", "Column height is 1px");
		assert.equal(this.aBars[0].top, "calc(100% - 1px)", "Column top is set");
	});

	QUnit.test("shiftTop", function(assert) {
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 0
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: -100
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: -0.1
		}));

		var iColumnsNum = this.oChart.getColumns().length;
		for (var i = 0; i < iColumnsNum; i++) {
			this.aBars.push({});
		}

		this.oChart._calcColumnsHeight(100, this.aBars);

		assert.equal(this.aBars[0].height, "1.00%", "Column height");
		assert.equal(this.aBars[0].top, "0.00%", "Column top");

		assert.equal(this.aBars[1].height, "99.00%", "Column height");
		assert.equal(this.aBars[1].top, "1.00%", "Column top");

		assert.equal(this.aBars[2].height, "1.00%", "Column height");
		assert.equal(this.aBars[2].top, "1.00%", "Column top");
	});

	QUnit.test("shiftBottom", function(assert) {
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 0
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 100
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: 50
		}));
		this.oChart.addColumn(new ColumnMicroChartData({
			value: -0.1
		}));

		var iColumnsNum = this.oChart.getColumns().length;
		for (var i = 0; i < iColumnsNum; i++) {
			this.aBars.push({});
		}

		this.oChart._calcColumnsHeight(100, this.aBars);

		assert.equal(this.aBars[0].height, "1.00%", "Column height");
		assert.equal(this.aBars[0].top, "98.00%", "Column top");

		assert.equal(this.aBars[1].height, "99.00%", "Column height");
		assert.equal(this.aBars[1].top, "0.00%", "Column top");

		assert.equal(this.aBars[2].height, "49.05%", "Column height");
		assert.equal(this.aBars[2].top, "49.95%", "Column top");

		assert.equal(this.aBars[3].height, "1.00%", "Column height");
		assert.equal(this.aBars[3].top, "99.00%", "Column top");

	});

	QUnit.module("rendering", {
		beforeEach: function() {
			this.oChart = new ColumnMicroChart({
				width: "100px",
				height: "50px",
				leftTopLabel: new ColumnMicroChartLabel({ label: "Left", color: "Critical"}),
				rightBottomLabel: new ColumnMicroChartLabel({ label: "Right", color: "Error"}),
				columns: [
					{value: 0, color: "Good"}, {value: 10, color: "Error"},
					{value: -10, color: "Critical"}
				]
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("rendering test", function(assert) {
		var aColumns = this.oChart.getColumns();

		assert.equal(this.oChart.$().css("width"), "100px", "Chart width");
		assert.equal(this.oChart.$().css("height"), "50px", "Chart height");
		assert.ok(aColumns[0].$().find(".sapSuiteClMCInnerBar").hasClass("sapSuiteClMCSemanticColorGood"));
		assert.ok(aColumns[1].$().find(".sapSuiteClMCInnerBar").hasClass("sapSuiteClMCSemanticColorError"));
		assert.ok(aColumns[2].$().find(".sapSuiteClMCInnerBar").hasClass("sapSuiteClMCSemanticColorCritical"));
		assert.equal(jQuery.sap.byId(this.oChart.getId() + "-left-top-lbl").text(), "Left", "Left top label text");
		assert.equal(jQuery.sap.byId(this.oChart.getId() + "-right-btm-lbl").text(), "Right", "Right bottom label text");
	});

	QUnit.test("Aria-label only includes the standard chart information", function(assert) {
		// Arrange
		var sAriaLabel = this.oChart.getTooltip_AsString();
		this.oChart.setTooltip("This is tooltip");
		// Act
		sap.ui.getCore().applyChanges();
		// Assert
		assert.equal(sAriaLabel,sAriaLabel, "The aria-label includes only chart information");
		assert.equal(null, this.oChart.$().attr("title"), "The title attribute is not rendered");
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

	QUnit.module("Title attribute is added and removed when mouse enters and leaves", {
		beforeEach: function() {
			this.oCmc = new ColumnMicroChart("cmc", {
				width: "100px",
				height: "50px",
				leftTopLabel: new ColumnMicroChartLabel({ label: "Left", color: "Critical"}),
				rightBottomLabel: new ColumnMicroChartLabel({ label: "Right", color: "Error"}),
				columns: [{value: 0, color: "Good"},
					{value: 10, color: "Error"},
					{value: -10, color: "Critical"}]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oCmc.destroy();
			this.oCmc = null;
		}
	});

	QUnit.test("Tooltip is showed when mouse enters chart", function(assert) {
		// Arrange
		this.oCmc.setTooltip("This is cmc tooltip");
		sap.ui.getCore().applyChanges();
		// Act
		this.oCmc.$().trigger("mouseenter");
		// Assert
		assert.equal(this.oCmc.getTooltip_AsString(), this.oCmc.$().attr("title"), "The title attribute is added when mouse enters the chart");
	});

	QUnit.test("Tooltip is removed when mouse leaves chart", function(assert) {
		// Arrange
		this.oCmc.setTooltip("This is cmc tooltip");
		sap.ui.getCore().applyChanges();
		// Act
		this.oCmc.$().trigger("mouseenter");
		this.oCmc.$().trigger("mouseleave");
		// Assert
		assert.equal(null, this.oCmc.$().attr("title"), "The title attribute is removed when mouse leaves the chart");
	});

	QUnit.module("Responsiveness", {
		beforeEach: function() {
			this.oChart = new ColumnMicroChart("mCMChart", {
				isResponsive: true,
				columns: [{value: 0, color: "Good"},
					{value: 10, color: "Error"},
					{value: -10, color: "Critical"}]
			});
			this.oFlexBox = new FlexBox("FlexBox-cmc", {
				items: [this.oChart],
				renderType: "Bare",
				width: "6rem",
				height: "5rem"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Chart is rendered with the proper width and height higher than the thresholds", function(assert) {
		//Arrange
		var iChartHeightExpected = this.oFlexBox.$().height();
		var iChartWidthExpected = this.oFlexBox.$().width();
		//Act
		//Assert
		assert.equal(this.oChart.$().height(), iChartHeightExpected, "Chart is rendered with expected height");
		assert.equal(this.oChart.$().width(), iChartWidthExpected, "Chart is rendered with expected width");
	});


	//Responsiveness: do not show the labels if they are truncated or do not show the top label if the height of the chart is less than 3.5rem
	//before hiding the labels, reduce the font from 14px to 12px
	QUnit.module("Responsiveness -- Labels and Fonts", {
		beforeEach: function() {
			this.oChart = new ColumnMicroChart("mCMChart", {
				isResponsive: true,
				leftTopLabel : {
					label : "June 1",
					color : "Good"
				},
				leftBottomLabel : {
					label : "0M",
					color : "Good"
				},
				rightTopLabel : {
					label : "June 30",
					color : "Critical"
				},
				rightBottomLabel : {
					label : "80M",
					color : "Critical"
				},
				columns: [{value: 0, color: "Good"},
					{value: 10, color: "Error"},
					{value: -10, color: "Critical"}]
			});
			this.oFlexBox = new FlexBox("FlexBox-cmc", {
				items: [this.oChart],
				renderType: "Bare",
				width: "15rem",
				height: "15rem"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Chart is rendered with the top and bottom labels visible and proper font size", function(assert) {
		//Arrange
		//Act
		var sTopLabelStyle = this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").attr("style");
		var sBottomLabelStyle = this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels").attr("style");
		//Assert
		assert.ok(!sTopLabelStyle || sTopLabelStyle.indexOf("display: none;") === -1, "Chart is properly rendered with the top labels visible");
		assert.ok(!sBottomLabelStyle || sBottomLabelStyle.indexOf("display: none;") === -1, "Chart is properly rendered with the bottom labels visible");
		assert.ok(!this.oChart.hasStyleClass("sapSuiteClMCNoTopLabels"), "Chart is properly rendered with the labels having the standard font size");
	});

	QUnit.test("Chart is rendered with the labels visible having font resized to smallFont for height shrinking", function(assert) {
		//the font is resized when the threshold for height is reached (4.5rem)
		//Arrange
		this.oFlexBox.setHeight("4.5rem");
		this.oFlexBox.rerender();
		//Act
		var sTopLabelStyle = this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").attr("style");
		//Assert
		assert.ok(!sTopLabelStyle || sTopLabelStyle.indexOf("display: none") === -1, "Chart is properly rendered with the top label visible");
		assert.ok(this.oChart.$().hasClass("sapSuiteClMCLookM"), "Chart is properly rendered with the labels having the standard font size");
	});

	QUnit.test("Chart is rendered with the top labels hidden and bottom labels present whene some top label should get truncated", function(assert) {
		//Arrange
		this.oChart.getRightTopLabel().setLabel("some very long label");
		this.oFlexBox.setHeight("150px");
		//Act
		this.oFlexBox.rerender();
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the top labels hidden");
	});

	QUnit.test("Chart is rendered with the top labels hidden and no bottom labels - height shrinking", function(assert) {
		//top label is hidden when the threshold for height is reached (55px) and there are no bottom labels
		//Arrange
		this.oFlexBox.setHeight("55px");
		this.oChart.setRightBottomLabel(null);
		this.oChart.setLeftBottomLabel(null);
		this.oFlexBox.rerender();
		//Act
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the top labels hidden");
	});

	QUnit.test("Chart is rendered with the bottom labels hidden - height shrinking", function(assert) {
		//bottom label is hidden when the threshold for height is reached (55px)
		//Arrange
		this.oFlexBox.setHeight("55px");
		this.oFlexBox.rerender();
		//Act
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the bottom labels hidden");
	});

	QUnit.test("Chart is rendered with the top labels hidden when allowed column labels and there is enough space", function(assert) {
		//Arrange
		this.oChart.setAllowColumnLabels(true);
		sap.ui.getCore().applyChanges();
		//Act
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the top labels hidden");
		assert.ok(this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the bottom labels shown");
		assert.equal(this.oChart.$().find(".sapSuiteClMCLabelColumn").length, 3, "Column labels are all rendered");
		if ( !Device.browser.msie && !Device.browser.edge) {
			this.oChart.$().find(".sapSuiteClMCLabelColumn").each(function() {
				assert.ok(jQuery(this).is(":visible"), "Column label is visible");
			});
		}
	});

	QUnit.test("Chart is rendered with the top labels shown when allowed column labels and height is small", function(assert) {
		//Arrange
		this.oFlexBox.setHeight("70px");
		this.oChart.setAllowColumnLabels(true);
		sap.ui.getCore().applyChanges();
		//Act
		//Assert
		assert.ok(this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the top labels shown");
		assert.ok(this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the bottom labels shown");
		assert.equal(this.oChart.$().find(".sapSuiteClMCLabelColumn").length, 3, "Column labels are all rendered");
		this.oChart.$().find(".sapSuiteClMCLabelColumn").each(function() {
			assert.notOk(jQuery(this).is(":visible"), "Column label not visible");
		});
	});

	QUnit.test("Chart is rendered with the top labels shown when allowed column labels and width is too small", function(assert) {
		//Arrange
		this.oChart.getColumns()[0].setValue(123456789);
		this.oFlexBox.setWidth("100px");
		this.oChart.setAllowColumnLabels(true);
		sap.ui.getCore().applyChanges();
		//Act
		//Assert
		assert.ok(this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the top labels shown");
		assert.ok(this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels").is(":visible"), "Chart is properly rendered with the bottom labels shown");
		assert.equal(this.oChart.$().find(".sapSuiteClMCLabelColumn").length, 3, "Column labels are all rendered");
		this.oChart.$().find(".sapSuiteClMCLabelColumn").each(function() {
			assert.notOk(jQuery(this).is(":visible"), "Column label not visible");
		});
	});

	QUnit.test("Columns gets hidden if there is not enough space for them", function(assert) {
		//Arrange
		for (var i = 0; i < 10; i++) {
			this.oChart.addColumn(new ColumnMicroChartData({value: 10}));
		}
		this.oFlexBox.setWidth("64px");

		var aColumns = this.oChart.getColumns();
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		for (var j = 0; j < aColumns.length; j++) {
			if (j < 8) {
				assert.ok(aColumns[j].$().is(":visible"), "column is visible");
			} else {
				assert.notOk(aColumns[j].$().is(":visible"), "column is hidden");
			}
		}
	});

	QUnit.module("Responsiveness -- Chart inside a simple div", {
		beforeEach : function() {
			var $fixture = jQuery("#qunit-fixture");
			$fixture.css("width", "500px");
			$fixture.css("height", "300px");
			this.oChart = new ColumnMicroChart("mCMChart", {isResponsive: true}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Chart inside a simple div", function(assert) {
		//Arrange
		// Two pixels subtracted, otherwise there's not enough space for the outline and the chart won't be rendered properly
		var iChartHeightExpected = parseFloat(this.oChart.getParent().oRootNode.getAttribute("style").split(" ")[3]);
		var iChartWidthExpected = parseFloat(this.oChart.getParent().oRootNode.getAttribute("style").split(" ")[1]);
		//Act
		//Assert
		assert.equal(this.oChart.$().height(), iChartHeightExpected, "Chart is rendered with the parent height");
		assert.equal(this.oChart.$().width(), iChartWidthExpected, "Chart is rendered with the parent width");
	});

	QUnit.module("Tooltip behavior", {
		beforeEach: function() {
			this.oChart = new ColumnMicroChart();
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
					cells : [new ColumnMicroChart({
						columns : [new ColumnMicroChartData({
							value : 4.20
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
			this.oChart = new ColumnMicroChart().placeAt("qunit-fixture");
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

	QUnit.module("Control provides accessibility information", {
		beforeEach : function() {
			this.oChart = new ColumnMicroChart();
			this.oChart.setAggregation("tooltip", "ColumnMicroChart");
		},
		afterEach : function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method getAccessibilityInfo returns correct information", function(assert) {
		// Arrange
		var oExpectedAccessibilityInformation = {
			description: "ColumnMicroChart",
			type: this.oChart._getAccessibilityControlType()
		};

		// Act
		var oAccessibilityInformation = this.oChart.getAccessibilityInfo();

		// Assert
		assert.deepEqual(oAccessibilityInformation, oExpectedAccessibilityInformation, "An object with the correct properties has been returned.");
	});

	QUnit.module("Rendering tests for no data placeholder", {
		beforeEach: function() {
			this.oChart = new ColumnMicroChart("columnMicroChart").placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("No data rendered when no columns given", function(assert) {
		//Arrange
		//Act
		//Assert
		assert.ok(jQuery.sap.domById("columnMicroChart"), "Control was rendered");
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

	TestUtils.initSizeModule(ColumnMicroChart, "sapSuiteClMCSize");

	QUnit.module("Allow column labels", {
		beforeEach: function() {
			this.oChart = new ColumnMicroChart("mCMChart", {
				allowColumnLabels: true,
				leftTopLabel : {
					label : "June 1",
					color : "Good"
				},
				leftBottomLabel : {
					label : "0M",
					color : "Good"
				},
				rightTopLabel : {
					label : "June 30",
					color : "Critical"
				},
				rightBottomLabel : {
					label : "80M",
					color : "Critical"
				},
				columns: [
					{value: 0, color: "Good"},
					{value: 10, color: "Error"},
					{value: -10, color: "Critical"},
					{value: 0, displayValue: "nul", color: "Critical"}
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Column labels are shown", function(assert) {
		var aColumns = this.oChart.getColumns();

		assert.equal(aColumns[0].$().find(".sapSuiteClMCLabelColumn").text(), "0");
		assert.equal(aColumns[1].$().find(".sapSuiteClMCLabelColumn").text(), "10");
		assert.equal(aColumns[2].$().find(".sapSuiteClMCLabelColumn").text(), "-10");
		assert.equal(aColumns[3].$().find(".sapSuiteClMCLabelColumn").text(), "nul");
	});

	QUnit.test("Basic bottom labels shown if no colum has its label", function(assert) {
		assert.ok(this.oChart.$().find(".sapSuiteClMCPositionBtm").is(":visible"));
	});

	QUnit.test("Basic bottom labels if some column has its label", function(assert) {
		this.oChart.getColumns()[0].setLabel("test");
		sap.ui.getCore().applyChanges();

		assert.notOk(this.oChart.$().find(".sapSuiteClMCPositionBtm").is(":visible"));
	});

	QUnit.test("Bottom column labels are shown", function(assert) {
		var sLabel = "testLabel";
		var aColumns = this.oChart.getColumns();

		aColumns.forEach(function(oColumn) {
			oColumn.setLabel(sLabel);
		});

		sap.ui.getCore().applyChanges();


		var $labels = this.oChart.$().find(".sapSuiteClMCBottomColumnLabel");

		assert.equal($labels.length, aColumns.length, "correct number of labels is rendered");
		$labels.toArray().forEach(function(oLabel) {
			assert.equal(oLabel.textContent, sLabel, "label is correct");
		});
	});



	QUnit.module("Show top/bottom labels", {
		beforeEach: function() {
			this.oChart = new ColumnMicroChart("mCMChart", {
				allowColumnLabels: true,
				leftTopLabel : {
					label : "June 1",
					color : "Good"
				},
				leftBottomLabel : {
					label : "0M",
					color : "Good"
				},
				rightTopLabel : {
					label : "June 30",
					color : "Critical"
				},
				rightBottomLabel : {
					label : "80M",
					color : "Critical"
				},
				columns: [
					{value: 0, color: "Good"},
					{value: 10, color: "Error"},
					{value: -10, color: "Critical"},
					{value: 0, displayValue: "nul", color: "Critical"}
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Top labels hidden", function(assert) {
		//Arrange
		//Act
		this.oChart.setShowTopLabels(false);
		var aTopLabels = this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels");
		var aBottomLabels = this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels");
		//Assert
		assert.ok(aTopLabels.length, 0,  "Top labels not rendered");
		assert.ok(aBottomLabels.length, 2, "Bottom labels rendered");
	});

	QUnit.test("Bottom labels hidden", function(assert) {
		//Arrange
		//Act
		this.oChart.setShowBottomLabels(false);
		var aTopLabels = this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels");
		var aBottomLabels = this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels");
		//Assert
		assert.ok(aTopLabels.length, 2,  "Top labels rendered");
		assert.ok(aBottomLabels.length, 0, "Bottom labels not rendered");
	});

	QUnit.test("Bottom and top labels hidden", function(assert) {
		//Arrange
		//Act
		this.oChart.setShowBottomLabels(false);
		var aTopLabels = this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels");
		var aBottomLabels = this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels");
		//Assert
		assert.ok(aTopLabels.length, 2,  "Top labels not rendered");
		assert.ok(aBottomLabels.length, 2, "Bottom labels not rendered");
	});

	QUnit.test("Top labels hidden with allowColumnLabels true", function(assert) {
		//Arrange
		//Act
		this.oChart.setAllowColumnLabels(true);
		this.oChart.setShowTopLabels(false);
		var aTopLabels = this.oChart.$().find(".sapSuiteClMCPositionTop.sapSuiteClMCLabels");
		var aBottomLabels = this.oChart.$().find(".sapSuiteClMCPositionBtm.sapSuiteClMCLabels");
		//Assert
		assert.ok(aTopLabels.length, 0,  "Top labels not rendered");
		assert.ok(aBottomLabels.length, 2, "Bottom labels rendered");
	});

});
