sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/rules/ui/services/ExpressionLanguage',
	'sap/ui/core/util/MockServer',
	'sap/m/MessageToast',
	'sap/ui/Device'
], function (Controller, ODataModel, ExpressionLanguage, MockServer, MessageToast, Device) {
	"use strict";

	return Controller.extend("sap.rules.ui.sample.GuidedDecisionTable.Page", {

		onInit: function () {

			sap.ui.getCore().applyTheme("sap_fiori_3");

			// apply compact density for desktop, the cozy design otherwise
			this.getView().addStyleClass(Device.system.desktop ? "sapUiSizeCompact" : "sapUiSizeCozy");

			var mPath = sap.ui.require.toUrl('sap/rules/ui/sample/GuidedDecisionTable/');
			
			// Initialiaze Expression Language services
			this.oVocabularyMockServer = new MockServer({rootUri: "/sap/opu/odata/SAP/vocabulary_srv/"});
			this.oVocabularyMockServer.simulate(
				mPath + "localService/vocabulary/metadata.xml",
				{'sMockdataBaseUrl': mPath + "localService/vocabulary/mockdata/"}
			);
			this.oVocabularyMockServer.start();
			this.oVocabularyModel = new ODataModel("/sap/opu/odata/SAP/vocabulary_srv/");
			this.oExpressionLanguage = new ExpressionLanguage();
			this.oExpressionLanguage.setModel(this.oVocabularyModel);
			this.oExpressionLanguage.setBindingContextPath("/Vocabularies('FA163E38C6481EE785F409DCAD583D43')");

			// Initialiaze the Rule Builder
			this.oRuleMockServer = new MockServer({rootUri: "/sap/opu/odata/SAP/RULE_SRV/"});
			this.oRuleMockServer.simulate(
				mPath + "localService/rule/metadata.xml",
				{'sMockdataBaseUrl': mPath + "localService/rule/mockdata/"}
			);

			var aRequests = this.loadRequests(mPath);
			this.oRuleMockServer.setRequests(aRequests);
			this.oRuleMockServer.start();
			this.oRuleModel = new ODataModel({
				serviceUrl: "/sap/opu/odata/SAP/RULE_SRV/",
				defaultBindingMode: sap.ui.model.BindingMode.TwoWay
			});

			var oRuleBuilder = this.byId("ruleBuilder");
			oRuleBuilder.setModel(this.oRuleModel);
			oRuleBuilder.setExpressionLanguage(this.oExpressionLanguage);
			oRuleBuilder.setBindingContextPath("/Rules(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001')");
		},

		handleEditButton: function () {
			var oEditButton = this.byId("editButton");
			var oRuleBuilder = this.byId("ruleBuilder");
			var bEdit = (oEditButton.getText() === "Edit");
			oRuleBuilder.setEditable(bEdit);
			oEditButton.setText(bEdit ? "Display" : "Edit");
		},

		onAfterRendering: function () {

		    	var messageHandler =function(){
                		var msg = 'Line action pressed';
                		MessageToast.show(msg);
            		};
            
			// Line actions are not supported in this demo
			var oRuleBuilder = this.byId("ruleBuilder");
			var oDecisionTable = oRuleBuilder.getAggregation("_rule");
			var oToolbar = oDecisionTable.getAggregation("_toolbar");
			var arrContent = oToolbar.getContent();
			for (var i = 0; i < arrContent.length; i++) {
				if (arrContent[i].getMetadata().getName() === "sap.m.Button") {
					arrContent[i].detachPress(arrContent[i].mEventRegistry.press[0].fFunction, arrContent[i].mEventRegistry.press[0].oListner);
					arrContent[i].attachPress(messageHandler);
				} else if (arrContent[i].getMetadata().getName() === "sap.m.MenuButton") {
					var oMenu = arrContent[i].getMenu();
					oMenu.detachItemSelected(oMenu.mEventRegistry.itemSelected[0].fFunction, oMenu.mEventRegistry.itemSelected[0].oListner);
					oMenu.attachItemSelected(messageHandler);
				}
			}

		},
		
		loadJSON: function(mPath, callback) {
            		var xobj = new XMLHttpRequest();
            		xobj.open('GET', mPath + "localService/rule/responses.json", true);
            		xobj.onreadystatechange = function() {
                	if (xobj.readyState == 4 && xobj.status == "200") {
                    		callback(JSON.parse(xobj.responseText));
                	}
            		};
            		xobj.send(null);
        	},

		loadRequests: function (mPath) {

		    	// The mock server does not support 1 to 1 navigation.
            		// Hence we provide the responses directly by adding custom requests to the MockServer
            		var oRresponses = {};
            		var getData = function(json) {
                		oRresponses = json;
            		};

            		this.loadJSON(mPath, getData);
			
			var aRequests = this.oRuleMockServer.getRequests();
			var sMethod = "GET";
			var sPath = /Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\/DecisionTable\/DecisionTableRows\/\$count/;
			var fnResponse1 = function (xhr) {
				xhr.respond(200, {
					"Content-Type": "text/plain;charset=utf-8"
				}, "5");
			};
			aRequests.push({method: sMethod, path: sPath, response: fnResponse1});
			
			sPath = /Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\/DecisionTable\/DecisionTableRows\?\$skip=0&\$top=\d+&\$orderby=Sequence%20asc&\$expand=Cells/;
			var fnResponse2 = function (xhr) {
				xhr.respondJSON(200, {
					"Content-Type": "application/json;charset=utf-8"
				}, oRresponses.response_1);
			};
			aRequests.push({method: sMethod, path: sPath, response: fnResponse2});

			sPath = /Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\/DecisionTable\/DecisionTableColumns\/\$count/;
			var fnResponse3 = function (xhr) {
				xhr.respond(200, {
					"Content-Type": "text/plain;charset=utf-8"
				}, "5");
			};
			aRequests.push({method: sMethod, path: sPath, response: fnResponse3});

			sPath = /Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\/DecisionTable\/DecisionTableColumns\?\$skip=0&\$top=\d+&\$expand=Condition%2cResult/;
			var fnResponse4 = function (xhr) {
				xhr.respondJSON(200, {
					"Content-Type": "application/json;charset=utf-8"
				}, oRresponses.response_2);
			};
			aRequests.push({method: sMethod, path: sPath, response: fnResponse4});

			return aRequests;
		}
	});
});
