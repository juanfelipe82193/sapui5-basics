/**
 * tests for the sap.suite.ui.generic.template.changeHandler.AddHeaderFacet
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/AddHeaderFacet"
],
function(AddHeaderFacet) {
	"use strict";

	QUnit.module("AddHeaderFacet revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = AddHeaderFacet.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for AddHeaderFacet action");
	});
})