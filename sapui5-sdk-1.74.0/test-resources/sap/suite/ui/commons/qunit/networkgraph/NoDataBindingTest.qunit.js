sap.ui.define([
	"./TestUtils",
	"sap/suite/ui/commons/networkgraph/Graph",
	"sap/suite/ui/commons/networkgraph/Node",
	"sap/suite/ui/commons/networkgraph/Group",
	"sap/suite/ui/commons/networkgraph/Line",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (GraphTestUtils, Graph, Node, Group, Line, createAndAppendDiv) {
	"use strict";

	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%; overflow-y: hidden");

	QUnit.module("Network graph without data binding");

	QUnit.test("Graph manipulation via API and without data binding.", function (assert) {
		var oGraph = new Graph(),
			oSelectedNode, oNode, oGroup, oLine,
			mAsyncChain = {
				eventName: "graphReady",
				iterations: [
					{
						// Switch nodes between groups
						action: function () {
							oGraph.getNodeByKey("1").setGroup(null);
						},
						assert: function () {
							assert.equal(oGraph.getGroups()[1]._isVisible(), false, "Group 'B' should not be visible loosing its only node.");
						}
					},
					{
						action: function () {
							oGraph.insertNode(new Node({key: "-1", title: "Sub-zero", group: "B"}), 0);
						},
						assert: function () {
							var sKeys = oGraph.getNodes().reduce(function (acc, val) {
								return acc + val.getKey();
							}, "");
							assert.equal(sKeys, "-101", "Nodes should be in correct order.");
							assert.equal(oGraph.getGroups()[1]._isVisible(), true, "Group 'B' should be visible again getting brand new node.");
						}
					},
					{
						action: function () {
							oLine = oGraph.getLines()[1];
							oGraph.removeLine(oGraph.getLines()[0]);
						},
						assert: function () {
							assert.equal(oGraph.indexOfLine(oLine), 0, "Originally second line should be shifted to the first position.");
							assert.equal(oGraph.getLines().length, 1, "Just one line should remain.");
						}
					},
					{
						action: function () {
							oGraph.getNodes()[1].setGroup("B");
						},
						assert: function () {
							assert.equal(oGraph.getGroups()[0]._isVisible(), false, "Group 'A' should be invisible loosing its only node.");
						}
					},
					{
						action: function () {
							oGraph.removeGroup(oGraph.getGroups()[0]);
						},
						assert: function () {
							assert.equal(oGraph.getGroups().length, 1, "Just one group should remain.");
						}
					}
				]
			},
			fnDone = assert.async();

		assert.expect(10);

		// Initial config: Add two nodes, each inside one group, and connect them with two lines in both directions
		oGroup = new Group().setKey("A").setTitle("Group A");
		oGraph.addGroup(oGroup);
		oGroup = new Group({key: "B", title: "Group B"});
		oGraph.addGroup(oGroup);
		oNode = new Node().setKey("0").setTitle("Zero").setGroup("A");
		oGraph.addNode(oNode);

		assert.equal(oGraph.getGroups()[0].getNodes().length, 1, "Node count should be correct even before invalidation.");

		oNode = new Node({key: "1", title: "One", group: "B"});
		oGraph.addNode(oNode);
		oLine = new Line().setFrom("0").setTo("1");
		oGraph.addLine(oLine);
		oLine = new Line({from: "1", to: "0"});
		oGraph.addLine(oLine);

		oSelectedNode = oGraph.getNodes()[1];
		assert.equal(oSelectedNode.aParentLines, 0, "Parent lines should not be updated before invalidation.");
		assert.equal(oSelectedNode.getParentLines().length, 1, "Calling getParentLines should cause recalculation.");

		GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});
});
