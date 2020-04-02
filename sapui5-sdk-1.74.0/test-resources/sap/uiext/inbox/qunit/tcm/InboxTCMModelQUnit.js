/*global QUnit */
sap.ui.define(["sap/uiext/inbox/tcm/TCMModel"], function(TCMModel) {
	"use strict";

	var oTCMModel = new TCMModel();

	QUnit.test("Load", 1, function(assert) {
		assert.ok(oTCMModel, "TCM Model is created");
	});

	QUnit.test("GetFunctionImportHandler", 1, function(assert) {
		assert.ok(oTCMModel.getFunctionImportHandler(), "Function Import Handler is created");
	});
});