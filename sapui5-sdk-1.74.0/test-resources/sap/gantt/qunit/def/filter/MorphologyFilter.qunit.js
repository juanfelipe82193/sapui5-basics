/*global QUnit */
sap.ui.define([
	"sap/gantt/def/filter/MorphologyFilter"
], function (MorphologyFilter) {
	"use strict";

	QUnit.module("Create MorphologyFilter.", {
		beforeEach: function () {
			this.morphologyFilterA = new MorphologyFilter("psmorphologyFilterA", {
			});
			this.morphologyFilterB = new MorphologyFilter("psmorphologyFilterB", {
				radius: "3,1"
			});
		},
		afterEach: function () {
			this.morphologyFilterA = undefined;
			this.morphologyFilterB = undefined;
		}
	});


	QUnit.test("MorphologyFilter methods.", function (assert) {
		assert.ok(this.morphologyFilterA.getDefString().length > 5, "MorphologyFilterA  getDefString length succeeds");
		assert.equal(this.morphologyFilterA.getId(), "psmorphologyFilterA", "MorphologyFilterA  getId succeeds");
		assert.equal(this.morphologyFilterA.getRefString(), "url(#psmorphologyFilterA)", "MorphologyFilterA getRefString succeeds");

		assert.ok(this.morphologyFilterB.getDefString().length > 5, "morphologyFilterB  getDefString length succeeds");
		assert.equal(this.morphologyFilterB.getId(), "psmorphologyFilterB", "morphologyFilterB  getId succeeds");
		assert.equal(this.morphologyFilterB.getRefString(), "url(#psmorphologyFilterB)", "morphologyFilterB getRefString succeeds");
	});
});
