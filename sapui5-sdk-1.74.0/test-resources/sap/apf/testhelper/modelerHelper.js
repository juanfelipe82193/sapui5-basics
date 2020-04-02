/**
 * Helper for creating standard objects of the modeler
 */
jQuery.sap.declare("sap.apf.testhelper.modelerHelper");

(function() {
	'use strict';

	sap.apf.testhelper.modelerHelper = sap.apf.testhelper.modelerHelper || {};
	sap.apf.testhelper.modelerHelper.createApplicationHandler = function(context, callback, serviceRoot) {
		var sRoot = serviceRoot || "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
		context.persistenceConfiguration = {
			serviceRoot : sRoot,
			developmentLanguage : "NN"
		};
		context.modelerCore = new sap.apf.modeler.core.Instance(context.persistenceConfiguration, {
			constructors : {
				MetadataFactory : context.MetadataFactory || sap.apf.core.MetadataFactory
			},
			probe : function(instances) {
				context.persistenceProxy = instances.persistenceProxy; // get instance of persistence proxy
				context.messageHandler = instances.messageHandler;
			}
		});
		context.modelerCore.getApplicationHandler(callback);
	};
	/**
	 * called in setup results in: context.configurationEditor, context.configurationHandler, context.applicationHandler,
	 * context.applicationCreatedForTest = guid of the application
	 */
	sap.apf.testhelper.modelerHelper.createConfigurationEditor = function(context, applicationConfiguration, serviceRoot, callback, assert, done) {

		sap.apf.testhelper.modelerHelper.createApplicationHandler(context, function(appHandler) {
			context.applicationHandler = appHandler;
			context.applicationHandler.setAndSave(applicationConfiguration, loadConfigurationHandler);
		}, serviceRoot);
		function loadConfigurationHandler(applicationCreatedForTest, metadata, messageObject) {
			context.applicationCreatedForTest = applicationCreatedForTest;
			if (messageObject) {
				assert.ok(messageObject, "creation of application failed");
				context.applicationCreatedForTest = undefined;
				done();
			} else {
				context.modelerCore.getConfigurationHandler(context.applicationCreatedForTest, createConfiguration);
			}
		}
		function createConfiguration(configurationHandler, messageObject) {
			var configurationObject = {
				AnalyticalConfigurationName : "test config A"
			};
			var tempConfigId;
			context.configurationHandler = configurationHandler;
			if (messageObject) {
				assert.ok(messageObject, "error occurred when loading the configurations and texts");
				context.applicationCreatedForTest = undefined;
				done();
			} else {
				tempConfigId = context.configurationHandler.setConfiguration(configurationObject);
				context.configurationHandler.loadConfiguration(tempConfigId, rememberConfigurationEditor);
			}
		}
		function rememberConfigurationEditor(configurationEditor) {
			context.configurationEditor = configurationEditor;
			callback();
		}
	};
	sap.apf.testhelper.modelerHelper.createConfigurationEditorWithSave = function(isMockServerActive, context, applicationConfiguration, callbackForSetup, callbackAfterSave, assert, done) {
		if (isMockServerActive) {
			sap.apf.core.constants.developmentLanguage = 'NN'; // <== overwrite '' with 'NN' for mock server use to avoid the creation of a GUID.
			sap.apf.testhelper.mockServer.activateDso();
			sap.apf.testhelper.mockServer.activateModeler();
			sap.apf.testhelper.modelerHelper.createConfigurationEditor(context, applicationConfiguration, undefined, createConfigEditorcallback, assert, done);
		} else {
			new sap.apf.testhelper.AuthTestHelper(done, function() {
				sap.apf.testhelper.modelerHelper.createConfigurationEditor(context, applicationConfiguration, "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata", createConfigEditorcallback, assert, done);
			});
		}
		function createConfigEditorcallback() {
			var ret = callbackForSetup();
			if (ret && ret.done) {
				ret.done(function(){
					context.configurationEditor.save(saveCallback);
				});
			} else {
				context.configurationEditor.save(saveCallback);	
			}
		}
		function saveCallback(configurationId, metaData, messageObject) {
			context.configurationIdCreatedByTest = configurationId;
			context.modelerCore = new sap.apf.modeler.core.Instance(context.persistenceConfiguration);
			context.modelerCore.getApplicationHandler(function() {
				context.modelerCore.getConfigurationHandler(context.applicationCreatedForTest, function(configurationHandler, messageObject) {
					context.configurationHandler = configurationHandler;
					context.configurationHandler.loadConfiguration(context.configurationIdCreatedByTest, function(configurationEditor) {
						context.configurationEditor = configurationEditor;
						callbackAfterSave();
					});
				});
			});
		}
	};
	sap.apf.testhelper.modelerHelper.removeApplication = function(context, assert) {
		if (context.applicationCreatedForTest && context.applicationHandler) {
            var done = assert.async();
			context.applicationHandler.removeApplication(context.applicationCreatedForTest, function() {
				done();
			});
		}
	};
}());