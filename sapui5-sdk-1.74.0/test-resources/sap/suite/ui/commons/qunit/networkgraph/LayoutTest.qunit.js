sap.ui.define([
	"./TestUtils",
	"sap/suite/ui/commons/networkgraph/Orientation",
	"./TestLayout",
	"sap/suite/ui/commons/networkgraph/layout/ForceBasedLayout",
	"sap/suite/ui/commons/networkgraph/layout/ForceDirectedLayout",
	"sap/suite/ui/commons/networkgraph/layout/SwimLaneChainLayout",
	"sap/suite/ui/commons/networkgraph/layout/TwoColumnsLayout",
	"sap/suite/ui/commons/networkgraph/layout/KlayWrapper",
	"sap/suite/ui/commons/networkgraph/layout/D3ForceWrapper",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (GraphTestUtils, Orientation, TestLayout, ForceBasedLayout, ForceDirectedLayout, SwimLaneChainLayout, TwoColumnsLayout,
			 KlayWrapper, D3Wrapper, createAndAppendDiv) {
	"use strict";

	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%; overflow-y: hidden");

	QUnit.module("Network graph layouting");

	QUnit.test("Layout failure is fired by graph when layout fails.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({nodes: [{key: 0}]});

		assert.expect(1);
		oGraph.setLayoutAlgorithm(new TestLayout(function (fnResolve, fnReject) {
			fnReject("Just because...");
		}));

		GraphTestUtils.checkGraphFiresEvent(assert, oGraph, "failure");
		sap.ui.getCore().applyChanges();
	});

	// default value changed from undefined -> 0
	QUnit.skip("Coordinates of nodes are tested after layouting is done.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({nodes: [{key: 0}]});

		assert.expect(1);
		oGraph.setLayoutAlgorithm(new TestLayout(function (fnResolve) {
			oGraph.getNodes()[0].setX(undefined);
			oGraph.getNodes()[0].setY(undefined);
			fnResolve();
		}));

		GraphTestUtils.checkGraphFiresEvent(assert, oGraph, "failure");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Coordinates of groups are tested after layouting is done.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [{key: 0, group: "A"}],
			groups: [{key: "A"}]
		});

		assert.expect(1);
		oGraph.setLayoutAlgorithm(new TestLayout(function (fnResolve) {
			oGraph.getNodes()[0].setX(0);
			oGraph.getNodes()[0].setY(1);
			oGraph.getGroups()[0].setX(undefined);
			oGraph.getGroups()[0].setY(undefined);
			fnResolve();
		}, true));

		GraphTestUtils.checkGraphFiresEvent(assert, oGraph, "failure");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Coordinates of line sources are tested after layouting is done.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [{key: 0}, {key: 1}],
			lines: [{from: 0, to: 1}, {from: 1, to: 0}]
		});

		assert.expect(1);
		oGraph.setLayoutAlgorithm(new TestLayout(function (fnResolve) {
			var oNode0 = oGraph.getNodes()[0],
				oNode1 = oGraph.getNodes()[1],
				oLine0 = oGraph.getLines()[0],
				oLine1 = oGraph.getLines()[1];

			oNode0.setX(0);
			oNode0.setY(0);
			oNode1.setX(1);
			oNode1.setY(1);

			oLine0.setSource({
				x: 0,
				y: 0
			});
			oLine0.setTarget({
				x: 1,
				y: 1
			});

			oLine1.setSource({
				x: 0,
				y: undefined
			});
			oLine1.setTarget({
				x: 1,
				y: 1
			});

			fnResolve();
		}));

		GraphTestUtils.checkGraphFiresEvent(assert, oGraph, "failure");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Coordinates of line targets are tested after layouting is done.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [{key: 0}, {key: 1}],
			lines: [{from: 0, to: 1}, {from: 1, to: 0}]
		});

		assert.expect(1);
		oGraph.setLayoutAlgorithm(new TestLayout(function (fnResolve) {
			var oNode0 = oGraph.getNodes()[0],
				oNode1 = oGraph.getNodes()[1],
				oLine0 = oGraph.getLines()[0],
				oLine1 = oGraph.getLines()[1];

			oNode0.setX(0);
			oNode0.setY(0);
			oNode1.setX(1);
			oNode1.setY(1);

			oLine0.setSource({
				x: 0,
				y: 0
			});
			oLine0.setTarget({
				x: 1,
				y: 1
			});

			oLine1.setSource({
				x: 0,
				y: undefined
			});
			oLine1.setTarget({
				x: 1,
				y: 1
			});

			fnResolve();
		}));
		GraphTestUtils.checkGraphFiresEvent(assert, oGraph, "failure");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Coordinates of line bend points are tested after layouting is done.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [{key: 0}, {key: 1}],
			lines: [{from: 0, to: 1}, {from: 1, to: 0}]
		});

		assert.expect(1);
		oGraph.setLayoutAlgorithm(new TestLayout(function (fnResolve) {
			var oNode0 = oGraph.getNodes()[0],
				oNode1 = oGraph.getNodes()[1],
				oLine0 = oGraph.getLines()[0],
				oLine1 = oGraph.getLines()[1];

			oNode0.setX(0);
			oNode0.setY(0);
			oNode1.setX(1);
			oNode1.setY(1);

			oLine0.setSource({
				x: 0,
				y: 0
			});
			oLine0.setTarget({
				x: 1,
				y: 1
			});

			oLine1.setSource({
				x: 0,
				y: 0
			});
			oLine1.setTarget({
				x: 1,
				y: 1
			});

			oLine1.addBend({x: 0.5, y: 0});
			oLine1.addBend({x: undefined, y: 1});

			fnResolve();
		}));

		GraphTestUtils.checkGraphFiresEvent(assert, oGraph, "failure");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Preset node coordinates are overriden by Klay layout.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [{key: 0}, {key: 1, x: -1000, y: -1000}],
				lines: [{from: 0, to: 1}, {from: 1, to: 0}]
			}),
			fnAssert = function () {
				var x = oGraph.getNodes()[1].getX(),
					y = oGraph.getNodes()[1].getY();
				assert.ok(x >= 0 && y >= 0, "Negative preset coordinates should be overriden with positive values.");
			},
			fnDone = assert.async();

		assert.expect(1);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
		sap.ui.getCore().applyChanges();
	});

	var fnGetGroupCollapseGraph = function () {
		return GraphTestUtils.buildGraph({
			nodes: [
				{key: 0, title: "Zero", shape: "Box", group: "A"},
				{key: 1, title: "One", shape: "Box", group: "B"},
				{key: 2, title: "Two", shape: "Box", group: "C"}
			],
			lines: [
				{from: 0, to: 1},
				{from: 1, to: 2}
			],
			groups: [
				{key: "A", title: "Group A"},
				{key: "B", title: "Group B"},
				{key: "C", title: "Group C"}
			]
		});
	};

	QUnit.test("Left-to-right: Three chained nodes with three respective groups are aligned horizontally and with uniform distances.", function (assert) {
		var oGraph = fnGetGroupCollapseGraph(),
			fnDone = assert.async();

		assert.expect(10);
		oGraph.attachEvent("graphReady", function () {
			var oNode0 = oGraph.getNodes()[0],
				oNode1 = oGraph.getNodes()[1],
				oNode2 = oGraph.getNodes()[2],
				oLine0 = oGraph.getLines()[0],
				oLine1 = oGraph.getLines()[1],
				oGroupA = oGraph.getGroups()[0],
				oGroupB = oGraph.getGroups()[1],
				oGroupC = oGraph.getGroups()[2];

			// Alignment
			assert.equal(oNode0.getY(), oNode1.getY(), "Node 0 and 1 should be aligned horizontally.");
			assert.equal(oNode1.getY(), oNode2.getY(), "Node 1 and 2 should be aligned horizontally.");
			assert.equal(oGroupA.getY(), oGroupB.getY(), "Group A and B should be aligned horizontally.");
			assert.equal(oGroupB.getY(), oGroupC.getY(), "Group B and C should be aligned horizontally.");

			// Straight lines
			assert.equal(oLine0.getBends().length, 0, "Line 0 should have no bends.");
			assert.ok(oLine0.getSource().getY() === oLine0.getTarget().getY(), "Line 0 should be straight.");
			assert.equal(oLine1.getBends().length, 0, "Line 1 should have no bends.");
			assert.ok(oLine1.getSource().getY() === oLine1.getTarget().getY(), "Line 1 should be straight.");

			// Uniformity
			assert.equal(oNode1.getX() - oNode0.getX(), oNode2.getX() - oNode1.getX(), "There should be uniform distance between nodes.");
			assert.equal(oGroupB.getX() - oGroupA.getX(), oGroupC.getX() - oGroupB.getX(), "There should be uniform distance between groups.");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Top-to-bottom: Three chained nodes with three respective groups are aligned vertically and with uniform distances.", function (assert) {
		var oGraph = fnGetGroupCollapseGraph(),
			fnDone = assert.async();

		assert.expect(10);
		oGraph.setOrientation(Orientation.TopBottom);
		oGraph.attachEvent("graphReady", function () {
			var oNode0 = oGraph.getNodes()[0],
				oNode1 = oGraph.getNodes()[1],
				oNode2 = oGraph.getNodes()[2],
				oLine0 = oGraph.getLines()[0],
				oLine1 = oGraph.getLines()[1],
				oGroupA = oGraph.getGroups()[0],
				oGroupB = oGraph.getGroups()[1],
				oGroupC = oGraph.getGroups()[2];

			// Alignment
			assert.equal(oNode0.getX(), oNode1.getX(), "Node 0 and 1 should be aligned vertically.");
			assert.equal(oNode1.getX(), oNode2.getX(), "Node 1 and 2 should be aligned vertically.");
			assert.equal(oGroupA.getX(), oGroupB.getX(), "Group A and B should be aligned vertically.");
			assert.equal(oGroupB.getX(), oGroupC.getX(), "Group B and C should be aligned vertically.");

			// Straight lines
			assert.equal(oLine0.getBends().length, 0, "Line 0 should have no bends.");
			assert.ok(oLine0.getSource().getX() === oLine0.getTarget().getX(), "Line 0 should be straight.");
			assert.equal(oLine1.getBends().length, 0, "Line 1 should have no bends.");
			assert.ok(oLine1.getSource().getX() === oLine1.getTarget().getX(), "Line 1 should be straight.");

			// Uniformity
			assert.equal(oNode1.getY() - oNode0.getY(), oNode2.getY() - oNode1.getY(), "There should be uniform distance between nodes.");
			assert.equal(oGroupB.getY() - oGroupA.getY(), oGroupC.getY() - oGroupB.getY(), "There should be uniform distance between groups.");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Right-to-left: Single node within single group are rendered at the same coordinates as for Left-to-right.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "Zero", group: "A"}
				],
				groups: [
					{key: "A", title: "Group A"}
				]
			}),
			fNodeX, fNodeY, fGroupX, fGroupY,
			mAsyncChain = {
				eventName: "graphReady",
				iterations: [
					{
						action: function () {
							fNodeX = oGraph.getNodes()[0].getX();
							fNodeY = oGraph.getNodes()[0].getY();
							fGroupX = oGraph.getGroups()[0].getX();
							fGroupY = oGraph.getGroups()[0].getY();
							oGraph.setOrientation(Orientation.RightLeft);
						},
						assert: function () {
							assert.ok(
								oGraph.getNodes()[0].getX() === fNodeX
								&& oGraph.getNodes()[0].getY() === fNodeY
								&& oGraph.getGroups()[0].getX() === fGroupX
								&& oGraph.getGroups()[0].getY() === fGroupY,
								"Single node within single group shouldn't move with orientation."
							);
						}
					}
				]
			},
			fnDone = assert.async();

		assert.expect(1);
		GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});

	QUnit.test("Lines between nodes reach at least their border, and end/start within appropriate groups.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "Zero"},
					{key: 1, title: "One", group: "A"},
					{key: 2, title: "Two"}
				],
				lines: [
					{from: 0, to: 1},
					{from: 1, to: 2},
					{from: 0, to: 2},
					{from: 0, to: 2}
				],
				groups: [
					{key: "A", title: "Group A"}
				]
			}),
			fnCheckLine = function (oLine) {
				var fFromLeft = oLine.getFromNode().getX(),
					fFromRight = fFromLeft + oLine.getFromNode()._iWidth,
					fFromTop = oLine.getFromNode().getY(),
					fFromBottom = fFromTop + oLine.getFromNode()._iHeight,
					fSourceX = oLine.getSource().getX(), fSourceY = oLine.getSource().getY(),
					bSourceInsideFrom =
						fSourceX >= fFromLeft && fSourceX <= fFromRight && fSourceY >= fFromTop && fSourceY <= fFromBottom,
					fToLeft = oLine.getToNode().getX(),
					fToRight = fToLeft + oLine.getToNode()._iWidth,
					fToTop = oLine.getToNode().getY(),
					fToBottom = fToTop + oLine.getToNode()._iHeight,
					fTargetX = oLine.getTarget().getX(), fTargetY = oLine.getTarget().getY(),
					bTargetInsideTo =
						fTargetX >= fToLeft && fTargetX <= fToRight && fTargetY >= fToTop && fTargetY <= fToBottom,
					sLineId = oLine.getFrom() + "->" + oLine.getTo();

				assert.ok(oLine.getFromNode()._isIgnored() || bSourceInsideFrom, "Line " + sLineId + " should start within borders of its From node.");
				assert.ok(oLine.getToNode()._isIgnored() || bTargetInsideTo, "Line " + sLineId + " should end within borders of its To node.");
			},
			mAsyncChain = {
				eventName: "graphReady",
				iterations: [
					{
						action: function () {
							oGraph.getLines().forEach(fnCheckLine);
							oGraph.getGroups()[0].setCollapsed(true);
						},
						assert: function () {
							oGraph.getLines().forEach(fnCheckLine);
						}
						// },
						// {
						// 	action: function () {
						// 		oGraph.setLayoutAlgorithm(new ForceBasedLayout({maximumDuration: 100}));
						// 	},
						// 	assert: function () {
						// 		oGraph.getLines().forEach(fnCheckLine);
						// 	}
					}
				]
			},
			fnDone = assert.async();

		assert.expect(16);
		GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});

	// Skipped for integration to go on, version af1b7b9 of D3ForceWorker.js works everywhere including local PhantomJS,
	// but not no Hudson Voter, see build #10326
	QUnit.test("Forced based algorithm renders 2 nodes correctly.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0},
					{key: 1}
				],
				lines: [
					{from: 0, to: 1}
				]
			}),
			fnAssert = function () {
				var $divnodes = oGraph.$("divnodes"),
					aNodes = oGraph.getNodes();
				assert.equal($divnodes.children.length, 2 , "Nodes are rendered");
				assert.ok(oGraph.$().find(aNodes[0].$()[0].length > 0, "Node 1 should be rendered."));
				assert.ok(oGraph.$().find(aNodes[1].$()[0].length > 0, "Node @ should be rendered."));
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new ForceBasedLayout({maximumDuration: 100}));
		assert.expect(3);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	// Skipped for integration to go on, version af1b7b9 of D3ForceWorker.js works everywhere including local PhantomJS,
	// but not no Hudson Voter, see build #10326
	QUnit.test("Forces based algorithm ignores groups.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0},
					{key: 1, group: "A"}
				],
				lines: [
					{from: 0, to: 1}
				],
				groups: [
					{key: "A"}
				]
			}),
			fnAssert = function () {
				assert.ok(oGraph.$("groups").children().size() === 0, "No groups should be rendered.");
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new ForceBasedLayout({maximumDuration: 100}));
		assert.expect(1);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Forces directed algorithm ignores groups.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0},
					{key: 1, group: "A"}
				],
				lines: [
					{from: 0, to: 1}
				],
				groups: [
					{key: "A"}
				]
			}),
			fnAssert = function () {
				assert.ok(oGraph.$("groups").children().size() === 0, "No groups should be rendered.");
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new ForceDirectedLayout());
		assert.expect(1);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Swimlane algorithm keeps equal height of all groups when oriented from left to right.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, group: "A"}, {key: 1, group: "A"}, {key: 2, group: "B"}
				],
				lines: [
					{from: 0, to: 1}, {from: 0, to: 2}, {from: 1, to: 2}
				],
				groups: [
					{key: "A"}, {key: "B"}
				]
			}),
			fnAssert = function () {
				assert.equal(oGraph.getGroups()[0]._iHeight, oGraph.getGroups()[1]._iHeight, "Both groups should have the same height.");
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		assert.expect(1);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Swimlane algorithm keeps equal height of all groups when oriented from right to left.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, group: "A"}, {key: 1, group: "A"}, {key: 2, group: "B"}
				],
				lines: [
					{from: 0, to: 1}, {from: 0, to: 2}, {from: 1, to: 2}
				],
				groups: [
					{key: "A"}, {key: "B"}
				]
			}),
			fnAssert = function () {
				assert.equal(oGraph.getGroups()[0]._iHeight, oGraph.getGroups()[1]._iHeight, "Both groups should have the same height.");
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		oGraph.setOrientation(Orientation.RightLeft);
		assert.expect(1);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Swimlane algorithm keeps equal widths of all groups when oriented from top to bottom.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, group: "A"}, {key: 1, group: "A"}, {key: 2, group: "B"}
				],
				lines: [
					{from: 0, to: 1}, {from: 0, to: 2}, {from: 1, to: 2}
				],
				groups: [
					{key: "A"}, {key: "B"}
				]
			}),
			fnAssert = function () {
				assert.equal(oGraph.getGroups()[0]._iWidth, oGraph.getGroups()[1]._iWidth, "Both groups should have the same width.");
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		oGraph.setOrientation(Orientation.TopBottom);
		assert.expect(1);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Swimlane algorithm keeps equal widths of all groups when oriented from bottom to top.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, group: "A"}, {key: 1, group: "A"}, {key: 2, group: "B"}
				],
				lines: [
					{from: 0, to: 1}, {from: 0, to: 2}, {from: 1, to: 2}
				],
				groups: [
					{key: "A"}, {key: "B"}
				]
			}),
			fnAssert = function () {
				assert.equal(oGraph.getGroups()[0]._iWidth, oGraph.getGroups()[1]._iWidth, "Both groups should have the same width.");
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		oGraph.setOrientation(Orientation.BottomTop);
		assert.expect(1);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Swimlane algorithm manages all types of line tracing for vertical lanes.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, group: 1}, {key: 1, group: 2}, {key: 2, group: 3}, {key: 3, group: 1}, {key: 4, group: 3}, {key: 5, group: 1}
				],
				lines: [
					{from: 0, to: 1}, {from: 1, to: 2}, {from: 0, to: 3}, {from: 3, to: 5}, {from: 3, to: 1},
					{from: 3, to: 2}, {from: 3, to: 4}, {from: 5, to: 2}, {from: 0, to: 5}, {from: 0, to: 2}, {from: 5, to: 1}
				],
				groups: [
					{key: 1}, {key: 2, collapsed: true}, {key: 3}
				]
			}),
			fnAssert = function () {
				assert.ok(true, "All types of line traces should be managed.");
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		assert.expect(1);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Swimlane algorithm manages all types of line tracing for horizontal lanes.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, group: 1}, {key: 1, group: 2}, {key: 2, group: 3}, {key: 3, group: 1}, {key: 4, group: 3}, {key: 5, group: 1}
				],
				lines: [
					{from: 0, to: 1}, {from: 1, to: 2}, {from: 0, to: 3}, {from: 3, to: 5}, {from: 3, to: 1},
					{from: 3, to: 2}, {from: 3, to: 4}, {from: 5, to: 2}, {from: 0, to: 5}, {from: 0, to: 2}, {from: 5, to: 1}
				],
				groups: [
					{key: 1}, {key: 2, collapsed: true}, {key: 3}
				]
			}),
			fnAssert = function () {
				assert.ok(true, "All types of line traces should be managed.");
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		oGraph.setOrientation(Orientation.TopBottom);
		assert.expect(1);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Swimlane algorithm is transparent to different ordering of groups than is their ordering in the data set.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: "00", group: "00"}, {key: "01", group: "01"}, {key: "02", group: "02"}
				],
				lines: [
					{from: "00", to: "01"}, {from: "01", to: "02"}
				],
				groups: [
					{key: "02"}, {key: "01"}, {key: "00"}
				]
			}),
			oGroup0 = oGraph.getGroups()[0], oGroup1 = oGraph.getGroups()[1], oGroup2 = oGraph.getGroups()[2],
			oGroupToCollapse = oGraph.getGroups()[1],
			mAsyncChain = {
				eventName: "graphReady",
				iterations: [
					{
						action: function () {
							oGroupToCollapse.setCollapsed(true);
						},
						assert: function () {
							assert.equal(
								oGroup2.getX() + oGroup2._iWidth,
								oGroup1.getX(),
								"Visualy 1st group (which is the last one in the data set ~ index 2) should have the RIGHT border where the 2nd (index 1) has its LEFT border.");
							assert.equal(
								oGroup1.getX() + oGroup1._iWidth,
								oGroup0.getX(),
								"Visualy 2nd group (index 1) should have the RIGHT border where the 3rd (which is the 1st one in the data set ~ index 0) has its LEFT border.");
						}
					},{
						action: function () {
							oGraph.setOrientation(Orientation.TopBottom);
						},
						assert: function () {
							assert.equal(
								oGroup2.getY() + oGroup2._iHeight,
								oGroup1.getY(),
								"Visualy 1st group (which is the last one in the data set ~ index 2) should have the BOTTOM border where the 2nd (index 1) has its TOP border.");
							assert.equal(
								oGroup1.getY() + oGroup1._iHeight,
								oGroup0.getY(),
								"Visualy 2nd group (index 1) should have the BOTTOM border where the 3rd (which is the 1st one in the data set ~ index 0) has its TOP border.");
						}
					}
				]
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		assert.expect(4);
		GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});

	QUnit.test("Swimlane algorithm put nipples between collapsed groups.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: "0", group: "0"}, {key: "1", group: "1"}, {key: "2", group: "2"}, {key: "3", group: "3"},
					{key: "4", group: "0"}, {key: "5", group: "3"}
				],
				lines: [
					{from: "0", to: "3"}
				],
				groups: [
					{key: "0", collapsed: true}, {key: "1", collapsed: true}, {key: "2", collapsed: true}, {key: "3"}
				]
			}),
			oLine0 = oGraph.getLines()[0],
			fnAssert = function () {
				assert.equal(oLine0._aNipples.length, 1, "There should be ONE nipple on the only line.");
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		assert.expect(1);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Swimlane algorithm handles various root-less cycles properly.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, group: 0}, {key: 1, group: 0},
					{key: 2, group: 1}, {key: 3, group: 1},
					{key: 4, group: 2}, {key: 5, group: 2}
				],
				lines: [
					{from: 0, to: 0}, // Single node loop
					{from: 1, to: 2}, // Three nodes loop across two groups
					{from: 2, to: 3},
					{from: 3, to: 1},
					{from: 4, to: 5}, // Two nodes loop within one group
					{from: 5, to: 4}
				],
				groups: [
					{key: 0}, {key: 1}, {key: 2}
				]
			}),
			fnEqualX = function (a, b, s) {
				assert.equal(oGraph.getNodes()[a].getX(), oGraph.getNodes()[b].getX(), s);
			},
			fnEqualY = function (a, b, s) {
				assert.equal(oGraph.getNodes()[a].getY(), oGraph.getNodes()[b].getY(), s);
			},
			fnAssert = function () {
				// Nodes are supposed to be vertically aligned per pair...
				fnEqualX(0, 1, "1st pair of nodes should be aligned vertically.");
				fnEqualX(2, 3, "2nd pair of nodes should be aligned vertically.");
				fnEqualX(4, 5, "3rd pair of nodes should be aligned vertically.");
				// ...and horizontally per tripple, no matter the cycles
				fnEqualY(0, 2, "1st pair of even nodes should be aligned horizontally.");
				fnEqualY(2, 4, "2nd pair of even nodes should be aligned horizontally.");
				fnEqualY(1, 3, "1st pair of odd nodes should be aligned horizontally.");
				fnEqualY(3, 5, "2nd pair of odd nodes should be aligned horizontally.");
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		assert.expect(7);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("TwoColumns algorithm works properly.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, group: 0}, {key: 1, group: 1},
					{key: 2, group: 2}, {key: 3, group: 3},
					{key: 4, group: 4}, {key: 5, group: 5}
				],
				lines: [
					{from: 0, to: 1},
					{from: 2, to: 3},
					{from: 4, to: 5}
				],
				groups: [
					// Top groups
					{key: 0}, {key: 1},
					// Sub-groups
					{key: 2, parentGroupKey: 0}, {key: 3, parentGroupKey: 1},
					{key: 4, parentGroupKey: 2}, {key: 5, parentGroupKey: 3}
				]
			}),
			fnAssert = function () {
				assert.ok(true, "Didn't fail, bingo.");
			},
			fnDone = assert.async();

		oGraph.setLayoutAlgorithm(new TwoColumnsLayout());
		assert.expect(1);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("TwoColumns algorithm accepts only lines going from one column to the other.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, group: 0},
					{key: 1, group: 1},
					{key: 2, group: 2}
				],
				lines: [
					{from: 0, to: 1},
					{from: 1, to: 2} // This is the faulty line
				],
				groups: [
					{key: 0},
					{key: 1},
					{key: 2, parentGroupKey: 1}
				]
			});

		oGraph.setLayoutAlgorithm(new TwoColumnsLayout());
		assert.expect(1);
		GraphTestUtils.checkGraphFiresEvent(assert, oGraph, "failure");
	});

	QUnit.test("Klay js loads properly", function (assert) {
		return KlayWrapper.getKlay().then(function (oKlay) {
			assert.ok(oKlay, "Klay loaded");
		});
	});

	QUnit.test("Klay called locally when Worker not supported", function (assert) {
		// Arrange
		var workerBackup = window.Worker;
		window.Worker = undefined;
		var oParameters = {
			graph: {},
			options: {},
			success: jQuery.noop,
			error: jQuery.noop
		};

		var oLayoutSpy = sinon.spy(),
			fnDone = assert.async();
		var oKlay = {
			layout: function (oParam) {
				oLayoutSpy(oParam);

				assert.ok(oLayoutSpy.calledOnce, "layout method was called once");
				assert.ok(oLayoutSpy.calledWith(oParameters), "layout method was called with right params");

				// Cleanup
				window.Worker = workerBackup;
				KlayWrapper.getKlay.restore();
				fnDone();
			}
		};
		sinon.stub(KlayWrapper, "getKlay").returns(Promise.resolve(oKlay));

		// Act
		KlayWrapper.layout(oParameters);

	});

	QUnit.test("Klay called locally when WebWorker fails", function (assert) {
		// Arrange
		var workerBackup = window.Worker;
		// in case that worker would be unspported (undefined), make it defined
		window.Worker = {};

		var oParameters = {
			graph: {},
			options: {},
			success: jQuery.noop,
			error: jQuery.noop
		};

		sinon.stub(KlayWrapper._pool, "borrowObject").throws();

		var oLayoutSpy = sinon.spy(),
			fnDone = assert.async();
		var oKlay = {
			layout: function (oParam) {
				oLayoutSpy(oParam);

				assert.ok(oLayoutSpy.calledOnce, "layout method was called once");
				assert.ok(oLayoutSpy.calledWith(oParameters), "layout method was called with right params");

				// Cleanup
				window.Worker = workerBackup;
				KlayWrapper.getKlay.restore();
				KlayWrapper._pool.borrowObject.restore();
				fnDone();
			}
		};
		sinon.stub(KlayWrapper, "getKlay").returns(Promise.resolve(oKlay));

		// Act
		KlayWrapper.layout(oParameters);
	});

	// QUnit.test("WebWorker called correctly for KlayWrapper when supported", function (assert) {
	// 	if (typeof (Worker) === "undefined") {
	// 		assert.ok(true, "WebWorker not supported");
	// 		return;
	// 	}
	//
	// 	// Arrange
	// 	var oWorker = {
	// 		postMessage: sinon.spy()
	// 	};
	// 	var oPooledWorker = {
	// 		getWorker: function() {
	// 			return oWorker;
	// 		}
	// 	};
	// 	sinon.stub(KlayWrapper._pool, "borrowObject").returns(oPooledWorker);
	//
	// 	var oParameters = {
	// 		graph: {},
	// 		options: {},
	// 		success: jQuery.noop,
	// 		error: jQuery.noop
	// 	};
	//
	// 	var oPostParameters = {
	// 		graph: oParameters.graph,
	// 		options: oParameters.options
	// 	};
	//
	// 	// Act
	// 	KlayWrapper.layout(oParameters);
	//
	// 	// Assert
	// 	assert.ok(oWorker.onerror, "onerrror function set on worker");
	// 	assert.ok(oWorker.onerror, "onmessage function set on worker");
	// 	assert.ok(oWorker.postMessage.calledWith(oPostParameters));
	//
	// 	// Cleanup
	// 	KlayWrapper._pool.borrowObject.restore();
	// });

	QUnit.test("D3 loads properly", function (assert) {
		return D3Wrapper.getD3().then(function (D3) {
			assert.ok(D3, "D3 loaded");
		});
	});

	QUnit.test("D3ForceWrapper layout", function (assert) {
		// Arrange
		var fnDone = assert.async();

		var oParameters = {
			graph: {nodes: [], links: []},
			alpha: 1,
			friction: 1,
			charge: 1,
			maximumDuration: 100
		};


		// Act
		D3Wrapper.layout(oParameters).then(function (oData) {
			// Assert
			assert.equal(oData, oParameters.graph);

			fnDone();
		});
	});
});
