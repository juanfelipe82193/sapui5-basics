sap.ui.define([
	"sap/suite/ui/commons/ProcessFlowConnection",
	"sap/suite/ui/commons/ProcessFlowNodeState",
	"sap/suite/ui/commons/ProcessFlowDisplayState",
	"sap/suite/ui/commons/ProcessFlowZoomLevel",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function(ProcessFlowConnection, ProcessFlowNodeState, ProcessFlowDisplayState, ProcessFlowZoomLevel, createAndAppendDiv) {
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

	QUnit.module("ProcessFlowConnectionTypes - Basic Tests", {
		beforeEach: function () {
			this.aPFC = [];
		},
		afterEach: function () {
			for (var i = 0; i < this.aPFC.length; i++) {
				this.aPFC[i].destroy();
			}
		}
	});

	QUnit.test("Connection is horizontal line", function (assert) {
		/* Arrange */
		this.aPFC.push(
			drawProcessFlowConnections("rl", "created_rightleft_one")
		);
		sap.ui.getCore().applyChanges();

		/* Act */
		var connection = this.aPFC[0]._traverseConnectionData();
		var result = this.aPFC[0]._isHorizontalLine(connection);

		/* Assert */
		assert.ok(result, "Connection is horizontal line.");
	});

	QUnit.test("Connection is vertical line", function (assert) {
		/* Arrange */
		this.aPFC.push(
			drawProcessFlowConnections("tb", "created_topbottom_one")
		);
		sap.ui.getCore().applyChanges();

		/* Act */
		var connection = this.aPFC[0]._traverseConnectionData();
		var result = this.aPFC[0]._isVerticalLine(connection);

		/* Assert */
		assert.ok(result, "Connection is vertical line.");
	});

	QUnit.test("Connection is special line", function (assert) {
		/* Arrange */
		this.aPFC.push(
			drawProcessFlowConnections("rtl", "created_righttopleft_one")
		);
		sap.ui.getCore().applyChanges();

		/* Act */
		var connection = this.aPFC[0]._traverseConnectionData();
		var resultVertical = this.aPFC[0]._isVerticalLine(connection);
		var resultHorizontal = this.aPFC[0]._isHorizontalLine(connection);

		/* Assert */
		assert.ok(!resultVertical, "Connection is not a vertical line.");
		assert.ok(!resultHorizontal, "Connection is not a horizontal line.");
	});

}, /* bExport= */ true);
