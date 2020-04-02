sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/rules/ui/services/AstExpressionLanguage'
], function (jquery, Controller, JSONModel, AstExpressionLanguage) {
	"use strict";
	var oVocabulary = (function getTestData() {
		return jQuery.sap.sjax({
			url: '../../qunit/data/ast/vocabularyData.json',
			dataType: "json"
		}).data;
	})();
	return Controller.extend("AstExpressionBasic.view.AstExpressionBasic", {
		onInit: function () {
			var oAstExpressionLanguage = new AstExpressionLanguage();

			oAstExpressionLanguage.setData(oVocabulary);
			this.byId("myAstExpressionBasic").setAstExpressionLanguage(oAstExpressionLanguage);

		}
	});
});