jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerStubbedAjax");
jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.constants');

(function() {
	'use strict';
	function commonSetup(testEnv) {
		testEnv.inject = testEnv.inject || {}; 
		testEnv.inject.instances = testEnv.inject.instances || {};
		testEnv.inject.instances.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
		testEnv.sessionHandler = new sap.apf.testhelper.doubles.SessionHandlerStubbedAjax(testEnv.inject);
		testEnv.ajaxSpy = sinon.spy(testEnv.sessionHandler, "ajax");
	}
	QUnit.module('SessionHandler: no entityType in logical system set', {
		beforeEach : function(assert) {
			this.inject = {
				instances : {
					coreApi : {
						getUriGenerator : function() {
							return {
								buildUri : function() {
									return "buildUri";
								},
								getAbsolutePath : function(serviceRoot) {
									if(serviceRoot === "notAvailableServiceRoot"){
										return "notAvailableServiceRoot";
									}else if (serviceRoot === "xsrfPreventionFlagNotSet"){
										return "nullXsrfToken";
									}
									return "absolutePath";
								}
							};
						},
						getStartParameterFacade : function() {
							return {
								getSapSystem : function() { return undefined; }
							};
						}
					}
				}
			};
			commonSetup(this);
		}
	});
	QUnit.test('SessionHandler ajax stub', function(assert) {
		var done = assert.async();
		this.sessionHandler.getXsrfToken('serviceRoot').done(function(dummyXsrfTokenFromSessionHandler){
			assert.ok(dummyXsrfTokenFromSessionHandler.indexOf("dummyXsrfTokenFromSessionHandler") > -1, "Returned XSRF token is correct");
			done();
		});
	});
	QUnit.test('XSRF Token handling and caching', function(assert) {
		var done = assert.async();
		var sTokenServiceRoot1;
		var sTokenServiceRoot2;
		var that = this;
		this.sessionHandler.getXsrfToken('serviceRoot1').done(function(sTokenSR1){
			sTokenServiceRoot1 = sTokenSR1;
			that.sessionHandler.getXsrfToken('serviceRoot2').done(function(sTokenSR2){
				sTokenServiceRoot2 = sTokenSR2;
				assert.notEqual(sTokenServiceRoot1, sTokenServiceRoot2, "Different XSRF token for different service roots received");
				that.sessionHandler.getXsrfToken('serviceRoot1').done(function(sTokenSR1){
					assert.equal(sTokenServiceRoot1, sTokenSR1, "Second call for XSRF token returns same token as on first call");
					assert.ok(that.ajaxSpy.calledTwice, 'Second call for XSRF token returns token from hashtable and does not trigger another ajax request');
					done();
				});
			});
		});
	});
	QUnit.test('XSRF Token handling when XSRF prevention flag is not set in .xsaccess', function(assert) {
		var done = assert.async();
		this.sessionHandler.getXsrfToken('xsrfPreventionFlagNotSet').done(function(sToken){
			assert.equal(sToken, "", "Empty token returned");
			done();
		});
	});
	QUnit.test('XSRF Token handling for unavailable service root', function(assert) {
		var done = assert.async();
		var that = this;
		this.sessionHandler.getXsrfToken('notAvailableServiceRoot').done(function(sToken){
			assert.equal(sToken, "", "Empty token returned");
			assert.equal(that.inject.instances.messageHandler.spyResults.putMessage.code,"5101","Correct message code");
			done();
		});
	});
	QUnit.module('HEAD request with Fallback to GET request', {
		beforeEach : function(assert) {
			this.inject = {
					instances : {
						coreApi : {
							getUriGenerator : function() {
								return {
									buildUri : function() {
										return "buildUri";
									},
									getAbsolutePath : function(serviceRoot) {
										return serviceRoot;
									}
								};
							},
							getStartParameterFacade : function() {
								return {
									getSapSystem : function() { return undefined; }
								};
							}
						}
					}
			};
			commonSetup(this);
		}
	});
	QUnit.test('Standard request and caching', function(assert) {
		var done = assert.async();
		var sTokenServiceRoot1;
		var sTokenServiceRoot2;
		var that = this;
		this.sessionHandler.getXsrfToken('serviceRoot1').done(function(sTokenSR1){
			sTokenServiceRoot1 = sTokenSR1;
			that.sessionHandler.getXsrfToken('serviceRoot2').done(function(sTokenSR2){
				sTokenServiceRoot2 = sTokenSR2;
				assert.notEqual(sTokenServiceRoot1, sTokenServiceRoot2, "Different XSRF token for different service roots received");
				that.sessionHandler.getXsrfToken('serviceRoot1').done(function(sTokenSR1){
					assert.strictEqual(sTokenServiceRoot1, sTokenSR1, "Second call for XSRF token returns same token as on first call");
					assert.ok(that.ajaxSpy.calledTwice, 'Only two requests were sent');
					assert.strictEqual(that.ajaxSpy.args[0][0].type, "HEAD", "First request is HEAD request");
					assert.strictEqual(that.ajaxSpy.args[0][0].async, true, "THEN async is true");
					assert.strictEqual(that.ajaxSpy.args[1][0].type, "HEAD", "Second request is HEAD request");
					assert.strictEqual(that.ajaxSpy.args[1][0].async, true, "THEN async is true");
					done();
				});
			});
		});
	});
	QUnit.test('Service where HEAD request is forbidden', function(assert) {
		var done = assert.async();
		var that = this;
		this.sessionHandler.getXsrfToken('noHeadRequestAllowed').done(function(sToken){
			assert.ok(sToken.indexOf("dummyXsrfTokenFromSessionHandler") > -1, "Returned XSRF token is correct");
			assert.ok(that.ajaxSpy.calledTwice, 'Two requests were sent');
			assert.strictEqual(that.ajaxSpy.args[0][0].type, "HEAD", "First request is HEAD request");
			assert.strictEqual(that.ajaxSpy.args[0][0].async, true, "THEN async is true");
			assert.strictEqual(that.ajaxSpy.args[1][0].type, "GET", "Second request is GET request");
			assert.strictEqual(that.ajaxSpy.args[1][0].async, true, "THEN async is true");
			this.sessionHandler.getXsrfToken('serviceRoot1').done(function(sTokenSR1){
				assert.ok(sTokenSR1.indexOf("dummyXsrfTokenFromSessionHandler") > -1, "Returned XSRF token is correct");
				assert.equal(this.ajaxSpy.callCount, 3, 'Third request is sent');
				assert.strictEqual(this.ajaxSpy.args[2][0].type, "HEAD", "Third request is HEAD request");
				done();
			}.bind(this));
		}.bind(this));
	});
	QUnit.test('Service where HEAD and GET request is forbidden', function(assert) {
		var done = assert.async();
		var that = this;
		this.sessionHandler.getXsrfToken('noRequestAllowed').done(function(sToken){
			assert.strictEqual(sToken, "" , "No XSRF token returned");
			assert.ok(that.ajaxSpy.calledTwice, 'One request sent only');
			assert.strictEqual(that.ajaxSpy.args[0][0].type, "HEAD", "Request is HEAD request");
			assert.strictEqual(that.ajaxSpy.args[1][0].type, "GET", "Request is HEAD request");
			assert.equal(that.inject.instances.messageHandler.spyResults.putMessage.code,"5101","Correct message code");
			done();
		});
	});
	QUnit.test('Service not available', function(assert) {
		var done = assert.async();
		var that = this;
		this.sessionHandler.getXsrfToken('notAvailableServiceRoot').done(function(sToken){
			assert.strictEqual(sToken, "" , "No XSRF token returned");
			assert.ok(that.ajaxSpy.calledOnce, 'One request sent only');
			assert.strictEqual(that.ajaxSpy.args[0][0].type, "HEAD", "Request is HEAD request");
			assert.equal(that.inject.instances.messageHandler.spyResults.putMessage.code,"5101","Correct message code");
			done();
		});
	});
	QUnit.module('Dirty state', {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test('Default is not dirty', function(assert) {
        assert.strictEqual(this.sessionHandler.isDirty(), false, 'Initial session handler returns not dirty');
    });
	QUnit.test('Dirty after having been set to dirty', function(assert) {
	    this.sessionHandler.setDirtyState(true);
	    assert.strictEqual(this.sessionHandler.isDirty(), true, 'Last set state returned');
	});
	QUnit.module('Path name', {
			beforeEach : function() {
				commonSetup(this);
			}
	});
	QUnit.test('Default is empty string', function(assert) {
	    assert.strictEqual(this.sessionHandler.getPathName(), '', 'Initial session handler returns empty string for path name');
	});
	QUnit.test('Last set name returned on get', function(assert) {
	    this.sessionHandler.setPathName('Unnamed path');
	    assert.strictEqual(this.sessionHandler.getPathName(), 'Unnamed path', 'Last set path name returned');
	    this.sessionHandler.setPathName("Hugo's delight");
	    assert.strictEqual(this.sessionHandler.getPathName(), "Hugo's delight", 'Last set path name returned');
	});
	QUnit.test('Set name with a non-string type argument implicitely sets name to empty string', function(assert) {
	    this.sessionHandler.setPathName(undefined);
	    assert.strictEqual(this.sessionHandler.getPathName(), '', '"undefined" converted to empty string');
	    this.sessionHandler.setPathName(null);
	    assert.strictEqual(this.sessionHandler.getPathName(), '', '"null" converted to empty string');
	    this.sessionHandler.setPathName(0);
	    assert.strictEqual(this.sessionHandler.getPathName(), '', '"0" converted to empty string');
	    this.sessionHandler.setPathName([1, 2, 3]);
	    assert.strictEqual(this.sessionHandler.getPathName(), '', 'Array converted to empty string');
	    this.sessionHandler.setPathName({prop : 'val'});
	    assert.strictEqual(this.sessionHandler.getPathName(), '', 'Object converted to empty string');
	    this.sessionHandler.setPathName(/^[a-z]{3,6}/);
	    assert.strictEqual(this.sessionHandler.getPathName(), '', 'Regex converted to empty string');
	});
	QUnit.module('APF state', {
		beforeEach : function() {
			this.apfState = {
				serializableApfState : {
					state : 'complete state'
				}
			};
			this.inject = {
				functions : {
					serializeApfState : function(isNavigation, keepInitialStartFilterValues) {
						this.serializeApfStateCalled = true;
						this.spySerializeArguments = {
								isNavigation : isNavigation, 
								keepInitialStartFilterValues : keepInitialStartFilterValues
						};
						return jQuery.Deferred().resolve(this.apfState);
					}.bind(this),
					deserializeApfState : function(serializedState) {
						this.deserializeApfStateCalled = true;
						this.spyDeserializeArgumente = jQuery.sap.extend({}, serializedState);
						return jQuery.Deferred().resolve();
					}.bind(this)
				}, 
				instances : {
					coreApi : {
						resetPath : function(){
							this.resetPathCalled = true;
						}.bind(this)
					},
					getStartParameterFacade : function() {
						return {
							getSapSystem : function() { return undefined; }
						};
					}
				}
			};
			commonSetup(this);
		}
	});
	QUnit.test('Serialization function is only called if injected', function(assert) {
		var sessionHandler = new sap.apf.core.SessionHandler({
			instances : {
				messageHandler : new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging()	
			},
			functions : {}
		});
		assert.expect(0);
		try {
			sessionHandler.storeApfState();
		} catch (e) {
			assert.ok(false, 'Attempt to invoke non-existing function lead to exception "' + e.toString() + '"');
		}
	});
	QUnit.test('Deserialization function only called if injected', function(assert) {
		var sessionHandler = new sap.apf.core.SessionHandler({
			instances : {
				messageHandler : new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging()	
			},
			functions : {
				serializeApfState : function() {
					return jQuery.Deferred().resolve();
				}	
			}
		});
		assert.expect(0);
		sessionHandler.storeApfState();
		try {
			sessionHandler.restoreApfState();
		} catch (e) {
			assert.ok(false, 'Attempt to invoke non-existing function lead to exception "' + e.toString() + '"');
		}
	});
	QUnit.test('No APF state if backup was not called', function(assert) {
		assert.strictEqual(this.sessionHandler.isApfStateAvailable(), false, 'No transient APF state exists');
	});
	QUnit.test('APF state exists after backup was called', function(assert) {
		this.sessionHandler.storeApfState();
		assert.strictEqual(this.sessionHandler.isApfStateAvailable(), true, 'Transient APF state exists');
	});
	QUnit.test('Backup calls injected serialize', function(assert) {
		this.serializeApfStateCalled = false;
		var argumentsForSerializeApfState = {
				isNavigation : undefined,
				keepInitialStartFilterValues : true
		};
		this.sessionHandler.storeApfState();
		assert.ok(this.serializeApfStateCalled, 'Injected APF state serialization function was invoked');
		assert.deepEqual(this.spySerializeArguments, argumentsForSerializeApfState,'Injected APF state serialization function called with expected parameters');
	});
	QUnit.test('Restore calls injected deserialize and reset path', function(assert) {
		this.deserializeApfStateCalled = false;
		this.resetPathCalled = false;
		this.sessionHandler.storeApfState();
		this.sessionHandler.restoreApfState();
		assert.ok(this.deserializeApfStateCalled, 'Injected APF state deserialization function was invoked');
		assert.ok(this.resetPathCalled, 'Injected reset path function was invoked');
	});
	QUnit.test('Restore does not call injected deserialize if no APF state exists', function(assert) {
		this.deserializeApfStateCalled = false;
		this.sessionHandler.restoreApfState();
		assert.notOk(this.deserializeApfStateCalled, 'Deserialization function was not invoked');
	});
	QUnit.test('Stored APF state passed to deserialize during restore', function(assert) {
		this.sessionHandler.storeApfState();
		this.sessionHandler.restoreApfState();
		assert.deepEqual(this.spyDeserializeArgumente, this.apfState, 'Stored state passed to deserialize');
	});
	QUnit.module("GET xsrf token WHEN sap-system is set", {
		beforeEach : function(assert) {
			var that = this;
			var inject = {
					instances : {				
						messageHandler : new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage(),
						coreApi : {
							getUriGenerator : function() {
								return sap.apf.core.utils.uriGenerator;
							},
							getStartParameterFacade : function() {
								return {
									getSapSystem : function() { return "myERP"; }
								};
							}
						}
					}
			};
			this.sessionHandler = new sap.apf.core.SessionHandler(inject);
			this.sessionHandler.ajax = function(settings) {
				
				var oXMLHttpRequest = {
						getResponseHeader : function(sParam) {
							if (sParam === "x-sap-login-page") {
								return null;
							}
							return "dummyXsrfTokenFromSessionHandler" + sap.apf.utils.createPseudoGuid(32);
						}
				};
				assert.equal(settings.url, that.expectedServicePath, "THEN sap-system included in call for xsrf token");
				settings.success({}, {}, oXMLHttpRequest);
			};
		}
	});
	QUnit.test("WHEN sap-system = myERP", function(assert){
		assert.expect(1);
		
		var done = assert.async();
		this.expectedServicePath = "/service/path;o=myERP/";
		this.sessionHandler.getXsrfToken("/service/path").done(function(){
			done();
		});
	});
	QUnit.test("WHEN sap-system = myERP and service root already contains origin", function(assert){
		assert.expect(1);
		
		var done = assert.async();
		this.expectedServicePath = "/service/path;o=myERP/";
		this.sessionHandler.getXsrfToken("/service/path;o=myCRM").done(function(){
			done();
		});
	});

}());
