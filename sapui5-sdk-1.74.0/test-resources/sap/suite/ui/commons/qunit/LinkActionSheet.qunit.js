/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/LinkActionSheet",
	"sap/m/Button",
	"sap/m/library",
	"sap/ui/commons/Link",
	"sap/ui/thirdparty/jquery",
	"sap/ui/Device"
], function(
	QUnitUtils,
	createAndAppendDiv,
	LinkActionSheet,
	Button,
	mobileLibrary,
	Link,
	jQuery,
	Device
) {
	"use strict";

	// shortcut for sap.m.PlacementType
	var PlacementType = mobileLibrary.PlacementType;

	createAndAppendDiv("content");



	var oLinkActionSheet1 = new LinkActionSheet("linkActionSheet1", {
		showCancelButton: false,
		items: [
			new Button({
				icon: "sap-icon://accept",
				text: "Accept Action"
			}),
			new Button({
				icon: "sap-icon://decline",
				text: "Reject Action"
			}),
			new Button({
				text: "Default Action"
			})
		],
		placement: PlacementType.Bottom
	});

	var oLinkActionSheet2 = new LinkActionSheet("linkActionSheet2", {
		showCancelButton: false,
		items: [
			new Link({
				text: "SAP (new window)",
				href: "http://www.sap.com",
				target: "_blank"
			}),
			new Link({
				text: "SAP",
				href: "http://www.sap.com"
			})
		],
		placement: PlacementType.Bottom
	});

	var oLinkActionSheet3 = new LinkActionSheet("linkActionSheet3", {
		showCancelButton: false,
		items: [
			new Button({
				icon: "sap-icon://accept",
				text: "Accept Action"
			}),
			new Button({
				icon: "sap-icon://decline",
				text: "Reject Action"
			}),
			new Link({
				text: "SAP (new window)",
				href: "http://www.sap.com",
				target: "_blank"
			}),
			new Link({
				text: "SAP",
				href: "http://www.sap.com"
			}),
			new Button({
				text: "Default Action"
			})
		],
		placement: PlacementType.Bottom
	});

	var oLinkActionSheet4 = new LinkActionSheet("linkActionSheet4", {
		showCancelButton: true,
		title: "Title 1",
		items: [
			new Button({
				text: "Accept Action"
			}),
			new Button({
				text: "Reject Action"
			}),
			new Link({
				text: "SAP (new window)",
				href: "http://www.sap.com",
				target: "_blank"
			}),
			new Link({
				text: "SAP",
				href: "http://www.sap.com"
			}),
			new Button({
				text: "Default Action"
			})
		],
		placement: PlacementType.Bottom
	});


	var oButton = new Button({
		text : "Open LinkActionSheet"
	});

	oButton.placeAt("content");

	QUnit.module("Initial Check");

	QUnit.test("Initialization", function(assert){
		var done = assert.async();
		setTimeout(function(){
			assert.ok(!window.document.getElementById("linkActionSheet1"), "LinkActionSheet is not rendered before it's ever opened.");
			done();
		}, 1000);
	});

	QUnit.module("Open and Close - with Buttons only");

	QUnit.test("Open LinkActionSheet - - with buttons only", function(assert){
		var done = assert.async();
		oButton.attachEventOnce("press", function() {
			oLinkActionSheet1.openBy(this);
		});
		oButton.firePress();
		assert.ok(oLinkActionSheet1.isOpen(), "LinkActionSheet is already open");
		setTimeout(function(){
			var $linkActionSheet = jQuery(document.getElementById("linkActionSheet1")),
				$parentControl = Device.os.ios && Device.system.phone ? $linkActionSheet.closest(".sapMActionSheetDialog") : $linkActionSheet.closest(".sapMActionSheetPopover");
			assert.ok(window.document.getElementById("linkActionSheet1"), "LinkActionSheet is rendered after it's opened.");
			assert.ok($linkActionSheet.closest("#sap-ui-static")[0], "LinkActionSheet should be rendered inside the static uiArea.");
			assert.ok($parentControl[0], "LinkActionSheet is wrapped either in Popover or Dialog");
			done();
		}, 1000);
	});

	QUnit.test("Close LinkActionSheet", function(assert) {
		var done = assert.async();
		oLinkActionSheet1.close();

		setTimeout(function() {
			assert.equal(oLinkActionSheet1.isOpen(), false, "LinkActionSheet should be closed after closing");
			done();
		}, 1000);
	});

	QUnit.module("Open and Close - with Links only");

	QUnit.test("Open LinkActionSheet - - with links only", function(assert){
		var done = assert.async();
		oButton.attachEventOnce("press", function() {
			oLinkActionSheet2.openBy(this);
		});
		oButton.firePress();
		assert.ok(oLinkActionSheet2.isOpen(), "LinkActionSheet is already open");
		setTimeout(function(){
			var $linkActionSheet = jQuery(document.getElementById("linkActionSheet2")),
				$parentControl = Device.os.ios && Device.system.phone ? $linkActionSheet.closest(".sapMActionSheetDialog") : $linkActionSheet.closest(".sapMActionSheetPopover");
			assert.ok(window.document.getElementById("linkActionSheet2"), "LinkActionSheet is rendered after it's opened.");
			assert.ok($linkActionSheet.closest("#sap-ui-static")[0], "LinkActionSheet should be rendered inside the static uiArea.");
			assert.ok($parentControl[0], "LinkActionSheet is wrapped either in Popover or Dialog");
			done();
		}, 1000);
	});

	QUnit.test("Close LinkActionSheet", function(assert) {
		var done = assert.async();
		oLinkActionSheet2.close();

		setTimeout(function() {
			assert.equal(oLinkActionSheet2.isOpen(), false, "LinkActionSheet should be closed after closing");
			done();
		}, 1000);
	});

	QUnit.module("Open and Close - with Buttons and Links");

	QUnit.test("Open LinkActionSheet - - with Buttons and Links", function(assert){
		var done = assert.async();
		oButton.attachEventOnce("press", function() {
			oLinkActionSheet3.openBy(this);
		});
		oButton.firePress();
		assert.ok(oLinkActionSheet3.isOpen(), "LinkActionSheet is already open");
		setTimeout(function(){
			var $linkActionSheet = jQuery(document.getElementById("linkActionSheet3")),
				$parentControl = Device.os.ios && Device.system.phone ? $linkActionSheet.closest(".sapMActionSheetDialog") : $linkActionSheet.closest(".sapMActionSheetPopover");
			assert.ok(window.document.getElementById("linkActionSheet3"), "LinkActionSheet is rendered after it's opened.");
			assert.ok($linkActionSheet.closest("#sap-ui-static")[0], "LinkActionSheet should be rendered inside the static uiArea.");
			assert.ok($parentControl[0], "LinkActionSheet is wrapped either in Popover or Dialog");
			done();
		}, 1000);
	});

	QUnit.test("Close LinkActionSheet", function(assert) {
		var done = assert.async();
		oLinkActionSheet3.close();

		setTimeout(function() {
			assert.equal(oLinkActionSheet3.isOpen(), false, "LinkActionSheet should be closed after closing");
			done();
		}, 1000);
	});

	QUnit.module("Open and Close - with Iconless Buttons and Links");

	QUnit.test("Open LinkActionSheet - - with Iconless Buttons and Links", function(assert){
		var done = assert.async();
		oButton.attachEventOnce("press", function() {
			oLinkActionSheet4.openBy(this);
		});
		oButton.firePress();
		assert.ok(oLinkActionSheet4.isOpen(), "LinkActionSheet is already open");
		setTimeout(function(){
			var $linkActionSheet = jQuery(document.getElementById("linkActionSheet4")),
				$parentControl = Device.os.ios && Device.system.phone ? $linkActionSheet.closest(".sapMActionSheetDialog") : $linkActionSheet.closest(".sapMActionSheetPopover"),
				$links = $linkActionSheet.children(".sapUILinkActionSheetLink");
				assert.ok($links[0], "The 1st link was rendered");
				assert.ok($links[1], "The 2nd link was rendered");

			assert.ok(window.document.getElementById("linkActionSheet4"), "LinkActionSheet is rendered after it's opened.");
			assert.ok($linkActionSheet.closest("#sap-ui-static")[0], "LinkActionSheet should be rendered inside the static uiArea.");
			assert.ok($parentControl[0], "LinkActionSheet is wrapped either in Popover or Dialog");
			done();
		}, 1000);
	});

	QUnit.test("Close LinkActionSheet", function(assert) {
		var done = assert.async();
		oLinkActionSheet4.close();

		setTimeout(function() {
			assert.equal(oLinkActionSheet4.isOpen(), false, "LinkActionSheet should be closed after closing");
			done();
		}, 1000);
	});

	QUnit.module("Functional tests");

	QUnit.test("Functional tests", function(assert){
		oButton.attachEventOnce("press", function() {
			oLinkActionSheet4.openBy(this);
		});
		oButton.firePress();
		assert.ok(oLinkActionSheet4.isOpen(), "LinkActionSheet is already open");
		var oLinkActionSheet5 = oLinkActionSheet4.clone();
		var item1 = oLinkActionSheet5.getItems()[1];
		assert.equal(item1.getText(), "Reject Action", "LinkActionSheet should be cloned successfully");
		oLinkActionSheet5.removeItem(item1);
		assert.notEqual(oLinkActionSheet5.getItems()[1].getText(), "Reject Action", "The second item should no longer be Reject Action");
		oLinkActionSheet5.insertItem(item1,0);
		assert.equal(oLinkActionSheet5.getItems()[0].getText(), "Reject Action", "The first item should be Reject Action now");
		oLinkActionSheet5.removeAllItems();
		assert.equal(oLinkActionSheet5.getItems().length, 0, "There should be no items in list now");
		oLinkActionSheet4.close();
	});

});