/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/me/Calendar",
	"sap/me/CalendarDate",
	"sap/ui/thirdparty/jquery",
	"sap/ui/Device",
	"sap/me/library",
	"sap/base/Log"
], function(
	qutils,
	createAndAppendDiv,
	Calendar,
	CalendarDate,
	jQuery,
	Device,
	meLibrary,
	Log
) {
	"use strict";

	// shortcut for sap.me.CalendarSelectionMode
	var CalendarSelectionMode = meLibrary.CalendarSelectionMode;

	// prepare DOM
	createAndAppendDiv("target1");
	createAndAppendDiv("target2");
	createAndAppendDiv("bcpCalendarSample");
	createAndAppendDiv("multiSelectionSample");


	var START_YEAR = 2000;
	var END_YEAR = 2060;
	var STR_FROM_TO = "from " + START_YEAR + " to " + END_YEAR;
	var STR_TO_FROM = "from " + END_YEAR + " to " + START_YEAR;

	var MULTISELECTION_CALENDAR = new Calendar("multiSelectionCalendar");
	// DST change in Paris/WDF time zone: Oct 2014, 26th at 3AM, back to 2AM.
	var __cd = new CalendarDate(new Date(2014, 9, 1, 12, 0, 0));
	MULTISELECTION_CALENDAR.setCurrentDate(__cd.toDateString());

	// Similar settings than Colgate's
	MULTISELECTION_CALENDAR.setSingleRow(false);
	MULTISELECTION_CALENDAR.setMonthsToDisplay(2);
	MULTISELECTION_CALENDAR.setWeeksPerRow(1);
	MULTISELECTION_CALENDAR.setMonthsPerRow(2);
	MULTISELECTION_CALENDAR.setFirstDayOffset(0);
	MULTISELECTION_CALENDAR.placeAt("multiSelectionSample");

	// For the Beirut time zone, the calendar wouldn't go past march 2018.
	// For the Amman time zone, the calendar wouldn't go past march 2016.
	__cd = getStartCalendarDate();
	var BCP_CALENDAR = new Calendar();
	BCP_CALENDAR.setCurrentDate(__cd.toDateString());
	// Similar settings than Colgate's
	BCP_CALENDAR.setSingleRow(false);
	BCP_CALENDAR.setMonthsToDisplay(2);
	BCP_CALENDAR.setWeeksPerRow(1);
	BCP_CALENDAR.setMonthsPerRow(2);
	BCP_CALENDAR.setFirstDayOffset(0);
	BCP_CALENDAR.placeAt("bcpCalendarSample");

	var MULTISEL_SELECTED_DATES = [];
	var MULTISEL_SELECTED_DATES_STRINGS = [];
	var i;
	for (i = 25; i <= 30; i++) {
		var oDate = new CalendarDate(new Date(2014, 9, i, 12, 0, 0));
		MULTISEL_SELECTED_DATES.push(oDate);
		MULTISEL_SELECTED_DATES_STRINGS.push(oDate.toDateString());
	}

	/** Hour not (really) taken into account */
	function getStartUtc() {
		return new Date(Date.UTC(START_YEAR, 0, 1, 0, 0, 0));
	}

	/** Hour not (really) taken into account */
	function getEndUtc() {
		return new Date(Date.UTC(END_YEAR + 1, 0, 1, 0, 0, 0));
	}

	/** Hour not (really) taken into account */
	function getStartCalendarDate() {
		// define a calendar date using the workaround (noon).
		var cd = new CalendarDate(new Date(START_YEAR, 0, 1, 12, 0, 0));
		return cd;
	}

	/** Hour not (really) taken into account */
	function getEndCalendarDate() {
		// define a calendar date using the workaround (noon).
		var cd = new CalendarDate(new Date(END_YEAR + 1, 0, 1, 12, 0, 0));
		return cd;
	}

	/** Compare arrays, doesn't care about duplicates nor the order */
	function compareArrays(aArray1, aArray2) {
		return jQuery(aArray1).not(aArray2).length === 0 && jQuery(aArray2).not(aArray1).length === 0;
	}

	/** Clicks on the given date of the given calendar, provided it is visible! */
	function clickOnDate(oCalendar, oDate) {
		// see sap.me.CalendarRenderer
		var dashedDate = oDate.toDateString().replace(/\s/g, "-");
		var oDateDiv = jQuery("#" + oCalendar.getId() + "-" + dashedDate);
		qutils.triggerEvent("tap", oDateDiv);
	}

	/** Gets all the sundays displayed in the calendar.
	 * They should be in the same order than the dates contained in aIds.
	 * TBD: perhaps the order shouldn't matter.
	 */
	function validateCalendarDom(oCalendar, aIds) {
		// get all the sundays
		var domElements = jQuery("#" + oCalendar.getId() + " .sapMeCalendarWeekDay0");
		var length = domElements.length;
		var i;
		var element;
		for (i = 0; i < length; i++) {
			element = domElements[i];
			if (!(typeof aIds[i] == "string" && aIds[i] && element.id.toLowerCase().endsWith(aIds[i].toLowerCase()))) {
				// on IE9 & 10, toDateString doesn't pad the days with a zero when the value is less than 10
				if (Device.browser.msie && Device.browser.version < 11) {
					// The 2 failing cases: "__calendar0-Sun-Dec-1-2019" and "__calendar0-Sun-Dec-5-1999"
					// In the regexp replace below, we're just adding a 0 in front of the day.
					// $1 is "-"
					// 0 is the padding
					// $2 is the single day digit
					// $3 is "-" and the year on 4 digits
					var sElementId2 = element.id.replace(/(-)(\d)(-\d\d\d\d)/, "$10$2$3");
					if (sElementId2 && sElementId2.length > 0 && (typeof aIds[i] == "string" && aIds[i] && sElementId2.toLowerCase().endsWith(aIds[i].toLowerCase()))) {
						// this result is ok, continue the loop.
						continue;
					}
				}
				Log.debug("First failing element: " + element.id);
				return false;
			}
		}
		return true;
	}



	QUnit.test("Single selection mode", function (assert) {
		var dateDST = MULTISEL_SELECTED_DATES[1]; // the 26

		// single selection mode
		MULTISELECTION_CALENDAR.unselectAllDates();
		assert.strictEqual(MULTISELECTION_CALENDAR.getSelectedDates().length, 0, "UnselectAll dates failed (SINGLE SELECTION)");
		MULTISELECTION_CALENDAR.setSelectionMode(CalendarSelectionMode.SINGLE);
		clickOnDate(MULTISELECTION_CALENDAR, dateDST);
		assert.strictEqual(MULTISELECTION_CALENDAR.getSelectedDates().length, 1, "One single date should be selected. Selection mode.");
		var aExpectedSelection = [dateDST.toDateString()];
		assert.equal(compareArrays(MULTISELECTION_CALENDAR.getSelectedDates(), aExpectedSelection), true, "Single selected date should be: " + dateDST.toDateString());
	});

	QUnit.test("Range selection mode", function (assert) {
		var dateStartRange = MULTISEL_SELECTED_DATES[0];
		var dateEndRange = MULTISEL_SELECTED_DATES[MULTISEL_SELECTED_DATES.length - 1];

		MULTISELECTION_CALENDAR.unselectAllDates();
		assert.strictEqual(MULTISELECTION_CALENDAR.getSelectedDates().length, 0, "UnselectAll dates failed (RANGE SELECTION)");
		MULTISELECTION_CALENDAR.setSelectionMode(CalendarSelectionMode.RANGE);
		clickOnDate(MULTISELECTION_CALENDAR, dateStartRange);
		clickOnDate(MULTISELECTION_CALENDAR, dateEndRange);
		assert.strictEqual(MULTISELECTION_CALENDAR.getSelectedDates().length, 6, "Range selection low to high: 6 dates should be selected");
		assert.equal(compareArrays(MULTISELECTION_CALENDAR.getSelectedDates(), MULTISEL_SELECTED_DATES_STRINGS), true, "Range selection date mismatch (1)");
		// deselect by selecting any of the selected  dates
		clickOnDate(MULTISELECTION_CALENDAR, dateStartRange);
		assert.strictEqual(MULTISELECTION_CALENDAR.getSelectedDates().length, 0, "Range deselection high to low: deselect the previously selected dates");
		clickOnDate(MULTISELECTION_CALENDAR, dateEndRange);
		clickOnDate(MULTISELECTION_CALENDAR, dateStartRange);
		assert.strictEqual(MULTISELECTION_CALENDAR.getSelectedDates().length, 6, "Range selection high to low: 6 dates should be selected");
		assert.equal(compareArrays(MULTISELECTION_CALENDAR.getSelectedDates(), MULTISEL_SELECTED_DATES_STRINGS), true, "Range selection date mismatch (2)");
		// deselect by selecting any of the selected  dates
		clickOnDate(MULTISELECTION_CALENDAR, dateEndRange);
		assert.strictEqual(MULTISELECTION_CALENDAR.getSelectedDates().length, 0, "Range deselection low to high: deselect the previously selected dates");
	});

	QUnit.test("Multiple selection mode", function (assert) {
		MULTISELECTION_CALENDAR.unselectAllDates();
		assert.strictEqual(MULTISELECTION_CALENDAR.getSelectedDates().length, 0, "UnselectAll dates failed (MULTI SELECTION)");
		MULTISELECTION_CALENDAR.setSelectionMode(CalendarSelectionMode.MULTIPLE);
		for (i = 0; i < MULTISEL_SELECTED_DATES.length; i++) {
			// click one out of two
			clickOnDate(MULTISELECTION_CALENDAR, MULTISEL_SELECTED_DATES[(i + 2) % MULTISEL_SELECTED_DATES.length]);
		}
		assert.strictEqual(MULTISELECTION_CALENDAR.getSelectedDates().length, 6, "Multi selection: 6 dates should be selected");
		assert.equal(compareArrays(MULTISELECTION_CALENDAR.getSelectedDates(), MULTISEL_SELECTED_DATES_STRINGS), true, "Multi selection date mismatch");
	});

	QUnit.test("Calendar 'gotoNext' Month - Colgate BCP002007974700006975082014", function (assert) {
		var done = assert.async();
		assert.expect(4);
		// minimum amount of months until 2019, since there's a +1, is most likely higher.
		var minMonthsUntil2019 = (1 + 2019 - START_YEAR) * 12;
		// similar to pressing several times on the arrow to 'next month'
		while (minMonthsUntil2019-- > 0) {
			// Accessing private API (_oNextBtn) for testing purposes ONLY.
			BCP_CALENDAR._oNextBtn.firePress();
		}

		setTimeout(function () {
			var calendarCurrentDate = Calendar.parseDate(BCP_CALENDAR.getCurrentDate());
			var expectedDate = new Date(2020, 0, 1, 12, 0, 0);
			assert.strictEqual(expectedDate.getFullYear(), calendarCurrentDate.getFullYear(), "Forward: Years don't match");
			assert.strictEqual(expectedDate.getMonth(), calendarCurrentDate.getMonth(), "Forward: Months don't match");
			assert.strictEqual(expectedDate.getDate(), calendarCurrentDate.getDate(), "Forward: Days don't match");
			var ids = [
				"Sun-Dec-01-2019", "Sun-Dec-08-2019", "Sun-Dec-15-2019", "Sun-Dec-22-2019","Sun-Dec-29-2019",
				// Sunday Dec, 29th also appears on the january month display
				"Sun-Dec-29-2019", "Sun-Jan-05-2020", "Sun-Jan-12-2020", "Sun-Jan-19-2020", "Sun-Jan-26-2020"
			];
			assert.strictEqual(validateCalendarDom(BCP_CALENDAR, ids), true, "Calendar DOM in 2019/2020 is not correct");
			done();
		}, 1000);
	});

	QUnit.test("Calendar 'gotoPrevious' Month from 2019 - Colgate BCP002007974700006975082014", function (assert) {
		var done = assert.async();
		assert.expect(4);
		var startDate = new Date(2020, 0, 1, 12, 0, 0);
		BCP_CALENDAR.setCurrentDate(startDate.toDateString());
		var minMonthsUntil2019 = (1 + 2019 - START_YEAR) * 12;
		while (minMonthsUntil2019-- > 0) {
			// Accessing private API (_oPrevBtn) for testing purposes ONLY.
			BCP_CALENDAR._oPrevBtn.firePress();
		}
		setTimeout(function () {
			var calendarCurrentDate = Calendar.parseDate(BCP_CALENDAR.getCurrentDate());
			// The date provided by the calendar and the utc date should be identical for what we are testing here.
			var expectedDate = getStartUtc();
			assert.strictEqual(expectedDate.getFullYear(), calendarCurrentDate.getFullYear(), "Back: Years don't match");
			assert.strictEqual(expectedDate.getMonth(), calendarCurrentDate.getMonth(), "Back: Months don't match");
			assert.strictEqual(expectedDate.getDate(), calendarCurrentDate.getDate(), "Back: Days don't match");

			var ids = [
				"Sun-Nov-28-1999", "Sun-Dec-05-1999", "Sun-Dec-12-1999", "Sun-Dec-19-1999", "Sun-Dec-26-1999",
				// Sunday Dec 26th, appears also on the january month display
				"Sun-Dec-26-1999", "Sun-Jan-02-2000", "Sun-Jan-09-2000", "Sun-Jan-16-2000", "Sun-Jan-23-2000", "Sun-Jan-30-2000"
			];
			assert.strictEqual(validateCalendarDom(BCP_CALENDAR, ids), true, "Calendar DOM in 2000 is not correct");
			done();
		}, 1000);
	});

	QUnit.test("Get/Set Current Date", function (assert) {
		var cd = new CalendarDate();
		var calendar = new Calendar();
		calendar.setCurrentDate(cd.toDateString());
		assert.strictEqual(calendar.getCurrentDate(), cd.toDateString(), "Set/Get broken");
	});

	QUnit.test("Static Calendar::parseDate test", function (assert) {
		var cd = new CalendarDate();
		var str = cd.toDateString();
		var cdParsed = Calendar.parseDate(str);
		// success test
		assert.strictEqual(cdParsed.toDateString(), cd.toDateString(), "Calendar.parseDate error");
		// error test
		try {
			Calendar.parseDate("not a date");
			assert.strictEqual(false, true, "parse should throw an error");
		} catch (_error_) {
			assert.strictEqual(true, true, "parse should fail");
		}
	});

	QUnit.test("Parse from toDateString, " + STR_FROM_TO, function (assert) {
		var cd = getStartCalendarDate();
		// assume all leap years, this just covers more days.
		var daysAmount = (END_YEAR - START_YEAR) * 366;
		var strDate;
		var parsedDate;
		var date;
		var bAllSuccess = true;
		while (daysAmount-- > 0) {
			date = cd.getDateObject();
			strDate = date.toDateString();
			parsedDate = CalendarDate.parseFromToDateString(strDate);
			if (parsedDate.toDateString() !== strDate) {
				Log.info("Parsed and expected differ: " + parsedDate.toDateString() + " - " + strDate);
				bAllSuccess = false;
			}
			date.setDate(date.getDate() + 1);
		}
		assert.ok("Parse from toDateString", bAllSuccess);
	});

	QUnit.test("Parse from toDateString - random success tests", function (assert) {
		var someDate = new Date();
		var successTests = [
			{ str: someDate.toDateString(), y: someDate.getFullYear(), m: someDate.getMonth(), d: someDate.getDate()},
			{ str: "Sun Aug 10 2014", y: 2014, m: 7, d: 10},
			// The day does not matter, it has to be an actual week day though.
			{ str: "Mon Aug 10 2014", y: 2014, m: 7, d: 10},
			// The day does not matter, it has to be an actual week day though.
			{ str: "Tue Aug 10 2014", y: 2014, m: 7, d: 10},
			// The day does not matter, it has to be an actual week day though.
			{ str: "Wed Aug 10 2014", y: 2014, m: 7, d: 10},
			// The day does not matter, it has to be an actual week day though.
			{ str: "Thu Aug 10 2014", y: 2014, m: 7, d: 10},
			// The day does not matter, it has to be an actual week day though.
			{ str: "Fri Aug 10 2014", y: 2014, m: 7, d: 10},
			// The day does not matter, it has to be an actual week day though.
			{ str: "Sat Aug 10 2014", y: 2014, m: 7, d: 10},
			// The day does not matter, it has to be an actual week day though. Case insensitive.
			{ str: "sat aug 10 2014", y: 2014, m: 7, d: 10},
			{ str: "Sat Aug 9 2014", y: 2014, m: 7, d: 9},
			{ str: "Sat Aug 09 2014", y: 2014, m: 7, d: 9},
			// Format is valid. Date is not. The date instance will be adjusted to March 3rd.
			{ str: "Mon Feb 31 2014", y: 2014, m: 2, d: 3},
			// Format is valid. Date is not. The date instance will be adjusted to March 2nd.
			{ str: "Mon Feb 31 2016", y: 2016, m: 2, d: 2}
		];
		var i;
		for (i = 0; i < successTests.length; i++) {
			var iTest = successTests[i];
			var parsed = CalendarDate.parseFromToDateString(iTest.str, true);
			assert.strictEqual(parsed.getFullYear(), iTest.y, "Actual year is invalid: " + iTest.str);
			assert.strictEqual(parsed.getMonth(), iTest.m, "Actual month is invalid: " + iTest.str);
			assert.strictEqual(parsed.getDate(), iTest.d, "Actual day is invalid: " + iTest.str);
			var testDate = CalendarDate.createDate(iTest.y, iTest.m, iTest.d);
			assert.strictEqual(parsed.toDateString(), testDate.toDateString(), "Parsed.toDateString is invalid: " + iTest.str);
		}
	});

	QUnit.test("Parse from toDateString - random fail tests", function (assert) {
		// This tests the strict parsing method, not the one that still attempts
		// to return a Date by providing the given string to the Date constructor.
		var someDate = new Date();
		var failTests = [
			"x" + someDate.toDateString(),
			someDate.toDateString() + "x",
			"XXX Aug 10 2014", "Sun XXX 10 2014", "Mon Aug 10 201X", "Mon Aug 10 20x5",
			"Mon Aug 1X 2015", "Mox Aug 10 2015", "Mon xug 10 2015", "Mox xug 10 2015",
			"2010-08-15", "2010/08/15", "",
			// this fails only if bThrowOnParseError is set to true
			null
		];
		var i;
		for (i = 0; i < failTests.length; i++) {
			var iTest = failTests[i];
			try {
				CalendarDate.parseFromToDateString(iTest, true);
				// if we get past the previous call, it's an error case, make the test fail.
				assert.strictEqual(false, true, "Date shouldn't be parseable: " + iTest);
			} catch (_error_) {
				// test true to true to register a test.
				assert.strictEqual(true, true, "Date shouldn't be parseable: " + iTest);
			}
		}
	});

	QUnit.test("Test Next Month, " + STR_FROM_TO, function (assert) {
		var utc = getStartUtc();
		var cd = getStartCalendarDate();
		var date;
		var uds;

		var bAllSuccess = true;
		while (utc.getUTCFullYear() <= END_YEAR) {
			utc.setUTCMonth(utc.getUTCMonth() + 1);
			cd.nextMonth();
			date = cd.getDateObject();
			uds = utc.toDateString();
			if (date.getFullYear() !== utc.getUTCFullYear()) {
				Log.info("Year mismatch - " + uds);
				bAllSuccess = false;
			}
			if (date.getMonth() !== utc.getUTCMonth()) {
				Log.info("Month mismatch - " + uds);
				bAllSuccess = false;
			}
			if (date.getDate() !== utc.getUTCDate()) {
				Log.info("Day mismatch - " + uds);
				bAllSuccess = false;
			}
		}
		assert.ok("All previous month tests succeeded", bAllSuccess);
	});

	QUnit.test("Test Previous Month, " + STR_TO_FROM, function (assert) {
		var utc = getEndUtc();
		var cd = getEndCalendarDate();
		var date;
		var uds;
		var bAllSuccess = true;
		while (utc.getUTCFullYear() >= START_YEAR) {
			utc.setUTCMonth(utc.getUTCMonth() - 1);
			cd.previousMonth();
			date = cd.getDateObject();
			uds = utc.toDateString();
			if (date.getFullYear() !== utc.getUTCFullYear()) {
				Log.info("Year mismatch - " + uds);
				bAllSuccess = false;
			}
			if (date.getMonth() !== utc.getUTCMonth()) {
				Log.info("Month mismatch - " + uds);
				bAllSuccess = false;
			}
			if (date.getDate() !== utc.getUTCDate()) {
				Log.info("Day mismatch - " + uds);
				bAllSuccess = false;
			}
		}
		assert.ok("All previous month tests succeeded", bAllSuccess);
	});

	QUnit.test("Test Next Day, " + STR_FROM_TO, function (assert) {
		var utc = getStartUtc();
		var cd = getStartCalendarDate();
		var date;
		var uds;
		var bAllSuccess = true;
		while (utc.getUTCFullYear() <= END_YEAR) {
			utc.setUTCDate(utc.getUTCDate() + 1);
			date = cd.getDateObject();
			date.setDate(date.getDate() + 1);
			uds = utc.toDateString();
			if (date.getFullYear() !== utc.getUTCFullYear()) {
				assert.ok("Year mismatch - " + uds, false);
				bAllSuccess = false;
			}
			if (date.getMonth() !== utc.getUTCMonth()) {
				assert.ok("Month mismatch - " + uds, false);
				bAllSuccess = false;
			}
			if (date.getDate() !== utc.getUTCDate()) {
				assert.ok("Day mismatch - " + uds, false);
				bAllSuccess = false;
			}
		}
		assert.ok("All next day tests succeeded", bAllSuccess);
	});

	QUnit.test("Test Previous Day, " + STR_TO_FROM, function (assert) {
		var utc = getEndUtc();
		var cd = getEndCalendarDate();
		var date;
		var uds;
		var bAllSuccess = true;
		while (utc.getUTCFullYear() >= START_YEAR) {
			utc.setUTCDate(utc.getUTCDate() - 1);
			date = cd.getDateObject();
			date.setDate(date.getDate() - 1);
			uds = utc.toDateString();
			if (date.getFullYear() !== utc.getUTCFullYear()) {
				assert.ok("Year mismatch - " + uds, false);
				bAllSuccess = false;
			}
			if (date.getMonth() !== utc.getUTCMonth()) {
				assert.ok("Month mismatch - " + uds, false);
				bAllSuccess = false;
			}
			if (date.getDate() !== utc.getUTCDate()) {
				assert.ok("Day mismatch - " + uds, false);
				bAllSuccess = false;
			}
		}
		assert.ok("All previous day tests succeeded", bAllSuccess);
	});

	QUnit.test("Test Next Week, " + STR_FROM_TO, function (assert) {
		var utc = getStartUtc();
		var cd = getStartCalendarDate();
		var date;
		var uds;
		var bAllSuccess = true;
		while (utc.getUTCFullYear() <= END_YEAR) {
			utc.setUTCDate(utc.getUTCDate() + 7);
			cd.nextWeek();
			date = cd.getDateObject();
			uds = utc.toDateString();
			if (date.getFullYear() !== utc.getUTCFullYear()) {
				assert.ok("Year mismatch - " + uds, false);
				bAllSuccess = false;
			}
			if (date.getMonth() !== utc.getUTCMonth()) {
				assert.ok("Month mismatch - " + uds, false);
				bAllSuccess = false;
			}
			if (date.getDate() !== utc.getUTCDate()) {
				assert.ok("Day mismatch - " + uds, false);
				bAllSuccess = false;
			}
		}
		assert.ok("All next week tests succeeded", bAllSuccess);
	});

	QUnit.test("Test Previous Week, " + STR_TO_FROM, function (assert) {
		var utc = getEndUtc();
		var cd = getEndCalendarDate();
		var date;
		var uds;
		var bAllSuccess = true;
		while (utc.getUTCFullYear() >= START_YEAR) {
			utc.setUTCDate(utc.getUTCDate() - 7);
			cd.previousWeek();
			date = cd.getDateObject();
			uds = utc.toDateString();
			if (date.getFullYear() !== utc.getUTCFullYear()) {
				assert.ok("Year mismatch - " + uds, false);
				bAllSuccess = false;
			}
			if (date.getMonth() !== utc.getUTCMonth()) {
				assert.ok("Month mismatch - " + uds, false);
				bAllSuccess = false;
			}
			if (date.getDate() !== utc.getUTCDate()) {
				assert.ok("Day mismatch - " + uds, false);
				bAllSuccess = false;
			}
		}
		assert.ok("All previous week tests succeeded", bAllSuccess);
	});
});