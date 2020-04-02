jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.testhelper.doubles.request');
jQuery.sap.require('sap.apf.testhelper.doubles.step');
jQuery.sap.require('sap.apf.testhelper.doubles.binding');
jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.apf.utils.utils');
jQuery.sap.require('sap.apf.core.resourcePathHandler');
jQuery.sap.require('sap.apf.core.configurationFactory');
jQuery.sap.require('sap.apf.core.representationTypes');
jQuery.sap.require('sap.apf.ui.representations.RepresentationInterfaceProxy');
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

	function createPromiseWithTimeOut(result) {
		var deferred = jQuery.Deferred();
		setTimeout(function() {
			deferred.resolve(result);
		}, 1);
		return deferred.promise();
	}

	var metadataFacadeStub =  {
			getAllProperties : function(callback) {
				callback([]);
			},
			getProperty : function(propertyName) {
				var property = {
						getAttribute: function() {
							return "Edm.String";
						}
				};
				return createPromiseWithTimeOut(property);
			}
	};
	QUnit.module('Configuration Factory', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleMessaging();
			this.oCoreApi.getAnnotationsForService = function(service){
				return ["annotation1", "annotation2"];
			};
			this.oCoreApi.getMetadata = function(service) {
				return jQuery.Deferred().resolve({
					getHierarchyAnnotationsForProperty : function(entitySet, property){
						return {};
					},
					getPropertyMetadata: function () {
						return {};
					}
				});
			};
			this.oCoreApi.getEntityTypeMetadata = function(service, entitySet){
				return [];
			};
			this.oCoreApi.getStartParameterFacade = function() {
				return {
					getSapSystem : function() {
						return undefined;
					}
				};
			};

			this.oConfigurationTemplate = sap.apf.testhelper.config.getSampleConfiguration();
			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				}
			});
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.fnStep = sap.apf.core.Step;
			sap.apf.core.Step = sap.apf.testhelper.doubles.Step;
			this.fnBinding = sap.apf.core.Binding;
			sap.apf.core.Binding = sap.apf.testhelper.doubles.Binding;
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
			sap.apf.core.Step = this.fnStep;
			sap.apf.core.Binding = this.fnBinding;
		}
	});
	QUnit.test('Initialization', function(assert) {
		assert.ok(this.oConfigurationFactory, "Factory initialized");
	});
	QUnit.test('Get navigation targets', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var navigationTargets = this.oConfigurationFactory.getNavigationTargets();
		var expectedTargets = [ {
			"action" : "analyzeDSO",
			"id" : "nav-SD",
			"semanticObject" : "DaysSalesOutstanding",
			"type" : "navigationTarget",
			"parameters" : [{
				"key" : "key",
				"value" : "value"
			}]
		}, {
			"action" : "analyzeDPO",
			"id" : "nav-MM",
			"isStepSpecific" : true,
			"semanticObject" : "DaysPayablesOutstanding",
			"type" : "navigationTarget"
		} ];
		assert.deepEqual(navigationTargets, expectedTargets, "THEN equals expected navigation targets");
	});
	QUnit.test('Blind load and default representation types available', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oRepresentationType = this.oConfigurationFactory.getConfigurationById("ColumnChartClustered");
		assert.equal(oRepresentationType.type, "representationType", "Default Representation Type available");
	});
	QUnit.test("Analytical configuration, that contains no representation types", function(assert) {
		var oConfigWithoutRepresenationType = {
			steps : [ {
				type : "step", // optional
				id : "stepTemplate1",
				request : "requestTemplate1",
				binding : "bindingTemplate1",
				categories : [ {
					type : "category", // optional
					id : "initial"
				} ]
			} ],
			requests : [ {
				type : "request",
				id : "requestTemplate1",
				service : "dummy.xsodata",
				entityType : "EntityType1",
				selectProperties : [ "PropertyOne", "PropertyTwo" ]
			} ],
			bindings : [ {
				type : "binding",
				id : "bindingTemplate1",
				requiredFilters : [ "Customer" ], // set of filters required to uniquely identify rows selection
				representations : [ {
					type : "representation",
					id : "representationId1"
				} ]
			} ],
			categories : []
		};
		this.oConfigurationFactory.loadConfig(oConfigWithoutRepresenationType);
		var oStep = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
		assert.ok(oStep, "Object properly hashed");
	});
	QUnit.test("Analytical configuration, that contains a configHeader", function(assert) {
		this.oConfigurationTemplate.configHeader = { // should be ignored by loadConfiguration.
			severalAttributes1 : "a",
			severalAttributes2 : "b",
			severalAttributes3 : "c"
		};
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oStep = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
		assert.ok(oStep, "Object properly hashed");
	});
	QUnit.test('Load and get step', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oStep = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
		assert.ok(oStep, "Object properly hashed");
		assert.equal(oStep.type, "step", "Object has type step");
	});
	QUnit.test('Load and get request', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oRequest = this.oConfigurationFactory.getConfigurationById("requestTemplate1");
		assert.ok(oRequest, "Object properly hashed");
		assert.equal(oRequest.type, "request", "Object has type step");
	});
	QUnit.test('Load and get binding', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oBinding = this.oConfigurationFactory.getConfigurationById("bindingTemplate1");
		assert.ok(oBinding, "Object properly hashed");
		assert.equal(oBinding.type, "binding", "Object has type step");
	});
	QUnit.test('Load binding fails if a representation has no id', function(assert) {
		assert.throws(function() {
			this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("representationWithoutId"));
		}, "Error successfully thrown due to missing representation id");
	});
	QUnit.test('Load binding fails if representations have duplicated ids', function(assert) { 
		this.oMessageHandler.spyPutMessage();
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("representationsWithDuplicatedtIds"));
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, "5029", "Error successfully thrown due to duplicated representation ids");
	});
	QUnit.test('Load and get category', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oCategory = this.oConfigurationFactory.getConfigurationById("categoryTemplate1");
		assert.ok(oCategory, "Object properly hashed");
		assert.equal(oCategory.type, "category", "Object has type step");
		assert.equal(oCategory.id, "categoryTemplate1", "Object has correct id");
	});
	QUnit.test('Load and get configuration header', function (assert) {
		var oExpectedConfigHeader = {
				"Application": "12345",
				"ApplicationName": "APF Application",
				"SemanticObject": "SemObj",
				"AnalyticalConfiguration": "67890",
				"AnalyticalConfigurationName": "APF Configuration",
				"UI5Version": "1.XX.XX",
				"CreationUTCDateTime": "/Date(1423809274738)/",
				"LastChangeUTCDateTime": "/Date(1423809274738)/"
		};
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oConfigHeader = this.oConfigurationFactory.getConfigHeader();
		assert.deepEqual(oConfigHeader, oExpectedConfigHeader, "ConfigHeader returned");
	});
	QUnit.test('Set item', function(assert) {
		var oFactory = new sap.apf.core.ConfigurationFactory({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			}
		});
		var oConfigurationWithDuplicatedIds = {
			steps : [ {
				type : "step", // optional
				id : "stepTemplate1"
			}, {
				id : "stepTemplate1"
			} ]
		};
		assert.throws(function() {
			oFactory.loadConfig(oConfigurationWithDuplicatedIds);
		}, "Error successfully thrown due to duplicated id's in configuration file");
	});
	QUnit.test('Create binding', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oBindingTemplate1 = this.oConfigurationFactory.createBinding("bindingTemplate1", {}, {});
		assert.ok(oBindingTemplate1.type === "binding", "Binding has correct type'");
		assert.ok(!oBindingTemplate1.hasOwnProperty("filters"), "Filters has been deleted");
		assert.ok(!oBindingTemplate1.hasOwnProperty("model"), "Model has been deleted");
		assert.ok(!oBindingTemplate1.hasOwnProperty("exit"), "Exit has been deleted");
		assert.throws(function() {
			this.oConfigurationFactory.createBinding("stepTemplate1");
		}, "Error successfully thrown, because handed over id does not belong to type binding");
	});
	QUnit.test('Create request', function(assert) {
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("filterMapping"));
		var oRequest = this.oConfigurationFactory.createRequest("requestTemplate1");
		assert.ok(oRequest.type === "request", "Request is of type 'request'");
		assert.throws(function() {
			this.oConfigurationFactory.createRequest("requestTemplateX");
		}, "Error successfully thrown, because id doesn't exist");
		assert.throws(function() {
			this.oConfigurationFactory.createRequest("stepTemplate1");
		}, "Error successfully thrown, because handed over id does not belong to type request");
		var oRequestConfig = this.oConfigurationFactory.getConfigurationById("requestFilterMapping");
		var oRequestFilterMapping = this.oConfigurationFactory.createRequest(oRequestConfig);
		assert.ok(oRequestFilterMapping.type === "request", "Filter mapping request is of type 'request'");
	});
	QUnit.test('Create step with thumbnails', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oStep = this.oConfigurationFactory.createStep("stepTemplate1");
		assert.equal(oStep.thumbnail.type, "thumbnail", "Object step has thumbnail of type thumbnail");
		assert.ok(oStep.thumbnail.leftUpper !== undefined, "leftUpper is defined ");
		assert.equal(oStep.thumbnail.leftUpper.key, "localTextReferenceStepTemplate1LeftUpper", "Step has leftUpper with correct key");
		assert.equal(oStep.thumbnail.rightUpper.key, "localTextReferenceStepTemplate1RightUpper", "Step has rightUpper with correct key");
		assert.equal(oStep.thumbnail.rightLower.key, "localTextReferenceStepTemplate1RightLower", "Step has rightLower with correct key");
		assert.equal(oStep.thumbnail.leftLower.key, "localTextReferenceStepTemplate1LeftLower", "Step has leftLower with correct key");
	});
	QUnit.test('Create step', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oStep = this.oConfigurationFactory.createStep("stepTemplate1");
		assert.ok(oStep.type === "step", "Step has type 'step'");
		assert.equal(oStep.title.key, "localTextReference2", "Step has correct title");
		assert.equal(oStep.categories[0].type, "category", "Object step has category of type category");
		assert.equal(oStep.categories[0].id, "categoryTemplate1", "Object step has category with correct id");
		var oStep2 = this.oConfigurationFactory.getConfigurationById("stepTemplate2");
		assert.equal(oStep2.thumbnail.type, "thumbnail", "Object step has thumbnail of type picture");
		assert.ok(!oStep.hasOwnProperty("bindingRef"), "Step has no public property BindingRef");
		assert.ok(!oStep.hasOwnProperty("requestRef"), "Step has no public property RequestRef");
	});
	QUnit.test('Create hierarchical step', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oStep = this.oConfigurationFactory.createStep("hierarchicalStepId");
		assert.strictEqual(oStep.type, "hierarchicalStep", "Step has type 'hierarchicalStep'");
	});
	QUnit.test('Load config again in order to replace the first config', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var secondConfig = sap.apf.testhelper.config.getSampleConfiguration();
		secondConfig.steps[0].id = secondConfig.categories[0].steps[0].id = "stepTemplateNew";
		this.oConfigurationFactory.loadConfig(secondConfig);
		assert.throws(function() {
			this.oConfigurationFactory.createStep("stepTemplate1");
		}, "Creation of original step should fail (modified config).");
		assert.ok(this.oConfigurationFactory.createStep("stepTemplateNew"), "Creation of modified step succeeds.");
	});
	QUnit.test('Injects of Step constructor', function(assert) {
		var that = this;
		var fnStepConstructor = function(oMessageHandler, oStepConfig, oFactory, sRepresentationId, oCoreApi) {
			assert.equal(oMessageHandler, that.oMessageHandler, "MessageHandler handed over to Step");
			assert.deepEqual(oStepConfig, that.oConfigurationTemplate.steps[0], "oStepConfig handed over to Step");
			assert.equal(oFactory, that.oConfigurationFactory, "configurationFactory handed over to Step");
			assert.equal(sRepresentationId, "representationId", "RepresentationId handed over to Step");
			assert.equal(oCoreApi, that.oCoreApi, "oCoreApi handed over to Step");
			this.id = 'Created by constructor set from outside ' + oStepConfig.id;
		};
		var oStep;
		var fnStep = sap.apf.core.Step;
		sap.apf.core.Step = fnStepConstructor;
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		oStep = this.oConfigurationFactory.createStep("stepTemplate1", "representationId");
		var bResult = oStep.id === 'Created by constructor set from outside stepTemplate1';
		assert.ok(bResult, 'Same IDs expected');
		sap.apf.core.Step = fnStep;
	});
	QUnit.test('Get service documents', function(assert) {
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("secondServiceDocument"));
		var aServiceDocuments = this.oConfigurationFactory.getServiceDocuments();
		assert.deepEqual(aServiceDocuments, [ "dummy.xsodata", "test/hierarchy.xsodata", "secondServiceDocument.xsodata" ], "Correct name of requested service documents");
	});
	QUnit.test('Get service documents before configuration is loaded', function(assert) {
		this.oMessageHandler.spyPutMessage();
		this.oConfigurationFactory.getServiceDocuments();
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, "5020", "THEN error message as expected");
	});
	QUnit.module('Configuration factory reactions on wrong configuration', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleMessaging();
			this.oCoreApi.getMetadataFacade = function() {
				return metadataFacadeStub;
			};
			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}				
			});
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.fnStep = sap.apf.core.Step;
			sap.apf.core.Step = sap.apf.testhelper.doubles.Step;
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
			sap.apf.core.Step = this.fnStep;
		}
	});
	QUnit.test('Representation constructor module path does not contain a function', function(assert) {
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("wrongRepresentationConstructor"));
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, "5030", "Error Code 5030 expected");
	});
	QUnit.module('Configuration factory reactions on wrong configuration', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleMessaging();
			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.fnStep = sap.apf.core.Step;
			sap.apf.core.Step = sap.apf.testhelper.doubles.Step;
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
			sap.apf.core.Step = this.fnStep;
		}
	});
	QUnit.test('Mal formed step assignment throws technical error', function(assert) {
		assert.expect(1);
		try {
			this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("malformedStepAssignmentForCategory"));
		} catch (err) {
			assert.ok(err.message.indexOf("step with wrong format") > -1, "the right exception was raised");
		}
	});
	QUnit.test('category assignment for not existing step throws technical error', function(assert) {
		assert.expect(1);
		try {
			this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("notExistingStepAssignedToCategory"));
		} catch (err) {
			assert.ok(err.message.indexOf("does not exist") > -1, "the right exception was raised");
		}
	});
	QUnit.module('Error behavior', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().supportLoadConfigWithoutAction().spyPutMessage();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleMessaging();
			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doLoadMessageConfigurations();
		}
	});
	QUnit.test('No analytical configuration loaded', function(assert) {
		this.oConfigurationFactory.getNavigationTargets();
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, "5020", "THEN fatal error WHEN accessing configuration objects");
	});
	QUnit.module('SmartFilterBar', {
		beforeEach : function(assert) {
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.configurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.messageHandler
				}
			});
			this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		}
	});
	QUnit.test('Load without SmartFilterBar config', function(assert) {
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		this.configurationFactory.getSmartFilterBarConfiguration().done(function(SFBLoadResult){
			assert.strictEqual(SFBLoadResult, undefined, '"undefined" expected if there is no SFB config');
		});
	});
	QUnit.test('Load complete SmartFilterBar config and retrieve it', function(assert) {
		var SFBConfig = {
			type : "smartFilterBar",
			id : "SmartFilterBar-1",
			service : "/test/service",
			entityType : "testEntityType"
		};
		this.sampleConfiguration.smartFilterBar = SFBConfig;
		
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		this.configurationFactory.getSmartFilterBarConfiguration().done(function(SFBLoadResult){
			assert.deepEqual(SFBLoadResult, SFBConfig, 'Object with same values expected');
			assert.notEqual(SFBLoadResult, SFBConfig, 'Different instance expected');	
		});
		
	});
	QUnit.test('Load complete SmartFilterBar config with entity set configured and retrieve it', function(assert) {
		var SFBConfig = {
			type : "smartFilterBar",
			id : "SmartFilterBar-1",
			service : "/test/service",
			entitySet : "testEntitySet"
		};
		this.sampleConfiguration.smartFilterBar = SFBConfig;
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		this.configurationFactory.getSmartFilterBarConfiguration().done(function(SFBLoadResult){
			assert.deepEqual(SFBLoadResult, SFBConfig, 'Object with same values expected');
			assert.notEqual(SFBLoadResult, SFBConfig, 'Different instance expected');	
		});
		
	});
	QUnit.test('Load incomplete SmartFilterBar config and retrieve it - service missing', function(assert) {
		var SFBConfig = {
				type : "smartFilterBar",
				id : "SmartFilterBar-1",
				entityType : "testEntityType"
		};
		this.sampleConfiguration.smartFilterBar = SFBConfig;
		
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		this.configurationFactory.getSmartFilterBarConfiguration().done(function(SFBLoadResult){
			assert.deepEqual(SFBLoadResult, undefined, 'no valid smart filter bar configuration object expected');
		});
	});
	QUnit.test('Load incomplete SmartFilterBar config and retrieve it - entityType missing', function(assert) {
		var SFBConfig = {
				type : "smartFilterBar",
				id : "SmartFilterBar-1",
				service : "/test/service"
		};
		this.sampleConfiguration.smartFilterBar = SFBConfig;
		
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		this.configurationFactory.getSmartFilterBarConfiguration().done(function(SFBLoadResult){
			assert.deepEqual(SFBLoadResult, undefined, 'no valid smart filter bar configuration object expected');
		});
	});
	QUnit.module('Load facet filter config', {
		beforeEach : function(assert) {
			var testEnv = this;
			this.coreApi = {
					getMetadataFacade : function() {
						return testEnv.metadataFacadeStub;
					}
			};
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.configurationFactory = new sap.apf.core.ConfigurationFactory({
				instances: {
					messageHandler : this.messageHandler,
					coreApi : this.coreApi
				},
				constructors : {
						RegistryProbe : function(idRegistry) {
							testEnv.idRegistry = idRegistry;
					}
				}
			});
			this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration('addTwoFacetFilters');
		}
	});
	QUnit.test('Configured facet filters create no indicator in idRegistry for facet filter option', function(assert) {
		this.metadataFacadeStub = metadataFacadeStub;
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		this.configurationFactory.getRegistry();
		assert.equal(this.idRegistry.getItem(sap.apf.core.constants.existsEmptyFacetFilterArray), undefined, 'Indicator for facet filter not set');
	});
	QUnit.test('Configured facet filters are loaded in design time', function(assert) {
		this.metadataFacadeStub = undefined;
		this.configurationFactory.loadConfig(this.sampleConfiguration, true);
		this.configurationFactory.getRegistry();
		assert.equal(this.idRegistry.getItem(sap.apf.core.constants.existsEmptyFacetFilterArray), undefined, 'Indicator for facet filter not set');
		var filters = this.configurationFactory.getFacetFilterConfigurations();
		var expectedFilters = jQuery.extend(true, [], this.sampleConfiguration.facetFilters);
		assert.deepEqual(filters, expectedFilters, "THEN filter configuration has been loaded");
	});
	QUnit.test('Not at all configured facet filters create no indicator in idRegistry', function(assert) {
		this.metadataFacadeStub = metadataFacadeStub;
		delete this.sampleConfiguration.facetFilters;
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		this.configurationFactory.getRegistry();
		assert.equal(this.idRegistry.getItem(sap.apf.core.constants.existsEmptyFacetFilterArray), undefined, 'Indicator for facet filter not set');
	});
	QUnit.test('Empty array creates indicator in idRegistry', function(assert) {
		this.metadataFacadeStub = metadataFacadeStub;
		this.sampleConfiguration.facetFilters = [];
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		this.configurationFactory.getRegistry();
		assert.equal(this.idRegistry.getItem(sap.apf.core.constants.existsEmptyFacetFilterArray), true, 'Indicator for facet filter set');
	});
	QUnit.module('Date handling in facet filter config', {
		beforeEach : function(assert) {
			var testEnv = this;
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.coreApi = {
				getMetadataFacade : function() {
					return testEnv.metadataFacadeStub;
				}
			};
			this.configurationFactory = new sap.apf.core.ConfigurationFactory({
				instances: {
					messageHandler : this.messageHandler,
					coreApi : this.coreApi
				},
				constructors : {
						RegistryProbe : function(idRegistry) {
							testEnv.idRegistry = idRegistry;
					}
				}
			});
		},
		createRequest : function() {
			return {
					type : "request",
					id : "facetFilterRequest-1",
					service : "serviceForFilterMapping.xsodata",
					entitySet : "entitySetForDate",
					selectProperties : [ "dateProperty", "selectProperty2" ]
				};
		},
		createFacetFilterConfig : function() {
			var facetFilters = [{
				type : "facetFilter",
				id : "filterIdA",
				property : 'dateProperty',
				multiSelection : false,
				preselectionFunction : undefined,
				label : {
					type : 'label',
					kind : 'text',
					key : 'property1'
				}
			}];
			return facetFilters;
		},
		addDateFacetFilterWithoutRequest : function(configuration) {
			configuration.facetFilters = this.createFacetFilterConfig();
			configuration.facetFilters[0].valueList = [ "01.12.2017"];
			configuration.facetFilters[0].preselectionDefaults = [ "01.12.2017", "01.12.2018" ];
		},
		addDateFacetFilterWithValueHelpRequest : function(configuration) {
			configuration.facetFilters = this.createFacetFilterConfig();
			configuration.facetFilters[0].valueList = [ "01.12.2017"];
			configuration.facetFilters[0].preselectionDefaults = [ "01.12.2017", "01.12.2018" ];
			configuration.facetFilters[0].valueHelpRequest = "facetFilterRequest-1";
			configuration.requests.push(this.createRequest());
		},
		addDateFacetFilterWithFilterResolutionRequest : function(configuration) {
			configuration.facetFilters = this.createFacetFilterConfig();
			configuration.facetFilters[0].valueList = [ "01.12.2017"];
			configuration.facetFilters[0].preselectionDefaults = [ "01.12.2017", "01.12.2018" ];
			configuration.facetFilters[0].filterResolutionRequest = "facetFilterRequest-1";
			configuration.requests.push(this.createRequest());
		}
	});
	QUnit.test('FacetFilter of type DateTime without valueList and without preselectionDefaults', function(assert) {
		var done = assert.async();
		this.metadataFacadeStub =  {
				getAllProperties : function(callback) {
					assert.ok(true, "THEN metadata facade has been called to getAllProperties");
					callback(["dateProperty"]);
				},
				getProperty : function(propertyName) {
					assert.equal(propertyName, "dateProperty", "THEN getProperty of dateProperty is requested");
					var property = {
							getAttribute: function(attribute) {
								if (attribute === "type"){
									return "Edm.DateTime";
								} else if (attribute === "sap:display-format") {
									return "Date";
								}
							}
					};
					return createPromiseWithTimeOut(property);
				}
		};
		this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		this.sampleConfiguration.facetFilters = this.createFacetFilterConfig();
		this.configurationFactory.loadConfig(this.sampleConfiguration).done(function(){
			this.configurationFactory.getRegistry();
			var facetFilterConfig = this.idRegistry.getItem("filterIdA");
			assert.equal(typeof facetFilterConfig.metadataProperty.getAttribute, 'function', "THEN config includes metadataProperty");
			done();
		}.bind(this));
	});
	QUnit.test('FacetFilter of type DateTime without valueList and without preselectionDefaults AND alias', function(assert) {
		var done = assert.async();
		this.metadataFacadeStub =  {
				getAllProperties : function(callback) {
					assert.ok(true, "THEN metadata facade has been called to getAllProperties");
					callback(["datePropertyAlias"]);
				},
				getProperty : function(propertyName) {
					assert.equal(propertyName, "datePropertyAlias", "THEN getProperty of dateProperty is requested");
					var property = {
							getAttribute: function(attribute) {
								if (attribute === "type"){
									return "Edm.DateTime";
								} else if (attribute === "sap:display-format") {
									return "Date";
								}
							}
					};
					return createPromiseWithTimeOut(property);
				}
		};

		this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		this.sampleConfiguration.facetFilters = this.createFacetFilterConfig();
		this.sampleConfiguration.facetFilters[0].alias = "datePropertyAlias";
		this.configurationFactory.loadConfig(this.sampleConfiguration).done(function(){
			this.configurationFactory.getRegistry();
			var facetFilterConfig = this.idRegistry.getItem("filterIdA");
			assert.equal(typeof facetFilterConfig.metadataProperty.getAttribute, 'function', "THEN config includes metadataProperty");
			done();
		}.bind(this));
	});
	QUnit.test('FacetFilter of type DateTime with valueList and preselectionDefaults', function(assert) {
		var done = assert.async();
		this.metadataFacadeStub =  {
				getAllProperties : function(callback) {
					assert.ok(true, "THEN metadata facade has been called to getAllProperties");
					callback(["dateProperty"]);
				},
				getProperty : function(propertyName) {
					assert.equal(propertyName, "dateProperty", "THEN getProperty of dateProperty is requested");
					var property = {
							"type": "Edm.DateTime",
							"sap:display-format" : "Date",
							getAttribute: function(attribute) {
								if (attribute === "type"){
									return "Edm.DateTime";
								} else if (attribute === "sap:display-format") {
									return "Date";
								}
							}
					};
					return createPromiseWithTimeOut(property);
				}
		};
		this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		this.addDateFacetFilterWithoutRequest(this.sampleConfiguration);
		this.configurationFactory.loadConfig(this.sampleConfiguration).done(function(){
			this.configurationFactory.getRegistry();
			var facetFilterConfig = this.idRegistry.getItem("filterIdA");
			assert.deepEqual(facetFilterConfig.valueList, [ new Date(Date.UTC(2017,11,1))], "THEN date values have been converted into format suitable for facet filter control");
			assert.deepEqual(facetFilterConfig.preselectionDefaults, [ new Date(Date.UTC(2017,11, 1)),  new Date(Date.UTC(2018, 11, 1))], "THEN date values have been converted");
			assert.equal(typeof facetFilterConfig.metadataProperty.getAttribute, 'function', "THEN config includes metadataProperty");
			done();
		}.bind(this));
	});
	QUnit.test('FacetFilter with yearmonthday semantic and default value and preselection defaults', function(assert) {
		var done = assert.async();
		var configurationFactory = this.configurationFactory;
		this.metadataFacadeStub = {
				getAllProperties : function(callback) {
					var serviceDocuments = configurationFactory.getServiceDocuments();
					var expectedServiceDocuments = ["dummy.xsodata", "test/hierarchy.xsodata"];
					//We test, that we can have access to service documents during configuration loading
					assert.deepEqual(serviceDocuments, expectedServiceDocuments, "THEN access to service documents works during load of configuration");
					assert.ok(true, "THEN metadata facade has been called to getAllProperties");
					callback(["dateProperty"]);
				},
				getProperty : function(propertyName) {
					var property = {
							"type" : "Edm.String",
							"sap:semantics" : "yearmonthday",
							getAttribute: function(attribute) {
								assert.equal(propertyName, "dateProperty", "THEN getProperty of dateProperty is requested");
								if (attribute === "type"){
									return "Edm.String";
								} else if (attribute === "sap:semantics") {
									return "yearmonthday";
								}
							}
					};
					return createPromiseWithTimeOut(property);
				}
		};
		this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		this.addDateFacetFilterWithoutRequest(this.sampleConfiguration);
		this.configurationFactory.loadConfig(this.sampleConfiguration).done(function(){
			this.configurationFactory.getRegistry();
			var facetFilterConfig = this.idRegistry.getItem("filterIdA");
			assert.deepEqual(facetFilterConfig.valueList, ["20171201"], "THEN date values have been converted into format suitable for facet filter control");
			assert.deepEqual(facetFilterConfig.preselectionDefaults, ["20171201", "20181201"], "THEN date values have been converted");
			assert.equal(typeof facetFilterConfig.metadataProperty.getAttribute, 'function', "THEN config includes metadataProperty");
			done();
		}.bind(this));
	});
	QUnit.test('FacetFilter of type DateTime with value help request', function(assert) {
		assert.expect(7);
		var done = assert.async();
		this.metadataFacadeStub =  {
				getAllProperties : function(callback) {
					assert.ok(true, "THEN metadata facade has been called to getAllProperties");
					callback(["dateProperty"]);
				},
				getPropertyMetadataByEntitySet : function(service, entitySet, propertyName) {
					assert.equal(propertyName, "dateProperty", "THEN getProperty of dateProperty is requested");
					assert.equal(service, "serviceForFilterMapping.xsodata", "THEN expected serviceroot");
					assert.equal(entitySet, "entitySetForDate", "THEN expected entity set");
					var property = {
							"type" : "Edm.DateTime",
							"sap:display-format" : "Date",
							getAttribute: function(attribute) {
								if (attribute === "type"){
									return "Edm.DateTime";
								} else if (attribute === "sap:display-format") {
									return "Date";
								}
							}
					};
					return createPromiseWithTimeOut(property);
				}
		};
		this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		this.addDateFacetFilterWithValueHelpRequest(this.sampleConfiguration);
		this.configurationFactory.loadConfig(this.sampleConfiguration).done(function(){
			this.configurationFactory.getRegistry();
			var facetFilterConfig = this.idRegistry.getItem("filterIdA");
			assert.deepEqual(facetFilterConfig.valueList, [ new Date(Date.UTC(2017,11,1))], "THEN date values have been converted into format suitable for facet filter control");
			assert.deepEqual(facetFilterConfig.preselectionDefaults, [ new Date(Date.UTC(2017,11, 1)),  new Date(Date.UTC(2018, 11, 1))], "THEN date values have been converted");
			assert.equal(typeof facetFilterConfig.metadataProperty.getAttribute, 'function', "THEN config includes metadataProperty");
			done();
		}.bind(this));
	});
	QUnit.test('FacetFilter of type DateTime with filter resolution request', function(assert) {
		assert.expect(7);
		var done = assert.async();
		this.metadataFacadeStub =  {
				getAllProperties : function(callback) {
					assert.ok(true, "THEN metadata facade has been called to getAllProperties");
					callback(["dateProperty"]);
				},
				getPropertyMetadataByEntitySet : function(service, entitySet, propertyName) {
					assert.equal(propertyName, "dateProperty", "THEN getProperty of dateProperty is requested");
					assert.equal(service, "serviceForFilterMapping.xsodata", "THEN expected serviceroot");
					assert.equal(entitySet, "entitySetForDate", "THEN expected entity set");
					var property = {
							"type" : "Edm.String",
							"sap:semantics" : "yearmonthday",
							getAttribute: function(attribute) {
								if (attribute === "type"){
									return "Edm.DateTime";
								} else if (attribute === "sap:display-format") {
									return "Date";
								}
							}
					};
					return createPromiseWithTimeOut(property);
				}
		};
		this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		this.addDateFacetFilterWithFilterResolutionRequest(this.sampleConfiguration);
		this.configurationFactory.loadConfig(this.sampleConfiguration).done(function(){
			this.configurationFactory.getRegistry();
			var facetFilterConfig = this.idRegistry.getItem("filterIdA");
			assert.deepEqual(facetFilterConfig.valueList, [ new Date(Date.UTC(2017,11,1))], "THEN date values have been converted into format suitable for facet filter control");
			assert.deepEqual(facetFilterConfig.preselectionDefaults, [ new Date(Date.UTC(2017,11, 1)),  new Date(Date.UTC(2018, 11, 1))], "THEN date values have been converted");
			assert.equal(typeof facetFilterConfig.metadataProperty.getAttribute, 'function', "THEN config includes metadataProperty");
			done();
		}.bind(this));
	});
	QUnit.test('FacetFilter getList - check whether metadataProperty is returned correctly', function(assert) {
		assert.expect(5);
		var done = assert.async();
		this.metadataFacadeStub =  {
				getAllProperties : function(callback) {
					assert.ok(true, "THEN metadata facade has been called to getAllProperties");
					callback(["dateProperty"]);
				},
				getProperty : function(propertyName) {
					assert.equal(propertyName, "dateProperty", "THEN getProperty of dateProperty is requested");
					var getAttributeFunction = function(attribute) {
						if (attribute === "type"){
							return "Edm.DateTime";
						} else if (attribute === "sap:display-format") {
							return "Date";
						}
					};
					var getAttributeFunctionForClone = function(attribute) {
						if (attribute === "x") {
							return "xValue";
						}
					};
					var property = {
							clone : function() {
								assert.ok(true, "clone function was called");
								return { getAttribute : getAttributeFunctionForClone };
							},
							getAttribute: getAttributeFunction
					};
					return createPromiseWithTimeOut(property);
				}
		};
		this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		this.sampleConfiguration.facetFilters = this.createFacetFilterConfig();
		this.configurationFactory.loadConfig(this.sampleConfiguration).done(function(){
			var facetFilterConfig = this.configurationFactory.getFacetFilterConfigurations()[0];
			assert.equal(typeof facetFilterConfig.metadataProperty.getAttribute, 'function', "THEN config includes metadataProperty");
			assert.equal(facetFilterConfig.metadataProperty.getAttribute("x"), "xValue", "THEN the cloned metadata property is used");
			done();
		}.bind(this));
	});

	QUnit.module('Error handling when loading', {
		beforeEach : function(assert) {
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().putMessageOnCheck().spyPutMessage();
			var metadataFacadeStub = {
					getAllProperties : function(callback) {
						callback( [ 'property1']);
					},
					getProperty : function () {
						return createPromiseWithTimeOut({
							getAttribute : function() {
								return "nothingOfInterest";
							}
						});
					}
			};
			var coreApi = {
					getMetadataFacade : function() {
						return metadataFacadeStub;
					}
				};
			this.configurationFactory = new sap.apf.core.ConfigurationFactory({
				instances: {
					messageHandler : this.messageHandler,
					coreApi : coreApi
				}
			});
		}
	});
	QUnit.test('Mandatory properties for facet filter object', function(assert) {
		var done = assert.async();
		var wrongFilterType = {
			type : 'filter',
			id : 'filterIdA',
			property : 'property1'
		};
		var wrongFilterProperty = {
			type : 'facetFilter',
			id : 'filterIdA',
			property : undefined
		};
		var wrongFilterId = {
			type : 'facetFilter',
			id : undefined,
			property : 'property1'
		};
		this.messageHandler.spyPutMessage();
		var sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		sampleConfiguration.facetFilters = [ wrongFilterType, wrongFilterProperty, wrongFilterId];
		this.configurationFactory.loadConfig(sampleConfiguration).done(function(){
			assert.equal(this.messageHandler.spyResults.putMessage[0].code, 5033, "Message code for wrong type");
			assert.equal(this.messageHandler.spyResults.putMessage[1].code, 5034, "Message code for missing property");
			done();
		}.bind(this));

	});

	QUnit.test('Preselection function module path resolution successful', function(assert) {
		sap.apf.preselectionFunction = function() {
			return 'Successfully resolved';
		};
		var ffConfigWithValidPreselectionFunctionPath = {
			type : 'facetFilter',
			id : 'filterIdP',
			property : 'propertyP',
			preselectionFunction : 'sap.apf.preselectionFunction'
		};
		var sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		sampleConfiguration.facetFilters = [ffConfigWithValidPreselectionFunctionPath];
		this.configurationFactory.loadConfig(sampleConfiguration);
		assert.equal(this.configurationFactory.getFacetFilterConfigurations()[0].preselectionFunction(), 'Successfully resolved', ',Resolvement succussful');
	});
	QUnit.test('Preselection function module path resolution fails', function(assert) {
		sap.apf.preselectionFunction = 'I am no function';
		var configWithValidPreselectionFunctionPath = {
			type : 'facetFilter',
			id : 'filterIdP',
			property : 'propertyP',
			preselectionFunction : 'sap.apf.preselectionFunction'
		};
		this.messageHandler.spyPutMessage();
		var sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		sampleConfiguration.facetFilters = [ configWithValidPreselectionFunctionPath];
		this.configurationFactory.loadConfig(sampleConfiguration);
		assert.equal(this.configurationFactory.getFacetFilterConfigurations()[0].preselectionFunction, undefined, 'Facet filter property preselectionFunction set undefined');
		assert.equal(this.messageHandler.spyResults.putMessage.code, 5035, "Message code for invalid function module path");
	});
	QUnit.module("Configuration from modeler", {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleMessaging();
			this.oCoreApi.createRepresentation = function(sRepresentationConstructorPath, oConfig) {
				var interfaceProxy = new sap.apf.ui.representations.RepresentationInterfaceProxy(this.oCoreApi, {});
				var Representation = sap.apf.utils.extractFunctionFromModulePathString(sRepresentationConstructorPath);
				return new Representation(interfaceProxy, oConfig);
			};
			this.oConfigurationTemplate = this.getJSON('../testhelper/config/analyticalConfigurationFromModeler1.json', assert);
			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate, true);
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
		},
		getJSON : function(url, assert) {
			var analyticalConfiguration;
			jQuery.ajax({
				url : url,
				dataType : "json",
				success : function(data) {
					analyticalConfiguration = data;
				},
				error : function() {
					assert.ok(false, "error in retrieving json");
				},
				async : false
			});
			return analyticalConfiguration;
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test("Get thumbnails of step and representation", function(assert) {
		var oStep = this.oConfigurationFactory.createStep("Step-1");
		assert.ok(oStep, "Step has been created");
		var representationInfo = oStep.getRepresentationInfo();
		assert.ok(representationInfo[0].thumbnail, "Thumbnail expected");
	});
	QUnit.test("Get configuration when loaded in design time", function(assert){
		var stepConfigurations = this.oConfigurationFactory.getStepTemplates();
		assert.deepEqual(stepConfigurations[0].id, this.oConfigurationTemplate.steps[0].id, "THEN step as expected");
	});
	QUnit.module('Accessing metadata property for facet filter config', {
		beforeEach : function(assert) {
			var testEnv = this;
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.coreApi = {
				getMetadataFacade : function() {
					return testEnv.metadataFacadeStub;
				}
			};
			this.configurationFactory = new sap.apf.core.ConfigurationFactory({
				instances: {
					messageHandler : this.messageHandler,
					coreApi : this.coreApi
				},
				constructors : {
						RegistryProbe : function(idRegistry) {
							testEnv.idRegistry = idRegistry;
					}
				}
			});
		},
		createRequest : function(counter) {
			return {
					type : "request",
					id : "facetFilterRequest-" + counter,
					service : "service" + counter + ".xsodata",
					entitySet : "entitySetForString"  + counter,
					selectProperties : [ "stringProperty", "selectProperty2" ]
				};
		},
		createFacetFilterConfig : function(counter) {
			var facetFilters = [{
				type : "facetFilter",
				id : "filterIdA",
				property : 'stringProperty',
				multiSelection : false,
				preselectionFunction : undefined,
				label : {
					type : 'label',
					kind : 'text',
					key : 'property1'
				}
			}];
			return facetFilters;
		},
		addFacetFilterWithValueHelpRequest : function(configuration) {
			configuration.facetFilters = this.createFacetFilterConfig();
			configuration.facetFilters[0].valueHelpRequest = "facetFilterRequest-1";
			configuration.requests.push(this.createRequest(1));
		},
		addFacetFilterWithFilterResolutionRequest : function(configuration) {
			configuration.facetFilters = this.createFacetFilterConfig();
			configuration.facetFilters[0].filterResolutionRequest = "facetFilterRequest-2";
			configuration.requests.push(this.createRequest(2));
		},
		addFacetFilterWithValueHelpAndFilterResolutionRequest : function(configuration) {
			configuration.facetFilters = this.createFacetFilterConfig();
			configuration.facetFilters[0].valueHelpRequest = "facetFilterRequest-1";
			configuration.requests.push(this.createRequest(1));
			configuration.facetFilters[0].filterResolutionRequest = "facetFilterRequest-2";
			configuration.requests.push(this.createRequest(2));
		}
	});
	QUnit.test('FacetFilter with valueHelpRequest', function(assert) {
		var done = assert.async();
		this.metadataFacadeStub =  {
				getAllProperties : function(callback) {
					assert.ok(true, "THEN metadata facade has been called to getAllProperties");
					callback(["stringProperty"]);
				},
				getPropertyMetadataByEntitySet : function(service, entitySet, propertyName) {
					assert.strictEqual(service, "service1.xsodata", "THEN service is provided");
					assert.strictEqual(entitySet, "entitySetForString1", "THEN entity set of value help request is provided");
					assert.equal(propertyName, "stringProperty", "THEN getPropertyMetadataByEntitySet is requested");
					var property = {
							"type": "Edm.String",
							getAttribute: function(attribute) {
								if (attribute === "type"){
									return "Edm.SomeReturnValue";
								}
							}
					};
					return createPromiseWithTimeOut(property);
				}
		};
		this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		this.addFacetFilterWithValueHelpRequest(this.sampleConfiguration);
		this.configurationFactory.loadConfig(this.sampleConfiguration).done(function(){
			this.configurationFactory.getRegistry();
			var facetFilterConfig = this.idRegistry.getItem("filterIdA");
			assert.strictEqual(facetFilterConfig.metadataProperty.getAttribute("type"), "Edm.SomeReturnValue", "THEN expected metadata property is requested");
			done();
		}.bind(this));
	});
	QUnit.test('FacetFilter with filterResolutionRequest', function(assert) {
		var done = assert.async();
		this.metadataFacadeStub =  {
				getAllProperties : function(callback) {
					assert.ok(true, "THEN metadata facade has been called to getAllProperties");
					callback(["stringProperty"]);
				},
				getPropertyMetadataByEntitySet : function(service, entitySet, propertyName) {
					assert.strictEqual(service, "service2.xsodata", "THEN service of filter resolution request is provided");
					assert.strictEqual(entitySet, "entitySetForString2", "THEN entity set of filter resolution request is provided");
					assert.equal(propertyName, "stringProperty", "THEN getPropertyMetadataByEntitySet is requested");
					var property = {
							"type": "Edm.String",
							getAttribute: function(attribute) {
								if (attribute === "type"){
									return "Edm.SomeReturnValue";
								}
							}
					};
					return createPromiseWithTimeOut(property);
				}
		};
		this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		this.addFacetFilterWithFilterResolutionRequest(this.sampleConfiguration);
		this.configurationFactory.loadConfig(this.sampleConfiguration).done(function(){
			this.configurationFactory.getRegistry();
			var facetFilterConfig = this.idRegistry.getItem("filterIdA");
			assert.strictEqual(facetFilterConfig.metadataProperty.getAttribute("type"), "Edm.SomeReturnValue", "THEN expected metadata property is requested");
			done();
		}.bind(this));
	});
	QUnit.test('FacetFilter with valueHelpRequest AND filterResolutionRequest', function(assert) {
		var done = assert.async();
		this.metadataFacadeStub =  {
				getAllProperties : function(callback) {
					assert.ok(true, "THEN metadata facade has been called to getAllProperties");
					callback(["stringProperty"]);
				},
				getPropertyMetadataByEntitySet : function(service, entitySet, propertyName) {
					assert.strictEqual(service, "service1.xsodata", "THEN service of value help request is provided");
					assert.strictEqual(entitySet, "entitySetForString1", "THEN entity set of value help request is provided");
					assert.equal(propertyName, "stringProperty", "THEN getPropertyMetadataByEntitySet is requested");
					var property = {
							"type": "Edm.String",
							getAttribute: function(attribute) {
								if (attribute === "type"){
									return "Edm.SomeReturnValue";
								}
							}
					};
					return createPromiseWithTimeOut(property);
				}
		};
		this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		this.addFacetFilterWithValueHelpAndFilterResolutionRequest(this.sampleConfiguration);

		this.configurationFactory.loadConfig(this.sampleConfiguration).done(function(){
			this.configurationFactory.getRegistry();
			var facetFilterConfig = this.idRegistry.getItem("filterIdA");
			assert.strictEqual(facetFilterConfig.metadataProperty.getAttribute("type"), "Edm.SomeReturnValue", "THEN expected metadata property is requested");
			done();
		}.bind(this));
	});
	QUnit.test('FacetFilter without valueHelpRequest AND without filterResolutionRequest', function(assert) {
		var done = assert.async();
		this.metadataFacadeStub =  {
				getAllProperties : function(callback) {
					assert.ok(true, "THEN metadata facade has been called to getAllProperties");
					callback(["stringProperty"]);
				},
				getProperty : function(propertyName) {
					assert.equal(propertyName, "stringProperty", "THEN getPropertyMetadataByEntitySet is requested");
					var property = {
							"type": "Edm.String",
							getAttribute: function(attribute) {
								if (attribute === "type"){
									return "Edm.SomeReturnValue";
								}
							}
					};
					return createPromiseWithTimeOut(property);
				}
		};
		this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		this.sampleConfiguration.facetFilters = this.createFacetFilterConfig();
		this.configurationFactory.loadConfig(this.sampleConfiguration).done(function(){
			this.configurationFactory.getRegistry();
			var facetFilterConfig = this.idRegistry.getItem("filterIdA");
			assert.strictEqual(facetFilterConfig.metadataProperty.getAttribute("type"), "Edm.SomeReturnValue", "THEN expected metadata property is requested");
			done();
		}.bind(this));
	});
}());
