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
	"sap/ui/model/Sorter",
	"sap/uiext/inbox/InboxPrimaryFilters",
	"sap/uiext/inbox/InboxPrimaryFilterEnum"
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
	Sorter,
	InboxPrimaryFilters,
	InboxPrimaryFilterEnum
) {
	"use strict";


	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");


	// workaround for sync/async issue
	InboxPrimaryFilters = sap.uiext.inbox.InboxPrimaryFilters;

	//Test Data
	//Test Data
	/* var jsonData = {
		"Tasks" : [
		{
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/772e')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/772ea", "Category" : "TASK", "TaskName" : "LeaveReq", "TaskTitle" : "LeaveReq", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335439338973)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412125)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ca')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/c03ca", "Category" : "TASK", "TaskName" : "Sales Order Approval", "TaskTitle" : "Sales Order Approval Task - 1234", "Status" : "RESERVED", "Priority" : "VERY_HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556977)\/", "StartDeadline" : "\/Date(1335436957423)\/", "CompletionDeadline" : "\/Date(1335696157427)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412125)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/c034a", "Category" : "TASK", "TaskName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c071a')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/c07a", "Category" : "TASK", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350556410)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041756660)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be68a')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/be6a", "Category" : "TASK", "TaskName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350554667)\/", "StartDeadline" : "\/Date(1335523354833)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be4aa')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/be4aa", "Category" : "TASK", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350554133)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041754297)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be28a')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/be2a5", "Category" : "TASK", "TaskName" : "Some Dummy Task", "TaskTitle" : "Some Dummy Task for you", "Status" : "READY", "Priority" : "LOW", "Requestor" : "", "CreatedOn" : "\/Date(1335350553633)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}
		], "__count" : "7"
		}; */

	var jsonData = {
			"Tasks" : [
			{
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/772e')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/772ea", "Category" : "TASK", "TaskName" : "LeaveReq", "TaskTitle" : "LeaveReq", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335439338973)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412125)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : "",
			"CustomAttributesCollection" : [
						{
							"__metadata" : {
							"uri" : "http://localhost:8080/uilib-sample/proxy/http/10.66.183.89:50000/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection('FirstName')", "type" : "Inbox.TaskCollection"
							}, "Name" : "FirstName", "Value" : "XYZ"
							}, {
							"__metadata" : {
							"uri" : "http://localhost:8080/uilib-sample/proxy/http/10.66.183.89:50000/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection('SurName')", "type" : "Inbox.TaskCollection"
							}, "Name" : "SurName", "Value" : "Vacation"
						}
						]

			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ca')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/c03ca", "Category" : "TASK", "TaskName" : "Sales Order Approval", "TaskTitle" : "Sales Order Approval Task - 1234", "Status" : "RESERVED", "Priority" : "VERY_HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556977)\/", "StartDeadline" : "\/Date(1335436957423)\/", "CompletionDeadline" : "\/Date(1335696157427)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412125)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/c034a", "Category" : "TASK", "TaskName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c071a')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/c07a", "Category" : "TASK", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350556410)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041756660)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be68a')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/be6a", "Category" : "TASK", "TaskName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350554667)\/", "StartDeadline" : "\/Date(1335523354833)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be4aa')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/be4aa", "Category" : "TASK", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350554133)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041754297)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be28a')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/be2a5", "Category" : "TASK", "TaskName" : "Some Dummy Task", "TaskTitle" : "Some Dummy Task for you", "Status" : "READY", "Priority" : "LOW", "Requestor" : "", "CreatedOn" : "\/Date(1335350553633)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/c03489a", "Category" : "TASK", "TaskName" : "Purchase Order Form", "TaskTitle" : "       ", "Status" : "READY", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
			}, {
			"__metadata" : {
			"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
			}, "ID" : "bpm://bpm.sap.com/task-instance/c03490a", "Category" : "TASK", "TaskName" : "Purchase Order Form", "TaskTitle" : null , "Status" : "READY", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
			}
			], "__count" : "9"
			};

	var jsonDataRefresh = {
				"Tasks" : [
				{
				"__metadata" : {
				"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c0712aba')", "type" : "Inbox.Tasks"
				}, "ID" : "bpm://bpm.sap.com/task-instance/c0718a", "Category" : "TASK", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "READY", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350556410)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041756660)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
				}, {
				"__metadata" : {
				"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be6882da')", "type" : "Inbox.Tasks"
				}, "ID" : "bpm://bpm.sap.com/task-instance/be688a", "Category" : "TASK", "TaskName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350554667)\/", "StartDeadline" : "\/Date(1335523354833)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
				}, {
				"__metadata" : {
				"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be4ab78a')", "type" : "Inbox.Tasks"
				}, "ID" : "bpm://bpm.sap.com/task-instance/be4a8a", "Category" : "TASK", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "COMPLETED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350554133)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041754297)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
				}, {
				"__metadata" : {
				"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be2f1b78a')", "type" : "Inbox.Tasks"
				}, "ID" : "bpm://bpm.sap.com/task-instance/be2f78a", "Category" : "TASK", "TaskName" : "Some Dummy Task", "TaskTitle" : "Some Dummy Task for you", "Status" : "READY", "Priority" : "LOW", "Requestor" : "", "CreatedOn" : "\/Date(1335350553633)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
				}, {
				"__metadata" : {
				"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
				}, "ID" : "bpm://bpm.sap.com/task-instance/c034891a", "Category" : "TASK", "TaskName" : "Purchase Order Form", "TaskTitle" : "       ", "Status" : "READY", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
				}, {
				"__metadata" : {
				"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
				}, "ID" : "bpm://bpm.sap.com/task-instance/c034901a", "Category" : "TASK", "TaskName" : "Purchase Order Form", "TaskTitle" : null , "Status" : "READY", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
				}
				], "__count" : "6"
				};

	var jsonDataClaimed = {
				"Tasks" : [
				{
				"__metadata" : {
				"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c071b78a')", "type" : "Inbox.Tasks"
				}, "ID" : "bpm://bpm.sap.com/task-instance/c0712a", "Category" : "TASK", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350556410)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041756660)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
				}, {
				"__metadata" : {
				"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be6848a')", "type" : "Inbox.Tasks"
				}, "ID" : "bpm://bpm.sap.com/task-instance/be68a", "Category" : "TASK", "TaskName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350554667)\/", "StartDeadline" : "\/Date(1335523354833)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
				}, {
				"__metadata" : {
				"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be4a78a')", "type" : "Inbox.Tasks"
				}, "ID" : "bpm://bpm.sap.com/task-instance/beb78a", "Category" : "TASK", "TaskName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "COMPLETED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350554133)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041754297)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
				}, {
				"__metadata" : {
				"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be278a')", "type" : "Inbox.Tasks"
				}, "ID" : "bpm://bpm.sap.com/task-instance/be278a", "Category" : "TASK", "TaskName" : "Some Dummy Task", "TaskTitle" : "Some Dummy Task for you", "Status" : "READY", "Priority" : "LOW", "Requestor" : "", "CreatedOn" : "\/Date(1335350553633)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
				}, {
				"__metadata" : {
				"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
				}, "ID" : "bpm://bpm.sap.com/task-instance/c034892a", "Category" : "TASK", "TaskName" : "Purchase Order Form", "TaskTitle" : "       ", "Status" : "READY", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
				}, {
				"__metadata" : {
				"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
				}, "ID" : "bpm://bpm.sap.com/task-instance/c034902a", "Category" : "TASK", "TaskName" : "Purchase Order Form", "TaskTitle" : null , "Status" : "READY", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
				}
				], "__count" : "6"
				};



	var inx = new Inbox("inbox");
	inx.setHandleBindings(false);
	inx.defaultView = inx.constants.rowRepeaterView;

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

	QUnit.test("InboxCreationOk", function(assert) {
		sap.ui.getCore().applyChanges();
		var oInbox = jQuery.sap.byId("inbox");
		assert.equal(false, (oInbox === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (oInbox === null), "Checking if the Inbox Control is created and is not null.");
	});

	QUnit.module("PropertiesTest");

	QUnit.test("InboxsCollectionPathOk", 1, function(assert) {
		assert.equal(inbox.sCollectionPath, "/Tasks");
	});

	QUnit.test("InboxIdOk", 1, function(assert) {
		assert.equal(inbox.sId, "inbox");
	});

	QUnit.test("IsJSONModelOk", 1, function(assert) {
		assert.equal(inbox.typeOfModel, "JSON");
	});

	QUnit.module("InboxTableBindings");

	QUnit.test("TaskTableBindingPathOk", 1, function(assert) {
		assert.equal(inboxTaskBinding.sPath, "/Tasks");
	});

	QUnit.test("NumberOfTasksOk", 1, function(assert) {
		assert.equal(inboxTaskBinding.getModel().oData.Tasks.length, "9");
	});

	QUnit.test("InitialFiltersOk", 3, function(assert) {
		assert.equal(inboxTaskBinding.aApplicationFilters[0].sPath, "Status");
		assert.equal(inboxTaskBinding.aApplicationFilters[0].sOperator, "EQ");
		assert.equal(inboxTaskBinding.aApplicationFilters[0].oValue1, "READY");
	});


	QUnit.module("Default View Test");
	QUnit.test("DefaultViewTest", function(assert) {
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
	QUnit.module("Task Title Test");

	QUnit.test("TextForNoTaskTitle", function(assert) {

	var oTable = sap.ui.getCore().byId(inx.getId() + '--' + 'tasksRowRepeater');
	var oRow = oTable.getRows()[0].getRows()[0];
	var oRow1 = oTable.getRows()[1].getRows()[0];
	var lessThanSymbol = InboxConstants.LESS_THAN;
	var greaterThanSymbol = InboxConstants.GREATER_THAN;
	var Title = lessThanSymbol + "Task title unavailable" + greaterThanSymbol;
	assert.equal(Title, oRow.getCells()[1].getContent()[0].getText());
	assert.equal(Title, oRow1.getCells()[1].getContent()[0].getText());
  });

	QUnit.test("TooltipForNoTaskTitle", function(assert) {

	var oTable = sap.ui.getCore().byId(inx.getId() + '--' + 'tasksRowRepeater');
	var oRow = oTable.getRows()[0].getRows()[0];
	var oRow1 = oTable.getRows()[1].getRows()[0];
	var Title = "Task title unavailable";
	assert.equal(Title, oRow.getCells()[1].getContent()[0].getTooltip());
	assert.equal(Title, oRow1.getCells()[1].getContent()[0].getTooltip());
	});

	QUnit.module("Test tooltip for Forward Link");
	QUnit.test("TooltipForForwardLink", function(assert) {
		var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
		var forwardActionLink = sap.ui.getCore().byId(inx.getId() + '--' + 'rrViewForwardAction');
		assert.equal(_oBundle.getText("INBOX_ACTION_BUTTON_FORWARD"), forwardActionLink.getTooltip(), "Checking if tooltip is displayed for forward link");
	});

	QUnit.module("Test Open Task Count for both views");
	QUnit.test("OpenTaskCount", function(assert) {

		var oPrimaryfilterCombobox = sap.ui.getCore().byId(inx.getId() + '--' + 'filterComboBox2');    //task type OPEN
		var oBindingListView = sap.ui.getCore().byId(inx.getId() + '--' + 'listViewTable').getBinding('rows');
		var oFilterApplied = oBindingListView.aApplicationFilters[0].oValue1;                                              // filter as READY
		var numberOfRowsListView = oBindingListView.iLength + 1;
		var oBindingStreamView = sap.ui.getCore().byId(inx.getId() + '--' + 'tasksRowRepeater').getBinding('rows');
		var numberOfRowsStreamView = oBindingStreamView.iLength + 1;
		assert.equal(true, (numberOfRowsListView === numberOfRowsStreamView), "Checking if the open task count is the same for both the views");
		});

	QUnit.module("bindTaskTable Test");
	QUnit.test("Inbox_checkDefaultPrimaryFilterwithoutInitialFilters", function(assert) {
		var test_inbox = sap.ui.getCore().byId("inbox");
		var oPrimaryfilterCombobox = sap.ui.getCore().byId("inbox--filterComboBox2");
		assert.equal("inbox--li_openTasks", oPrimaryfilterCombobox.getSelectedItemId(), "Checking if the right Initial filter is displayed in the dropdown");
		var oBinding = sap.ui.getCore().byId("inbox--listViewTable").getBinding('rows');
		var oFilterApplied = oBinding.aApplicationFilters[0];
		assert.equal("Status",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("EQ",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("READY",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");
	});

	QUnit.test("Inbox_checkInitialFilterwithTaskInitialFilter", function(assert) {
		var test_inbox = sap.ui.getCore().byId("inbox");
		test_inbox.bindTaskTable("/Tasks");

		var oPrimaryfilterCombobox = sap.ui.getCore().byId("inbox--filterComboBox2");
		assert.equal("inbox--li_openTasks", oPrimaryfilterCombobox.getSelectedItemId(), "Checking if the right Initial filter is displayed in the dropdown");
		var oBinding = sap.ui.getCore().byId("inbox--listViewTable").getBinding('rows');
		var oFilterApplied = oBinding.aApplicationFilters[0];
		assert.equal("Status",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("NE",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("COMPLETED",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");
	});
	QUnit.module("bindTasksAPI Test");
	var inx1 = new Inbox("inbox1");
	inx1.setHandleBindings(false);
	inx1.defaultView = inx.constants.rowRepeaterView;

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

	QUnit.test("InboxCreationOk", 2, function(assert) {
		assert.equal(false, (jQuery.sap.byId("inbox1") === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (jQuery.sap.byId("inbox1") === null), "Checking if the Inbox Control is created and is not null.");

	});

	QUnit.test("InboxCreationDataCreation", 1, function(assert) {
		assert.equal(true, (sap.ui.getCore().byId("inbox1--tasksRowRepeater").getBinding('rows').iLength > 0), "Checking if the Inbox Control is created and data bound.");
	});

	QUnit.test("InboxDefaultSorter", 6, function(assert) {
		var oBinding = sap.ui.getCore().byId("inbox1--tasksRowRepeater").getBinding('rows');
		var aSorter = oBinding.aSorters;
		assert.equal(false, (aSorter === undefined), "Checking if the Inbox Control has applied sorter on the Row Repeater View");
		assert.equal(true, (aSorter[0].sPath === "CreatedOn"), "Checking if the path of the default sorter applied is correct");
		assert.equal(true, aSorter[0].bDescending, "Checking if the order of the default sorter applied is correct");
		var oRowRepeaterSortCombobox = inx1._getComponent('sortByFilterComboBox');
		var sRRSelectedItemID = oRowRepeaterSortCombobox.getSelectedItemId();
		assert.equal(true, (sRRSelectedItemID === 'inbox1--li_creationDate'), "Checking if the sort value selected in the DropDown is right");
		var oSortImage = sap.ui.getCore().byId("inbox1--sortImage");
		assert.equal(true, (oSortImage.getTooltip() === "Descending"), "Checking if the sorting image shows the right tooltip");
		assert.equal(true, (oSortImage.getIcon().indexOf('down') !== -1), "Checking if the sorting image shows the right image");
	});

	QUnit.test("InboxInitialSorter", 3, function(assert) {
		inx1.bindTasks("/Tasks",oInboxFilter,new Sorter("TaskTitle",true));
		var oBinding = sap.ui.getCore().byId("inbox1--tasksRowRepeater").getBinding('rows');
		var aSorter = oBinding.aSorters;
		assert.equal(false, (aSorter === undefined), "Checking if the Inbox Control has applied sorter on the Row Repeater View");
		assert.equal(true, (aSorter[0].sPath === "TaskTitle"), "Checking if the path of the Initial sorter applied is correct");
		assert.equal(true, aSorter[0].bDescending, "Checking if the order of the initial sorter applied is correct");
	});
	QUnit.test("InboxInitialSorter_IndicatedOnUI", 3, function(assert) {
		var oRowRepeaterSortCombobox = inx1._getComponent('sortByFilterComboBox');
		var sRRSelectedItemID = oRowRepeaterSortCombobox.getSelectedItemId();
		assert.equal(true, (sRRSelectedItemID === 'inbox1--li_taskTitle'), "Checking if the sort value selected in the DropDown is right");
		var oSortImage = sap.ui.getCore().byId("inbox1--sortImage");
		assert.equal(true, (oSortImage.getTooltip() === "Descending"), "Checking if the sorting image shows the right tooltip");
		assert.equal(true, (oSortImage.getIcon().indexOf('down') !== -1), "Checking if the sorting image shows the right image");
	});
	QUnit.test("InboxInitialSorter", 3, function(assert) {
		inx1.bindTasks("/Tasks",oInboxFilter,new Sorter("Status",false));
		var oBinding = sap.ui.getCore().byId("inbox1--tasksRowRepeater").getBinding('rows');
		var aSorter = oBinding.aSorters;
		assert.equal(false, (aSorter === undefined), "Checking if the Inbox Control has applied sorter on the Row Repeater View");
		assert.equal(true, (aSorter[0].sPath === "Status"), "Checking if the path of the Initial sorter applied is correct");
		assert.equal(false, aSorter[0].bDescending, "Checking if the order of the initial sorter applied is correct");
	});
	QUnit.test("InboxInitialSorter_IndicatedOnUI", 3, function(assert) {
		var oRowRepeaterSortCombobox = inx1._getComponent('sortByFilterComboBox');
		var sRRSelectedItemID = oRowRepeaterSortCombobox.getSelectedItemId();
		assert.equal(true, (sRRSelectedItemID === 'inbox1--li_status'), "Checking if the sort value selected in the DropDown is right");
		var oSortImage = sap.ui.getCore().byId("inbox1--sortImage");
		assert.equal(true, (oSortImage.getTooltip() === "Ascending"), "Checking if the sorting image shows the right tooltip");
		assert.equal(true, (oSortImage.getIcon().indexOf('up') !== -1), "Checking if the sorting image shows the right image");
	});
	QUnit.test("InboxInitialSorterForOptionNotAvaiableinDD", 3, function(assert) {
		inx1.bindTasks("/Tasks",oInboxFilter,new Sorter("Category",false));
		var oBinding = sap.ui.getCore().byId("inbox1--tasksRowRepeater").getBinding('rows');
		var aSorter = oBinding.aSorters;
		assert.equal(false, (aSorter === undefined), "Checking if the Inbox Control has applied sorter on the Row Repeater View");
		assert.equal(true, (aSorter[0].sPath === "Category"), "Checking if the path of the sorter applied is same as the one passed in Initial Sorter");
		assert.equal(false, aSorter[0].bDescending, "Checking if the order of the sorter applied is same as the one passed in Initial Sorter");
	});
	QUnit.test("InboxInitialSorterOnPropertywhichisnotaDefaultColumn_IndicatedOnUI", 2, function(assert) {
		var oRowRepeaterSortCombobox = inx1._getComponent('sortByFilterComboBox');
		var sRRSelectedItemID = oRowRepeaterSortCombobox.getSelectedItemId();
		assert.equal(true, (sRRSelectedItemID === 'inbox1--li_empty'), "Checking if the sort value selected in the DropDown is right");
		var oSortImage = sap.ui.getCore().byId("inbox1--sortImage");
		assert.equal(false, (oSortImage.getVisible()), "Checking if the sort image is not displayed");
	});
	QUnit.test("ChangeSorterinDD_Status", 6, function(assert) {
		var oRowRepeaterSortCombobox = inx1._getComponent('sortByFilterComboBox');
		var sRRSelectedItemID = oRowRepeaterSortCombobox.getSelectedItemId();
		oRowRepeaterSortCombobox.setSelectedItemId('inbox1--li_status');
		var selItem = inx1._getComponent('li_status');
		oRowRepeaterSortCombobox.fireChange({selectedItem:selItem});
		var oBinding = sap.ui.getCore().byId("inbox1--tasksRowRepeater").getBinding('rows');
		var aSorter = oBinding.aSorters;
		assert.equal(false, (aSorter === undefined), "Checking if the Inbox Control has applied sorter on the Row Repeater View");
		assert.equal(true, (aSorter[0].sPath === "Status"), "Checking if the path of the sorter applied is same as the one passed in Initial Sorter");
		assert.equal(true, aSorter[0].bDescending, "Checking if the order of the sorter applied is correct");
		var oSortImage = sap.ui.getCore().byId("inbox1--sortImage");
		assert.equal(true, (oSortImage.getTooltip() === "Descending"), "Checking if the sorting image shows the right tooltip");
		assert.equal(true, (oSortImage.getIcon().indexOf('down') !== -1), "Checking if the sorting image shows the right image");
		assert.equal(true, (oSortImage.getVisible()), "Checking if the sorting image is visible");
	});
	QUnit.test("ChangeSorterinDD_TaskTitle", 6, function(assert) {
		var oRowRepeaterSortCombobox = inx1._getComponent('sortByFilterComboBox');
		var sRRSelectedItemID = oRowRepeaterSortCombobox.getSelectedItemId();
		oRowRepeaterSortCombobox.setSelectedItemId('inbox1--li_taskTitle');
		var selItem = inx1._getComponent('li_taskTitle');
		oRowRepeaterSortCombobox.fireChange({selectedItem:selItem});
		var oBinding = sap.ui.getCore().byId("inbox1--tasksRowRepeater").getBinding('rows');
		var aSorter = oBinding.aSorters;
		assert.equal(false, (aSorter === undefined), "Checking if the Inbox Control has applied sorter on the Row Repeater View");
		assert.equal(true, (aSorter[0].sPath === "TaskTitle"), "Checking if the path of the sorter applied is same as the one passed in Initial Sorter");
		assert.equal(false, aSorter[0].bDescending, "Checking if the order of the sorter applied is correct");
		var oSortImage = sap.ui.getCore().byId("inbox1--sortImage");
		assert.equal(true, (oSortImage.getTooltip() === "Ascending"), "Checking if the sorting image shows the right tooltip");
		assert.equal(true, (oSortImage.getIcon().indexOf('up') !== -1), "Checking if the sorting image shows the right image");
		assert.equal(true, (oSortImage.getVisible()), "Checking if the sorting image is visible");
	});
	QUnit.test("ChangeSorterinDD_CreatedOn", 6, function(assert) {
		var oRowRepeaterSortCombobox = inx1._getComponent('sortByFilterComboBox');
		var sRRSelectedItemID = oRowRepeaterSortCombobox.getSelectedItemId();
		oRowRepeaterSortCombobox.setSelectedItemId('inbox1--li_creationDate');
		var selItem = inx1._getComponent('li_creationDate');
		oRowRepeaterSortCombobox.fireChange({selectedItem:selItem});
		var oBinding = sap.ui.getCore().byId("inbox1--tasksRowRepeater").getBinding('rows');
		var aSorter = oBinding.aSorters;
		assert.equal(false, (aSorter === undefined), "Checking if the Inbox Control has applied sorter on the Row Repeater View");
		assert.equal(true, (aSorter[0].sPath === "CreatedOn"), "Checking if the path of the sorter applied is same as the one passed in Initial Sorter");
		assert.equal(false, aSorter[0].bDescending, "Checking if the order of the sorter applied is correct");
		var oSortImage = sap.ui.getCore().byId("inbox1--sortImage");
		assert.equal(true, (oSortImage.getTooltip() === "Ascending"), "Checking if the sorting image shows the right tooltip");
		assert.equal(true, (oSortImage.getIcon().indexOf('up') !== -1), "Checking if the sorting image shows the right image");
		assert.equal(true, (oSortImage.getVisible()), "Checking if the sorting image is visible");
	});
	QUnit.test("InboxInitialFilter-OnlyPrimaryFilter", function(assert) {
		var oFilterCriteria = new InboxFilters();
		var oPrimaryFilter = new InboxPrimaryFilters();
		oPrimaryFilter.setFilter(InboxPrimaryFilterEnum.COMPLETED);
		oFilterCriteria.setPrimaryFilter(oPrimaryFilter);
		inx1.bindTasks("/Tasks",oFilterCriteria,new Sorter("Category",false));

		var oPrimaryfilterCombobox = sap.ui.getCore().byId("inbox1--filterComboBox2");
		assert.equal("inbox1--li_completedTasks", oPrimaryfilterCombobox.getSelectedItemId(), "Checking if the right Initial filter is displayed in the dropdown");
		var oBinding = sap.ui.getCore().byId("inbox1--tasksRowRepeater").getBinding('rows');
		var oFilterApplied = oBinding.aApplicationFilters[0];
		assert.equal("Status",oFilterApplied.sPath , "Checking if the Inbox Control has the initial filter applied - Path");
		assert.equal("EQ",oFilterApplied.sOperator , "Checking if the Inbox Control has the initial filter applied - operator");
		assert.equal("COMPLETED",oFilterApplied.oValue1 , "Checking if the Inbox Control has the initial filter applied - Value");
	});

	QUnit.done(function() {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});
	//END API for Inbox
});