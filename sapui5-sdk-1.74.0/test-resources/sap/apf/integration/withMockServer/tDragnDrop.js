/* opaTest */
jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
jQuery.sap.require("apf.tDragnDropPO");
(function() {
	sap.ui.test.Opa5.extendConfig({
		viewNamespace : "sap.apf.ui.reuse.view."
	});
	opaTest("Scenario 40 : Drag N Drop in analysis Path Step by Down button", function(Given, When, Then) {
		Given.dragnDropPO.iPrepareForScenario();
		When.dragnDropPO.iPrepareForSpecificScenario();
		When.dragnDropPO.iSwapTheSteps(1);
		Then.dragnDropPO.iShouldSeeTheStepsSwapped();
		When.dragnDropPO.iMakeStepActive(2);
		Then.dragnDropPO.iShouldSeeActiveChart("stacked_column");
		Then.dragnDropPO.iCleanUpExistingPath();
	});
	opaTest("Scenario 40 : Drag N Drop in analysis Path Step by Up button", function(Given, When, Then) {
		When.dragnDropPO.iPrepareForSpecificScenario();
		When.dragnDropPO.iSelectAnAnalysisStep(1);
		When.dragnDropPO.iSwapTheSteps(0);
		Then.dragnDropPO.iShouldSeeTheStepsSwapped();
		When.dragnDropPO.iMakeStepActive(1);
		Then.dragnDropPO.iShouldSeeActiveChart("scatter");
		Then.dragnDropPO.iCleanUpExistingPath();
	});
}());
