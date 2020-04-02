sap.ui.define([
	"sap/suite/ui/commons/Timeline",
	"sap/suite/ui/commons/TimelineItem",
	"./TimelineTestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (Timeline, TimelineItem, TestUtils, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 100%;");

	QUnit.module("TimelineGroupingTest");

	var aData = [
		{
			dateTime: new Date(2016, 0, 1),
			visible: true,
			title: "Item 1"
		}, {
			dateTime: new Date(2016, 0, 2),
			visible: true,
			title: "Item 2"
		}, {
			dateTime: new Date(2016, 0, 10),
			visible: true,
			title: "Item 3"
		}, {
			dateTime: new Date(2016, 1, 7),
			visible: true,
			title: "Item 4"
		}, {
			dateTime: new Date(2017, 8, 30),
			visible: true,
			title: "Item 5"
		}
	];

	var oOptions = {
		sortOldestFirst: true,
		showIcons: false,
		groupBy: "dateTime",
		axisOrientation: "Horizontal",
		groupByType: "Year"
	};


	function yearTest(assert, oTimeline) {
		var aGroups = oTimeline.getGroups();

		assert.equal(aGroups[0]._groupID, "2016", "Year - First group key is '2016'");
		assert.equal(aGroups[1]._groupID, "2017", "Year - First group key is '2017'");
		assert.equal(aGroups.length, "2", "Year - Group count is 2");
	}

	function monthTest(assert, oTimeline) {
		var aGroups = oTimeline.getGroups();

		assert.equal(aGroups[0]._groupID, "2016/0", "Month - First group key is '2016/0'");
		assert.equal(aGroups[1]._groupID, "2016/1", "Month - First group key is '2016/1'");
		assert.equal(aGroups[2]._groupID, "2017/8", "Month - First group key is '2017/8'");
		assert.equal(aGroups.length, "3", "Month - Group count is 3");
	}

	function quarterTest(assert, oTimeline) {
		var aGroups = oTimeline.getGroups();

		assert.equal(aGroups[0]._groupID, "2016/0", "Quarter - First group key is '2016/0'");
		assert.equal(aGroups[1]._groupID, "2017/2", "Quarter - First group key is '2017/2'");
		assert.equal(aGroups.length, "2", "Quarter - Group count is 2");
	}

	function weekTest(assert, oTimeline) {
		var aGroups = oTimeline.getGroups();

		assert.equal(aGroups[0]._groupID, "2016/1", "Week - First group key is '2016/1'");
		assert.equal(aGroups[1]._groupID, "2016/3", "Week - First group key is '2016/3'");
		assert.equal(aGroups[2]._groupID, "2016/7", "Week - First group key is '2016/7'");
		assert.equal(aGroups.length, "4", "Week - Group count is 4");
	}

	function dayTest(assert, oTimeline) {
		var aGroups = oTimeline.getGroups();

		assert.equal(aGroups[0]._groupID, "2016/0/1", "Day - First group key is '2016/0/1'");
		assert.equal(aGroups[1]._groupID, "2016/0/2", "Day - First group key is '2016/0/2'");
		assert.equal(aGroups[2]._groupID, "2016/0/10", "Day - First group key is '2016/0/10'");
		assert.equal(aGroups.length, "5", "Day - Group count is 5l");
	}

	function customGroupingTest(assert, oTimeline) {
		oTimeline.setCustomGrouping(function (oDate) {
			return {
				key: oDate.getFullYear() + "/" + (oDate.getMonth() < 6 ? 1 : 2),
				title: oDate.getFullYear() + "/" + (oDate.getMonth() < 6 ? "1. half" : "2. half"),
				date: oDate
			};
		});

		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		var aGroups = oTimeline.getGroups();
		assert.equal(aGroups[0]._groupID, "2016/1", "Custom group - First group key is '2016/1'");
		assert.equal(aGroups[1]._groupID, "2017/2", "Custom group - First group key is '2017/2'");
		assert.equal(aGroups.length, "2", "Custom group - Group count is 2");
		oTimeline.destroy();
	}

	function createTimeline(sGroupType) {
		oOptions.groupByType = sGroupType;

		var oTimeline = TestUtils.buildTimeline(aData, oOptions);
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		return oTimeline;
	}

	function createTimelineNoBinding(sGroupType) {
		oOptions.groupByType = sGroupType;

		var oTimeline = TestUtils.buildTimelineWithoutBinding(aData, oOptions);
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		return oTimeline;
	}

	QUnit.test("Timeline binding grouping - Year", function (assert) {
		var oTimeline;

		oTimeline = createTimeline("Year");
		assert.equal(oTimeline.getContent().length, 7, "Year - content contains 7 items(5 base + 2 groups)");
		yearTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline binding grouping - Month", function (assert) {
		var oTimeline;

		oTimeline = createTimeline("Month");
		assert.equal(oTimeline.getContent().length, 8, "content contains 8 items(5 base + 3 groups)");
		monthTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline binding grouping - Quarter", function (assert) {
		var oTimeline;

		oTimeline = createTimeline("Quarter");
		assert.equal(oTimeline.getContent().length, 7, "content contains 8 items(5 base + 2 groups)");
		quarterTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline binding grouping - Week", function (assert) {
		var oTimeline;

		oTimeline = createTimeline("Week");
		assert.equal(oTimeline.getContent().length, 9, "WEEK - content contains 8 items(5 base + 4 groups)");
		weekTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline binding grouping - Day", function (assert) {
		var oTimeline;

		oTimeline = createTimeline("Day");
		assert.equal(oTimeline.getContent().length, 10, "DAY - content contains 10 items(5 base + 5 groups)");
		dayTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline binding grouping - Custom grouping", function (assert) {
		var oTimeline;

		oTimeline = TestUtils.buildTimelineWithoutBinding(aData, oOptions);
		customGroupingTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Year", function (assert) {
		var oTimeline;

		oTimeline = createTimelineNoBinding("Year");
		yearTest(assert, oTimeline);
		assert.equal(oTimeline.getContent().length, 5, "YEAR - content 5 items - groups not included");
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Month", function (assert) {
		var oTimeline;

		oTimeline = createTimelineNoBinding("Month");
		monthTest(assert, oTimeline);
		assert.equal(oTimeline.getContent().length, 5, "MONTH - content 5 items - groups not included");
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Quarter", function (assert) {
		var oTimeline;

		oTimeline = createTimelineNoBinding("Quarter");
		quarterTest(assert, oTimeline);
		assert.equal(oTimeline.getContent().length, 5, "QUARTER - content 5 items - groups not included");
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Week", function (assert) {
		var oTimeline;

		oTimeline = createTimelineNoBinding("Week");
		weekTest(assert, oTimeline);
		assert.equal(oTimeline.getContent().length, 5, "WEEK - content 5 items - groups not included");
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Day", function (assert) {
		var oTimeline;

		oTimeline = createTimelineNoBinding("Day");
		dayTest(assert, oTimeline);
		assert.equal(oTimeline.getContent().length, 5, "DAY - content 5 items - groups not included");
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Custom grouping", function (assert) {
		var oTimeline;

		oTimeline = TestUtils.buildTimelineWithoutBinding(aData, oOptions);
		customGroupingTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline non binding grouping - Custom grouping", function (assert) {
		var oTimeline;

		oTimeline = TestUtils.buildTimelineWithoutBinding(aData, oOptions);
		customGroupingTest(assert, oTimeline);
		oTimeline.destroy();
	});

	QUnit.test("Timeline Expanding", function (assert) {
		var oTimeline = createTimelineNoBinding("Year");

		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		return oTimeline.getGroups()[0]._performExpandCollapse("2016").then(function () {
			assert.equal(jQuery("[groupid=2016]:hidden").length, 8, " 8 hidden items after collapse (4 lines + 4 items)");

			return oTimeline.getGroups()[0]._performExpandCollapse("2016").then(function () { //eslint-disable-line
				assert.equal(jQuery("[groupid=2016]:hidden").length, 1, "1 hidden item after expand (group line)");
				oTimeline.destroy();
			});
		});
	});

	QUnit.test("Horizontal grouping", function (assert) {
		oOptions.axisOrientation = "Horizontal";
		oOptions.enableDoubleSided = true;

		var oTimeline = createTimeline("Year");

		assert.equal(oTimeline.getContent().length, 7, "Year - content contains 7 items(5 base + 2 groups)");
		oTimeline.destroy();
	});
});
