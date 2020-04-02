/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/core/LocaleData",
	"sap/ui/core/date/UniversalDate",
	"sap/me/OverlapCalendar",
	"sap/ui/core/CalendarType",
	"sap/ui/core/library",
	"sap/ui/thirdparty/jquery"
], function(
	qutils,
	createAndAppendDiv,
	LocaleData,
	UniversalDate,
	OverlapCalendar,
	CalendarType,
	coreLibrary,
	jQuery
) {
	"use strict";

	// shortcut for sap.ui.core.CalendarType
	var CalendarType = coreLibrary.CalendarType;

	// prepare DOM
	createAndAppendDiv("target1");
	createAndAppendDiv("target2");
	createAndAppendDiv("overlapCalendarMonthTitles");


	function clickNext(oCalendar) {
		// Accessing private API (_oNextBtn) for testing purposes ONLY.
		oCalendar.getCalendar()._oNextBtn.firePress();
	}

	QUnit.test("BCP 0120025231 0000738147 2015", function (assert) {
		var oCalendar = new OverlapCalendar(),
				date1 = new Date("Mon Oct 05 2015 00:00:00 GMT+1100 (AUS Eastern Daylight Time)"),
				date2 = new Date("Tue Sep 29 2015 00:00:00 GMT+1000 (AUS Eastern Standard Time)"),
				expectedResult = 6;
		assert.equal(oCalendar._getRawDaysDifference(date1, date2), expectedResult, "Should be 6 days difference");
		oCalendar.destroy();
	});

	QUnit.test("BCP 0120025231 0000919744 2015", function (assert) {
		var oCalendar = new OverlapCalendar(),
				data = [
					{input: new Date("Mon Oct 05 2015 06:00:00 GMT-0100"), expectedDay: 5, expectedHour:12},
					{input: new Date(Date.UTC(2015, 9, 5, 3, 0, 0)), expectedDay: 5, expectedHour:12},
					{input: new Date("Tue Sep 29 2015 08:00:00 GMT-0100"), expectedDay: 29, expectedHour:12},
					{input: new Date(Date.UTC(2015, 8, 29, 3, 0, 0)), expectedDay: 29, expectedHour:12}],
				date, k;
		for (k = 0; k < data.length; ++k) {
			date = oCalendar._createDateInDays(data[k].input);
			assert.equal(date.getDate(), data[k].expectedDay, "Date #" + k + " should match.");
			assert.equal(date.getHours(), data[k].expectedHour, "Hour #" + k + " should match.");
		}
		oCalendar.destroy();
	});

	QUnit.test("BCP 0120025231 0000114166 2016", function (assert) {
		var oCalendar = new OverlapCalendar();
		var _changeDatesForCalendars = function (event) {
			oCalendar.setStartDate(event.getParameter("firstDate"));
			// the line above was throwing an exception, whose message was:
			// "NaN" is of type number, expected int for property "firstDayOffset" of Element sap.me.Calendar#__calendar5
			assert.ok(true);
		};
		oCalendar.attachChangeDate(_changeDatesForCalendars, oCalendar);
		clickNext(oCalendar);
		oCalendar.destroy();
	});

	QUnit.test("OverlapCalendar should emit events with Date objects, not UniversalDate", function (assert) {
		assert.expect(2);
		var oCalendar = new OverlapCalendar();
		var onChangeStartDate = function (oEvent) {
			assert.equal(oEvent.getParameter("firstDate") instanceof Date, true, "firstDate should be a Date");
			assert.equal(oEvent.getParameter("endDate") instanceof Date, true, "endDate should be a Date");
		};
		oCalendar.attachChangeDate(onChangeStartDate, oCalendar);
		clickNext(oCalendar);
		oCalendar.destroy();
	});

	QUnit.test("Month Titles - BCP 002075129500003097872016", function (assert) {
		var oCalendar = new OverlapCalendar({
			id: "monthTitleCalendar",
			startDate: '2016-08-29',
			firstDayOffset: 3,
			weeksPerRow: 2
		});
		var getMonthTitleDivText = function () {
			sap.ui.getCore().applyChanges();
			var monthTitleDiv = jQuery("#monthTitleCalendar").find(".sapMeCalendarMonthName")[0];
			return monthTitleDiv.innerText;
		};
		oCalendar.placeAt("overlapCalendarMonthTitles");
		assert.equal(getMonthTitleDivText(), "Aug – Sep 2016", "There should be an interval displayed spanning from August to September 2016");
		oCalendar.setStartDate("2016-12-28");
		assert.equal(getMonthTitleDivText(), "Dec 2016 – Jan 2017", "There should be an interval displayed spanning from December 2016 to January 2017");
	});

	QUnit.module("Islamic Date in OverlapCalendar", {
		beforeEach: function() {
			// switch the calendar type to Islamic so that UniversalDate use the IslamicDate
			sap.ui.getCore().getConfiguration().setCalendarType(CalendarType.Islamic);
		},
		afterEach: function() {
			sap.ui.getCore().getConfiguration().setCalendarType(null);
		}
	});

	// Events were not shown in the OverlapCalendar because the toDateString function is not implemented on
	// IslamicDate. This call to toDateString was replaced by a call to getTime instead.
	QUnit.test("toDateString is not implemented in Islamic Calendar in 1.28", function (assert) {
		var date = new UniversalDate();
		// Accessing private API (_ctorSafeDate) for testing purposes ONLY.
		var safeDate = OverlapCalendar._ctorSafeDate(date);

		assert.notEqual(date.toDateString(), undefined, "toDateString of an IslamicDate is no more undefined after and including 1.34");
		assert.notEqual(safeDate, undefined, "ctorSafeDate of an Islamic Date should not be undefined");
		assert.equal(typeof safeDate, "number", "ctorSafeDate of an Islamic Date should be a number");
	});
});