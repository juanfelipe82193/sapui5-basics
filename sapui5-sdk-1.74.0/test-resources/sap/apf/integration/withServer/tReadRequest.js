/* 
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */
(function() {
	'use strict';

	jQuery.sap.declare("sap.apf.integration.withServer.tReadRequest");
	jQuery.sap.require('sap.apf.testhelper.createComponentAsPromise');
	jQuery.sap.require('sap.apf.testhelper.authTestHelper');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
	jQuery.sap.require('sap.apf.internal.server.userData');

	QUnit.module("Basic functions for read request", {
		beforeEach : function(assert) {
			var done = assert.async();
			var sUrl =  "/apf-test/test-resources/sap/apf/integration/withServer/integrationTestingApplicationConfiguration.json";
			sap.apf.testhelper.createComponentAsPromise(this, { doubleUiInstance : true, path : sUrl}).done(function(){

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
	QUnit.test("Creating read request for company code with filter on client", function(assert) {
		assert.expect(4);
		var done = assert.async();
		var assertCompanyCodeDataRequestIsOk = function(oDataResponse, oMetadata, oMessageObject) {
			assert.ok(oDataResponse);
			assert.equal((oMetadata && oMetadata.type && oMetadata.type === "entityTypeMetadata"), true, "Metadata object was returned");
			assert.equal(oMessageObject, undefined, "No message is expected");
			done();
		};
		function handleErrors(oMessageObject) {
		}
		var messageHandler = this.oComponent.getProbe().messageHandler;
		messageHandler.setMessageCallback(handleErrors);
		var oReadRequest = this.oApi.createReadRequest("CompanyCodeQueryResults");
		oReadRequest.getMetadata().done(function(oMetadata){
			assert.equal(oMetadata && oMetadata.type && oMetadata.type === "entityTypeMetadata", true, "Function works as expected");
			oReadRequest.send(this.oFilter, assertCompanyCodeDataRequestIsOk.bind(this));
		}.bind(this));
		
		
	});
	QUnit.test("Wrong request id, which does not exist in configuration, provokes error message", function(assert) {
		var sMessageCode = "";
		var assertMessageWasPutCallback = function(oMessageObject) {
			sMessageCode = oMessageObject.getCode();
		};
		var messageHandler = this.oComponent.getProbe().messageHandler;
		messageHandler.setMessageCallback(assertMessageWasPutCallback);
		assert.throws(function() {
			this.oApi.createReadRequest("UnkownRequestId");
			assert.equal(sMessageCode, "5004", "Correct error message");
		}, Error, "must throw error to pass and to resume");
	});
	QUnit.test("Mandatory $filter property is missing for CompanyCodeQuery", function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oFilter = this.oApi.createFilter();
		oFilter.getTopAnd().addExpression({
			name : 'PropertyOfNoInterest',
			operator : this.EQ,
			value : 'value1'
		});
		var oReadRequest = this.oApi.createReadRequest("CompanyCodeQueryResults");
		oReadRequest.send(oFilter, function() {
			var log = jQuery.sap.log.getLogEntries();
			var foundMessageCode = log[log.length - 1].message.search("5005") > -1;
			assert.ok(foundMessageCode, "Message code 5005 as expected");
			done();
		});
	});
	QUnit.test("Get metadata by property", function(assert) {
		assert.expect(1);
		var done = assert.async();
		var callback = function(aAllParameterEntitySetKeyProperties) {
			assert.equal(aAllParameterEntitySetKeyProperties.length, 11, "MetadataByProperty works properly, correct number of parameter entity set key propertiess returned");
			done();
		};
		var oReadRequest = this.oApi.createReadRequest("CompanyCodeQueryResults");
		var oMetadataByProperty = oReadRequest.getMetadataFacade();
		oMetadataByProperty.getAllParameterEntitySetKeyProperties(callback);
	});
}());