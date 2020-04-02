/*** List Report assertions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/matchers/AggregationFilled"],

	function (PropertyStrictEquals, AggregationFilled) {

	return function (prefix, viewName, viewNamespace) {

		return {

			theTreeTableIsVisible: function() {
				return this.waitFor({
					controlType: "sap.ui.table.TreeTable",
					success: function() {
						QUnit.ok(true, "The Tree Table is shown correctly on the List Report");
					},
					errorMessage: "The Tree Table couldn´t be found on the List Report"
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
			},

			iSeeAPopup: function(){
				return this.waitFor({
					controlType: "sap.m.Dialog",
					success: function(){
						QUnit.ok(true,"Popup is visible");
					},
					errorMessage: "The custom action pop up was not visible"
				});
			},

			iSeeTheFilterOption: function(){
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: [
						new PropertyStrictEquals({
							name: "text",
							value: "Filter"
						})
					],
					success: function(){
						QUnit.ok(true,"Filter option available in table personalization");
					}
				});
			},
			
			theDynamicPagePropertyIsCorrect: function(sPropertyName,bExpected) {
				return this.waitFor({
					id: prefix+"page",
					success: function (oDynamicPage){
						if (oDynamicPage.getProperty(sPropertyName) === bExpected){
							QUnit.ok(true,"The Dynamic Page Property "+sPropertyName+" is correctly set as "+bExpected);
						}
						return false;
					},
					errorMessage: "The Dynamic Page is not set with correct Property Values"
				});
			}
		}
	};
});
