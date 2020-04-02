/*global QUnit */
sap.ui.define([
	"sap/uiext/inbox/Inbox"
], function(Inbox) {
	"use strict";

	var taskDescriptionData = {

		"TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fd40b6991f82611e29e0a0000006379d2_description',SAP__Origin='LOCALHOST_C73_00')":{
			"Description": "Sales Order Approval Description",
			"InstanceID": "bpm://bpm.sap.com/task-instance/d40b6991f82611e29e0a0000006379d2"},
		"TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F7c543985ef5911e2b32a0000006379d2',SAP__Origin='LOCALHOST_C73_00')": {
		CompletionDeadLine: "",
		CreatedBy: "",
		CreatedByName: "",
		CreatedOn: "Thu Jul 18 2013 08:53:59 GMT+0530 (India Standard Time)",
		Description: {
		"Description": "Sales Order Approval Description",
		"InstanceID": "bpm://bpm.sap.com/task-instance/d40b6991f82611e29e0a000006379d2"},
		ExpiryDate: "",
		HasAttachments: false,
		HasComments: false,
		HasPotentialOwners: false,
		InstanceID: "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F7c543985ef5911e2b32a0000006379d2",
		IsEscalated: false,
		IsSubstituted: false,
		LastChangedBy: "",
		LastChangedTime: "Thu Aug 01 2013 08:28:37 GMT+0530 (India Standard Time)",
		Priority: "MEDIUM",
		SAP__Origin: "LOCALHOST_C73_00",
		StartDeadline: "",
		Status: "READY",
		SubstitutedUser: "",
		SupportsClaim: true,
		SupportsComments: true,
		SupportsForward: true,
		SupportsRelease: true,
		TaskDefinitionID: "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F390b5f27f17a435ea6cebeedeeee7a53",
		TaskDefinitionName: "DefaultTask",
		TaskModelID: "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2F48ea291521b04a9093b811ddce23001742235cde",
		TaskTitle: "CreateMultipleTasks: Task 0"
		},
		"TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F7c543985ef5911e2b32a0000001234d2',SAP__Origin='LOCALHOST_C73_00')": {
			CompletionDeadLine: "",
			CreatedBy: "",
			CreatedByName: "",
			CreatedOn: "Thu Jul 18 2013 08:53:59 GMT+0530 (India Standard Time)",
			Description: {
			"Description": "Test Description",
			"InstanceID": "bpm://bpm.sap.com/task-instance/d40b6991f82611e29e0a000006379d2"},
			ExpiryDate: "",
			HasAttachments: false,
			HasComments: false,
			HasPotentialOwners: false,
			InstanceID: "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F7c543985ef5911e2b32a0000006379d2",
			IsEscalated: false,
			IsSubstituted: false,
			LastChangedBy: "",
			LastChangedTime: "Thu Aug 01 2013 08:28:37 GMT+0530 (India Standard Time)",
			Priority: "MEDIUM",
			SAP__Origin: "LOCALHOST_C73_00",
			StartDeadline: "",
			Status: "READY",
			SubstitutedUser: "",
			SupportsClaim: true,
			SupportsComments: true,
			SupportsForward: true,
			SupportsRelease: true,
			TaskDefinitionID: "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F390b5f27f17a435ea6cebeedeeee7a53",
			TaskDefinitionName: "DefaultTask",
			TaskModelID: "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2F48ea291521b04a9093b811ddce23001742235cde",
			TaskTitle: "CreateMultipleTasks: Task 0"
		}
	};

	var taskDefinitionData = {
		"TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fd40b6991f82611e29e0a0000006379d2_description',SAP__Origin='LOCALHOST_C73_00')":{
		"TaskDefinitionData": "Sample Task Definition",
		"InstanceID": "bpm://bpm.sap.com/task-instance/d40b6991f82611e29e0a0000006379d2"},
		"TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F7c543985ef5911e2b32a0000001234d2',SAP__Origin='LOCALHOST_C73_00')": {
			CompletionDeadLine: "",
			CreatedBy: "",
			CreatedByName: "",
			CreatedOn: "Thu Jul 18 2013 08:53:59 GMT+0530 (India Standard Time)",
			TaskDefinitionData: {
			"TaskDefinitionData": "Test Task Definition",
			"InstanceID": "bpm://bpm.sap.com/task-instance/d40b6991f82611e29e0a000006379d2"},
			ExpiryDate: "",
			HasAttachments: false,
			HasComments: false,
			HasPotentialOwners: false,
			InstanceID: "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F7c543985ef5911e2b32a0000006379d2",
			IsEscalated: false,
			IsSubstituted: false,
			LastChangedBy: "",
			LastChangedTime: "Thu Aug 01 2013 08:28:37 GMT+0530 (India Standard Time)",
			Priority: "MEDIUM",
			SAP__Origin: "LOCALHOST_C73_00",
			StartDeadline: "",
			Status: "READY",
			SubstitutedUser: "",
			SupportsClaim: true,
			SupportsComments: true,
			SupportsForward: true,
			SupportsRelease: true,
			TaskDefinitionID: "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F390b5f27f17a435ea6cebeedeeee7a53",
			TaskDefinitionName: "DefaultTask",
			TaskModelID: "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2F48ea291521b04a9093b811ddce23001742235cde",
			TaskTitle: "CreateMultipleTasks: Task 0"
		},
		"TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F7c543985ef5911e2b32a00000012345d2',SAP__Origin='LOCALHOST_C73_00')": {
			CompletionDeadLine: "",
			CreatedBy: "",
			CreatedByName: "",
			CreatedOn: "Thu Jul 18 2013 08:53:59 GMT+0530 (India Standard Time)",
			TaskDefinitionData: {
			"TaskDefinitionData": "Another Test Task Definition",
			"InstanceID": "bpm://bpm.sap.com/task-instance/d40b6991f82611e29e0a000006379d2"},
			ExpiryDate: "",
			HasAttachments: false,
			HasComments: false,
			HasPotentialOwners: false,
			InstanceID: "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F7c543985ef5911e2b32a0000006379d2",
			IsEscalated: false,
			IsSubstituted: false,
			LastChangedBy: "",
			LastChangedTime: "Thu Aug 01 2013 08:28:37 GMT+0530 (India Standard Time)",
			Priority: "MEDIUM",
			SAP__Origin: "LOCALHOST_C73_00",
			StartDeadline: "",
			Status: "READY",
			SubstitutedUser: "",
			SupportsClaim: true,
			SupportsComments: true,
			SupportsForward: true,
			SupportsRelease: true,
			TaskDefinitionID: "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F390b5f27f17a435ea6cebeedeeee7a53",
			TaskDefinitionName: "DefaultTask",
			TaskModelID: "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2F48ea291521b04a9093b811ddce23001742235cde",
			TaskTitle: "CreateMultipleTasks: Task 0"
		}
	};

	var oNavigationObject_Value_Present = {
		__ref: "TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fd40b6991f82611e29e0a0000006379d2_description',SAP__Origin='LOCALHOST_C73_00')"
	};
	var oNavigationObject_Value_Not_Present = {
		__ref: "TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fd40b6991f82611e29e0a000006379d2_description',SAP__Origin='LOCALHOST_C73_00')"
	};
	var oNavigationArray_Value_Present = {
		__list: ["TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fd40b6991f82611e29e0a0000006379d2_description',SAP__Origin='LOCALHOST_C73_00')"]
	};
	var oNavigationArray_Value_Not_Present = {
		__list: ["TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fd40b6991f82611e29e0a000006379d2_description',SAP__Origin='LOCALHOST_C73_00')"]
	};

	QUnit.module("TaskDescription and TaskDefinition Tests");

	var oInbox = new Inbox("TaskDescTestInbox1");
		oInbox.setHandleBindings(false);

	QUnit.test("TaskDescription Object Value Present", function(assert) {
		var valuePresent = oInbox._getValuePresent(taskDescriptionData,oNavigationObject_Value_Present,"Description","desc");
		assert.equal(valuePresent,true);
	});

	QUnit.test("TaskDescription Object Value Not Present", function(assert) {
		var valuePresent = oInbox._getValuePresent(taskDescriptionData,oNavigationObject_Value_Not_Present,"Description","desc");
		assert.equal(valuePresent,false);
	});

	QUnit.test("TaskDefinition Object Value Present", function(assert) {
		var valuePresent = oInbox._getValuePresent(taskDefinitionData,oNavigationObject_Value_Present,"TaskDefinitionData","Sample");
		assert.equal(valuePresent,true);
	});
	
	QUnit.test("TaskDefinition Object Value Not Present", function(assert) {
		var valuePresent = oInbox._getValuePresent(taskDefinitionData,oNavigationObject_Value_Not_Present,"TaskDefinitionData","Sample");
		assert.equal(valuePresent,false);
	});

	QUnit.test("TaskDescription Array Value Present", function(assert) {
		var valuePresent = oInbox._getValuePresent(taskDescriptionData,oNavigationArray_Value_Present,"Description","desc");
		assert.equal(valuePresent,true);
	});

	QUnit.test("TaskDescription Array Value Not Present", function(assert) {
		var valuePresent = oInbox._getValuePresent(taskDescriptionData,oNavigationArray_Value_Not_Present,"Description","desc");
		assert.equal(valuePresent,false);
	});

	QUnit.test("TaskDefinition Array Value Present", function(assert) {
		var valuePresent = oInbox._getValuePresent(taskDefinitionData,oNavigationArray_Value_Present,"TaskDefinitionData","Sample");
		assert.equal(valuePresent,true);
	});

	QUnit.test("TaskDefinition Array Value Not Present", function(assert) {
		var valuePresent = oInbox._getValuePresent(taskDefinitionData,oNavigationArray_Value_Not_Present,"TaskDefinitionData","Sample");
		assert.equal(valuePresent,false);
	});

});
