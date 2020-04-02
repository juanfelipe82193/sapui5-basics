sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/suite/ui/commons/ProcessFlow",
	"sap/suite/ui/commons/ProcessFlowNode",
	"sap/suite/ui/commons/ProcessFlowLaneHeader",
	"sap/suite/ui/commons/ProcessFlowNodeState",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/ProcessFlowZoomLevel",
	"sap/suite/ui/commons/ProcessFlowDisplayState",
	"./util/AriaPropertiesTestUtils",
	"sap/ui/Device",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/qunit/QUnitUtils"
], function (jQuery, ProcessFlow, ProcessFlowNode, ProcessFlowLaneHeader, ProcessFlowNodeState, JSONModel, ProcessFlowZoomLevel,
             ProcessFlowDisplayState, AriaPropertiesTestUtils, Device, CreateAndAppendDiv, QUtils) {
	"use strict";

	CreateAndAppendDiv("processflowdiv").setAttribute("style", "width: 1025px;");
	CreateAndAppendDiv("processflowdiv599").setAttribute("style", "width: 599px;");
	CreateAndAppendDiv("processflowdiv1023").setAttribute("style", "width: 1023px;");
	CreateAndAppendDiv("processflowdiv1025").setAttribute("style", "width: 1025px;");
	CreateAndAppendDiv("processflowdiv450").setAttribute("style", "width: 1025px; min-width: 450px; max-width: 450px;");

	function createNodeElementFromOldVersion(nodeid, laneNumber, state, displayState, parent, children) {
		return new ProcessFlow.NodeElement(nodeid, laneNumber,
			new ProcessFlowNode({nodeId: nodeid, children: children}), parent);
	}

	QUnit.module("Basic Tests", {
		beforeEach: function () {
			this.processFlow = new ProcessFlow("processFlow");
			this.processFlow.placeAt("processflowdiv");
			this.processFlowClick = null;
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
			if (this.processFlowClick) {
				this.processFlowClick.destroy();
			}
		}
	});

	QUnit.test("ProcessFlow first test - creation", function (assert) {
		assert.ok(this.processFlow, "Process flow should be ok");
	});

	QUnit.test("ProcessFlow on node title click event - check", function (assert) {
		// In this test, the only assertion is inside the 'NodeTitlePress' handler, to see, if the event is really called.
		var eventPressed = 0;
		var oData = {
			nodes: [
				{id: "node1", laneId: "id0", title: "title1", children: null}
			],
			lanes: [{
				id: "id0",
				iconSrc: "sap-icon://order-status",
				text: "Id 1 position 0",
				state: [
					{state: ProcessFlowNodeState.Positive, value: 20},
					{state: ProcessFlowNodeState.Negative, value: 30},
					{state: ProcessFlowNodeState.Neutral, value: 30},
					{state: ProcessFlowNodeState.Planned, value: 20},
					{state: ProcessFlowNodeState.Critical, value: 10}
				],
				position: 0
			}]
		};

		var oJModel = new JSONModel(oData);
		this.processFlowClick = new ProcessFlow("pClick", {
			nodes: {
				path: "/nodes",
				template: new ProcessFlowNode({
					nodeId: "{id}",
					laneId: "{laneId}",
					title: "{title}",
					children: "{children}",
					isTitleClickable: true,
					state: ProcessFlowNodeState.Positive,
					stateText: "Acc Document Overdue",
					texts: ["Credit Blocked", "Planned Shipped on 23.02.2014"]
				})
			}, // end of node
			lanes: {
				path: "/lanes",
				template: new ProcessFlowLaneHeader({
					laneId: "{id}",
					iconSrc: "{iconSrc}",
					text: "{text}",
					state: "{state}",
					position: "{position}"
				})
			} // end of headerlane
		});


		this.processFlowClick.setModel(oJModel);
		var sNodeId = this.processFlowClick.getNodes()[0].getId();
		this.processFlowClick.attachNodeTitlePress(function (oEvent) {
			var basicId = sNodeId.slice(0, -1);
			assert.ok(oEvent, "event exists.");
			assert.ok(oEvent.mParameters, "parameters exist ... ");
			assert.equal(oEvent.mParameters.getId(), basicId + eventPressed, "ID is pressed : " + oEvent.mParameters.getId());
			eventPressed++;
		});

		this.processFlowClick.placeAt("processflowdiv");
		sap.ui.getCore().applyChanges();
		var firstTitle = sap.ui.getCore().byId(sNodeId + "-nodeid-anchor-title");
		firstTitle.getDomRef().click();
	});

	QUnit.test("ProcessFlow on node click event - check", function (assert) {
		// here the only assertion is inside handler for the fire event to see, if the event is really called
		var eventPressed = 0;
		var oData = {
			nodes: [
				{id: "node1", laneId: "id0", title: "title1", children: null}
			],
			lanes: [{
				id: "id0",
				iconSrc: "sap-icon://order-status",
				text: "Id 1 position 0",
				state: [
					{state: ProcessFlowNodeState.Positive, value: 20},
					{state: ProcessFlowNodeState.Negative, value: 30},
					{state: ProcessFlowNodeState.Neutral, value: 30},
					{state: ProcessFlowNodeState.Planned, value: 20},
					{state: ProcessFlowNodeState.Critical, value: 10}
				],
				position: 0
			}]
		};

		var oJModel = new JSONModel(oData);
		this.processFlowClick = new ProcessFlow("pClick", {
			nodes: {
				path: "/nodes",
				template: new ProcessFlowNode("__nodeXX", {
					nodeId: "{id}",
					laneId: "{laneId}",
					title: "{title}",
					children: "{children}",
					isTitleClickable: true,
					state: ProcessFlowNodeState.Positive,
					stateText: "Acc Document Overdue",
					texts: ["Credit Blocked", "Planned Shipped on 23.02.2014"]
				})
			}, // end of node
			lanes: {
				path: "/lanes",
				template: new ProcessFlowLaneHeader({
					laneId: "{id}",
					iconSrc: "{iconSrc}",
					text: "{text}",
					state: "{state}",
					position: "{position}"
				})
			} // end of headerlane
		});

		this.processFlowClick.setModel(oJModel);
		this.processFlowClick.attachNodePress(function (oEvent) {
			var basicId = "__nodeXX-pClick-";
			assert.ok(oEvent, "event exists.");
			assert.ok(oEvent.mParameters, "parameters exist ... ");
			assert.equal(oEvent.mParameters.getId(), basicId + eventPressed, "Id is pressed : " + oEvent.mParameters.getId());
			eventPressed++;
		});

		this.processFlowClick.placeAt("processflowdiv");
		sap.ui.getCore().applyChanges();
		var firstNode = sap.ui.getCore().byId("__nodeXX-pClick-0");
		firstNode.getDomRef().click();

		assert.equal(this.processFlowClick.getFocusedNode(), "__nodeXX-pClick-0", "Clicked node has the focus");
	});

	QUnit.module("Algorithmic part", {
		beforeEach: function () {
			this.processFlow = new ProcessFlow(
				"processFlow");
			this.processFlow.placeAt("processflowdiv");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
		}
	});

	QUnit.test("Process flow throws an exception for referring to not existing children", function (assert) {
		//assert.ok(this.processFlow, "Process flow should be ok");
		var testRoot = new ProcessFlow.NodeElement(1, 0, new ProcessFlowNode({
			children: [10, 11, 12]
		}), null);
		try {
			this.processFlow([testRoot]);
		} catch (err) {
			assert.ok(err, "wow === exception :-)");
		}
	});

	QUnit.test("ProcessFlow calculation zero length input", function (assert) {
		assert.ok(this.processFlow, "Process flow should be ok");

		var inputArray = [];
		var matrix = this.processFlow._calculateMatrix(inputArray);
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 0, "Length X is 0");
	});

	QUnit.test("ProcessFlow calculation no children", function (assert) {
		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({nodeId: "zzz"}), null);

		var matrix = this.processFlow._calculateMatrix({'1': testRoot});
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 1, "Length X is 1");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
	});

	QUnit.test("ProcessFlow calculation exactly one child", function (assert) {
		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({nodeId: 1, children: [10]}), null);
		var testChild = new ProcessFlow.NodeElement(10, 1,
			new ProcessFlowNode({nodeId: 10}), [1]);

		var inputMap = {};
		inputMap[1] = testRoot;
		inputMap[10] = testChild;

		var matrix = this.processFlow._calculateMatrix(inputMap);
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 1, "Length X is 1");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testChild, "Child element is properly placed");
	});

	QUnit.test("ProcessFlow calculation all nodes in focused state", function (assert) {

		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({nodeId: 1, children: [10]}), null);
		var testChild = new ProcessFlow.NodeElement(10, 1,
			new ProcessFlowNode({nodeId: 10}), [1]);
		testRoot.oNode.setFocused(true);
		testChild.oNode.setFocused(true);
		var inputMap = {};
		inputMap[1] = testRoot;
		inputMap[10] = testChild;

		var matrix = this.processFlow._calculateMatrix(inputMap);
		assert.equal(matrix.length, 1, "Length X is 1");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testChild, "Child element is properly placed");

		assert.ok(testRoot.oNode.getFocused(), "Root node is focused");
		assert.ok(matrix[0][2].oNode.getFocused(), "Child node is focused");
	});

	QUnit.test("ProcessFlow calculation 1 node in focused state", function (assert) {
		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({nodeId: 1, children: [10]}), null);
		var testChild = new ProcessFlow.NodeElement(10, 1,
			new ProcessFlowNode({nodeId: 10}), [1]);
		testChild.oNode.setFocused(true);
		var inputMap = {};
		inputMap[1] = testRoot;
		inputMap[10] = testChild;

		var matrix = this.processFlow._calculateMatrix(inputMap);
		assert.equal(matrix.length, 1, "Length X is 1");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testChild, "Child element is properly placed");

		assert.ok(!testRoot.oNode.getFocused(), "Root node is not focused");
		assert.ok(matrix[0][2].oNode.getFocused(), "Child node is focused");
	});

	QUnit.test("ProcessFlow calculation 2 from 4 nodes in focused state", function (assert) {
		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({nodeId: 1, children: [10, 11, 12]}), null);
		var testChild1 = new ProcessFlow.NodeElement(10, 1,
			new ProcessFlowNode({nodeId: 10}), [1]);
		var testChild2 = new ProcessFlow.NodeElement(11, 2,
			new ProcessFlowNode({nodeId: 11}), [1]);
		var testChild3 = new ProcessFlow.NodeElement(12, 3,
			new ProcessFlowNode({nodeId: 12}), [1]);

		testChild1.oNode.setFocused(true);
		testChild2.oNode.setFocused(true);
		var inputMap = {'1': testRoot, '10': testChild1, '11': testChild2, '12': testChild3};

		var matrix = this.processFlow._calculateMatrix(inputMap);
		assert.equal(matrix.length, 3, "Length X is 3");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[2][2], testChild1, "Element 1 is properly placed");
		assert.deepEqual(matrix[1][4], testChild2, "Element 2 is properly placed");
		assert.deepEqual(matrix[0][6], testChild3, "Element 3 is properly placed");

		assert.ok(!testRoot.oNode.getFocused(), "Root node is not focused");
		assert.ok(matrix[2][2].oNode.getFocused(), "Child node1 is focused");
		assert.ok(matrix[1][4].oNode.getFocused(), "Child node2 is focused");
		assert.ok(!matrix[0][6].oNode.getFocused(), "Child node3 is not focused");
	});

	QUnit.test("ProcessFlow calculation Simple case 1", function (assert) {
		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({nodeId: 1, children: [10, 11, 12]}), null);
		var testChildren1 = new ProcessFlow.NodeElement(10, 4,
			new ProcessFlowNode({nodeId: 10}), [1]);
		var testChildren2 = new ProcessFlow.NodeElement(11, 3,
			new ProcessFlowNode({nodeId: 11}), [1]);
		var testChildren3 = new ProcessFlow.NodeElement(12, 2,
			new ProcessFlowNode({nodeId: 12, children: [5]}), [1]);
		var testChildren4 = new ProcessFlow.NodeElement(5, 3,
			new ProcessFlowNode({nodeId: 5}), [12]);

		var inputMap = {
			'1': testRoot,
			'10': testChildren1,
			'11': testChildren2,
			'12': testChildren3,
			'5': testChildren4
		};

		var matrix = this.processFlow._calculateMatrix(inputMap);
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 3, "Length X is 3");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][8], testChildren1, "Element 1 is properly placed");
		assert.deepEqual(matrix[1][6], testChildren2, "Element 2 is properly placed");
		assert.deepEqual(matrix[2][4], testChildren3, "Element 3 is properly placed");
		assert.deepEqual(matrix[2][6], testChildren4, "Element 3 is properly placed");
	});

	QUnit.test("ProcessFlow calculation Simple case empty first lane", function (assert) {
		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot = new ProcessFlow.NodeElement(1, 1,
			new ProcessFlowNode({nodeId: 1, children: [10, 11, 12]}), null);
		var testChildren1 = new ProcessFlow.NodeElement(10, 4,
			new ProcessFlowNode({nodeId: 10}), [1]);
		var testChildren2 = new ProcessFlow.NodeElement(11, 3,
			new ProcessFlowNode({nodeId: 11}), [1]);
		var testChildren3 = new ProcessFlow.NodeElement(12, 2,
			new ProcessFlowNode({nodeId: 12, children: [5]}), [1]);
		var testChildren4 = new ProcessFlow.NodeElement(5, 3,
			new ProcessFlowNode({nodeId: 5}), [12]);

		var inputMap = {
			'1': testRoot,
			'10': testChildren1,
			'11': testChildren2,
			'12': testChildren3,
			'5': testChildren4
		};

		var matrix = this.processFlow._calculateMatrix(inputMap);
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 3, "Length X is 3");
		assert.deepEqual(matrix[0][2], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][8], testChildren1, "Element 1 is properly placed");
		assert.deepEqual(matrix[1][6], testChildren2, "Element 2 is properly placed");
		assert.deepEqual(matrix[2][4], testChildren3, "Element 3 is properly placed");
		assert.deepEqual(matrix[2][6], testChildren4, "Element 3 is properly placed");
	});


	QUnit.test("ProcessFlow calculation beauty example2", function (assert) {
		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({nodeId: 1, children: [2, 3, 4]}), null);
		var testChildren1 = new ProcessFlow.NodeElement(2, 1,
			new ProcessFlowNode({nodeId: 2, children: [6]}), [1]);
		var testChildren2 = new ProcessFlow.NodeElement(3, 1,
			new ProcessFlowNode({nodeId: 3, children: [5]}), [1]);
		var testChildren3 = new ProcessFlow.NodeElement(4, 1,
			new ProcessFlowNode({nodeId: 4, children: [6]}), [1]);
		var testChildren4 = new ProcessFlow.NodeElement(5, 2,
			new ProcessFlowNode({nodeId: 5}), [3]);
		var testChildren5 = new ProcessFlow.NodeElement(6, 2,
			new ProcessFlowNode({nodeId: 6}), [2, 3]);

		var inputMap = {
			'1': testRoot,
			'2': testChildren1,
			'3': testChildren2,
			'4': testChildren3,
			'5': testChildren4,
			'6': testChildren5
		};

		var matrix = this.processFlow._calculateMatrix(inputMap);

		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 3, "Length X is 3");

		// this part of the algorithm has not been implemented till now.
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testChildren1, "Element 1 is properly placed");
		assert.deepEqual(matrix[2][2], testChildren2, "Element 2 is properly placed");
		assert.deepEqual(matrix[1][2], testChildren3, "Element 3 is properly placed");
		assert.deepEqual(matrix[2][4], testChildren4, "Element 4 is properly placed");
		assert.deepEqual(matrix[0][4], testChildren5, "Element 5 is properly placed");
	});

	QUnit.test("ProcessFlow calculation Complex case 1", function (assert) {

		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({nodeId: 1, children: [10, 11, 12]}), null);
		var testChildren1 = new ProcessFlow.NodeElement(10, 1,
			new ProcessFlowNode({nodeId: 10, children: [20]}), [1]);
		var testChildren2 = new ProcessFlow.NodeElement(11, 1,
			new ProcessFlowNode({nodeId: 11, children: [21]}), [1]);
		var testChildren3 = new ProcessFlow.NodeElement(12, 1,
			new ProcessFlowNode({nodeId: 12}), [1]);
		var testChildren4 = new ProcessFlow.NodeElement(20, 2,
			new ProcessFlowNode({nodeId: 20}), [10]);
		var testChildren5 = new ProcessFlow.NodeElement(21, 2,
			new ProcessFlowNode({nodeId: 21, children: [31, 51]}), [10]);
		var testChildren6 = new ProcessFlow.NodeElement(31, 3,
			new ProcessFlowNode({nodeId: 31, children: [41]}), [21]);
		var testChildren7 = new ProcessFlow.NodeElement(41, 4,
			new ProcessFlowNode({nodeId: 41}), [31]);
		var testChildren8 = new ProcessFlow.NodeElement(51, 5,
			new ProcessFlowNode({nodeId: 51}), [21]);

		var inputMap = {
			'1': testRoot,
			'10': testChildren1,
			'11': testChildren2,
			'12': testChildren3,
			'20': testChildren4,
			'21': testChildren5,
			'31': testChildren6,
			'41': testChildren7,
			'51': testChildren8
		};

		var matrix = this.processFlow._calculateMatrix(inputMap);

		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 4, "Length X is 4");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testChildren1, "Element 1 is properly placed");
		assert.deepEqual(matrix[1][2], testChildren2, "Element 2 is properly placed");
		assert.deepEqual(matrix[3][2], testChildren3, "Element 3 is properly placed");
		assert.deepEqual(matrix[0][4], testChildren4, "Element 4 is properly placed");
		assert.deepEqual(matrix[1][4], testChildren5, "Element 5 is properly placed");

		assert.deepEqual(matrix[2][6], testChildren6, "Element 6 is properly placed");
		assert.deepEqual(matrix[2][8], testChildren7, "Element 7 is properly placed");
		assert.deepEqual(matrix[1][10], testChildren8, "Element 8 is properly placed");
	});

	QUnit.test("ProcessFlow calculation - More parents case 1", function (assert) {

		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({nodeId: 1, children: [10, 11, 12]}), null);
		var testChildren1 = new ProcessFlow.NodeElement(10, 1,
			new ProcessFlowNode({nodeId: 10, children: [20, 21]}), [1]);
		var testChildren2 = new ProcessFlow.NodeElement(11, 1,
			new ProcessFlowNode({nodeId: 11, children: [20, 21]}), [1]);
		var testChildren3 = new ProcessFlow.NodeElement(12, 1,
			new ProcessFlowNode({nodeId: 12}), [1]);
		var testChildren4 = new ProcessFlow.NodeElement(20, 2,
			new ProcessFlowNode({nodeId: 20}), [10, 11]);
		var testChildren5 = new ProcessFlow.NodeElement(21, 2,
			new ProcessFlowNode({nodeId: 21, children: [31, 51]}), [10]);
		var testChildren6 = new ProcessFlow.NodeElement(31, 3,
			new ProcessFlowNode({nodeId: 31, children: [41]}), [21]);
		var testChildren7 = new ProcessFlow.NodeElement(41, 4,
			new ProcessFlowNode({nodeId: 41}), [31]);
		var testChildren8 = new ProcessFlow.NodeElement(51, 5,
			new ProcessFlowNode({nodeId: 51}), [21]);

		var inputMap = {
			'1': testRoot, '10': testChildren1, '11': testChildren2, '12': testChildren3, '20': testChildren4,
			'21': testChildren5, '31': testChildren6, '41': testChildren7, '51': testChildren8
		};

		var matrix = this.processFlow._calculateMatrix(inputMap);

		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 5, "Length X is 5");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testChildren1, "Element 1 is properly placed");
		assert.deepEqual(matrix[3][2], testChildren2, "Element 2 is properly placed");
		assert.deepEqual(matrix[4][2], testChildren3, "Element 3 is properly placed");
		assert.deepEqual(matrix[2][4], testChildren4, "Element 4 is properly placed");
		assert.deepEqual(matrix[0][4], testChildren5, "Element 5 is properly placed");

		assert.deepEqual(matrix[1][6], testChildren6, "Element 6 is properly placed");
		assert.deepEqual(matrix[1][8], testChildren7, "Element 7 is properly placed");
		assert.deepEqual(matrix[0][10], testChildren8, "Element 8 is properly placed");
	});

	QUnit.test("ProcessFlow calculation - More parents case 2", function (assert) {

		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({nodeId: 1, children: [10, 11, 12]}), null);
		var testChildren1 = new ProcessFlow.NodeElement(10, 1,
			new ProcessFlowNode({nodeId: 10, children: [20, 21]}), [1]);
		var testChildren2 = new ProcessFlow.NodeElement(11, 1,
			new ProcessFlowNode({nodeId: 11, children: [20, 21]}), [1]);
		var testChildren3 = new ProcessFlow.NodeElement(12, 1,
			new ProcessFlowNode({nodeId: 12}), [1]);
		var testChildren4 = new ProcessFlow.NodeElement(20, 2,
			new ProcessFlowNode({nodeId: 20}), [10, 11, 12]);
		var testChildren5 = new ProcessFlow.NodeElement(21, 2,
			new ProcessFlowNode({nodeId: 21, children: [31, 51]}), [10]);
		var testChildren6 = new ProcessFlow.NodeElement(31, 3,
			new ProcessFlowNode({nodeId: 31, children: [41]}), [21]);
		var testChildren7 = new ProcessFlow.NodeElement(41, 4,
			new ProcessFlowNode({nodeId: 41}), [31]);
		var testChildren8 = new ProcessFlow.NodeElement(51, 5,
			new ProcessFlowNode({nodeId: 51}), [21]);

		var inputMap = {
			'1': testRoot, '10': testChildren1, '11': testChildren2, '12': testChildren3,
			'20': testChildren4, '21': testChildren5, '31': testChildren6, '41': testChildren7, '51': testChildren8
		};

		var matrix = this.processFlow._calculateMatrix(inputMap);

		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 5, "Length X is 5");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testChildren1, "Element 1 is properly placed");
		assert.deepEqual(matrix[3][2], testChildren2, "Element 2 is properly placed");
		assert.deepEqual(matrix[4][2], testChildren3, "Element 3 is properly placed");
		assert.deepEqual(matrix[2][4], testChildren4, "Element 4 is properly placed");
		assert.deepEqual(matrix[0][4], testChildren5, "Element 5 is properly placed");

		assert.deepEqual(matrix[1][6], testChildren6, "Element 6 is properly placed");
		assert.deepEqual(matrix[1][8], testChildren7, "Element 7 is properly placed");
		assert.deepEqual(matrix[0][10], testChildren8, "Element 8 is properly placed");
	});

	QUnit.test("ProcessFlow calculation Complex case 2", function (assert) {
		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({nodeId: 1, children: [10, 11]}), null);

		var testChildren10 = new ProcessFlow.NodeElement(10, 1,
			new ProcessFlowNode({nodeId: 10, children: [20, 21]}), [1]);

		var testChildren11 = new ProcessFlow.NodeElement(11, 1,
			new ProcessFlowNode({nodeId: 11, children: [22]}), [1]);

		var testChildren20 = new ProcessFlow.NodeElement(20, 2,
			new ProcessFlowNode({nodeId: 20}), [10]);

		var testChildren21 = new ProcessFlow.NodeElement(21, 2,
			new ProcessFlowNode({nodeId: 21}), [10]);

		var testChildren22 = new ProcessFlow.NodeElement(22, 2,
			new ProcessFlowNode({nodeId: 22, children: [31, 32]}), [11]);

		var testChildren31 = new ProcessFlow.NodeElement(31, 3,
			new ProcessFlowNode({nodeId: 31, children: [41, 42]}), [22]);

		var testChildren32 = new ProcessFlow.NodeElement(32, 3,
			new ProcessFlowNode({nodeId: 32, children: [43]}), [22]);

		var testChildren41 = createNodeElementFromOldVersion(41, 4, "state3", "", 31, null);
		var testChildren42 = createNodeElementFromOldVersion(42,
			4, "state3", "", 31, [51]);
		var testChildren43 = createNodeElementFromOldVersion(43,
			4, "state3", "", 32, [52, 53, 54]);

		var testChildren51 = createNodeElementFromOldVersion(51,
			5, "state3", "", 42, null);
		var testChildren52 = createNodeElementFromOldVersion(52,
			5, "state3", "", 43, null);

		var testChildren53 = createNodeElementFromOldVersion(53,
			5, "state3", "", 43, null);
		var testChildren54 = createNodeElementFromOldVersion(54,
			5, "state3", "", 43, null);

		var inputArray = [];
		inputArray.push(testRoot);
		inputArray.push(testChildren10);
		inputArray.push(testChildren11);
		inputArray.push(testChildren20);
		inputArray.push(testChildren21);
		inputArray.push(testChildren22);
		inputArray.push(testChildren31);
		inputArray.push(testChildren32);
		inputArray.push(testChildren41);
		inputArray.push(testChildren42);
		inputArray.push(testChildren43);
		inputArray.push(testChildren51);
		inputArray.push(testChildren52);
		inputArray.push(testChildren53);
		inputArray.push(testChildren54);

		var inputMap = {};
		for (var i = 0; i < inputArray.length; i++) {
			inputMap[inputArray[i].nodeId] = inputArray[i];
		}

		var matrix = this.processFlow._calculateMatrix(inputMap);

		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 7, "Length X is 7");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");

		assert.deepEqual(matrix[0][2], testChildren10, "Element 10 is properly placed");
		assert.deepEqual(matrix[2][2], testChildren11, "Element 11 is properly placed");

		assert.deepEqual(matrix[0][4], testChildren20, "Element 20 is properly placed");
		assert.deepEqual(matrix[1][4], testChildren21, "Element 21 is properly placed");
		assert.deepEqual(matrix[2][4], testChildren22, "Element 22 is properly placed");

		assert.deepEqual(matrix[2][6], testChildren31, "Element 31 is properly placed");
		assert.deepEqual(matrix[4][6], testChildren32, "Element 32 is properly placed");

		assert.deepEqual(matrix[3][8], testChildren41, "Element 41 is properly placed");
		assert.deepEqual(matrix[2][8], testChildren42, "Element 42 is properly placed");
		assert.deepEqual(matrix[4][8], testChildren43, "Element 43 is properly placed");

		assert.deepEqual(matrix[2][10], testChildren51, "Element 51 is properly placed");
		assert.deepEqual(matrix[4][10], testChildren52, "Element 52 is properly placed");
		assert.deepEqual(matrix[5][10], testChildren53, "Element 53 is properly placed");
		assert.deepEqual(matrix[6][10], testChildren54, "Element 54 is properly placed");
	});

	QUnit.test("ProcessFlow calculation 20 children for root", function (assert) {

		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot = createNodeElementFromOldVersion(1, 0,
			"state1", "", null, [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);

		var testChildren10 = createNodeElementFromOldVersion(10, 1, "state1", "", 1, null);
		var testChildren11 = createNodeElementFromOldVersion(11, 1, "state1", "", 1, null);
		var testChildren12 = createNodeElementFromOldVersion(12, 1, "state1", "", 1, null);
		var testChildren13 = createNodeElementFromOldVersion(13, 1, "state1", "", 1, null);
		var testChildren14 = createNodeElementFromOldVersion(14, 1, "state1", "", 1, null);
		var testChildren15 = createNodeElementFromOldVersion(15, 1, "state1", "", 1, null);
		var testChildren16 = createNodeElementFromOldVersion(16, 1, "state1", "", 1, null);
		var testChildren17 = createNodeElementFromOldVersion(17, 1, "state1", "", 1, null);
		var testChildren18 = createNodeElementFromOldVersion(18, 1, "state1", "", 1, null);
		var testChildren19 = createNodeElementFromOldVersion(19, 1, "state1", "", 1, null);
		var testChildren20 = createNodeElementFromOldVersion(20, 1, "state1", "", 1, null);
		var testChildren21 = createNodeElementFromOldVersion(21, 1, "state1", "", 1, null);
		var testChildren22 = createNodeElementFromOldVersion(22, 1, "state1", "", 1, null);
		var testChildren23 = createNodeElementFromOldVersion(23, 1, "state1", "", 1, null);
		var testChildren24 = createNodeElementFromOldVersion(24, 1, "state1", "", 1, null);
		var testChildren25 = createNodeElementFromOldVersion(25, 1, "state1", "", 1, null);
		var testChildren26 = createNodeElementFromOldVersion(26, 1, "state1", "", 1, null);
		var testChildren27 = createNodeElementFromOldVersion(27, 1, "state1", "", 1, null);
		var testChildren28 = createNodeElementFromOldVersion(28, 1, "state1", "", 1, null);
		var testChildren29 = createNodeElementFromOldVersion(29, 1, "state1", "", 1, null);
		var testChildren30 = createNodeElementFromOldVersion(30, 1, "state1", "", 1, null);

		var inputArray = [];
		inputArray.push(testRoot);
		inputArray.push(testChildren10);
		inputArray.push(testChildren11);
		inputArray.push(testChildren12);
		inputArray.push(testChildren13);
		inputArray.push(testChildren14);
		inputArray.push(testChildren15);
		inputArray.push(testChildren16);
		inputArray.push(testChildren17);
		inputArray.push(testChildren18);
		inputArray.push(testChildren19);
		inputArray.push(testChildren20);
		inputArray.push(testChildren21);
		inputArray.push(testChildren22);
		inputArray.push(testChildren23);
		inputArray.push(testChildren24);
		inputArray.push(testChildren25);
		inputArray.push(testChildren26);
		inputArray.push(testChildren27);
		inputArray.push(testChildren28);
		inputArray.push(testChildren29);
		inputArray.push(testChildren30);

		var inputMap = {};
		for (var i = 0; i < inputArray.length; i++) {
			inputMap[inputArray[i].nodeId] = inputArray[i];
		}

		var matrix = this.processFlow._calculateMatrix(inputMap);

		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 21, "Length X is 21");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
	});

	QUnit.test("Check method _addFirstAndLastColumn empty calculation matrix", function (assert) {
		assert.ok(this.processFlow, "the internal matrix variable must exist.");
		var matrix1 = this.processFlow._addFirstAndLastColumn(null);
		assert.ok(matrix1, "Matrix exists");
		assert.equal(matrix1.length, 0, "the length = orig + double + first + last");

		var matrix2 = this.processFlow._addFirstAndLastColumn(new Array(0));
		assert.ok(matrix2, "Matrix exists");
		assert.equal(matrix2.length, 0, "the length = orig + double + first + last");
	});

	QUnit.test("Check method _addFirstAndLastColumn happy test case", function (assert) {
		assert.ok(this.processFlow, "the internal matrix variable must exist.");
		var testRoot = createNodeElementFromOldVersion(1, 0,
			"state1", "", null, [10, 11]);

		var testChildren10 = createNodeElementFromOldVersion(10, 1, "state1", "", 1, [20, 21]);
		var testChildren11 = createNodeElementFromOldVersion(11, 1, "state1", "", 1, [22]);

		var testChildren20 = createNodeElementFromOldVersion(20, 2, "state2", "", 10, null);
		var testChildren21 = createNodeElementFromOldVersion(21, 2, "state2", "", 10, null);
		var testChildren22 = createNodeElementFromOldVersion(22, 2, "state3", "", 11, [31, 32]);

		var testChildren31 = createNodeElementFromOldVersion(31, 3, "state3", "", 22, [41, 42]);
		var testChildren32 = createNodeElementFromOldVersion(32, 3, "state3", "", 22, [43]);

		var testChildren41 = createNodeElementFromOldVersion(41, 4, "state3", "", 31, null);
		var testChildren42 = createNodeElementFromOldVersion(42, 4, "state3", "", 31, [51]);
		var testChildren43 = createNodeElementFromOldVersion(43, 4, "state3", "", 32, [52, 53, 54]);

		var testChildren51 = createNodeElementFromOldVersion(51, 5, "state3", "", 42, null);
		var testChildren52 = createNodeElementFromOldVersion(52, 5, "state3", "", 43, null);
		var testChildren53 = createNodeElementFromOldVersion(53, 5, "state3", "", 43, null);
		var testChildren54 = createNodeElementFromOldVersion(54, 5, "state3", "", 43, null);

		var inputArray = [];
		inputArray.push(testRoot);
		inputArray.push(testChildren10);
		inputArray.push(testChildren11);
		inputArray.push(testChildren20);
		inputArray.push(testChildren21);
		inputArray.push(testChildren22);
		inputArray.push(testChildren31);
		inputArray.push(testChildren32);
		inputArray.push(testChildren41);
		inputArray.push(testChildren42);
		inputArray.push(testChildren43);
		inputArray.push(testChildren51);
		inputArray.push(testChildren52);
		inputArray.push(testChildren53);
		inputArray.push(testChildren54);

		var inputMap = {};
		for (var i = 0; i < inputArray.length; i++) {
			inputMap[inputArray[i].nodeId] = inputArray[i];
		}

		var matrix = this.processFlow._calculateMatrix(inputMap);

		assert.ok(matrix, "matrix created");

		matrix = this.processFlow._addFirstAndLastColumn(matrix);
		assert.ok(matrix, "Matrix exists");
		assert.equal(matrix.length, 7, "the length = orig + double + first + last");
		for (var j = 0; j < matrix.length; j++) {
			assert.equal(matrix[j].length, 13, "the length of single column is 13");
		}
	});

	QUnit.module("Check the init zoomlevel", {
		beforeEach: function () {
			var oData = {
				nodes: [
					{id: "node1", laneId: "id0", title: "title1", children: null}
				],
				lanes:
					[
						{
							id: "id0",
							iconSrc: "sap-icon://order-status",
							text: "Id 1 position 0",
							state: [
								{state: ProcessFlowNodeState.Positive, value: 20},
								{state: ProcessFlowNodeState.Negative, value: 30},
								{state: ProcessFlowNodeState.Neutral, value: 30},
								{state: ProcessFlowNodeState.Planned, value: 20},
								{state: ProcessFlowNodeState.Critical, value: 10}
							],
							position: 0
						}]
			};

			var oJModel = new JSONModel(oData);
			this.processFlow = new ProcessFlow("pNode", {
				nodes: {
					path: "/nodes",
					template: new ProcessFlowNode({
						nodeId: "{id}",
						laneId: "{laneId}",
						title: "{title}",
						children: "{children}",
						isTitleClickable: true,
						state: ProcessFlowNodeState.Positive,
						stateText: "Acc Document Overdue",
						texts: ["Credit Blocked", "Planned Shipped on 23.02.2014"]
					})
				}, // end of node
				lanes: {
					path: "/lanes",
					template: new ProcessFlowLaneHeader({
						laneId: "{id}",
						iconSrc: "{iconSrc}",
						text: "{text}",
						state: "{state}",
						position: "{position}"
					})
				} // end of headerlane
			});

			this.processFlow.setModel(oJModel);
		},
		afterEach: function () {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
		}
	});

	QUnit.test("initial zoom level 4", function (assert) {
		// place processFlow in divs with different sizes and check initial zoomLevel in onAfterRendering
		this.processFlow.placeAt("processflowdiv599");
		sap.ui.getCore().applyChanges();
		assert.equal(this.processFlow.getZoomLevel(), ProcessFlowZoomLevel.Four, "Default zoom level for width 599px is 4");
	});

	QUnit.test("initial zoom level 3", function (assert) {
		// place processFlow in divs with different sizes and check initial zoomLevel in onAfterRendering
		this.processFlow.placeAt("processflowdiv1023");
		sap.ui.getCore().applyChanges();
		assert.equal(this.processFlow.getZoomLevel(), ProcessFlowZoomLevel.Three, "Default zoom level for width 1023px is 3");
	});

	QUnit.test("initial zoom level 2", function (assert) {
		// place processFlow in divs with different sizes and check initial zoomLevel in onAfterRendering
		this.processFlow.placeAt("processflowdiv1025");
		sap.ui.getCore().applyChanges();
		assert.equal(this.processFlow.getZoomLevel(), ProcessFlowZoomLevel.Two, "Default zoom level for width 1025px is 2");
	});

	QUnit.module("Check the zoomlevel effect on components", {
		beforeEach: function () {
			var oData = {
				nodes: [
					{id: "node1", laneId: "id0", title: "title1", children: null}
				],
				lanes:
					[
						{
							id: "id0",
							iconSrc: "sap-icon://order-status",
							text: "Id 1 position 0",
							state: [
								{state: ProcessFlowNodeState.Positive, value: 20},
								{state: ProcessFlowNodeState.Negative, value: 30},
								{state: ProcessFlowNodeState.Neutral, value: 30},
								{state: ProcessFlowNodeState.Planned, value: 20},
								{state: ProcessFlowNodeState.Critical, value: 10}
							],
							position: 0
						}]
			};

			var oJModel = new JSONModel(oData);
			this.processFlow = new ProcessFlow("pNode", {
				nodes: {
					path: "/nodes",
					template: new ProcessFlowNode({
						nodeId: "{id}",
						laneId: "{laneId}",
						title: "{title}",
						children: "{children}",
						isTitleClickable: true,
						state: ProcessFlowNodeState.Positive,
						stateText: "Acc Document Overdue",
						texts: ["Credit Blocked", "Planned Shipped on 23.02.2014"]
					})
				}, // end of node
				lanes: {
					path: "/lanes",
					template: new ProcessFlowLaneHeader({
						laneId: "{id}",
						iconSrc: "{iconSrc}",
						text: "{text}",
						state: "{state}",
						position: "{position}"
					})
				} // end of headerlane
			});
			this.processFlow.setModel(oJModel);
			this.processFlow.placeAt("processflowdiv");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
		}
	});

	QUnit.test("set zoom level", function (assert) {
		this.processFlow.setZoomLevel(ProcessFlowZoomLevel.Four);
		sap.ui.getCore().applyChanges();
		assert.equal(this.processFlow.getZoomLevel(), ProcessFlowZoomLevel.Four, "Assigned zoom level is 4");
	});

	QUnit.test("set zoom level based on string", function (assert) {
		this.processFlow.setZoomLevel("Three");
		sap.ui.getCore().applyChanges();
		assert.equal(this.processFlow.getZoomLevel(), ProcessFlowZoomLevel.Three, "Assigned zoom level is 3");
	});

	QUnit.test("set zoom level wrong value", function (assert) {
		this.processFlow.attachOnError(function (error) {
			assert.ok(error, error);
		});
		assert.expect(1);
		this.processFlow.setZoomLevel("ten");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Zoom level propagation to the node", function (assert) {
		var nodes = this.processFlow.getNodes();
		assert.ok(nodes, "node array exists");
		assert.ok(nodes.length === 1, "there is exactly 1 node.");
		this.processFlow.setZoomLevel(ProcessFlowZoomLevel.Four);
		sap.ui.getCore().applyChanges();
		nodes = this.processFlow.getNodes();
		assert.ok(nodes, "node array exists");
		assert.ok(nodes.length === 1, "there is exactly 1 node.");
		assert.ok(nodes[0]._getZoomLevel() === ProcessFlowZoomLevel.Four, "Zoom level is 4");
	});

	QUnit.test("zoom out method test", function (assert) {
		assert.ok(this.processFlow, "ProcessFlow created.");

		this.processFlow.setZoomLevel(ProcessFlowZoomLevel.One);
		sap.ui.getCore().applyChanges();
		var nodes = this.processFlow.getNodes();
		assert.ok(nodes[0]._getZoomLevel() === ProcessFlowZoomLevel.One, "Zoom level is 1");
		this.processFlow.zoomOut();
		sap.ui.getCore().applyChanges();
		nodes = this.processFlow.getNodes();
		assert.ok(nodes[0]._getZoomLevel() === ProcessFlowZoomLevel.Two, "Zoom level is 2");
		this.processFlow.zoomOut();
		sap.ui.getCore().applyChanges();
		nodes = this.processFlow.getNodes();
		assert.ok(nodes[0]._getZoomLevel() === ProcessFlowZoomLevel.Three, "Zoom level is 3");
		this.processFlow.zoomOut();
		sap.ui.getCore().applyChanges();
		nodes = this.processFlow.getNodes();
		assert.ok(nodes[0]._getZoomLevel() === ProcessFlowZoomLevel.Four, "Zoom level is 4");
		this.processFlow.zoomOut();
		sap.ui.getCore().applyChanges();
		nodes = this.processFlow.getNodes();
		assert.ok(nodes[0]._getZoomLevel() === ProcessFlowZoomLevel.Four, "Zoom level is 4");
	});

	QUnit.test("zoom in method test", function (assert) {
		assert.ok(this.processFlow, "ProcessFlow created.");

		this.processFlow.setZoomLevel(ProcessFlowZoomLevel.Four);
		sap.ui.getCore().applyChanges();
		var nodes = this.processFlow.getNodes();
		assert.ok(nodes[0]._getZoomLevel() === ProcessFlowZoomLevel.Four, "Zoom level is 4");
		this.processFlow.zoomIn();
		sap.ui.getCore().applyChanges();
		nodes = this.processFlow.getNodes();
		assert.ok(nodes[0]._getZoomLevel() === ProcessFlowZoomLevel.Three, "Zoom level is 3");
		this.processFlow.zoomIn();
		sap.ui.getCore().applyChanges();
		nodes = this.processFlow.getNodes();
		assert.ok(nodes[0]._getZoomLevel() === ProcessFlowZoomLevel.Two, "Zoom level is 2");
		this.processFlow.zoomIn();
		sap.ui.getCore().applyChanges();
		nodes = this.processFlow.getNodes();
		assert.ok(nodes[0]._getZoomLevel() === ProcessFlowZoomLevel.One, "Zoom level is 1");
		this.processFlow.zoomIn();
		sap.ui.getCore().applyChanges();
		nodes = this.processFlow.getNodes();
		assert.ok(nodes[0]._getZoomLevel() === ProcessFlowZoomLevel.One, "Zoom level is 1");
	});

	QUnit.module("Check updateModel on flow", {
		beforeEach: function () {
			this.oData = {
				nodes:
					[
						{
							id: "1",
							laneId: "id0",
							title: "Sales Order 150",
							children: [10, 11, 12],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "10",
							laneId: "id4",
							title: "Outbound Delivery 42417000",
							children: null,
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "11",
							laneId: "id3",
							title: "Outbound Delivery 42417001",
							children: null,
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "12",
							laneId: "id2",
							title: "Outbound Delivery 42417002",
							children: [5],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "5",
							laneId: "id3",
							title: "Outbound Delivery 42417003",
							children: null,
							state: ProcessFlowNodeState.Negative
						}
					],
				lanes:
					[
						{id: "id0", position: 0},
						{id: "id1", position: 1},
						{id: "id2", position: 2},
						{id: "id3", position: 3},
						{id: "id4", position: 4}
					] // end of lane array
			};

			var oJModel = new JSONModel(this.oData);
			this.oProcessFlow = new ProcessFlow("pUpdateModel", {
				nodes: {
					path: "/nodes",
					template: new ProcessFlowNode("skuska", {
						nodeId: "{id}",
						laneId: "{laneId}",
						title: "{title}",
						children: "{children}",
						state: "{state}"
					})
				}, // end of node
				lanes: {
					path: "/lanes",
					template: new ProcessFlowLaneHeader({
						laneId: "{id}",
						position: "{position}"
					})
				} // end of lane
			});

			this.oProcessFlow.setModel(oJModel);
			this.oProcessFlow.placeAt("processflowdiv");
			sap.ui.getCore().applyChanges();

		},
		afterEach: function () {
			if (this.oProcessFlow) {
				this.oProcessFlow.destroy();
			}
		}
	});

	QUnit.test("ProcessFlow calculation update model", function (assert) {

		var matrix = this.oProcessFlow._getOrCreateProcessFlow();
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 3, "Length X is 3");

		assert.deepEqual(matrix[0][1].getNodeId(), "1", "Root element is properly placed");

		assert.deepEqual(matrix[0][9].getNodeId(), "10", "Element 1 is properly placed");
		assert.deepEqual(matrix[1][7].getNodeId(), "11", "Element 2 is properly placed");
		assert.deepEqual(matrix[2][5].getNodeId(), "12", "Element 3 is properly placed");
		assert.deepEqual(matrix[2][7].getNodeId(), "5", "Element 4 is properly placed");


		var textToCompare = jQuery("#skuska-pUpdateModel-0-nodeid-anchor-title-inner").text();
		assert.ok(textToCompare, "text for node 0 is not empty.");
		assert.equal(textToCompare.indexOf("Sales Order 150"), 0, "The node skuska contains the sales order text");
		this.oData.nodes[0].title = "changed title";
		this.oProcessFlow.updateModel();
		textToCompare = jQuery("#skuska-pUpdateModel-0-nodeid-anchor-title-inner").text();
		assert.ok(textToCompare, "text for node 0 is not empty.");
		assert.equal(textToCompare.indexOf("changed title"), 0, "The node skuska contains the changed title text");
	});

	QUnit.module("Check layout optimized on process flow", {
		beforeEach: function () {
			this.oData = {
				nodes:
					[
						{
							id: "1",
							laneId: "id0",
							title: "Sales Order 150",
							children: [2, 6],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "2",
							laneId: "id1",
							title: "Outbound Delivery 42417000",
							children: [3],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "6",
							laneId: "id1",
							title: "Outbound Delivery 42417001",
							children: [3],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "3",
							laneId: "id2",
							title: "Outbound Delivery 42417002",
							children: [4, 5],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "4",
							laneId: "id3",
							title: "Outbound Delivery 42417003",
							children: null,
							state: ProcessFlowNodeState.Negative
						},
						{
							id: "5",
							laneId: "id3",
							title: "Outbound Delivery 42417004",
							children: null,
							state: ProcessFlowNodeState.Negative
						}
					],
				lanes:
					[
						{id: "id0", position: 0},
						{id: "id1", position: 1},
						{id: "id2", position: 2},
						{id: "id3", position: 3}
					] // end of lane array
			};

			var oJModel = new JSONModel(this.oData);
			this.oProcessFlow = new ProcessFlow("pUpdateModel", {
				nodes: {
					path: "/nodes",
					template: new ProcessFlowNode("skuska", {
						nodeId: "{id}",
						laneId: "{laneId}",
						title: "{title}",
						children: "{children}",
						state: "{state}"
					})
				}, // end of node
				lanes: {
					path: "/lanes",
					template: new ProcessFlowLaneHeader({
						laneId: "{id}",
						position: "{position}"
					})
				} // end of lane
			});

			this.oProcessFlow.setModel(oJModel);
			this.oProcessFlow.placeAt("processflowdiv");
			sap.ui.getCore().applyChanges();

		},
		afterEach: function () {
			if (this.oProcessFlow) {
				this.oProcessFlow.destroy();
			}
		}
	});

	QUnit.test("ProcessFlow layout optimization called", function (assert) {
		// Arrange
		var mInitial = this.oProcessFlow._getOrCreateProcessFlow();
		var bOptimized = this.oProcessFlow._isLayoutOptimized;

		// Act
		this.oProcessFlow.optimizeLayout();
		var bOptimizedNew = this.oProcessFlow._isLayoutOptimized;
		var mOptimized = this.oProcessFlow._getOrCreateProcessFlow();

		// Assert
		// initial mode
		assert.ok(mInitial, "Matrix is at least created");
		assert.equal(mInitial.length, 3, "Initial length X is 3");
		assert.ok(!bOptimized, "Matrix is not optimized");

		assert.ok(mOptimized, "Optimized Matrix is created");
		assert.equal(mOptimized.length, 2, "Optimized matrix length X is 2");
		assert.ok(bOptimizedNew, "Matrix is optimized");

		assert.deepEqual(mInitial[2][3].getNodeId(), "6", "Element 6 is properly placed in the initial matrix");
		assert.deepEqual(mOptimized[1][3].getNodeId(), "6", "Element 6 is properly placed in the optimized matrix");
	});

	QUnit.test("ProcessFlow layout optimization called", function (assert) {
		// Arrange
		var mInitial = this.oProcessFlow._getOrCreateProcessFlow();
		var bOptimized = this.oProcessFlow._isLayoutOptimized;

		// Act
		this.oProcessFlow.optimizeLayout(true);
		var bOptimizedNew = this.oProcessFlow._isLayoutOptimized;
		var mOptimized = this.oProcessFlow._getOrCreateProcessFlow();

		// Assert
		// initial mode
		assert.ok(mInitial, "Matrix is at least created");
		assert.equal(mInitial.length, 3, "Initial length X is 3");
		assert.ok(!bOptimized, "Matrix is not optimized");

		assert.ok(mOptimized, "Optimized Matrix is created");
		assert.equal(mOptimized.length, 2, "Optimized matrix length X is 2");
		assert.ok(bOptimizedNew, "Matrix is optimized");

		assert.deepEqual(mInitial[2][3].getNodeId(), "6", "Element 6 is properly placed in the initial matrix");
		assert.deepEqual(mOptimized[1][3].getNodeId(), "6", "Element 6 is properly placed in the optimized matrix");
	});

	QUnit.test("ProcessFlow layout optimization reversed", function (assert) {
		// Arrange
		var mInitial = this.oProcessFlow._getOrCreateProcessFlow();
		var bOptimized = this.oProcessFlow._isLayoutOptimized;

		// Act
		// optimized mode
		this.oProcessFlow.optimizeLayout(true);
		var bOptimizedNew = this.oProcessFlow._isLayoutOptimized;
		var mOptimized = this.oProcessFlow._getOrCreateProcessFlow();

		// reversed optimized mode
		this.oProcessFlow.optimizeLayout(false);
		var mUnoptimized = this.oProcessFlow._getOrCreateProcessFlow();
		var bOptimizedReverse = this.oProcessFlow._isLayoutOptimized;

		// Assert
		// initial mode
		assert.ok(mInitial, "Matrix is created");
		assert.equal(mInitial.length, 3, "Initial matrix length X is 3");
		assert.ok(!bOptimized, "Initial mode is not optimized");

		// optimized mode
		assert.ok(mOptimized, "Matrix is optimized");
		assert.equal(mOptimized.length, 2, "Optimized length X is 2");
		assert.ok(bOptimizedNew, "Matrix is optimized");

		// reversed optimized mode
		assert.ok(mUnoptimized, "Matrix is optimized");
		assert.equal(mUnoptimized.length, 3, "Unoptimized length X is 3");
		assert.ok(!bOptimizedReverse, "Matrix is unoptimized");

		// nodes position
		assert.deepEqual(mInitial[2][3].getNodeId(), "6", "Element 6 is properly placed in the initial matrix");
		assert.deepEqual(mOptimized[1][3].getNodeId(), "6", "Element 6 is properly placed in the optimized matrix");
		assert.deepEqual(mUnoptimized[2][3].getNodeId(), "6", "Element 6 is properly placed in the unoptimized matrix");
	});

	QUnit.test("ProcessFlow layout optimization called with return parameter", function (assert) {
		// Arrange
		// Act
		var oProcessFlowReturn = this.oProcessFlow.optimizeLayout();

		// Assert
		assert.deepEqual(oProcessFlowReturn, this.oProcessFlow, "The same process flow object returned");
	});

	QUnit.test("ProcessFlow layout optimization called for mode switch between normal and optimize-layout - no mode change", function (assert) {
		// Arrange
		var oSpy = sinon.spy(this.oProcessFlow, "updateModel");
		var bOptimized = this.oProcessFlow._isLayoutOptimized;
		// Act
		this.oProcessFlow.optimizeLayout(bOptimized);
		var bOptimizedNew = this.oProcessFlow._isLayoutOptimized;
		// Assert
		assert.ok(!oSpy.calledOnce, "The function updateModel has not been called because the mode was not changed.");
		assert.equal(bOptimized, bOptimizedNew, "The optimized flag was not changed");
	});

	QUnit.test("ProcessFlow layout optimization called for mode switch between normal and optimize-layout", function (assert) {
		// Arrange
		var oSpy = sinon.spy(this.oProcessFlow, "updateModel");
		var bOptimized = this.oProcessFlow._isLayoutOptimized;
		// Act
		this.oProcessFlow.optimizeLayout(!bOptimized);
		var bOptimizedNew = this.oProcessFlow._isLayoutOptimized;
		// Assert
		assert.ok(oSpy.calledOnce, "The function updateModel has been called because the mode was changed.");
		assert.equal(!bOptimized, bOptimizedNew, "The optimized flag was changed");
	});

	QUnit.module("Check updateNodesOnly on changed node content", {
		beforeEach: function () {
			this.oData = {
				nodes:
					[
						{
							id: "1",
							laneId: "id0",
							title: "Sales Order 150",
							children: [2],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "2",
							laneId: "id1",
							title: "Outbound Delivery 1",
							children: [3],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "3",
							laneId: "id1",
							title: "Outbound Delivery 42417001",
							children: [4],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "4",
							laneId: "id2",
							title: "Invoice 1234",
							children: null,
							state: ProcessFlowNodeState.Positive
						}
					],
				lanes:
					[
						{id: "id0", position: 0},
						{id: "id1", position: 1},
						{id: "id2", position: 2}
					] // end of lane array
			};

			var oJModel = new JSONModel(this.oData);
			this.oProcessFlow = new ProcessFlow("PFUpdateNodes", {
				nodes: {
					path: "/nodes",
					template: new ProcessFlowNode("testNode", {
						nodeId: "{id}",
						laneId: "{laneId}",
						title: "{title}",
						children: "{children}",
						state: "{state}",
						stateText: "{stateText}",
						texts: "{texts}"
					})
				}, // end of node
				lanes: {
					path: "/lanes",
					template: new ProcessFlowLaneHeader({
						laneId: "{id}",
						position: "{position}"
					})
				} // end of lane
			});

			this.oProcessFlow.setModel(oJModel);
			this.oProcessFlow.placeAt("processflowdiv");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.oProcessFlow) {
				this.oProcessFlow.destroy();
			}
		}
	});

	QUnit.test("ProcessFlow update nodes content", function (assert) {
		this.oData.nodes[1].title = "changed title";
		this.oData.nodes[1].state = ProcessFlowNodeState.Negative;
		this.oData.nodes[1].stateText = "changed stateText";
		this.oData.nodes[1].texts = ["changed text"];
		this.oProcessFlow.updateNodesOnly();

		var textToCompare = jQuery("#testNode-PFUpdateNodes-1-nodeid-anchor-title-inner").text();
		assert.ok(textToCompare, "Text for node 1 is not empty.");
		assert.equal(textToCompare.indexOf("changed title"), 0, "The node testNode contains the changed title text");

		textToCompare = jQuery("#testNode-PFUpdateNodes-1-stateText-inner").text();
		assert.ok(textToCompare, "stateText for node 1 is not empty.");
		assert.equal(textToCompare.indexOf("changed stateText"), 0, "The node testNode contains the changed state text");

		textToCompare = jQuery("#testNode-PFUpdateNodes-1-icon-container").hasClass("sapSuiteUiCommonsProcessFlowNodeStateNegative");
		assert.ok(textToCompare, "The node testNode has the changed state.");

		textToCompare = jQuery("#testNode-PFUpdateNodes-1-text1").text();
		assert.ok(textToCompare, "Text1 for node 1 is not empty.");
		assert.equal(textToCompare.indexOf("changed text"), 0, "The node testNode contains the changed text");
	});

	QUnit.module("Apply node display state changes", {
		beforeEach: function () {
			this.oData = {
				nodes:
					[
						{
							id: "1",
							laneId: "id0",
							title: "Sales Order 150",
							children: [10, 11, 12],
							state: ProcessFlowNodeState.Positive,
							highlighted: false
						},
						{
							id: "10",
							laneId: "id4",
							title: "Outbound Delivery 42417000",
							children: null,
							state: ProcessFlowNodeState.Critical,
							highlighted: false
						},
						{
							id: "11",
							laneId: "id3",
							title: "Outbound Delivery 42417001",
							children: null,
							state: ProcessFlowNodeState.Positive,
							highlighted: false
						},
						{
							id: "12",
							laneId: "id2",
							title: "Outbound Delivery 42417002",
							children: [5],
							state: ProcessFlowNodeState.Positive,
							highlighted: false
						},
						{
							id: "5",
							laneId: "id3",
							title: "Outbound Delivery 42417003",
							children: null,
							state: ProcessFlowNodeState.Negative,
							highlighted: false
						}
					],
				lanes:
					[
						{id: "id0", position: 0},
						{id: "id1", position: 1},
						{id: "id2", position: 2},
						{id: "id3", position: 3},
						{id: "id4", position: 4}
					] // end of lane array
			};

			var oJModel = new JSONModel(this.oData);
			this.oProcessFlow = new ProcessFlow({
				nodes: {
					path: "/nodes",
					template: new ProcessFlowNode({
						nodeId: "{id}",
						laneId: "{laneId}",
						title: "{title}",
						children: "{children}",
						state: "{state}",
						highlighted: "{highlighted}",
						focused: "{focused}"
					})
				}, // end of node
				lanes: {
					path: "/lanes",
					template: new ProcessFlowLaneHeader({
						laneId: "{id}",
						position: "{position}"
					})
				} // end of lane
			});

			this.oProcessFlow.setModel(oJModel);
			this.oProcessFlow.placeAt("processflowdiv");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.oProcessFlow) {
				this.oProcessFlow.destroy();
			}
		}
	});

	QUnit.test("ProcessFlow calculation apply node display state zero node input", function (assert) {
		var emtyProcessFlow = new ProcessFlow("emptyApplyNodeModel");
		assert.ok(emtyProcessFlow.applyNodeDisplayState() == null, "Function must survive without exception ...");
	});

	QUnit.test("ProcessFlow calculation apply node display state happy test case", function (assert) {
		this.oData.nodes[0].highlighted = true;
		this.oProcessFlow.getModel().refresh();
		this.oProcessFlow.applyNodeDisplayState();
		var nodes = this.oProcessFlow.getNodes();
		for (var i = 0; i < nodes.length; i++) {
			switch (nodes[i].getNodeId()) {
				case "1":
					assert.equal(nodes[i]._getDisplayState(), ProcessFlowDisplayState.Highlighted, "The node should be highlighlited " + nodes[i].getNodeId());
					break;
				case "10":
					assert.equal(nodes[i]._getDisplayState(), ProcessFlowDisplayState.Dimmed, "The node should be dimmed " + nodes[i].getNodeId());
					break;
				case "11":
					assert.equal(nodes[i]._getDisplayState(), ProcessFlowDisplayState.Dimmed, "The node should be dimmed " + nodes[i].getNodeId());
					break;
				case "12":
					assert.equal(nodes[i]._getDisplayState(), ProcessFlowDisplayState.Dimmed, "The node should be dimmed " + nodes[i].getNodeId());
					break;
				case "5":
					assert.equal(nodes[i]._getDisplayState(), ProcessFlowDisplayState.Dimmed, "The node should be dimmed " + nodes[i].getNodeId());
					break;
				default:
					assert.ok(false);
					break;
			}
		}
		this.oData.nodes[0].highlighted = false;
		this.oProcessFlow.getModel().refresh();
		this.oProcessFlow.applyNodeDisplayState();
		nodes = this.oProcessFlow.getNodes();
		for (var j = 0; j < nodes.length; j++) {
			switch (nodes[j].getNodeId()) {
				case "1":
					assert.equal(nodes[j]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[j].getNodeId());
					break;
				case "10":
					assert.equal(nodes[j]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[j].getNodeId());
					break;
				case "11":
					assert.equal(nodes[j]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[j].getNodeId());
					break;
				case "12":
					assert.equal(nodes[j]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[j].getNodeId());
					break;
				case "5":
					assert.equal(nodes[j]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[j].getNodeId());
					break;
				default:
					assert.ok(false);
					break;
			}
		}
		this.oData.nodes[0].focused = true;
		this.oProcessFlow.getModel().refresh();
		this.oProcessFlow.applyNodeDisplayState();
		nodes = this.oProcessFlow.getNodes();
		for (var k = 0; k < nodes.length; k++) {
			switch (nodes[k].getNodeId()) {
				case "1":
					assert.equal(nodes[k]._getDisplayState(), ProcessFlowDisplayState.RegularFocused, "The node should be regular focused " + nodes[k].getNodeId());
					break;
				case "10":
					assert.equal(nodes[k]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[k].getNodeId());
					break;
				case "11":
					assert.equal(nodes[k]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[k].getNodeId());
					break;
				case "12":
					assert.equal(nodes[k]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[k].getNodeId());
					break;
				case "5":
					assert.equal(nodes[k]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[k].getNodeId());
					break;
				default:
					assert.ok(false);
					break;
			}
		}

	});

	QUnit.test("More nodes in the highligted state", function (assert) {
		this.oData.nodes[0].highlighted = true;
		this.oData.nodes[1].highlighted = true;
		this.oData.nodes[1].focused = true;

		this.oProcessFlow.getModel().refresh();
		this.oProcessFlow.applyNodeDisplayState();
		var nodes = this.oProcessFlow.getNodes();

		for (var i = 0; i < nodes.length; i++) {
			switch (nodes[i].getNodeId()) {
				case "1":
					assert.equal(nodes[i]._getDisplayState(), ProcessFlowDisplayState.Highlighted, "The node should be regular focused " + nodes[i].getNodeId());
					break;
				case "10":
					assert.equal(nodes[i]._getDisplayState(), ProcessFlowDisplayState.HighlightedFocused, "The node should be regular " + nodes[i].getNodeId());
					break;
				case "11":
					assert.equal(nodes[i]._getDisplayState(), ProcessFlowDisplayState.Dimmed, "The node should be regular " + nodes[i].getNodeId());
					break;
				case "12":
					assert.equal(nodes[i]._getDisplayState(), ProcessFlowDisplayState.Dimmed, "The node should be regular " + nodes[i].getNodeId());
					break;
				case "5":
					assert.equal(nodes[i]._getDisplayState(), ProcessFlowDisplayState.Dimmed, "The node should be regular " + nodes[i].getNodeId());
					break;
				default:
					assert.ok(false);
					break;

			}
		}
		this.oData.nodes[0].highlighted = false;
		this.oData.nodes[1].highlighted = false;
		this.oData.nodes[1].focused = false;

		this.oData.nodes[2].highlighted = true;
		this.oData.nodes[3].highlighted = true;
		this.oData.nodes[3].focused = true;

		this.oProcessFlow.getModel().refresh();
		this.oProcessFlow.applyNodeDisplayState();
		nodes = this.oProcessFlow.getNodes();

		for (var j = 0; j < nodes.length; j++) {
			switch (nodes[j].getNodeId()) {
				case "1":
					assert.equal(nodes[j]._getDisplayState(), ProcessFlowDisplayState.Dimmed, "The node should be regular focused " + nodes[j].getNodeId());
					break;
				case "10":
					assert.equal(nodes[j]._getDisplayState(), ProcessFlowDisplayState.Dimmed, "The node should be regular " + nodes[j].getNodeId());
					break;
				case "11":
					assert.equal(nodes[j]._getDisplayState(), ProcessFlowDisplayState.Highlighted, "The node should be regular " + nodes[j].getNodeId());
					break;
				case "12":
					assert.equal(nodes[j]._getDisplayState(), ProcessFlowDisplayState.HighlightedFocused, "The node should be regular " + nodes[j].getNodeId());
					break;
				case "5":
					assert.equal(nodes[j]._getDisplayState(), ProcessFlowDisplayState.Dimmed, "The node should be regular " + nodes[j].getNodeId());
					break;
				default:
					assert.ok(false);
					break;
			}
		}

		this.oData.nodes[1].focused = true;

		this.oData.nodes[2].highlighted = false;
		this.oData.nodes[3].highlighted = false;
		this.oData.nodes[3].focused = false;

		this.oProcessFlow.getModel().refresh();
		this.oProcessFlow.applyNodeDisplayState();
		nodes = this.oProcessFlow.getNodes();

		for (var k = 0; k < nodes.length; k++) {
			switch (nodes[k].getNodeId()) {
				case "1":
					assert.equal(nodes[k]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[k].getNodeId());
					break;
				case "10":
					assert.equal(nodes[k]._getDisplayState(), ProcessFlowDisplayState.RegularFocused, "The node should be regular " + nodes[k].getNodeId());
					break;
				case "11":
					assert.equal(nodes[k]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[k].getNodeId());
					break;
				case "12":
					assert.equal(nodes[k]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[k].getNodeId());
					break;
				case "5":
					assert.equal(nodes[k]._getDisplayState(), ProcessFlowDisplayState.Regular, "The node should be regular " + nodes[k].getNodeId());
					break;
				default:
					assert.ok(false);
					break;
			}
		}
	});

	QUnit.module("Testcases for the wrong data", {
		beforeEach: function () {
		},
		afterEach: function () {
		}
	});

	QUnit.test("ProcessFlow wrong test case - wrong children definition", function (assert) {
		var oDataWrong = {
			nodes: [
				{id: "1", laneId: "id1", title: "title 1", children: [10, 11, 12]},
				{id: "10", laneId: "id3", title: "title 10", children: null}
			],
			lanes: [
				{id: "id1", iconSrc: "sap-icon://order-status", text: "In Delivery", position: 1}, // first lane element
				{id: "id3", iconSrc: "sap-icon://order-status", text: "In Delivery", position: 3} // second lane element
			]
		}; // end of data for control
		var oJModelWrong = new JSONModel(oDataWrong);
		var oProcessFlowWrong = new ProcessFlow("wrongChildrenDef", {
			nodes: {
				path: "/nodes",
				template: new ProcessFlowNode({
					nodeId: "{id}",
					laneId: "{laneId}",
					title: "{title}",
					children: "{children}",
					isTitleClickable: true,
					state: ProcessFlowNodeState.Positive,
					stateText: "state text",
					texts: ["Transportation planned", "Planned Shipped on 23.02.2014"]
				})
			}, // end of node
			lanes: {
				path: "/lanes",
				template: new ProcessFlowLaneHeader({
					laneId: "{id}",
					iconSrc: "{iconSrc}",
					text: "{text}",
					state: "{amounts}",
					position: "{position}"
				})
			} // end of headerlane
		});
		oProcessFlowWrong.setModel(oJModelWrong);
		oProcessFlowWrong.attachOnError(function (oEvent) {
			assert.ok(oEvent, "Error was thrown");
			assert.ok(oEvent.getParameters().text, "Error loading data: Node was referenced as child but is not defined");
		});

		// missing header should not matter - in this case the control is not rendered
		assert.expect(2);
		oProcessFlowWrong.placeAt("processflowdiv");
		sap.ui.getCore().applyChanges();
		oProcessFlowWrong.destroy();
	});

	QUnit.test("ProcessFlow wrong test case - circular dependency", function (assert) {
		var oDataWrong = {
			nodes: [
				{id: "1", laneId: "id1", title: "title 1", children: [9, 10]},
				{id: "9", laneId: "id2", title: "title 9", children: [10]},
				{id: "10", laneId: "id3", title: "title 10", children: [9]}
			],
			lanes: [
				{id: "id1", iconSrc: "sap-icon://order-status", text: "In Delivery", position: 1}, // first lane element
				{id: "id2", iconSrc: "sap-icon://order-status", text: "In Delivery", position: 2}, // first lane element
				{id: "id3", iconSrc: "sap-icon://order-status", text: "In Delivery", position: 3} // second lane element
			]
		}; // end of data for control
		var oJModelWrong = new JSONModel(oDataWrong);
		var oProcessFlowWrong = new ProcessFlow("circularDependency", {
			nodes: {
				path: "/nodes",
				template: new ProcessFlowNode({
					nodeId: "{id}",
					laneId: "{laneId}",
					title: "{title}",
					children: "{children}",
					isTitleClickable: true,
					state: ProcessFlowNodeState.Positive,
					stateText: "state text",
					texts: ["Transportation planned", "Planned Shipped on 23.02.2014"]
				})
			}, // end of node
			lanes: {
				path: "/lanes",
				template: new ProcessFlowLaneHeader({
					laneId: "{id}",
					iconSrc: "{iconSrc}",
					text: "{text}",
					state: "{amounts}",
					position: "{position}"
				})
			} // end of headerlane
		});

		oProcessFlowWrong.setModel(oJModelWrong);
		oProcessFlowWrong.attachOnError(function (oEvent) {
			assert.ok(oEvent, "Error was thrown");
			assert.ok(oEvent.getParameters().text, "Error loading data: Child nodes define connections to parent nodes");
		});

		// missing header should not matter - in this case the control is not rendered
		assert.expect(2);
		oProcessFlowWrong.placeAt("processflowdiv");
		sap.ui.getCore().applyChanges();
		oProcessFlowWrong.destroy();
	});

	QUnit.module("Testcases for the zooming", {
		beforeEach: function () {
			this.processFlow = new ProcessFlow("processFlow");
			this.processFlow.placeAt("processflowdiv");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.processFlow) {
				this.processFlow.destroy();
				this.processFlow = null;
			}
		}
	});

	QUnit.test("ProcessFlow zooming", function (assert) {
		var $scrollContainer = this.processFlow.$();
		var oScrollContainerContextOld = {
			scrollWidth: 800,
			scrollHeight: 600,
			scrollLeft: 50,
			scrollTop: 20
		};
		var oScrollContainerContextExpected = {
			scrollWidth: $scrollContainer.context.scrollWidth,
			scrollHeight: $scrollContainer.context.scrollHeight,
			scrollLeft: Math.round($scrollContainer.context.scrollWidth / oScrollContainerContextOld.scrollWidth * oScrollContainerContextOld.scrollLeft),
			scrollTop: Math.round($scrollContainer.context.scrollHeight / oScrollContainerContextOld.scrollHeight * oScrollContainerContextOld.scrollTop)
		};

		var oScrollContainerContextNew = this.processFlow._getScrollContainerOnZoomChanged(oScrollContainerContextOld, $scrollContainer);

		assert.deepEqual(oScrollContainerContextNew, oScrollContainerContextExpected, "Scroll parameters of ProcessFlow container set properly");
	});

	QUnit.module("Testcases for the wheel zooming", {
		beforeEach: function () {
		},
		afterEach: function () {
		}
	});

	QUnit.test("ProcessFlow wheel zooming", function (assert) {
		if (Device.browser.mobile) {
			assert.expect(0);
			return;
		}
		// here the only assertion is inside handler for the fire event to see, if the event is really called
		var oData = {
			nodes: [{
				id: "node1",
				laneId: "id0",
				title: "title1",
				children: null
			}],
			lanes: [{
				id: "id0",
				iconSrc: "sap-icon://order-status",
				text: "Id 1 position 0",
				state: [{
					state: ProcessFlowNodeState.Positive,
					value: 20
				}, {
					state: ProcessFlowNodeState.Negative,
					value: 30
				}, {
					state: ProcessFlowNodeState.Neutral,
					value: 30
				}, {
					state: ProcessFlowNodeState.Planned,
					value: 20
				}, {
					state: ProcessFlowNodeState.Critical,
					value: 10
				}],
				position: 0
			}]
		};
		var processFlowClick = new ProcessFlow("pWheelZooming", {
			nodes: {
				path: "/nodes",
				template: new ProcessFlowNode({
					nodeId: "{id}",
					laneId: "{laneId}",
					title: "{title}",
					children: "{children}",
					isTitleClickable: true,
					state: ProcessFlowNodeState.Positive,
					stateText: "Acc Document Overdue",
					texts: ["Credit Blocked", "Planned Shipped on 23.02.2014"]
				})
			}, // end of node
			lanes: {
				path: "/lanes",
				template: new ProcessFlowLaneHeader({
					laneId: "{id}",
					iconSrc: "{iconSrc}",
					text: "{text}",
					state: "{state}",
					position: "{position}"
				})
			}
		});
		var oJModel = new JSONModel(oData);
		processFlowClick.setModel(oJModel);
		processFlowClick.placeAt("processflowdiv");
		processFlowClick.setZoomLevel(ProcessFlowZoomLevel.Two);
		sap.ui.getCore().applyChanges();
		var e1 = jQuery.Event("DOMMouseScroll", { //eslint-disable-line
			originalEvent: {
				detail: 42
			}
		});
		var e2 = jQuery.Event("mousewheel", { //eslint-disable-line
			originalEvent: {
				wheelDelta: -42
			}
		});
		jQuery('#pWheelZooming-scrollContainer').trigger(e1);
		jQuery('#pWheelZooming-scrollContainer').trigger(e2);
		sap.ui.getCore().applyChanges();
		assert.equal(processFlowClick.getZoomLevel(), "Three", "one wheel event to level Three");
		// Reset Wheelmouse Timer
		processFlowClick._wheelTimeout = null;
		processFlowClick._wheelCalled = false;
		var e3 = jQuery.Event("DOMMouseScroll", { //eslint-disable-line
			originalEvent: {
				detail: 42
			}
		});
		var e4 = jQuery.Event("mousewheel", { //eslint-disable-line
			originalEvent: {
				wheelDelta: -42
			}
		});
		jQuery('#pWheelZooming-scrollContainer').trigger(e3);
		jQuery('#pWheelZooming-scrollContainer').trigger(e4);
		sap.ui.getCore().applyChanges();
		assert.equal(processFlowClick.getZoomLevel(), "Four", "one wheel event to level Four after 301ms timeout");
		processFlowClick.destroy();
	});

	QUnit.module("Multiple roots", {
		beforeEach: function () {
			this.processFlow = new ProcessFlow("processFlow");
			this.processFlow.placeAt("processflowdiv");
			this.processFlowClick = null;
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
			if (this.processFlowClick) {
				this.processFlowClick.destroy();
			}
		}
	});

	QUnit.test("first example connection together at lane 3", function (assert) {
		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot1 = createNodeElementFromOldVersion(1, 0, "stateR", "", null, [11]);
		var testRoot2 = createNodeElementFromOldVersion(2, 0, "stateR", "", null, [12]);

		var testChildren11 = createNodeElementFromOldVersion(11, 1, "stateQ", "", [1], [20]);
		var testChildren12 = createNodeElementFromOldVersion(12, 1, "stateQ", "", [2], [20]);

		var testChildren20 = createNodeElementFromOldVersion(20, 2, "stateSO", "", [11, 12], [31, 32]);

		var testChildren31 = createNodeElementFromOldVersion(31, 3, "stateDel", "", [20], [41, 42]);
		var testChildren32 = createNodeElementFromOldVersion(32, 3, "stateDel", "", [20], null);

		var testChildren41 = createNodeElementFromOldVersion(41, 4, "stateCI", "", [31], null);
		var testChildren42 = createNodeElementFromOldVersion(42, 4, "stateCI", "", [31], null);

		var inputArray = [];
		inputArray.push(testRoot1);
		inputArray.push(testRoot2);
		inputArray.push(testChildren11);
		inputArray.push(testChildren12);
		inputArray.push(testChildren20);
		inputArray.push(testChildren31);
		inputArray.push(testChildren32);
		inputArray.push(testChildren41);
		inputArray.push(testChildren42);

		var mapInputObject = {};
		for (var i = 0; i < inputArray.length; i++) {
			mapInputObject[inputArray[i].nodeId] = inputArray[i];
		}
		var matrix = this.processFlow._calculateMatrix(mapInputObject);
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 4, "Length X is 4");
		assert.deepEqual(matrix[0][0], testRoot1, "Root element 1 is properly placed");
		assert.deepEqual(matrix[3][0], testRoot2, "Root element 2 is properly placed");

		assert.deepEqual(matrix[0][2], testChildren11, "Element 11 is properly placed");
		assert.deepEqual(matrix[3][2], testChildren12, "Element 12 is properly placed");

		assert.deepEqual(matrix[0][4], testChildren20, "Element 20 is properly placed");

		assert.deepEqual(matrix[0][6], testChildren31, "Element 31 is properly placed");
		assert.deepEqual(matrix[2][6], testChildren32, "Element 32 is properly placed");

		assert.deepEqual(matrix[0][8], testChildren41, "Element 41 is properly placed");
		assert.deepEqual(matrix[1][8], testChildren42, "Element 42 is properly placed");
	});

	QUnit.test("similar to previous test plus some tricky nodes", function (assert) {
		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot1 = createNodeElementFromOldVersion(1, 0, "stateR", "", null, [11]);
		var testRoot2 = createNodeElementFromOldVersion(2, 0, "stateR", "", null, [12]);
		var testRoot3 = createNodeElementFromOldVersion(3, 0, "stateR", "", null, [12]);
		var testRoot4 = createNodeElementFromOldVersion(4, 0, "stateR", "", null, [20]);

		var testChildren11 = createNodeElementFromOldVersion(11, 1, "stateQ", "", [1], [20]);
		var testChildren12 = createNodeElementFromOldVersion(12, 1, "stateQ", "", [2], [20]);

		var testChildren20 = createNodeElementFromOldVersion(20, 2, "stateSO", "", [11, 12], [31, 32]);

		var testChildren31 = createNodeElementFromOldVersion(31, 3, "stateDel", "", [20], [41, 42]);
		var testChildren32 = createNodeElementFromOldVersion(32, 3, "stateDel", "", [20], null);

		var testChildren41 = createNodeElementFromOldVersion(41, 4, "stateCI", "", [31], null);
		var testChildren42 = createNodeElementFromOldVersion(42, 4, "stateCI", "", [31], null);

		var inputArray = [];
		inputArray.push(testRoot1);
		inputArray.push(testRoot2);
		inputArray.push(testRoot3);
		inputArray.push(testRoot4);
		inputArray.push(testChildren11);
		inputArray.push(testChildren12);
		inputArray.push(testChildren20);
		inputArray.push(testChildren31);
		inputArray.push(testChildren32);
		inputArray.push(testChildren41);
		inputArray.push(testChildren42);

		var mapInputObject = {};
		for (var i = 0; i < inputArray.length; i++) {
			mapInputObject[inputArray[i].nodeId] = inputArray[i];
		}

		var matrix = this.processFlow._calculateMatrix(mapInputObject);
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 6, "Length X is 6");
		assert.deepEqual(matrix[0][0], testRoot1, "Root element 1 is properly placed");
		assert.deepEqual(matrix[3][0], testRoot2, "Root element 2 is properly placed");
		assert.deepEqual(matrix[4][0], testRoot3, "Root element 3 is properly placed");
		assert.deepEqual(matrix[5][0], testRoot4, "Root element 4 is properly placed");


		assert.deepEqual(matrix[0][2], testChildren11, "Element 11 is properly placed");
		assert.deepEqual(matrix[3][2], testChildren12, "Element 12 is properly placed");

		assert.deepEqual(matrix[0][4], testChildren20, "Element 20 is properly placed");

		assert.deepEqual(matrix[0][6], testChildren31, "Element 31 is properly placed");
		assert.deepEqual(matrix[2][6], testChildren32, "Element 32 is properly placed");

		assert.deepEqual(matrix[0][8], testChildren41, "Element 41 is properly placed");
		assert.deepEqual(matrix[1][8], testChildren42, "Element 42 is properly placed");
	});

	QUnit.test("4 roots connection together at lane 3", function (assert) {
		assert.ok(this.processFlow, "Process flow should be ok");

		var testRoot1 = createNodeElementFromOldVersion(1, 0, "stateR", "", null, [11]);
		var testRoot2 = createNodeElementFromOldVersion(2, 0, "stateR", "", null, [12]);
		var testRoot3 = createNodeElementFromOldVersion(3, 0, "stateR", "", null, [13]);
		var testRoot4 = createNodeElementFromOldVersion(4, 0, "stateR", "", null, [14]);

		var testChildren11 = createNodeElementFromOldVersion(11, 1, "stateQ", "", [1], [20]);
		var testChildren12 = createNodeElementFromOldVersion(12, 1, "stateQ", "", [2], [20]);
		var testChildren13 = createNodeElementFromOldVersion(13, 1, "stateQ", "", [3], [20]);
		var testChildren14 = createNodeElementFromOldVersion(14, 1, "stateQ", "", [4], [20]);

		var testChildren20 = createNodeElementFromOldVersion(20, 2, "stateSO", "", [11, 12], [31, 32]);

		var testChildren31 = createNodeElementFromOldVersion(31, 3, "stateDel", "", [20], [41, 42]);
		var testChildren32 = createNodeElementFromOldVersion(32, 3, "stateDel", "", [20], null);

		var testChildren41 = createNodeElementFromOldVersion(41, 4, "stateCI", "", [31], null);
		var testChildren42 = createNodeElementFromOldVersion(42, 4, "stateCI", "", [31], null);

		var inputArray = [];
		inputArray.push(testRoot1);
		inputArray.push(testRoot2);
		inputArray.push(testRoot3);
		inputArray.push(testRoot4);
		inputArray.push(testChildren11);
		inputArray.push(testChildren12);
		inputArray.push(testChildren13);
		inputArray.push(testChildren14);
		inputArray.push(testChildren20);
		inputArray.push(testChildren31);
		inputArray.push(testChildren32);
		inputArray.push(testChildren41);
		inputArray.push(testChildren42);

		var mapInputObject = {};
		for (var i = 0; i < inputArray.length; i++) {
			mapInputObject[inputArray[i].nodeId] = inputArray[i];
		}

		var matrix = this.processFlow._calculateMatrix(mapInputObject);
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 6, "Length X is 3");
		assert.deepEqual(matrix[0][0], testRoot1, "Root element 1 is properly placed");
		assert.deepEqual(matrix[3][0], testRoot2, "Root element 2 is properly placed");
		assert.deepEqual(matrix[4][0], testRoot3, "Root element 2 is properly placed");
		assert.deepEqual(matrix[5][0], testRoot4, "Root element 2 is properly placed");

		assert.deepEqual(matrix[0][2], testChildren11, "Element 11 is properly placed");
		assert.deepEqual(matrix[3][2], testChildren12, "Element 12 is properly placed");
		assert.deepEqual(matrix[4][2], testChildren13, "Element 13 is properly placed");
		assert.deepEqual(matrix[5][2], testChildren14, "Element 14 is properly placed");

		assert.deepEqual(matrix[0][4], testChildren20, "Element 20 is properly placed");

		assert.deepEqual(matrix[0][6], testChildren31, "Element 31 is properly placed");
		assert.deepEqual(matrix[2][6], testChildren32, "Element 32 is properly placed");

		assert.deepEqual(matrix[0][8], testChildren41, "Element 41 is properly placed");
		assert.deepEqual(matrix[1][8], testChildren42, "Element 42 is properly placed");
	});

	QUnit.module("Multiple nodes in one lane");

	QUnit.test("clone the ProcessFlow object", function (assert) {
		var laneHeaderOrig = new ProcessFlowLaneHeader({
			laneId: "0",
			position: 0,
			text: "Title"
		});
		var laneHeaderCopy = ProcessFlow.NodeElement._createNewProcessFlowElement(
			laneHeaderOrig, "1", 1);
		assert.ok(laneHeaderCopy, "Clone object exists");
		assert.equal(laneHeaderCopy.getPosition(), 1, "New position assigned.");
		assert.equal(laneHeaderCopy.getLaneId(), "1", "New lane id assigned.");
		assert.equal(laneHeaderCopy.getText(), "Title", "Original title assigned.");
		assert.equal(laneHeaderOrig.getPosition(), 0, "Original position stays.");
		assert.equal(laneHeaderOrig.getLaneId(), "0", "Original lane id stays.");
		assert.equal(laneHeaderOrig.getText(), "Title", "Original title assigned.");
	});

	QUnit.test("2 nodes in the same lane, happy test case scenario", function (assert) {
		var lanes = [];
		var nodes = [];
		lanes.push(new ProcessFlowLaneHeader({laneId: "0", position: 0, text: "Title 0"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "1", position: 1, text: "Title 1"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "2", position: 2, text: "Title 2"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "3", position: 3, text: "Title 3"}));

		nodes.push(new ProcessFlowNode({
			id: "processFlowNode1",
			nodeId: "1",
			laneId: "0",
			title: "title1",
			children: [2]
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode2",
			nodeId: "2",
			laneId: "1",
			title: "title1",
			children: [3]
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode3",
			nodeId: "3",
			laneId: "1",
			title: "title3",
			children: null
		}));
		var result = ProcessFlow.NodeElement._updateLanesFromNodes(lanes, nodes);
		var laneHeaderCopy = result.lanes;
		var aResults = {"0": 0, "1": 1, "2": 2, "3": 3, "11": 11};
		assert.ok(laneHeaderCopy, "Clone object exists");
		assert.equal(laneHeaderCopy.length, 5, "One artificial lane should exist");
		for (var i = 0; i < laneHeaderCopy.length; i++) {
			assert.ok(laneHeaderCopy[i].getLaneId() == aResults[laneHeaderCopy[i].getLaneId()], "The lane is in the expected... " + laneHeaderCopy[i].getLaneId());
			delete aResults[laneHeaderCopy[i].getLaneId()];
			if (laneHeaderCopy[i].getLaneId() == "2") {
				assert.equal(laneHeaderCopy[i].getPosition(), 3, "Position is moved due to new lane 21");
			}
			if (laneHeaderCopy[i].getLaneId() == "3") {
				assert.equal(laneHeaderCopy[i].getPosition(), 4, "Position is moved due to new lane 21");
			}
		}
		var nodeUpdate = result.nodes;
		assert.equal(nodeUpdate.length, 3, "Number of nodes unchanged");
		assert.equal(nodeUpdate[2].getLaneId(), "11", "The lane id is changed to to new lane");
		assert.expect(11);
		var key;
		for (key in nodes) {
			nodes[key].destroy();
		}
		for (key in lanes) {
			lanes[key].destroy();
		}
	});

	QUnit.test("2 nodes in the same lane, 3 nodes in the following lane", function (assert) {
		var lanes = [];
		var nodes = [];
		lanes.push(new ProcessFlowLaneHeader({laneId: "0", position: 0, text: "Title 0"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "1", position: 1, text: "Title 1"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "2", position: 2, text: "Title 2"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "3", position: 3, text: "Title 3"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "4", position: 4, text: "Title 4"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "5", position: 5, text: "Title 5"}));

		nodes.push(new ProcessFlowNode({
			id: "processFlowNode1",
			nodeId: "1",
			laneId: "0",
			title: "title1",
			children: [2]
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode2",
			nodeId: "2",
			laneId: "1",
			title: "title2",
			children: [3]
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode3",
			nodeId: "3",
			laneId: "1",
			title: "title3",
			children: [4]
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode4",
			nodeId: "4",
			laneId: "3",
			title: "title4",
			children: [5]
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode5",
			nodeId: "5",
			laneId: "3",
			title: "title5",
			children: [6]
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode6",
			nodeId: "6",
			laneId: "3",
			title: "title6",
			children: null
		}));

		var result = ProcessFlow.NodeElement._updateLanesFromNodes(lanes, nodes);
		var laneHeaderCopy = result.lanes;
		var aResults = {"0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "11": 11, "31": 31, "311": 311};
		assert.ok(laneHeaderCopy, "Clone object exists");
		assert.equal(laneHeaderCopy.length, 9, "3 artificial lanes should exist");
		for (var i = 0; i < laneHeaderCopy.length; i++) {
			assert.ok(laneHeaderCopy[i].getLaneId() == aResults[laneHeaderCopy[i].getLaneId()], "The lane is in the expected... " + laneHeaderCopy[i].getLaneId());
			delete aResults[laneHeaderCopy[i].getLaneId()];
			if (laneHeaderCopy[i].getLaneId() == "2") {
				assert.equal(laneHeaderCopy[i].getPosition(), 3, "Position is moved due to new lane 21 ... " + laneHeaderCopy[i].getLaneId());
			}
			if (laneHeaderCopy[i].getLaneId() == "3") {
				assert.equal(laneHeaderCopy[i].getPosition(), 4, "Position is moved due to new lane 21 ... " + laneHeaderCopy[i].getLaneId());
			}
			if (laneHeaderCopy[i].getLaneId() == "4") {
				assert.equal(laneHeaderCopy[i].getPosition(), 7, "Position is moved due to new lane 21, 31, 32 ... " + +laneHeaderCopy[i].getLaneId());
			}
		}
		var nodeUpdate = result.nodes;
		assert.equal(nodeUpdate.length, 6, "Number of nodes unchanged");
		assert.equal(nodeUpdate[2].getLaneId(), "11", "The lane ID is changed to to new lane");
		assert.equal(nodeUpdate[4].getLaneId(), "31", "The lane ID is changed to to new lane");
		assert.equal(nodeUpdate[5].getLaneId(), "311", "The lane ID is changed to to new lane");
		assert.expect(18);
		var key;
		for (key in nodes) {
			nodes[key].destroy();
		}
		for (key in lanes) {
			lanes[key].destroy();
		}
	});

	QUnit.test("2 nodes in the same lane with one parent in the same lane, 3 nodes in the following lane with one parent", function (assert) {
		var lanes = [];
		var nodes = [];
		lanes.push(new ProcessFlowLaneHeader({laneId: "0", position: 0, text: "Title 0"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "1", position: 1, text: "Title 1"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "2", position: 2, text: "Title 2"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "3", position: 3, text: "Title 3"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "4", position: 4, text: "Title 4"}));
		lanes.push(new ProcessFlowLaneHeader({laneId: "5", position: 5, text: "Title 5"}));

		nodes.push(new ProcessFlowNode({
			id: "processFlowNode1",
			nodeId: "1",
			laneId: "0",
			title: "title1",
			children: [2]
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode2",
			nodeId: "2",
			laneId: "1",
			title: "title2",
			children: [21, 22]
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode21",
			nodeId: "21",
			laneId: "1",
			title: "title21",
			children: [4]
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode22",
			nodeId: "22",
			laneId: "1",
			title: "title22",
			children: [4]
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode4",
			nodeId: "4",
			laneId: "3",
			title: "title4",
			children: [5, 6]
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode5",
			nodeId: "5",
			laneId: "3",
			title: "title5",
			children: null
		}));
		nodes.push(new ProcessFlowNode({
			id: "processFlowNode6",
			nodeId: "6",
			laneId: "3",
			title: "title6",
			children: null
		}));

		var result = ProcessFlow.NodeElement._updateLanesFromNodes(lanes, nodes);
		var laneHeaderCopy = result.lanes;
		var aResults = {"0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "11": 11, "31": 31};
		assert.ok(laneHeaderCopy, "Clone object exists");
		assert.equal(laneHeaderCopy.length, 8, "2 artificial lanes should exist");
		for (var i = 0; i < laneHeaderCopy.length; i++) {
			assert.ok(laneHeaderCopy[i].getLaneId() == aResults[laneHeaderCopy[i].getLaneId()], "The lane is in the expected... " + laneHeaderCopy[i].getLaneId());
			delete aResults[laneHeaderCopy[i].getLaneId()];
			if (laneHeaderCopy[i].getLaneId() == "2") {
				assert.equal(laneHeaderCopy[i].getPosition(), 3, "Position is moved due to new lane 21 ... " + laneHeaderCopy[i].getLaneId());
			}
			if (laneHeaderCopy[i].getLaneId() == "3") {
				assert.equal(laneHeaderCopy[i].getPosition(), 4, "Position is moved due to new lane 21 ... " + laneHeaderCopy[i].getLaneId());
			}
			if (laneHeaderCopy[i].getLaneId() == "4") {
				assert.equal(laneHeaderCopy[i].getPosition(), 6, "Position is moved due to new lane 21, 31, 32 ... " + +laneHeaderCopy[i].getLaneId());
			}
		}
		var nodeUpdate = result.nodes;
		assert.equal(nodeUpdate.length, 7, "Number of nodes unchanged");
		assert.equal(nodeUpdate[2].getLaneId(), "11", "The lane ID is changed to to new lane");
		assert.equal(nodeUpdate[3].getLaneId(), "11", "The lane ID is changed to to new lane");
		assert.equal(nodeUpdate[4].getLaneId(), "3", "The lane ID is changed to to new lane");
		assert.equal(nodeUpdate[5].getLaneId(), "31", "The lane ID is changed to to new lane");
		assert.equal(nodeUpdate[6].getLaneId(), "31", "The lane ID is changed to to new lane");
		assert.expect(19);
		var key;
		for (key in nodes) {
			nodes[key].destroy();
		}
		for (key in lanes) {
			lanes[key].destroy();
		}
	});

	QUnit.module("Multiple nodes in one lane 2", {
		beforeEach: function () {
			this.processFlow = new ProcessFlow("processFlow");
		},
		afterEach: function () {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
		}
	});

	QUnit.test("first example connection together at lane 3", function (assert) {
		var testRoot = createNodeElementFromOldVersion(1, 0,
			"stateR", "", null, [2]);
		var testDelivery = createNodeElementFromOldVersion(2, 1,
			"stateR", "", [1], [3]);
		var testBill1 = createNodeElementFromOldVersion(3, 2,
			"stateR", "", [2], [4]);
		var testBill2 = createNodeElementFromOldVersion(4, 2,
			"stateR", "", [3], null);

		var inputArray = [];
		inputArray.push(testRoot);
		inputArray.push(testDelivery);
		inputArray.push(testBill1);
		inputArray.push(testBill2);

		var inputMap = {};
		for (var i = 0; i < inputArray.length; i++) {
			inputMap[inputArray[i].nodeId] = inputArray[i];
		}
		var matrix = this.processFlow._calculateMatrix(inputMap);
		assert.ok(matrix, "Matrix is at least created");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testDelivery, "Delivery element is properly placed");
		assert.deepEqual(matrix[0][4], testBill1, "Bill 1 element is properly placed");
		assert.deepEqual(matrix[0][6], testBill2, "Bill 2 element is properly placed");
	});

	QUnit.test("4 nodes in the same lane, parent-child relation defined consecutively", function (assert) {
		var aLanes = [];
		var aNodes = [];
		aLanes.push(new ProcessFlowLaneHeader({laneId: "0", position: 0}));
		aLanes.push(new ProcessFlowLaneHeader({laneId: "1", position: 1}));

		aNodes.push(new ProcessFlowNode({nodeId: "0", laneId: "0", children: [1]}));
		aNodes.push(new ProcessFlowNode({nodeId: "1", laneId: "0", children: [2, 3]}));
		aNodes.push(new ProcessFlowNode({nodeId: "2", laneId: "0", children: []}));
		aNodes.push(new ProcessFlowNode({nodeId: "3", laneId: "0", children: []}));

		var aInternalNodes = this.processFlow._arrangeNodesByParentChildRelation(aNodes);
		for (var i = 0; i < aNodes.length; i++) {
			assert.deepEqual(aInternalNodes[i].getNodeId(), i.toString(), "ProcessFlow Node " + i + " is on right position.");
		}
	});

	QUnit.test("4 nodes in the same lane, parent-child relation defined contrarily I", function (assert) {
		var aLanes = [];
		var aNodes = [];
		aLanes.push(new ProcessFlowLaneHeader({laneId: "1", position: 1}));
		aLanes.push(new ProcessFlowLaneHeader({laneId: "0", position: 0}));

		aNodes.push(new ProcessFlowNode({nodeId: "3", laneId: "0", children: []}));
		aNodes.push(new ProcessFlowNode({nodeId: "2", laneId: "0", children: [3]}));
		aNodes.push(new ProcessFlowNode({nodeId: "1", laneId: "0", children: [2]}));
		aNodes.push(new ProcessFlowNode({nodeId: "0", laneId: "0", children: [1]}));

		var aInternalNodes = this.processFlow._arrangeNodesByParentChildRelation(aNodes);
		for (var i = 0; i < aNodes.length; i++) {
			assert.deepEqual(aInternalNodes[i].getNodeId(), i.toString(), "ProcessFlow Node " + i + " is on right position.");
		}
	});

	QUnit.test("4 nodes in the same lane, parent-child relation defined contrarily II", function (assert) {
		var aLanes = [];
		var aNodes = [];
		aLanes.push(new ProcessFlowLaneHeader({laneId: "1", position: 1}));
		aLanes.push(new ProcessFlowLaneHeader({laneId: "0", position: 0}));

		aNodes.push(new ProcessFlowNode({nodeId: "3", laneId: "0", children: []}));
		aNodes.push(new ProcessFlowNode({nodeId: "0", laneId: "0", children: [1]}));
		aNodes.push(new ProcessFlowNode({nodeId: "2", laneId: "0", children: [3]}));
		aNodes.push(new ProcessFlowNode({nodeId: "1", laneId: "0", children: [2]}));

		var aInternalNodes = this.processFlow._arrangeNodesByParentChildRelation(aNodes);
		for (var i = 0; i < aNodes.length; i++) {
			assert.deepEqual(aInternalNodes[i].getNodeId(), i.toString(), "ProcessFlow Node " + i + " is on right position.");
		}
	});

	QUnit.test("8 nodes in the same lane, parent-child relation defined contrarily", function (assert) {
		var aLanes = [];
		var aNodes = [];
		aLanes.push(new ProcessFlowLaneHeader({laneId: "1", position: 1}));
		aLanes.push(new ProcessFlowLaneHeader({laneId: "0", position: 0}));

		aNodes.push(new ProcessFlowNode({nodeId: "2", laneId: "0", children: []}));
		aNodes.push(new ProcessFlowNode({nodeId: "0", laneId: "0", children: [1]}));
		aNodes.push(new ProcessFlowNode({nodeId: "3", laneId: "0", children: []}));
		aNodes.push(new ProcessFlowNode({nodeId: "1", laneId: "0", children: [2, 3]}));
		aNodes.push(new ProcessFlowNode({nodeId: "6", laneId: "0", children: []}));
		aNodes.push(new ProcessFlowNode({nodeId: "5", laneId: "0", children: [6, 7]}));
		aNodes.push(new ProcessFlowNode({nodeId: "7", laneId: "0", children: []}));
		aNodes.push(new ProcessFlowNode({nodeId: "4", laneId: "0", children: [5]}));

		var aInternalNodes = this.processFlow._arrangeNodesByParentChildRelation(aNodes);
		for (var i = 0; i < aNodes.length; i++) {
			assert.deepEqual(aInternalNodes[i].getNodeId(), i.toString(), "ProcessFlow Node " + i + " is on right position.");
		}
	});

	QUnit.module("AriaProperties utility", {
		beforeEach: function () {
			this.oData = {
				ariaProperties: {
					label: "Test label ProcessFlow"
				},
				nodes:
					[
						{
							id: "1",
							laneId: "id0",
							title: "Sales Order 150",
							children: [2],
							state: ProcessFlowNodeState.Positive,
							ariaProperties: {
								label: "Test label"
							}
						},
						{
							id: "2",
							laneId: "id1",
							title: "Outbound Delivery 1",
							children: [3],
							state: ProcessFlowNodeState.Positive,
							ariaProperties: {
								labelledBy: "id0"
							}
						},
						{
							id: "3",
							laneId: "id1",
							title: "Outbound Delivery 42417001",
							children: [4],
							state: ProcessFlowNodeState.Positive,
							ariaProperties: {
								role: "button"
							}
						},
						{
							id: "4",
							laneId: "id2",
							title: "Invoice 1234",
							children: null,
							state: ProcessFlowNodeState.Positive,
							ariaProperties: {
								hasPopup: "dialog",
								describedBy: "id1"
							}
						}
					],
				lanes:
					[
						{id: "id0", position: 0},
						{id: "id1", position: 1},
						{id: "id2", position: 2}
					] // end of lane array
			};

			var oJModel = new JSONModel(this.oData);
			this.oProcessFlow = new ProcessFlow("PFUpdateNodes", {
				ariaProperties: {
					label: "{/ariaProperties/label}",
					labelledBy: "{/ariaProperties/labelledBy}",
					describedBy: "{/ariaProperties/describedBy}",
					role: "{/ariaProperties/role}",
					hasPopup: "{/ariaProperties/hasPopup}"
				},
				nodes: {
					path: "/nodes",
					template: new ProcessFlowNode("testNode", {
						nodeId: "{id}",
						laneId: "{laneId}",
						title: "{title}",
						children: "{children}",
						state: "{state}",
						stateText: "{stateText}",
						texts: "{texts}",
						ariaProperties: {
								label: "{ariaProperties/label}",
								labelledBy: "{ariaProperties/labelledBy}",
								describedBy: "{ariaProperties/describedBy}",
								role: "{ariaProperties/role}",
								hasPopup: "{ariaProperties/hasPopup}"
						}
					})
				}, // end of node
				lanes: {
					path: "/lanes",
					template: new ProcessFlowLaneHeader({
						laneId: "{id}",
						position: "{position}"
					})
				} // end of lane
			});

			this.oProcessFlow.setModel(oJModel);
			this.oProcessFlow.placeAt("processflowdiv");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.oProcessFlow) {
				this.oProcessFlow.destroy();
			}
		}
	});

	QUnit.test("Test aria properties", function (assert) {
		var aNodes = this.oProcessFlow.getNodes();
		assert.equal(this.oProcessFlow.$().attr("aria-label"), "Test label ProcessFlow", "Test aria-label of ProcessFlow control.");
		assert.equal(aNodes[0].$().parent().attr("aria-label"), "Test label", "Test aria-label of ProcessFlowNode.");
		assert.equal(aNodes[1].$().parent().attr("aria-labelledby"), "id0", "Test aria-labelledby.");
		assert.equal(aNodes[2].$().parent().attr("role"), "button", "Test role.");
		assert.equal(aNodes[3].$().parent().attr("aria-haspopup"), "dialog", "Test aria-haspopup.");
		assert.equal(aNodes[3].$().parent().attr("aria-describedby"), "id1", "Test aria-describedby.");
	});

	AriaPropertiesTestUtils.ariaPropertiesSupport(ProcessFlow);
});
