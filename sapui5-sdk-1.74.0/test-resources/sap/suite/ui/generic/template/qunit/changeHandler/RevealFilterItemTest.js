/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RevealFilterItem
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/RevealFilterItem"
],
function(RevealFilterItem) {
	"use strict";

	QUnit.module("RevealFilterItem revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = RevealFilterItem.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RevealFilterItem action");
	});
})