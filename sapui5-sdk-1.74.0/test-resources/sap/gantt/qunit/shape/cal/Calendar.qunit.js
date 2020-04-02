/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/Shape",
	"sap/gantt/shape/cal/Calendar",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (Shape, Calendar, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Calendar by GanttChart without properties configurated.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.cal.Calendar"
			});
			// GanttChart object which creates shape instance
			sap.gantt.config.DEFAULT_TIME_AXIS.setPlanHorizon(new TimeHorizon({
				startTime: "20151201000000",
				endTime: "20151231000000"
			}));
			this.oGanttChart = new GanttChart({
				shapes: [this.oShapeConfig]
			});
			// shape instance created by chart
			this.oShape = this.oGanttChart.getShapeInstance("ut");
			// call back parameter
			this.oData = {
				id: "oneAWeek"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 33,
				y: 0,
				uid: "PATH:000|SCHEME:sap_main",
				data: {
					ut: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oShape = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oShape.getTag(this.oData, this.oRowInfo), "rect");
		assert.strictEqual(this.oShape.getIsBulk(this.oData, this.oRowInfo), true);
		assert.strictEqual(this.oShape.getHtmlClass(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getTitle(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getFill(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getCalendarName(this.oData, this.oRowInfo), "nwt");
		assert.strictEqual(this.oShape.getHeight(this.oData, this.oRowInfo), 33);
	});


	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Calendar by GanttChart with properties configurated.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.cal.Calendar",
				shapeProperties: {
					isBulk: true,
					fill: "url(#chart0_oneAWeek)",
					calendarName: "holidayCalendar"
				}
			});
			// GanttChart object which creates shape instance
			sap.gantt.config.DEFAULT_TIME_AXIS.setPlanHorizon(new TimeHorizon({
				startTime: "20151201000000",
				endTime: "20151231000000"
			}));
			this.oGanttChart = new GanttChart({
				shapes: [this.oShapeConfig]
			});
			// shape instance created by GanttChart
			this.oShape = this.oGanttChart.getShapeInstance("ut");
			// call back parameter
			this.oData = {
				id: "oneAWeek"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 33,
				y: 0,
				uid: "PATH:000|SCHEME:sap_main",
				data: {
					ut: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oShape = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oShape.getIsBulk(this.oData, this.oRowInfo), true);
		assert.strictEqual(this.oShape.getFill(this.oData, this.oRowInfo), "url(#chart0_oneAWeek)");
		assert.strictEqual(this.oShape.getCalendarName(this.oData, this.oRowInfo), "holidayCalendar");
		assert.strictEqual(this.oShape.getWidth(this.oData, this.oRowInfo), 0);
		assert.strictEqual(this.oShape.getHeight(this.oData, this.oRowInfo), 33);
		assert.strictEqual(this.oShape.getY(this.oData, this.oRowInfo), 0);
	});

});
