/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/uiext/inbox/Inbox",
	"sap/ui/model/json/JSONModel",
	"sap/uiext/inbox/TaskInitialFilters"
], function(createAndAppendDiv, Inbox, JSONModel, TaskInitialFilters) {
	"use strict";


	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");



	//Test Data
	var jsonData = {
		"Tasks" : [
		{
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/772e')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/772ea","TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea1", "Category" : "TASK", "TaskDefinitionName" : "LeaveReq", "TaskTitle" : "LeaveReq", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335439338973)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412125)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ca')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/c03ca","TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea2", "Category" : "TASK", "TaskDefinitionName" : "Sales Order Approval", "TaskTitle" : "Sales Order Approval Task - 1234", "Status" : "IN_PROGRESS", "Priority" : "VERY_HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556977)\/", "StartDeadline" : "\/Date(1335436957423)\/", "CompletionDeadline" : "\/Date(1335696157427)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412125)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c03ba')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/c034a", "TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea3","Category" : "TASK", "TaskDefinitionName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350556907)\/", "StartDeadline" : "\/Date(1335523357193)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/c071a')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/c07a", "TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea4","Category" : "TASK", "TaskDefinitionName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "RESERVED", "Priority" : "MEDIUM", "Requestor" : "", "CreatedOn" : "\/Date(1335350556410)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041756660)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be68a')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/be6a","TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea5", "Category" : "TASK", "TaskDefinitionName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form - Laptops", "Status" : "RESERVED", "Priority" : "HIGH", "Requestor" : "", "CreatedOn" : "\/Date(1335350554667)\/", "StartDeadline" : "\/Date(1335523354833)\/", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be4aa')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/be4aa", "TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea6","Category" : "TASK", "TaskDefinitionName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request for iPAD", "Status" : "RESERVED", "Priority" : "LOW", "Requestor" : "", "CreatedOn" : "\/Date(1335350554133)\/", "StartDeadline" : "", "CompletionDeadline" : "\/Date(1336041754297)\/", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}, {
		"__metadata" : {
		"uri" : "/sap.com~odata~web/BPMTasks.svc/Tasks('bpm://bpm.sap.com/task-instance/be28a')", "type" : "Inbox.Tasks"
		}, "ID" : "bpm://bpm.sap.com/task-instance/be2a5", "TaskDefinitionID" : "bpm://bpm.sap.com/task-instance/772ea7","Category" : "TASK", "TaskDefinitionName" : "Some Dummy Task", "TaskTitle" : "Some Dummy Task for you", "Status" : "READY", "Priority" : "LOW", "Requestor" : "", "CreatedOn" : "\/Date(1335350553633)\/", "StartDeadline" : "", "CompletionDeadline" : "", "TechnicalStatus" : "", "TechnicalPriority" : "", "LastChangedTime" : "\/Date(1339421412126)\/", "LastChangedBy" : "", "IsEscalated" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "TaskexecutionUrl" : ""
		}
		], "__count" : "7"
		};

	QUnit.module("Task Initial Filters Test");
	var filterTestInbox = new Inbox("initialFilterTestInbox");
	filterTestInbox.setHandleBindings(false);
	var oModel = new JSONModel();
	oModel.setData(jsonData);
	filterTestInbox.setModel(oModel);

	var aStatusFilters = ["READY","RESERVED","IN_PROGRESS"];
	var aPriorityFilters = ["LOW","HIGH","VERY_HIGH","MEDIUM"];
	var sDateTimeFilter = "Today";
	var aTaskTypeFilters = [{"key":"taskDef1","value":"TASK DEF 1"},{"key":"taskDef2","value":"TASK DEF 2"},{"key":"taskDef3","value":"TASK DEF 3"}];
	var sDueDateTimeFilter = "Next_7_days";
	var taskFilter = new TaskInitialFilters(aStatusFilters,aPriorityFilters,sDateTimeFilter,null,sDueDateTimeFilter);
	filterTestInbox.bindTaskTable("/Tasks",taskFilter);
	filterTestInbox.refreshTaskTypes();

	QUnit.test("testInitialFilterConstructor", function(assert) {
		assert.equal(aStatusFilters.length, taskFilter.aStatusFilters.length, "Checking if status initial property is set right");
		assert.equal(aPriorityFilters.length, taskFilter.aPriorityFilters.length, "Checking if priority initial property is set right");
		assert.equal("Today", taskFilter.sDateTimeFilter, "Checking if start date time initial property is set right");
		assert.equal("Next_7_days", taskFilter.sDueDateTimeFilter, "Checking if due date time initial property is set right");
	});


	QUnit.test("testGetFiltersToBeAppliedScenario1", function(assert) {
		var filterToBeApplied = taskFilter.getFilterObjects();
		var filterMap = taskFilter.getFilterObjects().filterOperatorMap;
		var iStatusFiltersLength = filterMap.Status.length;
		var iPrioFiltersLength = filterMap.Priority.length;
		var iDueDateFiltersLength = filterMap.DueDate ? 1 : 0;
		var iStartDateFiltersLength = filterMap.CreatedDate ? 1 : 0;
		assert.equal(3, iStatusFiltersLength, "Checking if getFiltersObjects returns the right set of Status Filters to be applied");
		assert.equal(4, iPrioFiltersLength, "Checking if getFiltersObjects returns the right set of Priority Filters to be applied");
		assert.equal(1, iDueDateFiltersLength, "Checking if getFiltersObjects returns the right set of DueDate Filters to be applied");
		assert.equal(1, iStartDateFiltersLength, "Checking if getFiltersObjects returns the right set of StartDate Filters to be applied");
		assert.equal(9, iStatusFiltersLength + iPrioFiltersLength + iDueDateFiltersLength + iStartDateFiltersLength, "Checking if getFiltersToBeApplied returns the right set of Filters to be applied for DateTime = Today and DueDateTime = Next 7 days.");
	});

	QUnit.test("testGetFiltersToBeAppliedScenario2", function(assert) {
		var aPriorityFilters = ["LOW"];
		var sDateTimeFilter = "Last_7_days";
		var sDueDateTimeFilter = "Today";
		var taskFilter = new TaskInitialFilters(null,aPriorityFilters,sDateTimeFilter,null,sDueDateTimeFilter);
		filterTestInbox.bindTaskTable("/Tasks",taskFilter);
		filterTestInbox.refreshTaskTypes();
		var filterToBeApplied = taskFilter.getFilterObjects();
		var filterMap = taskFilter.getFilterObjects().filterOperatorMap;
		var iStatusFiltersLength = filterMap.Status.length;
		var iPrioFiltersLength = filterMap.Priority.length;
		var iDueDateFiltersLength = filterMap.DueDate ? 1 : 0;
		var iStartDateFiltersLength = filterMap.CreatedDate ? 1 : 0;
		assert.equal(0, iStatusFiltersLength, "Checking if getFiltersObjects returns the right set of Status Filters to be applied");
		assert.equal(1, iPrioFiltersLength, "Checking if getFiltersObjects returns the right set of Priority Filters to be applied");
		assert.equal(1, iDueDateFiltersLength, "Checking if getFiltersObjects returns the right set of DueDate Filters to be applied");
		assert.equal(1, iStartDateFiltersLength, "Checking if getFiltersObjects returns the right set of StartDate Filters to be applied");
		assert.equal(3, iStatusFiltersLength + iPrioFiltersLength + iDueDateFiltersLength + iStartDateFiltersLength, "Checking if getFiltersToBeApplied returns the right set of Filters to be applied for DateTime = Last 7 days and DueDateTime = Today.");
	});

	QUnit.test("testGetFiltersToBeAppliedScenarioNullValueFilters", function(assert) {
		var taskFilter = new TaskInitialFilters(null,null,null,null,null);
		filterTestInbox.bindTaskTable("/Tasks",taskFilter);
		filterTestInbox.refreshTaskTypes();
		var filterToBeApplied = taskFilter.getFilterObjects();
		var filterMap = taskFilter.getFilterObjects().filterOperatorMap;
		/* var iStatusFiltersLength = filterMap.Status.length;
		var iPrioFiltersLength = filterMap.Priority.length;
		var iDueDateFiltersLength = filterMap.DueDate? 1 : 0;
		var iStartDateFiltersLength = filterMap.CreatedDate? 1 : 0;
		assert.equal(0, iStatusFiltersLength, "Checking if getFiltersObjects returns the right set of Status Filters to be applied");
		assert.equal(0, iPrioFiltersLength, "Checking if getFiltersObjects returns the right set of Priority Filters to be applied");
		assert.equal(0, iDueDateFiltersLength, "Checking if getFiltersObjects returns the right set of DueDate Filters to be applied");
		assert.equal(0, iStartDateFiltersLength, "Checking if getFiltersObjects returns the right set of StartDate Filters to be applied"); */
		assert.equal(true, filterMap === undefined, "Checking if getFiltersToBeApplied returns zero Filters to be applied for not setting any initial filter.");
	});


	QUnit.test("testGetFiltersToBeAppliedScenario3", function(assert) {
		var sDateTimeFilter = "Last_15_days";
		var sDueDateTimeFilter = "Next_15_days";
		var taskFilter = new TaskInitialFilters(null,null,sDateTimeFilter,null,sDueDateTimeFilter);
		filterTestInbox.bindTaskTable("/Tasks",taskFilter);
		filterTestInbox.refreshTaskTypes();
		var filterToBeApplied = taskFilter.getFilterObjects();
		var filterMap = taskFilter.getFilterObjects().filterOperatorMap;
		var iStatusFiltersLength = filterMap.Status.length;
		var iPrioFiltersLength = filterMap.Priority.length;
		var iDueDateFiltersLength = filterMap.DueDate ? 1 : 0;
		var iStartDateFiltersLength = filterMap.CreatedDate ? 1 : 0;
		assert.equal(0, iStatusFiltersLength, "Checking if getFiltersObjects returns the right set of Status Filters to be applied");
		assert.equal(0, iPrioFiltersLength, "Checking if getFiltersObjects returns the right set of Priority Filters to be applied");
		assert.equal(1, iDueDateFiltersLength, "Checking if getFiltersObjects returns the right set of DueDate Filters to be applied");
		assert.equal(1, iStartDateFiltersLength, "Checking if getFiltersObjects returns the right set of StartDate Filters to be applied");
		assert.equal(2, iStatusFiltersLength + iPrioFiltersLength + iDueDateFiltersLength + iStartDateFiltersLength, "Checking if getFiltersToBeApplied returns the right set of Filters to be applied for DateTime = Last 15 days and DueDateTime = Next 15 Days .");
	});

	QUnit.test("testGetFiltersToBeAppliedScenario4", function(assert) {
		var sDateTimeFilter = "Last_30_days";
		var sDueDateTimeFilter = "Next_30_days";
		var taskFilter = new TaskInitialFilters(null,null,sDateTimeFilter,null,sDueDateTimeFilter);
		filterTestInbox.bindTaskTable("/Tasks",taskFilter);
		filterTestInbox.refreshTaskTypes();
		var filterToBeApplied = taskFilter.getFilterObjects();
		var filterMap = taskFilter.getFilterObjects().filterOperatorMap;
		var iStatusFiltersLength = filterMap.Status.length;
		var iPrioFiltersLength = filterMap.Priority.length;
		var iDueDateFiltersLength = filterMap.DueDate ? 1 : 0;
		var iStartDateFiltersLength = filterMap.CreatedDate ? 1 : 0;
		assert.equal(0, iStatusFiltersLength, "Checking if getFiltersObjects returns the right set of Status Filters to be applied");
		assert.equal(0, iPrioFiltersLength, "Checking if getFiltersObjects returns the right set of Priority Filters to be applied");
		assert.equal(1, iDueDateFiltersLength, "Checking if getFiltersObjects returns the right set of DueDate Filters to be applied");
		assert.equal(1, iStartDateFiltersLength, "Checking if getFiltersObjects returns the right set of StartDate Filters to be applied");
		assert.equal(2, iStatusFiltersLength + iPrioFiltersLength + iDueDateFiltersLength + iStartDateFiltersLength, "Checking if getFiltersToBeApplied returns the right set of Filters to be applied for DateTime = Last 30 days and DueDateTime = Next 30 days.");
	});
});