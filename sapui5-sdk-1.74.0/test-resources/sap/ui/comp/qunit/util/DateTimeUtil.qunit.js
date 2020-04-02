/* global QUnit */
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/util/DateTimeUtil"
	], function(DateTimeUtil) {

		function compareUtcToLocal(oUtcDate, oLocalDate) {
			return oUtcDate.getUTCFullYear() === oLocalDate.getFullYear() &&
				oUtcDate.getUTCMonth() === oLocalDate.getMonth() &&
				oUtcDate.getUTCDate() === oLocalDate.getDate() &&
				oUtcDate.getUTCHours() === oLocalDate.getHours() &&
				oUtcDate.getUTCMinutes() === oLocalDate.getMinutes() &&
				oUtcDate.getUTCSeconds() === oLocalDate.getSeconds() &&
				oUtcDate.getUTCMilliseconds() === oLocalDate.getMilliseconds();
		}

		var aTestDates = [
			"1973-12-13",
			"1975-11-26",
			"1977-01-15",
			"1978-10-16",
			"1980-11-07",
			"1984-04-25",
			"1985-12-19",
			"1993-01-08",
			"1994-07-14",
			"1999-08-06",
			"2000-02-29",
			"2005-11-24",
			"2007-05-08",
			"2013-01-30",
			"2016-11-18",
			"2017-01-11",
			"2018-10-28",
			"2018-11-04",
			"2019-03-10",
			"2019-03-31",
			"1893-02-01"
		];

		var aTestDateTimes = [
			"2018-09-16T15:50:00.563Z",
			"2018-10-28T01:23:44.733Z",
			"2018-10-28T02:53:11.724Z",
			"2018-10-28T03:20:17.325Z",
			"2018-11-04T01:23:44.733Z",
			"2018-11-04T02:53:11.724Z",
			"2018-11-04T03:20:17.325Z",
			"2019-03-10T01:22:14.633Z",
			"2019-03-10T02:51:20.196Z",
			"2019-03-10T03:20:35.367Z",
			"2019-03-31T01:22:14.633Z",
			"2019-03-31T02:51:20.196Z",
			"2019-03-31T03:20:35.367Z",
			"2019-04-09T12:51:02.522Z",
			"2019-05-10T09:46:00.310Z",
			"2019-05-23T17:04:02.930Z",
			"2019-05-26T12:51:26.656Z",
			"2019-05-31T13:57:22.018Z",
			"2019-07-11T02:21:48.738Z",
			"2019-08-19T03:13:16.093Z",
			"1893-02-01T01:00:00.000Z"
		];

		var aTestTimes = [
			"1970-01-01T00:06:02.698Z",
			"1970-01-01T03:03:31.792Z",
			"1970-01-01T03:16:16.119Z",
			"1970-01-01T03:34:03.630Z",
			"1970-01-01T06:43:57.932Z",
			"1970-01-01T07:13:50.467Z",
			"1970-01-01T07:31:49.380Z",
			"1970-01-01T08:43:56.379Z",
			"1970-01-01T09:17:45.685Z",
			"1970-01-01T11:55:23.369Z",
			"1970-01-01T12:20:34.451Z",
			"1970-01-01T13:15:59.064Z",
			"1970-01-01T13:20:10.240Z",
			"1970-01-01T13:52:38.807Z",
			"1970-01-01T15:26:45.120Z",
			"1970-01-01T16:22:48.463Z",
			"1970-01-01T16:25:17.409Z",
			"1970-01-01T18:44:31.469Z",
			"1970-01-01T21:18:17.498Z",
			"1970-01-01T22:05:38.098Z"
		];

		var aTestEdmTimes = [
			{__edmType: "Edm.Time", ms: 362698},
			{__edmType: "Edm.Time", ms: 11011792},
			{__edmType: "Edm.Time", ms: 11776119},
			{__edmType: "Edm.Time", ms: 12843630},
			{__edmType: "Edm.Time", ms: 24237932},
			{__edmType: "Edm.Time", ms: 26030467},
			{__edmType: "Edm.Time", ms: 27109380},
			{__edmType: "Edm.Time", ms: 31436379},
			{__edmType: "Edm.Time", ms: 33465685},
			{__edmType: "Edm.Time", ms: 42923369},
			{__edmType: "Edm.Time", ms: 44434451},
			{__edmType: "Edm.Time", ms: 47759064},
			{__edmType: "Edm.Time", ms: 48010240},
			{__edmType: "Edm.Time", ms: 49958807},
			{__edmType: "Edm.Time", ms: 55605120},
			{__edmType: "Edm.Time", ms: 58968463},
			{__edmType: "Edm.Time", ms: 59117409},
			{__edmType: "Edm.Time", ms: 67471469},
			{__edmType: "Edm.Time", ms: 76697498},
			{__edmType: "Edm.Time", ms: 79538098}
		];

		QUnit.module("Convert between UTC and local time");

		QUnit.test("localToUtc", function(assert) {
			aTestDates.forEach(function(sDate) {
				var oLocalDate = new Date(sDate),
					oUTCDate = DateTimeUtil.localToUtc(oLocalDate);
				assert.ok(compareUtcToLocal(oUTCDate, oLocalDate), "Date does compare successful " + sDate);
			});
		});

		QUnit.test("utcToLocal", function(assert) {
			aTestDates.forEach(function(sDate) {
				var oUTCDate = new Date(sDate),
					oLocalDate = DateTimeUtil.utcToLocal(oUTCDate);
				assert.ok(compareUtcToLocal(oUTCDate, oLocalDate), "Date does compare successful " + sDate);
			});
		});

		QUnit.test("localToUtc with time", function(assert) {
			aTestTimes.forEach(function(sDate) {
				var oLocalDate = new Date(sDate),
					oUTCDate = DateTimeUtil.localToUtc(oLocalDate);
				assert.ok(compareUtcToLocal(oUTCDate, oLocalDate), "Date does compare successful " + sDate);
			});
		});

		QUnit.test("utcToLocal with time", function(assert) {
			aTestTimes.forEach(function(sDate) {
				var oUTCDate = new Date(sDate),
					oLocalDate = DateTimeUtil.utcToLocal(oUTCDate);
				assert.ok(compareUtcToLocal(oUTCDate, oLocalDate), "Date does compare successful " + sDate);
			});
		});

		QUnit.test("dateToEdmTime", function(assert) {
			aTestTimes.forEach(function(sDate, i) {
				var oDate = new Date(sDate),
					oEdmTime = DateTimeUtil.dateToEdmTime(oDate);
				assert.deepEqual(oEdmTime, aTestEdmTimes[i], "Time does compare successful " + sDate);
			});
		});

		QUnit.test("edmTimeToDate", function(assert) {
			aTestEdmTimes.forEach(function(oTime, i) {
				var oDate = DateTimeUtil.edmTimeToDate(oTime);
				assert.deepEqual(oDate.toISOString(), aTestTimes[i], "Time does compare successful " + oTime.ms);
			});
		});

		QUnit.module("Check for dates");

		QUnit.test("isDate", function(assert) {
			aTestDates.forEach(function(sDate) {
				var oDate = DateTimeUtil.utcToLocal(new Date(sDate));
				assert.ok(DateTimeUtil.isDate(oDate), "Date has time 00:00:00.000 " + sDate);
			});
			aTestDateTimes.forEach(function(sDate) {
				var oDate = DateTimeUtil.utcToLocal(new Date(sDate));
				assert.notOk(DateTimeUtil.isDate(oDate), "Date does have a time part " + sDate);
			});
		});

		QUnit.test("isDate UTC", function(assert) {
			aTestDates.forEach(function(sDate) {
				var oUTCDate = new Date(sDate);
				assert.ok(DateTimeUtil.isDate(oUTCDate, true), "Date has time 00:00:00.000 " + sDate);
			});
			aTestDateTimes.forEach(function(sDate) {
				var oDate = DateTimeUtil.utcToLocal(new Date(sDate));
				assert.notOk(DateTimeUtil.isDate(oDate, true), "Date does have a time part " + sDate);
			});
		});

		QUnit.module("Adapt time");

		QUnit.test("normalizeDate", function(assert) {
			aTestDateTimes.forEach(function(sDate) {
				var oDate = DateTimeUtil.normalizeDate(new Date(sDate));
				assert.ok(DateTimeUtil.isDate(oDate), "Date has been normalized " + sDate);
			});
		});

		QUnit.test("normalizeDate UTC", function(assert) {
			aTestDateTimes.forEach(function(sDate) {
				var oDate = DateTimeUtil.normalizeDate(new Date(sDate), true);
				assert.ok(DateTimeUtil.isDate(oDate, true), "Date has been normalized " + sDate);
			});
		});

		QUnit.test("adaptPrecision", function(assert) {
			aTestDateTimes.forEach(function(sDate) {
				var oDate = DateTimeUtil.adaptPrecision(new Date(sDate), 0);
				assert.equal(oDate.getMilliseconds(), 0, "Precision adapted to 0 " + sDate);
			});
			aTestDateTimes.forEach(function(sDate) {
				var oDate = DateTimeUtil.adaptPrecision(new Date(sDate), 1),
					fTest = oDate.getMilliseconds() / 100;
				assert.equal(fTest, Math.floor(fTest), "Precision adapted to 1 " + sDate);
			});
			aTestDateTimes.forEach(function(sDate) {
				var oDate = DateTimeUtil.adaptPrecision(new Date(sDate), 2),
				fTest = oDate.getMilliseconds() / 10;
				assert.equal(fTest, Math.floor(fTest), "Precision adapted to 2 " + sDate);
			});
		});


		QUnit.start();

	});
})();
