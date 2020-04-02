sap.ui.define([
	"sap/suite/ui/commons/util/DateUtils"
], function (DateUtils) {

	QUnit.module("Date Validity - sap.suite.ui.commons.util.DateUtils");

	QUnit.test("TestIsValidDateUndefined", function (assert) {
		assert.ok(!DateUtils.isValidDate());
	});

	QUnit.test("TestIsValidDateNull", function (assert) {
		assert.ok(!DateUtils.isValidDate(null));
	});

	QUnit.test("TestIsValidDatePassNumber", function (assert) {
		assert.ok(!DateUtils.isValidDate(4));
	});

	QUnit.test("TestIsValidDatePassInvalidDateObject", function (assert) {
		assert.ok(!DateUtils.isValidDate(new Date("abc")));
	});

	QUnit.test("TestIsValidDate", function (assert) {
		assert.ok(DateUtils.isValidDate(new Date()));
	});


	QUnit.module("Date Equality - sap.suite.ui.commons.util.DateUtils");

	QUnit.test("TestDateDaysEqual", function (assert) {
		var d1 = new Date();
		var d2 = new Date(d1);

		assert.ok(DateUtils.dateDaysEqual(d1, d2));
	});

	QUnit.test("TestDateDaysEqualNullDate", function (assert) {
		var d1 = new Date();
		var d2 = null;

		assert.ok(!DateUtils.dateDaysEqual(d1, d2));
		assert.ok(!DateUtils.dateDaysEqual(d2, d1));
	});

	QUnit.test("TestDateDaysEqualUndefinedDate", function (assert) {
		var d1 = new Date();
		var d2;
		assert.ok(!DateUtils.dateDaysEqual(d1, d2));
		assert.ok(!DateUtils.dateDaysEqual(d2, d1));
	});

	QUnit.test("TestDateDaysEqualInvalidDate", function (assert) {
		var d1 = new Date();
		var d2 = new Date("abc");
		assert.ok(!DateUtils.dateDaysEqual(d1, d2));
		assert.ok(!DateUtils.dateDaysEqual(d2, d1));
	});

	QUnit.module("Reset Date - sap.suite.ui.commons.util.DateUtils");

	QUnit.test("TestResetToStartOfDay", function (assert) {

		var inputDate = new Date(2013, 0, 4, 6, 43, 12, 15);
		var expectedDate = new Date(2013, 0, 4);

		DateUtils.resetDateToStartOfDay(inputDate);

		assert.equal(inputDate.toString(), expectedDate.toString(), "Hours, minutes, seconds, and milliseconds should all be zero.");
	});

	QUnit.test("TestResetToEndOfDay", function (assert) {

		var inputDate = new Date(2013, 0, 4, 6, 43, 12, 15);
		var expectedDate = new Date(2013, 0, 4, 23, 59, 59);

		DateUtils.resetDateToEndOfDay(inputDate);

		assert.equal(inputDate.toString(), expectedDate.toString(), "Time should be set to 23:59:59");
	});

	QUnit.test("TestResetDateToStartOfMonth", function (assert) {

		var inputDate = new Date(2013, 0, 4, 6, 43, 12, 15);
		var expectedDate = new Date(2013, 0, 1);

		DateUtils.resetDateToStartOfMonth(inputDate);

		assert.equal(inputDate.toString(), expectedDate.toString(), "Date should be the first of the month, start of the day.");
	});

	QUnit.test("TestResetDateToEndOfMonth", function (assert) {

		var inputDate = new Date(2013, 0, 4, 6, 43, 12, 15);
		var expectedDate = new Date(2013, 0, 31, 23, 59, 59);

		DateUtils.resetDateToEndOfMonth(inputDate);

		assert.equal(inputDate.toString(), expectedDate.toString(), "Date should be the last day of the month, end of the day.");
	});

	QUnit.test("TestResetDateToStartOfYear", function (assert) {

		var inputDate = new Date(2013, 4, 4, 6, 43, 12, 15);
		var expectedDate = new Date(2013, 0, 1);

		DateUtils.resetDateToStartOfYear(inputDate);

		assert.equal(inputDate.toString(), expectedDate.toString(), "Date should be the first of the year, start of the day.");
	});

	QUnit.test("TestResetDateToEndOfYear", function (assert) {

		var inputDate = new Date(2013, 4, 4, 6, 43, 12, 15);
		var expectedDate = new Date(2013, 11, 31, 23, 59, 59);

		DateUtils.resetDateToEndOfYear(inputDate);

		assert.equal(inputDate.toString(), expectedDate.toString(), "Date should be the last day of the year, end of the day.");
	});

	QUnit.test("TestResetDateToStartOfWeek", function (assert) {

		var inputDate = new Date(2013, 2, 7, 6, 43, 12, 15);
		var expectedDate = new Date(2013, 2, 4);

		DateUtils.resetDateToStartOfWeek(inputDate);

		assert.equal(inputDate.toString(), expectedDate.toString(), "Date should be Monday, start of the day.");
	});

	QUnit.test("TestResetDateToStartOfWeekCustomFirstDayOfWeek", function (assert) {

		var inputDate = new Date(2013, 2, 7, 6, 43, 12, 15);
		var expectedDate = new Date(2013, 2, 1);

		DateUtils.resetDateToStartOfWeek(inputDate, 5);

		assert.equal(inputDate.toString(), expectedDate.toString(), "Date should be Friday from the previous calendar week, start of the day.");
	});

	QUnit.test("TestResetDateToEndOfWeek", function (assert) {

		var inputDate = new Date(2013, 2, 7, 6, 43, 12, 15);
		var expectedDate = new Date(2013, 2, 10, 23, 59, 59);

		DateUtils.resetDateToEndOfWeek(inputDate);

		assert.equal(inputDate.toString(), expectedDate.toString(), "Date should be the following Sunday, end of the day.");
	});

	QUnit.test("TestResetDateToEndOfWeekCustomFirstDayOfWeek", function (assert) {

		var inputDate = new Date(2013, 0, 9); //Wed
		var expectedDate = new Date(2013, 0, 15, 23, 59, 59); //Tues

		DateUtils.resetDateToEndOfWeek(inputDate, {iFirstDayOfWeek: 3});

		assert.equal(inputDate.toString(), expectedDate.toString(), "Date should be the following Tuesday, end of the day.");
	});

	QUnit.test("TestResetDateToEndOfWeekCustomDuration", function (assert) {

		var inputDate = new Date(2013, 2, 7, 6, 43, 12, 15);
		var expectedDate = new Date(2013, 2, 8, 23, 59, 59);

		DateUtils.resetDateToEndOfWeek(inputDate, {iDuration: 5});

		assert.equal(inputDate.toString(), expectedDate.toString(), "Date should be the following Friday, end of the day.");
	});

	QUnit.test("TestResetDateToEndOfWeekNullSettings", function (assert) {

		var inputDate = new Date(2013, 2, 7, 6, 43, 12, 15);
		var expectedDate = new Date(2013, 2, 10, 23, 59, 59);

		DateUtils.resetDateToEndOfWeek(inputDate, null);

		assert.equal(inputDate.toString(), expectedDate.toString(), "Date should not be modified.");
	});

	QUnit.module("Month Equality - sap.suite.ui.commons.util.DateUtils");

	QUnit.test("TestDateMonthsEqual", function (assert) {
		var d1 = new Date(2013, 2, 22);
		var d2 = new Date(2013, 2, 2);

		assert.ok(DateUtils.dateMonthsEqual(d1, d2));
	});

	QUnit.test("TestDateMonthsEqualNullDate", function (assert) {
		var d1 = new Date();
		var d2 = null;

		assert.ok(!DateUtils.dateMonthsEqual(d1, d2));
		assert.ok(!DateUtils.dateMonthsEqual(d2, d1));
	});

	QUnit.test("TestDateMonthsEqualUndefinedDate", function (assert) {
		var d1 = new Date();
		var d2;
		assert.ok(!DateUtils.dateMonthsEqual(d1, d2));
		assert.ok(!DateUtils.dateMonthsEqual(d2, d1));
	});

	QUnit.test("TestDateMonthsEqualInvalidDate", function (assert) {
		var d1 = new Date();
		var d2 = new Date("abc");
		assert.ok(!DateUtils.dateMonthsEqual(d1, d2));
		assert.ok(!DateUtils.dateMonthsEqual(d2, d1));
	});


	QUnit.module("Increment Date By Index - sap.suite.ui.commons.util.DateUtils");

	QUnit.test("TestIncrementDateByIndexWithCorrectParams", function (assert) {
		var dStartDate = new Date(2013, 2, 1); //March 1, 2013

		var dExpectedRetDate = new Date(2013, 2, 25);
		var dRetDate = DateUtils.incrementDateByIndex(dStartDate, 24);
		assert.ok(DateUtils.dateDaysEqual(dRetDate, dExpectedRetDate));

		dExpectedRetDate = new Date(2013, 1, 26);
		dRetDate = DateUtils.incrementDateByIndex(dStartDate, -3);
		assert.ok(DateUtils.dateDaysEqual(dRetDate, dExpectedRetDate));

		dExpectedRetDate = new Date(2013, 3, 3);
		dRetDate = DateUtils.incrementDateByIndex(dStartDate, 33);
		assert.ok(DateUtils.dateDaysEqual(dRetDate, dExpectedRetDate));

		dExpectedRetDate = new Date(2014, 0, 5);
		dRetDate = DateUtils.incrementDateByIndex(dStartDate, 310);
		assert.ok(DateUtils.dateDaysEqual(dRetDate, dExpectedRetDate));

		dExpectedRetDate = new Date(2014, 0, 7);
		dRetDate = DateUtils.incrementDateByIndex(dStartDate, 312.8);
		assert.ok(DateUtils.dateDaysEqual(dRetDate, dExpectedRetDate));
	});

	QUnit.test("TestIncrementDateByIndexWithIncorrectParams", function (assert) {
		var dStartDate = null;
		var dRetDate = DateUtils.incrementDateByIndex(dStartDate, -3);
		assert.ok(dRetDate == null);
		dStartDate = "abc";
		dRetDate = DateUtils.incrementDateByIndex(dStartDate, -3);
		assert.ok(dRetDate == null);
		dStartDate = undefined;
		dRetDate = DateUtils.incrementDateByIndex(dStartDate, -3);
		assert.ok(dRetDate == null);
		dStartDate = new Date();
		dRetDate = DateUtils.incrementDateByIndex(dStartDate, "abc");
		assert.ok(dRetDate == null);
		dRetDate = DateUtils.incrementDateByIndex(dStartDate);
		assert.ok(dRetDate == null);
		dRetDate = DateUtils.incrementDateByIndex(dStartDate, Number.NaN);
		assert.ok(dRetDate == null);
		dRetDate = DateUtils.incrementDateByIndex(dStartDate, Number.NEGATIVE_INFINITY);
		assert.ok(dRetDate == null);
		dRetDate = DateUtils.incrementDateByIndex(dStartDate, Number.POSITIVE_INFINITY);
		assert.ok(dRetDate == null);
	});

	QUnit.module("Increment Month By Index - sap.suite.ui.commons.util.DateUtils");

	QUnit.test("TestIncrementMonthByIndexWithCorrectParams", function (assert) {
		var dStartDate = new Date(2013, 2, 1); //March 1, 2013

		var dExpectedRetDate = new Date(2013, 2, 1);
		var dRetDate = DateUtils.incrementMonthByIndex(dStartDate, 0);
		assert.ok(DateUtils.dateMonthsEqual(dRetDate, dExpectedRetDate));

		dExpectedRetDate = new Date(2013, 1, 1);
		dRetDate = DateUtils.incrementMonthByIndex(dStartDate, -1);
		assert.ok(DateUtils.dateMonthsEqual(dRetDate, dExpectedRetDate));

		dExpectedRetDate = new Date(2013, 5, 1);
		dRetDate = DateUtils.incrementMonthByIndex(dStartDate, 3);
		assert.ok(DateUtils.dateMonthsEqual(dRetDate, dExpectedRetDate));

		dExpectedRetDate = new Date(2014, 1, 1);
		dRetDate = DateUtils.incrementMonthByIndex(dStartDate, 11);
		assert.ok(DateUtils.dateMonthsEqual(dRetDate, dExpectedRetDate));

		dExpectedRetDate = new Date(2014, 2, 1);
		dRetDate = DateUtils.incrementMonthByIndex(dStartDate, 12.2);
		assert.ok(DateUtils.dateMonthsEqual(dRetDate, dExpectedRetDate));
	});

	QUnit.test("TestIncrementMonthByIndexWithIncorrectParams", function (assert) {
		var dStartDate = null;
		var dRetDate = DateUtils.incrementMonthByIndex(dStartDate, -3);
		assert.ok(dRetDate == null);
		dStartDate = "abc";
		dRetDate = DateUtils.incrementMonthByIndex(dStartDate, -3);
		assert.ok(dRetDate == null);
		dStartDate = undefined;
		dRetDate = DateUtils.incrementMonthByIndex(dStartDate, -3);
		assert.ok(dRetDate == null);
		dStartDate = new Date();
		dRetDate = DateUtils.incrementMonthByIndex(dStartDate, "abc");
		assert.ok(dRetDate == null);
		dRetDate = DateUtils.incrementMonthByIndex(dStartDate);
		assert.ok(dRetDate == null);
		dRetDate = DateUtils.incrementMonthByIndex(dStartDate, Number.NaN);
		assert.ok(dRetDate == null);
		dRetDate = DateUtils.incrementMonthByIndex(dStartDate, Number.NEGATIVE_INFINITY);
		assert.ok(dRetDate == null);
		dRetDate = DateUtils.incrementMonthByIndex(dStartDate, Number.POSITIVE_INFINITY);
		assert.ok(dRetDate == null);
	});


	QUnit.module("Number of Months Apart - sap.suite.ui.commons.util.DateUtils");

	QUnit.test("TestNumberOfMonthsApart", function (assert) {

		var dStartDate = new Date(2013, 1, 10);
		var dEndDate = new Date(2013, 10, 21);

		var iCount = DateUtils.numberOfMonthsApart(dStartDate, dEndDate);
		assert.equal(iCount, 9, "Correct");

		dEndDate = new Date(2014, 1, 21);
		iCount = DateUtils.numberOfMonthsApart(dStartDate, dEndDate);
		assert.equal(iCount, 12, "Correct");

		dEndDate = new Date(2013, 1, 21);
		iCount = DateUtils.numberOfMonthsApart(dStartDate, dEndDate);
		assert.equal(iCount, 0, "Correct");

		dEndDate = new Date(2013, 0, 21);
		iCount = DateUtils.numberOfMonthsApart(dStartDate, dEndDate);
		assert.equal(iCount, -1, "Correct");

		dEndDate = new Date(2011, 0, 21);
		iCount = DateUtils.numberOfMonthsApart(dStartDate, dEndDate);
		assert.equal(iCount, -25, "Correct");
	});


	QUnit.module("Number of Days Apart - sap.suite.ui.commons.util.DateUtils");

	QUnit.test("TestNumberOfDaysApart", function (assert) {

		var dStartDate = new Date(2013, 1, 10);
		var dEndDate = new Date(2013, 1, 21);

		var iCount = DateUtils.numberOfDaysApart(dStartDate, dEndDate);
		assert.equal(iCount, 11, "Correct");

		dEndDate = new Date(2013, 2, 2);
		iCount = DateUtils.numberOfDaysApart(dStartDate, dEndDate);
		assert.equal(iCount, 20, "Correct");

		dEndDate = new Date(2013, 1, 10);
		iCount = DateUtils.numberOfDaysApart(dStartDate, dEndDate);
		assert.equal(iCount, 0, "Correct");

		dEndDate = new Date(2013, 1, 9);
		iCount = DateUtils.numberOfDaysApart(dStartDate, dEndDate);
		assert.equal(iCount, -1, "Correct");

		dEndDate = new Date(2013, 0, 30);
		iCount = DateUtils.numberOfDaysApart(dStartDate, dEndDate);
		assert.equal(iCount, -11, "Correct");
	});
});
