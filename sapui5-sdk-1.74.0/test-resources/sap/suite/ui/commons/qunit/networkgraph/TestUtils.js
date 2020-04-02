sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/networkgraph/Graph",
	"sap/suite/ui/commons/networkgraph/Node",
	"sap/suite/ui/commons/networkgraph/Line",
	"sap/suite/ui/commons/networkgraph/Group",
	"sap/suite/ui/commons/networkgraph/ElementAttribute",
	"sap/suite/ui/commons/networkgraph/SvgBase",
	"sap/suite/ui/commons/networkgraph/ActionButton",
	"sap/suite/ui/commons/networkgraph/GraphMap",
	"sap/suite/ui/commons/networkgraph/Status",
	"sap/ui/qunit/QUnitUtils",
	"jquery.sap.global",
	"sap/m/FlexBox",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (JSONModel, Graph, Node, Line, Group, Attribute, SvgBase, ActionButton, GraphMap, Status, QUnitUtils, jQuery, FlexBox) {
	var GraphTestUtils = {};

	GraphTestUtils.NODE_EXPAND_STATE_ATTR = "_oExpandState";
	GraphTestUtils.NODE_HIDDEN_STATE_ATTR = "_bIsHidden";

	GraphTestUtils.checkGraphFiresEvent = function (assert, oGraph, sEventName) {
		var fnDone = assert.async(),
			oEventPromise = new Promise(function (resolve) {
				oGraph.attachEvent(sEventName, function () {
					resolve("Event " + sEventName + " fired");
				});
			});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();

		Promise.race([oEventPromise, GraphTestUtils.getTimeoutPromise()]).then(function (sValue) {
			assert.notEqual(sValue, "timeout", "Expected event " + sEventName + " should be fired.");
			oGraph.destroy();
			fnDone();
		});
	};

	GraphTestUtils.checkGraphDataFiresEvent = function (assert, oData, sEventName) {
		GraphTestUtils.checkGraphFiresEvent(
			assert,
			GraphTestUtils.buildGraph(oData),
			sEventName
		);
	};

	GraphTestUtils.getTimeoutPromise = function (iTimeout) {
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, iTimeout || 100, "timeout");
		});
	};

	GraphTestUtils.buildGraph = function (oData, oGraph) {
		oGraph = oGraph || new Graph({
			renderType: "Html"
		});

		var oNode = new Node({
				group: "{group}",
				key: "{key}",
				selected: "{selected}",
				shape: "{shape}",
				status: "{status}",
				title: "{title}",
				icon: "{icon}",
				width: "{width}",
				maxWidth: "{maxWidth}",
				description: "{description}",
				descriptionLineSize: "{descriptionLineSize}",
				titleLineSize: "{titleLineSize}",
				collapsed: "{collapsed}",
				visible: "{visible}",
				x: "{x}",
				y: "{y}",
				showExpandButton: "{showExpandButton}",
				showActionLinksButton: "{showActionLinksButton}",
				showDetailButton: "{showDetailButton}",
				iconSize: "{iconSize}"
			}),
			oLine = new Line({
				from: "{from}",
				to: "{to}",
				visible: "{visible}",
				title: "{title}",
				description: "{description}",
				selected: "{selected}",
				status: "{status}",
				lineType: "{lineType}",
				arrowPosition: "{arrowPosition}",
				arrowOrientation: "{arrowOrientation}"
			}),
			oGroup = new Group({
				key: "{key}",
				collapsed: "{collapsed}",
				title: "{title}",
				visible: "{visible}",
				description: "{description}",
				parentGroupKey: "{parentGroupKey}",
				status: "{status}",
				headerCheckBoxState: "{headerCheckBoxState}"
			}),
			oAttribute = new Attribute({
				label: "{label}",
				value: "{value}",
				icon: "{icon}",
				visible: "{visible}",
				labelStatus: "{labelStatus}",
				valueStatus: "{valueStatus}"
			}),
			oActionButton = new ActionButton({
				icon: "{icon}"
			}),
			oStatus = new Status({
				key: "{key}",
				borderColor: "{borderColor}",
				contentColor: "{contentColor}",
				headerContentColor: "{headerContentColor}",
				backgroundColor: "{backgroundColor}",

				hoverBackgroundColor: "{hoverBackgroundColor}",
				hoverBorderColor: "{hoverBorderColor}",
				hoverContentColor: "{hoverContentColor}",

				selectedBackgroundColor: "{selectedBackgroundColor}",
				selectedBorderColor: "{selectedBorderColor}",
				selectedContentColor: "{selectedContentColor}",

				borderWidth: "{borderWidth}",
				borderStyle: "{borderStyle}",
				legendColor: "{legendColor}",

				useFocusColorAsContentColor: "{useFocusColorAsContentColor}"
			});

		oNode.bindAggregation("attributes", {
			path: "attributes",
			template: oAttribute,
			templateShareable: true
		});
		oNode.bindAggregation("actionButtons", {
			path: "actionButtons",
			template: oActionButton,
			templateShareable: true
		});

		oGraph.bindAggregation("statuses", {
			path: "/statuses",
			template: oStatus,
			templateShareable: true
		});

		oGraph.bindAggregation("nodes", {
			path: "/nodes",
			template: oNode
		});
		oGraph.bindAggregation("lines", {
			path: "/lines",
			template: oLine
		});
		oGraph.bindAggregation("groups", {
			path: "/groups",
			template: oGroup
		});
		var oModel = new JSONModel(oData);
		oGraph.setModel(oModel);

		return oGraph;
	};

	GraphTestUtils.buildGraphWithMap = function (oGraphData, oMapData) {
		var oGraph = GraphTestUtils.buildGraph(oGraphData),
			oMap = new GraphMap(oMapData),
			oFlexBox = new FlexBox({
				items: [oGraph, oMap]
			});
		oMap.setGraph(oGraph);
		return {
			all: oFlexBox,
			map: oMap,
			graph: oGraph
		};
	};

	GraphTestUtils.getGraphCoordinatesFingerprint = function (oGraph) {
		var aPoints = [];
		oGraph.getNodes().forEach(function (oNode) {
			aPoints.push({element: "N", x: oNode.getX(), y: oNode.getY()});
		});
		oGraph.getGroups().forEach(function (oGroup) {
			aPoints.push({element: "G", x: oGroup.getX(), y: oGroup.getY()});
		});
		oGraph.getLines().forEach(function (oLine) {
			aPoints.push({element: "L", points: GraphTestUtils.getLineCoordinatesFingerprint(oLine)});
		});
		return JSON.stringify(aPoints);
	};

	GraphTestUtils.getLineCoordinatesFingerprint = function (oLine) {
		var a = [{x: oLine.getSource().getX(), y: oLine.getSource().getY()}];
		oLine.getBends().forEach(function (oBend) {
			a.push({x: oBend.getX(), y: oBend.getY()});
		});
		a.push({x: oLine.getTarget().getX(), y: oLine.getTarget().getY()});

		return a;
	};

	GraphTestUtils.getNodesSelectionFingerprint = function (oGraph) {
		return oGraph.getNodes().reduce(function (acc, val) {
			return acc + GraphTestUtils.getElementSelectionCode(val).toString().charAt(0).toUpperCase();
		}, "");
	};

	GraphTestUtils.getLinesSelectionFingerprint = function (oGraph) {
		return oGraph.getLines().reduce(function (acc, val) {
			return acc + GraphTestUtils.getElementSelectionCode(val).toString().charAt(0).toUpperCase();
		}, "");
	};

	/**
	 * Returns selectness of an element in terms of control's property and appropriate class in DOM.
	 * They should be the same, if they are qither 'T' or 'F' is returned.
	 * If they are not then erroneous '_' is returned.
	 * @param {object} oElement Element to inspect.
	 * @returns {string} Selectedness code.
	 */
	GraphTestUtils.getElementSelectionCode = function (oElement) {
		var bCtrolProperty = oElement.getSelected(),
			bDomClass = oElement.$().hasClass(SvgBase.prototype.SELECT_CLASS);
		if (bCtrolProperty && bDomClass) {
			return "T";
		} else if (!bCtrolProperty && !bDomClass) {
			return "F";
		} else {
			return "_";
		}
	};

	GraphTestUtils.isElementInDom = function (oElement) {
		return !!oElement.$()[0];
	};

	GraphTestUtils.getNodeAttrFingerprint = function (oGraph, sAttrName) {
		return oGraph.getNodes().reduce(function (acc, val) {
			return acc + val[sAttrName].toString().charAt(0).toUpperCase();
		}, "");
	};

	GraphTestUtils.getLineAttrFingerprint = function (oGraph, sAttrName) {
		return oGraph.getLines().reduce(function (acc, val) {
			return acc + val[sAttrName].toString().charAt(0).toUpperCase();
		}, "");
	};

	GraphTestUtils.assertNodesDomFingerprint = function (assert, oGraph, sFingerprint) {
		var s = oGraph.getNodes().reduce(function (acc, val) {
			return acc + (val.$()[0] ? "X" : "o");
		}, "");
		assert.equal(s, sFingerprint, "Correct set of nodes should be rendered.");
	};

	GraphTestUtils.assertLinesDomFingerprint = function (assert, oGraph, sFingerprint) {
		var s = oGraph.getLines().reduce(function (acc, val) {
			return acc + (val.$()[0] ? "X" : "o");
		}, "");
		assert.equal(s, sFingerprint, "Correct set of lines should be rendered.");
	};

	GraphTestUtils.getColapseExpandVisibilityChecker = function (assert, oGraph, sMsg) {
		return {
			check: function (iNodeIndex, bCollapse, sExpectedStates, sExpectedInvisibilities) {
				var oNode = oGraph.getNodes()[iNodeIndex],
					sActualMsg = sMsg || ("After " + (bCollapse ? "collapsing" : "expanding") + " node " + iNodeIndex);
				oNode.setCollapsed(bCollapse);
				sap.ui.getCore().applyChanges();
				assert.equal(
					GraphTestUtils.getNodeAttrFingerprint(oGraph, GraphTestUtils.NODE_EXPAND_STATE_ATTR),
					sExpectedStates,
					sActualMsg + ": expand states should be correct - " + sExpectedStates
				);
				assert.equal(
					GraphTestUtils.getNodeAttrFingerprint(oGraph, GraphTestUtils.NODE_HIDDEN_STATE_ATTR),
					sExpectedInvisibilities,
					sActualMsg + ": invisibilities should be correct - " + sExpectedInvisibilities
				);
			}
		};
	};

	GraphTestUtils.runAsyncAssert = function (oGraph, fnAssert, fnDone) {
		oGraph.attachGraphReady(function () {
			fnAssert();
			fnDone();
			oGraph.destroy();
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	};

	GraphTestUtils.runAsyncActionAssertChain = function (oGraph, mAsyncChain, fnDone) {
		var iIteration = 0;

		oGraph.attachEvent(mAsyncChain.eventName, function () {
			iIteration++;

			// No assert in the first round just action later
			if (iIteration > 1) {
				mAsyncChain.iterations[iIteration - 2].assert();
			}

			// No action in the last round, cause there's no assertion left to make
			if (iIteration <= mAsyncChain.iterations.length) {
				mAsyncChain.iterations[iIteration - 1].action();
				sap.ui.getCore().applyChanges();
			}

			if (iIteration > mAsyncChain.iterations.length) {
				fnDone();
				oGraph.destroy();
			}
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	};

	GraphTestUtils.runSyncActionAssertChain = function (oGraph, mSyncChain, fnDone) {
		var fnGetHandler = function (iIter) {
			return function (oEvent) {
				mSyncChain.iterations[iIter].assert(oEvent);
			};
		};

		for (var i = 0; i < mSyncChain.iterations.length; i++) {
			oGraph.attachEventOnce(mSyncChain.eventName, fnGetHandler(i));
			mSyncChain.iterations[i].action();
			sap.ui.getCore().applyChanges();
		}
		fnDone();
		oGraph.destroy();
	};

	GraphTestUtils.getAtomGraph = function () {
		return GraphTestUtils.buildGraph({
			nodes: [{key: 0}]
		});
	};

	GraphTestUtils.performeActionButtonTest = function (mOptions) {
		var oGraph,
			assert = mOptions.assert,
			fnDone = assert.async();

		if (mOptions.fnGraphFactory) {
			oGraph = mOptions.fnGraphFactory();
		} else {
			oGraph = mOptions.graph;
		}
		assert.expect(mOptions.expect);

		oGraph.attachGraphReady(function () {
			function finish() {
				oGraph.destroy();
				fnDone();
			}

			jQuery(mOptions.elementToClick.getFocusDomRef()).mousedown();
			sap.ui.getCore().applyChanges();
			var oResult = mOptions.fnCheck();
			if (oResult && typeof oResult.then === "function") {
				oResult.then(finish);
			} else {
				finish();
			}
		});

		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	};

	GraphTestUtils.getEventItemsKeyList = function (oEvent) {
		return GraphTestUtils.getElementsKeyList(oEvent.getParameter("items"));
	};

	GraphTestUtils.getElementsKeyList = function (aElements) {
		var fnGetKey = function (o) {
				return o instanceof Line ? o.getFrom() + "->" + o.getTo() : o.getKey();
			},
			sKeys = aElements
				.sort(function (a, b) {
					return fnGetKey(a).localeCompare(fnGetKey(b));
				})
				.reduce(function (acc, val) {
					return acc + (acc.length ? ", " : "") + fnGetKey(val);
				}, "");
		return sKeys;
	};

	/**
	 * Triggers a mouse event on a provided component with all important properties.
	 *
	 * @param {object} oTarget - Target component to trigger event on.
	 * @param {string} [sType=mousedown] - Type of event.
	 * @param {object} [oParameters] - Additional event parameters.
	 */
	GraphTestUtils.triggerMouseEvent = function (oTarget, sType, oParameters) {
		var oEventParam,
			oTargetDom,
			oBBox;

		// Resolve type
		if (typeof sType === "object") {
			oParameters = sType;
			sType = "mousedown";
		}
		sType = sType || "mousedown";
		// Resolve DOM stuff
		if (oTarget.getMetadata().getName() === "sap.suite.ui.commons.networkgraph.Graph") {
			oTargetDom = sType === "mousedown" ? oTarget.$("eventwrapper") : oTarget.$scroller;
			oBBox = oTarget.$svg[0].getBBox();
		} else {
			oTargetDom = oTarget.getFocusDomRef();
			oBBox = oTargetDom.getBBox();
		}
		// Resolve params
		oParameters = oParameters || {};
		oEventParam = {
			offsetX: 1,
			offsetY: 1,
			pageX: 1,
			pageY: 1,
			button: 0,
			clientX: oBBox.x + oBBox.width / 2,
			clientY: oBBox.y + oBBox.height / 2
		};
		jQuery.extend(oEventParam, oParameters);
		// Hit it
		QUnitUtils.triggerEvent(sType, oTargetDom, oEventParam);
	};

	GraphTestUtils.clickNode = function (oNode, bCtrlKey) {
		oNode._mouseDown(bCtrlKey);
	};

	GraphTestUtils.clickLine = function (oLine, bCtrlKey) {
		var oBBox = oLine.getFocusDomRef().getBBox(),
			oEventParams = {
				ctrlKey: bCtrlKey,
				clientX: oBBox.x + oBBox.width / 2,
				clientY: oBBox.y + oBBox.height / 2
			};
		oLine._click(oEventParams);
	};

	GraphTestUtils.getGraphMouseParams = function (oGraph, bCtrlKey) {
		var oBBox = oGraph.$svg[0].getBBox();
		return {
			ctrlKey: bCtrlKey,
			clientX: oBBox.x + oBBox.width / 2,
			clientY: oBBox.y + oBBox.height / 2,
			offsetX: 1,
			offsetY: 1,
			pageX: 1,
			pageY: 1,
			button: 0
		};
	};

	GraphTestUtils.equalEnough = function (n1, n2) {
		return Math.abs(n1 - n2) < 0.001;
	};

	return GraphTestUtils;
}, true);
