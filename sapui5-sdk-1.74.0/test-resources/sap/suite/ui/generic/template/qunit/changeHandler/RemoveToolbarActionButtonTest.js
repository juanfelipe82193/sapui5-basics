/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RemoveToolbarActionButton
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/RemoveToolbarActionButton"
],
function(RemoveToolbarActionButton) {
	"use strict";

	QUnit.module("RemoveToolbarActionButton revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = RemoveToolbarActionButton.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RemoveToolbarActionButton action");
	});
})