/* global QUnit */

QUnit.config.autostart = false;
sap.ui.define([
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/flexibility/changes/MoveGroups",
	"sap/ui/fl/Change",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/core/util/reflection/XmlTreeModifier",
	"sap/ui/rta/enablement/elementActionTest"],
	function(
			SmartForm, SmartFormGroup, MoveGroupsChangeHandler, Change, JsControlTreeModifier, XmlTreeModifier, elementActionTest
	){
	"use strict";

	// Move Group
	var fnConfirmGroup1IsOn2ndPosition = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("group1").getId(),					// Id of element at first position in original view
							oViewAfterAction.byId("form").getGroups() [1].getId(),	// Id of third element in group after change has been applied
							"then the control has been moved to the right position");
	};

	var fnConfirmGroup1IsOn1stPosition = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("group1").getId(),					// Id of element at first position in original view
							oViewAfterAction.byId("form").getGroups() [0].getId(),	// Id of third element in group after change has been applied
							"then the control has been moved to the previous position");
	};

	// Use elementActionTest to check if a control is ready for the createContainer action of UI adaptation
	elementActionTest("Checking the Move Group action for a SmartForm", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform" xmlns:smartField="sap.ui.comp.smartfield">' +
			'<SmartForm id="form" >' +
				'<Group id="group1" >' +
				'</Group>' +
				'<Group id="group2" >' +
				'</Group>' +
			'</SmartForm>' +
		'</mvc:View>'
		,
		action : {
			name : "move",
			controlId : "group1",
			parameter : function(oView){
				return {
					movedElements : [{
						element : oView.byId("group1"),
						sourceIndex : 0,
						targetIndex : 1
					}],
					source : {
						aggregation: "groups",
						parent: oView.byId("form"),
						publicAggregation: "groups",
						publicParent: oView.byId("form")
					},
					target : {
						aggregation: "groups",
						parent: oView.byId("form"),
						publicAggregation: "groups",
						publicParent: oView.byId("form")
					}
				};
			}
		},
		afterAction : fnConfirmGroup1IsOn2ndPosition,
		afterUndo : fnConfirmGroup1IsOn1stPosition,
		afterRedo : fnConfirmGroup1IsOn2ndPosition
	});

	//Remove Group
	var fnConfirmGroupElementIsInvisible = function(oUiComponent, oViewAfterAction, assert){
		assert.ok(oViewAfterAction.byId("group").getVisible() === false, "then the Group is invisible");
	};

	var fnConfirmGroupElementIsVisible = function(oUiComponent, oViewAfterAction, assert){
		assert.ok(oViewAfterAction.byId("group").getVisible() === true, "then the Group is visible");
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
			name : "remove",
			controlId : "group",
			parameter : function(oView){
				return {
					removedElement : oView.byId("group")
				};
			}
		},
		afterAction : fnConfirmGroupElementIsInvisible,
		afterUndo : fnConfirmGroupElementIsVisible,
		afterRedo : fnConfirmGroupElementIsInvisible
	});

	//Move Group
	var fnConfirmGroupElementIsMoved = function(oUiComponent, oViewAfterAction, assert) {
		assert.equal(oViewAfterAction.byId("form").getGroups()[1], oViewAfterAction.byId("group0"), "the group was moved");
	};

	var fnConfirmGroupElementIsMovedBack = function(oUiComponent, oViewAfterAction, assert) {
		assert.equal(oViewAfterAction.byId("form").getGroups()[0], oViewAfterAction.byId("group0"), "the group was moved back");
	};

	// Use elementActionTest to check if a control is ready for the rename action of UI adaptation
	elementActionTest("Checking the rename action for a simple control", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group0" label="groupLabel0">' +
					'</Group>' +
					'<Group id="group1" label="groupLabel1">' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "move",
			controlId : "group0",
			parameter : function(oView){
				return {
					movedElements : [{
						element : oView.byId("group0"),
						sourceIndex : 0,
						targetIndex : 1
					}],
					source : {
						aggregation: "groups",
						parent: oView.byId("form")
					},
					target : {
						aggregation: "groups",
						parent: oView.byId("form")
					}
				};
			}
		},
		afterAction : fnConfirmGroupElementIsMoved,
		afterUndo : fnConfirmGroupElementIsMovedBack,
		afterRedo : fnConfirmGroupElementIsMoved
	});

	// Start QUnit tests
	QUnit.start();

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.MoveGroups - applyChange with idIsLocal false", {
		beforeEach: function (assert) {
			this.oSmartForm = new SmartForm();
			this.aGroups = [];
		},

		afterEach: function () {
			this.oSmartForm.destroy();
			this.aGroups.forEach(function (oGroup) {
				oGroup.destroy();
			});
		}
	});

	QUnit.test("on jsControlTree with an legacy change (global ids)", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": [
					{ "id": "Id1", "index": 0 },
					{ "id": "Id2", "index": 1 },
					{ "id": "Id3", "index": 2 },
					{ "id": "NoId", "index": 3 }
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson);

		var oGroup1 = new SmartFormGroup("Id4", { "label": "Group4" });
		this.aGroups.push(oGroup1);
		var oGroup2 = new SmartFormGroup("Id1", { "label": "Group1" });
		this.aGroups.push(oGroup2);
		var oGroup3 = new SmartFormGroup("Id2", { "label": "Group2" });
		this.aGroups.push(oGroup3);
		var oGroup4 = new SmartFormGroup("Id3", { "label": "Group3" });
		this.aGroups.push(oGroup4);

		var that = this;
		this.aGroups.forEach(function (oGroup) {
			that.oSmartForm.addGroup(oGroup);
		});

		assert.ok(MoveGroupsChangeHandler.applyChange(oChange, this.oSmartForm, { modifier: JsControlTreeModifier }));

		var aMovedGroups = this.oSmartForm.getGroups();

		assert.equal(aMovedGroups.length, 4);
		assert.equal(aMovedGroups[0].getLabel(), "Group1");
		assert.equal(aMovedGroups[1].getLabel(), "Group2");
		assert.equal(aMovedGroups[2].getLabel(), "Group3");
		assert.equal(aMovedGroups[3].getLabel(), "Group4");
	});

	QUnit.test("on xmlControlTree with an legacy change (global ids)", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": [
					{ "id": "Id1", "index": 0 },
					{ "id": "Id2", "index": 1 },
					{ "id": "Id3", "index": 2 },
					{ "id": "NoId", "index": 3 }
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson);
		var oDOMParser = new DOMParser();
		var oXmlString =
			'<mvc:View  xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.comp.smartform"><SmartForm id="smartform">' +
			'<Group id="Id2" />' +
			'<Group id="Id3" />' +
			'<Group id="Id4" />' +
			'<Group id="Id1" />' +
			'</SmartForm></mvc:View>';

		var oXmlDocument = oDOMParser.parseFromString(oXmlString, "application/xml");

		XmlTreeModifier.view = oXmlDocument;

		var oXmlSmartForm = oXmlDocument.childNodes[0].childNodes[0];

		assert.ok(MoveGroupsChangeHandler.applyChange(oChange, oXmlSmartForm, { modifier: XmlTreeModifier, view: oXmlDocument }));

		var aGroup = oXmlSmartForm.childNodes;

		assert.equal(aGroup.length, 4);
		assert.equal(aGroup[0].getAttribute("id"), "Id1");
		assert.equal(aGroup[1].getAttribute("id"), "Id2");
		assert.equal(aGroup[2].getAttribute("id"), "Id3");
		assert.equal(aGroup[3].getAttribute("id"), "Id4");
	});

	QUnit.test("on jsControlTree on a smartform without groups", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": [
					{ "id": "Id1", "index": 0 },
					{ "id": "Id2", "index": 1 },
					{ "id": "Id3", "index": 2 }
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson, function () { });

		assert.ok(MoveGroupsChangeHandler.applyChange(oChange, this.oSmartForm, { modifier: JsControlTreeModifier }));

		var aGroup = this.oSmartForm.getGroups();

		assert.equal(aGroup.length, 0);
	});

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.MoveGroups - Invalid change supplied to applyChange", {
		beforeEach: function () {
			this.oSmartForm = new SmartForm();
		},

		afterEach: function () {
			this.oSmartForm.destroy();
		}
	});

	QUnit.test("content does not contain moveGroups attribute", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {},
			"texts": {}
		};
		var oChange = new Change(oChangeJson, function () { });

		assert.throws(
			MoveGroupsChangeHandler.applyChange.bind(this, oChange, this.oSmartForm, { modifier: JsControlTreeModifier }),
			new Error("Change format invalid")
		);
	});

	QUnit.test("moveGroups array is empty", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": []
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson, function () { });

		assert.throws(
			MoveGroupsChangeHandler.applyChange.bind(this, oChange, this.oSmartForm, { modifier: JsControlTreeModifier }),
			new Error("Change format invalid")
		);
	});

	QUnit.test("moveGroups element has no id attribute", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": [
					{ "key": "Id1", "index": 1 }
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson, function () { });

		assert.throws(
			MoveGroupsChangeHandler.applyChange.bind(this, oChange, this.oSmartForm, { modifier: JsControlTreeModifier }),
			new Error("Change format invalid - moveGroups element has no id attribute")
		);
	});

	QUnit.test("moveGroups element has no index attribute", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": [
					{ "id": "Id1", "position": 1 }
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson, function () { });

		assert.throws(
			MoveGroupsChangeHandler.applyChange.bind(this, oChange, this.oSmartForm, { modifier: JsControlTreeModifier }),
			new Error("Change format invalid - moveGroups element index attribute is no number")
		);
	});

	QUnit.test("moveGroups element has an index attribute which is no number", function (assert) {
		var oChangeJson = {
			"selector": {
				"id": "testkey"
			},
			"content": {
				"moveGroups": [
					{ "id": "Id1", "index": "1" }
				]
			},
			"texts": {}
		};
		var oChange = new Change(oChangeJson, function () { });

		assert.throws(
			MoveGroupsChangeHandler.applyChange.bind(this, oChange, this.oSmartForm, { modifier: JsControlTreeModifier }),
			new Error("Change format invalid - moveGroups element index attribute is no number")
		);
	});

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.MoveGroups - completeChangeContent failed", {
		beforeEach: function (assert) {
			var oChangeJson = {
				"selector": {
					"id": "testkey"
				}
			};

			this.oChange = new Change(oChangeJson);
		},

		afterEach: function () {
		}
	});

	QUnit.test("if no move groups attribute is present", function (assert) {
		var oSpecificChangeInfo = {};

		assert.throws(function () {
			MoveGroupsChangeHandler.completeChangeContent(this.oChange, oSpecificChangeInfo);
		},
			new Error("oSpecificChangeInfo.movedElements attribute required")
		);
	});

	QUnit.test("if the changeSpecificDatas movedElements attribute is an empty array", function (assert) {
		var oSpecificChangeInfo = {
			movedElements: []
		};

		assert.throws(function () {
			MoveGroupsChangeHandler.completeChangeContent(this.oChange, oSpecificChangeInfo);
		},
			new Error("MovedElements array is empty")
		);
	});

	QUnit.test("if a movedElements attribute contains element without id attribute", function (assert) {
		var oSpecificChangeInfo = {
			movedElements: [
				{
					"key": "Id1",
					"index": 0
				}
			]
		};

		assert.throws(function () {
			MoveGroupsChangeHandler.completeChangeContent(this.oChange, oSpecificChangeInfo);
		},
			new Error("MovedElements element has no id attribute")
		);
	});

	QUnit.test("if a movedElements attribute contains element without index attribute", function (assert) {
		var oSpecificChangeInfo = {
			movedElements: [
				{
					"id": "Id1",
					"position": 0
				}
			]
		};

		assert.throws(function () {
			MoveGroupsChangeHandler.completeChangeContent(this.oChange, oSpecificChangeInfo);
		},
			new Error("Index attribute at MovedElements element is no number")
		);
	});

	QUnit.test("if a movedElements element index attribute is no number", function (assert) {
		var oSpecificChangeInfo = {
			movedElements: [
				{
					"id": "Id1",
					"index": "0"
				}
			]
		};

		assert.throws(function () {
			MoveGroupsChangeHandler.completeChangeContent(this.oChange, oSpecificChangeInfo);
		},
			new Error("Index attribute at MovedElements element is no number")
		);
	});

});
