sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
    'sap/rules/ui/services/ExpressionLanguage'
], function (jquery, Controller, JSONModel, ExpressionLanguage) {
    "use strict";
    var oVocaGaming = (function getTestData() {
        return jQuery.sap.sjax({
            url: '../../qunit/data/parser/vocabulary/gaming.txt',
            dataType: "json"
        }).data;
    })();
    return Controller.extend("ExpressionAdvanced.view.ExpressionAdvanced", {
        onInit: function () {
            var oExpressionLanguage = new ExpressionLanguage();

            oExpressionLanguage.setData(oVocaGaming);
            this.byId("myExpressionAdvanced").setExpressionLanguage(oExpressionLanguage);
            
        }
    });
});