sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/ManageProducts/pages/Common",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/Properties"
], function(Opa5, Common, AggregationLengthEquals, AggregationFilled, Properties) {

	"use strict";

	var firstProduct = null;
	var oDraftItem = null;
	var colCount = null;
	var prefix = "STTA_MP::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_MP_Product--";
	var view = "ListReport";
	var viewNamespace = "sap.suite.ui.generic.template.ListReport.view.";
	
	Opa5.createPageObjects({
		onTheMainPage: {
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
						errorMessage: "Did not find the 'Start' button."
					});
				},

				clickSetting: function() {
					var SettingsButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function(aButtons) {
							for (var i=0; i < aButtons.length; i++ ){
								var sIcon = aButtons[i].getIcon();
								if (sIcon === "sap-icon://action-settings") {
									SettingsButton = aButtons[i];
									return true;
								} else if (sIcon === "sap-icon://overflow") {
									aButtons[i].firePress();
									return false;
								}
							}
							return false;
						},
						success: function() {
							SettingsButton.$().trigger("tap");
						},
						errorMessage: "Did not find the 'Setting' button."
					});
				},

				iWaitUntilTheBusyIndicatorIsGone : function() {
					return this.waitFor({
						controlType: "sap.m.Table",

						matchers: [
									new AggregationFilled({
										name: "items"
									}),

									function(oTable) {

										var oFirstItem = oTable.getItems()[0].getBindingContext().getPath();
										var itm = oTable.getItems()[0].getBindingContext().getObject(oFirstItem);
			                        	return itm.ActiveProduct === "HT-1001";
									}
								],
						errorMessage: "The Table is still visible"
					});
				},

				clickFilterToRemove: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: [
							new sap.ui.test.matchers.Properties({
								text: /Filters.*\(/
							}),
							function(oButton) {
								return oButton.getEnabled();
							}
						],
						success: function(aButtons) {
							aButtons[0].$().trigger("tap");
						},
						errorMessage: "Did not find the Filter (* button."
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

				removeFilter: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.InputBase",
						// viewName : sViewName,
						success: function(oInputBase) {
							var empty;
							oInputBase[4].setValue(empty);
						},
						errorMessage: "Filter removed sucessfully."
					});
				},

				closeDialog: function() {
					var cancelButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Cancel"
						}),
						success: function(oButton) {
							oButton[0].$().trigger("tap");
						},
						errorMessage: "Did not find the 'Setting' button."
					});
				},

				clickFilter: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: [
							function(oControl) {
								return (oControl.getText().indexOf("Filters") > -1);
							}
						],
						success: function(oButton) {
							oButton[0].$().trigger("tap");
						},
						errorMessage: "Did not find the 'Filters' button."
					});
				},

				clickFilterLink: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Link",
						success: function(oLinks) {
							oLinks[0].firePress();
						},
						errorMessage: "Did not find the 'Filters links'."
					});
				},

				selectFilter: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.CheckBox",
						success: function(oFilter) {
							oFilter[4].$().trigger("tap");
						},
						errorMessage: "Did not find the 'Filter'."
					});
				},

				selectColumns: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.CheckBox",
						success: function(oFilter) {
							oFilter[2].$().trigger("tap");
						},
						errorMessage: "Did not find the 'Filter'."
					});
				},

				clickFilterOk: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "OK"
						}),
						success: function(oButton) {
							oButton[0].$().trigger("tap");
						},
						errorMessage: "Did not find the 'Filter Ok' button."
					});
				},

				clickSettingOk: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "OK"
						}),
						success: function(oButton) {
							oButton[0].$().trigger("tap");
						},
						errorMessage: "Did not find the 'Filter Ok' button."
					});
				},

				clickFilterGo: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Go"
						}),
						success: function(oButton) {
							oButton[0].$().trigger("tap");
						},
						errorMessage: "Did not find the 'Filters Go'."
					});
				},

				clickCheckBox: function(){
					return this.waitFor({
						controlType: "sap.m.CheckBox",
						success: function(aButtons){
							aButtons[5].$().trigger("tap");
						},
						errorMessage: "Did not find the radio button"
					});
				}
			},

			assertions: {
				// main table on the List Report
				iShouldSeeTheTable: function() {
					return this.waitFor({
						id: prefix + "listReport",
						viewName: view,
						viewNamespace: viewNamespace,
						success: function() {
							QUnit.ok(true, "The main page has a table.");
						},
						errorMessage: "Can't see the main page table."
					});
				},

				checkGoButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Go"
						}),
						success: function(oButton1) {
							QUnit.ok(true, "The page has a Go button.");
						},
						errorMessage: "The page has no Go button."
					});
				},

				checkFilterButtonToRemove: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.Properties({
							name: "text",
							value: /Filters/
						}),
						success: function(oButton) {
							QUnit.ok(true, "The Main page has filter set button.");
						},
						errorMessage: "The Main page has no filter set button"
					});
				},

				checkAddButton: function() {
					var addButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function(aButtons) {
							return aButtons.filter(function(oButton) {
								if (oButton.getIcon() !== "sap-icon://add") {
									return false;
								}

								addButton = oButton;
								return true;
							});
						},

						success: function(aButtons) {
							QUnit.ok(true, "The page has a add button.");
							for (var int = 0; int < aButtons.length; int++) {
								console.log(aButtons[int].getIcon());
							}
						},
						errorMessage: "The page has no add button."
					});
				},

				checkHideFilterButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Hide Filter Bar"
						}),
						success: function(oButton2) {
							QUnit.ok(true, "The page has a Hide Filter Bar button.");
						},
						errorMessage: "The page has no Hide Filter Bar button."
					});
				},

				checkFilterButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.Properties({
							text: /Adapt Filters/
						}),
						success: function(oButton2) {
							QUnit.ok(true, "The page has a Filters button.");
						},
						errorMessage: "The page has no Filters button."
					});
				},

				checkChangePrice: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Change price"
						}),
						autoWait: false,
						success: function(oButton2) {
							QUnit.ok(true, "The page has a Change Price button.");
						},
						errorMessage: "The page has no Change Price button."
					});
				},

				checkCopyWithSupplier: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Copy with new Supplier"
						}),
						success: function(oButton2) {
							QUnit.ok(true, "The page has a Copy with new supplier button.");
						},
						errorMessage: "The page has no Copy with new supplier button."
					});
				},

				checkActivate: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Activate"
						}),
						autoWait: false,
						success: function(oButton2) {
							QUnit.ok(true, "The page has a Activate button.");
						},
						errorMessage: "The page has no Activate button."
					});
				},

				checkValidate: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Validate"
						}),
						success: function(oButton2) {
							QUnit.ok(true, "The page has a Validate button.");
						},
						errorMessage: "The page has no Validate button."
					});
				},

				checkCopy: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Copy"
						}),
						success: function(oButton2) {
							QUnit.ok(true, "The page has a Copy button.");
						},
						errorMessage: "The page has no Copy button."
					});
				},

				checkSettingButton: function() {
					var SettingsButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function(aButtons) {
							return aButtons.filter(function(oButton) {
								if (oButton.getIcon() !== "sap-icon://action-settings") {
									return false;
								}
								SettingsButton = oButton;
								return true;
							});
						},
						success: function() {
							QUnit.ok(true, "The page has a setting button.");
						},
						errorMessage: "The page has no setting button."
					});
				},

				checkExportButton: function() {
					var ExportButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function(aButtons) {
							return aButtons.filter(function(oButton) {
								if (oButton.getIcon() !== "sap-icon://excel-attachment") {
									return false;
								}
								ExportButton = oButton;
								return true;
							});
						},
						success: function() {
							QUnit.ok(true, "The page has a excel export button.");
						},
						errorMessage: "The page has no excel export button."
					});
				},
				
				checkNoExportButton: function() {
					var ExportButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function(aButtons) {
							aButtons = aButtons.filter(function(oButton) {
								if (oButton.getIcon() !== "sap-icon://excel-attachment") {
									return false;
								}
								ExportButton = oButton;
								return true;
							});
							if (aButtons.length === 0) {
							    return true;
							} else {
							    return false;
							}
						},
						success: function() {
							QUnit.ok(true, "The page has no excel export button.");
						},
						errorMessage: "The page has an excel export button."
					});
				},

				dialogOpen: function() {
					return this.waitFor({
						controlType: "sap.m.Title",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "View Settings"
						}),
						success: function(oTitle) {
							QUnit.ok(true, "Setting Dialog opened with a title");
						},
						errorMessage: "Setting Dialog not opened with a title."
					});
				},

				dialogTitle: function() {
					return this.waitFor({
						controlType: "sap.m.Title",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "View Settings"
						}),
						success: function(oTitle) {
							QUnit.ok(oTitle[0].getText() === "View Settings", "The page title is correct.");
						},
						errorMessage: "Setting Dialog page title is incorrect"
					});
				},

				theListIsDisplayed: function() {
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
							var oFirstItem = oTable[0].getItems()[4].getBindingContext().getPath();
							// This is to store the first sales order number and will be used for checking the filters in the below OPA tests
							firstProduct = oTable[0].getItems()[4].getBindingContext().getObject(oFirstItem);
							QUnit.notEqual(oTable[0].getItems().length, 0, "The list is displayed.");
						},
						errorMessage: "The list is NOT displayed."
					});
				},

				checkFilterRemoved: function() {
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
							var oFirstItem = oTable[0].getItems()[0].getBindingContext().getPath();
							// This is to store the first sales order number and will be used for checking the filters in the below OPA tests
							firstProduct = oTable[0].getItems()[0].getBindingContext().getObject(oFirstItem);
							QUnit.ok(oTable[0].getItems().length > 1, "The filter removed successfully");
						},
						errorMessage: "Filter is not removed"
					});
				},

				checkFilterPopup: function(sFilterLiteral) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Title",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: sFilterLiteral
						}),
						success: function(oTitle) {
							QUnit.ok(true, "Filter Dialog opened with a title");
						},
						errorMessage: "Filter Dialog not opened with a title."
					});
				},

				selectFilterPopupTitleCorrect: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Title",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Select Filters"
						}),
						success: function(oTitle) {
							QUnit.ok(true, "Select Filter Dialog opened with a title");
						},
						errorMessage: "Select Filter Dialog not opened with a title."
					});
				},

				checkFilterAdded: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.InputBase",
						success: function(oInputBase) {
							QUnit.ok(true, "Filter added successfully");
							oInputBase[4].setValue(firstProduct.Product);
						},
						errorMessage: "Filter not added sucessfully."
					});
				},

				checkDraftItem: function() {
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
							var oDraftItemFound;
							for (var i = 0; i < 100; i++) {
								var oFirstItem = oTable[0].getItems()[i].getBindingContext().getPath();
								oDraftItem = oTable[0].getItems()[i].getBindingContext().getObject(oFirstItem);
								if (oDraftItem.HasDraftEntity == true && oDraftItem.IsActiveEntity == true) {
									oDraftItemFound = true;
									break;
								}
							}
							QUnit.notEqual(oDraftItemFound, false, "The list has draft item");
						},
						errorMessage: "The list has no draft item"
					});
				},

				checkDraftItemDiscarded: function() {
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
							if (oTable[0].getItems().length == 1) {
								var oDraftItemFound;
								for (var i = 0; i < 100; i++) {
									var oFirstItem = oTable[0].getItems()[i].getBindingContext().getPath();
									oDraftItem = oTable[0].getItems()[i].getBindingContext().getObject(oFirstItem);
									if (oDraftItem.HasDraftEntity == true && oDraftItem.IsActiveEntity == true) {
										oDraftItemFound = false;
										break;
									}
								}
							}
							QUnit.notEqual(oDraftItemFound, true, "Draft Item Discarded successfully");
						},
						errorMessage: "The list has no draft item"
					});
				},

				checkTableEntriesDraft: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oTable) {
							QUnit.equal(oTable[0].getItems().length, 2, "The list has 2 items, filter working!");
						},
						errorMessage: "Filter not Working"
					});
				},


				checkColumnAdded: function() {
					// actually we remove one column !!
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: [
									new AggregationFilled({
										name: "items"
									}),
									function(oTable) {
										if (oTable._colCount === 10) {
											return true;
										}else{
											return false;
										}
									}
								],

						success: function(oTable) {
							var columnDiff;
							//columnDiff = oTable[0]._colCount - colCount;
							columnDiff = colCount - oTable[0]._colCount;
							QUnit.equal(columnDiff, 1, "Settings coloumn selection working");
						},
						errorMessage: "Settings coloumn selection not working"
					});
				},

				checkColumnBefore: function() {
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
										colCount = oTable._colCount;
										return !!oContext;
									}
								],

						success: function(oTable) {
							QUnit.ok(true, "columns count calculated" );
						},
						errorMessage: "columns count not calculated"
					});
				},


				checkTableEntries: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oTable) {
							QUnit.equal(oTable[0].getItems().length, 1, "The list has 1 items, filter working!");
						},
						errorMessage: "Filter not Working"
					});
				},

				checkVariableTableEntries: function(iTableEntries) {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oTable) {
							QUnit.equal(oTable[0].getItems().length, iTableEntries, "The list has " + iTableEntries + " items!");
						},
						errorMessage: "Wrong number of table items: " + iTableEntries
					});
				},

				checkForHeaderVisibility: function(){
					return this.waitFor({
						controlType: "sap.m.Column",
						success: function(){
							QUnit.ok("Table header is visible");
						},
						errorMessage: "Table header is not visible"
					});
				},

				checkForToolbarVisibility: function(){
					return this.waitFor({
						controlType: "sap.m.OverflowToolbar",
						success: function(){
							QUnit.ok("Table toolbar is visible");
						},
						errorMessage: "Table toolbar is not visible"
					});

				}

			}
		}
	});
});
