sap.ui.define([
], function(
) {
	"use strict";

	var GlMatrixUtils = function() {};

	GlMatrixUtils.AT = (typeof Float32Array === "undefined") ? Array : Float32Array;

	GlMatrixUtils.vec3 = {
		fromValues: function(x, y, z) {
			var out = new GlMatrixUtils.AT(3);
			out[0] = x;
			out[1] = y;
			out[2] = z;
			return out;
		}
	};

	GlMatrixUtils.quat = {
		setAxisAngle: function(out, axis, rad) {
			rad = rad * 0.5;
			var s = Math.sin(rad);
			out[0] = s * axis[0];
			out[1] = s * axis[1];
			out[2] = s * axis[2];
			out[3] = Math.cos(rad);
			return out;
		},

		fromValues: function(x, y, z, w) {
			var out = new GlMatrixUtils.AT(4);
			out[0] = x;
			out[1] = y;
			out[2] = z;
			out[3] = w;
			return out;
		},

		lerp: function(out, a, b, t) {
			var ax = a[0];
			var ay = a[1];
			var az = a[2];
			var aw = a[3];
			out[0] = ax + t * (b[0] - ax);
			out[1] = ay + t * (b[1] - ay);
			out[2] = az + t * (b[2] - az);
			out[3] = aw + t * (b[3] - aw);
			return out;
		},

		create: function() {
			var out = new GlMatrixUtils.AT(4);
			if (GlMatrixUtils.AT !== Float32Array) {
				out[0] = 0;
				out[1] = 0;
				out[2] = 0;
			}
			out[3] = 1;
			return out;
		}
	};

	return GlMatrixUtils;
});