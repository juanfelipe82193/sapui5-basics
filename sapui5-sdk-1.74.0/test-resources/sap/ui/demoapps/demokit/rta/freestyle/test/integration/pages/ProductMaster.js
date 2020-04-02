sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/Common",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/Properties"
], function(
	Opa5,
	Common,
	Press,
	EnterText,
	AggregationFilled,
	Properties
) {
	"use strict";

	var sFirstObjectTitle;
	var sViewName = "ProductMaster";

	Opa5.createPageObjects({
		onS2ProductMasterPage: {
			baseClass: Common,
			actions: {

				iClickMultiSelect: function() {
					return this.waitFor({
						id: "multiSelectButton",
						viewName: "ProductMaster",

						actions: new Press(),
						errorMessage: "MultiSelect Button not Found"

					});
				},
				iOpenFilterDialog: function() {
					return this.waitFor({
						id: "filter",
						viewName: "ProductMaster",
						check: function() {
							var osortSettingsDialog = Opa5.getWindow().sap.ui.getCore().byId("filterSettingsDialog");
							// check if the dialog is still open - wait until it is closed
							// view settings dialog has no is open function and no open close events so checking the domref is the only option here
							// if there is no view settings dialog yet, there is no need to wait
							return !osortSettingsDialog || osortSettingsDialog.$().length === 0;
						},

						actions: new Press(),
						errorMessage: "Did not find the 'filter' button."
					});
				},

				iSelectAFilter: function(sItem) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.StandardListItem",
						matchers: new Opa5.matchers.PropertyStrictEquals({
							name: "title",
							value: sItem
						}),
						actions: new Press(),

						errorMessage: "Did not find the " + sItem + " element in filter dialog"
					});
				},
				iPressOKInFilterDialog: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new Opa5.matchers.PropertyStrictEquals({
							name: "text",
							value: "OK"
						}),
						actions: new Press(),

						errorMessage: "Did not find the SortDialog's 'OK' button."
					});
				},
				iSeeProductsOnMasterView: function() {
					return this.waitFor({
						id: "list",
						viewName: "ProductMaster",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oPdtList) {
							this.getContext().oPdtList = oPdtList;
							Opa5.assert.ok(oPdtList, "Found the Product List");
						},
						errorMessage: "Did not find Product list"
					});
				},
				iChooseItemFromMasterList: function(itemNumber) {
					return this.waitFor({
						id: "list",
						viewName: "ProductMaster",
						matchers: function(oList) {
							var oItem = oList.getItems()[itemNumber];
							oItem.$().trigger("tap");
							var oSelectedItem = oList.getSelectedItem();
							return oSelectedItem && oList.getItems().indexOf(oSelectedItem) === itemNumber;
						},
						success: function(oItem) {
							Opa5.assert.ok(true, "Another Prodcut is selected");
						},
						errorMessage: "The item from the master list is not selected"
					});

				},
				iWaitUntilTheItemIsSelected: function(itemNumber) {
					return this.waitFor({
						id: "list",
						viewName: "ProductMaster",
						matchers: function(oList) {
							// wait until the list has a selected item
							var oSelectedItem = oList.getSelectedItem();
							return oSelectedItem && oList.getItems().indexOf(oSelectedItem) === itemNumber;
						},
						success: function() {
							Opa5.assert.ok(true, "Prodcut is selected");
						},
						errorMessage: "The item from the master list is not selected"
					});
				},
				iGetTitleOfItem: function(itemNumber) {
					this.waitFor({
						id: "list",
						viewName: "ProductMaster",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oList) {
							this.getContext().sProductTitle = oList.getItems()[itemNumber].getTitle();
						},
						errorMessage: "Did not find product items"
					});

				},

				iSearchForTheFirstObject: function() {

					this.waitFor({
						id: "list",
						viewName: "ProductMaster",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oList) {

							sFirstObjectTitle = oList.getItems()[0].getTitle();

						},
						errorMessage: "Did not find list items while trying to search for the first item."
					});

					return this.waitFor({
						id: "searchField",
						viewName: "ProductMaster",

						actions: [new EnterText({
							text: sFirstObjectTitle
						}), new Press()],

						errorMessage: "Failed to find search field in Master view."
					});
				},
				iClearSearchField: function() {
					return this.waitFor({
						viewName: "ProductMaster",
						id: "searchField",
						actions: [new EnterText({
							text: ""
						}), new Press()],
						errorMessage: "Did not find the search field"
					});
				},

				OpenSortDialog: function() {
					return this.waitFor({
						id: "sort",
						viewName: sViewName,
						check: function() {
							var osortSettingsDialog = Opa5.getWindow().sap.ui.getCore().byId("sortSettingsDialog");
							// check if the dialog is still open - wait until it is closed
							// view settings dialog has no is open function and no open close events so checking the domref is the only option here
							// if there is no view settings dialog yet, there is no need to wait
							return !osortSettingsDialog || osortSettingsDialog.$().length === 0;
						},
						actions: new Press(),

						errorMessage: "Did not find the 'sort' button."
					});
				},
				iSelectListItemInSortDialog: function(sListItemTitle) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.StandardListItem",
						matchers: new Opa5.matchers.PropertyStrictEquals({
							name: "title",
							value: sListItemTitle
						}),
						actions: new Press(),

						errorMessage: "Did not find list item with title " + sListItemTitle + " in Sort Dialog."
					});
				},
				iPressOKInSortDialog: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new Opa5.matchers.PropertyStrictEquals({
							name: "text",
							value: "OK"
						}),
						actions: new Press(),

						errorMessage: "Did not find the SortDialog's 'OK' button."
					});
				},
				iOpenSortDialog: function() {
					return this.waitFor({
						id: "sort",
						viewName: "ProductMaster",
						check: function() {
							var oSortSettingsDialog = Opa5.getWindow().sap.ui.getCore().byId("sortSettingsDialog");
							// check if the dialog is still open - wait until it is closed
							// view settings dialog has no is open function and no open close events so checking the domref is the only option here
							// if there is no view settings dialog yet, there is no need to wait
							return !oSortSettingsDialog || oSortSettingsDialog.$().length === 0;
						},
						actions: new Press(),

						errorMessage: "Did not find the 'sort' button."
					});
				},
				iOpenGroupDialog: function() {
					return this.waitFor({
						id: "group",
						viewName: sViewName,
						check: function() {
							var ogroupSettingsDialog = Opa5.getWindow().sap.ui.getCore().byId("groupingSettingsDialog");
							// check if the dialog is still open - wait until it is closed
							// view settings dialog has no is open function and no open close events so checking the domref is the only option here
							// if there is no view settings dialog yet, there is no need to wait
							return !ogroupSettingsDialog || ogroupSettingsDialog.$().length === 0;
						},
						actions: new Press(),

						errorMessage: "Did not find the 'group' button."
					});
				},
				iSelectListItemInGroupDialog: function(sListItemTitle) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.StandardListItem",
						matchers: new Opa5.matchers.PropertyStrictEquals({
							name: "title",
							value: sListItemTitle
						}),
						actions: new Press(),

						errorMessage: "Did not find list item with title " + sListItemTitle + " in Group Dialog."
					});
				},

				iPressOKInGroupDialog: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new Opa5.matchers.PropertyStrictEquals({
							name: "text",
							value: "OK"
						}),
						actions: new Press(),

						errorMessage: "Did not find the GroupDialog's 'OK' button."
					});
				},
				iChooseItemFromMasterListWhemMultiSelectIsOn: function(itemNumber) {
					return this.waitFor({
						id: "list",
						viewName: "ProductMaster",
						matchers: function(oList) {
							var oItem = oList.getItems()[itemNumber];
							oList.setSelectedItem(oItem);
							var oSelectedItem = oList.getSelectedItem();
							return oSelectedItem && oList.getItems().indexOf(oSelectedItem) === itemNumber;
						},
						success: function() {
							Opa5.assert.ok(true, "A Prodcut is selected");
						},
						errorMessage: "The item from the master list is not selected"
					});

				}

			},

			assertions: {

				iCheckifMultiSelectIsOn: function() {
					return this.waitFor({
						id: "list",
						viewName: "ProductMaster",
						matchers: new Properties({
							mode: "MultiSelect"
						}),
						success: function() {
							Opa5.assert.ok(true, "Multi Select option is enabled");
						},
						errorMessage: "Multi select option is not enabled"
					});

				},

				iCheckMasterListHeader: function() {
					return this.waitFor({
						id: "page",
						viewName: "ProductMaster",
						matchers: function(oLH) {
							var oListTitle = oLH.getTitle();
							return oListTitle.length > 0;
						},
						success: function() {
							Opa5.assert.ok(true, "Master list header is displayed");
						},
						errorMessage: "Header of the master list is not displayed"
					});
				},

				iCheckIfSearchFieldIsEmpty: function() {
					return this.waitFor({
						viewName: "ProductMaster",
						id: "searchField",
						matchers: new Opa5.matchers.PropertyStrictEquals({
							name: "value",
							value: ""
						}),
						success: function() {
							Opa5.assert.ok(true, "Search field is empty");
						},
						errorMessage: "Did not find the search field"
					});
				},

				iCheckIfItemSearchedIsMatchingOnMasterList: function() {
					return this.waitFor({
						viewName: "ProductMaster",
						id: "list",
						success: function(oList) {
							var sFirstObjectTitleAfterSearch = oList.getItems()[0].getTitle();
							strictEqual(sFirstObjectTitleAfterSearch.trim(), sFirstObjectTitle.trim(), "Searched string is matching"); // eslint-disable-line no-undef
						}
					});
				},

				iSeeFilterBarStatus: function(status) {
					return this.waitFor({
						id: "filterBarLabel",
						viewName: "ProductMaster",
						success: function(oFilterStatus) {
							strictEqual(oFilterStatus.getText().trim(), status, "Filter label is shown"); // eslint-disable-line no-undef
						},
						errorMessage: "Did not find the expected filter status"
					});
				}
			}
		}
	});
});
