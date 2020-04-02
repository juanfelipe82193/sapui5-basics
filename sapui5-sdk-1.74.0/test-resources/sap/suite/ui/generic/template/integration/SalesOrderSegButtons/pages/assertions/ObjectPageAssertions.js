/*** Object Page Assertions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals",
	 "sap/suite/ui/generic/template/integration/SalesOrderSegButtons/utils/OpaResourceBundle",
	 "sap/suite/ui/generic/template/integration/SalesOrderSegButtons/utils/OpaManifest",
	 "sap/suite/ui/generic/template/integration/SalesOrderSegButtons/utils/OpaDataStore",
		"sap/ui/test/matchers/AggregationFilled"
	],
	function (PropertyStrictEquals, OpaResourceBundle, OpaManifest, OpaDataStore, AggregationFilled) {

		return function (prefix, viewName, viewNamespace, entityType, entitySet) {

			return {
				/************************************************
				 RENDERING ASSERTIONS
				*************************************************/
				// check if the Object Page has the correct title by:
				// i. finding the control by id
				// ii. matching the "text" property of the control with the value from the annotations ("Product")
				thePageShouldContainTheCorrectTitle: function() {
					console.log ( "OPA5::ObjectPageAssertions::thePageShouldContainTheCorrectTitle ");
					return this.waitFor({
						id: prefix + "objectTypeName",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: entityType["com.sap.vocabularies.UI.v1.HeaderInfo"].TypeName.String
						}),
						success: function() {
							ok(true, "The Object Page Title is correct");
						},
						errorMessage: "The Object Page Title is not rendered correctly"
					});
				},
				/************************************************
				 NAVIGATION ASSERTIONS
				 *************************************************/
				// check if the Object Page context is correct by:
				// i. finding the Oject Page Layout by control type
				// ii. get the binding context and check against the Data Store
				theObjectPageContextShouldBeCorrect: function() {
					console.log ( "OPA5::ObjectPageAssertions::theObjectPageContextShouldBeCorrect ");
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							function(oControl) {
								if (oControl && oControl.getBindingContext()) {
									return oControl.getBindingContext().getPath() === OpaDataStore.getData("navContextPath");
								}
							}
						],
						success: function() {
							ok(true, "The Object Page has the correct context");
						},
						errorMessage: "The Object Page does not have the correct context"
					});
				},
				theObjectPageHasAnApplyButton: function() {
					console.log ( "OPA5::ObjectPageAssertions::theObjectPageHasAnApplyButton ");
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: [
									new sap.ui.test.matchers.PropertyStrictEquals({
										name: "text",
										value: "Apply"
									}),

									function(oButton) {
										return oButton.getEnabled();
									}
								],
						success: function(oButton) {
							QUnit.ok(true, "The Sub Object Page has an Apply button.");
						},
						errorMessage: "The Sub Object Page has no Apply button."
					});
				},

				//sap.uxap.ObjectPageLayout#SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrderItem_WD_20--objectPage is not visible -  sap.ui.test.matchers.Visible
				theObjectPage3ContextShouldBeCorrect: function() {
					console.log ( "OPA5::ObjectPageAssertions::theObjectPage3ContextShouldBeCorrect ");
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							function(oControl) {
								if (oControl && oControl.getBindingContext()) {
									return oControl.getBindingContext().getPath() === OpaDataStore.getData("navContextPath");
								}
							}
						],
						success: function() {
							ok(true, "The Sub Object Page has the correct context");
						},
						errorMessage: "The Sub Object Page does not have the correct context"
					});
				},
				thePageShouldBeInEditMode: function() {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers:[
							function(oControl) {
								return (oControl.getModel("ui").getData().editable);
							}],
						success: function() {
							ok(true, "The Object Page is in Edit mode");
						},
						errorMessage: "The Object Page is not rendered"
					});
				},
				theResponsiveTableIsFilledWithItems: function(iItems) {
					var aMatchers = [
						new AggregationFilled({
							name: "items"
						})
					];
					var fnSuccess = function(oControl) {
						var actualItems = oControl.getItems();
						equal(actualItems.length, iItems, "Correct number of items are present in the table");
					};

					return this.waitForResponsiveTableInObjectPage(aMatchers, fnSuccess);
				},
				waitForResponsiveTableInObjectPage: function(aMatchers, fnSuccess) {
					return this.waitFor({
						id: prefix + "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: aMatchers,
						success: fnSuccess,
						errorMessage: "The Responsive Table is not rendered correctly"
					});
				},
				iShouldSeeResponsiveTableExpand: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						success: function(oTable) {
						if(oTable[0] && oTable[0].mProperties && oTable[0].mProperties.growingThreshold == 25){
							ok(true, "The responsive table occupies the available white space.");
						}
					},
						errorMessage: "Table is not renderred correctly."
					});
				},
				iShouldSeeSegmentedButton: function() {
					return this.waitFor({
						controlType: "sap.m.SegmentedButton",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function() {
							QUnit.ok(true, "The Segmented Button is shown on  the Object Page");
						},
						errorMessage: "The Segmented Button couldn´t be found on the List Report"
					});
				},
				theResultListIsVisible: function() {
					return this.waitFor({
						controlType: "sap.ui.comp.smarttable.SmartTable",
						success: function() {
							QUnit.ok(true, "The result list is shown correctly on the Object Page");
						},
						errorMessage: "The Smart Table couldn´t be found on the Object Page"
					});
				},

				iShouldSeeRefreshedContextPath: function() {
					return this.waitFor({
						controlType: "sap.m.Input",
						success: function(control) {
							var sPath = "SalesOrder='500000000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true";
							equal(control[1].getValue(), sPath, "Ancestor is refreshed");
						},
						errorMessage: "Canvas's parent didn't refresh."
					});
				},

				iShouldSeeIconTabFilter: function(text) {
					return this.waitFor({
						controlType: "sap.m.IconTabBar",
						success: function(control) {
							var sKey = control[0].getSelectedKey();
							QUnit.ok(sKey.indexOf(text) > 0, "The IconTabFilter " + text + " is visible.");
						},
						errorMessage: "The IconTabFilter " + text + " is not visible."
					});
				},
				
				iShouldSeeSelectControlHavingSelectedItem: function(sExpectedSelectedItem) {
					var sActualSelectedItem = null;
					return this.waitFor({
						controlType: "sap.m.Select",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(oControl) {
							sActualSelectedItem = oControl[0].getSelectedItem().getProperty("text");
							equal(sExpectedSelectedItem,sActualSelectedItem, "The Control sap.m.Select is rendered correctly and correct item is selected");
						},
						errorMessage: "The Control sap.m.Select is NOT rendered correctly or the expected item "+sActualSelectedItem+" is not selected"
					});
				},
				
				iShouldSeeCorrectValuesRenderedInTableAfterQuickVariantSelectionApplied: function(iRowNumber, iCellNumber, sExpectedCellValue) {
					var sActualCellValue = null;
					return this.waitFor({
						id: prefix + "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(oTable) {
							sActualCellValue = oTable.getItems()[iRowNumber].getCells()[iCellNumber].getAggregation("display").getAggregation("items")[0].getProperty("text");
							equal(sExpectedCellValue,sActualCellValue, "The table cell value is as per the selected item in sap.m.Select: "+sExpectedCellValue);
						},
						errorMessage: "The table cell value is incorrect"
					});
				}
			};
		};
	}
);
