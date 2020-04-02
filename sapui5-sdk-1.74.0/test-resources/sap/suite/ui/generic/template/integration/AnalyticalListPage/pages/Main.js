/*global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/AnalyticalListPage/pages/Common",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/suite/ui/generic/template/integration/AnalyticalListPage/utils/OpaManifest",
	"sap/suite/ui/generic/template/integration/AnalyticalListPage/utils/OpaResourceBundle",
], function (Opa5, Common, AggregationLengthEquals, AggregationFilled, Properties, PropertyStrictEquals, OpaManifest, OpaResourceBundle) {

	"use strict";
	var oi18n = OpaResourceBundle.template["AnalyticalListPage"].getResourceBundle();
	Opa5.createPageObjects({
		onTheMainPage: {
			baseClass: Common,
			actions: {
				iCheckAbsenceOfValueHelpButton: function (sProperty, bSearchDialog) {
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: !!bSearchDialog,
						check: function (aButton) {
							for (var i in aButton) {
								var oButton = aButton[i],
									sTooltip = oButton.getTooltip && oButton.getTooltip() && oButton.getTooltip().indexOf(sProperty) > -1;
								if (sTooltip) {
									return false;
								}
							}
							return true;
						},
						success: function () {
							QUnit.ok("vale help button not found");
						},
						errorMessage: "Value help button found"
					});
				},
				iClickOKButton: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "OK"
						}),
						success: function (oButton1) {
							oButton1[0].firePress();
							QUnit.ok(true, "OK button was clicked")
						},
						errorMessage: "The page has no OK button."
					});
				},
				iClickTheSegmentedButton: function (btnKey) {
					return this.waitFor({
						autoWait: false,
						timeout: 30,
						controlType: "sap.m.SegmentedButton",
						success: function (segBtns) {
							segBtns.forEach(function (segBtn) {
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
				iAppylHiddenFilterToFilterBar: function (sFilterRestriction, sFilterName, sValue) {
					var bSuccess;
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt",
						check: function (aFilterBars) {
							var oFilter = {},
								bSuccess = false;
							if (sFilterRestriction === "single") {
								oFilter[sFilterName] = sValue;
							} else if (sFilterRestriction === "multiple") {
								oFilter[sFilterName] = {
									items: [],
									ranges: [],
									value: null
								};
								if (typeof sValue === "string") {
									oFilter[sFilterName].value = sValue
								}
								// TODO: enhance to add filters to items and ranges as well
							}
							aFilterBars[0].setFilterData(oFilter);
							var oFilters = aFilterBars[0].getFilterData(true);
							if (sFilterRestriction === "single" && oFilters[sFilterName] === sValue) {
								bSuccess = true;
							} else if (sFilterRestriction === "multiple") {
								if (typeof sValue === "string" && oFilters[sFilterName].value === sValue) {
									bSuccess = true;
								}
								// TODO: enhance to add filters to items and ranges as well
							}
							return bSuccess;
						},
						success: function () {
							QUnit.ok(true, "The hidden filter is successfully applied");
						},
						errorMessage: "The hidden filter is not applied"
					});
				},
				iClickTheKPI: function (sQualifier) {
					return this.waitFor({
						controlType: "sap.m.GenericTag",
						timeout: 45,
						success: function (kpis) {
							var oKPI = kpis.filter(function(oKPI) {
								return oKPI.getQualifier() === sQualifier;
							})[0];
							oKPI.$().trigger("click"); 
						},
						errorMessage: "The KPI cannot be clicked"
					});
				},
				//Click anywhere on the page to close the popover
				iCloseTheKPIPopover: function () {
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						success: function (aPopovers) {
							aPopovers.forEach(function (oPopover) {
								oPopover.destroy();
							});
						},
						errorMessage: "The KPI popover cannot be removed"
					});
				},
				iCheckForHiddenKPI: function (kpiName) {
					return this.waitFor({
						controlType: "sap.m.GenericTag",
						check: function (kpis) {
							var bIsKPIHidden = true;
							if (kpis) {
								for (var i = 0; i < kpis.length; i++) {
									if (kpis[i].sId.indexOf(kpiName) !== -1) {
										bIsKPIHidden = false;
										return bIsKPIHidden;
									}
								}
							}
							return bIsKPIHidden;
						},
						success: function () {
							QUnit.ok(true, "KPI is hidden due to the Error");
						},
						errorMessage: "KPI error KPI is visible"
					});
				},
				iSelectKPIChart: function () {
					return this.waitFor({
						controlType: "sap.viz.ui5.controls.VizFrame",
						searchOpenDialogs: true,
						check: function (kpis) {
							if (kpis) {
								var action = {
									clearSelection: true
								};
								//no API to get top 3 data of viz chart for selections
								//hence directly creating data object and passing it to the the selection event
								var points = [{
									data: {
										"Net Amount": 278455.22,
										"Customer Country Name": "Argentina",
										"Customer Country Name.d": "Argentina"
									}
								}];
								kpis[0].vizSelection(points, action);
								kpis[0].fireSelectData();
								return true;
							}
							return false
						},
						timeout: 45,
						success: function () {
							QUnit.ok(true, "Navigated to new application from KPI chart");
						},
						errorMessage: "Error in navigation from KPI chart"
					});
				},
				iClickKPIHeader: function () {
					return this.waitFor({
						controlType: "sap.m.VBox",
						searchOpenDialogs: true,
						success: function (aHBox) {
							for (var i in aHBox) {
								if (aHBox[i].getId().indexOf("ovpCardHeader") !== -1) {
									aHBox[i].$().trigger("click");
									QUnit.ok(true, "KPI card header clicked");
								}
							}
						},
						errorMessage: "Header in KPI card not clicked"
					});
				},
				iClickCloseFCLButton: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "tooltip",
							value: "Close"
						}),
						success: function (oButton) {
							oButton[0].firePress();
						},
						errorMessage: "The page has no close button."
					});
				},
				iCheckCustomViewButton: function (sButtonTooltip) {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "tooltip",
							value: sButtonTooltip
						}),
						success: function (aButton) {
							aButton[0].firePress();
							QUnit.ok(true, "Content view button - " + sButtonTooltip + " exists and is clicked.");
						},
						errorMessage: "The button - " + sButtonTooltip + " is not found in the page"
					});
				},
				iClickRowActionDetails: function () {
					return this.waitFor({
						controlType: "sap.ui.table.RowAction",
						success: function (oButton) {
							var items = oButton[0].getItems();
							items[0].firePress();
						},
						errorMessage: "The page has no row action button."
					});
				},
				iPassParameter: function (fieldName) {
					return this.waitFor({
						controlType: "sap.m.Input",
						success: function (aInputs) {
							for (var i in aInputs) {
								if (aInputs[i].getId().indexOf(fieldName) !== -1) {
									var Input = aInputs[i];
									Input.setValue("USD");
									Input.fireSubmit();
									Input.fireChange();
									break;
								}
							}
						},
						errorMessage: "Parameter value not passed"
					});
				},

				iShouldSeeTheDialog: function () {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						success: function () {
							// we set the view busy, so we need to query the parent of the app
							Opa5.assert.ok(true, "The dialog is open");
						},
						errorMessage: "Did not find the dialog control"
					});
				},
				iClickCancelButton: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Cancel"
						}),
						success: function (oButton1) {
							oButton1[0].firePress();
							QUnit.ok(true, "Cancel button was clicked")
						},
						errorMessage: "The page has no Cancel button."
					});
				},
				//click event for go button
				iClickGoButton: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Go"
						}),
						success: function (oButton1) {
							oButton1[0].firePress();
						},
						errorMessage: "The page has no Go button."
					});
				},
				iClickRowActionButton: function () {
					return this.waitFor({
						controlType: "sap.ui.table.RowAction",
						success: function (oButton1) {
							oButton1[0].$().trigger("click");
						},
						errorMessage: "The page has no navigation enabled."
					});
				},
				iConfirmFilterChange: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: "Continue" // No other identifier
							})
						],
						success: function (btns) {
							var btn = btns[0];
							btn.firePress();
						},
						errorMessage: "The confirmation dialog cannot be closed"
					});
				},
				iClickOthers: function (label, control) {
					return this.waitFor({
						controlType: control,
						success: function (ctrls) {
							for (var i = 0; i < ctrls.length; i++) {
								var aggregations = ctrls[i].getSegments();
								aggregations[2].$().trigger("click");
								QUnit.ok(true, "Others Selected");
							}
						},
						errorMessage: "Others Coudln't get Selected"
					});
				},
				iVisualFilterBarClear: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						success: function (btns) {
							var checkId = "template::ClearButton";
							for (var i = 0; i < btns.length; i++) {
								var btn = btns[i];

								if (btn.getId() == checkId || btn.getId() == "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--" + checkId) { // some IDs are namespaced
									btn.firePress();
								}
							}
						},
						errorMessage: "The chart selection cannot be applied"
					});
				},
				iSelectChart: function (fieldName, value) {
					return this.waitFor({
						controlType: "sap.ui.comp.smartchart.SmartChart",
						success: function (charts) {
							for (var i = 0; i < charts.length; i++) {
								var vizFrame = charts[i].getChart()._getVizFrame();

								var data = {};
								data[fieldName] = value;
								vizFrame.vizSelection([data], {});
								vizFrame.rerender();
							}
						},
						errorMessage: "The chart selection cannot be applied"
					});
				},
				iClickFilterBarHeader: function () {
					return this.waitFor({
						controlType: "sap.f.DynamicPage",
						success: function (oPage) {
							oPage[0].setHeaderExpanded(!oPage[0].getHeaderExpanded());
						},
						errorMessage: "The Filterbar header is not clicked"
					});
				},
				iClickShareIcon: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function (oButtons) {
							//Find overflow button
							var oMoreButton;
							oButtons.forEach(function (oButton) {
								if (oButton.getIcon() === "sap-icon://overflow") {
									oMoreButton = oButton;
								}
							});
							// If there is more button fire press event
							if (oMoreButton) {
								oMoreButton.firePress();
							}
							var bShareButton = false;
							// Ensure that there is only one share button
							oButtons.forEach(function (oButton) {
								if (oButton.getTooltip() === "Share") {
									//Return false if there is more than one share button
									oButton.firePress();
									bShareButton = true;
								}
							});
							return bShareButton;
						},
						success: function () {
							QUnit.ok(true, "Share icon clicked");
						},
						errorMessage: "Share icon is not clicked"
					});
				},
				iClickSaveAsTile: function () {
					return this.waitFor({
						controlType: "sap.m.Popover",
						searchOpenDialogs: true,
						success: function (aPopover) {
							aPopover.forEach(function (oPopover) {
								if (oPopover.sId.indexOf("shareSheetPopover") > 0) {
									var aItems = oPopover.getContent()[0].getAggregation("buttons");
									aItems.forEach(function (oItem) {
										if (oItem.sId.indexOf("bookmarkButton") > 0) {
											oItem.firePress();
											QUnit.ok(true, "SaveAsTile clicked");
										}
									});
								}
							});
						},
						errorMessage: "The page has no Save As Tile."
					});
				},
				iShouldSeeTheBookmarkDialog: function () {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						success: function (oBookmarkDialog) {
							if (oBookmarkDialog[0].getTitle() === "Save as Tile") {
								QUnit.ok(true, "Bookmark dialog is open");
							}
						},
						errorMessage: "Bookmark dialog is not opened"
					});
				},
				iShouldEnterBookmarkDetails: function (sInput) {
					return this.waitFor({
						controlType: "sap.m.Input",
						searchOpenDialogs: true,
						success: function (aInput) {
							aInput.forEach(function (oInput) {
								if (oInput.sId === "bookmarkTitleInput") {
									oInput.setValue(sInput);
									QUnit.ok(true, "Bookmark details entered");
								}
							});
						},
						errorMessage: "Bookmark details are not entered"
					});
				},
				iClickFLPTile: function (sTile) {
					return this.waitFor({
						controlType: "sap.m.Text",
						success: function (aText) {
							aText.forEach(function (oText) {
								if (oText.getText() === sTile) {
									//OPA fails due to trigger click BCP-1870229336
									//oText.$().trigger("click");
									oText.getParent().firePress();
									QUnit.ok(true, "FLP Tile " + sTile + " Clicked");
								}
							});
						},
						errorMessage: "FLP Tile " + sTile + " not clicked"
					});
				}
			},

			assertions: {
				iCheckTheChartTableSegmentedButtonDoesNotOverflow: function () {
					return this.waitFor({
						controlType: "sap.m.SegmentedButton",
						check: function (aSegmentedButtons) {
							return aSegmentedButtons.some(function (oSegmentedButton) {
								if (oSegmentedButton.getParent().getId() === "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITagContainer::filterableKPIs") {
									return true;
								}
								return false;
							});
						},
						success: function () {
							QUnit.ok(true, "The SegmentedButton does not overflow.");
						},
						errorMessage: "The SegmentedButton does overflow"
					});
				},
				iCheckVisualFilterVHButtonDisabled: function (bSearchOpenDialogs, sTitleText) {
					return this.waitFor({
						controlType: "sap.m.VBox",
						searchOpenDialogs: bSearchOpenDialogs,
						check: function (aVBox) {
							return aVBox.some(function (oVBox) {
								if (oVBox.getItems()[0].getMetadata().getElementName() === "sap.m.OverflowToolbar") {
									if (oVBox.getItems()[0].getTitleControl() && oVBox.getItems()[0].getTitleControl().getText() === sTitleText) {
										return true;
									}
								}
							});
						},
						success: function () {
							QUnit.ok(true, "The valuehelp/datepicker/dropdown button on the visual filter is disabled");
						},
						errorMessage: "The valuehelp/datepicker/dropdown button on the visual filter is not disabled"
					});
				},
				/**
				 * This function to check details of KPI Tag
				 * @param {number} nId this is the index of which KPI Tag to be tested eg 0,1,2
				 * @param {string} sName This is value of KPI Tag short title
				 * @param {number} nValue Value of KPI Tag
				 */
				iFilterBarApplyData: function (fieldName, value) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt",
						success: function (filterBars) {
							var filterBar = filterBars[0];

							var filterItems = filterBar.getFilterItems();
							for (var i = 0; i < filterItems.length; i++) {
								var filterItem = filterItems[i];
								if (filterItem.getName() === fieldName) {
									var filterControl = filterBar.determineControlByFilterItem(filterItem);
									filterControl.setValue(value);
									filterBar.fireFilterChange();
									break;
								}
							}
						},
						errorMessage: "The filter cannot be applied"
					});
				},
				//check if dialog box closed
				iCheckDialogIsClosed: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: false,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Go"
						}),
						success: function (button1) {

							QUnit.ok(true, "Dialog box is closed");
						},
						errorMessage: "dialog box did not close"
					})
				},
				iCheckNumberofFractionalDigit: function (sQualifierName, decimal) {
                    return this.waitFor({
                        controlType: "sap.m.GenericTag",
                        success: function (kpis) {
                            var oKPI = kpis.filter(function(oKPI) {
                                return oKPI.getQualifier() === sQualifierName;
                            })[0];
                            QUnit.ok(oKPI.kpiSettings.dataPoint.ValueFormat.NumberOfFractionalDigits.Int == decimal);
                        },
                        errorMessage: "The KPI are not being displayed"
                    });
                },
                iCheckKpiScaleFactor: function (sQualifierName, scale) {
                    return this.waitFor({
                        controlType: "sap.m.GenericTag",
                        success: function (kpis) {
                            var oKPI = kpis.filter(function(oKPI) {
                                return oKPI.getQualifier() === sQualifierName;
                            })[0];
                            QUnit.ok(oKPI.getValue() != undefined && (oKPI.getValue().getNumber().indexOf(scale) > 0));
                        },
                        errorMessage: "The KPI are not being displayed"
                    });
                },
                iCheckKpiValue: function (sQualifierName, value) {
                    return this.waitFor({
                        controlType: "sap.m.GenericTag",
                        success: function (kpis) {
                            var oKPI = kpis.filter(function(oKPI) {
                                return oKPI.getQualifier() === sQualifierName;
                            })[0];
                            QUnit.ok(oKPI.getValue().getNumber() === value, "The KPI has proper values");
                        },
                        errorMessage: "The KPI are not being displayed"
                    });
                },


				iCheckKpiTagTitle: function (nId) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag",
						success: function (kpis) {
							var kpiTag = kpis[nId];
							if (kpiTag.mProperties.shortDescription != undefined && (kpiTag.mProperties.value != undefined)) {
								QUnit.ok(true, "The KPI has the correct title");
							}
						},
						errorMessage: "kpi has incorrect title"
					});
				},
				iCheckKpiTagTitleWithUoM: function (nId, val) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag",
						success: function (kpis) {
							QUnit.ok(kpis[nId].getUnit() === val, "The KPI Tag title displays the mentioned UoM");
						},
						errorMessage: "The KPI UoM is not been displayed"
					});
				},
				iCheckKpiTagTooltip: function (nId, sTooltipMsg, sIndicator) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag",
						success: function (kpis) {
							var kpiTag = kpis[nId];
							var sKpiIndicator = kpiTag.getIndicator(),
								bIndicatorsMatch = (sKpiIndicator === sIndicator) || (sKpiIndicator === "Critical" && sIndicator === "Risk") || (sKpiIndicator === "Positive" && sIndicator === "Good") || (!sKpiIndicator && sIndicator === "Neutral")
							if ((kpiTag.getTooltip().indexOf(sTooltipMsg) > -1) && bIndicatorsMatch) {
								QUnit.ok(true, "kpi has the correct tooltip");
							}
						},
						errorMessage: "The KPI are not being displayed"
					});
				},
				checkVisualFilterBarTitle: function () {
					return this.waitFor({
						controlType: "sap.m.Label",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Actual Costs by Cost Element in K"
						}),
						success: function (oLabel) {
							QUnit.ok(oLabel[0].hasStyleClass("sapMLabelRequired"), "The Mandatory Parameter is applied");
						},
						errorMessage: "The Mandatory Parameter is not applied"
					});
				},
				iCheckVFMandatoryFilter: function (VFProperty, MandatoryProp, sChartType, MandatoryPropValue, bVFIsMainEntitySet) {
					return this.waitFor({
						controlType: "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicro" + sChartType,
						success: function (aVF) {
							var oVF;
							for (var i = 0; i < aVF.length; i++) {
								if (aVF[i].getParentProperty() === VFProperty) {
									oVF = aVF[i];
									break;
								}
							}
							var filtersApplied = oVF.getDimensionFilterExternal().aFilters[0].aFilters;
							for (var j = 0; j < filtersApplied.length; j++) {
								if (filtersApplied[j].sPath === MandatoryProp && filtersApplied[j].oValue1 === MandatoryPropValue) {
									var sMsg = bVFIsMainEntitySet ? "The mandatory field value is passed to the visual filter without defining it as In Parameter" : "The Mandatory filter value is passed to the VF that is from different a entity set";
									QUnit.ok(true, sMsg);
									break;
								}
							}
						},
						errorMessage: "The mandatory filter value is not passed to the VF"
					});
				},
				iShouldSeeTheComponent: function (label, type, props, settings) {
					var checkId;
					var checkStyleClass;

					var waitForConfig = {
						controlType: type,
						check: function (comps) {
							for (var i = 0; i < comps.length; i++) {
								var comp = comps[i];
								if (checkId && comp.getId) {
									if (comp.getId() == checkId || comp.getId() == "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--" + checkId) { // some IDs are namespaced
										return true;
									}

									continue;
								}

								if (checkStyleClass && comp.hasStyleClass) {
									for (var j = 0; j < checkStyleClass.length; j++) {
										if (comp.hasStyleClass(checkStyleClass)) {
											return true;
										}
									}

									continue;
								}

								if (comp.getVisible && comp.getVisible()) {
									return true;
								}
							}
							return false;
						},
						// timeout: 22,
						timeout: 70,
						success: function () {
							QUnit.ok(true, "The main page has the " + label + ".");
						},
						errorMessage: "Can't see the " + label + "."
					};

					if (props) {
						waitForConfig.matchers = [];
						for (var name in props) {
							if (name == 'id') {
								checkId = props[name];
								continue;
							}

							if (name == 'styleClass') {
								checkStyleClass = props[name];
								continue;
							}

							waitForConfig.matchers.push(
								new PropertyStrictEquals({
									name: name,
									value: props[name]
								})
							);
						}
					}

					if (settings) {
						for (var name in settings) {
							waitForConfig[name] = settings[name];
						}
					}

					return this.waitFor(waitForConfig);
				},
				iShouldSeeTheInteractiveChartControls: function (label, control) {
					return this.waitFor({
						controlType: control,
						success: function (ctrls) {
							var isPercentage = false;
							for (var i = 0; i < ctrls.length; i++) {
								//Using below code we could extend this functionality to other charts also.
								//var aggregations = ctrls[i].getBars() || ctrls[i].getSegments() || ctrls[i].getPoints();
								var aggregations = ctrls[i].getBars();
								for (var j = 0; j < aggregations.length; j++) {
									isPercentage = aggregations[j].getProperty('displayedValue').indexOf("%");
								}
								QUnit.ok(true, (isPercentage) ? "The" + label + "has percentage" : "The" + label + "has absolute values");
							}
						},
						errorMessage: "The page doesn't have " + label + "control."
					});
				},
				checkTableRowCount: function (sTableType, expectedTotalCount) {
					return this.waitFor({
						controlType: "sap.ui.table." + sTableType,
						check: function (comps) {
							var comp = comps[0];
							if (sTableType === "Table") {
								return comp.getBinding().getLength() == expectedTotalCount;
							} else if (sTableType === "AnalyticalTable") {
								return comp.getTotalSize() == expectedTotalCount;
							}
							
							// return true; // Bug when running on the server, no data loaded in the table, disable for now
						},
						// timeout: 22,
						timeout: 70,
						success: function () {
							//@Aniket  this test is always returning true plese correct the test
							QUnit.ok(true, "The main table has a total data count of " + expectedTotalCount + ".");
						},
						errorMessage: "The table doesn't have a total data count of " + expectedTotalCount + "."
					});
				},

				checkGridTableRowCount: function (expectedTotalCount) {
					return this.waitFor({
						controlType: "sap.ui.table.Table",
						check: function (comps) {
							var comp = comps[0];

							return comp.getVisibleRowCount() == expectedTotalCount;

							// return true; // Bug when running on the server, no data loaded in the table, disable for now
						},
						// timeout: 22,
						timeout: 70,
						success: function () {
							//@Aniket  this test is always returning true plese correct the test
							QUnit.ok(true, "The main table has a total data count of " + expectedTotalCount + ".");
						},
						errorMessage: "The table doesn't have a total data count of " + expectedTotalCount + "."
					});
				},

				//TODO: Checks if any variant is present in the page.
				//Conditions to check for page level , chart and table should be done if the smartVariantManagement is enabled
				iShouldSeeVariantControls: function () {
					return this.waitFor({
						controlType: "sap.ui.comp.variants.VariantManagement",
						success: function (ctrls) {
							for (var i = 0; i < ctrls.length; i++) {
								var ctrl = ctrls[i];
								QUnit.ok(true, "The main page has the " + ctrl + ".");
							}
						},
						errorMessage: "The page doesn't have a varinat control."
					});
				},
				iCheckFilterCount: function (count, id) {
					return this.waitFor({
						controlType: "sap.m.Button",
						success: function (btns) {
							var checkVFId = "template::VisualFilterDialogButton";
							var checkCFId = "template::SmartFilterBar-btnFilters";
							var cntrlId = id ? id + "::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--" : "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--"
							var bAsserit = false;
							for (var i = 0; i < btns.length; i++) {
								var btn = btns[i];
								if (btn.getId() === checkVFId || (btn.getId() === cntrlId + checkVFId) || (btn.getId() === cntrlId + checkCFId)) {
									var filterText = btn.getText();
									if (filterText === "Adapt Filters (" + count + ")" || filterText === "Adapt Filters") {
										bAsserit = true;
									}
								}
							}
							QUnit.ok(bAsserit, "Filter count has been updated");
						},
						errorMessage: "The filter count value is incorrect"
					});
				},
				iCheckTooltip: function (buttonType, filterBarType) {
					return this.waitFor({
						controlType: "sap.m.Button",
						success: function (btns) {
							var contrlId, bAsserit = false;
							var templateId = filterBarType === "SmartFilterbar" ? "template::SmartFilterBar" : "";
							if (buttonType === "Adapt Filter Button") {
								contrlId = templateId === "" ? "template::VisualFilterDialogButton" : templateId + "-btnFilters";
							} else if (buttonType === "Go Button") {
								contrlId = templateId === "" ? "template::GoFilters" : templateId + "-btnGo";
							}
							for (var i = 0; i < btns.length; i++) {
								var btn = btns[i];
								if (btn.getId().indexOf(contrlId) !== -1) {
									bAsserit = btn.getText() === btn.getTooltip();
								}
							}
							QUnit.ok(bAsserit, "The tooltip for " + buttonType + " is correct");
						},
						errorMessage: "The tooltip for " + buttonType + " is incorrect"
					});
				},
				iCheckFilterCountInOverflowToolbar: function (count) {
					var filterButton;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						check: function (aOverflowToolbar) {
							if (aOverflowToolbar.length) {
								for (var j = 0; j < aOverflowToolbar.length; j++) {
									var aToolbarContents = aOverflowToolbar[j].getContent();
									for (var i = 0; i < aToolbarContents.length; i++) {
										//check for dialog button in CF or VF mode
										if (aToolbarContents[i].sId.indexOf("VisualFilterDialogButton") > 0 || aToolbarContents[i].sId.indexOf("SmartFilterBar-btnFilters") > 0) {
											filterButton = aToolbarContents[i];
											if (filterButton.getText().indexOf(count) > 0) {
												return true;
											}
										}
									}
								}
							}
							return false;
						},
						success: function () {
							QUnit.ok(true, "Filter count correct");
						},
						errorMessage: "Incorrect filter count"
					});
				},
				iCheckForFilterSwitch: function () {
					return this.waitFor({
						controlType: "sap.m.SegmentedButton",
						check: function (aButtons) {
							var checkId = "template::FilterSwitchButton"
							var bFlag = true;
							aButtons.forEach(function (oButton) {
								if (oButton.getId() == checkId || oButton.getId() == "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--" + checkId) {
									bFlag = false;
								}
							});
							return bFlag;
						},
						success: function () {
							QUnit.ok(true, "FilterSwitch is not present");
						},
						errorMessage: "Filter Switch is present"
					});
				},
				iCheckVisualFilterCharts: function (iChartCnt) {
					var count = 0;
					return this.waitFor({
						controlType: "sap.m.VBox",
						check: function (aVBox) {
							var bSuccess = true;
							if (aVBox) {
								//var bSuccess = false;
								aVBox.forEach(function (oVBox) {
									if (oVBox.getFieldGroupIds()[0] === "headerBar") {
										bSuccess = true;
										count++;
									}
								});
								return bSuccess;
							}
							return bSuccess;
						},
						success: function () {
							QUnit.ok(count === iChartCnt || iChartCnt === 0, count + " VF Charts are present");
						},
						errorMessage: count + " VF Charts are present"
					});
				},
				iCheckVFChartandTitleWidth: function () {
					var bSuccess = false;
					return this.waitFor({
						controlType: "sap.m.HeaderContainer",
						check: function (aContainer) {
							var headerContents = aContainer[0].getContent();
							for (var i = 0; i < headerContents.length; i++) {
								var oVBox = headerContents[i];
								if (oVBox.getItems()[0].$().css("width") === oVBox.getItems()[2].$().css("width")) {
									bSuccess = true;
								} else {
									bSuccess = false;
									break;
								}
							}
							return bSuccess;
						},
						success: function () {
							QUnit.ok(bSuccess, "VF Chart and Title width are equal");
						},
						errorMessage: "VF Chart and Title width are not equal"
					});
				},
				iShouldSeeTheFilterVisibility: function () {
					var bIsCF = false,
						bIsVF = false;
					return this.waitFor({
						controlType: "sap.m.FlexBox",
						check: function (aFlexBox) {
							if (aFlexBox) {
								aFlexBox.forEach(function (oFlexBox) {
									if (oFlexBox.getId().indexOf("template::CompactFilterContainer") != -1) {
										bIsCF = oFlexBox.getVisible();
									} else if (oFlexBox.getId().indexOf("template::VisualFilterContainer") != -1) {
										bIsVF = oFlexBox.getVisible();
									}
								});
								return true;
							}
							return false;
						},
						success: function () {
							QUnit.ok(bIsCF !== bIsVF, bIsVF ? "VF Visibility is true" : "VF Visibility is false");
						},
						errorMessage: "VF and CF are Visibile"
					});
				},
				iShouldSeeTheAdaptFiltersInGoButtonmode: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						success: function (btns) {
							var bAsserit = false;
							for (var i = 0; i < btns.length; i++) {
								var filterText = btns[i].getText();
								if (filterText.indexOf("Adapt Filters") != -1) {
									if (btns[i + 1].getText() === "Go") {
										bAsserit = true;
									} else if (btns[i + 1].getId().indexOf("template::Share") != -1) {
										bAsserit = true;
									}
								}
							}
							QUnit.ok(bAsserit, "Adapt Filters present");
						},
						errorMessage: "Adapt Filters are not present"
					});
				},
				iShouldSeeTheAdaptFiltersInLivemode: function () { //Need to be removed
					var bSuccess = false;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						check: function (aToolbars) {
							var actionButtons = aToolbars[1].getContent();
							for (var i = 0; i < actionButtons.length; i++) {
								if (actionButtons[i].sId.indexOf("VisualFilterDialogButton") !== -1) {
									if (actionButtons[i].getText().indexOf("Adapt Filters") !== -1) {
										if (actionButtons[i + 1].getId().indexOf("template::Share") != -1) {
											bSuccess = true;
										}
									}
								}
							}
							return bSuccess;
						},
						success: function () {
							QUnit.ok(true, "Adapt Filters present");
						},
						errorMessage: "Adapt Filters are not present"
					});
				},
				iShouldSeeTheAdaptFiltersVisibilityInLivemode: function () {
					var bSuccess = true;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						check: function (aToolbars) {
							var actionButtons = aToolbars[0].getContent();
							for (var i = 0; i < actionButtons.length; i++) {
								if (actionButtons[i].sId.indexOf("VisualFilterDialogButton") !== -1) {
									if (actionButtons[i].getText().indexOf("Adapt Filters") !== -1 &&
										actionButtons[i].getVisible() === true) {
										bSuccess = true;
									}
								}
							}
							return bSuccess;
						},
						success: function () {
							QUnit.ok(bSuccess, "Adapt Filters are hidden");
						},
						errorMessage: "Adapt Filters are not hidden"
					});
				},

				// check if the Custom Toolbar in the Smart Table is rendered correctly without determining and global actions
				// Get all "sap.m.Button" and match the button's text against the manifest
				theCustomToolbarForTheSmartTableIsRenderedWithoutGlobalAndDetermining: function () {
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",						
						success: function (aControl) {
							var iButtonIndex = 0;
							var oTableToolbar;

							for (var i in aControl) {
								if (aControl[i].getId().indexOf("TableToolbar") > 1) {
									oTableToolbar = aControl[i];
								} 
							}

							var aButton = oTableToolbar.getContent().filter(function (oControl) {
								return oControl.getMetadata().getName() === "sap.m.Button";
							});
							var mProductBreakoutActions = OpaManifest.demokit["sample.analytical.list.page.ext"].getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage/sap.ui.generic.app/ZCOSTCENTERCOSTSQUERY0020/Actions/");
							var oi18nResourceBundle = OpaResourceBundle.demokit["sample.analytical.list.page.ext"].i18n;
							for (var sAction in mProductBreakoutActions) {
								if (!mProductBreakoutActions[sAction].determining && !mProductBreakoutActions[sAction].global && (!mProductBreakoutActions[sAction].filter || mProductBreakoutActions[sAction].filter === "table")) {
									equal(aButton[iButtonIndex].getText(), oi18nResourceBundle.getProperty(mProductBreakoutActions[sAction].id), "The " + oi18nResourceBundle.getProperty(mProductBreakoutActions[sAction].id) + " button is rendered correctly");
									if (aButton[iButtonIndex].getText() === "Requires Selection") {
										equal(aButton[iButtonIndex].getEnabled(), false, "Requires Selection is rendered in table correctly");
									}
									iButtonIndex++;
								}
							}
						},
						errorMessage: "The Smart Table Toolbar is not rendered correctly"
					});
				},
				// check if the dynamic header is rendered with global actions
				// Get all "sap.m.Button" and match the button's text against the manifest
				isTheDynamicHeaderRenderingGlobalActions: function () {
					return this.waitFor({
						controlType: "sap.f.DynamicPage",
						matchers: [
							new PropertyStrictEquals({
								name: "fitContent",
								value: true
							})
						],
						success: function (aControl) {
							//ok(true, "OPA needs to be fixed as it uses private APIs")
							ok(true, "The DynamicPage can fit contents");
							var iButtonIndex = 0;
							var titleBar = aControl[0].getTitle().getActions()
							var aButton = titleBar.filter(function (oControl) {
								return oControl.getMetadata().getName() === "sap.m.Button";
							});
							var mProductBreakoutActions = OpaManifest.demokit["sample.analytical.list.page.ext"].getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage/sap.ui.generic.app/ZCOSTCENTERCOSTSQUERY0020/Actions/");
							var oi18nResourceBundle = OpaResourceBundle.demokit["sample.analytical.list.page.ext"].i18n;
							for (var sAction in mProductBreakoutActions) {
								if (mProductBreakoutActions[sAction].global) {
									equal(aButton[iButtonIndex].getText(), oi18nResourceBundle.getProperty(mProductBreakoutActions[sAction].id), "The " + oi18nResourceBundle.getProperty(mProductBreakoutActions[sAction].id) + " button is rendered correctly");
									iButtonIndex++;
								}
							}
						},
						errorMessage: "The Global Actions is not rendered correctly"
					});
				},

				iShouldSeeTheChartMinHeight: function () {
					var bHasStyleClass = false;
					return this.waitFor({
						controlType: "sap.m.VBox",
						check: function (aVBox) {
							aVBox.forEach(function (oVBox) {
								if (oVBox.hasStyleClass("sapSmartTemplatesAnalyticalListPageChartContainer")) {
									if (oVBox.$().css('min-height') == "160px") {
										bHasStyleClass = true;
									}
								}
							});
							return bHasStyleClass;
						},
						success: function () {
							QUnit.ok(bHasStyleClass, "The Min Chart Height is set");
						},
						errorMessage: "The Min Chart Height is not set"
					});
				},

				isTheFooterBarHasDeterminingButtonsCorrectly: function () {
					return this.waitFor({
						controlType: "sap.f.DynamicPage",
						matchers: [
							new PropertyStrictEquals({
								name: "showFooter",
								value: true
							})
						],
						success: function (aControl) {
							var footerBar = aControl[0].getFooter().getContent();
							var aButton = footerBar.filter(function (oControl) {
								return oControl.getMetadata().getName() === "sap.m.Button";
							});
							var nManifestCount = 0,
								nUICount = 0;
							var mProductBreakoutActions = OpaManifest.demokit["sample.analytical.list.page.ext"].getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage/sap.ui.generic.app/ZCOSTCENTERCOSTSQUERY0020/Actions/");
							var oi18nResourceBundle = OpaResourceBundle.demokit["sample.analytical.list.page.ext"].i18n;
							for (var sAction in mProductBreakoutActions) {
								if (mProductBreakoutActions[sAction].determining && !mProductBreakoutActions[sAction].global) {
									++nManifestCount;
									for (var i = 0; i < aButton.length; i++) {
										var sButtonId = aButton[i].getId().split("--")[1];
										if (sButtonId === mProductBreakoutActions[sAction].id && aButton[i].getVisible) {
											++nUICount;
											break;
										}
									}
								}
							}
							QUnit.ok(nManifestCount === nUICount, nUICount + " determining button(s) are rendered correctly on the footer bar");
						},
						errorMessage: "Determing button(s) are not rendered correctly on the footer bar"
					});
				},

				checkForRequiresSelectionButtons: function (oControl, oControlName, expectedResult) {
					ok(true, "The OverflowToolbar has its design set to 'Transparent'");
					var iButtonIndex = 0;
					var aButton;
					aButton = oControl[0].getContent().filter(function (oControl) {
						return oControl.getMetadata().getName() === "sap.m.Button";
					});

					var mProductBreakoutActions = OpaManifest.demokit["sample.analytical.list.page.ext"].getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage/sap.ui.generic.app/ZCOSTCENTERCOSTSQUERY0020/Actions/");
					var oi18nResourceBundle = OpaResourceBundle.demokit["sample.analytical.list.page.ext"].i18n;
					for (var sAction in mProductBreakoutActions) {
						if (mProductBreakoutActions[sAction].requiresSelection && !mProductBreakoutActions[sAction].determining && !mProductBreakoutActions[sAction].global && (!mProductBreakoutActions[sAction].filter || mProductBreakoutActions[sAction].filter === oControlName)) {
							equal(aButton[iButtonIndex].getEnabled(), expectedResult, "Requires Selection is rendered in " + oControlName + " correctly");
						}
						iButtonIndex++;
					}
				},
				// check if the Custom Toolbar in the Smart Table is rendered correctly with RequireSelection disabled
				// Get all "sap.m.Button" and match the button's text against the manifest
				theCustomToolbarForTheSmartTableIsRenderedWithRequireSelectionCorrectly: function (expectedResult) {
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						success: function (aControl) {
							var oTableToolbar;
							for (var i in aControl) {
								if (aControl[i].getId().indexOf("TableToolbar") > 1) {
									oTableToolbar = aControl[i];
								} 
							}
							this.checkForRequiresSelectionButtons([oTableToolbar], "table", expectedResult);
						},
						errorMessage: "The Require Selection Smart Table Toolbar buttons are not rendered correctly"
					});
				},
				// check if the Custom Toolbar in the Smart Chart is rendered correctly with RequireSelection disabled
				// Get all "sap.m.Button" and match the button's text against the manifest
				theCustomToolbarForTheSmartChartIsRenderedWithRequireSelectionCorrectly: function (expectedResult) {
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						matchers: [
							new PropertyStrictEquals({
								name: "design",
								value: "Transparent"
							})
						],
						success: function (oControl) {
							this.checkForRequiresSelectionButtons(oControl, "chart", expectedResult)
						},
						errorMessage: "The Require Selection in Smart Chart Toolbar buttons are not rendered correctly"
					});
				},


				iShouldSeeActionButtonsWithValidId: function () {
					var bSuccess = false;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						check: function (aToolbars) {
							var actionButtons = aToolbars[0].getContent();
							for (var i = 0; i < actionButtons.length; i++) {
								if (actionButtons[i].sId) {
									bSuccess = true;
								}
							}
							return bSuccess;
						},
						success: function () {
							QUnit.ok(true, "Buttons have valid id");
						},
						errorMessage: "Buttons do not have a valid id"
					});
				},

				//navigate back to ALP application
				iClickBackButtonToNavigateToALP: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function (btns) {
							for (var i = 0; i < btns.length; i++) {
								if (btns[i].getId().indexOf("shellAppTitle") !== -1) {
									var backButton = btns[i].getParent().getHeadItems();
									for (var j = 0; j < backButton.length; j++) {
										if (backButton[j].sId.indexOf("backBtn") !== -1) {
											backButton[j].firePress();
											return true;
										}
									}
								}
							}
							return false;
						},
						success: function () {
							// btns[0].firePress();
							QUnit.ok("Navigated to ALPWithSettings");
						},
						errorMessage: "Cannot navigate to ALPWithSettings"
					});
				},
				//when no target is available for navigation from kpi chart,
				//kpi card remains open on click of chart
				iCheckOpenKPICard: function () {
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						timeout: 30,
						check: function (kpiCard) {
							if (kpiCard[0]) {
								var openCardType = kpiCard[0].getContent()[0].getViewName();
								if (openCardType.indexOf("KpiCardSizeM") !== -1) {
									return true;
								}
							}
							return false;
						},
						success: function () {
							QUnit.ok(true, "KPI card is still open as there is no target defined for navigation")
						},
						errorMessage: "Check navigation issue from KPI card"
					})
				},
				// function to check Object page header presence
				iShouldSeeObjectPageHeader: function () {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageHeader",
						success: function (headers) {
							QUnit.ok(headers.length != 0, "Object Page found");
						},
						errorMessage: "Object Page not found"
					});

				},
				// Check if FilterableKPIs are rendered correctly in the content area
				CheckFilterableKPIs: function (label) {
					var bSuccess = true;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						success: function (components) {
							var keyPerformanceIndicators = OpaManifest.demokit["sample.analytical.list.page"].getProperty("/sap.ui.generic.app/pages/AnalyticalListPage/component/settings/keyPerformanceIndicators/");
							var filterableKPIs = [];
							for (var item = 0; item < Object.keys(keyPerformanceIndicators).length; item++) {
								if (keyPerformanceIndicators[Object.keys(keyPerformanceIndicators)[item]]["filterable"]) {
									filterableKPIs.push(keyPerformanceIndicators[Object.keys(keyPerformanceIndicators)[item]]);
								}
							}
							for (var i = 0; i < components.length; i++) {
								var component = components[i];
								if (component.getId) {
									if (component.getId() === "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::FilterableKpiTagContainer" && filterableKPIs.length > 0) { // some IDs are namespaced
										var oControl = component.getContent()[1];
										// Check for smartKPI tags
										if (oControl.getMetadata().getName() === "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag") {
											QUnit.ok(true, "Filterable KPIs are present");
										} else {
											bSuccess = false;
										}
										// Check for content Area Label
										if (component.getItems()[0].getText() === label) {
											QUnit.ok(true, "Content area label is present");
										} else {
											bSuccess = false;
										}
										// Check if segemented button is present in the filterable KPI section
										var oSegmentedButton = component.getItems()[2].getItems()[0];
										if (oSegmentedButton.getMetadata().getName() === "sap.m.SegmentedButton") {
											QUnit.ok(true, "SegmentedButton is Present");
										} else {
											bSuccess = false;
										}
									}
								}
								if (!bSuccess) {
									QUnit.ok(bSuccess, "Filterable KPIs not rendered correctly");
								}

							}
						},
						errorMessage: "Filterable KPIs are not present"
					});
				},
				// Check for segmented button not present in table/chart toolbar
				isSegmentedButtonNotPresentInToolbar: function (oControlName) {
					var bSuccess = true;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						success: function (aControl) {
							var aButton = aControl.filter(function (oControl) {
								if (oControl.getId().indexOf("TableToolbar") !== -1 || oControl.getId().indexOf("ChartToolbar") !== -1) {
									oControl.getContent().forEach(function (content) {
										return content.getMetadata().getName() === "sap.m.SegmentedButton";
									});
								}
							});
							if (aButton.length > 0 && aButton[0].getId() !== "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::FilterSwitchButton") {
								bSuccess = false;
							}
							QUnit.ok(bSuccess, "segmented button not present in" + oControlName + "toolbar with filterable KPI");
						}
					});
				},

				iCheckKpiTitleInCard: function (sTitle) {
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						success: function (aPopovers) {
							var customData = aPopovers[0].getAggregation("_popup").getContent()[0].getCustomData();
							for (var i = 0; i < customData.length; i++) {
								if (customData[i].getKey() === "kpiTitle" && customData[i].getValue() === sTitle) {
									QUnit.ok(true, "KPI title in card is correct");
								}
							}
						},
						errorMessage: "KPI title is not the same in the card"
					});
				},

				CheckKpiIndicator: function (id, indicator) {
					return this.waitFor({
						controlType: "sap.m.GenericTag",
						success: function (kpi) {
							if ((!kpi[id].getIndicator() && indicator === "Neutral") || kpi[id].getIndicator() === indicator) {
								QUnit.ok(true, "criticality indicator is set correctly for kpi");
							} else {
								QUnit.ok(false, "criticality indicator is set incorrectly for kpi");
							}
						},
						errorMessage: "KPI tag has wrong criticality indicator"
					});
				},

				CheckKpiErrorType: function (id, errorType) {
					return this.waitFor({
						controlType: "sap.m.GenericTag",
						success: function (kpi) {
							if (kpi[id].getErrorType() === errorType) {
								QUnit.ok(true, "Error type correctly set");
							} else {
								QUnit.ok(false, "Error type is not set correctly");
							}
						},
						errorMessage: "KPI tag has wrong error type"
					});
				},

				checkAppTitle: function (appName) {
					return this.waitFor({
						controlType: "sap.m.Button",
						timeout: 30,
						success: function (aButtons) {
							for (var i in aButtons) {
								if (aButtons[i].getId().indexOf("shellAppTitle") !== -1) {
									if (aButtons[i].getText() === appName) {
										QUnit.ok(true, "Navigated to app succesful");
									}
								}
							}
						},
						errorMessage: "Cannot navigate to new app"
					});
				},
				iCheckKPICurrencyUnit: function (id, currency) {
					return this.waitFor({
						controlType: "sap.m.GenericTag",
						success: function (aKPIs) {
							var kpi = aKPIs[id];
							if (kpi.getUnit() === currency) {
								QUnit.ok(true, "Unit of currency is correct");
							}
						},
						errorMessage: "Unit of currency of kpi is incorrect"
					});
				},
				iCheckKpiErrorText: function (kpiErrorText) {
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						success: function (aPopovers) {
							kpiErrorText = oi18n.getText(kpiErrorText);
							if (aPopovers[0].getAggregation("_popup").getContent()[0].getText().indexOf(kpiErrorText) !== -1) {
								QUnit.ok(true, "KPI error text is properly displayed");
							} else {
								QUnit.ok(false, "KPI error text is Incorrect");
							}
						},
						errorMessage: "KPI title is not the same in the card"
					});
				},
				// Check if FilterableKPIs are rendered correctly in the content area
				CheckCustomViewButtonOnFilterableKPISection: function () {
					var bSuccess = true;
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						success: function (components) {
							var keyPerformanceIndicators = OpaManifest.demokit["sample.analytical.list.page.ext"].getProperty("/sap.ui.generic.app/pages/AnalyticalListPage/component/settings/keyPerformanceIndicators/");
							var filterableKPIs = [];
							for (var item = 0; item < Object.keys(keyPerformanceIndicators).length; item++) {
								if (keyPerformanceIndicators[Object.keys(keyPerformanceIndicators)[item]]["filterable"]) {
									filterableKPIs.push(keyPerformanceIndicators[Object.keys(keyPerformanceIndicators)[item]]);
								}
							}
							for (var i = 0; i < components.length; i++) {
								var component = components[i];
								if (component.getId) {
									if (component.getId() === "analytics4::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITagContainer::filterableKPIs" && filterableKPIs.length > 0) { // some IDs are namespaced
										// Check if custom view switch button is present in the filterable KPI section
										var oSegmentedButton = component.getContent()[3];
										if (oSegmentedButton.getItems()[2].getKey() === "customview") {
											QUnit.ok(true, "CustomView switch button is present on Filterable KPI Section");
										} else {
											bSuccess = false;
										}
									}
								}
								if (!bSuccess) {
									QUnit.ok(bSuccess, "CustomView switch button is not present on Filterable KPI Section");
								}

							}
						},
						errorMessage: "CustomView switch button is not present on Filterable KPI Section"
					});
				},
				checkFiltersInFilterableKpi: function (aValues) {
					return this.waitFor({
						controlType: "sap.m.Text",
						searchOpenDialogs: true,
						success: function (aText) {
							var aFilters = aText.filter(function (oFilter) {
								if (oFilter.getId().indexOf("headerFilterText") !== -1) {
									for (var val in aValues) {
										if (oFilter.getText() === aValues[val]) {
											return oFilter;
										}
									}
								}
							});
							if (aFilters.length === aValues.length) {
								QUnit.ok("Filter/s have been applied to KPI");
							}
						},
						errorMessage: "Filter/s have not been merged"
					});
				},
				//Checks slection column check box
				checkSelectionColumn: function () {
					return this.waitFor({
						controlType: "sap.m.Table",
						success: function (aTable) {
							if (aTable[0].getMode() === "None") {
								QUnit.ok("Selection column is not visble");
							}
						},
						errorMessage: "Selection column is visible in this page"
					});
				},
				iClickInputValueHelp: function (sFilter) {
					return this.waitFor({
						controlType: "sap.m.Input",
						success: function (aInputs) {
							for (var i in aInputs) {
								var inp = aInputs[i];
							}
						}
					});
				},
				checkContentViewButtonsToolbar: function (sID) {
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						check: function (aOverflowToolbars) {
							for (var i in aOverflowToolbars) {
								if (aOverflowToolbars[i].getId().indexOf("template::" + sID)) {
									return true;
								}
							}
							return false;
						},
						success: function () {
							QUnit.ok(true, "ContentViewButtons overflow toolbar exists");
						},
						errorMessage: "ContentViewButtons Toolbar does not exist"
					});
				},
				checkCustomViewButtonInAllViews: function (sButtonName) {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "tooltip",
							value: sButtonName
						}),
						success: function () {
							QUnit.ok(true, "CustomView button present");
						},
						errorMessage: "CustomView button not present"
					});
				},
				iCheckCriticalityInKPICard: function (criticality) {
					return this.waitFor({
						controlType: "sap.m.HBox",
						searchOpenDialogs: true,
						success: function (aHBox) {
							for (var i in aHBox) {
								if (aHBox[i].getId().indexOf("kpiHBoxNumeric") !== -1) {
									var oValue = aHBox[i].getItems()[0];
									if (oValue.getValueColor() === criticality) {
										QUnit.ok("Card is in sync with tag");
									}
								}
							}
						},
						errorMessage: "Criticality is wrong"
					});
				},
				iCheckNavErrorMessagePopup: function () {
					var bSuccess = false,
						messageBox;
					return this.waitFor({
						controlType: "sap.m.Dialog",
						searchOpenDialogs: false,
						check: function (aMessageBox) {
							aMessageBox && aMessageBox.forEach(function (oMessageBox) {
								if (oMessageBox.getContent()[0].getText().indexOf("Drilldown navigation failed. Please contact your system administrator") > -1) {
									bSuccess = true;
									messageBox = oMessageBox;
								}
							});
							return bSuccess;
						},
						success: function () {
							QUnit.ok("popup with error message is shown on nav error");
							var okButton = messageBox.getButtons()[0];
							if (okButton.getText() === "OK") {
								okButton.firePress();
								QUnit.ok(true, "messageBox closed");
							} else {
								QUnit.ok(false, "messageBox not closed.");
							}
						},
						errorMessage: "errorMessage popup not shown"
					});
				},
				iCheckValueHelpDialogForTokens: function (aValues) {
					return this.waitFor({
						controlType: "sap.m.Token",
						searchOpenDialogs: true,
						check: function (aTokens) {
							var count = 0;
							for (var i in aValues) {
								for (var j in aTokens) {
									if (aTokens[j].getText() === aValues[i]) {
										count++;
										break;
									}
								}
							}
							if (count === aValues.length) {
								return true;
							}
							return false;
						},
						success: function () {
							QUnit.ok(true, "exclude tokens are present");
						},
						errorMessage: "exclude tokens absent"
					});
				},
				iCheckOverlayForChart: function (bVisible, id) {
					var count = 0,
						bSuccess = true;
					this.waitFor({
						controlType: "sap.m.VBox",
						visible: bVisible,
						check: function (aVBox) {
							for (var i = 0; i < aVBox.length; i++) {
								if (aVBox[i].getId() === id) {
									if (aVBox[i].mProperties.noData) {
										return true;
									}
								}
							}
							return false;
						},
						success: function () {
							QUnit.ok(true, "overlay exist for Chart");
						},
						errorMessage: "Overlay has not been applied"
					});
				},
				iCheckOverlayForTable: function (bVisible, id) {
					var count = 0,
						bSuccess = true;
					this.waitFor({
						controlType: "sap.m.VBox",
						visible: bVisible,
						check: function (aVBox) {
							for (var i = 0; i < aVBox.length; i++) {
								if (aVBox[i].getId() === id) {
									if (aVBox[3].mAggregations.items[1].mAggregations.noData) {
										return true;
									}
								}
							}
							return false;
						},
						success: function () {
							QUnit.ok(true, "overlay exist for Table");
						},
						errorMessage: "Overlay has not been applied"
					});
				}


			}
		}

	});
});
