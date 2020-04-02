sap.ui.require(['jquery.sap.global',
		'sap/rules/ui/ast/builder/OperatorBuilder',
		'sap/rules/ui/ast/provider/OperatorProvider',
		'sap/rules/ui/services/AstExpressionLanguage',
		'sap/rules/ui/ast/autoComplete/dataStructure/Stack',
		'sap/rules/ui/ast/builder/FunctionBuilder',
		'sap/rules/ui/ast/provider/FunctionProvider',
		'sap/rules/ui/ast/builder/TermsBuilder',
		'sap/rules/ui/ast/provider/TermsProvider',
		'sap/rules/ui/ast/autoComplete/dataStructure/FunctionalStack',
		'sap/rules/ui/ast/autoComplete/node/TermNode'
	],
	function (jQuery, OperatorBuilder, OperatorProvider, AstExpressionLanguage, Stack, FunctionBuilder, FunctionProvider, TermsBuilder,
		TermsProvider, FunctionalStack, TermNode) {
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

		var getTokens = function (inputString) {
			var tokenStream = _oExpressionLanguage.getTokensForGivenStringInput(inputString);
			var tokens = _oExpressionLanguage.convertTokensToUiModelForAutoSuggestion(tokenStream);
			return tokens;
		};

		var getNodeRecursively = function (node) {
			while ("getTop" in node) {
				node = node.getTop();
			}
			return node;
		};

		/*OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
		FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
		TermsBuilder.getInstance().construct(vocabularyData);*/

		QUnit.test("Autocomplete Literal simple expressions", function (assert) {
			var autoCompleteStack = new Stack();

			var tokens;
			var inputString = "1 +";

			tokens = getTokens(inputString);
			var iterator = 0;
			for (iterator = 0; iterator < tokens.length; iterator++) {
				autoCompleteStack.push.call(autoCompleteStack, (tokens[iterator]));
			}
			assert.equal(2, autoCompleteStack.getSize(),
				"1 + - two nodes has to be added to the stack");

			inputString = "1 + 2 ";

			tokens = getTokens(inputString);

			autoCompleteStack.empty();
			for (iterator = 0; iterator < tokens.length; iterator++) {
				autoCompleteStack.push.call(autoCompleteStack, (tokens[iterator]));
			}

			assert.equal(1, autoCompleteStack.getSize(),
				"1 + 2 - one node has to be added to the stack");

			inputString = "1 + 2 /";

			tokens = getTokens(inputString);

			autoCompleteStack.empty();
			for (iterator = 0; iterator < tokens.length; iterator++) {
				autoCompleteStack.push.call(autoCompleteStack, (tokens[iterator]));
			}

			assert.equal(2, autoCompleteStack.getSize(),
				"1 + 2 / - Only one node has to be present in the stack");

			inputString = "1 + 2 / 3 - 7 - 8";

			tokens = getTokens(inputString);

			autoCompleteStack.empty();
			for (iterator = 0; iterator < tokens.length; iterator++) {
				autoCompleteStack.push.call(autoCompleteStack, (tokens[iterator]));
			}

			assert.equal(1, autoCompleteStack.getSize(),
				"1 + 2 / 3 - 7 - 8 - Only one node has to be present in the stack");

			inputString = "(1 + 2) / (3 - 7 - 8)";

			tokens = getTokens(inputString);

			autoCompleteStack.empty();
			for (iterator = 0; iterator < tokens.length; iterator++) {
				autoCompleteStack.push.call(autoCompleteStack, (tokens[iterator]));
			}

			assert.equal(1, autoCompleteStack.getSize(),
				"(1 + 2) / (3 - 7 - 8) - Only one node has to be present in the stack");

			inputString = "(1 + 2) / ('raghu')";

			tokens = getTokens(inputString);

			autoCompleteStack.empty();
			var oResult;
			for (iterator = 0; iterator < tokens.length; iterator++) {
				oResult = autoCompleteStack.push.call(autoCompleteStack, (tokens[iterator]));
				if (oResult.bTokenPushed == false) {
					break;
				}
			}

			assert.equal(1, oResult.errorCode,
				"(1 + 2) / ('raghu') - Expected Number DataType but got String");

			inputString = "1 ";
			tokens = getTokens(inputString);

			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			assert.equal(4, suggestions.autoComplete.categories["operators"]["arithmetic"].length,
				"'1 ' -  has four arithemetic operator suggestions");
			assert.equal(6, suggestions.autoComplete.categories["operators"]["comparision"].length,
				"'1 ' -  has six comparision operator suggestions");

			inputString = "'raghu' ";
			tokens = getTokens(inputString);

			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			assert.equal(1, suggestions.autoComplete.categories["operators"]["arithmetic"].length, "'raghu' has only one opertor suggestion");
			assert.equal("+", suggestions.autoComplete.categories["operators"]["arithmetic"][0].name,
				"'raghu' only addition operator is supported ");
			assert.equal(6, suggestions.autoComplete.categories["operators"]["comparision"].length,
				"'raghu' six comparision operators support ");

			inputString = "(1 + 3) + 'raghu' ";

			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			assert.equal(1, suggestions.autoComplete.categories["operators"]["arithmetic"].length,
				"(1 + 3) + 'raghu' has only one opertor suggestion");
			assert.equal("+", suggestions.autoComplete.categories["operators"]["arithmetic"][0].name,
				"(1 + 3) + 'raghu' only addition(arithemetic) operator is supported ");
			assert.equal(6, suggestions.autoComplete.categories["operators"]["comparision"].length,
				"(1 + 3) + 'raghu' has six comparision suggestion");

			inputString = "(1 + 3) + 6 ";
			tokens = getTokens(inputString);

			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			assert.equal(4, suggestions.autoComplete.categories["operators"]["arithmetic"].length,
				"'(1 + 3) + 6' -  has four arthemetic operator suggestions");
			assert.equal(6, suggestions.autoComplete.categories["operators"]["comparision"].length,
				"'(1 + 3) + 6' -  has six comparision operator suggestions");

		});

		QUnit.test("Autocomplete Opertaor expressions", function (assert) {
			var autoCompleteStack = new Stack();
			var tokens;
			var inputString = "./1af007c980e04b55b453dfddcf2cff62/7ea2962a34da48e2b029671afb4add6e + 3 / 5";
			tokens = getTokens(inputString);
			var oResult;
			var iterator;
			autoCompleteStack.empty();
			for (iterator = 0; iterator < tokens.length; iterator++) {
				autoCompleteStack.push.call(autoCompleteStack, (tokens[iterator]));
			}

			inputString = "./1af007c980e04b55b453dfddcf2cff62/7ea2962a34da48e2b029671afb4add6e + ./1af007c980e04b55b453dfddcf2cff62";
			tokens = getTokens(inputString);
			autoCompleteStack.empty();
			for (iterator = 0; iterator < tokens.length; iterator++) {
				oResult = autoCompleteStack.push.call(autoCompleteStack, (tokens[iterator]));
				if (oResult.bTokenPushed == false) {
					break;
				}
			}

			assert.equal(1, oResult.errorCode,
				"DISCOUNT_TABLE_HDI.DISCOUNT_VALUE + DISCOUNT_TABLE_HDI - Expected Attribute but got dataobject");

			inputString = "./1af007c980e04b55b453dfddcf2cff62/7ea2962a34da48e2b029671afb4add6e - 'raghu'";
			tokens = getTokens(inputString);
			autoCompleteStack.empty();
			for (iterator = 0; iterator < tokens.length; iterator++) {
				oResult = autoCompleteStack.push.call(autoCompleteStack, (tokens[iterator]));
				if (oResult.bTokenPushed == false) {
					break;
				}
			}

			assert.equal(1, oResult.errorCode,
				"DISCOUNT_TABLE_HDI.DISCOUNT_VALUE - 'raghu' - Expected Number DataType but got String");
		});

		QUnit.test("Autocomplete Functional expressions", function (assert) {
			var autoCompleteStack = new Stack();
			var tokens;
			var inputString =
				"AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e,/7ea2962a34da48e2b029671afb4add6e)";
			tokens = getTokens(inputString);
			var iterator;
			autoCompleteStack.empty();
			for (iterator = 0; iterator < tokens.length; iterator++) {
				autoCompleteStack.push.call(autoCompleteStack, (tokens[iterator]));
			}

			assert.equal(1, autoCompleteStack.getSize(),
				"AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE)- Autocomplete size should be one");

			var node = getNodeRecursively(autoCompleteStack.getTop());
			assert.equal(true, node instanceof TermNode,
				"AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE) should return node");
			assert.equal("T", node.getDataObjectType(),
				"AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE) should return element dataobject type"
			);

			inputString = "AVG(./1af007c980e04b55b453dfddcf2cff62,/7ea2962a34da48e2b029671afb4add6e)";
			tokens = getTokens(inputString);
			autoCompleteStack.empty();

			for (iterator = 0; iterator < tokens.length; iterator++) {
				autoCompleteStack.push.call(autoCompleteStack, (tokens[iterator]));
			}

			node = getNodeRecursively(autoCompleteStack.getTop());
			assert.equal(1, autoCompleteStack.getSize(),
				"AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE)- Autocomplete size should be one");

			assert.equal("E", node.getDataObjectType(),
				"AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE) should return Table dataobject type"
			);

			assert.equal("N", node.getBusinessDataType(),
				"AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE) should return null businessDataType"
			);

			inputString =
				"AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e, /7ea2962a34da48e2b029671afb4add6e) ";
			tokens = getTokens(inputString);

			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			assert.equal(0, suggestions.autoComplete.categories["operators"]["arithmetic"].length,
				"'AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE)' -  has four operator suggestions"
			);

			inputString =
				"AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 'raghu' ";
			tokens = getTokens(inputString);

			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			assert.equal(1, suggestions.autoComplete.categories["operators"]["arithmetic"].length,
				"'AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE) + 'raghu' ' -  has one arithmetic operator suggestions"
			);
			assert.equal("+", suggestions.autoComplete.categories["operators"]["arithmetic"][0].name,
				"'AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE) + 'raghu' ' -  should return only addition arithmetic opertor"
			);

			inputString = "AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) ";
			tokens = getTokens(inputString);

			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			assert.equal(4, suggestions.autoComplete.categories["operators"]["arithmetic"].length,
				"'AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE) ' -  one opertor suggestions"
			);

			inputString =
				"AVG(AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e, /7ea2962a34da48e2b029671afb4add6e), /7ea2962a34da48e2b029671afb4add6e, /7ea2962a34da48e2b029671afb4add6e) ";
			tokens = getTokens(inputString);

			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			assert.equal(0, suggestions.autoComplete.categories["operators"]["arithmetic"].length,
				"'AVG(AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE), DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE)'" +
				" -  four arithmetic operator suggestions should be available"
			);

			inputString =
				"AVG(AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 3  ";
			tokens = getTokens(inputString);

			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			assert.equal(4, suggestions.autoComplete.categories.operators.arithmetic.length,
				"'AVG(AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE)," +
				"DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE)  + 3'" +
				" -  zero arithmetic operator suggestions should be available"
			);

			inputString =
				"AVG(AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e)," +
				"/7ea2962a34da48e2b029671afb4add6e) + AVG(AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e)," +
				"/7ea2962a34da48e2b029671afb4add6e) + 'raghu'  ";
			tokens = getTokens(inputString);

			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			assert.equal("+", suggestions.autoComplete.categories["operators"]["arithmetic"][0].name,
				"'AVG(AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE)," +
				"DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE) + AVG(AVG(DISCOUNT_TABLE_HDI, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE)," +
				"DISCOUNT_TABLE_HDI.DISCOUNT_VALUE, DISCOUNT_TABLE_HDI.DISCOUNT_VALUE) + 'raghu''" +
				" -  One operator suggestions should be available"
			);

		});

		QUnit.test("Autocomplete Sugeestions expressions", function (assert) {
			var tokens;
			var inputString = "";
			tokens = getTokens(inputString);

			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			assert.equal(true, suggestions.autoComplete.showLiteral, "Literal should be displayed");
			inputString = "3 + ";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			assert.equal(true, suggestions.autoComplete.showLiteral, "Literal should be displayed");

			inputString = "3 + ./40ff80b379e64fc1a6e2cc2357f2b9e9";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			assert.equal(false, suggestions.autoComplete.showLiteral, "Literal should not be displayed");
			var termString = "";
			var terms = suggestions.autoComplete.categories.terms;
			var iterator = 0;
			for (iterator = 0; iterator < terms.length; iterator++) {
				termString += terms[iterator].name + "\n";
			}
			assert.equal(true, terms.length > 0, "(3 + CUSTOMER. )- Terms under Customer Should be returned" + "termString = " + termString);
			inputString = "./40ff80b379e64fc1a6e2cc2357f2b9e9/0bfbf02ed0e94082a75f8d49e9d31a71";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			terms = suggestions.autoComplete.categories.terms;
			termString = "";
			for (iterator = 0; iterator < terms.length; iterator++) {
				termString += terms[iterator].name + "\n";
			}
			assert.equal(true, terms.length > 0, "Terms under Customer Should be returned" + "termString = " + termString);

			inputString = "(1 + 2 = 3) + ./40ff80b379e64fc1a6e2cc2357f2b9e9";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			terms = suggestions.autoComplete.categories.terms;
			// termString = "";
			// for (iterator = 0; iterator < terms.length; iterator++) {
			// 	text = "CUSTOMER." + terms[iterator].name;
			// 	termString += text + "\n";
			// 	term = TermsProvider.getInstance().getTermByTermName(text);
			// 	if (term && "_bussinessDataType" in term && term._bussinessDataType && term._bussinessDataType != "S") {
			// 		hasOnlyStringSuggestions = false;
			// 	}

			// }
			assert.equal(terms.length, 0, "No Terms Should be returned");

			inputString = "(1 + 2 = 3) AND ./40ff80b379e64fc1a6e2cc2357f2b9e9";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			terms = suggestions.autoComplete.categories.terms;

			termString = "";
			for (iterator = 0; iterator < terms.length; iterator++) {
				termString += terms[iterator].name + "\n";
			}
			assert.equal(true, terms.length > 0, "Terms under Customer Should be returned" + "termString = " + termString);

			inputString = "./1af007c980e04b55b453dfddcf2cff62/7ea2962a34da48e2b029671afb4add6e = 2 "
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			assert.equal(true, suggestions.autoComplete.categories.operators.logical
				.length > 0, "Logical And and OR should be part of suggestions");

			inputString = "./1af007c980e04b55b453dfddcf2cff62/7ea2962a34da48e2b029671afb4add6e = ";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			assert.equal(true, suggestions.autoComplete.valuehelp.sourceType == 'U',
				"Value help source type for DISCOUNT_TABLE_HDI.DISCOUNT_VALUE should be true");

		});

		QUnit.test("Autocomplete Suggestions to display Operators", function (assert) {

			var tokens;
			var inputString = "COUNT(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93"; //DataType 'N'
			var iterator = 0;
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			var arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 4, "4 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+", "-", "*", "/"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Number");
			}

			var arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Number");
			}

			var comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 6, "6 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!=", ">", ">=", "<", "<="].includes(comparisionOps[iterator].name), true, "Comparision Operator " +
					comparisionOps[iterator].name + " Should be displayed for Number");
			}

			var rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed for Number");
			}

			var miscellaneousOps = suggestions.autoComplete.categories.operators.miscellaneous;
			assert.equal(miscellaneousOps.length, 2, "2 Range Operators Should be Displayed ");
			for (iterator = 0; iterator < miscellaneousOps.length; iterator++) {
				assert.equal([")", ","].includes(miscellaneousOps[iterator].name), true, "Miscellaneous Operator " + miscellaneousOps[iterator].name +
					" Should be displayed for Number");
			}

			var logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 0, "0 logical Operators Should be Displayed for String");

			var functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed for String");

			inputString =
				"MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's' "; //DataType 'S'
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 1, "1 Arithmetic Operator Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for String");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for String");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 6, "6 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!=", ">", ">=", "<", "<="].includes(comparisionOps[iterator].name), true, "Comparision Operator " +
					comparisionOps[iterator].name + " Should be displayed for String");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 8, "8 functional Operators Should be Displayed");
			for (iterator = 0; iterator < functionalOps.length; iterator++) {
				assert.equal(["MATCHES", "NOTMATCHES", "CONTAINS", "NOTCONTAINS", "STARTSWITH", "NOTSTARTSWITH", "ENDSWITH", "NOTENDSWITH"].includes(
					functionalOps[iterator].name), true, "Functional Operator " + functionalOps[iterator].name + " Should be displayed for String");
			}

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 0, "0 logical Operators Should be Displayed ");

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed for String");
			}

			inputString =
				"((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' ))"; //Datatype 'B'
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			// inputString = "2Kg";  //Datatype 'Q'
			// tokens = getTokens(inputString);
			// suggestions = _oExpressionLanguage.getSuggesstions(tokens, {"AttributeContext" : false});

			// arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			// assert.equal(arithmeticops.length , 4 , "4 Arithmetic Operators Should be Displayed");
			// for(iterator = 0;iterator<arithmeticops.length;iterator++){
			// 	assert.equal(["+","-","*","/"].includes(arithmeticops[iterator].name),true, "Arithmetic Operator "+ arithmeticops[iterator].name+ " Should be displayed  for Quantity");
			// }

			// arrayops = suggestions.autoComplete.categories.operators.array;
			// assert.equal(arrayops.length, 2 , "Two Array Operators Should be Displayed");
			// for(iterator = 0;iterator<arrayops.length;iterator++){
			// 	assert.equal(["EXISTSIN","NOTEXISTSIN"].includes(arrayops[iterator].name),true, "Array Operator "+ arrayops[iterator].name+ " Should be displayed  for Quantity");
			// }

			// comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			// assert.equal(comparisionOps.length, 6 , "6 Comparision Operators Should be Displayed");
			// for(iterator = 0;iterator<comparisionOps.length;iterator++){
			// 	assert.equal(["=","!=",">",">=","<","<="].includes(comparisionOps[iterator].name),true, "Comparision Operator "+ comparisionOps[iterator].name+ " Should be displayed for Quantity");
			// }

			// functionalOps = suggestions.autoComplete.categories.operators.functional;
			// assert.equal(functionalOps.length, 0 , "0 functional Operators Should be Displayed");

			// logicalOps = suggestions.autoComplete.categories.operators.logical;
			// assert.equal(logicalOps.length, 0 , "0 logical Operators Should be Displayed");

			// rangeOps = suggestions.autoComplete.categories.operators.range;
			// assert.equal(rangeOps.length, 2 , "2 Range Operators Should be Displayed");
			// for(iterator = 0;iterator<rangeOps.length;iterator++){
			// 	assert.equal(["IN","NOTIN"].includes(rangeOps[iterator].name),true, "Range Operator "+ rangeOps[iterator].name+ " Should be displayed");
			// }

			inputString = "./bc71a15545674c69a4827b9947098e0b/4466d6d47d6b4797839c03c1d3440bf9"; //DataType 'D'
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 2, "2 Arithmetic Operators Should be Displayed for Date");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+", "-"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Date");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 6, "6 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!=", ">", ">=", "<", "<="].includes(comparisionOps[iterator].name), true, "Comparision Operator " +
					comparisionOps[iterator].name + " Should be displayed");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "0 logical Operators Should be Displayed");

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed");
			}

			inputString = "'15:53:00'"; //DataType 'T'
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 2, "2 Arithmetic Operators Should be Displayed for TimeStamp");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+", "-"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 6, "6 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!=", ">", ">=", "<", "<="].includes(comparisionOps[iterator].name), true, "Comparision Operator " +
					comparisionOps[iterator].name + " Should be displayed");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "0 logical Operators Should be Displayed");

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed");
			}

		});

		QUnit.test("Autocomplete Suggestions for Add", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) ) + ./9e1095dfbb4f4b919f5f24cc459a9687"; // N + (S, N)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 5, "5 Terms CARRID , CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");

			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CARRID", "CLASS", "CUSTOMID", "BOOKID", "CONNID"].includes(attributes[iterator].name), true, "Term " + attributes[
					iterator].name + " Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687"; //S + (S,N,D,T,Q,A)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7  Terms CARRID , CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, ORDER_DATE Should be displayed ");

			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CARRID", "CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString = "./9e1095dfbb4f4b919f5f24cc459a9687/18b1568b83794d84b3ef093cf43b742a + ./9e1095dfbb4f4b919f5f24cc459a9687"; //D + (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 4, "4 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");

			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "'15:02:02' + ./9e1095dfbb4f4b919f5f24cc459a9687"; // T + (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 4, "4 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");

			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

		});

		QUnit.test("Autocomplete Suggestions for Subtract", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) - ./9e1095dfbb4f4b919f5f24cc459a9687"; // N - ( N)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 1, "1 Terms CARRID  Should be displayed ");

			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 -  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S - (Nothing)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms  Should be displayed ");

		});

		QUnit.test("Autocomplete Suggestions for Multiply", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) * ./9e1095dfbb4f4b919f5f24cc459a9687"; // N * ( N)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 1, "1 Terms CARRID  Should be displayed ");

			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 *  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S * (Nothing)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms  Should be displayed ");

		});

		QUnit.test("Autocomplete Suggestions for Divide", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) / ./9e1095dfbb4f4b919f5f24cc459a9687"; // N * ( N)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 1, "1 Terms CARRID  Should be displayed ");

			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 /  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S / (Nothing)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms  Should be displayed ");

		});

		QUnit.test("Autocomplete Suggestions for is equal", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) = ./9e1095dfbb4f4b919f5f24cc459a9687"; // N = ( All Data Types)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 =  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S = (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "./9e1095dfbb4f4b919f5f24cc459a9687/18b1568b83794d84b3ef093cf43b742a = ./9e1095dfbb4f4b919f5f24cc459a9687"; //D = (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "'15:02:02' = ./9e1095dfbb4f4b919f5f24cc459a9687"; //T = (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  Should be displayed ");

			inputString =
				"((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) = ./868863c80fb74d7f9ae8c15a96cb66d3"; //B = (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 2, "2 Terms  DiscountBool, DISCOUNT_VALUE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["DiscountBool", "DISCOUNT_VALUE"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

		});

		QUnit.test("Autocomplete Suggestions for is notequal", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) != ./9e1095dfbb4f4b919f5f24cc459a9687"; // N != ( All Data Types)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 !=  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S != (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "./9e1095dfbb4f4b919f5f24cc459a9687/18b1568b83794d84b3ef093cf43b742a != ./9e1095dfbb4f4b919f5f24cc459a9687"; //D != (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "'15:02:02' != ./9e1095dfbb4f4b919f5f24cc459a9687"; //(T) != (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  Should be displayed ");

			inputString =
				"((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) != ./868863c80fb74d7f9ae8c15a96cb66d3"; //B != (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 2, "2 Terms  DiscountBool,DISCOUNT_VALUE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["DiscountBool", "DISCOUNT_VALUE"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

		});

		QUnit.test("Autocomplete Suggestions for is greaterthan", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) > ./9e1095dfbb4f4b919f5f24cc459a9687"; // N > ( All Data Types)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 !=  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S > (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "./9e1095dfbb4f4b919f5f24cc459a9687/18b1568b83794d84b3ef093cf43b742a != ./9e1095dfbb4f4b919f5f24cc459a9687"; //D > (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "'15:02:02' != ./9e1095dfbb4f4b919f5f24cc459a9687"; //(T) > (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  Should be displayed ");

			inputString =
				"((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) > ./868863c80fb74d7f9ae8c15a96cb66d3"; //B > (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 2, "2 Terms  DiscountBool Should be displayed ");

		});

		QUnit.test("Autocomplete Suggestions for is <=", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) <= ./9e1095dfbb4f4b919f5f24cc459a9687"; // N <= ( All Data Types)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 <=  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S <= (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "./9e1095dfbb4f4b919f5f24cc459a9687/18b1568b83794d84b3ef093cf43b742a <= ./9e1095dfbb4f4b919f5f24cc459a9687"; //D <= (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "'15:02:02' <= ./9e1095dfbb4f4b919f5f24cc459a9687"; //(T) <= (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  Should be displayed ");

			inputString =
				"((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) <= ./868863c80fb74d7f9ae8c15a96cb66d3"; //B <= (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 2, "2 Terms Should be displayed ");

		});

		QUnit.test("Autocomplete Suggestions for is >=", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) >= ./9e1095dfbb4f4b919f5f24cc459a9687"; // N >= ( All Data Types)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 >=  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S >= (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "./9e1095dfbb4f4b919f5f24cc459a9687/18b1568b83794d84b3ef093cf43b742a >= ./9e1095dfbb4f4b919f5f24cc459a9687"; //D >= (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "'15:02:02' >= ./9e1095dfbb4f4b919f5f24cc459a9687"; //(T) >= (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  Should be displayed ");

			inputString =
				"((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) >= ./868863c80fb74d7f9ae8c15a96cb66d3"; //B >= (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 2, "2 Terms Should be displayed ");

		});

		QUnit.test("Autocomplete Suggestions for  is <", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) < ./9e1095dfbb4f4b919f5f24cc459a9687"; // N < ( All Data Types)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 <  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S < (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "./9e1095dfbb4f4b919f5f24cc459a9687/18b1568b83794d84b3ef093cf43b742a < ./9e1095dfbb4f4b919f5f24cc459a9687"; //D < (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, FLDATE, CARRID, ORDER_DATE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "FLDATE", "CARRID", "ORDER_DATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString = "'15:02:02' < ./9e1095dfbb4f4b919f5f24cc459a9687"; //(T) < (All Data Types)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  Should be displayed ");

			inputString =
				"((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) < ./868863c80fb74d7f9ae8c15a96cb66d3"; //B < (Nothing)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 2, "2 Terms Should be displayed ");

		});

		QUnit.test("Autocomplete Suggestions for  IN ", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) IN [5..10]"; // N IN ( N)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			var arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			var arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			var comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			var functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			var logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			var rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 IN  ['a'..'z'] "; // S IN (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString = "./9e1095dfbb4f4b919f5f24cc459a9687/18b1568b83794d84b3ef093cf43b742a IN ['2211-12-12'..'2255-12-21'] "; //D IN (D)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString = "'15:02:02' IN ['12:00:00'..'22:00:00']"; //(T) IN (T)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString =
				"((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) IN ['true'..'false'] "; //B IN (B)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

		});

		QUnit.test("Autocomplete Suggestions for  NOTIN ", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) NOTIN [5..10]"; // N IN ( N)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			var arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			var arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			var comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			var functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			var logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			var rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 NOTIN  ['a'..'z'] "; // S IN (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString = "./9e1095dfbb4f4b919f5f24cc459a9687/18b1568b83794d84b3ef093cf43b742a NOTIN ['2211-12-12'..'2255-12-21'] "; //D IN (D)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString = "'15:02:02' NOTIN ['12:00:00'..'22:00:00']"; //(T) IN (T)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString =
				"((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) NOTIN ['true'..'false'] "; //B IN (B)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

		});

		QUnit.test("Autocomplete Suggestions for  EXISTSIN ", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) EXISTSIN [5,10]"; // N EXISTSIN ( N)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			var arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			var arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			var comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			var functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			var logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			var rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 EXISTSIN  ['a','z'] "; // S EXISTSIN (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString = "./9e1095dfbb4f4b919f5f24cc459a9687/18b1568b83794d84b3ef093cf43b742a EXISTSIN ['2211-12-12','2255-12-21'] "; //D EXISTSIN (D)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString = "'15:02:02' EXISTSIN ['12:00:00','22:00:00']"; //(T) EXISTSIN (T)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString =
				"((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) EXISTSIN ['true','false'] "; //B EXISTSIN (B)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

		});

		QUnit.test("Autocomplete Suggestions for  NOTEXISTSIN ", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(./9e1095dfbb4f4b919f5f24cc459a9687, AVG(./9e1095dfbb4f4b919f5f24cc459a9687, /b7401f5704d44368ad61b0e9ca76fbbd) + 3) NOTEXISTSIN [5,10]"; // N NOTEXISTSIN ( N)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			var arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			var arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			var comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			var functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			var logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			var rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 NOTEXISTSIN  ['a','z'] "; // S NOTEXISTSIN (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString = "./9e1095dfbb4f4b919f5f24cc459a9687/18b1568b83794d84b3ef093cf43b742a NOTEXISTSIN ['2211-12-12','2255-12-21'] "; //D NOTEXISTSIN (D)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString = "'15:02:02' NOTEXISTSIN ['12:00:00','22:00:00']"; //(T) NOTEXISTSIN (T)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString =
				"((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) NOTEXISTSIN ['true','false'] "; //B NOTEXISTSIN (B)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

		});

		QUnit.test("Autocomplete Suggestions for  functional operators ", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 MATCHES  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S MATCHES (S)
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 4, "4 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 NOTMATCHES  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S NOTMATCHES (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 4, "4 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 CONTAINS  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S CONTAINS (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 4, "4 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 NOTCONTAINS  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S NOTCONTAINS (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 4, "4 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 STARTSWITH  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S STARTSWITH (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 4, "4 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 ENDSWITH  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S ENDSWITH (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 4, "4 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 NOTSTARTSWITH  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S NOTSTARTSWITH (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 4, "4 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString =
				"./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 + ./9e1095dfbb4f4b919f5f24cc459a9687/f238309662694bcaa8942010611d02f4 NOTENDSWITH  ./9e1095dfbb4f4b919f5f24cc459a9687"; // S NOTENDSWITH (S)
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 4, "4 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

		});

		QUnit.test("Autocomplete Suggestions for  AVG  ", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"AVG(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 1, "1 Terms  CARRID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"AVG(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) + ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 5, "5 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[
					iterator].name + " Should be displayed");
			}

			inputString =
				"AVG(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd)";

			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			var arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 4, "4 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+", "-", "*", "/"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Number");
			}

			var arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Number");
			}

			var comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 6, "6 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!=", ">", ">=", "<", "<="].includes(comparisionOps[iterator].name), true, "Comparision Operator " +
					comparisionOps[iterator].name + " Should be displayed for Number");
			}

			var rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed for Number");
			}

			var logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 0, "0 logical Operators Should be Displayed for String");

			var functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed for String");

			inputString = "AVG(FILTER(./9e1095dfbb4f4b919f5f24cc459a9687, ";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 7, "7 Terms  CLASS , CUSTOMID , BOOKID, CONNID, ORDER_DATE,FLDATE  Should be displayed ");

			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "CARRID", "ORDER_DATE", "FLDATE"].includes(attributes[iterator].name), true,
					"Term " + attributes[
						iterator].name + " Should be displayed");
			}

		});

		QUnit.test("Autocomplete Suggestions for  SUM  ", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"SUM(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 1, "1 Terms  CARRID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"SUM(COUNT(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) + ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 5, "5 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[
					iterator].name + " Should be displayed");
			}

			inputString =
				"SUM(COUNT(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd)";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			var arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 4, "4 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+", "-", "*", "/"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Number");
			}

			var arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Number");
			}

			var comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 6, "6 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!=", ">", ">=", "<", "<="].includes(comparisionOps[iterator].name), true, "Comparision Operator " +
					comparisionOps[iterator].name + " Should be displayed for Number");
			}

			var rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed for Number");
			}

			var logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 0, "0 logical Operators Should be Displayed for String");

			var functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed for String");

		});

		QUnit.test("Autocomplete Suggestions for  COUNT  ", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"COUNT(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd)) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 1, "1 Terms  CARRID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"COUNT(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd)) + ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 5, "5 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[
					iterator].name + " Should be displayed");
			}

			inputString =
				"COUNT(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd) + ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms Should be displayed ");

		});

		QUnit.test("Autocomplete Suggestions for  DISTINCT  ", function (assert) {

			var tokens;
			var inputString =
				"DISTINCT(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms Should be displayed ");

			inputString =
				"DISTINCT(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) + ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms Should be displayed ");

		});

		QUnit.test("Autocomplete Suggestions for  MIN  ", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"MIN(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 1, "1 Terms  CARRID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"MIN(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) + ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 5, "5 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[
					iterator].name + " Should be displayed");
			}

			inputString =
				"MIN(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd)";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			var arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 4, "4 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+", "-", "*", "/"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Number");
			}

			var arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Number");
			}

			var comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 6, "6 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!=", ">", ">=", "<", "<="].includes(comparisionOps[iterator].name), true, "Comparision Operator " +
					comparisionOps[iterator].name + " Should be displayed for Number");
			}

			var rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed for Number");
			}

			var logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 0, "0 logical Operators Should be Displayed for String");

			var functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed for String");

		});

		QUnit.test("Autocomplete Suggestions for  MAX  ", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"MAX(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 1, "1 Terms  CARRID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"MAX(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) + ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 5, "5 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[
					iterator].name + " Should be displayed");
			}

			inputString =
				"MAX(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd)";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			var arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 4, "4 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+", "-", "*", "/"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Number");
			}

			var arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Number");
			}

			var comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 6, "6 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!=", ">", ">=", "<", "<="].includes(comparisionOps[iterator].name), true, "Comparision Operator " +
					comparisionOps[iterator].name + " Should be displayed for Number");
			}

			var rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed for Number");
			}

			var logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 0, "0 logical Operators Should be Displayed for String");

			var functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed for String");

		});

		QUnit.test("Autocomplete Suggestions for  COUNTDISTINCT  ", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"COUNTDISTINCT(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 1, "1 Terms  CARRID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name + " Should be displayed");
			}

			inputString =
				"COUNTDISTINCT(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) + ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 5, "5 Terms  CLASS , CUSTOMID , BOOKID, CONNID Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["CLASS", "CUSTOMID", "BOOKID", "CONNID", "CARRID"].includes(attributes[iterator].name), true, "Term " + attributes[
					iterator].name + " Should be displayed");
			}

			inputString =
				"COUNTDISTINCT(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd) + ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms Should be displayed ");

			//Test for CSN 1970294040 
			inputString =
				"COUNTDISTINCT(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/f238309662694bcaa8942010611d02f4) > 3 ";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			var logicalops = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalops.length, 2, "2 Logical Ops  AND,OR Should be displayed ");
			for (iterator = 0; iterator < logicalops.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalops[iterator].name), true, "Operator " + logicalops[
					iterator].name + " Should be displayed");
			}

			inputString =
				"COUNTDISTINCT(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) > 3 ";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});
			logicalops = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalops.length, 2, "2 Logical Ops  AND,OR Should be displayed ");
			for (iterator = 0; iterator < logicalops.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalops[iterator].name), true, "Operator " + logicalops[
					iterator].name + " Should be displayed");
			}

		});

		QUnit.test("Autocomplete Suggestions for  FILTER  ", function (assert) {

			var tokens;
			var inputString =
				"FILTER(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms Should be displayed ");

			inputString = "FILTER(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd))";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			var arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");

			var arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 0, "0 Array Operators Should be Displayed");

			var comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 0, "0 Comparision Operators Should be Displayed");

			var rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 0, "0 Range Operators Should be Displayed");

			var logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 0, "0 logical Operators Should be Displayed for String");

			var functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed for String");

		});

		QUnit.test("Autocomplete Suggestions for  Selection Functions", function (assert) {

			var tokens;
			var inputString =
				"TOP(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms Should be displayed ");

			inputString = "TOP(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd)";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			var arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");

			var arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 0, "0 Array Operators Should be Displayed");

			var comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 0, "0 Comparision Operators Should be Displayed");

			var rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 0, "0 Range Operators Should be Displayed");

			var logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 0, "0 logical Operators Should be Displayed");

			var functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			inputString =
				"BOTTOM(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms Should be displayed ");

			inputString = "BOTTOM(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd)";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 0, "0 Array Operators Should be Displayed");

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 0, "0 Comparision Operators Should be Displayed");

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 0, "0 Range Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 0, "0 logical Operators Should be Displayed for String");

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed for String");

			inputString =
				"SELECT(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,./9e1095dfbb4f4b919f5f24cc459a9687/b7401f5704d44368ad61b0e9ca76fbbd,./9e1095dfbb4f4b919f5f24cc459a9687/b7401f5704d44368ad61b0e9ca76fbbd),./9e1095dfbb4f4b919f5f24cc459a9687/b7401f5704d44368ad61b0e9ca76fbbd) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms Should be displayed ");

			inputString =
				"SELECT(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd)) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms Should be displayed ");

			inputString = "SELECT(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd))";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 0, "0 Array Operators Should be Displayed");

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 0, "0 Comparision Operators Should be Displayed");

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 0, "0 Range Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 0, "0 logical Operators Should be Displayed for String");

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed for String");

			inputString =
				"SORTASC(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms Should be displayed ");

			inputString =
				"SORTASC(SUM(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd)";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 0, "0 Array Operators Should be Displayed");

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 0, "0 Comparision Operators Should be Displayed");

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 0, "0 Range Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 0, "0 logical Operators Should be Displayed for String");

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed for String");

			inputString =
				"SORTDESC(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd) * ./9e1095dfbb4f4b919f5f24cc459a9687";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 0, "0 Terms Should be displayed ");

			inputString =
				"SORTDESC(AVG(./9e1095dfbb4f4b919f5f24cc459a9687,/b7401f5704d44368ad61b0e9ca76fbbd,/b7401f5704d44368ad61b0e9ca76fbbd),/b7401f5704d44368ad61b0e9ca76fbbd)";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 0, "0 Array Operators Should be Displayed");

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 0, "0 Comparision Operators Should be Displayed");

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 0, "0 Range Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 0, "0 logical Operators Should be Displayed for String");

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed for String");

		});

		QUnit.test("Autocomplete Suggestions for  Logical Operators", function (assert) {

			var tokens;
			var iterator = 0;
			var inputString =
				"((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) AND (./868863c80fb74d7f9ae8c15a96cb66d3";
			tokens = getTokens(inputString);
			var suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			var attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 2, "2 Terms  DiscountBool,DISCOUNT_VALUE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["DiscountBool", "DISCOUNT_VALUE"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString =
				"(((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) AND (./868863c80fb74d7f9ae8c15a96cb66d3/ab845ac9ac2242c3953f30d6b7bcb7ae)) ";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			var arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			var arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			var comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			var functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			var logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			var rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			inputString =
				"((AVG(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   NOTMATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) OR ./868863c80fb74d7f9ae8c15a96cb66d3";
			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": true
			});
			attributes = suggestions.autoComplete.categories.terms;
			assert.equal(attributes.length, 2, "2 Terms  DiscountBool,DISCOUNT_VALUE Should be displayed ");
			for (iterator = 0; iterator < attributes.length; iterator++) {
				assert.equal(["DiscountBool", "DISCOUNT_VALUE"].includes(attributes[iterator].name), true, "Term " + attributes[iterator].name +
					" Should be displayed");
			}

			inputString =
				"(((MAX(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) * MIN(./868863c80fb74d7f9ae8c15a96cb66d3,/9156f9eee8ff4316acd314ba2a5f2b93) + 's')   MATCHES (AVG(./1af007c980e04b55b453dfddcf2cff62, /7ea2962a34da48e2b029671afb4add6e) + 's' )) OR (./868863c80fb74d7f9ae8c15a96cb66d3/ab845ac9ac2242c3953f30d6b7bcb7ae)) ";

			tokens = getTokens(inputString);
			suggestions = _oExpressionLanguage.getSuggesstions(tokens, {
				"AttributeContext": false
			});

			arithmeticops = suggestions.autoComplete.categories.operators.arithmetic;
			assert.equal(arithmeticops.length, 0, "0 Arithmetic Operators Should be Displayed");
			for (iterator = 0; iterator < arithmeticops.length; iterator++) {
				assert.equal(["+"].includes(arithmeticops[iterator].name), true, "Arithmetic Operator " + arithmeticops[iterator].name +
					" Should be displayed for Boolean");
			}

			arrayops = suggestions.autoComplete.categories.operators.array;
			assert.equal(arrayops.length, 2, "Two Array Operators Should be Displayed");
			for (iterator = 0; iterator < arrayops.length; iterator++) {
				assert.equal(["EXISTSIN", "NOTEXISTSIN"].includes(arrayops[iterator].name), true, "Array Operator " + arrayops[iterator].name +
					" Should be displayed for Boolean");
			}

			comparisionOps = suggestions.autoComplete.categories.operators.comparision;
			assert.equal(comparisionOps.length, 2, "2 Comparision Operators Should be Displayed");
			for (iterator = 0; iterator < comparisionOps.length; iterator++) {
				assert.equal(["=", "!="].includes(comparisionOps[iterator].name), true, "Comparision Operator " + comparisionOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			functionalOps = suggestions.autoComplete.categories.operators.functional;
			assert.equal(functionalOps.length, 0, "0 functional Operators Should be Displayed");

			logicalOps = suggestions.autoComplete.categories.operators.logical;
			assert.equal(logicalOps.length, 2, "2 logical Operators Should be Displayed");
			for (iterator = 0; iterator < logicalOps.length; iterator++) {
				assert.equal(["AND", "OR"].includes(logicalOps[iterator].name), true, "Logical Operator " + logicalOps[iterator].name +
					" Should be displayed  for Boolean");
			}

			rangeOps = suggestions.autoComplete.categories.operators.range;
			assert.equal(rangeOps.length, 2, "2 Range Operators Should be Displayed");
			for (iterator = 0; iterator < rangeOps.length; iterator++) {
				assert.equal(["IN", "NOTIN"].includes(rangeOps[iterator].name), true, "Range Operator " + rangeOps[iterator].name +
					" Should be displayed  for Boolean");
			}
		});

	});