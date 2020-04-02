sap.ui.define([
	"sap/suite/ui/commons/ProcessFlow",
	"sap/suite/ui/commons/ProcessFlowNode",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function(ProcessFlow, ProcessFlowNode, CreateAndAppendDiv) {
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

	QUnit.module("ProcessFlowMatrix - Internal matrix calculations", {
		beforeEach: function() {
			this.processFlow = new ProcessFlow("fake");
			this.internalMatrix = new ProcessFlow.InternalMatrixCalculation();
		},
		afterEach: function() {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
			if (this.internalMatrix) {
				delete this.internalMatrix;
			}
		}
	});

	QUnit.test("create matrix step", function(assert) {
		var matrix = this.internalMatrix._createMatrix(2, 3),
			i, j;
		assert.ok(matrix, "matrix created");
		assert.equal(matrix.length, 2, "The x length");
		for (i = 0; i < matrix.length; i++) {
			assert.equal(matrix[i].length, 3, "The y length (3)");
		}
		for (i = 0; i < matrix.length; i++) {
			for (j = 0; j < matrix[i].length; j++) {
				assert.equal(matrix[i][j], null, "Empty matrix is assert.expect(ed");
			}
		}
	});

	QUnit.test("check double column matrix", function(assert) {
		assert.ok(this.internalMatrix, "the internal matrix variable must exist.");
		var matrix = this.internalMatrix._createMatrix(2, 3);
		assert.ok(matrix, "matrix created");
		var doubleMatrix = this.internalMatrix._doubleColumnsInMatrix(matrix);
		assert.equal(doubleMatrix.length, 2, "The x length");
		for (var i = 0; i < doubleMatrix.length; i++) {
			assert.equal(doubleMatrix[i].length, 5, "The y length (5)");
		}
	});

	QUnit.test("check remove empty lines feature", function(assert) {
		assert.ok(this.internalMatrix, "the internal matrix variable must exist.");
		var matrix = this.internalMatrix._createMatrix(2, 3);
		assert.ok(matrix, "matrix created");
		var doubleMatrix = this.internalMatrix._doubleColumnsInMatrix(matrix);
		assert.equal(doubleMatrix.length, 2, "The x length");
		for (var i = 0; i < doubleMatrix.length; i++) {
			assert.equal(doubleMatrix[i].length, 5, "The y length (5)");
		}
		doubleMatrix[0][0] = "string";
		var removedLinesMatrix = this.internalMatrix._removeEmptyLines(doubleMatrix);
		assert.equal(removedLinesMatrix.length, 1, "The x length - should stay only 1 line");
	});

	QUnit.test("retrieve important info from input array", function(assert) {
		// Prepare input array
		var testRoot = createNodeElementFromOldVersion(1, 0,
			"state1", "", null, [10, 11, 12]);
		var testChildren1 = createNodeElementFromOldVersion(10, 4,
			"state1", "", 1, null);
		var testChildren2 = createNodeElementFromOldVersion(11, 3,
			"state2", "", 1, null);
		var testChildren3 = createNodeElementFromOldVersion(12, 2,
			"state2", "", 1, [5]);
		var testChildren4 = createNodeElementFromOldVersion(5, 3,
			"state2", "", 12, null);

		var inputArray = [];
		inputArray.push(testRoot);
		inputArray.push(testChildren1);
		inputArray.push(testChildren2);
		inputArray.push(testChildren3);
		inputArray.push(testChildren4);

		var inputMap = {};
		for (var i = 0; i < inputArray.length; i++) {
			inputMap[inputArray[i].nodeId] = inputArray[i];
		}
		var info = this.internalMatrix._retrieveInfoFromInputArray(inputMap);
		assert.ok(info, "result cannot be null");
		assert.equal(info.highestLanePosition, 4, "Lane should be 4 from node 10");
		assert.deepEqual(info.rootElements[0], testRoot, "The root element definition");
	});

	QUnit.test("retrieve important info from input array with nonnumeric IDs", function(assert) {
		// prepare input array
		var testRoot = createNodeElementFromOldVersion("id1", 0,
			"state1", "", null, ["id10", "id11", "id12"]);
		var testChildren1 = createNodeElementFromOldVersion("id10", 4,
			"state1", "", 1, null);
		var testChildren2 = createNodeElementFromOldVersion("id11", 3,
			"state2", "", 1, null);
		var testChildren3 = createNodeElementFromOldVersion("id12", 2,
			"state2", "", 1, ["id5"]);
		var testChildren4 = createNodeElementFromOldVersion("id5", 3,
			"state2", "", 12, null);

		var inputArray = [];
		inputArray.push(testRoot);
		inputArray.push(testChildren1);
		inputArray.push(testChildren2);
		inputArray.push(testChildren3);
		inputArray.push(testChildren4);

		var inputMap = {};
		for (var i = 0; i < inputArray.length; i++) {
			inputMap[inputArray[i].nodeId] = inputArray[i];
		}
		var info = this.internalMatrix._retrieveInfoFromInputArray(inputMap);
		assert.ok(info, "result cannot be null");
		assert.equal(info.highestLanePosition, 4, "Lane should be 4 from node 10");
		assert.deepEqual(info.rootElements[0], testRoot, "The root element definition");
	});

	QUnit.module("ProcessFlowMatrix - Internal matrix temporary calculations", {
		beforeEach: function() {
			this.processFlow = new ProcessFlow("fake");
			var testRoot = createNodeElementFromOldVersion(1, 0,
				"state1", "", null, [10, 11, 12]);
			var testChildren1 = createNodeElementFromOldVersion(
				10, 4, "state1", "", 1, null);
			var testChildren2 = createNodeElementFromOldVersion(
				11, 3, "state2", "", 1, null);
			var testChildren3 = createNodeElementFromOldVersion(
				12, 2, "state2", "", 1, [5]);
			var testChildren4 = createNodeElementFromOldVersion(
				5, 3, "state2", "", 12, null);

			this.internalMatrix = new ProcessFlow.InternalMatrixCalculation(this.processFlow);

			this.internalMatrix.nodePositions = {};

			this.internalMatrix.nodePositions[1] = {
				"c": testRoot,
				"x": 0,
				"y": 0
			};

			this.internalMatrix.nodePositions[10] = {
				"c": testChildren1,
				"x": 0,
				"y": 8
			};
			this.internalMatrix.nodePositions[11] = {
				"c": testChildren2,
				"x": 1,
				"y": 6
			};
			this.internalMatrix.nodePositions[12] = {
				"c": testChildren3,
				"x": 2,
				"y": 4
			};
			this.internalMatrix.nodePositions[5] = {
				"c": testChildren4,
				"x": 2,
				"y": 6
			};

			this.return2DimArray = this.internalMatrix._createMatrix(3, 9);
			this.return2DimArray[0][0] = testRoot;
			this.return2DimArray[0][8] = testChildren1;
			this.return2DimArray[1][6] = testChildren2;
			this.return2DimArray[2][4] = testChildren3;
			this.return2DimArray[2][6] = testChildren4;
		},
		afterEach: function() {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
		}
	});

	QUnit.test("calculate path matrix - exception throws because of negative horizontal layout", function(assert) {
		var nodeParent = {
			"c": { "nodeId": "parent" },
			"x": 0,
			"y": 2
		};
		var nodeChildren = {
			"c": { "nodeId": "children" },
			"x": 1,
			"y": 1
		};
		assert.throws(function() {
				this.internalMatrix._calculateSingleNodeConnection(nodeParent, nodeChildren, 0, 2, 1, 1, null);
			},
			Array
			, "Expected exception, because children is more left than parent");
	});

	QUnit.test("calculate path matrix - happy test case", function(assert) {
		var tempResultArray = this.internalMatrix
			._calculatePathInMatrix(this.return2DimArray);
		assert.ok(tempResultArray, "path matrix created");

		// now check the connections
		var connectionData = tempResultArray[0][1].getDrawData();
		assert.equal(connectionData.length, 3,
			"Connection is horizontal and down.");
		assert.equal(connectionData[0].flowLine, "rl", "first string");
		assert.equal(connectionData[1].flowLine, "lb", "second string");
		assert.equal(connectionData[2].flowLine, "lb", "third string");
	});

	QUnit.test("Sorting nodes based on the children - null input", function(assert) {
		var resultArray1 = this.internalMatrix._sortBasedOnChildren(null);
		var resultArray2 = this.internalMatrix._sortBasedOnChildren(undefined);
		var resultArray3 = this.internalMatrix._sortBasedOnChildren([]);

		assert.ok(resultArray1.length === 0, "Empty result expected");
		assert.ok(resultArray2.length === 0, "Empty result expected");
		assert.ok(resultArray3.length === 0, "Empty result expected");
	});

	QUnit.test("Sorting nodes based on the children - more children go first", function(assert) {
		var testChildren1 = createNodeElementFromOldVersion(2, 1,
			"state1", "", [1], null);
		var testChildren2 = createNodeElementFromOldVersion(3, 1,
			"state2", "", 1, [5, 6]);
		var testChildren3 = createNodeElementFromOldVersion(4, 1,
			"state2", "", 1, [5]);

		var inputArray = [];
		inputArray.push(testChildren1.nodeId);
		inputArray.push(testChildren2.nodeId);
		inputArray.push(testChildren3.nodeId);

		var mapChildren = {};
		mapChildren[testChildren1.nodeId] = testChildren1;
		mapChildren[testChildren2.nodeId] = testChildren2;
		mapChildren[testChildren3.nodeId] = testChildren3;

		var resultArray = this.internalMatrix._sortBasedOnChildren(inputArray, mapChildren);
		assert.ok(resultArray, "result may not be null");
		assert.ok(resultArray.length === 3, "there should be 3 children");
		assert.equal(resultArray[0], testChildren2);
		assert.equal(resultArray[1], testChildren3);
		assert.equal(resultArray[2], testChildren1);
	});

	QUnit.test("Sorting nodes based on the children - happy test case", function(assert) {

		var testChildren1 = createNodeElementFromOldVersion(2, 1,
			"state1", "", [1], [6]);
		var testChildren2 = createNodeElementFromOldVersion(3, 1,
			"state2", "", 1, [5]);
		var testChildren3 = createNodeElementFromOldVersion(4, 1,
			"state2", "", 1, [6]);

		var inputArray = [];
		inputArray.push(testChildren1.nodeId);
		inputArray.push(testChildren2.nodeId);
		inputArray.push(testChildren3.nodeId);

		var mapNodes = {};
		mapNodes[testChildren1.nodeId] = testChildren1;
		mapNodes[testChildren2.nodeId] = testChildren2;
		mapNodes[testChildren3.nodeId] = testChildren3;

		var resultArray = this.internalMatrix._sortBasedOnChildren(inputArray, mapNodes);
		assert.ok(resultArray, "result may not be null");
		assert.ok(resultArray.length === 3, "there should be 3 children");
		assert.equal(resultArray[0], testChildren1);
		assert.equal(resultArray[1], testChildren3);
		assert.equal(resultArray[2], testChildren2);
	});

	QUnit.module("Matrix optimization", {
		beforeEach: function() {
			this.processFlow = new ProcessFlow(
				"processFlow");
			this.processFlow._isLayoutOptimized = true;
			this.processFlow.placeAt("processflowdiv");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
		}
	});

	QUnit.test("Use case 1a: child on next lane", function(assert) {
		// Arrange
		// lane 0
		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({ nodeId: 1, children: [2, 6] }), null);
		// lane 1
		var testChildren2 = new ProcessFlow.NodeElement(2, 1,
			new ProcessFlowNode({ nodeId: 2, children: [3] }), [1]);
		var testChildren6 = new ProcessFlow.NodeElement(6, 1,
			new ProcessFlowNode({ nodeId: 6, children: [3] }), [1]);
		// lane 2
		var testChildren3 = new ProcessFlow.NodeElement(3, 2,
			new ProcessFlowNode({ nodeId: 3, children: [4, 5] }), [2, 6]);
		// lane 3
		var testChildren4 = new ProcessFlow.NodeElement(4, 3,
			new ProcessFlowNode({ nodeId: 4 }), [3]);
		var testChildren5 = new ProcessFlow.NodeElement(5, 3,
			new ProcessFlowNode({ nodeId: 5 }), [3]);

		// Act
		var inputArray = [];
		inputArray.push(testRoot);
		inputArray.push(testChildren2);
		inputArray.push(testChildren6);
		inputArray.push(testChildren3);
		inputArray.push(testChildren4);
		inputArray.push(testChildren5);
		var inputMap = {};
		for (var i = 0; i < inputArray.length; i++) {
			inputMap[inputArray[i].nodeId] = inputArray[i];
		}
		var matrix = this.processFlow._calculateMatrix(inputMap);

		// Assert
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 2, "Length X is 2");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testChildren2, "Element 2 is properly placed");
		// element 6 moved from [2:2] --> [1:2] (place optimized)
		assert.deepEqual(matrix[1][2], testChildren6, "Element 6 is properly placed (optimized)");
		assert.deepEqual(matrix[0][4], testChildren3, "Element 3 is properly placed");
		assert.deepEqual(matrix[0][6], testChildren4, "Element 4 is properly placed");
		assert.deepEqual(matrix[1][6], testChildren5, "Element 5 is properly placed");
	});

	QUnit.test("Use case 1b: child on any other lane but no nodes in between", function(assert) {
		// Arrange
		// lane 0
		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({ nodeId: 1, children: [2, 6] }), null);
		// lane 1
		var testChildren2 = new ProcessFlow.NodeElement(2, 1,
			new ProcessFlowNode({ nodeId: 2, children: [3] }), [1]);
		var testChildren6 = new ProcessFlow.NodeElement(6, 1,
			new ProcessFlowNode({ nodeId: 6, children: [5] }), [1]);
		// lane 2
		var testChildren3 = new ProcessFlow.NodeElement(3, 2,
			new ProcessFlowNode({ nodeId: 3, children: [4, 5] }), [2]);
		// lane 3
		var testChildren4 = new ProcessFlow.NodeElement(4, 3,
			new ProcessFlowNode({ nodeId: 4 }), [3]);
		var testChildren5 = new ProcessFlow.NodeElement(5, 3,
			new ProcessFlowNode({ nodeId: 5 }), [3, 6]);

		// Act
		var inputArray = [];
		inputArray.push(testRoot);
		inputArray.push(testChildren2);
		inputArray.push(testChildren6);
		inputArray.push(testChildren3);
		inputArray.push(testChildren4);
		inputArray.push(testChildren5);
		var inputMap = {};
		for (var i = 0; i < inputArray.length; i++) {
			inputMap[inputArray[i].nodeId] = inputArray[i];
		}
		var matrix = this.processFlow._calculateMatrix(inputMap);

		// Assert
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 2, "Length X is 2");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testChildren2, "Element 2 is properly placed");
		// element 6 moved from [2:2] --> [1:2] (place optimized)
		assert.deepEqual(matrix[1][2], testChildren6, "Element 6 is properly placed (optimized)");
		assert.deepEqual(matrix[0][4], testChildren3, "Element 3 is properly placed");
		assert.deepEqual(matrix[0][6], testChildren4, "Element 4 is properly placed");
		assert.deepEqual(matrix[1][6], testChildren5, "Element 5 is properly placed");
	});

	QUnit.test("Use case 2a: parent on previous lane and no children", function(assert) {
		// Arrange
		// lane 0
		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({ nodeId: 1, children: [2, 6] }), null);
		// lane 1
		var testChildren2 = new ProcessFlow.NodeElement(2, 1,
			new ProcessFlowNode({ nodeId: 2, children: [3] }), [1]);
		var testChildren6 = new ProcessFlow.NodeElement(6, 1,
			new ProcessFlowNode({ nodeId: 6 }), [1]);
		// lane 2
		var testChildren3 = new ProcessFlow.NodeElement(3, 2,
			new ProcessFlowNode({ nodeId: 3, children: [4, 5] }), [2]);
		// lane 3
		var testChildren4 = new ProcessFlow.NodeElement(4, 3,
			new ProcessFlowNode({ nodeId: 4 }), [3]);
		var testChildren5 = new ProcessFlow.NodeElement(5, 3,
			new ProcessFlowNode({ nodeId: 5 }), [3]);

		// Act
		var inputArray = [];
		inputArray.push(testRoot);
		inputArray.push(testChildren2);
		inputArray.push(testChildren6);
		inputArray.push(testChildren3);
		inputArray.push(testChildren4);
		inputArray.push(testChildren5);
		var inputMap = {};
		for (var i = 0; i < inputArray.length; i++) {
			inputMap[inputArray[i].nodeId] = inputArray[i];
		}
		var matrix = this.processFlow._calculateMatrix(inputMap);

		// Assert
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 2, "Length X is 2");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testChildren2, "Element 2 is properly placed");
		// element 6 moved from [2:2] --> [1:2] (place optimized)
		assert.deepEqual(matrix[1][2], testChildren6, "Element 6 is properly placed (optimized)");
		assert.deepEqual(matrix[0][4], testChildren3, "Element 3 is properly placed");
		assert.deepEqual(matrix[0][6], testChildren4, "Element 4 is properly placed");
		assert.deepEqual(matrix[1][6], testChildren5, "Element 5 is properly placed");
	});

	QUnit.test("Use case 2b: parent above the children - no optimization required", function(assert) {
		// Arrange
		// lane 0
		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({ nodeId: 1, children: [2, 4, 5, 7] }), null);
		// lane 1
		var testChildren2 = new ProcessFlow.NodeElement(2, 1,
			new ProcessFlowNode({ nodeId: 2, children: [3] }), [1]);
		var testChildren4 = new ProcessFlow.NodeElement(4, 1,
			new ProcessFlowNode({ nodeId: 4 }), [1]);
		var testChildren5 = new ProcessFlow.NodeElement(5, 1,
			new ProcessFlowNode({ nodeId: 5, children: [6] }), [1]);
		var testChildren7 = new ProcessFlow.NodeElement(7, 1,
			new ProcessFlowNode({ nodeId: 7, children: [6] }), [1]);
		// lane 2
		var testChildren3 = new ProcessFlow.NodeElement(3, 2,
			new ProcessFlowNode({ nodeId: 3, children: [8, 9] }), [2]);
		var testChildren6 = new ProcessFlow.NodeElement(6, 2,
			new ProcessFlowNode({ nodeId: 6 }), [5, 7]);
		// lane 3
		var testChildren8 = new ProcessFlow.NodeElement(8, 3,
			new ProcessFlowNode({ nodeId: 8 }), [3]);
		var testChildren9 = new ProcessFlow.NodeElement(9, 3,
			new ProcessFlowNode({ nodeId: 9 }), [3]);

		// Act
		var inputArray = [];
		inputArray.push(testRoot);
		inputArray.push(testChildren2);
		inputArray.push(testChildren3);
		inputArray.push(testChildren4);
		inputArray.push(testChildren5);
		inputArray.push(testChildren6);
		inputArray.push(testChildren7);
		inputArray.push(testChildren8);
		inputArray.push(testChildren9);
		var inputMap = {};
		for (var i = 0; i < inputArray.length; i++) {
			inputMap[inputArray[i].nodeId] = inputArray[i];
		}
		var matrix = this.processFlow._calculateMatrix(inputMap);

		// Assert
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 4, "Length X is 4");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testChildren2, "Element 2 is properly placed");
		assert.deepEqual(matrix[0][4], testChildren3, "Element 3 is properly placed");
		assert.deepEqual(matrix[1][2], testChildren5, "Element 5 is properly placed");
		assert.deepEqual(matrix[2][2], testChildren7, "Element 7 is properly placed");
		assert.deepEqual(matrix[3][2], testChildren4, "Element 4 is properly placed");
		// element 6 is placed on the same initial position (place cannot be optimized)
		assert.deepEqual(matrix[2][4], testChildren6, "Element 6 is properly placed (cannot be optimized)");
		assert.deepEqual(matrix[0][6], testChildren8, "Element 8 is properly placed");
		assert.deepEqual(matrix[1][6], testChildren9, "Element 9 is properly placed");
	});

	QUnit.test("Use case 3: nodes do not cross the existing connections", function(assert) {
		// Arrange
		// lane 0
		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({ nodeId: 1, children: [2, 3, 5] }), null);
		// lane 1
		var testChildren5 = new ProcessFlow.NodeElement(5, 1,
			new ProcessFlowNode({ nodeId: 5, children: [4] }), [1]);
		// lane 2
		var testChildren2 = new ProcessFlow.NodeElement(2, 2,
			new ProcessFlowNode({ nodeId: 2 }), [1]);
		var testChildren3 = new ProcessFlow.NodeElement(3, 2,
			new ProcessFlowNode({ nodeId: 3 }), [1]);
		var testChildren4 = new ProcessFlow.NodeElement(4, 2,
			new ProcessFlowNode({ nodeId: 4 }), [5]);

		// Act
		var inputArray = [];
		inputArray.push(testRoot);
		inputArray.push(testChildren2);
		inputArray.push(testChildren3);
		inputArray.push(testChildren4);
		inputArray.push(testChildren5);
		var inputMap = {};
		for (var i = 0; i < inputArray.length; i++) {
			inputMap[inputArray[i].nodeId] = inputArray[i];
		}
		var matrix = this.processFlow._calculateMatrix(inputMap);

		// Assert
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 3, "Length X is 3");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][4], testChildren2, "Element 2 is properly placed");
		assert.deepEqual(matrix[1][4], testChildren3, "Element 3 is properly placed");
		assert.deepEqual(matrix[2][4], testChildren4, "Element 4 is properly placed");
		// element 5 is placed on the same initial position (place cannot be optimized)
		assert.deepEqual(matrix[2][2], testChildren5, "Element 5 is properly placed (cannot be optimized)");
	});

	QUnit.test("Use case 4: nodes on the same lane, no overlapping connections - partially optimized", function(assert) {
		// Arrange
		// lane 0
		var testRoot = new ProcessFlow.NodeElement(1, 0,
			new ProcessFlowNode({ nodeId: 1, children: [2, 7, 8] }), null);
		// lane 1
		var testChildren2 = new ProcessFlow.NodeElement(2, 1,
			new ProcessFlowNode({ nodeId: 2, children: [3, 6] }), [1]);
		var testChildren7 = new ProcessFlow.NodeElement(7, 1,
			new ProcessFlowNode({ nodeId: 7, children: [3] }), [1]);
		var testChildren8 = new ProcessFlow.NodeElement(8, 1,
			new ProcessFlowNode({ nodeId: 8, children: [3] }), [1]);
		// lane 2
		var testChildren3 = new ProcessFlow.NodeElement(3, 2,
			new ProcessFlowNode({ nodeId: 3, children: [4, 5] }), [2, 7, 8]);
		var testChildren6 = new ProcessFlow.NodeElement(6, 2,
			new ProcessFlowNode({ nodeId: 6 }), [2]);
		// lane 3
		var testChildren4 = new ProcessFlow.NodeElement(4, 3,
			new ProcessFlowNode({ nodeId: 4 }), [3]);
		var testChildren5 = new ProcessFlow.NodeElement(5, 3,
			new ProcessFlowNode({ nodeId: 5 }), [3]);

		// Act
		var inputArray = [];
		inputArray.push(testRoot);
		inputArray.push(testChildren2);
		inputArray.push(testChildren3);
		inputArray.push(testChildren4);
		inputArray.push(testChildren5);
		inputArray.push(testChildren6);
		inputArray.push(testChildren7);
		inputArray.push(testChildren8);
		var inputMap = {};
		for (var i = 0; i < inputArray.length; i++) {
			inputMap[inputArray[i].nodeId] = inputArray[i];
		}
		var matrix = this.processFlow._calculateMatrix(inputMap);

		// Assert
		assert.ok(matrix, "Matrix is at least created");
		assert.equal(matrix.length, 4, "Length X is 4");
		assert.deepEqual(matrix[0][0], testRoot, "Root element is properly placed");
		assert.deepEqual(matrix[0][2], testChildren2, "Element 2 is properly placed");
		assert.deepEqual(matrix[0][4], testChildren3, "Element 3 is properly placed");
		assert.deepEqual(matrix[0][6], testChildren4, "Element 4 is properly placed");
		assert.deepEqual(matrix[1][6], testChildren5, "Element 5 is properly placed");
		// elements 7, 8 are placed one position above (partially optimized)
		assert.deepEqual(matrix[2][2], testChildren7, "Element 7 is properly placed (partially optimized)");
		assert.deepEqual(matrix[3][2], testChildren8, "Element 8 is properly placed (partially optimized)");
		// element 6 is placed one position above (place optimized)
		assert.deepEqual(matrix[1][4], testChildren6, "Element 6 is properly placed (optimized)");
	});

}, /* bExport= */ true);
