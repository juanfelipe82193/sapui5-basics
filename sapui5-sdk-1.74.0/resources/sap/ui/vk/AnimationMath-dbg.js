
sap.ui.define([
	"./thirdparty/GlMatrixUtils",
	"./AnimationTrackValueType"
], function(
	glMatrix,
	AnimationTrackValueType
) {
	"use strict";

	var AnimationMath = { };

	AnimationMath.neutralAngleAxisToGlMatrixQuat = function(value) {
		return glMatrix.quat.setAxisAngle(glMatrix.quat.create(), glMatrix.vec3.fromValues(value[0], value[1], value[2]), value[3]);
	};

	AnimationMath.neutralEulerToGlMatrixQuat = function(value) {
		var axis0 = value[3] & 3;
		var axis1 = (value[3] >> 2) & 3;
		var axis2 = (value[3] >> 4) & 3;

		var heading = value[axis0];
		var attitude = value[axis1];
		var bank = value[axis2];

		var c1 = Math.cos(heading / 2);
		var s1 = Math.sin(heading / 2);
		var c2 = Math.cos(attitude / 2);
		var s2 = Math.sin(attitude / 2);
		var c3 = Math.cos(bank / 2);
		var s3 = Math.sin(bank / 2);

		var x = s1 * c2 * c3 - c1 * s2 * s3;
		var y = c1 * s2 * c3 + s1 * c2 * s3;
		var z = c1 * c2 * s3 - s1 * s2 * c3;
		var w = c1 * c2 * c3 + s1 * s2 * s3;
		var gq = glMatrix.quat.fromValues(x, y, z, w);

		return gq;
	};

	AnimationMath.neutralQuatToGlMatrixQuat = function(value) {
		return glMatrix.quat.fromValues(value[0], value[1], value[2], value[3]);
	};

	AnimationMath.glMatrixQuatToNeutral = function(value) {
		return [ value[0], value[1], value[2], value[3] ];
	};

	// TODO: introduce interpolation type parameter (a function, maybe?)
	// will always return rotation as Quaternion, regardless of input format
	AnimationMath.interpolate = function(valueType, keyBefore, keyAfter, k, track) {
		var valueBefore = keyBefore.value;
		var valueAfter = keyAfter.value;
		var result;
		var q1;
		var q2;
		var q;

		switch (valueType) {

			case AnimationTrackValueType.Quaternion:
				q1 = AnimationMath.neutralQuatToGlMatrixQuat(valueBefore);
				q2 = AnimationMath.neutralQuatToGlMatrixQuat(valueAfter);
				q = glMatrix.quat.lerp(glMatrix.quat.create(), q1, q2, k);
				result = AnimationMath.glMatrixQuatToNeutral(q);
				break;
			case AnimationTrackValueType.Euler:
				var r = [
					AnimationMath.interpolateScalarLinear(valueBefore[0], valueAfter[0], k),
					AnimationMath.interpolateScalarLinear(valueBefore[1], valueAfter[1], k),
					AnimationMath.interpolateScalarLinear(valueBefore[2], valueAfter[2], k),
					valueBefore[3]
				];
				q = AnimationMath.neutralEulerToGlMatrixQuat(r);
				result = AnimationMath.glMatrixQuatToNeutral(q);
				break;
			case AnimationTrackValueType.AngleAxis:
				// don't use quaternions here

				result = [];

				// axis
/*
				// check if both axises are codirectional
				var mod1 = valueBefore[0] * valueBefore[0] + valueBefore[1] * valueBefore[1] + valueBefore[2] * valueBefore[2];
				var mod2 = valueAfter[0] * valueAfter[0] + valueAfter[1] * valueAfter[1] + valueAfter[2] * valueAfter[2];
				var dot  = valueBefore[0] * valueAfter[0] + valueBefore[1] * valueAfter[1] + valueBefore[2] * valueAfter[2];
				if (Math.abs(mod1 * mod2 - dot * dot) < 0.0001) {
					// codirectional
					if (k < 0.5) {
						result.push(valueBefore[0], valueBefore[1], valueBefore[2]);
					} else {
						result.push(valueAfter[0], valueAfter[1], valueAfter[2]);
					}
				} else {
					result.push(
						linearScalar(valueBefore[0], valueAfter[0], k),
						linearScalar(valueBefore[1], valueAfter[1], k),
						linearScalar(valueBefore[2], valueAfter[2], k)
					);
				}
*/
				// result.push(valueAfter[0], valueAfter[1], valueAfter[2]);

				// angle
				// result.push(linearScalar(valueBefore[3], valueAfter[3], k));

				// var m = glMatrix.mat4.create();
/*
				var m = glMatrix.mat4.fromRotation(glMatrix.mat4.create(), valueBefore[3], glMatrix.vec3.fromValues(valueBefore[0], valueBefore[1], valueBefore[2]));
				if (k > 0) {
					m = glMatrix.mat4.rotate(glMatrix.mat4.create(), m, valueAfter[3] * k, glMatrix.vec3.fromValues(valueAfter[0], valueAfter[1], valueAfter[2]));
				}
				result = glMatrix.mat4.getRotation(glMatrix.quat.create(), m);
				// to neutral quaternion
				// result = neutralAngleAxisToGlMatrixQuat(result);
				result = glMatrixQuatToNeutral(result);
*/

				// TODO: use glMatrix instead of THREE
				var rm1 = new THREE.Matrix4();
				var angle;
				var axis;
				var tempRm;
				var x;
				var y;
				var z;
				for (var idx = 0; idx < track.getKeysCount(); idx++) {
					var key = track.getKey(idx);
					x = key.value[0];
					y = key.value[1];
					z = key.value[2];
					angle = key.value[3];

					axis = new THREE.Vector3(x, y, z);
					tempRm = new THREE.Matrix4();
					tempRm.makeRotationAxis(axis, angle);
					rm1.premultiply(tempRm);

					if (key === keyBefore) {
						break;
					}
				}

				x = valueAfter[0];
				y = valueAfter[1];
				z = valueAfter[2];
				angle = valueAfter[3] * k;

				axis = new THREE.Vector3(x, y, z);
				var rm2 = new THREE.Matrix4();
				rm2.makeRotationAxis(axis, angle);

				rm2.multiply(rm1);

				var quat = new THREE.Quaternion().setFromRotationMatrix(rm2);
				result = quat.toArray();

				break;
			case AnimationTrackValueType.Vector3:
				result = [];
				result.push(
					AnimationMath.interpolateScalarLinear(valueBefore[0], valueAfter[0], k),
					AnimationMath.interpolateScalarLinear(valueBefore[1], valueAfter[1], k),
					AnimationMath.interpolateScalarLinear(valueBefore[2], valueAfter[2], k)
				);
			break;

			default:
				// scalar
				result = AnimationMath.interpolateScalarLinear(valueBefore, valueAfter, k);
		}

		return result;
	};

	AnimationMath.interpolateScalarLinear = function(value1, value2, k) {
		return value1 + k * (value2 - value1);
	};

	return AnimationMath;
});
