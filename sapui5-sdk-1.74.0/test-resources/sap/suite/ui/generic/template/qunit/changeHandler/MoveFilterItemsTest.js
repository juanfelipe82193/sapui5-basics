/**
 * tests for the sap.suite.ui.generic.template.changeHandler.MoveFilterItems
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/MoveFilterItems"
],
function(MoveFilterItems) {
	"use strict";

	QUnit.module("MoveFilterItems revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = MoveFilterItems.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for MoveFilterItems action");
	});
})