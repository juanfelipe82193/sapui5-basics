sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/ProcessFlowNode",
	"sap/suite/ui/commons/ProcessFlowNodeState",
	"sap/suite/ui/commons/ProcessFlowNodeType",
	"sap/suite/ui/commons/ProcessFlowZoomLevel",
	"sap/ui/thirdparty/sinon"
], function(jQuery, ProcessFlowNode, ProcessFlowNodeState, ProcessFlowNodeType, ProcessFlowZoomLevel) {
	"use strict";

	QUnit.module("Basic Tests", {
		beforeEach: function() {
			this.processFlowNode =
				new ProcessFlowNode({
					id: "processFlowNode1",
					nodeId: "processFlowNode1Int",
					state: ProcessFlowNodeState.Negative
				});
			//Required to avoid accessing ProcessFlow (not available in test)
			this.processFlowNode._getAriaText = function() {
				return "";
			};
			this.processFlowNode.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			if (this.processFlowNode) {
				this.processFlowNode.destroy();
			}
		}
	});

	QUnit.test("Process flow node is rendered.", function(assert) {
		var nodeId = this.processFlowNode.getId();
		var $node = jQuery.sap.byId(nodeId);

		assert.ok($node.is("div"), "It is a div.");
		assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode0"), "Style class applied.");
	});

	QUnit.test("Process flow node title present.", function(assert) {
		var nodeId = this.processFlowNode.getId();
		var $node = jQuery.sap.byId(nodeId + "-title");

		assert.ok($node.is("div"), "It is a div.");
		assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode3Title"), "Style class applied.");
	});

	QUnit.test("Process flow node icon container present.", function(assert) {
		var nodeId = this.processFlowNode.getId();
		var $node = jQuery.sap.byId(nodeId + "-icon-container");

		assert.ok($node.is("div"), "It is a div.");
		assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode3StateIcon"), "Style class applied.");
	});

	QUnit.test("Process flow node icon present.", function(assert) {
		var nodeId = this.processFlowNode.getId();
		var $node = jQuery.sap.byId(nodeId + "-icon");

		assert.ok($node.is("span"), "It is a span.");
		assert.equal($node.parent()[0].id, nodeId + "-icon-container", "Parent as expected.");
	});

	QUnit.test("Process flow node title present.", function(assert) {
		var nodeId = this.processFlowNode.getId();
		var $node = jQuery.sap.byId(nodeId + "-title");

		assert.ok($node.is("div"), "It is a div.");
		assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode3Title"), "Style class applied.");
	});

	QUnit.test("Process flow node - type is accessible.", function(assert) {
		var type = this.processFlowNode.getType();
		assert.equal(type, ProcessFlowNodeType.Single, "Process Flow Node Type single (default type) is correct.");
	});

	QUnit.module("State Tests", {
		beforeEach: function() {
			this.processFlowNode =
				new ProcessFlowNode({ id: "processFlowNode1", nodeId: "processFlowNode1Int" });
			//Required to avoid accessing ProcessFlow (not available in test)
			this.processFlowNode._getAriaText = function() {
				return "";
			};
			this.processFlowNode.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			if (this.processFlowNode) {
				this.processFlowNode.destroy();
			}
		}
	});

	QUnit.test("Process Flow Node should exist with default state neutral. - creation", function(assert) {
		assert.ok(this.processFlowNode, "Process flow node should be present");
		assert.ok(this.processFlowNode.getState() === ProcessFlowNodeState.Neutral);
	});

	QUnit.module("Children Tests", {
		beforeEach: function() {
			this.processFlowNode =
				new ProcessFlowNode({ id: "processFlowNode1", nodeId: "processFlowNode1Int" });
			this.processFlowNode._getAriaText = function() {
				return "";
			};
			this.processFlowNode.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			if (this.processFlowNode) {
				this.processFlowNode.destroy();
			}
		}
	});

	QUnit.test("Process Flow Node contains children", function(assert) {
		/* Arrange */
		this.processFlowNode.setChildren(["1", "2"]);

		/* Act */
		var result = this.processFlowNode._hasChildren();

		/* Assert */
		assert.ok(result, "Process Flow Node contains children.");
	});

	QUnit.test("Process Flow Node does not contain children", function(assert) {
		/* Arrange */

		/* Act */
		var result = this.processFlowNode._hasChildren();

		/* Assert */
		assert.ok(!result, "Process Flow Node does not contain children.");
	});

	QUnit.test("Process Flow Node contains a child with specified nodeId", function(assert) {
		/* Arrange */
		this.processFlowNode.setChildren(["1", "2", { nodeId: "3" }]);

		/* Act */
		var bHasChildWithId1 = this.processFlowNode._hasChildrenWithNodeId("1");
		var bHasChildWithId3 = this.processFlowNode._hasChildrenWithNodeId("3");

		/* Assert */
		assert.ok(bHasChildWithId1, "Process Flow Node contains a child with the nodeId of 1.");
		assert.ok(bHasChildWithId3, "Process Flow Node contains a child with the nodeId of 3.");
	});

	QUnit.test("Process Flow Node does not contain children with specified nodeId", function(assert) {
		/* Arrange */

		/* Act */
		var bHasChildWithId1 = this.processFlowNode._hasChildrenWithNodeId("1");

		/* Assert */
		assert.ok(!bHasChildWithId1, "Process Flow Node does not contain children with a nodeId of 1.");
	});

	QUnit.module("ARIA Tests", {
		beforeEach: function() {
			this.processFlowNode =
				new ProcessFlowNode({ id: "processFlowNode1", nodeId: "processFlowNode1Int" });
			//Required to avoid accessing ProcessFlow (not available in test)
			this.processFlowNode._getLane = function() {
				return {
					getText: function() {
						return "Current Lane Header";
					}
				};
			};
			this.processFlowNode.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			if (this.processFlowNode) {
				this.processFlowNode.destroy();
			}
		}
	});

	QUnit.test("Get ARIA details of Process Flow Node", function(assert) {
		/* Arrange */
		this.processFlowNode.setChildren(["1", "2"]);
		this.processFlowNode.setTitle("ARIA Test Node");
		this.processFlowNode.setTexts(["TestText1", "TestText2"]);
		this.processFlowNode.setStateText("ok statustext");

		/* Act */
		var result = this.processFlowNode._getAriaText();

		/* Assert */
		var assertText = this.processFlowNode._oResBundle.getText("PF_ARIA_NODE", [
			"ARIA Test Node",
			"Neutral",
			"ok statustext",
			"Current Lane Header",
			"TestText1, TestText2,",
			0,
			2,
			""
		]);
		assert.equal(result, assertText, "Process Flow Node ARIA Text correct.");
	});

	QUnit.test("Get ARIA details of Process Flow Node on planned node", function(assert) {
		/* Arrange */
		this.processFlowNode.setChildren(["1", "2"]);
		this.processFlowNode.setTitle("ARIA Test Node");
		this.processFlowNode.setTexts(["TestText1", "TestText2"]);
		this.processFlowNode.setStateText("ok statustext");
		this.processFlowNode.setState(ProcessFlowNodeState.Planned);

		/* Act */
		var result = this.processFlowNode._getAriaText();

		/* Assert */
		var assertText = this.processFlowNode._oResBundle.getText("PF_ARIA_NODE", [
			"ARIA Test Node",
			"Planned",
			"",
			"Current Lane Header",
			"TestText1, TestText2,",
			0,
			2,
			""
		]);
		assert.equal(result, assertText, "Process Flow Node ARIA Text for planned node correct. State Text not added to ARIA label.");
	});

	QUnit.module("ARIA with undefined values", {
		beforeEach: function() {
			this.processFlowNode =
				new ProcessFlowNode({ id: "processFlowNode1", nodeId: "processFlowNode1Int" });
			//Required to avoid accessing ProcessFlow (not available in test)
			this.processFlowNode._getLane = function() {
				return {
					getText: function() {
						return undefined;
					}
				};
			};
			this.processFlowNode.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			if (this.processFlowNode) {
				this.processFlowNode.destroy();
			}
		}
	});

	QUnit.test("Get ARIA details of Process Flow Node with undefined title, state text and lane header", function(assert) {
		/* Arrange */
		this.processFlowNode.setChildren(["1", "2"]);

		/* Act */
		var result = this.processFlowNode._getAriaText();

		/* Assert */
		var assertText = this.processFlowNode._oResBundle.getText("PF_ARIA_NODE", [
			this.processFlowNode._oResBundle.getText("PF_VALUE_UNDEFINED"),
			"Neutral",
			"",
			this.processFlowNode._oResBundle.getText("PF_VALUE_UNDEFINED"),
			"",
			0,
			2,
			""
		]);
		assert.equal(result, assertText, "Process Flow Node ARIA Text correct.");
	});

	QUnit.module("With Aggregated Node", {
		beforeEach: function() {
			this.processFlowNode =
				new ProcessFlowNode({
					id: "processFlowNode1",
					nodeId: "processFlowNode1Int",
					state: ProcessFlowNodeState.Negative,
					type: ProcessFlowNodeType.Aggregated
				});
			//Required to avoid accessing ProcessFlow (not available in test)
			this.processFlowNode._getAriaText = function() {
				return "";
			};
			this.processFlowNode.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			if (this.processFlowNode) {
				this.processFlowNode.destroy();
			}
		}
	});

	QUnit.test("Process flow aggregated node is rendered.", function(assert) {
		var nodeId = this.processFlowNode.getId();
		var $node = jQuery.sap.byId(nodeId);

		assert.ok($node.is("div"), "It is a div.");
		assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode0"), "Style class applied.");
	});

	QUnit.test("Process flow aggregated node title present.", function(assert) {
		var nodeId = this.processFlowNode.getId();
		var $node = jQuery.sap.byId(nodeId + "-title");

		assert.ok($node.is("div"), "It is a div.");
		assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode3Title"), "Style class applied.");
	});

	QUnit.test("Process flow aggregated node icon container present.", function(assert) {
		var nodeId = this.processFlowNode.getId();
		var $node = jQuery.sap.byId(nodeId + "-icon-container");

		assert.ok($node.is("div"), "It is a div.");
		assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode3StateIcon"), "Style class applied.");
	});

	QUnit.test("Process flow aggregated node icon present.", function(assert) {
		var nodeId = this.processFlowNode.getId();
		var $node = jQuery.sap.byId(nodeId + "-icon");

		assert.ok($node.is("span"), "It is a span.");
		assert.equal($node.parent()[0].id, nodeId + "-icon-container", "Parent as expected.");
	});

	QUnit.test("Process flow aggregated node title present.", function(assert) {
		var nodeId = this.processFlowNode.getId();
		var $node = jQuery.sap.byId(nodeId + "-title");

		assert.ok($node.is("div"), "It is a div.");
		assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNode3Title"), "Style class applied.");
	});

	QUnit.test("Process flow aggregated node - single style class.", function(assert) {
		var nodeId = this.processFlowNode.getId();
		var $node = jQuery.sap.byId(nodeId);

		assert.ok($node.is("div"), "It is a div.");
		assert.ok($node.hasClass("sapSuiteUiCommonsProcessFlowNodeAggregated"), "Style is correct.");
	});

	QUnit.module("With Aggregated Node Zoom Level 4", {
		beforeEach: function() {
			this.processFlowNode = new ProcessFlowNode({
				id: "processFlowNode1",
				nodeId: "processFlowNode1Int",
				state: ProcessFlowNodeState.Negative,
				type: ProcessFlowNodeType.Aggregated,
				focused: true
			});
			this.processFlowNode._setZoomLevel(ProcessFlowZoomLevel.Four);

			//Required to avoid accessing ProcessFlow (not available in test)
			this.processFlowNode._getAriaText = function() {
				return "";
			};
			this.processFlowNode.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		}
		, afterEach: function() {
			if (this.processFlowNode) {
				this.processFlowNode.destroy();
			}
		}
	});

	QUnit.test("Process flow aggregated node - focused zoom level 4 style class.", function(assert) {
		var nodeId = this.processFlowNode.getId();
		var $node = jQuery.sap.byId(nodeId);

		assert.ok(this.processFlowNode._getZoomLevel() === ProcessFlowZoomLevel.Four, "Zoom level is 4");
		assert.ok(!$node.hasClass("sapSuiteUiCommonsProcessFlowNodeAggregatedFocused"), "Style is correct.");
	});

	QUnit.module("Aggregated Node ARIA", {
		beforeEach: function() {
			this.processFlowNode =
				new ProcessFlowNode({
					id: "processFlowNode1",
					nodeId: "processFlowNode1Int",
					type: ProcessFlowNodeType.Aggregated
				});
			//Required to avoid accessing ProcessFlow (not available in test)
			this.processFlowNode._getLane = function() {
				return {
					getText: function() {
						return "Current Lane Header";
					}
				};
			};
			this.processFlowNode.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			if (this.processFlowNode) {
				this.processFlowNode.destroy();
			}
		}
	});

	QUnit.test("Get ARIA details of Process Flow Aggregated Node", function(assert) {
		/* Arrange */
		this.processFlowNode.setChildren(["1", "2"]);
		this.processFlowNode.setTitle("ARIA Test Node");
		this.processFlowNode.setTexts(["TestText1", "TestText2"]);
		this.processFlowNode.setStateText("ok statustext");

		/* Act */
		var result = this.processFlowNode._getAriaText();

		/* Assert */
		var assertText = this.processFlowNode._oResBundle.getText("PF_ARIA_NODE", [
			"ARIA Test Node",
			"Neutral",
			"ok statustext",
			"Current Lane Header",
			"TestText1, TestText2,",
			0,
			2,
			this.processFlowNode._oResBundle.getText("PF_ARIA_TYPE")
		]);
		assert.equal(result, assertText, "Process Flow Node ARIA Text correct.");
	});

	QUnit.test("Get ARIA details of Process Flow Aggregated Node on planned node", function(assert) {
		/* Arrange */
		this.processFlowNode.setChildren(["1", "2"]);
		this.processFlowNode.setTitle("ARIA Test Node");
		this.processFlowNode.setTexts(["TestText1", "TestText2"]);
		this.processFlowNode.setStateText("ok statustext");
		this.processFlowNode.setState(ProcessFlowNodeState.Planned);

		/* Act */
		var result = this.processFlowNode._getAriaText();

		/* Assert */
		var assertText = this.processFlowNode._oResBundle.getText("PF_ARIA_NODE", [
			"ARIA Test Node",
			"Planned",
			"",
			"Current Lane Header",
			"TestText1, TestText2,",
			0,
			2,
			this.processFlowNode._oResBundle.getText("PF_ARIA_TYPE")
		]);
		assert.equal(result, assertText, "Process Flow Node ARIA Text for planned node correct. State Text not added to ARIA label.");
	});

	QUnit.module("Node as container", {
		beforeEach: function() {
			this.oNode = new ProcessFlowNode();

			this.prepareTest = function(zoomLevel) {
				sinon.stub(this.oNode, "getParent").returns({
					getZoomLevel: function() {
						return zoomLevel;
					},
					getMetadata: function() {
						return {
							getName: function() {
								return "sap.suite.ui.commons.ProcessFlow";
							}
						};
					}
				});
				this.oSpy = sinon.spy(this.oNode, "getZoomLevel" + zoomLevel + "Content");
			};

			this.oNode.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.oNode.destroy();
			this.oNode = null;
		}
	});

	QUnit.test("Correct content of zoom level 'One' is retrieved", function(assert) {
		//Arrange
		this.prepareTest(ProcessFlowZoomLevel.One);

		//Act
		this.oNode._getCurrentZoomLevelContent();

		//Assert
		assert.equal(this.oSpy.callCount, 1, "The correct zoom level content getter has been called.");
	});

	QUnit.test("Correct content of zoom level 'Two' is retrieved", function(assert) {
		//Arrange
		this.prepareTest(ProcessFlowZoomLevel.Two);

		//Act
		this.oNode._getCurrentZoomLevelContent();

		//Assert
		assert.equal(this.oSpy.callCount, 1, "The correct zoom level content getter has been called.");
	});

	QUnit.test("Correct content of zoom level 'Three' is retrieved", function(assert) {
		//Arrange
		this.prepareTest(ProcessFlowZoomLevel.Three);

		//Act
		this.oNode._getCurrentZoomLevelContent();

		//Assert
		assert.equal(this.oSpy.callCount, 1, "The correct zoom level content getter has been called.");
	});

	QUnit.test("Correct content of zoom level 'Four' is retrieved", function(assert) {
		//Arrange
		this.prepareTest(ProcessFlowZoomLevel.Four);

		//Act
		this.oNode._getCurrentZoomLevelContent();

		//Assert
		assert.equal(this.oSpy.callCount, 1, "The correct zoom level content getter has been called.");
	});

}, /* bExport= */ true);
