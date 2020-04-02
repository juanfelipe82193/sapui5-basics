/*** List Report actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/matchers/AggregationFilled", "sap/ui/test/actions/Press", "sap/ui/test/matchers/LabelFor"],

	function (PropertyStrictEquals, AggregationFilled, Press, LabelFor) {

		return function (prefix, viewName, viewNamespace) {

			return {
				iSetTheSearchField: function (sSearchText) {
					return this.waitFor({
						controlType: "sap.m.SearchField",
						actions: function (oControl) {
							oControl.setValue(sSearchText);
							oControl.fireSearch();
							ok(true, "Table has search field in Filterbar");
						},
						//actions: new Press(),
						errorMessage: "Search field not found"
					});
				},

				iSetTheFilterinFilterBar: function(sValue){
					return this.waitFor({
						controlType: "sap.m.MultiInput",
						matchers: [
							new LabelFor({
								text: "Supplier"
							})
						],
						actions: function(oInputsField){
							oInputsField.setValue(sValue);
						}
					});
				},

				iNavigateToObjectPage: function(iNode) {
					return this.waitFor({
						controlType: "sap.ui.table.RowAction",

						success: function(Rows) {
							Rows[0].getItems()[0].firePress();
						},
						errorMessage: "Items not loaded."
					});
				}
			};
		};
});
