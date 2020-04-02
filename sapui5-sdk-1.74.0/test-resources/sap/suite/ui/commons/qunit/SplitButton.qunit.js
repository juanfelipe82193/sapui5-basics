/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/SplitButton",
	"sap/ui/commons/Menu",
	"sap/ui/commons/MenuItem",
	"sap/ui/commons/library"
], function(
	QUnitUtils,
	createAndAppendDiv,
	SplitButton,
	Menu,
	MenuItem,
	commonsLibrary
) {
	"use strict";

	// shortcut for sap.ui.commons.ButtonStyle
	var ButtonStyle = commonsLibrary.ButtonStyle;

	createAndAppendDiv("qunit-fixture-0");
	createAndAppendDiv("qunit-fixture-1");
	createAndAppendDiv("qunit-fixture-2");
	createAndAppendDiv("qunit-fixture-3");
	createAndAppendDiv("qunit-fixture-4");
	createAndAppendDiv("qunit-fixture-5");
	createAndAppendDiv("qunit-fixture-6");
	createAndAppendDiv("qunit-fixture-7");
	createAndAppendDiv("qunit-fixture-8");
	createAndAppendDiv("qunit-fixture-9");
	createAndAppendDiv("qunit-fixture-10");
	createAndAppendDiv("qunit-fixture-11");
	createAndAppendDiv("qunit-fixture-12");



	var sId1 = "id1";
	var oSplitButton = new SplitButton({
	id:sId1
	});

	var sPressMessage = "Button Pressed Event!";
	var sMsg = null;

	function pressEventHandler() {
		sMsg = sPressMessage;
	}

	var oMenu1	= new Menu("menu1");
	var oMenuItem1 = new MenuItem("menuitem1", {text:"Item1"});
	oMenu1.addItem(oMenuItem1);
	var oMenuItem2 = new MenuItem("menuitem2", {text:"Item2", select: pressEventHandler});
	oMenu1.addItem(oMenuItem2);

	oSplitButton.setMenu(oMenu1, oMenuItem2);

	oSplitButton.placeAt("qunit-fixture-0");


	QUnit.module("Control Rendering test - sap.suite.ui.commons.SplitButton");

	QUnit.test("testRenderedOK", function(assert) {
		assert.notEqual(sId1 ? window.document.getElementById(sId1) : null, null, "SplitButton outer HTML Element should be rendered.");
	});

	QUnit.test("testDefaultActionButtonRenderedOK", function(assert) {
		assert.notEqual(sId1 + "-defaultActionButton" ? window.document.getElementById(sId1 + "-defaultActionButton") : null, null, "DefaultActionButton HTML Element should be rendered.");
	});

	QUnit.test("testMenuButtonRenderedOK", function(assert) {
		assert.notEqual(sId1 + "-menuButton" ? window.document.getElementById(sId1 + "-menuButton") : null, null, "MenuButton HTML Element should be rendered.");
	});

	/************************************************************************************************/

	var oSB = null, oM = null, oM2 = null, oM3 = null,
		oMI1 = null, oMI2 = null, oMI2_1 = null, oMI2_2 = null,
		oMI3 = null, oMI3_1 = null, oMI3_2 = null, oMI3_3 = null, oMI3_4 = null,
		sMId = null,
		sMI1Msg = "oMI1_Select";

	var iMATIndex = 1;

	QUnit.module("Menu Aggregation test - sap.suite.ui.commons.SplitButton", {
		beforeEach: function (){
			// create menu
			oM = new Menu("mMAT-" + iMATIndex);
			sMId = oM.getId();
			// create splitButton
			oSB = new SplitButton("smbMAT-" + iMATIndex);

			iMATIndex++;
		}
	});

	QUnit.test("SettingMenuViaConstructorOk", function(assert){
		var oSmb = new SplitButton("smbMAT-smc", {menu: oM});
		assert.ok(oSmb.getMenu(), "Menu is set");
	});

	QUnit.test("SettingMenuOk", function(assert){
		assert.ok(!oSB.getMenu(), "Menu has not been set");
		oSB.setMenu(oM);
		assert.ok(oSB.getMenu(), "Menu has been set");
	});

	QUnit.test("DestroyMenuOk", function(assert){
		oSB.setMenu(oM);
		assert.ok(oSB.getMenu(), "Menu has been set");
		oSB.destroyMenu();
		assert.ok(!oSB.getMenu(), "Menu has been destroyed");
	});

	/************************************************************************************************/

	var iABTIndex = 1;
	QUnit.module("Action Button QUnit.test - sap.suite.ui.commons.SplitButton", {
		beforeEach: function (){
			// create menu
			oM = new Menu("m-" + iABTIndex);
			sMId = oM.getId();
			// create splitButton
			oSB = new SplitButton("smb-" + iABTIndex);

			// default menu item event and message
			var oMI1_Select = function () {
				sMsg = sMI1Msg;
			};
			oMI1 = new MenuItem(sMId + "-item1" , {text: sMId + " item1", select: oMI1_Select});

			// other menu items
			oMI2 = new MenuItem(sMId + "-item2" , {text: sMId + " item2"});
			oMI3 = new MenuItem(sMId + "-item3" , {text: sMId + " item3"});
			oM.addItem(oMI1);
			oM.addItem(oMI2);
			oM.addItem(oMI3);

			oMI2_1 = new MenuItem(sMId + "-item2-subitem1", {text: sMId + " item2 subitem1"});
			oMI2_2 = new MenuItem(sMId + "-item2-subitem2", {text: sMId + " item2 subitem2"});
			oM2 = new Menu(sMId + "-m-2");
			oM2.addItem(oMI2_1);
			oM2.addItem(oMI2_2);
			oMI2.setSubmenu(oM2);

			oMI3_1 = new MenuItem(sMId + "-item3-subitem1", {text: sMId + " item3 subitem1"});
			oMI3_2 = new MenuItem(sMId + "-item3-subitem2", {text: sMId + " item3 subitem2"});
			oMI3_3 = new MenuItem(sMId + "-item3-subitem3", {text: sMId + " item3 subitem3", icon: "../images/mail.gif", tooltip: "Email", enabled: false});
			oMI3_4 = new MenuItem(sMId + "-item3-subitem4", {text: sMId + " item3 subitem4"});
			oM3 = new Menu(sMId + "-m-3");
			oM3.addItem(oMI3_1);
			oM3.addItem(oMI3_2);
			oM3.addItem(oMI3_3);
			oM3.addItem(oMI3_4);
			oMI3.setSubmenu(oM3);

			oSB.placeAt('qunit-fixture-' + iABTIndex);

			//increment index for IDs in the setup;
			iABTIndex++;
		}
		//afterEach: function(){},
	});

	// QUnit.test that default menu item can be set correctly via constructor
	QUnit.test("InitializeSplitButtonWithMenu", function(assert){
		var oSmb = new SplitButton("smb-ABT", {menu: oM});
		assert.ok(oSmb._oDefaultActionButton.getText() === oMI1.getText(), "Action button text is set to the first menu item text");
		// prepare to fire the event
		sMsg = null;
		oSmb._oDefaultActionButton.firePress();
		assert.ok(sMsg == sMI1Msg, "Default event was fired!");
	});

	// QUnit.test menu without any items - no default action is set
	QUnit.test("EmptyMenuOk", function (assert) {
		oSB.setMenu(new Menu("empty-menu"), null);
		assert.ok(!oSB._oDefaultActionButton.getText(), "Action button text is empty");
		assert.ok(oSB.getMenu(), "Menu is set");
	});

	// If the menu item is not set the default menu item is used
	QUnit.test("DefaultMenuItemOk", function (assert) {
		oSB.setMenu(oM);
		assert.ok(oSB._oDefaultActionButton.getText() === oMI1.getText(), "Action button text is set to the first menu item text");
		// prepare to fire the event
		sMsg = null;
		oSB._oDefaultActionButton.firePress();
		assert.ok(sMsg == sMI1Msg, "Default event was fired!");
		assert.ok(oSB.getMenu(), "Menu is set");
	});

	// QUnit.test that first item in the menu is used when the app developer is setting incorrect menuitem
	QUnit.test("SettingIncorrectMenuItemOk", function (assert) {
		oSB.setMenu(oM, new MenuItem("new-mi1", {text: "new-mi1", select: pressEventHandler}));
		assert.ok(oSB._oDefaultActionButton.getText() !== "new-mi1", "Action button text is not set to incorrect menu item");
		assert.ok(oSB._oDefaultActionButton.getText() === oMI1.getText(), "Action button text is set to the first menu item text");
		// prepare to fire the event
		sMsg = null;
		oSB._oDefaultActionButton.firePress();
		assert.ok(sMsg != sPressMessage, "False event wasn't fired!");
		assert.ok(sMsg == sMI1Msg, "Default event was fired!");
		assert.ok(oSB.getMenu(), "Menu is set");
	});

	// set the correct menu item
	QUnit.test("SettingCorrectMenuItemOk", function (assert) {
		oMI3_2.attachSelect(pressEventHandler);
		oSB.setMenu(oM, oMI3_2);
		assert.ok(oSB._oDefaultActionButton.getText(), "Action button text exists");
		// prepare to fire the event
		sMsg = null;
		oSB._oDefaultActionButton.firePress();
		assert.ok(sMsg == sPressMessage, "Event was fired!");
		assert.ok(oSB.getMenu(), "Menu is set");
	});

	QUnit.test("DefaultButtonPropertiesOk", function (assert) {
		oSB.setMenu(oM, oMI3_3);
		assert.ok(oSB._oDefaultActionButton.getText(), "Action button text exists");
		assert.ok(oSB._oDefaultActionButton.getText() === oMI3_3.getText(), "Action button text is set to the menu item text");
		assert.ok(oSB._oDefaultActionButton.getIcon() === oMI3_3.getIcon(), "Action button icon is set to the menu item icon");
		assert.ok(oSB._oDefaultActionButton.getTooltip() === oMI3_3.getTooltip(), "Action button tooltip is set to the menu item tooltip");
		assert.ok(oSB._oDefaultActionButton.getEnabled() === oMI3_3.getEnabled(), "Action button enabled is set to the menu item enabled");
	});

	QUnit.test("ModifyMenuItemDefaultButtonPropertiesOk", function (assert) {
		oSB.setMenu(oM, oMI3_3);
		oMI3_3.setText("New Text");
		oMI3_3.setIcon("../images/help.gif");
		oMI3_3.setTooltip("New Tooltip");
		oMI3_3.setEnabled(true);

		assert.ok(oSB._oDefaultActionButton.getText(), "Action button text exists");
		assert.ok(oSB._oDefaultActionButton.getText() === oMI3_3.getText(), "Action button text is set to the menu item text");
		assert.ok(oSB._oDefaultActionButton.getIcon() === oMI3_3.getIcon(), "Action button icon is set to the menu item icon");
		assert.ok(oSB._oDefaultActionButton.getTooltip() === oMI3_3.getTooltip(), "Action button tooltip is set to the menu item tooltip");
		assert.ok(oSB._oDefaultActionButton.getEnabled() === oMI3_3.getEnabled(), "Action button enabled is set to the menu item enabled");
	});

	QUnit.test("MenuItemNotVisibleOk", function (assert) {
		oSB.setMenu(oM, oMI3_4);
		assert.ok(oSB._oDefaultActionButton.getText(), "Action button text exists");
		assert.ok(oSB._oDefaultActionButton.getText() === oMI3_4.getText(), "Action button text is set to menu item text");
		oMI3_4.setVisible(false);
		assert.ok(oSB._oDefaultActionButton.getText() === oMI1.getText(), "Action button text is set to the first menu item text");
	});

	QUnit.test("MenuItemEnabledInterceptorOk", function (assert) {
		oSB.setMenu(oM, oMI3_4);
		oSB.setEnabled(true);
		oMI3_4.setEnabled(false);

		assert.ok(!oSB._oDefaultActionButton.getEnabled(), "Action button is disabled");
		assert.ok(oSB.getEnabled(), "Split Button is enabled");
		assert.ok(!oMI3_4.getEnabled(), "MenuItem is disabled");
	});

	QUnit.test("MenuItemTooltipInterceptorOk", function (assert) {
		oSB.setMenu(oM, oMI3_4);
		oMI3_4.setTooltip("menuitem_tooltip");

		assert.equal(oSB._oDefaultActionButton.getTooltip(), "menuitem_tooltip", "Action button tooltip is same");
	});

	QUnit.test("MenuItemIconInterceptorOk", function (assert) {
		oSB.setMenu(oM, oMI3_4);
		oMI3_4.setIcon("../images/mail.gif");
		assert.equal(oSB._oDefaultActionButton.getIcon(), oMI3_4.getIcon(), "Icons are same");
		oSB.setIcon("../images/help.gif");
		oMI3_4.setIcon("../images/mail.gif");
		assert.notEqual(oSB._oDefaultActionButton.getIcon(), oMI3_4.getIcon(), "Icons are not same");
	});

	QUnit.test("MenuItemTextInterceptorOk", function (assert) {
		oSB.setMenu(oM, oMI3_4);
		oMI3_4.setText("oldtext");
		assert.equal(oSB._oDefaultActionButton.getText(), oMI3_4.getText(), "Texts are same");
		oSB.setText("newtext");
		oMI3_4.setText("oldtext");
		assert.notEqual(oSB._oDefaultActionButton.getText(), oMI3_4.getText(), "Texts are not same");
	});

	/************************************************************************************************/

	var oSegMenuBthDef = null, oSegMenuBthSet = null;
	QUnit.module("Property QUnit.test - sap.suite.ui.commons.SplitButton", {
		beforeEach: function (){
			oSegMenuBthDef = new SplitButton();
			oSegMenuBthSet = new SplitButton(
							{lite:true, enabled:false, visible:false, styled:false,
							 iconFirst:false, icon:"../images/help.gif", text:"Hi", style:ButtonStyle.Reject});
		}
	});

	// default properties are set correctly
	QUnit.test("DefaultPropertyOk", function(assert){
		assert.equal(oSegMenuBthDef.getEnabled(), true, "Enabled Property is true");
		assert.equal(oSegMenuBthDef.getVisible(), true, "Visible Property is true");
		assert.equal(oSegMenuBthDef.getLite(), false, "Lite Property is false");
		assert.equal(oSegMenuBthDef.getStyled(), true, "Styled Property is true");
		assert.equal(oSegMenuBthDef.getIconFirst(), true, "Icon First Property is true");
		assert.equal(oSegMenuBthDef.getIcon(), '', "Icon Property is empty");
		assert.equal(oSegMenuBthDef.getText(), '', "Text Property is empty");
		assert.equal(oSegMenuBthDef.getStyle(), ButtonStyle.Default, "Style Property is sap.ui.commons.ButtonStyle.Default");
	});

	// set properties are set correctly
	QUnit.test("SettingPropertyOk", function(assert){
		assert.equal(oSegMenuBthSet.getEnabled(), false, "Enabled Property is false");
		assert.equal(oSegMenuBthSet.getVisible(), false, "Visible Property is false");
		assert.equal(oSegMenuBthSet.getLite(), true, "Lite Property is true");
		assert.equal(oSegMenuBthSet.getStyled(), false, "Styled Property is false");
		assert.equal(oSegMenuBthSet.getIconFirst(), false, "Icon First Property is false");
		assert.notEqual(oSegMenuBthSet.getIcon(), '', "Icon Property is not empty");
		assert.notEqual(oSegMenuBthSet.getText(), '', "Text Property is not empty");
		assert.notEqual(oSegMenuBthSet.getStyle(), ButtonStyle.Default, "Style Property is not sap.ui.commons.ButtonStyle.Default");
	});
});