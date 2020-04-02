/**
 * tests for the sap.suite.ui.generic.template.changeHandler.AddSubSection
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/AddSubSection"
],
function(AddSubSection) {
	"use strict";

	QUnit.module("AddSubSection revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = AddSubSection.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for AddSubSection action");
	});
})