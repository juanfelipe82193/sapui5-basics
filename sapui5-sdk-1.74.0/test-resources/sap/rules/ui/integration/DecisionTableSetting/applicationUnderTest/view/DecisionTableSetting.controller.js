sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'test/sap/rules/ui/TestUtils',
    'jquery.sap.global'
], function (Controller, JSONModel, Utils, jQuery) {
    "use strict";
    return Controller.extend("DecisionTableSetting.view.DecisionTableSetting", {
        onInit: function () {
            this.loadDT();

        },
        loadDT: function () {
            var sRuleId = '875bdc8acc5c4d5cacd2155e3b3ad256',
				version = "000000000000000000",
				sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";
			
            this.oDataModel = Utils.createRuleOdataModel();

            var dt = this.byId("myDecisionTable");
            // set enable setting propery == true in order to provide the option to open the setting page
            dt.setEnableSettings(true);
            dt.setVisible(true);
            dt.setModel(this.oDataModel);
            
			var oExprLangPack = Utils.createExpressionLanguageWithData({
				vocaId: "cc22ecdc9ea046cd89ea4a190765ccf6"	
			});                       
            dt.setExpressionLanguage(oExprLangPack.expressionLanguage);
            dt.setBindingContextPath(sRulePath);
        }
    });
});