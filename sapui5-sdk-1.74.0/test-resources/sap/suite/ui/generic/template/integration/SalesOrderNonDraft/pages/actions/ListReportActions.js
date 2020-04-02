/*** List Report actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/matchers/AggregationFilled", "sap/ui/test/actions/Press"],

	function (PropertyStrictEquals, AggregationFilled, Press) {

		return function (prefix, viewName, viewNamespace) {

			return {
				/* SELECT ITEM ON TABLE */
				iClickTheItemInTheTable: function(iIndex) {
//					return this.iClickTheItemInAnyTable(iIndex, prefix, viewName, viewNamespace);
					
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oTable) {
							var oFirstItem = oTable[0].getItems()[iIndex];
							oFirstItem.$().trigger("tap");
						},
						errorMessage: "Items not loaded."
					});
				},

				/* BUTTON PRESS ON PAGE */
				iClickTheButton: function (buttonText) {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: buttonText
							})
						],
						actions: new Press(),
						errorMessage: "The button cannot be clicked"
					});
				},
				
				/* OVERFLOWTOOLBARBUTTON PRESS ON PAGE */
				iClickTheShareButton: function () {
					return this.waitFor({
						controlType: "sap.m.OverflowToolbarButton",
						viewName: viewName,
						viewNamespace: viewNamespace,
						id: prefix + "template::Share",

						actions: new Press(),
						errorMessage: "The Share button cannot be clicked"
					});
				}
			};
		};
});
