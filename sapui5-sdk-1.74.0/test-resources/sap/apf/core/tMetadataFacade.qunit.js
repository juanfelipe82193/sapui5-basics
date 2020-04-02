jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfCoreApi");
jQuery.sap.require("sap.apf.testhelper.doubles.messageHandler");
jQuery.sap.require("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.core.metadataFacade");
jQuery.sap.require("sap.apf.core.metadataProperty");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.testhelper.mockServer.wrapper");
jQuery.sap.require("sap.apf.core.utils.fileExists");
jQuery.sap.require("sap.apf.testhelper.createDefaultAnnotationHandler");
/* globals OData */
(function() {
	'use strict';
	QUnit.module('MetadataFacade with core api, message handler and annotation double', {
		beforeEach : function(assert) {
			var that = this;
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			this.getServiceMetadataCalls = 0;
			sap.apf.testhelper.mockServer.activateGenericMetadata();
			sap.apf.testhelper.mockServer.activateApf();
			var oInjectMetadata = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler : annotationHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					ODataModel : this.ODataModel
				},
				functions: {
					getSapSystem : function() { return undefined; }
				}
			};
			var MetadataFactory = function() {
				var oMetadataInstances = new sap.apf.utils.Hashtable(that.oIfMessageHandler);
				var aServiceDocuments = [];
				this.getMetadata = function(pathToServiceDocument) {
					if (oMetadataInstances.hasItem(pathToServiceDocument) === false) {
						oMetadataInstances.setItem(pathToServiceDocument, {
							metadataPromise : new sap.apf.core.Metadata(oInjectMetadata, pathToServiceDocument).isInitialized()
						});
					}
					return oMetadataInstances.getItem(pathToServiceDocument).metadataPromise;
				};
				this.getServiceDocuments = function() {
					return aServiceDocuments;
				};
				this.setServiceDocuments = function(serviceDocuments) {
					aServiceDocuments = serviceDocuments;
				};
			};
			var oMetadataFactory = new MetadataFactory();
			oMetadataFactory.setServiceDocuments([ "/some/path/dummy.xsodata" ]);
			var oInjectMetadataFacade = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					metadataFactory : oMetadataFactory
				},
				constructors : {
					MetadataProperty : sap.apf.core.MetadataProperty
				}
			};
			this.metadataFacade = new sap.apf.core.MetadataFacade(oInjectMetadataFacade);
			var oMetadataFactoryWithTwoServiceDocuments = new MetadataFactory();
			oMetadataFactoryWithTwoServiceDocuments.setServiceDocuments([ "/some/path/dummy.xsodata", "/sap/hba/r/apf/core/odata/apf.xsodata" ]);
			var oInjectMetadataFacadeWithTwoServiceDocuments = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					metadataFactory : oMetadataFactoryWithTwoServiceDocuments
				},
				constructors : {
					MetadataProperty : sap.apf.core.MetadataProperty
				}
			};
			this.metadataFacadeWithTwoServiceDocuments = new sap.apf.core.MetadataFacade(oInjectMetadataFacadeWithTwoServiceDocuments);
			this.metadataFacadeWithServiceDocParam = new sap.apf.core.MetadataFacade(oInjectMetadataFacadeWithTwoServiceDocuments, "/sap/hba/r/apf/core/odata/apf.xsodata");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('Get all properties', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var expectedResult = [ 'GenID', 'firstProperty', 'secondProperty', 'nonFilterableProperty', 'P_FirstParameter', 'P_SecondParameter', 'PropertyOneForThird', 'PropertyTwoForThird', 'PropertyOneForFourth', 'PropertyTwoForFourth' ];
		this.metadataFacade.getAllProperties(callback);
		function callback(allProperties) {
			assert.deepEqual(allProperties, expectedResult, 'All properties for all entity types of one service document returned');
			done();
		}
	});
	QUnit.test('Get property returns correct property with attributes as MetadataProperty object', function(assert) {
		assert.expect(4);
		var done = assert.async();
		this.metadataFacade.getProperty('firstProperty').done(function(property) {
			assert.equal(property.getAttribute('name'), 'firstProperty', 'Correct value for attribute name returned');
			assert.equal(property.getAttribute('aggregation-role'), 'dimension', 'Correct value for attribute aggregation-role returned');
			assert.equal(property.getAttribute('type'), 'Edm.String', 'Correct value for attribute type returned');
			assert.equal(property.getAttribute('maxLength'), '3', 'Correct value for attribute maxLength returned');
			done();
		});
	});
	QUnit.test('Get property annotation', function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.metadataFacade.getProperty('P_SecondParameter').done(function(property) {
			assert.equal(property.getAttribute('name'), 'P_SecondParameter', 'Correct value for attribute name returned');
			assert.equal(property.getAttribute('defaultValue'), 'secondParamDefaultValue', 'Correct annotation attribute returned');
			done();
		});
	});
	QUnit.test('Check property for isParameterEntitySetKeyProperty()', function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.metadataFacade.getProperty('P_FirstParameter').done(function(property) {
			assert.ok(property.isParameterEntitySetKeyProperty() === true, 'isParameterEntitySetKeyProperty() returns true for a parameter key property');
		});
		this.metadataFacade.getProperty('firstProperty').done(function(property) {
			assert.ok(property.isParameterEntitySetKeyProperty() === false, 'isParameterEntitySetKeyProperty() returns false for a non parameter key property');
			done();
		});
	});
	QUnit.test('Check property for isKey()', function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.metadataFacade.getProperty('GenID').done(function(property) {
			assert.ok(property.isKey() === true, 'isKey() returns true for a key property');
		});
		this.metadataFacade.getProperty('firstProperty').done(function(property) {
			assert.ok(property.isKey() === false, 'isKey() returns false for a non-key property');
			done();
		});
	});
	QUnit.test('Get property from metadata facade with more than one service document', function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.metadataFacadeWithTwoServiceDocuments.getProperty('firstProperty').done(function(property) {
			assert.ok(property.getAttribute('name') === 'firstProperty', 'Property from first service document returnend');
		});
		this.metadataFacadeWithTwoServiceDocuments.getProperty('AnalysisPath').done(function(property) {
			assert.ok(property.getAttribute('name') === 'AnalysisPath', 'Property from second service document returnend');
			done();
		});
	});
	QUnit.test('Create metadata facade instance with parameter for one service document', function(assert) {
		assert.expect(1);
		var done = assert.async();
		//Here a metadata facade is used, which has access to two different service documents, but is instantiated with a param for one service document
		this.metadataFacadeWithServiceDocParam.getAllProperties(callback);
		function callback(aPropertyNames) {
			assert.deepEqual(aPropertyNames, [ 'SerializedAnalysisPath', 'StructuredAnalysisPath', 'GenID', 'AnalysisPath', 'AnalysisPathName', 'LogicalSystem', 'ApplicationConfigurationURL', 'NumberOfAnalysisPaths', 'AnalyticalConfiguration',
					'AnalyticalConfigurationName', 'CreationUTCDateTime', 'CreatedByUser', 'LastChangedByUser', 'SerializedAnalyticalConfiguration', 'TextElement', 'Language', 'TextElementType', 'TextElementDescription', 'Application',
					'MaximumLength', 'TranslationHint', 'LastChangeUTCDateTime' ], 'Only property names for the specified service document expected');
			done();
		}
	});
	QUnit.test('getPropertyMetadataByEntitySet', function(assert){
		assert.expect(3);
		var done = assert.async();
		this.metadataFacade.getPropertyMetadataByEntitySet("/some/path/dummy.xsodata", "firstEntityQueryResults", "firstProperty").done(function(property) {
			//entry in metadata is "Type="Edm.String" MaxLength="3" sap:aggregation-role="dimension"
			assert.strictEqual(property.getAttribute("type"), "Edm.String", "THEN type info correct");
			assert.strictEqual(property.getAttribute("maxLength"), "3", "THEN length info correct");
			assert.strictEqual(property.getAttribute("aggregation-role"), "dimension", "THEN dimension info correct");
			done();
		});
	});
	QUnit.module('MetadataFacade with core api, message handler, metadata double and two service documents', {
		beforeEach : function(assert) {
			var that = this;
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var Metadata = function(pathToServiceDocument) {
				this.isInitialized = function() {
					var deferred = jQuery.Deferred();
					if (pathToServiceDocument === 'second.xsodata') {
						setTimeout(function() {
							deferred.resolve(this);
						}.bind(this), 1);
					} else {
						deferred.resolve(this);
					}
					return deferred;
				};
				this.getAllProperties = function() {
					if (pathToServiceDocument === 'second.xsodata') {
						return [ 'second' ];
					}
					return [ 'first' ];
				};
				this.getParameterEntitySetKeyPropertiesForService = function() {
					if (pathToServiceDocument === 'second.xsodata') {
						return [ 'P_second' ];
					}
					return [ 'P_first' ];
				};
			};
			var MetadataFactory = function() {
				var oMetadataInstances = new sap.apf.utils.Hashtable(that.oIfMessageHandler);
				var aServiceDocuments = [];
				this.getMetadata = function(pathToServiceDocument) {
					if (oMetadataInstances.hasItem(pathToServiceDocument) === false) {
						oMetadataInstances.setItem(pathToServiceDocument, {
							metadataPromise : new Metadata(pathToServiceDocument).isInitialized()
						});
					}
					return oMetadataInstances.getItem(pathToServiceDocument).metadataPromise;
				};
				this.getServiceDocuments = function() {
					return aServiceDocuments;
				};
				this.setServiceDocuments = function(serviceDocuments) {
					aServiceDocuments = serviceDocuments;
				};
			};
			var oMetadataFactory = new MetadataFactory();
			oMetadataFactory.setServiceDocuments([ 'first.xsodata', 'second.xsodata' ]);
			var oInjectMetadataFacade = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					metadataFactory : oMetadataFactory
				},
				constructors : {
					MetadataProperty : sap.apf.core.MetadataProperty
				}
			};
			this.metadataFacade = new sap.apf.core.MetadataFacade(oInjectMetadataFacade);
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('Get all properties', function(assert) {
		var done = assert.async();
		var count = 0;
		this.metadataFacade.getAllProperties(callback);
		this.metadataFacade.getAllProperties(callback);
		function callback(allProperties) {
			count++;
			assert.deepEqual(allProperties, [ 'first', 'second' ], 'All properties for all entity types of both service documents returned in call ' + count);
			if (count === 2) {
				done();
			}
		}
	});
	QUnit.test('Get all parameter entityset key properties', function(assert) {
		var done = assert.async();
		var count = 0;
		this.metadataFacade.getAllParameterEntitySetKeyProperties(callback);
		this.metadataFacade.getAllParameterEntitySetKeyProperties(callback);
		function callback(allProperties) {
			count++;
			assert.deepEqual(allProperties, [ 'P_first', 'P_second' ], 'All parameter entity set key properties of both service documents returned in call ' + count);
			if (count === 2) {
				done();
			}
		}
	});
}());