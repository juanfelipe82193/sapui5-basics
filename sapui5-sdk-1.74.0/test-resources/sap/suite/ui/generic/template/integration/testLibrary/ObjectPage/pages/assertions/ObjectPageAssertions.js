sap.ui.define([	"sap/ui/test/Opa5",
               	"sap/ui/base/Object",
               	"sap/ui/test/matchers/PropertyStrictEquals",
                "sap/ui/test/matchers/AggregationFilled",
                "sap/ui/test/actions/Press",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/Common" ],
	function(Opa5, BaseObject, PropertyStrictEquals, AggregationFilled, Press, ApplicationSettings, Common) {
		return function (sViewNameObjectPage, sViewNamespaceObjectPage) {
			return {

				/**
				* Check the header title within the ObjectPage of your application, checks in both Standard Header and Dynamic Header Cases
				*
				* @param {string} sTitle The title of the header you expect for an item loaded in the ObjectPage
				* @throws {Error} Throws an error if the expected header title was not found
				* @public
				*/
				theObjectPageHeaderTitleIsCorrect: function(sTitle) {
					var sActualHeaderText;
					return this.waitFor({
						id: new RegExp(".*(objectPageHeader|template::ObjectPage::ObjectPageDynamicHeaderTitle)$"),
						success: function(oTitle) {
							if (oTitle[0].getId().match(/template::ObjectPage::ObjectPageDynamicHeaderTitle/)!=null) {
								sActualHeaderText = oTitle[0].getText(); /*dynamic header*/
							}
							else {
								sActualHeaderText = oTitle[0].getProperty("objectTitle");	/*standard header*/
							}
							Opa5.assert.equal(sActualHeaderText,sTitle, "The Object Page header was found: " + sTitle);
						},
						error: function() {
							Opa5.assert.ok(false, "Did not find the expected title: " + sTitle);
						}
					});
				},

				/**
				* Check if the Object Page is in Edit mode. This assertion can be used for Create and Update scenarios
				* to check the status of the Object Page.
				*
				* @throws {Error} Throws an error if the Object Page is not in Edit mode
				* @public
				*/
				theObjectPageIsInEditMode: function() {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						//viewName: sViewNameObjectPage,
						//viewNamespace: sViewNamespaceObjectPage,
						matchers:[
							function(oControl) {
								return (oControl.getModel("ui").getData().editable);
							}],
						success: function() {
							Opa5.assert.ok(true, "The Object Page is in Edit mode");
						},
						errorMessage: "The Object Page is not in Edit mode"
					});
				},

				/**
				* Check if the Object Page is in Display mode. This assertion can be used for Create and Update scenarios
				* to check the status of the Object Page.
				*
				* @throws {Error} Throws an error if the Object Page is not in Display mode
				* @public
				*/
				theObjectPageIsInDisplayMode: function() {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: sViewNameObjectPage,
						viewNamespace: sViewNamespaceObjectPage,
						matchers:[
							function(oControl) {
								return (!oControl.getModel("ui").getData().editable);
							}],
						success: function() {
							Opa5.assert.ok(true, "The Object Page is in Display mode");
						},
						errorMessage: "The Object Page is not in Display mode"
					});
				},

				/**
				* Check the sections within the Object Page.
				*
				* @param {array} aSections Array of sections to be checked. You can check all or only some of the sections.
				* The sections are identified by their label, so you have to pass the i18n content of the sections within the array.
				* @throws {Error} Throws errors if a section could not be found
				* @public
				*/
				iShouldSeeTheSections: function(aSections) {
					return this.waitFor({
						timeout: 90,
						controlType: "sap.uxap.ObjectPageSection",

						success: function(aObjectPageSections) {
							var bFound = false;
							if (aObjectPageSections.length >= aSections.length) {
								Opa5.assert.ok(true, "Number of sections in the ObjectPage: " + aObjectPageSections.length + ", Number of sections to be checked: " + aSections.length);
							} else {
								Opa5.assert.ok(false, "Number of sections to be checked (" + aSections.length + ") cannot be higher than number of sections available in the ObjectPage (" + aObjectPageSections.length + ")");
							}
							for (var i = 0; i < aSections.length; i++) {
								for (var j = 0; j < aObjectPageSections.length; j++) {
									if (aObjectPageSections[j].getTitle() === aSections[i]) {
										bFound = true;
										Opa5.assert.ok(true, "Section " + aSections[i] + " found.");
										break;
									}
								}
								if (!bFound) {
									Opa5.assert.ok(false, "Section " + aSections[i] + " not found on the ObjectPage.");
								} else {
									bFound = false;
								}
							}
						},
						errorMessage: "Did not find object page section "
					});
				},

				/**
				* Check if a field exists on the ObjectPage and compare properties.
				* Example:
				* .iShouldSeeTheDataField("OpportunityID", {
				* 	Enabled   : true,
				*	Editable  : true,
				*	Mandatory : false
				* })
				*
				* @param {string} sField Name of the field from the $metadata file.
				* @param {object} oSettings Object containing properties to be checked.
				*	oSettings.Enabled (boolean): Expected setting for property Enabled (true/false)
				*	oSettings.Editable (boolean): Expected setting for property Editable (true/false)
				*	oSettings.Mandatory (boolean): Expected setting for property Mandatory (true/false)
				* @throws {Error} Throws an error if the field could not be found or if the property values are not as expected
				* @public
				*/
				iShouldSeeTheDataField: function(sField, oSettings) {
					return this.waitFor({
						id: new RegExp("::" + sField + "::Field$"),
						controlType: "sap.ui.comp.smartfield.SmartField",
						viewName: sViewNameObjectPage,
						viewNamespace: sViewNamespaceObjectPage,
						success: function(aInputs) {
							Opa5.assert.strictEqual(aInputs.length, 1, "Exactly one Input result found as expected");
							var oInput = aInputs[0];
							var oExpectedSettings = oSettings;
							if (!oExpectedSettings) {
								oExpectedSettings = {
									Enabled   : true,
									Editable  : true,
									Mandatory : false
								};
							}
							Opa5.assert.ok(true, sField + " input is shown");
							Opa5.assert.strictEqual(oInput.getEnabled(), oExpectedSettings.Enabled, sField + " Enabled State");
							Opa5.assert.strictEqual(oInput.getEditable(), oExpectedSettings.Editable, sField + " Editable State");
							Opa5.assert.strictEqual(oInput.getMandatory(), oExpectedSettings.Mandatory, sField + " Mandatory State");
						},
						errorMessage: "Did not find input " + sField
					});
				},

				/**
				* Check a field within the responsive table of the ObjectPage for correct values.
				*
				* @param {string} sTable The table containing the field which shall be checked. Please use the navigation-property of the $metadata
				* file to identify the table.
				* @param {object} oItem This object must be filled with the data needed to find the field in the table and
				* to compare the content against a given value
				* oItem.Line (int):		Line number of table containing the field to search for (0 based)
				* oItem.Field (string):	Field name
				* oItem.Value:			Expected value of field to be compared
				* @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
				* parameter when you are on a sub-ObjectPage)
				* @param {string} sTableId Depending on the way your table is defined you need to provide this parameter
				* Table has its own ID: provide the ID (e.g. definded as property in the facet annotations) and leave parameter sTable empty
				* Table does not have its own ID: leave this parameter empty and provide parameter sTable as explained above
				* Example:
				* @throws {Error} Throws an error if responsive table could not be found or if the actual value in the table
				* is not equal to the expected field value
				* @public
				*/
				theObjectPageTableFieldHasTheCorrectValue: function (sTable, oItem, sEntitySet, sTableID) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sID;
					if (sTableID && sTableID.length) {
						sID = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sTableID, sEntitySet) + "::responsiveTable";
					} else {
						sID = oAppParams.OPNavigation + ApplicationSettings.getNavigationPart(sTable, sEntitySet) + "::com.sap.vocabularies.UI.v1.LineItem::responsiveTable";
					}
					return this.waitFor({
						id: sID,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function(oControl) {
							var aTableItems = oControl.getItems();
							var nValue = aTableItems[oItem.Line].getBindingContext().getProperty(oItem.Field);
							Opa5.assert.equal(nValue, oItem.Value, "Checking field " + oItem.Field + " with value " + nValue + " in table " + sTable);
						},
						errorMessage: "The Smart Table is not rendered correctly"
	 				});
				},


				/**
				* Check a field within the ObjectPage for correct values.
				*
				* @param {object} oItem This object must be filled with the data needed to find the field on the ObjectPage and
				* to compare the content against a given value
				* oItem.Field (string):	Field name as defined in the $metadata file
				* oItem.Value:			Expected value of field to be compared
				* @throws {Error} Throws an error if the field could not be found or if the actual value
				* is not equal to the expected field value
				* @public
				*/
				theObjectPageDataFieldHasTheCorrectValue: function (oItem) {
					return this.waitFor({
						id: new RegExp("::" + oItem.Field + "::Field$"),
						controlType: "sap.ui.comp.smartfield.SmartField",
						//viewName: sViewNameObjectPage,
						//viewNamespace: sViewNamespaceObjectPage,
						success: function(aInputs) {
							//Opa5.assert.strictEqual(aInputs.length, 1, "Exactly one Input result found as expected");
							var oInput = aInputs[0];
							var sValue = oInput.getBindingContext().getProperty(oItem.Field);
							Opa5.assert.equal(sValue, oItem.Value, "Checking field " + oItem.Field + " with value " + sValue);
						},
						errorMessage: "Did not find input " + oItem.Field
					});
				},

				/**
				 * Check a field with stableId within the ObjectPage for correct values.
				 *
				 * @param {object} oItem This object must be filled with the data needed to find the field on the ObjectPage and
				 * to compare the content against a given value
				 * oItem.StableId (string): part of the stableId
				 * oItem.Field (string):	Field name as defined in the $metadata file
				 * oItem.Value:			Expected value of field to be compared
				 * @throws {Error} Throws an error if the field could not be found or if the actual value
				 * is not equal to the expected field value
				 * @public
				 */
				theObjectPageDataFieldWithStableIdHasTheCorrectValue: function (oItem) {
					return this.waitFor({
						id: new RegExp(oItem.StableId + oItem.Field),
						controlType: "sap.ui.comp.smartfield.SmartField",
						success: function(aInputs) {
							Opa5.assert.strictEqual(aInputs.length, 1, oItem.Field + "Exactly one Input result found as expected");
							var oInput = aInputs[0];
							var sValue = oInput.getValue();
							equal(sValue, oItem.Value, "Checking field " + oItem.Field + " with value \"" + sValue + "\"");
						},
						errorMessage: "Did not find input " + oItem.Field
					});
				},

				/**
				 * Check if currently a dialog (sap.m.Dialog) containing a specific title is visible.
				 *
				 * @param {String} sTitle The displayed header title of the dialog to be checked.
				 * @throws {Error} Throws an error if the dialog is not shown
				 * @public
				 **/
				iShouldSeeTheDialogWithTitle: function(sTitle) {
					return this.iSeeTheDialogWithTitle(sTitle);
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
				 * Check if currently a popover (sap.m.Popover) is visible.
				 *
				 * @param {String} sButtonlabel The displayed Button in the popover to be checked.
				 * @throws {Error} Throws an error if the popover is not shown
				 * @public
				 **/
				iShouldSeeThePopoverWithButtonLabel: function(sButtonlabel) {
					return this.iSeeThePopoverWithButtonLabel(sButtonlabel);
				},

				/**
				/**
				* Check if currently a button (sap.m.button) is visible.
				*
				* @param {String} sId The id of the button as listed in the DOM. You have to pass the most right part after the "--" only.
				* @param {string} sEntitySet The EntitySet of the currently visible UI (you only have to provide this
				* parameter when you are on a sub-ObjectPage)
				* @throws {Error} Throws an error if the button is not shown
				* @public
				**/
				iShouldSeeTheButtonWithId: function(sId, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = (sEntitySet) ? (oAppParams.OPNavigation + sEntitySet + "--" + sId) : (oAppParams.OPPrefixID + "--" + sId);
					return this.iSeeTheButtonWithId(sIntId);
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
					sToolBarId = oAppParams.OPPrefixID + "--" + sToolBarId;
					sButtonId = oAppParams.OPPrefixID + "--" + sButtonId;
					return this.iDoNotSeeTheButtonWithIdInToolbar(sToolBarId, sButtonId);
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
				iShouldSeeTheControlWithId: function(sId, sEntitySet) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = (sEntitySet) ? (oAppParams.OPNavigation + sEntitySet + "--" + sId) : (oAppParams.OPPrefixID + "--" + sId);
					return this.iSeeTheControlWithId(sIntId);
				},

				/**
				* Check by ID if a specific button is enabled or not.
				*
				* @param {String} sId The id of the button as listed in the DOM. You have to pass the most right part after the "--" only.
				* @param {Boolean} bEnabled Check if the button is enabled (true) or not enabled (false).
				* @throws {Error} Throws an error if the button could not be found
				* @public
				**/
				theButtonWithIdIsEnabled: function(sId, bEnabled) {
					var oAppParams = ApplicationSettings.getAppParameters();
					var sIntId = oAppParams.OPPrefixID + "--" + sId;
					//following check is to handle case of undefined, because when this function was created bEnabled was not passed, so there will be apps that dont send second parameter and expect the function to work for enabled buttons.
					var bBtnEnabled = true;
					if (bEnabled === false) {
						bBtnEnabled = false;
					}
					return this.theBtnWithIdIsEnabled(sIntId, bBtnEnabled);
				},

				/**
				* Check by label if a specific button is enabled or not.
				*
				* @param {String} sLabel The label of the button as shown on the UI.
				* @param {Boolean} bEnabled Check if the button is enabled (true) or not enabled (false).
				* @throws {Error} Throws an error if the button could not be found
				* @public
				**/
				theButtonWithLabelIsEnabled: function(sLabel, bEnabled) {
					return this.theBtnWithLabelIsEnabled(sLabel, bEnabled);
				},

				/**
				 *Checks if currently a button is visible
				 *
				 *@param {String} sLabel The label of the button.
				 *@throws {Error} Throws an error if the button is not rendered
				 *@public
				**/
				iShouldSeeTheButtonWithLabel: function(sLabel){
					this.iSeeTheButtonWithLabel(sLabel);
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
					var sTableId = oAppParams.OPPrefixID + "--"+ sTableId;
					return this.theListItemIsSelectedInTable(sTableId, iListItemIndex);
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
						controlType: "sap.uxap.ObjectPageLayout",  //Wait for anything on the page to avoid asynchronous execution
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

				iShouldNotSeeTheControlWithId: function (sControlId) {
		           return this.waitFor({
		                viewName: sViewNameObjectPage,
						viewNamespace: sViewNamespaceObjectPage,
		                success: function () {
						if (!sap.ui.getCore().byId(sControlId)) {
							Opa5.assert.ok(true, "The control (" + sControlId + ") is not visible");
						}
		                    
		                },
		                errorMessage: "Visibility check failed for the control with ID: "+sControlId
		            });
		        },

				/**
				 * Check if section is selected or not.
				 * Pass section id or name and if it is selected section then true,
				 * else function will fail.
				 *
				 * @param {String} sSectionText: Section name or id
				 * @param {boolean} isSectionId: Should be true if passing section id
				 * @public
				 **/
				iCheckSelectedSectionByIdOrName: function(sSectionText, isSectionId) {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						success: function(oObjectPageControl) {
							var sSelectedSectionId = oObjectPageControl[0].getSelectedSection();
							if (isSectionId) {
								Opa5.assert.equal(sSectionText, sSelectedSectionId, sSectionText + " is selected section");
								return null;
							}
							else {
								var aSections = oObjectPageControl[0].getSections();
								for (var i=0; i < aSections.length; i++) {
									if ((aSections[i].getTitle() === sSectionText) && aSections[i].getId() === sSelectedSectionId) {
										Opa5.assert.equal(sSectionText, aSections[i].getTitle(), sSectionText + " is selected section");
										return null;
									}
								}
								Opa5.assert.notOk(true, sSectionText + " is not selected section");
							}
						},
						errorMessage: "Object Page Layout not found"
					});
				},

				/**
				 * Check if focus is set on provided sId control.
				 * If focus is not set then function will fail.
				 *
				 * @param {String} sId: Id of control on which focus has to be checked
				 * @public
				 **/
				iExpectFocusSetOnControlById: function(sId) {
					var oAppParams = ApplicationSettings.getAppParameters();
					sId = oAppParams.OPPrefixID + "--" + sId;
					return this.waitFor({
						id: sId,
						success: function (oControl) {
							var focusedDomNode = document.getElementById("OpaFrame").contentWindow.document.activeElement;
							if(focusedDomNode.id === oControl.getFocusDomRef().id) {
								Opa5.assert.ok(true, "Control with id " + sId + " is focused");
							}
							else {
								Opa5.assert.notOk(true, "Control with id " + sId + " is not focused");
							}
						},
						errorMessage: "Control with id " + sId + " not found"
					});
				}
			};
		};
	}
);
