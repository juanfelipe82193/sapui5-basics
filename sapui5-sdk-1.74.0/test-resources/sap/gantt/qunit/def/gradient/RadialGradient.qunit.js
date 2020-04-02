/*global QUnit */
sap.ui.define([
	"sap/gantt/def/gradient/RadialGradient",
	"sap/gantt/def/gradient/Stop"
], function (RadialGradient, Stop) {
	"use strict";

	QUnit.module("Create RadialGradient.", {
		beforeEach: function () {
			this.radialGradientA = new RadialGradient("radialGradientA", {
				stops: [new Stop({
					offSet: 0,
					stopColor: "#1DA9C1"
				}), new Stop("gradient_movingstops", {
					offSet: 0.5,
					stopColor: "#FFC700"
				}), new Stop({
					offSet: 1,
					stopColor: "#1DA9C1"
				})]
			});
			this.radialGradientB = new RadialGradient("radialGradientB", {
			});
		},
		afterEach: function () {
			this.radialGradientA = undefined;
			this.radialGradientB = undefined;
		}
	});

	QUnit.test("radialGradient methods.", function (assert) {
		assert.ok(this.radialGradientA.getStops().length = 3, "radialGradientA  getStops length succeeds");
		assert.equal(this.radialGradientA.getId(), "radialGradientA", "radialGradientA  getId succeeds");
		assert.equal(this.radialGradientA.getRefString(), "url(#radialGradientA)", "radialGradientA getRefString succeeds");

		assert.ok(this.radialGradientB.getStops().length = 3, "radialGradientB  getStops length succeeds");
		assert.equal(this.radialGradientB.getId(), "radialGradientB", "radialGradientB  getId succeeds");
		assert.equal(this.radialGradientB.getRefString(), "url(#radialGradientB)", "radialGradientB getRefString succeeds");
	});
});
