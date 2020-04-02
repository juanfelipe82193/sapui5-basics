/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/navpopover/Log"

], function(Log){
	"use strict";

	QUnit.module("sap.ui.comp.navpopover.Log: API", {
		beforeEach: function () {
			this.oLog = new Log();
		},
		afterEach: function () {
			this.oLog.destroy();
		}
	});

	QUnit.test("Constructor", function (assert) {
		assert.ok(this.oLog);
	});

	QUnit.module("sap.ui.comp.navpopover.Log", {
		beforeEach: function () {
			this.oLog = new Log();
		},
		afterEach: function () {
			this.oLog.destroy();
		}
	});

	QUnit.test("getFormattedText", function (assert) {
		assert.equal(this.oLog.getFormattedText(), "");
	});

	QUnit.start();
});