/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartform/flexibility/changes/AddField",
	"sap/ui/comp/smartform/flexibility/changes/AddFields",
	"sap/ui/comp/smartform/flexibility/changes/RenameField",
	"sap/ui/fl/Change",
	"sap/ui/fl/changeHandler/Base",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/core/mvc/View",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/core/util/reflection/XmlTreeModifier",
	"sap/ui/rta/enablement/elementActionTest",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/thirdparty/sinon-4",
	"sap/ui/commons/TextView" // needs to be included for the legacy tests
], function (
	AddFieldChangeHandler,
	AddFieldsChangeHandler,
	RenameFieldChangeHandler,
	ChangeWrapper,
	ChangeHandlerBase,
	SmartForm,
	SmartFormGroup,
	SmartFormGroupElement,
	SmartField,
	View,
	JsControlTreeModifier,
	XmlTreeModifier,
	elementActionTest,
	MockServer,
	ODataModel,
	sinon
) {
	"use strict";

	var sandbox = sinon.sandbox.create();

	//Mockserver
	var oMockServer = new MockServer({
		rootUri: "/smartFieldTest/"
	});

	MockServer.config({
		autoRespond: true,
		autoRespondAfter: 1000
	});

	oMockServer.simulate("test-resources/sap/ui/comp/qunit/smartform/flexibility/testResources/metadata.xml", {
		sMockdataBaseUrl: "test-resources/sap/ui/comp/qunit/smartform/flexibility/testResources",
		bGenerateMissingMockData: true
	});

	oMockServer.start();

	var oModel = new ODataModel("/smartFieldTest", {json: true, preliminaryContext: true});


	// Add GroupElement
	var fnConfirmFieldIsAdded = function(oAppComponent, oView, assert) {
		var aGroupElements = oView.byId("group").getGroupElements();
		assert.equal(aGroupElements.length, 2, "then a new groupelement exists");
		var oNewGroupElement = oView.byId("my_new_control");
		var oSmartField = oNewGroupElement.getFields()[0];
		assert.equal(oSmartField.getId(), oNewGroupElement.getId() + "-element0", "then the smart field was assigned a stable id");
		assert.equal(oSmartField.getBindingPath("value"), "binding/path", "and the smart field inside is bound correctly");
	};

	var fnConfirmFieldIsRemoved = function(oAppComponent, oView, assert) {
		var aGroupElements = oView.byId("group").getGroupElements();
		assert.equal(aGroupElements.length, 1, "then only the old groupelement exists");
		var oNewGroupElement = oView.byId("my_new_control");
		assert.notOk(oNewGroupElement, "and new control is removed");
	};

	elementActionTest("Checking the addODataProperty action (add GroupElement) for a smart form group", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement">' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "addODataProperty",
			controlId : "group",
			parameter : function(oView){
				return {
					index : 0,
					newControlId : oView.createId("my_new_control"),
					bindingString : "binding/path"
				};
			}
		},
		afterAction : fnConfirmFieldIsAdded,
		afterUndo : fnConfirmFieldIsRemoved,
		afterRedo : fnConfirmFieldIsAdded
	});

	//Rename GroupElement
	var fnConfirmGroupElementIsRenamedWithNewValue = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("groupelement").getLabel(),
			"newGroupElementLabel",
			"then the control has been renamed to the new value (newGroupElementLabel)");
	};

	var fnConfirmGroupElementIsRenamedWithOldValue = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("groupelement").getLabel(),
			"groupElementLabel",
			"then the control has been renamed to the old value (groupElementLabel)");
	};

	// Use elementActionTest to check if a control is ready for the rename action of UI adaptation
	elementActionTest("Checking the rename action for a GroupElement", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
			'<SmartForm id="form">' +
				'<Group id="group" >' +
					'<GroupElement id="groupelement" label="groupElementLabel">' +
						'<m:Button text="click me" />' +
					'</GroupElement>' +
				'</Group>' +
			'</SmartForm>' +
		'</mvc:View>'
		,
		action : {
			name : "rename",
			controlId : "groupelement",
			parameter : function(oView){
				return {
					newValue : 'newGroupElementLabel',
					renamedElement : oView.byId("groupelement")
				};
			}
		},
		afterAction : fnConfirmGroupElementIsRenamedWithNewValue,
		afterUndo : fnConfirmGroupElementIsRenamedWithOldValue,
		afterRedo : fnConfirmGroupElementIsRenamedWithNewValue
	});

	//Rename GroupElement	with an empty string
	var fnConfirmGroupElementIsRenamedWithEmptyStringValue = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("groupelement1").getLabel(),
			"",
			"then the control has been renamed to the new value (empty string)");
	};

	var fnConfirmGroupElementIsRenamedWithOldValue1 = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("groupelement1").getLabel(),
			"groupElementLabel1",
			"then the control has been renamed to the old value (groupElementLabel1)");
	};

	// Use elementActionTest to check if a control is ready for the rename action of UI adaptation
	elementActionTest("Checking the rename action with an empty string for a GroupElement", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
			'<SmartForm id="form1">' +
				'<Group id="group1" >' +
					'<GroupElement id="groupelement1" label="groupElementLabel1">' +
						'<m:Button text="click me" />' +
					'</GroupElement>' +
				'</Group>' +
			'</SmartForm>' +
		'</mvc:View>'
		,
		action : {
			name : "rename",
			controlId : "groupelement1",
			parameter : function(oView){
				return {
					newValue : '',
					renamedElement : oView.byId("groupelement1")
				};
			}
		},
		afterAction : fnConfirmGroupElementIsRenamedWithEmptyStringValue,
		afterUndo : fnConfirmGroupElementIsRenamedWithOldValue1,
		afterRedo : fnConfirmGroupElementIsRenamedWithEmptyStringValue
	});

	//Rename GroupElement with a label from a SmartField
	var fnConfirmGroupElementIsRenamedWithNewValue2 = function(oUiComponent, oViewAfterAction, assert) {
		var oControl = oViewAfterAction.byId("groupelement2");
		assert.strictEqual(oControl.getLabelText(),
			"newGroupElementLabel",
			"then the control has been renamed to the new value (newGroupElementLabel)"
		);
	};

	var fnConfirmGroupElementIsRenamedWithOldValue2 = function(oUiComponent, oViewAfterAction, assert) {
		var oControl = oViewAfterAction.byId("groupelement2");
		assert.strictEqual(oControl.getLabelText(),
			"Product Type",
			"then the control has been renamed to the old value (Product Type)"
		);
	};

	// Use elementActionTest to check if a control is ready for the rename action of UI adaptation
	elementActionTest("Checking the rename action for a GroupElement containing a SmartField", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns:sf="sap.ui.comp.smartfield" xmlns="sap.ui.comp.smartform">' +
			'<SmartForm id="form2" binding="{/mockProductData(1)}">' +
				'<Group id="group2" >' +
					'<GroupElement id="groupelement2">' +
						'<sf:SmartField editable="true" contextEditable="true" value="{ProductName}"/>' +
					'</GroupElement>' +
				'</Group>' +
			'</SmartForm>' +
		'</mvc:View>'
		,
		action : {
			name : "rename",
			controlId : "groupelement2",
			parameter : function(oView){
				return {
					newValue : 'newGroupElementLabel',
					renamedElement : oView.byId("groupelement2")
				};
			}
		},
		model: oModel,
		afterAction : fnConfirmGroupElementIsRenamedWithNewValue2,
		afterUndo : fnConfirmGroupElementIsRenamedWithOldValue2,
		afterRedo : fnConfirmGroupElementIsRenamedWithNewValue2
	});

	QUnit.module("AddField (legacy) and AddFields edge case tests", {
		beforeEach: function () {
			this.oAddFieldChangeHandler = AddFieldChangeHandler;
			this.oAddFieldsChangeHandler = AddFieldsChangeHandler;
			this.oMockedAppComponent = {
				getLocalId: function () {
					return undefined;
				}
			};
		},
		afterEach: function () {
			var oAddedControl = sap.ui.getCore().byId("addedFieldId");
			if (oAddedControl){
				oAddedControl.destroy();
			}
			sandbox.restore();
		}
	});

	// Keep these tests to ensure that legacy changes are still valid
	QUnit.test('applyChange - positive test (legacy)', function (assert) {
		var oChange = {
			"selector": {
				"id": "groupkey1"
			},
			"content": {
				"field": {
					"id": "addedFieldId",
					"index": 0,
					"jsType": "sap.ui.commons.TextView",
					"valueProperty": "text",
					"value": "BindingPath1",
					"entitySet": "testEntitySet1"
				}
			},
			"texts": {
				"fieldLabel": {
					"value": "the field label",
					"type": "XFLD"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oGroup = new SmartFormGroup();
		var oForm = new SmartForm({
			groups : [oGroup]
		});
		var oView = new View({content : [
			oForm
		]});
		var oAddGroupElementSpy = sandbox.spy(oGroup, "insertGroupElement");

		assert.equal(oGroup.getGroupElements().length, 0);

		assert.ok(this.oAddFieldChangeHandler.applyChange(oChangeWrapper, oGroup, {modifier: JsControlTreeModifier, view : oView, appComponent: this.oMockedAppComponent}));

		assert.ok(oAddGroupElementSpy.calledOnce);
		assert.equal(oGroup.getGroupElements().length, 1);
		var oGroupElement = oGroup.getGroupElements()[0];
		assert.equal(oGroupElement.getLabelText(), "the field label");
		assert.equal(oGroupElement.getElements().length, 1);
		var oControl = oGroupElement.getElements()[0];
		assert.equal(oControl.getBindingPath("text"),"BindingPath1");
	});

	QUnit.test('applyChange - positive test with field selector (legacy)', function (assert) {
		var oChange = {
			"selector": {
				"id": "groupkey1"
			},
			"content": {
				"field": {
					"selector": {
						"id": "addedFieldId"
					},
					"index": 0,
					"jsType": "sap.ui.commons.TextView",
					"valueProperty": "text",
					"value": "BindingPath1",
					"entitySet": "testEntitySet1"
				}
			},
			"texts": {
				"fieldLabel": {
					"value": "the field label",
					"type": "XFLD"
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oGroup = new SmartFormGroup();
		var oForm = new SmartForm({
			groups : [oGroup]
		});
		var oView = new View({content : [
			oForm
		]});
		var oAddGroupElementSpy = sandbox.spy(oGroup, "insertGroupElement");

		assert.equal(oGroup.getGroupElements().length, 0);

		assert.ok(this.oAddFieldChangeHandler.applyChange(oChangeWrapper, oGroup, {modifier: JsControlTreeModifier, appComponent: this.oMockedAppComponent, view : oView}));

		assert.ok(oAddGroupElementSpy.calledOnce);
		assert.equal(oGroup.getGroupElements().length, 1);
		var oGroupElement = oGroup.getGroupElements()[0];
		assert.equal(oGroupElement.getLabelText(), "the field label");
		assert.equal(oGroupElement.getElements().length, 1);
		var oControl = oGroupElement.getElements()[0];
		assert.equal(oControl.getBindingPath("text"),"BindingPath1");
	});

	QUnit.test('completeChangeContent addField (legacy)', function (assert){
		var oChange = {
			"selector": {
				"id": "groupkey"
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		var oSpecificChangeInfo = {
			"index": 0,
			"fieldLabel": "the field label",
			"jsType": "sap.ui.commons.TextView",
			"fieldValue": "the TextView text",
			"valueProperty": "text",
			"entitySet" : "testEntitySet1",
			"newControlId" : "the--new--control--id"
		};
		this.oAddFieldChangeHandler.completeChangeContent(oChangeWrapper, oSpecificChangeInfo, {appComponent: this.oMockedAppComponent});
		assert.equal(oChange.texts.fieldLabel.value, "the field label");
		assert.equal(oChange.content.field.jsType, "sap.ui.commons.TextView");
		assert.equal(oChange.content.field.value, "the TextView text");
		assert.equal(oChange.content.field.valueProperty, "text");
		assert.equal(oChange.content.field.selector.id, "the--new--control--id");
		assert.equal(oChange.content.field.index, 0);
		assert.equal(oChange.content.field.entitySet,"testEntitySet1");
	});

	QUnit.test('applyChange- addFields - add smart field to js control tree with duplicated id', function (assert) {
		var oChange = {
			"selector": {
				"id": "groupkey1"
			},
			"content": {
				"field": {
					"id": "addedFieldId",
					"index": 0,
					"jsTypes": [ "sap.ui.comp.smartfield.SmartField" ],
					"valueProperty": [ "value" ],
					"value": [ "BindingPath1" ],
					"entitySet": ["testEntitySet1"]
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oGroup = new SmartFormGroup();
		var oForm = new SmartForm({
			groups : [oGroup]
		});
		var oView = new View({content : [
			oForm
		]});
		var oMarkAsNotApplicableSpy = sandbox.spy(ChangeHandlerBase, "markAsNotApplicable");

		assert.equal(oGroup.getGroupElements().length, 0);

		assert.ok(this.oAddFieldsChangeHandler.applyChange(oChangeWrapper, oGroup, {modifier: JsControlTreeModifier, appComponent: this.oMockedAppComponent, view : oView}));
		try {
			assert.ok(this.oAddFieldsChangeHandler.applyChange(oChangeWrapper, oGroup, {modifier: JsControlTreeModifier, appComponent: this.oMockedAppComponent, view : oView}));
		} catch (oError) {
			assert.ok(oError, "error is thrown when adding an element with duplicated id");
			assert.ok(oMarkAsNotApplicableSpy.calledOnce, "markAsNotApplicable function is called once");
		}
	});

	QUnit.test('applyChange - addFields - add smart field with binding path to js control tree', function (assert) {
		var oChange = {
			"selector": {
				"id": "groupkey1"
			},
			"content": {
				"field": {
					"id": "addedFieldId",
					"index": 0,
					"jsTypes": ["sap.ui.comp.smartfield.SmartField"],
					"valueProperty": [ "value" ],
					"value": [ "BindingPath1" ],
					"entitySet": ["testEntitySet1"]
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oGroup = new SmartFormGroup();
		var oForm = new SmartForm({
			groups : [oGroup]
		});
		var oView = new View({content : [
			oForm
		]});
		var oAddGroupElementSpy = sandbox.spy(oGroup, "insertGroupElement");

		assert.equal(oGroup.getGroupElements().length, 0);

		assert.ok(this.oAddFieldsChangeHandler.applyChange(oChangeWrapper, oGroup, {modifier: JsControlTreeModifier, appComponent: this.oMockedAppComponent, view : oView}));

		assert.ok(oAddGroupElementSpy.calledOnce);
		assert.equal(oGroup.getGroupElements().length, 1);
		var oGroupElement = oGroup.getGroupElements()[0];
		assert.equal(oGroupElement.getElements().length, 1);
		var oControl = oGroupElement.getElements()[0];
		assert.equal(oControl.getId(), oGroupElement.getId() + "-element0");
		assert.equal(oControl.getBindingPath("value"), "BindingPath1");
		assert.ok(oControl.getEntitySet);
		assert.equal(oControl.getEntitySet(),"testEntitySet1");
		assert.ok(oControl.getExpandNavigationProperties(), "auto expand internal navigation properties is set");
	});

	QUnit.test('applyChange - add smart field with duplicated id to xml tree', function (assert) {
		var sGroupId = "groupkey1";
		var sAddedFieldId = "addedFieldId";
		var sValueProperty = "value";
		var sValue = "BindingPath1";

		var oChange = {
			"selector": {
				"id": sGroupId
			},
			"content": {
				"field": {
					"id": sAddedFieldId,
					"index": 2,
					"jsTypes":  ["sap.ui.comp.smartfield.SmartField"],
					"valueProperty": [sValueProperty],
					"value": [sValue],
					"entitySet": ["testEntitySet1"]
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);
		var oDOMParser = new DOMParser();
		var sGroupElementId1 = "groupId1";
		var sGroupElementId2 = "groupId2";
		var oXmlString =
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform">' +
				'<Group label="GroupHeader" id="' + sGroupId + '">' +
					'<groupElements>' +
						'<GroupElement id="' + sGroupElementId1 + '">' +
							'<SmartField value="fieldValue1" id="sFieldId1" />' +
						'</GroupElement>' +
						'<GroupElement id="' + sGroupElementId2 + '">' +
							'<SmartField value="fieldValue2" id="sFieldId2" />' +
						'</GroupElement>' +
					'</groupElements>' +
				'</Group>' +
			'</mvc:View>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml").documentElement;
		var oXmlSmartFormGroup = oXmlDocument.childNodes[0];
		assert.ok(this.oAddFieldsChangeHandler.applyChange(oChangeWrapper, oXmlSmartFormGroup, {modifier: XmlTreeModifier, view: oXmlDocument, appComponent: this.oMockedAppComponent}));
		try {
			assert.ok(this.oAddFieldsChangeHandler.applyChange(oChangeWrapper, oXmlSmartFormGroup, {modifier: XmlTreeModifier, view: oXmlDocument, appComponent: this.oMockedAppComponent}));
		} catch (oError) {
			assert.ok(oError, "error is thrown when adding an element with duplicated id");
		}

		var oXmlSmartFormGroupElements = oXmlSmartFormGroup.childNodes[0];
		assert.equal(oXmlSmartFormGroupElements.childElementCount, 3);
	});

	QUnit.test('applyChange - addFields - add smart field to xml tree with default aggregation', function (assert) {
		var sGroupId = "groupkey1";
		var sAddedFieldId = "addedFieldId";
		var sValueProperty = "value";
		var sValue = "BindingPath1";

		var oChange = {
			"selector": {
				"id": sGroupId
			},
			"content": {
				"field": {
					"id": sAddedFieldId,
					"index": 2,
					"jsTypes": ["sap.ui.comp.smartfield.SmartField"],
					"valueProperty": [sValueProperty],
					"value": [sValue],
					"entitySet": ["testEntitySet1"]
				}
			}
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var oDOMParser = new DOMParser();
		var sGroupElementId1 = "groupId1";
		var sGroupElementId2 = "groupId2";
		var sGroupElementId3 = "groupId3";
		var oXmlString =
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform">' +
				'<Group label="GroupHeader" id="' + sGroupId + '">' +
					'<GroupElement id="' + sGroupElementId1 + '">' +
						'<SmartField value="fieldValue1" id="sFieldId1" />' +
					'</GroupElement>' +
					'<GroupElement id="' + sGroupElementId2 + '">' +
						'<SmartField value="fieldValue2" id="sFieldId2" />' +
					'</GroupElement>' +
					'<GroupElement id="' + sGroupElementId3 + '">' +
						'<SmartField value="fieldValue3" id="sFieldId3" />' +
					'</GroupElement>' +
				'</Group>' +
			'</mvc:View>';
		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml").documentElement;
		var oXmlSmartFormGroup = oXmlDocument.childNodes[0];

		assert.ok(this.oAddFieldsChangeHandler.applyChange(oChangeWrapper, oXmlSmartFormGroup, {modifier: XmlTreeModifier, view: oXmlDocument, appComponent: this.oMockedAppComponent}));

		assert.equal(oXmlSmartFormGroup.childElementCount, 4);
		var aChildNodes = oXmlSmartFormGroup.childNodes;
		assert.equal(aChildNodes[0].getAttribute("id"), sGroupElementId1);
		assert.equal(aChildNodes[1].getAttribute("id"), sGroupElementId2);
		assert.equal(aChildNodes[2].getAttribute("id"), sAddedFieldId);
		assert.equal(aChildNodes[2].childNodes[0].localName, "SmartField");
		assert.equal(aChildNodes[2].childNodes[0].getAttribute("id"), sAddedFieldId + "-element0");
		assert.equal(aChildNodes[2].childNodes[0].namespaceURI, "sap.ui.comp.smartfield");
		assert.equal(aChildNodes[2].childNodes[0].getAttribute(sValueProperty), "{" + sValue + "}");
		assert.equal(aChildNodes[2].childNodes[0].getAttribute("expandNavigationProperties"), "true" , "auto expand internal navigation properties is set");
		assert.equal(aChildNodes[3].getAttribute("id"), sGroupElementId3);
	});

	QUnit.module("RenameField edge case test", {
		beforeEach: function () {
			this.sNewValue = "new label";
			this.oChangeHandler = RenameFieldChangeHandler;
			this.oSmartForm = new SmartForm({
				id : "Smartform"
			});
			this.oGroupElement = new SmartFormGroupElement({
				id : "group0"
			});
			this.oField = new SmartField({
				id : "field0"
			});
			this.oGroupElement.addElement(this.oField);
		},
		afterEach: function () {
			this.oSmartForm.destroy();
			this.oGroupElement.destroy();
		}
	});

	QUnit.test('when calling completeChangeContent without value', function (assert) {
		var oMockedAppComponent = {
			getLocalId: function () {
				return undefined;
			}
		};
		var mPropertyBag = {modifier: JsControlTreeModifier, appComponent: oMockedAppComponent};
		var oChange = {
			selector : {
				id : this.oGroupElement.getId()
			},
			content : {
			}
		};

		var oSpecificChangeInfo = {
			value: undefined
		};
		var oChangeWrapper = new ChangeWrapper(oChange);

		var sError;
		try {
			this.oChangeHandler.completeChangeContent(oChangeWrapper, oSpecificChangeInfo, mPropertyBag);
		} catch (oError) {
			sError = oError.message;
		}
		assert.equal(sError, "oSpecificChangeInfo.value attribute required", "the undefined value raises an error message");
	});

	QUnit.module("RenameField without label property in change content", {
		beforeEach: function () {
			this.oChangeHandler = RenameFieldChangeHandler;
			this.sNewValue = "new field label";
			this.oSmartForm = new SmartForm({
				id : "Smartform"
			});
			this.oGroupElement = new SmartFormGroupElement({
				id : "group0",
				label : "old value"
			});

			var oChange = {
				selector : {
					id : this.oGroupElement.getId()
				},
				content : {
				},
				texts : {
					fieldLabel : {
						value : this.sNewValue
					}
				}
			};

			this.oChangeWrapper = new ChangeWrapper(oChange);

		},

		afterEach: function () {
			this.oSmartForm.destroy();
			this.oGroupElement.destroy();
			this.oChangeWrapper.destroy();
		}
	});

	QUnit.test("applyChanges shall raise an exception if the control does not have the required methods", function (assert) {
		var exception, oControl;

		oControl = {};

		//Call CUT
		try {
			this.oChangeHandler.applyChange(this.oChangeWrapper, oControl, {modifier: JsControlTreeModifier});
		} catch (ex) {
			exception = ex;
		}
		assert.ok(exception, "Shall raise an exception");
	});

	QUnit.module("RenameField with label property which is binding in change content", {
		beforeEach: function () {
			var oMockedAppComponent = {
				getLocalId: function () {
					return undefined;
				}
			};
			this.mPropertyBag = {modifier: JsControlTreeModifier, appComponent: oMockedAppComponent};
			this.oChangeHandler = RenameFieldChangeHandler;
			this.sNewValue = "{i18n>textKey}";
			this.oSmartForm = new SmartForm({
				id : "Smartform"
			});
			this.oGroupElement = new SmartFormGroupElement({
				id : "group0",
				label : "old value"
			});

			var mLabelChange = {
				selector : {
					 id : this.oGroupElement.getId()
				},
				content : {
					 labelProperty  : "label"
				},
				 texts : {
					fieldLabel : {
						value : this.sNewValue
					}
				}
			};

			this.oLabelChange = new ChangeWrapper(mLabelChange);

			var oDOMParser = new DOMParser();
			this.oXmlDocument = oDOMParser.parseFromString("<mvc:view xmlns:mvc='sap.ui.core.mvc' xmlns='sap.ui.comp.smartform' id='view'><SmartForm id='form' title='OLD_VALUE' /><GroupElement id='GroupElement' label='OLD_VALUE' /></mvc:view>", "application/xml").documentElement;
			this.oXmlSmartForm = this.oXmlDocument.childNodes[0];
			this.oXmlGroupElement = this.oXmlDocument.childNodes[1];
		},

		afterEach: function () {
			this.oSmartForm.destroy();
			this.oGroupElement.destroy();
		}
	});

	QUnit.test("applyChanges with XmlTreeModifier", function (assert) {
		//Call CUT
		assert.ok(this.oChangeHandler.applyChange(this.oLabelChange, this.oXmlGroupElement, {modifier: XmlTreeModifier, view: this.oXmlDocument}));

		assert.equal(this.oXmlGroupElement.getAttribute("label"), this.sNewValue);
	});

	QUnit.test("applyChanges with JsControlTreeModifier", function (assert) {
		//Call CUT
		assert.ok(this.oChangeHandler.applyChange(this.oLabelChange, this.oGroupElement, {modifier: JsControlTreeModifier}));

		var oBindingInfo = this.oGroupElement.getBindingInfo("label");

		assert.equal(oBindingInfo.parts[0].path, "textKey", "property value binding path has changed as expected");
		assert.equal(oBindingInfo.parts[0].model, "i18n", "property value binding model has changed as expected");
	});
});
