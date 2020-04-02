sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/util/MockServer',
	'sap/rules/ui/services/ExpressionLanguage',
	'sap/rules/ui/DecisionTable',
	'test/sap/rules/ui/TestUtils',
	'jquery.sap.global'
	],
	function (Controller, MockServer, ExpressionLanguage, DecisionTable, Utils, jQuery) {
	    "use strict";
	
	    return Controller.extend("DecisionTableFormatter.view.DecisionTableFormatter", {
	
	        onInit: function () {
	            this.loadDT();
	        },
	
	        openRuleForEdit: function () {
	            Utils.openRuleForEdit( {
	                ruleId: this.ruleId,
	                model: this.oDataModel
	            });
	        },
	        
	        loadDT: function () {
				var sRuleId = "2d1f9a7123c94d11883c8491929127a4",
					version = "000001",
					sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";
	            
				this.ruleId = "2d1f9a7123c94d11883c8491929127a4";
	            this.oDataModel = Utils.createRuleOdataModel();
	
	            this.openRuleForEdit();
	            var dt = this.byId("myDecisionTable");
	            dt.setVisible(true);
	            dt.setModel(this.oDataModel);
	           
				var oExprLangPack = Utils.createExpressionLanguageWithData({
					vocaId: sRuleId	
				});  
				
	            var afterReadActions = function() {
	                dt.setExpressionLanguage(oExprLangPack.expressionLanguage);
	                dt.setBindingContextPath(sRulePath);  
	            };
	           
	            oExprLangPack.deferredVocaData.done(afterReadActions);
	            //dt.setExpressionLanguage(oExprLangPack.expressionLanguage);
	            //dt.setBindingContextPath(sRulePath);
	        }
	    });
});