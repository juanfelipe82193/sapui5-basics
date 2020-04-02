/* global QUnit*/

QUnit.config.autostart = false;
sap.ui.define([
	"sap/ui/rta/enablement/elementActionTest"],
	function(
		elementActionTest
	){
	"use strict";

	//Remove GroupElement
	var fnConfirmGroupElementIsInvisible = function(oUiComponent, oViewAfterAction, assert){
		assert.ok(oViewAfterAction.byId("groupelement").getVisible() === false, "then the GroupElement is invisible");
	};

	var fnConfirmGroupElementIsVisible = function(oUiComponent, oViewAfterAction, assert){
		assert.ok(oViewAfterAction.byId("groupelement").getVisible() === true, "then the GroupElement is visible");
	};

	// Use elementActionTest to check if a control is ready for the remove action of UI adaptation
	elementActionTest("Checking the remove action for a simple control", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement">' +
							'<m:Button text="click me" />' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "remove",
			controlId : "groupelement",
			parameter : function(oView){
				return {
					removedElement : oView.byId("groupelement")
				};
			}
		},
		afterAction : fnConfirmGroupElementIsInvisible,
		afterUndo : fnConfirmGroupElementIsVisible,
		afterRedo : fnConfirmGroupElementIsInvisible
	});

	//Move GroupElement
	var fnConfirmGroupelement1IsOn2ndPosition = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("groupelement1").getId(),					// Id of element at first position in original view
							oViewAfterAction.byId("group1").getGroupElements() [1].getId(),	// Id of third element in group after change has been applied
							"then the control has been moved to the right position");
	};

	var fnConfirmGroupelement1IsOn1stPosition = function(oUiComponent, oViewAfterAction, assert) {
		assert.strictEqual( oViewAfterAction.byId("groupelement1").getId(),					// Id of element at first position in original view
							oViewAfterAction.byId("group1").getGroupElements() [0].getId(),	// Id of third element in group after change has been applied
							"then the control has been moved to the previous position");
	};

	// Use elementActionTest to check if a control is ready for the move action of UI adaptation
	elementActionTest("Checking the move action for a simple control", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform" xmlns:smartField="sap.ui.comp.smartfield">' +
				'<SmartForm id="form" >' +
					'<Group id="group1" >' +
						'<GroupElement id="groupelement1">' +
							'<smartField:SmartField value="smartfield value 1"/>' +
						'</GroupElement>' +
						'<GroupElement id="groupelement2">' +
							'<smartField:SmartField value="smartfield value 2"/>' +
						'</GroupElement>' +
						'<GroupElement id="groupelement3">' +
							'<smartField:SmartField value="smartfield value 3"/>' +
						'</GroupElement>' +
					'</Group>' +
					'<Group id="group2" >' +
						'<GroupElement id="groupelement4">' +
							'<smartField:SmartField value="smartfield value 4"/>' +
						'</GroupElement>' +
						'<GroupElement id="groupelement5">' +
							'<smartField:SmartField value="smartfield value 5"/>' +
						'</GroupElement>' +
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
						element : oView.byId("groupelement1"),
						sourceIndex : 0,
						targetIndex : 1
					}],
					source : {
						aggregation: "groupElements",
						parent: oView.byId("group1")
					},
					target : {
						aggregation: "groupElements",
						parent: oView.byId("group1")
					}
				};
			}
		},
		afterAction : fnConfirmGroupelement1IsOn2ndPosition,
		afterUndo : fnConfirmGroupelement1IsOn1stPosition,
		afterRedo : fnConfirmGroupelement1IsOn2ndPosition
	});

	// Start QUnit tests
	QUnit.start();

});
