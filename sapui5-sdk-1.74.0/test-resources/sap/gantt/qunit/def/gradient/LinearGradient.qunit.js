/*global QUnit */
sap.ui.define([
	"sap/gantt/def/gradient/LinearGradient",
	"sap/gantt/def/gradient/Stop"
], function (LinearGradient, Stop) {
	"use strict";

	QUnit.module("Create LinearGradient.", {
		beforeEach: function () {
			this.linearGradientA = new LinearGradient("linearGradientA", {
				x1: 0,
				x2: 0,
				y1: 0,
				y2: 1,
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
			this.linearGradientB = new LinearGradient("linearGradientB", {
			});
		},
		afterEach: function () {
			this.linearGradientA = undefined;
			this.linearGradientB = undefined;
		}
	});


	QUnit.test("LinearGradient methods.", function (assert) {
		assert.ok(this.linearGradientA.getDefString().length > 5, "linearGradientA  getDefString length succeeds");
		assert.ok(this.linearGradientA.getStops().length = 3, "linearGradientA  getStops length succeeds");
		assert.equal(this.linearGradientA.getId(), "linearGradientA", "linearGradientA  getId succeeds");
		assert.equal(this.linearGradientA.getRefString(), "url(#linearGradientA)", "linearGradientA getRefString succeeds");

		assert.ok(this.linearGradientB.getDefString().length > 5, "linearGradientB  getDefString length succeeds");
		assert.ok(this.linearGradientB.getStops().length = 3, "linearGradientB  getStops length succeeds");
		assert.equal(this.linearGradientB.getId(), "linearGradientB", "linearGradientB  getId succeeds");
		assert.equal(this.linearGradientB.getRefString(), "url(#linearGradientB)", "linearGradientB getRefString succeeds");
	});
});
