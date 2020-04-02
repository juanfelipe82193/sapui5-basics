sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"./TimelineTestUtils",
	"sap/ui/events/KeyCodes",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/model/json/JSONModel"
], function ($, TestUtils, KeyCodes, createAndAppendDiv, JSONModel) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 100%;");

	QUnit.module("TimelineTest");

	var aData = [
		{
			dateTime: new Date(2016, 0, 1),
			title: "Item 1"
		}, {
			dateTime: new Date(2016, 0, 2),
			title: "Item 2"
		}, {
			dateTime: new Date(2016, 0, 3),
			title: "Item 3"
		}
	];

	var aData2 = [
		{
			dateTime: new Date(2016, 0, 1),
			title: "Item 1"
		}, {
			dateTime: new Date(2016, 0, 2),
			title: "Item 2"
		}, {
			dateTime: new Date(2016, 0, 3),
			title: "Item 3"
		}, {
			dateTime: new Date(2016, 0, 3),
			title: "Item 4"
		}, {
			dateTime: new Date(2016, 0, 3),
			title: "Item 5"
		}
	];


	QUnit.test("Select fired by click", function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData);

		oTimeline.attachSelect(function (oEvent) {
			assert.ok(oEvent.getParameter("userAction"), "Click should fire select with userAction = true");
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.getContent()[0].$("outline").mousedown().mouseup().click();

		oTimeline.destroy();
	});

	QUnit.test("Enter key fires select", function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData);

		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oItem = oTimeline.getContent()[0];
		oItem.$("outline").mousedown().mouseup().click();
		oTimeline.attachSelect(function (oEvent) {
			assert.ok(oEvent.getParameter("userAction"), "Enter should fire select with userAction = true");
		});
		var oEvent = $.Event("keypress");
		oEvent.which = KeyCodes.ENTER;
		oEvent.target = oItem.getDomRef("outline");
		oTimeline.oItemNavigation.onsapenter(oEvent);

		oTimeline.destroy();
	});

	QUnit.test("Arrow key fires select without userAction", function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData);

		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oItem = oTimeline.getContent()[0];
		oItem.$("outline").mousedown().mouseup().click();
		oTimeline.attachSelect(function (oEvent) {
			assert.ok(!oEvent.getParameter("userAction"), "Enter should fire select with userAction = true");
		});
		var oEvent = $.Event("keypress");
		oEvent.which = KeyCodes.ARROW_DOWN;
		oEvent.target = oItem.getDomRef("outline");
		oTimeline.oItemNavigation.onsapnext(oEvent);

		oTimeline.destroy();
	});

	QUnit.test("BindingChange", function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData2);
		oTimeline.setEnableScroll(false);
		oTimeline.setGrowing(true);
		oTimeline.setGrowingThreshold(2);

		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline._loadMore();
		sap.ui.getCore().applyChanges();

		// check load
		assert.equal(oTimeline.getContent().length, 4, "Items count");
		assert.equal(oTimeline._iItemCount, 4, "Items count");

		var oModel = new JSONModel({
			Items: aData
		});
		oTimeline.setModel(oModel);

		sap.ui.getCore().applyChanges();

		assert.equal(oTimeline._iItemCount, 2, "Items count");

		oTimeline.destroy();
	});
});
