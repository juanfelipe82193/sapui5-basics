/* 
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */

(function() {
	'use strict';

	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.createComponentAsPromise');
	jQuery.sap.require('sap.apf.testhelper.authTestHelper');
	jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
	jQuery.sap.require('sap.apf.internal.server.userData');

	sap.apf.testhelper.injectURLParameters({
		"P_FromDate" : "20110101",
		"P_ToDate" : "20110331",
		"P_AgingGridMeasureInDays" : "10",
		"P_DisplayCurrency" : "USD",
		"P_ExchangeRateType" : "M",
		"P_NetDueArrearsGridMeasureInDays" : "10",
		"P_NetDueGridMeasureInDays" : "10",
		"P_SAPClient" : "777",
		"SAPClient" : "777"
	});

	QUnit.module('Add steps to path', {
		beforeEach : function(assert) {
			var done = assert.async();
			var sUrl =  "/apf-test/test-resources/sap/apf/integration/withServer/viewParameterProvisioningApplicationConfiguration.json";
			sap.apf.testhelper.createComponentAsPromise(this, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, path : sUrl}).done(function(){

						this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
							this.initErrorHandling();

							this.oApi.resetPath();
							this.startFilter = this.oApi.createFilter();
							this.topAnd = this.startFilter.getTopAnd();
							this.defineFilterOperators();
							done();
						}.bind(this));		
					}.bind(this));
		},
		defineFilterOperators : function() {
			jQuery.extend(this, this.startFilter.getOperators());
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		},
		initErrorHandling : function() {
			this.sMessage = "";
			this.sMessageCode = "";
			this.sErrorSeverity = "";
			var messageHandler = this.oComponent.getProbe().messageHandler;
			messageHandler.setMessageCallback(this.callbackErrorHandling.bind(this));
		},
		callbackErrorHandling : function(oErrorMessage) {
			var sMessage = oErrorMessage.getMessage();
			var sErrorSeverity = oErrorMessage.getSeverity();
			var sMessageCode = oErrorMessage.getCode();
			var oPrevious = oErrorMessage.getPrevious();
			if (oPrevious) {
				sMessage = sMessage + ' DUE TO ' + oPrevious.getMessage();
			}
			var bErrorHappened = sErrorSeverity === sap.apf.core.constants.message.severity.error;
			QUnit.assert.equal(bErrorHappened, false, "Error (" + sMessageCode + "): " + sMessage);
		},
		addFilterToPath : function(propertyName, values) {
			var that = this;
			var filter = this.oApi.createFilter();
			var or;
			if (values.length === 1) {
				filter.getTopAnd().addExpression({
					name : propertyName,
					operator : this.EQ,
					value : values[0]
				});
			} else {
				values.forEach(function(singleValue) {
					if (!or) {
						or = filter.getTopAnd().addOr().addExpression({
							name : propertyName,
							operator : that.EQ,
							value : singleValue
						});
					} else {
						or.addExpression({
							name : propertyName,
							operator : that.EQ,
							value : singleValue
						});
					}
				});
			}
			this.oApi.addPathFilter(filter);
		}
	});
	QUnit.test("Single step using parameter values from start filter", function(assert) {
		assert.expect(1);
		var done = assert.async();
		var that = this;
		this.addFilterToPath('SAPClient', [ '777' ]);
		this.addFilterToPath('P_AgingGridMeasureInDays', [ 10 ]);
		this.addFilterToPath('P_DisplayCurrency', [ 'USD' ]);
		this.addFilterToPath('P_ExchangeRateType', [ 'M' ]);
		this.addFilterToPath('P_NetDueArrearsGridMeasureInDays', [ '10' ]);
		this.addFilterToPath('P_NetDueGridMeasureInDays', [ '10' ]);
		this.addFilterToPath('P_SAPClient', [ '777' ]);
		this.addFilterToPath('P_FromDate', [ '20110723' ]);
		this.addFilterToPath('P_ToDate', [ '20120723' ]);
		this.addFilterToPath('Customer', [ '1', '1000' ]);
		this.oComponent.getProbe().startFilterHandler.getStartFilters().done(function() {
			that.oApi.createStep("stepTemplate1", assertStepCreated);
			function assertStepCreated(oStep, bUpdated) {
				assert.ok(bUpdated, 'Single step created and updated');
				done();
			}
		});
	});
	QUnit.test("Single step using all available default values from annotation file", function(assert) {
		assert.expect(1);
		var done = assert.async();
		var that = this;
		this.addFilterToPath('SAPClient', [ '777' ]);
		this.addFilterToPath('P_AgingGridMeasureInDays', [ 10 ]);
		this.addFilterToPath('P_DisplayCurrency', [ 'USD' ]);
		this.addFilterToPath('P_ExchangeRateType', [ 'M' ]);
		this.addFilterToPath('P_NetDueArrearsGridMeasureInDays', [ '10' ]);
		this.addFilterToPath('P_NetDueGridMeasureInDays', [ '10' ]);
		this.addFilterToPath('P_SAPClient', [ '777' ]);
		this.addFilterToPath('P_FromDate', [ '20110723' ]);
		this.addFilterToPath('P_ToDate', [ '20120723' ]);
		this.addFilterToPath('Customer', [ '1', '1000' ]);
		this.oComponent.getProbe().startFilterHandler.getStartFilters().done(function() {
			that.oApi.createStep("stepTemplate1", assertStepCreated);
			function assertStepCreated(oStep, bUpdated) {
				assert.ok(bUpdated, 'Single step created and updated');
				done();
			}
		});
	});
	QUnit.test("Two steps - second step requires sames parameters as first step", function(assert) {
		assert.expect(2);
		var done = assert.async();
		var that = this;
		this.addFilterToPath('SAPClient', [ '777' ]);
		this.addFilterToPath('P_AgingGridMeasureInDays', [ 10 ]);
		this.addFilterToPath('P_DisplayCurrency', [ 'USD' ]);
		this.addFilterToPath('P_ExchangeRateType', [ 'M' ]);
		this.addFilterToPath('P_NetDueArrearsGridMeasureInDays', [ '10' ]);
		this.addFilterToPath('P_NetDueGridMeasureInDays', [ '10' ]);
		this.addFilterToPath('P_SAPClient', [ '777' ]);
		this.addFilterToPath('P_FromDate', [ '20110723' ]);
		this.addFilterToPath('P_ToDate', [ '20120723' ]);
		this.addFilterToPath('Customer', [ '1', '1000' ]);
		function createSecondStep(oStep, bUpdated) {
			if (oStep !== this.step1) {
				return;
			}
			assert.ok(bUpdated, 'First step created and and updated');
			this.step2 = this.oApi.createStep("stepTemplate2", assertSecondStepCreated.bind(this));
		}
		function assertSecondStepCreated(oStep, bUpdated) {
			if (oStep !== this.step2) {
				return;
			}
			assert.ok(bUpdated, 'Second step created and updated');
			done();
		}
		this.oComponent.getProbe().startFilterHandler.getStartFilters().done(function() {
			that.step1 = that.oApi.createStep("stepTemplate1", createSecondStep.bind(that));
		});
	});
	QUnit.test("Two steps - second step requires no parameters", function(assert) {
		assert.expect(2);
		var done = assert.async();
		var that = this;
		this.addFilterToPath('SAPClient', [ '777' ]);
		this.addFilterToPath('P_AgingGridMeasureInDays', [ 10 ]);
		this.addFilterToPath('P_DisplayCurrency', [ 'USD' ]);
		this.addFilterToPath('P_ExchangeRateType', [ 'M' ]);
		this.addFilterToPath('P_NetDueArrearsGridMeasureInDays', [ '10' ]);
		this.addFilterToPath('P_NetDueGridMeasureInDays', [ '10' ]);
		this.addFilterToPath('P_SAPClient', [ '777' ]);
		this.addFilterToPath('P_FromDate', [ '20110723' ]);
		this.addFilterToPath('P_ToDate', [ '20120723' ]);
		this.addFilterToPath('Customer', [ '1', '1000' ]);
		function createSecondStep(oStep, bUpdated) {
			if (oStep !== this.step1) {
				return;
			}
			assert.ok(bUpdated, 'First step created and updated');
			this.step2 = this.oApi.createStep("stepTemplate3", assertSecondStepCreated.bind(this));
		}
		function assertSecondStepCreated(oStep, bUpdated) {
			if (oStep !== this.step2) {
				return;
			}
			assert.ok(bUpdated, 'Second step created and updated');
			done();
		}
		this.oComponent.getProbe().startFilterHandler.getStartFilters().done(function() {
			that.step1 = that.oApi.createStep("stepTemplate1", createSecondStep.bind(that));
		});
	});
	function assertCorrectUriParametersSupplied(oUriParameters, assert) {
		assert.equal(oUriParameters['P_AgingGridMeasureInDays'], 10, "Uri parameter P_AgingGridMeasureInDays detected");
		assert.equal(oUriParameters['P_DisplayCurrency'], 'USD', "Uri parameter P_DisplayCurrency detected");
		assert.equal(oUriParameters['P_ExchangeRateType'], 'M', "Uri parameter  P_ExchangeRateType detected");
		assert.equal(oUriParameters['P_NetDueArrearsGridMeasureInDays'], 10, "Uri parameter P_NetDueArrearsGridMeasureInDays detected");
		assert.equal(oUriParameters['P_NetDueGridMeasureInDays'], 10, "Uri parameter P_NetDueGridMeasureInDays detected");
		assert.equal(oUriParameters['P_SAPClient'], '777', "Uri parameter P_SAPClient detected");
		assert.equal(oUriParameters['SAPClient'], '777', "Uri parameter SAPClient detected");
		assert.equal(oUriParameters['P_FromDate'], '20110101', "Uri parameter P_FromDate detected");
		assert.equal(oUriParameters['P_ToDate'], '20110331', "Uri parameter P_ToDate detected");
	}
	QUnit.test("Single step using values from URI - set in path via method addPathFilter() from url parameters", function(assert) {
		var that = this;
		var done = assert.async();
		var oUriParameters = sap.apf.utils.getUriParameters();
		assertCorrectUriParametersSupplied(oUriParameters, assert);
		var property;
		for(property in oUriParameters) {
			this.addFilterToPath(property, [ oUriParameters[property][0] ]);
		}
		this.oComponent.getProbe().startFilterHandler.getStartFilters().done(function() {
			that.oApi.createStep("stepTemplate1", assertStepCreated);
			function assertStepCreated(oStep, bUpdated) {
				// there must be an update true, because step has just been created!
				assert.equal(bUpdated, true, 'Step created and updated without error');
				done();
			}
		});
	});
}());