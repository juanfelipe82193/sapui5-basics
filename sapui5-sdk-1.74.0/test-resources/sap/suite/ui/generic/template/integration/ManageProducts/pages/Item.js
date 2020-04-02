sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/ManageProducts/pages/Common",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled"
], function(Opa5, Common, AggregationLengthEquals, AggregationFilled) {

	"use strict";

	Opa5.createPageObjects({
		onTheItemPage: {
			baseClass: Common,
			actions: {

				clickLockedIcon: function() {
					var backBtn;
					return this.waitFor({

						controlType: "sap.m.Button",
						matchers: [
							function(oButton) {
								if (oButton.getIcon() === "sap-icon://private") {
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

				clickDetail: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: [
									new AggregationFilled({
										name: "items"
									}), 
									
									function(oTable) {
										var oContext;

										if (oTable.getItems().length > 1) {
											oContext = false;
										} else {
											
											oContext = true;
										}
										return oContext;
									}

								],
						success: function(oTable) {
							var oFirstItem = oTable[0].getItems()[0];
							oFirstItem.$().trigger("tap");
						},
						errorMessage: "Items not loaded."
					});
				}
			},

			assertions: {

				iShouldSeeThePageTitle: function() {
					return this.waitFor({
						controlType: "sap.m.Text",
						success: function() {
							QUnit.ok(true, "The Item page has a title.");
						},
						errorMessage: "Can't see the Item page title."
					});
				},

				thePageTitleIsCorrect: function() {
					return this.waitFor({
						controlType: "sap.m.Text",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Product Text"
						}),
						success: function(oTitle) {
							QUnit.ok(oTitle[0].getText() === "Product Text", "The Item page title is correct.");
						},
						errorMessage: "The Item page title is incorrect."
					});
				},

				theListIsDisplayed: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: [
							new AggregationFilled({
								name: "items"
							}), 
							
							function(oTable) {
								var oContext;

								if (oTable.getItems().length > 1) {
									oContext = false;
								} else{
									
									oContext = true;
								}
								return oContext;
							}

						],
						success: function(oTable) {
							/*var oFirstItem = oTable[0].getItems()[0].getBindingContext().getPath();
							// This is to store the first sales order number and will be used for checking the filters in the below OPA tests
							firstProduct = oTable[0].getItems()[0].getBindingContext().getObject(oFirstItem);*/
							QUnit.notEqual(oTable[0].getItems().length, 0, "The Item list is displayed.");
						},
						errorMessage: "The Item list is NOT displayed."
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
				}
			}
		}
	});
});