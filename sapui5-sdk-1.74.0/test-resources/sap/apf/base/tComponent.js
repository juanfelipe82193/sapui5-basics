sap.ui.define("test/sap/apf/base/tComponent", [
		"sap/apf/utils/utils",
		"sap/apf/testhelper/comp/Component",
		"sap/m/App",
		"sap/ui/core/ComponentContainer"
	],
	function(Utils, TestHelperComponent, MApp, ComponentContainer) {
	'use strict';
		/*BEGIN_COMPATIBILITY*/
		TestHelperComponent = TestHelperComponent || sap.apf.testhelper.Component;
		/*END_COMPATIBILITY*/

	QUnit.module("Extension of Base Component", {
		afterEach : function() {
			this.oComponentContainer.destroy();
		}
	});

	QUnit.test("WHEN a component is created that extends the base Component", function(assert) {
		// Act
		var oComponent = new TestHelperComponent();
		this.oComponentContainer = new ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(oComponent);
		this.oComponentContainer.placeAt("componentContainer");
		// Check
		var manifest = oComponent.getManifest();
		assert.notStrictEqual(manifest["sap.app"].dataSources, undefined, "THEN manifest contains dataSources");
		assert.notStrictEqual(manifest["sap.app"].dataSources.PathPersistenceServiceRoot, undefined, "THEN dataSources contains PathPersistenceServiceRoot");
		assert.notStrictEqual(manifest["sap.app"].dataSources.PathPersistenceServiceRoot.uri, undefined, "AND contains uri");
		assert.equal(manifest["sap.app"].i18n, "../../resources/i18n/applicationUi.properties", "THEN the application text file can be retrieved");
		assert.notStrictEqual(manifest["sap.app"].dataSources.AnalyticalConfigurationLocation.uri, undefined, "THEN contains AnalyticalConfigurationLocation.uri");
		// sap-apf namespace in manifest
		assert.notStrictEqual(manifest["sap.apf"].appSpecificParameters, undefined, "THEN contains appSpecificParameters");
		assert.notStrictEqual(manifest["sap.apf"].activateFilterReduction, undefined, "THEN contains activateFilterReduction");
		assert.notStrictEqual(manifest["sap.apf"].activateLrep, undefined, "THEN contains activateLrep");
	});
});