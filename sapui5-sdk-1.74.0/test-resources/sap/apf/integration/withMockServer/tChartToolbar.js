/* opaTest */
jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
jQuery.sap.require("apf.tChartToolbarPO");
(function() {
	sap.ui.test.Opa5.extendConfig({
		viewNamespace : "sap.apf.ui.reuse.view."
	});
	opaTest("Clicking on multiple representation and switching to a different chart - Interaction between Analysis Path and Chart Container", function(Given, When, Then) {
		Given.tChartToolbarPO.iPrepareForScenario();
		When.tChartToolbarPO.iOpenAnExistingSavedPath();
		When.tChartToolbarPO.iSelectAnAnalysisStep(0);
		When.tChartToolbarPO.iStoreTheSelectedChartAndTitle();
		Then.tChartToolbarPO.iShouldSeeSelectedChart("scatter");
		When.tChartToolbarPO.iSelectAnAnalysisStep(1);
		When.tChartToolbarPO.iStoreTheSelectedChartAndTitle();
		Then.tChartToolbarPO.iShouldSeeSelectedChart("stacked_column");
		When.tChartToolbarPO.iClickToolbarMenu("Line Chart");
		Then.tChartToolbarPO.iShouldSeeSelectedChart("line");
		Then.tChartToolbarPO.iCleanUpExistingPath();
	});
	opaTest("Toggle Legend for a chart", function(Given, When, Then) {
		Given.tChartToolbarPO.iPrepareForScenario();
		When.tChartToolbarPO.iOpenAnExistingSavedPath();
		Then.tChartToolbarPO.iShouldSeeLegend(true);
		When.tChartToolbarPO.onToggleLegend(false);
		Then.tChartToolbarPO.iShouldSeeLegend(false);
		When.tChartToolbarPO.onToggleLegend(true);
		Then.tChartToolbarPO.iShouldSeeLegend(true);
		Then.tChartToolbarPO.iIgnoreExistingPath();
	});
	opaTest("Toggle from Normal screen to Full screen and vice versa", function(Given, When, Then) {
		Given.tChartToolbarPO.iPrepareForScenario();
		When.tChartToolbarPO.iOpenAnExistingSavedPath();
		Then.tChartToolbarPO.isFullScreen(false);
		When.tChartToolbarPO.iSetFullScreen(true);
		Then.tChartToolbarPO.isFullScreen(true);
		When.tChartToolbarPO.iSetFullScreen(false);
		Then.tChartToolbarPO.isFullScreen(false);
		Then.tChartToolbarPO.iIgnoreExistingPath();
	});
	opaTest("Toggle to Alternate representation - Table Representation", function(Given, When, Then) {
		Given.tChartToolbarPO.iPrepareForScenario();
		When.tChartToolbarPO.iOpenAnExistingSavedPath();
		Then.tChartToolbarPO.iShouldSeeSelectedChart("scatter");
		When.tChartToolbarPO.iClickToolbarMenu("Table Representation");
		Then.tChartToolbarPO.iShouldSeeTheTableThumbnail();
		Then.tChartToolbarPO.iShouldSeeTheTableRepresentation();
		Then.tChartToolbarPO.iCleanUpExistingPath();
	});
}());