sap.ui.require(['jquery.sap.global','sap/rules/ui/ExpressionBasic','sap/rules/ui/services/ExpressionLanguage'],
    function (jQuery, ExpressionBasic, ExpressionLanguage) {
        'use strict';
        var oVocaGaming = (function getTestData(){
            return jQuery.sap.sjax({
                url: '../qunit/data/parser/vocabulary/gaming.txt',
                dataType: "json"
            }).data;
        })();

        //================================================================================
        // Carousel Properties
        //================================================================================
        QUnit.module("Advanced Expression Editor", {
            beforeEach: function (){
                this.oVocaGaming = oVocaGaming;
                this.oParser = new ExpressionLanguage();
                this.oParser.setData(this.oVocaGaming);
                if (this.oExpressionEditor) {
                    this.oExpressionEditor.destroy();
                }
                
                var oExpressionLanguage = new ExpressionLanguage();
                oExpressionLanguage.setData(oVocaGaming);
                
                this.oExpressionBasic = new ExpressionBasic({/*expressionLanguage: this.oParser*/});
                this.oExpressionBasicEL = new ExpressionBasic({
                    expressionLanguage: oExpressionLanguage,
                    value: ""
                });
            }
            //tear
        });
  
 //================================================================================
        // Test _onChange
        //================================================================================
        QUnit.test("Test ExpressionBasic SetValue, _onChange, _reload, _removeFurtherInstructions", function(assert){

				//********* ExpressionBasic CSV fetch *********
                var csvExpressions = [];
                var csvTrimmedExpressions = [];
                var csvExpectedInstructionIndex2 = [];
                var csvExpectedInstructionIndex3 = [];
				var csvName = "../qunit/data/csv/ExpressionBasicOnChange.csv";
                var  successFunc = function (data) {
                        fillExpressionsAndExpecteds(data.replace(/\\u2022/gi, String.fromCharCode(8226)));
                    };

                jQuery(document).ready(function () {
                    jQuery.ajax({
                        type: "GET",
                        async: false,
                        url: csvName,
                        dataType: "text",
                        success: successFunc
                    });
                });

                function fillExpressionsAndExpecteds(allTextParam) {
                    var allTextLines = allTextParam.replace(/\\u2022/g, String.fromCharCode(8226));
                    allTextLines = allTextLines.split(/\r\n|\n/);
                    // Support csv delimiter '----'
                    var delimiter = (allTextLines[0].indexOf('----') == -1) ? ';' : '----';
                    for (var j = 0; j < allTextLines.length; j++) {
                        var entries = allTextLines[j].split(delimiter);
                        csvExpressions.push(entries[1]);
                        csvTrimmedExpressions.push(entries[2]);
                        csvExpectedInstructionIndex2.push(entries[3]);
                        csvExpectedInstructionIndex3.push(entries[4]);

                        if (entries[0] == "false") {
                            j = allTextLines.length;
                        }
                    }
                }
            
			// ********* Test Logic *********
			var oInstructionsRenderer;
			var fullExpression;
			var trimmedExpression;
			var iterationSuffix;
			var currentExpression;
			
			for (var i = 0; i < csvExpressions.length; i++){
				currentExpression = csvExpressions[i]; 
				iterationSuffix = "Expression" + (i+1) + ": ";
				this.oExpressionBasicEL.setValue(currentExpression);
				this.oExpressionBasicEL._reload();
				oInstructionsRenderer = this.oExpressionBasicEL.getAggregation("_instructionRenderer");
				//setValue: Make instructionRenderer create the UI Controls by the instructions and check after that
				oInstructionsRenderer.onBeforeRendering();
				assert.equal(this.oExpressionBasicEL.getValue(),currentExpression, "***" + iterationSuffix + currentExpression + "***"); 
				assert.equal(oInstructionsRenderer.getAggregation("_content").length,this.oExpressionBasicEL.instructions.length, "test controls rendering: number of controls equals " + this.oExpressionBasicEL.instructions.length); 
 
	            fullExpression = oInstructionsRenderer.getExpression();
	            this.oExpressionBasicEL._removeFurtherInstructions(0);
	            trimmedExpression = oInstructionsRenderer.getExpression();
				//Check onChange instructions removal step
	            assert.deepEqual(fullExpression, currentExpression, iterationSuffix + "test InstructionsRenderer getExpression");
	            assert.deepEqual(trimmedExpression, csvTrimmedExpressions[i], iterationSuffix + "test Remove Instructions: getExpression after removal");
	            assert.deepEqual(this.oExpressionBasicEL.instructions.length, 1, iterationSuffix + "test Remove Instructions: Number of instructions");
			}
				
		});		
        //================================================================================
        // Test validate
        //================================================================================
        QUnit.test("Test _createInstructions", function(assert){

            /********* 1st test - test instruction for left side (terms) **************/
            
            var suggestions = [{"sugg":["age of the player","name of the player"],"currentValue":"age of the player","tokenCategory":"vocabulary"}];
                
            var instructions = this.oExpressionBasic._createInstructions(suggestions);
            
            var expected = [{"text":"age of the player","token":"age of the player","valueOptions":{"type":"Set","values":[{"token":"age of the player","text":"age of the player"},{"token":"name of the player","text":"name of the player"}]},"visible":true,"editable":true}];

            assert.deepEqual(instructions, expected, "test instruction for left side");

            /********* 2nd test - test instruction for simple right side  **************/

            var suggestions = [{"BDT":"Number","currentValue":"20","tokenCategory":"constant.dynamic"}];

            var instructions = this.oExpressionBasic._createInstructions(suggestions);

            var expected = [{"token":20,"text":20,"businessDataType":"Number","visible":true,"editable":true}];

            assert.deepEqual(instructions, expected, "test instruction for simple type on right side");
           

            /********* 3rd test **************/

            var suggestions = [{"BDT":"Number","currentValue":"20","tokenCategory":"constant.dynamic"},{"sugg":["seconds","minutes","hours","days","weeks","months","years"],"currentValue":"years","tokenCategory":["constant.dynamic","reservedword.UOM"]}];

            var instructions = this.oExpressionBasic._createInstructions(suggestions);

            var expected = [{"token":20,"text":20,"businessDataType":"Number","visible":true,"editable":true},{"token":"years","text":"years","visible":true,"editable":true,"valueOptions":{"type":"Set","values":[{"token":"seconds","text":"seconds"},{"token":"minutes","text":"minutes"},{"token":"hours","text":"hours"},{"token":"days","text":"days"},{"token":"weeks","text":"weeks"},{"token":"months","text":"months"},{"token":"years","text":"years"}]}}];

            assert.deepEqual(instructions, expected, "test instruction for TimeSpan on right side");


            /********* 4th test **************/

            var suggestions = [{"sugg":["today","yesterday","tomorrow"],"BDT":"Date","currentValue":"16/03/2015","tokenCategory":["const.dynamic","reservedword.value"]}];

            var instructions = this.oExpressionBasic._createInstructions(suggestions);

            var expected = [{"token":"16/03/2015","text":"16/03/2015","businessDataType":"Date","valueOptions":{"type":"Set","values":[{"token":"today","text":"today"},{"token":"yesterday","text":"yesterday"},{"token":"tomorrow","text":"tomorrow"}]},"visible":true,"editable":true}];

            assert.deepEqual(instructions, expected, "test instruction for Date on right side");

            /********* 5th test **************/

            var suggestions = [{"BDT":"Number","currentValue":"20","tokenCategory":"constant.dynamic"},{"currentValue":"to","tokenCategory":"reservedword.undefined"},{"BDT":"Number","currentValue":"40","tokenCategory":"constant.dynamic"}];

            var instructions = this.oExpressionBasic._createInstructions(suggestions);

            var expected = [{"token":20,"text":20,"businessDataType":"Number","visible":true,"editable":true},{"token":"to","text":"to","visible":true,"editable":false},{"token":40,"text":40,"businessDataType":"Number","visible":true,"editable":true}];

            assert.deepEqual(instructions, expected, "test instruction for isBetween on right side");

            /********* 6th test **************/

            var suggestions = [{"BDT":"Number","currentValue":"20","tokenCategory":"constant.dynamic"},{"sugg":["seconds","minutes","hours","days","weeks","months","years"],"currentValue":"minutes","tokenCategory":"reservedword.UOM"},{"currentValue":"to","tokenCategory":"reservedword.undefined"},{"BDT":"Number","currentValue":"40","tokenCategory":"constant.dynamic"},{"sugg":["seconds","minutes","hours","days","weeks","months","years"],"currentValue":"minutes","tokenCategory":"reservedword.UOM"}];

            var instructions = this.oExpressionBasic._createInstructions(suggestions);
            
            var expected = [{"token":20,"text":20,"businessDataType":"Number","visible":true,"editable":true},{"token":"minutes","text":"minutes","visible":true,"editable":true,"valueOptions":{"type":"Set","values":[{"token":"seconds","text":"seconds"},{"token":"minutes","text":"minutes"},{"token":"hours","text":"hours"},{"token":"days","text":"days"},{"token":"weeks","text":"weeks"},{"token":"months","text":"months"},{"token":"years","text":"years"}]}},{"token":"to","text":"to","visible":true,"editable":false},{"token":40,"text":40,"businessDataType":"Number","visible":true,"editable":true},{"token":"minutes","text":"minutes","visible":true,"editable":true,"valueOptions":{"type":"Set","values":[{"token":"seconds","text":"seconds"},{"token":"minutes","text":"minutes"},{"token":"hours","text":"hours"},{"token":"days","text":"days"},{"token":"weeks","text":"weeks"},{"token":"months","text":"months"},{"token":"years","text":"years"}]}}];

            assert.deepEqual(instructions, expected, "test instruction for isBetween (TimeSpan) on right side");

            /********* 7th test **************/

            var suggestions = [{"sugg":["today","yesterday","tomorrow"],"BDT":"Date","currentValue":"16/03/2015","tokenCategory":["const.dynamic","reservedword.value"]},{"currentValue":"to","tokenCategory":"reservedword.undefined"},{"sugg":["today","yesterday","tomorrow"],"BDT":"Date","currentValue":"18/03/2015","tokenCategory":["const.dynamic","reservedword.value"]}];

            var instructions = this.oExpressionBasic._createInstructions(suggestions);

            var expected = [{"token":"16/03/2015","text":"16/03/2015","businessDataType":"Date","valueOptions":{"type":"Set","values":[{"token":"today","text":"today"},{"token":"yesterday","text":"yesterday"},{"token":"tomorrow","text":"tomorrow"}]},"visible":true,"editable":true},{"token":"to","text":"to","visible":true,"editable":false},{"token":"18/03/2015","text":"18/03/2015","businessDataType":"Date","valueOptions":{"type":"Set","values":[{"token":"today","text":"today"},{"token":"yesterday","text":"yesterday"},{"token":"tomorrow","text":"tomorrow"}]},"editable":true,"visible":true}];

            assert.deepEqual(instructions, expected, "test instruction for isBetween (Date) on right side");

            /********* 8th test **************/

            var suggestions = [{"currentValue":"(","tokenCategory":"reservedword.null"},{"BDT":"Number","currentValue":"20","tokenCategory":"constant.dynamic"},[{"currentValue":",","tokenCategory":"reservedword.null"},{"BDT":"Number","tokenCategory":"constant.dynamic"}],{"currentValue":")","tokenCategory": "reservedword.null"}];

            var instructions = this.oExpressionBasic._createInstructions(suggestions);

            delete  instructions[2].callback;

            var expected = [{"token":"(","text":"(","visible":true,"editable":false},{"token":20,"text":20,"businessDataType":"Number","visible":true,"editable":true},{"type":"action","visible":true,"editable":true},{"token":")","text":")","visible":true,"editable":false}];

            assert.deepEqual(instructions, expected, "test instruction for existsIn on right side");

            /********* 9th test **************/

            var suggestions = [{"currentValue":"(","tokenCategory":"reservedword.null"},{"BDT":"Number","currentValue":"20","tokenCategory":" constant.dynamic"},{"sugg":["seconds","minutes","hours","days","weeks","months","years"],"currentValue":"days","tokenCategory":"reservedword.UOM"},[{"currentValue":",","tokenCategory":"reservedword.null"},{"BDT":"Number","currentValue":"20","tokenCategory":" constant.dynamic"},{"sugg":["seconds","minutes","hours","days","weeks","months","years"],"currentValue":"days","tokenCategory":"reservedword.UOM"}],{"currentValue":")","tokenCategory":"reservedword.null"}];

            var instructions = this.oExpressionBasic._createInstructions(suggestions);

            delete  instructions[3].callback;

            var expected = [{"token":"(","text":"(","visible":true,"editable":false},{"token":20,"text":20,"businessDataType":"Number","visible":true,"editable":true},{"token":"days","text":"days","visible":true,"editable":true,"valueOptions":{"type":"Set","values":[{"token":"seconds","text":"seconds"},{"token":"minutes","text":"minutes"},{"token":"hours","text":"hours"},{"token":"days","text":"days"},{"token":"weeks","text":"weeks"},{"token":"months","text":"months"},{"token":"years","text":"years"}]}},{"type":"action","visible":true,"editable":true},{"token":")","text":")","visible":true,"editable":false}];

            assert.deepEqual(instructions, expected, "test instruction for existsIn (TimeSpan) on right side");

            /********* 10th test **************/

            var suggestions = [{"currentValue":"(","tokenCategory":"reservedword.null"},{"sugg":["today","yesterday","tomorrow"],"BDT":"Date","currentValue":"16/03/2015"},[{"token":",","text":",","visible":true,"editable":true,"tokenCategory":"reservedword.null"},{"sugg":["today","yesterday","tomorrow"],"BDT":"Date","tokenCategory":["const.dynamic","reservedword.value"]}],{"currentValue":")","tokenCategory":"reservedword.null"}];

            var instructions = this.oExpressionBasic._createInstructions(suggestions);

            delete  instructions[2].callback;

            var expected = [{"token":"(","text":"(","visible":true,"editable":false},{"token":"16/03/2015","text":"16/03/2015","businessDataType":"Date","valueOptions":{"type":"Set","values":[{"token":"today","text":"today"},{"token":"yesterday","text":"yesterday"},{"token":"tomorrow","text":"tomorrow"}]},"visible":true,"editable":true},{"type":"action","visible":true,"editable":true},{"token":")","text":")","visible":true,"editable":false}];

            assert.deepEqual(instructions, expected, "test instruction for existsIn (Date) on right side");
        });

});