/*global QUnit */
sap.ui.define([
	"sap/suite/ui/microchart/InteractiveDonutChartSegment",
	"sap/suite/ui/microchart/InteractiveDonutChart"
], function (InteractiveDonutChartSegment, InteractiveDonutChart) {
	"use strict";

	jQuery.sap.initMobile();


	QUnit.module("InteractiveDonutChartSegment instantiation", {
		beforeEach: function() {
			this.oSegment = new InteractiveDonutChartSegment();
		},
		afterEach: function() {
			this.oSegment.destroy();
			this.oSegment = undefined;
		}
	});

	QUnit.test("InteractiveDonutChartSegment property label", function(assert) {
		assert.equal(this.oSegment.getLabel(), "", "The property label is found and correctly set to the default value");
	});

	QUnit.test("InteractiveDonutChartSegment property color", function(assert) {
		assert.equal(this.oSegment.getColor(), "Neutral", "The property color is found and correctly set to the default value");
	});

	QUnit.test("InteractiveDonutChartSegment property selected", function(assert) {
		assert.notOk(this.oSegment.getSelected(), "The property selected is found and correctly set to the default value");
	});

	QUnit.test("InteractiveDonutChartSegment property displayedValue", function(assert) {
		assert.equal(this.oSegment.getDisplayedValue(), "", "The property displayedValue is found and correctly set to the default value");
	});

	QUnit.test("InteractiveDonutChartSegment property value", function(assert) {
		assert.equal(this.oSegment.getValue(), 0, "The property value is found and correctly set to the default value");
	});

	QUnit.module("InteractiveDonutChartSegment rendering", {
		beforeEach: function() {
			this.oChart = new InteractiveDonutChart({
				segments : [
					new InteractiveDonutChartSegment({
						label : "Phase 1",
						value : 40
					}),
					new InteractiveDonutChartSegment({
						label : "Phase 2",
						value : 21.5
					}),
					new InteractiveDonutChartSegment({
						label : "Other",
						value : 38.5
					})
				]
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = undefined;
		}
	});

	QUnit.test("InteractiveDonutChartSegment basic layout rendering: legend area", function(assert) {
		var $Segments = this.oChart.$().find(".sapSuiteIDCLegendSegment"),
			$Segment = $Segments.first(),
			aSegments = this.oChart.getSegments();

		assert.equal($Segments.length, aSegments.length, "The legend segment element is having the right number of children");

		assert.equal($Segment.children(".sapSuiteIDCLegendMarker").length, 1, "The legend marker element was rendered successfully");
		assert.equal($Segment.children(".sapSuiteIDCLegendLabelValue").length, 1, "The legend label+value container element was rendered successfully");
		assert.equal($Segment.children(".sapSuiteIDCLegendLabelValue").find(".sapSuiteIDCLegendLabel").length, 1, "The legend label element was rendered successfully");
		assert.equal($Segment.children(".sapSuiteIDCLegendLabelValue").find(".sapSuiteIDCLegendValue").length, 1, "The legend value element was rendered successfully");
	});

	QUnit.test("InteractiveDonutChartSegment standard tooltip", function(assert) {
		var $Segments = this.oChart.$().find(".sapSuiteIDCLegendSegment"),
			$Segment = $Segments.first(),
			aSegments = this.oChart.getSegments();

		assert.equal($Segment.attr("title"), aSegments[0].getTooltip_AsString(), "The segment has the correct tooltip.");
		assert.equal(aSegments[0]._getSegmentTooltip(), "Phase 1: 40", "The tooltip is built correctly.");
	});

	QUnit.test("InteractiveDonutChartSegment custom tooltip", function(assert) {
		//Arrange
		var aSegments = this.oChart.getSegments(),
			oFirstSegment = aSegments[0],
			sCustomTooltip = "Custom Tooltip\ncustom text";
		oFirstSegment.setTooltip(sCustomTooltip);

		//Act
		this.oChart.rerender();

		//Assert
		var $Segments = this.oChart.$().find(".sapSuiteIDCLegendSegment"),
			$FirstSegment = $Segments.first(),
			sFirstSegmentTooltip = $FirstSegment.attr("title");
		assert.equal(sFirstSegmentTooltip, sCustomTooltip, "The first segment has the correct tooltip.");
		assert.equal(oFirstSegment._bCustomTooltip, true, "The first segment has a custom tooltip.");
	});

	QUnit.test("InteractiveDonutChartSegment supress tooltip", function(assert) {
		//Arrange
		var aSegments = this.oChart.getSegments(),
			oFirstSegment = aSegments[0],
			sCustomTooltip = " ";
		oFirstSegment.setTooltip(sCustomTooltip);

		//Act
		this.oChart.rerender();

		//Assert
		var $Segments = this.oChart.$().find(".sapSuiteIDCLegendSegment"),
			$FirstSegment = $Segments.first(),
			sFirstSegmentTooltip = $FirstSegment.attr("title");
		assert.equal(sFirstSegmentTooltip, null, "The first segment has not tooltip.");
	});

	QUnit.test("InteractiveDonutChartSegment N/A tooltip", function(assert) {
		//Arrange
		var aSegments = this.oChart.getSegments(),
			oFirstSegment = aSegments[0];
		oFirstSegment.setValue(null);

		//Act
		this.oChart.rerender();

		//Assert
		var sNAText = this.oChart._oRb.getText("INTERACTIVECHART_NA"),
			sFirstSegmentTooltip = oFirstSegment._getSegmentTooltip();
		assert.equal(sFirstSegmentTooltip, "Phase 1: " + sNAText, "The first segment has the correct tooltip.");
	});
});

