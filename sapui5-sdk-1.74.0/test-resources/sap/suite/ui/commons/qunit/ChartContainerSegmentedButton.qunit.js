sap.ui.define([
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/suite/ui/commons/ChartContainer",
	"sap/viz/ui5/controls/VizFrame",
	"sap/m/Table"
], function(ChartContainerContent, ChartContainer, VizFrame, Table) {
	"use strict";

	QUnit.module("Existence of SegmentedButton container depending on the number of charts in ChartContainer", {
		beforeEach : function() {
			this.oVizFrame = new VizFrame();
			this.oVizFrame2 = this.oVizFrame.clone();
			this.oVizFrame3 = this.oVizFrame.clone();

			this.oContent1 = new ChartContainerContent({
				icon : "sap-icon://horizontal-bar-chart",
				title : "vizFrame Bar Chart Sample",
				content : this.oVizFrame
			});
			this.oContent2 = new ChartContainerContent({
				icon : "sap-icon://line-chart",
				title : "vizFrame Line Chart Sample",
				content : this.oVizFrame2
			});
			this.oContent3 = new ChartContainerContent({
				icon : "sap-icon://line-chart",
				title : "vizFrame Line Chart Sample",
				content : this.oVizFrame3
			});

			this.oChartContainer = new ChartContainer();
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oVizFrame.destroy();
			this.oVizFrame = null;
			this.oVizFrame2.destroy();
			this.oVizFrame2 = null;
			this.oVizFrame3.destroy();
			this.oVizFrame3 = null;
			this.oContent1.destroy();
			this.oContent1 = null;
			this.oContent2.destroy();
			this.oContent2 = null;
			this.oContent3.destroy();
			this.oContent3 = null;
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("One Chart", function(assert) {
		this.oChartContainer.addContent(this.oContent1);
		sap.ui.getCore().applyChanges();

		var $SegmentedButtons = this.oChartContainer.$().find(".sapMSegBIcons");

		assert.strictEqual($SegmentedButtons.length, 0, "ChartContainer with one chart does not have a segment container");
	});

	QUnit.test("Two Charts", function(assert) {
		this.oChartContainer.addContent(this.oContent1);
		this.oChartContainer.addContent(this.oContent2);
		sap.ui.getCore().applyChanges();

		var $SegmentedButtons = this.oChartContainer.$().find(".sapMSegBIcons");

		assert.strictEqual($SegmentedButtons.length, 1, "ChartContainer with two charts has a segment container");
		assert.ok($SegmentedButtons.children('li')[0], "The first segmented chart button was rendered");
		assert.ok($SegmentedButtons.children('li')[1], "The second segmented chart button was rendered");
	});

	QUnit.test("SegmentedButton should only contain buttons for visible content", function(assert) {
		// Arrange
		this.oChartContainer.addContent(this.oContent1);
		this.oChartContainer.addContent(this.oContent2);
		this.oChartContainer.addContent(this.oContent3);
		sap.ui.getCore().applyChanges();

		// Act
		this.oContent2.setVisible(false);
		this.oChartContainer.updateChartContainer();
		sap.ui.getCore().applyChanges();

		// Assert
		var $SegmentedButtons = this.oChartContainer.$().find(".sapMSegBIcons");
		assert.strictEqual($SegmentedButtons.length, 1, "ChartContainer with three contents has a segment container");
		assert.deepEqual($SegmentedButtons.children('li').length, 2, "Segment Button contains two buttons");
	});

	QUnit.module("Proper initialization of ScrollEnablement depending on the type of content displayed", {
		beforeEach : function() {
			this.oVizFrameContent = new ChartContainerContent({
				content : new VizFrame()
			});
			this.oTableContent = new ChartContainerContent({
				content : new Table()
			});
			this.oChartContainer = new ChartContainer();
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oVizFrameContent.destroy();
			this.oVizFrameContent = null;
			this.oTableContent.destroy();
			this.oTableContent = null;
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("ScrollEnablement with VizFrame", function(assert) {
		//Arrange
		var oScrollEnablement;
		this.oChartContainer.addContent(this.oVizFrameContent);
		//Act
		sap.ui.getCore().applyChanges();
		oScrollEnablement = this.oChartContainer.getScrollDelegate();
		//Assert
		assert.notOk(oScrollEnablement.getHorizontal(), "Horizontal scrollbars are turned off if VizFrame is displayed");
		assert.notOk(oScrollEnablement.getVertical(), "Vertical scrollbars are turned off if VizFrame is displayed");
	});

	QUnit.test("ScrollEnablement with Table", function(assert) {
		//Arrange
		var oScrollEnablement;
		this.oChartContainer.addContent(this.oTableContent);
		//Act
		sap.ui.getCore().applyChanges();
		oScrollEnablement = this.oChartContainer.getScrollDelegate();
		//Assert
		assert.ok(oScrollEnablement.getHorizontal(), "Horizontal scrollbars are turned on if Table is displayed");
		assert.ok(oScrollEnablement.getVertical(), "Vertical scrollbars are turned on if Table is displayed");
	});

});
