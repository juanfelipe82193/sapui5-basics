/* global QUnit */
sap.ui.define(["sap/ui/mdc/Table"], function(Table) {
	"use strict";
	var oTable = new Table();

	QUnit.test("Check selection mode validity", function(assert) {
		[
			{
				mode: sap.ui.mdc.SelectionMode.Single
			},
			{
				mode: sap.ui.mdc.SelectionMode.Multi
			},
			{
				mode: sap.ui.mdc.SelectionMode.None
			}
		].forEach(function(oElement) {
			oTable.setSelectionMode(oElement.mode);
			assert.equal(oTable.getSelectionMode(), oElement.mode, "selection mode " + oElement.mode + " is valid");
		});
	});
});
