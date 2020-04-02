/* global QUnit */

QUnit.config.autostart = false;
sap.ui.define([
	"sap/ui/comp/smartform/flexibility/changes/RenameGroup",
	"sap/ui/comp/smartform/Group",
	"sap/ui/fl/Change",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/core/util/reflection/XmlTreeModifier",
	"sap/ui/rta/enablement/elementActionTest",
	"sap/ui/qunit/qunit-coverage"
], function(
	RenameGroupChangeHandler,
	SmartFormGroup,
	ChangeWrapper,
	JsControlTreeModifier,
	XmlTreeModifier,
	elementActionTest
){
	"use strict";

	// Create Group (Create Container in Smartform)
	var fnConfirmChildControlIsAddedWithNewLabel = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("form").getGroups().length, 1, "then the new child control has been added");
		var oFirstGroup = oViewAfterAction.byId("form").getGroups()[0];
		assert.strictEqual(oFirstGroup.getLabel(), "New Group", "then the new added control has been renamed to the new value (New Group)");
	};

	var fnConfirmChildControlIsRemoved = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("form").getGroups().length, 0, "then the new added child control has been removed");
	};

	// Use elementActionTest to check if a control is ready for the createContainer action of UI adaptation
	elementActionTest("Checking the createContainer action for a simple control", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "createContainer",
			controlId : "form",
			parameter : function(oView){
				return {
					label : 'New Group',
					newControlId : oView.createId(jQuery.sap.uid()),
					index : 0
				};
			}
		},
		afterAction : fnConfirmChildControlIsAddedWithNewLabel,
		afterUndo : fnConfirmChildControlIsRemoved,
		afterRedo : fnConfirmChildControlIsAddedWithNewLabel
	});

	//Rename Group using label aggregation
	var fnConfirmGroupIsRenamedWithNewValue = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("group").getLabel(), "newGroupLabel", "then the control has been renamed to the new value (newGroupLabel)");
	};

	var fnConfirmGroupIsRenamedWithOldValue = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("group").getLabel(), "groupLabel", "then the control has been renamed to the old value (groupLabel)");
	};

	// Use elementActionTest to check if a control is ready for the rename action of UI adaptation
	elementActionTest("Checking the rename action for a simple control", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" label="groupLabel">' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "rename",
			controlId : "group",
			parameter : function(oView){
				return {
					newValue : 'newGroupLabel',
					renamedElement : oView.byId("group")
				};
			}
		},
		afterAction : fnConfirmGroupIsRenamedWithNewValue,
		afterUndo : fnConfirmGroupIsRenamedWithOldValue,
		afterRedo : fnConfirmGroupIsRenamedWithNewValue
	});

	var fnConfirmGroupIsRenamedWithNewEmptyValue = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("group").getLabel(), "", "then the control has been renamed to the new empty value");
	};

	var fnConfirmGroupIsRenamedWithOldValue1 = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("group").getLabel(), "groupLabel", "then the control has been renamed to the old value (groupLabel)");
	};

	// Use elementActionTest to check if a control is ready for the rename action of UI adaptation
	elementActionTest("Checking the rename action for a simple control with empty value", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" label="groupLabel">' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "rename",
			controlId : "group",
			parameter : function(oView){
				return {
					newValue : '',
					renamedElement : oView.byId("group")
				};
			}
		},
		afterAction : fnConfirmGroupIsRenamedWithNewEmptyValue,
		afterUndo : fnConfirmGroupIsRenamedWithOldValue1,
		afterRedo : fnConfirmGroupIsRenamedWithNewEmptyValue
	});

	// Rename Group using a string in title aggregation
	var fnConfirmGroupIsRenamed = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("group").getTitle(), "new title", "then the control has been renamed to the new empty value");
	};

	var fnConfirmGroupRenameIsReverted = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("group").getTitle(), "groupLabel", "then the control has been renamed to the old value (groupLabel)");
	};

	// Use elementActionTest to check if a control is ready for the rename action of UI adaptation
	elementActionTest("Checking the rename action using a string in title aggregation", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" title="groupLabel">' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "rename",
			controlId : "group",
			parameter : function(oView){
				return {
					newValue : "new title",
					renamedElement : oView.byId("group")
				};
			}
		},
		afterAction : fnConfirmGroupIsRenamed,
		afterUndo : fnConfirmGroupRenameIsReverted,
		afterRedo : fnConfirmGroupIsRenamed
	});

	// Rename Group using a sap.ui.core.Title in title aggregation
	var fnConfirmGroupIsRenamed2 = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("group").getTitle().getText(), "new title", "then the control has been renamed to the new empty value");
	};

	var fnConfirmGroupRenameIsReverted2 = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual(oViewAfterAction.byId("group").getTitle().getText(), "old title", "then the control has been renamed to the old value (groupLabel)");
	};

	// Use elementActionTest to check if a control is ready for the rename action of UI adaptation
	elementActionTest("Checking the rename action using a sap.ui.core.Title in title aggregation", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group">' +
						'<title>' +
							'<core:Title text="old title" />' +
						'</title>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "rename",
			controlId : "group",
			parameter : function(oView){
				return {
					newValue : "new title",
					renamedElement : oView.byId("group")
				};
			}
		},
		afterAction : fnConfirmGroupIsRenamed2,
		afterUndo : fnConfirmGroupRenameIsReverted2,
		afterRedo : fnConfirmGroupIsRenamed2
	});

	// Start QUnit tests
	QUnit.start();

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.RenameGroup edge test", {
		beforeEach: function () {
			this.sNewValue = "new label";
			this.oControl = new SmartFormGroup({
				id : "group0",
				label : "old value"
			});
		},
		afterEach: function () {
			this.oControl.destroy();
		}
	}, function() {
		QUnit.test('when calling completeChangeContent without ctrlProperty', function (assert) {
			var oMockedAppComponent = {
				getLocalId: function () {
					return undefined;
				}
			};
			var mPropertyBag = {modifier: JsControlTreeModifier, appComponent: oMockedAppComponent};
			var oChange = {
				selector : {
					id : this.oControl.getId()
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
				RenameGroupChangeHandler.completeChangeContent(oChangeWrapper, oSpecificChangeInfo, mPropertyBag);
			} catch (oError) {
				sError = oError.message;
			}
			assert.equal(sError, "oSpecificChangeInfo.value attribute required", "the undefined value raises an error message");
		});
	});

	QUnit.module("RenameGroup with binding as new value", {
		beforeEach: function () {
			this.sNewValue = "{i18n>textKey}";
			this.oControl = new SmartFormGroup({
				id : "group0",
				label : "old value"
			});
		},
		afterEach: function () {
			this.oControl.destroy();
		}
	}, function() {
		QUnit.test('when calling applyChange on xmlTree with a binding as new value', function (assert) {
			var oChange = {
				selector : {
					"id": this.oControl.getId()
				},
				content : {
				},
				texts : {
					groupLabel : {
						value : this.sNewValue
					}
				}
			};

			var oChangeWrapper = new ChangeWrapper(oChange);

			var oDOMParser = new DOMParser();
			var oXmlDocument = oDOMParser.parseFromString("<Group xmlns='sap.ui.comp.smartform' id='group01' label='OLD_VALUE' />", "application/xml");
			var oControl = oXmlDocument.childNodes[0];

			assert.ok(RenameGroupChangeHandler.applyChange(oChangeWrapper, oControl, {modifier: XmlTreeModifier, view: oXmlDocument}), "no errors occur");
			assert.equal(oControl.getAttribute("label"), this.sNewValue, "the title of the group has been changed");
		});

		QUnit.test('when calling applyChange on jsControlTree with a binding as new value', function (assert) {
			var oChange = {
				selector : {
					"id": this.oControl.getId()
				},
				content : {
				},
				texts : {
					groupLabel : {
						value : this.sNewValue
					}
				}
			};

			var oChangeWrapper = new ChangeWrapper(oChange);

			assert.ok(RenameGroupChangeHandler.applyChange(oChangeWrapper, this.oControl, {modifier: JsControlTreeModifier}), "no errors occur");

			var oBindingInfo = this.oControl.getBindingInfo("label");

			assert.equal(oBindingInfo.parts[0].path, "textKey", "property value binding path has changed as expected");
			assert.equal(oBindingInfo.parts[0].model, "i18n", "property value binding model has changed as expected");
		});
	});
});
