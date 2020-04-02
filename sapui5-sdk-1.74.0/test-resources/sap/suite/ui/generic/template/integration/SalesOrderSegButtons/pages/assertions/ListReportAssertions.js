/*** List Report assertions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", 
	 "sap/ui/test/matchers/AggregationFilled",
	 "sap/suite/ui/generic/template/integration/SalesOrderSegButtons/utils/OpaResourceBundle",
	 "sap/suite/ui/generic/template/integration/SalesOrderSegButtons/utils/OpaModel",
	 "sap/suite/ui/generic/template/integration/SalesOrderSegButtons/utils/OpaManifest",
	 "sap/suite/ui/generic/template/integration/SalesOrderSegButtons/utils/OpaDataStore"],

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

			theDraftPopoverIsVisible: function(sPopoverHeader) {
				return this.waitFor({
					controlType: "sap.m.Popover",
					check: function(oPopover) {
						return oPopover[0].getTitle() === sPopoverHeader;
					},
					success: function() {
						QUnit.ok(true, "Popover dialog with header title " + sPopoverHeader + " is visible");
					},
					errorMessage: "Could not find popover " + sPopoverHeader
				});
			}
			
			
		};
	};
});