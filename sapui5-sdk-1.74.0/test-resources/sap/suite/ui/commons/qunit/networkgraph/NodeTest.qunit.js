sap.ui.define([
	"./TestUtils",
	"jquery.sap.global",
	"sap/m/Link",
	"sap/ui/core/Popup",
	"sap/suite/ui/commons/networkgraph/ActionButton",
	"sap/suite/ui/commons/networkgraph/SvgBase",
	"sap/suite/ui/commons/networkgraph/Node",
	"sap/suite/ui/commons/networkgraph/Graph",
	"sap/suite/ui/commons/networkgraph/ElementAttribute",
	"sap/ui/model/json/JSONModel",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (GraphTestUtils, jQuery, Link, Popup, ActionButton, SvgBase, Node, Graph, ElementAttribute, JSONModel, createAndAppendDiv) {
	"use strict";

	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%; overflow-y: hidden");

	QUnit.module("Network graph nodes");

	QUnit.test("Node events [press, collapseExpand] are fired correctly.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
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
			oNode0 = oGraph.getNodes()[0],
			fnPressDone = assert.async(),
			fnCollapseExpandDone = assert.async(),
			fnGraphReadyDone = assert.async();

		assert.expect(2);
		oGraph.attachGraphReady(function () {
			jQuery(oNode0.getFocusDomRef()).mousedown();
			sap.ui.getCore().applyChanges();
			oNode0.$("actionCollapse").children().click();
			fnGraphReadyDone();
		});
		oNode0.attachPress(function () {
			assert.ok(true, "Press event should fire correctly.");
			fnPressDone();
		});
		oNode0.attachCollapseExpand(function () {
			assert.ok(true, "CollapseExpand event should fire correctly");
			fnCollapseExpandDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	// Action buttons

	function performeActionButtonTest(mOptions) {
		var oGraph, oNode0,
			assert = mOptions.assert,
			fnDone = assert.async();

		if (mOptions.fnGraphFactory) {
			oGraph = mOptions.fnGraphFactory();
		} else {
			oGraph = GraphTestUtils.buildGraph(mOptions.oData);
		}
		oNode0 = oGraph.getNodes()[0];
		assert.expect(mOptions.expect);

		oGraph.attachGraphReady(function () {
			function finish() {
				oGraph.destroy();
				fnDone();
			}

			jQuery(oNode0.getFocusDomRef()).mousedown();
			sap.ui.getCore().applyChanges();
			var oResult = mOptions.fnCheck(oGraph, oNode0);
			if (oResult && typeof oResult.then === "function") {
				oResult.then(finish);
			} else {
				finish();
			}
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	}

	QUnit.test("Default action buttons visible.", function (assert) {
		performeActionButtonTest({
			fnGraphFactory: function () {
				var oGraph = GraphTestUtils.buildGraph({
					nodes: [
						{
							key: 0,
							description: "description"
						},
						{
							key: 1
						}
					],
					lines: [
						{
							from: 0,
							to: 1
						}
					]
				});

				oGraph.getNodes()[0].addActionLink(new Link({text: "link"}));
				return oGraph;
			},
			expect: 4,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				assert.ok(oNode.getDomRef("actionCollapse"), "Collapse button should be rendered.");
				assert.ok(oNode.getDomRef("actionDetail"), "Details button should be rendered.");
				assert.ok(oNode.getDomRef("actionLinks"), "Links button should be rendered.");
				assert.ok(oNode.$("actionButtons").find(".sapSuiteUiCommonsNetworkGraphDivActionButtonDisabled").size() === 0, "All action buttons should be enabled.");
			}
		});
	});

	QUnit.test("Action buttons not visible when disabled.", function (assert) {
		performeActionButtonTest({
			fnGraphFactory: function () {
				return GraphTestUtils.buildGraph({
					nodes: [
						{
							key: 0,
							showExpandButton: false,
							showActionLinksButton: false,
							showDetailButton: false
						}
					]
				});
			},
			expect: 3,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				assert.ok(!oNode.getDomRef("actionCollapse"), "Collapse button should not be visible.");
				assert.ok(!oNode.getDomRef("actionDetail"), "Details button should not be visible.");
				assert.ok(!oNode.getDomRef("actionLinks"), "Links button should not be visible.");
			}
		});
	});

	QUnit.test("Collapse/expand button not enabled for nodes without children.", function (assert) {
		performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0
					}
				]
			},
			expect: 2,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionCollapse");
				assert.ok($button.size() === 1, "Collapse button should be rendered.");
				assert.ok($button.find(".sapSuiteUiCommonsNetworkGraphDivActionButtonDisabled").size() > 0, "Collapse button should be disabled.");
			}
		});
	});

	QUnit.test("Details button not enabled for nodes without any detail.", function (assert) {
		performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0
					}
				]
			},
			expect: 2,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionDetail");
				assert.ok($button.size() === 1, "Detail button should be rendered.");
				assert.ok($button.find(".sapSuiteUiCommonsNetworkGraphDivActionButtonDisabled").size() > 0, "Detail button should be disabled.");
			}
		});
	});

	QUnit.test("Details button enabled for nodes with attributes but without detail.", function (assert) {
		performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0,
						attributes: [
							{
								label: "l",
								value: "v"
							}
						]
					}
				]
			},
			expect: 2,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionDetail");
				assert.ok($button.size() === 1, "Detail button should be rendered.");
				assert.ok($button.find(".sapSuiteUiCommonsNetworkNodeActionButtonDisabled").size() === 0, "Detail button should be enabled.");
			}
		});
	});

	QUnit.test("Detail window opens when user clicks on node's detail button.", function (assert) {
		var openSpy = sinon.spy(Popup.prototype, "open");
		performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0,
						description: "description"
					}
				]
			},
			expect: 1,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionDetail");
				$button.children().click();
				assert.equal(openSpy.callCount, 1, "Tooltip popup should have been opened.");
				openSpy.restore();
			}
		});
	});

	QUnit.test("Details windows does not shows when user clicks on details button when there are no details.", function (assert) {
		var openSpy = sinon.spy(Popup.prototype, "open");
		performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0
					}
				]
			},
			expect: 1,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionDetail");
				$button.children().click();
				assert.equal(openSpy.callCount, 0, "Popup open is not supposed to be called.");
				openSpy.restore();
			}
		});
	});

	QUnit.test("Click on a collapse button collapses a child.", function (assert) {
		performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0
					},
					{
						key: 1
					}
				],
				lines: [
					{
						from: 0,
						to: 1
					}
				]
			},
			expect: 2,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionCollapse"),
					oNode2 = oGraph.getNodes()[1];
				$button.click();
				sap.ui.getCore().applyChanges();
				assert.ok(oNode.getCollapsed(), "Child node should be collapsed.");
				assert.equal(oNode2.$().css("display"), "none", "Child not shouldn't be visible.");
			}
		});
	});

	QUnit.test("Max 4 custom action buttons get rendered.", function (assert) {
		var aActionButtons = [],
			aPressCallbackResults = [];
		for (var i = 0; i < 10; i++) {
			aActionButtons.push(new ActionButton({
				icon: "sap-icon://sap-ui5",
				press: actionButtonPress
			}));
		}

		function actionButtonPress(oEvent) {
			var oSource = oEvent.getSource();
			for (var i = 0; i < 4; i++) {
				if (oSource === aActionButtons[i]) {
					aPressCallbackResults[i] = true;
				}
			}
		}

		performeActionButtonTest({
			fnGraphFactory: function () {
				var oNode = new Node({
					key: 0,
					showExpandButton: false,
					showActionLinksButton: false,
					showDetailButton: false,
					actionButtons: aActionButtons
				});

				return new Graph({
					nodes: [oNode],
					renderType: "Svg"
				});
			},
			expect: 6,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button, i;
				for (i = 0; i < 4; i++) {
					$button = oNode.getActionButtons()[i].$();
					assert.ok($button.get(0), "Action button should be visible.");
					$button.children().click();
				}
				for (i = 0; i < 4; i++) {
					if (!aPressCallbackResults[i]) {
						assert.ok(false, "Action button No. " + i + " wasn't pressed.");
					}
				}
				assert.notOk(aPressCallbackResults[4], "Last button shouldn't be pressed.");
				assert.equal(oNode.$("actionButtons").find("g").size(), 8, "8 action buttons are supposed to be rendered.");
			}
		});
	});

	QUnit.test("Max 8 action buttons get rendered.", function (assert) {
		var aActionButtons = [],
			aPressCallbackResults = [];
		for (var i = 0; i < 8; i++) {
			aActionButtons.push(new ActionButton({
				icon: "sap-icon://sap-ui5",
				press: actionButtonPress
			}));
		}

		function actionButtonPress(oEvent) {
			var oSource = oEvent.getSource();
			for (var i = 0; i < 8; i++) {
				if (oSource === aActionButtons[i]) {
					aPressCallbackResults[i] = true;
				}
			}
		}

		performeActionButtonTest({
			fnGraphFactory: function () {
				var oNode = new Node({
					key: 0,
					actionButtons: aActionButtons
				});

				return new Graph({
					nodes: [oNode],
					renderType: "Svg"
				});
			},
			expect: 5,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button, i;
				$button = oNode.getActionButtons()[0].$();
				assert.ok($button.get(0), "Action button 0 should be visible.");
				$button.children().click();

				for (i = 6; i < 8; i++) {
					$button = oNode.getActionButtons()[i].$();
					assert.notOk($button.get(0), "Action button shouldn't be visible.");
				}
				assert.ok(aPressCallbackResults[0], "First action button should have been pressed");
				for (i = 1; i < 4; i++) {
					if (aPressCallbackResults[i]) {
						assert.ok(false, "Action button No. " + i + " shouldn't have been pressed.");
					}
				}
				assert.equal(oNode.$("actionButtons").find("g").size(), 8, "8 action buttons are supposed to be rendered.");
			}
		});
	});

	QUnit.test("Box nodes with multiline scales better.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "[.......0][.......1] [.......2][.......3] [.......0][.......1] [.......2][.......3]",
						maxWidth: 200
					},
					{
						key: 1,
						title: "[.......0][.......1] [.......2][.......3] [.......0][.......1] [.......2][.......3]",
						titleLineSize: 10,
						maxWidth: 200
					},
					{
						key: 2,
						shape: "Box",
						title: "[.......0][.......1] [.......2][.......3] [.......0][.......1] [.......2][.......3]",
						maxWidth: 200
					},
					{
						key: 3,
						shape: "Box",
						title: "[.......0][.......1] [.......2][.......3] [.......0][.......1] [.......2][.......3]",
						titleLineSize: 10,
						maxWidth: 200
					}
				]
			}),
			oSingleLineNode = oGraph.getNodes()[0],
			oMultiLineNode = oGraph.getNodes()[1],
			fnDone = assert.async(),
			fnAssert = function () {
				assert.ok(oSingleLineNode.$().height() < oMultiLineNode.$().height(), "Multiline title should stretch vertically.");

				// max width for circle nodes
				assert.equal(oSingleLineNode.$().width(), 200, "Width of node");
				assert.equal(oMultiLineNode.$().width(), 200, "Width of node");

				oSingleLineNode = oGraph.getNodes()[2];
				oMultiLineNode = oGraph.getNodes()[3];

				// 2 pixels are borders
				assert.equal(oSingleLineNode.$().width(), 202, "Width of node");
				assert.equal(oMultiLineNode.$().width(), 202, "Width of node");
			};

		assert.expect(5);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
		sap.ui.getCore().applyChanges();
	});

	// Action links

	QUnit.test("Links button not enabled for nodes without any visible links.", function (assert) {
		performeActionButtonTest({
			fnGraphFactory: function () {
				var oGraph = GraphTestUtils.buildGraph({
					nodes: [
						{
							key: 0
						}
					]
				});

				var oLink = new Link({text: "link"});
				oLink.setVisible(false);
				oGraph.getNodes()[0].addActionLink(oLink);
				return oGraph;
			},
			expect: 2,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionLinks");
				assert.ok($button.size() === 1, "Links button should be rendered.");
				assert.ok($button.find(".sapSuiteUiCommonsNetworkGraphDivActionButtonDisabled").size() > 0, "Links button should be disabled.");
			}
		});
	});

	QUnit.test("Links window shows when user clicks on links button.", function (assert) {
		var openSpy = sinon.spy(Popup.prototype, "open");
		performeActionButtonTest({
			fnGraphFactory: function () {
				var oGraph = GraphTestUtils.buildGraph({
					nodes: [
						{
							key: 0
						}
					]
				});

				oGraph.getNodes()[0].addActionLink(new Link({text: "link"}));
				return oGraph;
			},
			expect: 1,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionLinks");
				$button.children().click();
				assert.equal(openSpy.callCount, 1, "Tooltip popup should have been opened.");
				openSpy.restore();
			}
		});
	});

	QUnit.test("Links window does not show when user clicks on links button when there are no links.", function (assert) {
		var openSpy = sinon.spy(Popup.prototype, "open");
		performeActionButtonTest({
			oData: {
				nodes: [
					{
						key: 0
					}
				]
			},
			expect: 1,
			assert: assert,
			fnCheck: function (oGraph, oNode) {
				var $button = oNode.$("actionLinks");
				$button.children().click();
				assert.equal(openSpy.callCount, 0, "Popup open is not supposed to be called.");
				openSpy.restore();
			}
		});
	});

	// multiline
	QUnit.test("Correct multiline calculation.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "TitleA TitleB TitleC TitleD TitleE TitleF TitleG TitleH TitleI TitleJ TitleK",
						titleLineSize: 0,
						width: 140
					},
					{
						key: 1,
						title: "TitleA TitleB TitleC TitleD TitleE TitleF TitleG TitleH TitleI TitleJ TitleK",
						titleLineSize: 2,
						width: 140
					},
					{
						key: 2,
						title: "TitleA TitleB TitleC TitleD TitleE TitleF TitleG TitleH TitleI TitleJ TitleK",
						titleLineSize: 1,
						width: 140
					},
					{
						key: 3,
						title: "TitleATitleBTitleCTitleDTitleETitleFTitleG",
						titleLineSize: 0,
						width: 140
					}
				]
			}),
			fnDone = assert.async(),
			fnAssert = function () {
				var getLines = function (i) {
					var iHeight = oGraph.getNodes()[i].$().find(".sapSuiteUiCommonsNetworkGraphDivNodeTitleText").height / 16;

					if (iHeight < 1.5) {
						return 1;
					}
					if (iHeight < 2.5) {
						return 2;
					}
					if (iHeight < 3.5) {
						return 3;
					}
					if (iHeight < 4.5) {
						return 4;
					}

					return 5;
				};

				assert.ok(getLines(0), 4, "4 lines");
				assert.ok(getLines(1), 2, "2 lines");
				assert.ok(getLines(2), 3, "1 line");
				assert.ok(getLines(3), 1, "1 line");
			};

		assert.expect(4);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	// Width and maxWidth

	QUnit.test("Box nodes respect width property for small content.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title",
						width: 300
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				assert.equal(oNode._iWidth, 300, "Node should have correct width.");
			};

		assert.expect(1);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Box nodes respect width property for big content.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title - Very long title Very long title Very long title Very long title Very long title",
						width: 300
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var iRealWidth = oNode.$().width();
				assert.equal(oNode._iWidth, 300, "Node should have correct width.");
				assert.ok((iRealWidth > 270 && iRealWidth <= 300), "Node should have correct real width.");
			};

		assert.expect(2);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Box nodes respect maxWidth property for big content.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title - Very long title Very long title Very long title Very long title Very long title",
						maxWidth: 300
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var iRealWidth = oNode.$().width();
				assert.equal(oNode._iWidth, 300, "Node should have correct width.");
				assert.ok((iRealWidth > 270 && iRealWidth <= 300), "Node should have correct real width.");
			};

		assert.expect(2);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Width has priority over maxWidth.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title - Very long title Very long title Very long title",
						maxWidth: 300,
						width: 200
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var iRealWidth = oNode.$().width();
				assert.equal(oNode._iWidth, 200, "Node should have correct width.");
				assert.ok((iRealWidth > 170 && iRealWidth <= 200), "Node should have correct real width.");
			};

		assert.expect(2);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	// Icon

	QUnit.test("An icon gets rendered.", function (assert) {
		function testIconPresent(oControl) {
			var $icon = oControl.$().find(".sapSuiteUiCommonsNetworkGraphDivNodeCircleIcon span, .sapSuiteUiCommonsNetworkGraphDivNodeIconTitle span");

			assert.ok($icon[0], "An icon should be in the graph.");
			assert.equal($icon[0].innerText.charCodeAt(0), 0xe21b, "Icon should correct one.");
			assert.equal($icon.css("font-family"), "SAP-icons", "Font family rendered.");
		}

		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						group: "g1",
						icon: "sap-icon://sap-ui5"
					},
					{
						key: 1,
						icon: "sap-icon://sap-ui5",
						shape: "Box"
					}
				],
				groups: [
					{
						key: "g1",
						icon: "sap-icon://sap-ui5"
					}
				]
			}),
			oCircleNode = oGraph.getNodes()[0],
			oBoxNode = oGraph.getNodes()[1],
			fnDone = assert.async(),
			fnAssert = function () {
				testIconPresent(oCircleNode);
				testIconPresent(oBoxNode);
				// so far group is rendered without icon
				// testIconPresent(oGroup);
			};
		oGraph.setRenderType("Html");

		assert.expect(6);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	// Attribute

	QUnit.test("An attribute gets rendered, invisible ones are not.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title",
						icon: "sap-icon://sap-ui5",
						shape: "Box",
						maxWidth: 200,
						attributes: [
							{
								label: "L1",
								value: "V1",
								visible: false
							},
							{
								label: "L2",
								value: "V2",
								visible: true
							},
							{
								label: "L3",
								value: "V3",
								visible: false
							}
						]
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var iRows = oNode.$().find(".sapSuiteUiCommonsNetworkGraphDivNodeAttributesRow").length;
				assert.equal(iRows, 1, "Only one attribute rendered");

				var oAttr = oNode.getVisibleAttributes()[0];

				assert.equal(oAttr.$("label")[0].innerText, "L2", "Correct labels should be rendered.");
				assert.equal(oAttr.$("value")[0].innerText, "V2", "Correct values should be rendered.");
			};

		oGraph.setRenderType("Html");

		assert.expect(3);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.skip("Attributes for nodes with maxWidth are trimmed correctly.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title",
						icon: "sap-icon://sap-ui5",
						maxWidth: 200,
						shape: "Box",
						attributes: [
							{
								value: "Very long value Very long value Very long value Very long value"
							}
						]
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				assert.ok(oNode.getDomRef().getBBox().width <= 100, "Long attribute should be trimmed.");
			};

		assert.expect(1);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	// Invalidate on node

	QUnit.skip("Invalidate on node rerenders content.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title"
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				oNode.setTitle("Title 2");
				sap.ui.getCore().applyChanges();
				assert.equal(oNode.$().find("text.sapSuiteUiCommonsNetworkNodeTitle").text(), "Title 2", "Correct title should be rendered.");
			};

		assert.expect(1);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.skip("Invalidate on node rerenders content on IE.", function (assert) {
		var oStub = sinon.stub(SvgBase.prototype, "_isMSBrowser"),
			oGraph = GraphTestUtils.buildGraph(
				{
					nodes: [
						{
							key: 0,
							title: "Title"
						}
					]
				}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				oNode.setTitle("Title 2");
				sap.ui.getCore().applyChanges();
				assert.equal(oNode.$().find("text.sapSuiteUiCommonsNetworkNodeTitle").text(), "Title 2", "Correct title should be rendered.");
				oStub.restore();
			};

		assert.expect(1);
		oStub.returns(true);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.skip("Invalidate on box node rerenders content on IE.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title",
						shape: "Box",
						attributes: [
							{
								label: "L1",
								value: "V1"
							},
							{
								label: "L2",
								value: "V2"
							}
						]
					}
				]
			}),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				// dy is ie specific fix so it will differ from other browsers.
				var sOriginalHtml = oNode.$().outerHTML().replace(/(\s)?dy="[^"]*"/, ""),
					oStub = sinon.stub(SvgBase.prototype, "_isMSBrowser");
				oStub.returns(true);
				oNode.invalidate();
				sap.ui.getCore().applyChanges();
				assert.equal(oNode.$().outerHTML().replace(/(\s)?dy="[^"]*"/, ""), sOriginalHtml, "HTML after invalidate shouldn't change.");
				oStub.restore();
			};

		assert.expect(1);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Status is set even without parent graph", function (assert) {
		var sStatus = "testStatus";
		var oNode = new Node({
			key: 0,
			status: sStatus
		});

		assert.equal(oNode.getStatus(), sStatus, "Status should be correctly set");
	});

	QUnit.test("Node is rendered correctly when attributes are updated after the graph is rendered", function (assert) {
		var fnDone = assert.async(),
			oModel = new JSONModel({
				nodes: [
					{
						key: 0,
						title: "Test title"
					}
				]
			}),
			oNewData = {
				nodes: [
					{
						attributes: [
							{
								label: "Test label",
								value: "Test value"
							}
						]
					}
				]
			},
			oGraph = new Graph({
				renderType: "Svg",
				nodes: {
					path: "/nodes",
					template: new Node({
						key: "{key}",
						title: "{title}",
						shape: "Box",
						attributes: {
							path: "attributes",
							template: new ElementAttribute({
								label: "{label}",
								value: "{value}"
							})
						}
					})
				}
			}),
			bFirstPass = true,
			iOriginalHeight;

		oGraph.setModel(oModel);
		assert.expect(2);
		oGraph.attachGraphReady(function () {
			if (bFirstPass) {
				iOriginalHeight = oGraph.getNodes()[0].getDomRef("innerBox").getBoundingClientRect().height;
				oModel.setData(oNewData, true);
				sap.ui.getCore().applyChanges();
				assert.notOk(oGraph.getNodes()[0].getDomRef("innerBox")); //Node should be gone from the dom as invalidate should have been triggered
				bFirstPass = false;
			} else {
				var iNewHeight = oGraph.getNodes()[0].getDomRef("innerBox").getBoundingClientRect().height;
				assert.ok(iOriginalHeight < iNewHeight, "Height after attributes are bound should be bigger. Befor height: " + iOriginalHeight + " after height: " + iNewHeight);
				oGraph.destroy();
				fnDone();
			}
		});
		oGraph.placeAt("content");
	});

	QUnit.test("Node is rendered correctly when in HTML rendering mode.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, group: 1}, {key: 1, group: 2}
				],
				lines: [
					{from: 0, to: 1}
				],
				groups: [
					{key: 1}, {key: 2, collapsed: true}
				]
			}),
			fnAssert = function () {
				assert.ok(true, "Node should be rendered correctly.");
			},
			fnDone = assert.async();

		assert.expect(1);
		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Visibility tests", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{
						"key": 0,
						"title": "0",
						"icon": "sap-icon://checklist",
						"status": "Error",
						"visible": true
					},
					{
						"key": 1,
						"title": "1",
						"icon": "sap-icon://checklist",
						"status": "Error",
						"visible": false
					},
					{
						"key": 2,
						"title": "2",
						"icon": "sap-icon://checklist",
						"status": "Error",
						"visible": true
					},
					{
						"key": 3,
						"title": "3",
						"icon": "sap-icon://checklist",
						"status": "Error",
						"group": "F"
					}],
				lines: [
					{
						"from": 0,
						"to": 1,
						"visible": false
					},
					{
						"from": 0,
						"to": 1,
						"visible": true
					},
					{
						"from": 2,
						"to": 3
					}
				],
				groups: [
					{
						"key": "F",
						"title": "Farmer",
						"visible": false,
						"collapsed": false
					}
				]
			}),
			fnDone = assert.async();

		oGraph.setRenderType("Html");

		oGraph.placeAt("content");
		assert.expect(11);

		// GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
		oGraph.attachGraphReady(function () {
			// nodes rendered
			var aNodes = this.getNodes(),
				aLines = this.getLines(),
				aGroups = this.getGroups();

			assert.ok(aNodes[0].$().is(":visible"), "node 0 - visible");
			assert.ok(aNodes[1].$().is(":hidden"), "node 1 - hidden");
			assert.ok(aNodes[2].$().is(":visible"), "node 2 - visible");
			assert.ok(aNodes[3].$().is(":hidden"), "node 3 - hidden");

			aNodes[1].setVisible(true);
			sap.ui.getCore().applyChanges();
			assert.ok(aNodes[1].$().is(":visible"), "node 1 - visible");

			// groups
			assert.equal(aGroups[0].$().length, 0, "group not rendered");

			this.getGroups()[0].setVisible(true);
			sap.ui.getCore().applyChanges();

			assert.equal(aGroups[0].$().length, 1, "group not rendered");
			assert.ok(aNodes[3].$().is(":visible"), "node 3 - visible");

			// lines
			assert.equal(aLines[0].$().css("display"), "none", "line 0 - hidden");
			assert.ok(aLines[1].$().is(":visible"), "line 1 - visible");

			aLines[0].setVisible(true);
			sap.ui.getCore().applyChanges();
			assert.ok(aLines[0].$().is(":visible"), "line 0 - visible");

			fnDone();
			oGraph.destroy();
		});
	});

	QUnit.test("isOnScreen", function (assert) {
		var oNode = new Node({
			x: 10,
			y: 100
		});
		oNode._iWidth = 100;
		oNode._iHeight = 100;

		assert.ok(oNode._isOnScreen(0, 300, 0, 300), "Node should be on big enough screen.");
		assert.ok(oNode._isOnScreen(50, 100, 150, 250), "Node should be reported on screen if part of it is there.");
		assert.ok(oNode._isOnScreen(20, 30, 110, 120), "Node should be reported on screen when larger than screen.");
		assert.notOk(oNode._isOnScreen(1000, 2000, 1000, 2000), "Node should not be reported on screen when the screen is far away.");
		assert.notOk(oNode._isOnScreen(0, 300, 300, 400), "Node should not be reported on screen when only one dimension matches.");
	});

	QUnit.test("icon size", function (assert) {
		var fnDone = assert.async();

		var oGraph = GraphTestUtils.buildGraph({
			nodes: [
				{
					"key": 0,
					"icon": "sap-icon://checklist",
					"iconSize": 45
				}]
		});
		oGraph.placeAt("content");
		assert.expect(1);

		oGraph.attachGraphReady(function () {
			assert.ok(oGraph.getNodes()[0].$().find(".sapSuiteUiCommonsNetworkGraphIcon").css("font-size"), "45px");
			fnDone();
			oGraph.destroy();
		});
	});

	QUnit.test("Attributes - invalidate", function (assert) {
		var fnDone = assert.async();

		var oGraph = GraphTestUtils.buildGraph(
			{
				nodes: [
					{
						key: 0,
						title: "Title",
						icon: "sap-icon://sap-ui5",
						shape: "Box",
						maxWidth: 200,
						attributes: [
							{
								label: "L1",
								value: "V1",
								visible: true
							}
						]
					}
				]
			});

		oGraph.placeAt("content");
		assert.expect(2);

		oGraph.attachGraphReady(function () {
			var oAttr = oGraph.getNodes()[0].getAttributes()[0],
				$attr = oAttr.$();

			var sLbl = $attr.find(".sapSuiteUiCommonsNetworkGraphDivNodeLabels span").text();
			assert.equal(sLbl, "L1", "1");

			oAttr.setLabel("CHANGED");
			sap.ui.getCore().applyChanges();

			assert.equal(oGraph.getNodes()[0].getAttributes()[0].$().find(".sapSuiteUiCommonsNetworkGraphDivNodeLabels").text(), "CHANGED", "2");
			fnDone();
			oGraph.destroy();
		});
	});
});
