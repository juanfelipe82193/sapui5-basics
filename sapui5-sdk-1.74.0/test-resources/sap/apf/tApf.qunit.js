/*global sap, jQuery, sinon, OData, Promise */
sap.ui.define([
	'sap/apf/testhelper/odata/injectDatajs',
	'sap/ui/thirdparty/sinon'
	], function(InjectDatajs, sinon) {
	'use strict';

	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
	jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
	jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
	jQuery.sap.require('sap.apf.testhelper.doubles.request');
	jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
	jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerStubbedAjax');
	jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');
	jQuery.sap.require('sap.apf.testhelper.doubles.textResourceHandler');
	jQuery.sap.require('sap.apf.testhelper.doubles.navigationHandler');
	jQuery.sap.require('sap.apf.testhelper.createComponentAsPromise');
	jQuery.sap.require('sap.apf.Component');
	jQuery.sap.require('sap.apf.base.Component');
	jQuery.sap.require('sap.apf.api');
	jQuery.sap.require('sap.apf.testhelper.createComponentAsPromise');

	function defineDummyComponent() {
		return {
			getComponentData : function() {
				return {
					startupParameters : {}
				};
			}
		};
	}

	QUnit.module('Text retrieval from HDB-textbundle by key', {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.createComponentAsPromise(this, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true}).done(function(){
						done();
					});
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test('No placeholders, no HTML encoding', function(assert) {
		var text = this.oApi.getTextNotHtmlEncoded('add-step');
		assert.ok(text.indexOf(" ") > -1, "String contains whitespaces -> not HTML encoded");
	});
	QUnit.test('With placeholders, no HTML encoding', function(assert) {
		var text = this.oApi.getTextNotHtmlEncoded('print-step-number', [ '1', 'two', 'three' ]);
		assert.ok(text.indexOf(" ") > -1, "String contains whitespaces -> not HTML encoded");
	});
	QUnit.test('No placeholders, with HTML encoding', function(assert) {
		var encodedtext = this.oApi.getTextHtmlEncoded('add-step');
		assert.ok((encodedtext.indexOf(" ") <= -1), "String contains no whitespaces -> HTML encoded");
	});
	QUnit.test('With placeholders, with HTML encoding', function(assert) {
		var encodedtext = this.oApi.getTextHtmlEncoded('print-step-number', [ '1', 'two', 'three' ]);
		assert.ok((encodedtext.indexOf(" ") <= -1), "String contains no whitespaces -> HTML encoded");
	});
	QUnit.module('Representation', {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.doubles.ResourcePathHandler.prototype.loadConfigFromFilePath = function() {
				this.oMessageHandler.loadConfig(this.getApfMessages(), true);
				this.oMessageHandler.loadConfig(this.getAppMessages());
				var oConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
				this.oCoreApi.loadAnalyticalConfiguration(oConfiguration);
			};
			var inject = {
					constructors : {
						Metadata : sap.apf.testhelper.doubles.Metadata,
						Request : sap.apf.testhelper.doubles.Request,
						ResourcePathHandler : sap.apf.testhelper.doubles.ResourcePathHandler
					}
			};
			sap.apf.testhelper.createComponentAsPromise(this, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, path : "/path/of/no/interest/",  inject : inject}).done(function(){
						done();
					});
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test('Filter method types', function(assert) {
		assert.equal(sap.apf.core.constants.filterMethodTypes.selectionAsArray, 'saa', 'Selection as arrray exists');
		assert.equal(sap.apf.core.constants.filterMethodTypes.filter, 'f', 'Filter object exists');
	});
	QUnit.test('Method setData() sets metadata object for correct entity type in representation', function(assert) {
		
		var oStep = this.oApi.createStep('stepTemplate2', function() {	});
		var oMetadataFromRepresentationDouble = oStep.getSelectedRepresentation().getParametersOfSetData().metadata;
		assert.deepEqual(oMetadataFromRepresentationDouble.getPropertyMetadata('entityTypeWithParams', 'stringProperty'), {
			"name" : "stringProperty",
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "30"
			},
			"aggregation-role" : "dimension"
		}, 'Metadata of property belonging to entity type set in request configuration expected');
		assert.deepEqual(oMetadataFromRepresentationDouble.getPropertyMetadata('entityTypeWithParams', 'int32Property'), {
			"name" : "int32Property",
			"dataType" : {
				"type" : "Edm.Int32"
			},
			"aggregation-role" : "measure",
			"filterable" : false
		}, 'Metadata of another property belonging to entity type set in request configuration expected');
		

	});
	QUnit.test('Set representation by representation id when creating a step', function(assert) {
		var oStepDefaultRepresentation = this.oApi.createStep('stepTemplate3', function() {
			return null;
		});
		var oStepSelectedRepresentation = this.oApi.createStep('stepTemplate3', function() {
			return null;
		}, 'representationId1');
		assert.equal(oStepDefaultRepresentation.getSelectedRepresentationInfo().representationId, 'representationId2', 'First representation from configuration file expected');
		assert.equal(oStepSelectedRepresentation.getSelectedRepresentationInfo().representationId, 'representationId1', 'Representation ID set in create method expected');
	});
	QUnit.module('Step activation/deactivation', {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.doubles.ResourcePathHandler.prototype.loadConfigFromFilePath = function() {
				this.oMessageHandler.loadConfig(this.getApfMessages(), true);
				this.oMessageHandler.loadConfig(this.getAppMessages());
				var oConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
				this.oCoreApi.loadAnalyticalConfiguration(oConfiguration);
			};
			var inject = {
					constructors : {
						Metadata : sap.apf.testhelper.doubles.Metadata,
						Request : sap.apf.testhelper.doubles.Request,
						ResourcePathHandler : sap.apf.testhelper.doubles.ResourcePathHandler
					}
			};
			sap.apf.testhelper.createComponentAsPromise(this, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, path : "/path/of/no/interest/",  inject : inject}).done(function(){
						done();
					});
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		},
		addThreeSteps : function() {
			this.oStep1 = this.oApi.createStep('stepTemplate1', function() {
				return null;
			});
			this.oStep2 = this.oApi.createStep('stepTemplate1', function() {
				return null;
			});
			this.oStep3 = this.oApi.createStep('stepTemplate1', function() {
				return null;
			});
		}
	});
	QUnit.test('Activation', function(assert) {
		this.addThreeSteps();
		assert.equal(this.oApi.getActiveStep(), undefined, 'No step active without explicit activation');
		this.oApi.setActiveStep(this.oStep3);
		assert.equal(this.oApi.getActiveStep(), this.oStep3, 'Correct active step returned after activation');
		assert.ok(!this.oApi.stepIsActive(this.oStep1), 'Activation check for non-active step negative');
		assert.ok(this.oApi.stepIsActive(this.oStep3), 'Activation check for active step positive');
	});
	QUnit.test('Deactivation', function(assert) {
		this.addThreeSteps();
		this.oApi.setActiveStep(this.oStep3);
		this.oApi.setActiveStep(this.oStep2);
		assert.ok(!this.oApi.stepIsActive(this.oStep3), 'Step3 inactive after activation of Step2');
		this.oApi.setActiveStep(this.oStep1);
		assert.ok(!this.oApi.stepIsActive(this.oStep2), 'Step2 inactive after activation of Step1');
		assert.ok(this.oApi.stepIsActive(this.oStep1), 'Step1 is active');
	});
	QUnit.test('Double activation', function(assert) {
		this.addThreeSteps();
		this.oApi.setActiveStep(this.oStep3);
		this.oApi.setActiveStep(this.oStep2);
		this.oApi.setActiveStep(this.oStep2);
		assert.equal(this.oApi.getActiveStep(), this.oStep2, 'Correct active step returned');
		assert.ok(this.oApi.stepIsActive(this.oStep2), 'Step2 still active after double activation');
	});
	QUnit.test('GetActiveStep() for empty path', function(assert) {
		assert.equal(this.oApi.getSteps().length, 0, 'Empty path has length 0');
		assert.deepEqual(this.oApi.getActiveStep(), undefined, 'Undefined expected for empty path when retrieving active step');
	});
	QUnit.module('Core Api with Configuration Factory - getConfigurationObjectById', {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			this.configurationTemplate = sap.apf.testhelper.config.getSampleConfiguration('addTwoFacetFilters');
			sap.apf.testhelper.doubles.ResourcePathHandler.prototype.loadConfigFromFilePath = function() {
				this.oMessageHandler.loadConfig(this.getApfMessages(), true);
				this.oMessageHandler.loadConfig(this.getAppMessages());
				this.oCoreApi.loadAnalyticalConfiguration(that.configurationTemplate);
				that.oCoreApi = this.oCoreApi;
			};
			var MetadataStub = function() {
				this.getAllProperties = function() {
					
					return sap.apf.utils.createPromise([]);
				};
				this.isInitialized = function() {
					return sap.apf.utils.createPromise(this);
				};
			};
			var inject = {
					constructors : {
						Metadata : MetadataStub,
						ResourcePathHandler : sap.apf.testhelper.doubles.ResourcePathHandler
					}
			};
			sap.apf.testhelper.createComponentAsPromise(this, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, path : "/path/of/no/interest/",  inject : inject}).done(function(){
						done();
					});
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test("Step template", function(assert){
		var stepTemplate = this.oCoreApi.getConfigurationObjectById("stepTemplate1");
		assert.strictEqual(stepTemplate.type, "step", "Step type correct");
		assert.strictEqual(stepTemplate.binding, "bindingTemplate1", "Step binding correct");
		assert.strictEqual(stepTemplate.request, "requestTemplate1", "Step request correct");
	});
	QUnit.test("Hierarchical Step template", function(assert){
		var stepTemplate = this.oCoreApi.getConfigurationObjectById("hierarchicalStepId");
		assert.strictEqual(stepTemplate.type, "hierarchicalStep", "Step type correct");
		assert.strictEqual(stepTemplate.hierarchyProperty, "hierarchyProperty", "Step hierarchy property correct");
		assert.strictEqual(stepTemplate.binding, "hierarchicalBinding", "Step binding correct");
		assert.strictEqual(stepTemplate.request, "hierarchicalRequestTemplate1", "Step request correct");
	});
	QUnit.test("Binding template", function(assert){
		var bindingTemplate = this.oCoreApi.getConfigurationObjectById("bindingTemplate1");
		assert.strictEqual(bindingTemplate.type, "binding", "Binding type correct");
		assert.strictEqual(bindingTemplate.requiredFilters[0], "Customer", "Required Filter correct");
	});
	QUnit.test("Request template", function(assert){
		var requestTemplate = this.oCoreApi.getConfigurationObjectById("requestTemplate1");
		assert.strictEqual(requestTemplate.type, "request", "Request type correct");
		assert.strictEqual(requestTemplate.service, "dummy.xsodata", "Request service correct");
	});
	QUnit.module('Configuration factory', {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			this.configurationTemplate = sap.apf.testhelper.config.getSampleConfiguration('addTwoFacetFilters');
			sap.apf.testhelper.doubles.ResourcePathHandler.prototype.loadConfigFromFilePath = function() {
				this.oMessageHandler.loadConfig(this.getApfMessages(), true);
				this.oMessageHandler.loadConfig(this.getAppMessages());
				this.oCoreApi.loadAnalyticalConfiguration(that.configurationTemplate);
			};
			var MetadataStub = function() {
				this.getAllProperties = function() {
					
					return sap.apf.utils.createPromise([]);
				};
				this.isInitialized = function() {
					return sap.apf.utils.createPromise(this);
				};
			};
			var inject = {
					constructors : {
						Metadata : MetadataStub,
						ResourcePathHandler : sap.apf.testhelper.doubles.ResourcePathHandler
					}
			};
			sap.apf.testhelper.createComponentAsPromise(this, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, path : "/path/of/no/interest/",  inject : inject}).done(function(){
						done();
					});
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test('Get step templates', function(assert) {
		var aStepTemplates = this.oApi.getStepTemplates();
		
		assert.equal(aStepTemplates.length, this.configurationTemplate.steps.length, 'Correct amount of steps returned');
		var checkProperties = true;
		var i;
		for(i = 0; i < aStepTemplates.length; i++) {
			// check for mandatory properties
			if ((aStepTemplates[i].type !== 'stepTemplate')) {
				checkProperties = false;
			}
			if (!(aStepTemplates[i].hasOwnProperty('id'))) {
				checkProperties = false;
			}
			if (!(aStepTemplates[i].hasOwnProperty('title'))) {
				checkProperties = false;
			}
			if (!(aStepTemplates[i].hasOwnProperty('getRepresentationInfo'))) {
				checkProperties = false;
			}
			// check for forbidden properties
			if (aStepTemplates[i].hasOwnProperty('binding')) {
				checkProperties = false;
			}
			if (aStepTemplates[i].hasOwnProperty('request')) {
				checkProperties = false;
			}
			if (aStepTemplates[i].hasOwnProperty('exit')) {
				checkProperties = false;
			}
			if (aStepTemplates[i].hasOwnProperty('categories')) {
				checkProperties = false;
			}
		}
		assert.ok(checkProperties, 'Returned step templates have properties type, id, title, thumbnail');
		var aStepTemplates2 = this.oApi.getStepTemplates();
		assert.equal(aStepTemplates2.length, this.configurationTemplate.steps.length, 'Correct amount of steps returned at the second call');
	});
	QUnit.test('Get categories', function(assert) {
		var aCategories = this.oApi.getCategories();
		assert.equal(aCategories.length, this.configurationTemplate.categories.length, 'Correct amount of categories returned');
		var checkProperties = true;
		var i;
		for(i = 0; i < aCategories.length; i++) {
			if (((aCategories[i].type !== 'category'))) {
				checkProperties = false;
			}
			if (!(aCategories[i].hasOwnProperty('id'))) {
				checkProperties = false;
			}
			if (!(aCategories[i].hasOwnProperty('label'))) {
				checkProperties = false;
			}
			if (!(aCategories[i].hasOwnProperty('stepTemplates'))) {
				checkProperties = false;
			}
		}
		assert.ok(checkProperties, 'Returned categories have properties type, id, label and stepTemplates');
	});
	QUnit.test('Get facet filter configurations', function(assert) {
		var facetFilters = this.oApi.getFacetFilterConfigurations();
		assert.equal(facetFilters.length, 2, 'Two facet filter configurations returned');
	});
	QUnit.module('Remove step', {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.doubles.ResourcePathHandler.prototype.loadConfigFromFilePath = function() {
				this.oMessageHandler.loadConfig(this.getApfMessages(), true);
				this.oMessageHandler.loadConfig(this.getAppMessages());
				var oConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
				this.oCoreApi.loadAnalyticalConfiguration(oConfiguration);
			};
			var inject = {
					constructors : {
						Request : sap.apf.testhelper.doubles.Request,
						ResourcePathHandler : sap.apf.testhelper.doubles.ResourcePathHandler,
						Metadata : sap.apf.testhelper.doubles.Metadata
					}
			};
			sap.apf.testhelper.createComponentAsPromise(this, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, path : "/path/of/no/interest/",  inject : inject}).done(function(){
						done();
					});
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		},
		addThreeSteps : function() {
			this.oStep1 = this.oApi.createStep('stepTemplate1', function() {
				return null;
			});
			this.oStep2 = this.oApi.createStep('stepTemplate1', function() {
				return null;
			});
			this.oStep3 = this.oApi.createStep('stepTemplate1', function() {
				return null;
			});
		}
	});
	QUnit.test('Delete one step from path with three steps which have the same id', function(assert) {
		this.addThreeSteps();
		assert.equal(this.oApi.getSteps().length, 3, 'Precondition three steps in path');
		var nCounterForSetData = 0;
		var myCallback = function() {
			nCounterForSetData++;
		};
		this.oApi.removeStep(this.oStep3, myCallback);
		assert.equal(this.oApi.getSteps().length, 2, 'Only two steps left in the path');
		assert.equal(nCounterForSetData, 2, 'Two steps were updated');
	});
	QUnit.module('Filter creation', {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.createComponentAsPromise(this, { stubAjaxForResourcePaths : true, doubleUiInstance : true}).done(function(){
				done();
			});
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test('createFilter works', function(assert) {
		var oFilter = this.oApi.createFilter();
		assert.equal(oFilter instanceof sap.apf.utils.Filter, true, 'Filter object returned');
	});

	function setupWithDatajsInjection(context, assert) {
		var done = assert.async();
		sap.apf.testhelper.doubles.ResourcePathHandler.prototype.loadConfigFromFilePath = function() {
			this.oMessageHandler.loadConfig(this.getApfMessages(), true);
			this.oMessageHandler.loadConfig(this.getAppMessages());
			var oConfigurationTemplate = sap.apf.testhelper.config.getSampleConfiguration();
			this.oCoreApi.loadAnalyticalConfiguration(oConfigurationTemplate);
		};

		var inject = {
				instances : {
					datajs : InjectDatajs.injectODataDouble()
				},
				constructors : {
					Metadata : sap.apf.testhelper.doubles.Metadata,
					SessionHandler : sap.apf.testhelper.doubles.SessionHandlerStubbedAjax,
					ResourcePathHandler : sap.apf.testhelper.doubles.ResourcePathHandler
				}
		};
		sap.apf.testhelper.createComponentAsPromise(context, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true, path : "/path/of/no/interest/", inject : inject}).done(function(){
					done();
				});
	}
	QUnit.module('Read Request with test data', {
		beforeEach : function(assert) {
			setupWithDatajsInjection(this, assert);
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test('Filter on client', function(assert) {
		var done = assert.async();
		assert.expect(4);
		var oFilter = this.oApi.createFilter();
		oFilter.getTopAnd().addExpression({
			name : "SAPClient",
			operator : sap.apf.core.constants.FilterOperators.EQ,
			value : '777'
		});
		var assertRequestReturnsData = function(oDataResponse, oMetadata, oMessageObject) {
			assert.equal(oDataResponse.length, 11, 'Returns expected number of data records');
			assert.equal((oMetadata && oMetadata.type && oMetadata.type === 'entityTypeMetadata'), true, 'Metadata object was returned');
			assert.equal(oMessageObject, undefined, 'No message is expected');
			done();
		};
		var oReadRequest = this.oApi.createReadRequest('requestTemplate1');
		oReadRequest.getMetadata().done(function(metadata){
			assert.equal(metadata && metadata.type && metadata.type === 'entityTypeMetadata', true, 'Function works as expected');
			oReadRequest.send(oFilter, assertRequestReturnsData.bind(this));
		});
	});
	QUnit.module('Request options', {
		beforeEach : function(assert) {
			setupWithDatajsInjection(this, assert);
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test('Paging: $top, $skip and $inlincount can be added to URI', function(assert) {
		var done = assert.async();
		var bStringIncluded;
		var oStep1 = this.oApi.createStep('stepTemplate2', function() {
			return null;
		});
		var oStep2 = this.oApi.createStep('stepTemplate2', function() {
			return null;
		});
		var oRepresentation1 = oStep1.getSelectedRepresentation();
		var oRepresentation2 = oStep2.getSelectedRepresentation();
		oRepresentation1.emulateSelectionStrategy('allMinus1');
		oRepresentation2.emulateRequestOptionsStrategy('all');
		this.oApi.updatePath(function(oStep) {
			if(oStep === oStep2){
				bStringIncluded = InjectDatajs.getUriFromODataSpy().search('\\$top=20') >= 0; // must escape '$' because of implicit RegExp conversion
				assert.ok(bStringIncluded, '$top expected in URI');
				bStringIncluded = InjectDatajs.getUriFromODataSpy().search('\\$skip=10') >= 0;
				assert.ok(bStringIncluded, '$skip expected in URI');
				bStringIncluded = InjectDatajs.getUriFromODataSpy().search('\\$inlinecount=allpages') >= 0;
				assert.ok(bStringIncluded, '$inlinecount expected in URI');
				done();
				return null;
			}
		});
	});
	QUnit.test('Orderby: $orderby can be added to URI', function(assert) {
		var done = assert.async();
		var bStringIncluded;
		var oStep1 = this.oApi.createStep('stepTemplate2', function() {
			return null;
		});
		var oStep2 = this.oApi.createStep('stepTemplate2', function() {
			return null;
		});
		var oRepresentation1 = oStep1.getSelectedRepresentation();
		var oRepresentation2 = oStep2.getSelectedRepresentation();
		oRepresentation1.emulateSelectionStrategy('allMinus1');
		oRepresentation2.emulateRequestOptionsStrategy('orderbyPropertyTwo');
		this.oApi.updatePath(function(oStep) {
			if(oStep === oStep2){
				bStringIncluded = InjectDatajs.getUriFromODataSpy().search('\\$orderby=PropertyTwo\%20asc') >= 0;
				assert.ok(bStringIncluded, '$orderby');
				done();
				return null;
			}
		});
	});
	QUnit.module('StartFilterHandler', {
		beforeEach : function(assert) {
			var testEnv = this;
			var done = assert.async();
			var component = defineDummyComponent();
			function Probe(dependencies) {
				testEnv.startFilterHandler = dependencies.startFilterHandler;
			}

			sap.apf.testhelper.doubles.ResourcePathHandler.prototype.loadConfigFromFilePath = function() {
				this.oMessageHandler.loadConfig(this.getApfMessages(), true);
				this.oMessageHandler.loadConfig(this.getAppMessages());
				var oConfigurationTemplate = sap.apf.testhelper.config.getSampleConfiguration();
				this.oCoreApi.loadAnalyticalConfiguration(oConfigurationTemplate);
			};

			this.api = new sap.apf.Api(component, {
				probe : Probe,
				constructors : {
					ResourcePathHandler : sap.apf.testhelper.doubles.ResourcePathHandler,
					TextResourceHandler : sap.apf.testhelper.doubles.TextResourceHandler,
					NavigationHandler : sap.apf.testhelper.doubles.NavigationHandler
				},
				functions : { 
					messageCallbackForStartup : function(){}
				}
			});
			this.api.setCallbackAfterApfStartup(waitForStartup);
			this.api.loadApplicationConfig("/path/does/not/matter");
			this.api.startApf();
		
			function waitForStartup() {
				done();
			}
		},
		createFilter : function(property, value) {
			var filter = this.api.createFilter();
			filter.getTopAnd().addExpression({
				name : property,
				operator : 'EQ',
				value : value
			});
			return filter;
		},
		afterEach : function() {
			if (sap.ui.getCore().byId('stepList')){
				sap.ui.getCore().byId('stepList').destroy();
			}
		}
	});
	QUnit.test('Proper instantiation and coupling', function(assert) {
		assert.expect(2);
		var done1 = assert.async();
		var done2 = assert.async();
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.deepEqual(startFilters, [], 'Initialization works properly');
			done1();
		});
		this.startFilterHandler.setRestrictionByProperty(this.createFilter('PropertyOne', 'ValA'));
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '(PropertyOne%20eq%20%27ValA%27)', 'Method that needs coupling delivers proper result');
			done2();
		});
	});
	QUnit.test('Add and update application specific path filter', function(assert) {
		var id1 = this.api.addPathFilter(this.createFilter('PropertyOne', 'ValA'));
		assert.ok(id1 && !isNaN(id1), 'Numeric ID was returned');
		var id2 = this.api.addPathFilter(this.createFilter('PropertyTwo', 'ValB'));
		assert.notEqual(id2, id1, 'Adding new path filter fragement returns different ID');
		assert.equal(this.startFilterHandler.getRestrictionByProperty('PropertyOne').getInternalFilter().toUrlParam(), '(PropertyOne%20eq%20%27ValA%27)', 'Restriction propagted to start filter handler');
		this.api.updatePathFilter(id1, this.createFilter('PropertyOne', 'ValC'));
		assert.equal(this.startFilterHandler.getRestrictionByProperty('PropertyOne').getInternalFilter().toUrlParam(), '(PropertyOne%20eq%20%27ValC%27)', 'Restriction propagted to start filter handler');
	});
	QUnit.test('Add and get application specific path filter', function(assert) {
		var id1 = this.api.addPathFilter(this.createFilter('PropertyOne', 'ValA'));
		assert.equal(this.api.getPathFilter(id1).getInternalFilter().toUrlParam(), '(PropertyOne%20eq%20%27ValA%27)', 'Filter for internal id returned');
	});
	QUnit.test('Update and get application specific path filter', function(assert) {
		this.api.updatePathFilter('someString', this.createFilter('PropertyOne', 'ValA'));
		assert.equal(this.api.getPathFilter('someString').getInternalFilter().toUrlParam(), '(PropertyOne%20eq%20%27ValA%27)', 'Filter for internal id returned');
	});
	QUnit.module('apf.Api probe reveals internal apis', {
		beforeEach : function() {
			var that = this;
			var component = defineDummyComponent();
			function Probe(dependencies) {
				that.coreApi = dependencies.coreApi;
			}
			this.api = new sap.apf.Api(component, {
				probe : Probe
			});
		}
	});
	QUnit.test("", function(assert) {
		assert.ok(this.coreApi);
	});
	QUnit.module("API destroy", {
		beforeEach : function() {
			var that = this;
			var component = defineDummyComponent();
			function Probe(dependencies) {
				that.coreApi = dependencies.coreApi;
				that.uiApi = dependencies.uiApi;
			}
			this.api = new sap.apf.Api(component, {
				probe : Probe
			});
			this.spyCoreApiDestroy = sinon.spy(that.coreApi, "destroy");
			this.spyUiApiDestroy = sinon.spy(that.uiApi, "destroy");
		},
		afterEach : function() {
			this.spyCoreApiDestroy.restore();
			this.spyUiApiDestroy.restore();
		}
	});
	QUnit.test("WHEN API method DESTROY is called", function(assert) {
		this.api.destroy();
		assert.ok(this.spyCoreApiDestroy.calledOnce, "THEN the core api DESTROY method is called");
		assert.ok(this.spyUiApiDestroy.calledOnce, "THEN the UI api DESTROY method is called");
	});

	QUnit.module("GetPropertyValuesOfExternalContext", {
		beforeEach : function() {
			var that = this;
			var ExternalContext = function() {
				this.getCombinedContext = function() {
					var def = jQuery.Deferred();
					def.resolve(that.filterOfExternalContext);
					return def.promise();
				};
			};
			var component = defineDummyComponent();
			this.api = new sap.apf.Api(component, { constructors : { ExternalContext : ExternalContext }});
		}
	});

	QUnit.test("WHEN getPropertyValuesOfExternalContext is called", function(assert){
		var done = assert.async();
		prepareFilterOfExternalContext(this);
		this.api.getPropertyValuesOfExternalContext("SAPClient").then(function(propertyValues){
			assert.equal(propertyValues[0].Low, "777", "THEN value for SAPClient is returned");
			done();
		});

		function prepareFilterOfExternalContext(context) {
			var messageHandler = new sap.apf.core.MessageHandler();
			context.filterOfExternalContext = new sap.apf.core.utils.Filter(messageHandler, "SAPClient", "EQ", "777");
			context.filterOfExternalContext.addAnd(new sap.apf.core.utils.Filter(messageHandler, "Prop1", "EQ", "999"));
		}
		
	});
	QUnit.test("WHEN getPropertyValuesOfExternalContext with more complex Filter is called", function(assert){
		var done = assert.async();
		
		prepareFilterOfExternalContext(this);
		this.api.getPropertyValuesOfExternalContext("Prop1").then(function(propertyValues){
			assert.equal(propertyValues[0].Low, "999", "THEN value for Prop1 is returned");
			assert.equal(propertyValues[0].Option, "EQ", "THEN Option for Prop1 is returned");
			assert.equal(propertyValues[1].Low, "888", "THEN value for Prop2 is returned");
			assert.equal(propertyValues[1].Option, "LE", "THEN Option for Prop1 is returned");
			done();
		});
		function prepareFilterOfExternalContext(context) {
			var messageHandler = new sap.apf.core.MessageHandler();
			context.filterOfExternalContext = new sap.apf.core.utils.Filter(messageHandler, "SAPClient", "EQ", "777");
			var filterProp1 = new sap.apf.core.utils.Filter(messageHandler, "Prop1", "EQ", "999");
			filterProp1.addOr(new sap.apf.core.utils.Filter(messageHandler, "Prop1", "LE", "888"));
			context.filterOfExternalContext.addAnd(filterProp1);
		}
	});
	QUnit.module('Testing the instantiation and startup of the API');
	QUnit.test("WHEN api is created", function(assert){

		assert.expect(12);
		var done = assert.async();
		var component = defineDummyComponent();
		var fnUi = function() {
			this.createApplicationLayout = function(app) {
				assert.ok(app, "application layout creation is started");
				return Promise.resolve();
			};
			this.handleStartup = function(deferredMode) {
				var promiseStartup = jQuery.Deferred();
				deferredMode.done(function() {
						promiseStartup.resolve();
				});
				return promiseStartup.promise();
			};
		};
		var fnMessageHandlerSpy = function(){
			var currentPhase = 0;
			this.setLifeTimePhaseStartup = function() {
				if (currentPhase === 0) {
					currentPhase = 1;
					assert.ok(true,"correct phase change");
				} else {
					assert.ok(false, "not foreseen setting of the phase");
				}
			};
			this.setLifeTimePhaseRunning = function() {
				if (currentPhase === 1) {
					assert.ok( true, "THEN correct phase is set");
					done();
				} else {
					assert.ok(false, "not foreseen setting of the phase");
				}
			};
			this.setMessageCallback = function(callback) {
				assert.ok(callback instanceof Function, "THEN message callback is set" );
			};
			this.check = function(booleExpr, sMessage) {
				if (!booleExpr) {
					throw new Error(sMessage);
				}
			};
			this.activateOnErrorHandling = function(flag) {
				assert.equal(flag, true, "THEN error handling has been called");
			};
			this.setTextResourceHandler = function(trh) {
				assert.ok(trh, "THEN text ressource handler has been set");
			};
			this.loadConfig = function(messages, reset) {
				assert.ok(messages.length > 0, "Messages have been loaded");
				assert.ok(reset, "Reset of message definition has triggered");
			};
		};
		sap.apf.testhelper.doubles.ResourcePathHandler.prototype.loadConfigFromFilePath = function() {
			this.oMessageHandler.loadConfig(this.getApfMessages(), true);
			var oConfigurationTemplate = sap.apf.testhelper.config.getSampleConfiguration();
			this.oCoreApi.loadAnalyticalConfiguration(oConfigurationTemplate);
		};
		var api = new sap.apf.Api(component, {
			constructors : {
				MessageHandler : fnMessageHandlerSpy,
				UiInstance : fnUi,
				ResourcePathHandler : sap.apf.testhelper.doubles.ResourcePathHandler
			}
		});
		
		function waitForStartup() {
			assert.ok(true, "THEN after startup callback was called");
		}
		api.setCallbackAfterApfStartup(waitForStartup);
	
		api.loadApplicationConfig("/path/does/not/matter");
		api.startApf();
		assert.ok(api.startupSucceeded(), "Indication of successfull startup");
	});

	QUnit.test("WHEN api is created AND fatal error occurs during instantiation", function(assert){

		assert.expect(4);
		var that = this;
		var component = defineDummyComponent();
		var fnResourcePathHandlerThatPutsFatal = function(inject) {
			var messageObject = inject.instances.messageHandler.createMessageObject({
					code : "5068"
			});
			inject.instances.messageHandler.putMessage(messageObject);
		};
		var fnUi = function() {
			this.createApplicationLayout = function() {
				assert.ok(false, "application layout creation is started");
			};
			this.handleStartup = function(deferredMode) {
				var promiseStartup = jQuery.Deferred();
				deferredMode.done(function() {
						promiseStartup.resolve();
				});
				return promiseStartup.promise();
			};
		};
		var fnMessageCallback = function(messageObject) {
			that.messageCallbackWasCalled = true;
			assert.equal(messageObject.getPrevious().getCode(), "5068", "THEN fatal message is transferred to callback");
		};
		var api = new sap.apf.Api(component, {
			functions : {
				messageCallbackForStartup : fnMessageCallback
			},
			constructors : {
				ResourcePathHandler : fnResourcePathHandlerThatPutsFatal,
				UiInstance : fnUi
			}
		});
		var result = api.startApf();
		assert.ok(that.messageCallbackWasCalled, "THEN message callback was called");
		assert.notOk(api.startupSucceeded(), "Indication of not successfull startup");
		assert.ok( result instanceof sap.m.Text, "THEN text object as supplement for APF LAYOUT is returned in startup");
	});
	QUnit.test("WHEN api is created AND fatal error occurs during startApf", function(assert){

		assert.expect(3);
		var that = this;
		var component = defineDummyComponent();
		var fnResourcePathHandler = function(inject) {
			inject.instances.coreApi.loadMessageConfiguration(sap.apf.core.messageDefinition, true);
			inject.corePromise.resolve();
		};
		var fnUiThatPutsFatal = function(inject) {
			this.createApplicationLayout = function() {
				var messageObject = inject.oCoreApi.createMessageObject({
					code : "5100"
				});
				inject.oCoreApi.putMessage(messageObject);
			};
			this.handleStartup = function(deferredMode) {
				var promiseStartup = jQuery.Deferred();
				deferredMode.done(function() {
						promiseStartup.resolve();
				});
				return promiseStartup.promise();
			};
		};
		var fnMessageCallback = function(messageObject) {
			that.messageCallbackWasCalled = true;
			assert.equal(messageObject.getPrevious().getCode(), "5100", "THEN fatal message is transferred to callback");
		};
		var api = new sap.apf.Api(component, {
			constructors : {
				ResourcePathHandler : fnResourcePathHandler,
				UiInstance : fnUiThatPutsFatal
			},
			functions : {
				messageCallbackForStartup : fnMessageCallback
			}
		});
		api.startApf();
		assert.ok(that.messageCallbackWasCalled, "THEN message callback was called");
		assert.notOk(api.startupSucceeded(), "Indication of not successfull startup");
	
	});

	QUnit.test("WHEN constructor for external Context is injected", function(assert){
		assert.expect(2);
		var that = this;
		var component = defineDummyComponent();
		var probe = function(dependencies) {
			assert.equal(that.ajaxForExternalContext, dependencies.coreApi.ajax, "THEN core ajax is injected into external context");
		};
		var ResourcePathHandler = function(inject) {
			inject.instances.coreApi.loadMessageConfiguration(sap.apf.core.messageDefinition, true);
		};
		var ajax = function() {
			this.ajax.type = "injectedAjax";
		};
		var ExternalContext = function(inject) {
			this.getCombinedContext = function() {};
			assert.ok(inject.functions.ajax, "THEN injected external context is used AND ajax is injected");
			that.ajaxForExternalContext = inject.functions.ajax;
		};
		new sap.apf.Api(component, {
			constructors : {
				ResourcePathHandler : ResourcePathHandler,
				ExternalContext : ExternalContext
			},
			functions : {
				ajax : ajax
			},
			probe : probe
		});
	});
	QUnit.test("WHEN api is created and constructors are injected", function(assert){
		assert.expect(37);
		var fnStartParameter = function() {
			this.type = "stubbStartParameter";
			assert.ok(true, "THEN injected start parameter is used");
			this.getXappStateId = function() {};
			this.isFilterReductionActive = function() {};
			this.getSapSystem = function() {};
		};

		var fnRequest = function() {
			this.type = "stubb";
		};
		var fnMetadata = function() {
			this.type = "stub";
		};
		var fnExternalContext = function(inject) {
			this.type = "stubbExternalContext";

			assert.ok(inject.instances.startParameter && inject.instances.startParameter.type === "stubbStartParameter", "THEN startparameter is injected into external context");
			assert.ok(inject.instances.component, "THEN component is injected into external context");
			assert.ok(inject.instances.messageHandler, "THEN messagehandler is injected into external context"); 
			assert.ok(inject.functions.getConfigurationProperties, "THEN function getConfigurationProperties is injected into external context");
			assert.ok(inject.functions.ajax, "THEN function ajax is injected into external context");
		};
		var fnResourcePathHandler = function() {
			assert.ok(true, "THEN injected ressource path handler is used");
		};
		var fnSessionHandler = function() {
			this.type = "stubbSessionHandler";
			assert.ok(true, "THEN injected session handler is used");
		};
		var fnStartFilterHandler = function(inject) {
			this.type = "stubbStartFilterHandler";

			this.setRestrictionByProperty = function() {};
			this.getRestrictionByProperty = function() {};
			assert.ok(inject.functions.getFacetFilterConfigurations, "THEN function getFacetFilterConfigurations is injected into start filter handler");
			assert.ok(inject.functions.getReducedCombinedContext, "THEN function getReducedCombinedContext is injected into start filter handler");
			assert.ok(inject.functions.createRequest, "THEN function createRequest is injected into start filter handler");
			assert.ok(inject.instances.messageHandler, "THEN messagehandler is injected into start filter handler"); 
			assert.ok(inject.constructors.StartFilter, "THEN start filter constructor is injected into start filter handler");
		};
		var fnFilterIdHandler = function(inject) {
			this.type = "stubbFilterIdHandler";
			this.serialize = function() {};
			this.deserialize = function() {};
			assert.ok(inject.functions.setRestrictionByProperty, "THEN function setRestrictionByProperty is injected into filter id handler");
			assert.ok(inject.functions.getRestrictionByProperty, "THEN function getRestrictionByProperty is injected into filter id handler");
			assert.ok(inject.instances.messageHandler, "THEN messagehandler is injected into filter id handler");
		};
		var fnNavigationHandler = function(inject) {
			this.type = "stubbNavigationHandler";
			assert.ok(inject.constructors.FilterReduction, "THEN filterreduction has been injected");
			assert.ok(inject.functions.getCumulativeFilterUpToActiveStep, "THEN function getCumulativeFilterUpToActiveStep is injected into navigation handler");
			assert.ok(inject.functions.getNavigationTargets, "THEN function getNavigationTargets is injected into navigation handler");
			assert.ok(inject.functions.getActiveStep, "THEN function getActiveStep is injected into navigation handler");
			assert.ok(inject.functions.createRequest, "THEN function createRequest is injected into navigation handler");
			assert.ok(inject.functions.getXappStateId, "THEN function getXappStateId is injected into navigation handler");
			assert.ok(inject.functions.isFilterReductionActive, "THEN function isFilterReductionActive is injected into navigation handler");
			assert.ok(inject.functions.getAllParameterEntitySetKeyProperties, "THEN function getAllParameterEntitySetKeyProperties is injected into navigation handler");

			assert.ok(inject.instances.messageHandler, "THEN messagehandler is injected into navigation handler");
			assert.ok(inject.instances.component && inject.instances.component.type === "dummyComponent", "THEN component is injected into navigation handler");
			assert.ok(inject.instances.serializationMediator && inject.instances.serializationMediator.type === "stubbSerializationMediator", "THEN start serialization mediator is injected into navigation handler");

		};
		var fnSerializationMediator = function(inject) {
			this.type = "stubbSerializationMediator";
			assert.ok(inject.instances.coreApi, "THEN core api is injected into serialization mediator");
			assert.ok(inject.instances.filterIdHandler, "THEN filter id handler is injected into serialization mediator");
			assert.ok(inject.instances.startFilterHandler, "THEN start filter handler is injected into serialization mediator");
		};
		var fnUiInstance = function(inject) {
			assert.ok(inject.oCoreApi, "THEN core api is injected into ui instance");
			assert.ok(inject.oFilterIdHandler && inject.oFilterIdHandler.type === "stubbFilterIdHandler", "THEN filter id handler is injected into ui instance");
			assert.ok(inject.oSerializationMediator  && inject.oSerializationMediator.type === "stubbSerializationMediator", "THEN serialization mediator is injected into ui instance");
			assert.ok(inject.oNavigationHandler  && inject.oNavigationHandler.type === "stubbNavigationHandler", "THEN navigation handler is injected into ui instance");
			assert.ok(inject.oComponent && inject.oComponent.type === "dummyComponent", "THEN component is injected into ui instance");
			assert.ok(inject.oStartParameter && inject.oStartParameter.type === "stubbStartParameter", "THEN start parameter is injected into ui instance");
			assert.ok(inject.oStartFilterHandler && inject.oStartFilterHandler.type === "stubbStartFilterHandler", "THEN start filter handler is injected into ui instance");
		};
		var component = defineDummyComponent();
		component.type = "dummyComponent";

		new sap.apf.Api(component, {
			constructors : {
				StartParameter : fnStartParameter,
				Request : fnRequest,
				Metadata : fnMetadata,
				ExternalContext : fnExternalContext,
				ResourcePathHandler : fnResourcePathHandler,
				SessionHandler : fnSessionHandler,
				StartFilterHandler : fnStartFilterHandler,
				FilterIdHandler : fnFilterIdHandler,
				NavigationHandler : fnNavigationHandler,
				SerializationMediator : fnSerializationMediator,
				UiInstance : fnUiInstance
			}});
	});
	QUnit.test("WHEN api is created and core api constructor is injected", function(assert) {
		assert.expect(14);
		var component = defineDummyComponent();
		var manifests = { dummy : "valueOfNoInterest" };
		component.type = "dummyComponent";
		var fnResourcePathHandler = function() {
			this.type = "stubbResourcePathHandler";
		};
		var fnTextResourceHandler = function() {
			this.type = "stubbTextResourceHandler";
		};
		var fnSessionHandler = function() {
			this.type = "stubbSessionHandler";
		};
		var fnMetadataFactory = function() {
			this.type = "stubbMetadataFactory";
		};
		var fnRequest = function() {
			this.type = "stubbRequest";
		};
		var fnAjax = function() {
			return "stubbedAjaxReturn";
		};
		var fnMetadata = function() {
			this.type = "stubbMetadata";
		};
		var odataRequest = function() {
			return "stubbedOdataRequestReturn";
		};
		var fnCoreInstance = function(inject) {

			assert.ok(typeof inject.functions.getCumulativeFilter === "function", "THEN function getCumulativeFilter is injected");
			assert.ok(typeof inject.functions.getCombinedContext === "function", "THEN function getCombinedContext is injected");
			assert.ok(typeof inject.functions.ajax  === "function" && inject.functions.ajax() === "stubbedAjaxReturn", "THEN function ajax is injected");
			assert.ok(typeof inject.functions.odataRequest  === "function" && inject.functions.odataRequest() === "stubbedOdataRequestReturn", "THEN function odataRequest is injected");
			assert.ok(typeof inject.functions.getComponentName  === "function", "THEN function getComponentName is injected");
			assert.ok(inject.instances.messageHandler, "THEN messagehandler is injected");
			assert.ok(inject.instances.startParameter, "THEN start parameter is injected");
			assert.ok(inject.constructors.Request && new inject.constructors.Request().type === "stubbRequest", "THEN request constructor is injected");
			assert.ok(inject.constructors.Metadata && new inject.constructors.Metadata().type === "stubbMetadata", "THEN metadatata constructor is injected");
			assert.ok(inject.constructors.MetadataFactory && new inject.constructors.MetadataFactory().type === "stubbMetadataFactory", "THEN metadata factory constructor is injected");
			assert.ok(inject.constructors.ResourcePathHandler && new inject.constructors.ResourcePathHandler().type === "stubbResourcePathHandler", "THEN ressource path handler constructor is injected");
			assert.ok(inject.constructors.SessionHandler && new inject.constructors.SessionHandler().type === "stubbSessionHandler", "THEN session handler constructor is injected");
			assert.ok(inject.constructors.TextResourceHandler && new inject.constructors.TextResourceHandler().type === "stubbTextResourceHandler", "THEN text ressource handler constructor is injected");
			assert.deepEqual(inject.manifests, manifests, "THEN manifests are injected");
		};
		new sap.apf.Api(component, {
			constructors : {
				CoreInstance : fnCoreInstance,
				Request : fnRequest,
				Metadata : fnMetadata,
				MetadataFactory : fnMetadataFactory,
				ResourcePathHandler : fnResourcePathHandler,
				TextResourceHandler : fnTextResourceHandler,
				SessionHandler : fnSessionHandler
			},
			functions : {
				ajax : fnAjax,
				odataRequest : odataRequest
			}
		}, manifests);
	});

	QUnit.module("Inject provided", {
		beforeEach : function() {
			this.externalContextSpy = sinon.spy(sap.apf.utils.StartParameter);

			var that = this;
			var injectFunction = function () {
				return {
					constructors: {
						StartParameter: that.externalContextSpy
					},
					functions : {
						messageCallbackForStartup : function() {
						}
					}
				};
			};
			this.spyInject = sinon.spy(injectFunction);
			sap.apf.base.Component.extend("sap.apf.test.tApfComponent", {
				getInjections : that.spyInject
			});
			this.oCompContainer = new sap.apf.test.tApfComponent();
		},
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test("and getInjections set THEN injected constructor should be called", function (assert) {
		assert.ok(this.externalContextSpy.calledOnce);
		assert.ok(this.spyInject.calledOnce);
	});
	QUnit.module("injected function isUsingCloudFoundryProxy is handed / ProxyForAnalyticalConfiguration is handed over to core api", {
		afterEach : function() {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test("WHEN function isUsingCloudFoundryProxy is injected in component", function(assert) {
		var CoreInstanceSpy = function(inject) {
			assert.equal(inject.functions.isUsingCloudFoundryProxy(), "incredibleValue", "THEN the injected function is used");
			this.destroy = function() {
				assert.ok(true, "THEN finally destroy was called");
			};
		};
		var injectFunction = function () {
				return {
					constructors: {
						CoreInstance: CoreInstanceSpy
					},
					functions : {
						isUsingCloudFoundryProxy : function() {
							assert.ok(true, "THEN this function is used");
							return "incredibleValue";
						}
					}
				};
			};
			sap.apf.base.Component.extend("sap.apf.test.tApfComponent", {
				getInjections : injectFunction
			});
			this.oCompContainer = new sap.apf.test.tApfComponent();
	});
	QUnit.test("WHEN ProxyForAnalyticalConfiguration is injected in component", function(assert) {
		var CoreInstanceSpy = function(inject) {
			assert.equal(inject.functions.isUsingCloudFoundryProxy(), "incredibleValue", "THEN the injected function is used");
			assert.equal(new inject.constructors.ProxyForAnalyticalConfiguration().type, "ProxySpy", "THEN injected proxy has been handed over");
			this.destroy = function() {
				assert.ok(true, "THEN finally destroy was called");
			};
		};
		var ProxySpy = function() {
			this.type = "ProxySpy";
		};
		var injectFunction = function () {
				return {
					constructors: {
						CoreInstance: CoreInstanceSpy,
						ProxyForAnalyticalConfiguration : ProxySpy
					},
					functions : {
						isUsingCloudFoundryProxy : function() {
							assert.ok(true, "THEN this function is used");
							return "incredibleValue";
						}
					}
				};
			};
			sap.apf.base.Component.extend("sap.apf.test.tApfComponent", {
				getInjections : injectFunction
			});
			this.oCompContainer = new sap.apf.test.tApfComponent();
	});
	QUnit.module("Function getComponentName");
	QUnit.test("WHEN component has a manifest", function(assert){
		var component = defineDummyComponent();
		var manifests = {
				manifest : { 
					"sap.app": {
						"id": "sap.apf.testhelper.comp"
					}
				},
				baseManifest : { "sap.app": {
						"id": "sap.apf.base"
					} 
				}
		};
		var PersistenceSpy = function(inject) {
			assert.equal(inject.functions.getComponentName(), "sap.apf.testhelper.comp", "THEN component name from manifest is returned");
		};
		var ResourcePathHandlerStub = function(inject) {};
		new sap.apf.Api(component, {
			constructors : {
				Persistence : PersistenceSpy,
				ResourcePathHandler : ResourcePathHandlerStub
			}
		}, manifests);
	});
	QUnit.test("WHEN component has no manifest", function(assert){
		var component = {
				getMetadata : function() {
					return { getComponentName : function() { return "compid"; }
					};
				}
		};
		var PersistenceSpy = function(inject) {
			assert.equal(inject.functions.getComponentName(), "compid", "THEN component name from metadat is returned");
		};
		var ResourcePathHandlerStub = function(inject) {};
		new sap.apf.Api(component, {
			constructors : {
				Persistence : PersistenceSpy,
				ResourcePathHandler : ResourcePathHandlerStub
			}
		});
	});
	QUnit.module('Get core instance as promise', {
	});
	QUnit.test("WHEN core promise is resolved", function(assert){
		assert.expect(5);
		var that = this;
		var component = {
				getMetadata : function() {
					return { getComponentName : function() { return "compid"; }
					};
				}
		};
	
		var UiInstanceSpy = function(inject){
			this.createApplicationLayout = function(app){
				assert.ok(app, "THEN application was handed over");
				that.handedOverApp = app;
			};
		};
	
		var coreProbe = function(inject){
			assert.ok(inject.corePromise, "THEN core promise is injected");
		};
		var ResourcePathHandlerStub = function(inject){
			assert.ok(inject.corePromise, "THEN core promise is injected");
			inject.corePromise.resolve();
		};
		var api = new sap.apf.Api(component, {
			constructors : {
				UiInstance : UiInstanceSpy,
				ResourcePathHandler : ResourcePathHandlerStub
			},
			coreProbe : coreProbe
		});
		var app = api.startApf();
		assert.ok(app, "THEN app is returned");
		assert.equal(app, that.handedOverApp, "THEN correct app is handed to ui instance");
		
	});
	QUnit.module("API");
	QUnit.test("Create API without inject", function(assert){
		//This is done in our SoH generic runtime
		var component = {
				getMetadata : function() {
					return { getComponentName : function() { return "compid"; }
					};
				}
		};
		var api = new sap.apf.Api(component);
		assert.ok(api.startupSucceeded());
	});
	QUnit.module("BeforeStartupApfCallback");
	QUnit.test("WHEN callback onBeforeStartApfCallback is active", function(assert){
		assert.expect(3);
		var context = {};
		var done = assert.async();
		function beforeStartApfCallback() {
			var corePromise = context.oComponent.getProbe().corePromise;
			assert.equal(corePromise.state(), "resolved", "THEN core promise is resolved before calling beforeStartupApf");
			assert.ok(true, "THEN before start apf callback has been called");
		}
		var config = {
				onBeforeStartApfCallback : beforeStartApfCallback,
				stubAjaxForResourcePaths : true,
				doubleUiInstance : true
		};

		sap.apf.testhelper.createComponentAsPromise(context, config).done(function() {	
			done();
		});
		var corePromise = context.oComponent.getProbe().corePromise;
		assert.equal(corePromise.state(), "pending", "THEN core promise is not yet resolved");
	});
	QUnit.test("WHEN callback onBeforeStartApfCallback is active AND core promise is rejected", function(assert){
		assert.expect(1);
		var context = {};

		function beforeStartApfCallback() {
			assert.ok(false, "THEN before start apf callback should not have been been called");
		}
		var config = {
				onBeforeStartApfCallback : beforeStartApfCallback,
				stubAjaxForResourcePaths : true,
				doubleUiInstance : true
		};

		sap.apf.testhelper.createComponentAsPromise(context, config).done(function() {});
		var corePromise = context.oComponent.getProbe().corePromise;
		assert.equal(corePromise.state(), "pending", "THEN core promise is not yet resolved");
		corePromise.reject();
	});

});
