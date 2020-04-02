/*global QUnit */
sap.ui.define(
	["sap/ui/generic/app/util/DraftUtil"],
	function(DraftUtil) {
		"use strict";

		QUnit.module("sap.ui.generic.app.util.ModelUtil", {
			beforeEach: function() {
				this.oUtil = new DraftUtil();
			},
			afterEach: function() {
				this.oUtil.destroy();
			}
		});

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(this.oUtil);
		});

		QUnit.test("isActiveEntity", function(assert) {
			assert.ok(!this.oUtil.isActiveEntity({}));
		});

		QUnit.test("hasDraftEntity", function(assert) {
			assert.ok(!this.oUtil.hasDraftEntity({}));
		});

		QUnit.test("hasActiveEntity", function(assert) {
			assert.ok(!this.oUtil.hasActiveEntity({}));
		});

		QUnit.test("Shall be destructible", function(assert) {
			this.oUtil.destroy();
			assert.ok(this.oUtil);
		});
	}
);