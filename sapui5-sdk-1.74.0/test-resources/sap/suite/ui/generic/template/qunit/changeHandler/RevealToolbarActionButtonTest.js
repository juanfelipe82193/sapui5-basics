/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RevealToolbarActionButton
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/RevealToolbarActionButton"
],
function(RevealToolbarActionButton) {
	"use strict";

	QUnit.module("RevealToolbarActionButton revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = RevealToolbarActionButton.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RevealToolbarActionButton action");
	});
})