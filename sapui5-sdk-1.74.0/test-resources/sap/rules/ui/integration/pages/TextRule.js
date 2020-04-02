sap.ui.require([
        'jquery.sap.global',
        'sap/ui/test/Opa5',
        'sap/ui/test/matchers/AggregationLengthEquals',
        'sap/ui/test/matchers/PropertyStrictEquals',
        'sap/rules/ui/integration/pages/Common',
        'sap/ui/test/matchers/BindingPath',
        "sap/ui/test/actions/EnterText",
        "sap/ui/test/actions/Press",
        'sap/ui/test/matchers/AggregationContainsPropertyEqual',
        'sap/ui/test/matchers/AggregationFilled'
    ],
    function (jQuery, Opa5, AggregationLengthEquals, PropertyStrictEquals, Common, BindingPath, EnterText, Press,
        AggregationContainsPropertyEqual, AggregationFilled) {
        "use strict";

        Opa5.extendConfig({
            timeout: 20,
            pollingInterval: 100,
            executionDelay:600
        });

        Opa5.createPageObjects({
            onTextRulePage: {
                baseClass: Common,
                actions: {
                    iClickTheSettingButton: function (successMessage, controlType, sViewName) {
                        return this.waitFor({
                            controlType: controlType,
                            viewName: sViewName,
                            matchers: function (oToolbar) {
                                return new AggregationContainsPropertyEqual({
                                    aggregationName: "content",
                                    propertyName: "icon",
                                    propertyValue: "sap-icon://action-settings"
                                }).isMatching(oToolbar);
                            },
                            success: function (oToolbar) {
                                var oPlusButton = oToolbar[0].getAggregation("content")[2];
                                jQuery(oPlusButton.getDomRef()).trigger("tap");
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't find the settings button"
                        });
                    },
                    
                    iClickTheAddButton: function (successMessage, controlType, sViewName, sIndex) {
                        return this.waitFor({
                            controlType: controlType,
                            viewName: sViewName,

                            success: function (oButton) {
                                jQuery(oButton[sIndex].getDomRef()).trigger("tap");
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't find the add button"
                        });
                    },

                    iClickButton: function (successMessage, viewName, text, index) {
                        return this.waitFor({
                            controlType: "sap.m.Button",
                            viewName: viewName,
                            matchers: new sap.ui.test.matchers.PropertyStrictEquals({
                                name: "text",
                                value: text
                            }),
                            success: function (oButton) {
                                jQuery(oButton[index].getDomRef()).trigger("tap");
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Button is not present"
                        });
                    },

                    iClickOnSelect: function (successMessage, sViewName, sIndex) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Select",
                            viewName: sViewName,

                            success: function (oSelect) {
                                jQuery(oSelect[sIndex].getDomRef()).trigger("tap");
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Select Not Found"
                        });

                    },

                    iClickOnButton: function (successMessage, sViewName, sIndex) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Button",
                            viewName: sViewName,

                            success: function (oButton) {
                                jQuery(oButton[sIndex].getDomRef()).trigger("tap");
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Button Not Found"
                        });

                    },

                    iClickOnDisplayItemList: function (successMessage, sViewName, sItemName) {

                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.DisplayListItem",
                            viewName: sViewName,
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

                    },

                    iSelectItemInList: function (successMessage, sViewName, sItemName) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.ui.core.Item",
                            viewName: sViewName,
                            // timeout: 60,
                            success: function (oItem) {
                                for (var i = 0; i < oItem.length; i++) {
                                    if (oItem[i].getText() === sItemName) {
                                        jQuery(oItem[i].getDomRef()).trigger("tap");
                                        Opa5.assert.ok(true, successMessage);
                                    }
                                }
                            },
                            errorMessage: "Select Not Found"
                        });

                    },

                    iSelectItemInListItem: function (successMessage, sViewName, sItemName) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.ui.core.ListItem",
                            viewName: sViewName,
                            // timeout: 60,
                            success: function (oItem) {
                                for (var i = 0; i < oItem.length; i++) {
                                    if (oItem[i].getText() === sItemName) {
                                        jQuery(oItem[i].getDomRef()).trigger("tap");
                                        Opa5.assert.ok(true, successMessage);
                                    }
                                }
                            },
                            errorMessage: "Select Not Found"
                        });

                    },

                    iPressCtrlSpaceInInput: function (successMessage, sViewName, index, sOpenDailog) {

                        return this.waitFor({

                            searchOpenDialogs: sOpenDailog,
                            controlType: "sap.rules.ui.AstExpressionBasic",
                            viewName: sViewName,
                            success: function (oExpressionAdvanced) {

                                var textLength = oExpressionAdvanced[index]._input.text().length;
                                oExpressionAdvanced[index]._setCurrentCursorPosition(textLength);

                                oExpressionAdvanced[index]._input.trigger(
                                    jQuery.Event('keydown', {
                                        key: 'Control'
                                    })
                                );
                                oExpressionAdvanced[index]._input.trigger(
                                    jQuery.Event('keydown', {
                                        key: ' '
                                    })
                                );
                                oExpressionAdvanced[index]._input.trigger(
                                    jQuery.Event('keyup', {
                                        key: ' '
                                    })
                                );
                            },
                            errorMessage: "Couldnot Press Control Space. Control not found"

                        });
                    },

                    iPressBackSpace: function (successMessage, sViewName, index, sOpenDailog, sNoOfTimes) {

                        return this.waitFor({

                            searchOpenDialogs: sOpenDailog,
                            controlType: "sap.rules.ui.AstExpressionBasic",
                            viewName: sViewName,
                            success: function (oExpressionAdvanced) {

                                var textLength = oExpressionAdvanced[index]._input.text().length;
                                oExpressionAdvanced[index]._setCurrentCursorPosition(textLength);

                                for (var i = 0; i < sNoOfTimes; i++) {
                                    oExpressionAdvanced[index]._input.trigger(
                                        jQuery.Event('keydown', {
                                            key: 'Backspace'
                                        })
                                    );
                                }

                            },
                            errorMessage: "Couldnot Press BackSpace. Control not found"

                        });
                    },
                    
                    iPressKeyInMultiComboList: function(successMessage, sViewName,sKey, index, sOpenDailog, sNoOfTimes) {

                        return this.waitFor({

                            searchOpenDialogs: sOpenDailog,
                            controlType: "sap.m.MultiComboBox",
                            viewName: sViewName,
                            success: function (oMultiCombo) {


                                for (var i = 0; i < sNoOfTimes; i++) {
                                    oMultiCombo[index]._input.trigger(
                                        jQuery.Event('keydown', {
                                            keyCode: sKey,
                                            which: sKey
                                        })
                                    );
                                }

                            },
                            errorMessage: "Couldnot Press Key. Control not found"

                        });
                    },

                    iExpandPanelASTControl: function (successMessage, sViewName, sPanelName, doExpand) {

                        return this.waitFor({

                            searchOpenDialogs: true,
                            controlType: "sap.m.Panel",
                            viewName: sViewName,

                            success: function (oPanel) {
                                for (var i = 0; i < oPanel.length; i++) {
                                    var itemValue = oPanel[i].getHeaderText();
                                    if (itemValue === sPanelName) {
                                        oPanel[i].setExpanded(doExpand);
                                        Opa5.assert.ok(true, successMessage);
                                    }
                                }

                            },
                            errorMessage: "Panel(s) Not Found"

                        });
                    },

                    iClickOntheLink: function (successMessage, sViewName, sLinkName) {

                        return this.waitFor({

                            searchOpenDialogs: true,
                            controlType: "sap.m.Link",
                            viewName: sViewName,
                            success: function (oLink) {
                                for (var i = 0; i < oLink.length; i++) {
                                    if (oLink[i].getText() === sLinkName) {
                                        jQuery(oLink[i].getDomRef()).trigger("tap");
                                        Opa5.assert.ok(true, successMessage);
                                    }
                                }
                            },
                            errorMessage: "Link Not Found"

                        });

                    },
                    iEnterValueInTextArea: function (sValue, sViewName, successMessage, sIndex) {

                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.TextArea",
                            viewName: sViewName,

                            success: function (oTextArea) {
                                oTextArea[sIndex].setValue(sValue);
                                oTextArea[sIndex].fireChange();
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: " Cant Enter Value"

                        });

                    },
                    
                    iOpenOnMultiComboBoxIcon: function(successMessage, sViewName,sIndex){
                        
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.ui.core.Icon",
                            viewName: sViewName,

                            success: function (oSelect) {
                                jQuery(oSelect[sIndex].getDomRef()).trigger("tap");
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "MultiComboBox Not Found"
                        });
                    },
                    
                    iOpenDatePicker: function(successMessage, sViewName,sIndex){
                        
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.DatePicker",
                            viewName: sViewName,

                            success: function (oSelect) {
                                oSelect[sIndex].toggleOpen();
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "DatePicker Not Found"
                        });
                    },
                    
                    iEnterValueInDatePicker: function(successMessage, sViewName,sIndex,sValue){
                        
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.DatePicker",
                            viewName: sViewName,

                            success: function (oSelect) {
                                setTimeout(function(){
                                        oSelect[sIndex].setValue(sValue);
                                        oSelect[sIndex].fireChange();
                                        Opa5.assert.ok(true, successMessage);
                                }.bind(oSelect),100);
                            
                            },
                            errorMessage: "DatePicker Not Found"
                        });
                    },
                        
                        
                    iSelectItemInStandardListItem: function(successMessage , sValue, sViewName){
                        
                            return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.StandardListItem",
                            viewName: sViewName,
                            // timeout: 60,
                            success: function (oItem) {
                                for (var i = 0; i < oItem.length; i++) {
                                    if (oItem[i].getTitle() === sValue) {
                                        jQuery(oItem[i].getDomRef()).trigger("tap");
                                        Opa5.assert.ok(true, successMessage);
                                    }
                                }
                            },
                            errorMessage: "Select Not Found"
                        });
                        
                    },
                    iEnterFixedValue: function (sValue, sViewName, successMessage, index) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Input",
                            viewName: sViewName,
                            success: function (oInput) {
                                oInput[index].setValue(sValue);
                                oInput[index].fireChange();
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: " Cant Enter Value"
                        });
                    },

                    iExpandElseIfPanel: function (successMessage, sViewName, index, doExpand, title) {
                        return this.waitFor({
                            controlType: "sap.m.Panel",
                            success: function (oPanels) {
                                //In IE and Edge, the oPanels doesnt return in same order of rendered controls
                                var bFound = false;
                                for (var i = 0; i < oPanels.length; i++) {
                                    if (oPanels[i].getHeaderText() === title) {
                                        oPanels[i].setExpanded(doExpand);
                                        Opa5.assert.ok(true, successMessage);
                                        bFound = true;
                                        break;
                                    }
                                }
                                if (!bFound)
                                    Opa5.assert.ok(false, "Panel not found");
                            },
                            errorMessage: "Couldn't Expand"
                        });

                    },
                    iFocusOutAstExpressionBasic: function (successMessage, sViewName, index, sOpenDailog) {
                        return this.waitFor({
                            searchOpenDialogs: sOpenDailog,
                            controlType: "sap.rules.ui.AstExpressionBasic",
                            viewName: sViewName,
                            timeout: 30,
                            success: function (oAstExpressionBasic) {
                                var input = oAstExpressionBasic[index].$("input");
                                input.blur();
                                var text = input.text();
                                oAstExpressionBasic[index]._closeAutoSuggestionPopup();
                                oAstExpressionBasic[index]._fireChange(text);
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Couldnot Focus out of ast expression basic"
                        });
                    },
                    iClickOnDisplayItemListFromPanel: function (successMessage, sViewName, sItemName, index, sPanelControl) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: sPanelControl,
                            viewName: sViewName,
                            check: function (oPanel) {
                                var panel = oPanel[index];
                                var oItems = panel.getAggregation("PanelLayout").getContent()[0].getItems();
                                for (var i = 0; i < oItems.length; i++) {
                                    var itemValue = oItems[i].getLabel();
                                    if (itemValue === sItemName) {
                                        jQuery(oItems[i].getDomRef()).trigger("tap");
                                        return true;
                                    }
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
                    iCanSeeTextRuleWithData: function (successMessage, sViewName, sRulePath) {
                        return this.waitFor({
                            controlType: "sap.rules.ui.TextRule",
                            viewName: sViewName,
                            matchers: function (oTextRule) {
                                var bTextRuleBusy = oTextRule._internalModel.getProperty("/busyState");
                                var bverticalLayoutBusy = oTextRule._internalModel.getProperty("/busyVerticalLayoutState");
                                var textRuleReady = !bTextRuleBusy && !bverticalLayoutBusy;
                                return textRuleReady;
                            },
                            success: function (oTextRule) {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Couldn't load TextRule"
                        });
                    },

                    iCanSeeConditionBlock: function (text, index, isCondition) {
                        return this.waitFor({
                            controlType: "sap.m.Panel",
                            success: function (oPanels) {
                                oPanels[index].setExpanded(true);
                                if (!isCondition && oPanels[index].getHeaderText()) {
                                    if (oPanels[index].getHeaderText() == text) {
                                        Opa5.assert.ok(true, text + "Block is found");
                                    }
                                } else if (isCondition && oPanels[index].getHeaderToolbar()) {
                                    var title = oPanels[index].getHeaderToolbar().getTitleControl().getText();
                                    if (title === text) {
                                        Opa5.assert.ok(true, text + "Block is found");
                                    }
                                }

                            },
                            errorMessage: text + "Block not found"
                        });
                    },

                    iCanSeeASTConditionText: function (successMessage, sViewName, text, index) {
                        return this.waitFor({
                            controlType: "sap.rules.ui.AstExpressionBasic",
                            viewName: sViewName,
                            success: function (oExpressionAdvanced) {
                                //In IE and Edge, the oPanels doesnt return in same order of rendered controls
                                var bFlag = false;
                                for (var i = 0; i < oExpressionAdvanced.length; i++) {
                                    if (oExpressionAdvanced[i]._input.text() === text) {
                                        if (oExpressionAdvanced[index]._oAutoSuggestionPopUp.isOpen()) {
                                            oExpressionAdvanced[index]._oAutoSuggestionPopUp.close();
                                        }
                                        Opa5.assert.ok(true, successMessage);
                                        bFlag = true;
                                        break;
                                    }
                                }
                                if (!bFlag) {
                                    Opa5.assert.ok(false, "If block does not have the correct condition");
                                }

                            },
                            errorMessage: "If block does not have the correct condition"
                        });
                    },

                    iCanSeeConditionText: function (successMessage, sViewName, text) {
                        return this.waitFor({
                            controlType: "sap.rules.ui.ExpressionAdvanced",
                            viewName: sViewName,
                            matchers: function (oExpressionAdvanced) {
                                var sActualValue = oExpressionAdvanced.getValue();
                                return sActualValue == text;
                            },
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "If block does not have the correct condition"
                        });
                    },

                    iCanSeeResultAttribute: function (successMessage, sViewName, label) {
                        return this.waitFor({
                            controlType: "sap.m.Label",
                            viewName: sViewName,
                            matchers: new sap.ui.test.matchers.PropertyStrictEquals({
                                name: "text",
                                value: label
                            }),
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Result attribute is not present"
                        });
                    },
                    iTestLayoutContent: function (successMessage, sViewName) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.rules.ui.DecisionTableSettings",
                            viewName: sViewName,
                            check: function (oDecisionTableSettings) {
                                var oForm = oDecisionTableSettings[0].getAggregation("mainLayout");
                                var formContentArray = oForm.getContent();
                                return formContentArray.length === 12;
                            },

                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },

                            errorMessage: "DecisionTableSettings Layout not contains all controls"
                        });
                    },

                    iFindItemsCountInSelectList: function (sViewName, sResultValue, successMessage, sIndex) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Select",
                            viewName: sViewName,

                            check: function (oSelect) {
                                var oItemsLength = oSelect[sIndex].getItems().length;
                                return oItemsLength === sResultValue;
                            },
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "No of Items Doesnot Match"
                        });
                    },

                    iCanSeeSelectBoxWithItem: function (sViewName, sResultValue, successMessage, sIndex) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Select",
                            viewName: sViewName,

                            check: function (oSelect) {
                                var oResult = oSelect[sIndex]._getSelectedItemText();
                                return oResult === sResultValue;
                            },
                            success: function (oMessageStrip) {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Value is incorrect"
                        });
                    },
                    iCanSeeLabel: function (sLabelName, sViewName, successMessage, sIndex) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Label",
                            viewName: sViewName,

                            check: function (oLabel) {
                                var oResultLabel = oLabel[sIndex].getText();
                                return oResultLabel === sLabelName;
                            },
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: sLabelName + " Label Not Found"
                        });
                    },

                    iCanSeeText: function (sLabelName, sViewName, successMessage, sIndex) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Text",
                            viewName: sViewName,

                            check: function (oLabel) {
                                var oResultLabel = oLabel[sIndex].getText();
                                return oResultLabel === sLabelName;
                            },
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: sLabelName + " Label Not Found"
                        });
                    },

                    iCanSeeEnabledState: function (sEnabledState, sViewName, successMessage, sIndex) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.TextArea",
                            viewName: sViewName,

                            check: function (oTextArea) {
                                var oEnabled = oTextArea[sIndex].getEnabled();
                                return oEnabled === sEnabledState;
                            },
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Enabled State Error"
                        });
                    },

                    iCheckEditable: function (sEnabledState, sViewName, successMessage, sIndex) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.rules.ui.AstExpressionBasic",
                            viewName: sViewName,

                            check: function (oAstExpressionBasic) {
                                var oEnabled = oAstExpressionBasic[sIndex].getEditable();
                                return oEnabled === sEnabledState;
                            },
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Enabled State Error"
                        });
                    },

                    iDontSeeLabel: function (sLabelName, sViewName, successMessage) {
                        return this.waitFor({
                            controlType: "sap.m.Label",
                            viewName: sViewName,

                            // check: function (oLabel) {
                            //  for(var i = 0;i< oLabel.length;i++){
                            //  var oResultLabel = oLabel[i].getText();
                            //  if(oResultLabel === sLabelName){
                            //      return false;
                            //  }
                            //  }

                            //  return true;
                            // },
                            success: function (oLabel) {
                                var labelFound = true;
                                for (var i = 0; i < oLabel.length; i++) {
                                    var oResultLabel = oLabel[i].getText();
                                    if (oResultLabel === sLabelName) {
                                        labelFound = false;
                                    }
                                }

                                // return true;
                                Opa5.assert.ok(labelFound, successMessage);
                            },
                            errorMessage: sLabelName + " Label Found"
                        });
                    },

                    iCanSeeTitleText: function (sTitleText, sViewName, successMessage, sIndex) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Title",
                            viewName: sViewName,

                            check: function (oTitle) {
                                var oTitleText = oTitle[sIndex].getText();
                                return oTitleText === sTitleText;
                            },
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: sTitleText + " Title Text Not Found"
                        });
                    },

                    iCanSeeMessageStrip: function (sValue, sViewName, successMessage, sIndex) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.MessageStrip",
                            viewName: sViewName,

                            check: function (oMessageStrip) {
                                var oMsgStrip = oMessageStrip[sIndex].getText();
                                return oMsgStrip === sValue;
                            },
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Message Strip Not Found"
                        });

                    },

                    iCanSeeIconWithGivenVisibility: function (sIconName, sVisibility, sViewName, successMessage, sIndex) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.ui.core.Icon",
                            viewName: sViewName,

                            check: function (oIcon) {
                                var oIconSrc = oIcon[sIndex].mProperties.src;
                                var oVisibility = oIcon[sIndex].getVisible();
                                return oIconSrc === sIconName && oVisibility === sVisibility;
                            },
                            success: function () {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Icon Not Found Or Visibility Doesnot Match"
                        });

                    },

                    iCanSeePanelsinASTControl: function (successMessage, sViewName, sPanelsList) {

                        return this.waitFor({

                            searchOpenDialogs: true,
                            controlType: "sap.m.Panel",
                            viewName: sViewName,

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

                    iCanSeeDisplayItem: function (successMessage, sViewName, sItemList) {

                        return this.waitFor({

                            searchOpenDialogs: true,
                            controlType: "sap.m.DisplayListItem",
                            viewName: sViewName,

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