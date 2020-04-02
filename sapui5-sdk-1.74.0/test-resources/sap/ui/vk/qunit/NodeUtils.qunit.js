/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/thirdparty/three",
	"sap/ui/vk/NodeUtils",
], function(
	jQuery,
	three,
	NodeUtils
) {
	"use strict";

	QUnit.test("NodeUtils.centerOfNodes", function(assert) {
		var done = assert.async();

		function testArray(a, b, message) {
			a.forEach(function(v, i) {
				assert.ok(Math.abs(v - b[ i ]) < 1e-5, message + " " + i + " (" + v + "=" + b[ i ] + ")");
			});
		};

		var nodeA = new THREE.Mesh(new THREE.CylinderBufferGeometry(5, 4, 10, 16), new THREE.MeshBasicMaterial());
		nodeA.position.set(5, 10, 15);
		nodeA.updateMatrixWorld(true);

		var nodeB = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
		nodeB.position.set(-1, -2, -3);
		nodeB.updateMatrixWorld(true);

		var nodeC = new THREE.Mesh(new THREE.SphereBufferGeometry(4, 32, 32), new THREE.MeshBasicMaterial());
		nodeC.position.set(4, 3, 4);
		nodeC.updateMatrixWorld(true);

		testArray(NodeUtils.centerOfNodes([nodeA, nodeB], null), [4, 6, 8], "A B");
		testArray(NodeUtils.centerOfNodes([nodeB, nodeC], null), [3, 2, 2], "B C");
		testArray(NodeUtils.centerOfNodes([nodeA, nodeC], null), [5, 7, 10], "A C");
		testArray(NodeUtils.centerOfNodes([nodeA, nodeB, nodeC], null), [4, 6, 8], "A B C");

		done();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
