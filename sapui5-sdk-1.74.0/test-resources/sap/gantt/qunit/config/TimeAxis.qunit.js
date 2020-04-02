/*global QUnit */
sap.ui.define([
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/config/TimeAxis"
], function (TimeHorizon, TimeAxis) {
	"use strict";

	QUnit.module("Create config.TimeAxis with default values.", {
		beforeEach: function () {
			this.oConfig = new TimeAxis();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});


	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getPlanHorizon(), sap.gantt.config.DEFAULT_PLAN_HORIZON);
		assert.strictEqual(this.oConfig.getInitHorizon(), sap.gantt.config.DEFAULT_INIT_HORIZON);
		assert.strictEqual(this.oConfig.getZoomStrategy(), sap.gantt.config.DEFAULT_TIME_ZOOM_STRATEGY);
		assert.strictEqual(this.oConfig.getGranularity(), "4day");
		assert.strictEqual(this.oConfig.getFinestGranularity(), "5min");
		assert.strictEqual(this.oConfig.getCoarsestGranularity(), "1month");
		assert.strictEqual(this.oConfig.getRate(), 1);
	});

	QUnit.module("Create config.TimeAxis with customed values.", {
		beforeEach: function () {
			this.oPlanHorizon = new TimeHorizon({
				startTime: "20150101010101",
				endTime: "20151212121212"
			});
			this.oInitHorizon = new TimeHorizon({
				startTime: "20150501010101",
				endTime: "20150612121212"
			});
			this.oZoomStrategy = {
				abc: {},
				def: {},
				ghi: {}
			};
			this.oConfig = new TimeAxis({
				planHorizon: this.oPlanHorizon,
				initHorizon: this.oInitHorizon,
				zoomStrategy: this.oZoomStrategy,
				granularity: "def",
				finestGranularity: "abc",
				coarsestGranularity: "ghi",
				rate: 10
			});
		},
		afterEach: function () {
			this.oPlanHorizon.destroy();
			this.oPlanHorizon = undefined;
			this.oInitHorizon.destroy();
			this.oInitHorizon = undefined;
			this.oZoomStrategy = undefined;
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});


	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getPlanHorizon(), this.oPlanHorizon);
		assert.strictEqual(this.oConfig.getInitHorizon(), this.oInitHorizon);
		assert.strictEqual(this.oConfig.getZoomStrategy(), this.oZoomStrategy);
		assert.strictEqual(this.oConfig.getGranularity(), "def");
		assert.strictEqual(this.oConfig.getFinestGranularity(), "abc");
		assert.strictEqual(this.oConfig.getCoarsestGranularity(), "ghi");
		assert.strictEqual(this.oConfig.getRate(), 10);
	});
});
