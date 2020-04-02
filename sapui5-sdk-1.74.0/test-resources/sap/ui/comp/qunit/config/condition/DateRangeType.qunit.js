/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartfilterbar/FilterProvider",
	"sap/ui/comp/config/condition/DateRangeType",
	"sap/ui/comp/config/condition/Type",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/date/UniversalDate",
	"sap/ui/model/json/JSONModel",
	"sap/base/util/merge"

], function (
	FilterProvider,
	DateRangeType,
	Type,
	ODataModel,
	UniversalDate,
	JSONModel,
	merge
) {
	"use strict";

	var oModel = sinon.createStubInstance(ODataModel);
	var oFilterProvider;
	QUnit.module("sap.ui.comp.config.condition.DateRangeType", {
		beforeEach: function () {
			oFilterProvider = new FilterProvider({ entityType: "foo", model: oModel });
			var oEmptyJson = { "SomeCrap": "", "SomeMoreCrap": { "items": [], "value": "" } };
			this.oNonEmptyJson = { "CountryCode": { "value": "dsagfdsg", "items": [{ "key": "GT", "text": "Guatemala" }, { "key": "GQ", "text": "Equatorial Guin" }, { "key": "GH", "text": "Ghana" }, { "key": "GA", "text": "Gabon" }, { "key": "FI", "text": "Finland" }, { "key": "DJ", "text": "Djibouti" }, { "key": "EE", "text": "Estonia" }, { "key": "BH", "text": "Bahrain" }, { "key": "BE", "text": "Belgium" }, { "key": "AX", "text": "" }, { "key": "AS", "text": "Samoa, America" }, { "key": "AQ", "text": "Antarctica" }, { "key": "AI", "text": "Anguilla" }, { "key": "AF", "text": "Afghanistan" }, { "key": "AD", "text": "Andorran" }] }, "RegionCode": { "value": "fds", "items": [{ "key": "CA", "text": "CA" }, { "key": "CL", "text": "[object Object] (CL)" }, { "key": "CH", "text": "[object Object] (CH)" }, { "key": "CO", "text": "[object Object] (CO)" }, { "key": "FR", "text": "[object Object] (FR)" }, { "key": "NL", "text": "[object Object] (NL)" }, { "key": "NO", "text": "[object Object] (NO)" }, { "key": "ID", "text": "[object Object] (ID)" }, { "key": "HU", "text": "[object Object] (HU)" }, { "key": "AR", "text": "[object Object] (AR)" }] } };
			this.oJson = merge({}, this.oNonEmptyJson, oEmptyJson);
			this.sJson = JSON.stringify(this.oJson);
		},
		afterEach: function () {
			oFilterProvider.destroy();
		}
	});

	QUnit.test("Static Methods Test", function (assert) {

		var oUDate = DateRangeType.toUniversalDate();
		assert.strictEqual(oUDate instanceof UniversalDate, true, "toUniversalDate(): returns UniversalDate instance");

		var oDate = new Date();
		oUDate = DateRangeType.toUniversalDate(oDate);
		assert.strictEqual(oUDate instanceof UniversalDate, true, "toUniversalDate(new Date()): returns UniversalDate instance");
		assert.strictEqual(oUDate.oDate.getTime(), oDate.getTime(), "toUniversalDate(new Date()): returns expected Date value");

		oDate = new UniversalDate(oDate);
		oUDate = DateRangeType.toUniversalDate(oDate);
		assert.strictEqual(oUDate instanceof UniversalDate, true, "toUniversalDate(new UniversalDate()): returns UniversalDate instance");
		assert.strictEqual(oUDate.getTime(), oDate.getTime(), "toUniversalDate(new UniversalDate()): returns expected Date value");

		oDate = new Date();
		oUDate = DateRangeType.toUniversalDate(oDate.getTime());
		assert.strictEqual(oUDate instanceof UniversalDate, true, "toUniversalDate(new Date().getTime()): returns UniversalDate instance");
		assert.strictEqual(oUDate.oDate.getTime(), oDate.getTime(), "toUniversalDate(new Date().getTime()): returns expected Date value");


		oUDate = DateRangeType.setStartTime(new UniversalDate());
		assert.strictEqual(oUDate.oDate.getHours() === 0, true, "setStartTime: Start hours set correctly");
		assert.strictEqual(oUDate.oDate.getMinutes() === 0, true, "setStartTime: Start minutes set correctly");
		assert.strictEqual(oUDate.oDate.getSeconds() === 0, true, "setStartTime: Start seconds set correctly");
		assert.strictEqual(oUDate.oDate.getMilliseconds() === 0, true, "setStartTime: Start milliseconds set correctly");

		oUDate = DateRangeType.setStartTime();
		assert.strictEqual(oUDate.oDate.getHours() === 0, true, "setStartTime: Start hours set correctly");
		assert.strictEqual(oUDate.oDate.getMinutes() === 0, true, "setStartTime: Start minutes set correctly");
		assert.strictEqual(oUDate.oDate.getSeconds() === 0, true, "setStartTime: Start seconds set correctly");
		assert.strictEqual(oUDate.oDate.getMilliseconds() === 0, true, "setStartTime: Start milliseconds set correctly");

		oUDate = DateRangeType.setEndTime(new UniversalDate());
		assert.strictEqual(oUDate.oDate.getHours() === 23, true, "setEndTime: End hours set correctly");
		assert.strictEqual(oUDate.oDate.getMinutes() === 59, true, "setEndTime: End minutes set correctly");
		assert.strictEqual(oUDate.oDate.getSeconds() === 59, true, "setEndTime: End seconds set correctly");
		assert.strictEqual(oUDate.oDate.getMilliseconds() === 999, true, "setEndTime: End milliseconds set correctly");

		oUDate = DateRangeType.setEndTime(new UniversalDate());
		assert.strictEqual(oUDate.oDate.getHours() === 23, true, "setEndTime: End hours set correctly");
		assert.strictEqual(oUDate.oDate.getMinutes() === 59, true, "setEndTime: End minutes set correctly");
		assert.strictEqual(oUDate.oDate.getSeconds() === 59, true, "setEndTime: End seconds set correctly");
		assert.strictEqual(oUDate.oDate.getMilliseconds() === 999, true, "setEndTime: End milliseconds set correctly");

		var oDate = new UniversalDate();
		oDate.setDate(1);
		oDate.setMonth(0);
		oDate.setFullYear(2000);

		//DateRange DAY
		var aRange = DateRangeType.getDateRange(1, "DAY", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 DAY: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 DAY:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 DAY:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 DAY:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 DAY:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 DAY:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 DAY:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 DAY: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 DAY: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 DAY: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 DAY: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 1, true, "getDateRange 1 DAY:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 1 DAY:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 DAY:End year set correctly");

		aRange = DateRangeType.getDateRange(2, "DAY", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 2 DAY: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 2 DAY:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 2 DAY:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 2 DAY:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 2 DAY:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 2 DAY:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 2 DAY:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  2 DAY: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 2 DAY: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 2 DAY: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 2 DAY: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 2, true, "getDateRange 2 DAY:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 2 DAY:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 2 DAY:End year set correctly");

		aRange = DateRangeType.getDateRange(32, "DAY", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 32 DAY: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 32 DAY:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 32 DAY:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 32 DAY:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 32 DAY:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 32 DAY:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 32 DAY:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange 32 DAY: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 32 DAY: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 32 DAY: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 32 DAY: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 1, true, "getDateRange 32 DAY:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 1, true, "getDateRange 32 DAY:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 32 DAY:End year set correctly");

		aRange = DateRangeType.getDateRange(367, "DAY", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 367 DAY: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 367 DAY:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 367 DAY:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 367 DAY:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 367 DAY:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 367 DAY:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 367 DAY:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange 367 DAY: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 367 DAY: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 367 DAY: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 367 DAY: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 1, true, "getDateRange 367 DAY:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 367 DAY:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2001, true, "getDateRange 367 DAY:End year set correctly");

		aRange = DateRangeType.getDateRange(-1, "DAY", oDate); // previous day
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange -1 DAY: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange -1 DAY:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange -1 DAY:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange -1 DAY:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 31, true, "getDateRange -1 DAY:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 11, true, "getDateRange -1 DAY:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 1999, true, "getDateRange -1 DAY:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  -1 DAY: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange -1 DAY: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange -1 DAY: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange -1 DAY: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange -1 DAY:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange -1 DAY:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 1999, true, "getDateRange -1 DAY:End year set correctly");

		aRange = DateRangeType.getDateRange(1, "DAY", oDate, true, true); // next day
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 DAY in future: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 DAY in future:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 DAY in future:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 DAY in future:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 2, true, "getDateRange 1 DAY in future:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 DAY in future:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 DAY in future:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 DAY in future: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 DAY in future: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 DAY in future: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 DAY in future: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 2, true, "getDateRange 1 DAY in future:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 1 DAY in future:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 DAY in future:End year set correctly");

		//DateRange WEEK
		aRange = DateRangeType.getDateRange(1, "WEEK", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 WEEK: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 WEEK:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 WEEK:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 WEEK:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 WEEK:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 WEEK:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 WEEK:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 WEEK: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 WEEK: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 WEEK: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 WEEK: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 7, true, "getDateRange 1 WEEK:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 1 WEEK:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 WEEK:End year set correctly");

		aRange = DateRangeType.getDateRange(2, "WEEK", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 2 WEEK: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 2 WEEK:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 2 WEEK:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 2 WEEK:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 2 WEEK:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 2 WEEK:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 2 WEEK:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  2 WEEK: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 2 WEEK: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 2 WEEK: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 2 WEEK: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 14, true, "getDateRange 2 WEEK:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 2 WEEK:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 2 WEEK:End year set correctly");

		aRange = DateRangeType.getDateRange(5, "WEEK", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 5 WEEK: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 5 WEEK:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 5 WEEK:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 5 WEEK:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 5 WEEK:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 5 WEEK:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 5 WEEK:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  5 WEEK: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 5 WEEK: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 5 WEEK: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 5 WEEK: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 4, true, "getDateRange 5 WEEK:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 1, true, "getDateRange 5 WEEK:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 5 WEEK:End year set correctly");

		aRange = DateRangeType.getDateRange(53, "WEEK", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 53 WEEK: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 53 WEEK:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 53 WEEK:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 53 WEEK:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 53 WEEK:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 53 WEEK:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 53 WEEK:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  53 WEEK: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 53 WEEK: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 53 WEEK: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 53 WEEK: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 5, true, "getDateRange 53 WEEK:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 53 WEEK:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2001, true, "getDateRange 53 WEEK:End year set correctly");

		aRange = DateRangeType.getDateRange(-1, "WEEK", oDate, true); // previous week
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange -1 WEEK: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange -1 WEEK:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange -1 WEEK:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange -1 WEEK:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 19, true, "getDateRange -1 WEEK:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 11, true, "getDateRange -1 WEEK:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 1999, true, "getDateRange -1 WEEK:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  -1 WEEK: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange -1 WEEK: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange -1 WEEK: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange -1 WEEK: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 25, true, "getDateRange -1 WEEK:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange -1 WEEK:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 1999, true, "getDateRange -1 WEEK:End year set correctly");

		aRange = DateRangeType.getDateRange(1, "WEEK", oDate, true, true); // next week
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 WEEK in future: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 WEEK in future:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 WEEK in future:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 WEEK in future:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 2, true, "getDateRange 1 WEEK in future:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 WEEK in future:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 WEEK in future:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 WEEK in future: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 WEEK in future: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 WEEK in future: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 WEEK in future: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 8, true, "getDateRange 1 WEEK in future:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 1 WEEK in future:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 WEEK in future:End year set correctly");

		//DateRange MONTH
		aRange = DateRangeType.getDateRange(1, "MONTH", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 MONTH: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 MONTH:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 MONTH:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 MONTH:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 MONTH:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 MONTH:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 MONTH:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 MONTH: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 MONTH: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 MONTH: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 MONTH: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange 1 MONTH:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 1 MONTH:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 MONTH:End year set correctly");

		aRange = DateRangeType.getDateRange(2, "MONTH", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 2 MONTH: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 2 MONTH:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 2 MONTH:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 2 MONTH:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 2 MONTH:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 2 MONTH:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 2 MONTH:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  2 MONTH: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 2 MONTH: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 2 MONTH: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 2 MONTH: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 29, true, "getDateRange 2 MONTH:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 1, true, "getDateRange 2 MONTH:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 2 MONTH:End year set correctly");

		aRange = DateRangeType.getDateRange(13, "MONTH", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 13 MONTH: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 13 MONTH:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 13 MONTH:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 13 MONTH:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 13 MONTH:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 13 MONTH:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 13 MONTH:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  13 MONTH: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 13 MONTH: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 13 MONTH: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 13 MONTH: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange 13 MONTH:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 0, true, "getDateRange 13 MONTH:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2001, true, "getDateRange 13 MONTH:End year set correctly");

		var oDate2 = new UniversalDate(); // to test determination of intrval start
		oDate2.setDate(10);
		oDate2.setMonth(0);
		oDate2.setFullYear(2000);

		aRange = DateRangeType.getDateRange(-1, "MONTH", oDate2, true); // previous month
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange -1 MONTH: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange -1 MONTH:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange -1 MONTH:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange -1 MONTH:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange -1 MONTH:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 11, true, "getDateRange -1 MONTH:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 1999, true, "getDateRange -1 MONTH:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  -1 MONTH: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange -1 MONTH: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange -1 MONTH: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange -1 MONTH: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange -1 MONTH:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange -1 MONTH:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 1999, true, "getDateRange -1 MONTH:End year set correctly");

		aRange = DateRangeType.getDateRange(1, "MONTH", oDate2, true, true); // next month
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 MONTH in future: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 MONTH in future:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 MONTH in future:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 MONTH in future:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 MONTH in future:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 1, true, "getDateRange 1 MONTH in future:Start month set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 MONTH in future:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 MONTH in future: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 MONTH in future: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 MONTH in future: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 MONTH in future: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 29, true, "getDateRange 1 MONTH in future:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 1, true, "getDateRange 1 MONTH in future:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 MONTH in future:End year set correctly");

		//DateRange QUARTER
		aRange = DateRangeType.getDateRange(1, "QUARTER", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 QUARTER: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 QUARTER:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 QUARTER:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 QUARTER:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 QUARTER:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 QUARTER:Start QUARTER set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 QUARTER:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 QUARTER: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 QUARTER: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 QUARTER: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 QUARTER: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange 1 QUARTER:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 2, true, "getDateRange 1 QUARTER:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 QUARTER:End year set correctly");

		aRange = DateRangeType.getDateRange(2, "QUARTER", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 2 QUARTER: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 2 QUARTER:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 2 QUARTER:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 2 QUARTER:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 2 QUARTER:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 2 QUARTER:Start QUARTER set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 2 QUARTER:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  2 QUARTER: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 2 QUARTER: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 2 QUARTER: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 2 QUARTER: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 30, true, "getDateRange 2 QUARTER:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 5, true, "getDateRange 2 QUARTER:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 2 QUARTER:End year set correctly");

		aRange = DateRangeType.getDateRange(4, "QUARTER", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 4 QUARTER: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 4 QUARTER:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 4 QUARTER:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 4 QUARTER:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 4 QUARTER:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 4 QUARTER:Start QUARTER set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 4 QUARTER:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  4 QUARTER: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 4 QUARTER: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 4 QUARTER: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 4 QUARTER: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange 4 QUARTER:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange 4 QUARTER:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 4 QUARTER:End year set correctly");

		aRange = DateRangeType.getDateRange(-1, "QUARTER", oDate2, true); // previous quarter
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange -1 QUARTER: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange -1 QUARTER:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange -1 QUARTER:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange -1 QUARTER:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange -1 QUARTER:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 9, true, "getDateRange -1 QUARTER:Start QUARTER set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 1999, true, "getDateRange -1 QUARTER:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  -1 QUARTER: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange -1 QUARTER: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange -1 QUARTER: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange -1 QUARTER: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange -1 QUARTER:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange -1 QUARTER:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 1999, true, "getDateRange -1 QUARTER:End year set correctly");

		aRange = DateRangeType.getDateRange(1, "QUARTER", oDate2, true, true);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 QUARTER in future: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 QUARTER in future:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 QUARTER in future:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 QUARTER in future:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 QUARTER in future:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 3, true, "getDateRange 1 QUARTER in future:Start QUARTER set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 QUARTER in future:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 QUARTER in future: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 QUARTER in future: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 QUARTER in future: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 QUARTER in future: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 30, true, "getDateRange 1 QUARTER in future:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 5, true, "getDateRange 1 QUARTER in future:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 QUARTER in future:End year set correctly");

		//DateRange YEAR
		aRange = DateRangeType.getDateRange(1, "YEAR", oDate);
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 YEAR: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 YEAR:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 YEAR:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 YEAR:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 YEAR:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 YEAR:Start YEAR set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2000, true, "getDateRange 1 YEAR:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 YEAR: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 YEAR: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 YEAR: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 YEAR: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange 1 YEAR:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange 1 YEAR:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2000, true, "getDateRange 1 YEAR:End year set correctly");

		aRange = DateRangeType.getDateRange(-1, "YEAR", oDate2, true); // previous year
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange -1 YEAR: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange -1 YEAR:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange -1 YEAR:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange -1 YEAR:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange -1 YEAR:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange -1 YEAR:Start YEAR set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 1999, true, "getDateRange -1 YEAR:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  -1 YEAR: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange -1 YEAR: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange -1 YEAR: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange -1 YEAR: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange -1 YEAR:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange -1 YEAR:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 1999, true, "getDateRange -1 YEAR:End year set correctly");

		aRange = DateRangeType.getDateRange(1, "YEAR", oDate2, true, true); // next year
		assert.strictEqual(aRange[0].oDate.getHours() === 0, true, "getDateRange 1 YEAR in future: Start hours set correctly");
		assert.strictEqual(aRange[0].oDate.getMinutes() === 0, true, "getDateRange 1 YEAR in future:Start minutes set correctly");
		assert.strictEqual(aRange[0].oDate.getSeconds() === 0, true, "getDateRange 1 YEAR in future:Start seconds set correctly");
		assert.strictEqual(aRange[0].oDate.getMilliseconds() === 0, true, "getDateRange 1 YEAR in future:Start milliseconds set correctly");
		assert.strictEqual(aRange[0].oDate.getDate() === 1, true, "getDateRange 1 YEAR in future:Start date set correctly");
		assert.strictEqual(aRange[0].oDate.getMonth() === 0, true, "getDateRange 1 YEAR in future:Start YEAR set correctly");
		assert.strictEqual(aRange[0].oDate.getFullYear() === 2001, true, "getDateRange 1 YEAR in future:Start year set correctly");

		assert.strictEqual(aRange[1].oDate.getHours() === 23, true, "getDateRange  1 YEAR in future: End hours set correctly");
		assert.strictEqual(aRange[1].oDate.getMinutes() === 59, true, "getDateRange 1 YEAR in future: End minutes set correctly");
		assert.strictEqual(aRange[1].oDate.getSeconds() === 59, true, "getDateRange 1 YEAR in future: End seconds set correctly");
		assert.strictEqual(aRange[1].oDate.getMilliseconds() === 999, true, "getDateRange 1 YEAR in future: End milliseconds set correctly");
		assert.strictEqual(aRange[1].oDate.getDate() === 31, true, "getDateRange 1 YEAR in future:End date set correctly");
		assert.strictEqual(aRange[1].oDate.getMonth() === 11, true, "getDateRange 1 YEAR in future:End month set correctly");
		assert.strictEqual(aRange[1].oDate.getFullYear() === 2001, true, "getDateRange 1 YEAR in future:End year set correctly");

		//ERROR
		try {
			aRange = DateRangeType.getDateRange(1, "XXX", oDate);
		} catch (error) {
			assert.strictEqual(error.message === "invalid unit XXX", true, "No falid unit  given");
		}

	});

	QUnit.test("Checking DefaultValues", function (assert) {
		var oDate1 = DateRangeType.getWeekStartDate(new UniversalDate());
		var oDate2 = DateRangeType.getWeekStartDate();
		//var iDiff = oDate2.getTime() - oDate1.getTime()
		assert.strictEqual(oDate2.getTime() - oDate1.getTime() >= 0, true, "DateRangeType.getWeekStartDate without date");

		oDate1 = DateRangeType.getMonthStartDate(new UniversalDate());
		oDate2 = DateRangeType.getMonthStartDate();
		//iDiff = oDate2.getTime() - oDate1.getTime()
		assert.strictEqual(oDate2.getTime() - oDate1.getTime() >= 0, true, "DateRangeType.getMonthStartDate without date");

		oDate1 = DateRangeType.getQuarterStartDate(new UniversalDate(2000, 8, 12));
		assert.strictEqual(oDate1.getMonth(), 6, "DateRangeType.getQuarterStartDate returns Month 6");

		oDate1 = DateRangeType.getQuarterStartDate(new UniversalDate());
		oDate2 = DateRangeType.getQuarterStartDate();
		var iDiff = oDate2.getTime() - oDate1.getTime();
		assert.strictEqual(iDiff >= 0 && iDiff <= 10, true, "DateRangeType.getQuarterStartDate  without date");

		var oDateRangeType = new DateRangeType("TestFieldName");
		var aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.DATERANGE);
		assert.strictEqual(aResult[0] === null, true, "DateRangeType.Operations.DATERANGE value1 = null");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.DATERANGE value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.FROM);
		assert.strictEqual(aResult[0] === null, true, "DateRangeType.Operations.FROM value1 = null");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.FROM value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.TO);
		assert.strictEqual(aResult[0] === null, true, "DateRangeType.Operations.TO value1 = null");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.TO value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.LASTDAYS);
		assert.strictEqual(aResult[0] === 1, true, "DateRangeType.Operations.LASTDAYS value1 = 1");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.LASTDAYS value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.LASTWEEKS);
		assert.strictEqual(aResult[0] === 1, true, "DateRangeType.Operations.LASTWEEKS value1 = 1");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.LASTWEEKS value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.LASTMONTHS);
		assert.strictEqual(aResult[0] === 1, true, "DateRangeType.Operations.LASTMONTHS value1 = 1");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.LASTMONTHS value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.LASTQUARTERS);
		assert.strictEqual(aResult[0] === 1, true, "DateRangeType.Operations.LASTQUARTERS value1 = 1");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.LASTQUARTERS value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.LASTYEARS);
		assert.strictEqual(aResult[0] === 1, true, "DateRangeType.Operations.LASTYEARS value1 = 1");
		assert.strictEqual(aResult[1] === null, true, "DateRangeType.Operations.LASTYEARS value2 = null");

		aResult = oDateRangeType.getDefaultValues(DateRangeType.Operations.TODAY);
		assert.strictEqual(aResult[0].getTime() === DateRangeType.setStartTime().getTime(), true, "DateRangeType.Operations.TODAY value1 = today");
		assert.strictEqual(aResult[1].getTime() === DateRangeType.getDateRange(1, "DAY", true)[1].getTime(), true, "DateRangeType.Operations.TODAY value2 = today");

	});

	QUnit.test("Serialize, initialize without FilterProvider", function (assert) {
		var oDateRangeType = new DateRangeType("TestFieldName");
		oFilterProvider._mConditionTypeFields["foo"] = { conditionType: oDateRangeType };

		assert.strictEqual(oDateRangeType.getModel() instanceof JSONModel, true, "JSON model available");
		var oData = oDateRangeType.getModel().getData();

		assert.strictEqual(oData.condition !== null && typeof oData.condition === "object", true, "ModelData.condition check: object");
		assert.strictEqual(oData.condition.key === "TestFieldName", true, "ModelData.condition check: fieldname");
		assert.strictEqual(oData.condition.operation === "", true, "ModelData.condition check: operation");
		assert.strictEqual(oData.condition.value1 === null, true, "ModelData.condition check: value1");
		assert.strictEqual(oData.condition.value2 === null, true, "ModelData.condition check: value2");

		var oModel = oDateRangeType.getModel();
		assert.strictEqual(typeof oModel.getProperty("", oDateRangeType.getConditionContext()) === "object", true, "Model.getProperty.condition check: object");
		assert.strictEqual(oModel.getProperty("key", oDateRangeType.getConditionContext()) === "TestFieldName", true, "Model.getProperty.condition check: fieldname");
		assert.strictEqual(oModel.getProperty("operation", oDateRangeType.getConditionContext()) === "", true, "Model.getProperty.condition check: operation");
		assert.strictEqual(oModel.getProperty("value1", oDateRangeType.getConditionContext()) === null, true, "Model.getProperty.condition check: value1");
		assert.strictEqual(oModel.getProperty("value2", oDateRangeType.getConditionContext()) === null, true, "Model.getProperty.condition check: value2");

		var aValues = DateRangeType.getDateRange(2, "WEEK", DateRangeType.getWeekStartDate(new UniversalDate()));
		oDateRangeType.initialize({
			conditionTypeInfo: {
				name: "sap.ui.comp.config.condition.DateRangeType",
				data: {
					key: "TestFieldName",
					operation: "DATERANGE",
					value1: aValues[0].oDate,
					value2: aValues[1].oDate
				}
			}
		});
		assert.strictEqual(oModel.getProperty("key", oDateRangeType.getConditionContext()) === "TestFieldName", true, "Model.getProperty.condition check: fieldname");
		assert.strictEqual(oModel.getProperty("operation", oDateRangeType.getConditionContext()) === "DATERANGE", true, "Model.getProperty.condition check: operation");
		assert.strictEqual(oModel.getProperty("value1", oDateRangeType.getConditionContext()) === aValues[0].oDate, true, "Model.getProperty.condition check: value1");
		assert.strictEqual(oModel.getProperty("value2", oDateRangeType.getConditionContext()) === aValues[1].oDate, true, "Model.getProperty.condition check: value2");

		var aRanges = oDateRangeType.getFilterRanges();
		assert.strictEqual(aRanges[0].exclude === false, true, "getFilterRanges: exclude");
		assert.strictEqual(aRanges[0].keyField === "TestFieldName", true, "getFilterRanges: keyField");
		assert.strictEqual(aRanges[0].operation === "BT", true, "getFilterRanges: operation");
		assert.strictEqual(aRanges[0].value1.toString() === aValues[0].oDate.toString(), true, "getFilterRanges: value1");
		assert.strictEqual(aRanges[0].value2.toString() === aValues[1].oDate.toString(), true, "getFilterRanges: value2");

		/* 			var oSerialized = oDateRangeType.serialize();
					assert.strictEqual(oSerialized.ranges[0].exclude === false, true, "serialize().ranges[0]: exclude");
					assert.strictEqual(oSerialized.ranges[0].keyField === "TestFieldName", true, "serialize().ranges[0]: keyField");
					assert.strictEqual(oSerialized.ranges[0].operation === "BT", true, "serialize().ranges[0]: operation");
					assert.strictEqual(oSerialized.ranges[0].value1 === aValues[0].oDate, true, "serialize().ranges[0]: value1");
					assert.strictEqual(oSerialized.ranges[0].value2 === aValues[1].oDate, true, "serialize().ranges[0]: value1");
					assert.strictEqual(oSerialized.conditionTypeInfo.name === "sap.ui.comp.config.condition.DateRangeType", true, "serialize().conditionTypeInfo: name");
					assert.strictEqual(oSerialized.conditionTypeInfo.data.key === "TestFieldName", true, "serialize().conditionTypeInfo.data: key");
					assert.strictEqual(oSerialized.conditionTypeInfo.data.operation === "DATERANGE", true, "serialize().conditionTypeInfo.data: operation");
					assert.strictEqual(oSerialized.conditionTypeInfo.data.value1 === aValues[0].oDate, true, "serialize().conditionTypeInfo.data: value1");
					assert.strictEqual(oSerialized.conditionTypeInfo.data.value2 === aValues[1].oDate, true, "serialize().conditionTypeInfo.data: value2");
		 */
	});

	QUnit.test("Nullable Integer Type", function (assert) {
		var oType = new sap.ui.model.type.NullableInteger();
		assert.strictEqual(oType.parseValue("", "string") === null, true, "Nullable Integer Type, null check");
		assert.strictEqual(oType.parseValue("1", "string") === 1, true, "Nullable Integer Type, 1 check");
		assert.strictEqual(oType.parseValue(1, "int") === 1, true, "Nullable Integer Type, 1 check");
		assert.strictEqual(oType.parseValue("01", "string") === 1, true, "Nullable Integer Type, 01 check");
	});

	QUnit.test("Create Controls", function (assert) {
		var oDateRangeType = new DateRangeType("FieldName");
		oFilterProvider._mConditionTypeFields["foo"] = { conditionType: oDateRangeType };

		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "TODAY", "value1": null, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });

		oDateRangeType.oDateFormat = { UTC: true, style: "short" };
		var oText = DateRangeType.getTextField(oDateRangeType);
		assert.strictEqual(oText.getMetadata().getName() === "sap.m.Text", true, "sap.m.Text created");
		var oBindingInfo = oText.getBindingInfo("text");
		assert.strictEqual(oBindingInfo.type === "sap.ui.model.type.Date", true, "BindingInfo type sap.ui.model.type.Date");
		assert.strictEqual(oBindingInfo.parts[0].model === "$smartEntityFilter", true, "BindingInfo model $smartEntityFilter");
		assert.strictEqual(oBindingInfo.parts[0].path === "value1", true, "BindingInfo path value1");

		//text
		oText = DateRangeType.getTextField(oDateRangeType, true);
		assert.strictEqual(oText.getMetadata().getName() === "sap.m.Text", true, "sap.m.Text created");
		oBindingInfo = oText.getBindingInfo("text");
		assert.strictEqual(oBindingInfo.parts[0].type.sName === "Date", true, "BindingInfo type Date");
		assert.strictEqual(oBindingInfo.parts[0].model === "$smartEntityFilter", true, "BindingInfo model $smartEntityFilter");
		assert.strictEqual(oBindingInfo.parts[0].path === "value1", true, "BindingInfo path value1");
		assert.strictEqual(oBindingInfo.parts[1].type.sName === "Date", true, "BindingInfo type Date");
		assert.strictEqual(oBindingInfo.parts[1].model === "$smartEntityFilter", true, "BindingInfo model $smartEntityFilter");
		assert.strictEqual(oBindingInfo.parts[1].path === "value2", true, "BindingInfo path value2");

		//int field
		var oIntField = DateRangeType.getIntField(oDateRangeType);
		assert.strictEqual(oIntField.getMetadata().getName() === "sap.m.Input", true, "sap.m.Input created");
		oBindingInfo = oIntField.getBindingInfo("value");
		assert.strictEqual(oBindingInfo.parts[0].type instanceof sap.ui.model.type.NullableInteger, true, "BindingInfo type sap.ui.model.type.NullableInteger");
		assert.strictEqual(oBindingInfo.parts[0].model === "$smartEntityFilter", true, "BindingInfo model $smartEntityFilter");
		assert.strictEqual(oBindingInfo.parts[0].path === "value1", true, "BindingInfo path value1");

		/* 			var oBindingInfo = oIntField.getBindingInfo("valueState");
					assert.strictEqual(oBindingInfo.parts[0].model === "$smartEntityFilter", true, "BindingInfo model $smartEntityFilter");
					assert.strictEqual(oBindingInfo.parts[0].path === "/inputstate", true, "BindingInfo path /inputstate");
					//execute the formatters
					var oModel = new JSONModel({inputstate: "ERROR"});
					oIntField.setModel(oModel,"$smartEntityFilter");
					assert.strictEqual(oIntField.getValueState() === "Error", true, "Value State is Error");
					oModel.setProperty("/inputstate","");
					assert.strictEqual(oIntField.getValueState() === "None", true, "Value State is None");
		 */
		//description text
		/* 			var oText = DateRangeType.getDescriptionText("CONDITION_DATERANGETYPE_SINGLE_DAY","CONDITION_DATERANGETYPE_MULTIPLE_DAYS");
					assert.strictEqual(oText.getMetadata().getName() === "sap.m.Text", true, "sap.m.Text created");
					var oBindingInfo = oText.getBindingInfo("text");
					assert.strictEqual(oBindingInfo.parts[0].type === "sap.ui.model.type.Integer", true, "BindingInfo type sap.ui.model.type.Integer");
					assert.strictEqual(oBindingInfo.parts[0].model === "$smartEntityFilter", true, "BindingInfo model $smartEntityFilter");
					assert.strictEqual(oBindingInfo.parts[0].path === "value1", true, "BindingInfo path value1");

					var oModel = new JSONModel({value1: 1});
					oText.setModel(oModel,"$smartEntityFilter");
					oText.setBindingContext(oModel.createBindingContext("/"),"$smartEntityFilter");
					assert.strictEqual(oText.getText() === Type.getTranslatedText("CONDITION_DATERANGETYPE_SINGLE_DAY"), true, "Single description Text");
					oModel.setProperty("/value1",2);
					assert.strictEqual(oText.getText() === Type.getTranslatedText("CONDITION_DATERANGETYPE_MULTIPLE_DAYS"), true, "Multiple description Text");
		*/
		//control factory and exceptional controls
		var aResult = [];
		DateRangeType.ControlFactory(oDateRangeType, aResult, DateRangeType.Operations.TODAY);
		assert.strictEqual(aResult[0].getMetadata().getName() === "sap.m.Text", true, "sap.m.Text created");
		aResult = [];
		DateRangeType.ControlFactory(oDateRangeType, aResult, DateRangeType.Operations.LASTDAYS);
		assert.strictEqual(aResult[0].getMetadata().getName() === "sap.m.Input", true, "sap.m.Input created");

		aResult = [];
		DateRangeType.Operations.DATERANGE.getControls(oDateRangeType, aResult);
		assert.strictEqual(aResult[0].getMetadata().getName() === "sap.m.Label", true, "sap.m.Label created");
		assert.strictEqual(aResult[1].getMetadata().getName() === "sap.m.DatePicker", true, "sap.m.DatePicker created");
		assert.strictEqual(aResult[2].getMetadata().getName() === "sap.m.Label", true, "sap.m.DatePicker created");
		assert.strictEqual(aResult[3].getMetadata().getName() === "sap.m.DatePicker", true, "sap.m.Label created");
		/* 			var oModel = new JSONModel({inputstate: "ERROR"});
					aResult[1].setModel(oModel,"$smartEntityFilter");
					assert.strictEqual(aResult[1].getValueState() === "Error", true, "Value State is Error");
					oModel.setProperty("/inputstate","");
					assert.strictEqual(aResult[1].getValueState() === "None", true, "Value State is None");
					aResult[1].fireChange({valid:true});
					aResult[1].fireChange({valid:false});
		 */
		aResult = [];
		DateRangeType.Operations.FROM.getControls(oDateRangeType, aResult);
		assert.strictEqual(aResult[0].getMetadata().getName() === "sap.m.DatePicker", true, "sap.m.DatePicker created");
		//execute the formatters
		/* 			var oModel = new JSONModel({inputstate: "ERROR"});
					aResult[0].setModel(oModel,"$smartEntityFilter");
					assert.strictEqual(aResult[0].getValueState() === "Error", true, "Value State is Error");
					oModel.setProperty("/inputstate","");
					assert.strictEqual(aResult[0].getValueState() === "None", true, "Value State is None");
		 */
		aResult = [];
		DateRangeType.Operations.TO.getControls(oDateRangeType, aResult);
		assert.strictEqual(aResult[0].getMetadata().getName() === "sap.m.DatePicker", true, "sap.m.DatePicker created");
		//execute the formatters
		/* 			var oModel = new JSONModel({inputstate: "ERROR"});
					aResult[0].setModel(oModel,"$smartEntityFilter");
					assert.strictEqual(aResult[0].getValueState() === "Error", true, "Value State is Error");
					oModel.setProperty("/inputstate","");
					assert.strictEqual(aResult[0].getValueState() === "None", true, "Value State is None");
		 */
		aResult = [];
		DateRangeType.Operations.SPECIFICMONTH.getControls(oDateRangeType, aResult);
		assert.strictEqual(DateRangeType.Operations.SPECIFICMONTH.defaultValues()[0] === (new Date()).getMonth(), true, "Check Month");
		assert.strictEqual(aResult[0].getMetadata().getName() === "sap.m.Select", true, "sap.m.Select created");
		var aMonths = DateRangeType.Operations.SPECIFICMONTH.getValueList();
		assert.strictEqual(aMonths.length === 12, true, "12 month created");

		oDateRangeType.setOperation("LASTQUARTERS");
		//oHBox.getItems()[0].setSelectedKey("LASTWEEKS");

	});

	QUnit.test("Test DateRangeType methods", function (assert) {

		var bFired;
		var oDateRangeType = new DateRangeType("FieldName", oFilterProvider);
		oFilterProvider._mConditionTypeFields["foo"] = { conditionType: oDateRangeType };

		oFilterProvider._oSmartFilter = {
			fireFilterChange: function () {
				bFired = true;
			},
			getLiveMode: function () {
				return true;
			},
			triggerSearch: function () {

			},
			getId: function () {
				return "filterBarId";
			}
		};
		assert.strictEqual(oDateRangeType.getName() === "sap.ui.comp.config.condition.DateRangeType", true, "getName");
		assert.strictEqual(oDateRangeType.getType() === "Edm.Date", true, "getType");
		assert.strictEqual(oDateRangeType.getTokenText() === "", true, "getTokenText");
		assert.strictEqual(oDateRangeType.getDefaultValues().length === 0, true, "getDefaultValue without operation error");
		assert.strictEqual(oDateRangeType.getControls() === undefined, true, "getDefaultValue without operation error");
		assert.strictEqual(oDateRangeType.getParent() === oFilterProvider._oSmartFilter, true, "getParent");
		assert.strictEqual(oDateRangeType.getDefaultOperation().key === "DATERANGE", true, "getDefaultOperation DATERANGE");

		oDateRangeType.applySettings({ operations: { filter: { path: 'category', contains: 'MONTH', exclude: true } } });
		var aOperations = oDateRangeType.getOperations();
		var bMonthFound = false;
		var i = 0;
		for (i = 0; i < aOperations.length; i++) {
			if (aOperations[i].category.indexOf("MONTH") > -1) {
				bMonthFound = true;
			}
		}
		assert.strictEqual(bMonthFound, false, "applySettings exclude filter category month");
		oDateRangeType.applySettings({ operations: { filter: { path: 'category', contains: 'MONTH', exclude: false } } });
		aOperations = oDateRangeType.getOperations();
		var bNoMonthFound = true;
		for (i = 0; i < aOperations.length; i++) {
			if (aOperations[i].category.indexOf("MONTH") === -1) {
				bNoMonthFound = false;
				break;
			}
		}
		assert.strictEqual(bNoMonthFound, true, "applySettings include filter category month");
		assert.strictEqual(oDateRangeType.getDefaultOperation().key === "LASTMONTHS", true, "getDefaultOperation LASTMONTHS after filter");

		oDateRangeType.applySettings({}); //reset the filter
		assert.strictEqual(Object.keys(DateRangeType.Operations).length === oDateRangeType.getOperations().length, true, "applySettings reset and all operations available");
		assert.strictEqual(oDateRangeType.getDefaultOperation().key === "DATERANGE", true, "getDefaultOperation DATERANGE");

		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "TODAY", "value1": null, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.initialize({ "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "FieldName" }], "items": [] });
		oDateRangeType.initialize({ "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "FieldName" }, { "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "FieldName" }], "items": [] });
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "x", "data": { "operation": "TODAY", "value1": null, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "value1": null, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "XX", "value1": null, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.setAsync(true);
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "XX", "value1": null, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		//processes some pendings to get the internal timers cleared once
		oDateRangeType.setPending(true);
		oDateRangeType.setPending(false);
		oDateRangeType.setPending(true); //
		oDateRangeType.setPending(false);
		oDateRangeType.setAsync(false);
		//Islamic month
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "SPECIFICMONTH", "value1": 3, "value2": null, "key": "FieldName", "calendarType": "Islamic" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });

		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "LASTWEEKS", "value1": 3, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "SPECIFICMONTH", "value1": 3, "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "FROM", "value1": "", "value2": "2011-01-1T21:59:59.999Z", "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "operation": "TO", "value1": "2016-04-28T21:59:59.999Z", "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });

		bFired = false;
		oDateRangeType.initialize({ "conditionTypeInfo": { "name": "sap.ui.comp.config.condition.DateRangeType", "data": { "value1": "2016-04-28T21:59:59.999Z", "value2": null, "key": "FieldName", "calendarType": "Gregorian" } }, "ranges": [{ "operation": "BT", "value1": "2016-04-27T22:00:00.000Z", "value2": "2016-04-28T21:59:59.999Z", "exclude": false, "keyField": "BLDAT" }], "items": [] });
		oFilterProvider.setPending(false);
		assert.strictEqual(bFired, false, "fireFilterChange should not be called via initialize of DateRangeType");

		var aDefaultValue;
		var oData;
		for (var n in DateRangeType.Operations) {
			aDefaultValue = oDateRangeType.getDefaultValues(DateRangeType.Operations[n]);
			oData = {
				operation: n,
				key: "FieldName",
				value1: aDefaultValue[0],
				value2: aDefaultValue[1]
			};

			oDateRangeType.setCondition(oData);
			if ("value1" in DateRangeType.Operations[n] && oData.value1 === null) {
				assert.strictEqual(oDateRangeType.getFilterRanges().length === 0, true, "No default value1, no range");
			}
			if ("value2" in DateRangeType.Operations[n] && oData.value2 === null) {
				assert.strictEqual(oDateRangeType.getFilterRanges().length === 0, true, "No default value2, no range");
			}
			if ("value1" in DateRangeType.Operations[n] && oData.value1 !== null && !("value2" in DateRangeType.Operations[n])) {
				assert.strictEqual(oDateRangeType.getFilterRanges().length > 0, true, "Default value1, leads to range");
			}
			if ("value2" in DateRangeType.Operations[n] && oData.value2 !== null && !("value1" in DateRangeType.Operations[n])) {
				assert.strictEqual(oDateRangeType.getFilterRanges().length > 0, true, "Default value2, leads to range");
			}
			if ("value2" in DateRangeType.Operations[n] && oData.value2 !== null && "value1" in DateRangeType.Operations[n] && oData.value1 !== null) {
				assert.strictEqual(oDateRangeType.getFilterRanges().length > 0, true, "Default value 1, value2, leads to range");
			}
			if (!("value2" in DateRangeType.Operations[n]) && !("value1" in DateRangeType.Operations[n])) {
				assert.strictEqual(oDateRangeType.getFilterRanges().length > 0, true, "No values needed, leads to range");
			}
			if (n === "FROM") {
				oData = {
					operation: n,
					key: "FieldName",
					value1: new UniversalDate(),
					value2: null
				};

				oDateRangeType.setCondition(oData);
				assert.strictEqual(oDateRangeType.getFilterRanges().length > 0, true, "Default value1, leads to range");
			}
		}

		//translatables
		assert.strictEqual(Type.getTranslatedText({ bundle: "sap.ui.comp", key: "CONDITION_DATERANGETYPE_SINGLE_DAY" }) === oDateRangeType.getTranslatedText("CONDITION_DATERANGETYPE_SINGLE_DAY"), true, "TranslatedText with object bundle");


		assert.strictEqual(Type.getTranslatedText({ bundle: "sap.ui.comp", key: "CONDITION_DATERANGETYPE_SINGLE_DAY" }) === oDateRangeType.getTranslatedText("CONDITION_DATERANGETYPE_SINGLE_DAY"), true, "TranslatedText with object bundle");
		//create an invalid condition
		oData = {
			key: "FieldName",
			value1: aDefaultValue[0],
			value2: aDefaultValue[1]
		};
		oDateRangeType.setCondition(oData);
		assert.strictEqual(oDateRangeType.isValidCondition(), false, "Invalid Condition");
		//
		delete DateRangeType.Operations.LASTWEEKS["value1"];
		DateRangeType.Operations.LASTWEEKS["value2"] = null;
		oData = {
			operation: "LASTWEEKS",
			key: "FieldName",
			value2: 1
		};
		oDateRangeType.setCondition(oData);
		oData = {
			operation: "LASTWEEKS",
			key: "FieldName",
			value2: null
		};
		oDateRangeType.setCondition(oData);
		assert.strictEqual(oDateRangeType.isValidCondition(), false, "Invalid Condition with ony value2");
		DateRangeType.Operations.LASTWEEKS["value1"] = null;
		delete DateRangeType.Operations.LASTWEEKS["value2"];

		// set an valid condition at the end to have consistant state
		oData = {
			operation: "LASTWEEKS",
			key: "FieldName",
			value1: null
		};
		oDateRangeType.setCondition(oData);

	});
	QUnit.test("Test Type methods", function (assert) {
		//base type checks
		var oFieldMetadata = { isMandatory: false };
		var oType = new Type("FieldName", oFilterProvider, oFieldMetadata);
		assert.strictEqual(oType.getName() === "sap.ui.comp.config.condition.Type", true, "getName");
		assert.strictEqual(oType.getType() === "Edm", true, "getType");
		assert.strictEqual(oType.getTokenText() === "", true, "getTokenText");
		assert.strictEqual(oType.getControls().length === 0, true, "getControls");
		assert.strictEqual(oType.getOperations().length === 0, true, "getOperations");
		assert.strictEqual(oType.isValidCondition(), false, "No valid condition in base class");
		assert.strictEqual(oType.isValidCondition(), false, "No valid condition in base class");

		var f = function () { };
		oType.attachPendingChange(f);
		assert.strictEqual(oType.hasListeners("PendingChange"), true, "hasListeners for PendingChange");
		oType.detachPendingChange(f);
		assert.strictEqual(oType.hasListeners("PendingChange"), false, "hasListeners no for PendingChange");
		assert.strictEqual(oType.getDefaultOperation() === null, true, "No default operations");
		assert.strictEqual(oType.getFilter() === null, true, "getFilter: No filters");
		assert.strictEqual(oType.getFilterRanges() === null, true, "getFilterRanges: No Ranges");
		assert.strictEqual(oType.validate(false), true, "validate : no force");
		assert.strictEqual(oType.validate(true), true, "validate : force not mandatory");
		oFieldMetadata.isMandatory = true;
		assert.strictEqual(oType.validate(true), false, "validate : force mandatory");
		//push coverage
		oType.updateOperations();
	});

	QUnit.test("Test onChange handler", function (assert) {
		var oDateRangeType = new DateRangeType("FieldName", null);
		oDateRangeType.updateOperations();

		var oOperation, bResult, sState;

		//test _defaultOnChangeHanlder
		oOperation = oDateRangeType.getOperation("TODAY");
		bResult = DateRangeType._defaultOnChangeHandler.call(oOperation, "Today", oDateRangeType);
		assert.strictEqual(bResult, true, "_defaultOnChangeHandler returns true");

		bResult = DateRangeType._defaultOnChangeHandler.call(oOperation, "Today2", oDateRangeType);
		assert.strictEqual(bResult, false, "_defaultOnChangeHandler returns false");

		sState = oDateRangeType.oModel.getProperty("inputstate", oDateRangeType.getContext());
		assert.strictEqual(sState === "NONE", true, "inputstate must be NONE");


		oOperation = oDateRangeType.getOperation("FROM");
		bResult = DateRangeType._defaultOnChangeHandler.call(oOperation, "FROM", oDateRangeType);
		assert.strictEqual(bResult, true, "_defaultOnChangeHandler returns true");

		sState = oDateRangeType.oModel.getProperty("inputstate", oDateRangeType.getContext());
		assert.strictEqual(sState === "ERROR", true, "inputstate must be ERROR");


		//test _IntOnChangeHanlder
		oOperation = oDateRangeType.getOperation("LASTWEEKS");
		bResult = DateRangeType._IntOnChangeHandler.call(oOperation, "last 2 weeks", oDateRangeType);
		assert.strictEqual(bResult, true, "_IntOnChangeHandler returns true");

		sState = oDateRangeType.oModel.getProperty("inputstate", oDateRangeType.getContext());
		assert.strictEqual(sState === "NONE", true, "inputstate must be NONE");

		bResult = DateRangeType._IntOnChangeHandler.call(oOperation, "last x weeks", oDateRangeType);
		assert.strictEqual(bResult, true, "_IntOnChangeHandler returns true");

		sState = oDateRangeType.oModel.getProperty("inputstate", oDateRangeType.getContext());
		assert.strictEqual(sState === "ERROR", true, "inputstate must be ERROR");

		bResult = DateRangeType._IntOnChangeHandler.call(oOperation, "wrong", oDateRangeType);
		assert.strictEqual(bResult, false, "_IntOnChangeHandler returns false");

		//test _DateOnChangeHanlder
		oOperation = oDateRangeType.getOperation("FROM");
		bResult = DateRangeType._DateOnChangeHandler.call(oOperation, "from 1/1/00", oDateRangeType);
		assert.strictEqual(bResult, true, "_DateOnChangeHandler returns true");

		bResult = DateRangeType._DateOnChangeHandler.call(oOperation, "from (1/1/00)", oDateRangeType);
		assert.strictEqual(bResult, true, "_DateOnChangeHandler returns true");

		sState = oDateRangeType.oModel.getProperty("inputstate", oDateRangeType.getContext());
		assert.strictEqual(sState === "NONE", true, "inputstate must be NONE");

		bResult = DateRangeType._DateOnChangeHandler.call(oOperation, "from x", oDateRangeType);
		assert.strictEqual(bResult, true, "_DateOnChangeHandler returns true");

		sState = oDateRangeType.oModel.getProperty("inputstate", oDateRangeType.getContext());
		assert.strictEqual(sState === "ERROR", true, "inputstate must be ERROR");

		bResult = DateRangeType._DateOnChangeHandler.call(oOperation, "wrong", oDateRangeType);
		assert.strictEqual(bResult, false, "_DateOnChangeHandler returns false");

		//test _DateRangeOnChangeHanlder
		oOperation = oDateRangeType.getOperation("DATERANGE");
		bResult = DateRangeType._DateRangeOnChangeHandler.call(oOperation, "date range 1/1/00 - 10/1/10", oDateRangeType);
		assert.strictEqual(bResult, true, "_DateRangeOnChangeHandler returns true");

		sState = oDateRangeType.oModel.getProperty("inputstate", oDateRangeType.getContext());
		assert.strictEqual(sState === "NONE", true, "inputstate must be NONE");

		bResult = DateRangeType._DateRangeOnChangeHandler.call(oOperation, "date range x - y", oDateRangeType);
		assert.strictEqual(bResult, true, "_DateRangeOnChangeHandler returns true");

		sState = oDateRangeType.oModel.getProperty("inputstate", oDateRangeType.getContext());
		assert.strictEqual(sState === "ERROR", true, "inputstate must be ERROR");

		bResult = DateRangeType._DateRangeOnChangeHandler.call(oOperation, "wrong", oDateRangeType);
		assert.strictEqual(bResult, false, "_DateRangeOnChangeHandler returns false");

		//test _MonthOnChangeHanlder
		oOperation = oDateRangeType.getOperation("SPECIFICMONTH");
		bResult = DateRangeType._MonthOnChangeHandler.call(oOperation, "month may", oDateRangeType);
		assert.strictEqual(bResult, true, "_MonthOnChangeHandler returns true");

		bResult = DateRangeType._MonthOnChangeHandler.call(oOperation, "june", oDateRangeType);
		assert.strictEqual(bResult, true, "_MonthOnChangeHandler returns true");

		sState = oDateRangeType.oModel.getProperty("inputstate", oDateRangeType.getContext());
		assert.strictEqual(sState === "NONE", true, "inputstate must be NONE");

		bResult = DateRangeType._MonthOnChangeHandler.call(oOperation, "month wrong", oDateRangeType);
		assert.strictEqual(bResult, true, "_MonthOnChangeHandler returns false");

		sState = oDateRangeType.oModel.getProperty("inputstate", oDateRangeType.getContext());
		assert.strictEqual(sState === "ERROR", true, "inputstate must be ERROR");

		bResult = DateRangeType._MonthOnChangeHandler.call(oOperation, "wrong", oDateRangeType);
		assert.strictEqual(bResult, false, "_MonthOnChangeHandler returns false");
	});

	QUnit.test("Test filterSuggest handler", function (assert) {
		var oDateRangeType = new DateRangeType("FieldName", null);
		oDateRangeType.updateOperations();

		var oOperation, bResult;
		var oItem = { setText: function () { }, setAdditionalText: function () { } };

		//test _DefaultFilterSuggestItem
		oOperation = oDateRangeType.getOperation("TODAY");
		bResult = DateRangeType._DefaultFilterSuggestItem.call(oOperation, "t", oItem, oDateRangeType);
		assert.strictEqual(bResult, true, "_DefaultFilterSuggestItem returns true");

		oOperation = oDateRangeType.getOperation("LASTWEEKS");
		bResult = DateRangeType._DefaultFilterSuggestItem.call(oOperation, "wee", oItem, oDateRangeType);
		assert.strictEqual(bResult, true, "_DefaultFilterSuggestItem returns true");

		bResult = DateRangeType._DefaultFilterSuggestItem.call(oOperation, "wrong", oItem, oDateRangeType);
		assert.strictEqual(bResult, false, "_DefaultFilterSuggestItem returns false");


		//test _IntFilterSuggestItem
		oOperation = oDateRangeType.getOperation("LASTDAYS");
		bResult = DateRangeType._IntFilterSuggestItem.call(oOperation, "1", oItem, oDateRangeType);
		assert.strictEqual(bResult, true, "_IntFilterSuggestItem returns true");
	});

	QUnit.start();
});
