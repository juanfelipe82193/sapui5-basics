sap.ui.require(['jquery.sap.global',
		'sap/rules/ui/AstExpressionBasic',
		'sap/rules/ui/services/AstExpressionLanguage'
	],

	function (jQuery, AstExpressionBasic, AstExpressionLanguage) {
		'use strict';

		var vocabularyData = (function getVocabularyData() {
			return jQuery.sap.sjax({
				url: '../../data/ast/vocabularyData.json',
				dataType: "json"
			}).data;
		})();

		var _oExpressionLanguage = new AstExpressionLanguage();
		_oExpressionLanguage.init();
		_oExpressionLanguage.setData(vocabularyData);

		var _oExpressionBasic = new AstExpressionBasic({
			astExpressionLanguage: _oExpressionLanguage
		});
		_oExpressionBasic._oAstExpressionLanguage = _oExpressionLanguage;
		
		var getTokens = function (inputString) {
			var tokenStream = _oExpressionLanguage.getTokensForGivenStringInput(inputString);
			var tokens = _oExpressionLanguage.convertTokensToUiModelForAutoSuggestion(tokenStream);
			return tokens;
		};
		QUnit.test("Test for AVG", function (assert) {

			var inputString =
				"AVG(FILTER(/9e1095dfbb4f4b919f5f24cc459a9687,./0260cede0922498e86f9ed0f518c4e38 = 'A' ),./0260cede0922498e86f9ed0f518c4e38,./0260cede0922498e86f9ed0f518c4e38)";
			var jsonData =
				"[{\"function\":\"AVG\",\"vocabulary\":\"/9e1095dfbb4f4b919f5f24cc459a9687/0260cede0922498e86f9ed0f518c4e38\",\"filter\":\"./0260cede0922498e86f9ed0f518c4e38 = 'A' \",\"groupBy\":[\"./0260cede0922498e86f9ed0f518c4e38\"],\"functionLabel\":\"AVG(/9e1095dfbb4f4b919f5f24cc459a9687)\",\"dataObject\":\"/9e1095dfbb4f4b919f5f24cc459a9687\"}]";
			var jsonArray = JSON.parse(jsonData);
			var tokens = getTokens(inputString);
			var uimodel = _oExpressionLanguage.convertTokensToUiModel(tokens, jsonArray);
			var relString = _oExpressionBasic._constructExpandedRelString(jsonArray[0]);
			assert.equal(relString, inputString, "Given input String must be equal to relString");
			assert.equal(uimodel[0].json.expandedText, inputString, "Given input String must be equal to expandedText");
			assert.equal(uimodel[0].json.functionLabel, "AVG(/9e1095dfbb4f4b919f5f24cc459a9687)", "Check for Function Label");
			assert.equal(uimodel[0].text, "AVG(/9e1095dfbb4f4b919f5f24cc459a9687)", "Check for Text");

		});

		QUnit.test("Test for COUNT", function (assert) {

			var inputString =
				"COUNT(FILTER(/9e1095dfbb4f4b919f5f24cc459a9687,./0260cede0922498e86f9ed0f518c4e38 =  'A' ),./0260cede0922498e86f9ed0f518c4e38)";
			var jsonData =
				"[{\"function\":\"COUNT\",\"vocabulary\":\"/9e1095dfbb4f4b919f5f24cc459a9687\",\"filter\":\"./0260cede0922498e86f9ed0f518c4e38 =  'A' \",\"groupBy\":[\"./0260cede0922498e86f9ed0f518c4e38\"],\"functionLabel\":\"COUNT(/9e1095dfbb4f4b919f5f24cc459a9687)\",\"dataObject\":\"/9e1095dfbb4f4b919f5f24cc459a9687\"}]";
			var jsonArray = JSON.parse(jsonData);
			var tokens = getTokens(inputString);
			var uimodel = _oExpressionLanguage.convertTokensToUiModel(tokens, jsonArray);
			var relString = _oExpressionBasic._constructExpandedRelString(jsonArray[0]);
			assert.equal(relString, inputString, "Given input String must be equal to relString");
			assert.equal(uimodel[0].json.expandedText, inputString, "Given input String must be equal to expandedText");
			assert.equal(uimodel[0].json.functionLabel, "COUNT(/9e1095dfbb4f4b919f5f24cc459a9687)", "Check for Function Label");
			assert.equal(uimodel[0].text, "COUNT(/9e1095dfbb4f4b919f5f24cc459a9687)", "Check for Text");

		});

		QUnit.test("Test for COUNTDISTINCT", function (assert) {

			var inputString =
				"COUNTDISTINCT(FILTER(/9e1095dfbb4f4b919f5f24cc459a9687,./0260cede0922498e86f9ed0f518c4e38 = 'A' ),./0260cede0922498e86f9ed0f518c4e38)";
			var jsonData =
				"[{\"function\":\"COUNTDISTINCT\",\"vocabulary\":\"/9e1095dfbb4f4b919f5f24cc459a9687/0260cede0922498e86f9ed0f518c4e38\",\"filter\":\"./0260cede0922498e86f9ed0f518c4e38 = 'A' \",\"groupBy\":[],\"functionLabel\":\"COUNTDISTINCT(/9e1095dfbb4f4b919f5f24cc459a9687)\",\"dataObject\":\"/9e1095dfbb4f4b919f5f24cc459a9687\"}]";
			var jsonArray = JSON.parse(jsonData);
			var tokens = getTokens(inputString);
			var uimodel = _oExpressionLanguage.convertTokensToUiModel(tokens, jsonArray);
			var relString = _oExpressionBasic._constructExpandedRelString(jsonArray[0]);
			assert.equal(relString, inputString, "Given input String must be equal to relString");
			assert.equal(uimodel[0].json.expandedText, inputString, "Given input String must be equal to expandedText");
			assert.equal(uimodel[0].json.functionLabel, "COUNTDISTINCT(/9e1095dfbb4f4b919f5f24cc459a9687)", "Check for Function Label");
			assert.equal(uimodel[0].text, "COUNTDISTINCT(/9e1095dfbb4f4b919f5f24cc459a9687)", "Check for Text");

		});
	});