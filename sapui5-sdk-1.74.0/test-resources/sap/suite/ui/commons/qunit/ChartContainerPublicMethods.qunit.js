sap.ui.define([
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/suite/ui/commons/ChartContainer",
	"sap/viz/ui5/controls/VizFrame"
], function(ChartContainerContent, ChartContainer, VizFrame) {
	"use strict";

	QUnit.module("Public methods", {
		beforeEach : function() {
			this.oVizFrameContent = new ChartContainerContent("chartContainerContent",{
				content : new VizFrame("vizFramePublicMethods")
			});
			this.oChartContainer = new ChartContainer("chartContainerPublicMethods", {
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

	QUnit.test("getSelectedContent returns _oSelectedContent", function(assert) {
		var sSelectedContent = "testSelectedContent";
		this.oChartContainer._oSelectedContent = sSelectedContent;

		var sReturnedValue = this.oChartContainer.getSelectedContent();

		assert.equal(sReturnedValue, sSelectedContent, "Property returned correctly");

		this.oChartContainer._oSelectedContent = null;
	});

	QUnit.test("getScrollDelegate returns _oScrollEnablement", function(assert) {
		var sScrollEnablement = "testScrollEnablement";
		this.oChartContainer._oScrollEnablement = sScrollEnablement;

		var sReturnedValue = this.oChartContainer.getScrollDelegate();

		assert.equal(sReturnedValue, sScrollEnablement, "Property returned correctly");

		this.oChartContainer._oScrollEnablement = null;
	});

	QUnit.test("switchChart switches the current chart", function(assert) {
		var sChart = "testChart";

		var stubSetSelectedContent = sinon.stub(this.oChartContainer, "_setSelectedContent");
		var stubRerender = sinon.stub(this.oChartContainer, "rerender");

		this.oChartContainer.switchChart(sChart);

		assert.ok(stubSetSelectedContent.called, "_setSelectedContent called");
		assert.ok(stubSetSelectedContent.calledWith(sChart), "_setSelectedContent called with the passed chart");
		assert.ok(stubRerender.called, "rerender called");
	});

	QUnit.test("updateChartContainer updates chart content has changed flag and re-renders the control", function(assert) {
		this.oChartContainer._bChartContentHasChanged = false;

		var stubRerender = sinon.stub(this.oChartContainer, "rerender");

		var oChartContainer = this.oChartContainer.updateChartContainer();

		assert.ok(stubRerender.called, "rerender called");
		assert.equal(true, this.oChartContainer._bChartContentHasChanged, "_bChartContentHasChanged set to true");
		assert.deepEqual(this.oChartContainer, oChartContainer, "reference to this returned");
	});

	QUnit.test("setWidth: Setter for width property. Should also update width in the DOM.", function(assert) {
		var sWidthToSet = "10px";

		var oSetPropertyStub = sinon.stub(this.oChartContainer, "setProperty");
		sinon.stub(this.oChartContainer, "getWidth").returns(sWidthToSet);
		var oCSSStub = sinon.stub();
		sinon.stub(this.oChartContainer, "$").returns({
			css: oCSSStub
		});

		var oChartContainer = this.oChartContainer.setWidth(sWidthToSet);

		assert.ok(oSetPropertyStub.calledWith("width", sWidthToSet, true), "Width property set to " + sWidthToSet);
		assert.ok(oCSSStub.calledWith("width", sWidthToSet), "Inline style for width set to " + sWidthToSet);
		assert.deepEqual(this.oChartContainer, oChartContainer, "reference to this returned");
	});

});
