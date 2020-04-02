/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"sap/ui/vk/NodeProxy",
	"sap/ui/vk/NodeContentType"
], function(
	jQuery,
	loader,
	NodeProxy,
	NodeContentType
) {
	"use strict";

	function testEnumerateChildrenGetChildren(assert) {
		var that = this,
			idsA = [],
			idsB = [],
			idsC = [];

		that.nodeHierarchy.enumerateChildren(function f(node) {
			var nodeRef = node.getNodeRef();
			idsA.push(nodeRef);
			that.nodeHierarchy.enumerateChildren(nodeRef, f);
		});

		that.nodeHierarchy.enumerateChildren(function f(nodeRef) {
			idsB.push(nodeRef);
			that.nodeHierarchy.enumerateChildren(nodeRef, f, false, true);
		}, false, true);

		assert.deepEqual(idsA, idsB, "enumerateChildren output is the same for passNodeRef true/false.");

		(function g(parentNodeRef) {
			that.nodeHierarchy.getChildren(parentNodeRef).map(function(childId) {
				idsC.push(childId);
				g(childId);
			});
		})();

		assert.deepEqual(idsA, idsC, "enumerateChildren and getChildren output is the same.");

		assert.equal(idsA.length, that.nodesCount, "The model contains " + that.nodesCount + " nodes.");
	}

	function testEnumerateAncestorsGetAncestors(assert) {
		// Take the node with index 13. In this test model it is deep in the hierarchy.
		var idsA = [],
			idsB = [],
			idsC = [],
			nodeToTest = this.nodeHierarchy.findNodesByName({ value: "Box #30" })[0];

		this.nodeHierarchy.enumerateAncestors(nodeToTest, function f(node) {
			idsA.push(node.getNodeRef());
		});

		this.nodeHierarchy.enumerateAncestors(nodeToTest, function f(nodeRef) {
			idsB.push(nodeRef);
		}, true);

		assert.deepEqual(idsA, idsB, "enumerateAncestors output is the same for passNodeRef true/false.");

		idsC = this.nodeHierarchy.getAncestors(nodeToTest);

		assert.deepEqual(idsA, idsC, "enumerateAncestors and getAncestors output is the same.");
	}

	function testCreateNodeProxyDestroyNodeProxy(assert) {
		var nodeToTest = this.nodeHierarchy.findNodesByName({ value: "Box #30" })[0],
			nodeProxy = this.nodeHierarchy.createNodeProxy(nodeToTest);
		assert.ok(nodeProxy instanceof NodeProxy, "The node proxy object has been created.");
		assert.equal(nodeProxy.getNodeRef(), nodeToTest, "The node proxy ID is correct.");
		assert.ok(this.nodeHierarchy._nodeProxies.indexOf(nodeProxy) >= 0, "The node proxy is in the node hierarchy cache.");
		this.nodeHierarchy.destroyNodeProxy(nodeProxy);
		assert.ok(nodeProxy.bIsDestroyed, "The node proxy has been destroyed.");
		assert.ok(this.nodeHierarchy._nodeProxies.indexOf(nodeProxy) < 0, "The node proxy is not in the node hierarchy cache.");
	}

	function testFindNodesByName(assert) {
		var query,
			result;

		query = {
			value: "Box #14",
			predicate: "equals",
			caseSensitive: true
		};
		result = this.nodeHierarchy.findNodesByName(query);
		assert.equal(result.length, 1, "One node found for: value: 'Box #14', predicate: 'equals', caseSensitive: true");

		query = {
			value: "bOx #14",
			predicate: "equals",
			caseSensitive: true
		};
		result = this.nodeHierarchy.findNodesByName(query);
		assert.equal(result.length, 0, "Zero nodes found for: value: 'bOx #14', predicate: 'equals', caseSensitive: true");

		query = {
			value: "Box #14",
			predicate: "equals",
			caseSensitive: false
		};
		result = this.nodeHierarchy.findNodesByName(query);
		assert.equal(result.length, 1, "One node found for: value: 'Box #14', predicate: 'equals', caseSensitive: false");

		query = {
			value: [ "Box #14", "Box #5", "Box #6", "Box #7" ],
			predicate: "equals",
			caseSensitive: true
		};
		result = this.nodeHierarchy.findNodesByName(query);
		assert.equal(result.length, 4, "4 nodes found for: value: ['Box #14', 'Box #5', 'Box #6', 'Box #7'], predicate: 'equals', caseSensitive: true");

		query = {
			value: "Box",
			predicate: "startsWith",
			caseSensitive: true
		};
		result = this.nodeHierarchy.findNodesByName(query);
		assert.equal(result.length, 27, "27 nodes that start with 'Box'");

		query = {
			value: "#1",
			predicate: "contains",
			caseSensitive: true
		};
		result = this.nodeHierarchy.findNodesByName(query);
		assert.equal(result.length, 10, "10 nodes contain the string '#1'");

		query = {
			value: [ "#1", "#2" ],
			predicate: "contains",
			caseSensitive: true
		};
		result = this.nodeHierarchy.findNodesByName(query);
		assert.equal(result.length, 20, "20 nodes contain the strings '#1' or '#2'");

		query = {
			value: [ "Box #14", "Box #5", "Box #6", "Box #7" ],
			caseSensitive: true
		};
		result = this.nodeHierarchy.findNodesByName(query);
		assert.equal(result.length, 4, "4 nodes found for: value: ['Box #14', 'Box #5', 'Box #6', 'Box #7'], predicate not specified so defaulting to 'equals'");

		query = {
			value: [ "BOX #14", "BOX #5", "bOx #6", "bOx #7" ]
		};
		result = this.nodeHierarchy.findNodesByName(query);
		assert.equal(result.length, 4, "4 nodes found for: value: ['BOX #14', 'BOX #5', 'bOx #6', 'bOx #7'], predicate not specified (default 'equals'), caseSensitive not specified (default false)");

		// testing for empty query object
		result = this.nodeHierarchy.findNodesByName();
		assert.equal(result.length, this.nodesCount, "Calling findNodes without passing any argument returns all " + this.nodesCount + " existing nodes.");

		result = this.nodeHierarchy.findNodesByName(null);
		assert.equal(result.length, this.nodesCount, "Calling findNodes with a 'null' argument returns all " + this.nodesCount + " existing nodes.");

		result = this.nodeHierarchy.findNodesByName(undefined);
		assert.equal(result.length, this.nodesCount, "Calling findNodes with an undefined argument returns all " + this.nodesCount + " existing nodes.");

		result = this.nodeHierarchy.findNodesByName({});
		assert.equal(result.length, this.nodesCount, "Calling findNodes with an empty object as argument returns all " + this.nodesCount + " existing nodes.");
	}

	function testFindNodesByMetadata(assert) {
		var query,
			result;

		// testing for empty query object
		result = this.nodeHierarchy.findNodesByMetadata();
		assert.equal(result.length, 27, "Calling findNodes without passing any argument returns all 27 existing nodes.");

		result = this.nodeHierarchy.findNodesByMetadata(null);
		assert.equal(result.length, 27, "Calling findNodes with a 'null' argument returns all 27 existing nodes.");

		result = this.nodeHierarchy.findNodesByMetadata(undefined);
		assert.equal(result.length, 27, "Calling findNodes with an undefined argument returns all 27 existing nodes.");

		result = this.nodeHierarchy.findNodesByMetadata({});
		assert.equal(result.length, 27, "Calling findNodes with an empty object as argument returns all 27 existing nodes.");

		query = {
			category: "CADMetadata",
			key: "PART_NAME",
			value: "Clutch Bearing",
			predicate: "equals",
			caseSensitive: true
		};
		result = this.nodeHierarchy.findNodesByMetadata(query);
		assert.equal(result.length, 1, "1 node found for CADMetadata category, PART_NAME equals Clutch Bearing, case sensitive");

		query = {
			category: "CADMetadata",
			key: "PART_NAME",
			value: "Clutch",
			predicate: "contains",
			caseSensitive: false
		};
		result = this.nodeHierarchy.findNodesByMetadata(query);
		assert.equal(result.length, 2, "2 nodes found for CADMetadata category, PART_NAME contains Clutch, case insensitive");

		query = {
			category: "CADMetadata",
			key: "PART_NAME",
			value: "hand",
			predicate: "startsWith",
			caseSensitive: false
		};
		result = this.nodeHierarchy.findNodesByMetadata(query);
		assert.equal(result.length, 1, "1 node found for CADMetadata category, PART_NAME startsWith Hand, case insensitive");

		query = {
			category: "CADMetadata",
			key: "PART_NAME",
			value: [ "hand", "clutch" ],
			predicate: "contains",
			caseSensitive: false
		};
		result = this.nodeHierarchy.findNodesByMetadata(query);
		assert.equal(result.length, 3, "3 nodes found for CADMetadata category, PART_NAME contains 'hand' or 'clutch', case insensitive");

		query = {
			category: "CADMetadata",
			key: "LOCATION",
			value: [ "hand", "clutch" ],
			predicate: "contains",
			caseSensitive: false
		};
		result = this.nodeHierarchy.findNodesByMetadata(query);
		assert.equal(result.length, 0, "0 nodes found for CADMetadata category, LOCATION contains 'hand' or 'clutch', case insensitive");

		query = {
			category: "CADMetadata",
			key: "PART_NAME"
		};
		result = this.nodeHierarchy.findNodesByMetadata(query);
		assert.equal(result.length, 5, "5 nodes having CADMetadata category and also having a PART_NAME key, no matter what the value is for that key.");

		query = {
			category: "CADMetadata"
		};
		result = this.nodeHierarchy.findNodesByMetadata(query);
		assert.equal(result.length, 5, "5 nodes having CADMetadata category found");

		query = {
			category: "CADMetadata2"
		};
		result = this.nodeHierarchy.findNodesByMetadata(query);
		assert.equal(result.length, 1, "1 nodes having CADMetadata2 category found");

		query = {
			category: "CADMetadata3"
		};
		result = this.nodeHierarchy.findNodesByMetadata(query);
		assert.equal(result.length, 0, "0 nodes having CADMetadata3 category found because this category doesn\'t exist anywhere in the model.");
	}

	function testCreateNodeRemoveNodeTpB(assert) {
		var originalTopLevelNodes = this.nodeHierarchy.getChildren();
		var newNodeRef = this.nodeHierarchy.createNode(null, "test", originalTopLevelNodes[0]);
		var topLevelNodeRefs = this.nodeHierarchy.getChildren();
		assert.equal(topLevelNodeRefs.indexOf(newNodeRef), 0, "New node created at the beginning.");
		this.nodeHierarchy.removeNode(newNodeRef);
		assert.ok(this.nodeHierarchy.getChildren().indexOf(newNodeRef) < 0, "New node removed.");
	}

	function testCreateNodeRemoveNodeTpE(assert) {
		var newNodeRef = this.nodeHierarchy.createNode(null, "test", null);
		var topLevelNodeRefs = this.nodeHierarchy.getChildren();
		assert.equal(topLevelNodeRefs.indexOf(newNodeRef), topLevelNodeRefs.length - 1, "New node created at the end.");
		this.nodeHierarchy.removeNode(newNodeRef);
		assert.ok(this.nodeHierarchy.getChildren().indexOf(newNodeRef) < 0, "New node removed.");
	}

	function testCreateNodeRemoveNodeTpM(assert) {
		var nodeA = this.nodeHierarchy.createNode(null, "testA", null);
		var nodeB = this.nodeHierarchy.createNode(null, "testB", nodeA);
		var topLevelNodeRefs = this.nodeHierarchy.getChildren();
		var position = topLevelNodeRefs.length - 2;
		assert.equal(topLevelNodeRefs.indexOf(nodeB), position, "New node created in the middle at position " + position + ".");
		this.nodeHierarchy.removeNode(nodeA);
		this.nodeHierarchy.removeNode(nodeB);
		assert.ok(this.nodeHierarchy.getChildren().indexOf(nodeB) < 0, "New node removed.");
	}

	function testCreateNodeRemoveNodeNtpB(assert) {
		var parentNodeRef = this.nodeHierarchy.findNodesByName({ value: "Box #9" })[0];
		assert.ok(parentNodeRef, "Parent node for the test found.");
		var childNodeRefs = this.nodeHierarchy.getChildren(parentNodeRef);
		var nodeRef = this.nodeHierarchy.createNode(parentNodeRef, "test", childNodeRefs[0]);
		assert.equal(this.nodeHierarchy.getChildren(parentNodeRef).indexOf(nodeRef), 0, "New node created at the beginning.");
		this.nodeHierarchy.removeNode(nodeRef);
		assert.ok(this.nodeHierarchy.getChildren(parentNodeRef).indexOf(nodeRef) < 0, "New node removed.");
	}

	function testCreateNodeRemoveNodeNtpE(assert) {
		var parentNodeRef = this.nodeHierarchy.findNodesByName({ value: "Box #9" })[0];
		assert.ok(parentNodeRef, "Parent node for the test found.");
		var nodeRef = this.nodeHierarchy.createNode(parentNodeRef, "test", null);
		var newChildNodeRefs = this.nodeHierarchy.getChildren(parentNodeRef);
		assert.equal(newChildNodeRefs.indexOf(nodeRef), newChildNodeRefs.length - 1, "New node created at the end.");
		this.nodeHierarchy.removeNode(nodeRef);
		assert.ok(this.nodeHierarchy.getChildren(parentNodeRef).indexOf(nodeRef) < 0, "New node removed.");
	}

	function testCreateNodeWithNodeContentType(assert) {
		var parentNodeRef = this.nodeHierarchy.findNodesByName({ value: "Box #9" })[0];
		assert.ok(parentNodeRef, "Parent node for the test found.");
		var childNodeRefs = this.nodeHierarchy.getChildren(parentNodeRef);
		var position = Math.floor(childNodeRefs.length / 2);

		var nodeRef = this.nodeHierarchy.createNode(parentNodeRef, "test", childNodeRefs[position]);
		var newChildNodeRefs = this.nodeHierarchy.getChildren(parentNodeRef);
		assert.equal(newChildNodeRefs.indexOf(nodeRef), position, "New regular node created in the middle at position " + position + ".");
		var nodeContentType = this.nodeHierarchy.getNodeContentType(nodeRef);
		assert.equal(nodeContentType, NodeContentType.Regular, "Regular node content type is tested");
		assert.ok(nodeRef.layers.test(parentNodeRef.layers), "test regular node to be rendered");
		assert.ok(!nodeRef.userData.skipIt, "test regular node to be displayed in scene tree");
		this.nodeHierarchy.removeNode(nodeRef);
		assert.ok(this.nodeHierarchy.getChildren(parentNodeRef).indexOf(nodeRef) < 0, "New regular node removed.");

		nodeRef = this.nodeHierarchy.createNode(parentNodeRef, "test", childNodeRefs[position], NodeContentType.Reference);
		newChildNodeRefs = this.nodeHierarchy.getChildren(parentNodeRef);
		assert.equal(newChildNodeRefs.indexOf(nodeRef), position, "New reference node created in the middle at position " + position + ".");
		nodeContentType = this.nodeHierarchy.getNodeContentType(nodeRef);
		assert.equal(nodeContentType, NodeContentType.Reference, "Reference node content type is tested");
		assert.ok(!nodeRef.layers.test(parentNodeRef.layers), "test reference node not to be rendered");
		assert.ok(nodeRef.userData.skipIt, "test regular node not to be displayed in scene tree");
		this.nodeHierarchy.removeNode(nodeRef);
		assert.ok(this.nodeHierarchy.getChildren(parentNodeRef).indexOf(nodeRef) < 0, "New reference node removed.");
	}

	function testCreateNodeRemoveNodeNtpM(assert) {
		var parentNodeRef = this.nodeHierarchy.findNodesByName({ value: "Box #9" })[0];
		assert.ok(parentNodeRef, "Parent node for the test found.");
		var childNodeRefs = this.nodeHierarchy.getChildren(parentNodeRef);
		var position = Math.floor(childNodeRefs.length / 2);
		var nodeRef = this.nodeHierarchy.createNode(parentNodeRef, "test", childNodeRefs[position]);
		var newChildNodeRefs = this.nodeHierarchy.getChildren(parentNodeRef);
		assert.equal(newChildNodeRefs.indexOf(nodeRef), position, "New node created in the middle at position " + position + ".");
		this.nodeHierarchy.removeNode(nodeRef);
		assert.ok(this.nodeHierarchy.getChildren(parentNodeRef).indexOf(nodeRef) < 0, "New node removed.");
	}

	function testCreateNodeCopyRemoveNodeTlB(assert) {
		var nodeToCopy = this.nodeHierarchy.findNodesByName({ value: "Box #10" })[0];
		assert.ok(nodeToCopy, "Node to copy found.");
		var originalTopLevelNodes = this.nodeHierarchy.getChildren();
		var newNodeRef = this.nodeHierarchy.createNodeCopy(nodeToCopy, null, "test", originalTopLevelNodes[0]);
		var topLevelNodeRefs = this.nodeHierarchy.getChildren();
		assert.equal(topLevelNodeRefs.indexOf(newNodeRef), 0, "New node copy created at the beginning.");
		this.nodeHierarchy.removeNode(newNodeRef);
		assert.ok(this.nodeHierarchy.getChildren().indexOf(newNodeRef) < 0, "New node removed.");
	}

	function testCreateNodeCopyRemoveNodeTlE(assert) {
		var nodeToCopy = this.nodeHierarchy.findNodesByName({ value: "Box #10" })[0];
		assert.ok(nodeToCopy, "Node to copy found.");
		var newNodeRef = this.nodeHierarchy.createNodeCopy(nodeToCopy, null, "test", null);
		var topLevelNodeRefs = this.nodeHierarchy.getChildren();
		assert.equal(topLevelNodeRefs.indexOf(newNodeRef), topLevelNodeRefs.length - 1, "New node copy created at the end.");
		this.nodeHierarchy.removeNode(newNodeRef);
		assert.ok(this.nodeHierarchy.getChildren().indexOf(newNodeRef) < 0, "New node removed.");
	}

	function testCreateNodeCopyRemoveNodeTlM(assert) {
		var nodeToCopy = this.nodeHierarchy.findNodesByName({ value: "Box #10" })[0];
		assert.ok(nodeToCopy, "Node to copy found.");
		var nodeA = this.nodeHierarchy.createNodeCopy(nodeToCopy, null, "testA", null);
		var nodeB = this.nodeHierarchy.createNodeCopy(nodeToCopy, null, "testB", nodeA);
		var topLevelNodeRefs = this.nodeHierarchy.getChildren();
		var position = topLevelNodeRefs.length - 2;
		assert.equal(topLevelNodeRefs.indexOf(nodeB), position, "New node copy created in the middle at position " + position + ".");
		this.nodeHierarchy.removeNode(nodeA);
		this.nodeHierarchy.removeNode(nodeB);
		assert.ok(this.nodeHierarchy.getChildren().indexOf(nodeB) < 0, "New node removed.");
	}

	function testCreateNodeCopyRemoveNodeNtlB(assert) {
		var nodeToCopy = this.nodeHierarchy.findNodesByName({ value: "Box #10" })[0];
		assert.ok(nodeToCopy, "Node to copy found.");
		var parentNodeRef = this.nodeHierarchy.findNodesByName({ value: "Box #9" })[0];
		assert.ok(parentNodeRef, "Parent node for the test found.");
		var childNodeRefs = this.nodeHierarchy.getChildren(parentNodeRef);
		var nodeRef = this.nodeHierarchy.createNodeCopy(nodeToCopy, parentNodeRef, "test", childNodeRefs[0]);
		assert.equal(this.nodeHierarchy.getChildren(parentNodeRef).indexOf(nodeRef), 0, "New node copy created at the beginning.");
		this.nodeHierarchy.removeNode(nodeRef);
		assert.ok(this.nodeHierarchy.getChildren(parentNodeRef).indexOf(nodeRef) < 0, "New node removed.");
	}

	function testCreateNodeCopyRemoveNodeNtlE(assert) {
		var nodeToCopy = this.nodeHierarchy.findNodesByName({ value: "Box #10" })[0];
		assert.ok(nodeToCopy, "Node to copy found.");
		var parentNodeRef = this.nodeHierarchy.findNodesByName({ value: "Box #9" })[0];
		assert.ok(parentNodeRef, "Parent node for the test found.");
		var nodeRef = this.nodeHierarchy.createNodeCopy(nodeToCopy, parentNodeRef, "test", null);
		var newChildNodeRefs = this.nodeHierarchy.getChildren(parentNodeRef);
		assert.equal(newChildNodeRefs.indexOf(nodeRef), newChildNodeRefs.length - 1, "New node copy created at the end.");
		this.nodeHierarchy.removeNode(nodeRef);
		assert.ok(this.nodeHierarchy.getChildren(parentNodeRef).indexOf(nodeRef) < 0, "New node removed.");
	}

	function testCreateNodeCopyRemoveNodeNtlM(assert) {
		var nodeToCopy = this.nodeHierarchy.findNodesByName({ value: "Box #10" })[0];
		assert.ok(nodeToCopy, "Node to copy found.");
		var parentNodeRef = this.nodeHierarchy.findNodesByName({ value: "Box #9" })[0];
		assert.ok(parentNodeRef, "Parent node for the test found.");
		var childNodeRefs = this.nodeHierarchy.getChildren(parentNodeRef);
		var position = Math.floor(childNodeRefs.length / 2);
		var nodeRef = this.nodeHierarchy.createNodeCopy(nodeToCopy, parentNodeRef, "test", childNodeRefs[position]);
		var newChildNodeRefs = this.nodeHierarchy.getChildren(parentNodeRef);
		assert.equal(newChildNodeRefs.indexOf(nodeRef), position, "New node copy created in the middle at position " + position + ".");
		this.nodeHierarchy.removeNode(nodeRef);
		assert.ok(this.nodeHierarchy.getChildren(parentNodeRef).indexOf(nodeRef) < 0, "New node removed.");
	}

	function testEvents(assert) {
		var that = this,
			nodeCreatedCount = 0,
			nodeRemovingCount = 0,
			changedCount = 0,
			eventHandler = {
				id: "event handler",
				handleNodeCreated: function(event) {
					assert.ok(this.id === eventHandler.id, "Event 'nodeCreated' received.");
					assert.ok(that.nodeHierarchy.getChildren().indexOf(event.getParameter("nodeRef")) >= 0, "The created node is found in the node hierarchy.");
					nodeCreatedCount += 1;
				},
				handleNodeRemoving: function(event) {
					assert.ok(this.id === eventHandler.id, "Event 'nodeRemoving' received.");
					assert.ok(that.nodeHierarchy.getChildren().indexOf(event.getParameter("nodeRef")) >= 0, "The node to be removed is found in the node hierarchy.");
					nodeRemovingCount += 1;
				},
				handleChanged: function(event) {
					assert.ok(this.id === eventHandler.id, "Event 'changed' received.");
					changedCount += 1;
				}
			};
		this.nodeHierarchy
			.attachNodeCreated(eventHandler.handleNodeCreated, eventHandler)
			.attachNodeRemoving(eventHandler.handleNodeRemoving, eventHandler);

		var newNodeRef = this.nodeHierarchy.createNode(null, "test", null);
		this.nodeHierarchy.removeNode(newNodeRef);

		newNodeRef = this.nodeHierarchy.createNodeCopy(this.nodeHierarchy.findNodesByName({ value: "Box #10" })[0], null, "test", null);
		this.nodeHierarchy.removeNode(newNodeRef);

		assert.equal(nodeCreatedCount, 2, "Event 'nodeCreated' was received 2 times.");
		assert.equal(nodeRemovingCount, 2, "Event 'nodeRemoving' was received 2 times.");
		assert.equal(nodeRemovingCount, 2, "Event 'changed' was received 4 times.");
	}

	function testFindNodesById(assert) {
		var query,
			result;

		query = {
			source: "SAP",
			type: "VE_COMPONENT",
			fields: [
				{
					name: "ID",
					value: "f17a447e-8cbe-447b-b723-e1f3eae59173_36",
					predicate: "equals",
					caseSensitive: true
				}, {
					name: "TIMESTAMP",
					value: "2016-07-04 09:50:03.603",
					predicate: "equals",
					caseSensitive: true
				}
			]
		};
		result = this.nodeHierarchy.findNodesById(query);
		assert.strictEqual(result.length, 1, "1 node matching the query.");

		query = {
			source: "SAP",
			type: "VE_COMPONENT",
			fields: [
				{
					name: "ID",
					value: "f17a447e-8cbe-447b-b723-e1f3eae59173_39",
					predicate: "equals",
					caseSensitive: true
				}, {
					name: "TIMESTAMP",
					value: "2016-07-04 09:50:03.603",
					predicate: "equals",
					caseSensitive: true
				}
			]
		};
		result = this.nodeHierarchy.findNodesById(query);
		assert.strictEqual(result.length, 1, "1 node matching the query.");

		query = {
			source: "SAP",
			type: "VE_COMPONENT",
			fields: [
				{
					name: "ID",
					value: "f17a447e-8cbe-447b-b723-e1f3eae59173_42",
					predicate: "equals",
					caseSensitive: true
				}, {
					name: "TIMESTAMP",
					value: "2016-07-04 09:50:03.603",
					predicate: "equals",
					caseSensitive: true
				}
			]
		};
		result = this.nodeHierarchy.findNodesById(query);
		assert.strictEqual(result.length, 1, "1 node matching the query.");

		query = {
			source: "SAP",
			type: "VE_COMPONENT",
			fields: [
				{
					name: "ID",
					value: "f17a447e-8cbe-447b-b723-e1f3eae59173_45",
					predicate: "equals",
					caseSensitive: true
				}, {
					name: "TIMESTAMP",
					value: "2016-07-04 09:50:03.603",
					predicate: "equals",
					caseSensitive: true
				}
			]
		};
		result = this.nodeHierarchy.findNodesById(query);
		assert.strictEqual(result.length, 1, "1 node matching the query.");

		query = {
			source: "SAP",
			type: "VE_COMPONENT",
			fields: [
				{
					name: "ID",
					value: "f17a447e-8cbe-447b-b723-e1f3eae59173_48",
					predicate: "equals",
					caseSensitive: true
				}, {
					name: "TIMESTAMP",
					value: "2016-07-04 09:50:03.603",
					predicate: "equals",
					caseSensitive: true
				}
			]
		};
		result = this.nodeHierarchy.findNodesById(query);
		assert.strictEqual(result.length, 1, "1 node matching the query.");

		query = {
			source: "SAP",
			type: "VE_COMPONENT",
			fields: [
				{
					name: "ID",
					value: "f17a447e-8cbe-447b-b723-e1f3eae59173_51",
					predicate: "equals",
					caseSensitive: true
				}, {
					name: "TIMESTAMP",
					value: "2016-07-04 09:50:03.603",
					predicate: "equals",
					caseSensitive: true
				}
			]
		};
		result = this.nodeHierarchy.findNodesById(query);
		assert.strictEqual(result.length, 1, "1 node matching the query.");

		query = {
			source: "SAP",
			type: "VE_COMPONENT",
			fields: [
				{
					name: "ID",
					value: "F17A447",
					predicate: "startsWith",
					caseSensitive: true
				}
			]
		};
		result = this.nodeHierarchy.findNodesById(query);
		assert.strictEqual(result.length, 0, "0 nodes have VE IDS starting with 'F17A447', case sensitive.");

		query = {
			source: "SAP",
			type: "VE_COMPONENT",
			fields: [
				{
					name: "ID",
					value: "F17A447",
					predicate: "startsWith",
					caseSensitive: false
				}
			]
		};
		result = this.nodeHierarchy.findNodesById(query);
		assert.strictEqual(result.length, 17, "17 nodes have VE IDS starting with 'F17A447', case insensitive.");

		query = {
			source: "SAP",
			type: "VE_COMPONENT",
			fields: [
				{
					name: "ID",
					value: "173_4",
					predicate: "contains",
					caseSensitive: false
				}
			]
		};
		result = this.nodeHierarchy.findNodesById(query);
		assert.strictEqual(result.length, 3, "3 nodes have VE IDS containing '173_4', case insensitive.");

		query = {
			source: "SAPPPPPPPPP",
			type: "VE_COMPONENT",
			fields: [
				{
					name: "ID",
					value: "box #1",
					predicate: "startsWith",
					caseSensitive: true
				}
			]
		};

		result = this.nodeHierarchy.findNodesById(query);
		assert.strictEqual(result.length, 0, "0 nodes found for SAPPPPPPPPP source.");

		query = {
			source: "SAP",
			type: "VE_COMPONENTTTTTTTTTT",
			fields: [
				{
					name: "ID",
					value: "box #1",
					predicate: "startsWith",
					caseSensitive: true
				}
			]
		};

		result = this.nodeHierarchy.findNodesById(query);
		assert.strictEqual(result.length, 0, "0 nodes found for VE_COMPONENTTTTTTTTTT type.");

		query = {
			source: "SAP",
			type: "VE_COMPONENT",
			fields: [
				{
					name: "IDDDDD",
					value: "box #1",
					predicate: "startsWith",
					caseSensitive: true
				}
			]
		};

		result = this.nodeHierarchy.findNodesById(query);
		assert.strictEqual(result.length, 0, "0 nodes found for IDDDDD id name.");
	}

	QUnit.moduleWithContentConnector("NodeHierarchy", "test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", "threejs.test.json", function(assert) {
		this.nodeHierarchy = this.contentConnector.getContent().getDefaultNodeHierarchy();
		this.nodesCount = 38; // Need to update this unit test. We should not use hard code number of nodes as anyone can add more stuff to the current scene
	});

	QUnit.test("threejs: enumerateChildren/getChildren", testEnumerateChildrenGetChildren);
	QUnit.test("threejs: enumerateAncestors/getAncestors", testEnumerateAncestorsGetAncestors);
	QUnit.test("threejs: createNodeProxy/destroyNodeProxy", testCreateNodeProxyDestroyNodeProxy);
	QUnit.test("threejs: findNodesByName", testFindNodesByName);

	QUnit.test("threejs: createNode/removeNode - top level - insert at the beginning", testCreateNodeRemoveNodeTpB);
	QUnit.test("threejs: createNode/removeNode - top level - insert at the end", testCreateNodeRemoveNodeTpE);
	QUnit.test("threejs: createNode/removeNode - top level - insert in the middle", testCreateNodeRemoveNodeTpM);
	QUnit.test("threejs: createNode/removeNode - non top level - insert at the beginning", testCreateNodeRemoveNodeNtpB);
	QUnit.test("threejs: createNode/removeNode - non top level - insert at the end", testCreateNodeRemoveNodeNtpE);
	QUnit.test("threejs: createNode/removeNode - non top level - insert in the middle", testCreateNodeRemoveNodeNtpM);
	QUnit.test("threejs: createNode/removeNode - with node content types", testCreateNodeWithNodeContentType);

	QUnit.test("threejs: createNodeCopy/removeNode - top level - insert at the beginning", testCreateNodeCopyRemoveNodeTlB);
	QUnit.test("threejs: createNodeCopy/removeNode - top level - insert at the end", testCreateNodeCopyRemoveNodeTlE);
	QUnit.test("threejs: createNodeCopy/removeNode - top level - insert in the middle", testCreateNodeCopyRemoveNodeTlM);
	QUnit.test("threejs: createNodeCopy/removeNode - non top level - insert at the beginning", testCreateNodeCopyRemoveNodeNtlB);
	QUnit.test("threejs: createNodeCopy/removeNode - non top level - insert at the end", testCreateNodeCopyRemoveNodeNtlE);
	QUnit.test("threejs: createNodeCopy/removeNode - non top level - insert in the middle", testCreateNodeCopyRemoveNodeNtlM);

	QUnit.test("threejs: Events", testEvents);

	QUnit.moduleWithContentConnector("NodeHierarchy", "test-resources/sap/ui/vk/qunit/media/nodes_boxes.vds", "vds", function(assert) {
		this.nodeHierarchy = this.contentConnector.getContent().getDefaultNodeHierarchy();
		this.nodesCount = 27;
	});

	QUnit.test("dvl: enumerateChildren/getChildren", testEnumerateChildrenGetChildren);
	QUnit.test("dvl: enumerateAncestors/getAncestors", testEnumerateAncestorsGetAncestors);
	QUnit.test("dvl: createNodeProxy/destroyNodeProxy", testCreateNodeProxyDestroyNodeProxy);
	QUnit.test("dvl: findNodesByName", testFindNodesByName);
	QUnit.test("dvl: findNodesByMetadata", testFindNodesByMetadata);

	QUnit.test("dvl: createNode/removeNode - top level - insert at the beginning", testCreateNodeRemoveNodeTpB);
	QUnit.test("dvl: createNode/removeNode - top level - insert at the end", testCreateNodeRemoveNodeTpE);
	QUnit.test("dvl: createNode/removeNode - top level - insert in the middle", testCreateNodeRemoveNodeTpM);
	QUnit.test("dvl: createNode/removeNode - non top level - insert at the beginning", testCreateNodeRemoveNodeNtpB);
	QUnit.test("dvl: createNode/removeNode - non top level - insert at the end", testCreateNodeRemoveNodeNtpE);
	QUnit.test("dvl: createNode/removeNode - non top level - insert in the middle", testCreateNodeRemoveNodeNtpM);

	QUnit.test("dvl: createNodeCopy/removeNode - top level - insert at the beginning", testCreateNodeCopyRemoveNodeTlB);
	QUnit.test("dvl: createNodeCopy/removeNode - top level - insert at the end", testCreateNodeCopyRemoveNodeTlE);
	QUnit.test("dvl: createNodeCopy/removeNode - top level - insert in the middle", testCreateNodeCopyRemoveNodeTlM);
	QUnit.test("dvl: createNodeCopy/removeNode - non top level - insert at the beginning", testCreateNodeCopyRemoveNodeNtlB);
	QUnit.test("dvl: createNodeCopy/removeNode - non top level - insert at the end", testCreateNodeCopyRemoveNodeNtlE);
	QUnit.test("dvl: createNodeCopy/removeNode - non top level - insert in the middle", testCreateNodeCopyRemoveNodeNtlM);

	QUnit.test("dvl: Events", testEvents);

	// Test 'findNodesById' requires a model with VE IDs, so we load a new model.
	QUnit.moduleWithContentConnector("NodeHierarchy - model with VE IDs", "test-resources/sap/ui/vk/qunit/media/nodes_boxes_with_ve_id.vds", "vds", function(assert) {
		this.nodeHierarchy = this.contentConnector.getContent().getDefaultNodeHierarchy();
	});

	QUnit.test("dvl: findNodesById", testFindNodesById);

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
