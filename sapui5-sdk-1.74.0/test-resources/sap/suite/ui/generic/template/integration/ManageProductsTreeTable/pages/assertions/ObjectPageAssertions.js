/*** List Report assertions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/matchers/AggregationFilled"],

	function (PropertyStrictEquals, AggregationFilled) {

	return function (prefix, viewName, viewNamespace) {

		return {
			theSmartTableIsVisible: function() {
				return this.waitFor({
					controlType: "sap.ui.comp.smarttable.SmartTable",
					success: function() {
						QUnit.ok(true, "The Smart Table is shown correctly on the Object Page");
					},
					errorMessage: "The Smart Table couldn´t be found on the Object Page"
				});
			},

			theTreeTableIsVisible: function() {
				return this.waitFor({
					controlType: "sap.ui.table.TreeTable",
					success: function() {
						QUnit.ok(true, "The Tree Table is shown correctly on the Object Page");
					},
					errorMessage: "The Tree Table couldn't be found on the Object Page"
				});
			},

			theCustomColumnIsVisible: function() {
				return this.waitFor({
					controlType: "sap.ui.table.TreeTable",
					success: function (table){
						treeTable = table[0];
						aColumns = treeTable.getAggregation("columns");
						for (i in aColumns){
							if (aColumns[i].getLabel().getText() === "BreakoutColumn"){
								QUnit.ok(true,"The Custom column is visible in tree table");
							}
						}
						return false;
					},
					errorMessage: "The custom column is not found"
				});
			}
		}
	};
});
