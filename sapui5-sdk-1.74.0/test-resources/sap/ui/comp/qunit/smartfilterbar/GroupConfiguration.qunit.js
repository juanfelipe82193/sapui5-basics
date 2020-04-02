/*globals QUnit*/
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartfilterbar/GroupConfiguration"
], function(GroupConfiguration){
	"use strict";

	QUnit.module("sap.ui.comp.smartfilterbar.GroupConfiguration", {
		beforeEach: function() {
			this.oGroupConfiguration = new GroupConfiguration();
			this.oGroupConfiguration.setKey("Address");

		},
		afterEach: function() {
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oGroupConfiguration);
	});

	QUnit.test("The index shall be configureable", function(assert) {
		//Call CUT
		this.oGroupConfiguration.setIndex(42);

		assert.strictEqual(this.oGroupConfiguration.getIndex(), 42);
	});


	QUnit.test("The default index shall be undefined", function(assert) {
		//Call CUT
		assert.strictEqual(this.oGroupConfiguration.getIndex(), undefined);
	});

	QUnit.test("The label shall be configureable", function(assert) {
		//Call CUT
		this.oGroupConfiguration.setLabel("Hello World");

		assert.strictEqual(this.oGroupConfiguration.getLabel(), "Hello World");
	});


	QUnit.test("The default label shall be undefined", function(assert) {
		//Call CUT
		assert.strictEqual(this.oGroupConfiguration.getLabel(), undefined);
	});

	QUnit.start();

});