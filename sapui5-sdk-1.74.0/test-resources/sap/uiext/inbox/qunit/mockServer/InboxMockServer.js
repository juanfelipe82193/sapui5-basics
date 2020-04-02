sap.ui.define([
	"sap/ui/app/MockServer",
	"./InboxMockServerData",
], function(MockServer, serverData) {
	"use strict";

	var InboxMockServer = function(){
	};

	InboxMockServer._getInstance = function() {
		if (!this._oServer) {
			this._oServer = new MockServer({ 
				rootUri : "http://localhost/myservice", 
				requests : [
					{
						method : "GET",
						path : "/(.*)metadata",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/xml" }, serverData.metadata());
							return true;
						}
					},
					{
						method : "GET",
						path : "/TaskCollection\?(.*)skip=(.*)&(.*)top=(.*)&(.*)orderby=CreatedOn%20desc&(.*)filter=Status%20ne%20%27COMPLETED%27&(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.initialLoadData));
							return true;
						}
					} ,
					{
						method : "GET",
						path : "/TaskCollection\?(.*)skip=(.*)&(.*)top=(.*)&(.*)orderby=CreatedOn%20desc&(.*)filter=Status%20eq%20%27READY%27&(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.filterReadyStatusData));
							return true;
						}
					} ,
					{
						method : "GET",
						path : "/TaskCollection(.*)/ObjectLinkExecution",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.retrieveObjectLinkData));
							return true;
						}
					} ,
					{
						method : "GET",
						path : "/TaskCollection(.*)/ObjectLinkExecution(.*)filter(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.objectLinkDataOnFilter));
							return true;
						}
					} ,
					{
						method : "GET",
						path : "/TaskCollection\?(.*)skip=(.*)&(.*)top=(.*)&(.*)orderby=CreatedOn%20desc&(.*)filter=Status%20eq%20%27COMPLETED%27&(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.filterCompletedStatusData));
							return true;
						}
					} ,
					{
						method : "GET",
						path : "/TaskCollection\?(.*)skip=(.*)&(.*)top=(.*)&(.*)orderby=CreatedOn%20desc&(.*)filter=Status%20ne%20%27COMPLETED%27%20and%20CreatedOn%20ge%20datetime%27(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.filterCreationDateData));
							return true;
						}
					} ,
					{
						method : "GET",
						path : "/TaskCollection\?(.*)skip=(.*)&(.*)top=(.*)&(.*)orderby=CreatedOn%20desc&(.*)filter=Status%20ne%20%27COMPLETED%27%20and%20(.*)CompletionDeadLine%20le%20datetime%27(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.filterDueDateData));
							return true;
						}
					} ,
					{
						method : "GET",
						path : "/",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.rootURLData));
							return true;
						}
					},
					{
						method : "GET",
						path : "/TaskCollection(.*)InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2',SAP__Origin='LOCALHOST_C73_00'(.*)/Comments",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.retrieveCommentsData));
							return true;
						}
					},
					{
						//TODO: Add Comment call - Instance ID needs to be encoded.
						method : "POST",
						path : "/AddComment?(.*)InstanceID=(.*)bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2(.*)SAP__Origin=(.*)LOCALHOST_C73_00(.*)Text=(.*)Okay(.*)done(.*)",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.addCommentData));
							return true;
						}
					},
					{
						//TODO: Add long Comment
						method : "POST",
						path : "/AddComment?(.*)InstanceID=(.*)bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F9851fd12da6311e280840000006379d2(.*)SAP__Origin=(.*)LOCALHOST_C73_00(.*)Text=(.*)Negredo(.*)",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.addLongCommentData));
							return true;
						}
					},
					{
						method : "GET",
						path : "/SearchUsers?(.*)SAP__Origin='LOCALHOST_C73_00'&SearchPattern='adm'&MaxResults=(.*)",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.searchUsersData));
							return true;
						}
					},
					{
						method : "GET",
						path : "/SearchUsers?(.*)SAP__Origin='LOCALHOST_C73_00'&SearchPattern='tes'&MaxResults=(.*)",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.searchUsersDataOne));
							return true;
						}
					},
					{
						method : "GET",
						path : "/SearchUsers?(.*)SAP__Origin='LOCALHOST_C73_00'&SearchPattern='xyz'&MaxResults=(.*)",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.searchUsersDataNone));
							return true;
						}
					},
					{
						method : "GET",
						path : "/SearchUsers?(.*)SAP__Origin='LOCALHOST_C73_00'&SearchPattern='fail'&MaxResults=(.*)",
						response : function(oXhr, id) {
							oXhr.respond(404);
							return true;
						}
					},
					{
						method : "GET",
						path : "/SubstitutionRuleCollection?(.*)filter=IsEnabled%20eq%20true",						
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.myActiveSubtitutionRulesData()));
							return true;
						}
					},
					{
						method : "GET",
						path : "/SubstitutionRuleCollection?(.*)filter=IsEnabled%20eq%20false",						
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.myInActiveSubtitutionRulesData()));
							return true;
						}
					},
					{
						method : "GET",
						path : "/SubstitutesRuleCollection?(.*)filter=IsEnabled%20eq%20true",						
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.activeSubtitutingRulesData()));
							return true;
						}
					},
					{
						method : "GET",
						path : "/SubstitutesRuleCollection?(.*)filter=IsEnabled%20eq%20false",						
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.inActiveSubtitutingRulesData()));
							return true;
						}
					},
					{
						method : "POST",
						path : "/EnableSubstitutionRule?(.*)SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution(.*)&Enabled=true&SAP__Origin='(.*)'&(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.enableSubstitutionRule));
							return true;
						}
					},
					{
						method : "POST",
						path : "/EnableSubstitutionRule?(.*)SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution(.*)'&Enabled=false&SAP__Origin='(.*)'&(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.disableSubstitutionRule));
							return true;
						}
					},
					{
						method : "POST",
						path : "/DeleteSubstitutionRule?(.*)SubstitutionRuleID='bpm%3A%2F%2Fbpm.sap.com%2Fsubstitution(.*)'&SAP__Origin='(.*)'&(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.deleteSubstitutionRule));
							return true;
						}
					},
					
					{
						method : "GET",
						path : "/DecisionOptions?(.*)InstanceID=(.*)9851fd12da6311e280840000006379d2(.*)&SAP__Origin='(.*)'&(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.decisionOptionsDataNull));
							return true;
						}
					},
					{
						method : "GET",
						path : "/DecisionOptions?(.*)InstanceID=(.*)8c24fde4da4311e2ad120000006379d2(.*)&SAP__Origin='(.*)'&(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.decisionOptionsDataNull));
							return true;
						}
					},
					{
						method : "GET",
						path : "/DecisionOptions?(.*)InstanceID=(.*)8bb84073da4311e2cddb0000006379d2(.*)&SAP__Origin='(.*)'&(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.decisionOptionsDataNull));
							return true;
						}
					},
					{
						method : "GET",
						path : "/DecisionOptions?(.*)InstanceID=(.*)8a90f79cda4311e28e010000006379d2(.*)&SAP__Origin='(.*)'&(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.decisionOptionsDataNull));
							return true;
						}
					},
					{
						method : "GET",
						path : "/DecisionOptions?(.*)InstanceID=(.*)8b4e35d5da4311e2aca00000006379d2(.*)&SAP__Origin='(.*)'&(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.decisionOptionsDataNull));
							return true;
						}
					},
					
					{
						method : "GET",
						path : "/DecisionOptions?(.*)InstanceID=(.*)f07842c4358911e389b60000006379d2(.*)&SAP__Origin='(.*)'&(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.customActionsTask1));
							return true;
						}
					},
					{
						method : "GET",
						path : "/DecisionOptions?(.*)InstanceID=(.*)de024b1b358911e39b450000006379d2(.*)&SAP__Origin='(.*)'&(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.customActionsTask2));
							return true;
						}
					},
					{
						method : "GET",
						path : "/DecisionOptions?(.*)InstanceID=(.*)baee1034370f11e3cda50000006379d2(.*)&SAP__Origin='(.*)'&(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.customActionsTask3));
							return true;
						}
					},
					{
						method : "POST",
						path : "/Decision?(.*)InstanceID=(.*)bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2(.*)SAP__Origin=(.*)LOCALHOST_C73_00(.*)DecisionKey=(.*)Approve(.*)",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.customActionsApproveData));
							return true;
						}
					},
					{
						method : "POST",
						path : "/Decision?(.*)InstanceID=(.*)bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2Fbaee1034370f11e3cda50000006379d2(.*)SAP__Origin=(.*)LOCALHOST_C73_00(.*)DecisionKey=(.*)Rework(.*)Comments=(.*)Rework(.*)",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.customActionsApproveData));
							return true;
						}
					},
					{
						method : "GET",
						path : "/DecisionOptions?(.*)InstanceID=(.*)8a90f79cda4311e28e010000006379d2(.*)&SAP__Origin='(.*)'&(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.decisionClaim));
							return true;
						}
					},
					{
						method : "GET",
						path : "/TaskCollection(.*)InstanceID='bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8a90f79cda4311e28e010000006379d2(.*)'(.*)SAP__Origin='(.*)'(.*)UIExecutionLink(.*)format=json",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.openTask));
							return true;
						}
					},
					{
						method : "POST",
						path : "/Claim(.*)InstanceID=(.*)bpm%3A%2F%2Fbpm.sap.com%2Ftask-instance%2F8a90f79cda4311e28e010000006379d2(.*)SAP__Origin=(.*)LOCALHOST_C73_00(.*)",
						response : function(oXhr, id) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.claimTask));
							return true;
						}
					},
					{
						method : "GET",
						path : "/TaskCollection\?(.*)skip=(.*)&(.*)top=(.*)&(.*)orderby=CreatedOn%20desc&(.*)filter=Status%20ne%20%27COMPLETED%27%20and%20TaskDefinitionData/Category%20eq%20%27Todo%27&(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.todoData));
							return true;
						}
					},
					{
						method : "GET",
						path : "/TaskCollection\?(.*)skip=(.*)&(.*)top=(.*)&(.*)orderby=CreatedOn%20desc&(.*)filter=Status%20ne%20%27COMPLETED%27%20and%20TaskDefinitionData/Category%20eq%20%27TASK%27&(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.taskData));
							return true;
						}
					},
					{
						method : "GET",
						path : "/TaskCollection\?(.*)skip=(.*)&(.*)top=(.*)&(.*)orderby=CreatedOn%20desc&(.*)filter=Status%20ne%20%27COMPLETED%27%20and%20TaskDefinitionData/Category%20eq%20%27Alert%27&(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.alertData));
							return true;
						}
					},
					{
						method : "GET",
						path : "/TaskCollection\?(.*)skip=(.*)&(.*)top=(.*)&(.*)orderby=CreatedOn%20desc&(.*)filter=Status%20ne%20%27COMPLETED%27%20and%20TaskDefinitionData/Category%20eq%20%27Notification%27&(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.notificationData));
							return true;
						}
					},
					{
						method : "GET",
						path : "/TaskCollection\?(.*)skip=(.*)&(.*)top=(.*)&(.*)orderby=CreatedOn%20desc&(.*)filter=Status%20ne%20%27COMPLETED%27%20and%20TaskDefinitionData/Category%20eq%20%27Notification%27%20and%20Priority%20eq%20%27LOW%27&(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.notificationData));
							return true;
						}
					},
					{
						method : "GET",
						path : "/TaskCollection\?(.*)skip=(.*)&(.*)top=(.*)&(.*)orderby=CreatedOn%20desc&(.*)filter=Status%20ne%20%27COMPLETED%27%20and%20Priority%20eq%20%27LOW%27%20and%20TaskDefinitionData/Category%20eq%20%27Notification%27&(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.notificationData));
							return true;
						}
					},
					{
						method : "GET",
						path : "/TaskCollection\?(.*)skip=(.*)&(.*)top=(.*)&(.*)orderby=CreatedOn%20desc&(.*)filter=TaskDefinitionData/Category%20eq%20%27TASK%27%20and%20Status%20ne%20%27COMPLETED%27&(.*)",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.taskData));
							return true;
						}
					},
					{
						method : "GET",
						path : "/TaskDefinitionCollection(.*)TaskDefinitionID='(.*)'(.*)SAP__Origin='(.*)'(.*)CustomAttributeDefinitionData",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.customAttributeDefinitionData));
							return true;
						}
					},
					{
						method : "GET",
						path : "/TaskCollection(.*)InstanceID='(.*)'(.*)SAP__Origin='(.*)'(.*)CustomAttributeData",
						response : function(oXhr) {
							oXhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(serverData.customAttributeData));
							return true;
						}
						
					}
					
				]
			});
		}
		return this._oServer;
	};
		
	return InboxMockServer;

});