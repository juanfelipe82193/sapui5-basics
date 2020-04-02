sap.ui.define([
'sap/ui/core/mvc/Controller',
'sap/ui/core/util/MockServer',
'sap/rules/ui/services/ExpressionLanguage',
'sap/rules/ui/DecisionTable',
'jquery.sap.global',
'test/sap/rules/ui/TestUtils'
],
function (Controller, MockServer, ExpressionLanguage, DecisionTable, jQuery, Utils) {
    "use strict";

    return Controller.extend("DecisionTableBasic.view.DecisionTableBasic", {

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
			var sRuleId = "0b966d1838c746299d692fc5855a475a",
				version = "000001",
				sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";
            
			this.ruleId = "0b966d1838c746299d692fc5855a475a";
            this.oDataModel = Utils.createRuleOdataModel();

            this.openRuleForEdit();
            var dt = this.byId("myDecisionTable");
            dt.setVisible(true);
            dt.setModel(this.oDataModel);
            
            var afterReadActions = function() {
                dt.setExpressionLanguage(oExprLangPack.expressionLanguage);
                dt.setBindingContextPath(sRulePath);  
            };
            
			var oExprLangPack = Utils.createExpressionLanguageWithData({
				vocaId: sRuleId	
			});       
            oExprLangPack.deferredVocaData.done(afterReadActions);
            //dt.setExpressionLanguage(oExprLangPack.expressionLanguage);
            //dt.setBindingContextPath(sRulePath);
            
        }
    });
});