/* 
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */
(function() {
	'use strict';

	jQuery.sap.declare("sap.apf.integration.withServer.tReadRequest");
	jQuery.sap.require('sap.apf.testhelper.createComponentAsPromise');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.authTestHelper');
	jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
	jQuery.sap.require('sap.apf.internal.server.userData');
	jQuery.sap.require('sap.apf.Component');
	QUnit.module("Basic functions for read request by required filter", {
		beforeEach : function(assert) {
			var done = assert.async();
			var sUrl =  "/apf-test/test-resources/sap/apf/integration/withServer/integrationTestingApplicationConfiguration.json";
			sap.apf.testhelper.createComponentAsPromise(this, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, path : sUrl}).done(function(){


						this.oFilter = this.oApi.createFilter();
						this.defineFilterOperators();
						this.oFilter.getTopAnd().addExpression({
							name : 'SAPClient',
							operator : this.EQ,
							value : '777'
						});
						this.oFilter.getTopAnd().addExpression({
							name : 'CompanyCode',
							operator : this.EQ,
							value : '1000'
						});
						this.testHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
							done();
						});
					}.bind(this));
		},
		defineFilterOperators : function() {
			jQuery.extend(this, this.oFilter.getOperators());
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test("Creating read request", function(assert) {
		assert.expect(3);
		var done = assert.async();
		var assertCompanyCodeDataRequestIsOk = function(oDataResponse, oMetadata, oMessageObject) {
			assert.ok(oDataResponse);
			assert.equal((oMetadata && oMetadata.type && oMetadata.type === "entityTypeMetadata"), true, "Metadata object was returned");
			assert.equal(oMessageObject, undefined, "No message is expected");
			done();
		};
		function handleErrors(oMessageObject) {
			var sText = oMessageObject.getMessage();
			assert.equal(sText, "");
		}
		var messageHandler = this.oComponent.getProbe().messageHandler;
		messageHandler.setMessageCallback(handleErrors);
		var oRequest = this.oApi.createReadRequestByRequiredFilter({
			"id" : "mandatoryId",
			"type" : "request",
			"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
			"entityType" : "CompanyCodeQuery",
			"selectProperties" : [ "SAPClient", "CompanyCode", "Currency", "CurrencyShortName" ]
		});
		oRequest.send(this.oFilter, assertCompanyCodeDataRequestIsOk.bind(this));
	});
}());