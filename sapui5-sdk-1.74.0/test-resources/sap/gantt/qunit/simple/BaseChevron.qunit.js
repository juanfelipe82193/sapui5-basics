/*global QUnit */
sap.ui.define(["sap/gantt/simple/BaseChevron", "sap/ui/core/Core"], function (BaseChevron, Core) {
	"use strict";

	QUnit.module("Property", {
		beforeEach: function () {
			this.oChevron = new BaseChevron();
		},
		afterEach: function () {
			this.oChevron = null;
		}
	});

	QUnit.test("default values", function (assert) {
		assert.strictEqual(this.oChevron.getHeadWidth(), 10, "Default headWidth is 10");
		assert.strictEqual(this.oChevron.getTailWidth(), 10, "Default tailWidth is 10");
	});

	QUnit.module("Function", {
		beforeEach: function () {
			this.oChevron = new BaseChevron({
				x: 0,
				y: 0,
				width: 100,
				height: 20,
				headWidth: 20,
				tailWidth: 10,
				rowYCenter: 10
			});
		},
		afterEach: function () {
			this.oChevron = null;
		}
	});

	QUnit.test("getD", function (assert) {
		var sPath;

		Core.getConfiguration().setRTL(true);
		sPath = "M 0 10 l 20 -10 h 80 l -10 10 l 10 10 h -80 Z";
		assert.strictEqual(this.oChevron.getD(), sPath, "In RTL mode, the return value is '" + sPath + "'");

		Core.getConfiguration().setRTL(false);
		sPath = "M 10 10 l -10 -10 h 80 l 20 10 l -20 10 h -80 Z";
		assert.strictEqual(this.oChevron.getD(), sPath, "In non RTL mode, the return value is '" + sPath + "'");
	});

});
