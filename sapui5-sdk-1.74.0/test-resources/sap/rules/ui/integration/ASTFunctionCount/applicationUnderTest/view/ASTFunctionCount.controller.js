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

		return Controller.extend("ASTFunctionCount.view.ASTFunctionCount", {

			onInit: function () {

				this.loadTextRule();
			},

			openRuleForEdit: function () {
				Utils.openRuleForEdit({
					ruleId: this.ruleId,
					model: this.oDataModel
				});
			},
			loadTextRule: function () {
				var sRulePath =
					"/Projects(Id='e4228503027a44dc885f2c24af21c36e',Version='000000000000000000')/Rules(Id='09e5b7354cfb4ae0a48c0840dfc31add',Version='000000000000000000')";
				var oConfig = {
					defaultBindingMode: "TwoWay"
				};
				this.ruleId = "09e5b7354cfb4ae0a48c0840dfc31add";
				this.oDataModel = Utils.createRuleOdataModel();
				
	            this.openRuleForEdit();

				var textrule = this.byId("myTextRule");
				textrule.setVisible(true);
				textrule.setModel(this.oDataModel);

				var oExprLangPack = Utils.createAstExpressionLanguageWithData({
					vocaId: 'e4228503027a44dc885f2c24af21c36e'
				});
				
				
				// textrule.setAstExpressionLanguage(oExprLangPack.expressionLanguage);
				// textrule.setBindingContextPath(sRulePath);

				this.oVocabularyModel = new sap.ui.model.odata.v2.ODataModel("/rules-service/vocabulary_srv/", oConfig);
            	var that = this;

				//Set context's path on the decison table
				var sVocabularyPath = "/Vocabularies('e4228503027a44dc885f2c24af21c36e')";
				var oAstExpressionLanguage;
				
				this.oVocabularyModel.read(sVocabularyPath, {
                urlParameters: {
                    "$expand": "DataObjects/Associations,DataObjects/Attributes,ValueSources"
                },
                success: function(data) {
                        if (!oAstExpressionLanguage) {
                            oAstExpressionLanguage = oExprLangPack.expressionLanguage;
                            textrule.setAstExpressionLanguage(oAstExpressionLanguage);
                        }
                        oAstExpressionLanguage.setData(data);
                        oAstExpressionLanguage.setModel(that.oVocabularyModel);
                    that.oVocabularyJson = data;
                    textrule.setBindingContextPath(sRulePath);
                },
                error: function(data) {
                    that.showErrorMessage(data);
                }

            });

			}
		});
	});