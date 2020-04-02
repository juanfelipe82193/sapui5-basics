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

    return Controller.extend("DecisionTablePerformance.view.DecisionTablePerformance", {

        onInit: function () {
            var iBeforeRenderingTime = 0;
            var theRuleBuilder = this.byId("myRuleBuilder");
            
            theRuleBuilder.addDelegate({
                onBeforeRendering: function () {
                    iBeforeRenderingTime = window.performance.now();
                }
            }, true);
            theRuleBuilder.addDelegate({
                onAfterRendering: function () {
                    window.renderingTime = ((window.performance.now() - iBeforeRenderingTime) / 1000).toFixed(4);
                }
            }, false);
            Utils.startRequestRecorder({
	                        filePath: "../data/", 
	                        fileName: "Rule500_2_2"
	                    });

			var sRuleServiceURL = "/sap/opu/odata/SAP/RULE_SRV/";
			var sVocaServiceURL = "/sap/opu/odata/SAP/VOCABULARY_SRV/";
			Utils.setServiceURLs(sRuleServiceURL, sVocaServiceURL);
			
            this.loadDT('005056912EC51EE695E00FA54FFA3CFA');
        },
        
		openRuleForEdit: function () {
	            Utils.openRuleForEdit( {
	                ruleId: this.ruleId,
	                model: this.oDataModel
	            });
	    },
	    
        loadDT: function (ruleId) {
        	
        	var sRuleId = ruleId,
					version = "000002",
					sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";

            var theRuleBuilder = this.byId("myRuleBuilder");
            var oDTConfig = new sap.rules.ui.DecisionTableConfiguration();
            
            this.ruleId = "005056912EC51EE695E00FA54FFA3CFA";
            
            
			theRuleBuilder.setDecisionTableConfiguration(oDTConfig);
            theRuleBuilder.setTypes([sap.rules.ui.RuleType.DecisionTable]);

            //this.ruleId = "005056912EC51ED69E9A346D6597757B";
	        this.oDataModel = Utils.createRuleOdataModel();
	
	        this.openRuleForEdit();
	        
	        //theRuleBuilder.setVisible(true);
	        theRuleBuilder.setModel(this.oDataModel);
	            
			var afterReadActions = function() {
				//window.timeToRead = window.performance.now() - window.iStartReadTime;
				theRuleBuilder.setExpressionLanguage(oExprLangPack.expressionLanguage);
				theRuleBuilder.setBindingContextPath(sRulePath);  
				theRuleBuilder.getAggregation("_rule").setEnableSettings(true);
			};
	        
	        window.iStartReadTime = window.performance.now();
			var oExprLangPack = Utils.createExpressionLanguageWithData({
				vocaId: sRuleId	
			});       
	            oExprLangPack.deferredVocaData.done(afterReadActions);
        }
    });
});