/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RemoveHeaderAndFooterActionButton
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/RemoveHeaderAndFooterActionButton"
],
function(RemoveHeaderAndFooterActionButton) {
	"use strict";

	QUnit.module("RemoveHeaderAndFooterActionButton revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = RemoveHeaderAndFooterActionButton.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RemoveHeaderAndFooterActionButton action");
	});
})