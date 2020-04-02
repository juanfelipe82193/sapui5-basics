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
		var oInbox = sap.ui.getCore().byId("inbox");
		assert.equal(false, (oInbox === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (oInbox === null), "Checking if the Inbox Control is created and is not null.");
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");

	});


	QUnit.module("Checking if taskSelectionEvent");

	QUnit.asyncTest("Test if event is fired", function(assert) {

		var delayedCall = function() {
			 var aTaskUniqueIdentifiers = [];
			 var sInstanceId, sSAP_Origin;
			 var oInbox = sap.ui.getCore().byId("inbox");
			 var oDataModel = oInbox.getCoreModel();
			 var oTable = sap.ui.getCore().byId(oInbox.getId() + '--' + 'listViewTable');

		qutils.triggerMouseEvent("inbox--listViewTable-rowsel3", "click");
		sap.ui.getCore().applyChanges();

				oInbox.attachTaskSelectionChange(function(oEvent) {
					aTaskUniqueIdentifiers = oEvent.getParameter("taskUniqueIdentifiers");
					sInstanceId = aTaskUniqueIdentifiers[0].InstanceID;
					sSAP_Origin = aTaskUniqueIdentifiers[0].SAP__Origin;

					});

				 qutils.triggerMouseEvent("inbox--listViewTable-rowsel2", "click");


					var selectedIndex = oTable.getSelectedIndex();
					var rowContext = oTable.getContextByIndex(selectedIndex);
					var sTaskInstanceIDOfSelectedTask = oDataModel.getProperty("InstanceID", rowContext);
					var sSAP__OriginOfSelectedTask = oDataModel.getProperty("SAP__Origin", rowContext);

				assert.equal(true , (sTaskInstanceIDOfSelectedTask === sInstanceId ), "Checking if the Instance ID returned by the event is correct");
				assert.equal(true , (sSAP__OriginOfSelectedTask === sSAP_Origin ), "Checking if the SAP__Origin for the task returned by the event is correct");

				QUnit.start();
		};
		setTimeout(delayedCall, 1000);

	});
});