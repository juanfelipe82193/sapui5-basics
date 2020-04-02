/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RevealHeaderFacet
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/RevealHeaderFacet"
],
function(RevealHeaderFacet) {
	"use strict";

	QUnit.module("RevealHeaderFacet revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = RevealHeaderFacet.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RevealHeaderFacet action");
	});
})