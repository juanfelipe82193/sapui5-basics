sap.ui.define([
	"sap/suite/ui/commons/ProcessFlow",
	"sap/suite/ui/commons/ProcessFlowNode",
	"sap/suite/ui/commons/ProcessFlowLaneHeader",
	"sap/suite/ui/commons/ProcessFlowNodeState",
	"sap/ui/model/json/JSONModel",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (ProcessFlow, ProcessFlowNode, ProcessFlowLaneHeader, ProcessFlowNodeState, JSONModel, CreateAndAppendDiv) {
	"use strict";

	CreateAndAppendDiv("processflowdiv").setAttribute("style", "width: 1025px;");
	CreateAndAppendDiv("processflowdiv599").setAttribute("style", "width: 599px;");
	CreateAndAppendDiv("processflowdiv1023").setAttribute("style", "width: 1023px;");
	CreateAndAppendDiv("processflowdiv1025").setAttribute("style", "width: 1025px;");
	CreateAndAppendDiv("processflowdiv450").setAttribute("style", "width: 1025px; min-width: 450px; max-width: 450px;");

	QUnit.module("Lane Aggregation", {
		beforeEach: function () {
			this.processFlow = new ProcessFlow("processFlow", {
				nodes: {
					path: "/nodes",
					template: new ProcessFlowNode({
						nodeId: "{id}",
						laneId: "{lane}",
						title: "{title}",
						children: "{children}",
						isTitleClickable: true,
						state: "{state}",
						stateText: "{stateText}",
						texts: "{texts}"
					})
				}, // end of node
				lanes: {
					path: "/lanes",
					template: new ProcessFlowLaneHeader({
						laneId: "{id}",
						iconSrc: "{icon}",
						text: "{label}",
						state: "{state}",
						position: "{position}"
					})
				} // end of headerlane
			});
			var oDataProcessFlowLanesAndNodes = {
				nodes:
					[
						{
							id: "1",
							lane: "0",
							title: "Sales Order 1",
							titleAbbreviation: "SO 1",
							children: [2],
							state: ProcessFlowNodeState.Positive,
							stateText: "OK status",
							focused: true,
							texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]
						},
						{
							id: "2",
							lane: "1",
							title: "Invoice 2",
							children: [],
							state: ProcessFlowNodeState.Negative,
							stateText: "NOT OK"
						}
					],
				lanes:
					[
						{id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0},
						{id: "1", icon: "sap-icon://payment-approval", label: "In Invoice", position: 1}
					]
			};
			var oModel = new JSONModel();
			oModel.setData(oDataProcessFlowLanesAndNodes);
			this.processFlow.setModel(oModel);
			this.processFlow.placeAt("processflowdiv");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
		}
	});

	QUnit.test("Get Lane By Id - Valid Lane Id", function (assert) {
		//arrange
		//act
		var oLane = this.processFlow.getLane("1");
		//assert
		assert.equal(oLane.getLaneId(), "1", "Requested Lane is returned");
	});

	QUnit.test("Get Lane By Id - Invalid Lane Id", function (assert) {
		//arrange
		//act
		var oLane = this.processFlow.getLane("10");
		//assert
		assert.equal(oLane, undefined, "Empty Lane is returned");
	});

	QUnit.module("Node Aggregation", {
		beforeEach: function () {
			this.processFlow = new ProcessFlow("processFlow", {
				nodes: {
					path: "/nodes",
					template: new ProcessFlowNode({
						nodeId: "{id}",
						laneId: "{lane}",
						title: "{title}",
						children: "{children}",
						isTitleClickable: true,
						state: "{state}",
						stateText: "{stateText}",
						texts: "{texts}"
					})
				}, // end of node
				lanes: {
					path: "/lanes",
					template: new ProcessFlowLaneHeader({
						laneId: "{id}",
						iconSrc: "{icon}",
						text: "{label}",
						state: "{state}",
						position: "{position}"
					})
				} // end of headerlane
			});
			var oDataProcessFlowLanesAndNodes = {
				nodes:
					[
						{
							id: "1",
							lane: "0",
							title: "Sales Order 1",
							titleAbbreviation: "SO 1",
							children: [2],
							state: ProcessFlowNodeState.Positive,
							stateText: "OK status",
							focused: true,
							texts: ["Sales Order Document Overdue long text for the wrap up all the aspects", "Not cleared"]
						},
						{
							id: "2",
							lane: "1",
							title: "Invoice 2",
							children: [],
							state: ProcessFlowNodeState.Negative,
							stateText: "NOT OK"
						}
					],
				lanes:
					[
						{id: "0", icon: "sap-icon://order-status", label: "In Order", position: 0},
						{id: "1", icon: "sap-icon://payment-approval", label: "In Invoice", position: 1}
					]
			};
			var oModel = new JSONModel();
			oModel.setData(oDataProcessFlowLanesAndNodes);
			this.processFlow.setModel(oModel);
			this.processFlow.placeAt("processflowdiv");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
		}
	});

	QUnit.test("Get Node By Id - Valid Node Id", function (assert) {
		//arrange
		//act
		var oNode = this.processFlow.getNode("2");
		//assert
		assert.equal(oNode.getNodeId(), "2", "Requested Node is returned");
	});

	QUnit.test("Get Node By Id - Invalid Node Id", function (assert) {
		//arrange
		//act
		var oNode = this.processFlow.getNode("10");
		//assert
		assert.equal(oNode, undefined, "Empty Node is returned");
	});

}, /* bExport= */ true);
