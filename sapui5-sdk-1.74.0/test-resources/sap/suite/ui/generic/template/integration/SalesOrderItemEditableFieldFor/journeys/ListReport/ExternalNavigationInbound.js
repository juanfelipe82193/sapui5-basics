sap.ui.define(["sap/ui/test/opaQunit"], function(opaTest) {
	"use strict";

	QUnit.module("EditableFieldFor - LR");

	// todo: test with different values (esp. for on object, where the value has been changed in the draft)?
	// todo: test with both parameters (SalesOrder and SalesOrderForEdit) provided 
	
	var sUrl = "test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html?flpApps=SalesOrderItems-EditableFieldFor#SalesOrderItems-EditableFieldFor?serverDelay=50&responderOn=true&sap-ui-language=en_US&sap-theme=sap_belize";
	var sValue = "400000001";

	[{sFilterField: "SalesOrderForEdit", sManifest: ""},
	 {sFilterField: "SalesOrder", sManifest: "manifestOriginalFieldInSFB"},
	 {sFilterField: "SalesOrderForEdit", sManifest: "manifestForEditFieldInSemanticKey"},
	 {sFilterField: "SalesOrder", sManifest: "manifestOrigFieldInSFBandForEditFieldInSemanticKey"}].forEach(function(oAppConfig) {

		 ["SalesOrderForEdit", "SalesOrder"].forEach(function(sParameter) {

			 // better naming for test case; maybe include url to app to ease manual retest 
			 opaTest("Manifest: " + oAppConfig.sManifest + "Parameter: " + sParameter, function(Given, When, Then) {

				 // arrangements
				 Given.iStartMyApp(sUrl + "&" + sParameter + "=" + sValue, oAppConfig.sManifest);

				 // actions
				 // expand of header needed?
				 When.onTheGenericListReport
				 .iClickTheButtonWithId("template:::ListReportPage:::DynamicPageTitle-expandBtn");

				 // assertion
				 Then.onTheListReportPage.theFilterIsFilled(oAppConfig.sFilterField, sValue);

				 Then.iTeardownMyApp();

			 });
		 });
	 });
});
