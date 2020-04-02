/*global QUnit */
sap.ui.define([
	"sap/gantt/config/Shape"
], function (Shape) {
	"use strict";

	QUnit.module("Create config.Shape with default values.", {
		beforeEach: function () {
			this.oConfig = new Shape();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "");
		assert.strictEqual(this.oConfig.getShapeClassName(), "");
		assert.strictEqual(this.oConfig.getShapeDataName(), "");
		assert.deepEqual(this.oConfig.getModeKeys(), []);
		assert.strictEqual(this.oConfig.getLevel(), "");
		assert.deepEqual(this.oConfig.getShapeProperties(), {});
		assert.strictEqual(this.oConfig.getGroupAggregation(), undefined);
		assert.strictEqual(this.oConfig.getClippathAggregation(), undefined);
		assert.strictEqual(this.oConfig.getSelectedClassName(), "");
	});

	QUnit.module("Create config.Shape with customized values.", {
		beforeEach: function () {
			this.oShapeProperties = { enableDnD: false, Width: 100 };
			this.groupAggregation = new Shape("Class1");
			this.oConfig = new Shape({
				key: "Shape",
				shapeClassName: "ShapeClass",
				shapeDataName: "ShapeData",
				modeKeys: ["A", "D"],
				level: "1",
				shapeProperties: this.oShapeProperties,
				groupAggregation: [this.groupAggregation],
				clippathAggregation: [["Class3"], ["Class4", ["Class5"]]],
				selectedClassName: "DrawSelection"
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "Shape");
		assert.strictEqual(this.oConfig.getShapeClassName(), "ShapeClass");
		assert.strictEqual(this.oConfig.getShapeDataName(), "ShapeData");
		assert.deepEqual(this.oConfig.getModeKeys(), ["A", "D"]);
		assert.strictEqual(this.oConfig.getLevel(), "1");
		assert.strictEqual(this.oConfig.getShapeProperties(), this.oShapeProperties);
		assert.deepEqual(this.oConfig.getGroupAggregation(), [this.groupAggregation]);
		assert.deepEqual(this.oConfig.getClippathAggregation(), [["Class3"], ["Class4", ["Class5"]]]);
		assert.strictEqual(this.oConfig.getSelectedClassName(), "DrawSelection");
		assert.strictEqual(this.oConfig.getShapeProperty("Width"), 100);
		assert.strictEqual(this.oConfig.hasShapeProperty("enableDnD"), true);
	});
});
