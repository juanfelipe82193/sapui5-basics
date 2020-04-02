sap.ui.define([
	"./TestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/networkgraph/layout/TwoColumnsLayout"
], function (GraphTestUtils, createAndAppendDiv, TwoColumnsLayout) {
	"use strict";

	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%; overflow-y: hidden");

	QUnit.module("Nested groups tests");


	var aData = {
		nodes: [
			{key: 0, title: "0", group: "D"},
			{key: 1, title: "1", group: "E"},
			{key: 3, title: "3", group: "C"}
		],
		groups: [
			{key: "TOPA", title: "TOPA"},
			{key: "TOPB", title: "TOPB"},

			{key: "A", title: "Group A", parentGroupKey: "TOPA"},
			{key: "B", title: "Group B", parentGroupKey: "A"},
			{key: "C", title: "Group C", parentGroupKey: "B"},
			{key: "D", title: "Group D", parentGroupKey: "C"},
			{key: "E", title: "Group E", parentGroupKey: "TOPB"}
		]
	};

	var aData1 = {
		nodes: [
			{key: 0, title: "0", group: "D"},
			{key: 1, title: "1", group: "F"},
			{key: 3, title: "3", group: "C"},
			{key: 4, title: "4", group: "B"},
			{key: 5, title: "5", group: "TOPB"}
		],
		groups: [
			{key: "TOPA", title: "TOPA"},
			{key: "TOPB", title: "TOPB"},

			{key: "A", title: "Group A", parentGroupKey: "TOPA"},
			{key: "B", title: "Group B", parentGroupKey: "A"},
			{key: "C", title: "Group C", parentGroupKey: "B", collapsed: true},
			{key: "D", title: "Group D", parentGroupKey: "C"},
			{key: "F", title: "Group D", parentGroupKey: "A"}
		]
	};

	var aData2 = {
		nodes: [
			{key: 0, title: "0", group: "D"},
			{key: 1, title: "1", group: "F"},
			{key: 3, title: "3", group: "D"},
			{key: 4, title: "4", group: "B"},
			{key: 5, title: "5", group: "TOPB"}
		],
		lines: [
			{from: 1, to: 0},
			{from: 1, to: 3},
			{from: 5, to: 4}
		],
		groups: [
			{key: "TOPA", title: "TOPA"},
			{key: "TOPB", title: "TOPB"},

			{key: "A", title: "Group A", parentGroupKey: "TOPA"},
			{key: "B", title: "Group B", parentGroupKey: "A"},
			{key: "C", title: "Group C", parentGroupKey: "B"},
			{key: "D", title: "Group D", parentGroupKey: "C"},
			{key: "F", title: "Group F", parentGroupKey: "A"}
		]
	};

	var aData3 = {
		nodes: [
			{key: 0, title: "0", group: "D"},
			{key: 1, title: "1", group: "F"},
			{key: 3, title: "3", group: "D"},
			{key: 4, title: "4", group: "B"},
			{key: 5, title: "5", group: "TOPB"}
		],
		lines: [
			{from: 1, to: 0},
			{from: 1, to: 3},
			{from: 5, to: 4}
		],
		groups: [
			{key: "TOPA", title: "TOPA"},
			{key: "TOPB", title: "TOPB"},

			{key: "A", title: "Group A", parentGroupKey: "TOPA"},
			{key: "B", title: "Group B", parentGroupKey: "A"},
			{key: "C", title: "Group C", parentGroupKey: "B", collapsed: true},
			{key: "D", title: "Group D", parentGroupKey: "C"},
			{key: "F", title: "Group F", parentGroupKey: "A"}
		]
	};

	QUnit.test("Basic nested.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(aData),
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new TwoColumnsLayout());

		assert.expect(12);
		oGraph.attachEvent("graphReady", function () {
			// check first and last nodes of groups
			assert.equal(oGraph.mGroups["A"]._oFirstNode.getKey(), oGraph._mNodes["3"].getKey(), "Group A - first node");
			assert.equal(oGraph.mGroups["B"]._oFirstNode.getKey(), oGraph._mNodes["3"].getKey(), "Group B - first node");
			assert.equal(oGraph.mGroups["C"]._oFirstNode.getKey(), oGraph._mNodes["3"].getKey(), "Group C - first node");
			assert.equal(oGraph.mGroups["D"]._oFirstNode.getKey(), oGraph._mNodes["0"].getKey(), "Group D - first node");

			assert.equal(oGraph.mGroups["A"]._oLastNode.getKey(), oGraph._mNodes["0"].getKey(), "Group A - last node");
			assert.equal(oGraph.mGroups["B"]._oLastNode.getKey(), oGraph._mNodes["0"].getKey(), "Group B - last node");
			assert.equal(oGraph.mGroups["C"]._oLastNode.getKey(), oGraph._mNodes["0"].getKey(), "Group C - last node");
			assert.equal(oGraph.mGroups["D"]._oLastNode.getKey(), oGraph._mNodes["0"].getKey(), "Group D - last node");

			assert.equal(oGraph._mNodes["3"]._iEndingGroupCount, 0, "Node 3 - Ending count");
			assert.equal(oGraph._mNodes["0"]._iEndingGroupCount, 4, "Node 0 - Ending count");

			assert.equal(oGraph._mNodes["3"]._iStartingGroupCount, 3, "Node 3 - Starting count");
			assert.equal(oGraph._mNodes["0"]._iStartingGroupCount, 1, "Node 0 - Ending count");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Collapsed nested groups", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(aData1),
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new TwoColumnsLayout());

		assert.expect(16);
		oGraph.attachEvent("graphReady", function () {
			assert.equal(oGraph.mGroups["A"]._oFirstNode.getKey(), oGraph._mNodes["4"].getKey(), "Group A - first node");
			assert.equal(oGraph.mGroups["B"]._oFirstNode.getKey(), oGraph._mNodes["4"].getKey(), "Group B - first node");
			assert.equal(oGraph.mGroups["C"]._oFirstNode.getKey(), oGraph._mNodes["3"].getKey(), "Group C - first node");
			assert.equal(oGraph.mGroups["D"]._oFirstNode, null, "Group D - first node - null");

			assert.equal(oGraph.mGroups["A"]._oLastNode.getKey(), oGraph._mNodes["1"].getKey(), "Group A - last node");
			assert.equal(oGraph.mGroups["B"]._oLastNode.getKey(), oGraph._mNodes["3"].getKey(), "Group B - last node");
			assert.equal(oGraph.mGroups["C"]._oLastNode.getKey(), oGraph._mNodes["3"].getKey(), "Group C - last node");
			assert.equal(oGraph.mGroups["D"]._oLastNode, null, "Group D - last node - null");

			assert.equal(oGraph._mNodes["4"]._iStartingGroupCount, 2, "Node 4 - Starting count");
			assert.equal(oGraph._mNodes["4"]._iEndingGroupCount, 0, "Node 4 - Ending count");

			assert.equal(oGraph._mNodes["1"]._iStartingGroupCount, 1, "Node 1 - Starting count");
			assert.equal(oGraph._mNodes["1"]._iEndingGroupCount, 2, "Node 1 - Ending count");

			assert.equal(oGraph._mNodes["1"]._iStartingGroupCount, 1, "Node 1 - Starting count");
			assert.equal(oGraph._mNodes["1"]._iEndingGroupCount, 2, "Node 1 - Ending count");

			assert.equal(oGraph._mNodes["0"]._iStartingGroupCount, 0, "Node 0 - Starting count");
			assert.equal(oGraph._mNodes["0"]._iEndingGroupCount, 0, "Node 0 - Ending count");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Collapse expand", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(aData2),
			fnDone = assert.async(),
			oLayouter = new TwoColumnsLayout();

		oLayouter._validateLines = jQuery.noop;
		oGraph.setLayoutAlgorithm(oLayouter);

		assert.expect(10);
		oGraph.attachEvent("graphReady", function () {

			oGraph._mNodes["1"].setCollapsed(true);

			assert.equal(oGraph.mGroups["C"]._bIsHidden, true, "Group C is hidden");
			assert.equal(oGraph.mGroups["D"]._bIsHidden, true, "Group D is hidden too");
			assert.equal(oGraph.mGroups["A"]._bIsHidden, false, "Group A is visible");
			assert.equal(oGraph.mGroups["B"]._bIsHidden, false, "Group B is visible");

			oGraph._mNodes["1"].setCollapsed(false);

			assert.equal(oGraph.mGroups["C"]._bIsHidden, false, "Group C is visible");
			assert.equal(oGraph.mGroups["D"]._bIsHidden, false, "Group D is visible too");

			oGraph._mNodes["5"].setCollapsed(true);

			assert.equal(oGraph.mGroups["C"]._bIsHidden, false, "Group C is visible");
			assert.equal(oGraph.mGroups["D"]._bIsHidden, false, "Group D is visible");
			assert.equal(oGraph.mGroups["A"]._bIsHidden, false, "Group A is visible");
			assert.equal(oGraph.mGroups["B"]._bIsHidden, false, "Group B is visible");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Collapse expand from start", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(aData3),
			fnDone = assert.async(),
			oLayouter = new TwoColumnsLayout();

		oLayouter._validateLines = jQuery.noop;
		oGraph.setLayoutAlgorithm(oLayouter);

		assert.expect(6);
		oGraph.attachEvent("graphReady", function () {
			assert.equal(oGraph._mNodes["0"]._isInCollapsedGroup(), true, "Node is in collapsed group");
			assert.equal(oGraph._mNodes["3"]._isInCollapsedGroup(), true, "Node is in collapsed group");

			oGraph._mNodes["1"].setCollapsed(true);

			assert.equal(oGraph.mGroups["C"]._bIsHidden, true, "Group C is hidden");
			assert.equal(oGraph.mGroups["D"]._bIsHidden, true, "Group D is hidden too");
			assert.equal(oGraph.mGroups["A"]._bIsHidden, false, "Group A is visible");
			assert.equal(oGraph.mGroups["B"]._bIsHidden, false, "Group B is visible");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Width of two columns", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(aData),
			fnDone = assert.async(),
			oLayouter = new TwoColumnsLayout();

		oGraph.setLayoutAlgorithm(oLayouter);

		assert.expect(2);
		oGraph.attachEvent("graphReady", function () {

			assert.equal(oGraph._$innerscroller.width(), oGraph.$divnodes.width(), "width are the same");
			assert.equal(oGraph._$innerscroller.width(), oGraph.$divgroups.width(), "width are the same");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});
});
