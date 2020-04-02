jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require("sap.apf.testhelper.doubles.coreApi");
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.persistence");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.apf.utils.utils");

(function() {
	'use strict';
	function assertUrlPatternIsContained(assert, sOriginalUri, sExpectedUri, sComment) {
		var sUri = sOriginalUri.replace(/\//g, 'X');
		var sExpected = sExpectedUri.replace(/\//g, 'X');
		var sPosition = sUri.indexOf(sExpected);
		assert.equal(sPosition > -1, true, sComment);
	}
	function commonSetup(testEnv, configurationOfLogicalSystem) {
		var sapClientValue;
		testEnv.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		testEnv.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
			instances : {
				messageHandler : testEnv.oMessageHandler
			}
		});
		testEnv.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError) {
			if (oRequest.requestUri.search('select=LogicalSystem') > -1) {
				this.usedUrlForLogicalSystem = oRequest.requestUri;
				var data = {
					results : [ {
						LogicalSystem : "dummySystem"
					} ]
				};
				doAsyncSuccessCallback(fnSuccess, data);
			} else {
				this.requestSpy = oRequest;
				doAsyncSuccessCallback(fnSuccess, {}, {
					data : "ContentOfNoInterest",
					statusCode : 201,
					statusText : ""
				});
			}
			function doAsyncSuccessCallback(fnctn, arg1, arg2) {
				setTimeout(function() {
					fnctn(arg1, arg2);
				}, 1);
			}	
		}.bind(testEnv);
		testEnv.oCoreApi.getMetadata = function () {
			return jQuery.Deferred().resolve({
				getParameterEntitySetKeyProperties : function(){
					[];
				}
			});
		};
		testEnv.serializableApfState = {
			startFilterHandler : {
				sfh : 'sfh'
			}, 
			filterIdHandler : {
				fih : 'fih'
			}, 
			smartFilterBar : {
				sfb : 'sfb'
			},
			path : {
				indicesOfActiveSteps : [ 0 ],
				steps : [ {
					stepId : 'one',
					binding : {
						selectedRepresentationId : 'reprOne'
					}
				}, {
					stepId : 'two',
					binding : {
						selectedRepresentationId : 'reprTwo'
					}
				} ]
			} 
		};

		if (configurationOfLogicalSystem && configurationOfLogicalSystem.noSapClientValue) {
			sapClientValue = undefined;
		} else {
			sapClientValue = '777';
		}
		testEnv.oCoreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					if (testEnv.analyticalConfigurationId) {
						return {
							configurationId : testEnv.analyticalConfigurationId
						};
					}
					return undefined;
				},
				getSapClient : function() {
					return sapClientValue;
				}
			};
		};
		testEnv.oCoreApi.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		testEnv.oCoreApi.getXsrfToken = function() {
			return sap.apf.utils.createPromise('dummyToken');
		};
		testEnv.spyGetXsrfToken = sinon.spy(testEnv.oCoreApi, 'getXsrfToken');
		if (configurationOfLogicalSystem && configurationOfLogicalSystem.withoutLogicalSystem) {
			testEnv.oCoreApi.getPersistenceConfiguration = function() {
				return jQuery.Deferred().resolve({
					"path" : {
						"service" : "/sap/hba/r/apf/core/odata/apf.xsodata",
						"entitySet" : sap.apf.core.constants.entitySets.analysisPath
					}
				});
			};
		} else if (configurationOfLogicalSystem && configurationOfLogicalSystem.customerSpecificEntitySet) {
			testEnv.oCoreApi.getPersistenceConfiguration = function() {
				return jQuery.Deferred().resolve({
					"path" : {
						"service" : "/sap/hba/r/apf/core/odata/apf.xsodata",
						"entitySet" : sap.apf.core.constants.entitySets.analysisPath
					},
					"logicalSystem" : {
						"service" : "/sapperlot/odata/wca.xsodata",
						"entitySet" : "CustomerDefinedQueryForLogicalSystem"
					}
				});
			};
		} else {
			testEnv.oCoreApi.getPersistenceConfiguration = function() {
				return jQuery.Deferred().resolve({
					"path" : {
						"service" : "/sap/hba/r/apf/core/odata/apf.xsodata",
						"entitySet" : sap.apf.core.constants.entitySets.analysisPath
					},
					"logicalSystem" : {
						"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
					}
				});
			};
		}
		testEnv.oCoreApi.getApplicationConfigurationURL = function() {
			return "/path/to/applicationConfiguration.json";
		};
		testEnv.oCoreApi.ajax = sap.apf.core.ajax;
		testEnv.oCoreApi.getEntityTypeMetadata = function(sAbsolutePathToServiceDocument, sEntityType) {
			return jQuery.Deferred().resolve({metadata : 'maxPaths, maxLengths'});
		};
		testEnv.oCoreApi.getCumulativeFilter = function() {
			var deferred = jQuery.Deferred();
			var filter = new sap.apf.core.utils.Filter(testEnv.oMessageHandler, "SAPClient", "eq", "999");
			filter = filter.addAnd(new sap.apf.core.utils.Filter(testEnv.oMessageHandler, "PropertyOfNoInterest", "eq", "333"));
			deferred.resolve(filter);
			return deferred.promise();
		};
		testEnv.persistence = new sap.apf.core.Persistence({
			instances: {
				messageHandler : testEnv.oMessageHandler,
				coreApi : testEnv.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
	}
	QUnit.module('CRUD functions', {
		beforeEach : function(assert) {
			commonSetup(this, false);
			this.expectedStructuredAnalysisPath = {
				steps : [ {
					stepId : "one",
					selectedRepresentationId : "reprOne"
				}, {
					stepId : "two",
					selectedRepresentationId : "reprTwo"
				} ],
				indexOfActiveStep : 0
			};
		}
	});
	QUnit.test('createPath()', function(assert) {
		assert.expect(13);
		var done = assert.async();
		this.persistence.createPath('myPath', callbackCreate.bind(this), this.serializableApfState);
		function callbackCreate() {
			var data = this.requestSpy.data;
			assert.equal(this.spyGetXsrfToken.getCall(0).args[0], '/sap/hba/apps/wca/dso/s/odata/wca.xsodata', 'Correct service root for requesting XSRF token for logical system service');
			assert.equal(this.spyGetXsrfToken.getCall(1).args[0], '/sap/hba/r/apf/core/odata/apf.xsodata', 'Correct service root for requesting XSRF token for persistence service');
			assert.equal(this.requestSpy.method, 'POST', 'Correct request method');
			assertUrlPatternIsContained(assert, this.requestSpy.requestUri, '/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults', 'Correct request URI');
			assert.equal(this.requestSpy.headers['x-csrf-token'],'dummyToken', 'Correct request XSRF Token');
			assert.strictEqual(data.AnalyticalConfiguration, undefined, 'Analytical Configuration is not existing when no startparameter set');
			assert.strictEqual(data.AnalysisPath, '', 'No need to provide a valid AnalysisPath ID');
			assert.equal(data.AnalysisPathName, 'myPath', 'Correct AnalysisPathName');
			assert.equal(data.ApplicationConfigurationURL, 'comp1', 'Correct ApplicationConfigurationURL');
			assert.equal(data.LogicalSystem, 'dummySystem', 'LogicalSystem');
			assert.ok(this.usedUrlForLogicalSystem.search('SAPClientQuery') > -1, 'Default entity set used for logical system search');
			var expectedSerializableApfState = jQuery.extend(true, {}, this.serializableApfState);
			assert.deepEqual(JSON.parse(data.StructuredAnalysisPath), this.expectedStructuredAnalysisPath, 'Correct structured analysis path');
			assert.deepEqual(JSON.parse(data.SerializedAnalysisPath), expectedSerializableApfState, 'Correct serializable APF state');
			done();
		}
	});
	QUnit.test('deletePath()', function(assert) {
		assert.expect(3);
		var done = assert.async();
		this.persistence.deletePath("myPathID", callbackDelete.bind(this));
		function callbackDelete() {
			assert.equal(this.requestSpy.method,"DELETE", "Correct request method");
			assertUrlPatternIsContained(assert, this.requestSpy.requestUri, "/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults('myPathID')", "Correct request uri");
			assert.strictEqual(this.requestSpy.data, undefined, "No need of data");
			done();
		}
	});
	QUnit.test('modifyPath()', function(assert) {
		assert.expect(10);
		var done = assert.async();
		this.analyticalConfigurationId = "999";
		this.persistence.modifyPath("myPathID", "myPath", callbackModify.bind(this), this.serializableApfState);
		function callbackModify() {
			var expectedSerializableApfState;
			var data = this.requestSpy.data;
			assert.ok(this.requestSpy.method === "PUT", "Correct request method");
			assertUrlPatternIsContained(assert, this.requestSpy.requestUri, "/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults('myPathID')", "Correct request uri");
			assert.ok(this.requestSpy.headers['x-csrf-token'] === "dummyToken", "Correct request XSRF Token");
			assert.equal(data.AnalysisPath, "myPathID", "AnalysisPath is set");
			assert.ok(data.AnalysisPathName === "myPath", "Correct AnalysisPathName");
			assert.ok(data.ApplicationConfigurationURL === "comp1", "Correct ApplicationConfigurationURL");
			assert.ok(data.LogicalSystem === "dummySystem", "LogicalSystem");
			assert.equal(data.AnalyticalConfiguration, "999", "THEN analytical configuration id is set");
			expectedSerializableApfState = jQuery.extend(true, {}, this.serializableApfState);
			assert.deepEqual(JSON.parse(data.StructuredAnalysisPath), this.expectedStructuredAnalysisPath, "Correct StructuredAnalysisPath");
			assert.deepEqual(JSON.parse(data.SerializedAnalysisPath), expectedSerializableApfState, "Correct SerializedAnalysisPath");
			done();
		}
	});
	QUnit.test('modifyPath() without analytical configuration id from start parameters', function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.analyticalConfigurationId = undefined;
		this.persistence.modifyPath("myPathID", "myPath", callbackModify.bind(this), this.serializableApfState);
		function callbackModify() {
			var data = this.requestSpy.data;
			assert.equal(data.AnalyticalConfiguration, undefined, "THEN analytical configuration id is NOT set");
			done();
		}
	});
	QUnit.test('openPath()', function(assert) {
		assert.expect(5);
		var done = assert.async();
		this.persistence.openPath("myPathID", callbackOpen.bind(this));
		function callbackOpen(response, metadata) {
			assert.equal(this.requestSpy.method, 'GET', "Correct request method");
			assertUrlPatternIsContained(assert, this.requestSpy.requestUri, "/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults('myPathID')", "Correct request uri");
			assert.equal(this.requestSpy.headers['x-csrf-token'], "dummyToken", "Correct request XSRF Token");
			assert.equal(response.path, 'ContentOfNoInterest', 'Serialized data contain in callback as first parameter');
			assert.deepEqual(metadata, {metadata : 'maxPaths, maxLengths'}, 'Second parameter in callback is persistence service metadata');
			done();
		}
	});

	QUnit.test('readPaths', function(assert) {
		assert.expect(3);
		var done = assert.async();
		this.persistence.readPaths(callbackRead.bind(this));
		function callbackRead() {
			assert.equal(this.requestSpy.method, "GET", "Correct request method");
			assertUrlPatternIsContained(
				assert,
				this.requestSpy.requestUri,
				"/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults?$select=AnalysisPath,AnalysisPathName,StructuredAnalysisPath,CreationUTCDateTime,LastChangeUTCDateTime&$filter=(LogicalSystem%20eq%20'dummySystem'%20and%20ApplicationConfigurationURL%20eq%20'comp1')&$orderby=LastChangeUTCDateTime%20desc",
				"Correct request uri"
			);
			assert.ok(this.requestSpy.headers['x-csrf-token'] === "dummyToken", "Correct request XSRF Token");
			done();
		}
	});
	
	QUnit.test('createPath and readPaths with analytical configuration id', function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.oCoreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return { configurationId: 'dummyConfigurationId'};
				},
				getSapClient : function() {
					return '777';
				}
			};
		};
		this.persistence.createPath('myPath', callbackCreate.bind(this), this.serializableApfState);
		function callbackCreate() {
			assert.equal(this.requestSpy.data.AnalyticalConfiguration, "dummyConfigurationId", "Analytical Configuration is set when startparameter set");
			this.persistence.readPaths(callbackRead.bind(this));
		}
		function callbackRead() {
			assertUrlPatternIsContained(
					assert,
					this.requestSpy.requestUri,
					"/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults?$select=AnalysisPath,AnalysisPathName,StructuredAnalysisPath,CreationUTCDateTime,LastChangeUTCDateTime&$filter=(AnalyticalConfiguration%20eq%20'dummyConfigurationId'%20and%20LogicalSystem%20eq%20'dummySystem'%20and%20ApplicationConfigurationURL%20eq%20'comp1')&$orderby=LastChangeUTCDateTime%20desc",
			"Correct request uri");
			done();
		}
	});
	
	QUnit.test('createPath and readPaths with application id & analytical configuration id', function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.oCoreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return {
						applicationId :'ApplicationId',
						configurationId : 'ConfigurationId'
					};
				},
				getSapClient : function() {
					return '777';
				}
			};
		};
		this.persistence.createPath('myPath', callbackCreate.bind(this), this.serializableApfState);
		function callbackCreate() {
			assert.equal(this.requestSpy.data.AnalyticalConfiguration, "ConfigurationId", "Analytical Configuration is set when startparameter set");
			this.persistence.readPaths(callbackRead.bind(this));
		}
		function callbackRead() {
			assertUrlPatternIsContained(
					assert,
					this.requestSpy.requestUri,
					"/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults?$select=AnalysisPath,AnalysisPathName,StructuredAnalysisPath,CreationUTCDateTime,LastChangeUTCDateTime&$filter=(AnalyticalConfiguration%20eq%20'ConfigurationId'%20and%20LogicalSystem%20eq%20'dummySystem'%20and%20ApplicationConfigurationURL%20eq%20'comp1')&$orderby=LastChangeUTCDateTime%20desc",
			"Correct request uri");
			done();
		}
	});
	QUnit.module('Logical system handling for createPath()');
	QUnit.test('Without logical system configuration', function(assert) {
		assert.expect(2);
		var configurationOfLogicalSystem = {
			withoutLogicalSystem : true
		};
		this.usedUrlForLogicalSystem = "notUsed";
		commonSetup(this, configurationOfLogicalSystem);
		var done = assert.async();
		
		this.persistence.createPath("myPath", callbackCreate.bind(this), this.serializableApfState);
		function callbackCreate() {
			assert.ok(this.requestSpy.data.LogicalSystem === "777", "THEN SAP CLient as LogicalSystem");
			assert.equal(this.usedUrlForLogicalSystem, "notUsed", "THEN no request for logical system was performed");
			done();
		}
	});
	QUnit.test('Customer defined logical system configuration', function(assert) {
		assert.expect(3);
		var configurationOfLogicalSystem = {
			customerSpecificEntitySet : true
		};
		this.usedUrlForLogicalSystem = "notUsed";
		commonSetup(this, configurationOfLogicalSystem);
		var done = assert.async();
		
		this.persistence.createPath("myPath", callbackCreate.bind(this), this.serializableApfState);
		function callbackCreate() {
			assert.ok(this.requestSpy.data.LogicalSystem === "dummySystem", "THEN dummy system was found as LogicalSystem");
			assert.ok(this.usedUrlForLogicalSystem.search("sapperlot") > -1, "THEN customer defined service root was used");
			assert.ok(this.usedUrlForLogicalSystem.search("CustomerDefinedQueryForLogicalSystem") > -1, "THEN customer defined entity set was used");
			done();
		}
	});
	QUnit.test('Use SapClient for logical system from cummulative filter', function(assert) {
		assert.expect(1);
		var configurationOfLogicalSystem = {
			noSapClientValue : true,
			withoutLogicalSystem : true
		};
		this.usedUrlForLogicalSystem = "notUsed";
		commonSetup(this, configurationOfLogicalSystem);
		var done = assert.async();
		
		this.persistence.createPath("myPath", callbackCreate.bind(this), this.serializableApfState);
		function callbackCreate() {
			assert.ok(this.requestSpy.data.LogicalSystem === "999", "THEN SAP CLient from cummulative filter was taken");
			done();
		}
	});
}());