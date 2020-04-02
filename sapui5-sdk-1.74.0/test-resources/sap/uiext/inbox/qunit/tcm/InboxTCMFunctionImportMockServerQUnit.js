/*global QUnit */
sap.ui.define([
	"jquery.sap.global",
	"./InboxTCMFunctionImportQUnit", // exports oTCMFunctionImport
	"../mockServer/InboxMockServerQUnit",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function(jQuery, oTCMFunctionImport, InboxMockServerQUnit, createAndAppendDiv) {
	"use strict";

	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");

	// setup mock server and inbox control
	InboxMockServerQUnit.setup();

	QUnit.asyncTest("callSearchUsers", 1, function(assert) {

		var params = {SearchPattern: "adm", MaxResults: 10, SAP__Origin: "LOCALHOST_C73_00"};
		var sResponseStatus = "";
		var fnSuccess = function(oData, response){
							sResponseStatus = "OK";
							assert.equal(sResponseStatus, "OK", "Response is ok");
						};
		var fnError = function(oData, response){
							sResponseStatus = "Not OK";
						};

		var delayedCall = function(){
			var oRequest = oTCMFunctionImport.callSearchUsers(params, fnSuccess, fnError);
			QUnit.start();
		};

		setTimeout(delayedCall, 500);

	});
});