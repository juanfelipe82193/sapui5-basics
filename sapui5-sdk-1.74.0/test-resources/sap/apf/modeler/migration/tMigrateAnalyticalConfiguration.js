/**
* 
 */
/*global OData, window, configForTesting, ConfigurationForIntegrationTesting */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.apf.utils.utils');
(function() {
	'use strict';
	QUnit.module("Migrate analytical configuration", {
		beforeEach : function(assert) {
			this.inject = {
				instances : {
					messageHandler : new sap.apf.core.MessageHandler()
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				}
			};
			this.loadFile = function(filename) {
				var url = sap.apf.testhelper.determineTestResourcePath() + "/modeler/migration/" + filename;
				var returnValue;
				jQuery.ajax({
					url : url,
					dataType : "json",
					success : function(data) {
						returnValue = data;
					},
					error : function(oJqXHR, sStatus, sError) {
						assert.ok(false, "Error when retrieving data from file: " + url);
					},
					async : false
				});
				return returnValue;
			};
			this.openFileInWindow = function(file, windowTitle) {
				var encodedData = encodeURIComponent(file);
				var newTab;
				newTab = window.open("about:blank", "", "_blank");
				newTab.document.write("<textarea rows='50' cols='160'readonly>" + decodeURIComponent(encodedData) + "</textarea>");
				newTab.document.title = windowTitle;
			};
			this.migrate = function(filename) {
				var that = this;
				var oConfig;
				switch (filename) {
					case "ModelerIntegrationConfigForImportTesting.js":
						oConfig = configForTesting;
						break;
					case "TesthelperConfigConfigurationForIntegrationTesting.js":
						oConfig = ConfigurationForIntegrationTesting;
						break;
					default:
						oConfig = this.loadFile(filename);
				}
				if (oConfig instanceof Array) {
					oConfig.forEach(function(oTableEntry) {
						assert.ok(oTableEntry.AnalyticalConfigurationName && oTableEntry.SerializedAnalyticalConfiguration, 'AnalyticalConfigurationName: ' + oTableEntry.AnalyticalConfigurationName);
						var oConfForMigration = JSON.parse(oTableEntry.SerializedAnalyticalConfiguration);
						sap.apf.utils.migrateConfigToCategoryStepAssignment(oConfForMigration, that.inject);
						oTableEntry.SerializedAnalyticalConfiguration = JSON.stringify(oConfForMigration);
					});
				} else {
					sap.apf.utils.migrateConfigToCategoryStepAssignment(oConfig, this.inject);
				}
				this.openFileInWindow(JSON.stringify(oConfig), filename);
			};
		}
	});
	// DemokitAppConfigAnalyticalConfiguration.json
	var filename1 = "DemokitAppConfigAnalyticalConfiguration.json";
	QUnit.test(filename1, function(assert) {
		this.migrate(filename1);
		assert.ok(true, filename1 + " was migrated.");
	});
	// DemokitAppModelerDataAnalyticalConfigurationQueryResultsType.json
	var filename2 = "DemokitAppModelerDataAnalyticalConfigurationQueryResultsType.json";
	QUnit.test(filename2, function(assert) {
		this.migrate(filename2);
		assert.ok(true, filename2 + " was migrated.");
	});
	// ModelerIntegrationConfigForImportTesting.js
	var filename3 = "ModelerIntegrationConfigForImportTesting.js";
	QUnit.test(filename3, function(assert) {
		this.migrate(filename3);
		assert.ok(true, filename3 + " was migrated.");
	});
	//ResourcesConfigIntegrationSampleConfiguration.json
	var filename4 = "ResourcesConfigIntegrationSampleConfiguration.json";
	QUnit.test(filename4, function(assert) {
		this.migrate(filename4);
		assert.ok(true, filename4 + " was migrated.");
	});
	//ResourcesConfigSampleConfiguration.json
	var filename5 = "ResourcesConfigSampleConfiguration.json";
	QUnit.test(filename5, function(assert) {
		this.migrate(filename5);
		assert.ok(true, filename5 + " was migrated.");
	});
	//ResourcesConfigSampleConfiguration.json
	var filename6 = "ResourcesConfigSampleConfiguration.json";
	QUnit.test(filename6, function(assert) {
		this.migrate(filename6);
		assert.ok(true, filename6 + " was migrated.");
	});
	//TesthelperConfigAnalyticalConfigurationFromModeler1.json
	var filename7 = "TesthelperConfigAnalyticalConfigurationFromModeler1.json";
	QUnit.test(filename7, function(assert) {
		this.migrate(filename7);
		assert.ok(true, filename7 + " was migrated.");
	});
	//TesthelperConfigConfigurationForIntegrationTesting.js
	var filename8 = "TesthelperConfigConfigurationForIntegrationTesting.js";
	QUnit.test(filename8, function(assert) {
		this.migrate(filename8);
		assert.ok(true, filename8 + " was migrated.");
	});
	//TesthelperConfigConfigurationForIntegrationTesting.json
	var filename9 = "TesthelperConfigConfigurationForIntegrationTesting.json";
	QUnit.test(filename9, function(assert) {
		this.migrate(filename9);
		assert.ok(true, filename9 + " was migrated.");
	});
	//MockServerDataModelerAnalyticalConfigurationQueryResults.json
	var filename10 = "MockServerDataModelerAnalyticalConfigurationQueryResults.json";
	QUnit.test(filename10, function(assert) {
		this.migrate(filename10);
		assert.ok(true, filename10 + " was migrated.");
	});
}());
