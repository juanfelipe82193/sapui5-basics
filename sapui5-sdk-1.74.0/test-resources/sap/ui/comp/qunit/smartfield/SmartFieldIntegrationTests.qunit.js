/* global QUnit */
QUnit.config.autostart = false;

/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/comp/smartfield/SmartField",
	"sap/m/VBox",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/model/BindingMode"
], function(
	Core,
	MockServer,
	ODataModel,
	SmartField,
	VBox,
	QUnitUtils,
	BindingMode
) {
	"use strict";

	var oMockServer = new MockServer({
		rootUri: "odata/"
	});

	oMockServer.simulate("test-resources/sap/ui/comp/shared/mockserver/metadata.xml", "test-resources/sap/ui/comp/shared/mockserver/");
	oMockServer.start();
	var oDataModel = new ODataModel("odata", {
		json: true,
		useBatch: true
	});
	oDataModel.setDefaultBindingMode(BindingMode.TwoWay);

	function beforeEach() {
		this.oVBox = new VBox();
		this.oVBox.setModel(oDataModel); // note: by default the binding mode in OData is OneWay
		this.oVBox.bindObject({
			path: "/Products('1239102')"
		});
	}

	function afterEach() {

		if (this.oVBox) {
			this.oVBox.destroy();
			this.oVBox = null;
		}
	}

	var oQUnitModuleDefaultSettings = {
		before: function() {
			beforeEach.apply(this, arguments);
		},
		after: function() {
			afterEach.apply(this, arguments);
		}
	};

	QUnit.module("Binding mode propagation to inner controls", oQUnitModuleDefaultSettings);

	// BCP: 1980261903
	QUnit.test("Edm.String", function(assert) {
		var done = assert.async();

		// system under test (type String -> Input)
		var oSmartField = new SmartField({
			value: "{ path: 'Name', mode: 'OneWay' }"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.Input"), true, "The inner control is an input field");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.String with com.sap.vocabularies.Common.v1.IsCalendarDate", function(assert) {
		var done = assert.async();

		// system under test (type String -> sap.m.DatePicker)
		var oSmartField = new SmartField({
			value: "{ path: 'StringDate', mode: 'OneWay' }"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oSmartControl = oControlEvent.getSource();
			var aInnerControls = oSmartControl.getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an sap.m.DatePicker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			assert.notStrictEqual(oSmartControl.getValue(), "", "The valid date value is formatted to a date");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.String with com.sap.vocabularies.Common.v1.IsCalendarDate and invalid date", function(assert) {
		var done = assert.async();

		// system under test (type String -> sap.m.DatePicker)
		var oSmartField = new SmartField({
			value: "{ path: 'InvalidStringDate', mode: 'OneWay' }"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oSmartControl = oControlEvent.getSource();
			var aInnerControls = oSmartControl.getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an sap.m.DatePicker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			assert.strictEqual(oSmartControl.getValue(), "", "The invalid date value is formatted to an empty string");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.DateTime", function(assert) {
		var done = assert.async();

		// system under test (type Date -> Date Picker (Date Time))
		var oSmartField = new SmartField({
			value: "{path: 'LastChanged', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an date picker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.DateTimeOffset", function(assert) {
		var done = assert.async();

		// system under test (type Date -> Date Picker (Date Time))
		var oSmartField = new SmartField({
			value: "{path: 'AvailableSince', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an date picker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.DateTime (sap:display-format=Date)", function(assert) {
		var done = assert.async();

		// system under test (type Date -> Date Picker (Date Time))
		var oSmartField = new SmartField({
			value: "{path: 'CreationDate', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an date picker");
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.String (sap:semantics=yearmonthday)", function(assert) {
		var done = assert.async();

		// system under test (type Date -> Date Picker (Date Time))
		var oSmartField = new SmartField({
			value: "{path: 'DateStr', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an date picker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Combo box (fixed value list)", function(assert) {
		var done = assert.async();

		// system under test (fixed values Select control)
		var oSmartField = new SmartField({
			value: "{path: 'Category', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("selectedKey");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.ComboBox"), true, "The inner control is an select");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.Boolean (Check box)", function(assert) {
		var done = assert.async();

		// system under test (fixed values Select control)
		var oSmartField = new SmartField({
			value: "{path: 'Sale', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("selected");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.CheckBox"), true, "The inner control is an check box");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("Initialize event", oQUnitModuleDefaultSettings);

	// BCP: 1970182133
	// BCP: 1970183463
	QUnit.test("it should fire the initialize event after the control is fully initialized", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Name'}",
			editable: false // this setting triggers a different control flow (path) in the code
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oSmartField = oControlEvent.getSource();
			var aInnerControls = oSmartField.getInnerControls();

			// assert
			assert.strictEqual(aInnerControls.length, 1, "the inner controls should be created");
			assert.ok(oSmartField.getControlFactory(), "the factory should be created");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("FieldControl editable and visible state handling", oQUnitModuleDefaultSettings);

	QUnit.test("it should not override the initial value of the editable property when the FieldControl's path is '' (empty)", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Name' }",
			editable: false
		});

		// act
		this.oVBox.addItem(oSmartField);

		// assert
		assert.strictEqual(oSmartField.getEditable(), false);
	});

	// BCP: 1970202197
	QUnit.test("it should not override the editable property while the inner binding is being initialized", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			entitySet: "Products",
			value: "{ path: 'Name' }",
			editable: false
		});

		// arrange
		var oVBox = new VBox();
		oVBox.setModel(oDataModel);

		// act
		oVBox.addItem(oSmartField);

		// arrange
		var oFactory = oSmartField.getControlFactory();
		var oFieldControl = oFactory._oFieldControl;
		var sFieldControlPath = oFieldControl._oAnnotation.getFieldControlPath(oFactory.getEdmProperty());
		var bEntitySetAndEdmPropertyUpdatable = oFieldControl._getUpdatableStatic(oFactory.getMetaData());

		// assert
		// the assumption made in this test is that the edm:property named "Name" is not annotated with
		// the FieldControl annotation
		assert.strictEqual(bEntitySetAndEdmPropertyUpdatable, true);
		assert.strictEqual(oSmartField.getEditable(), false);
		assert.strictEqual(sFieldControlPath, undefined);

		// cleanup
		oVBox.destroy();
	});

	QUnit.test("it should reset the editable property to its default value (editable=true) if the metadata allows " +
				"the field to be updatable", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Name' }",
			editable: false
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory();
			var oFieldControl = oFactory._oFieldControl;
			var sFieldControlPath = oFieldControl._oAnnotation.getFieldControlPath(oFactory.getEdmProperty());
			var bEntitySetAndEdmPropertyUpdatable = oFieldControl._getUpdatableStatic(oFactory.getMetaData());

			// act
			oSmartField.setEditable(null);

			// assert
			// the assumption made in this test is that the edm:property named "Name" is not annotated with
			// the FieldControl annotation, and that the entity set and the edm:property named "Name" are
			// updatable
			assert.strictEqual(bEntitySetAndEdmPropertyUpdatable, true);
			assert.strictEqual(sFieldControlPath, undefined);
			assert.strictEqual(oSmartField.getEditable(), true);
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test('it should set the UoM field to editable when the underlying edm:property is immutable', function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomEditable: false
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory(),
				oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oCurrencyEdmProperty = oFactory.getMetaData().annotations.uom.property.property;

			// act
			oSmartField.setUomEditable(true);
			Core.applyChanges();

			// assert
			assert.strictEqual(oCurrencyEdmProperty["Org.OData.Core.V1.Immutable"], undefined, 'the edm:property should be updatable (default)');
			assert.strictEqual(oUoMNestedSmartField.getBinding("editable").getExternalValue(), true);
			assert.strictEqual(oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName(), "sap.m.Input");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("the UoM field should be visible", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomVisible: false
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oUoMNestedSmartField = this._getEmbeddedSmartField();

			// act
			oSmartField.setUomVisible(true);
			Core.applyChanges();

			// assert
			assert.strictEqual(oUoMNestedSmartField.getBinding("visible").getExternalValue(), true);
			var sControlMetadataName = oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName();
			assert.strictEqual(sControlMetadataName, "sap.m.Input");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	// BCP: 1970375171
	QUnit.test("the UoM field should not be visible", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomVisible: true
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oUoMNestedSmartField = this._getEmbeddedSmartField();

			// act
			oSmartField.setUomVisible(false);

			// assert
			assert.strictEqual(oUoMNestedSmartField.getBinding("visible").getExternalValue(), false);
			assert.strictEqual(oUoMNestedSmartField.getVisible(), false);
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("the UoM field should not be visible if the underlying edm:property is annotated as hidden", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'PriceCurrencyNotVisible' }",
			uomVisible: false
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oUoMNestedSmartField = this._getEmbeddedSmartField();

			// act
			oSmartField.setUomVisible(true); // this API call should be
			Core.applyChanges();

			// assert
			assert.strictEqual(oUoMNestedSmartField.getBinding("visible").getExternalValue(), false);
			var sControlMetadataName = oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName();
			assert.strictEqual(sControlMetadataName, "sap.m.Text");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	// BCP: 1970575713
	QUnit.test("it should not set the UoM field to visible after cloning if the uomVisible property is set to false", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField("smartfieldID1", {
			value: "{ path: 'Price' }",
			uomVisible: false
		});

		// arrange
		oSmartField.attachEventOnce("initialise", function(oControlEvent) {

			// act
			var oSmartFieldClone = oSmartField.clone();

			// arrange
			oSmartFieldClone.attachEventOnce("initialise", function(oControlEvent) {
				Core.applyChanges();
				var oNestedSmartField = oSmartFieldClone._getEmbeddedSmartField();

				// assert
				assert.strictEqual(oNestedSmartField.getVisible(), false, "the UoM field should be hidden");
				assert.strictEqual(oNestedSmartField.isActive(), false, "the UoM field should be hidden");
				done();
			}, this);

			this.oVBox.addItem(oSmartFieldClone);
		}, this);

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.test("it should set the UoM field to read-only", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomEditable: true
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory(),
				oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oCurrencyEdmProperty = oFactory.getMetaData().annotations.uom.property.property;

			// act
			oSmartField.setUomEditable(false);
			Core.applyChanges();

			// assert
			assert.strictEqual(oCurrencyEdmProperty["Org.OData.Core.V1.Immutable"], undefined, 'the edm:property should be updatable (default)');
			assert.strictEqual(oUoMNestedSmartField.getBinding("editable").getExternalValue(), false);
			var sControlMetadataName = oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName();
			assert.strictEqual(sControlMetadataName, "sap.m.Text");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	// BCP: 1980259594
	QUnit.test("it should not set the UoM field to editable if the underlying edm:property is updatable/immutable", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'PriceCurrencyReadOnly' }"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory(),
				oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oCurrencyEdmProperty = oFactory.getMetaData().annotations.uom.property.property;

			// act
			oSmartField.setUomEditable(true);
			Core.applyChanges();

			// assert
			assert.strictEqual(oCurrencyEdmProperty["Org.OData.Core.V1.Immutable"].Bool, "true");
			assert.strictEqual(oUoMNestedSmartField.getBinding("editable").getExternalValue(), false);
			var sControlMetadataName = oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName();
			assert.strictEqual(sControlMetadataName, "sap.m.Text");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	// BCP: 1970185965
	QUnit.test("it should render a mandatory field", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Phone' }",
			mandatory: true
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory();
			var oFieldControl = oFactory._oFieldControl;
			var oEdmProperty = oFactory.getEdmProperty();
			var sFieldControlPath = oFieldControl._oAnnotation.getFieldControlPath(oEdmProperty);

			// assert
			assert.strictEqual(oEdmProperty.nullable, "true", "the backend can accept nulled/empty values");
			assert.strictEqual(sFieldControlPath, undefined, "the FieldControl annotation is not specified");
			assert.strictEqual(oSmartField.getMandatory(), true, "the field should be mandatory");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("Time formatting", oQUnitModuleDefaultSettings);

	// BCP: 1980303513
	QUnit.test("it should format the value of the field typed as Edm.Time annotated with the @Common.Text " +
				"annotation correctly", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'DeliveryTime' }",
			editable: false // this setting triggers a different control flow (path) in the code
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oTextField = oSmartField.getFirstInnerControl();
			var oEdmProperty = oSmartField.getControlFactory().getEdmProperty();
			var TEXT_ANNOTATION_TERM = "com.sap.vocabularies.Common.v1.Text";

			// assert
			assert.strictEqual(oTextField.getText(), "9:00:21 AM");
			assert.ok(oEdmProperty.hasOwnProperty(TEXT_ANNOTATION_TERM));
			done();
		}, this);

		this.oVBox.addItem(oSmartField);
	});

	// BCP: 1970236005
	QUnit.test("it should format the value of the field typed as Edm.Time annotated with the @Common.Text and " +
				"@Common.SemanticObject annotations correctly", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'ExpiredTime' }",
			editable: false // this setting triggers a different control flow (path) in the code
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oTextField = oSmartField.getFirstInnerControl();
			var oEdmProperty = oSmartField.getControlFactory().getEdmProperty();
			var TEXT_ANNOTATION_TERM = "com.sap.vocabularies.Common.v1.Text";
			var SEMANTIC_OBJECT_ANNOTATION_TERM = "com.sap.vocabularies.Common.v1.SemanticObject";

			// assert
			assert.strictEqual(oTextField.getText(), "9:00:21 AM");
			assert.ok(oEdmProperty.hasOwnProperty(TEXT_ANNOTATION_TERM));
			assert.ok(oEdmProperty.hasOwnProperty(SEMANTIC_OBJECT_ANNOTATION_TERM));
			done();
		}, this);

		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("Currency validation", oQUnitModuleDefaultSettings);

	// BCP: 1980097317
	QUnit.test("it should format the amount for JPY currencies without any digit to the right of the decimal point", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }"
		});

		// arrange
		var oVBox = new VBox();
		oVBox.setModel(oDataModel);
		oVBox.bindObject({
			path: "/Products('1239103')"
		});

		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory(),
				oEdmProperty = oFactory.getEdmProperty(),
				oAmountInnerControl = oSmartField.getFirstInnerControl(),
				aBindingValues = oAmountInnerControl.getBinding("value").getValue(),
				sAmountBindingValue = aBindingValues[0],
				sCurrencyBindingValue = aBindingValues[1],
				EXPECTED_FORMATTED_VALUE = "100";

			oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			// assert
			assert.strictEqual(oEdmProperty.precision, "13");
			assert.strictEqual(oEdmProperty.scale, "2");
			assert.strictEqual(oEdmProperty["Org.OData.Measures.V1.ISOCurrency"].Path, "CurrencyCode");
			assert.strictEqual(sAmountBindingValue, "100.00");
			assert.strictEqual(sCurrencyBindingValue, "JPY");
			assert.strictEqual(oSmartField.getValue(), EXPECTED_FORMATTED_VALUE);
			assert.strictEqual(oAmountInnerControl.getValue(), EXPECTED_FORMATTED_VALUE);
			assert.strictEqual(oAmountInnerControl.getFocusDomRef().value, EXPECTED_FORMATTED_VALUE);

			// cleanup
			oVBox.destroy();
			done();
		});

		oVBox.addItem(oSmartField);
	});

	QUnit.test("it should not store an invalid amount value in the binding when the field is subject to " +
				"data type constraints", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }"
		});

		oDataModel.resetChanges(); // Let's keep tests atomic

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			this.oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			var oAmountInputField = oSmartField.getFirstInnerControl();
			var oAmountInputFieldFocusDomRef = oAmountInputField.getFocusDomRef();
			var oFireValidationSuccessSpy = this.spy(oAmountInputField, "fireValidationSuccess");
			var oFireChangeEventSpy = this.spy(oAmountInputField, "fireChange");
			var INITIAL_VALUE = "856.49";
			var INPUT_VALUE = "856.491";

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", INPUT_VALUE);
			oAmountInputFieldFocusDomRef.blur();

			// when the value in the input field has changed and a blur event occurs on a sap.m.InputBase control, the change event is
			// fired async
			setTimeout(function() {

				// assert
				assert.strictEqual(oFireChangeEventSpy.callCount, 1, 'the amount text input field should fire the "change" event');
				assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'the amount text input field should not fire the "validationSuccess" event');

				var aBindingValues = oAmountInputField.getBinding("value").getValue();
				var sAmountBindingValue = aBindingValues[0];

				assert.strictEqual(sAmountBindingValue, INITIAL_VALUE, "it should not update the binding value");
				done();
			}, 0);
		}, this);

		this.oVBox.insertItem(oSmartField);
	});

	// BCP: 1980461191
	QUnit.test("it should store the valid value in the model when the amount input field is in edit mode, " +
				"the currency field is invisible/read-only and the data type constraints are fulfilled (test case 1)", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomVisible: false,
			uomEditable: false
		});

		oDataModel.resetChanges(); // Let's keep tests atomic

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			this.oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			var oAmountInputField = oSmartField.getFirstInnerControl();
			var oAmountInputFieldFocusDomRef = oAmountInputField.getFocusDomRef();
			var oFireValidationSuccessSpy = this.spy(oAmountInputField, "fireValidationSuccess");
			var oFireChangeEventSpy = this.spy(oAmountInputField, "fireChange");
			var INPUT_VALUE = "100";

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", INPUT_VALUE);
			oAmountInputFieldFocusDomRef.blur();

			// when the value in the input field has changed and a blur event occurs on a sap.m.InputBase control, the change event is
			// fired async
			setTimeout(function() {

				// assert
				assert.strictEqual(oFireChangeEventSpy.callCount, 1, 'the amount text input field should fire the "change" event');
				assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'the amount text input field should fire the "validationSuccess" event');

				var aBindingValues = oAmountInputField.getBinding("value").getValue();
				var sAmountBindingValue = aBindingValues[0];

				assert.strictEqual(sAmountBindingValue, INPUT_VALUE, "it should update the binding value");
				done();
			}, 0);
		}, this);

		this.oVBox.insertItem(oSmartField);
	});

	QUnit.test("it should store the valid value in the model when the amount input field is in edit mode, " +
				"the currency value is empty, and the data type constraints are fulfilled (test case 2)", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'PriceEmptyCurrency' }"
		});

		oDataModel.resetChanges(); // Let's keep tests atomic

		// arrange
		var oVBox = new VBox();
		oVBox.setModel(oDataModel);
		oVBox.bindObject({
			path: "/Products('1239104')"
		});

		oSmartField.attachInitialise(function(oControlEvent) {
			oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			var oAmountInputField = oSmartField.getFirstInnerControl();
			var oAmountInputFieldFocusDomRef = oAmountInputField.getFocusDomRef();
			var oFireValidationSuccessSpy = this.spy(oAmountInputField, "fireValidationSuccess");
			var oFireChangeEventSpy = this.spy(oAmountInputField, "fireChange");
			var INPUT_VALUE = "100";
			var oFactory = oSmartField.getControlFactory();
			var oEdmProperty = oFactory.getEdmProperty();

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", INPUT_VALUE);
			oAmountInputFieldFocusDomRef.blur();

			// when the value in the input field has changed and a blur event occurs on a sap.m.InputBase control, the change event is
			// fired async
			setTimeout(function() {
				var aBindingValues = oAmountInputField.getBinding("value").getValue();
				var sAmountBindingValue = aBindingValues[0];
				var sCurrencyBindingValue = aBindingValues[1];

				// assert
				assert.strictEqual(oEdmProperty["Org.OData.Measures.V1.ISOCurrency"].Path, "CurrencyCodeEmpty");
				assert.strictEqual(sCurrencyBindingValue, "", "the currency should have an empty value stored in the binding/model");
				assert.strictEqual(oFireChangeEventSpy.callCount, 1, 'the amount text input field should fire the "change" event');
				assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'the amount text input field should fire the "validationSuccess" event');
				assert.strictEqual(sAmountBindingValue, INPUT_VALUE, "it should update the binding value");

				// cleanup
				oVBox.destroy();
				done();
			}, 0);
		}, this);

		oVBox.insertItem(oSmartField);
	});

	QUnit.test("it should call the binding propertyChange event when the amount field is edited", function(assert) {
		var done = assert.async(),
			oSmartField = new SmartField({
				value: "{ path: 'Price' }",
				uomVisible: true,
				uomEditable: false
			});

		oDataModel.resetChanges(); // Let's keep tests atomic
		assert.expect(1); // We expect only one assert

		// arrange
		oSmartField.attachInitialise(function() {
			this.oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			var oAmountInputField = oSmartField.getFirstInnerControl(),
				oAmountInputFieldFocusDomRef = oAmountInputField.getFocusDomRef(),
				oAmountFieldModel = oAmountInputField.getModel();

			oAmountFieldModel.attachPropertyChange(function () {
				// assert
				assert.ok(true, 'the propertyBinding "propertyChange" event should be fired oince');
				done();
			});

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", "100");
			oAmountInputFieldFocusDomRef.blur();
		}, this);

		this.oVBox.insertItem(oSmartField);
	});

	QUnit.start();
});

