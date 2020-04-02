/*global QUnit */
sap.ui.define([
	"sap/gantt/config/TimeHorizon"
], function (TimeHorizon) {
	"use strict";

	QUnit.module("Create config.TimeHorizon with default values.", {
		beforeEach: function () {
			this.oConfig = new TimeHorizon();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});


	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getStartTime(), undefined);
		assert.strictEqual(this.oConfig.getEndTime(), undefined);
	});

	QUnit.module("Create config.TimeHorizon with string Timestamps.", {
		beforeEach: function () {
			this.oConfig = new TimeHorizon({
				startTime: "20151201000000",
				endTime: "20151231000000"
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});


	QUnit.test("Test timestamp values.", function (assert) {
		assert.strictEqual(this.oConfig.getStartTime(), "20151201000000");
		assert.strictEqual(this.oConfig.getEndTime(), "20151231000000");
	});

	QUnit.module("Create config.TimeHorizon with Date Object.", {
		beforeEach: function () {
			this.oConfig = new TimeHorizon({
				startTime: new Date(2015, 0, 1, 12, 12, 12),
				endTime: new Date(2015, 0, 31, 12, 12, 12)
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});


	QUnit.test("Test timestamp values.", function (assert) {
		assert.strictEqual(this.oConfig.getStartTime(), "20150101121212");
		assert.strictEqual(this.oConfig.getEndTime(), "20150131121212");
	});
});
