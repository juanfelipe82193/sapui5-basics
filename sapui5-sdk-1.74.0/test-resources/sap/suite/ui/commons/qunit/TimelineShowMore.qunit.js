sap.ui.define([
	"sap/suite/ui/commons/Timeline",
	"sap/suite/ui/commons/TimelineItem",
	"./TimelineTestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (Timeline, TimelineItem, TestUtils, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 100%;");

	QUnit.module("TimelineShowMore");

	var aData = [
		{
			dateTime: new Date(2016, 0, 1),
			visible: true,
			filterValue: "1",
			title: "Item 1"
		},
		{
			dateTime: new Date(2016, 0, 2),
			visible: false,
			filterValue: "1",
			title: "Item 2"
		}, {
			dateTime: new Date(2016, 0, 10),
			visible: true,
			filterValue: "3",
			title: "Item 3"
		}, {
			dateTime: new Date(2016, 1, 7),
			visible: true,
			filterValue: "4",
			title: "Item 4"
		}, {
			dateTime: new Date(2017, 8, 30),
			visible: true,
			filterValue: "5",
			title: "Item 5"
		}
	];

	var oOptions = {
		sortOldestFirst: true,
		showIcons: false
	};

	function createTimeline(iGrowingThreshold) {
		oOptions.enableModelFilter = true;
		oOptions.growingThreshold = iGrowingThreshold;

		var oTimeline = TestUtils.buildTimeline(aData, oOptions);
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		return oTimeline;
	}

	function createTimelineWithClientFilter(iGrowingThreshold) {
		oOptions.enableModelFilter = false;
		oOptions.growingThreshold = iGrowingThreshold;


		var oTimeline = TestUtils.buildTimelineWithoutBinding(aData, oOptions);
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		return oTimeline;
	}

	function hasShowMore(oTimeline) {
		return oTimeline.$().find(".sapSuiteUiCommonsTimelineItemGetMoreButton").length > 0;
	}

	function filterValue(oTimeline, aItems) {
		oTimeline.setCurrentFilter(aItems);
		oTimeline._filterData();
		sap.ui.getCore().applyChanges();
	}

	function testA(oTimeline, assert) {
		assert.equal(hasShowMore(oTimeline), true, "1 item");

		oTimeline._loadMore();
		sap.ui.getCore().applyChanges();

		assert.equal(hasShowMore(oTimeline), true, "2 items");
		oTimeline._loadMore();
		oTimeline._loadMore();
		sap.ui.getCore().applyChanges();
		assert.equal(hasShowMore(oTimeline), true, "4 items");
		oTimeline._loadMore();
		sap.ui.getCore().applyChanges();
		assert.equal(hasShowMore(oTimeline), false, "5 items");

		filterValue(oTimeline, ["1"]);
		assert.equal(hasShowMore(oTimeline), false, "1 filtered items");
	}

	function testB(oTimeline, assert) {
		assert.equal(hasShowMore(oTimeline), false, "5 item");

		filterValue(oTimeline, ["1", "3", "4", "5"]);
		assert.equal(hasShowMore(oTimeline), false, "5 item");

		filterValue(oTimeline, ["1"]);
		assert.equal(hasShowMore(oTimeline), false, "1 item");

	}

	function testC(oTimeline, assert) {
		assert.equal(hasShowMore(oTimeline), true, "1 item");

		filterValue(oTimeline, ["1"]);
		assert.equal(hasShowMore(oTimeline), true, "2 item");

		oTimeline._loadMore();
		sap.ui.getCore().applyChanges();
		assert.equal(hasShowMore(oTimeline), false, "1 item");
	}

	function testForceGrowing(oTimeline, assert) {
		assert.equal(hasShowMore(oTimeline), true, "all items");

		oTimeline.setGrowingThreshold(1);
		oTimeline.invalidate();
		sap.ui.getCore().applyChanges();

		assert.equal(hasShowMore(oTimeline), true, "1 item");

		oTimeline.setGrowingThreshold(10);
		oTimeline.invalidate();
		sap.ui.getCore().applyChanges();

		assert.equal(hasShowMore(oTimeline), true, "10 item");
	}


	QUnit.test("Show more ", function (assert) {
		var oTimeline = createTimeline(1);
		testA(oTimeline, assert);
		oTimeline.destroy();
	});

	QUnit.test("Show more 5 growing", function (assert) {
		var oTimeline = createTimeline(5);
		testB(oTimeline, assert);
		oTimeline.destroy();
	});

	QUnit.test("Filtered 1 growing", function (assert) {
		var oTimeline = createTimeline(1);
		testC(oTimeline, assert);
		oTimeline.destroy();

	});

	QUnit.test("Show more - client filter", function (assert) {
		var oTimeline = createTimelineWithClientFilter(1);
		testA(oTimeline, assert);
		oTimeline.destroy();
	});

	QUnit.test("Show more 5 growing - client filter", function (assert) {
		var oTimeline = createTimelineWithClientFilter(5);
		testB(oTimeline, assert);
		oTimeline.destroy();
	});

	QUnit.test("Filtered 1 growing - client filter", function (assert) {
		var oTimeline = createTimelineWithClientFilter(1);
		testC(oTimeline, assert);
		oTimeline.destroy();
	});

	QUnit.test("Force growing - client filter", function (assert) {
		oOptions.forceGrowing = true;
		var oTimeline = createTimelineWithClientFilter(0);
		testForceGrowing(oTimeline, assert);
		oTimeline.destroy();
	});

	QUnit.test("Force growing - model filter", function (assert) {
		oOptions.forceGrowing = true;
		var oTimeline = createTimeline(0);
		testForceGrowing(oTimeline, assert);
		oTimeline.destroy();
	});
});
