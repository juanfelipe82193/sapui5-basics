/* global QUnit*/

sap.ui.define([
	"sap/ui/vk/thirdparty/GlMatrixUtils"
], function(
	glMatrix
) {
	"use strict";

	QUnit.test("Test GlMatrixUtils", function(assert) {
		var value  = [ 0.1, 0.2, 0.3, 0.4 ];
		var glmVec3 = glMatrix.vec3.fromValues(value[0], value[1], value[2]);
		assert.ok(glmVec3[0].toFixed(1) === "0.1" && glmVec3[1].toFixed(1) === "0.2" && glmVec3[2].toFixed(1) === "0.3", "glm matrix vec3.fromValues() correct");

		var glMatrixQuat = glMatrix.quat.create();
		assert.ok(glMatrixQuat.toString() === "0,0,0,1", "glm matrix quat.create() correct");

		var glMatrixQuat2 = glMatrix.quat.setAxisAngle(glMatrixQuat, glmVec3, Math.PI / 2);
		assert.ok(glMatrixQuat2[0].toFixed(2) === "0.07" && glMatrixQuat2[1].toFixed(2) === "0.14" && glMatrixQuat2[2].toFixed(2) === "0.21" && glMatrixQuat2[3].toFixed(3) === "0.707", "glm matrix quat.setAxisAngle() correct");

		var q = glMatrix.quat.fromValues(value[0], value[1], value[2], value[3]);
		assert.ok(q[0].toFixed(1) === "0.1" && q[1].toFixed(1) === "0.2" && q[2].toFixed(1) === "0.3" && q[3].toFixed(1) === "0.4", "glm matrix quat.fromValues() correct");

		var q3 = glMatrix.quat.lerp(glMatrixQuat, glMatrixQuat2, q, 0.5);
		assert.ok(q3[0].toFixed(3) === "0.085" && q3[1].toFixed(3) === "0.171" && q3[2].toFixed(3) === "0.256" && q3[3].toFixed(3) === "0.554", "glm matrix quat.lerp() correct");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});