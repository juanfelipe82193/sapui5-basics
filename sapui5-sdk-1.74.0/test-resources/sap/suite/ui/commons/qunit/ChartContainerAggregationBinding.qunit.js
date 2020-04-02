sap.ui.define([
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/viz/ui5/controls/VizFrame",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/ChartContainer"
], function(ChartContainerContent, VizFrame, JSONModel, ChartContainer) {
	"use strict";

	QUnit.module("Aggregation binding with factory function", {
		beforeEach : function() {
			var aChartKeys,
				oModel,
				oFirstVizFrameContent,
				oSecondVizFrameContent;

			oFirstVizFrameContent = new ChartContainerContent("firstChartContainerContent",{
				content : new VizFrame("firstVizFrame")
			});
			oSecondVizFrameContent = new ChartContainerContent("secondChartContainerContent",{
				content : new VizFrame("secondVizFrame")
			});
			this.oChartContainer = new ChartContainer("chartContainer");

			aChartKeys = [
				{
					key : "first"
				},
				{
					key : "second"
				}
			];
			oModel = new JSONModel({
				"chartKeys" : aChartKeys
			});

			this.oChartContainer.setModel(oModel);

			this.oChartContainer.bindAggregation("content", "/chartKeys", function(sId, oContext) {
				var sKey = oContext.getProperty("key");
				if (sKey === "first") {
					return oFirstVizFrameContent;
				} else if (sKey === "second") {
					return oSecondVizFrameContent;
				}
			});

			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("The content aggregation is bound correctly", function(assert) {
		// Arrrange
		// Act
		// Assert
		assert.equal(this.oChartContainer.getContent().length, 2, "There are two contents in the aggregation");
	});

	QUnit.test("Call of public API function addContent", function(assert) {
		// Arrrange
		var oThirdVizFrameContent;
		oThirdVizFrameContent = new ChartContainerContent("thirdChartContainerContent",{
			content : new VizFrame("thirdVizFrame")
		});
		// Act
		this.oChartContainer.addContent(oThirdVizFrameContent);
		// Assert
		assert.equal(this.oChartContainer.getContent().length, 3, "The content aggregation is updated and there are three contents in the aggregation");
	});

	QUnit.test("Call of public API function removeAllAggregation with the aggregation content", function(assert) {
		// Arrrange
		// Act
		this.oChartContainer.removeAllAggregation("content", true);
		// Assert
		assert.equal(this.oChartContainer.getContent().length, 0, "The content aggregation is updated and there are no contents in the aggregation");
	});

});
