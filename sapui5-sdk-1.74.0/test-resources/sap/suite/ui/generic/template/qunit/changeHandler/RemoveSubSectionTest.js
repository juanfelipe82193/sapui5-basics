/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RemoveSubSection
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/RemoveSubSection"
],
function(RemoveSubSection) {
	"use strict";

	QUnit.module("RemoveSubSection revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = RemoveSubSection.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RemoveSubSection action");
	});
})