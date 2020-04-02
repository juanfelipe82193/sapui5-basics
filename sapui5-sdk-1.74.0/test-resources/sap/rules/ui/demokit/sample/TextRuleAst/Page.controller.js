sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/odata/v2/ODataModel',
    'sap/rules/ui/services/AstExpressionLanguage',
    'sap/ui/core/util/MockServer',
    'sap/m/MessageToast',
    'sap/ui/Device'
], function (Controller, ODataModel, AstExpressionLanguage, MockServer, MessageToast, Device) {
    "use strict";

    return Controller.extend("sap.rules.ui.sample.TextRuleAst.Page", {

        /**
         * This sample uses the sap.ui.core.uti.MockServer. The RuleBuilder control is meant to be used
         * with the Vocabulary OData service and the Rules OData service.
         * Hence, when using th eproper OData services the mockServer code should be removed.
         */
        onInit: function () {

            sap.ui.getCore().applyTheme("sap_fiori_3");

            // apply compact density for desktop, the cozy design otherwise
            this.getView().addStyleClass(Device.system.desktop ? "sapUiSizeCompact" : "sapUiSizeCozy");

            var mPath = sap.ui.require.toUrl('sap/rules/ui/sample/TextRuleAst/');

            // Initialiaze Expression Language services
            this.oVocabularyMockServer = new MockServer({rootUri: "/rule-service/vocabulary_srv/"});
            this.oVocabularyMockServer.simulate(
                mPath + "localService/vocabulary/mockdata/metadata.xml",
                {'sMockdataBaseUrl': mPath + "localService/vocabulary/mockdata/"}
            );
            this.oVocabularyMockServer.start();
            this.oVocabularyModel = new ODataModel("/rule-service/vocabulary_srv/");
            this.oExpressionLanguage = new AstExpressionLanguage();
            this.oExpressionLanguage.setBindingContextPath("/Vocabularies('FA163E38C6481EE785F409DCAD583D43')");
            this.oExpressionLanguage.setModel(this.oVocabularyModel);

            // Initialiaze the Rule Builder
           

            this.oRuleMockServer = new MockServer({rootUri: "/rule-service/rule_srv/"});
            this.oRuleMockServer.simulate(
                mPath + "localService/rule/mockdata/metadata.xml",
                {'sMockdataBaseUrl': mPath + "localService/rule/mockdata/"}
            );
            var aRequests = this.loadRequests(mPath);
            this.oRuleMockServer.setRequests(aRequests);


            this.oRuleMockServer.start();
            this.oRuleModel = new ODataModel({
                serviceUrl: "/rule-service/rule_srv/"
               // defaultBindingMode: sap.ui.model.BindingMode.TwoWay
            });

            var oRuleBuilder = this.byId("ruleBuilder");
            oRuleBuilder.setModel(this.oRuleModel);
            oRuleBuilder.setAstExpressionLanguage(this.oExpressionLanguage);
            oRuleBuilder.setBindingContextPath("/Projects(Id='0050569181751ED6B1B98FAC9D6DBBE4',Version='000001')/Rules(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001')");
        },

        handleEditButton: function () {
            var oEditButton = this.byId("editButton");
            var oRuleBuilder = this.byId("ruleBuilder");
            var bEdit = (oEditButton.getText() === "Edit");
            oRuleBuilder.setEditable(bEdit);
            oEditButton.setText(bEdit ? "Display" : "Edit");
        },

        onAfterRendering: function () {
            /**
             * Line actions are not supported in this demo as they require a functioning Rules oData service
             * This function overwites the line actions event handlers.
             * Please do not use this code when using proper OData services.
             */
            var oRuleBuilder = this.byId("ruleBuilder");
            var oTextRule = oRuleBuilder.getAggregation("_rule");
            oTextRule.setEnableSettings(false);
        },
        
        loadJSON: function(mPath, callback) {
            var xobj = new XMLHttpRequest();
            xobj.open('GET', mPath + "localService/rule/mockdata/responses.json", true);
            xobj.onreadystatechange = function() {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    callback(JSON.parse(xobj.responseText));
                }
            };
            xobj.send(null);
        },

        loadRequests: function (mPath) {
         
            // The mock server does not support 1 to 1 navigation.
            // Hence we provide the responses directly by adding custom requests to the MockServer
            var oRresponses = {};
            var getData = function(json) {
                oRresponses = json;
            };

            this.loadJSON(mPath, getData);
            
            var aRequests = this.oRuleMockServer.getRequests();
            var sMethod = "GET";
            var sPath = /Projects\(Id='0050569181751ED6B1B98FAC9D6DBBE4',Version='000001'\)\/Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\/TextRule\/TextRuleConditions\/\$count/;
            var fnResponse1 = function (xhr) {
                xhr.respond(200, {
                    "Content-Type": "text/plain;charset=utf-8"
                }, "3");
            };
            aRequests.push({method: sMethod, path: sPath, response: fnResponse1});
    
            sPath = /Projects\(Id='0050569181751ED6B1B98FAC9D6DBBE4',Version='000001'\)\/Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\?\$expand=TextRule/;
            var fnResponse2 = function (xhr) {
                xhr.respondJSON(200, {
                    "Content-Type": "application/json;charset=utf-8"
                }, oRresponses.response_7);
            };
            aRequests.push({method: sMethod, path: sPath, response: fnResponse2});
            
            sPath = /Projects\(Id='0050569181751ED6B1B98FAC9D6DBBE4',Version='000001'\)\/Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\/TextRule\/TextRuleResults\/\$count/;
            var fnResponse3 = function (xhr) {
                xhr.respond(200, {
                    "Content-Type": "text/plain;charset=utf-8"
                }, "2");
            };
            aRequests.push({method: sMethod, path: sPath, response: fnResponse3});
    
            sPath = /Projects\(Id='0050569181751ED6B1B98FAC9D6DBBE4',Version='000001'\)\/Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\/TextRule\/TextRuleResults\?\$expand=TextRuleResultASTs/;
            var fnResponse4 = function (xhr) {
                xhr.respondJSON(200, {
                    "Content-Type": "application/json;charset=utf-8"
                }, oRresponses.response_3);
            };
            aRequests.push({method: sMethod, path: sPath, response: fnResponse4});
    
            sPath = /Projects\(Id='0050569181751ED6B1B98FAC9D6DBBE4',Version='000001'\)\/Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\/TextRule\/TextRuleConditions\?\$expand=TextRuleResultExpressions%2FTextRuleResultExpressionASTs%2CTextRuleConditionASTs/;
            var fnResponse5 = function (xhr) {
                xhr.respondJSON(200, {
                    "Content-Type": "application/json;charset=utf-8"
                }, oRresponses.response_2);
            };
            aRequests.push({method: sMethod, path: sPath, response: fnResponse5});
            
            sPath = /Projects\(Id='0050569181751ED6B1B98FAC9D6DBBE4',Version='000001'\)\/Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\/TextRule\/TextRuleConditions\(RuleId='FA163E38C6481EE785F409DCAD583D43',RuleVersion='000001',Id='1'\)\/TextRuleResultExpressions\$count/;
            var fnResponse6 = function (xhr) {
                xhr.respond(200, {
                    "Content-Type": "text/plain;charset=utf-8"
                }, "2");
            };
            aRequests.push({method: sMethod, path: sPath, response: fnResponse6});
            
            sPath = /Projects\(Id='0050569181751ED6B1B98FAC9D6DBBE4',Version='000001'\)\/Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\/TextRule\/TextRuleConditions\(RuleId='FA163E38C6481EE785F409DCAD583D43',RuleVersion='000001',Id='1'\)\/TextRuleResultExpressions\?\$skip=0&\$top=100/;
            var fnResponse7 = function (xhr) {
                 xhr.respondJSON(200, {
                    "Content-Type": "application/json;charset=utf-8"
                }, oRresponses.response_8);
            };
            aRequests.push({method: sMethod, path: sPath, response: fnResponse7});
            
            sPath = /Projects\(Id='0050569181751ED6B1B98FAC9D6DBBE4',Version='000001'\)\/Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\/TextRule\/TextRuleConditions\(RuleId='FA163E38C6481EE785F409DCAD583D43',RuleVersion='000001',Id='2'\)\/TextRuleResultExpressions\$count/;
            var fnResponse8 = function (xhr) {
                xhr.respond(200, {
                    "Content-Type": "text/plain;charset=utf-8"
                }, "2");
            };
            aRequests.push({method: sMethod, path: sPath, response: fnResponse8});
            
            sPath = /Projects\(Id='0050569181751ED6B1B98FAC9D6DBBE4',Version='000001'\)\/Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)\/TextRule\/TextRuleConditions\(RuleId='FA163E38C6481EE785F409DCAD583D43',RuleVersion='000001',Id='2'\)\/TextRuleResultExpressions\?\$skip=0&\$top=100/;
            var fnResponse9 = function (xhr) {
                 xhr.respondJSON(200, {
                    "Content-Type": "application/json;charset=utf-8"
                }, oRresponses.response_9);
            };
            aRequests.push({method: sMethod, path: sPath, response: fnResponse9});
            
            sPath = /Projects\(Id='0050569181751ED6B1B98FAC9D6DBBE4',Version='000001'\)\/Rules\(Id='FA163E38C6481EE785F409DCAD583D43',Version='000001'\)/;
            var fnResponse10 = function (xhr) {
                xhr.respondJSON(200, {
                    "Content-Type": "application/json;charset=utf-8"
                }, oRresponses.response_11);
            };
            aRequests.push({method: sMethod, path: sPath, response: fnResponse10});
    
            return aRequests;
          }


    });
});
