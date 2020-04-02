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

    return Controller.extend("DecisionTableCell.view.DecisionTableCell", {

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
			var sRuleId = "005056912EC51ED6A18FDCDE6EAEAA6F",
				version = "000001",
				sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";
            
			this.ruleId = "005056912EC51ED6A18FDCDE6EAEAA6F";
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