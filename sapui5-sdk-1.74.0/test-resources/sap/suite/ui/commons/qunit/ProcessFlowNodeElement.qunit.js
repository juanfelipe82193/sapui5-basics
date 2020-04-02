sap.ui.define([
	"sap/suite/ui/commons/ProcessFlow",
	"sap/suite/ui/commons/ProcessFlowLaneHeader",
	"sap/suite/ui/commons/ProcessFlowNode",
	"sap/suite/ui/commons/ProcessFlowNodeState"
], function (ProcessFlow, ProcessFlowLaneHeader, ProcessFlowNode, ProcessFlowNodeState) {
	"use strict";

	function createNodeElementFromOldVersion(nodeid, laneNumber, state, displayState, parent, children) {
		return new ProcessFlow.NodeElement(nodeid, laneNumber,
			new ProcessFlowNode({nodeId: nodeid, children: children}), parent);
	}

	QUnit.module("ProcessFlowNodeElement - Basic tests", {
		beforeEach: function () {
			this.processFlow = new ProcessFlow("fake");
			this.nodeElement1 = createNodeElementFromOldVersion(1, 0, "state1", "", null, [10, 11, 12]);
			this.nodeElement2 = createNodeElementFromOldVersion(2, 0, "state1", "", [1], [10, 11, 12]);
			this.nodeElement3 = createNodeElementFromOldVersion(3, 0, "state2", "", [1], [10, 11, 12]);
			this.nodeElement4 = createNodeElementFromOldVersion(3, 0, "state2", "", [1], [10, 13, 14]);
			this.nodeElement5 = createNodeElementFromOldVersion(3, 0, "state2", "", [1], [15]);

			this.laneHeader0 = new ProcessFlowLaneHeader({
				laneId: "0",
				position: 0
			});

			this.laneHeader1 = new ProcessFlowLaneHeader({
				laneId: "1",
				position: 1
			});

			this.laneHeader2 = new ProcessFlowLaneHeader({
				laneId: "2",
				position: 2
			});

			this.laneHeader3 = new ProcessFlowLaneHeader({
				laneId: "3",
				position: 3
			});

			this.laneHeader4 = new ProcessFlowLaneHeader({
				laneId: "4",
				position: 4
			});

			this.pfNode1 = new ProcessFlowNode({
				id: "processFlowNode1",
				nodeId: "1",
				laneId: "0",
				state: ProcessFlowNodeState.Planned,
				title: "title1",
				children: [10, 11, 12]
			});
			this.pfNode2 = new ProcessFlowNode({
				id: "processFlowNode2",
				nodeId: "10",
				laneId: "4",
				state: ProcessFlowNodeState.Negative,
				title: "title10",
				children: null
			});
			this.pfNode3 = new ProcessFlowNode({
				id: "processFlowNode3",
				nodeId: "11",
				laneId: "3",
				state: ProcessFlowNodeState.Planned,
				title: "title11",
				children: null
			});
			this.pfNode4 = new ProcessFlowNode({
				id: "processFlowNode4",
				nodeId: "12",
				laneId: "2",
				state: ProcessFlowNodeState.Critical,
				title: "title12",
				children: [5]
			});
			this.pfNode5 = new ProcessFlowNode({
				id: "processFlowNode5",
				nodeId: "5",
				laneId: "3",
				state: ProcessFlowNodeState.Critical,
				title: "title5",
				children: null
			});

			this.arrNode = [];
			this.arrNode.push(this.pfNode1);
			this.arrNode.push(this.pfNode2);
			this.arrNode.push(this.pfNode3);
			this.arrNode.push(this.pfNode4);
			this.arrNode.push(this.pfNode5);

			this.lanes = [];
			this.lanes.push(this.laneHeader0);
			this.lanes.push(this.laneHeader1);
			this.lanes.push(this.laneHeader2);
			this.lanes.push(this.laneHeader3);
			this.lanes.push(this.laneHeader4);
		},
		afterEach: function () {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
			if (this.arrNode) {
				delete this.arrNode;
			}
			if (this.nodeElement1) {
				delete this.nodeElement1;
			}
			if (this.nodeElement2) {
				delete this.nodeElement2;
			}
			if (this.nodeElement3) {
				delete this.nodeElement3;
			}
			if (this.nodeElement4) {
				delete this.nodeElement2;
			}
			if (this.nodeElement5) {
				delete this.nodeElement3;
			}
			if (this.pfNode1) {
				this.pfNode1.destroy();
			}
			if (this.pfNode2) {
				this.pfNode2.destroy();
			}
			if (this.pfNode3) {
				this.pfNode3.destroy();
			}
			if (this.pfNode4) {
				this.pfNode4.destroy();
			}
			if (this.pfNode5) {
				this.pfNode5.destroy();
			}
			if (this.laneHeader0) {
				this.laneHeader0.destroy();
			}
			if (this.laneHeader1) {
				this.laneHeader1.destroy();
			}
			if (this.laneHeader2) {
				this.laneHeader2.destroy();
			}
			if (this.laneHeader3) {
				this.laneHeader3.destroy();
			}
			if (this.laneHeader4) {
				this.laneHeader4.destroy();
			}
		}
	});

	QUnit.test("creation of the internal node element", function (assert) {
		assert.ok(this.nodeElement1, "Node element 1 created");
		assert.ok(this.nodeElement2, "Node element 2 created");
		assert.ok(this.nodeElement3, "Node element 3 created");

		assert.ok(this.pfNode1, "ProcessFlow Node 1 created");
		assert.ok(this.pfNode2, "ProcessFlow Node 1 created");
		assert.ok(this.pfNode3, "ProcessFlow Node 1 created");
		assert.ok(this.pfNode4, "ProcessFlow Node 1 created");
		assert.ok(this.pfNode5, "ProcessFlow Node 1 created");

		assert.ok(this.arrNode, "Node array created (pf nodes)");
	});


	QUnit.test("Create nodes with wrong children definition - not with an existing child", function (assert) {
		var nodeElement1 = createNodeElementFromOldVersion(1,
			0, "state1", "", null, [10, 11, 12]);
		var nodeElement2 = createNodeElementFromOldVersion(10,
			0, "state1", "", null, null);
		var nodeElement3 = createNodeElementFromOldVersion(11,
			0, "state1", "", null, [10, 11, 12]);

		var internalMatrix = new ProcessFlow.InternalMatrixCalculation();
		var internalMap = {};
		internalMap[nodeElement1.nodeId] = nodeElement1;
		internalMap[nodeElement2.nodeId] = nodeElement2;
		internalMap[nodeElement3.nodeId] = nodeElement3;
		try {
			internalMatrix.checkInputNodeConsistency(internalMap);
		} catch (errArr) {
			assert.ok(errArr, "Error result array must exist.");
			assert.equal(errArr.length, 2, "There should be one message");
			assert.equal(errArr[0].length > 0, true, "Message exists.");
		}
	});

	QUnit.test("create map from nodes - createNodeElementsFromProcessFlowNodes null lane input", function (assert) {
		assert.throws(function () {
				ProcessFlow.NodeElement._createNodeElementsFromProcessFlowNodes(this.arrNode, null).elementById;  //eslint-disable-line
			},
			/No lane definition although there is a node definition./,
			"Ten is not proper one, exception is expected");
	});

	QUnit.test("create map from nodes - createNodeElementsFromProcessFlowNodes happy case",
		function (assert) {
			var mapResult = ProcessFlow.NodeElement._createNodeElementsFromProcessFlowNodes(this.arrNode, this.lanes).elementById;
			assert.ok(mapResult, "Map result must exist.");

			assert.equal(Object.keys(mapResult).length, 5, "the 5 node elements must exist");
			for (var i = 0; i < this.arrNode.length; i++) {
				var singleElem = mapResult[this.arrNode[i].getNodeId()];
				assert.ok(singleElem instanceof ProcessFlow.NodeElement,
					"Node element is assert.expected type");
				if (singleElem.nodeId === "1") {
					assert.equal(singleElem.lane, 0, "Lane should be zero.");
				}
				delete mapResult[singleElem.nodeId];
			}
			assert.equal(Object.keys(mapResult).length, 0, "It should be zero after check.");
		});

	QUnit.test("create map from nodes - createNodeElementsFromProcessFlowNodes missing some lanes", function (assert) {
		try {
			var tempLanes = this.lanes.slice();
			while (tempLanes.length > 1) {
				tempLanes.shift();
			}
			ProcessFlow.NodeElement
				._createNodeElementsFromProcessFlowNodes(this.arrNode, tempLanes);
		} catch (excObject) {
			assert.ok(excObject, "Object must exist.");
			assert.equal(excObject.length, 1, "there is a message about missing lanes.");
			assert.ok(excObject[0], "Check message: " + excObject[0]);
		}
	});

	QUnit.test("create map from nodes - createNodeElementsFromProcessFlowNodes more lanes with same identification", function (assert) {
		try {
			var tempLanes = this.lanes.slice();
			if (tempLanes && tempLanes.length >= 3) {
				tempLanes.push(jQuery.extend(true, {}, tempLanes[2]).setLaneId("id234"));
			}
			ProcessFlow.NodeElement
				._createNodeElementsFromProcessFlowNodes(this.arrNode, tempLanes);
		} catch (excObject) {
			assert.ok(excObject, "Object must exist.");
			assert.equal(excObject.length, 1, "there is a message about wrong lane definition.");
			assert.ok(excObject[0], "Check message: " + excObject[0]);
		}
	});

	QUnit.test("create map from nodes - createNodeElementsFromProcessFlowNodes more lanes with same position", function (assert) {
		try {
			var tempLanes = this.lanes.slice();
			var laneHeaderAdd = new sap.suite.ui.commons.ProcessFlowLaneHeader({
				laneId: "12345",
				position: 2
			});

			tempLanes.push(laneHeaderAdd);
			ProcessFlow.NodeElement
				._createNodeElementsFromProcessFlowNodes(this.arrNode, tempLanes);
		} catch (excObject) {
			assert.ok(excObject, "Object must exist.");
			assert.equal(excObject.length, 1, "there is a message about wrong lane definition.");
			assert.ok(excObject[0], "Check message: " + excObject[0]);
		}
	});

	QUnit.test("create map from nodes - createNodeElementsFromProcessFlowNodes happy case plus null inputs", function (assert) {
		var tempNodes = this.arrNode.slice();
		tempNodes.push(null);
		tempNodes.push(undefined);

		var mapResult = ProcessFlow.NodeElement
			._createNodeElementsFromProcessFlowNodes(tempNodes, this.lanes).elementById;
		assert.ok(mapResult, "Map result must exist.");

		assert.equal(Object.keys(mapResult).length, 5, "the 5 node elements must exist");
		for (var i = 0; i < this.arrNode.length; i++) {
			var singleElem = mapResult[this.arrNode[i].getNodeId()];
			assert.ok(singleElem instanceof ProcessFlow.NodeElement,
				"Node element is assert.expect(ed type");
			if (singleElem.nodeId === "1") {
				assert.equal(singleElem.lane, 0, "Lane should be zero.");
			}
			delete mapResult[singleElem.nodeId];
		}
		assert.equal(Object.keys(mapResult).length, 0, "It should be zero after check.");
	});

	QUnit.test("create map from nodes - createNodeElementsFromProcessFlowNodes empty input", function (assert) {
		var arrMap = ProcessFlow.NodeElement
			._createNodeElementsFromProcessFlowNodes(null).elementById;
		assert.ok(arrMap, "Array result must exist.");

		assert.equal(Object.keys(arrMap).length, 0, "the 0 node element must exist");
	});

	QUnit.test("check the node contains method - negativ inputs", function (assert) {
		assert.equal(this.nodeElement1.containsChildren(null), false, "wrong input for children - null");
		assert.equal(this.nodeElement1.containsChildren(undefined), false, "wrong input for children - undefined");
		assert.equal(this.nodeElement1.containsChildren("string"), false, "wrong input for children - string");
	});

	QUnit.test("check the node contains method - happy test case", function (assert) {
		assert.equal(this.nodeElement1.containsChildren(this.nodeElement2), true, "wrong input for children - null");
	});

	QUnit.test("check the node contains method - positive inputs and true result", function (assert) {
		assert.equal(this.nodeElement1.containsChildren(this.nodeElement5), false, "wrong input for children - null");
	});

	QUnit.test("calculate createNodeElementsFromProcessFlowNodes", function (assert) {

		var mapResult = ProcessFlow.NodeElement
			._createNodeElementsFromProcessFlowNodes(this.arrNode, this.lanes).elementsByLane;
		assert.ok(mapResult, "Map result must exist.");

		//assert.equal(mapResult.length, 5, "the 5 lane elements must exist");
		assert.equal(mapResult[0].length, 1, "One root node");
		assert.equal(mapResult[1].length, 0, "Nothing on lane 1");
		assert.equal(mapResult[2].length, 1, "One node on lane 2");
		assert.equal(mapResult[3].length, 2, "Two nodes on lane 3");
		assert.equal(mapResult[4].length, 1, "One node on lane 4");
	});

	QUnit.test("calculate _calculateLaneStatePieChart happy test case regular nodes", function (assert) {
		var tempLanes = this.lanes.slice();
		var arrNodes = [],
			i;
		arrNodes.push(new ProcessFlowNode({
			id: "lanepiechart1",
			nodeId: "1",
			laneId: "3"
		}));
		arrNodes.push(new ProcessFlowNode({
			id: "lanepiechart2",
			nodeId: "2",
			laneId: "3"
		}));
		arrNodes.push(new ProcessFlowNode({
			id: "lanepiechart3",
			nodeId: "3",
			laneId: "3"
		}));
		var mapLaneToNode = ProcessFlow.NodeElement._createNodeElementsFromProcessFlowNodes(arrNodes, this.lanes).elementsByLane;
		ProcessFlow.NodeElement._calculateLaneStatePieChart(mapLaneToNode, tempLanes, arrNodes, this.processFlow);
		for (i = 0; i < tempLanes.length; i++) {
			assert.ok(tempLanes[i].getState(), "state exists");
			if (tempLanes[i].getLaneId() == "3" && tempLanes[i].getState()[2].state == "Neutral") {
				assert.ok(tempLanes[i].getState()[2].value == 3, "There are 2 nodes with neutral state and not dimmed.");
			}
		}
		assert.expect(6);
		for (i = 0; i < arrNodes.length; i++) {
			arrNodes[i].destroy();
		}
	});

	QUnit.test("calculate _calculateLaneStatePieChart happy test case with highligted and dimmed", function (assert) {
		var tempLanes = this.lanes.slice();
		var arrNodes = [],
			i;
		arrNodes.push(new ProcessFlowNode({
			id: "lanepiechart1",
			nodeId: "1",
			laneId: "3",
			highlighted: true
		}));
		arrNodes.push(new ProcessFlowNode({
			id: "lanepiechart2",
			nodeId: "2",
			laneId: "3",
			highlighted: true,
			focused: true
		}));
		arrNodes.push(new ProcessFlowNode({
			id: "lanepiechart3",
			nodeId: "3",
			laneId: "3"
		}));
		var mapLaneToNode = ProcessFlow.NodeElement._createNodeElementsFromProcessFlowNodes(arrNodes, this.lanes).elementsByLane;
		ProcessFlow.NodeElement._calculateLaneStatePieChart(mapLaneToNode, tempLanes, arrNodes, this.processFlow);
		for (i = 0; i < tempLanes.length; i++) {
			assert.ok(tempLanes[i].getState(), "state exists");
			if (tempLanes[i].getLaneId() == "3" && tempLanes[i].getState()[2].state == "Neutral") {
				assert.ok(tempLanes[i].getState()[2].value == 2, "There are 2 nodes with neutral state and not dimmed.");
			}
		}
		assert.expect(6);
		for (i = 0; i < arrNodes.length; i++) {
			arrNodes[i].destroy();
		}
	});

	QUnit.test("calculate _calculateLaneStatePieChart null input for nodes", function (assert) {
		ProcessFlow.NodeElement._createNodeElementsFromProcessFlowNodes({}, this.lanes);
		assert.ok(1, "Empty node input survivor.");
	});

	QUnit.test("calculate _calculateLaneStatePieChart null input for lanes", function (assert) {
		var tempLanes = this.lanes.slice();

		for (var i = 0; i < tempLanes.length; i++) {
			assert.ok(tempLanes[i].getState() == null, "state does not exist");
		}
		var mapLaneToNode = ProcessFlow.NodeElement._createNodeElementsFromProcessFlowNodes(this.arrNode, this.lanes).elementsByLane;

		ProcessFlow.NodeElement._calculateLaneStatePieChart(mapLaneToNode, null, this.arrNode);
		assert.ok(tempLanes, "Lanes exist");
	});

	QUnit.test("calculate _calculateLaneStatePieChart null input for map", function (assert) {
		var tempLanes = this.lanes.slice();

		for (var i = 0; i < tempLanes.length; i++) {
			assert.ok(tempLanes[i].getState() == null, "state does not exist");
		}
		ProcessFlow.NodeElement._calculateLaneStatePieChart(null, tempLanes, null);
		assert.ok(tempLanes, "Lanes exist");
	});

	QUnit.test("calculate _calculateLaneStatePieChart state counters", function (assert) {
		var tempLanes = this.lanes.slice();
		var mapLaneToNode = ProcessFlow.NodeElement._createNodeElementsFromProcessFlowNodes(this.arrNode, this.lanes).elementsByLane;
		ProcessFlow.NodeElement._calculateLaneStatePieChart(mapLaneToNode, tempLanes, this.arrNode, this.processFlow);

		for (var i = 0; i < tempLanes.length; i++) {
			assert.ok(tempLanes[i].getState(), "state does exist");
		}
		//laneHeader 0
		assert.deepEqual(
			tempLanes[0].getState(),
			[{state: ProcessFlowNodeState.Positive, value: 0},
				{state: ProcessFlowNodeState.Negative, value: 0},
				{state: ProcessFlowNodeState.Neutral, value: 0},
				{state: ProcessFlowNodeState.Planned, value: 1},
				{state: ProcessFlowNodeState.Critical, value: 0}],
			"laneHeader0 counters are matching");
		//laneHeader 1
		assert.deepEqual(
			tempLanes[1].getState(),
			[{state: ProcessFlowNodeState.Positive, value: 0},
				{state: ProcessFlowNodeState.Negative, value: 0},
				{state: ProcessFlowNodeState.Neutral, value: 0},
				{state: ProcessFlowNodeState.Planned, value: 0},
				{state: ProcessFlowNodeState.Critical, value: 0}],
			"laneHeader1 counters are matching");
		//laneHeader 2
		assert.deepEqual(
			tempLanes[2].getState(),
			[{state: ProcessFlowNodeState.Positive, value: 0},
				{state: ProcessFlowNodeState.Negative, value: 0},
				{state: ProcessFlowNodeState.Neutral, value: 0},
				{state: ProcessFlowNodeState.Planned, value: 0},
				{state: ProcessFlowNodeState.Critical, value: 1}],
			"laneHeader2 counters are matching");
		//laneHeader 3
		assert.deepEqual(
			tempLanes[3].getState(),
			[{state: ProcessFlowNodeState.Positive, value: 0},
				{state: ProcessFlowNodeState.Negative, value: 0},
				{state: ProcessFlowNodeState.Neutral, value: 0},
				{state: ProcessFlowNodeState.Planned, value: 1},
				{state: ProcessFlowNodeState.Critical, value: 1}],
			"laneHeader3 counters are matching");
		//laneHeader 4
		assert.deepEqual(
			tempLanes[4].getState(),
			[{state: ProcessFlowNodeState.Positive, value: 0},
				{state: ProcessFlowNodeState.Negative, value: 1},
				{state: ProcessFlowNodeState.Neutral, value: 0},
				{state: ProcessFlowNodeState.Planned, value: 0},
				{state: ProcessFlowNodeState.Critical, value: 0}],
			"laneHeader4 counters are matching");
	});

}, /* bExport= */ true);
