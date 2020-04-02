QUnit.module("IH -- testing the validity of resolving the folder of test resources", {});
QUnit.test("GIVEN file exists WHEN using getLocationOfTestResources THEN bundle returned by UI5 has keys", function(assert) {
	var sUrl = sap.apf.integration.withServer.getLocationOfTestResources() + '/resources/i18n/' + 'apfUi.properties';
	var oBundle = jQuery.sap.resources({
		url : sUrl,
		includeInfo : sap.ui.getCore().getConfiguration().getOriginInfo()
	});
	assert.ok(oBundle.aPropertyFiles[0].aKeys.length > 0, "min 1 key value pair expected");
});
QUnit.test("GIVEN missing file using getLocationOfTestResources THEN bundle returned no keys", function(assert) {
	var sUrl = sap.apf.integration.withServer.getLocationOfTestResources() + 'resources/i18n/' + 'notExisting.properties';
	var oBundle = jQuery.sap.resources({
		url : sUrl,
		includeInfo : sap.ui.getCore().getConfiguration().getOriginInfo()
	});
	assert.ok(oBundle.aPropertyFiles[0].aKeys.length === 0, "no keys");
});