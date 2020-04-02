/*global QUnit*/
sap.ui.define(["sap/gantt/simple/BaseCursor", "sap/ui/core/Core"], function (BaseCursor, Core) {
	"use strict";

	QUnit.test("default values", function (assert) {
		var oShape = new BaseCursor();
		assert.strictEqual(oShape.getLength(), 10, "Default length is 10");
		assert.strictEqual(oShape.getWidth(), 5, "Default width is 5");
		assert.strictEqual(oShape.getPointHeight(), 5, "Default pointHeight is 5");
	});

	QUnit.test("getD", function (assert) {
		var oShape = new BaseCursor({
			length:20,
			width: 15,
			pointHeight: 15,
			x: 0,
			rowYCenter: 10
		});
		var sPath;

		Core.getConfiguration().setRTL(true);
		sPath = "M 0 10 m -10 -15 l 20 0 l 0 15 l -10 15 l -10 -15 z";
		assert.strictEqual(oShape.getD(), sPath, "In RTL mode, the return value is '" + sPath + "'");

		Core.getConfiguration().setRTL(false);
		sPath = "M 0 10 m -10 -15 l 20 0 l 0 15 l -10 15 l -10 -15 z";
		assert.strictEqual(oShape.getD(), sPath, "In non RTL mode, the return value is '" + sPath + "'");
	});
});
