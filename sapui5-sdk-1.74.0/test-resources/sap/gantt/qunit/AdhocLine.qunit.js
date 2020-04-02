/*global QUnit */
sap.ui.define([
	"sap/gantt/AdhocLine"
], function (AdhocLine) {
	"use strict";

	QUnit.module("Create AdhocLine with default values.", {
		beforeEach: function () {
			this.oAdhocLine = new AdhocLine();
		},
		afterEach: function () {
			this.oAdhocLine.destroy();
			this.oAdhocLine = undefined;
		}
	});

	QUnit.test("Test default configuration values." , function (assert) {
		assert.strictEqual(this.oAdhocLine.getStroke(), undefined);
		assert.strictEqual(this.oAdhocLine.getStrokeWidth(), 1);
		assert.strictEqual(this.oAdhocLine.getStrokeDasharray(), undefined);
		assert.strictEqual(this.oAdhocLine.getStrokeOpacity(), 1);
		assert.strictEqual(this.oAdhocLine.getTimeStamp(), undefined);
		assert.strictEqual(this.oAdhocLine.getDescription(), undefined);
	});

	QUnit.module("Create config.Mode with customized values.", {
		beforeEach: function () {
			this.oAdhocLine = new AdhocLine({
				stroke: "#DC143C",
				strokeWidth: 2,
				strokeDasharray: "5,5",
				strokeOpacity: 0.5,
				timeStamp: "20170315000000",
				description: "Product Release."
			});
		},
		afterEach: function () {
			this.oAdhocLine.destroy();
			this.oAdhocLine = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oAdhocLine.getStroke(), "#DC143C");
		assert.strictEqual(this.oAdhocLine.getStrokeWidth(), 2);
		assert.strictEqual(this.oAdhocLine.getStrokeDasharray(), "5,5");
		assert.strictEqual(this.oAdhocLine.getStrokeOpacity(), 0.5);
		assert.strictEqual(this.oAdhocLine.getTimeStamp(), "20170315000000");
		assert.strictEqual(this.oAdhocLine.getDescription(), "Product Release.");
	});
});
