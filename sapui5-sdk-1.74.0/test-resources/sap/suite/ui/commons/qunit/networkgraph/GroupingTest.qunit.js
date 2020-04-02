sap.ui.define([
	"./TestUtils",
	"sap/ui/core/Popup",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/networkgraph/Group",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (GraphTestUtils, Popup, createAndAppendDiv, Group) {
	"use strict";

	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%; overflow-y: hidden");

	QUnit.module("Network graph grouping");

	QUnit.test("Groups indifferent to their ids being numbers or not.", function (assert) {
		assert.expect(1);

		// Two identical graphs, the only difference is that the second one has number as group ids
		var oGraph1Data = {
				nodes: [{key: 0, group: "A"}, {key: 1}, {key: 2, group: "B"}],
				lines: [{from: 0, to: 1}, {from: 1, to: 2}],
				groups: [{key: "A"}, {key: "B"}]
			},
			oGraph2Data = {
				nodes: [{key: 0, group: "1"}, {key: 1}, {key: 2, group: "2"}],
				lines: [{from: 0, to: 1}, {from: 1, to: 2}],
				groups: [{key: "1"}, {key: "2"}]
			},
			oGraph1 = GraphTestUtils.buildGraph(oGraph1Data),
			oGraph2 = GraphTestUtils.buildGraph(oGraph2Data),
			fnDone = assert.async(),
			oPromise1 = new Promise(function (resolve, reject) {
				oGraph1.attachEvent("graphReady", function () {
					var sCoordinates1 = GraphTestUtils.getGraphCoordinatesFingerprint(oGraph1);
					resolve(sCoordinates1);
				});
			}),
			oPromise2 = new Promise(function (resolve, reject) {
				oGraph2.attachEvent("graphReady", function () {
					var sCoordinates2 = GraphTestUtils.getGraphCoordinatesFingerprint(oGraph2);
					resolve(sCoordinates2);
				});
			});

		Promise.all([oPromise1, oPromise2]).then(function (aValues) {
			assert.equal(aValues[0], aValues[1], "Two congruent graphs with different data types used as keys should have identical layout.");
			fnDone();
			oGraph1.destroy();
			oGraph2.destroy();
		});

		oGraph1.placeAt("content");
		oGraph2.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	var fnGetGroupCollapseGraph = function () {
		return {
			nodes: [
				{key: 0, title: "0"},
				{key: 1, title: "1", group: "A", titleLineSize: 10},
				{key: 2, title: "2", group: "A"},
				{key: 3, title: "3", group: "A"},
				{key: 4, title: "4", group: "B"},
				{key: 5, title: "5", group: "B"},
				{key: 6, title: "6", group: "B"},
				{key: 7, title: "7"}
			],
			lines: [
				{from: 0, to: 1},
				{from: 1, to: 2},
				{from: 1, to: 3},
				{from: 2, to: 5},
				{from: 3, to: 4},
				{from: 4, to: 7},
				{from: 5, to: 6}
			],
			groups: [
				{key: "A", title: "Group A"},
				{key: "B", title: "Group B"}
			]
		};
	};

	QUnit.test("Collapsing and expanding of groups hides and shows lines and nodes properly, also deselecting nodes of collapsing goups.", function (assert) {
		var oData = fnGetGroupCollapseGraph(),
			oGraph = GraphTestUtils.buildGraph(oData),
			mAsyncChain = {
				eventName: "graphReady",
				iterations: [
					{
						action: function () {
							oGraph.getNodes()[1].setSelected(true);
							oGraph.getGroups()[0].setCollapsed(true);
						},
						assert: function () {
							assert.ok(true, ">> Collapse group A");
							assert.ok(oGraph.getGroups()[0].getCollapsed(), "Group A collapsed as expected.");
							assert.notOk(oGraph.getGroups()[1].getCollapsed(), "Group B expanded as expected.");
							GraphTestUtils.assertNodesDomFingerprint(assert, oGraph, "XoooXXXX");
							GraphTestUtils.assertLinesDomFingerprint(assert, oGraph, "XooXXXX");
						}
					},
					{
						action: function () {
							oGraph.getGroups()[1].setCollapsed(true);
						},
						assert: function () {
							assert.ok(true, ">> Collapse group B");
							assert.ok(oGraph.getGroups()[0].getCollapsed(), "Group A collapsed as expected.");
							assert.ok(oGraph.getGroups()[1].getCollapsed(), "Group B collapsed as expected.");
							GraphTestUtils.assertNodesDomFingerprint(assert, oGraph, "XooooooX");
							GraphTestUtils.assertLinesDomFingerprint(assert, oGraph, "XooXXXo");
						}
					},
					{
						action: function () {
							oGraph.getGroups()[0].setCollapsed(false);
						},
						assert: function () {
							assert.ok(true, ">> Expand group A");
							assert.notOk(oGraph.getGroups()[0].getCollapsed(), "Group A expanded as expected.");
							assert.ok(oGraph.getGroups()[1].getCollapsed(), "Group B collapsed as expected.");
							GraphTestUtils.assertNodesDomFingerprint(assert, oGraph, "XXXXoooX");
							GraphTestUtils.assertLinesDomFingerprint(assert, oGraph, "XXXXXXo");
						}
					},
					{
						action: function () {
							oGraph.getGroups()[1].setCollapsed(false);
						},
						assert: function () {
							assert.ok(true, ">> Expand group B");
							assert.notOk(oGraph.getGroups()[0].getCollapsed(), "Group A expanded as expected.");
							assert.notOk(oGraph.getGroups()[1].getCollapsed(), "Group B expanded as expected.");
							GraphTestUtils.assertNodesDomFingerprint(assert, oGraph, "XXXXXXXX");
							GraphTestUtils.assertLinesDomFingerprint(assert, oGraph, "XXXXXXX");
						}
					}
				]
			},
			fnDone = assert.async();

		assert.expect(20);
		GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});

	QUnit.test("Group with all its nodes collapsed from outside should remain invisible until some nodes get back.", function (assert) {
		var oData = fnGetGroupCollapseGraph(),
			oGraph = GraphTestUtils.buildGraph(oData),
			mAsyncChain = {
				eventName: "graphReady", iterations: [
					{
						action: function () {
							oGraph.getNodes()[1].setCollapsed(true);
							oGraph.getGroups()[0].setCollapsed(true);
						},
						assert: function () {
							assert.equal(oGraph.getGroups()[1].$()[0].style.display, "none", "Group B should be invisible (but rendered).");
						}
					}
				]
			},
			fnDone = assert.async();

		assert.expect(1);
		GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});

	QUnit.test("Group events [collapseExpand] are fired correctly.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [{key: 0, group: "A"}],
				groups: [{key: "A"}]
			}),
			fnCollapseExpandDone = assert.async(),
			fnGraphReadyDone = assert.async();

		assert.expect(1);
		oGraph.attachEvent("graphReady", function () {
			oGraph.getGroups()[0].$("collapse").click();
			fnGraphReadyDone();
		});
		oGraph.getGroups()[0].attachEvent("collapseExpand", function () {
			assert.ok(true, "Collapse/expand event should fire correctly.");
			fnCollapseExpandDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Unused group isn't rendered.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [{key: 0}],
				groups: [{key: "A"}]
			}),
			fnDone = assert.async();

		assert.expect(1);
		oGraph.attachGraphReady(function () {
			assert.ok(!oGraph.getGroups()[0].getDomRef(), "Group shouldn't be rendered.");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Detail window opens when user clicks on group's detail button.", function (assert) {
		var openSpy = sinon.spy(Popup.prototype, "open"),
			oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "0"},
					{key: 1, title: "1", group: "A"}
				],
				groups: [
					{key: "A", title: "Group A"}
				]
			}),
			oGroup = oGraph.getGroups()[0];
		GraphTestUtils.performeActionButtonTest({
			graph: oGraph,
			expect: 1,
			assert: assert,
			elementToClick: oGroup,
			fnCheck: function () {
				var $button = oGroup.$("menu");
				$button.click();
				assert.equal(openSpy.callCount, 1, "Tooltip popup should have been opened.");
				openSpy.restore();
			}
		});
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Expanding nodes influence visibility of groups in its path.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "Zero", group: "A"},
					{key: 1, title: "One", group: "B"}
				],
				lines: [
					{from: 0, to: 1}
				],
				groups: [
					{key: "A", title: "Group A"},
					{key: "B", title: "Group B"}
				]
			}),
			fnDone = assert.async(),
			mAsyncChain = {
				eventName: "graphReady",
				iterations: [
					{
						action: function () {
							oGraph.getNodes()[0].setCollapsed(true);
							oGraph.getGroups()[0].setCollapsed(true);
						},
						assert: function () {
							assert.equal(oGraph.getGroups()[1].$()[0].style.display, "none", "Group B should be invisible (but rendered).");
						}
					},
					{
						action: function () {
							oGraph.getGroups()[0].setCollapsed(false);
						},
						assert: function () {
							oGraph.getNodes()[0].setCollapsed(false);
							assert.ok(GraphTestUtils.isElementInDom(oGraph.getGroups()[1]), "Group B is rendered.");
						}
					}
				]
			};

		assert.expect(2);

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
		GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});

	QUnit.test("Group checkbox", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{key: 0, title: "Zero", group: "A"},
				{key: 1, title: "One", group: "B"},
				{key: 2, title: "Two", group: "C"}
			],
			groups: [
				{key: "A", title: "Group A", headerCheckBoxState: "Checked"},
				{key: "B", title: "Group B", headerCheckBoxState: "Unchecked"},
				{key: "C", title: "Group C", headerCheckBoxState: "Hidden"}
			]
		});

		assert.expect(12);
		var fnDone = assert.async();

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
		oGraph.attachGraphReady(function () {
			var oCheckBox1 = oGraph.getGroups()[0].getAggregation("_checkBox"),
				oCheckBox2 = oGraph.getGroups()[1].getAggregation("_checkBox"),
				oCheckBox3 = oGraph.getGroups()[2].getAggregation("_checkBox");

			assert.notEqual(oCheckBox1.$()[0], null, "CheckBox is rendered");
			assert.notEqual(oCheckBox2.$()[0], null, "CheckBox is rendered");
			assert.equal(oCheckBox3, null, "CheckBox is not rendered");

			assert.equal(oCheckBox1.getSelected(), true, "CheckBox on group 1 os checked");
			assert.equal(oCheckBox2.getSelected(), false, "CheckBox on group 2 os not checked");

			assert.equal(oGraph.getGroups()[0].getHeaderCheckBoxState(), "Checked", "Checkbox is not checked");
			oCheckBox1.setSelected(false);
			assert.equal(oGraph.getGroups()[0].getHeaderCheckBoxState(), "Unchecked", "Checkbox is checked");
			assert.equal(oGraph.getGroups()[2].getHeaderCheckBoxState(), "Hidden", "Checkbox is missing");

			oGraph.getGroups()[0].setHeaderCheckBoxState("Checked");
			assert.equal(oGraph.getGroups()[0].getHeaderCheckBoxState(), "Checked", "Checkbox is checked");
			assert.equal(oCheckBox1.getSelected(), true, "Checkbox is checked");

			oGraph.getGroups()[0].setHeaderCheckBoxState("Unchecked");
			assert.equal(oGraph.getGroups()[0].getHeaderCheckBoxState(), "Unchecked", "Checkbox is checked");
			assert.equal(oCheckBox1.getSelected(), false, "Checkbox is checked");

			fnDone();
			oGraph.destroy();
		});
	});

	QUnit.test("Group checkbox", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{key: 0, title: "Zero", group: "A"},
				{key: 1, title: "Zero", group: "B"}
			],
			groups: [
				{key: "A", title: "Group A"},
				{key: "B", title: "Group B", collapsed: true}
			]
		});

		assert.expect(2);
		var fnDone = assert.async();

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();

		oGraph.attachGraphReady(function () {
			var $icon = oGraph.getGroups()[0].$("collapse"),
				$icon1 = oGraph.getGroups()[1].$("collapse");

			assert.equal($icon.find("span")[0].innerText.charCodeAt(0), 57988, "Group collapse icon");
			assert.equal($icon1.find("span")[0].innerText.charCodeAt(0), 57987, "Group expand icon");

			fnDone();
			oGraph.destroy();
		});
	});

	QUnit.test("isOnScreen", function (assert) {
		var oGroup = new Group();
		oGroup.fX = 10;
		oGroup.fY = 100;
		oGroup._iWidth = 100;
		oGroup._iHeight = 100;

		assert.ok(oGroup._isOnScreen(0, 300, 0, 300), "Group should be on big enough screen.");
		assert.ok(oGroup._isOnScreen(50, 100, 150, 250), "Group should be reported on screen if part of it is there.");
		assert.ok(oGroup._isOnScreen(20, 30, 110, 120), "Group should be reported on screen when larger than screen.");
		assert.notOk(oGroup._isOnScreen(1000, 2000, 1000, 2000), "Group should not be reported on screen when the screen is far away.");
		assert.notOk(oGroup._isOnScreen(0, 300, 300, 400), "Group should not be reported on screen when only one dimension matches.");
	});
});
