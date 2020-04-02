sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
    'sap/rules/ui/services/ExpressionLanguage',
    'sap/ui/core/util/MockServer',
    'test/sap/rules/ui/TestUtils'
], function (jquery, Controller, JSONModel, ExpressionLanguage, MockServer, Utils) {
    "use strict";
    return Controller.extend("ExpressionAdvancedValueHelp.view.ExpressionAdvancedValueHelp", {

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
			var sRuleId = "cd49bf62dd524a26992b75e024e1b021",
				version = "000001",
				sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";
            
			this.ruleId = "cd49bf62dd524a26992b75e024e1b021";
            this.oDataModel = Utils.createRuleOdataModel();

			var oExprLangPack = Utils.createExpressionLanguageWithData({
				vocaId: "cb83e6f1b99b4f0da4b9b1ad3a223d9e"	
			}); 
            this.openRuleForEdit();
            var expressionAdvanced = this.byId("myExpressionAdvanced");
            var afterReadActions = function() {
            	expressionAdvanced.setExpressionLanguage(oExprLangPack.expressionLanguage);
            };
            
            oExprLangPack.deferredVocaData.done(afterReadActions);
            
        }
    });
});