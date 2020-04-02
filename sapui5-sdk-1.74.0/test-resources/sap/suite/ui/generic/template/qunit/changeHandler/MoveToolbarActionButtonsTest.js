/**
 * tests for the sap.suite.ui.generic.template.changeHandler.MoveToolbarActionButtons
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/MoveToolbarActionButtons"
],
function(MoveToolbarActionButtons) {
	"use strict";

	QUnit.module("MoveToolbarActionButtons revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = MoveToolbarActionButtons.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for MoveToolbarActionButtons action");
	});
})