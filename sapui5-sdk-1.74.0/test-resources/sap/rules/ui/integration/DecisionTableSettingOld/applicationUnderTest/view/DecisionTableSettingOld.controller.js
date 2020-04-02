sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'test/sap/rules/ui/TestUtils',
    'jquery.sap.global'
], function (Controller, JSONModel, Utils, jQuery) {
    "use strict";
    return Controller.extend("DecisionTableSettingOld.view.DecisionTableSettingOld", {
        onInit: function () {
            this.loadDT();

        },
        loadDT: function () {
            var sRuleId = 'FA163EF52EB01EE6B1EF5FBC86597B2D',
				version = "000001",
				sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";
			
            this.oDataModel = Utils.createRuleOdataModel();

            var dt = this.byId("myDecisionTable");
            // set enable setting propery == true in order to provide the option to open the setting page
            dt.setEnableSettings(true);
            dt.setVisible(true);
            dt.setModel(this.oDataModel);
            
			var oExprLangPack = Utils.createExpressionLanguageWithData({
				vocaId: sRuleId	
			});                       
            dt.setExpressionLanguage(oExprLangPack.expressionLanguage);
            dt.setBindingContextPath(sRulePath);
        }
    });
});