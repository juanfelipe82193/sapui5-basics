sap.ui.define([
	"sap/ui/test/Opa5", 
	"sap/suite/ui/generic/template/integration/ManageProducts/pages/Common", 
	"sap/ui/test/matchers/AggregationLengthEquals", 
	"sap/ui/test/matchers/AggregationFilled"
], function(Opa5, Common, AggregationLengthEquals, AggregationFilled) {

	"use strict";
	
	var oDraftItem;
	
	Opa5.createPageObjects({
		onTheDetailPage: {
			baseClass: Common,
			actions: {

				clickGo: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: [
									new sap.ui.test.matchers.PropertyStrictEquals({
										name: "text",
										value: "Go"
									}),

									function(oButton) {
										return oButton.getEnabled();
									}
								],
						success: function(oButton) {
							oButton[0].$().trigger("tap");

						},
						errorMessage: "Did not find Go button."
					});
				},

				clickDetail: function(iLine) {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oTable) {
							var oFirstItem = oTable[0].getItems()[iLine];
							oFirstItem.$().trigger("tap");
						},
						errorMessage: "Items not loaded."
					});
				},
				
				iWaitUntilTheBusyIndicatorIsGone : function () {
					return this.waitFor({
						id : sAppControl,
						viewName : "idAppControl",
						// inline-matcher directly as function
						matchers : function(oRootView) {
							// we set the view busy, so we need to query the parent of the app
							return oRootView.getParent().getBusy() === false;
						},
						errorMessage : "The app is still busy."
					});
				},
					
				clickItemDraft: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: [
							new AggregationFilled({
								name: "items"
							}), function(oTable) {
								var oContext;
								if (oTable.getItems()[0]) {
									oContext = oTable.getItems()[0].getBindingContext();
								}
								return !!oContext;
							}
						],
						success: function(oTable) {
							for (var i = 0; i < 100; i++) {
								var oFirstItem = oTable[0].getItems()[i].getBindingContext().getPath();
								oDraftItem = oTable[0].getItems()[i].getBindingContext().getObject(oFirstItem);
								if (oDraftItem.HasDraftEntity == false && oDraftItem.IsActiveEntity == false && oDraftItem.HasActiveEntity == true) {
									break;
								}
							}

							oFirstItem = oTable[0].getItems()[i];
							oFirstItem.$().trigger("tap");
							QUnit.ok(true, "Draft item clicked.");
							
						},
						errorMessage: "Items not loaded."
					});
				},

				clickItemForDraft: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: [
									new AggregationFilled({
										name: "items"
									}), function(oTable) {
										var oContext;
										if (oTable.getItems()[0]) {
											oContext = oTable.getItems()[0].getBindingContext();
										}
										return !!oContext;
									}
								],
						success: function(oTable) {
							var oFirstItem = oTable[0].getItems()[1].getBindingContext().getPath();
							oDraftItem = oTable[0].getItems()[1].getBindingContext().getObject(oFirstItem);
							oFirstItem = oTable[0].getItems()[1];
							oFirstItem.$().trigger("tap");
							QUnit.ok(true, "Item with draft clicked.");
						},
						errorMessage: "Items not loaded."
					});

				},

				iWaitUntilTheListIsNotVisible: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: function(oTable) {
							// visible false also returns visible controls so we need an extra check here

							if (oTable._busyTabIndices.length == 0) {
								return oTable.$().is(":visible");
							} else {
								return !oTable.$().is(":visible");
							}

						},
						errorMessage: "The Table is still visible"
					});
				},

				clickOverflow: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "id",
							value: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--objectPageHeader-overflow"
						}),

						success: function(aButtons) {
							aButtons[0].$().trigger("tap");
							QUnit.ok(true, "The Overflow button was clicked.");

						},
						errorMessage: "Did not find the Overflow button."
					});
				},

				clickEdit: function() {
					this.clickButtonInHeader("Edit");
				},

				clickDelete: function() {
					this.clickButtonInHeader("Delete");
				},

				clickConfirm: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Delete"
						}),

						success: function(aButtons) {
							aButtons[0].$().trigger("tap");
							/*
							 * aButtons[0].$().trigger("tap"); aButtons[0].$().trigger("tap");
							 */
							for (var int = 0; int < aButtons.length; int++) {
								console.log(aButtons[int].getIcon());
							}
							QUnit.ok(true, "The Confirm button was clicked.");
						},
						errorMessage: "Did not find the confirm delete button."
					});
				},

				clickFilterToRemove: function() {

					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: [
							new sap.ui.test.matchers.PropertyStrictEquals({
								name: "text",
								value: "Filters (2)"
							}),

							function(oButton) {

								return oButton.getEnabled();
							}
						],

						success: function(aButtons) {
							aButtons[0].$().trigger("tap");

						},
						errorMessage: "Did not find the Filter (1) button."
					});
				},

				clickResume: function() {

					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Resume"
						}),

						success: function(aButtons) {
							aButtons[0].$().trigger("tap");
							QUnit.ok(true, "Resume button clicked");

						},
						errorMessage: "Did not find the Resume button."
					});
				},

				clickDiscard: function() {

					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Discard"
						}),

						success: function(aButtons) {
							aButtons[0].$().trigger("tap");
							QUnit.ok(true, "Discard button clicked");

						},
						errorMessage: "Did not find the Discard button."
					});
				},

				clickBack: function() {
					var backBtn;
					return this.waitFor({

						controlType: "sap.m.Button",
						check: function(aButtons) {

							return aButtons.filter(function(oButton) {
								if (oButton.getIcon() !== "sap-icon://nav-back") {
									return false;
								}

								backBtn = oButton;
								return true;
							});
						},

						success: function(aButtons) {
							for (var int = 0; int < aButtons.length; int++) {
								console.log(aButtons[int].getIcon());
							}
							backBtn.$().trigger("tap");
							QUnit.ok(true, "Back button clicked");
						},
						errorMessage: "Did not find the Back button."
					});
				},

				clickLockedIcon: function() {
					var backBtn;
					return this.waitFor({

						controlType: "sap.m.Button",
							matchers: [
	      								function(oButton) {
										if (oButton.getIcon() == "sap-icon://locked"){
											backBtn = oButton;
											return oButton.getEnabled();
										}
	      									
									}
								],
								
						success: function(aButtons) {
							for (var int = 0; int < aButtons.length; int++) {
								console.log(aButtons[int].getIcon());
							}
							backBtn.$().trigger("tap");
							QUnit.ok(true, "Locked button clicked");

						},
						errorMessage: "Did not find the Locked button."
					});
				},

				pressEditButton: function() {
					this.clickButtonInHeader("Edit");
				},
				
				clickButtonInHeader: function (sButtonText) {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageHeader",
						success: function (aControl) {
							var aActions = aControl[0].getActions();
							var oAction;
							for (var i = 0; i < aActions.length; i++) {
								oAction = aActions[i];
								if ((oAction.getMetadata().getName() === "sap.m.Button" || oAction.getMetadata().getName() === "sap.uxap.ObjectPageHeaderActionButton") && oAction.getText() === sButtonText) {
									oAction.firePress();
									break;
								}

								if (i === aActions - 1) { // reached end of array and specified button was not found
									notOk(true, "The " + sButtonText + "button could not be found");
								}
							}
						},
						errorMessage: "ObjectPageLayout could not be found"
					});
				}
			},

			assertions: {
				checkLoadedItems: function() {
					
					return this.waitFor({
						controlType: "sap.m.Table",
						// id : "listReport",
/*
						matchers: new AggregationFilled({
							name: "items"
						}),
*/
						matchers: [
							new AggregationFilled({
								name: "items"
							}), function(oTable) {
								var oContext;
								if (oTable.getItems()[0]) {
									oContext = oTable.getItems()[0].getBindingContext();
								}
								return !!oContext;
							}
						],
						
						success: function(oTable) {
							QUnit.notEqual(oTable[0].getItems().length, 0, "Item Loaded.");
						},
						errorMessage: "Items not loaded."
					});
				},

				iShouldSeeThePageTitle: function() {
					return this.waitFor({
						controlType: "sap.m.Text",
						success: function() {
							QUnit.ok(true, "The detail page has a title.");
						},
						errorMessage: "Can't see the detail page title."
					});
				},

				thePageTitleIsCorrect: function() {
					return this.waitFor({
						controlType: "sap.m.Title",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Product"
						}),
						success: function(oTitle) {
							QUnit.ok(oTitle[0].getText() === "Product", "The Detail page title is correct.");
						},
						errorMessage: "The detail page title is incorrect."
					});
				},

				checkLockedPopup: function() {
					return this.waitFor({
						controlType: "sap.m.Title",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Locked"
						}),						
						success: function(oTitle) {
							QUnit.ok(oTitle[0].getText() === "Locked", "The locked popup title is correct.");
						},
						errorMessage: "The locked popup title is incorrect."
					});
				},
				
				theListIsDisplayed: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						// id : "listReport",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oTable) {
							QUnit.notEqual(oTable[0].getItems().length, 0, "The Detail item list is displayed.");
						},
						errorMessage: "The list is NOT displayed."
					});
				},

				itemDeleted: function() {
					return this.waitFor({
						controlType: "sap.m.Table",

						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						success: function(oTable) {
							var oFirstItem = oTable[0].getItems()[2].getBindingContext().getPath();
							var itm = oTable[0].getItems()[2].getBindingContext().getObject(oFirstItem);
							QUnit.notEqual(itm.ActiveProduct, "HT-1001", "Item deleted successfully");

						},
						errorMessage: "Item was not deleted"
					});
				},

				checkDeleteButton: function() {
					this.checkButtonInHeader("Delete", true /* enabled */);
				},

				checkCopyButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: [
						    new sap.ui.test.matchers.PropertyStrictEquals({
								name: "text",
								value: "Copy"
							}),
	
							function(oButton) {
								return oButton.getEnabled();
							}
						],
						success: function(oButton) {
							QUnit.ok(true, "The detail page has copy button.");
						},
						errorMessage: "The detail page has no copy button."
					});
				},

				checkEditButton: function() {
					this.checkButtonInHeader("Edit", true /* enabled */);
				},

/*
				checkOverflowButtonVisible: function() {
					var oMatcher;
					var bMatcher = false;
					
					oMatcher = new sap.ui.test.matchers.PropertyStrictEquals({
						name: "id",
						value: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--objectPageHeader-overflow"
					});
					
					var bEqual = oMatcher.isMatching(this.);
					
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "id",
							value: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--objectPageHeader-overflow"
						}),
						success: function(oButton) {
							bMatcher = true;
						}
					});
				},
*/
				
				checkOverflowButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "id",
							value: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--objectPageHeader-overflow"
						}),
						success: function(oButton) {
							QUnit.ok(true, "The detail page has an Overflow button.");
						},
						errorMessage: "The detail page has no Overflow button."
					});
				},
				
				checkFilterButtonToRemove: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.Properties({
							text: /Filters.*\(/
						}),
						success: function(oButton) {
							QUnit.ok(true, "The Main page has filter set button.");
						},
						errorMessage: "The Main page has no filter set button"
					});
				},

				checkConfirmDeletePopup: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Delete"
						}),
						// viewName : sViewName,
						success: function(oTitle) {
							QUnit.ok(true, "Confirm Delete dialog opened with a title");
						},
						errorMessage: "Confirm Delete dialog not opened."
					});
				},

				checkDraftFilterAdded: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.InputBase",
						success: function(oInputBase) {
							QUnit.ok(true, "DraftFilter added successfully");
							oInputBase[3].setValue(oDraftItem.ActiveProduct);

						},
						errorMessage: "DraftFilter not added sucessfully."
					});
				},
				
				checkDraftPopup: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Resume"
						}),
						success: function(oButton) {
							QUnit.ok(true, "The Draft Popup Open Successfully.");

						},
						errorMessage: "The Draft Popup is not Opened."
					});
				},
				
				checkButtonInHeader: function (sButtonText, bEnabled) {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageHeader",
						success: function (aControl) {
							var aActions = aControl[0].getActions();
							var oAction;
							for (var i = 0; i < aActions.length; i++) {
								oAction = aActions[i];
								if ((oAction.getMetadata().getName() === "sap.m.Button" || oAction.getMetadata().getName() === "sap.uxap.ObjectPageHeaderActionButton") && oAction.getText() === sButtonText) {
									QUnit.ok(true, "The detail page has " + sButtonText + " button.");
									if (bEnabled !== undefined) {
										QUnit.ok(oAction.getEnabled() === bEnabled , "The " + sButtonText + " has the property 'enabled' set to " + bEnabled + ".");
									}
									break;
								}

								if (i === aActions - 1) { // reached end of array and specified button was not found
									notOk(true, "The " + sButtonText + "button could not be found");
								}
							}
						},
						errorMessage: "ObjectPageLayout could not be found"
					});
				}
			}
		}
	});
});