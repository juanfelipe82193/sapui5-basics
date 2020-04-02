/*global QUnit */
sap.ui.define([
	"sap/gantt/drawer/CalendarPattern",
	"sap/gantt/def/cal/CalendarDefs",
	"sap/gantt/def/cal/Calendar",
	"sap/gantt/def/cal/TimeInterval"
], function (CalendarPattern, CalendarDefs, Calendar, TimeInterval) {
	"use strict";

	QUnit.module("CalendarPattern Module", {
		beforeEach: function () {

			jQuery('<svg class="sapGanttChartHeaderSvg" width="1000" height="100"></svg>' +
			'<svg class="sapGanttChartSvg" width="1000" height="500">' +
			  '<defs id="sapGanttChart-calendardefs"/>' +
			'</svg>').appendTo("body");

			this.aTimeIntervalData = [{ "startTime": "20150919000000", "endTime": "20150920000000" },
			{ "startTime": "20150926000000", "endTime": "20150927000000" },
			{ "startTime": "20151003000000", "endTime": "20151004000000" },
			{ "startTime": "20151010000000", "endTime": "20151011000000" }];
			this.aTimeIntervals = [];
			for (var i = 0; i < this.aTimeIntervalData.length; i++) {
				var oTimeInterval = new TimeInterval({
					"startTime": this.aTimeIntervalData[i].startTime,
					"endTime": this.aTimeIntervalData[i].endTime
				});
				this.aTimeIntervals.push(oTimeInterval);
			}
			this.aCalendar = new Calendar({
				"key": "goodHoliday",
				"color": "grey",
				"timeIntervals": this.aTimeIntervals
			});
			this.oCalendarDefs = new CalendarDefs({
				defs: [this.aCalendar]
			});

			var sParentId = "sapGanttChart";
			var oStatusSet = {
				aViewBoundary: [0, 1500]
			};
			var iBaseRowHeight = 32;
			var aSvgBodyNode = d3.selectAll("." + sParentId + "Svg");

			this.oCalendarPattern = new CalendarPattern();
			this.oCalendarPattern.drawSvg(aSvgBodyNode, sParentId, this.oCalendarDefs, oStatusSet, iBaseRowHeight);
		},
		afterEach: function () {
			this.oCalendarPattern = undefined;
			this.aTimeIntervalData = undefined;
			this.aTimeIntervals = undefined;
			this.aCalendar = undefined;
		}
	});
	QUnit.test("CalendarPattern should be drawn correctly", function (assert) {
		var $defs = jQuery('.sapGanttChartSvg').find('defs');
		assert.ok($defs.length === 1, "Defs created");

		var $pattern = jQuery('.sapGanttChartSvg').find('defs').find('pattern');
		assert.ok($pattern.length === 1, "pattern created");

		var $rect = jQuery('.sapGanttChartSvg').find('defs').find('pattern').find('rect');
		assert.ok($rect.length === 4, "Rect created");
	});

});
