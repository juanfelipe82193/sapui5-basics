jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
jQuery.sap.require("apf.tFacetFiltersPO");
(function() {
	sap.ui.test.Opa5.extendConfig({
		viewNamespace : "sap.apf.ui.reuse.view."
	});
	opaTest("Effect of Company Code facet filter on Analysis Path and Main Chart", function(Given, When, Then) {
		Given.facetFilterPO.iPrepareForScenario();
		When.facetFilterPO.iClickOnFilterMenu("Company Code");
		When.facetFilterPO.iChangeValueFromFacetFilterList("Company_code");
		When.facetFilterPO.iClickonOk();
		Then.facetFilterPO.iShouldSeeSelFacetFilterListsValuesFromCompanyCode();
		When.facetFilterPO.iAddAnAnalysisStep("Line Items", "List of Open Line Items", "Table Representation");
		Then.facetFilterPO.iAssertAnalysisPathWithSteps(1);
		Then.facetFilterPO.iShouldSeeTheLineItemsWithFacetfilterCompanyCodes();
	});
	opaTest("Effect of From Date facet filter on Analysis Path and Main Chart", function(Given, When, Then) {
		Given.facetFilterPO.iPrepareForScenario();
		When.facetFilterPO.iClickOnFilterMenu("From");
		When.facetFilterPO.iChangeValueFromFacetFilterList("From_date");
		When.facetFilterPO.iClickonOk();
		When.facetFilterPO.iAddAnAnalysisStep("Time", "Revenue and Receivables over Time", "Line Chart");
		Then.facetFilterPO.iAssertAnalysisPathWithSteps(2);
		Then.facetFilterPO.iShouldSeeChartWithFacetfilterTimeFrame("From_date");
	});
	opaTest("Effect of to date facet filter on Analysis Path and Main Chart", function(Given, When, Then) {
		Given.facetFilterPO.iPrepareForScenario();
		When.facetFilterPO.iClickOnFilterMenu("To");
		When.facetFilterPO.iChangeValueFromFacetFilterList("To_date");
		When.facetFilterPO.iClickonOk();
		When.facetFilterPO.iAddAnAnalysisStep("Time", "Revenue and Receivables over Time", "Line Chart");
		Then.facetFilterPO.iAssertAnalysisPathWithSteps(3);
		Then.facetFilterPO.iShouldSeeChartWithFacetfilterTimeFrame("To_date");
		Then.facetFilterPO.iCleanUpExistingPath();
	});
}());