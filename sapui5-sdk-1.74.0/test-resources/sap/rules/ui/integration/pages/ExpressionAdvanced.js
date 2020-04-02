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

	    Opa5.createPageObjects({
	        onTheExpressionAdvancedPage: {
	            baseClass: Common,
	            actions: {
	                iCanSeeTheExpressionAdvanced: function (successMessage, sExpressionAdvancedID, sViewName) {
	                    return this.waitFor({
	                        id: sExpressionAdvancedID,
	                        viewName: sViewName,
	                        success: function () {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "The Expression Advanced isn't shown"
	                    });
	                },
	                iEnterExpression: function (successMessage, sExpressionAdvancedID, sExpressionValue, sViewName) {
	                    return this.waitFor({
	                        id: sExpressionAdvancedID,
	                        viewName: sViewName,
	                        success: function (oExpressionAdvanced) {
	                            oExpressionAdvanced.setValue(sExpressionValue);
	                            oExpressionAdvanced.validate();
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Can't enter expression to the Expression Advanced"
	                    });
	                },
	                iActivateAutoComplete: function (successMessage, sViewName) {
	                    return this.waitFor({
	                        controlType: sap.rules.ui.ExpressionAdvanced,
	                        viewName: sViewName,
	                        success: function (oExpressionAdvanced) {
                                setTimeout(function(){
                                    oExpressionAdvanced[0].codeMirror.execCommand("autocomplete");
                                    Opa5.assert.ok(true, successMessage);
                                }.bind(oExpressionAdvanced), 100);
	                        },
	                        errorMessage: "Can't activate auto complete"
	                    });
	                },
	                iClickOnValueHelpLink: function (successMessage, sViewName, sValue) {
	                    return this.waitFor({
	                        controlType: sap.rules.ui.ExpressionAdvanced,
	                        viewName: sViewName,
	                        matchers: function (oExpressionAdvanced) {
	                            var oLink = document.getElementsByClassName("cm-valuehelp");
	                            var str = oLink[0].textContent;
	                            return str === sValue;
	                        },
	                        success: function (oExpressionAdvanced) {
							var oLink = document.getElementsByClassName("cm-valuehelp");
							var className = oLink[0].className;
							var valueHelpId = className.split('-valuehelpid-')[1];
							oExpressionAdvanced[0].codeMirror.setCursor({
								line: 0,
								ch: 3
							});
                            oExpressionAdvanced[0].onValueHelpLinkPress(sValue,valueHelpId);
                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Can't activate auto complete"
	                    });
	                },	                
                    iChooseHintFromAutoComplete: function (successMessage, sViewName, sAutoCompleteExpression) {
	                    return this.waitFor({
	                        controlType: sap.rules.ui.ExpressionAdvanced,
	                        viewName: sViewName,
                            matchers: function (o) {
	                            var aIl = document.getElementsByClassName("CodeMirror-hint");
	                            for (var i = 0 ; i < aIl.length ; i++) {
                                    if (aIl[i].innerHTML === sAutoCompleteExpression) {
                                        return aIl[i];
                                    }
                                }
	                        },
	                        success: function (oIl) {
                                jQuery(oIl).click();
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Hint in auto complete isn't found"
	                    });
	                }
	            },
	            assertions: {
                    iCanSeeExpressionAdvacnedValue: function (successMessage, sViewName, sValue) {
	                    return this.waitFor({
	                        viewName: sViewName,
	                        matchers: function (oExpressionAdvanced) {
	                            return new PropertyStrictEquals({
	                                controlType: "sap.rules.ui.ExpressionAdvanced",
	                                name: "value",
	                                value: sValue
	                            }).isMatching(oExpressionAdvanced);
	                        },
	                        success: function (advanceExpressionEditor) {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "The Expression Advanced don't have empty valid error message"
	                    });
	                },
	                iCanSeeValidValueStateText: function (successMessage, sExpressionAdvancedID, sViewName) {
	                    return this.waitFor({
	                        id: sExpressionAdvancedID,
	                        viewName: sViewName,
	                        matchers: function (oExpressionAdvanced) {
	                            return new PropertyStrictEquals({
	                                controlType: "sap.rules.ui.ExpressionAdvanced",
	                                name: "valueStateText",
	                                value: ""
	                            }).isMatching(oExpressionAdvanced);
	                        },
	                        success: function (advanceExpressionEditor) {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "The Expression Advanced don't have empty valid error message"
	                    });
	                },
	                iCanSeeNonValidValueStateText: function (successMessage, sExpressionAdvancedID, sViewName, sErrorMessage) {
	                    return this.waitFor({
	                        id: sExpressionAdvancedID,
	                        viewName: sViewName,
	                        matchers: function (oExpressionAdvanced) {
	                            return new PropertyStrictEquals({
	                                controlType: "sap.rules.ui.ExpressionAdvanced",
	                                name: "valueStateText",
	                                value: sErrorMessage
	                            }).isMatching(oExpressionAdvanced);
	                        },
	                        success: function (advanceExpressionEditor) {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "The Expression Advanced isn't shows the error message, or, there isn't error message"
	                    });
	                },
	                iCanSeeAutoComplete: function (successMessage) {
	                    return this.waitFor({
	                        matchers: function (o) {
	                            var oUl = document.getElementsByClassName("CodeMirror-hints");
	                            var bFlag;
	                            oUl.length > 0 ? bFlag = true : bFlag = false;
	                            return bFlag;
	                        },
	                        success: function (advanceExpressionEditor) {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Can't see the Expression Advanced auto complete"
	                    });
	                },
                    iCheckAutoCompleteClosed: function (successMessage) {
	                    return this.waitFor({
	                        matchers: function (o) {
	                            var oUl = document.getElementsByClassName("CodeMirror-hints");
	                            var bFlag;
	                            oUl.length > 0 ? bFlag = false : bFlag = true;
	                            return bFlag;
	                        },
	                        success: function (advanceExpressionEditor) {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Auto complete still open"
	                    });
	                }
	            }
	        }
	    });
	});