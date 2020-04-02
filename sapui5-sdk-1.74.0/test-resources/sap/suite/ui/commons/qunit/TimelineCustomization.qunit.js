sap.ui.define([
	"./TimelineTestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (TestUtils, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 100%;");

	QUnit.module("TimelineCustomization");

	var data = [
		{
			filterValue: "A",
			dateTime: new Date(2016, 0, 1),
			name: "A"
		}, {
			filterValue: "B",
			dateTime: new Date(2016, 0, 2),
			name: "B"
		}, {
			filterValue: "C",
			dateTime: new Date(2016, 0, 3),
			name: "C"
		}, {
			filterValue: "D",
			dateTime: new Date(2016, 0, 4),
			name: "D"
		}, {
			filterValue: "E",
			dateTime: new Date(2016, 0, 5),
			name: "E"
		}
	];

	QUnit.test("Time filter data - model", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
			dateTime: "{dateTime}"
		});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		return timeline._getTimeFilterData().then(function () {
			assert.equal(new Date(2016, 0, 1).getTime(), timeline._minDate.getTime(), true, " min date OK");
			assert.equal(new Date(2016, 0, 5).getTime(), timeline._maxDate.getTime(), true, " max date OK");
			timeline.destroy();
		});

	});

	QUnit.test("Time filter data - client", function (assert, done) {
		var timeline = TestUtils.buildTimeline(data, {enableModelFilter: false}, {
			dateTime: "{dateTime}"
		});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		return timeline._getTimeFilterData().then(function () {
			assert.equal(new Date(2016, 0, 1).getTime(), timeline._minDate.getTime(), true, " min date OK");
			assert.equal(new Date(2016, 0, 5).getTime(), timeline._maxDate.getTime(), true, " max date OK");
			timeline.destroy();
		});
	});

	QUnit.test("Time custom filter model", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {enableModelFilter: false}, {
			dateTime: "{dateTime}"
		});

		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		timeline.setCustomModelFilter("testFilter", new sap.ui.model.Filter({
			path: "dateTime",
			operator: sap.ui.model.FilterOperator.EQ,
			value1: new Date(2016, 0, 1)
		}));

		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 1, true);
		assert.equal(timeline.getContent()[0].getProperty("dateTime").getTime(), new Date(2016, 0, 1).getTime());

		// clear
		timeline.setCustomModelFilter("testFilter", null);
		sap.ui.getCore().applyChanges();

		assert.equal(timeline.getContent().length, 5, true);
		timeline.destroy();
	});

	QUnit.test("Time custom model filter, not found", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {growingThreshold: 2, enableDoubleSided: true, lazyLoading: false}, {
			dateTime: "{dateTime}"
		});

		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		timeline.setCustomModelFilter("testFilter", new sap.ui.model.Filter({
			path: "dateTime",
			operator: sap.ui.model.FilterOperator.EQ,
			value1: new Date(1, 0, 1)
		}));
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 0, true);
		timeline.destroy();
	});

	QUnit.test("Time model filter, not found", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {growingThreshold: 2, enableDoubleSided: true, lazyLoading: false}, {
			dateTime: "{dateTime}"
		});

		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		timeline.setModelFilter({
			type: "Search",
			filter: new sap.ui.model.Filter({
				path: "dateTime",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: new Date(1, 0, 1)
			})
		});
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 0, true);
		timeline.destroy();
	});

	QUnit.test("Time model filter", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}"
		});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		timeline.setModelFilter({
			type: "Data",
			filter: new sap.ui.model.Filter({
				path: "filterValue",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "A"
			})
		});
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "A");

		timeline._clearFilter();
		assert.equal(timeline.getContent().length, 5);

		sap.ui.getCore().applyChanges();

		timeline.setModelFilter({
			type: "Time",
			filter: new sap.ui.model.Filter({
				path: "dateTime",
				operator: sap.ui.model.FilterOperator.GT,
				value1: new Date(2016, 0, 3)
			})
		});

		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 2);

		timeline.setModelFilter({
			type: "Data",
			filter: new sap.ui.model.Filter({
				path: "filterValue",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "D"
			})
		});
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "D", true);

		timeline.setModelFilter({
			type: "Data",
			filter: null
		});

		timeline.setModelFilter({
			type: "Time",
			filter: null
		});
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 5);

		timeline.setModelFilter({
			type: "Search",
			filter: new sap.ui.model.Filter({
				path: "dateTime",
				operator: sap.ui.model.FilterOperator.GT,
				value1: new Date(2016, 0, 3)
			})
		});
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 2);

		timeline.setModelFilter({
			type: "Data",
			filter: new sap.ui.model.Filter({
				path: "filterValue",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: "D"
			})
		});
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "D", true);

		timeline.setModelFilter({
			type: "Data",
			filter: null
		});
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 2);

		timeline.setModelFilter({
			type: "Search",
			filter: null
		});
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 5);

		timeline.destroy();
	});

	QUnit.test("Timeline filter click simulation", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}"
		});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		timeline.setCurrentFilter(["A"]);
		timeline._filterData();
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "A", true);

		timeline.setCurrentTimeFilter({
			from: new Date(2016, 0, 1),
			to: new Date(2016, 0, 2),
			type: "Day"
		});
		timeline._filterData(true);
		sap.ui.getCore().applyChanges();

		assert.equal(timeline.getContent().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "A", true);

		timeline.setCurrentTimeFilter({
			from: new Date(2016, 0, 3),
			to: new Date(2016, 0, 5),
			type: "Day"
		});
		timeline._filterData(true);
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 0);

		timeline.setCurrentFilter([]);
		timeline._filterData(true);
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 3);

		timeline._clearFilter();
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getContent().length, 5);
		timeline.destroy();

	});

	QUnit.test("Timeline search", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}",
			userName: "{name}"
		});

		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		timeline.setCurrentSearch("A");
		timeline._search("A");

		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(timeline.getContent().length, 1);
		assert.equal(timeline.getContent()[0].getProperty("userName"), "A");

		timeline.destroy();
	});

	QUnit.test("Timeline set data", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}",
			userName: "{name}"
		});
		timeline.setData(data);

		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(timeline.getContent().length, 5);
		assert.equal(timeline.getContent()[0].getProperty("filterValue"), "E");

		timeline.destroy();
	});

	QUnit.test("Timeline suspend social", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {
			enableSocial: true
		}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}",
			userName: "{name}"
		});

		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(timeline.getContent()[0].$("replyLink").attr("disabled"), undefined);

		timeline.setSuspendSocialFeature(true);
		sap.ui.getCore().applyChanges();

		assert.equal(timeline.getContent()[0].$("replyLink").attr("disabled"), "disabled");

		timeline.destroy();
	});

	QUnit.test("Hiding controls", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {
			axisOrientation: "Horizontal"
		}, {
			dateTime: "{dateTime}",
			filterValue: "{filterValue}",
			userName: "{name}"
		});

		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(timeline.$("searchField").length, 1, "search");
		assert.equal(timeline.$("filterIcon").length, 1, "filter");
		assert.equal(timeline.$("sortIcon").length, 1, "sort");

		timeline.setShowSearch(false);
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.$("searchField").length, 0, "search");

		timeline.setShowSort(false);
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.$("sortIcon").length, 0, "sort");

		timeline.setShowItemFilter(false);
		timeline.setShowTimeFilter(false);
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.$("filterIcon").length, 0, "sort");

		timeline.setShowHeaderBar(false);
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.$("headerBar").length, 0, "header bar");

		timeline.destroy();
	});

	QUnit.test("Hiding filters", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {}, {
				dateTime: "{dateTime}",
				filterValue: "{filterValue}",
				userName: "{name}"
			}),
			aItems;

		timeline.placeAt("content");
		timeline._openFilterDialog();
		aItems = timeline._objects.getFilterContent().getAggregation("filterItems");

		assert.equal(aItems.length, 2, "both filters");

		timeline.setShowItemFilter(false);
		aItems = timeline._objects.getFilterContent().getAggregation("filterItems");

		assert.equal(aItems.length, 1, "time");
		assert.equal(aItems[0].getProperty("key"), "range", "both filters");

		timeline.setShowItemFilter(true);
		timeline.setShowTimeFilter(false);
		aItems = timeline._objects.getFilterContent().getAggregation("filterItems");

		assert.equal(aItems.length, 1, "item");
		assert.equal(aItems[0].getProperty("key"), "items", "both filters");

		timeline.destroy();
	});
});
