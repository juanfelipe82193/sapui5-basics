/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/library",
	"sap/suite/ui/commons/DateRangeScroller",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Locale",
	"sap/ui/thirdparty/jquery",
	"sap/base/Log"
], function(
	QUnitUtils,
	createAndAppendDiv,
	commonsLibrary,
	DateRangeScroller,
	DateFormat,
	Locale,
	jQuery,
	Log
) {
	"use strict";
	createAndAppendDiv("qunit-fixture-1");
	createAndAppendDiv("qunit-fixture-2");
	createAndAppendDiv("qunit-fixture-3");
	createAndAppendDiv("qunit-fixture-4");


	var index = 10;
	function next() {
		return index++;
	}

	var oDateRangeScroller, oDecrementButton, oIncrementButton, oDateRange, oDateRangeLabel, oLabel, oLabelArea;

	/*******************************************************************************************************************/
	var sDateRangeScroller1Id = "drs1";
	new DateRangeScroller(sDateRangeScroller1Id).placeAt("qunit-fixture-1");

	var sDateRangeScroller2Id = "drs2";
	new DateRangeScroller(sDateRangeScroller2Id).placeAt("qunit-fixture-2");

	var sDateRangeScroller3Id = "drs3";
	var oDateRangeScroller3 = new DateRangeScroller(sDateRangeScroller3Id);
	oDateRangeScroller3.attachChange(handleDateChange);
	oDateRangeScroller3.placeAt("qunit-fixture-3");

	var sDateRangeScroller4Id = "drs4";
	new DateRangeScroller(sDateRangeScroller4Id).placeAt("qunit-fixture-4");

	QUnit.module("Control Rendering - sap.suite.ui.commons.DateRangeScroller", {
		beforeEach : function() {

			oDateRangeScroller = sap.ui.getCore().getControl(sDateRangeScroller1Id);
			oDecrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-decrementScrollButton'))[0];
			oIncrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-incrementScrollButton'))[0];
			oLabel = oDateRangeScroller._oDateRangeLabel;
		}
	});

	QUnit.test("TestDateRangeScrollerRenderedOK", function(assert) {

		assert.notEqual(oDateRangeScroller, null, "DateRangeScroller outer HTML Element should be rendered.");
	});

	QUnit.test("TestLeftScrollButtonRenderedOK", function(assert) {

		assert.notEqual(oDecrementButton, null, "LeftScrollButton HTML Element should be rendered.");
	});

	QUnit.test("TestRightScrollButtonRenderedOK", function(assert) {

		assert.notEqual(oIncrementButton, null, "RightScrollButton HTML Element should be rendered.");
	});

	QUnit.test("TestLabelRenderedOK", function(assert) {

		assert.notEqual(oLabel, null, "DateRangeLabel HTML Element should be rendered.");
	});

	QUnit.test("TestToolTipTextOK", function(assert) {

		assert.notEqual(oDecrementButton.title, "DATERANGESCROLLER_PREV_TEXT", "Tool Tip Text should not equal to name of the property.");
		assert.notEqual(oIncrementButton.title, "DATERANGESCROLLER_NEXT_TEXT", "Tool Tip Text should not equal to name of the property.");
	});

	QUnit.test("DateRangeLabelIncrementDayOK", function(assert) {

		oDateRangeScroller.incrementDateRange();
		assert.equal(oLabel.getText(), jQuery("label#" + oLabel.getId()).text(), "Date range label is rendered incorrectly.");
	});

	QUnit.test("DateRangeLabelDecrementDayOK", function(assert) {

		oDateRangeScroller.decrementDateRange().decrementDateRange();
		assert.equal(oLabel.getText(), jQuery("label#" + oLabel.getId()).text(), "Date range label is rendered incorrectly.");
	});

	/*******************************************************************************************************************/

	QUnit.module("Set Date Range - sap.suite.ui.commons.DateRangeScroller", {
		beforeEach : function() {

			oDateRangeScroller = new DateRangeScroller("drs" + next());
			oDecrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-decrementScrollButton'))[0];
			oIncrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-incrementScrollButton'))[0];
			oDateRange = oDateRangeScroller._oDateRange;
			oDateRangeLabel = oDateRangeScroller._oDateRangeLabel;
		}
	});

	QUnit.test("TestSetDateRangeDay", function(assert) {

		var dExpectedStartDate = new Date(2013, 0, 4, 0, 0, 0, 0);
		var dInitialDate = new Date(2013, 0, 4, 22, 22, 22, 1);

		oDateRangeScroller.setDateRangeDay(dInitialDate);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should equal the initial date with time adjusted to the beginning of the day.");
	});

	QUnit.test("TestSetDateRangeDayInvalidInitialDate", function(assert) {

		var dExpectedStartDate = new Date(2013, 0, 4, 0, 0, 0, 0);
		var dInitialDate = new Date(2013, 0, 4, 22, 22, 22, 1);

		oDateRangeScroller.setDateRangeDay(dInitialDate);
		oDateRangeScroller.setDateRangeDay();
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should equal the initial date with time adjusted to the beginning of the day.");

		oDateRangeScroller.setDateRangeDay(dInitialDate);
		oDateRangeScroller.setDateRangeDay(null);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should equal the initial date with time adjusted to the beginning of the day.");

		oDateRangeScroller.setDateRangeDay(dInitialDate);
		oDateRangeScroller.setDateRangeDay("abc");
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should equal the initial date with time adjusted to the beginning of the day.");

		oDateRangeScroller.setDateRangeDay(dInitialDate);
		oDateRangeScroller.setDateRangeDay(new Date("abc"));
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should equal the initial date with time adjusted to the beginning of the day.");
	});

	QUnit.test("TestSetDateRangeWeekWithDefaults", function(assert) {

		var dExpectedStartDate = new Date(2013, 0, 14);
		var dExpectedEndDate = new Date(2013, 0, 20, 23, 59, 59);
		var dInitialDate = new Date(2013, 0, 15, 15, 23, 44, 8);

		oDateRangeScroller.setDateRangeWeek(dInitialDate);

		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the week and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted by the default duration and time adjusted to the end of the day.");
	});

	QUnit.test("TestSetDateRangeWeekInitialDateIsFirstDayOfWeek", function(assert) {

		var iFirstDay = 3; //Wed
		var dExpectedStartDate = new Date(2013, 0, 9); //Wed
		var dExpectedEndDate = new Date(2013, 0, 15, 23, 59, 59); //Tues
		var dInitialDate = new Date(2013, 0, 9, 15, 23, 44, 8); //Wed

		oDateRangeScroller.setDateRangeWeek(dInitialDate, {
			firstDayOfWeek : iFirstDay
		});

		assert.equal(oDateRange.startDate.getDay(), iFirstDay, "Start date should fall on week day" + iFirstDay);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the week and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the week and time adjusted to the end of the day.");
	});

	QUnit.test("TestSetDateRangeWeekInitialDateLastDayOfWeek", function(assert) {

		var iFirstDay = 3; // Wed
		var dExpectedStartDate = new Date(2013, 0, 9); // Wed
		var dExpectedEndDate = new Date(2013, 0, 15, 23, 59, 59); // Following Tues
		var dInitialDate = new Date(2013, 0, 15, 15, 23, 44, 8); // Tues

		oDateRangeScroller.setDateRangeWeek(dInitialDate, {
			firstDayOfWeek : iFirstDay
		});

		assert.equal(oDateRange.startDate.getDay(), iFirstDay, "Initial date should be week day" + iFirstDay);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the week and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the week and time adjusted to the end of the day.");
	});

	QUnit.test("TestSetDateRangeWeekInvalidInitialDate", function(assert) {

		var dExpectedStartDate = new Date(2013, 0, 14); //Mon
		var dExpectedEndDate = new Date(2013, 0, 20, 23, 59, 59); //Sun
		var dInitialDate = new Date(2013, 0, 15); //Tues

		// Start with a valid week range and then see if setting an invalid initial
		// date changes the date range.

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(); //undefined
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the week and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the week and time adjusted to the end of the day.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(null);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the week and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the week and time adjusted to the end of the day.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek("abc");
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the week and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the week and time adjusted to the end of the day.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(new Date("abc"));
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the week and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the week and time adjusted to the end of the day.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(23);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the week and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the week and time adjusted to the end of the day.");
	});

	QUnit.test("TestSetDateRangeWeekInvalidDuration", function(assert) {

		var dExpectedStartDate = new Date(2012, 11, 24); //Mon (default first day)
		var dExpectedEndDate = new Date(2012, 11, 30, 23, 59, 59); //Sun, default duration is 7 days
		var dInitialDate = new Date(2012, 11, 26); //Wed

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dInitialDate, {
			duration : null
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is null.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is null.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dInitialDate, {
			duration : ""
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is an empty string.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is an empty string.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dInitialDate, {
			duration : "a"
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is a string.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is a string.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dInitialDate, {
			duration : 8
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is greater than 7.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is greater than 7.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dInitialDate, {
			duration : -1
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is negative.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is negative.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dInitialDate, {
			duration : Number.NEGATIVE_INFINITY
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is NEGATIVE_INFINITY.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is NEGATIVE_INFINITY.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dInitialDate, {
			duration : Number.POSITIVE_INFINITY
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is POSITIVE_INFINITY.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is POSITIVE_INFINITY.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dInitialDate, {
			duration : Number.NaN
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is NaN.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is NaN.");
	});

	QUnit.test("TestSetDateRangeWeekInvalidFirstDayOfWeek", function(assert) {

		var dExpectedStartDate = new Date(2012, 11, 31);
		var dExpectedEndDate = new Date(2013, 0, 6, 23, 59, 59);
		var dInitialDate = new Date(2013, 0, 3);
		var dAttemptedInitialDate = new Date(1989, 0, 5);

		// Set the initial date to fall inside the week of December 31, 2012 for each invalid scenario below. This should cause
		// the control's start/end dates to match the expected start/end dates.
		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dAttemptedInitialDate, {
			firstDayOfWeek : ""
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed when first day of the week is an empty string.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed when first day of the week is an empty string.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dAttemptedInitialDate, {
			firstDayOfWeek : "a"
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed when first day of the week is a string.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed when first day of the week is a string.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dAttemptedInitialDate, {
			firstDayOfWeek : null
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed when first day of the week is null.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed when first day of the week is null.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dAttemptedInitialDate, {
			firstDayOfWeek : -1
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed when first day of the week is negative.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed when first day of the week is negative.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dAttemptedInitialDate, {
			firstDayOfWeek : 7
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed when first day of the week is greater than 6.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed when first day of the week is greater than 6.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dAttemptedInitialDate, {
			firstDayOfWeek : Number.NEGATIVE_INFINITY
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed when first day of the week is NEGATIVE_INFINITY.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed when first day of the week is NEGATIVE_INFINITY.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dAttemptedInitialDate, {
			firstDayOfWeek : Number.POSITIVE_INFINITY
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed when first day of the week is POSITIVE_INFINITY.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed when first day of the week is POSITIVE_INFINITY.");

		oDateRangeScroller.setDateRangeWeek(dInitialDate);
		oDateRangeScroller.setDateRangeWeek(dAttemptedInitialDate, {
			firstDayOfWeek : Number.NaN
		});
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed when first day of the week is NaN.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed when first day of the week is NaN.");
	});

	QUnit.test("TestSetDateRangeWeekOneDayDuration", function(assert) {

		var dExpectedStartDate = new Date(2012, 11, 24);
		var dExpectedEndDate = new Date(2012, 11, 24, 23, 59, 59);
		var dInitialDate = new Date(2012, 11, 24);

		oDateRangeScroller.setDateRangeWeek(dInitialDate, {
			duration : 1
		});

		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should equal the initial date with time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should equal the day after the initial date with time adjusted to the end of the day.");
	});

	QUnit.test("TestSetDateRangeWeekMaxDuration", function(assert) {

		var iMaxWeekDuration = 7;
		var dExpectedStartDate = new Date(2012, 11, 24);
		var dExpectedEndDate = new Date(2012, 11, 30, 23, 59, 59);
		var dInitialDate = new Date(2012, 11, 27);

		oDateRangeScroller.setDateRangeWeek(dInitialDate, {
			duration : iMaxWeekDuration
		});

		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should equal the initial date with time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should equal the " + iMaxWeekDuration
				+ " date after the start date and time adjusted to the end of the day.");
	});

	QUnit.test("TestSetDateRangeMonth", function(assert) {

		var dExpectedStartDate = new Date(2013, 0, 1);
		var dExpectedEndDate = new Date(2013, 0, 31, 23, 59, 59);

		var dInitialDate = new Date(2013, 0, 18, 45, 13, 6);
		oDateRangeScroller.setDateRangeMonth(dInitialDate);

		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the month and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the month and time adjusted to the end of the day.");
	});

	QUnit.test("TestSetDateRangeMonthInvalidInitialDate", function(assert) {

		var dExpectedStartDate = new Date(2013, 0, 1);
		var dExpectedEndDate = new Date(2013, 0, 31, 23, 59, 59);
		var dInitialDate = new Date(2013, 0, 18, 45, 13, 6);

		oDateRangeScroller.setDateRangeMonth(dInitialDate);
		oDateRangeScroller.setDateRangeMonth();
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the month and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the month and time adjusted to the end of the day.");

		oDateRangeScroller.setDateRangeMonth(dInitialDate);
		oDateRangeScroller.setDateRangeMonth(null);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the month and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the month and time adjusted to the end of the day.");

		oDateRangeScroller.setDateRangeMonth(dInitialDate);
		oDateRangeScroller.setDateRangeMonth("abc");
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the month and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the month and time adjusted to the end of the day.");

		oDateRangeScroller.setDateRangeMonth(dInitialDate);
		oDateRangeScroller.setDateRangeMonth(new Date("abc"));
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the month and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the month and time adjusted to the end of the day.");
	});

	QUnit.test("TestSetDateRangeYear", function(assert) {

		var dExpectedStartDate = new Date(2013, 0, 1);
		var dExpectedEndDate = new Date(2013, 11, 31, 23, 59, 59);

		var dInitialDate = new Date(2013, 7, 18, 45, 13, 6);
		oDateRangeScroller.setDateRangeYear(dInitialDate);

		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the year and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the year and time adjusted to the end of the day.");
	});

	QUnit.test("TestSetDateRangeYearInvalidInitialDate", function(assert) {

		var dExpectedStartDate = new Date(2013, 0, 1);
		var dExpectedEndDate = new Date(2013, 11, 31, 23, 59, 59);
		var dInitialDate = new Date(2013, 7, 18, 45, 13, 6);

		oDateRangeScroller.setDateRangeYear(dInitialDate);
		oDateRangeScroller.setDateRangeYear();
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the year and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the year and time adjusted to the end of the day.");

		oDateRangeScroller.setDateRangeYear(dInitialDate);
		oDateRangeScroller.setDateRangeYear(null);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the year and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the year and time adjusted to the end of the day.");

		oDateRangeScroller.setDateRangeYear(dInitialDate);
		oDateRangeScroller.setDateRangeYear("abc");
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the year and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the year and time adjusted to the end of the day.");

		oDateRangeScroller.setDateRangeYear(dInitialDate);
		oDateRangeScroller.setDateRangeYear(new Date("abc"));
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(),
				"Start date should equal the initial date with date adjusted to the beginning of the year and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the set end date with date adjusted to the end of the year and time adjusted to the end of the day.");
	});

	QUnit.test("TestSetDateRangeCustomInvalidDuration", function(assert) {

		var dExpectedStartDate = new Date(2012, 11, 24);
		var dExpectedEndDate = new Date(2012, 11, 24, 23, 59, 59);
		var dInitialDate = new Date(2012, 11, 24);

		oDateRangeScroller.setDateRangeCustom(dInitialDate);
		oDateRangeScroller.setDateRangeCustom(dInitialDate, null);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is null.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is null.");

		oDateRangeScroller.setDateRangeCustom(dInitialDate);
		oDateRangeScroller.setDateRangeCustom(dInitialDate, "");
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is an empty string.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is an empty string.");

		oDateRangeScroller.setDateRangeCustom(dInitialDate);
		oDateRangeScroller.setDateRangeCustom(dInitialDate, "a");
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is a string.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is a string.");

		oDateRangeScroller.setDateRangeCustom(dInitialDate);
		oDateRangeScroller.setDateRangeCustom(dInitialDate, -1);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is negative.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is negative.");

		oDateRangeScroller.setDateRangeCustom(dInitialDate);
		oDateRangeScroller.setDateRangeCustom(dInitialDate, Number.NEGATIVE_INFINITY);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is NEGATIVE_INFINITY.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is NEGATIVE_INFINITY.");

		oDateRangeScroller.setDateRangeCustom(dInitialDate);
		oDateRangeScroller.setDateRangeCustom(dInitialDate, Number.POSITIVE_INFINITY);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is POSITIVE_INFINITY.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is POSITIVE_INFINITY.");

		oDateRangeScroller.setDateRangeCustom(dInitialDate);
		oDateRangeScroller.setDateRangeCustom(dInitialDate, Number.NaN);
		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should not be changed if the duration is NaN.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should not be changed if the duration is NaN.");

	});

	QUnit.test("TestSetDateRangeCustomIntervalZeroDays", function(assert) {

		var dExpectedStartDate = new Date(2013, 0, 8);
		var dExpectedEndDate = new Date(2013, 0, 8, 23, 59, 59);

		oDateRangeScroller.setDateRangeCustom(dExpectedStartDate);
		oDateRangeScroller.setDateRangeCustom(dExpectedStartDate, 0); // Scroller should ignore zero interval

		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should equal the initial date with date and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should equal the start date with the time adjusted to the end of the day.");
	});

	QUnit.test("TestSetDateRangeCustomIntervalOneDay", function(assert) {

		var dInitialDate = new Date(2013, 0, 8);
		var dExpectedStartDate = new Date(dInitialDate);
		var dExpectedEndDate = new Date(2013, 0, 8, 23, 59, 59);

		oDateRangeScroller.setDateRangeCustom(dInitialDate, 1);

		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should equal the initial date with date and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the start date with the date adjusted 1 day forward and time adjusted to the end of the day.");
	});

	QUnit.test("TestSetDateRangeCustomInterval21Days", function(assert) {

		var dInitialDate = new Date(2013, 0, 8);
		var dExpectedStartDate = new Date(dInitialDate);
		var dExpectedEndDate = new Date(2013, 0, 28, 23, 59, 59);

		oDateRangeScroller.setDateRangeCustom(dInitialDate, 21);

		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should equal the initial date with date and time adjusted to the beginning of the day.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(),
				"End date should equal the start date with the date adjusted 1 day forward and time adjusted to the end of the day.");
	});

	/*******************************************************************************************************************/

	QUnit.module("Properties - sap.suite.ui.commons.DateRangeScroller", {
		beforeEach : function() {

			oDateRangeScroller = new DateRangeScroller("drs" + next());
			oDecrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-decrementScrollButton'))[0];
			oIncrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-incrementScrollButton'))[0];
			oDateRange = oDateRangeScroller._oDateRange;
		}
	});

	/*******************************************************************************************************************/
	QUnit.module("Increment/Decrement - sap.suite.ui.commons.DateRangeScroller", {
		beforeEach : function() {

			oDateRangeScroller = new DateRangeScroller("drs" + next());
			oDecrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-decrementScrollButton'))[0];
			oIncrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-incrementScrollButton'))[0];
			oDateRange = oDateRangeScroller._oDateRange;
			oDateRangeLabel = oDateRangeScroller._oDateRangeLabel;
		}
	});

	QUnit.test("TestIncrementDay", function(assert) {

		var dStartPlusOneDay = new Date(oDateRange.startDate);
		dStartPlusOneDay.setDate(dStartPlusOneDay.getDate() + 1);
		var dEndPlusOneDay = new Date(oDateRange.endDate);
		dEndPlusOneDay.setDate(dEndPlusOneDay.getDate() + 1);

		oDateRangeScroller.incrementDateRange();
		assert.equal(oDateRange.startDate.toString(), dStartPlusOneDay.toString(), "Start date should be the start of the next day.");
		assert.equal(oDateRange.endDate.toString(), dEndPlusOneDay.toString(), "End date should be the end of the next day.");

		assert.equal(oDateRangeLabel.getText(), createDateRangeLabel(dStartPlusOneDay, dEndPlusOneDay, "day"), "Date range label should equal the adjusted date range scroller label.");
	});

	QUnit.test("TestDecrementDay", function(assert) {

		var dStartMinusOneDay = new Date(oDateRange.startDate);
		dStartMinusOneDay.setDate(dStartMinusOneDay.getDate() - 1);
		var dEndMinusOneDay = new Date(oDateRange.endDate);
		dEndMinusOneDay.setDate(dEndMinusOneDay.getDate() - 1);

		oDateRangeScroller.decrementDateRange();
		assert.equal(oDateRange.startDate.toString(), dStartMinusOneDay.toString(), "Start date should be the start of the previous day.");
		assert.equal(oDateRange.endDate.toString(), dEndMinusOneDay.toString(), "End date should be the end of the previous day.");

		assert.equal(oDateRangeLabel.getText(), createDateRangeLabel(dStartMinusOneDay, dEndMinusOneDay, "day"), "Date range label should equal the adjusted date range scroller label.");
	});

	QUnit.test("TestIncrementWeek", function(assert) {

		var dInitialDate = new Date(2012, 11, 10);
		oDateRangeScroller.setDateRangeWeek(dInitialDate);

		var dStartPlusOneWeek = new Date(dInitialDate);
		dStartPlusOneWeek.setDate(dStartPlusOneWeek.getDate() + 7);

		var dEndPlusOneWeek = new Date(dStartPlusOneWeek);
		resetDateToEndOfWeek(dEndPlusOneWeek);

		oDateRangeScroller.incrementDateRange();
		assert.equal(oDateRange.startDate.toString(), dStartPlusOneWeek.toString(), "Start date should be the start of the next week.");
		assert.equal(oDateRange.endDate.toString(), dEndPlusOneWeek.toString(), "End date should be the end of the next week.");
	});

	QUnit.test("TestDecrementWeek", function(assert) {

		var dInitialDate = new Date(2012, 11, 10);
		oDateRangeScroller.setDateRangeWeek(dInitialDate);

		var dStartMinusOneWeek = new Date(dInitialDate);
		dStartMinusOneWeek.setDate(dStartMinusOneWeek.getDate() - 7);

		var dEndMinusOneWeek = new Date(dStartMinusOneWeek);
		resetDateToEndOfWeek(dEndMinusOneWeek);

		oDateRangeScroller.decrementDateRange();
		assert.equal(oDateRange.startDate.toString(), dStartMinusOneWeek.toString(), "Start date should be the start of the previous week.");
		assert.equal(oDateRange.endDate.toString(), dEndMinusOneWeek.toString(), "End date should be the end of the previous week.");
	});

	QUnit.test("TestIncrementCustomInterval", function(assert) {

		var dInitialDate = new Date(2013, 0, 1);
		oDateRangeScroller.setDateRangeCustom(dInitialDate, 9);

		var dExpectedStartDate = new Date(2013, 0, 10);
		var dExpectedEndDate = new Date(2013, 0, 18, 23, 59, 59);

		oDateRangeScroller.incrementDateRange();

		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should be the start date plus Custom Interval.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should be the new start date plus Custom Interval.");
	});

	QUnit.test("TestDecrementCustomInterval", function(assert) {

		var dInitialDate = new Date(2013, 0, 18);
		oDateRangeScroller.setDateRangeCustom(dInitialDate, 9);

		var dExpectedStartDate = new Date(2013, 0, 9);
		var dExpectedEndDate = new Date(2013, 0, 17, 23, 59, 59);

		oDateRangeScroller.decrementDateRange();

		assert.equal(oDateRange.startDate.toString(), dExpectedStartDate.toString(), "Start date should be the start date minus Custom Interval.");
		assert.equal(oDateRange.endDate.toString(), dExpectedEndDate.toString(), "End date should be the new start date minus Custom Interval.");
	});

	QUnit.test("TestIncrementMonth", function(assert) {

		var dInitialDate = new Date(2012, 11, 10);
		oDateRangeScroller.setDateRangeMonth(dInitialDate);

		var dStartPlusOneMonth = new Date(dInitialDate);
		dStartPlusOneMonth.setMonth(dStartPlusOneMonth.getMonth() + 1);
		resetDateToStartOfMonth(dStartPlusOneMonth);

		var dEndPlusOneMonth = new Date(dStartPlusOneMonth);
		resetDateToEndOfMonth(dEndPlusOneMonth);

		oDateRangeScroller.incrementDateRange();
		assert.equal(oDateRange.startDate.toString(), dStartPlusOneMonth.toString(), "Start date should be the start of the next month.");
		assert.equal(oDateRange.endDate.toString(), dEndPlusOneMonth.toString(), "End date should be the end of the next month.");
	});

	QUnit.test("TestDecrementMonth", function(assert) {

		var dInitialDate = new Date(2012, 11, 10);
		oDateRangeScroller.setDateRangeMonth(dInitialDate);

		var dStartMinusOneMonth = new Date(dInitialDate);
		dStartMinusOneMonth.setMonth(dStartMinusOneMonth.getMonth() - 1);
		resetDateToStartOfMonth(dStartMinusOneMonth);

		var dEndMinusOneMonth = new Date(dStartMinusOneMonth);
		resetDateToEndOfMonth(dEndMinusOneMonth);

		oDateRangeScroller.decrementDateRange();
		assert.equal(oDateRange.startDate.toString(), dStartMinusOneMonth.toString(), "Start date should be the start of the previous month.");
		assert.equal(oDateRange.endDate.toString(), dEndMinusOneMonth.toString(), "End date should be the end of the previous month.");
	});

	QUnit.test("TestIncrementYear", function(assert) {

		var dInitialDate = new Date(2012, 11, 10);
		oDateRangeScroller.setDateRangeYear(dInitialDate);

		var dStartPlusOneYear = new Date(dInitialDate);
		resetDateToStartOfYear(dStartPlusOneYear);
		dStartPlusOneYear.setFullYear(dStartPlusOneYear.getFullYear() + 1);

		var dEndPlusOneYear = new Date(dStartPlusOneYear);
		resetDateToEndOfYear(dEndPlusOneYear);

		oDateRangeScroller.incrementDateRange();
		assert.equal(oDateRange.startDate.toString(), dStartPlusOneYear.toString(), "Start date should be the start of the next year.");
		assert.equal(oDateRange.endDate.toString(), dEndPlusOneYear.toString(), "End date should be the end of the next year.");
	});

	QUnit.test("TestDecrementYear", function(assert) {

		var dInitialDate = new Date(2012, 11, 10);
		oDateRangeScroller.setDateRangeYear(dInitialDate);

		var dStartMinusOneYear = new Date(dInitialDate);
		resetDateToStartOfYear(dStartMinusOneYear);
		dStartMinusOneYear.setFullYear(dStartMinusOneYear.getFullYear() - 1);

		var dEndMinusOneYear = new Date(dStartMinusOneYear);
		resetDateToEndOfYear(dEndMinusOneYear);

		oDateRangeScroller.decrementDateRange();
		assert.equal(oDateRange.startDate.toString(), dStartMinusOneYear.toString(), "Start date should be the start of the previous year.");
		assert.equal(oDateRange.endDate.toString(), dEndMinusOneYear.toString(), "End date should be the end of the previous year.");
	});

	/*******************************************************************************************************************/

	QUnit.module("Date Range Increment Button Press - sap.suite.ui.commons.DateRangeScroller", {
		beforeEach : function() {

			oDateRangeScroller = sap.ui.getCore().getControl(sDateRangeScroller2Id);
			oDecrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-decrementScrollButton'))[0];
			oIncrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-incrementScrollButton'))[0];
			oDateRange = oDateRangeScroller._oDateRange;
		}
	});

	QUnit.test("TestIncrementDateRangeButtonClick", function(assert) {

		var dStartPlusOneDay = new Date(oDateRange.startDate);
		dStartPlusOneDay.setDate(dStartPlusOneDay.getDate() + 1);
		var dEndPlusOneDay = new Date(oDateRange.endDate);
		dEndPlusOneDay.setDate(dEndPlusOneDay.getDate() + 1);

		Log.info("inc button id=" + oIncrementButton.id);
		qutils.triggerEvent("click", oIncrementButton.id);

		assert.equal(oDateRange.startDate.toString(), dStartPlusOneDay.toString(), "Start date should be the start of the next day.");
		assert.equal(oDateRange.endDate.toString(), dEndPlusOneDay.toString(), "End date should be the end of the next day.");
	});

	QUnit.test("TestDecrementDateRangeButtonClick", function(assert) {

		var dStartMinusOneDay = new Date(oDateRange.startDate);
		dStartMinusOneDay.setDate(dStartMinusOneDay.getDate() - 1);
		var dEndMinusOneDay = new Date(oDateRange.endDate);
		dEndMinusOneDay.setDate(dEndMinusOneDay.getDate() - 1);

		qutils.triggerEvent("click", oDecrementButton.id);

		assert.equal(oDateRange.startDate.toString(), dStartMinusOneDay.toString(), "Start date should be the start of the previous day.");
		assert.equal(oDateRange.endDate.toString(), dEndMinusOneDay.toString(), "End date should be the end of the previous day.");
	});

	/*******************************************************************************************************************/
	var sMsg = "Event captured";
	var sMsgAfterEvent = null, oEventDateRange = null, dStartEventDate = null, dEndEventDate = null;
	function handleDateChange(oEvent) {

		sMsgAfterEvent = sMsg;
		oEventDateRange = oEvent.getParameter('dateRange');
		dStartEventDate = oEventDateRange.startDate;
		dEndEventDate = oEventDateRange.endDate;
	}

	QUnit.module("Date Range Increment/Decrement Button Press - sap.suite.ui.commons.DateRangeScroller", {
		beforeEach : function() {

			oDateRangeScroller = sap.ui.getCore().getControl(sDateRangeScroller3Id);
			oDecrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-decrementScrollButton'))[0];
			oIncrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-incrementScrollButton'))[0];
			oDateRange = oDateRangeScroller._oDateRange;
		},
		afterEach : function() {

			sMsgAfterEvent = null;
			dStartEventDate = null;
			dEndEventDate = null;
		}
	});

	QUnit.test("TestDecrementDateRangeButtonClickEvent", function(assert) {

		qutils.triggerEvent("click", oDecrementButton.id);
		assert.equal(sMsgAfterEvent, sMsg, "Decrement event successfully captured.");
		assert.notEqual(dStartEventDate, null, "Event StartDate is not null.");
		assert.notEqual(dEndEventDate, null, "Event EndDate is not null.");
		assert.ok(dStartEventDate instanceof Date, "Event has statDate as Date Object");
		assert.ok(dEndEventDate instanceof Date, "Event has endDate as Date Object");
	});

	QUnit.test("TestIncrementDateRangeButtonClickEvent", function(assert) {

		qutils.triggerEvent("click", oIncrementButton.id);
		assert.equal(sMsgAfterEvent, sMsg, "Increment event successfully captured.");
		assert.notEqual(dStartEventDate, null, "Event StartDate is not null.");
		assert.notEqual(dEndEventDate, null, "Event EndDate is not null.");
		assert.ok(dStartEventDate instanceof Date, "Event has StatDate as Date Object");
		assert.ok(dEndEventDate instanceof Date, "Event has EndDate as Date Object");
	});

	/*******************************************************************************************************************/
	var sMsg = "Event captured";
	var sMsgAfterEvent = null, oEventDateRange = null, dStartEventDate = null, dEndEventDate = null;
	function handleDateChange(oEvent) {

		sMsgAfterEvent = sMsg;
		oEventDateRange = oEvent.getParameter('dateRange');
		dStartEventDate = oEventDateRange.startDate;
		dEndEventDate = oEventDateRange.endDate;
	}

	QUnit.module("Date Range Increment/Decrement Right/Left/Up/Down Arrow Press - sap.suite.ui.commons.DateRangeScroller", {
		beforeEach : function() {

			oDateRangeScroller = sap.ui.getCore().getControl(sDateRangeScroller3Id);
			oLabelArea = jQuery(document.getElementById(oDateRangeScroller.getId() + '-labelarea'))[0];
			oDateRange = oDateRangeScroller._oDateRange;
		},
		afterEach : function() {

			sMsgAfterEvent = null;
			dStartEventDate = null;
			dEndEventDate = null;
		}
	});

	QUnit.test("TestDecrementDateRangeLeftArrowClickEvent", function(assert) {

		qutils.triggerKeyboardEvent(oLabelArea.id, "ARROW_LEFT");
		assert.equal(sMsgAfterEvent, sMsg, "Decrement event successfully captured.");
		assert.notEqual(dStartEventDate, null, "Event StartDate is not null.");
		assert.notEqual(dEndEventDate, null, "Event EndDate is not null.");
		assert.ok(dStartEventDate instanceof Date, "Event has statDate as Date Object");
		assert.ok(dEndEventDate instanceof Date, "Event has endDate as Date Object");
	});

	QUnit.test("TestDecrementDateRangeDownArrowClickEvent", function(assert) {

		qutils.triggerKeyboardEvent(oLabelArea.id, "ARROW_DOWN");
		assert.equal(sMsgAfterEvent, sMsg, "Decrement event successfully captured.");
		assert.notEqual(dStartEventDate, null, "Event StartDate is not null.");
		assert.notEqual(dEndEventDate, null, "Event EndDate is not null.");
		assert.ok(dStartEventDate instanceof Date, "Event has statDate as Date Object");
		assert.ok(dEndEventDate instanceof Date, "Event has endDate as Date Object");
	});

	QUnit.test("TestIncrementDateRangeRightArrowClickEvent", function(assert) {

		qutils.triggerKeyboardEvent(oLabelArea.id, "ARROW_RIGHT");
		assert.equal(sMsgAfterEvent, sMsg, "Increment event successfully captured.");
		assert.notEqual(dStartEventDate, null, "Event StartDate is not null.");
		assert.notEqual(dEndEventDate, null, "Event EndDate is not null.");
		assert.ok(dStartEventDate instanceof Date, "Event has StatDate as Date Object");
		assert.ok(dEndEventDate instanceof Date, "Event has EndDate as Date Object");
	});

	QUnit.test("TestIncrementDateRangeUpArrowClickEvent", function(assert) {

		qutils.triggerKeyboardEvent(oLabelArea.id, "ARROW_UP");
		assert.equal(sMsgAfterEvent, sMsg, "Increment event successfully captured.");
		assert.notEqual(dStartEventDate, null, "Event StartDate is not null.");
		assert.notEqual(dEndEventDate, null, "Event EndDate is not null.");
		assert.ok(dStartEventDate instanceof Date, "Event has StatDate as Date Object");
		assert.ok(dEndEventDate instanceof Date, "Event has EndDate as Date Object");
	});

	/*******************************************************************************************************************/

	QUnit.module("Start/End Date Range API Test - sap.suite.ui.commons.DateRangeScroller", {
		beforeEach : function() {

			oDateRangeScroller = sap.ui.getCore().getControl(sDateRangeScroller4Id);
			oDecrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-decrementScrollButton'))[0];
			oIncrementButton = jQuery(document.getElementById(oDateRangeScroller.getId() + '-incrementScrollButton'))[0];
			oDateRange = oDateRangeScroller._oDateRange;
		}
	});

	QUnit.test("TestDefaultDayRangeApiForDayDateRange", function(assert) {

		var dCurrentDate = new Date();
		var oDefaultDateRange = oDateRangeScroller.getDateRange();
		assert.equal(oDefaultDateRange.startDate.getDate(), dCurrentDate.getDate(), "Start Date same as current date");
		assert.equal(oDefaultDateRange.endDate.getDate(), dCurrentDate.getDate(), "End Date same as current date");
	});

	QUnit.test("TestDayRangeApiForDayDateRange", function(assert) {

		var oDateRangeBefore = oDateRangeScroller.getDateRange();
		qutils.triggerEvent("click", oIncrementButton.id);
		var oDateRangeAfter = oDateRangeScroller.getDateRange();
		var dExpectDate = new Date();
		dExpectDate.setDate(oDateRangeBefore.startDate.getDate() + 1);
		assert.equal(oDateRangeAfter.startDate.getDate(), dExpectDate.getDate(), "Start Date incremented by 1 day");
		assert.equal(oDateRangeAfter.endDate.getDate(), dExpectDate.getDate(), "End Date incremented by 1 day");
		qutils.triggerEvent("click", oDecrementButton.id);
		oDateRangeAfter = oDateRangeScroller.getDateRange();
		assert.equal(oDateRangeAfter.startDate.getDate(), oDateRangeBefore.startDate.getDate(), "Start Date decremented by 1 day");
		assert.equal(oDateRangeAfter.endDate.getDate(), oDateRangeBefore.endDate.getDate(), "End Date decremented by 1 day");
	});

	QUnit.test("TestDayRangeApiForMonthDateRange", function(assert) {

		var dInitialDate = new Date(2012, 11, 10);
		oDateRangeScroller.setDateRangeMonth(dInitialDate);
		var oDateRangeBefore = oDateRangeScroller.getDateRange();
		qutils.triggerEvent("click", oIncrementButton.id);
		var oDateRangeAfter = oDateRangeScroller.getDateRange();
		var dExpectStartDate = new Date(2013, 0, 1);
		var dExpectEndDate = new Date(2013, 0, 31);

		assert.equal(oDateRangeAfter.startDate.getMonth(), dExpectStartDate.getMonth(), "Start Month incremented by 1 month");
		assert.equal(oDateRangeAfter.endDate.getMonth(), dExpectEndDate.getMonth(), "End Month incremented by 1 month");
		qutils.triggerEvent("click", oDecrementButton.id);
		oDateRangeAfter = oDateRangeScroller.getDateRange();
		assert.equal(oDateRangeAfter.startDate.getMonth(), oDateRangeBefore.startDate.getMonth(), "Start Month decremented by 1 month");
		assert.equal(oDateRangeAfter.endDate.getMonth(), oDateRangeBefore.endDate.getMonth(), "End Month decremented by 1 month");
	});

	QUnit.test("TestDayRangeApiForYearDateRange", function(assert) {

		var dInitialDate = new Date(2012, 11, 10);
		oDateRangeScroller.setDateRangeYear(dInitialDate);

		var oDateRangeBefore = oDateRangeScroller.getDateRange();
		qutils.triggerEvent("click", oIncrementButton.id);
		var oDateRangeAfter = oDateRangeScroller.getDateRange();
		var dExpectStartDate = new Date(2013, 0, 1);
		var dExpectEndDate = new Date(2013, 11, 31);

		assert.equal(oDateRangeAfter.startDate.getFullYear(), dExpectStartDate.getFullYear(), "Start Year incremented by 1 year");
		assert.equal(oDateRangeAfter.endDate.getFullYear(), dExpectEndDate.getFullYear(), "End Year incremented by 1 year");

		qutils.triggerEvent("click", oDecrementButton.id);

		oDateRangeAfter = oDateRangeScroller.getDateRange();
		assert.equal(oDateRangeAfter.startDate.getFullYear(), oDateRangeBefore.startDate.getFullYear(), "Start Year decremented by 1 year");
		assert.equal(oDateRangeAfter.endDate.getFullYear(), oDateRangeBefore.endDate.getFullYear(), "End Year decremented by 1 year");
	});

	/*******************************************************************************************************************/
	QUnit.module("Text Rendering For Date Ranges - sap.suite.ui.commons.DateRangeScroller", {
		beforeEach : function() {

			oDateRangeScroller = new DateRangeScroller("drs" + next());
			oDateRange = oDateRangeScroller._oDateRange;
			oDateRangeLabel = oDateRangeScroller._oDateRangeLabel;
		}
	});

	QUnit.test("TestRenderLabelDayDateRange", function(assert) {

		var dInitialDate = new Date();
		oDateRangeScroller.setDateRangeDay(dInitialDate);
		var dExpectedDate = new Date(dInitialDate);
		var oDateFormat = DateFormat.getDateInstance({
			pattern : 'MMMM d, YYYY'
		});

		var sExpectedDate = oDateFormat.format(dExpectedDate, false);
		assert.equal(oDateRangeLabel.getText(), sExpectedDate, "Date range label formatted as " + sExpectedDate);
	});

	QUnit.test("TestRenderLabelWeekDateRangeSameMonth", function(assert) {

		var dInitialDate = new Date(2013, 0, 7);
		oDateRangeScroller.setDateRangeWeek(dInitialDate);

		var oExpectedStartDate = new Date(dInitialDate);
		var oExpectedEndDate = new Date(2013, 0, 13);

		var sDateRangeLabel = createDateRangeLabel(oExpectedStartDate, oExpectedEndDate, "week");
		assert.equal(oDateRangeLabel.getText(), sDateRangeLabel, "Date range label formatted as " + sDateRangeLabel);
	});

	QUnit.test("TestRenderLabelWeekDateRangeSpanMonths", function(assert) {

		var dInitialDate = new Date(2013, 0, 28);
		oDateRangeScroller.setDateRangeWeek(dInitialDate);

		var oExpectedStartDate = new Date(dInitialDate);
		var oExpectedEndDate = new Date(2013, 1, 3);
		var sDateRangeLabel = createDateRangeLabel(oExpectedStartDate, oExpectedEndDate, "week");
		assert.equal(oDateRangeLabel.getText(), sDateRangeLabel, "Date range label formatted as " + sDateRangeLabel);
	});

	QUnit.test("TestRenderLabelWeekDateRangeSpanYears", function(assert) {

		var dInitialDate = new Date(2012, 11, 31);
		oDateRangeScroller.setDateRangeWeek(dInitialDate);

		var oExpectedStartDate = new Date(dInitialDate);
		var oExpectedEndDate = new Date(2013, 0, 6);
		var sDateRangeLabel = createDateRangeLabel(oExpectedStartDate, oExpectedEndDate, "week");
		assert.equal(oDateRangeLabel.getText(), sDateRangeLabel, "Date range label formatted as " + sDateRangeLabel);
	});

	QUnit.test("TestRenderLabelMonthDateRange", function(assert) {

		var oExpectedDate = new Date(2013, 0, 1);
		var oDateFormat = DateFormat.getDateInstance({
			pattern : 'MMMM YYYY'
		});
		for ( var i = 0; i < 12; i++) {
			oExpectedDate.setMonth(i);
			oDateRangeScroller.setDateRangeMonth(oExpectedDate);
			var sExpectedDate = oDateFormat.format(oExpectedDate, false);
			assert.equal(oDateRangeLabel.getText(), sExpectedDate, "Date range label formatted as " + sExpectedDate);
		}
	});

	QUnit.test("TestRenderLabelYearDateRange", function(assert) {

		var dDate = new Date(2013, 0, 1);
		oDateRangeScroller.setDateRangeYear(dDate);

		var dExpectedDate = new Date(dDate);
		var oDateFormat = DateFormat.getDateInstance({
			pattern : 'YYYY'
		});
		var sExpectedDate = oDateFormat.format(dExpectedDate, false);
		assert.equal(oDateRangeLabel.getText(), sExpectedDate, "Date range label formatted as " + sExpectedDate);
	});

	/*******************************************************************************************************************/

	QUnit.module("Test for date format API - sap.suite.ui.commons.DateRangeScroller", {
		beforeEach : function() {

			oDateRangeScroller = new DateRangeScroller("drs" + next());
		}
	});

	QUnit.test("TestDateFormatIsNotSetInitially", function(assert) {

		assert.equal(oDateRangeScroller._oDateFormat, null, "Date format of the control should not be set initially.");
	});

	QUnit.test("TestDateFormatIsSetCorrectly", function(assert) {

		var oLocale = new Locale("de");
		oDateRangeScroller.setDateFormat(DateFormat.getDateInstance(oLocale));
		assert.notEqual(oDateRangeScroller._oDateFormat, null, "Date format of the control should be set to supplied date format.");
		oDateRangeScroller.setDateFormat(null);
		assert.equal(oDateRangeScroller._oDateFormat, null, "Date format of the control should not be set if null is passed.");
		oDateRangeScroller.setDateFormat(DateFormat.getDateInstance(oLocale));
		assert.notEqual(oDateRangeScroller._oDateFormat, null, "Date format of the control should be set to supplied date format.");
		oDateRangeScroller.setDateFormat(new Boolean(true));
		assert.equal(oDateRangeScroller._oDateFormat, null, "Date format of the control should not be set if invalid obj is passed.");
	});

	QUnit.test("TestCorrectDateFormatIsUsed", function(assert) {

		var dInitDate = new Date();
		var oLocaleDe = new Locale("de");
		var oDateFormatDe = DateFormat.getDateInstance(oLocaleDe);

		oDateRangeScroller.setDateRangeDay(dInitDate);
		assert.equal(oDateRangeScroller._oDateRangeLabel.getText(), createDateRangeLabel(dInitDate, null, "day"), "Date range label should be equal the date range scroller label.");

		oDateRangeScroller.setDateFormat(oDateFormatDe);
		assert.equal(oDateRangeScroller._oDateRangeLabel.getText(), oDateFormatDe.format(dInitDate, false),
				"Date range label format should equal the format provided by supplied DateFormat Object.");
	});

	// *********** Utility Methods **************

	function resetDateToStartOfYear(dDate) {

		dDate.setMonth(0);
		resetDateToStartOfMonth(dDate);
	}

	function resetDateToEndOfYear(dDate) {

		dDate.setMonth(11);
		resetDateToEndOfMonth(dDate);
	}

	function resetDateToStartOfMonth(dDate) {

		dDate.setDate(1);
		resetDateToStartOfDay(dDate);
	}

	function resetDateToEndOfMonth(dDate) {

		dDate.setDate(1);
		dDate.setMonth(dDate.getMonth() + 1);
		dDate.setDate(0);
		resetDateToEndOfDay(dDate);
	}

	function resetDateToStartOfWeek(dDate) {

		var iCurrentDay = dDate.getDay();
		var iStartDayOfWeek = 1;
		var iShiftback = (iCurrentDay - iStartDayOfWeek + 7) % 7;
		dDate.setDate(dDate.getDate() - iShiftback);
		resetDateToStartOfDay(dDate);
	}

	function resetDateToEndOfWeek(dDate) {

		resetDateToStartOfWeek(dDate);
		dDate.setDate(dDate.getDate() + 6);
		resetDateToEndOfDay(dDate);
	}

	function resetDateToStartOfDay(dDate) {

		dDate.setHours(0);
		dDate.setMinutes(0);
		dDate.setSeconds(0);
	}

	function resetDateToEndOfDay(dDate) {

		dDate.setHours(23);
		dDate.setMinutes(59);
		dDate.setSeconds(59);
	}

	function createDateRangeLabel(dStartDate, dEndDate, sRangeType, oDateFormat) {

		var oDateFormatter;
		var sDateRangeLabelText;
		switch (sRangeType) {
		case ("day"):
			oDateFormatter = oDateFormat ? oDateFormat : DateFormat.getDateInstance({
				pattern : "MMMM d, YYYY"
			});
			sDateRangeLabelText = oDateFormatter.format(dStartDate, false);
			break;
		case ("week"):
			var oStartDateFormat = oDateFormat ? oDateFormat : DateFormat.getDateInstance({
				pattern : 'MMMM d'
			});
			var oEndDateFormat = oDateFormat ? oDateFormat : DateFormat.getDateInstance({
				pattern : 'MMMM d, YYYY'
			});
			if (dStartDate.getYear() != dEndDate.getYear()) {
				oStartDateFormat = oEndDateFormat;
			} else if (dStartDate.getMonth() == dEndDate.getMonth()) {
				oEndDateFormat = oDateFormat ? oDateFormat : DateFormat.getDateInstance({
					pattern : 'd, YYYY'
				});
			}
			var sStartDate = oStartDateFormat.format(dStartDate, false);
			var sEndDate = oEndDateFormat.format(dEndDate, false);
			sDateRangeLabelText = sStartDate + " - " + sEndDate;
			break;
		case ("month"):
			oDateFormatter = oDateFormat ? oDateFormat : DateFormat.getDateInstance({
				pattern : 'MMMM YYYY'
			});
			sDateRangeLabelText = oDateFormatter.format(dStartDate, false);
			break;
		case ("year"):
			oDateFormatter = oDateFormat ? oDateFormat : DateFormat.getDateInstance({
				pattern : 'YYYY'
			});
			sDateRangeLabelText = oDateFormatter.format(dStartDate, false);
			break;
		default:
			sDateRangeLabelText = dStartDate + " - " + dEndDate;
		}
		return sDateRangeLabelText;
	}

});