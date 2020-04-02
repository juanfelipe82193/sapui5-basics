sap.ui.define([
	"../TestUtils",
	"sap/suite/ui/commons/networkgraph/util/Dijkstra",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (GraphTestUtils, Dijkstra, createAndAppendDiv) {
	"use strict";

	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%; overflow-y: hidden");

	QUnit.module("Dijkstra's algorithm tests");

	QUnit.test("Graph with no lines", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{key: 0},
				{key: 1}
				]
		}),
			oDijstra = new Dijkstra(oGraph, oGraph.getNodeByKey("0")),
			aPath = oDijstra.getShortestPathTo(oGraph.getNodeByKey("1"));

		assert.equal(aPath.length, 0, "A path shouldn't exist.");
		oGraph.destroy();
	});

	QUnit.test("Graph with one line", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0},
					{key: 1}
				],
				lines: [
					{
						from: 0,
						to: 1
					}
				]
			}),
			oDijstra = new Dijkstra(oGraph, oGraph.getNodeByKey("0")),
			aPath = oDijstra.getShortestPathTo(oGraph.getNodeByKey("1"));

		assert.equal(aPath.length, 1, "A path should exist.");
		assert.equal(aPath[0].getFrom(), "0", "The line should start at 0.");
		assert.equal(aPath[0].getTo(), "1", "The line should end at 1.");
		oGraph.destroy();
	});

	var GRAPH_DATE = {
		nodes: [
			{key: 0},
			{key: 1},
			{key: 2},
			{key: 3},
			{key: 4},
			{key: 5},
			{key: 6},
			{key: 7},
			{key: 8}
		],
		lines: [
			{
				from: 0,
				to: 1
			},
			{
				from: 1,
				to: 2
			},
			{
				from: 2,
				to: 3
			},
			{
				from: 4,
				to: 3
			},
			{
				from: 0,
				to: 5
			},
			{
				from: 5,
				to: 6
			},
			{
				from: 6,
				to: 7
			},
			{
				from: 7,
				to: 3
			}
		]
	};

	function getLineId(oLine) {
		return oLine.getFrom() + "-" + oLine.getTo();
	}

	function checkPath(assert, aExpected, aPath) {
		assert.equal(aExpected.length, aPath.length, "The found path should have correct length.");
		if (aExpected.length !== aPath.length) {
			return;
		}
		for (var i = 0; i < aExpected.length; i++) {
			var sLineId = getLineId(aPath[i]);
			assert.equal(aExpected[i], sLineId, "The path should go through correct path.");
		}
	}

	QUnit.test("Graph with two paths", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(GRAPH_DATE),
			oDijkstra = new Dijkstra(oGraph, oGraph.getNodeByKey("0")),
			aExpectedPath = ["0-1", "1-2", "2-3"],
			aPath = oDijkstra.getShortestPathTo(oGraph.getNodeByKey("3"));

		aPath.reverse();
		checkPath(assert, aExpectedPath, aPath);
		oGraph.destroy();
	});

	QUnit.test("Reversed path not found", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(GRAPH_DATE),
			oDijkstra = new Dijkstra(oGraph, oGraph.getNodeByKey("3")),
			aExpectedPath = [],
			aPath = oDijkstra.getShortestPathTo(oGraph.getNodeByKey("0"));

		checkPath(assert, aExpectedPath, aPath);
		oGraph.destroy();
	});

	QUnit.test("A path to a reversed node", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(GRAPH_DATE),
			oDijkstra = new Dijkstra(oGraph, oGraph.getNodeByKey("0")),
			aExpectedPath = [],
			aPath = oDijkstra.getShortestPathTo(oGraph.getNodeByKey("4"));

		checkPath(assert, aExpectedPath, aPath);
		oGraph.destroy();
	});

	QUnit.test("getShortestPathTo can be called multiple times", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(GRAPH_DATE),
			oDijkstra = new Dijkstra(oGraph, oGraph.getNodeByKey("0")),
			aExpectedPath = ["0-1", "1-2"],
			aPath = oDijkstra.getShortestPathTo(oGraph.getNodeByKey("2"));

		aPath.reverse();
		checkPath(assert, aExpectedPath, aPath);
		aPath = oDijkstra.getShortestPathTo(oGraph.getNodeByKey("6"));
		aPath.reverse();
		aExpectedPath = ["0-5", "5-6"];
		checkPath(assert, aExpectedPath, aPath);
		oGraph.destroy();
	});

	QUnit.test("Line value considered", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(GRAPH_DATE),
			mLineValues = {
				"0-1": 2,
				"1-2": 2,
				"2-3": 2,
				"4-3": 1,
				"0-5": 1,
				"5-6": 1,
				"6-7": 1,
				"7-3": 1
			},
			fnLineValue = function (oLine) {
				return mLineValues[getLineId(oLine)];
			},
			oDijkstra = new Dijkstra(oGraph, oGraph.getNodeByKey("0"), {fnLineValue: fnLineValue}),
			aExpectedPath = ["0-5", "5-6", "6-7", "7-3"],
			aPath = oDijkstra.getShortestPathTo(oGraph.getNodeByKey("3"));

		aPath.reverse();
		checkPath(assert, aExpectedPath, aPath);
		oGraph.destroy();
	});

	QUnit.test("Reversed path found for bIgnoreDirections", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(GRAPH_DATE),
			oDijkstra = new Dijkstra(oGraph, oGraph.getNodeByKey("3"), {bIgnoreDirections: true}),
			aExpectedPath = ["2-3", "1-2", "0-1"],
			aPath = oDijkstra.getShortestPathTo(oGraph.getNodeByKey("0"));

		aPath.reverse();
		checkPath(assert, aExpectedPath, aPath);
		oGraph.destroy();
	});

	QUnit.test("Path to none accessible node is not found", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(GRAPH_DATE),
			oDijkstra = new Dijkstra(oGraph, oGraph.getNodeByKey("0"), {bIgnoreDirections: true}),
			aExpectedPath = [],
			aPath = oDijkstra.getShortestPathTo(oGraph.getNodeByKey("8"));

		checkPath(assert, aExpectedPath, aPath);
		oGraph.destroy();
	});

	QUnit.test("Invisible nodes are ignored", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(GRAPH_DATE);
		oGraph.getNodeByKey("1").setVisible(false);
		oGraph.getNodeByKey("5").setVisible(false);
		var oDijkstra = new Dijkstra(oGraph, oGraph.getNodeByKey("0"), {bIgnoreCollapsed: true}),
			aExpectedPath = [],
			aPath = oDijkstra.getShortestPathTo(oGraph.getNodeByKey("3"));

		checkPath(assert, aExpectedPath, aPath);
		oGraph.destroy();
	});

	QUnit.test("Nodes in collapsed group are ignored", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{key: 0},
				{key: 1, group: 0},
				{key: 2}
			],
			lines: [
				{from: 0, to: 1},
				{from: 1, to: 2}
			],
			groups: [
				{key: 0}
			]
		}),
			fnDone = assert.async();
		oGraph.getGroups()[0].setCollapsed(true);
		oGraph.attachGraphReady(function () {
			var oDijkstra = new Dijkstra(oGraph, oGraph.getNodeByKey("0"), {bIgnoreCollapsed: true}),
				aExpectedPath = [],
				aPath = oDijkstra.getShortestPathTo(oGraph.getNodeByKey("2"));

			checkPath(assert, aExpectedPath, aPath);
			fnDone();
			oGraph.destroy();
		});
		oGraph.placeAt("content");
	});

	QUnit.test("Nodes in collapsed group are used when bIgnoreCollapsed = false", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0},
					{key: 1, group: 0},
					{key: 2}
				],
				lines: [
					{from: 0, to: 1},
					{from: 1, to: 2}
				],
				groups: [
					{key: 0}
				]
			}),
			fnDone = assert.async();
		oGraph.getGroups()[0].setCollapsed(true);
		oGraph.attachGraphReady(function () {
			var oDijkstra = new Dijkstra(oGraph, oGraph.getNodeByKey("0"), {bIgnoreCollapsed: false}),
				aExpectedPath = ["0-1", "1-2"],
				aPath = oDijkstra.getShortestPathTo(oGraph.getNodeByKey("2"));

			aPath.reverse();
			checkPath(assert, aExpectedPath, aPath);
			fnDone();
			oGraph.destroy();
		});
		oGraph.placeAt("content");
	});
});
