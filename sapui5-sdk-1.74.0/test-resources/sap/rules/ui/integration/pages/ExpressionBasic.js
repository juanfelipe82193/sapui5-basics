sap.ui.require([
		'sap/ui/test/Opa5',
		'sap/ui/test/matchers/AggregationLengthEquals',
		'sap/ui/test/matchers/PropertyStrictEquals',
		'sap/rules/ui/integration/pages/Common',
		'sap/ui/test/matchers/BindingPath',
        "sap/ui/test/actions/Press",
		"sap/ui/test/actions/EnterText"
	],
	function (Opa5, AggregationLengthEquals, PropertyStrictEquals, Common, BindingPath, Press, EnterText) {
	    "use strict";
	    var getInstruction = function (oExpressionBasic, index) {
	        return oExpressionBasic.getAggregation("_instructionRenderer").getAggregation("_content")[index];
	    }

	    Opa5.createPageObjects({
	        onTheExpressionBasicPage: {
	            baseClass: Common,
	            actions: {
	                iClickOnInstruction: function (successMessage, iIndex, sExpressionBasicID, sViewName) {
	                    return this.waitFor({
	                        id: sExpressionBasicID,
	                        viewName: sViewName,
	                        success: function (oExpressionBasic) {
	                            var oSelect = getInstruction(oExpressionBasic, iIndex);
	                            var oPress = new Press();
	                            oPress.executeOn(oSelect);
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Can't found the instruction"
	                    });
	                },
	                iClickOnItemFromSelect: function (successMessage, sSelectOption, sViewName) {
	                    return this.waitFor({
	                        controlType: "sap.ui.core.Item",
	                        viewName: sViewName,
	                        success: function (aItem) {
	                            var oPress = new Press();
	                            for (var i = 0; i < aItem.length; i++) {
	                                if (aItem[i].getText() === sSelectOption) {
	                                    oPress.executeOn(aItem[i]);
	                                }
	                            }
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Can't found any suggestions"
	                    });
	                },
	                iSetValueInInstruction: function (successMessage, iIndex, sValue, sExpressionBasicID, sViewName) {
	                    return this.waitFor({
	                        id: sExpressionBasicID,
	                        viewName: sViewName,
	                        success: function (oExpressionBasic) {
	                            var oSelect = getInstruction(oExpressionBasic, iIndex);
                                if (oSelect instanceof sap.m.DatePicker) {
                                    oSelect.setValue(sValue);
                                    oSelect.fireChange();
                                    
                                } else {
                                    var oEnterText = new EnterText();
                                    oEnterText.setText(sValue);
                                    oEnterText.executeOn(oSelect);
                                    getInstruction(oExpressionBasic, 1).focus();
                                }
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Can't found the instruction"
	                    });
	                },
	                iSetDateInInstruction: function (successMessage, iIndex, sValue, sExpressionBasicID, sViewName) {
	                    return this.waitFor({
	                        id: sExpressionBasicID,
	                        viewName: sViewName,
	                        success: function (oExpressionBasic) {
	                            var oDatePicker = getInstruction(oExpressionBasic, iIndex).getAggregation("_picker");
	                            var oEnterText = new EnterText();
	                            oEnterText.setText(sValue);
	                            oEnterText.executeOn(oDatePicker);
	                            //oSelect.setValue(sValue);
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Can't found the instruction"
	                    });
	                },
                    iRequestHalueHelp: function (successMessage, iIndex, sViewName) {
	                    return this.waitFor({
                            controlType: "sap.rules.ui.ExpressionBasic",
	                        viewName: sViewName,
                            matchers: function(oExpressionBasic) {
                                var oInput = getInstruction(oExpressionBasic, iIndex);
                                if (oInput instanceof sap.m.Input) {
                                    oInput.fireValueHelpRequest();
                                    return true;   
                                }
                                return false;                                
                            },
	                        success: function (oExpressionBasic) {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Can't found the input"
	                    });
	                },
                    iSetValueInExpressionBasic: function (successMessage, sValue) {
	                    return this.waitFor({
	                        controlType: "sap.rules.ui.ExpressionBasic",
	                        success: function (oExpressionBasic) {
	                            oExpressionBasic[0].setValue(sValue);
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Can't found the instruction"
	                    });
	                }
	            },
	            assertions: {
	                iCanSeeTheExpressionBasic: function (successMessage, sExpressionBasicID, sViewName) {
	                    return this.waitFor({
	                        id: sExpressionBasicID,
	                        viewName: sViewName,
	                        success: function () {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Can't found the ExpressionBasic"
	                    });
	                },
	                iCheckExpressionBasicValue: function (successMessage, sValue, sExpressionBasicID, sViewName) {
	                    return this.waitFor({
	                        id: sExpressionBasicID,
                            controlType: "sap.rules.ui.ExpressionBasic",
	                        matchers: function (oExpressionBasic) {
	                            return new PropertyStrictEquals({
	                                controlType: "sap.rules.ui.ExpressionBasic",
	                                name: "value",
	                                value: sValue
	                            }).isMatching(oExpressionBasic);
	                        },
	                        success: function (oExpressionBasic) {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "The ExpressionBasic has wrong value"
	                    });
	                },
	                iCheckInstructionIsEnabled: function (successMessage, index, bEnabled) {
	                    return this.waitFor({
	                        controlType: "sap.rules.ui.ExpressionBasic",
	                        matchers: function (oExpressionBasic) {
	                            var oInstruction = oExpressionBasic.getAggregation("_instructionRenderer").getAggregation("_content")[index];
                                return oInstruction.getEnabled() === bEnabled;
	                        },
	                        success: function () {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "The ExpressionBasic has wrong amounr of instructions"
	                    });
	                },
                    iCheckAmountOfInstruction: function (successMessage, iAmount, sExpressionBasicID, sViewName) {
	                    return this.waitFor({
	                        id: sExpressionBasicID,
	                        controlType: "sap.rules.ui.ExpressionBasic",
	                        matchers: function (oExpressionBasic) {
                                var oInstructionRenderer = oExpressionBasic.getAggregation("_instructionRenderer")
                                if (oInstructionRenderer) {
                                    return oInstructionRenderer.getAggregation("_content").length === iAmount;
                                }
	                            return false;
	                        },
	                        success: function () {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "The ExpressionBasic has wrong amounr of instructions"
	                    });
	                },
	                iCheckAmountOfControls: function (successMessage, sViewName, sControlType, iAmount) {
	                    return this.waitFor({
	                        controlType: sControlType,
	                        viewName: sViewName,
	                        check: function (oControls) {
	                            return oControls.length === iAmount;
	                        },
	                        success: function () {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "The ExpressionBasic has wrong amount of instructions"
	                    });
	                },
                    iCheckErrorInInputControl: function (successMessage, sViewName, sControlType) {
	                    return this.waitFor({
	                        controlType: sControlType,
	                        viewName: sViewName,
	                        matchers: function (oControl) {
	                            return oControl.getProperty("valueState").toString() === sap.ui.core.ValueState.Error;
	                        },
	                        success: function () {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "The sap.m.Input control dont have error valueState"
	                    });
	                }
	            }
	        }
	    });
	});