/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/core/LocaleData",
	"sap/me/Calendar",
	"sap/me/CalendarRenderer",
	"sap/ui/core/Locale"
], function(
	qutils,
	createAndAppendDiv,
	LocaleData,
	Calendar,
	CalendarRenderer,
	Locale
) {
	"use strict";

	// prepare DOM
	createAndAppendDiv("target1");
	createAndAppendDiv("target2");


	/**
	 * Returns the interval format with the given Id (see CLDR documentation for valid Ids)
	 * or the fallback format if no interval format with that Id is known.
	 * Note: This is done using a <B>private</B> method of LocaleData.
	 *
	 * The empty Id ("") might be used to retrieve the interval format fallback.
	 *
	 * TODO: in 1.17: delete this method and replace this call:
	 *      this._getIntervalPattern(oLocaleData, sPatternId);
	 * by this:
	 *      oLocaleData.getIntervalPattern(sPatternId);
	 *
	 * @see Git change #308949
	 *
	 * @param {sap.ui.core.LocaleData} oLocaleData
	 * @param {string} sPatternId Id of the interval format, e.g. "d-d"
	 *
	 * @returns {string} interval format string with placeholders {0} and {1}
	 *
	 * @private
	 * @experimental Since 1.16.4
	 */
	function formerSapMeCalendarRenderer_getIntervalPattern(oLocaleData, sPatternId) {
		var sPattern = "";

		if (oLocaleData !== undefined && oLocaleData !== null) {
			sPattern = oLocaleData.getIntervalPattern(sPatternId);
		}

		// Since intervalFormatFallback returns a value, the !sPattern clause is impossible to reach and thus, to test.
		if (!sPattern) {
			if (sap.ui.getCore().getConfiguration().getRTL()) {
				sPattern = "{1} - {0}";
			} else {
				sPattern = "{0} - {1}";
			}
		}

		return sPattern;
	}

	QUnit.test("LocalData GetIntervalPattern test - Calendar renderer LocaleData private function call removal", function (assert) {
		// see git changes #313758 and #308949
		var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
		var oLocaleData = LocaleData.getInstance(oLocale);
		var pattern;

//            var currentRTL = sap.ui.getCore().getConfiguration().getRTL();
		pattern = "d-d";
		assert.equal(formerSapMeCalendarRenderer_getIntervalPattern(oLocaleData, pattern), oLocaleData.getIntervalPattern(pattern), "Check: 1st test pattern");

		pattern = "yMMM-y";
		assert.equal(formerSapMeCalendarRenderer_getIntervalPattern(oLocaleData, pattern), oLocaleData.getIntervalPattern(pattern), "Check: 2nd test pattern");

		pattern = "crashPattern";
		assert.equal(formerSapMeCalendarRenderer_getIntervalPattern(oLocaleData, pattern), oLocaleData.getIntervalPattern(pattern), "Check: 3rd test pattern");

//            sap.ui.getCore().getConfiguration().setRTL(!currentRTL);
//            pattern = "d-d";
//            assert.equal(formerSapMeCalendarRenderer_getIntervalPattern(oLocaleData, pattern), oLocaleData.getIntervalPattern(pattern), "Check: 4th test pattern");
//
//            pattern = "yMMM-y";
//            assert.equal(formerSapMeCalendarRenderer_getIntervalPattern(oLocaleData, pattern), oLocaleData.getIntervalPattern(pattern), "Check: 5th test pattern");
//
//            pattern = "crashPattern";
//            assert.equal(formerSapMeCalendarRenderer_getIntervalPattern(oLocaleData, pattern), oLocaleData.getIntervalPattern(pattern), "Check: 6th test pattern");
//
//            // check if required.
//            sap.ui.getCore().getConfiguration().setRTL(currentRTL);
	});

	var DAY_TO_GETDAY = {
		SUNDAY: 0,
		MONDAY: 1,
		TUESDAY: 2,
		WEDNESDAY: 3,
		THURSDAY: 4,
		FRIDAY: 5,
		SATURDAY: 6
	};

	QUnit.test('BCP 0120025231 0000180047 2016 - EN', function (assert) {
		var oCalendar = new Calendar();
		oCalendar._oLocale = new Locale("en");
		oCalendar._oLocaleData = LocaleData.getInstance(oCalendar._oLocale);
		// EN weekends are saturday and sunday
		assert.ok(oCalendar.isWeekend(DAY_TO_GETDAY.SATURDAY), "saturday should be weekend");
		assert.ok(oCalendar.isWeekend(DAY_TO_GETDAY.SUNDAY), "sunday should be weekend");
		assert.ok(!oCalendar.isWeekend(DAY_TO_GETDAY.MONDAY), "monday should not be weekend");
		assert.ok(!oCalendar.isWeekend(DAY_TO_GETDAY.TUESDAY), "tuesday should not be weekend");
		assert.ok(!oCalendar.isWeekend(DAY_TO_GETDAY.WEDNESDAY), "wednesday should not be weekend");
		assert.ok(!oCalendar.isWeekend(DAY_TO_GETDAY.THURSDAY), "thursday should not be weekend");
		assert.ok(!oCalendar.isWeekend(DAY_TO_GETDAY.FRIDAY), "friday should not be weekend");

		oCalendar.destroy();
	});

	QUnit.test('BCP 0120025231 0000180047 2016 - ar_SA', function (assert) {
		var oCalendar = new Calendar();
		oCalendar._oLocale = new Locale("ar_SA");
		oCalendar._oLocaleData = LocaleData.getInstance(oCalendar._oLocale);
		// ar_SA weekends are friday and saturday
		assert.ok(oCalendar.isWeekend(DAY_TO_GETDAY.FRIDAY), "friday should be weekend");
		assert.ok(oCalendar.isWeekend(DAY_TO_GETDAY.SATURDAY), "saturday should be weekend");
		assert.ok(!oCalendar.isWeekend(DAY_TO_GETDAY.SUNDAY), "sunday should not be weekend");
		assert.ok(!oCalendar.isWeekend(DAY_TO_GETDAY.MONDAY), "monday should not be weekend");
		assert.ok(!oCalendar.isWeekend(DAY_TO_GETDAY.TUESDAY), "tuesday should not be weekend");
		assert.ok(!oCalendar.isWeekend(DAY_TO_GETDAY.WEDNESDAY), "wednesday should not be weekend");
		assert.ok(!oCalendar.isWeekend(DAY_TO_GETDAY.THURSDAY), "thursday should not be weekend");

		oCalendar.destroy();
	});
});