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
            onAstExpressionBasic: {
                baseClass: Common,
                actions: {
                    iCanSeeAstExpressionBasic: function (successMessage, sAstExpressionBasicID, sViewName) {
                        return this.waitFor({
                            id: sAstExpressionBasicID,
                            viewName: sViewName,
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "The AstExpressionBasic isn't shown"
                        });
                    },
                    iEnterExpression: function (successMessage, sExpression) {
                        return this.waitFor({
                            id: "myAstExpressionBasic",
                            viewName: "AstExpressionBasic",
                            controlType: "sap.rules.ui.AstExpressionBasic",
                            actions: function (oAstExpressionBasic) {

                                //for (var char in sExpression) {
                                oAstExpressionBasic._input.trigger(
                                    jQuery.Event('keydown', {
                                        key: sExpression /*[char]*/
                                    })
                                );
                                setTimeout(function () {
                                    oAstExpressionBasic._input.trigger(
                                        jQuery.Event('keyup', {
                                            key: sExpression /*[char]*/
                                        })
                                    );
                                    //	}
                                }, 1000);
                            },
                            success: function (oAstExpressionBasic) {
                                setTimeout(function () {
                                    Opa5.assert.ok(true, successMessage);
                                }, 1000);
                            },
                            errorMessage: "Can't enter expression to the AstExpressionBasic"
                        });
                    },
                    iClickOnDisplayItemList: function (successMessage, sItemName) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.DisplayListItem",
                            viewName: "AstExpressionBasic",
                            check: function (oItem) {
                                for (var i = 0; i < oItem.length; i++) {
                                    var itemValue = oItem[i].getLabel();
                                    if (itemValue === sItemName) {
                                        jQuery(oItem[i].getDomRef()).trigger("tap");
                                        return true;
                                    };
                                }
                                return false;
                            },
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Item Not Found"
                        });
                    }
                },
                assertions: {
                    iCanSeeAstExpressionBasicValue: function (successMessage, sValue) {
                        return this.waitFor({
                            id: "myAstExpressionBasic",
                            viewName: "AstExpressionBasic",
                            controlType: "sap.rules.ui.AstExpressionBasic",
                            success: function (oAstExpressionBasic) {
                                var actualValue = oAstExpressionBasic._input.text();
                                Opa5.assert.equal(actualValue, sValue, successMessage);
                            },
                            errorMessage: "The oAstExpressionBasic doesnt have expected value"
                        });
                    },
                    iCanSeeValidValueStateText: function (successMessage) {
                        return this.waitFor({
                            id: "myAstExpressionBasic",
                            viewName: "AstExpressionBasic",
                            controlType: "sap.rules.ui.AstExpressionBasic",
                            matchers: function (oAstExpressionBasic) {
                                return new PropertyStrictEquals({
                                    name: "valueStateText",
                                    value: ""
                                }).isMatching(oAstExpressionBasic);
                            },
                            success: function (oAstExpressionBasic) {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "The AstExpressionBasic doesnt have expected value state text"
                        });
                    },
                    iCanSeePlaceholder: function (successMessage, sText) {
                        return this.waitFor({
                            id: "myAstExpressionBasic",
                            viewName: "AstExpressionBasic",
                            controlType: "sap.rules.ui.AstExpressionBasic",
                            success: function (oAstExpressionBasic) {
                                var placeholder = oAstExpressionBasic._input.attr("data-placeholder");
                                Opa5.assert.equal(placeholder, sText, successMessage);
                            },
                            errorMessage: "The AstExpressionBasic don't have expected placeholder"
                        });
                    },
                    iCanSeePanelsSuggestion: function (successMessage, sPanelsList) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Panel",
                            viewName: "AstExpressionBasic",
                            check: function (oPanel) {
                                var panelFound = 0;
                                for (var j = 0; j < sPanelsList.length; j++) {
                                    for (var i = 0; i < oPanel.length; i++) {
                                        var itemValue = oPanel[i].getHeaderText();
                                        if (itemValue === sPanelsList[j]) {
                                            panelFound++;
                                            break;
                                        }
                                    }
                                }
                                return panelFound === sPanelsList.length;
                            },
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Panel(s) Not Found"
                        });
                    },
                    iCanSeeDisplayItem: function (successMessage, sItemList) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.DisplayListItem",
                            viewName: "AstExpressionBasic",
                            check: function (oItem) {
                                var itemFound = 0;
                                for (var j = 0; j < sItemList.length; j++) {
                                    for (var i = 0; i < oItem.length; i++) {
                                        var itemValue = oItem[i].getLabel();
                                        if (itemValue === sItemList[j]) {
                                            itemFound++;
                                            break;
                                        }
                                    }
                                }
                                return itemFound === sItemList.length;
                            },
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Item(s) Not Found"
                        });
                    }
                }
            }
        });
    });