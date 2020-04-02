/*global QUnit, sinon */
/*eslint no-undef:1, no-unused-vars:1, strict: 1 */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/me/Calendar",
	"sap/me/CalendarRenderer",
	"sap/ui/thirdparty/jquery",
	"sap/base/Log"
], function(QUnitUtils, createAndAppendDiv, Calendar, CalendarRenderer, jQuery, Log) {
	"use strict";

	// prepare DOM
	createAndAppendDiv("testContent");
	createAndAppendDiv("target1");
	createAndAppendDiv("target2");


	/**
	 * Each current date comes with an array of offsets.
	 * The array contains the expected result date at the index corresponding at the day-in-week value.
	 */
	var TEST_CASES = [
		{   // Sunday, January 25th 2015
			cd: new Date(2015, 0, 25),
			offsets: [
				new Date(2015, 0, 25, 12, 0, 0), // sun
				new Date(2015, 0, 19, 12, 0, 0), // mon
				new Date(2015, 0, 20, 12, 0, 0), // tue
				new Date(2015, 0, 21, 12, 0, 0), // wed
				new Date(2015, 0, 22, 12, 0, 0), // thu
				new Date(2015, 0, 23, 12, 0, 0), // fri
				new Date(2015, 0, 24, 12, 0, 0)  // sat
			]
		},
		{   // Tuesday, February 3rd 2015
			cd: new Date(2015, 1, 3),
			offsets: [
				new Date(2015, 1, 1, 12, 0, 0), // sun
				new Date(2015, 1, 2, 12, 0, 0), // mon
				new Date(2015, 1, 3, 12, 0, 0), // tue
				new Date(2015, 0, 28, 12, 0, 0), // wed
				new Date(2015, 0, 29, 12, 0, 0), // thu
				new Date(2015, 0, 30, 12, 0, 0), // fri
				new Date(2015, 0, 31, 12, 0, 0)  // sat
			]
		}
	];

	/**
	 * Returns a date as an identifier, in the same manner that the DIV of the calendar are given IDs for each date.
	 * It replaces the spaces characters by dashes "-" in a(n expected) toDateString format.
	 *
	 * @param {Date|string} The Date or the string.
	 * @returns {string} The toDateString, as a valid identifier.
	 */
	function idifyDate(oDateOrString) {
		var idifyiedDate;
		if (typeof oDateOrString.toDateString === "function") {
			idifyiedDate = oDateOrString.toDateString();
		} else {
			idifyiedDate = oDateOrString;
		}
		// the 1st regexp replaces all spaces with a "-"
		// the 2nd replace regexp below is a fix for IE9&10 not padding days < 10 with a zero.
		return idifyiedDate.replace(/ /g, "-").replace(/(-)(\d)(-\d\d\d\d)/, "$10$2$3");
	}

	/**
	 * Validates that the first and last days displayed in the calendar are the expected ones.
	 * It is expected that the first/last day is the first/last in the list of DOM elements.
	 *
	 * The term "ID" below is used loosely, as ui5 prefixes them with the controls' ID.
	 * We only compare the ending parts of the IDs.
	 *
	 * @param {sap.me.Calendar} oCalendar The calendar.
	 * @param {string} idFirstDate The expected ID for the DIV that shows the first day of the calendar.
	 * @param {string} idLastDate The expected ID for the DIV that shows the last day of the calendar.
	 */
	function validateCalendarDom(oCalendar, idFirstDate, idLastDate) {
		// get all the days in the calendar, they are located under the DIV of class sapMeCalendarMonthDays
		// and they all have the sapMeCalendarMonthDay class.
		var firstDomEl = (jQuery("#" + oCalendar.getId()).find(".sapMeCalendarMonthDays").find(".sapMeCalendarMonthDay:first"))[0];
		var secondDomEl = (jQuery("#" + oCalendar.getId()).find(".sapMeCalendarMonthDays").find(".sapMeCalendarMonthDay:last"))[0];
		var fnCheckDomId = function (element, refId) {
			var sElementId = idifyDate(element.id);
			if (sElementId && sElementId.length > 0 && refId && sElementId.toLowerCase().endsWith(refId.toLowerCase())) {
				return true;
			}
			assert.strictEqual(sElementId.slice(-refId.length), refId, "Dates should match");
			return false;
		};

		return fnCheckDomId(firstDomEl, idFirstDate) && fnCheckDomId(secondDomEl, idLastDate);
	}

	/**
	 * Helper to access the new function written to fix issue 1570014358.
	 *
	 * @param {Date} oCurrentDate The current date to use in the calendar.
	 * @param {int} iFirstDayOffset The day of the week on which the calendar starts. O is sunday, 6 is saturday.
	 * @returns {Date} The first date that should be displayed by the calendar.
	 */
	function findFirstDayOfWeek(oCurrentDate, iFirstDayOffset) {
		var oCal = new Calendar({
			singleRow: true,
			currentDate: oCurrentDate.toDateString(),
			firstDayOffset: iFirstDayOffset
		});
		return oCal._getCalendarFirstDate();
	}

	QUnit.test("_getCalendarFirstDate function test - single row", function (assert) {
		 jQuery.each(TEST_CASES, function (index, value) {
			 var i, cd, startDay;
			 for (i = 0; i < 7; i++) {
				 cd = value.cd;
				 startDay = value.offsets[i];
				 assert.strictEqual(findFirstDayOfWeek(cd, i).toDateString(), startDay.toDateString(), "Dates do not match: " + i + ", start date: " + startDay.toDateString());
			 }
		 });
	 });

	QUnit.test("_getCalendarFirstDate function test - non single row", function (assert) {
		sinon.spy(Log, "error");
		var cd = new Date();
		var oCalendar = new Calendar({ singleRow: false, currentDate: cd });
		assert.strictEqual(oCalendar._getCalendarFirstDate().toDateString(), cd.toDateString(), "Input==Output for non single row calendar");
		assert.ok(Log.error.callCount > 0, "_getCalendarFirstDate should log at least one error when called on a non single row calendar");
		Log.error.restore();
		oCalendar.destroy();
	});

	QUnit.test("BCP 1570014358 - Single test (the repro case)", function (assert) {
		var oCalendar = new Calendar({
			weeksPerRow: 2,
			singleRow: true,
			firstDayOffset: 6,
			currentDate: "22 Jan,2015"
		});
		oCalendar.placeAt("testContent");
		sap.ui.getCore().applyChanges();
		assert.strictEqual(validateCalendarDom(oCalendar, "Sat-Jan-17-2015", "Fri-Jan-30-2015"), true, "Calendar DOM in 2015 is not correct");
		oCalendar.destroy();
	});

	QUnit.test("BCP 1570014358 - Multiple tests", function (assert) {
		var oCalendar = new Calendar({
			weeksPerRow: 2,
			singleRow: true
		});
		oCalendar.placeAt("testContent");

		// Each test, we need a current date "cd" and 7 results, one for each 'offset' 0 (sunday) to 6 (saturday), in that order.
		// Each result has a start and end, which are the first and last date shown on the calendar.
		var tests = [
			{
				cd: new Date(2015, 0, 25, 12, 0, 0),
				results: [
					{ start: new Date(2015, 0, 25, 12, 0, 0), end: new Date(2015, 1, 7, 12, 0, 0) }, // sun
					{ start: new Date(2015, 0, 19, 12, 0, 0), end: new Date(2015, 1, 1, 12, 0, 0) }, // mon
					{ start: new Date(2015, 0, 20, 12, 0, 0), end: new Date(2015, 1, 2, 12, 0, 0) }, // tue
					{ start: new Date(2015, 0, 21, 12, 0, 0), end: new Date(2015, 1, 3, 12, 0, 0) }, // wed
					{ start: new Date(2015, 0, 22, 12, 0, 0), end: new Date(2015, 1, 4, 12, 0, 0) }, // thu
					{ start: new Date(2015, 0, 23, 12, 0, 0), end: new Date(2015, 1, 5, 12, 0, 0) }, // fri
					{ start: new Date(2015, 0, 24, 12, 0, 0), end: new Date(2015, 1, 6, 12, 0, 0) }  // sat
				]
			}
		];
		var dayOffset, test, index, expectedResult;
		for (index = 0; index < tests.length; index++) {
			test = tests[index];
			for (dayOffset = 0; dayOffset < 7; dayOffset++) {
				expectedResult = test.results[dayOffset];
				oCalendar.setFirstDayOffset(dayOffset);
				oCalendar.setCurrentDate(test.cd);
				sap.ui.getCore().applyChanges();
				assert.strictEqual(validateCalendarDom(oCalendar, idifyDate(expectedResult.start), idifyDate(expectedResult.end)), true, "Calendar DOM is not correct");
			}
		}

		oCalendar.destroy();
	});
});