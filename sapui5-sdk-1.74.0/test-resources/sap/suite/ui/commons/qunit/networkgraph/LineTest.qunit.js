sap.ui.define([
	"./TestUtils",
	"sap/ui/core/Popup",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/networkgraph/ActionButton",
	"sap/suite/ui/commons/networkgraph/Line",
	"sap/suite/ui/commons/networkgraph/Coordinate",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (GraphTestUtils, Popup, createAndAppendDiv, ActionButton, Line, Coordinate) {
	"use strict";

	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%; overflow-y: hidden");

	QUnit.module("Network graph lines");

	QUnit.test("Looper lines are ignored and thus not rendered, neither searched for.", function (assert) {
		var oData = {
				nodes: [
					{key: 0, title: "0", group: "A"},
					{key: 1, title: "1"}
				],
				lines: [
					{from: 0, to: 1, title: "Nice one"},
					{from: 0, to: 0, title: "Loop", description: "Bloody loop"},
					{from: 1, to: 0, title: "Loop", description: "Not a loop really..."},
					{from: 1, to: 1, title: "Loop", description: "Loop again!"}
				],
				groups: [
					{key: "A", title: "Group A"}
				]
			},
			oGraph = GraphTestUtils.buildGraph(oData),
			fnDone = assert.async();

		assert.expect(2);
		oGraph.attachEvent("graphReady", function () {
			GraphTestUtils.assertLinesDomFingerprint(assert, oGraph, "XoXo");

			oGraph._search(oGraph._search(oGraph.getLines()[1]._getLineId()));
			assert.equal(
				GraphTestUtils.getLinesSelectionFingerprint(oGraph),
				"FFFF",
				"Real loops should be excluded from searching.");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	function getDumbbellGraph() {
		return GraphTestUtils.buildGraph(
			{
				nodes: [
					{key: 0},
					{key: 1}
				],
				lines: [
					{from: 0, to: 1}
				]
			});
	}

	QUnit.test("Detail window opens and line is selected when user clicks on it.", function (assert) {
		var openSpy = sinon.spy(Popup.prototype, "open"),
			oGraph = getDumbbellGraph(),
			oLine = oGraph.getLines()[0],
			fnDone = assert.async();

		assert.expect(2);
		oGraph.attachGraphReady(function () {
			GraphTestUtils.clickLine(oLine);
			assert.equal(openSpy.callCount, 1, "Tooltip popup should have been opened.");
			openSpy.restore();
			assert.ok(oLine.getSelected(), "Line should be marked as selected.");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Line events [press] are fired correctly.", function (assert) {
		var oGraph = getDumbbellGraph(),
			fnPressDone = assert.async(),
			fnGraphReadyDone = assert.async();

		assert.expect(1);
		oGraph.attachEvent("graphReady", function () {
			// GraphTestUtils.triggerMouseEvent(oGraph.getLines()[0], "click");
			GraphTestUtils.clickLine(oGraph.getLines()[0]);
			fnGraphReadyDone();
			oGraph.destroy();
		});
		oGraph.getLines()[0].attachEvent("press", function () {
			assert.ok(true, "Press event should fire correctly.");
			oGraph._tooltip.close();
			fnPressDone();
			// oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Line tooltip", function (assert) {
		var oGraph = getDumbbellGraph(),
			fnPressDone = assert.async();

		oGraph.setRenderType("Html");
		oGraph.getLines()[0].addActionButton(new ActionButton({}));

		assert.expect(1);
		oGraph.attachEvent("graphReady", function () {
			GraphTestUtils.clickLine(oGraph.getLines()[0]);
			assert.equal(oGraph.$("divlinebuttons").css("display"), "flex", "Tooltip rendered");
			fnPressDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Line dual arrows", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{key: 0},
					{key: 1}
				],
				lines: [
					{from: 0, to: 1, arrowOrientation: "Both"}
				]
			}),
			fnPressDone = assert.async();

		assert.expect(3);
		oGraph.attachEvent("graphReady", function () {
			fnPressDone();
			assert.equal(oGraph.getLines()[0].$().find(".sapSuiteUiCommonsNetworkLineArrow").length, 2, "Two arrows");
			assert.equal(oGraph.getLines()[0].$("arrow").length, 1, "1st arrows");
			assert.equal(oGraph.getLines()[0].$("arrow1").length, 1, "2st arrows");

			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("isOnScreen", function (assert) {
		var oLine = new Line({
			coordinates: [
				new Coordinate({x: 0, y: 0}),
				new Coordinate({x: 50, y: 0}),
				new Coordinate({x: 50, y: 50}),
				new Coordinate({x: 0, y: 50}),
				new Coordinate({x: 0, y: 0})
			]
		});

		assert.ok(oLine._isOnScreen(0, 100, 0, 100), "Line should be reported on screen when fully on screen.");
		assert.ok(oLine._isOnScreen(-1, 2, 10, 20), "Line should be reported on screen when only a segment of it is on screen.");
		assert.notOk(oLine._isOnScreen(10, 20, 10, 20), "Line shouldn't be reported on screen when going around the screen.");
		assert.notOk(oLine._isOnScreen(1000, 2000, 1000, 2000), "Line should be reported on screen when screen is far away.");
	});
});
