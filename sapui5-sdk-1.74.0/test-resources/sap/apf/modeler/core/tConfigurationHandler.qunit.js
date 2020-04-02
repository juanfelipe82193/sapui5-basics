/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery, sinon */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.modeler.core.configurationHandler");
jQuery.sap.require("sap.apf.core.odataProxy");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.core.configurationFactory");
jQuery.sap.require("sap.apf.modeler.core.lazyLoader");
jQuery.sap.require("sap.apf.modeler.core.smartFilterBar");
(function() {
	'use strict';
	QUnit.module("M: Instantiation of ConfigurationHandler", {
		beforeEach : function() {
			var that = this;
			this.isSavedValue = false;
			var configurationEditor = function(configuration, inject, callbackAfterLoad) {
				var configurationName;
				if (inject.instances.configurationHandler.getConfiguration(configuration)) {
					configurationName = inject.instances.configurationHandler.getConfiguration(configuration).AnalyticalConfigurationName;
				}
				this.type = "configurationEditor";
				this.id = configuration.id || configuration;
				this.inject = inject;
				this.isSaved = function() {
					return that.isSavedValue;
				};
				this.serialize = function() {
					return {
						serializedConfig : "serializedConfig"
					};
				};
				this.copy = function(toNewId) {
					return {
						id : toNewId,
						value : "Object returned from copy method", 
						getConfigurationName : function(){
							return configurationName;
						} 
					};
				};
				this.save = function(callback) {
					inject.instances.configurationHandler.replaceConfigurationId(this.id, "serverGenId");
					if (inject.instances.configurationHandler.getConfiguration(this.id)) {
						configurationName = inject.instances.configurationHandler.getConfiguration(this.id).AnalyticalConfigurationName;
					}
					callback("serverGenId");
				};
				this.getConfigurationName = function() {
					return configurationName;
				};
				if (callbackAfterLoad) {
					callbackAfterLoad(this, undefined);
				}
			};
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.inject = {
					instances : {
						messageHandler : that.messageHandler,
						persistenceProxy : {
							//simple stub for reading timestamps of a configuration
							readEntity : function(entitySetName, callback, inputParameters, selectList) {
								callback({
									CreationUTCDateTime : "/Date(0000000000001)/",
									LastChangeUTCDateTime : "/Date(0000000000002)/"
								}, {}, null);
							}
						},
						metadataFactory : {}
					},
					constructors : {
						Hashtable : sap.apf.utils.Hashtable,
						ConfigurationEditor : configurationEditor,
						ConfigurationFactory : sap.apf.core.ConfigurationFactory,
						FacetFilter: sap.apf.modeler.core.FacetFilter,
						SmartFilterBar: sap.apf.modeler.core.SmartFilterBar,
						Step : function a() {
						},
						Representation : function b() {
						},
						ConfigurationObjects : function c() {
						},
						ElementContainer : function d() {
						},
						RegistryProbe : function e() {
						},
						LazyLoader : sap.apf.modeler.core.LazyLoader
					},
					functions : {
						getApplication : function(id) {
							return {
								Application : id,
								ApplicationName : "appName",
								SemanticObject : "semanticObject"
							};
						}
					}
			};
			that.configurationHandler = new sap.apf.modeler.core.ConfigurationHandler(this.inject);
			this.appId = "appId";
			this.existingConfig = {
					AnalyticalConfiguration : "existing",
					AnalyticalConfigurationName : "test config A",
					Application : "appId"
			};
			this.existingConfigurationOnDB = [ this.existingConfig ];
			var textPool = { exportTexts : function(analyticalConfigurationName) { return analyticalConfigurationName; }};
			this.configurationHandler.setApplicationIdAndContext(this.appId, this.existingConfigurationOnDB, textPool);
		},
		configObjectA : {
			AnalyticalConfigurationName : "test config A"
		},
		configObjectB : {
			AnalyticalConfigurationName : "test config B"
		}
	});
	QUnit.test("Create configuration handler and get application ID", function(assert) {
		this.configurationHandler.setConfiguration(this.configObjectA);
		assert.equal(this.configurationHandler.getApplicationId(), this.appId, "Returns right application ID");
	});
	QUnit.test("Create configuration and get list of configurations", function(assert) {
		var tempId = this.configurationHandler.setConfiguration(this.configObjectA);
		assert.ok(tempId.indexOf("apf1972-") === 0, "Temporary id returned after setConfiguration()");
		var configList = this.configurationHandler.getList();
		var expectedList = [ this.existingConfig, {
			AnalyticalConfiguration : tempId,
			AnalyticalConfigurationName : "test config A",
			Application : "appId"
		} ];
		assert.deepEqual(configList, expectedList, "Correct list of configurations returned");
		this.configurationHandler.removeAllConfigurations();
		assert.equal(this.configurationHandler.getList().length, 0, "Right list returned after remove all configurations");
	});
	QUnit.test("Update configuration and get list of configurations", function(assert) {
		var tempId = this.configurationHandler.setConfiguration(this.configObjectA);
		this.configurationHandler.setConfiguration(this.configObjectB, tempId);
		var configList = this.configurationHandler.getList();
		var expectedList = [ this.existingConfig, {
			AnalyticalConfiguration : tempId,
			AnalyticalConfigurationName : "test config B",
			Application : "appId"
		} ];
		assert.deepEqual(configList, expectedList, "Correct list of configurations returned");
	});
	QUnit.test("Save and get configuration", function(assert) {
		var tempId = this.configurationHandler.setConfiguration(this.configObjectA);
		var expectedConfig = {
				AnalyticalConfiguration : tempId,
				AnalyticalConfigurationName : "test config A",
				Application : "appId"
		};
		assert.deepEqual(this.configurationHandler.getConfiguration(tempId), expectedConfig, "Correct configuration returned");
	});
	QUnit.test("Load configuration - Right configurationEditor is returned", function(assert) {
		assert.expect(4);
		var configEditorInstance1;
		var configId1 = "configId1";
		var configId2 = "configId2";
		function firstCallback(configurationEditor) {
			configEditorInstance1 = configurationEditor;
			assert.equal(configurationEditor.type, "configurationEditor", "Object of type 'configurationEditor' was returned");
			assert.equal(configurationEditor.id, configId1, "ConfigurationEditor with right id returned");
		}
		function secondCallback(configurationEditor) {
			assert.equal(configurationEditor, configEditorInstance1, "Same configuration editor instance for same id returned");
		}
		function thirdCallback(configurationEditor) {
			assert.notEqual(configurationEditor, configEditorInstance1, "Different configuration editor instance for different id returned");
		}
		this.configurationHandler.loadConfiguration(configId1, firstCallback);
		this.configurationHandler.loadConfiguration(configId1, secondCallback);
		this.configurationHandler.loadConfiguration(configId2, thirdCallback);
	});
	QUnit.test("Load and reset configuration - New configurationEditor instance is returned", function(assert) {
		assert.expect(12);
		var configEditorInstance1, configEditorInstance2;
		var configId1 = "configId1";
		var configId2 = "configId2";
		function firstCallback(configurationEditor) {
			configEditorInstance1 = configurationEditor;
			assert.equal(configurationEditor.type, "configurationEditor", "Object of type 'configurationEditor' was returned");
			assert.equal(configurationEditor.id, configId1, "ConfigurationEditor with right id returned");
		}
		function secondCallback(configurationEditor) {
			configEditorInstance2 = configurationEditor;
			assert.equal(configurationEditor.type, "configurationEditor", "Object of type 'configurationEditor' was returned");
			assert.equal(configurationEditor.id, configId2, "ConfigurationEditor with right id returned");
		}
		var configId = this.configurationHandler.resetConfiguration("unknown Id");
		assert.ok(!configId, "WHEN resetConfiguration THEN a falsy value is returned on failure");
		this.configurationHandler.setConfiguration({}, configId1);
		this.configurationHandler.setConfiguration({}, configId2);
		this.configurationHandler.loadConfiguration(configId1, firstCallback);
		this.configurationHandler.loadConfiguration(configId2, secondCallback);
		configId = this.configurationHandler.resetConfiguration(configId2);
		assert.equal(configId, configId2, "WHEN resetConfiguration THEN the configuration id is returned on success");
		function firstCallbackAfterReset(configurationEditor) {
			assert.equal(configurationEditor.type, "configurationEditor", "Object of type 'configurationEditor' was returned");
			assert.equal(configurationEditor.id, configId1, "ConfigurationEditor with right id returned");
			assert.equal(configEditorInstance1, configurationEditor, "Same instance was returned");
		}
		function secondCallbackAfterReset(configurationEditor) {
			assert.equal(configurationEditor.type, "configurationEditor", "Object of type 'configurationEditor' was returned");
			assert.equal(configurationEditor.id, configId2, "ConfigurationEditor with right id returned");
			assert.notEqual(configEditorInstance2, configurationEditor, "GIVEN resetConfiguration() WHEN loadConfiguratione() THEN New configurationEditor instance is returned");
		}
		this.configurationHandler.loadConfiguration(configId1, firstCallbackAfterReset);
		this.configurationHandler.loadConfiguration(configId2, secondCallbackAfterReset);
	});
	QUnit.test("Load configuration, change configuration name and reset", function(assert) {
		var originalConfiguration = this.configurationHandler.getList()[0];
		var id = originalConfiguration.AnalyticalConfiguration;
		var originalName = originalConfiguration.AnalyticalConfigurationName;
		this.configurationHandler.loadConfiguration(id, function() {
		});
		this.configurationHandler.setConfiguration({
			AnalyticalConfigurationName : 'New temporary name'
		}, id);
		this.configurationHandler.resetConfiguration(id);
		assert.equal(this.configurationHandler.getList()[0].AnalyticalConfigurationName, originalName, 'Original name restored after reset');
	});
	QUnit.test("Update configuration name", function(assert){
		
		var originalConfiguration = this.configurationHandler.getList()[0];
		var id = originalConfiguration.AnalyticalConfiguration;
		this.configurationHandler.loadConfiguration(id, function() {
		});
		this.configurationHandler.updateConfigurationName(id, "newConfigurationName");
		this.configurationHandler.resetConfiguration(id);
		
		assert.equal(this.configurationHandler.getList()[0].AnalyticalConfigurationName, "newConfigurationName", 'Updated name expected');
	});
	QUnit.test("Load configuration with configuration object containing the configuration id", function(assert) {
		assert.expect(1);
		var configId = {
				id : "configId"
		};
		function callback(configurationEditor) {
			assert.equal(configurationEditor.id, configId.id, "ConfigurationEditor with right id returned");
		}
		this.configurationHandler.loadConfiguration(configId, callback);
	});
	QUnit.test("Load configuration with configuration object containing the property updateExisting", function(assert) {
		assert.expect(1);
		var that = this;
		var config = {
				id : "configId"
		};
		var configUpdateExisting = {
				id : "configId",
				updateExisting : true
		};
		var configEditorBeforUpdate;
		this.configurationHandler.loadConfiguration(config, firstCallback);
		function firstCallback(configurationEditor) {
			configEditorBeforUpdate = configurationEditor;
			that.configurationHandler.loadConfiguration(configUpdateExisting, secondCallback);
		}
		function secondCallback(configurationEditor) {
			assert.notEqual(configEditorBeforUpdate, configurationEditor);
		}
	});
	QUnit.test("Load configuration - Right objects are injected to the configurationEditor", function(assert) {
		var that = this;
		assert.expect(13);
		var configId1 = "configId1";
		function firstCallback(configurationEditor) {
			assert.equal(configurationEditor.inject.instances.messageHandler, that.inject.instances.messageHandler, "MessageHandler instance was injected");
			assert.equal(configurationEditor.inject.instances.configurationHandler, that.configurationHandler, "ConfigurationHandler constructor was injected");
			assert.equal(configurationEditor.inject.instances.persistenceProxy, that.inject.instances.persistenceProxy, "PersistenceProxy was injected");
			assert.equal(configurationEditor.inject.instances.metadataFactory, that.inject.instances.metadataFactory, "MetadataFactory was injected");
			assert.equal(configurationEditor.inject.constructors.Step, that.inject.constructors.Step, "Step constructor was injected");
			assert.equal(configurationEditor.inject.constructors.ConfigurationFactory, that.inject.constructors.ConfigurationFactory, "ConfigurationFactory constructor was injected");
			assert.equal(configurationEditor.inject.constructors.Representation, that.inject.constructors.Representation, "Representation constructor was injected");
			assert.equal(configurationEditor.inject.constructors.ConfigurationObjects, that.inject.constructors.ConfigurationObjects, "Configuration objects constructor was injected");
			assert.equal(configurationEditor.inject.constructors.ElementContainer, that.inject.constructors.ElementContainer, "Element container objects constructor was injected");
			assert.equal(configurationEditor.inject.constructors.Hashtable, that.inject.constructors.Hashtable, "Hashtable constructor was injected");
			assert.equal(configurationEditor.inject.constructors.RegistryProbe, that.inject.constructors.RegistryProbe, "Registry probe constructor was injected");
			assert.equal(configurationEditor.inject.constructors.FacetFilter, that.inject.constructors.FacetFilter, "Facet Filter constructor was injected");
			assert.equal(configurationEditor.inject.constructors.SmartFilterBar, that.inject.constructors.SmartFilterBar, "SmartFilterBar constructor was injected");
		}
		this.configurationHandler.loadConfiguration(configId1, firstCallback);
	});
	QUnit.test("Replace temporary id with server generated id", function(assert) {
		assert.expect(3);
		var configEditorTempIdInstance;
		var serverGeneratedId = "serverGeneratedId";
		var expectedList = [ this.existingConfig, {
			AnalyticalConfiguration : serverGeneratedId,
			AnalyticalConfigurationName : "test config A",
			Application : "appId"
		} ];
		var tempId = this.configurationHandler.setConfiguration(this.configObjectA);
		function callbackTempId(configurationEditor) {
			configEditorTempIdInstance = configurationEditor;
		}
		this.configurationHandler.loadConfiguration(tempId, callbackTempId);
		this.configurationHandler.replaceConfigurationId(tempId, serverGeneratedId);
		var configList = this.configurationHandler.getList();
		assert.deepEqual(configList, expectedList, "Temporary id successfully replaced by server generated id");
		function callbackServerGeneratedId(configurationEditor) {
			assert.equal(configurationEditor, configEditorTempIdInstance, "Same configuration editor instance is returned when loading with serverGeneratedId");
		}
		this.configurationHandler.loadConfiguration(serverGeneratedId, callbackServerGeneratedId);
		this.configurationHandler.replaceConfigurationId(serverGeneratedId, serverGeneratedId);
		var configList = this.configurationHandler.getList();
		assert.deepEqual(configList, expectedList, "Call replaceConfigurationId() with serverGeneratedId twice, does not remove the editor instance");
	});
	QUnit.test("Export configuration", function(assert) {
		var that = this;
		var configId = this.configurationHandler.setConfiguration(this.configObjectA);
		var expectedExport = {
				serializedConfig : "serializedConfig",
				configHeader : {
					Application : "appId",
					ApplicationName : "appName",
					SemanticObject : "semanticObject",
					AnalyticalConfiguration : configId, //temp id remains because we do not simulate save
					AnalyticalConfigurationName : "test config A",
					UI5Version : sap.ui.version,
					CreationUTCDateTime : "/Date(0000000000001)/",
					LastChangeUTCDateTime : "/Date(0000000000002)/"
				}
		};
		this.configurationHandler.exportConfiguration(configId, firstCallback);
		function firstCallback(configuration) {
			assert.equal(that.messageHandler.spyResults.putMessage.code, "11007", "Correct error message logged when trying to export unsaved configuration");
			assert.equal(configuration, null, "If export is not possible, parameter in callback is undefined");
		}
		this.isSavedValue = true;
		this.configurationHandler.exportConfiguration(configId, secondCallback);
		function secondCallback(configuration) {
			assert.deepEqual(JSON.parse(configuration), expectedExport, "Default configuration expected");
		}
		var textExport = this.configurationHandler.exportTexts(configId);
		assert.equal(textExport, "test config A", "THEN the export function is called with proper name of the analytical configuration");
	});
	QUnit.test("GIVEN configurationHandler", function(assert) {
		var that = this, tempId;
		assert.expect(7);
		that.configurationHandler = new sap.apf.modeler.core.ConfigurationHandler(this.inject);
		tempId = that.configurationHandler.setConfiguration(this.configObjectA);
		assert.equal(that.configurationHandler.getList().length, 1, "One configuration added to handler");
		this.configurationHandler.copyConfiguration(tempId, callbackAfterCopy);
		function callbackAfterCopy(newConfigId) {
			var oConfig = that.configurationHandler.getConfiguration(tempId);
			assert.ok(oConfig, " WHEN copy configuration THEN copied Id still exists");
			assert.equal(oConfig.AnalyticalConfiguration, tempId, " WHEN copy configuration THEN copied instance keeps the right Id");
			assert.notEqual(tempId, newConfigId, " WHEN copy configuration THEN new Id generated for copy");
			assert.equal(that.configurationHandler.getList().length, 2, "WHEN copy configuration THEN new configuration added to handler");
			that.configurationHandler.loadConfiguration(newConfigId, callbackAfterLoadConfiguration);
			function callbackAfterLoadConfiguration(configEditor) {
				assert.equal(configEditor.id, newConfigId, "WHEN copy configuration THEN copied configuration editor with newId is returned");
				assert.equal(configEditor.value, "Object returned from copy method", "WHEN copy configuration THEN copied config editor from method copyConfiguration is returend");
			}
		}
	});
	QUnit.test("Load, memorize and restore memorized configuration", function(assert) {
		var configId1 = "configId1";
		var configEditorInstance1;
		var changedConfigObject = {AnalyticalConfigurationName: "changed configuration name", AnalyticalConfiguration: "configId1", Application: "appId"};
		assert.expect(13);
		var configId = this.configurationHandler.memorizeConfiguration(configId1);
		assert.ok(!configId, "GIVEN configurationHandler WHEN memorize for a not existing configuration THEN a falsy value is returned");
		var configAfterRestore = this.configurationHandler.restoreMemorizedConfiguration(configId1);
		assert.ok(!configAfterRestore, "GIVEN configurationHandler WHEN restore without memorize THEN a falsy value is returned");
		function callbackAfterFirstLoad(configurationEditor) {
			configEditorInstance1 = configurationEditor;
			assert.equal(configurationEditor.type, "configurationEditor", "Object of type 'configurationEditor' is returned");
			assert.equal(configurationEditor.id, configId1, "ConfigurationEditor with right id returned");
		}
		this.configurationHandler.setConfiguration(this.configObjectA, configId1);
		this.configurationHandler.loadConfiguration(configId1, callbackAfterFirstLoad);
		var configId = this.configurationHandler.memorizeConfiguration(configId1);
		assert.equal(configId, configId1, "GIVEN configurationHandler WHEN memorize for an existing configuration THEN configuration id is returned");
		function callbackAfterSecondLoad(configurationEditor) {
			assert.equal(configurationEditor, configEditorInstance1, "Same instance is returned");
			assert.equal(configurationEditor.type, "configurationEditor", "Object of type 'configurationEditor' is returned");
			assert.equal(configurationEditor.id, configId1, "ConfigurationEditor with right id returned");
		}
		this.configurationHandler.loadConfiguration(configId1, callbackAfterSecondLoad);
		this.configurationHandler.setConfiguration(changedConfigObject, configId1);
		configAfterRestore = this.configurationHandler.restoreMemorizedConfiguration(configId1);
		assert.equal(configAfterRestore.id, configId1, "GIVEN restoreMemorizedConfiguration WHEN load THEN copied configuration has correct id");
		assert.equal(configAfterRestore.value, "Object returned from copy method", "GIVEN restoreMemorizedConfiguration WHEN load THEN correct configuration editor returned");
		function callbackAfterThirdLoad(configurationEditor) {
			assert.notEqual(configEditorInstance1, configurationEditor, "GIVEN restoreMemorizedConfiguration WHEN load THEN new instance is returned");
			assert.equal(configurationEditor, configAfterRestore, "GIVEN restoreMemorizedConfiguration WHEN load THEN restored configuration is returned");
			assert.equal(configurationEditor.getConfigurationName(), "test config A", "AnalyticalConfigurationName successfully restored");
		}
		this.configurationHandler.loadConfiguration(configId1, callbackAfterThirdLoad);
	});
	QUnit.test("Remove buffered configuration", function(assert) {
		assert.expect(5);
		var odataProxyCalled = false;
		this.inject.instances.persistenceProxy.remove = function(entitySetName, inputParameters, callback) {
			odataProxyCalled = true;
		};
		var configurationHandler = new sap.apf.modeler.core.ConfigurationHandler(this.inject);
		var configurationEditor;
		var configId = configurationHandler.setConfiguration(this.configObjectA);
		configurationHandler.loadConfiguration(configId, function(configEditor) {
			configurationEditor = configEditor;
			configurationHandler.removeConfiguration(configId, removeCallback);
		});
		function removeCallback(id, metadata, messageObject) {
			assert.equal(id, configId, "Correct id in remove callback provided");
			assert.equal(messageObject, undefined, "No error during remove");
			assert.equal(configurationHandler.getList().length, 0, "No configuration included");
			assert.ok(!odataProxyCalled, "OData proxy not called when configuration is not saved");
			configurationHandler.loadConfiguration(id, function(configEditor) {
				assert.notEqual(configEditor, configurationEditor, "Configuration editor instance removed in internal hashtable of configuration handler");
			});
		}
	});
	QUnit.test("Remove saved configuration from server", function(assert) {
		assert.expect(6);
		this.inject.instances.persistenceProxy = {
				remove : function(entitySetName, inputParameters, callback) {
					assert.equal(entitySetName, "configuration", "OData proxy called with correct type");
					assert.equal(inputParameters[0].name, "AnalyticalConfiguration", "OData proxy called with correct type");
					callback(undefined, undefined);
				}
		};
		var configurationHandler = new sap.apf.modeler.core.ConfigurationHandler(this.inject);
		var configId;
		var configurationEditor;
		var tmpConfigId = configurationHandler.setConfiguration(this.configObjectA);
		configurationHandler.loadConfiguration(tmpConfigId, function(configEditor) {
			configurationEditor = configEditor;
			configEditor.save(function(configurationId, metadata, messageObject) {
				configId = configurationId;
				configurationHandler.removeConfiguration(configId, removeCallback);
			});
		});
		function removeCallback(id, metadata, messageObject) {
			assert.equal(id, configId, "Correct id in remove callback provided");
			assert.equal(messageObject, undefined, "No error during remove");
			assert.equal(configurationHandler.getList().length, 0, "Configuration successfully removed from hashtable");
			configurationHandler.loadConfiguration(id, function(configEditor) {
				assert.notEqual(configEditor, configurationEditor, "Configuration editor instance removed in internal hashtable of configuration handler");
			});
		}
	});
	
	QUnit.test("Remove saved configuration from server failed", function(assert) {
		assert.expect(4);
		this.inject.instances.persistenceProxy = {
				remove : function(entitySetName, inputParameters, callback) {
					callback(undefined, {
						message : "object"
					});
				}
		};
		var configurationHandler = new sap.apf.modeler.core.ConfigurationHandler(this.inject);
		var configId;
		var configurationEditor;
		var tmpConfigId = configurationHandler.setConfiguration(this.configObjectA);
		configurationHandler.loadConfiguration(tmpConfigId, function(configEditor) {
			configurationEditor = configEditor;
			configEditor.save(function(configurationId, metadata, messageObject) {
				configId = configurationId;
				configurationHandler.removeConfiguration(configId, removeCallback);
			});
		});
		function removeCallback(id, metadata, messageObject) {
			assert.equal(id, configId, "Correct id in remove callback provided");
			assert.ok(messageObject, "Message object returned");
			assert.equal(configurationHandler.getList().length, 1, "Configuration still exists in hashtable");
			configurationHandler.loadConfiguration(id, function(configEditor) {
				assert.equal(configEditor, configurationEditor, "Configuration editor instance still available in internal hashtable of configuration handler");
			});
		}
	});
}());
