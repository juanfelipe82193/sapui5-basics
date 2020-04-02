/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartfield/JSONTypes"
	],
	function(
			JSONTypes
	) {
	"use strict";

	QUnit.module("sap.ui.comp.smartfield.JSONTypes", {
		beforeEach: function() {
			this.oMetaData = new JSONTypes();
		},
		afterEach: function() {
			this.oMetaData.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oMetaData);
	});

	QUnit.test("getType : Boolean", function(assert) {
		var oResult = this.oMetaData.getType("Boolean");
		assert.ok(oResult && oResult.isA("sap.ui.model.type.Boolean"));
	});

	QUnit.test("getType : Date", function(assert) {
		var oResult = this.oMetaData.getType("Date");
		assert.ok(oResult && oResult.isA("sap.ui.model.type.Date"));
	});

	QUnit.test("getType : Date", function(assert) {
		var oResult = this.oMetaData.getType("DateTime");
		assert.ok(oResult && oResult.isA("sap.ui.model.type.String"));
	});

	QUnit.test("getType : Float", function(assert) {
		var oResult = this.oMetaData.getType("Float");
		assert.ok(oResult && oResult.isA("sap.ui.model.type.Float"));
	});

	QUnit.test("getType : Integer", function(assert) {
		var oResult = this.oMetaData.getType("Integer");
		assert.ok(oResult && oResult.isA("sap.ui.model.type.Integer"));
	});

	QUnit.test("getType : String", function(assert) {
		var oResult = this.oMetaData.getType("String");
		assert.ok(oResult && oResult.isA("sap.ui.model.type.String"));
	});

	QUnit.test("getType : no input", function(assert) {
		var oResult = this.oMetaData.getType();
		assert.equal(!oResult, true);
	});

	QUnit.test("Shall be destructible", function(assert) {
		this.oMetaData.destroy();
		assert.ok(this.oMetaData);
		assert.equal(this.oMetaData._oModel, null);
	});

	QUnit.start();

});