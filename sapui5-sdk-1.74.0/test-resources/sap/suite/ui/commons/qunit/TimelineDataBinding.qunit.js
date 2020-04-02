sap.ui.define([
	"jquery.sap.global",
	"./TimelineTestUtils",
	"sap/suite/ui/commons/TimelineItemRenderer",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function(jQuery, TestUtils, TimelineItemRenderer, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 100%;");

	QUnit.module("TimelineDataBinding");

	var data = [
		{
			dateTime: new Date(2016, 0, 1),
			dateParts: [2016, 0, 1],
			firstName: "First1",
			lastName: "Last1",
			fullName: "First1 Last1",
			title: "Item 1",
			itemNumber: 1,
			text: "Item text 1",
			text1: "word1",
			text2: "word2"
		}, {
			dateTime: new Date(2016, 0, 2),
			dateParts: [2016, 0, 2],
			firstName: "First2",
			lastName: "Last2",
			fullName: "First2 Last2",
			title: "Item 2",
			itemNumber: 2,
			text: "Item text 2",
			text1: "word3",
			text2: "word4"
		}, {
			dateTime: new Date(2016, 0, 3),
			dateParts: [2016, 0, 3],
			firstName: "First3",
			lastName: "Last3",
			fullName: "First3 Last3",
			title: "Item 3",
			itemNumber: 3,
			text: "Item text 3",
			text1: "word5",
			text2: "word6"
		}
	];

	data.forEach(function (item) {
		item.getDateTimeWithoutStringParse = function() {
			return this.dateTime;
		};
	});

	QUnit.test("Simple binding test.", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {sortOldestFirst: true, showIcons: false}, {
			dateTime: "{dateTime}",
			userName: "{fullName}",
			title: "{title}",
			text: "{text}"
		});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		var $items = timeline.$().find(".sapSuiteUiCommonsTimelineItem");
		assert.equal($items.size(), 3, "3 items must be rendered.");
		for (var i = 0; i < 3; i++) {
			var $item = $items.eq(i);
			assert.equal($item.find(".sapSuiteUiCommonsTimelineItemShellUser").text(), data[i].fullName, "User name doesn't match.");
			assert.equal($item.find(".sapSuiteUiCommonsTimelineItemShellHdr").text().trim(), data[i].title, "Title doesn't match.");
			assert.equal($item.find(".sapSuiteUiCommonsTimelineItemTextWrapper").text(), data[i].text, "Item text doesn't match.");
			assert.equal($item.find(
				".sapSuiteUiCommonsTimelineItemShellDateTime").text(),
				TimelineItemRenderer._getFormatedDateTime(data[i]),
				"Date doesn't match."
			);
		}
		timeline.destroy();
	});

	QUnit.test("Binding with parts and formatter.", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {sortOldestFirst: true, showIcons: false}, {
			dateTime: {
				parts: ["dateParts"],
				formatter: function (parts) {
					return new Date(parts[0], parts[1], parts[2]);
				}
			},
			userName: {
				parts: ["firstName", "lastName"]
			},
			title: {
				parts: ["itemNumber"],
				formatter: function (itemNumber) {
					return "Item " + itemNumber;
				}
			},
			text: {
				parts: ["text1", "text2"],
				formatter: function (t1, t2) {
					return t1 + "\n" + t2;
				}
			}
		});
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		var $items = timeline.$().find(".sapSuiteUiCommonsTimelineItem");
		assert.equal($items.size(), 3, "3 items must be rendered.");
		for (var i = 0; i < 3; i++) {
			var $item = $items.eq(i);
			assert.equal($item.find(".sapSuiteUiCommonsTimelineItemShellUser").text(), data[i].fullName, "User name doesn't match.");
			assert.equal($item.find(".sapSuiteUiCommonsTimelineItemShellHdr").text().trim(), data[i].title, "Title doesn't match.");
			assert.equal($item.find(".sapSuiteUiCommonsTimelineItemTextWrapper").text(), data[i].text1 + data[i].text2, "Item text doesn't match.");
			assert.equal($item.find(
				".sapSuiteUiCommonsTimelineItemShellDateTime").text(),
				TimelineItemRenderer._getFormatedDateTime(data[i]),
				"Date doesn't match."
			);
		}
		timeline.destroy();
	});

	QUnit.test("Sorting with complex binding.", function (assert) {
		var timeline = TestUtils.buildTimeline(data, {sortOldestFirst: false, showIcons: false}, {
			dateTime: {
				parts: ["dateParts"],
				formatter: function (parts) {
					return new Date(parts[0], parts[1], parts[2]);
				}
			},
			userName: "{fullName}"
		});
		timeline.setEnableScroll(false);
		timeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		var $items = timeline.$().find(".sapSuiteUiCommonsTimelineItem");
		assert.equal($items.first().find(".sapSuiteUiCommonsTimelineItemShellUser").text(), data[2].fullName, "Last user expected.");

		timeline._sortClick();
		sap.ui.getCore().applyChanges();
		$items = timeline.$().find(".sapSuiteUiCommonsTimelineItem");
		assert.equal($items.first().find(".sapSuiteUiCommonsTimelineItemShellUser").text(), data[0].fullName, "First user expected.");
		timeline.destroy();
	});

	QUnit.test("Search on complex binding.", function (assert) {
		var oTimeline = TestUtils.buildTimeline(data, {sortOldestFirst: true, showIcons: false}, {
			dateTime: "{dateTime}",
			userName: "{fullName}",
			text: {
				parts: ["text1", "text2"],
				formatter: function (t1, t2) {
					return t1 + "\n" + t2;
				}
			}
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oSearchField = oTimeline.getHeaderBar().getContent().filter(function (oItem) {
			return TestUtils.stringEndsWith(oItem.getId(), "-searchField");
		});

		assert.equal(oSearchField.length, 1, "Search field not found.");
		oSearchField = oSearchField[0];
		oSearchField.setValue(data[1].text2);
		oSearchField.fireSearch();
		sap.ui.getCore().applyChanges();
		assert.equal(oTimeline.$().find(".sapSuiteUiCommonsTimelineItem").find(".sapSuiteUiCommonsTimelineItemShellUser").text(),
			data[1].fullName, "Second user expected.");
		oTimeline.destroy();
	});

	QUnit.test("Search with no results.", function (assert) {
		var oTimeline = TestUtils.buildTimeline(data, {sortOldestFirst: true, showIcons: false}, {
			dateTime: "{dateTime}",
			userName: "{fullName}",
			text: "{text}"
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oSearchField = oTimeline.getHeaderBar().getContent().filter(function (oItem) {
			return TestUtils.stringEndsWith(oItem.getId(), "-searchField");
		});

		assert.equal(oSearchField.length, 1, "Search field not found.");
		oSearchField = oSearchField[0];
		oSearchField.setValue("NOT_FOUND");
		oSearchField.fireSearch();
		sap.ui.getCore().applyChanges();
		assert.equal(oTimeline.$().find(".sapSuiteUiCommonsTimelineItem").size(),
			0, "NOT_FOUND text is not found.");
		oTimeline.destroy();
	});

	QUnit.test("Data model change in double sided mode.", function (assert) {
		var myData = JSON.parse(JSON.stringify(data));
		var oTimeline = TestUtils.buildTimeline(myData, {sortOldestFirst: true, enableDoubleSided: true}, {
			dateTime: "{dateTime}",
			userName: "{fullName}",
			title: "{title}",
			text: "{text}"
		});
		var oModel = oTimeline.getModel();
		var newUserName = "newUserName";

		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oModel.setProperty("/Items/0/fullName", newUserName);
		sap.ui.getCore().applyChanges();
		oTimeline.adjustUI();

		var $wrongItems = oTimeline.$().find(".sapSuiteUiCommonsTimelineItem");
		assert.equal($wrongItems.size(), 0, "0 wrong items must be rendered.");

		var $oddItems = oTimeline.$().find(".sapSuiteUiCommonsTimelineItemOdd");
		var $evenItems = oTimeline.$().find(".sapSuiteUiCommonsTimelineItemEven");
		assert.equal($oddItems.size(), 2, "2 odd items must be rendered.");
		assert.equal($evenItems.size(), 1, "1 even items must be rendered.");

		assert.equal($oddItems.eq(0).find(".sapSuiteUiCommonsTimelineItemShellUser").text(), newUserName, "Odd user name matches.");
		assert.equal($evenItems.find(".sapSuiteUiCommonsTimelineItemShellUser").text(), myData[1].fullName, "Even user name matches.");
		assert.equal($oddItems.eq(1).find(".sapSuiteUiCommonsTimelineItemShellUser").text(), myData[2].fullName, "Odd user name matches.");
		oTimeline.destroy();
	});

	QUnit.test("Data model adding timelineitem in double sided mode.", function (assert) {
		var oTimeline = TestUtils.buildTimeline(data, {sortOldestFirst: true, enableDoubleSided: true}, {
			dateTime: "{dateTime}",
			userName: "{fullName}",
			title: "{title}",
			text: "{text}"
		});
		var oModel = oTimeline.getModel();
		oTimeline.placeAt("content");

		var myData = jQuery.extend(true, [], data);
		myData[3] = {
			dateTime: new Date(2015,0,1),
			fullName: "First4 Last4",
			title: "Item 4",
			text: "Item text 4"
		};
		oModel.setData({ Items: myData });

		sap.ui.getCore().applyChanges();

		var $wrongItems = oTimeline.$().find(".sapSuiteUiCommonsTimelineItem");
		assert.equal($wrongItems.size(), 0, "0 wrong items must be rendered.");

		var $oddItems = oTimeline.$().find(".sapSuiteUiCommonsTimelineItemOdd");
		var $evenItems = oTimeline.$().find(".sapSuiteUiCommonsTimelineItemEven");
		assert.equal($oddItems.size(), 2, "2 odd items must be rendered.");
		assert.equal($evenItems.size(), 2, "2 even items must be rendered.");

		assert.equal($oddItems.eq(0).find(".sapSuiteUiCommonsTimelineItemShellUser").text(), myData[3].fullName, "Odd user name matches.");
		assert.equal($evenItems.eq(0).find(".sapSuiteUiCommonsTimelineItemShellUser").text(), myData[0].fullName, "Even user name matches.");
		assert.equal($oddItems.eq(1).find(".sapSuiteUiCommonsTimelineItemShellUser").text(), myData[1].fullName, "Odd user name matches.");
		assert.equal($evenItems.eq(1).find(".sapSuiteUiCommonsTimelineItemShellUser").text(), myData[2].fullName, "Even user name matches.");
		oTimeline.destroy();
	});

	QUnit.test("Data model change on TimelineItem event userNameClicked.", function (assert) {
		var myData = JSON.parse(JSON.stringify(data));
		var newUserName = "newUserName";
		var oTimeline = TestUtils.buildTimeline(myData, {sortOldestFirst: true}, {
			dateTime: "{dateTime}",
			userName: "{fullName}",
			title: "{title}",
			userNameClickable: true,
			userNameClicked: function (oEvent) {
				var oModel = oTimeline.getModel();
				oModel.setProperty("/Items/0/fullName", newUserName);
				sap.ui.getCore().applyChanges();
				assert.equal(oTimeline.$().find(".sapSuiteUiCommonsTimelineItemShellUser").first().text(), newUserName, "User name changed to newUserName");
			},
			text: "{text}"
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		var $item = oTimeline.$().find(".sapSuiteUiCommonsTimelineItem").first();
		$item.find(".sapSuiteUiCommonsTimelineItemShellUser .sapMLnk").mousedown().mouseup().click();
		oTimeline.destroy();
	});

	QUnit.test("Data model change on Timeline grow event.", function (assert) {
		var myData = jQuery.extend(true, [], data);
		myData[3] = {
			dateTime: new Date(2015,0,1),
			fullName: "First4 Last4",
			title: "Item 4",
			text: "Item text 4"
		};
		var oTimeline = TestUtils.buildTimeline(
			data, {
				sortOldestFirst: true,
				enableDoubleSided: true,
				growingThreshold: 2,
				grow: function (oEvent) {
					var oModel = oTimeline.getModel();
					oModel.setData({ Items: myData });
				}
			}, {
				dateTime: "{dateTime}",
				userName: "{fullName}",
				title: "{title}",
				text: "{text}"
			}
		);
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		var $wrongItems = oTimeline.$().find(".sapSuiteUiCommonsTimelineItem");
		assert.equal($wrongItems.size(), 0, "0 wrong items must be rendered.");

		var $oddItems = oTimeline.$().find(".sapSuiteUiCommonsTimelineItemOdd");
		var $evenItems = oTimeline.$().find(".sapSuiteUiCommonsTimelineItemEven");
		assert.equal($oddItems.size(), 1, "1 odd items must be rendered.");
		assert.equal($evenItems.size(), 1, "1 even items must be rendered.");

		assert.equal($oddItems.eq(0).find(".sapSuiteUiCommonsTimelineItemShellUser").text(), myData[0].fullName, "Odd user name matches.");
		assert.equal($evenItems.eq(0).find(".sapSuiteUiCommonsTimelineItemShellUser").text(), myData[1].fullName, "Even user name matches.");

		// click load more button
		oTimeline.$().find(".sapSuiteUiCommonsTimelineShowMoreWrapper .sapMBtn").mousedown().mouseup().click();
		sap.ui.getCore().applyChanges();

		$wrongItems = oTimeline.$().find(".sapSuiteUiCommonsTimelineItem");
		assert.equal($wrongItems.size(), 0, "0 wrong items must be rendered.");

		$oddItems = oTimeline.$().find(".sapSuiteUiCommonsTimelineItemOdd");
		$evenItems = oTimeline.$().find(".sapSuiteUiCommonsTimelineItemEven");
		assert.equal($oddItems.size(), 2, "2 odd items must be rendered.");
		assert.equal($evenItems.size(), 2, "2 even items must be rendered.");

		assert.equal($oddItems.eq(0).find(".sapSuiteUiCommonsTimelineItemShellUser").text(), myData[3].fullName, "Odd user name matches.");
		assert.equal($evenItems.eq(0).find(".sapSuiteUiCommonsTimelineItemShellUser").text(), myData[0].fullName, "Even user name matches.");
		assert.equal($oddItems.eq(1).find(".sapSuiteUiCommonsTimelineItemShellUser").text(), myData[1].fullName, "Odd user name matches.");
		assert.equal($evenItems.eq(1).find(".sapSuiteUiCommonsTimelineItemShellUser").text(), myData[2].fullName, "Even user name matches.");

		oTimeline.destroy();
	});
});
