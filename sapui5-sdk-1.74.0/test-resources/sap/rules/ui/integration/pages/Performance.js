sap.ui.require([
        'sap/ui/test/Opa5',
        "sap/ui/test/actions/Press",
        "sap/ui/test/actions/EnterText",
        'sap/ui/test/matchers/AggregationLengthEquals',
        'sap/ui/test/matchers/PropertyStrictEquals',
        'sap/rules/ui/integration/pages/Common',
        'sap/ui/test/matchers/BindingPath',
        'sap/rules/ui/services/ExpressionLanguage',
        'sap/ui/test/matchers/AggregationContainsPropertyEqual',
        'sap/rules/ui/integration/Performance/Results/ResultsGraph'
    ],
    function(Opa5, Press, EnterText, AggregationLengthEquals, PropertyStrictEquals, Common, BindingPath, ExpressionLanguage, AggregationContainsPropertyEqual) {
        "use strict";
        var resultsGraph; // = new ResultsGraph("Test performance for rule with 250 rows, 2 conditions columns and 2 result columns");
        var PressObject = (function() {
            var oPress;

            function createPress() {
                var newPress = new Press();
                return newPress;
            }
            return {
                getPressInstance: function() {
                    if (!oPress) {
                        oPress = createPress();
                    }
                    return oPress;
                }
            };
        })();

        Opa5.createPageObjects({
            onThePerformanceTestPage: {
                baseClass: Common,
                actions: {
                    iCanSeeTheRuleBuilderWithData: function(successMessage, sRuleBuilderId, sViewName, sRulePath, sResultsGraphTitle, iNumOfRows) {
                        return this.waitFor({
                            id: sRuleBuilderId,
                            viewName: sViewName,
                            matchers: function(oRuleBuilder) {
                                var oTable = oRuleBuilder.getAggregation("_rule");
                                var bDTBusy = oTable._internalModel.getProperty("/busyState");
                                var bTableBusy = oTable._internalModel.getProperty("/busyTableState");
                                var iRows = oRuleBuilder.getAggregation("_rule").getAggregation("_table").getRows().length;
                                var dtReady = !bDTBusy && !bTableBusy && iRows === iNumOfRows;
                                return dtReady;
                            },
                            success: function(oRuleBuilder) {
                                var timeToRender = window.renderingTime;
                                window.timeToRead = window.performance.now() - window.iStartReadTime;
                                resultsGraph = new ResultsGraph(sResultsGraphTitle);
                                resultsGraph.addResultToPerformanceTestResults({
                                    "label": "Time to render RuleBuilder",
                                    "y": parseFloat(timeToRender)
                                });
                                var timeToRead = (window.timeToRead / 1000).toFixed(4);
                                resultsGraph.addResultToPerformanceTestResults({
                                    "label": "Time to read rule",
                                    "y": parseFloat(timeToRead)
                                });

                                Opa5.assert.ok(true, successMessage + ", Time to render: " + timeToRender + " seconds");
                            },
                            errorMessage: "Couldn't load RuleBuilder"
                        });
                    },
                    iClickTheSettingButton: function(successMessage, controlType, sViewName) {
                        return this.waitFor({
                            controlType: controlType,
                            viewName: sViewName,
                            matchers: function(oToolbar) {
                                return new AggregationContainsPropertyEqual({
                                    aggregationName: "content",
                                    propertyName: "icon",
                                    propertyValue: "sap-icon://action-settings"
                                }).isMatching(oToolbar);
                            },
                            success: function(oToolbar) {
                                var oPlusButton = oToolbar[0].getAggregation("content")[12];
                                oPlusButton.$().trigger("tap");
                                window.iStartOpenSettingTime = window.performance.now();
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't find the settings button"
                        });
                    },
                    iCheckForMenu: function(successMessage) {
                        return this.waitFor({
                            controlType: "sap.ui.unified.Menu",
                            searchOpenDialogs: true,
                            success: function(oMenu) {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't click the insert row option from the plus menu"
                        });
                    },
                    iClickAddLineFromMenuForPerformance: function(successMessage, bInsertFirstOrAfter) {
                        return this.waitFor({
                            controlType: "sap.ui.unified.Menu",
                            searchOpenDialogs: true,
                            success: function(oMenu) {
                                var oPressAction = new PressObject.getPressInstance();
                                var oButton;
                                if (bInsertFirstOrAfter) {
                                    oButton = oMenu[0].getAggregation("items")[0];
                                } else {
                                    oButton = oMenu[0].getAggregation("items")[1];
                                }
                                window.iStartAddDeleteRowTime = window.performance.now();
                                oPressAction.executeOn(oButton);
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't click the insert row option from the plus menu"
                        });
                    },
                    iClickTheAddLinkForPerformance: function(successMessage, sViewName) {
                        return this.waitFor({
                            controlType: "sap.m.Toolbar",
                            viewName: sViewName,
                            matchers: function(oToolbar) {
                                return new AggregationContainsPropertyEqual({
                                    aggregationName: "content",
                                    propertyName: "text",
                                    propertyValue: "Add Row"
                                }).isMatching(oToolbar);
                            },
                            success: function(oToolbar) {
                                var timeToCloseSetting = ((window.performance.now() - window.iStartTimeForPressTheButton) / 1000).toFixed(4);
                                resultsGraph.addResultToPerformanceTestResults({
                                    "label": "Time to close setting",
                                    "y": parseFloat(timeToCloseSetting)
                                });
                                var oPressAction = new PressObject.getPressInstance();
                                var oPlusButton = oToolbar[0].getAggregation("content")[2];
                                oPressAction.executeOn(oPlusButton);
                                Opa5.assert.ok(true, successMessage + ", Time to close setting: " + timeToCloseSetting + " seconds");
                            },
                            errorMessage: "Can't find the plus button"
                        });
                    },
                    iPressTheButtonForPerformance: function(successMessage, buttonText, sViewName) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.m.Button",
                            //id: sButtonId,
                            viewName: sViewName,
                            matchers: function(oButton) {
                                return (oButton.getText() == buttonText);
                            },
                            success: function(oButton) {
                                var oPress = new Press();
                                window.iStartTimeForPressTheButton = window.performance.now();
                                oPress.executeOn(oButton[0]);
                                Opa5.assert.ok(true, successMessage);
                            },

                            errorMessage: "The button " + buttonText + " is not found"
                        });
                    },
                    iClickTheAddRemoveButton: function(successMessage, controlType, hBoxId, addRemoveButtoIndex, sViewName, bFlagForPerformance) {
                        this.waitFor({
                            searchOpenDialogs: true,
                            controlType: controlType,
                            viewName: sViewName,
                            success: function(oHorizontalLayout) {

                                var oButtons = oHorizontalLayout[hBoxId].getAggregation("content");
                                var oAddButton = oButtons[addRemoveButtoIndex];
                                var oPress = new Press();
                                if (bFlagForPerformance) {
                                    window.iStartAddRemoveLineTime = window.performance.now();
                                }
                                oPress.executeOn(oAddButton);
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't find the plus button"
                        });
                        return this;
                    },
                    iClickTheDeleteLink: function(successMessage, sViewName) {
                        return this.waitFor({
                            controlType: "sap.m.Toolbar",
                            viewName: sViewName,
                            matchers: function(oToolbar) {
                                return new AggregationContainsPropertyEqual({
                                    aggregationName: "content",
                                    propertyName: "text",
                                    propertyValue: "Delete Row"
                                }).isMatching(oToolbar);
                            },
                            success: function(oToolbar) {
                                var oDeleteLink = oToolbar[0].getAggregation("content")[4];
                                var oPressAction = new PressObject.getPressInstance();
                                window.iStartDeleteRowTime = window.performance.now();
                                oPressAction.executeOn(oDeleteLink);
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't find the delete link"
                        });
                    }
                },
                assertions: {
                    iCheckNumOfRowsForPerformance: function(successMessage, sId, iExpectedNumberOfRows, sRulePath, sViewName, bFlagForPerformance) {
                        return this.waitFor({
                            id: sId,
                            viewName: sViewName,
                            matchers: function(oRuleBuilder) {
                                var iNumberOfRows = oRuleBuilder.getAggregation("_rule").getAggregation("_table").getBinding("rows").getLength();
                                var bNumberOfRows = (iNumberOfRows === parseInt(iExpectedNumberOfRows));
                                return bNumberOfRows && !oRuleBuilder.getAggregation("_rule").getBusy();
                            },
                            success: function(oRuleBuilder) {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't read from oData the number of rows"
                        });
                    },
                    iCheckNumOfCols: function(successMessage, controlType, iExpectedNumberOfRows, sViewName, sRulePath, bFlagForPerformance) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: controlType,
                            viewName: sViewName,
                            check: function(oTable) {
                                var aCols = oTable[0].getItems();
                                var numberOfRows = aCols.length - 2;
                                return numberOfRows === parseInt(iExpectedNumberOfRows);
                            },
                            success: function(oTable) {
                                Opa5.assert.ok(true, successMessage);

                            },
                            errorMessage: "Can't read from oData the number of rows"
                        });
                    },
                    iCheckSettingNoBusy: function(successMessage, sViewName, bFlagForOpenSetting, bFlagForAddRemoveCol) {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            controlType: "sap.rules.ui.DecisionTableSettings",
                            viewName: sViewName,
                            matchers: function(oDecisionTableSettings) {
                                var bFlag = !oDecisionTableSettings.getBusy();
                                return bFlag;
                            },

                            success: function(oMessageStrip) {
                                if (bFlagForOpenSetting) {
                                    var timeToOpenSetting = ((window.performance.now() - window.iStartOpenSettingTime) / 1000).toFixed(4);
                                    resultsGraph.addResultToPerformanceTestResults({
                                        "label": "Time to open setting",
                                        "y": parseFloat(timeToOpenSetting)
                                    });
                                    Opa5.assert.ok(true, successMessage + ", Time to open setting: " + timeToOpenSetting + " seconds");
                                } else if (bFlagForAddRemoveCol) {
                                    var timeToAddColumn = ((window.performance.now() - window.iStartAddRemoveLineTime) / 1000).toFixed(4);
                                    resultsGraph.addResultToPerformanceTestResults({
                                        "label": "Time to add column",
                                        "y": parseFloat(timeToAddColumn)
                                    });
                                    Opa5.assert.ok(true, successMessage + ", Time to add or remove line: " + timeToAddColumn + " seconds");
                                } else {
                                    var timeToRemoveColumn = ((window.performance.now() - window.iStartAddRemoveLineTime) / 1000).toFixed(4);
                                    resultsGraph.addResultToPerformanceTestResults({
                                        "label": "Time to remove column",
                                        "y": parseFloat(timeToRemoveColumn)
                                    });
                                    Opa5.assert.ok(true, successMessage + ", Time to add or remove line: " + timeToRemoveColumn + " seconds");
                                }
                            },

                            errorMessage: "There isn't any DecisionTableSettings"
                        });
                    },
                    iCheckDTNoBusy: function(successMessage, sViewName, bFlagForAddRemoveRow, bFlagForReadRule) {
                        return this.waitFor({
                            controlType: "sap.rules.ui.DecisionTable",
                            viewName: sViewName,
                            matchers: function(oDecisionTable) {
                                var bDTBusy = oDecisionTable._internalModel.getProperty("/busyState");
                                var bTableBusy = oDecisionTable._internalModel.getProperty("/busyTableState");
                                var dtReady = !bDTBusy && !bTableBusy;
                                return dtReady;
                            },
                            success: function(oDecisionTable) {
                                if (bFlagForAddRemoveRow) {
                                    var timeToAddRow = ((window.performance.now() - window.iStartAddDeleteRowTime) / 1000).toFixed(4);
                                    resultsGraph.addResultToPerformanceTestResults({
                                        "label": "Time to add row",
                                        "y": parseFloat(timeToAddRow)
                                    });
                                    Opa5.assert.ok(true, successMessage + ", Time to add line: " + timeToAddRow + " seconds");
                                } else if (!bFlagForAddRemoveRow && !bFlagForReadRule) {
                                    var timeToRemoveRow = ((window.performance.now() - window.iStartDeleteRowTime) / 1000).toFixed(4);
                                    resultsGraph.addResultToPerformanceTestResults({
                                        "label": "Time to remove row",
                                        "y": parseFloat(timeToRemoveRow)
                                    });
                                    Opa5.assert.ok(true, successMessage + ", Time to remove line: " + timeToRemoveRow + " seconds");
                                } else if (bFlagForReadRule) {
                                    window.timeToRead = window.performance.now() - window.iStartReadTime;
                                    var timeToRead = (window.timeToRead / 1000).toFixed(4);
                                    resultsGraph.addResultToPerformanceTestResults({
                                        "label": "Time to read rule",
                                        "y": parseFloat(timeToRead)
                                    });
                                    Opa5.assert.ok(true, successMessage + ", Time to read: " + timeToRead + " seconds");
                                }
                            },
                            errorMessage: "There isn't any DecisionTable"
                        });
                    },
                    iCheckDTNoBusyWithoutPerformance: function(successMessage, sViewName) {
                        return this.waitFor({
                            controlType: "sap.rules.ui.DecisionTable",
                            viewName: sViewName,
                            matchers: function(oDecisionTable) {
                                var bFlag = !oDecisionTable.getBusy();
                                return bFlag;
                            },
                            success: function(oDecisionTable) {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "There isn't any DecisionTable"
                        });
                    },
                    fnFinishTestAndStartNewOne: function(successMessage, sViewName, sRuleId) {
                        return this.waitFor({
                            viewName: sViewName,
                            success: function(sViewName) {
                                sViewName[0].getParent().getParent().getParent().getController().loadDT(sRuleId);
                                resultsGraph.showResults();
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "There isn't any DecisionTableSettings"
                        });
                    },
                    fnFinishTestAndShowResults: function(successMessage, sViewName, bFlagForResults) {
                        return this.waitFor({
                            viewName: sViewName,
                            success: function(sViewName) {
                                resultsGraph.showResults();
                                if (bFlagForResults) {
                                    resultsGraph.sendResults();
                                }
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "There isn't any DecisionTableSettings"
                        });
                    },
                    iCheckThatDTSettingClosed: function(successMessage, sViewName) {
                        return this.waitFor({
                            viewName: sViewName,
                            matchers: function(sViewName) {
                                var oDataSapUi = document.querySelectorAll('[data-sap-ui]');
                                var iDataSapUi = oDataSapUi.length;
                                for (var i = 0; i < iDataSapUi; i++) {
                                    var sData = JSON.stringify($(oDataSapUi[i]).data());
                                    if (sData.includes("settings")) {
                                        console.log("Hi");
                                        return false;
                                    }
                                }
                                return true;
                            },
                            success: function(oRuleBuilder) {
                                Opa5.assert.ok(true, successMessage);
                            },
                            errorMessage: "Can't read from oData the number of rows"
                        });
                    }
                }
            }
        });
    });