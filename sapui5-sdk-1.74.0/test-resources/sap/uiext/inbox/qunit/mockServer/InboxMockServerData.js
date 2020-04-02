sap.ui.define([], function() {
	"use strict";

	var InboxMockServerData = function(){
	};

	InboxMockServerData.rootURLData = {
		"d" : {
			"EntitySets" : [
				"TaskCollection", "SubstitutionRuleCollection","SubstitutesRuleCollection", "CustomAttributeDefinitionCollection", "FilterOptionCollection", "TaskDescriptionCollection", "UIExecutionCollection", "CustomAttributeCollection", "TaskDefinitionCollection", "UserInfoCollection", "SubstitutedUsersCollection", "ObjectLinkExecutionCollection", "CommentsCollection"
			]
		}
	};

	InboxMockServerData.metadata = function(){
			var metadata;
			var fileURL = "test-resources/sap/uiext/inbox/qunit/mockServer/metadata.xml";
			jQuery.ajax(fileURL, {
							dataType: 'text',
							async: false,	
							success: function (data) { metadata = data;	},
							error: function (data){alert("Error Loading Metadata");}	
							});
			return metadata;
	};

	InboxMockServerData.filterReadyStatusData = 	{
			"d" : {
			"results" : [
		{
		"__metadata" : {
		"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
		}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe05ce2fc4376e09cd9ae11e2c3d90050569e29e4", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F929158ed24d31c4f04ead08847fa55a3", "TaskDefinitionName" : "Leave Request Approval", "TaskTitle" : "Leave Request Approval for Check and Anyone", "Priority" : "MEDIUM", "Status" : "READY", "CreatedOn" : "\/Date(1371813206707)\/", "StartDeadline" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1371910544940)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : true, "SupportsForward" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "SupportsComments" : true, "TaskDefinitionData" : {


		"__metadata" : {
		"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F929158ed24d31c4f04ead08847fa55a3')", "type" : "TASKPROCESSING.Task"
		}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe05ce2fc4376e09cd9ae11e2c3d90050569e29e4", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/929158ed24d31c4f04ead08847fa55a3", "TaskName" : "Leave Request Approval", "Category" : "TASK"
		}
		}
			], "__count" : "1"
			}
			};

	InboxMockServerData.filterCreationDateData = 	{
			"d" : {
			"results" : [
		{
		"__metadata" : {
		"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
		}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe05ce2fc4376e09cd9ae11e2c3d90050569e29e4", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F929158ed24d31c4f04ead08847fa55a3", "TaskDefinitionName" : "Leave Request Approval", "TaskTitle" : "Task for Creation Date", "Priority" : "LOW", "Status" : "READY", "CreatedOn" : "\/Date(1372813206707)\/", "StartDeadline" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1371910544940)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : true, "SupportsForward" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "SupportsComments" : true, "TaskDefinitionData" : {


		"__metadata" : {
		"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F929158ed24d31c4f04ead08847fa55a3')", "type" : "TASKPROCESSING.Task"
		}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe05ce2fc4376e09cd9ae11e2c3d90050569e29e4", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/929158ed24d31c4f04ead08847fa55a3", "TaskName" : "Leave Request Approval", "Category" : "TASK"
		}
		}
			], "__count" : "1"
			}
			};

	InboxMockServerData.filterDueDateData = 	{
			"d" : {
			"results" : [
		{
		"__metadata" : {
		"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
		}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe05ce2fc4376e09cd9ae11e2c3d90050569e29e4", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F929158ed24d31c4f04ead08847fa55a3", "TaskDefinitionName" : "Leave Request Approval", "TaskTitle" : "Task for Due Date", "Priority" : "MEDIUM", "Status" : "READY", "CreatedOn" : "\/Date(1372813206707)\/", "StartDeadline" : "", "CompletionDeadLine" : "\/Date(1382813206707)\/", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1371910544940)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : true, "SupportsForward" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "SupportsComments" : true, "TaskDefinitionData" : {


		"__metadata" : {
		"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F929158ed24d31c4f04ead08847fa55a3')", "type" : "TASKPROCESSING.Task"
		}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe05ce2fc4376e09cd9ae11e2c3d90050569e29e4", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/929158ed24d31c4f04ead08847fa55a3", "TaskName" : "Leave Request Approval", "Category" : "TASK"
		}
		}
			], "__count" : "1"
			}
			};


	InboxMockServerData.filterCompletedStatusData = 	{
		"d" : {
	"results" : [
	{
	"__metadata" : {
	"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F518e2b06fe7611e2c9330000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
	}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F518e2b06fe7611e2c9330000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0692", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2Febd360378fde96cbb322fa9b05d359b1", "TaskDefinitionName" : "Review and Approve article", "TaskTitle" : "Review and Approve article", "Priority" : "MEDIUM", "Status" : "COMPLETED", "CreatedOn" : "\/Date(1375779490247)\/", "CreatedBy" : "", "CreatedByName" : "", "StartDeadLine" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1385998419137)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : false, "SupportsRelease" : false, "SupportsForward" : false, "SupportsComments" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {
	"__metadata" : {
	"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2Febd360378fde96cbb322fa9b05d359b1')", "type" : "TASKPROCESSING.Task"
	}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0692", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/ebd360378fde96cbb322fa9b05d359b1", "TaskName" : "Review and Approve article", "Category" : "TASK"
	}
	}
	], "__count" : "1"
		}
		};


	InboxMockServerData.initialLoadData = 	{
			"d" : {
			"results" : [
			{
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe05ce2fc4376e09cd9ae11e2c3d90050569e29e4", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F929158ed24d31c4f04ead08847fa55a3", "TaskDefinitionName" : "Leave Request Approval", "TaskTitle" : "Leave Request Approval for Check and Anyone", "Priority" : "MEDIUM", "Status" : "READY", "CreatedOn" : "\/Date(1371813206707)\/", "StartDeadline" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1371910544940)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "SupportsComments" : true, "TaskDefinitionData" : {


			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F929158ed24d31c4f04ead08847fa55a3')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe05ce2fc4376e09cd9ae11e2c3d90050569e29e4", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/929158ed24d31c4f04ead08847fa55a3", "TaskName" : "Leave Request Approval", "Category" : "TASK"
			},  "Description" : {
				"__metadata" : {
					"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskDescriptionCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F72a0df05c9f111e3ac280000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.TaskDescription"
					}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F72a0df05c9f111e3ac280000006379d2", "Description" : "<h2>Purchase Order for the following items</h2><ul><li>Purchase 20 laptops</li><li>Purchase 50 desk phones</li></ul>"
					}
			},  {
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8c24fde4da4311e2ad120000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8c24fde4da4311e2ad120000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe0a19489ee1247c2b14111e1c23a005056aa00d1", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F2e266c6fe961e9bb83d2cae50a685faf", "TaskDefinitionName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form", "Priority" : "HIGH", "Status" : "READY", "CreatedOn" : "\/Date(1371799442377)\/", "StartDeadline" : "", "CompletionDeadLine" : "\/Date(1369207442320)\/", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1371910544940)\/", "LastChangedBy" : "", "IsEscalated" : true, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {

			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F2e266c6fe961e9bb83d2cae50a685faf')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe0a19489ee1247c2b14111e1c23a005056aa00d1", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/2e266c6fe961e9bb83d2cae50a685faf", "TaskName" : "Purchase Order Form", "Category" : "Todo"
			} , "Description" : {
				"__metadata" : {
					"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskDescriptionCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F72988a05c9f111e3af080000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.TaskDescription"
					}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F72988a05c9f111e3af080000006379d2", "Description" : "Please approve the purchase order of all the items only if the credit limit is less than 10000 euros"
					}
			}, {
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8bb84073da4311e2cddb0000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8bb84073da4311e2cddb0000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe0faf6e82eece80fb14811e1a5a5005056aa00d1", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2Fd4938239d7d58e01267c256329fa6c7e", "TaskDefinitionName" : "Sales Order Approval", "TaskTitle" : "Sales Order Approval", "Priority" : "VERY_HIGH", "Status" : "READY", "CreatedOn" : "\/Date(1371799441677)\/", "StartDeadline" : "", "CompletionDeadLine" : "\/Date(1371713041600)\/", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1371910544940)\/", "LastChangedBy" : "", "IsEscalated" : true, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {

			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2Fd4938239d7d58e01267c256329fa6c7e')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe0faf6e82eece80fb14811e1a5a5005056aa00d1", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/d4938239d7d58e01267c256329fa6c7e", "TaskName" : "Sales Order Approval", "Category" : "Alert"
			}
			},{
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8a90f79cda4311e28e010000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8a90f79cda4311e28e010000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe0f44551a7cce7a7b14811e1b644005056aa00d1", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F64d598f190c11e426f6fa0406459b52c", "TaskDefinitionName" : "Some Dummy Task", "TaskTitle" : "Some Dummy Task", "Priority" : "LOW", "Status" : "READY", "CreatedOn" : "\/Date(1371799439927)\/", "StartDeadline" : "", "CompletionDeadLine" : "\/Date(1372231439607)\/", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1371910544940)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {
				
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F64d598f190c11e426f6fa0406459b52c')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe0f44551a7cce7a7b14811e1b644005056aa00d1", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/64d598f190c11e426f6fa0406459b52c", "TaskName" : "Some Dummy Task", "Category" : "Notification"
			}
			}, {
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8b4e35d5da4311e2aca00000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8b4e35d5da4311e2aca00000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe098f47c713a0433b14711e1ac92005056aa00d1", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2Fa5257bd14f1fb45328782518b9687609", "TaskDefinitionName" : "Raise Purchase Request", "TaskTitle" : "Raise Purchase Request", "Priority" : "MEDIUM", "Status" : "READY", "CreatedOn" : "\/Date(1371799441030)\/", "StartDeadline" : "", "CompletionDeadLine" : "\/Date(1371799440900)\/", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1371910544940)\/", "LastChangedBy" : "", "IsEscalated" : true, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {

			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2Fa5257bd14f1fb45328782518b9687609')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe098f47c713a0433b14711e1ac92005056aa00d1", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/a5257bd14f1fb45328782518b9687609", "TaskName" : "Raise Purchase Request", "Category" : "XYZ"
			}
			},{
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Ff07842c4358911e389b60000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Ff07842c4358911e389b60000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0692", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskDefinitionName" : "Review and Approve article", "TaskTitle" : "Review and Approve article", "Priority" : "MEDIUM", "Status" : "READY", "CreatedOn" : "\/Date(1381835231250)\/", "CreatedBy" : "", "CreatedByName" : "", "StartDeadLine" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1381897442616)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "SupportsComments" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0692", "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskName" : "Review and Approve article", "Category" : "TASK"
			}
			}, {
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fde024b1b358911e39b450000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fde024b1b358911e39b450000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0692", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskDefinitionName" : "Review and Approve article", "TaskTitle" : "Review and Approve article", "Priority" : "MEDIUM", "Status" : "READY", "CreatedOn" : "\/Date(1381835200277)\/", "CreatedBy" : "", "CreatedByName" : "", "StartDeadLine" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1381897442616)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "SupportsComments" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0692", "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskName" : "Review and Approve article", "Category" : "TASK"
			}
			},{
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0690", "TaskDefinitionName" : "Review and Approve article", "TaskTitle" : "Review and Approve article", "Priority" : "MEDIUM", "Status" : "READY", "CreatedOn" : "\/Date(1382002645153)\/", "CreatedBy" : "", "CreatedByName" : "", "StartDeadLine" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1382002655329)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "SupportsComments" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0690')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0690", "TaskName" : "Review and Approve article", "Category" : "TASK"
			}
			}
			], "__count" : "8"
			}
			};

	InboxMockServerData.todoData = 	{
			"d" : {
			"results" : [
			{
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8c24fde4da4311e2ad120000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8c24fde4da4311e2ad120000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe0a19489ee1247c2b14111e1c23a005056aa00d1", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F2e266c6fe961e9bb83d2cae50a685faf", "TaskDefinitionName" : "Purchase Order Form", "TaskTitle" : "Purchase Order Form", "Priority" : "HIGH", "Status" : "READY", "CreatedOn" : "\/Date(1371799442377)\/", "StartDeadline" : "", "CompletionDeadLine" : "\/Date(1369207442320)\/", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1371910544940)\/", "LastChangedBy" : "", "IsEscalated" : true, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {

			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F2e266c6fe961e9bb83d2cae50a685faf')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe0a19489ee1247c2b14111e1c23a005056aa00d1", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/2e266c6fe961e9bb83d2cae50a685faf", "TaskName" : "Purchase Order Form", "Category" : "Todo"
			}
			}
			], "__count" : "1"
			}
			};

	InboxMockServerData.taskData = 	{
			"d" : {
			"results" : [
			{
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe05ce2fc4376e09cd9ae11e2c3d90050569e29e4", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F929158ed24d31c4f04ead08847fa55a3", "TaskDefinitionName" : "Leave Request Approval", "TaskTitle" : "Leave Request Approval for Check and Anyone", "Priority" : "MEDIUM", "Status" : "READY", "CreatedOn" : "\/Date(1371813206707)\/", "StartDeadline" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1371910544940)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "SupportsComments" : true, "TaskDefinitionData" : {


			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F929158ed24d31c4f04ead08847fa55a3')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe05ce2fc4376e09cd9ae11e2c3d90050569e29e4", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/929158ed24d31c4f04ead08847fa55a3", "TaskName" : "Leave Request Approval", "Category" : "TASK"
			}
			},{
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Ff07842c4358911e389b60000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Ff07842c4358911e389b60000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0692", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskDefinitionName" : "Review and Approve article", "TaskTitle" : "Review and Approve article", "Priority" : "MEDIUM", "Status" : "READY", "CreatedOn" : "\/Date(1381835231250)\/", "CreatedBy" : "", "CreatedByName" : "", "StartDeadLine" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1381897442616)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "SupportsComments" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0692", "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskName" : "Review and Approve article", "Category" : "TASK"
			}
			}, {
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fde024b1b358911e39b450000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fde024b1b358911e39b450000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0692", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskDefinitionName" : "Review and Approve article", "TaskTitle" : "Review and Approve article", "Priority" : "MEDIUM", "Status" : "READY", "CreatedOn" : "\/Date(1381835200277)\/", "CreatedBy" : "", "CreatedByName" : "", "StartDeadLine" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1381897442616)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "SupportsComments" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0692", "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskName" : "Review and Approve article", "Category" : "TASK"
			}
			},{
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0690", "TaskDefinitionName" : "Review and Approve article", "TaskTitle" : "Review and Approve article", "Priority" : "MEDIUM", "Status" : "READY", "CreatedOn" : "\/Date(1382002645153)\/", "CreatedBy" : "", "CreatedByName" : "", "StartDeadLine" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1382002655329)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "SupportsComments" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0690')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0690", "TaskName" : "Review and Approve article", "Category" : "TASK"
			}
			}
			], "__count" : "4"
			}
			};

	InboxMockServerData.alertData = 	{
			"d" : {
			"results" : [
			{
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8bb84073da4311e2cddb0000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8bb84073da4311e2cddb0000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe0faf6e82eece80fb14811e1a5a5005056aa00d1", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2Fd4938239d7d58e01267c256329fa6c7e", "TaskDefinitionName" : "Sales Order Approval", "TaskTitle" : "Sales Order Approval", "Priority" : "VERY_HIGH", "Status" : "READY", "CreatedOn" : "\/Date(1371799441677)\/", "StartDeadline" : "", "CompletionDeadLine" : "\/Date(1371713041600)\/", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1371910544940)\/", "LastChangedBy" : "", "IsEscalated" : true, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {

			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2Fd4938239d7d58e01267c256329fa6c7e')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe0faf6e82eece80fb14811e1a5a5005056aa00d1", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/d4938239d7d58e01267c256329fa6c7e", "TaskName" : "Sales Order Approval", "Category" : "Alert"
			}
			}
			], "__count" : "1"
			}
			};

	InboxMockServerData.notificationData = 	{
			"d" : {
			"results" : [
			{
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8a90f79cda4311e28e010000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8a90f79cda4311e28e010000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe0f44551a7cce7a7b14811e1b644005056aa00d1", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F64d598f190c11e426f6fa0406459b52c", "TaskDefinitionName" : "Some Dummy Task", "TaskTitle" : "Some Dummy Task", "Priority" : "LOW", "Status" : "READY", "CreatedOn" : "\/Date(1371799439927)\/", "StartDeadline" : "", "CompletionDeadLine" : "\/Date(1372231439607)\/", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1371910544940)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : true, "SupportsRelease" : false, "SupportsForward" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : "", "TaskDefinitionData" : {
				
			"__metadata" : {
			"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-definition%2F64d598f190c11e426f6fa0406459b52c')", "type" : "TASKPROCESSING.Task"
			}, "SAP__Origin" : "LOCALHOST_C73_00", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe0f44551a7cce7a7b14811e1b644005056aa00d1", "TaskDefinitionID" : "bpm://bpm.sap.com/task-definition/64d598f190c11e426f6fa0406459b52c", "TaskName" : "Some Dummy Task", "Category" : "Notification"
			}
			}
			], "__count" : "1"
			}
			};


	InboxMockServerData.retrieveCommentsData = {
		"d" : {
		"results" : [
		{
		"__metadata" : {
		"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/CommentsCollection(ID='bpm%3A%2F%2Fbpm.sap.com%2Fnote%2F1e2da77513f0102535840000006379d2',InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Comment"
		}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2", "ID" : "bpm%3A%2F%2Fbpm.sap.com%2Fnote%2F1e2da77513f0102535840000006379d2", "CreatedAt" : "\/Date(1371821677347)\/", "CreatedByName" : "Kumar, Abhishek", "CreatedBy" : "USER.PRIVATE_DATASOURCE.un:Abhishek", "Text" : "Super idea"
		}
		]
		}
		};

	InboxMockServerData.addCommentData = {
			"d" : {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/CommentsCollection(ID='bpm%3A%2F%2Fbpm.sap.com%2Fnote%2F1e2de78405481d0f3ec90000006379d2',InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Comment"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2", "ID" : "bpm%3A%2F%2Fbpm.sap.com%2Fnote%2F1e2de78405481d0f3ec90000006379d2", "CreatedAt" : "\/Date(1372261883107)\/", "CreatedByName" : "Kumar, Abhishek", "CreatedBy" : "USER.PRIVATE_DATASOURCE.un:Abhishek", "Text" : "Okay done"
				}
				};

	InboxMockServerData.addLongCommentData = {
			"d" : {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/CommentsCollection(ID='bpm%3A%2F%2Fbpm.sap.com%2Fnote%2F1e2de78405481d0f3ec90000006379d2',InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Comment"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2", "ID" : "bpm%3A%2F%2Fbpm.sap.com%2Fnote%2F1e2de78405481d0f3ec90000006379d2", "CreatedAt" : "\/Date(1372261883107)\/", "CreatedByName" : "Kumar, Abhishek", "CreatedBy" : "USER.PRIVATE_DATASOURCE.un:Abhishek", "Text" : "Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negr"
				}
				};

	InboxMockServerData.searchUsersData = {
			"d" : {
				"results" : [
				{
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/UserInfoCollection(SAP__Origin='LOCALHOST_C73_00',UniqueName='admin')", "type" : "TASKPROCESSING.UserInfo"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "DisplayName" : "admin", "UniqueName" : "admin", "SubstitutedUsers" : "", "SearchPattern" : "", "FirstName" : "", "LastName" : "admin", "Email" : "", "WorkPhone" : "", "MobilePhone" : "", "HomePhone" : "", "mime_type" : ""
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/UserInfoCollection(SAP__Origin='LOCALHOST_C73_00',UniqueName='Administrator')", "type" : "TASKPROCESSING.UserInfo"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "DisplayName" : "Administrator", "UniqueName" : "Administrator", "SubstitutedUsers" : "", "SearchPattern" : "", "FirstName" : "", "LastName" : "Administrator", "Email" : "", "WorkPhone" : "", "MobilePhone" : "", "HomePhone" : "", "mime_type" : ""
				}
				]
				}
				};

	InboxMockServerData.retrieveObjectLinkData = {
			"d" : {
				"results" : [
							{
							"__metadata" : {
							"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/ObjectLinkExecutionCollection(SAP__Origin='LOCALHOST_C73_00',InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2',ObjectId='464F4C31382020202020202020202034204558543339303030303030303030383434')", "type" : "TASKPROCESSING.ObjectLinkExecution"
							}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2", "ObjectId" : "464F4C31382020202020202020202034204558543339303030303030303030383434", "ObjectType" : "", "ObjectLink" : "", "Label" : ""
							}, {
							"__metadata" : {
							"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/ObjectLinkExecutionCollection(SAP__Origin='GIQ_300_BWF',InstanceID='000001144658',ObjectId='464F4C31382020202020202020202034204558543339303030303030303030383434')", "type" : "TASKPROCESSING.ObjectLinkExecution"
							}, "SAP__Origin" : "GIQ_300_BWF", "InstanceID" : "000001144658", "ObjectId" : "464F4C31382020202020202020202034204558543339303030303030303030383434", "ObjectType" : "", "ObjectLink" : "", "Label" : ""
							}
							]
			}
	};

	InboxMockServerData.objectLinkDataOnFilter = {
			"d" : {
				"results" : [
							{
							"__metadata" : {
							"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/ObjectLinkExecutionCollection(SAP__Origin='LOCALHOST_C73_00',InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2',ObjectId='464F4C31382020202020202020202034204558543339303030303030303030383434')", "type" : "TASKPROCESSING.ObjectLinkExecution"
							}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2", "ObjectId" : "464F4C31382020202020202020202034204558543339303030303030303030383434", "ObjectType" : "Object", "ObjectLink" : "", "Label" : "Link for Object XYZ"
							},
							{
								"__metadata" : {
								"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/ObjectLinkExecutionCollection(SAP__Origin='LOCALHOST_C73_00',InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2',ObjectId='464F4C31382020202020202020202034204558543339303030303030303030')", "type" : "TASKPROCESSING.ObjectLinkExecution"
							}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2", "ObjectId" : "464F4C31382020202020202020202034204558543339303030303030303030", "ObjectType" : "Object", "ObjectLink" : "", "Label" : "Link for Object PQR"
							}, {
							"__metadata" : {
							"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/ObjectLinkExecutionCollection(SAP__Origin='LOCALHOST_C73_00',InstanceID='000001144659',ObjectId='464F4C31382020102020102020202034204558543339303030303030303030389999')", "type" : "TASKPROCESSING.ObjectLinkExecution"
							}, "SAP__Origin" : "LOCALHOST_C73_00", "InstanceID" : "00032823001144659", "ObjectId" : "464F4C31382020202020202020202034204558543339303030303030303030389999", "ObjectType" : "Object", "ObjectLink" : "", "Label" : "Link for Object ABC"
							}
							]
			}
	};

	InboxMockServerData.searchUsersDataOne = {
			"d" : {
				"results" : [
				{
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/UserInfoCollection(SAP__Origin='LOCALHOST_C73_00',UniqueName='TestUser')", "type" : "TASKPROCESSING.UserInfo"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "DisplayName" : "TestUser", "UniqueName" : "TestUser", "SubstitutedUsers" : "", "SearchPattern" : "", "FirstName" : "", "LastName" : "TestUser", "Email" : "", "WorkPhone" : "", "MobilePhone" : "", "HomePhone" : "", "mime_type" : ""
				}
				]
				}
				};

	InboxMockServerData.searchUsersDataNone = {
			"d" : {
				"results" : [
				]
				}
				};

	InboxMockServerData.myActiveSubtitutionRulesData = function (){
		
		var oToday = new Date();
		var presentDate = Date.UTC(oToday.getFullYear(), oToday.getMonth(), oToday.getDate(), 0, 0, 0, 0);
		var futureDate1 = presentDate + 888888888;
		var futureDate2 = presentDate + 9999999999;
		var pastDate = presentDate - 77777777777;
			
		var activeSubstitutionData = {
				
				"d" : {
					"results" : [
					{
						"__metadata" : {
							"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutionRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000516621')", "type" : "TASKPROCESSING.SubstitutionRule"
						}, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e00000056621", "EndDate" : "\/Date(" + futureDate1 + ")\/", "BeginDate" : "\/Date(" + presentDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u035985", "FullName" : "Manjusha Anand", "IsEnabled" : true, "SupportsEnableSubstitutionRule" : true, "SupportsDeleteSubstitutionRule": true, "Mode":"RECEIVE_TASKS"
					}, {
						"__metadata" : {
							"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutionRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510143')", "type" : "TASKPROCESSING.SubstitutionRule"
						}, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510143", "EndDate" : "\/Date(" + futureDate2 + ")\/", "BeginDate" : "\/Date(" + pastDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u047314", "FullName" : "Sharan Kumar Bojja", "IsEnabled" : true, "SupportsEnableSubstitutionRule" : false, "SupportsDeleteSubstitutionRule" :false, "Mode":"RECEIVE_TASKS"
					},{
						"__metadata" : {
							"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutionRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510003')", "type" : "TASKPROCESSING.SubstitutionRule"
						}, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510003", "EndDate" : "\/Date(" + futureDate2 + ")\/", "BeginDate" : "\/Date(" + presentDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u047312", "FullName" : "Madarapu Prashanth", "IsEnabled" : true, "SupportsEnableSubstitutionRule" : true, "SupportsDeleteSubstitutionRule" :false, "Mode":"RECEIVE_TASKS"
					}, {
						"__metadata" : {
							"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutionRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510001')", "type" : "TASKPROCESSING.SubstitutionRule"
						}, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510001", "EndDate" : "\/Date(" + futureDate2 + ")\/", "BeginDate" : "\/Date(" + presentDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u047007", "FullName" : "James Bond", "IsEnabled" : true, "SupportsEnableSubstitutionRule" : false, "SupportsDeleteSubstitutionRule" :true, "Mode":"TAKE_OVER"
					}
					], "__count" : "4"
				}
			};

	return activeSubstitutionData;
	};

	InboxMockServerData.myInActiveSubtitutionRulesData = function(){

	var oToday = new Date();
	var presentDate = Date.UTC(oToday.getFullYear(), oToday.getMonth(), oToday.getDate(), 0, 0, 0, 0);
	var futureDate = presentDate + 888888888;
	var pastDate = presentDate - 77777777777;

	var inActiveSubstitutionRule = {
			"d" : {
				"results" : [
							 {
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutionRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000416621')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000416621", "EndDate" : "\/Date(" + pastDate + ")\/", "BeginDate" : "\/Date(" + pastDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u0100001", "FullName" : "Ranbir Kapoor", "IsEnabled" : false, "SupportsEnableSubstitutionRule" : true, "SupportsDeleteSubstitutionRule": false, "Mode":"RECEIVE_TASKS"
							 }, {
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutionRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510144')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510144", "EndDate" : "\/Date(" + futureDate + ")\/", "BeginDate" : "\/Date(" + presentDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u0100002", "FullName" : "Karishma Kapoor", "IsEnabled" : false, "SupportsEnableSubstitutionRule" : false, "SupportsDeleteSubstitutionRule" :true, "Mode":"TAKE_OVER"
							 },{
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutionRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e1000000510013')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e1000000510013", "EndDate" : "\/Date(" + presentDate + ")\/", "BeginDate" : "\/Date(" + pastDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u0100003", "FullName" : "Sonam Kapoor", "IsEnabled" : false, "SupportsEnableSubstitutionRule" : true, "SupportsDeleteSubstitutionRule" :true, "Mode":"RECEIVE_TASKS"
							 }, {
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutionRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458f000000510011')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458f000000510011", "EndDate" : "\/Date(" + futureDate + ")\/", "BeginDate" : "\/Date(" + pastDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u010007", "FullName" : "James Kapoor", "IsEnabled" : false, "SupportsEnableSubstitutionRule" : false, "SupportsDeleteSubstitutionRule" :false, "Mode":"RECEIVE_TASKS"
							 }
							 ], "__count" : "4"
			}
		};
		return inActiveSubstitutionRule;
	};

	InboxMockServerData.activeSubtitutingRulesData = function(){

	var oToday = new Date();
	var presentDate = Date.UTC(oToday.getFullYear(), oToday.getMonth(), oToday.getDate(), 0, 0, 0, 0);
	var futureDate1 = presentDate + 888888888;
	var futureDate2 = presentDate + 9999999999;
	var pastDate = presentDate - 77777777777;

	var activeSubstituteRule = {
			
			"d" : {
				"results" : [
							 {
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutesRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000416629')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000416629", "EndDate" : "\/Date(" + futureDate1 + ")\/", "BeginDate" : "\/Date(" + pastDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u010005", "FullName" : "Amir Khan", "IsEnabled" : true, "SupportsEnableSubstitutionRule" : true, "SupportsDeleteSubstitutionRule": true, "Mode":"RECEIVE_TASKS"
							 }, {
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutesRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510194')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510194", "EndDate" : "\/Date(" + presentDate + ")\/", "BeginDate" : "\/Date(" + presentDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u00004", "FullName" : "Salman Khan", "IsEnabled" : true, "SupportsEnableSubstitutionRule" : false, "SupportsDeleteSubstitutionRule" :true, "Mode":"RECEIVE_TASKS"
							 },{
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutesRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510019')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510019", "EndDate" : "\/Date(" + futureDate2 + ")\/", "BeginDate" : "\/Date(" + presentDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u000002", "FullName" : "Shah Rukh Khan", "IsEnabled" : true, "SupportsEnableSubstitutionRule" : false, "SupportsDeleteSubstitutionRule" :false, "Mode":"RECEIVE_TASKS"
							 }, {
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutesRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510091')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510091", "EndDate" : "\/Date(" + futureDate2 + ")\/", "BeginDate" : "\/Date(" + presentDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u000007", "FullName" : "James Bond Khan", "IsEnabled" : true, "SupportsEnableSubstitutionRule" : true, "SupportsDeleteSubstitutionRule" :false, "Mode":"TAKE_OVER"
							 }
							 ], "__count" : "4"
				}
		};
	return activeSubstituteRule;
	};

	InboxMockServerData.inActiveSubtitutingRulesData = function(){
		
		var oToday = new Date();
		var presentDate = Date.UTC(oToday.getFullYear(), oToday.getMonth(), oToday.getDate(), 0, 0, 0, 0);
		var futureDate = presentDate + 888888888;
		var pastDate = presentDate - 77777777777;

		var inActiveSubstituteRuleData = {
			
			"d" : {
				"results" : [
							 {
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutesRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000416699')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000416699", "EndDate" : "\/Date(" + presentDate + ")\/", "BeginDate" : "\/Date(" + presentDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u12385", "FullName" : "Manjusha Roy", "IsEnabled" : false, "SupportsEnableSubstitutionRule" : false, "SupportsDeleteSubstitutionRule": true, "Mode":"RECEIVE_TASKS"
							 }, {
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutesRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510198')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510198", "EndDate" : "\/Date(" + futureDate + ")\/", "BeginDate" : "\/Date(" + presentDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u0765334", "FullName" : "Sharan Roy", "IsEnabled" : false, "SupportsEnableSubstitutionRule" : true, "SupportsDeleteSubstitutionRule" :true, "Mode":"RECEIVE_TASKS"
							 },{
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutesRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510097')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510097", "EndDate" : "\/Date(" + futureDate + ")\/", "BeginDate" : "\/Date(" + presentDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u541122", "FullName" : "Roy Prashanth", "IsEnabled" : false, "SupportsEnableSubstitutionRule" : true, "SupportsDeleteSubstitutionRule" :false, "Mode":"TAKE_OVER"
							 }, {
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutesRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510096')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e000000510096", "EndDate" : "\/Date(" + pastDate + ")\/", "BeginDate" : "\/Date(" + pastDate + ")\/", "User" : "USER.PRIVATE_DATASOURCE.un:u047007", "FullName" : "James Roy", "IsEnabled" : false, "SupportsEnableSubstitutionRule" : false, "SupportsDeleteSubstitutionRule" :false, "Mode":"RECEIVE_TASKS"
							 }
							 ], "__count" : "4"
				}
		};
	return inActiveSubstituteRuleData;
	};

	InboxMockServerData.enableSubstitutionRule = {
			
				"d" : {
					"results" : [
					{
						"__metadata" : {
							"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutionRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e001230516621')", "type" : "TASKPROCESSING.SubstitutionRule"
						}, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e001230516621", "EndDate" : "\/Date(1378726242542)\/", "BeginDate" : "\/Date(1378726242542)\/", "User" : "USER.PRIVATE_DATASOURCE.un:u035985", "FullName" : "James Enabled", "IsEnabled" : true, "SupportsEnableSubstitutionRule" : true, "SupportsDeleteSubstitutionRule": true
					}
					], "__count" : "1"
				}
	};

	InboxMockServerData.disableSubstitutionRule = {
			
			"d" : {
				"results" : [
							 {
								 "__metadata" : {
									 "uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/SubstitutionRuleCollection(SAP__Origin='VMLOCALHOSTXX_YNW_00',SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e001230516621')", "type" : "TASKPROCESSING.SubstitutionRule"
								 }, "SAP__Origin" : "VMLOCALHOSTXX_YNW_00", "SubstitutionRuleID" : "bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution%2F1e30a27185cc1166458e001230516621", "EndDate" : "\/Date(1378726242542)\/", "BeginDate" : "\/Date(1378726242542)\/", "User" : "USER.PRIVATE_DATASOURCE.un:u035985", "FullName" : "James Disabled", "IsEnabled" : false, "SupportsEnableSubstitutionRule" : true, "SupportsDeleteSubstitutionRule": true
							 }
							 ], "__count" : "1"
			}
	};

	InboxMockServerData.deleteSubstitutionRule = {
			"d" : {
					"Deleted": "true"
			}
	};

	InboxMockServerData.customActionsTask1 = {
	"d" : [
	{
	"DecisionKey" : "Approve", "DecisionText" : "Approve", "CommentMandatory" : true, "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0692"
	}, {
	"DecisionKey" : "Reject", "DecisionText" : "Reject", "CommentMandatory" : false, "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0692"
	}, {
	"DecisionKey" : "OtherOpinion", "DecisionText" : "Other Opinion", "CommentMandatory" : true, "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0692"
	}
	]
	};

	InboxMockServerData.customActionsTask2 = {
	"d" : [
	{
	"DecisionKey" : "Approve", "DecisionText" : "Approve", "CommentMandatory" : false, "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0691"
	}, {
	"DecisionKey" : "Rework", "DecisionText" : "Rework", "CommentMandatory" : false, "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0691"
	}
	]
	};

	InboxMockServerData.customActionsTask3 = {
	"d" : [
	{
	"DecisionKey" : "Approve", "DecisionText" : "Approve", "CommentMandatory" : false, "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0690"
	}, {
	"DecisionKey" : "Rework", "DecisionText" : "Rework", "CommentMandatory" : false, "TaskDefinitionID" : "bpm://bpm.sap.com/task-model/e000054ca4e9d12f75a211e2ca8d0050569e0690"
	}
	]
	};

	InboxMockServerData.customActionsApproveData = {
			"d" : {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
				}, "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2", "TaskModelID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0691", "TaskDefinitionID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-model%2Fe000054ca4e9d12f75a211e2ca8d0050569e0690", "TaskDefinitionName" : "Review and Approve article", "TaskTitle" : "Review and Approve article", "Priority" : "MEDIUM", "Status" : "COMPLETED", "CreatedOn" : "\/Date(1382002645153)\/", "StartDeadLine" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "\/Date(1382002655329)\/", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : false, "SupportsRelease" : false, "SupportsForward" : false, "SupportsComments" : true, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : ""
				}
			};

	InboxMockServerData.decisionOptionsDataNull = {
			"d" : [

	]
	};

	InboxMockServerData.claimTask = {

			"d" : {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8a90f79cda4311e28e010000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task",
				}, "InstanceID" : "bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8a90f79cda4311e28e010000006379d2", "TaskDefinitionID" : "", "TaskDefinitionName" : "", "TaskTitle" : "", "Priority" : "", "Status" : "", "CreatedOn" : "", "StartDeadLine" : "", "CompletionDeadLine" : "", "ExpiryDate" : "", "LastChangedTime" : "", "LastChangedBy" : "", "IsEscalated" : false, "SupportsClaim" : false, "SupportsRelease" : true, "SupportsForward" : true, "SupportsComments" : false, "HasComments" : false, "HasAttachments" : false, "HasPotentialOwners" : false, "IsSubstituted" : false, "SubstitutedUser" : ""
				}
	};

	InboxMockServerData.decisionClaim = {
			"d" : [

			]
	};

	InboxMockServerData.openTask = {
			"d" : {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskCollection(InstanceID='bpm://bpm.sap.com/task-instance/d4fb0c81528711e39b3a0000006379d2',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.Task"
				}, "InstanceID" : "/uilib-sample/test-resources/sap/uiext/inbox/internal/InboxResizeTaskExecutnUI.html?taskId=d4fb0c81528711e39b3a0000006379d2", "GUI_Link" : "/uilib-sample/test-resources/sap/uiext/inbox/internal/InboxResizeTaskExecutnUI.html?taskId=d4fb0c81528711e39b3a0000006379d2"
				}
	};

	InboxMockServerData.customAttributeDefinitionData = {
			
			"d" : {
				"results" : [
				{
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskDefinitionCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='com.sap.bpem.tm.impl.CustomAttributeDefinitionImpl@1233f091')", "type" : "TASKPROCESSING.TaskDefinition"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "Name" : "stringAttr", "Label" : "Strings", "Type" : "class java.lang.String"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskDefinitionCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='com.sap.bpem.tm.impl.CustomAttributeDefinitionImpl@39106a2c')", "type" : "TASKPROCESSING.TaskDefinition"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "Name" : "boolAttr", "Label" : "Booleans", "Type" : "class java.lang.Boolean"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskDefinitionCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='com.sap.bpem.tm.impl.CustomAttributeDefinitionImpl@76d1c173')", "type" : "TASKPROCESSING.TaskDefinition"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "Name" : "dateAttr", "Label" : "Dates", "Type" : "class java.util.Date"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskDefinitionCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='com.sap.bpem.tm.impl.CustomAttributeDefinitionImpl@68c30fe7')", "type" : "TASKPROCESSING.TaskDefinition"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "Name" : "dateTimeAttr", "Label" : "DateTimes", "Type" : "class java.util.Date"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskDefinitionCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='com.sap.bpem.tm.impl.CustomAttributeDefinitionImpl@29514f15')", "type" : "TASKPROCESSING.TaskDefinition"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "Name" : "decimalAttr", "Label" : "Decimals", "Type" : "class java.math.BigDecimal"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskDefinitionCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='com.sap.bpem.tm.impl.CustomAttributeDefinitionImpl@2e496a27')", "type" : "TASKPROCESSING.TaskDefinition"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "Name" : "floatAttr", "Label" : "Floats", "Type" : "class java.lang.Float"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskDefinitionCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='com.sap.bpem.tm.impl.CustomAttributeDefinitionImpl@3467aa23')", "type" : "TASKPROCESSING.TaskDefinition"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "Name" : "integerAttr", "Label" : "Integers", "Type" : "class java.lang.Integer"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskDefinitionCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='com.sap.bpem.tm.impl.CustomAttributeDefinitionImpl@78ccae3e')", "type" : "TASKPROCESSING.TaskDefinition"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "Name" : "timeAttr", "Label" : "Times", "Type" : "class java.sql.Time"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/TaskDefinitionCollection(SAP__Origin='LOCALHOST_C73_00',TaskDefinitionID='com.sap.bpem.tm.impl.CustomAttributeDefinitionImpl@142a34fe')", "type" : "TASKPROCESSING.TaskDefinition"
				}, "SAP__Origin" : "LOCALHOST_C73_00", "Name" : "longAttr", "Label" : "Longs", "Type" : "class java.lang.Long"
				}
				]
				}
				
			
	};
	InboxMockServerData.customAttributeData = {
			"d" : {
				"results" : [
				{
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/CustomAttributeCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F610c2742743411e3831e0000006379d2',Name='dateAttr',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.CustomAttribute"
				}, "Name" : "dateAttr", "Value" : "Nov 16, 2012"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/CustomAttributeCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F610c2742743411e3831e0000006379d2',Name='dateTimeAttr',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.CustomAttribute"
				}, "Name" : "dateTimeAttr", "Value" : "Nov 25, 2012"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/CustomAttributeCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F610c2742743411e3831e0000006379d2',Name='booleanAttr',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.CustomAttribute"
				}, "Name" : "booleanAttr", "Value" : "false"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/CustomAttributeCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F610c2742743411e3831e0000006379d2',Name='decimalAttr',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.CustomAttribute"
				}, "Name" : "decimalAttr", "Value" : "3664.000000"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/CustomAttributeCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F610c2742743411e3831e0000006379d2',Name='longAttr',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.CustomAttribute"
				}, "Name" : "longAttr", "Value" : "38,094"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/CustomAttributeCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F610c2742743411e3831e0000006379d2',Name='stringAttr',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.CustomAttribute"
				}, "Name" : "stringAttr", "Value" : "Manna"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/CustomAttributeCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F610c2742743411e3831e0000006379d2',Name='integerAttr',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.CustomAttribute"
				}, "Name" : "integerAttr", "Value" : "4000"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/CustomAttributeCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F610c2742743411e3831e0000006379d2',Name='floatAttr',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.CustomAttribute"
				}, "Name" : "floatAttr", "Value" : "1,122"
				}, {
				"__metadata" : {
				"uri" : "/sap.com~tc~tm~wl~odata~web/BPMTasks.svc/CustomAttributeCollection(InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F610c2742743411e3831e0000006379d2',Name='timeAttr',SAP__Origin='LOCALHOST_C73_00')", "type" : "TASKPROCESSING.CustomAttribute"
				}, "Name" : "timeAttr", "Value" : "10:00:12"
				}
				]
				}
	};

	return InboxMockServerData;
});