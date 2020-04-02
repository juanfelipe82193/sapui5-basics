/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"jquery.sap.global",
	"./mockServer/InboxMockServerQUnit",
	"sap/ui/core/IconPool"
], function(qutils, createAndAppendDiv, jQuery, InboxMockServerQUnit, IconPool) {
	"use strict";


	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");

	// setup mock server and inbox control
	InboxMockServerQUnit.setup();


	QUnit.module("Load");

	QUnit.test("InboxCreationOk", function(assert) {
		sap.ui.getCore().applyChanges();
		var oInbox = jQuery.sap.byId("inbox");
		assert.equal(false, (oInbox === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (oInbox === null), "Checking if the Inbox Control is created and is not null.");
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});

	QUnit.module("Check Object Link Request");
	QUnit.asyncTest("Test Object Link Query", function(assert) {
		sap.ui.getCore().applyChanges();

		var oInbox = sap.ui.getCore().byId("inbox");
		var oModel = oInbox.getCoreModel();
		var delayedCall = function() {
		var oResponse = oModel.read("/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2',SAP__Origin='LOCALHOST_C73_00')/ObjectLinkExecution",null,null,true,function(oData, response){
			assert.equal(oData.results.length, 2, "Check the number of responses ");
			assert.equal(oData.results[1].InstanceID, "000001144658", "Check Instance ID ");
			assert.equal(oData.results[1].ObjectId, "464F4C31382020202020202020202034204558543339303030303030303030383434", "Check the Object Id");
				},function(oError){
					 console.error("Error while fetching Object Link Responses");
				});
		QUnit.start();

		};
		setTimeout(delayedCall, 0);
	});


	QUnit.asyncTest("Test $filter query for Object Links", function(assert) {
		sap.ui.getCore().applyChanges();

		var oInbox = sap.ui.getCore().byId("inbox");
		var oModel = oInbox.getCoreModel();
		var delayedCall = function() {
		var oResponse = oModel.read("/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2',SAP__Origin='LOCALHOST_C73_00')/ObjectLinkExecution?$filter=ObjectType eq 'Object'",null,null,true,function(oData, response){
				assert.equal(oData.results.length, 3, "Check the response of $filter query");
				assert.equal(oData.results[0].ObjectId, "464F4C31382020202020202020202034204558543339303030303030303030383434", "Check ObjectId Property");
				assert.equal(oData.results[0].ObjectType, "Object", "Check Object Type Property");
				assert.equal(oData.results[0].Label, "Link for Object XYZ", "Check Label Property");
				},function(oError){
					 console.error(" Could not perform  $filter query for Object Links");
				});
		QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.done(function() {
		qutils.triggerMouseEvent(
				"inbox" + "--tableViewSelectionButton", "click");
	});
});