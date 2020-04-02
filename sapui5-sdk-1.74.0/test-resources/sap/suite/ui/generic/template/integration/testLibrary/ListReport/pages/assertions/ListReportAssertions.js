sap.ui.define([	"sap/ui/test/Opa5",
               	"sap/ui/base/Object",
               	"sap/ui/test/matchers/PropertyStrictEquals",
                "sap/ui/test/matchers/AggregationFilled",
                "sap/ui/test/actions/Press",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/Common" ],
	function(Opa5, BaseObject, PropertyStrictEquals, AggregationFilled, Press, ApplicationSettings, Common) {
		return function (sViewNameListReport, sViewNamespaceListReport) {
			return {
				/**
				* Check if the List Report Page is displayed. This assertion can be used for navigating to List Report scenarios
				*
				* @throws {Error} Throws an error if the List Report Page is not displayed
				* @public
				*/
				theListReportPageIsVisible: function() {
					return this.waitFor({
						controlType: "sap.f.DynamicPage",
						id: ApplicationSettings.getAppParameters().LRPrefixID+"--page",
						viewName: sViewNameListReport,
						viewNamespace: sViewNamespaceListReport,

						success: function(oControl) {
							Opa5.assert.ok(true, "The List Report Page is Displayed");
						},
						errorMessage: "The List Report Page is not displayed"
					});
				},

				/**
				* Check for the visibility of the result list
				*
				* @throws {Error} Throws an error if the Smart Table could not be found
				* @public
				*/
				theResultListIsVisible: function() {
					return this.waitFor({
						controlType: "sap.ui.comp.smarttable.SmartTable",
						success: function() {
							Opa5.assert.ok(true, "The result list is shown correctly on the List Report");
						},
						errorMessage: "The Smart Table couldn´t be found on the List Report"
					});
				},

				/**
				* Check the number of items loaded in the ListReport
				*
				* @param {int} iItems The number of items you expect to be loaded in the ListReport
				* @param {string} [sTabKey] The key of the table tab in case of multiple views in the ListReport
				* @throws {Error} Throws an error if the wrong number of items are loaded or if the table could not be found
				* @public
				*/
				theResultListContainsTheCorrectNumberOfItems: function(iItems, sTabKey) {
					var oAppParams = ApplicationSettings.getAppParameters();
					return this.waitFor({
						//	check sTabKey in case of TableTabs
						id: sTabKey ? oAppParams.LRPrefixID + "--listReport" + "-" + sTabKey : oAppParams.LRPrefixID + "--listReport",
						success: function(oSmartTableObject) {
							if (oSmartTableObject) {
								switch (oSmartTableObject.getTable().getMetadata().getElementName()) {
								case "sap.m.Table":
									Opa5.assert.equal(oSmartTableObject.getTable().getItems().length, iItems, "All the " + iItems + " items are present in the result list");
								break;
								case "sap.ui.table.Table":
									Opa5.assert.equal(oSmartTableObject.getTable().getBinding().getLength(), iItems, "All the " + iItems + " items are present in the result list");
								break;
								case "sap.ui.table.AnalyticalTable":
									Opa5.assert.equal(oSmartTableObject.getTable().getBinding().getLength() - 1, iItems, "All the " + iItems + " items are present in the result list");
								break;
								}
							} else {
								Opa5.assert.ok(false, "Undefined object --listReport");
							}
						},
						errorMessage: "Could not find object --listReport containing Grid- or ResponsiveTable"
					});
				},

				// ListReport common assertion function
				iWaitForResponsiveTableInListReport: function(aMatchers, fnSuccess, sTabKey) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sTable = sTabKey ? oAppParams.LRPrefixID + "--responsiveTable-" + sTabKey : oAppParams.LRPrefixID + "--responsiveTable";
					return this.waitFor({
						id: sTable,
						viewName: sViewNameListReport,
						viewNamespace: sViewNamespaceListReport,
						matchers: aMatchers,
						success: fnSuccess,
						errorMessage: "The Responsive Table is not rendered correctly"
					});
				},

				/**
				* Check the number of items available in the ListReport
				* This function checks the available number of items shown in the header of the table
				*
				* @param {int} iItems The number of items you expect to be available in the ListReport
				* @throws {Error} Throws an error if the wrong number of items is shown or if the table could not be found
				* @public
				*/
				theAvailableNumberOfItemsIsCorrect: function(iItems) {
					var oAppParams = ApplicationSettings.getAppParameters();
					return this.waitFor({
						controlType: "sap.m.Title",
						id: oAppParams.LRPrefixID + "--listReport-header",
						success: function(oTitle) {
							var sHeaderText = oTitle.getText();
							Opa5.assert.ok((oTitle.getText().indexOf(iItems.toString()) > 0), "The number of expected items (" + iItems.toString() + ") is correct.");
						},
						errorMessage: "The header of the table with the items count could not be found."
					});


					/* TODO: check if it makes sense to get access to entityType (like in ManageProducts_New -> assertions)
					var sExpectedText = entityType["com.sap.vocabularies.UI.v1.HeaderInfo"].TypeNamePlural.String + " ({*})";
					sExpectedText = (iItems) ? sExpectedText.replace("{*}", iItems) : sExpectedText.replace("{*}", "0");

					return this.waitFor({
						id: oAppParams.LRPrefixID + "--listReport-header",
						viewName: sViewNameListReport,
						viewNamespace: sViewNamespaceListReport,
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: sExpectedText
							})
						],
						success: function(oControl) {
							Opa5.assert.ok(true, "The available number of items is correct: " + iItems);
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
					*/

				},


				/**
				* Check a field within the responsive table for correct values.
				*
				* @param {object} oItem This object must be filled with the data needed to find the field in the table and
				* to compare the content against a given value
				* oItem.Line (int):		Line number of table containing the field to search for (0 based)
				* oItem.Field (string):	Field name
				* oItem.Value:			Expected value of field to be compared
				* @param {string} [sTabKey] Key of tab in case you are using TableTabs, MultipleViews in the ListReport
				* Example: theResultListFieldHasTheCorrectValue({Line:1, Field:"GrossAmount", Value:"411.50"})
				* @throws {Error} Throws an error if responsive table could not be found or if the actual value in the table
				* is not equal to the expected field value
				* @public
				*/
				theResultListFieldHasTheCorrectValue: function (oItem, sTabKey) {
					var oAppParams = ApplicationSettings.getAppParameters();
					return this.waitFor({
						//	check sTabKey in case of TableTabs
						id: sTabKey ? oAppParams.LRPrefixID + "--listReport" + "-" + sTabKey : oAppParams.LRPrefixID + "--listReport",
						success: function(oSmartTableObject) {
							if (oSmartTableObject) {
								switch (oSmartTableObject.getTable().getMetadata().getElementName()) {
								case "sap.m.Table":
									var aTableItems = oSmartTableObject.getTable().getItems();
								break;
								case "sap.ui.table.Table":
									var aTableItems = oSmartTableObject.getTable().getRows();
								break;
								case "sap.ui.table.AnalyticalTable":
									var aTableItems = oSmartTableObject.getTable().getRows();
								break;
								}
								var nValue = aTableItems[oItem.Line].getBindingContext().getProperty(oItem.Field);
								Opa5.assert.equal(nValue, oItem.Value, "Checking field " + oItem.Field + " with value " + nValue);
							} else {
								Opa5.assert.ok(false, "Undefined object --listReport");
							}
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				},

				/**
				* Check if a field within the responsive table has the correct editing status value.
				*
				* @param {object} oInput This object must be filled with the data needed to find the field in the table and
				* to compare the content against a given value
				* oItem.Line (int):		Line number of table containing the field to search for (0 based)
				* oItem.Field (string):	Field name of the editing status field
				* oItem.Value:			Expected editing status value of field to be compared: e.g. "Draft", "Locked...", ...
				* Example: theResultListFieldHasTheCorrectObjectMarkerEditingStatus({Line:0, Field:"SalesOrder", Value:"Draft"})
				* @throws {Error} Throws an error if responsive table could not be found or if the actual value in the table
				* is not equal to the expected field value
				* @public
				*/
				theResultListFieldHasTheCorrectObjectMarkerEditingStatus: function (oInput) {
					var oAppParams = ApplicationSettings.getAppParameters();
					return this.waitFor({
						controlType: "sap.m.Table",
						viewName: sViewNameListReport,
						viewNamespace: sViewNamespaceListReport,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function(oControl) {
							var aTableItems = oControl && oControl.getItems && oControl.getItems();
							var oLine = aTableItems && aTableItems[oInput.Line];
							var aCells = oLine && oLine.getCells && oLine.getCells();
							//find the editing status column
							var sValueInEditingStatusField = oLine && oLine.getBindingContext && oLine.getBindingContext().getProperty(oInput.Field);
							var oEditingStatusColumn = undefined;
							for (var i in aCells){
								var oCell = aCells[i];
								if ((oCell && oCell.getItems && oCell.getItems()[0].getText && oCell.getItems()[0].getText() === sValueInEditingStatusField)
									|| (oCell && oCell.getItems && oCell.getItems()[0].getTitle && oCell.getItems()[0].getTitle() === sValueInEditingStatusField)) {
									oEditingStatusColumn = oCell;
									break;
								}
							}
							var aColumnItems = oEditingStatusColumn && oEditingStatusColumn.getItems && oEditingStatusColumn.getItems();
							var oObjectMarker = aColumnItems && aColumnItems[3]; //object marker is always at position 3
							var nValue = oObjectMarker && oObjectMarker.getType && oObjectMarker.getType() || "";
							Opa5.assert.equal(nValue, oInput.Value, "Checking editing status column field " + oInput.Field + " with value " + nValue);
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				},

				/**
				* Check for the visibility of the Excel export button
				*
				* @param {int}
				* @throws {Error} Throws an error if the Excel export button could not be found on the UI
				* @public
				*/
				iShouldSeeTheExcelButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: sViewNameListReport,
						viewNamespace: sViewNamespaceListReport,
						timeout: 60,
						matchers: [function(oCandidateButton) {
							return (oCandidateButton.getIcon() === "sap-icon://excel-attachment");
						}],
						success: function(aCandidateButtons) {
							Opa5.assert.ok(true, "Found the excel download button.");
						},
						errorMessage: "Did not find the excel download button "
					});
				},

				/**
				 * Check if currently a dialog (sap.m.Dialog) is visible.
				 *
				 * @param {String} sTitle The displayed header title of the dialog to be checked.
				 * @throws {Error} Throws an error if the dialog is not shown
				 * @public
				 **/
				iShouldSeeTheDialogWithTitle: function(sTitle) {
					return this.iSeeTheDialogWithTitle(sTitle);
				},

				/**
				 * Check if currently a specific button is visible on a dialog (sap.m.Dialog).
				 *
				 * @param {String} sButton The displayed button label to be checked.
				 * @throws {Error} Throws an error if the button is not shown
				 * @public
				 **/
				iShouldSeeTheButtonOnTheDialog: function(sButton) {
					return this.iSeeTheButtonOnTheDialog(sButton);
				},

				/**
				 * Check if currently a popover (sap.m.Popover) is visible.
				 *
				 * @param {String} sTitle The displayed header title of the popover to be checked.
				 * @throws {Error} Throws an error if the popover is not shown
				 * @public
				 **/
				iShouldSeeThePopoverWithTitle: function(sTitle) {
					return this.iSeeThePopoverWithTitle(sTitle);
				},

				/**
				* Check if currently a button (sap.m.button) is visible.
				*
				* @param {String} sId The id of the button as listed in the DOM. You have to pass the most right part after the "--" only.
				* @throws {Error} Throws an error if the button is not shown
				* @public
				**/
				iShouldSeeTheButtonWithId: function(sId) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = oAppParams.LRPrefixID + "--" + sId;

					return this.iSeeTheButtonWithId(sIntId);
				},

				/**
				* Check if currently a button having a specific icon is visible.
				*
				* @param {String} sIcon The icon-id of the button as listed in the DOM.
				* @throws {Error} Throws an error if the button is not shown
				* @public
				**/
				iShouldSeeTheButtonWithIcon: function(sIcon) {
					return this.iSeeTheButtonWithIcon(sIcon);
				},

				/**
				* Check if currently a control is visible.
				*
				* @param {String} sId The id of the control as listed in the DOM. You have to pass the most right part after the "--" only.
				* @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
				* parameter when you are on a sub-ObjectPage)
				* @throws {Error} Throws an error if the control is not shown
				* @public
				**/
				iShouldSeeTheControlWithId: function(sId) {
					var oAppParams = ApplicationSettings.getAppParameters();
					return this.iSeeTheControlWithId(oAppParams.LRPrefixID + "--" + sId);
				},

				/**
				* Check by passing a complete DOM Id if currently a control is visible.
				*
				* @param {String} sId The complete id of the control as listed in the DOM.
				* @throws {Error} Throws an error if the control is not shown
				* @public
				**/
				iShouldSeeTheControlWithCompleteId: function(sId) {
					return this.iSeeTheControlWithId(sId);
				},

				/**
				 * Check for the count in the IconTabBar
				 *
				 * @param {int} iTabIndex The index of the tab in the IconTabBar.
				 * @param {int} iItems Expected number of counts in the text of the IconTab.
				 * @throws {Error} Throws an error if the IconTabBar could not be found
				 * @public
				 */
				theCountInTheIconTabBarHasTheCorrectValue: function(iTabIndex, iItems) {
					return this.waitFor({
						controlType: "sap.m.IconTabBar",
						success: function(oIconTabBar) {
							var oIconTabBarItem = oIconTabBar[0].getItems()[iTabIndex - 1];
							Opa5.assert.ok((oIconTabBarItem.getText().indexOf(iItems.toString()) > 0), "The count of " + iItems.toString() + " items is displayed correctly for Icon Tab Bar Item " + iTabIndex);
						},
						errorMessage: "The IconTabBar couldn´t be found."
					});
				},

				/*
				*Checks if currently a button is visible
				*
				*@param {String} sLabel The label of the button.
				*@throws {Error} Throws an error if the button is not rendered
				*@public
				*/
				iShouldSeeTheButtonWithLabel: function(sLabel){
					this.iSeeTheButtonWithLabel(sLabel);
				},

				/*
				*Checks if currently a segmented button with specific label is visible
				*
				*@param {String} sLabel The label of the button.
				*@throws {Error} Throws an error if the segmented button is not rendered
				*@public
				*/
				iShouldSeeTheSegmentedButtonWithLabel: function(sLabel){
					return this.waitFor({
						controlType: "sap.m.SegmentedButton",
						matchers: [function(oCandidateButton) {
							var bFound = false;
							for (var i = 0; i < oCandidateButton.getItems().length; i++) {
								if (oCandidateButton.getItems()[i].getText() === sLabel) {
									bFound = true;
									break;
								}
							}
							return (bFound);
						}],
						success: function(aCandidateButtons) {
							Opa5.assert.ok(true, "The Segmented Button with label '" + sLabel + "' is shown on  the Object Page");
						},
						errorMessage: "The Segmented Button with label '" + sLabel + "' couldn´t be found on the List Report"
					});
				},

				/**
				* Check by ID if a specific button is enabled.
				*
				* @param {String} sId The id of the button as listed in the DOM. You have to pass the most right part after the "--" only.
				* @param {Boolean} bEnabled Check if the button is enabled (true) or not enabled (false).
				* @throws {Error} Throws an error if the button could not be found
				* @public
				**/
				theButtonWithIdIsEnabled: function(sId, bEnabled) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = oAppParams.LRPrefixID + "--" + sId;
					//following check is to handle case of undefined, because when this function was created bEnabled was not passed, so there will be apps that dont send second parameter and expect the function to work for enabled buttons.
					var bBtnEnabled = true;
					if (bEnabled === false) {
						bBtnEnabled = false;
					}
					return this.theBtnWithIdIsEnabled(sIntId, bBtnEnabled);
				},

				/**
				* Check by label if a specific button is enabled.
				*
				* @param {String} sLabel The label of the button as shown on the UI.
				* @throws {Error} Throws an error if the button could not be found
				* @public
				**/
				theButtonWithLabelIsEnabled: function(sLabel) {
					return this.theBtnWithLabelIsEnabled(sLabel);
				},

				/**
				* Check by label if a specific button in the Overflow Toolbar is enabled or not.
				*
				* @param {String} sLabel The label of the overflow toolbar button as shown on the UI.
				* @param {Boolean} bEnabled Check if the button is enabled (true) or not enabled (false).
				* @throws {Error} Throws an error if the button could not be found
				* @public
				**/
				theOverflowToolBarButtonIsEnabled: function(sLabel, bEnabled) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntTableId = oAppParams.LRPrefixID + "--template::ListReport::TableToolbar";

					return this.theOvflowToolBarBtnIsEnabled(sLabel, bEnabled, sIntTableId);
				},

				/**
				 /**
				 * Check if the button with provided id is not visible in the given toolbar.
				 *
				 * @param {String} sToolBarId The id of the toolbar. You have to pass the most right part after the "--" only.
				 * @param {string} sButtonId Button id with any of CRUD disabled operation. You have to pass the most right part after the "--" only.
				 * @public
				 **/
				iShouldNotSeeTheButtonWithIdInToolbar: function(sToolBarId, sButtonId){
					var oAppParams = ApplicationSettings.getAppParameters();
					sToolBarId = oAppParams.LRPrefixID + "--" + sToolBarId;
					sButtonId = oAppParams.LRPrefixID + "--" + sButtonId;
					return this.iDoNotSeeTheButtonWithIdInToolbar(sToolBarId, sButtonId);
				},

				/**
				 * Check if the message toast is shown with a correct text
				 *
				 * @param {String} sExpectedText: The text which should appear in message toast
				 * @public
				 **/
				iShouldSeeTheMessageToastWithText: function(sExpectedText) {
					var sActualToast;
					return this.waitFor({
						/**
					     	 * waitFor controlType: sap.m.MessageToast doesn't work, currently below is a workaround
				 		**/
						controlType: "sap.f.DynamicPage",  //Wait for anything on the page to avoid asynchronous execution
						success: function() {
							var bMatch=false;
							var iLength = document.getElementById("OpaFrame").contentWindow.document.getElementsByClassName("sapMMessageToast").length;
							for (var i=0; i<=iLength-1; i++) {
								if (!!iLength) {
									sActualToast = document.getElementById("OpaFrame").contentWindow.document.getElementsByClassName("sapMMessageToast")[i].innerText;
						        	bMatch= !!(sActualToast== sExpectedText);
						        }
							}
							Opa5.assert.equal(true,bMatch,"Toast is seen: "+sActualToast);
						},
						errorMessage: "Either the toast or the toast message is wrong: "+ sActualToast
					});
				},

				/**
				* Check if a specific list item is selected in a given table.
				*
				* @param {String} sTableId: The id of the table in which the ListItem property 'selected' will be checked.
				* @param {int} iListItemIndex: The index of the ListItem in table for which the property 'selected' will be checked.
				* @public
				**/
				theListItemIsSelected:function(sTableId, iListItemIndex){
					var oAppParams = ApplicationSettings.getAppParameters();
					var sTableId = oAppParams.LRPrefixID + "--"+ sTableId;
					return this.theListItemIsSelectedInTable(sTableId, iListItemIndex);
				},

				/**
				 * Check if currently a dialog (sap.m.Dialog) containing a specific content is visible.
				 *
				 * @param {String} sContent The displayed message Content of the dialog to be checked.
				 * @throws {Error} Throws an error if the dialog is not shown
				 * @public
				 **/
				iShouldSeeTheDialogWithContent: function(sContent) {
					return this.iSeeTheDialogWithContent(sContent);
				}
			};
		};
	}
);
