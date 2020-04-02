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
						QUnit.ok(true, "The Smart Table is shown correctly on the List Report");
					},
					errorMessage: "The Smart Table couldn´t be found on the List Report"
				});
			},
			
			theSendEmailButtonVisible: function() {
				return this.waitFor({
					controlType: "sap.m.Button",
					id: prefix+"shareEmailButton",
					success: function() {
						QUnit.ok(true, "The Send Email Button is visible under Share");
					},
					errorMessage: "The Send Email Button is not Visible"
				});
			}
		}
	};
});
