sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/suite/ui/commons/util/DateUtils",
	"sap/suite/ui/commons/util/FeedAggregator"
], function(QUnitUtils, DateUtils, FeedAggregator) {
	"use strict";

	function url(path) {
		return sap.ui.require.toUrl("test-resources/sap/suite/ui/commons/qunit/fixture/" + path);
	}

	QUnit.module("getFeeds - sap.suite.ui.commons.util.FeedAggregator");

	QUnit.test("GetMultipleFeeds", function (assert){
		var done = assert.async();
		var requestCompleted = function(oControlEvent){
			assert.equal(jsonModel.getData().items.length, 25, "The number of unfiltered articles must be equal to 25.");
			done();
		};

		var requestFailed = function(oControlEvent){
			assert.ok(false);
		};
		var jsonModel = FeedAggregator.getFeeds([url("SapNewsRss.xml"), url("NprRss.xml")], [], [], requestCompleted, requestFailed);
	});

	QUnit.test("GetMultipleFeedsFiltered", function (assert){
		var done = assert.async();
		var requestCompleted = function(oControlEvent){
			assert.equal(jsonModel.getData().items.length, 2, "The number of filtered articles must be equal to 2.");
			done();
		};

		var requestFailed = function(oControlEvent){
			assert.ok(false);
		};
		var jsonModel = FeedAggregator.getFeeds([url("SapNewsRss.xml"), url("NprRss.xml")], ["SAP Solutions", "SAP Student", "Evergreen Question", "Teary Paula Deen"], ["Sailing Event", "HBCU"], requestCompleted, requestFailed);
	});

	QUnit.test("CaseInSensitiveFiltering", function (assert){
		var done = assert.async();
		var requestCompleted = function(oControlEvent){
			assert.equal(jsonModel.getData().items.length, 2, "The number of case insensitive filtered articles must be equal to 2.");
			done();
		};

		var requestFailed = function(oControlEvent){
			assert.ok(false);
		};
		var jsonModel = FeedAggregator.getFeeds([url("SapNewsRss.xml"), url("NprRss.xml")], ["sAP SoluTIONs", "sAp StUDENt", "Evergreen Question", "Teary Paula Deen"], ["Sailing EVEnt", "hbCU"], requestCompleted, requestFailed);
	});
});