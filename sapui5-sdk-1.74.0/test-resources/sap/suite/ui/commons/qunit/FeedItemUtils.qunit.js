/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/suite/ui/commons/util/FeedItemUtils"
], function(QUnitUtils, FeedItemUtils) {
	"use strict";

	QUnit.module("Age Calculation Test", {
		beforeEach : function() {

		},
		afterEach : function() {

		}
	});

	QUnit.test("TestIncorrectDate", function(assert) {

		var dPublicationDate = (new String("abc"));
		assert.equal(FeedItemUtils
				.calculateFeedItemAge(dPublicationDate), "",
				"Returned age of feed item is empty string");
	});

	QUnit.test("TestCorrectDate", function(assert) {

		//commenting this for now
		// test days
		var dNow = new Date();
		dNow.setUTCDate(dNow.getUTCDate() - 10);
		var expectedAge = getKeyValueFromLocaleSpecificBundle(
				"FEEDTILE_DAYS_AGO", "10");
		assert.equal(FeedItemUtils
				.calculateFeedItemAge(dNow), expectedAge,
				"Returned age of feed item in Days is correct");

		// test day
		dNow = new Date();
		dNow.setDate(dNow.getDate() - 1);
		expectedAge = getKeyValueFromLocaleSpecificBundle("FEEDTILE_DAY_AGO",
				"1");
		assert.equal(FeedItemUtils
				.calculateFeedItemAge(dNow), expectedAge,
				"Returned age of feed item in Day is correct");

		// test hours
		dNow = new Date();
		dNow.setHours(dNow.getHours() - 10);
		expectedAge = getKeyValueFromLocaleSpecificBundle("FEEDTILE_HOURS_AGO",
				"10");
		assert.equal(FeedItemUtils
				.calculateFeedItemAge(dNow), expectedAge,
				"Returned age of feed item in Hours is correct");

		// test hours
		dNow = new Date();
		dNow.setHours(dNow.getHours() - 1);
		expectedAge = getKeyValueFromLocaleSpecificBundle("FEEDTILE_HOUR_AGO",
				"1");
		assert.equal(FeedItemUtils
				.calculateFeedItemAge(dNow), expectedAge,
				"Returned age of feed item in Hour is correct");

		// test minutes
		dNow = new Date();
		dNow.setMinutes(dNow.getMinutes() - 10);
		expectedAge = getKeyValueFromLocaleSpecificBundle(
				"FEEDTILE_MINUTES_AGO", "10");
		assert.equal(FeedItemUtils
				.calculateFeedItemAge(dNow), expectedAge,
				"Returned age of feed item in Minutes is correct");

		// test minute
		dNow = new Date();
		dNow.setMinutes(dNow.getMinutes() - 1);
		expectedAge = getKeyValueFromLocaleSpecificBundle(
				"FEEDTILE_MINUTE_AGO", "1");
		assert.equal(FeedItemUtils
				.calculateFeedItemAge(dNow), expectedAge,
				"Returned age of feed item in Minute is correct");
	});

	/*************************************************************************************************/

	function getKeyValueFromLocaleSpecificBundle(key, replacementValue) {

		var oLocale = sap.ui.getCore().getConfiguration().getLanguage();
		var oResBundle = sap.ui.getCore().getLibraryResourceBundle(
				"sap.suite.ui.commons", oLocale);

		return oResBundle.getText(key, [ replacementValue ]);
	}

	/************************************************************************************************/

});