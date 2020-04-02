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

	QUnit.module("Network graph collapsing/expanding");

	QUnit.test("Some basic collapse/expand stuff.", function (assert) {
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
			fnDone = assert.async();

		assert.expect(6);
		oGraph.attachEvent("graphReady", function () {
			var oChecker = GraphTestUtils.getColapseExpandVisibilityChecker(assert, oGraph);
			oChecker.check(1, true, "PCE", "FFT");
			oChecker.check(0, true, "CCE", "FTT");
			oChecker.check(0, false, "EEE", "FFF");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Mixed nodes collapsing cycles through collapse states correctly.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "0", shape: "Circle"},
					{key: 1, title: "1", shape: "Circle"},
					{key: 2, title: "2", shape: "Circle"},
					{key: 3, title: "3", shape: "Circle"},
					{key: 4, title: "4", shape: "Circle"},
					{key: 5, title: "5", shape: "Circle"}
				],
				lines: [
					{from: 0, to: 1},
					{from: 0, to: 2},
					{from: 1, to: 3},
					{from: 1, to: 4},
					{from: 2, to: 4},
					{from: 2, to: 5}
				]
			}),
			fnDone = assert.async();

		assert.expect(22);
		oGraph.attachEvent("graphReady", function () {
			var oChecker = GraphTestUtils.getColapseExpandVisibilityChecker(assert, oGraph);
			// There and Back Again scenario
			oChecker.check(3, true, "EEECEE", "FFFFFF");
			oChecker.check(2, true, "EPCCEE", "FFFFTT");
			oChecker.check(1, true, "ECCCEE", "FFFTTT");
			oChecker.check(0, true, "CCCCEE", "FTTTTT");
			oChecker.check(0, false, "ECCCEE", "FFFTTT");
			oChecker.check(1, false, "EEPCEE", "FFFFFT");
			oChecker.check(2, false, "EEECEE", "FFFFFF");
			oChecker.check(3, false, "EEEEEE", "FFFFFF");

			// Some trickier stuff
			oChecker.check(0, true, "CEEEEE", "FTTTTT");

			oChecker.check(0, true, "CEEEEE", "FTTTTT");
			oChecker.check(1, true, "CCEEEE", "FTTTTT");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Collapsing/expanding over a group makes it collapse/expand too.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{key: 0, title: "0"},
					{key: 1, title: "1"},
					{key: 2, title: "2", group: "A"},
					{key: 3, title: "3", group: "A"},
					{key: 4, title: "4"},
					{key: 5, title: "5"}
				],
				lines: [
					{from: 0, to: 1},
					{from: 1, to: 2},
					{from: 2, to: 3},
					{from: 4, to: 3},
					{from: 2, to: 5}
				],
				groups: [
					{key: "A"}
				]
			}),
			fnDone = assert.async();

		assert.expect(11);
		oGraph.attachEvent("graphReady", function () {
			var oChecker = GraphTestUtils.getColapseExpandVisibilityChecker(assert, oGraph),
				oGroup = oGraph.getGroups()[0];
			oChecker.check(4, true, "EEPECE", "FFFTFF");
			assert.notOk(oGroup._bIsHidden, "Group is visible since some of its nodes are visible.");
			oChecker.check(1, true, "ECPECE", "FFTTFT");
			assert.ok(oGroup._bIsHidden, "Group is hidden since all its nodes are hidden.");
			oChecker.check(4, false, "ECPEEE", "FFTFFT");
			assert.notOk(oGroup._bIsHidden, "Group is visible since some of its nodes are visible.");
			oChecker.check(1, false, "EEEEEE", "FFFFFF");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Collapsing/expanding inside a cycle of nodes works correctly.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "0"},
					{key: 1, title: "1"},
					{key: 2, title: "2"},
					{key: 3, title: "3"},
					{key: 4, title: "4"},
					{key: 5, title: "5"}
				],
				lines: [
					{from: 0, to: 1},
					{from: 1, to: 2},
					{from: 2, to: 3},
					{from: 3, to: 0},
					{from: 4, to: 0},
					{from: 4, to: 5}
				]
			}),
			fnDone = assert.async();

		assert.expect(14);
		oGraph.attachEvent("graphReady", function () {
			var oChecker = GraphTestUtils.getColapseExpandVisibilityChecker(assert, oGraph);
			oChecker.check(2, true, "EECEPE", "TTFTFF");
			oChecker.check(4, true, "EECECE", "TTFTFT");
			oChecker.check(4, false, "EECEEE", "FFFTFF");
			oChecker.check(4, true, "EECECE", "TTTTFT");
			oChecker.check(4, false, "EECEEE", "FFFTFF");
			oChecker.check(2, false, "EEEEEE", "FFFFFF");
			oChecker.check(3, true, "EEECPE", "TTTFFF");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Collapsing/expanding case inspired by FXUBRQ13-305.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "0"},
					{key: 1, title: "1", group: "A"},
					{key: 2, title: "2"},
					{key: 3, title: "3", group: "A"},
					{key: 4, title: "4"},
					{key: 5, title: "5"}
				],
				lines: [
					{from: 0, to: 1},
					{from: 2, to: 3},
					{from: 1, to: 4},
					{from: 3, to: 5}
				],
				groups: [
					{key: "A", title: "Group A"}
				]
			}),
			mAsyncChain = {
				eventName: "graphReady",
				iterations: [
					{
						action: function () {
							oGraph.getGroups()[0].setCollapsed(true);
						},
						assert: function () {
							assert.ok(oGraph.getGroups()[0].getCollapsed(), "Group A should be collapsed.");
							var oChecker = GraphTestUtils.getColapseExpandVisibilityChecker(assert, oGraph);
							oChecker.check(0, true, "CECEEE", "FTFTTT");
							assert.equal(oGraph.getGroups()[0].$()[0].style.display, "none", "Group A should be invisible (but rendered).");
							oChecker.check(2, false, "EEEEEE", "FFFFFF");
						}
					}
				]
			},
			fnDone = assert.async();

		assert.expect(6);
		GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});

	QUnit.test("Collapsing/expanding test.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "0"},
					{key: 1, title: "1"},
					{key: 2, title: "2"},
					{key: 3, title: "3"},
					{key: 4, title: "4"},
					{key: 5, title: "5"},
					{key: 6, title: "6"},
					{key: 7, title: "7"}
				],
				lines: [
					{from: 0, to: 1},
					{from: 1, to: 2},
					{from: 1, to: 6},
					{from: 2, to: 3},
					{from: 2, to: 7},
					{from: 4, to: 5},
					{from: 5, to: 2},
					{from: 5, to: 6},
					{from: 6, to: 3},
					{from: 6, to: 7}
				]
			}),
			fnDone = assert.async();

		assert.expect(26);
		oGraph.attachEvent("graphReady", function () {
			var oChecker = GraphTestUtils.getColapseExpandVisibilityChecker(assert, oGraph),
				aNodes = oGraph.getNodes();

			oChecker.check(7, false, "EEEEEEEE", "FFFFFFFF");
			oChecker.check(6, true, "EECEEECE", "FFFTFFFT");
			oChecker.check(2, true, "EECEEECE", "FFFTFFFT");
			oChecker.check(1, true, "ECCEECCE", "FFTTFFTT");
			oChecker.check(0, true, "CCCEECCE", "FTTTFFTT");

			oChecker.check(5, false, "CCCEEECE", "FTFTFFFT");

			oChecker.check(0, false, "EECEEECE", "FFFTFFFT");
			oChecker.check(1, false, "EECEEECE", "FFFTFFFT");
			oChecker.check(2, false, "EEEEEEEE", "FFFFFFFF");

			oChecker.check(5, true, "ECEEECEE", "FFTTFFTT");
			oChecker.check(3, true, "ECECECEE", "FFTTFFTT");
			oChecker.check(1, false, "EEECEEEE", "FFFFFFFF");

			for (var i = 0; i < aNodes.length; i++) {
				aNodes[i].setCollapsed(true);
			}
			oChecker.check(0, true, "CCCCCCCC", "FTTTFTTT");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Collapsing/expanding in specific case (more nodes behind).", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "0"},
					{key: 1, title: "1"},
					{key: 2, title: "2"},
					{key: 3, title: "3"}
				],
				lines: [
					{from: 0, to: 1},
					{from: 1, to: 2},
					{from: 3, to: 2}
				]
			}),
			fnDone = assert.async();

		assert.expect(9);
		oGraph.attachEvent("graphReady", function () {
			var oChecker = GraphTestUtils.getColapseExpandVisibilityChecker(assert, oGraph);
			oChecker.check(3, true, "ECEC", "FFTF");
			oChecker.check(0, true, "CCEC", "FTTF");
			oChecker.check(3, false, "CCEE", "FTFF");
			oChecker.check(0, false, "EEEE", "FFFF");
			assert.notOk(oGraph.getNodeByKey("1").getCollapsed(), "Node '1' should be expanded.");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.skip("Collapsing/expanding test (nodes + groups).", function(assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "0", group: "A"},
					{key: 1, title: "1", group: "A"},
					{key: 2, title: "2"},
					{key: 3, title: "3", group: "B"},
					{key: 4, title: "4", group: "B"},
					{key: 5, title: "5"},
					{key: 6, title: "6"}
				],
				lines: [
					{from: 0, to: 1},
					{from: 1, to: 0},
					{from: 1, to: 2},
					{from: 2, to: 1},
					{from: 0, to: 2},
					{from: 2, to: 0},
					{from: 3, to: 4},
					{from: 5, to: 4},
					{from: 5, to: 0},
					{from: 3, to: 6}
				],
				groups: [
					{key: "A", title: "Group A"},
					{key: "B", title: "Group B"}
				]
			}),
			fnDone = assert.async();

		assert.expect(20);
		oGraph.attachEvent("graphReady", function () {
			var oChecker = GraphTestUtils.getColapseExpandVisibilityChecker(assert, oGraph);

			oChecker.check(1, true, "ECEEEPE", "TFTFFFF");
			oChecker.check(3, true, "ECECECE", "TFTFTFT");
			oChecker.check(5, false, "EEEPEEE", "FFFFFFT");
			oChecker.check(0, true, "CEEPEEE", "FTTFFFT");
			oChecker.check(5, true, "CEECECE", "TTTFTFT");
			assert.ok(oGraph.getGroups()[0].isHidden(), "Group 'A' should be hidden.");
			oChecker.check(4, false, "CEECECE", "TTTFTFT");
			oChecker.check(5, false, "CEEPEEE", "FTTFFFT");
			assert.notOk(oGraph.getGroups()[0].isHidden(), "Group 'A' should be visible.");
			oChecker.check(3, false, "CEEEEEE", "FTTFFFF");
			oChecker.check(5, true, "CEEPECE", "TTTFTFF");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});
});
