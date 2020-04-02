/**
 * tests for the sap.suite.ui.generic.template.changeHandler.MoveHeaderAndFooterActionButton
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/MoveHeaderAndFooterActionButton"
],
function(MoveHeaderAndFooterActionButton) {
	"use strict";

	QUnit.module("MoveHeaderAndFooterActionButton revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = MoveHeaderAndFooterActionButton.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for MoveHeaderAndFooterActionButton action");
	});
})