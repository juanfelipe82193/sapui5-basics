/* globals QUnit */

sap.ui.define([
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/fl/Change",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/comp/smartform/flexibility/changes/CombineFields",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/rta/enablement/elementActionTest"
], function(
	Group,
	GroupElement,
	SmartField,
	SmartForm,
	Change,
	JsControlTreeModifier,
	CombineFieldsChangeHandler,
	MockServer,
	ODataModel,
	elementActionTest
){
	"use strict";

	//Combine GroupElement
	var fnConfirmGroupElementsAreCombined = function (sExpectedLabel, oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("groupelement1").getElements().length, 3,
							"then the groupelement1 contains 3 fields");
		assert.strictEqual( oViewAfterAction.byId("groupelement1").getLabelText(), sExpectedLabel,
							"then the groupelement1 has the correct label");
	};

	var fnConfirmCombinedGroupElementsAreSplited = function (aExpectedLabel, oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("groupelement1").getElements().length, 1,
							"then the groupelement1 contains 1 field");
		assert.strictEqual( oViewAfterAction.byId("groupelement1").getLabelText(), aExpectedLabel[0],
							"then the groupelement1 restores its previous label");
		assert.strictEqual( oViewAfterAction.byId("groupelement2").getElements().length, 1,
							"then the groupelement2 contains 1 field");
		assert.strictEqual( oViewAfterAction.byId("groupelement2").getLabelText(), aExpectedLabel[1],
							"then the groupelement2 restores its previous label");
		assert.strictEqual( oViewAfterAction.byId("groupelement3").getElements().length, 1,
							"then the groupelement3 contains 1 field");
		assert.strictEqual( oViewAfterAction.byId("groupelement3").getLabelText(), aExpectedLabel[2],
							"then the groupelement3 restores its previous label");
	};

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

	//cleanup after the tests:
	QUnit.done(function(){
		oModel.destroy();
		oMockServer.destroy();
	});

	elementActionTest("Checking the combine action for group elements with special labels", {
		xmlView :
					'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform" xmlns:smartField="sap.ui.comp.smartfield" xmlns:layout="sap.ui.layout" xmlns:m="sap.m">' +
						'<SmartForm id="form" binding="{/mockProductData(1)}">' +
							'<Group id="group1" >' +
								'<GroupElement id="groupelement1" >' +
									'<smartField:SmartField value="{ProductID}"/>' +
								'</GroupElement>' +
								'<GroupElement id="groupelement2" label="field2">' +
									'<smartField:SmartField value="smartfield value 2"/>' +
								'</GroupElement>' +
								'<GroupElement id="groupelement3">' +
									'<smartField:SmartField value="{ProductName}"/>' +
								'</GroupElement>' +
							'</Group>' +
						'</SmartForm>' +
					'</mvc:View>'
		,
		model: oModel,
		action : {
			name : "combine",
			controlId : "groupelement1",
			parameter : function(oView){
				return {
					source : oView.byId("groupelement1"),
					combineElements : [
						oView.byId("groupelement1"),
						oView.byId("groupelement2"),
						oView.byId("groupelement3")
					]
				};
			}
		},
		afterAction : fnConfirmGroupElementsAreCombined.bind(undefined, "Product ID/field2/Product Type"),
		afterUndo : fnConfirmCombinedGroupElementsAreSplited.bind(undefined, ["Product ID", "field2", "Product Type"]),
		afterRedo : fnConfirmGroupElementsAreCombined.bind(undefined, "Product ID/field2/Product Type")
	});

	elementActionTest("Checking the combine action for group elements using horizontalLayout", {
		xmlView :
					'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform" xmlns:smartField="sap.ui.comp.smartfield" xmlns:layout="sap.ui.layout" xmlns:m="sap.m">' +
						'<SmartForm id="form" useHorizontalLayout="true">' +
							'<Group id="group1" >' +
								'<GroupElement id="groupelement1" label="field1">' +
									'<smartField:SmartField value="smartfield value 1"/>' +
								'</GroupElement>' +
								'<GroupElement id="groupelement2" label="field2">' +
									'<smartField:SmartField value="smartfield value 2"/>' +
								'</GroupElement>' +
								'<GroupElement id="groupelement3" label="field3">' +
									'<smartField:SmartField value="smartfield value 3"/>' +
								'</GroupElement>' +
							'</Group>' +
						'</SmartForm>' +
					'</mvc:View>'
		,
		action : {
			name : "combine",
			controlId : "groupelement1",
			parameter : function(oView){
				return {
					source : oView.byId("groupelement1"),
					combineElements : [
						oView.byId("groupelement1"),
						oView.byId("groupelement2"),
						oView.byId("groupelement3")
					]
				};
			}
		},
		afterAction : fnConfirmGroupElementsAreCombined.bind(undefined, "field1/field2/field3"),
		afterUndo : fnConfirmCombinedGroupElementsAreSplited.bind(undefined, ["field1", "field2", "field3"]),
		afterRedo : fnConfirmGroupElementsAreCombined.bind(undefined, "field1/field2/field3")
	});
	//Split GroupElement
	var fnConfirmGroupElementsAreSplited = function (oUiComponent,oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("groupelement").getElements().length, 1,
							"then the groupelement contains 1 field");
		assert.strictEqual( oViewAfterAction.byId("group").getGroupElements().length, 3,
							"then the group contains 3 groupelements");
		assert.strictEqual( oViewAfterAction.byId("group").getGroupElements()[0].getLabelText(), "SplitMe",
							"then the split groupelement still has the same label");
		assert.strictEqual( oViewAfterAction.byId("group").getGroupElements()[1].getLabelText(), "SplitMe",
							"then the first created groupelement has the same label as the source groupelement");
		assert.strictEqual( oViewAfterAction.byId("group").getGroupElements()[2].getLabelText(), "SplitMe",
							"then the second created groupelement has the same label as the source groupelement (smartfield label is empty)");
	};

	var fnConfirmSplitedGroupElementsAreCombined = function (oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("groupelement").getElements().length, 3,
							"then the groupelement contains 3 fields");
		assert.strictEqual( oViewAfterAction.byId("group").getGroupElements().length, 1,
							"then the group contains 1 groupelement");
	};

	elementActionTest("Checking the split action for group elements", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform" xmlns:smartField="sap.ui.comp.smartfield">' +
				'<SmartForm id="form" >' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement" label="SplitMe">' +
							'<smartField:SmartField value="smartfield value 1"/>' +
							'<smartField:SmartField value="smartfield value 2" textLabel="field2"/>' +
							'<smartField:SmartField value="smartfield value 3" textLabel=""/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "split",
			controlId : "groupelement",
			parameter : function(oView){
				return {
					newElementIds : ["comp---view--dummy-1", "comp---view--dummy-2", "comp---view--dummy-3"],
					source : oView.byId("groupelement"),
					parentElement : oView.byId("group")
				};
			}
		},
		afterAction : fnConfirmGroupElementsAreSplited,
		afterUndo : fnConfirmSplitedGroupElementsAreCombined,
		afterRedo : fnConfirmGroupElementsAreSplited
	});

	elementActionTest("Checking the split action for group elements using horizontalLayout", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform" xmlns:smartField="sap.ui.comp.smartfield">' +
				'<SmartForm id="form" useHorizontalLayout="true">' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement" label="SplitMe">' +
							'<smartField:SmartField value="smartfield value 1"/>' +
							'<smartField:SmartField value="smartfield value 2" textLabel="field2"/>' +
							'<smartField:SmartField value="smartfield value 3" textLabel=""/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "split",
			controlId : "groupelement",
			parameter : function(oView){
				return {
					newElementIds : ["comp---view--dummy-1", "comp---view--dummy-2", "comp---view--dummy-3"],
					source : oView.byId("groupelement"),
					parentElement : oView.byId("group")
				};
			}
		},
		afterAction : fnConfirmGroupElementsAreSplited,
		afterUndo : fnConfirmSplitedGroupElementsAreCombined,
		afterRedo : fnConfirmGroupElementsAreSplited
	});

	// Test when more than three Elements should be combined
	// This is the test of the isEnabled function of the combine action
	QUnit.module("Given a Smartform with a Group containing 4 GroupElements", {
		beforeEach : function(assert) {
			this.oSmartField1 = new sap.ui.comp.smartfield.SmartField("smartField1");
			this.oSmartField2 = new sap.ui.comp.smartfield.SmartField("smartField2");
			this.oSmartField3 = new sap.ui.comp.smartfield.SmartField("smartField3");
			this.oSmartField4 = new sap.ui.comp.smartfield.SmartField("smartField4");
			this.oSmartField5 = new sap.ui.comp.smartfield.SmartField("smartField5");
			this.oSmartField6 = new sap.ui.comp.smartfield.SmartField("smartField6");
			this.oGroupElement1 = new sap.ui.comp.smartform.GroupElement("groupElement1", {
				elements : [this.oSmartField1]
			});
			this.oGroupElement2 = new sap.ui.comp.smartform.GroupElement("groupElement2", {
				elements : [this.oSmartField2]
			});
			this.oGroupElement3 = new sap.ui.comp.smartform.GroupElement("groupElement3", {
				elements : [this.oSmartField3]
			});
			this.oGroupElement4 = new sap.ui.comp.smartform.GroupElement("groupElement4", {
				elements : [this.oSmartField4]
			});
			this.oGroupElement5 = new sap.ui.comp.smartform.GroupElement("groupElement5", {
				elements : [this.oSmartField5, this.oSmartField6]
			});
			this.oGroup = new sap.ui.comp.smartform.Group("group", {
				groupElements : [this.oGroupElement1, this.oGroupElement2, this.oGroupElement3, this.oGroupElement4, this.oGroupElement5]
			});
			this.oSmartForm = new sap.ui.comp.smartform.SmartForm("smartForm", {
				groups : [this.oGroup]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},

		afterEach : function(assert) {
			this.oSmartForm.destroy();
		}

	});

	QUnit.test("When only one Control with only one field should be combined", function(assert) {
		var oActionCombine = this.oGroupElement1.getMetadata()._oDesignTime.actions.combine;
		assert.notOk( oActionCombine.isEnabled([this.oGroupElement1]), "then combine is not possible." );
	});

	QUnit.test("When two Controls with two fields should be combined", function(assert) {
		var oActionCombine = this.oGroupElement1.getMetadata()._oDesignTime.actions.combine;
		assert.ok( oActionCombine.isEnabled([this.oGroupElement1, this.oGroupElement2]), "then combine is possible." );
	});

	QUnit.test("When four Controls with four Fields should be combined", function(assert) {
		var oActionCombine = this.oGroupElement1.getMetadata()._oDesignTime.actions.combine;
		assert.notOk( oActionCombine.isEnabled([this.oGroupElement1, this.oGroupElement2, this.oGroupElement3, this.oGroupElement4]), "then combine is not possible." );
	});

	QUnit.test("When three Controls with four Fields should be combined", function(assert) {
		var oActionCombine = this.oGroupElement1.getMetadata()._oDesignTime.actions.combine;
		assert.notOk( oActionCombine.isEnabled([this.oGroupElement1, this.oGroupElement2, this.oGroupElement3, this.oGroupElement5]), "then combine is not possible." );
	});

	QUnit.module("CombineFields - given RTL mode for CombineFields", {
		beforeEach: function () {

			this.oSmartField1 = new SmartField("field1", {
				textLabel: "First Name",
				value: "Name-First"
			});
			this.oSmartField2  = new SmartField("field2", {
				textLabel: "Last Name",
				value: "Name-last"
			});
			this.oFirstName = new GroupElement("FirstName",{
				elements:[this.oSmartField1]
			});
			this.oLastName = new GroupElement("LastName",{
				elements:[this.oSmartField2]
			});
			this.oGroup = new Group({
				formElements:
					[
						this.oFirstName,
						this.oLastName
					]
				});

			this.oChangeJson = {
				"content": {
					"combineFieldSelectors": [
						{
							"id": "FirstName",
							"idIsLocal": true
						},
						{
							"id": "LastName",
							"idIsLocal": true
						}
					],
					"sourceSelector":
						{
							"id":"LastName",
							"idIsLocal":true
						}
				},
				"texts":{"fieldLabel0":{"value":"First Name","type":"XFLD"},"fieldLabel1":{"value":"Last Name","type":"XFLD"}}
			};

			this.oChange = new Change(this.oChangeJson, function () {});
			var fnGetMockedAppComponent = function() {
				return {
						createId: function (sId) {
							return sId;
						},
						getLocalId: function (sId) {
							return sId;
						}
					};
			};

			this.oMockedAppComponent = fnGetMockedAppComponent();
		},

		afterEach: function () {
			this.oGroup.destroy();
			this.oChange.destroy();
		}
	});

	QUnit.test("when creating the change", function (assert) {
		CombineFieldsChangeHandler.completeChangeContent(this.oChange, {
			combineElementIds: [this.oFirstName.getId(),this.oLastName.getId()],
			sourceControlId : this.oLastName
		}, {modifier: JsControlTreeModifier, appComponent: this.oMockedAppComponent});
		assert.deepEqual(
			this.oChange.getDefinition().content,
			this.oChangeJson.content,
			"then content is set correctly"
		);
		assert.equal(
			this.oChange.getDependentControl("sourceControl", {modifier: JsControlTreeModifier, appComponent: this.oMockedAppComponent}).getId(),
			this.oLastName.getId(),
			"source control is part of dependentSelector"
		);

		assert.deepEqual(
			this.oChange.getDependentControl("combinedFields", {modifier: JsControlTreeModifier, appComponent: this.oMockedAppComponent}).map(function(oField){
				return oField.getId();
			}),
			[this.oFirstName.getId(), this.oLastName.getId()],
			"combinedFields is part of dependentSelector"
		);
	});

	QUnit.test("when field labels are combined in LTR mode", function (assert) {
		CombineFieldsChangeHandler.applyChange(this.oChange, this.oGroup, {modifier: JsControlTreeModifier, appComponent: this.oMockedAppComponent});
		assert.strictEqual(
			this.oGroup.getGroupElements()[0]._getLabel().getText(),
			"First Name/Last Name",
			"then fields have been combined successfully in LTR mode"
		);
	});


	QUnit.test("when field labels are combined in RTL mode", function (assert) {
		sap.ui.getCore().getConfiguration().setRTL(true);
		CombineFieldsChangeHandler.applyChange(this.oChange, this.oGroup, {modifier: JsControlTreeModifier, appComponent: this.oMockedAppComponent});
		assert.strictEqual(
			this.oGroup.getGroupElements()[0]._getLabel().getText(),
			"Last Name/First Name",
			"then fields have been combined successfully in RTL mode"
		);
		sap.ui.getCore().getConfiguration().setRTL(false);
	});

	QUnit.test("when fields are combined, the control is destroyed and created again...", function (assert) {
		CombineFieldsChangeHandler.applyChange(this.oChange, this.oGroup, {modifier: JsControlTreeModifier, appComponent: this.oMockedAppComponent});

		this.oGroup.destroy();

		this.oSmartField1 = new SmartField("field1", {
				textLabel: "First Name",
				value: "Name-First"
			});
		this.oSmartField2  = new SmartField("field2", {
			textLabel: "Last Name",
			value: "Name-last"
		});
		this.oGroup = new Group({
			formElements:
				[
					new GroupElement("FirstName",{
						elements:[this.oSmartField1]
					}),
					new GroupElement("LastName",{
						elements:[this.oSmartField2]
					})
				]
			});

		assert.strictEqual(
			this.oSmartField1.getTextLabel(),
			"First Name",
			"then the field 1 is created again without duplicate Id issue"
		);

		assert.strictEqual(
			this.oSmartField2.getTextLabel(),
			"Last Name",
			"then the field 2 is created again without duplicate Id issue"
		);
	});
});
