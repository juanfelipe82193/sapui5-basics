/*  Implemented Scenarios :
	 *  Scenario 46 - Analysis Path in Empty State to Open operation by choosing first analysis step 
 */
/* opaTest */
jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
jQuery.sap.require("apf.tViewSettingsIconPO");
(function() {
	sap.ui.test.Opa5.extendConfig({
		viewNamespace : "sap.apf.ui.reuse.view."
	});
	opaTest("Sorting of table representation data according to settings in View Settings Dialog", function(Given, When, Then) {
		Given.viewSettingsIconPO.iPrepareForScenario();
		When.viewSettingsIconPO.iOpenAnExistingSavedPath();
		When.viewSettingsIconPO.iClickToolbarMenu("Table Representation");
		Then.viewSettingsIconPO.iShouldSeeTheTableRepresentation();
		When.viewSettingsIconPO.iStoreFirstRecordInTable();
		When.viewSettingsIconPO.iClickToolbarMenu("View Settings Icon");
		Then.viewSettingsIconPO.iShouldSeeViewSettingsDialog();
		When.viewSettingsIconPO.iSelectSortOrderAndDimension('Ascending', 'Customer Name');
		When.viewSettingsIconPO.iClickonOk();
		Then.viewSettingsIconPO.iShouldSeeTheChartDataSorted();
		Then.viewSettingsIconPO.iCleanUpExistingPath();
	});
}());