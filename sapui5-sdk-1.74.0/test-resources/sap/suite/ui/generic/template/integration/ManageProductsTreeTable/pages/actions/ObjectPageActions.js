/*** Object Page actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/matchers/AggregationFilled", "sap/ui/test/actions/Press", "sap/ui/test/matchers/LabelFor"],

	function (PropertyStrictEquals, AggregationFilled, Press, LabelFor) {

		return function (prefix, viewName, viewNamespace) {

			return {

				iNavigateToSubObjectPage: function(iNode) {
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
