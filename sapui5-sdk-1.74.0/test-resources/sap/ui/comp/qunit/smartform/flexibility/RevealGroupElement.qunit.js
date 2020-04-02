/* global QUnit */

QUnit.config.autostart = false;
sap.ui.define([
	"sap/ui/rta/enablement/elementActionTest"],
	function(
		elementActionTest
	){
	"use strict";

	function _confirmFieldIsRevealed(oAppComponent, oView, assert) {
		var oNewGroupElement = oView.byId("groupelement");
		var oNewButton = oView.byId("button");
		var oNewButton2 = oView.byId("button2");
		assert.ok(oNewGroupElement.getVisible(), "then the groupelement is visible");
		assert.ok(oNewButton.getVisible(), "then the button is visible");
		assert.ok(oNewButton2.getVisible(), "then the 2nd button is visible");
	}

	function _confirmFieldIsHidden(oAppComponent, oView, assert) {
		var oNewGroupElement = oView.byId("groupelement");
		var oNewButton = oView.byId("button");
		var oNewButton2 = oView.byId("button2");
		assert.notOk(oNewGroupElement.getVisible(), "then the groupelement is hidden");
		assert.notOk(oNewButton.getVisible(), "then the button is hidden");
		assert.notOk(oNewButton2.getVisible(), "then the 2nd button is hidden");
	}

	elementActionTest("Checking the reveal action for a smart form group element with two hidden buttons", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement" visible="false">' +
							'<m:Button id="button" text="button" visible="false"/>' +
							'<m:Button id="button2" text="button" visible="false"/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "reveal",
			controlId : "groupelement",
			parameter : function(oView){
				return {
				};
			}
		},
		afterAction : _confirmFieldIsRevealed,
		afterUndo : _confirmFieldIsHidden,
		afterRedo : _confirmFieldIsRevealed
	});

	function _confirmFieldIsRevealed2(oAppComponent, oView, assert) {
		var oNewGroupElement = oView.byId("groupelement");
		var oNewButton = oView.byId("button");
		var oNewButton2 = oView.byId("button2");
		assert.ok(oNewGroupElement.getVisible(), "then the groupelement is visible");
		assert.ok(oNewButton.getVisible(), "then the button is visible");
		assert.notOk(oNewButton2.getVisible(), "then the 2nd button is hidden");
	}

	function _confirmFieldIsHidden2(oAppComponent, oView, assert) {
		var oNewGroupElement = oView.byId("groupelement");
		var oNewButton = oView.byId("button");
		var oNewButton2 = oView.byId("button2");
		assert.notOk(oNewGroupElement.getVisible(), "then the groupelement is hidden");
		assert.ok(oNewButton.getVisible(), "then the button is visible");
		assert.notOk(oNewButton2.getVisible(), "then the 2nd button is hidden");
	}

	elementActionTest("Checking the reveal action for a smart form group element with a hidden button and a visible button", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement" visible="false">' +
							'<m:Button id="button" text="button" visible="true"/>' +
							'<m:Button id="button2" text="button" visible="false"/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "reveal",
			controlId : "groupelement",
			parameter : function(oView){
				return {
				};
			}
		},
		afterAction : _confirmFieldIsRevealed2,
		afterUndo : _confirmFieldIsHidden2,
		afterRedo : _confirmFieldIsRevealed2
	});

	function _confirmLabelAndFieldAreRevealed(oAppComponent, oView, assert) {
		var oGroupElement = oView.byId("groupelement");
		var oLabel = oGroupElement.getLabel();
		assert.ok(oLabel.getVisible(), "then the label is visible");
		_confirmFieldIsRevealed2(oAppComponent, oView, assert);
	}

	function _confirmLabelAndFieldAreHidden(oAppComponent, oView, assert) {
		var oGroupElement = oView.byId("groupelement");
		var oLabel = oGroupElement.getLabel();
		assert.notOk(oLabel.getVisible(), "then the label is visible");
		_confirmFieldIsHidden2(oAppComponent, oView, assert);
	}

	elementActionTest("Checking the reveal action for a smart form group element with a label", {
		xmlView :
			'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.comp.smartform">' +
				'<SmartForm id="form" >' +
					'<Group id="group" >' +
						'<GroupElement id="groupelement" visible="false">' +
							'<label>' +
								'<m:Label text="mylabelwithoutID" visible="false"/>' +
							'</label>' +
							'<m:Button id="button" text="button" visible="true"/>' +
							'<m:Button id="button2" text="button" visible="false"/>' +
						'</GroupElement>' +
					'</Group>' +
				'</SmartForm>' +
			'</mvc:View>'
		,
		action : {
			name : "reveal",
			controlId : "groupelement",
			parameter : function(oView){
				return {
				};
			}
		},
		afterAction : _confirmLabelAndFieldAreRevealed,
		afterUndo : _confirmLabelAndFieldAreHidden,
		afterRedo : _confirmLabelAndFieldAreRevealed
	});

	QUnit.start();
});
