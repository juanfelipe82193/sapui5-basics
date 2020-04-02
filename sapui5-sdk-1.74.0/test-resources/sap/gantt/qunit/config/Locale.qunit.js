/*global QUnit */
sap.ui.define([
	"sap/gantt/config/Locale",
	"sap/gantt/config/TimeHorizon"
], function (Locale, TimeHorizon) {
	"use strict";

	QUnit.module("Create config.Locale with default values.", {
		beforeEach: function () {
			this.oConfig = new Locale();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getTimeZone(), "UTC");
		assert.strictEqual(this.oConfig.getUtcdiff(), "000000");
		assert.strictEqual(this.oConfig.getUtcsign(), "+");
		assert.deepEqual(this.oConfig.getDstHorizons(), []);
	});

	QUnit.module("Create config.Locale with customized values.", {
		beforeEach: function () {
			this.dstHorizons = [new TimeHorizon({
				startTime: "20150401000000",
				endTime: "20151024000000"
			}), new TimeHorizon({
				startTime: "20140402000000",
				endTime: "20141031000000"
			})
			];
			this.oConfig = new Locale({
				timeZone: "UST",
				utcdiff: "000010",
				utcsign: "-",
				dstHorizons: this.dstHorizons
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getTimeZone(), "UST");
		assert.strictEqual(this.oConfig.getUtcdiff(), "000010");
		assert.strictEqual(this.oConfig.getUtcsign(), "-");
		assert.deepEqual(this.oConfig.getDstHorizons(), this.dstHorizons);
	});
});
