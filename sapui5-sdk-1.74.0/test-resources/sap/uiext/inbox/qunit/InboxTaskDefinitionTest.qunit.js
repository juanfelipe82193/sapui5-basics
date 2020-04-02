/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/uiext/inbox/Inbox",
	"sap/ui/model/json/JSONModel",
	"sap/uiext/inbox/TaskInitialFilters",
	"sap/uiext/inbox/InboxConstants"
], function(
	qutils,
	createAndAppendDiv,
	Inbox,
	JSONModel,
	TaskInitialFilters,
	InboxConstants
) {
	"use strict";


	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");



	//Test Data
	var jsonData = {
		"Tasks" : [
		{
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/772e')", "type" : "Inbox.Tasks"
		}, "InstanceID" : "bpm://bpm.sap.com/task-instance/772ea","TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea1", "Category" : "TASK", "TaskDefinitionName" : "LeaveReq", "TaskTitle" : "LeaveReq", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335439338973)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412125)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ca')", "type" : "Inbox.Tasks"
		}, "InstanceID" : "bpm://bpm.sap.com/task-instance/c03ca","TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea2", "Category" : "TASK", "TaskDefinitionName" : "Sales Order Approval", "TaskTitle" : "Sales Order Approval Task - 1234", "Status" : "RESERVED", "Priority" : "VERY_HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556977)\/", "StartDeadline" : "\/Date(1335436957423)\/", "CompletionDeadline" : "\/Date(1335696157427)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412125)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
		}, "InstanceID" : "bpm://bpm.sap.com/task-instance/c034a", "TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea3","Category" : "TASK", "TaskDefinitionName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c071a')", "type" : "Inbox.Tasks"
		}, "InstanceID" : "bpm://bpm.sap.com/task-instance/c07a", "TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea4","Category" : "TASK", "TaskDefinitionName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350556410)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041756660)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be68a')", "type" : "Inbox.Tasks"
		}, "InstanceID" : "bpm://bpm.sap.com/task-instance/be6a","TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea5", "Category" : "TASK", "TaskDefinitionName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350554667)\/", "StartDeadline" : "\/Date(1335523354833)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be4aa')", "type" : "Inbox.Tasks"
		}, "InstanceID" : "bpm://bpm.sap.com/task-instance/be4aa", "TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea6","Category" : "TASK", "TaskDefinitionName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350554133)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041754297)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be28a')", "type" : "Inbox.Tasks"
		}, "InstanceID" : "bpm://bpm.sap.com/task-instance/be2a5", "TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea7","Category" : "TASK", "TaskDefinitionName" : "Some Dummy Task", "TaskTitle" : "Some Dummy Task for you", "Status" : "READY", "Priority" : "LOW", "Requestor" : "", "CreatedOn" : "\/Date(1335350553633)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}
		], "__count" : "7"
		};

	QUnit.module("Facet Filter Test");
	var filterTestInbox = new Inbox("filterTestInbox");
	filterTestInbox.setHandleBindings(false);
	var oModel = new JSONModel();
	oModel.setData(jsonData);
	filterTestInbox.setModel(oModel);
	var taskFilter = new TaskInitialFilters(["READY","RESERVED"],null,null,null);
	InboxConstants.aFilterMetaData[0].attributes = [{"key":"taskDef1","value":"TASK DEF 1","instanceID":"1234"},{"key":"taskDef2","value":"TASK DEF 2","instanceID":"2345"},{"key":"taskDef3","value":"TASK DEF 3","instanceID":"5678"}];
	filterTestInbox.bindTaskTable("/Tasks",taskFilter);
	filterTestInbox.refreshTaskTypes();

	QUnit.test("createFacetFilterTest", function(assert) {

		var oFacet = sap.ui.getCore().byId(filterTestInbox.getId() + '--' + "filterFacet");
		var facetFilterList = oFacet.getLists();
		for (var i = 0; i < facetFilterList.length; i++){
			if (i == 0) {assert.equal(true, (facetFilterList[i].getItems().length === 7), "Checking if the Task Definition facet filter is initialized");} else if (i == 1) {assert.equal(true, (facetFilterList[i].getItems().length === 4), "Checking if the Priority facet filter is initialized");} else if (i == 2) {assert.equal(true, (facetFilterList[i].getItems().length === 3), "Checking if the Status facet filter is initialized");} else if (i == 3) {assert.equal(true, (facetFilterList[i].getItems().length === 4), "Checking if the Date Time facet filter is initialized");} else if (i == 4) {assert.equal(true, (facetFilterList[i].getItems().length === 4), "Checking if the Due Date Time facet filter is initialized");}
		}

	});
});