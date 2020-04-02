sap.ui.define([
	"./TestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (GraphTestUtils, createAndAppendDiv) {
	"use strict";

	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%; overflow-y: hidden");

	QUnit.module("Network graph selection of nodes and lines");

	QUnit.test("Preselecting, selecting and unselecting of nodes keep correct state and DOM presence, " +
		"and also fires expected events with correct parameteres.", function (assert) {
		var oData = {
				nodes: [
					{key: 0, selected: true},
					{key: 1, selected: false},
					{key: 2},
					{key: 3, group: "A", selected: true}
				],
				groups: [{key: "A"}]
			},
			oGraph = GraphTestUtils.buildGraph(oData),
			fnDone = assert.async(),
			fnDone2 = assert.async(),
			fnCheckSelection = function (sExpected) {
				assert.equal(GraphTestUtils.getNodesSelectionFingerprint(oGraph), sExpected, "Nodes should have correct selected states.");
			},
			bAfterMassDeselect = false;

		assert.expect(5);
		oGraph.attachEvent("selectionChange", function (oItem, sType) {
			assert.ok(bAfterMassDeselect, "Graph should trigger 'select' event after API deselection.");
			fnDone2();
		});
		oGraph.attachEvent("graphReady", function () {
			var oNode0 = oGraph.getNodes()[0],
				oNode1 = oGraph.getNodes()[1],
				oNode2 = oGraph.getNodes()[2],
				oNode3 = oGraph.getNodes()[3];
			fnCheckSelection("TFFT");
			oNode0.setSelected(true); // Select a selected one
			oNode1.setSelected(false); // Unselect an unselected one
			oNode2.setSelected(true); // Select an unselected one
			oNode3.setSelected(false); // Unselect a selected one
			fnCheckSelection("TFTF");
			bAfterMassDeselect = true;
			oGraph.deselect();
			fnCheckSelection("FFFF");
			// Select all one by one
			oNode0.setSelected(true);
			oNode1.setSelected(true);
			oNode2.setSelected(true);
			oNode3.setSelected(true);
			fnCheckSelection("TTTT");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Preselecting, selecting and unselecting of lines keep correct state and DOM presence, " +
		"and also fires expected events with correct parameteres.", function (assert) {
		var oData = {
				nodes: [
					{key: 0}, {key: 1}, {key: 2}, {key: 3}, {key: 4}
				],
				lines: [
					{from: 0, to: 1, selected: true},
					{from: 0, to: 2, selected: false},
					{from: 0, to: 3},
					{from: 0, to: 4, selected: true}
				]
			},
			oGraph = GraphTestUtils.buildGraph(oData),
			fnDone = assert.async(),
			fnDone2 = assert.async(),
			fnCheckSelection = function (sExpected) {
				assert.equal(GraphTestUtils.getLinesSelectionFingerprint(oGraph), sExpected, "Lines should have correct selected states.");
			},
			bAfterMassDeselect = false;

		assert.expect(5);
		oGraph.attachEvent("selectionChange", function (oEvent) {
			assert.ok(bAfterMassDeselect, "Graph should trigger 'select' event after API deselection.");
			fnDone2();
		});
		oGraph.attachEvent("graphReady", function () {
			var oLine0 = oGraph.getLines()[0],
				oLine1 = oGraph.getLines()[1],
				oLine2 = oGraph.getLines()[2],
				oLine3 = oGraph.getLines()[3];
			fnCheckSelection("TFFT");
			oLine0.setSelected(true); // Select a selected one
			oLine1.setSelected(false); // Unselect an unselected one
			oLine2.setSelected(true); // Select an unselected one
			oLine3.setSelected(false); // Unselect a selected one
			fnCheckSelection("TFTF");
			bAfterMassDeselect = true;
			oGraph.deselect();
			fnCheckSelection("FFFF");
			// Select all one by one
			oLine0.setSelected(true);
			oLine1.setSelected(true);
			oLine2.setSelected(true);
			oLine3.setSelected(true);
			fnCheckSelection("TTTT");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Selection change event should be fired with correct parameters.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0},
					{key: 1},
					{key: 2, group: "A"}
				],
				lines: [
					{from: 0, to: 1},
					{from: 1, to: 2},
					{from: 2, to: 0}
				],
				groups: [{key: "A"}]
			}),
			fnDone = assert.async(),
			sItemSet,
			fnGetNodeIterFor = function (iNode, bWithCtrl, sActionLabel, sExpected) {
				return {
					action: function () {
						// GraphTestUtils.triggerMouseEvent(oGraph.getNodes()[iNode], {ctrlKey: bWithCtrl});
						GraphTestUtils.clickNode(oGraph.getNodes()[iNode], bWithCtrl);
					},
					assert: function (oEvent) {
						sItemSet = GraphTestUtils.getEventItemsKeyList(oEvent);
						assert.equal(sItemSet, sExpected, sActionLabel + ": Correct set of selected items [" + sItemSet + "] should be passed with the event.");
					}
				};
			},
			fnGetLineIterFor = function (iLine, bWithCtrl, sActionLabel, sExpected) {
				return {
					action: function () {
						oGraph._tooltip.instantClose();
						GraphTestUtils.clickLine(oGraph.getLines()[iLine], bWithCtrl);
					},
					assert: function (oEvent) {
						sItemSet = GraphTestUtils.getEventItemsKeyList(oEvent);
						assert.equal(sItemSet, sExpected, sActionLabel + ": Correct set of selected items [" + sItemSet + "] should be passed with the event.");
					}
				};
			},
			mSyncChain = {
				eventName: "selectionChange",
				iterations: [
					fnGetNodeIterFor(1, false, "2nd node 1st click, no key", "1"),
					fnGetNodeIterFor(0, false, "1st node 1st click, no key", "0, 1"),
					fnGetNodeIterFor(1, true, "2nd node 2nd click, with Ctrl", "1"),
					fnGetNodeIterFor(2, true, "3rd node 1st click, with Ctrl", "2"),
					fnGetNodeIterFor(0, false, "1st node 3rd click, no key", "0, 1, 2"),
					fnGetNodeIterFor(1, true, "2nd node 3rd click, with Ctrl", "1"),
					{
						action: function () {
							oGraph.deselect();
						},
						assert: function (oEvent) {
							sItemSet = GraphTestUtils.getEventItemsKeyList(oEvent);
							assert.equal(sItemSet, "1", "API deselect: Correct set of selected items [" + sItemSet + "] should be passed with the event.");
						}
					}
					,
					fnGetLineIterFor(1, false, "2nd line 1st click, no key", "1->2"),
					fnGetLineIterFor(0, false, "1st line 1st click, no key", "0->1, 1->2"),
					fnGetLineIterFor(1, true, "2nd line 2nd click, with Ctrl", "1->2"),
					fnGetLineIterFor(2, true, "3rd line 1st click, with Ctrl", "2->0"),
					fnGetLineIterFor(0, false, "1st line 2nd click, no key", "0->1, 1->2, 2->0"),

					// Node mixed with lines, guess should work too...
					fnGetNodeIterFor(0, false, "1st node mixed click, no key", "0"),
					fnGetLineIterFor(1, true, "2nd line mixed click, with Ctrl", "1->2"),
					{
						action: function () {
							oGraph.deselect();
						},
						assert: function (oEvent) {
							sItemSet = GraphTestUtils.getEventItemsKeyList(oEvent);
							assert.equal(sItemSet, "0, 1->2", "API deselect: Correct set of selected items [" + sItemSet + "] should be passed with the event.");
						}
					}
				]
			};

		assert.expect(15);
		oGraph.attachGraphReady(function () {
			GraphTestUtils.runSyncActionAssertChain(oGraph, mSyncChain, fnDone, false);
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});
});
