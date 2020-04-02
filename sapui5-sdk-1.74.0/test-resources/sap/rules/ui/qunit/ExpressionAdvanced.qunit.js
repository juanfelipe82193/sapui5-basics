sap.ui.require(['jquery.sap.global','sap/rules/ui/ExpressionAdvanced','sap/rules/ui/services/ExpressionLanguage'],
    function (jQuery, ExpressionAdvanced, ExpressionLanguage) {
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
            setup: function (){
                this.oVocaGaming = oVocaGaming;
                this.oParser = new ExpressionLanguage();
                this.oParser.setData(this.oVocaGaming);
                if (this.oExpressionEditor) {
                    this.oExpressionEditor.destroy();
                }
                this.oExpressionEditor = new ExpressionAdvanced({expressionLanguage: this.oParser});
                this.oExpressionEditor.placeAt("content");
            }
            //tear
        });

        //================================================================================
        // Test validate
        //================================================================================
        QUnit.test("Test validate", function(){

            this.oExpressionEditor.setValue( "age of the player > 10");
            var result = this.oExpressionEditor.validate();
            var expectedString = "Success";
            var actualString = result.status;
            equal(actualString, expectedString, "validate for 'age of the player > 10'");

            /********* 2nd test **************/
            this.oExpressionEditor.setValue( "age of the player > age of the player2");
            result = this.oExpressionEditor.validate();
            expectedString = "Error";
            actualString = result.status;

            equal(actualString, expectedString, "Negative testing - should fail for 'age of the player > age of the player2'");
        });

        //================================================================================
        // Test properties
        //================================================================================
        QUnit.test("Test properties", function(){

            // test value
            this.oExpressionEditor.setValue( "age of the player > 10");
            var result = this.oExpressionEditor.getValue();
            var expectedString = "age of the player > 10";
            var actualString = result;
            equal(actualString, expectedString, "Test value for 'age of the player > 10'");

            // test type
            this.oExpressionEditor.setType( "Number");
            result = this.oExpressionEditor.getType();
            expectedString = "Number";
            actualString = result;
            equal(actualString, expectedString, "Test parseType 'Number'");

            // test collection
            this.oExpressionEditor.setCollection(true);
            result = this.oExpressionEditor.getCollection();
            var expected = true;
            var actual = result;
            equal(actual, expected, "Test collection is true");

            // test placeholder
            this.oExpressionEditor.setPlaceholder("Please enter an expression");
            result = this.oExpressionEditor.getPlaceholder();
            expectedString = "Please enter an expression";
            actualString = result;
            equal(actualString, expectedString, "Test placeholder is set to 'Please enter an expression'");

            // test validateOnLoad
            this.oExpressionEditor.setValidateOnLoad(true);
            result = this.oExpressionEditor.getValidateOnLoad();
            expected = true;
            actual = result;
            equal(actual, expected, "Test validateOnLoad is true");

            this.oExpressionEditor.setValidateOnLoad(false);
            result = this.oExpressionEditor.getValidateOnLoad();
            expected = false;
            actual = result;
            equal(actual, expected, "Test validateOnLoad is false");

            // test focusOnLoad
            this.oExpressionEditor.setFocusOnLoad(true);
            result = this.oExpressionEditor.getFocusOnLoad();
            expected = true;
            actual = result;
            equal(actual, expected, "Test focusOnLoad is true");

            this.oExpressionEditor.setFocusOnLoad(false);
            result = this.oExpressionEditor.getFocusOnLoad();
            expected = false;
            actual = result;
            equal(actual, expected, "Test focusOnLoad is false");

            // test valueStateText
            this.oExpressionEditor.setValueStateText("an error was reported");
            result = this.oExpressionEditor.getValueStateText();
            expectedString = "an error was reported";
            actualString = result;
            equal(actualString, expectedString, "Test valueStateText is 'an error was reported'");

        });
    });