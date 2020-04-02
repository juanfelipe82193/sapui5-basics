/*global QUnit, sinon */
sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/microchart/HarveyBallMicroChart",
	"sap/suite/ui/microchart/HarveyBallMicroChartItem",
	"sap/m/Size",
	"sap/m/ValueColor",
	"sap/ui/model/json/JSONModel",
	"sap/m/ColumnListItem",
	"sap/m/Table",
	"sap/m/FlexBox",
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/ui/core/TooltipBase",
	"sap/suite/ui/microchart/HarveyBallMicroChartRenderer",
	"sap/m/ValueCSSColor",
	"sap/suite/ui/microchart/library",
	"./TestUtils"
], function (jQuery, HarveyBallMicroChart, HarveyBallMicroChartItem, Size, ValueColor, JSONModel, ColumnListItem, Table,
			 FlexBox, GenericTile, TileContent, TooltipBase, HarveyBallMicroChartRenderer, ValueCSSColor, microchartLibrary, TestUtils) {
	"use strict";

	jQuery.sap.initMobile();


	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function() {
			this.oStubIsInitialized = sinon.stub(sap.ui.getCore(), "isInitialized");
			this.oSpyAttachInit = sinon.spy(sap.ui.getCore(), "attachInit");
			this.oSpyHandleCoreInitialized = sinon.spy(HarveyBallMicroChart.prototype, "_handleCoreInitialized");
			this.oStubThemeApplied = sinon.stub(sap.ui.getCore(), "isThemeApplied");
			this.oStubAttachThemeApplied = sinon.stub(sap.ui.getCore(), "attachThemeChanged").callsFake(function(fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.oSpyHandleThemeApplied = sinon.spy(HarveyBallMicroChart.prototype, "_handleThemeApplied");
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
		var oChart = new HarveyBallMicroChart();

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
		var oChart = new HarveyBallMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.notCalled, "Method Core.attachThemeChanged has not been called.");
		assert.ok(this.oSpyHandleThemeApplied.notCalled, "Method _handleThemeApplied has not been called.");
	});

	QUnit.test("Core loaded and theme not loaded", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(true);
		this.oStubThemeApplied.returns(false);

		//Act
		var oChart = new HarveyBallMicroChart();

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
		var oChart = new HarveyBallMicroChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.notCalled, "Method Core.attachThemeChanged has not been called.");
		assert.ok(this.oSpyHandleThemeApplied.notCalled, "Method _handleThemeApplied has not been called.");
	});

	QUnit.module("Handling of sap.m.Size.Repsonsive", {
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Setting size property to sap.m.Size.Responsive leads to isResponsive === true", function(assert) {
		//Arrange
		this.oChart = new HarveyBallMicroChart({
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
		this.oChart = new HarveyBallMicroChart();
		//Act
		var oResult = this.oChart.setSize(Size.Responsive);
		//Assert
		assert.deepEqual(oResult, this.oChart, "Control instance returned");
	});

	QUnit.test("setSize does nothing in case of same value", function(assert) {
		//Arrange
		this.oChart = new HarveyBallMicroChart({
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
		this.oChart = new HarveyBallMicroChart({
			size: Size.Responsive
		}).placeAt("qunit-fixture");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(this.oChart.getIsResponsive(), "Chart is in Responsive mode for size Responsive");
	});

	QUnit.test("sap.m.Size.Responsive changed to sap.m.Size.L leads to isResponsive === false", function(assert) {
		//Arrange
		this.oChart = new HarveyBallMicroChart({
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
			this.oChart = new HarveyBallMicroChart("chart", {
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Default Property Values", function(assert) {
		assert.equal(this.oChart.getTotal(), 0, "total is 0");
		assert.equal(this.oChart.getFormattedLabel(), false, "formattedLabel is false");
		assert.equal(this.oChart.getShowTotal(), true, "showTotal is true");
		assert.equal(this.oChart.getShowFractions(), true, "showFractions is true");
		assert.equal(this.oChart.getSize(), Size.Auto, "size is sap.m.Size.Auto");
		assert.deepEqual(this.oChart.getColorPalette(), [], "colorPalette is []");
		assert.equal(this.oChart.getIsResponsive(), false, "isResponsive is false");
	});

	QUnit.module("Rendering Tests - sap.suite.ui.microchart.HarveyBallMicroChart", {
		beforeEach : function() {
			this.oHbmc1 = new HarveyBallMicroChart("rmc1", {
				size: "M",
				total: 355,
				totalLabel: "360",
				totalScale: "Mrd",
				formattedLabel: false,
				showTotal: true,
				showFractions: true,
				tooltip: "Cumulative Totals\n\\((AltText\\))\ncalculated in EURO",
				items: [new HarveyBallMicroChartItem({
					fraction: 125,
					color: ValueColor.Good,
					fractionLabel: "130",
					fractionScale: "Mln",
					formattedLabel: false
				})]
			}).placeAt("qunit-fixture");

			this.oHbmc2 = new HarveyBallMicroChart("rmc2", {
				size: "M",
				total: 355,
				totalScale: "Mrd",
				formattedLabel: false,
				showTotal: true,
				showFractions: true,
				items: [new HarveyBallMicroChartItem({
					fraction: 240,
					color: ValueColor.Good,
					fractionScale: "Mln",
					formattedLabel: false
				})]
			}).placeAt("qunit-fixture");

			this.oHbmc3 = new HarveyBallMicroChart("rmc3", {
				size: "M",
				total: 360,
				totalLabel: "360",
				totalScale: "Mrd",
				formattedLabel: false,
				showTotal: false,
				showFractions: false,
				tooltip: "Test tooltip",
				items: [new HarveyBallMicroChartItem({
					fraction: 355,
					color: ValueColor.Good,
					fractionLabel: "130",
					fractionScale: "Mln",
					formattedLabel: false
				})]
			}).placeAt("qunit-fixture");

			this.oHbmc4 = new HarveyBallMicroChart("rmc4", {
				size: "M",
				total: 360,
				totalLabel: "100KHz",
				totalScale: "Mrd",
				formattedLabel: true,
				showTotal: true,
				showFractions: true,
				tooltip: "Cumulative Totals\n\\((AltText\\))\ncalculated in EURO",
				items: [new HarveyBallMicroChartItem({
					fraction: 4,
					color: ValueColor.Good,
					fractionLabel: "21Kg",
					fractionScale: "Mln",
					formattedLabel: true
				})]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oHbmc1.destroy();
			this.oHbmc2.destroy();
			this.oHbmc3.destroy();
			this.oHbmc4.destroy();
		}
	});

	QUnit.test("Control rendering test - Labels instead of values",
		function(assert) {
			assert.ok(jQuery.sap.domById("rmc1"), "Control 1 was rendered");
			assert.ok(jQuery.sap.byId("rmc1-harvey-ball").length > 0, "HarveyBallMicroChart was rendered");
			assert.equal(jQuery.sap.domById("rmc1-fraction").innerHTML, "130", "Fraction from label should appear in control");
			assert.equal(jQuery.sap.domById("rmc1-fraction-scale").innerHTML, "Mln", "Fraction scale should appear in control");
			assert.equal(jQuery.sap.domById("rmc1-total").innerHTML, "360", "Total should appear in control");
			assert.equal(jQuery.sap.domById("rmc1-total-scale").innerHTML, "Mrd", "Total scale should appear in control");
		});

	QUnit.test("Control rendering test - No labels, values only",
		function(assert) {
			assert.ok(jQuery.sap.domById("rmc2"), "Control 1 was rendered");
			assert.ok(jQuery.sap.byId("rmc2-harvey-ball").length > 0, "HarveyBallMicroChart was rendered");
			assert.equal(jQuery.sap.domById("rmc2-fraction").innerHTML, "240", "Fraction from value should appear in control");
			assert.equal(jQuery.sap.domById("rmc2-fraction-scale").innerHTML, "Mln", "Fraction scale should appear in control");
			assert.equal(jQuery.sap.domById("rmc2-total").innerHTML, "355", "Total from value should appear in control");
			assert.equal(jQuery.sap.domById("rmc2-total-scale").innerHTML, "Mrd", "Total scale should appear in control");
			assert.equal(jQuery.sap.byId("rmc2-fraction").is(':visible'), true, "Fraction should appear in control");
			assert.equal(jQuery.sap.byId("rmc2-fraction-scale").is(':visible'), true, "Fraction scale should appear in control");
			assert.equal(jQuery.sap.byId("rmc2-total").is(':visible'), true, "Total should appear in control");
			assert.equal(jQuery.sap.byId("rmc2-total-scale").is(':visible'), true, "Total scale should appear in control");
		});

	QUnit.test("Control rendering test - Labels display switched off",
		function(assert) {
			assert.ok(jQuery.sap.domById("rmc3"), "Control 1 was rendered");
			assert.ok(jQuery.sap.byId("rmc3-harvey-ball").length > 0, "HarveyBallMicroChart was rendered");
			assert.equal(jQuery.sap.byId("rmc3-fraction").is(':visible'), false, "Fraction should not appear in control");
			assert.equal(jQuery.sap.byId("rmc3-fraction-scale").is(':visible'), false, "Fraction scale should not appear in control");
			assert.equal(jQuery.sap.byId("rmc3-total").is(':visible'), false, "Total should not appear in control");
			assert.equal(jQuery.sap.byId("rmc3-total-scale").is(':visible'), false, "Total scale should not appear in control");
		});

	QUnit.test("Control rendering test - Formatted labels", function(assert) {
		assert.ok(jQuery.sap.domById("rmc4"), "control 1 was rendered");
		assert.ok(jQuery.sap.byId("rmc4-harvey-ball").length > 0, "harvey ball chart was rendered");
		assert.equal(jQuery.sap.domById("rmc4-fraction").innerHTML, "21", "Fraction from formatted label should appear in control");
		assert.equal(jQuery.sap.domById("rmc4-fraction-scale").innerHTML, "Kg", "Fraction scale  from formatted label should appear in control");
		assert.equal(jQuery.sap.domById("rmc4-total").innerHTML, "100", "Total from formatted label should appear in control");
		assert.equal(jQuery.sap.domById("rmc4-total-scale").innerHTML, "KHz", "Total scale from formatted label should appear in control");
	});

	QUnit.test("Semantic color classes of segment, labels, and scales", function(assert) {
		//Assert
		assert.ok(jQuery.sap.byId("rmc1-segment").hasClass("sapSuiteHBMCSemanticColorGood"), "The segment has correct semantic color class");
		assert.ok(jQuery.sap.byId("rmc1-fraction").hasClass("sapSuiteHBMCSemanticColorGood"), "The fraction label has correct semantic color class");
		assert.ok(jQuery.sap.byId("rmc1-fraction-scale").hasClass("sapSuiteHBMCSemanticColorGood"), "The fraction scale has correct semantic color class");
	});

	QUnit.test("Colors of labels and scales - color palette used", function(assert) {
		//Arrange
		var sColor = "Error",
			sExpectedColor = "rgb(204, 25, 25)"; // jQuery css() returns RGB value

		//Act
		this.oHbmc1.setColorPalette([sColor]);
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(this.oHbmc1.getColorPalette()[0], sColor, "Correct palette color");
		assert.equal(jQuery.sap.byId("rmc1-fraction").css("color"), sExpectedColor, "Correct palette color used for the fraction");
		assert.equal(jQuery.sap.byId("rmc1-fraction-scale").css("color"), sExpectedColor, "Correct palette color used for the fraction scale");
	});

	QUnit.test("Colors of labels and scales - random color used", function(assert) {
		//Arrange
		var sColor = "#123456",
			sExpectedColor = "rgb(102, 102, 102)"; // jQuery css() returns RGB value

		//Act
		this.oHbmc1.setColorPalette([sColor]);
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(this.oHbmc1.getColorPalette()[0], sColor, "Correct palette color");
		assert.equal(jQuery.sap.byId("rmc1-fraction").css("color"), sExpectedColor, "Correct palette color used for the fraction");
		assert.equal(jQuery.sap.byId("rmc1-fraction-scale").css("color"), sExpectedColor, "Correct palette color used for the fraction scale");
	});

	QUnit.module("Calculation Tests - sap.suite.ui.microchart.HarveyBallMicroChart", {
		beforeEach : function() {
			this.oHbmc1 = new HarveyBallMicroChart("rmc1", {
				size: "M",
				total: 355,
				totalLabel: "360",
				totalScale: "Mrd",
				formattedLabel: false,
				showTotal: true,
				showFractions: true,
				tooltip: "Cumulative Totals\n\\((AltText\\))\ncalculated in EURO",
				items: [new HarveyBallMicroChartItem({
					fraction: 125,
					color: ValueColor.Good,
					fractionLabel: "130",
					fractionScale: "Mln",
					formattedLabel: false
				})]
			}).placeAt("qunit-fixture");

			this.oHbmc2 = new HarveyBallMicroChart("rmc2", {
				size: "M",
				total: 355,
				totalScale: "Mrd",
				formattedLabel: false,
				showTotal: true,
				showFractions: true,
				items: [new HarveyBallMicroChartItem({
					fraction: 240,
					color: ValueColor.Good,
					fractionScale: "Mln",
					formattedLabel: false
				})]
			}).placeAt("qunit-fixture");

			this.oHbmc3 = new HarveyBallMicroChart("rmc3", {
				size: "M",
				total: 360,
				totalLabel: "360",
				totalScale: "Mrd",
				formattedLabel: false,
				showTotal: false,
				showFractions: false,
				tooltip: "Test tooltip",
				items: [new HarveyBallMicroChartItem({
					fraction: 355,
					color: ValueColor.Good,
					fractionLabel: "130",
					fractionScale: "Mln",
					formattedLabel: false
				})]
			}).placeAt("qunit-fixture");

			this.oHbmc4 = new HarveyBallMicroChart("rmc4", {
				size: "M",
				total: 360,
				totalLabel: "100KHz",
				totalScale: "Mrd",
				formattedLabel: true,
				showTotal: true,
				showFractions: true,
				tooltip: "Cumulative Totals\n\\((AltText\\))\ncalculated in EURO",
				items: [new HarveyBallMicroChartItem({
					fraction: 4,
					color: ValueColor.Good,
					fractionLabel: "21Kg",
					fractionScale: "Mln",
					formattedLabel: true
				})]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oHbmc1.destroy();
			this.oHbmc2.destroy();
			this.oHbmc3.destroy();
			this.oHbmc4.destroy();
		}
	});

	QUnit.test("Calculation test - Less than 180 degrees", function(assert) {
		this.oHbmc1.getRenderer()._calculatePath(this.oHbmc1);
		assert.equal(this.oHbmc1.getRenderer()._serializePieChart(), "M36,36 L36,5 A31,31 0 0,1 60.84,54.55 L36,36 z", "Chart path should be calculated correctly for angles < 180 degrees");
	});

	QUnit.test("Calculation test - Greater than 180 degrees", function(assert) {
		this.oHbmc2.getRenderer()._calculatePath(this.oHbmc2);
		assert.equal(this.oHbmc2.getRenderer()._serializePieChart(), "M36,36 L36,5 A31,31 0 1,1 8.29,49.89 L36,36 z", "Chart path should be calculated correctly for angles > 180 degrees");
	});

	QUnit.test("Calculation test - Between 350 and 360 degrees", function(assert) {
		this.oHbmc3.getRenderer()._calculatePath(this.oHbmc3);
		assert.equal(this.oHbmc3.getRenderer()._serializePieChart(), "M36,36 L36,5 A31,31 0 1,1 33.30,5.12 L36,36 z", "Chart path should be calculated correctly for angles 350..360 degrees");
	});

	QUnit.test("Calculation test - Between 0 and 10 degrees", function(assert) {
		this.oHbmc4.getRenderer()._calculatePath(this.oHbmc4);
		assert.equal(this.oHbmc4.getRenderer()._serializePieChart(), "M36,36 L36,5 A31,31 0 0,1 38.16,5.08 L36,36 z", "Chart path should be calculated correctly for angles 0..10 degrees");
	});

	QUnit.module("Accessibility Tests - sap.suite.ui.microchart.HarveyBallMicroChart", {
		beforeEach : function() {
			this.oHbmc1 = new HarveyBallMicroChart("rmc1", {
				size: "M",
				total: 355,
				totalLabel: "360",
				totalScale: "Mrd",
				formattedLabel: false,
				showTotal: true,
				showFractions: true,
				tooltip: "Cumulative Totals\n\\((AltText\\))\ncalculated in EURO",
				items: [new HarveyBallMicroChartItem({
					fraction: 125,
					color: ValueColor.Good,
					fractionLabel: "130",
					fractionScale: "Mln",
					formattedLabel: false
				})]
			}).placeAt("qunit-fixture");

			this.oHbmc2 = new HarveyBallMicroChart("rmc2", {
				size: "M",
				total: 355,
				totalScale: "Mrd",
				formattedLabel: false,
				showTotal: true,
				showFractions: true,
				items: [new HarveyBallMicroChartItem({
					fraction: 240,
					color: ValueColor.Good,
					fractionScale: "Mln",
					formattedLabel: false
				})]
			}).placeAt("qunit-fixture");

			this.oHbmc3 = new HarveyBallMicroChart("rmc3", {
				size: "M",
				total: 360,
				totalLabel: "360",
				totalScale: "Mrd",
				formattedLabel: false,
				showTotal: false,
				showFractions: false,
				tooltip: "Test tooltip",
				items: [new HarveyBallMicroChartItem({
					fraction: 355,
					color: ValueColor.Good,
					fractionLabel: "130",
					fractionScale: "Mln",
					formattedLabel: false
				})]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oHbmc1.destroy();
			this.oHbmc2.destroy();
			this.oHbmc3.destroy();
		}
	});

	QUnit.test("Test alternative text", function(assert) {
		// Act
		var sAltText = this.oHbmc1.getTooltip_AsString();
		// Assert
		assert.equal(sAltText.indexOf("360Mrd") >= 0, true, "AltText should contain total value and scaling factor");
		assert.equal(sAltText.indexOf("130Mln") >= 0, true, "AltText should contain fraction value and scaling factor");
	});

	QUnit.test("Test tooltip text - Custom tooltip including AltText specified", function(assert) {
		// Arrange
		this.oHbmc1.$().trigger("mouseenter");
		// Act
		var sTitle = jQuery.sap.domById("rmc1").title;
		// Assert
		assert.equal(sTitle.indexOf("360Mrd") >= 0, true, "Tooltip should contain total value and scaling factor");
		assert.equal(sTitle.indexOf("130Mln") >= 0, true, "Tooltip should contain fraction value and scaling factor");
		assert.equal(sTitle.indexOf("Cumulative Totals") >= 0, true, "Tooltip should contain custom text");
	});

	QUnit.test("Test tooltip text - Custom tooltip not including AltText specified", function(assert) {
		// Arrange
		this.oHbmc3.$().trigger("mouseenter");
		// Act
		var sTitle = jQuery.sap.domById("rmc3").title;
		// Assert
		assert.equal(sTitle.indexOf("360Mrd") >= 0, true, "Tooltip should contain total value and scaling factor");
		assert.equal(sTitle.indexOf("130Mln") >= 0, true, "Tooltip should contain fraction value and scaling factor");
		assert.equal(sTitle.indexOf("Test tooltip") >= 0, true, "Tooltip should contain custom text");
	});

	QUnit.test("Test tooltip text - No tooltip specified", function(assert) {
		// Arrange
		this.oHbmc2.$().trigger("mouseenter");
		// Act
		var sTitle = jQuery.sap.domById("rmc2").title;
		// Assert
		assert.equal(sTitle.indexOf("355Mrd") >= 0, true, "Tooltip should contain total value and scaling factor");
		assert.equal(sTitle.indexOf("240Mln") >= 0, true, "Tooltip should contain fraction value and scaling factor");
	});

	QUnit.module("Null Values check", {
		beforeEach : function() {
			this.oChart = new HarveyBallMicroChart("chart", {
				size: "M",
				total: 355,
				totalLabel: "360",
				totalScale: "Mrd",
				formattedLabel: false,
				showTotal: true,
				showFractions: true,
				tooltip: "Cumulative Totals\n\\((AltText\\))\ncalculated in EURO",
				items: [new HarveyBallMicroChartItem({
					fraction: 125,
					color: ValueColor.Good,
					formattedLabel: false
				})]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Rendered, without error", function(assert) {
		assert.ok(this.oChart.$().length > 0, "control 1 was rendered");
	});

	QUnit.module("Responsiveness tests", {
		beforeEach : function() {
			this.oChart = new HarveyBallMicroChart("mChart", {
				total: 355,
				isResponsive: true,
				totalLabel: "360",
				totalScale: "Mrd",
				formattedLabel: false,
				showTotal: true,
				showFractions: true,
				tooltip: "Cumulative Totals\n\\((AltText\\))\ncalculated in EURO",
				items: [new HarveyBallMicroChartItem({
					fraction: 125,
					color: ValueColor.Good,
					fractionLabel: "130",
					fractionScale: "Mln",
					formattedLabel: false
				})]
			});
			this.oFlexBox = new FlexBox("flexbox", {
				height: "50px",
				width: "50px",
				items: [this.oChart],
				renderType: "Bare"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function () {
			this.oFlexBox.destroy();
			this.oChart.destroy();
		}
	});

	QUnit.test("Text disappears when the container is smaller then chart with text", function(assert) {
		// Arrange
		var sDisplayNone = "none";
		var sChartStyle = this.oChart.$().css("display");
		var sTextStyle = this.oChart.$().find(".sapSuiteHBMCTextContainer").css("display");

		// Assert
		assert.notEqual(sChartStyle, sDisplayNone, "Chart is displayed");
		assert.equal(sTextStyle, sDisplayNone, "Text is hidden");
		this.oFlexBox.setWidth("200px");
	});

	QUnit.test("Text appears when the container is big enough", function(assert) {
		this.oFlexBox.setWidth("200px");
		this.oFlexBox.rerender();

		var sDisplayNone = "none";
		var sChartStyle = this.oChart.$().css("display");
		var sTextStyle = this.oChart.$().find(".sapSuiteHBMCTextContainer").css("display");

		// Assert
		assert.notEqual(sChartStyle, sDisplayNone, "Chart is displayed");
		assert.notEqual(sTextStyle, sDisplayNone, "Text is displayed");
	});

	QUnit.test("Test that chart svg is without shadow if height < 56px", function(assert) {
		this.oFlexBox.setHeight("55px");
		this.oFlexBox.rerender();

		// Assert
		var sVisibilityHidden = "hidden";
		var sSvgShadow = this.oChart.$().find(".sapSuiteHBMCBackgroundCircle").css("visibility");
		assert.equal(sSvgShadow, sVisibilityHidden, "Svg shadow is hidden");
	});

	QUnit.module("Responsiveness adjustments for the use within GenericTile", {
		beforeEach: function() {
			this.oChart = new HarveyBallMicroChart().addStyleClass("sapUiSmallMargin");
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

	QUnit.module("Tooltip behavior", {
		beforeEach: function() {
			this.oChart = new HarveyBallMicroChart();
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
					cells : [new HarveyBallMicroChart({
						total: 4.20,
						totalLabel: "Some value",
						totalScale: "M",
						items : [new HarveyBallMicroChartItem({
							fractionLabel: "Some fraction",
							fractionScale: "Some scale"
						})]
					})]
				})
			}
		}).setModel(oModel);
		//Act
		sap.ui.getCore().applyChanges();
		var oChart = oTable.getItems()[0].getCells()[0];
		//Assert
		assert.ok(oChart.getTooltip_AsString(), "Tooltip is empty, default tooltip as string appears");
		assert.notOk(oChart.isBound("tooltip"), "Tooltip is bound");
		//Cleanup
		oTable.destroy();
		oModel.destroy();
	});

	QUnit.module("Internal methods tests", {
		beforeEach : function() {
			this.oChart = new HarveyBallMicroChart("mChart", {
				total : 100,
				totalScale: "Mrd",
				items : [new HarveyBallMicroChartItem({
					fractionLabel: "Some fraction",
					fractionScale: "Some scale"
				})]
			}).placeAt("qunit-fixture");
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method _isValidColor", function(assert) {
		//Arrange
		this.oChart.setColorPalette(["someColor"]);
		var oSpy = sinon.spy(ValueCSSColor, "isValid");
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(oSpy.calledWith("someColor"), "Validator sap.m.ValueCSSColor called with correct parameter");
	});

	QUnit.module("Title attribute is added and removed when mouse enters and leaves", {
		beforeEach: function() {
			this.oChart = new HarveyBallMicroChart("mChart", {
				total : 100,
				totalScale: "Mrd",
				items : [new HarveyBallMicroChartItem({
					fractionLabel: "Some fraction",
					fractionScale: "Some scale"
				})]
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
		assert.equal(this.oChart.$().attr("aria-label"), this.oChart.getTooltip_AsString(), "The aria-label includes custom tooltip");
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

	QUnit.module("Static functions");

	QUnit.test("Function _truncateValue with less than 5 digits", function(assert) {
		//Arrange
		//Act
		var sResult = HarveyBallMicroChart._truncateValue("100", 5);

		//Assert
		assert.equal(sResult, "100", "The value string has been correctly truncated.");
	});

	QUnit.test("Function _truncateValue with more than 5 digits", function(assert) {
		//Arrange
		//Act
		var sResult = HarveyBallMicroChart._truncateValue("1000000", 5);

		//Assert
		assert.equal(sResult, "10000", "The value string has been correctly truncated.");
	});

	QUnit.test("Function _truncateValue with 5 digits and a decimal point", function(assert) {
		//Arrange
		//Act
		var sResult = HarveyBallMicroChart._truncateValue("1000.5", 5);

		//Assert
		assert.equal(sResult, "1000", "The value string has been correctly truncated.");
	});

	QUnit.test("Function _truncateValue with 5 digits, a decimal point and two decimals", function(assert) {
		//Arrange
		//Act
		var sResult = HarveyBallMicroChart._truncateValue("100.55", 5);

		//Assert
		assert.equal(sResult, "100.5", "The value string has been correctly truncated.");
	});

	QUnit.module("Control provides accessibility information", {
		beforeEach : function() {
			this.oChart = new HarveyBallMicroChart();
			this.oChart.setAggregation("tooltip", "HarveyBallMicroChart");
		},
		afterEach : function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method getAccessibilityInfo returns correct information", function(assert) {
		// Arrange
		var oExpectedAccessibilityInformation = {
			description: "HarveyBallMicroChart",
			type: this.oChart._getAccessibilityControlType()
		};

		// Act
		var oAccessibilityInformation = this.oChart.getAccessibilityInfo();

		// Assert
		assert.deepEqual(oAccessibilityInformation, oExpectedAccessibilityInformation, "An object with the correct properties has been returned.");
	});

	QUnit.module("Rendering tests for no data placeholder", {
		beforeEach: function() {
			this.oChart = new HarveyBallMicroChart("harveyBallMicroChart").placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("No data rendered when no items given", function(assert) {
		assert.ok(jQuery.sap.domById("harveyBallMicroChart"), "Control was rendered");
		var a$NoDataElement = jQuery.sap.byId(this.oChart.getId()).find(".sapSuiteUiMicroChartNoData");
		assert.equal(a$NoDataElement.length, 1, "No data placeholder shold be rendered");
	});

	QUnit.test("No data in aria-label", function(assert) {
		assert.equal(this.oChart.$().attr("role"), "img", "chart aria role was rendered successfully");
		assert.ok(this.oChart.$().attr("aria-label").indexOf("No data") > -1, "The aria-label includes no data");
	});

	TestUtils.initSizeModule(HarveyBallMicroChart, "sapSuiteHBMCSize");
});

