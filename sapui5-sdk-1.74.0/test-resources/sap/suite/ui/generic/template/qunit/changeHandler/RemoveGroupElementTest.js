/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RemoveGroupElement
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/RemoveGroupElement"
],
function(RemoveGroupElement) {
	"use strict";

	QUnit.module("RemoveGroupElement revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = RemoveGroupElement.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RemoveGroupElement action");
	});
})