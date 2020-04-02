sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/ProcessFlowConnection",
	"sap/suite/ui/commons/ProcessFlowNodeState",
	"sap/suite/ui/commons/ProcessFlowDisplayState",
	"sap/suite/ui/commons/ProcessFlowZoomLevel",
	"sap/suite/ui/commons/ProcessFlowNode",
	"sap/suite/ui/commons/ProcessFlow",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function(jQuery, ProcessFlowConnection, ProcessFlowNodeState, ProcessFlowDisplayState, ProcessFlowZoomLevel, ProcessFlowNode,
            ProcessFlow, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("processFlowConnection");

	function drawProcessFlowConnections(flowLine, type) {

		function draw(type) {
			var connectionData = [];
			connectionData.push(getSingleConnectionData(type));

			var processFlowConnection = new ProcessFlowConnection(flowLine + "_" + type);
			processFlowConnection.setDrawData(connectionData);
			processFlowConnection.setZoomLevel(getZoomLevel(type));
			processFlowConnection.placeAt("processFlowConnection");

			return processFlowConnection;
		}

		function getSingleConnectionData(type) {
			var singleConnectionData = {};
			singleConnectionData.flowLine = flowLine;
			singleConnectionData.targetNodeState = getTargetNodeState(type);
			singleConnectionData.displayState = getDisplayState(type);
			if (flowLine.indexOf("r") >= 0) {
				singleConnectionData.hasArrow = getArrowState(type);
			} else {
				singleConnectionData.hasArrow = false;
			}

			return singleConnectionData;
		}

		function getTargetNodeState(type) {
			var connectionTypes = type.split("_");
			switch (connectionTypes[0]) {
				case "created":
					return ProcessFlowNodeState.Positive;
				case "planned":
					return ProcessFlowNodeState.Planned;
				case "critical":
					return ProcessFlowNodeState.Critical;
				default:
					return null;
			}
		}

		function getDisplayState(type) {
			var connectionTypes = type.split("_");
			switch (connectionTypes[1]) {
				case "regular":
					return ProcessFlowDisplayState.Regular;
				case "highlighted":
					return ProcessFlowDisplayState.Highlighted;
				case "dimmed":
					return ProcessFlowDisplayState.Dimmed;
				default:
					return null;
			}
		}

		function getZoomLevel(type) {
			var connectionTypes = type.split("_");
			switch (connectionTypes[2]) {
				case "one":
					return ProcessFlowZoomLevel.One;
				case "two":
					return ProcessFlowZoomLevel.Two;
				case "three":
					return ProcessFlowZoomLevel.Three;
				case "four":
					return ProcessFlowZoomLevel.Four;
				default:
					return null;
			}
		}

		function getArrowState(type) {
			var connectionTypes = type.split("_");
			return connectionTypes.length === 4 && connectionTypes[3] === "arrow";
		}

		return draw(type);
	}


	/* --- Tests --- */

	QUnit.module("Basic Tests", {
		beforeEach: function () {
			this.aPFC = [];
		},
		afterEach: function () {
			for (var i = 0; i < this.aPFC.length; i++) {
				this.aPFC[i].destroy();
			}
		}
	});

	QUnit.test("Connection rtlb is rendered", function (assert) {
		this.aPFC.push(
			drawProcessFlowConnections("rtlb", "created_regular_one"),
			drawProcessFlowConnections("rtlb", "created_regular_two"),
			drawProcessFlowConnections("rtlb", "created_dimmed_two_arrow"),
			drawProcessFlowConnections("rtlb", "created_highlighted_three_arrow"),
			drawProcessFlowConnections("rtlb", "planned_dimmed_one_arrow"),
			drawProcessFlowConnections("rtlb", "planned_regular_three"),
			drawProcessFlowConnections("rtlb", "planned_dimmed_four"),
			drawProcessFlowConnections("rtlb", "planned_highlighted_four_arrow"),
			drawProcessFlowConnections("rtlb", "critical_dimmed_one_arrow"),
			drawProcessFlowConnections("rtlb", "critical_regular_three"),
			drawProcessFlowConnections("rtlb", "critical_dimmed_four"),
			drawProcessFlowConnections("rtlb", "critical_highlighted_four_arrow")
		);
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery("#rtlb_created_regular_one > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtlb_created_regular_one > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtlb_created_regular_one .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rtlb_created_regular_two > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtlb_created_regular_two > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtlb_created_regular_two .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rtlb_created_dimmed_two_arrow > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtlb_created_dimmed_two_arrow  > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtlb_created_dimmed_two_arrow  .sapSuiteUiCommonsArrowRight").length === 1,
			"created dimmed connection is rendered");

		assert.ok(jQuery("#rtlb_created_highlighted_three_arrow > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtlb_created_highlighted_three_arrow  > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtlb_created_highlighted_three_arrow  .sapSuiteUiCommonsArrowRight").length === 1,
			"created highlighted connection is rendered");

		assert.ok(jQuery("#rtlb_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtlb_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtlb_planned_dimmed_one_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rtlb_planned_regular_three > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtlb_planned_regular_three > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtlb_planned_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"planned regular connection is rendered");

		assert.ok(jQuery("#rtlb_planned_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtlb_planned_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtlb_planned_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rtlb_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtlb_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtlb_planned_highlighted_four_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned highlighted connection is rendered");

		assert.ok(jQuery("#rtlb_critical_dimmed_one_arrow > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtlb_critical_dimmed_one_arrow > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtlb_critical_dimmed_one_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"critical dimmed connection is rendered");

		assert.ok(jQuery("#rtlb_critical_regular_three > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtlb_critical_regular_three > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtlb_critical_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"critical regular connection is rendered");

		assert.ok(jQuery("#rtlb_critical_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtlb_critical_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtlb_critical_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"critical dimmed connection is rendered");

		assert.ok(jQuery("#rtlb_critical_highlighted_four_arrow > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtlb_critical_highlighted_four_arrow > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtlb_critical_highlighted_four_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"critical highlighted connection is rendered");
	});

	QUnit.test("Connection rtl is rendered", function (assert) {
		this.aPFC.push(
			drawProcessFlowConnections("rtl", "created_regular_one"),
			drawProcessFlowConnections("rtl", "created_regular_two"),
			drawProcessFlowConnections("rtl", "created_dimmed_two_arrow"),
			drawProcessFlowConnections("rtl", "created_highlighted_three_arrow"),
			drawProcessFlowConnections("rtl", "planned_dimmed_one_arrow"),
			drawProcessFlowConnections("rtl", "planned_regular_three"),
			drawProcessFlowConnections("rtl", "planned_dimmed_four"),
			drawProcessFlowConnections("rtl", "planned_highlighted_four_arrow"),
			drawProcessFlowConnections("rtl", "critical_dimmed_one_arrow"),
			drawProcessFlowConnections("rtl", "critical_regular_three"),
			drawProcessFlowConnections("rtl", "critical_dimmed_four"),
			drawProcessFlowConnections("rtl", "critical_highlighted_four_arrow")
		);
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery("#rtl_created_regular_one > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rtl_created_regular_one > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtl_created_regular_one .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rtl_created_regular_two > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rtl_created_regular_two > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtl_created_regular_two .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rtl_created_dimmed_two_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rtl_created_dimmed_two_arrow  > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtl_created_dimmed_two_arrow  .sapSuiteUiCommonsArrowRight").length === 1,
			"created dimmed connection is rendered");

		assert.ok(jQuery("#rtl_created_highlighted_three_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rtl_created_highlighted_three_arrow  > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtl_created_highlighted_three_arrow  .sapSuiteUiCommonsArrowRight").length === 1,
			"created highlighted connection is rendered");

		assert.ok(jQuery("#rtl_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rtl_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtl_planned_dimmed_one_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rtl_planned_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rtl_planned_regular_three > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtl_planned_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"planned regular connection is rendered");

		assert.ok(jQuery("#rtl_planned_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rtl_planned_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtl_planned_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rtl_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rtl_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtl_planned_highlighted_four_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned highlighted connection is rendered");

		assert.ok(jQuery("#rtl_critical_dimmed_one_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rtl_critical_dimmed_one_arrow > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtl_critical_dimmed_one_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"critical dimmed connection is rendered");

		assert.ok(jQuery("#rtl_critical_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rtl_critical_regular_three > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtl_critical_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"critical regular connection is rendered");

		assert.ok(jQuery("#rtl_critical_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rtl_critical_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtl_critical_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"critical dimmed connection is rendered");

		assert.ok(jQuery("#rtl_critical_highlighted_four_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rtl_critical_highlighted_four_arrow > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rtl_critical_highlighted_four_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"critical highlighted connection is rendered");
	});

	QUnit.test("Connection rtb is rendered", function (assert) {
		this.aPFC.push(
			drawProcessFlowConnections("rtb", "created_regular_one"),
			drawProcessFlowConnections("rtb", "created_regular_two"),
			drawProcessFlowConnections("rtb", "created_dimmed_two_arrow"),
			drawProcessFlowConnections("rtb", "created_highlighted_three_arrow"),
			drawProcessFlowConnections("rtb", "planned_dimmed_one_arrow"),
			drawProcessFlowConnections("rtb", "planned_regular_three"),
			drawProcessFlowConnections("rtb", "planned_dimmed_four"),
			drawProcessFlowConnections("rtb", "planned_highlighted_four_arrow"),
			drawProcessFlowConnections("rtb", "critical_dimmed_one_arrow"),
			drawProcessFlowConnections("rtb", "critical_regular_three"),
			drawProcessFlowConnections("rtb", "critical_dimmed_four"),
			drawProcessFlowConnections("rtb", "critical_highlighted_four_arrow")
		);
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery("#rtb_created_regular_one > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtb_created_regular_one > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rtb_created_regular_one .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rtb_created_regular_two > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtb_created_regular_two > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rtb_created_regular_two .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rtb_created_dimmed_two_arrow > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtb_created_dimmed_two_arrow > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rtb_created_dimmed_two_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"created dimmed connection is rendered");

		assert.ok(jQuery("#rtb_created_highlighted_three_arrow > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtb_created_highlighted_three_arrow > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rtb_created_highlighted_three_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"created highlighted connection is rendered");

		assert.ok(jQuery("#rtb_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtb_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rtb_planned_dimmed_one_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rtb_planned_regular_three > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtb_planned_regular_three > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rtb_planned_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"planned regular connection is rendered");

		assert.ok(jQuery("#rtb_planned_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtb_planned_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rtb_planned_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rtb_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtb_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rtb_planned_highlighted_four_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned highlighted connection is rendered");

		assert.ok(jQuery("#rtb_critical_dimmed_one_arrow > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtb_critical_dimmed_one_arrow > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rtb_critical_dimmed_one_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"critical dimmed connection is rendered");

		assert.ok(jQuery("#rtb_critical_regular_three > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtb_critical_regular_three > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rtb_critical_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"critical regular connection is rendered");

		assert.ok(jQuery("#rtb_critical_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtb_critical_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rtb_critical_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"critical dimmed connection is rendered");

		assert.ok(jQuery("#rtb_critical_highlighted_four_arrow > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#rtb_critical_highlighted_four_arrow > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rtb_critical_highlighted_four_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"critical highlighted connection is rendered");
	});

	QUnit.test("Connection rlb is rendered", function (assert) {
		this.aPFC.push(
			drawProcessFlowConnections("rlb", "created_regular_one"),
			drawProcessFlowConnections("rlb", "created_regular_two"),
			drawProcessFlowConnections("rlb", "created_dimmed_two_arrow"),
			drawProcessFlowConnections("rlb", "created_highlighted_three_arrow"),
			drawProcessFlowConnections("rlb", "planned_dimmed_one_arrow"),
			drawProcessFlowConnections("rlb", "planned_regular_three"),
			drawProcessFlowConnections("rlb", "planned_dimmed_four"),
			drawProcessFlowConnections("rlb", "planned_highlighted_four_arrow"),
			drawProcessFlowConnections("rlb", "critical_regular_three")
		);
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery("#rlb_created_regular_one > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rlb_created_regular_one > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rlb_created_regular_one .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rlb_created_regular_two > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rlb_created_regular_two > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rlb_created_regular_two .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rlb_created_dimmed_two_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rlb_created_dimmed_two_arrow  > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rlb_created_dimmed_two_arrow  .sapSuiteUiCommonsArrowRight").length === 1,
			"created dimmed connection is rendered");

		assert.ok(jQuery("#rlb_created_highlighted_three_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rlb_created_highlighted_three_arrow  > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rlb_created_highlighted_three_arrow  .sapSuiteUiCommonsArrowRight").length === 1,
			"created highlighted connection is rendered");

		assert.ok(jQuery("#rlb_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rlb_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rlb_planned_dimmed_one_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rlb_planned_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rlb_planned_regular_three > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rlb_planned_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"planned regular connection is rendered");

		assert.ok(jQuery("#rlb_planned_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rlb_planned_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rlb_planned_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rlb_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rlb_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rlb_planned_highlighted_four_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned highlighted connection is rendered");

		assert.ok(jQuery("#rlb_critical_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rlb_critical_regular_three > .sapSuiteUiCommonsBorderBottom").length === 3 &&
			jQuery("#rlb_critical_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"critical regular connection is rendered");
	});

	QUnit.test("Connection tlb is rendered", function (assert) {
		this.aPFC.push(
			drawProcessFlowConnections("tlb", "created_regular_one"),
			drawProcessFlowConnections("tlb", "created_regular_two"),
			drawProcessFlowConnections("tlb", "created_dimmed_two"),
			drawProcessFlowConnections("tlb", "created_highlighted_three"),
			drawProcessFlowConnections("tlb", "planned_dimmed_one"),
			drawProcessFlowConnections("tlb", "planned_regular_three"),
			drawProcessFlowConnections("tlb", "planned_dimmed_four"),
			drawProcessFlowConnections("tlb", "planned_highlighted_four"),
			drawProcessFlowConnections("tlb", "critical_regular_three")
		);
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery("#tlb_created_regular_one > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#tlb_created_regular_one > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tlb_created_regular_one .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#tlb_created_regular_two > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#tlb_created_regular_two > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tlb_created_regular_two .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#tlb_created_dimmed_two > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#tlb_created_dimmed_two  > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tlb_created_dimmed_two  .sapSuiteUiCommonsArrowRight").length === 0,
			"created dimmed connection is rendered");

		assert.ok(jQuery("#tlb_created_highlighted_three > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#tlb_created_highlighted_three  > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tlb_created_highlighted_three  .sapSuiteUiCommonsArrowRight").length === 0,
			"created highlighted connection is rendered");

		assert.ok(jQuery("#tlb_planned_dimmed_one > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#tlb_planned_dimmed_one > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tlb_planned_dimmed_one .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#tlb_planned_regular_three > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#tlb_planned_regular_three > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tlb_planned_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"planned regular connection is rendered");

		assert.ok(jQuery("#tlb_planned_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#tlb_planned_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tlb_planned_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#tlb_planned_highlighted_four > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#tlb_planned_highlighted_four > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tlb_planned_highlighted_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned highlighted connection is rendered");

		assert.ok(jQuery("#tlb_critical_regular_three > .sapSuiteUiCommonsBorderLeft").length === 2 &&
			jQuery("#tlb_critical_regular_three > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tlb_critical_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"critical regular connection is rendered");
	});

	QUnit.test("Connection rt is rendered", function (assert) {
		this.aPFC.push(
			drawProcessFlowConnections("rt", "created_regular_one"),
			drawProcessFlowConnections("rt", "created_regular_two"),
			drawProcessFlowConnections("rt", "created_dimmed_two_arrow"),
			drawProcessFlowConnections("rt", "created_highlighted_three_arrow"),
			drawProcessFlowConnections("rt", "planned_dimmed_one_arrow"),
			drawProcessFlowConnections("rt", "planned_regular_three"),
			drawProcessFlowConnections("rt", "planned_dimmed_four"),
			drawProcessFlowConnections("rt", "planned_highlighted_four_arrow"),
			drawProcessFlowConnections("rt", "critical_regular_three")
		);
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery("#rt_created_regular_one > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rt_created_regular_one > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rt_created_regular_one .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rt_created_regular_two > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rt_created_regular_two > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rt_created_regular_two .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rt_created_dimmed_two_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rt_created_dimmed_two_arrow  > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rt_created_dimmed_two_arrow  .sapSuiteUiCommonsArrowRight").length === 1,
			"created dimmed connection is rendered");

		assert.ok(jQuery("#rt_created_highlighted_three_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rt_created_highlighted_three_arrow  > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rt_created_highlighted_three_arrow  .sapSuiteUiCommonsArrowRight").length === 1,
			"created highlighted connection is rendered");

		assert.ok(jQuery("#rt_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rt_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rt_planned_dimmed_one_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rt_planned_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rt_planned_regular_three > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rt_planned_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"planned regular connection is rendered");

		assert.ok(jQuery("#rt_planned_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rt_planned_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rt_planned_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rt_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rt_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rt_planned_highlighted_four_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned highlighted connection is rendered");

		assert.ok(jQuery("#rt_critical_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rt_critical_regular_three > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rt_critical_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"critical regular connection is rendered");
	});

	QUnit.test("Connection rl is rendered", function (assert) {
		this.aPFC.push(
			drawProcessFlowConnections("rl", "created_regular_one"),
			drawProcessFlowConnections("rl", "created_regular_two"),
			drawProcessFlowConnections("rl", "created_dimmed_two_arrow"),
			drawProcessFlowConnections("rl", "created_highlighted_three_arrow"),
			drawProcessFlowConnections("rl", "planned_dimmed_one_arrow"),
			drawProcessFlowConnections("rl", "planned_regular_three"),
			drawProcessFlowConnections("rl", "planned_dimmed_four"),
			drawProcessFlowConnections("rl", "planned_highlighted_four_arrow"),
			drawProcessFlowConnections("rl", "critical_regular_three")
		);
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery("#rl_created_regular_one > .sapSuiteUiCommonsBorderLeft").length === 0 &&
			jQuery("#rl_created_regular_one > .sapSuiteUiCommonsBorderBottom").length === 1 &&
			jQuery("#rl_created_regular_one .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rl_created_regular_two > .sapSuiteUiCommonsBorderLeft").length === 0 &&
			jQuery("#rl_created_regular_two > .sapSuiteUiCommonsBorderBottom").length === 1 &&
			jQuery("#rl_created_regular_two .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rl_created_dimmed_two_arrow > .sapSuiteUiCommonsBorderLeft").length === 0 &&
			jQuery("#rl_created_dimmed_two_arrow  > .sapSuiteUiCommonsBorderBottom").length === 1 &&
			jQuery("#rl_created_dimmed_two_arrow  .sapSuiteUiCommonsArrowRight").length === 1,
			"created dimmed connection is rendered");

		assert.ok(jQuery("#rl_created_highlighted_three_arrow > .sapSuiteUiCommonsBorderLeft").length === 0 &&
			jQuery("#rl_created_highlighted_three_arrow  > .sapSuiteUiCommonsBorderBottom").length === 1 &&
			jQuery("#rl_created_highlighted_three_arrow  .sapSuiteUiCommonsArrowRight").length === 1,
			"created highlighted connection is rendered");

		assert.ok(jQuery("#rl_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderLeft").length === 0 &&
			jQuery("#rl_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderBottom").length === 1 &&
			jQuery("#rl_planned_dimmed_one_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rl_planned_regular_three > .sapSuiteUiCommonsBorderLeft").length === 0 &&
			jQuery("#rl_planned_regular_three > .sapSuiteUiCommonsBorderBottom").length === 1 &&
			jQuery("#rl_planned_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"planned regular connection is rendered");

		assert.ok(jQuery("#rl_planned_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 0 &&
			jQuery("#rl_planned_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 1 &&
			jQuery("#rl_planned_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rl_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderLeft").length === 0 &&
			jQuery("#rl_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderBottom").length === 1 &&
			jQuery("#rl_planned_highlighted_four_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned highlighted connection is rendered");

		assert.ok(jQuery("#rl_critical_regular_three > .sapSuiteUiCommonsBorderLeft").length === 0 &&
			jQuery("#rl_critical_regular_three > .sapSuiteUiCommonsBorderBottom").length === 1 &&
			jQuery("#rl_critical_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"critical regular connection is rendered");
	});

	QUnit.test("Connection rb is rendered", function (assert) {
		this.aPFC.push(
			drawProcessFlowConnections("rb", "created_regular_one"),
			drawProcessFlowConnections("rb", "created_regular_two"),
			drawProcessFlowConnections("rb", "created_dimmed_two_arrow"),
			drawProcessFlowConnections("rb", "created_highlighted_three_arrow"),
			drawProcessFlowConnections("rb", "planned_dimmed_one_arrow"),
			drawProcessFlowConnections("rb", "planned_regular_three"),
			drawProcessFlowConnections("rb", "planned_dimmed_four"),
			drawProcessFlowConnections("rb", "planned_highlighted_four_arrow"),
			drawProcessFlowConnections("rb", "critical_regular_three")
		);
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery("#rb_created_regular_one > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rb_created_regular_one > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rb_created_regular_one .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rb_created_regular_two > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rb_created_regular_two > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rb_created_regular_two .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#rb_created_dimmed_two_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rb_created_dimmed_two_arrow  > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rb_created_dimmed_two_arrow  .sapSuiteUiCommonsArrowRight").length === 1,
			"created dimmed connection is rendered");

		assert.ok(jQuery("#rb_created_highlighted_three_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rb_created_highlighted_three_arrow  > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rb_created_highlighted_three_arrow  .sapSuiteUiCommonsArrowRight").length === 1,
			"created highlighted connection is rendered");

		assert.ok(jQuery("#rb_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rb_planned_dimmed_one_arrow > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rb_planned_dimmed_one_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rb_planned_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rb_planned_regular_three > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rb_planned_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"planned regular connection is rendered");

		assert.ok(jQuery("#rb_planned_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rb_planned_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rb_planned_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#rb_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rb_planned_highlighted_four_arrow > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rb_planned_highlighted_four_arrow .sapSuiteUiCommonsArrowRight").length === 1,
			"planned highlighted connection is rendered");

		assert.ok(jQuery("#rb_critical_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#rb_critical_regular_three > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#rb_critical_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"critical regular connection is rendered");
	});

	QUnit.test("Connection tl is rendered", function (assert) {
		this.aPFC.push(
			drawProcessFlowConnections("tl", "created_regular_one"),
			drawProcessFlowConnections("tl", "created_regular_two"),
			drawProcessFlowConnections("tl", "created_dimmed_two"),
			drawProcessFlowConnections("tl", "created_highlighted_three"),
			drawProcessFlowConnections("tl", "planned_dimmed_one"),
			drawProcessFlowConnections("tl", "planned_regular_three"),
			drawProcessFlowConnections("tl", "planned_dimmed_four"),
			drawProcessFlowConnections("tl", "planned_highlighted_four"),
			drawProcessFlowConnections("tl", "critical_regular_three")
		);
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery("#tl_created_regular_one > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tl_created_regular_one > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tl_created_regular_one .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#tl_created_regular_two > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tl_created_regular_two > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tl_created_regular_two .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#tl_created_dimmed_two > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tl_created_dimmed_two  > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tl_created_dimmed_two  .sapSuiteUiCommonsArrowRight").length === 0,
			"created dimmed connection is rendered");

		assert.ok(jQuery("#tl_created_highlighted_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tl_created_highlighted_three  > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tl_created_highlighted_three  .sapSuiteUiCommonsArrowRight").length === 0,
			"created highlighted connection is rendered");

		assert.ok(jQuery("#tl_planned_dimmed_one > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tl_planned_dimmed_one > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tl_planned_dimmed_one .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#tl_planned_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tl_planned_regular_three > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tl_planned_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"planned regular connection is rendered");

		assert.ok(jQuery("#tl_planned_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tl_planned_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tl_planned_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#tl_planned_highlighted_four > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tl_planned_highlighted_four > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tl_planned_highlighted_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned highlighted connection is rendered");

		assert.ok(jQuery("#tl_critical_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tl_critical_regular_three > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#tl_critical_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"critical regular connection is rendered");
	});

	QUnit.test("Connection tb is rendered", function (assert) {
		this.aPFC.push(
			drawProcessFlowConnections("tb", "created_regular_one"),
			drawProcessFlowConnections("tb", "created_regular_two"),
			drawProcessFlowConnections("tb", "created_dimmed_two"),
			drawProcessFlowConnections("tb", "created_highlighted_three"),
			drawProcessFlowConnections("tb", "planned_dimmed_one"),
			drawProcessFlowConnections("tb", "planned_regular_three"),
			drawProcessFlowConnections("tb", "planned_dimmed_four"),
			drawProcessFlowConnections("tb", "planned_highlighted_four"),
			drawProcessFlowConnections("tb", "critical_regular_three")
		);
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery("#tb_created_regular_one > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tb_created_regular_one > .sapSuiteUiCommonsBorderBottom").length === 0 &&
			jQuery("#tb_created_regular_one .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#tb_created_regular_two > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tb_created_regular_two > .sapSuiteUiCommonsBorderBottom").length === 0 &&
			jQuery("#tb_created_regular_two .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#tb_created_dimmed_two > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tb_created_dimmed_two  > .sapSuiteUiCommonsBorderBottom").length === 0 &&
			jQuery("#tb_created_dimmed_two  .sapSuiteUiCommonsArrowRight").length === 0,
			"created dimmed connection is rendered");

		assert.ok(jQuery("#tb_created_highlighted_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tb_created_highlighted_three  > .sapSuiteUiCommonsBorderBottom").length === 0 &&
			jQuery("#tb_created_highlighted_three  .sapSuiteUiCommonsArrowRight").length === 0,
			"created highlighted connection is rendered");

		assert.ok(jQuery("#tb_planned_dimmed_one > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tb_planned_dimmed_one > .sapSuiteUiCommonsBorderBottom").length === 0 &&
			jQuery("#tb_planned_dimmed_one .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#tb_planned_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tb_planned_regular_three > .sapSuiteUiCommonsBorderBottom").length === 0 &&
			jQuery("#tb_planned_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"planned regular connection is rendered");

		assert.ok(jQuery("#tb_planned_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tb_planned_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 0 &&
			jQuery("#tb_planned_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#tb_planned_highlighted_four > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tb_planned_highlighted_four > .sapSuiteUiCommonsBorderBottom").length === 0 &&
			jQuery("#tb_planned_highlighted_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned highlighted connection is rendered");

		assert.ok(jQuery("#tb_critical_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#tb_critical_regular_three > .sapSuiteUiCommonsBorderBottom").length === 0 &&
			jQuery("#tb_critical_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"critical regular connection is rendered");
	});

	QUnit.test("Connection lb is rendered", function (assert) {
		this.aPFC.push(
			drawProcessFlowConnections("lb", "created_regular_one"),
			drawProcessFlowConnections("lb", "created_regular_two"),
			drawProcessFlowConnections("lb", "created_dimmed_two"),
			drawProcessFlowConnections("lb", "created_highlighted_three"),
			drawProcessFlowConnections("lb", "planned_dimmed_one"),
			drawProcessFlowConnections("lb", "planned_regular_three"),
			drawProcessFlowConnections("lb", "planned_dimmed_four"),
			drawProcessFlowConnections("lb", "planned_highlighted_four"),
			drawProcessFlowConnections("lb", "critical_regular_three")
		);
		sap.ui.getCore().applyChanges();

		assert.ok(jQuery("#lb_created_regular_one > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#lb_created_regular_one > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#lb_created_regular_one .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#lb_created_regular_two > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#lb_created_regular_two > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#lb_created_regular_two .sapSuiteUiCommonsArrowRight").length === 0,
			"created regular connection is rendered");

		assert.ok(jQuery("#lb_created_dimmed_two > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#lb_created_dimmed_two  > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#lb_created_dimmed_two  .sapSuiteUiCommonsArrowRight").length === 0,
			"created dimmed connection is rendered");

		assert.ok(jQuery("#lb_created_highlighted_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#lb_created_highlighted_three  > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#lb_created_highlighted_three  .sapSuiteUiCommonsArrowRight").length === 0,
			"created highlighted connection is rendered");

		assert.ok(jQuery("#lb_planned_dimmed_one > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#lb_planned_dimmed_one > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#lb_planned_dimmed_one .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#lb_planned_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#lb_planned_regular_three > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#lb_planned_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"planned regular connection is rendered");

		assert.ok(jQuery("#lb_planned_dimmed_four > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#lb_planned_dimmed_four > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#lb_planned_dimmed_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned dimmed connection is rendered");

		assert.ok(jQuery("#lb_planned_highlighted_four > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#lb_planned_highlighted_four > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#lb_planned_highlighted_four .sapSuiteUiCommonsArrowRight").length === 0,
			"planned highlighted connection is rendered");

		assert.ok(jQuery("#lb_critical_regular_three > .sapSuiteUiCommonsBorderLeft").length === 1 &&
			jQuery("#lb_critical_regular_three > .sapSuiteUiCommonsBorderBottom").length === 2 &&
			jQuery("#lb_critical_regular_three .sapSuiteUiCommonsArrowRight").length === 0,
			"critical regular connection is rendered");
	});

	QUnit.module("ARIA", {
		beforeEach: function () {
			this.aPFC = [];
		},
		afterEach: function () {
			for (var i = 0; i < this.aPFC.length; i++) {
				this.aPFC[i].destroy();
				this.aPFC[i] = null;
			}
		}
	});

	QUnit.test("Get ARIA details of branch connection", function (assert) {
		/* Arrange */
		this.aPFC.push(
			drawProcessFlowConnections("rtl", "created_righttopleft_one")
		);
		sap.ui.getCore().applyChanges();

		/* Act */
		var connection = this.aPFC[0]._traverseConnectionData();
		var resultText = this.aPFC[0]._getAriaText(connection);

		/* Assert */
		assert.equal(resultText, this.aPFC[0]._oResBundle.getText('PF_CONNECTION_BRANCH'), "branch; equal succeeds");
	});

	QUnit.test("Get ARIA details of horizontal connection", function (assert) {
		/* Arrange */
		this.aPFC.push(
			drawProcessFlowConnections("rl", "created_rightleft_one")
		);
		sap.ui.getCore().applyChanges();

		/* Act */
		var connection = this.aPFC[0]._traverseConnectionData();
		var resultText = this.aPFC[0]._getAriaText(connection);

		/* Assert */
		assert.equal(resultText, this.aPFC[0]._oResBundle.getText('PF_CONNECTION_HORIZONTAL_LINE'), "horizontal line; equal succeeds");
	});

	QUnit.test("Get ARIA details of vertical connection", function (assert) {
		/* Arrange */
		this.aPFC.push(
			drawProcessFlowConnections("tb", "created_topbottom_one")
		);
		sap.ui.getCore().applyChanges();

		/* Act */
		var connection = this.aPFC[0]._traverseConnectionData();
		var resultText = this.aPFC[0]._getAriaText(connection);

		/* Assert */
		assert.equal(resultText, this.aPFC[0]._oResBundle.getText('PF_CONNECTION_VERTICAL_LINE'), "vertical line; equal succeeds");
	});

	QUnit.test("Get ARIA details of an ending horizontal connection", function (assert) {
		/* Arrange */

		this.aPFC.push(
			drawProcessFlowConnections("rl", "created_topbottom_one_arrow")
		);
		sap.ui.getCore().applyChanges();

		/* Act */
		var connection = this.aPFC[0]._traverseConnectionData();
		var resultText = this.aPFC[0]._getAriaText(connection);

		/* Assert */
		assert.equal(resultText, this.aPFC[0]._oResBundle.getText('PF_CONNECTION_HORIZONTAL_LINE') + " " + this.aPFC[0]._oResBundle.getText('PF_CONNECTION_ENDS'), "horizontal line ends; equal succeeds");
	});

	QUnit.module("Display-State Hierarchy", {
		beforeEach: function () {
			this.oProcessFlow = new ProcessFlow();
			this.oProcessFlowMatrixCalculator = new ProcessFlow.InternalMatrixCalculation(this.oProcessFlow);
			this.oSourceNode = null;
			this.oTargetNode = null;
		},
		afterEach: function () {
			this.oProcessFlow.destroy();
			this.oSourceNode.destroy();
			this.oTargetNode.destroy();
			this.oProcessFlowMatrixCalculator = null;
			this.oProcessFlow = null;
			this.oSourceNode = null;
			this.oTargetNode = null;
		}
	});

	QUnit.test("Test 'Regular' - 'Regular' state", function (assert) {
		/* Arrange */
		this.oSourceNode = new ProcessFlowNode({
			id: "sourceId",
			title: "Invoice 1",
			state: ProcessFlowNodeState.Neutral,
			focused: false
		});
		this.oTargetNode = new ProcessFlowNode({
			id: "targetId",
			title: "Invoice 2",
			state: ProcessFlowNodeState.Neutral,
			focused: false
		});

		/* Act */
		var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

		/* Assert */
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Regular, "Regular - Regular results in Regular");
	});

	QUnit.test("Test 'Regular' - 'Regular+Focused' state", function (assert) {
		/* Arrange */
		this.oSourceNode = new ProcessFlowNode({
			id: "sourceId",
			title: "Invoice 1",
			state: ProcessFlowNodeState.Neutral,
			focused: false
		});
		this.oTargetNode = new ProcessFlowNode({
			id: "targetId",
			title: "Invoice 2",
			state: ProcessFlowNodeState.Neutral,
			focused: true
		});

		/* Act */
		var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

		/* Assert */
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Regular, "Regular - Regular+Focused results in Regular (Focused is not relevant)");
	});

	QUnit.test("Test 'Selected' - 'Selected' state", function (assert) {
		/* Arrange */
		this.oSourceNode = new ProcessFlowNode({
			id: "sourceId",
			title: "Invoice 1",
			state: ProcessFlowNodeState.Neutral,
			selected: true
		});
		this.oTargetNode = new ProcessFlowNode({
			id: "targetId",
			title: "Invoice 2",
			state: ProcessFlowNodeState.Neutral,
			selected: true
		});

		/* Act */
		var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

		/* Assert */
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Selected, "Selected - Selected results in Selected");
	});

	QUnit.test("Test 'Highlighted' - 'Highlighted' state", function (assert) {
		/* Arrange */
		this.oSourceNode = new ProcessFlowNode({
			id: "sourceId",
			title: "Invoice 1",
			state: ProcessFlowNodeState.Neutral,
			highlighted: true
		});
		this.oTargetNode = new ProcessFlowNode({
			id: "targetId",
			title: "Invoice 2",
			state: ProcessFlowNodeState.Neutral,
			highlighted: true
		});

		/* Act */
		var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

		/* Assert */
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Highlighted, "Highlighted - Highlighted results in Highlighted");
	});

	QUnit.test("Test 'Dimmed' - 'Dimmed' state", function (assert) {
		/* Arrange */
		this.oSourceNode = new ProcessFlowNode({
			id: "sourceId",
			title: "Invoice 1",
			state: ProcessFlowNodeState.Neutral
		});
		this.oSourceNode._setDimmedState(true);
		this.oTargetNode = new ProcessFlowNode({
			id: "targetId",
			title: "Invoice 2",
			state: ProcessFlowNodeState.Neutral
		});
		this.oTargetNode._setDimmedState(true);

		/* Act */
		var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

		/* Assert */
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Dimmed, "Dimmed - Dimmed results in Dimmed");
	});

	QUnit.test("Test 'Regular' - 'Dimmed' state", function (assert) {
		/* Arrange */
		this.oSourceNode = new ProcessFlowNode({
			id: "sourceId",
			title: "Invoice 1",
			state: ProcessFlowNodeState.Neutral
		});
		this.oTargetNode = new ProcessFlowNode({
			id: "targetId",
			title: "Invoice 2",
			state: ProcessFlowNodeState.Neutral
		});
		this.oTargetNode._setDimmedState(true);

		/* Act */
		var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

		/* Assert */
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Dimmed, "Regular - Dimmed results in Dimmed");
		this.oSourceNode._setDimmedState(true);
		this.oTargetNode._setDimmedState(false);
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Dimmed, "Dimmed - Regular results in Dimmed");
	});

	QUnit.test("Test 'Selected' - 'Dimmed' state", function (assert) {
		/* Arrange */
		this.oSourceNode = new ProcessFlowNode({
			id: "sourceId",
			title: "Invoice 1",
			state: ProcessFlowNodeState.Neutral,
			selected: true
		});
		this.oTargetNode = new ProcessFlowNode({
			id: "targetId",
			title: "Invoice 2",
			state: ProcessFlowNodeState.Neutral
		});
		this.oTargetNode._setDimmedState(true);

		/* Act */
		var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

		/* Assert */
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Dimmed, "Selected - Dimmed results in Dimmed");
		this.oSourceNode.setSelected(false);
		this.oSourceNode._setDimmedState(true);
		this.oTargetNode._setDimmedState(false);
		this.oTargetNode.setSelected(true);
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Dimmed, "Dimmed - Selected results in Dimmed");
	});

	QUnit.test("Test 'Highlighted' - 'Dimmed' state", function (assert) {
		/* Arrange */
		this.oSourceNode = new ProcessFlowNode({
			id: "sourceId",
			title: "Invoice 1",
			state: ProcessFlowNodeState.Neutral,
			highlighted: true
		});
		this.oTargetNode = new ProcessFlowNode({
			id: "targetId",
			title: "Invoice 2",
			state: ProcessFlowNodeState.Neutral
		});
		this.oTargetNode._setDimmedState(true);

		/* Act */
		var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

		/* Assert */
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Dimmed, "Highlighted - Dimmed results in Dimmed");
		this.oSourceNode.setHighlighted(false);
		this.oSourceNode._setDimmedState(true);
		this.oTargetNode._setDimmedState(false);
		this.oTargetNode.setHighlighted(true);
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Dimmed, "Dimmed - Highlighted results in Dimmed");
	});

	QUnit.test("Test 'Regular' - 'Highlighted' state", function (assert) {
		/* Arrange */
		this.oSourceNode = new ProcessFlowNode({
			id: "sourceId",
			title: "Invoice 1",
			state: ProcessFlowNodeState.Neutral
		});
		this.oTargetNode = new ProcessFlowNode({
			id: "targetId",
			title: "Invoice 2",
			state: ProcessFlowNodeState.Neutral,
			highlighted: true
		});

		/* Act */
		var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

		/* Assert */
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Regular, "Regular - Highlighted results in Regular");
		this.oSourceNode.setHighlighted(true);
		this.oTargetNode.setHighlighted(false);
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Regular, "Highlighted - Regular results in Regular");
	});

	QUnit.test("Test 'Regular' - 'Selected' state", function (assert) {
		/* Arrange */
		this.oSourceNode = new ProcessFlowNode({
			id: "sourceId",
			title: "Invoice 1",
			state: ProcessFlowNodeState.Neutral
		});
		this.oTargetNode = new ProcessFlowNode({
			id: "targetId",
			title: "Invoice 2",
			state: ProcessFlowNodeState.Neutral,
			selected: true
		});

		/* Act */
		var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

		/* Assert */
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Regular, "Regular - Selected results in Regular");
		this.oSourceNode.setSelected(true);
		this.oTargetNode.setSelected(false);
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Regular, "Selected - Regular results in Regular");
	});

	QUnit.test("Test 'Highlighted' - 'Selected' state", function (assert) {

		/* Arrange */
		this.oSourceNode = new ProcessFlowNode({
			id: "sourceId",
			title: "Invoice 1",
			state: ProcessFlowNodeState.Neutral,
			highlighted: true
		});
		this.oTargetNode = new ProcessFlowNode({
			id: "targetId",
			title: "Invoice 2",
			state: ProcessFlowNodeState.Neutral,
			selected: true
		});

		/* Act */
		var sCalculatedDisplayState = this.oProcessFlowMatrixCalculator._calculateConnectionDisplayStateBySourceAndTargetNode(this.oSourceNode, this.oTargetNode);

		/* Assert */
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Dimmed, "Highlighted - Selected results in Dimmed");
		this.oSourceNode.setHighlighted(false);
		this.oSourceNode.setSelected(true);
		this.oTargetNode.setSelected(false);
		this.oTargetNode.setHighlighted(true);
		assert.equal(sCalculatedDisplayState, ProcessFlowDisplayState.Dimmed, "Selected - Highlighted results in Dimmed");
	});
});
