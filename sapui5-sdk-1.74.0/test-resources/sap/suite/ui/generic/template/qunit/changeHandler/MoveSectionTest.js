/**
 * tests for the sap.suite.ui.generic.template.changeHandler.MoveSection
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/MoveSection"
],
function(MoveSection) {
	"use strict";

	QUnit.module("MoveSection revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = MoveSection.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for MoveSection action");
	});
})