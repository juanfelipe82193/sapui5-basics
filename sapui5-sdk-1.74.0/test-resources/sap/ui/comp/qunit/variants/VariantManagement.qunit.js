/* globals QUnit, sinon */


sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/comp/variants/VariantItem",
	"sap/ui/comp/variants/VariantManagement",
	"sap/ui/Device",
	"sap/ui/core/mvc/JSView"

], function(qutils, VariantItem, VariantManagement, Device, JSView) {
	"use strict";

	var _createVariantItem = function(sText, sKey) {
		var oVariantItem = new VariantItem();
		oVariantItem.setText(sText);
		oVariantItem.setKey(sKey);
		return oVariantItem;
	};

	var _openVariantSelection = function(oTest, oVariantManagement) {
// var oTarget = oVariantManagement.oVariantPopoverTrigger.getFocusDomRef();
		oVariantManagement.ontap();
	};

	var _openManageDialog = function(oTest, oVariantManagement) {
		_openVariantSelection(oTest, oVariantManagement);
		var oTarget = oVariantManagement.oVariantManage.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: null
		});
		oTest.clock.tick(500);
	};

	var _openSaveAsDialog = function(oTest, oVariantManagement) {
		_openVariantSelection(oTest, oVariantManagement);
		var oTarget = oVariantManagement.oVariantSaveAs.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: null
		});
		oTest.clock.tick(500);
	};

	var _createVariantItem2 = function(sText, sKey, sNamespace, bReadOnly, bGlobal, bExecuteOnSelection, sPackage, sTransportId, sAccessOptions, bLabelReadOnly) {
		var oVariantItem = new VariantItem();
		oVariantItem.setText(sText);
		oVariantItem.setKey(sKey);
		oVariantItem.setNamespace(sNamespace);
		oVariantItem.setReadOnly(bReadOnly);
		oVariantItem.setGlobal(bGlobal);
		oVariantItem.setExecuteOnSelection(bExecuteOnSelection);
		oVariantItem.setLifecyclePackage(sPackage);
		oVariantItem.setLifecycleTransportId(sTransportId);
		oVariantItem.setAccessOptions(sAccessOptions);
		oVariantItem.setLabelReadOnly(bLabelReadOnly);
		return oVariantItem;
	};

	var _triggerSave = function(oVariantManagement) {
		if (oVariantManagement.oSaveDialog) {
			oVariantManagement._triggerSave();

			if (oVariantManagement.oSaveDialog.isOpen()) {
				oVariantManagement.oSaveDialog.close();
			}
		}
	};

	QUnit.module("sap.ui.comp.variants.VariantManagement", {
		beforeEach: function() {
			this.clock = sinon.useFakeTimers();
			this.oVariantManagement = new VariantManagement();
			this.oVariantManagement._delayedControlCreation();
		},
		afterEach: function() {
			this.oVariantManagement.destroy();
			this.clock.restore();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oVariantManagement);
	});

	QUnit.test("Checking the getItems", function(assert) {
		assert.ok(this.oVariantManagement.getItems());

		assert.equal(this.oVariantManagement.getItems().length, 0, "the internal array should contain no entry");
	});

	QUnit.test("Checking the aggregation addItem", function(assert) {
		var oVariantItem = _createVariantItem("Variant 1", "V1");
		this.oVariantManagement.addItem(oVariantItem);

		assert.ok(this.oVariantManagement.getItems());

		assert.equal(this.oVariantManagement.getItems().length, 1, "the internal array should contain one entry");
	});

	QUnit.test("Checking the aggregation addFilterItem with two items", function(assert) {
		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		this.oVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		this.oVariantManagement.addItem(oVariantItem2);

		assert.ok(this.oVariantManagement.getItems());

		assert.equal(this.oVariantManagement.getItems().length, 2, "the internal array should contain two entries");
	});

	QUnit.test("Checking initial Item Selection", function(assert) {
		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		this.oVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		this.oVariantManagement.addItem(oVariantItem2);

		assert.equal(this.oVariantManagement.getSelectionKey(), null, "the selected item should be null");
		assert.equal(this.oVariantManagement.getItems().length, 2, "the internal array should contain two entries");

		this.oVariantManagement.setInitialSelectionKey("V2");

		assert.equal(this.oVariantManagement.getSelectionKey(), "V2", "the selected item should be \"V2\"");
		assert.equal(this.oVariantManagement.getItems().length, 2, "the internal array should contain two entries");
	});

	QUnit.test("Checking error state", function(assert) {
		assert.ok(!this.oVariantManagement.getInErrorState());
		this.oVariantManagement.setInErrorState(true);
		assert.ok(this.oVariantManagement.getInErrorState());
	});

	QUnit.test("Checking index of item", function(assert) {
		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		this.oVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		this.oVariantManagement.addItem(oVariantItem2);

		assert.equal(this.oVariantManagement.getItems().length, 2, "the internal array should contain two entries");
		assert.equal(this.oVariantManagement.indexOfItem(oVariantItem1), 0, "the index of item V1 selected item should be 0");
		assert.equal(this.oVariantManagement.indexOfItem(oVariantItem2), 1, "the index of item V2 selected item should be 1");

		this.oVariantManagement.setInitialSelectionKey("V1");

		assert.equal(this.oVariantManagement.getSelectionKey(), "V1", "the selected item should be \"V1\"");
		assert.equal(this.oVariantManagement.getItems().length, 2, "the internal array should contain two entries");
		assert.equal(this.oVariantManagement.indexOfItem(oVariantItem1), 0, "the index of item V1 selected item should be 0");
		assert.equal(this.oVariantManagement.indexOfItem(oVariantItem2), 1, "the index of item V2 selected item should be 1");
	});

	QUnit.test("Checking insertItem", function(assert) {
		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		this.oVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		this.oVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		this.oVariantManagement.insertItem(oVariantItem3, 1);

		assert.equal(this.oVariantManagement.getItems().length, 3, "the internal array should contain three entries");
		assert.equal(this.oVariantManagement.indexOfItem(oVariantItem1), 0, "the index of item V1 selected item should be 0");
		assert.equal(this.oVariantManagement.indexOfItem(oVariantItem2), 2, "the index of item V2 selected item should be 2");
		assert.equal(this.oVariantManagement.indexOfItem(oVariantItem3), 1, "the index of item V3 selected item should be 1");

		this.oVariantManagement.setInitialSelectionKey("V1");

		assert.equal(this.oVariantManagement.getSelectionKey(), "V1", "the selected item should be \"V1\"");
		assert.equal(this.oVariantManagement.indexOfItem(oVariantItem1), 0, "the index of item V1 selected item should be 0");
		assert.equal(this.oVariantManagement.indexOfItem(oVariantItem2), 2, "the index of item V2 selected item should be 2");
		assert.equal(this.oVariantManagement.indexOfItem(oVariantItem3), 1, "the index of item V3 selected item should be 1");
	});

	QUnit.test("Checking Item Selection", function(assert) {
		this.oVariantManagement.setInitialSelectionKey("V2");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		this.oVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		this.oVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		this.oVariantManagement.insertItem(oVariantItem3, 1);

		assert.equal(this.oVariantManagement._getSelectedItem(), oVariantItem2, "\"V2\" should be the selected item");
	});

	QUnit.test("Remove Item", function(assert) {
		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		this.oVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		this.oVariantManagement.addItem(oVariantItem2);

		assert.equal(this.oVariantManagement.getItems().length, 2, "the item array should contain two entries");
		this.oVariantManagement.removeItem(oVariantItem2);
		assert.equal(this.oVariantManagement.getItems().length, 1, "the item  array should contain one entries");
	});

	QUnit.test("Destroy Items", function(assert) {
		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		this.oVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		this.oVariantManagement.addItem(oVariantItem2);

		assert.equal(this.oVariantManagement.getItems().length, 2, "the item array should contain two entries");
		this.oVariantManagement.destroyItems();
		assert.equal(this.oVariantManagement.getItems().length, 0, "the item  array should contain no entries");
	});

	QUnit.test("Checking Replace Key", function(assert) {
		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		this.oVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		this.oVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		this.oVariantManagement.addItem(oVariantItem3);

		this.oVariantManagement.setDefaultVariantKey("V1");
		assert.equal(this.oVariantManagement.getDefaultVariantKey(), "V1", "the selected item should be \"V1\"");
		this.oVariantManagement.setInitialSelectionKey("V1");
		assert.equal(this.oVariantManagement.getSelectionKey(), "V1", "the selected item should be \"V1\"");

		this.oVariantManagement.replaceKey("V1", "V4");
		assert.equal(this.oVariantManagement.getSelectionKey(), null, "the selected item should be \"null\"");
		assert.equal(this.oVariantManagement.getDefaultVariantKey(), "V4", "the selected item should be \"V4\"");

		this.oVariantManagement.setInitialSelectionKey("V4");
		assert.equal(this.oVariantManagement.getSelectionKey(), "V4", "the selected item should be \"V4\"");
	});

	QUnit.test("Checking getItemByKey", function(assert) {
		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		this.oVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		this.oVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		this.oVariantManagement.addItem(oVariantItem3);

		var oItem = this.oVariantManagement.getItemByKey("V1");
		assert.equal(oItem, oVariantItem1, "Returned item should be \"V1\"");

		oItem = this.oVariantManagement.getItemByKey("V0");
		assert.equal(oItem, null, "No item should be returned");
	});

	QUnit.test("Check Visibility", function(assert) {
		assert.equal(this.oVariantManagement.getVisible(), true, "VariantManagement should be visible");
		this.oVariantManagement.setVisible(false);
		assert.equal(this.oVariantManagement.getVisible(), false, "VariantManagement should not be visible");
		this.oVariantManagement.setVisible(true);
		assert.equal(this.oVariantManagement.getVisible(), true, "VariantManagement should be visible");

	});

	QUnit.test("Add style Class", function(assert) {
		assert.equal(this.oVariantManagement.hasStyleClass("styleTest"), false, "VariantManagement should not have the style class \"styleTest\"");
		this.oVariantManagement.addStyleClass("styleTest");
		assert.equal(this.oVariantManagement.hasStyleClass("styleTest"), true, "VariantManagement should have the style class \"styleTest\"");
		this.oVariantManagement.removeStyleClass("styleTest");
		assert.equal(this.oVariantManagement.hasStyleClass("styleTest"), false, "VariantManagement should not have the style class \"styleTest\"");
	});

	QUnit.test("Check compact Style", function(assert) {
		var myVariantManagement = new VariantManagement();
		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		myVariantManagement.addItem(oVariantItem3);

		myVariantManagement.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		if (Device.system.phone) {
			assert.ok(myVariantManagement);
		} else {
			_openManageDialog(this, myVariantManagement);

			assert.equal(myVariantManagement.oManagementDialog.hasStyleClass("sapUiSizeCompact"), false, "Manage Dialog should not have the style class \"sapUiSizeCompact\"");
			myVariantManagement.destroy();

			myVariantManagement = new VariantManagement();
			oVariantItem1 = _createVariantItem("Variant 1", "V1");
			myVariantManagement.addItem(oVariantItem1);

			oVariantItem2 = _createVariantItem("Variant 2", "V2");
			myVariantManagement.addItem(oVariantItem2);

			oVariantItem3 = _createVariantItem("Variant 3", "V3");
			myVariantManagement.addItem(oVariantItem3);

			// Add temporary compact style...
			document.querySelector('#qunit-fixture').classList.add("sapUiSizeCompact");

			myVariantManagement.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			_openManageDialog(this, myVariantManagement);

			assert.equal(myVariantManagement.oManagementDialog.hasStyleClass("sapUiSizeCompact"), true, "Manage Dialog shouldhave the style class \"sapUiSizeCompact\"");

			//...and remove again the compact style
			document.querySelector('#qunit-fixture').classList.remove("sapUiSizeCompact");

		}

		myVariantManagement.destroy();

	});

	QUnit.test("Check Management Manage Button State", function(assert) {
		// assert.equal(this.oVariantManagement.oVariantManage.getEnabled(), false, "Manage button should be disabled if there are no entries");
		assert.equal(this.oVariantManagement.oVariantManage.getEnabled(), true, "Manage button should always be enabled");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		this.oVariantManagement.addItem(oVariantItem1);

		assert.equal(this.oVariantManagement.oVariantManage.getEnabled(), true, "Manage button should be enabled if there are entries");
	});

	QUnit.test("Check Management List Dialog Items", function(assert) {
		var myVariantManagement = new VariantManagement();
		myVariantManagement._delayedControlCreation();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		myVariantManagement.addItem(oVariantItem3);

		myVariantManagement.setInitialSelectionKey("V1");

		assert.equal(myVariantManagement.oManagementTable.getItems().length, 0, "Management List should be empty");

		sap.ui.getCore().applyChanges();

		if (Device.system.phone) {
			assert.ok(myVariantManagement);
		} else {
			_openManageDialog(this, myVariantManagement);
			sap.ui.getCore().applyChanges();

			assert.equal(myVariantManagement.oManagementTable.getItems().length, 4, "Management List should contain 4 Items");
		}
		myVariantManagement.destroy();
	});

	QUnit.test("Check Management List Dialog Save Button behaviour (live change)", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		myVariantManagement.addItem(oVariantItem3);

		myVariantManagement.setInitialSelectionKey("V1");

		sap.ui.getCore().applyChanges();

		if (Device.system.phone) {
			assert.ok(myVariantManagement);
		} else {

			_openManageDialog(this, myVariantManagement);

			sap.ui.getCore().applyChanges();

			assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled");

			var inputId = myVariantManagement.oVariantManage.getId() + "-input-1";
			var inputItem = sap.ui.getCore().byId(inputId);

			inputItem.onfocusin(); // for some reason this is not triggered when calling focus via API
			inputItem._$input.focus().trigger("click");
			this.clock.tick(500);

			inputItem._$input.focus().val("Variant 11").trigger("input");
			sap.ui.getCore().applyChanges();
			assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled after a change");

			inputItem.onfocusin(); // for some reason this is not triggered when calling focus via API
			inputItem._$input.focus().trigger("click");
			this.clock.tick(500);

			inputItem._$input.focus().val("").trigger("input");
			sap.ui.getCore().applyChanges();
			assert.equal(myVariantManagement.oManagementSave.getEnabled(), false, "Save Button on Manage Dialog should be disabled if name is blank");

			inputItem.onfocusin(); // for some reason this is not triggered when calling focus via API
			inputItem._$input.focus().trigger("click");
			this.clock.tick(500);

			inputItem._$input.focus().val("Variant 4").trigger("input");
			sap.ui.getCore().applyChanges();
			assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled if the same name does not exist already");

			inputItem._$input.focus().val("Variant 2").trigger("input");
			sap.ui.getCore().applyChanges();
			assert.equal(myVariantManagement.oManagementSave.getEnabled(), false, "Save Button on Manage Dialog should be disabled if the same name exist already");
		}
		myVariantManagement.destroy();
	});

	QUnit.test("Check Management List Dialog Save Button behaviour (change)", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 11", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 111", "V3");
		myVariantManagement.addItem(oVariantItem3);

		myVariantManagement.setInitialSelectionKey("V1");

		sap.ui.getCore().applyChanges();

		_openManageDialog(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled");

		var inputId = myVariantManagement.oVariantManage.getId() + "-input-1";
		var inputItem = sap.ui.getCore().byId(inputId);

		qutils.triggerCharacterInput(inputItem.getFocusDomRef(), "1");
		inputItem.onChange();
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oManagementSave.getEnabled(), false, "Save Button on Manage Dialog should be enabled");

		qutils.triggerCharacterInput(inputItem.getFocusDomRef(), "1");
		inputItem.onChange();
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oManagementSave.getEnabled(), false, "Save Button on Manage Dialog should be enabled");

		qutils.triggerCharacterInput(inputItem.getFocusDomRef(), "1");
		inputItem.onChange();
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled if there are no conflicts");

		inputItem.onfocusin(); // for some reason this is not triggered when calling focus via API
		inputItem._$input.focus().trigger("click");
		this.clock.tick(500);

		inputItem._$input.focus().val("");
		qutils.triggerCharacterInput(inputItem.getFocusDomRef(), " ");
		inputItem.onChange();
		sap.ui.getCore().applyChanges();
		// assert.equal(inputItem.getValue(), "Variant 1", "If \"Blank\" is entered fall back to initial value");
		assert.equal(myVariantManagement.oManagementSave.getEnabled(), false, "Save Button on Manage Dialog should be disabled if there are conflicts");

		myVariantManagement.destroy();
	});

	QUnit.test("Check Management List Dialog Save Button behaviour (delete)", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		myVariantManagement.addItem(oVariantItem3);

		myVariantManagement.setInitialSelectionKey("V1");
		myVariantManagement.setDefaultVariantKey("V1");

		sap.ui.getCore().applyChanges();

		_openManageDialog(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled");

		var deleteButtonId = myVariantManagement.oVariantManage.getId() + "-del-1";
		var deleteButton = sap.ui.getCore().byId(deleteButtonId);

		var oTarget = deleteButton.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oManagementTable.getItems().length, 3, "Management List should contain 3 Items after delete");
		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled after a delete");

		myVariantManagement.destroy();
	});

	QUnit.test("Check Management List Dialog Cancel Button", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		myVariantManagement.addItem(oVariantItem3);

		myVariantManagement.setInitialSelectionKey("V1");

		sap.ui.getCore().applyChanges();

		_openManageDialog(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled");

		var deleteButtonId = myVariantManagement.oVariantManage.getId() + "-del-1";
		var deleteButton = sap.ui.getCore().byId(deleteButtonId);

		var oTarget = deleteButton.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oManagementTable.getItems().length, 3, "Management List should contain 3 Items after delete");
		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled after a delete");
		assert.equal(myVariantManagement.aRemovedVariants.length, 1, "There should be one removed variant");

		var cancelId = myVariantManagement.getId() + "-managementcancel";
		var cancelItem = sap.ui.getCore().byId(cancelId);
		oTarget = cancelItem.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: null
		});
		this.clock.tick(500);

		assert.equal(myVariantManagement.aRemovedVariants.length, 0, "There should be no removed variants after \"Cancel\"");
		myVariantManagement.destroy();
	});

	QUnit.test("Check Management List Dialog Save Button", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		myVariantManagement.addItem(oVariantItem3);

		myVariantManagement.setInitialSelectionKey("V1");
		myVariantManagement.setDefaultVariantKey("V1");

		sap.ui.getCore().applyChanges();

		if (Device.system.phone) {
			assert.ok(myVariantManagement);
		} else {
			_openManageDialog(this, myVariantManagement);
			sap.ui.getCore().applyChanges();

			assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled");

			var deleteButtonId = myVariantManagement.oVariantManage.getId() + "-del-1";
			var deleteButton = sap.ui.getCore().byId(deleteButtonId);

			var oTarget = deleteButton.getFocusDomRef();
			qutils.triggerTouchEvent("tap", oTarget, {
				srcControl: null
			});
			sap.ui.getCore().applyChanges();
			this.clock.tick(500);

			assert.equal(myVariantManagement.oManagementTable.getItems().length, 3, "Management List should contain 3 Items after delete");
			assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled after a delete");
			assert.equal(myVariantManagement.aRemovedVariants.length, 1, "There should be one removed variant");

			var defaultRBId = myVariantManagement.oVariantManage.getId() + "-def-2";
			var defaultRB = sap.ui.getCore().byId(defaultRBId);

			oTarget = defaultRB.getFocusDomRef();
			if (oTarget) {
				qutils.triggerTouchEvent("tap", oTarget, {
					srcControl: null
				});
				sap.ui.getCore().applyChanges();
				this.clock.tick(500);

				assert.equal(defaultRB.getSelected(), true, "V2 Should be the new default variant");

			}

			var inputId = myVariantManagement.oVariantManage.getId() + "-input-2";
			var inputItem = sap.ui.getCore().byId(inputId);

			qutils.triggerCharacterInput(inputItem.getFocusDomRef(), "1");
			inputItem.onChange();
			sap.ui.getCore().applyChanges();

			qutils.triggerTouchEvent("tap", myVariantManagement.oManagementSave.getFocusDomRef(), {
				srcControl: null
			});
			this.clock.tick(500);

			assert.equal(myVariantManagement.getItems().length, 2, "Variant List should contain two items after \"Save\"");
			assert.equal(myVariantManagement.getItems()[0].getText(), "Variant 21", "Variant name should be changed to \"Variant 21\" after \"Save\"");
		}
		myVariantManagement.destroy();
	});

	QUnit.test("Check Management List Dialog Save Button / delete last Variant", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		myVariantManagement.setInitialSelectionKey("V1");
		myVariantManagement.setDefaultVariantKey("V1");

		sap.ui.getCore().applyChanges();

		_openManageDialog(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled");

		var deleteButtonId = myVariantManagement.oVariantManage.getId() + "-del-1";
		var deleteButton = sap.ui.getCore().byId(deleteButtonId);

		var oTarget = deleteButton.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oManagementTable.getItems().length, 1, "Management List should contain one Item after delete");
		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled after a delete");
		assert.equal(myVariantManagement.aRemovedVariants.length, 1, "There should be one removed variant");

		qutils.triggerTouchEvent("tap", myVariantManagement.oManagementSave.getFocusDomRef(), {
			srcControl: null
		});
		this.clock.tick(500);

		assert.equal(myVariantManagement.getItems().length, 0, "Variant List should contain no items after \"Save\"");
		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_DEFAULT"), "Action Select should contain the \"Default\" entry after \"Save\"");
		myVariantManagement.destroy();
	});

	QUnit.test("Check Save As Dialog OK Button behaviour", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		myVariantManagement.addItem(oVariantItem3);

		myVariantManagement.setInitialSelectionKey("V1");
		myVariantManagement.setDefaultVariantKey("V1");

		sap.ui.getCore().applyChanges();
		_openSaveAsDialog(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled initially");

		assert.equal(myVariantManagement.oInputName.getValue(), "Variant 1", "\"Variant 1\" should be the value in the input field.");
		assert.equal(myVariantManagement.oInputName.getEnabled(), true, "The input field should be enabled.");

		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled if the name value is \"Variant 1\"");

		myVariantManagement.destroy();
	});

	QUnit.test("Check Save As Dialog OK Button (new/check default)", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		myVariantManagement.addItem(oVariantItem3);

		sap.ui.getCore().applyChanges();
		_openSaveAsDialog(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled initially");

		myVariantManagement.oInputName._$input.focus().val("Variant 1").trigger("input");
		sap.ui.getCore().applyChanges();

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oInputName.getValue(), "Variant 1", "\"Variant 1\" should be the value in the input field.");
		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled if there is a conflict");
		assert.equal(myVariantManagement.oDefault.getEnabled(), true, "\"Default\" checkbox on Save Dialog should be enabled");

		myVariantManagement.oInputName._$input.focus().val("    ").trigger("input");
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oInputName.getValue(), "    ", "\"    \" should be the value in the input field.");
		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled if there is no input");
		assert.equal(myVariantManagement.oDefault.getEnabled(), true, "\"Default\" checkbox on Save Dialog should be enabled");

		myVariantManagement.oInputName._$input.focus().val("Variant 4").trigger("input");
		sap.ui.getCore().applyChanges();

		qutils.triggerTouchEvent("tap", myVariantManagement.oDefault.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oInputName.getValue(), "Variant 4", "\"Variant 4\" should be the value in the input field.");
		assert.equal(myVariantManagement.oSaveSave.getEnabled(), true, "\"OK\" Button on Save Dialog should be enabled if there is no conflict");
		assert.equal(myVariantManagement.oDefault.getEnabled(), true, "\"Default\" checkbox on Save Dialog should be enabled");
		assert.equal(myVariantManagement.oDefault.getSelected(), true, "\"Default\" checkbox on Save Dialog should be checked");

		qutils.triggerTouchEvent("tap", myVariantManagement.oSaveSave.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.getItems().length, 4, "There should be 5 variants now.");
		assert.equal(myVariantManagement.oVariantText.getText(), "Variant 4", "The new variant should be selected.");
		assert.equal(myVariantManagement.getDefaultVariantKey().substring(0, 2), "SV", "Variant 4 should be the default variant.");

		myVariantManagement.clearVariantSelection();
		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_DEFAULT"), "The \"Default\" variant should be selected.");

		myVariantManagement.destroy();
	});

	QUnit.test("Check Save As Dialog Cancel Button", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		myVariantManagement.addItem(oVariantItem3);

		sap.ui.getCore().applyChanges();
		_openSaveAsDialog(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled initially");

		myVariantManagement.oInputName._$input.focus().val("Variant 11").trigger("input");
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oInputName.getValue(), "Variant 11", "\"Variant 11\" should be the value in the input field.");
		assert.equal(myVariantManagement.oSaveSave.getEnabled(), true, "\"OK\" Button on Save Dialog should be enabled after change");

		var cancelButton = sap.ui.getCore().byId(myVariantManagement.getId() + "-variantcancel");
		qutils.triggerTouchEvent("tap", cancelButton.getFocusDomRef(), {
			srcControl: null
		});
		this.clock.tick(500);

		assert.equal(myVariantManagement.getItems().length, 3, "There should still be 3 variants.");
		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_DEFAULT"), "No variant should be selected.");

		myVariantManagement.destroy();
	});

	QUnit.test("Check Save As Dialog OK Button behaviour - generate Error", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		myVariantManagement.addItem(oVariantItem3);

		myVariantManagement.setInitialSelectionKey("V1");
		myVariantManagement.setDefaultVariantKey("V1");
		myVariantManagement._enableManualVariantKey(true);

		sap.ui.getCore().applyChanges();
		_openSaveAsDialog(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled initially");

		assert.equal(myVariantManagement.oInputName.getValue(), "Variant 1", "\"Variant 1\" should be the value in the input field.");
		assert.equal(myVariantManagement.oInputName.getEnabled(), true, "The input field should be enabled.");
		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled if the name value is \"Variant 1\"");

		myVariantManagement.oInputName._$input.focus().val("").trigger("input");
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oInputName.getValue(), "", "The input field should be empty.");

		qutils.triggerTouchEvent("tap", myVariantManagement.oSaveSave.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		myVariantManagement.oInputName._$input.focus().val("New Variant").trigger("input");
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oInputName.getValue(), "New Variant", "\"New Variant\" should be the value of the input field.");

		qutils.triggerTouchEvent("tap", myVariantManagement.oSaveSave.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		myVariantManagement.oInputKey._$input.focus().val(" ").trigger("input");
		this.clock.tick(500);

		myVariantManagement.destroy();
	});

	QUnit.test("Select a variant", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		myVariantManagement.addItem(oVariantItem3);

		myVariantManagement.setInitialSelectionKey("V1");

		sap.ui.getCore().applyChanges();

		if (Device.system.phone) {
			assert.ok(myVariantManagement);
		} else {
			_openVariantSelection(this, myVariantManagement);
			sap.ui.getCore().applyChanges();

			assert.equal(myVariantManagement.oVariantText.getText(), "Variant 1", "\"Variant 1\" should be selected.");

			// act
			var sItemId = myVariantManagement.getId() + "-trigger-item-2";
			var oItem = sap.ui.getCore().byId(sItemId);
			var oTarget = myVariantManagement.oVariantList.getFocusDomRef();
			qutils.triggerTouchEvent("tap", oTarget, {
				srcControl: oItem
			});

			sap.ui.getCore().applyChanges();
			this.clock.tick(500);

			assert.equal(myVariantManagement.oVariantText.getText(), "Variant 3", "\"Variant 3\" should be selected.");

		}

		myVariantManagement.destroy();
	});

	QUnit.test("Check Save Button on Popover", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var oVariantItem1 = _createVariantItem("Variant 1", "V1");
		myVariantManagement.addItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem("Variant 2", "V2");
		myVariantManagement.addItem(oVariantItem2);

		var oVariantItem3 = _createVariantItem("Variant 3", "V3");
		myVariantManagement.addItem(oVariantItem3);

		myVariantManagement.setDefaultVariantKey("V3");

		sap.ui.getCore().applyChanges();
		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantSave.getVisible(), false, "\"Save\" Button on Variant Selection Popover should be hidden if the Standard variant is selected");

		var sItemId = myVariantManagement.getId() + "-trigger-item-2";
		var oItem = sap.ui.getCore().byId(sItemId);
		var oTarget = myVariantManagement.oVariantList.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: oItem
		});

		sap.ui.getCore().applyChanges();
		this.clock.tick(600);

		assert.equal(myVariantManagement.oVariantText.getText(), "Variant 3", "\"Variant 3\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Variant 3\" should be un-modified.");
		assert.equal(myVariantManagement.currentVariantGetModified(), false, "\"Variant 3\" should be un-modified.");

		myVariantManagement.currentVariantSetModified(true);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), true, "\"Variant 3\" should be marked as modified.");
		assert.equal(myVariantManagement.currentVariantGetModified(), true, "\"Variant 3\" should be modified.");

		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantSave.getVisible(), true, "\"Save\" Button on Variant Selection Popover should be visible if the modified variant is selected");

		oTarget = myVariantManagement.oVariantSave.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: null
		});

		sap.ui.getCore().applyChanges();
		this.clock.tick(500);
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Variant 3\" should be un-modified again.");

		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantSave.getEnabled(), true, "\"Save\" Button on Variant Selection Popover should be enabled if non motified variant is selected");

		sItemId = myVariantManagement.getId() + "-trigger-item-1";
		oItem = sap.ui.getCore().byId(sItemId);
		oTarget = myVariantManagement.oVariantList.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: oItem
		});

		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), "Variant 2", "\"Variant 2\" should be selected.");

		myVariantManagement.destroy();
	});

	QUnit.test("Check Save Button on Popover - V2", function(assert) {

		var myVariantManagement = new VariantManagement();
		myVariantManagement.placeAt("qunit-fixture");

		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;

		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		myVariantManagement.setDefaultVariantKey("V3");

		sap.ui.getCore().applyChanges();
		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantSave.getVisible(), false, "\"Save\" Button on Variant Selection Popover should be hidden if the Standard variant is selected");

		var sItemId = myVariantManagement.getId() + "-trigger-item-2";
		var oItem = sap.ui.getCore().byId(sItemId);
		var oTarget = myVariantManagement.oVariantList.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: oItem
		});

		sap.ui.getCore().applyChanges();
		this.clock.tick(600);

		assert.equal(myVariantManagement.oVariantText.getText(), "Variant 3", "\"Variant 3\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Variant 3\" should be un-modified.");
		assert.equal(myVariantManagement.currentVariantGetModified(), false, "\"Variant 3\" should be un-modified.");

		myVariantManagement.currentVariantSetModified(true);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), true, "\"Variant 3\" should be marked as modified.");
		assert.equal(myVariantManagement.currentVariantGetModified(), true, "\"Variant 3\" should be modified.");

		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantSave.getVisible(), true, "\"Save\" Button on Variant Selection Popover should be visible if the modified variant is selected");

		oTarget = myVariantManagement.oVariantSave.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: null
		});

		sap.ui.getCore().applyChanges();
		this.clock.tick(600);
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Variant 3\" should be un-modified again.");

		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantSave.getVisible(), false, "\"Save\" Button on Variant Selection Popover should be hidden if non motified variant is selected");

		sItemId = myVariantManagement.getId() + "-trigger-item-standard";
		oItem = sap.ui.getCore().byId(sItemId);
		oTarget = myVariantManagement.oVariantList.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: oItem
		});
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");

		sap.ui.getCore().applyChanges();
		this.clock.tick(500);
		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantSave.getVisible(), false, "\"Save\" Button on Variant Selection Popover should be hidden if the Standard variant is selected");

		sItemId = myVariantManagement.getId() + "-trigger-item-1";
		oItem = sap.ui.getCore().byId(sItemId);
		oTarget = myVariantManagement.oVariantList.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: oItem
		});

		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), "Variant 2", "\"Variant 2\" should be selected.");

		myVariantManagement.destroy();
	});

	QUnit.test("V2: Variant Item checks - General", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});

		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		myVariantManagement.setDefaultVariantKey("V3");

		sap.ui.getCore().applyChanges();
		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantSave.getVisible(), false, "\"Save\" Button on Variant Selection Popover should be hidden if the Standard variant is selected");

		var sItemId = myVariantManagement.getId() + "-trigger-item-2";
		var oItem = sap.ui.getCore().byId(sItemId);
		var oTarget = myVariantManagement.oVariantList.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: oItem
		});

		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), "Variant 3", "\"Variant 3\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Variant 3\" should be un-modified.");

		myVariantManagement.destroy();
	});

	QUnit.test("V2: Variant Item checks - rename global variant", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Standard\" should be un-modified.");

		_openManageDialog(this, myVariantManagement);
		myVariantManagement._getFlTransportSelection = function() {
			return Promise.resolve({

				selectTransport: function(o, s, e, b) {
					var oEvent = {
						mParameters: {
							selectedPackage: "/UIF/LREP_HOME_CONTENT",
							selectedTransport: "U31K000001"
						},
						getParameters: function() {
							return this.mParameters;
						}
					};
					s(oEvent);
				}
			});
		};

		var inputId = myVariantManagement.oVariantManage.getId() + "-input-2";
		var inputItem = sap.ui.getCore().byId(inputId);
		qutils.triggerCharacterInput(inputItem.getFocusDomRef(), "1");
		inputItem.onChange();
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oManagementSave.getVisible(), true, "Save Button on Manage Dialog should be visible if there are changes");

		qutils.triggerTouchEvent("tap", myVariantManagement.oManagementSave.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();

		var done = assert.async();
		myVariantManagement.attachManage(function(oEvent) {
			assert.equal(myVariantManagement.getVariantItems()[1].getText(), "Variant 21", "Variant name should be changed to \"Variant 21\" after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[1].getLifecyclePackage(), "/UIF/LREP_HOME_CONTENT", "Variant package should be \"/UIF/LREP_HOME_CONTENT\" after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[1].getLifecycleTransportId(), "U31K000001", "Variant transport should be \"U31K000001\" after \"Save\"");

			myVariantManagement.destroy();
			done();
		});
	});

	QUnit.test("V2: Variant Item checks - change execute on selection for global variant", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Standard\" should be un-modified.");

		if (Device.system.phone) {
			assert.ok(myVariantManagement);
		} else {
			_openManageDialog(this, myVariantManagement);
			myVariantManagement._getFlTransportSelection = function() {
				return Promise.resolve({

					selectTransport: function(o, s, e, b) {
						var oEvent = {
							mParameters: {
								selectedPackage: o["package"],
								selectedTransport: "U31K000001"
							},
							getParameters: function() {
								return this.mParameters;
							}
						};
						s(oEvent);
					}
				});
			};

			var sCheckBoxId = myVariantManagement.oVariantManage.getId() + "-exe-2";
			var oCheckBoxItem = sap.ui.getCore().byId(sCheckBoxId);
			qutils.triggerTouchEvent("tap", oCheckBoxItem.getFocusDomRef(), {
				srcControl: null
			});
			sap.ui.getCore().applyChanges();
			this.clock.tick(500);

			sCheckBoxId = myVariantManagement.oVariantManage.getId() + "-exe-3";
			oCheckBoxItem = sap.ui.getCore().byId(sCheckBoxId);
			qutils.triggerTouchEvent("tap", oCheckBoxItem.getFocusDomRef(), {
				srcControl: null
			});
			sap.ui.getCore().applyChanges();
			this.clock.tick(500);

			assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled if there are changes");
			qutils.triggerTouchEvent("tap", myVariantManagement.oManagementSave.getFocusDomRef(), {
				srcControl: null
			});
			sap.ui.getCore().applyChanges();

			var done = assert.async();
			myVariantManagement.attachManage(function(oEvent) {
				if (oCheckBoxItem.getFocusDomRef()) {
					assert.equal(myVariantManagement.getVariantItems()[1].getExecuteOnSelection(), true, "Variant ExecuteOnSelection should be changed to \"true\" after \"Save\"");
					assert.equal(myVariantManagement.getVariantItems()[1].getLifecyclePackage(), "/UIF/LREP_HOME_CONTENT", "Variant package should be \"/UIF/LREP_HOME_CONTENT\" after \"Save\"");
					assert.equal(myVariantManagement.getVariantItems()[1].getLifecycleTransportId(), "U31K000001", "Variant transport should be \"U31K000001\" after \"Save\"");
				}
				myVariantManagement.destroy();
				done();
			});
		}
	});
	QUnit.test("V2: Variant Item checks - delete global variant", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.setShowExecuteOnSelection(true);
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		myVariantManagement.setDefaultVariantKey("V2");

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Standard\" should be un-modified.");

		_openManageDialog(this, myVariantManagement);
		myVariantManagement._getFlTransportSelection = function() {
			return Promise.resolve({

				selectTransport: function(o, s, e, b) {
					var oEvent = {
						mParameters: {
							selectedPackage: o["package"],
							selectedTransport: "U31K000001"
						},
						getParameters: function() {
							return this.mParameters;
						}
					};
					s(oEvent);
				}
			});
		};

		var sDeleteId = myVariantManagement.oVariantManage.getId() + "-del-2";
		var oDeleteItem = sap.ui.getCore().byId(sDeleteId);
		qutils.triggerTouchEvent("tap", oDeleteItem.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled if there are changes");

		qutils.triggerTouchEvent("tap", myVariantManagement.oManagementSave.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();

		var done = assert.async();
		myVariantManagement.attachManage(function(oEvent) {

			assert.equal(myVariantManagement.aRemovedVariants[0], "V2", "Variant 2 should be in the Removed Variants List after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[1].getLifecyclePackage(), "/UIF/LREP_HOME_CONTENT", "Variant package should be \"/UIF/LREP_HOME_CONTENT\" after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[1].getLifecycleTransportId(), "U31K000001", "Variant transport should be \"U31K000001\" after \"Save\"");

			myVariantManagement.destroy();
			done();
		});
	});
	QUnit.test("V2: Variant Item checks - set default variant", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.setShowExecuteOnSelection(true);
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		bGlobal = true;
		bReadOnly = false;
		var oVariantItem4 = _createVariantItem2("VarianT 3", "V4", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RD", true);
		myVariantManagement.addVariantItem(oVariantItem4);

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Standard\" should be un-modified.");
		assert.equal(myVariantManagement.getDefaultVariantKey(), myVariantManagement.STANDARDVARIANTKEY, "\"*standard\" should be default variant key");

		_openManageDialog(this, myVariantManagement);

		var sDefaultId = myVariantManagement.oVariantManage.getId() + "-def-2";
		var oDefaultItem = sap.ui.getCore().byId(sDefaultId);
		qutils.triggerTouchEvent("tap", oDefaultItem.getFocusDomRef(), {
			srcControl: null
		});
		this.clock.tick(500); // RadioButton Group works with timer!!!
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled if there are changes");

		qutils.triggerTouchEvent("tap", myVariantManagement.oManagementSave.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		if (oDefaultItem.getFocusDomRef()) {
			assert.equal(myVariantManagement.getDefaultVariantKey(), "V2", "Variant 2 should be the new Default Variant after \"Save\"");
		}

		myVariantManagement.destroy();
	});
	QUnit.test("V2: Variant Item checks - create new variant", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.setShowExecuteOnSelection(true);
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);

		bGlobal = true;
		bReadOnly = false;
		var oVariantItem4 = _createVariantItem2("VarianT 3", "V4", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RD", true);

		bGlobal = true;
		bReadOnly = false;
		var oVariantItem5 = _createVariantItem2("Variant 3", "V5", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RD", true);

		// Kick in sorting code
		myVariantManagement.addVariantItem(oVariantItem4);
		myVariantManagement.addVariantItem(oVariantItem2);
		myVariantManagement.addVariantItem(oVariantItem3);
		myVariantManagement.addVariantItem(oVariantItem5);
		myVariantManagement.addVariantItem(oVariantItem1);

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Standard\" should be un-modified.");
		assert.equal(myVariantManagement.getDefaultVariantKey(), myVariantManagement.STANDARDVARIANTKEY, "\"*standard\" should be default variant key");

		myVariantManagement._getFlTransportSelection = function() {
			return Promise.resolve({

				selectTransport: function(o, s, e, b) {
					var oEvent = {
						mParameters: {
							selectedPackage: "/UIF/LREP_HOME_CONTENT",
							selectedTransport: "U31K000001"
						},
						getParameters: function() {
							return this.mParameters;
						}
					};
					s(oEvent);
				}
			});
		};

		_openSaveAsDialog(this, myVariantManagement);

		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled initially");

		assert.equal(myVariantManagement.oInputName.getValue(), myVariantManagement.oModel.getProperty("/selectedVariant"), "The name input field should be 'Standard'.");
		assert.equal(myVariantManagement.oInputName.getEnabled(), true, "The input field should be enabled.");
		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled if the name field is empty");

		myVariantManagement.oInputName._$input.focus().val("Variant 0").trigger("input");
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oInputName.getValue(), "Variant 0", "\"Variant 0\" should be the value in the input field.");
		assert.equal(myVariantManagement.oDefault.getEnabled(), true, "\"Default\" checkbox on Save Dialog should be enabled");
		assert.equal(myVariantManagement.oShare.getEnabled(), true, "\"Share\" checkbox on Save Dialog should be enabled");
		assert.equal(myVariantManagement.oExecuteOnSelect.getEnabled(), true, "\"Execute on Selection\" checkbox on Save Dialog should be enabled");
		assert.equal(myVariantManagement.oCreateTile.getEnabled(), true, "\"Create Tile\" checkbox on Save Dialog should be enabled");

		qutils.triggerTouchEvent("tap", myVariantManagement.oDefault.getFocusDomRef(), {
			srcControl: null
		});
		qutils.triggerTouchEvent("tap", myVariantManagement.oShare.getFocusDomRef(), {
			srcControl: null
		});
		qutils.triggerTouchEvent("tap", myVariantManagement.oShare.getFocusDomRef(), {
			srcControl: null
		});
		qutils.triggerTouchEvent("tap", myVariantManagement.oShare.getFocusDomRef(), {
			srcControl: null
		});
		qutils.triggerTouchEvent("tap", myVariantManagement.oExecuteOnSelect.getFocusDomRef(), {
			srcControl: null
		});
		qutils.triggerTouchEvent("tap", myVariantManagement.oCreateTile.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oSaveSave.getEnabled(), true, "\"OK\" Button on Save Dialog should be enabled");
		myVariantManagement.oSaveSave.setEnabled(true);

		assert.equal(myVariantManagement.oDefault.getSelected(), true, "\"Default\" checkbox on Save Dialog should be checked");
		assert.equal(myVariantManagement.oShare.getSelected(), true, "\"Share\" checkbox on Save Dialog should be checked");
		assert.equal(myVariantManagement.oExecuteOnSelect.getSelected(), true, "\"Execute on Select\" checkbox on Save Dialog should be checked");
		assert.equal(myVariantManagement.oCreateTile.getSelected(), true, "\"Create Tile\" checkbox on Save Dialog should be checked");

		var done = assert.async();
		myVariantManagement.attachSave(function(oEvent) {
			assert.equal(myVariantManagement.getVariantItems()[5].getLifecyclePackage(), "/UIF/LREP_HOME_CONTENT", "Variant package should be \"/UIF/LREP_HOME_CONTENT\" after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[5].getLifecycleTransportId(), "U31K000001", "Variant transport should be \"U31K000001\" after \"Save\"");
			if (myVariantManagement.getVariantItems()[6] && (oEvent.getParameter("key") === myVariantManagement.getVariantItems()[6].getKey())) {
				assert.equal(oEvent.getParameter("lifecyclePackage"), "");
				assert.equal(oEvent.getParameter("lifecycleTransportId"), "");
				this._toBeDestroyed = myVariantManagement;
				done();
			}
		});

		myVariantManagement._triggerSave();

		// assert.equal(myVariantManagement.getVariantItems()[5].getLifecyclePackage(), "/UIF/LREP_HOME_CONTENT", "Variant package should be
		// \"/UIF/LREP_HOME_CONTENT\" after \"Save\"");
		// assert.equal(myVariantManagement.getVariantItems()[5].getLifecycleTransportId(), "U31K000001", "Variant transport should be \"U31K000001\"
		// after \"Save\"");

		myVariantManagement.setInitialSelectionKey("");
		_openSaveAsDialog(this, myVariantManagement);

		assert.equal(myVariantManagement.oInputName.getValue(), myVariantManagement.oModel.getProperty("/selectedVariant"), "The name input field should be 'Standard'.");
		assert.equal(myVariantManagement.oInputName.getEnabled(), true, "The input field should be enabled.");
		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled initially");
		myVariantManagement.oSaveSave.setEnabled(true);

		myVariantManagement.oInputName._$input.focus().val("Variant local").trigger("input");
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oInputName.getValue(), "Variant local", "\"Variant local\" should be the value in the input field.");
		assert.equal(myVariantManagement.oDefault.getEnabled(), true, "\"Default\" checkbox on Save Dialog should be enabled");
		assert.equal(myVariantManagement.oShare.getEnabled(), true, "\"Share\" checkbox on Save Dialog should be enabled");
		assert.equal(myVariantManagement.oExecuteOnSelect.getEnabled(), true, "\"Execute on Selection\" checkbox on Save Dialog should be enabled");
		assert.equal(myVariantManagement.oCreateTile.getEnabled(), true, "\"Create Tile\" checkbox on Save Dialog should be enabled");

		assert.equal(myVariantManagement.oSaveSave.getEnabled(), true, "\"OK\" Button on Save Dialog should be enabled if there is a change");
		assert.equal(myVariantManagement.oDefault.getSelected(), false, "\"Default\" checkbox on Save Dialog should be unchecked");
		assert.equal(myVariantManagement.oShare.getSelected(), false, "\"Share\" checkbox on Save Dialog should be unchecked");
		assert.equal(myVariantManagement.oExecuteOnSelect.getSelected(), false, "\"Execute on Select\" checkbox on Save Dialog should be unchecked");
		assert.equal(myVariantManagement.oCreateTile.getSelected(), false, "\"Create Tile\" checkbox on Save Dialog should be unchecked");

		_triggerSave(myVariantManagement);
		// assert.equal(myVariantManagement.getVariantItems()[6].getLifecyclePackage(), "", "Variant package should be empty after \"Save\"");
		// assert.equal(myVariantManagement.getVariantItems()[6].getLifecycleTransportId(), "", "Variant transport should be empty after \"Save\"");
		// myVariantManagement.destroy();
	});
	QUnit.test("V2: Variant Item checks - create new variant - Manual Id entry", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement._setBackwardCompatibility(false);
		myVariantManagement.setShowExecuteOnSelection(true);
		myVariantManagement._enableManualVariantKey(true);
		myVariantManagement.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Standard\" should be un-modified.");
		assert.equal(myVariantManagement.getDefaultVariantKey(), myVariantManagement.STANDARDVARIANTKEY, "\"*standard*\" should be default variant key");

		_openSaveAsDialog(this, myVariantManagement);

		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled initially");

		assert.equal(myVariantManagement.oInputName.getValue(), myVariantManagement.oModel.getProperty("/selectedVariant"), "The name input field should be 'Standard'.");
		assert.equal(myVariantManagement.oInputName.getEnabled(), true, "The input field should be enabled.");
		assert.equal(myVariantManagement.oInputKey.getVisible(), true, "The key input field should be visible.");
		assert.equal(myVariantManagement.oInputKey.getValue(), "", "The key input field should be empty.");
		assert.equal(myVariantManagement.oInputKey.getEnabled(), true, "The input field should be enabled.");
		assert.equal(myVariantManagement.oSaveSave.getEnabled(), false, "\"OK\" Button on Save Dialog should be disabled if the name field is empty");

		myVariantManagement.oInputName._$input.focus().val("Variant 0").trigger("input");
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oInputName.getValue(), "Variant 0", "\"Variant 0\" should be the value in the input field.");
		myVariantManagement.oInputKey._$input.focus().val("key0").trigger("input");
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oInputKey.getValue(), "key0", "\"key0\" should be the value in the keyinput field.");

		assert.equal(myVariantManagement.oSaveSave.getEnabled(), true, "\"OK\" Button on Save Dialog should be enabled if there is a change");

		var done = assert.async();

		myVariantManagement.attachSave(function(oEvent) {
			assert.equal(myVariantManagement.getVariantItems()[0].getKey(), "key0", "Variant key should be \"key0\" after \"Save\"");

			this._toBeDestroyed = myVariantManagement;

			done();
		});

		_triggerSave(myVariantManagement);
	});

	QUnit.test("V2: Variant Item checks - save existing variant", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.setShowExecuteOnSelection(true);
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);

		bGlobal = true;
		bReadOnly = false;
		var oVariantItem4 = _createVariantItem2("VarianT 3", "V4", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RD", true);

		// Kick in sorting code
		myVariantManagement.addVariantItem(oVariantItem4);
		myVariantManagement.addVariantItem(oVariantItem2);
		myVariantManagement.addVariantItem(oVariantItem3);
		myVariantManagement.addVariantItem(oVariantItem1);

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Standard\" should be un-modified.");
		assert.equal(myVariantManagement.getDefaultVariantKey(), myVariantManagement.STANDARDVARIANTKEY, "\"*standard\" should be default variant key");

		myVariantManagement._getFlTransportSelection = function() {
			return Promise.resolve({

				selectTransport: function(o, s, e, b) {
					var oEvent = {
						mParameters: {
							selectedPackage: o["package"],
							selectedTransport: "U31K000001"
						},
						getParameters: function() {
							return this.mParameters;
						}
					};
					s(oEvent);
				}
			});
		};

		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantSave.getVisible(), false, "\"Save\" Button on Variant Selection Popover should be hidden if the Standard variant is selected");

		var sItemId = myVariantManagement.getId() + "-trigger-item-0";
		var oItem = sap.ui.getCore().byId(sItemId);
		var oTarget = myVariantManagement.oVariantList.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: oItem
		});

		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), "Variant 1", "\"Variant 1\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Variant 1\" should be un-modified.");

		myVariantManagement.currentVariantSetModified(true);
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), true, "\"Variant 1\" should be marked as modified.");
		myVariantManagement.currentVariantSetModified(false);
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Variant 1\" should be marked as un-modified.");
		myVariantManagement.currentVariantSetModified(true);
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), true, "\"Variant 1\" should be marked as modified.");

		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), true, "\"Variant 1\" should be marked as modified.");
		assert.equal(myVariantManagement.oVariantSave.getVisible(), false, "\"Save\" Button on Variant Selection Popover should be hidden if a readonly variant is selected");

		sItemId = myVariantManagement.getId() + "-trigger-item-1";
		oItem = sap.ui.getCore().byId(sItemId);
		oTarget = myVariantManagement.oVariantList.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: oItem
		});

		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), "Variant 2", "\"Variant 2\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Variant 2\" should be un-modified.");

		myVariantManagement.currentVariantSetModified(true);
		sap.ui.getCore().applyChanges();

		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), true, "\"Variant 2\" should be marked as modified.");
		assert.equal(myVariantManagement.oVariantSave.getVisible(), true, "\"Save\" Button on Variant Selection Popover should be visible if a writeable variant is selected");
		assert.equal(myVariantManagement.getVariantItems()[1].getLifecycleTransportId(), "", "Variant transport should be empty");

		var done = assert.async();
		myVariantManagement.attachSave(function(oEvent) {
			if (myVariantManagement.getVariantItems()[1] && (oEvent.getParameter("key") === myVariantManagement.getVariantItems()[1].getKey())) {
				assert.equal(oEvent.getParameter("lifecyclePackage"), "/UIF/LREP_HOME_CONTENT");
				assert.equal(oEvent.getParameter("lifecycleTransportId"), "U31K000001");
				this._toBeDestroyed = myVariantManagement;
				done();
			}
		});

		myVariantManagement._variantSavePressed();
	});

	QUnit.test("V2: Variant Item checks - rename global variant currently selected", function(assert) {
		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		myVariantManagement.setInitialSelectionKey("V2");
		myVariantManagement.currentVariantSetModified(true);
		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), "Variant 2", "\"Variant 2\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), true, "\"Variant 2\" should be modified.");

		sap.ui.getCore().applyChanges();

		_openManageDialog(this, myVariantManagement);

		myVariantManagement._getFlTransportSelection = function() {
			return Promise.resolve({

				selectTransport: function(o, s, e, b) {
					var oEvent = {
						mParameters: {
							selectedPackage: o["package"],
							selectedTransport: "U31K000001"
						},
						getParameters: function() {
							return this.mParameters;
						}
					};
					s(oEvent);
				}
			});
		};

		var inputId = myVariantManagement.oVariantManage.getId() + "-input-2";
		var inputItem = sap.ui.getCore().byId(inputId);
		qutils.triggerCharacterInput(inputItem.getFocusDomRef(), "1");
		inputItem.onChange();
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled if there are changes");

		qutils.triggerTouchEvent("tap", myVariantManagement.oManagementSave.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();

		var done = assert.async();
		myVariantManagement.attachManage(function(oEvent) {

			assert.equal(myVariantManagement.getVariantItems()[1].getText(), "Variant 21", "Variant name should be changed to \"Variant 21\" after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[1].getLifecyclePackage(), "/UIF/LREP_HOME_CONTENT", "Variant package should be \"/UIF/LREP_HOME_CONTENT\" after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[1].getLifecycleTransportId(), "U31K000001", "Variant transport should be \"U31K000001\" after \"Save\"");

			myVariantManagement.destroy();

			done();
		});
	});
	QUnit.test("V2: Variant Item checks - rename global variant - no life cycle support", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: false
		});
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Standard\" should be un-modified.");

		_openManageDialog(this, myVariantManagement);
		myVariantManagement._getFlTransportSelection = function() {
			return Promise.resolve({

				selectTransport: function(o, s, e, b) {
					var oEvent = {
						mParameters: {
							selectedPackage: o["package"],
							selectedTransport: "U31K000001"
						},
						getParameters: function() {
							return this.mParameters;
						}
					};
					s(oEvent);
				}
			});
		};

		var inputId = myVariantManagement.oVariantManage.getId() + "-input-2";
		var inputItem = sap.ui.getCore().byId(inputId);
		qutils.triggerCharacterInput(inputItem.getFocusDomRef(), "1");
		inputItem.onChange();
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled if there are changes");

		var done = assert.async();
		myVariantManagement.attachManage(function(oEvent) {
			assert.equal(myVariantManagement.getVariantItems()[1].getText(), "Variant 21", "Variant name should be changed to \"Variant 21\" after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[1].getLifecyclePackage(), "/UIF/LREP_HOME_CONTENT", "Variant package should be \"/UIF/LREP_HOME_CONTENT\" after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[1].getLifecycleTransportId(), "", "Variant transport should be empty after \"Save\"");

			myVariantManagement.destroy();
			done();
		});

		myVariantManagement._handleManageSavePressed();
	});
	QUnit.test("V2: Variant Item checks - rename global variant - transport already assigned", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "U31K000002", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Standard\" should be un-modified.");

		_openManageDialog(this, myVariantManagement);

		myVariantManagement._getFlTransportSelection = function() {
			return Promise.resolve({

				selectTransport: function(o, s, e, b) {
					var oEvent = {
						mParameters: {
							selectedPackage: o["package"],
							selectedTransport: "U31K000001"
						},
						getParameters: function() {
							return this.mParameters;
						}
					};
					s(oEvent);
				}
			});
		};

		var inputId = myVariantManagement.oVariantManage.getId() + "-input-2";
		var inputItem = sap.ui.getCore().byId(inputId);
		qutils.triggerCharacterInput(inputItem.getFocusDomRef(), "1");
		inputItem.onChange();
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled if there are changes");

		var done = assert.async();
		myVariantManagement.attachManage(function(oEvent) {

			assert.equal(myVariantManagement.getVariantItems()[1].getText(), "Variant 21", "Variant name should be changed to \"Variant 21\" after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[1].getLifecyclePackage(), "/UIF/LREP_HOME_CONTENT", "Variant package should be \"/UIF/LREP_HOME_CONTENT\" after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[1].getLifecycleTransportId(), "U31K000002", "Variant transport should be \"U31K000002\" after \"Save\"");

			myVariantManagement.destroy();
			done();
		});

		myVariantManagement._handleManageSavePressed();
	});
	QUnit.test("V2: Variant Item checks - rename global variant - generate error", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		myVariantManagement.setInitialSelectionKey("V2");
		myVariantManagement.currentVariantSetModified(true);
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oVariantText.getText(), "Variant 2", "\"Variant 2\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), true, "\"Variant 2\" should be modified.");

		sap.ui.getCore().applyChanges();

		_openManageDialog(this, myVariantManagement);
		myVariantManagement._getFlTransportSelection = function() {
			return Promise.resolve({
				selectTransport: function(o, s, e, b) {
				}
			});
		};

		var inputId = myVariantManagement.oVariantManage.getId() + "-input-2";
		var inputItem = sap.ui.getCore().byId(inputId);
		qutils.triggerCharacterInput(inputItem.getFocusDomRef(), "1");
		inputItem.onChange();
		sap.ui.getCore().applyChanges();
		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled if there are changes");

		var done = assert.async();
		myVariantManagement.attachManage(function(oEvent) {
			assert.equal(myVariantManagement.getVariantItems()[1].getText(), "Variant 21", "Variant name should be changed after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[1].getLifecyclePackage(), "/UIF/LREP_HOME_CONTENT", "Variant package should be \"/UIF/LREP_HOME_CONTENT\" after \"Save\"");
			assert.equal(myVariantManagement.getVariantItems()[1].getLifecycleTransportId(), "", "Variant transport should be empty after \"Save\"");
			assert.equal(myVariantManagement.oVariantText.getText(), "Variant 21", "\"Variant 21\" should be selected.");
			// assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), true, "\"Variant 2\" should be modified.");

			myVariantManagement.destroy();
			done();
		});

		myVariantManagement._handleManageSavePressed();
	});
	QUnit.test("V2: Variant Item checks - try to change execute on selection for global variant - generate error", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Standard\" should be un-modified.");

		_openManageDialog(this, myVariantManagement);
		myVariantManagement._getFlTransportSelection = function() {
			return Promise.resolve({

				selectTransport: function(o, s, e, b) {
				}
			});
		};

		var sCheckBoxId = myVariantManagement.oVariantManage.getId() + "-exe-2";
		var oCheckBoxItem = sap.ui.getCore().byId(sCheckBoxId);
		qutils.triggerTouchEvent("tap", oCheckBoxItem.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled");

		qutils.triggerTouchEvent("tap", myVariantManagement.oManagementSave.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.getVariantItems()[1].getExecuteOnSelection(), false, "Variant ExecuteOnSelection should not be changed after \"Save\"");
		assert.equal(myVariantManagement.getVariantItems()[1].getLifecyclePackage(), "/UIF/LREP_HOME_CONTENT", "Variant package should be \"/UIF/LREP_HOME_CONTENT\" after \"Save\"");
		assert.equal(myVariantManagement.getVariantItems()[1].getLifecycleTransportId(), "", "Variant transport should be empty after \"Save\"");

		myVariantManagement.destroy();
	});
	QUnit.test("V2: Variant Item checks - delete global variant - generate error", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.setShowExecuteOnSelection(true);
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Standard\" should be un-modified.");

		_openManageDialog(this, myVariantManagement);
		myVariantManagement._getFlTransportSelection = function() {
			return Promise.resolve({

				selectTransport: function(o, s, e, b) {
				}
			});
		};

		var sDeleteId = myVariantManagement.oVariantManage.getId() + "-del-2";
		var oDeleteItem = sap.ui.getCore().byId(sDeleteId);
		qutils.triggerTouchEvent("tap", oDeleteItem.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oManagementSave.getEnabled(), true, "Save Button on Manage Dialog should be enabled");

		qutils.triggerTouchEvent("tap", myVariantManagement.oManagementSave.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.getVariantItems()[1].getLifecyclePackage(), "/UIF/LREP_HOME_CONTENT", "Variant package should be \"/UIF/LREP_HOME_CONTENT\" after \"Save\"");
		assert.equal(myVariantManagement.getVariantItems()[1].getLifecycleTransportId(), "", "Variant transport should be empty after \"Save\"");

		assert.equal(myVariantManagement.aRemovedVariants.length, 0, "No variants should be in the Removed Variants List after \"Save\"");

		myVariantManagement.destroy();
	});

	QUnit.test("V2: Variant Item checks - click on variant Label", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.setShowExecuteOnSelection(true);
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);

		bGlobal = true;
		bReadOnly = false;
		var oVariantItem4 = _createVariantItem2("VarianT 3", "V4", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RD", true);

		// Kick in sorting code
		myVariantManagement.addVariantItem(oVariantItem4);
		myVariantManagement.addVariantItem(oVariantItem2);
		myVariantManagement.addVariantItem(oVariantItem3);
		myVariantManagement.addVariantItem(oVariantItem1);

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");
		assert.equal(myVariantManagement.oVariantModifiedText.getVisible(), false, "\"Standard\" should be un-modified.");
		assert.equal(myVariantManagement.getDefaultVariantKey(), myVariantManagement.STANDARDVARIANTKEY, "\"*standard\" should be default variant key");

		myVariantManagement._getFlTransportSelection = function() {
			return Promise.resolve({

				selectTransport: function(o, s, e, b) {
				}
			});
		};

		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		// act
		var sItemId = myVariantManagement.getId() + "-trigger-item-3";
		var oItem = sap.ui.getCore().byId(sItemId);
		var oTarget;
		oTarget = myVariantManagement.oVariantList.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: oItem
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), "Variant 3", "\"Variant 3\" should be selected.");

		_openVariantSelection(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		oTarget = myVariantManagement.getFocusDomRef();
		qutils.triggerTouchEvent("click", oTarget, {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();

		// act
		sItemId = myVariantManagement.getId() + "-trigger-item-standard";
		oItem = sap.ui.getCore().byId(sItemId);
		oTarget = myVariantManagement.oVariantList.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: oItem
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");

		myVariantManagement.destroy();
	});

	QUnit.test("V2: Variant Item checks - open variant save and variant manage twice", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		myVariantManagement.insertVariantItem(oVariantItem1, 0);

		sap.ui.getCore().applyChanges();

		_openManageDialog(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		var cancelButton = sap.ui.getCore().byId(myVariantManagement.getId() + "-managementcancel");
		qutils.triggerTouchEvent("tap", cancelButton.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");

		_openManageDialog(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		cancelButton = sap.ui.getCore().byId(myVariantManagement.getId() + "-managementcancel");
		qutils.triggerTouchEvent("tap", cancelButton.getFocusDomRef(), {
			srcControl: null
		});
		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");

		_openSaveAsDialog(this, myVariantManagement);

		cancelButton = sap.ui.getCore().byId(myVariantManagement.getId() + "-variantcancel");
		qutils.triggerTouchEvent("tap", cancelButton.getFocusDomRef(), {
			srcControl: null
		});

		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");

		_openSaveAsDialog(this, myVariantManagement);

		cancelButton = sap.ui.getCore().byId(myVariantManagement.getId() + "-variantcancel");
		qutils.triggerTouchEvent("tap", cancelButton.getFocusDomRef(), {
			srcControl: null
		});

		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), myVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"), "\"Standard\" should be selected.");

		myVariantManagement.destroy();
	});
	QUnit.test("V2: Internal Variant Flags", function(assert) {

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true
		});
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		sap.ui.getCore().applyChanges();

		_openManageDialog(this, myVariantManagement);
		sap.ui.getCore().applyChanges();

		var executeId = myVariantManagement.oVariantManage.getId() + "-exe-0";
		var executeItem = sap.ui.getCore().byId(executeId);

		assert.equal(executeItem.getSelected(), false, "Execute on Select for the \"Standard\" Item should not be selected.");

		var cancelId = myVariantManagement.getId() + "-managementcancel";
		var cancelItem = sap.ui.getCore().byId(cancelId);
		var oTarget = cancelItem.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: null
		});
		this.clock.tick(500);

		myVariantManagement._executeOnSelectForStandardVariantByXML(true);
		_openManageDialog(this, myVariantManagement);
		sap.ui.getCore().applyChanges();
		executeId = myVariantManagement.oVariantManage.getId() + "-exe-0";
		executeItem = sap.ui.getCore().byId(executeId);

		assert.equal(executeItem.getSelected(), true, "Execute on Select for the \"Standard\" Item should not be selected.");

		cancelId = myVariantManagement.getId() + "-managementcancel";
		cancelItem = sap.ui.getCore().byId(cancelId);
		oTarget = cancelItem.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: null
		});
		this.clock.tick(500);

		myVariantManagement.destroy();
	});

	QUnit.test("Replace Standard text", function(assert) {

		var sNewStandardText = "My Standard";

		var myVariantManagement = new VariantManagement({
			showShare: true,
			showExecuteOnSelection: true,
			showCreateTile: true,
			lifecycleSupport: true,
			standardItemText: sNewStandardText
		});
		myVariantManagement.placeAt("qunit-fixture");
		var bReadOnly;
		var bGlobal;
		var bExecuteOnSelection;

		bReadOnly = true;
		bGlobal = true;
		bExecuteOnSelection = false;
		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		myVariantManagement.addVariantItem(oVariantItem1);

		bReadOnly = false;
		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "RWD", false);
		myVariantManagement.addVariantItem(oVariantItem2);

		bGlobal = false;
		var oVariantItem3 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "", false);
		myVariantManagement.addVariantItem(oVariantItem3);

		sap.ui.getCore().applyChanges();

		assert.equal(myVariantManagement.oVariantText.getText(), sNewStandardText, "Variant should show alternate \"Standard\" text");

		_openVariantSelection(this, myVariantManagement);
		var oStandardVariantListItem = sap.ui.getCore().byId(myVariantManagement.oVariantPopoverTrigger.getId() + "-item-standard");
		assert.equal(oStandardVariantListItem.getText(), sNewStandardText, "VariantList should show alternate \"Standard\" text");

		var sItemId = myVariantManagement.getId() + "-trigger-item-2";
		var oItem = sap.ui.getCore().byId(sItemId);
		var oTarget = myVariantManagement.oVariantList.getFocusDomRef();
		qutils.triggerTouchEvent("tap", oTarget, {
			srcControl: oItem
		});

		sap.ui.getCore().applyChanges();
		this.clock.tick(500);

		assert.equal(myVariantManagement.oVariantText.getText(), "Variant 3", "\"Variant 3\" should be selected.");

		_openManageDialog(this, myVariantManagement);

		var oStandardVariantManageItem = sap.ui.getCore().byId(myVariantManagement.oVariantManage.getId() + "-text-0");

		assert.equal(oStandardVariantManageItem.getText() || oStandardVariantManageItem.getTitle(), sNewStandardText, "Variant Manage should show alternate \"Standard\" text");

		myVariantManagement.destroy();
	});

	QUnit.test("check _triggerSearch method", function(assert) {

		sinon.spy(this.oVariantManagement, "_restoreCompleteList");

		sinon.stub(this.oVariantManagement, "_triggerSearchByValue");
		this.oVariantManagement._triggerSearchByValue.onCall("hugo");

		var oParameters = {
			newValue: ""
		};
		var oEvent = {
			getParameters: function() {
				return oParameters;
			}
		};

		oParameters.query = "HuGo";
		this.oVariantManagement._triggerSearch(oEvent);
		assert.ok(this.oVariantManagement._restoreCompleteList.calledOnce);
		assert.ok(this.oVariantManagement._triggerSearchByValue.calledOnce);
	});

	QUnit.test("check _restoreCompleteList method", function(assert) {

		var bReadOnly = true;
		var bGlobal = true;
		var bExecuteOnSelection = false;

		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		this.oVariantManagement.addVariantItem(oVariantItem1);

		oVariantItem1 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		this.oVariantManagement.addVariantItem(oVariantItem1);

		oVariantItem1 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		this.oVariantManagement.addVariantItem(oVariantItem1);

		oVariantItem1 = _createVariantItem2("Variant 4", "V4", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		this.oVariantManagement.addVariantItem(oVariantItem1);

		assert.ok(this.oVariantManagement.oVariantList);
		assert.equal(this.oVariantManagement.oVariantList.getItems().length, 0);

		this.oVariantManagement._restoreCompleteList();

		assert.ok(this.oVariantManagement.oVariantList);

		var aListItems = this.oVariantManagement.oVariantList.getItems();
		assert.equal(aListItems.length, 5);

		assert.equal(aListItems[0].getKey(), this.oVariantManagement.STANDARDVARIANTKEY);

		assert.equal(aListItems[1].getKey(), "V1");
		assert.equal(aListItems[1].getText(), "Variant 1");

		assert.equal(aListItems[4].getKey(), "V4");
		assert.equal(aListItems[4].getText(), "Variant 4");
	});

	QUnit.test("check _triggerSearchByValue method", function(assert) {

		var bReadOnly = true;
		var bGlobal = true;
		var bExecuteOnSelection = false;
		var aListItems;

		sinon.stub(this.oVariantManagement, "_determineStandardVariantName").returns("STANDARD");

		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		this.oVariantManagement.addVariantItem(oVariantItem1);

		oVariantItem1 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		this.oVariantManagement.addVariantItem(oVariantItem1);

		oVariantItem1 = _createVariantItem2("Variant 3", "V3", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		this.oVariantManagement.addVariantItem(oVariantItem1);

		oVariantItem1 = _createVariantItem2("Variant 4", "V4", "com.sap.variant", bReadOnly, bGlobal, bExecuteOnSelection, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		this.oVariantManagement.addVariantItem(oVariantItem1);

		assert.ok(this.oVariantManagement.oVariantList);
		assert.equal(this.oVariantManagement.oVariantList.getItems().length, 0);

		this.oVariantManagement._restoreCompleteList();
		this.oVariantManagement._triggerSearchByValue("hugo");
		aListItems = this.oVariantManagement.oVariantList.getItems();
		assert.equal(aListItems.length, 0);

		this.oVariantManagement._restoreCompleteList();
		this.oVariantManagement._triggerSearchByValue("stan");
		aListItems = this.oVariantManagement.oVariantList.getItems();
		assert.equal(aListItems[0].getKey(), this.oVariantManagement.STANDARDVARIANTKEY);

		aListItems = this.oVariantManagement.oVariantList.getItems();
		assert.equal(aListItems.length, 1);

		this.oVariantManagement._restoreCompleteList();
		this.oVariantManagement._triggerSearchByValue("v");
		aListItems = this.oVariantManagement.oVariantList.getItems();
		assert.equal(aListItems.length, 4);

		assert.equal(aListItems[0].getKey(), "V1");
		assert.equal(aListItems[0].getText(), "Variant 1");

		assert.equal(aListItems[3].getKey(), "V4");
		assert.equal(aListItems[3].getText(), "Variant 4");

		this.oVariantManagement._restoreCompleteList();
		this.oVariantManagement._triggerSearchByValue("");
		aListItems = this.oVariantManagement.oVariantList.getItems();
		assert.equal(aListItems.length, 5);

		assert.equal(aListItems[0].getKey(), this.oVariantManagement.STANDARDVARIANTKEY);

		assert.equal(aListItems[1].getKey(), "V1");
		assert.equal(aListItems[1].getText(), "Variant 1");

		assert.equal(aListItems[4].getKey(), "V4");
		assert.equal(aListItems[4].getText(), "Variant 4");
	});

	QUnit.test("check _handleManageSavePressed method", function(assert) {

		var bReadOnly = true;
		var bGlobal = true;

		this.oVariantManagement.setShowExecuteOnSelection(true);

		sinon.stub(this.oVariantManagement, "_determineStandardVariantName").returns("STANDARD");

		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, false, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		this.oVariantManagement.addVariantItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, true, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		this.oVariantManagement.addVariantItem(oVariantItem2);

		sinon.stub(this.oVariantManagement, "_eventDone");
		this.oVariantManagement._delayedControlCreation();

		this.oVariantManagement._handleManageSavePressed();
		assert.ok(this.oVariantManagement._eventDone.called);
	});

	QUnit.test("check _openVariantManagementDialog method", function(assert) {

		var bReadOnly = true;
		var bGlobal = true;

		this.oVariantManagement.setUseFavorites(true);
		this.oVariantManagement.setShowShare(true);
		this.oVariantManagement.setShowSetAsDefault(true);
		this.oVariantManagement.setShowExecuteOnSelection(true);

		sinon.stub(this.oVariantManagement, "_determineStandardVariantName").returns("STANDARD");

		var oVariantItem1 = _createVariantItem2("Variant 1", "V1", "com.sap.variant", bReadOnly, bGlobal, false, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		this.oVariantManagement.addVariantItem(oVariantItem1);

		var oVariantItem2 = _createVariantItem2("Variant 2", "V2", "com.sap.variant", bReadOnly, bGlobal, true, "/UIF/LREP_HOME_CONTENT", "", "R", true);
		this.oVariantManagement.addVariantItem(oVariantItem2);

		sinon.stub(this.oVariantManagement.oVariantPopOver, "close");
		sinon.stub(this.oVariantManagement, "_createManagementDialog").returns(this.oVariantManagement.oManagementDialog = {
			open: function() {
			},
			close: function() {
			}
		});
		sinon.stub(this.oVariantManagement, "_assignColumnInfoForDeleteButton");
		sinon.stub(this.oVariantManagement, "_setDialogCompactStyle");

		sinon.stub(this.oVariantManagement, "_eventDone");
		this.oVariantManagement._delayedControlCreation();

		this.oVariantManagement.setDefaultVariantKey("V2");

		this.oVariantManagement._openVariantManagementDialog();

		var aColumns = this.oVariantManagement.oManagementTable.getColumns();
		assert.ok(aColumns);
		assert.equal(aColumns.length, 7);
		assert.ok(aColumns[0].getVisible());
		assert.ok(aColumns[1].getVisible());
		assert.ok(aColumns[2].getVisible());
		assert.ok(aColumns[3].getVisible());
		assert.ok(aColumns[4].getVisible());
		assert.ok(aColumns[5].getVisible());
		assert.ok(aColumns[6].getVisible());

		var oNewItems = this.oVariantManagement.oManagementTable.getItems();
		assert.equal(oNewItems[0].getCells().length, 7);
		assert.ok(!oNewItems[1].getCells()[3].getSelected());
		assert.ok(oNewItems[2].getCells()[3].getSelected());
		assert.ok(!oNewItems[1].getCells()[4].getSelected());
		assert.ok(oNewItems[2].getCells()[4].getSelected());

		this.oVariantManagement.setShowShare(false);

		assert.ok(aColumns[0].getVisible());
		assert.ok(aColumns[1].getVisible());
		assert.ok(!aColumns[2].getVisible());
		assert.ok(aColumns[3].getVisible());
		assert.ok(aColumns[4].getVisible());
		assert.ok(aColumns[5].getVisible());
		assert.ok(aColumns[6].getVisible());

		this.oVariantManagement._openVariantManagementDialog();

		oNewItems = this.oVariantManagement.oManagementTable.getItems();
		assert.equal(oNewItems[0].getCells().length, 7);
		assert.ok(!oNewItems[1].getCells()[3].getSelected());
		assert.ok(oNewItems[2].getCells()[3].getSelected());
		assert.ok(!oNewItems[1].getCells()[4].getSelected());
		assert.ok(oNewItems[2].getCells()[4].getSelected());

		this.oVariantManagement.setShowSetAsDefault(false);

		assert.ok(aColumns[0].getVisible());
		assert.ok(aColumns[1].getVisible());
		assert.ok(!aColumns[2].getVisible());
		assert.ok(!aColumns[3].getVisible());
		assert.ok(aColumns[4].getVisible());
		assert.ok(aColumns[5].getVisible());
		assert.ok(aColumns[6].getVisible());

		this.oVariantManagement._openVariantManagementDialog();
		oNewItems = this.oVariantManagement.oManagementTable.getItems();
		assert.equal(oNewItems[0].getCells().length, 7);
		assert.ok(!oNewItems[1].getCells()[3].getSelected());
		assert.ok(oNewItems[2].getCells()[3].getSelected());

		this.oVariantManagement.setShowExecuteOnSelection(false);

		assert.ok(aColumns[0].getVisible());
		assert.ok(aColumns[1].getVisible());
		assert.ok(!aColumns[2].getVisible());
		assert.ok(!aColumns[3].getVisible());
		assert.ok(!aColumns[4].getVisible());
		assert.ok(aColumns[5].getVisible());
		assert.ok(aColumns[6].getVisible());

		this.oVariantManagement.setUseFavorites(false);

		assert.ok(!aColumns[0].getVisible());
		assert.ok(aColumns[1].getVisible());
		assert.ok(!aColumns[2].getVisible());
		assert.ok(!aColumns[3].getVisible());
		assert.ok(!aColumns[4].getVisible());
		assert.ok(aColumns[5].getVisible());
		assert.ok(aColumns[6].getVisible());

		this.oVariantManagement._handleManageSavePressed();
		assert.ok(this.oVariantManagement._eventDone.called);

		this.oVariantManagement.oManagementDialog = null;
	});

	QUnit.test("check setBackwardCompatibility method", function(assert) {

		var sVariant = this.oVariantManagement._getVariantText();
		assert.equal(sVariant, this.oVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_DEFAULT"));

		this.oVariantManagement.setBackwardCompatibility(false);
		sVariant = this.oVariantManagement._getVariantText();
		assert.equal(sVariant, this.oVariantManagement.oResourceBundle.getText("VARIANT_MANAGEMENT_STANDARD"));
	});

	QUnit.test("check _getFlTransportSelection method", function(assert) {

		this.clock.restore(); // otherwise async loadLibray will not work

		var done = assert.async();

		this.oVariantManagement._getFlTransportSelection().then(function(oTransportSelection) {
			assert.ok(oTransportSelection);
			assert.ok(oTransportSelection.selectTransport);
		});

		this.oVariantManagement._getFlTransportSelection().then(function(oTransportSelection) {
			this.oVariantManagement._getFlTransportSelection();
			assert.ok(oTransportSelection);
			done();
		}.bind(this));

	});

	QUnit.start();

});
