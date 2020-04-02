/*global QUnit*/

sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/simple/BaseRectangle"
], function (Core, BaseRectangle) {
	"use strict";

	//BaseLine uses the delegator of BaseRectangle
	BaseRectangle.prototype.getWidth = function () {
		return 0;
	};
	BaseRectangle.prototype.getX = function () {
		return 0;
	};

	QUnit.module("Customized Mode", {
		beforeEach: function () {
			this.oShape = new sap.gantt.simple.BaseLine({
				shapeId: "{Id}",
				x1: 100,
				y1: 100,
				x2: 200,
				y2: 100,
				stroke: "red",
				strokeWidth: 3
			});
		},
		afterEach: function () {
			this.oShape = undefined;
		}
	});

	QUnit.test("Function", function (assert) {
		assert.ok(this.oShape != null, "Shape instance is found");
		assert.strictEqual(this.oShape.getX1(), 100);
		assert.strictEqual(this.oShape.getY1(), 100);
		assert.strictEqual(this.oShape.getX2(), 200);
		assert.strictEqual(this.oShape.getY2(), 100);
		assert.strictEqual(this.oShape.getStroke(), "red");
		assert.strictEqual(this.oShape.getStrokeWidth(), 3);
	});

	QUnit.test("Rendering", function (assert) {
		var oRm = Core.createRenderManager();
		this.oShape.renderElement(oRm, this.oShape);
		oRm.flush(jQuery.sap.domById("qunit-fixture"));
		oRm.destroy();
		assert.ok(jQuery('#qunit-fixture').find("line").length === 1, "Rendering base line is OK");
	});
});
