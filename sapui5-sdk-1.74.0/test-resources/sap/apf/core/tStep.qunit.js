jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.binding');
jQuery.sap.require('sap.apf.testhelper.doubles.request');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.testhelper.doubles.apfApi');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.step");
jQuery.sap.require("sap.apf.core.request");
jQuery.sap.require("sap.apf.core.binding");
jQuery.sap.require("sap.apf.core.configurationFactory");
jQuery.sap.require("sap.apf.core.messageHandler");
jQuery.sap.require("sap.apf.core.metadataFactory");
jQuery.sap.require("sap.apf.ui.representations.lineChart");
jQuery.sap.require("sap.apf.ui.representations.columnChart");
jQuery.sap.require("sap.apf.ui.representations.scatterPlotChart");
jQuery.sap.require("sap.apf.ui.representations.table");
jQuery.sap.require("sap.apf.ui.representations.stackedColumnChart");
jQuery.sap.require("sap.apf.ui.representations.pieChart");
jQuery.sap.require("sap.apf.ui.representations.percentageStackedColumnChart");
jQuery.sap.require('sap.apf.ui.representations.bubbleChart');

(function() {
	'use strict';
	function commonSetupStep(testEnvironment, bSpyPutMessage) {
		testEnvironment.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		if (bSpyPutMessage) {
			testEnvironment.oMessageHandler.spyPutMessage();
		}
		testEnvironment.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
			instances : {
				messageHandler : testEnvironment.oMessageHandler
			}
		}).doubleMessaging();
		testEnvironment.oApi = new sap.apf.testhelper.doubles.ApfApi({
			instances : {
				messageHandler : testEnvironment.oMessageHandler,
				coreApi : testEnvironment.oCoreApi
			}
		}).doubleStandardMethods().doubleCreateRepresentation().doubleCreateFilter();
		testEnvironment.oConfigurationTemplate = sap.apf.testhelper.config.getSampleConfiguration();
		testEnvironment.oConfigurationFactory = new sap.apf.core.ConfigurationFactory({
			instances : {
				messageHandler : testEnvironment.oMessageHandler,
				coreApi : testEnvironment.oCoreApi
			},
			constructors : {
				Hashtable : sap.apf.utils.Hashtable
			}
		});
		testEnvironment.oConfigurationFactory.loadConfig(testEnvironment.oConfigurationTemplate);
	}
	function commonSetupForGetFilterInformation(context){
		commonSetupStep(context);
		context.oCoreApi = {
			getTextNotHtmlEncoded : function(textKey, parameters){
				if(textKey === "keyAndTextSelection" && parameters){
					return parameters[0] + " (" + parameters[1] + ")";
				}
				return "text:" + textKey;
			},
			getMetadata : function(service){
				var deferred = jQuery.Deferred();
				setTimeout(function(){
					deferred.resolve({
						getPropertyMetadata: function(entitySet, property){
							if(!service || !entitySet || !property){
								return {
									"sap:label" : "Metadata not called correct"
								};
							}
							if(context.labelAvailable){
								return {
									"sap:label" : "label:" + service + "," + entitySet + "," + property 
								};
							}
							if(context.textAvailable){
								return {
									text : property + "Name"
								};
							}
							return {
								type : "typeOfNoInterest"
							};
						},
						getFilterableProperties: function(entitySet){
							if(entitySet === "dataEntityType"){
								return ["selectableProperty", "mappingProperty"];
							}
						},
						getParameterEntitySetKeyProperties: function(entitySet){
							if(entitySet === "dataEntityType"){
								return ["parameter"];
							}
						}
					});
				},1 );
				return deferred;
			}
		};
		context.configFactory = {
			createBinding : function(){
				return {
					getFilter : function () {
						return context.chartSelectionFilter || new sap.apf.core.utils.Filter(context.oMessageHandler, "selectableProperty", "EQ", "A");
					},
					getSortedSelections : function(){
						return context.selections || [{
							text : "selection"
						}];
					}
				};
			},
			createRequest : function(requestObject){
				if(requestObject.id === "filterMappingRequest"){
					return {
						sendGetInBatch : function(oInputFilter, callbackAfterMappingRequest){
							var data = context.filterMappingRequestData || [{
								"mappingProperty" : "B"
							}];
							callbackAfterMappingRequest({
								data : data
							});
						}
					};
				}
				return {};
			},
			getConfigurationById : function(id) {
				if(id === "binding" ){
					return context.binding || {
						requiredFilters : ["selectableProperty"],
						requiredFilterOptions : {}
					};
				}
				if(id === "request"){
					return {
						id : "dataRequest",
						entityType : "dataEntityType",
						service : "dataService"
					};
				}
				if(id === "filterMappingRequest"){
					return {
						id : "filterMappingRequest",
						service : "mappingService",
						entityType : "mappingEntityType"
					};
				}
			}
		};
		context.stepConfig = {
				binding : "binding",
				request : "request",
				title : {
					key : "stepTitle"
				}
			};
		context.activeStep = new sap.apf.core.Step(context.oMessageHandler, context.stepConfig, context.configFactory, undefined, context.oCoreApi);
		// expected FilterInformation for step itself
		context.expectedFilterInformation = [{
			text : "text:stepTitle",
			selectablePropertyLabel : "selectableProperty",
			filterValues:[{
				text : "selection"
			}],
			infoIcon : false,
			infoText: undefined,
			warningIcon: false,
			warningText: undefined,
			stepIndex : 0
		}];
	}
	QUnit.module("Create Step with given Representation", {
		beforeEach : function(assert) {
			commonSetupStep(this);
			this.originalRequest = sap.apf.core.Request;
			sap.apf.core.Request = function() {
				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {
					fnCallback('Callback from request double');
				};
			};
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.originalRequest;
		}
	});
	QUnit.test("WHEN create Step without explicite represenation id", function(assert) {
		var oStep = this.oConfigurationFactory.createStep("stepTemplate3");
		var representationType = oStep.getSelectedRepresentation().type;
		assert.equal(representationType, "Representation2TestDouble", "THEN the default represenation is selected");
	});
	QUnit.test("WHEN create Step without explicite represenation id", function(assert) {
		var oStep = this.oConfigurationFactory.createStep("stepTemplate3", "representationId1");
		var representationType = oStep.getSelectedRepresentation().type;
		assert.equal(representationType, "RepresentationTestDouble", "THEN the explicite represenation is selected");
	});
	QUnit.module("Create Step with invalid RepresentationId", {
		beforeEach : function(assert) {
			commonSetupStep(this, true);
			this.originalRequest = sap.apf.core.Request;
			sap.apf.core.Request = function() {
				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {
					fnCallback('Callback from request double');
				};
			};
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.originalRequest;
		}
	});
	QUnit.test("WHEN step is created with non existing representation id", function(assert) {
		var oStep = this.oConfigurationFactory.createStep("stepTemplate3", "unknownRepresentationId");
		var representationType = oStep.getSelectedRepresentation().type;
		assert.equal(representationType, "Representation2TestDouble", "THEN the default represenation is selected");
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, "5037", "THEN warning message has been emitted");
	});
	QUnit.module('Step update', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			var testEnv = this;
			
			this.originalBinding = sap.apf.core.Binding;
			sap.apf.core.Binding = function(oInject, oBindingConfig, oFactory, sRepresentationId){
				testEnv.originalBinding.call(this, oInject, oBindingConfig, oFactory, sRepresentationId); 
				testEnv.spyGetRequestOptions = sinon.spy(this, "getRequestOptions");
				this.getFilter = function(oContextInfo){
					return new sap.apf.core.utils.Filter(testEnv.oMessageHandler);
				};
				testEnv.spyGetFilter = sinon.spy(this, "getFilter");
			};
			
			this.originalRequest = sap.apf.core.Request;
			sap.apf.core.Request = function() {
				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {
					fnCallback('Callback from request double');
				};
			};
			this.oCoreApi = {
				getMetadata : function(){
					return testEnv.metadata || jQuery.Deferred().resolve();
				}
			};
			var oStepConfig = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
			this.oStep = new sap.apf.core.Step(this.oMessageHandler, oStepConfig, this.oConfigurationFactory, undefined, this.oCoreApi);
			this.wrapCallbackWithFilter = function(oFilter) {
				return function(data) {
					this.oStep.setData(data, oFilter);
					this.callBackFromStepUpdate(data);
				}.bind(this);
			};
		},
		afterEach : function() {
			sap.apf.core.Request = this.originalRequest;
			sap.apf.core.Binding = this.originalBinding;
		},
		counterSendCalled : 0,
		counterCallbackCalled : 0,
		callBackFromStepUpdate : function(data) {
			this.counterCallbackCalled++;
			if (data === 'Callback from request double') {
				this.counterSendCalled++;
			}
		},
		getSendCounter : function() {
			return this.counterSendCalled;
		},
		getCallbackCounter : function() {
			return this.counterCallbackCalled;
		}
	});
	QUnit.test('Step update when metadata is not available', function(assert) {
		this.metadata = jQuery.Deferred().reject();
		var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, "prop1", sap.apf.core.constants.FilterOperators.EQ, "val1");
		this.oStep.update(oFilter,function(){
			assert.ok(true, "Callback called when metadata is not available");
		});
	});
	QUnit.test('Request is not triggered when filter in step has not changed - from setup', function(assert) {
		var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, "prop1", sap.apf.core.constants.FilterOperators.EQ, "val1");
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 1, 'One callback expected');
		assert.equal(this.getSendCounter(), 1, 'One call to sendGetInBatch() on request expected');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 2, 'Two callbacks expected after 2nd update');
		assert.equal(this.getSendCounter(), 1, 'One, i.e. no additional call of sendGetInBatch() on request expected');
	});
	QUnit.test('Request is triggered when filter in step has changed', function(assert) {
		var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, "prop1", sap.apf.core.constants.FilterOperators.EQ, "val1");
		var oAdditionalFilterCondition = new sap.apf.core.utils.Filter(this.oMessageHandler, "prop2", sap.apf.core.constants.FilterOperators.EQ, "val2");
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 1, 'One callback expected');
		assert.equal(this.getSendCounter(), 1, 'One call to sendGetInBatch() on request expected');
		oFilter.addAnd(oAdditionalFilterCondition);
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 2, 'Two callbacks expected after 2nd update');
		assert.equal(this.getSendCounter(), 2, 'Two calls to sendGetInBatch() on request expected');
	});
	QUnit.test('Request triggered dependent on changed request options', function(assert) {
		var oFilter = new sap.apf.core.utils.Filter();
		var oRepresentation = this.oStep.getSelectedRepresentation();
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 1, 'One callback expected');
		assert.equal(this.getSendCounter(), 1, 'One call to sendGetInBatch() on request expected');
		oRepresentation.emulateRequestOptionsStrategy('top');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 2, 'Two callbacks expected after 2nd update');
		assert.equal(this.getSendCounter(), 2, 'Two calls to sendGetInBatch() on request expected due to changed request options');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 3, 'Three callbacks expected after 3rd update');
		assert.equal(this.getSendCounter(), 2, 'Two, i.e. no additional call to sendGetInBatch() on request expected');
		oRepresentation.emulateRequestOptionsStrategy('topSkip');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 4, 'Four callbacks expected after 4th update');
		assert.equal(this.getSendCounter(), 3, 'Three calls to sendGetInBatch() on request expected due to changed request options');
		oRepresentation.emulateRequestOptionsStrategy('inlineCount');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 5, 'Five callbacks expected after 5th update');
		assert.equal(this.getSendCounter(), 4, 'Four calls to sendGetInBatch() on request expected due to changed request options');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 6, 'Six callbacks expected after 6th update');
		assert.equal(this.getSendCounter(), 4, 'Four calls to sendGetInBatch() on request expected due to changed request options');
	});
	QUnit.test('Request triggered dependent on changed complex request options', function(assert) {
		var oFilter = new sap.apf.core.utils.Filter();
		var oRepresentation = this.oStep.getSelectedRepresentation();
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 1, 'One callback expected');
		assert.equal(this.getSendCounter(), 1, 'One call to sendGetInBatch() on request expected');
		oRepresentation.emulateRequestOptionsStrategy('multiOptionsPagingAndOrderbyPropertyOne');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 2, 'Two callbacks expected after 2nd update');
		assert.equal(this.getSendCounter(), 2, 'Two calls to sendGetInBatch() on request expected due to changed request options');
		oRepresentation.emulateRequestOptionsStrategy('multiOptionsPagingAndOrderbyPropertyTwo');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 3, 'Three callbacks expected after 3rd update');
		assert.equal(this.getSendCounter(), 3, 'Three calls to sendGetInBatch() on request expected due to changed request options');
	});
	QUnit.test('Methods availability', function(assert) {
		assert.ok(this.oStep.setSelectedRepresentation, 'Method setSelectedRepresentation() available');
	});
	QUnit.test('Get Filter', function(assert) {
		var oFilter = this.oStep.getFilter();
		assert.ok(oFilter instanceof sap.apf.core.utils.Filter, "Filter object expected");
	});
	QUnit.test('Contextinfo expected when calling getFilter on Binding', function(assert) {
		this.oStep.getFilter();
		assert.ok(this.spyGetFilter.alwaysCalledWith({
			entityType: "EntityType1",
			service: "dummy.xsodata"
		}), "Context info passed to binding.getFilter");
	});
	QUnit.test('getRequestOptions called with filterChanged boolean', function (assert) {
		var oFilterOne = new sap.apf.core.utils.Filter(this.oMessageHandler, "prop1", sap.apf.core.constants.FilterOperators.EQ, "X");
		var oFilterTwo = new sap.apf.core.utils.Filter(this.oMessageHandler, "prop1", sap.apf.core.constants.FilterOperators.EQ, "Y");
		this.oStep.update(oFilterOne, this.wrapCallbackWithFilter(oFilterOne));
		assert.strictEqual(this.spyGetRequestOptions.getCall(0).args[0], true, 'First update, getRequestOptions called with true as no filter cached so far');
		assert.strictEqual(this.spyGetRequestOptions.getCall(1).args[0], true, 'First setData, getRequestOptions called with true as no filter cached so far');
		this.oStep.update(oFilterOne, this.wrapCallbackWithFilter(oFilterOne));
		assert.strictEqual(this.spyGetRequestOptions.getCall(2).args[0], false, 'Second update, getRequestOptions called with false as provided filter has not changed');
		assert.strictEqual(this.spyGetRequestOptions.getCall(3).args[0], false, 'Second setData, getRequestOptions called with false as provided filter has not changed');
		this.oStep.update(oFilterTwo, this.wrapCallbackWithFilter(oFilterTwo));
		assert.strictEqual(this.spyGetRequestOptions.getCall(4).args[0], true, 'Third update, getRequestOptions called with true as provided filter has changed');
		assert.strictEqual(this.spyGetRequestOptions.getCall(5).args[0], true, 'Third setData, getRequestOptions called with true as provided filter has changed');
	});
	QUnit.test("Get Request Configuration", function(assert) {
		assert.deepEqual(this.oStep.getRequestConfiguration(),{
			type : "request",
			id : "requestTemplate1",
			service : "dummy.xsodata",
			entityType : "EntityType1",
			selectProperties : [ "PropertyOne", "PropertyTwo" ]
		}, "Request options returned by step");
	});
	QUnit.module('Step update with selection validation request', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			var testEnv = this;
			this.originalBinding = sap.apf.core.Binding;
			sap.apf.core.Binding = function(oInject, oBindingConfig, oFactory, sRepresentationId){
				testEnv.originalBinding.call(this, oInject, oBindingConfig, oFactory, sRepresentationId); 
				this.getFilter = function(){
					if(testEnv.filterParameter === 'noSelection'){
						return new sap.apf.core.utils.Filter(testEnv.oMessageHandler);
					}
					return new sap.apf.core.utils.Filter(testEnv.oMessageHandler, 'prop2', 'EQ', 'val2');
				};
				this.getSelectedRepresentation = function(){
					var selectedRepresentation = {
							setData : function(){}, 
							type : 'TableRepresentation'
					};
					if(testEnv.selectedRepresentationParameter === 'noTable'){
						selectedRepresentation.type = 'OtherRepresentation';
					}
					return selectedRepresentation;
				};
			};
			this.originalRequest = sap.apf.core.Request;
			this.requestCounter = 0;
			sap.apf.core.Request = function() {
				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions, oSelectionValidationRequest) {
					testEnv.selectionValidationRequest = oSelectionValidationRequest; 
					testEnv.requestCounter++;
					fnCallback('dataFromRequest', oFilter);
				};
			};
			this.oCoreApi = {
				getMetadata : function(){
					return jQuery.Deferred().resolve({
						getPropertyMetadata : function(){
							return testEnv.propertyMetadata || {};
						}
					});
				}
			};
			var oStepConfig = this.oConfigurationFactory.getConfigurationById('stepTemplate1');
			this.oStep = new sap.apf.core.Step(this.oMessageHandler, oStepConfig, this.oConfigurationFactory, undefined, this.oCoreApi);
			this.filter = new sap.apf.core.utils.Filter(this.oMessageHandler, 'prop1', sap.apf.core.constants.FilterOperators.EQ, 'val1');
		},
		afterEach : function() {
			sap.apf.core.Request = this.originalRequest;
			sap.apf.core.Binding = this.originalBinding;
		}
	});
	QUnit.test('Filter has changed, table has selections and no top N', function (assert) {
		this.oStep.update(this.filter, function(){});
		assert.deepEqual(this.selectionValidationRequest.requiredFilterProperties, ['prop2'], 'sendGetInBatch called with correct requiredFilterProperties');
		assert.strictEqual(this.selectionValidationRequest.selectionFilter.toUrlParam(), '(prop2%20eq%20%27val2%27)', 'sendGetInBatch called with correct selectionFilter');
	});
	QUnit.test('When fitler property has a text property', function (assert) {
		this.propertyMetadata = {
			"sap:text": "propertyText"
		};
		this.oStep.update(this.filter, function(){});
		assert.deepEqual(this.selectionValidationRequest.requiredFilterProperties, ['prop2', 'propertyText'], 'sendGetInBatch called with correct requiredFilterProperties');
		assert.strictEqual(this.selectionValidationRequest.selectionFilter.toUrlParam(), '(prop2%20eq%20%27val2%27)', 'sendGetInBatch called with correct selectionFilter');
	});
	QUnit.test('Table has no selections', function (assert) {
		this.filterParameter = 'noSelection';
		this.oStep.update(this.filter, function(){});
		assert.strictEqual(this.selectionValidationRequest, undefined, 'sendGetInBatch called without selectionValidationRequest object');
	});
	QUnit.test('Filter has not changed', function (assert) {
		var counter = 0;
		var callback = function (){
			counter++;
			this.oStep.setData({}, this.filter);
		}.bind(this);
		this.oStep.update(this.filter, callback);
		assert.strictEqual(counter, 1, 'Callback for first update called');
		assert.strictEqual(this.requestCounter, 1, 'SendGetInBatch called once');
		
		this.oStep.update(this.filter, callback);
		assert.strictEqual(counter, 2, 'Callback for second update called');
		assert.strictEqual(this.requestCounter, 1, 'SendGetInBatch only called once');
	});
	QUnit.test('TopN is configured', function (assert) {
		var stepConfig = this.oConfigurationFactory.getConfigurationById('stepTemplate1');
		stepConfig.topNSettings = {top : '10'};
		var step = new sap.apf.core.Step(this.oMessageHandler, stepConfig, this.oConfigurationFactory, undefined, this.oCoreApi);
		step.update(this.filter, function(){});
		assert.strictEqual(this.selectionValidationRequest, undefined, 'sendGetInBatch called without selectionValidationRequest object');
	});
	QUnit.test('No table representation', function (assert) {
		this.selectedRepresentationParameter = 'noTable';
		this.oStep.update(this.filter, function(){});
		assert.strictEqual(this.selectionValidationRequest, undefined, 'sendGetInBatch called without selectionValidationRequest object');
	});
	QUnit.module('Filter Mapping', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			this.requestCounter = 0;
			var that = this;
			this.originalRequest = sap.apf.core.Request;
			this.spySendGetInBatch = function() {
			};
			sap.apf.core.Request = function(oInject, oConfig) {
				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {
					//callback for checking oFilter and oConfig in test
					that.spySendGetInBatch(oFilter, oConfig);
					that.requestCounter++;
					if (that.letRequestFail) {
						fnCallback(new sap.apf.core.MessageObject({
							code : "5001"
						}));
						return;
					}
					var oResponse = {
						data : [ {
							targetProperty1 : "A",
							targetProperty2 : "B"
						}, {
							targetProperty1 : "C",
							targetProperty2 : "D"
						} ]
					};
					fnCallback(that.oResponse || oResponse);
				};
			};
			this.oCumulatedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler);
			this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("filterMapping"));
			this.oStepFilterMapping = this.oConfigurationFactory.createStep("stepFilterMapping");
			this.oStepFilterMapping.getFilter = function() {
				return new sap.apf.core.utils.Filter(that.oMessageHandler, "testProperty", "eq", "test");
			};
			this.oStep = this.oConfigurationFactory.createStep("stepTemplate1");
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.originalRequest;
		}
	});
	QUnit.test('WHEN the request for filter mapping is executed THEN the right service, entity type and select properties are supplied to sendGetInBatch()', function(assert) {
		var sExpectedService = "serviceForFilterMapping.xsodata";
		var sExpectedEntityType = "entitytypeForFilterMapping";
		var sExpectedSelectProperties = [ "targetProperty1", "targetProperty2" ];
		var sResultService = "";
		var sResultEntityType = "";
		var sResultSelectProperties = "";
		this.spySendGetInBatch = function(oFilter, oConfig) {
			sResultService = oConfig.service;
			sResultEntityType = oConfig.entityType;
			sResultSelectProperties = oConfig.selectProperties;
		};
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter, function() {
		}); //CUT
		assert.equal(sResultService, sExpectedService, "Correct service used in sendGetInBatch");
		assert.equal(sResultEntityType, sExpectedEntityType, "Correct entitytype used in sendGetInBatch");
		assert.deepEqual(sResultSelectProperties, sExpectedSelectProperties, "Correct select properties used in sendGetInBatch");
	});
	QUnit.test('WHEN the request for filter mapping fails THEN the callback is not processed and the error is logged', function(assert) {
		assert.expect(1);
		this.oMessageHandler.spyPutMessage();
		this.letRequestFail = true;
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter, callbackFromStepFilterProcessing); //CUT
		function callbackFromStepFilterProcessing(oFilter) {
			assert.ok(false, "The callback from determineFilter() was called despite a failed filter mapping request");
		}
		assert.equal(this.oMessageHandler.spyResults.putMessage.getCode(), "5001", "The error from the failed filter mapping request is logged");
	});
	QUnit.test('WHEN keep source is false THEN replace filter from step specific selections by mapped filter', function(assert) {
		assert.expect(1);
		jQuery.extend(this, sap.apf.utils.Filter.getOperators());
		var oFilter1 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "A");
		var oFilter2 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "B");
		var oFilter3 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "C");
		var oFilter4 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "D");
		var oFilterAnd1 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter1).addAnd(oFilter2);
		var oFilterAnd2 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter3).addAnd(oFilter4);
		var oExpectedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilterAnd1).addOr(oFilterAnd2);
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter, callbackFromStepFilterProcessing); //CUT
		function callbackFromStepFilterProcessing(oFilter) {
			assert.equal(oFilter.toUrlParam(), oExpectedFilter.toUrlParam(), "Correctly mapped filter returned");
		}
	});
	QUnit.test('WHEN keep source is false THEN second request is cached', function(assert) {
		var that = this;
		assert.expect(4);
		jQuery.extend(this, sap.apf.utils.Filter.getOperators());
		var oFilter1 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "A");
		var oFilter2 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "B");
		var oFilter3 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "C");
		var oFilter4 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "D");
		var oFilterAnd1 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter1).addAnd(oFilter2);
		var oFilterAnd2 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter3).addAnd(oFilter4);
		var oExpectedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilterAnd1).addOr(oFilterAnd2);
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter, callbackFromStepFilterProcessing); //CUT
		function callbackFromStepFilterProcessing(oFilter) {
			assert.equal(oFilter.toUrlParam(), oExpectedFilter.toUrlParam(), "Correctly enhanced filter returned once");
			assert.strictEqual(that.requestCounter, 1, "One request sent");
			that.oStepFilterMapping.determineFilter(that.oCumulatedFilter, callbackFromSecondStepFilterProcessing);
			function callbackFromSecondStepFilterProcessing(oFilter) {
				assert.equal(oFilter.toUrlParam(), oExpectedFilter.toUrlParam(), "Correctly enhanced filter returned twice");
				assert.strictEqual(that.requestCounter, 1, "no additional request sent");
			}
		}
	});
	QUnit.test('WHEN keep source is true THEN enhance filter from step specific selections with mapped filter', function(assert) {
		assert.expect(1);
		var that = this;
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("filterMappingKeepSource"));
		this.oStepFilterMapping = this.oConfigurationFactory.createStep("stepFilterMappingKeepSource");
		this.oStepFilterMapping.getFilter = function() {
			return new sap.apf.core.utils.Filter(that.oMessageHandler, "sourceProperty", that.EQ, "A");
		};
		jQuery.extend(this, sap.apf.utils.Filter.getOperators());
		var oFilter1 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "A");
		var oFilter2 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "B");
		var oFilter3 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "C");
		var oFilter4 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "D");
		var oFilter5 = new sap.apf.core.utils.Filter(this.oMessageHandler, "sourceProperty", this.EQ, "A");
		var oFilterAnd1 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter1).addAnd(oFilter2);
		var oFilterAnd2 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter3).addAnd(oFilter4);
		var oMappedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilterAnd1).addOr(oFilterAnd2);
		var oExpectedFilter = oFilter5.addAnd(oMappedFilter);
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter, callbackFromStepFilterProcessing); //CUT
		function callbackFromStepFilterProcessing(oFilter) {
			assert.equal(oFilter.toUrlParam(), oExpectedFilter.toUrlParam(), "Correctly enhanced filter returned");
		}
	});
	QUnit.test('WHEN keep source is true THEN second identical request is cached', function(assert) {
		assert.expect(4);
		var that = this;
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("filterMappingKeepSource"));
		this.oStepFilterMapping = this.oConfigurationFactory.createStep("stepFilterMappingKeepSource");
		this.oStepFilterMapping.getFilter = function() {
			return new sap.apf.core.utils.Filter(that.oMessageHandler, "sourceProperty", that.EQ, "A");
		};
		jQuery.extend(this, sap.apf.utils.Filter.getOperators());
		var oFilter1 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "A");
		var oFilter2 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "B");
		var oFilter3 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "C");
		var oFilter4 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "D");
		var oFilter5 = new sap.apf.core.utils.Filter(this.oMessageHandler, "sourceProperty", this.EQ, "A");
		var oFilterAnd1 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter1).addAnd(oFilter2);
		var oFilterAnd2 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter3).addAnd(oFilter4);
		var oMappedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilterAnd1).addOr(oFilterAnd2);
		var oExpectedFilter = oFilter5.addAnd(oMappedFilter);
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter, callbackFromStepFilterProcessing); 
		function callbackFromStepFilterProcessing(oFilter) {
			assert.equal(oFilter.toUrlParam(), oExpectedFilter.toUrlParam(), "Correctly enhanced filter returned once");
			assert.strictEqual(that.requestCounter, 1, "One request sent");
			that.oStepFilterMapping.determineFilter(that.oCumulatedFilter, callbackFromSecondStepFilterProcessing);
			function callbackFromSecondStepFilterProcessing(oFilter) {
				assert.equal(oFilter.toUrlParam(), oExpectedFilter.toUrlParam(), "Correctly enhanced filter returned twice");
				assert.strictEqual(that.requestCounter, 1, "no additional request sent");
			}
		}
	});
	QUnit.test("Filter mapping is executed again when cumulative filter changes", function(assert) {
		var that = this;
		assert.expect(6);
		var usedRequestFilter;
		//setup
		that.spySendGetInBatch = function (oFilter, oConfig) {
			usedRequestFilter = oFilter;
		};
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("filterMappingOneTarget"));
		this.oStepFilterMapping = this.oConfigurationFactory.createStep("stepFilterMappingKeepSource");
		this.oStepFilterMapping.getFilter = function() {
			return new sap.apf.core.utils.Filter(that.oMessageHandler, "sourceProperty", "EQ", "A");
		};
		that.oResponse = {
			data : [{
				targetProperty1 : "A"
			}]
		};
		// Act
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter.copy(), callbackFromStepFilterProcessing); 
		function callbackFromStepFilterProcessing(oFilter) {
			//assert
			assert.equal(oFilter.toUrlParam(),"((sourceProperty%20eq%20%27A%27)%20and%20(targetProperty1%20eq%20%27A%27))" , "Correctly enhanced filter returned");
			assert.strictEqual(that.requestCounter, 1, "One request sent");
			assert.strictEqual(usedRequestFilter.toUrlParam(), "(sourceProperty%20eq%20%27A%27)", "Correct filter used for filter mapping request");
			//Setup change
			that.oCumulatedFilter.addAnd("anotherProperty", "EQ", "B");
			that.oResponse = {
				data : [{
					targetProperty1 : "A"
				}, {
					targetProperty1 : "B"
				}]
			};
			//act change
			that.oStepFilterMapping.determineFilter(that.oCumulatedFilter.copy(), callbackFromSecondStepFilterProcessing);
			function callbackFromSecondStepFilterProcessing(oFilter) {
				//assert
				assert.equal(oFilter.toUrlParam(), "((sourceProperty%20eq%20%27A%27)%20and%20((targetProperty1%20eq%20%27A%27)%20or%20(targetProperty1%20eq%20%27B%27)))", "Correctly enhanced filter returned");
				assert.strictEqual(that.requestCounter, 2, "Second request send");
				assert.strictEqual(usedRequestFilter.toUrlParam(), "((anotherProperty%20eq%20%27B%27)%20and%20(sourceProperty%20eq%20%27A%27))", "Correct filter used for filter mapping request");
			}
		}
	});
	QUnit.test("Filter mapping is executed again when selection changes", function(assert) {
		var that = this;
		assert.expect(6);
		var usedRequestFilter;
		//setup
		that.spySendGetInBatch = function (oFilter, oConfig) {
			usedRequestFilter = oFilter;
		};
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("filterMappingOneTarget"));
		this.oStepFilterMapping = this.oConfigurationFactory.createStep("stepFilterMappingKeepSource");
		this.oStepFilterMapping.getFilter = function() {
			return new sap.apf.core.utils.Filter(that.oMessageHandler, "sourceProperty", "EQ", "A");
		};
		that.oResponse = {
			data : [{
				targetProperty1 : "A"
			}]
		};
		// Act
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter.copy(), callbackFromStepFilterProcessing); 
		function callbackFromStepFilterProcessing(oFilter) {
			//assert
			assert.equal(oFilter.toUrlParam(),"((sourceProperty%20eq%20%27A%27)%20and%20(targetProperty1%20eq%20%27A%27))" , "Correctly enhanced filter returned");
			assert.strictEqual(that.requestCounter, 1, "One request sent");
			assert.strictEqual(usedRequestFilter.toUrlParam(), "(sourceProperty%20eq%20%27A%27)", "Correct filter used for filter mapping request");
			//Setup change
			that.oStepFilterMapping.getFilter = function() {
				return new sap.apf.core.utils.Filter(that.oMessageHandler, "sourceProperty", "EQ", "B");
			};
			that.oResponse = {
				data : [{
					targetProperty1 : "A"
				}, {
					targetProperty1 : "B"
				}]
			};
			//act change
			that.oStepFilterMapping.determineFilter(that.oCumulatedFilter.copy(), callbackFromSecondStepFilterProcessing);
			function callbackFromSecondStepFilterProcessing(oFilter) {
				//assert
				assert.equal(oFilter.toUrlParam(), "((sourceProperty%20eq%20%27B%27)%20and%20((targetProperty1%20eq%20%27A%27)%20or%20(targetProperty1%20eq%20%27B%27)))", "Correctly enhanced filter returned");
				assert.strictEqual(that.requestCounter, 2, "Second request send");
				assert.strictEqual(usedRequestFilter.toUrlParam(), "(sourceProperty%20eq%20%27B%27)", "Correct filter used for filter mapping request");
			}
		}
	});
	QUnit.test("Filter mapping cache is set to empty when selection changes to no selection", function(assert) {
		var that = this;
		assert.expect(5);
		var usedRequestFilter;
		//setup
		that.spySendGetInBatch = function (oFilter, oConfig) {
			usedRequestFilter = oFilter;
		};
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("filterMappingOneTarget"));
		this.oStepFilterMapping = this.oConfigurationFactory.createStep("stepFilterMappingKeepSource");
		this.oStepFilterMapping.getFilter = function() {
			return new sap.apf.core.utils.Filter(that.oMessageHandler, "sourceProperty", "EQ", "A");
		};
		that.oResponse = {
				data : [{
					targetProperty1 : "A"
				}]
		};
		// Act
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter.copy(), callbackFromStepFilterProcessing); 
		function callbackFromStepFilterProcessing(oFilter) {
			//assert
			assert.equal(oFilter.toUrlParam(),"((sourceProperty%20eq%20%27A%27)%20and%20(targetProperty1%20eq%20%27A%27))" , "Correctly enhanced filter returned");
			assert.strictEqual(that.requestCounter, 1, "One request sent");
			assert.strictEqual(usedRequestFilter.toUrlParam(), "(sourceProperty%20eq%20%27A%27)", "Correct filter used for filter mapping request");
			//Setup change
			that.oStepFilterMapping.getFilter = function() {
				return new sap.apf.core.utils.Filter(that.oMessageHandler);
			};
			//act change
			that.oStepFilterMapping.determineFilter(that.oCumulatedFilter.copy(), callbackFromSecondStepFilterProcessing);
			function callbackFromSecondStepFilterProcessing(oFilter) {
				//assert
				assert.equal(oFilter.toUrlParam(), "", "Then empty filter is returned");
				assert.strictEqual(that.requestCounter, 1, "No additional request sent");
			}
		}
	});
	QUnit.module("Filter Mapping with TargetProperty display options", {
		beforeEach : function(assert) {
			var context = this;
			commonSetupStep(this);
			this.stepConfig = {
				binding : "binding",
				request : "request",
				filterMapping : {
					requestForMappedFilter : "filterMappingRequest",
					target : ["mappingProperty"],
					keepSource : "false",
					targetPropertyDisplayOption: "key"
				},
				title : {
					key : "stepTitle"
				}
			};
			this.oCoreApi.getMetadata = function(service){
				assert.strictEqual(service, "mappingService", "Service correctly handed over to fetch metadata");
				var deferred = jQuery.Deferred();
				setTimeout(function(){
					deferred.resolve({
						getPropertyMetadata : function(entitySet, property){
							assert.strictEqual(entitySet, "mappingEntitySet", "EntitySet correctly handed over to fetch metadata");
							assert.strictEqual(property, "mappingProperty", "Property correctly handed over to fetch metadata");
							if(context.textNotAvailable){
								return {};
							}
							return {
								text: "mappingPropertyName"
							};
						}
					});
				}, 1);
				return deferred;
			};
			this.configFactory = {
				createBinding : function(){
					return {
						getFilter : function () {
							return new sap.apf.core.utils.Filter(context.oMessageHandler, "selectableProperty", "EQ", "A");
						}
					};
				},
				createRequest : function(requestObject){
					if(requestObject.selectProperties){
						assert.deepEqual(requestObject.selectProperties, context.expectedSelectProperties, "Correct selectProperties requested");
						return {
							sendGetInBatch : function(oInputFilter, callbackAfterMappingRequest){
								var data = context.filterMappingRequestData || [{
									"mappingProperty" : "B"
								}];
								callbackAfterMappingRequest({
									data : data
								});
							}
						};
					}
				},
				getConfigurationById : function(configId) {
					if(configId === "filterMappingRequest"){
						return {
							id : "filterMappingRequest",
							service : "mappingService",
							entityType : "mappingEntitySet"
						};
					}
					return {};
				}
			};
		}
	});
	QUnit.test("Display option is key", function(assert) {
		var done = assert.async();
		assert.expect(2);
		this.expectedSelectProperties = ["mappingProperty"];
		var step = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		step.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(oFilter){
			assert.strictEqual(oFilter.toUrlParam(), "(mappingProperty%20eq%20%27B%27)", "Correct filter returned from filterMapping");
			done();
		}); 
	});
	QUnit.test("Display option is text", function(assert) {
		var done = assert.async();
		assert.expect(5);
		this.stepConfig.filterMapping.targetPropertyDisplayOption = "text";
		this.expectedSelectProperties = ["mappingProperty", "mappingPropertyName"];
		var step = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		step.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(oFilter){
			assert.strictEqual(oFilter.toUrlParam(), "(mappingProperty%20eq%20%27B%27)", "Correct filter returned from filterMapping");
			done();
		});
	});
	QUnit.test("Display option is keyAndText", function(assert) {
		var done = assert.async();
		assert.expect(5);
		this.stepConfig.filterMapping.targetPropertyDisplayOption = "keyAndText";
		this.expectedSelectProperties = ["mappingProperty", "mappingPropertyName"];
		var step = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		step.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(oFilter){
			assert.strictEqual(oFilter.toUrlParam(), "(mappingProperty%20eq%20%27B%27)", "Correct filter returned from filterMapping");
			done();
		});
	});
	QUnit.test("Display option is keyAndText but there is no text in the metadata", function(assert) {
		var done = assert.async();
		assert.expect(5);
		this.textNotAvailable = true;
		this.stepConfig.filterMapping.targetPropertyDisplayOption = "keyAndText";
		this.expectedSelectProperties = ["mappingProperty"];
		var step = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		step.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(oFilter){
			assert.strictEqual(oFilter.toUrlParam(), "(mappingProperty%20eq%20%27B%27)", "Correct filter returned from filterMapping");
			done();
		});
	});
	QUnit.module('Step no binding test double', {
		beforeEach : function(assert) {
			var that = this;
			commonSetupStep(this);
			sap.apf.core.getMetadata = function() {
				return new sap.apf.testhelper.doubles.Metadata();
			};
			function RequestDouble() {
				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {
					that.requestOptions = oRequestOptions;
					fnCallback('Callback from request double');
				};
			}
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = RequestDouble;
			var oStepConfig = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
			this.oCoreApi = {
				getMetadata : function(){
					return jQuery.Deferred().resolve();
				}
			};
			this.oStep = new sap.apf.core.Step(this.oMessageHandler, oStepConfig, this.oConfigurationFactory, undefined, this.oCoreApi);
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test('getBinding()', function (assert) {
		assert.ok(this.oStep.getBinding() instanceof sap.apf.core.Binding, 'Binding exposed on step');
	});
	QUnit.test('getSelectedRepresentationInfo()', function(assert) {
		var oRepTyp = this.oStep.getSelectedRepresentationInfo();
		assert.ok(oRepTyp, "is defined");
		assert.equal(oRepTyp.representationId, "representationId1", "check representation id");
		assert.equal(oRepTyp.label.key, "Text1", "check label.key");
		assert.deepEqual(this.oStep.getRepresentationInfo()[0], this.oStep.getSelectedRepresentationInfo(), "is first one by default, deep equal");
	});
	QUnit.test('getRepresentationInfo()', function(assert) {
		var aRepInfo = this.oStep.getRepresentationInfo();
		var oRepInfo = aRepInfo[0];
		assert.ok(oRepInfo, "RepresentationInfo is defined");
		assert.equal(oRepInfo.representationId, "representationId1", "RepresentationInfo has representation id");
		assert.equal(oRepInfo.label.key, "Text1", "RepresentationInfo has label.key");
		assert.deepEqual(this.oStep.getRepresentationInfo(), this.oStep.getRepresentationInfo(), "deep equal");
	});
	QUnit.test('Get request options', function(assert) {
		this.oStep.getSelectedRepresentation().emulateRequestOptionsStrategy('all');
		this.oStep.update(new sap.apf.core.utils.Filter(), function() {
		});
		assert.deepEqual(this.requestOptions, {
			paging : {
				top : 20,
				skip : 10,
				inlineCount : true
			}
		}, 'Emulated request options expected');
	});
	QUnit.module('Step - Destroy Function', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.oStep = this.oConfigurationFactory.createStep("stepTemplate2");
			this.oRepresentation = this.oStep.getSelectedRepresentation();
			this.spyRepresentationDestroy = sinon.spy(this.oRepresentation, "destroy");
		},
		afterEach : function() {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test("WHEN Destroy Step is called", function(assert) {
		this.oStep.destroy();
		assert.ok(this.spyRepresentationDestroy.calledOnce, "THEN the destroy of the representation is called");
	});
	QUnit.module('Various methods', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.oStep = this.oConfigurationFactory.createStep("stepTemplate3");
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test("WHEN getAssignedNavigationTargets is called", function(assert) {
		var expectedResult = [ {
			id : 'nav-MM',
			type : 'navigationTarget'
		} ];
		assert.deepEqual(this.oStep.getAssignedNavigationTargets(), expectedResult, "THEN an array containing the navigtion targets assigned in configuration is returned");
	});
	QUnit.module('Step with Representation - empty representations)', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.oStep = this.oConfigurationFactory.createStep("stepTemplate2");
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test('Method getRepresentationInfo', function(assert) {
		assert.ok(this.oStep.getRepresentationInfo(), "getRepresentationInfo() runs");
	});
	QUnit.test('Method getSelectedRepresentationInfo', function(assert) {
		assert.throws(function() {
			var oStep = this.oConfigurationFactory.createStep("initialStep");
			oStep.getSelectedRepresentationInfo();
		}, "successfully thrown, index not in array boundaries");
	});
	QUnit.module('Step with Representation', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			sap.apf.core.getMetadata = function() {
				return new sap.apf.testhelper.doubles.Metadata();
			};
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			var oStepConfig = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
			this.oStep = new sap.apf.core.Step(this.oMessageHandler, oStepConfig, this.oConfigurationFactory);
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test('Method getRepresentationInfo', function(assert) {
		var aRepInfo = this.oStep.getRepresentationInfo();
		assert.ok(aRepInfo, "getRepresentationInfo() obj");
		assert.equal(aRepInfo.length, 4, "getRepresentationInfo() non-empty"); // currently 3 in the configuration
		assert.notEqual(aRepInfo[0], undefined, "aReprs[0] defined");
		assert.notEqual(aRepInfo[1], undefined, "aReprs[1] defined");
		assert.notEqual(aRepInfo[0].representationId, undefined, "Representation id of aReprs[0] defined");
		assert.notEqual(aRepInfo[0].representationLabel.key, undefined, "Representation label of aReprs[0] defined");
	});
	QUnit.test('Method getSelectedRepresentationInfo()', function(assert) {
		var oRT = this.oStep.getSelectedRepresentationInfo();
		assert.ok(oRT, "return obj");
	});
	QUnit.test('Method getSelectedRepresentation()', function(assert) {
		var oSelectedRep = this.oStep.getSelectedRepresentation();
		assert.equal(oSelectedRep.type, "RepresentationTestDouble", "getSelectedRepresentation returned the expected object");
	});
	QUnit.test('Method getAdditionalConfigurationProperties()', function(assert) {
		// TODO This test must be extended if additional properties are added to a steptemplate, e.g. extension, exit etc.
		var oAdditionalConfigurationProperties = this.oStep.getAdditionalConfigurationProperties();
		assert.deepEqual(oAdditionalConfigurationProperties.id, "stepTemplate1", "AdditionalConfigurationProperties has id");
		assert.deepEqual(oAdditionalConfigurationProperties.longTitle, {
		    "key": "longTitleTest",
		    "kind": "text",
		    "type": "label"
		  }, "AdditionalConfigurationProperties has longTitle");
		assert.deepEqual(oAdditionalConfigurationProperties.title, {
		    "key": "localTextReference2",
		    "kind": "text",
		    "type": "label"
		  }, "AdditionalConfigurationProperties has title");
	});
	QUnit.module('Serialization / deserialization', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			sap.apf.core.getMetadata = function() {
				return new sap.apf.testhelper.doubles.Metadata();
			};
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.oStep = this.oConfigurationFactory.createStep("stepTemplate1");
		},
		afterEach : function() {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test('Serialize and deserialize a step', function(assert) {
		var oExpectedSerializableStep = {
			stepId : "stepTemplate1",
			binding : {
				selectedRepresentation : {
					data : [],
					indicesOfSelectedData : [],
					selectionStrategy : "all"
				},
				selectedRepresentationId : "representationId1"
			}
		};
		this.oStep.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.all);
		this.oStep.setData({
			data : [],
			metadata : {}
		}, new sap.apf.core.utils.Filter(this.oMessageHandler, 'SAPClient', sap.apf.utils.Filter.getOperators().EQ, '777'));
		var oSerializableStep = this.oStep.serialize();
		assert.deepEqual(oSerializableStep, oExpectedSerializableStep, "Step serialized as expected");
		this.oNewStep = this.oConfigurationFactory.createStep("stepTemplate1");
		this.oNewStep.deserialize(oSerializableStep);
		assert.deepEqual(this.oNewStep.serialize(), oSerializableStep, "Step deserialized as expected");
	});
	QUnit.module('Adjust cumulative Filter in determineFilter()', {
		beforeEach : function(assert) {
			var testEnv = this;
			commonSetupStep(this);
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = function(){
				this.sendGetInBatch = function(filter, callback){
					assert.strictEqual(filter.toUrlParam(), "((newFilter%20eq%201)%20and%20(filterFromSelection%20eq%201))", "Filter mapping called with new cumulative Filter as well as selection");
					callback({
						data: [
							{
								filterFromTargetMapping: 1
							}
						]
					});
				};
			};
			this.oStepConfig = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
			this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.oStepConfig, this.oConfigurationFactory);
			this.oStep.adjustCumulativeFilter = function(cumulativeFilter){
				assert.strictEqual(cumulativeFilter.toUrlParam(), "(oldFilter%20eq%201)", "adjustCumulativeFilter called with old cumulative Filter");
				return new sap.apf.core.utils.Filter(testEnv.oMessageHandler, "newFilter", "eq", 1);
			};
			this.getFilterStub = sinon.stub(this.oStep.getBinding(), "getFilter", function(){
				return new sap.apf.core.utils.Filter(testEnv.oMessageHandler, "filterFromSelection", "eq", 1);
			});
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test('Without mapping required', function(assert){
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler, "oldFilter", "eq", 1), function(filter, cumulativeFilter){
			assert.strictEqual(filter.toUrlParam(), "(filterFromSelection%20eq%201)", "Callback called with selection Filter");
			assert.strictEqual(cumulativeFilter.toUrlParam(), "(newFilter%20eq%201)", "Callback called with new cumulative Filter");
		});
	});
	QUnit.test('With mapping required', function(assert){
		this.oStepConfig.filterMapping = {
			requestForMappedFilter : "requestTemplate1",
			target : ["filterFromTargetMapping"],
			keepSource : "false"
		};
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler, "oldFilter", "eq", 1), function(filter, cumulativeFilter){
			assert.strictEqual(filter.toUrlParam(), "(filterFromTargetMapping%20eq%201)", "Callback called with selection Filter");
			assert.strictEqual(cumulativeFilter.toUrlParam(), "(newFilter%20eq%201)", "Callback called with new cumulative Filter");
		});
	});
	QUnit.module("GetFilterInformation", {
		beforeEach: function(assert){
			commonSetupForGetFilterInformation(this);
		}
	});
	QUnit.test("StepIndex is 1", function(assert){
		var done = assert.async();
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 1).done(function(filterInformation){
			this.expectedFilterInformation[0].stepIndex = 1;
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Correct filter information returned");
			done();
		}.bind(this));
	});
	QUnit.test("Get step title - normal title", function(assert){
		var done = assert.async();
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Correct filter information returned");
			done();
		}.bind(this));
	});
	QUnit.test("Get step title - long title", function(assert){
		var done = assert.async();
		this.stepConfig.longTitle = {
			key : "longTitle"
		};
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			this.expectedFilterInformation[0].text = "text:longTitle";
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Correct filter information returned");
			done();
		}.bind(this));
	});
	QUnit.test("No selectable property", function(assert){
		var done = assert.async();
		this.binding = {
				requiredFilters : undefined
		};
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			this.expectedFilterInformation[0].selectablePropertyLabel = undefined;
			this.expectedFilterInformation[0].warningIcon = true;
			this.expectedFilterInformation[0].warningText = "text:noSelectionPossible";
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Correct filter information returned");
			done();
		}.bind(this));
	});
	QUnit.test("Selectable Property label - label from configuration", function(assert){
		var done = assert.async();
		this.binding = {
			requiredFilters : ["selectableProperty"],
			requiredFilterOptions : {
				fieldDesc: {
					key: "filter property text key"
				}
			}
		};
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			this.expectedFilterInformation[0].selectablePropertyLabel = "text:filter property text key";
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Correct filter information returned");
			done();
		}.bind(this));
	});
	QUnit.test("Selectable Property label - label from metadata", function(assert){
		var done = assert.async();
		this.labelAvailable = true;
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			this.expectedFilterInformation[0].selectablePropertyLabel = "label:dataService,dataEntityType,selectableProperty";
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Correct filter information returned");
			done();
		}.bind(this));
	});
	QUnit.test("Selectable Property label - label available in metadata and configuration", function(assert){
		var done = assert.async();
		this.binding = {
			requiredFilters : ["selectableProperty"],
			requiredFilterOptions : {
				fieldDesc: {
					key: "filter property text key"
				}
			}
		};
		this.labelAvailable = true;
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			this.expectedFilterInformation[0].selectablePropertyLabel = "text:filter property text key";
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Correct filter information returned");
			done();
		}.bind(this));
	});
	QUnit.test("Selectable Property label - no label", function(assert){
		var done = assert.async();
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			this.expectedFilterInformation[0].selectablePropertyLabel = "selectableProperty";
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Correct filter information returned");
			done();
		}.bind(this));
	});
	QUnit.test("Filter Values retrieved from getSelections", function(assert){
		var done = assert.async();
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			this.expectedFilterInformation[0].selectablePropertyLabel = "selectableProperty";
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Correct filter information returned");
			done();
		}.bind(this));
	});
	QUnit.module("GetFilterInformation with filterMapping", {
		beforeEach: function(assert){
			commonSetupForGetFilterInformation(this);
			this.stepConfig = {
				binding : "binding",
				request : "request",
				filterMapping : {
					requestForMappedFilter : "filterMappingRequest",
					target : ["mappingProperty"],
					keepSource : "true",
					targetPropertyDisplayOption : "key"
				},
				title : {
					key : "stepTitle"
				}
			};
			this.expectedFilterInformation.push({
				text : "text:stepTitle",
				selectablePropertyLabel : "mappingProperty",
				filterValues : [{
					text : "B"
				}],
				infoIcon : true,
				infoText : "text:infoIconfilterMapping",
				warningIcon : false,
				warningText : undefined,
				stepIndex : 0
			});
		}
	});
	QUnit.test("Step has filterMapping configured", function(assert) {
		var done = assert.async();
		var spySort = sinon.spy(sap.apf.utils, "sortByProperty");
		var spyConvert = sinon.spy(sap.apf.utils, "convertToExternalFormat");
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Filter mapping entry is returned");
				assert.equal(spySort.calledOnce, true, "THEN sortByProperty has been called");
				assert.deepEqual(spySort.args[0][0], [{ text: "B"}], "THEN correct argument list for sorting");
				spySort.restore();
				assert.equal(spyConvert.calledOnce, true, "THEN conversion has been called");
				assert.deepEqual(spyConvert.args[0][0], "B", "THEN correct argument for conversion");
				spyConvert.restore();
				done();
			}.bind(this));
		}.bind(this)); 
	});
	QUnit.test("Filter mapping values are sorted", function(assert) {
		var done = assert.async();
		this.stepConfig.filterMapping.targetPropertyDisplayOption = "keyAndText";
		this.textAvailable = true;
		this.filterMappingRequestData = [{
			"mappingProperty" : "B",
			"mappingPropertyName" : "Berlin"
		},{
			"mappingProperty" : "A",
			"mappingPropertyName" : "NichtA"
		},{
			"mappingProperty" : "AB",
			"mappingPropertyName" : "ABText"
		}];
		this.expectedFilterInformation[1].filterValues = [{
			text: "ABText (AB)"
		},{
			text: "Berlin (B)"
		},{
			text: "NichtA (A)"
		}];
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Filter mapping values are sorted by texts");
				done();
			}.bind(this));
		}.bind(this)); 
	});
	QUnit.test("Filter mapping with displayOption text", function(assert) {
		var done = assert.async();
		this.stepConfig.filterMapping.targetPropertyDisplayOption = "text";
		this.textAvailable = true;
		this.filterMappingRequestData = [{
			"mappingProperty" : "B",
			"mappingPropertyName" : "Berlin"
		}];
		this.expectedFilterInformation[1].filterValues = [{
			text: "Berlin"
		}];
		var spy = sinon.spy(sap.apf.utils, "convertToExternalFormat");
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Filter mapping entry is returned");
				assert.equal(spy.calledOnce, false, "THEN conversion has not been called");
				spy.restore();
				done();
			}.bind(this));
		}.bind(this)); 
	});
	QUnit.test("Filter mapping with displayOption text but no text Property Available", function(assert) {
		var done = assert.async();
		this.stepConfig.filterMapping.targetPropertyDisplayOption = "text";
		this.textAvailable = false;
		this.filterMappingRequestData = [{
			"mappingProperty" : "B"
		}];
		this.expectedFilterInformation[1].filterValues = [{
			text: "B"
		}];
		var spy = sinon.spy(sap.apf.utils, "convertToExternalFormat");
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Filter mapping entry is returned");
				assert.equal(spy.calledOnce, true, "THEN conversion was applied");
				assert.equal(spy.args[0][0], "B", "THEN conversion was applied on B");
				spy.restore();
				done();
			}.bind(this));
		}.bind(this)); 
	});
	QUnit.test("Filter mapping with displayOption keyAndText", function(assert) {
		var done = assert.async();
		this.stepConfig.filterMapping.targetPropertyDisplayOption = "keyAndText";
		this.textAvailable = true;
		this.filterMappingRequestData = [{
			"mappingProperty" : "B",
			"mappingPropertyName" : "Berlin"
		}];
		this.expectedFilterInformation[1].filterValues = [{
			text: "Berlin (B)"
		}];
		var spy = sinon.spy(sap.apf.utils, "convertToExternalFormat");
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Filter mapping entry is returned");
				assert.equal(spy.calledOnce, true, "THEN conversion has been called");
				assert.deepEqual(spy.args[0][0], "B", "THEN conversion function has been called with key B");
				done();
			}.bind(this));
		}.bind(this)); 
	});
	QUnit.test("Filter mapping with displayOption keyAndText but not text property available", function(assert) {
		var done = assert.async();
		this.stepConfig.filterMapping.targetPropertyDisplayOption = "keyAndText";
		this.textAvailable = false;
		this.filterMappingRequestData = [{
			"mappingProperty" : "B"
		}];
		this.expectedFilterInformation[1].filterValues = [{
			text: "B"
		}];
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Filter mapping entry is returned");
				done();
			}.bind(this));
		}.bind(this)); 
	});
	QUnit.test("Step with filterMapping and no selections", function(assert){
		var done = assert.async();
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.expectedFilterInformation[1].filterValues = [];
		this.expectedFilterInformation[1].warningIcon = true;
		this.expectedFilterInformation[1].warningText = "text:nothingSelected";
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Filter mapping entry has warning for no selections");
			done();
		}.bind(this));
	});
	QUnit.test("Step with filterMapping first with selection and then no selections", function(assert){
		var done = assert.async();
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Filter Values from filter mapping are there");
				this.chartSelectionFilter = new sap.apf.core.utils.Filter(this.oMessageHandler);
				this.expectedFilterInformation[1].filterValues = [];
				this.expectedFilterInformation[1].warningIcon = true;
				this.expectedFilterInformation[1].warningText = "text:nothingSelected";
				this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
					this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
						assert.deepEqual(filterInformation, this.expectedFilterInformation, "Filter values are no longer in present in filtermapping");
						done();
					}.bind(this));
				}.bind(this)); 
			}.bind(this));
		}.bind(this)); 
	});
	QUnit.test("Step with longTitle", function(assert) {
		var done = assert.async();
		this.stepConfig.longTitle = {
			key : "stepLongTitle"
		};
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.expectedFilterInformation[0].text = "text:stepLongTitle";
		this.expectedFilterInformation[1].text = "text:stepLongTitle";
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Long title is used in filter mapping entry");
				done();
			}.bind(this));
		}.bind(this)); 
	});
	QUnit.test("Label for mapped property is available in metadata", function(assert) {
		var done = assert.async();
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.labelAvailable = true;
		this.expectedFilterInformation[0].selectablePropertyLabel = "label:dataService,dataEntityType,selectableProperty";
		this.expectedFilterInformation[1].selectablePropertyLabel = "label:mappingService,mappingEntityType,mappingProperty";
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Label is used in filter mapping entry");
				done();
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Label for mapped property is set in modeler", function(assert){
		var done = assert.async();
		this.stepConfig.filterMapping.targetPropertyLabelKey = "labelFromModeler";
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.labelAvailable = true;
		this.expectedFilterInformation[0].selectablePropertyLabel = "label:dataService,dataEntityType,selectableProperty";
		this.expectedFilterInformation[1].selectablePropertyLabel = "text:labelFromModeler";
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Label is used in filter mapping entry");
				done();
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("KeepSource is set to false", function(assert) {
		var done = assert.async();
		this.stepConfig.filterMapping.keepSource = "false";
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		var expectedFilterInformation = [{
			text : "text:stepTitle",
			selectablePropertyLabel : "mappingProperty",
			filterValues : [{
				text : "B"
			}],
			infoIcon : true,
			infoText : "text:infoIconfilterMapping",
			warningIcon : false,
			warningText : undefined,
			stepIndex : 0
		}];
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, expectedFilterInformation, "Only filter mapping entry is returned");
				done();
			});
		}.bind(this));
	});
	QUnit.test("Target property of filter mapping is not applicable for current step", function(assert) {
		var done = assert.async();
		this.filterMappingRequestData = [{
			"notApplicableMappingProperty" : "B"
		}];
		this.stepConfig.filterMapping.target = ["notApplicableMappingProperty"];
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.expectedFilterInformation[1].selectablePropertyLabel = "notApplicableMappingProperty";
		this.expectedFilterInformation[1].warningIcon = true;
		this.expectedFilterInformation[1].warningText = "text:filterNotApplicable";
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Filter mapping entry has warning for not applicable");
				done();
			}.bind(this));
		}.bind(this)); 
	});
	QUnit.test("Target property of filter mapping is not applicable for current step and filterMappingRequest returns no data", function(assert) {
		var done = assert.async();
		this.filterMappingRequestData = [];
		this.stepConfig.filterMapping.target = ["notApplicableMappingProperty"];
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.expectedFilterInformation[1].filterValues = [];
		this.expectedFilterInformation[1].selectablePropertyLabel = "notApplicableMappingProperty";
		this.expectedFilterInformation[1].warningIcon = true;
		this.expectedFilterInformation[1].warningText = "text:filterNotApplicable";
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Filter Mapping entry has warning for not applicable");
				done();
			}.bind(this));
		}.bind(this)); 
	});
	QUnit.test("StepIndex is 1", function(assert){
		var done = assert.async();
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.determineFilter(new sap.apf.core.utils.Filter(this.oMessageHandler), function(){// execute Filter Mapping
			this.oStep.getFilterInformation(this.activeStep, 1).done(function(filterInformation){
				this.expectedFilterInformation[0].stepIndex = 1;
				this.expectedFilterInformation[1].stepIndex = 1;
				assert.deepEqual(filterInformation, this.expectedFilterInformation, "Filter mapping entry is returned");
				done();
			}.bind(this));
		}.bind(this)); 
	});
	QUnit.module("GetFilterInformation Warning Icons", {
		beforeEach: function(assert){
			commonSetupForGetFilterInformation(this);
		}
	});
	QUnit.test("Property is filterableProperty in active step", function(assert) {
		var done = assert.async();
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "No warning as selectable property is filterable in active step");
			done();
		}.bind(this));
	});
	QUnit.test("Property is parameter in active step", function(assert) {
		var done = assert.async();
		this.binding = {
			requiredFilters : ["parameter"]
		};
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			this.expectedFilterInformation[0].selectablePropertyLabel = "parameter";
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "No warning as parameter can be used in active step");
			done();
		}.bind(this));
	});
	QUnit.test("Property is not filterable in active step", function(assert) {
		var done = assert.async();
		this.binding = {
			requiredFilters : ["notFilterableInActiveStep"]
		};
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			this.expectedFilterInformation[0].selectablePropertyLabel = "notFilterableInActiveStep";
			this.expectedFilterInformation[0].warningIcon = true;
			this.expectedFilterInformation[0].warningText = "text:filterNotApplicable";
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Warning for filter not applicable is there");
			done();
		}.bind(this));
	});
	QUnit.test("Nothing selected", function(assert) {
		var done = assert.async();
		this.selections = [];
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			this.expectedFilterInformation[0].filterValues = [];
			this.expectedFilterInformation[0].warningIcon = true;
			this.expectedFilterInformation[0].warningText = "text:nothingSelected";
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Warning for nothing selected is there");
			done();
		}.bind(this));
	});
	QUnit.test("Nothing selected and not applicable for current step", function(assert) {
		var done = assert.async();
		this.binding = {
			requiredFilters : ["notFilterableInActiveStep"]
		};
		this.selections = [];
		this.oStep = new sap.apf.core.Step(this.oMessageHandler, this.stepConfig, this.configFactory, undefined, this.oCoreApi);
		this.oStep.getFilterInformation(this.activeStep, 0).done(function(filterInformation){
			this.expectedFilterInformation[0].selectablePropertyLabel = "notFilterableInActiveStep";
			this.expectedFilterInformation[0].filterValues = [];
			this.expectedFilterInformation[0].warningIcon = true;
			this.expectedFilterInformation[0].warningText = "text:filterNotApplicable";
			assert.deepEqual(filterInformation, this.expectedFilterInformation, "Warning for filter not applicable has priority");
			done();
		}.bind(this));
	});
}());