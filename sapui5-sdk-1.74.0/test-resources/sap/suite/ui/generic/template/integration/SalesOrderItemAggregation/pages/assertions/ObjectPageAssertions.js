/*** Object Page Assertions ***/
sap.ui.define(
	["sap/ui/test/Opa5",
	 "sap/ui/test/matchers/PropertyStrictEquals",
	 "sap/ui/test/matchers/AggregationFilled"],

		function (Opa5, PropertyStrictEquals, AggregationFilled) {

		return function (prefix, viewName, viewNamespace) {

			return {
				/* your local ObjectPage assertions (OPA tests) */
				checkTableType : function(sTableType) {
					var mTableTypes = {
						"AnalyticalTable": "sap.ui.table.AnalyticalTable",
						"GridTable": "sap.ui.table.Table",
						"ResponsiveTable": "sap.m.Table",
						"TreeTable": "sap.ui.table.TreeTable",
					};

					sControl = mTableTypes[sTableType];
					return this.waitFor({
						controlType: sControl,
						success: function (oControl) {
							Opa5.assert.ok(true, "It is a " + sTableType);
						},
						errorMessage: "The page does not have " + sTableType + " control."
					});
				},

				theTextInTheMessageBoxIsCorrect : function(sExpectedText) {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						success: function (oDialog) {
							var sActualText = oDialog[0].getContent()[0].getText();
							Opa5.assert.strictEqual(sActualText, sExpectedText, "Header Text on List is correct: " + sActualText);
						},
						errorMessage: "No MessageBox text found"
					});
				}
			};
		};
	}
);
