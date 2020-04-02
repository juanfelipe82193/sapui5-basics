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

		var getDTColumnConditionPath = function(rowId, colId, ruleId, version) {
			return "DecisionTableColumnConditions(RuleId='" + ruleId + "', Version='" + version + "',Id=" + colId + ")";
		};

		var getDTCellPath = function(rowIndex, colIndex, ruleId, version) {
			var rowId = rowIndex + 1,
				colId = colIndex + 1;
			return "/DecisionTableRowCells(RuleId='" + ruleId + "',Version='" + version + "',RowId=" + rowId + ",ColId=" + colId + ")";
		};

		Opa5.createPageObjects({
			onDecisionTableCellPage: {
				baseClass: Common,
				actions: {
					iClickDecisionTableCell: function(successMessage, iRow, iCol, sViewName, sRulePath) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTable",
							viewName: sViewName,
							matchers: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								return oCell;
							},
							success: function(oCell) {
								jQuery(oCell[0].getAggregation("_displayedControl").getDomRef()).trigger("click");
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Couldn't click DTCell"
						});
					},
					iEnterDecisionTableCell: function(successMessage, iRow, iCol, sViewName, sRulePath) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTable",
							viewName: sViewName,
							matchers: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								return oCell;
							},
							success: function(oCell) {
								var e = jQuery.Event("keyup", {
									keyCode: 13
								});
								jQuery(oCell[0].getAggregation("_displayedControl").getDomRef()).trigger(e);
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Couldn't trigger Enter for DTCell"
						});
					},
					iClickOnTheDecisionTableCellExpressionAdvanced: function(successMessage, iRow, iCol, sViewName, sRulePath) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTableCellExpressionAdvanced",
							viewName: sViewName,
							success: function(oDecisionTableCellExpressionAdvanced) {
								jQuery(oDecisionTableCellExpressionAdvanced[0].getDomRef()).click();
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Couldn't load DT"
						});
					},
					iChangeDecisionTableCellExpressionAdvancedValue: function(successMessage, iRow, iCol, sControlId, sViewName, sRulePath, sValue) {
						return this.waitFor({
							id: sControlId,
							viewName: sViewName,
							matchers: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								var oPopover = oCell._oPopover;
								if (oPopover && oPopover.getAggregation('content')[1] instanceof sap.rules.ui.DecisionTableCellExpressionAdvanced) {
									return oPopover.getAggregation('content')[1];
								}
							},
							success: function(oDecisionTableCellExpressionAdvanced) {
								oDecisionTableCellExpressionAdvanced.setValue(sValue);
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Couldn't change DTCellEA value"
						});
					},
					iChangeDecisionTableCellExpressionAdvancedValueThroughModel: function(successMessage, iRow, iCol, sControlId, sViewName, ruleId,
						version, sValue) {
						return this.waitFor({
							id: sControlId,
							viewName: sViewName,
							success: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								var oDecisionTableCellExpressionAdvanced = oCell.getAggregation("_displayedControl");
								var cellContentPath = getDTCellPath(iRow, iCol, ruleId, version) + "/Content";
								oDecisionTableCellExpressionAdvanced.getModel().setProperty(cellContentPath, sValue);
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Couldn't change DTCellEA value through model"
						});
					},
					iClosePopover: function(successMessage, iRow, iCol, sViewName, sRulePath) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTable",
							viewName: sViewName,
							matchers: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								return oCell;
							},
							success: function(oCell) {
								var e = jQuery.Event("keypress", {
									keyCode: 27
								});
								jQuery(oCell[0].getAggregation("_displayedControl").getDomRef()).trigger(e);
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "Couldn't close popover"
						});
					}
				},
				assertions: {
					iCheckAllCellsAreInput: function(successMessage, sViewName, sRulePath) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTableCell",
							viewName: sViewName,
							check: function(oCells) {
								oCells.forEach(function(oCell) {
									if (!(oCell.getAggregation("_displayedControl") instanceof sap.m.Input)) {
										return false;
									}
								});
								return true;
							},
							success: function() {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "DecisionTableCell are not displyed as sap.m.Input"
						});
					},
					iCheckCellIsDecisionTableCellExpressionAdvanced: function(successMessage, iRow, iCol, sControlId, sViewName, sRulePath) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTable",
							id: sControlId,
							viewName: sViewName,
							matchers: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								var oPopover = oCell._oPopover;
								var oDTCell = oPopover.getAggregation('content')[1];
								if (oPopover) {
									return oDTCell instanceof sap.rules.ui.DecisionTableCellExpressionAdvanced;
								}
							},
							success: function() {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "DecisionTableCell are not displyed as sap.rules.ui.DecisionTableCellExpressionAdvanced"
						});
					},
					iCheckCellIsDecisionTableCellExpressionBasic: function(successMessage, iRow, iCol) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTable",
							matchers: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								var oPopover = oCell._oPopover;
								if (oPopover) {
									return oPopover.getAggregation('content')[1] instanceof sap.rules.ui.DecisionTableCellExpressionBasic;
								}
							},
							success: function() {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "DecisionTableCell are not displyed as sap.rules.ui.DecisionTableCellExpressionBasic"
						});
					},
					iCheckPopOverIsClosed: function(successMessage, iRow, iCol, sControlId, sViewName, sRulePath) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTable",
							viewName: sViewName,
							matchers: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								return !oCell._oPopover;
							},
							success: function() {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "popover is not closed"
						});
					},
					iCheckCellValueStateText: function(successMessage, iRow, iCol, sControlId, sViewName, sRulePath, sValue) {
						return this.waitFor({
							id: sControlId,
							viewName: sViewName,
							matchers: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								var oPopover = oCell._oPopover;
								if (oPopover) {
									var oDecisionTableCellExpressionAdvanced = oPopover.getAggregation('content')[1];
									return sValue === oDecisionTableCellExpressionAdvanced.getValueStateText();
								}
							},
							success: function(oCells) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "DecisionTableCell not displying correct Value state"
						});
					},
					iCheckCellValueStateTextVH: function(successMessage, iRow, iCol, sControlId, sViewName, sRulePath, sValue) {
						return this.waitFor({
							controlType: "sap.m.Popover",
							viewName: sViewName,
							success: function(aPopover) {
								var oDecisionTableCellExpressionAdvanced = aPopover[0].getAggregation('content')[1];
								var sActualValue = oDecisionTableCellExpressionAdvanced.getValueStateText();
								Opa5.assert.equal(sActualValue, sValue, successMessage);
							},
							errorMessage: "DecisionTableCell displays wrong cell value state"
						});
					},
					iCheckCellValueByModel: function(successMessage, iRowIndex, iColIndex, sControlId, sViewName, ruleId, version, sValue) {
						return this.waitFor({
							id: sControlId,
							viewName: sViewName,
							success: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRowIndex];
								var oCell = oRow.getAggregation("cells")[iColIndex];
								var oDecisionTableCellExpressionAdvanced = oCell.getAggregation("_displayedControl");
								var cellContentPath = getDTCellPath(iRowIndex, iColIndex, ruleId, version) + "/Content";
								var actualResult = oDecisionTableCellExpressionAdvanced.getModel().getProperty(cellContentPath);
								Opa5.assert.equal(actualResult, sValue, successMessage);
							},
							errorMessage: "DecisionTableCell has wrong cell value by model"
						});
					},
					iCheckCellValue: function(successMessage, iRow, iCol, sValue) {
						return this.waitFor({
							controlType: "sap.rules.ui.DecisionTable",
							matchers: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								var oInput = oCell.getAggregation("_displayedControl");
								var actualResult = oInput.getValue();
								return actualResult === sValue;
							},
							success: function(oCells) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "DecisionTableCell has wrong cell value"
						});
					},
					iCheckCellFixedOperator: function(successMessage, iRow, iCol, sControlId, sViewName, ruleId, version, sValue) {
						return this.waitFor({
							id: sControlId,
							viewName: sViewName,
							matchers: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								var oDecisionTableCellExpressionAdvanced = oCell.getAggregation("_displayedControl");
								//var columnPath = getDTColumnConditionPath(iRow, iCol, ruleId, version);
								var actualResult = oDecisionTableCellExpressionAdvanced.getModel().oData[
									"DecisionTableColumnConditions(RuleId='ad10d571e5d244ac8e8bc80749c95db5',Version='000001',Id=1)"].FixedOperator;
								return actualResult === sValue;
							},
							success: function(oCells) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "DecisionTableCell having wrong fixed operator"
						});
					},
					iCheckCellHeader: function(successMessage, iRow, iCol, sControlId, sViewName, ruleId, version, sValue) {
						return this.waitFor({
							id: sControlId,
							viewName: sViewName,
							matchers: function(oDecisionTable) {
								var oRow = oDecisionTable.getAggregation("_table").getAggregation("rows")[iRow];
								var oCell = oRow.getAggregation("cells")[iCol];
								var oDecisionTableCellExpressionAdvanced = oCell.getAggregation("_displayedControl");
								var columnPath = getDTColumnConditionPath(iRow, iCol, ruleId, version);
								var actualResult = oDecisionTableCellExpressionAdvanced.getModel().oData[
									"DecisionTableColumnConditions(RuleId='ad10d571e5d244ac8e8bc80749c95db5',Version='000001',Id=1)"].Expression;
								return actualResult === sValue;
							},
							success: function(oCells) {
								Opa5.assert.ok(true, successMessage);
							},
							errorMessage: "DecisionTableCell displaying incorrect header value"
						});
					}
				}
			}
		});
	});