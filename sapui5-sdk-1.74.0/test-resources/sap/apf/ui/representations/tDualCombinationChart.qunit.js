/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap, jQuery, QUnit, sinon */

sap.ui.define("sap/apf/ui/representations/tDualCombinationChart.qunit", [
	"sap/apf/ui/representations/BaseVizFrameChartRepresentation",
	"sap/apf/ui/representations/dualCombinationChart"
], function(BaseVizFrameChartRepresentation, DualCombinationChart) {
	"use strict";

	/*BEGIN_TEMPORARY_FIX*/
	var BaseVizFrameChartRepresentation = sap.apf.ui.representations;
	/*END_TEMPORARY_FIX*/

	QUnit.module("Donut Chart", {
		beforeEach: function (assert) {
			var oApiStubbed = "stubbedAPI";
			var oParametersStubbed = "stubbedParameters";

			this.stub = sinon.stub(BaseVizFrameChartRepresentation, "BaseVizFrameChartRepresentation", function (oApi, oParameters) {
				assert.strictEqual(oApi, oApiStubbed, "then oApi correctly handed over to BaseVizFrameChartRepresentation");
				assert.strictEqual(oParameters, oParametersStubbed, "then oParameters correctly handed over to BaseVizFrameChartRepresentation");
			});
			this.dualCombinationChart = new DualCombinationChart(oApiStubbed, oParametersStubbed);
		}
	});

	QUnit.test("Instantiation", function(assert){
		assert.strictEqual(this.dualCombinationChart.type, "DualCombinationChart", "then type set correctly");
		assert.strictEqual(this.dualCombinationChart.chartType, "dual_combination", "then chartType set correctly");
		this.stub.restore();
	});

	QUnit.test("Inheritance BaseVizFrameChartRepresentation", function(assert){
		this.stub.restore();
		assert.strictEqual(this.dualCombinationChart.getMainContent, BaseVizFrameChartRepresentation.BaseVizFrameChartRepresentation.prototype.getMainContent, "then getMainContent inherited from BaseVizFrameChartRepresentation");
	});

	QUnit.test("getAxisFeedItemId", function(assert){
		assert.strictEqual(this.dualCombinationChart.getAxisFeedItemId("xAxis"), "categoryAxis", "then correct axisFeedItemId returned for xAxis");
		assert.strictEqual(this.dualCombinationChart.getAxisFeedItemId("legend"), "color", "then correct axisFeedItemId returned for legend");
		assert.strictEqual(this.dualCombinationChart.getAxisFeedItemId("yAxis"), "valueAxis", "then correct axisFeedItemId returned for yAxis");
		assert.strictEqual(this.dualCombinationChart.getAxisFeedItemId("yAxis2"), "valueAxis2", "then correct axisFeedItemId returned for yAxis2");
		assert.strictEqual(this.dualCombinationChart.getAxisFeedItemId("default"), undefined, "then correct axisFeedItemId returned for default");
		this.stub.restore();
	});
});
