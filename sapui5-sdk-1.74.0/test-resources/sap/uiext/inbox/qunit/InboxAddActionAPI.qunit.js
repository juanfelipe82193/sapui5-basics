/*global QUnit */
sap.ui.define([
	"jquery.sap.global",
	"./mockServer/InboxMockServerQUnit",
	"sap/ui/Device",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function(jQuery, InboxMockServerQUnit, Device, createAndAppendDiv) {
	"use strict";

	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");

	// setup mock server and inbox control
	InboxMockServerQUnit.setup();


	QUnit.module("Load");

	QUnit.test("InboxCreationOk", function(assert) {
		sap.ui.getCore().applyChanges();
		var oInbox = sap.ui.getCore().byId("inbox");
		assert.equal(false, (oInbox === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (oInbox === null), "Checking if the Inbox Control is created and is not null.");
	});


	QUnit.module("Checking if Buttons were created for custom actions using Add Action API");

	QUnit.asyncTest("Test Custom Action Button is created on using addAction API", function(assert) {
		var oInbox = sap.ui.getCore().byId("inbox");
		oInbox.addAction("customAction", "Custom Action Button", "Tooltip for Custom Action Button", true);
		sap.ui.getCore().applyChanges();
		var delayedCall = function() {
			var oActionToolbar = sap.ui.getCore().getControl("inbox--actionButtonsToolbarContainer");
			var oActionToolbarItems = oActionToolbar.getItems();
			var oCustomActionBtnWithTooltip = oActionToolbarItems[5];
			assert.equal(oCustomActionBtnWithTooltip.getId(), "inbox--customAction", "Checking if the Buttton is created");
			assert.equal(oCustomActionBtnWithTooltip.getText(), "Custom Action Button", "Checking label of CustomAction Button ");
			assert.equal(oCustomActionBtnWithTooltip.getTooltip(), "Tooltip for Custom Action Button", "Checking tooltip of CustomAction Button ");
			QUnit.start();
		};
		setTimeout(delayedCall, 0);

	});



	QUnit.module("Checking if Custom Button is not created if all the parameters are not provided to addAction Method");

	QUnit.asyncTest("Test Custom Action Button without tooltip is not created ", function(assert) {
		var oInbox = sap.ui.getCore().byId("inbox");
		if ( !(Device.browser.msie && Device.browser.version < 10)) {
			oInbox.addAction("CustomAction2", "Custom Action without ToolTip", true);
		}

		sap.ui.getCore().applyChanges();
		var delayedCall = function() {
			var oActionToolbar = sap.ui.getCore().getControl("inbox--actionButtonsToolbarContainer");
			var oActionToolbarItems = oActionToolbar.getItems();
			var oCustomActionBtnWithoutTooltip = oActionToolbarItems[6];
			assert.equal(true, (oCustomActionBtnWithoutTooltip === undefined), "Checking if the Buttton is not created if all parameters are not provided");

			QUnit.start();
		};
		setTimeout(delayedCall, 0);

	});
});