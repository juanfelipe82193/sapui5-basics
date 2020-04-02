/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RemoveSection
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/RemoveSection"
],
function(RemoveSection) {
	"use strict";

	QUnit.module("RemoveSection revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = RemoveSection.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RemoveSection action");
	});
})