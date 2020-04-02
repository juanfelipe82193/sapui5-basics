/*global QUnit */
sap.ui.define(["sap/gantt/drawer/VerticalLine", "sap/ui/base/Object"], function (VerticalLine, BaseObject) {
	"use strict";

	var MockAxisTime = BaseObject.extend("MockAxisTime", {});
	MockAxisTime.prototype.getCurrentTickTimeIntervalKey = function () {
		return '1week';
	};
	MockAxisTime.prototype.getTickTimeIntervalLabel = function () {
		return [
			[],
			[{ value: 0 },
			{ value: 20 },
			{ value: 40 },
			{ value: 60 },
			{ value: 80 }
			]
		];
	};
	MockAxisTime.prototype.getZoomStrategy = function () {
		return {
			//mock axisTimeStrategy
			getTimeLineOption: function () {
				return {
					"1week": {
						innerInterval: {
							unit: sap.gantt.config.TimeUnit.week,
							span: 1,
							range: 90
						},
						largeInterval: {
							unit: sap.gantt.config.TimeUnit.month,
							span: 1,
							format: "LLLL yyyy"
						},
						smallInterval: {
							unit: sap.gantt.config.TimeUnit.week,
							span: 1,
							format: sap.ui.getCore().getConfiguration().getRTL() ? ".d.M" : "d.M."
						}
					}
				};
			}
		};
	};


	var oVerticalLine;
	QUnit.module("VerticalLine TestModule", {
		beforeEach: function () {
			jQuery('<svg id="chart" class="sapGanttChartSvg" width="100" height="200"></svg>').appendTo("body");
			oVerticalLine = new VerticalLine(new MockAxisTime());
			oVerticalLine.drawSvg(d3.select("#chart"));
		},
		afterEach: function () {
			oVerticalLine.destroySvg(d3.select("#chart"));
			oVerticalLine = null;
		}
	});
	QUnit.test("1. Vertical line has class name sapGanttChartVerticalLine", function (assert) {
		var $rect = jQuery('.sapGanttChartSvg').find('.sapGanttChartVerticalLine');
		assert.ok($rect.length === 1, "class name not found");
	});
	QUnit.test("2. Vertical line draw the height same as the browser window", function (assert) {
		var $path = jQuery('.sapGanttChartSvg').find('path');
		var sMoves = $path.attr("d");
		var $parentHeight = jQuery('.sapGanttChartSvg').height();
		// assert.ok($rect.height() === $parent.height(), "vertical line height set correctly");
		assert.ok($path, "path was drawned");
		assert.ok(sMoves, "d attribute is not empty");
		assert.ok(sMoves.indexOf($parentHeight) !== -1, "d attribut has parent height");
	});

	QUnit.test("3. Vertical Line destroy should remove path", function (assert) {
		oVerticalLine.destroySvg(d3.select("#chart"));
		var $path = jQuery('.sapGanttChartSvg').find('path');
		// assert.ok($rect.height() === $parent.height(), "vertical line height set correctly");
		assert.ok($path.length === 0, "vertical line path was removed");
	});
});
