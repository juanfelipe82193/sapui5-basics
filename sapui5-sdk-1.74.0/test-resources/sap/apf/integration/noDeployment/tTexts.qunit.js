/*global sap, jQuery, sinon, OData */
(function() {
	'use strict';
	jQuery.sap.declare('sap.apf.integration.noDeployment.tTexts');

	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
	jQuery.sap.require('sap.apf.testhelper.createComponentAsPromise');
	jQuery.sap.require('sap.apf.testhelper.helper');
	QUnit.module("tTexts -- Original Texts", {
		beforeEach : function(assert) {
			var done = assert.async();
			var sConfigPath = sap.apf.testhelper.determineTestResourcePath() + '/integration/noDeployment/applicationConfiguration.json';
			sap.apf.testhelper.createComponentAsPromise(this, {stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : sConfigPath}).done(function(){
				done();
			});
		},
		afterEach : function() {
			this.oCompContainer.destroy();

		}
	});
	QUnit.test("GIVEN application config WHEN path of apfUi.props is set to original ressources THEN property files are resolved and loaded", function(assert) {
		var sText = this.oApi.getTextNotHtmlEncoded("initialText");
		assert.equal(sText, "To start your analysis, add an analysis step or open a saved analysis path", "expected text");
	});
	QUnit.test("GIVEN application config WHEN path of apfUi.props is set to original ressources THEN translated error message text is found in log", function(assert) {

		var oMessageObject = this.oApi.createMessageObject({
			code : "5002",
			aParameters : [ "StepOfNoInterest" ]
		});
		this.oApi.putMessage(oMessageObject);
		var aLogEntries = jQuery.sap.log.getLogEntries();
		var sText = aLogEntries[aLogEntries.length - 1].message;
		var bMessageNumberFound = sText.search("5002") > -1;
		assert.equal(bMessageNumberFound, true, "Correct message number in log");
		var bTextFound = sText.search("Error in OData request; update of analysis step StepOfNoInterest failed") > -1;
		assert.equal(bTextFound, true, "Translated text as expected");
	});
}());
