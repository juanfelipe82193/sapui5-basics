/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define(["jquery.sap.global", "sap/rules/ui/services/ExpressionLanguage"],

    function(jQuery, ExpressionLanguage) {
        "use strict";

        //Create ExpressionLanguage
        var expressionLanguage = new ExpressionLanguage();
		
		//Workaround - enforce ExprLang to generate terms by Name only
		expressionLanguage._getTermModes = function(){
			return ["byName"];
        };
		
        var titleValidateRule  = "validateRule";

        QUnit.test(titleValidateRule, function (assert) {

            var csvStatements = [];
            var csvExpecteds = [];
            var csvTestTitles = [];
            var csvVocabularies = [];
            var nameParam = "../qunit/data/parser/csv/validationRulebodyOData.csv";

            var successFunc = function (data) {
                fillStatementsAndExpecteds(data.replace(/\\u2022/g, String.fromCharCode(8226)));
                processStatements(csvStatements, csvExpecteds, csvTestTitles, csvVocabularies);
            };

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
                var allTextLines = allTextParam.split(/\r\n|\n/);
                var statements = [];
                var expecteds = [];
                var testTitles = [];
                var vocabularies = [];

                // Support csv delimiter '----'
                var delimiter = (allTextLines[0].indexOf('----') == -1) ? ';' : '----';
                for (var j = 0; j < allTextLines.length; j++) {
                    var entries = allTextLines[j].split(delimiter);
                    testTitles.push(entries[1]);
                    statements.push(entries[2]);
                    expecteds.push(entries[3]);
                    vocabularies.push(entries[4]);

                    if (entries[0] == "false") {
                        j = allTextLines.length;
                    }
                }

                csvStatements = statements;
                csvExpecteds = expecteds;
                csvTestTitles = testTitles;
                csvVocabularies = vocabularies;
            }

            function processStatements(statementsParam, expectedsParam, testTitles, arrVoca) {

                var expected = "";
                var testTitle = "";
                var times = [];
                var start, end, time;
                var sumOfTime = 0;
                var expectedObj;

                var i, actualResult;

                for (i = 0; i < statementsParam.length; i++) {
                    start = new Date().getTime();
                    expected = JSON.parse(expectedsParam[i]);
                    if (expected.output && expected.output.hasOwnProperty("decisionTableData")){
						expressionLanguage._addOdataTags(expected.output.decisionTableData);
		            }
                    expected = JSON.stringify(expected);
                    testTitle = testTitles[i];

                    try {
                        expressionLanguage.setData(JSON.parse(arrVoca[i]).content);
                        actualResult = expressionLanguage.validateRule(JSON.parse(statementsParam[i]).content);
                        end = new Date().getTime();
                        time = end - start;
                        times.push(time);
                        sumOfTime = sumOfTime + time;

                    } catch (e) {
                        actualResult = e.message;
                    }

                    expectedObj = expected;
                    assert.equal(JSON.stringify(actualResult), expectedObj, testTitle);

                }
            }

        });
    }, /* bExport= */ true);