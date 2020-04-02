/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define(["jquery.sap.global", "sap/rules/ui/services/ExpressionLanguage"],

    function(jQuery, ExpressionLanguage) {
        "use strict";

        //Get vocabulary gaming data
        var oVocaGaming = (function getTestData(){
            return jQuery.sap.sjax({
                url: '../qunit/data/parser/vocabulary/gaming.txt',
                dataType: "json"
            }).data;
        })();

        //Get vocabulary flight data
        var oVocaFlight = (function getTestData(){
            return jQuery.sap.sjax({
                url: '../qunit/data/parser/vocabulary/flight.txt',
                dataType: "json"
            }).data;
        })();
		
		//Get vocabulary flight data for FriendlyTerms testing
        var oVocaFlightFriendlyTerms = (function getTestData(){
            return jQuery.sap.sjax({
                url: '../qunit/data/parser/vocabulary/flightFriendlyTermsTest.txt',
                dataType: "json"
            }).data;
        })();
        
        //Get vocabulary data for value help testing
        var oVocaValuehelp = (function getTestData(){
            return jQuery.sap.sjax({
                url: '../qunit/data/parser/vocabulary/voca_for_vh.txt',
                dataType: "json"
            }).data;
        })();

		//Get vocabulary data for vocabulary rules testing
		var oVocaVocabularyRules = (function getTestData(){
			return jQuery.sap.sjax({
				url: '../qunit/data/parser/vocabulary/VocaRule_Vocabulary.txt',
				dataType: "json"
			}).data;
		})();

		
		function toCamel(o) {
			var newO, origKey, newKey, value;
			if (o instanceof Array) {
				newO = [];
				for (origKey in o) {
					value = o[origKey];
					if (typeof value === "object") {
						value = toCamel(value);
					}
					newO.push(value);
				}
			} else {
				newO = {};
				for (origKey in o) {
					if (o.hasOwnProperty(origKey)) {
						newKey = (origKey.charAt(0).toUpperCase() + origKey.slice(1) || origKey).toString();
						value = o[origKey];
						if (value !== null && (typeof value === "object")) {
							value = toCamel(value);
						}
						newO[newKey] = value;
					}
				}
			}
			return newO;
		}
		
		//var oVocaVocabularyRules = toCamel(_oVocaVocabularyRules);
		
        //Create ExpressionLanguage
        var expressionLanguage = new ExpressionLanguage();

        var origBuildFlagsObjectFunc = expressionLanguage._buildFlagsObject;
        origBuildFlagsObjectFunc.bind(expressionLanguage);
        
        var origFuncGetTermModes = expressionLanguage._getTermModes;
        origFuncGetTermModes.bind(expressionLanguage);
		
		//Workaround - set locale for testing to empty, so parser will use it's default locale
		expressionLanguage._localeSettings = null;
		
        String.prototype.contains = function (it) {
            return this.indexOf(it) != -1;
        };

        var titleRuleGeneration  = "Determination And BCL unit test";
        var titleBCLErrorMessage = "Understandable Errors";
        var titleTokensService   = "Tokens_Service unit test";
        var titleAutocomplete    = "AutoComplete Simulation";

        var defaultTemplate = {
            mode: "autoComplete",
            expression: "p",
            returnType: "Boolean",
            flags: {
                disableTerms: true
            }
        };

        var tokensTemplate = {
            mode: "tokens",
            returnType: "All",
            expression: "",
            "flags": {"tokensOutput": true}
        };

        var validationTemplate = {
            mode: "validate",
            returnType: "All",
            expression: ""
        };

        var parserTemplate = {
            mode: "parse",
            returnType: "Boolean",
            expression: ""
        };

        var parserTemplateAll = {
            mode: "parse",
            returnType: "All",
            expression: ""
        };

        var termsAutoTemplate = {
            mode: "autoComplete",
            expression: "p",
            returnType: "Boolean",
            flags: {
                disableTerms: false
            }
        };
        
        var friendlyTermsAutoTemplate = {
            mode: "autoComplete",
            expression: "p",
            returnType: "All",
            flags: {
                disableTerms: false
            }
        };

		var vocabularyRulesTemplate = {
			mode: "autoComplete",
			expression: "European ",
			returnType: "All",
			flags: {
				"locale": {
					"localeSettings": {
						"dateFormat": "dd/mm/yyyy",
						"timeFormat": "HH:mm:ss",
						"number": {
							"groupSeparator": ",",
							"decimalSeparator": "."
						}
					},
					"convert": {
						"source": "displayText",
						"target": "codeText"
					}
				},
				"termMode": {
					"convert": {
						"source": "displayText",
						"target": "codeText"
					}
				}
			}
		};

        var termsEnhancedAutoTemplate = {
            mode: "autoComplete",
            expression: "p",
            returnType: "BooleanEnhanced",
            flags: {
                disableTerms: true
            }
        };

        QUnit.module( "Test Gaming vocabulary", {
            beforeEach: function() {
                //Set ExpressionLanguage
                expressionLanguage._getTermModes = function(){
					return ["byName"];
		        };
                expressionLanguage.setData(oVocaGaming);
            }
        });
        
        /////////////////////////////////////////////////////   Gaming   ///////////////////////////////////////////////////////////////

        // AutoComplete
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_Boolean.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_Collection.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_Complex.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_Current.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_Arithmetics.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_ExistsIn.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_String.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_Concatenate.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_ConcatenateOutput.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_Structure.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_DateTime.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_Where.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_BooleanEnhanced.csv", termsEnhancedAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_Where.csv", termsAutoTemplate, 2, titleAutocomplete, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_Locale.csv", termsAutoTemplate, 4, titleAutocomplete, 3, 2);

        // Understandable Errors
        qUnitTestByCsvName("../qunit/data/parser/csv/BCLErrorMessagesDataBoolean.csv", parserTemplate, 2, titleBCLErrorMessage, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/BCLErrorMessagesDataAll.csv", parserTemplateAll, 2, titleBCLErrorMessage, -1, 1);

        //Validate
        qUnitTestByCsvName("../qunit/data/parser/csv/String.csv", validationTemplate, 2, titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/DateTime.csv", validationTemplate, 2, titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Arithmetics.csv", validationTemplate, 3, titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/ComparisonMultiple.csv", validationTemplate, 2, titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/ExistsIn.csv", validationTemplate, 2, titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Between.csv", validationTemplate, 2, titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Aggregations.csv", validationTemplate, 3, titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Where.csv", validationTemplate, 2, titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Complex.csv", validationTemplate, 3, titleRuleGeneration, -1, 1);
        //qUnitTestByCsvName("../qunit/data/parser/csv/Aliases.csv",validationTemplate,2,titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Params.csv", validationTemplate, 2, titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/QunitRulesPool3.csv", validationTemplate, 2, titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/SortCollection.csv", validationTemplate, 2, titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Boolean.csv", validationTemplate, 2, titleRuleGeneration, -1, 1);
        qUnitTestByCsvName("../qunit/data/parser/csv/Current.csv", validationTemplate, 3, titleRuleGeneration, -1, 1);
        //qUnitTestByCsvName("../qunit/data/parser/csv/ValidateRuleLocaleConvert.csv", validationTemplate, 3, titleRuleGeneration, -1, 1);

        //Tokens_Service
        //qUnitTestByCsvName("../qunit/data/parser/csv/TCTokenTypesValidate.csv", tokensTemplate, 2, titleTokensService, -1, 1);


        /////////////////////////////////////////////////////   Flight   ///////////////////////////////////////////////////////////////

        QUnit.module( "Test flight vocabulary", {
            beforeEach: function() {
                //Set ExpressionLanguage
                expressionLanguage._getTermModes = function(){
					return ["byName"];
		        };
                expressionLanguage.setData(oVocaFlight);
            }
        });
        
        
        // AutoComplete
        qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_Number_Locale.csv", termsAutoTemplate, 4, titleAutocomplete, 3, 2);
		
		
		
        /////////////////////////////////////////////////////   Flight - For Freindly Terms Testing  ///////////////////////////////////////////////////////////////
        QUnit.module( "Test Friendly Terms with flight vocabulary", {
            beforeEach: function() {
                //Set ExpressionLanguage
                expressionLanguage._getTermModes = origFuncGetTermModes;
                expressionLanguage.setData(oVocaFlightFriendlyTerms);
            }
        });
        
        // AutoComplete
	qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_FriendlyTerms.csv", friendlyTermsAutoTemplate, 3, titleAutocomplete, -1, 2);
		//Validate
        qUnitTestByCsvName("../qunit/data/parser/csv/Validate_Expression_FriendlyTerms.csv", validationTemplate, 4, titleRuleGeneration, 3, 2);
        
        /////////////////////////////////////////////////////   Value help Testing  ///////////////////////////////////////////////////////////////
        QUnit.module( "Test Value Help with Value Help vocabulary", {
            beforeEach: function() {
                //Set ExpressionLanguage
                expressionLanguage._getTermModes = origFuncGetTermModes;
                expressionLanguage.setData(oVocaValuehelp);
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
				expressionLanguage.setValueHelpCallback(callback);
            }
        });

        // AutoComplete
		qUnitTestByCsvName("../qunit/data/parser/csv/Autocomplete_ExternalValueHelp.csv", termsAutoTemplate, 3, titleAutocomplete, -1, 2);
		//Validate
        qUnitTestByCsvName("../qunit/data/parser/csv/BCLExternalVH.csv", validationTemplate, 3, titleRuleGeneration, 2, 1, undefined, 4);

		/////////////////////////////////////////////////////   Vocabulary Rules Testing  ///////////////////////////////////////////////////////////////
		QUnit.module( "Test Vocabulary Rules with Vocabulary Rules vocabulary", {
			beforeEach: function() {
				//Set ExpressionLanguage
				expressionLanguage._buildFlagsObject = function(){
					return {
						"locale": {
							"localeSettings": {
								"dateFormat": "dd/mm/yyyy",
								"timeFormat": "HH:mm:ss",
								"number": {
									"groupSeparator": ",",
									"decimalSeparator": "."
								}
							},
							"convert": {
								"source": "displayText",
								"target": "codeText"
							}
						},
						"termMode": {
							"convert": {
								"source": "displayText",
								"target": "codeText"
							}
						}

					};
				};
				expressionLanguage.setData(oVocaVocabularyRules);
			}
		});
		// AutoComplete
		qUnitTestByCsvName("../qunit/data/parser/csv/VocaRule_autocomplete.csv", vocabularyRulesTemplate, 3, titleAutocomplete, -1, 2);
		//Validate
		qUnitTestByCsvName("../qunit/data/parser/csv/VocaRule_Validation.csv",  validationTemplate, 4, titleRuleGeneration, 3, 2);

		function qUnitTestByCsvName(nameParam, templateParam, columnForStatus, titleSuffixParam, columnForFlags, columnForExpression, forcedExecutionMode, columnForContainedResult) {

            var totalTitle = titleSuffixParam + ", Test CSV Statements from: " + nameParam;

            QUnit.test(totalTitle, function (assert) {

                var csvStatements = [];
                var csvExpecteds = [];
                var csvFlags = [];
				var csvexpectedContainedSuccessResult = [];
                var executionMode = templateParam.mode;

                expressionLanguage._buildFlagsObject = origBuildFlagsObjectFunc;

                if (typeof forcedExecutionMode !== "undefined") {
                    executionMode = forcedExecutionMode;
                }

                var successFunc = function () {
                };
                if (executionMode == "parse") {
                    successFunc = function (data) {
                        processParserData(data.replace(/\\u2022/gi, String.fromCharCode(8226)), templateParam);
                    };
                } else if (executionMode == "validate") {
                    successFunc = function (data) {
                        processValidationData(data.replace(/\\u2022/g, String.fromCharCode(8226)), templateParam);
                    };

                }  else if (executionMode == "tokens") {

                    successFunc = function (data) {
                        processTokensData(data.replace(/\\u2022/g, String.fromCharCode(8226)), templateParam);
                    };
                } else {

                    successFunc = function (data) {
                        processData(data.replace(/\\u2022/g, String.fromCharCode(8226)), templateParam);
                    };
                }

                jQuery(document).ready(function () {
                    jQuery.ajax({
                        type: "GET",
                        async: false,
                        url: nameParam,
                        dataType: "text",
                        success: successFunc
                    });
                });

                function fillStatementsAndExpecteds(allTextParam) {
                    var allTextLines = allTextParam.replace(/\\u2022/g, String.fromCharCode(8226));
                    allTextLines = allTextLines.split(/\r\n|\n/);
                    var statements = [];
                    var expecteds = [];
                    var flags = [];
					var expectedContainedSuccessResult = [];
                    // Support csv delimiter '----'
                    var delimiter = (allTextLines[0].indexOf('----') == -1) ? ';' : '----';
                    for (var j = 0; j < allTextLines.length; j++) {
                        var entries = allTextLines[j].split(delimiter);
                        statements.push(entries[columnForExpression]);
                        expecteds.push(entries[columnForStatus]);

                        if (columnForFlags != -1){

                            flags.push(JSON.parse(entries[columnForFlags]));
                        }

                        if (entries[0] == "false") {
                            j = allTextLines.length;
                        }
						if (columnForContainedResult) {
							expectedContainedSuccessResult.push(entries[columnForContainedResult]);
						}
                    }

                    //console.log(statements);
                    csvStatements = statements;
                    csvExpecteds = expecteds;
                    csvFlags = flags;
					csvexpectedContainedSuccessResult = expectedContainedSuccessResult;
                }

                function fillStatementsAndExpectedsParser(allTextParam) {
                    //   var record_num = 5;  // or however many elements there are in each row
                    var allTextLines = allTextParam.replace(/\\u2022/g, String.fromCharCode(8226));
                    allTextLines = allTextLines.split(/\r\n|\n/);
                    //    var entries = allTextLines[0].split('~');
                    var statements = [];
                    var expecteds = [];
                    var flags = [];
                    var expectedContainedSuccessResult = [];

                    //   var c  = [];
                    for (var j = 0; j < allTextLines.length; j++) {
                        var entries = allTextLines[j].split('~');
                        statements.push(entries[1]);
                        expecteds.push(entries[columnForStatus]);

                        if (columnForFlags != -1){

                            flags.push(entries[columnForFlags]);
                        }

                        if (entries[0] == "false") {
                            j = allTextLines.length;
                        }
                        if (columnForContainedResult) {
							expectedContainedSuccessResult.push(entries[columnForContainedResult]);
						}
                    }

                    csvStatements = statements;
                    csvExpecteds = expecteds;
                    csvFlags = flags;
					csvexpectedContainedSuccessResult = expectedContainedSuccessResult;
                }

                function processData(allText, testTemplate) {
                    fillStatementsAndExpecteds(allText);
                    //remove alias suggestions from expected
                    var i;
                    function removealiases(suggestion){
                        return suggestion.tokenType != "alias";
                    }
                    for ( i=0; i  < csvExpecteds.length; i++) {
                        var expected = JSON.parse(csvExpecteds[i]).suggs;
                        var filteredExpected = {};
                        filteredExpected.suggs = expected.filter(removealiases);
                        csvExpecteds[i] = JSON.stringify(filteredExpected);
                    }
                    processStatements(csvStatements, csvExpecteds, testTemplate, csvFlags);
                }

                function processValidationData(allText, testTemplate) {
                    fillStatementsAndExpecteds(allText);
                    processValidationStatements(csvStatements, csvExpecteds, testTemplate, csvexpectedContainedSuccessResult);
                }

                function processTokensData(allText, testTemplate) {
                    fillStatementsAndExpecteds(allText);
                    processTokenStatements(csvStatements, csvExpecteds, testTemplate);
                }

                function processParserData(allText, testTemplate) {
                    fillStatementsAndExpectedsParser(allText);
                    processValidationStatements(csvStatements, csvExpecteds, testTemplate, csvFlags);
                }

                function processTokenStatements(statementsParam, expectedsParam, testTemplate) {

                    var expected = "";
                    var resultString = "";
                    var test = defaultTemplate;

                    if (typeof testTemplate !== "undefined") {
                        test = testTemplate;
                    }

                    var times = [];
                    var start, end, time;
                    var sumOfTime = 0;
                    var i, result;
                    for (i = 0; i < statementsParam.length; i++) {

                        start = new Date().getTime();
                        test.expression = statementsParam[i].replace(/\\n/gm, "\n");
                        expected = expectedsParam[i];
                        try {

                            result = expressionLanguage.getExpressionMetadata(test.expression);

                            end = new Date().getTime();
                            time = end - start;
                            times.push(time);
                            sumOfTime = sumOfTime + time;
                        } catch (e) {
                            result = e.message;
                        }

                        resultString = "\"tokens\":" + JSON.stringify(result.tokens);
                        assert.equal(resultString, expected, "Current expression: " + test.expression);
                    }
                    assert.equal("", "", "============= Execution Durations (ms): " + times.toString() +
                        " ,AverageWithLoad (ms): " + sumOfTime / times.length +
                        " ,Average (ms): " + (sumOfTime - times[0]) / (times.length - 1));
                }

                function processValidationStatements(statementsParam, expectedsParam, testTemplate, expectedContainedSuccessResult) {

                    var expected = "";
                    var resultErr;
                    var test = defaultTemplate;

                    if (typeof testTemplate !== "undefined") {
                        test = testTemplate;
                    }

                    var times = [];
                    var start, end, time;
                    var sumOfTime = 0;
                    var i, result;
					
					if (csvFlags){
						expressionLanguage._buildFlagsObject = function(){
                                return csvFlags[i];
                        };
					}
					
                    for (i = 0; i < statementsParam.length; i++) {
						
                        start = new Date().getTime();
                        test.expression = statementsParam[i];
                        expected = expectedsParam[i];
                        try {
                            result = expressionLanguage.validateExpression(test.expression, testTemplate.returnType);

                            end = new Date().getTime();
                            time = end - start;
                            times.push(time);
                            sumOfTime = sumOfTime + time;

                        } catch (e) {
                            result = e.message;
                        }

                        if (expected.contains("actualReturnType")) {
                            assert.equal(result.actualReturnType, expected.substring(20, (expected.length - 1)), "Current expression: " + test.expression);
                        } else if (expected.contains("Success")) {
                            assert.equal(result.status, "Success", "Current expression: " + test.expression);
							if (expectedContainedSuccessResult[i] && (expectedContainedSuccessResult[i].length > 1) ) {
								if (result.valueHelpMapDeferred){
									delete result.valueHelpMapDeferred;
								}
								if (result.deferredResult){
									delete result.deferredResult;
								}
								if (result.valueHelp && result.valueHelp.info){
									for ( var j=0; j  < result.valueHelp.info.length; j++) {
										if (result.valueHelp.info[j].model) {
											delete result.valueHelp.info[j].model;
										}
										if (result.valueHelp.info[j].deferred) {
											delete result.valueHelp.info[j].deferred;
										}
									}
								}
								assert.ok(JSON.stringify(result).contains(expectedContainedSuccessResult[i]), "result: " + JSON.stringify(result) + " expected to contain: " + expectedContainedSuccessResult[i]);
							}
                        } else {
                            resultErr = result.errorDetails.replace(/\n/g, "\\n");
							if(expected && expected.length > 0 && expected[expected.length - 1] == "."){
                                expected = expected.substring(0,expected.length-1);
                            }
                            assert.ok(resultErr.contains(expected), "Current expression: " + test.expression + ". \nExpected: " + expected + " \nResult: " + resultErr);
                        }
					}
                }

                function processStatements(statementsParam, expectedsParam, testTemplate, csvFlags) {

                    var expected = "";
                    var test = defaultTemplate;

                    if (typeof testTemplate !== "undefined") {
                        test = testTemplate;
                    }

                    var times = [];
                    var start, end, time;
                    var sumOfTime = 0;
                    var result;
                    var testMode = test.mode;
                    var expectedObj;
                    var resultObj;
                    var flags;

                    var i, actualResult;

                    for (i = 0; i < statementsParam.length; i++) {

                        start = new Date().getTime();
                        test.expression = statementsParam[i];
                        expected = expectedsParam[i];
                        flags = csvFlags[i];

                        try {

                            if (flags){

                                expressionLanguage._buildFlagsObject = function(){

                                    return flags;
                                };
                            }

                            actualResult = expressionLanguage.getSuggestions(test.expression, testTemplate.returnType);

                            end = new Date().getTime();
                            time = end - start;
                            times.push(time);
                            sumOfTime = sumOfTime + time;

                        } catch (e) {
                            actualResult = e.message;
                        }

                        if (testMode == "validate") {
                            expectedObj = expected;
                            assert.equal(actualResult, expectedObj, "Current expression: " + test.expression);
                            continue;

                        } else {
                            expectedObj = JSON.parse(expected);
                        }

                        if (typeof(actualResult) !== 'object') {
                            resultObj = JSON.parse(actualResult);
                        } else {
                            resultObj = actualResult;
                        }

                        if (actualResult.suggs) {

                            var sugg, z;

                            for (z = 0; z < actualResult.suggs.length; z++) {

                                sugg = actualResult.suggs[z];

                                if (sugg.info) {

                                    delete sugg['info'];
                                }
                            }
                        }

                        result = compareStrings(resultObj, expectedObj);

                        if (result.resultFlag === true) {

                            assert.equal(true, true, "Current expression: " + test.expression);

                        } else {
                        	var bSuggestionExists = result.actualSugg.map(function (suggestion) {
					return suggestion;
				}).indexOf((result.expectedSugg[0]) > -1);
				assert.ok(bSuggestionExists, "Current expression: " + test.expression);
                        }
                    }
                }

                function compareStrings(actualResults, expectedResults) {

                    var i;
                    var outExpected = [], outResults = [];
                    var missingInActual = [];
                    var extraInActual = [];
                    var result;

                    /**
                     * Run on the income results and expected  and parse only the completion
                     */
                    for (i = 0; i < actualResults.suggs.length; i++) {
                        outResults[i] = actualResults.suggs[i].completion;
                    }
                    for (i = 0; i < expectedResults.suggs.length; i++) {
                        outExpected[i] = expectedResults.suggs[i].completion;
                    }

                    outResults.sort(function (a, b) {
                        if (a > b) {
                            return 1;
                        }
                        if (a < b) {
                            return -1;
                        }
                        return 0;
                    });

                    outExpected.sort(function (a, b) {
                        if (a > b) {
                            return 1;
                        }
                        if (a < b) {
                            return -1;
                        }
                        return 0;
                    });

                    /**
                     * check if results and expected have the same members
                     */

                    var outExpectedSorted = outExpected.join(",");

                    var outResultsSorted = outResults.join(",");

                    if (outExpectedSorted === outResultsSorted) {
                        result = true;
                    } else {
                        result = false;
                    }

                    return {
                        "resultFlag": result,
                        "actualSugg": outResults,
                        "expectedSugg": outExpected,
                        "missingInActual": missingInActual,
                        "extraInActual": extraInActual
                    };
                }
            });
        }
    }, /* bExport= */ true);
