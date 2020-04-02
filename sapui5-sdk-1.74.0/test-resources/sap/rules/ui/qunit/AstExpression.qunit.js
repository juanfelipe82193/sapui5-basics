sap.ui.require(['jquery.sap.global', 'sap/rules/ui/services/AstExpressionLanguage'],
	function (jQuery, AstExpressionLanguage) {
		'use strict';

		var _oExpressionLanguage = new AstExpressionLanguage();

		QUnit.test("AST: Arithmetic Expression", function (assert) {
			var inputString = "1 + 2 = 3";
			getAndValidateRelExpressionFromAST(inputString);

			var inputString = "1 * 2 = 2";
			getAndValidateRelExpressionFromAST(inputString);

			var inputString = "2 = 2";
			getAndValidateRelExpressionFromAST(inputString);

			var inputString = "1 / 2 = 0";
			getAndValidateRelExpressionFromAST(inputString);

			var inputString = "1 * 2 + 3 = 2";
			getAndValidateRelExpressionFromAST(inputString);

			var inputString = "10 * 20 + 100 + 200 / 100 = 800";
			getAndValidateRelExpressionFromAST(inputString);

			var inputString = "( ( 1 + 2 ) + ( 3 * 8 ) + 4 / 2 + ( 9 / 3 ) ) = 200";
			getAndValidateRelExpressionFromAST(inputString);

			var inputString = "1 - 2 + 3 = 6";
			getAndValidateRelExpressionFromAST(inputString);

			var inputString = "1 * 2 - 4 = 2";
			getAndValidateRelExpressionFromAST(inputString);

			var inputString = "1 + 2 - 8 = 2";
			getAndValidateRelExpressionFromAST(inputString);

		});

		/*QUnit.test("AST: Boolean Expression", function (assert) {
			var inputString = "TRUE = FALSE";
			getAndValidateRelExpressionFromAST(inputString);
		});
		
		QUnit.test("AST: String Expression", function (assert) {
			var inputString = "abc";
			getAndValidateRelExpressionFromAST(inputString);
		});*/

		function getAndValidateRelExpressionFromAST(inputString) {
			var astNodesString = _oExpressionLanguage.getAstNodesString(inputString);
			var expression = _oExpressionLanguage.getRelStringForGivenAstString(astNodesString);
			var relString = expression.relString;

			assert.deepEqual(relString,inputString,inputString);
			validateTokens(relString);
		};

		function validateTokens(relString) {
			var tokens = _oExpressionLanguage.getTokensForGivenStringInput(relString);
			var receivedTokens = false;
			if (tokens.length > 0) {
				receivedTokens = true;
			}
			assert.deepEqual(true, receivedTokens, "validating tokens for : " + relString);
		}

	});
