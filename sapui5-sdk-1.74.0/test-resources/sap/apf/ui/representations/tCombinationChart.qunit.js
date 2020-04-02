/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap, jQuery, QUnit, sinon */

sap.ui.define("sap/apf/ui/representations/tCombinationChart.qunit", [
	"sap/apf/ui/representations/BaseVizFrameChartRepresentation",
	"sap/apf/ui/representations/combinationChart"
], function(BaseVizFrameChartRepresentation, CombinationChart) {
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
			this.combinationChart = new CombinationChart(oApiStubbed, oParametersStubbed);
		}
	});

	QUnit.test("Instantiation", function(assert){
		assert.strictEqual(this.combinationChart.type, "CombinationChart", "then type set correctly");
		assert.strictEqual(this.combinationChart.chartType, "combination", "then chartType set correctly");
		this.stub.restore();
	});

	QUnit.test("Inheritance BaseVizFrameChartRepresentation", function(assert){
		this.stub.restore();
		assert.strictEqual(this.combinationChart.getMainContent, BaseVizFrameChartRepresentation.BaseVizFrameChartRepresentation.prototype.getMainContent, "then getMainContent inherited from BaseVizFrameChartRepresentation");
	});

	QUnit.test("getAxisFeedItemId", function(assert){
		assert.strictEqual(this.combinationChart.getAxisFeedItemId("xAxis"), "categoryAxis", "then correct axisFeedItemId returned for xAxis");
		assert.strictEqual(this.combinationChart.getAxisFeedItemId("legend"), "color", "then correct axisFeedItemId returned for legend");
		assert.strictEqual(this.combinationChart.getAxisFeedItemId("yAxis"), "valueAxis", "then correct axisFeedItemId returned for yAxis");
		assert.strictEqual(this.combinationChart.getAxisFeedItemId("default"), undefined, "then correct axisFeedItemId returned for default");
		this.stub.restore();
	});
});
