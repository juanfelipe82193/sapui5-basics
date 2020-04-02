sap.ui.define('sap.apf.integration.tSerializationMediator', [
	'sap/apf/core/persistence',
	'sap/apf/core/instance',
	'sap/apf/core/messageHandler',
	'sap/apf/core/utils/filter',
	'sap/apf/utils/startFilterHandler',
	'sap/apf/utils/filterIdHandler',
	'sap/apf/utils/startParameter',
	'sap/apf/utils/serializationMediator',
	'sap/ui/thirdparty/sinon'
], function(Persistence, Instance, MessageHandler, Filter,
			StartFilterHandler, FilterIdHandler, StartParameter, SerializationMediator,
			sinon) {
	'use strict';
	QUnit.module('Serialization Mediator', {
		beforeEach : function(assert) {
			sinon.stub(Persistence, "constructor", function(){
				this.createPath = function(sName, fnCallback, oExternalObject) {
					fnCallback(sName, fnCallback, oExternalObject);
				};
				this.modifyPath = function(sPathId, sName, fnCallback, oExternalObject) {
					fnCallback(sPathId, sName, fnCallback, oExternalObject);
				};
				this.openPath = function(sPathId, fnCallback) {
					assert.equal(sPathId, 'myPathId', 'PathID successfully forwarded to sap.apf.core.Persistence.openPath()');
					assert.ok(typeof fnCallback === 'function', 'Callback function successfully forwarded to sap.apf.core.Persistence.openPath()');
					var oResponse = {};
					oResponse.data = {};
					oResponse.data.SerializedAnalysisPath = {};
					oResponse.data.SerializedAnalysisPath.filterIdHandler = {
							fih : 'fih'
					};
					oResponse.data.SerializedAnalysisPath.startFilterHandler = {
							sfh : 'sfh'
					};
					oResponse.data.SerializedAnalysisPath.path = {
						indicesOfActiveSteps: [],
						steps: []
					};
					oResponse.data.SerializedAnalysisPath.smartFilterBar = undefined;
					fnCallback({
						path : oResponse.data,
						status : 'successful'
					}, 'metadata', 'messageObjectForUi');
				};
			});
			var oMessageHandler = new MessageHandler();
			var oCoreApi = new Instance.constructor({
				instances: {
					messageHandler : oMessageHandler,
					startParameter : new StartParameter()
				},
				constructors : {
					ResourcePathHandler  : function(){
						this.getConfigurationProperties = function(){
							return jQuery.Deferred().resolve();
						};
					}
				}
			});
			var oFilterIdHandler = new FilterIdHandler({
				functions : {
					setRestrictionByProperty : function() {
					},
					getRestrictionByProperty : function() {
					}
				},
				instances : {
					messageHandler : oCoreApi.getMessageHandler()
				}
			});
			this.oFilterIdHandlerStub = sinon.stub(oFilterIdHandler, 'deserialize', function(deserializableData) {
				assert.deepEqual(deserializableData, {
					fih : 'fih'
				}, 'Deserializable application specifi path filters are forwarded to FilterIdHandler');
			});
			var oStartFilterHandler = new StartFilterHandler({
				instances : {
					messageHandler : oMessageHandler,
					onBeforeApfStartupPromise: jQuery.Deferred().resolve()
				},
				functions : {
					getReducedCombinedContext : function() {
						return jQuery.Deferred().resolve(new Filter(oMessageHandler));
					}, 
					getFacetFilterConfigurations : function() {
						return [];
					}
				}
			});
			this.oStartFilterHandlerStub = sinon.stub(oStartFilterHandler, 'deserialize', function(deserializableData) {
				assert.deepEqual(deserializableData, {
					sfh : 'sfh'
				}, 'Deserializable start filter handler is forwarded to StartFilterHandler');
				return jQuery.Deferred().resolve();
			});
			this.oSerializationMediator = new sap.apf.utils.SerializationMediator({
				instances : {
					coreApi : oCoreApi,
					filterIdHandler : oFilterIdHandler,
					startFilterHandler : oStartFilterHandler, 
					messageHandler : oMessageHandler
				}
			});
			this.expectedExternalObject = {
					filterIdHandler : {},
					startFilterHandler : {
						restrictionsSetByApplication : {},
						startFilters : []
					},
					path : {
						indicesOfActiveSteps: [],
						steps: []
					},
					smartFilterBar: undefined
			};
		},
		afterEach : function() {
			Persistence.constructor.restore();
			this.oFilterIdHandlerStub.restore();
		}
	});
	QUnit.test('Persistence method createPath() receives all parameters from SerializationMediator savePath()', function(assert) {
		assert.expect(3);
		var callbackCreate = function(sName, fnCallback, oExternalObject) {
			assert.equal(sName, 'myPath', 'First parameter is path name');
			assert.ok(typeof fnCallback === 'function', 'Second parameter is callback function');
			assert.deepEqual(oExternalObject, this.expectedExternalObject, 'Third parameter is non-core object');
		}.bind(this);
		this.oSerializationMediator.savePath('myPath', callbackCreate);
	});
	QUnit.test('Persistence method modifyPath() receives all parameters from SerializationMediator savePath()', function(assert) {
		assert.expect(4);
		var callbackModify = function(sPathId, sName, fnCallback, oExternalObject) {
			assert.equal(sPathId, 'myPathId', 'First parameter is path id');
			assert.equal(sName, 'myPath', 'Second parameter is path name');
			assert.ok(typeof fnCallback === 'function', 'Third parameter is callback function');
			assert.deepEqual(oExternalObject, this.expectedExternalObject, 'Fourth parameter is non-core object');
		}.bind(this);
		this.oSerializationMediator.savePath('myPathId', 'myPath', callbackModify);
	});
	QUnit.test('Persistence method openPath() receives all parameters from SerializationMediator openPath()', function(assert) {
		assert.expect(6);
		var callbackOpen = function(oResponse, metadata) {
			assert.deepEqual(oResponse, {}, 'First callback parameter is correct and property filterIdHandler was removed from serialized analysis path');
			assert.equal(metadata, 'metadata', 'Second callback parameter contains metadata');
		};
		this.oSerializationMediator.openPath('myPathId', callbackOpen, 0);
	});
});