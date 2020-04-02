/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.utils.utils');
jQuery.sap.require('sap.apf.core.odataProxy');
jQuery.sap.require('sap.apf.core.odataRequest');
jQuery.sap.require('sap.apf.core.utils.filter');
(function() {
	'use strict';
	function commonSetupOdataProxy(assert, context, statusCode, statusText) {
		var that = context;
		var thatAssert = assert;
		var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		context.messageHandler = messageHandler;
		context.serviceRoots = [];
		var coreApi = {
			check : function(oBooleExpr) {
				messageHandler.check(oBooleExpr);
			},
			putMessage : function(oMessageObject) {
				messageHandler.putMessage(oMessageObject);
			},
			createMessageObject : function(oConf) {
				messageHandler.createMessageObject(oConf);
			},
			getXsrfToken : function() {
				return sap.apf.utils.createPromise('dummyToken');
			},
			getEntityTypeMetadata : function(sServiceRoot, entityType) {
				context.serviceRoots.push(sServiceRoot);
				var entityTypeMetadata = {
						meta : "data",
						getPropertyMetadata : function() {
							return {
								dataType : {
									type : "Edm.String"
								}
							};
						}
					};
					return jQuery.Deferred().resolve(entityTypeMetadata);
			},
			odataRequest : function(oRequest, fnSuccess, fnError) {
				that.request = oRequest;
				var returnedData = [];
				if (oRequest.data && oRequest.data.__batchRequests) {
					var resultData = {
						data : {
							results : [ {
								name1 : "value1"
							}, {
								name1 : "value2"
							} ]
						}
					};
					returnedData.push(resultData);
					resultData = {
						data : {
							results : []
						}
					};
					returnedData.push(resultData);
					fnSuccess({
						__batchResponses : returnedData
					}, {});
				} else {
					fnSuccess({
						results : []
					}, {
						data : "ContentOfNoInterest",
						statusCode : statusCode,
						statusText : statusText
					});
				}
			}
		};
		context.odataProxy = new sap.apf.core.OdataProxy({
			serviceRoot : "/serviceRoot"
		}, {
			instances : {
				coreApi : coreApi,
				messageHandler : messageHandler
			}
		});
		context.assertSuccess = function(result, metadata, oMessageObject) {
			thatAssert.equal(oMessageObject, undefined, "No error");
			thatAssert.equal(metadata.meta, "data", "expected metadata object");
		};
		context.assertSuccessWithNoResultData = function(metadata, oMessageObject) {
			thatAssert.equal(oMessageObject, undefined, "No error");
			thatAssert.equal(metadata.meta, "data", "expected metadata object");
		};
	}
	QUnit.module("M1: Read operations of OdataProxy", {
		beforeEach : function(assert) {
			commonSetupOdataProxy(assert, this, 201, "NotOfInterest");
			this.assertSuccessOnReadCollection = function(applications, metadata, oMessageObject) {
				assert.equal(oMessageObject, undefined, "No error");
				assert.equal(metadata.meta, "data", "THEN expected metadata object");
				assert.notEqual(applications.length, undefined, "THEN Array of Applications returned");
			};
			this.assertSuccessOnReadEntity = function(applications, metadata, oMessageObject) {
				assert.equal(oMessageObject, undefined, "No error");
				assert.equal(metadata.meta, "data", "expected metadata object");
			};
		}
	});
	QUnit.test("WHEN Read all Applications", function(assert) {
		assert.expect(6);
		this.odataProxy.readCollection("application", this.assertSuccessOnReadCollection);
		assert.equal(this.request.requestUri, "/serviceRoot/$batch", "THEN the correct url for batch");
		assert.equal(this.request.data.__batchRequests[0].requestUri, "ApplicationQueryResults?$orderby=ApplicationName", "THEN the correct url in the batch request");
		assert.equal(this.serviceRoots[0], "/serviceRoot", "Correct serviceRoot provided for fetching metadata in method readSingleCollectionInBatch");
	});

	QUnit.test("WHEN Read all Configurations", function(assert) {
		assert.expect(4);
		this.odataProxy.readCollection("configuration", this.assertSuccessOnReadCollection);
		assert.equal(this.request.data.__batchRequests[0].requestUri, "AnalyticalConfigurationQueryResults", "THEN correct url");
	});
	QUnit.test("Read all Configurations with restriction to selected fields", function(assert) {
		assert.expect(4);
		this.odataProxy.readCollection("configuration", this.assertSuccessOnReadCollection, undefined, [ "AnalyticalConfiguration", "AnalyticalConfigurationName", "Application", "CreatedByUser", "CreationUTCDateTime", "LastChangeUTCDateTime",
				"LastChangedByUser" ]);
		assert.equal(this.request.data.__batchRequests[0].requestUri,
				"AnalyticalConfigurationQueryResults?$select=AnalyticalConfiguration,AnalyticalConfigurationName,Application,CreatedByUser,CreationUTCDateTime,LastChangeUTCDateTime,LastChangedByUser", "correct url");
	});
	
	QUnit.test("Read all Configurations of an Application", function(assert) {
		assert.expect(5);
		var oFilter = new sap.apf.core.utils.Filter(this.messageHandler, "Application", "eq", "applicationGuid");
		this.odataProxy.readCollection("configuration", this.assertSuccessOnReadCollection, undefined, [ "AnalyticalConfiguration", "AnalyticalConfigurationName", "Application", "CreatedByUser", "CreationUTCDateTime",
				"LastChangeUTCDateTime", "LastChangedByUser" ], oFilter);
		assert.equal(this.request.data.__batchRequests[0].requestUri,
			"AnalyticalConfigurationQueryResults?$select=AnalyticalConfiguration,AnalyticalConfigurationName,Application,CreatedByUser,CreationUTCDateTime,LastChangeUTCDateTime,LastChangedByUser&$filter=(Application%20eq%20%27applicationGuid%27)",
			"correct url");
		assert.equal(this.serviceRoots[0], "/serviceRoot", "Correct serviceRoot provided for fetching metadata in method buildUrlForReadCollection");
	});
	QUnit.test("Read a specific application", function(assert) {
		assert.expect(3);
		this.odataProxy.readEntity("application", this.assertSuccessOnReadEntity, [ {
			name : "Application",
			value : "applicationGuid"
		} ]);
		assert.equal(this.request.requestUri, "/serviceRoot/ApplicationQueryResults('applicationGuid')", "correct url");
	});
	QUnit.test("Read texts - two input parameters", function(assert) {
		assert.expect(3);
		var parameters = [ {
			name : "TextElement",
			value : "textGuid"
		}, {
			name : 'Language',
			value : 'NN'
		} ];
		this.odataProxy.readEntity("texts", this.assertSuccessOnReadEntity, parameters);
		assert.equal(this.request.requestUri, "/serviceRoot/TextElementQueryResults(TextElement='textGuid',Language='NN')", "correct url");
	});
	
	QUnit.module("M: Create operations of OdataProxy", {
		beforeEach : function(assert) {
			commonSetupOdataProxy(assert, this, 201, "");
		}
	});
	QUnit.test("Create an Application", function(assert) {
		assert.expect(4);
		var applicationData = {
			Application : "noInterest",
			ApplicationName : "Test",
			SemanticObject : "aSemanticObject"
		};
		this.odataProxy.create("application", applicationData, this.assertSuccess);
		assert.equal(this.request.requestUri, "/serviceRoot/ApplicationQueryResults", "correct url");
		assert.equal(this.serviceRoots[0], "/serviceRoot", "Correct serviceRoot provided for fetching metadata in method successOnCreate");
	});
	QUnit.test("Create a Configuration", function(assert) {
		assert.expect(3);
		var configurationData = {
			AnalyticalConfiguration : "InternalID-1",
			AnalyticalConfigurationName : "Test",
			SerializedAnalyticalConfiguration : '{"steps":[]}'
		};
		this.odataProxy.create("configuration", configurationData, this.assertSuccess);
		assert.equal(this.request.requestUri, "/serviceRoot/AnalyticalConfigurationQueryResults", "correct url");
	});
	QUnit.test("Configuration Header", function(assert) {
		assert.expect(4);
		var configurationData = {
				AnalyticalConfiguration : "InternalID-1",
				AnalyticalConfigurationName : "Test",
				SerializedAnalyticalConfiguration : '{"steps":[]}'
		};
		var expected = {
			steps: [],
			configHeader : {
				AnalyticalConfiguration : "InternalID-1",
				AnalyticalConfigurationName : "Test"
			}
		};
		this.odataProxy.create("configuration", configurationData, this.assertSuccess);
		var result = JSON.parse(this.request.data.SerializedAnalyticalConfiguration);
		assert.deepEqual(result, expected, "Searialized analytical configuration enriched by configuration header");
		assert.equal(this.serviceRoots[0], "/serviceRoot", "Correct serviceRoot provided for fetching metadata in method successOnUpdate");
	});
	QUnit.module("M: Update operations of OdataProxy", {
		beforeEach : function(assert) {
			commonSetupOdataProxy(assert, this, 204, "NoInterest");
		}
	});
	QUnit.test("Update an Application", function(assert) {
		assert.expect(3);
		var applicationData = {
			Application : "applicationGuid",
			ApplicationName : "Test",
			SemanticObject : "aSemanticObject"
		};
		this.odataProxy.update("application", applicationData, this.assertSuccessWithNoResultData, [ {
			name : "Application",
			value : "applicationGuid"
		} ]);
		assert.equal(this.request.requestUri, "/serviceRoot/ApplicationQueryResults('applicationGuid')", "correct url");
	});
	QUnit.test("Configuration Header", function(assert) {
		assert.expect(3);
		var configurationData = {
				AnalyticalConfiguration : "InternalID-1",
				AnalyticalConfigurationName : "Test",
				SerializedAnalyticalConfiguration : '{"steps":[]}'
		};
		var expected = {
			steps: [],
			configHeader : {
				AnalyticalConfiguration : "InternalID-1",
				AnalyticalConfigurationName : "Test"
			}
		};
		this.odataProxy.update("configuration", configurationData, this.assertSuccessWithNoResultData);
		var result = JSON.parse(this.request.data.SerializedAnalyticalConfiguration);
		assert.deepEqual(result, expected, "Searialized analytical configuration enriched by configuration header");
	});
	QUnit.module("M: Delete operations of OdataProxy", {
		beforeEach : function(assert) {
			commonSetupOdataProxy(assert, this, 204, "");
		}
	});
	QUnit.test("Delete an Application", function(assert) {
		assert.expect(4);
		this.odataProxy.remove("application", [ {
			name : "Application",
			value : "applicationGuid"
		} ], this.assertSuccessWithNoResultData);
		assert.equal(this.request.requestUri, "/serviceRoot/ApplicationQueryResults('applicationGuid')", "correct url");
		assert.equal(this.serviceRoots[0], "/serviceRoot", "Correct serviceRoot provided for fetching metadata in method successOnDelete");
		
	});
	QUnit.module("M: Error handling of OdataProxy", {
		beforeEach : function(assert) {
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().spyPutMessage();
			var coreApi = {
				check : function(oBooleExpr) {
					messageHandler.check(oBooleExpr);
				},
				putMessage : function(oMessageObject) {
					messageHandler.putMessage(oMessageObject);
				},
				createMessageObject : function(oConf) {
					messageHandler.createMessageObject(oConf);
				},
				getXsrfToken : function() {
					return sap.apf.utils.createPromise('dummyToken');
				},
				getEntityTypeMetadata : function(sServiceRoot, entityType) {
					var entityTypeMetadata =  {
							meta : "data"
						};
						return jQuery.Deferred().resolve(entityTypeMetadata);
				},
				odataRequest : function(oRequest, fnSuccess, fnError) {
					var oInject = {
						instances: {
							datajs: OData
						},
						functions : {
							getSapSystem : function() {
								return undefined;
							}
						}
					};
					sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError);
				}
			};
			this.odataProxy = new sap.apf.core.OdataProxy({
				serviceRoot : "/serviceRoot",
				entityTypes : {
					application : 'ApplicationQueryResults'
				}
			}, {
				instances : {
					coreApi : coreApi,
					messageHandler : messageHandler
				}
			});
			this.server = sinon.fakeServer.create();
		},
		afterEach : function(assert) {
			this.server.restore();
		}
	});
	QUnit.test("Error when reading all Applications", function(assert) {
		var done = assert.async();
		var thatAssert = assert;
		assert.expect(3);
		this.server.respondWith([ 400, {}, '' ]);
		this.server.autoRespond = true;
		var assertErrorHasBeenHandled = function(applications, metadata, oMessageObject) {
			thatAssert.equal(oMessageObject.code, 11005, "Expected Error Code");
			thatAssert.equal(metadata, undefined, "expected metadata object");
			thatAssert.equal(applications, undefined, "Array of Applications returned");
			done();
		};
		this.odataProxy.readCollection("application", assertErrorHasBeenHandled);
	});
	QUnit.module("M: readCollectionsInBatch", {
		beforeEach : function(assert) {
			var that = this;
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.messageHandler = messageHandler;
			this.serviceRoots = [];
			var coreApi = {
				check : function(oBooleExpr) {
					messageHandler.check(oBooleExpr);
				},
				putMessage : function(oMessageObject) {
					messageHandler.putMessage(oMessageObject);
				},
				createMessageObject : function(oConf) {
					messageHandler.createMessageObject(oConf);
				},
				getXsrfToken : function() {
					return sap.apf.utils.createPromise('dummyToken');
				},
				getEntityTypeMetadata : function(sServiceRoot, entityType) {
					that.serviceRoots.push(sServiceRoot);
					var entityTypeMetadata = {
						meta : "data",
						getPropertyMetadata : function() {
							return {
								dataType : {
									type : "Edm.String"
								}
							};
						}
					};
					return jQuery.Deferred().resolve(entityTypeMetadata);
				},
				odataRequest : function(oRequest, fnSuccess, fnError, batchHandler) {
					that.request = oRequest;
					var returnedData = [];
					var resultData = {
						data : {
							results : [ {
								name1 : "value1"
							}, {
								name1 : "value2"
							} ]
						}
					};
					returnedData.push(resultData);
					resultData = {
						data : {
							results : [ {
								name2 : "value3"
							}, {
								name2 : "value4"
							} ]
						}
					};
					returnedData.push(resultData);
					fnSuccess({
						__batchResponses : returnedData
					}, {});
				}
			};
			this.odataProxy = new sap.apf.core.OdataProxy({
				serviceRoot : "/serviceRoot",
				entityTypes : {
					application : 'ApplicationQueryResults',
					configuration : 'AnalyticalConfigurationQueryResults',
					texts : 'AnalyticalTexts'
				}
			}, {
				instances : {
					coreApi : coreApi,
					messageHandler : messageHandler
				}
			});
		}
	});
	QUnit.test("M: Read 2 collections with filter in batch", function(assert) {
		assert.expect(5);
		var assertSuccess = function(data, messageObject) {
			assert.equal(messageObject, undefined, "No error expected");
			assert.equal(data.length, 2);
			assert.deepEqual(data[0], [ {
				name1 : "value1"
			}, {
				name1 : "value2"
			} ], "Correct returned data");
		};
		var batchRequests = [];
		var oFilterForApplication = new sap.apf.core.utils.Filter(this.messageHandler, "Application", "eq", "applictionId");
		var oFilterForTexts = new sap.apf.core.utils.Filter(this.messageHandler, "Language", "eq", "zy");
		oFilterForTexts.addAnd(oFilterForApplication);
		batchRequests.push({
			entitySetName : "texts",
			filter : oFilterForTexts
		});
		batchRequests.push({
			entitySetName : "configuration",
			filter : oFilterForApplication
		});
		this.odataProxy.readCollectionsInBatch(batchRequests, assertSuccess);
		assert.equal(this.request.requestUri, "/serviceRoot/$batch", "correct url");
		assert.equal(this.serviceRoots[0], "/serviceRoot", "Correct serviceRoot provided for fetching metadata in method buildBatchRequests");
	});
	QUnit.test("M: Read collections asynchronously", function(assert) {
		assert.expect(1);
		var batchRequest = [{
			entitySetName : "configuration",
			filter : new sap.apf.core.utils.Filter(this.messageHandler, "Application", "eq", "applictionId")
		}];
		this.odataProxy.readCollectionsInBatch(batchRequest, function() {
			assert.equal(this.request.async, true, "request is send asynchronously");
		}.bind(this));
		
	});
	QUnit.module("M: changeRequestsInBatch", {
		beforeEach : function(assert) {
			var that = this;
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.messageHandler = messageHandler;
			this.serviceRoots = [];
			var coreApi = {
				check : function(oBooleExpr) {
					messageHandler.check(oBooleExpr);
				},
				putMessage : function(oMessageObject) {
					messageHandler.putMessage(oMessageObject);
				},
				createMessageObject : function(oConf) {
					messageHandler.createMessageObject(oConf);
				},
				getXsrfToken : function() {
					return sap.apf.utils.createPromise('dummyToken');
				},
				getEntityTypeMetadata : function(sServiceRoot, entityType) {
					that.serviceRoots.push(sServiceRoot);
					var  entityTypeMetadata = {
						meta : "data",
						getPropertyMetadata : function() {
							return {
								dataType : {
									type : "Edm.String"
								}
							};
						}
					};
					return jQuery.Deferred().resolve(entityTypeMetadata);
			
				},
				odataRequest : function(oRequest, fnSuccess, fnError, batchHandler) {
					that.request = oRequest;
					var returnedData = [];
					var resultData = {
						data : "",
						statusCode : 204,
						statusText : ""
					};
					returnedData.push(resultData);
					resultData = {
						data : "",
						statusCode : 204,
						statusText : ""
					};
					returnedData.push(resultData);
					fnSuccess({
						__batchResponses : [ {
							__changeResponses : returnedData
						} ]
					}, {});
				}
			};
			this.odataProxy = new sap.apf.core.OdataProxy({
				serviceRoot : "/serviceRoot",
				entityTypes : {
					application : 'ApplicationQueryResults',
					configuration : 'AnalyticalConfigurationQueryResults',
					texts : 'AnalyticalTexts'
				}
			}, {
				instances : {
					coreApi : coreApi,
					messageHandler : messageHandler
				}
			});
		}
	});
	QUnit.test("M: Multiple deletes with filter in batch", function(assert) {
		assert.expect(3);
		var assertSuccess = function(messageObject) {
			assert.equal(messageObject, undefined, "No error expected");
		};
		var batchRequests = [];
		var oFilterForApplication = new sap.apf.core.utils.Filter(this.messageHandler, "Application", "eq", "applictionId");
		var oFilterForTexts = new sap.apf.core.utils.Filter(this.messageHandler, "Language", "eq", "zy");
		oFilterForTexts.addAnd(oFilterForApplication);
		batchRequests.push({
			method : "DELETE",
			entitySetName : "texts",
			filter : oFilterForTexts
		});
		batchRequests.push({
			method : "DELETE",
			entitySetName : "configuration",
			filter : oFilterForApplication
		});
		this.odataProxy.doChangeOperationsInBatch(batchRequests, assertSuccess);
		assert.equal(this.request.requestUri, "/serviceRoot/$batch", "correct url");
		assert.equal(this.serviceRoots[0], "/serviceRoot", "Correct serviceRoot provided for fetching metadata in method buildBatchRequests");
	});
}());
