/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RemoveHeaderFacet
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/RemoveHeaderFacet"
],
function(RemoveHeaderFacet) {
	"use strict";

	QUnit.module("RemoveHeaderFacet revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = RemoveHeaderFacet.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RemoveHeaderFacet action");
	});
})