/* global QUnit, sinon */

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/comp/library",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/core/CustomData",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/SmartLabel",
	"sap/ui/comp/navpopover/SmartLink",
	"sap/ui/comp/smartfield/Configuration",
	"sap/m/Label",
	"sap/m/Input",
	"sap/ui/core/TooltipBase",
	"sap/m/VBox",
	"sap/m/HBox",
	"sap/ui/core/VariantLayoutData",
	"sap/ui/layout/GridData",
	"sap/ui/layout/ResponsiveFlowLayoutData",
	"sap/m/FlexItemData"
	],
	function(
		jQuery,
		CompLib,
		GroupElement,
		CustomData,
		SmartField,
		SmartLabel,
		SmartLink,
		Configuration,
		Label,
		Input,
		TooltipBase,
		VBox,
		HBox,
		VariantLayoutData,
		GridData,
		ResponsiveFlowLayoutData,
		FlexItemData
	) {
	"use strict";

	var oGroupElement;

	// fake sap.ui.require to test async loading
	var aAsyncModules = [];
	function fakeSapUiRequire() {
		var fnSapUiRequire = sap.ui.require;
		sap.ui.require = function(vDependencies, fnCallback, fnErrCallback) {
			if (typeof vDependencies === 'string' && aAsyncModules.indexOf(vDependencies) >= 0) {
				return undefined;
			} else {
				return fnSapUiRequire(vDependencies, fnCallback, fnErrCallback);
			}
		};
		jQuery.sap.extend(sap.ui.require, fnSapUiRequire);
		sap.ui.require.restore = function() {
			sap.ui.require = fnSapUiRequire;
		};
	}

	function initTest() {
		fakeSapUiRequire();
		oGroupElement = new GroupElement("GE1");
	}

	function afterTest() {
		oGroupElement.destroy();
		oGroupElement = undefined;
		aAsyncModules = [];
		sap.ui.require.restore();
	}

	QUnit.module("Instance", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(oGroupElement, "GroupElement is created");
	});

	QUnit.test("getFormElement", function(assert) {
		var oFormElement = oGroupElement.getFormElement();
		assert.equal(oFormElement, oGroupElement);
	});

	QUnit.module("Elements", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("addElement", function(assert) {
		var oSmartField = new SmartField();

		oGroupElement.addElement(oSmartField);
		var aFields = oGroupElement.getFields();
		assert.equal(aFields.length, 1, "Control is added to \"fields\" aggregation");
		aFields = oGroupElement.getAggregation("elements", []);
		assert.equal(aFields.length, 0, "Control is not added to \"elements\" aggregation");
		assert.equal(oSmartField.getControlContext(), CompLib.smartfield.ControlContextType.Form, "ControlContext set on SmartField");

		oGroupElement.addElement();
		aFields = oGroupElement.getFields();
		assert.equal(aFields.length, 1, "Nothing is added to \"fields\" aggregation");
	});

	QUnit.test("getElements", function(assert) {
		var oSmartField1 = new SmartField();
		var oSmartField2 = new SmartField();

		oGroupElement.addElement(oSmartField1);
		oGroupElement.addElement(oSmartField2);

		var aElements = oGroupElement.getElements();

		assert.equal(aElements.length, 2, "added elements returned");
	});

	QUnit.test("indexOfElement", function(assert) {
		var oSmartField1 = new SmartField();
		var oSmartField2 = new SmartField();

		oGroupElement.addElement(oSmartField1);
		oGroupElement.addElement(oSmartField2);

		var iIndex = oGroupElement.indexOfElement(oSmartField1);
		assert.equal(iIndex, 0, "SmartField1 index");

		iIndex = oGroupElement.indexOfElement(oSmartField2);
		assert.equal(iIndex, 1, "SmartField2 index");
	});

	QUnit.test("insertElement", function(assert) {
		var oSmartField1 = new SmartField("SF1");
		var oSmartField2 = new SmartField("SF2");

		oGroupElement.insertElement(oSmartField1, 0);
		oGroupElement.insertElement(oSmartField2, 0);

		var aFields = oGroupElement.getFields();
		assert.equal(aFields.length, 2, "Controls are inserted to \"fields\" aggregation");
		assert.equal(aFields[0].getId(), "SF2", "Field2 is first field");
		assert.equal(aFields[1].getId(), "SF1", "Field1 is second field");
		var aElements = oGroupElement.getElements();
		assert.equal(aElements.length, 2, "Controls are returned by getElements");
		assert.equal(aElements[0].getId(), "SF2", "Field2 is first element");
		assert.equal(aElements[1].getId(), "SF1", "Field1 is second element");
		assert.equal(oSmartField1.getControlContext(), CompLib.smartfield.ControlContextType.Form, "ControlContext set on SmartField1");
		assert.equal(oSmartField2.getControlContext(), CompLib.smartfield.ControlContextType.Form, "ControlContext set on SmartField2");

		oGroupElement.insertElement(null, 0);
		aElements = oGroupElement.getElements();
		assert.equal(aElements.length, 2, "Nothing inserted");
	});

	QUnit.test("removeElement", function(assert) {
		var oSmartField0 = new SmartField("SF0");
		var oSmartField1 = new SmartField("SF1");
		var oSmartField2 = new SmartField("SF2");

		oGroupElement.addElement(oSmartField0);
		oGroupElement.addElement(oSmartField1);
		oGroupElement.addElement(oSmartField2);

		var oRemovedElement0 = oGroupElement.removeElement(0);
		assert.equal(oSmartField0, oRemovedElement0, "Field0 removed");
		assert.equal(oSmartField0.getControlContext(), CompLib.smartfield.ControlContextType.None, "ControlContext reset on SmartField0");

		var oRemovedElement1 = oGroupElement.removeElement(oSmartField1);
		assert.equal(oSmartField1, oRemovedElement1, "Field1 removed");
		assert.equal(oSmartField1.getControlContext(), CompLib.smartfield.ControlContextType.None, "ControlContext reset on SmartField1");

		var oRemovedElement2 = oGroupElement.removeElement("SF2");
		assert.equal(oSmartField2, oRemovedElement2, "Field2 removed");
		assert.equal(oGroupElement.getElements().length, 0, "All fields removed");
		assert.equal(oSmartField2.getControlContext(), CompLib.smartfield.ControlContextType.None, "ControlContext reset on SmartField2");

		oSmartField0.destroy();
		oSmartField1.destroy();
		oSmartField2.destroy();
	});

	QUnit.test("removeAllElements", function(assert) {
		var oSmartField0 = new SmartField();
		var oSmartField1 = new SmartField();

		oGroupElement.addElement(oSmartField0);
		oGroupElement.addElement(oSmartField1);

		var aRemoved = oGroupElement.removeAllElements();

		assert.deepEqual(aRemoved, [oSmartField0, oSmartField1], "All fields removed");
		assert.equal(oGroupElement.getElements().length, 0, "All fields removed");
		assert.equal(oSmartField0.getControlContext(), CompLib.smartfield.ControlContextType.None, "ControlContext reset on SmartField0");
		assert.equal(oSmartField1.getControlContext(), CompLib.smartfield.ControlContextType.None, "ControlContext reset on SmartField1");

		oSmartField0.destroy();
		oSmartField1.destroy();
	});

	QUnit.test("destroyElements", function(assert) {
		var oSmartField0 = new SmartField("SF1");
		var oSmartField1 = new SmartField("SF2");

		oGroupElement.addElement(oSmartField0);
		oGroupElement.addElement(oSmartField1);

		oGroupElement.destroyElements();

		assert.equal(oGroupElement.getElements().length, 0, "All fields removed");
		assert.notOk(sap.ui.getCore().byId("SF1"), "Field1 is destroyed");
		assert.notOk(sap.ui.getCore().byId("SF2"), "Field2 is destroyed");

	});

	QUnit.module("Label", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("setLabel as string", function(assert) {
		oGroupElement.setLabel("SOME TEXT");

		var sLabel = oGroupElement.getLabel();
		assert.ok(sLabel, "Label is not initial");
		assert.ok(typeof sLabel === "string", "Label is string");
		assert.equal(sLabel, "SOME TEXT", "Label text OK");

		var oLabel = oGroupElement.getLabelControl();
		assert.ok(oLabel, "Label control is not initial");
		assert.ok(oLabel instanceof Label, "Label control is sap.m.Label");
		assert.equal(oLabel.getText(), "SOME TEXT", "Label control text OK");
	});

	QUnit.test("setLabel as object", function(assert) {
		var oLabel = new Label("L1", {text: "SOME TEXT"});
		oGroupElement.setLabel(oLabel);

		var oLabelNew = oGroupElement.getLabel();
		assert.ok(oLabelNew, "Label is not initial");
		assert.ok(oLabel === oLabelNew, "Label is set");

		oLabelNew = oGroupElement.getLabelControl();
		assert.ok(oLabel === oLabelNew, "Label is used");
	});

	QUnit.test("getLabelText", function(assert) {
		oGroupElement.setLabel(new Label({
			text: "SOME TEXT"
		}));

		var sLabelText = oGroupElement.getLabelText();
		assert.equal(sLabelText, "SOME TEXT", "text is OK");
	});

	QUnit.test("Label text used with SmartField", function(assert) {
		oGroupElement.setLabel("Test");
		var oSmartField = new SmartField();
		oGroupElement.addElement(oSmartField);

		var oLabel = oGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.ok(oLabel instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabel.getLabelFor(), oSmartField.getId(), "Label points to SmartField");
		assert.equal(oLabel.getText(), "Test", "Label text used");
		assert.ok(oLabel._getField() === oSmartField, "Label._getField() points to SmartField");
		assert.equal(oSmartField.getTextLabel(), "Test", "Smartfield textLabel OK");

		// if text changes, existing Label must be reused
		oLabel._bXXXMyLabel = true;
		oGroupElement.setLabel("Label");
		var oLabelAfter = oGroupElement.getLabelControl();
		assert.ok(oLabelAfter._bXXXMyLabel, "Label reused");
		assert.equal(oLabelAfter.getText(), "Label", "Label has new text");

		// if Label assigned from outside, existing SmartLabel must be used
		var oNewLabel = new Label("L1", {text: "new Label", tooltip: "Label Tooltip"});
		oGroupElement.setLabel(oNewLabel);
		oLabelAfter = oGroupElement.getLabelControl();
		assert.ok(oLabelAfter instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabelAfter.getText(), "new Label", "Label has new text");

		oNewLabel.setText("new Text");
		assert.equal(oLabelAfter.getText(), "new Text", "Label has new text");

		oGroupElement.setLabel();
		oLabelAfter = oGroupElement.getLabelControl();
		assert.ok(oLabelAfter instanceof SmartLabel, "Label is SmartLabel");
		assert.notOk(oLabelAfter.getText(), "Label has no text");
		assert.notOk(oSmartField.getTextLabel(), "Smartfield has no textLabel");

		oSmartField.setTextLabel("XXX");
		oGroupElement.setLabel("YYY");
		oLabelAfter = oGroupElement.getLabelControl();
		assert.ok(oLabelAfter instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabelAfter.getText(), "YYY", "Label text");
		assert.equal(oSmartField.getTextLabel(), "YYY", "Smartfield textLabel");

		oGroupElement.removeElement(oSmartField);
		oLabelAfter = oGroupElement.getLabelControl();
		assert.ok(oLabelAfter instanceof Label, "Label is SmartLabel");
		assert.equal(oLabelAfter.getText(), "YYY", "Label text");
		assert.equal(oSmartField.getTextLabel(), "XXX", "Smartfield textLabel");

		oSmartField.destroy();
		oNewLabel.destroy();
	});

	QUnit.test("Label with text from SmartField", function(assert) {
		var oSmartField = new SmartField("SF1", {textLabel: "Hello"});
		oGroupElement.addElement(oSmartField);

		var oLabel = oGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.ok(oLabel instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabel.getLabelFor(), oSmartField.getId(), "Label points to SmartField");
		assert.equal(oLabel.getText(), "Hello", "Label text used");
		assert.equal(oGroupElement.getLabelText(), "Hello", "getLabelText retutrns SmartFields label text");
		assert.ok(oLabel._getField() === oSmartField, "Label._getField() points to SmartField");
		assert.equal(oSmartField.getTextLabel(), "Hello", "Smartfield textLabel OK");
		var sLabelId = oLabel.getId();

		oGroupElement.removeElement(oSmartField);
		oLabel = oGroupElement.getLabelControl();
		assert.notOk(!!oLabel, "no Label on GroupElement");
		assert.notOk(sap.ui.getCore().byId(sLabelId), "Label is destroyed");
		oSmartField.destroy();
	});

	QUnit.test("Label from different SmartFields", function(assert) {
		oGroupElement.setLabel("LABEL");
		var oSmartField0 = new SmartField("SF0");
		var oSmartField1 = new SmartField("SF1", {textLabel:"Hello"});
		var oSmartField2 = new SmartField("SF2");

		oGroupElement.addElement(oSmartField0);
		oGroupElement.addElement(oSmartField1);
		oGroupElement.setElementForLabel(1);

		var oLabel = oGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.ok(oLabel instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabel.getLabelFor(), oSmartField1.getId(), "Label points to SmartField1");
		assert.equal(oLabel.getText(), "LABEL", "Label text used"); // SmartFields Label must not overwrite explicit set Label

		oGroupElement.addElement(oSmartField2);
		oLabel = oGroupElement.getLabelControl();
		assert.equal(oLabel.getLabelFor(), oSmartField1.getId(), "Label still points to SmartField1");

		oGroupElement.removeElement(oSmartField1);
		oLabel = oGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.equal(oLabel.getLabelFor(), oSmartField2.getId(), "Label points to SmartField2 after SamrtField1 removed");
		assert.equal(oSmartField1.getTextLabel(), "Hello", "SmartField1 has original TextLabel set");

		oGroupElement.setElementForLabel(2);
		oGroupElement.removeElement(oSmartField0);
		oLabel = oGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.notOk(oLabel instanceof SmartLabel, "Label is not a SmartLabel");
		assert.equal(oLabel.getText(), "LABEL", "Label text used");

		oGroupElement.removeElement(oSmartField2);
		oLabel = oGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.notOk(oLabel instanceof SmartLabel, "Label is not a SmartLabel");
		assert.equal(oLabel.getText(), "LABEL", "Label text used");
		assert.notOk(oSmartField2.getTextLabel(), "SmartField2 has no TextLabel set");

		oSmartField0.destroy();
		oSmartField1.destroy();
		oSmartField2.destroy();
	});

	QUnit.test("moving Label from one GroupElement to an other", function(assert) {
		// it's an key user adaptation use case
		var oGroupElement2 = new GroupElement("GE2");
		var oSmartField1 = new SmartField("SF1", {textLabel:"SF1"});
		var oSmartField2 = new SmartField("SF2", {textLabel:"SF2"});
		oGroupElement.addElement(oSmartField1);
		oGroupElement2.addElement(oSmartField2);

		var oLabel1 = oGroupElement.getLabelControl();
		var oLabel2 = oGroupElement2.getLabelControl();
		assert.ok(oLabel1, "Label1 is not initial");
		assert.ok(oLabel1 instanceof SmartLabel, "Label1 is SmartLabel");
		assert.equal(oLabel1.getLabelFor(), oSmartField1.getId(), "Label1 points to SmartField1");
		assert.equal(oLabel1.getText(), "SF1", "SmartField1 Text used");
		assert.ok(oLabel2, "Label2 is not initial");
		assert.ok(oLabel2 instanceof SmartLabel, "Label2 is SmartLabel");
		assert.equal(oLabel2.getLabelFor(), oSmartField2.getId(), "Label2 points to SmartField2");
		assert.equal(oLabel2.getText(), "SF2", "SmartField2 Text used");

		oGroupElement2.removeElement(oSmartField2);
		oGroupElement.insertElement(oSmartField2, 0);
		oLabel1 = oGroupElement.getLabelControl();
		oLabel2 = oGroupElement2.getLabelControl();
		assert.ok(oLabel1, "Label1 is not initial");
		assert.ok(oLabel1 instanceof SmartLabel, "Label1 is SmartLabel");
		assert.equal(oLabel1.getLabelFor(), oSmartField2.getId(), "Label1 points to SmartField2");
		assert.equal(oLabel1.getText(), "SF2", "SmartField2 Text used");
		assert.notOk(oLabel2, "Label2 is initial");

		oGroupElement.removeElement(oSmartField1);
		oGroupElement2.addElement(oSmartField1);
		oLabel1 = oGroupElement.getLabelControl();
		oLabel2 = oGroupElement2.getLabelControl();
		assert.ok(oLabel1, "Label1 is not initial");
		assert.ok(oLabel1 instanceof SmartLabel, "Label1 is SmartLabel");
		assert.equal(oLabel1.getLabelFor(), oSmartField2.getId(), "Label1 points to SmartField2");
		assert.equal(oLabel1.getText(), "SF2", "SmartField2 Text used");
		assert.ok(oLabel2, "Label2 is not initial");
		assert.ok(oLabel2 instanceof SmartLabel, "Label2 is SmartLabel");
		assert.equal(oLabel2.getLabelFor(), oSmartField1.getId(), "Label1 points to SmartField2");
		assert.equal(oLabel2.getText(), "SF1", "SmartField1 Text used");

		oGroupElement2.destroy();
	});

	QUnit.test("Label from SmartLink", function(assert) {
		var oSmartLink = new SmartLink();
		oGroupElement.addElement(oSmartLink);

		var oLabel = oGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.ok(oLabel instanceof Label, "Label is sap.m.Label");
		assert.notOk(oLabel instanceof SmartLabel, "Label is not a SmartLabel");
		assert.equal(oLabel.getLabelFor(), oSmartLink.getId(), "Label points to SmartLink");

		var oSmartField = new SmartField();
		oGroupElement.insertElement(oSmartField, 0);
		oLabel = oGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.ok(oLabel instanceof SmartLabel, "Label is a SmartLabel");
		assert.equal(oLabel.getLabelFor(), oSmartField.getId(), "Label points to SmartField");
	});

	QUnit.test("setElementForLabel", function(assert) {
		oGroupElement.setElementForLabel(2);
		assert.equal(oGroupElement.getElementForLabel(), 2, "returned value OK");
	});

	QUnit.test("Label required", function(assert) {
		oGroupElement.setLabel("LABEL");
		var oField1 = new Input("I1");
		var oField2 = new Input("I2", {required: true});
		oGroupElement.addElement(oField1);
		var oLabel = oGroupElement.getLabelControl();

		assert.notOk(oLabel.isRequired(), "Label not flagged as required");

		oGroupElement.addElement(oField2);
		assert.ok(oLabel.isRequired(), "Label flagged as required");
	});

	QUnit.test("Label required (set on Label)", function(assert) {
		var oLabel = new Label("L1", {text: "Label", required: true});
		oGroupElement.setLabel(oLabel);
		var oField1 = new Input("I1");
		oGroupElement.addElement(oField1);
		assert.ok(oLabel.isRequired(), "Label flagged as required");
	});

	QUnit.test("Label required (set on SmartField)", function(assert) {
		oGroupElement.setLabel("Test");
		oGroupElement.setProperty("_editable", true); // as only ediatable fields can be required
		var oSmartField1 = new SmartField({mandatory: true});
		var oSmartField2 = new SmartField();
		oGroupElement.addElement(oSmartField1);
		oGroupElement.addElement(oSmartField2);
		var oLabel = oGroupElement.getLabelControl();
		assert.ok(oLabel.isRequired(), "Label flagged as required");

		sinon.spy(oLabel, "invalidate");
		oSmartField1.setMandatory(false);
		assert.notOk(oLabel.isRequired(), "Label not flagged as required");
		assert.ok(oLabel.invalidate.called, "Label invalidated");

		oSmartField2.setMandatory(true);
		assert.ok(oLabel.isRequired(), "Label flagged as required");
	});

	QUnit.test("Label displayOnly", function(assert) {
		var oLabel = new Label("L1", {text: "Label"});
		oGroupElement.setLabel(oLabel);
		assert.notOk(oLabel.isDisplayOnly(), "Label gets default DisplayOnly value");

		oLabel.setDisplayOnly(true);
		assert.ok(oLabel.isDisplayOnly(), "Label gets it's own DisplayOnly value");
	});

	QUnit.test("Label wrapping", function(assert) {
		var oLabel = new Label("L1", {text: "Label"});
		oGroupElement.setLabel(oLabel);
		assert.ok(oLabel.isWrapping(), "Label gets wrapping as default");

		var oSmartField = new SmartField();
		oGroupElement.addElement(oSmartField);

		var oMyLabel = oGroupElement.getLabelControl();
		assert.ok(oMyLabel.isWrapping(), "Label gets wrapping as default");

		oLabel.setWrapping(false);
		assert.notOk(oMyLabel.isWrapping(), "Label gets it's own wrapping value");
		oLabel.destroy();

		oGroupElement.setLabel("Label");
		oMyLabel = oGroupElement.getLabelControl();
		assert.ok(oMyLabel.isWrapping(), "Label gets wrapping as default");
	});

	QUnit.test("_getFieldRelevantForLabel", function(assert) {
		var oSmartField0 = new SmartField();
		var oSmartField1 = new SmartField();

		oGroupElement.addField(oSmartField0);
		oGroupElement.addField(oSmartField1);
		oGroupElement.setElementForLabel(1);

		var oField = oGroupElement._getFieldRelevantForLabel();
		assert.ok(oField === oSmartField1, "SamrtField1 is used for Label");
	});

	QUnit.test("destroyLabel", function(assert) {
		oGroupElement.setLabel("Test");
		var oSmartField = new SmartField("SF1", {textLabel: "Hello"});
		oGroupElement.addElement(oSmartField);
		oGroupElement.destroyLabel();

		assert.notOk(oGroupElement.getLabel(), "getLabel returns no Label");
		var oLabel = oGroupElement.getLabelControl();
		assert.ok(oLabel, "Label is not initial");
		assert.ok(oLabel instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabel.getLabelFor(), oSmartField.getId(), "Label points to SmartField");
		assert.equal(oLabel.getText(), "Hello", "Label text used");
		assert.ok(oLabel._getField() === oSmartField, "Label._getField() points to SmartField");
		assert.equal(oSmartField.getTextLabel(), "Hello", "Smartfield textLabel");

		var oNewLabel = new Label("L1", {text: "new Label", tooltip: "Label Tooltip"});
		oGroupElement.setLabel(oNewLabel);
		oGroupElement.destroyLabel();
		assert.notOk(!!oGroupElement.getLabel(), "getLabel returns no Label");
		oLabel = oGroupElement.getLabelControl();
		assert.notOk(sap.ui.getCore().byId("L1"), "New Label is destroyed");
		assert.ok(oLabel instanceof SmartLabel, "Label is SmartLabel");
		assert.equal(oLabel.getText(), "Hello", "Label has old text");
	});

	QUnit.module("Tooltip", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("setTooltip as string", function(assert) {
		oGroupElement.setTooltip("SOME TOOLTIP");

		var sTooltip = oGroupElement.getTooltip();
		assert.ok(sTooltip, "Tooltip is not initial");
		assert.ok(typeof sTooltip === "string", "Tooltip is string");
		assert.equal(sTooltip, "SOME TOOLTIP", "Tooltip text OK");
	});

	QUnit.test("setTooltip as object", function(assert) {
		var oTooltip = new TooltipBase({text: "SOME TOOLTIP"});
		oGroupElement.setTooltip(oTooltip);

		var oTooltipNew = oGroupElement.getTooltip();
		assert.ok(oTooltipNew, "Tooltip is not initial");
		assert.ok(oTooltip === oTooltipNew, "Tooltip is the same like set");
		assert.equal(oTooltipNew.getText(), "SOME TOOLTIP", "Tooltip text is OK");
	});

	QUnit.test("Tooltip assigned to label", function(assert) {
		oGroupElement.setTooltip("Tooltip");
		var oField1 = new Input();
		oGroupElement.addElement(oField1);

		var oLabel = oGroupElement.getLabelControl();
		assert.equal(oLabel.getTooltip(), "Tooltip", "Label has Tooltip from GroupElement");

		oGroupElement.setTooltip("Tooltip2");
		oLabel = oGroupElement.getLabelControl();
		assert.equal(oLabel.getTooltip(), "Tooltip2", "Label has new Tooltip");
	});

	QUnit.test("Tooltip assigned to SmartField", function(assert) {
		var oTooltip = new TooltipBase({text: "Tooltip"});
		oGroupElement.setTooltip(oTooltip);
		var oField1 = new SmartField();
		oGroupElement.addElement(oField1);

		assert.equal(oField1.getTooltipLabel(), "Tooltip", "SmartField has TooltipLabel from GroupElement");

		oGroupElement.setTooltip("Tooltip2");
		assert.equal(oField1.getTooltipLabel(), "Tooltip2", "SmartField has new TooltipLabel");

		var oLabel = new Label("L1", {text: "Label", tooltip: "Label Tooltip"});
		oGroupElement.setLabel(oLabel);

		assert.equal(oField1.getTooltipLabel(), "Label Tooltip", "SmartField has new TooltipLabel");
	});

	QUnit.module("CustomData", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("addCustomData", function(assert) {
		var oSmartField1 = new SmartField();
		var oSmartField2 = new SmartField();
		var oSmartField3 = new SmartField();
		var oCustomData = new CustomData({key: "KEY", value: "VALUE"});
		var oCustomData2 = new CustomData({key: "sap.ui.fl:AppliedChanges", value: "VALUE"});
		var oCustomData3 = new CustomData({key: "sap-ui-custom-settings", value: "VALUE"});

		oGroupElement.addElement(oSmartField1);
		oGroupElement.addCustomData(oCustomData);
		oGroupElement.addCustomData(oCustomData2); // must not be inherited
		oGroupElement.addCustomData(oCustomData3); // must not be inherited
		oGroupElement.addElement(oSmartField2);
		oGroupElement.insertElement(oSmartField3, 0);

		var aCustomData = oGroupElement.getCustomData();
		assert.equal(aCustomData.length, 3, "CustomData set on GroupElement");
		assert.equal(aCustomData[0], oCustomData, "CustomData set on GroupElement");
		assert.equal(aCustomData[1], oCustomData2, "CustomData set on GroupElement");
		assert.equal(aCustomData[2], oCustomData3, "CustomData set on GroupElement");

		aCustomData = oSmartField1.getCustomData();
		assert.equal(aCustomData.length, 1, "Only one CustomData on SmartField");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on SmartField same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on SmartField same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CstomData on SmartField");

		aCustomData = oSmartField2.getCustomData();
		assert.equal(aCustomData.length, 1, "Only one CustomData on SmartField2");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on SmartField2 same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on SmartField2 same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CstomData on SmartField2");

		aCustomData = oSmartField3.getCustomData();
		assert.equal(aCustomData.length, 1, "Only one CustomData on SmartField3");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on SmartField3 same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on SmartField3 same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CstomData on SmartField3");

		oGroupElement.removeElement(oSmartField2);
		aCustomData = oSmartField2.getCustomData();
		assert.equal(aCustomData.length, 0, "no CustomData on SmartField2 after remove");
		oSmartField2.destroy();

		oGroupElement.addCustomData(); // should not break
		aCustomData = oGroupElement.getCustomData();
		assert.equal(aCustomData.length, 3, "no new CustomData set on GroupElement");
	});

	QUnit.test("insertCustomData", function(assert) {
		var oSmartField1 = new SmartField();
		var oCustomData = new CustomData({key: "KEY", value: "VALUE"});
		var oCustomData2 = new CustomData({key: "sap.ui.fl:AppliedChanges", value: "VALUE"});
		var oCustomData3 = new CustomData({key: "sap-ui-custom-settings", value: "VALUE"});

		oGroupElement.addElement(oSmartField1);
		oGroupElement.insertCustomData(oCustomData, 0);
		oGroupElement.insertCustomData(oCustomData2, 0); // must not be inherited
		oGroupElement.insertCustomData(oCustomData3, 1); // must not be inherited

		var aCustomData = oGroupElement.getCustomData();
		assert.equal(aCustomData.length, 3, "CustomData set on GroupElement");
		assert.equal(aCustomData[0], oCustomData2, "CustomData set on GroupElement");
		assert.equal(aCustomData[1], oCustomData3, "CustomData set on GroupElement");
		assert.equal(aCustomData[2], oCustomData, "CustomData set on GroupElement");

		aCustomData = oSmartField1.getCustomData();
		assert.equal(aCustomData.length, 1, "Only one CustomData on SmartField");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on SmartField same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on SmartField same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CstomData on SmartField");

		oGroupElement.insertCustomData(null, 0); // should not break
		aCustomData = oGroupElement.getCustomData();
		assert.equal(aCustomData.length, 3, "no new CustomData set on GroupElement");
	});

	QUnit.test("removeCustomData", function(assert) {
		var oSmartField1 = new SmartField({
			customData: new CustomData({key: "KEY0", value: "VALUE0"})
		});
		var oCustomData1 = new CustomData({key: "KEY1", value: "VALUE1"});
		var oCustomData2 = new CustomData({key: "KEY2", value: "VALUE2"});

		oGroupElement.addElement(oSmartField1);
		oGroupElement.addCustomData(oCustomData1);
		oGroupElement.addCustomData(oCustomData2);
		oGroupElement.removeCustomData(1);

		var aCustomData = oSmartField1.getCustomData();
		assert.equal(aCustomData.length, 2, "CustomData removed from SmartField");
		assert.equal(aCustomData[0].getKey(), "KEY0", "first customData left");
		assert.equal(aCustomData[1].getKey(), "KEY1", "last customData left");

		oCustomData1.destroy();
	});

	QUnit.test("removeAllCustomData", function(assert) {
		var oSmartField1 = new SmartField({
			customData: new CustomData({key: "KEY0", value: "VALUE0"})
		});
		var oCustomData1 = new CustomData({key: "KEY1", value: "VALUE1"});
		var oCustomData2 = new CustomData({key: "KEY2", value: "VALUE2"});

		oGroupElement.addElement(oSmartField1);
		oGroupElement.addCustomData(oCustomData1);
		oGroupElement.addCustomData(oCustomData2);
		var aCustomData = oGroupElement.removeAllCustomData();

		assert.equal(aCustomData.length, 2, "two CustomData removed from SmartField");
		aCustomData = oSmartField1.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData removed from SmartField");
		assert.equal(aCustomData[0].getKey(), "KEY0", "first customData left");

		oCustomData1.destroy();
		oCustomData2.destroy();
	});

	QUnit.test("destroyCustomData", function(assert) {
		var oSmartField1 = new SmartField({
			customData: new CustomData({key: "KEY0", value: "VALUE0"})
		});
		var oCustomData1 = new CustomData("CD1", {key: "KEY1", value: "VALUE1"});
		var oCustomData2 = new CustomData("CD2", {key: "KEY2", value: "VALUE2"});

		oGroupElement.addElement(oSmartField1);
		oGroupElement.addCustomData(oCustomData1);
		oGroupElement.addCustomData(oCustomData2);
		oGroupElement.destroyCustomData();

		var aCustomData = oSmartField1.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData removed from SmartField");
		assert.equal(aCustomData[0].getKey(), "KEY0", "first customData left");
		assert.notOk(sap.ui.getCore().byId("CD1"), "CustomData destroyed");
	});

	QUnit.test("displayBehaviour set via GroupElement customData shall be set to smart fields", function(assert) {
		var oSmartField1 = new SmartField();
		oSmartField1.setConfiguration(new Configuration({
			"displayBehaviour": "idOnly"
		}));
		var oSmartField2 = new SmartField();

		oGroupElement.addElement(oSmartField1);
		oGroupElement.addElement(oSmartField2);

		oGroupElement.addCustomData(new CustomData({
			"key": "defaultDropDownDisplayBehaviour",
			"value": "idAndDescription"
		}));

		assert.equal(oSmartField1.getConfiguration().getDisplayBehaviour(), "idOnly", "do not overwrite settings on smart field level");
		assert.notOk(oSmartField2.getConfiguration(), "SmartField2 has no configuration");
		assert.equal(oSmartField2.data("defaultDropDownDisplayBehaviour"), "idAndDescription", "value transformed to smart field");
	});

	QUnit.module("Other", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("setVisible", function(assert) {
		var bVisibleChanged = false;
		oGroupElement.attachVisibleChanged(function(oEvent) {
			bVisibleChanged = true;
		});

		assert.notOk(oGroupElement.isVisible(), "GroupElement is not visible as no fields are assigned");

		oGroupElement.setVisible(false);
		assert.notOk(oGroupElement.getVisible(), "Visibility set");
		assert.notOk(oGroupElement.isVisible(), "GroupElement is not visible");
		assert.notOk(bVisibleChanged, "VisibleChanged event not fired");
		bVisibleChanged = false;

		oGroupElement.setVisible(true);
		assert.ok(oGroupElement.getVisible(), "Visibility set");
		assert.ok(oGroupElement.isVisible(), "GroupElement is visible as explicit set");
		assert.ok(bVisibleChanged, "VisibleChanged event fired");
	});

	QUnit.test("visibility from elements", function(assert) {
		var bVisibleChanged = false;
		oGroupElement.attachVisibleChanged(function(oEvent) {
			bVisibleChanged = true;
		});

		var oSmartField = new SmartField();
		oGroupElement.addElement(oSmartField);
		assert.ok(oGroupElement.isVisible(), "GroupElement visible because of visible field");
		assert.ok(bVisibleChanged, "VisibleChanged event fired");
		bVisibleChanged = false;

		sinon.spy(oGroupElement, "invalidate");
		oSmartField.setVisible(false);
		assert.notOk(oGroupElement.isVisible(), "GroupElement invisible because of invisible field");
		assert.ok(oGroupElement.getVisible(), "GroupElement visible property still set");
		assert.ok(bVisibleChanged, "VisibleChanged event fired");
		assert.ok(oGroupElement.invalidate.called, "GroupElement invalidated");
		bVisibleChanged = false;

		oSmartField.setVisible(true);
		assert.ok(oGroupElement.isVisible(), "GroupElement visible because of visible field");
		assert.ok(bVisibleChanged, "VisibleChanged event fired");
		bVisibleChanged = false;

		oSmartField.setVisible(false);
		bVisibleChanged = false;
		oGroupElement.setVisible(true);
		assert.ok(oGroupElement.isVisible(), "GroupElement visible because set on property");
		assert.ok(bVisibleChanged, "VisibleChanged event fired");
	});

	QUnit.test("getVisibleBasedOnElements", function(assert) {
		var oSmartField0 = new SmartField({
			visible: false
		});
		var oSmartField1 = new SmartField({
			visible: false
		});

		var bVisible = oGroupElement.getVisibleBasedOnElements();
		assert.notOk(bVisible, "not visible if no fields are assigned");

		oGroupElement.addField(oSmartField0);
		oGroupElement.addField(oSmartField1);

		bVisible = oGroupElement.getVisibleBasedOnElements();
		assert.notOk(bVisible, "not visible if all fields are not visible");

		oSmartField1.setVisible(true);
		bVisible = oGroupElement.getVisibleBasedOnElements();
		assert.ok(bVisible, "visible if at least one field is visible");
	});

	QUnit.test("edit mode", function(assert) {
		var oSmartField = new SmartField("SF1");

		oGroupElement.setEditMode(false);
		oGroupElement.addElement(oSmartField);

		assert.notOk(oSmartField.getContextEditable(), "SmartField contextEditable not set if GroupElement not editable (default)");

		oGroupElement.setEditMode(true);
		assert.ok(oSmartField.getContextEditable(), "SmartField contextEditable set if GroupElement editable");

		oGroupElement.setEditMode(false);
		assert.notOk(oSmartField.getContextEditable(), "SmartField contextEditable not set if GroupElement not editable");
	});

	QUnit.test("clone", function(assert) {
		var oSmartField1 = new SmartField("SF1", {textLabel: "Hello"});
		var oSmartField2 = new SmartField("SF2");
		var oLabel = new Label("L1", {text: "Label"});
		var oCustomData = new CustomData("CD1", {key: "KEY", value: "VALUE"});

		oGroupElement.addCustomData(oCustomData);
		oGroupElement.setLabel(oLabel);
		oGroupElement.addElement(oSmartField1);
		oGroupElement.addElement(oSmartField2);

		var oClone = oGroupElement.clone("myClone");

		// check if original is still OK
		var aElements = oGroupElement.getElements();
		assert.equal(aElements.length, 2, "Original: has 2 Elements");
		assert.equal(aElements[0].getId(), "SF1", "Original: first element");
		assert.equal(aElements[1].getId(), "SF2", "Original: second element");
		assert.equal(oGroupElement.getLabelText(), "Label", "Original: Label text");
		assert.equal(oGroupElement.getLabel().getId(), "L1", "Original: Label");
		assert.equal(oGroupElement._getLabel().getId(), "SF1-label", "Original: used Label");
		var aCustomData = oGroupElement.getCustomData();
		assert.equal(aCustomData.length, 1, "Original: Only one CustomData on GroupElement");
		assert.equal(aCustomData[0], oCustomData, "Original: CustomData");
		aCustomData = oSmartField1.getCustomData();
		assert.equal(aCustomData.length, 1, "Original: Only one CustomData on SmartField1");
		assert.ok(aCustomData[0]._bFromGroupElement, "Original: CustomData on SmartField created by GroupElement");
		assert.ok(oGroupElement.isVisible(), "Original: GroupElement is visible");
		oSmartField1.setVisible(false);
		oSmartField2.setVisible(false);
		assert.notOk(oGroupElement.isVisible(), "Original: GroupElement is invisible after fields are set to invisible");

		// check clone
		aElements = oClone.getElements();
		assert.equal(aElements.length, 2, "Clone: has 2 Elements");
		assert.equal(aElements[0].getId(), "SF1-myClone", "Clone: first element");
		assert.equal(aElements[1].getId(), "SF2-myClone", "Clone: second element");
		assert.equal(oClone.getLabelText(), "Label", "Clone: Label text");
		assert.equal(oClone.getLabel().getId(), "L1-myClone", "Clone: Label");
		assert.equal(oClone._getLabel().getId(), "SF1-myClone-label", "Clone: used Label");
		aCustomData = oClone.getCustomData();
		assert.equal(aCustomData.length, 1, "Clone: Only one CustomData on GroupElement");
		assert.equal(aCustomData[0].getId(), "CD1-myClone", "Clone: CustomData");
		aCustomData = aElements[0].getCustomData();
		assert.equal(aCustomData.length, 1, "Clone: Only one CustomData on SmartField1");
		assert.ok(aCustomData[0]._bFromGroupElement, "Clone: CustomData on SmartField created by GroupElement");
		assert.ok(oClone.isVisible(), "Clone: GroupElement is visible");
		aElements[0].setVisible(false);
		aElements[1].setVisible(false);
		assert.notOk(oClone.isVisible(), "Clone: GroupElement is invisible after fields are set to invisible");

		oClone.destroy();
	});

	QUnit.module("UseHorizontalLayout", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	function asyncHorizontalTest(assert, fnTest) {
		if (sap.ui.require("sap/m/VBox") && sap.ui.require("sap/m/HBox") && sap.ui.require("sap/m/FlexItemData")
				&& sap.ui.require("sap/ui/core/VariantLayoutData") && sap.ui.require("sap/ui/layout/GridData")
				&& oGroupElement._bHorizontalLayoutUsed) {
			fnTest(assert);
		} else {
			var fnDone = assert.async();
			sap.ui.require(["sap/m/VBox", "sap/m/HBox", "sap/m/FlexItemData",
			                "sap/ui/core/VariantLayoutData", "sap/ui/layout/GridData"], function() {
				fnTest(assert);
				fnDone();
			});
		}
	}

	function setUseHorizontalLayoutTest(assert) {
		assert.ok(oGroupElement.getUseHorizontalLayout(), "UseHorizontalLayout set");

		oGroupElement.setUseHorizontalLayout(false);
		assert.notOk(oGroupElement.getUseHorizontalLayout(), "UseHorizontalLayout not set");
	}

	QUnit.test("setUseHorizontalLayout", function(assert) {
		aAsyncModules.push("sap/m/VBox"); // to force async. loading
		oGroupElement.setUseHorizontalLayout(true);
		asyncHorizontalTest(assert, setUseHorizontalLayoutTest);
	});

	QUnit.test("setHorizontalLayoutGroupElementMinWidth", function(assert) {
		oGroupElement.setHorizontalLayoutGroupElementMinWidth(100);
		assert.equal(oGroupElement.getHorizontalLayoutGroupElementMinWidth(), 100, "HorizontalLayoutGroupElementMinWidth is set");

		sinon.spy(oGroupElement, "_updateLayout");
		oGroupElement.setHorizontalLayoutGroupElementMinWidth(100);
		assert.notOk(oGroupElement._updateLayout.called, "Setting same setHorizontalLayoutGroupElementMinWidth does nothing");
	});

	// just check internal functions to easy find issues
	QUnit.test("_extractFields without label", function(assert) {
		var aElements = [];
		var oVBox = new VBox();
		var oHBox = new HBox();
		var oSF1 = new SmartField();
		var oSF2 = new SmartField();

		oHBox.addItem(oSF1);
		oHBox.addItem(oSF2);
		oVBox.addItem(new Label());
		oVBox.addItem(oHBox);

		aElements = [
			oVBox
		];
		var aFields = oGroupElement._extractFields(aElements, true);

		assert.equal(aFields[0], oSF1, "Smartfield 1 found");
		assert.equal(aFields[1], oSF2, "Smartfield 2 found");
	});

	QUnit.test("_extractFields with label", function(assert) {
		var aElements = [];

		var oLabel = new Label();
		var oSF = new SmartField();

		aElements = [
			oLabel, oSF
		];
		var aFields = oGroupElement._extractFields(aElements, false);

		assert.deepEqual(aFields[0].getId(), oLabel.getId(), "Label found");
		assert.deepEqual(aFields[1].getId(), oSF.getId(), "Smartfield found");
	});

	function fieldsInVBoxTest(assert) {
		var oMyLayoutData = new FlexItemData("LD1");
		var oLabel = new Label("L1", {text: "Label"});
		var oField1 = new Input("I1"); // use sap.m.Input to use Label from outside
		var oField2 = new Input("I2", {required: true});
		var oField3 = new Input("I3", {layoutData: oMyLayoutData});

		oGroupElement.setLabel(oLabel);
		oGroupElement.addElement(oField1);

		var aFields = oGroupElement.getFields();
		assert.ok(aFields[0] instanceof VBox, "VBox created");
		assert.equal(aFields[0].getItems()[0].getId(), "L1", "Label first item in VBox");
		assert.equal(oLabel, oGroupElement.getLabel(), "getLabel sill returns Label");
		assert.equal(oLabel.getLabelForRendering(), "I1", "Label points to field, not to VBox");
		assert.notOk(oLabel.isRequired(), "Label not flagged as required");
		assert.equal(aFields[0].getItems()[1].getId(), "I1", "Field1 second item in VBox");
		assert.notOk(oGroupElement.getLabelControl(), "Label ist not rendered by Form");
		var sVBoxId = aFields[0].getId();
		var mAriaProps = {};
		aFields[0].enhanceAccessibilityState(oField1, mAriaProps);
		assert.equal(mAriaProps["labelledby"], "L1", "Field1 labelled by Label");
		mAriaProps = {labelledby: "XXX"};
		aFields[0].enhanceAccessibilityState(oField1, mAriaProps);
		assert.equal(mAriaProps["labelledby"], "L1 XXX", "Field1 labelled by Label and original Label");

		oGroupElement.addElement(oField2);
		aFields = oGroupElement.getFields();
		assert.equal(aFields[0].getItems()[0].getId(), "L1", "Label first item in VBox");
		assert.equal(oLabel.getLabelForRendering(), "I1", "Label points to field, not to HBox");
		assert.ok(oLabel.isRequired(), "Label flagged as required");
		assert.ok(aFields[0].getItems()[1] instanceof HBox, "HBox created");
		assert.equal(aFields[0].getItems()[1].getItems()[0].getId(), "I1", "Field1 first item in HBox");
		assert.equal(aFields[0].getItems()[1].getItems()[1].getId(), "I2", "Field2 second item in HBox");
		var oLayoutData = oField1.getLayoutData();
		assert.notOk(oLayoutData, "Field1 has no LayoutData");
		oLayoutData = oField2.getLayoutData();
		assert.ok(oLayoutData, "Field2 has LayoutData");
		assert.ok(oLayoutData instanceof FlexItemData, "Field2 has FlexItemData");
		assert.equal(oLayoutData.getStyleClass(), "sapUiCompGroupElementHBoxPadding", "Field2 LayoutData StyleClass set");
		var sHBoxId = aFields[0].getItems()[1].getId();
		mAriaProps = {};
		aFields[0].enhanceAccessibilityState(oField2, mAriaProps);
		assert.equal(mAriaProps["labelledby"], "L1", "Field1 labelled by Label");
		mAriaProps = {labelledby: "XXX"};
		aFields[0].enhanceAccessibilityState(oField2, mAriaProps);
		assert.equal(mAriaProps["labelledby"], "L1 XXX", "Field1 labelled by Label and original Label");

		oGroupElement.insertElement(oField3, 1);
		aFields = oGroupElement.getFields();
		assert.equal(aFields[0].getItems()[1].getItems()[0].getId(), "I1", "Field1 first item in HBox");
		assert.equal(aFields[0].getItems()[1].getItems()[1].getId(), "I3", "Field3 second item in HBox");
		assert.equal(aFields[0].getItems()[1].getItems()[2].getId(), "I2", "Field2 third item in HBox");
		oLayoutData = oField3.getLayoutData();
		assert.equal(oLayoutData.getId(), "LD1", "Field3 original LayoutData of field used");
		assert.equal(oMyLayoutData.getStyleClass(), "sapUiCompGroupElementHBoxPadding", "Field3 LayoutData StyleClass set");

		aFields = oGroupElement.getElements();
		assert.equal(aFields.length, 3, "get Elements returns Fields");
		assert.equal(aFields[0].getId(), "I1", "Field1 is first field");
		assert.equal(aFields[1].getId(), "I3", "Field3 is second field");
		assert.equal(aFields[2].getId(), "I2", "Field2 is third field");

		assert.equal(oGroupElement.indexOfElement(oField1), 0, "Field1 is first field");
		assert.equal(oGroupElement.indexOfElement(oField3), 1, "Field3 is second field");
		assert.equal(oGroupElement.indexOfElement(oField2), 2, "Field2 is third field");

		oGroupElement.removeElement(oField3);
		aFields = oGroupElement.getElements();
		assert.equal(aFields.length, 2, "get Elements returns Fields");
		assert.equal(aFields[0].getId(), "I1", "Field1 is first field");
		assert.equal(aFields[1].getId(), "I2", "Field2 is second field");
		oLayoutData = oField3.getLayoutData();
		assert.equal(oLayoutData.getId(), "LD1", "Field3 original LayoutData of field used");
		assert.notOk(oMyLayoutData.getStyleClass(), "Field3 LayoutData no StyleClass set");

		oGroupElement.removeElement(0);
		aFields = oGroupElement.getElements();
		assert.equal(aFields.length, 1, "get Elements returns Fields");
		assert.equal(aFields[0].getId(), "I2", "Field2 is first field");
		assert.notOk(sap.ui.getCore().byId(sHBoxId), "HBox is destroyed");
		assert.equal(oGroupElement.getFields()[0].getItems()[1], oField2, "Field2 second item in VBox");

		oGroupElement.removeAllElements();
		aFields = oGroupElement.getElements();
		assert.equal(aFields.length, 0, "get Elements returns no Fields");
		assert.notOk(sap.ui.getCore().byId(sVBoxId), "VBox is destroyed");
		assert.ok(oLabel, "Label still exists");
		assert.equal(oLabel, oGroupElement.getLabel(), "Label sill assigned to GroupElement");

		oLayoutData = oField2.getLayoutData();
		assert.notOk(oLayoutData, "Field2 has no LayoutData");

		oGroupElement.addElement(oField2);
		oGroupElement.insertElement(oField1, 0);
		aFields = oGroupElement.getFields();
		assert.ok(aFields[0] instanceof VBox, "VBox created");
		assert.equal(aFields[0].getItems()[0].getId(), "L1", "Label first item in VBox");
		assert.equal(oLabel.getLabelForRendering(), "I1", "Label points to field, not to HBox");
		assert.ok(aFields[0].getItems()[1] instanceof HBox, "HBox created");
		assert.equal(aFields[0].getItems()[1].getItems()[0].getId(), "I1", "Field1 first item in HBox");
		assert.equal(aFields[0].getItems()[1].getItems()[1].getId(), "I2", "Field2 second item in HBox");
		sVBoxId = aFields[0].getId();
		oGroupElement.destroyElements();
		aFields = oGroupElement.getElements();
		assert.equal(aFields.length, 0, "get Elements returns no Fields");
		assert.notOk(sap.ui.getCore().byId(sVBoxId), "VBox is destroyed");
		assert.ok(oLabel, "Label still exists");
		assert.equal(oLabel, oGroupElement.getLabel(), "Label sill assigned to GroupElement");
		assert.notOk(sap.ui.getCore().byId("I1"), "Field1 is destroyed");
		assert.notOk(sap.ui.getCore().byId("I2"), "Field1 is destroyed");

		oField3.destroy();
	}

	QUnit.test("Fields in VBox and HBox", function(assert) {
		aAsyncModules.push("sap/m/VBox"); // to force async. loading
		oGroupElement.setUseHorizontalLayout(true);
		asyncHorizontalTest(assert, fieldsInVBoxTest);
	});

	function createRemoveFromVBoxTest(assert) {
		var oLabel = sap.ui.getCore().byId("L1");
		var oField1 = sap.ui.getCore().byId("I1");
		var oField2 = sap.ui.getCore().byId("I2");
		var oField3 = sap.ui.getCore().byId("I3");
		var oGridData = sap.ui.getCore().byId("GD1");
		var aFields = oGroupElement.getFields();
		var oVBox = aFields[0];
		assert.ok(oVBox instanceof VBox, "VBox created");
		var oLayoutData = oVBox.getLayoutData();
		assert.ok(oLayoutData && oLayoutData instanceof GridData, "VBox has LayoutData");
		assert.notEqual(oLayoutData.getId(), oGridData.getId(), "LayoutData of field not assigned to VBox");
		assert.equal(oLayoutData.getSpan(), "XL1 L2 M3 S4", "VBox LayoutData content");
		var sVBoxId = oVBox.getId();
		assert.equal(oVBox.getItems()[0].getId(), "L1", "Label first item in VBox");
		assert.equal(oLabel.getLabelForRendering(), "I1", "Label points to field, not to VBox");
		assert.ok(oVBox.getItems()[1] instanceof HBox, "HBox created");
		assert.equal(oVBox.getItems()[1].getItems()[0].getId(), "I1", "Field1 first item in HBox");
		assert.equal(oVBox.getItems()[1].getItems()[1].getId(), "I2", "Field2 second item in HBox");
		assert.equal(oVBox.getItems()[1].getItems()[2].getId(), "I3", "Field3 third item in HBox");

		sinon.spy(oGroupElement, "invalidateLabel");
		oField1.setRequired(true);
		assert.ok(oGroupElement.invalidateLabel.called, "Label invalidated on required change");
		assert.ok(oLabel.isRequired(), "Label is required");

		oGroupElement.setUseHorizontalLayout(false);
		aFields = oGroupElement.getFields();
		assert.equal(aFields.length, 3, "3 Fields assigned");
		assert.notOk(aFields[0] instanceof VBox, "no VBox");
		assert.notOk(sap.ui.getCore().byId(sVBoxId), "VBox destroyed");
		assert.ok(oGroupElement.getLabelControl(), "Label ist rendered by Form");

		oGroupElement.removeElement(oField2);
		oGroupElement.removeElement(oField3);
		oField2.destroy();
		oField3.destroy();
		oField1.destroyLayoutData();
		var oFlexItemData = new FlexItemData("FID1");
		oField1.setLayoutData(oFlexItemData);
		oGroupElement.setUseHorizontalLayout(true);
		aFields = oGroupElement.getFields();
		oVBox = aFields[0];
		oLayoutData = oVBox.getLayoutData();
		assert.ok(oVBox instanceof VBox, "VBox created");
		assert.notOk(!!oLayoutData, "VBox has no LayoutData");
		assert.notOk(oVBox.getItems()[1] instanceof HBox, "no HBox created");
		assert.equal(oVBox.getItems()[1], oField1, "Field directly in VBox");

		sinon.spy(oGroupElement, "_updateLayout");
		oGroupElement.setUseHorizontalLayout(true);
		assert.notOk(oGroupElement._updateLayout.called, "Setting same useHorizontalLayout does nothing");
	}

	QUnit.test("create and remove VBox and HBox", function(assert) {
		var oLabel = new Label("L1", {text: "Label"});
		var oGridData = new GridData("GD1", {span: "XL1 L2 M3 S4"});
		var oField1 = new Input("I1", {layoutData: oGridData}); // use sap.m.Input to use Label from outside
		var oField2 = new Input("I2");
		var oField3 = new Input("I3");
		oGroupElement.setLabel(oLabel);
		oGroupElement.addElement(oField1);
		oGroupElement.addElement(oField2);
		oGroupElement.addElement(oField3);

		oGroupElement.setUseHorizontalLayout(true);

		asyncHorizontalTest(assert, createRemoveFromVBoxTest);
	});

	function editModeTest(assert) {
		var oSmartField = new SmartField({
			contextEditable: false
		});

		oGroupElement.setEditMode(false);
		oGroupElement.addElement(oSmartField);

		oGroupElement.setEditMode(true);
		assert.ok(oSmartField.getContextEditable(), "SmartField contextEditable set if GroupElement editable");

		oGroupElement.setEditMode(false);
		assert.notOk(oSmartField.getContextEditable(), "SmartField contextEditable not set if GroupElement not editable");
	}

	QUnit.test("edit mode", function(assert) {
		oGroupElement.setUseHorizontalLayout(true);
		asyncHorizontalTest(assert, editModeTest);
	});

	function setLinebreakTest(assert) {
		var oLabel = new Label("L1", {text: "Label"});
		var oField1 = new Input("I1");

		oGroupElement.setLabel(oLabel);
		oGroupElement.addElement(oField1);

		// simulate _updateVBoxGridDataSpan and set layoutData manually
		var oGridData = new GridData({span: "XL1 L2 M3 S4"});
		var oVBox = oGroupElement.getFields()[0];
		assert.equal(oVBox instanceof VBox, true, "VBox found");
		oVBox.setLayoutData(oGridData);

		oGroupElement._setLinebreak(true, true, true, true);

		assert.ok(oGridData.getLinebreakXL(), "LinebreakXL set");
		assert.ok(oGridData.getLinebreakL(), "LinebreakXL set");
		assert.ok(oGridData.getLinebreakM(), "LinebreakXL set");
		assert.ok(oGridData.getLinebreakS(), "LinebreakXL set");

		oGridData.destroy();
		oGridData = new GridData({span: "XL1 L2 M3 S4"});
		var oVariantLayout = new VariantLayoutData({
			multipleLayoutData: [new FlexItemData(), oGridData]
		});
		oVBox.setLayoutData(oVariantLayout);

		oGroupElement._setLinebreak(true, true, true, true);

		assert.ok(oGridData.getLinebreakXL(), "LinebreakXL set");
		assert.ok(oGridData.getLinebreakL(), "LinebreakXL set");
		assert.ok(oGridData.getLinebreakM(), "LinebreakXL set");
		assert.ok(oGridData.getLinebreakS(), "LinebreakXL set");
	}

	QUnit.test("_setLinebreak", function(assert) {
		oGroupElement.setUseHorizontalLayout(true);
		asyncHorizontalTest(assert, setLinebreakTest);
	});

	function cloneTest(assert) {
		var oSmartField1 = new SmartField("SF1", {textLabel: "Hello"});
		var oSmartField2 = new SmartField("SF2");
		var oLabel = new Label("L1", {text: "Label"});
		var oCustomData = new CustomData("CD1", {key: "KEY", value: "VALUE"});

		oGroupElement.addCustomData(oCustomData);
		oGroupElement.setLabel(oLabel);
		oGroupElement.addElement(oSmartField1);
		oGroupElement.addElement(oSmartField2);

		var oClone = oGroupElement.clone("myClone");

		// check if original is still OK
		var aFields = oGroupElement.getFields();
		var oVBox = aFields[0];
		assert.ok(oVBox instanceof VBox, "Original: VBox created");
		assert.equal(oVBox._oGroupElement.getId(), oGroupElement.getId(), "Original: VBox internal GroupElement");
		assert.equal(oVBox.getItems()[0].getId(), "SF1-label", "Original: Label first item in VBox");
		assert.notOk(oGroupElement.getLabelControl(), "Original: Label ist not rendered by Form");
		var oHBox = oVBox.getItems()[1];
		assert.ok(oHBox instanceof HBox, "Original: HBox created");
		assert.equal(oHBox._oGroupElement.getId(), oGroupElement.getId(), "Original: HBox internal GroupElement");
		assert.equal(oHBox.getItems()[0].getId(), "SF1", "Original: Field1 first item in HBox");
		assert.equal(oHBox.getItems()[1].getId(), "SF2", "Original: Field2 second item in HBox");
		var oLayoutData = oSmartField2.getLayoutData();
		assert.ok(oLayoutData, "Original: Field2 has LayoutData");
		assert.ok(oLayoutData instanceof FlexItemData, "Original: Field2 has FlexItemData");
		assert.ok(oLayoutData._bCreatedByGroupElement, "Original: Field2 LayoutData created by GroupElement");

		// check clone
		aFields = oClone.getFields();
		oVBox = aFields[0];
		assert.ok(oVBox instanceof VBox, "Clone: VBox created");
		assert.equal(oVBox._oGroupElement ? oVBox._oGroupElement.getId() : null, oClone.getId(), "Clone: VBox internal GroupElement");
		assert.equal(oVBox.getItems()[0].getId(), "SF1-myClone-label", "Clone: Label first item in VBox");
		assert.notOk(oClone.getLabelControl(), "Clone: Label ist not rendered by Form");
		oHBox = oVBox.getItems()[1];
		assert.ok(oHBox instanceof HBox, "Clone: HBox created");
		assert.equal(oHBox._oGroupElement ? oHBox._oGroupElement.getId() : null, oClone.getId(), "Clone: HBox internal GroupElement");
		assert.equal(oHBox.getItems()[0].getId(), "SF1-myClone", "Clone: Field1 first item in HBox");
		assert.equal(oHBox.getItems()[1].getId(), "SF2-myClone", "Clone: Field2 second item in HBox");
		oLayoutData = oHBox.getItems()[1].getLayoutData();
		assert.ok(oLayoutData, "Clone: Field2 has LayoutData");
		assert.ok(oLayoutData instanceof FlexItemData, "Clone: Field2 has FlexItemData");
		assert.ok(oLayoutData._bCreatedByGroupElement, "Clone: Field2 LayoutData created by GroupElement");

		oClone.destroy();
	}

	QUnit.test("clone", function(assert) {
		oGroupElement.setUseHorizontalLayout(true);
		asyncHorizontalTest(assert, cloneTest);
	});

});