/**
 * tests for the sap.suite.ui.generic.template.changeHandler.AddToolbarActionButton
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/AddToolbarActionButton"
],
function(AddToolbarActionButton) {
	"use strict";

	QUnit.module("AddToolbarActionButton revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = AddToolbarActionButton.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for AddToolbarActionButton action");
	});
})