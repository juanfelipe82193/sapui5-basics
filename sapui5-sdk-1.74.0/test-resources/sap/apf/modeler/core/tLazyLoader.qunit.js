/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap,jQuery sinon*/
jQuery.sap.require("sap.apf.modeler.core.lazyLoader");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.core.messageHandler");
(function() {
	'use strict';
	QUnit.module("M Lazy Loader with Simple Instantiation", {
		beforeEach : function() {
			this.inject = {
				instances : {
					messageHandler : new sap.apf.core.MessageHandler()
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				}
			};
			this.id = "id1";
			this.instance = "instance";
		},
		afterEach : function() {
		}
	});
	QUnit.test("Without data", function(assert) {
		var lazyLoader = new sap.apf.modeler.core.LazyLoader(this.inject);
		assert.equal(lazyLoader.getId(), undefined, "WHEN instantiated without data THEN getID() returns undefined");
		assert.equal(lazyLoader.getInstance(), null, "WHEN instantiated without data THEN getInstance() returns null");
		assert.ok(!lazyLoader.isInitializing(), "WHEN instantiated without data THEN lazyLoader is not initializing");
	});
	QUnit.test("With data", function(assert) {
		var lazyLoader = new sap.apf.modeler.core.LazyLoader(this.inject, undefined, {
			id : this.id,
			instance : this.instance
		});
		assert.equal(lazyLoader.getId(), this.id, "WHEN instantiated with data THEN getId() returns the id");
		assert.deepEqual(lazyLoader.getInstance(), this.instance, "WHEN instantiated with data THEN getInstance() returns the instance");
		assert.ok(!lazyLoader.isInitializing(), "WHEN instantiated with data THEN lazyLoader is not initializing");
	});
	QUnit.module("M Lazy Loader instantiated with fnLoadInstance()", {
		beforeEach : function() {
			var that = this;
			this.id = "id1";
			this.instance = {
				x : 0
			};
			this.messageObject = {
				e : "Error Message"
			};
			var inject = {
				instances : {
					messageHandler : new sap.apf.core.MessageHandler()
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				}
			};
			this.spyfnLoadInstance = {
				called : 0,
				id : "",
				callback : null
			};
			this.fnLoadInstance = function(id, callback, oldInstance) {
				that.spyfnLoadInstance = {
					called : ++that.spyfnLoadInstance.called,
					id : id,
					callback : callback,
					oldInstance : oldInstance
				};
			};
			this.lazyLoader = new sap.apf.modeler.core.LazyLoader(inject, this.fnLoadInstance);
			this.spyCallbackFromAsyncGet1 = {
				id : "",
				instance : null,
				messageObject : null,
				called : 0
			};
			this.callbackFromAsyncGet1 = function(instance, messageObject, id) {
				that.spyCallbackFromAsyncGet1.id = id;
				that.spyCallbackFromAsyncGet1.instance = instance;
				that.spyCallbackFromAsyncGet1.messageObject = messageObject;
				that.spyCallbackFromAsyncGet1.called++;
			};
			this.spyCallbackFromAsyncGet2 = {
				id : "",
				instance : null,
				messageObject : null,
				called : 0
			};
			this.callbackFromAsyncGet2 = function(instance, messageObject, id) {
				that.spyCallbackFromAsyncGet2.id = id;
				that.spyCallbackFromAsyncGet2.instance = instance;
				that.spyCallbackFromAsyncGet2.messageObject = messageObject;
				that.spyCallbackFromAsyncGet2.called++;
			};
		}
	});
	QUnit.test("When asyncGetInstance() was called with falsy id parameter value", function(assert) { //new test case for improved behaviour of code under test  - 2015.03.27
		this.lazyLoader.asyncGetInstance("", undefined);
		assert.equal(this.spyfnLoadInstance.called, 0, "THEN fnLoadInstance() is not called");
	});
	QUnit.test("When asyncGetInstance() was called with truthy id parameter value", function(assert) {
		this.lazyLoader.asyncGetInstance(this.id, undefined);
		assert.ok(this.lazyLoader.isInitializing(), "THEN isInitializing() is true");
		assert.equal(this.spyfnLoadInstance.called, 1, "THEN fnLoadInstance() has been called");
		assert.equal(this.spyfnLoadInstance.id, this.id, "THEN fnLoadInstance() has been called with right id");
		assert.ok(this.spyfnLoadInstance.callback, "THEN a callback has been provided to fnLoadInstance()");
	});
	QUnit.test("Load of an instance via the lazy loader with succeeding fnLoadInstance()", function(assert) {
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet1);
		this.spyfnLoadInstance.callback(this.id, this.instance, undefined);
		assert.equal(this.spyCallbackFromAsyncGet1.called, 1, "WHEN the calllback provided to fnLoadInstance() was called with id and instance THEN the callback provided to asyncGetInstance() is called with these values");
		assert.equal(this.spyCallbackFromAsyncGet1.id, this.id, "WHEN the calllback provided to fnLoadInstance() was called with id and instance THEN the callback provided to asyncGetInstance() is called with these values");
		assert.deepEqual(this.spyCallbackFromAsyncGet1.instance, this.instance, "WHEN the callback provided to fnLoadInstance() was called with id and instance THEN the callback provided to asyncGetInstance() is called with these values");
		assert.strictEqual(this.spyCallbackFromAsyncGet1.messageObject, undefined, "WHEN the callback provided to fnLoadInstance() was called with id and instance THEN the callback provided to asyncGetInstance() is called with these values");
		assert.ok(!this.lazyLoader.isInitializing(), "WHEN the callback provided to fnLoadInstance() was called with id and instance THEN isInitializing() is false afterwards");
		assert.equal(this.lazyLoader.getId(), this.id, "WHEN the callback provided to fnLoadInstance() was called with id and instance THEN getId() returns the provided id afterwards");
		assert.deepEqual(this.lazyLoader.getInstance(), this.instance, "WHEN the callback provided to fnLoadInstance() was called with id and instance THEN getInstance() returns the provided instance afterwards");
	});
	QUnit.test("Load of an instance via the lazy loader with succeeding fnLoadInstance() and reload", function(assert) {
		var that = this;
 
		function callbackSecondCall(instance, messageObject, id){
			assert.strictEqual(messageObject, undefined, "THEN message object is undefined");
		}
		function callback(instance, messageObject, id) {
			that.lazyLoader.asyncGetInstance(that.id, callbackSecondCall);
		}
		this.lazyLoader.asyncGetInstance(this.id, callback);
		this.spyfnLoadInstance.callback(this.id, this.instance, undefined);
	});	
	QUnit.test("Load of an instance via the lazy loader with failing fnLoadInstance()", function(assert) {
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet1);
		this.spyfnLoadInstance.callback(this.id, undefined, this.messageObject);
		assert.equal(this.spyCallbackFromAsyncGet1.called, 1, "WHEN the callback provided to fnLoadInstance() was called with id and message object THEN the callback provided to asyncGetInstance() is called with the message object");
		assert.equal(this.spyCallbackFromAsyncGet1.id, this.id, "WHEN the callback provided to fnLoadInstance() was called with id and message object THEN the callback provided to asyncGetInstance() is called with the message object");
		assert.equal(this.spyCallbackFromAsyncGet1.instance, null, "WHEN the callback provided to fnLoadInstance() wass called with id and message object THEN the callback provided to asyncGetInstance() is called with the message object");
		assert.equal(this.spyCallbackFromAsyncGet1.messageObject, this.messageObject,
				"WHEN the callback provided to fnLoadInstance() was called with id and message object THEN the callback provided to asyncGetInstance() is called with the message object");
		assert.ok(!this.lazyLoader.isInitializing(), "WHEN the callback provided to fnLoadInstance() was called with id and message object THEN isInitializing() is false afterwards");
		assert.equal(this.lazyLoader.getId(), this.id, "WHEN the callback provided to fnLoadInstance() was called with id and message object THEN getId() returns the provided id afterwards");
		assert.equal(this.lazyLoader.getInstance(), null, "WHEN the callback provided to fnLoadInstance() was called with id and message object THEN getInstance() returns null afterwards");
	});
	QUnit.test("WHEN two calls to asyncGetInstance() with two different callback function objects registered via asyncGetInstance()", function(assert) {
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet1);
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet2);
		assert.equal(this.spyfnLoadInstance.called, 1, "THEN fnLoadInstance() is called only once");
		this.spyfnLoadInstance.callback(this.id, this.instance, undefined);
		assert.equal(this.spyCallbackFromAsyncGet1.called, 1, "THEN the first callback provided to asyncGetInstance() is called once with the values from fnLoadInstance()");
		assert.equal(this.spyCallbackFromAsyncGet1.id, this.id, "THEN the first callback provided to asyncGetInstance() is called once with the values from fnLoadInstance()");
		assert.deepEqual(this.spyCallbackFromAsyncGet1.instance, this.instance, "THEN the first callback provided to asyncGetInstance() is called once with the values from fnLoadInstance()");
		assert.strictEqual(this.spyCallbackFromAsyncGet1.messageObject, undefined, "THEN the first callback provided to asyncGetInstance() is called once with the values from fnLoadInstance()");
		assert.equal(this.spyCallbackFromAsyncGet2.called, 1, "THEN the second callback provided to asyncGetInstance() is called once with the values from fnLoadInstance()");
		assert.equal(this.spyCallbackFromAsyncGet2.id, this.id, "THEN the second callback provided to asyncGetInstance() is called once with the values from fnLoadInstance()");
		assert.deepEqual(this.spyCallbackFromAsyncGet2.instance, this.instance, "THEN the second callback provided to asyncGetInstance() is called once with the values from fnLoadInstance()");
		assert.strictEqual(this.spyCallbackFromAsyncGet2.messageObject, undefined, "THEN the second callback provided to asyncGetInstance() is called once with the values from fnLoadInstance()");
	});
	QUnit.test("WHEN two calls to asyncGetInstance() with the same callback function object registered via asyncGetInstance()", function(assert) {
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet1);
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet1);
		assert.equal(this.spyfnLoadInstance.called, 1, "THEN fnLoadInstance() is called only once");
		this.spyfnLoadInstance.callback(this.id, this.instance, undefined);
		assert.equal(this.spyCallbackFromAsyncGet1.called, 1, "THEN the callback provided with asyncGetInstance() is called only once with the values from fnLoadInstance()");
	});
	QUnit.test("WHEN two calls to asyncGetInstance() with callback functions with the same code but different closure scopes are registered via asyncGetInstance()", function(assert) {
		var spyCallbackFromAsyncGet = {
			id : undefined,
			instance : null,
			messageObject : null,
			scope_1_called : 0,
			scope_2_called : 0
		};
		function callbackFromAsyncGetProducer(scope) {
			return function(instance, messageObject, id) {
				spyCallbackFromAsyncGet.id = id;
				spyCallbackFromAsyncGet.instance = instance;
				spyCallbackFromAsyncGet.messageObject = messageObject;
				spyCallbackFromAsyncGet[scope + "called"]++;
			};
		}
		this.callbackFromAsyncGet = callbackFromAsyncGetProducer("scope_1_");
		this.callbackFromAsyncGetSameCode = callbackFromAsyncGetProducer("scope_2_");
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet);
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGetSameCode);
		assert.equal(this.spyfnLoadInstance.called, 1, "THEN fnLoadInstance() is called only once");
		this.spyfnLoadInstance.callback(this.id, this.instance, undefined);
		assert.equal(spyCallbackFromAsyncGet.scope_1_called, 1, "THEN the callback with closure scope_1 provided to asyncGetInstance() is called once with the values from fnLoadInstance()");
		assert.equal(spyCallbackFromAsyncGet.scope_2_called, 1, "THEN the callback with closure scope_2 provided to asyncGetInstance() is called once with the values from fnLoadInstance()");
	});
	QUnit.test("Load of an instance via the lazy loader after fnLoadInstance() came already back with id and instance", function(assert) {
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet1);
		this.spyfnLoadInstance.callback(this.id, this.instance, undefined);
		assert.equal(this.spyCallbackFromAsyncGet1.called, 1, "WHEN fnLoadInstance() came already back with id and instance THEN already registered callbacks came back AND");
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet1);
		assert.equal(this.spyCallbackFromAsyncGet1.called, 2, "THEN every callback registered via the same id via asyncGetInstance() comes back immediately");
		assert.equal(this.spyCallbackFromAsyncGet1.id, this.id, "THEN every callback registered via the same id via asyncGetInstance() comes back immediately with id");
		assert.deepEqual(this.spyCallbackFromAsyncGet1.instance, this.instance, "THEN every callback registered via the same id via asyncGetInstance() comes back immediately with instance");
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet2);
		assert.equal(this.spyCallbackFromAsyncGet2.called, 1, "THEN every callback registered via the same id via asyncGetInstance() comes back immediately");
		assert.equal(this.spyCallbackFromAsyncGet2.id, this.id, "THEN every callback registered via the same id via asyncGetInstance() comes back immediately with id");
		assert.deepEqual(this.spyCallbackFromAsyncGet2.instance, this.instance, "THEN every callback registered via the same id via asyncGetInstance() comes back immediately with instance");
	});
	QUnit.test("Load of an instance via the lazy loader after fnLoadInstance() came already back with a message object", function(assert) { //new test case for improved behaviour of code under test  - 2015.03.27
		var messageObject = {
			message : "error"
		};
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet1);
		this.spyfnLoadInstance.callback(this.id, undefined, messageObject);
		assert.equal(this.spyCallbackFromAsyncGet1.called, 1, "WHEN fnLoadInstance() came already back with id and message object THEN already registered callbacks came back AND");
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet1);
		assert.equal(this.spyCallbackFromAsyncGet1.called, 2, "THEN every callback registered via the same id via asyncGetInstance() comes back immediately");
		assert.deepEqual(this.spyCallbackFromAsyncGet1.messageObject, messageObject, "THEN every callback registered via the same id via asyncGetInstance() comes back immediately with the message object");
		this.lazyLoader.asyncGetInstance(this.id, this.callbackFromAsyncGet2);
		assert.equal(this.spyCallbackFromAsyncGet2.called, 1, "THEN every callback registered via the same id via asyncGetInstance() comes back immediately");
		assert.deepEqual(this.spyCallbackFromAsyncGet2.messageObject, messageObject, "THEN every callback registered via the same id via asyncGetInstance() comes back immediately with the message object");
	});
	QUnit.test("Two succeeding calls to asyncGetInstance() with two different Ids", function(assert) {
		this.lazyLoader.asyncGetInstance("firstId", this.callbackFromAsyncGet1);
		assert.equal(this.spyfnLoadInstance.id, "firstId", "WHEN first call to asyncGetInstance() with first id THEN fnLoadInstance() is called for the first id");
		this.lazyLoader.asyncGetInstance("secondId", this.callbackFromAsyncGet2);
		assert.equal(this.spyfnLoadInstance.id, "secondId", "WHEN second call to asyncGetInstance() with second id THEN fnLoadInstance() is called for the second id");
		this.spyfnLoadInstance.callback("firstId", {
			name : "firstInstance"
		}, undefined);
		assert.equal(this.spyCallbackFromAsyncGet1.called, 0, "WHEN callback from fnLoadInstance() comes back now with first id THEN no callback registered by asyncGetInstance() is called");
		assert.equal(this.spyCallbackFromAsyncGet2.called, 0, "WHEN callback from fnLoadInstance() comes back now with first id THEN no callback registered by asyncGetInstance() is called");
		this.spyfnLoadInstance.callback("secondId", {
			name : "secondInstance"
		}, undefined);
		assert.equal(this.spyCallbackFromAsyncGet1.called, 0, "WHEN callback from fnLoadInstance() comes back now with second id THEN only the callback registered by asyncGetInstance() for the second id is called");
		assert.equal(this.spyCallbackFromAsyncGet2.called, 1, "WHEN callback from fnLoadInstance() comes back now with second id THEN only the callback registered by asyncGetInstance() for the second id is called");
	});
	QUnit.test("Reset() after asyncGetInstance() and fnLoadInstance() came back", function(assert) {
		var id1 = "id1", instance1 = {
			x : 0
		};
		this.lazyLoader.asyncGetInstance(id1, this.callbackFromAsyncGet1);
		assert.equal(this.lazyLoader.getId(), id1, "WHEN asyncGetInstance() was called THEN getId() delivers the id provided to asyncGetInstance()");
		this.spyfnLoadInstance.callback(id1, instance1, undefined);
		assert.deepEqual(this.lazyLoader.getInstance(), instance1, "WHEN fnLoadInstance() comes back THEN getInstance() delivers the instance");
		this.lazyLoader.reset();
		assert.equal(this.lazyLoader.getId(), null, "WHEN reset() was called THEN getId() delivers null");
		assert.equal(this.lazyLoader.getInstance(), null, "WHEN reset was called THEN getInstance() delivers null");
	});
	QUnit.test("WHEN asyncGetInstance() after reset() for lazy loader with an already loaded instance", function(assert) {
		var id1 = "id1", instance1 = {
			x : 0
		};
		this.lazyLoader.asyncGetInstance(id1, this.callbackFromAsyncGet1);
		this.spyfnLoadInstance.callback(id1, instance1, undefined);
		this.lazyLoader.reset();
		this.lazyLoader.asyncGetInstance(id1, this.callbackFromAsyncGet1);
		assert.deepEqual(this.spyfnLoadInstance.oldInstance, instance1, "THEN the old instance is provided to fnLoadInstance() in the third parameter position");
	});
}());