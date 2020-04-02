/*** Object Page Report actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals",
	 "sap/ui/test/matchers/AggregationFilled", 
	 "sap/ui/test/actions/Press"],
	function (PropertyStrictEquals, AggregationFilled, Press) {

		return function (prefix, viewName, viewNamespace) {

			return {
				iClickTheItemInTheTable: function(iIndex, tab) {
					var sPrefix = prefix + "SalesOrderItemsID::";
					console.log ( "OPA5::ObjectPageActions::iClickTheItemInTheTable" + " iIndex: " + iIndex + " prefix: " + sPrefix + " viewName: " + viewName + " viewNamespace: " + viewNamespace); 
					return this.iClickTheItemInAnyTable(iIndex, tab, sPrefix, viewName, viewNamespace); // Common.js
				}					
			};
		};
});
