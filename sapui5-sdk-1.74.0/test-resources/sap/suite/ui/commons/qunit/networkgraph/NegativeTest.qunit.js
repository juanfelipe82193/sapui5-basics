sap.ui.define([
	"./TestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/networkgraph/layout/LayeredLayout",
	"sap/suite/ui/commons/networkgraph/layout/SwimLaneChainLayout"
], function (GraphTestUtils, createAndAppendDiv, LayeredLayout, SwimLaneChainLayout) {
	"use strict";

	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%; overflow-y: hidden");

	QUnit.module("Network graph graceful failing");

	QUnit.test("Line leading to nowhere fails.", function (assert) {
		var oData = {
				nodes: [{key: 0}, {key: 1}],
				lines: [{from: 0, to: 1}, {from: 1, to: 2}]
			};
		assert.expect(1);
		GraphTestUtils.checkGraphDataFiresEvent(assert, oData, "failure");
	});

	QUnit.test("Line leading from nowhere fails.", function (assert) {
		var oData = {
				nodes: [{key: 0}, {key: 1}],
				lines: [{from: 0, to: 1}, {from: 2, to: 1}]
			};
		assert.expect(1);
		GraphTestUtils.checkGraphDataFiresEvent(assert, oData, "failure");
	});

	QUnit.test("Node without proper key fails.", function (assert) {
		var oData = {nodes: [{key: -1}, {}, {key: 1}]};
		assert.expect(1);
		GraphTestUtils.checkGraphDataFiresEvent(assert, oData, "failure");
	});

	QUnit.test("Group without proper key fails.", function (assert) {
		var oData = {nodes: [{key: 0, group: 1}], groups: [{key: -1}, {}, {key: 1}]};
		assert.expect(1);
		GraphTestUtils.checkGraphDataFiresEvent(assert, oData, "failure");
	});

	QUnit.test("Node belonging to nonexistent group fails.", function (assert) {
		var oData = {
			nodes: [{key: 0, group: 0}, {key: 1}, {key: 2, group: 1}],
			lines: [{from: 0, to: 1}, {from: 1, to: 2}],
			groups: [{key: 0}]
		};
		assert.expect(1);
		GraphTestUtils.checkGraphDataFiresEvent(assert, oData, "failure");
	});

	QUnit.test("Nodes with duplicit ids fail.", function (assert) {
		var oData = {
			nodes: [{key: 0, group: 0}, {key: 1}, {key: 0}],
			lines: [{from: 0, to: 1}, {from: 1, to: 0}],
			groups: [{key: 0}]
		};
		assert.expect(1);
		GraphTestUtils.checkGraphDataFiresEvent(assert, oData, "failure");
	});

	QUnit.test("Groups with duplicit ids fail.", function (assert) {
		var oData = {
			nodes: [{key: 0, group: 0}, {key: 1}, {key: 2, group: 1}],
			lines: [{from: 0, to: 1}, {from: 1, to: 2}],
			groups: [{key: 0}, {key: 1}, {key: 0}]
		};
		assert.expect(1);
		GraphTestUtils.checkGraphDataFiresEvent(assert, oData, "failure");
	});

	QUnit.test("Groups without nodes are silently ignored.", function (assert) {
		var oData = {
				nodes: [{key: 0, group: "A"}, {key: 1, group: "A"}],
				groups: [{key: "A"}, {key: "B"}]
			},
			oGraph = GraphTestUtils.buildGraph(oData),
			fnDone = assert.async();

		assert.expect(1);
		oGraph.attachEvent("graphReady", function () {
			assert.ok(
				!oGraph.getGroups()[0]._isEmpty()
				&& oGraph.getGroups()[1]._isEmpty(), "Node-less group should be silently ignored while the one with nodes is not.");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Group with nonexistent parent group fails.", function (assert) {
		var oData = {
			nodes: [{key: 0, group: 0}, {key: 1, group: 2}],
			lines: [{from: 0, to: 1}],
			groups: [{key: 0}, {key: 1, parentGroupKey: 0}, {key: 2, parentGroupKey: 3}]
		};
		assert.expect(1);
		GraphTestUtils.checkGraphDataFiresEvent(assert, oData, "failure");
	});

	var fnSimpleHierarchicalGroupsGraph = function () {
		return GraphTestUtils.buildGraph({
			nodes: [
				{key: 0, group: 0},
				{key: 1, group: 2}
			],
			lines: [
				{from: 0, to: 1}
			],
			groups: [
				{key: 0}, {key: 1}, {key: 2, parentGroupKey: 1}
			]
		});
	};

	QUnit.test("Hierarchical groups are rejected by Layered layout algorithm.", function (assert) {
		var oGraph = fnSimpleHierarchicalGroupsGraph();
		assert.expect(1);
		oGraph.setLayoutAlgorithm(new LayeredLayout());
		GraphTestUtils.checkGraphFiresEvent(assert, oGraph, "failure");
	});

	QUnit.test("Hierarchical groups are rejected by Swim lane layout algorithm.", function (assert) {
		var oGraph = fnSimpleHierarchicalGroupsGraph();
		assert.expect(1);
		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		GraphTestUtils.checkGraphFiresEvent(assert, oGraph, "failure");
	});

	QUnit.test("Duplicit lines should be processed and have different paths.", function (assert) {
		var oData = {
				nodes: [{key: 0}, {key: 1}, {key: 2}],
				lines: [{from: 0, to: 1}, {from: 1, to: 2}, {from: 0, to: 1}, {from: 2, to: 1}, {from: 0, to: 1}]
			},
			oGraph = GraphTestUtils.buildGraph(oData),
			fnDone = assert.async();

		assert.expect(4);
		oGraph.attachEvent("graphReady", function () {
			assert.ok(true, "Duplicit lines are processed.");
			var a1 = JSON.stringify(GraphTestUtils.getLineCoordinatesFingerprint(oGraph.getLines()[0])),
				a2 = JSON.stringify(GraphTestUtils.getLineCoordinatesFingerprint(oGraph.getLines()[2])),
				a3 = JSON.stringify(GraphTestUtils.getLineCoordinatesFingerprint(oGraph.getLines()[4]));
			assert.notEqual(a1, a2, "First and second duplicit line should have different coordinates.");
			assert.notEqual(a2, a3, "Second and third duplicit line should have different coordinates.");
			assert.notEqual(a1, a3, "First and third duplicit line should have different coordinates.");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Graph initialized with completely empty data shouldn't fail and should turns out ready.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({}),
			fnDone = assert.async();

		assert.expect(1);
		oGraph.attachEvent("graphReady", function () {
			assert.ok(true, "Graph should be ready.");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});
});
