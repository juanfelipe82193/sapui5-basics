sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
	"use strict";

	QUnit.module("EditableFieldFor - OP");

	var sUrl = "test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html?flpApps=SalesOrderItems-EditableFieldFor#SalesOrderItems-EditableFieldFor?serverDelay=50&responderOn=true&sap-ui-language=en_US&sap-theme=sap_belize";

	// todo: test with different values (esp. for on object, where the value has been changed in the draft)
	// todo: test with both parameters (SalesOrder and SalesOrderForEdit) provided 

	var sValue1 = "400000000", sValue2 = "30";

	["", "manifestOriginalFieldInSFB", "manifestForEditFieldInSemanticKey", "manifestOrigFieldInSFBandForEditFieldInSemanticKey"].forEach(function(sManifest){

		[{sParameter1: "SalesOrder", sParameter2: "SalesOrderItem"},
		 {sParameter1: "SalesOrderForEdit", sParameter2: "SalesOrderItemForEdit"}].forEach(function(oParameter){

			 // better naming for test case; maybe include url to app to ease manual retest 
			 opaTest("Manifest: " + sManifest + "Parameter: " + oParameter.sParameter1, function (Given, When, Then) {

				 // arrangements 
				 Given.iStartMyApp(sUrl + "&" + oParameter.sParameter1 + "=" + sValue1 + "&" + oParameter.sParameter2 + "=" + sValue2 , sManifest);

				 // assertion
				 Then.onTheGenericObjectPage.theObjectPageDataFieldHasTheCorrectValue({Field: "SalesOrderForEdit", Value: sValue1});

				 Then.iTeardownMyApp();

			 });
		 });
	});
});
