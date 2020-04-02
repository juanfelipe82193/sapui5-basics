sap.ui.require([
        'sap/ui/test/Opa5',
        'sap/ui/test/matchers/AggregationLengthEquals',
        'sap/ui/test/matchers/PropertyStrictEquals',
        'sap/rules/ui/integration/pages/Common',
        'sap/ui/test/matchers/BindingPath',
        "sap/ui/test/actions/Press",
        "sap/ui/test/actions/EnterText"
    ],
    function(Opa5, AggregationLengthEquals, PropertyStrictEquals, Common, BindingPath, Press, EnterText) {
        "use strict";

        /*var sViewName = "ExpressionAdvancedApp",
        eeId = "myAdvanceExpressionEditor";*/
        Opa5.createPageObjects({
            onTheExpressionAdvancedValueHelpPage: {
                baseClass: Common,
                actions: {
                    iCanSeeTheExpressionAdvanced: function(successMessage, sExpressionAdvancedID, sViewName) {
                        return this.waitFor({
                            id: sExpressionAdvancedID,
                            viewName: sViewName,
                            success: function() {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "The Expression Advanced isn't shown"
                        });
                    },
                    iSelectFromAutoSuggestion: function(successMessage, sViewName) {
                        return this.waitFor({
                            controlType: sap.rules.ui.ExpressionAdvanced,
                            viewName: sViewName,
                            success: function(oExpressionAdvanced) {
                                oExpressionAdvanced[0].codeMirror.execCommand("autocomplete");
                                var element = document.getElementsByClassName("CodeMirror-hint");
                                element[2].click();
                                oExpressionAdvanced[0].codeMirror.execCommand("autocomplete");
                                var element = document.getElementsByClassName("CodeMirror-hint");
                                element[0].click();
                                oExpressionAdvanced[0].codeMirror.execCommand("autocomplete");
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't activate auto complete"
                        });
                    },
                    iClickOnValueHelpLink: function(successMessage, sViewName) {
                        return this.waitFor({
                            controlType: sap.rules.ui.ExpressionAdvanced,
                            viewName: sViewName,
                            success: function(oExpressionAdvanced) {
                                oExpressionAdvanced[0].codeMirror.execCommand("autocomplete");
                                var element = document.getElementsByClassName("CodeMirror-hint");
                                element[0].click();
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't activate auto complete"
                        });
                    },
                    iClickOnValueInputField: function(successMessage, sViewName) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Input",
                            viewName: sViewName,
                            success: function(oInput) {
                                oInput[0].fireValueHelpRequest();
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't find Value Input Field"
                        });
                    },
                    iAddValueForFilter: function(successMessage, sViewName, sFilterValue) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Input",
                            viewName: sViewName,
                            success: function(oInput) {
                                oInput[2].setValue(sFilterValue);
                                oInput[2].fireChange();
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't find Value Input Field"
                        });
                    },
                    iPressOkButton: function(successMessage, buttonText, sViewName) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Button",
                            //id: sButtonId,
                            viewName: sViewName,
                            success: function(oButton) {
                                oButton[6].firePress();
                                Opa5.assert.ok(true, successMessage);
                            },

                            errorMessage: "The button " + buttonText + " is not found"
                        });
                    },
                    iPressGoButton: function(successMessage, buttonText, sViewName) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Button",
                            viewName: sViewName,
                            success: function(oButton) {
                                oButton[1].firePress();
                                Opa5.assert.ok(true, successMessage);
                            },

                            errorMessage: "The button " + buttonText + " is not found"
                        });
                    },
                    iClickOnFirstFilteredItem: function(successMessage, sViewName) {
                        return this.waitFor({
                            controlType: "sap.ui.table.Row",
                            viewName: sViewName,
                            searchOpenDialogs: true,

                            success: function(oRows) {
                                oRows[0].getCells()[0].$().trigger("click");
                            },
                            errorMessage: "The Value Help Token can't be selected"
                        });
                    }
                },
                assertions: {
                    iCanSeeValueHelpLinkInAutoComplete: function(successMessage) {
                        return this.waitFor({
                            matchers: function(o) {
                                var oUl = document.getElementsByClassName("CodeMirror-hints");
                                var valueHelp = oUl[0].getElementsByClassName("CodeMirror-hint-valueHelp");
                                var bFlag;
                                valueHelp.length > 0 ? bFlag = true : bFlag = false;
                                return bFlag;
                            },
                            success: function(advanceExpressionEditor) {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't see the valueHelp in the auto suggestion"
                        });
                    },
                    iCanSeeValueHelpDialog: function(successMessage) {
                        return this.waitFor({
                            controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
                            // viewName: sViewName,
                            searchOpenDialogs: true,
                            matchers: function(oValueHelpDialog) {
                                return oValueHelpDialog && oValueHelpDialog.theTable && oValueHelpDialog.theTable.getAggregation("rows") && oValueHelpDialog
                                    .theTable.getAggregation("rows");
                            },
                            success: function(oNode) {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "The Value Help Dialog isn't shown"
                        });
                    },
                    iCanSeeTheFilteredValue: function(successMessage, sFilterValue) {
                        return this.waitFor({
                            controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
                            // viewName: sViewName,
                            searchOpenDialogs: true,
                            matchers: function(oValueHelpDialog) {
                                return oValueHelpDialog && oValueHelpDialog.theTable && oValueHelpDialog.theTable.getAggregation("rows")[0].getCells()[0].getText() ===
                                    sFilterValue;
                            },
                            success: function(oNode) {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "The Value Help Dialog isn't shown"
                        });
                    },
                    iCanSeeTheValueHelpSelected: function(successMessage, sViewName, sValue) {
                        return this.waitFor({
                            viewName: sViewName,
                            matchers: function(oExpressionAdvanced) {
                                return new PropertyStrictEquals({
                                    controlType: "sap.rules.ui.ExpressionAdvanced",
                                    name: "value",
                                    value: sValue
                                }).isMatching(oExpressionAdvanced);
                            },
                            success: function(advanceExpressionEditor) {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "The value Help is not set on The Expression Advanced"
                        });
                    }
                }
            }
        });
    });