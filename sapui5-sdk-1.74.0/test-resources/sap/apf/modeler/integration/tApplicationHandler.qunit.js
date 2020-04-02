/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.mockServer.wrapper');
jQuery.sap.require("sap.apf.modeler.core.instance");
(function() {
	'use strict';
	var isMockServerActive = true;
	if (jQuery.sap.getUriParameters().get("responderOff") === "true") {
		isMockServerActive = false;
	}
	function createApplicationHandler(context, callback) {
		context.modelerCore = new sap.apf.modeler.core.Instance({
			serviceRoot : "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata"
		});
		context.modelerCore.getApplicationHandler(callback);
	}
	QUnit.module("M: Application serialization/deserialization (focus on hashtable)", {
		beforeEach : function(assert) {
			var done = assert.async();
			if (isMockServerActive) {
				sap.apf.testhelper.mockServer.activateModeler();
				createApplicationHandler(this, function(appHandler) {
					this.applicationHandler = appHandler;
					done();
				}.bind(this));
			} else {
				new sap.apf.testhelper.AuthTestHelper(done, function() {
					createApplicationHandler(this, function(appHandler) {
						this.applicationHandler = appHandler;
						done();
					}.bind(this));
				}.bind(this));
			}
		},
		afterEach : function() {
			var that = this;
			if (isMockServerActive) {
				sap.apf.testhelper.mockServer.deactivate();
			} else {
				var applicationList = this.applicationHandler.getList();
				applicationList.forEach(function(application) {
					if (application.ApplicationName.indexOf("apf1972-") === 0) {
						that.applicationHandler.removeApplication(application.Application, function() {
						});
					}
				});
			}
		},
		appA : {
			ApplicationName : "apf1972-appA",
			SemanticObject : "semObjA"
		},
		appB : {
			ApplicationName : "apf1972-appB",
			SemanticObject : "semObjB"
		},
		getApplicationHandler : function(callback) {
			this.modelerCore = new sap.apf.modeler.core.Instance({
				serviceRoot : "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata"
			});
			this.modelerCore.getApplicationHandler(callback);
		}
	});
	QUnit.test("ModelerCore.getApplicationHandler() returns same instance", function(assert) {
		assert.expect(1);
		var that = this;
		var done = assert.async();
		this.modelerCore.getApplicationHandler(function(applicationHandler) {
			assert.equal(that.applicationHandler, applicationHandler, "Same instance");
			done();
		});
	});
	QUnit.test("Save and get application", function(assert) {
		assert.expect(5);
		var done = assert.async();
		var counter = this.applicationHandler.getList().length;
		this.applicationHandler.setAndSave(this.appA, callbackSave.bind(this));
		function callbackSave(id, metadata, messageObject) {
			counter++;
			assert.equal(this.applicationHandler.getList().length, counter, "Application list increased by one");
			assert.ok(typeof id === "string", "Type of response is string");
			assert.equal(metadata.type, "entityTypeMetadata", "Metadata returned in callback");
			assert.ok(messageObject === undefined, "No error during save");
			var requestedApp = this.applicationHandler.getApplication(id);
			var expectedApp = jQuery.extend(true, {}, this.appA);
			expectedApp.Application = id;
			assert.deepEqual(requestedApp, expectedApp, "Correct created app returned from hashtable");
			done();
		}
	});
	QUnit.test("Update application", function(assert) {
		assert.expect(5);
		var done = assert.async();
		var counter = this.applicationHandler.getList().length;
		this.applicationHandler.setAndSave(this.appA, callbackSave.bind(this));
		function callbackSave(id, metadata, messageObject) {
			counter++;
			this.applicationHandler.setAndSave(this.appB, callbackModify.bind(this), id);
		}
		function callbackModify(id, metadata, messageObject) {
			assert.equal(this.applicationHandler.getList().length, counter, "Updated application list has same amount of applications");
			assert.ok(typeof id === "string", "Type of response is string");
			assert.equal(metadata.type, "entityTypeMetadata", "Metadata returned in callback");
			assert.ok(messageObject === undefined, "No error during modify");
			var requestedApp = this.applicationHandler.getApplication(id);
			var expectedApp = jQuery.extend(true, {}, this.appB);
			expectedApp.Application = id;
			assert.deepEqual(requestedApp, expectedApp, "Correct updated app returned from hashtable");
			done();
		}
	});
	if (!isMockServerActive) { // TODO: EG Active once Bug in Mockserver is fixed (Delete response code 200 instead of 204)
		QUnit.test("Remove application", function(assert) {
			assert.expect(7);
			var done = assert.async();
			var counter = this.applicationHandler.getList().length;
			this.applicationHandler.setAndSave(this.appA, callbackSave.bind(this));
			function callbackSave(id, metadata, messageObject) {
				counter++;
				this.modelerCore.getConfigurationHandler(id, function(configHandler) {
					this.configHandler = configHandler;
					this.configHandler.setConfiguration({
						attribute : "Config for testing"
					});
					assert.equal(this.configHandler.getList().length, 1, "Right number of configurations after set");
					this.applicationHandler.removeApplication(id, callbackRemove.bind(this));
				}.bind(this));
			}
			function callbackRemove(id, metadata, messageObject) {
				counter--;
				assert.equal(this.applicationHandler.getList().length, counter, "Application list decreased by one");
				assert.ok(typeof id === "string", "Type of response is string");
				assert.equal(metadata.type, "entityTypeMetadata", "Metadata returned in callback");
				assert.ok(messageObject === undefined, "No error during remove");
				assert.equal(this.applicationHandler.getApplication(id), undefined, "Application successfully removed from hashtable");
				assert.equal(this.configHandler.getList().length, 0, "No more configurations after remove");
				done();
			}
		});
	}
	QUnit.module("M: Application serialization/deserialization (focus on database table)", {
		beforeEach : function(assert) {
			var done = assert.async();
			if (isMockServerActive) {
				sap.apf.testhelper.mockServer.activateModeler();
				createApplicationHandler(this, function(appHandler) {
					this.applicationHandlerA = appHandler;
					done();
				}.bind(this));
			} else {
				new sap.apf.testhelper.AuthTestHelper(done, function() {
					createApplicationHandler(this, function(appHandler) {
						this.applicationHandlerA = appHandler;
						done();
					}.bind(this));
				}.bind(this));
			}
			//        	
			//        	this.authTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			//        		this.modelerCoreA = new sap.apf.modeler.core.Instance({
			//        			serviceRoot : "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata" , 
			//                    entityTypes : {
			//                    	application : 'ApplicationQueryResults',
			//                        configuration: 'AnalyticalConfigurationQueryResults'
			//                    }
			//                });
			//        		this.modelerCoreB = new sap.apf.modeler.core.Instance({
			//        			serviceRoot : "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata" , 
			//        			entityTypes : {
			//        				application : 'ApplicationQueryResults',
			//        				configuration: 'AnalyticalConfigurationQueryResults'
			//        			}
			//        		});
			//        		this.modelerCoreA.getApplicationHandler(function(applicationHandler){
			//        			that.applicationHandlerA = applicationHandler;
			//        			QUnit.start();
			//        		});
			//        	}.bind(this));
		},
		afterEach : function() {
			var that = this;
			if (isMockServerActive) {
				sap.apf.testhelper.mockServer.deactivate();
			} else {
				var applicationList = this.applicationHandlerA.getList();
				applicationList.forEach(function(application) {
					if (application.ApplicationName.indexOf("apf1972-") === 0) {
						that.applicationHandlerA.removeApplication(application.Application, function() {
						});
					}
				});
			}
		},
		appA : {
			ApplicationName : "apf1972-appA",
			SemanticObject : "semObjA"
		},
		appB : {
			ApplicationName : "apf1972-appB",
			SemanticObject : "semObjB"
		}
	});
	QUnit.test("Save with first instance, getApplication() with second", function(assert) {
		assert.expect(4);
		var that = this;
		var done = assert.async();
		this.applicationHandlerA.setAndSave(this.appA, callbackSave.bind(this));
		function callbackSave(id, metadata, messageObject) {
			createApplicationHandler(that, function(applicationHandler) {
				assert.ok(typeof id === "string", "Type of response is string");
				assert.equal(metadata.type, "entityTypeMetadata", "Metadata returned in callback");
				assert.ok(messageObject === undefined, "No error during save");
				var requestedApp = applicationHandler.getApplication(id);
				var expectedApp = jQuery.extend(true, {}, that.appA);
				expectedApp.Application = id;
				assert.deepEqual(requestedApp, expectedApp, "Correct created app returned from database");
				done();
			});
		}
	});
	QUnit.test("Update with first instance, getApplication() with second", function(assert) {
		assert.expect(4);
		var done = assert.async();
		var that = this;
		this.applicationHandlerA.setAndSave(this.appA, callbackSave.bind(this));
		function callbackSave(id, metadata, messageObject) {
			this.applicationHandlerA.setAndSave(this.appB, callbackModify.bind(this), id);
		}
		function callbackModify(id, metadata, messageObject) {
			createApplicationHandler(that, function(applicationHandler) {
				assert.ok(typeof id === "string", "Type of response is string");
				assert.equal(metadata.type, "entityTypeMetadata", "Metadata returned in callback");
				assert.ok(messageObject === undefined, "No error during modify");
				var requestedApp = applicationHandler.getApplication(id);
				var expectedApp = jQuery.extend(true, {}, that.appB);
				expectedApp.Application = id;
				assert.deepEqual(requestedApp, expectedApp, "Correct updated app returned from database");
				done();
			});
		}
	});
	if (!isMockServerActive) { // TODO: EG Active once Bug in Mockserver is fixed (Delete response code 200 instead of 204)
		QUnit.test("Delete with first instance, getApplication() with second", function(assert) {
			assert.expect(4);
			var done = assert.async();
			var that = this;
			this.applicationHandlerA.setAndSave(this.appA, callbackSave.bind(this));
			function callbackSave(id, metadata, messageObject) {
				//adds application id to appB, which is required for updating an existing application
				this.appB.Application = id;
				this.applicationHandlerA.removeApplication(id, callbackRemove.bind(this));
			}
			function callbackRemove(id, metadata, messageObject) {
				createApplicationHandler(that, function(applicationHandler) {
					assert.ok(typeof id === "string", "Type of response is string");
					assert.equal(metadata.type, "entityTypeMetadata", "Metadata returned in callback");
					assert.ok(messageObject === undefined, "No error during remove");
					assert.equal(applicationHandler.getApplication(id), undefined, "Application successfully removed from database");
					done();
				});
			}
		});
	}
	if (!isMockServerActive) { //Service specific error handling not supported on Mock Server, e. g. Check for invalid ID/Object
		QUnit.module("M: Error behaviour", {
			beforeEach : function(assert) {
				var done = assert.async();
				var that = this;
				this.authTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
					this.modelerCore = new sap.apf.modeler.core.Instance({
						serviceRoot : "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata"
					});
					this.modelerCore.getApplicationHandler(function(applicationHandler) {
						that.applicationHandler = applicationHandler;
						done();
					});
				}.bind(this));
			},
			afterEach : function() {
				var that = this;
				var applicationList = this.applicationHandler.getList();
				applicationList.forEach(function(application) {
					if (application.ApplicationName.indexOf("apf1972-") === 0) {
						that.applicationHandler.removeApplication(application.Application, function() {
						});
					}
				});
			}
		});
		QUnit.test("Save with invalid object", function(assert) {
			assert.expect(1);
			var done = assert.async();
			this.applicationHandler.setAndSave({}, callbackSave.bind(this));
			function callbackSave(id, metadata, messageObject) {
				assert.equal(messageObject.type, "messageObject", "Message object returned when application object is empty");
				done();
			}
		});
		QUnit.test("Update with invalid id", function(assert) {
			assert.expect(2);
			var done = assert.async();
			this.applicationHandler.setAndSave({
				ApplicationName : "apf1972-appA",
				SemanticObject : "semObjA"
			}, callbackModify.bind(this), "invalidId");
			function callbackModify(id, metadata, messageObject) {
				assert.equal(messageObject.type, "messageObject", "Message object returned when triggering an update with an invalid id");
				assert.ok(this.applicationHandler.getApplication("invalidId") === undefined, "No application with id 'invalidId' created");
				done();
			}
		});
		QUnit.test("Update with valid id but invalid object", function(assert) {
			assert.expect(1);
			var done = assert.async();
			this.applicationHandler.setAndSave({
				ApplicationName : "apf1972-appA",
				SemanticObject : "semObjA"
			}, callbackSave.bind(this));
			function callbackSave(id, metadata, messageObject) {
				this.applicationHandler.setAndSave({}, callbackModify.bind(this), id);
			}
			function callbackModify(id, metadata, messageObject) {
				assert.equal(messageObject.type, "messageObject", "Message object returned when triggering an update with invalid application object");
				done();
			}
		});
		QUnit.test("Remove application with invalid id", function(assert) {
			assert.expect(1);
			var done = assert.async();
			this.applicationHandler.removeApplication("invalidId", callbackRemove.bind(this));
			function callbackRemove(id, metadata, messageObject) {
				assert.equal(messageObject.type, "messageObject", "Message object returned when triggering a removal with an invalid id");
				done();
			}
		});
	}
}());
