/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RemoveGroup
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/RemoveGroup"
],
function(RemoveGroup) {
	"use strict";

	QUnit.module("RemoveGroup revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = RemoveGroup.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RemoveGroup action");
	});
})