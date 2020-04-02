sap.ui.require(['jquery.sap.global', 'sap/rules/ui/services/ExpressionLanguage'],
	function(jQuery, ExpressionLanguage) {

		'use strict';

		var oVocaGaming = (function getTestData() {
			return jQuery.sap.sjax({
				url: '../qunit/data/parser/vocabulary/gaming.txt',
				dataType: "json"
			}).data;
		})();

		var oVocaPurchasing = (function getTestData() {
			return jQuery.sap.sjax({
				url: '../qunit/data/parser/vocabulary/purchasing.txt',
				dataType: "json"
			}).data;
		})();

		var oVocaDemo = (function getTestData() {
			return jQuery.sap.sjax({
				url: '../qunit/data/parser/vocabulary/vocabularyDemo.txt',
				dataType: "json"
			}).data;
		})();

		var oRuleDemo = (function getTestData() {
			return jQuery.sap.sjax({
				url: '../qunit/data/parser/rule/ruleDemo.txt',
				dataType: "json"
			}).data;
		})();
		
		var oRuleDemoWithDates = (function getTestData() {
			return jQuery.sap.sjax({
				url: '../qunit/data/parser/rule/ruleDemoWithDates.txt',
				dataType: "json"
			}).data;
		})();

		var oVocaFlightValuHelp = (function getTestData() {
			return jQuery.sap.sjax({
				url: '../qunit/data/parser/vocabulary/flightValueHelp.txt',
				dataType: "json"
			}).data;
		})();
		
		//================================================================================
		// Carousel Properties
		//================================================================================
		QUnit.module("Rendering", {

			beforeEach: function() {
				this.oVocaGaming = oVocaGaming;
				this.oVocaPurchasing = oVocaPurchasing;
				this.oVocaDemo = oVocaDemo;
				this.oVocaFlightValuHelp = oVocaFlightValuHelp;				
				this.oRuleDemo = oRuleDemo;
				this.oExpressionLanguage = new ExpressionLanguage();

				//Workaround - set locale for testing to empty object, so parser will use it's default locale
				this.oExpressionLanguage._localeSettings = null;
			}
		});

		//================================================================================
		// Test validateExpression
		//================================================================================
		QUnit.test("Test validateExpression", function() {

			this.oExpressionLanguage.setData(this.oVocaGaming);

			/************************************************************************************************/
			var result = this.oExpressionLanguage.validateExpression("age of the player > 10", sap.rules.ui.ExpressionType.Boolean, false, false);

			var expectedString = JSON.stringify({
				"status": "Success",
				"actualReturnType": "Boolean"
			});

			var actualString = JSON.stringify(result);

			equal(actualString, expectedString, "Validate 'age of the player > 10' without tokens");

			/************************************************************************************************/
			result = this.oExpressionLanguage.validateExpression("age of the player > 10", "Boolean", false, true);

			expectedString = JSON.stringify({
				"status": "Success",
				"actualReturnType": "Boolean",
				"tokens": [{
					"start": 0,
					"end": 2,
					"tokenType": "vocabulary",
					"token": "age"
				}, {
					"start": 3,
					"end": 3,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 4,
					"end": 5,
					"tokenType": "vocabulary",
					"token": "of"
				}, {
					"start": 6,
					"end": 6,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 7,
					"end": 9,
					"tokenType": "vocabulary",
					"token": "the"
				}, {
					"start": 10,
					"end": 10,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 11,
					"end": 16,
					"tokenType": "vocabulary",
					"token": "player"
				}, {
					"start": 17,
					"end": 17,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 18,
					"end": 18,
					"tokenType": "reservedword",
					"info": {
						"category": "comparisonOp"
					},
					"token": ">"
				}, {
					"start": 19,
					"end": 19,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 20,
					"end": 21,
					"tokenType": "constant",
					"info": {
						"category": "dynamic",
						"type": "Number"
					},
					"token": "10"
				}]
			});

			actualString = JSON.stringify(result);

			equal(actualString, expectedString, "Validate 'age of the player > 10' and also request tokens");

			/************************************************************************************************/
			var oPurchasingExpressionLanguage = new ExpressionLanguage();
			oPurchasingExpressionLanguage._initLocale = function() {
				return null;
			};

			oPurchasingExpressionLanguage.setData(this.oVocaPurchasing);

			var gamingResult = this.oExpressionLanguage.validateExpression("name of the player", sap.rules.ui.ExpressionType.All, false, false);

			var purchasingResult = oPurchasingExpressionLanguage.validateExpression("FirstName of the Customer", "String", false, false);

			var gamingResultStr = JSON.stringify(gamingResult);

			var purchasingResultStr = JSON.stringify(purchasingResult);

			expectedString = JSON.stringify({
				"status": "Success",
				"actualReturnType": "String"
			});

			equal(expectedString, gamingResultStr,
				"Two ExpressionLanguage with different vocabularies - call validateExpression in gaming ExpressionLanguage");

			equal(purchasingResultStr, expectedString,
				"Purchasing ExpressionLanguage validate correctly - call validateExpression in purchasing ExpressionLanguage");

			/************************************************************************************************/
			oPurchasingExpressionLanguage.setData(this.oVocaGaming);

			result = oPurchasingExpressionLanguage.validateExpression("age of the player", sap.rules.ui.ExpressionType.Number, false, false);

			expectedString = JSON.stringify({
				"status": "Success",
				"actualReturnType": "Number"
			});

			actualString = JSON.stringify(result);

			equal(actualString, expectedString,
				"Test vocabulary replacement - change vocabulary from purchasing to gaming and validate expression");

			/************************************************************************************************/
			this.oExpressionLanguage.setData(this.oVocaGaming);

			result = this.oExpressionLanguage.validateExpression("name of the player > 10", sap.rules.ui.ExpressionType.Boolean, false, false);

			expectedString = JSON.stringify({
				"status": "Error",
				"errorDetails": "Error in expression; enter string in single quotes: '10' instead of 10.\n",
				"cursorPosition": 21
			});

			actualString = JSON.stringify(result);

			equal(actualString, expectedString, "Error results for 'name of the player > 10'");

			/************************************************************************************************/
			result = this.oExpressionLanguage.validateExpression("age of the player", sap.rules.ui.ExpressionType.Number, true, false);

			expectedString = JSON.stringify({
				"status": "Error",
				"errorDetails": "Error in expression; enter valid operand instead of 'age of the player'\n",
				"cursorPosition": 0
			});

			actualString = JSON.stringify(result);

			equal(actualString, expectedString, "Error results for 'age of the player' and 'collection = true'");

		});

		//================================================================================
		// Test getSuggestions
		//================================================================================
		QUnit.test("Test getSuggestions", function() {

			this.oExpressionLanguage.setData(this.oVocaGaming);

			var result = this.oExpressionLanguage.getSuggestions("age of the player >", sap.rules.ui.ExpressionType.Boolean, false, false);

			var expectedString = JSON.stringify({
				"suggs": [{
					"text": "age of the player",
					"completion": " age of the player",
					"tokenType": "vocabulary"
				}, {
					"text": "current_level of the player",
					"completion": " current_level of the player",
					"tokenType": "vocabulary"
				}, {
					"text": "amount of the payment rc",
					"completion": " amount of the payment rc",
					"tokenType": "vocabulary"
				}, {
					"text": "reporting amount of the payment rc",
					"completion": " reporting amount of the payment rc",
					"tokenType": "vocabulary"
				}, {
					"text": "(",
					"completion": " (",
					"tokenType": "reservedword",
					"info": {
						"category": null
					}
				}, {
					"text": "count distinct of",
					"completion": " count distinct of",
					"tokenType": "reservedword",
					"info": {
						"category": "function"
					}
				}, {
					"text": "-",
					"completion": " -",
					"tokenType": "reservedword",
					"info": {
						"category": "arithmeticOp"
					}
				}, {
					"text": "<number>",
					"completion": " <number>",
					"tokenType": "constant",
					"info": {
						"category": "dynamic",
						"type": "Number"
					}
				}, {
					"text": "number of",
					"completion": " number of",
					"tokenType": "reservedword",
					"info": {
						"category": "function"
					}
				}, {
					"text": "highest",
					"completion": " highest",
					"tokenType": "reservedword",
					"info": {
						"category": "function"
					}
				}, {
					"text": "lowest",
					"completion": " lowest",
					"tokenType": "reservedword",
					"info": {
						"category": "function"
					}
				}, {
					"text": "average of",
					"completion": " average of",
					"tokenType": "reservedword",
					"info": {
						"category": "function"
					}
				}, {
					"text": "sum of",
					"completion": " sum of",
					"tokenType": "reservedword",
					"info": {
						"category": "function"
					}
				}]
			});

			var actualString = JSON.stringify(result);

			equal(actualString, expectedString, "Suggests for 'age of the player >' without tokens");

			/************************************************************************************************/
			result = this.oExpressionLanguage.getSuggestions("age of the player >", sap.rules.ui.ExpressionType.Boolean, false, true);

			expectedString = JSON.stringify({
				"suggs": [{
					"text": "age of the player",
					"completion": " age of the player",
					"tokenType": "vocabulary"
				}, {
					"text": "current_level of the player",
					"completion": " current_level of the player",
					"tokenType": "vocabulary"
				}, {
					"text": "amount of the payment rc",
					"completion": " amount of the payment rc",
					"tokenType": "vocabulary"
				}, {
					"text": "reporting amount of the payment rc",
					"completion": " reporting amount of the payment rc",
					"tokenType": "vocabulary"
				}, {
					"text": "(",
					"completion": " (",
					"tokenType": "reservedword",
					"info": {
						"category": null
					}
				}, {
					"text": "count distinct of",
					"completion": " count distinct of",
					"tokenType": "reservedword",
					"info": {
						"category": "function"
					}
				}, {
					"text": "-",
					"completion": " -",
					"tokenType": "reservedword",
					"info": {
						"category": "arithmeticOp"
					}
				}, {
					"text": "<number>",
					"completion": " <number>",
					"tokenType": "constant",
					"info": {
						"category": "dynamic",
						"type": "Number"
					}
				}, {
					"text": "number of",
					"completion": " number of",
					"tokenType": "reservedword",
					"info": {
						"category": "function"
					}
				}, {
					"text": "highest",
					"completion": " highest",
					"tokenType": "reservedword",
					"info": {
						"category": "function"
					}
				}, {
					"text": "lowest",
					"completion": " lowest",
					"tokenType": "reservedword",
					"info": {
						"category": "function"
					}
				}, {
					"text": "average of",
					"completion": " average of",
					"tokenType": "reservedword",
					"info": {
						"category": "function"
					}
				}, {
					"text": "sum of",
					"completion": " sum of",
					"tokenType": "reservedword",
					"info": {
						"category": "function"
					}
				}],
				"tokens": [{
					"start": 0,
					"end": 2,
					"tokenType": "vocabulary",
					"token": "age"
				}, {
					"start": 3,
					"end": 3,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 4,
					"end": 5,
					"tokenType": "vocabulary",
					"token": "of"
				}, {
					"start": 6,
					"end": 6,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 7,
					"end": 9,
					"tokenType": "vocabulary",
					"token": "the"
				}, {
					"start": 10,
					"end": 10,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 11,
					"end": 16,
					"tokenType": "vocabulary",
					"token": "player"
				}, {
					"start": 17,
					"end": 17,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 18,
					"end": 18,
					"tokenType": "reservedword",
					"info": {
						"category": "comparisonOp"
					},
					"token": ">"
				}]
			});

			actualString = JSON.stringify(result);

			equal(actualString, expectedString, "Suggests 'age of the player >' and also request token");

			/************************************************************************************************/
			result = this.oExpressionLanguage.getSuggestions("age of the player2 > ", sap.rules.ui.ExpressionType.Boolean, false, false);

			expectedString = JSON.stringify({
				"suggs": []
			});

			actualString = JSON.stringify(result);

			equal(actualString, expectedString, "Negative testing - no suggestions for 'age of the player2 >'");

			/************************************************************************************************/
			result = this.oExpressionLanguage.getSuggestions("age of the player", sap.rules.ui.ExpressionType.Boolean, true, false);

			expectedString = JSON.stringify({
				"suggs": []
			});

			actualString = JSON.stringify(result);

			equal(actualString, expectedString, "Negative testing - no suggestions for 'age of the player' when 'collection = true'");
		});

		//================================================================================
		// Test getBasicSuggestions
		//================================================================================
		QUnit.test("Test getExpressionLanguage all/compPart/rightPart", function(assert) {
			//********* ExpressionLanguage CSV fetch *********
			var csvExpressions = [];
			var csvExpectedCompSuggestions = [];
			var csvExpectedRightSuggestions = [];
			var csvExpectedAllSuggestions = [];
			var csvNameEL = "../qunit/data/csv/ExpressionLanguageGetBasic.csv";
			var successFuncEL = function(data) {
				fillExpressionsAndExpectedsEL(data.replace(/\\u2022/gi, String.fromCharCode(8226)));
			};

			jQuery(document).ready(function() {
				jQuery.ajax({
					type: "GET",
					async: false,
					url: csvNameEL,
					dataType: "text",
					success: successFuncEL
				});
			});

			function fillExpressionsAndExpectedsEL(allTextParam) {
				var allTextLines = allTextParam.replace(/\\u2022/g, String.fromCharCode(8226));
				allTextLines = allTextLines.split(/\r\n|\n/);
				// Support csv delimiter '----'
				var delimiter = (allTextLines[0].indexOf('----') == -1) ? ';' : '----';
				for (var j = 0; j < allTextLines.length; j++) {
					var entries = allTextLines[j].split(delimiter);
					csvExpressions.push(entries[1]);
					csvExpectedCompSuggestions.push(entries[3]);
					csvExpectedRightSuggestions.push(entries[4]);
					csvExpectedAllSuggestions.push(entries[5]);
					if (entries[0] == "false") {
						j = allTextLines.length;
					}
				}
			}

			/*********  - test ExpressionLanguage getExpressionLanguage all/compPart/rightPart **************/
			var suggestionsPart = sap.rules.ui.SuggestionsPart;
			var compPartSuggestions;
			var rightPartSuggestions;
			var allPartSuggestions;
			var iterationSuffix;
			var currentExpression;

			for (var i = 0; i < csvExpressions.length; i++) {
				currentExpression = csvExpressions[i];
				iterationSuffix = "Expression" + (i + 1) + ": ";

				//this.oExpressionLanguage = new ExpressionLanguage();
				/*this.oExpressionLanguage._initLocale = function(){
				    return null;
                };*/
				this.oExpressionLanguage.setData(this.oVocaGaming);

				compPartSuggestions = this.oExpressionLanguage._getBasicSuggestions(currentExpression, suggestionsPart.compPart);
				compPartSuggestions[0].sugg.sort(); //sorting for support different browsers

				rightPartSuggestions = this.oExpressionLanguage._getBasicSuggestions(currentExpression, suggestionsPart.rightPart);
				allPartSuggestions = this.oExpressionLanguage._getBasicSuggestions(currentExpression, suggestionsPart.all);
				if (allPartSuggestions[1]) {
					allPartSuggestions[1].sugg.sort(); //sorting for support different browsers
				}

				assert.equal(currentExpression, currentExpression, "***" + iterationSuffix + currentExpression + "***");
				assert.deepEqual(allPartSuggestions, JSON.parse(csvExpectedAllSuggestions[i]), iterationSuffix + "test getBasicSuggestions(all)");
				assert.deepEqual(compPartSuggestions, JSON.parse(csvExpectedCompSuggestions[i]), iterationSuffix +
					"test getBasicSuggestions(compPart)");
				assert.deepEqual(rightPartSuggestions, JSON.parse(csvExpectedRightSuggestions[i]), iterationSuffix +
					"test getBasicSuggestions(rightPart)");
			}
		});

		//================================================================================
		// Test getExpressionMetadata
		//================================================================================
		QUnit.test("Test getExpressionMetadata", function() {

			this.oExpressionLanguage.setData(this.oVocaGaming);

			var result = this.oExpressionLanguage.getExpressionMetadata("age of the player > 10");

			var expectedString = JSON.stringify({
				"tokens": [{
					"start": 0,
					"end": 2,
					"tokenType": "vocabulary",
					"token": "age"
				}, {
					"start": 3,
					"end": 3,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 4,
					"end": 5,
					"tokenType": "vocabulary",
					"token": "of"
				}, {
					"start": 6,
					"end": 6,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 7,
					"end": 9,
					"tokenType": "vocabulary",
					"token": "the"
				}, {
					"start": 10,
					"end": 10,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 11,
					"end": 16,
					"tokenType": "vocabulary",
					"token": "player"
				}, {
					"start": 17,
					"end": 17,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 18,
					"end": 18,
					"tokenType": "reservedword",
					"info": {
						"category": "comparisonOp"
					},
					"token": ">"
				}, {
					"start": 19,
					"end": 19,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 20,
					"end": 21,
					"tokenType": "constant",
					"info": {
						"category": "dynamic",
						"type": "Number"
					},
					"token": "10"
				}]
			});

			var actualString = JSON.stringify(result);

			equal(actualString, expectedString, "getExpressionMetadata for 'age of the player > 1'");

			/************************************************************************************************/
			result = this.oExpressionLanguage.getExpressionMetadata("age of the player > age of the player2");

			expectedString = JSON.stringify({
				"tokens": [{
					"start": 0,
					"end": 2,
					"tokenType": "vocabulary",
					"token": "age"
				}, {
					"start": 3,
					"end": 3,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 4,
					"end": 5,
					"tokenType": "vocabulary",
					"token": "of"
				}, {
					"start": 6,
					"end": 6,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 7,
					"end": 9,
					"tokenType": "vocabulary",
					"token": "the"
				}, {
					"start": 10,
					"end": 10,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 11,
					"end": 16,
					"tokenType": "vocabulary",
					"token": "player"
				}, {
					"start": 17,
					"end": 17,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 18,
					"end": 18,
					"tokenType": "reservedword",
					"info": {
						"category": "comparisonOp"
					},
					"token": ">"
				}, {
					"start": 19,
					"end": 19,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 20,
					"end": 22,
					"tokenType": "unknown",
					"token": "age"
				}, {
					"start": 23,
					"end": 23,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 24,
					"end": 25,
					"tokenType": "vocabulary",
					"token": "of"
				}, {
					"start": 26,
					"end": 26,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 27,
					"end": 29,
					"tokenType": "vocabulary",
					"token": "the"
				}, {
					"start": 30,
					"end": 30,
					"tokenType": "whitespace",
					"token": " "
				}, {
					"start": 31,
					"end": 37,
					"tokenType": "unknown",
					"token": "player2"
				}]
			});

			actualString = JSON.stringify(result);

			equal(actualString, expectedString,
				"Negative testing - tokenize all except unknown tokens(player2) for 'age of the player > age of the player2'");
		});

		//================================================================================
		// Test validateRule
		//================================================================================
		QUnit.test("Test validateRule", function() {

			this.oExpressionLanguage.setData(this.oVocaDemo);

			var result = this.oExpressionLanguage.validateRule(this.oRuleDemo);

			/*            var expectedString = '{\"code\":\"12001\",\"message\":\"Rule validation failure\",\"output\":{\"status\":\"Error\"},\"details\":[{\"subject\":\"Rule Validation\",\"messages\":[{\"code\":\"2518\",\"severity\":\"error\",\"description\":\"Output ' + "'FLIGHT_NUMBER'" + ' does not exist in vocabulary.\",\"additionalInfo\":{\"type\":\"ruleResult\"}},{\"code\":\"1106\",\"severity\":\"error\",\"description\":\"Incomplete expression;\\n\",\"additionalInfo\":{\"type\":\"cell\",\"colId\":1,\"cursorPosition\":-1,\"rowId\":1}},{\"code\":\"1105\",\"severity\":\"error\",\"description\":\"Error in expression' + ";" + ' enter valid operand instead of ' + "'1462717437178'" +'\\n\",\"additionalInfo\":{\"type\":\"cell\",\"colId\":2,\"cursorPosition\":0,\"rowId\":1}},{\"code\":\"1106\",\"severity\":\"error\",\"description\":\"Incomplete expression;\\n\",\"additionalInfo\":{\"type\":\"cell\",\"colId\":1,\"cursorPosition\":-1,\"rowId\":2}},{\"code\":\"1105\",\"severity\":\"error\",\"description\":\"Error in expression'+";" + ' enter valid operand instead of '+"'1462702592426'"+'\\n\",\"additionalInfo\":{\"type\":\"cell\",\"colId\":2,\"cursorPosition\":0,\"rowId\":2}},{\"code\":\"1106\",\"severity\":\"error\",\"description\":\"Incomplete expression;\\n\",\"additionalInfo\":{\"type\":\"cell\",\"colId\":1,\"cursorPosition\":-1,\"rowId\":3}},{\"code\":\"1105\",\"severity\":\"error\",\"description\":\"Error in expression' + ";" + ' enter valid operand instead of '+"'1462718469929'"+'\\n\",\"additionalInfo\":{\"type\":\"cell\",\"colId\":2,\"cursorPosition\":0,\"rowId\":3}},{\"code\":\"1106\",\"severity\":\"error\",\"description\":\"Incomplete expression;\\n\",\"additionalInfo\":{\"type\":\"cell\",\"colId\":1,\"cursorPosition\":-1,\"rowId\":4}},{\"code\":\"1105\",\"severity\":\"error\",\"description\":\"Error in expression'
			            + ";" + ' enter valid operand instead of ' + "'1462702587124'" + '\\n\",\"additionalInfo\":{\"type\":\"cell\",\"colId\":2,\"cursorPosition\":0,\"rowId\":4}}]}]}';
			            var actualString = JSON.stringify(result);*/

			var expectedString = "12001";
			var actualString = result.code;

			equal(actualString, expectedString, "validate Rule for a decision table");

		});

		//================================================================================
		// Test getResultInfo
		//================================================================================
		QUnit.test("Test getResultInfo", function() {

			this.oExpressionLanguage.setData(this.oVocaGaming);

			var result = this.oExpressionLanguage.getResultInfo("playerInfo");

			if (result.id) {
				delete result.id;
			}

			if (result.vocaId) {
				delete result.vocaId;
			}

			if (result.requiredParams) {
				delete result.requiredParams[0].id;
				delete result.requiredParams[1].id;
				delete result.requiredParams[0].outputId;
				delete result.requiredParams[1].outputId;
				delete result.requiredParams[0].paramId;
				delete result.requiredParams[1].paramId;
			}

			var expectedString =
				'{"vocaName":"005056912EC51ED682BE81392D068888","name":"playerInfo","staticParams":[],"requiredParams":[{"name":"discount","dataType":"","size":null,"businessDataType":"Number","isCollection":false,"description":"discount"},{"name":"textInfo","dataType":"","size":null,"businessDataType":"String","isCollection":false,"description":"text Info"}],"description":"playerInformation","scope":"005056912EC51ED682BE81392D068888","isPrivate":false,"isValueListConverted":false}';
			var actualString = JSON.stringify(result);

			equal(actualString, expectedString, "get Result Information");

		});

		//================================================================================
		// Test getSuggestionsByCatagory
		//================================================================================
		QUnit.test("Test getSuggestionsByCategory", function() {

			//this.oExpressionLanguage = new ExpressionLanguage();

			/*this.oExpressionLanguage._initLocale = function(){
				return null;
            };*/

			this.oExpressionLanguage.setData(this.oVocaGaming);

			var oFilter = [{
				tokenType: sap.rules.ui.ExpressionTokenType.vocabulary,
				tokenCategory: undefined,
				tokenBusinessType: undefined
			}];
			var sExpression = "a";

			var result = this.oExpressionLanguage.getSuggestionsByCategories(sExpression, oFilter);

			var expectedString = JSON.stringify([{
				"text": "age of the player",
				"completion": "ge of the player",
				"tokenType": "vocabulary"
			}, {
				"text": "amount of the payment rc",
				"completion": "mount of the payment rc",
				"tokenType": "vocabulary"
			}]);

			var actualString = JSON.stringify(result);

			equal(actualString, expectedString, "SuggByCatagory with 1 category with expression");

			/************************************************************************************************/

			oFilter = [{
				tokenType: sap.rules.ui.ExpressionTokenType.constant,
				tokenCategory: sap.rules.ui.ExpressionCategory.fixed,
				tokenBusinessType: undefined
			}];
			sExpression = " ";

			result = this.oExpressionLanguage.getSuggestionsByCategories(sExpression, oFilter);

			expectedString = JSON.stringify([{
				"text": "true",
				"completion": "true",
				"tokenType": "constant",
				"info": {
					"category": "fixed",
					"type": "Boolean"
				}
			}, {
				"text": "false",
				"completion": "false",
				"tokenType": "constant",
				"info": {
					"category": "fixed",
					"type": "Boolean"
				}
			}, {
				"text": "null",
				"completion": "null",
				"tokenType": "constant",
				"info": {
					"category": "fixed",
					"type": null
				}
			}]);
			actualString = JSON.stringify(result);
			equal(actualString, expectedString, "SuggByCatagory with 2 categories without expression");

			/************************************************************************************************/

			oFilter = [{
				tokenType: sap.rules.ui.ExpressionTokenType.constant,
				tokenCategory: sap.rules.ui.ExpressionCategory.dynamic,
				tokenBusinessType: sap.rules.ui.ExpressionType.Date
			}];
			sExpression = " ";

			result = this.oExpressionLanguage.getSuggestionsByCategories(sExpression, oFilter);

			expectedString = JSON.stringify([{
				"text": "<'yyyy-MM-dd'>",
				"completion": "<'yyyy-MM-dd'>",
				"tokenType": "constant",
				"info": {
					"category": "dynamic",
					"type": "Date"
				}
			}]);
			actualString = JSON.stringify(result);
			equal(actualString, expectedString, "SuggByCatagory with 3 cataeories without expression");

			/************************************************************************************************/

			oFilter = [{
				tokenType: sap.rules.ui.ExpressionTokenType.constant,
				tokenCategory: sap.rules.ui.ExpressionCategory.dynamic,
				tokenBusinessType: sap.rules.ui.ExpressionType.Date
			}, {
				tokenType: sap.rules.ui.ExpressionTokenType.constant,
				tokenCategory: sap.rules.ui.ExpressionCategory.dynamic,
				tokenBusinessType: sap.rules.ui.ExpressionType.Time
			}];
			sExpression = " ";

			result = this.oExpressionLanguage.getSuggestionsByCategories(sExpression, oFilter);

			expectedString = JSON.stringify([{
				"text": "<'yyyy-MM-dd'>",
				"completion": "<'yyyy-MM-dd'>",
				"tokenType": "constant",
				"info": {
					"category": "dynamic",
					"type": "Date"
				}
			}, {
				"text": "<'HH:mm:ss'>",
				"completion": "<'HH:mm:ss'>",
				"tokenType": "constant",
				"info": {
					"category": "dynamic",
					"type": "Time"
				}
			}]);
			actualString = JSON.stringify(result);
			equal(actualString, expectedString, "SuggByCatagory with 2 cataeories without expression with array of 2 filters");
		});
		
		//================================================================================
		// Test Module - with Loacle Settings
		//================================================================================
		QUnit.module("Services with Loacle Settings", {

			beforeEach: function() {
				this.oVocaGaming = oVocaGaming;
				this.oVocaDemo = oVocaDemo;
				this.oRuleDemoWithDates = oRuleDemoWithDates;
				this.oVocaFlightValuHelp = oVocaFlightValuHelp;	
				this.oExpressionLanguage = new ExpressionLanguage();

				//Workaround - set locale for testing with constant object, so parser will use it's default locale
								this.oExpressionLanguage._localeSettings = null;

				this.oExpressionLanguage._localeSettings = {
					"dateFormat": "M/d/yy",
					"timeFormat": "h:mm:ss a zzzz",
					"timeZoneOffset": -180,
					"number": {
						"groupSeparator": ",",
						"decimalSeparator": "."
					}
				};

			}
		});
		//================================================================================
		// Test formatter - convertDecisionTableExpressionToDisplayValue
		//================================================================================
		QUnit.test("Test formatter - convertDecisionTableExpressionToDisplayValue", function() {
			var sHeaderExpression = "birthdate of the player";
			var sFixedOpr = "is before";
			var sCellExpression = "'2016-08-28'";

			this.oExpressionLanguage.setData(this.oVocaGaming);

			var result = this.oExpressionLanguage.convertDecisionTableExpressionToDisplayValue(sHeaderExpression, sFixedOpr, sCellExpression);
			
			var expectedResult = {
				"code": "13000",
				"message": "Rule service validation success",
				"output": {
					"status": "Success",
					"converted": {
						"header": "birthdate of the player",
						"fixedOperator": "is before",
						"cell": "'8/28/16'"
					},
					"actualReturnType": "Boolean"
				},
				"details": [{
					"subject": "RuleServiceValidation"
				}]
			};
			delete result.output.tokens;
			deepEqual(result.output, expectedResult.output, "convertDecisionTableExpressionToModelValue test finished successfully");
		});

		//================================================================================
		// Test formatter - convertDecisionTableExpressionToModelValue
		//================================================================================
		QUnit.test("Test formatter - convertDecisionTableExpressionToModelValue", function() {
			var sHeaderExpression = "birthdate of the player";
			var sFixedOpr = "is before";
			var sCellExpression = "'8/28/16'";

			this.oExpressionLanguage.setData(this.oVocaGaming);

			var result = this.oExpressionLanguage.convertDecisionTableExpressionToModelValue(sHeaderExpression, sFixedOpr, sCellExpression);

			var expectedResult = {
				"code": "13000",
				"message": "Rule service validation success",
				"output": {
					"status": "Success",
					"converted": {
						"header": "birthdate of the player",
						"fixedOperator": "is before",
						"cell": "'2016-08-28'"
					},
					"actualReturnType": "Boolean"
				},
				"details": [{
					"subject": "RuleServiceValidation"
				}]
			};

			delete result.output.tokens;
			deepEqual(result.output, expectedResult.output, "convertDecisionTableExpressionToModelValue test finished successfully");
		});
		
		//================================================================================
		// Test convertRuleToDisplayValues
		//================================================================================
		QUnit.test("Test formatter - convertRuleToDisplayValues", function() {

			this.oExpressionLanguage.setData(this.oVocaDemo);
            //AST sections have functions which cannot be read by the json parser
			var result = this.oExpressionLanguage.convertRuleToDisplayValues(this.oRuleDemoWithDates); 
			result = JSON.stringify(result);
            var expectedResult = {"code":"12001","message":"Rule validation failure","output":{"status":"Error","decisionTableData":{"__metadata":{"id":"/sap/opu/odata/SAP/RULE_SRV/Rules('005056912EC51ED682BE81392D0680B9')","uri":"/sap/opu/odata/SAP/RULE_SRV/Rules('005056912EC51ED682BE81392D0680B9')","type":"RULE_SRV.Rule"},"Id":"005056912EC51ED682BE81392D0680B9","Name":"ZMT_ANALYLITAL_DT","ApplicationId":"00505691-2ec5-1ed5-acf2-78525288620a","Status":"I","Description":"Analytical DT","CreatedOn":"2016-04-24T08:11:34.000Z","CreatedBy":"TARANTO","ChangedOn":"2016-05-08T14:40:50.000Z","ChangedBy":"LULUA","RuleFormat":"BASIC","Type":"DT","ResultDataObjectId":"005056912EC51EE682BE22B60DAEFF5D","ResultDataObjectName":"FLIGHT_NUMBER","DecisionTable":{"__metadata":{"id":"/sap/opu/odata/SAP/RULE_SRV/DecisionTables('005056912EC51ED682BE81392D0680B9')","uri":"/sap/opu/odata/SAP/RULE_SRV/DecisionTables('005056912EC51ED682BE81392D0680B9')","type":"RULE_SRV.DecisionTable"},"RuleId":"005056912EC51ED682BE81392D0680B9","HitPolicy":"FM","DecisionTableColumns":{"results":[{"__metadata":{"id":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableColumns(RuleId='005056912EC51ED682BE81392D0680B9',Id=1)","uri":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableColumns(RuleId='005056912EC51ED682BE81392D0680B9',Id=1)","type":"RULE_SRV.DecisionTableColumn"},"RuleId":"005056912EC51ED682BE81392D0680B9","Id":1,"Type":"CONDITION","Condition":{"__metadata":{"id":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableColumnConditions(RuleId='005056912EC51ED682BE81392D0680B9',Id=1)","uri":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableColumnConditions(RuleId='005056912EC51ED682BE81392D0680B9',Id=1)","type":"RULE_SRV.DecisionTableColumnCondition"},"RuleId":"005056912EC51ED682BE81392D0680B9","Id":1,"Expression":"FLDATE of the ZMTAR_FLIGHT_SQL","ValueOnly":false,"FixedOperator":"is greater than","Description":"","parserResults":{"status":"Success","converted":{"Expression":"Date of the Flight","ASTOutput":{"statementsArray":{"results":[{"valueType":null}]},"valueType":null}}}},"Result":null},{"__metadata":{"id":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableColumns(RuleId='005056912EC51ED682BE81392D0680B9',Id=2)","uri":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableColumns(RuleId='005056912EC51ED682BE81392D0680B9',Id=2)","type":"RULE_SRV.DecisionTableColumn"},"RuleId":"005056912EC51ED682BE81392D0680B9","Id":2,"Type":"RESULT","Condition":null,"Result":{"__metadata":{"id":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableColumnResults(RuleId='005056912EC51ED682BE81392D0680B9',Id=2)","uri":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableColumnResults(RuleId='005056912EC51ED682BE81392D0680B9',Id=2)","type":"RULE_SRV.DecisionTableColumnResult"},"RuleId":"005056912EC51ED682BE81392D0680B9","Id":2,"DataObjectAttributeName":"FLIGHT_NUMBER","DataObjectAttributeId":"005056912EC51EE682BE22B60DAEFF5D","BusinessDataType":"String"}}]},"DecisionTableRows":{"results":[{"__metadata":{"id":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableRows(RuleId='005056912EC51ED682BE81392D0680B9',Id=1)","uri":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableRows(RuleId='005056912EC51ED682BE81392D0680B9',Id=1)","type":"RULE_SRV.DecisionTableRow"},"RuleId":"005056912EC51ED682BE81392D0680B9","Id":1,"Cells":{"results":[{"__metadata":{"id":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableRowCells(RuleId='005056912EC51ED682BE81392D0680B9',RowId=1,ColId=1)","uri":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableRowCells(RuleId='005056912EC51ED682BE81392D0680B9',RowId=1,ColId=1)","type":"RULE_SRV.DecisionTableRowCell"},"RuleId":"005056912EC51ED682BE81392D0680B9","RowId":1,"ColId":1,"Content":"'2016-08-28'","parserResults":{"status":"Success","converted":{"Content":"'8/28/16'","ASTOutput":{"statementsArray":{"results":[{"valueType":null}]},"valueType":null}}}},{"__metadata":{"id":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableRowCells(RuleId='005056912EC51ED682BE81392D0680B9',RowId=1,ColId=2)","uri":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableRowCells(RuleId='005056912EC51ED682BE81392D0680B9',RowId=1,ColId=2)","type":"RULE_SRV.DecisionTableRowCell"},"RuleId":"005056912EC51ED682BE81392D0680B9","RowId":1,"ColId":2,"Content":"1234","parserResults":{"status":"Error"}}]}},{"__metadata":{"id":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableRows(RuleId='005056912EC51ED682BE81392D0680B9',Id=2)","uri":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableRows(RuleId='005056912EC51ED682BE81392D0680B9',Id=2)","type":"RULE_SRV.DecisionTableRow"},"RuleId":"005056912EC51ED682BE81392D0680B9","Id":2,"Cells":{"results":[{"__metadata":{"id":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableRowCells(RuleId='005056912EC51ED682BE81392D0680B9',RowId=2,ColId=1)","uri":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableRowCells(RuleId='005056912EC51ED682BE81392D0680B9',RowId=2,ColId=1)","type":"RULE_SRV.DecisionTableRowCell"},"RuleId":"005056912EC51ED682BE81392D0680B9","RowId":2,"ColId":1,"Content":"'2016-07-27'","parserResults":{"status":"Success","converted":{"Content":"'7/27/16'","ASTOutput":{"statementsArray":{"results":[{"valueType":null}]},"valueType":null}}}},{"__metadata":{"id":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableRowCells(RuleId='005056912EC51ED682BE81392D0680B9',RowId=2,ColId=2)","uri":"/sap/opu/odata/SAP/RULE_SRV/DecisionTableRowCells(RuleId='005056912EC51ED682BE81392D0680B9',RowId=2,ColId=2)","type":"RULE_SRV.DecisionTableRowCell"},"RuleId":"005056912EC51ED682BE81392D0680B9","RowId":2,"ColId":2,"Content":"12345","parserResults":{"status":"Error"}}]}}]}}}},"details":[{"subject":"Rule Validation","messages":[{"code":"2518","severity":"error","description":"Output 'FLIGHT_NUMBER' does not exist in vocabulary.","additionalInfo":{"type":"ruleResult","ruleId":"005056912EC51ED682BE81392D0680B9"}},{"code":"1105","severity":"error","description":"Error in expression; enter valid operand instead of '1234'\n","additionalInfo":{"type":"cell","ruleId":"005056912EC51ED682BE81392D0680B9","colId":2,"cursorPosition":0,"rowId":1}},{"code":"1105","severity":"error","description":"Error in expression; enter valid operand instead of '12345'\n","additionalInfo":{"type":"cell","ruleId":"005056912EC51ED682BE81392D0680B9","colId":2,"cursorPosition":0,"rowId":2}}]}]};
            //AST sections have functions which cannot be read by the json parser
            expectedResult = JSON.stringify(expectedResult);

			var originalQunitMaxDepth = QUnit.dump.maxDepth;
			QUnit.dump.maxDepth = 20;
			deepEqual(result.output, expectedResult.output, "Complete rule convert test finished successfully");
			QUnit.dump.maxDepth = originalQunitMaxDepth;
		});
		
		//================================================================================
		// Test ValueHelp - CallbackFunction
		//================================================================================
		QUnit.test("Test ValueHelp - CallbackFunction", function() {

			var  callback = function (valueHelpInfo){
				var i;
				var serviceInfo;
					for(i=0 ; i< valueHelpInfo.length ; i++){
						serviceInfo = valueHelpInfo[i].metadata;
						valueHelpInfo[i].model = new sap.ui.model.odata.v2.ODataModel({
							serviceUrl: serviceInfo.serviceURL,
	            			defaultBindingMode: sap.ui.model.BindingMode.OneWay	
						});			
					}
			}			
			
			this.oExpressionLanguage.setValueHelpCallback(callback);
			var oFunction = this.oExpressionLanguage.getValueHelpCallback();
			var bRes = oFunction instanceof Function;
			equal(bRes, true, "Test ValueHelp - CallbackFunction");

		});
		
		//================================================================================
		// Test ValueHelp - getSuggestions for a valuehelp scenario
		//================================================================================
		QUnit.test("Test ValueHelp - getSuggestions for a valuehelp scenario", function() {
			this.oExpressionLanguage.setData(this.oVocaFlightValuHelp);
			var result = this.oExpressionLanguage.getSuggestions("Plane Type of the FLIGHT is equal to", "BooleanEnhanced", false);
			var actualResult = result.suggs[0].tokenType;
			var expectedResult = "vocabulary";
			var text = result.suggs[0].text;
			
			equal(actualResult, expectedResult, "Test ValueHelp - getSuggestions for a valuehelp scenario");
			equal(text, "Airline of the BOOKING", "Test ValueHelp - getSuggestions for a valuehelp scenario");
		});

		//================================================================================
		// Test convertDecisionTableExpressionToModelValue with expression language version
		//================================================================================
		QUnit.test("Test formatter - convertDecisionTableExpressionToModelValue with expression language version old", function() {
			var sHeaderExpression = "birthdate of the player";
			var sFixedOpr = "is before";
			var sCellExpression = "'8/28/16'";

			this.oExpressionLanguage.setData(this.oVocaGaming);

			var result = this.oExpressionLanguage.convertDecisionTableExpressionToModelValue(sHeaderExpression, sFixedOpr, sCellExpression, "" , "1.0.0");
			var expectedResult = {
				"code": "13000",
				"message": "Rule service validation success",
				"output": {
					"status": "Success",
					"converted": {
						"header": "birthdate of the player",
						"fixedOperator": "is before",
						"cell": "'2016-08-28'"
					},
					"actualReturnType": "Boolean"
				},
				"details": [{
					"subject": "RuleServiceValidation"
				}]
			};
			delete result.output.tokens;
			deepEqual(result.output, expectedResult.output, "convertDecisionTableExpressionToModelValue test finished successfully");
		});
		
		//================================================================================
		// Test convertDecisionTableExpressionToModelValue with expression language version
		//================================================================================
		QUnit.skip("Test formatter - convertDecisionTableExpressionToModelValue with expression language version new", function() {
			var sHeaderExpression = "birthdate of the player";
			var sFixedOpr = "is before";
			var sCellExpression = "'8/28/16'";

			this.oExpressionLanguage.setData(this.oVocaGaming);

			var result = this.oExpressionLanguage.convertDecisionTableExpressionToModelValue(sHeaderExpression, sFixedOpr, sCellExpression, "" , "1.0.1");
			var expectedResult = {
				"code": "13000",
				"message": "Rule service validation success",
				"output": {
					"status": "Success",
					"converted": {
						"header": "birthdate of the player",
						"fixedOperator": "is before",
						"cell": "'2016-08-28'"
					},
					"actualReturnType": "Boolean"
				},
				"details": [{
					"subject": "RuleServiceValidation"
				}]
			};
			delete result.output.tokens;
			deepEqual(result.output, expectedResult.output, "convertDecisionTableExpressionToModelValue test finished successfully");
		});		
		//================================================================================
		// Carousel Properties
		//================================================================================
		QUnit.module("Static api", {

			beforeEach: function() {
				this.oExpressionLanguage = new ExpressionLanguage();
			}
		});
		
		QUnit.test("Test get rules expression language version", function() {

			var result = this.oExpressionLanguage.getExpressionLanguageVersion();
			var bVersionOK = (result.indexOf(".") > 0)
			ok(bVersionOK, "Get rules expression language version retreived successfully");
		});
	});