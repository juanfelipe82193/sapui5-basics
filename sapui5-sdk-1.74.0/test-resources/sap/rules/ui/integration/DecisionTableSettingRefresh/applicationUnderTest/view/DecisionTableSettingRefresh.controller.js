sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'test/sap/rules/ui/TestUtils',
    'jquery.sap.global'
], function (Controller, JSONModel, Utils, jQuery) {
    "use strict";
    return Controller.extend("DecisionTableSettingRefresh.view.DecisionTableSettingRefresh", {
        onInit: function () {
            this.loadDT();

        },
        loadDT: function () {
            var sRuleId = '863cb696e153469d8e985b01e895c751',
				version = "000000000000000000",
				sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";
			
            this.oDataModel = Utils.createRuleOdataModel();

            var dt = this.byId("myDecisionTable");
            // set enable setting propery == true in order to provide the option to open the setting page
            dt.setEnableSettings(true);
            dt.setVisible(true);
            dt.setModel(this.oDataModel);
            
			var oExprLangPack = Utils.createExpressionLanguageWithData({
				vocaId: "7ff1291a3907490f97f0aec50a2a6baf"	
			});                       
            dt.setExpressionLanguage(oExprLangPack.expressionLanguage);
            dt.setBindingContextPath(sRulePath);
        }
    });
});