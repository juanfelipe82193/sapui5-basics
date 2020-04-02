/*global QUnit */

sap.ui.define([
	"sap/gantt/simple/BaseCalendar",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/gantt/def/cal/CalendarDefs",
	"sap/gantt/def/cal/Calendar"
], function(BaseCalendar, GanttChartWithTable, CalendarDefs, Calendar) {
	"use strict";

	var oGantt = new GanttChartWithTable({
		calendarDef: new CalendarDefs({
		})
	});

	QUnit.module("Create calendar shape.", {
		beforeEach: function () {
			this.oCalendar = new BaseCalendar({
				calendarName : "PublicHoliday"
			});

			this.stub = window.sinon.stub(this.oCalendar, "getGanttChartBase");
			this.stub.returns(oGantt);
		},
		afterEach: function () {
			this.oCalendar = undefined;
			oGantt.destroy();
			this.stub.restore();
		}
	});

	QUnit.test("Test get<Property>() methods." , function (assert) {
		assert.strictEqual(this.oCalendar.getX(), 0);
		assert.strictEqual(this.oCalendar.getWidth(), oGantt.iGanttRenderedWidth);
		assert.strictEqual(this.oCalendar.getFill(), "url(#" + oGantt.sId + "_PublicHoliday)");
	});

});
