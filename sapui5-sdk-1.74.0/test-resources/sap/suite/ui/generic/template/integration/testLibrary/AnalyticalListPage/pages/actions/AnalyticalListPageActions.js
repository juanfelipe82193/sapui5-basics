sap.ui.define([	"sap/ui/test/Opa5",
               	"sap/ui/base/Object",
               	"sap/ui/test/matchers/PropertyStrictEquals",
                "sap/ui/test/matchers/AggregationFilled",
                "sap/ui/test/actions/Press",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/Common" ],
	function(Opa5, BaseObject, PropertyStrictEquals, AggregationFilled, Press, ApplicationSettings, Common) {
		return function (sViewNameAnalyticalListPage, sViewNamespaceAnalyticalListPage) {
			return {

				/**
				* Press the Go button within a Fiori Elements AnalyticalListPage UI to start the search for the AnalyticalListPage data.
				*
				* @throws {Error} Throws an error if the Go button could not be found on the UI
				* @public
				*/
				iExecuteTheSearch: function () {
					var sGoButtonId = ApplicationSettings.getAppParameters().ALPPrefixID + "--template::SmartFilterBar-btnGo";
				 	return this.waitFor({
				 		id: sGoButtonId,
				 		success: function (oButton) {
				 			oButton.firePress();
				 			Opa5.assert.ok(true, "The search was triggered successfully");
				 		},
				 		errorMessage: "The search could not be executed"
				 	});
				},
				/**
				* Check the current UI. Function just returns this as a result.
				*
				* @public
				*/
				iLookAtTheScreen : function () {
					return this;
				},


				/**
				* Set a value within a field of the Smart Filter Bar.
				* This function can be used to load a filtered list when afterwards the search is executed.
				*
				* @param {object} oItem This object must be filled with the data needed to set a specific filter field value
				* oItem.Field (string):	The field to be set. Choose the name of the field as shown in the metadata of the service. If you
				* want to search via Editing Status, choose "editStateFilter" for this parameter.
				* oItem.Value:			The value to be filtered. If you want to search via Editing Status, choose values 0-4 for the options.
				* @throws {Error} Throws an error if the Smart Filter Bar could not be identified.
				* @public
				*/
				iSetTheFilter: function(oItem) {
					return this.waitFor({
						controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
						viewName: sViewNameAnalyticalListPage,
						viewNamespace: sViewNamespaceAnalyticalListPage,
						success: function (aControl) {
							var oSmartFilterBar, oHorizontalLayout;
							var aSmartFilterBarContent, aVerticalLayout;
							oSmartFilterBar = aControl[0];
							if (oSmartFilterBar && oSmartFilterBar.getMetadata().getName() === "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt") {
								aSmartFilterBarContent = oSmartFilterBar.getContent();
							} else {
								notOk("The Smart Filter Bar was not rendered correctly");
								return;
							}
							if (!aSmartFilterBarContent || aSmartFilterBarContent.length < 1) {
								notOk("The Smart Filter Bar was not rendered correctly");
								return;
							}
							oHorizontalLayout = aSmartFilterBarContent[0];
							if (!oHorizontalLayout || oHorizontalLayout.getContent().length < 1) {
								notOk("The Smart Filter Bar was not rendered correctly");
								return;
							}

							aVerticalLayout = oHorizontalLayout.getContent();
							for (var i = 0; i < aVerticalLayout.length; i++) {
								var oVerticalLayout = aVerticalLayout[i].getContent();
								var oSearchFieldControl = oVerticalLayout[1];
								var sSearchFieldName = oSearchFieldControl.getId();
								var aStringParts = sSearchFieldName.split("-");
								sSearchFieldName = aStringParts[aStringParts.length - 1];

								if (sSearchFieldName === oItem.Field) {
									if (typeof oItem.Value === "string") {
										oSearchFieldControl.setValue(oItem.Value);
									}
									else if (typeof oItem.Value === "number") {
										oSearchFieldControl.setSelectedIndex(oItem.Value);
									}
									break;
								}
							}
						},
						errorMessage: "The Smart Filter Bar was not found"
					});
				},
				/**
				 * Switches the view based on the passed key when segmented button is used by configuring views via
				 * defaultContentView in manifest. Uses the keys of the buttons that are defined in manifest.json.
				 *
				 * @param {String} sKey Key of the button, should correspond to the key defined in manifest defaultContentView item
				 * @throws {Error} Throws an error if the segmented button is not found
				 * @public
				 **/
				iClickOnFilterSwitchButton: function(sKey) {
					var sSegmentedBtnId = ApplicationSettings.getAppParameters().ALPPrefixID + "--template::FilterSwitchButton";
					return this.waitFor({
						id: sSegmentedBtnId,
						actions: function(oSegmentedButton) {
							var aButtons = oSegmentedButton.getItems();
							for (var i = 0; i < aButtons.length; i++) {
								if (aButtons[i].getKey() == sKey) {
									if (oSegmentedButton.getSelectedKey() != sKey) {
										aButtons[i].firePress();
										aButtons[i].$().trigger('click');
										oSegmentedButton.setSelectedKey(sKey);
										oSegmentedButton.setSelectedButton(aButtons[i]);
										oSegmentedButton.fireSelect({
												button:	aButtons[i],
												id: aButtons[i].getId(),
												key: aButtons[i].getKey()
											});
										//return;
									}
									aButtons[i].focus();
									Opa5.assert.ok(true, "Segmented button clicked - " + sKey);
								}
							}
						},
						errorMessage: "Icon tab bar could not be found with, expected ID: " + sSegmentedBtnId
					});
				},

				/**
				 * Click on a link (sap.m.Link) in the AnalyticalListPage.
				 *
				 * @param {String} sText The displayed link text of the link to be clicked. The test fragment will click on all links
				 * found on the UI which contain the string sText.
				 * @throws {Error} Throws an error if the link cannot be found
				 * @public
				 **/
				iClickTheLink: function(sText) {
					return this.iClickTheLinkWithLabel(sText);
				},

				/**
				 * Click a button (sap.m.Button) which has a specific id.
				 *
 				 * @param {String} sId The id of the button as listed in the DOM. You have to pass the most right part after the "--" only.
				 * @throws {Error} Throws an error if the button is not rendered or clicked
				 * @public
				 **/
				iClickTheButtonWithId: function (sId) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = oAppParams.ALPPrefixID + "--" + sId;
					return this.iClickTheBtnWithId(sIntId);
				},

				/**
				 * Click a button (sap.m.Button) having a specific icon.
				 *
 				 * @param {String} sIcon The icon assigned to the button.
				 * @throws {Error} Throws an error if the button is not rendered or clicked
				 * @public
				 **/
				iClickTheButtonWithIcon: function (sIcon) {
					return this.iClickTheBtnWithIcon(sIcon);
				},

				/**
				 * Click a button on a dialog (sap.m.Dialog).
				 *
				 * @param {String} sText The displayed label text of the button to be clicked.
				 * @throws {Error} Throws an error if the dialog containing the button is not shown
				 * @public
				 **/
				iClickTheButtonOnTheDialogWithLabel: function (sText) {
					return this.iClickTheDialogButtonWithLabel(sText);
				},

				/**
				 * Click a button (sap.m.Button).
				 *
				 * @param {String} sLabelText The displayed label text of the button to be clicked.
				 * @throws {Error} Throws an error if the button is not rendered or clicked
				 * @public
				 **/
				iClickTheButtonHavingLabel: function (sLabelText) {
					return this.iClickTheButtonWithLabel(sLabelText);
				},

				/**
				 * Click Overflow Toolbar Button, ex: Click on + on table, click on settings/personalization button on table.
				 *
				 * @param {String} sButtonName The displayed label text of the button to be clicked.
				 * @throws {Error} Throws an error if the Overflow Toolbar Button with visible label sButtonName is not rendered/clicked
				 * @public
				 **/
				iClickTheOverflowToolbarButton: function (sButtonName) {
					return this.iSelectTheOverflowToolbarButton(sButtonName);
				},

				/**
				 * Select Item from Combo Box Dropdown, ex: Choose Item under Table Personalisation->Group->Combo Box to set the Group By.
				 *
				 * @param {String} sItem is the Item to be chosen from the Combo Box Dropdown.
				 * @throws {Error} Throws an error if the sItem could not be selected
				 * @throws {Error} Throws an error if the Combo Box is not found
				 * @public
				 **/
				iChoosetheItemInComboBox: function (sItem) {
					return this.waitFor({
						controlType: "sap.m.ComboBox",
						actions: new Press(),
						success: function(oSelect) {
							this.waitFor({
							controlType: "sap.ui.core.Item", // sap.m.ComboBox do not support sap.ui.core.ListItem
							matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: sItem
							})
							],
							actions: new Press(),
							errorMessage: "Cannot select "+sItem+" from the Combo Box"
						});
					},
					errorMessage: "Could not find the Combo Box"
			        });
				},
				/**
				 * Select a value in the visual filter chart
				 *
				 * @param {String} sChartType - Chart type of visual filter- Possible values are Bar, Line and Donut
				 * @param {String} value - Value to be selected
				 * @param {Boolean} bSearchOpenDialogs - If true, search for VF within an open dialog, false searches on the filterbar
				 * @param {String} sFieldName - Property or dimension of Visual Filter
				 * @throws {Error} Throws an error if the Visual Filter is not found / the value in the VF is not present
				 * @public
				 **/
				iSelectVFChart: function(sChartType, value, bSearchOpenDialogs, sFieldName /*optional*/) {
					return this.iSelectOrDeselectVFChart (sChartType, value, bSearchOpenDialogs, sFieldName, false);
				},
				/**
				 * Deselect a value in the visual filter chart
				 *
				 * @param {String} sChartType - Chart type of visual filter- Possible values are Bar, Line and Donut
				 * @param {String} value - Value to be selected
				 * @param {Boolean} bSearchOpenDialogs - If true, search for VF within an open dialog, false searches on the filterbar
				 * @param {String} sFieldName - Property or dimension of Visual Filter
				 * @throws {Error} Throws an error if the Visual Filter is not found or the value in the VF is not present
				 * @public
				 **/
				iDeselectVFChart: function(sChartType, value, bSearchOpenDialogs, sFieldName /*optional*/) {
					return this.iSelectOrDeselectVFChart (sChartType, value, bSearchOpenDialogs, sFieldName, true);
				},
				/**
				 * Select/Deselect a value in the visual filter chart
				 *
				 * @param {String} sChartType - Chart type of visual filter- Possible values are Bar, Line and Donut
				 * @param {String} value - Value to be selected
				 * @param {Boolean} bSearchOpenDialogs - If true, search for VF within an open dialog, false searches on the filterbar
				 * @param {String} sFieldName - Property or dimension of Visual Filter
				 * @param {Boolean} bSearchOpenDialogs - If true, deselects a value, false selects a value in the chart
				 * @throws {Error} Throws an error if the Visual Filter is not found / the value in the VF is not present
				 * @public
				 **/
				iSelectOrDeselectVFChart: function(sChartType, value, bSearchOpenDialogs, sFieldName /*optional*/, bDeselect /*optional*/) {
					var bSelect = !bDeselect;
					var sInteractiveChart;
					if (sChartType.toLowerCase() === "bar") {
						sInteractiveChart = "InteractiveBarChart";
					} else if (sChartType.toLowerCase() === "line") {
						sInteractiveChart = "InteractiveLineChart";
					} else if (sChartType.toLowerCase() === "donut") {
						sInteractiveChart = "InteractiveDonutChart";
					}
					var oSelectedAggregation = null, oCharts = null, aAggregation = null;
					return this.waitFor({
						controlType: "sap.suite.ui.microchart." + sInteractiveChart,
						searchOpenDialogs: !!bSearchOpenDialogs,
						check: function (aCharts) {
							var bSuccess = false;
							if (aCharts) {
								aCharts.forEach(function (oChart) {
									if (sFieldName && sFieldName !== oChart.getParent().getDimensionField()) {
										return;
									}
									var fGetAggregation = oChart.getBars || oChart.getPoints || oChart.getSegments,
										aChartAggregations = fGetAggregation.call(oChart);
									for (var i = 0; i < aChartAggregations.length; i++) {
										aAggregation = aChartAggregations[i];
										var CustomData = aAggregation.getCustomData()[0];
										if (CustomData.getProperty("value").toString() === value.toString()) {
											oCharts = oChart;
											oSelectedAggregation = aAggregation;
											aAggregation.setSelected(bSelect);
											bSuccess = true;
										}
									}
								});
								return bSuccess;
							}
							return false;
						},
						success: function() {
							var oSelectionChangedObject;
							if (sInteractiveChart === "InteractiveBarChart") {
								oSelectionChangedObject = {
									selectedBars: oCharts.getSelectedBars(),
									bar: oSelectedAggregation,
									selected: oSelectedAggregation.getSelected()
								}
							} else if (sInteractiveChart === "InteractiveLineChart") {
								oSelectionChangedObject = {
									selectedPoints: oCharts.getSelectedPoints(),
									point: oSelectedAggregation,
									selected: oSelectedAggregation.getSelected()
								}
							} else if (sInteractiveChart === "InteractiveDonutChart") {
								oSelectionChangedObject = {
									selectedSegments: oCharts.getSelectedSegments(),
									segment: oSelectedAggregation,
									selected: oSelectedAggregation.getSelected()
								}
							}
							//check requirement of condition
							oCharts.fireSelectionChanged(oSelectionChangedObject);
							Opa5.assert.ok(true, "Selection made");
						},
						errorMessage: "The chart selection cannot be applied"
					});
				},
                iNavigateFromListItemByLineNo: function(iIndex) {
					var sLineItemId = ApplicationSettings.getAppParameters().ALPPrefixID + "--responsiveTable";
					return this.waitFor({
						id: sLineItemId,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function(oControl) {
							var oItem = oControl.getItems()[iIndex];
				 			Opa5.assert.ok(true, "The item '" + oControl.getItems()[iIndex].getBindingContext().sPath + "' was clicked successfully");
							oItem.firePress();
						},
						errorMessage: "The Smart Table is not rendered correctly sID:" + sLineItemId
	 				});
				}
			};
		};
	}
);
