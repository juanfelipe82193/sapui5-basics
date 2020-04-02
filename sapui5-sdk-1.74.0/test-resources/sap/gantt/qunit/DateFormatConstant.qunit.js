/*global QUnit */
sap.ui.define([], function(){
	"use strict";
	QUnit.test("test for date format", function (assert) {
		var tickTimeIntervalDefinition = sap.gantt.config.DEFAULT_TIME_ZOOM_STRATEGY;
		var date = new Date(2015, 10, 2, 14, 10, 0, 0);

		//for largeInterval
		var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["5min"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "Monday, Nov 2, 15", "Test 5min format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["10min"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "Monday, Nov 2, 15", "Test 10min format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["15min"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "Monday, Nov 2, 15", "Test 15min format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["30min"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "Monday, Nov 2, 15", "Test 30min format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["1hour"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "Monday, Nov 2, 15", "Test 1hour format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["2hour"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "Monday, Nov 2, 15", "Test 2hour format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["4hour"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "Monday, Nov 2, 15", "Test 4hour format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["6hour"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "Monday, Nov 2, 15", "Test 6hour format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["12hour"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "Monday, Nov 2, 15", "Test 12hour format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["1day"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November 2015", "Test 1day format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["2day"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November 2015", "Test 2day format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["4day"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November 2015", "Test 4day format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["1week"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November 2015", "Test 1week format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["2week"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November 2015", "Test 2week format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["1month"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November 2015", "Test 1month format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["2month"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November 2015", "Test 2month format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["4month"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2015", "Test 4month format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["6month"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2015", "Test 6month format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["1year"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2015", "Test 1year format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["2year"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2015", "Test 2year format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["5year"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2015", "Test 5year format: largeInterval");

		//for smallInterval
		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["5min"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "14:10", "Test 5min format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["10min"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "14:10", "Test 10min format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["15min"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "14:10", "Test 15min format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["30min"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "14:10", "Test 30min format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["1hour"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "14:10", "Test 1hour format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["2hour"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "14:10", "Test 2hour format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["4hour"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "14:10", "Test 4hour format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["6hour"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "14:10", "Test 6hour format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["12hour"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "14:10", "Test 12hour format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["1day"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2.11.", "Test 1day format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["2day"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2.11.", "Test 2day format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["4day"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2.11.", "Test 4day format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["1week"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2.11.", "Test 1week format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["2week"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2.11.", "Test 2week format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["1month"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2.11.", "Test 1month format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["2month"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2.11.", "Test 2month format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["4month"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November", "Test 4month format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["6month"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November", "Test 6month format: smallInterval");

	});
});
