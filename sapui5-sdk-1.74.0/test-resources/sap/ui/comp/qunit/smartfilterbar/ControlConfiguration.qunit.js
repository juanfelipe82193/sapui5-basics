/*globals QUnit*/
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/comp/smartfilterbar/ControlConfiguration",
	"sap/ui/comp/smartfilterbar/SelectOption",
	"sap/m/Input",
	"sap/ui/model/FilterOperator"
], function(library, ControlConfiguration, SelectOption, Input, FilterOperator){
	"use strict";

	QUnit.module("sap.ui.comp.smartfilterbar.ControlConfiguration", {
		beforeEach: function() {
			this.oControlConfiguration = new ControlConfiguration();
			this.oControlConfiguration.setKey("CompanyCode");

		},
		afterEach: function() {
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oControlConfiguration);
	});

	QUnit.test("Shall be configurable whether a ValueHelpialog is available", function(assert) {
		//Call CUT
		this.oControlConfiguration.setHasValueHelpDialog(true);

		assert.strictEqual(this.oControlConfiguration.getHasValueHelpDialog(), true);
	});

	QUnit.test("The hasValueHelpDialog shall be true by default", function(assert) {
		var bHasValueHelpDialog;

		//Call CUT
		bHasValueHelpDialog = this.oControlConfiguration.getHasValueHelpDialog(true);

		assert.strictEqual(bHasValueHelpDialog, true);
	});


	QUnit.test("It shall be configurable to which group a fields belongs", function(assert) {
		//Call CUT
		this.oControlConfiguration.setGroupId("Address");

		assert.strictEqual(this.oControlConfiguration.getGroupId(), "Address");
	});

	QUnit.test("The visibility of a field shall be configureable", function(assert) {
		//Call CUT
		this.oControlConfiguration.setVisible(false);

		assert.strictEqual(this.oControlConfiguration.getVisible(), false);
	});

	QUnit.test("A field shall be visible by default", function(assert) {
		var bIsVisible;
		//Call CUT
		bIsVisible = this.oControlConfiguration.getVisible();

		assert.strictEqual(bIsVisible, true);
	});

	QUnit.test("The mandatory state of a field shall be configureable", function(assert) {
		//Call CUT
		this.oControlConfiguration.setMandatory(library.smartfilterbar.MandatoryType.mandatory);

		assert.strictEqual(this.oControlConfiguration.getMandatory(), library.smartfilterbar.MandatoryType.mandatory);
	});


	QUnit.test("Shall raise an exception if the mandatory value is not valid", function(assert) {
		var exception;

		//Call CUT
		try {
			this.oControlConfiguration.setMandatory("something invalid");
		} catch (e){
			exception = e;
		}

		assert.ok(exception, "shall raise an exception");
	});

	QUnit.test("A field shall have the default value auto for the mandatory property", function(assert) {
		//Call CUT
		assert.strictEqual(this.oControlConfiguration.getMandatory(), library.smartfilterbar.MandatoryType.auto);
	});

	QUnit.test("The width of a field shall be configureable", function(assert) {
		//Call CUT
		this.oControlConfiguration.setWidth('100px');

		assert.equal(this.oControlConfiguration.getWidth(), '100px');
	});

	QUnit.test("A field shall have no width by default", function(assert) {
		//Call CUT
		assert.ok(!this.oControlConfiguration.getWidth());
	});

	QUnit.test("The filter type shall be configurable", function(assert) {
		//Call CUT
		this.oControlConfiguration.setFilterType(library.smartfilterbar.FilterType.single);

		assert.equal(this.oControlConfiguration.getFilterType(), library.smartfilterbar.FilterType.single);
	});

	QUnit.test("Shall raise an exception if the filtertype is not valid", function(assert) {
		var exception;

		//Call CUT
		try {
			this.oControlConfiguration.setFilterType("something invalid");
		} catch (e){
			exception = e;
		}

		assert.ok(exception, "shall raise an exception");
	});

	QUnit.test("The default filter type shall be auto", function(assert) {
		var sFilterType;

		//Call CUT
		sFilterType = this.oControlConfiguration.getFilterType();

		assert.equal(sFilterType, library.smartfilterbar.FilterType.auto );
	});

	QUnit.test("The control type for a field shall be configureable", function(assert) {
		//Call CUT
		this.oControlConfiguration.setControlType(library.smartfilterbar.ControlType.input);

		assert.equal(this.oControlConfiguration.getControlType(), library.smartfilterbar.ControlType.input);
	});

	QUnit.test("The default control type shall be auto", function(assert) {
		var sControlType;

		//Call CUT
		sControlType = this.oControlConfiguration.getControlType();

		assert.equal(sControlType, library.smartfilterbar.ControlType.auto );
	});

	QUnit.test("Shall raise an exception if the control type is not valid", function(assert) {
		var exception;

		//Call CUT
		try {
			this.oControlConfiguration.setControlType("something invalid");
		} catch (e){
			exception = e;
		}

		assert.ok(exception, "shall raise an exception");
	});

	QUnit.test("The display behaviour for a field shall be configureable", function(assert) {
		this.oControlConfiguration.setDisplayBehaviour(library.smartfilterbar.DisplayBehaviour.descriptionOnly);

		assert.equal(this.oControlConfiguration.getDisplayBehaviour(), library.smartfilterbar.DisplayBehaviour.descriptionOnly);
	});

	QUnit.test("The defaultdisplay behaviour shall be auto", function(assert) {
		var sDisplayBehaviour;

		sDisplayBehaviour = this.oControlConfiguration.getDisplayBehaviour();

		assert.equal(sDisplayBehaviour, library.smartfilterbar.DisplayBehaviour.auto);
	});

	QUnit.test("Shall raise an exception if the display behaviour is not valid", function(assert) {
		var exception;

		try {
			this.oControlConfiguration.setDisplayBehaviour("something invalid");
		} catch (e){
			exception = e;
		}

		assert.ok(exception, "shall raise an exception");
	});

	QUnit.test("The default filter values shall be configureable", function(assert) {
		var oSelectOption, aDefaultValue;

		oSelectOption = new library.smartfilterbar.SelectOption({sign: library.smartfilterbar.SelectOptionSign.I,
			operator: FilterOperator.EQ,
			low: "MC1234"});

		//Call CUT
		this.oControlConfiguration.addDefaultFilterValue(oSelectOption);

		aDefaultValue = this.oControlConfiguration.getDefaultFilterValues();
		assert.equal(aDefaultValue.length, 1 );
		assert.equal(aDefaultValue[0].getLow(), "MC1234");
	});


	QUnit.test("The index shall be configureable", function(assert) {
		//Call CUT
		this.oControlConfiguration.setIndex(42);

		this.oControlConfiguration.getIndex();
		assert.strictEqual(this.oControlConfiguration.getIndex(), 42);
	});

	QUnit.test("The default index shall be -1", function(assert) {
		//Call CUT
		assert.strictEqual(this.oControlConfiguration.getIndex(), -1);
	});

	QUnit.test("It shall be possible to inject an instance of a control, e.g. for custom fields", function(assert) {
		var oControl;
		oControl = new Input();

		//Call CUT
		this.oControlConfiguration.setCustomControl(oControl);

		assert.ok(this.oControlConfiguration.getCustomControl() instanceof Input, "Shall support a custom control");
	});

	QUnit.test("The hasTypeAhead flag shall be configureable", function(assert) {
		//Call CUT
		this.oControlConfiguration.setHasTypeAhead(false);

		assert.strictEqual(this.oControlConfiguration.getHasTypeAhead(), false);
	});


	QUnit.test("The default value of the hasTypeAhead flag shall be true", function(assert) {
		//Call CUT
		assert.strictEqual(this.oControlConfiguration.getHasTypeAhead(), true);
	});


	QUnit.test("Shall fire an event when the visible property gets changed", function(assert) {
		var fEventHandler, sPropertyName;
		fEventHandler = function(oEvent){sPropertyName = oEvent.getParameter("propertyName");};
		this.oControlConfiguration.attachChange(fEventHandler);

		//Call CUT
		this.oControlConfiguration.setVisible(false);

		assert.equal(sPropertyName, "visible");
	});

	QUnit.start();

});