sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/ProcessFlow",
	"sap/suite/ui/commons/ProcessFlowNode",
	"sap/suite/ui/commons/ProcessFlowLaneHeader",
	"sap/suite/ui/commons/ProcessFlowNodeState",
	"sap/ui/model/json/JSONModel",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/qunit/QUnitUtils"
], function (jQuery, ProcessFlow, ProcessFlowNode, ProcessFlowLaneHeader, ProcessFlowNodeState, JSONModel, CreateAndAppendDiv, qutils) {
	"use strict";

	CreateAndAppendDiv("processflowdiv").setAttribute("style", "width: 1025px;");
	CreateAndAppendDiv("processflowdiv599").setAttribute("style", "width: 599px;");
	CreateAndAppendDiv("processflowdiv1023").setAttribute("style", "width: 1023px;");
	CreateAndAppendDiv("processflowdiv1025").setAttribute("style", "width: 1025px;");
	CreateAndAppendDiv("processflowdiv450").setAttribute("style", "width: 1025px; min-width: 450px; max-width: 450px;");

	QUnit.module("ProcessFlowKeyboardInteraction - Basic Tests", {
		beforeEach: function () {
			var oDataCC2 = {
				nodes:
					[
						{
							id: "1",
							lane: "id0",
							title: "0Sales Order 120 [0,1]",
							children: [10, 11],
							state: ProcessFlowNodeState.Positive,
							focused: true
						},
						{
							id: "10",
							lane: "id1",
							title: "1Outbound Delivery 80017028 [0,3]",
							children: [20, 21],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "11",
							lane: "id1",
							title: "2Outbound Delivery 80017558 [2,3]",
							children: [22],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "20",
							lane: "id2",
							title: "3Customer Invoice 9004562 [0, 5]",
							children: [33],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "21",
							lane: "id2",
							title: "4Planned Customer Invoice [1,5]",
							children: null,
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "22",
							lane: "id2",
							title: "5Customer Invoice 7004573 [2,5]",
							children: [31, 32],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "31",
							lane: "id3",
							title: "6Accounting Document 78998790 [2,7]",
							children: [41, 42],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "32",
							lane: "id3",
							title: "7Accounting Document 78547895 [4,7]",
							children: [43],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "33",
							lane: "id3",
							title: "8Accounting Document 9004562 [0,7]",
							children: [44],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "41",
							lane: "id4",
							title: "9Planned Payment Document [3,9]",
							children: null,
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "42",
							lane: "id4",
							title: "10Payment Document 75978544 [2,9]",
							children: [51],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "43",
							lane: "id4",
							title: "11Payment Document 65945539 [4,9]",
							children: [52, 53, 54, 56],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "44",
							lane: "id4",
							title: "12Payment Document 9004562 [0,9]",
							children: [55],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "51",
							lane: "id5",
							title: "13Acceptance Letter 45784561 [2, 11]",
							children: null,
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "52",
							lane: "id5",
							title: "14Acceptance Letter 85745544 [4,11]",
							children: null,
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "53",
							lane: "id5",
							title: "15Planned Acceptance Letter [5,11]",
							children: null,
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "54",
							lane: "id5",
							title: "16Acceptance Letter [6,11]",
							children: null,
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "55",
							lane: "id5",
							title: "17Delivered 9004562 [0,11]",
							children: [61],
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "56",
							lane: "id5",
							title: "18Acceptance letter  [7,11]",
							children: null,
							state: ProcessFlowNodeState.Positive
						},
						{
							id: "61",
							lane: "id6",
							title: "19Artificial 9004562 [0,13]",
							children: null,
							state: ProcessFlowNodeState.Positive
						}
					],
				// this should be lane as the name to be consistent
				// laned id is better than position
				// no big different between parent and/or child elements. Our team has to decide what is more suitable for us.
				lanes: [
					{
						id: "id0",
						iconSrc: "sap-icon://order-status",
						text: "In Order",
						position: 0
					}, // first header element
					{
						id: "id1",
						iconSrc: "sap-icon://order-status",
						text: "In Delivery",
						position: 1
					}, // second header element
					{
						id: "id2",
						iconSrc: "sap-icon://order-status",
						text: "In Invoice",
						position: 2
					},
					{
						id: "id3",
						iconSrc: "sap-icon://order-status",
						text: "In Accounting",
						position: 3
					},
					{
						id: "id4",
						iconSrc: "sap-icon://order-status",
						text: "In Payment",
						position: 4
					},
					{
						id: "id5",
						iconSrc: "sap-icon://order-status",
						text: "Delivered",
						position: 5
					},
					{
						id: "id6",
						iconSrc: "sap-icon://order-status",
						text: "Artificial",
						position: 6
					}
				]
			};

			var oJModelCC2 = new JSONModel(oDataCC2);
			this.oProcessFlowCC2 = new ProcessFlow("pComplexCase2", {
				foldedCorners: true,
				nodes: {
					path: "/nodes",
					template: new ProcessFlowNode({
						focused: "{focused}",
						nodeId: "{id}",
						laneId: "{lane}",
						title: "{title}",
						isTitleClickable: true,
						children: "{children}",
						state: "{state}",
						titleAbbreviation: "{title}" + "abbr",
						stateText: "{state}",
						tag: {tagCheck: "tagCheck"},
						texts: ["text with number 1 is running over two rows", "text with number 2 is running ower three rows, but it is hidden"]
					})
				},
				lanes: {
					path: "/lanes",
					template: new ProcessFlowLaneHeader({
						laneId: "{id}",
						iconSrc: "{iconSrc}",
						text: "{text}",
						state: "{state}",
						position: "{position}"
					})
				},
				scrollable: false,
				wheelZoomable: false
			});

			this.oProcessFlowCC2.setModel(oJModelCC2);
			this.oProcessFlowCC2.placeAt("processflowdiv");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.oProcessFlowCC2) {
				this.oProcessFlowCC2.destroy();
			}
		}
	});

	QUnit.test("Move focus based on arrow - check movement function to left", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		assert.ok(nodes[0].getFocused(), "Root nodes is focused");
		nodes[0]._setNavigationFocus(true);

		var bMovePossible = this.oProcessFlowCC2._moveToNextElement(ProcessFlow._enumMoveDirection.RIGHT);
		//the node 10 should be focused, the node 1 is unfocused
		assert.ok(!nodes[0]._getNavigationFocus(), "Root node not focused anymore.");
		assert.ok(nodes[1]._getNavigationFocus(), "First children focused now.");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on arrow - check movement function last element on row", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes(assert);
		nodes[17]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveToNextElement(ProcessFlow._enumMoveDirection.RIGHT);
		//the node 10 should be focused, the node 1 is unfocused
		assert.ok(!nodes[17]._getNavigationFocus(), "Root node not focused anymore.");
		assert.ok(nodes[19]._getNavigationFocus(), "First children focused now.");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on arrow - check movement function with highligted nodes", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(true);
		nodes[0].setHighlighted(true);
		nodes[2].setHighlighted(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveToNextElement(ProcessFlow._enumMoveDirection.RIGHT);
		//the node 10 should be focused, the node 1 is unfocused
		assert.ok(!nodes[0]._getNavigationFocus(), "Root node not focused anymore.");
		assert.ok(nodes[2]._getNavigationFocus(), "First children focused now.");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on arrow - check movement to the left same line", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[1]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveToNextElement(ProcessFlow._enumMoveDirection.LEFT);
		//the node 10 should be focused, the node 1 is unfocused
		assert.ok(nodes[0]._getNavigationFocus(), "Root node focused.");
		assert.ok(!nodes[1]._getNavigationFocus(), "First children not focused anymore.");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on arrow - check movement to the top left", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[2]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveToNextElement(ProcessFlow._enumMoveDirection.LEFT);
		//the node 10 should be focused, the node 1 is unfocused
		assert.ok(nodes[4]._getNavigationFocus(), "Root node focused.");
		assert.ok(!nodes[2]._getNavigationFocus(), "First children not focused anymore.");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on arrow - check movement to the top left, highligted nodes", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[2]._setNavigationFocus(true);
		nodes[0].setHighlighted(true);
		nodes[2].setHighlighted(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveToNextElement(ProcessFlow._enumMoveDirection.LEFT);
		//the node 10 should be focused, the node 1 is unfocused
		assert.ok(nodes[0]._getNavigationFocus(), "Root node focused.");
		assert.ok(!nodes[2]._getNavigationFocus(), "First children not focused anymore.");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on arrow - check movement one up single case", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[4]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveToNextElement(ProcessFlow._enumMoveDirection.UP);
		//the node 10 should be focused, the node 1 is unfocused
		assert.ok(nodes[3]._getNavigationFocus(), "Root node focused.");
		assert.ok(!nodes[4]._getNavigationFocus(), "First children not focused anymore.");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on arrow - check movement one up search case", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[9]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveToNextElement(ProcessFlow._enumMoveDirection.UP);
		this.oProcessFlowCC2.updateModel();
		//the node 10 should be focused, the node 1 is unfocused
		assert.ok(nodes[10]._getNavigationFocus(), "Planned customer invoince.");
		assert.ok(!nodes[9]._getNavigationFocus(), "First children not focused anymore.");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on arrow - check movement one up without change", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveToNextElement(ProcessFlow._enumMoveDirection.UP);
		this.oProcessFlowCC2.updateModel();
		//the node 10 should be focused, the node 1 is unfocused
		assert.ok(nodes[0]._getNavigationFocus(), "Root node still focused.");
		assert.ok(!bMovePossible, "Next selection not possible, what is ok.");
	});

	QUnit.test("Move focus based on arrow - check movement one down single case", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[9]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveToNextElement(ProcessFlow._enumMoveDirection.DOWN);
		//the node 10 should be focused, the node 1 is unfocused
		assert.ok(nodes[11]._getNavigationFocus(), "node 11 focused");
		assert.ok(!nodes[9]._getNavigationFocus(), "not focused anymore");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on arrow - check movement one down search case", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(true);
		nodes[2]._setNavigationFocus(false);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveToNextElement(ProcessFlow._enumMoveDirection.DOWN);
		//the node 10 should be focused, the node 1 is unfocused
		assert.ok(nodes[4]._getNavigationFocus(), "ID 2 node focused.");
		assert.ok(!nodes[0]._getNavigationFocus(), "Root not focused anymore.");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on arrow - check movement one down search without move", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[18]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveToNextElement(ProcessFlow._enumMoveDirection.DOWN);
		assert.ok(nodes[18]._getNavigationFocus(), "Last node still  focused.");
		assert.ok(!bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on HOME - check movement to the first item in the same row", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[8]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveHomeEnd(ProcessFlow._enumMoveDirection.LEFT);
		assert.ok(nodes[0]._getNavigationFocus(), "First element in row focus");
		assert.ok(!nodes[8]._getNavigationFocus(), "Previous not focused anymore");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on CTRL HOME - check movement to the first item in the same column", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[9]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveHomeEnd(ProcessFlow._enumMoveDirection.LEFT, true);
		assert.ok(nodes[12]._getNavigationFocus(), "First element in row focus");
		assert.ok(!nodes[8]._getNavigationFocus(), "Previous not focused anymore");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on END - check movement to the last item in the same row", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[8]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveHomeEnd(ProcessFlow._enumMoveDirection.RIGHT);
		assert.ok(nodes[19]._getNavigationFocus(), "Last element in row focus");
		assert.ok(!nodes[8]._getNavigationFocus(), "Previous not focused anymore");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on CTRL END - check movement to the last item in the same column", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[14]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveHomeEnd(ProcessFlow._enumMoveDirection.RIGHT, true);
		assert.ok(nodes[18]._getNavigationFocus(), "First element in row focus");
		assert.ok(!nodes[14]._getNavigationFocus(), "Previous not focused anymore");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on PAGEUP - check movement to minus 5 columns", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[16]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveOnePage(ProcessFlow._enumMoveDirection.UP, false);
		assert.ok(nodes[17]._getNavigationFocus(), "First element in row focus");
		assert.ok(!nodes[16]._getNavigationFocus(), "Previous not focused anymore");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on ALT PAGEUP - check movement to minus 5 to the left", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[19]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveOnePage(ProcessFlow._enumMoveDirection.UP, true);
		assert.ok(nodes[1]._getNavigationFocus(), "First element in row focus");
		assert.ok(!nodes[19]._getNavigationFocus(), "Previous not focused anymore");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on PAGEDOWN - check movement to plus 5 columns", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(false);
		nodes[17]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveOnePage(ProcessFlow._enumMoveDirection.DOWN, false);
		assert.ok(nodes[18]._getNavigationFocus(), "First element in row focus");
		assert.ok(!nodes[17]._getNavigationFocus(), "Previous not focused anymore");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.test("Move focus based on ALT PAGEUP - check movement to minus 5 to the right", function (assert) {
		var nodes = this.oProcessFlowCC2.getNodes();
		nodes[0]._setNavigationFocus(true);
		this.oProcessFlowCC2.updateModel();
		// the tab key is pressed
		var bMovePossible = this.oProcessFlowCC2._moveOnePage(ProcessFlow._enumMoveDirection.DOWN, true);
		assert.ok(nodes[17]._getNavigationFocus(), "First element in row focus");
		assert.ok(!nodes[0]._getNavigationFocus(), "Previous not focused anymore");
		assert.ok(bMovePossible, "Next selection succesfully done.");
	});

	QUnit.module("ProcessFlowKeyboardInteraction - Testcases for keyboard interaction", {});

	var oData = {
		nodes: [{id: "node1", lane: "id0", title: "title1", children: null}],
		lanes:
			[{
				id: "id0",
				iconSrc: "sap-icon://order-status",
				text: "Id 1 position 0",
				state: [{state: ProcessFlowNodeState.Positive, value: 20}
					, {state: ProcessFlowNodeState.Negative, value: 30}
					, {state: ProcessFlowNodeState.Neutral, value: 30}
					, {state: ProcessFlowNodeState.Planned, value: 20}],
				position: 0
			}]
	};

	function buildProcessFlow(idx) {
		var oProcessFlow = new ProcessFlow("keyboardPF" + idx, {
			nodes: {
				path: "/nodes",
				template: new ProcessFlowNode({
					nodeId: "{id}",
					laneId: "{lane}",
					title: "{title}",
					children: "{children}",
					isTitleClickable: true,
					state: ProcessFlowNodeState.Positive,
					stateText: "Acc Document Overdue",
					texts: ["Credit Blocked", "Planned Shipped on 23.02.2014"]
				})
			},
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
		var oJModel = new JSONModel(jQuery.extend(true, {}, oData));
		oProcessFlow.setModel(oJModel);
		oProcessFlow.placeAt("processflowdiv");
		sap.ui.getCore().applyChanges();

		return oProcessFlow;
	}

	QUnit.test("Check the keyboard event on processflow chart - ENTER", function (assert) {
		//Arrange
		var oProcessFlow = buildProcessFlow(1);

		//Act
		var aNodes = oProcessFlow.getNodes();
		aNodes[0]._setNavigationFocus(true);
		oProcessFlow._lastNavigationFocusElement = aNodes[0];

		//Assert
		oProcessFlow.attachNodePress(function (oEvent) {
			assert.ok(oEvent, "event exists.");
			assert.ok(oEvent.mParameters, "parameters exist ... ");
			assert.equal(oEvent.getParameters().getId(), aNodes[0].getId(), "Id is pressed : " + oEvent.getParameters().getId());
		});
		qutils.triggerKeydown(aNodes[0].getDomRef(), jQuery.sap.KeyCodes.ENTER);
		qutils.triggerKeyup(aNodes[0].getDomRef(), jQuery.sap.KeyCodes.ENTER);
		oProcessFlow.destroy();
	});

	QUnit.test("Check the keyboard event on processflow chart - SPACE", function (assert) {
		//Arrange
		var oProcessFlow = buildProcessFlow(2);

		//Act
		var aNodes = oProcessFlow.getNodes();
		aNodes[0]._setNavigationFocus(true);
		oProcessFlow._lastNavigationFocusElement = aNodes[0];

		//Assert
		oProcessFlow.attachNodePress(function (oEvent) {
			assert.ok(oEvent, "event exists.");
			assert.ok(oEvent.mParameters, "parameters exist ... ");
			assert.equal(oEvent.getParameters().getId(), aNodes[0].getId(), "Id is pressed : " + oEvent.getParameters().getId());
		});
		qutils.triggerKeydown(aNodes[0].getDomRef(), jQuery.sap.KeyCodes.SPACE);
		qutils.triggerKeyup(aNodes[0].getDomRef(), jQuery.sap.KeyCodes.SPACE);
		oProcessFlow.destroy();
	});

	QUnit.test("Check the keyboard event on processflow chart - unfocus navigation element - TAB", function (assert) {
		//Arrange
		var oProcessFlow = buildProcessFlow(3);

		//Act
		var aNodes = oProcessFlow.getNodes();
		aNodes[0]._setNavigationFocus(false);
		oProcessFlow._lastNavigationFocusElement = null;
		qutils.triggerKeyboardEvent(aNodes[0].getDomRef(), jQuery.sap.KeyCodes.TAB);

		//Assert
		assert.ok(!oProcessFlow._getLastNavigationFocusElement(), "navigation focus NOT on element ... ");
		oProcessFlow.destroy();
	});

	QUnit.test("Check the keyboard event on processflow chart - TAB", function (assert) {
		//Arrange
		var oProcessFlow = buildProcessFlow(4);

		//Act
		var aNodes = oProcessFlow.getNodes();
		aNodes[0]._setNavigationFocus(true);
		oProcessFlow._lastNavigationFocusElement = aNodes[0];
		qutils.triggerKeyboardEvent(aNodes[0].getDomRef(), jQuery.sap.KeyCodes.TAB);

		//Assert
		assert.ok(oProcessFlow._getLastNavigationFocusElement()._getNavigationFocus(), "navigation focus on element ... ");
		oProcessFlow.destroy();
	});

	QUnit.test("Check the keyboard event on processflow chart - unfocus navigation element - Shift-TAB", function (assert) {
		//Arrange
		var oProcessFlow = buildProcessFlow(5);

		//Act
		var aNodes = oProcessFlow.getNodes();
		oProcessFlow._lastNavigationFocusElement = null;
		qutils.triggerKeyboardEvent(aNodes[0].getDomRef(), jQuery.sap.KeyCodes.TAB, true, false, false);

		//Assert
		assert.ok(!oProcessFlow._getLastNavigationFocusElement(), "navigation focus NOT on element ... ");
		oProcessFlow.destroy();
	});

	QUnit.test("Check the keyboard event on processflow chart - focus navigation element - Shift-TAB", function (assert) {
		//Arrange
		var oProcessFlow = buildProcessFlow(6);

		//Act
		var aNodes = oProcessFlow.getNodes();
		aNodes[0]._setNavigationFocus(true);
		oProcessFlow._lastNavigationFocusElement = aNodes[0];
		qutils.triggerKeyboardEvent(aNodes[0].getDomRef(), jQuery.sap.KeyCodes.TAB, true, false, false);

		//Assert
		assert.ok(oProcessFlow._getLastNavigationFocusElement()._getNavigationFocus(), "navigation focus on element ... ");
		oProcessFlow.destroy();
	});
});
