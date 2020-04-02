/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.modeler.core.applicationHandler");
(function() {
	'use strict';
	QUnit.module("M: Persistence of Application Handler with stubbed CRUD", {
		beforeEach : function(assert) {
			var that = this;
			this.appObjectCreate = {
				ApplicationName : "appName",
				SemanticObject : "aSemanticalObject"
			};
			this.appObjectUpdate = {
				ApplicationName : "appNameUpdated",
				SemanticObject : "aSemanticalObjectUpdated"
			};
			this.appObjectWithoutSemanticObject = {
				ApplicationName : "appNameUpdated"
			};
			this.proxy = {
				create : function() {
				},
				update : function() {
				},
				remove : function() {
				},
				readCollection : function(type, callback) {
					callback([], undefined, undefined);
				},
				readEntity : function(type, callback) {
					callback([], undefined, undefined);
				}
			};
			var inject = {
				instances : {
					persistenceProxy : this.proxy,
					messageHandler : new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck()
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				},
				functions : {
					resetConfigurationHandler : function(appId) {
						assert.equal(appId, "removeIdA", "Expected parameter value for callback");
					}
				}
			};
			function initCallback(applicationHandler) {
				that.applicationHandler = applicationHandler;
			}
			new sap.apf.modeler.core.ApplicationHandler(inject, initCallback);
		}
	});
	QUnit.test("setAndSave() creates an application", function(assert) {
		assert.expect(4);
		var that = this;
		this.proxy.create = function(triggeredBy, appObject, callback) {
			assert.deepEqual(that.appObjectCreate, appObject, "OData proxy retrieves correct application object");
			assert.ok(typeof callback === "function", "OData proxy retrieves correct callback function");
			assert.equal(triggeredBy, "application", "OData proxy is triggered by ApplicationHandler");
			that.appObjectCreate.Application = "createId";
			callback(that.appObjectCreate, {}, undefined);
		};
		var callback = function(response, metadata, messageObject) {
			assert.equal(response, "createId", "Application ID returned");
		};
		this.applicationHandler.setAndSave(this.appObjectCreate, callback);
	});
	QUnit.test("save and update application without semantic object", function(assert) {
		assert.expect(2);
		this.proxy.create = function(triggeredBy, appObject, callback) {
			assert.equal(appObject.SemanticObject, "", "Empty string added to option semantic object");
		};
		this.applicationHandler.setAndSave(this.appObjectWithoutSemanticObject, function() {
		});
		this.proxy.update = function(triggeredBy, appObject, callback) {
			assert.equal(appObject.SemanticObject, "", "Empty string added to option semantic object");
		};
		this.applicationHandler.setAndSave(this.appObjectWithoutSemanticObject, function() {
		}, "myId");
	});
	QUnit.test("setAndSave(id) updates an application", function(assert) {
		assert.expect(4);
		var that = this;
		this.proxy.update = function(triggeredBy, appObject, callback, id) {
			assert.deepEqual(that.appObjectUpdate, appObject, "OData proxy retrieves correct application object");
			assert.ok(typeof callback === "function", "OData proxy retrieves correct callback function");
			assert.equal(triggeredBy, "application", "OData proxy is triggered by ApplicationHandler");
			that.appObjectUpdate.Application = "updateId";
			callback({}, undefined);
		};
		var callback = function(response, metadata, messageObject) {
			assert.equal(response, "updateId", "Application ID returned");
		};
		this.applicationHandler.setAndSave(this.appObjectUpdate, callback, "updateId");
	});
	QUnit.test("setAndSave(id, isImport) creates an application with an external id", function(assert) {
		assert.expect(1);
		this.proxy.create = function(type, appObject, callback) {
			assert.equal(appObject.Application, "externalCreateId", "Persistence proxy called with correct external id");
		};
		this.applicationHandler.setAndSave(this.appObjectCreate, function() {
		}, "externalCreateId", true);
	});
	QUnit.test("getList() reads all applications", function(assert) {
		assert.expect(4);
		var that = this;
		var counter = 0;
		var applicationList;
		this.proxy.create = function(triggeredBy, appObject, callback) {
			counter++;
			that.appObjectUpdate.Application = "createId" + counter;
			callback(that.appObjectUpdate, {}, undefined);
		};
		var callbackSave1 = function(response, metadata, messageObject) {
			applicationList = that.applicationHandler.getList();
			assert.ok(applicationList instanceof Array, "App list is instance of array");
			assert.equal(applicationList.length, 1, "App list has one application");
			assert.equal(applicationList[0].Application, "createId1", "List contains created app");
		};
		this.applicationHandler.setAndSave(this.appObjectCreate, callbackSave1);
		var callbackSave2 = function(response, metadata, messageObject) {
			applicationList = that.applicationHandler.getList();
			assert.equal(applicationList.length, 2, "App list has one application");
		};
		this.applicationHandler.setAndSave(this.appObjectCreate, callbackSave2);
	});
	QUnit.test("getApplication(id) reads requested application", function(assert) {
		assert.expect(1);
		var that = this;
		this.proxy.create = function(triggeredBy, appObject, callback) {
			that.appObjectUpdate.Application = "createId";
			callback(that.appObjectUpdate, {}, undefined);
		};
		var callbackSave = function(response, metadata, messageObject) {
			var application;
			application = that.applicationHandler.getApplication(response);
			assert.equal(application.Application, "createId", "Received app is correct");
		};
		this.applicationHandler.setAndSave(this.appObjectCreate, callbackSave);
	});
	QUnit.test("removeApplication(id) removes application by ID", function(assert) {
		assert.expect(4);
		this.proxy.remove = function(triggeredBy, id, callback) {
			assert.ok(typeof callback === "function", "OData proxy retrieves correct callback function");
			assert.equal(triggeredBy, "application", "OData proxy is triggered by ApplicationHandler");
			callback(id, {}, undefined);
		};
		var callback = function(response, metadata, messageObject) {
			assert.equal(response, "removeIdA", "Application ID returned");
		};
		this.applicationHandler.removeApplication("removeIdA", callback);
	});
	QUnit.test("getList() reads and sorts all applications", function(assert) {
		var that = this;
		var applicationList;
		var counter = 0;
		this.proxy.create = function(triggeredBy, appObject, callback) {
			counter++;
			appObject.Application = "createId" + counter;
			callback(appObject, {}, undefined);
		};
		var unsortedApplicationNames = ["Apf", "11", "äpg", "2", "1","Aph"];
		var sortedApplicationNames = ["1", "11", "2", "Apf", "äpg", "Aph"];
		var callbackSave = function () {};
		unsortedApplicationNames.forEach(function(appName){
			that.applicationHandler.setAndSave({ApplicationName: appName, SemanticObject: "SemanticObject"}, callbackSave);
		});
		applicationList = this.applicationHandler.getList();
		assert.equal(applicationList.length, 6, "Correct amount of applications");
		applicationList.forEach(function(application, index){
			assert.equal(application.ApplicationName , sortedApplicationNames[index], "Correct name in sorted list returned");
		});
	});
	QUnit.test("WHEN registerApplicationCreatedOnServer is called AND application is not yet existing", function(assert){
		var that = this;
		var counter = 0;
		this.proxy.create = function(triggeredBy, appObject, callback) {
			counter++;
			appObject.Application = "createId" + counter;
			callback(appObject, {}, undefined);
		};
		var callbackSave = function () {};
		["app1", "app2", "app3"].forEach(function(appName){
			that.applicationHandler.setAndSave({ApplicationName: appName, SemanticObject: "SemanticObject"}, callbackSave);
		});
		assert.strictEqual(this.applicationHandler.getList().length, 3, "THEN 3 applications exist");
		this.applicationHandler.registerApplicationCreatedOnServer("applicationId1", "importedConfiguration");
		assert.strictEqual(this.applicationHandler.getList().length, 4, "THEN 4 applications exist");
		var expectedEntry = {
			"Application": "applicationId1",
			"ApplicationName": "importedConfiguration",
			"SemanticObject": ""
		};
		assert.deepEqual(this.applicationHandler.getList()[3], expectedEntry, "THEN newly added application is returned in application list");
	});
	QUnit.test("WHEN registerApplicationCreatedOnServer is called AND application is already existing", function(assert){
		var that = this;
		var counter = 0;
		this.proxy.create = function(triggeredBy, appObject, callback) {
			counter++;
			appObject.Application = "createId" + counter;
			callback(appObject, {}, undefined);
		};
		var callbackSave = function () {};
		["app1", "app2", "app3"].forEach(function(appName){
			that.applicationHandler.setAndSave({ApplicationName: appName, SemanticObject: "SemanticObject"}, callbackSave);
		});
		var existingApps = this.applicationHandler.getList();
		assert.strictEqual(existingApps.length, 3, "THEN 3 applications exist");
		this.applicationHandler.registerApplicationCreatedOnServer("createId1", "app1");
		var appsAfterRegistration = this.applicationHandler.getList();
		assert.strictEqual(appsAfterRegistration.length, 3, "THEN no more applications");
		assert.deepEqual(existingApps, appsAfterRegistration, "THEN application list remains the same");
	});
}());
