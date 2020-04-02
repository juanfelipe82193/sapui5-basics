/**
 * tests for the sap.suite.ui.generic.template.changeHandler.AddFooterActionButton
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/AddFooterActionButton"
],
function(AddFooterActionButton) {
	"use strict";

	QUnit.module("AddFooterActionButton revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = AddFooterActionButton.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for AddFooterActionButton action");
	});
});