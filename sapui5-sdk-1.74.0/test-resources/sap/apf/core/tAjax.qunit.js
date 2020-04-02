jQuery.sap.require("sap.apf.core.ajax");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.messageHandler");
jQuery.sap.require("sap.apf.core.messageDefinition");

(function() {
	'use strict';

	function setupMessageHandler(testEnv) {
		testEnv.messageHandler = new sap.apf.core.MessageHandler();
		testEnv.messageHandler.loadConfig(sap.apf.core.messageDefinition, true);
		testEnv.messageHandler.activateOnErrorHandling(true);
		testEnv.messageHandler.setLifeTimePhaseRunning();
	}
	function createPromiseWithTimeOut(result) {
		var deferred = jQuery.Deferred();
		setTimeout(function() {
			deferred.resolve(result);
		}, 1);
		return deferred.promise();
	}
	QUnit.module('Ajax AND async is set to TRUE', {
		beforeEach : function(assert) {
			var that = this;
			setupMessageHandler(this);
			this.bRequestSuccess = false;
			this.bRequestError = false;
			this.ajaxInjectAndSettings = {
				instances : { messageHandler : this.messageHandler },
				url : "not relevant",
				type : "HEAD",
				beforeSend : function() {
				},
				success : function() {
					that.bRequestSuccess = true;
				},
				error : function() {
					that.bRequestError = true;
				},
				async : true
			};
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test('GIVEN an AJAX stub simulating a NON existing resource WHEN send simple request THEN error function are called', function(assert) {
		var spyAJAX = sinon.stub(jQuery, "ajax", function(object) {
			var deferred = jQuery.Deferred();
			deferred.resolve(null, null, {
				status : 303
			});
			return deferred.promise();
		});
		sap.apf.core.ajax(this.ajaxInjectAndSettings); //<<< unit under test
		assert.ok(spyAJAX.calledOnce);
		assert.ok(this.bRequestError, "Request successfully sent and redirected to the error function due to 303");
		spyAJAX.restore();
	});
	QUnit.test('GIVEN an AJAX stub simulating existing resource WHEN Send simple request THEN success function are called', function(assert) {
		var spyAJAX = sinon.stub(jQuery, "ajax", function(object) {
			var deferred = jQuery.Deferred();
			deferred.resolve(null, null, {});
			return deferred.promise();
		});
		sap.apf.core.ajax(this.ajaxInjectAndSettings); //<<< unit under test
		assert.ok(spyAJAX.calledOnce);
		assert.ok(this.bRequestSuccess, "Request successfully sent and success function was called");
		spyAJAX.restore();
	});
	QUnit.test('Timeout 303', function(assert) {
		var done = assert.async();
		var server = sinon.fakeServer.create();
		server.respondWith([ 303, {
			"Content-Type" : "text/plain"
		}, '' ]);
		server.autoRespond = true;
		var ajaxInject = {
			instances : { messageHandler : this.messageHandler },
			url : "http://localhost:8080/sap.apf.core.test/test-resources/sap/apf/core/tAjax.qunit.html",
			type : "HEAD",
			success : function() {
			},
			error : function(arg1, arg2, arg3, oMessage) {
				assert.equal((oMessage && oMessage.getCode() == "5021"), true, "Code 5021 expected due to http 303 error code");
				server.restore();
				done();
			},
			async : true
		};
		sap.apf.core.ajax(ajaxInject);
	});
	QUnit.test('Timeout with redirect to login 200', function(assert) {
		var done = assert.async();
		var server = sinon.fakeServer.create();
		server.respondWith([ 200, {
			"x-sap-login-page" : "url"
		}, '' ]);
		server.autoRespond = true;
		var ajaxInject = {
			instances : { messageHandler : this.messageHandler },
			url : "http://localhost:8080/AnalysisPathFramework_SP03/tests/sap/apf/core/tAjax.html",
			type : "HEAD",
			success : function() {
			},
			error : function(arg1, arg2, arg3, oMessage) {
				assert.equal((oMessage && oMessage.getCode() == "5021"), true, "Code 5021 expected due to timeout");
				server.restore();
				done();
			},
			async : true
		};
		sap.apf.core.ajax(ajaxInject);

	});
	QUnit.module('Ajax AND async is set to FALSE', {
		beforeEach : function(assert) {
			var that = this;
			setupMessageHandler(this);
			this.bRequestSuccess = false;
			this.bRequestError = false;
			this.ajaxInjectAndSettings = {
				instances : { messageHandler : this.messageHandler },
				url : "not relevant",
				type : "HEAD",
				beforeSend : function() {
				},
				success : function() {
					that.bRequestSuccess = true;
				},
				error : function() {
					that.bRequestError = true;
				},
				async : false
			};
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test('GIVEN an AJAX stub simulating a NON existing resource WHEN send simple request THEN error function are called', function(assert) {
		var spyAJAX = sinon.stub(jQuery, "ajax", function(object) {
			object.success(null, null, {
				status : 303
			});
		});
		sap.apf.core.ajax(this.ajaxInjectAndSettings); //<<< unit under test
		assert.ok(spyAJAX.calledOnce);
		assert.ok(this.bRequestError, "Request successfully sent and redirected to the error function due to 303");
		spyAJAX.restore();
	});
	QUnit.test('GIVEN an AJAX stub simulating existing resource WHEN Send simple request THEN success function are called', function(assert) {
		var spyAJAX = sinon.stub(jQuery, "ajax", function(object) {
			object.success(null, null, {});
		});
		sap.apf.core.ajax(this.ajaxInjectAndSettings); //<<< unit under test
		assert.ok(spyAJAX.calledOnce);
		assert.ok(this.bRequestSuccess, "Request successfully sent and success function was called");
		spyAJAX.restore();
	});
	QUnit.test('Timeout 303', function(assert) {
		var bRequestError = false;
		this.server = sinon.fakeServer.create();
		this.server.respondWith([ 303, {
			"Content-Type" : "text/plain"
		}, '' ]);
		this.server.autoRespond = true;
		var ajaxInject = {
			instances : { messageHandler : this.messageHandler },
			url : "http://localhost:8080/sap.apf.core.test/test-resources/sap/apf/core/tAjax.qunit.html",
			type : "HEAD",
			success : function() {
			},
			error : function(arg1, arg2, arg3, oMessage) {
				bRequestError = true;
				assert.equal((oMessage && oMessage.getCode() == "5021"), true, "Code 5021 expected due to http 303 error code");
			},
			async : false
		};
		sap.apf.core.ajax(ajaxInject);
		assert.ok(bRequestError, "Error function was called");
		this.server.restore();
	});
	QUnit.test('Timeout with redirect to login 200', function(assert) {
		var bRequestError = false;
		this.server = sinon.fakeServer.create();
		this.server.respondWith([ 200, {
			"x-sap-login-page" : "url"
		}, '' ]);
		this.server.autoRespond = true;
		var ajaxInject = {
			instances : { messageHandler : this.messageHandler },
			url : "http://localhost:8080/AnalysisPathFramework_SP03/tests/sap/apf/core/tAjax.html",
			type : "HEAD",
			success : function() {
			},
			error : function(arg1, arg2, arg3, oMessage) {
				bRequestError = true;
				assert.equal((oMessage && oMessage.getCode() == "5021"), true, "Code 5021 expected due to timeout");
			},
			async : false
		};
		sap.apf.core.ajax(ajaxInject);
		assert.ok(bRequestError, "Error function was called ");
		this.server.restore();
	});
	QUnit.test('Ajax injection', function(assert) {
		var myAjax = function(config) {
			return config.success("GreetingsFromMyAjax");
		};
		var ajaxInject = {
			instances : { messageHandler : this.messageHandler },
			functions : { ajax : myAjax },
			url : "http://localhost:8080/AnalysisPathFramework_SP03/tests/sap/apf/core/tAjax.html",
			type : "HEAD",
			success : function(response) {
				assert.equal(response, "GreetingsFromMyAjax", "THEN the injected AJAX is called");
			},
			error : function(arg1, arg2, arg3, oMessage) {
			},
			async: false
		};
		sap.apf.core.ajax(ajaxInject);
	});
	QUnit.test("WHEN sap-system is set", function(assert){
		var myAjax = function(conf) {
			assert.equal(conf.url, "/path/to/resource;o=myERP", "THEN origin is included in URL");
			return createPromiseWithTimeOut();
		};
		var mySapSystem = function() {
			return "myERP";
		};
		var ajaxInject = {
			instances : { messageHandler : this.messageHandler },
			functions : { ajax : myAjax, getSapSystem : mySapSystem },
			url : "/path/to/resource",
			type : "HEAD",
			success : function(response) {
			},
			error : function(arg1, arg2, arg3, oMessage) {
			}
		};
		sap.apf.core.ajax(ajaxInject);
	});
	QUnit.test("WHEN sap-system is set AND option suppressSapSystem === true", function(assert){
		var myAjax = function(conf) {
			assert.equal(conf.url, "/path/to/resource", "THEN origin is NOT included in URL");
			return createPromiseWithTimeOut();
		};
		var mySapSystem = function() {
			return "myERP";
		};
		var ajaxInject = {
			instances : { messageHandler : this.messageHandler },
			functions : { ajax : myAjax, getSapSystem : mySapSystem },
			url : "/path/to/resource",
			type : "HEAD",
			success : function(response) {
			},
			error : function(arg1, arg2, arg3, oMessage) {
			},
			suppressSapSystem : true
		};
		sap.apf.core.ajax(ajaxInject);
	});
	QUnit.test("WHEN sap-system is set AND option suppressSapSystem === false", function(assert){
		var myAjax = function(conf) {
			assert.equal(conf.url, "/path/to/resource;o=myERP", "THEN origin is included in URL");
			return createPromiseWithTimeOut();
		};
		var mySapSystem = function() {
			return "myERP";
		};
		var ajaxInject = {
			instances : { messageHandler : this.messageHandler },
			functions : { ajax : myAjax, getSapSystem : mySapSystem },
			url : "/path/to/resource",
			type : "HEAD",
			success : function(response) {
			},
			error : function(arg1, arg2, arg3, oMessage) {
			},
			suppressSapSystem : false
		};
		sap.apf.core.ajax(ajaxInject);
	});
	QUnit.module("Exception Handling in success and error part of AJAX", {
		beforeEach : function() {
			setupMessageHandler(this);
		}
	});
	QUnit.test('Ajax - unspecified exception in the success callback', function(assert){
		assert.expect(1);
		var done = assert.async();
		var settings = {
				instances : { messageHandler : this.messageHandler },
				url : "not relevant",
				type : "HEAD",
				beforeSend : function() {
				},
				success : function() {
					throw new Error("some error");
				},
				error : function() {
				},
				async : true
			};
		var spyAJAX = sinon.stub(jQuery, "ajax", function(object) {
			return createPromiseWithTimeOut(null);
		});
		var fnCallback = function(messageObject) {
			assert.equal(messageObject.getCode(), 5042, "Exception was raised");
			spyAJAX.restore();
			done();
		};
		this.messageHandler.setMessageCallback(fnCallback);
		sap.apf.core.ajax(settings);
	});
	QUnit.test('Ajax - catch silently fatal message in the success callback', function(assert){
		assert.expect(2);
		var that = this;
		var done = assert.async();
		var settings = {
				instances : { messageHandler : this.messageHandler },
				url : "not relevant",
				type : "HEAD",
				beforeSend : function() {
				},
				success : function() {
					assert.ok(true, "Success has been called");
					var messageObject = that.messageHandler.createMessageObject({code: 5102});
					that.messageHandler.putMessage(messageObject);
				},
				error : function() {
				},
				async : true
			};
		var spyAJAX = sinon.stub(jQuery, "ajax", function(object) {
			return createPromiseWithTimeOut(null);
		});
		function messageCallback () {
			assert.ok(true, "THEN only the fatal message has been put");
			spyAJAX.restore();
			done();
		}
		this.messageHandler.setMessageCallback(messageCallback);
		sap.apf.core.ajax(settings);
	});
	QUnit.test('Ajax -  rethrow fatal message in the success callback for async ajax', function(assert){
		assert.expect(3);
		var that = this;

		var settings = {
				instances : { messageHandler : this.messageHandler },
				url : "not relevant",
				type : "HEAD",
				beforeSend : function() {
				},
				success : function() {
					assert.ok(true, "Success has been called");
					var messageObject = that.messageHandler.createMessageObject({ code  :5102});
					that.messageHandler.putMessage(messageObject);
				},
				error : function() {
				},
				async : false
			};
		var spyAJAX = sinon.stub(jQuery, "ajax", function(object) {
			object.success(null, null, {});
		});
		var fnCallback = sinon.spy();
		this.messageHandler.setMessageCallback(fnCallback);
		assert.throws(function() {
			sap.apf.core.ajax(settings); 
		}, Error, "must rethrow");

		assert.ok(fnCallback.calledOnce, "THEN only the fatal message has been put");
		spyAJAX.restore();
	});
	QUnit.test('Ajax - unspecified exception in the error callback', function(assert){
		assert.expect(1);
		var settings = {
				instances : { messageHandler : this.messageHandler },
				url : "not relevant",
				type : "HEAD",
				beforeSend : function() {
				},
				success : function() {
					throw new Error("some error");
				},
				error : function() {
					throw new Error("some error");
				},
				async : false
			};
		var spyAJAX = sinon.stub(jQuery, "ajax", function(object) {
			object.error(null);
		});
		var fnCallback = function(messageObject) {
			assert.equal(messageObject.getCode(), 5042, "Exception was raised");
		};
		this.messageHandler.setMessageCallback(fnCallback);

		sap.apf.core.ajax(settings); 
		spyAJAX.restore();
	});
	QUnit.test('Ajax - exception from fatal message in the error callback', function(assert){
		assert.expect(2);
		var that = this;
		var settings = {
				instances : { messageHandler : this.messageHandler },
				url : "not relevant",
				type : "HEAD",
				beforeSend : function() {
				},
				success : function() {
					throw new Error("some error");
				},
				error : function() {
					assert.ok(true, "Error has been called");
					var messageObject = that.messageHandler.createMessageObject({ code: 5102});
					that.messageHandler.putMessage(messageObject);
				},
				async : true
			};
		var spyAJAX = sinon.stub(jQuery, "ajax", function(object) {
			var deferred = jQuery.Deferred();
			deferred.reject(null);
			return deferred.promise();
		});
		var fnCallback = function(messageObject) {
			assert.equal(messageObject.getPrevious().getCode(), 5102, "Exception was raised");
		};
		this.messageHandler.setMessageCallback(fnCallback);
		sap.apf.core.ajax(settings);
		spyAJAX.restore();
	});
}());