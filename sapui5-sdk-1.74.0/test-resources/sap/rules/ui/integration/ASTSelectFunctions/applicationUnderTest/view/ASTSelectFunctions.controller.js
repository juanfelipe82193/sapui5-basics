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

		return Controller.extend("ASTSelectFunctions.view.ASTSelectFunctions", {

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
					"/Projects(Id='49a6d8b594be481b9f763ab3d10aeb4a',Version='000000000000000000')/Rules(Id='6af2d2ecfccf4fa4a33fc30b55c8839a',Version='000000000000000000')";
				var oConfig = {
					defaultBindingMode: "TwoWay"
				};
				this.ruleId = "6af2d2ecfccf4fa4a33fc30b55c8839a";
				this.oDataModel = Utils.createRuleOdataModel();
				
	            this.openRuleForEdit();

				var textrule = this.byId("myTextRule");
				textrule.setVisible(true);
				textrule.setModel(this.oDataModel);

				var oExprLangPack = Utils.createAstExpressionLanguageWithData({
					vocaId: '49a6d8b594be481b9f763ab3d10aeb4a'
				});
				
				
				// textrule.setAstExpressionLanguage(oExprLangPack.expressionLanguage);
				// textrule.setBindingContextPath(sRulePath);

				this.oVocabularyModel = new sap.ui.model.odata.v2.ODataModel("/rules-service/vocabulary_srv/", oConfig);
            	var that = this;

				//Set context's path on the decison table
				var sVocabularyPath = "/Vocabularies('49a6d8b594be481b9f763ab3d10aeb4a')";
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