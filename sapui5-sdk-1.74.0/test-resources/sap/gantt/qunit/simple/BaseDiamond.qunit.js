/*global QUnit */
sap.ui.define(["sap/gantt/simple/BaseDiamond", "sap/ui/core/Core"], function (BaseDiamond, Core) {
	"use strict";

	QUnit.module("Property", {
		beforeEach: function () {
			this.oDiamond = new BaseDiamond();
		},
		afterEach: function () {
			this.oDiamond = null;
		}
	});

	QUnit.module("Function", {
		beforeEach: function () {
			this.oDiamond = new BaseDiamond({
				x: 0,
				y: 0,
				width: 30,
				height: 20,
				rowYCenter: 10
			});
		},
		afterEach: function () {
			this.oDiamond = null;
		}
	});

	QUnit.test("getD", function (assert) {
		var sPath;

		Core.getConfiguration().setRTL(true);
		sPath = "M 0 0 l 15 10 l -15 10 l -15 -10 Z";
		assert.strictEqual(this.oDiamond.getD(), sPath, "In RTL mode, the return value is '" + sPath + "'");

		Core.getConfiguration().setRTL(false);
		sPath = "M 0 0 l 15 10 l -15 10 l -15 -10 Z";
		assert.strictEqual(this.oDiamond.getD(), sPath, "In non RTL mode, the return value is '" + sPath + "'");
	});
});
