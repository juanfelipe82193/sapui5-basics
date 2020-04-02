/**
 * tests for the sap.suite.ui.generic.template.changeHandler.AddHeaderActionButton
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/AddHeaderActionButton"
],
function(AddHeaderActionButton) {
	"use strict";

	QUnit.module("AddHeaderActionButton revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = AddHeaderActionButton.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for AddHeaderActionButton action");
	});
});