/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/core/library",
	"sap/ui/core/format/DateFormat",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"./Util"

], function(
	Opa5,
	coreLibrary,
	DateFormat,
	PropertyStrictEquals,
	TestUtil
) {
	"use strict";

	/**
	 * The Assertion can be used to...
	 *
	 * @class Assertion
	 * @extends sap.ui.test.Opa5
	 * @author SAP
	 * @private
	 * @alias sap.ui.comp.qunit.personalization.test.Assertion
	 */
	var Assertion = Opa5.extend("sap.ui.comp.qunit.personalization.test.Assertion", {
		isTabSelected: function(oSegmentedButton, sTabName) {
			if (!oSegmentedButton || sTabName === "") {
				return false;
			}
			var sSelectedButtonID = oSegmentedButton.getSelectedButton();
			var oSelectedButton = TestUtil.getNavigationItem(oSegmentedButton, sTabName);
			return sSelectedButtonID === oSelectedButton.getId();
		},

		/**
		 * Returns NavigationItem
		 *
		 * @param {sap.m.SegmentedButton || sap.m.List} oNavigationControl
		 * @param {string} sPanelName
		 *
		 * @return {object}
		 */
		getNavigationItem: function(oNavigationControl, sPanelName) {
			if (!oNavigationControl || sPanelName === "") {
				return null;
			}
			var oNavigationItem = null;
			if (sap.ui.Device.system.phone) {
				oNavigationControl.getItems().some(function(oNavigationItem_) {
					if (oNavigationItem_.getTitle() === sPanelName) {
						oNavigationItem = oNavigationItem_;
						return true;
					}
				});
			} else {
				oNavigationControl.getButtons().some(function(oNavigationItem_) {
					if (oNavigationItem_.getText() === sPanelName) {
						oNavigationItem = oNavigationItem_;
						return true;
					}
				});
			}
			return oNavigationItem;
		},

		iShouldSeePersonalizationButton: function(sControlType) {
			sControlType = sControlType || "sap.m.OverflowToolbarButton";
			return this.waitFor({
				controlType: sControlType,
				viewName: "Main",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://action-settings"
				}),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "One button found");
					Opa5.assert.equal(aButtons[0].getIcon(), "sap-icon://action-settings", "The personalization button found");
				}
			});
		},

		thePersonalizationDialogOpens: function() {
			return this.waitFor({
				controlType: "sap.m.P13nDialog",
				check: function(aP13nDialogs) {
					return aP13nDialogs.length > 0;
				},
				success: function(aP13nDialogs) {
					// aP13nDialogs[0].setShowResetEnabled(true); // workaround because changing filter selection (Action.iChangeFilterSelectionToDate())
					// does not trigger enabling of "Restore" button
					Opa5.assert.ok(aP13nDialogs.length, 'Personalization Dialog should be open');
				}
			});
		},

		thePersonalizationDialogShouldBeClosed: function() {
			var aDomP13nDialogs;
			return this.waitFor({
				check: function() {
					var frameJQuery = Opa5.getWindow().jQuery;
					var fnDialog = frameJQuery.sap.getObject('sap.m.P13nDialog');
					aDomP13nDialogs = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnDialog);
					return !aDomP13nDialogs.length;
				},
				success: function() {
					Opa5.assert.ok(!aDomP13nDialogs.length, "The personalization dialog is closed");
				}
			});
		},

		iShouldSeeWarning: function() {
			this.waitFor({
				controlType: "sap.m.Dialog",
				matchers: new PropertyStrictEquals({
					name: "title",
					value: "Warning"
				}),
				success: function(aDialogs){
					Opa5.assert.equal(aDialogs.length,1,"warning found");
				}
			});
		},

		iShouldSeeNavigationControl: function() {
			if (sap.ui.Device.system.phone) {
				return this.waitFor({
					controlType: "sap.m.List",
					success: function(aLists) {
						Opa5.assert.ok(aLists.length === 1, "List should appear");
					},
					errorMessage: "sap.m.List not found"
				});
			}
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.SegmentedButton",
				success: function(aSegmentedButtons) {
					Opa5.assert.ok(aSegmentedButtons.length === 1, "Segmented Button should appear");
				},
				errorMessage: "sap.m.SegmentedButton not found"
			});
		},

		iShouldSeeFilterValueInCodeEditor: function(sId, sValue) {
			return this.waitFor({
				id: sId,
				success: function(oCE){
					if (oCE.getId() === sId) {
						var sCEValue = oCE.getValue().replace(/\n|\r/g, "").replace(/\s/g, '');
						sValue = JSON.stringify(sValue);
						Opa5.assert.equal(sCEValue, sValue, "The correct filter data has been created");
					}
				}
			});
		},

		iShouldSeeComboBoxItems: function(aItems) {
			return this.waitFor({
				controlType: "sap.m.List",
				success: function(aLists) {
					Opa5.assert.ok(aLists.length === 1, "list appears");
					aItems.forEach(function(sText){
						aLists[0].getItems().forEach(function(oListItem){
							if (sText === oListItem.getTitle()){
								Opa5.assert.equal(sText, oListItem.getTitle(), "Item " + sText + " found in ComboBox");
							}
						});
					});
				},
				errorMessage: "sap.m.List not found"
			});
		},

		iShouldSeeSelectListItems: function(aItems) {
					return this.waitFor({
						controlType: "sap.m.SelectList",
						success: function(aLists) {
							Opa5.assert.ok(aLists.length === 1, "list appears");
							aItems.forEach(function(sText){
								var oItemMatch;
								aLists[0].getItems().forEach(function(oListItem){
									if (sText === oListItem.getText()){
										oItemMatch = oListItem;
									}
								});
								Opa5.assert.equal(sText, oItemMatch.getText(), "Item " + sText + " found in ComboBox");
							});
						},
						errorMessage: "sap.m.Selectlist or Item in List not found!"
					});
		},

		iShouldSeeNavigationControlWithPanels: function(iNumberOfPanels) {
			if (sap.ui.Device.system.phone) {
				return this.waitFor({
					controlType: "sap.m.List",
					success: function(aLists) {
						Opa5.assert.ok(aLists[0].getItems().length === iNumberOfPanels, "List with " + iNumberOfPanels + " lines should appear");
					}
				});
			}
			return this.waitFor({
				controlType: "sap.m.SegmentedButton",
				success: function(aSegmentedButtons) {
					Opa5.assert.ok(aSegmentedButtons[0].getButtons().length === iNumberOfPanels, "Segmented Button with " + iNumberOfPanels + " tabs should appear");
				}
			});
		},

		iShouldSeePanelsInOrder: function(aOrderedPanelNames) {
			if (sap.ui.Device.system.phone) {
				return this.waitFor({
					controlType: "sap.m.List",
					success: function(aLists) {
						Opa5.assert.ok(aLists[0].getItems());
					}
				});
			}
			return this.waitFor({
				controlType: "sap.m.SegmentedButton",
				success: function(aSegmentedButtons) {
					aOrderedPanelNames.forEach(function(sPanelName, iIndex) {
						var sTabText = aSegmentedButtons[0].getButtons()[iIndex].getText();
						Opa5.assert.ok(sTabText === sPanelName, (iIndex + 1) + ". tab should be " + sPanelName);
					});
				}
			});
		},

		iShouldSeeSelectedTab: function(sPanelName) {
			// On desktop we can check if the tap is selected. On phone we do not have SegmentedButtons on the top of panel.
			if (sap.ui.Device.system.phone) {
				return;
			}
			return this.waitFor({
				controlType: "sap.m.SegmentedButton",
				success: function(aSegmentedButtons) {
					Opa5.assert.ok(this.isTabSelected(aSegmentedButtons[0], sPanelName), "The '" + sPanelName + "' tab is selected");
				}
			});
		},

		iShouldSeePanel: function(sPanelClass) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: sPanelClass,
				success: function(aPanels) {
					Opa5.assert.ok(aPanels[0].getVisible(), "The '" + sPanelClass + "' tab is visible");
				}
			});
		},

		iShouldSeeTheCheckboxSelectAllSwitchedOn: function(bIsSwitchedOn) {
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
					Opa5.assert.ok(oSelectAllCheckbox.getSelected() === bIsSwitchedOn);
				}
			});
		},

		iShouldSeeTableWithFixedColumnCount: function(iFixedColumnCount) {
			return this.waitFor({
				controlType: "sap.ui.table.Table",
				success: function(aTables) {
					Opa5.assert.equal(aTables.length, 1, "Only one table should be displayed");
					Opa5.assert.equal(aTables[0].getFixedColumnCount(), iFixedColumnCount, "Table has " + iFixedColumnCount + " fixed columns");
				}
			});
		},

		iShouldSeeColumnOfWidth: function(sColumnName, sWidth) {
			var oDomColumn;
			return this.waitFor({
				controlType: "sap.ui.table.Column",
				check: function() {
					var frameJQuery = Opa5.getWindow().jQuery;
					var fnDialog = frameJQuery.sap.getObject("sap.ui.table.Column");
					var aDomColumns = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnDialog);
					oDomColumn = aDomColumns[0];
					return oDomColumn && oDomColumn.getWidth() === sWidth;
				},
				success: function() {
					Opa5.assert.ok(oDomColumn, "Column '" + sColumnName + "' is visible");
					Opa5.assert.equal(oDomColumn.getWidth(), sWidth, "Column '" + sColumnName + "' has width of '" + sWidth + "'");
				}
			});
		},

		iShouldSeeVisibleColumnsInOrder: function(sColumnType, aOrderedColumnNames) {
			var aDomColumns;
			return this.waitFor({
				controlType: sColumnType,
				check: function() {
					var frameJQuery = Opa5.getWindow().jQuery;
					var fnDialog = frameJQuery.sap.getObject(sColumnType);
					aDomColumns = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnDialog);
					return aDomColumns.length === aOrderedColumnNames.length;
				},
				success: function() {
					Opa5.assert.equal(aOrderedColumnNames.length, aDomColumns.length);
					aDomColumns.forEach(function(oColumn, iIndex) {
						var sLabel = oColumn.getMetadata().getName() === "sap.m.Column" ? oColumn.getHeader().getText() : oColumn.getLabel().getText();
						Opa5.assert.equal(sLabel, aOrderedColumnNames[iIndex], "Column '" + aOrderedColumnNames[iIndex] + "' is visible on position " + (iIndex + 1));
					});
				}
			});
		},
		iShouldSeeVisibleDimensionsInOrder: function(aOrderedDimensionNames) {
			var aDomElements;
			return this.waitFor({
				controlType: "sap.chart.Chart",
				check: function() {
					var frameJQuery = Opa5.getWindow().jQuery;
					var fnControl = frameJQuery.sap.getObject("sap.chart.Chart");
					aDomElements = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnControl);
					return aDomElements[0].getVisibleDimensions().length === aOrderedDimensionNames.length;
				},
				success: function() {
					Opa5.assert.equal(aDomElements.length, 1, "One sap.chart.Chart control found");
					Opa5.assert.equal(aDomElements[0].getVisibleDimensions().length, aOrderedDimensionNames.length, "Chart contains " + aOrderedDimensionNames.length + " visible dimensions");
					aDomElements[0].getVisibleDimensions().forEach(function(sDimensionName, iIndex) {
						Opa5.assert.equal(sDimensionName, aOrderedDimensionNames[iIndex], "Dimension '" + sDimensionName + "' is visible on position " + (iIndex + 1));
					});
				}
			});
		},
		iShouldSeeVisibleMeasuresInOrder: function(aOrderedMeasureNames) {
			var aDomElements;
			return this.waitFor({
				controlType: "sap.chart.Chart",
				check: function() {
					var frameJQuery = Opa5.getWindow().jQuery;
					var fnControl = frameJQuery.sap.getObject("sap.chart.Chart");
					aDomElements = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnControl);
					return aDomElements[0].getVisibleMeasures().length === aOrderedMeasureNames.length;
				},
				success: function() {
					Opa5.assert.equal(aDomElements.length, 1, "One sap.chart.Chart control found");
					Opa5.assert.equal(aDomElements[0].getVisibleMeasures().length, aOrderedMeasureNames.length, "Chart contains " + aOrderedMeasureNames.length + " visible measures");
					aDomElements[0].getVisibleMeasures().forEach(function(sMeasureName, iIndex) {
						Opa5.assert.equal(sMeasureName, aOrderedMeasureNames[iIndex], "Measure '" + sMeasureName + "' is visible on position " + (iIndex + 1));
					});
				}
			});
		},
		iShouldSeeChartOfType: function(sChartTypeKey) {
			var aDomElements;
			return this.waitFor({
				controlType: "sap.chart.Chart",
				check: function() {
					var frameJQuery = Opa5.getWindow().jQuery;
					var fnControl = frameJQuery.sap.getObject("sap.chart.Chart");
					aDomElements = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnControl);
					return aDomElements[0].getChartType() === sChartTypeKey;
				},
				success: function() {
					Opa5.assert.equal(aDomElements.length, 1, "One sap.chart.Chart control found");
					Opa5.assert.equal(aDomElements[0].getChartType(), sChartTypeKey, "The chart type of the Chart is '" + sChartTypeKey + "'");
				}
			});
		},
		iShouldSeeComboBoxWithChartType: function(sChartTypeText) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "value",
					value: sChartTypeText
				}),
				success: function(aComboBoxes) {
					Opa5.assert.equal(aComboBoxes.length, 1, "One Combobox found");
					Opa5.assert.equal(aComboBoxes[0].getValue(), sChartTypeText, "The Combobox has value equal to chart type '" + sChartTypeText + "'");
				}
			});
		},
		iShouldSeeChartTypeButtonWithIcon: function(sIcon) {
			return this.waitFor({
				controlType: "sap.m.OverflowToolbarButton",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: sIcon
				}),
				success: function(aOverflowToolbarButtons) {
					Opa5.assert.equal(aOverflowToolbarButtons.length, 1, "One sap.m.OverflowToolbarButton control found");
					Opa5.assert.equal(aOverflowToolbarButtons[0].getIcon(), sIcon, "The chart type icon of the chart type button is '" + sIcon + "'");
				}
			});
		},
		theNumberOfSelectedDimeasuresShouldRemainStable: function() {
			return this.waitFor({
				controlType: "sap.chart.Chart",
				success: function(aCharts) {
					var oChart = aCharts[0];
					var aVisibleCols = [];
					oChart.getModel().getServiceAnnotations()["EPM_DEVELOPER_SCENARIO_SRV.Product"]["com.sap.vocabularies.UI.v1.Chart"]["Dimensions"].forEach(function(oItem) {
						aVisibleCols.push(oItem.PropertyPath);
					});
					oChart.getModel().getServiceAnnotations()["EPM_DEVELOPER_SCENARIO_SRV.Product"]["com.sap.vocabularies.UI.v1.Chart"]["Measures"].forEach(function(oItem) {
						aVisibleCols.push(oItem.PropertyPath);
					});
					Opa5.assert.ok((oChart.getVisibleDimensions().length + oChart.getVisibleMeasures().length) === aVisibleCols.length);
				}
			});
		},

		theTableShouldContainColumns: function(sTableType, iNumberColumns) {
			return this.waitFor({
				controlType: sTableType,
				check: function(aTables) {
					return aTables[0].getColumns().length === iNumberColumns;
				},
				success: function(aTables) {
					Opa5.assert.ok(aTables[0].getColumns().length === iNumberColumns, "Table contains " + iNumberColumns + " columns");
				}
			});
		},

		iShouldSeeItemWithSelection: function(sItemText, bSelected) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Table",
				success: function(aTables) {
					var aItems = aTables[0].getItems().filter(function(oItem) {
						return oItem.getCells()[0].getText() === sItemText;
					});
					Opa5.assert.equal(aItems.length, 1);
					Opa5.assert.ok(aItems[0]);
					Opa5.assert.equal(aItems[0].getVisible(), true);
					Opa5.assert.equal(aItems[0].getSelected(), bSelected, sItemText + " is " + (bSelected ? "selected" : "unselected"));
				}
			});
		},

		iShouldSeeLinkItemWithSelection: function(sItemText, bSelected) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Table",
				success: function(aTables) {
					var aItems = aTables[0].getItems().filter(function(oItem) {
						return oItem.getCells()[0].getItems()[0].getText() === sItemText;
					});
					Opa5.assert.equal(aItems.length, 1);
					Opa5.assert.ok(aItems[0].getCells()[0].getItems()[0].isA("sap.m.Link"), "Table item is of type sap.m.Link");
					Opa5.assert.ok(aItems[0].getCells()[0].getItems()[0], "sap.m.Link exists");
					Opa5.assert.equal(aItems[0].getCells()[0].getItems()[0].getVisible(), true, "sap.m.Link is visible");
					Opa5.assert.equal(aItems[0].getSelected(), bSelected, sItemText + " is " + (bSelected ? "selected" : "unselected"));
				}
			});
		},
		iShouldSeeLinkItemAsEnabled: function(sItemText, bEnabled) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Table",
				success: function(aTables) {
					var aItems = aTables[0].getItems().filter(function(oItem) {
						return oItem.getCells()[0].getItems()[0].getText() === sItemText;
					});
					Opa5.assert.equal(aItems.length, 1);
					Opa5.assert.ok(aItems[0].getCells()[0].getItems()[0].isA("sap.m.Link"), "Table item is of type sap.m.Link");
					Opa5.assert.ok(aItems[0].getCells()[0].getItems()[0], "sap.m.Link exists");
					Opa5.assert.equal(aItems[0].getCells()[0].getItems()[0].getVisible(), true, "sap.m.Link is visible");
					Opa5.assert.equal(aItems[0].getCells()[0].getItems()[0].getEnabled(), bEnabled, sItemText + " is " + (bEnabled ? "enable" : "disabled"));
				}
			});
		},

		iShouldSeeItemOnPosition: function(sItemText, iIndex) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Table",
				success: function(aTables) {
					var aItems = aTables[0].getItems().filter(function(oItem) {
						return oItem.getCells()[0].getText() === sItemText;
					});
					Opa5.assert.equal(aItems.length, 1);
					Opa5.assert.ok(aItems[0]);
					Opa5.assert.equal(aItems[0].getVisible(), true);
					Opa5.assert.equal(aTables[0].getItems().indexOf(aItems[0]), iIndex, sItemText + " is on position " + iIndex);
				}
			});
		},

		iShouldSeeLinkItemOnPosition: function(sItemText, iIndex) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Table",
				success: function(aTables) {
					var aItems = aTables[0].getItems().filter(function(oItem) {
						return oItem.getCells()[0].getItems()[0].getText() === sItemText;
					});
					Opa5.assert.equal(aItems.length, 1);
					Opa5.assert.ok(aItems[0].getCells()[0].getItems()[0].isA("sap.m.Link"), "Table item is of type sap.m.Link");
					Opa5.assert.ok(aItems[0].getCells()[0].getItems()[0], "sap.m.Link exists");
					Opa5.assert.equal(aItems[0].getCells()[0].getItems()[0].getVisible(), true, "sap.m.Link is visible");

					Opa5.assert.equal(aItems[0].getVisible(), true);
					Opa5.assert.equal(aTables[0].getItems().indexOf(aItems[0]), iIndex, sItemText + " is on position " + iIndex);
				}
			});
		},

		iShouldSeeMarkingOfItem: function(sItemText, bMarked) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Table",
				success: function(aTables) {
					var aItems = aTables[0].getItems().filter(function(oItem) {
						return oItem.getCells()[0].getText() === sItemText;
					});
					Opa5.assert.equal(aItems.length, 1);
					Opa5.assert.ok(aItems[0]);
					Opa5.assert.equal(aItems[0].getVisible(), true);
					var bIsMarked = aItems[0].$().hasClass("sapMP13nColumnsPanelItemSelected");
					Opa5.assert.equal(bIsMarked, bMarked, sItemText + " is " + (bIsMarked ? "" : "not ") + "marked");
				}
			});
		},

		iShouldSeeGroupSelectionWithColumnName: function(sColumnName) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var aComboBox = aComboBoxes.filter(function(oComboBox) {
						return oComboBox.getSelectedItem().getText() === sColumnName;
					});
					Opa5.assert.equal(aComboBox.length, 1, "Combobox with selected column '" + sColumnName + "' is found");
				}
			});
		},
		iShouldSeeGroupSelectionOnPosition: function(sColumnName, iIndex) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var aComboBox = aComboBoxes.filter(function(oComboBox) {
						return oComboBox.getSelectedItem().getText() === sColumnName;
					});
					Opa5.assert.equal(aComboBox.length, 1, "Combobox with selected column '" + sColumnName + "' is found");
					Opa5.assert.equal(aComboBoxes.indexOf(aComboBox[0]), iIndex, "Combobox with selected column '" + sColumnName + "' is on position " + iIndex);
				}
			});
		},
		iShouldSeeGroupSelectionWithCheckedShowFieldAsColumn: function(bChecked) {
			return this.waitFor({
				controlType: "sap.m.CheckBox",
				success: function(aCheckBoxes) {
					Opa5.assert.equal(aCheckBoxes.length, 1);
					Opa5.assert.equal(aCheckBoxes[0].getSelected(), bChecked, "The CheckBox is " + (bChecked ? "on" : "off"));
				}
			});
		},
		iShouldSeeGroupSelectionWithEnabledShowFieldAsColumn: function(bEnabled) {
			return this.waitFor({
				controlType: "sap.m.CheckBox",
				success: function(aCheckBoxes) {
					Opa5.assert.equal(aCheckBoxes.length, 1);
					Opa5.assert.equal(aCheckBoxes[0].getEnabled(), bEnabled, "The CheckBox is " + (bEnabled ? "enabled" : "disabled"));
				}
			});
		},

		theComboBoxShouldHaveWarningMessage: function() {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var oComboBox = aComboBoxes[0];
					Opa5.assert.ok(oComboBox.getValueState() === coreLibrary.MessageType.Warning);
					Opa5.assert.ok(oComboBox.getValueStateText() === TestUtil.getTextFromResourceBundle("sap.ui.comp", "PERSODIALOG_MSG_GROUPING_NOT_POSSIBLE_DESCRIPTION"));
				}
			});
		},
		theComboBoxShouldNotHaveWarningMessage: function() {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var oComboBox = aComboBoxes[0];
					Opa5.assert.ok(oComboBox.getValueState() === coreLibrary.MessageType.None);
					Opa5.assert.ok(oComboBox.getValueStateText() === "");
				}
			});
		},

		iCheckSelectValueState: function(iIndex, sValueState) {
			return this.waitFor({
				controlType: "sap.m.Select",
				success: function(aSelect) {
					var oSelect = aSelect[iIndex];
					Opa5.assert.ok(oSelect.getValueState() === sValueState);
				}
			});
		},

		theComboBoxShouldHaveItemWithText: function(sValue, sItemText) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "value",
					value: sValue
				}),
				success: function(aComboBoxes) {
					Opa5.assert.equal(aComboBoxes.length, 1, "Combobox with selected value '" + sValue + "' found");
					Opa5.assert.ok(aComboBoxes[0].getItemByText(sItemText), "Item with text '" + sItemText + "' found");
				}
			});
		},

		iShouldSeeSortSelectionWithColumnName: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var oComboBox = aComboBoxes[0];
					Opa5.assert.ok(oComboBox.getSelectedItem().getText() === sColumnName, "'" + sColumnName + "' is sorted");
				}
			});
		},

		iShouldSeeSortSelectionWithSortOrder: function(sSortOrder) {
			return this.waitFor({
				controlType: "sap.m.Select",
				success: function(aSelects) {
					var oSelect = aSelects[0];
					Opa5.assert.ok(oSelect.getSelectedItem().getText() === sSortOrder, sSortOrder + " is choosen");
				}
			});
		},

		iShouldSeeFilterSelectionWithColumnName: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var oComboBox = aComboBoxes[0];
					Opa5.assert.ok(oComboBox.getSelectedItem().getText() === sColumnName, "Column '" + sColumnName + "' found");
				}
			});
		},

		iShouldSeeFilterSelectionWithOperation: function(sOperation) {
			return this.waitFor({
				controlType: "sap.m.Select",
				success: function(aSelects) {
					var oSelect = aSelects[0];
					Opa5.assert.ok(oSelect.getSelectedItem().getText() === sOperation, "Operation '" + sOperation + "' found");
				}
			});
		},

		iShouldSeeFilterSelectionWithValueDate: function(sDate) {
			var bFound = false;
			return this.waitFor({
				controlType: "sap.m.DatePicker",
				check: function(aDatePickers) {
					return aDatePickers.filter(function(oDatePicker) {
						sDate = DateFormat.getDateInstance().format(new Date(sDate));
						if (oDatePicker.getValue() === sDate) {
							bFound = true;
							return true;
						}
						return false;
					});
				},
				success: function() {
					Opa5.assert.ok(bFound);
				}
			});
		},

		iShouldSeeFilterSelectionWithValueInput: function(sText) {
			return this.waitFor({
				controlType: "sap.m.Input",
				success: function(aInputs) {
					var oInput = aInputs[0];
					Opa5.assert.ok(oInput.getValue() === sText);
				}
			});
		},

		theNumberOfFilterableColumnKeysShouldRemainStable: function() {
			var oTable = null;
			this.waitFor({
				controlType: "sap.ui.table.Table",
				success: function(aTables) {
					oTable = aTables[0];
				}
			});
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var oComboBox = aComboBoxes[0];
					var oResult = oTable.getModel().getAnalyticalExtensions().findQueryResultByName("ProductCollection");
					var aFilterableColumns = oResult._oEntityType.getFilterablePropertyNames();
					Opa5.assert.ok(oComboBox.getKeys().length === aFilterableColumns.length);
				}
			});
		},

		theNumberOfSortableColumnKeysShouldRemainStable: function() {
			var oTable = null;
			this.waitFor({
				controlType: "sap.ui.table.Table",
				success: function(aTables) {
					oTable = aTables[0];
				}
			});
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				success: function(aComboBoxes) {
					var oComboBox = aComboBoxes[0];
					var oResult = oTable.getModel().getAnalyticalExtensions().findQueryResultByName("ProductCollection");
					var aSortableColumns = oResult._oEntityType.getSortablePropertyNames();
					Opa5.assert.ok(oComboBox.getKeys().length - 1 === aSortableColumns.length); // (none) excluded
				}
			});
		},

		iShouldSeeRestoreButtonWhichIsEnabled: function(bEnabled) {
			return this.waitFor({
				searchOpenDialogs: true,
				visible: bEnabled,
				controlType: "sap.m.Button",
				success: function(aButtons) {
					var aRestoreButtons = aButtons.filter(function(oButton) {
						return oButton.getText() === TestUtil.getTextFromResourceBundle("sap.m", "P13NDIALOG_RESET");
					});
					Opa5.assert.equal(aRestoreButtons.length, 1);
					Opa5.assert.ok(aRestoreButtons[0].getEnabled() === bEnabled, "The 'Restore' is " + (bEnabled ? "enabled" : "disabled"));
				}
			});
		},

		iShouldSeeSelectedVariant: function(sVariantName) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
				matchers: new PropertyStrictEquals({
					name: "defaultVariantKey",
					value: "*standard*"
				}),
				success: function(aSmartVariantManagements) {
					Opa5.assert.equal(aSmartVariantManagements.length, 1, "SmartVariantManagement found");
					var aVariantItem = aSmartVariantManagements[0].getVariantItems().filter(function(oVariantItem) {
						return oVariantItem.getText() === sVariantName;
					});
					Opa5.assert.equal(aVariantItem.length, 1, "Variant '" + sVariantName + "' found");
				},
				errorMessage: "Could not find SmartVariantManagement"
			});
		},

		theTableHasFreezeColumn: function(sColumnName) {
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
					Opa5.assert.equal(aTables[0].getFixedColumnCount(), aVisibleColumns.indexOf(aColumn[0]) + 1, "Column '" + sColumnName + "' is fixed on position " + (aVisibleColumns.indexOf(aColumn[0]) + 1));
				}
			});
		},
		iShouldSeeColumnOfSmartLinks: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.m.Table",
				success: function(aTables) {
					var aColumn = aTables[0].getColumns().filter(function(oColumn) {
						return oColumn.getHeader().getText() === sColumnName;
					});
					Opa5.assert.equal(aColumn.length, 1, "Column '" + sColumnName + "' is visible");
				}
			});
		},
		iShouldSeeNavigationPopoverOpens: function() {
			return this.waitFor({
				controlType: "sap.ui.comp.navpopover.NavigationPopover",
				check: function(aNavigationPopovers) {
					return aNavigationPopovers.length === 1;
				},
				success: function(aNavigationPopovers) {
					Opa5.assert.ok(aNavigationPopovers.length, 'NavigationPopover should be open');
				}
			});
		},
		iShouldSeeOnNavigationPopoverPersonalizationLinkText: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "POPOVER_DEFINE_LINKS")
				}),
				success: function(aButton) {
					Opa5.assert.equal(aButton.length, 1, "The 'More Links' button found");
				}
			});
		},
		iShouldNotSeeOnNavigationPopoverPersonalizationLinkText: function(sText) {
			return this.waitFor({
				controlType: "sap.m.Button",
				check: function(aButtons) {
					return aButtons.filter(function(oButton) {
						return oButton.getText() === sText;
					}).length === 0;
				},
				success: function(aButton) {
					Opa5.assert.equal(aButton.length, 1, "Button with text '" + sText + "' found.");
				}
			});
		},
		iShouldSeeOrderedLinksOnNavigationContainer: function(aTexts) {
			return this.waitFor({
				controlType: "sap.ui.comp.navpopover.NavigationContainer",
				success: function(aNavigationContainers) {
					var aVisibleAvailableActions = aNavigationContainers[0].getAvailableActions().filter(function(oAvailableAction) {
						return !!oAvailableAction.getVisible() && !!oAvailableAction.getHref();
					});
					Opa5.assert.equal(aVisibleAvailableActions.length, aTexts.length, aVisibleAvailableActions.length + " links are visible");
					aVisibleAvailableActions.forEach(function(oAction, iIndex) {
						Opa5.assert.equal(oAction.getText(), aTexts[iIndex]);
					});
				}
			});
		},
		contactInformationExists: function() {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.ui.comp.navpopover.NavigationContainer",
				success: function(aNavigationContainers) {
					Opa5.assert.equal(aNavigationContainers.length, 1, "1 NavigationContainer found");
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.ui.layout.form.SimpleForm",
						success: function(aSimpleForm) {
							Opa5.assert.equal(aSimpleForm.length, 1, "1 SimpleForm found");
						}
					});
				}
			});
		},
		iShouldSeeStartRtaButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				check: function(aButtons) {
					return aButtons.some(function(oButton) {
						return oButton.getIcon() === "sap-icon://wrench";
					});
				},
				// matchers: new PropertyStrictEquals({
				// 	name: "icon",
				// 	value: "sap-icon://wrench"
				// }),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "One button found");
					Opa5.assert.equal(aButtons[0].getIcon(), "sap-icon://wrench", "The Start Key User Adaptation button found");
				}
			});
		},
		iShouldSeeTheRtaToolbar: function() {
			return this.waitFor({
				controlType: "sap.m.HBox",
				matchers: function(oToolbar) {
					return oToolbar.$().hasClass("sapUiRtaToolbar");
				},
				success: function(oToolbar) {
					Opa5.assert.ok(oToolbar[0].getVisible(), "The Toolbar is shown.");
				},
				errorMessage: "Did not find the Toolbar"
			});
		},
		rtaShouldBeClosed: function(sRootControlId) {
			return this.waitFor({
				id: sRootControlId,
				check: function(oView) {
					return !oView.$().hasClass("sapUiRtaRoot");
				},
				success: function() {
					Opa5.assert.ok(true, "Key User Adaptation mode is closed");
				}
			});
		},
		theRtaModeShouldBeClosed: function() {
			return this.waitFor({
				controlType: "sap.ui.dt.ElementOverlay",
				visible: false,
				success: function() {
					Opa5.assert.ok(true, "Key User Adaptation mode is closed");
				}
			});
		},
		iShouldSeeTheRtaOverlayForTheViewId: function(sId) {
			var oApp;
			this.waitFor({
				id: sId,
				errorMessage: "The app is still busy..",
				success: function(oAppControl) {
					oApp = oAppControl;
				}
			});
			return this.waitFor({
				controlType: "sap.ui.dt.ElementOverlay",
				matchers: function(oOverlay) {
					return oOverlay.getElementInstance() === oApp;
				},
				success: function(oOverlay) {
					Opa5.assert.ok(oOverlay[0].getVisible(), "The Overlay is shown.");
				},
				errorMessage: "Did not find the Element Overlay for the App Control"
			});
		},
		theContextMenuOpens: function(sEntryText) {
			return this.waitFor({
				controlType: "sap.m.Popover",
				matchers: function(oPopover) {
					return oPopover.$().hasClass("sapUiDtContextMenu");
				},
				success: function(oPopover) {
					Opa5.assert.ok(oPopover[0].getVisible(), "The context menu is shown.");
				},
				errorMessage: "Did not find the Context Menu"
			});
		},
		theApplicationIsLoaded: function(sId) {
			var aDomApp;
			return this.waitFor({
				check: function() {
					var frameJQuery = Opa5.getWindow().jQuery;
					var fnApp = frameJQuery.sap.getObject('sap.m.App');
					aDomApp = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnApp);
					return !!aDomApp.length;
				},
				success: function() {
					Opa5.assert.equal(aDomApp.length, 1, "One app is loaded");
					Opa5.assert.equal(aDomApp[0].getId(), sId, "App '" + sId + "' is loaded");
				}
			});
		},
		theColumnMenuOpens: function() {
			return this.waitFor({
				controlType: "sap.ui.table.ColumnMenu",
				matchers: function(oPopup) {
					return oPopup.$().hasClass("sapUiTableColumnMenu");
				},
				success: function(oPopup) {
					Opa5.assert.ok(oPopup[0].getVisible(), "The column menu is shown.");
				},
				errorMessage: "Did not find the column Menu"
			});
		},
		iShouldSeeNoEmptyOperation: function (bExclude, iCondition) {
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
						oSelect = oConditionPanel.findAggregatedObjects(true, function (oControl) {
							// Heuristics: the first sap.m.Select control in the condition panel is the operations select
							return oControl.isA("sap.m.Select");
						})[0];

					Opa5.assert.ok(!oSelect.getItems().some(function (oItem) {
						return oItem.getKey() === "Empty";
					}), "There should be no empty operation");
				}
			});
		},
		iShouldSeeConditionOperations: function (aOperations, iCondition) {
			iCondition = iCondition ? iCondition : 0;
			return this.waitFor({
				controlType: "sap.m.Select",
				success: function(aSelects) {
					var aAvailable = aSelects[iCondition].getItems().map(function (oItem) {
							return oItem.getText();
						});

					Opa5.assert.strictEqual(
						aOperations.join(","),
						aAvailable.join(","),
						"Operations list should match"
					);
				},
				errorMessage: "sap.m.Selectlist or Item in List not found!"
			});
		}

	});
	return Assertion;
}, true);
