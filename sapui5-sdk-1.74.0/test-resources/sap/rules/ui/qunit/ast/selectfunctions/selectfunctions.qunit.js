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

		var getTokens = function (inputString) {
			var tokenStream = _oExpressionLanguage.getTokensForGivenStringInput(inputString);
			var tokens = _oExpressionLanguage.convertTokensToUiModelForAutoSuggestion(tokenStream);
			return tokens;
		};
		QUnit.test("Test for TOP", function (assert) {

			var inputString =
				"TOP(SELECT(FILTER(/9e1095dfbb4f4b919f5f24cc459a9687,./b7401f5704d44368ad61b0e9ca76fbbd = '25' ),./0260cede0922498e86f9ed0f518c4e38),2)";
			var jsonData =
				"[{\"function\":\"TOP\",\"filter\":\"./b7401f5704d44368ad61b0e9ca76fbbd = '25' \",\"functionLabel\":\"TOP(/9e1095dfbb4f4b919f5f24cc459a9687,2)\",\"dataObject\":\"/9e1095dfbb4f4b919f5f24cc459a9687\",\"attributes\":{\"./0260cede0922498e86f9ed0f518c4e38\":\"NOSORT\"},\"count\":\"2\"}]";
			var jsonArray = JSON.parse(jsonData);
			var tokens = getTokens(inputString);
			var uimodel = _oExpressionLanguage.convertTokensToUiModel(tokens, jsonArray);
			var relString = _oExpressionBasic._constructExpandedRelString(jsonArray[0]);
			assert.equal(relString, inputString, "Given input String must be equal to relString");
			assert.equal(uimodel[0].json.expandedText, inputString, "Given input String must be equal to expandedText");
			assert.equal(uimodel[0].json.functionLabel, "TOP(/9e1095dfbb4f4b919f5f24cc459a9687,2)", "Check for Function Label");
			assert.equal(uimodel[0].text, "TOP(/9e1095dfbb4f4b919f5f24cc459a9687,2)", "Check for Text");

		});

		QUnit.test("Test for SELECT", function (assert) {

			var inputString =
				"SELECT(FILTER(/9e1095dfbb4f4b919f5f24cc459a9687,./0260cede0922498e86f9ed0f518c4e38 = 'A' ),./0260cede0922498e86f9ed0f518c4e38)";
			var jsonData =
				"[{\"function\":\"SELECT\",\"filter\":\"./0260cede0922498e86f9ed0f518c4e38 = 'A' \",\"functionLabel\":\"SELECT(/9e1095dfbb4f4b919f5f24cc459a9687)\",\"dataObject\":\"/9e1095dfbb4f4b919f5f24cc459a9687\",\"attributes\":{\"./0260cede0922498e86f9ed0f518c4e38\":\"NOSORT\"}}]";
			var jsonArray = JSON.parse(jsonData);
			var tokens = getTokens(inputString);
			var uimodel = _oExpressionLanguage.convertTokensToUiModel(tokens, jsonArray);
			var relString = _oExpressionBasic._constructExpandedRelString(jsonArray[0]);
			assert.equal(relString, inputString, "Given input String must be equal to relString");
			assert.equal(uimodel[0].json.expandedText, inputString, "Given input String must be equal to expandedText");
			assert.equal(uimodel[0].json.functionLabel, "SELECT(/9e1095dfbb4f4b919f5f24cc459a9687)", "Check for Function Label");
			assert.equal(uimodel[0].text, "SELECT(/9e1095dfbb4f4b919f5f24cc459a9687)", "Check for Text");

		});
	});