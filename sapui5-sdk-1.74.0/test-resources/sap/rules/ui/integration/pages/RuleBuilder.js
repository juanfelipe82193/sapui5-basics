sap.ui.require([
		'sap/ui/test/Opa5',
		"sap/ui/test/actions/Press",
		"sap/ui/test/actions/EnterText",
		'sap/rules/ui/integration/pages/Common',
		'sap/ui/test/matchers/BindingPath',
		'sap/ui/test/matchers/AggregationContainsPropertyEqual'
	],
	function (Opa5, Press, EnterText, Common, BindingPath, AggregationContainsPropertyEqual) {
	    "use strict";
	    
	    Opa5.extendConfig({
            timeout: 20,
            pollingInterval: 100
        });

	    Opa5.createPageObjects({
	        onTheRuleBuilderPage: {
	            baseClass: Common,
	            actions: {
	                iCanSeeTheRuleBuilder: function (successMessage, sRuleId, oModel, sRulePath, oExpressionLanguage, sResultDataObjectId, sResultDataObjectName) {
	                    this.sRuleId = sRuleId;
	                    return this.waitFor({
	                        controlType : "sap.rules.ui.RuleBuilder",
	                        success: function (aRuleBuilder) {
								var oRuleBuilder = aRuleBuilder[0];
								oRuleBuilder.setModel(oModel);
								oRuleBuilder.setBindingContextPath(sRulePath);
								oRuleBuilder.setExpressionLanguage(oExpressionLanguage);
								Opa5.assert.ok(true, successMessage);
							},
	                        errorMessage: "The rule builder isn't shown"
	                    });
	                },
	                iPressTheSettingsButton: function (successMessage) {
						return this.waitFor({
							controlType : "sap.m.Toolbar",
							// viewName: sViewName,
							matchers: function(oToolbar) {
								return new AggregationContainsPropertyEqual({
									aggregationName: "content",
									propertyName: "icon",
									propertyValue: "sap-icon://action-settings"
								}).isMatching(oToolbar);
							},
							success: function(oToolbar) {
								var oPlusButton = oToolbar[0].getAggregation("content")[12];
								jQuery(oPlusButton.getDomRef()).trigger("tap");
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Can't find the settings button"
						});
					},
					iSetColumnData: function (controlType, rowIndex, expressionStr, successMessage){
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: controlType,
							// viewName: sViewName,
							check : function (oTable) {
								if (oTable[0] && oTable[0].getItems && oTable[0].getItems() && oTable[0].getItems()[rowIndex]){
									var oRow = oTable[0].getItems()[rowIndex];
									var oCells = oRow.getCells();
									if ((oCells[0] instanceof sap.rules.ui.ExpressionAdvanced)) {
										oCells[0].setValue(expressionStr);
										oCells[1].focus();
									} else {
										return false;
									}
								} else {
									return false;
								}
								return true;
							},
							success: function (oTable) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Cannot update column Data"
						});
					},
					iClickTheAddRemoveButton: function (successMessage, controlType, hBoxId, addRemoveButtoIndex) {
						this.waitFor({
							searchOpenDialogs : true,
							controlType: controlType,
							//viewName: sViewName,
							success: function (oHorizontalLayout) {
								var oButtons = oHorizontalLayout[hBoxId].getAggregation("content");
								var oAddButton = oButtons[addRemoveButtoIndex];
								oAddButton.$().trigger("tap");
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Can't find the plus button"
						});
						return this;
					},
					iPressTheButton: function(successMessage, buttonText) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: "sap.m.Button",
							//id: sButtonId,
							//	viewName: sViewName,
							matchers: function(oButton) {
								return (oButton.getText() == buttonText);
							},
							actions: [new Press()],

							success: function(oButton) {
								Opa5.assert.ok(true, successMessage);
								//oButton[0].$().trigger("tap");
							},

							errorMessage: "The button "+ buttonText +" is not found"
						});
					},
					iSave: function(successMessage){
						return this.waitFor({
							controlType: "sap.m.Button",
							id: "saveNewRule",
							success: function(oButton) {
								oButton.setEnabled(true);
								oButton.setText("Save");
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Cannot save"
						});
					},
                    iChangeCellFormat: function(sCellFormat){
						return this.waitFor({
							controlType: "sap.rules.ui.RuleBuilder",
                            matchers: function(oRuleBuilder) {
                                oRuleBuilder.getAggregation("decisionTableConfiguration").setCellFormat(sCellFormat);
                                return true;
                            },
							success: function() {
								Opa5.assert.ok(true, "Changed DecisionTableCell Format");
							},
							errorMessage: "Cannot save"
						});
					}
				},
	            assertions: {
					
				iCanSeeTheDecisionTableSettings: function (successMessage) {
                    return this.waitFor({
                                    controlType : "sap.rules.ui.DecisionTableSettings",
                                    // viewName: sViewName,
                                    searchOpenDialogs : true,
                                    matchers : function (oDecisionTableSettings) {
                                                    var bFlag = !oDecisionTableSettings.conditionsTable.getBusy();
                                                    return bFlag;
                                    },
                                    success: function (oNode) {
                                        Opa5.assert.ok(true, successMessage);
                                    },
                                    errorMessage: "The Decision Table Settings isn't shown"
                    });
				},
					iCanSeeTheColumn: function (successMessage, iColumn) {
						return this.waitFor({
							controlType : "sap.rules.ui.ExpressionAdvanced",
							// viewName: sViewName,
							searchOpenDialogs : true,
							matchers : function(oExpressionAdvanced) {
								return (oExpressionAdvanced.getValue() == "");
							},

							success: function (oNode) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "The Decision Table Settings isn't shown"
						});
					},
					iCanSeeTheNewLine: function (successMessage, iColumn) {
						return this.waitFor({
							controlType : "sap.ui.table.Row",
							// viewName: sViewName,
							check: function(oRow){
								return (oRow.length > iColumn);	
							},
							success: function (oRow) {
								//(new Press()).executeOn(oRow[0]);
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "The 2nd row isn't shown"
						});
					}
	            }
	        }
	    });	
	});