sap.ui.define([ "sap/ui/test/Opa5",
                "sap/ui/test/actions/Press",
                "sap/ui/test/matchers/AggregationFilled",
                "sap/ui/test/matchers/PropertyStrictEquals"],
	function (Opa5, Press, AggregationFilled, PropertyStrictEquals) {
		"use strict";

		return Opa5.extend("sap.suite.ui.generic.template.integration.testLibrary.utils.Common", {

			// common actions

			iClickTheBtnWithId: function(sId, sButtonText) {
			 	return this.waitFor({
			 		id: sId,
			 		success: function (oButton) {
			 			oButton.firePress();
			 			Opa5.assert.ok(true, "The button with id " + sId + " was clicked");
			 		},
			 		error: function (oButton) {
			 			if (!sButtonText) {
			 				Opa5.assert.ok(false, "The button with id " + sId + " could not be found");
			 			}
						else {
							Opa5.assert.ok(false, "The " + sButtonText + " button could not be found");
						}
			 		}
			 	});
			},

			/**
			* Select items in the ListReport by LineNumber
			*
			* @param {int array} aItemIndex An array of line numbers (0-based) to be selected
			* @throws {Error} Throws an error if the responsive table could not be found
			* @public
			*/
			iChooseListItemsByLineNo: function(sId, aItemIndex, bSelect) {
				return this.waitFor({
					id: sId,
					success: function(oSmartTableObject) {
						var oTable = (oSmartTableObject.getMetadata().getElementName() === "sap.ui.comp.smarttable.SmartTable") ? oSmartTableObject.getTable() : oSmartTableObject;

						if (bSelect === undefined) {
							bSelect = true;
						}

						switch (oTable.getMetadata().getElementName()) {
						case "sap.ui.table.Table": // Grid Table
							var oSelectionPlugin = oTable.getPlugins().filter(function(oPlugin) {
									return oPlugin.isA("sap.ui.table.plugins.SelectionPlugin");
								})[0];
							(oSelectionPlugin || oTable).setSelectionInterval(aItemIndex[0], aItemIndex[0]); // we support only one item here
							oTable.fireRowSelectionChange(aItemIndex);
							break;
						case "sap.m.Table":
							var aTableItems = oTable.getItems();
							for (var i = 0; i < aItemIndex.length; i++) {
								oTable.setSelectedItem(aTableItems[aItemIndex[i]], bSelect);
							}
							oTable.fireSelectionChange({
								listItems: 	oTable.getSelectedItems(),
								selected: bSelect
							});
							break;
						}

					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			/**
			* Select items in a table by line number interval (not for responsive table)
			*
			* @param {int iFirst} first item to select
			*        {int iLast} last item to select
			* @throws {Error} Throws an error if the table could not be found
			* @public
			*/
			iSelectItemRange: function(sId, iFirst, iLast) {
				return this.waitFor({
					id: sId,
					success: function(oSmartTableObject) {
						var oTable = (oSmartTableObject.getMetadata().getElementName() === "sap.ui.comp.smarttable.SmartTable") ? oSmartTableObject.getTable() : oSmartTableObject;
						if (oTable.getMetadata().getElementName() === "sap.m.Table") {
							Opa5.assert.ok(false, "Method not supported for Responsive Table");
							return;
						}
						var oSelectionPlugin = oTable.getPlugins().filter(function(oPlugin) {
							return oPlugin.isA("sap.ui.table.plugins.SelectionPlugin");
						})[0];
						(oSelectionPlugin || oTable).addSelectionInterval(iFirst, iLast);
						//var aItemIndex = []; //TODO
						oTable.fireRowSelectionChange();
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			/**
			* Select all items in a table (not for responsive table)
			*
			* @param
			* @throws {Error} Throws an error if the table could not be found
			* @public
			*/
			iSelectAllItems: function(sId) {
				return this.waitFor({
					id: sId,
					success: function (oSmartTableObject) {
						var oTable = (oSmartTableObject.getMetadata().getElementName() === "sap.ui.comp.smarttable.SmartTable") ? oSmartTableObject.getTable() : oSmartTableObject;
						if (oTable.getMetadata().getElementName() === "sap.m.Table") {
							Opa5.assert.ok(false, "Method not supported for Responsive Table");
							return;
						}
						var oSelectionPlugin = oTable.getPlugins().filter(function(oPlugin) {
							return oPlugin.isA("sap.ui.table.plugins.SelectionPlugin");
						})[0];
						(oSelectionPlugin || oTable).selectAll();
						//var aItemIndex = []; //TODO
						oTable.fireRowSelectionChange();
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			/**
			* Deselect all items in a table (not for responsive table)
			*
			* @param
			* @throws {Error} Throws an error if the table could not be found
			* @public
			*/
			iDeselectAllItems: function(sId) {
				return this.waitFor({
					id: sId,
					success: function (oSmartTableObject) {
						var oTable = (oSmartTableObject.getMetadata().getElementName() === "sap.ui.comp.smarttable.SmartTable") ? oSmartTableObject.getTable() : oSmartTableObject;
						if (oTable.getMetadata().getElementName() === "sap.m.Table") {
							Opa5.assert.ok(false, "Method not supported for Responsive Table");
							return;
						}
						var oSelectionPlugin = oTable.getPlugins().filter(function(oPlugin) {
							return oPlugin.isA("sap.ui.table.plugins.SelectionPlugin");
						})[0];
						(oSelectionPlugin || oTable).clearSelection();
						//var aItemIndex = [];
						oTable.fireRowSelectionChange();
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			iClickTheLnkWithId: function(sId, sLinkText) {
			 	return this.waitFor({
			 		id: sId,
			 		success: function (oLink) {
			 			oLink.firePress();
						Opa5.assert.ok(true, "The link with id " + sId + " was clicked");
			 		},
			 		error: function (oButton) {
			 			if (sLinkText) {
			 				Opa5.assert.ok(false, "The link with id " + sId + " could not be found");
			 			}
						else {
							Opa5.assert.ok(false, "The " + sLinkText + " link could not be found");
						}
			 		}
			 	});
			},

			iClickTheBtnWithIcon: function(sIcon) {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: [function(oCandidateButton) {
						return (oCandidateButton.getIcon() === sIcon);
					}],
					actions: function(oButton) {
						Opa5.assert.ok(true, "The button with icon " + sIcon + " was clicked");
			 			oButton.firePress();
					},
					errorMessage: "Did not find the button with icon " + sIcon
				});
			},

			iClickTheMultiCboBoxArrow: function(sFieldName) {
				var oIcon = null;
				return this.waitFor({
					controlType: "sap.ui.core.Icon",
					check: function(aIcons) {
						for (var i=0; i < aIcons.length; i++ ){
							if ((aIcons[i].getId().indexOf(sFieldName + "-arrow") > -1)) {
								oIcon = aIcons[i];
								return true;
							}
						}
						return false;
					},
					success: function() {
						oIcon.firePress();
						Opa5.assert.ok(true, "ComboBox icon clicked successfully");
					},
					errorMessage: "Did not find the icon for field with name " + sFieldName
				});
			},

			iSelectItemsFromMultiCboBox: function(sFieldName, sItem) {
				var oCheckBox = null;
				return this.waitFor({
					controlType: "sap.m.CheckBox",
					check: function(aCheckBox) {
						for (var i=0; i < aCheckBox.length; i++ ){
							if (aCheckBox[i].getParent() && aCheckBox[i].getParent().getParent() && aCheckBox[i].getParent().getParent().getParent() && aCheckBox[i].getParent().getParent().getParent().getParent() &&
								(aCheckBox[i].getParent().getParent().getParent().getParent().getId().indexOf(sFieldName) > -1)) {

								var sTitle = aCheckBox[i].getParent().getTitle();
								if (sTitle === sItem) {
									oCheckBox = aCheckBox[i];
									return true;
								}
							}

						}
						return false;
					},
					success: function() {
						oCheckBox.fireSelect({
							selected: true
						});
						Opa5.assert.ok(true, "The list item with label '" + sItem + "' was checked");
					},
					errorMessage: "The list item with label "+sItem+" could not be rendered/checked"
				});

			},

			iClickTheLinkWithLabel: function(sLabelText) {
			 	return this.waitFor({
					controlType: "sap.m.Link",
					matchers: [function(oCandidateLink) {
						return oCandidateLink.getText().indexOf(sLabelText) > -1;
					}],
					//actions: new Press(),

					actions: function(oControl) {
						Opa5.assert.ok(true, "The link was clicked successfully");
						oControl.firePress();
					},
					errorMessage: "Did not find the Link"
				});
			},

			iClickTheDialogButtonWithLabel: function(sLabelText) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: [
						function (oDialog) {
							var aButtons = oDialog.getButtons();
							for(var i = 0; i<aButtons.length; i++){
								var oButton = aButtons[i];
								if (oButton.getText() === sLabelText){
									oButton.firePress();
									return true;
								}
							}
							return false;
						}
					],
					success: Opa5.assert.ok(true, "The button with label '" + sLabelText + "' was clicked successfully"),
					errorMessage: "The Dialog is not rendered correctly"
				});
			},


			/**
			 * Click a button (sap.m.Button).
			 *
			 * @param {String} sLabelText The displayed label text of the button to be clicked.
			 * @throws {Error} Throws an error if the button is not rendered or clicked
			 * @public
			 **/
			iClickTheButtonWithLabel: function(sLabelText) {
				var Button = null;
				return this.waitFor({
					controlType: "sap.m.Button",
					check: function(aButtons) {
						for (var i=0; i < aButtons.length; i++ ){
							var sTitle = aButtons[i].getText();
							if (sTitle === sLabelText) {
								Button = aButtons[i];
								return true;
							}
						}
						return false;
					},
					success: function() {
						Button.firePress();
					},
					errorMessage: "The Button with label "+sLabelText+" could not be rendered/clicked"
				});
			},

			/**
			 * Click Overflow Toolbar Button, ex: Click on + on table, click on settings/personalization button on table.
			 *
			 * @param {String} sButtonName The displayed label text of the button to be clicked.
			 * @throws {Error} Throws an error if the Overflow Toolbar Button with visible label sButtonName is not rendered/clicked
			 * @public
			 **/
			iSelectTheOverflowToolbarButton: function(sButtonName) {
				var SettingsButton = null;
				return this.waitFor({
					controlType: "sap.m.OverflowToolbarButton",
					check: function(aButtons) {
						for (var i=0; i < aButtons.length; i++ ){
							var sTitle = aButtons[i].getText();
							if (sTitle === sButtonName) {
								SettingsButton = aButtons[i];
								return true;
							}
						}
						return false;
					},
					success: function() {
						SettingsButton.firePress();
					},
					errorMessage: "Did not find the "+sButtonName+" button."
				});
			},

			/**
			 * Select Item from Combo Box Dropdown, ex: Choose Item under Table Personalisation->Group->Combo Box to set the Group By.
			 *
			 * @param {String} sItem is the Item to be chosen from the Combo Box Dropdown.
			 * @throws {Error} Throws an error if the sItem could not be selected
			 * @throws {Error} Throws an error if the Combo Box is not found
			 * @public
			 **/
			iChoosetheItemFromComboBox: function(sItem) {
				var oTestOpa5TestItem=null;
				return this.waitFor({
					 	controlType: "sap.m.ComboBox",
			            actions: new Press(),
			            success: function(oSelect) {
			            	this.waitFor({
			                    controlType: "sap.m.StandardListItem", // sap.m.ComboBox do not support sap.ui.core.ListItem LR to check this case.
			                    matchers: [
			                        new PropertyStrictEquals({
			                        		name: "title",
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

			iSelectTheFirstCboBox: function() {
				return this.waitFor({
					 	controlType: "sap.m.ComboBox",
			            actions: new Press(),
			            success: function(oSelect) {
			            	Opa5.assert.ok(true, "ComboBox was clicked");
			            },
			            errorMessage: "Could not find the Combo Box"
				});
			},

			iSelectTheItemFromFirstCboBox: function(sItem) {
				return this.waitFor({
                    controlType: "sap.m.StandardListItem", // sap.m.ComboBox do not support sap.ui.core.ListItem LR to check this case.
                    matchers: [
                        new PropertyStrictEquals({
                        		name: "title",
                        		value: sItem
                        })
                    ],
                    actions: new Press(),
                    success: function(oSelect) {
		            	Opa5.assert.ok(true, "Item was selected");
		            },
                    errorMessage: "Cannot select "+sItem+" from the Combo Box"
                });
			},

			/* not yet working this way, MultiComboBox to be checked
			iChooseItmsFromMultiComboBox: function(oAppParams, sFieldName, oItems) {
				var oTestOpa5TestItem=null;
				return this.waitFor({
					 	controlType: "sap.m.MultiComboBox",
			            //actions: new Press(),
			            success: function(aControl) {

			            	this.waitFor({
			                    controlType: "sap.m.List", // sap.m.ComboBox do not support sap.ui.core.ListItem LR to check this case.
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
*/


			iClickTheCtrlWithId: function(sId) {
			 	return this.waitFor({
			 		id: sId,
			 		success: function (oControl) {
			 			oControl.firePress();
						Opa5.assert.ok(true, "The control with id " + sId + " was clicked");
			 		},
			 		error: function (oControl) {
		 				Opa5.assert.ok(false, "The Control with id " + sId + " could not be found");
			 		}
			 	});
			},


/* zu ändern:
 * über checkbox suchen: CHECKBOX.getParent().getAggregation("content")[0].getText() liefert label des zugehörigen
 * CustomListItems. Wenn richtiges gefunden, dann CheckBox klicken.
 * evtl. lable nicht mit index [0] suchen, sondern mit
 * CHECKBOX.getParent().getAggregation("content").find(function(oElement){return oElement instanceof sap.m.label})
 * suche nach instanceof im ST library coding um zu checken, wie das genau geht.
*/
			iClickTheLstItemWithLabel: function(sLabelText, bState) {
				var oCheckBox = null;
				return this.waitFor({
					controlType: "sap.m.CheckBox",
					check: function(aCheckBox) {
						for (var i=0; i < aCheckBox.length; i++ ){
							if (aCheckBox[i].getParent().getAggregation("content")) {
								var sTitle = aCheckBox[i].getParent().getAggregation("content")[0].getText();
								if (sTitle === sLabelText) {
									oCheckBox = aCheckBox[i];
									return true;
								}
							}
						}
						return false;
					},
					success: function() {
						oCheckBox.fireSelect({
							selected: bState
						});
						Opa5.assert.ok(true, "The list item with label '" + sLabelText + "' was checked");
					},
					errorMessage: "The list item with label "+sLabelText+" could not be rendered/checked"
				});
			},

			iClickTheBackBtnOnFLP: function() {
			 	return this.waitFor({
			 		id: "backBtn",
			 		success: function (oButton) {
			 			oButton.firePress();
			 			Opa5.assert.ok(true, "The back button on FioriLaunchPad was clicked successfully");
			 		},
			 		error: function (oButton) {
		 				Opa5.assert.ok(false, "The back button on FioriLaunchPad could not be found");
			 		}
			 	});
			},

			iClickOnSmVarViewSelection: function(sId) {
				return this.waitFor({
					id: sId,
					actions: new Press(),
					errorMessage: "The Smart Variant management cannot be clicked"
				});
			},



			// common assertions

			iSeeTheDialogWithTitle: function(sTitle) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: [
						function (oDialog) {
							return (oDialog.getTitle() === sTitle);
						}
					],
					success: function (oDialog) {
						Opa5.assert.ok(true, "The dialog with title '" + sTitle + "' is currently visible");
					},
					errorMessage: "The dialog with title '" + sTitle + "' is currently not visible"
				});
			},

			/**
			 * Check if currently a dialog (sap.m.Dialog) is visible.
			 *
			 * @param {String} sContent The displayed message Content of the dialog to be checked.
			 * @throws {Error} Throws an error if the dialog is not shown
			 * @public
			 **/
			iSeeTheDialogWithContent: function(sContent) {
				return this.waitFor({
					controlType: "sap.m.Text",
					searchOpenDialogs: true,
					success: function (aText) {
						var bTextMatched = false;
						aText.forEach(function (oText) {
							if (oText.getText() === sContent) {
								bTextMatched = true;
							}
						});
						Opa5.assert.ok(bTextMatched, "The dialog with Content '" + sContent + "' is currently visible");
					},
					errorMessage: "The dialog with Content '" + sContent + "' is currently not visible"
				});
			},

/*
			iSeeTheDialogWithContent: function(sContent) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: [
						function (oDialog) {
							if (typeof oDialog.getAggregation("content")[0].getText === "function") {
								return (oDialog.getAggregation("content")[0].getText() === sContent);
							} else {
								return (oDialog.getAggregation("content")[0].getAggregation("items")[0].getText() === sContent);
							}
						}
					],
					success: function (oDialog) {
						Opa5.assert.ok(true, "The dialog with Content '" + sContent + "' is currently visible");
					},
					errorMessage: "The dialog with Content '" + sContent + "' is currently not visible"
				});
			},
*/
			iSeeTheButtonOnTheDialog: function(sButton) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: [
						function (oDialog) {
							return (oDialog.getButtons()[0].getText() === sButton);
						}
					],
					success: function (oDialog) {
						Opa5.assert.ok(true, "The dialog with Button '" + sButton + "' is currently visible");
					},
					errorMessage: "The dialog with Button '" + sButton + "' is currently not visible"
				});
			},

			iSeeThePopoverWithTitle: function(sTitle) {
				return this.waitFor({
					controlType: "sap.m.Popover",
					matchers: [
						function (oPopover) {
							return (oPopover.getTitle() === sTitle);
						}
					],
					success: function (oPopover) {
						Opa5.assert.ok(true, "The popover with title '" + sTitle + "' is currently visible");
					},
					errorMessage: "The popover with title '" + sTitle + "' is currently not visible"
				});
			},

			iSeeThePopoverWithButtonLabel: function(sButtonLabel) {
				return this.waitFor({
					controlType: "sap.m.Popover",
					check: function(oPopOver) {
						var aItems = oPopOver[0].getAggregation("content")[0].getItems();
						for (var i=0; i < aItems.length; i++ ){
							if (aItems[i].getText() === sButtonLabel) {
									return true;
								}
							}
						return false;
						},
					success: function (oPopover) {
						Opa5.assert.ok(true, "The popover with Button '" + sButtonLabel + "' is currently visible");
					},
					errorMessage: "The popover with Button '" + sButtonLabel + "' is currently not visible"
				});
			},

			iSeeTheButtonWithId: function(sId) {
			 	return this.waitFor({
			 		id: sId,
			 		success: function (oButton) {
			 			Opa5.assert.ok(true, "The button with id '" + sId + "' is currently visible");
			 		},
			 		errorMessage: "The button with id " + sId + " could not be found"
			 	});
			},

			iDoNotSeeTheButtonWithIdInToolbar: function(sToolBarId, sButtonId){
				var aButtons = null;
				var bButtonVisibility = false;
				return this.waitFor({
					controlType: "sap.m.OverflowToolbar",
					id: sToolBarId,
					success: function(oToolbar) {
						aButtons = oToolbar.getContent();
						for (var i=0; i < aButtons.length; i++ ){
							if (aButtons[i].sId === sButtonId) {
								bButtonVisibility = true;
								break;
							}
						}
						if(bButtonVisibility){
							Opa5.assert.notOk(bButtonVisibility, "Button with id: "+ sButtonId.split("--")[1] + " is available");
						}
						else{
							Opa5.assert.notOk(bButtonVisibility, "Button with id: " + sButtonId.split("--")[1] + " is not available");
						}
					},
					errorMessage: "Could not find the control" + sToolBarId
				});
			},

			iSeeTheButtonWithIcon: function(sIcon) {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: [function(oCandidateButton) {
						return (oCandidateButton.getIcon() === sIcon);
					}],
					success: function(aCandidateButtons) {
						Opa5.assert.ok(true, "Found the button with icon " + sIcon);
					},
					errorMessage: "Did not find the button with icon " + sIcon
				});
			},

			iSeeTheControlWithId: function(sId) {
			 	return this.waitFor({
			 		id: sId,
			 		success: function (oControl) {
			 			Opa5.assert.ok(true, "The control with id '" + sId + "' is currently visible");
			 		},
			 		errorMessage: "The control with id " + sId + " could not be found"
			 	});
			},

			theBtnWithIdIsEnabled: function(sId, bEnabled) {
				return this.waitFor({
					autoWait: bEnabled,
					id: sId,
					matchers: [
						new PropertyStrictEquals({
							name: "enabled",
							value: bEnabled
						})
					],
					success: function (oButton) {
						if(bEnabled) {
							Opa5.assert.ok(true, "The button with id '" + sId + "' is enabled");
						} else {
							Opa5.assert.ok(true, "The button with id '" + sId + "' is disabled");
						}
					},
					errorMessage: "The button with id " + sId + " could not be found"
				});
			},

			theBtnWithLabelIsEnabled: function(sLabelText) {
				var oButton = null;
				return this.waitFor({
					controlType: "sap.m.Button",
					check: function(aButtons) {
						for (var i=0; i < aButtons.length; i++ ){
							var sTitle = aButtons[i].getText();
							if (sTitle === sLabelText) {
								oButton = aButtons[i];
								return true;
							}
						}
						return false;
					},
					success: function() {
						Opa5.assert.ok(oButton.getEnabled() === true, "The button with label '" + sLabelText + "' is enabled");
					},
					errorMessage: "The Button with label "+sLabelText+" could not be found"
				});
			},

			/**
			 *Checks if currently a button is visible
			 *
			 *@param {String} sLabel The label of the button.
			 *@throws {Error} Throws an error if the button is not rendered
			 *@public
			**/
			iSeeTheButtonWithLabel: function(sLabel) {
				return this.waitFor({
					controlType: "sap.m.Button",
					check: function(aButtons) {
						for (var i=0; i < aButtons.length; i++ ){
							var sTitle = aButtons[i].getText();
							if (sTitle === sLabel) {
								return true;
							}
						}
						return false;
					},
					success: function() {
						Opa5.assert.ok(true,"The Button with label " + sLabel + " rendered successfully");
					},
					errorMessage: "The Button with label " + sLabel + " could not be rendered"
				});
			},

			theOvflowToolBarBtnIsEnabled: function(sButtonName, bEnabled, sIntTableId) {
				var aButtons = null;
				var oButton = null;
				return this.waitFor({
					controlType: "sap.m.OverflowToolbar",
					id: sIntTableId,
					check: function(oToolbar) {
						aButtons = oToolbar.getContent();
						var sTitle = null;
						for (var i=0; i < aButtons.length; i++ ){
							if (aButtons[i].getMetadata().getName() === "sap.m.Button") {
								sTitle = aButtons[i].getText();
								if (sTitle === sButtonName) {
									oButton = aButtons[i];
									return true;
								}
							}
						}
						return false;
					},
					success: function() {
						Opa5.assert.ok(oButton.getEnabled() === bEnabled, "The button with label '" + sButtonName + "' is enabled=" + bEnabled);
					},
					errorMessage: "Did not find the "+sButtonName+" button."
				});
			},

			/**
			 * To be used only in applications running in the FlexibleClumnLayout. Checks whether the current layout type is as expected
			 *
			 *@param {sap.f.LayoutType} oLayout The layout type which is expected to be currently valid.
			 *@public
			**/
			theFCLHasLayout: function(oLayout){
				var oCurrentLayout = null;
				return this.waitFor({
					controlType: "sap.f.FlexibleColumnLayout",
					check: function(aFCL) {
						oCurrentLayout = aFCL[0].getLayout();
						return true;
					},
					success: function() {
						Opa5.assert.strictEqual(oCurrentLayout, oLayout, "The FCL layout is as expected");
					},
					errorMessage: "Did not find the FlexibleColumnLayout"
				});
			},

			iSetThePropertyValueInTable: function(sTableId, sPropertyName, sPropertyValue){
				return this.waitFor({
					controlType: "sap.m.Table",
					id: sTableId,
					success: function(oTable) {
						oTable.setProperty(sPropertyName,sPropertyValue);
						Opa5.assert.ok(true, "Property '"+sPropertyName+"' assigned a value '"+sPropertyValue+"' in table id '" +sTableId.split("--")[1]+"'")
					},
					errorMessage: "Could not find the table" + sTableId
				});
			},

			theListItemIsSelectedInTable: function(sTableId,iListItemIndex){
				return this.waitFor({
					controlType: "sap.m.Table",
					id: sTableId,
					success: function(oTable) {
						if(oTable.getItems()[iListItemIndex].mProperties.selected){
							Opa5.assert.ok(oTable.getItems()[iListItemIndex].mProperties.selected, "ListItem in table is selected")
						}
						else{
							Opa5.assert.ok(oTable.getItems()[iListItemIndex].mProperties.selected, "ListItem in table is not selected")
						}
					},
					errorMessage: "Could not find the table" + sTableId
				});
			},
			// common functions

			navigateBack: function() {
				setTimeout(function() {
					if (Opa5.getWindow() && Opa5.getWindow().history) {
						Opa5.getWindow().history.go(-1);
			 			Opa5.assert.ok(true, "One step back navigation was successful");
					}
				}, 300);
			},

			checkListReportTableTypeGridTable: function(sSmartTableObjectID) {
				return this.waitFor({
					id: sSmartTableObjectID,
					success: function(oSmartTableObject) {
						if (oSmartTableObject) {
							if (oSmartTableObject.getTable().getMetadata().getElementName() === "sap.ui.table.Table") {
								return "--GridTable";
							} else {
								return "--responsiveTable";
							}
						}
					},
					errorMessage: "Could not find object " + sSmartTableObjectID
				});
			}

		});
	}
);
