/*global QUnit */
sap.ui.define([
               "sap/ui/test/Opa5",
               "sap/suite/ui/generic/template/integration/AnalyticalListPage/pages/Common",
               "sap/ui/test/matchers/AggregationLengthEquals",
               "sap/ui/test/matchers/AggregationFilled",
               "sap/ui/test/matchers/Properties",
               "sap/ui/test/matchers/PropertyStrictEquals",
			   "sap/suite/ui/generic/template/integration/AnalyticalListPage/utils/OpaResourceBundle",
			   "sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
			   "sap/ui/test/actions/Press"
               ], function(Opa5, Common, AggregationLengthEquals, AggregationFilled, Properties, PropertyStrictEquals, OpaResourceBundle, ApplicationSettings, Press) {
               	"use strict";
               	var oi18n = OpaResourceBundle.template["AnalyticalListPage"].getResourceBundle();
               	Opa5.createPageObjects({
               		onTheVisualFilterDialog: {
               			baseClass: Common,
               			actions: {
				//Click Segmented buttons in VFD
				iClickTheSegmentedButton: function(btnKey) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.SegmentedButton",
						success: function(segBtns) {
							segBtns.forEach(function(segBtn) {
								var btns = segBtn.getItems();
								for (var i = 0; i < btns.length; i++) {
									var btn = btns[i];
									if (btn.getKey() === btnKey) {
										var selectedKey = segBtn.getSelectedKey();
										//if filter mode is already in the required mode,
										//dont fire the select event
										if (selectedKey != btnKey) {
											btn.$().trigger("click");
											segBtn.setSelectedKey(btnKey);
											segBtn.setSelectedButton(btn);
											segBtn.fireSelect({
												button: btn,
												id: btn.getId(),
												key: btn.getKey()
											});
										}
										QUnit.ok(true, "Segmented button clicked - " + btnKey);
										return true;
									}
								}
							});
							return false;
						},
						errorMessage: "The segmented button cannot be clicked"
					});
				},
				//click on any dialog button
				iClickDialogButton: function(value, checkId, appId, entitySet) {
					var btn = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function (aButtons) {
							return aButtons.filter(function (oButton) {
								entitySet = entitySet ? entitySet : "ZCOSTCENTERCOSTSQUERY0020";
								if(oButton.getId() === appId + "::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::" + entitySet + "--template::" + checkId) {
									btn = oButton;
									return true;
								}
								return false;
							});
						},
						success: function() {
							btn.firePress();
						},
						errorMessage: "The page has no " + value + " button."
					});
				},
				iCheckForValuehelp: function (filterName) {
					var okButton;
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs : true,
						check : function (aButtons) {
							var bFlag = false;
							aButtons.forEach(function (oButton) {
								if (oButton.getIcon() === "sap-icon://value-help" || oButton.getIcon() === "sap-icon://slim-arrow-down") {
									if (oButton.getParent().getParent().getItems()[2].getItems()[0].getParentProperty().indexOf(filterName) !== -1) {
										okButton = oButton;
										bFlag = true;
									}
								}
							});
							return bFlag;
						},
						success: function() {
							okButton.firePress();
							QUnit.ok(true,"Value help button is supported and Clicked");
						},
						errorMessage: "Value help button is not supported"
					});
				},
				//to add values in CF dialog
				//to add values in CF dialog
				iAddFilterValueInCompactDialog: function(fieldName, value) {
				//	var filterBar = null;
					return this.waitFor({
						controlType: "sap.m.Input",
						searchOpenDialogs:true,
						check: function (aInputItems) {
							if (aInputItems) {
								var bSuccess = false;
								aInputItems.forEach(function (oInputItem) {
									var property = oInputItem.getLabels()[0]
									if (property.getText() === fieldName) {
										var input = oInputItem.getParent();
										var inputValue = input.getFields()[0];
										inputValue.setValue(value);
										oInputItem.fireChange();
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function(filterBars) {
							//filterBar.fireFilterChange();
							QUnit.ok(true, "filter applied");
						},
						errorMessage: "The filter cannot be applied"
					});
				},


				iRemoveFilterValueInCompactDialog: function(cfItemNum) {
				//	var filterBar = null;
					return this.waitFor({
						controlType: "sap.ui.core.Icon",
						searchOpenDialogs:true,
						success: function(oButton1) {
								oButton1[cfItemNum].firePress();
								QUnit.ok(true,"OK button was clicked")
						},
						errorMessage: "The page has no OK button."

						
					});
				},


				//make selections on line chart
				//specific to line chart as microchart control is not available
				//scope for common function in future to support all
				iSelectLineChart: function(pointIndex) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.InteractiveLineChart",
						success: function (aCharts) {
							var oChart = aCharts[0];
							var points = oChart.getPoints();
								if(points && points.length) {
									var point = points[pointIndex];
									point.setSelected(true);
									//check requirement of condition
									oChart.fireSelectionChanged({
										selectedPoints: oChart.getSelectedPoints(),
										point: point,
										selected: point.getSelected()
									});
									QUnit.ok(true, "Selection made");
								}
							},
						errorMessage: "The chart selection cannot be applied"
					});
				},
				//make selections on Bar chart
				iSelectBarChart: function(barIndex, bSelect) {
 					return this.waitFor({
 						searchOpenDialogs: true,
 						controlType: "sap.suite.ui.microchart.InteractiveBarChart",
						success: function (aCharts) {
							var oChart = aCharts[0];
							var bars = oChart.getBars();
 								if(bars && bars.length) {
									var bar = bars[barIndex];
 									bar.setSelected(bSelect);
									//check requirement of condition
									oChart.fireSelectionChanged({
										selectedBars: oChart.getSelectedBars(),
										bar: bar,
										selected: bar.getSelected()
									});
									QUnit.ok(true, "Selection made");
 								}
							},
 						errorMessage: "The chart selection cannot be applied"
 					});
 				},
 				iClickSelectedButtonDeleteIcon: function(index) {
 					return this.waitFor({
 						searchOpenDialogs: true,
						controlType: "sap.m.Token",
						success: function(aTokens) {
							for (var i in aTokens) {
 								if (i == index) {
									aTokens[index].getAggregation("deleteIcon").firePress();
 									QUnit.ok(true, "Selected button cancel Clicked");
 									return true;
 								}
 							}
 						},
 						errorMessage: "Selected button cancel not Clicked"
 					});
 				},
				iClickSelectedButtonRemove: function() {
					var removeButton;
 					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						check : function (aButtons) {
							var bFlag = false;
							aButtons.forEach(function (oButton) {
								if (oButton.getIcon() === "sap-icon://sys-cancel") {
									removeButton = oButton;
									bFlag = true;
								}
							});
							return bFlag;
						},
						success: function() {
							removeButton.firePress();
							QUnit.ok(true,"Selected button remove Clicked");
 						},
						errorMessage: "Selected button remove not Clicked"
 					});
 				},
				//click chart property buttons, ie, sort,type and measure
				iClickChartButton: function(btnName) {
					var chartButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						check : function (aButtons) {
							return aButtons.filter(function (oButton) {
								if(oButton._getTooltip() === btnName) {
									chartButton = oButton;
									return true;
								}
								return false;
							});
						},
						success: function() {
							chartButton.$().trigger("click");
							chartButton.firePress();
						},
						errorMessage: "button not clicked"
					});
				},

				/*This function allows you to click the chart toolbar button corresponding to the visual filter chart
				@param btnName is the name of the button that needs to be clicked. 
				@param vfItem denotes the chart that needs to be clicked.*/
				iClickToolbarButton: function(btnName,vfItem) {
					var chartButton = null
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: btnName
						}),
						check: function (aButtons) {
								
								chartButton = aButtons[vfItem];
								// aButtons.forEach(function (oButton) {
								// 	console.log(aButtons[vfItem].getTooltip());
								// });
								 return true;
							
							
						},
						success: function() {
							chartButton.$().trigger("click");
							chartButton.firePress();
						},
						errorMessage: "Chart property could not be changed"
					});
				},

				//checking if
				icheckChartButtonAnuj: function(btnName) {
					var chartButton = false;
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						check : function (aButtons) {
							for(var i = 0; i < aButtons.length; i++) {
								if(aButtons[i].getText() === btnName) {
									chartButton = true;
									return chartButton;
								}
							}
							return chartButton;
						},
						success: function() {
							QUnit.ok(true, "Button is present");
						},
						errorMessage: "button not present."
					});
				},
				//change sort, chart type or measure by passing position of the required change in the popup
				iChangeChartProperty: function(idx) {
					var chartProperty = null, popup = null, bSuccess = false;
					return this.waitFor({
						controlType: "sap.m.List",
						searchOpenDialogs: true,
						autoWait: true,
						check: function (aDialogs) {
							if (aDialogs) {
								aDialogs.forEach(function (oDialog) {
									var prop = oDialog.getItems();
									if (prop && prop.length && prop[idx]) {
										prop = prop[idx];
										prop.setSelected(true);
										popup = oDialog;
										chartProperty = prop;
										if (prop) {
											popup.fireSelectionChange({
												listItem: chartProperty,
												listItems: popup.getItems(),
												selected: chartProperty.getSelected()
											});
											bSuccess = true;
										}
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							QUnit.ok(true, "chart property has been changed");
						},
						errorMessage: "Chart property could not be changed"
					});
				},
				iEnterVariantName: function(variantName) {
					var variant = null;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Input",
						check : function (aInputs) {
							return aInputs.filter(function (oInput) {
								if(oInput.getId() === "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::PageVariant-name") {
									variant = oInput;
									return true;
								}
								return false;
							});
						},
						success: function() {
							variant.setValue(variantName);
							QUnit.ok(true, "Variant Saved with name " + variantName);
						},
						errorMessage: "Variant cannot be saved"
					});
				},
				iCheckMoreFiltersLink: function(linkName) {
					var link = null;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Link",
						check : function (oLink) {
							if (oLink) {
								var bSuccess = false;
								oLink.forEach(function (aLink) {
									if(aLink.getText() === linkName) {
										link = aLink;
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							link.firePress();
							QUnit.ok(true, "Clicked the More Filters Link");
						},
						errorMessage: "There is no More Filters Link/Link can't be clicked"
					});
				},
				iCheckSelectFitlerCheckbox: function(listName, bVisible, bIsCompact) {
					var list = null, listItem = null, index = null;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.List",
						check : function (oList) {
							if (oList) {
								var bSuccess = false;
								oList.forEach(function (aList) {
									if (aList.getParent().getParent().getId().indexOf("adapt-filters-dialog") > -1) {
										return;
									}
									var aListItems = aList.getItems();
									if (bIsCompact) {
										for (var i = 0; i < aListItems.length; i++) {
											if(aListItems[i].getContent()[0].getText() === listName.trim()) {
												index = i;
												bSuccess = true
											}
										}
									} else {
										for (var i = 0; i < aListItems.length; i++) {
											if(aListItems[i].getTitle() === listName.trim()) {
												index = i
												bSuccess = true
											}
										}
									}
									if (bSuccess) {
										if (aListItems[index].getSelected()!==bVisible) {
											new Press().executeOn(aListItems[index].getMultiSelectControl());
                                        }
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							QUnit.ok(true, "Selected/deselected the Filter Item Chart ");
						},
						errorMessage: "The filter Item chart can't be selected/deselected"
					});
				},
				iClickOk: function(btnName, diaName) {
					var btn = null;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						check : function (aButtons) {
							if (aButtons) {
								var bSuccess = false;
								aButtons.forEach(function (oButton) {
									var oDialog = oButton.getParent();
									if(oButton.getText() === btnName && oDialog.getTitle() === diaName) {
										btn = oButton;
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							btn.firePress();
							QUnit.ok(true,"Clicked OK");
						},
						errorMessage: "Not able to click OK"
					});
				},
				iSetShowOnFilterBarCheckBoxState: function(state,idx) {
					var oCheckBox;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.CheckBox",
						check: function (aCheckBox) {
							if(aCheckBox[idx]) {
								aCheckBox[idx].setSelected(state);
								oCheckBox = aCheckBox[idx];
								return true;
							}
							return false;
						},
						success: function() {
							oCheckBox.fireSelect({
								selected: state
							});
							QUnit.ok(true, "state changed");
						},
						errorMessage: "state not changed"
					});
				},
				iClickSelectedButton: function(num) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "(" + num + ")"
						}),
						success: function(oButton) {
							oButton[0].firePress();
						},
						errorMessage: "The page has no (" + num + ")" + "Button"
					});
				},
				iClickSelectedDelete: function(index, updatedCount) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.List",
						check: function(aLists) {
							var bSuccess = false;
							var deletedItem = aLists[0].getItems()[index];
							aLists[0].removeItem(index);
							if (!aLists[0].getItems()[index]) {
								bSuccess = true;
								aLists[0].fireDelete({
									listItem: deletedItem
								})
							}
							return bSuccess
						},
						success: function() {
							QUnit.ok(true, "list item deleted");
						},
						errorMessage: "Selected button Delete not Clicked"
					});
				},
				iClickSelectedButtonClearAll: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Clear All"
						}),
						success: function(oButton) {
							oButton[0].firePress();
						},
						errorMessage: "The page has no Selected Link Clear All Button"
					});
				}
			},
			assertions: {
				iCheckVisualFilterDialogInvisibleText: function(sId, sMandatoryProperty) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.CustomListItem",
						check: function (aCustomlistItem) {
							return aCustomlistItem.some(function(oCustomListItem) {
								var aItems = oCustomListItem.getContent()[0].getItems()[0].getItems();
								var sMsg = oi18n.getText("VIS_FILTER_ITEM_ARIA");
								if (sMandatoryProperty) {
									sMsg += " " + oi18n.getText("VIS_FILTER_MANDATORY_PROPERTY_ARIA", sMandatoryProperty);
								}
								sMsg += " " + oi18n.getText("VIS_FILTER_DIALOG_NAVIGATE_ARIA") + " " + oi18n.getText("VIS_FILTER_ACCESS_FIELDS_ARIA");
								return (aItems[3].isA("sap.ui.core.InvisibleText") && aItems[3].getId() === sId && aItems[3].getText() === sMsg);
							});
						},
						success: function() {
							QUnit.ok(true, "InvisibleText with id " + sId + " is present for the visual filter on the dialog.");
						},
						errorMessage: "InvisibleText is missing for the visual filter on the dialog."
					});
				},
				//to check any dialog's title
				iCheckDialogTitle: function(sTitle, sDialogType) {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						check : function (aDialogs) {
							return aDialogs.filter(function (oDialog) {
								if(oDialog.getTitle() === sTitle) {
									return true;
								}
								return false;
							});
						},
						success: function() {
							QUnit.ok(true, sDialogType + " found in FilterDialog");
						},
						errorMessage: sDialogType + " not Found in FilterDialog"
					});
				},
				iCheckInputForErrorState: function(fieldName) {
				//	var filterBar = null;
					return this.waitFor({
						controlType: "sap.m.Input",
						autoWait: false,
						searchOpenDialogs:true,
						check: function (aInputItems) {
							var iErrorCount = 0;
							if (aInputItems) {
								for (var i = 0; i < aInputItems.length; i++) {
									if (aInputItems[i].getValueState() === 'Error') {
										iErrorCount++;
									}
								}
							}
							if (iErrorCount > 0) {
								return false;
							} else {
								return true;
							}
						},
						success: function(filterBars) {
							//filterBar.fireFilterChange();
							QUnit.ok(true, "None of the fields are in error state in the filter dialog");
						},
						errorMessage: "One of the fields are in error state"
					});
				},
				//check presence of segmented buttons in dialog
				iShouldSeeSegmentedButton: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.SegmentedButton",
						check : function (aSegmentedButtons) {
							return aSegmentedButtons.filter(function (oSegmentedButton) {
								if(oSegmentedButton[0].mAggregations.buttons[0].mAggregations.tooltip === "Compact Filter" && oSegmentedButton[0].mAggregations.buttons[1].mAggregations.tooltip === "Visual Filter") {
									return true;
								}
								return false;
							});
						},
						success: function(oSegmentedButton) {
							QUnit.ok(true,"The dialog has segmented buttons");
						},
						errorMessage: "Did not find any Segmented Button in the open dialog"
					});
				},
				iCompactReflectVisibility: function(fieldName, bVisible, bIsDropDown/*Optional*/) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: bIsDropDown ? "sap.m.MultiComboBox" : "sap.m.Input",
						check : function (oInput) {
							if (oInput) {
								var bSuccess = !bVisible;
								oInput.forEach(function (aInput) {
									var oInputItem = aInput.getLabels();
									for (var i = 0; i < oInputItem.length; i++) {
										if (oInputItem[i].getText() === fieldName) {
											bSuccess = bVisible;
										}
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function(filterBars) {
							QUnit.ok(true, "Filter Visibility changed in Compact filter dialog");
						},
						errorMessage: "Visibility sync not applied between cfd-vfd"
					});
				},
				iVisualReflectVisibility: function(fieldName, bVisible) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.InteractiveBarChart",
						check : function (charts) {
							if (charts) {
								var bSuccess = !bVisible;
								charts.forEach(function (aCharts) {
									var chartItem = aCharts.getParent();
									if (chartItem.getParentProperty() === fieldName) {
										bSuccess = bVisible;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							QUnit.ok(true, "Filter Visibility changed in Visual filter dialog");
						},
						errorMessage: "Visibility sync not applied between cfd-vfd"
					});
				},
				//on adding a filter in CFD, check selected value in VFD
				iCheckSelectedFilter: function(value) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.InteractiveBarChart",
						check : function (aCharts) {
							if (aCharts) {
								var bSuccess = false;
								aCharts.forEach(function (oCharts) {
									var selectedSegments = oCharts.getSelectedBars();
									for (var i = 0; i < selectedSegments.length; i++) {
										if(selectedSegments[i].getCustomData()[0].getValue() === value) {
											bSuccess = true;
										}
									}
								});
								return bSuccess;
							}
							return false
						},
						success: function() {
							QUnit.ok(true, "Sync correct");
						},
						errorMessage: "Incorrect value synced"
					});
				},
				iCheckChartScale: function(iShortRefNumber, sScale) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.InteractiveBarChart",
						check : function (aCharts) {
							if (aCharts) {
								var bSuccess = false;
								for (var i = 0; i < aCharts.length ; i++) {
									var chartItem = aCharts[i].getParent();
									if (chartItem._shortRefNumber === iShortRefNumber && chartItem._scaleValue === sScale) {
										bSuccess = true;
										break;
									}
								}
							}
							return bSuccess;
						},
						success: function() {
								QUnit.ok(true, "Scale Applied Succuessfully");
						},
						errorMessage: "Wrong Scale Found"
					});
				},
				//verify change in chart measure
				//verify change in chart measure
				/*Use iCheckChartMeasureWithChartType instead of this function */
				iCheckChartMeasure: function(sMeasure) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.InteractiveBarChart",
						check : function (aCharts) {
							if (aCharts) {
								var bSuccess = false;
								aCharts.forEach(function (oCharts) {
									var chartItem = oCharts.getParent();
									
									if (chartItem.getMeasureField() === sMeasure) {
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
								QUnit.ok(true, "Measure has been changed successfully");
							},
						errorMessage: "Change in measure could not be applied"
					});
				},

				iCheckChartMeasureWithChartType: function(sMeasure,sChartType) {
					if (sChartType.toLowerCase() === "bar") {
						sChartType = "Bar";
					} else if (sChartType.toLowerCase() === "donut") {
						sChartType = "Donut";
					} else if (sChartType.toLowerCase() === "line") {
						sChartType = "Line";
					}
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.Interactive" + sChartType + "Chart",
						check : function (aCharts) {
							if (aCharts) {
								var bSuccess = false;
								aCharts.forEach(function (oCharts) {
									var chartItem = oCharts.getParent();
									
									if (chartItem.getMeasureField() === sMeasure) {
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
								QUnit.ok(true, "Measure has been changed successfully");
							},
						errorMessage: "Change in measure could not be applied"
					});
				},

				//verify change in chart type
				iCheckTypeOfChart: function(sChartType, sProperty) {
					if (sChartType.toLowerCase() === "bar") {
						sChartType = "Bar";
					} else if (sChartType.toLowerCase() === "donut") {
						sChartType = "Donut";
					} else if (sChartType.toLowerCase() === "line") {
						sChartType = "Line";
					}
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.Interactive" + sChartType + "Chart",
						check : function (aCharts) {
							if (aCharts) {
								var bSuccess = false;
								aCharts.forEach(function (oCharts) {
									var parent = oCharts.getParent();
									var dim = parent.getProperty("dimensionField");
									if (dim === sProperty) {
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							QUnit.ok(true, "Chart type has been changed");
						},
						errorMessage: "Chart type could not be changed"
					});
				},
				//verify the changed sort order
				iCheckSortOrder: function(bIsDescending) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.InteractiveBarChart",
						check : function (aCharts) {
							if (aCharts) {
								var bSuccess = false;
								aCharts.forEach(function (oCharts) {
									var chartItem = oCharts.getParent();
									
									if (chartItem.getSortOrder()[0].Descending.Boolean === bIsDescending) {
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							QUnit.ok(true, "Sort order has been changed successfully");
						},
						errorMessage: "Sort order not changed"
					});
				},

				iCheckDefaultSortOrder: function(sChartType,bIsDescending) {
					if (sChartType.toLowerCase() === "bar") {
						sChartType = "Bar";
					} else if (sChartType.toLowerCase() === "donut") {
						sChartType = "Donut";
					} else if (sChartType.toLowerCase() === "line") {
						sChartType = "Line";
					}
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.suite.ui.microchart.Interactive" + sChartType + "Chart",
						check : function (aCharts) {
							if (aCharts) {
								var bSuccess = false;
								aCharts.forEach(function (oCharts) {
									var chartItem = oCharts.getParent();
									
									if (chartItem.getSortOrder()[0].Descending.Boolean === bIsDescending) {
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							QUnit.ok(true, "Default Sort order for " + sChartType + " Chart has been set Appropriate");
						},
						errorMessage: "Default Sort order not Appropriate"
					});
				},


				//check field group title
				iCheckGroupTitle: function(sValue) {
					return this.waitFor({
						controlType: "sap.m.Title",
						visible: true,
						check : function (aTitles) {
							if (aTitles) {
								var bSuccess = false;
								aTitles.filter(function (oTitles) {
									if(oTitles.getText() === sValue) {
										bSuccess = true;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							QUnit.ok(true, "Group title is visible");
						},
						errorMessage: "Group title hidden"
					});
				},
				iCheckShowOnFilterBarCheckBox: function() {
					return this.waitFor({
						controlType: "sap.m.CheckBox",
						searchOpenDialogs: true,
						check: function(aCheckBox) {
							if (aCheckBox.length > 0) {
								return true;
							}
							return false;
						},
						success: function() {
							QUnit.ok(true, "CheckBox is present");
						},
						errorMessage: "CheckBox is not present"
					});
				},
				iCloseTheVHDialog: function () {
					var okButton;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						check : function (aButtons) {
							return aButtons.filter(function (oButton) {
								if(oButton.getText() === "OK") {
									okButton = oButton;
									return true;
								}
								return false;
							});
						},
						success: function() {
							okButton.firePress();
							QUnit.ok(true,"Opened and closed the dialog successfully");
						},
						errorMessage: "failed in closing the dialog"
					});
				},
				iCheckShowOnFilterBarCheckBoxState: function(state,idx) {
					var bIsShownOnFilterBar = false;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.CheckBox",
						check: function (aCheckBox) {
							if(aCheckBox[idx].getSelected() === state) {
								bIsShownOnFilterBar = true;
								return true;
							}
							return false;
						},
						success: function() {
							QUnit.ok(bIsShownOnFilterBar, "state changed");
						},
						errorMessage: "state not changed"
					});
				},
				//check selected Button
				iCheckSelectedButtonCount: function(num, sProp) {
					var bIsSelectedLinkPresent = false;
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						check : function (aButtons) {
							for (var i in aButtons) {
								var oButton = aButtons[i],
									sTooltip = oButton.getTooltip();
								if (oButton.getText() === "(" + num + ")" && sTooltip && sTooltip.search(sProp) > -1) {
									return true;
								}
							}
							return false;
						},
						success: function() {
							QUnit.ok(true, num + "filters selected");
						},
						errorMessage: "no selections"
					});
				},
				iCheckBarChartSelection: function() {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.InteractiveBarChart",
						check: function(aCharts) {
							if (aCharts[0]){
								var oChart = aCharts[0];
								var aBars = oChart.getAggregation("bars");
								var bSuccess = true;

								aBars.forEach(function(oBar) {
									var sValue = oBar.getProperty("selected");
									if (sValue === true) {
										bSuccess = false;
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function(aChart) {
							QUnit.ok(true, "The Bar Chart has no Selections");
						},
						errorMessage: "The Bar Chart has Selections"
					});
				},
				iCheckOverlay: function(bVisible, overlayMessage, vfCount) {
					var count = 0, bSuccess = true;
					this.waitFor({
						controlType: "sap.m.VBox",
						visible: bVisible,
						check: function(aVBox) {
							for (var i = 0; i < aVBox.length; i++) {
								if (aVBox[i].getItems()[0].sId.indexOf("label") !== -1) {
									//not using a general condition for all overlays texts to keep track of
									//count of charts with overlay for REFINE_CURRENCY_OVERLAY
									if (aVBox[i].getItems()[0].getText() === oi18n.getText(overlayMessage)) {
										count++;
										bSuccess = true;
									}
								}
							}
							if (bSuccess && count === vfCount) {
								return true;
							}
							return false;
						},
						success: function() {
							QUnit.ok(true, "overlay exists on all charts");
						},
						errorMessage: "Overlay has not been applied"
					});
				},

				iCheckForOverlayOnChart: function(bVisible, overlayMessage, vfItem) {
					var count = 0, bSuccess = true;
					this.waitFor({
						controlType: "sap.m.VBox",
						visible: bVisible,
						check: function(aVBox) {
								
								if (aVBox[vfItem].getItems()[0].sId.indexOf("label") !== -1) {
									//not using a general condition for all overlays texts to keep track of
									//count of charts with overlay for REFINE_CURRENCY_OVERLAY
									if (aVBox[vfItem].getItems()[0].getText() === oi18n.getText(overlayMessage)) {
										
										return true;
									}
								}
							
							return false;
						},
						success: function() {
							QUnit.ok(true, "overlay exists on " + vfItem + " charts");
						},
						errorMessage: "Overlay has not been applied"
					});
				},



				iCheckRenderedChart: function(chartType, dimensionField, bSearchOpenDialogs) {
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.Interactive"+chartType+"Chart",
						searchOpenDialogs: !!bSearchOpenDialogs,
						check: function(aCharts) {
							for(var i = 0; i < aCharts.length; i++) {
								if (aCharts[i] && aCharts[i].getParent().getDimensionField() === dimensionField) {
									return true;
								}
							}
							return false;
						},
						success: function() {
							QUnit.ok(true, "Chart rendered");
						},
						errorMessage: "Chart has not been rendered"

					});
				},
				iCheckVHTooltip: function(chartType, dimensionField, tooltipMessage, itemsSelected) {
					var visualFilterChart;
					return this.waitFor({
						controlType: "sap.suite.ui.microchart.Interactive"+chartType+"Chart",
						searchOpenDialogs: true,
						check: function(aCharts) {
							var sDimField = dimensionField.replace(/\s+/g,'');
							for(var i = 0; i < aCharts.length; i++) {
								if (aCharts[i] && aCharts[i].getParent().getDimensionField() === sDimField) {
									//since tooltip can vary across charts, first get the chart control and then get the VH button tooltip.
									var tooltip = aCharts[i].getParent().getParent().getParent().getItems()[0].getContent()[4].getTooltip();
									if (tooltip === oi18n.getText(tooltipMessage, [dimensionField, itemsSelected])) {
										return true;
									}
								}
							}
							return false;
						},
						success: function() {
							QUnit.ok(true, "Appropriate Tooltip");
						},
						errorMessage: "Incorrect Tooltip"
					});
				},
				iCheckChartTitle: function(bDialogOpen, chartTitle) {
					return this.waitFor({
						controlType: "sap.m.Title",
						searchOpenDialogs: bDialogOpen,
						check: function(aTitles) {
							var firstPartTitle = false , secondPartTitle = false;
							var charTitleSplit = chartTitle.split(" | ");
							for(var i = 0; i < aTitles.length; i++){
								var titleText = aTitles[i].getText();
								
								if (charTitleSplit.length > 1) {
									if(!firstPartTitle){
										firstPartTitle = titleText.indexOf(charTitleSplit[0]) !== -1;
									}

									secondPartTitle = titleText.indexOf("| " + charTitleSplit[1]) !== -1;

									if (firstPartTitle && secondPartTitle) {
										return true;
									}
								} else {
									if (aTitles[i].getText().indexOf(chartTitle) !== -1) {
										return true;
									}
								}

							}
							return false;
						},
						success: function() {
							QUnit.ok(true, "The chart has title");
						},
						errorMessage: "Chart does not have a title"
					});
				},
				iCheckForHiddenMeasure: function(sMeasureName) {
					return this.waitFor({
						controlType: "sap.m.List",
						searchOpenDialogs: true,
						check: function(aLists) {
							var bSuccess;
							if (aLists) {
								aLists.forEach(function (oList) {
									if (oList.getParent().getParent().getId().indexOf("adapt-filters-dialog") > -1) {
										return;
									}
									var props = oList.getItems();
									for (var i in props) {
										if (props[i].getTitle() === sMeasureName) {
											return false;
										}
									}
									bSuccess = true;
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							QUnit.ok("Hidden measure " + sMeasureName + " was not found in the measures list");
						},
						errorMessage: "Hidden measure " + sMeasureName + " was found in the measures list"
					});
				},

				iCheckFilterOnDialog: function (sToken) {
					return this.waitFor({
						controlType: "sap.m.Token",
						searchOpenDialogs: true,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: sToken
						}),
						check: function (oToken1) {
							if(oToken1[0].getText() === sToken){
								return true;
							}
							
						},
						success: function(aLists) {
							QUnit.ok(true, "FIlter is applied Properly");
						},
						errorMessage: "Filter is not applied properly"
						
					});
				},

				iCheckVFChartSelected: function(sChartType, value, parentProperty, isNotSelected, bSearchInDialog) {
					// isNotSelected determines whether to check for value eing selected or not selected
					var sInteractiveChart;
					if (sChartType.toLowerCase() === "bar") {
						sInteractiveChart = "InteractiveBarChart";
					} else if (sChartType.toLowerCase() === "line") {
						sInteractiveChart = "InteractiveLineChart";
					} else if (sChartType.toLowerCase() === "donut") {
						sInteractiveChart = "InteractiveDonutChart";
					}
					var aAggregation = null;
					return this.waitFor({
						controlType: "sap.suite.ui.microchart." + sInteractiveChart,
						searchOpenDialogs: bSearchInDialog,
						check: function (aCharts) {
							var bSuccess = false;
							if (aCharts) {
								aCharts.forEach(function (oChart) {
									if (oChart.getParent().getParentProperty() === parentProperty) {
										var fGetAggregation	= oChart.getBars || oChart.getPoints || oChart.getSegments,
										aChartAggregations = fGetAggregation.call(oChart);
										for (var i = 0; i < aChartAggregations.length; i++) {
											aAggregation = aChartAggregations[i];
											var CustomData = aAggregation.getCustomData()[0];
											if (CustomData.getProperty("value").toString() === value.toString()) {
												bSuccess = isNotSelected ? !aAggregation.getSelected() : aAggregation.getSelected();
											}
										}
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							var message;
							if (isNotSelected) {
								message = value + " is not selected";
							} else {
								message = value + " is selected";
							}
							QUnit.ok(true, message);
						},
						errorMessage: "Error in checking " + value
					});
				},


				iCheckForFiltersAppliedInDialog: function(sProp, sValue, bIsFilterValueEmpty) {
					var sAppsId = ApplicationSettings.getAppParameters().ALPPrefixID, bSuccess = false,
						sFilterItemId = sAppsId + "--template::SmartFilterBar-filterItemControlA_-" + sProp;
					return this.waitFor({
						controlType: "sap.m.InputBase",
						searchOpenDialogs: true,
						check: function(aInput) {
							aInput.forEach(function(oInput) {
								if (oInput.getId() === sFilterItemId) {
									if (!bIsFilterValueEmpty) {
										if (oInput.getDateValue && oInput.getDateValue()) {
											bSuccess = oInput.getDateValue().toString() === sValue;
										} else if (oInput.getValue()) {
											bSuccess = oInput.getValue() === sValue;
										}
									} else {
										bSuccess = (oInput.getDateValue && oInput.getDateValue() === null) || oInput.getValue() === sValue;
									}
								}
							});
							return bSuccess;
						},
						success: function(aLists) {
							QUnit.ok(true, "vf-cf values are in sync for property " + sProp);
						},
						errorMessage: "The value in vf and cf are not in sync for " + sProp
					});
				},

				/*
				This function checks whether the particular value is applied to a property in CFD
				@sProp , provide the property name 
				@sValue , provide the value that is applied in CFD for the property sProp
				@bIsFilterValueEmpty, maintain true if there is no value for the property sProp, in which case sValue should be supplied empty.
									  maintain false if there is a value for the property sProp, in which case sValue should have the value to tbe verified
				*/
				isFiltersAppliedInDialog: function(sProp, sValue, bIsFilterValueEmpty) {
					var sAppsId = ApplicationSettings.getAppParameters().ALPPrefixID, bSuccess = false,
						sFilterItemId = sAppsId + "--template::SmartFilterBar-filterItemControl_BASIC-" + sProp;
					return this.waitFor({
						controlType: "sap.m.InputBase",
						searchOpenDialogs: true,
						check: function(aInput) {
							aInput.forEach(function(oInput) {
								if (oInput.getId() === sFilterItemId) {
									if (!bIsFilterValueEmpty) {
										if(oInput.getValue() === sValue){
											bSuccess = true;
										}
									} else {
										if(oInput.getValue() === ''){
											bSuccess = true;
										}
									}
								}
							});
							return bSuccess;
						},
						success: function(aLists) {
							QUnit.ok(true, "vf-cf values are in sync for property " + sProp);
						},
						errorMessage: "The value in vf and cf are not in sync for " + sProp
					});
				},


			}
		}
	});
});
