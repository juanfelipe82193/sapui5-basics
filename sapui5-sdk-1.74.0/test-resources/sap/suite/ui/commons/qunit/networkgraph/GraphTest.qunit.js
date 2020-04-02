/*global QUnit,sinon*/
sap.ui.define([
	"./TestUtils",
	"sap/suite/ui/commons/networkgraph/Graph",
	"./TestLayout",
	"sap/suite/ui/commons/networkgraph/Node",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/networkgraph/layout/NoopLayout",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (GraphTestUtils, Graph, TestLayout, Node, createAndAppendDiv, NoopLayout) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height:100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height:100%; overflow-y: hidden");
	var styleElement = document.createElement("style");
	styleElement.textContent =
		"html, body {" +
		"       height: 100%;" +
		"}";
	document.head.appendChild(styleElement);

	QUnit.module("Network graph general functionality test");

	QUnit.skip("Panning graph with mouse.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0}, {key: 1}, {key: 2}, {key: 3}, {key: 4},
					{key: 5}, {key: 6}, {key: 7}, {key: 8}, {key: 9}
				],
				lines: [
					{from: 0, to: 1}, {from: 1, to: 2}, {from: 2, to: 3}, {from: 3, to: 4},
					{from: 5, to: 6}, {from: 6, to: 7}, {from: 7, to: 8}, {from: 8, to: 9}
				]
			}),
			fnDone = assert.async(),
			iScrollerLeft, iScrollerTop,
			mParams;

		assert.expect(2);
		oGraph.attachGraphReady(function () {
			// Zoom enough for the graph to be larger then the screen
			for (var i = 0; i < 9; i++) {
				oGraph._zoom({deltaY: 1});
			}

			mParams = GraphTestUtils.getGraphMouseParams(oGraph);
			oGraph._mouseDown(mParams.clientX, mParams.clientY);
			sap.ui.getCore().applyChanges();
			iScrollerLeft = oGraph.$scroller.get(0).scrollLeft;
			iScrollerTop = oGraph.$scroller.get(0).scrollTop;
			oGraph._mouseMove(10, 10);
			sap.ui.getCore().applyChanges();
			assert.ok(oGraph.$scroller.get(0).scrollLeft > iScrollerLeft, "Graph should have moved to the right.");
			assert.ok(oGraph.$scroller.get(0).scrollTop > iScrollerTop, "Graph should have moved to the bottom.");
			mParams = GraphTestUtils.getGraphMouseParams(oGraph);
			oGraph._mouseUp(mParams.clientX, mParams.clientY);
			sap.ui.getCore().applyChanges();

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Order of rendered layers - HTML", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "ABC"},
					{key: 1, title: "OPQ", group: "A"}
				],
				lines: [
					{from: 0, to: 1, title: "0-1"}
				],
				groups: [
					{key: "A", title: "GHI"}
				]
			}),
			fnDone = assert.async();

		oGraph.setRenderType("Html");
		assert.expect(6);

		oGraph.attachGraphReady(function () {
			var aChildren = oGraph.$("innerscroller").children();
			assert.notEqual(aChildren[0].id.indexOf("tooltiplayer"), -1, "line tooltips");
			assert.notEqual(aChildren[1].id.indexOf("divgroups"), -1, "groups");
			assert.notEqual(aChildren[2].id.indexOf("divnodes"), -1, "nodes");
			assert.notEqual(aChildren[3].id.indexOf("networkGraphSvg"), -1, "svg");
			assert.notEqual(aChildren[4].id.indexOf("background"), -1, "background");
			assert.equal(aChildren.length, 5, "children");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Order of rendered layers - SVG", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "ABC"},
					{key: 1, title: "OPQ", group: "A"}
				],
				lines: [
					{from: 0, to: 1, title: "0-1"}
				],
				groups: [
					{key: "A", title: "GHI"}
				]
			}),
			fnDone = assert.async();

		assert.expect(4);
		oGraph.setRenderType("Svg");

		oGraph.attachGraphReady(function () {
			var aChildren = oGraph.$("innerscroller").children();
			assert.notEqual(aChildren[0].id.indexOf("tooltiplayer"), -1, "line tooltips");
			assert.notEqual(aChildren[1].id.indexOf("divgroups"), -1, "groups");
			assert.notEqual(aChildren[2].id.indexOf("networkGraphSvg"), -1, "svg");
			assert.equal(aChildren.length, 3, "children");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});


	QUnit.test("Setting width and height of graph causes invalidation and results in appropriate screen sizes.", function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDone = assert.async(),
			iScreenWidth, iScreenHeight,
			fNewWidthRate, fNewHeightRate,
			mAsyncChain = {
				eventName: "graphReady",
				iterations: [
					{
						action: function () {
							iScreenWidth = oGraph.$().width();
							iScreenHeight = oGraph.$().height();
							oGraph.setWidth("50%").setHeight("150%");
						},
						assert: function () {
							fNewWidthRate = oGraph.$().width() / iScreenWidth;
							assert.ok(GraphTestUtils.equalEnough(fNewWidthRate, 0.5), "Screen width should change by 0.5.");
							fNewHeightRate = oGraph.$().height() / iScreenHeight;
							assert.ok(GraphTestUtils.equalEnough(fNewHeightRate.toFixed(3), 1.5), "Screen width should change by 1.5");
						}
					},
					{
						action: function () {
							oGraph.setWidth("640px").setHeight("480px");
						},
						assert: function () {
							assert.equal(oGraph.$().width(), 640, "Screen width should change to 640 pixels.");
							assert.equal(oGraph.$().height(), 480, "Screen height should change to 480 pixels.");
						}
					},
					{
						action: function () {
							oGraph.setWidth("auto").setHeight("auto");
						},
						assert: function () {
							var node = oGraph.getNodes()[0];
							var nodeWidth = node.getX() + node._iWidth + 50; // 50 = SIZE_OFFSET_X
							var nodeHeight = node.getY() + node._iHeight + 20; // 20 = SIZE_OFFSET_Y
							assert.equal(oGraph.$().width(), nodeWidth, "Screen width should auto size.");
							assert.equal(oGraph.$("wrapper").height(), nodeHeight, "Screen height should auto size.");
						}
					},
					{
						action: function () {
							oGraph.setWidth("80em").setHeight("50em");
						},
						assert: function () {
							assert.ok(true, "Relative values should trigger invalidations.");
						}
					}
				]
			};

		assert.expect(7);
		GraphTestUtils.runAsyncActionAssertChain(oGraph, mAsyncChain, fnDone);
	});

	QUnit.test("Zoom works correctly and triggers expected events.", function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDone = assert.async(),
			mSyncChain = {
				eventName: "zoomChanged",
				iterations: [
					{
						action: function () {
							oGraph._zoom({deltaY: 1});
						},
						assert: function () {
							assert.ok(oGraph._fZoomLevel > 1, "Graph should be magnified after zoom-in.");
						}
					},
					{
						action: function () {
							oGraph._zoom({deltaY: -1});
						},
						assert: function () {
							assert.ok(oGraph._fZoomLevel == 1, "Graph should be back to no-zoom after zoom-out.");
						}
					},
					{
						action: function () {
							oGraph._zoom({deltaY: -1});
						},
						assert: function () {
							assert.ok(oGraph._fZoomLevel < 1, "Graph should be minified after another zoom-out.");
						}
					},
					{
						action: function () {
							oGraph._zoom({deltaY: 1});
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 1, "Graph should have correct zoom-in level");
						}
					},
					{
						action: function () {
							oGraph._zoom({zoomLevel: 2});
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 2, "Graph should have correct zoom-in level");
						}
					},
					{
						action: function () {
							oGraph._zoom({zoomLevel: 0.2});
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 0.2, "Graph should have correct zoom-in level");
						}
					},
					{
						action: function () {
							oGraph._zoom({zoomLevel: 200, deltaY: -1});
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 200, "Graph should have correct zoom-in level");
						}
					},
					{
						action: function () {
							oGraph._zoom({zoomLevel: -10});
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 0, "Graph should have correct zoom-in level");
						}
					},
					{
						action: function () {
							oGraph._fZoomLevel = 0.43;
							oGraph._zoom({deltaY: 1});
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 0.5, "Graph should have correct zoom-in level");
						}
					},
					{
						action: function () {
							oGraph._fZoomLevel = 0.43;
							oGraph._zoom({deltaY: -1});
						},
						assert: function () {
							assert.equal(oGraph._fZoomLevel, 0.33, "Graph should have correct zoom-in level");
						}
					}
				]
			};

		assert.expect(10);
		oGraph.attachGraphReady(function () {
			GraphTestUtils.runSyncActionAssertChain(oGraph, mSyncChain, fnDone);
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Public zoom calls private _zoom with correct parameters", function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			aParams = [
				{
					oCallParams: {},
					oTestParams: {deltaY: 1}
				},
				{
					oCallParams: {x: 1},
					oTestParams: {deltaY: 1, x: 1}
				},
				{
					oCallParams: {x: 1, y: 1},
					oTestParams: {deltaY: 1, x: 1, y: 1, point: {x: 1, y: 1}}
				},
				{
					oCallParams: {zoomin: true},
					oTestParams: {zoomin: true, deltaY: 1}
				},
				{
					oCallParams: {zoomin: false},
					oTestParams: {zoomin: false, deltaY: -1}
				},
				{
					oCallParams: {zoomin: false, x: -10, y: -10},
					oTestParams: {zoomin: false, deltaY: -1, x: -10, y: -10, point: {x: -10, y: -10}}
				},
				{
					oCallParams: {zoomLevel: 0},
					oTestParams: {deltaY: 1, zoomLevel: 0}
				},
				{
					oCallParams: {zoomLevel: 3, zoomin: false},
					oTestParams: {zoomin: false, deltaY: -1, zoomLevel: 3}
				}
			],
			oZoomStub = sinon.stub(oGraph, "_zoom");

		aParams.forEach(function (oParams, iIndex) {
			oGraph.zoom(oParams.oCallParams);
			assert.equal(oZoomStub.args[iIndex].length, 1, "_zoom should be called with correct number of parameters");
			assert.deepEqual(oZoomStub.args[iIndex][0], oParams.oTestParams, "_zoom should be called with correct params");
		});

		oGraph.destroy();
	});

	var testEnableWheelZoom = function (assert, enableWheelZoom) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDone = assert.async();
		var zoomParams = {
			point: {
				x: 42,
				y: 24
			},
			deltaY: -10
		};
		var zoom = sinon.spy(Graph.prototype, "_zoom");
		var getZoomText = sinon.spy(Graph.prototype, "_getZoomText");
		var cleanUp = function () {
			zoom.restore();
			getZoomText.restore();
			fnDone();
			oGraph.destroy();
		};
		oGraph.setEnableWheelZoom(enableWheelZoom);

		oGraph.attachGraphReady(function () {
			var oEventWithoutCtrl = {
				x: 42,
				y: 24,
				deltaY: 10,
				div: oGraph.$("ctrlalert"),
				ctrl: false
			};
			var oEventWithCtrl = {
				x: 42,
				y: 24,
				deltaY: 10,
				div: oGraph.$("ctrlalert"),
				ctrl: true
			};
			var res = oGraph._wheel(oEventWithCtrl);
			assert.ok(res, "_wheel returns true");
			assert.ok(zoom.calledWith(zoomParams), "setEnableWheelZoom=" + enableWheelZoom + ", _zoom was called, if CTRL key was used.");
			zoom.reset();
			assert.ok(getZoomText.called, "_getZoomText called");
			getZoomText.reset();

			res = oGraph._wheel(oEventWithoutCtrl);
			if (enableWheelZoom) {
				assert.ok(res, "_wheel returns true");
				assert.ok(zoom.calledWith(zoomParams), "setEnableWheelZoom=" + enableWheelZoom + ", _zoom was called, if CTRL key was not used.");
				assert.ok(getZoomText.called, "_getZoomText called");
				cleanUp();
			} else {
				assert.notOk(res, "_wheel returns false");
				assert.notOk(zoom.called, "setEnableWheelZoom=" + enableWheelZoom + ", _zoom was not called, if CTRL key was not used.");
				assert.notOk(getZoomText.called, "_getZoomText not called");

				var counter = 0;
				var cssCheck = setInterval(function () {
					var opacity = oGraph.$("ctrlalert").css("opacity");
					var res = opacity && opacity !== "0";
					if (res || counter > 20) {
						clearInterval(cssCheck);
						assert.ok(res, "ctrlalert div was shown.");
						cleanUp();
					}
					counter++;
				}, 10);
			}
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	};

	QUnit.test("Property enableWheelZoom=true is working properly.", function (assert) {
		testEnableWheelZoom(assert, true);
	});

	QUnit.test("Property enableWheelZoom=false is working properly.", function (assert) {
		testEnableWheelZoom(assert, false);
	});

	QUnit.test("Search confirmation selects desired node or line.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "ABC"},
					{key: 1, title: "OPQ", group: "A"},
					{key: 2, title: "XYZ"}
				],
				lines: [
					{from: 0, to: 1, title: "0-1"},
					{from: 2, to: 1, title: "2-1"},
					{from: 0, to: 2, title: "0-2"}
				],
				groups: [
					{key: "A", title: "GHI"}
				]
			}),
			fnDone = assert.async(),
			mSyncChain = {
				eventName: "selectionChange",
				iterations: [
					{
						action: function () {
							oGraph._search("OPQ");
						},
						assert: function () {
							assert.equal(
								GraphTestUtils.getNodesSelectionFingerprint(oGraph),
								"FTF",
								"Node OPQ that has been searched for should be the only one selected.");
						}
					},
					{
						action: function () {
							oGraph._search("ABC");
						},
						assert: function () {
							assert.equal(
								GraphTestUtils.getNodesSelectionFingerprint(oGraph),
								"TFF",
								"Node ABC that has been searched for should be the only one selected.");
						}
					},
					{
						action: function () {
							oGraph._search("2-1 (XYZ -> OPQ)");
						},
						assert: function () {
							assert.equal(
								GraphTestUtils.getLinesSelectionFingerprint(oGraph),
								"FTF",
								"Line 2-1 that has been searched for should be the only one selected.");
						}
					},
					{
						action: function () {
							oGraph._search();
						},
						assert: function () {
							assert.equal(
								GraphTestUtils.getNodesSelectionFingerprint(oGraph),
								"FFF",
								"All should be deselected after invalid search.");
						}
					}
				]
			};

		assert.expect(4);
		oGraph.attachGraphReady(function () {
			GraphTestUtils.runSyncActionAssertChain(oGraph, mSyncChain, fnDone);
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Toggling full screen utilizes all the space at the top and returns back when toggling again.", function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDone = assert.async(),
			iOffsetTop;

		assert.expect(3);
		oGraph.attachGraphReady(function () {
			iOffsetTop = oGraph.$()[0].offsetTop;
			assert.ok(iOffsetTop > 0, "There should be an offset at the top.");
			oGraph.getToolbar().getContent()[7].firePress();
			assert.ok(oGraph.$()[0].offsetTop === 0, "Offset at the top should be gone after toggling full screen.");
			oGraph.getToolbar().getContent()[7].firePress();
			assert.ok(oGraph.$()[0].offsetTop >= iOffsetTop, "Offset at the top should be back as it was.");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Toggling fit to screen.", function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDone = assert.async();

		assert.expect(1);
		oGraph.attachGraphReady(function () {
			oGraph._fitToScreen();
			assert.ok(true, "Graph is now Fit@SAP.");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Background image gets rendered.", function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDone = assert.async(),
			fnAssert = function () {
				var sImg = oGraph.$("networkGraphSvg").css("background-image");
				assert.ok(sImg && sImg.search(/.*sap.jpg.*/) !== -1, "Background should be rendered.");
			};

		assert.expect(1);
		oGraph.setBackgroundImage("test-resources/sap/suite/ui/commons/qunit/networkgraph/sap.jpg");

		GraphTestUtils.runAsyncAssert(oGraph, fnAssert, fnDone);
	});

	QUnit.test("Layouting events [afterLayouting, beforeLayouting] are all fired, and in correct order.", function (assert) {
		var oGraph = GraphTestUtils.getAtomGraph(),
			fnDoneBefore = assert.async(),
			fnDoneAfter = assert.async(),
			bBeforeDone = false,
			bAfterDone = false;

		assert.expect(2);
		oGraph.attachBeforeLayouting(function () {
			assert.notOk(bAfterDone, "Event 'beforeLayouting' should be fired well before 'afterLayouting'.");
			bBeforeDone = true;
			fnDoneBefore();
		});
		oGraph.attachAfterLayouting(function () {
			assert.ok(bBeforeDone, "Event 'afterLayouting' should be fired well after 'beforeLayouting'.");
			bAfterDone = false;
			fnDoneAfter();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	//Disabled test because of intermittent behaviour
	/*QUnit.test("Search field suggestions.", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "Abraka"},
					{key: 1, title: "Dabra", group: "A"},
					{key: 2, title: "Hadra", group: "B"}
				],
				lines: [
					{from: 0, to: 1, title: "Cobra"},
					{from: 1, to: 2, title: "Opera"},
					{from: 2, to: 0, title: "Aura"}
				],
				groups: [
					{key: "A", title: "Ludra"},
					{key: "B", title: "Ovar"}
				]
			}),
			fnDone = assert.async();

		assert.expect(3);
		oGraph.attachGraphReady(function () {
			oGraph._suggest("ra");
			assert.equal(
				GraphTestUtils.getElementsKeyList(oGraph._searchField.getSuggestionItems()),
				"0, 1, 2, A, line_0-1[0], line_1-2[1], line_2-0[2]",
				"Suggestions for the term 'ra' should be as expected.");
			oGraph._suggest("dra");
			assert.equal(
				GraphTestUtils.getElementsKeyList(oGraph._searchField.getSuggestionItems()),
				"2, A, line_1-2[1], line_2-0[2]",
				"Suggestions for the term 'dra' should be as expected.");
			oGraph._suggest("dragon");
			assert.equal(
				oGraph._searchField.getSuggestionItems(),
				0,
				"There should be no suggestions for the term 'dragon'.");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});*/

	QUnit.test("Graph ready fires after the last layouting is done.", function (assert) {
		var oGraph = new Graph({
				nodes: [new Node({
					key: 0,
					x: 0,
					y: 0
				})]
			}),
			aResolves = [],
			fnDone = assert.async(),
			iLayoutsCalled = 0;

		function resolveNext() {
			setTimeout(function () {
				var resolve = aResolves.shift();
				if (resolve) {
					resolve();
					resolveNext();
				}
			});
		}

		assert.expect(2);
		oGraph.setLayoutAlgorithm(new TestLayout(function (fnResolve) {
			iLayoutsCalled++;
			aResolves.push(fnResolve);
		}));
		oGraph.attachGraphReady(function () {
			assert.equal(aResolves.length, 0, "Not all layouting jobs were called.");
			assert.equal(iLayoutsCalled, 2, "Graph ready fired before second layouting was finished.");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();

		oGraph.addNode(new Node({
			key: 1,
			x: 100,
			y: 100
		}));
		sap.ui.getCore().applyChanges();

		resolveNext();
	});

	QUnit.test("Only the latest layouting algorythm modifies the content.", function (assert) {
		var oGraph = new Graph({
				nodes: [new Node({
					key: 0,
					x: 0,
					y: 0
				})]
			}),
			aResolves = [],
			fnDone = assert.async(),
			iLayoutsCalled = 0;

		function resolveNext() {
			setTimeout(function () {
				var obj = aResolves.shift();
				if (obj) {
					if (obj.layoutNo === 1) {
						assert.ok(obj.layoutTask.isTerminated(), "First task should be terminated.");
					} else {
						oGraph.getNodes()[0].setX(1);
					}
					obj.resolve();
					resolveNext();
				}
			});
		}

		assert.expect(2);
		oGraph.setLayoutAlgorithm(new TestLayout(function (fnResolve, fnReject, oLayoutTask) {
			iLayoutsCalled++;
			aResolves.push({resolve: fnResolve, layoutNo: iLayoutsCalled, layoutTask: oLayoutTask});
		}));
		oGraph.attachGraphReady(function () {
			assert.equal(oGraph.getNodes()[0].getX(), 1, "Node position should be set by second layouting task but it's not.");
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();

		oGraph.addNode(new Node({
			key: 1,
			x: 100,
			y: 100
		}));
		sap.ui.getCore().applyChanges();

		resolveNext();
	});

	QUnit.test("updateLegend calls inner _createLegend method", function (assert) {
		var oGraph = new Graph(),
			fnDone = assert.async();

		sinon.spy(oGraph, "_createLegend");

		oGraph = GraphTestUtils.buildGraph({
			statuses: [{key: "Test", borderColor: "red"}],
			nodes: [{key: 0, status: "Test"}]
		}, oGraph);

		assert.expect(1);

		oGraph.attachGraphReady(function () {
			assert.ok(oGraph._createLegend.calledOnce, "_createLegend should be called once");

			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("updateLegend is called when status set on element", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "ABC"},
					{key: 1, title: "OPQ", group: "A"},
					{key: 2, title: "XYZ"}
				],
				lines: [
					{from: 0, to: 1, title: "0-1"},
					{from: 2, to: 1, title: "2-1"},
					{from: 0, to: 2, title: "0-2"}
				],
				groups: [
					{key: "A", title: "GHI"}
				]
			}),
			fnDone = assert.async();


		var oLegendStub = sinon.stub(oGraph, "updateLegend");

		oGraph.attachGraphReady(function () {
			oGraph.getNodes()[0].setStatus("test");
			oGraph.getLines()[0].setStatus("test");
			oGraph.getGroups()[0].setStatus("test");

			assert.equal(oLegendStub.callCount, 3, "updateLegend called correct number of times");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Legend test", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				statuses: [{key: "Custom", "borderColor": "red"}],
				nodes: [
					{key: 0, title: "ABC", status: "Standard"},
					{key: 1, title: "OPQ", status: "Error"},
					{key: 2, title: "OPQ", status: "Custom"}
				]
			}),
			fnDone = assert.async();

		oGraph.attachGraphReady(function () {
			var $lines = oGraph.$().find(".sapSuiteUiCommonsNetworkGraphLegendLineLabel");

			assert.equal($lines[0].innerText, "Custom", "custom");
			assert.equal($lines[1].innerText, "Error", "error");
			assert.equal($lines[2].innerText, "Standard", "standard");

			oGraph.setCustomLegendLabel({
				status: "Error",
				label: "AError"
			});

			$lines = oGraph.$().find(".sapSuiteUiCommonsNetworkGraphLegendLineLabel");

			assert.equal($lines[0].innerText, "AError", "Error");
			assert.equal($lines[1].innerText, "Custom", "Custom");
			assert.equal($lines[2].innerText, "Standard", "standard");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("toggle fullscreen tests", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "ABC"}
				]
			}),
			fnDone = assert.async();

		assert.expect(3);

		oGraph.attachGraphReady(function () {

			assert.equal(oGraph.isFullScreen(), false, "fullscreen is off");
			oGraph.toggleFullScreen();
			assert.equal(oGraph.isFullScreen(), true, "fullscreen is on");
			oGraph.toggleFullScreen();
			assert.equal(oGraph.isFullScreen(), false, "fullscreen is off");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});


	var fnFireMouseWheel = function (oGraph, iDelta) {
		var event = jQuery.Event("wheel", {
			originalEvent: {
				deltaY: iDelta,
				clientX: 500,
				clientY: 500
			}
		});
		oGraph.$scroller.trigger(event);
	};

	QUnit.test("Zooming allowed", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "ABC"}
				]
			}),
			fnDone = assert.async();

		assert.expect(5);

		var fnFireEvent = function (iDelta) {
			fnFireMouseWheel(oGraph, iDelta);
		};

		oGraph.attachGraphReady(function () {
			fnFireEvent(-1);
			assert.equal(oGraph._fZoomLevel, 1.1, "Zoom out");
			fnFireEvent(-1);
			assert.equal(oGraph._fZoomLevel, 1.25, "Zoom out");
			fnFireEvent(-1);
			assert.equal(oGraph._fZoomLevel, 1.5, "Zoom out");
			fnFireEvent(1);
			fnFireEvent(1);
			fnFireEvent(1);
			fnFireEvent(1);
			assert.equal(oGraph._fZoomLevel, 0.9, "Zoom in");
			fnFireEvent(1);
			assert.equal(oGraph._fZoomLevel, 0.8, "Zoom in");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Zooming not allowed", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "ABC"}
				]
			}),
			fnDone = assert.async();

		oGraph.setEnableZoom(false);

		assert.expect(2);

		var fnFireEvent = function (iDelta) {
			fnFireMouseWheel(oGraph, iDelta);
		};

		oGraph.attachGraphReady(function () {
			fnFireEvent(-1);
			assert.equal(oGraph._fZoomLevel, 1, "Zoom out");
			fnFireEvent(1);
			assert.equal(oGraph._fZoomLevel, 1, "Zoom int");
			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Zooming with ctrl", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "ABC"}
				]
			}),
			fnDone = assert.async();

		oGraph.setEnableWheelZoom(false);

		assert.expect(5);

		var fnFireEvent = function (iDelta) {
			fnFireMouseWheel(oGraph, iDelta);
		};

		var fnFireWithCtrl = function (iDelta) {
			var event = jQuery.Event("wheel", {
				ctrlKey: true,
				originalEvent: {
					deltaY: iDelta,
					clientX: 500,
					clientY: 500
				}
			});
			oGraph.$scroller.trigger(event);

		};

		oGraph.attachGraphReady(function () {
			fnFireEvent(-1);
			assert.equal(oGraph._fZoomLevel, 1, "Zoom out");
			fnFireEvent(1);
			assert.equal(oGraph._fZoomLevel, 1, "Zoom in");
			fnFireWithCtrl(-1);
			assert.equal(oGraph._fZoomLevel, 1.1, "Zoom out");
			fnFireWithCtrl(1);
			assert.equal(oGraph._fZoomLevel, 1, "Zoom in");
			fnFireWithCtrl(1);
			assert.equal(oGraph._fZoomLevel, 0.9, "Zoom in");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("No Data", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{key: 0, title: "ABC"}
				]
			}),
			fnDone = assert.async();

		assert.expect(2);
		oGraph.setNoData(true);
		oGraph.setNoDataText("Test");

		oGraph.attachGraphReady(function () {
			assert.equal(oGraph.$().find(".sapSuiteUiCommonsNetworkGraphNoDataWrapper").length, 1, "No data is rendered");
			assert.equal(oGraph.$().find(".sapSuiteUiCommonsNetworkGraphNoDataLabel").text(), "Test", "Text");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Max width with small size", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{
						key: 0,
						title: "test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test ",
						shape: "Box",
						maxWidth: 500
					},
					{
						key: 1,
						titleLineSize: 0,
						title: "test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test testtest test test test test test test test test test test test test test test test test test test test test test test test test test test test test test",
						shape: "Box",
						maxWidth: 500
					}
				]
			}),
			fnDone = assert.async();
		oGraph.setWidth("100px");
		oGraph.setHeight("100px");

		assert.expect(4);

		var iState = 0;
		oGraph.attachGraphReady(function () {
			assert.equal(oGraph.getNodes()[0].$().width(), 502, "Max width even when graph is small");
			assert.equal(oGraph.getNodes()[1].$().width(), 502, "Max width even when graph is small");

			if (iState === 0) {
				oGraph.invalidate();
				iState++;
			} else {
				oGraph.destroy();
				fnDone();
			}
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Invalidation", function (assert) {
		var oGraph = GraphTestUtils.buildGraph({
				nodes: [
					{
						key: 0,
						x: 50,
						y: 50
					}
				]
			}),
			fnDone = assert.async();
		assert.expect(4);
		oGraph.setLayoutAlgorithm(new NoopLayout());

		oGraph.attachGraphReady(function () {
			var $node = oGraph.getNodes()[0].$();
			assert.equal($node.css("left"), "50px", "Max width even when graph is small");
			assert.equal($node.css("top"), "50px", "Max width even when graph is small");

			oGraph.getNodes()[0].invalidate();
			sap.ui.getCore().applyChanges();

			assert.equal($node.css("left"), "50px", "Max width even when graph is small");
			assert.equal($node.css("top"), "50px", "Max width even when graph is small");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});
});
