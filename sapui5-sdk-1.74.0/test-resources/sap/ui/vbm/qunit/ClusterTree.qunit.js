sap.ui.define([
	"sap/ui/vbm/ClusterTree"
], function(
	ClusterTree
) {
	"use strict";

	var clusterTree = new ClusterTree();

	QUnit.test("ClusterTree constructor", function(assert) {

		assert.strictEqual(clusterTree.getAnimateClusterSplit(), true, "Default value for animateClusterSplit is true.");

	});


	QUnit.test("ClusterTree.prototype.getClusterDefinition", function(assert) {

		var animation = clusterTree.getAnimateClusterSplit().toString(),
			type = "tree";

		assert.strictEqual(clusterTree.getClusterDefinition().animation, animation, "Animation property is 'true'.");
		assert.strictEqual(clusterTree.getClusterDefinition().type, type, "Cluster type is 'tree'.");

	});
});