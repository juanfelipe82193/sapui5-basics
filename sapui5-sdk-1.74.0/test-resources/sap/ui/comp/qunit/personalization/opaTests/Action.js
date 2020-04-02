/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/Ancestor",
	"./Util",
	"sap/ui/comp/state/UIState",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/actions/EnterText"

], function(
	Opa5,
	Press,
	Properties,
	Ancestor,
	TestUtil,
	UIState,
	PropertyStrictEquals,
	EnterText
) {
	"use strict";

	/**
	 * The Action can be used to...
	 *
	 * @class Action
	 * @extends sap.ui.test.Opa5
	 * @author SAP
	 * @private
	 * @alias sap.ui.comp.qunit.personalization.test.Action
	 */
	var Action = Opa5.extend("sap.ui.comp.qunit.personalization.test.Action", {

		iLookAtTheScreen: function() {
			return this;
		},

		iPressOnPersonalizationButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://action-settings"
				}),
				actions: function(oControl) {
					setTimeout(function(){
						(new Press()).executeOn(oControl);
					}, 1000);
				}
			});
		},

		iPressOnLinkPersonalizationButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "POPOVER_DEFINE_LINKS")
				}),
				actions: new Press()
			});
		},

		iClickOnTheCheckboxSelectAll: function() {
			var oSelectAllCheckbox;
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.CheckBox",
				check: function(aCheckboxes) {
					return aCheckboxes.filter(function(oCheckbox) {
						if (jQuery.sap.endsWith(oCheckbox.getId(), '-sa')) {
							oSelectAllCheckbox = oCheckbox;
							return true;
						}
						return false;
					});
				},
				success: function() {
					oSelectAllCheckbox.$().trigger("tap");
				}
			});
		},

		iClickOnTheCheckboxShowFieldAsColumn: function() {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.CheckBox",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtil.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_LABELGROUPING")
				}),
				success: function(aCheckBoxes) {
					Opa5.assert.equal(aCheckBoxes.length, 1, "One CheckBox found");
					aCheckBoxes[0].$().trigger("tap");
				}
			});
		},

		iNavigateToPanel: function(sPanelName) {
			if (sap.ui.Device.system.phone) {
				return this.waitFor({
					controlType: "sap.m.List",
					success: function(aLists) {
						var oItem = TestUtil.getNavigationItem(aLists[0], sPanelName);
						oItem.$().trigger("tap");
					}
				});
			}
			return this.waitFor({
				controlType: "sap.m.SegmentedButton",
				success: function(aSegmentedButtons) {
					var oGroupButton = TestUtil.getNavigationItem(aSegmentedButtons[0], sPanelName);
					oGroupButton.$().trigger("tap");
				}
			});
		},

		iSelectColumn: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.m.CheckBox",
				success: function(aCheckBoxes) {
					aCheckBoxes.some(function(oCheckBox) {
						var oItem = oCheckBox.getParent();
						if (oItem.getCells) {
							var oText = oItem.getCells()[0];
							if (oText.getText() === sColumnName) {
								oCheckBox.$().trigger("tap");
								return true;
							}
						}
					});
				}
			});
		},

		iSelectLink: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.m.CheckBox",
				success: function(aCheckBoxes) {
					aCheckBoxes.some(function(oCheckBox) {
						var oItem = oCheckBox.getParent();
						if (oItem.getCells) {
							if (oItem.getCells()[0].getItems()[0].getText() === sColumnName) {
								oCheckBox.$().trigger("tap");
								return true;
							}
						}
					});
				}
			});
		},

		iPressRemoveLineButton: function(sPanelType) {
			var oFirstRemoveLineButton;
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Button",
				check: function(aButtons) {
					return aButtons.filter(function(oButton) {
						// "sap-icon://sys-cancel"
						if (oButton.getTooltip_Text() !== TestUtil.getRemoveButtonTooltipOf(sPanelType)) {
							return false;
						}
						if (!oFirstRemoveLineButton) {
							oFirstRemoveLineButton = oButton;
						}
						return true;
					});
				},
				success: function() {
					oFirstRemoveLineButton.$().trigger("tap");
				}
			});
		},

		iPressRestoreButton: function() {
			var oRestoreButton;
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Button",
				check: function(aButtons) {
					return aButtons.filter(function(oButton) {
						if (oButton.getText() !== TestUtil.getTextFromResourceBundle("sap.m", "P13NDIALOG_RESET")) {
							return false;
						}
						oRestoreButton = oButton;
						return true;
					});
				},
				success: function() {
					if (oRestoreButton && oRestoreButton.getEnabled()) {
						oRestoreButton.$().trigger("tap");
					}
				}
			});
		},

		iPressCancelButton: function() {
			var oCancelButton;
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Button",
				check: function(aButtons) {
					return aButtons.filter(function(oButton) {
						if (oButton.getText() !== TestUtil.getTextFromResourceBundle("sap.m", "P13NDIALOG_CANCEL")) {
							return false;
						}
						oCancelButton = oButton;
						return true;
					});
				},
				success: function() {
					oCancelButton.$().trigger("tap");
				}
			});
		},

		iPressEscape: function() {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Dialog",
				success: function(aDialogs) {
					aDialogs[0].$().trigger(jQuery.Event("keydown", { keyCode: 27 }));
				}
			});
		},

		iPressOkButton: function() {
			var oOKButton;
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Button",
				check: function(aButtons) {
					return aButtons.some(function(oButton) {
						if (oButton.getText() === TestUtil.getTextFromResourceBundle("sap.m", "P13NDIALOG_OK") && oButton.getParent().getMetadata().getName() === "sap.m.P13nDialog") {
							oOKButton = oButton;
							return true;
						}
					});
				},
				success: function() {
					oOKButton.$().trigger("tap");
				},
				errorMessage: "Did not find the 'OK' button"
			});
		},

		iPressDeleteRowButton: function(iIndex) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://sys-cancel"
				}),
				success: function(aButtons){
					if (iIndex < aButtons.length){
						new Press().executeOn(aButtons[iIndex]);
					}
				}
			});
		},

		iChangeSortSelection: function(sTextOld, sTextNew) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "value",
					value: sTextOld
				}),
				actions: new Press(),
				success: function(aComboBoxes) {
					Opa5.assert.equal(aComboBoxes.length, 1, "SortSelections Combobox found");
					this.waitFor({
						controlType: "sap.m.StandardListItem",
						matchers: [
							new Ancestor(aComboBoxes[0]), new Properties({
								title: sTextNew
							})
						],
						actions: new Press(),
						success: function(aCoreItems) {
							Opa5.assert.equal(aCoreItems[0].getTitle(), sTextNew, "SortSelection changed to '" + sTextNew + "'");
						},
						errorMessage: "Cannot select '" + sTextNew + "' from SortSelections Combobox"
					});
				}
			});
		},
		iChangeGroupSelection: function(sTextOld, sTextNew) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "value",
					value: sTextOld
				}),
				actions: new Press(),
				success: function(aComboBoxes) {
					Opa5.assert.equal(aComboBoxes.length, 1, "GroupSelections Combobox found");
					this.waitFor({
						controlType: "sap.m.StandardListItem",
						matchers: [
							new Ancestor(aComboBoxes[0]), new Properties({
								title: sTextNew
							})
						],
						actions: new Press(),
						success: function(aCoreItems) {
							Opa5.assert.equal(aCoreItems[0].getTitle(), sTextNew, "GroupSelection changed to '" + sTextNew + "'");
						},
						errorMessage: "Cannot select '" + sTextNew + "' from GroupSelections Combobox"
					});
				}
			});
		},

		iClickOnComboBox: function(sValue){
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "value",
					value: sValue
				}),
				success: function(aComboBoxes) {
					new Press().executeOn(aComboBoxes[0]);
				}
			});
		},

		iClickOnSelect: function(sValue){
			return this.waitFor({
				controlType: "sap.m.Select",
				matchers: new PropertyStrictEquals({
					name: "selectedKey",
					value: sValue
				}),
				success: function(aSelectLists) {
					new Press().executeOn(aSelectLists[0]);
				}
			});
		},

		iChangeTheCondition: function (sNewCondition, bExclude, iCondition) {
			var sLabel = TestUtil.getTextFromResourceBundle("sap.m", "FILTERPANEL_" + (bExclude ? "EXCLUDES" : "INCLUDES"));

			if (iCondition === undefined) {
				iCondition = 0;
			}

			return this.waitFor({
				controlType: "sap.m.Panel",
				searchOpenDialogs: true,
				matchers: function (oPanel) {
					// We try to match only the "Include/Exclude" part
					return oPanel.getHeaderText().substring(0, sLabel.length) === sLabel;
				},
				success: function (aPanels) {
					var oConditionPanel = aPanels[0].getContent()[0],
						aGrids = oConditionPanel.findAggregatedObjects(true, function (oControl) {
							return oControl.isA("sap.ui.layout.Grid");
						}),
						oSelect = aGrids[iCondition + 1].findAggregatedObjects(true, function (oControl) {
							// Heuristics: the first sap.m.Select control in the condition panel is the operations select
							return oControl.isA("sap.m.Select");
						})[0];
						oSelect.open();
						oSelect.findItem("text", sNewCondition).$().trigger("tap");
				}
			});
		},

		iChangeTheFilterField: function (sNewField, bExclude, iCondition, bAlternativeSelection) {
			var sLabel = TestUtil.getTextFromResourceBundle("sap.m", "FILTERPANEL_" + (bExclude ? "EXCLUDES" : "INCLUDES"));

			if (iCondition === undefined) {
				iCondition = 0;
			}

			return this.waitFor({
				controlType: "sap.m.Panel",
				searchOpenDialogs: true,
				matchers: function (oPanel) {
					// We try to match only the "Include/Exclude" part
					return oPanel.getHeaderText().substring(0, sLabel.length) === sLabel;
				},
				success: function (aPanels) {
					var oConditionPanel = aPanels[0].getContent()[iCondition],
						oComboBox = oConditionPanel.findAggregatedObjects(true, function (oControl) {
							// Heuristics: the first sap.m.ComboBox control in the condition panel is the field combobox
							return oControl.isA("sap.m.ComboBox");
						})[0],
						oItem;

					if (oComboBox.getSelectedKey() === sNewField) {
						return; // Do nothing
					}

					if (bAlternativeSelection) {
						oItem = oComboBox.findItem("text", sNewField);
						oComboBox.setSelectedItem(oItem);
						oComboBox.fireChange();
						oComboBox.fireSelectionChange({ selectedItem: oItem });
					} else {
						new EnterText({
							text: sNewField
						}).executeOn(oComboBox);
					}
				}
			});
		},

		iPressTheFilterAddButton: function (bExclude) {
			return this.waitFor({
				controlType: "sap.m.Button",
				searchOpenDialogs: true,
				matchers: [
					new PropertyStrictEquals({
						name: "tooltip",
						value: TestUtil.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_ADD_FILTER_TOOLTIP")
					}),
					new PropertyStrictEquals({
						name: "icon",
						value: "sap-icon://add"
					})
				],
				success: function (aButtons) {
					new Press().executeOn(aButtons[bExclude ? 1 : 0]);
				}
			});
		},

		iEnterTextInConditionField: function(bExclude, iCondition, sText1, sText2){
			var sLabel = TestUtil.getTextFromResourceBundle("sap.m", "FILTERPANEL_" + (bExclude ? "EXCLUDES" : "INCLUDES"));

			if (iCondition === undefined) {
				iCondition = 0;
			}

			return this.waitFor({
				controlType: "sap.m.Panel",
				searchOpenDialogs: true,
				matchers: function (oPanel) {
					// We try to match only the "Include/Exclude" part
					return oPanel.getHeaderText().substring(0, sLabel.length) === sLabel;
				},
				success: function (aPanels) {
					var oConditionPanel = aPanels[0].getContent()[0],
						aGrids = oConditionPanel.findAggregatedObjects(true, function (oControl) {
							return oControl.isA("sap.ui.layout.Grid");
						}),
						aInputs = aGrids[iCondition + 1].findAggregatedObjects(true, function (oControl) {
							// Heuristics find input fields
							return oControl.isA("sap.m.Input");
						});

						new EnterText({
							text: sText1
						}).executeOn(aInputs[0]);

						if (aInputs[1]) {
							new EnterText({
								text: sText2
							}).executeOn(aInputs[1]);
						}
				}
			});
		},

		iOpenTheP13nDialogAndNavigateToTheFilterTab: function () {
			this.iPressOnPersonalizationButton().and.iNavigateToPanel(TestUtil.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		},

		iChangeComboboxSelection: function(sOldValue, sNewValue, iComboBoxInstance){
			if (!iComboBoxInstance) {
				iComboBoxInstance = 0;
			}
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "value",
					value: sOldValue
				}),
				success: function(aComboBox){
					new EnterText({
						text: sNewValue
					}).executeOn(aComboBox[iComboBoxInstance]);
				}
			});
		},

		iChangeSelectSelection: function (iIndex, sNew) {
			return this.waitFor({
				controlType: "sap.m.Select",
				success: function (aSelect) {
					aSelect[iIndex].$().trigger("tap");

					return this.waitFor({
						controlType: "sap.m.SelectList",
						matchers: new Ancestor(aSelect[iIndex]),
						success: function (aList) {
							aList[0].getItems().forEach(function (oItem) {
								if (oItem.getText() == sNew) {
									oItem.$().trigger("tap");
								}
							});
						}
					});



				}
			});

		},

		iEnterTextInInput: function(sPlaceHolder, sText){
			return this.waitFor({
				controlType: "sap.m.Input",
				matchers: new PropertyStrictEquals({
					name: "placeholder",
					value: sPlaceHolder
				}),
				success: function(aInput){
					return new EnterText({
						text: sText
					}).executeOn(aInput[0]);
				}
			});
		},

		iEnterTextInDatePicker: function(sPlaceHolder, sText){
			return this.waitFor({
				controlType: "sap.m.DatePicker",
				matchers: new PropertyStrictEquals({
					name: "placeholder",
					value: sPlaceHolder
				}),
				actions: new EnterText({
					text: sText
				})
			});
		},

		iChangeFilterSelectionToDate: function(sDate) {
			return this.waitFor({
				controlType: "sap.m.DatePicker",
				success: function(aDatePickers) {
					var oDatePicker = aDatePickers[0];
					oDatePicker.setValue(sDate);
				}
			});
		},

		iChangeComboBoxWithChartTypeTo: function(sChartTypeText) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "placeholder",
					value: TestUtil.getTextFromResourceBundle("sap.m", "COLUMNSPANEL_CHARTTYPE")
				}),
				actions: new Press(),
				success: function(aComboBoxes) {
					Opa5.assert.equal(aComboBoxes.length, 1, "ChartType Combobox found");
					this.waitFor({
						controlType: "sap.m.StandardListItem",
						matchers: [
							new Ancestor(aComboBoxes[0]), new Properties({
								title: sChartTypeText
							})
						],
						actions: new Press(),
						success: function(aCoreItems) {
							Opa5.assert.equal(aCoreItems[0].getTitle(), sChartTypeText, "ChartType changed to '" + sChartTypeText + "'");
						},
						errorMessage: "Cannot select '" + sChartTypeText + "' from ChartType Combobox"
					});
				}
			});
		},

		// iChangeRoleOfColumnTo: function(sColumnName, sRole) {
		// this.waitFor({
		// controlType: "sap.m.ColumnListItem",
		// });
		// return this.waitFor({
		// controlType: "sap.m.Select",
		// matchers: new PropertyStrictEquals({
		// name: "text",
		// value: "Category"//TestUtil.getTextFromResourceBundle("sap.m", "COLUMNSPANEL_CHARTTYPE")
		// }),
		// actions: new EnterText({
		// text: sRole
		// })
		// // success: function(aSelects) {
		// // var aSelect = aSelects.filter(function(oSelect) {
		// // return oSelect.getParent().getCells()[0].getText() === sColumnName;
		// // });
		// // Opa5.assert.equal(aSelect.length, 1);
		// // aSelect[0].getFocusDomRef().value = sRole;
		// // // sap.ui.qunit.QUnitUtils.triggerEvent("input", oT);
		// // aSelect[0].$().trigger("tap");
		// // // oSelect.onSelectionChange();
		// // }
		// });
		// },

		iPressBackButton: function() {
			var oBackButton;
			return this.waitFor({
				controlType: "sap.m.Button",
				check: function(aButtons) {
					return aButtons.filter(function(oButton) {
						if (oButton.getType() !== "Back") {
							return false;
						}
						oBackButton = oButton;
						return true;
					});
				},
				success: function() {
					oBackButton.$().trigger("tap");
				}
			});
		},

		iSetDataSuiteFormat: function(sControlType, oDataSuiteFormat) {
			return this.waitFor({
				controlType: sControlType,
				success: function(aControls) {
					Opa5.assert.equal(aControls.length, 1, "'" + sControlType + "' has been found");
					aControls[0].setUiState(new UIState({
						presentationVariant: oDataSuiteFormat
					}));
				}
			});
		},

		iSelectVariant: function(sVariantName) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
				actions: function(oControl) {
						setTimeout(function(){
								(new Press()).executeOn(oControl);
						}, 500);
					},
				success: function(aSmartVariantManagements) {
					Opa5.assert.equal(aSmartVariantManagements.length, 1, "SmartVariantManagement found");
					// var aVariantItem = aSmartVariantManagements[0].getVariantItems().filter(function(oVariantItem) {
					// return oVariantItem.getText() === sVariantName;
					// });
					// Opa5.assert.equal(aVariantItem.length, 1, "Variant '" + sVariantName + "' found");
					this.waitFor({
						controlType: "sap.ui.comp.variants.VariantItem",
						matchers: [
							new Ancestor(aSmartVariantManagements[0]), new Properties({
								// key: aVariantItem[0].getKey()
								text: sVariantName
							})
						],
						actions: function(oControl) {
							setTimeout(function(){
									(new Press()).executeOn(oControl);
							}, 500);
						},
						errorMessage: "Cannot select '" + sVariantName + "' from VariantManagement"
					});
				},
				errorMessage: "Could not find SmartVariantManagement"
			});
		},

		iSaveVariantAs: function(sVariantNameOld, sVariantNameNew) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
				matchers: new PropertyStrictEquals({
					name: "defaultVariantKey",
					value: "*standard*"
				}),
				actions: new Press(),
				success: function(aSmartVariantManagements) {
					Opa5.assert.equal(aSmartVariantManagements.length, 1, "SmartVariantManagement found");
					this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "VARIANT_MANAGEMENT_SAVEAS")
						}),
						actions: new Press(),
						success: function(aButtons) {
							Opa5.assert.equal(aButtons.length, 1, "'Save As' button found");
							this.waitFor({
								controlType: "sap.m.Input",
								matchers: new PropertyStrictEquals({
									name: "value",
									value: sVariantNameOld
								}),
								actions: new EnterText({
									text: sVariantNameNew
								}),
								success: function(aInputs) {
									Opa5.assert.ok(aInputs[0].getValue() === sVariantNameNew, "Input value is set to '" + sVariantNameNew + "'");
									this.waitFor({
										controlType: "sap.m.Button",
										matchers: new PropertyStrictEquals({
											name: "text",
											value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "VARIANT_MANAGEMENT_SAVE")
										}),
										actions: new Press(),
										success: function(aButtons) {
											Opa5.assert.equal(aButtons.length, 1, "'OK' button found");
										}
									});
								}
							});
						},
						errorMessage: "Cannot find 'Save As' button on VariantManagement"
					});
				},
				errorMessage: "Could not find SmartVariantManagement"
			});
		},

		iExcludeColumnKeysOnControl: function(aColumnKeys, sControlType) {
			return this.waitFor({
				controlType: sControlType,
				success: function(aControls) {
					Opa5.assert.equal(aControls.length, 1);
					aControls[0].deactivateColumns(aColumnKeys);
				}
			});
		},

		iFreezeColumn: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.ui.table.Table",
				success: function(aTables) {
					Opa5.assert.equal(aTables.length, 1, "'sap.ui.table.Table' found");
					var aColumn = aTables[0].getColumns().filter(function(oColumn) {
						return oColumn.getLabel().getText() === sColumnName;
					});
					Opa5.assert.equal(aColumn.length, 1, "Column '" + sColumnName + "' found");
					Opa5.assert.equal(aColumn[0].getVisible(), true, "Column '" + sColumnName + "' is visible");
					var aVisibleColumns = aTables[0].getColumns().filter(function(oColumn) {
						return oColumn.getVisible() === true;
					});
					aTables[0].setFixedColumnCount(aVisibleColumns.indexOf(aColumn[0]) + 1);
					Opa5.assert.ok(aVisibleColumns.indexOf(aColumn[0]) > -1, true, "Column '" + sColumnName + "' is fixed on position " + (aVisibleColumns.indexOf(aColumn[0]) + 1));
				}
			});
		},

		iPressOnDrillUpButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://drill-up"
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'DrillUp' button found");
				},
				errorMessage: "DrillUp button could not be found"
			});
		},
		iPressOnDrillDownButton: function(sDimensionName) {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://drill-down"
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'DrillDown' button found");
					this.waitFor({
						controlType: "sap.m.StandardListItem",
						// Retrieve all list items in the table
						matchers: [
							function(oStandardListItem) {
								return oStandardListItem.getTitle() === sDimensionName;
							}
						],
						actions: new Press(),
						success: function(aStandardListItems) {
							Opa5.assert.equal(aStandardListItems.length, 1);
							Opa5.assert.equal(aStandardListItems[0].getTitle(), sDimensionName, "List item '" + sDimensionName + "' has been found");
						},
						errorMessage: "Dimension '" + sDimensionName + "' could not be found in the list"
					});
				},
				errorMessage: "DrillDown button could not be found"
			});
		},

		iPressOnIgnoreButton: function(){
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: "Ignore"
				}),
				actions: new Press()
			});
		},

		iPressOnMoveToBottomButton: function() {
			return this.waitFor({
				controlType: "sap.m.OverflowToolbarButton",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://expand-group"
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'Move to Botton' button found");
				},
				errorMessage: "'Move To Botton' button could not be found"
			});
		},
		iPressOnMoveToTopButton: function() {
			return this.waitFor({
				controlType: "sap.m.OverflowToolbarButton",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://collapse-group"
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'Move to Top' button found");
				},
				errorMessage: "'Move to Top' button could not be found"
			});
		},
		iClickOnLink: function(sText) {
			return this.waitFor({
				controlType: "sap.m.Link",
				check: function(aLinks) {
					return !!aLinks.length;
				},
				matchers: new PropertyStrictEquals({
					name: "text",
					value: sText
				}),
				actions: new Press(),
				success: function(aLinks) {
					Opa5.assert.equal(aLinks.length, 1, "One link found");
				}
			});
		},
		iPressOnControlWithText: function(sControlType, sText) {
			return this.waitFor({
				id: this.getContext()[sText],
				controlType: sControlType,
				actions: new Press(),
				errorMessage: "The given control was not pressable"
			});
		},
		iPressOnMoreLinksButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "POPOVER_DEFINE_LINKS")
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "The 'More Links' button found");
				}
			});
		},
		iPressOnStartRtaButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://wrench"
				}),
				actions: new Press()
			});
		},
		iWaitUntilTheBusyIndicatorIsGone: function(sId) {
			return this.waitFor({
				id: sId,
				check: function(oRootView) {
					return !!oRootView && oRootView.getBusy() === false;
				},
				success: function() {
					Opa5.assert.ok(true, "the App is not busy anymore");
				},
				errorMessage: "The app is still busy.."
			});
		},
		iRightClickOnLinkInElementOverlay: function(sText) {
			return this.waitFor({
				controlType: "sap.ui.dt.ElementOverlay",
				matchers: function(oElementOverlay) {
					return (oElementOverlay.getElementInstance().getMetadata().getElementName() === "sap.ui.comp.navpopover.SmartLink" && oElementOverlay.getElementInstance().getText() === sText) || (oElementOverlay.getElementInstance().getMetadata().getElementName() === "sap.m.ObjectIdentifier" && oElementOverlay.getElementInstance().getTitle() === sText);
				},
				success: function(aElementOverlays) {
					Opa5.assert.equal(aElementOverlays.length, 1, "One ElementOverlay corresponding to the link with text '" + sText + "' found.");
					aElementOverlays[0].$().triggerHandler('contextmenu');
				},
				errorMessage: "Did not find the ElementOverlay '" + sText + "'"
			});
		},
		iPressOnSettingsOfContextMenu: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtil.getTextFromResourceBundle("sap.ui.rta", "CTX_SETTINGS")
				}),
				actions: new Press(),
				errorMessage: "The Settings of context menu was not pressable"
			});
		},
		iPressOnRtaResetButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtil.getTextFromResourceBundle("sap.ui.rta", "BTN_RESTORE")
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'Reset' button found");
					this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: TestUtil.getTextFromResourceBundle("sap.ui.rta", "BTN_FREP_OK")
						}),
						actions: new Press(),
						success: function(aButtons) {
							Opa5.assert.equal(aButtons.length, 1, "'OK' button of the warning dialog found");
						}
					});
				}
			});
		},

		iPressOnRtaSaveButton: function(bWithReload) {
			var oResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: function(oButton) {
					return oButton.$().closest(".sapUiRtaToolbar").length > 0 && oButton.getProperty("text") === oResources.getText("BTN_EXIT");
				},
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'Save & Exit' button found");
					if (bWithReload) {
						this.waitFor({
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "text",
								value: TestUtil.getTextFromResourceBundle("sap.ui.rta", "BUTTON_RELOAD_NEEDED")
							}),
							actions: new Press(),
							success: function(aButtons) {
								Opa5.assert.equal(aButtons.length, 1, "'Reload' button of the info dialog found");
							}
						});
					}
				}
			});
		},

		iPressColumnHeader: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.ui.table.AnalyticalColumn",
				matchers: new PropertyStrictEquals({
					name: "tooltip",
					value: sColumnName
				}),
				actions: new Press(),
				success: function(aAnalyticalColumn) {
					Opa5.assert.equal(aAnalyticalColumn.length, 1, "analyticalColumn " + sColumnName + " found");
				},
				errorMessage: "Could not find AnalyticalColumn " + sColumnName
			});
		},

		iCollapseTheIncludePanel: function () {
			var sLabel = TestUtil.getTextFromResourceBundle("sap.m", "FILTERPANEL_INCLUDES");
			return this.waitFor({
				controlType: "sap.m.Panel",
				searchOpenDialogs: true,
				matchers: function (oPanel) {
					// We try to match only the "Include/Exclude" part
					return oPanel.getHeaderText().substring(0, sLabel.length) === sLabel;
				},
				success: function (aPanels) {
					aPanels[0].setExpanded(false);
				}
			});
		},

		iExpandTheExcludePanel: function () {
			var sLabel = TestUtil.getTextFromResourceBundle("sap.m", "FILTERPANEL_EXCLUDES");
			return this.waitFor({
				controlType: "sap.m.Panel",
				searchOpenDialogs: true,
				matchers: function (oPanel) {
					// We try to match only the "Include/Exclude" part
					return oPanel.getHeaderText().substring(0, sLabel.length) === sLabel;
				},
				success: function (aPanels) {
					aPanels[0].setExpanded(true);
				}
			});
		}

	});

	return Action;
}, true);
