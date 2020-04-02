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

        return Controller.extend("TextRuleASTFunctions.view.TextRuleASTFunctions", {

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
                    "/Projects(Id='f14b8d5cc05d4a13bd5a451db6149b3a',Version='000000000000000000')/Rules(Id='a817e138ed0c4936a6e57cba4e820ad3',Version='000000000000000000')";
                var oConfig = {
                    defaultBindingMode: "TwoWay"
                };
                this.ruleId = "a817e138ed0c4936a6e57cba4e820ad3";
                this.oDataModel = Utils.createRuleOdataModel();
                
                this.openRuleForEdit();

                var textrule = this.byId("myTextRule");
                textrule.setVisible(true);
                textrule.setModel(this.oDataModel);

                var oExprLangPack = Utils.createAstExpressionLanguageWithData({
                    vocaId: 'f14b8d5cc05d4a13bd5a451db6149b3a'
                });
                
                
                // textrule.setAstExpressionLanguage(oExprLangPack.expressionLanguage);
                // textrule.setBindingContextPath(sRulePath);

                this.oVocabularyModel = new sap.ui.model.odata.v2.ODataModel("/rules-service/vocabulary_srv/", oConfig);
                var that = this;

                //Set context's path on the decison table
                var sVocabularyPath = "/Vocabularies('f14b8d5cc05d4a13bd5a451db6149b3a')";
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