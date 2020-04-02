sap.ui.define([
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/viz/ui5/controls/VizFrame",
	"sap/suite/ui/commons/ChartContainer"
], function(ChartContainerContent, VizFrame, ChartContainer) {
	"use strict";

	QUnit.module("Public property getters/setters", {
		beforeEach : function() {
			this.oVizFrameContent = new ChartContainerContent("chartContainerContentPropertyGettersSetters",{
				content : new VizFrame("vizFramePropertyGettersSetters")
			});
			this.oChartContainer = new ChartContainer("chartContainerPropertyGettersSetters", {
				content : this.oVizFrameContent
			});
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("SetFullScreen returns when the control is not rendered", function(assert) {
		this.oChartContainer._bControlNotRendered = true;

		var stubGetFullScreen = sinon.stub(this.oChartContainer, "getFullScreen");
		var stubGetProperty = sinon.stub(this.oChartContainer, "getProperty");
		var stubToggleFullScreen = sinon.stub(this.oChartContainer, "_toggleFullScreen");

		var oChartContainer = this.oChartContainer.setFullScreen();

		assert.ok(stubGetFullScreen.notCalled, "getFullScreen not called");
		assert.ok(stubGetProperty.notCalled, "getProperty not called");
		assert.ok(stubToggleFullScreen.notCalled, "_toggleFullScreen not called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetFullScreen returns when the control is rendered and the same fullScreen value is passed", function(assert) {
		this.oChartContainer._bControlNotRendered = false;

		var bFullScreen = true;

		var stubGetFullScreen = sinon.stub(this.oChartContainer, "getFullScreen").returns(bFullScreen);
		var stubGetProperty = sinon.stub(this.oChartContainer, "getProperty");
		var stubToggleFullScreen = sinon.stub(this.oChartContainer, "_toggleFullScreen");

		var oChartContainer = this.oChartContainer.setFullScreen(bFullScreen);

		assert.ok(stubGetFullScreen.called, "getFullScreen called");
		assert.ok(stubGetProperty.notCalled, "getProperty not called");
		assert.ok(stubToggleFullScreen.notCalled, "_toggleFullScreen not called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetFullScreen returns when the control is rendered and the same proeprty value is passed", function(assert) {
		this.oChartContainer._bControlNotRendered = false;

		var bFullScreen = true;

		var stubGetFullScreen = sinon.stub(this.oChartContainer, "getFullScreen").returns(false);
		var stubGetProperty = sinon.stub(this.oChartContainer, "getProperty").returns(true);
		var stubToggleFullScreen = sinon.stub(this.oChartContainer, "_toggleFullScreen");

		var oChartContainer = this.oChartContainer.setFullScreen(bFullScreen);

		assert.ok(stubGetFullScreen.called, "getFullScreen called");
		assert.ok(stubGetProperty.called, "getProperty called");
		assert.ok(stubGetProperty.calledWith("fullScreen"), "_getProperty called with string 'fullScreen'");
		assert.ok(stubToggleFullScreen.notCalled, "_toggleFullScreen not called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetFullScreen calls toggleFullScreen when the control is rendered and the opposite value is passed", function(assert) {
		this.oChartContainer._bControlNotRendered = false;

		var bFullScreen = true;

		var stubGetFullScreen = sinon.stub(this.oChartContainer, "getFullScreen").returns(false);
		var stubGetProperty = sinon.stub(this.oChartContainer, "getProperty").returns(false);
		var stubToggleFullScreen = sinon.stub(this.oChartContainer, "_toggleFullScreen");

		var oChartContainer = this.oChartContainer.setFullScreen(bFullScreen);

		assert.ok(stubGetFullScreen.called, "getFullScreen called");
		assert.ok(stubGetProperty.called, "getProperty called");
		assert.ok(stubGetProperty.calledWith("fullScreen"), "_getProperty called with string 'fullScreen'");
		assert.ok(stubToggleFullScreen.called, "_toggleFullScreen called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetTitle returns if the same value is passed", function(assert) {
		var sTitle = "testTitle";

		var stubGetTitle = sinon.stub(this.oChartContainer, "getTitle").returns(sTitle);
		var stubSetText = sinon.stub(this.oChartContainer._oChartTitle, "setText");
		var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");

		var oChartContainer = this.oChartContainer.setTitle(sTitle);

		assert.ok(stubGetTitle.called, "getTitle called");
		assert.ok(stubSetText.notCalled, "setText on the chart title control not called");
		assert.ok(stubSetProperty.notCalled, "setProperty not called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetTitle changes title property if not the same value is passed", function(assert) {
		var sTitle = "testTitle";

		var stubGetTitle = sinon.stub(this.oChartContainer, "getTitle");
		var stubSetText = sinon.stub(this.oChartContainer._oChartTitle, "setText");
		var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");

		var oChartContainer = this.oChartContainer.setTitle(sTitle);

		assert.ok(stubGetTitle.called, "getTitle called");
		assert.ok(stubSetText.called, "setText on the chart title control called");
		assert.ok(stubSetText.calledWith(sTitle), "setText on the chart title control called with the passed title");
		assert.ok(stubSetProperty.called, "setProperty called");
		assert.ok(stubSetProperty.calledWith("title", sTitle, true), "setProperty setter called correctly");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetShowLegendButton returns if the same value is passed", function(assert) {
		var bShowLegendButton = true;

		var stubGetShowLegendButton = sinon.stub(this.oChartContainer, "getShowLegendButton").returns(true);
		var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");
		var stubSetShowLegend = sinon.stub(this.oChartContainer, "setShowLegend");

		var oChartContainer = this.oChartContainer.setShowLegendButton(bShowLegendButton);

		assert.ok(stubGetShowLegendButton.called, "getShowLegendButton called");
		assert.ok(stubGetShowLegendButton.calledOnce, "getShowLegendButton called once");
		assert.ok(stubSetProperty.notCalled, "setProperty not called");
		assert.ok(stubSetShowLegend.notCalled, "setShowLegend not called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetShowLegendButton sets the property if not the same value (false) is passed", function(assert) {
		var bShowLegendButton = false;

		var stubGetShowLegendButton = sinon.stub(this.oChartContainer, "getShowLegendButton").returns(true);
		var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");
		var stubSetShowLegend = sinon.stub(this.oChartContainer, "setShowLegend");

		var oChartContainer = this.oChartContainer.setShowLegendButton(bShowLegendButton);

		assert.ok(stubGetShowLegendButton.called, "getShowLegendButton called");
		assert.ok(stubGetShowLegendButton.calledTwice, "getShowLegendButton called once");
		assert.ok(stubSetProperty.called, "setProperty not called");
		assert.ok(stubSetProperty.calledWith("showLegendButton", bShowLegendButton, true), "setProperty setter called properly");
		assert.ok(stubSetShowLegend.notCalled, "setShowLegend not called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetShowLegendButton sets the property if not the same value (true) is passed", function(assert) {
		var bShowLegendButton = true;

		var stubGetShowLegendButton = sinon.stub(this.oChartContainer, "getShowLegendButton").returns(false);
		var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");
		var stubSetShowLegend = sinon.stub(this.oChartContainer, "setShowLegend");

		var oChartContainer = this.oChartContainer.setShowLegendButton(bShowLegendButton);

		assert.ok(stubGetShowLegendButton.called, "getShowLegendButton called");
		assert.ok(stubGetShowLegendButton.calledTwice, "getShowLegendButton called once");
		assert.ok(stubSetProperty.called, "setProperty called");
		assert.ok(stubSetProperty.calledWith("showLegendButton", bShowLegendButton, true), "setProperty setter called properly");
		assert.ok(stubSetShowLegend.called, "setShowLegend called");
		assert.ok(stubSetShowLegend.calledWith(false), "setShowLegend called with false");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetSelectorGroupLabel returns if the same value is passed", function(assert) {
		var sSelectorGroupLabel = "testSelectorGroupLabel";

		var stubGetSelectorGroupLabel = sinon.stub(this.oChartContainer, "getSelectorGroupLabel").returns(sSelectorGroupLabel);
		var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");

		var oChartContainer = this.oChartContainer.setSelectorGroupLabel(sSelectorGroupLabel);

		assert.ok(stubGetSelectorGroupLabel.called, "getSelectorGroupLabel called");
		assert.ok(stubSetProperty.notCalled, "setProperty not called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetSelectorGroupLabel sets the property if not the same value is passed", function(assert) {
		var sSelectorGroupLabel = "testSelectorGroupLabel";

		var stubGetSelectorGroupLabel = sinon.stub(this.oChartContainer, "getSelectorGroupLabel");
		var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");

		var oChartContainer = this.oChartContainer.setSelectorGroupLabel(sSelectorGroupLabel);

		assert.ok(stubGetSelectorGroupLabel.called, "getSelectorGroupLabel called");
		assert.ok(stubSetProperty.calledWith("selectorGroupLabel", sSelectorGroupLabel, true), "setProperty setter called properly");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetShowLegend returns if the same value is passed", function(assert) {
		var bSetShowLegend = true;

		var stubGetShowLegend = sinon.stub(this.oChartContainer, "getShowLegend").returns(bSetShowLegend);
		var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");
		var stubSetShowLegendForAllCharts = sinon.stub(this.oChartContainer, "_setShowLegendForAllCharts");

		var oChartContainer = this.oChartContainer.setShowLegend(bSetShowLegend);

		assert.ok(stubGetShowLegend.called, "getShowLegendButton called");
		assert.ok(stubSetProperty.notCalled, "setProperty not called");
		assert.ok(stubSetShowLegendForAllCharts.notCalled, "_setShowLegendForAllCharts not called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.test("SetShowLegend sets the property if not the same value is passed", function(assert) {
		var bSetShowLegend = true;

		var stubGetShowLegend = sinon.stub(this.oChartContainer, "getShowLegend").returns(false);
		var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");
		var stubSetShowLegendForAllCharts = sinon.stub(this.oChartContainer, "_setShowLegendForAllCharts");

		var oChartContainer = this.oChartContainer.setShowLegend(bSetShowLegend);

		assert.ok(stubGetShowLegend.called, "getShowLegendButton called");
		assert.ok(stubSetProperty.called, "setProperty called");
		assert.ok(stubSetProperty.calledWith("showLegend", bSetShowLegend, true), "setProperty setter called properly");
		assert.ok(stubSetShowLegendForAllCharts.called, "_setShowLegendForAllCharts called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "Reference to Chart Container returned");
	});

	QUnit.module("Public API", {
		beforeEach : function() {
			this.oChartContainer = new sap.suite.ui.commons.ChartContainer();
			this.oChartContainer.setTitle("Chart Container");
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	//If no dimensionselectors are available, then 'title' text shold be displayed on the toolbal left side if title is available
	//check title value saved in 'title' property
	QUnit.test("ChartContainer.setTitle", function(assert) {
		var oTitle = this.oChartContainer._oChartTitle;
		assert.strictEqual(oTitle.getText(), "Chart Container", "chartTitle text is Chart Container");
		assert.strictEqual(this.oChartContainer.getTitle(), "Chart Container", "title is Chart Container");
	});

});
