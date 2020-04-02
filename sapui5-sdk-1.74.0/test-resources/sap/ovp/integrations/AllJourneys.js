/*global QUnit */
// AnalyticalListPage AllJourneys
jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.Opa5");

jQuery.sap.require("sap.ovp.test.integrations.pages.Common");
jQuery.sap.require("sap.ovp.test.integrations.pages.Main");

sap.ui.test.Opa5.extendConfig({
	arrangements: new sap.ovp.test.integrations.pages.Common()
	//viewNamespace: "sap.suite.ui.generic.template.demokit"
});

//jQuery.sap.require("sap.ovp.test.integrations.MainJourney");
jQuery.sap.require("sap.ovp.test.integrations.SmartFilterBarJourney");
//jQuery.sap.require("sap.ovp.test.integrations.AnalyticCardJourney");

QUnit.config.testTimeout = 99999;
