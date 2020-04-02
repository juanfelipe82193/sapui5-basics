/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/uiext/inbox/Inbox",
	"sap/uiext/inbox/TaskInitialFilters",
	"sap/ui/model/json/JSONModel",
	"jquery.sap.global",
	"sap/uiext/inbox/InboxUtils",
	"sap/uiext/inbox/InboxConstants",
	"sap/uiext/inbox/InboxFilters",
	"sap/uiext/inbox/InboxSecondaryFilters",
	"sap/ui/table/library",
	"sap/ui/model/Sorter",
	"sap/uiext/inbox/InboxPrimaryFilters",
	"sap/uiext/inbox/InboxPrimaryFilterEnum",
	"sap/uiext/inbox/InboxSecondaryFilterPathEnum",
	"sap/uiext/inbox/InboxSecondaryFilterValuesEnum",
	"sap/uiext/inbox/TCMMetadata",
	"sap/ui/commons/library"
], function(
	qutils,
	createAndAppendDiv,
	Inbox,
	TaskInitialFilters,
	JSONModel,
	jQuery,
	InboxUtils,
	InboxConstants,
	InboxFilters,
	InboxSecondaryFilters,
	tableLibrary,
	Sorter,
	InboxPrimaryFilters,
	InboxPrimaryFilterEnum,
	InboxSecondaryFilterPathEnum,
	InboxSecondaryFilterValuesEnum,
	TCMMetadata,
	commonsLibrary
) {
	"use strict";

	// shortcut for sap.ui.commons.LabelDesign
	var LabelDesign = commonsLibrary.LabelDesign;

	// shortcut for sap.ui.table.SortOrder
	var SortOrder = tableLibrary.SortOrder;


	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");

	
	// workaround for sync/async issue
	InboxPrimaryFilters = sap.uiext.inbox.InboxPrimaryFilters;
	InboxSecondaryFilters = sap.uiext.inbox.InboxSecondaryFilters;


	var jsonData = {
			"Tasks" : [
			{
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/772e')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/772ea", "Category" : "TASK", "CreatedByName" : "Bijju Prasad", "SAP__Origin" : "BPM", "TaskName" : "LeaveReq", "TaskTitle" : "LeaveReq", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335439338973)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412125)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : "",
			"CustomAttributesCollection" : [
						{
							"__metadata" : {
							"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection('FirstName')", "type" : "Inbox.TaskCollection"
							}, "Name" : "FirstName", "Value" : "XYZ"
							}, {
							"__metadata" : {
							"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection('SurName')", "type" : "Inbox.TaskCollection"
							}, "Name" : "SurName", "Value" : "Vacation"
						}
						]

			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ca')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/c03ca", "Category" : "TASK", "CreatedByName" : "Lakshman Prasad", "SAP__Origin" : "BPM", "TaskName" : "Sales Order Approval", "TaskTitle" : "Sales Order Approval Task - 1234", "Status" : "RESERVED", "Priority" : "VERY_HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556977)\/", "StartDeadline" : "\/Date(1335436957423)\/", "CompletionDeadline" : "\/Date(1335696157427)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412125)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/c034a", "Category" : "TASK", "CreatedByName" : "", "SAP__Origin" : "GW", "TaskName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c071a')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/c07a", "Category" : "TASK", "CreatedByName" : "Basu Cowdary", "SAP__Origin" : "", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350556410)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041756660)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be68a')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/be6a", "Category" : "TASK", "CreatedByName" : "Vijay Deenanath Cuhan", "SAP__Origin" : null, "TaskName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350554667)\/", "StartDeadline" : "\/Date(1335523354833)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be4aa')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/be4aa", "Category" : "TASK", "CreatedByName" : "Venkat Subramanian" , "SAP__Origin" : "BPM", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350554133)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041754297)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be28a')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/be2a5", "Category" : "TASK", "CreatedByName" : "Ram Prasad Dasrath Prasad Sharma", "SAP__Origin" : "BPM", "TaskName" : "Some Dummy Task", "TaskTitle" : "Some Dummy Task for you", "Status" : "READY", "Priority" : "LOW", "Requestor" : "", "CreatedOn" : "\/Date(1335350553633)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : true, "SupportsRelease" : false, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/c03489a", "Category" : "TASK", "CreatedByName" : "Kacheri Kantha Rao", "SAP__Origin" : "BPM", "TaskName" : "Purchase Order Form", "TaskTitle" : "    ", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/c03490a", "Category" : "TASK", "CreatedByName" : "Pawan Kalyan", "SAP__Origin" : "GW", "TaskName" : "Purchase Order Form", "TaskTitle" : null, "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
			}
			], "__count" : "9"
			};

	var jsonDataRefresh = {
		  "Tasks" : [
		  {
		  "__metadata" : {
		  "uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c0712aba')", "type" : "Inbox.Tasks"
		  }, "ID" : "bpm://bpm.sap.com/task-instance/c0718a", "Category" : "TASK", "CreatedByName" : "Administrator", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "READY", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350556410)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041756660)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : true, "SupportsRelease" : false, "TaskexecutionUrl" : ""
		  }, {
		  "__metadata" : {
		  "uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be6882da')", "type" : "Inbox.Tasks"
		  }, "ID" : "bpm://bpm.sap.com/task-instance/be688a", "Category" : "TASK", "CreatedByName" : "Administrator", "TaskName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350554667)\/", "StartDeadline" : "\/Date(1335523354833)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
		  }, {
		  "__metadata" : {
		  "uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be4ab78a')", "type" : "Inbox.Tasks"
		  }, "ID" : "bpm://bpm.sap.com/task-instance/be4a8a", "Category" : "TASK", "CreatedByName" : "Administrator", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "COMPLETED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350554133)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041754297)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : false, "SupportsClaim" : false, "SupportsRelease" : false, "TaskexecutionUrl" : ""
		  }, {
		  "__metadata" : {
		  "uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be2f1b78a')", "type" : "Inbox.Tasks"
		  }, "ID" : "bpm://bpm.sap.com/task-instance/be2f78a", "Category" : "TASK", "CreatedByName" : "Administrator", "TaskName" : "Some Dummy Task", "TaskTitle" : "Some Dummy Task for you", "Status" : "READY", "Priority" : "LOW", "Requestor" : "", "CreatedOn" : "\/Date(1335350553633)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : true, "SupportsRelease" : false, "TaskexecutionUrl" : ""
		  }, {
		  "__metadata" : {
		  "uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
		  }, "ID" : "bpm://bpm.sap.com/task-instance/c034891a", "Category" : "TASK", "CreatedByName" : "Administrator", "TaskName" : "Purchase Order Form", "TaskTitle" : "   ", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
		  }, {
		  "__metadata" : {
		  "uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
		   }, "ID" : "bpm://bpm.sap.com/task-instance/c034901a", "Category" : "TASK", "CreatedByName" : "Administrator", "TaskName" : "Purchase Order Form", "TaskTitle" : null, "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
		   }
		  ], "__count" : "6"
		  };

	var jsonDataClaimed = {
		  "Tasks" : [
		  {
		  "__metadata" : {
		  "uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c071b78a')", "type" : "Inbox.Tasks"
		  }, "ID" : "bpm://bpm.sap.com/task-instance/c0712a", "Category" : "TASK", "CreatedByName" : "Administrator", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350556410)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041756660)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
		  }, {
		  "__metadata" : {
		  "uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be6848a')", "type" : "Inbox.Tasks"
		  }, "ID" : "bpm://bpm.sap.com/task-instance/be68a", "Category" : "TASK", "CreatedByName" : "Administrator", "TaskName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350554667)\/", "StartDeadline" : "\/Date(1335523354833)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
		  }, {
		  "__metadata" : {
		  "uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be4a78a')", "type" : "Inbox.Tasks"
		  }, "ID" : "bpm://bpm.sap.com/task-instance/beb78a", "Category" : "TASK", "CreatedByName" : "Administrator", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "COMPLETED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350554133)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041754297)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : false, "SupportsClaim" : false, "SupportsRelease" : false, "TaskexecutionUrl" : ""
		  }, {
		  "__metadata" : {
		  "uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be278a')", "type" : "Inbox.Tasks"
		  }, "ID" : "bpm://bpm.sap.com/task-instance/be278a", "Category" : "TASK", "CreatedByName" : "Administrator", "TaskName" : "Some Dummy Task", "TaskTitle" : "Some Dummy Task for you", "Status" : "READY", "Priority" : "LOW", "Requestor" : "", "CreatedOn" : "\/Date(1335350553633)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : true, "SupportsRelease" : false, "TaskexecutionUrl" : ""
		  }, {
		  "__metadata" : {
		  "uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
		  }, "ID" : "bpm://bpm.sap.com/task-instance/c034892a", "Category" : "TASK", "CreatedByName" : "Administrator", "TaskName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
		  }, {
		  "__metadata" : {
		  "uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
		  }, "ID" : "bpm://bpm.sap.com/task-instance/c034a902a", "Category" : "TASK", "CreatedByName" : "Administrator", "TaskName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "SupportsForward" : true, "SupportsClaim" : false, "SupportsRelease" : true, "TaskexecutionUrl" : ""
		  }
		  ], "__count" : "6"
		  };



	var inx = new Inbox("inbox");
	inx.setHandleBindings(false);

	var taskFilter = new TaskInitialFilters(["READY"],null,null,null);// (It is the Status, Priority filters as array)
	var oModel = new JSONModel();
	oModel.setData(jsonData);

	inx.setModel(oModel);
	inx.bindTaskTypeDynamicFilter(function(){var t = []; t.push('Raise Purchase Request'); t.push('Some Dummy Task'); t.push('Purchase Order Form'); t.push('LeaveReq'); return t;});
	inx.bindTaskTable("/Tasks",taskFilter);
	inx.bindTaskExecutionURL(function(id){return "/demokit";},function(id){return "COMPLETED";});
	inx.bindSearch(function(){alert('Not Supported');});
	inx.attachRefresh(function(){oModel.setData(jsonDataRefresh);});
	inx.attachTaskAction(function(oEvent){alert(oEvent.getParameter('action')); alert(oEvent.getParameter('selectedIDs')); oModel.setData(jsonDataClaimed);});
	inx.placeAt("uiArea1");

	//Tests Starts
	QUnit.module("InitialTest");
	var inbox = sap.ui.getCore().byId("inbox");
	var inboxTaskBinding = inbox.getTaskTableBinding();

	QUnit.test("InboxCreationOk", 2, function(assert) {
		sap.ui.getCore().applyChanges();
		assert.equal(false, (jQuery.sap.byId("inbox") === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (jQuery.sap.byId("inbox") === null), "Checking if the Inbox Control is created and is not null.");
		qutils.triggerMouseEvent(inbox.getId() + "--tableViewSelectionButton", "click");
	});

	QUnit.module("PropertiesTest");

	QUnit.test("InboxsCollectionPathOk", 1, function(assert) {
		sap.ui.getCore().applyChanges();
		assert.equal(inbox.sCollectionPath, "/Tasks");
	});

	QUnit.test("InboxIdOk", 1, function(assert) {
		sap.ui.getCore().applyChanges();
		assert.equal(inbox.sId, "inbox");
	});

	QUnit.test("IsJSONModelOk", 1, function(assert) {
		sap.ui.getCore().applyChanges();
		assert.equal(inbox.typeOfModel, "JSON");
	});

	QUnit.module("InboxTableBindings");

	QUnit.test("TaskTableBindingPathOk", 1, function(assert) {
		sap.ui.getCore().applyChanges();
		assert.equal(inboxTaskBinding.sPath, "/Tasks");
	});

	QUnit.test("NumberOfTasksOk", 1, function(assert) {
		sap.ui.getCore().applyChanges();
		assert.equal("9", inboxTaskBinding.getModel().oData.Tasks.length);
	});

	QUnit.test("InitialFiltersOk", 3, function(assert) {
		sap.ui.getCore().applyChanges();
		assert.equal(inboxTaskBinding.aApplicationFilters[0].sPath, "Status");
		assert.equal(inboxTaskBinding.aApplicationFilters[0].sOperator, "EQ");
		assert.equal(inboxTaskBinding.aApplicationFilters[0].oValue1, "READY");
	});

	QUnit.test("ActionButtonLabelChangedToComplete", function(assert) {
		sap.ui.getCore().applyChanges();
		var actionComplete = sap.ui.getCore().byId(inbox.getId() + '--' + 'openActionButton');
		assert.equal(false, (actionComplete === undefined), "Checking if the Open Action Button is created and is not undefined.");
		assert.equal(false, (inbox === null), "Checking if the Open Action Button is created and is not null.");
		var language = sap.ui.getCore().getConfiguration();
		if (language === "EN_US"){
			assert.equal(true, (actionComplete.getText() === "Open"),"Checking if the Button text is 'Open'.");
			assert.equal(true, (actionComplete.getTooltip_AsString() === "Open"), "Checking if the Button tool tip is 'Open'.");
		}
	});

	QUnit.module("Switch to Table");
	QUnit.test("TableSwitchTest", function(assert) {
		sap.ui.getCore().applyChanges();
		var oTable = sap.ui.getCore().byId(inbox.getId() + '--' + 'listViewTable');
		assert.equal(false, (inbox === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (inbox === null), "Checking if the Inbox Control is created and is not null.");
		assert.equal(false, (oTable === undefined), "Checking if the Table Control is created and is not undefined.");
		assert.equal(false, (oTable === null), "Checking if the Table Control is created and is not null.");
		assert.equal(true, (oTable instanceof sap.ui.table.Table), "Checking if the Table Control is instance of sap.ui.table.Table");
	});


	QUnit.module("Custom Attribute Collection");
	QUnit.test("CustomAttributeTest", function(assert) {
		//TODO CustomAttributes is disabled for other Data Models. Once enabled for JSON model enhance this test case
		//	assert.equal(false, (inbox._getCustomAttributeMetaData('123').length === undefined), "Checking if the customAttributes definition for the TaskDefinition");
		sap.ui.getCore().applyChanges();
		var oTable = sap.ui.getCore().byId(inbox.getId() + '--' + 'listViewTable');
		var initialNumberOfColumns = oTable.getColumns().length;

		var aCustomAttributeMetadata = [
										{Name: "FirstName",Label:"First Name",Type:"String"},
										{Name:"SurName",Label:"Sur Name",Type:"String"}
										];
		inbox._createCustomAttributeColumns(aCustomAttributeMetadata);

		assert.equal(oTable.getColumns().length, initialNumberOfColumns + 2 , "Checking if the CustomAttributes columns are getting created");
		assert.equal(oTable.getColumns()[1].getLabel().getText(), "First Name", "Checking if the CustomAttributes column 1 Label is correct");
		assert.equal(oTable.getColumns()[2].getLabel().getText(), "Sur Name", "Checking if the CustomAttributes column 2 Label is correct");

		//TODO CustomAttributes is disabled for other Data Models. Once enabled for JSON model enhance this test case
		//equals(oTable.getRows()[0].getCells()[5].getValue(), "XYZ", "Checking if the CustomAttributes value is correct");
		//equals(oTable.getRows()[0].getCells()[6].getValue(), "Vacation", "Checking if the CustomAttributes value is correct");

		inbox._deleteCustomAttributeColumns();
		assert.equal(oTable.getColumns().length, initialNumberOfColumns, "Checking CustomAttributes columns deletion");

	});

	QUnit.module("Substitution Rules Getter and Setter");
	QUnit.test("SubstitutionGetterSetterTest", function(assert) {
		sap.ui.getCore().applyChanges();
		assert.equal(false, (inbox === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (inbox.getSubstitutionEnabled()),"Checking the default value of the isSubstitution property, it should be false");
		inbox.setSubstitutionEnabled(true);
		assert.equal(true, (inbox.getSubstitutionEnabled()),"Checking the isSubstitution property after setting it to true");
		inbox.setSubstitutionEnabled(false);
		assert.equal(false, (inbox.getSubstitutionEnabled()),"Checking the isSubstitution property after setting it to false");
	});

	QUnit.module("Substitution Enable Disable Test");
	QUnit.test("SubstitutionEnableDisableTest", function(assert) {
		sap.ui.getCore().applyChanges();
		//Tests for Substitution Disabled as default behaviour
		var inboxWithSubstDisabled = new Inbox("inboxWithNoSubstitution");
		inboxWithSubstDisabled.setHandleBindings(false);
		var taskFilter = new TaskInitialFilters(["READY"],null,null,null);// (It is the Status, Priority filters as array)
		var oModel = new JSONModel();
		oModel.setData(jsonData);
		inboxWithSubstDisabled.setModel(oModel);
		inboxWithSubstDisabled.bindTaskTypeDynamicFilter(function(){var t = []; t.push('Raise Purchase Request'); t.push('Some Dummy Task'); t.push('Purchase Order Form'); t.push('LeaveReq'); return t;});
		inboxWithSubstDisabled.bindTaskTable("/Tasks",taskFilter);
		inboxWithSubstDisabled.bindTaskExecutionURL(function(id){return "/demokit";},function(id){return "COMPLETED";});
		inboxWithSubstDisabled.bindSearch(function(){alert('Not Supported');});
		inboxWithSubstDisabled.attachRefresh(function(){oModel.setData(jsonDataRefresh);});
		inboxWithSubstDisabled.attachTaskAction(function(oEvent){alert(oEvent.getParameter('action')); alert(oEvent.getParameter('selectedIDs')); oModel.setData(jsonDataClaimed);});
		var inboxWithNoSubstitution = sap.ui.getCore().byId("inboxWithNoSubstitution");
		var dropDownRow = sap.ui.getCore().byId(inboxWithNoSubstitution.getId() + '--' + "dropdownRow");
		var settingsMenu = sap.ui.getCore().byId(inboxWithNoSubstitution.getId() + '--' + 'inboxSettingsMenu');
		//var rrSettingsMenu = sap.ui.getCore().byId(inboxWithNoSubstitution.getId() + '--' +'rrSettingsMenu');
		var dropdowncell1 = sap.ui.getCore().byId(inboxWithNoSubstitution.getId() + '--' + "dropdownCell1");
		var dropdowncell2 = sap.ui.getCore().byId(inboxWithNoSubstitution.getId() + '--' + "dropdownCell2");
		var dropdowncell3 = sap.ui.getCore().byId(inboxWithNoSubstitution.getId() + '--' + "dropdownCell3");
		var oManageSubstitutionMenuItem = sap.ui.getCore().byId(inboxWithNoSubstitution.getId() + '--' + "manageSubstitutionMI");
		var oRRManageSubstitutionMenuItem = sap.ui.getCore().byId(inboxWithNoSubstitution.getId() + '--' + "rrManageSubstitutionMI");
		//var rrSettingsButtonInvisible = sap.ui.getCore().byId(inboxWithSubstDisabled.getId() + '--' + "rrSettingsButton");
		var tableSettingsButtonInvisible = sap.ui.getCore().byId(inboxWithSubstDisabled.getId() + '--' + "settingsButton");
		//equal(rrSettingsButtonInvisible.getVisible(),false, "Checking the visibility of Row Repeater view settings button");
		assert.equal(tableSettingsButtonInvisible.getVisible(),false, "Checking the visibility of Table view settings button");

		assert.equal(false, (inboxWithNoSubstitution.getSubstitutionEnabled()),"Checking the isSubstitution property after setting it to false");
		assert.equal(dropDownRow.indexOfCell(dropdowncell1),-1, "Checking if the First Combobox is not in the Drop Down Row");
		assert.equal(dropDownRow.indexOfCell(dropdowncell3),-1, "Checking if the Third Combobox is not in the Drop Down Row");



		//Tests for Substitution Enabled
		var inboxWithSubstitutionEnabled = new Inbox("inboxWithSubstitution");

		inboxWithSubstitutionEnabled.setHandleBindings(false);
		var taskFilter1 = new TaskInitialFilters(["READY"],null,null,null);// (It is the Status, Priority filters as array)
		var oModel1 = new JSONModel();
		oModel1.setData(jsonData);
		inboxWithSubstitutionEnabled.setModel(oModel1);
		inboxWithSubstitutionEnabled.bindTaskTypeDynamicFilter(function(){var t = []; t.push('Raise Purchase Request'); t.push('Some Dummy Task'); t.push('Purchase Order Form'); t.push('LeaveReq'); return t;});
		inboxWithSubstitutionEnabled.bindTaskTable("/Tasks",taskFilter);
		inboxWithSubstitutionEnabled.bindTaskExecutionURL(function(id){return "/demokit";},function(id){return "COMPLETED";});
		inboxWithSubstitutionEnabled.setSubstitutionEnabled(true);                                                                    //TODO:Check setSubstitutionEnabled value after bindTask
		inboxWithSubstitutionEnabled.bindSearch(function(){alert('Not Supported');});
		inboxWithSubstitutionEnabled.attachRefresh(function(){oModel1.setData(jsonDataRefresh);});
		inboxWithSubstitutionEnabled.attachTaskAction(function(oEvent){alert(oEvent.getParameter('action')); alert(oEvent.getParameter('selectedIDs')); oModel.setData(jsonDataClaimed);});
		var inboxWithSubstitution = sap.ui.getCore().byId("inboxWithSubstitution");
		dropDownRow = sap.ui.getCore().byId(inboxWithSubstitution.getId() + '--' + "dropdownRow");
		settingsMenu = sap.ui.getCore().byId(inboxWithSubstitution.getId() + '--' + 'inboxSettingsMenu');
		//rrSettingsMenu = sap.ui.getCore().byId(inboxWithSubstitution.getId() + '--' +'rrSettingsMenu');
		dropdowncell1 = sap.ui.getCore().byId(inboxWithSubstitution.getId() + '--' + "dropdownCell1");
		dropdowncell2 = sap.ui.getCore().byId(inboxWithSubstitution.getId() + '--' + "dropdownCell2");
		dropdowncell3 = sap.ui.getCore().byId(inboxWithSubstitution.getId() + '--' + "dropdownCell3");
		oManageSubstitutionMenuItem = sap.ui.getCore().byId(inboxWithSubstitution.getId() + '--' + "manageSubstitutionMI");
		oRRManageSubstitutionMenuItem = sap.ui.getCore().byId(inboxWithSubstitution.getId() + '--' + "rrManageSubstitutionMI");
		assert.equal((inboxWithSubstitution.getSubstitutionEnabled()), true,"Checking the isSubstitution property after setting it to true");
		assert.equal(dropDownRow.indexOfCell(dropdowncell1),0, "Checking if the First Combobox is in the Drop Down Row as First element");
		assert.equal(dropDownRow.indexOfCell(dropdowncell3),2, "Checking if the Third Combobox is in the Drop Down Row as Third element");
		//var rrSettingsButton = sap.ui.getCore().byId(inboxWithSubstitutionEnabled.getId() + '--' + "rrSettingsButton");
		var tableSettingsButton = sap.ui.getCore().byId(inboxWithSubstitutionEnabled.getId() + '--' + "settingsButton");
		//equal(rrSettingsButton.getVisible(),true, "Checking the visibility of Row Repeater view settings button");
		assert.equal(tableSettingsButton.getVisible(),true, "Checking the visibility of Table view settings button");

	}
	);

	//module("Test for Tooltip Format For DateTime");
	//test("basicTestForDateTimeFormat", function(){
	//	var expectedDateValue = "Thursday, 26 April 2012 16:52:18 GMT+05:30";
	//	assert.equal(inbox.tooltipFormatForDateTime("\/Date(1335439338973)\/"), expectedDateValue ,"Checking date format for tootip");
	//	});
	//Need more UnitTests here

	QUnit.module("Test for Date format For DateTime");
	QUnit.test("dateFormatforDateTime with bDisplayYear===undefined", function(assert) {
		sap.ui.getCore().applyChanges();
		var expectedDateValue = "Apr 26, 2012";
		assert.equal(inbox.dateFormat("\/Date(1335439338973)\/"), expectedDateValue ,"Checking date format");
	});

	QUnit.test("dateFormatforDateTime with bDisplayYear===true", function(assert) {
		sap.ui.getCore().applyChanges();
		var expectedDateValue = "Apr 26, 2012";
		assert.equal(inbox.dateFormat("\/Date(1335439338973)\/",true), expectedDateValue ,"Checking date format");
	});

	QUnit.test("dateFormatforDateTime with bDisplayYear===false", function(assert) {
		sap.ui.getCore().applyChanges();
		var expectedDateValue = "Apr 26";
		assert.equal(inbox.dateFormat("\/Date(1335439338973)\/", false), expectedDateValue ,"Checking date format");
	});

	/*tests for Custom Actions*/
	QUnit.module("Custom Actions Test");
	QUnit.test("CustomActionsTest", function(assert) {
		sap.ui.getCore().applyChanges();
		//TODO RowRepeater and CustomActions are currently not supported for models other than oData. So cannot test the Row Repeater View for Custom Actions. Support this and enhance this test case
		//	assert.equal(false, (inbox._getCustomAttributeMetaData('123').length === undefined), "Checking if the customAttributes definition for the TaskDefinition");
		var oActionToolbar = inbox._getActionButtonToolBarForTableView();
		assert.equal(false, (oActionToolbar === null), "Action ToolBar not null check");

		var oActionToolbarItems = oActionToolbar.getItems();
		var initialNumberOfToolbarItems = oActionToolbarItems.length;
		assert.equal(initialNumberOfToolbarItems, 5, "Checking Initial Number of Items in the Table View Toolbar");

		var aCustomActionArray = [{DecisionKey:"Approve",DecisionText:"Approve Claim",Description:"Approve the claim and complete the task"},{DecisionKey:"Reject",DecisionText:"Reject Claim",Description:"Reject the claim and complete the task"}];
		inbox._createCustomActionButtons(aCustomActionArray);
		inbox.rerender();

		var numberOfCustomActionsToBeAdded = aCustomActionArray.length;
		oActionToolbarItems = oActionToolbar.getItems();
		assert.equal(oActionToolbarItems.length, initialNumberOfToolbarItems + numberOfCustomActionsToBeAdded + 1, "Checking if the CustomAction Buttons are created");//adding one for seperator

		var oActionToolBar4Item = oActionToolbarItems[4];
		var oActionToolBar5Item = oActionToolbarItems[5];

		assert.equal(true, (oActionToolBar4Item instanceof sap.ui.commons.Button), "Checking if the Item added for Custom Action is a button");
		assert.equal(oActionToolBar4Item.getText(), "Approve Claim", "Checking if the CustomAction Button text is correct");
		assert.equal(oActionToolBar4Item.data("key"), "Approve", "Checking if the CustomAction key maintained is correct");
		assert.equal(oActionToolBar4Item.getTooltip(), "Approve the claim and complete the task", "Checking if the CustomAction tooltip is correct");

		assert.equal(true, (oActionToolBar5Item instanceof sap.ui.commons.Button), "Checking if the Item added for Custom Action is a button");
		assert.equal(oActionToolBar5Item.getText(), "Reject Claim", "Checking if the CustomAction Button text is correct");
		assert.equal(oActionToolBar5Item.data("key"), "Reject", "Checking if the CustomAction key maintained is correct");
		assert.equal(oActionToolBar5Item.getTooltip(), "Reject the claim and complete the task", "Checking if the CustomAction tooltip is correct");

		inbox._deleteCustomActions();
		oActionToolbarItems = oActionToolbar.getItems();
		assert.equal(oActionToolbarItems.length, initialNumberOfToolbarItems, "Checking Custom Action buttons deletion");
	});

	QUnit.module("Test Custom Actions Button Without Label");
	QUnit.test("LabelForCustomActionButton", function(assert) {
		sap.ui.getCore().applyChanges();
		var aCustomActionArray = [{DecisionKey: "Rework", DecisionText:""}];
		inbox._createCustomActionButtons(aCustomActionArray);
		var oActionToolbar = inbox._getActionButtonToolBarForTableView();
		var oActionToolBarItems = oActionToolbar.getItems();
		var oActionToolBarItem1 = oActionToolBarItems[4];
		assert.equal(oActionToolBarItem1.getText(), "Rework", "Checking if a label is created for Custom Action Button having no text");
	});

	QUnit.module("Default View Test");
	QUnit.test("DefaultViewTest", function(assert) {
		sap.ui.getCore().applyChanges();
		var inboxUtils = inbox.inboxUtils;
		var inboxConstants = inbox.constants;
		var defaultViewURLParameter = inboxConstants.defaultView_URLParameter;

		inboxUtils.setCookieValue(defaultViewURLParameter,inboxConstants.rowRepeaterView,1);

		var inboxWithDefaultView = new Inbox("inboxWithRRView");
		assert.equal((inboxWithDefaultView.defaultView), inboxConstants.rowRepeaterView, "Checking Default View Configured from Cookie");
		assert.equal((inboxWithDefaultView.currentView), inboxConstants.rowRepeaterView, "Checking Current View Configured from Cookie");

		inboxUtils.setCookieValue(defaultViewURLParameter,inboxConstants.tableView,1);
		var inboxWithDefaultView = new Inbox("inboxWithTableView");
		assert.equal((inboxWithDefaultView.defaultView), inboxConstants.tableView, "Checking Default View Configured from Cookie");
		assert.equal((inboxWithDefaultView.currentView), inboxConstants.tableView, "Checking Current View Configured from Cookie");

		inboxUtils.deleteCookie(defaultViewURLParameter);
		var inboxWithDefaultView = new Inbox("inboxWithNoDefaultView");
		assert.equal((inboxWithDefaultView.defaultView), inboxConstants.tableView, "Checking Default View Configured from Cookie");
		assert.equal((inboxWithDefaultView.currentView), inboxConstants.tableView, "Checking Current View Configured from Cookie");
	});
	//API For Inbox
	QUnit.module("Table Visibility Test");
	QUnit.test("TableVisibilityTest", function(assert) {
		sap.ui.getCore().applyChanges();
		var oTable = inbox._getComponent('listViewTable');
		var actualNumberOfColumns = oTable.getColumns().length;
		var expectedNumberOfColumns = 6;
		assert.equal(expectedNumberOfColumns, actualNumberOfColumns,"Test Number Of Initial Columns In the Table");

		function ColsAndVisibility(field,visibility){
			this.field = field;
			this.visibility = visibility;

		}
		var colObject = {columns:[]};
		colObject.columns.push({field:"INBOX_TABLE_VIEW_STATUS",visibility:false});
		colObject.columns.push({field:"INBOX_TABLE_VIEW_TASK_TITLE",visibility:true});
		colObject.columns.push({field:"INBOX_CREATED_BY_NAME",visibility:false});
		colObject.columns.push({field:"INBOX_TABLE_VIEW_CREATION_DATE",visibility:true});
		colObject.columns.push({field:"INBOX_TABLE_VIEW_DUE_DATE",visibility:true});
		colObject.columns.push({field:"INBOX_TABLE_VIEW_PRIORITY",visibility:true});
		//Test for undefined
		var mylist;
		inbox._setColumnVisibility(mylist);
		inbox._setColumnVisibility(colObject);
		inbox._setInboxFiltersVisibility(false);
		var col = inbox._getComponent("Status");
		var filter = inbox._getComponent("filterViewButton");
		var comboBox1 = inbox._getComponent("filterComboBox1");
		var comboBox2 = inbox._getComponent("filterComboBox2");
		var comboBox3 = inbox._getComponent("filterComboBox3");
		assert.equal(filter.getVisible(),false,"Test For filter button visibility");
		assert.equal(col.getVisible(),false,"Test For status column visibility");
		col = inbox._getComponent("Priority");
		assert.equal(col.getVisible(),true,"Test For priority column visibility");
		col = inbox._getComponent("CreatedByName");
		assert.equal(col.getVisible(),false,"Test For Created By Name column visibility");

		assert.equal(comboBox1.getVisible(),false,"Test For filter combobox1 visibility");
		assert.equal(comboBox2.getVisible(),false,"Test For filter combobox2 visibility");
		assert.equal(comboBox3.getVisible(),false,"Test For filter combobox3 visibility");


	});

	QUnit.module("Forward Button Visibility Test");
	QUnit.test("ForwardActionVisibilityTest", function(assert) {
		sap.ui.getCore().applyChanges();
		var test_inbox = new Inbox("testInbox");
		test_inbox.setHandleBindings(false);

		var taskFilter = new TaskInitialFilters(null,null,null,null);// (It is the Status, Priority filters as array)
		var oModel = new JSONModel();
		oModel.setData(jsonData);
		test_inbox.setModel(oModel);
		test_inbox.placeAt("uiArea1");

		var oActionToolbar = test_inbox._getActionButtonToolBarForTableView();
		var oActionToolbarItems = oActionToolbar.getItems();
		//var initialNumberOfToolbarItems = oActionToolbarItems.length;
		var oTable = sap.ui.getCore().byId(test_inbox.getId() + '--' + 'listViewTable');

		var openButtonIndex = 0;
		var claimButtonIndex = 1;
		var releaseButtonIndex = 2;
		var forwardButtonIndex = 3;

		//On Initial Load
		assert.equal(oActionToolbarItems[openButtonIndex].getVisible(), true, "Open button should be visible on initial load");
		assert.equal(oActionToolbarItems[openButtonIndex].getEnabled(), false, "Open button should not be enabled on initial load");
		assert.equal(oActionToolbarItems[claimButtonIndex].getVisible(), false, "Claim button should be visible");
		assert.equal(oActionToolbarItems[claimButtonIndex].getEnabled(), false, "Claim button should not be enabled");
		assert.equal(oActionToolbarItems[releaseButtonIndex].getVisible(), false, "Release button should be visible");
		assert.equal(oActionToolbarItems[releaseButtonIndex].getEnabled(), false, "Release button should not be enabled");
		assert.equal(oActionToolbarItems[forwardButtonIndex].getVisible(), false, "Forward button should be visible");
		assert.equal(oActionToolbarItems[forwardButtonIndex].getEnabled(), false, "Forward button should not be enabled");

		if (!test_inbox.isForwardActionEnabled) {
			var taskFilter = new TaskInitialFilters(["READY"],null,null,null);// (It is the Status, Priority filters as array)
			test_inbox.isForwardActionEnabled = true;
			test_inbox.bindTaskTable("/Tasks",taskFilter);
			oTable.setSelectedIndex(0);

			oActionToolbar = test_inbox._getActionButtonToolBarForTableView();
			oActionToolbarItems = oActionToolbar.getItems();
			assert.equal(oActionToolbarItems[openButtonIndex].getVisible(), true, "Open button should be visible");
			assert.equal(oActionToolbarItems[openButtonIndex].getEnabled(), true, "Open button should be enabled");
			assert.equal(oActionToolbarItems[claimButtonIndex].getVisible(), true, "Claim button should be visible");
			assert.equal(oActionToolbarItems[claimButtonIndex].getEnabled(), true, "Claim button should be enabled");
			assert.equal(oActionToolbarItems[releaseButtonIndex].getVisible(), true, "Release button should be visible");
			assert.equal(oActionToolbarItems[releaseButtonIndex].getEnabled(), false, "Release button should not be enabled");
			assert.equal(oActionToolbarItems[forwardButtonIndex].getVisible(), true, "Forward button should be visible");
			assert.equal(oActionToolbarItems[forwardButtonIndex].getEnabled(), true, "Forward button should be enabled");

			var taskFilter = new TaskInitialFilters(["RESERVED"],null,null,null);// (It is the Status, Priority filters as array)
			test_inbox.bindTaskTable("/Tasks",taskFilter);
			sap.ui.getCore().applyChanges();
			//oTable.setSelectedIndex(0);
			qutils.triggerMouseEvent("testInbox--listViewTable-rowsel1", "click");

			oActionToolbar = test_inbox._getActionButtonToolBarForTableView();
			oActionToolbarItems = oActionToolbar.getItems();
			assert.equal(oActionToolbarItems[openButtonIndex].getVisible(), true, "Open button should be visible");
			assert.equal(oActionToolbarItems[openButtonIndex].getEnabled(), true, "Open button should be enabled ");
			assert.equal(oActionToolbarItems[claimButtonIndex].getVisible(), true, "Claim button should be visible");
			assert.equal(oActionToolbarItems[claimButtonIndex].getEnabled(), false, "Claim button should not be enabled");
			assert.equal(oActionToolbarItems[releaseButtonIndex].getVisible(), true, "Release button should be visible");
			assert.equal(oActionToolbarItems[releaseButtonIndex].getEnabled(), true, "Release button should be enabled");
			assert.equal(oActionToolbarItems[forwardButtonIndex].getVisible(), true, "Forward button should be visible");
			assert.equal(oActionToolbarItems[forwardButtonIndex].getEnabled(), true, "Forward button should be enabled");


			var taskFilter = new TaskInitialFilters(["READY", "RESERVED"], null, null, null);
			test_inbox.bindTaskTable("/Tasks",taskFilter);
			sap.ui.getCore().applyChanges();
			oTable.setSelectionInterval(7,8);

			oActionToolbar = test_inbox._getActionButtonToolBarForTableView();
			oActionToolbarItems = oActionToolbar.getItems();
			assert.equal(oActionToolbarItems[openButtonIndex].getVisible(), true, "Open Button should  be visible");
			assert.equal(oActionToolbarItems[openButtonIndex].getEnabled(), true, "Open button should be enabled ");
			assert.equal(oActionToolbarItems[claimButtonIndex].getVisible(), true, "Claim button should  be visible");
			assert.equal(oActionToolbarItems[claimButtonIndex].getEnabled(), false, "Claim button should not be enabled");
			assert.equal(oActionToolbarItems[releaseButtonIndex].getVisible(), true, "Release button should  be visible");
			assert.equal(oActionToolbarItems[releaseButtonIndex].getEnabled(), false, "Release button should not be enabled");
			assert.equal(oActionToolbarItems[forwardButtonIndex].getVisible(), true, "Forward button should be visible");
			assert.equal(oActionToolbarItems[forwardButtonIndex].getEnabled(), true, "Forward button should be enabled");

		}

	});

	QUnit.module("bindTaskTable Test");
	QUnit.test("Inbox_checkInitialFilterwithTaskInitialFilter", function(assert) {
		var test_inbox = sap.ui.getCore().byId("testInbox");
		var taskFilter = new TaskInitialFilters(["RESERVED"],null,null,null);// (It is the Status, Priority filters as array)
		test_inbox.bindTaskTable("/Tasks",taskFilter);
		sap.ui.getCore().applyChanges();
		var oPrimaryfilterCombobox = sap.ui.getCore().byId("testInbox--filterComboBox2");
		assert.equal("testInbox--li_openTasks", oPrimaryfilterCombobox.getSelectedItemId(), "Checking if the right Initial filter is displayed in the dropdown");
		var oBinding = sap.ui.getCore().byId("testInbox--listViewTable").getBinding('rows');
		var oFilterApplied = oBinding.aApplicationFilters[0];
		assert.equal("Status",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("EQ",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("RESERVED",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");
	});

	QUnit.test("Inbox_checkDefaultPrimaryFilterwithoutInitialFilters", function(assert) {
		sap.ui.getCore().applyChanges();
		var test_inbox = sap.ui.getCore().byId("testInbox");
		test_inbox.bindTaskTable("/Tasks");
		var oPrimaryfilterCombobox = sap.ui.getCore().byId("testInbox--filterComboBox2");
		assert.equal("testInbox--li_openTasks", oPrimaryfilterCombobox.getSelectedItemId(), "Checking if the right Initial filter is displayed in the dropdown");
		var oBinding = sap.ui.getCore().byId("testInbox--listViewTable").getBinding('rows');
		var oFilterApplied = oBinding.aApplicationFilters[0];
		assert.equal("Status",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("NE",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("COMPLETED",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");
	});

	QUnit.module("bindTasksAPI Test");
	var inx1 = new Inbox("inbox1");
	inx1.setHandleBindings(false);

	var oInboxFilter = new InboxFilters();
	var oInboxSecondaryFilter = new InboxSecondaryFilters();
	var taskFilter = new TaskInitialFilters(["READY"],null,null,null);// (It is the Status, Priority filters as array)
	oInboxFilter.setSecondaryFilter(taskFilter);

	var oModel = new JSONModel();
	oModel.setData(jsonData);

	inx1.setModel(oModel);
	inx1.bindTaskTypeDynamicFilter(function(){var t = []; t.push('Raise Purchase Request'); t.push('Some Dummy Task'); t.push('Purchase Order Form'); t.push('LeaveReq'); return t;});
	inx1.bindTasks("/Tasks",oInboxFilter);
	inx1.bindTaskExecutionURL(function(id){return "/demokit";},function(id){return "COMPLETED";});
	inx1.bindSearch(function(){alert('Not Supported');});
	inx1.attachRefresh(function(){oModel.setData(jsonDataRefresh);});
	inx1.attachTaskAction(function(oEvent){alert(oEvent.getParameter('action')); alert(oEvent.getParameter('selectedIDs')); oModel.setData(jsonDataClaimed);});
	inx1.placeAt("uiArea1");

	var prioFilterList = sap.ui.getCore().byId("inbox1--INBOX_FILTER_PRIORITY");
	var statusFilterList = sap.ui.getCore().byId("inbox1--INBOX_FILTER_STATUS");
	var dateTimeFilterList = sap.ui.getCore().byId("inbox1--INBOX_FILTER_CREATION_DATE");
	var taskTypeFilterList = sap.ui.getCore().byId("inbox1--INBOX_FILTER_TASK_TYPE");
	var dueDateTimeFilterList = sap.ui.getCore().byId("inbox1--INBOX_FILTER_DUE_DATETIME");

	QUnit.test("InboxCreationOk", 2, function(assert) {
		sap.ui.getCore().applyChanges();
		assert.equal(false, (jQuery.sap.byId("inbox1") === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (jQuery.sap.byId("inbox1") === null), "Checking if the Inbox Control is created and is not null.");
		qutils.triggerMouseEvent("inbox1" + "--tableViewSelectionButton", "click");

	});

	QUnit.test("InboxCreationDataCreation", 1, function(assert) {
		sap.ui.getCore().applyChanges();
		assert.equal(true, (sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows').iLength > 0), "Checking if the Inbox Control is created and data bound.");
	});

	QUnit.test("InboxDefaultSorter", 3, function(assert) {
		sap.ui.getCore().applyChanges();
		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oSorter = oBinding.aSorters[0];
		assert.equal(false, (oSorter === undefined), "Checking if the Inbox Control has applied sorter on the List View");
		assert.equal(true, (oSorter.sPath === "CreatedOn"), "Checking if the path of the default sorter applied is correct");
		assert.equal(true, oSorter.bDescending, "Checking if the order of the default sorter applied is correct");
	});
	QUnit.test("InboxInitialSorter_IndicatedOnUI", 2, function(assert) {
		sap.ui.getCore().applyChanges();
		var oTaskTitleColumn = sap.ui.getCore().byId("inbox1--CreatedOn");
		assert.equal(true, (oTaskTitleColumn.getSorted()), "Checking if the the Start Date column is marked as sorted");
		assert.equal(true, (oTaskTitleColumn.getSortOrder() === SortOrder.Descending), "Checking if the sorted Order marked in the column is right");
	});

	QUnit.test("InboxInitialSorter", 3, function(assert) {
		sap.ui.getCore().applyChanges();
		inx1.bindTasks("/Tasks",oInboxFilter,new Sorter("TaskTitle",true));
		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oSorter = oBinding.aSorters[0];
		assert.equal(false, (oSorter === undefined), "Checking if the Inbox Control has applied sorter on the List View");
		assert.equal(true, (oSorter.sPath === "TaskTitle"), "Checking if the path of the sorter applied is same as the one passed in Initial Sorter");
		assert.equal(true, oSorter.bDescending, "Checking if the order of the sorter applied is same as the one passed in Initial Sorter");
	});

	QUnit.test("InboxInitialSorter_IndicatedOnUI", 3, function(assert) {
		sap.ui.getCore().applyChanges();
		var oTaskTitleColumn = sap.ui.getCore().byId("inbox1--TaskTitle");
		assert.equal(true, (oTaskTitleColumn.getSorted()), "Checking if the the TaskTitle column is marked as sorted");
		assert.equal(true, (oTaskTitleColumn.getSortOrder() === SortOrder.Descending), "Checking if the sorted Order marked in the column is right");
		var oCreatedOnColumn = sap.ui.getCore().byId("inbox1--CreatedOn");
		assert.equal(false, (oCreatedOnColumn.getSorted()), "Checking if the Created On column is not marked as sorted");
	});
	QUnit.test("InboxInitialSorterOnPropertywhichisnotaDefaultColumn", 3, function(assert) {
		sap.ui.getCore().applyChanges();
		inx1.bindTasks("/Tasks",oInboxFilter,new Sorter("Category",false));
		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oSorter = oBinding.aSorters[0];
		assert.equal(false, (oSorter === undefined), "Checking if the Inbox Control has applied sorter on the List View");
		assert.equal(true, (oSorter.sPath === "Category"), "Checking if the path of the sorter applied is same as the one passed in Initial Sorter");
		assert.equal(false, oSorter.bDescending, "Checking if the order of the sorter applied is same as the one passed in Initial Sorter");
	});

	QUnit.test("InboxInitialSorterOnPropertywhichisnotaDefaultColumn_IndicatedOnUI", 5, function(assert) {
		sap.ui.getCore().applyChanges();
		var oColumn = sap.ui.getCore().byId("inbox1--TaskTitle");
		assert.equal(false, (oColumn.getSorted()), "Checking if the the TaskTitle column is not marked as sorted");
		oColumn = sap.ui.getCore().byId("inbox1--CreatedOn");
		assert.equal(false, (oColumn.getSorted()), "Checking if the the CreatedOn column is not marked as sorted");
		oColumn = sap.ui.getCore().byId("inbox1--Priority");
		assert.equal(false, (oColumn.getSorted()), "Checking if the the Priority column is not marked as sorted");
		oColumn = sap.ui.getCore().byId("inbox1--Status");
		assert.equal(false, (oColumn.getSorted()), "Checking if the the Status column is not marked as sorted");
		oColumn = sap.ui.getCore().byId("inbox1--CompletionDeadLine");
		assert.equal(false, (oColumn.getSorted()), "Checking if the the CompletionDeadLine column is not marked as sorted");
	});
	QUnit.test("InboxInitialSortForCustomAttributes", 6, function(assert) {
		sap.ui.getCore().applyChanges();
		var oDynamicFilter = function(){var t = []; t.push('Raise Purchase Request'); t.push('Some Dummy Task'); t.push('Purchase Order Form'); t.push('LeaveReq'); return t;};
		inx1.bindTaskTypeDynamicFilter(oDynamicFilter);
		var oTable = sap.ui.getCore().byId(inx1.getId() + '--' + 'listViewTable');
		var initialNumberOfColumns = oTable.getColumns().length;

		var aCustomAttributeMetadata = [
										{Name: "FirstName",Label:"First Name",Type:"String"},
										{Name:"SurName",Label:"Sur Name",Type:"String"}
										];
		inx1._createCustomAttributeColumns(aCustomAttributeMetadata);

		inx1.bindTasks("/Tasks",oInboxFilter,new Sorter("CustomAttributeData/FirstName",true));

		assert.equal(oTable.getColumns().length, initialNumberOfColumns + 2, "Checking if the CustomAttributes columns are getting created");
		assert.equal(oTable.getColumns()[1].getLabel().getText(), "First Name", "Checking if the CustomAttributes column 1 Label is correct");
		assert.equal(oTable.getColumns()[2].getLabel().getText(), "Sur Name", "Checking if the CustomAttributes column 2 Label is correct");

		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oSorter = oBinding.aSorters[0];
		assert.equal(false, (oSorter === undefined), "Checking if the Inbox Control has applied sorter on the List View");
		assert.equal(true, (oSorter.sPath === "CustomAttributeData/FirstName"), "Checking if the path of the sorter applied is same as the one passed in Initial Sorter");
		assert.equal(true, oSorter.bDescending, "Checking if the order of the sorter applied is same as the one passed in Initial Sorter");

	});
	QUnit.test("InboxInitialSortForCustomAttributes_IndicatorOnUI", 7, function(assert) {
		sap.ui.getCore().applyChanges();
		var oColumn = sap.ui.getCore().byId("inbox1--FirstName");
		assert.equal(true, (oColumn.getSorted()), "Checking if the the Custom Attribute column is marked as sorted");
		assert.equal(true, (oColumn.getSortOrder() === SortOrder.Descending), "Checking if the sorted Order marked in the column is right");
		var oColumn = sap.ui.getCore().byId("inbox1--TaskTitle");
		assert.equal(false, (oColumn.getSorted()), "Checking if the the TaskTitle column is not marked as sorted");
		var oCreatedOnColumn = sap.ui.getCore().byId("inbox1--CreatedOn");
		assert.equal(false, (oCreatedOnColumn.getSorted()), "Checking if the Created On column is not marked as sorted");
		oColumn = sap.ui.getCore().byId("inbox1--Priority");
		assert.equal(false, (oColumn.getSorted()), "Checking if the the Priority column is not marked as sorted");
		oColumn = sap.ui.getCore().byId("inbox1--Status");
		assert.equal(false, (oColumn.getSorted()), "Checking if the the Status column is not marked as sorted");
		oColumn = sap.ui.getCore().byId("inbox1--CompletionDeadLine");
		assert.equal(false, (oColumn.getSorted()), "Checking if the the CompletionDeadLine column is not marked as sorted");
	});
	//TODO: enhance for Different Values
	QUnit.test("InboxInitialFilter-OnlyPrimaryFilter", function(assert) {
		sap.ui.getCore().applyChanges();
		var oFilterCriteria = new InboxFilters();
		var oPrimaryFilter = new InboxPrimaryFilters();
		oPrimaryFilter.setFilter(InboxPrimaryFilterEnum.COMPLETED);
		oFilterCriteria.setPrimaryFilter(oPrimaryFilter);
		inx1.bindTasks("/Tasks",oFilterCriteria,new Sorter("Category",false));

		var oPrimaryfilterCombobox = sap.ui.getCore().byId("inbox1--filterComboBox2");
		assert.equal("inbox1--li_completedTasks", oPrimaryfilterCombobox.getSelectedItemId(), "Checking if the right Initial filter is displayed in the dropdown");
		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oFilterApplied = oBinding.aApplicationFilters[0];
		assert.equal("Status",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("EQ",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("COMPLETED",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");
	});
	QUnit.test("InboxInitialFilter-OnlySecondaryFilter", function(assert) {
		sap.ui.getCore().applyChanges();
		var oFilterCriteria = new InboxFilters();

		var aFilterObjects = [];
		aFilterObjects.push({sPath : InboxSecondaryFilterPathEnum.STATUS, values : [InboxSecondaryFilterValuesEnum.Status.READY, InboxSecondaryFilterValuesEnum.Status.RESERVED]});
		//aFilterObjects.push({sPath : sap.uiext.inbox.InboxSecondaryFilterPathEnum.PRIORITY, values : [sap.uiext.inbox.InboxSecondaryFilterValuesEnum.Priority.LOW, sap.uiext.inbox.InboxSecondaryFilterValuesEnum.Priority.HIGH]});
		//aFilterObjects.push({sPath : sap.uiext.inbox.InboxSecondaryFilterPathEnum.DUEDATE, values : [sap.uiext.inbox.InboxSecondaryFilterValuesEnum.DueDate.TODAY, sap.uiext.inbox.InboxSecondaryFilterValuesEnum.DueDate.NEXT_7_DAYS]});
		//aFilterObjects.push({sPath : sap.uiext.inbox.InboxSecondaryFilterPathEnum.STARTDATE, values : [sap.uiext.inbox.InboxSecondaryFilterValuesEnum.StartDate.TODAY, sap.uiext.inbox.InboxSecondaryFilterValuesEnum.StartDate.LAST_30_DAYS]});
		//aFilterObjects.push({sPath : sap.uiext.inbox.InboxSecondaryFilterPathEnum.TASKTYPE, values : ["bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2Fe4b86581325e671ca30f136df1a6dea1", ""]});

		var oSecondaryFilter = new InboxSecondaryFilters();
		oSecondaryFilter.setStandardFilters(aFilterObjects);

		oFilterCriteria.setSecondaryFilter(oSecondaryFilter);

		inx1.bindTasks("/Tasks",oFilterCriteria,new Sorter("Category",false));

		var oPrimaryfilterCombobox = sap.ui.getCore().byId("inbox1--filterComboBox2");
		assert.equal("inbox1--li_openTasks", oPrimaryfilterCombobox.getSelectedItemId(), "Checking if the right Initial filter is displayed in the dropdown");
		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oFilterAppliedLength = oBinding.aApplicationFilters.length;
		assert.equal(2,oFilterAppliedLength , "Checking if the Inbox Control has the two initial filter applied");

		var oFilterApplied = oBinding.aApplicationFilters[0];

		assert.equal("Status",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("EQ",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("READY",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");

		oFilterApplied = oBinding.aApplicationFilters[1];

		assert.equal("Status",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("EQ",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("RESERVED",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");

		var aStatusFilterSelKeys = statusFilterList.getSelectedKeys();
		assert.equal(2,aStatusFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for Status");
		assert.equal(true,(jQuery.inArray("INBOX_FILTER_STATUS_READY",aStatusFilterSelKeys) !== -1), "Checking if the Inbox Facet List for Status has selected right values");
		assert.equal(true,(jQuery.inArray("INBOX_FILTER_STATUS_RESERVED",aStatusFilterSelKeys) !== -1), "Checking if the Inbox Facet List for Status has selected right values");
		//check binding for Filter

	});
	QUnit.test("InboxInitialFilter-PrimaryandSecondaryFilter", function(assert) {
		sap.ui.getCore().applyChanges();
		var oFilterCriteria = new InboxFilters();
		var oPrimaryFilter = new InboxPrimaryFilters();
		oPrimaryFilter.setFilter(InboxPrimaryFilterEnum.ESCALATED);

		var aFilterObjects = [];
		//aFilterObjects.push({sPath : sap.uiext.inbox.InboxSecondaryFilterPathEnum.STATUS, values : [sap.uiext.inbox.InboxSecondaryFilterValuesEnum.Status.READY, sap.uiext.inbox.InboxSecondaryFilterValuesEnum.Status.RESERVED]});
		aFilterObjects.push({sPath : InboxSecondaryFilterPathEnum.PRIORITY, values : [InboxSecondaryFilterValuesEnum.Priority.LOW, InboxSecondaryFilterValuesEnum.Priority.HIGH]});
		//aFilterObjects.push({sPath : sap.uiext.inbox.InboxSecondaryFilterPathEnum.DUEDATE, values : [sap.uiext.inbox.InboxSecondaryFilterValuesEnum.DueDate.TODAY, sap.uiext.inbox.InboxSecondaryFilterValuesEnum.DueDate.NEXT_7_DAYS]});
		//aFilterObjects.push({sPath : sap.uiext.inbox.InboxSecondaryFilterPathEnum.STARTDATE, values : [sap.uiext.inbox.InboxSecondaryFilterValuesEnum.StartDate.TODAY, sap.uiext.inbox.InboxSecondaryFilterValuesEnum.StartDate.LAST_30_DAYS]});
		aFilterObjects.push({sPath : InboxSecondaryFilterPathEnum.TASKTYPE, values : ["bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2Fe4b86581325e671ca30f136df1a6dea1", ""]});

		var oSecondaryFilter = new InboxSecondaryFilters();
		oSecondaryFilter.setStandardFilters(aFilterObjects);

		oFilterCriteria.setPrimaryFilter(oPrimaryFilter);
		oFilterCriteria.setSecondaryFilter(oSecondaryFilter);

		inx1.bindTasks("/Tasks",oFilterCriteria,new Sorter("TaskTitle",false));

		var oPrimaryfilterCombobox = sap.ui.getCore().byId("inbox1--filterComboBox2");
		assert.equal("inbox1--li_escalatedTasks", oPrimaryfilterCombobox.getSelectedItemId(), "Checking if the right Initial filter is displayed in the dropdown");
		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oFilterAppliedLength = oBinding.aApplicationFilters.length;


		assert.equal(5,oFilterAppliedLength , "Checking if the Inbox Control has the 5 initial filter applied");

		var oFilterApplied = oBinding.aApplicationFilters[0];

		assert.equal("TaskDefinitionID",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("EQ",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("bpm://bpm.sap.com/task-definition/e4b86581325e671ca30f136df1a6dea1",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");

		oFilterApplied = oBinding.aApplicationFilters[1];

		assert.equal("Priority",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("EQ",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("LOW",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");

		oFilterApplied = oBinding.aApplicationFilters[2];

		assert.equal("Priority",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("EQ",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("HIGH",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");

		oFilterApplied = oBinding.aApplicationFilters[3];

		assert.equal("IsEscalated",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("EQ",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal(true,oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");

		var aPrioFilterSelKeys = prioFilterList.getSelectedKeys();
		assert.equal(2,aPrioFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for Priority");

		assert.equal(true,(jQuery.inArray("INBOX_FILTER_PRIORITY_LOW",aPrioFilterSelKeys) !== -1), "Checking if the Inbox Facet List for Status has selected right values");
		assert.equal(true,(jQuery.inArray("INBOX_FILTER_PRIORITY_HIGH",aPrioFilterSelKeys) !== -1), "Checking if the Inbox Facet List for Status has selected right values");

		//TODO: check for UI keys for Task Types being selected : does not work for JSON
		//check binding for Filter
	});
	QUnit.test("InboxInitialFilter-primaryandSecondaryFilterwithSort", function(assert) {
		sap.ui.getCore().applyChanges();
		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oSorter = oBinding.aSorters[0];
		assert.equal(false, (oSorter === undefined), "Checking if the Inbox Control has applied sorter on the List View");
		assert.equal(true, (oSorter.sPath === "TaskTitle"), "Checking if the path of the sorter applied is same as the one passed in Initial Sorter");
		assert.equal(false, oSorter.bDescending, "Checking if the order of the sorter applied is same as the one passed in Initial Sorter");

		var oTaskTitleColumn = sap.ui.getCore().byId("inbox1--TaskTitle");
		assert.equal(true, (oTaskTitleColumn.getSorted()), "Checking if the the TaskTitle column is marked as sorted");
		assert.equal(false, (oTaskTitleColumn.getSortOrder() === SortOrder.Descending), "Checking if the sorted Order marked in the column is right");
		var oCreatedOnColumn = sap.ui.getCore().byId("inbox1--CreatedOn");
		assert.equal(false, (oCreatedOnColumn.getSorted()), "Checking if the Created On column is not marked as sorted");
	});
	QUnit.test("InboxInitialFilter-NoFiltersOnlySort", function(assert) {
		sap.ui.getCore().applyChanges();
		inx1.bindTasks("/Tasks",null,new Sorter("Priority",true));

		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oSorter = oBinding.aSorters[0];
		assert.equal(false, (oSorter === undefined), "Checking if the Inbox Control has applied sorter on the List View");
		assert.equal(true, (oSorter.sPath === "Priority"), "Checking if the path of the sorter applied is same as the one passed in Initial Sorter");
		assert.equal(true, oSorter.bDescending, "Checking if the order of the sorter applied is same as the one passed in Initial Sorter");

		var oTaskTitleColumn = sap.ui.getCore().byId("inbox1--Priority");
		assert.equal(true, (oTaskTitleColumn.getSorted()), "Checking if the the TaskTitle column is marked as sorted");
		assert.equal(true, (oTaskTitleColumn.getSortOrder() === SortOrder.Descending), "Checking if the sorted Order marked in the column is right");
		var oCreatedOnColumn = sap.ui.getCore().byId("inbox1--CreatedOn");
		assert.equal(false, (oCreatedOnColumn.getSorted()), "Checking if the Created On column is not marked as sorted");

		var oPrimaryfilterCombobox = sap.ui.getCore().byId("inbox1--filterComboBox2");
		assert.equal("inbox1--li_openTasks", oPrimaryfilterCombobox.getSelectedItemId(), "Checking if the right Initial filter is displayed in the dropdown");
		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oFilterAppliedLength = oBinding.aApplicationFilters.length;


		assert.equal(1,oFilterAppliedLength , "Checking if the Inbox Control has the 4 initial filter applied");

		var oFilterApplied = oBinding.aApplicationFilters[0];

		assert.equal("Status",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("NE",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("COMPLETED",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");

		var aPrioFilterSelKeys = prioFilterList.getSelectedKeys();
		assert.equal(1,aPrioFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for Priority");
		assert.equal("sapUiFacetFilter_ALL",aPrioFilterSelKeys[0] , "Checking if two values are selected in the Fact Filter List value for selecdted Key in TaskType");

		var aFilterSelKeys = statusFilterList.getSelectedKeys();
		//check if the value is all
		assert.equal(1,aFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for Status");
		assert.equal("sapUiFacetFilter_ALL",aFilterSelKeys[0] , "Checking if two values are selected in the Fact Filter List value for selecdted Key in TaskType");

		var aFilterSelKeys = taskTypeFilterList.getSelectedKeys();
		assert.equal(1,aFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for TaskType");
		assert.equal("sapUiFacetFilter_ALL",aFilterSelKeys[0] , "Checking if two values are selected in the Fact Filter List value for selecdted Key in TaskType");

		var aFilterSelKeys = dueDateTimeFilterList.getSelectedKeys();
		assert.equal(1,aFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for Due Date");
		assert.equal("sapUiFacetFilter_ALL",aFilterSelKeys[0] , "Checking if two values are selected in the Fact Filter List value for selecdted Key in TaskType");

		var aFilterSelKeys = dateTimeFilterList.getSelectedKeys();
		assert.equal(1,aFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for Start Date");
		assert.equal("sapUiFacetFilter_ALL",aFilterSelKeys[0] , "Checking if two values are selected in the Fact Filter List value for selecdted Key in TaskType");
	});
	QUnit.test("InboxInitialFilter-NoFiltersNoSort", function(assert) {
		sap.ui.getCore().applyChanges();
		inx1.bindTasks("/Tasks");

		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oSorter = oBinding.aSorters[0];
		assert.equal(false, (oSorter === undefined), "Checking if the Inbox Control has applied sorter on the List View");
		assert.equal(true, (oSorter.sPath === "CreatedOn"), "Checking if the path of the default sorter applied is correct");
		assert.equal(true, oSorter.bDescending, "Checking if the order of the default sorter applied is correct");

		var oPrimaryfilterCombobox = sap.ui.getCore().byId("inbox1--filterComboBox2");
		assert.equal("inbox1--li_openTasks", oPrimaryfilterCombobox.getSelectedItemId(), "Checking if the right Initial filter is displayed in the dropdown");
		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oFilterAppliedLength = oBinding.aApplicationFilters.length;


		assert.equal(1,oFilterAppliedLength , "Checking if the Inbox Control has the 4 initial filter applied");

		var oFilterApplied = oBinding.aApplicationFilters[0];

		assert.equal("Status",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("NE",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("COMPLETED",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");

		var aPrioFilterSelKeys = prioFilterList.getSelectedKeys();
		assert.equal(1,aPrioFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for Priority");

		var aFilterSelKeys = statusFilterList.getSelectedKeys();
		//check if the value is all
		assert.equal(1,aFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for Status");
		assert.equal("sapUiFacetFilter_ALL",aFilterSelKeys[0] , "Checking if two values are selected in the Fact Filter List value for selecdted Key in TaskType");

		var aFilterSelKeys = taskTypeFilterList.getSelectedKeys();
		assert.equal(1,aFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for TaskType");
		assert.equal("sapUiFacetFilter_ALL",aFilterSelKeys[0] , "Checking if two values are selected in the Fact Filter List value for selecdted Key in TaskType");

		var aFilterSelKeys = dueDateTimeFilterList.getSelectedKeys();
		assert.equal(1,aFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for Due Date");
		assert.equal("sapUiFacetFilter_ALL",aFilterSelKeys[0] , "Checking if two values are selected in the Fact Filter List value for selecdted Key in TaskType");

		var aFilterSelKeys = dateTimeFilterList.getSelectedKeys();
		assert.equal(1,aFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for Start Date");
		assert.equal("sapUiFacetFilter_ALL",aFilterSelKeys[0] , "Checking if two values are selected in the Fact Filter List value for selecdted Key in TaskType");

	});
	QUnit.test("InboxInitialFilter-WrongFilterValues", function(assert) {
		sap.ui.getCore().applyChanges();
		var oFilterCriteria = new InboxFilters();
		var oPrimaryFilter = new InboxPrimaryFilters();
		oPrimaryFilter.setFilter(InboxPrimaryFilterEnum.COMPLETED);

		var aFilterObjects = [];
		aFilterObjects.push({sPath : InboxSecondaryFilterPathEnum.STATUS, values : [InboxSecondaryFilterValuesEnum.Priority.READY, InboxSecondaryFilterValuesEnum.DueDate.RESERVED]});

		var oSecondaryFilter = new InboxSecondaryFilters();
		oSecondaryFilter.setStandardFilters(aFilterObjects);

		oFilterCriteria.setPrimaryFilter("some Junk");
		oFilterCriteria.setSecondaryFilter(oSecondaryFilter);

		inx1.bindTasks("/Tasks",oFilterCriteria,new Sorter("Category",false));

		var oPrimaryfilterCombobox = sap.ui.getCore().byId("inbox1--filterComboBox2");
		assert.equal("inbox1--li_openTasks", oPrimaryfilterCombobox.getSelectedItemId(), "Checking if the right Initial filter is displayed in the dropdown");
		var oBinding = sap.ui.getCore().byId("inbox1--listViewTable").getBinding('rows');
		var oFilterApplied = oBinding.aApplicationFilters[0];
		assert.equal("Status",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("NE",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("COMPLETED",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");

		var aStatusFilterSelKeys = statusFilterList.getSelectedKeys();
		assert.equal(1,aStatusFilterSelKeys.length , "Checking if two values are selected in the Fact Filter List for Status");
		assert.equal("sapUiFacetFilter_ALL",aStatusFilterSelKeys[0] , "Checking if two values are selected in the Fact Filter List value for selecdted Key in TaskType");

	});

	QUnit.module("Test Table's First Column Formatter Creation");
	var oInbox = sap.ui.getCore().byId("inbox");
	sap.ui.getCore().applyChanges();
	var oColumnTemplate = oInbox._getFirstColumnContentTemplate();
	var oDataOfFirstRow  = sap.ui.getCore().byId('inbox--firstColumnLayout-col0-row0');

	QUnit.test("Is HorizontalLayout Created", function(assert) {
		assert.equal((!oColumnTemplate), false, "Checking if column template is not undefined or has null value");
	});

	QUnit.test("Is column template of type InboxTaskTitleControl", function(assert) {
		assert.equal((oColumnTemplate instanceof sap.uiext.inbox.composite.InboxTaskTitleControl), true ,"Checking type of column template");
	});


	var expectedCustomStyleClassValue = "sapUiExtInboxTaskTitleLink";

	QUnit.test("Does Table's First Column contain a Title Link", function(assert) {
		var taskLink = oColumnTemplate.getTitleLink();
		assert.equal((taskLink instanceof sap.ui.commons.Link), true ,"Checking for the column template second content type");
		assert.equal(taskLink.aCustomStyleClasses[0], expectedCustomStyleClassValue ,"Checking if Task category icon has style class");
	});

	QUnit.test("Check if table's first column of the first row contains a task icon", function (assert) {
		var oFirstRow = sap.ui.getCore().byId('inbox--listViewTable').getRows()[0];
		assert.equal(oFirstRow.getCells()[0].getProperty("categoryIconURI"), "sap-icon://task","Checking if Icon font is present in the First Row's first column");
	});

	QUnit.module("Test $Expand URL Parameter");
	var oInbox = sap.ui.getCore().byId("inbox");
	var expectedResult;
	var sExpandParameters = oInbox._getExpandParameters();

	QUnit.test("Test Expand Parameters for Initial Load in Table View", function(assert) {
		assert.equal(sExpandParameters, "" ,"Checking if the expand parameters is not empty");
	});

	QUnit.test("Test Expand Parameters for Initial Load in Table View", function(assert) {
		assert.equal((sExpandParameters !== undefined), true ,"Checking if the expand parameters is not undefined");
	});

	QUnit.test("Test Expand Parameters in Table View for scenario: showTaskCategory=false, showTaskDescription=false, isCustomAttributesEnabled=false", function(assert) {
		oInbox.currentView = "sap_inbox_list";
		oInbox.showTaskCategory = false;
		oInbox.showTaskDescription = false;
		oInbox.isCustomAttributesEnabled = false;
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, "" ,"Expand parameters should be empty");
	});

	QUnit.test("Test Expand Parameters in Table View for scenario: showTaskCategory=true, showTaskDescription=false, isCustomAttributesEnabled=false", function(assert) {
		oInbox.currentView = "sap_inbox_list";
		oInbox.showTaskCategory = true;
		oInbox.showTaskDescription = false;
		oInbox.isCustomAttributesEnabled = false;
		expectedResult = "TaskDefinitionData";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Expand parameters should be: " + expectedResult);
	});

	QUnit.test("Test Expand Parameters in Table View for scenario: showTaskCategory=true, showTaskDescription=true, isCustomAttributesEnabled=false", function(assert) {
		oInbox.currentView = "sap_inbox_list";
		oInbox.showTaskCategory = true;
		oInbox.showTaskDescription = true;
		oInbox.isCustomAttributesEnabled = false;
		expectedResult = "TaskDefinitionData";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Expand parameters should be: " + expectedResult);
	});

	QUnit.test("Test Expand Parameters in Table View for scenario: showTaskCategory=true, showTaskDescription=false, isCustomAttributesEnabled=true", function(assert) {
		oInbox.currentView = "sap_inbox_list";
		oInbox.showTaskCategory = true;
		oInbox.showTaskDescription = false;
		oInbox.isCustomAttributesEnabled = true;
		expectedResult = "TaskDefinitionData";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Expand parameters should be: " + expectedResult);
	});

	QUnit.test("Test Expand Parameters in Table View for scenario: showTaskCategory=false, showTaskDescription=true, isCustomAttributesEnabled=false", function(assert) {
		oInbox.currentView = "sap_inbox_list";
		oInbox.showTaskCategory = false;
		oInbox.showTaskDescription = true;
		oInbox.isCustomAttributesEnabled = false;
		expectedResult = "";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Expand parameters should be: " + expectedResult);
	});

	QUnit.test("Test Expand Parameters in Table View for scenario: showTaskCategory=false, showTaskDescription=true, isCustomAttributesEnabled=true", function(assert) {
		oInbox.currentView = "sap_inbox_list";
		oInbox.showTaskCategory = false;
		oInbox.showTaskDescription = true;
		oInbox.isCustomAttributesEnabled = true;
		expectedResult = "";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Expand parameters should be: " + expectedResult);
	});

	QUnit.test("Test Expand Parameters in Table View for scenario: showTaskCategory=false, showTaskDescription=false, isCustomAttributesEnabled=true", function(assert) {
		oInbox.currentView = "sap_inbox_list";
		oInbox.showTaskCategory = false;
		oInbox.showTaskDescription = false;
		oInbox.isCustomAttributesEnabled = true;
		expectedResult = "";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Expand parameters should be: " + expectedResult);
	});

	QUnit.test("Test Expand Parameters in Table View for scenario: showTaskCategory=true, showTaskDescription=true, isCustomAttributesEnabled=true", function(assert) {
		oInbox.currentView = "sap_inbox_list";
		oInbox.showTaskCategory = true;
		oInbox.showTaskDescription = true;
		oInbox.isCustomAttributesEnabled = true;
		expectedResult = "TaskDefinitionData";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Should have all possible expand parameters :" + expectedResult);
	});

	QUnit.test("Test Expand Parameters for Initial Load in Stream View", function(assert) {
		oInbox.currentView = "sap_inbox_stream";
		assert.equal(sExpandParameters !== "", true ,"Checking if the expand parameters is not empty");
	});

	QUnit.test("Test Expand Parameters for Initial Load in Stream View", function(assert) {
		oInbox.currentView = "sap_inbox_stream";
		assert.equal((sExpandParameters !== undefined), true ,"Checking if the expand parameters is not undefined");
	});

	QUnit.test("Test Expand Parameters in Stream View for scenario: showTaskCategory=false, showTaskDescription=false, isCustomAttributesEnabled=false", function(assert) {
		oInbox.currentView = "sap_inbox_stream";
		oInbox.showTaskCategory = false;
		oInbox.showTaskDescription = false;
		oInbox.isCustomAttributesEnabled = false;
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, "" ,"Expand parameters should be empty");
	});

	QUnit.test("Test Expand Parameters in Stream View for scenario: showTaskCategory=true, showTaskDescription=false, isCustomAttributesEnabled=false", function(assert) {
		oInbox.currentView = "sap_inbox_stream";
		oInbox.showTaskCategory = true;
		oInbox.showTaskDescription = false;
		oInbox.isCustomAttributesEnabled = false;
		expectedResult = "TaskDefinitionData";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Expand parameters should be: " + expectedResult);
	});

	QUnit.test("Test Expand Parameters in Stream View for scenario: showTaskCategory=true, showTaskDescription=true, isCustomAttributesEnabled=false", function(assert) {
		oInbox.currentView = "sap_inbox_stream";
		oInbox.showTaskCategory = true;
		oInbox.showTaskDescription = true;
		oInbox.isCustomAttributesEnabled = false;
		expectedResult = "TaskDefinitionData,Description";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Expand parameters should be: " + expectedResult);
	});
	QUnit.test("Test Expand Parameters in Stream View for scenario: showTaskCategory=true, showTaskDescription=false, isCustomAttributesEnabled=true", function(assert) {
		oInbox.currentView = "sap_inbox_stream";
		oInbox.showTaskCategory = true;
		oInbox.showTaskDescription = false;
		oInbox.isCustomAttributesEnabled = true;
		expectedResult = "TaskDefinitionData";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Expand parameters should be: " + expectedResult);
	});

	QUnit.test("Test Expand Parameters in Stream View for scenario: showTaskCategory=false, showTaskDescription=true, isCustomAttributesEnabled=false", function(assert) {
		oInbox.currentView = "sap_inbox_stream";
		oInbox.showTaskCategory = false;
		oInbox.showTaskDescription = true;
		oInbox.isCustomAttributesEnabled = false;
		expectedResult = "Description";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Expand parameters should be: " + expectedResult);
	});

	QUnit.test("Test Expand Parameters in Stream View for scenario: showTaskCategory=false, showTaskDescription=true, isCustomAttributesEnabled=true", function(assert) {
		oInbox.currentView = "sap_inbox_stream";
		oInbox.showTaskCategory = false;
		oInbox.showTaskDescription = true;
		oInbox.isCustomAttributesEnabled = true;
		expectedResult = "Description";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Expand parameters should be: " + expectedResult);
	});

	QUnit.test("Test Expand Parameters in Stream View for scenario: showTaskCategory=false, showTaskDescription=false, isCustomAttributesEnabled=true", function(assert) {
		oInbox.currentView = "sap_inbox_stream";
		oInbox.showTaskCategory = false;
		oInbox.showTaskDescription = false;
		oInbox.isCustomAttributesEnabled = true;
		expectedResult = "";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Expand parameters should be: " + expectedResult);
	});

	QUnit.test("Test Expand Parameters in Stream View for scenario: showTaskCategory=true, showTaskDescription=true, isCustomAttributesEnabled=true", function(assert) {
		oInbox.currentView = "sap_inbox_stream";
		oInbox.showTaskCategory = true;
		oInbox.showTaskDescription = true;
		oInbox.isCustomAttributesEnabled = true;
		expectedResult = "TaskDefinitionData,Description";
		sExpandParameters = oInbox._getExpandParameters();
		assert.equal(sExpandParameters, expectedResult ,"Should have all possible expand parameters :" + expectedResult);
	});

	QUnit.module("Test Custom Statuses");

	sap.ui.getCore().applyChanges();
	QUnit.test("Test for Custom Status metadata", function(assert) {
		var oMetaObjectWithFilterOption = {"dataServices":{"schema":[{"entityType":[{"name":"Task","property":[{"name":"StatusText"},{"name":"Status"}]}
		]}]}};
		var tcmMeta = new TCMMetadata();
		tcmMeta.setServiceMetadata(oMetaObjectWithFilterOption);
		var s = tcmMeta.serviceSupportsFilterOption;
		assert.equal(s,true,"Check for Valid Custom Status");


		var oMetaObjectWithInvalidFilterOption =  {"dataServices":{"schema":[{"entityType":[{"name":"Task","property":[{"name":"StatusText2"}]}
		]}]}};
			tcmMeta.setServiceMetadata(oMetaObjectWithInvalidFilterOption);
			var s = tcmMeta.serviceSupportsFilterOption;
			assert.equal(s,false,"Check for InValid Custom Status");


		});

	QUnit.test("Test For Custom Status value", function(assert) {
		oInbox.oTcmMetadata.serviceSupportsFilterOption = true;
		var s = oInbox._getTaskStatus("READY","Test Status");
		assert.equal(s,"Test Status","Check for Valid Custom Status Value");

		s = oInbox._getTaskStatus("READY","");
		assert.equal(s,"Ready","Check for Empty Custom Status Value");

		s = oInbox._getTaskStatus("READY123","");
		assert.equal(s,"READY123","Check for Empty Custom Status and invalid status");

		oInbox.oTcmMetadata.serviceSupportsFilterOption = false;
		s = oInbox._getTaskStatus("READY","");
		assert.equal(s,"Ready","Check When Custom Status Not supported");

		oInbox.oTcmMetadata.serviceSupportsFilterOption = true;
		s = oInbox._getTaskStatus("READY","");
		assert.equal(s,"Ready","Check When Custom Status Not supported and Valid Status");

		s = oInbox._getTaskStatus("READY123","");
		assert.equal(s,"READY123","Check When Status Not In correct format");

		s = oInbox._getTaskStatus(null,null);
		assert.equal(s,"","Check When Status and StatusLabel are null");
		});

	QUnit.module("Test For Enable/ Disable Substitution Menu Item");
	var oInbox = sap.ui.getCore().byId("inbox");
	sap.ui.getCore().applyChanges();
	QUnit.test("Is Manage Substitution Rules Menu Disabled", function(assert) {

		oInbox.setSubstitutionEnabled(false);
		var tableViewSettingsButton = sap.ui.getCore().byId(oInbox.getId() + '--' + 'settingsButton');
		//var streamViewSettingsButton = sap.ui.getCore().byId(oInbox.getId() + '--' + 'rrSettingsButton');

		assert.equal((tableViewSettingsButton !== undefined), true ,"Checking if Setting' s Button in Table View is not undefined");
		//equals((streamViewSettingsButton !== undefined), true ,"Checking if Setting' s Button in Stream View is not undefined");

		assert.equal(tableViewSettingsButton.getEnabled(), true ,"Checking if Setting' s Button in Table View is enabled");
		//equals(streamViewSettingsButton.getEnabled(),true ,"Checking if Setting' s Button in Stream View is enabled");

		var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
		assert.equal(tableViewSettingsButton.getTooltip(), _oBundle.getText("INBOX_MANAGE_SUBSTITUTION_RULES_TOOLTIP") ,"Checking Setting' s Button Tooltip in Table View ");
		//equals(streamViewSettingsButton.getTooltip(),_oBundle.getText("INBOX_MANAGE_SUBSTITUTION_RULES_TOOLTIP") ,"Checking Setting' s Button Tooltip in Stream View ");

		assert.equal(tableViewSettingsButton.getIcon(), "sap-icon://workflow-tasks" ,"Checking Setting' s Button Icon in Table View ");
		//equals(streamViewSettingsButton.getIcon(),"sap-icon://workflow-tasks" ,"Checking Setting' s Button Icon in Stream View ");



	});
	QUnit.module("Test for Inbox control destroy.");
	QUnit.test("InoxDestroyTest", function(assert) {
		sap.ui.getCore().applyChanges();
		//Tests for Substitution Disabled as default behaviour
		var oInbox = new Inbox("inboxDestroy");
		oInbox.setHandleBindings(false);
		var oTaskFilter = new TaskInitialFilters(["READY"],null,null,null);// (It is the Status, Priority filters as array)
		var oModel = new JSONModel();
		oModel.setData(jsonData);
		oInbox.setModel(oModel);
		oInbox.bindTaskTypeDynamicFilter(function(){var t = []; t.push('Raise Purchase Request'); t.push('Some Dummy Task'); t.push('Purchase Order Form'); t.push('LeaveReq'); return t;});
		oInbox.bindTaskTable("/Tasks",oTaskFilter);
		oInbox.bindTaskExecutionURL(function(id){return "/demokit";},function(id){return "COMPLETED";});
		oInbox.bindSearch(function(){alert('Not Supported');});
		oInbox.attachRefresh(function(){oModel.setData(jsonDataRefresh);});
		oInbox.attachTaskAction(function(oEvent){alert(oEvent.getParameter('action')); alert(oEvent.getParameter('selectedIDs')); oModel.setData(jsonDataClaimed);});
		var oInboxToDestroy = sap.ui.getCore().byId("inboxDestroy");
		assert.notDeepEqual(oInboxToDestroy,undefined,"Inbox control should be available.");
		oInboxToDestroy.destroy();
		var oInboxAfterDestroy = sap.ui.getCore().byId("inboxDestroy");
		assert.deepEqual(oInboxAfterDestroy,undefined,"Inbox control should not be available after destroy.");
		var oNewInbox = new Inbox("inboxDestroy");
		var oInboxAfterCreation = sap.ui.getCore().byId("inboxDestroy");
		assert.notDeepEqual(oInboxAfterCreation,undefined,"Inbox control should be available.");
	}
	);

	QUnit.module("NoTaskTitle Check");
	QUnit.test("TextForNoTaskTitle", function(assert) {
		sap.ui.getCore().applyChanges();
		var inboxControl = sap.ui.getCore().byId("testInbox");
		var oTable = sap.ui.getCore().byId(inboxControl.getId() + '--' + 'listViewTable');
		var oRow = oTable.getRows()[3];
		var oRow1 = oTable.getRows()[4];
		var lessThanSymbol = InboxConstants.LESS_THAN;
		var greaterThanSymbol = InboxConstants.GREATER_THAN;
		var sTitle = lessThanSymbol + "Task title unavailable" + greaterThanSymbol;
		assert.equal( oRow.getCells()[0].getAggregation('titleLink').getText(), sTitle);
		assert.equal(oRow1.getCells()[0].getAggregation('titleLink').getText(), sTitle);
	});

	QUnit.test("TooltipForNoTaskTitle", function(assert) {
		sap.ui.getCore().applyChanges();
		var inboxControl = sap.ui.getCore().byId("testInbox");
		var oTable = sap.ui.getCore().byId(inboxControl.getId() + '--' + 'listViewTable');
		var oRow = oTable.getRows()[3];
		var oRow1 = oTable.getRows()[4];
		var sTitle = "Task title unavailable";
		assert.equal( oRow.getCells()[0].getAggregation('titleLink').getTooltip(), sTitle);
		assert.equal( oRow1.getCells()[0].getAggregation('titleLink').getTooltip(), sTitle);
	});

	QUnit.module("TableColumnCreationTest");
	var oInbox = sap.ui.getCore().byId("inbox");
	var oTable = sap.ui.getCore().byId(oInbox.getId() + '--' + 'listViewTable');
	var oTableColumns = oTable.getColumns();

	QUnit.test("TestNumberOfColumnsCreated", function(assert) {
	  var expectedNumberOfColumns = 6;
	  assert.equal(oTableColumns.length, expectedNumberOfColumns, "Test to check number of columns in the Inbox Table");
	});

	QUnit.test("TestTaskTitleColumn", function(assert) {
		var oTaskTitleColumn = oTableColumns[0];
		assert.equal((oTaskTitleColumn !== undefined), true, "Test to check if Column in the Inbox Table is defined");
		var columnLabel = oTaskTitleColumn.getLabel();
		assert.equal((columnLabel != undefined), true, "Test to check if Column Label in the Inbox Table is defined");
		assert.equal(oTaskTitleColumn.getLabel().getText(), "Task Title", "Test to check if Column in the Inbox Table is 'Task Title'");
		assert.equal(oTaskTitleColumn.getLabel().getTooltip(), "Task Title", "Test to check if Column Label tooltip in the Inbox Table");
		assert.equal(oTaskTitleColumn.getLabel().getDesign(), LabelDesign.Bold, "Test to check if Column label design");

		assert.equal((oTaskTitleColumn.getSortProperty() != undefined), true, "Test to check if Column has sort property defined");
		assert.equal((oTaskTitleColumn.getTemplate() != undefined), true, "Test to check if Column has sort property defined");

		assert.equal(oTaskTitleColumn.getFlexible(), false, "Test to check Column flexible property ");
	});

	QUnit.test("TestCreatedOnColumn", function(assert) {
		var oCreatedOnColumn = oTableColumns[1];
		assert.equal((oCreatedOnColumn !== undefined), true, "Test to check if Column in the Inbox Table is defined");
		var columnLabel = oCreatedOnColumn.getLabel();
		assert.equal((columnLabel != undefined), true, "Test to check if Column Label in the Inbox Table is defined");
		assert.equal(oCreatedOnColumn.getLabel().getText(), "Creation Date", "Test to check if Column in the Inbox Table is 'Creation Date'");
		assert.equal(oCreatedOnColumn.getLabel().getTooltip(), "Start Date", "Test to check if Column Label tooltip in the Inbox Table");
		assert.equal(oCreatedOnColumn.getLabel().getDesign(), LabelDesign.Bold, "Test to check if Column label design");

		assert.equal((oCreatedOnColumn.getSortProperty() != undefined), true, "Test to check if Column has sort property defined");
		assert.equal((oCreatedOnColumn.getTemplate() != undefined), true, "Test to check if Column has sort property defined");

		assert.equal(oCreatedOnColumn.getFlexible(), true, "Test to check Column flexible property ");
	});

	QUnit.test("TestCreatedByColumn", function(assert) {
		var oCreatedByColumn = oTableColumns[2];
		assert.equal((oCreatedByColumn !== undefined), true, "Test to check if Column in the Inbox Table is defined");
		var columnLabel = oCreatedByColumn.getLabel();
		assert.equal((columnLabel != undefined), true, "Test to check if Column Label in the Inbox Table is defined");
		assert.equal(oCreatedByColumn.getLabel().getText(), "Created By", "Test to check if Column in the Inbox Table is 'Created By'");
		assert.equal(oCreatedByColumn.getLabel().getTooltip(), "Created By", "Test to check if Column Label tooltip in the Inbox Table");
		assert.equal(oCreatedByColumn.getLabel().getDesign(), LabelDesign.Bold, "Test to check if Column label design");

		assert.equal((oCreatedByColumn.getSortProperty() != undefined), true, "Test to check if Column has sort property defined");
		assert.equal((oCreatedByColumn.getTemplate() != undefined), true, "Test to check if Column has sort property defined");

		assert.equal(oCreatedByColumn.getFlexible(), true, "Test to check Column flexible property ");
	});

	QUnit.test("TestDueDateColumn", function(assert) {
		var oDueDateColumn = oTableColumns[3];
		assert.equal((oDueDateColumn !== undefined), true, "Test to check if Column in the Inbox Table is defined");
		var columnLabel = oDueDateColumn.getLabel();
		assert.equal((columnLabel != undefined), true, "Test to check if Column Label in the Inbox Table is defined");
		assert.equal(oDueDateColumn.getLabel().getText(), "Due Date", "Test to check if Column in the Inbox Table is 'Due Date'");
		assert.equal(oDueDateColumn.getLabel().getTooltip(), "Due Date", "Test to check if Column Label tooltip in the Inbox Table");
		assert.equal(oDueDateColumn.getLabel().getDesign(), LabelDesign.Bold, "Test to check if Column label design");

		assert.equal((oDueDateColumn.getSortProperty() != undefined), true, "Test to check if Column has sort property defined");
		assert.equal((oDueDateColumn.getTemplate() != undefined), true, "Test to check if Column has sort property defined");

		assert.equal(oDueDateColumn.getFlexible(), true, "Test to check Column flexible property ");
	});

	QUnit.test("TestStatusColumn", function(assert) {
		var oStatusColumn = oTableColumns[4];
		assert.equal((oStatusColumn !== undefined), true, "Test to check if Column in the Inbox Table is defined");
		var columnLabel = oStatusColumn.getLabel();
		assert.equal((columnLabel != undefined), true, "Test to check if Column Label in the Inbox Table is defined");
		assert.equal(oStatusColumn.getLabel().getText(), "Status", "Test to check if Column in the Inbox Table is 'Status'");
		assert.equal(oStatusColumn.getLabel().getTooltip(), "Status", "Test to check if Column Label tooltip in the Inbox Table");
		assert.equal(oStatusColumn.getLabel().getDesign(), LabelDesign.Bold, "Test to check if Column label design");

		assert.equal((oStatusColumn.getSortProperty() != undefined), true, "Test to check if Column has sort property defined");
		assert.equal((oStatusColumn.getTemplate() != undefined), true, "Test to check if Column has sort property defined");

		assert.equal(oStatusColumn.getFlexible(), true, "Test to check Column flexible property ");
	});

	QUnit.test("TestPriorityColumn", function(assert) {
		var oPriorityColumn = oTableColumns[5];
		assert.equal((oPriorityColumn !== undefined), true, "Test to check if Column in the Inbox Table is defined");
		var columnLabel = oPriorityColumn.getLabel();
		assert.equal((columnLabel != undefined), true, "Test to check if Column Label in the Inbox Table is defined");
		assert.equal(oPriorityColumn.getLabel().getText(), "Priority", "Test to check if Column in the Inbox Table is 'Priority'");
		assert.equal(oPriorityColumn.getLabel().getTooltip(), "Priority", "Test to check if Column Label tooltip in the Inbox Table");
		assert.equal(oPriorityColumn.getLabel().getDesign(), LabelDesign.Bold, "Test to check if Column label design");

		assert.equal((oPriorityColumn.getSortProperty() != undefined), true, "Test to check if Column has sort property defined");
		assert.equal((oPriorityColumn.getTemplate() != undefined), true, "Test to check if Column has sort property defined");

		assert.equal(oPriorityColumn.getFlexible(), true, "Test to check Column flexible property ");
	});

	QUnit.done(function() {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
		qutils.triggerMouseEvent("inbox1" + "--tableViewSelectionButton", "click");
		qutils.triggerMouseEvent("testInbox" + "--tableViewSelectionButton", "click");
	});

	//END API for Inbox
});