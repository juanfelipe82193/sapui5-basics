sap.ui.define([	"sap/ui/test/Opa5",
               	"sap/ui/base/Object",
               	"sap/ui/test/matchers/PropertyStrictEquals",
                "sap/ui/test/matchers/AggregationFilled",
                "sap/ui/test/actions/Press",
                "sap/ui/test/actions/EnterText",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/Common" ],
	function(Opa5, BaseObject, PropertyStrictEquals, AggregationFilled, Press, EnterText, ApplicationSettings, Common) {
		return function (sViewNameObjectPage, sViewNamespaceObjectPage) {

			return {

				/**
				* Click on a specific line within an ObjectPage table.
				* Examples:
				* Navigate from main-ObjectPage of SaleOrder to SalesOrderItems
				* iClickTheItemInTheObjectPageTable("to_Item", 3)
				* Navigate from sub-ObjectPage of SaleOrderItems to ScheduleLines
				* iClickTheItemInTheObjectPageTable("to_SalesOrderItemSL", 0, "C_STTA_SalesOrderItem_WD_20")
				*
				* @param {string} sNavigationProperty Name of the NavigationProperty of the current EntitySet from the $metadata file.
				* This defines the target where the navigation should go to.
				* @param {int} iIndex The line number which will be used for navigation (0-based)
				* @param {string} sEntitySet The EntitySet where you navigate from (you only have to provide this
				* parameter when you navigate from a sub-ObjectPage)
				* @param {string} sTableId Depending on the way your table is defined you need to provide this parameter
				* Table has its own ID: provide the ID (e.g. definded as property in the facet annotations) and leave parameter sNavigationProperty empty
				* Table does not have its own ID: leave this parameter empty and provide parameter sNavigationProperty as explained above
				* @throws {Error} Throws an error if the responsive table could not be found
				* @public
				*/
				iNavigateFromObjectPageTableByLineNo: function(sNavigationProperty, iIndex, sEntitySet, sTableID) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sID;
					if (sTableID && sTableID.length) {
						sID = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sTableID, sEntitySet) + "::responsiveTable";
					} else {
						sID = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sNavigationProperty, sEntitySet) + "::com.sap.vocabularies.UI.v1.LineItem::responsiveTable";
					}
					return this.waitFor({
						id: sID,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function(oControl) {
							var oItem = oControl.getItems()[iIndex];
				 			Opa5.assert.ok(true, "The item '" + oControl.getItems()[iIndex].getBindingContext().sPath + "' was clicked successfully");
							oControl.fireItemPress({listItem:oItem});
						},
						errorMessage: "The Smart Table is not rendered correctly"
	 				});
				},

				/**
				* Navigate to the sub-ObjectPage of a Fiori Elements application by using a field/value combination.
				* This simulates the click on an item in a table of the ObjectPage.
				* Examples:
				* Navigate from main-ObjectPage of SaleOrder to SalesOrderItems
				* iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"50"})
				* Navigate from sub-ObjectPage of SaleOrderItems to ScheduleLines
				* iNavigateFromObjectPageTableByFieldValue("to_SalesOrderItemSL", {Field:"ScheduleLine", Value:"10"}, "C_STTA_SalesOrderItem_WD_20")
				*
				* @param {string} sNavigationProperty Name of the NavigationProperty from the metadata. This is the
				* target where the navigation should end in.
				* @param {object} oItem This object must be filled with the field/value information to locate the line in table.
				* oItem.Field (string):	The field to be checked for. Choose the name of the field as shown in the $metadata file
				* of the your odata-service.
				* oItem.Value (string): The value to be searched for.
				* @param {string} sEntitySet The EntitySet where you navigate from (you only have to provide this
				* parameter when you navigate from a sub-ObjectPage)
				* @param {string} sTableId Depending on the way your table is defined you need to provide this parameter
				* Table has its own ID: provide the ID (e.g. definded as property in the facet annotations) and leave parameter sNavigationProperty empty
				* Table does not have its own ID: leave this parameter empty and provide parameter sNavigationProperty as explained above
				* @throws {Error} Throws an error if the field/value combination could not be found in the ObjectPage table.
				* @public
				*/
				iNavigateFromObjectPageTableByFieldValue: function(sNavigationProperty, oItem, sEntitySet, sTableID) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sID;
					if (sTableID && sTableID.length) {
						sID = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sTableID, sEntitySet) + "::responsiveTable";
					} else {
						sID = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sNavigationProperty, sEntitySet) + "::com.sap.vocabularies.UI.v1.LineItem::responsiveTable";
					}
					return this.waitFor({
						id: sID,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function(oControl) {
							var oTableLine = {};
							var oTableLineItem = {};
							var sFound = false;
							var aTableLineItems = oControl.getItems();
							for (var i = 0; i < aTableLineItems.length && !sFound; i++) {
								oTableLineItem = aTableLineItems[i];
								oTableLine = oTableLineItem.getBindingContext().getObject();
								sFound = oTableLine[oItem.Field] === oItem.Value
							}

							if (sFound) {
								Opa5.assert.equal(sFound, true, "The item '" + oTableLineItem.getBindingContext().sPath + "' was clicked successfully");
								oControl.fireItemPress({listItem:oTableLineItem});
							} else {
								Opa5.assert.notOk(sFound, "The item " + oItem.Field + "=" + oItem.Value + " could not be found in the table");
							}
						},
						errorMessage: "The Smart Table is not rendered correctly"
	 				});
				},

				/**
				 * Navigate to the sub-objectPage of a Fiori Elements application by using a field/value combination.
				 * This simulates the click on an item in the ObjectPage.
				 *
				 * @param {object} oItem This object must be filled with the field/value information to locate the line in the ListReport.
				 * oItem.Field (string):	The field to be checked for. Choose the name of the field as shown in the $metadata file
				 * of the your odata-service.
				 * oItem.Value (string): The value to be searched for.
				 * @throws {Error} Throws an error if the field/value combination could not be found in the ListReport
				 * @public
				 */
				iNavigateFromOPListItemByFieldValue: function(oItem) {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						viewName: sViewNameObjectPage,
						viewNamespace: sViewNamespaceObjectPage,
						matchers: [function(oCandidateListItem) {
							var oTableLine = {};

							oTableLine = oCandidateListItem.getBindingContext().getObject();
							var sFound = false;
							for (var sName in oTableLine) {
								if ((sName === oItem.Field) && (oTableLine[sName] === oItem.Value)) {
									Opa5.assert.ok(true, "Navigate from list item '" + sName + "' with value '" + oItem.Value + "' to the Object Page");
									sFound = true;
									break;
								}
							}
							return sFound;
						}],
						actions: new Press(),
						errorMessage: "Field " + oItem.Field + " with value " + oItem.Value + " could not be located in the ListReport"
					});
				},

				/**
				* Navigate back to the previous screen (Windows back)
				*
				* @public
				*/
				iNavigateBack: function() {
					return this.waitFor({
						success: function() {
							this.navigateBack();
						}
					});
				},


/*
ID für relatead apps button:
"STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--relatedApps"

ID für relatead apps menü button:
"STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--relatedAppsButton-STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--realtedAppsSheet-0"
--> hinten wird 0-basiert durchgezählt
*/
				iNavigateToRelatedApp: function(iIndex) {
					var sRelatedAppsButtonId = ApplicationSettings.getAppParameters().OPPrefixID + "--relatedApps";
					var sRelatedAppsMenuId = sRelatedAppsButtonId + "Button-" + ApplicationSettings.getAppParameters().OPPrefixID + "--realtedAppsSheet-" + iIndex;

					return this.waitFor({
//						controlType: "sap.uxap.ObjectPageHeader",
						id: new RegExp(".*(objectPageHeader|template::ObjectPage::ObjectPageHeader)$"),
				 		success: function (aControl) {
							var aActions = aControl[0].getActions();
							for (var i = 0; i < aActions.length; i++) {
								if (aActions[i].getId() === sRelatedAppsButtonId) {
									aActions[i].firePress();

									return this.iClickTheRelatedAppMenuButton(sRelatedAppsMenuId);
								}
							}
				 		},
						errorMessage: "Did not find the related app Link"
					});
				},

				iClickTheRelatedAppMenuButton: function(sId) {
				 	return this.waitFor({
				 		id: sId,
				 		success: function (oButton) {
				 			oButton.firePress();
				 			Opa5.assert.ok(true, "The Related App link was clicked successfully");
				 		},
				 		errorMessage: "The Related App link could not be found"
				 	});
				},


				/**
				* Click the most-right breadcrumb link to navigate back to the previous screen. Keep in mind that clicking a breadcrumb link is
				* a forward navigation - it´s not the same as clicking the browser back button.
				*
				* @throws {Error} Throws an error if the ObjectPage header could not be found.
				* @public
				*/
				iClickTheLastBreadCrumbLink: function() {
				// Achtung: BreadCrumb ist vorwärts-Navigation, d.h. danach können mehrere ObjectPageHeader im Array sein, obwohl nur einer sichtbar ist
				// --> fehler beim Zugriff auf Title wg. statischen Zugriff auf das letzte Element
					return this.waitFor({
//						controlType: "sap.uxap.ObjectPageHeader",
						id: new RegExp(".*(objectPageHeader|template::ObjectPage::ObjectPageHeader)$"),
						success: function(oCandidate) {
							var oBreadCrumb = (oCandidate[oCandidate.length - 1].getBreadCrumbsLinks && oCandidate[oCandidate.length - 1].getBreadCrumbsLinks()) || (oCandidate[oCandidate.length - 1].getBreadcrumbs() && oCandidate[oCandidate.length - 1].getBreadcrumbs().getLinks());


							if (oBreadCrumb.length > 0) {
								oBreadCrumb[oBreadCrumb.length - 1].firePress();
					 			Opa5.assert.ok(true, "Breadcrumb link pressed successfully");
							} else {
								Opa5.assert.notOk(false, "Did not find a BreadCrumb link on the UI");
							}
						},
						errorMessage: "Did not find an object page header"
	 				});
				},

				/**
				* Click on the Edit button to edit an active item.
				* Precondition: The mockserver of your application has to be prepared to handle edit requests.
				*
				* @throws {Error} Throws an error if the button for editing an item could not be found on the UI
				* @public
				*/
				iClickTheEditButton: function () {
					var sEditButtonId = ApplicationSettings.getAppParameters().OPPrefixID + "--edit";
				 	return this.waitFor({
				 		/*controlType: "sap.uxap.ObjectPageHeader",*/
				 		id: new RegExp(".*(objectPageHeader|template::ObjectPage::ObjectPageHeader)$"),
				 		success: function (aControl) {
							var aActions = aControl[0].getActions();
							for (var i = 0; i < aActions.length; i++) {
								if (aActions[i].getId() === sEditButtonId) {
									aActions[i].firePress();
									Opa5.assert.ok(true, "The Edit button was clicked successfully");
									return;
								}
							}
				 		},
				 		errorMessage: "The button to edit an item could not be found"
				 	});
				},

				/**
				 * Set the property value in a given table.
				 *
				 * @param {String} sTableId: The id of the table in which the property value will be applied. You have to pass the most right part after the "--" only.
				 * @param {string} sPropertyName: Property name for which the value would be set. You have to pass the most right part after the "--" only.
				 * @param {string/int/boolean} sPropertyValue: Actual value(string, boolean, int etc..) of the property that will be passed and applied for sPropertyName.
				 * @public
				 **/
				iSetThePropertyInTable: function(sTableId, sPropertyName, sPropertyValue){
					var oAppParams = ApplicationSettings.getAppParameters();
					sTableId = oAppParams.OPPrefixID + "--" + sTableId;
					return this.iSetThePropertyValueInTable(sTableId,sPropertyName,sPropertyValue);
				},
				/**
				* Cancel a draft. This function clicks on the Cancel button in a draft object and then it commits the discard action of the popup.
				* Call this function without providing any parameters.
				*
				* @throws {Error} Throws an errors if the Cancel or Discard button could not be found
				* @public
				*/
				iCancelTheDraft: function (bNoChanges, sId) {
					var sCancelButtonId = ApplicationSettings.getAppParameters().OPPrefixID + "--discard";
					var sDiscardButtonId = ApplicationSettings.getAppParameters().OPPrefixID + "--DiscardDraftConfirmButton";

					if (!sId) {
						sId = sCancelButtonId;
					}
				 	return this.waitFor({
				 		id: sId,
				 		success: function (oButton) {
				 			oButton.firePress();
				 			if (sId === sCancelButtonId) {
								Opa5.assert.ok(true, "The Cancel button was clicked successfully");
								if (!bNoChanges) {
									this.iCancelTheDraft(false, sDiscardButtonId);
								}
				 			} else {
								Opa5.assert.ok(true, "Cancelling the draft was confirmed successfully");
				 			}
				 		},
				 		errorMessage: "The " + sId + " button could not be found"
				 	});
				},

				iSaveTheDraft: function () {
					var sSaveButtonId = ApplicationSettings.getAppParameters().OPPrefixID + "--activate";
					return this.iClickTheButtonWithId(sSaveButtonId, "Save");
				},

				/**
				 * Click on a link (sap.m.Link) in the ObjectPage.
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
				 * Click a button on a dialog (sap.m.Dialog).
				 *
				 * @param {String} sText The displayed label text of the button to be clicked.
				 * @throws {Error} Throws an error if the dialog containing the button is not shown
				 * @public
				 **/
				iClickTheButtonOnTheDialog: function (sText) {
					return this.iClickTheDialogButtonWithLabel(sText);
				},

				/**
				 * Set a field within a FieldGroup of the ObjectPage to a new value.
				 * Precondition is that the ObjectPage is in Edit mode.
				 *
				 * @param {String} sFieldGroup Name of the FieldGroup which contains the field to be changed. This is the field group name as it is defined in the
				 * target property of the faced definition of your annotations.
				 * @param {String} sFieldName Name of the field to be changed. The name of the field as defined in your metadata file.
				 * @param {String} sFieldGroupID Unique ID of the FieldGroup. If you set this parameter it will overrule the sFieldGroup defined as first parameter.
				 * In this case you should have defined a unique ID for the FieldGroup within your application.
				 * @throws {Error} Throws an error if the field could not be identified.
				 * @public
				 **/
				iSetTheObjectPageDataField: function (sFieldGroup, sFieldName, sValue, sFieldGroupID) {
					var sID;
					if (sFieldGroupID && sFieldGroupID.length) {
						sID = ApplicationSettings.getAppParameters().OPPrefixID + "--" + sFieldGroupID + "::" + sFieldName + "::Field";
					} else {
						sID = ApplicationSettings.getAppParameters().OPPrefixID + "--com.sap.vocabularies.UI.v1.FieldGroup::" + sFieldGroup + "::" + sFieldName + "::Field";
					}
					return this.waitFor({
						id: sID,
						actions: new EnterText({
							text: sValue
						}),
						success: function() {
								Opa5.assert.ok(true, "Field '" + sFieldName + "' in Field-Group '" + sFieldGroup + "' was changed successfully to new value '" + sValue + "'");
							},
						errorMessage: "The field " + sFieldName + " is not rendered correctly"
					});
				},

				/**
				 * Set an input field within the ObjectPage to a new value.
				 *
				 * @param {String} sFieldID The id of the field to be set to a new value. You have to pass the most right part after the "--" only.
				 * @param {String} sValue New value of the field.
				 * @throws {Error} Throws an error if the field could not be identified.
				 * @public
				 **/
				iSetTheInputFieldWithId: function (sFieldID, sValue) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sId = oAppParams.OPPrefixID + "--" + sFieldID;
				 	return this.waitFor({
				 		id: sId,
				 		success: function (oInput) {
				 			oInput.setValue(sValue);
				 			Opa5.assert.ok(true, "Field value " + sValue + " was set correctly");
				 		},
				 		errorMessage: "Field with ID " + sFieldID + " could not be found"
				 	});
				},

				 /**
				 * This test can be used to close the current ObjectPage. If your application runs under Flexible Column Layout the test tries to find the Close button
				 * in the ObjectPage-Header. Otherwise the test just navigates back to the previous UI by Windows/Back.
				 *
				 * @throws {Error} Throws an error if closing the ObjectPage fails.
				 * @public
				 **/
				iCloseTheObjectPage: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						/*
						viewName: sViewNameObjectPage,
						viewNamespace: sViewNamespaceObjectPage,
						*/
						check: function(aButtons) {
							//Find overflow button of ObjectPage header
							var oMoreButton;
							aButtons.forEach(function(oButton) {
								if (oButton.getId() === ApplicationSettings.getAppParameters().OPPrefixID + "--objectPageHeader-overflow" ||
										oButton.getId() === ApplicationSettings.getAppParameters().OPPrefixID + "--template::ObjectPage::ObjectPageHeader-_actionsToolbar-overflowButton") {
									oMoreButton = oButton;
								}
							});
							// If there is more button fire press event
							if (oMoreButton) {
								oMoreButton.firePress();
							}
							return true;
						},
						success: function() {
							return this.waitFor({
								controlType: "sap.m.Button",
								/*
								viewName: sViewNameObjectPage,
								viewNamespace: sViewNamespaceObjectPage,
								*/
								check: function(aInnerButtons) {
									var oCloseButton;
									var oNavBackButton;
									aInnerButtons.forEach(function(oButton) {
										if (oButton.getText() === "Close") {
											oCloseButton = oButton;
										}
										else if (oButton.getIcon()=="sap-icon://nav-back") {
											oNavBackButton = oButton;
										}
									});

									if (oCloseButton) {
										oCloseButton.firePress();
									} else if (oNavBackButton) {
										oNavBackButton.firePress();
										//this.navigateBack(); -> no browser back at this place;
									}
									else {
										this.navigateBack()
									}
									return true;
								},
								success: function() {
									Opa5.assert.ok(true, "Closing the ObjectPage was successful");
								},
								errorMessage: "Error on closing the ObjecePage or navigating back to ListReport"
							});
						},
						errorMessage: "Error on identifying overflow button"
					});
				},

				/**
				 * Click a link (sap.m.Link) which has a specific id.
				 *
 				 * @param {String} sId The id of the link as listed in the DOM. You have to pass the most right part after the "--" only.
				 * @throws {Error} Throws an error if the link is not rendered or clicked
				 * @public
				 **/
				iClickTheLinkWithId: function (sId) {
					var sLinkId = ApplicationSettings.getAppParameters().OPPrefixID + "--" + sId;
					return this.iClickTheLnkWithId(sLinkId);
				},

				/**
				 * Click a button (sap.m.Button) which has a specific id.
				 *
 				 * @param {String} sId The id of the button as listed in the DOM. You have to pass the most right part after the "--" only.
				 * @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
				 * parameter when you are on a sub-ObjectPage)
				 * @throws {Error} Throws an error if the button is not rendered or clicked
				 * @public
				 **/
				iClickTheButtonWithId: function (sId, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = (sEntitySet) ? (oAppParams.OPNavigation + sEntitySet + "--" + sId) : (oAppParams.OPPrefixID + "--" + sId);

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
					return this.iChoosetheItemFromComboBox(sItem);
				},

				/**
				 * Click a control which has a specific id.
				 *
 				 * @param {String} sId The id of the control as listed in the DOM. You have to pass the most right part after the "--" only.
				 * @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
				 * parameter when you are on a sub-ObjectPage)
				 * @throws {Error} Throws an error if the control is not rendered or clicked
				 * @public
				 **/
				iClickTheControlWithId: function (sId, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = (sEntitySet) ? (oAppParams.OPNavigation + sEntitySet + "--" + sId) : (oAppParams.OPPrefixID + "--" + sId);

					return this.iClickTheCtrlWithId(sIntId);
				},

				/**
				 * Check a list item (sap.m.CustomListItem).
				 *
				 * @param {String} sLabelText The displayed label text of the list item to be clicked.
				 * @param {String} bState CheckBox of list item should be checked (true) or unchecked (false).
				 * @throws {Error} Throws an error if the list item is not rendered or clicked
				 * @public
				 **/
				iClickTheListItemWithLabel: function (sLabelText, bState) {
					return this.iClickTheLstItemWithLabel(sLabelText, bState);
				},

				/**
				 * Click the arrow icon of a MultiComboBox to open the list of selectable items
				 *
				 * @param {String} sFieldName Name of field (as shown in the $metadata file) the MultiComboBox is assigned to
				 * @throws {Error} Throws an error if the MultiComboBox could not be found
				 * @public
				 **/
				iClickTheMultiComboBoxArrow: function (sFieldName) {
					return this.iClickTheMultiCboBoxArrow(sFieldName);
				},

				/**
				 * Select an item within a MultiComboBox item list
				 *
				 * @param {String} sFieldName Name of field (as shown in the $metadata file) the MultiComboBox is assigned to
				 * @param {String} sItem Item of the list to be selected. Choose the name of the item as it is shown on the UI.
				 * @throws {Error} Throws an error if the item could not be found in the list
				 * @public
				 **/
				iSelectItemsFromMultiComboBox: function (sFieldName, sItem) {
					return this.iSelectItemsFromMultiCboBox(sFieldName, sItem);
				},


				/**
				* Select items in ObjectPage tables by LineNumber
				*
				* @param {int array} aItemIndex An array of line numbers (0-based) to be selected
				* @param {boolean} bSelect Select (true: default) or Unselect (false) the lines
				* @param {String} sOPTableId is the part of the table's DOM id starting after --, for example "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable"
				* @throws {Error} Throws an error if the responsive table could not be found
				* @public
				*/
				iSelectListItemsByLineNo: function(aItemIndex, bSelect, sOPTableId) {
					var sPartOfId =  ApplicationSettings.getAppParameters().OPPrefixID;
					var sId = (sOPTableId) ? (sPartOfId + "--" + sOPTableId) : (sPartOfId);
					return this.iChooseListItemsByLineNo(sId, aItemIndex, bSelect);
				},

				/**
				 * Switches the view based on the passed key when segmented button is used by configuring views via
				 * quickVariantSelection.variants in manifest. Uses the keys of the buttons that are defined in manifest.json.
				 *
				 * @param {String} sKey Key of the button, should correspond to the key defined in manifest quickVariantSelection.variants item
				 * @throws {Error} Throws an error if the segmented button is not found
				 * @public
				 **/
				iClickOnSegmentedButton: function(sKey) {
					var sSegmentedBtnId = ApplicationSettings.getAppParameters().OPPrefixID + "--template:::ObjectPageTable:::SegmentedButton:::sFacet::to_Item:3a:3acom.sap.vocabularies.UI.v1.LineItem";
					return this.waitFor({
						id: sSegmentedBtnId,
						actions: function(oSegmentedButton) {
							var aButtons = oSegmentedButton.getItems();
							for (var i = 0; i < aButtons.length; i++) {
								if (aButtons[i].getKey() === sKey) {
									aButtons[i].firePress();
									return;
								}
							}
						},
						errorMessage: "Icon tab bar could not be found with, expected ID: " + sSegmentedBtnId
					});
				},

				/**
				 * Clicks on sap.uxap.ObjectPageHeaderActionButton Up or Down arrow based on sUpOrDown value.
				 *
				 * @param {String} sUpOrDown corresponds to the two possible values "NavigationUp" and "NavigationDown"
				 * @param {String} sEntitySet corresponds to the entityset in case the tests is meant for sub-object pages
				 * No need to maintain this in case if the tests are for main object page
				 * @throws {Error} Throws an error if the respective Navigation Action is not seen on the UI
				 * @public
				 **/
				iNavigateUpOrDownUsingObjectPageHeaderActionButton: function(sUpOrDown, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sNavigationActionId = (sEntitySet) ? (oAppParams.OPNavigation + sEntitySet + "--template::" + sUpOrDown) : (oAppParams.OPPrefixID + "--template::" + sUpOrDown);

					return this.waitFor({
						id: sNavigationActionId,
						controlType: "sap.uxap.ObjectPageHeaderActionButton",
						actions: function(oNavigationButton) {
							oNavigationButton.firePress();
							return;
						},
						errorMessage: "The Up or Down Navigation ObjectPageHeaderActionButton: " + sUpOrDown + " is not rendered correctly."
					});
				},

				/**
				 * Click a the back button in an application started by using Fiori-Launchpad.
				 *
				 * @throws {Error} Throws an error if the back button could not be found
				 * @public
				 **/
				iClickTheBackButtonOnFLP: function () {
					return this.iClickTheBackBtnOnFLP();
				},

				/**
				 * Select the Smart Variant View selection on Object Page tables
				 *
				 * @param {String} sSelectionButtonId: The id of the button representing the drop-down of the Smart Variant selection. You have to pass the most right part after the "--" only.
				 * @throws {Error} Throws an error if the back button could not be found
				 * @public
				 **/
				iClickOnSmartVariantViewSelection: function (sSelectionButtonId) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sId = oAppParams.OPPrefixID + "--" + sSelectionButtonId;
					return this.iClickOnSmVarViewSelection(sId);
				}


			};
		};
	}
);
