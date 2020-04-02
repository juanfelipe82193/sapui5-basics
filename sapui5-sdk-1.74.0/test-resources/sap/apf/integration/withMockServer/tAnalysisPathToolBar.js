/*  Implemented Scenarios :
	 *  Scenario 46 - Analysis Path in Empty State to Open operation by choosing first analysis step and
	 *  Scenario 47 - Analysis Path in Empty State to Open operation by choosing subsequent analysis step
 */
/* opaTest */
jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
jQuery.sap.require("apf.tAnalysisPathToolBarPO");
(function() {
	sap.ui.test.Opa5.extendConfig({
		viewNamespace : "sap.apf.ui.reuse.view."
	});
	opaTest("Opening of different analysis paths from path gallery", function(Given, When, Then) {
		Given.analysisPathToolBarPO.iPrepareForScenario();
		When.analysisPathToolBarPO.iClickonObjectHeader();
		When.analysisPathToolBarPO.iClickOnToolbarItem(1);
		When.analysisPathToolBarPO.iSelectAnItemFromSelectDialog("title", "Revenue and Receivables over Time By Customer");
		When.analysisPathToolBarPO.iSelectAnItemFromSelectDialog("title", "Revenue by Customer");
		Then.analysisPathToolBarPO.iAssertAnalysisPathWithSteps(2);
		Then.analysisPathToolBarPO.iCleanUpExistingPath();
		When.analysisPathToolBarPO.iClickonObjectHeader();
		When.analysisPathToolBarPO.iClickOnToolbarItem(1);
		When.analysisPathToolBarPO.iSelectAnItemFromSelectDialog("title", "Revenue and Receivables  By Customer");
		When.analysisPathToolBarPO.iSelectAnItemFromSelectDialog("title", "Revenue and Receivables By Customer");
		Then.analysisPathToolBarPO.iAssertAnalysisPathWithSteps(3);
		Then.analysisPathToolBarPO.iCleanUpExistingPath();
	});
}());
