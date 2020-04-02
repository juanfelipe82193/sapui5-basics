jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
jQuery.sap.require("apf.tFooterFiltersPO");
(function() {
	sap.ui.test.Opa5.extendConfig({
		viewNamespace : "sap.apf.ui.reuse.view."
	});
	opaTest("Effect of reporting currency footer filter on analysis path and main chart", function(Given, When, Then) {
		Given.footerFilterPO.iPrepareForScenario();
		When.footerFilterPO.iClickOnReportingCurrencyButton();
		Then.footerFilterPO.iShouldSeeReportingCurrencyDialog();
		When.footerFilterPO.iSelectReportingCurrencyFromDialog();
		When.footerFilterPO.iAddAnAnalysisStep("Time", "Revenue and Receivables over Time", "Line Chart");
		Then.footerFilterPO.iShouldSeeChangeInChart();
	});
	opaTest("Effect of exchange rate footer filter on analysis path and main chart", function(Given, When, Then) {
		Given.footerFilterPO.iPrepareForScenario();
		When.footerFilterPO.iClickOnExchangeRateButton();
		Then.footerFilterPO.iShouldSeeExchangeRateDialog().and.iShouldSeeValuesInExchangeRateDialog();
		Then.footerFilterPO.iClickOnOkButton();
		Then.footerFilterPO.iCleanUpExistingPath();
	});
}());