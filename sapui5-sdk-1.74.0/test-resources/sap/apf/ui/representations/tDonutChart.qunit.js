/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap, jQuery, QUnit, sinon */

sap.ui.define("sap/apf/ui/representations/tDonutChart.qunit", [
	"sap/apf/ui/representations/BaseVizFrameChartRepresentation",
	"sap/apf/ui/representations/donutChart"
], function(BaseVizFrameChartRepresentation, DonutChart) {
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
			this.donutChart = new DonutChart(oApiStubbed, oParametersStubbed);
		},
		afterEach: function () {
		}
	});

	QUnit.test("Instantiation", function(assert){
		assert.strictEqual(this.donutChart.type, "DonutChart", "then type set correctly");
		assert.strictEqual(this.donutChart.chartType, "donut", "then chartType set correctly");
		this.stub.restore();
	});

	QUnit.test("Inheritance BaseVizFrameChartRepresentation", function(assert){
		this.stub.restore();
		assert.strictEqual(this.donutChart.getMainContent, BaseVizFrameChartRepresentation.BaseVizFrameChartRepresentation.prototype.getMainContent, "then getMainContent inherited from BaseVizFrameChartRepresentation");
	});

	QUnit.test("getAxisFeedItemId", function(assert){
		assert.strictEqual(this.donutChart.getAxisFeedItemId("sectorColor"), "color", "then correct axisFeedItemId returned for color");
		assert.strictEqual(this.donutChart.getAxisFeedItemId("sectorSize"), "size", "then correct axisFeedItemId returned for size");
		assert.strictEqual(this.donutChart.getAxisFeedItemId("default"), undefined, "then correct axisFeedItemId returned for default");
		this.stub.restore();
	});
});
