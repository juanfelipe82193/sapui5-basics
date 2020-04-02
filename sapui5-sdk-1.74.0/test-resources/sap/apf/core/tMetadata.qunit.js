/* globals OData, jQuery, sap, QUnit */

jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfCoreApi");
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.testhelper.mockServer.wrapper");
jQuery.sap.require("sap.apf.core.utils.fileExists");
jQuery.sap.require("sap.apf.testhelper.createDefaultAnnotationHandler");

QUnit.config.reorder = false;

(function() {
	'use strict';

	function getSapSystem() { 
		return undefined; 
	}
	
	QUnit.module('Basic functionality', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateGenericMetadata();
			sap.apf.testhelper.mockServer.activateModeler();
			var oInject = {
					instances : {
						messageHandler : this.oIfMessageHandler,
						coreApi : this.coreApi,
						annotationHandler : annotationHandler
					},
					constructors : {
						Hashtable : sap.apf.utils.Hashtable
					},
					functions : {
						getSapSystem : getSapSystem
					}
			};
			this.metadataForAnalyticalConfig = new sap.apf.core.Metadata(oInject, "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata");
			this.oMetadata = new sap.apf.core.Metadata(oInject, "/some/path/dummy.xsodata");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('getPropertyMetadata() by name and entity set, test attributes', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var expected = {
				"aggregation-role" : "dimension",
				dataType : {
					type : "Edm.String",
					maxLength : "3"
				},
				"name" : "firstProperty"
		};
		this.oMetadata.isInitialized().done(function(metadata){
			var result = metadata.getPropertyMetadata("firstEntityQueryResults", "firstProperty");
			assert.deepEqual(result.dataType, expected.dataType, 'required metadata: dataType ');
			assert.deepEqual(result.name, expected.name, 'required metadata: name');
			assert.deepEqual(result["aggregation-role"], expected["aggregation-role"], 'required metadata: aggregation-role');
			done();
		});
	});
	QUnit.test('getParameterEntitySetKeyProperties()throws when parameter missing', function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			assert.throws(function() {
				metadata.getParameterEntitySetKeyProperties();
			}, "Error successfully thrown due to missing argument for getParameterEntitySetKeyProperties");
			done();
		});
	});
	QUnit.test('getParameterEntitySetKeyProperties(), test attributes', function(assert) {
		var done = assert.async();
		var expected = {
				"dataType" : {
					"maxLength" : "5",
					"type" : "Edm.String"
				},
				"defaultValue" : "secondParamDefaultValue",
				"name" : "P_SecondParameter",
				"nullable" : "false",
				isKey : true
		};

		this.oMetadata.isInitialized().done(function(metadata){
			var result = metadata.getParameterEntitySetKeyProperties("firstEntityQuery");
			assert.deepEqual(result.length, 1, 'One view parameter');
			assert.deepEqual(result[0].name, expected.name, 'name');
			assert.strictEqual(result[0].isKey, true, 'One key parameter with its attributes');
			assert.strictEqual(result[0].nullable, "false", 'One key parameter with its attributes');
			assert.strictEqual(result[0].defaultValue, "secondParamDefaultValue", 'One key parameter with its attributes');
			done();
		});
	});
	QUnit.test('getFilterableProperties() of entity type', function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			assert.deepEqual(metadata.getFilterableProperties("firstEntityQuery"), [ "firstProperty" ], '1 filterable properties expected');
			done();
		});
	});
	QUnit.test('getFilterableProperties() of entity type without aggregation semantics', function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			assert.deepEqual(metadata.getFilterableProperties("fourthEntityWithoutSapSemantics"),
					[ "PropertyOneForFourth", "PropertyTwoForFourth"  ], '2 filterable properties');
			done();
		});
	});
	QUnit.test('getAllKeys()', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var aExpectedKeys = [ "GenID", "P_FirstParameter", "P_SecondParameter", "PropertyOneForThird", "PropertyOneForFourth" ];

		this.oMetadata.isInitialized().done(function(metadata){
			assert.deepEqual(metadata.getAllKeys(), aExpectedKeys, "All keys of all EntityTypes");
			done();
		});
	});
	QUnit.test('getAttributes() by a property name', function(assert) {
		assert.expect(8);
		var done = assert.async();
		var oExpectedProperty = {
				"aggregation-role" : "dimension",
				dataType : {
					type : "Edm.String",
					maxLength : "3"
				},
				"name" : "firstProperty"
		};
		var oExpectedParameter = {
				"dataType" : {
					"type" : "Edm.Int32"
				},
				"name" : "P_FirstParameter",
				"nullable" : "false",
				"parameter" : "mandatory"
		};
		this.oMetadata.isInitialized().done(function(metadata){
			var first = metadata.getAttributes("firstProperty");
			assert.deepEqual(first.dataType, oExpectedProperty.dataType, 'required metadata: dataType ');
			assert.deepEqual(first.name, oExpectedProperty.name, 'required metadata: name');
			assert.deepEqual(first["aggregation-role"], oExpectedProperty["aggregation-role"], 'required metadata: aggregation-role');
			var second = metadata.getAttributes("P_FirstParameter");
			assert.deepEqual(second.dataType, oExpectedParameter.dataType, 'required metadata: dataType ');
			assert.deepEqual(second.name, oExpectedParameter.name, 'required metadata: name');
			assert.deepEqual(second["aggregation-role"], oExpectedParameter["aggregation-role"], 'required metadata: aggregation-role');
			assert.deepEqual(second.nullable, oExpectedParameter.nullable, 'required metadata: nullable');
			assert.deepEqual(second.parameter, oExpectedParameter.parameter, 'required metadata: parameter');

			done();
		});
	});
	QUnit.test('getParameterEntitySetKeyPropertiesForService()', function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			assert.deepEqual(metadata.getParameterEntitySetKeyPropertiesForService(), [ "P_FirstParameter", "P_SecondParameter" ], 'All parameter entity set key properties received');
			done();
		});
	});
	QUnit.test('getEntityTypes()', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var aExpectedEntityTypes = [
		                            "firstEntityQueryResultsType",
		                            "firstEntityQueryType",
		                            "secondEntityQueryResultsType",
		                            "secondEntityQueryType",
		                            "thirdEntityDirectlyAddressableQueryResultsType",
		                            "fourthEntityWithoutSapSemanticsType"
		                            ];
		this.oMetadata.isInitialized().done(function(metadata){
			assert.deepEqual(metadata.getEntityTypes(), aExpectedEntityTypes, 'All entity types received');
			done();
		});
	});
	QUnit.test('getEntitySets()', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var aExpectedEntitySets = [ "firstEntityQuery", "secondEntityQuery", "thirdEntityDirectlyAddressableQueryResults", "fourthEntityWithoutSapSemantics" ];
		this.oMetadata.isInitialized().done(function(metadata){
			assert.deepEqual(metadata.getEntitySets(), aExpectedEntitySets, 'All entity sets received');
			done();
		});
	});
	QUnit.test('getAllEntitySetsExceptParameterEntitySets()', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var aExpectedEntitySets = [ "firstEntityQueryResults", "secondEntityQueryResults", "thirdEntityDirectlyAddressableQueryResults", "fourthEntityWithoutSapSemantics" ];
		this.oMetadata.isInitialized().done(function(metadata){
			assert.deepEqual(metadata.getAllEntitySetsExceptParameterEntitySets(), aExpectedEntitySets, 'All entity sets received');
			done();
		});
	});
	QUnit.test('getEntitySetByEntityType', function(assert){
		assert.expect(1);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			assert.equal(metadata.getEntitySetByEntityType('firstEntityQueryResultsType'), 'firstEntityQueryResults', 'THEN entity set is returned');
			done();
		});
	});
	QUnit.test('getEntityTypeAnnotations()', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var oExpected = {
				"requiresFilter" : "true",
				"requiredProperties" : "SAPClient"
		};
		this.oMetadata.isInitialized().done(function(metadata){
			assert.deepEqual(metadata.getEntityTypeAnnotations("secondEntityQueryResultsType"), oExpected, 'Entity type annotations returned as expected for second entity type');
			oExpected.requiredProperties = "firstProperty";
			assert.deepEqual(metadata.getEntityTypeAnnotations("firstEntityQueryResultsType"), oExpected, 'Entity type annotations returned as expected for first entity type');
			done();
		});
	});
	QUnit.test('WHEN getEntityTypeAnnotations() AND no annotations exists', function(assert){
		assert.expect(1);
		var done = assert.async();
		this.metadataForAnalyticalConfig.isInitialized().done(function(metadata){
			assert.deepEqual(metadata.getEntityTypeAnnotations("AnalyticalConfigurationQueryResults"), {}, "THEN empty object is returned");
			done();
		});
	});
	QUnit.test('getUriComponents(sEntitySet) - Valid use cases', function(assert) {

		assert.expect(4);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			var expected, result;
			expected = {
					entitySet : "thirdEntityDirectlyAddressableQueryResults",
					navigationProperty : ""
			};
			result = metadata.getUriComponents("thirdEntityDirectlyAddressableQuery");
			assert.deepEqual(result, expected, "Not existing <name> is patched to existing <name>Results with no navigation property");
			expected = {
					entitySet : "fourthEntityWithoutSapSemantics",
					navigationProperty : ""
			};
			result = metadata.getUriComponents("fourthEntityWithoutSapSemantics");
			assert.deepEqual(result, expected, "The name for an existing entity set without sap semantics is returned unchanged without navigation property");
			expected = {
					entitySet : "firstEntityQuery",
					navigationProperty : "Results"
			};
			result = metadata.getUriComponents("firstEntityQuery");
			assert.deepEqual(result, expected, "The name for an existing parameter entity set is returned unchanged with the right navigation property");
			expected = {
					entitySet : "secondEntityQuery",
					navigationProperty : "ResultsSecond"
			};
			result = metadata.getUriComponents("secondEntityQueryResults");
			assert.deepEqual(result, expected, "An aggregate entity set is mapped to the corresponding parameter entity set with the right navigation property");
			done();
		});
	});
	QUnit.test('getUriComponents(sEntitySet) - Not resolvable use cases', function(assert) {
		assert.expect(3);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			var expected, result;
			result = metadata.getUriComponents("notExistingEntitySet");
			assert.deepEqual(result, null, "Not existing <name> and <name>Results delivers result 'null' ");
			expected = {
					entitySet : "secondEntityQuery",
					navigationProperty : undefined
			};
			result = metadata.getUriComponents("secondEntityQuery");
			assert.deepEqual(result, expected, "Not unique association from an existing parameter entity set delivers undefined as navigation property");
			expected = {
					entitySet : undefined,
					navigationProperty : undefined
			};
			result = metadata.getUriComponents("firstEntityQueryResults");
			assert.deepEqual(result, expected, "Not unique association to an aggregate entity set delivers entity set and undefined as navigation property");
			done();
		});
	});
	QUnit.test('getFilterablePropertiesAndParameters()', function (assert) {
		assert.expect(1);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			var expected = ["firstProperty", "secondProperty", "P_FirstParameter", "P_SecondParameter"];
			var result = metadata.getFilterablePropertiesAndParameters();
			assert.deepEqual(result, expected, 'Only filterable properties and parameters returned. Criteria is sap:aggregation-role=dimension AND sap:filterable!=false OR parameter');
			done();
		});
	});
	QUnit.module('Metadata for Entity Sets without aggregation semantics', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateGatewayWithEntitySetWithOutAggretation();
			var oInject = {
					instances : {
						messageHandler : this.oIfMessageHandler,
						coreApi : this.coreApi,
						annotationHandler : annotationHandler
					},
					constructors  : {
						Hashtable : sap.apf.utils.Hashtable
					},
					functions : {
						getSapSystem : getSapSystem
					}
			};
			this.metadata = new sap.apf.core.Metadata(oInject, "/cds/ZI_ANA_FLIGHT_CDS");
		},
		afterEach : function() {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('WHEN entity set without semantics of aggregate or parameters is called', function(assert) {
		assert.expect(3);
		var done = assert.async();
		this.metadata.isInitialized().done(function(metadata){
			var entitySets = metadata.getEntitySets();
			var expectedEntitySets = [ "ZI_ANA_Flight" ];
			var expectedProperties = [ "AirlineCode", "FlightConnectionNumber", "FlightDate" ];
			assert.deepEqual(entitySets, expectedEntitySets, "THEN correct entity set is returned");
			assert.deepEqual(metadata.getAllPropertiesOfEntitySet("ZI_ANA_Flight"), expectedProperties, "THEN all properties of special entity set are detected");
			assert.deepEqual(metadata.getAllProperties(), expectedProperties, "THEN all properties of all entity sets are detected");
			done();
		});
	});
	QUnit.module('Metadata  without annotation', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck();
			this.oIfMessageHandler.spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateGenericMetadataWithoutAnnotations();
			this.oInject = {
					instances : {
						messageHandler : this.oIfMessageHandler,
						coreApi : this.coreApi,
						annotationHandler : annotationHandler
					},
					constructors : {
						Hashtable : sap.apf.utils.Hashtable,
						ODataModel : this.ODataModel
					},
					functions : {
						getSapSystem : getSapSystem
					}
			};
			this.oMetadata = new sap.apf.core.Metadata(this.oInject, "/some/path/dummy.xsodata");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('getPropertyMetadata() by property name and entity set', function(assert) {
		assert.expect(4);
		var done = assert.async();
		assert.equal(this.oIfMessageHandler.spyResults.putMessage, undefined, "no Error thrown. ");
		var expected = {
				"aggregation-role" : "dimension",
				"dataType" : {
					"maxLength" : "3",
					"type" : "Edm.String"
				},
				"name" : "firstProperty"
		};

		this.oMetadata.isInitialized().done(function(metadata){
			var result = metadata.getPropertyMetadata("firstEntityQueryResults", "firstProperty");
			assert.deepEqual(result.dataType, expected.dataType, 'required metadata: dataType ');
			assert.deepEqual(result.name, expected.name, 'required metadata: name');
			assert.deepEqual(result["aggregation-role"], expected["aggregation-role"], 'required metadata: aggregation-role');
			done();
		});
	});
	QUnit.test('Get filterable properties', function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			assert.deepEqual(metadata.getFilterableProperties("firstEntityQueryResultsType"), [ "firstProperty" ], 'Filterable properties without annotation expected');
			done();
		});
	});
	QUnit.test('getParameterEntitySetKeyProperties() by entity type', function(assert) {
		assert.expect(11);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			var first = {
					"dataType" : {
						"type" : "Edm.Int32"
					},
					"name" : "P_FirstParameter",
					"nullable" : "false",
					"parameter" : "mandatory",
					isKey : true
			};
			var second = {
					"dataType" : {
						"maxLength" : "5",
						"type" : "Edm.String"
					},
					"name" : "P_SecondParameter",
					"nullable" : "false",
					isKey : true
			};
			var result = metadata.getParameterEntitySetKeyProperties("secondEntityQueryType");
			assert.deepEqual(result[0].dataType, first.dataType, 'required metadata: dataType ');
			assert.deepEqual(result[0].name, first.name, 'required metadata: name');
			assert.deepEqual(result[0]["aggregation-role"], first["aggregation-role"], 'required metadata: aggregation-role');
			assert.deepEqual(result[0].isKey, true, 'required metadata: isKey');
			assert.deepEqual(result[0].parameter, first.parameter, 'required metadata: parameter');
			assert.deepEqual(result[0].nullable, first.nullable, 'required metadata: nullable');

			assert.deepEqual(result[1].dataType, second.dataType, 'required metadata: dataType ');
			assert.deepEqual(result[1].name, second.name, 'required metadata: name');
			assert.deepEqual(result[1]["aggregation-role"], second["aggregation-role"], 'required metadata: aggregation-role');
			assert.deepEqual(result[1].isKey, true, 'required metadata: isKey');
			assert.deepEqual(result[1].nullable, second.nullable, 'required metadata: nullable');
			done();
		});
	});
	QUnit.test('Invalid service puts message with fatal error', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oMetadata = new sap.apf.core.Metadata(this.oInject, "invalidService");
		oMetadata.isInitialized().fail(function(){
			assert.equal(this.oIfMessageHandler.spyResults.putMessage.code, 5018, "Fatal error thrown");
			done();
		}.bind(this));
	});
	QUnit.test('Invalid service from Modeler puts message with technical error', function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.oInject.deactivateFatalError = true;
		var oMetadata = new sap.apf.core.Metadata(this.oInject, "invalidService");
		oMetadata.isInitialized().fail(function(){
			assert.equal(this.oIfMessageHandler.spyResults.putMessage.code, 11013, "Technical error thrown");
			done();
		}.bind(this));
	});
	/*
	QUnit.module('Metadata for gateway service root', {
	beforeEach : function() {

			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();

			var oMessageHandler = this.oIfMessageHandler;
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			this.coreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};

		var oInject = {
				messageHandler : this.oIfMessageHandler,
				coreApi : this.coreApi
				ODataModel : this.ODataModel,
				hashtable : sap.apf.utils.Hashtable
			};
			this.metadata = new sap.apf.core.Metadata(oInject, "/sap/opu/odata/sap/ZJH_4APF_005_SRV"); 

		},
	afterEach : function() {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});

	QUnit.test('Handle Gateway Service', function() {

	    var entitySets = this.metadata.getEntitySets();
		var expectedEntitySets = [ "ZJH_4APF_0053Results"];
	assert.deepEqual(entitySets, expectedEntitySets, "correct entity sets returned");

	});
	 */
	QUnit.module('Metadata for Navigation from Parameter entity set to results set', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateMmMetadata();
			var oInject = {
					instances  : {
						messageHandler : this.oIfMessageHandler,
						coreApi : this.coreApi,
						annotationHandler: annotationHandler
					},
					constructors : {
						Hashtable : sap.apf.utils.Hashtable
					},
					functions : {
						getSapSystem : getSapSystem
					}
			};
			this.oMetadata = new sap.apf.core.Metadata(oInject, "/sap/mm/ZAPF_Q002_SRV");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test("WHEN get entity set is called", function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){

			var entitySets = metadata.getEntitySets();
			var expectedEntitySets = [ "ZAPF_Q002", "D_SUSD_CURR" ];
			assert.deepEqual(entitySets, expectedEntitySets, "THEN entity sets are discovered");
			var uriComponents = metadata.getUriComponents("ZAPF_Q002");
			assert.equal(uriComponents.navigationProperty, "Results", "THEN the navigation property is discovered");
			done();
		});
	});

	QUnit.module('Errorhandling for empty Metadata document', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateEmptyMetadata();
			var oInject = {
					instances : {
						messageHandler : this.oIfMessageHandler,
						coreApi : this.coreApi,
						annotationHandler: annotationHandler
					},
					constructors  : {
						Hashtable : sap.apf.utils.Hashtable
					},
					functions : {
						getSapSystem : getSapSystem
					}
			};
			this.oMetadata = new sap.apf.core.Metadata(oInject, "/sap/empty/empty.xsodata");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test("WHEN get entity set is called", function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			var entitySets = metadata.getEntitySets();
			var expectedEntitySets = [];
			assert.deepEqual(entitySets, expectedEntitySets, "THEN no entity sets are discovered");
			var messageObject = this.oIfMessageHandler.spyResults.putMessage;
			assert.equal(messageObject.code, "5041", "THEN error message was emitted");
			done();
		}.bind(this));
	});
	QUnit.module('Annotation file handling', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
		}
	});
	QUnit.test("Test, whether annotations from annotation handler are taken over", function(assert) {
		var annotationHandler = {
				getAnnotationsForService : function(serviceRoot) {
					return [ "annotation1.xml, annotation2.xml"];
				}
		};

		var OdataModelSpy = function(sAbsolutePathToServiceDocument, parameterSet){

			assert.equal(sAbsolutePathToServiceDocument, "/some/path/to/service/empty.xsodata", "THEN service path is handed over");
			assert.deepEqual(parameterSet.annotationURI, [ "annotation1.xml, annotation2.xml"], "THEN annotations are handed over correctly" );
			assert.equal(parameterSet.json, true, "JSON format is requested");

			this.getODataEntityContainer = function() {
				return undefined;
			};
			this.getServiceMetadata = function() {
				return undefined;
			};
			this.getMetaModel = function(){
				return { 
					loaded : function(){
						return {
							then : function(){}
						};
					}
				};
			};
			this.attachMetadataFailed = function(){};
			this.attachMetadataLoaded = function(func) {
				func();
			};
		};
		var oInject = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler: annotationHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					ODataModel : OdataModelSpy
				},
				functions : {
					getSapSystem : getSapSystem
				}
		};
		var metadata = new sap.apf.core.Metadata(oInject, "/some/path/to/service/empty.xsodata");
		assert.ok(metadata);
	});

	QUnit.module('annotation name mapping', {
		beforeEach : function(assert) {
			var that = this;
			this.propertyObject = {};
			var annotationHandler = {
					getAnnotationsForService : function() {
						return [ "annotationX4711.xml"];
					}
			};
			var metaModel = {
					getODataEntityContainer : function() {
						return {
							entitySet: [
							            { entityType: "sap.hugo", name: "hugoResults" }] // serves initializeEntityTypeOfEntitySetsAndAllEntityTypes()
						};
					},
					getODataEntityType: function () {
						return undefined;
					},
					getODataProperty: function(entityType, sPropertyName) {
						return that.propertyObject;
					},
					loaded : function(){
						return {
							then : function(func){
								func();
							}
						};
					}
		
			};
			var OdataModelStub = function(sAbsolutePathToServiceDocument, parameterSet){
				this.getServiceMetadata = function() {
					return true;
				};
				this.getServiceAnnotations = function () {
					return undefined;
				};
				this.getMetaModel = function() {
					return metaModel;
				};
				this.attachMetadataFailed = function(){};
				this.attachMetadataLoaded = function(func) {
					func();
				};
			};
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			this.oInject = {
					instances : {
						messageHandler : this.oIfMessageHandler,
						coreApi : this.coreApi,
						annotationHandler: annotationHandler
					},
					constructors : {
						Hashtable : sap.apf.utils.Hashtable,
						ODataModel : OdataModelStub
					},
					functions : {
						getSapSystem : getSapSystem
					}
			};
			this.metadata = new sap.apf.core.Metadata(this.oInject, "/some/path/to/service/empty.xsodata");
		}
	});
	QUnit.test("getAttributes() case: plain name", function(assert) {
		this.propertyObject = { mimi: 1};
		this.metadata.isInitialized().done(function(metadata){
			var result = metadata.getAttributes("otto");
			assert.strictEqual(result.mimi, 1, "plain member remains");
		});

	});
	QUnit.test("getAttributes() case: fancy name", function(assert) {
		this.propertyObject = { "sap:": 1};
		this.metadata.isInitialized().done(function(metadata){
			var result = metadata.getAttributes("otto");
			assert.strictEqual(result["sap:"], 1, "fancy member remains");
		});
	});
	QUnit.test("getAttributes() case: name prefix 'sap:'", function(assert) {
		this.propertyObject = { "sap:mimi": 1};
		this.metadata.isInitialized().done(function(metadata){
			var result = metadata.getAttributes("otto");
			assert.strictEqual(result["sap:mimi"], 1, "member not deleted");
			assert.strictEqual(result.mimi, undefined, "not converted");
			assert.strictEqual(result.sap, undefined, "not converted");
		});
	});
	QUnit.test("getAttributes() case: name prefix", function(assert) {
		this.propertyObject = { "namespace.mimi": 123};
		this.metadata.isInitialized().done(function(metadata){
			var result = metadata.getAttributes("otto");
			assert.strictEqual(result["namespace.mimi"], 123, "member not deleted");
			assert.strictEqual(result.mimi, 123, "member created");
		});
	});
	QUnit.test("getAttributes() case: name's first letter uppercase converted to lowercase", function(assert) {
		this.propertyObject = { "Mimi.X": 123};
		this.metadata.isInitialized().done(function(metadata){
			var result = metadata.getAttributes("otto");
			assert.strictEqual(result["Mimi.X"], 123, "member not deleted");
			assert.strictEqual(result.x, 123, "member created");
		});
	});
	QUnit.test("getAttributes() case: ISO first letter not converted to lowercase", function(assert) {
		this.propertyObject = { "Mimi.ISO": 123};
		this.metadata.isInitialized().done(function(metadata){
			var result = metadata.getAttributes("otto");
			assert.strictEqual(result["Mimi.ISO"], 123, "member not deleted");
			assert.strictEqual(result.ISO, 123, "new member but name not converted");
		});
	});
	QUnit.test("getAttributes() case: name value pair", function(assert) {
		this.propertyObject = { "extensions": [ {
			name: "mara",
			value: "bam"
		}]};
		this.metadata.isInitialized().done(function(metadata){
			var result = metadata.getAttributes("otto");
			assert.deepEqual(result.extensions, this.propertyObject.extensions, "member not deleted");
			assert.strictEqual(result.mara, "bam", "member created");
		}.bind(this));
	});
	QUnit.test("getAttributes() case: type", function(assert) {
		this.propertyObject = { type: 1};
		this.metadata.isInitialized().done(function(metadata){
			var result = metadata.getAttributes("otto");
			assert.strictEqual(result.type, 1, "member not deleted");
			assert.strictEqual(result.dataType.type, 1, "goes to sub-object dataType");
		});
	});
	QUnit.test("getAttributes() case: maxLength", function(assert) {
		this.propertyObject = { maxLength: 1};
		this.metadata.isInitialized().done(function(metadata){
			var result = metadata.getAttributes("otto");
			assert.strictEqual(result.maxLength, 1, "member not deleted");
			assert.strictEqual(result.dataType.maxLength, 1, "goes to sub-object dataType");
		});
	});
	QUnit.test("getAttributes() case: precision", function(assert) {
		this.propertyObject = { precision: 1};
		this.metadata.isInitialized().done(function(metadata){
			var result = metadata.getAttributes("otto");
			assert.strictEqual(result.precision, 1, "member not deleted");
			assert.strictEqual(result.dataType.precision, 1, "goes to sub-object dataType");
		});
	});

	QUnit.module('Hierarchy Service', {
		beforeEach : function(assert) {
			var done = assert.async();
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.messageHandler.doubleCheckAndMessaging();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateHierarchyMetadata();
			this.oInject = {
					instances : {
						messageHandler : this.messageHandler,
						coreApi : this.coreApi,
						annotationHandler : annotationHandler
					},
					constructors : {
						Hashtable : sap.apf.utils.Hashtable
					},
					functions : {
						getSapSystem : getSapSystem
					}
			};
			this.oMetadata = new sap.apf.core.Metadata(this.oInject, "/some/path/hierarchy.xsodata");
			this.oMetadata.isInitialized().done(function(){
				done();
			});
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('getHierarchyAnnotationsForProperty()', function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			var result = metadata.getHierarchyAnnotationsForProperty("HierarchySet", "HierarchyProperty");
			var expected = {
					hierarchyLevelFor: "HierarchyProperty_Level",
					hierarchyParentNodeFor: "HierarchyProperty_ParentID",
					hierarchyNodeFor: "HierarchyProperty_NodeID",
					hierarchyDrillStateFor: "HierarchyProperty_Drillstate",
					hierarchyNodeExternalKeyFor: "HierarchyProperty_NodeIDExt"
			};
			assert.deepEqual(result, expected, 'Correct hierarchy annotations received');
			done();
		});
	});
	QUnit.test('getHierarchyAnnotationsForProperty() with non existing entitySet', function(assert) {
		assert.expect(4);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			var result = metadata.getHierarchyAnnotationsForProperty("HierarchySet1", "HierarchyProperty");
			assert.ok(result instanceof sap.apf.core.MessageObject, "MessageObject returned");
			assert.strictEqual(result.getCode(), 5072, "Correct MessageCode in returned MessageObject");
			assert.strictEqual(result.getParameters()[0], "HierarchySet1", "EntitySet handed over to MessageObject");
			assert.strictEqual(result.getParameters()[1], "/some/path/hierarchy.xsodata", "Service handed over to MessageObject");
			done();
		});
	});
	QUnit.test('getHierarchyAnnotationsForProperty() if property is not a hierarchy property', function(assert) {
		assert.expect(5);
		var done = assert.async();
		this.oMetadata.isInitialized().done(function(metadata){
			var result = metadata.getHierarchyAnnotationsForProperty("HierarchySet", "Property1");
			assert.ok(result instanceof sap.apf.core.MessageObject, "MessageObject returned");
			assert.strictEqual(result.getCode(), 5073, "Correct MessageCode in returned MessageObject");
			assert.strictEqual(result.getParameters()[0], "HierarchySet", "EntitySet handed over to MessageObject");
			assert.strictEqual(result.getParameters()[1], "/some/path/hierarchy.xsodata", "Service handed over to MessageObject");
			assert.strictEqual(result.getParameters()[2], "Property1", "Property handed over to MessageObject");
			done();
		});
	});
	QUnit.test('getHierarchicalEntitySets()', function(assert) {
		assert.expect(2);
		var result = this.oMetadata.getHierarchicalEntitySets();
		assert.strictEqual(result.length, 1, "One hierarchical EntitySet found");
		assert.strictEqual(result[0], "HierarchySet", "Correct hirarchical EntitySet returned");
	});
	QUnit.test('getHierarchicalEntitySets() with non-hierarchical service', function(assert) {
		assert.expect(1);
		var done = assert.async();
		sap.apf.testhelper.mockServer.activateGenericMetadata();
		var oMetadata = new sap.apf.core.Metadata(this.oInject, "/some/path/dummy.xsodata");
		oMetadata.isInitialized().done(function(metadata){
			var result = metadata.getHierarchicalEntitySets();
			assert.strictEqual(result.length, 0, "No hierarchical EntitySet found");
			done();
		});
	});
	QUnit.test('getHierarchicalEntitySets() with broken hierarchical service', function(assert) {
		assert.expect(1);
		var done = assert.async();
		sap.apf.testhelper.mockServer.activateBrokenHierarchyMetadata();
		var oMetadata = new sap.apf.core.Metadata(this.oInject, "/some/path/brokenHierarchy.xsodata");
		oMetadata.isInitialized().done(function(metadata){
			var result = metadata.getHierarchicalEntitySets();
			assert.strictEqual(result.length, 0, "No hierarchical EntitySet found");
			done();
		});
	});
	QUnit.test('getHierarchicalPropertiesOfEntitySet()', function(assert) {
		assert.expect(2);
		var result = this.oMetadata.getHierarchicalPropertiesOfEntitySet("HierarchySet");
		assert.strictEqual(result.length, 1, "One hierarchical property found");
		assert.strictEqual(result[0], "HierarchyProperty", "Correct hirarchical property returned");
	});
	QUnit.test('getHierarchicalPropertiesOfEntitySet() with wrong entitySet', function(assert) {
		assert.expect(1);
		var result = this.oMetadata.getHierarchicalPropertiesOfEntitySet("wrongHierarchySet");
		assert.strictEqual(result.length, 0, "No hierarchical property found");
	});
	QUnit.test('getHierarchicalPropertiesOfEntitySet() with non-hierarchical service', function(assert) {
		assert.expect(1);
		var done = assert.async();
		sap.apf.testhelper.mockServer.activateGenericMetadata();
		var oMetadata = new sap.apf.core.Metadata(this.oInject, "/some/path/dummy.xsodata");
		oMetadata.isInitialized().done(function(metadata){
			var result = metadata.getHierarchicalPropertiesOfEntitySet("firstEntityQuery");
			assert.strictEqual(result.length, 0, "No hierarchical Property found");
			done();
		});
	});
	QUnit.test('getHierarchicalPropertiesOfEntitySet() with broken hierarchical service', function(assert) {
		assert.expect(1);
		var done = assert.async();
		sap.apf.testhelper.mockServer.activateBrokenHierarchyMetadata();
		var oMetadata = new sap.apf.core.Metadata(this.oInject, "/some/path/brokenHierarchy.xsodata");
		oMetadata.isInitialized().done(function(metadata){
			var result = metadata.getHierarchicalPropertiesOfEntitySet("HierarchySet");
			assert.strictEqual(result.length, 0, "No hierarchical EntitySet found");
			done();
		});
	});
	QUnit.test('getNonHierarchicalPropertiesOfEntitySet()', function(assert) {
		var result = this.oMetadata.getNonHierarchicalPropertiesOfEntitySet("HierarchySet");
		assert.strictEqual(result.length, 38, "38 non hierarchical properties found");
		assert.strictEqual(result[0], "ID", "Correct first non hirarchical property returned");
	});
	QUnit.test('getNonHierarchicalPropertiesOfEntitySet() with wrong entitySet', function(assert) {
		var result = this.oMetadata.getNonHierarchicalPropertiesOfEntitySet("wrongHierarchySet");
		assert.strictEqual(result.length, 0, "No non hierarchical property found");
	});
	QUnit.module('Metadata for Entity Sets with unexpected entity set name', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateUnexpectedEntitySetName();
			this.oInject = {
					instances : {
						messageHandler : this.oIfMessageHandler,
						coreApi : this.coreApi,
						annotationHandler : annotationHandler
					},
					constructors  : {
						Hashtable : sap.apf.utils.Hashtable
					},
					functions : {
						getSapSystem : getSapSystem
					}
			};
		},
		afterEach : function() {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('get properties of entity set with type in its name', function(assert) {
		assert.expect(1);
		var done = assert.async();

		var oMetadata = new sap.apf.core.Metadata(this.oInject, "/unexpected/unexpectedEntitysetName.xsodata");
		oMetadata.isInitialized().done(function(metadata){
			
			var result = metadata.getAllPropertiesOfEntitySet("EntitySetType");
			var expectedTypes = ["ID", "EntitySetTypeProp1", "EntitySetTypeProp2", "EntitySetTypeProp2_T"];
			assert.deepEqual(result, expectedTypes, "THEN correct properties are found");
			done();
		});
	});
	QUnit.module('handling the sap system parameter', {
		beforeEach : function(assert) {
			var that = this;
			var OdataModelStub = function(serviceRoot, parameterSet){
				assert.equal(serviceRoot, that.expectedServiceRoot, "service root as expected");
				
				this.getODataEntityContainer = function() {
					return undefined;
				};
				this.getServiceMetadata = function() {
					return undefined;
				};
				this.getMetaModel = function(){
					return { 
						loaded : function(){
							return {
								then : function(){}
							};
						}
					};
				};
				this.attachMetadataFailed = function(){};
				this.attachMetadataLoaded = function(func) {
					func();
				};
			};
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var AnnotationHandler = function() {
			
				this.getAnnotationsForService = function(service, sapSystem, doNotOverwriteOrigin) {
					return [];
				};
			};
			var annotationHandler = new AnnotationHandler();
			
			var getSapSystemFromContext = function() { return that.sapSystem; };
		
			this.oInject = {
					instances : {
						messageHandler : this.oIfMessageHandler,
						coreApi : this.coreApi,
						annotationHandler: annotationHandler
					},
					constructors : {
						Hashtable : sap.apf.utils.Hashtable,
						ODataModel : OdataModelStub
					},
					functions : {
						getSapSystem : getSapSystemFromContext
					}
			};
		}
	});
	QUnit.test("WHEN sap-system is defined", function(assert){
		assert.expect(1);
		this.expectedServiceRoot = "/some/path/to/service/empty.xsodata;o=myERP";
		this.expectedSapSystem = "myERP";

		this.sapSystem = "myERP";
		this.metadata = new sap.apf.core.Metadata(this.oInject, "/some/path/to/service/empty.xsodata");
	});
	QUnit.test("WHEN sap-system is not defined", function(assert){
		assert.expect(1);
		this.expectedServiceRoot = "/some/path/to/service/empty.xsodata";
		this.sapSystem = undefined;	
		this.expectedServiceForAnnotations = "/some/path/to/service/empty.xsodata";
		this.expectedSapSystem = undefined;
		
		
		this.metadata = new sap.apf.core.Metadata(this.oInject, "/some/path/to/service/empty.xsodata");
	});
	

}());