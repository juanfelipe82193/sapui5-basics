sap.ui.define([
	"./TestUtils",
	"sap/suite/ui/commons/networkgraph/ElementStatus",
	"sap/suite/ui/commons/networkgraph/NodeShape",
	"sap/suite/ui/commons/networkgraph/LineType",
	"sap/suite/ui/commons/networkgraph/LineArrowPosition",
	"sap/suite/ui/commons/networkgraph/LineArrowOrientation",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (GraphTestUtils, Status, NodeShape, LineType, LineArrowPosition, LineArrowOrientation, createAndAppendDiv) {
	"use strict";

	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%; overflow-y: hidden");

	QUnit.module("Network graph data binding");

	var fnGetBasicGraph = function () {
		return GraphTestUtils.buildGraph({
			nodes: [
				{key: 0, title: "Zero", group: "A"},
				{key: 1, title: "One", group: "B"},
				{key: 2, title: "Two"}
			],
			lines: [
				{from: 0, to: 1},
				{from: 1, to: 0}
			],
			groups: [
				{key: "A", title: "Group A"},
				{key: "B", title: "Group B"}
			]
		});
	};

	QUnit.test("Node data binding without re-layouting.", function (assert) {
		var oGraph = fnGetBasicGraph(),
			fnDone = assert.async(),
			oModel = oGraph.getModel();

		assert.expect(11);
		oGraph.attachEvent("graphReady", function () {
			// Icon
			oModel.setProperty("/nodes/0/icon", "sap-icon://flag");
			assert.equal(oGraph.getNodes()[0].getIcon(), "sap-icon://flag", "Node 0 should have 'Flag' icon.");
			// Title
			oModel.setProperty("/nodes/0/title", "New one");
			assert.equal(oGraph.getNodes()[0].getTitle(), "New one", "Node 0 should have title 'New one'.");
			// Description
			oModel.setProperty("/nodes/0/description", "New description");
			assert.equal(oGraph.getNodes()[0].getDescription(), "New description", "Node 0 should have title 'New description'.");
			// Collapsed
			oModel.setProperty("/nodes/0/collapsed", true);
			assert.equal(oGraph.getNodes()[0].getCollapsed(), true, "Node 0 should be collapsed.");
			oModel.setProperty("/nodes/0/collapsed", false);
			assert.equal(oGraph.getNodes()[0].getCollapsed(), false, "Node 0 should be expanded.");
			// Selected
			oModel.setProperty("/nodes/0/selected", true);
			assert.equal(oGraph.getNodes()[0].getSelected(), true, "Node 0 should be selected.");
			oModel.setProperty("/nodes/0/selected", false);
			assert.equal(oGraph.getNodes()[0].getSelected(), false, "Node 0 should not be selected.");
			// Status
			oModel.setProperty("/nodes/0/status", Status.Success);
			assert.equal(oGraph.getNodes()[0].getStatus(), Status.Success, "Node 0 should have status 'Success'.");
			// ShowExpandButton
			oModel.setProperty("/nodes/0/showExpandButton", false);
			assert.equal(oGraph.getNodes()[0].getShowExpandButton(), false, "Node 0 should be set to show expand button.");
			// ShowActionLinksButton
			oModel.setProperty("/nodes/0/showActionLinksButton", false);
			assert.equal(oGraph.getNodes()[0].getShowActionLinksButton(), false, "Node 0 should be set to show action links button.");
			// ShowDetailButton
			oModel.setProperty("/nodes/0/showDetailButton", false);
			assert.equal(oGraph.getNodes()[0].getShowDetailButton(), false, "Node 0 should be set to show detail button.");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Node data binding with re-layouting.", function (assert) {
		var oGraph = fnGetBasicGraph(),
			fnDone = assert.async(),
			oModel = oGraph.getModel(),
			mAsyncChain = {
				eventName: "graphReady",
				iterations: [
					// Group
					{
						action: function () {
							oModel.setProperty("/nodes/0/group", "B");
						},
						assert: function () {
							assert.equal(oGraph.getNodes()[0].getGroup(), "B", "Node 0 should be in group 'B'.");
							assert.equal(oGraph.getGroups()[0]._isVisible(), false, "Group 'A' should be invisible.");
						}
					},
					{
						action: function () {
							oModel.setProperty("/nodes/1/group", "A");
						},
						assert: function () {
							assert.equal(oGraph.getNodes()[1].getGroup(), "A", "Node 1 should be in group 'A'.");
							assert.equal(oGraph.getGroups()[0]._isVisible(), true, "Group 'A' should be visible.");
						}
					},
					// Shape
					{
						action: function () {
							oModel.setProperty("/nodes/0/shape", NodeShape.Box);
						},
						assert: function () {
							assert.equal(oGraph.getNodes()[0].getShape(), NodeShape.Box, "Node 0 should have 'Box' shape.");
						}
					},
					// Width
					{
						action: function () {
							oModel.setProperty("/nodes/0/width", 333);
						},
						assert: function () {
							assert.equal(oGraph.getNodes()[0].getWidth(), 333, "Node 0 should have width 333.");
						}
					},
					// Max width
					{
						action: function () {
							oModel.setProperty("/nodes/0/maxWidth", 666);
						},
						assert: function () {
							assert.equal(oGraph.getNodes()[0].getMaxWidth(), 666, "Node 0 should have max width 666.");
						}
					},
					// Title line size
					{
						action: function () {
							oModel.setProperty("/nodes/0/titleLineSize", 5);
						},
						assert: function () {
							assert.equal(oGraph.getNodes()[0].getTitleLineSize(), 5, "Node 0 should have title line size 5.");
						}
					}
				]
			};

		assert.expect(8);
		GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});

	QUnit.test("Line data binding without re-layouting.", function (assert) {
		var oGraph = fnGetBasicGraph(),
			fnDone = assert.async(),
			oModel = oGraph.getModel();

		assert.expect(7);
		oGraph.attachEvent("graphReady", function () {
			// Title
			oModel.setProperty("/lines/0/title", "New one");
			assert.equal(oGraph.getLines()[0].getTitle(), "New one", "Line '0->1' should have title 'New one'.");
			// Description
			oModel.setProperty("/lines/0/description", "New description");
			assert.equal(oGraph.getLines()[0].getDescription(), "New description", "Line '0->1' should have title 'New description'.");
			// Selected
			oModel.setProperty("/lines/0/selected", true);
			assert.equal(oGraph.getLines()[0].getSelected(), true, "Line '0->1' should be selected.");
			// Status
			oModel.setProperty("/lines/0/status", Status.Warning);
			assert.equal(oGraph.getLines()[0].getStatus(), Status.Warning, "Line '0->1' should have status 'Warning'.");
			// Line type
			oModel.setProperty("/lines/0/lineType", LineType.Dashed);
			assert.equal(oGraph.getLines()[0].getLineType(), LineType.Dashed, "Line '0->1' should have type 'Dashed'.");
			// Arrow position
			oModel.setProperty("/lines/0/arrowPosition", LineArrowPosition.Middle);
			assert.equal(oGraph.getLines()[0].getArrowPosition(), LineArrowPosition.Middle, "Line '0->1' should have arrow position 'Middle'.");
			// Arrow orientation
			oModel.setProperty("/lines/0/arrowOrientation", LineArrowOrientation.None);
			assert.equal(oGraph.getLines()[0].getArrowOrientation(), LineArrowOrientation.None, "Line '0->1' should have arrow orientation 'None'.");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Line data binding with re-layouting.", function (assert) {
		var oGraph = fnGetBasicGraph(),
			fnDone = assert.async(),
			oModel = oGraph.getModel(),
			mAsyncChain = {
				eventName: "graphReady",
				iterations: [
					// To
					{
						action: function () {
							oModel.setProperty("/lines/1/to", "2");
						},
						assert: function () {
							assert.equal(oGraph.getLines()[1].getTo(), "2", "Line '1->0' should now be '1->2'.");
						}
					},
					// From
					{
						action: function () {
							oModel.setProperty("/lines/1/from", "0");
						},
						assert: function () {
							assert.equal(oGraph.getLines()[1].getFrom(), "0", "Line '1->2' should now be '0->2'.");
						}
					}
				]
			};

		assert.expect(2);
		GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});

	QUnit.test("Group data binding without re-layouting.", function (assert) {
		var oGraph = fnGetBasicGraph(),
			fnDone = assert.async(),
			oModel = oGraph.getModel();

		assert.expect(2);
		oGraph.attachEvent("graphReady", function () {
			// Title
			oModel.setProperty("/groups/0/title", "New one");
			assert.equal(oGraph.getGroups()[0].getTitle(), "New one", "Group 'A' should have title 'New one'.");
			// Description
			oModel.setProperty("/groups/0/description", "New description");
			assert.equal(oGraph.getGroups()[0].getDescription(), "New description", "Group 'A' should have title 'New description'.");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Group data binding with re-layouting.", function (assert) {
		var oGraph = fnGetBasicGraph(),
			fnDone = assert.async(),
			oModel = oGraph.getModel(),
			mAsyncChain = {
				eventName: "graphReady",
				iterations: [
					// Collapsed
					{
						action: function () {
							oModel.setProperty("/groups/0/collapsed", true);
						},
						assert: function () {
							assert.equal(oGraph.getGroups()[0].getCollapsed(), true, "Group 'A' should be collapsed.");
						}
					}
				]
			};

		assert.expect(1);
		GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});
});
