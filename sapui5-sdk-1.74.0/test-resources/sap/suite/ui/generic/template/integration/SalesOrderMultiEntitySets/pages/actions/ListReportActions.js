/*** List Report actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", 
	 "sap/ui/test/matchers/AggregationFilled", 
	 "sap/ui/test/actions/Press"],

	function (PropertyStrictEquals, AggregationFilled, Press) {

		return function (prefix, viewName, viewNamespace) {

			return {
				/* CLICK ON ITEM ON TABLE */
				iClickTheItemInTheTable: function(iIndex,tab) {
					return this.iClickTheItemInAnyTable(iIndex,tab, prefix, viewName, viewNamespace); // Common.js
				},

				iClickTheActiveButton: function(tab) {
					return this.waitFor({
						id: prefix + "activeStateToggle-" + tab,
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(oControl) {
							oControl.firePress();
						},
						errorMessage: "The Active Button is not rendered correctly"
					});
				},
				/**
				* Click on the create button to execute the creation of a new item in the ListReport.
				* @throws {Error} Throws an error if the button for creation of an item could not be found on the UI
				* @public
				*/
				iClickTheCreateButton: function (tab) {
					var sCreateButtonId = prefix + "addEntry-" + tab;
				 	return this.waitFor({
				 		id: sCreateButtonId,
				 		success: function (oButton) {
				 			oButton.firePress();
				 		},
				 		errorMessage: "The button for creating a new item could not be found--2"
				 	});
				}				
			};
		};
});