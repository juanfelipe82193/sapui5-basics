/*** Object page Actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/actions/Press", "sap/ui/test/actions/EnterText",
	 "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaResourceBundle"],

	function (PropertyStrictEquals, Press, EnterText, OpaResourceBundle) {

		return function (prefix, viewName, viewNamespace) {

			return {
				/* WAIT FOR OBJECT PAGE TO LOAD */
				iWaitForTheObjectPageToLoad: function () {
					return this.waitFor({
/*
						id: /STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product/,
						viewName: "sap.suite.ui.generic.template.ObjectPage.view.Details",
            success: function (oView) {
            }
*/
						id: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product",
						autoWait: false,
						matchers: function (oView) {
							var oComponentContainer = oView.getParent().getComponentContainer();
							var oAppComponent = oComponentContainer.getParent();
							return !oAppComponent.getBusy();
						},
						errorMessage: "Object Page not loaded"
					});
				},

				/* PRESS ON GENERIC BUTTONS */
				iClickTheBackButton: function() {
					return this.iClickTheButtonWithId(prefix + "back", "Back");
				},
				iClickTheSaveButton: function() {
					return this.iClickTheButtonWithId(prefix + "activate", "Save");
				},
				iClickTheCancelButton: function() {
					return this.iClickTheButtonWithId(prefix + "discard", "Cancel");
				},
				iClickTheDiscardButton: function() {
					return this.iClickTheButtonWithId(prefix + "DiscardDraftConfirmButton", "Discard");
				},

				/* PRESS ON BUTTONS IN THE OBJECT PAGE HEADER */
				iClickTheEditButton: function() {
					return this.iClickAButtonInTheObjectPageHeaderActions(prefix + "edit", "Edit");
				},
				iClickTheObjectPageDeleteButton: function () {
					return this.iClickAButtonInTheObjectPageHeaderActions(prefix + "delete", "Delete");
				},
				iClickAButtonInTheObjectPageHeaderActions: function (sId, sButtonText) {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageHeader",
						autoWait: false,
						success: function (aControl) {
							var aActions = aControl[0].getActions();
							for (var i = 0; i < aActions.length; i++) {
								if (aActions[i].getId() === sId) {
									aActions[i].firePress();
									return;
								}
							}
							//if not the correct action is found trigger an error
							notOk(true, "The " + sButtonText + "button could not be found");
						},
						errorMessage: "ObjectPageLayout could not be found"
					});
				},

				iEnterValueInField: function (sText, sId) {
					return this.waitFor({
						id: prefix + sId,
						viewName: viewName,
						viewNamespace: viewNamespace,
						actions: [new EnterText({ text: sText })]
				});
				},

				iOpenErrorDialog: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						id: prefix+"showMessages",
						viewName: viewName,
						viewNamespace: viewNamespace,

						success: function (oButton) {
							oButton.firePress();
						}
					});
				},
				iAddMessageToMessagePopover: function (aMessages, sDisplayMsg) {
					return this.waitFor({
						controlType: "sap.m.MessagePopover",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oMessagePopover) {
							var aMsgs = [];
							for (var i=0; i < aMessages.length; i++) {
								aMsgs.push(new sap.ui.core.message.Message(aMessages[i]));
							}
							oMessagePopover[0].oModels.msg.oMessageManager.removeAllMessages();
							oMessagePopover[0].oModels.msg.oMessageManager.addMessages(aMsgs);
							sDisplayMsg = sDisplayMsg ? sDisplayMsg : "Message Successfully Added To MessagePopover";
							ok(true, sDisplayMsg);
						},
						errorMessage: "MessagePopover not found on page"
					});
				},
				iAddValidationMessagesToMessagesDialog: function () {
					var id = prefix + "com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::MainProductCategory::Field-input";
					var sTarget;
					var oModel;
					this.waitFor({
						id: id,
						success: function (oControl) {
							sTarget = oControl.getBindingContext().getPath();
							oModel = oControl.getModel();
							var aMessages = [
								{
									message: "Select a supplier",
									type: sap.ui.core.MessageType.Error,
									target: sTarget + "/Supplier",
									description: "Supplier [SmLiQv]",
									fullTarget: sTarget + "/to_ProductTextInOriginalLang/to_Product/to_ProductTextInOriginalLang/to_Product/Supplier",
									persistent: false,
									processor: oModel
								},
								{
									message: "Check whether the price is correct",
									type: sap.ui.core.MessageType.Warning,
									target: sTarget + "/Price",
									description: "Price per Unit",
									fullTarget: sTarget + "/Price",
									persistent: false,
									processor: oModel
								}
							];
							this.iAddMessageToMessagePopover(aMessages);
						}
					});
				},

				iChangeValidationMessagesToBackendMessagesInDialog: function (aMsgType, sDisplayMsg) {
					var aMessages = [];
					for(var i=0; i< aMsgType.length; i++) {
						var oErrorMsg = {
							message: "New error Message",
							description: "",
							type: sap.ui.core.MessageType[aMsgType[i]],
							target: "/STTA_C_MP_Product",
							persistent: false
						};
						aMessages.push(oErrorMsg);
					}
					this.iAddMessageToMessagePopover(aMessages, sDisplayMsg);
				},
				/* PRESS ON BUTTONS/TABS IN THE ANCHOR BAR (e.g. "General Information", "Sales Data", "Sales Revenue", etc..) */
				iClickOnTheGeneralInformationButtonInTheAchorBar: function () {
					return this.iClickAButtonInTheAnchorBar(OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@GeneralInfoFacetLabel"));
				},
				iClickOnTheSalesDataButtonInTheAnchorBar: function () {
					return this.iClickAButtonInTheAnchorBar(OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@SalesData"));
				},
				iClickOnTheSalesRevenueButtonInTheAnchorBar: function () {
					return this.iClickAButtonInTheAnchorBar(OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@SalesRevenue"));
				},
				iClickOnTheContactsButtonInTheAnchorBar: function () {
					return this.iClickAButtonInTheAnchorBar(OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@Contacts"));
				},
				iClickOnTheExtensionSalesDataButtonInTheAnchorBar: function () {
					return this.iClickAButtonInTheAnchorBar(OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@SalesData"));
				},
				iClickAButtonInTheAnchorBar: function (sButtonText) {
					return this.waitFor({
						controlType: "sap.uxap.AnchorBar",
						viewName: viewName,
						viewNamespace: viewNamespace,
						autoWait: false,
						success: function (aControl) {
							var aAnchorBarButton = aControl[0].getContent();
							for (var i = 0; i < aAnchorBarButton.length; i++) {
								if (aAnchorBarButton[i].getText() === sButtonText) {
									if (typeof aAnchorBarButton[i].firePress === "function") {
										aAnchorBarButton[i].firePress();
									} else if (typeof aAnchorBarButton[i].fireDefaultAction === "function") {
										aAnchorBarButton[i].fireDefaultAction();
									}
									break;
								}
							}
						},
						errorMessage: "ObjectPage Anchor Bar not found"
					});
				},

				iClickASubMenuButtonInTheAnchorBar: function (sButtonText) {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: viewName,
						viewNamespace: viewNamespace,
						autoWait: false,
						success: function (aControl) {
							for (var i = 0; i < aControl.length; i++) {
								if (aControl[i].getIcon() === "sap-icon://slim-arrow-down") {
									if (aControl[i].getParent() && aControl[i].getParent().getParent() &&
										(typeof aControl[i].getParent().getParent().getText === "function") &&
										(aControl[i].getParent().getParent().getText() === sButtonText)) {
										aControl[i].firePress();
										break;
									}
								}
							}
						},
						errorMessage: "ObjectPage Anchor Bar not found"
					});
				},


				/* PRESS ON BUTTONS/TABS IN THE ANCHOR BAR POPOVER */
				iClickOnTheProductionInformationInTheAnchorBarPopover: function () {
					return this.iClickOnAnItemInsideTheAnchorBarPopover(OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductInfoFacetLabel"));
				},
				iClickOnTheProductDescriptionsAndSupplierInTheAnchorBarPopover: function () {
					return this.iClickOnAnItemInsideTheAnchorBarPopover(OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductDescriptions"));
				},
				iClickOnTheProductTextNavigationInTheAnchorBarPopover: function () {
					return this.iClickOnAnItemInsideTheAnchorBarPopover(OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductTextNavigation"));
				},
				iClickOnAnItemInsideTheAnchorBarPopover: function (sItemText) {
					return this.waitFor({
						//controlType: "sap.m.Popover",
						controlType: "sap.ui.unified.Menu",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							var aMenuItems, bFound = false;
							for (var i = 0; i < aControl.length; i++) {
								aMenuItems = aControl[i].getItems();
								for (var j = 0; j < aMenuItems.length; j++) {
									if (aMenuItems[j].getText() === sItemText) {
										aMenuItems[j].fireSelect();
										bFound = true;
										break;
									}
								}
								if (bFound) {
									break;
								}
							}
						},
						errorMessage: "ObjectPage Menu item inside Anchor Bar not found"
					});
				},

				/* CHANGE FIELD IN FIELD GROUP */
				iChangeTheFieldIntheFieldGroup: function(sFieldName, sFieldGroup, sValue) {
					return this.waitFor({
						id: prefix + "com.sap.vocabularies.UI.v1.FieldGroup::" + sFieldGroup + "::" + sFieldName + "::Field",
						actions: new EnterText({
							text: sValue
						}),
						errorMessage: "The field " + sFieldName + " is not rendered correctly"
					});
				},

				/* WAIT FOR DELETE DIALOG */
				iWaitForADialogAndPressTheConfirmationButton: function () {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Delete"
						}),
						actions: function(oDeleteConfirmationButton) {
							oDeleteConfirmationButton.firePress();
						},
						errorMessage: "Delete Dialog not rendered correctly"
					});
				},

				iWaitForADialogAndPressCancelButton: function () {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Cancel"
						}),
						actions: function(oButton) {
							oButton.firePress();
						},
						errorMessage: "Dialog or the Button is not rendered correctly"
					});
				},

				iClickSave: function () {
					return this.waitFor ({
						controlType: "sap.m.Button",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Save"
						}),
						actions: function(oButton) {
							oButton.firePress();
						},
						errorMessage: "Save Button not rendered correctly"
					});
				},

				/* PRESS ON CONTACT LINK */
				iClickOnAContactLink: function (sName) {
					return this.waitFor({
						controlType: "sap.m.Link",
						autoWait: false,
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: sName
							}),
							function (oLink) {
								return oLink.hasStyleClass("sapSmartTemplatesObjectPageContactsListContactTitle");
							}
						],
						viewName: viewName,
						viewNamespace: viewNamespace,
						actions: new Press(),
						errorMessage: "Contact link: '" + sName + "' not found"
					});
				},

				iClickOnALink: function (sName) {
					return this.waitFor({
						controlType: "sap.m.Link",
						autoWait: false,
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: sName
							})
						],
						success: function (oLink) {
							oLink[0].firePress();
						},
						errorMessage: "Link: '" + sName + "' not found"
					});
				},

				/* OBJECT PAGE TABLE */
				iSelectItemsInTheTable: function (aIndex) {
					return this.waitFor({
						id: prefix + "to_ProductTextNavigation::com.sap.vocabularies.UI.v1.LineItem::Table",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSmartTable) {
							var oTable = oSmartTable.getTable();
							var aItems = oTable.getItems();
							var oItem;
							for (var i = 0; i < aIndex.length; i++) {
								oItem = aItems[aIndex[i]];
								oTable.setSelectedItem(oItem);
							}
							oTable.fireSelectionChange();
						},
						errorMessage: "Table could not be found"
					});
				},

				/* OBJECT PAGE CHART */
				iSelectDataPointsOnTheChart: function () {
					return this.waitFor({
						id: prefix + "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSmartChart) {
							oSmartChart.getChartAsync().then(function(oChart){
								oChart.setSelectedDataPoints([{
									index: 8,
									measures: ["Revenue"]
								}]);
							});
						},
						errorMessage: "Chart could not be found"
					});
				},


				iScrollDownToResponsiveTable: function() {
					return this.waitFor({
						id: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product",
						autoWait: false,
						matchers: function (oView) {
						oView.getContent()[0].getScrollDelegate().scrollTo(0,1100);
						return true;
						},
						errorMessage: "Scroll bar could not be found"
					});
				},

				iExpandHeader: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						id: prefix + "template::ObjectPage::ObjectPageHeader-expandBtn",
						success: function(oExpandButton) {
							oExpandButton.firePress();
						},
						errorMessage: "Expand Button could not be found"
					});
				},

				iCollapseHeader: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						id: prefix + "objectPage-OPHeaderContent-collapseBtn",
						success: function(oCollapseButton) {
							oCollapseButton.firePress();
						},
						errorMessage: "Collapse Button could not be found"
					});
				},

				iClickOnNthMessageInMessagePopover : function(position) {
					return this.waitFor({
						controlType: "sap.m.MessagePopover",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oMessagePopover) {
							var aItems = oMessagePopover[0].getAggregation("items");
							if (aItems && aItems.length) {
								if (aItems[position - 1] && aItems[position - 1].getActiveTitle()) {
									var title = aItems[position - 1].getTitle();
									this.iClickOnALink(title);
								}
								else {
									notOk(true, "Message not clickable");
								}
							}
						},
						errorMessage: "Message Popover not found on page"
					});
				},

				iCloseMessagePopover: function () {
					return this.waitFor({
						controlType: "sap.m.MessagePopover",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oMessagePopover) {
							oMessagePopover[0].close();
							ok(true, "Message popover closed");
						},
						errorMessage: "MessagePopover not found on page"
					});
				}
			};
		};
	}
);
