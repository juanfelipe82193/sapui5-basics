/*global QUnit*/
sap.ui.define(["sap/gantt/simple/SelectionModel"], function (ShapeSelectionModel) {
	"use strict";

	QUnit.test("Selection mode getter and setter", function (assert) {
		//System under Test
		var oSelectionModel = new ShapeSelectionModel(sap.gantt.SelectionMode.Multiple);
		var oSelectionModelDefault = new ShapeSelectionModel();

		//Assert
		assert.strictEqual(oSelectionModelDefault.getSelectionMode(), sap.gantt.SelectionMode.Single, "Default shape selection mode.");

		assert.strictEqual(oSelectionModel.getSelectionMode(), sap.gantt.SelectionMode.Multiple, "Configured shape selection mode.");

		//Act
		oSelectionModel.setSelectionMode();
		//Assert
		assert.strictEqual(oSelectionModel.getSelectionMode(), sap.gantt.SelectionMode.Single, "Set shape selection mode to default.");
		//Act
		oSelectionModel.setSelectionMode(sap.gantt.SelectionMode.Multiple);
		//Assert
		assert.strictEqual(oSelectionModel.getSelectionMode(), sap.gantt.SelectionMode.Multiple, "Set shape selection mode to configured.");
		//Cleanup
		oSelectionModel.destroy();
		oSelectionModelDefault.destroy();

	});

	QUnit.test("Manipulate selected shapes", function (assert) {
		//System under Test
		var oSelectionModel = new ShapeSelectionModel(sap.gantt.SelectionMode.Multiple);

		//Assert
		assert.ok(oSelectionModel.allUid().length === 0, "Default selected shapes uid is empty.");
		//Act
		oSelectionModel.update("Fake_shape_uid_1", {selected: true});
		oSelectionModel.setSelectionMode(sap.gantt.SelectionMode.MultiWithKeyboard);
		oSelectionModel.update("Fake_shape_uid_2", {selected: true, ctrl: true});
		//Assert
		assert.strictEqual(oSelectionModel.allUid()[0], "Fake_shape_uid_1", "Add Shape uid 1.");
		assert.strictEqual(oSelectionModel.allUid()[1], "Fake_shape_uid_2", "Add Shape uid 2.");
		assert.ok(oSelectionModel.allUid().join("|") === "Fake_shape_uid_1|Fake_shape_uid_2", "Get all shape's uid.");
		//Act
		oSelectionModel.update("Fake_shape_uid_1", {selected: false, ctrl: true});
		//Assert
		assert.strictEqual(oSelectionModel.allUid()[0], "Fake_shape_uid_2", "Remove Shape uid 1.");
		//Act
		oSelectionModel.clear();
		//Assert
		assert.ok(oSelectionModel.allUid().length === 0, "Selected shapes uid is cleared.");
		//Act
		oSelectionModel.update("Fake_shape_uid_4", {selected: true, ctrl: false});
		//Assert
		assert.strictEqual(oSelectionModel.allUid()[0], "Fake_shape_uid_4", "Add Shape uid 4.");
		//Act
		oSelectionModel.setSelectionMode(sap.gantt.SelectionMode.Single);
		oSelectionModel.update("Fake_shape_uid_3", {selected: true, ctrl: false});
		//Assert
		assert.strictEqual(oSelectionModel.allUid()[0], "Fake_shape_uid_3", "Add Shape uid in single mode.");
		assert.strictEqual(oSelectionModel.existed("Fake_shape_uid_3"), true, "Shape uid existed.");
		//Act
		oSelectionModel.clear(true);
		//Assert
		assert.ok(oSelectionModel.allUid().length === 0, "Selected shapes uid is reset.");
		//Cleanup
		oSelectionModel.destroy();

	});

	QUnit.module("Clear selection on empty area",{
		beforeEach: function(){
			this.oSM = new ShapeSelectionModel();
		},
		afterEach: function(){
			this.oSM.destroy();
		},
		assertSelectionEventFired: function(assert, oEventSpy) {
			assert.ok(oEventSpy.calledWith("selectionChanged"), "selectionChanged event fired");
		},
		assertNumberOfSelectedEquals: function(assert, iNum) {
			assert.strictEqual(this.oSM.allUid().length, iNum, "The number of selected objects matched");
		}
	});

	QUnit.test("Single", function(assert){
		this.oSM.setSelectionMode(sap.gantt.SelectionMode.Single);
		var oSpyFireEvent = this.spy(this.oSM, "fireEvent");

		this.oSM.update("uid1", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 1);
		this.assertSelectionEventFired(assert, oSpyFireEvent);

		this.oSM.update(null);
		this.assertNumberOfSelectedEquals(assert, 0);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("MultiWithKeyboard", function(assert){
		var oSpyFireEvent = this.spy(this.oSM, "fireEvent");
		this.oSM.setSelectionMode(sap.gantt.SelectionMode.MultiWithKeyboard);

		this.oSM.update("uid1", {selected: true});
		this.oSM.update("uid2", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 1);
		assert.ok(oSpyFireEvent.calledTwice, "fireEvent called Twice");

		this.oSM.update("uid3", {selected: true, ctrl: true});
		this.assertNumberOfSelectedEquals(assert, 2);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("Multiple", function(assert){
		var oSpyFireEvent = this.spy(this.oSM, "fireEvent");
		this.oSM.setSelectionMode(sap.gantt.SelectionMode.Multiple);

		this.oSM.update("uid1", {selected: true});
		this.oSM.update("uid2", {selected: true});
		this.oSM.update("uid3", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 3);

		this.oSM.update("uid1", {selected: false});
		this.assertNumberOfSelectedEquals(assert, 2);

		this.oSM.update(null);

		// clear all selections
		this.assertNumberOfSelectedEquals(assert, 0);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("Misc", function(assert){
		this.oSM.setSelectionMode(sap.gantt.SelectionMode.Multiple);
		this.oSM.update("uid1", {selected: true});
		this.oSM.update(); // passing undefined also clear selection
		this.assertNumberOfSelectedEquals(assert, 0);

		var oSpyFireEvent = this.spy(this.oSM, "fireEvent");
		this.oSM.setSelectionMode(sap.gantt.SelectionMode.None);
		this.oSM.update("uid1", {selected: true});
		// None selection mode do nothing here
		this.assertNumberOfSelectedEquals(assert, 0);
		assert.ok(oSpyFireEvent.notCalled, "None selectionMode shouldn't fire any event");
	});
});
