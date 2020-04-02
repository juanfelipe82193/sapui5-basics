/*  Implemented Scenarios :
	 *  Scenario 1 - Addition of an Analysis path step [Utilization of Step Gallery] to Analysis Path and
	 *  Scenario 2 - Addition of an Analysis path step to chart
 */
/* opaTest */
jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
jQuery.sap.require("apf.tAnalysisPathPO");
(function() {
	sap.ui.test.Opa5.extendConfig({
		viewNamespace : "sap.apf.ui.reuse.view."
	});
	opaTest("Addition of step to Analysis Path", function(Given, When, Then) {
		Given.analysisPathPO.iPrepareForScenario();
		When.analysisPathPO.iPressOnAddStepButton();
		Then.analysisPathPO.iShouldSeeStepGalleryWithCategories();
		When.analysisPathPO.iSelectAnItemFromSelectDialog("title", "Time");
		Then.analysisPathPO.iShouldSeeStepGalleryWithSteps();
		When.analysisPathPO.iSelectAnItemFromSelectDialog("title", "Revenue and Receivables over Time");
		Then.analysisPathPO.iShouldSeeStepGalleryWithRepresentations();
		When.analysisPathPO.iSelectAnItemFromSelectDialog("title", "Line Chart");
		Then.analysisPathPO.iAssertAnalysisPathWithSteps(1);
		Then.analysisPathPO.iShouldSeeSelectedChart("line");
		Then.analysisPathPO.iCleanUpExistingPath();
	});
	opaTest("Deletion of steps from Analysis Path", function(Given, When, Then) {
		Given.analysisPathPO.iPrepareForScenario();
		Given.analysisPathPO.iOpenAnExistingSavedPath();
		When.analysisPathPO.iAddAnAnalysisStep("Time", "Revenue and Receivables over Time", "Line Chart");
		Then.analysisPathPO.iAssertAnalysisPathWithSteps(4);
		When.analysisPathPO.iSelectAnAnalysisStep(1);
		When.analysisPathPO.iStoreTheSelectedChartAndTitle();
		Then.analysisPathPO.iShouldSeeSelectedChart("stacked_column");
		When.analysisPathPO.iDeleteAnAnalysisStep(1);
		Then.analysisPathPO.iAssertDeletionOfAnalysisStepAndTitle();
		When.analysisPathPO.iDeleteAnAnalysisStep(2);
		Then.analysisPathPO.iAssertDeletionOfAnalysisStepAndTitle();
		When.analysisPathPO.iSelectAnAnalysisStep(0);
		When.analysisPathPO.iStoreTheSelectedChartAndTitle();
		When.analysisPathPO.iDeleteAnAnalysisStep(0);
		Then.analysisPathPO.iAssertDeletionOfAnalysisStepAndTitle();
		When.analysisPathPO.iDeleteAnAnalysisStep(0);
		Then.analysisPathPO.iAssertAnalysisPathIsEmpty();
		Then.analysisPathPO.iIgnoreExistingPath();
	});
}());
