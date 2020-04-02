/*global QUnit,sinon */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/simple/ContainerToolbarPlaceholder",
	"sap/gantt/library",
	"sap/gantt/config/SettingItem",
	"sap/ui/model/json/JSONModel",
	"sap/m/ButtonType",
	"sap/m/OverflowToolbar"
], function (Core, ContainerToolbar, ContainerToolbarPlaceholder, library, SettingItem, JSONModel, ButtonType, OverflowToolbar) {
	"use strict";

	var GanttChartWithTableDisplayType = library.simple.GanttChartWithTableDisplayType;
	var ContainerToolbarPlaceholderType = library.simple.ContainerToolbarPlaceholderType;

	var fnCheckOrder = function (assert, oToolbar, aIdOrder) {
		var aContent = oToolbar.$().children();
		for (var i = 0; i < aIdOrder.length; i++) {
			assert.equal(aContent[i].id, aIdOrder[i]);
		}
	};

	var fnCreateContainerToolbar = function () {
		var oToolbar = new ContainerToolbar("toolbar", {
			showDisplayTypeButton: true,
			showBirdEyeButton: true,
			showLegendButton: true,
			content: [
				new sap.m.Text({
					text: "This is gantt toolbar--"
				}),
				new sap.m.Button({
					text: "Test"
				})
			],
			settingItems: [
				new SettingItem({
					key: "firstItem",
					displayText: "I am setting Item",
					checked: true
				}),
				new SettingItem({
					key: "secondItem",
					displayText: "{settings>/text}",
					checked: "{settings>/checked}"
				})
			]
		});

		var oSettingItem1 = new SettingItem({
			key: "addedItem",
			displayText: "Added by add method in code",
			checked: true
		});

		var oSettingItem2 = new SettingItem({
			key: "insertedItem",
			displayText: "Added by insert method in code",
			checked: true
		});
		oToolbar.addSettingItem(oSettingItem1);
		oToolbar.insertSettingItem(oSettingItem2, 0);
		oToolbar.setModel(new JSONModel({
			"text": "Settings checkbox text",
			"checked": true
		}), "settings");

		return oToolbar;
	};

	var oToolbar = fnCreateContainerToolbar();
	oToolbar.placeAt("content");
	Core.applyChanges();

	QUnit.module("ContainerToolbar");

	QUnit.test("Test content number." , function (assert) {
		assert.strictEqual(oToolbar.getContent().length, 8);
	});

	QUnit.test("Test content control." , function (assert) {
		var aContentControl = oToolbar.getContent();
		assert.strictEqual(aContentControl[0].getText(), "This is gantt toolbar--");

		var done = assert.async();
		aContentControl[1].attachPress(function(oEvent){
			assert.strictEqual(oEvent.getSource().getText(), "Test");
			done();
		});
		aContentControl[1].firePress();
	});

	QUnit.test("Test bird eye button." , function (assert) {
		var done = assert.async();
		oToolbar.attachEventOnce("birdEyeButtonPress", function(oEvent){
			assert.ok(true);
			done();
		});
		oToolbar._oBirdEyeButton.firePress();
	});

	QUnit.test("Test zoom in button." , function (assert) {
		var done = assert.async();
		oToolbar.attachEventOnce("zoomStopChange", function(oEvent){
			assert.strictEqual(oEvent.getParameter("index"), 1);
			done();
		});
		oToolbar._oZoomInButton.firePress();
	});

	QUnit.test("Test zoom out button." , function (assert) {
		var done = assert.async();
		oToolbar.attachEventOnce("zoomStopChange", function(oEvent){
			assert.strictEqual(oEvent.getParameter("index"), 0);
			done();
		});
		oToolbar._oZoomOutButton.firePress();
	});

	QUnit.test("Test setting items." , function (assert) {
		var done = assert.async();

		oToolbar._oSettingsButton.firePress();

		setTimeout(function(){
			var oToolbar = Core.byId("toolbar");
			assert.ok(oToolbar._oSettingsDialog.getDomRef() !== null);

			var aReferenceKey = ["insertedItem", "firstItem", "secondItem", "addedItem"];

			var oSettingItems = oToolbar._oSettingsBox.getItems();
			assert.equal(oSettingItems.length, 4);

			for (var i = 0; i < oSettingItems.length; i++) {
				var oCheckBox = oSettingItems[i];
				assert.equal(oCheckBox.getName(), aReferenceKey[i]);
			}

			oToolbar._oSettingsDialog._getDialog().close();
			done();
		}, 500);
	});

	QUnit.test("Test showSettingButton." , function (assert) {
		oToolbar.setShowSettingButton(false);
		Core.applyChanges();
		assert.strictEqual(oToolbar.getShowSettingButton(), false);
		assert.strictEqual(oToolbar.getContent().length, 7);
	});

	QUnit.test("Test displayTypeButton." , function (assert) {
		var done = assert.async(),
			aButtonItems = oToolbar._oDisplayTypeSegmentedButton.getItems();

		assert.expect(4);

		assert.equal(aButtonItems[0].getKey(), GanttChartWithTableDisplayType.Both);
		assert.equal(aButtonItems[1].getKey(), GanttChartWithTableDisplayType.Chart);
		assert.equal(aButtonItems[2].getKey(), GanttChartWithTableDisplayType.Table);

		oToolbar.attachEventOnce("displayTypeChange", function(oEvent){
			assert.strictEqual(oEvent.getParameter("displayType"), GanttChartWithTableDisplayType.Chart);
			done();
		});
		oToolbar._oDisplayTypeSegmentedButton.fireSelectionChange({
			item: oToolbar._oDisplayTypeSegmentedButton.getItems()[1]
		});
	});

	QUnit.test("Toolbar content alignment", function (assert) {
		var sButtonId = "testButton1",
			oToolbar = new ContainerToolbar({
				content: [
					new sap.m.Button(sButtonId, {
						text: "Test"
					})
				]
			}),
			sSpacerId = oToolbar.oToolbarSpacer.getId(),
			sSettingButtonId = oToolbar._genSettings().getId(),
			sTimeZoomFlexId = oToolbar._genTimeZoomFlexBox().getId(),
			aIdOrder;

		assert.expect(18);

		oToolbar.placeAt("content");
		Core.applyChanges();

		assert.notOk(oToolbar.getAlignCustomContentToRight(), "By default the custom content is aligned to left");

		aIdOrder = [sButtonId, sSpacerId, sTimeZoomFlexId, sSettingButtonId];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.setAlignCustomContentToRight(true);
		Core.applyChanges();
		assert.ok(oToolbar.getAlignCustomContentToRight(), "The custom content is aligned to right");

		aIdOrder = [sSpacerId, sButtonId, sTimeZoomFlexId, sSettingButtonId];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.setAlignCustomContentToRight(false);
		oToolbar.insertContent(new ContainerToolbarPlaceholder({type: ContainerToolbarPlaceholderType.Spacer}), 0);
		Core.applyChanges();
		aIdOrder = [sSpacerId, sButtonId, sTimeZoomFlexId, sSettingButtonId];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.setAlignCustomContentToRight(true);
		Core.applyChanges();
		aIdOrder = [sSpacerId, sButtonId, sTimeZoomFlexId, sSettingButtonId];
		fnCheckOrder(assert, oToolbar, aIdOrder);
	});

	QUnit.test("Test buttons type", function (assert) {
		assert.expect(5);

		assert.equal(oToolbar._oBirdEyeButton.getType(), ButtonType.Transparent);
		assert.equal(oToolbar._oZoomInButton.getType(), ButtonType.Transparent);
		assert.equal(oToolbar._oZoomOutButton.getType(), ButtonType.Transparent);
		assert.equal(oToolbar._oSettingsButton.getType(), ButtonType.Transparent);
		assert.equal(oToolbar._oLegendButton.getType(), ButtonType.Transparent);
	});

	QUnit.test("Test buttons placeholder", function (assert) {
		var oToolbar = new ContainerToolbar({
				showDisplayTypeButton: true,
				showBirdEyeButton: true,
				showLegendButton: true
			}),
			oSomeButton = new sap.m.Button({text: "Button"}),
			sSomeButton = oSomeButton.getId(),
			sSpacer = oToolbar.oToolbarSpacer.getId(),
			sBirdEyeButton = oToolbar._genBirdEyeButton().getId(),
			sLegendButton = oToolbar._genLegend().getId(),
			sSettingButton = oToolbar._genSettings().getId(),
			sTimeZoomFlex = oToolbar._genTimeZoomFlexBox().getId(),
			sDisplayTypeButton = oToolbar._genDisplayTypeButton().getId(),
			sLegendButtonPlaceholder = "legendButtonPlaceholder",
			sTimeZoomPlaceholder = "timeZoomPlaceholder",
			sPlaceholderId = "testingPlaceholder",
			oPlaceholder, aIdOrder;

		oToolbar.placeAt("content");
		Core.applyChanges();

		oToolbar.insertContent(oSomeButton, 0);
		Core.applyChanges();
		aIdOrder = [sSomeButton, sSpacer, sBirdEyeButton, sTimeZoomFlex, sLegendButton, sSettingButton, sDisplayTypeButton];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.insertContent(new ContainerToolbarPlaceholder(sLegendButtonPlaceholder, {type: ContainerToolbarPlaceholderType.LegendButton}), 0);
		Core.applyChanges();
		aIdOrder = [sLegendButtonPlaceholder, sSomeButton, sSpacer, sBirdEyeButton, sTimeZoomFlex, sSettingButton, sDisplayTypeButton];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.addContent(new ContainerToolbarPlaceholder(sTimeZoomPlaceholder, {type: ContainerToolbarPlaceholderType.TimeZoomControl}));
		Core.applyChanges();
		aIdOrder = [sLegendButtonPlaceholder, sSomeButton, sSpacer, sBirdEyeButton, sSettingButton, sDisplayTypeButton, sTimeZoomPlaceholder];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.setZoomControlType(sap.gantt.config.ZoomControlType.Select);
		Core.applyChanges();
		aIdOrder = [sLegendButtonPlaceholder, sSomeButton, sSpacer, sBirdEyeButton, sSettingButton, sDisplayTypeButton, sTimeZoomPlaceholder];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oToolbar.insertContent(new ContainerToolbarPlaceholder({type: ContainerToolbarPlaceholderType.Spacer}), 0);
		Core.applyChanges();
		aIdOrder = [sSpacer, sLegendButtonPlaceholder, sSomeButton, sBirdEyeButton, sSettingButton, sDisplayTypeButton, sTimeZoomPlaceholder];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		// Only one placeholder for type is rendered
		oPlaceholder = new ContainerToolbarPlaceholder(sPlaceholderId, {type: ContainerToolbarPlaceholderType.Spacer});
		oToolbar.addContent(oPlaceholder);
		Core.applyChanges();
		aIdOrder = [sLegendButtonPlaceholder, sSomeButton, sBirdEyeButton, sSettingButton, sDisplayTypeButton, sTimeZoomPlaceholder, sSpacer];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		// Test change placeholder type
		oToolbar.removeContent(oPlaceholder);
		oToolbar.insertContent(oPlaceholder, 0);
		oPlaceholder.setType(ContainerToolbarPlaceholderType.DisplayTypeButton);
		Core.applyChanges();
		aIdOrder = [sPlaceholderId, sSpacer, sLegendButtonPlaceholder, sSomeButton, sBirdEyeButton,  sSettingButton, sTimeZoomPlaceholder];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		oPlaceholder.setType(ContainerToolbarPlaceholderType.SettingButton);
		Core.applyChanges();
		aIdOrder = [sPlaceholderId, sSpacer, sLegendButtonPlaceholder, sSomeButton, sBirdEyeButton, sTimeZoomPlaceholder, sDisplayTypeButton];
		fnCheckOrder(assert, oToolbar, aIdOrder);

		// Test hiding button
		oToolbar.setShowSettingButton(false);
		Core.applyChanges();
		aIdOrder = [sSpacer, sLegendButtonPlaceholder, sSomeButton, sBirdEyeButton, sTimeZoomPlaceholder, sDisplayTypeButton];
		fnCheckOrder(assert, oToolbar, aIdOrder);
	});

	QUnit.test("Destroy and reinitialize", function (assert) {
		var oParentExitSpy = sinon.spy(OverflowToolbar.prototype, "exit");

		oToolbar.destroy();

		assert.ok(oParentExitSpy.called, "OverflowToolbar (parent) exit method should be called during destroy.");

		var oSecondToolbar = fnCreateContainerToolbar();

		assert.ok(typeof oSecondToolbar !== "undefined", "Reinitialization should work without errors.");

		oParentExitSpy.restore();
	});

});
