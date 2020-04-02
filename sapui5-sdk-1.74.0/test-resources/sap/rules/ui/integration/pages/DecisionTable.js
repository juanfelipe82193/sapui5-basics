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
	function(jQuery, Opa5, AggregationLengthEquals, PropertyStrictEquals, Common, BindingPath, EnterText, Press,
		AggregationContainsPropertyEqual, AggregationFilled) {
		"use strict";

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

		Opa5.extendConfig({
			timeout: 20,
			pollingInterval: 100
		});

		Opa5.createPageObjects({
			onDecisionTablePage: {
				baseClass: Common,
				actions: {
					iCanSeeDTWithData: function(successMessage, sDecisionTableId, sViewName, sRulePath) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTable",
							viewName: sViewName,
							matchers: function(oTable) {
								var bDTBusy = oTable._internalModel.getProperty("/busyState");
								var bTableBusy = oTable._internalModel.getProperty("/busyTableState");
								var dtReady = !bDTBusy && !bTableBusy;
								return dtReady;
							},
							success: function(oTable) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Couldn't load DT"
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
								jQuery(oPlusButton.getDomRef()).trigger("tap");
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Can't find the settings button"
						});
					},
					iClickAddLineFromMenu: function(successMessage, bInsertFirstOrAfter) {
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
								oPressAction.executeOn(oButton);
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Can't click the insert row option from the plus menu"
						});
					},
					iClickTheAddLink: function(successMessage, sViewName) {
						var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
						var oAddRowButtonText = oBundle.getText("addColumn");
						return this.iClickLinkByText(successMessage, sViewName, oAddRowButtonText);
					},
					iClickLinkByText: function(successMessage, sViewName, sText) {
						return this.waitFor({
							controlType: "sap.m.Toolbar",
							viewName: sViewName,
							matchers: function(oToolbar) {
								return new AggregationContainsPropertyEqual({
									aggregationName: "content",
									propertyName: "text",
									propertyValue: sText
								}).isMatching(oToolbar);
							},
							success: function(oToolbar) {
								var oContent = oToolbar[0].getAggregation("content");
								oContent.forEach(function(entry) {
									if (typeof entry.getText !== "undefined") {
										if (entry.getText() === sText) {
											var oPressAction = new PressObject.getPressInstance();
											oPressAction.executeOn(entry);
											Opa5.assert.ok(true, successMessage);
										}
									}
								});
							},
							errorMessage: "Can't find the text: " + sText
						});
					},
					iClickPasteTypeFromMenu: function(successMessage, bMenuItemIndex) {
						return this.waitFor({
							controlType: "sap.ui.unified.Menu",
							searchOpenDialogs: true,
							success: function(oMenu) {
								var oPressAction = new PressObject.getPressInstance();
								var oButton;

								oButton = oMenu[0].getAggregation("items")[bMenuItemIndex];

								oPressAction.executeOn(oButton);
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Can't click the paste/insert row option from the menu"
						});
					},
					iClickTheCheckBox: function(successMessage, sViewName, iNumberOfRow) {
						return this.waitFor({
							controlType: "sap.ui.table.Table",
							//viewName: sViewName,
							matchers: function(oTable) {
								//Make sure lines are loaded
								return oTable.getBinding("rows").getLength() > 0;
							},
							success: function(oTable) {
								// firefox understands 0 as false!
								if (iNumberOfRow === 0) {
									oTable[0].setSelectedIndex(iNumberOfRow);
								} else {
									var bCheckAll = iNumberOfRow || iNumberOfRow === parseInt(0);
									if (bCheckAll) {
										oTable[0].setSelectedIndex(iNumberOfRow);
									} else {
										oTable[0].selectAll();
									}
								}
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Couldn't select from check box"
						});
					},
					iClickTheDeleteLink: function(successMessage, sViewName) {
						return this.waitFor({
							controlType: "sap.m.Button",
							viewName: sViewName,
							matchers: function(oButton) {
								return new PropertyStrictEquals({
									name: "text",
									value: "Delete Row"
								}).isMatching(oButton);
							},
							success: function(oButton) {
								oButton[0].$().trigger("tap");
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "The button is not found"
						});
					},

					iSetCellFocus: function(successMessage, iNumberOfRow, iNumberOfCell, sViewName) {
						return this.waitFor({
							controlType: "sap.ui.table.Table",
							viewName: sViewName,
							matchers: function(oTable) {
								return (oTable.getRows() && oTable.getRows()[iNumberOfRow] && (oTable.getRows()[iNumberOfRow].getCells().length > 1));
							},
							success: function(oTable) {
								var oDT = oTable[0];
								var oRow = oDT.getRows()[iNumberOfRow];
								var oCells = oRow.getCells();
								var displayedControl = oCells[iNumberOfCell].getAggregation("_displayedControl");
								//(new Press()).executeOn(displayedControl);
								jQuery(displayedControl.getDomRef()).click();
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Cannot Set Cell focus"
						});
					},
					iClosePopover: function(successMessage, iRow, iCol, sViewName, sRulePath) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTable",
							viewName: sViewName,
							matchers: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								var oPopover = oCell._oPopover;
								return oPopover;
							},
							success: function(oPopover) {
								oPopover[0].fireBeforeClose();
								oPopover[0].fireAfterClose();
								//oPopover.close();
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Couldn't load DT"
						});
					},
					iSetCellValue: function(successMessage, sText, iNumberOfRow, iNumberOfCell, sViewName) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTableCellExpressionAdvanced",
							viewName: sViewName,
							// check : function(oDecisionTableCellExpressionAdvanced){
							// 	return 	oDecisionTableCellExpressionAdvanced.length == 1;
							// },
							/*matchers: function(oDecisionTableCellExpressionAdvanced) {
								return (oDecisionTableCellExpressionAdvanced.sId ==
									sap.ui.getCore().byId("__table1")
									.getRows()[iNumberOfRow].getCells()[iNumberOfCell]
									.getAggregation("_displayedControl").sId);
							},*/
							success: function(oDecisionTableCellExpressionAdvanced) {
								oDecisionTableCellExpressionAdvanced[0].setValue(sText);
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Cannot find and set the Decision Table Cell Expression Advanced"
						});
					},
					iPutCellValue: function(successMessage, iNumberOfRow, sViewName) {
						return this.waitFor({
							controlType: "sap.ui.table.Table",
							viewName: sViewName,
							matchers: function(oTable) {
								var oDT = oTable;
								var oRow = oDT.getRows()[iNumberOfRow];
								var oCells = oRow.getCells();
								return oCells;
							},
							success: function(oCells) {
								var iNumberOfCells = oCells[0].length;
								for (var i = 0; i < iNumberOfCells; i++) {
									var oInput = oCells[0][i].getAggregation("_displayedControl");
									if (i % 2) {
										oInput.setValue("is equal to 'abc'" /*Date.now().toString()*/ );
									} else {
										oInput.setValue("is equal to abc" /*Date.now().toString()*/ );
									}
								}
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Cannot Set Cell value"
						});
					},
					iScrollDown: function(successMessage, iScrollTop) {
						return this.waitFor({
							controlType: "sap.ui.table.Table",
							success: function(oTables) {
								var oTable = oTables[0];
								var sVerticalScrollBarId = oTable.sId + "-vsb";
								jQuery("#" + sVerticalScrollBarId).scrollTop(iScrollTop);
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Cannot Set Cell value"
						});
					}
				},
				assertions: {
					// iCheckCellSize: function(successMessage,iNumberOfRow, iNumberOfCell, sCellWidth, sViewName){
					// 	 return this.waitFor({
					// 		controlType: "sap.rules.ui.DecisionTableCellExpressionAdvanced",
					// 		viewName: sViewName,
					// 		success: function(oDecisionTableCellExpressionAdvanced) {
					// 			var oDecisionTableCellExpressionAdvancedWidth = jQuery('.sapRULDecisionTableSCellFocus').css('width');
					// 			//sap.ui.test.Opa.getContext().oDecisionTableCellExpressionAdvanced = oDecisionTableCellExpressionAdvanced[0];
					// 			Opa5.assert.equal( oDecisionTableCellExpressionAdvancedWidth, sCellWidth , successMessage);
					// 		},
					// 		errorMessage: "Cannot find the Decision Table Cell Expression Advanced control"
					// 	});
					// },
					iCheckValidationComplete: function() {
						return this.waitFor({
							controlType: "sap.ui.table.Table",
							matchers: function(oTable) {
								return window.flag;
							},
							success: function(oTables) {
								window.flag = true;
								Opa5.assert.ok(true, "Validation from value help done");
							},
							errorMessage: "Scroll value is wrong"
						});
					},
					iCheckScrollPosition: function(successMessage, iScrollTop) {
						return this.waitFor({
							controlType: "sap.ui.table.Table",
							matchers: function(oTable) {
								var sVerticalScrollBarId = oTable.sId + "-vsb";
								var nScrollPosition = jQuery("#" + sVerticalScrollBarId).scrollTop();
								return Math.round(nScrollPosition) === iScrollTop;
							},
							success: function(oTables) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Scroll value is wrong"
						});
					},

					iCheckCellSize: function(successMessage, iNumberOfRow, iNumberOfCell, sViewName) {
						return this.waitFor({
							controlType: "sap.ui.table.Table",
							viewName: sViewName,
							success: function(oTable) {
								var oDT = oTable[0];
								var oRow = oDT.getRows()[iNumberOfRow];
								var oCell = oRow.getCells()[iNumberOfCell];

								// because the .less file doesn't build, we need to put the css value excplicitly
								jQuery('.sapRULDecisionTableSCellFocus').css('position', 'absolute');
								jQuery('.sapRULDecisionTableSCellFocus').css('top', '0px');
								jQuery('.sapRULDecisionTableSCellFocus').css('z-index', '1');

								var oDecisionTableCellExpressionAdvancedMaxWidth = jQuery('.sapRULDecisionTableSCellFocus').css('max-width');
								var oDecisionTableCellExpressionAdvancedMinWidth = jQuery('.sapRULDecisionTableSCellFocus').css('min-width');
								//var oDecisionTableCellExpressionAdvancedWidth = jQuery('.sapRULDecisionTableSCellFocus').css('width');

								var oTd = jQuery.sap.byId(oCell.getId()).closest('td');
								var oCellWidth = oTd.width();

								var oNextTd = jQuery.sap.byId(oCell.getId()).closest('td').next();
								var oClosestCellWidth = oNextTd.width();

								var expectedWidth = 0;
								if (oClosestCellWidth) {
									expectedWidth = Math.round(oCellWidth + (oClosestCellWidth * 0.75));
									oCellWidth = Math.round((oCellWidth * 0.95 * 100) / 100);
								} else {
									expectedWidth = Math.round((oCellWidth * 0.95 * 100) / 100);
									oCellWidth = expectedWidth;
								}
								//Opa5.assert.equal( oDecisionTableCellExpressionAdvancedWidth, Math.round(expectedWidth) + 'px' , successMessage);
								Opa5.assert.equal(oDecisionTableCellExpressionAdvancedMinWidth, oCellWidth + 'px', successMessage);
								Opa5.assert.equal(oDecisionTableCellExpressionAdvancedMaxWidth, expectedWidth + 'px', successMessage);
							},
							errorMessage: "Cannot find the Decision Table Cell Expression Advanced control "
						});
					},

					iCanSeeTheDecisionTable: function(successMessage, sViewName) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTable",
							viewName: sViewName,
							matchers: function(oTable) {
								var bDTBusy = oTable._internalModel.getProperty("/busyState");
								var bTableBusy = oTable._internalModel.getProperty("/busyTableState");
								var oData = oTable._displayModel.getData();
								var bHaveModel = jQuery.isEmptyObject(oData);
								var dtReady = !bDTBusy && !bTableBusy && !bHaveModel;
								return dtReady;
								// matchers: function(oNode) {
								//	return (jQuery(oNode.getDomRef()).attr("class") == "sapRULDecisionTable");
							},
							success: function(oNode) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "The Decision Table isn't shown"
						});
					},
					iCheckNumOfRows: function(successMessage, sDecisionTableId, iExpectedNumberOfRows, sRulePath, sViewName) {
						return this.waitFor({
							//id: sDecisionTableId,
							controlType: "sap.rules.ui.DecisionTable",
							viewName: sViewName,
							matchers: function(oTable) {
								//var iNumberOfRows = oTable.getModel().getProperty(sRulePath + "/DecisionTable/DecisionTableRows").length;
								var iNumberOfRows = oTable.getAggregation("_table").mAggregations.rows.length;
								var bNumberOfRows = (iNumberOfRows === iExpectedNumberOfRows * 1);
								return bNumberOfRows;
							},
							success: function(oTable) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Can't read from oData the number of rows"
						});
					},
					iCheckNumOfColumns: function(successMessage, sDecisionTableId, iExpectedNumberOfColumns, sRulePath, sViewName) {
						return this.waitFor({
							//id: sDecisionTableId,
							controlType: "sap.rules.ui.DecisionTable",
							viewName: sViewName,
							matchers: function(oTable) {
								//var iNumberOfRows = oTable.getModel().getProperty(sRulePath + "/DecisionTable/DecisionTableRows").length;
								var iNumberOfColumns = oTable.getAggregation("_table").getAggregation("columns").length;
								return (iExpectedNumberOfColumns === iNumberOfColumns);
							},
							success: function(oTable) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Can't read from oData the number of columns"
						});
					},
					iCheckHeaderContent: function(successMessage, sExpectedValue, columnIndex, sViewName) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTable",
							viewName: sViewName,
							matchers: function(oTable) {
								var columns = oTable.getAggregation("_table").getAggregation("columns");
								var columnContent = columns[columnIndex].getAggregation("multiLabels")[1].getProperty("text");

								if (columnContent === sExpectedValue) {
									return true;
								}
								sExpectedValue = sExpectedValue + " ";
								if (columnContent === sExpectedValue) {
									return true;
								}

								return false;
							},
							success: function(oTable) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Wrong header value"
						});
					},
					iCanSeeTheValue: function(successMessage, iNumberOfRow, iNumberOfCell, sValue, sViewName) {
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							//viewName: sViewName,
							matchers: function(oRow) {
								var bMatch = (oRow.getBindingContext().sPath.indexOf("',Id=" + iNumberOfRow) > 0);
								var oCells = oRow.getCells();
								var displayedControl = oCells[iNumberOfCell].getAggregation("_displayedControl");
								return bMatch && (sValue !== "") && (displayedControl.getValue() !== "");
							},
							success: function(oRow) {
								var oCells = oRow[0].getCells();
								var displayedControl = oCells[iNumberOfCell].getAggregation("_displayedControl");
								var bResult = (sValue === displayedControl.getValue());
								if (bResult) {
									Opa5.assert.ok(bResult, successMessage);
								} else {
									Opa5.assert.ok(bResult, "The cell value is " + displayedControl.getValue() + " instead of " + sValue);
								}
							},
							errorMessage: "The row isn't found"
						});
					},

					iCanSeeTheValueByIndex: function(successMessage, indexOfRow, iNumberOfCell, sValue) {
						return this.waitFor({
							controlType: "sap.ui.table.Table",
							success: function(oTable) {
								var oRow = oTable[0].getRows()[indexOfRow];
								var oCellValue = oRow.getCells()[iNumberOfCell].getAggregation("_displayedControl").getValue()
								var bResult = (oCellValue === sValue);
								Opa5.assert.ok(bResult, successMessage);
							},
							errorMessage: "The row isn't found"
						});
					},

					iSaveTheRule: function(successMessage, sDecisionTableId, sViewName, sRulePath, sRuleId) {
						return this.waitFor({
							id: sDecisionTableId,
							viewName: sViewName,
							matchers: function(oTable) {
								var ruleData = oTable.getModel().getProperty(sRulePath);
								var bData = ruleData && (jQuery.isEmptyObject(ruleData) === false);
								return bData;
							},
							success: function(oTable) {
								var oRule = oTable.getModel().getProperty(sRulePath);
								var jsonObjectRule = {
									"Id": oRule.Id.toString(),
									"Name": oRule.Name.toString(),
									"Status": oRule.Status.toString(),
									"CreatedOn": oRule.CreatedOn.toString(),
									"CreatedBy": oRule.CreatedBy.toString(),
									"ChangedOn": oRule.ChangedOn.toString(),
									"Type": oRule.Type.toString(),
									"RuleFormat": oRule.RuleFormat.toString(),
									"ResultDataObjectName": oRule.ResultDataObjectName.toString(),
									"ResultDataObjectId": oRule.ResultDataObjectId.toString()
								};
								var oDecisionTable = oTable.getModel().getProperty(sRulePath + "/DecisionTable");
								var jsonObjectDecisionTable = {
									"RuleId": oDecisionTable.RuleId.toString(),
									"HitPolicy": oDecisionTable.HitPolicy.toString()
								};
								oRule = oTable.getModel().getProperty("/");
								var oDecisionTableRows = this.getPropertiesFromDecisionTable(oRule, "DecisionTableRows");
								var oDecisionTableColumns = this.getPropertiesFromDecisionTable(oRule, "DecisionTableColumns");
								var oDecisionTableColumnResults = this.getPropertiesFromDecisionTable(oRule, "DecisionTableColumnResults");
								var oDecisionTableColumnConditions = this.getPropertiesFromDecisionTable(oRule, "DecisionTableColumnConditions");
								var oDecisionTableRowCells = this.getPropertiesFromDecisionTable(oRule, "DecisionTableRowCells");
								this.saveDataToJson(jsonObjectRule, "Rule.json");
								this.saveDataToJson(jsonObjectDecisionTable, "DecisionTable.json");
								this.saveDataToJson(oDecisionTableRows, "DecisionTableRows.json");
								this.saveDataToJson(oDecisionTableColumns, "DecisionTableColumns.json");
								this.saveDataToJson(oDecisionTableColumnResults, "DecisionTableColumnResults.json");
								this.saveDataToJson(oDecisionTableColumnConditions, "DecisionTableColumnConditions.json");
								this.saveDataToJson(oDecisionTableRowCells, "DecisionTableRowCells.json");

								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Couldn't save rule"
						});
					},
					getPropertiesFromDecisionTable: function(oRule, sPropertyName) {
						var jsonObject = [];
						for (var propertyName in oRule) {
							var x = propertyName.startsWith(sPropertyName);
							if (x) {
								delete oRule[propertyName.toString()]["__metadata"];
								delete oRule[propertyName.toString()]["Cells"];
								//console.log(oRule[propertyName.toString()]);
								jsonObject.push(oRule[propertyName.toString()]);
							}
						}
						return jsonObject;
					},
					saveDataToJson: function(oJsonObject, sFileName) {
						var oBlob = new Blob([JSON.stringify(oJsonObject)], {
							type: 'application/json'
						});

						if (navigator.appVersion.toString().indexOf('.NET') > 0) {
							window.navigator.msSaveBlob(oBlob, sFileName);
						} else {
							var oLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
							oLink.href = URL.createObjectURL(oBlob);
							oLink.download = sFileName;
							oLink.click();
						}
					}
				}
			}
		});
	});