/*globals QUnit*/
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/comp/smartfilterbar/SelectOption",
	"sap/ui/model/FilterOperator"
], function(library, SelectOption, FilterOperator){
	"use strict";

	QUnit.module("sap.ui.comp.smartfilterbar.SelectOption", {
		beforeEach: function() {
			this.oSelectOption = new SelectOption();

		},
		afterEach: function() {
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oSelectOption);
	});

	QUnit.test("Shall have a sign property", function(assert) {
		//Call CUT
		this.oSelectOption.setSign(library.smartfilterbar.SelectOptionSign.exclude);

		assert.strictEqual(this.oSelectOption.getSign(), library.smartfilterbar.SelectOptionSign.exclude);
	});

	QUnit.test("Shall have an operator property", function(assert) {
		//Call CUT
		this.oSelectOption.setOperator(FilterOperator.GT);

		assert.strictEqual(this.oSelectOption.getOperator(), FilterOperator.GT);
	});

	QUnit.test("Shall raise an exception if the sign is not valid", function(assert) {
		//Call CUT
		var exception;
		try {
			this.oControlConfiguration.setSign("something invalid");
		} catch (e){
			exception = e;
		}

		assert.ok(exception, "shall raise an exception");
	});

	QUnit.test("Shall raise an exception if the operator is not valid", function(assert) {
		//Call CUT
		var exception;
		try {
			this.oControlConfiguration.setOperator("something invalid");
		} catch (e){
			exception = e;
		}

		assert.ok(exception, "shall raise an exception");
	});
	QUnit.start();

});