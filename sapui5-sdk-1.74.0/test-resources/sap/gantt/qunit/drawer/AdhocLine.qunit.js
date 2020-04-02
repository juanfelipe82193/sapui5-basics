/*global QUnit */
sap.ui.define([
	"sap/gantt/drawer/AdhocLine",
	"sap/gantt/AdhocLine",
	"sap/gantt/misc/AxisTime",
	"sap/gantt/misc/Format"
], function (AdhocLineDrawer, AdhocLine, AxisTime, Format) {
	"use strict";
	QUnit.module("AdhocLine TestModule", {
		beforeEach: function () {
			jQuery('<svg id="chart" class="sapGanttChartSvg" width="100" height="200"></svg>').appendTo("body");
			var aTimeRange = [Format.getTimeStampFormatter().parse("20170101000000"),
			Format.getTimeStampFormatter().parse("20170311000000")];
			this.oAdhocLineDrawer = new AdhocLineDrawer(new AxisTime(aTimeRange, [0, 200], 1));

			var aAdhocLines = [
				new AdhocLine({
					stroke: "#f2f2f2",
					strokeWidth: 3,
					strokeDasharray: "6,4",
					timeStamp: "20170215000000",
					description: "Product Release."
				}), new AdhocLine({
					stroke: "#0001FF",
					strokeWidth: 2,
					timeStamp: "20170304000000",
					description: "First Customer."
				})
			];
			var oStatus = {
				aTimeBoundary: [new Date(2017, 0, 3), new Date(2017, 5, 3)]
			};
			this.oAdhocLineDrawer.drawSvg(d3.select("#chart"), aAdhocLines, oStatus, "Bottom");
		},
		afterEach: function () {
			this.oAdhocLineDrawer.destroySvg(d3.select("#chart"));
			this.oAdhocLineDrawer = null;
		}
	});

	QUnit.test("1. Adhoc line has class name sapGanttChartAdhocLine", function (assert) {
		var $rect = jQuery('.sapGanttChartSvg').find('.sapGanttChartAdhocLine');
		assert.ok($rect.length === 1, "sapGanttChartAdhocLine class name is found");
	});

	QUnit.test("2. Adhoc line draw the height same as the browser window", function (assert) {
		var $Lines = jQuery('.sapGanttChartSvg').find('line');
		assert.ok($Lines, "Adhoc lines are drawned");

		var sHeight = $Lines[0].getAttribute("y2");
		var $parentHeight = jQuery('.sapGanttChartSvg').height();
		assert.ok(sHeight == $parentHeight, "Height of adhoc line is correctly");
		assert.strictEqual($Lines[0].getAttribute("stroke"), "#f2f2f2");
		assert.strictEqual($Lines[1].getAttribute("stroke-width"), "2");
	});

	QUnit.test("3. Adhoc Line destroy should remove lines", function (assert) {
		this.oAdhocLineDrawer.destroySvg(d3.select("#chart"));
		var $lines = jQuery('.sapGanttChartSvg').find('line');
		assert.ok($lines.length === 0, "Adhoc lines are removed");
	});
});
