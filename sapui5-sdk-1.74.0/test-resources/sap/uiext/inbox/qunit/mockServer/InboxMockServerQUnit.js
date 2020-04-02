/*global QUnit */
sap.ui.define([
	"./InboxMockServer",
	"sap/uiext/inbox/Inbox",
	"sap/ui/model/odata/ODataModel"
], function(InboxMockServer, Inbox, ODataModel) {
	"use strict";

	function setup(oOptions) {

		oOptions = oOptions || {};

		var oMockServer;

		QUnit.begin(function() {
			oMockServer = InboxMockServer._getInstance();
			oMockServer.start();

			var inx = new Inbox("inbox").placeAt("uiArea1");
			var oModel = new ODataModel("http://localhost/myservice",true);
			oModel.setCountSupported(false);
			oModel.setRefreshAfterChange(false);

			//Enabling all features
			//inx.isSubstitutionEnabled = false;
			inx.isCustomAttributesEnabled = true;
			inx.applyTaskCategoryFilter = !!oOptions.applyTaskCategoryFilter;
			inx.isCustomActionsEnabled = true;
			inx.showTaskDescription = true;
			inx.showTaskCategory = true;//TODO: Make it false and later handle in Inbox
			//inx.isBatchOperationSupported = true;
			inx.isForwardActionEnabled = true;
			inx.isCommentsEnabled = true;
			//inx.openTaskExecutionUIOpenInNewTab = false;
				
			inx.setModel(oModel);
			inx.setSubstitutionEnabled(true);
			inx.bindTasks("/TaskCollection"); 
		});

		QUnit.done(function( details ) {
			oMockServer.destroy();  
			//console.log( "Total: ", details.total, " Failed: ", details.failed, " Passed: ", details.passed, " Runtime: ", details.runtime );
		});

		QUnit.test("InboxMockServerStarted", 2, function(assert) {
			assert.ok(oMockServer, "Mock server is created");
			oMockServer.start();
			assert.ok(oMockServer.isStarted(), "Mock server is started");
		});

	}

	return {
		setup: setup
	};

});