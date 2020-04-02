sap.ui.define("sap/apf/utils/tSbAdapter", [
	"sap/apf/utils/sbAdapter",
	"sap/apf/abap/LrepConnector"
], function(sbAdapter, LrepConnector){
	'use strict';
	function commonSetup (testEnv, assert){
		testEnv.numberOfLrepCalls = 0;
		var Connector = function() {
			this._buildParams = function(options) {
				var expectedOptions = [ { name: "deep-read", value: true}, {name: "metadata",value: true}, {name: "layer", value: "CUSTOMER"}];
				assert.deepEqual(options, expectedOptions, "correct options for url paremters are given");
				return "?test=1972";
			};
			this.send = function(url, method, data, options) {
				testEnv.numberOfLrepCalls++;
				assert.ok(url.indexOf('?test=1972') > -1, 'Url parameters handed over to request');
				assert.deepEqual(options, {
					async : true,
					contentType : 'application/json'
				}, 'RequestOptions are set');
				var deferred = jQuery.Deferred();
				if(!testEnv.connectionRefuse){
					deferred.resolve({
						response : testEnv.lrepResponse || []
					});
				} else {
					deferred.reject();
				}
				return deferred.promise();
			};

		};
		sinon.stub(LrepConnector, 'createConnector', function(){
			return new Connector();
		});
		sinon.stub(OData, 'request', function(request, success, fail){
			assert.equal(request.requestUri,
					"/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata/AnalyticalConfigurationQueryResults?$select=AnalyticalConfiguration,AnalyticalConfigurationName,Application",
					"Then correct URL in request");
			assert.strictEqual(request.async, true, "Async option set");
			assert.strictEqual(request.method, "GET", "Method set to 'GET'");
			if(testEnv.connectionRefuse){
				fail();
			} else {
				var result = testEnv.hanaResponse || [];
				success({results: result});
			}
		});
	}
	function commonTeardown(){
		LrepConnector.createConnector.restore();
		OData.request.restore();
		sbAdapter._hanaConfigurations = undefined;
		sbAdapter._lrepConfigurations = undefined;
	}
	QUnit.module("Error cases", {
		beforeEach: function (assert){
			commonSetup(this, assert);
		},
		afterEach: function(){
			commonTeardown();
		}
	});
	QUnit.test("No configurations in lrep and hana tables", function(assert){
		assert.expect(7);
		sbAdapter.getConfigurations().done(function(result){
			assert.deepEqual(result,  [], "Empty array returned");
		});
	});
	QUnit.test("Connection refused", function(assert){
		assert.expect(7);
		this.connectionRefuse = true;
		sbAdapter.getConfigurations().done(function(result){
			assert.deepEqual(result,  [], "Empty array returned");
		});
	});
	QUnit.test("Method called multiple times with connection refused", function(assert){
		assert.expect(10);
		this.connectionRefuse = true;
		sbAdapter.getConfigurations().done(function(result){
			assert.deepEqual(result,  [], "Empty array returned");
			sbAdapter.getConfigurations().done(function(result){
				assert.deepEqual(result,  [], "Empty array returned");
				assert.ok(OData.request.calledOnce, "Odata called once");
				assert.strictEqual(this.numberOfLrepCalls, 1, "Lrep called oncce");
			}.bind(this));
		}.bind(this));
	});
	QUnit.module("Configurations returned from lrep", {
		beforeEach: function (assert){
			this.appGuid1 = "123456789";
			this.appGuid2 = "789456123";
			this.configuration1 = "456789123";
			this.configuration2 = "456123789";
			this.lrepResponse = [getApplicationTemplate(this.appGuid1, "Application 1"),
			                 getApplicationTemplate(this.appGuid2, "Application 2"),
			                 getConfigurationTemplate(this.appGuid1, this.configuration1, "sapConfig1"),
			                 getConfigurationTemplate(this.appGuid2, this.configuration2, "sapConfig2")];
			this.standardExpected = [{
			    title: "sapConfig1",
			    id: "" + this.appGuid1 + "." + this.configuration1,
			    runtimeIntent: {
			         semanticObject: "FioriApplication",
			         action: "executeAPFConfigurationS4HANA"
				},
			    modelerIntent: {
			         semanticObject: "FioriApplication",
			         action: "editAPFConfigurationS4HANA"
	             },
	             configurationId: this.configuration1,
	             applicationId: this.appGuid1
			},{
			    title: "sapConfig2",
			    id: "" + this.appGuid2 + "." + this.configuration2,
			    runtimeIntent: {
			         semanticObject: "FioriApplication",
			         action: "executeAPFConfigurationS4HANA"
				},
			    modelerIntent: {
			         semanticObject: "FioriApplication",
			         action: "editAPFConfigurationS4HANA"
	             },
	             configurationId: this.configuration2,
	             applicationId: this.appGuid2
			}];
			commonSetup(this, assert);
		},
		afterEach: function(){
			commonTeardown();
		}
	});
	QUnit.test("Configurations returned", function(assert){
		assert.expect(7);
		sbAdapter.getConfigurations().done(function(result){
			assert.deepEqual(result, this.standardExpected, "Array of configurations returned");
		}.bind(this));
	});

	QUnit.test("Custom runtime intent given as parameters", function(assert){
		assert.expect(7);
		var expected = [{
		    title: "sapConfig1",
		    id: "" + this.appGuid1 + "." + this.configuration1,
		    runtimeIntent: {
		         semanticObject: "Semantic object",
		         action: "Action"
			},
		    modelerIntent: {
		         semanticObject: "FioriApplication",
		         action: "editAPFConfigurationS4HANA"
             },
             configurationId: this.configuration1,
             applicationId: this.appGuid1
		},{
		    title: "sapConfig2",
		    id: "" + this.appGuid2 + "." + this.configuration2,
		    runtimeIntent: {
		         semanticObject: "Semantic object",
		         action: "Action"
			},
		    modelerIntent: {
		         semanticObject: "FioriApplication",
		         action: "editAPFConfigurationS4HANA"
             },
             configurationId: this.configuration2,
             applicationId: this.appGuid2
		}];
		sbAdapter.getConfigurations("Semantic object", "Action").done(function(result){
			assert.deepEqual(result,  expected, "Array of configurations with custom intent returned");
		});
	});
	QUnit.test("Suite on HANA intent given as parameter", function(assert){
		assert.expect(7);
		sbAdapter.getConfigurations("FioriApplication", "executeAPFConfiguration").done(function(result){
			assert.deepEqual(result, this.standardExpected, "Array of configurations with generic runtime S4 intents returned");
		}.bind(this));
	});
	QUnit.test("Incomplete intent given as parameter", function(assert){
		assert.expect(7);
		sbAdapter.getConfigurations("SemanticObject").done(function(result){
			assert.deepEqual(result, this.standardExpected, "Array of configurations with generic runtime S4 intents returned");
		}.bind(this));
	});
	QUnit.test("Empty strings given as parameter", function(assert){
		assert.expect(7);
		sbAdapter.getConfigurations("", "").done(function(result){
			assert.deepEqual(result, this.standardExpected, "Array of configurations with generic runtime S4 intents returned");
		}.bind(this));
	});
	QUnit.module("Configurations returned from hana tables", {
		beforeEach: function (assert){
			this.hanaConfig1 = {
					AnalyticalConfiguration: "2355123123",
					AnalyticalConfigurationName: "TestConfig1",
					Application: "797541238"
			};
			this.hanaConfig2 = {
					AnalyticalConfiguration: "2451231313",
					AnalyticalConfigurationName: "TestConfig2",
					Application: "1234567865"
			};
			this.hanaResponse = [this.hanaConfig1, this.hanaConfig2];
			this.standardExpected = [{
				title: this.hanaConfig1.AnalyticalConfigurationName,
				id: this.hanaConfig1.AnalyticalConfiguration,
				runtimeIntent: {
					semanticObject: "FioriApplication",
					action: "executeAPFConfiguration"
				},
				modelerIntent: {
					semanticObject: "FioriApplication",
					action: "editAPFConfiguration"
				},
				configurationId: this.hanaConfig1.AnalyticalConfiguration,
				applicationId: this.hanaConfig1.Application
			},{
				title: this.hanaConfig2.AnalyticalConfigurationName,
				id: this.hanaConfig2.AnalyticalConfiguration,
				runtimeIntent: {
					semanticObject: "FioriApplication",
					action: "executeAPFConfiguration"
				},
				modelerIntent: {
					semanticObject: "FioriApplication",
					action: "editAPFConfiguration"
				},
				configurationId: this.hanaConfig2.AnalyticalConfiguration,
				applicationId: this.hanaConfig2.Application
			}];
			commonSetup(this, assert);
		},
		afterEach: function(){
			commonTeardown();
		}
	});
	QUnit.test("Configurations returned", function(assert){
		assert.expect(7);
		sbAdapter.getConfigurations().done(function(result){
			assert.deepEqual(result, this.standardExpected, "Array of configurations returned");
		}.bind(this));
	});
	QUnit.test("Custom runtime intent given as parameters", function(assert){
		assert.expect(7);
		var expected = [{
			title: this.hanaConfig1.AnalyticalConfigurationName,
			id: this.hanaConfig1.AnalyticalConfiguration,
			runtimeIntent: {
				semanticObject: "Semantic object",
				action: "Action"
			},
			modelerIntent: {
				semanticObject: "FioriApplication",
				action: "editAPFConfiguration"
			},
			configurationId: this.hanaConfig1.AnalyticalConfiguration,
			applicationId: this.hanaConfig1.Application
		},{
			title: this.hanaConfig2.AnalyticalConfigurationName,
			id: this.hanaConfig2.AnalyticalConfiguration,
			runtimeIntent: {
				semanticObject: "Semantic object",
				action: "Action"
			},
			modelerIntent: {
				semanticObject: "FioriApplication",
				action: "editAPFConfiguration"
			},
			configurationId: this.hanaConfig2.AnalyticalConfiguration,
			applicationId: this.hanaConfig2.Application
		}];
		sbAdapter.getConfigurations("Semantic object", "Action").done(function(result){
			assert.deepEqual(result,  expected, "Array of configurations with custom intent returned");
		});
	});
	QUnit.test("S4 intent given as parameter", function(assert){
		assert.expect(7);
		sbAdapter.getConfigurations("FioriApplication", "executeAPFConfigurationS4HANA").done(function(result){
			assert.deepEqual(result, this.standardExpected, "Array of configurations with generic runtime SoH intents returned");
		}.bind(this));
	});
	QUnit.test("Incomplete intent given as parameter", function(assert){
		assert.expect(7);
		sbAdapter.getConfigurations("SemanticObject").done(function(result){
			assert.deepEqual(result, this.standardExpected, "Array of configurations with generic runtime SoH intents returned");
		}.bind(this));
	});
	QUnit.test("Empty strings given as parameter", function(assert){
		assert.expect(7);
		sbAdapter.getConfigurations("", "").done(function(result){
			assert.deepEqual(result, this.standardExpected, "Array of configurations with generic runtime SoH intents returned");
		}.bind(this));
	});
	QUnit.module("Configurations returned from hana tables and lrep",{
		beforeEach: function(assert){
			commonSetup(this, assert);
			var hanaConfig1 = {
					AnalyticalConfiguration: "2355123123",
					AnalyticalConfigurationName: "TestConfig1",
					Application: "897564321"
			};
			this.hanaResponse = [hanaConfig1];
			var appGuid1 = "123456789";
			var configuration1 = "456789123";
			this.lrepResponse = [getApplicationTemplate(appGuid1, "Application 1"),
			                 getConfigurationTemplate(appGuid1, configuration1, "sapConfig1")];
			this.expected = [{
				title: hanaConfig1.AnalyticalConfigurationName,
				id: hanaConfig1.AnalyticalConfiguration,
				runtimeIntent: {
					semanticObject: "FioriApplication",
					action: "executeAPFConfiguration"
				},
				modelerIntent: {
					semanticObject: "FioriApplication",
					action: "editAPFConfiguration"
				},
				configurationId: hanaConfig1.AnalyticalConfiguration,
				applicationId: hanaConfig1.Application
			},{
				title: "sapConfig1",
				id: "" + appGuid1 + "." + configuration1,
				runtimeIntent: {
					semanticObject: "FioriApplication",
					action: "executeAPFConfigurationS4HANA"
				},
				modelerIntent: {
					semanticObject: "FioriApplication",
					action: "editAPFConfigurationS4HANA"
				},
				configurationId: configuration1,
				applicationId: appGuid1
			}];
		},
		afterEach: function(){
			commonTeardown();
		}
	});
	QUnit.test("Configurations returned", function(assert){
		assert.expect(7);
		sbAdapter.getConfigurations().done(function(result){
			assert.deepEqual(result, this.expected, "Array of configurations returned");
		}.bind(this));
	});
	QUnit.test("Multiple calls result in one request (each) only", function(assert){
		assert.expect(10);
		sbAdapter.getConfigurations().done(function(result){
			assert.deepEqual(result, this.expected, "Array of configurations returned");
			sbAdapter.getConfigurations().done(function(result){
				assert.deepEqual(result, this.expected, "Array of configurations returned");
				assert.ok(OData.request.calledOnce, "Odata called once");
				assert.strictEqual(this.numberOfLrepCalls, 1, "Lrep called oncce");
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Multiple calls, first with custom intent and then without ", function(assert){
		assert.expect(12);
		sbAdapter.getConfigurations().done(function(result){
			assert.deepEqual(result[0].runtimeIntent.semanticObject, "FioriApplication", "Correct standard semanticObject returned");
			assert.deepEqual(result[0].runtimeIntent.action, "executeAPFConfiguration", "Correct standard action returned");
			sbAdapter.getConfigurations("semanticObject", "action").done(function(result){
				assert.deepEqual(result[0].runtimeIntent.semanticObject, "semanticObject", "Correct custom semanticObject returned");
				assert.deepEqual(result[0].runtimeIntent.action, "action", "Correct custom action returned");
				sbAdapter.getConfigurations().done(function(result){
					assert.deepEqual(result[0].runtimeIntent.semanticObject, "FioriApplication", "Correct standard semanticObject returned");
					assert.deepEqual(result[0].runtimeIntent.action, "executeAPFConfiguration", "Correct standard action returned");
				});
			});
		});
	});
	QUnit.module("Get configuration name by ID",{
		beforeEach: function(assert){
			commonSetup(this, assert);
			this.hanaConfig = {
					AnalyticalConfiguration: "2355123123",
					AnalyticalConfigurationName: "SoHConfig"
			};
			this.hanaResponse = [this.hanaConfig];
			this.appGuid = "123456789";
			this.configuration = "456789123";
			this.lrepResponse = [getApplicationTemplate(this.appGuid, "Application"),
			                 getConfigurationTemplate(this.appGuid, this.configuration, "S4Config")];
		},
		afterEach: function(){
			commonTeardown();
		}
	});
	QUnit.test("No parameter", function (assert){
		assert.expect(3);
		sbAdapter.getConfigurationNameById().done(function(configurationName){
			assert.strictEqual(configurationName, "", "Empty String returned");
			assert.ok(!OData.request.called, "Odata never called");
			assert.strictEqual(this.numberOfLrepCalls, 0, "Lrep never called");
		}.bind(this));
	});
	QUnit.test("Empty String as parameter", function (assert){
		assert.expect(3);
		sbAdapter.getConfigurationNameById("").done(function(configurationName){
			assert.strictEqual(configurationName, "", "Empty String returned");
			assert.ok(!OData.request.called, "Odata never called");
			assert.strictEqual(this.numberOfLrepCalls, 0, "Lrep never called");
		}.bind(this));
	});
	QUnit.test("Not available S4 id given", function (assert){
		assert.expect(6);
		sbAdapter.getConfigurationNameById("52135123.215123152").done(function(configurationName){
			assert.strictEqual(configurationName, "", "Empty String returned");
			assert.ok(!OData.request.called, "Odata never called");
			assert.strictEqual(this.numberOfLrepCalls, 1, "Lrep called once");
		}.bind(this));
	});
	QUnit.test("Available S4 id given", function (assert){
		assert.expect(6);
		sbAdapter.getConfigurationNameById(this.appGuid + "." + this.configuration).done(function(configurationName){
			assert.strictEqual(configurationName, "S4Config", "Configuration name returned");
			assert.ok(!OData.request.called, "Odata never called");
			assert.strictEqual(this.numberOfLrepCalls, 1, "Lrep called once");
		}.bind(this));
	});
	QUnit.test("Not available SoH id given", function (assert){
		assert.expect(6);
		sbAdapter.getConfigurationNameById("46845125").done(function(configurationName){
			assert.strictEqual(configurationName, "", "Empty String returned");
			assert.ok(OData.request.calledOnce, "Odata called once");
			assert.strictEqual(this.numberOfLrepCalls, 0, "Lrep never called");
		}.bind(this));
	});
	QUnit.test("Available SoH id given", function (assert){
		assert.expect(6);
		sbAdapter.getConfigurationNameById(this.hanaConfig.AnalyticalConfiguration).done(function(configurationName){
			assert.strictEqual(configurationName, "SoHConfig", "Configuration name returned");
			assert.ok(OData.request.calledOnce, "Odata called once");
			assert.strictEqual(this.numberOfLrepCalls, 0, "Lrep never called");
		}.bind(this));
	});
	QUnit.test("Function uses bufferd data", function (assert){
		assert.expect(11);
		sbAdapter.getConfigurations().done(function(){
			assert.ok(OData.request.calledOnce, "Odata called once");
			assert.strictEqual(this.numberOfLrepCalls, 1, "Lrep called once");
			sbAdapter.getConfigurationNameById(this.hanaConfig.AnalyticalConfiguration).done(function(configurationName){
				assert.strictEqual(configurationName, "SoHConfig", "Configuration name returned");
				assert.ok(OData.request.calledOnce, "Odata still called once");
				assert.strictEqual(this.numberOfLrepCalls, 1, "Lrep still called once");
			}.bind(this));
		}.bind(this));
	});
		function getApplicationTemplate (applicationGuid, applicationName) {
			return {
				"layer": "CUSTOMER",
				"ns": "sap/apf/dt/" + applicationGuid + "/",
				"name": "metadata",
				"fileType": "apfapplication",
				"category": "FILE",
				"metadata": [{
					"name": "createdAt",
					"value": "2015-09-10T11:53:22.9152410Z",
					"category": "system",
					"datatype": "iso8601"
				}, {
					"name": "apfdt-applname",
					"value": applicationName,
					"category": "custom"
				}]};
		}
		function  getConfigurationTemplate(applicationGuid, configurationGuid, configurationName) {
			return {
				"layer": "CUSTOMER",
				"ns": "sap/apf/dt/" + applicationGuid + "/",
				"name": configurationGuid,
				"fileType": "apfconfiguration",
				"category": "FILE",
				"metadata": [{
					"name": "createdAt",
					"value": "2015-09-02T09:06:26.0147340Z",
					"category": "system",
					"datatype": "iso8601"
				}, {
					"name": "apfdt-configname",
					"value": configurationName,
					"category": "custom"
				}]
			};
		}
});