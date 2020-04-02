/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"jquery.sap.global",
	"./mockServer/InboxMockServerQUnit"
], function(qutils, createAndAppendDiv, jQuery, InboxMockServerQUnit) {
	"use strict";


	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");

	// setup mock server and inbox control
	InboxMockServerQUnit.setup();


	QUnit.module("Load");

	QUnit.test("InboxCreationOk", function(assert) {
		sap.ui.getCore().applyChanges();
		var $Inbox = jQuery.sap.byId("inbox");
		assert.equal(false, ( $Inbox === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, ( $Inbox === null), "Checking if the Inbox Control is created and is not null.");
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");

	});

	QUnit.module("Show Custom Attribute");

	QUnit.asyncTest("Checking if Custom Attribute Icon is not Selected on Switching to Row Repeater View", function(assert) {
	sap.ui.getCore().applyChanges();
	var oInbox = jQuery.sap.byId("inbox");
	qutils.triggerMouseEvent("inbox" + "--" + "rrViewSelectionButton", "click");
		var delayedCall = function() {

			var oRowRepeaterView = sap.ui.getCore().byId('inbox--tasksRowRepeater');
			var sId = "inbox--customAttributesSegBtn-inbox--tasksRowRepeater-";

			//Checking the properties of Toggle Custom Attribute Button
			var oToggleCustomAttributeBtn = sap.ui.getCore().byId("inbox--toggleCustomAttributes");
			assert.equal(oToggleCustomAttributeBtn.getPressed(), false, "Checking if the Toggle Custom Attribute Button is not Selected");
			assert.equal(oToggleCustomAttributeBtn.getTooltip(), "Show All Task Details", "Checking Tooltip, when the Toggle Custom Attribute Button is not Selected");

			for (var i = 0; i < oRowRepeaterView.getRows().length; i++) {
				var oCustmAttrToggleBtn = sap.ui.getCore().byId(sId + i);
				assert.equal(oCustmAttrToggleBtn.getPressed(), false, "Checking if the Custom Attribute Button is not Selected");
				assert.equal(oCustmAttrToggleBtn.getTooltip(), "Show Task Details", "Checking Tooltip, when Custom Attribute Button is not Selected");
			}
			QUnit.start();
		};
		setTimeout(delayedCall, 500);

	});


	QUnit.asyncTest("Checking if Custom Attribute Icon is not Selected by default in the next page", function(assert) {
		sap.ui.getCore().applyChanges();
		qutils.triggerMouseEvent("inbox--rowRepeaterPaginator-li--2", "click");
		sap.ui.getCore().applyChanges();

			var delayedCall = function() {
				var oRowRepeaterView = sap.ui.getCore().byId('inbox--tasksRowRepeater');
				var sId = "inbox--customAttributesSegBtn-inbox--tasksRowRepeater-";

				//Checking the properties of Toggle Custom Attribute Button
				var oToggleCustomAttributeBtn = sap.ui.getCore().byId("inbox--toggleCustomAttributes");
				assert.equal(oToggleCustomAttributeBtn.getPressed(), false, "Checking if the Toggle Custom Attribute Button is not Selected");
				assert.equal(oToggleCustomAttributeBtn.getTooltip(), "Show All Task Details", "Checking Tooltip, when the Toggle Custom Attribute Button is not Selected");

				for (var i = 5; i < 8; i++) {
					var oCustmAttrToggleBtn = sap.ui.getCore().byId(sId + (i));
					assert.equal(oCustmAttrToggleBtn.getPressed(), false, "Checking if the Custom Attribute Button is not Selected");
					assert.equal(oCustmAttrToggleBtn.getTooltip(), "Show Task Details", "Checking Tooltip, when Custom Attribute Button is not Selected");
				}
				QUnit.start();
			};
			setTimeout(delayedCall, 500);

		});

	QUnit.asyncTest("Showing All Custom Attributes", function(assert) {
		sap.ui.getCore().applyChanges();
		qutils.triggerMouseEvent("inbox--toggleCustomAttributes", "click");
		sap.ui.getCore().applyChanges();

			var delayedCall = function() {
				var oRowRepeaterView = sap.ui.getCore().byId('inbox--tasksRowRepeater');
				var sId = "inbox--customAttributesSegBtn-inbox--tasksRowRepeater-";

				//Checking the properties of Toggle Custom Attribute Button
				var oToggleCustomAttributeBtn = sap.ui.getCore().byId("inbox--toggleCustomAttributes");
				assert.equal(oToggleCustomAttributeBtn.getPressed(), true, "Checking if the Toggle Custom Attribute Button is Selected");
				assert.equal(oToggleCustomAttributeBtn.getTooltip(), "Hide All Task Details", "Checking Tooltip, when the Toggle Custom Attribute Button is Selected");

				for (var i = 5; i < 8; i++) {
					var oCustmAttrToggleBtn = sap.ui.getCore().byId(sId + (i));
					assert.equal(oCustmAttrToggleBtn.getPressed(), true, "Checking if the Custom Attribute Button is Selected");
					assert.equal(oCustmAttrToggleBtn.getTooltip(), "Hide Task Details", "Checking Tooltip if Custom Attribute Button is Selected");

					var oLabel =   sap.ui.getCore().byId('inbox--' + 'customattr' + '-label-' + '-row-' + '0' + '-index-' + '0');
					assert.equal(oLabel.getText(),"Strings", "Checking if the custom attribute Property is Dates");
					var oValue = sap.ui.getCore().byId( 'inbox--' +  'customattr' + '-value-' + '-row-' + '0' + '-index-' + '0');
					assert.equal(oValue.getText(), "Manna","Checking if value is Nov 16, 2012");

					var oLayout = sap.ui.getCore().byId("__layout2--begin");

					var oCustomAttributeDataRow = sap.ui.getCore().byId('inbox' + '--lastRowCell-' + i);
					assert.equal((oCustomAttributeDataRow.getId() === undefined),false, "Checking if Row is created for displaying the Custom Atrribute Data");
				}
				QUnit.start();
			};
			setTimeout(delayedCall, 500);

		});


	QUnit.asyncTest("Hiding All Custom Attributes", function(assert) {
		sap.ui.getCore().applyChanges();
		qutils.triggerMouseEvent("inbox--toggleCustomAttributes", "click");
		sap.ui.getCore().applyChanges();
		var delayedCall = function() {
				var oRowRepeaterView = sap.ui.getCore().byId('inbox--tasksRowRepeater');
				var sId = "inbox--customAttributesSegBtn-inbox--tasksRowRepeater-";

				//Checking the properties of Toggle Custom Attribute Button
				var oToggleCustomAttributeBtn = sap.ui.getCore().byId("inbox--toggleCustomAttributes");
				assert.equal(oToggleCustomAttributeBtn.getPressed(), false, "Checking if the Toggle Custom Attribute Button is not Selected");
				assert.equal(oToggleCustomAttributeBtn.getTooltip(), "Show All Task Details", "Checking Tooltip, when the Toggle Custom Attribute Button is not Selected");

				for (var i = 5; i < 8; i++) {
					var oCustmAttrToggleBtn = sap.ui.getCore().byId(sId + (i));
					assert.equal(oCustmAttrToggleBtn.getPressed(), false, "Checking if the Custom Attribute Button is not Selected");
					assert.equal(oCustmAttrToggleBtn.getTooltip(), "Show Task Details", "Checking Tooltip if Custom Attribute Button is not Selected");
				}
				QUnit.start();
			};
			setTimeout(delayedCall, 0);

		});

	QUnit.done(function() {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});
});