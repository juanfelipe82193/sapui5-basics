/* global QUnit, sinon */

sap.ui.define([
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/core/CustomData",
	"sap/ui/core/Title",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/layout/GridData"
], function(Group, GroupElement, CustomData, Title, SmartField, GridData) {
	"use strict";

	var oGroup;

	function initTest() {
		oGroup = new Group("G1");
	}

	function afterTest() {
		oGroup.destroy();
		oGroup = undefined;
	}

	QUnit.module("Instance", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(oGroup, "Group is created");
	});

	QUnit.module("GroupElements", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("addGroupElement", function(assert) {
		var oGroupElement = new GroupElement();

		oGroup.addGroupElement(oGroupElement);
		var aFormElements = oGroup.getFormElements();
		assert.equal(aFormElements.length, 1, "GroupElement is added to \"formElements\" aggregation");
		aFormElements = oGroup.getAggregation("groupElements", []);
		assert.equal(aFormElements.length, 0, "GroupElement is not added to \"groupElements\" aggregation");

		oGroup.addGroupElement();
		aFormElements = oGroup.getFormElements();
		assert.equal(aFormElements.length, 1, "Nothing is added to \"formElements\" aggregation");
	});

	QUnit.test("getGroupElements", function(assert) {
		var oGroupElement1 = new GroupElement();
		var oGroupElement2 = new GroupElement();

		oGroup.addGroupElement(oGroupElement1);
		oGroup.addGroupElement(oGroupElement2);
		var aGroupElements = oGroup.getGroupElements();
		assert.equal(aGroupElements.length, 2, "added GroupElements are returned");
	});

	QUnit.test("indexOfGroupElement", function(assert) {
		var oGroupElement1 = new GroupElement();
		var oGroupElement2 = new GroupElement();

		oGroup.addGroupElement(oGroupElement1);
		oGroup.addGroupElement(oGroupElement2);

		var iIndex = oGroup.indexOfGroupElement(oGroupElement1);
		assert.equal(iIndex, 0, "GroupElement1 index");

		iIndex = oGroup.indexOfGroupElement(oGroupElement2);
		assert.equal(iIndex, 1, "GroupElement2 index");
	});

	QUnit.test("insertGroupElement", function(assert) {
		var oGroupElement1 = new GroupElement("GE1");
		var oGroupElement2 = new GroupElement("GE2");

		oGroup.insertGroupElement(oGroupElement1, 0);
		oGroup.insertGroupElement(oGroupElement2, 0);
		oGroup.insertGroupElement(null, 0);
		var aGroupElements = oGroup.getGroupElements();
		assert.equal(aGroupElements.length, 2, "GroupElements are inserted");
		assert.equal(aGroupElements[0].getId(), "GE2", "GroupElement2 is first GroupElement");
		assert.equal(aGroupElements[1].getId(), "GE1", "GroupElement1 is second GroupElement");
	});

	QUnit.test("removeGroupElement", function(assert) {
		var oGroupElement1 = new GroupElement("GE1");
		var oGroupElement2 = new GroupElement("GE2");
		var oGroupElement3 = new GroupElement("GE3");

		oGroup.addGroupElement(oGroupElement1);
		oGroup.addGroupElement(oGroupElement2);
		oGroup.addGroupElement(oGroupElement3);

		var oRemoved = oGroup.removeGroupElement(oGroupElement1);
		assert.equal(oRemoved, oGroupElement1, "GroupElement1 removed");

		oRemoved = oGroup.removeGroupElement(0);
		assert.equal(oRemoved, oGroupElement2, "GroupElement2 removed");

		oRemoved = oGroup.removeGroupElement("GE3");
		assert.equal(oRemoved, oGroupElement3, "GroupElement3 removed");
		assert.equal(oGroup.getGroupElements(), 0, "All GroupElements removed");

		oGroupElement1.destroy();
		oGroupElement2.destroy();
		oGroupElement3.destroy();
	});

	QUnit.test("removeAllGroupElements", function(assert) {
		var oGroupElement1 = new GroupElement("GE1");
		var oGroupElement2 = new GroupElement("GE2");

		oGroup.addGroupElement(oGroupElement1);
		oGroup.addGroupElement(oGroupElement2);

		var aRemoved = oGroup.removeAllGroupElements();
		assert.deepEqual(aRemoved, [oGroupElement1, oGroupElement2], "All GroupElements removed");
		assert.equal(oGroup.getGroupElements(), 0, "All GroupElements removed");

		oGroupElement1.destroy();
		oGroupElement2.destroy();
	});

	QUnit.test("destroyGroupElements", function(assert) {
		var oGroupElement1 = new GroupElement("GE1");
		var oGroupElement2 = new GroupElement("GE2");

		oGroup.addGroupElement(oGroupElement1);
		oGroup.addGroupElement(oGroupElement2);

		oGroup.destroyGroupElements();
		assert.equal(oGroup.getGroupElements(), 0, "All GroupElements removed");
		assert.notOk(sap.ui.getCore().byId("GE1"), "GroupElement1 is destroyed");
		assert.notOk(sap.ui.getCore().byId("GE2"), "GroupElement2 is destroyed");
	});

	QUnit.module("CustomData", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("addCustomData", function(assert) {
		var oGroupElement1 = new GroupElement();
		var oGroupElement2 = new GroupElement();
		var oGroupElement3 = new GroupElement();
		oGroup.addGroupElement(oGroupElement1);

		var oCustomData = new CustomData({key: "KEY", value: "VALUE"});
		var oCustomData2 = new CustomData({key: "sap.ui.fl:AppliedChanges", value: "VALUE"});
		var oCustomData3 = new CustomData({key: "sap-ui-custom-settings", value: "VALUE"});
		oGroup.addCustomData(oCustomData);
		oGroup.addCustomData(oCustomData2); // must not be inherited
		oGroup.addCustomData(oCustomData3); // must not be inherited
		oGroup.addGroupElement(oGroupElement2);
		oGroup.insertGroupElement(oGroupElement3, 0);

		var aCustomData = oGroup.getCustomData();
		assert.equal(aCustomData.length, 3, "CustomData set on Group");
		assert.equal(aCustomData[0], oCustomData, "CustomData set on Group");
		assert.equal(aCustomData[1], oCustomData2, "CustomData set on Group");
		assert.equal(aCustomData[2], oCustomData3, "CustomData set on Group");

		aCustomData = oGroupElement1.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData set on GroupElement1");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on GroupElement1 has same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on GroupElement1 has same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CstomData on GroupElement1");

		aCustomData = oGroupElement2.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData set on GroupElement2");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on GroupElement2 has same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on GroupElement2 has same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CstomData on GroupElement2");

		aCustomData = oGroupElement3.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData set on GroupElement3");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on GroupElement3 has same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on GroupElement3 has same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CustomData on GroupElement3");

		oGroup.removeGroupElement(oGroupElement2);
		aCustomData = oGroupElement2.getCustomData();
		assert.equal(aCustomData.length, 0, "no CustomData set on GroupElement2 after remove");
		oGroupElement2.destroy();

		oGroup.addCustomData();
		aCustomData = oGroup.getCustomData();
		assert.equal(aCustomData.length, 3, "no new CustomData set on Group");
	});

	QUnit.test("insertCustomData", function(assert) {
		var oGroupElement1 = new GroupElement();
		oGroup.addGroupElement(oGroupElement1);

		var oCustomData = new CustomData({key: "KEY", value: "VALUE"});
		var oCustomData2 = new CustomData({key: "sap.ui.fl:AppliedChanges", value: "VALUE"});
		var oCustomData3 = new CustomData({key: "sap-ui-custom-settings", value: "VALUE"});
		oGroup.insertCustomData(oCustomData, 0);
		oGroup.insertCustomData(oCustomData2, 0); // must not be inherited
		oGroup.insertCustomData(oCustomData3, 1); // must not be inherited

		var aCustomData = oGroup.getCustomData();
		assert.equal(aCustomData.length, 3, "CustomData set on Group");
		assert.equal(aCustomData[0], oCustomData2, "CustomData set on Group");
		assert.equal(aCustomData[1], oCustomData3, "CustomData set on Group");
		assert.equal(aCustomData[2], oCustomData, "CustomData set on Group");

		aCustomData = oGroupElement1.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData set on GroupElement1");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on GroupElement1 has same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on GroupElement1 has same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CstomData on GroupElement1");

		oGroup.insertCustomData(null, 0);
		aCustomData = oGroup.getCustomData();
		assert.equal(aCustomData.length, 3, "no new CustomData set on Group");
	});

	QUnit.test("removeCustomData", function(assert) {
		var oGroupElement1 = new GroupElement({
			customData: new CustomData({key: "KEY0", value: "VALUE0"})
		});
		var oCustomData1 = new CustomData({key: "KEY1", value: "VALUE1"});
		var oCustomData2 = new CustomData({key: "KEY2", value: "VALUE2"});

		oGroup.addCustomData(oCustomData1);
		oGroup.addGroupElement(oGroupElement1);
		oGroup.addCustomData(oCustomData2);
		oGroup.removeCustomData(1);

		var aCustomData = oGroupElement1.getCustomData();
		assert.equal(aCustomData.length, 2, "CustomData removed from GroupElement");
		assert.equal(aCustomData[0].getKey(), "KEY0", "first customData left");
		assert.equal(aCustomData[1].getKey(), "KEY1", "last customData left");

		oCustomData1.destroy();
	});

	QUnit.test("removeAllCustomData", function(assert) {
		var oGroupElement1 = new GroupElement({
			customData: new CustomData({key: "KEY0", value: "VALUE0"})
		});
		var oCustomData1 = new CustomData({key: "KEY1", value: "VALUE1"});
		var oCustomData2 = new CustomData({key: "KEY2", value: "VALUE2"});

		oGroup.addCustomData(oCustomData1);
		oGroup.addGroupElement(oGroupElement1);
		oGroup.addCustomData(oCustomData2);
		var aCustomData = oGroup.removeAllCustomData(1);

		assert.equal(aCustomData.length, 2, "two CustomData removed from GroupElement");
		aCustomData = oGroupElement1.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData removed from GroupElement");
		assert.equal(aCustomData[0].getKey(), "KEY0", "first customData left");

		oCustomData1.destroy();
		oCustomData2.destroy();
	});

	QUnit.test("destroyCustomData", function(assert) {
		var oGroupElement1 = new GroupElement({
			customData: new CustomData({key: "KEY0", value: "VALUE0"})
		});
		var oCustomData1 = new CustomData({key: "KEY1", value: "VALUE1"});
		var oCustomData2 = new CustomData({key: "KEY2", value: "VALUE2"});

		oGroup.addCustomData(oCustomData1);
		oGroup.addGroupElement(oGroupElement1);
		oGroup.addCustomData(oCustomData2);
		oGroup.destroyCustomData(1);

		var aCustomData = oGroupElement1.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData removed from GroupElement");
		assert.equal(aCustomData[0].getKey(), "KEY0", "first customData left");
		assert.notOk(sap.ui.getCore().byId("CD1"), "CustomData destroyed");
	});

	QUnit.module("other", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("Label", function(assert) {
		oGroup.setLabel("Label");

		assert.equal(oGroup.getLabel(), "Label", "Label is returned");
		assert.equal(oGroup.getProperty("label"), "Label", "Label is stored in property");
		assert.equal(oGroup.getTitle(), "Label", "Label stored as Title");

		var oTitle = new Title({text: "Title"}); // unsupported case -> check that not updated.
		oGroup.setTitle(oTitle);
		oGroup.setLabel("Label2");
		assert.equal(oGroup.getLabel(), "Label2", "Label is returned");
		assert.equal(oGroup.getProperty("label"), "Label2", "Label is stored in property");
		assert.equal(oGroup.getTitle(), oTitle, "Label not stored as Title");
	});

	QUnit.test("setUseHorizontalLayout", function(assert) {
		var oGroupElement1 = new GroupElement();
		var oGroupElement2 = new GroupElement();
		var oGroupElement3 = new GroupElement();
		oGroup.addGroupElement(oGroupElement1);
		sinon.spy(oGroup, "_updateLayoutData");

		oGroup.setUseHorizontalLayout(true);
		assert.ok(oGroup.getUseHorizontalLayout(), "UseHorizontalLayout set on Group");
		assert.ok(oGroupElement1.getUseHorizontalLayout(), "UseHorizontalLayout set on GroupElement1");
		assert.ok(oGroup._updateLayoutData.calledOnce, "LayoutData on Group updated");

		oGroup.addGroupElement(oGroupElement2);
		oGroup.insertGroupElement(oGroupElement3, 0);
		assert.ok(oGroupElement2.getUseHorizontalLayout(), "UseHorizontalLayout set on GroupElement2");
		assert.ok(oGroupElement3.getUseHorizontalLayout(), "UseHorizontalLayout set on GroupElement3");

		oGroup.setUseHorizontalLayout(false);
		assert.notOk(oGroup.getUseHorizontalLayout(), "UseHorizontalLayout not set on Group");
		assert.notOk(oGroupElement1.getUseHorizontalLayout(), "UseHorizontalLayout not set on GroupElement1");
		assert.notOk(oGroupElement2.getUseHorizontalLayout(), "UseHorizontalLayout not set on GroupElement2");
		assert.notOk(oGroupElement3.getUseHorizontalLayout(), "UseHorizontalLayout not set on GroupElement3");
		assert.ok(oGroup._updateLayoutData.calledTwice, "LayoutData on Group updated");

		oGroup.setUseHorizontalLayout(false);
		assert.ok(oGroup._updateLayoutData.calledTwice, "LayoutData on Group not updated if set to same value");
	});

	QUnit.test("setHorizontalLayoutGroupElementMinWidth", function(assert) {
		var oGroupElement1 = new GroupElement();
		var oGroupElement2 = new GroupElement();
		var oGroupElement3 = new GroupElement();
		oGroup.addGroupElement(oGroupElement1);

		oGroup.setHorizontalLayoutGroupElementMinWidth(123);
		assert.equal(oGroup.getHorizontalLayoutGroupElementMinWidth(), 123, "HorizontalLayoutGroupElementMinWidth set on Group");
		assert.equal(oGroupElement1.getHorizontalLayoutGroupElementMinWidth(), 123, "HorizontalLayoutGroupElementMinWidth set on GroupElement1");

		oGroup.addGroupElement(oGroupElement2);
		oGroup.insertGroupElement(oGroupElement3, 0);
		assert.equal(oGroupElement2.getHorizontalLayoutGroupElementMinWidth(), 123, "HorizontalLayoutGroupElementMinWidth set on GroupElement2");
		assert.equal(oGroupElement3.getHorizontalLayoutGroupElementMinWidth(), 123, "HorizontalLayoutGroupElementMinWidth set on GroupElement3");

		sinon.spy(oGroupElement1, "setHorizontalLayoutGroupElementMinWidth");
		oGroup.setHorizontalLayoutGroupElementMinWidth(123);
		assert.notOk(oGroupElement1.setHorizontalLayoutGroupElementMinWidth.called, "GroupElement not updated if set to same value");
	});

	QUnit.test("setEditMode", function(assert) {
		var oGroupElement1 = new GroupElement();
		var oGroupElement2 = new GroupElement();
		var oGroupElement3 = new GroupElement();
		sinon.spy(oGroupElement1, "_setEditable");
		sinon.spy(oGroupElement2, "_setEditable");
		sinon.spy(oGroupElement3, "_setEditable");

		oGroup.addGroupElement(oGroupElement1);
		oGroup.setEditMode(true);
		oGroup.addGroupElement(oGroupElement2);
		oGroup.insertGroupElement(oGroupElement3, 0);

		assert.ok(oGroupElement1._setEditable.called, "_setEditable called on GroupElement1");
		assert.ok(oGroupElement1._setEditable.calledWith(true), "_setEditable called on GroupElement1 with \"true\"");
		assert.ok(oGroupElement2._setEditable.calledWith(true), "_setEditable not called on GroupElement2");
		assert.ok(oGroupElement3._setEditable.calledWith(true), "_setEditable not called on GroupElement3");
	});

	QUnit.test("Hide group when all group elements hidden", function(assert) {
		var oField1 = new SmartField("S1"); // to have visible content in GroupElement
		var oField2 = new SmartField("S2");
		var oGroupElement1 = new GroupElement({elements: [oField1]});
		var oGroupElement2 = new GroupElement({elements: [oField2]});
		var bVisibleChanged = false;

		oGroup.attachEvent("_visibleChanged", function(oEvent) {bVisibleChanged = true;});

		assert.notOk(oGroup.isVisible(), "Group not visible as no GroupElements");

		oGroup.addGroupElement(oGroupElement1);
		oGroup.addGroupElement(oGroupElement2);

		sinon.spy(oGroup, "_updateLineBreaks");

		assert.ok(oGroup.isVisible(), "Group now visible");
		assert.ok(bVisibleChanged, "_visibleChanged event fired");
		bVisibleChanged = false;

		oGroupElement1.setVisible(false);
		assert.ok(oGroup.isVisible(), "Group still visible");
		assert.notOk(bVisibleChanged, "_visibleChanged event not fired");
		bVisibleChanged = false;

		oField2.setVisible(false);
		assert.notOk(oGroup.isVisible(), "Group hidden");
		assert.ok(oGroup.getVisible(), "Group visible property not changed");
		assert.ok(oGroup._updateLineBreaks.called, "Group linebreaks updated if field changed");
		assert.ok(bVisibleChanged, "_visibleChanged event fired");
		bVisibleChanged = false;

		oField2.setVisible(true);
		assert.ok(oGroup.isVisible(), "Group visible again");
		assert.ok(bVisibleChanged, "_visibleChanged event fired");
		bVisibleChanged = false;

		oGroupElement2.setVisible(false);
		assert.notOk(oGroup.isVisible(), "Group hidden");
		assert.ok(bVisibleChanged, "_visibleChanged event fired");
		bVisibleChanged = false;

		oGroupElement2.setVisible(true);
		assert.ok(oGroup.isVisible(), "Group visible again");
		assert.ok(bVisibleChanged, "_visibleChanged event fired");
		bVisibleChanged = false;

		oGroupElement2.setVisible(false);
		bVisibleChanged = false;
		oGroup.setVisible(true);
		assert.ok(oGroup.isVisible(), "Group can set to be visible even if all GroupElements are invisible.");
		assert.ok(bVisibleChanged, "_visibleChanged event fired");
		bVisibleChanged = false;
	});

	QUnit.test("Layout", function(assert) {
		var oGridData = new GridData("GD1");
		oGroup.setLayout(oGridData);

		assert.equal(oGroup.getLayout(), oGridData, "GridData is returned");

		oGroup.destroyLayout();
		assert.notOk(oGroup.getLayout(), "no GridData is returned");
		assert.notOk(sap.ui.getCore().byId("GD1"), "GridData destroyed");
	});

	QUnit.test("clone", function(assert) {
		oGroup.setLabel("Label");
		var oField1 = new SmartField("S1"); // to have visible content in GroupElement
		var oField2 = new SmartField("S2");
		var oGroupElement1 = new GroupElement("GE1", {elements: [oField1]});
		var oGroupElement2 = new GroupElement("GE2", {elements: [oField2]});
		var oCustomData = new CustomData("CD1", {key: "KEY", value: "VALUE"});
		oGroup.addCustomData(oCustomData);
		oGroup.addGroupElement(oGroupElement1);
		oGroup.addGroupElement(oGroupElement2);

		var oClone = oGroup.clone("myClone");

		// check if original is still OK
		var aGroupElements = oGroup.getGroupElements();
		assert.equal(aGroupElements.length, 2, "Original: has 2 GroupElements");
		assert.equal(aGroupElements[0].getId(), "GE1", "Original: first element");
		assert.equal(aGroupElements[1].getId(), "GE2", "Original: second element");
		assert.equal(oGroup.getLabel(), "Label", "Original: Label");
		var aCustomData = oGroup.getCustomData();
		assert.equal(aCustomData.length, 1, "Original: Only one CustomData on Group");
		assert.equal(aCustomData[0], oCustomData, "Original: CustomData");
		aCustomData = oGroupElement1.getCustomData();
		assert.equal(aCustomData.length, 1, "Original: Only one CustomData on GroupElement1");
		assert.ok(aCustomData[0]._bFromGroup, "Original: CustomData on GroupElement created by Group");
		assert.ok(oGroup.isVisible(), "Original: Group is visible");
		oGroupElement1.setVisible(false);
		oGroupElement2.setVisible(false);
		assert.notOk(oGroup.isVisible(), "Original: GroupElement is invisible after GroupElements are set to invisible");

		// check clone
		aGroupElements = oClone.getGroupElements();
		assert.equal(aGroupElements.length, 2, "Clone: has 2 GroupElements");
		assert.equal(aGroupElements[0].getId(), "GE1-myClone", "Clone: first element");
		assert.equal(aGroupElements[1].getId(), "GE2-myClone", "Clone: second element");
		assert.equal(oClone.getLabel(), "Label", "Clone: Label");
		assert.equal(oClone.getTitle(), "Label", "Clone: Title");
		aCustomData = oClone.getCustomData();
		assert.equal(aCustomData.length, 1, "Clone: Only one CustomData on Group");
		assert.equal(aCustomData[0].getId(), "CD1-myClone", "Clone: CustomData");
		aCustomData = aGroupElements[0].getCustomData();
		assert.equal(aCustomData.length, 1, "Clone: Only one CustomData on GroupElement1");
		assert.ok(aCustomData[0]._bFromGroup, "Clone: CustomData on GroupElement created by Group");
		assert.ok(oClone.isVisible(), "Clone: Group is visible");
		aGroupElements[0].setVisible(false);
		aGroupElements[1].setVisible(false);
		assert.notOk(oClone.isVisible(), "Clone: GroupElement is invisible after GroupElements are set to invisible");

		oClone.destroy();
	});

});
