jQuery.sap.declare("test.sap.apf.core.tRequest");
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfMessageHandler");
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require("sap.apf.testhelper.mockServer.wrapper");
jQuery.sap.require("sap.apf.testhelper.createDefaultAnnotationHandler");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.apf.core.utils.checkForTimeout");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.core.metadataFactory");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filterTerm");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.utils.startParameter");
jQuery.sap.require("sap.apf.core.request");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.core.resourcePathHandler");
jQuery.sap.require("sap.apf.core.textResourceHandler");
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.messageHandler");
jQuery.sap.require("sap.apf.core.messageDefinition");
jQuery.sap.require("sap.apf.core.ajax");
jQuery.sap.require("sap.apf.core.request");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.apf.core.utils.filterSimplify");
jQuery.sap.require("sap.apf.core.utils.fileExists");

/*eslint no-invalid-this:0*/

/*global OData:true*/

(function() {
	'use strict';

	function commonSetup(oContext, inject, useAsyncPromises) {
		var deferredEntityTypeMetadata = jQuery.Deferred();
		
		
		function defineFilterOperators() {
			jQuery.extend(oContext, sap.apf.core.constants.FilterOperators);
		}
		oContext.Filter = sap.apf.core.utils.Filter;
		var odataRequestWrapper = (inject && inject.functions && inject.functions.odataRequestWrapper) || sap.apf.core.odataRequestWrapper;
		defineFilterOperators();
		var oMessageHandler = (inject && inject.instances && inject.instances.messageHandler) || new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		oContext.oMessageHandler = oMessageHandler;
		if (!oContext.oCoreApi) {
			oContext.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : oMessageHandler
				}
			});
		}
		oContext.oCoreApi.getXsrfToken = function(sServiceRootPath) {
			return sap.apf.utils.createPromise("xsrfToken");

		};
		oContext.oCoreApi.getStartParameterFacade = function() {
			return new sap.apf.utils.StartParameter();
		};
		oContext.oMetadataDouble = new sap.apf.testhelper.doubles.Metadata({
			instances: {
				messageHandler : oMessageHandler
			},
			constructors : {
				Hashtable : sap.apf.utils.Hashtable
			}
		});
		if (useAsyncPromises) {
			oContext.oCoreApi.getMetadata = function() {
				var deferred = jQuery.Deferred();
				setTimeout(function(){
					deferred.resolve(oContext.oMetadataDouble);
				}, 1);
				return deferred.promise();
			};
		} else {
			oContext.oCoreApi.getMetadata = function() {
				return jQuery.Deferred().resolve(oContext.oMetadataDouble);
			};
		}
		
		if (useAsyncPromises) {
			deferredEntityTypeMetadata = jQuery.Deferred();
			oContext.oCoreApi.getEntityTypeMetadata = function(){
				
				setTimeout(function() {
					deferredEntityTypeMetadata.resolve({});
				}, 1);
				return deferredEntityTypeMetadata.promise();
			};
		} else {
			oContext.oCoreApi.getEntityTypeMetadata = function(){
				var deferred = jQuery.Deferred();
				deferred.resolve({});
				return deferred.promise();
			};
		}
		
		oContext.oCoreApi.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		oContext.oCoreApi.odataRequest = ( inject && inject.functions && inject.functions.odataRequest ) || function(oRequest, fnSuccess, fnError, oBatchHandler) {
			var oInject = {
				instances : {
					datajs : {
						request : function() {
						}
					}
				},
				functions : {
					getSapSystem : function() { return undefined; }
				}
			};
			odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
		};
		oContext.oCoreApi.ajax = function(context) {
			var ajax = ( inject && inject.functions && inject.functions.ajax ) || jQuery.ajax;
			ajax(context);
		};
	}

	function setupCoreAndMessageHandling(oContext, bSaveConstructors, bFilterReductionIsActive, inject) {
		var oMessageHandler = new (inject && inject.constructors && inject.constructors.MessageHandler || sap.apf.testhelper.doubles.MessageHandler)().doubleCheckAndMessaging().supportLoadConfigWithoutAction();
		oContext.oMessageHandler = oMessageHandler;
		if (!oContext.oCoreApi) {
			oContext.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : (oContext.oInject && oContext.oInject.instances && oContext.oInject.instances.messageHandler) || oMessageHandler
				},
				functions : {
					isUsingCloudFoundryProxy : function() { return false; }
				}
			});
		}
		oContext.oInject = inject || {};
		oContext.oInject.instances = oContext.oInject.instances || {};
		oContext.oInject.functions = oContext.oInject.functions || {};
		oContext.oInject.instances.coreApi = oContext.oCoreApi;
		oContext.oInject.instances.messageHandler = (oContext.oInject && oContext.oInject.instances && oContext.oInject.instances.messageHandler) || oMessageHandler;
		oContext.oInject.instances.fileExists = new sap.apf.core.utils.FileExists();
		oContext.oInject.functions.checkForTimeout = sap.apf.core.utils.checkForTimeout;
		oContext.oInject.functions.isUsingCloudFoundryProxy = function() { return false; };
		var oTextResourceHandler = new sap.apf.core.TextResourceHandler(oContext.oInject);
		oContext.oCoreApi.createMessageObject = function(oConfig) {
			return oMessageHandler.createMessageObject(oConfig);
		};
		oContext.oCoreApi.ajax = function(context) {
			var ajax = ( inject && inject.functions && inject.functions.ajax ) || jQuery.ajax;
			ajax(context);
		};
		oContext.oCoreApi.putMessage = function(oMessage) {
			return oMessageHandler.putMessage(oMessage);
		};
		oContext.oCoreApi.getMessageText = function(sCode, aParameters) {
			return oTextResourceHandler.getMessageText(sCode, aParameters);
		};
		oContext.oCoreApi.getStartParameterFacade = function() {
			var oStartParameter = new sap.apf.utils.StartParameter();

			if (bFilterReductionIsActive) {
				oStartParameter.isFilterReductionActive = function() {
					return true;
				};
			}
			oStartParameter.getSapSystem = function() {
				return oContext.sapSystemName;
			};
			return oStartParameter;
		};
		oContext.oCoreApi.getResourceLocation = function(sResourceIdentifier) {
			return this.oRPH.getResourceLocation(sResourceIdentifier);
		}.bind(oContext);
		oContext.oCoreApi.loadMessageConfiguration = function(aMessages) {
			oMessageHandler.loadConfig(aMessages);
		};
		oContext.oCoreApi.loadAnalyticalConfiguration = function(oConfig) {
		};
		oContext.oCoreApi.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		oContext.oRPH = new sap.apf.core.ResourcePathHandler(oContext.oInject);
		var sConfigPath = sap.apf.testhelper.determineTestResourcePath() + '/testhelper/config/' + sap.apf.testhelper.determineApplicationConfigName();
		oContext.oRPH.loadConfigFromFilePath(sConfigPath);
	}
QUnit.module('Missing service definition during create request', {
	beforeEach : function(assert) {
		var that = this;
		var inject = {
				functions : {
					ajax : sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch
				}
		};
		setupCoreAndMessageHandling(this, true, false, inject);
		this.oMessageHandler.putMessage = function(oMessageObject) {
			that.code = oMessageObject.getCode();
		};
	}
});
QUnit.test("Create Request", function(assert) {
	assert.expect(2);
	assert.throws(function() {
		new sap.apf.core.Request(this.oInject, {
			id : "requestForTesting",
			entityType : 'entityTypeOfNoInterest',
			selectProperties : [ 'FilterPropertyOne' ]
		});
	}, Error, "Service definition does not exist");
	assert.equal(this.code, "5015", "Code as expected");
});
QUnit.module('Filter and view parameter values', {
	beforeEach : function(assert) {
		var that = this;
		var inject = {
				functions : {
					ajax : sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch
				}
		};
		commonSetup(this, inject);
		setupCoreAndMessageHandling(this, false, false, inject);
		this.oCoreApi.getUriGenerator = function() {
			return {
				buildUri : function(oMessageHandler, sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat) {
					that.saveValues([ sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat ]);
				},
				getAbsolutePath : function() {
				}
			};
		};
		this.request = new sap.apf.core.Request(this.oInject, {
			service : 'dummy',
			entityType : 'entityTypeWithParams',
			selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
		});
	},
	saveValues : function(aParameters) {
		this.uriParts.entityType = aParameters[0];
		this.uriParts.selectProperties = aParameters[1];
		this.uriParts.filterForRequest = aParameters[2];
		this.uriParts.parameter = aParameters[3];
		this.uriParts.sortingFields = aParameters[4];
		this.uriParts.paging = aParameters[5];
		this.uriParts.format = aParameters[6];
	},
	uriParts : {}
});
QUnit.test('Filter only contains terms for filterable properties - no parameters', function(assert) {
	this.request = new sap.apf.core.Request(this.oInject, {
		id : "requestForTesting",
		service : 'dummy',
		entityType : 'entityTypeFilterable',
		selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
	});
	this.oMetadataDouble.addFilterableAnnotations('entityTypeFilterable', {
		'prop1' : true,
		'prop2' : true,
		'prop3' : false,
		'prop4' : true
	});
	var oFilter = new this.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
	oFilter.addAnd('prop2', this.EQ, 'val2');
	oFilter.addAnd('prop3', this.EQ, 'val3');
	oFilter.addAnd('prop4', this.EQ, 'val4');
	this.request.sendGetInBatch(oFilter, function() {
	});
	assert.equal(this.uriParts.filterForRequest.getFilterTerms().length, 3, 'Three filter terms expected');
});
QUnit.test('All terms removed from filter if there are no filterable properties - no parameters', function(assert) {
	this.request = new sap.apf.core.Request(this.oInject, {
		service : 'dummy',
		entityType : 'entityTypeNothingFilterable',
		selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
	});
	var oFilter = new this.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
	oFilter.addAnd('prop2', this.EQ, 'val2');
	oFilter.addAnd('prop3', this.EQ, 'val3');
	oFilter.addAnd('prop4', this.EQ, 'val4');
	this.request.sendGetInBatch(oFilter, function() {
	});
	assert.equal(this.uriParts.filterForRequest.getFilterTerms().length, 0, 'No filter terms in reduced filter if there are no filterable properties');
});

QUnit.test('WHEN unspecified exception occurs in callback', function(assert) {
	this.oMessageHandler.spyPutMessage();
	this.oMessageHandler.isOwnException = function(oError) {
		assert.ok(true, "THEN catch block was reached");
		return false;
	};
	this.request = new sap.apf.core.Request(this.oInject, {
		service : 'dummy',
		entityType : 'entityTypeNothingFilterable',
		selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
	});
	this.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
		var response = {};
		response['__batchResponses'] = [{
			data : {
				results : [{
					prop1 : 'val1'
				}]
			}
		}, {
			data : {
				results : [{
					prop1 : 'val1'
				}]
			}
		}];
		fnSuccess(response);
	};
	var oFilter = new this.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
	
	this.request.sendGetInBatch(oFilter, function() {
		throw "unspecified error";
	});
	assert.equal(this.oMessageHandler.spyResults.putMessage.code, 5042, "THEN message code as expected");
});


QUnit.module('WHEN sendInBatch returns odata error', {
	beforeEach : function() {
		var that = this;
		var odataRequestReturnsError = function(oInject, oRequest, fnSuccess, fnError, oBatchHandler) {
			fnSuccess(that.errorData, that.errorResponse);
		};
		var messageHandler = new sap.apf.core.MessageHandler();
		messageHandler.activateOnErrorHandling(true);
		messageHandler.setLifeTimePhaseRunning();
		messageHandler.loadConfig(sap.apf.core.messageDefinition, true);
		this.messageHandler = messageHandler;
		var inject = {
				functions : {
					odataRequestWrapper : odataRequestReturnsError,
					ajax : sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch
				},
				instances : {
					messageHandler : messageHandler
				}
		};
		commonSetup(this, inject);
		setupCoreAndMessageHandling(this, false, false, inject);
		this.oCoreApi.getUriGenerator = function() {
			return {
				buildUri : function() {
					return "";
				},
				getAbsolutePath : function() {
				}
			};
		};
		this.request = new sap.apf.core.Request(this.oInject, {
			service : 'dummy',
			entityType : 'entityTypeWithParams',
			selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
		});
	}
});
QUnit.test("WHEN error message is returned", function(assert){
	assert.expect(2);
	var that = this;
	this.messageHandler.setMessageCallback(function(messageObject){
		assert.equal(messageObject.getPrevious().getCode(),  "5001", "THEN message code as expected");
		assert.deepEqual(messageObject.getPrevious().getParameters(),  ["500", "error1", "Unsupported functionality", "/some/url"], "THEN message parameters as expected");
	});
	this.request = new sap.apf.core.Request(this.oInject, {
		service : 'dummy',
		entityType : 'entityTypeNothingFilterable',
		selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
	});
	var responseBody = {
		"error": {
		    "code": "501",
		    "message": {
		      "lang": "en_US",
		      "value": "Unsupported functionality"
		    }
		}
	};
	this.errorData = {
			__batchResponses : [ { message : "error1", response : { statusCode : "500", body : responseBody }} ]
	};
	this.errorResponse = {
			requestUri : "/some/url"
	};
	var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
	oFilter.addAnd('prop2', this.EQ, 'val2');
	oFilter.addAnd('prop3', this.EQ, 'val3');
	oFilter.addAnd('prop4', this.EQ, 'val4');
	that.request.sendGetInBatch(oFilter, function() {});
	
});

QUnit.module('Given sap.apf.activateFilterReduction is deactivated', {
		beforeEach : function(assert) {
			var that = this;
			var inject = {
					functions : {
						ajax : sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch
					}
			};
			commonSetup(this, inject);
			setupCoreAndMessageHandling(this, false, false, inject);
			this.oCoreApi.getUriGenerator = function() {
				return {
					buildUri : function(oMessageHandler, sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat) {
						that.saveValues([ sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat ]);
					},
					getAbsolutePath : function() {
					}
				};
			};
			// set up a test filter called filter
			var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
			oFilter.addOr('prop1', this.EQ, 'val2');
			oFilter.addOr('prop2', this.EQ, 'val1');
			var oNextLevelFilter = new this.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
			oNextLevelFilter.addOr('prop1', this.EQ, 'val2');
			oNextLevelFilter.addOr('prop3', this.EQ, 'any');
			this.filter = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter);
			this.filter.addAnd(oNextLevelFilter);
		},
		saveValues : function(aParameters) {
			this.uriParts.entityType = aParameters[0];
			this.uriParts.selectProperties = aParameters[1];
			this.uriParts.filterForRequest = aParameters[2];
			this.uriParts.parameter = aParameters[3];
			this.uriParts.sortingFields = aParameters[4];
			this.uriParts.paging = aParameters[5];
			this.uriParts.format = aParameters[6];
		},
		uriParts : {}
	});
	QUnit.test('When calling sendGetInBatch', function(assert) {

		this.request = new sap.apf.core.Request(this.oInject, {
			id : "requestForTesting",
			service : 'dummy',
			entityType : 'entityTypeFilterable',
			selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
		});
		this.oMetadataDouble.addFilterableAnnotations('entityTypeFilterable', {
			'prop1' : true,
			'prop2' : true,
			'prop3' : false,
			'prop4' : true
		});
		this.request.sendGetInBatch(this.filter, function() {
		});
		assert.equal(this.uriParts.filterForRequest.getFilterTerms().length, 5, 'Five filter terms expected');
	});

	QUnit.module('Given activateFilterReduction AND(OR(1,2,1),OR(1,2,42))', {
		beforeEach : function(assert) {
			var that = this;
			var activateReductionPerUrlParameter = true;
			var inject = {
					functions : {
						ajax : sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch
					}
			};
			commonSetup(this, inject);
			setupCoreAndMessageHandling(this, false, activateReductionPerUrlParameter, inject);
			this.oCoreApi.getUriGenerator = function() {
				return {
					buildUri : function(oMessageHandler, sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat) {
						that.saveValues([ sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat ]);
					},
					getAbsolutePath : function() {
					}
				};
			};
			// AND(OR(1,2,1),OR(1,2,42))
			var left = new sap.apf.core.utils.Filter(this.oMessageHandler).addOr('A', this.EQ, '1').addOr('A', this.EQ, '2').addOr('A', this.EQ, '1');
			var right = new this.Filter(this.oMessageHandler).addOr('A', this.EQ, '1').addOr('A', this.EQ, '2').addOr('A', this.EQ, '42');
			this.filter = new sap.apf.core.utils.Filter(this.oMessageHandler).addAnd(left).addAnd(right);

			this.request = new sap.apf.core.Request(this.oInject, {
				id : "requestForTesting",
				service : 'dummy',
				entityType : 'entityTypeFilterable',
				selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
			});
			this.oMetadataDouble.addFilterableAnnotations('entityTypeFilterable', {
				'A' : true
			});
		},
		saveValues : function(aParameters) {
			this.uriParts.entityType = aParameters[0];
			this.uriParts.selectProperties = aParameters[1];
			this.uriParts.filterForRequest = aParameters[2];
			this.uriParts.parameter = aParameters[3];
			this.uriParts.sortingFields = aParameters[4];
			this.uriParts.paging = aParameters[5];
			this.uriParts.format = aParameters[6];
		},
		uriParts : {}
	});
	QUnit.test('WHEN  sap.apf.activateFilterHandling ACTIVATED  .. prove that reduction is being called', function(assert) {
		this.request.sendGetInBatch(this.filter, function() {
		});
		// actually, this test should test that filter simplification has been called, not that it is correct.
		// Since we cannot do this directly and easily, we indirectly test that reduction happened.
		assert.equal(this.uriParts.filterForRequest.mapToSapUI5FilterExpression().bAnd, false, 'reduced to OR node');
		assert.equal(this.uriParts.filterForRequest.mapToSapUI5FilterExpression().aFilters.length, 2, 'reduced nr of values');
		assert.equal(this.uriParts.filterForRequest.mapToSapUI5FilterExpression().aFilters[0].oValue1, '1', 'filter term 0 as expected');
		assert.equal(this.uriParts.filterForRequest.mapToSapUI5FilterExpression().aFilters[1].oValue1, '2', 'filter term 1 as expected');
	});

	QUnit.module('Passing metadata to datajs', {
		beforeEach : function(assert) {
			sap.apf.testhelper.mockServer.activateModeler();

			this.oMessageHandler = new sap.apf.core.MessageHandler();
			this.oMessageHandler.activateOnErrorHandling(true);
			this.oMessageHandler.setLifeTimePhaseStartup();
			this.oMessageHandler.setMessageCallback(function () {});
			this.oMessageHandler.loadConfig(sap.apf.core.messageDefinition, true);

			var oInject = {
				instances: {
					messageHandler: this.oMessageHandler,
					startParameter : new sap.apf.utils.StartParameter()
				},
				constructors : {
                    SessionHandler : sap.apf.core.SessionHandler
                }
            };
            this.oCoreApi = new sap.apf.core.Instance(oInject);
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('datajs parses date', function (assert) {
		var done = assert.async();
		var oInject = {
			instances: {
				messageHandler: this.oMessageHandler,
				coreApi : this.oCoreApi
			}
		};
		var request = new sap.apf.core.Request(oInject, {
			service : '/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata',
			entityType : 'AnalyticalConfigurationQuery',
			selectProperties : [ 'CreationUTCDateTime' ]
		});
		var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler);
		request.sendGetInBatch(oFilter, function(arg) {
			assert.ok(arg.data[0].CreationUTCDateTime instanceof Date, "Edm.DateTime is returned as Date Object.");
			done();
		});
	});
	QUnit.module('Selection validation request', {
		beforeEach : function(assert) {
			var inject = {
					functions : {
						ajax : sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch
					}
			};
			commonSetup(this, inject);
			setupCoreAndMessageHandling(this, false, true, inject);
			this.buildUriArguments = [];
			
			this.oCoreApi.getUriGenerator = function() {
				return {
					buildUri : function(oMessageHandler, sEntityType, aSelectProperties, oFilter, oParameter, aSortingFields, oPaging, sFormat) {
						this.buildUriArguments.push(arguments);
						return "requestUri";
					}.bind(this),
					getAbsolutePath : function() {
					}
				};
			}.bind(this);
			this.spyOdataRequest = sinon.spy(this.oCoreApi,"odataRequest");
			this.filter = new sap.apf.core.utils.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
			this.request = new sap.apf.core.Request(this.oInject, {
				id : "requestForTesting",
				service : 'dummy',
				entityType : 'entityTypeFilterable',
				selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
			});
			this.oMetadataDouble.addFilterableAnnotations('entityTypeFilterable', {
				'prop1' : true
			});
		},
		afterEach : function(assert) {
			this.spyOdataRequest.restore();
		}
	});
	QUnit.test('sendGetInBatch', function(assert) {
		var selectionFilter =  new sap.apf.core.utils.Filter(this.oMessageHandler, 'prop2', this.EQ, 'val2');
		var selectionValidationRequest = {
				requiredFilterProperties : ["prop2"], 
				selectionFilter : selectionFilter
		};
		this.request.sendGetInBatch(this.filter, function(){}, undefined, selectionValidationRequest);
		assert.equal(this.buildUriArguments[1][1], "entityTypeFilterable", 'Correct entity type in second get request');
		assert.deepEqual(this.buildUriArguments[1][2], ["prop2"], 'Correct select properties in second get request');
		assert.equal(this.buildUriArguments[1][3].toUrlParam(), "((prop1%20eq%20%27val1%27)%20and%20(prop2%20eq%20%27val2%27))", 'Correct filterForRequest in second get request');
		assert.equal(this.buildUriArguments[1][4].toUrlParam(), "(prop1%20eq%20%27val1%27)", 'Correct filter in second get request');
		assert.equal(this.buildUriArguments[1][5], undefined, 'No sorting fields in second get request');
		assert.equal(this.buildUriArguments[1][6], undefined, 'No paging in second get request');
		assert.equal(this.buildUriArguments[1][7], undefined, 'No format in second get request');
		assert.ok(jQuery.isFunction(this.buildUriArguments[1][8]), 'Format function in second get request');
		assert.equal(this.buildUriArguments[1][9], "Results", 'Correct navigation property in second get request');
		assert.equal(this.buildUriArguments[1][10].type, "metadata", 'Metadata instance in second get request');
		assert.equal(this.spyOdataRequest.getCall(0).args[0].data["__batchRequests"].length, "2", "Two requests in batch");
		assert.equal(this.spyOdataRequest.getCall(0).args[0].data["__batchRequests"][1].method, "GET", "Second batch request method is GET");
		assert.equal(typeof this.spyOdataRequest.getCall(0).args[0].data["__batchRequests"][1].headers['Accept-Language'], "string", "Second batch request has accept language");
		assert.equal(this.spyOdataRequest.getCall(0).args[0].data["__batchRequests"][1].headers['x-csrf-token'], "xsrfToken", "Second batch request has xsrf token");
		assert.equal(this.spyOdataRequest.getCall(0).args[0].data["__batchRequests"][1].requestUri, "requestUri", "Second batch request has request uri");
	});
	QUnit.test('Filter reduction', function(assert) {
		var selectionFilter =  new sap.apf.core.utils.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
		var selectionValidationRequest = {
				requiredFilterProperties : ["prop1"], 
				selectionFilter : selectionFilter
		};
		this.request.sendGetInBatch(this.filter, function(){}, undefined, selectionValidationRequest);
		assert.equal(this.buildUriArguments[1][3].toUrlParam(), "(prop1%20eq%20%27val1%27)", 'Filter reduction in second get request applied');
	});
	QUnit.test('Selection validation response', function(assert) {
		this.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
			var response = {};
			response['__batchResponses'] = [{
				data : {
					results : [{
						prop1 : 'val1'
					}]
				}
			}, {
				data : {
					results : [{
						prop1 : 'val1'
					}]
				}
			}];
			fnSuccess(response);
		};
		var selectionFilter =  new sap.apf.core.utils.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
		var selectionValidationRequest = {
				requiredFilterProperties : ["prop1"], 
				selectionFilter : selectionFilter
		};

		var callback = function(response, bStepNotUpdated){
			assert.deepEqual(response.selectionValidation, [{'prop1' : 'val1'}], 'Selection validation contained in callback response parameter');
		};
		this.request.sendGetInBatch(this.filter, callback, undefined, selectionValidationRequest);
	});
	
	QUnit.module('WHEN sendInBatch returns odata error AND repeated calls', {
		beforeEach : function() {
			var that = this;
			var odataRequestReturnsError = function(oInject, oRequest, fnSuccess, fnError, oBatchHandler) {
				setTimeout(function() {
					fnSuccess(that.responseData, that.response);
				},1);
			};
			var messageHandler = new sap.apf.core.MessageHandler();
			messageHandler.activateOnErrorHandling(true);
			messageHandler.setLifeTimePhaseRunning();
			messageHandler.loadConfig(sap.apf.core.messageDefinition, true);
			this.messageHandler = messageHandler;
			var inject = {
					functions : {
						odataRequestWrapper : odataRequestReturnsError,
						ajax : sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch
					},
					instances : {
						messageHandler : messageHandler
					}
			};
			commonSetup(this, inject, true);
			setupCoreAndMessageHandling(this, false, false, inject);
			this.oCoreApi.getUriGenerator = function() {
				return {
					buildUri : function() {
						return "";
					},
					getAbsolutePath : function() {
					}
				};
			};
		}
	});
	QUnit.test("WHEN first odata call fails", function(assert){
		assert.expect(3);
		var done = assert.async();
		var that = this;
		
		function prepareOdataResponseForError(context) {
			var responseBody = {
					"error": {
					    "code": "501",
					    "message": {
					      "lang": "en_US",
					      "value": "Unsupported functionality"
					    }
					}
				};
				context.responseData = {
						__batchResponses : [ { message : "error1", response : { statusCode : "500", body : responseBody }} ]
				};
				context.response = {
						requestUri : "/some/url"
				};
		}
		function prepareOdataResponseForSuccess(context) {
			context.responseData = {};
			context.responseData['__batchResponses'] = [{
					data : {
						results : [{
							prop1 : 'val1'
						}]
					}
				}, {
					data : {
						results : [{
							prop1 : 'val1'
						}]
					}
			}];
		}
		
		function callbackNeverBeCalled() {
			assert.ok(false, "THEN request did not throw exception as expected");
		}
	
		function callSendGetInBatchAgain() {
			
			prepareOdataResponseForSuccess(that);
			var oFilter = new sap.apf.core.utils.Filter(that.oMessageHandler, 'prop1', that.EQ, 'val1');
			that.request.sendGetInBatch(oFilter, function() {
				assert.ok(true, "THEN second batch call was successfull");
				done();
			});
		}
		this.messageHandler.setMessageCallback(function(messageObject){
			assert.equal(messageObject.getPrevious().getCode(),  "5001", "THEN message code as expected");
			assert.deepEqual(messageObject.getPrevious().getParameters(),  ["500", "error1", "Unsupported functionality", "/some/url"], "THEN message parameters as expected");
			
			setTimeout(callSendGetInBatchAgain, 1);
		});
	
		this.request = new sap.apf.core.Request(this.oInject, {
			service : 'dummy',
			entityType : 'entityTypeNothingFilterable',
			selectProperties : [ 'FilterPropertyOne', 'FilterPropertyTwo' ]
		});
		
		prepareOdataResponseForError(this);
		var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, 'prop1', this.EQ, 'val1');
		that.request.sendGetInBatch(oFilter, callbackNeverBeCalled);		
	});
	
}());