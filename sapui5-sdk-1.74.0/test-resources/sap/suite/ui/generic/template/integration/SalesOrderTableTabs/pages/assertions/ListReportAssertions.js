/*** List Report assertions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals",
	 "sap/ui/test/matchers/AggregationFilled",
	 "sap/suite/ui/generic/template/integration/SalesOrderTableTabs/utils/OpaResourceBundle",
	 "sap/suite/ui/generic/template/integration/SalesOrderTableTabs/utils/OpaModel",
	 "sap/suite/ui/generic/template/integration/SalesOrderTableTabs/utils/OpaManifest",
	 "sap/suite/ui/generic/template/integration/SalesOrderTableTabs/utils/OpaDataStore"],

	function (PropertyStrictEquals, AggregationFilled, OpaResourceBundle, OpaModel, OpaManifest, OpaDataStore) {

	return function (prefix, viewName, viewNamespace, entityType, entitySet) {

		return {
			theSmartTableIsVisible: function() {
				console.log ( "OPA5::ListReportAssertions::theSmartTableIsVisible ");
				return this.waitFor({
					controlType: "sap.ui.comp.smarttable.SmartTable",
					success: function() {
						QUnit.ok(true, "The Smart Table is shown correctly on the List Report");
					},
					errorMessage: "The Smart Table couldn´t be found on the List Report"
				});
			},

			theSalesOrdersAreLoadedInTheSmartTable: function() {
				console.log ( "OPA5::ListReportAssertions::theSalesOrdersAreLoadedInTheSmartTable ");
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
						firstProduct = oTable[0].getItems()[0].getBindingContext().getObject(oFirstItem);
						QUnit.notEqual(oTable[0].getItems().length, 0, "Sales Orders are loaded in the Smart Table");
					},
					errorMessage: "Sales Orders were not loaded into the Smart Table"
				});
			},

			theRightTabFromExtensionIsSelected: function() {
				return this.waitFor({
					controlType: "sap.m.IconTabHeader",
					success: function(oControl) {
						var selectedKey = oControl[0].getSelectedKey();
						QUnit.equal(selectedKey,"1","Correct tab from extension is selected");
					},
					errorMessage: "Correct Tab from extension is not selected"
				});
			},
			//Check if custom title is present as a title.
			//Presence of custom title signifies that LR doesn't have variant.
			checkCustomTitle: function () {
				return this.waitFor({
					controlType: "sap.m.Title",
					success: function(oControl) {
						var aItems = oControl;
						//getting the header title defined in i18n.
						var scustomVariant = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("subTitleIfVariantMgmtHidden");
						for(i=0;i<aItems.length;i++){
							if (!aItems[i] ||
							    !aItems[i].getText){
							    continue;
							  }
							else if(aItems[i].getText() === scustomVariant){
								assert.ok(true, "Custom Tile is found");
								break;
							}
							else{
								assert.ok(false, "Custom Tile is not found");
							}
						}
					},
					errorMessage: "Title is not rendered correctly"
				});
			}
		};
	};
});
