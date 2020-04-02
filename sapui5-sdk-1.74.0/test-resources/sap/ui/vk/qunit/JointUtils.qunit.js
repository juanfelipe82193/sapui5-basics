/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/thirdparty/three",
	"sap/ui/vk/JointUtils",
], function(
	jQuery,
	three,
	JointUtils
) {
	"use strict";

	QUnit.test("JointUtils.recalculateJoints", function(assert) {
		var done = assert.async();

		var tmpMatrix = new THREE.Matrix4();
		var translation = new THREE.Vector3();
		var quaternion = new THREE.Quaternion();
		var scale = new THREE.Vector3();

		function getJointPQS(nodeMatrix, parentMatrix) {
			tmpMatrix.getInverse(parentMatrix).multiply(nodeMatrix);
			tmpMatrix.decompose(translation, quaternion, scale);
			return {
				translation: translation.toArray(),
				quaternion: quaternion.toArray(),
				scale: scale.toArray()
			};
		}

		function createJoint(node, parent) {
			return Object.assign({ node: node, parent: parent }, getJointPQS(node.matrixWorld, parent.matrixWorld));
		}

		function testArray(a, b, message) {
			a.forEach(function(v, i) {
				assert.ok(Math.abs(v - b[ i ]) < 1e-5, message + " " + i + " (" + v + "=" + b[ i ] + ")");
			});
		};

		function testJoint(joint, nodeMatrix, parentMatrix, message) {
			var pqs = getJointPQS(nodeMatrix, parentMatrix);
			testArray(joint.translation, pqs.translation, message + " translation");
			testArray(joint.quaternion, pqs.quaternion, message + " quaternion");
			testArray(joint.scale, pqs.scale, message + " scale");
		}

		var nodeA = new THREE.Object3D();
		var nodeB = new THREE.Object3D();
		var nodeC = new THREE.Object3D();
		var nodeD = new THREE.Object3D();

		nodeA.position.set(1.23, 2.34, 3.45);
		nodeA.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 3);
		nodeA.scale.setScalar(1.234);
		nodeA.updateMatrixWorld();
		nodeB.position.set(4.56, 5.67, 7.89);
		nodeB.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
		nodeB.scale.setScalar(2.345);
		nodeB.updateMatrixWorld();
		nodeC.position.set(7.123, 8.234, 9.345);
		nodeC.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 5);
		nodeC.scale.setScalar(3.456);
		nodeC.updateMatrixWorld();

		var joints = [
			createJoint(nodeB, nodeA),
			createJoint(nodeD, nodeA),
			createJoint(nodeC, nodeB)
		];

		var matrix = new THREE.Matrix4().compose(translation.set(10, 20, 30), quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 7), scale.setScalar(4.567));
		var t = translation.toArray(), q = quaternion.toArray(), s = scale.toArray();
		var modifiedJoints = JointUtils.recalculateJoints(joints, nodeB, matrix.elements);

		assert.equal(modifiedJoints.length, 2, "modified joints count");
		assert.equal(modifiedJoints[ 0 ], joints[ 0 ], "modified joint[0]");
		assert.equal(modifiedJoints[ 1 ], joints[ 2 ], "modified joint[1]");

		testJoint(modifiedJoints[ 0 ], matrix, nodeA.matrixWorld, "joint[0]");
		testJoint(modifiedJoints[ 1 ], nodeC.matrixWorld, matrix, "joint[1]");

		modifiedJoints = JointUtils.recalculateJoints(joints, nodeB, { translation: t, quaternion: q, scale: s });

		assert.equal(modifiedJoints.length, 2, "modified joints count");
		assert.equal(modifiedJoints[ 0 ], joints[ 0 ], "modified joint[0]");
		assert.equal(modifiedJoints[ 1 ], joints[ 2 ], "modified joint[1]");

		testJoint(modifiedJoints[ 0 ], matrix, nodeA.matrixWorld, "joint[0]");
		testJoint(modifiedJoints[ 1 ], nodeC.matrixWorld, matrix, "joint[1]");

		done();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
