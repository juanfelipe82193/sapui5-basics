sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/util/MockServer',
	'sap/rules/ui/services/ExpressionLanguage',
	'sap/rules/ui/TextRule',
	'test/sap/rules/ui/TestUtils',
	'jquery.sap.global'
	],
	function (Controller, MockServer, ExpressionLanguage, TextRule, Utils, jQuery) {
	    "use strict";
	
	    return Controller.extend("TextRule.view.TextRule", {
	
	        onInit: function () {
	            
	            Utils.startRequestRecorder({
	            			mode: "play",//play, record
	                        filePath: "data/", 
	                        fileName: "TextRule"
	                    });
	            
	            this.loadTextRule();
	        },
	
	        openRuleForEdit: function () {
	            Utils.openRuleForEdit( {
	                ruleId: this.ruleId,
	                model: this.oDataModel
	            });
	        },
	        loadTextRule: function () {
				var sRulePath = "/Projects(Id='8532ff25406345639a23aa00473caf5a',Version='000001')/Rules(Id='a61b9a342e6e464c8e68020c25044e9f',Version='000001')";
	            
				this.ruleId = "a61b9a342e6e464c8e68020c25044e9f";
	            this.oDataModel = Utils.createRuleOdataModel();
	
	            this.openRuleForEdit();
	            var dt = this.byId("myTextRule");
	            dt.setVisible(true);
	            dt.setModel(this.oDataModel);
	            
	            var afterReadActions = function() {
	                dt.setExpressionLanguage(oExprLangPack.expressionLanguage);
	                dt.setBindingContextPath(sRulePath);  
	            };
	            
				var oExprLangPack = Utils.createExpressionLanguageWithData({
					vocaId: '8532ff25406345639a23aa00473caf5a'
				});       
	            oExprLangPack.deferredVocaData.done(afterReadActions);
	            //dt.setExpressionLanguage(oExprLangPack.expressionLanguage);
	            //dt.setBindingContextPath(sRulePath);
	        }
	    });
});