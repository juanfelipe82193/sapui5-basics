/* global QUnit, sinon */

sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"jquery.sap.global",
	"sap/ui/comp/library",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/comp/smartform/Layout",
	"sap/ui/comp/smartform/ColumnLayout",
	"sap/ui/layout/form/Form",
	"sap/ui/layout/form/ResponsiveGridLayout",
	"sap/ui/layout/form/ResponsiveLayout",
	"sap/ui/layout/form/ColumnLayout",
	"sap/ui/core/CustomData",
	"sap/m/Title",
	"sap/m/Toolbar", // in SmartForm OverflowToolbar is required
	"sap/m/ToolbarSpacer",
	"sap/m/ToolbarSeparator",
	"sap/m/Button",
	"sap/ui/comp/smartfield/SmartField",
	"sap/m/Label",
	"sap/m/Input",
	"sap/m/VBox",
	"sap/m/Panel",
	"sap/m/MessageBox",
	"sap/ui/core/VariantLayoutData",
	"sap/ui/layout/GridData",
	"sap/ui/layout/ResponsiveFlowLayoutData",
	"sap/m/FlexItemData",
	"sap/ui/model/json/JSONModel"
	],
	function(
		qutils,
		jQuery,
		CompLib,
		SmartForm,
		Group,
		GroupElement,
		Layout,
		ColumnLayout,
		Form,
		ResponsiveGridLayout,
		ResponsiveLayout,
		FormColumnLayout,
		CustomData,
		Title,
		Toolbar,
		ToolbarSpacer,
		ToolbarSeparator,
		Button,
		SmartField,
		Label,
		Input,
		VBox,
		Panel,
		MessageBox,
		VariantLayoutData,
		GridData,
		ResponsiveFlowLayoutData,
		FlexItemData,
		JSONModel
	) {
	"use strict";

	var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
	var oSmartForm;
	var oSmartForm2;

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
		oSmartForm = new SmartForm("SF1");
	}

	function afterTest() {
		oSmartForm.destroy();
		oSmartForm = undefined;
		if (oSmartForm2) {
			oSmartForm2.destroy();
			oSmartForm2 = undefined;
		}
		aAsyncModules = [];
		sap.ui.require.restore();
	}

	QUnit.module("Instance", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(oSmartForm, "SmartForm is created");
	});

	function asyncResponsiveGridLayoutTest(assert, fnTest) {
		// also check for requirements of Group and GroupElement
		var oForm = oSmartForm.getAggregation("content");
		var oFormLayout = oForm.getLayout();
		if (sap.ui.require("sap/ui/layout/form/ResponsiveGridLayout") && oFormLayout instanceof ResponsiveGridLayout) {
			fnTest(assert);
		} else {
			var fnDone = assert.async();
			sap.ui.require(["sap/ui/layout/form/ResponsiveGridLayout"], function() {
				setTimeout( function(){
					fnTest(assert);
					fnDone();
				}, 0);
			});
		}
	}

	function internalForm(assert) {
		var oForm = oSmartForm.getAggregation("content");
		assert.ok(oForm && oForm instanceof Form, "internal Form created and assigned");
		var oFormLayout = oForm.getLayout();
		assert.ok(oFormLayout && oFormLayout instanceof ResponsiveGridLayout, "ResponsiveGridLayout used as default");

		oForm = oSmartForm2.getAggregation("content");
		oFormLayout = oForm.getLayout();
		assert.ok(oFormLayout && oFormLayout instanceof ResponsiveGridLayout, "ResponsiveGridLayout used as default in second SmartForm");
	}

	QUnit.test("internal Form", function(assert) {
		aAsyncModules.push("sap/ui/layout/form/ResponsiveGridLayout"); // to force async. loading
		oSmartForm.placeAt("qunit-fixture");
		oSmartForm2 = new SmartForm("SF2");
		oSmartForm2.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges(); // as FormLayout is created only before rendering as not sure if Layout aggregation will be used or not
		asyncResponsiveGridLayoutTest(assert, internalForm);
	});

	QUnit.module("Toolbar", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	function asyncToolbarTest(assert, bTitle, bButton, fnTest) {
		if ((!bTitle || sap.ui.require("sap/m/Title")) && (!bButton || sap.ui.require("sap/m/Button"))
				&& sap.ui.require("sap/m/OverflowToolbar") && sap.ui.require("sap/m/ToolbarSpacer")
				&& sap.ui.require("sap/m/ToolbarSeparator") && oSmartForm.getAggregation("toolbar")) {
			fnTest(assert);
		} else {
			var fnDone = assert.async();
			var aModules = ["sap/m/OverflowToolbar", "sap/m/ToolbarSpacer", "sap/m/ToolbarSeparator"];
			if (bTitle) {
				aModules.push("sap/m/Title");
			}
			if (bButton) {
				aModules.push("sap/m/Button");
			}
			sap.ui.require(aModules, function() {
				var bNotDone = fnTest(assert, fnDone);
				if (!bNotDone) {
					fnDone();
				}
			});
		}
	}

	function checkButton(assert) {
		var oToolbar = oSmartForm.getAggregation("toolbar");

		assert.ok(oSmartForm.getCheckButton(), "getCheckButton");
		assert.ok(oToolbar, "Toolbar created");

		var aContent = oToolbar ? oToolbar.getContent() : [];
		var sToolbarId = oToolbar ? oToolbar.getId() : null;
		assert.equal(aContent.length, 2, "Toolbar has 2 items");
		assert.ok(aContent[0] instanceof ToolbarSpacer, "first item is ToolbarSpacer");
		assert.ok(aContent[1] instanceof Button, "second item is Button");
		assert.equal(aContent[1].getText(), oRb.getText("SMART_FORM_CHECK"), "Text of button");
		var sSpacerId = aContent[0].getId();
		var sButtonId = aContent[1].getId();

		oSmartForm.setCheckButton(false);
		oToolbar = oSmartForm.getAggregation("toolbar");
		assert.notOk(oSmartForm.getCheckButton(), "getCheckButton");
		assert.notOk(oToolbar, "Toolbar removed");
		assert.notOk(sap.ui.getCore().byId(sToolbarId), "Toolbar destroyed");
		assert.notOk(sap.ui.getCore().byId(sSpacerId), "ToolbarSpacer destroyed");
		assert.notOk(sap.ui.getCore().byId(sButtonId), "Button destroyed");

		oSmartForm.setCheckButton(true);
		oToolbar = oSmartForm.getAggregation("toolbar");
		aContent = oToolbar ? oToolbar.getContent() : [];
		assert.ok(oToolbar, "Toolbar created");
		assert.equal(aContent.length, 2, "Toolbar has 2 items");

		oSmartForm.setEditable(false);
		oToolbar = oSmartForm.getAggregation("toolbar");
		assert.notOk(oToolbar, "Toolbar removed if not editable");

		oSmartForm.setEditable(true);
		oToolbar = oSmartForm.getAggregation("toolbar");
		aContent = oToolbar ? oToolbar.getContent() : [];
		assert.ok(oToolbar, "Toolbar created");
		assert.equal(aContent.length, 2, "Toolbar has 2 items");
	}

	QUnit.test("checkButton", function(assert) {
		aAsyncModules.push("sap/m/OverflowToolbar"); // to force async. loading
		oSmartForm.setEditable(true);
		oSmartForm.setCheckButton(true);
		asyncToolbarTest(assert, false, true, checkButton);
	});

	function checkButtonCustomToolbar(assert) {
		var oCustomToolbar = sap.ui.getCore().byId("TB1");
		var oToolbar = oSmartForm.getAggregation("toolbar");
		assert.notOk(oToolbar, "no Toolbar created");

		var aContent = oCustomToolbar.getContent();
		assert.equal(aContent.length, 5, "Toolbar has 5 items");
		assert.equal(aContent[0].getId(), "B1", "first item is button");
		assert.equal(aContent[1].getId(), "B2", "second item is button");
		assert.ok(aContent[2] instanceof ToolbarSpacer, "3. item is ToolbarSpacer");
		assert.ok(aContent[3] instanceof ToolbarSeparator, "4. item is ToolbarSpeparator");
		assert.ok(aContent[4] instanceof Button, "5. item is Button");
		var sSpacerId = aContent[2].getId();
		var sSeparatorId = aContent[3].getId();
		var sButtonId = aContent[4].getId();

		oSmartForm.setCheckButton(false);
		aContent = oCustomToolbar.getContent();
		assert.equal(aContent.length, 2, "CustomToolbar has 2 items");
		assert.equal(aContent[0].getId(), "B1", "first item is button");
		assert.equal(aContent[1].getId(), "B2", "second item is button");
		assert.notOk(sap.ui.getCore().byId(sSpacerId), "ToolbarSpacer destroyed");
		assert.notOk(sap.ui.getCore().byId(sSeparatorId), "ToolbarSeparator destroyed");
		assert.notOk(sap.ui.getCore().byId(sButtonId), "Button destroyed");
	}

	QUnit.test("checkButton with cutomToolbar", function(assert) {
		var oCustomToolbar = new Toolbar("TB1", {
			content: [new Button("B1", {text: "Button 1"}), new Button("B2", {text: "Button 2"})]
		});
		oSmartForm.setCustomToolbar(oCustomToolbar);
		oSmartForm.setEditable(true);
		oSmartForm.setCheckButton(true);
		asyncToolbarTest(assert, false, true, checkButtonCustomToolbar);
	});

	function editTogglable(assert) {
		var oToolbar = oSmartForm.getAggregation("toolbar");

		assert.ok(oSmartForm.getEditTogglable(), "EditTogglable");
		assert.ok(oToolbar, "Toolbar created");

		var aContent = oToolbar ? oToolbar.getContent() : [];
		var sToolbarId = oToolbar ? oToolbar.getId() : null;
		assert.equal(aContent.length, 2, "Toolbar has 2 items");
		assert.ok(aContent[0] instanceof ToolbarSpacer, "first item is ToolbarSpacer");
		assert.ok(aContent[1] instanceof Button, "second item is Button");
		assert.equal(aContent[1].getIcon(), "sap-icon://edit", "Edit icon on button");
		var sSpacerId = aContent[0].getId();
		var sButtonId = aContent[1].getId();

		oSmartForm.setEditTogglable(false);
		oToolbar = oSmartForm.getAggregation("toolbar");
		assert.notOk(oSmartForm.getEditTogglable(), "getEditTogglable");
		assert.notOk(oToolbar, "Toolbar removed");
		assert.notOk(sap.ui.getCore().byId(sToolbarId), "Toolbar destroyed");
		assert.notOk(sap.ui.getCore().byId(sSpacerId), "ToolbarSpacer destroyed");
		assert.notOk(sap.ui.getCore().byId(sButtonId), "Button destroyed");
	}

	QUnit.test("editTogglable", function(assert) {
		aAsyncModules.push("sap/m/Button"); // to force async. loading
		oSmartForm.setEditTogglable(true);
		asyncToolbarTest(assert, false, true, editTogglable);
	});

	function editTogglableCustomToolbar(assert) {
		var oCustomToolbar = sap.ui.getCore().byId("TB1");
		var oToolbar = oSmartForm.getAggregation("toolbar");
		assert.notOk(oToolbar, "no Toolbar created");

		var aContent = oCustomToolbar.getContent();
		assert.equal(aContent.length, 5, "Toolbar has 5 items");
		assert.equal(aContent[0].getId(), "B1", "first item is button");
		assert.equal(aContent[1].getId(), "B2", "second item is button");
		assert.equal(aContent[2].getId(), "Space1" ,"3. item is given ToolbarSpacer");
		assert.ok(aContent[3] instanceof ToolbarSeparator, "4. item is ToolbarSpeparator");
		assert.ok(aContent[4] instanceof Button, "5. item is Button");
		var sSpacerId = aContent[2].getId();
		var sSeparatorId = aContent[3].getId();
		var sButtonId = aContent[4].getId();

		oSmartForm.setEditTogglable(false);
		aContent = oCustomToolbar.getContent();
		assert.equal(aContent.length, 3, "CustomToolbar has 2 items");
		assert.equal(aContent[0].getId(), "B1", "first item is button");
		assert.equal(aContent[1].getId(), "B2", "second item is button");
		assert.ok(sap.ui.getCore().byId(sSpacerId), "ToolbarSpacer not destroyed");
		assert.notOk(sap.ui.getCore().byId(sSeparatorId), "ToolbarSeparator destroyed");
		assert.notOk(sap.ui.getCore().byId(sButtonId), "Button destroyed");
	}

	QUnit.test("editTogglable with cutomToolbar", function(assert) {
		var oCustomToolbar = new Toolbar("TB1", {
			content: [new Button("B1", {text: "Button 1"}),
			          new Button("B2", {text: "Button 2"}),
			          new ToolbarSpacer("Space1")]
		});
		oSmartForm.setCustomToolbar(oCustomToolbar);
		oSmartForm.setEditTogglable(true);
		asyncToolbarTest(assert, false, true, editTogglableCustomToolbar);
	});

	QUnit.test("Title", function(assert) {
		oSmartForm.setTitle("Title");
		var oForm = oSmartForm.getAggregation("content");
		var oToolbar = oSmartForm.getAggregation("toolbar");

		assert.equal(oForm.getTitle(), "Title", "Form uses Title");
		assert.equal(oSmartForm.getTitle(), "Title", "getTitle: SmartForm returns Title");
		assert.notOk(oToolbar, "no Toolbar created");
		assert.notOk(oForm.getToolbar(), "no Toolbar on Form");

		oSmartForm.setTitle();
		assert.notOk(oSmartForm.getTitle(), "getTitle: SmartForm returns no Title");
	});

	function customToolbarTitle(assert) {
		var oCustomToolbar = sap.ui.getCore().byId("TB1");
		var oToolbar = oSmartForm.getAggregation("toolbar");
		assert.notOk(oToolbar, "no Toolbar created");
		var oForm = oSmartForm.getAggregation("content");
		assert.equal(oCustomToolbar, oForm.getToolbar(), "CustomToolbar rendered from Form");

		var aContent = oCustomToolbar.getContent();
		assert.equal(aContent.length, 3, "CustomToolbar has 3 items");
		assert.ok(aContent[0] instanceof Title, "first item is title");
		assert.equal(aContent[0].getText(), "Title", "Title text");
		var sTitleId = aContent[0].getId();

		oSmartForm.setTitle();
		aContent = oCustomToolbar.getContent();
		assert.equal(aContent.length, 2, "CustomToolbar has 2 items");
		assert.equal(aContent[0].getId(), "B1", "first item is button");
		assert.notOk(sap.ui.getCore().byId(sTitleId), "Title destroyed");
	}

	QUnit.test("Title with customToolbar", function(assert) {
		aAsyncModules.push("sap/m/Title"); // to force async. loading
		var oCustomToolbar = new Toolbar("TB1", {
			content: [new Button("B1", {text: "Button 1"}), new Button("B2", {text: "Button 2"})]
		});
		oSmartForm.setCustomToolbar(oCustomToolbar);
		oSmartForm.setTitle("Title");
		asyncToolbarTest(assert, true, false, customToolbarTitle);
	});

	function orderOfToolbarContent(assert) {
		var oForm = oSmartForm.getAggregation("content");
		var oToolbar = oSmartForm.getAggregation("toolbar");
		var aContent = oToolbar ? oToolbar.getContent() : [];
		assert.equal(aContent.length, 4, "Toolbar has 4 items");
		assert.ok(aContent[0] instanceof Title, "first item is title");
		assert.ok(aContent[1] instanceof ToolbarSpacer, "second item is ToolbarSpacer");
		assert.ok(aContent[2] instanceof Button, "3. item is Button");
		assert.equal(aContent[2].getIcon(), "sap-icon://display", "Edit icon on button");
		assert.ok(aContent[3] instanceof Button, "4. item is Button");
		assert.equal(aContent[3].getText(), oRb.getText("SMART_FORM_CHECK"), "Text of button");
		assert.notOk(oForm.getTitle(), "Form Title not used");

		var oCustomToolbar = new Toolbar("TB1", {
			content: [new Button("B1", {text: "Button 1"}), new Button("B2", {text: "Button 2"})]
		});
		oSmartForm.setCustomToolbar(oCustomToolbar);
		oToolbar = oSmartForm.getAggregation("toolbar");
		assert.notOk(oToolbar, "Toolbar removed");
		aContent = oCustomToolbar.getContent();
		assert.equal(aContent.length, 7, "CustomToolbar has 7 items");
		assert.ok(aContent[0] instanceof Title, "first item is title");
		assert.equal(aContent[1].getId(), "B1", "second item is button");
		assert.equal(aContent[2].getId(), "B2", "3. item is button");
		assert.ok(aContent[3] instanceof ToolbarSpacer, "4. item is ToolbarSpacer");
		assert.ok(aContent[4] instanceof ToolbarSeparator, "5. item is ToolbarSpeparator");
		assert.ok(aContent[5] instanceof Button, "6. item is Button");
		assert.equal(aContent[5].getIcon(), "sap-icon://display", "Edit icon on button");
		assert.ok(aContent[6] instanceof Button, "7. item is Button");
		assert.equal(aContent[6].getText(), oRb.getText("SMART_FORM_CHECK"), "Text of button");

		oSmartForm.setCustomToolbar();
		aContent = oCustomToolbar.getContent();
		assert.equal(aContent.length, 2, "CustomToolbar has 7 items");
		assert.equal(aContent[0].getId(), "B1", "first item is button");
		assert.equal(aContent[1].getId(), "B2", "second item is button");

		oToolbar = oSmartForm.getAggregation("toolbar");
		aContent = oToolbar ? oToolbar.getContent() : [];
		assert.equal(aContent.length, 4, "Toolbar has 4 items");
		assert.ok(aContent[0] instanceof Title, "first item is title");
		assert.ok(aContent[1] instanceof ToolbarSpacer, "second item is ToolbarSpacer");
		assert.ok(aContent[2] instanceof Button, "3. item is Button");
		assert.equal(aContent[2].getIcon(), "sap-icon://display", "Edit icon on button");
		assert.ok(aContent[3] instanceof Button, "4. item is Button");
		assert.equal(aContent[3].getText(), oRb.getText("SMART_FORM_CHECK"), "Text of button");

		oSmartForm.setCustomToolbar(oCustomToolbar);
		oSmartForm.destroyCustomToolbar();
		oToolbar = oSmartForm.getAggregation("toolbar");
		aContent = oToolbar ? oToolbar.getContent() : [];
		assert.equal(aContent.length, 4, "Toolbar has 4 items");

		oSmartForm.setCheckButton(false);
		oSmartForm.setEditTogglable(false);
		oToolbar = oSmartForm.getAggregation("toolbar");
		assert.notOk(oToolbar, "no Toolbar used");
		assert.equal(oForm.getTitle(), "Title", "Form title used.");
	}

	QUnit.test("order of toolbar content", function(assert) {
		oSmartForm.setEditable(true);
		oSmartForm.setCheckButton(true);
		oSmartForm.setEditTogglable(true);
		oSmartForm.setTitle("Title");

		asyncToolbarTest(assert, true, true, orderOfToolbarContent);
	});

	QUnit.module("Groups", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("addGroup", function(assert) {
		var oGroup = new Group();
		oSmartForm.addGroup(oGroup);

		var oForm = oSmartForm.getAggregation("content");
		var aFormContainers = oForm.getFormContainers();
		assert.equal(aFormContainers.length, 1, "Group is added to \"formContainers\" aggregation of internal Form");
		aFormContainers = oGroup.getAggregation("groups", []);
		assert.equal(aFormContainers.length, 0, "Group is not added to \"group\" aggregation");

		oSmartForm.addGroup();
		aFormContainers = oForm.getFormContainers();
		assert.equal(aFormContainers.length, 1, "Nothing is added to \"formContainers\" aggregation of internal Form");
	});

	QUnit.test("getGroups", function(assert) {
		var oGroup1 = new Group();
		var oGroup2 = new Group();

		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);
		var aGroups = oSmartForm.getGroups();
		assert.equal(aGroups.length, 2, "added Groups are returned");
	});

	QUnit.test("indexOfGroup", function(assert) {
		var oGroup1 = new Group();
		var oGroup2 = new Group();

		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);

		var iIndex = oSmartForm.indexOfGroup(oGroup1);
		assert.equal(iIndex, 0, "Group1 index");

		iIndex = oSmartForm.indexOfGroup(oGroup2);
		assert.equal(iIndex, 1, "Group2 index");
	});

	QUnit.test("insertGroup", function(assert) {
		var oGroup1 = new Group("GE1");
		var oGroup2 = new Group("GE2");

		oSmartForm.insertGroup(oGroup1, 0);
		oSmartForm.insertGroup(oGroup2, 0);
		oSmartForm.insertGroup(null, 0);
		var aGroups = oSmartForm.getGroups();
		assert.equal(aGroups.length, 2, "Groups are inserted");
		assert.equal(aGroups[0].getId(), "GE2", "Group2 is first Group");
		assert.equal(aGroups[1].getId(), "GE1", "Group1 is second Group");
		var oForm = oSmartForm.getAggregation("content");
		var aFormContainers = oForm.getFormContainers();
		assert.equal(aFormContainers.length, 2, "Groups are inserted to Form");
	});

	QUnit.test("removeGroup", function(assert) {
		var oGroup1 = new Group("GE1");
		var oGroup2 = new Group("GE2");
		var oGroup3 = new Group("GE3");

		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);
		oSmartForm.addGroup(oGroup3);

		var oRemoved = oSmartForm.removeGroup(oGroup1);
		assert.equal(oRemoved, oGroup1, "Group1 removed");

		oRemoved = oSmartForm.removeGroup(0);
		assert.equal(oRemoved, oGroup2, "Group2 removed");

		oRemoved = oSmartForm.removeGroup("GE3");
		assert.equal(oRemoved, oGroup3, "Group3 removed");
		assert.equal(oSmartForm.getGroups(), 0, "All Groups removed");

		var oForm = oSmartForm.getAggregation("content");
		var aFormContainers = oForm.getFormContainers();
		assert.equal(aFormContainers.length, 0, "Groups are removed from Form");

		oGroup1.destroy();
		oGroup2.destroy();
		oGroup3.destroy();
	});

	QUnit.test("removeAllGroups", function(assert) {
		var oGroup1 = new Group("GE1");
		var oGroup2 = new Group("GE2");

		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);

		var aRemoved = oSmartForm.removeAllGroups();
		assert.deepEqual(aRemoved, [oGroup1, oGroup2], "All Groups removed");
		assert.equal(oSmartForm.getGroups(), 0, "All Groups removed");

		var oForm = oSmartForm.getAggregation("content");
		var aFormContainers = oForm.getFormContainers();
		assert.equal(aFormContainers.length, 0, "Groups are removed from Form");

		oGroup1.destroy();
		oGroup2.destroy();
	});

	QUnit.test("destroyGroups", function(assert) {
		var oGroup1 = new Group("GE1");
		var oGroup2 = new Group("GE2");

		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);

		oSmartForm.destroyGroups();
		assert.equal(oSmartForm.getGroups(), 0, "All Groups removed");
		assert.notOk(sap.ui.getCore().byId("GE1"), "Group1 is destroyed");
		assert.notOk(sap.ui.getCore().byId("GE2"), "Group2 is destroyed");

		var oForm = oSmartForm.getAggregation("content");
		var aFormContainers = oForm.getFormContainers();
		assert.equal(aFormContainers.length, 0, "Groups are removed from Form");
	});

	QUnit.module("CustomData", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("addCustomData", function(assert) {
		var oGroup1 = new Group();
		var oGroup2 = new Group();
		var oGroup3 = new Group();
		oSmartForm.addGroup(oGroup1);

		var oCustomData = new CustomData({key: "KEY", value: "VALUE"});
		var oCustomData2 = new CustomData({key: "sap.ui.fl:AppliedChanges", value: "VALUE"});
		var oCustomData3 = new CustomData({key: "sap-ui-custom-settings", value: "VALUE"});
		oSmartForm.addCustomData(oCustomData);
		oSmartForm.addCustomData(oCustomData2); // must not be inherited
		oSmartForm.addCustomData(oCustomData3); // must not be inherited
		oSmartForm.addGroup(oGroup2);
		oSmartForm.insertGroup(oGroup3, 0);

		var aCustomData = oSmartForm.getCustomData();
		assert.equal(aCustomData.length, 3, "CustomData set on SmartForm");
		assert.equal(aCustomData[0], oCustomData, "CustomData set on SmartForm");
		assert.equal(aCustomData[1], oCustomData2, "CustomData set on SmartForm");
		assert.equal(aCustomData[2], oCustomData3, "CustomData set on SmartForm");

		aCustomData = oGroup1.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData set on Group1");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on Group1 has same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on Group1 has same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CstomData on Group1");

		aCustomData = oGroup2.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData set on Group2");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on Group2 has same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on Group2 has same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CstomData on Group2");

		aCustomData = oGroup3.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData set on Group3");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on Group3 has same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on Group3 has same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CustomData on Group3");

		oSmartForm.removeGroup(oGroup2);
		aCustomData = oGroup2.getCustomData();
		assert.equal(aCustomData.length, 0, "no CustomData set on Group2 after remove");
		oGroup2.destroy();

		oSmartForm.addCustomData();
		aCustomData = oSmartForm.getCustomData();
		assert.equal(aCustomData.length, 3, "no new CustomData added to SmartForm");
	});

	QUnit.test("insertCustomData", function(assert) {
		var oGroup1 = new Group();
		oSmartForm.addGroup(oGroup1);

		var oCustomData = new CustomData({key: "KEY", value: "VALUE"});
		var oCustomData2 = new CustomData({key: "sap.ui.fl.appliedChanges", value: "VALUE"});
		var oCustomData3 = new CustomData({key: "sap-ui-custom-settings", value: "VALUE"});
		oSmartForm.insertCustomData(oCustomData, 0);
		oSmartForm.insertCustomData(oCustomData2, 0); // must not be inherited
		oSmartForm.insertCustomData(oCustomData3, 1); // must not be inherited

		var aCustomData = oSmartForm.getCustomData();
		assert.equal(aCustomData.length, 3, "CustomData set on SmartForm");
		assert.equal(aCustomData[0], oCustomData2, "CustomData set on SmartForm");
		assert.equal(aCustomData[1], oCustomData3, "CustomData set on SmartForm");
		assert.equal(aCustomData[2], oCustomData, "CustomData set on SmartForm");

		aCustomData = oGroup1.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData set on Group1");
		assert.equal(aCustomData[0].getKey(), oCustomData.getKey(), "CustomData on Group1 has same key");
		assert.equal(aCustomData[0].getValue(), oCustomData.getValue(), "CustomData on Group1 has same value");
		assert.ok(aCustomData[0].getId() != oCustomData.getId(), "Different instance of CstomData on Group1");

		oSmartForm.insertCustomData();
		aCustomData = oSmartForm.getCustomData();
		assert.equal(aCustomData.length, 3, "no new CustomData inserted into SmartForm");
	});

	QUnit.test("removeCustomData", function(assert) {
		var oGroup1 = new Group({
			customData: new CustomData({key: "KEY0", value: "VALUE0"})
		});
		var oCustomData1 = new CustomData({key: "KEY1", value: "VALUE1"});
		var oCustomData2 = new CustomData({key: "KEY2", value: "VALUE2"});

		oSmartForm.addCustomData(oCustomData1);
		oSmartForm.addGroup(oGroup1);
		oSmartForm.addCustomData(oCustomData2);
		oSmartForm.removeCustomData(1);

		var aCustomData = oGroup1.getCustomData();
		assert.equal(aCustomData.length, 2, "CustomData removed from Group");
		assert.equal(aCustomData[0].getKey(), "KEY0", "first customData left");
		assert.equal(aCustomData[1].getKey(), "KEY1", "last customData left");

		oCustomData1.destroy();
	});

	QUnit.test("removeAllCustomData", function(assert) {
		var oGroup1 = new Group({
			customData: new CustomData({key: "KEY0", value: "VALUE0"})
		});
		var oCustomData1 = new CustomData({key: "KEY1", value: "VALUE1"});
		var oCustomData2 = new CustomData({key: "KEY2", value: "VALUE2"});

		oSmartForm.addCustomData(oCustomData1);
		oSmartForm.addGroup(oGroup1);
		oSmartForm.addCustomData(oCustomData2);
		var aCustomData = oSmartForm.removeAllCustomData(1);

		assert.equal(aCustomData.length, 2, "two CustomData removed from Group");
		aCustomData = oGroup1.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData removed from Group");
		assert.equal(aCustomData[0].getKey(), "KEY0", "first customData left");

		oCustomData1.destroy();
		oCustomData2.destroy();
	});

	QUnit.test("destroyCustomData", function(assert) {
		var oGroup1 = new Group({
			customData: new CustomData({key: "KEY0", value: "VALUE0"})
		});
		var oCustomData1 = new CustomData({key: "KEY1", value: "VALUE1"});
		var oCustomData2 = new CustomData({key: "KEY2", value: "VALUE2"});

		oSmartForm.addCustomData(oCustomData1);
		oSmartForm.addGroup(oGroup1);
		oSmartForm.addCustomData(oCustomData2);
		oSmartForm.destroyCustomData(1);

		var aCustomData = oGroup1.getCustomData();
		assert.equal(aCustomData.length, 1, "CustomData removed from Group");
		assert.equal(aCustomData[0].getKey(), "KEY0", "first customData left");
		assert.notOk(sap.ui.getCore().byId("CD1"), "CustomData destroyed");
	});

	QUnit.module("Layout", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	// as ResponsiveGridLayout is loaded in the required section of this test, we don't neet to test async. in every case.

	QUnit.test("use Layout", function(assert) {
		var oLayout = new Layout("L1", {
			labelSpanXL: 7,
			labelSpanL: 6,
			labelSpanM: 5,
			labelSpanS: 4,
			emptySpanXL: 1,
			emptySpanL: 2,
			emptySpanM: 3,
			columnsXL: 4,
			columnsL: 2,
			columnsM: 1,
			singleGroupFullSize: false,
			breakpointXL: 1600,
			breakpointL: 1200,
			breakpointM: 800
		});
		oSmartForm.setLayout(oLayout);

		var oForm = oSmartForm.getAggregation("content");
		var oFormLayout = oForm.getLayout();
		assert.equal(oSmartForm.getLayout(), oLayout, "Layout assigned to SmartForm");
		assert.ok(oFormLayout && oFormLayout instanceof ResponsiveGridLayout, "ResponsiveGridLayout used as default");
		if (oFormLayout instanceof ResponsiveGridLayout) {
			// if wrong layout these checks will break anyway
			assert.equal(oFormLayout.getLabelSpanXL(), 7, "LabelSpanXL set on Forms Layout");
			assert.equal(oFormLayout.getLabelSpanL(), 6, "LabelSpanL set on Forms Layout");
			assert.equal(oFormLayout.getLabelSpanM(), 5, "LabelSpanM set on Forms Layout");
			assert.equal(oFormLayout.getLabelSpanS(), 4, "LabelSpanS set on Forms Layout");
			assert.equal(oFormLayout.getEmptySpanXL(), 1, "EmptySpanXL set on Forms Layout");
			assert.equal(oFormLayout.getEmptySpanL(), 2, "EmptySpanL set on Forms Layout");
			assert.equal(oFormLayout.getEmptySpanM(), 3, "EmptySpanM set on Forms Layout");
			assert.equal(oFormLayout.getColumnsXL(), 4, "ColumnsXL set on Forms Layout");
			assert.equal(oFormLayout.getColumnsL(), 2, "ColumnsL set on Forms Layout");
			assert.equal(oFormLayout.getColumnsM(), 1, "ColumnsM set on Forms Layout");
			assert.equal(oFormLayout.getSingleContainerFullSize(), false, "SingleContainerFullSize set on Forms Layout");
			assert.equal(oFormLayout.getBreakpointXL(), 1600, "BreakpointXL set on Forms Layout");
			assert.equal(oFormLayout.getBreakpointL(), 1200, "BreakpointL set on Forms Layout");
			assert.equal(oFormLayout.getBreakpointM(), 800, "BreakpointM set on Forms Layout");
		}

		oLayout.setSingleGroupFullSize(true);
		var oGroup1 = new Group({visible: true});
		var oGroup2 = new Group({visible: true});
		var oGroup3 = new Group({visible: true});
		var oGroup4 = new Group({visible: true});
		oSmartForm.addGroup(oGroup1);
		if (oFormLayout instanceof ResponsiveGridLayout) {
			assert.equal(oFormLayout.getSingleContainerFullSize(), true, "SingleContainerFullSize set on Forms Layout");
			assert.equal(oFormLayout.getColumnsXL(), 1, "ColumnsXL set on Forms Layout as only one group");
			assert.equal(oFormLayout.getColumnsL(), 1, "ColumnsL set on Forms Layout as only one group");
		}

		oSmartForm.addGroup(oGroup2);
		if (oFormLayout instanceof ResponsiveGridLayout) {
			assert.equal(oFormLayout.getColumnsXL(), 2, "ColumnsXL set on Forms Layout as only 2 groups");
			assert.equal(oFormLayout.getColumnsL(), 2, "ColumnsL set on Forms Layout as only 2 groups");
			oGroup2.setVisible(false);
			assert.equal(oFormLayout.getColumnsXL(), 1, "ColumnsXL set on Forms Layout as only one visible group");
			assert.equal(oFormLayout.getColumnsL(), 1, "ColumnsL set on Forms Layout as only one visible group");
			oGroup2.setVisible(true);
			assert.equal(oFormLayout.getColumnsXL(), 2, "ColumnsXL set on Forms Layout as only 2 groups");
			assert.equal(oFormLayout.getColumnsL(), 2, "ColumnsL set on Forms Layout as only 2 groups");
		}

		oSmartForm.addGroup(oGroup3);
		if (oFormLayout instanceof ResponsiveGridLayout) {
			assert.equal(oFormLayout.getColumnsXL(), 3, "ColumnsXL set on Forms Layout with 3 groups");
			assert.equal(oFormLayout.getColumnsL(), 2, "ColumnsL set on Forms Layout with 3 groups");
		}

		oSmartForm.addGroup(oGroup4);
		if (oFormLayout instanceof ResponsiveGridLayout) {
			assert.equal(oFormLayout.getColumnsXL(), 4, "ColumnsXL set on Forms Layout with 4 groups");
			assert.equal(oFormLayout.getColumnsL(), 2, "ColumnsL set on Forms Layout with 4 groups");
		}

		oSmartForm.setLayout(null);
		oLayout.setSingleGroupFullSize(false);
		oLayout.setColumnsXL(8);
		assert.equal(oFormLayout.getColumnsXL(), -1, "ColumnsXL set on Forms Layout");
		oSmartForm.setLayout(oLayout);
		assert.equal(oFormLayout.getColumnsXL(), 8, "ColumnsXL set on Forms Layout");

		oSmartForm.destroyGroups();
		oSmartForm.destroyLayout();
		assert.notOk(oSmartForm.getLayout(), "SmartForm has no layout");
		assert.notOk(sap.ui.getCore().byId("L1"), "Layout is destroyed");
		if (oFormLayout instanceof ResponsiveGridLayout) {
			// if wrong layout these checks will break anyway
			assert.equal(oFormLayout.getLabelSpanXL(), -1, "LabelSpanXL default set on Forms Layout");
			assert.equal(oFormLayout.getLabelSpanL(), 4, "LabelSpanL default set on Forms Layout");
			assert.equal(oFormLayout.getLabelSpanM(), 4, "LabelSpanM default set on Forms Layout");
			assert.equal(oFormLayout.getLabelSpanS(), 12, "LabelSpanS default set on Forms Layout");
			assert.equal(oFormLayout.getEmptySpanXL(), -1, "EmptySpanXL default set on Forms Layout");
			assert.equal(oFormLayout.getEmptySpanL(), 0, "EmptySpanL default set on Forms Layout");
			assert.equal(oFormLayout.getEmptySpanM(), 0, "EmptySpanM default set on Forms Layout");
			assert.equal(oFormLayout.getColumnsXL(), -1, "ColumnsXL default set on Forms Layout");
			assert.equal(oFormLayout.getColumnsL(), 3, "ColumnsL default set on Forms Layout");
			assert.equal(oFormLayout.getColumnsM(), 2, "ColumnsM default set on Forms Layout");
			assert.equal(oFormLayout.getSingleContainerFullSize(), true, "SingleContainerFullSize default set on Forms Layout");
			assert.equal(oFormLayout.getBreakpointXL(), 1440, "BreakpointXL default set on Forms Layout");
			assert.equal(oFormLayout.getBreakpointL(), 1024, "BreakpointL default set on Forms Layout");
			assert.equal(oFormLayout.getBreakpointM(), 600, "BreakpointM default set on Forms Layout");
		}

		oSmartForm.destroyLayout(); // just check if it don't break if no layout is assigned
	});

	function asyncResponsiveLayoutTest(assert, fnTest) {
		// also check for requirements of Group and GroupElement
		var oForm = oSmartForm.getAggregation("content");
		var oFormLayout = oForm.getLayout();
		if (sap.ui.require("sap/ui/layout/form/ResponsiveLayout") && sap.ui.require("sap/ui/layout/ResponsiveFlowLayoutData")
				&& sap.ui.require("sap/m/VBox") && sap.ui.require("sap/m/HBox") && sap.ui.require("sap/m/FlexItemData")
				&& sap.ui.require("sap/ui/core/VariantLayoutData") && sap.ui.require("sap/ui/layout/GridData")
				&& oFormLayout instanceof ResponsiveLayout) {
			fnTest(assert);
		} else {
			var fnDone = assert.async();
			sap.ui.require(["sap/ui/layout/form/ResponsiveLayout", "sap/ui/layout/ResponsiveFlowLayoutData",
			                "sap/m/VBox", "sap/m/HBox", "sap/m/FlexItemData",
			                "sap/ui/core/VariantLayoutData", "sap/ui/layout/GridData"], function() {
				setTimeout( function(){
					fnTest(assert);
					fnDone();
				}, 0);
			});
		}
	}

	function useHorizontalLayoutWithoutLayout(assert) {
		var oGroup1 = sap.ui.getCore().byId("G1");
		var oGroupElement1 = sap.ui.getCore().byId("GE1");
		var oField1 = sap.ui.getCore().byId("I1");
		var oField2 = sap.ui.getCore().byId("I2");
		var oForm = oSmartForm.getAggregation("content");
		var oFormLayout = oForm.getLayout();
		assert.ok(oFormLayout && oFormLayout instanceof ResponsiveLayout, "ResponsiveLayout used");

		var oVBox = oGroupElement1.getFields()[0];
		assert.ok(oVBox instanceof VBox, "GroupElement1: VBox found");
		var oLayoutData = oVBox.getLayoutData();
		assert.notOk(oLayoutData, "GroupElement1: no LayoutData of VBox found");
		assert.equal(oField1.getControlContext(), CompLib.smartfield.ControlContextType.Form, "ControlContext set on SmartField1");
		assert.equal(oField2.getControlContext(), CompLib.smartfield.ControlContextType.Form, "ControlContext set on SmartField2");
		oLayoutData = oGroup1.getLayoutData();
		assert.ok(oLayoutData, "Group has LayoutData");
		assert.ok(oLayoutData instanceof ResponsiveFlowLayoutData, "Group LayoutData are ResponsiveFlowLayoutData");
		assert.ok(oLayoutData.getLinebreak(), "Group LayoutData linebreak");
		assert.ok(oLayoutData.getLinebreakable(), "Group LayoutData linebreakable");

		sinon.spy(oFormLayout, "destroy");
		oSmartForm.setUseHorizontalLayout(false);
		assert.ok(oFormLayout.destroy.called, "ResponsiveLayout destroyed");
		oFormLayout = oForm.getLayout();
		assert.ok(oFormLayout && oFormLayout instanceof ResponsiveGridLayout, "ResponsiveGridLayout used after reset");
		oLayoutData = oGroup1.getLayoutData();
		assert.notOk(oLayoutData, "Group has no LayoutData");

		oForm = oSmartForm2.getAggregation("content");
		oFormLayout = oForm.getLayout();
		assert.ok(oFormLayout && oFormLayout instanceof ResponsiveLayout, "ResponsiveLayout used on second SmartForm");
	}

	QUnit.test("UseHorizontalLayout without Layout", function(assert) {
		aAsyncModules.push("sap/ui/layout/form/ResponsiveLayout"); // to force async. loading
		aAsyncModules.push("sap/ui/layout/ResponsiveFlowLayoutData"); // to force async. loading
		oSmartForm.setUseHorizontalLayout(true);
		var oField1 = new SmartField("I1");
		var oField2 = new SmartField("I2");
		var oGroupElement1 = new GroupElement("GE1", {label: "Label", elements: [oField1, oField2]});
		var oGroup1 = new Group("G1", {groupElements: [oGroupElement1]});
		oSmartForm.addGroup(oGroup1);
		oSmartForm.placeAt("qunit-fixture");
		oSmartForm2 = new SmartForm("SF2");
		oSmartForm2.setUseHorizontalLayout(true);
		oSmartForm2.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges(); // as ResponsiveLayout is created only before rendering as not sure if Layout aggregation will be used or not

		asyncResponsiveLayoutTest(assert, useHorizontalLayoutWithoutLayout);
	});

	QUnit.test("UseHorizontalLayout with Layout", function(assert) {
		// we need to test the inheritance of the GridSpan here as it can not be tested on stand alone GroupElements
		oSmartForm.setUseHorizontalLayout(true);
		var oField10 = new SmartField("I10");
		var oField11 = new SmartField("I11");
		var oGroupElement1 = new GroupElement("GE1", {label: "Label", elements: [new Input("I1")]});
		var oGroupElement2 = new GroupElement("GE2", {label: "Label", elements: [new Input("I2", {layoutData: new ResponsiveFlowLayoutData("LD2")})]});
		var oGroupElement3 = new GroupElement("GE3", {label: "Label", elements: [new Input("I3", {layoutData: new FlexItemData("LD3")})]});
		var oGroupElement4 = new GroupElement("GE4", {label: "Label", elements: [new Input("I4", {layoutData: new GridData("LD4", {span: "XL3 L3 M3 S3"})})]});
		var oGroupElement5 = new GroupElement("GE5", {label: "Label", elements: [new Input("I5", {layoutData: new VariantLayoutData("LD5", {
			multipleLayoutData: [new ResponsiveFlowLayoutData({linebreak: true})]})
			})]});
		var oGroupElement6 = new GroupElement("GE6", {label: "Label", elements: [new Input("I6")]});
		var oGroupElement7 = new GroupElement("GE7", {label: "Label", elements: [new Input("I7")]});
		var oGroupElement8 = new GroupElement("GE8", {label: "Label", elements: [new Input("I8")]});
		var oGroupElement9 = new GroupElement("GE9", {label: "Label", elements: [new Input("I9")]});
		var oGroupElement10 = new GroupElement("GE10", {label: "Label", elements: [oField10, oField11]});
		sinon.spy(oGroupElement1, "_updateGridDataSpan");
		sinon.spy(oGroupElement2, "_updateGridDataSpan");
		sinon.spy(oGroupElement3, "_updateGridDataSpan");
		sinon.spy(oGroupElement4, "_updateGridDataSpan");
		sinon.spy(oGroupElement5, "_updateGridDataSpan");
		sinon.spy(oGroupElement6, "_updateGridDataSpan");
		sinon.spy(oGroupElement7, "_updateGridDataSpan");
		sinon.spy(oGroupElement8, "_updateGridDataSpan");
		sinon.spy(oGroupElement9, "_updateGridDataSpan");
		sinon.spy(oGroupElement10, "_updateGridDataSpan");
		sinon.spy(oGroupElement1, "_setLinebreak");
		sinon.spy(oGroupElement2, "_setLinebreak");
		sinon.spy(oGroupElement3, "_setLinebreak");
		sinon.spy(oGroupElement4, "_setLinebreak");
		sinon.spy(oGroupElement5, "_setLinebreak");
		sinon.spy(oGroupElement6, "_setLinebreak");
		sinon.spy(oGroupElement7, "_setLinebreak");
		sinon.spy(oGroupElement8, "_setLinebreak");
		sinon.spy(oGroupElement9, "_setLinebreak");
		sinon.spy(oGroupElement10, "_setLinebreak");
		var oGroup1 = new Group({
			groupElements: [oGroupElement1, oGroupElement2, oGroupElement3, oGroupElement4, oGroupElement5, oGroupElement6, oGroupElement7, oGroupElement8]
		});
		var oGroup2 = new Group({groupElements: [oGroupElement9, oGroupElement10]});
		oSmartForm.addGroup(oGroup1);
		var oLayout = new Layout("L1", {
			gridDataSpan: "XL2 L3 M4 S6",
			breakpointXL: 1500,
			breakpointL: 1000,
			breakpointM: 500
		});
		var oSpan = oLayout._getGridDataSpanNumbers();
		assert.equal(oSpan.XL, 2, "Layout Span XL");
		assert.equal(oSpan.L, 3, "Layout Span L");
		assert.equal(oSpan.M, 4, "Layout Span M");
		assert.equal(oSpan.S, 6, "Layout Span S");
		oSmartForm.setLayout(oLayout);
		oSmartForm.insertGroup(oGroup2, 0);

		var oForm = oSmartForm.getAggregation("content");
		var oFormLayout = oForm.getLayout();
		assert.ok(oFormLayout && oFormLayout instanceof ResponsiveGridLayout, "ResponsiveGridLayout used as default");
		if (oFormLayout instanceof ResponsiveGridLayout) {
			// if wrong layout these checks will break anyway
			assert.equal(oFormLayout.getColumnsXL(), -1, "ColumnsXL set on Forms Layout");
			assert.equal(oFormLayout.getColumnsL(), 1, "ColumnsL set on Forms Layout");
			assert.equal(oFormLayout.getColumnsM(), 1, "ColumnsM set on Forms Layout");
			assert.equal(oFormLayout.getBreakpointXL(), 1500, "BreakPointXL set on Forms Layout");
			assert.equal(oFormLayout.getBreakpointL(), 1000, "BreakPointL set on Forms Layout");
			assert.equal(oFormLayout.getBreakpointM(), 500, "BreakPointM set on Forms Layout");
		}

		assert.ok(oGroup1.getUseHorizontalLayout(), "Group1: useHorizontalLayout");
		assert.ok(oGroup2.getUseHorizontalLayout(), "Group2: useHorizontalLayout");
		assert.ok(oGroupElement1.getUseHorizontalLayout(), "GroupElement1: useHorizontalLayout");
		assert.ok(oGroupElement1._updateGridDataSpan.called, "GroupElement1: _updateGridDataSpan called");
		assert.ok(oGroupElement1._setLinebreak.called, "GroupElement1: _setLinebreak called");
		assert.ok(oGroupElement1._setLinebreak.calledWith(false, false, false, false), "GroupElement1: _setLinebreak parameter");
		var oVBox = oGroupElement1.getFields()[0];
		assert.ok(oVBox instanceof VBox, "GroupElement1: VBox found");
		var oLayoutData = oVBox.getLayoutData();
		assert.ok(oLayoutData instanceof GridData, "GroupElement1: LayoutData of VBox found");
		assert.equal(oLayoutData.getSpan(), "XL2 L3 M4 S6", "GroupElement1: LayoutData Span");

		// linebreak of LayoutData tested in GroupElements qUnit test
		assert.ok(oGroupElement2.getUseHorizontalLayout(), "GroupElement2: useHorizontalLayout");
		assert.ok(oGroupElement2._updateGridDataSpan.called, "GroupElement2: _updateGridDataSpan called");
		assert.ok(oGroupElement2._setLinebreak.called, "GroupElement2: _setLinebreak called");
		assert.ok(oGroupElement2._setLinebreak.calledWith(false, false, false, false), "GroupElement2: _setLinebreak parameter");
		oVBox = oGroupElement2.getFields()[0];
		assert.ok(oVBox instanceof VBox, "GroupElement2: VBox found");
		oLayoutData = oVBox.getLayoutData();
		assert.ok(oLayoutData instanceof VariantLayoutData, "GroupElement2: LayoutData of VBox are VariantLayoutData");
		assert.equal(oLayoutData.getMultipleLayoutData().length, 2, "GroupElement2: 2 LayoutData");
		var oResponsiveFlowLayoutData;
		var oGridData;
		oLayoutData.getMultipleLayoutData().forEach(function(oLayoutData) {
			if (oLayoutData instanceof GridData) {
				oGridData = oLayoutData;
			} else {
				oResponsiveFlowLayoutData = oLayoutData;
			}
		});
		assert.ok(oResponsiveFlowLayoutData instanceof ResponsiveFlowLayoutData, "GroupElement2: ResponsiveFlowLayoutData found");
		assert.equal(oGridData.getSpan(), "XL2 L3 M4 S6", "GroupElement2: LayoutData Span");

		oVBox = oGroupElement3.getFields()[0];
		oLayoutData = oVBox.getLayoutData();
		assert.ok(oLayoutData instanceof GridData, "GroupElement3: no FlexItemData on VBox found");
		assert.ok(oGroupElement3._setLinebreak.calledWith(false, false, false, true), "GroupElement3: _setLinebreak parameter");

		oVBox = oGroupElement4.getFields()[0];
		oLayoutData = oVBox.getLayoutData();
		assert.ok(oLayoutData instanceof GridData, "GroupElement4: GridData on VBox found");
		assert.ok(oGroupElement4._setLinebreak.calledWith(false, false, true, false), "GroupElement4: _setLinebreak parameter");
		assert.equal(oLayoutData.getSpan(), "XL3 L3 M3 S3", "GroupElement4: LayoutData Span used from original GridData");

		oVBox = oGroupElement5.getFields()[0];
		oLayoutData = oVBox.getLayoutData();
		oResponsiveFlowLayoutData = undefined;
		oGridData = undefined;
		oLayoutData.getMultipleLayoutData().forEach(function(oLayoutData) {
			if (oLayoutData instanceof GridData) {
				oGridData = oLayoutData;
			} else {
				oResponsiveFlowLayoutData = oLayoutData;
			}
		});
		assert.ok(oResponsiveFlowLayoutData instanceof ResponsiveFlowLayoutData, "GroupElement5: ResponsiveFlowLayoutData found");
		assert.ok(oGridData instanceof GridData, "GroupElement5: GridData found");
		assert.ok(oGroupElement5._setLinebreak.calledWith(false, true, false, true), "GroupElement5: _setLinebreak parameter");
		assert.equal(oGridData.getSpan(), "XL2 L3 M4 S6", "GroupElement5: GridData Span");

		assert.ok(oGroupElement6._setLinebreak.calledWith(false, false, false, false), "GroupElement6: _setLinebreak parameter");
		assert.ok(oGroupElement7._setLinebreak.calledWith(true, false, true, true), "GroupElement7: _setLinebreak parameter");
		assert.ok(oGroupElement8._setLinebreak.calledWith(false, false, false, false), "GroupElement8: _setLinebreak parameter");

		assert.equal(oField10.getControlContext(), CompLib.smartfield.ControlContextType.SmartFormGrid, "ControlContext set on SmartField");
		assert.equal(oField11.getControlContext(), CompLib.smartfield.ControlContextType.SmartFormGrid, "ControlContext set on SmartField");

		oLayout.setGridDataSpan("L4 M4 S4");
		oVBox = oGroupElement1.getFields()[0];
		oLayoutData = oVBox.getLayoutData();
		assert.equal(oLayoutData.getSpan(), "L4 M4 S4", "GroupElement1: LayoutData Span");
		assert.ok(oGroupElement4._setLinebreak.calledWith(true, true, true, true), "GroupElement4: _setLinebreak parameter");

		oLayout.setGridDataSpan();
		oFormLayout = oForm.getLayout();
		assert.ok(oFormLayout && oFormLayout instanceof ResponsiveLayout, "ResponsiveLayout used");
		oVBox = oGroupElement1.getFields()[0];
		oLayoutData = oVBox.getLayoutData();
		assert.notOk(oLayoutData, "GroupElement1: no LayoutData of VBox found");
		oVBox = oGroupElement2.getFields()[0];
		oLayoutData = oVBox.getLayoutData();
		assert.ok(oLayoutData instanceof ResponsiveFlowLayoutData, "GroupElement2: LayoutData of VBox are ResponsiveFlowLayoutData");
		oVBox = oGroupElement3.getFields()[0];
		oLayoutData = oVBox.getLayoutData();
		assert.notOk(oLayoutData, "GroupElement3: no LayoutData of VBox found");
		oVBox = oGroupElement4.getFields()[0];
		oLayoutData = oVBox.getLayoutData();
		assert.ok(oLayoutData instanceof GridData, "GroupElement4: LayoutData of VBox are GridData");
		oVBox = oGroupElement5.getFields()[0];
		oLayoutData = oVBox.getLayoutData();
		assert.ok(oLayoutData instanceof VariantLayoutData, "GroupElement5: LayoutData of VBox are VariantLayoutData");
		assert.equal(oLayoutData.getMultipleLayoutData().length, 1, "GroupElement5: only one LayoutData inside");
		assert.ok(oLayoutData.getMultipleLayoutData()[0] instanceof ResponsiveFlowLayoutData, "GroupElement5: ResponsiveFlowLayoutData found");
	});

	function asyncColumnLayoutTest(assert, fnTest) {
		// also check for requirements of Group and GroupElement
		var oForm = oSmartForm.getAggregation("content");
		var oFormLayout = oForm.getLayout();
		if (sap.ui.require("sap/ui/layout/form/ColumnLayout") && oFormLayout instanceof FormColumnLayout) {
			fnTest(assert);
		} else {
			var fnDone = assert.async();
			sap.ui.require(["sap/ui/layout/form/ColumnLayout"], function() {
				setTimeout( function(){
					fnTest(assert);
					fnDone();
				}, 0);
			});
		}
	}

	function useColumnLayout(assert) {
		var oLayout = oSmartForm.getLayout();
		var oForm = oSmartForm.getAggregation("content");
		var oFormLayout = oForm.getLayout();
		assert.ok(oFormLayout && oFormLayout instanceof FormColumnLayout, "ColumnLayout used");
		assert.equal(oFormLayout.getColumnsXL(), 2, "ColumnsXL on Form layout");
		assert.equal(oFormLayout.getColumnsL(), 2, "ColumnsL on Form layout");
		assert.equal(oFormLayout.getColumnsM(), 1, "ColumnsM on Form layout");
		assert.equal(oFormLayout.getLabelCellsLarge(), 4, "LabelCellsLarge on Form layout");
		assert.equal(oFormLayout.getEmptyCellsLarge(), 0, "EmptyCellsLarge on Form layout");

		aAsyncModules = []; // to enable layzy instance check
		oLayout.setColumnsXL(4).setColumnsL(3).setColumnsM(2).setLabelCellsLarge(3).setEmptyCellsLarge(1);
		assert.equal(oFormLayout.getColumnsXL(), 4, "ColumnsXL on Form layout");
		assert.equal(oFormLayout.getColumnsL(), 3, "ColumnsL on Form layout");
		assert.equal(oFormLayout.getColumnsM(), 2, "ColumnsM on Form layout");
		assert.equal(oFormLayout.getLabelCellsLarge(), 3, "LabelCellsLarge on Form layout");
		assert.equal(oFormLayout.getEmptyCellsLarge(), 1, "EmptyCellsLarge on Form layout");

		sinon.spy(oFormLayout, "destroy");
		oSmartForm.destroyLayout();
		assert.ok(oFormLayout.destroy.called, "ColumnLayout destroyed");
		oFormLayout = oForm.getLayout();
		assert.ok(oFormLayout && oFormLayout instanceof ResponsiveGridLayout, "ResponsiveGridLayout used after reset");

		oLayout = oSmartForm2.getLayout();
		oForm = oSmartForm2.getAggregation("content");
		oFormLayout = oForm.getLayout();
		assert.ok(oFormLayout && oFormLayout instanceof FormColumnLayout, "ColumnLayout used for second Form");
	}

	QUnit.test("ColumnLayout", function(assert) {
		aAsyncModules.push("sap/ui/layout/form/ColumnLayout"); // to force async. loading
		var oLayout = new ColumnLayout("CL1");
		oSmartForm.setLayout(oLayout);
		oSmartForm.placeAt("qunit-fixture");
		oSmartForm2 = new SmartForm("SF2");
		oLayout = new ColumnLayout("CL2");
		oSmartForm2.setLayout(oLayout);
		oSmartForm2.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges(); // as ColumnLayout is created only before rendering as not sure if Layout aggregation will be used or not

		asyncColumnLayoutTest(assert, useColumnLayout);
	});

	QUnit.test("ColumnLayout and useHorizontalLayout", function(assert) {
		var oException;

		try {
			var oLayout = new ColumnLayout("CL1");
			oSmartForm.setLayout(oLayout);
			oSmartForm.setUseHorizontalLayout(true);
			oSmartForm.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges(); // as ColumnLayout is created only before rendering as not sure if Layout aggregation will be used or not
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
	});

	QUnit.test("useHorizontalLayout and ColumnLayout", function(assert) {
		var oException;

		try {
			oSmartForm.setUseHorizontalLayout(true);
			var oLayout = new ColumnLayout("CL1");
			oSmartForm.setLayout(oLayout);
			oSmartForm.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges(); // as ColumnLayout is created only before rendering as not sure if Layout aggregation will be used or not
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
	});

	QUnit.module("Expandable", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	function asyncPanelTest(assert, fnTest) {
		if (sap.ui.require("sap/m/Panel") && oSmartForm.getAggregation("content") instanceof Panel) {
			fnTest(assert);
		} else {
			var fnDone = assert.async();
			sap.ui.require(["sap/m/Panel"], function() {
				fnTest(assert);
				fnDone();
			});
		}
	}

	function expandableTest(assert) {
		var oPanel = oSmartForm.getAggregation("content");
		assert.ok(oPanel instanceof Panel, "Panel used as content");
		assert.notOk(oPanel.getHeaderToolbar(), "Panel, no toolbar per default.");
		var oForm = oPanel.getContent()[0];
		assert.ok(oForm instanceof Form, "Form used as panel content");

		var sPanelId = oPanel.getId();
		sinon.spy(oSmartForm, "getTitle");
		oSmartForm.setExpandable(false);
		oForm = oSmartForm.getAggregation("content");
		assert.ok(oForm instanceof Form, "Form used as content");
		assert.notOk(sap.ui.getCore().byId(sPanelId), "Panel is destroyed");
		assert.ok(oSmartForm.getTitle.calledOnce, "Title is checked");

		oSmartForm.setExpandable(false);
		assert.ok(oSmartForm.getTitle.calledOnce, "nothin done if set to same value");
	}

	QUnit.test("expandable Form", function(assert) {
		aAsyncModules.push("sap/m/Panel"); // to force async. loading
		oSmartForm.setExpandable(true);
		asyncPanelTest(assert, expandableTest);
	});

	function expandableTitleTest(assert) {
		var oPanel = oSmartForm.getAggregation("content");
		assert.equal(oPanel.getHeaderText(), "Title", "Panel used Title");
	}

	QUnit.test("expandable Form with Title", function(assert) {
		oSmartForm.setExpandable(true);
		oSmartForm.setTitle("Title");
		asyncPanelTest(assert, expandableTitleTest);
	});

	function expandableToolbarTest(assert) {
		var oPanel = oSmartForm.getAggregation("content");
		var oToolbar = oSmartForm.getAggregation("toolbar");
		assert.equal(oPanel.getHeaderToolbar(), oToolbar, "Panel used Toolbar");
	}

	QUnit.test("expandable Form with Toolbar", function(assert) {
		oSmartForm.setExpandable(true);
		oSmartForm.setTitle("Title");
		oSmartForm.setEditTogglable(true);
		asyncPanelTest(assert, expandableToolbarTest);
	});

	function expandableCustomToolbarTest(assert) {
		var oCustomToolbar = sap.ui.getCore().byId("TB1");
		var oPanel = oSmartForm.getAggregation("content");
		assert.equal(oPanel.getHeaderToolbar(), oCustomToolbar, "Panel used CustomToolbar");
	}

	QUnit.test("expandable Form with CustomToolbar", function(assert) {
		oSmartForm.setExpandable(true);
		var oCustomToolbar = new Toolbar("TB1", {
			content: [new Button("B1", {text: "Button 1"}), new Button("B2", {text: "Button 2"})]
		});
		oSmartForm.setCustomToolbar(oCustomToolbar);
		asyncPanelTest(assert, expandableCustomToolbarTest);
	});

	function expandableChangeExpandedTest(assert) {
		var oPanel = oSmartForm.getAggregation("content");
		assert.notOk(oPanel.getExpanded(), "Panel not expanded per default");

		oSmartForm.setExpanded(true);
		assert.ok(oPanel.getExpanded(), "Panel expanded");
	}

	QUnit.test("change expanded", function(assert) {
		oSmartForm.setExpandable(true);
		asyncPanelTest(assert, expandableChangeExpandedTest);
	});

	QUnit.module("AriaLabelledBy", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("addAriaLabelledBy", function(assert) {
		var oLabel = new Label("XXX", {text: "Test"});
		oSmartForm.addAriaLabelledBy(oLabel);

		var oForm = oSmartForm.getAggregation("content");
		var aIDs = oForm.getAriaLabelledBy();
		assert.equal(aIDs.length, 1, "Form has AriaLabelledBy");
		assert.equal(aIDs[0], "XXX", "Form has AriaLabelledBy ID assigned");

		oLabel.destroy();
	});

	function addAriaLabelledByWithTitle(assert) {
		var oForm = oSmartForm.getAggregation("content");
		var aIDs = oForm.getAriaLabelledBy();
		assert.equal(aIDs.length, 2, "Form has 2 Aria Labels");

		var bFound = false;
		for (var i = 0; i < aIDs.length; i++) {
			if (aIDs[i] === "XXX") {
				bFound = true;
			}
		}

		assert.ok(bFound, "Form has AriaLabelledBy ID assigned");
	}

	QUnit.test("addAriaLabelledBy with Title and Toolbar", function(assert) {
		oSmartForm.addAriaLabelledBy("XXX");
		oSmartForm.setEditTogglable(true);
		oSmartForm.setTitle("Title");

		asyncToolbarTest(assert, true, true, addAriaLabelledByWithTitle);
	});

	QUnit.test("getAriaLabelledBy", function(assert) {
		var oLabel = new Label("XXX", {text: "Test"});
		oSmartForm.addAriaLabelledBy(oLabel);

		var aIDs = oSmartForm.getAriaLabelledBy();
		assert.equal(aIDs.length, 1, "SmartForm has AriaLabelledBy");
		assert.equal(aIDs[0], "XXX", "SmartForm has AriaLabelledBy ID assigned");

		oLabel.destroy();
	});

	function getAriaLabelledByWithTitle(assert) {
		var aIDs = oSmartForm.getAriaLabelledBy();
		assert.equal(aIDs.length, 1, "SmartForm has 2 Aria Labels");
		assert.equal(aIDs[0], "XXX", "SmartForm has AriaLabelledBy ID assigned");
	}

	QUnit.test("getAriaLabelledBy with Title and Toolbar", function(assert) {
		oSmartForm.addAriaLabelledBy("XXX");
		oSmartForm.setEditTogglable(true);
		oSmartForm.setTitle("Title");

		asyncToolbarTest(assert, true, true, getAriaLabelledByWithTitle);
	});

	QUnit.test("removeAriaLabelledBy", function(assert) {
		oSmartForm.addAriaLabelledBy("XXX");
		oSmartForm.addAriaLabelledBy("YYY");
		oSmartForm.removeAriaLabelledBy("XXX");

		var oForm = oSmartForm.getAggregation("content");
		var aIDs = oForm.getAriaLabelledBy();
		assert.equal(aIDs.length, 1, "Form has AriaLabelledBy");

		var bFound = false;
		for (var i = 0; i < aIDs.length; i++) {
			if (aIDs[i] === "XXX") {
				bFound = true;
			}
		}
		assert.notOk(bFound, "Form has AriaLabelledBy ID not assigned");
	});

	function removeAriaLabelledByWithTitle(assert) {
		var oForm = oSmartForm.getAggregation("content");
		var aIDs = oForm.getAriaLabelledBy();
		assert.equal(aIDs.length, 2, "Form has 2 Aria Labels");

		var bFound = false;
		for (var i = 0; i < aIDs.length; i++) {
			if (aIDs[i] === "XXX") {
				bFound = true;
			}
		}
		assert.notOk(bFound, "Form has AriaLabelledBy ID not assigned");
	}

	QUnit.test("removeAriaLabelledBy with Title and Toolbar", function(assert) {
		oSmartForm.addAriaLabelledBy("XXX");
		oSmartForm.setEditTogglable(true);
		oSmartForm.setTitle("Title");
		oSmartForm.addAriaLabelledBy("YYY");
		oSmartForm.removeAriaLabelledBy("XXX");

		asyncToolbarTest(assert, true, true, removeAriaLabelledByWithTitle);
	});

	QUnit.test("removeAllAriaLabelledBy", function(assert) {
		oSmartForm.addAriaLabelledBy("XXX");
		oSmartForm.addAriaLabelledBy("YYY");
		oSmartForm.removeAllAriaLabelledBy();

		var oForm = oSmartForm.getAggregation("content");
		var aIDs = oForm.getAriaLabelledBy();
		assert.equal(aIDs.length, 0, "Form has  no AriaLabelledBy");
	});

	function removeAllAriaLabelledByWithTitle(assert) {
		var oForm = oSmartForm.getAggregation("content");
		var aIDs = oForm.getAriaLabelledBy();
		assert.equal(aIDs.length, 1, "Form has 1 Aria Labels");
		assert.notEqual(aIDs[0], "XXX", "Form has AriaLabelledBy ID not assigned");
		assert.notEqual(aIDs[0], "YYY", "Form has AriaLabelledBy ID not assigned");
	}

	QUnit.test("removeAllAriaLabelledBy with Title and Toolbar", function(assert) {
		oSmartForm.addAriaLabelledBy("XXX");
		oSmartForm.setEditTogglable(true);
		oSmartForm.setTitle("Title");
		oSmartForm.addAriaLabelledBy("YYY");
		oSmartForm.removeAllAriaLabelledBy();

		asyncToolbarTest(assert, true, true, removeAllAriaLabelledByWithTitle);
	});

	QUnit.test("_suggestTitleId", function(assert) {
		oSmartForm._suggestTitleId("ID1");
		oSmartForm.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		assert.equal(jQuery("#SF1--Form").attr("aria-labelledby"), "ID1", "aria-labelledby points to TitleID");
	});

	QUnit.module("other", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	QUnit.test("editable", function(assert) {
		var oGroupElement1 = new GroupElement("GE1");
		var oGroupElement2 = new GroupElement("GE2");
		var oGroupElement3 = new GroupElement("GE3");
		var oGroup1 = new Group({groupElements: [oGroupElement1]});
		var oGroup2 = new Group({groupElements: [oGroupElement2]});
		sinon.spy(oGroup1, "_setEditable");
		sinon.spy(oGroup2, "_setEditable");
		sinon.spy(oGroupElement1, "_setEditable");
		sinon.spy(oGroupElement2, "_setEditable");
		sinon.spy(oGroupElement3, "_setEditable");

		oSmartForm.addGroup(oGroup1);
		oSmartForm.setEditable(true);
		oSmartForm.addGroup(oGroup2);
		oGroup1.addGroupElement(oGroupElement3);

		assert.ok(oSmartForm.getEditable(), "Editable set on SmartForm");
		assert.ok(oGroup1._setEditable.called, "_setEditable called on Group1");
		assert.ok(oGroup1._setEditable.calledWith(true), "_setEditable called on Group1 with \"true\"");
		assert.ok(oGroup2._setEditable.calledWith(true), "_setEditable called on Group2 with \"true\"");
		assert.ok(oGroupElement1._setEditable.calledWith(true), "_setEditable called on GroupElement1 with \"true\"");
		assert.ok(oGroupElement2._setEditable.calledWith(true), "_setEditable called on GroupElement2 with \"true\"");
		assert.ok(oGroupElement3._setEditable.calledWith(true), "_setEditable called on GroupElement3 with \"true\"");
	});

	QUnit.test("editable / Label displayOnly", function(assert) {
		var oLabel = new Label({text: "Label"});
		var oGroupElement1 = new GroupElement("GE1", {label: oLabel, elements: [new Input()]});
		var oGroup1 = new Group({groupElements: [oGroupElement1]});

		oSmartForm.addGroup(oGroup1);
		oSmartForm.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges(); // to render
		assert.ok(oLabel.isDisplayOnly(), "Label isDisplayOnly");

		sinon.spy(oLabel, "invalidate");
		oSmartForm.setEditable(true);
		assert.notOk(oLabel.isDisplayOnly(), "Label isDisplayOnly");
		assert.ok(oLabel.invalidate.called, "Label invalidated");

		oSmartForm.setUseHorizontalLayout(true);
		oSmartForm.setEditable(false);
		assert.ok(oLabel.isDisplayOnly(), "Label isDisplayOnly");
	});

	QUnit.test("getSmartFields", function(assert) {
		var oField1 = new SmartField("F1", {value: "Text"});
		var oField2 = new Input("F2");
		var oField3 = new Input("F3");
		var oField4 = new SmartField("F4");
		var oField5 = new Input("F5");
		var oField6 = new SmartField("F6");
		var oField7 = new SmartField("F7", {visible: false});
		var oField8 = new SmartField("F8");
		var oGroupElement1 = new GroupElement("GE1", {label: "Label", elements: [oField1]});
		var oGroupElement2 = new GroupElement("GE2", {label: "Label", elements: [oField2]});
		var oGroupElement3 = new GroupElement("GE3", {label: "Label", elements: [oField3]});
		var oGroupElement4 = new GroupElement("GE4", {label: "Label", elements: [oField4]});
		var oGroupElement5 = new GroupElement("GE5", {label: "Label", elements: [oField5, oField6, oField7]});
		var oGroupElement6 = new GroupElement("GE6", {label: "Label", elements: [oField8], visible: false});
		var oGroup1 = new Group("G1", {groupElements: [oGroupElement1, oGroupElement2]});
		var oGroup2 = new Group("G2", {visible: false, groupElements: [oGroupElement3, oGroupElement4]});
		var oGroup3 = new Group("G3", {groupElements: [oGroupElement5, oGroupElement6]});
		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);
		oSmartForm.addGroup(oGroup3);

		var aSmartFields = oSmartForm.getSmartFields(false);
		assert.equal(aSmartFields.length, 5, "5 SmartFields found");

		aSmartFields = oSmartForm.getSmartFields();
		assert.equal(aSmartFields.length, 4, "4 SmartFields found");

		aSmartFields = oSmartForm.getSmartFields(true, true);
		assert.equal(aSmartFields.length, 3, "3 SmartFields found");
	});

	QUnit.test("check", function(assert) {
		oSmartForm.setEditable(true);
		var oField1 = new SmartField("F1", {value: "Text"});
		var oField2 = new SmartField("F2");
		var oField3 = new SmartField("F3");
		var oField4 = new SmartField("F4");
		var oField5 = new SmartField("F5", {visible: false});
		var oField6 = new SmartField("F6");
		var oField7 = new SmartField("F7");
		var oField8 = new SmartField("F8", {visible: false});
		var oField9 = new SmartField("F9");
		// fake errors
		sinon.stub(oField2, "checkClientError").returns(true);
		sinon.stub(oField3, "checkClientError").returns(true);
		sinon.stub(oField5, "checkClientError").returns(true);
		sinon.stub(oField6, "checkClientError").returns(true);
		sinon.stub(oField7, "checkClientError").returns(true);
		sinon.stub(oField8, "checkClientError").returns(true);
		var fnCheckClientErrorSpy = sinon.spy(oField9, "checkClientError");

		var oGroupElement1 = new GroupElement("GE1", {label: "Label", elements: [oField1, oField8]});
		var oGroupElement2 = new GroupElement("GE2", {label: "Label", elements: [oField2]});
		var oGroupElement3 = new GroupElement("GE3", {label: "Label", elements: [oField3]});
		var oGroupElement4 = new GroupElement("GE4", {label: "Label", elements: [oField4]});
		var oGroupElement5 = new GroupElement("GE5", {label: "Label", elements: [oField5]});
		var oGroupElement6 = new GroupElement("GE6", {label: "Label", elements: [oField6], visible: false});
		var oGroupElement7 = new GroupElement("GE7", {label: "Label", elements: [oField7]});
		var oGroupElement8 = new GroupElement("GE8", {label: "Label", elements: [oField9]});
		var oGroup1 = new Group({groupElements: [oGroupElement1, oGroupElement2]});
		var oGroup2 = new Group({groupElements: [oGroupElement3, oGroupElement4, oGroupElement5, oGroupElement6], expanded: false, expandable: true});
		var oGroup3 = new Group({groupElements: [oGroupElement7], visible: false});
		var oGroup4 = new Group({groupElements: [oGroupElement8]});
		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);
		oSmartForm.addGroup(oGroup3);
		oSmartForm.addGroup(oGroup4);

		var aErroneousFields = oSmartForm.check(false);
		assert.ok(Array.isArray(aErroneousFields), "aErroneousFields returned");
		assert.equal(aErroneousFields.length, 6, "6 erroneous Fields");
		assert.deepEqual(aErroneousFields, ["F8", "F2", "F3", "F5", "F6", "F7"], "erroneous Fields");
		assert.ok(oGroup3.getExpanded(), "Group3 is expanded");
		assert.ok(fnCheckClientErrorSpy.calledWithMatch({ handleSuccess: false }), "Default handleSuccess value is passed to SmartFied");
		fnCheckClientErrorSpy.resetHistory();
		aErroneousFields = oSmartForm.check({considerOnlyVisible: false});
		assert.ok(Array.isArray(aErroneousFields), "aErroneousFields returned");
		assert.equal(aErroneousFields.length, 6, "6 erroneous Fields");
		assert.deepEqual(aErroneousFields, ["F8", "F2", "F3", "F5", "F6", "F7"], "erroneous Fields");
		assert.ok(fnCheckClientErrorSpy.calledWithMatch({ handleSuccess: false }), "Default handleSuccess value is passed to SmartFied");

		fnCheckClientErrorSpy.resetHistory();
		aErroneousFields = oSmartForm.check(true);
		assert.equal(aErroneousFields.length, 2, "2 erroneous Fields");
		assert.deepEqual(aErroneousFields, ["F2", "F3"], "erroneous Fields");
		assert.ok(fnCheckClientErrorSpy.calledWithMatch({ handleSuccess: false }), "Default handleSuccess value is passed to SmartFied");
		fnCheckClientErrorSpy.resetHistory();
		aErroneousFields = oSmartForm.check({considerOnlyVisible: true});
		assert.equal(aErroneousFields.length, 2, "2 erroneous Fields");
		assert.deepEqual(aErroneousFields, ["F2", "F3"], "erroneous Fields");
		assert.ok(fnCheckClientErrorSpy.calledWithMatch({ handleSuccess: false }), "Default handleSuccess value is passed to SmartFied");

		fnCheckClientErrorSpy.resetHistory();
		aErroneousFields = oSmartForm.check(); // to test fallback to true
		assert.equal(aErroneousFields.length, 2, "2 erroneous Fields");
		assert.deepEqual(aErroneousFields, ["F2", "F3"], "erroneous Fields");
		assert.ok(fnCheckClientErrorSpy.calledWithMatch({ handleSuccess: false }), "Default handleSuccess value is passed to SmartFied");

		fnCheckClientErrorSpy.resetHistory();
		oSmartForm.check({ considerOnlyVisible: false, handleSuccess: true });
		assert.ok(fnCheckClientErrorSpy.calledWithMatch({ handleSuccess: true }), "Explicit handleSuccess value is passed to SmartFied");
	});

	QUnit.test("setFocusOnEditableControl", function(assert) {
		var oField1 = new Input("F1", {editable: false});
		var oField2 = new Input("F2");
		var oField3 = new Input("F3");
		var oGroupElement1 = new GroupElement("GE1", {label: "Label", elements: [oField1]});
		var oGroupElement2 = new GroupElement("GE2", {label: "Label", elements: [oField2, oField3]});
		var oGroup1 = new Group({groupElements: [oGroupElement1]});
		var oGroup2 = new Group({groupElements: [oGroupElement2]});
		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);

		oSmartForm.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges(); // to render
		oField3.focus(); // to set the focus

		sinon.spy(oField2, "focus");
		oSmartForm.setFocusOnEditableControl();
		assert.ok(oField2.focus.called, "focus set on Field2");
	});

	QUnit.test("getVisibleProperties", function(assert) {
		var oModel = new JSONModel();
		oModel.setData({
			name: "Max",
			age: 20,
			city: "Walldorf"
		});
		oSmartForm.setModel(oModel);

		var oField1 = new Input("F1", {value: {path: "/name"}});
		var oField2 = new Input("F2", {value: {path: "/age"}, visible: false});
		var oField3 = new Input("F3", {value: {path: "/city"}});
		var oGroupElement1 = new GroupElement("GE1", {label: "Label", elements: [oField1]});
		var oGroupElement2 = new GroupElement("GE2", {label: "Label", elements: [oField2, oField3]});
		var oGroup1 = new Group({groupElements: [oGroupElement1]});
		var oGroup2 = new Group({groupElements: [oGroupElement2]});
		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);

		var aProperties = oSmartForm.getVisibleProperties();

		assert.equal(aProperties.length, 2, "properties returned");
		assert.equal(aProperties[0], "/name", "first path");
		assert.equal(aProperties[1], "/city", "second path");

		oModel.destroy();
	});

	QUnit.test("HorizontalLayoutGroupElementMinWidth", function(assert) {
		oSmartForm.setHorizontalLayoutGroupElementMinWidth(100);
		var oGroup1 = new Group();
		var oGroup2 = new Group();
		oSmartForm.addGroup(oGroup1);
		oSmartForm.insertGroup(oGroup2, 0);

		assert.equal(oSmartForm.getHorizontalLayoutGroupElementMinWidth(), 100, "SmartForm HorizontalLayoutGroupElementMinWidth set");
		assert.equal(oGroup1.getHorizontalLayoutGroupElementMinWidth(), 100, "Group1 HorizontalLayoutGroupElementMinWidth set");
		assert.equal(oGroup2.getHorizontalLayoutGroupElementMinWidth(), 100, "Group2 HorizontalLayoutGroupElementMinWidth set");

		oSmartForm.setHorizontalLayoutGroupElementMinWidth(200);
		assert.equal(oSmartForm.getHorizontalLayoutGroupElementMinWidth(), 200, "SmartForm HorizontalLayoutGroupElementMinWidth set");
		assert.equal(oGroup1.getHorizontalLayoutGroupElementMinWidth(), 200, "Group1 HorizontalLayoutGroupElementMinWidth set");
		assert.equal(oGroup2.getHorizontalLayoutGroupElementMinWidth(), 200, "Group2 HorizontalLayoutGroupElementMinWidth set");

		sinon.spy(oGroup1, "setHorizontalLayoutGroupElementMinWidth");
		oSmartForm.setHorizontalLayoutGroupElementMinWidth(200);
		assert.notOk(oGroup1.setHorizontalLayoutGroupElementMinWidth.called, "Group not updated if set to same value");
	});

	QUnit.module("Events", {
		beforeEach: initTest,
		afterEach: afterTest
	});

	function eventsChecked(assert) {
		var oField1 = new SmartField("F1", {value: "Text"});
		var oField2 = new SmartField("F2");
		var oField3 = new SmartField("F3");
		var oField4 = new SmartField("F4");
		// fake errors
		sinon.stub(oField2, "checkClientError").returns(true);
		sinon.stub(oField3, "checkClientError").returns(true);

		var oGroupElement1 = new GroupElement("GE1", {label: "Label", elements: [oField1]});
		var oGroupElement2 = new GroupElement("GE2", {label: "Label", elements: [oField2]});
		var oGroupElement3 = new GroupElement("GE3", {label: "Label", elements: [oField3]});
		var oGroupElement4 = new GroupElement("GE4", {label: "Label", elements: [oField4]});
		var oGroup1 = new Group({groupElements: [oGroupElement1, oGroupElement2]});
		var oGroup2 = new Group({groupElements: [oGroupElement3, oGroupElement4]});
		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);
		var bChecked = false;
		var aErroneousFields;
		oSmartForm.attachChecked(function(oEvent){
			bChecked = true;
			aErroneousFields = oEvent.getParameter("erroneousFields");
		});
		var oToolbar = oSmartForm.getAggregation("toolbar");
		var aContent = oToolbar ? oToolbar.getContent() : [];
		var oCheckButton = aContent[1];

		oSmartForm.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges(); // to render

		qutils.triggerEvent("tap", oCheckButton.getId());
		assert.ok(bChecked, "CheckedEvent fired");
		assert.ok(Array.isArray(aErroneousFields), "aErroneousFields returned");
		assert.equal(aErroneousFields.length, 2, "2 erroneous Fields");
		assert.deepEqual(aErroneousFields, ["F2", "F3"], "erroneous Fields");
	}

	QUnit.test("checked", function(assert) {
		oSmartForm.setCheckButton(true);
		oSmartForm.setEditable(true);
		asyncToolbarTest(assert, false, true, eventsChecked);
	});

	function eventsEditToggled(assert) {
		var oToolbar = oSmartForm.getAggregation("toolbar");
		var bEvent = false;
		var bEditable;
		oSmartForm.attachEditToggled(function(oEvent){
			bEvent = true;
			bEditable = oEvent.getParameter("editable");
		});
		var aContent = oToolbar ? oToolbar.getContent() : [];
		var oToggleButton = aContent[1];

		oSmartForm.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges(); // to render

		qutils.triggerEvent("tap", oToggleButton.getId());
		assert.ok(bEvent, "Toggle event fired");
		assert.notOk(bEditable, "Editable returned");
		assert.notOk(oSmartForm.getEditable(), "Editable property set");

		bEvent = false;
		oSmartForm.setEditable(false);
		assert.notOk(bEvent, "Toggle event not fired if property set to same value");
	}

	QUnit.test("editToggled", function(assert) {
		oSmartForm.setEditable(true);
		oSmartForm.setEditTogglable(true);
		asyncToolbarTest(assert, false, true, eventsEditToggled);
	});

	function eventsNoEditToggled(assert, fnDone) {
		var oField1 = new SmartField("F1", {value: "Text"});
		var oGroupElement1 = new GroupElement("GE1", {label: "Label", elements: [oField1]});
		var oGroup1 = new Group({groupElements: [oGroupElement1]});
		oSmartForm.addGroup(oGroup1);
		// fake errors
		sinon.stub(oField1, "checkClientError").returns(true);
		sinon.stub(MessageBox, "show"); // to prevent to open real popup

		var oToolbar = oSmartForm.getAggregation("toolbar");
		var bEvent = false;
		oSmartForm.attachEditToggled(function(oEvent){
			bEvent = true;
		});
		var aContent = oToolbar ? oToolbar.getContent() : [];
		var oToggleButton = aContent[1];

		oSmartForm.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges(); // to render

		qutils.triggerEvent("tap", oToggleButton.getId());

		if (!fnDone) {
			fnDone = assert.async();
		}
		sap.ui.require(["sap/m/MessageBox"], function() {
			assert.notOk(bEvent, "No Toggle event fired");
			assert.ok(oSmartForm.getEditable(), "Editable property not set");
			assert.ok(MessageBox.show.called, "MessageBox shown");
			fnDone();
		});

		return true; // to handle fnDone here
	}

	QUnit.test("no editToggled when error", function(assert) {
		aAsyncModules.push("sap/m/MessageBox"); // to force async. loading
		oSmartForm.setEditable(true);
		oSmartForm.setEditTogglable(true);
		asyncToolbarTest(assert, false, true, eventsNoEditToggled);
	});

	QUnit.module("clone", {
		beforeEach: initTest,
		afterEach: afterTest
	});
	// cloning for Groups and GroupElements is tested in their qUnit tests, so it's not needed here

	QUnit.test("simple SmartForm", function(assert) {
		var oCustomData = new CustomData("CD1", {key: "KEY", value: "VALUE"});
		oSmartForm.addCustomData(oCustomData);
		var oGroup1 = new Group("G1");
		var oGroup2 = new Group("G2");
		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);
		var oForm = oSmartForm.getAggregation("content");

		var oClone = oSmartForm.clone("myClone");

		// check if original is still OK
		assert.equal(oForm, oSmartForm.getAggregation("content"), "Original: Form is still in content");
		var aGroups = oSmartForm.getGroups();
		assert.equal(aGroups.length, 2, "Original: 2 groups");
		assert.equal(aGroups[0].getId(), "G1", "Original: first group");
		assert.equal(aGroups[1].getId(), "G2", "Original: second group");
		var aCustomData = oSmartForm.getCustomData();
		assert.equal(aCustomData.length, 1, "Original: Only one CustomData on SmartForm");
		assert.equal(aCustomData[0], oCustomData, "Original: CustomData");
		aCustomData = oGroup1.getCustomData();
		assert.equal(aCustomData.length, 1, "Original: Only one CustomData on Group1");
		assert.ok(aCustomData[0]._bFromSmartForm, "Original: CustomData on Group created by SmartForm");

		// check clone
		oForm = oClone.getAggregation("content");
		aGroups = oClone.getGroups();
		assert.ok(oForm && oForm instanceof Form, "Clone: internal Form created and assigned");
		assert.equal(aGroups.length, 2, "Clone: 2 groups");
		assert.equal(aGroups[0] ? aGroups[0].getId() : "", "G1-myClone", "Clone: first group");
		assert.equal(aGroups[1] ? aGroups[1].getId() : "", "G2-myClone", "Clone: second group");
		aCustomData = oClone.getCustomData();
		assert.equal(aCustomData.length, 1, "Clone: Only one CustomData on SmartForm");
		assert.equal(aCustomData[0].getId(), "CD1-myClone", "Clone: CustomData");
		aCustomData = aGroups[0].getCustomData();
		assert.equal(aCustomData.length, 1, "Clone: Only one CustomData on Group1");
		assert.ok(aCustomData[0]._bFromSmartForm, "Clone: CustomData on Group created by SmartForm");

		oClone.destroy();
	});

	function cloneExpandable(assert) {
		var oGroup1 = new Group("G1");
		var oGroup2 = new Group("G2");
		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);
		var oPanel = oSmartForm.getAggregation("content");
		var oForm = oPanel.getContent()[0];

		var oClone = oSmartForm.clone("myClone");

		// check if original is still OK
		assert.equal(oPanel, oSmartForm.getAggregation("content"), "Original: Panel is still in content");
		assert.equal(oForm, oPanel.getContent()[0], "Original: Form is still in Panel");

		// check clone
		oPanel = oClone.getAggregation("content");
		oForm = oPanel.getContent()[0];
		assert.ok(oPanel && oPanel instanceof Panel, "Clone: internal Panel created and assigned");
		assert.ok(oForm && oForm instanceof Form, "Clone: internal Form created and assigned to Panel");

		// fake panel expander to check that only clone get expanded
		oPanel.fireExpand({ expand : true });
		assert.notOk(oSmartForm.getExpanded(), "Expanded not set on Original");
		assert.ok(oClone.getExpanded(), "Expanded set on Clone");
		oClone.destroy();
	}

	QUnit.test("expandable", function(assert) {
		oSmartForm.setExpandable(true);
		asyncPanelTest(assert, cloneExpandable);
	});

	function cloneToolbar(assert) {
		var oGroup1 = new Group("G1");
		var oGroup2 = new Group("G2");
		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);
		var oToolbar = oSmartForm.getAggregation("toolbar");

		var oClone = oSmartForm.clone("myClone");

		// check if original is still OK
		assert.equal(oToolbar, oSmartForm.getAggregation("toolbar"), "Original: Toolbar is still the same");
		var aContent = oToolbar.getContent();
		assert.equal(aContent.length, 4, "Original: 4 items in Toolbar");

		// check clone
		oToolbar = oClone.getAggregation("toolbar");
		aContent = oToolbar.getContent();
		assert.ok(oToolbar, "Clone: Toolbar assigned");
		assert.equal(aContent.length, 4, "Clone: 4 items in Toolbar");
		assert.ok(aContent[0] instanceof Title, "Clone: first Content is title");
		assert.equal(aContent[0].getText(), "Title", "Clone: Title text");
		assert.ok(aContent[1] instanceof ToolbarSpacer, "Clone: second item is ToolbarSpacer");
		assert.ok(aContent[2] instanceof Button, "Clone: 3. item is Button");
		assert.equal(aContent[2].getIcon(), "sap-icon://display", "Clone: Edit icon on button");
		assert.ok(aContent[3] instanceof Button, "Clone: 4. item is Button");
		assert.equal(aContent[3].getText(), oRb.getText("SMART_FORM_CHECK"), "Clone: Text of button");
		var oEditButton = aContent[2];
		// fake button click
		oEditButton.firePress();
		assert.ok(oSmartForm.getEditable(), "Original: Edit mode not toggled");
		assert.notOk(oClone.getEditable(), "Clone: Edit mode toggled");

		oClone.destroy();
	}

	QUnit.test("with toolbar", function(assert) {
		oSmartForm.setTitle("Title");
		oSmartForm.setEditable(true);
		oSmartForm.setCheckButton(true);
		oSmartForm.setEditTogglable(true);
		asyncToolbarTest(assert, true, true, cloneToolbar);
	});

	function cloneCustomToolbar(assert) {
		var oCustomToolbar = sap.ui.getCore().byId("TB1");
		var oClone = oSmartForm.clone("myClone");

		// check if original is still OK
		var aContent = oCustomToolbar.getContent();
		assert.equal(aContent.length, 7, "Original: 4 items in Custom Toolbar");

		// check clone
		var oToolbar = oClone.getAggregation("toolbar");
		oCustomToolbar = oClone.getCustomToolbar();
		assert.notOk(oToolbar, "Clone: no internal Toolbar assigned");
		assert.ok(oCustomToolbar, "Clone: CustomToolbar assigned");
		assert.equal(oCustomToolbar.getId(), "TB1-myClone", "Clone: CustomToolbar cloned");
		aContent = oCustomToolbar.getContent();
		assert.equal(aContent.length, 7, "Clone: 7 items in Toolbar");
		assert.ok(aContent[0] instanceof Title, "Clone: first Content is title");
		assert.equal(aContent[0].getText(), "Title", "Clone: Title text");
		assert.equal(aContent[1].getId(), "B1-myClone", "Clone: second item is cloned button");
		assert.equal(aContent[2].getId(), "B2-myClone", "Clone: 3. item is cloned button");
		assert.ok(aContent[3] instanceof ToolbarSpacer, "Clone: 4. item is ToolbarSpacer");
		assert.ok(aContent[4] instanceof ToolbarSeparator, "Clone: 5. item is ToolbarSpeparator");
		assert.ok(aContent[5] instanceof Button, "Clone: 6. item is Button");
		assert.equal(aContent[5].getIcon(), "sap-icon://display", "Clone: Edit icon on button");
		assert.ok(aContent[6] instanceof Button, "Clone: 7. item is Button");
		assert.equal(aContent[6].getText(), oRb.getText("SMART_FORM_CHECK"), "Clone: Text of button");

		oClone.destroy();
	}

	QUnit.test("with customToolbar", function(assert) {
		var oCustomToolbar = new Toolbar("TB1", {
			content: [new Button("B1", {text: "Button 1"}), new Button("B2", {text: "Button 2"})]
		});
		oSmartForm.setCustomToolbar(oCustomToolbar);
		oSmartForm.setTitle("Title");
		oSmartForm.setEditable(true);
		oSmartForm.setCheckButton(true);
		oSmartForm.setEditTogglable(true);
		var oGroup1 = new Group("G1");
		var oGroup2 = new Group("G2");
		oSmartForm.addGroup(oGroup1);
		oSmartForm.addGroup(oGroup2);

		asyncToolbarTest(assert, true, true, cloneCustomToolbar);
	});

	QUnit.test("with Layout", function(assert) {
		var oLayout = new Layout("L1", {
			labelSpanXL: 7,
			labelSpanL: 6,
			labelSpanM: 5,
			labelSpanS: 4
		});
		oSmartForm.setLayout(oLayout);
		var oForm = oSmartForm.getAggregation("content");
		var oFormLayout = oForm.getLayout();

		var oClone = oSmartForm.clone("myClone");

		// check if original is still OK
		oLayout.setLabelSpanXL(8);
		assert.equal(oFormLayout.getLabelSpanXL(), 8, "Original: layout updates original");

		// check clone
		oLayout = oClone.getLayout();
		oForm = oClone.getAggregation("content");
		var oFormLayoutClone = oForm.getLayout();
		assert.equal(oLayout.getId(), "L1-myClone", "Clone: Layout cloned");
		assert.equal(oFormLayoutClone.getLabelSpanXL(), 7, "Clone: still original value");
		oLayout.setLabelSpanXL(9);
		assert.equal(oFormLayout.getLabelSpanXL(), 8, "Clone: layout don't updates original");
		assert.equal(oFormLayoutClone.getLabelSpanXL(), 9, "Clone: layout updates clone");
	});

});