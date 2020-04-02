sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/Timeline",
	"sap/suite/ui/commons/TimelineItem",
	"./TimelineTestUtils",
	"sap/suite/ui/commons/TimelineAlignment",
	"sap/suite/ui/commons/TimelineAxisOrientation",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (jQuery, Timeline, TimelineItem, TestUtils, TimelineAlignment, TimelineAxisOrientation, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 100%;");

	var checkAlignment = function (assert, timeline, alignment) {
		assert.equal(timeline.getAlignment(), alignment, 'alignment property is set to ' + alignment);
	};

	var checkItemsAlignment = function (assert, timeline, alignment, itemCount) {
		var cssClass;
		if (alignment === sap.suite.ui.commons.TimelineAlignment.Left) {
			cssClass = 'div.sapSuiteUiCommonsTimelineItemWrapperVLeft';
		} else if (alignment === sap.suite.ui.commons.TimelineAlignment.Right) {
			cssClass = 'div.sapSuiteUiCommonsTimelineItemWrapperVRight';
		} else if (alignment === sap.suite.ui.commons.TimelineAlignment.Top) {
			cssClass = 'li.sapSuiteUiCommonsTimelineItemHTop';
		} else if (alignment === sap.suite.ui.commons.TimelineAlignment.Bottom) {
			cssClass = 'li.sapSuiteUiCommonsTimelineItemHBottom';
		}

		assert.equal(timeline.$().find('' + cssClass).size(), itemCount, '' + cssClass + ' class is used for ' + itemCount + ' items');
	};

	var checkOrientation = function (assert, timeline, orientation) {
		assert.equal(timeline.getAxisOrientation(), orientation, 'axisOrientation property is set to ' + orientation);

		var cssClass;
		if (orientation === sap.suite.ui.commons.TimelineAxisOrientation.Horizontal) {
			cssClass = 'sapSuiteUiCommonsTimelineH';
		} else if (orientation === sap.suite.ui.commons.TimelineAxisOrientation.Vertical) {
			cssClass = 'sapSuiteUiCommonsTimeline';
		}

		assert.ok(timeline.$().hasClass(cssClass), '' + cssClass + ' class is used for ' + orientation + ' orientation');
	};

	var fiveItems = [
		{
			dateTime: new Date(2016, 0, 1),
			visible: true,
			title: "Item 1"
		}, {
			dateTime: new Date(2016, 1, 1),
			visible: true,
			title: "Item 2"
		}, {
			dateTime: new Date(2016, 1, 5),
			visible: true,
			title: "Item 3"
		}, {
			dateTime: new Date(2017, 7, 1),
			visible: true,
			title: "Item 4"
		}, {
			dateTime: new Date(2017, 8, 30),
			visible: true,
			title: "Item 5"
		}
	];

	QUnit.module("TimelinePropertiesTest");

	QUnit.test("Default values.", function (assert) {
		var timeline = new Timeline();
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		assert.equal(timeline.getAlignment(), TimelineAlignment.Right, "Timeline default alignment is Right.");
		assert.equal(timeline.getAxisOrientation(), TimelineAxisOrientation.Vertical, "Timeline default axisOrientation is Vertical.");
		assert.equal(timeline.getData(), undefined, "Timeline default data is undefined."); // obsolete, use JSONMopdel
		assert.equal(timeline.getEnableAllInFilterItem(), true, "Timeline default enableAllInFilterItem is true."); // obsolete, replaced by checkboxes
		assert.equal(timeline.getEnableBackendFilter(), true, "Timeline default enableBackendFilter is true."); // obsolete, use enableModelFilter
		assert.equal(timeline.getEnableBusyIndicator(), true, "Timeline default enableBusyIndicator is true.");
		assert.equal(timeline.getEnableDoubleSided(), false, "Timeline default enableDoubleSided is false.");
		assert.equal(timeline.getEnableScroll(), true, "Timeline default enableScroll is true.");
		assert.equal(timeline.getEnableModelFilter(), true, "Timeline default getEnableModelFilter is true.");
		assert.equal(timeline.getEnableSocial(), false, "Timeline default getEnableSocial is false.");
		assert.equal(timeline.getForceGrowing(), false, "Timeline default getForceGrowing is false."); // obsolete, removed
		assert.equal(timeline.getGroup(), false, "Timeline default getGroup is false."); // obsolete, use groupByType
		assert.equal(timeline.getGroupBy(), '', "Timeline default getGroupBy is empty.");
		assert.equal(timeline.getGroupByType(), sap.suite.ui.commons.TimelineGroupType.None, "Timeline default getGroupByType is None.");
		assert.equal(timeline.getGrowing(), true, "Timeline default getGrowing is true."); // obsolete, use growingThreshold
		assert.equal(timeline.getGrowingThreshold(), 5, "Timeline default getGrowingThreshold is 5.");
		assert.equal(timeline.getHeight(), '', "Timeline default getHeight is empty.");
		assert.equal(timeline.getLazyLoading(), false, "Timeline default getLazyLoading is false.");
		assert.equal(timeline.getNoDataText(), 'No items are currently available', "Timeline default getNoDataText is undefined.");
		assert.equal(timeline.getScrollingFadeout(), sap.suite.ui.commons.TimelineScrollingFadeout.None, "Timeline default getScrollingFadeout is None.");
		assert.equal(timeline.getShowFilterBar(), true, "Timeline default getShowFilterBar is true."); // obsolete, use showHeaderBar
		assert.equal(timeline.getShowHeaderBar(), true, "Timeline default getShowHeaderBar is true.");
		assert.equal(timeline.getShowIcons(), true, "Timeline default getShowIcons is true.");
		assert.equal(timeline.getShowSearch(), true, "Timeline default getShowSearch is true.");
		assert.equal(timeline.getShowSuggestion(), true, "Timeline default getShowSuggestion is true.");
		assert.equal(timeline.getShowTimeFilter(), true, "Timeline default getShowTimeFilter is true.");
		assert.equal(timeline.getSort(), true, "Timeline default getSort is true.");
		assert.equal(timeline.getSortOldestFirst(), false, "Timeline default getSortOldestFirst is false.");
		assert.equal(timeline.getTextHeight(), '', "Timeline default getTextHeight is empty.");
		assert.equal(timeline.getVisible(), true, "Timeline default getVisible is true.");
		assert.equal(timeline.getWidth(), '100%', "Timeline default getWidth is 100%.");
		timeline.destroy();
	});

	QUnit.test("Timeline Right alignment.", function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {sortOldestFirst: true, showIcons: false});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		checkAlignment(assert, timeline, TimelineAlignment.Right);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Right, fiveItems.length);

		timeline.destroy();
	});

	QUnit.test("Timeline Left alignment.", function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {sortOldestFirst: true, showIcons: false, alignment: "Left"});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		checkAlignment(assert, timeline, TimelineAlignment.Left);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Left, fiveItems.length);

		timeline.destroy();
	});

	QUnit.test("Timeline Top alignment.", function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {sortOldestFirst: true, showIcons: false, alignment: "Top"});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		checkAlignment(assert, timeline, TimelineAlignment.Top);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Top, 0);

		timeline.destroy();
	});

	QUnit.test("Timeline Bottom alignment.", function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {sortOldestFirst: true, showIcons: false, alignment: "Bottom"});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		checkAlignment(assert, timeline, TimelineAlignment.Bottom);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Bottom, 0);

		timeline.destroy();
	});

	QUnit.test("Timeline alignment change.", function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {sortOldestFirst: true, showIcons: false});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		timeline.setAlignment(TimelineAlignment.Left);
		sap.ui.getCore().applyChanges();
		checkAlignment(assert, timeline, TimelineAlignment.Left);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Left, fiveItems.length);

		timeline.destroy();
	});

	QUnit.test("Timeline vertical double-sided mode.", function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {enableDoubleSided: true});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		checkItemsAlignment(assert, timeline, TimelineAlignment.Left, 3);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Right, 2);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Top, 0);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Bottom, 0);
		checkOrientation(assert, timeline, TimelineAxisOrientation.Vertical);

		timeline.destroy();
	});

	QUnit.test("Timeline horizontal double-sided mode.", function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {enableDoubleSided: true, axisOrientation: "Horizontal"});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		checkItemsAlignment(assert, timeline, TimelineAlignment.Left, 0);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Right, 0);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Top, 3);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Bottom, 2);
		checkOrientation(assert, timeline, TimelineAxisOrientation.Horizontal);

		timeline.destroy();
	});

	QUnit.test("Timeline double sided horizontal mode activated after rendering.", function (assert) {
		var timeline = TestUtils.buildTimeline(fiveItems, {});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		timeline.setEnableDoubleSided(true);
		timeline.setAxisOrientation(TimelineAxisOrientation.Horizontal);
		sap.ui.getCore().applyChanges();

		checkItemsAlignment(assert, timeline, TimelineAlignment.Left, 0);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Right, 0);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Top, 3);
		checkItemsAlignment(assert, timeline, TimelineAlignment.Bottom, 2);
		checkOrientation(assert, timeline, TimelineAxisOrientation.Horizontal);

		timeline.destroy();
	});

	// Header bar filter visibility

	function isToolbarElementVisible(oTimeline, sElementIdSufix) {
		var oElement = oTimeline.getHeaderBar().getContent().filter(function (oElement) {
			return jQuery.sap.endsWith(oElement.getId(), sElementIdSufix);
		})[0];
		if (oElement) {
			return oElement.getVisible();
		}
		return false;
	}

	QUnit.test("Timeline sort button - show", function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSort: false
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.setShowSort(true);
		sap.ui.getCore().applyChanges();

		assert.ok(isToolbarElementVisible(oTimeline, "-sortIcon"), "Sort icon should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline sort button - hide", function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSort: true
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.setShowSort(false);
		sap.ui.getCore().applyChanges();

		assert.ok(!isToolbarElementVisible(oTimeline, "-sortIcon"), "Sort icon should not be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline sort button - hide & show", function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSort: true
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.setShowSort(false);
		sap.ui.getCore().applyChanges();
		oTimeline.setShowSort(true);
		sap.ui.getCore().applyChanges();

		assert.ok(isToolbarElementVisible(oTimeline, "-sortIcon"), "Sort icon should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline filter button - show", function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showItemFilter: false,
			showTimeFilter: false
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.setShowItemFilter(true);
		oTimeline.setShowTimeFilter(true);
		sap.ui.getCore().applyChanges();

		assert.ok(isToolbarElementVisible(oTimeline, "-filterIcon"), "Filter icon should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline filter button - hide", function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showItemFilter: true,
			showTimeFilter: true
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.setShowItemFilter(false);
		oTimeline.setShowTimeFilter(false);
		sap.ui.getCore().applyChanges();

		assert.ok(!isToolbarElementVisible(oTimeline, "-filterIcon"), "Filter icon should not be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline filter button - hide & show", function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showItemFilter: true,
			showTimeFilter: true
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.setShowItemFilter(false);
		oTimeline.setShowTimeFilter(false);
		sap.ui.getCore().applyChanges();
		oTimeline.setShowItemFilter(true);
		oTimeline.setShowTimeFilter(true);
		sap.ui.getCore().applyChanges();

		assert.ok(isToolbarElementVisible(oTimeline, "-filterIcon"), "Filter icon should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline search field - show", function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSearch: false
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.setShowSearch(true);
		sap.ui.getCore().applyChanges();

		assert.ok(isToolbarElementVisible(oTimeline, "-searchField"), "Search field should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline search field - hide", function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSearch: true
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.setShowSearch(false);
		sap.ui.getCore().applyChanges();

		assert.ok(!isToolbarElementVisible(oTimeline, "-searchField"), "Search field should not be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline search field - hide & show", function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showSearch: true
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.setShowSearch(false);
		sap.ui.getCore().applyChanges();
		oTimeline.setShowSearch(true);
		sap.ui.getCore().applyChanges();

		assert.ok(isToolbarElementVisible(oTimeline, "-searchField"), "Search field should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline header bar - show", function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showHeaderBar: false
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.setShowHeaderBar(true);
		sap.ui.getCore().applyChanges();

		assert.ok(oTimeline.getHeaderBar().getVisible(), "Header bar should be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline header bar - hide", function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showHeaderBar: true
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.setShowHeaderBar(false);
		sap.ui.getCore().applyChanges();

		assert.ok(!oTimeline.getHeaderBar().getVisible(), "Header bar should not be visible.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline header bar - hide & show", function (assert) {
		var oTimeline = TestUtils.buildTimeline(fiveItems, {
			showIcons: false,
			showHeaderBar: true
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.setShowHeaderBar(false);
		sap.ui.getCore().applyChanges();
		oTimeline.setShowHeaderBar(true);
		sap.ui.getCore().applyChanges();

		assert.ok(oTimeline.getHeaderBar().getVisible(), "Header bar should be visible.");

		oTimeline.destroy();
	});

});
