sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/ProcessFlowLaneHeader",
	"sap/suite/ui/commons/ProcessFlowNodeState",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/ProcessFlow",
	"sap/suite/ui/commons/ProcessFlowNode"
], function(jQuery, ProcessFlowLaneHeader, ProcessFlowNodeState, JSONModel, ProcessFlow, ProcessFlowNode) {
	"use strict";

	QUnit.module("With the standard header type", {
		beforeEach: function () {
			this.processFlowLaneHeader = new ProcessFlowLaneHeader({
				id: "processFlowLaneHeader",
				iconSrc: "sap-icon://order-status",
				state: [{ state: ProcessFlowNodeState.Positive, value: 25 },
					{ state: ProcessFlowNodeState.Negative, value: 75 }],
				position: 0
			});
			this.processFlowLaneHeader.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.processFlowLaneHeader) {
				this.processFlowLaneHeader.destroy();
			}
		}
	});

	QUnit.test("Check for the header container presence", function (assert) {
		var nodeId = this.processFlowLaneHeader.getId();
		var $node = jQuery.sap.byId(nodeId);

		assert.ok($node.is("div"), "It is a div.");
		assert.ok($node.hasClass("suiteUiProcessFlowLaneHeaderContainer"), "Style class applied.");
	});

	QUnit.test("Check for lane header above type div rendering.", function (assert) {
		var nodeId = this.processFlowLaneHeader.getId() + "-standard";
		var $node = jQuery.sap.byId(nodeId);

		assert.ok($node.is("div"), "It is a div.");
		assert.ok($node.hasClass("suiteUiProcessFlowLaneHeaderBodyContainer"), "Style class applied.");
	});

	QUnit.test("Check for donut chart svg rendering.", function (assert) {
		var nodeId = this.processFlowLaneHeader.getId() + "-donut-chart";
		var $node = jQuery.sap.byId(nodeId);

		assert.ok($node.is("svg"), "It is a svg.");
	});

	QUnit.test("Check donut chart segment rendering.", function (assert) {
		var nodeId0 = this.processFlowLaneHeader.getId() + "-donut-segment-0";
		var $node0 = jQuery.sap.byId(nodeId0);

		assert.ok($node0.is("path"), "Exists path 0.");

		var nodeId1 = this.processFlowLaneHeader.getId() + "-donut-segment-1";
		var $node1 = jQuery.sap.byId(nodeId1);
		assert.ok($node1.is("path"), "Exists path 1.");

		var nodeId2 = this.processFlowLaneHeader.getId() + "-donut-segment-2";
		var $node2 = jQuery.sap.byId(nodeId2);
		assert.ok(!$node2.is("path"), "Not existing path 2.");

		var nodeId3 = this.processFlowLaneHeader.getId() + "-donut-segment-3";
		var $node3 = jQuery.sap.byId(nodeId3);
		assert.ok(!$node3.is("path"), "Not existing path 3.");
	});

	QUnit.test("_mergeLaneIdNodeStates: Merging node state values for several nodes", function (assert) {
		var oProcessFlow = new ProcessFlow();

		// Arrange
		var aLaneIdNodeStates = [];
		var aNode1 = [{ state: ProcessFlowNodeState.Positive, value: 5 },
			{ state: ProcessFlowNodeState.Negative, value: 6 },
			{ state: ProcessFlowNodeState.Neutral, value: 2 },
			{ state: ProcessFlowNodeState.Planned, value: 4 },
			{ state: ProcessFlowNodeState.Critical, value: 1 }];

		var aNode2 = [{ state: ProcessFlowNodeState.Positive, value: 1 },
			{ state: ProcessFlowNodeState.Negative, value: 0 },
			{ state: ProcessFlowNodeState.Neutral, value: 3 },
			{ state: ProcessFlowNodeState.Planned, value: 8 },
			{ state: ProcessFlowNodeState.Critical, value: 2 }];

		var aNode3 = [{ state: ProcessFlowNodeState.Positive, value: 2 },
			{ state: ProcessFlowNodeState.Negative, value: 2 },
			{ state: ProcessFlowNodeState.Neutral, value: 0 },
			{ state: ProcessFlowNodeState.Planned, value: 2 },
			{ state: ProcessFlowNodeState.Critical, value: 3 }];

		var aNode4 = [{ state: ProcessFlowNodeState.Positive, value: 1 },
			{ state: ProcessFlowNodeState.Negative, value: 0 },
			{ state: ProcessFlowNodeState.Neutral, value: 0 },
			{ state: ProcessFlowNodeState.Planned, value: 2 },
			{ state: ProcessFlowNodeState.Critical, value: 4 }];

		aLaneIdNodeStates.push(aNode1);
		aLaneIdNodeStates.push(aNode2);
		aLaneIdNodeStates.push(aNode3);
		aLaneIdNodeStates.push(aNode4);

		var aResult = oProcessFlow._mergeLaneIdNodeStates(aLaneIdNodeStates);

		var aExpected = [{ state: ProcessFlowNodeState.Positive, value: 9 },
			{ state: ProcessFlowNodeState.Negative, value: 8 },
			{ state: ProcessFlowNodeState.Neutral, value: 5 },
			{ state: ProcessFlowNodeState.Planned, value: 16 },
			{ state: ProcessFlowNodeState.Critical, value: 10 }];
		// Assert
		assert.deepEqual(aExpected, aResult, "Should be merged correctly");

		// Cleanup
		oProcessFlow.destroy();
	});

	QUnit.module("ARIA", {
		beforeEach: function () {
			this.processFlowLaneHeader1 = new ProcessFlowLaneHeader({
				id: "processFlowLaneHeader1"
				, iconSrc: "sap-icon://order-status"
				, state: [{ state: ProcessFlowNodeState.Positive, value: 25 }
					, { state: ProcessFlowNodeState.Negative, value: 75 }]
				, position: 0
			});
			this.processFlowLaneHeader2 = new ProcessFlowLaneHeader({
				id: "processFlowLaneHeader2"
				, iconSrc: "sap-icon://order-status"
				, state: [{ state: ProcessFlowNodeState.Positive, value: 25 }
					, { state: ProcessFlowNodeState.Negative, value: 60 }
					, { state: ProcessFlowNodeState.Critical, value: 15 }]
				, position: 0
			});
			this.processFlowLaneHeader3 = new ProcessFlowLaneHeader({
				id: "processFlowLaneHeader3"
				, iconSrc: "sap-icon://order-status"
				, state: [{ state: ProcessFlowNodeState.Positive, value: 5 }
					, { state: ProcessFlowNodeState.Negative, value: 50 }
					, { state: ProcessFlowNodeState.Neutral, value: 20 }
					, { state: ProcessFlowNodeState.Critical, value: 25 }]
				, position: 0
			});
			this.processFlowLaneHeader4 = new ProcessFlowLaneHeader({
				id: "processFlowLaneHeader4"
				, iconSrc: "sap-icon://order-status"
				, state: [{ state: ProcessFlowNodeState.Positive, value: 2.5 }
					, { state: ProcessFlowNodeState.Positive, value: 2.5 }
					, { state: ProcessFlowNodeState.Negative, value: 70 }
					, { state: ProcessFlowNodeState.Planned, value: 20 }
					, { state: ProcessFlowNodeState.Critical, value: 5 }]
				, position: 0
			});
			this.processFlowLaneHeader5 = new ProcessFlowLaneHeader({
				id: "processFlowLaneHeader5"
				, iconSrc: "sap-icon://order-status"
				, position: 0
			});
			this.processFlowLaneHeader1.placeAt("qunit-fixture");
			this.processFlowLaneHeader2.placeAt("qunit-fixture");
			this.processFlowLaneHeader3.placeAt("qunit-fixture");
			this.processFlowLaneHeader4.placeAt("qunit-fixture");
			this.processFlowLaneHeader5.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		}
		, afterEach: function () {
			if (this.processFlowLaneHeader1) {
				this.processFlowLaneHeader1.destroy();
			}
			if (this.processFlowLaneHeader2) {
				this.processFlowLaneHeader2.destroy();
			}
			if (this.processFlowLaneHeader3) {
				this.processFlowLaneHeader3.destroy();
			}
			if (this.processFlowLaneHeader4) {
				this.processFlowLaneHeader4.destroy();
			}
			if (this.processFlowLaneHeader5) {
				this.processFlowLaneHeader5.destroy();
			}
		}
	});

	QUnit.test("Get status text for screen reader support", function (assert) {
		//Assertion for test 2 values case.
		var testText = this.processFlowLaneHeader1._getAriaText();
		assert.deepEqual(testText,
			this.processFlowLaneHeader1._oResBundle.getText('PF_ARIA_STATUS') +
			" 25% " + this.processFlowLaneHeader1._oResBundle.getText('PF_ARIA_STATUS_POSITIVE') +
			", 75% " + this.processFlowLaneHeader1._oResBundle.getText('PF_ARIA_STATUS_NEGATIVE'),
			"Text was generated correctly with 2 status values");

		//Assertion for test 3 values case.
		testText = this.processFlowLaneHeader2._getAriaText();
		assert.deepEqual(testText,
			this.processFlowLaneHeader2._oResBundle.getText('PF_ARIA_STATUS') +
			" 25% " + this.processFlowLaneHeader2._oResBundle.getText('PF_ARIA_STATUS_POSITIVE') +
			", 60% " + this.processFlowLaneHeader2._oResBundle.getText('PF_ARIA_STATUS_NEGATIVE') +
			", 15% " + this.processFlowLaneHeader2._oResBundle.getText('PF_ARIA_STATUS_CRITICAL'),
			"Text was generated correctly with 2 status values");

		//Assertion for test 4 values case.
		testText = this.processFlowLaneHeader3._getAriaText();
		assert.deepEqual(testText,
			this.processFlowLaneHeader3._oResBundle.getText('PF_ARIA_STATUS') +
			" 5% " + this.processFlowLaneHeader3._oResBundle.getText('PF_ARIA_STATUS_POSITIVE') +
			", 50% " + this.processFlowLaneHeader3._oResBundle.getText('PF_ARIA_STATUS_NEGATIVE') +
			", 20% " + this.processFlowLaneHeader3._oResBundle.getText('PF_ARIA_STATUS_NEUTRAL') +
			", 25% " + this.processFlowLaneHeader3._oResBundle.getText('PF_ARIA_STATUS_CRITICAL'),
			"Text was generated correctly with 4 status values");

		//Assertion for test 5 values case.
		testText = this.processFlowLaneHeader4._getAriaText();
		assert.deepEqual(testText,
			this.processFlowLaneHeader4._oResBundle.getText('PF_ARIA_STATUS') +
			" 3% " + this.processFlowLaneHeader4._oResBundle.getText('PF_ARIA_STATUS_POSITIVE') +
			", 3% " + this.processFlowLaneHeader4._oResBundle.getText('PF_ARIA_STATUS_POSITIVE') +
			", 70% " + this.processFlowLaneHeader4._oResBundle.getText('PF_ARIA_STATUS_NEGATIVE') +
			", 20% " + this.processFlowLaneHeader4._oResBundle.getText('PF_ARIA_STATUS_PLANNED') +
			", 5% " + this.processFlowLaneHeader4._oResBundle.getText('PF_ARIA_STATUS_CRITICAL'),
			"Text was generated correctly with 5 status values");

		//Assertion for text control without state object.
		testText = this.processFlowLaneHeader5._getAriaText();
		assert.deepEqual(testText, "", "Returns empty string for a control without status object");
	});

	QUnit.module("Integration", {
		beforeEach: function () {
			this.processFlow = new ProcessFlow("processFlow");
			this.processFlow.placeAt("qunit-fixture");
			this.processFlowClick = null;
			this.processFlowLaneHeader1 = new ProcessFlowLaneHeader({
				laneId: "processFlowLaneHeader1",
				iconSrc: "context-menu",
				position: 1
			});
			this.processFlowLaneHeader3 = new ProcessFlowLaneHeader({
				laneId: "processFlowLaneHeader3",
				iconSrc: "context-menu",
				position: 3
			});
			this.processFlowLaneHeader5 = new ProcessFlowLaneHeader({
				laneId: "processFlowLaneHeader5",
				iconSrc: "context-menu",
				position: 5
			});
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			if (this.processFlow) {
				this.processFlow.destroy();
			}
			if (this.processFlowClick) {
				this.processFlowClick.destroy();
			}
			if (this.processFlowLaneHeader1) {
				this.processFlowLaneHeader1.destroy();
			}
			if (this.processFlowLaneHeader3) {
				this.processFlowLaneHeader3.destroy();
			}
			if (this.processFlowLaneHeader5) {
				this.processFlowLaneHeader5.destroy();
			}
		}
	});

	QUnit.test("ProcessFlow lane map check", function (assert) {
		this.processFlow.addLane(this.processFlowLaneHeader5);
		this.processFlow.addLane(this.processFlowLaneHeader1);
		this.processFlow.addLane(this.processFlowLaneHeader3);
		assert.ok(this.processFlow, "Process flow should be ok");

		var headerLane = this.processFlow._getOrCreateLaneMap();
		assert.ok(headerLane, "Map exists.");
		assert.equal(headerLane[1], this.processFlowLaneHeader1, "First position passed.");
		assert.equal(headerLane[3], this.processFlowLaneHeader3, "First position passed.");
		assert.equal(headerLane[5], this.processFlowLaneHeader5, "First position passed.");
	});

	QUnit.test("ProcessFlow lane donut color check", function (assert) {
		//positive color test
		var aPercPositive = [1, 0, 0, 0, 0];
		var sColorPositive = this.processFlowLaneHeader1._selectColor(aPercPositive);
		assert.equal(sColorPositive, ProcessFlowLaneHeader._constants.sectorPositiveColor, "Donut Positive Color passed.");

		//negative color test
		var aPercNegative = [0, 1, 0, 0, 0];
		var sColorNegative = this.processFlowLaneHeader1._selectColor(aPercNegative);
		assert.equal(sColorNegative, ProcessFlowLaneHeader._constants.sectorNegativeColor, "Donut Negative Color passed.");

		//neutral color test
		var aPercNeutral = [0, 0, 1, 0, 0];
		var sColorNeutral = this.processFlowLaneHeader1._selectColor(aPercNeutral);
		assert.equal(sColorNeutral, ProcessFlowLaneHeader._constants.sectorNeutralColor, "Donut Neutral Color passed.");

		//planned color test
		var aPercPlanned = [0, 0, 0, 1, 0];
		var sColorPlanned = this.processFlowLaneHeader1._selectColor(aPercPlanned);
		assert.equal(sColorPlanned, ProcessFlowLaneHeader._constants.sectorPlannedColor, "Donut Planned Color passed.");

		//critical color test
		var aPercCritical = [0, 0, 0, 0, 1];
		var sColorCritical = this.processFlowLaneHeader1._selectColor(aPercCritical);
		assert.equal(sColorCritical, ProcessFlowLaneHeader._constants.sectorCriticalColor, "Donut Critical Color passed.");

		//neutral color test
		var aPercNeutral2 = [0, 0, 0, 0, 0, 1];
		var sColorNeutral2 = this.processFlowLaneHeader1._selectColor(aPercNeutral2);
		assert.equal(sColorNeutral2, ProcessFlowLaneHeader._constants.sectorNeutralColor, "Donut Neutral Color passed.");
	});

	QUnit.test("ProcessFlow lane map check, strange order of lanes", function (assert) {
		assert.expect(0);
		var oProcessFlowLanesWithClick = new ProcessFlow("pLanesWithClick", {
			nodes: {
				path: "/nodes",
				template: new ProcessFlowNode({
					nodeId: "{id}",
					laneId: "{laneId}",
					title: "{title}",
					isTitleClickable: true,
					children: "{children}",
					state: "{state}",
					titleAbbreviation: "{title}" + "abbr",
					stateText: "{state}",
					tag: { tagCheck: "tagCheck" },
					texts: "{texts}"
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

		var oDataLanesWithClick = {
			nodes:
				[
					{
						id: "1", laneId: "id0", title: "Sales Order 150", children: [10, 11, 12], state: ProcessFlowNodeState.Positive,
						texts: ["text 1 runs over two rows but no  more than two", ""]
					},
					{
						id: "10", laneId: "id3", title: "Accounting Document 78998790 with BBBB and AAAA and CCC and DDDD and EEEE", children: null, state: ProcessFlowNodeState.Negative,
						texts: ["text 2 runs over two rows but only two and no more", ""]
					},
					{
						id: "11", laneId: "id2", title: "Customer Invoice 9004562", children: null, state: ProcessFlowNodeState.Neutral,
						texts: ["text 1 runs over two rows", "text 2 runs over two rows"]
					},
					{
						id: "12", laneId: "id1", title: "Outbound Delivery 80017028", children: [5], state: ProcessFlowNodeState.Planned,
						texts: ["text 1 runs over two rows ", "text 2 runs over two rows"]
					},
					{
						id: "5", laneId: "id2", title: "Customer Invoice 2004562", children: null, state: ProcessFlowNodeState.Critical,
						texts: ["text 1 runs over two rows", "text 2 runs over two rows"]
					}
				],
			lanes:
				[{ id: "id1", iconSrc: "sap-icon://order-status", text: "In Order", position: 1 }, // first lane element
					{ id: "id0", iconSrc: "sap-icon://order-status", text: "In Delivery", position: 0 }, // first lane element
					{ id: "id2", iconSrc: "sap-icon://order-status", text: "In Payment", position: 2 }, // fourth lane element
					{ id: "id3", iconSrc: "sap-icon://order-status", text: "In Invoice", position: 3 } // third lane element
				]
		};
		var oJModelLanesWithClick = new JSONModel(oDataLanesWithClick);
		oProcessFlowLanesWithClick.setModel(oJModelLanesWithClick);
		oProcessFlowLanesWithClick.attachOnError(function (error) {
			assert.ok(error, error);
		});
		oProcessFlowLanesWithClick.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		oProcessFlowLanesWithClick.destroy();
	});

}, /* bExport= */ true);
