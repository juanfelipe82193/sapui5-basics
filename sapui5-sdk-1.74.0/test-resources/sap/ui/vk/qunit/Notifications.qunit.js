/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/Messages",
	"sap/ui/vk/Notifications",
	"sap/ui/vk/getResourceBundle"
], function(
	jQuery,
	Messages,
	Notifications,
	getResourceBundle
) {
	"use strict";

	QUnit.test("Notifications", function(assert) {
			// Testing Instance
			var notifications = new Notifications().placeAt("content"),
				messagePopover = notifications.getAggregation("_messagePopover");

			assert.ok(messagePopover instanceof sap.m.MessagePopover, "testing constructor");

			// Items should be empty on 1st load
			assert.strictEqual(messagePopover.getItems().length, 0, "item length is 0 to begin with.");

			// Items added to message popover control
			var resourceBundle = getResourceBundle();
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			assert.strictEqual(messagePopover.getItems().length, 1, "one item added. 1 item in list.");

			// 3 errors loaded
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			assert.strictEqual(messagePopover.getItems().length, 4, "4 errors added. 4 items in list.");

			// Clear resets counter to 0
			notifications.clearAllMessages();
			assert.strictEqual(messagePopover.getItems().length, 0, "items in list cleared. counter = 0");

			// Raising errors from two different components
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT16.summary), Messages.VIT16.code, "sap.ui.vk.Viewer");
			assert.strictEqual(messagePopover.getItems().length, 2, "2 items added from 2 different components");

			// Clear all items
			notifications.clearAllMessages();
			assert.strictEqual(messagePopover.getItems().length, 0, "Counter reset to 0");

			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			assert.strictEqual(messagePopover.getItems().length, 1, "Add one error to list items");

			// Clear all items
			notifications.clearAllMessages();
			assert.strictEqual(messagePopover.getItems().length, 0, "Counter reset to 0");

			// 2 errors from 2 different components
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT16.summary), Messages.VIT16.code, "sap.ui.vk.Viewer");
			assert.strictEqual(messagePopover.getItems().length, 2, "Two errors from different components");

			// Clear all items
			notifications.clearAllMessages();
			assert.strictEqual(messagePopover.getItems().length, 0, "Counter reset to 0");

			// 3 errors from 3 different components
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT16.summary), Messages.VIT16.code, "sap.ui.vk.Viewer");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT5.summary), Messages.VIT5.code, "sap.ui.vk.DownloadManager");
			assert.strictEqual(messagePopover.getItems().length, 3, "Three errors from Three different components");

			// Clear all items
			notifications.clearAllMessages();
			assert.strictEqual(messagePopover.getItems().length, 0, "Counter reset to 0");

			// 4 errors from 4 different components
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT16.summary), Messages.VIT16.code, "sap.ui.vk.Viewer");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT5.summary), Messages.VIT5.code, "sap.ui.vk.DownloadManager");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT6.summary), Messages.VIT6.code, "sap.ui.vk.NodeHierarchy");
			assert.strictEqual(messagePopover.getItems().length, 4, "Four errors from four different components");

			// Clear all items
			notifications.clearAllMessages();
			assert.strictEqual(messagePopover.getItems().length, 0, "Counter reset to 0");

			// 5 errors from 5 different components
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT16.summary), Messages.VIT16.code, "sap.ui.vk.Viewer");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT5.summary), Messages.VIT5.code, "sap.ui.vk.DownloadManager");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT6.summary), Messages.VIT6.code, "sap.ui.vk.NodeHierarchy");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT11.summary), Messages.VIT11.code, "sap.ui.vk.Overlay");
			assert.strictEqual(messagePopover.getItems().length, 5, "Five errors from five different components");

			// Clear all items
			notifications.clearAllMessages();
			assert.strictEqual(messagePopover.getItems().length, 0, "Counter reset to 0");

			// 6 errors from 6 different components
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT16.summary), Messages.VIT16.code, "sap.ui.vk.Viewer");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT5.summary), Messages.VIT5.code, "sap.ui.vk.DownloadManager");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT6.summary), Messages.VIT6.code, "sap.ui.vk.NodeHierarchy");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT11.summary), Messages.VIT11.code, "sap.ui.vk.Overlay");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT12.summary), Messages.VIT12.code, "sap.ui.vk.StepNavigation");
			assert.strictEqual(messagePopover.getItems().length, 6, "Six errors from six different components");

			// Clear all items
			notifications.clearAllMessages();
			assert.strictEqual(messagePopover.getItems().length, 0, "Counter reset to 0");

			// 7 errors from 7 different components
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT16.summary), Messages.VIT16.code, "sap.ui.vk.Viewer");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT5.summary), Messages.VIT5.code, "sap.ui.vk.DownloadManager");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT6.summary), Messages.VIT6.code, "sap.ui.vk.NodeHierarchy");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT11.summary), Messages.VIT11.code, "sap.ui.vk.Overlay");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT12.summary), Messages.VIT12.code, "sap.ui.vk.StepNavigation");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT18.summary), Messages.VIT18.code, "sap.ui.vk.Viewport");
			assert.strictEqual(messagePopover.getItems().length, 7, "Seven errors from seven different components");

			// 7 more errors added. Each component should have 2 of the same type.
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT16.summary), Messages.VIT16.code, "sap.ui.vk.Viewer");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT5.summary), Messages.VIT5.code, "sap.ui.vk.DownloadManager");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT6.summary), Messages.VIT6.code, "sap.ui.vk.NodeHierarchy");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT11.summary), Messages.VIT11.code, "sap.ui.vk.Overlay");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT12.summary), Messages.VIT12.code, "sap.ui.vk.StepNavigation");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT18.summary), Messages.VIT18.code, "sap.ui.vk.Viewport");
			assert.strictEqual(messagePopover.getItems().length, 14, "14 errors from seven different components");

			// Clear all items
			notifications.clearAllMessages();
			assert.strictEqual(messagePopover.getItems().length, 0, "Counter reset to 0");

			// Raising errors from two different components
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT5.summary), Messages.VIT5.code, "sap.ui.vk.DownloadManager");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT14.summary), Messages.VIT14.code, "sap.ui.vk.Viewer");
			assert.strictEqual(messagePopover.getItems().length, 2, "2 items added from 2 different components");

			// Clear all items
			notifications.clearAllMessages();
			assert.strictEqual(messagePopover.getItems().length, 0, "Counter reset to 0");

			// 1 item added to list
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			assert.strictEqual(messagePopover.getItems().length, 1, "1 item added to list");

			// 2 items added to list
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT16.summary), Messages.VIT16.code, "sap.ui.vk.Viewer");
			assert.strictEqual(messagePopover.getItems().length, 2, "2 items added to list");

			// 3 items added to list
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT5.summary), Messages.VIT5.code, "sap.ui.vk.DownloadManager");
			assert.strictEqual(messagePopover.getItems().length, 3, "3 items added to list");

			// 4 items added to list
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT6.summary), Messages.VIT6.code, "sap.ui.vk.NodeHierarchy");
			assert.strictEqual(messagePopover.getItems().length, 4, "4 items added to list");

			// 5 items added to list
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT11.summary), Messages.VIT11.code, "sap.ui.vk.Overlay");
			assert.strictEqual(messagePopover.getItems().length, 5, "5 items added to list");

			// 6 items added to list
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT12.summary), Messages.VIT12.code, "sap.ui.vk.StepNavigation");
			assert.strictEqual(messagePopover.getItems().length, 6, "6 items added to list");

			// 7 items added to list
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT18.summary), Messages.VIT18.code, "sap.ui.vk.Viewport");
			assert.strictEqual(messagePopover.getItems().length, 7, "7 items added to list");

			// Clear all items
			notifications.clearAllMessages();
			assert.strictEqual(messagePopover.getItems().length, 0, "Counter reset to 0");

			// 2 errors from 2 different components
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT16.summary), Messages.VIT16.code, "sap.ui.vk.Viewer");
			assert.strictEqual(messagePopover.getItems().length, 2, "Two errors from different components");

			// 4 errors from 2 different components
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT1.summary), Messages.VIT1.code, "sap.ui.vk.NativeViewport");
			jQuery.sap.log.error(resourceBundle.getText(Messages.VIT16.summary), Messages.VIT16.code, "sap.ui.vk.Viewer");
			assert.strictEqual(messagePopover.getItems().length, 4, "Four errors from two different components");

			// Clear all items
			notifications.clearAllMessages();
			assert.strictEqual(messagePopover.getItems().length, 0, "Counter reset to 0");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
