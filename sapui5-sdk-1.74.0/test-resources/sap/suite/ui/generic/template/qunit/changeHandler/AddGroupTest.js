/**
 * tests for the sap.suite.ui.generic.template.changeHandler.AddGroup
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/AddGroup"
],
function(AddGroup) {
	"use strict";

	QUnit.module("AddGroup revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = AddGroup.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for AddGroup action");
	});
});