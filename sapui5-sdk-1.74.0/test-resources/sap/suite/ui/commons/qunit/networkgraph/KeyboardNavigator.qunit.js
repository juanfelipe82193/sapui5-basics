sap.ui.define([
	"jquery.sap.global",
	"./TestUtils",
	"sap/suite/ui/commons/networkgraph/layout/NoopLayout",
	"sap/suite/ui/commons/networkgraph/SvgBase",
	"sap/suite/ui/commons/networkgraph/Group",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (jQuery, GraphTestUtils, NoopLayout, SvgBase, Group, createAndAppendDiv) {
	"use strict";

	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%; overflow-y: hidden");

	QUnit.module("Network graph keyboard navigator");

	function FakeEvent(oGraph, mParameters) {
		var sKey;
		this._bPreventDefaultCalled = false;
		this._bStopPropagationCalled = false;
		this.target = oGraph._oKeyboardNavigator._oWrapperDom;
		if (mParameters) {
			for (sKey in mParameters) {
				if (mParameters.hasOwnProperty(sKey)) {
					this[sKey] = mParameters[sKey];
				}
			}
		}
	}

	FakeEvent.prototype.preventDefault = function () {
		this._bPreventDefaultCalled = true;
	};

	FakeEvent.prototype.stopPropagation = function () {
		this._bStopPropagationCalled = true;
	};

	function createTabEvent(oGraph) {
		return new FakeEvent(oGraph, {
			key: "Tab",
			keyCode: jQuery.sap.KeyCodes.TAB
		});
	}

	function createSpaceEvent(oGraph) {
		return new FakeEvent(oGraph, {
			key: "Space",
			keyCode: jQuery.sap.KeyCodes.SPACE
		});
	}

	function createKeyDownEvent(oGraph, sKey) {
		return new FakeEvent(oGraph, {
			key: sKey,
			keyCode: jQuery.sap.KeyCodes[sKey.toUpperCase()]
		});
	}

	function createPageDownEvent(oGraph) {
		return new FakeEvent(oGraph, {
			key: "PageDown",
			keyCode: jQuery.sap.KeyCodes.PAGE_DOWN
		});
	}

	function createPageUpEvent(oGraph) {
		return new FakeEvent(oGraph, {
			key: "PageUp",
			keyCode: jQuery.sap.KeyCodes.PAGE_UP
		});
	}

	function createHomeEvent(oGraph) {
		return new FakeEvent(oGraph, {
			key: "Home",
			keyCode: jQuery.sap.KeyCodes.HOME
		});
	}

	function createEndEvent(oGraph) {
		return new FakeEvent(oGraph, {
			key: "End",
			keyCode: jQuery.sap.KeyCodes.END
		});
	}

	function buildNoopGraph(oData) {
		var oGraph = GraphTestUtils.buildGraph(oData);
		oGraph.setLayoutAlgorithm(new NoopLayout());
		return oGraph;
	}

	function buildNodeOnlyGraph() {
		return buildNoopGraph({
			nodes: [
				{key: 0, title: "Node 0", x: 0, y: 0},
				{key: 1, title: "Node 1", x: 100, y: 0}
			]
		});
	}

	function buildSimpleGraph() {
		return buildNoopGraph({
			nodes: [
				{key: 0, title: "Node 0", x: 0, y: 0},
				{key: 1, title: "Node 1", x: 100, y: 0}
			],
			lines: [
				{from: 0, to: 1}
			]
		});
	}

	function buildSingleNodeGraph() {
		return buildNoopGraph({
			nodes: [{
				key: 0,
				title: "Node 0",
				x: 0,
				y: 0
			}]
		});
	}

	function buildSubzeroGroupGraph() {
		return GraphTestUtils.buildGraph({
			nodes: [
				{key: -1, title: "Node -1"},
				{key: 0, title: "Node 0"},
				{key: 1, title: "Node 1", group: "A"}
			],
			lines: [
				{from: 0, to: 1}
			],
			groups: [
				{key: "A", title: "Group A"}
			]
		});
	}

	function hasButtonFocus(oButtonDom) {
		return jQuery(oButtonDom).hasClass(SvgBase.prototype.FOCUS_CLASS);
	}

	QUnit.test("Tab focuses element", function (assert) {
		var oGraph = buildSingleNodeGraph(),
			fnDone = assert.async(),
			fnAssert = function () {
				var oEvent = createTabEvent(oGraph),
					oNode, oFocus;
				oGraph._oKeyboardNavigator.onsaptabnext(oEvent);
				oNode = oGraph.getNodes()[0];
				assert.ok(oNode._hasFocus(), "The only node should have focus.");
				oFocus = oGraph.getFocus();
				assert.equal(oFocus.item, oNode, "The graph should assert the only node has focus.");
				assert.equal(oFocus.button, null, "The graph should assert no button has focus.");
			};

		assert.expect(3);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Zooming keys: Zero, Plus, Slash/Minus", function (assert) {
		var oGraph = buildSingleNodeGraph(),
			fnDone = assert.async(),
			fnAssert = function () {
				var oNav = oGraph._oKeyboardNavigator;

				oGraph.getNodes()[0]._mouseDown(false);
				assert.equal(oGraph._fZoomLevel, 1, "Graph should be zoomed to 100%");

				// Zoom in twice
				oNav.onkeydown(new FakeEvent(oGraph, {
					key: "NumpadAdd",
					keyCode: jQuery.sap.KeyCodes.NUMPAD_PLUS,
					ctrlKey: true
				}));
				assert.equal(oGraph._fZoomLevel, 1.1, "Graph should be zoomed to 110%");
				oNav.onkeydown(new FakeEvent(oGraph, {key: "+", keyCode: jQuery.sap.KeyCodes.PLUS, ctrlKey: true}));
				assert.equal(oGraph._fZoomLevel, 1.25, "Graph should be zoomed to 125%");

				oNav.onkeydown(new FakeEvent(oGraph, {
					key: "Digit0",
					keyCode: jQuery.sap.KeyCodes.DIGIT_0,
					ctrlKey: true
				}));
				assert.equal(oGraph._fZoomLevel, 1, "Graph should be zoomed to 100%");

				// Zoom out twice
				oNav.onkeydown(new FakeEvent(oGraph, {
					key: "NumpadSubstract",
					keyCode: jQuery.sap.KeyCodes.NUMPAD_MINUS,
					ctrlKey: true
				}));
				assert.equal(oGraph._fZoomLevel, 0.9, "Graph should be zoomed to 90%");
				oNav.onkeydown(new FakeEvent(oGraph, {key: "-", keyCode: jQuery.sap.KeyCodes.SLASH, ctrlKey: true}));
				assert.equal(oGraph._fZoomLevel, 0.8, "Graph should be zoomed to 80%");

				oNav.onkeydown(new FakeEvent(oGraph, {
					key: "Numpad0",
					keyCode: jQuery.sap.KeyCodes.NUMPAD_0,
					ctrlKey: true
				}));
				assert.equal(oGraph._fZoomLevel, 1, "Graph should be zoomed to 100%");
			};

		assert.expect(7);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Enter on node pops up action buttons and hide already visible action button of other nodes.", function (assert) {
		var oGraph = buildSubzeroGroupGraph(),
			fnDone = assert.async(),
			fnAssertBtnsVisibility = function (sVisibility) {
				assert.equal(
					(oGraph.getNodes()[0].hasVisibleActionButtons() ? "T" : "F")
					+ (oGraph.getNodes()[1].hasVisibleActionButtons() ? "T" : "F")
					+ (oGraph.getNodes()[2].hasVisibleActionButtons() ? "T" : "F"),
					sVisibility,
					"Buttons should have visibility '" + sVisibility + "'.");
			},
			fnAssert = function () {
				var oNav = oGraph._oKeyboardNavigator,
					oEvent = createTabEvent(oGraph),
					fnTabChain = function (n) {
						for (var i = 0; i < n; i++) {
							oNav.onsaptabnext(oEvent);
						}
					};

				oGraph.getNodes()[0]._mouseDown(false);
				oNav.onsapenter();
				fnAssertBtnsVisibility("FFF");
				oNav.onsapenter();
				fnAssertBtnsVisibility("TFF");
				fnTabChain(5);
				oNav.onsapenter();
				fnAssertBtnsVisibility("FFT");
				oNav.onsapenter();
				oNav.onsapenter();
				fnAssertBtnsVisibility("FFT");
				fnTabChain(3);
				oNav.onsapenter();
				fnAssertBtnsVisibility("FFT");
			};

		assert.expect(5);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Space selects element exclusively, Space + Ctrl inclusively, Ctrl + A selects all", function (assert) {
		var oGraph = buildSimpleGraph(),
			fnDone = assert.async(),
			fnAssertSelections = function (sExpected) {
				assert.equal(
					GraphTestUtils.getNodesSelectionFingerprint(oGraph) + "/" + GraphTestUtils.getLinesSelectionFingerprint(oGraph),
					sExpected,
					"Selections on nodes/lines should be: " + sExpected);
			},
			fnAssert = function () {
				var oEvent = createSpaceEvent(oGraph),
					oTabEvent = createTabEvent(oGraph),
					oCtrlAEvent = createKeyDownEvent(oGraph, "A");

				oCtrlAEvent.ctrlKey = true;

				oGraph.getNodes()[0]._mouseDown(false);
				fnAssertSelections("TF/F");
				oGraph._oKeyboardNavigator.onsapspace(oEvent);
				fnAssertSelections("FF/F");
				oGraph._oKeyboardNavigator.onsaptabnext(oTabEvent);
				oGraph._oKeyboardNavigator.onsapspace(oEvent);
				fnAssertSelections("FT/F");
				oGraph._oKeyboardNavigator.onsaptabnext(oTabEvent);
				oEvent.ctrlKey = true;
				oGraph._oKeyboardNavigator.onsapspacemodifiers(oEvent);
				fnAssertSelections("FT/T");
				oGraph._oKeyboardNavigator.onsapspace(oEvent);
				fnAssertSelections("FF/F");
				oGraph._oKeyboardNavigator.onkeydown(oCtrlAEvent);
				fnAssertSelections("TT/T");
			};

		assert.expect(6);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Prevent default is called", function (assert) {
		var oGraph = buildSingleNodeGraph(),
			fnDone = assert.async(),
			fnAssert = function () {
				var oEvent = createTabEvent(oGraph);
				oGraph._oKeyboardNavigator.onsaptabnext(oEvent);
				assert.ok(oEvent._bPreventDefaultCalled, "Prevent default should have been called.");
			};

		assert.expect(1);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Shift+Tab focuses element", function (assert) {
		var oGraph = buildSingleNodeGraph(),
			fnDone = assert.async(),
			fnAssert = function () {
				var oEvent = createTabEvent(oGraph),
					oNode, oFocus;
				oGraph._oKeyboardNavigator.onsaptabprevious(oEvent);
				oNode = oGraph.getNodes()[0];
				assert.ok(oNode._hasFocus(), "The only node should have focus.");
				oFocus = oGraph.getFocus();
				assert.equal(oFocus.item, oNode, "The graph should assert the only node has focus.");
				assert.equal(oFocus.button, null, "The graph should assert no button has focus.");
			};

		assert.expect(3);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Click on node focuses the node", function (assert) {
		var oGraph = buildSingleNodeGraph(),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var oFocus;
				oNode._mouseDown(false);
				assert.ok(oNode._hasFocus(), "Node should have focus.");
				oFocus = oGraph.getFocus();
				assert.equal(oFocus.item, oNode, "The graph should assert the only node has focus.");
				assert.equal(oFocus.button, null, "The graph should assert no button has focus.");
			};

		assert.expect(3);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Tab moves focus away from graph", function (assert) {
		var oGraph = buildSingleNodeGraph(),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var oEvent = createTabEvent(oGraph),
					oFocus;
				oGraph._oKeyboardNavigator.onsaptabnext(oEvent);
				oEvent = createTabEvent(oGraph);
				oGraph._oKeyboardNavigator.onsaptabnext(oEvent);
				assert.ok(!oNode._hasFocus(), "The node should not have a focus.");
				assert.ok(!oEvent._bPreventDefaultCalled, "Prevent default on event should not be called.");
				oFocus = oGraph.getFocus();
				assert.equal(oFocus.item, null, "The graph should assert no node has focus.");
				assert.equal(oFocus.button, null, "The graph should assert no button has focus.");
			};

		assert.expect(4);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Shift+Tab moves focus away from graph", function (assert) {
		var oGraph = buildSingleNodeGraph(),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var oEvent = createTabEvent(oGraph),
					oFocus;
				oGraph._oKeyboardNavigator.onsaptabnext(oEvent);
				oEvent = createTabEvent(oGraph);
				oGraph._oKeyboardNavigator.onsaptabprevious(oEvent);
				assert.ok(!oNode._hasFocus(), "The node should not have a focus.");
				assert.ok(!oEvent._bPreventDefaultCalled, "Prevent default on event should not be called.");
				oFocus = oGraph.getFocus();
				assert.equal(oFocus.item, null, "The graph should assert no node has focus.");
				assert.equal(oFocus.button, null, "The graph should assert no button has focus.");
			};

		assert.expect(4);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Tab moves focus to action buttons if visible", function (assert) {
		var oGraph = buildSingleNodeGraph(),
			oNode = oGraph.getNodes()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var oEvent = createTabEvent(oGraph),
					oFocus, oButton;
				oNode._mouseDown(false);
				oGraph._oKeyboardNavigator.onsaptabnext(oEvent);
				assert.ok(!oNode._hasFocus(), "The node should not have a focus.");
				oButton = oNode.getEnabledActionButtons()[0];
				assert.ok(hasButtonFocus(oButton), "Detail button should have a focus.");
				oFocus = oGraph.getFocus();
				assert.equal(oFocus.item, oNode, "The graph should assert some button of the first node has focus.");
				assert.equal(oFocus.button, oButton, "The graph should assert the first button of the first node has focus.");
			};

		assert.expect(4);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Tab moves focus through all buttons", function (assert) {
		var oGraph = buildSimpleGraph(),
			oNode = oGraph.getNodes()[0],
			oNode2 = oGraph.getNodes()[1],
			fnDone = assert.async(),
			fnAssert = function () {
				var oEvent = createTabEvent(oGraph),
					oFocus, oButton;
				oNode._mouseDown(false);

				oGraph._oKeyboardNavigator.onsaptabnext(oEvent);
				assert.ok(!oNode._hasFocus(), "First node should not have a focus.");
				assert.ok(!oNode2._hasFocus(), "Second node should not have a focus.");
				assert.ok(hasButtonFocus(oNode.getEnabledActionButtons()[0]), "Collapse button should have a focus.");
				assert.ok(!hasButtonFocus(oNode.getEnabledActionButtons()[1]), "Detail button should not have a focus.");
				oFocus = oGraph.getFocus();
				oButton = oNode.getEnabledActionButtons()[0];
				assert.equal(oFocus.item, oNode, "The graph should assert some button of the first node has focus.");
				assert.equal(oFocus.button, oButton, "The graph should assert the first button of the first node has focus.");

				oEvent = createTabEvent(oGraph);
				oGraph._oKeyboardNavigator.onsaptabnext(oEvent);
				assert.ok(!oNode._hasFocus(), "First node should not have a focus.");
				assert.ok(!oNode2._hasFocus(), "Second node should not have a focus.");
				assert.ok(!hasButtonFocus(oNode.getEnabledActionButtons()[0]), "Collapse button should not have a focus.");
				assert.ok(hasButtonFocus(oNode.getEnabledActionButtons()[1]), "Detail button should have a focus.");
				oFocus = oGraph.getFocus();
				oButton = oNode.getEnabledActionButtons()[1];
				assert.equal(oFocus.item, oNode, "The graph should assert some button of the first node has focus.");
				assert.equal(oFocus.button, oButton, "The graph should assert the second button of the first node has focus.");
			};

		assert.expect(12);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Tab moves focus from action button to a node", function (assert) {
		var oGraph = buildNodeOnlyGraph(),
			oNode = oGraph.getNodes()[0],
			oNode2 = oGraph.getNodes()[1],
			fnDone = assert.async(),
			fnAssert = function () {
				var oEvent = createTabEvent(oGraph),
					oFocus;
				oNode._mouseDown(false);
				oGraph._oKeyboardNavigator.onsaptabnext(oEvent);
				oEvent = createTabEvent(oGraph);
				oGraph._oKeyboardNavigator.onsaptabnext(oEvent);
				assert.ok(!oNode._hasFocus(), "First node should not have a focus.");
				assert.ok(!hasButtonFocus(oNode.getEnabledActionButtons()[0]), "Detail button should not have a focus.");
				assert.ok(oNode2._hasFocus(), "Second node should have a focus.");
				oFocus = oGraph.getFocus();
				assert.equal(oFocus.item, oNode2, "The graph should assert the second node has focus.");
				assert.equal(oFocus.button, null, "The graph should assert no button has focus.");
			};

		assert.expect(5);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Tab focuses first element", function (assert) {
		var oGraph = buildNodeOnlyGraph(),
			fnDone = assert.async(),
			fnAssert = function () {
				var oEvent = createTabEvent(oGraph),
					oFocus;
				oGraph._oKeyboardNavigator.onsaptabnext(oEvent);
				assert.ok(oGraph.getNodes()[0]._hasFocus(), "The first node should have a focus.");
				assert.ok(!oGraph.getNodes()[1]._hasFocus(), "The second node should not have a focus.");
				oFocus = oGraph.getFocus();
				assert.equal(oFocus.item, oGraph.getNodes()[0], "The graph should assert the first node has focus.");
				assert.equal(oFocus.button, null, "The graph should assert no button has focus.");
			};

		assert.expect(4);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Shift+Tab focuses last element", function (assert) {
		var oGraph = buildNodeOnlyGraph(),
			fnDone = assert.async(),
			fnAssert = function () {
				var oEvent = createTabEvent(oGraph),
					oFocus;
				oGraph._oKeyboardNavigator.onsaptabprevious(oEvent);
				assert.ok(oGraph.getNodes()[1]._hasFocus(), "The last node should have a focus.");
				assert.ok(!oGraph.getNodes()[0]._hasFocus(), "The first node should not have a focus.");
				oFocus = oGraph.getFocus();
				assert.equal(oFocus.item, oGraph.getNodes()[1], "The graph should assert the second node has focus.");
				assert.equal(oFocus.button, null, "The graph should assert no button has focus.");
			};

		assert.expect(4);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Going backwards with Shift+Tab over all types of elements and buttons", function (assert) {
		var oGraph = buildSubzeroGroupGraph(),
			oNode0 = oGraph.getNodes()[0],
			oNode1 = oGraph.getNodes()[1],
			oNode2 = oGraph.getNodes()[2],
			oLine = oGraph.getLines()[0],
			oGroup = oGraph.getGroups()[0],
			fnDone = assert.async(),
			fnAssert = function () {
				var oEvent = createTabEvent(oGraph),
					oNav = oGraph._oKeyboardNavigator,
					oFocus = null,
					fnTabChain = function (n) {
						for (var i = 0; i < n; i++) {
							oNav.onsaptabnext(oEvent);
						}
						oFocus = oGraph.getFocus();
					},
					fnBackTabChain = function (n) {
						for (var i = 0; i < n; i++) {
							oNav.onsaptabprevious(oEvent);
						}
						oFocus = oGraph.getFocus();
					};

				// Prepare situation where we have focus one step 'behind' the graph and button of node 0 are visible
				oNode1._mouseDown(false);
				fnTabChain(3);
				oNav.onsapenter();
				fnTabChain(1);
				assert.ok(
					oFocus.item === oNode2 && oFocus.button === oNode2.getEnabledActionButtons()[0],
					"We should stand at the node '1' with detail button focused.");
				fnTabChain(2);
				assert.ok(
					oFocus.item === null && oFocus.button === null,
					"We should stand a step behind the graph.");

				// Now go back till the beginning and check the situation from time to time
				fnBackTabChain(1);
				assert.ok(
					oFocus.item === oLine && oFocus.button === null,
					"The line should be focused, with no button referenced.");
				fnBackTabChain(1);
				assert.ok(
					oFocus.item === oNode2 && oFocus.button === oNode2.getEnabledActionButtons()[0],
					"The detail button of the node '1' should be focused.");
				fnBackTabChain(2);
				oNav.onsapenter();
				fnTabChain(2);
				assert.ok(
					oFocus.item === oNode1 && oFocus.button === oNode1.getEnabledActionButtons()[1],
					"The detail button of the node '0' should be focused.");
				fnBackTabChain(1);
				assert.ok(
					oFocus.item === oNode1 && oFocus.button === oNode1.getEnabledActionButtons()[0],
					"The collapse button of the node '0' should be focused.");
				fnBackTabChain(2);
				assert.ok(
					oFocus.item === oGroup && oFocus.button === Group.BUTTONS.COLLAPSE,
					"The collapse button of the group should be focused.");
				fnBackTabChain(1);
				assert.ok(
					oFocus.item === oGroup && oFocus.button === Group.BUTTONS.MENU,
					"The menu button of the group should be focused.");
				fnBackTabChain(1);
				assert.ok(
					oFocus.item === oNode0 && oFocus.button === null,
					"Node '-1' should be finally focused.");
				oNav.onsapenter();
				fnTabChain(6); // Ten Tabs should get us to the last element here - the line
				assert.ok(
					oFocus.item === oLine && oFocus.button === null,
					"We should be at the last element - the mighty line.");
			};

		assert.expect(10);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Page Down, Page Up, Alt + Page Down, Alt + Page Up, Home, End, Ctrl + Home, Ctrl + End, Arrows", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "UL"}, {key: 1, title: "UR"},
					{key: 2, title: "LL"}, {key: 3, title: "LR"}
				],
				lines: [
					{from: 0, to: 1},
					{from: 0, to: 2}, {from: 1, to: 3},
					{from: 2, to: 3}
				]
			}),
			aNodes = oGraph.getNodes(),
			aLines = oGraph.getLines(),
			aItems = [
				[aNodes[0], aLines[0], aNodes[1]],
				[aLines[1], null, aLines[2]],
				[aNodes[2], aLines[3], aNodes[3]]
			],
			fnDone = assert.async(),
			fnCheckElemFocus = function (oElement) {
				assert.equal(oGraph.getFocus().item.getKey(), oElement.getKey(), "Focus should be on element '" + oElement.getKey() + "'.");
			},
			fnAssert = function () {
				var oPgDownEvent = createPageDownEvent(oGraph),
					oPgUpEvent = createPageUpEvent(oGraph),
					oHomeEvent = createHomeEvent(oGraph),
					oEndEvent = createEndEvent(oGraph),
					oNav = oGraph._oKeyboardNavigator;

				oGraph._oKeyboardNavigator.setItems(aItems);
				oGraph._oKeyboardNavigator.setPageSize(2);

				// All the way down to the botton right corner of the matrix...
				aNodes[0]._mouseDown(false);
				oNav.onsappagedown(oPgDownEvent);
				fnCheckElemFocus(aNodes[2]);
				oNav.onsappagedown(oPgDownEvent);
				fnCheckElemFocus(aLines[3]);
				oNav.onsappagedown(oPgDownEvent);
				fnCheckElemFocus(aLines[2]);
				oNav.onsappagedown(oPgDownEvent);
				fnCheckElemFocus(aNodes[3]);
				// One more just to be sure
				oNav.onsappagedown(oPgDownEvent);
				fnCheckElemFocus(aNodes[3]);

				// ...and back up to the start
				oNav.onsappageup(oPgUpEvent);
				fnCheckElemFocus(aNodes[1]);
				oNav.onsappageup(oPgUpEvent);
				fnCheckElemFocus(aLines[0]);
				oNav.onsappageup(oPgUpEvent);
				fnCheckElemFocus(aLines[1]);
				oNav.onsappageup(oPgUpEvent);
				fnCheckElemFocus(aNodes[0]);
				// One more just to be sure
				oNav.onsappageup(oPgUpEvent);
				fnCheckElemFocus(aNodes[0]);

				// And now we go right sideways, again to the botton right corner of the matrix...
				oPgDownEvent.altKey = true;
				oNav.onsappagedownmodifiers(oPgDownEvent);
				fnCheckElemFocus(aNodes[1]);
				oNav.onsappagedownmodifiers(oPgDownEvent);
				fnCheckElemFocus(aLines[2]);
				oNav.onsappagedownmodifiers(oPgDownEvent);
				fnCheckElemFocus(aLines[3]);
				oNav.onsappagedownmodifiers(oPgDownEvent);
				fnCheckElemFocus(aNodes[3]);
				// One more just to be sure
				oNav.onsappagedownmodifiers(oPgDownEvent);
				fnCheckElemFocus(aNodes[3]);

				// ...and sideways left back to the start
				oPgUpEvent.altKey = true;
				oNav.onsappageupmodifiers(oPgUpEvent);
				fnCheckElemFocus(aNodes[2]);
				oNav.onsappageupmodifiers(oPgUpEvent);
				fnCheckElemFocus(aLines[1]);
				oNav.onsappageupmodifiers(oPgUpEvent);
				fnCheckElemFocus(aLines[0]);
				oNav.onsappageupmodifiers(oPgUpEvent);
				fnCheckElemFocus(aNodes[0]);
				// One more just to be sure
				oNav.onsappageupmodifiers(oPgUpEvent);
				fnCheckElemFocus(aNodes[0]);

				// Circle the matrix around edges clockwise
				oNav.onsapend(oEndEvent);
				fnCheckElemFocus(aNodes[1]);
				oEndEvent.ctrlKey = true;
				oNav.onsapendmodifiers(oEndEvent);
				fnCheckElemFocus(aNodes[3]);
				oNav.onsaphome(oHomeEvent);
				fnCheckElemFocus(aNodes[2]);
				oHomeEvent.ctrlKey = true;
				oNav.onsaphomemodifiers(oHomeEvent);
				fnCheckElemFocus(aNodes[0]);

				// Circle the matrix around edges counter-clockwise
				oNav.onsapendmodifiers(oEndEvent);
				fnCheckElemFocus(aNodes[2]);
				oNav.onsapend(oEndEvent);
				fnCheckElemFocus(aNodes[3]);
				oNav.onsaphomemodifiers(oHomeEvent);
				fnCheckElemFocus(aNodes[1]);
				oNav.onsaphome(oHomeEvent);
				fnCheckElemFocus(aNodes[0]);

				// Arrows
				oNav.onsapright(new FakeEvent(oGraph, {key: "ArrowRight", keyCode: jQuery.sap.KeyCodes.ARROW_RIGHT}));
				fnCheckElemFocus(aLines[0]);
				oNav.onsapdown(new FakeEvent(oGraph, {key: "ArrowDown", keyCode: jQuery.sap.KeyCodes.ARROW_DOWN}));
				fnCheckElemFocus(aLines[3]);
				oNav.onsapleft(new FakeEvent(oGraph, {key: "ArrowLeft", keyCode: jQuery.sap.KeyCodes.ARROW_LEFT}));
				fnCheckElemFocus(aNodes[2]);
				oNav.onsapup(new FakeEvent(oGraph, {key: "ArrowUp", keyCode: jQuery.sap.KeyCodes.ARROW_UP}));
				fnCheckElemFocus(aLines[1]);
			};

		assert.expect(32);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Any invisible/hidden element is never navigable and vice versa", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "0"},
					{key: 1, title: "1"},
					{key: 2, title: "2", group: "A"},
					{key: 3, title: "3", group: "A"}
				],
				lines: [
					{from: 0, to: 1},
					{from: 1, to: 2},
					{from: 2, to: 3}
				],
				groups: [
					{key: "A", title: "Group A"}
				]
			}),
			fnDone = assert.async(),
			fnCheckElemFocus = function (sDescription, oElement) {
				if (!oElement) {
					assert.equal(oGraph.getFocus().item, null, sDescription + " -> no element should have focus.");
					return;
				}
				assert.equal(oGraph.getFocus().item.getKey(), oElement.getKey(), sDescription + " -> focus should be on element '" + oElement.getKey() + "'.");
			},
			aNodes = oGraph.getNodes(),
			aLines = oGraph.getLines(),
			oGroup = oGraph.getGroups()[0],
				fnAssert = function () {
				var oEvent = createTabEvent(oGraph),
					oNav = oGraph._oKeyboardNavigator,
					fnTabChain = function (n) {
						for (var i = 0; i < n; i++) {
							oNav.onsaptabnext(oEvent);
						}
					},
					fnBackTabChain = function (n) {
						for (var i = 0; i < n; i++) {
							oNav.onsaptabprevious(oEvent);
						}
					};

				oGraph.setFocus({item: aNodes[1]});
				aNodes[1].setVisible(false);
				sap.ui.getCore().applyChanges();
				fnTabChain(1);
				fnCheckElemFocus("Focus a node, set it invisible, Tab goes to the next node", aNodes[2]);

				oGraph.setFocus({item: aLines[0]});
				aLines[0].setVisible(false);
				fnTabChain(1);
				fnCheckElemFocus("Focus a line, set it invisible, dtto", oGroup);

				// Make all invisible visible again before the 2nd round
				aNodes[1].setVisible(true);
				aLines[0].setVisible(true);
				oGroup.setVisible(true);

				oGraph.setFocus({item: aNodes[1]});
				aNodes[0].setCollapsed(true);
				fnCheckElemFocus("Focus a node, set it hidden by collapsing the root, focus goes to the root", aNodes[0]);
				aNodes[0].setCollapsed(false);

				oGraph.setFocus({item: aLines[1]});
				aNodes[0].setCollapsed(true);
				fnCheckElemFocus("Focus a line, set it hidden by collapsing the root, focus goes to the root", aNodes[0]);
				aNodes[0].setCollapsed(false);

				oGraph.setFocus({item: oGroup});
				aNodes[0].setCollapsed(true);
				fnCheckElemFocus("Focus a group, set it hidden by collapsing the root, focus goes to the root", aNodes[0]);
				aNodes[0].setCollapsed(false);

				oGroup.setVisible(false);
				aNodes[1].setVisible(false);
				aLines[2].setVisible(false);
				oGraph.setFocus({item: aNodes[0]});
				fnBackTabChain(1);
				fnCheckElemFocus("Set the group, the second node and the third line invisible and check they are skipped in navigation backward...", null);
				oGraph.setFocus({item: aNodes[0]});
				fnTabChain(1);
				fnCheckElemFocus("...and forward", aNodes[2]);

				// Make all invisible visible again before the 4th round
				aNodes[1].setVisible(true);
				aLines[0].setVisible(true);
				oGroup.setVisible(true);

				aNodes[1].setCollapsed(true);
				oGraph.setFocus({item: aNodes[1]});
				fnTabChain(1);
				fnCheckElemFocus("Collapse second node, so that everything behind it in navigation sequence is hidden except the first line and do Tab", aLines[0]);
			};

		assert.expect(8);

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});
});
