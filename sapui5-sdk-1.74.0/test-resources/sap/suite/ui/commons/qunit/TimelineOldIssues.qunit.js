sap.ui.define([
	"sap/suite/ui/commons/Timeline",
	"sap/suite/ui/commons/TimelineItem",
	"./TimelineTestUtils",
	"sap/m/FlexBox",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/ui/core/CustomData",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (Timeline, TimelineItem, TestUtils, FlexBox, List, StandardListItem, CustomData, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 100%;");

	QUnit.module("TimelineOldIssuesTest");
	QUnit.test("Timeline with invisible items.", function (assert) {
		//Invisible items broke Timeline rendering.
		var data = [
			{
				dateTime: new Date(2016, 0, 1),
				visible: true,
				title: "Item 1"
			}, {
				dateTime: new Date(2016, 0, 2),
				visible: false,
				title: "Item 2"
			}, {
				dateTime: new Date(2016, 0, 3),
				visible: true,
				title: "Item 3"
			}
		];
		var timeline = TestUtils.buildTimeline(data, {sortOldestFirst: true, showIcons: false});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		var $lis = timeline.$().find("li.sapSuiteUiCommonsTimelineItem");
		assert.equal($lis.size(), 2, "Timeline should render 2 items.");
		assert.equal($lis.eq(0).find("span.sapSuiteUiCommonsTimelineItemShellHdr").text().trim(), "Item 1", "The first item should be Item 1.");
		assert.equal($lis.eq(1).find("span.sapSuiteUiCommonsTimelineItemShellHdr").text().trim(), "Item 3", "The last item should be Item 3.");
		timeline.destroy();
	});

	QUnit.test("Multiple timelines in single container.", function (assert) {
		//Make sure that all jQurey.find are done on single Timeline and not the entire page.
		var data1 = [
			{
				dateTime: new Date(2016, 0, 1),
				title: "Item 1"
			}
		];
		var data2 = [
			{
				dateTime: new Date(2016, 0, 1),
				title: "Item 2"
			}
		];
		var timeline1 = TestUtils.buildTimeline(data1);
		var timeline2 = TestUtils.buildTimeline(data2);
		var box = new FlexBox({
			fitContainer: true,
			items: [timeline1, timeline2]
		});
		box.placeAt("content");
		sap.ui.getCore().applyChanges();
		var title1 = timeline1.$().find("li.sapSuiteUiCommonsTimelineItem").find("span.sapSuiteUiCommonsTimelineItemShellHdr").text().trim();
		var title2 = timeline2.$().find("li.sapSuiteUiCommonsTimelineItem").find("span.sapSuiteUiCommonsTimelineItemShellHdr").text().trim();
		assert.equal(title1, "Item 1", "First Timeline should be rendered correctly.");
		assert.equal(title2, "Item 2", "Second Timeline should be rendered correctly.");
		box.destroy();
	});

	QUnit.test("Timeline with list as a custom control.", function (assert) {
		//List renders li elements just like Timeline. People forget to narrow jQuery.find.
		var list = new List({
			items: [
				new StandardListItem({
					title: "Item 1"
				}),
				new StandardListItem({
					title: "Item 2"
				})
			]
		});
		var itemWithList = new TimelineItem({
			dateTime: new Date(2016, 0, 1),
			embeddedControl: list
		});
		var item = new TimelineItem({
			dateTime: new Date(2016, 0, 2),
			title: "Item 2"
		});
		var timeline = new Timeline({
			showIcons: false,
			sortOldestFirst: true,
			content: [itemWithList, item]
		});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		var $lis = timeline.$().find("li.sapSuiteUiCommonsTimelineItem");
		assert.equal($lis.eq(1).find("span.sapSuiteUiCommonsTimelineItemShellHdr").text().trim(), "Item 2", "The last item should get rendered.");
		timeline.destroy();
	});

	QUnit.test("Timeline with custom action an enableSocial = false.", function (assert) {
		//Reply button shouldn't be visible.
		var item = new TimelineItem({
			dateTime: new Date(2016, 0, 1),
			customAction: [
				new CustomData({
					key: "Action",
					value: "Action"
				})
			]
		});
		var timeline = new Timeline({
			content: [item]
		});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		var $actions = timeline.$().find("li.sapSuiteUiCommonsTimelineItem").eq(0).find("div.sapSuiteUiCommonsTimelineItemShellBottom").find("a");
		assert.equal($actions.size(), 1, "Only one action should be rendered.");
		assert.equal($actions.text(), "Action", "Custom action should be displayed.");
		timeline.destroy();
	});

	QUnit.test("Timeline with custom action which modify custom actions.", function (assert) {
		//If custom action changes, the item should display the new actions only.
		//Custom "show more" "show less".
		var action1 = new CustomData({
			key: "Action 1",
			value: "Action 1"
		});
		var action2 = new CustomData({
			key: "Action 2",
			value: "Action 2"
		});
		var item = new TimelineItem({
			dateTime: new Date(2016, 0, 1),
			customAction: [action1]
		});
		item.attachCustomActionClicked(function (args) {
			item.removeAllCustomAction();
			if (args.getParameter("key") === action1.getKey()) {
				item.addCustomAction(action2);
			} else {
				item.addCustomAction(action1);
			}
		});
		var timeline = new Timeline({
			content: [item]
		});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		var $links = timeline.$().find("li.sapSuiteUiCommonsTimelineItem").eq(0).find("div.sapSuiteUiCommonsTimelineItemShellBottom").find("a");
		assert.equal($links.size(), 1, "Only one custom action link should be visible.");
		assert.equal($links.first().text(), "Action 1", "First custom action should get rendered.");
		$links.first().mousedown().mouseup().click();
		sap.ui.getCore().applyChanges();

		$links = timeline.$().find("li.sapSuiteUiCommonsTimelineItem").eq(0).find("div.sapSuiteUiCommonsTimelineItemShellBottom").find("a");
		assert.equal($links.size(), 1, "Only one custom action link should be visible.");
		assert.equal($links.first().text(), "Action 2", "First custom action should get rendered.");
		$links.first().mousedown().mouseup().click();
		sap.ui.getCore().applyChanges();

		$links = timeline.$().find("li.sapSuiteUiCommonsTimelineItem").eq(0).find("div.sapSuiteUiCommonsTimelineItemShellBottom").find("a");
		assert.equal($links.size(), 1, "Only one custom action link should be visible.");
		assert.equal($links.first().text(), "Action 1", "First custom action should get rendered.");
		timeline.destroy();
	});

	QUnit.test("TimelineItem renders alone.", function (assert) {
		var item = new TimelineItem({
			title: "Item"
		});
		item.placeAt("content");
		sap.ui.getCore().applyChanges();
		assert.equal(item.$().find("span.sapSuiteUiCommonsTimelineItemShellHdr").text().trim(), "Item", "TimelineItem should render without Timeline.");
		item.destroy();
	});

	QUnit.test("TimelineItem: \\n in text converts to BR.", function (assert) {
		var item = new TimelineItem({
			text: "Line 1\nLine 2\nLine 3"
		});
		item.placeAt("content");
		sap.ui.getCore().applyChanges();
		assert.equal(item.$().find("div.sapSuiteUiCommonsTimelineItemTextWrapper").find("br").size(), 2, "2 BR should be rendered.");
		item.destroy();
	});

	QUnit.test("Timeline with custom style class.", function (assert) {
		var timeline = TestUtils.buildTimelineWithoutBinding([]);
		timeline.addStyleClass("customClass");
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.ok(timeline.$().hasClass("customClass"), "Custom style class wasn't rendered.");
		timeline.destroy();
	});
});
