sap.ui.require([
		'sap/ui/test/Opa5',
		"sap/ui/test/actions/Press",
		'sap/ui/test/matchers/AggregationLengthEquals',
		'sap/ui/test/matchers/PropertyStrictEquals',
		'sap/rules/ui/integration/pages/Common',
		'sap/ui/test/matchers/BindingPath',
		'sap/ui/test/matchers/AggregationContainsPropertyEqual'
	],
	function (Opa5, Press, AggregationLengthEquals, PropertyStrictEquals, Common, BindingPath, AggregationContainsPropertyEqual) {
		"use strict";

		//var sRuleId = "005056A7004E1EE68BC1DC0AA517E4AA";
		//var sRulePath = "/Rules(\'" + sRuleId + "\')";
		var	sButtonId = "sap.m.Button";
		
		// var pressButton = function(successMessage, buttonText, sViewName){
		// 	return this.waitFor({
		// 					searchOpenDialogs : true,
		// 					id: "sap.m.Button",
		// 					viewName: sViewName,
		// 					matchers: function(oButton) {
		// 						return new PropertyStrictEquals({
		// 							name: "text",
		// 							value: buttonText
		// 						}).isMatching(oButton);
		// 					},
							
		// 					success: function(oButton) {
		// 						Opa5.assert.ok(true, successMessage);
		// 						oButton[0].$().trigger("tap");							
		// 					},
		// 					errorMessage: "The button is not found"
		// 				});
		// };
		
		Opa5.createPageObjects({
			onTheSettingsPage: {
				baseClass: Common,
				actions: {
					// iPressTheApplyButton: function(successMessage, sViewName){
					// 	return pressButton.call(this, successMessage, "apply", sViewName);
					// },
					iWaitForSettingNotBusy: function(successMessage, sViewName) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: "sap.rules.ui.DecisionTableSettingsOld",
							viewName: sViewName,
							check : function (oDecisionTableSettings) {
								var bBusy = oDecisionTableSettings[0].getBusy()
											|| oDecisionTableSettings[0].conditionsTable.getBusy();
								return !bBusy;
							},
							
							success: function(oMessageStrip) {
								Opa5.assert.ok(true, successMessage);
							},
							
							errorMessage: "There isn't any DecisionTableSettings"
						});
					},
					iSetHitPolicy: function(successMessage, sHitPolicyKey) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: "sap.m.Select",
							matchers: function(oSelect) {
								return (oSelect.getItems()[0].getKey() == "FM");
							},
							success: function(oSelect) {
								oSelect[0].setSelectedKey(sHitPolicyKey);
								Opa5.assert.ok(true, successMessage);
							},

							errorMessage: "The Hit Policy selcet control is not found"
						});
					},
					
					iPressTheButton: function(successMessage, buttonText, sViewName) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: "sap.m.Button",
							//id: sButtonId,
							viewName: sViewName,
							matchers: function(oButton) {
								return (oButton.getText() == buttonText);
							},
							actions: [new Press()],

							success: function(oButton) {
								Opa5.assert.ok(true, successMessage);
							},

							errorMessage: "The button "+ buttonText +" is not found"
						});
					},					
					iClickTheAddRemoveButton: function (successMessage, controlType, hBoxId, addRemoveButtoIndex, sViewName) {
	                    this.waitFor({
	                        searchOpenDialogs : true,
	                        controlType: controlType,
	                        viewName: sViewName,
	                        success: function (oHorizontalLayout) {
	                           var oButtons = oHorizontalLayout[hBoxId].getAggregation("content");
	                           var oAddButton = oButtons[addRemoveButtoIndex];
	                           var oPress = new Press();
	                        	   oPress.executeOn(oAddButton);
	                           Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Can't find the plus button"
	                    });
	                    
	                    return this;
	                },					
					iPressTheButtonID: function(successMessage, buttonId, sViewName) {
						return this.waitFor({
							id: sButtonId,
							viewName: sViewName,
							matchers: function(oButton) {
								return new PropertyStrictEquals({
									name: "id",
									value: buttonId
								}).isMatching(oButton);
							},
							
							success: function(oButton) {
								oButton.$().trigger("tap");
								Opa5.assert.ok(true, successMessage);
							},
							
							errorMessage: "The button is not found"
						});
					},
					iPressOnTheItemWithTheID: function (sId, sViewName) {
						return this.waitFor({
							controlType: "sap.m.ColumnListItem",
							viewName: sViewName,
							matchers:  new BindingPath({
								path: "/Posts('" + sId + "')"
							}),
							success: function (aListItems) {
								aListItems[0].$().trigger("tap");
							},
							errorMessage: "No list item with the id " + sId + " was found."
						});
					},
					iAddColumnData: function (successMessage, controlType, rowIndex, expressionStr, fixOperatorStr, sViewName){
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: controlType,
							viewName: sViewName,
							check : function (oTable) {
								var oRow = oTable[0].getItems()[rowIndex];
								if(oRow){
									var oCells = oRow.getCells();
										if(expressionStr != null){
											oCells[0].setValue(expressionStr);
											oCells[0].fireChange();
										}
		           					    oCells[1].setSelectedKey(fixOperatorStr);
			                    	return true;
								} else {
									return false;
								}
							},
	                        success: function (oTable) {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Cannot update column Data"
						});
					}
				},
				assertions: {
					theButtonIsPresent: function(buttonText, sViewName) {
						return this.waitFor({
							id: sButtonId,
							viewName: sViewName,
							matchers: function(oButton) {
								return new PropertyStrictEquals({
									name: "text",
									value: buttonText
								}).isMatching(oButton);
							},
							
							success: function() {
								Opa5.assert.ok(true, "The button contains the correct text");							
							},
							
							errorMessage: "The button is not found"
						});
					},
					iTestLayoutContent: function(successMessage, sViewName) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: "sap.rules.ui.DecisionTableSettingsOld",
							viewName: sViewName,
							check : function (oDecisionTableSettings) {
								var oForm = oDecisionTableSettings[0].getAggregation("mainLayout");
								var formContentArray = oForm.getContent();
								return formContentArray.length == 6;
							},
							
							success: function(oMessageStrip) {
								Opa5.assert.ok(true, successMessage);
							},
							
							errorMessage: "DecisionTableSettings Layout not contains all controls"
						});
					},
					iCheckHitPolicySelection: function(successMessage, sViewName) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: "sap.rules.ui.DecisionTableSettingsOld",
							viewName: sViewName,
							check : function (oDecisionTableSettings) {
								var oForm = oDecisionTableSettings[0].getAggregation("mainLayout");
								var formContentArray = oForm.getContent();
								var oHitPolicy = formContentArray[1];
								var isEnabled = oHitPolicy.getEnabled();
								var hitPolicyselectedKey = oHitPolicy.getSelectedKey();
								
								var model = oDecisionTableSettings[0].getModel();
								var context = oDecisionTableSettings[0].getBindingContext();
								var hitPolictDataInModel = model.getProperty("DecisionTable/HitPolicy", context);								
								
								return isEnabled && (hitPolictDataInModel == hitPolicyselectedKey);
							},
							
							success: function(oMessageStrip) {
								Opa5.assert.ok(true, successMessage);
							},
							
							errorMessage: "HitPolicy selection is not EQ to model"
						});
					},
					iCheckFixedOperatorData: function(successMessage, sViewName) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: "sap.rules.ui.DecisionTableSettingsOld",
							viewName: sViewName,
							check : function (oDecisionTableSettings) {
								var sExpression = "'CONNID of the BOOKING'"; 
								var fixedOperatiorData = oDecisionTableSettings[0]._getFixedOperatorDataForExpression(sExpression);
								var expected  = [{key: "",value: "None" }, {key: "is equal to",value: "is equal to" }, {key: "is equal or greater than",value: "is equal or greater than" }, {key: "is greater than",value: "is greater than" }, {key: "is equal or less than",value: "is equal or less than" }, {key: "is less than",value: "is less than" }, {key: "is not equal to",value: "is not equal to" }, {key: "contains",value: "contains" }, {key: "does not contain",value: "does not contain" }, {key: "does not start with",value: "does not start with" }, {key: "starts with",value: "starts with" }, {key: "does not end with",value: "does not end with" }, {key: "ends with",value: "ends with" }, {key: "is not between",value: "is not between" }, {key: "is between",value: "is between" }, {key: "exists in",value: "exists in" }, {key: "does not exist in",value: "does not exist in"}];
								
								var ie11andabove = navigator.userAgent.indexOf('Trident') != -1 && navigator.userAgent.indexOf('MSIE') == -1 ;  // IE11 or above
								var ie10andbelow = navigator.userAgent.indexOf('MSIE') != -1 ; // IE10 or below
								var edge = navigator.userAgent.indexOf('Edge/') != -1; // // IE Edge
			
								if (navigator.userAgent.indexOf("Firefox") != -1){
									expected = [ {"key": "","value": "None"},{"key": "is equal to","value": "is equal to"},{"key": "is not equal to","value": "is not equal to"},{"key": "is equal or greater than","value": "is equal or greater than"},{"key": "is greater than","value": "is greater than"},{"key": "is equal or less than","value": "is equal or less than"},{"key": "is less than","value": "is less than"},{"key": "contains","value": "contains"},{"key": "does not contain","value": "does not contain"},{"key": "does not start with","value": "does not start with"},{"key": "starts with","value": "starts with"},{"key": "does not end with","value": "does not end with"},{"key": "ends with","value": "ends with"},{"key": "is between","value": "is between"},{"key": "is not between","value": "is not between"},{"key": "exists in","value": "exists in"},{"key": "does not exist in","value": "does not exist in"}];
								}else if (ie11andabove || ie10andbelow || edge){
									expected = [{"key": "","value": "None"},{"key": "is equal to","value": "is equal to"},{"key": "is not equal to","value": "is not equal to"},{"key": "is equal or greater than","value": "is equal or greater than"},{"key": "is greater than","value": "is greater than"},{"key": "is equal or less than","value": "is equal or less than"},{"key": "is less than","value": "is less than"},{"key": "contains","value": "contains"},{"key": "does not contain","value": "does not contain"},{"key": "does not start with","value": "does not start with"},{"key": "starts with","value": "starts with"},{"key": "does not end with","value": "does not end with"},{"key": "ends with","value": "ends with"},{"key": "is between","value": "is between"},{"key": "is not between","value": "is not between"},{"key": "exists in","value": "exists in"},{"key": "does not exist in","value": "does not exist in"}];
								}
										return JSON.stringify(fixedOperatiorData.fixOperatorEnumration) === JSON.stringify(expected);
										//fixedOperatiorData.fixOperatorEnumration == expected;
								//deepEqual(fixedOperatiorData.fixOperatorEnumration, expected );
								//return bol == 0;
							},
							
							success: function(oMessageStrip) {
								Opa5.assert.ok(true, successMessage);
							},
							
							errorMessage: "Fixed Operator generation is not EQ to model"
						});
					},					
					theRemoveButtonInvisible: function (successMessage, controlType, hBoxId, addRemoveButtoIndex, sViewName) {
	                    this.waitFor({
	                        searchOpenDialogs : true,
	                        controlType: controlType,
	                        viewName: sViewName,
	                        check : function (oHorizontalLayout) {
							   var oButtons = oHorizontalLayout[hBoxId].getAggregation("content");
	                           var oAddRemoveButton = oButtons[addRemoveButtoIndex];
	                        			
	                           return !oAddRemoveButton.isActive();
							},
	                        success: function (oHorizontalLayout) {
	                           Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "The remove button is visable..."
	                    });
	                },					
					theFormIsPresent: function(sViewName) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: "sap.ui.layout.form.SimpleForm",
							viewName: sViewName,

							check : function (aForms) {
								return aForms[0].getMaxContainerCols() === 1;
							},
							
							success: function(aForms) {
								Opa5.assert.ok(true, "The Form is found and configured with 1 column");
							},
							
							errorMessage: "The Form is not found"
						});
					},
					theMessageStringIsPresent: function(sViewName, bIsVisible) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: "sap.m.MessageStrip",
							viewName: sViewName,

							check : function (oMessageStrip) {
								return oMessageStrip[0].getVisible() == bIsVisible;
							},
							
							success: function(oMessageStrip) {
								Opa5.assert.ok(true, "The MessageString is found and configured visible == " + bIsVisible);
							},
							
							errorMessage: "The MessageStrip is not found or is visiblity is incorrect"
						});
					},
					iCheckNumOfCols: function(successMessage, controlType, iExpectedNumberOfRows, sViewName, sRulePath) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: controlType,
							viewName: sViewName,
							check : function (oTable) {
								// verify 2 rows appear in the table:
								var numberOfRows = oTable[0].getItems().length;
	                            return numberOfRows === iExpectedNumberOfRows*1;
							},
	                        success: function (oTable) {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Can't read from oData the number of rows"
						});
					},
					iCheckSettingNoBusy: function(successMessage, sViewName) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: "sap.rules.ui.DecisionTableSettingsOld",
							viewName: sViewName,
							matchers : function (oDecisionTableSettings) {
								var bFlag = !oDecisionTableSettings.getBusy();
								console.log("iCheckSettingNoBusy --> " +bFlag);
								return bFlag;
							},
							
							success: function(oMessageStrip) {
								Opa5.assert.ok(true, successMessage);
							},
							
							errorMessage: "There isn't any DecisionTableSettings"
						});
					},
					iCheckColumnData: function (successMessage, controlType, rowIndex,expressionStr, fixOperatorStr, sViewName){
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: controlType,
							viewName: sViewName,
							check : function (oTable) {
								var oRow = oTable[0].getItems()[rowIndex];
								var oCells = oRow.getCells();
								var sCellExpression = oCells[0].getValue();
								var sFixOperatoro = oCells[1].getSelectedKey();
								return sCellExpression === expressionStr && sFixOperatoro === fixOperatorStr;
							},
	                        success: function (oTable) {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Cannot update column Data"
						});
					},
					iCheckColumnDataByModel: function(successMessage, controlType, rowIndex, expressionStr, fixOperatorStr, sViewName) {
						return this.waitFor({
							searchOpenDialogs : true,
							controlType: controlType,
							viewName: sViewName,
							matchers : function (oTable) {
								var oRow = oTable.getItems()[rowIndex];
								var sCellExpression = oRow.getBindingContext().getProperty("Condition/Expression");
								var sFixOperatoro = oRow.getBindingContext().getProperty("Condition/FixedOperator");
								return sCellExpression === expressionStr && sFixOperatoro === fixOperatorStr;
							},
	                        success: function (oTable) {
	                            Opa5.assert.ok(true, successMessage);
	                        },
	                        errorMessage: "Cannot update column Data"
						});
					}
				}
			}
		});

	});