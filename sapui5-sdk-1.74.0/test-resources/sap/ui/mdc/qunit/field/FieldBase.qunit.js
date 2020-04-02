/* global QUnit, sinon */

/*eslint max-nested-callbacks: [2, 20]*/

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/mdc/library",
	"sap/ui/mdc/field/FieldBase",
	"sap/ui/mdc/field/FieldHelpBase",
	"sap/ui/mdc/field/BoolFieldHelp",
	"sap/ui/mdc/field/FieldInfoBase",
	"sap/ui/mdc/odata/v4/FieldBaseDelegate", // bring back to default one
	"sap/m/Label",
	"sap/m/MultiInput",
	"sap/m/Text",
	"sap/m/Slider",
	"sap/m/Input",
	"sap/m/ProgressIndicator",
	"sap/m/SegmentedButton",
	"sap/m/SegmentedButtonItem",
	"sap/m/SearchField",
	"sap/m/TextArea",
	"sap/m/DatePicker",
	"sap/m/TimePicker",
	"sap/m/DateTimePicker",
	"sap/m/Button",
	"sap/m/Link",
	"sap/ui/mdc/condition/ConditionModel",
	"sap/ui/mdc/condition/Condition",
	"sap/ui/mdc/condition/FilterOperatorUtil",
	"sap/ui/mdc/field/ConditionsType",
	"sap/ui/mdc/field/ConditionType",
	"sap/ui/mdc/util/BaseType",
	"sap/ui/model/FormatException",
	"sap/ui/model/ParseException",
	"sap/ui/model/type/Currency",
	"sap/ui/core/Icon"
], function(
	jQuery,
	qutils,
	library,
	FieldBase,
	FieldHelpBase,
	BoolFieldHelp,
	FieldInfoBase,
	FieldBaseDelegate,
	Label,
	MultiInput,
	Text,
	Slider,
	Input,
	ProgressIndicator,
	SegmentedButton,
	SegmentedButtonItem,
	SearchField,
	TextArea,
	DatePicker,
	TimePicker,
	DateTimePicker,
	Button,
	Link,
	ConditionModel,
	Condition,
	FilterOperatorUtil,
	ConditionsType,
	ConditionType,
	BaseType,
	FormatException,
	ParseException,
	Currency,
	Icon
) {
	"use strict";

	var oField;
	var oCM;
	var sId;
	var sValue;
	var bValid;
	var oPromise;
	var iCount = 0;

	var _myChangeHandler = function(oEvent) {
		iCount++;
		sId = oEvent.oSource.getId();
		bValid = oEvent.getParameter("valid");
		oPromise = oEvent.getParameter("promise");

		if (bValid) {
			var aConditions = oEvent.getParameter("conditions");
			if (aConditions.length == 1) {
				sValue = aConditions[0].values[0];
			}
		} else {
			sValue = oEvent.getParameter("wrongValue");
		}
	};

	var _myFireChange = function(aConditions, bValid, vWrongValue, oPromise) {
		this.fireEvent("change", { conditions: aConditions, valid: bValid, wrongValue: vWrongValue, promise: oPromise });
	};

	var fnOnlyEEQ = function() {return ["EEQ"];};

	var sLiveId;
	var sLiveValue;
	var iLiveCount = 0;

	var _myLiveChangeHandler = function(oEvent) {
		iLiveCount++;
		sLiveId = oEvent.oSource.getId();
		sLiveValue = oEvent.getParameter("value");
	};

	var sPressId;
	var iPressCount = 0;

	var _myPressHandler = function(oEvent) {
		iPressCount++;
		sPressId = oEvent.oSource.getId();
	};

	var iParseError = 0;
	var _myParseErrorHandler = function(oEvent) {
		iParseError++;
	};

	var iValidationError = 0;
	var _myValidationErrorHandler = function(oEvent) {
		iValidationError++;
	};

	QUnit.module("Delegate", {
		beforeEach: function() {
		},
		afterEach: function() {
			if (oField) {
				oField.destroy();
				oField = undefined;
			}
			FieldBase._init();
		}
	});

//	QUnit.test("default delegate", function(assert) {
//
//		oField = new FieldBase("F1");
//		assert.deepEqual(oField.getDelegate(), {name: "sap/ui/mdc/field/FieldBaseDelegate", payload: {}}, "Default delegate");
//
//		var fnDone = assert.async();
//		oField._oDelegatePromise.then(function() {
//			var oDelegate = sap.ui.require("sap/ui/mdc/field/FieldBaseDelegate");
//			assert.ok(oDelegate, "Delegate module loaded");
//			assert.equal(oField._oDelegate, oDelegate, "Delegate used");
//			assert.deepEqual(oField._oPayload, {}, "Payload used");
//			fnDone();
//		});
//
//	});
//
	QUnit.test("V4 delegate", function(assert) {

		oField = new FieldBase("F1", {
			delegate: {name: "sap/ui/mdc/odata/v4/FieldBaseDelegate", payload: {x: 1}}
		});

		var oDelegate = sap.ui.require("sap/ui/mdc/odata/v4/FieldBaseDelegate");
		assert.equal(oField._oDelegate, oDelegate, "Delegate used");
		assert.deepEqual(oField._oPayload, {x: 1}, "Payload used");

	});

	QUnit.test("V4 delegate, async loading", function(assert) {

		var oStub = sinon.stub(sap.ui, "require");
		oStub.withArgs("sap/ui/mdc/odata/v4/FieldBaseDelegate").onFirstCall().returns(undefined);
		oStub.callThrough();

		oField = new FieldBase("F1", {
			delegate: {name: "sap/ui/mdc/odata/v4/FieldBaseDelegate", payload: {x: 1}}
		});

		var fnDone = assert.async();
		oField._oDelegatePromise.then(function() {
			var oDelegate = sap.ui.require("sap/ui/mdc/odata/v4/FieldBaseDelegate");
			assert.equal(oField._oDelegate, oDelegate, "Delegate used");
			assert.deepEqual(oField._oPayload, {x: 1}, "Payload used");
			fnDone();
		});

		oStub.restore();

	});

	QUnit.test("call of delegate functions", function(assert) {

		var oDelegate = sap.ui.require("sap/ui/mdc/field/FieldBaseDelegate");
		sinon.spy(oDelegate, "getDataTypeClass");
		sinon.spy(oDelegate, "getBaseType");

		oField = new FieldBase("F1", {
			delegate: {name: "sap/ui/mdc/field/FieldBaseDelegate", payload: {x: 1}}
		}).placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.ok(oDelegate.getDataTypeClass.calledWith({x: 1}, "sap.ui.model.type.String"), "getDataTypeClass called");
		assert.ok(oDelegate.getBaseType.calledWith({x: 1}, "sap.ui.model.type.String"), "getBaseType called");

		oDelegate.getDataTypeClass.restore();
		oDelegate.getBaseType.restore();

	});

	QUnit.module("Field rendering", {
		beforeEach: function() {
			oCM = new ConditionModel();
			sap.ui.getCore().setModel(oCM, "cm");
			oField = new FieldBase("F1", {
				conditions: "{cm>/conditions/Name}"
			});
		},
		afterEach: function() {
			oField.destroy();
			oField = undefined;
			oCM.destroy();
			oCM = undefined;
			FieldBase._init();
		}
	});

	QUnit.test("default rendering", function(assert) {

		oField.placeAt("content");
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent, "default content exist");
		assert.equal(oContent.getMetadata().getName(), "sap.m.MultiInput", "sap.m.MultiInput is default");
		assert.equal(oContent.getModel("$field"), oField._oManagedObjectModel, "MultiInput has ManagedObjectModel of Field");
		assert.equal(oContent.getBindingPath("tokens"), "/conditions", "MultiInput tokens bound to Field conditions");
		assert.notOk(oContent.getShowValueHelp(), "no valueHelp");

		var oSuggestControl = oField.getControlForSuggestion();
		assert.equal(oSuggestControl, oContent, "inner control is used for suggestion");

	});

	QUnit.test("default rendering, async loading of control", function(assert) {

		var oStub = sinon.stub(sap.ui, "require");
		oStub.withArgs("sap/m/MultiInput").onFirstCall().returns(undefined);
		oStub.callThrough();

		oField.placeAt("content");
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		assert.notOk(aContent && aContent.length > 0, "Content not created sync");

		var fnDone = assert.async();
		setTimeout(function() { // to wait async creation of inner control
			aContent = oField.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			assert.ok(oContent, "default content exist");
			assert.equal(oContent.getMetadata().getName(), "sap.m.MultiInput", "sap.m.MultiInput is default");
			assert.equal(oContent.getModel("$field"), oField._oManagedObjectModel, "MultiInput has ManagedObjectModel of Field");
			assert.equal(oContent.getBindingPath("tokens"), "/conditions", "MultiInput tokens bound to Field conditions");
			assert.notOk(oContent.getShowValueHelp(), "no valueHelp");

			var oSuggestControl = oField.getControlForSuggestion();
			assert.equal(oSuggestControl, oContent, "inner control is used for suggestion");
			fnDone();
		}, 0);

		oStub.restore();

	});

	QUnit.test("EditMode", function(assert) {

		oField.setEditMode(library.EditMode.Display);
		oField.placeAt("content");
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent, "content exist");
		assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");
		assert.equal(oContent.getModel("$field"), oField._oManagedObjectModel, "Text has ManagedObjectModel of Field");
		assert.equal(oContent.getBindingPath("text"), "/conditions", "Text value bound to Fields Conditions");
		// TODO: test for formatter

		oField.setEditMode(library.EditMode.ReadOnly);
		sap.ui.getCore().applyChanges();

		aContent = oField.getAggregation("_content");
		oContent = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent, "content exist");
		assert.equal(oContent.getMetadata().getName(), "sap.m.MultiInput", "sap.m.MultiInput is used");
		if (oContent.getMetadata().getName() == "sap.m.MultiInput") {
			assert.equal(oContent.getModel("$field"), oField._oManagedObjectModel, "MultiInput has ManagedObjectModel of Field");
			assert.notOk(oContent.getEditable(), "MultiInput is not editable");
		}

		oField.setEditMode(library.EditMode.Disabled);
		sap.ui.getCore().applyChanges();

		aContent = oField.getAggregation("_content");
		assert.equal(oContent, aContent && aContent.length > 0 && aContent[0], "Contont control not changed");
		assert.notOk(oContent.getEnabled(), "MultiInput is not enabled");


	});

	QUnit.test("display mode rendering, async loading of control", function(assert) {

		var oStub = sinon.stub(sap.ui, "require");
		oStub.withArgs("sap/m/Text").onFirstCall().returns(undefined);
		oStub.callThrough();

		oField.setEditMode(library.EditMode.Display);
		oField.placeAt("content");
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		assert.notOk(aContent && aContent.length > 0, "Content not created sync");

		var fnDone = assert.async();
		setTimeout(function() { // to wait async creation of inner control
			aContent = oField.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			assert.ok(oContent, "default content exist");
			assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");
			fnDone();
		}, 0);

		oStub.restore();

	});



	QUnit.test("external control", function(assert) {

		oField.setMaxConditions(1);
		oField.setDataType("Edm.Float");
		var oSlider = new Slider("S1");
		// fake keyboard handlers
		var fnDummy = function(oEvent){};
		oSlider.onsapprevious = fnDummy;
		oSlider.onsapnext = fnDummy;
		oSlider.onsapup = fnDummy;
		oSlider.onsapdown = fnDummy;
		oSlider.onsapbackspace = fnDummy;
		var oConditionsType = new ConditionsType();
		oConditionsType._sId = "S1-Type"; // to identify instance

		oSlider.bindProperty("value", { path: '$field>/conditions', type: oConditionsType});
		oField.setContent(oSlider);
		var oCondition = Condition.createCondition("EEQ", [70]);
		oCM.addCondition("Name", oCondition);
		oField.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.notOk(!!oField.getAggregation("_content"), "Field has no internal content");
		assert.ok(oSlider.getDomRef(), "Slider rendered");
		assert.equal(oSlider.getValue(), 70, "Value of Slider");
		assert.equal(oSlider.getModel("$field"), oField._oManagedObjectModel, "Slider has ManagedObjectModel of Field");
		assert.equal(oSlider.getBindingPath("value"), "/conditions", "Slider value bound to Fields internal value");
		assert.notEqual(oSlider.onsapprevious, fnDummy, "onsapprevious overwritten");
		assert.notEqual(oSlider.onsapnext, fnDummy, "onsapnext overwritten");
		assert.notEqual(oSlider.onsapup, fnDummy, "onsapup overwritten");
		assert.notEqual(oSlider.onsapdown, fnDummy, "onsapdown overwritten");
		assert.notEqual(oSlider.onsapbackspace, fnDummy, "onsapbackspace overwritten");
		assert.equal(oField._oConditionsType, oConditionsType, "ConditionsType of Slider used in Field");

		oField.destroyContent();
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent, "internal content exist");
		assert.equal(oContent.getMetadata().getName(), "sap.m.Input", "sap.m.Input is used");
		assert.equal(oSlider.onsapprevious, fnDummy, "onsapprevious back to original");
		assert.equal(oSlider.onsapnext, fnDummy, "onsapnext back to original");
		assert.equal(oSlider.onsapup, fnDummy, "onsapup back to original");
		assert.equal(oSlider.onsapdown, fnDummy, "onsapdown back to original");
		assert.equal(oSlider.onsapbackspace, fnDummy, "onsapbackspace back to original");
		assert.notEqual(oField._oConditionsType, oConditionsType, "ConditionsType of Slider not used in Field");
		assert.ok(oField._oConditionsType._bCreatedByField, "ConditionsType is created by Field");

		oSlider = new Slider("S1");
		oConditionsType = new ConditionsType();
		oConditionsType._sId = "S1-Type"; // to identify instance
		oSlider.bindProperty("value", { path: '$field>/conditions', type: oConditionsType});
		oField.setContent(oSlider);
		sap.ui.getCore().applyChanges();

		assert.notOk(!!oField.getAggregation("_content"), "Field has no internal content");

	});

	QUnit.test("external display control", function(assert) {

		oField.setMaxConditions(1);
		oField.setDataType("Edm.Float");
		var oProgressIndicator = new ProgressIndicator("P1");
		var oConditionsType = new ConditionsType();
		oConditionsType._sId = "P1-Type"; // to identify instance
		oProgressIndicator.bindProperty("percentValue", { path: '$field>/conditions', type: oConditionsType});
		oField.setContentDisplay(oProgressIndicator);
		var oCondition = Condition.createCondition("EEQ", [70]);
		oCM.addCondition("Name", oCondition);
		oField.placeAt("content");
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent, "Field has internal content");
		assert.equal(oContent && oContent.getMetadata().getName(), "sap.m.Input", "sap.m.Input is used");
		assert.notOk(oProgressIndicator.getDomRef(), "ProgressIndicator not rendered");
		assert.equal(oProgressIndicator.getPercentValue(), 70, "Value of ProgressIndicator");
		assert.equal(oProgressIndicator.getModel("$field"), oField._oManagedObjectModel, "ProgressIndicator has ManagedObjectModel of Field");
		assert.equal(oProgressIndicator.getBindingPath("percentValue"), "/conditions", "ProgressIndicator value bound to Fields internal value");
		assert.notEqual(oField._oConditionsType, oConditionsType, "ConditionsType of ProgressIndicator not used in Field");
		assert.ok(oField._oConditionsType._bCreatedByField, "ConditionsType is created by Field");

		oField.setEditMode(library.EditMode.Display);
		sap.ui.getCore().applyChanges();
		assert.notOk(!!oField.getAggregation("_content"), "Field has no internal content");
		assert.ok(oProgressIndicator.getDomRef(), "ProgressIndicator is rendered");
		assert.equal(oField._oConditionsType, oConditionsType, "ConditionsType of ProgressIndicator used in Field");

		oField.destroyContentDisplay();
		sap.ui.getCore().applyChanges();
		aContent = oField.getAggregation("_content");
		oContent = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent, "internal content exist");
		assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");

	});

	QUnit.test("external edit control", function(assert) {

		// event if SegmentedButton makes not much sense - just for test of list binding
		var oItem = new SegmentedButtonItem("SBI");
		var oConditionType = new ConditionType();
		oConditionType._sId = "SB1-Type"; // to identify instance
		oItem.bindProperty("text", { path: '$field>', type: oConditionType});
		var oSegmentedButton = new SegmentedButton("SB1");
		oSegmentedButton.bindAggregation("items", { path: '$field>/conditions', template: oItem });
		oField.setContentEdit(oSegmentedButton);
		var oCondition = Condition.createCondition("EQ", ["A"]);
		oCM.addCondition("Name", oCondition);
		oCondition = Condition.createCondition("EQ", ["B"]);
		oCM.addCondition("Name", oCondition);
		oField.placeAt("content");
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.notOk(!!oContent, "Field has no internal content");
		assert.ok(oSegmentedButton.getDomRef(), "SegmentedButton is rendered");
		var aItems = oSegmentedButton.getItems();
		assert.equal(aItems.length, 2, "SegmentedButton has 2 items");
		assert.equal(aItems[0].getText(), "=A", "Text of Item0");
		assert.equal(aItems[1].getText(), "=B", "Text of Item1");
		assert.equal(oField._oConditionType, oConditionType, "ConditionType of SegmentedButton used in Field");

		oField.setEditMode(library.EditMode.Display);
		sap.ui.getCore().applyChanges();
		aContent = oField.getAggregation("_content");
		oContent = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent, "Field has internal content");
		assert.equal(oContent && oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");
		assert.notOk(oSegmentedButton.getDomRef(), "SegmentedButton is not rendered");
		assert.notEqual(oField._oConditionType, oConditionType, "ConditionType of SegmentedButton not used in Field");
		assert.notOk(oField._oConditionType, "no ConditionType used");
		assert.ok(oField._oConditionsType._bCreatedByField, "ConditionsType is created by Field");

		oField.setEditMode(library.EditMode.Edit);
		oField.destroyContentEdit();
		sap.ui.getCore().applyChanges();
		aContent = oField.getAggregation("_content");
		oContent = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent, "internal content exist");
		assert.equal(oContent.getMetadata().getName(), "sap.m.MultiInput", "sap.m.MultiInput is used");

	});

	QUnit.test("getFocusDomRef", function(assert) {

		oField.placeAt("content");
		sap.ui.getCore().applyChanges();
		assert.equal(oField.getFocusDomRef().id, "F1-inner-inner", "FocusDomRef");

	});

	QUnit.test("Label association", function(assert) {

		var oLabel = new Label("L1", { text: "test", labelFor: oField }).placeAt("content");
		oField.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(jQuery("#L1").attr("for"), "F1-inner-inner", "Label points to focusable DomRef");
		oLabel.destroy();

	});

	QUnit.test("Label property & connectLabel", function(assert) {

		var oLabel = new Label("L1").placeAt("content");
		oField.setLabel("Test");
		oField.connectLabel(oLabel);

		assert.equal(oLabel.getText(), "Test", "Label text");
		assert.equal(oLabel.getLabelFor(), "F1", "Label labelFor");

		oField.setLabel("Hello");
		assert.equal(oLabel.getText(), "Hello", "Label text");

		oLabel.destroy();

	});

	QUnit.test("enhanceAccessibilityState", function(assert) {

		oField.placeAt("content");
		var oParent = oField.getParent();
		var iCalled = 0;
		var sId = "";
		if (oParent) { // simulate enhanceAccessibilityState
			oParent.enhanceAccessibilityState = function(oElement, mAriaProps) {
				iCalled++;
				sId = oElement.getId();
			};
		}

		sap.ui.getCore().applyChanges();

		assert.ok(iCalled >= 1, "enhanceAccessibilityState called on Parent");
		assert.equal(sId, "F1", "enhanceAccessibilityState called for Field");
		delete oParent.enhanceAccessibilityState;

	});

	QUnit.test("getAccessibilityInfo", function(assert) {

		assert.deepEqual(oField.getAccessibilityInfo(), {}, "empty accessibility info returned if no content");

		oField.placeAt("content");
		sap.ui.getCore().applyChanges();
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.deepEqual(oField.getAccessibilityInfo(), oContent.getAccessibilityInfo(), "accessibility info of content returned");

	});

	QUnit.test("Currency rendering", function(assert) {

		oField.setDataType("sap.ui.model.type.Currency");
		oField.placeAt("content");
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		assert.ok(aContent.length > 0, "default content exist");
		assert.equal(aContent.length, 2, "2 content controls");
		var oContent1 = aContent && aContent.length > 0 && aContent[0];
		var oContent2 = aContent && aContent.length > 1 && aContent[1];
		assert.ok(oContent1 instanceof MultiInput, "MultiInput rendered");
		assert.ok(oContent2 instanceof Input, "Input rendered");
		assert.ok(oContent1.getEditable(), "MultiInput editable");
		assert.ok(oContent2.getEditable(), "Input editable");
		assert.equal(oContent1.getModel("$field"), oField._oManagedObjectModel, "MultiInput has ManagedObjectModel of Field");
		assert.equal(oContent1.getBindingPath("tokens"), "/conditions", "MultiInput tokens bound to Field conditions");
		assert.notOk(oContent1.getShowValueHelp(), "no valueHelp");
		assert.equal(oField._oConditionType.oFormatOptions.valueType.oFormatOptions.showMeasure, false, "showMeasure set to false on internal type");
		assert.equal(oField._oConditionType.oFormatOptions.valueType.oFormatOptions.strictParsing, true, "strictParsing set to true on internal type");

		var oSuggestControl = oField.getControlForSuggestion();
		assert.equal(oSuggestControl, oContent2, "Unit control is used for suggestion");

		// in display mode only one control
		oContent1 = undefined; oContent2 = undefined;
		oField.setEditMode(library.EditMode.Display);
		sap.ui.getCore().applyChanges();

		aContent = oField.getAggregation("_content");
		assert.ok(aContent.length > 0, "default content exist");
		assert.equal(aContent.length, 1, "1 content control");
		oContent1 = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent1 instanceof Text, "Text rendered");

		// editable: again 2 Fields but currency readOnly
		oContent1 = undefined; oContent2 = undefined;
		oField.setEditMode(library.EditMode.EditableReadOnly);
		aContent = oField.getAggregation("_content");
		assert.equal(aContent.length, 2, "2 content controls");
		oContent1 = aContent && aContent.length > 0 && aContent[0];
		oContent2 = aContent && aContent.length > 1 && aContent[1];
		assert.ok(oContent1 instanceof MultiInput, "MultiInput rendered");
		assert.ok(oContent2 instanceof Input, "Input rendered");
		assert.ok(oContent1.getEditable(), "MultiInput editable");
		assert.notOk(oContent2.getEditable(), "Input not editable");
		assert.equal(oField._oConditionType.oFormatOptions.valueType.oFormatOptions.showMeasure, false, "showMeasure set to false on internal type");
		assert.equal(oField._oConditionType.oFormatOptions.valueType.oFormatOptions.strictParsing, true, "strictParsing set to true on internal type");

		// if no unit should be displayed only one control should be rendered (original data type must be used, not changed by one with showMeagure=false)
		oContent1 = undefined; oContent2 = undefined;
		oField.setDataTypeFormatOptions({showMeasure: false});
		sap.ui.getCore().applyChanges();
		aContent = oField.getAggregation("_content");
		assert.equal(aContent.length, 1, "1 content control");
		oContent1 = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent1 instanceof MultiInput, "MultiInput rendered");
		assert.notOk(oField._oUnitOriginalType, "original type used for inner control");

		// editable:  but currency in display mode
		oContent1 = undefined; oContent2 = undefined;
		oField.setDataTypeFormatOptions({showMeasure: true});
		oField.setEditMode(library.EditMode.EditableDisplay);
		sap.ui.getCore().applyChanges();
		aContent = oField.getAggregation("_content", []);
		assert.equal(aContent.length, 1, "1 content control");
		oContent1 = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent1 instanceof MultiInput, "MultiInput rendered");
		assert.equal(oContent1.getBindingPath("description"), "/conditions", "MultiInput description bound to Field conditions");

	});

	QUnit.module("Field APIs", {
		beforeEach: function() {
			oCM = new ConditionModel();
			sap.ui.getCore().setModel(oCM, "cm");
			oField = new FieldBase("F1", {
				conditions: "{cm>/conditions/Name}"
			});
		},
		afterEach: function() {
			oField.destroy();
			oField = undefined;
			oCM.destroy();
			oCM = undefined;
			FieldBase._init();
		}
	});

	QUnit.test("getMaxConditionsForHelp", function(assert) {

		assert.equal(oField.getMaxConditionsForHelp(), -1, "default");
		oField.setDataType("sap.ui.model.type.Currency");
		oField.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(oField.getMaxConditionsForHelp(), 1, "for Currency");

	});

	QUnit.test("_getOperators", function(assert) {

		sinon.spy(FilterOperatorUtil, "getOperatorsForType");

		var aOperators = oField._getOperators();
		assert.ok(aOperators.length > 0, "Operators returned");
		assert.ok(FilterOperatorUtil.getOperatorsForType.calledWith(BaseType.String), "Default operators for string used");

		oField.setDataType("sap.ui.model.type.Integer");
		aOperators = oField._getOperators();
		assert.ok(aOperators.length > 0, "Operators returned");
		assert.ok(FilterOperatorUtil.getOperatorsForType.calledWith(BaseType.Numeric), "Default operators for number used");

		FilterOperatorUtil.getOperatorsForType.restore();

	});

	var oFieldEditMulti, oFieldEditSingle, oFieldDisplay, oFieldSearch;

	QUnit.module("conditions & properties", {
		beforeEach: function() {
			oCM = new ConditionModel();
			sap.ui.getCore().setModel(oCM, "cm");

			oFieldEditMulti = new FieldBase("F1", { editMode: library.EditMode.Editable, conditions: "{cm>/conditions/Name}" });
			oFieldEditSingle = new FieldBase("F2", { editMode: library.EditMode.Editable, conditions: "{cm>/conditions/Name}", maxConditions: 1 });
			sinon.stub(oFieldEditSingle, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
			oFieldDisplay = new FieldBase("F3", { editMode: library.EditMode.Display, conditions: "{cm>/conditions/Name}" });
			oFieldSearch = new FieldBase("F4", { maxConditions: 1, conditions: "{cm>/conditions/$search}" });
			oFieldEditMulti.placeAt("content");
			oFieldEditSingle.placeAt("content");
			oFieldDisplay.placeAt("content");
			oFieldSearch.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			oFieldEditMulti.destroy();
			oFieldEditSingle.destroy();
			oFieldDisplay.destroy();
			oFieldSearch.destroy();
			oFieldEditMulti = undefined;
			oFieldEditSingle = undefined;
			oFieldDisplay = undefined;
			oFieldSearch = undefined;
			oCM.destroy();
			oCM = undefined;
			FieldBase._init();
		}
	});

	QUnit.test("value", function(assert) {

		var oCondition = Condition.createCondition("EEQ", ["Test"]);
		oCM.addCondition("Name", oCondition);
		oCondition = Condition.createCondition("EEQ", ["bar"]);
		oCM.addCondition("$search", oCondition);

		var fnDone = assert.async();
		setTimeout(function() { // to update ConditionModel
			var aContent = oFieldEditMulti.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getMetadata().getName(), "sap.m.MultiInput", "sap.m.MultiInput is used");
			assert.equal(oContent.getValue && oContent.getValue(), "", "no value set on MultiInput control");
			var aTokens = oContent.getTokens ? oContent.getTokens() : [];
			assert.equal(aTokens.length, 1, "MultiInput has one Token");
			var oToken = aTokens[0];
			assert.equal(oToken && oToken.getText(), "Test", "Text on token set");

			aContent = oFieldEditSingle.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getMetadata().getName(), "sap.m.Input", "sap.m.Input is used");
			assert.equal(oContent.getValue && oContent.getValue(), "Test", "Value set on Input control");

			aContent = oFieldDisplay.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");
			assert.equal(oContent.getText && oContent.getText(), "Test", "Text set on Text control");

			aContent = oFieldSearch.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getMetadata().getName(), "sap.m.SearchField", "sap.m.SearchField is used");
			assert.equal(oContent.getValue && oContent.getValue(), "bar", "value set on Searchfield control");
			fnDone();
		}, 0);

	});

	QUnit.test("description", function(assert) {

		oFieldEditMulti.setDisplay("DescriptionValue");
		var oCondition = Condition.createCondition("EEQ", ["Test", "Hello"]);
		oCM.addCondition("Name", oCondition);
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		setTimeout(function() { // to update ConditionModel
			var aContent = oFieldEditMulti.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			var aTokens = oContent.getTokens ? oContent.getTokens() : [];
			var oToken = aTokens[0];
			assert.equal(oToken && oToken.getText(), "Hello (Test)", "Text on token set");

			aContent = oFieldEditSingle.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getValue && oContent.getValue(), "Test", "Value set on Input control");

			oFieldEditMulti.setDisplay(library.FieldDisplay.Description);
			oFieldEditSingle.setDisplay(library.FieldDisplay.Description);
			oFieldDisplay.setDisplay(library.FieldDisplay.DescriptionValue);
			sap.ui.getCore().applyChanges();

			// TODO should token text also belong on the property???
			aContent = oFieldEditSingle.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getValue(), "Hello", "Value set on Input control");
			aContent = oFieldDisplay.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getText && oContent.getText(), "Hello (Test)", "Text set on Text control");

			oFieldEditMulti.setDisplay(library.FieldDisplay.ValueDescription);
			oFieldEditSingle.setDisplay(library.FieldDisplay.ValueDescription);
			oFieldDisplay.setDisplay(library.FieldDisplay.ValueDescription);
			sap.ui.getCore().applyChanges();

			//			aContent = oFieldEditSingle.getAggregation("_content");
			//			oContent = aContent && aContent.length > 0 && aContent[0];
			//			assert.equal(oContent.getValue(), "Test", "Value set on Input control");
			aContent = oFieldDisplay.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			//					assert.equal(oContent.getText && oContent.getText(), "Test (Hello)", "Text set on Text control");
			fnDone();
		}, 0);

	});

	//	QUnit.test("displayFormat", function(assert) {
	//
	//		var sEmptyValue = null;
	//		var sEmptyAdditionalValue = null;
	//		var sValue = "Value";
	//		var sAdditionalValue = "Additional Value";
	//
	//		assert.ok(sValue,"Display Format Value:");
	//		assert.equal(Field.formatText(sEmptyValue,sEmptyAdditionalValue,library.FieldDisplay.Value), "", "If the value is empty we see the empty string");
	//		assert.equal(Field.formatText(sValue,sEmptyAdditionalValue,library.FieldDisplay.Value), sValue, "If the value is not empty we see the value");
	//		assert.equal(Field.formatText(sValue,sAdditionalValue,library.FieldDisplay.Value), sValue, "The additional value is ignored");
	//
	//		assert.ok(sValue,"Display Format Value ( Description ):");
	//		assert.equal(Field.formatText(sEmptyValue,sEmptyAdditionalValue,library.FieldDisplay.ValueDescription), "", "If both strings are empty we see the empty string");
	//		assert.equal(Field.formatText(sValue,sEmptyAdditionalValue,library.FieldDisplay.ValueDescription), sValue, "If additional value is empty, we see only the value");
	//		assert.equal(Field.formatText(sEmptyValue,sAdditionalValue,library.FieldDisplay.ValueDescription), " (" + sAdditionalValue + ")", "If the value is empty, we see the empty string for that");
	//		assert.equal(Field.formatText(sValue,sAdditionalValue,library.FieldDisplay.ValueDescription),  sValue + " (" + sAdditionalValue + ")", "If both are supplied we see sValue (sAdditionalValue)");
	//
	//		assert.ok(sValue,"Display Format Description (Value):");
	//		assert.equal(Field.formatText(sEmptyValue,sEmptyAdditionalValue,library.FieldDisplay.DescriptionValue), "", "If both strings are empty we see the empty string");
	//		assert.equal(Field.formatText(sValue,sEmptyAdditionalValue,library.FieldDisplay.DescriptionValue), " (" + sValue + ")", "If additional value is empty, we see (Value) for that");
	//		assert.equal(Field.formatText(sEmptyValue,sAdditionalValue,library.FieldDisplay.DescriptionValue), sAdditionalValue, "If the value is empty, we see only the additional value");
	//		assert.equal(Field.formatText(sValue,sAdditionalValue,library.FieldDisplay.DescriptionValue),  sAdditionalValue + " (" + sValue + ")", "If both are supplied we see sAdditionalValue (sValue)");
	//
	//
	//		assert.ok(sValue,"Display Format Description:");
	//		assert.equal(Field.formatText(sEmptyValue,sEmptyAdditionalValue,library.FieldDisplay.Description), "", "If the additional is empty  value we see the empty value for that");
	//		assert.equal(Field.formatText(sEmptyValue,sAdditionalValue,library.FieldDisplay.Description), sAdditionalValue, "If the additional value is nt empty we see the additional value");
	//		assert.equal(Field.formatText(sValue,sAdditionalValue,library.FieldDisplay.Description), sAdditionalValue, "The value is ignored");
	//
	//	});

	QUnit.test("multipleLines", function(assert) {

		var oCondition = Condition.createCondition("EEQ", ["Test"]);
		oCM.addCondition("Name", oCondition);
		oFieldEditMulti.setMultipleLines(true);
		oFieldEditSingle.setMultipleLines(true);
		oFieldDisplay.setMultipleLines(true);
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		setTimeout(function() { // to update ConditionModel
			// TODO Multiline on MultiEdit????
			var aContent = oFieldEditSingle.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			assert.ok(oContent instanceof TextArea, "TextArea rendered");
			assert.equal(oContent.getValue && oContent.getValue(), "Test", "Text set on TextArea control");

			aContent = oFieldDisplay.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.ok(oContent instanceof Text, "Text rendered");
			assert.ok(oContent.getWrapping && oContent.getWrapping(), "Text wrapping enabled");
			assert.equal(oContent.getText && oContent.getText(), "Test", "Text set on Text control");
			fnDone();
		}, 0);

	});

	QUnit.test("dataType Date", function(assert) {

		var oCondition = Condition.createCondition("EEQ", [new Date(2017, 8, 19)]);
		oCM.addCondition("Name", oCondition);
		oFieldEditMulti.setDataTypeFormatOptions({style: "long"});
		oFieldEditMulti.setDataType("sap.ui.model.type.Date");
		oFieldEditSingle.setDataTypeFormatOptions({style: "long", calendarType: "Japanese"});
		oFieldEditSingle.setDataType("sap.ui.model.type.Date");
		oFieldDisplay.setMaxConditions(1);
		oFieldDisplay.setDataType("sap.ui.model.type.Date");

		oCondition = Condition.createCondition("EEQ", [new Date(Date.UTC(2018, 11, 20))]);
		oCM.addCondition("Date", oCondition);
		var oFieldEditSingle2 = new FieldBase("F5", {
			editMode: library.EditMode.Editable,
			conditions: "{cm>/conditions/Date}",
			maxConditions: 1,
			dataType: "sap.ui.model.odata.type.DateTime",
			dataTypeConstraints: {displayFormat: "Date"},
			dataTypeFormatOptions: {pattern: "dd/MM/yyyy"}
		});
		sinon.stub(oFieldEditSingle2, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
		oFieldEditSingle2.placeAt("content");
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		setTimeout(function() { // to update ConditionModel
			sap.ui.getCore().applyChanges();
			var aContent = oFieldEditMulti.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			var oToken = oContent && oContent.getTokens()[0];
			assert.equal(oToken.getText(), "September 19, 2017", "Text set on Token");

			aContent = oFieldDisplay.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");
			assert.equal(oContent.getText(), "Sep 19, 2017", "Text set on Text control");

			aContent = oFieldEditSingle.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.ok(oContent instanceof DatePicker, "DatePicker rendered");
			assert.equal(oContent.getValue(), "2017-09-19", "Value set on DatePicker control");
			assert.equal(jQuery(oContent.getFocusDomRef()).val(), "September 19, 29 Heisei", "Value shown on DatePicker control");

			aContent = oFieldEditSingle2.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.ok(oContent instanceof DatePicker, "DatePicker rendered");
			assert.equal(oContent.getValue(), "2018-12-20", "Value set on DatePicker control");
			assert.equal(jQuery(oContent.getFocusDomRef()).val(), "20/12/2018", "Value shown on DatePicker control");

			oFieldEditSingle2.setEditMode(library.EditMode.Display);
			sap.ui.getCore().applyChanges();
			aContent = oFieldEditSingle2.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");
			assert.equal(oContent.getText(), "20/12/2018", "Text set on Text control");

			oFieldEditSingle2.destroy();
			fnDone();
		}, 0);

	});

	QUnit.test("dataType sap.ui.model.type.Time", function(assert) {

		var oCondition = Condition.createCondition("EEQ", [new Date(1970, 0, 1, 19, 0, 0)]);
		oCM.addCondition("Name", oCondition);
		oFieldEditSingle.setDataType("sap.ui.model.type.Time");
		oFieldDisplay.setMaxConditions(1);
		oFieldDisplay.setDataType("sap.ui.model.type.Time");
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		setTimeout(function() { // to update ConditionModel
			sap.ui.getCore().applyChanges();
			var aContent = oFieldEditSingle.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			assert.ok(oContent instanceof TimePicker, "TimePicker rendered");
			assert.equal(oContent.getValue(), "19:00:00", "Value set on TimePicker control");
			assert.equal(jQuery(oContent.getFocusDomRef()).val(), " 7:00:00 PM", "Value shown on TimePicker control");

			aContent = oFieldDisplay.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");
			assert.equal(oContent.getText(), "7:00:00 PM", "Text set on Text control");
			fnDone();
		}, 0);

	});

	QUnit.test("dataType DateTimeOffset", function(assert) {

		var oCondition = Condition.createCondition("EEQ", [new Date(2017, 10, 7, 13, 1, 24)]);
		oCM.addCondition("Name", oCondition);
		oFieldEditSingle.setDataTypeFormatOptions({pattern: "HH:mm:ss yyyy-MM-dd"});
		oFieldEditSingle.setDataType("Edm.DateTimeOffset");
		oFieldDisplay.setMaxConditions(1);
		oFieldDisplay.setDataType("Edm.DateTimeOffset");
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		setTimeout(function() { // to update ConditionModel
			sap.ui.getCore().applyChanges();
			var aContent = oFieldEditSingle.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			assert.ok(oContent instanceof DateTimePicker, "DateTimePicker rendered");
			assert.equal(oContent.getValue(), "2017-11-07T13:01:24", "Value set on DateTimePicker control");
			assert.equal(jQuery(oContent.getFocusDomRef()).val(), "13:01:24 2017-11-07", "Value shown on DateTimePicker control");

			aContent = oFieldDisplay.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");
			assert.equal(oContent.getText(), "Nov 7, 2017, 1:01:24 PM", "Text set on Text control");
			fnDone();
		}, 0);

	});

	QUnit.test("dataType Boolean", function(assert) {

		var oCondition = Condition.createCondition("EEQ", [true]);
		oCM.addCondition("Name", oCondition);
		oFieldEditSingle.setDisplay("Description");
		oFieldEditSingle.setDataType("Edm.Boolean");
		oFieldDisplay.setMaxConditions(1);
		oFieldDisplay.setDataType("Edm.Boolean");
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		setTimeout(function() { // to update ConditionModel
			var aContent = oFieldEditSingle.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			assert.ok(oContent instanceof Input, "Input rendered");
			assert.equal(oFieldEditSingle._sDefaultFieldHelp, "BoolDefaultHelp", "Default Field help set");
			var oFieldHelp = sap.ui.getCore().byId("BoolDefaultHelp");
			assert.ok(oFieldHelp && oFieldHelp instanceof BoolFieldHelp, "BoolFieldHelp used");
			assert.equal(oContent.getValue(), "Yes", "Value set on Input control");

			aContent = oFieldDisplay.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");
			assert.equal(oContent.getText(), "Yes", "Text set on Text control");

			if (oFieldHelp) {
				oFieldHelp.destroy(); // to initialze for next test
			}
			fnDone();
		}, 0);

	});

	QUnit.test("dataType Boolean, load BoolFieldHelp async", function(assert) {

		var oStub = sinon.stub(sap.ui, "require");
		oStub.withArgs("sap/ui/mdc/field/BoolFieldHelp").onFirstCall().returns(undefined);
		oStub.callThrough();

		var oCondition = Condition.createCondition("EEQ", [true]);
		oCM.addCondition("Name", oCondition);
		oFieldEditSingle.setDisplay("Description");
		oFieldEditSingle.setDataType("Edm.Boolean");
		oFieldDisplay.setMaxConditions(1);
		oFieldDisplay.setDataType("Edm.Boolean");
		sap.ui.getCore().applyChanges();

		var oFieldHelp = sap.ui.getCore().byId("BoolDefaultHelp");
		assert.notOk(oFieldHelp, "BoolFieldHelp not created sync");

		var fnDone = assert.async();
		setTimeout(function() { // to update ConditionModel and wait for async control creation
			var aContent = oFieldEditSingle.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			assert.ok(oContent instanceof Input, "Input rendered");
			assert.equal(oFieldEditSingle._sDefaultFieldHelp, "BoolDefaultHelp", "Default Field help set");
			oFieldHelp = sap.ui.getCore().byId("BoolDefaultHelp");
			assert.ok(oFieldHelp && oFieldHelp instanceof BoolFieldHelp, "BoolFieldHelp used");
			assert.equal(oContent.getValue(), "Yes", "Value set on Input control");

			aContent = oFieldDisplay.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");
			assert.equal(oContent.getText(), "Yes", "Text set on Text control");

			if (oFieldHelp) {
				oFieldHelp.destroy(); // to initialze for next test
			}
			fnDone();
		}, 0);

		oStub.restore();

	});


	QUnit.test("dataType sap.ui.model.type.Currency", function(assert) {

		var oCondition = Condition.createCondition("EEQ", [[123.45, "USD"]]);
		oCM.addCondition("Name", oCondition);
		oFieldEditSingle.setDataType("sap.ui.model.type.Currency");
		oFieldEditMulti.setDataType("sap.ui.model.type.Currency");
		oFieldDisplay.setMaxConditions(1);
		sinon.stub(oFieldDisplay, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
		oFieldDisplay.setDataType("sap.ui.model.type.Currency");
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		var oType = new Currency({showMeasure: false});
		sValue = oType.formatValue([123.45, "USD"], "string"); // because of special whitspaces and local dependend
		setTimeout(function() { // to update ConditionModel
			var aContent = oFieldEditSingle.getAggregation("_content");
			assert.equal(aContent.length, 2, "2 content controls");
			var oContent1 = aContent && aContent.length > 0 && aContent[0];
			var oContent2 = aContent && aContent.length > 1 && aContent[1];
			assert.ok(oContent1 instanceof Input, "Input rendered");
			assert.ok(oContent2 instanceof Input, "Input rendered");
			assert.equal(oContent1.getValue(), sValue, "Value set on number-Input control");
			assert.equal(oContent2.getValue(), "USD", "Value set on currency-Input control");

			aContent = oFieldEditMulti.getAggregation("_content");
			assert.equal(aContent.length, 2, "2 content controls");
			oContent1 = aContent && aContent.length > 0 && aContent[0];
			oContent2 = aContent && aContent.length > 1 && aContent[1];
			assert.ok(oContent1 instanceof MultiInput, "MultiInput rendered");
			assert.ok(oContent2 instanceof Input, "Input rendered");
			var aTokens = oContent1.getTokens ? oContent1.getTokens() : [];
			assert.equal(aTokens.length, 1, "MultiInput has one Token");
			var oToken = aTokens[0];
			assert.equal(oToken && oToken.getText(), sValue, "Text on token set");
			assert.equal(oContent2.getValue(), "USD", "Value set on currency-Input control");

			oType.destroy();
			oType = new Currency();
			sValue = oType.formatValue([123.45, "USD"], "string"); // because of special whitspaces and local dependend
			aContent = oFieldDisplay.getAggregation("_content");
			assert.equal(aContent.length, 1, "1 content control");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");
			assert.equal(oContent.getText(), sValue, "Text set on Text control");
			oType.destroy();
			fnDone();
		}, 0);

	});

	QUnit.test("width", function(assert) {

		oFieldEditMulti.setWidth("100px");
		oFieldEditSingle.setWidth("100px");
		oFieldDisplay.setWidth("100px");
		sap.ui.getCore().applyChanges();

		assert.equal(jQuery("#F1").width(), 100, "Width of Multi-Edit Field");
		assert.equal(jQuery("#F2").width(), 100, "Width of Single-Edit Field");
		assert.equal(jQuery("#F3").width(), 100, "Width of Display Field");

		var aContent = oFieldEditMulti.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getWidth(), "100%", "width of 100% set on MultiInput control");

		aContent = oFieldEditSingle.getAggregation("_content");
		oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getWidth(), "100%", "width of 100% set on Input control");

		aContent = oFieldDisplay.getAggregation("_content");
		oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getWidth(), "100%", "width of 100% set on Text control");

	});

	QUnit.test("required", function(assert) {

		var oLabel = new Label("L1", { text: "test", labelFor: oFieldEditMulti }).placeAt("content");
		oFieldEditMulti.setRequired(true);
		sap.ui.getCore().applyChanges();

		var aContent = oFieldEditMulti.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent.getRequired(), "Required set on Input control");
		assert.ok(oLabel.isRequired(), "Label rendered as required");
		oLabel.destroy();

	});

	QUnit.test("placeholder", function(assert) {

		oFieldEditMulti.setPlaceholder("Test");
		sap.ui.getCore().applyChanges();

		var aContent = oFieldEditMulti.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getPlaceholder(), "Test", "Placeholder set on MultiInput control");

	});

	QUnit.test("valueState", function(assert) {

		oFieldEditMulti.setValueState("Error");
		oFieldEditMulti.setValueStateText("Test");
		sap.ui.getCore().applyChanges();

		var aContent = oFieldEditMulti.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getValueState(), "Error", "ValueState set on MultiInput control");
		assert.equal(oContent.getValueStateText(), "Test", "ValueStateText set on MultiInput control");

	});

	QUnit.test("textAlign", function(assert) {

		oFieldEditMulti.setTextAlign("End");
		oFieldEditSingle.setTextAlign("End");
		oFieldDisplay.setTextAlign("End");
		sap.ui.getCore().applyChanges();

		var aContent = oFieldEditMulti.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getTextAlign(), "End", "TextAlign set on MultiInput control");

		aContent = oFieldEditSingle.getAggregation("_content");
		oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getTextAlign(), "End", "TextAlign set on Input control");

		aContent = oFieldDisplay.getAggregation("_content");
		oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getTextAlign(), "End", "TextAlign set on Text control");

	});

	QUnit.test("textDirection", function(assert) {

		oFieldEditMulti.setTextDirection("RTL");
		oFieldEditSingle.setTextDirection("RTL");
		oFieldDisplay.setTextDirection("RTL");
		sap.ui.getCore().applyChanges();

		var aContent = oFieldEditMulti.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getTextDirection(), "RTL", "TextDirection set on MultiInput control");

		aContent = oFieldEditSingle.getAggregation("_content");
		oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getTextDirection(), "RTL", "TextDirection set on Input control");

		aContent = oFieldDisplay.getAggregation("_content");
		oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getTextDirection(), "RTL", "TextDirection set on Text control");

	});

	QUnit.test("tooltip", function(assert) {

		oFieldEditMulti.setTooltip("Test");
		sap.ui.getCore().applyChanges();

		var aContent = oFieldEditMulti.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getTooltip(), "Test", "Tooltip set on MultiInput control");

	});

	QUnit.test("ariaLabelledBy", function(assert) {

		var fnDone = assert.async();
		sap.ui.require(["sap/m/MultiInput"], function(MultiInput) {
			setTimeout(function() {
				/* MultiInput */
				// initial empty
				var aContent = oFieldEditMulti.getAggregation("_content");
				var oContent = aContent && aContent.length > 0 && aContent[0];
				assert.equal(oContent.getAriaLabelledBy().length, 0, "inner control not labelled");

				// add
				oFieldEditMulti.addAriaLabelledBy("X1");
				assert.equal(oContent.getAriaLabelledBy().length, 1, "Inner control labelled");
				assert.equal(oContent.getAriaLabelledBy()[0], "X1", "Inner control label added");
				oFieldEditMulti.addAriaLabelledBy("X2");
				assert.equal(oContent.getAriaLabelledBy().length, 2, "Inner control labelled");
				assert.equal(oContent.getAriaLabelledBy()[1], "X2", "Inner control label added");

				// remove
				oFieldEditMulti.removeAriaLabelledBy("X1");
				assert.equal(oContent.getAriaLabelledBy().length, 1, "Inner control labelled");
				assert.equal(oContent.getAriaLabelledBy()[0], "X2", "Inner control label removed");

				// remove inner controls to test initial setting
				oFieldEditMulti.destroyAggregation("_content");
				oFieldEditMulti.rerender();
				aContent = oFieldEditMulti.getAggregation("_content");
				oContent = aContent && aContent.length > 0 && aContent[0];
				assert.equal(oContent.getAriaLabelledBy().length, 1, "Inner control labelled");
				assert.equal(oContent.getAriaLabelledBy()[0], "X2", "Inner control label set");

				/* Input */
				// initial empty
				aContent = oFieldEditSingle.getAggregation("_content");
				oContent = aContent && aContent.length > 0 && aContent[0];
				assert.equal(oContent.getAriaLabelledBy().length, 0, "inner control not labelled");

				// add
				oFieldEditSingle.addAriaLabelledBy("X1");
				assert.equal(oContent.getAriaLabelledBy().length, 1, "Inner control labelled");
				assert.equal(oContent.getAriaLabelledBy()[0], "X1", "Inner control label added");
				oFieldEditSingle.addAriaLabelledBy("X2");
				assert.equal(oContent.getAriaLabelledBy().length, 2, "Inner control labelled");
				assert.equal(oContent.getAriaLabelledBy()[1], "X2", "Inner control label added");

				// remove
				oFieldEditSingle.removeAriaLabelledBy("X1");
				assert.equal(oContent.getAriaLabelledBy().length, 1, "Inner control labelled");
				assert.equal(oContent.getAriaLabelledBy()[0], "X2", "Inner control label removed");

				// remove inner controls to test initial setting
				oFieldEditSingle.destroyAggregation("_content");
				oFieldEditSingle.rerender();
				aContent = oFieldEditSingle.getAggregation("_content");
				oContent = aContent && aContent.length > 0 && aContent[0];
				assert.equal(oContent.getAriaLabelledBy().length, 1, "Inner control labelled");
				assert.equal(oContent.getAriaLabelledBy()[0], "X2", "Inner control label set");

				/* Text - test if ariaLabelledBy not supported breaks*/
				aContent = oFieldDisplay.getAggregation("_content");
				oContent = aContent && aContent.length > 0 && aContent[0];
				oFieldDisplay.addAriaLabelledBy("X1");
				oFieldDisplay.removeAriaLabelledBy("X1");

				fnDone();
			}, 0);
		});

	});

	QUnit.module("Eventing", {
		beforeEach: function() {
			oCM = new ConditionModel();
			sap.ui.getCore().setModel(oCM, "cm");
			oField = new FieldBase("F1", {
				conditions: "{cm>/conditions/Name}"
			});
			//			oField.attachChange(_myChangeHandler);
			oField._fireChange = _myFireChange;
			oField.attachEvent("change", _myChangeHandler);
			oField.attachLiveChange(_myLiveChangeHandler);
			oField.attachPress(_myPressHandler);
			oField.attachParseError(_myParseErrorHandler);
			oField.attachValidationError(_myValidationErrorHandler);
			oField.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			oField.destroy();
			oField = undefined;
			iCount = 0;
			sId = null;
			sValue = null;
			bValid = null;
			oPromise = null;
			iLiveCount = 0;
			sLiveId = null;
			sLiveValue = null;
			iPressCount = 0;
			sPressId = "";
			iParseError = 0;
			iValidationError = 0;
			FieldBase._init();
		}
	});

	QUnit.test("with multi value", function(assert) {

		var fnDone = assert.async();
		oField.setDisplay("DescriptionValue");
		sap.ui.getCore().applyChanges();
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent.focus();
		jQuery(oContent.getFocusDomRef()).val("X");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);

		assert.equal(iCount, 1, "change event fired once");
		assert.equal(sId, "F1", "change event fired on Field");
		assert.equal(sValue, "X", "change event value");
		assert.ok(bValid, "change event valid");
		assert.ok(oPromise, "Promise returned");
		oPromise.then(function(vResult) {
			assert.ok(vResult, "Promise resolved");
			var aConditions = oCM.getConditions("Name");
			assert.deepEqual(vResult, aConditions, "Promise result");
			assert.equal(aConditions.length, 1, "one condition in Codition model");
			assert.equal(aConditions[0].values[0], "X", "condition value");
			assert.equal(aConditions[0].operator, "Contains", "condition operator");
			var aTokens = oContent.getTokens ? oContent.getTokens() : [];
			assert.equal(aTokens.length, 1, "MultiInput has one Token");
			var oToken = aTokens[0];
			assert.equal(oToken && oToken.getText(), "*X*", "Text on token set");

			iCount = 0;
			sId = ""; sValue = ""; bValid = undefined; oPromise = undefined;
			jQuery(oContent.getFocusDomRef()).val("X");
			qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
			setTimeout(function() { // to wait for valueStateMessage in IE (otherwise it fails after control destroyed)
				assert.equal(iCount, 1, "change event fired");
				assert.notOk(bValid, "change event not valid");
				assert.equal(sValue, "X", "change event value");
				assert.ok(oPromise, "Promise returned");
				oPromise.then(function(vResult) {
					assert.notOk(true, "Promise must not be resolved");
					fnDone();
				}).catch(function(oException) {
					assert.ok(true, "Promise rejected");
					assert.equal(oException, "X", "wrongValue");
					aConditions = oCM.getConditions("Name");
					assert.equal(aConditions.length, 1, "one condition in Codition model");
					assert.equal(aConditions[0].values[0], "X", "condition value");
					assert.equal(aConditions[0].operator, "Contains", "condition operator");
					aTokens = oContent.getTokens ? oContent.getTokens() : [];
					assert.equal(aTokens.length, 1, "MultiInput has one Token");
					oToken = aTokens[0];
					assert.equal(oToken && oToken.getText(), "*X*", "Text on token set");

					// delete Token
					iCount = 0;
					sId = ""; sValue = ""; bValid = false; oPromise = undefined;
					oToken._deleteIcon.firePress();
					assert.equal(iCount, 1, "change event fired once");
					assert.equal(sId, "F1", "change event fired on Field");
					assert.equal(sValue, "", "change event value");
					assert.ok(bValid, "change event valid");
					assert.ok(oPromise, "Promise returned");
					oPromise.then(function(vResult) {
						assert.ok(vResult, "Promise resolved");
						aConditions = oCM.getConditions("Name");
						assert.deepEqual(vResult, aConditions, "Promise result");
						assert.equal(aConditions.length, 0, "no condition in Codition model after delete Token");
						aTokens = oContent.getTokens ? oContent.getTokens() : [];
						assert.equal(aTokens.length, 0, "MultiInput has no Token after delete");

						//simulate liveChange by calling from internal control
						oContent.fireLiveChange({ value: "Y" });
						assert.equal(iLiveCount, 1, "liveChange event fired once");
						assert.equal(sLiveId, "F1", "liveChange event fired on Field");
						assert.equal(sLiveValue, "Y", "liveChange event value");
						fnDone();
					});
				});
			}, 0);
		});

	});

	QUnit.test("with multi value and maxConditions", function(assert) {

		oField.setMaxConditions(2);
		var oCondition = Condition.createCondition("EQ", ["Test"]);
		oCM.addCondition("Name", oCondition);
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		setTimeout(function() { // to update ConditionModel
			var aContent = oField.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			oContent.focus();
			jQuery(oContent.getFocusDomRef()).val("X");
			qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);

			assert.equal(iCount, 1, "change event fired once");
			assert.equal(sId, "F1", "change event fired on Field");
			assert.ok(bValid, "change event valid");
			var aConditions = oCM.getConditions("Name");
			assert.equal(aConditions.length, 2, "two conditions in Codition model");
			assert.equal(aConditions[0].values[0], "Test", "first condition value");
			assert.equal(aConditions[0].operator, "EQ", "first condition operator");
			assert.equal(aConditions[1].values[0], "X", "second condition value");
			assert.equal(aConditions[1].operator, "Contains", "second condition operator");
			var aTokens = oContent.getTokens ? oContent.getTokens() : [];
			assert.equal(aTokens.length, 2, "MultiInput has two Tokens");
			var oToken = aTokens[1];
			assert.equal(oToken && oToken.getText(), "*X*", "Text on token set");

			iCount = 0;
			sId = ""; sValue = ""; bValid = false;
			jQuery(oContent.getFocusDomRef()).val("Y");
			qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);

			assert.equal(iCount, 1, "change event fired once");
			assert.equal(sId, "F1", "change event fired on Field");
			assert.ok(bValid, "change event valid");
			aConditions = oCM.getConditions("Name");
			assert.equal(aConditions.length, 2, "two conditions in Codition model");
			assert.equal(aConditions[0].values[0], "X", "first condition value");
			assert.equal(aConditions[0].operator, "Contains", "first condition operator");
			assert.equal(aConditions[1].values[0], "Y", "second condition value");
			assert.equal(aConditions[1].operator, "Contains", "second condition operator");
			aTokens = oContent.getTokens ? oContent.getTokens() : [];
			assert.equal(aTokens.length, 2, "MultiInput has two Tokens");
			oToken = aTokens[0];
			assert.equal(oToken && oToken.getText(), "*X*", "Text on token set");
			oToken = aTokens[1];
			assert.equal(oToken && oToken.getText(), "*Y*", "Text on token set");
			fnDone();
		}, 0);

	});

	QUnit.test("wrong input on multi value", function(assert) {

		oField.setDataTypeConstraints({maximum: 10});
		oField.setDataType("sap.ui.model.type.Integer");
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent.focus();
		jQuery(oContent.getFocusDomRef()).val("15");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		setTimeout(function() { // to wait for valueStateMessage in IE (otherwise it fails after control destroyed)
			assert.equal(iCount, 1, "change event fired once");
			assert.equal(sId, "F1", "change event fired on Field");
			assert.equal(sValue, "15", "change event value");
			assert.notOk(bValid, "change event not valid");
			assert.ok(oPromise, "Promise returned");
			var aConditions = oCM.getConditions("Name");
			assert.equal(aConditions.length, 0, "no condition in Codition model");
			var aTokens = oContent.getTokens ? oContent.getTokens() : [];
			assert.equal(aTokens.length, 0, "MultiInput has no Token");
			assert.equal(jQuery(oContent.getFocusDomRef()).val(), "15", "Value still in Input");
			assert.equal(oField.getValueState(), "Error", "ValueState set on Field");

			oPromise.then(function(vResult) {
				assert.notOk(true, "Promise must not be resolved");
				fnDone();
			}).catch(function(oException) {
				assert.ok(true, "Promise must be rejected");
				fnDone();
			});
		}, 0);

	});

	QUnit.test("wrong input on multi value without ConditionModel", function(assert) {

		oField.destroy();
		oField = new FieldBase("F1", {
			dataTypeConstraints: {maximum: 10},
			dataType: "sap.ui.model.type.Integer"
		}).placeAt("content");
		oField._fireChange = _myFireChange;
		oField.attachEvent("change", _myChangeHandler);
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent.focus();
		jQuery(oContent.getFocusDomRef()).val("15");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		setTimeout(function() { // to wait for valueStateMessage in IE (otherwise it fails after control destroyed)
			assert.equal(iCount, 1, "change event fired once");
			assert.equal(sId, "F1", "change event fired on Field");
			assert.equal(sValue, "15", "change event value");
			assert.notOk(bValid, "change event not valid");
			var aConditions = oField.getConditions();
			assert.equal(aConditions.length, 0, "no conditions");
			assert.equal(jQuery(oContent.getFocusDomRef()).val(), "15", "Value still in Input");
			assert.equal(oField.getValueState(), "Error", "ValueState set on Field");

			fnDone();
		}, 0);

	});

	QUnit.test("with single value", function(assert) {

		sinon.stub(oField, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
		oField.setMaxConditions(1);
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent.focus();
		jQuery(oContent.getFocusDomRef()).val("X");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.equal(iCount, 1, "change event fired once");
		assert.equal(sId, "F1", "change event fired on Field");
		assert.equal(sValue, "X", "change event value");
		assert.ok(bValid, "change event valid");
		var aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(aConditions[0].values[0], "X", "condition value");
		assert.equal(aConditions[0].operator, "EEQ", "condition operator");

		//simulate liveChange by calling from internal control
		oContent.fireLiveChange({ value: "Y" });
		assert.equal(iLiveCount, 1, "liveChange event fired once");
		assert.equal(sLiveId, "F1", "liveChange event fired on Field");
		assert.equal(sLiveValue, "Y", "liveChange event value");

		// clear value
		iCount = 0;
		sId = "";
		sValue = undefined;
		jQuery(oContent.getFocusDomRef()).val("");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.equal(iCount, 1, "change event fired once");
		assert.equal(sId, "F1", "change event fired on Field");
		assert.notOk(sValue, "change event value");
		assert.ok(bValid, "change event valid");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 0, "no condition in Codition model");

	});

	QUnit.test("with single value and free condtitions", function(assert) {

		oField.setMaxConditions(1);
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent.focus();
		jQuery(oContent.getFocusDomRef()).val("X");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.equal(iCount, 1, "change event fired once");
		assert.equal(sId, "F1", "change event fired on Field");
		assert.equal(sValue, "X", "change event value");
		assert.ok(bValid, "change event valid");
		var aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(aConditions[0] && aConditions[0].values[0], "X", "condition value");
		assert.equal(aConditions[0] && aConditions[0].operator, "Contains", "condition operator");
		assert.equal(oContent.getValue(), "*X*", "Condition is displayed with operator");

	});

	QUnit.test("with single value and dataType sap.ui.model.type.Currency", function(assert) {

		oField.setDataType("sap.ui.model.type.Currency");
		sinon.stub(oField, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
		oField.setMaxConditions(1);
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent1 = aContent && aContent.length > 0 && aContent[0];
		var oContent2 = aContent && aContent.length > 1 && aContent[1];
		oContent1.focus();
		jQuery(oContent1.getFocusDomRef()).val("1.11");
		oContent2.focus();
		jQuery(oContent2.getFocusDomRef()).val("EUR");
		qutils.triggerKeyboardEvent(oContent2.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.equal(iCount, 2, "change event fired twice"); // TODO: once fired on focusout of number
		assert.equal(sId, "F1", "change event fired on Field");
		assert.ok(Array.isArray(sValue), "change event value is array");
		assert.equal(sValue[0], 1.11, "change event value0");
		assert.equal(sValue[1], "EUR", "change event value1");
		assert.ok(bValid, "change event valid");
		var aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.ok(aConditions[0] && Array.isArray(aConditions[0].values), "condition value is array");
		assert.equal(aConditions[0] && aConditions[0].values[0][0], 1.11, "condition value0");
		assert.equal(aConditions[0] && aConditions[0].values[0][1], "EUR", "condition value1");
		assert.equal(aConditions[0] && aConditions[0].operator, "EEQ", "condition operator");

	});

	QUnit.test("with multi value and dataType sap.ui.model.type.Currency", function(assert) {

		oField.setDataType("sap.ui.model.type.Currency");
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent1 = aContent && aContent.length > 0 && aContent[0];
		var oContent2 = aContent && aContent.length > 1 && aContent[1];
		oContent1.focus();
		jQuery(oContent1.getFocusDomRef()).val("1.11");
		oContent2.focus();
		jQuery(oContent2.getFocusDomRef()).val("EUR");
		qutils.triggerKeyboardEvent(oContent2.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.equal(iCount, 2, "change event fired twice"); // TODO: once fired on focusout of number
		assert.equal(sId, "F1", "change event fired on Field");
		assert.ok(Array.isArray(sValue), "change event value is array");
		assert.equal(sValue[0], 1.11, "change event value0");
		assert.equal(sValue[1], "EUR", "change event value1");
		assert.ok(bValid, "change event valid");
		var aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.ok(aConditions[0] && Array.isArray(aConditions[0].values), "condition value is array");
		assert.equal(aConditions[0] && aConditions[0].values[0][0], 1.11, "condition value-number");
		assert.equal(aConditions[0] && aConditions[0].values[0][1], "EUR", "condition value-unit");
		assert.equal(aConditions[0] && aConditions[0].operator, "EQ", "condition operator");

		iCount = 0;
		sId = undefined;
		sValue = undefined;
		oContent1.focus();
		jQuery(oContent1.getFocusDomRef()).val("1...3");
		qutils.triggerKeyboardEvent(oContent1.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.equal(iCount, 1, "change event fired once");
		assert.equal(sId, "F1", "change event fired on Field");
		assert.ok(bValid, "change event valid");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 2, "two conditions in Codition model");
		assert.ok(aConditions[1] && Array.isArray(aConditions[1].values), "condition value is array");
		assert.equal(aConditions[1] && aConditions[1].values[0][0], 1, "condition value0-number");
		assert.equal(aConditions[1] && aConditions[1].values[0][1], "EUR", "condition value0-unit");
		assert.equal(aConditions[1] && aConditions[1].values[1][0], 3, "condition value1-number");
		assert.equal(aConditions[1] && aConditions[1].values[1][1], "EUR", "condition value1-unit");
		assert.equal(aConditions[1] && aConditions[1].operator, "BT", "condition operator");

		iCount = 0;
		sId = undefined;
		sValue = undefined;
		oContent2.focus();
		jQuery(oContent2.getFocusDomRef()).val("USD");
		qutils.triggerKeyboardEvent(oContent2.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.equal(iCount, 1, "change event fired once");
		assert.equal(sId, "F1", "change event fired on Field");
		assert.ok(bValid, "change event valid");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 2, "two conditions in Codition model");
		assert.ok(aConditions[0] && Array.isArray(aConditions[0].values), "condition1 value is array");
		assert.equal(aConditions[0] && aConditions[0].values[0][0], 1.11, "condition1 value-number");
		assert.equal(aConditions[0] && aConditions[0].values[0][1], "USD", "condition1 value-unit");
		assert.equal(aConditions[0] && aConditions[0].operator, "EQ", "condition1 operator");
		assert.ok(aConditions[1] && Array.isArray(aConditions[1].values), "condition2 value is array");
		assert.equal(aConditions[1] && aConditions[1].values[0][0], 1, "condition2 value0-number");
		assert.equal(aConditions[1] && aConditions[1].values[0][1], "USD", "condition2 value0-unit");
		assert.equal(aConditions[1] && aConditions[1].values[1][0], 3, "condition2 value1-number");
		assert.equal(aConditions[1] && aConditions[1].values[1][1], "USD", "condition2 value1-unit");
		assert.equal(aConditions[1] && aConditions[1].operator, "BT", "condition2 operator");

	});

	QUnit.test("wrong input on single value", function(assert) {

		oField.setDataTypeConstraints({maximum: 10});
		sinon.stub(oField, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
		oField.setDataType("sap.ui.model.type.Integer");
		oField.setMaxConditions(1);
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent.focus();
		jQuery(oContent.getFocusDomRef()).val("15");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		setTimeout(function() { // to wait for valueStateMessage in IE (otherwise it fails after control destroyed)
			assert.equal(iCount, 1, "change event fired once");
			assert.equal(sId, "F1", "change event fired on Field");
			assert.equal(sValue, "15", "change event value");
			assert.notOk(bValid, "change event not valid");
			assert.ok(oPromise, "Promise returned");
			var aConditions = oCM.getConditions("Name");
			assert.equal(aConditions.length, 0, "no condition in Codition model");
			assert.equal(jQuery(oContent.getFocusDomRef()).val(), "15", "Value still in Input");
			assert.equal(iValidationError, 1, "ValidationError fired");

			oPromise.then(function(vResult) {
				assert.notOk(true, "Promise must not be resolved");
				fnDone();
			}).catch(function(oException) {
				assert.ok(true, "Promise must be rejected");
				fnDone();
			});
		}, 0);

	});

	QUnit.test("with SearchField", function(assert) {

		oField.setMaxConditions(1);
		oField.bindProperty("conditions", {path: "cm>/conditions/$search"});
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent.focus();
		oContent.setValue("X"); // as onInput SearchField sets it's value
		qutils.triggerKeydown(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		qutils.triggerKeyup(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.equal(iCount, 1, "change event fired once");
		assert.equal(sId, "F1", "change event fired on Field");
		assert.equal(sValue, "X", "change event value");
		assert.ok(bValid, "change event valid");
		var aConditions = oCM.getConditions("$search");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(aConditions[0] && aConditions[0].values[0], "X", "condition value");
		assert.equal(aConditions[0] && aConditions[0].operator, "Contains", "condition operator");

		iCount = 0; sId = undefined; sValue = undefined; bValid = undefined;
		qutils.triggerTouchEvent("touchend", oContent.getId() + "-search");
		assert.equal(iCount, 1, "change event fired once");
		assert.equal(sId, "F1", "change event fired on Field");
		assert.equal(sValue, "X", "change event value");
		assert.ok(bValid, "change event valid");
		assert.equal(aConditions, oCM.getConditions("$search"), "Conditions not changed");

	});

	QUnit.test("with external content", function(assert) {

		var fnDone = assert.async();
		var oCondition = Condition.createCondition("EEQ", [70]);
		oCM.addCondition("Name", oCondition);
		oField.setMaxConditions(1);
		oField.setDataType("Edm.Float");
		var oSlider = new Slider("S1");
		oSlider.bindProperty("value", { path: '$field>/conditions', type: new ConditionsType()});
		oField.setContent(oSlider);
		sap.ui.getCore().applyChanges();

		setTimeout(function() { // to update ConditionModel
			assert.ok(!!oSlider.getDomRef(), "Slider is rendered");
			if (oSlider.getDomRef()) {
				oSlider.focus();
				qutils.triggerKeyboardEvent(oSlider.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_RIGHT, false, false, false);
				assert.equal(iCount, 1, "change event fired once");
				assert.equal(sId, "F1", "change event fired on Field");
				assert.equal(sValue, 71, "change event value");
				assert.ok(bValid, "change event valid");
				var aConditions = oCM.getConditions("Name");
				assert.equal(aConditions.length, 1, "one condition in Codition model");
				assert.equal(aConditions[0].values[0], 71, "condition value");
				assert.equal(iLiveCount, 1, "liveChange event fired once");
				assert.equal(sLiveId, "F1", "liveChange event fired on Field");
				assert.equal(sLiveValue, 71, "liveChange event value");

				var oButton = new Button("B1");
				oButton.bindProperty("text", { path: '$field>/conditions', type: new ConditionsType() });
				oField.setContent(oButton);
				oSlider.placeAt("content");
				sap.ui.getCore().applyChanges();
				oSlider.focus();
				qutils.triggerKeyboardEvent(oSlider.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_RIGHT, false, false, false);
				assert.equal(iCount, 1, "change event of field not fired again");

				oButton.firePress(); //simulate press
				assert.equal(iPressCount, 1, "Press event fired once");
				assert.equal(sPressId, "F1", "Press event fired on Field");
				oSlider.destroy();
			}
			fnDone();
		}, 0);

	});

	QUnit.test("with type currency", function(assert) {

		oField.setDataType("sap.ui.model.type.Currency");
		var oCondition = Condition.createCondition("EEQ", [[123.45, "USD"]]);
		oField.setConditions([oCondition]);
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent1 = aContent && aContent.length > 0 && aContent[0];
		oContent1.focus();
		var aTokens = oContent1.getTokens ? oContent1.getTokens() : [];
		assert.equal(aTokens.length, 1, "MultiInput has one Token");
		var oToken = aTokens[0];

		// delete Token
		if (oToken) {
			iCount = 0;
			sId = ""; sValue = ""; bValid = false;
			oToken._deleteIcon.firePress();
			assert.equal(iCount, 1, "change event fired once");
			assert.equal(sId, "F1", "change event fired on Field");
			assert.deepEqual(sValue, [undefined, "USD"], "change event value");
			assert.ok(bValid, "change event valid");
			var aConditions = oField.getConditions();
			assert.equal(aConditions.length, 1, "one dummy condition in Codition model after delete Token");
			assert.equal(aConditions[0].values[0][0], undefined, "condition value0");
			assert.equal(aConditions[0].values[0][1], "USD", "condition value1");
			assert.equal(aConditions[0].operator, "EEQ", "condition operator");
			aTokens = oContent1.getTokens ? oContent1.getTokens() : [];
			assert.equal(aTokens.length, 0, "MultiInput has no Token after delete");
		}

	});

	QUnit.module("Clone", {
		beforeEach: function() {
			oField = new FieldBase("F1", { conditions: "{cm>/conditions/Name}" });
			//			oField.attachChange(_myChangeHandler);
			oField._fireChange = _myFireChange;
			oField.attachEvent("change", _myChangeHandler);
			oCM = new ConditionModel();
			sap.ui.getCore().setModel(oCM, "cm");
			var oCondition = Condition.createCondition("EEQ", ["Test"]);
			oCM.addCondition("Name", oCondition);
			oField.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			oField.destroy();
			oField = undefined;
			iCount = 0;
			sId = "";
			sValue = "";
			FieldBase._init();
		}
	});

	QUnit.test("with internal content", function(assert) {

		var oClone = oField.clone("myClone");
		oClone._fireChange = _myFireChange;
		oClone.placeAt("content");
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.equal(oContent.getModel("$field"), oField._oManagedObjectModel, "MultiInput has ManagedObjectModel of Field");
		var aTokens = oContent.getTokens ? oContent.getTokens() : [];
		var oToken = aTokens[0];
		assert.equal(oToken && oToken.getText(), "Test", "Text on token set");
		var aCloneContent = oClone.getAggregation("_content");
		var oCloneContent = aCloneContent && aCloneContent.length > 0 && aCloneContent[0];
		aTokens = oCloneContent.getTokens ? oCloneContent.getTokens() : [];
		assert.equal(aTokens.length, 1, "Clone has one Tokens");

		oContent.focus();
		jQuery(oContent.getFocusDomRef()).val("X");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.equal(iCount, 1, "Event fired once");
		assert.equal(sId, "F1", "Event fired on original Field");

		iCount = 0;
		sId = "";
		sValue = "";

		oCloneContent.focus();
		jQuery(oCloneContent.getFocusDomRef()).val("Y");
		qutils.triggerKeyboardEvent(oCloneContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.equal(iCount, 1, "Event fired once");
		assert.equal(sId, "F1-myClone", "Event fired on clone");

		oClone.destroy();

	});

	QUnit.test("with external content", function(assert) {

		oField.setMaxConditions(1);
		oField.setDataType("Edm.Float");
		oCM.removeAllConditions();
		var oCondition = Condition.createCondition("EEQ", [70]);
		oCM.addCondition("Name", oCondition);
		var oSlider = new Slider("S1");
		oSlider.bindProperty("value", { path: '$field>/conditions', type: new ConditionsType() });
		oField.setContent(oSlider);
		sap.ui.getCore().applyChanges();

		var oClone = oField.clone("myClone");
		oClone._fireChange = _myFireChange;
		oClone.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.notOk(oClone.getAggregation("_content"), "Clone has no internal content");
		var oCloneSlider = oClone.getContent();
		assert.ok(oCloneSlider instanceof Slider, "Clone has Slider as Content");

		oSlider.focus();
		qutils.triggerKeyboardEvent(oSlider.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_RIGHT, false, false, false);
		assert.equal(iCount, 1, "Event fired once");
		assert.equal(sId, "F1", "Event fired on original Field");

		iCount = 0;
		sId = "";
		sValue = "";

		oCloneSlider.focus();
		qutils.triggerKeyboardEvent(oCloneSlider.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_RIGHT, false, false, false);
		assert.equal(iCount, 1, "Event fired once");
		assert.equal(sId, "F1-myClone", "Event fired on clone");

		oClone.destroy();

	});

	QUnit.test("with external edit/display content", function(assert) {

		oField.setMaxConditions(1);
		oField.setDataType("Edm.Float");
		oCM.removeAllConditions();
		var oCondition = Condition.createCondition("EEQ", [70]);
		oCM.addCondition("Name", oCondition);
		var oSlider1 = new Slider("S1");
		oSlider1.bindProperty("value", { path: '$field>/conditions', type: new ConditionsType() });
		oField.setContentEdit(oSlider1);
		var oSlider2 = new Slider("S2");
		oSlider2.bindProperty("value", { path: '$field>/conditions', type: new ConditionsType() });
		oField.setContentDisplay(oSlider2);
		sap.ui.getCore().applyChanges();

		var oClone = oField.clone("myClone");
		oClone._fireChange = _myFireChange;
		oClone.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.notOk(oClone.getAggregation("_content"), "Clone has no internal content");
		var oCloneSlider1 = oClone.getContentEdit();
		assert.ok(oCloneSlider1 instanceof Slider, "Clone has Slider as ContentEdit");
		var oCloneSlider2 = oClone.getContentDisplay();
		assert.ok(oCloneSlider2 instanceof Slider, "Clone has Slider as ContentDisplay");

		oSlider1.focus();
		qutils.triggerKeyboardEvent(oSlider1.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_RIGHT, false, false, false);
		assert.equal(iCount, 1, "Event fired once");
		assert.equal(sId, "F1", "Event fired on original Field");

		iCount = 0;
		sId = "";
		sValue = "";

		oCloneSlider1.focus();
		qutils.triggerKeyboardEvent(oCloneSlider1.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_RIGHT, false, false, false);
		assert.equal(iCount, 1, "Event fired once");
		assert.equal(sId, "F1-myClone", "Event fired on clone");

		oClone.destroy();

	});

	// check only the use of the FieldHelp API. The FieldHelp itself is tested in own tests.
	// So use Stubs to simulate functions of FieldHelp

	QUnit.module("FieldHelp without key", {
		beforeEach: function() {
			var oFieldHelp = new FieldHelpBase("F1-H", {validateInput: false});

			oField = new FieldBase("F1", {
				conditions: "{cm>/conditions/Name}",
				fieldHelp: oFieldHelp,
				//				change: _myChangeHandler,
				liveChange: _myLiveChangeHandler
			});
			oField._fireChange = _myFireChange;
			oField.attachEvent("change", _myChangeHandler);
			oCM = new ConditionModel();
			sap.ui.getCore().setModel(oCM, "cm");
			var oCondition = Condition.createCondition("EEQ", ["I2"]);
			oCM.addCondition("Name", oCondition);

			oField.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			oField.destroy();
			oField = undefined;
			var oFieldHelp = sap.ui.getCore().byId("F1-H");
			if (oFieldHelp) {
				oFieldHelp.destroy();
			}
			oCM.destroy();
			oCM = undefined;
			iCount = 0;
			sId = "";
			sValue = "";
			iLiveCount = 0;
			sLiveId = "";
			sLiveValue = "";
			FieldBase._init();
		}
	});

	QUnit.test("value help enabled", function(assert) {

		oField.setDisplay("DescriptionValue");
		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		sinon.spy(oFieldHelp, "onFieldChange");
		sap.ui.getCore().applyChanges();
		sinon.spy(oFieldHelp, "connect");
		sinon.spy(oFieldHelp, "toggleOpen");

		oField.focus(); // as FieldHelp is connected with focus
		assert.ok(oFieldHelp.connect.calledWith(oField), "FieldHelp connected to Field");

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent.getShowValueHelp(), "valueHelp enabled");
		var oIcon = oContent.getAggregation("_endIcon", [])[0];
		assert.equal(oIcon && oIcon.getSrc(), "sap-icon://slim-arrow-down", "ValueHelpIcon set");

		// simulate select event to see if field is updated
		var oCondition = Condition.createCondition("EEQ", ["Hello"]);
		oFieldHelp.fireSelect({ conditions: [oCondition] });
		assert.equal(iCount, 1, "Change Event fired once");
		var aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(aConditions[0].values[0], "Hello", "condition value");
		assert.equal(aConditions[0].operator, "EEQ", "condition operator");
		assert.ok(oFieldHelp.onFieldChange.calledOnce, "onFieldChange called on FieldHelp");

		oFieldHelp.fireNavigate({ value: "Navigate", key: "Y" });
		assert.equal(iLiveCount, 1, "LiveChange Event fired once");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(aConditions[0].values[0], "Hello", "condition value");
		assert.equal(aConditions[0].operator, "EEQ", "condition operator");
		assert.equal(oContent._$input.val(), "Navigate (Y)", "Field shown value");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.ok(oFieldHelp.onFieldChange.calledTwice, "onFieldChange called on FieldHelp");

		// simulate value help request to see if FieldHelp opens
		oContent.fireValueHelpRequest();
		assert.ok(oFieldHelp.toggleOpen.calledOnce, "FieldHelp toggle open called");

		oContent.fireValueHelpRequest();
		assert.ok(oFieldHelp.toggleOpen.calledTwice, "FieldHelp toggle open called again");

	});

	QUnit.test("with single value field", function(assert) {

		oField.setDisplay("DescriptionValue");
		sinon.stub(oField, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
		oField.setMaxConditions(1);
		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		sap.ui.getCore().applyChanges();

		oField.focus(); // as FieldHelp is connected with focus

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent.getShowValueHelp(), "valueHelp enabled");
		var oIcon = oContent.getAggregation("_endIcon", [])[0];
		assert.equal(oIcon && oIcon.getSrc(), "sap-icon://slim-arrow-down", "ValueHelpIcon set");

		// simulate select event to see if field is updated
		var oCondition = Condition.createCondition("EEQ", ["Hello"]);
		oFieldHelp.fireSelect({ conditions: [oCondition] });
		assert.equal(iCount, 1, "Change Event fired once");
		var aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(aConditions[0].values[0], "Hello", "condition value");
		assert.equal(aConditions[0].operator, "EEQ", "condition operator");
		assert.equal(oContent.getDOMValue(), "Hello", "value shown in inner control");

		// check selecting same value updates typed value
		iCount = 0;
		oContent.setDOMValue("X");
		oFieldHelp.fireSelect({ conditions: [oCondition] });
		assert.equal(iCount, 0, "no Change Event fired");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(oContent.getDOMValue(), "Hello", "value shown in inner control");

		oFieldHelp.fireNavigate({ value: "Navigate", key: "Y" });
		assert.equal(iLiveCount, 1, "LiveChange Event fired once");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(aConditions[0].values[0], "Hello", "condition value");
		assert.equal(aConditions[0].operator, "EEQ", "condition operator");
		assert.equal(oContent.getDOMValue(), "Navigate (Y)", "value shown in inner control");

	});

	QUnit.test("remove value help", function(assert) {

		oField.setFieldHelp();
		sap.ui.getCore().applyChanges();

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.notOk(oContent.getShowValueHelp(), "valueHelp disabled");

	});

	QUnit.test("Skip opening FieldHelp with pending content on focus loss", function (assert) {

		oField.setDisplay("DescriptionValue");

		var oIconContent = new Icon("I3", { src: "sap-icon://sap-ui5" });
		var oAlternateFocusTarget = new FieldBase("F4");

		oAlternateFocusTarget.placeAt("content");
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		sap.ui.getCore().applyChanges();

		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		sinon.stub(oFieldHelp, "openByTyping").returns(true);

		oField.focus();

		var aContent = oField.getAggregation("_content"),
		oContent = aContent && aContent.length > 0 && aContent[0];

		oContent._$input.val("I12");
		oContent.fireLiveChange({ value: "I12" });

		setTimeout(function () { // wait for popup
			var oPopover = oFieldHelp.getAggregation("_popover");
			assert.ok(oFieldHelp._bOpenIfContent, "_bOpenIfContent is true");
			oAlternateFocusTarget.focus();
			oFieldHelp._setContent(oIconContent);
			sap.ui.getCore().applyChanges();
			assert.notOk(oPopover.isOpen(), "Popover should not open due to focus loss");
			oAlternateFocusTarget.destroy();
			fnDone();
		}, 400);

	});

	QUnit.module("FieldHelp with key", {
		beforeEach: function() {
			var oFieldHelp = new FieldHelpBase("F1-H");
			sinon.stub(oFieldHelp, "openByTyping").returns(true); // to simulate suggestion
			var oStub = sinon.stub(oFieldHelp, "getTextForKey");
			oStub.withArgs("I1").returns("Item1");
			//			oStub.withArgs("I2").returns("Item2");
			oStub.withArgs("I3").returns("Item3");
			oStub = sinon.stub(oFieldHelp, "getKeyForText");
			oStub.withArgs("Item1").returns("I1");
			//			oStub.withArgs("Item2").returns("I2");
			oStub.withArgs("Item3").returns("I3");
			sinon.spy(oFieldHelp, "navigate");
			sinon.spy(oFieldHelp, "open");
			sinon.spy(oFieldHelp, "close");
			sinon.spy(oFieldHelp, "fireDisconnect");
			sinon.spy(oFieldHelp, "onFieldChange");

			oField = new FieldBase("F1", {
				conditions: "{cm>/conditions/Name}",
				valueState: "{cm>/fieldPath/Name/valueState}",
				valueStateText: "{cm>/fieldPath/Name/valueStateText}",
				display: sap.ui.mdc.FieldDisplay.Description,
				fieldHelp: oFieldHelp,
				dataType: "sap.ui.model.type.String",
				dataTypeConstraints: {search: '^[A-Za-z0-5]+$'}, // to test validation error
				//				change: _myChangeHandler,
				liveChange: _myLiveChangeHandler
			});
			oField._fireChange = _myFireChange;
			oField.attachEvent("change", _myChangeHandler);
			oCM = new ConditionModel();
			sap.ui.getCore().setModel(oCM, "cm");
			var oCondition = Condition.createCondition("EEQ", ["I2"]);
			oCM.addCondition("Name", oCondition);

			oField.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			oField.destroy();
			oField = undefined;
			var oFieldHelp = sap.ui.getCore().byId("F1-H");
			if (oFieldHelp) {
				oFieldHelp.destroy();
			}
			oCM.destroy();
			oCM = undefined;
			iCount = 0;
			sId = "";
			sValue = "";
			iLiveCount = 0;
			sLiveId = "";
			sLiveValue = "";
			FieldBase._init();
		}
	});

	QUnit.test("value/key handling", function(assert) {

		oField.setMaxConditions(2);
		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		oFieldHelp.setValidateInput(false); // to show keys if not found in help
		assert.ok(oFieldHelp.getTextForKey.calledWith("I2"), "getTextForKey called");
		oField.setDisplay("DescriptionValue");
		sap.ui.getCore().applyChanges();
		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		var aTokens = oContent.getTokens ? oContent.getTokens() : [];
		assert.equal(aTokens.length, 1, "MultiInput has one Token");
		var oToken = aTokens[0];
		assert.equal(oToken && oToken.getText(), "I2", "Text on token is key, as FieldHelp has no description yet");

		// var iCallCount = oFieldHelp.getTextForKey.callCount;
		oFieldHelp.getTextForKey.withArgs("I2").returns("Item2");
		oFieldHelp.getKeyForText.withArgs("Item2").returns("I2");

		// commented out as dataupdate did reset field while typing
		//oFieldHelp.fireDataUpdate();
		//assert.ok(oFieldHelp.getTextForKey.callCount > iCallCount, "getTextForKey called again");
		//assert.ok(oFieldHelp.getTextForKey.calledWith("I2"), "getTextForKey Key");
		//aTokens = oContent.getTokens ? oContent.getTokens() : [];
		//oToken = aTokens[0];
		//assert.equal(oToken && oToken.getText(), "Item2 (I2)", "Text on token is taken from FieldHelp");

		// simulate value help request to see if FieldHelp opens
		oContent.fireValueHelpRequest();

		var aConditions = oFieldHelp.getConditions();
		assert.equal(aConditions.length, 1, "Condition set on FieldHelp");
		assert.equal(aConditions[0] && aConditions[0].values[0], "I2", "selected item set as condition");

		// simulate select event to see if field is updated
		var oCondition = Condition.createCondition("EEQ", ["I3", "Item3"]);
		oFieldHelp.fireSelect({ conditions: [oCondition], add: false });
		assert.equal(iCount, 1, "Change Event fired once");
		assert.equal(sValue, "I3", "Change event value");
		assert.ok(bValid, "Change event valid");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(aConditions[0] && aConditions[0].values[0], "I3", "condition value");
		assert.equal(aConditions[0] && aConditions[0].values[1], "Item3", "condition description");
		assert.equal(aConditions[0] && aConditions[0].operator, "EEQ", "condition operator");
		assert.notOk(oFieldHelp.getKeyForText.called, "getKeyForText not called");
		assert.ok(oFieldHelp.onFieldChange.called, "onFieldChange called on FieldHelp");

		// simulate select event to see if field is updated
		oCondition = Condition.createCondition("EEQ", ["I2", "Item2"]);
		iCount = 0;
		sValue = ""; bValid = undefined;
		oFieldHelp.fireSelect({ conditions: [oCondition], add: true });
		assert.equal(iCount, 1, "Change Event fired once");
		assert.ok(bValid, "Change event valid");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 2, "two condition in Codition model");
		assert.equal(aConditions[0] && aConditions[0].values[0], "I3", "condition value");
		assert.equal(aConditions[0] && aConditions[0].values[1], "Item3", "condition description");
		assert.equal(aConditions[0] && aConditions[0].operator, "EEQ", "condition operator");
		assert.equal(aConditions[1] && aConditions[1].values[0], "I2", "condition value");
		assert.equal(aConditions[1] && aConditions[1].values[1], "Item2", "condition description");
		assert.equal(aConditions[1] && aConditions[1].operator, "EEQ", "condition operator");
		assert.notOk(oFieldHelp.getKeyForText.called, "getKeyForText not called");

		// simulate select event to see if field is updated
		oCondition = Condition.createCondition("EEQ", ["I1", "Item1"]);
		iCount = 0;
		sValue = ""; bValid = undefined;
		oFieldHelp.fireSelect({ conditions: [oCondition], add: true });
		assert.equal(iCount, 1, "Change Event fired once");
		assert.ok(bValid, "Change event valid");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 2, "two condition in Codition model");
		assert.equal(aConditions[0] && aConditions[0].values[0], "I2", "condition value");
		assert.equal(aConditions[0] && aConditions[0].values[1], "Item2", "condition description");
		assert.equal(aConditions[0] && aConditions[0].operator, "EEQ", "condition operator");
		assert.equal(aConditions[1] && aConditions[1].values[0], "I1", "condition value");
		assert.equal(aConditions[1] && aConditions[1].values[1], "Item1", "condition description");
		assert.equal(aConditions[1] && aConditions[1].operator, "EEQ", "condition operator");
		assert.notOk(oFieldHelp.getKeyForText.called, "getKeyForText not called");

		// simulate select event using old API to see if field is updated
		// TODO: remove old api without condition?
		iCount = 0;
		sValue = ""; bValid = undefined;
		oCondition = Condition.createCondition("EEQ", ["I1", "Item1"]);
		oFieldHelp.fireSelect({ conditions: [oCondition], add: false });
		assert.equal(iCount, 1, "Change Event fired once");
		assert.ok(bValid, "Change event valid");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(aConditions[0] && aConditions[0].values[0], "I1", "condition value");
		assert.equal(aConditions[0] && aConditions[0].values[1], "Item1", "condition description");
		assert.equal(aConditions[0] && aConditions[0].operator, "EEQ", "condition operator");
		assert.notOk(oFieldHelp.getKeyForText.called, "getKeyForText not called");

	});

	QUnit.test("keyboard support on closed FieldHelp", function(assert) {

		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		sinon.spy(oContent, "_origOnsapprevious");
		sinon.spy(oContent, "_origOnsapnext");
		sinon.spy(oContent, "_origOnsapbackspace");

		qutils.triggerKeyboardEvent(oField.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_RIGHT, false, false, false);
		assert.ok(oContent._origOnsapnext.called, "onsapnext called on content control");

		qutils.triggerKeyboardEvent(oField.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_LEFT, false, false, false);
		assert.ok(oContent._origOnsapprevious.called, "onsapprevious called on content control");

		qutils.triggerKeyboardEvent(oField.getFocusDomRef().id, jQuery.sap.KeyCodes.BACKSPACE, false, false, false);
		assert.ok(oContent._origOnsapbackspace.called, "onsapbackspace called on content control");

	});

	QUnit.test("keyboard support on open FieldHelp", function(assert) {

		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		sinon.stub(oFieldHelp, "isOpen").returns(true);

		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		sinon.spy(oContent, "_origOnsapprevious");
		sinon.spy(oContent, "_origOnsapnext");
		sinon.spy(oContent, "_origOnsapbackspace");

		qutils.triggerKeyboardEvent(oField.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_RIGHT, false, false, false);
		assert.ok(oContent._origOnsapnext.notCalled, "onsapnext not called on content control");

		qutils.triggerKeyboardEvent(oField.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_LEFT, false, false, false);
		assert.ok(oContent._origOnsapprevious.notCalled, "onsapprevious not called on content control");

		qutils.triggerKeyboardEvent(oField.getFocusDomRef().id, jQuery.sap.KeyCodes.BACKSPACE, false, false, false);
		assert.ok(oContent._origOnsapbackspace.notCalled, "onsapbackspace not called on content control");

	});

	QUnit.test("navigation", function(assert) {

		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		sinon.stub(oFieldHelp, "isOpen").returns(true);

		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		sinon.spy(oContent, "_origOnsapprevious");
		sinon.spy(oContent, "_origOnsapnext");

		qutils.triggerKeyboardEvent(oField.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_DOWN, false, false, false);
		assert.ok(oFieldHelp.navigate.calledWith(1), "navigate called");
		assert.ok(oContent._origOnsapnext.notCalled, "onsapnext not called on content control");

		qutils.triggerKeyboardEvent(oField.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_UP, false, false, false);
		assert.ok(oFieldHelp.navigate.calledWith(-1), "navigate called");
		assert.ok(oContent._origOnsapprevious.notCalled, "onsapprevious not called on content control");

		var oCondition = Condition.createCondition("EEQ", ["I3", "Item 3"]);
		oFieldHelp.fireNavigate({ value: "Item 3", key: "I3", condition: oCondition });
		assert.equal(iLiveCount, 1, "LiveChange Event fired once");
		var aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(aConditions[0] && aConditions[0].values[0], "I2", "condition value");
		assert.equal(oContent._$input.val(), "Item 3", "Field shown value");

		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.ok(oFieldHelp.onFieldChange.called, "onFieldChange called on FieldHelp");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 2, "two conditions in Codition model");
		assert.equal(aConditions[1] && aConditions[1].values[0], "I3", "condition value");
		assert.equal(aConditions[1] && aConditions[1].values[1], "Item 3", "condition description");

	});

	QUnit.test("navigation single Field", function(assert) {

		sinon.stub(oField, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
		oField.setMaxConditions(1);
		sap.ui.getCore().applyChanges();
		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		sinon.stub(oFieldHelp, "isOpen").returns(true);
		sap.ui.getCore().applyChanges();

		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];

		qutils.triggerKeyboardEvent(oField.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_DOWN, false, false, false);
		assert.ok(oFieldHelp.navigate.calledWith(1), "navigate called");

		qutils.triggerKeyboardEvent(oField.getFocusDomRef().id, jQuery.sap.KeyCodes.ARROW_UP, false, false, false);
		assert.ok(oFieldHelp.navigate.calledWith(-1), "navigate called");

		oFieldHelp.fireNavigate({ value: "Item 3", key: "I3" });
		assert.equal(iLiveCount, 1, "LiveChange Event fired once");
		var aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(aConditions[0] && aConditions[0].values[0], "I2", "condition value");
		assert.equal(oContent._$input.val(), "Item 3", "Field shown value");

		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.ok(oFieldHelp.onFieldChange.called, "onFieldChange called on FieldHelp");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one conditions in Codition model");
		assert.equal(aConditions[0] && aConditions[0].values[0], "I3", "condition value");
		assert.equal(aConditions[0] && aConditions[0].values[1], "Item 3", "condition description");

	});

	QUnit.test("filtering", function(assert) {

		oField.setDisplay("DescriptionValue");
		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		var fnDone = assert.async();
		sap.ui.getCore().applyChanges();

		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent._$input.val("i");
		oContent.fireLiveChange({ value: "I" });

		setTimeout(function() { //  Wait the valueHelp filter delay of 300 ms
			assert.equal(oFieldHelp.getFilterValue(), "I", "FilterValue set");
			assert.ok(oFieldHelp.open.called, "open called");

			oContent._$input.val("==A");
			oContent.fireLiveChange({ value: "==A" });

			setTimeout(function() { //  Wait the valueHelp filter delay of 300 ms
				assert.equal(oFieldHelp.getFilterValue(), "A", "FilterValue set");

				oContent._$input.val("=X");
				oContent.fireLiveChange({ value: "=X" });

				setTimeout(function() { //  Wait the valueHelp filter delay of 300 ms
					assert.equal(oFieldHelp.getFilterValue(), "X", "FilterValue set");

					oContent._$input.val("B (C)");
					oContent.fireLiveChange({ value: "B (C)" });

					setTimeout(function() { //  Wait the valueHelp filter delay of 300 ms
						assert.equal(oFieldHelp.getFilterValue(), "C B", "FilterValue set");

						fnDone();
					}, 400);
				}, 400);
			}, 400);
		}, 400);

	});

	QUnit.test("change while open", function(assert) {

		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());

		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent.fireValueHelpRequest();
		oContent._$input.val("==Item1");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);

		assert.equal(oFieldHelp.getFilterValue(), "", "FilterValue reset");
		assert.ok(oFieldHelp.getKeyForText.calledWith("Item1"), "getKeyForText called");
		var aConditions = oFieldHelp.getConditions();
		assert.equal(aConditions.length, 2, "Condition set on FieldHelp");
		assert.equal(aConditions[1] && aConditions[1].values[0], "I1", "selected item set as condition");
		assert.ok(oFieldHelp.close.called, "close called");
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 2, "two conditions in Codition model");
		assert.equal(aConditions[1] && aConditions[1].values[0], "I1", "condition value");
		assert.ok(oFieldHelp.onFieldChange.called, "onFieldChange called on FieldHelp");

	});

	QUnit.test("invalid input", function(assert) {

		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		oFieldHelp.getKeyForText.withArgs("Invalid").returns(null);
		oFieldHelp.getKeyForText.withArgs("Unknown").returns(null);

		var fnDone = assert.async();
		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent._$input.val("==Invalid");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);

		assert.ok(oFieldHelp.getKeyForText.calledWith("Invalid"), "getKeyForText called");
		setTimeout(function() { // to wait for valueStateMessage in IE (otherwise it fails after control destroyed)
			assert.equal(iCount, 1, "change event fired once");
			assert.equal(sId, "F1", "change event fired on Field");
			assert.equal(sValue, "==Invalid", "change event value");
			assert.notOk(bValid, "change event not valid");
			assert.equal(oContent.getValueState(), "Error", "ValueState set");
			assert.equal(oContent.getValueStateText(), "Value \"==Invalid\" does not exist.", "ValueState text");
			var aConditions = oFieldHelp.getConditions();
			assert.equal(aConditions.length, 1, "Condition set on FieldHelp");
			assert.equal(aConditions[0] && aConditions[0].values[0], "I2", "condition value");
			assert.ok(oFieldHelp.close.called, "close called");
			aConditions = oCM.getConditions("Name");
			assert.equal(aConditions.length, 1, "one condition in Codition model");
			assert.equal(aConditions[0] && aConditions[0].values[0], "I2", "condition value");
			assert.notOk(oFieldHelp.onFieldChange.called, "onFieldChange not called on FieldHelp");

			// allow "invalid" entry
			iCount = 0; sId = null; sValue = null; bValid = null;
			oFieldHelp.setValidateInput(false);
			oContent._$input.val("==Unknown");
			qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
			assert.equal(iCount, 1, "change event fired once");
			assert.equal(sId, "F1", "change event fired on Field");
			assert.ok(bValid, "change event valid");
			assert.equal(oContent.getValueState(), "None", "ValueState set");
			assert.equal(oContent.getValueStateText(), "", "ValueState text");
			var aConditions = oFieldHelp.getConditions();
			assert.equal(aConditions.length, 2, "Condition set on FieldHelp");
			assert.equal(aConditions[1] && aConditions[1].values[0], "Unknown", "condition value");
			assert.ok(oFieldHelp.close.called, "close called");
			aConditions = oCM.getConditions("Name");
			assert.equal(aConditions.length, 2, "two conditions in Codition model");
			assert.equal(aConditions[1] && aConditions[1].values[0], "Unknown", "condition value");
			assert.ok(oFieldHelp.onFieldChange.calledOnce, "onFieldChange called on FieldHelp");

			fnDone();
		}, 0);

	});

	QUnit.test("invalid input on singleValue Field", function(assert) {

		sap.ui.getCore().getMessageManager().registerObject(oField, true); // to activate message manager
		sinon.stub(oField, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
		oField.setMaxConditions(1);
		sap.ui.getCore().applyChanges();
		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		oFieldHelp.getKeyForText.withArgs("Invalid").returns(null);
		oFieldHelp.getKeyForText.withArgs("Unknown").returns(null);

		var fnDone = assert.async();
		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent._$input.val("Invalid");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);

		assert.ok(oFieldHelp.getKeyForText.calledWith("Invalid"), "getKeyForText called");
		setTimeout(function() { // to wait for valueStateMessage in IE (otherwise it fails after control destroyed)
			assert.equal(iCount, 1, "change event fired once");
			assert.equal(sId, "F1", "change event fired on Field");
			assert.equal(sValue, "Invalid", "change event value");
			assert.notOk(bValid, "change event not valid");
			assert.equal(oContent.getValueState(), "Error", "ValueState set");
			assert.equal(oContent.getValueStateText(), "Value \"Invalid\" does not exist.", "ValueState text");
			var aConditions = oFieldHelp.getConditions();
			assert.equal(aConditions.length, 1, "Condition set on FieldHelp");
			assert.equal(aConditions[0] && aConditions[0].values[0], "I2", "condition value");
			assert.ok(oFieldHelp.close.called, "close called");
			aConditions = oCM.getConditions("Name");
			assert.equal(aConditions.length, 1, "two conditions in Codition model");
			assert.equal(aConditions[0] && aConditions[0].values[0], "I2", "condition value");

			// allow "invalid" entry
			iCount = 0; sId = null; sValue = null; bValid = null;
			oFieldHelp.setValidateInput(false);
			oContent._$input.val("Unknown");
			qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
			setTimeout(function() { // to update value state
				assert.equal(iCount, 1, "change event fired once");
				assert.equal(sId, "F1", "change event fired on Field");
				assert.equal(sValue, "Unknown", "change event value");
				assert.ok(bValid, "change event valid");
				assert.equal(oContent.getValueState(), "None", "ValueState set");
				assert.equal(oContent.getValueStateText(), "", "ValueState text");
				var aConditions = oFieldHelp.getConditions();
				assert.equal(aConditions.length, 1, "Condition set on FieldHelp");
				assert.equal(aConditions[0] && aConditions[0].values[0], "Unknown", "condition value");
				assert.ok(oFieldHelp.close.called, "close called");
				aConditions = oCM.getConditions("Name");
				assert.equal(aConditions.length, 1, "two conditions in Codition model");
				assert.equal(aConditions[0] && aConditions[0].values[0], "Unknown", "condition value");

				fnDone();
			}, 0);
		}, 0);

	});

	QUnit.test("one FieldHelp on 2 Fields", function(assert) {

		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		oFieldHelp.getTextForKey.withArgs("I2").returns("Item2");
		oFieldHelp.getKeyForText.withArgs("Item2").returns("I2");

		var oCM2 = new ConditionModel();
		var oCondition = Condition.createCondition("EEQ", ["I3"]);
		oCM2.addCondition("Name", oCondition);
		sap.ui.getCore().setModel(oCM2, "cm2");

		var oField2 = new FieldBase("F2", {
			conditions: "{cm2>/conditions/Name}",
			display: library.FieldDisplay.Description,
			fieldHelp: oFieldHelp,
			//			change: _myChangeHandler,
			liveChange: _myLiveChangeHandler
		});
		oField2._fireChange = _myFireChange;
		oField2.attachEvent("change", _myChangeHandler);
		oField2.placeAt("content");
		sap.ui.getCore().applyChanges();

		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		var aContent2 = oField2.getAggregation("_content");
		var oContent2 = aContent2 && aContent2.length > 0 && aContent2[0];

		oCondition = Condition.createCondition("EEQ", ["I1", "Item1"]);
		oFieldHelp.fireSelect({ conditions: [oCondition] });
		var aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model of first Field");
		assert.equal(aConditions[0] && aConditions[0].values[0], "I1", "condition value");
		aConditions = oCM2.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model of second Field");
		assert.equal(aConditions[0] && aConditions[0].values[0], "I3", "condition value");

		oFieldHelp.fireNavigate({ value: "Item2", key: "I2" });
		assert.equal(oContent._$input.val(), "Item2", "Field shown value");
		assert.equal(oContent2._$input.val(), "", "Field2 show no value");

		oField2.focus(); // as FieldHelp is connected with focus
		assert.ok(oFieldHelp.fireDisconnect.called, "disconnect event fired");

		oCondition = Condition.createCondition("EEQ", ["I1", "Item1"]);
		oFieldHelp.fireSelect({ conditions: [oCondition] });
		aConditions = oCM.getConditions("Name");
		assert.equal(aConditions.length, 2, "two conditions in Codition model of first Field");
		assert.equal(aConditions[1] && aConditions[1].values[0], "I2", "condition value");
		aConditions = oCM2.getConditions("Name");
		assert.equal(aConditions.length, 1, "one condition in Codition model of second Field");
		assert.equal(aConditions[0] && aConditions[0].values[0], "I1", "condition value");

		oFieldHelp.fireNavigate({ value: "Item3", key: "I3" });
		assert.equal(oContent._$input.val(), "", "Field shows no value");
		assert.equal(oContent2._$input.val(), "Item3", "Field2 shown value");

		oField2.destroy();
		oCM2.destroy();

	});

	QUnit.test("async parsing", function(assert) {

		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		oFieldHelp.getKeyForText.withArgs("Item3").returns(
				new Promise(function(fnResolve) {
					fnResolve("I3");
				}));
		//		assert.ok(oFieldHelp.getTextForKey.calledWith("I2"), "getTextForKey called");
		var fnDone = assert.async();
		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		jQuery(oContent.getFocusDomRef()).val("Item3");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.equal(iCount, 1, "change event fired once");
		assert.equal(sId, "F1", "change event fired on Field");
		assert.notOk(sValue, "change event has no value");
		assert.ok(oPromise, "Promise returned");
		oPromise.then(function(vResult) {
			assert.ok(vResult, "Promise resolved");
			var aConditions = oCM.getConditions("Name");
			assert.deepEqual(vResult, aConditions, "Promise result");
			assert.equal(aConditions.length, 2, "two conditions in Codition model");
			assert.equal(aConditions[1].values[0], "I3", "condition value");
			assert.equal(aConditions[1].values[1], "Item3", "condition value");
			assert.equal(aConditions[1].operator, "EEQ", "condition operator");
			var aTokens = oContent.getTokens ? oContent.getTokens() : [];
			assert.equal(aTokens.length, 2, "MultiInput has two Tokens");
			var oToken = aTokens[1];
			assert.equal(oToken && oToken.getText(), "Item3", "Text on token set");
			assert.ok(oFieldHelp.onFieldChange.calledOnce, "onFieldChange called on FieldHelp");
			assert.equal(oField._aAsyncChanges.length, 0, "no async changes stored in Field");
			fnDone();
		}).catch(function(oException) {
			assert.notOk(true, "Promise must not be rejected");
			fnDone();
		});

	});

	QUnit.test("async parsing single value", function(assert) {

		sinon.stub(oField, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
		oField.setMaxConditions(1);
		sap.ui.getCore().applyChanges();

		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		oFieldHelp.getKeyForText.withArgs("Item3").returns(
				new Promise(function(fnResolve) {
					fnResolve("I3");
				}));

		var fnDone = assert.async();
		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		jQuery(oContent.getFocusDomRef()).val("Item3");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		assert.equal(iCount, 1, "change event fired once");
		assert.equal(sId, "F1", "change event fired on Field");
		assert.ok(oPromise, "Promise returned");
		oPromise.then(function(vResult) {
			assert.ok(vResult, "Promise resolved");
			assert.ok(vResult, "Promise resolved");
			var aConditions = oCM.getConditions("Name");
			assert.deepEqual(vResult, aConditions, "Promise result");
			assert.equal(aConditions.length, 1, "one condition in Codition model");
			assert.equal(aConditions[0].values[0], "I3", "condition value");
			assert.equal(aConditions[0].values[1], "Item3", "condition value");
			assert.equal(aConditions[0].operator, "EEQ", "condition operator");
			assert.ok(oFieldHelp.onFieldChange.calledOnce, "onFieldChange called on FieldHelp");
			assert.equal(oField._aAsyncChanges.length, 0, "no async changes stored in Field");
			fnDone();
		}).catch(function(oException) {
			assert.notOk(true, "Promise must not be rejected");
			fnDone();
		});

	});

	QUnit.test("invalid input with async parsing", function(assert) {

		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		oFieldHelp.getKeyForText.withArgs("Invalid").returns(
				Promise.reject(new ParseException("InvalidValue"))
		);
		oFieldHelp.getKeyForText.withArgs("Unknown").returns(
				Promise.reject(new ParseException("UnknownValue"))
		);
		oFieldHelp.getKeyForText.withArgs("Item9").returns(
				Promise.reject(new ParseException("InvalidValue"))
		);
		sinon.stub(oFieldHelp, "isOpen").returns(true); // to simulate open suggestion

		var fnDone = assert.async();

		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent._$input.val("==Invalid");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);

		assert.ok(oFieldHelp.getKeyForText.calledWith("Invalid"), "getKeyForText called");
		assert.equal(iCount, 1, "change event fired once");
		assert.equal(sId, "F1", "change event fired on Field");
		assert.ok(oPromise, "Promise returned");
		oPromise.then(function(vResult) {
			assert.notOk(true, "Promise must not be resolved");
			fnDone();
		}).catch(function(oException) {
			assert.ok(true, "Promise must be rejected");
			assert.equal(oException.message, "InvalidValue");
			assert.notOk(oFieldHelp.onFieldChange.called, "onFieldChange not called on FieldHelp");
			setTimeout(function() { // for model update
				setTimeout(function() { // for ManagedObjectModel update
					assert.equal(oContent.getValueState(), "Error", "ValueState set");
					assert.equal(oContent.getValueStateText(), "InvalidValue", "ValueStateText");
					var aConditions = oCM.getConditions("Name");
					assert.equal(aConditions.length, 1, "one condition in Codition model");
					assert.equal(aConditions[0] && aConditions[0].values[0], "I2", "condition value");
					aConditions = oFieldHelp.getConditions();
					assert.equal(aConditions.length, 1, "Conditions set on FieldHelp");
					assert.equal(aConditions[0] && aConditions[0].values[0], "I2", "condition value");
					assert.ok(oFieldHelp.close.called, "close called");
					assert.equal(oField._aAsyncChanges.length, 0, "no async changes stored in Field");

					// use default operator
					iCount = 0; sId = null; sValue = null; bValid = null; oPromise = null;
					oContent._$input.val("Invalid");
					qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);

					assert.ok(oFieldHelp.getKeyForText.calledWith("Invalid"), "getKeyForText called");
					assert.equal(iCount, 1, "change event fired once");
					assert.equal(sId, "F1", "change event fired on Field");
					assert.ok(oPromise, "Promise returned");
					oPromise.then(function(vResult) {
						assert.ok(true, "Promise must be resolved");
						setTimeout(function() { // for model update
							setTimeout(function() { // for ManagedObjectModel update
								assert.equal(oContent.getValueState(), "None", "ValueState set");
								assert.equal(oContent.getValueStateText(), "", "ValueStateText");
								aConditions = oFieldHelp.getConditions();
								assert.equal(aConditions.length, 2, "Conditions set on FieldHelp");
								assert.equal(aConditions[1] && aConditions[1].operator, "Contains", "condition operator");
								assert.equal(aConditions[1] && aConditions[1].values[0], "Invalid", "condition value");
								assert.ok(oFieldHelp.close.called, "close called");
								aConditions = oCM.getConditions("Name");
								assert.deepEqual(vResult, aConditions, "Promise result");
								assert.equal(aConditions.length, 2, "one condition in Codition model");
								assert.equal(aConditions[1] && aConditions[1].operator, "Contains", "condition operator");
								assert.equal(aConditions[1] && aConditions[1].values[0], "Invalid", "condition value");
								assert.equal(oField._aAsyncChanges.length, 0, "no async changes stored in Field");

								// allow "invalid" entry
								iCount = 0; sId = null; sValue = null; bValid = null; oPromise = null;
								oFieldHelp.setValidateInput(false);
								oContent._$input.val("==Unknown");
								qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
								assert.equal(iCount, 1, "change event fired once");
								assert.equal(sId, "F1", "change event fired on Field");
								assert.ok(oPromise, "Promise returned");
								oPromise.then(function(vResult) {
									assert.ok(true, "Promise must be resolved");
									setTimeout(function() { // for model update
										setTimeout(function() { // for ManagedObjectModel update
											assert.equal(oContent.getValueState(), "None", "ValueState set");
											assert.equal(oContent.getValueStateText(), "", "ValueState text");
											aConditions = oFieldHelp.getConditions();
											assert.equal(aConditions.length, 3, "Conditions set on FieldHelp");
											assert.equal(aConditions[2] && aConditions[2].operator, "EEQ", "condition operator");
											assert.equal(aConditions[2] && aConditions[2].values[0], "Unknown", "condition value");
											assert.ok(oFieldHelp.close.called, "close called");
											aConditions = oCM.getConditions("Name");
											assert.deepEqual(vResult, aConditions, "Promise result");
											assert.equal(aConditions.length, 3, "three conditions in Codition model");
											assert.equal(aConditions[2] && aConditions[2].operator, "EEQ", "condition operator");
											assert.equal(aConditions[2] && aConditions[2].values[0], "Unknown", "condition value");
											assert.equal(oField._aAsyncChanges.length, 0, "no async changes stored in Field");

											// validation error
											iCount = 0; sId = null; sValue = null; bValid = null; oPromise = null;
											oFieldHelp.onFieldChange.resetHistory();
											oContent._$input.val("==Item9");
											qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
											assert.equal(iCount, 1, "change event fired once");
											assert.equal(sId, "F1", "change event fired on Field");
											assert.ok(oPromise, "Promise returned");
											oPromise.then(function(vResult) {
												assert.notOk(true, "Promise must not be resolved");
												fnDone();
											}).catch(function(oException) {
												assert.ok(true, "Promise must be rejected");
												assert.equal(oException.message, "Enter a valid value");
												assert.notOk(oFieldHelp.onFieldChange.called, "onFieldChange not called on FieldHelp");
												setTimeout(function() { // for model update
													setTimeout(function() { // for ManagedObjectModel update
														assert.equal(oContent.getValueState(), "Error", "ValueState set");
														assert.equal(oContent.getValueStateText(), "Enter a valid value", "ValueStateText");
														aConditions = oCM.getConditions("Name");
														assert.equal(aConditions.length, 3, "three conditions in Codition model");
														aConditions = oFieldHelp.getConditions();
														assert.equal(aConditions.length, 3, "Conditions set on FieldHelp");
														assert.equal(oField._aAsyncChanges.length, 0, "no async changes stored in Field");
														fnDone();
													}, 0);
												}, 0);
											});
										}, 0);
									}, 0);
								}).catch(function(oException) {
									assert.notOk(true, "Promise must not be rejected");
									fnDone();
								});
							}, 0);
						}, 0);
					}).catch(function(oException) {
						assert.notOk(true, "Promise must not be rejected");
						fnDone();
					});
				}, 0);
			}, 0);
		});

	});

	QUnit.test("invalid input with async parsing on singleValue Field", function(assert) {

		sap.ui.getCore().getMessageManager().registerObject(oField, true); // to activate message manager
		sinon.stub(oField, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
		oField.setMaxConditions(1);
		sap.ui.getCore().applyChanges();
		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		oFieldHelp.getKeyForText.withArgs("Invalid").returns(
				Promise.reject(new ParseException("InvalidValue"))
		);
		oFieldHelp.getKeyForText.withArgs("Unknown").returns(
				Promise.reject(new ParseException("UnknownValue"))
		);
		oFieldHelp.getKeyForText.withArgs("Item9").returns(
				Promise.reject(new ParseException("InvalidValue"))
		);
		sinon.stub(oFieldHelp, "isOpen").returns(true); // to simulate open suggestion

		var fnDone = assert.async();
		oField.focus(); // as FieldHelp is connected with focus
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oContent._$input.val("Invalid");
		qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);

		assert.ok(oFieldHelp.getKeyForText.calledWith("Invalid"), "getKeyForText called");
		assert.equal(iCount, 1, "change event fired once");
		assert.equal(sId, "F1", "change event fired on Field");
		assert.ok(oPromise, "Promise returned");
		oPromise.then(function(vResult) {
			assert.notOk(true, "Promise must not be resolved");
			fnDone();
		}).catch(function(oException) {
			assert.ok(true, "Promise must be rejected");
			assert.equal(oException.message, "InvalidValue");
			assert.notOk(oFieldHelp.onFieldChange.called, "onFieldChange not called on FieldHelp");
			setTimeout(function() { // for model update
				setTimeout(function() { // for ManagedObjectModel update
					assert.equal(oContent.getValueState(), "Error", "ValueState set");
					assert.equal(oContent.getValueStateText(), "InvalidValue", "ValueState text");
					var aConditions = oFieldHelp.getConditions();
					assert.equal(aConditions.length, 1, "Condition set on FieldHelp");
					assert.equal(aConditions[0] && aConditions[0].values[0], "I2", "condition value");
					assert.ok(oFieldHelp.close.called, "close called");
					aConditions = oCM.getConditions("Name");
					assert.equal(aConditions.length, 1, "two conditions in Codition model");
					assert.equal(aConditions[0] && aConditions[0].values[0], "I2", "condition value");
					assert.equal(oField._aAsyncChanges.length, 0, "no async changes stored in Field");

					// allow "invalid" entry
					iCount = 0; sId = null; sValue = null; bValid = null; oPromise = null;
					oFieldHelp.setValidateInput(false);
					oContent._$input.val("Unknown");
					qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
					assert.equal(iCount, 1, "change event fired once");
					assert.equal(sId, "F1", "change event fired on Field");
					assert.ok(oPromise, "Promise returned");
					oPromise.then(function(vResult) {
						assert.ok(true, "Promise must be resolved");
						setTimeout(function() { // for model update
							setTimeout(function() { // for ManagedObjectModel update
								assert.equal(oContent.getValueState(), "None", "ValueState set");
								assert.equal(oContent.getValueStateText(), "", "ValueState text");
								aConditions = oFieldHelp.getConditions();
								assert.equal(aConditions.length, 1, "Condition set on FieldHelp");
								assert.equal(aConditions[0] && aConditions[0].values[0], "Unknown", "condition value");
								assert.ok(oFieldHelp.close.called, "close called");
								aConditions = oCM.getConditions("Name");
								assert.deepEqual(vResult, aConditions, "Promise result");
								assert.equal(aConditions.length, 1, "one condition in Codition model");
								assert.equal(aConditions[0] && aConditions[0].values[0], "Unknown", "condition value");
								assert.equal(oField._aAsyncChanges.length, 0, "no async changes stored in Field");

								// validation error
								iCount = 0; sId = null; sValue = null; bValid = null; oPromise = null;
								oFieldHelp.onFieldChange.resetHistory();
								oContent._$input.val("Item9");
								qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
								assert.equal(iCount, 1, "change event fired once");
								assert.equal(sId, "F1", "change event fired on Field");
								assert.ok(oPromise, "Promise returned");
								oPromise.then(function(vResult) {
									assert.notOk(true, "Promise must not be resolved");
									fnDone();
								}).catch(function(oException) {
									assert.ok(true, "Promise must be rejected");
									assert.equal(oException.message, "Enter a valid value");
									assert.notOk(oFieldHelp.onFieldChange.called, "onFieldChange not called on FieldHelp");
									setTimeout(function() { // for model update
										setTimeout(function() { // for ManagedObjectModel update
											assert.equal(oContent.getValueState(), "Error", "ValueState set");
											assert.equal(oContent.getValueStateText(), "Enter a valid value", "ValueStateText");
											aConditions = oCM.getConditions("Name");
											assert.equal(aConditions.length, 1, "one condition in Codition model");
											assert.equal(aConditions[0] && aConditions[0].values[0], "Unknown", "condition value");
											aConditions = oFieldHelp.getConditions();
											assert.equal(aConditions.length, 1, "Condition set on FieldHelp");
											assert.equal(aConditions[0] && aConditions[0].values[0], "Unknown", "condition value");
											assert.equal(oField._aAsyncChanges.length, 0, "no async changes stored in Field");
											fnDone();
										}, 0);
									}, 0);
								});
							}, 0);
						}, 0);
					}).catch(function(oException) {
						assert.notOk(true, "Promise must not be rejected");
						fnDone();
					});
				}, 0);
			}, 0);
		});

	});

	QUnit.module("FieldHelp for currency", {
		beforeEach: function() {
			var oFieldHelp = new FieldHelpBase("F1-H");
			sinon.stub(oFieldHelp, "openByTyping").returns(true); // to simulate suggestion

			oField = new FieldBase("F1", {
				dataType: "sap.ui.model.type.Currency",
				maxConditions: 1,
				conditions: "{cm>/conditions/Price}",
				fieldHelp: oFieldHelp,
				liveChange: _myLiveChangeHandler
			});
			sinon.stub(oField, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
			oField._fireChange = _myFireChange;
			oField.attachEvent("change", _myChangeHandler);
			oCM = new ConditionModel();
			sap.ui.getCore().setModel(oCM, "cm");
			var oCondition = Condition.createCondition("EEQ", [[123.45, "USD"]]);
			oCM.addCondition("Price", oCondition);

			oField.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			oField.destroy();
			oField = undefined;
			var oFieldHelp = sap.ui.getCore().byId("F1-H");
			if (oFieldHelp) {
				oFieldHelp.destroy();
			}
			oCM.destroy();
			oCM = undefined;
			iCount = 0;
			sId = "";
			sValue = "";
			iLiveCount = 0;
			sLiveId = "";
			sLiveValue = "";
			FieldBase._init();
		}
	});

	QUnit.test("Select currency", function(assert) {

		var fnDone = assert.async();
		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());

		var aContent = oField.getAggregation("_content");
		var oContent1 = aContent && aContent.length > 0 && aContent[0];
		var oContent2 = aContent && aContent.length > 1 && aContent[1];
		assert.notOk(oContent1.getShowValueHelp(), "Number Input has no value help");
		assert.ok(oContent2.getShowValueHelp(), "Currency Input has value help");

		oContent2.focus(); // as FieldHelp is connected with focus
		// simulate select event to see if field is updated
		var oCondition = Condition.createCondition("EEQ", ["EUR", "EUR"], {inTest: "X"}, {outTest: "Y"});
		oFieldHelp.fireSelect({ conditions: [oCondition] });
		assert.equal(iCount, 1, "Change Event fired once");
		var aConditions = oCM.getConditions("Price");
		assert.equal(aConditions.length, 1, "one condition in Codition model");
		assert.equal(aConditions[0].values[0][0], 123.45, "condition value0");
		assert.equal(aConditions[0].values[0][1], "EUR", "condition value1");
		assert.equal(aConditions[0].operator, "EEQ", "condition operator");
		assert.ok(aConditions[0].hasOwnProperty("inParameters"), "Condition has in-partameters");
		assert.equal(aConditions[0].inParameters.inTest, "X", "In-parameter value");
		assert.ok(aConditions[0].hasOwnProperty("outParameters"), "Condition has out-partameters");
		assert.equal(aConditions[0].outParameters.outTest, "Y", "Out-parameter value");
		assert.equal(oContent2.getDOMValue(), "EUR", "value in inner control");

		setTimeout(function() { // wait for Model update
			oCM.removeAllConditions();
			setTimeout(function() { // wait for Model update
				oCondition = Condition.createCondition("EEQ", ["USD", "USD"], {inTest: "X"}, {outTest: "Y"});
				oFieldHelp.fireSelect({ conditions: [oCondition] });
				aConditions = oCM.getConditions("Price");
				assert.equal(aConditions.length, 1, "one condition in Codition model");
				assert.equal(aConditions[0].values[0][0], undefined, "condition value0");
				assert.equal(aConditions[0].values[0][1], "USD", "condition value1");
				assert.equal(aConditions[0].operator, "EEQ", "condition operator");
				assert.ok(aConditions[0].hasOwnProperty("inParameters"), "Condition has in-partameters");
				assert.equal(aConditions[0].inParameters.inTest, "X", "In-parameter value");
				assert.ok(aConditions[0].hasOwnProperty("outParameters"), "Condition has out-partameters");
				assert.equal(aConditions[0].outParameters.outTest, "Y", "Out-parameter value");

				fnDone();
			}, 0);
		}, 0);

	});

	QUnit.test("navigate to currency", function(assert) {

		iLiveCount = 0; // TODO: as in IE sometimes a change event on the Input control is fired.
		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());

		var aContent = oField.getAggregation("_content");
		var oContent1 = aContent && aContent.length > 0 && aContent[0];
		var oContent2 = aContent && aContent.length > 1 && aContent[1];

		oContent2.focus(); // as FieldHelp is connected with focus
		oFieldHelp.fireNavigate({ value: "EUR", key: "EUR" });
		assert.equal(iLiveCount, 1, "LiveChange Event fired once");
		assert.equal(oContent1._$input.val(), "123.45", "number-Field shown value");
		assert.equal(oContent2._$input.val(), "EUR", "currency-Field shown value");

	});

	QUnit.test("filtering for currency", function(assert) {

		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		var fnDone = assert.async();
		sap.ui.getCore().applyChanges();
		var aContent = oField.getAggregation("_content");
		var oContent1 = aContent && aContent.length > 0 && aContent[0];
		var oContent2 = aContent && aContent.length > 1 && aContent[1];
		oContent2.focus(); // as FieldHelp is connected with focus
		oContent2._$input.val("E");
		oContent2.fireLiveChange({ value: "E" });

		setTimeout(function() { // for Popup and model update
			assert.equal(oFieldHelp.getFilterValue(), "E", "FilterValue set");
			oContent1._$input.val("2");
			oContent1.fireLiveChange({ value: "2" });

			setTimeout(function() { // for Popup and model update
				assert.equal(oFieldHelp.getFilterValue(), "E", "FilterValue not changed");
				fnDone();
			}, 400);
		}, 400);

	});

	QUnit.module("FieldHelp for currency with multi-value", {
		beforeEach: function() {
			var oFieldHelp = new FieldHelpBase("F1-H");
			sinon.stub(oFieldHelp, "openByTyping").returns(true); // to simulate suggestion

			oField = new FieldBase("F1", {
				dataType: "sap.ui.model.type.Currency",
				conditions: "{cm>/conditions/Price}",
				fieldHelp: oFieldHelp,
				liveChange: _myLiveChangeHandler
			});
			oField._fireChange = _myFireChange;
			oField.attachEvent("change", _myChangeHandler);
			oCM = new ConditionModel();
			sap.ui.getCore().setModel(oCM, "cm");
			var oCondition = Condition.createCondition("EEQ", [[123.45, "USD"]]);
			oCM.addCondition("Price", oCondition);
			oCondition = Condition.createCondition("BT", [[100, "USD"], [200, "USD"]]);
			oCM.addCondition("Price", oCondition);

			oField.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			oField.destroy();
			oField = undefined;
			var oFieldHelp = sap.ui.getCore().byId("F1-H");
			if (oFieldHelp) {
				oFieldHelp.destroy();
			}
			oCM.destroy();
			oCM = undefined;
			iCount = 0;
			sId = "";
			sValue = "";
			iLiveCount = 0;
			sLiveId = "";
			sLiveValue = "";
			FieldBase._init();
		}
	});

	QUnit.test("Select currency", function(assert) {

		var fnDone = assert.async();
		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());

		var aContent = oField.getAggregation("_content");
		var oContent1 = aContent && aContent.length > 0 && aContent[0];
		var oContent2 = aContent && aContent.length > 1 && aContent[1];
		assert.notOk(oContent1.getShowValueHelp(), "Number MultiInput has no value help");
		assert.ok(oContent2.getShowValueHelp(), "Currency Input has value help");

		oContent2.focus(); // as FieldHelp is connected with focus
		// simulate select event to see if field is updated
		var oCondition = Condition.createCondition("EEQ", ["EUR", "EUR"]);
		oFieldHelp.fireSelect({ conditions: [oCondition] });
		assert.equal(iCount, 1, "Change Event fired once");
		var aConditions = oCM.getConditions("Price");
		assert.equal(aConditions.length, 2, "two conditions in Codition model");
		assert.equal(aConditions[0].values[0][0], 123.45, "condition value0-number");
		assert.equal(aConditions[0].values[0][1], "EUR", "condition value0-unit");
		assert.equal(aConditions[0].operator, "EEQ", "condition operator");
		assert.equal(aConditions[1].values[0][0], 100, "condition value0-number");
		assert.equal(aConditions[1].values[0][1], "EUR", "condition value0-unit");
		assert.equal(aConditions[1].values[1][0], 200, "condition value1-number");
		assert.equal(aConditions[1].values[1][1], "EUR", "condition value1-unit");
		assert.equal(aConditions[1].operator, "BT", "condition operator");
		assert.equal(oContent2.getDOMValue(), "EUR", "value in inner control");

		setTimeout(function() { // wait for Model update
			oCM.removeAllConditions();
			setTimeout(function() { // wait for Model update
				oCondition = Condition.createCondition("EEQ", ["USD", "USD"]);
				oFieldHelp.fireSelect({ conditions: [oCondition] });
				aConditions = oCM.getConditions("Price");
				assert.equal(aConditions.length, 1, "one condition in Codition model");
				assert.equal(aConditions[0].values[0][0], undefined, "condition value0");
				assert.equal(aConditions[0].values[0][1], "USD", "condition value1");
				assert.equal(aConditions[0].operator, "EEQ", "condition operator");

				// check selecting same value updates typed value
				iCount = 0;
				oContent2.setDOMValue("X");
				oFieldHelp.fireSelect({ conditions: [oCondition] });
				assert.equal(iCount, 0, "no Change Event fired");
				aConditions = oCM.getConditions("Price");
				assert.equal(aConditions.length, 1, "one condition in Codition model");
				assert.equal(oContent2.getDOMValue(), "USD", "value in inner control");

				fnDone();
			}, 0);
		}, 0);

	});

	QUnit.test("navigate to currency", function(assert) {

		var fnDone = assert.async();
		iLiveCount = 0; // TODO: as in IE sometimes a change event on the Input control is fired.
		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());

		var aContent = oField.getAggregation("_content");
		var oContent1 = aContent && aContent.length > 0 && aContent[0];
		var oContent2 = aContent && aContent.length > 1 && aContent[1];

		oContent2.focus(); // as FieldHelp is connected with focus
		var oCondition = Condition.createCondition("EEQ", ["EUR", "EUR"], {inTest: "X"}, {outTest: "Y"});
		oFieldHelp.fireNavigate({ value: "EUR", key: "EUR", condition: oCondition });
		assert.equal(iLiveCount, 1, "LiveChange Event fired once");
		assert.equal(oContent1.getDOMValue(), "", "value in inner number-control");
		assert.equal(oContent2.getDOMValue(), "EUR", "value in inner unit-control");

		qutils.triggerKeyboardEvent(oContent2.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
		var aConditions = oCM.getConditions("Price");
		assert.equal(aConditions.length, 2, "two conditions in Codition model");
		assert.equal(aConditions[0].values[0][0], 123.45, "condition0 value0-number");
		assert.equal(aConditions[0].values[0][1], "EUR", "condition0 value0-unit");
		assert.equal(aConditions[0].operator, "EEQ", "condition0 operator");
		assert.ok(aConditions[0].hasOwnProperty("inParameters"), "Condition0 has in-partameters");
		assert.equal(aConditions[0].inParameters.inTest, "X", "In-parameter value");
		assert.ok(aConditions[0].hasOwnProperty("outParameters"), "Condition0 has out-partameters");
		assert.equal(aConditions[0].outParameters.outTest, "Y", "Out-parameter value");
		assert.equal(aConditions[1].values[0][0], 100, "condition1 value0-number");
		assert.equal(aConditions[1].values[0][1], "EUR", "condition1 value0-unit");
		assert.equal(aConditions[1].values[1][0], 200, "condition1 value1-number");
		assert.equal(aConditions[1].values[1][1], "EUR", "condition1 value1-unit");
		assert.equal(aConditions[1].operator, "BT", "condition operator");
		assert.ok(aConditions[1].hasOwnProperty("inParameters"), "Condition1 has in-partameters");
		assert.equal(aConditions[1].inParameters.inTest, "X", "In-parameter value");
		assert.ok(aConditions[1].hasOwnProperty("outParameters"), "Condition1 has out-partameters");
		assert.equal(aConditions[1].outParameters.outTest, "Y", "Out-parameter value");

		setTimeout(function() { // wait for Model update
			oCM.removeAllConditions();
			setTimeout(function() { // wait for Model update
				oFieldHelp.fireNavigate({ value: "EUR", key: "EUR", condition: oCondition });
				qutils.triggerKeyboardEvent(oContent2.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
				aConditions = oCM.getConditions("Price");
				assert.equal(aConditions.length, 1, "one condition in Codition model");
				assert.equal(aConditions[0].values[0][0], undefined, "condition0 value0-number");
				assert.equal(aConditions[0].values[0][1], "EUR", "condition0 value0-unit");
				assert.equal(aConditions[0].operator, "EEQ", "condition0 operator");
				assert.ok(aConditions[0].hasOwnProperty("inParameters"), "Condition0 has in-partameters");
				assert.equal(aConditions[0].inParameters.inTest, "X", "In-parameter value");
				assert.ok(aConditions[0].hasOwnProperty("outParameters"), "Condition0 has out-partameters");
				assert.equal(aConditions[0].outParameters.outTest, "Y", "Out-parameter value");

				fnDone();
			}, 0);
		}, 0);

	});

	QUnit.module("FieldHelp with \"\" as key", {
		beforeEach: function() {
			var oFieldHelp = new FieldHelpBase("F1-H");
			sinon.stub(oFieldHelp, "openByTyping").returns(true); // to simulate suggestion
			var oStub = sinon.stub(oFieldHelp, "getTextForKey");
			oStub.withArgs("").returns("Empty");
			oStub.withArgs("I1").returns("Item1");
			oStub.withArgs("I2").returns("Item2");
			oStub = sinon.stub(oFieldHelp, "getKeyForText");
			oStub.withArgs("Empty").returns("");
			oStub.withArgs("Item1").returns("I1");
			oStub.withArgs("Item2").returns("I2");

			oField = new FieldBase("F1", {
				dataType: "sap.ui.model.odata.type.String",
				display: sap.ui.mdc.FieldDisplay.Description,
				maxConditions: 1,
				fieldHelp: oFieldHelp,
				liveChange: _myLiveChangeHandler
			});
			// TODO: FilterField case
			sinon.stub(oField, "_getOperators").callsFake(fnOnlyEEQ); // fake Field
			oField._fireChange = _myFireChange;
			oField.attachEvent("change", _myChangeHandler);

			oField.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			oField.destroy();
			oField = undefined;
			var oFieldHelp = sap.ui.getCore().byId("F1-H");
			if (oFieldHelp) {
				oFieldHelp.destroy();
			}
			iCount = 0;
			sId = "";
			sValue = "";
			iLiveCount = 0;
			sLiveId = "";
			sLiveValue = "";
			FieldBase._init();
		}
	});

	QUnit.test("displayed value", function(assert) {

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.notOk(oContent.getValue(), "Input control is empty");

		var oCondition = Condition.createCondition("EEQ", [""]);
		oField.setConditions([oCondition]);
		assert.equal(oContent.getValue(), "Empty");

	});

	QUnit.test("FieldHelp select", function(assert) {

		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		oField.focus(); // as FieldHelp is connected with focus

		var oCondition = Condition.createCondition("EEQ", ["", "Empty"]);
		oFieldHelp.fireSelect({ conditions: [oCondition] });

		var aConditions = oField.getConditions();
		assert.equal(aConditions.length, 1, "one condition set");
		assert.equal(aConditions[0].operator, "EEQ", "condition operator");
		assert.equal(aConditions[0].values[0], "", "condition value");
		assert.equal(aConditions[0].values[1], "Empty", "condition description");

	});

	QUnit.test("FieldHelp navigate", function(assert) {

		var oFieldHelp = sap.ui.getCore().byId(oField.getFieldHelp());
		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		oField.focus(); // as FieldHelp is connected with focus

		var oCondition = Condition.createCondition("EEQ", ["", "Empty"]);
		oFieldHelp.fireNavigate({key: "", value: "Empty", condition: oCondition});

		assert.equal(iLiveCount, 1, "LiveChange Event fired once");
		assert.equal(oContent.getValue(), "Empty");

	});

	// test FieldInfo only from API side, simulate behaviour
	QUnit.module("FieldInfo not triggerable", {
		beforeEach: function() {
			var oFieldInfo = new FieldInfoBase("F1-I");
			sinon.stub(oFieldInfo, "isTriggerable").returns(Promise.resolve(false));
			sinon.stub(oFieldInfo, "getTriggerHref").returns(Promise.resolve("test.test"));
			sinon.stub(oFieldInfo, "getContent").returns(Promise.resolve(sap.ui.getCore().byId("L1")));
			sinon.stub(oFieldInfo, "getContentTitle").returns("");
			sinon.spy(oFieldInfo, "open");

			oField = new FieldBase("F1", {
				conditions: "{cm>/conditions/Name}",
				maxConditions: 1, // TODO: needed for Link?
				editMode: library.EditMode.Display,
				fieldInfo: oFieldInfo,
				//				change: _myChangeHandler,
				liveChange: _myLiveChangeHandler
			});
			oField._fireChange = _myFireChange;
			oField.attachEvent("change", _myChangeHandler);

			oCM = new ConditionModel();
			sap.ui.getCore().setModel(oCM, "cm");
			var oCondition = Condition.createCondition("EEQ", ["Test"]);
			oCM.addCondition("Name", oCondition);

			oField.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			oField.destroy();
			oField = undefined;
			var oFieldInfo = sap.ui.getCore().byId("F1-I");
			if (oFieldInfo) {
				oFieldInfo.destroy();
			}
			var oLabel = sap.ui.getCore().byId("L1");
			if (oLabel) {
				oLabel.destroy();
			}
			oCM.destroy();
			oCM = undefined;
			iCount = 0;
			sId = "";
			sValue = "";
			iLiveCount = 0;
			sLiveId = "";
			sLiveValue = "";
			FieldBase._init();
		}
	});

	QUnit.test("Rendering", function(assert) {

		var aContent = oField.getAggregation("_content");
		var oContent = aContent && aContent.length > 0 && aContent[0];
		assert.ok(oContent, "content exist");
		assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");
		assert.equal(oContent.getText && oContent.getText(), "Test", "Text used");

	});

	QUnit.module("FieldInfo triggerable", {
		beforeEach: function() {
			var oFieldInfo = new FieldInfoBase("F1-I");
			sinon.stub(oFieldInfo, "isTriggerable").returns(Promise.resolve(true));
			sinon.stub(oFieldInfo, "getTriggerHref").returns(Promise.resolve(undefined));
			sinon.stub(oFieldInfo, "getContent").returns(Promise.resolve(sap.ui.getCore().byId("L1")));
			sinon.stub(oFieldInfo, "getContentTitle").returns("");
			sinon.spy(oFieldInfo, "open");

			oField = new FieldBase("F1", {
				conditions: "{cm>/conditions/Name}",
				maxConditions: 1, // TODO: needed for Link?
				editMode: library.EditMode.Display,
				fieldInfo: oFieldInfo,
				//				change: _myChangeHandler,
				liveChange: _myLiveChangeHandler
			});
			oField._fireChange = _myFireChange;
			oField.attachEvent("change", _myChangeHandler);

			oCM = new ConditionModel();
			sap.ui.getCore().setModel(oCM, "cm");
			var oCondition = Condition.createCondition("EEQ", ["Test"]);
			oCM.addCondition("Name", oCondition);

			oField.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			oField.destroy();
			oField = undefined;
			var oFieldInfo = sap.ui.getCore().byId("F1-I");
			if (oFieldInfo) {
				oFieldInfo.destroy();
			}
			var oLabel = sap.ui.getCore().byId("L1");
			if (oLabel) {
				oLabel.destroy();
			}
			oCM.destroy();
			oCM = undefined;
			iCount = 0;
			sId = "";
			sValue = "";
			iLiveCount = 0;
			sLiveId = "";
			sLiveValue = "";
			FieldBase._init();
		}
	});

	QUnit.test("Rendering", function(assert) {

		var fnDone = assert.async();
		setTimeout(function() { // to wait for promise
			var aContent = oField.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			assert.ok(oContent, "content exist");
			assert.equal(oContent.getMetadata().getName(), "sap.m.Link", "sap.m.Link is used");
			assert.equal(oContent.getText && oContent.getText(), "Test", "Text used");
			assert.notOk(oContent.getHref && oContent.getHref(), "no Href used");

			var oFieldInfo = sap.ui.getCore().byId("F1-I");
			oFieldInfo.getTriggerHref.returns(Promise.resolve("test.test"));
			oFieldInfo.fireDataUpdate();
			setTimeout(function() { // to wait for promise
				//					assert.equal(oContent.getHref && oContent.getHref(), "test.test", "Href used");

				oFieldInfo.isTriggerable.returns(Promise.resolve(false));
				oFieldInfo.fireDataUpdate();
				sap.ui.getCore().applyChanges();
				setTimeout(function() { // to wait for promise
					assert.ok(oContent._bIsBeingDestroyed, "Link destroyed");
					aContent = oField.getAggregation("_content");
					oContent = aContent && aContent.length > 0 && aContent[0];
					assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");

					fnDone();
				}, 0);
			}, 0);
		}, 0);

	});

	QUnit.test("opening", function(assert) {

		var fnDone = assert.async();
		setTimeout(function() { // to wait for promise
			var aContent = oField.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];
			var oFieldInfo = sap.ui.getCore().byId("F1-I");

			assert.equal(oContent.getMetadata().getName(), "sap.m.Link", "sap.m.Link is used");
			if (oContent.firePress) {
				oContent.firePress(); // simulate link click
				setTimeout(function() {
					assert.ok(oFieldInfo.open.called, "FieldInfo opened");
					fnDone();
				}, 0);
			} else {
				fnDone();
			}
		}, 0);

	});

	QUnit.test("Remove", function(assert) {

		var fnDone = assert.async();
		setTimeout(function() { // to wait for promise
			var aContent = oField.getAggregation("_content");
			var oContent = aContent && aContent.length > 0 && aContent[0];

			oField.destroyFieldInfo();
			sap.ui.getCore().applyChanges();
			assert.ok(oContent._bIsBeingDestroyed, "Link destroyed");
			aContent = oField.getAggregation("_content");
			oContent = aContent && aContent.length > 0 && aContent[0];
			assert.equal(oContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used");

			fnDone();
		}, 0);

	});

	QUnit.test("Clone", function(assert) {

		var fnDone = assert.async();
		setTimeout(function() { // to wait for promise
			// to add stubs on cloning
			var oFieldInfo = oField.getFieldInfo();
			oFieldInfo.clone = function(sIdSuffix, aLocalIds) {
				var oCloneFieldInfo = FieldInfoBase.prototype.clone.apply(this, arguments);
				sinon.stub(oCloneFieldInfo, "isTriggerable").returns(Promise.resolve(true));
				sinon.stub(oCloneFieldInfo, "getTriggerHref").returns(Promise.resolve(undefined));
				sinon.stub(oCloneFieldInfo, "getContent").returns(Promise.resolve(sap.ui.getCore().byId("L1")));
				sinon.stub(oCloneFieldInfo, "getContentTitle").returns("");
				return oCloneFieldInfo;
			};

			var oClone = oField.clone("myClone");
			oClone.placeAt("content");
			sap.ui.getCore().applyChanges();

			setTimeout(function() { // to wait for promise
				var aContent = oField.getAggregation("_content");
				var oContent = aContent && aContent.length > 0 && aContent[0];
				var aCloneContent = oClone.getAggregation("_content");
				var oCloneContent = aCloneContent && aCloneContent.length > 0 && aCloneContent[0];
				var oCloneFieldInfo = oClone.getFieldInfo();
				assert.ok(!!oCloneFieldInfo, "Clone has FieldInfo");
				assert.equal(oCloneFieldInfo && oCloneFieldInfo.getId(), "F1-I-myClone", "FieldInfo is cloned");
				assert.equal(oCloneContent.getMetadata().getName(), "sap.m.Link", "sap.m.Link is used on Clone");
				assert.equal(oCloneContent.getText && oContent.getText(), "Test", "Text used on Clone");

				oCloneFieldInfo.isTriggerable.returns(Promise.resolve(false));
				oCloneFieldInfo.fireDataUpdate();
				sap.ui.getCore().applyChanges();
				setTimeout(function() { // to wait for promise
					aContent = oField.getAggregation("_content");
					oContent = aContent && aContent.length > 0 && aContent[0];
					aCloneContent = oClone.getAggregation("_content");
					oCloneContent = aCloneContent && aCloneContent.length > 0 && aCloneContent[0];
					assert.equal(oContent.getMetadata().getName(), "sap.m.Link", "sap.m.Link is still used on Original");
					assert.equal(oCloneContent.getMetadata().getName(), "sap.m.Text", "sap.m.Text is used on Clone");

					oClone.destroy();
					fnDone();
				}, 0);
			}, 0);
		}, 0);

	});

});
