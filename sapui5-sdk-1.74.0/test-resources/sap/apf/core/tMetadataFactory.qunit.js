jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfCoreApi');
jQuery.sap.require("sap.apf.testhelper.mockServer.wrapper");
jQuery.sap.require("sap.apf.core.metadataFactory");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.core.entityTypeMetadata");
jQuery.sap.require("sap.apf.core.metadataFacade");
jQuery.sap.require("sap.apf.core.metadataProperty");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.testhelper.createDefaultAnnotationHandler");

(function() {
	'use strict';

	QUnit.module('Get instances', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateGenericMetadata();
			sap.apf.testhelper.mockServer.activateGenericMetadata2();
			sap.apf.testhelper.mockServer.activateApf();
			var oInject = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler : annotationHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					Metadata : sap.apf.core.Metadata,
					EntityTypeMetadata : sap.apf.core.EntityTypeMetadata,
					MetadataFacade : sap.apf.core.MetadataFacade,
					MetadataProperty : sap.apf.core.MetadataProperty,
					ODataModel : this.ODataModel
				},
				functions : {
					getSapSystem : function() {
						return undefined;
					}
				}
			};
			this.metadataFactory = new sap.apf.core.MetadataFactory(oInject);
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('Same metadata instance returned if retrieved twice for service root', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var firstRetrieval = this.metadataFactory.getMetadata('/some/path/dummy.xsodata');
		firstRetrieval.done(function(metadataFirst) {
			var secondRetrieval = this.metadataFactory.getMetadata('/some/path/dummy.xsodata');
			assert.equal(metadataFirst.type, 'metadata', 'Metadata instance expected');
			secondRetrieval.done(function(metadataSecond) {
				assert.strictEqual(metadataFirst, metadataSecond, 'Same metadata instance expected');
				done();
			});
		}.bind(this));
	});
	QUnit.test('Same entity type metadata instance returned if retrieved twice for same service root and entity type', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var firstRetrieval = this.metadataFactory.getEntityTypeMetadata('/some/path/dummy.xsodata', 'secondEntityQueryType');
		firstRetrieval.done(function(entityTypeMetadataFirst) {
			var secondRetrieval = this.metadataFactory.getEntityTypeMetadata('/some/path/dummy.xsodata', 'secondEntityQueryType');
			assert.equal(entityTypeMetadataFirst.type, 'entityTypeMetadata', 'Entity type metadata instance expected');
			secondRetrieval.done(function(entityTypeMetadataSecond) {
				assert.equal(entityTypeMetadataFirst, entityTypeMetadataSecond, 'Same entity type metadata instance expected');
				done();
			});
		}.bind(this));		
	});
	QUnit.test('Different entity type metadata instance returned if same entity type retrieved twice for different service roots', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var firstRetrieval = this.metadataFactory.getEntityTypeMetadata('/some/path/dummy.xsodata', 'secondEntityQueryType');
		firstRetrieval.done(function(entityTypeMetadataFirst) {
			var secondRetrieval = this.metadataFactory.getEntityTypeMetadata('/some/path2/dummyTwo.xsodata', 'secondEntityQueryType');
			assert.equal(entityTypeMetadataFirst.type, 'entityTypeMetadata', 'Entity type metadata instance expected');
			secondRetrieval.done(function(entityTypeMetadataSecond) {
				assert.equal(entityTypeMetadataSecond.type, 'entityTypeMetadata', 'Entity type metadata instance expected');
				assert.notEqual(entityTypeMetadataFirst, entityTypeMetadataSecond,  'Different instances expected');
				done();
			});
		}.bind(this));	
	});
	QUnit.test('GetEntityTypeMetadata if a Service is not in metadata anymore', function(assert) {
		var done = assert.async();
		this.metadataFactory.getEntityTypeMetadata('/notFound/path/dummy.xsodata', 'secondEntityQueryType').done(function(metadata){
			assert.strictEqual(metadata, undefined, "No Metadata returned if service is not available");
			done();
		});
	});
	QUnit.module('Propagation of injection', {
		beforeEach : function(assert) {
			var that = this;
			this.numberOfHashtables = 0;
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			var Hashtable = function(messageHandler) {
				that.numberOfHashtables++;
				var ht = new sap.apf.utils.Hashtable(messageHandler);

				this.setItem = ht.setItem;
				this.hasItem = ht.hasItem;
				this.getItem = ht.getItem;
			};
			var Metadata = function(inject) {
				this.type = "injectedMetadata";
				this.isInitialized = function() {
					var deferred = jQuery.Deferred();
					deferred.resolve(this);
					return deferred.promise();
				};
				assert.ok(true, "injected metadata was used");
				assert.ok(inject.constructors.Hashtable, "Hashtable injected");
				assert.ok(inject.instances.messageHandler, "Messagehandler injected");
				assert.equal(new inject.constructors.ODataModel().type, "injectedODataModel", "OdataModel injected");
				assert.ok(inject.functions.getSapSystem, "THEN function getSapSystem is injected");
			};
			var EntityTypeMetadata = function(messageHandler, sEntityType, metadata) {
				assert.ok(true, "injected entitytype metadata is used");
				assert.equal(metadata.type, "injectedMetadata", "injected metadata is used");
				assert.equal(messageHandler, that.oIfMessageHandler, "injected messagehandler instance is used");
				this.type = "injectedEntityTypeMetadata";
			};
			var MetadataProperty = function() {
				assert.ok(true, "injected metadata property is used");
				this.type = "injectedMetadataProperty";
			};
			var MetadataFacade = function(inject) {
				assert.equal(new inject.constructors.MetadataProperty().type, "injectedMetadataProperty", "the injected metadata property is used");
				assert.equal(inject.instances.messageHandler, that.oIfMessageHandler, "the injected message handler instance is used");
				assert.equal(inject.instances.metadataFactory, that.metadataFactory, "the correct instance of the metadata factory");
				this.type = "injectedMetadataFacade";
			};
			var ODataModel = function() {
				this.type = "injectedODataModel";
			};
			var inject = {
					instances : {
						messageHandler : this.oIfMessageHandler,
						coreApi : this.coreApi,
						annotationHandler : annotationHandler
					},
					functions : {
						getServiceDocuments : function() {
							return "injected";
						},
						getSapSystem : function() {
							return undefined;
						}

					},
					constructors : {
						Hashtable : Hashtable,
						Metadata : Metadata,
						EntityTypeMetadata : EntityTypeMetadata,
						MetadataFacade : MetadataFacade,
						MetadataProperty : MetadataProperty,
						ODataModel : ODataModel
					}
				};
			this.metadataFactory = new sap.apf.core.MetadataFactory(inject);
		}
	});
	QUnit.test("WHEN getMetadataFactory is called", function(assert){
		var facade = this.metadataFactory.getMetadataFacade();
		assert.equal(facade.type, "injectedMetadataFacade", "THEN the injected facade is used");
	});
	QUnit.test("WHEN getMetadata is called", function(assert){
		assert.expect(6);
		var done = assert.async();
		var metadata = this.metadataFactory.getMetadata("/service/root");
		metadata.done(function(metadata) {
			assert.equal(metadata.type, "injectedMetadata", "THEN the injected metadata is used");
			done();
		});
	});
	QUnit.test("WHEN getEntityTypeMetadata is called", function(assert){
		assert.expect(9);
		var done = assert.async();
		var entityTypeMetadata = this.metadataFactory.getEntityTypeMetadata("/service/root", "aEntityType");
		entityTypeMetadata.done(function(etm) {
			assert.equal(etm.type, "injectedEntityTypeMetadata", "THEN the injected entity type metadata is used");
			done();
		});
	});
	QUnit.test("WHEN getServiceDocuments is called", function(assert){
		assert.equal(this.metadataFactory.getServiceDocuments(), "injected", "THEN injected function is called");
	});
	QUnit.module('Metadata facade provisioning', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateGenericMetadata();
			sap.apf.testhelper.mockServer.activateApf();

			var oInject = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler : annotationHandler
				},
				functions : {
					getServiceDocuments : function() {
						return [ "/some/path/dummy.xsodata", "/sap/hba/r/apf/core/odata/apf.xsodata" ];
					},
					getSapSystem : function() {
						return undefined;
					}

				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					Metadata : sap.apf.core.Metadata,
					EntityTypeMetadata : sap.apf.core.EntityTypeMetadata,
					MetadataFacade : sap.apf.core.MetadataFacade,
					MetadataProperty : sap.apf.core.MetadataProperty,
					ODataModel : this.ODataModel
				}
			};
			this.metadataFactory = new sap.apf.core.MetadataFactory(oInject);
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('Get entity types', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var expectedEntityTypes = [
			  'firstEntityQueryResultsType',
			  'firstEntityQueryType',
			  'secondEntityQueryResultsType',
			  'secondEntityQueryType',
			  'thirdEntityDirectlyAddressableQueryResultsType',
			  'fourthEntityWithoutSapSemanticsType'
			];
		this.metadataFactory.getEntityTypes('/some/path/dummy.xsodata').done(function(entityTypes) {
			assert.deepEqual(entityTypes, expectedEntityTypes, 'Array with entity types from service root');
			done();
		});
	});
	QUnit.test('Get entity sets', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var expectedEntitySets = [
			'firstEntityQuery',
			'secondEntityQuery',
			'thirdEntityDirectlyAddressableQueryResults',
			'fourthEntityWithoutSapSemantics'
		];
		this.metadataFactory.getEntitySets('/some/path/dummy.xsodata').done(function(entitySets) {
			assert.deepEqual(entitySets, expectedEntitySets, 'Array with entity sets from service root');
			done();
		});
	});
	QUnit.test('Get all entity sets except parameter entity sets', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var expectedEntitySets = [
			'firstEntityQueryResults',
			'secondEntityQueryResults',
			'thirdEntityDirectlyAddressableQueryResults',
			'fourthEntityWithoutSapSemantics'
		];
		this.metadataFactory.getAllEntitySetsExceptParameterEntitySets('/some/path/dummy.xsodata').done(function(entitySets) {
			assert.deepEqual(entitySets, expectedEntitySets, 'Array with entity sets from service root');
			done();
		});
	});
	QUnit.test('Get service documents', function(assert) {
		var oExpectedServiceDocuments = [ "/some/path/dummy.xsodata", "/sap/hba/r/apf/core/odata/apf.xsodata" ];
		assert.deepEqual(this.metadataFactory.getServiceDocuments(), oExpectedServiceDocuments, "Array with service documents from analytical configuration file expected");
	});
	QUnit.test('Metadata facade integration in factory and test getAllProperties()', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var expectedProperties = ['firstProperty', 'secondProperty', 'nonFilterableProperty', 'P_FirstParameter', 'P_SecondParameter', 'PropertyOneForThird', 'PropertyTwoForThird', 'PropertyOneForFourth', 'PropertyTwoForFourth',
		                          'SerializedAnalysisPath', 'StructuredAnalysisPath', 'GenID', 'AnalysisPath', 'AnalysisPathName', 'LogicalSystem', 'ApplicationConfigurationURL', 'NumberOfAnalysisPaths', 'AnalyticalConfiguration', 'AnalyticalConfigurationName',
		                          'CreationUTCDateTime', 'CreatedByUser', 'LastChangedByUser', 'SerializedAnalyticalConfiguration', 'TextElement', 'Language', 'TextElementType', 'TextElementDescription', 'Application', 'MaximumLength', 'TranslationHint',
		                          'LastChangeUTCDateTime'];
		var metadataFacade = this.metadataFactory.getMetadataFacade();
		assert.ok(metadataFacade.type === 'metadataFacade', 'getMetadataFacade() returns instance of MetadataFacade');
		metadataFacade.getAllProperties(function callback(propertyNames) {
			assert.deepEqual(propertyNames, expectedProperties, 'Property names returned as expected');
			done();
		});
	});
	QUnit.test('Metadata facade instance with parameter for one service document', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var metadataFacade = this.metadataFactory.getMetadataFacade('/sap/hba/r/apf/core/odata/apf.xsodata');
		//Here a metadata facade is used, which has access to two different service documents, but is instantiated with a param for one service document
		metadataFacade.getAllProperties(function(propertyNames) {
			assert.deepEqual(propertyNames, [ 'SerializedAnalysisPath', 'StructuredAnalysisPath', 'GenID', 'AnalysisPath', 'AnalysisPathName', 'LogicalSystem', 'ApplicationConfigurationURL', 'NumberOfAnalysisPaths', 'AnalyticalConfiguration',
			                                  'AnalyticalConfigurationName', 'CreationUTCDateTime', 'CreatedByUser', 'LastChangedByUser', 'SerializedAnalyticalConfiguration', 'TextElement', 'Language', 'TextElementType', 'TextElementDescription', 'Application',
			                                  'MaximumLength', 'TranslationHint', 'LastChangeUTCDateTime' ], 'Only property names for the specified service document expected');
			done();
		});
	});
	QUnit.module('Metadata promise gets rejected', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			var FailingMetadata = function() {
				this.isInitialized = function(){
					
					var deferred = jQuery.Deferred();
					deferred.reject();
					return deferred.promise();
				};
			};
			var oInject = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler : annotationHandler
				},
				functions : {
					getServiceDocuments : function() {
						return [ "/some/path/dummy.xsodata", "/sap/hba/r/apf/core/odata/apf.xsodata" ];
					},
					getSapSystem : function() {
						return undefined;
					}

				},
				
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					Metadata : FailingMetadata,
					EntityTypeMetadata : sap.apf.core.EntityTypeMetadata,
					MetadataFacade : sap.apf.core.MetadataFacade,
					MetadataProperty : sap.apf.core.MetadataProperty,
					ODataModel : this.ODataModel
				}
			};
			this.metadataFactory = new sap.apf.core.MetadataFactory(oInject);
		}
	});
	QUnit.test('WHEN access to metadata fails AND getEntitySets is CALLED', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var expectedEntitySets = [];
		this.metadataFactory.getEntitySets('/some/path/dummy.xsodata').done(function(entitySets) {
			assert.deepEqual(entitySets, expectedEntitySets, 'THEN Empty Array with entity sets from service root');
			done();
		});
	});
	QUnit.test('WHEN access to metadata fails AND getAllEntitySetsExceptParameterEntitySets is CALLED', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var expectedEntitySets = [];
		this.metadataFactory.getAllEntitySetsExceptParameterEntitySets('/some/path/dummy.xsodata').done(function(entitySets) {
			assert.deepEqual(entitySets, expectedEntitySets, 'THEN Empty Array with entity sets from service root');
			done();
		});
	});
	QUnit.test('WHEN access to metadata fails AND getEntityTypes is CALLED', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var expectedEntityTypes = [];
		this.metadataFactory.getEntityTypes('/some/path/dummy.xsodata').done(function(entityTypes) {
			assert.deepEqual(entityTypes, expectedEntityTypes, 'THEN Empty Array with entity types from service root');
			done();
		});
	});
}());