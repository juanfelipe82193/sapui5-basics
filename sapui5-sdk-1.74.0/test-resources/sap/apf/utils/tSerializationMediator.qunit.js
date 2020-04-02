sap.ui.define("sap/apf/utils/tSerializationMediator", [
	"sap/apf/utils/serializationMediator",
	"sap/apf/core/messageHandler",
	"sap/apf/core/messageObject"
], function(SerializationMediator, MessageHandler, MessageObject){
	'use strict';
	function commonSetup(testEnv, assert){
		var filterIdHandler = {
				serialize : function() {
					return {
						fih : 'fih'
					};
				},
				deserialize : function(deserializableData) {
					if(testEnv.assertInStubbedMethods){
						assert.deepEqual(deserializableData, {
							fih : 'fih'
						}, 'Deserializable application specific path filter is forwarded to FilterIdHandler');
					}
				}
		};
		var startFilterHandler = {
			serialize : function(isTransient, keepInitialStartFilterValues) {
				var deferred = jQuery.Deferred();
				setTimeout(function(){
					testEnv.serialzeSFHcalledForLastGoodApfState = keepInitialStartFilterValues;
					deferred.resolve({
						sfh : 'sfh'
					});
				}, 1);
				return deferred;
			},
			deserialize : function(deserializableData) {
				if(testEnv.assertInStubbedMethods){
					assert.deepEqual(deserializableData, {
						sfh : 'sfh'
					}, 'Deserializable startFilterHandler is forwarded to StartFilterHandler');
				}
				return jQuery.Deferred().resolve();
			}, 
			getStartFilters : function(){
				var deferred = jQuery.Deferred();
				setTimeout(function(){
					deferred.resolve();
				}, 1);
				return deferred;
			}
		};
		testEnv.messageHandler = new MessageHandler(true);
		testEnv.messageHandler.activateOnErrorHandling(true);

		testEnv.coreApi = {
				serialize : function(){
					return {
						path : {
							path : 'path'
						}, 
						smartFilterBar : {
							sfb : 'sfb'
						}
					};
				}, 
				deserialize : function(serializableCore){
					if(testEnv.assertInStubbedMethods){
						assert.deepEqual(serializableCore, {path : {path : 'path'}, smartFilterBar : {sfb : 'sfb'}}, 'Path and SmartFilterBar correctly deserialized');
					}
				},
				isDirty : function(){
					return true;
				}, 
				getPathName : function(){
					return "APF Path";
				}, 
				savePath : function(arg1, arg2, arg3, arg4) {
					if (typeof arg1 === 'string' && typeof arg2 === 'string' && typeof arg3 === 'function') {
						arg3(arg1, arg2, arg3, arg4);
					} else if (typeof arg1 === 'string' && typeof arg2 === 'function') {
						arg2(arg1, arg2, arg3);
					}
				},
				openPath : function(pathId, callback) {
					var response;
					if(testEnv.assertInStubbedMethods){
						assert.equal(pathId, 'myPathId', 'PathID successfully forwarded to coreApi.openPath()');
						assert.ok(typeof callback === 'function', 'Callback function successfully forwarded to coreApi.openPath()');
					}
					response = {};
					response.data = {};
					response.data.SerializedAnalysisPath = { 
						path : {
							path :'path', 
							indicesOfActiveSteps : [0]
						},
						smartFilterBar : {
							sfb :'sfb'
						},
						filterIdHandler : {
							fih : 'fih'
						},
						startFilterHandler : {
							sfh : 'sfh'
						}
					};
					callback({
						path : response.data,
						status : 'successful'
					}, 'metadata');
				},
				deletePath : function(sPathId, fnCallback) {
					fnCallback(sPathId, fnCallback);
				}, 
				resetPath : function(){},
				getApplicationConfigProperties : function(){
					return jQuery.Deferred().resolve();
				}
		};
		testEnv.serializationMediator = new SerializationMediator({
			instances: {
				coreApi : testEnv.coreApi,
				filterIdHandler : filterIdHandler,
				startFilterHandler : startFilterHandler,
				messageHandler : testEnv.messageHandler
			}
		});
	}
	
	QUnit.module('Path persistence', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
			this.assertInStubbedMethods = true;
			this.expectedSerializableApfState = {
					startFilterHandler : {
						sfh : 'sfh'
					}, 
					filterIdHandler : {
						fih : 'fih'
					}, 
					path : {
						path : 'path'
					}, 
					smartFilterBar : {
						sfb : 'sfb'
					}
			};
		}
	});
	QUnit.test('savePath() for create routes to coreApi.savePath() containing serializable APF state', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var callbackCreate = function(arg1, arg2, arg3) {
			assert.equal(arg1, 'myPath', 'Path name successfully forwarded to coreApi.savePath()');
			assert.ok(typeof arg2 === 'function', 'Callback function successfully forwarded to coreApi.savePath()');
			assert.deepEqual(arg3, this.expectedSerializableApfState, 'Serializable APF State successfully forwarded to coreApi.savePath()');
			done();
		}.bind(this);
		this.serializationMediator.savePath('myPath', callbackCreate);
	});
	QUnit.test('savePath() for update routes to coreApi.savePath() containing serializable APF state', function(assert) {
		assert.expect(4);
		var done = assert.async();
		var callbackUpdate = function(arg1, arg2, arg3, arg4) {
			assert.equal(arg1, 'myPathId', 'PathID successfully forwarded to coreApi.savePath()');
			assert.equal(arg2, 'myPath', 'Path name successfully forwarded to coreApi.savePath()');
			assert.ok(typeof arg3 === 'function', 'Callback function successfully forwarded to coreApi.savePath()');
			assert.deepEqual(arg4, this.expectedSerializableApfState, 'Serializable APF State successfully forwarded to coreApi.savePath()');
			done();
		}.bind(this);
		this.serializationMediator.savePath('myPathId', 'myPath', callbackUpdate);
	});
	QUnit.test('openPath() uses central deserialize()', function(assert) {
		assert.expect(4);
		var wasCalled = false;
		this.serializationMediator.deserialize = function(serializedAnalysisPath, indexOfActiveStep) {
			wasCalled = true;
			assert.strictEqual(indexOfActiveStep, 1, 'Index of active step passed to deserialization method');
			return jQuery.Deferred().resolve();
		};
		this.serializationMediator.openPath('myPathId', function() {}, 1);
		assert.ok(wasCalled, 'Open uses own deserialization');
	});
	QUnit.test('deletePath() routes to deletePath() in coreApi', function(assert) {
		assert.expect(2);
		var callbackDelete = function(sPathId, fnCallback) {
			assert.equal(sPathId, 'myPathId', 'PathID successfully forwarded to coreApi.deletePath()');
			assert.ok(typeof fnCallback === 'function', 'Callback function successfully forwarded to coreApi.deletePath()');
		};
		this.serializationMediator.deletePath('myPathId', callbackDelete);
	});
	QUnit.module('Error handling during open path', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
			this.assertInStubbedMethods = false;
			var apfMessageDefinitions = [{
											code : "5210",
											severity : "fatal",
											description : "Error during opening of analysis path; see log.",
											key : "5210"
										}, {
											code : "5050",
											severity : "error",
											description : "Dummy message for test: No configuration for step found.",
											key : "5050"
										}, {
											code : "5301",
											severity : "warning",
											description : "Dummy message for test: Add or update path filter API method called with unsupported filter.",
											key : "5301"
										}];
			
			this.messageHandler.loadConfig(apfMessageDefinitions, true);
			this.putMessageSpy = sinon.spy(this.messageHandler, 'putMessage');
		}, 
		afterEach : function(assert){
			this.putMessageSpy.restore();
		}
	});
	QUnit.test('Put message with severity "error" during deserialization', function(assert) {
		assert.expect(3);
		this.coreApi.deserialize = function(oDeserializablePath) {
				this.messageHandler.putMessage(new MessageObject({code : "5050"} ));
		}.bind(this);
		
		assert.throws(function() {
			this.serializationMediator.openPath("myPathId", callbackOpen);
		}.bind(this), /APFapf1972/, "The right APF fatal thrown");
		assert.equal(this.putMessageSpy.getCall(0).args[0].getCode(), '5050', 'Put error message during core deserialization');
		assert.equal(this.putMessageSpy.getCall(1).args[0].getCode(), '5210', 'Put fatal message in open path');
		
		function callbackOpen(response, metadata) {
			assert.ok(false, 'Must not be called');
		}
	});
	QUnit.test('Put message with severity "warning" during deserialization', function(assert) {
		assert.expect(3);
		var done = assert.async();
		this.coreApi.deserialize = function(oDeserializablePath) {
			this.messageHandler.putMessage(new MessageObject({code : "5301"} ));
		}.bind(this);
		
		this.serializationMediator.openPath("myPathId", callbackOpen.bind(this));
		assert.equal(this.putMessageSpy.getCall(0).args[0].getCode(), '5301', 'Put warning message during core deserialization');
		assert.equal(this.putMessageSpy.callCount, 1, 'Only one warning message during core deserialization put');
		
		function callbackOpen(response, metadata) {
			assert.ok(true, 'Must be called - no APF fatal thrown');
			done();
		}
	});
	QUnit.module('Serialization / Deserialization', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
			this.assertInStubbedMethods = false;
		}
	});
	QUnit.test('Serialize without transient properties', function (assert) {
		assert.expect(1);
		var done = assert.async();
		var expectedApfState = {
				startFilterHandler : {
					sfh : 'sfh'
				}, 
				filterIdHandler : {
					fih : 'fih'
				}, 
				path : {
					path : 'path'
				}, 
				smartFilterBar : {
					sfb : 'sfb'
				}
		};
		var isTransient = false; 
		this.serializationMediator.serialize(isTransient).done(function(serializableApfState){
			assert.deepEqual(serializableApfState, expectedApfState, 'Serializable object without transient properties returned');
			done();
		});
	});
	QUnit.test('Serialize including transient properties', function (assert) {
		assert.expect(1);
		var done = assert.async();
		var expectedApfState = {
				startFilterHandler : {
					sfh : 'sfh'
				}, 
				filterIdHandler : {
					fih : 'fih'
				}, 
				path : {
					path : 'path'
				}, 
				smartFilterBar : {
					sfb : 'sfb'
				}, 
				dirtyState : true, 
				pathName : 'APF Path'
		};
		var isTransient = true; 
		this.serializationMediator.serialize(isTransient).done(function(serializableApfState){
			assert.deepEqual(serializableApfState, expectedApfState, 'Serializable object with transient properties returned');
			done();
		});
	});
	QUnit.test('Serialize for "last good APF state"', function (assert) {
		assert.expect(1);
		var done = assert.async();
		var isTransient = false;
		var keepInitialStartFilterValues = true;
		
		this.serializationMediator.serialize(isTransient, keepInitialStartFilterValues).done(function(serializableApfState){
			assert.ok(this.serialzeSFHcalledForLastGoodApfState, 'Initial StartFilter values will be kept when calling serialization for "last good APF state"');
			done();
		}.bind(this));
	});
	QUnit.test('Deserialize without transient properties', function (assert) {
		assert.expect(0);
		var done = assert.async();
		this.coreApi.setDirtyState = function(state){
			assert.ok(false, 'Must not be called');
		};
		this.coreApi.setPathName = function(name){
			assert.ok(false, 'Must not be called');
		};
		var serializedApfState = {
				startFilterHandler : {
					sfh : 'sfh'
				}, 
				filterIdHandler : {
					fih : 'fih'
				}, 
				path : {
					path : 'path'
				}, 
				smartFilterBar : {
					sfb : 'sfb'
				}
		};
		this.serializationMediator.deserialize(serializedApfState).done(function(){
			done();
		});
	});
	QUnit.test('Deserialize including transient properties', function (assert) {
		assert.expect(2);
		var done = assert.async();
		this.coreApi.setDirtyState = function(state){
			assert.equal(state, true, 'State correctly deserialized');
		};
		this.coreApi.setPathName = function(name){
			assert.equal(name, 'APF Path', 'Name correctly deserialized');
		};
		var serializedApfState = {
				startFilterHandler : {
					sfh : 'sfh'
				}, 
				filterIdHandler : {
					fih : 'fih'
				}, 
				path : {
					path : 'path'
				}, 
				smartFilterBar : {
					sfb : 'sfb'
				}, 
				dirtyState : true, 
				pathName : 'APF Path'
		};
		this.serializationMediator.deserialize(serializedApfState).done(function(){
			done();
		});
	});
	QUnit.test('Deserialize considering active step', function (assert) {
		assert.expect(1);
		var done = assert.async();
		var serializedApfState = {
				startFilterHandler : {
					sfh : 'sfh'
				}, 
				filterIdHandler : {
					fih : 'fih'
				}, 
				path : {
					path : 'path',
					indicesOfActiveSteps : []
				},
				smartFilterBar : {
					sfb : 'sfb'
				}
		};
		this.coreApi.deserialize = function(serializableCore){
			assert.equal(serializableCore.path.indicesOfActiveSteps[0], 3, 'Optional parameter for active step forwarded correctly to core');
		};
		this.serializationMediator.deserialize(serializedApfState, 3).done(function(){
			done();
		});
	});
});