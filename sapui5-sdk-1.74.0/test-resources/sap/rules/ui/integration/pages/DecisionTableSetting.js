sap.ui.require([
		'sap/ui/test/Opa5',
		"sap/ui/test/actions/Press",
		"sap/ui/test/actions/EnterText",
		'sap/ui/test/matchers/AggregationLengthEquals',
		'sap/ui/test/matchers/PropertyStrictEquals',
		'sap/rules/ui/integration/pages/Common',
		'sap/ui/test/matchers/BindingPath',
		'sap/ui/test/matchers/AggregationContainsPropertyEqual'
	],
	function(Opa5, Press, EnterText, AggregationLengthEquals, PropertyStrictEquals, Common, BindingPath, AggregationContainsPropertyEqual) {
		"use strict";

		//var sRuleId = "005056A7004E1EE68BC1DC0AA517E4AA";
		//var sRulePath = "/Rules(\'" + sRuleId + "\')";
		var sButtonId = "sap.m.Button";

		Opa5.createPageObjects({
			onTheSettingsPage: {
				baseClass: Common,
				actions: {
					// iPressTheApplyButton: function(successMessage, sViewName){
					// 	return pressButton.call(this, successMessage, "apply", sViewName);
					// },
					iWaitForSettingNotBusy: function(successMessage, sViewName) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.rules.ui.DecisionTableSettings",
							viewName: sViewName,
							check: function(oDecisionTableSettings) {
								var bBusy = oDecisionTableSettings[0].getBusy() || oDecisionTableSettings[0].conditionsTable.getBusy();
								return !bBusy;
							},

							success: function(oMessageStrip) {
								Opa5.assert.ok(true, successMessage);
							},

							errorMessage: "There isn't any DecisionTableSettings"
						});
					},
					iWaitForButtonDisabled: function(successMessage, controlType, sViewName, iconURL) {
						return this.waitFor({
							controlType: controlType,
							searchOpenDialogs: true,
							viewName: sViewName,
							matchers: function(button) {
								var buttonIcon = button.getIcon();
								//return button.getText() === "Refresh";
								return (buttonIcon === iconURL) && (button.getEnabled() === false);
							},
							success: function(button) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Can't find the Refresh button"
						});
					},
					iSetHitPolicy: function(successMessage, sHitPolicyKey) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.Select",
							matchers: function(oSelect) {
								return (oSelect.getItems()[0].getKey() === "FM" &&
									oSelect.getItems()[1].getKey() == "AM");
							},
							success: function(oSelect) {
								oSelect[0].setSelectedKey(sHitPolicyKey);
								Opa5.assert.ok(true, successMessage);
							},

							errorMessage: "The Hit Policy selcet control is not found"
						});
					},

					iPressTheButton: function(successMessage, buttonText, sViewName, dialogTitle) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.Button",
							//id: sButtonId,
							viewName: sViewName,
							matchers: function(oButton) {
								//check button text match
								var isMatch = (oButton.getText() == buttonText);
								//check dialog title match
								if (isMatch && dialogTitle) {
									if (oButton.getParent().getTitle() !== dialogTitle) {
										isMatch = false;
									}
								}
								return isMatch;
							},
							actions: [new Press()],

							success: function(oButton) {
								Opa5.assert.ok(true, successMessage);
							},

							errorMessage: "The button " + buttonText + " is not found"
						});
					},
					iPressTheWarningButton: function(successMessage, buttonText, buttonID, sViewName) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.Button",
							viewName: sViewName,
							matchers: function(oButton) {
								var isInWarning = false;
								if (oButton.getParent()) {
									if (oButton.getParent().sId.indexOf("warning") >= 0) {
										isInWarning = true;
									}
								}

								var isIdentified = (oButton.getText() == buttonText) || ((buttonText === "Cancel") && (oButton.getText() != "OK"));
								return ((isIdentified) && (isInWarning));
							},
							success: function(oButton) {
								oButton[oButton.length - 1].$().trigger("tap");
								Opa5.assert.ok(true, successMessage);
							},

							errorMessage: "The button " + buttonText + " is not found"
						});
					},
					iClickTheAddRemoveButton: function(successMessage, controlType, hBoxId, addRemoveButtoIndex, sViewName) {
						this.waitFor({
							searchOpenDialogs: true,
							controlType: controlType,
							viewName: sViewName,
							success: function(oHorizontalLayout) {
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
					iClickTheButtonByIcon: function(successMessage, controlType, sViewName, iconURL) {
						return this.waitFor({
							controlType: controlType,
							searchOpenDialogs: true,
							viewName: sViewName,
							matchers: function(button) {
								var buttonIcon = button.getIcon();
								return buttonIcon === iconURL;

							},
							success: function(button) {
								jQuery(button[0].getDomRef()).trigger("tap");
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Can't find the Refresh button"
						});
					},
					iPressOnTheItemWithTheID: function(sId, sViewName) {
						return this.waitFor({
							controlType: "sap.m.ColumnListItem",
							viewName: sViewName,
							matchers: new BindingPath({
								path: "/Posts('" + sId + "')"
							}),
							success: function(aListItems) {
								aListItems[0].$().trigger("tap");
							},
							errorMessage: "No list item with the id " + sId + " was found."
						});
					},
					iAddColumnData: function(successMessage, controlType, rowIndex, expressionStr, fixOperatorStr, sViewName) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: controlType,
							viewName: sViewName,
							check: function(oTable) {
								var oRow = oTable[0].getItems()[rowIndex];
								if (oRow) {
									var oCells = oRow.getCells();
									if (expressionStr != null) {
										oCells[0].setValue(expressionStr);
										oCells[0].fireChange();
									}
									if (fixOperatorStr != null) {
										oCells[1].setSelectedKey(fixOperatorStr);
									}

									return true;
								} else {
									return false;
								}
							},
							success: function(oTable) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Cannot update column Data"
						});
					},
					iPressOnResultInput: function() {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.Input",
							matchers: new PropertyStrictEquals({
								name: "showValueHelp",
								value: true
							}),
							actions: [new Press()],
							success: function(aInput) {
								Opa5.assert.ok(true, "Press on result input");
							},
							errorMessage: "Press on result input failed"
						});
					},
					iPressOkButtonInResultWarningDialog: function() {
						return this.iPressTheButton("Ok button pressed", "OK", null);
					},
					iPressCancelButtonInResultWarningDialog: function() {
						return this.iPressTheButton("Cancel button pressed", "Cancel", null, "Change Result");
					},
					iSearchResultInValueHelp: function(sResultName) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.SearchField",
							actions: [new EnterText({
								text: sResultName
							})],
							success: function(aSearchField) {
								Opa5.assert.equal(aSearchField[0].getValue(), sResultName, "Search result in value help");
							},
							errorMessage: "Search result in value help failed"
						});
					},
					iSelectResultInValueHelp: function(itemTitle) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.StandardListItem",
							check: function(oStandardListItem) {
								for (var i = 0; i < oStandardListItem.length; i++) {
									if (oStandardListItem[i].getTitle() === itemTitle) {
										jQuery(oStandardListItem[i].getDomRef()).tap();
										return oStandardListItem[i];
									}
								}
								return false;
							},
							success: function() {
								Opa5.assert.ok(true, "Select result from value help");
							},
							errorMessage: "Select result from value help failed"
						});
					},
					iCanSeeSelectDialog: function() {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.List",
							matchers: function(oSelectDialog) {
								return oSelectDialog && oSelectDialog.isActive() && oSelectDialog.getAggregation("items");
							},
							success: function(aInput) {
								Opa5.assert.ok(true, "I can see sap.m.SelectDialog control");
							},
							errorMessage: "Press on result input failed"
						});
					},
					iChangeColumnMode: function(successMessage, index, sMode) {
						this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.ColumnListItem",
							check: function(oColumn) {
								if (oColumn[index] && oColumn[index].getAggregation("cells")[2]) {
									var oSelect = oColumn[index] && oColumn[index].getAggregation("cells")[2];
									if (oSelect instanceof sap.m.Select) {
										oSelect.fireChange(new sap.ui.core.Item({
											key: sMode,
											text: sMode
										}));
										return true;
									}
								}
								return false;
							},
							success: function(oSelect) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Can't find the plus button"
						});
					},
					iPressButtonInTheChangeModeDialog: function(successMessage, sButton) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.Dialog",
							matchers: function(oDialog) {
								return new PropertyStrictEquals({
									name: "state",
									value: 'Warning'
								}).isMatching(oDialog);
							},
							success: function(oDialog) {
								if (sButton === "Cancel") {
									oDialog[0].getAggregation("endButton").firePress();
								} else {
									oDialog[0].getAggregation("beginButton").firePress();
								}
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Cna't press the button"
						});
					}
				},
				assertions: {
					iCanSeeDialogForChangeMode: function() {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.Dialog",
							matchers: function(oDialog) {
								return new PropertyStrictEquals({
									name: "state",
									value: 'Warning'
								}).isMatching(oDialog);
							},
							success: function(oDialog) {
								Opa5.assert.ok(true, "I can see the dialog for changed mode");
							},
							errorMessage: "Can't see the dialog for changed mode"
						});
					},
					iCanSeeItemInList: function(itemTitle) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.StandardListItem",
							check: function(oStandardListItem) {
								for (var i = 0; i < oStandardListItem.length; i++) {
									if (oStandardListItem[i].getTitle() === itemTitle) {
										oStandardListItem[i]
										return oStandardListItem[i];
									}
								}
								return false;
							},
							success: function() {
								Opa5.assert.ok(true, "Can see the item: " + itemTitle);
							},
							errorMessage: "Select result from value help failed"
						});
					},
					iCheckInputMode: function(successMessage, index, bIsEnabled, sMode) {
						this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.ColumnListItem",
							check: function(oColumn) {
								if (oColumn[index] && oColumn[index].getAggregation("cells")[2] instanceof sap.m.Select) {
									var oSelect = oColumn[index].getAggregation("cells")[2];
									return (oSelect.getEnabled() === bIsEnabled && oSelect.getSelectedItem().getText() === sMode);
								}
								return false;
							},
							success: function(oColumn) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Can't find the plus button"
						});
					},
					iCanSeeDecisionTableSettings: function(successMessage) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTableSettings",
							// viewName: sViewName,
							searchOpenDialogs: true,
							matchers: function(oDecisionTableSettings) {
								var bFlag = !oDecisionTableSettings.conditionsTable.getBusy();
								return bFlag;
							},
							success: function(oNode) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "The Decision Table Settings isn't shown"
						});
					},
					iCheckResultDialogCloesd: function(buttonText, sViewName) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTableSettings",
							searchOpenDialogs: true,
							matchers: function(oDecisionTableSettings) {
								return !oDecisionTableSettings.oSelectDialog;
							},

							success: function() {
								Opa5.assert.ok(true, "The Dialog Closed");
							},

							errorMessage: "The button is not found"
						});
					},
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
							searchOpenDialogs: true,
							controlType: "sap.rules.ui.DecisionTableSettings",
							viewName: sViewName,
							check: function(oDecisionTableSettings) {
								var oForm = oDecisionTableSettings[0].getAggregation("mainLayout");
								var formContentArray = oForm.getContent();
								return formContentArray.length === 12;
							},

							success: function(oMessageStrip) {
								Opa5.assert.ok(true, successMessage);
							},

							errorMessage: "DecisionTableSettings Layout not contains all controls"
						});
					},
					iCheckHitPolicySelection: function(successMessage, sViewName) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.rules.ui.DecisionTableSettings",
							viewName: sViewName,
							check: function(oDecisionTableSettings) {
								var oForm = oDecisionTableSettings[0].getAggregation("mainLayout");
								var formContentArray = oForm.getContent();
								var oHitPolicy = formContentArray[1];
								var isEnabled = oHitPolicy.getEnabled();
								var hitPolicyselectedKey = oHitPolicy.getSelectedKey();

								var model = oDecisionTableSettings[0].getModel();
								var context = oDecisionTableSettings[0].getBindingContext();
								var hitPolictDataInModel = model.getProperty("DecisionTable/HitPolicy", context);

								return isEnabled && ((hitPolictDataInModel === hitPolicyselectedKey) || (model.oData.DecisionTable.HitPolicy ===
									hitPolicyselectedKey));
							},

							success: function(oMessageStrip) {
								Opa5.assert.ok(true, successMessage);
							},

							errorMessage: "HitPolicy selection is not EQ to model"
						});
					},
					iCheckFixedOperatorData: function(successMessage, sViewName) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.rules.ui.DecisionTableSettings",
							viewName: sViewName,
							check: function(oDecisionTableSettings) {
								var sExpression = "'CONNID of the BOOKING_2'";
								var fixedOperatiorData = oDecisionTableSettings[0]._getFixedOperatorDataForExpression(sExpression);
								var expected = [{
									key: "",
									value: "None"
								}, {
									key: "is equal to",
									value: "is equal to"
								}, {
									key: "is not equal to",
									value: "is not equal to"
								}, {
									key: "is equal or greater than",
									value: "is equal or greater than"
								}, {
									key: "is greater than",
									value: "is greater than"
								}, {
									key: "is equal or less than",
									value: "is equal or less than"
								}, {
									key: "is less than",
									value: "is less than"
								}, {
									key: "contains",
									value: "contains"
								}, {
									key: "does not contain",
									value: "does not contain"
								}, {
									key: "is like",
									value: "is like"
								}, {
									key: "is not like",
									value: "is not like"
								}, {
									key: "does not start with",
									value: "does not start with"
								}, {
									key: "starts with",
									value: "starts with"
								}, {
									key: "does not end with",
									value: "does not end with"
								}, {
									key: "ends with",
									value: "ends with"
								}, {
									key: "is between",
									value: "is between"
								}, {
									key: "is not between",
									value: "is not between"
								}, {
									key: "exists in",
									value: "exists in"
								}, {
									key: "does not exist in",
									value: "does not exist in"
								}];

								var ie11andabove = navigator.userAgent.indexOf('Trident') != -1 && navigator.userAgent.indexOf('MSIE') == -1; // IE11 or above
								var ie10andbelow = navigator.userAgent.indexOf('MSIE') != -1; // IE10 or below
								var edge = navigator.userAgent.indexOf('Edge/') != -1; // // IE Edge

								if (navigator.userAgent.indexOf("Firefox") != -1) {
									expected = [{
										"key": "",
										"value": "None"
									}, {
										"key": "is equal to",
										"value": "is equal to"
									}, {
										"key": "is not equal to",
										"value": "is not equal to"
									}, {
										"key": "is equal or greater than",
										"value": "is equal or greater than"
									}, {
										"key": "is greater than",
										"value": "is greater than"
									}, {
										"key": "is equal or less than",
										"value": "is equal or less than"
									}, {
										"key": "is less than",
										"value": "is less than"
									}, {
										"key": "contains",
										"value": "contains"
									}, {
										"key": "does not contain",
										"value": "does not contain"
									}, {
										key: "is like",
										value: "is like"
									}, {
										key: "is not like",
										value: "is not like"
									}, {
										"key": "does not start with",
										"value": "does not start with"
									}, {
										"key": "starts with",
										"value": "starts with"
									}, {
										"key": "does not end with",
										"value": "does not end with"
									}, {
										"key": "ends with",
										"value": "ends with"
									}, {
										"key": "is between",
										"value": "is between"
									}, {
										"key": "is not between",
										"value": "is not between"
									}, {
										"key": "exists in",
										"value": "exists in"
									}, {
										"key": "does not exist in",
										"value": "does not exist in"
									}];
								} else if (ie11andabove || ie10andbelow || edge) {
									expected = [{
										"key": "",
										"value": "None"
									}, {
										"key": "is equal to",
										"value": "is equal to"
									}, {
										"key": "is not equal to",
										"value": "is not equal to"
									}, {
										"key": "is equal or greater than",
										"value": "is equal or greater than"
									}, {
										"key": "is greater than",
										"value": "is greater than"
									}, {
										"key": "is equal or less than",
										"value": "is equal or less than"
									}, {
										"key": "is less than",
										"value": "is less than"
									}, {
										"key": "contains",
										"value": "contains"
									}, {
										"key": "does not contain",
										"value": "does not contain"
									}, {
										key: "is like",
										value: "is like"
									}, {
										key: "is not like",
										value: "is not like"
									}, {
										"key": "does not start with",
										"value": "does not start with"
									}, {
										"key": "starts with",
										"value": "starts with"
									}, {
										"key": "does not end with",
										"value": "does not end with"
									}, {
										"key": "ends with",
										"value": "ends with"
									}, {
										"key": "is between",
										"value": "is between"
									}, {
										"key": "is not between",
										"value": "is not between"
									}, {
										"key": "exists in",
										"value": "exists in"
									}, {
										"key": "does not exist in",
										"value": "does not exist in"
									}];
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
					theRemoveButtonInvisible: function(successMessage, controlType, hBoxId, addRemoveButtoIndex, sViewName) {
						this.waitFor({
							searchOpenDialogs: true,
							controlType: controlType,
							viewName: sViewName,
							check: function(oHorizontalLayout) {
								var oButtons = oHorizontalLayout[hBoxId].getAggregation("content");
								var oAddRemoveButton = oButtons[addRemoveButtoIndex];
								return !oAddRemoveButton.isActive();
							},
							success: function(oHorizontalLayout) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "The remove button is visable..."
						});
					},
					theFormIsPresent: function(sViewName) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.ui.layout.form.SimpleForm",
							viewName: sViewName,

							check: function(aForms) {
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
							searchOpenDialogs: true,
							controlType: "sap.m.MessageStrip",
							viewName: sViewName,

							check: function(oMessageStrip) {
								return oMessageStrip[0].getVisible() == bIsVisible;
							},

							success: function(oMessageStrip) {
								Opa5.assert.ok(true, "The MessageString is found and configured visible == " + bIsVisible);
							},

							errorMessage: "The MessageStrip is not found or is visiblity is incorrect"
						});
					},
					iCheckNumOfCols: function(successMessage, controlType, iExpectedNumberOfColumns, sViewName, sRulePath) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: controlType,
							viewName: sViewName,
							check: function(oTable) {
								// verify {iExpectedNumberOfColumns} columns appear in the table:
								var numberOfColumns = oTable[0].getColumns();
								if (numberOfColumns) {
									return numberOfColumns.length === iExpectedNumberOfColumns * 1;
								}
								if (numberOfColumns === null && iExpectedNumberOfColumns === 0) {
									return numberOfColumns.length === iExpectedNumberOfColumns * 1;
								} else {
									return false;
								}
							},
							success: function(oTable) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Can't read from oData the number of rows"
						});
					},
					iCheckSettingNoBusy: function(successMessage, sViewName) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.rules.ui.DecisionTableSettings",
							viewName: sViewName,
							check: function(oDecisionTableSettings) {
								var bFlag = !oDecisionTableSettings.getBusy();
								return bFlag;
							},

							success: function(oMessageStrip) {
								Opa5.assert.ok(true, successMessage);
							},

							errorMessage: "There isn't any DecisionTableSettings"
						});
					},
					iCheckColumnData: function(successMessage, controlType, rowIndex, expressionStr, fixOperatorStr, sViewName) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: controlType,
							viewName: sViewName,
							check: function(oTable) {
								var oRow = oTable[0].getItems()[rowIndex];
								var oCells = oRow.getCells();
								var sCellExpression = oCells[0].getValue();
								var sFixOperatoro = oCells[1].getSelectedKey();
								return sCellExpression === expressionStr && sFixOperatoro === fixOperatorStr;
							},
							success: function(oTable) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Cannot update column Data"
						});
					},
					iCheckColumnDataByModel: function(successMessage, controlType, rowIndex, expressionStr, fixOperatorStr, sViewName) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: controlType,
							viewName: sViewName,
							check: function(oTable) {
								var oRow = oTable.getItems()[rowIndex];
								var sCellExpression = oRow.getBindingContext().getProperty("Condition/Expression");
								var sFixOperatoro = oRow.getBindingContext().getProperty("Condition/FixedOperator");
								return sCellExpression === expressionStr && sFixOperatoro === fixOperatorStr;
							},
							success: function(oTable) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Cannot update column Data"
						});
					},
					iCanSeeResultInput: function(sResultValue) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.Input",
							// matchers: function(oInput){
							// 	var isMatch;
							// 	if (sResultValue){
							// 		isMatch = (oInput.getValue() === sResultValue);
							// 	} else {
							// 		//check for empty value
							// 		isMatch = (!oInput.getValue());
							// 	}
							// 	return isMatch;
							// },
							matchers: new PropertyStrictEquals({
								name: "value",
								value: sResultValue
							}),
							check: function(aInput) {
								if (aInput.length === 1) {
									return true;
								}
							},
							success: function(aInput) {
								Opa5.assert.equal(aInput[0].getValue(), sResultValue, "Wait for Result Value In Input control");
							},

							errorMessage: "Result value is incorrect"
						});
					},
					iCheckNumberOfItemsInResultValueHelp: function(iNumOfItems) {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.StandardListItem",
							check: function(aItems) {
								return aItems.length === iNumOfItems;
							},
							success: function(aItems) {
								Opa5.assert.equal(aItems.length, iNumOfItems, "Check number of items in result value help");
							},
							errorMessage: "Check number of items failed"
						});
					},
					
					iSeeTable: function(successMessage, nTable){
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.Table",
							success: function(oTable) {
								var table = oTable[nTable];
								if(table.getColumns().length === 3){
									Opa5.assert.ok(true, successMessage + "Table present");
								} else {
									Opa5.assert.ok(false, "Table present not as expected");
								}
							},
							errorMessage: "Table not present"
						});
					},
					
					iSeeMessageStrip: function(sText){
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.MessageStrip",
							matchers: function(oStrip){
								return new PropertyStrictEquals({
									name: "text",
									value: sText
								}).isMatching(oStrip);
							},
							success: function(oStrip) {
								Opa5.assert.ok(true, "Message strip is present");
							},
							errorMessage: "Message strip not present"
						});
					}
				}
			}
		});

	});