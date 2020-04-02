sap.ui.define([
	"sap/suite/ui/commons/TimelineItem",
	"sap/suite/ui/commons/Timeline",
	"sap/ui/core/Control",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (TimelineItem, Timeline, Control, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 100%;");

	QUnit.module("TimelineItemTest");
	QUnit.test("getDateTime test", function (assert) {
		var oMockItem = {
				dateTime: new Date(),
				getProperty: function (sPropName) {
					if (sPropName !== "dateTime") {
						throw new Error("Cannot return property: " + sPropName);
					}
					return this.dateTime;
				}
			},
			fnGetDateTime = (new TimelineItem()).getDateTime.bind(oMockItem),
			iDateNumber = 1475154256914;
		assert.equal(fnGetDateTime(), oMockItem.dateTime, "Date type should be returned right away.");
		oMockItem.dateTime = iDateNumber;
		assert.equal(fnGetDateTime().valueOf(), iDateNumber, "Number date should be converted to date.");
		oMockItem.dateTime = "Date(" + iDateNumber + ")";
		assert.equal(typeof fnGetDateTime(), "object", "String date should be parsed to date.");
		assert.equal(fnGetDateTime().valueOf(), iDateNumber, "String date should be parsed to date.");

		oMockItem.dateTime = "incorrect 12345566";
		assert.equal(fnGetDateTime(), oMockItem.dateTime, "Mall formatted string should be returned as is.");
	});

	QUnit.test("Short text renders all.", function (assert) {
		var sText = Array(500).join("a");
		var oItem = new TimelineItem({
			text: sText
		});
		oItem.placeAt("content");
		sap.ui.getCore().applyChanges();

		var renderedStr = oItem.$("realtext").text();
		assert.equal(renderedStr, sText, "Short text should render completely.");
		oItem.destroy();
	});

	QUnit.test("Long text renders partially.", function (assert) {
		var sText = Array(1000).join("a"),
			oItem = new TimelineItem({
				text: sText
			}),
			sRenderedStr,
			fnDone,
			$button;
		oItem._orientation = "H";
		oItem.placeAt("content");
		sap.ui.getCore().applyChanges();

		sRenderedStr = oItem.$("realtext").text();
		assert.ok(sRenderedStr.length < sText.length, "Long text should be rendered partially.");
		assert.equal(sRenderedStr, sText.substr(0, sRenderedStr.length), "Rendered text should be a substring of the original text.");
		$button = oItem.$("fullTextBtn");
		assert.equal($button.size(), 1, "Show more button should be rendered.");

		$button.mousedown().mouseup().click();
		sap.ui.getCore().applyChanges();
		fnDone = assert.async();
		oItem._objects.getFullTextPopover().attachAfterOpen(function (oEvent) {
			var sRenderedStr = oEvent.getSource().getContent().map(function (content) {
				return content.$().text();
			}).join("");
			assert.equal(sRenderedStr, sText, "Popover text should have full text.");
			oEvent.getSource().close();
			oItem.destroy();
			fnDone();
		});
	});

	QUnit.test("Reply link.", function (assert) {
		var oTimeline = new Timeline({enableSocial: true}),
			oItem = new TimelineItem({replyCount: 3});
		oTimeline.addContent(oItem);
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(oItem.$("replyLink").text(), "Reply (3)", "Reply cound should be set.");
		oTimeline.destroy();
	});

	QUnit.test("Post reply.", function (assert) {
		var fnDone = assert.async(),
			sExpectedMessage = "Testing message",
			oTimeline = new Timeline({enableSocial: true}),
			oItem = new TimelineItem({
				replyPost: replyPost
			});

		function replyPost(oEvent) {
			assert.equal(oEvent.getParameter("value"), sExpectedMessage, "Generated message differs from input.");
			setTimeout(function () {
				oTimeline.destroy();
				fnDone();
			}, 0);
		}

		oTimeline.addContent(oItem);
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oItem.$("replyLink").mousedown().mouseup().click();
		oItem._objects.getReplyPop().attachAfterOpen(function (oEvent) {
			var oInputArea = oItem._objects.getReplyInputArea();
			oInputArea.setValue(sExpectedMessage);

			setTimeout(function () {
				oItem.$("replyButton").mousedown().mouseup().click();
			}, 0);
		});
	});

	QUnit.test("User name click event works.", function (assert) {
		var fnDone = assert.async(),
			sUserName = "User Name",
			oItem = new TimelineItem({
				userNameClickable: true,
				userName: sUserName,
				userNameClicked: userNameClicked
			});

		function userNameClicked(oevent) {
			assert.ok(true, "User name clicked event raised.");
			assert.ok(oevent.getParameter("uiElement") instanceof Control, "Returned uiElement is Control.");
			oItem.destroy();
			fnDone();
		}

		oItem.placeAt("content");
		sap.ui.getCore().applyChanges();

		oItem.$("userNameLink").mousedown().mouseup().click();
	});

	QUnit.test("Test default properties related to icon", function (assert) {
		var oItem = new TimelineItem();
		var oIcon = oItem._getLineIcon();

		assert.equal(oIcon.getTooltip(), null);
		assert.ok(oIcon.getUseIconTooltip());
	});

	QUnit.test("Properties are passed to icon", function (assert) {
		var sExpectedIconId = "icon-01";
		var sExpectedTooltip = "Cool Tooltip 1";
		var oItem = new TimelineItem({
			icon: sExpectedIconId,
			iconTooltip: sExpectedTooltip,
			useIconTooltip: false
		});

		var oIcon = oItem._getLineIcon();

		assert.equal(oIcon.getSrc(), sExpectedIconId);
		assert.equal(oIcon.getTooltip(), sExpectedTooltip);
		assert.notOk(oIcon.getUseIconTooltip());
	});

});
