/*!
 * SAP APF Analysis Path Framework
 *
 * Copyright (C) 2009-2019 SAP AG or an SAP affiliate company. All rights reserved
 */
/*global sap, jQuery, sinon */
sap.ui.define([
	'sap/apf/modeler/core/instance',
	'sap/apf/modeler/Component',
	'sap/apf/core/odataProxy',
	'sap/apf/testhelper/helper',
	'sap/apf/testhelper/ushellHelper',
	'sap/apf/testhelper/doubles/sessionHandlerStubbedAjax'
], function(
	ModelerCoreInstance,
	ModelerComponent,
	ODataProxy,
	testHelper,
	ushellHelper,
	SessionHandlerStubbedAjax
) {
	'use strict';

	/*BEGIN_COMPATIBILITY*/
	ModelerCoreInstance = ModelerCoreInstance || sap.apf.modeler.core.Instance;
	ModelerComponent = ModelerComponent || sap.apf.modeler.Component;
	ODataProxy = ODataProxy || sap.apf.core.OdataProxy;
	/*END_COMPATIBILITY*/

	jQuery.sap.require("sap.apf.core.odataProxy");

	function createInstance(inject) {
		// eslint-disable-next-line no-new
		return new ModelerCoreInstance({}, inject);
	}
	var manifestForCloudFoundryProxy = {
		"sap.app": {
			dataSources: {
				"apf.designTime.customer.applications": {
					uri: "/hugo"
				},
				"apf.designTime.customer.analyticalConfigurations": {
					uri: "/otto"
				},
				"apf.designTime.customer.applicationAndAnalyticalConfiguration": {
					uri: "/hans"
				},
				"apf.designTime.textFileAndAnalyticalConfigurations": {
					uri: "/walter"
				},
				"apf.designTime.textFiles": {
					uri: "/ingo"
				},
				"apf.designTime.vendor.importToCustomerLayer": {
					uri: "/vendorContent"
				},
				"apf.designTime.vendor.analyticalConfigurations": {
					uri: "/vendorContentConf"
				}
			}
		}
	};

	function StartParameterDouble() {

		this.isLrepActive = function() { return true; };
		this.getSapSystem = function() { return undefined; };
	}
	function setupModelerInstance(oContext, assert) {
		var that = oContext;
		function ApplicationHandlerStub(inject, initCallback) {
			this.getApplication = function(id) {
				if (id === that.expectedApplicationId) {
					return {};
				}
				return undefined;
			};
			initCallback(this);
		}
		function PersistenceProxyStub() {
			this.readCollection = function(entityType, callbackFunction, inputParameters, selectList, filter, async) {
				callbackFunction([], undefined, undefined);
			};
			this.doChangeOperationsInBatch = function(requestConfigurations, callback) {
				assert.equal(requestConfigurations.length, 3);
				callback(undefined);
			};
		}
		var inject = {
			instances : {
				 component : { getMetadata : function() {
					return {
						getManifest : function() { return {}; }
					};
				}}
			},
			constructors : {
				ApplicationHandler : ApplicationHandlerStub,
				PersistenceProxy : PersistenceProxyStub
			},
			functions: {
				isUsingCloudFoundryProxy : that.isUsingCloudFoundryProxy
			}
		};
		that.modelerInstance = createInstance(inject);
	}
	function setupModelerInstanceForLrep(oContext, assert) {
		var that = oContext;
		oContext.spyConfigurationSet = {};
		function ConfigurationHandlerDouble() {
			this.getList = function() {
				return [ {
					AnalyticalConfiguration : that.configIdForRepeatedImport
				} ];
			};
			this.setApplicationIdAndContext = function(id) {
			};
			this.setConfiguration = function(configuration, id) {
				oContext.spyConfigurationSet = configuration;
			};
			this.loadConfiguration = function(configuration, callback) {
				callback(new ConfigurationEditorSpy(configuration));
			};
		}
		function ConfigurationEditorSpy(configuration) {
			this.save = function(callback) {
				callback(configuration.id, {}, undefined);
			};
		}
		function ApplicationHandlerStub(inject, initCallback) {
			this.getApplication = function(id) {
				if (id === that.expectedApplicationID) {
					return {};
				}
				return undefined;
			};
			this.getList = function () {
				return [];
			};
			this.setAndSave = function(appObject, callback, id, isImport) {
				callback(appObject.Application, {}, undefined);
			};
			initCallback(this);
		}
		function PersistenceProxyStub() {
			var textsFromVendorRead = false;
			this.readCollectionsInBatch = function(requestConfigurations, initTextPoolAndConfigurationHandler) {
				var data = [ [], [] ];
				initTextPoolAndConfigurationHandler(data);
			};
			this.create = function(entitySetName, data, callback, async, options) {
				if (entitySetName === 'application') {
					assert.ok(async === undefined || async === true, 'THEN o async creation of application');
					assert.equal(options.layer, "CUSTOMER", 'THEN application is created in CUSTOMER layer');
					callback({
						Application : that.expectedApplicationID,
						ApplicationName : data.ApplicationName,
						SemanticObject : data.SemanticObject
					}, {});
				} 
			};
			this.readCollection = function(entityType, callbackFunction, inputParameters, selectList, filter, options) {
 
				var applications = [];
				if (entityType === 'application') {
					applications.push({ Application: that.expectedApplicationID, ApplicationName : "appName"});
					callbackFunction(applications, {});
					return;
				}
				var aTerms;

				aTerms = filter.getFilterTermsForProperty('Application');
				var application = aTerms[0].getValue();
				var texts = [ {
					TextElement : "143EC63F05550175E10000000A445B6D",
					Language : "",
					TextElementType : "XTIT",
					TextElementDescription : "TITLE1",
					MaximumLength : 30,
					Application : application,
					TranslationHint : "Hint",
					LastChangeUTCDateTime : "/Date(1412692222731)/"
				}, {
					TextElement : "243EC63F05550175E10000000A445B6D",
					Language : "",
					TextElementType : "XTIT",
					TextElementDescription : "TITLE2",
					MaximumLength : 30,
					Application : application,
					TranslationHint : "Hint",
					LastChangeUTCDateTime : "/Date(1412692229733)/"
				}, {
					TextElement : "343EC63F05550175E10000000A445B6D",
					Language : "",
					TextElementType : "XLAB",
					TextElementDescription : "uniqueLabelText",
					MaximumLength : 15,
					Application : application,
					TranslationHint : "Hint",
					LastChangeUTCDateTime : "/Date(1412690202721)/"
				} ];
				if(entityType === "texts"){
					if(!textsFromVendorRead){
						assert.equal(options.layer, "VENDOR", "Then correct Layer is given");
						textsFromVendorRead = true;
					}
				}
				callbackFunction(texts, undefined, undefined);
			};
			this.readAllConfigurationsFromVendorLayer = function() {
				var deferred = jQuery.Deferred();
				var configuration = that.configIdForRepeatedImport; 
				var application = that.existingAppID;
				deferred.resolve([{ applicationText: "appName", configurationText : "config" , value : application + '.' + configuration}]);
				return deferred.promise();
			};
			this.readEntity = function(entitySetName, callback, inputParameters, selectList, application, options) {
				if(entitySetName === "configuration" && options.layer === "VENDOR"){
					var data = { Application : application,
							     AnalyticalConfiguration : inputParameters[0].value
							     };
					data.SerializedAnalyticalConfiguration = {
							serializedConfig : {
								a : {
									type : "label",
									kind : "text",
									key : "143EC63F05550175E10000000A445B6D"
								},
								b : {
									type : "label",
									kind : "text",
									key : "243EC63F05550175E10000000A445B6D"
								}
							},
							configHeader : {
								Application : "Invalid application GUID",
								ApplicationName : "appName",
								SemanticObject : "semanticObject",
								AnalyticalConfiguration : inputParameters[0].value,
								AnalyticalConfigurationName : "Configuration name",
								UI5Version : sap.ui.version,
								CreationUTCDateTime : "01.04.1972",
								LastChangeUTCDateTime : "02.04.1972"
							}
						};
					data.SerializedAnalyticalConfiguration = JSON.stringify(data.SerializedAnalyticalConfiguration);
					callback(data, {}, undefined);
					return;
				}
			};
			this.doChangeOperationsInBatch = function(requestConfigurations, callback) {
				assert.equal(requestConfigurations.length, 3);
				callback(undefined);
			};
		}
		var inject = {
			instances : {
				component : { getMetadata : function() {
					return {
						getManifest : function() { return {}; }
					};
				}}
			},
			constructors : {
				ApplicationHandler : ApplicationHandlerStub,
				ConfigurationHandler: ConfigurationHandlerDouble,
				PersistenceProxy : PersistenceProxyStub
			}
		};
		that.modelerInstance = createInstance(inject);
	}
	QUnit.module("M: Basic", {
		beforeEach : function(assert) {
			setupModelerInstance(this, assert);
		}
	});
	QUnit.test("WHEN get the representation types", function(assert) {
		var representationTypes = this.modelerInstance.getRepresentationTypes();
		var predefinedRepresentationTypes = sap.apf.core.representationTypes();
		predefinedRepresentationTypes.forEach(function(predefinedRepresentationType) {
			var i = 0;
			var found = false;
			for(i = 0; i < representationTypes.length; i++) {
				if (representationTypes[i].id === predefinedRepresentationType.id) {
					found = true;
					assert.deepEqual(predefinedRepresentationType, representationTypes[i], "THEN equals predefined representationTypes");
				}
			}
			if (!found) {
				assert.ok(false, "Predefined representation type does not exist");
			}
		});
	});
	QUnit.module("M: Import Texts", {
		beforeEach : function(assert) {
			setupModelerInstance(this, assert);
		},
		generateTextPropertyFile : function(applicationId, uuid, bAddInvalidEntry) {
			var propertyFileForImport = "#FIORI: insert Fiori-Id\n" + "# __ldi.translation.uuid=" + uuid + "\n" + "#ApfApplicationId=" + applicationId + "\n\n" + "#XLAB,15:Hint\n" + "343EC63F05550175E10000000A445B6D=uniqueLabelText\n"
					+ "# LastChangeDate=2014/10/07 15:56:42\n\n" + "#XTIT,30:Hint\n" + "143EC63F05550175E10000000A445B6D=TITLE1\n" + "# LastChangeDate=2014/10/07 16:30:22\n\n" + "#XTIT,30:Hint\n" + "243EC63F05550175E10000000A445B6D=TITLE2\n"
					+ "# LastChangeDate=2014/10/07 16:30:29\n\n";
			if (bAddInvalidEntry) {
				propertyFileForImport = propertyFileForImport + "#XTIT,30:Hint\n" + "invalidKey=TITLE99\n" + "# LastChangeDate=2014/10/07 16:30:22\n\n";
			}
			return propertyFileForImport;
		}
	});
	QUnit.test("Import valid text file for existing application", function(assert) {
		this.expectedApplicationId = "543EC63F05550175E10000000A445B6D";
		var translationUuid = "543ec63f-0555-0175-e100-00000a445b6d";
		var propertyFileForImport = this.generateTextPropertyFile(this.expectedApplicationId, translationUuid);
		this.modelerInstance.importTexts(propertyFileForImport, function(messageObject) {
			assert.equal(messageObject, undefined, "No errors expected");
		});
	});
	QUnit.test("Import text file for non-existing application", function(assert) {
		this.expectedApplicationId = "543EC63F05550175E10000000A445B6D";
		var expectedUuid = "543ec63f-0555-0175-e100-00000a445b6d";
		var propertyFileForImport = this.generateTextPropertyFile("343EC63F05550175E10000000A445B6D", expectedUuid);
		this.modelerInstance.importTexts(propertyFileForImport, function(messageObject) {
			assert.equal(messageObject.getCode(), 11021, "Correct error code");
		});
	});
	QUnit.test("Import text file with errors in format of textElement entry", function(assert) {
		this.expectedApplicationId = "543EC63F05550175E10000000A445B6D";
		var expectedUuid = "543ec63f-0555-0175-e100-00000a445b6d";
		var propertyFileForImport = this.generateTextPropertyFile(this.expectedApplicationId, expectedUuid, true);
		this.modelerInstance.importTexts(propertyFileForImport, function(messageObject) {
			assert.equal(messageObject.getCode(), 11020, "Correct error code for general error message");
			assert.equal(messageObject.getPrevious().getCode(), 5412, "Correct error code for the invalid format");
		});
	});
	QUnit.module("M: Import Texts on Cloud Foundry", {
		beforeEach : function(assert) {
			this.isUsingCloudFoundryProxy = function() { return true; };
			setupModelerInstance(this, assert);
		},
		generateTextPropertyFile : function(applicationId, uuid, bAddInvalidEntry) {
			var propertyFileForImport = "#FIORI: insert Fiori-Id\n" + "# __ldi.translation.uuid=" + uuid + "\n" + "#ApfApplicationId=" + applicationId + "\n\n" + "#XLAB,15:Hint\n" + "343EC63F05550175E10000000A445B6D=uniqueLabelText\n"
					+ "# LastChangeDate=2014/10/07 15:56:42\n\n" + "#XTIT,30:Hint\n" + "143EC63F05550175E10000000A445B6D=TITLE1\n" + "# LastChangeDate=2014/10/07 16:30:22\n\n" + "#XTIT,30:Hint\n" + "243EC63F05550175E10000000A445B6D=TITLE2\n"
					+ "# LastChangeDate=2014/10/07 16:30:29\n\n";
			if (bAddInvalidEntry) {
				propertyFileForImport = propertyFileForImport + "#XTIT,30:Hint\n" + "invalidKey=TITLE99\n" + "# LastChangeDate=2014/10/07 16:30:22\n\n";
			}
			return propertyFileForImport;
		}
	});
	QUnit.test("Import valid text file for existing application", function(assert) {
		this.expectedApplicationId = "543EC63F05550175E10000000A445B6D";
		var translationUuid = "543ec63f-0555-0175-e100-00000a445b6d";
		var propertyFileForImport = this.generateTextPropertyFile(this.expectedApplicationId, translationUuid);
		this.modelerInstance.importTexts(propertyFileForImport, function(messageObject) {
			assert.equal(messageObject, undefined, "No errors expected");
		});
	});
	QUnit.test("Import text file for non-existing application", function(assert) {
		this.expectedApplicationId = "543EC63F05550175E10000000A445B6D";
		var expectedUuid = "543ec63f-0555-0175-e100-00000a445b6d";
		var propertyFileForImport = this.generateTextPropertyFile("343EC63F05550175E10000000A445B6D", expectedUuid);
		this.modelerInstance.importTexts(propertyFileForImport, function(messageObject) {
			assert.equal(messageObject.getCode(), 11021, "Correct error code");
		});
	});
	QUnit.test("Import text file with errors in format of textElement entry", function(assert) {
		this.expectedApplicationId = "543EC63F05550175E10000000A445B6D";
		var expectedUuid = "543ec63f-0555-0175-e100-00000a445b6d";
		var propertyFileForImport = this.generateTextPropertyFile(this.expectedApplicationId, expectedUuid, true);
		this.modelerInstance.importTexts(propertyFileForImport, function(messageObject) {
			assert.equal(messageObject.getCode(), 11020, "Correct error code for general error message");
			assert.equal(messageObject.getPrevious().getCode(), 5412, "Correct error code for the invalid format");
		});
	});
	QUnit.module("M: Import Configuration", {
		beforeEach : function(assert) {
			var testContext = this;
			this.existingAppID = testHelper.generateGuidForTesting();
			this.nonExistingAppID = testHelper.generateGuidForTesting();
			this.configIdForRepeatedImport = testHelper.generateGuidForTesting();
			this.configIdForFirstImport = testHelper.generateGuidForTesting();
			this.applicationHandlerCalled = false;
			this.spySetAndSave = {};
			this.spyConfiguration = {};
			function ApplicationHandlerStub(inject, initCallback) {
				testContext.applicationHandlerCalled = true;
				this.getList = function() {
					return [ {
						Application : testContext.existingAppID
					} ];
				};
				this.setAndSave = function(appObject, callback, id, isImport) {
					testContext.spySetAndSave.appObject = appObject;
					testContext.spySetAndSave.id = id;
					testContext.spySetAndSave.isImport = isImport;
					callback(appObject.Application, {}, undefined);
				};
				initCallback(this);
			}
			function ConfigurationHandlerDouble() {
				testContext.spyConfigurationHandlerInstantiated = true;
				this.getList = function() {
					return [ {
						AnalyticalConfiguration : testContext.configIdForRepeatedImport
					} ];
				};
				this.setApplicationIdAndContext = function(id) {
					testContext.spyApplicationId = id;
				};
				this.setConfiguration = function(configuration, id) {
					testContext.spyConfiguration.configuration = configuration;
					testContext.spyConfiguration.id = id;
					return id || "apf1972-tempId";
				};
				this.loadConfiguration = function(configuration, callback) {
					callback(new ConfigurationEditorSpy(configuration));
				};
			}
			function ConfigurationEditorSpy(configuration) {
				this.save = function(callback) {
					testContext.spyConfigSaved = true;
					callback();
				};
				testContext.spyConfigurationPassedToEditor = configuration;
			}
			function PersistenceProxyStub() {
				this.readCollectionsInBatch = function(requestConfigurations, initTextPoolAndConfigurationHandler) {
					var data = [ [], [] ];
					initTextPoolAndConfigurationHandler(data);
				};
			}
			var inject = {
					instances : {
						component : { getMetadata : function() {
							return {
								getManifest : function() { return {}; }
							};
						}}
					},
					constructors : {
						ApplicationHandler : ApplicationHandlerStub,
						ConfigurationHandler : ConfigurationHandlerDouble,
						ConfigurationEditor : ConfigurationEditorSpy,
						PersistenceProxy : PersistenceProxyStub
					}
				};
			this.instance = createInstance(inject);
			this.getImportObject = function (applicationId, configurationId, textId1, textId2){
				if(!textId1){
					textId1 = testHelper.generateGuidForTesting();
				}
				if(!textId2){
					textId2 = testHelper.generateGuidForTesting();
				}
				return JSON.stringify({
					serializedConfig : {
						a : {
							type : "label",
							kind : "text",
							key : textId1
						},
						b : {
							type : "label",
							kind : "text",
							key : textId2
						}
					},
					configHeader : {
						Application : applicationId,
						ApplicationName : "appName",
						SemanticObject : "semanticObject",
						AnalyticalConfiguration : configurationId,
						AnalyticalConfigurationName : "Configuration name",
						UI5Version : sap.ui.version,
						CreationUTCDateTime : "01.04.1972",
						LastChangeUTCDateTime : "02.04.1972"
					}
				});
			};

		}
	});
	QUnit.test("Invalid application guid", function(assert) {
		assert.expect(3);
		var spyAtMessageCode = null, spyAtPrevious = null;
		function callbackImport(configuration, metadata, messageObject) {
			if (messageObject) {
				spyAtMessageCode = messageObject.getCode();
				spyAtPrevious = messageObject.getPrevious();
			}
		}
		this.instance.importConfiguration(this.getImportObject("Invalid application guid", this.configIdForRepeatedImport), undefined, callbackImport);
		assert.equal(this.applicationHandlerCalled, false, "Application handler was not instantiated");
		assert.equal(spyAtMessageCode, "11037", "A message object with code 11037 was issued");
		assert.ok(!spyAtPrevious, "No previous message object");
	});
	QUnit.test("Invalid application and configuration guid", function(assert) {
		assert.expect(3);
		var spyAtMessageCode = null, spyAtPrevious = null;
		function callbackImport(configuration, metadata, messageObject) {
			if (messageObject) {
				spyAtMessageCode = messageObject.getCode();
				spyAtPrevious = messageObject.getPrevious();
			}
		}
		this.instance.importConfiguration(this.getImportObject("Invalid app guid", "Invalid config guid"), undefined, callbackImport);
		assert.equal(this.applicationHandlerCalled, false, "Application handler was not instantiated");
		assert.equal(spyAtMessageCode, "11038", "A message object with code 11038 was issued");
		assert.ok(spyAtPrevious, "Previous message object set");
	});
	QUnit.test("Invalid configuration and text guids", function(assert) {
		assert.expect(6);
		var spyAtMessageCode = null, spyAtPrevious = null;
		function callbackImport(configuration, metadata, messageObject) {
			if (messageObject) {
				spyAtMessageCode = messageObject.getCode();
				spyAtPrevious = messageObject.getPrevious();
			}
		}

		this.instance.importConfiguration(this.getImportObject(this.existingAppID, "Invalid config guid", "Invalid text guid 1", "Invalid text guid 2"), undefined, callbackImport);
		assert.equal(this.applicationHandlerCalled, false, "Application handler was not instantiated");
		assert.equal(spyAtMessageCode, "11039", "A message object with code 11039 was issued");
		assert.ok(spyAtPrevious, "Previous message object set");
		assert.equal(spyAtPrevious.getCode(), "11039", "A message object with code 11039 was issued as previous message object");
		spyAtPrevious = spyAtPrevious.getPrevious();
		assert.ok(spyAtPrevious, "Pre-previous message object set");
		assert.equal(spyAtPrevious.getCode(), "11038", "A message object with code 11038 was issued as pre-previous message object");
	});
	QUnit.test("Existing application ID and new configuration ID", function(assert) {
		var that = this;
		assert.expect(4);
		var textKey1 = testHelper.generateGuidForTesting();
		var textKey2 = testHelper.generateGuidForTesting();
		var spyConfigurationSaved = false;
		function callbackImport() {
			spyConfigurationSaved = true;
		}
		this.instance.importConfiguration(this.getImportObject(this.existingAppID, this.configIdForFirstImport, textKey1, textKey2), undefined, callbackImport);
		assert.equal(this.spyApplicationId, that.existingAppID, 'Application ID set');
		assert.deepEqual(this.spyConfiguration, {
			id : that.configIdForFirstImport,
			configuration : {
				AnalyticalConfigurationName : 'Configuration name'
			}
		}, 'Configuration object set with external ID');
		assert.deepEqual(this.spyConfigurationPassedToEditor, {
			id : that.configIdForFirstImport,
			creationDate : "01.04.1972",
			lastChangeDate : "02.04.1972",
			content : {
				serializedConfig : {
					a: {
						key: textKey1,
						kind: "text",
						type: "label"
					},
					b: {
						key: textKey2,
						kind: "text",
						type: "label"
					}
				}
			}
		}, 'Configuration object passed to configuration editor');
		assert.ok(spyConfigurationSaved, 'Save called on configuration editor after successful import');
	});
	QUnit.test("Missing application ID and new configuration ID", function(assert) {
		var that = this;
		assert.expect(4);
		this.instance.importConfiguration(this.getImportObject(this.nonExistingAppID, this.configIdForFirstImport), undefined, function() {
		});
		assert.deepEqual(this.spySetAndSave.appObject, {
			ApplicationName : "appName",
			SemanticObject : "semanticObject"
		}, "Application created with header information");
		assert.equal(this.spySetAndSave.id, that.nonExistingAppID, "External id used for application creation");
		assert.ok(this.spySetAndSave.isImport, "ApplicationHandler setAndSave() called with correct parameter");
		assert.ok(this.spyConfigurationHandlerInstantiated, "ConfigurationHandler was called after creation of application. Further processing not in scope of this test.");
	});
	QUnit.test("Overwrite existing configuration ID", function(assert) {
		var that = this;
		assert.expect(3);
		var textKey1 = testHelper.generateGuidForTesting();
		var textKey2 = testHelper.generateGuidForTesting();
		function decideToOverwrite(callbackOverwrite, callbackCreateNew) {
			return callbackOverwrite();
		}
		this.instance.importConfiguration(this.getImportObject(this.existingAppID, this.configIdForRepeatedImport, textKey1, textKey2), decideToOverwrite, function() {
		});
		assert.deepEqual(this.spyConfiguration, {
			id : that.configIdForRepeatedImport,
			configuration : {
				AnalyticalConfigurationName : 'Configuration name'
			}
		}, 'Configuration object set with external ID');
		assert.deepEqual(this.spyConfigurationPassedToEditor, {
			updateExisting : true,
			id : that.configIdForRepeatedImport,
			creationDate : "01.04.1972",
			lastChangeDate : "02.04.1972",
			content : {
				serializedConfig : {
					a: {
						key: textKey1,
						kind: "text",
						type: "label"
					},
					b: {
						key: textKey2,
						kind: "text",
						type: "label"
					}
				}
			}
		}, 'Configuration object passed to configuration editor');
		assert.ok(this.spyConfigSaved, 'Save called on configuration editor after successful import');
	});
	QUnit.test("Create new when existing configuration ID", function(assert) {
		assert.expect(3);
		var textKey1 = testHelper.generateGuidForTesting();
		var textKey2 = testHelper.generateGuidForTesting();
		function decideToOverwrite(callbackOverwrite, callbackCreateNew) {
			return callbackCreateNew();
		}
		this.instance.importConfiguration(this.getImportObject(this.existingAppID, this.configIdForRepeatedImport, textKey1, textKey2), decideToOverwrite, function() {
		});
		assert.deepEqual(this.spyConfiguration, {
			id : undefined,
			configuration : {
				AnalyticalConfigurationName : 'Configuration name'
			}
		}, 'Configuration object set with external ID');
		assert.deepEqual(this.spyConfigurationPassedToEditor, {
			id : "apf1972-tempId",
			content : {
				serializedConfig : {
					a: {
						key: textKey1,
						kind: "text",
						type: "label"
					},
					b: {
						key: textKey2,
						kind: "text",
						type: "label"
					}
				}
			}
		}, 'Configuration object passed to configuration editor');
		assert.ok(this.spyConfigSaved, 'Save called on configuration editor after successful import');
	});
	QUnit.test("Create new when existing configuration ID, with renaming the new configuration", function(assert) {
		assert.expect(3);
		var textKey1 = testHelper.generateGuidForTesting();
		var textKey2 = testHelper.generateGuidForTesting();
		var newConfigName = "New configuration name";
		function decideToOverwrite(callbackOverwrite, callbackCreateNew, configurationName) {
			assert.equal(configurationName, "Configuration name", "Configuration name is given to callback");
			return callbackCreateNew(newConfigName);
		}
		this.instance.importConfiguration(this.getImportObject(this.existingAppID, this.configIdForRepeatedImport, textKey1, textKey2), decideToOverwrite, function() {
		});
		assert.deepEqual(this.spyConfiguration, {
			id : undefined,
			configuration : {
				AnalyticalConfigurationName : newConfigName
			}
		}, 'Configuration object set with new configuration name');
		assert.ok(this.spyConfigSaved, 'Save called on configuration editor after successful import');
	});
	QUnit.module("M: proxy provides method importVendorContent");
	QUnit.test("WHEN isUsingCloudFoundry is true AND importConfigurationFromVendorLayer is called", function(assert){
		var fnCallbackOverwrite = function() {};
		var fnCallbackImport = function() {};
		var PersistenceProxyStub = function() {
			this.importVendorContent = function(applicationId, configurationId, callbackOverwrite, callbackImport, applicationHandler) {
				assert.ok(true, "THEN import function of proxy was called");
				assert.strictEqual(applicationId, 'applicationId1111', "THEN expected application id was handed over");
				assert.strictEqual(configurationId, 'configId1111', "THEN expected configuration id was handed over");
				assert.strictEqual(callbackOverwrite, fnCallbackOverwrite, "THEN expected callback function for overwrite was handed over");
				assert.strictEqual(callbackImport, fnCallbackImport, "THEN expected callback function for import was handed over");
				assert.ok(applicationHandler, "THEN applicationHandler is provided");
			};
			this.readCollection = function(entitySet, callback) {
				assert.strictEqual(entitySet, 'application', "THEN applications have been requested");
				callback([]);
			};
		};
		var inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return {}; }
						};
					}}
				},
				constructors : {
					PersistenceProxy : PersistenceProxyStub
				},
				functions: {
					isUsingCloudFoundryProxy : function() { return true; }
				}
			};
		var instance = createInstance(inject);
		instance.importConfigurationFromVendorLayer('applicationId1111', 'configId1111', fnCallbackOverwrite, fnCallbackImport);
	});
	QUnit.module("M: Import from Lrep",{
		beforeEach: function(assert){
			this.configIdForFirstImport = testHelper.generateGuidForTesting();
			this.configIdForRepeatedImport = testHelper.generateGuidForTesting();

			this.expectedApplicationID = "143EC63F05550175E11230000A445B6D";
			setupModelerInstanceForLrep(this, assert);
		}
	});
	QUnit.test("Import from Lrep first time (no overwrite decision required)", function (assert){
		var that = this;
		assert.expect(3);
		function callbackOverwrite(){
			assert.ok(false,"There should be no overwrite needed");
		}
		function callbackImport(configuration, metadata, messageObject){
			assert.ok(!messageObject,"No Error occurred");
			assert.equal(configuration, that.configIdForFirstImport, "Then correct configuration is returned");
		}
		this.modelerInstance.importConfigurationFromVendorLayer(this.expectedApplicationID, this.configIdForFirstImport ,callbackOverwrite,callbackImport);
	});
	QUnit.test("Import from Lrep with existing configId", function (assert){
		var that = this;
		assert.expect(4);
		function callbackOverwrite(callbackOverwrite, callbackCreateNew){
			assert.ok(true,"Overwrite should be called");
			callbackOverwrite();
		}
		function callbackImport(configuration, metadata, messageObject){
			assert.ok(!messageObject,"No Error occurred");
			assert.equal(configuration, that.configIdForRepeatedImport, "Then correct configuration is returned");
		}
		this.modelerInstance.importConfigurationFromVendorLayer(this.expectedApplicationID, this.configIdForRepeatedImport ,callbackOverwrite,callbackImport);
	});
	QUnit.test("Import from Lrep with existing configId, and renaming configuration", function (assert){
		assert.expect(5);
		function callbackOverwrite(callbackOverwrite, callbackCreateNew, configurationName){
			assert.equal(configurationName, "Configuration name", "Configuration name is given to callback");
			callbackCreateNew("New configuration name");
		}
		function callbackImport(configuration, metadata, messageObject){
			assert.ok(!messageObject,"No Error occurred");
			assert.equal(configuration, undefined, "Then new configuration id is generated");
		}
		this.modelerInstance.importConfigurationFromVendorLayer(this.expectedApplicationID, this.configIdForRepeatedImport ,callbackOverwrite,callbackImport);
		assert.equal(this.spyConfigurationSet.AnalyticalConfigurationName, "New configuration name", "New configuration name is set");
	});
	QUnit.module("M: Basic Functions of the Modeler Core", {
		beforeEach : function(assert) {
			var persistenceConfiguration = {
				serviceRoot : "/serviceRoot"
			};
			this.instance = new ModelerCoreInstance(persistenceConfiguration, {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return {}; }
						};
					}}
				},
				functions : {
					odataRequestWrapper : function() {
					}
				}
			});
		}
	});
	QUnit.test("Create one instance of Modeler Core", function(assert) {
		assert.ok(this.instance, "Creation successful");
	});
	QUnit.test("Create Message and put", function(assert) {
		var that = this;
		assert.expect(2);
		var oMessageObject = this.instance.createMessageObject({
			code : "5004"
		});
		var assertMessageWasPut = function(oMessageObject) {
			var sCode = oMessageObject.getPrevious().getCode();
			assert.equal(sCode, "5004", "correct message code");
		};
		this.instance.setCallbackForMessageHandling(assertMessageWasPut);
		assert.throws(function() {
			that.instance.putMessage(oMessageObject);
		}, Error, "Fatal error");
	});
	QUnit.module("M: Probe mechanism", {});
	QUnit.test("WHEN probe injected THEN is active", function(assert) {
		assert.expect(6);
		var fnProbe = function(oInternalHandlers) {
			assert.ok(oInternalHandlers.messageHandler);
			assert.strictEqual(oInternalHandlers.messageHandler instanceof sap.apf.core.MessageHandler, true, "expected instance type");
			assert.ok(oInternalHandlers.textHandler);
			assert.strictEqual(typeof oInternalHandlers.ajax, 'function', "ajax is a function");
			assert.strictEqual(typeof oInternalHandlers.odataRequestWrapper, 'function', "odataRequestWrapper is a function");
			assert.strictEqual(oInternalHandlers.proxyTextHandlerForLocalTexts instanceof sap.apf.utils.ProxyTextHandlerForLocalTexts, true, "THEN default proxy text handler has been injected");
		};
		var persistenceConfiguration = {
			serviceRoot : "/serviceRoot"
		};
		//noinspection JSUnusedLocalSymbols,JSLint
		this.instance = new ModelerCoreInstance(persistenceConfiguration, {
			instances : {
				component : { getMetadata : function() {
					return {
						getManifest : function() { return {}; }
					};
				}}
			},
			functions : {
				odataRequestWrapper : function() {
					return null;
				}
			},
			probe : fnProbe
		});
	});
	QUnit.test("Probe: instance constructors are well-defined", function(assert) {
		assert.expect(12);
		var that = this;
		var fnProbe = function(oInternalHandlers) {
			that.ConfigurationEditor = oInternalHandlers.constructors.ConfigurationEditor;
			that.Step = oInternalHandlers.constructors.Step;
			that.ElementContainer = oInternalHandlers.constructors.ElementContainer;
			that.ConfigurationObjects = oInternalHandlers.constructors.ConfigurationObjects;
			that.ConfigurationFactory = oInternalHandlers.constructors.ConfigurationFactory;
			that.Representation = oInternalHandlers.constructors.Representation;
			that.Hashtable = oInternalHandlers.constructors.Hashtable;
			that.MetadataFactory = oInternalHandlers.constructors.MetadataFactory;
			that.LazyLoader = oInternalHandlers.constructors.LazyLoader;
			that.FacetFilter = oInternalHandlers.constructors.FacetFilter;
			that.NavigationTarget = oInternalHandlers.constructors.NavigationTarget;
			that.AnnotationHandler = oInternalHandlers.constructors.AnnotationHandler;
		};
		//noinspection JSUnusedLocalSymbols,JSLint
		this.instance = new ModelerCoreInstance({
			serviceRoot : "/serviceRoot"
		}, {
			instances : {
				component : { getMetadata : function() {
					return {
						getManifest : function() { return {}; }
					};
				}}
			},
			probe : fnProbe
		});
		assert.equal(typeof that.ConfigurationEditor, 'function', "ConfigurationEditor");
		assert.equal(typeof that.Step, 'function', "Step");
		assert.equal(typeof that.ElementContainer, 'function', "ElementContainer");
		assert.equal(typeof that.ConfigurationObjects, 'function', "ConfigurationObjects");
		assert.equal(typeof that.ConfigurationFactory, 'function', "ConfigurationFactory");
		assert.equal(typeof that.Representation, 'function', "Representation");
		assert.equal(typeof that.Hashtable, 'function', "Hashtable");
		assert.equal(typeof that.MetadataFactory, 'function', "MetadataFactory");
		assert.equal(typeof that.LazyLoader, 'function', "LazyLoader");
		assert.equal(typeof that.FacetFilter, 'function', "FacetFilter");
		assert.equal(typeof that.NavigationTarget, 'function', "NavigationTarget");
		assert.equal(typeof that.AnnotationHandler, 'function', "AnnotationHandler");
	});
	QUnit.test("ConfigurationEditor and inside it ConfigurationObjects can be created", function(assert) {
		assert.expect(2);
		var that = this;
		var fnProbe = function(spiedAt) {
			var inject = {
				instances : {
					messageHandler : spiedAt.messageHandler,
					persistenceProxy : spiedAt.odataProxy,
					configurationHandler : spiedAt.configurationHandler
				},
				constructors : {
					Hashtable : spiedAt.constructors.Hashtable,
					Step : spiedAt.constructors.Step,
					ElementContainer : spiedAt.constructors.ElementContainer,
					Representation : spiedAt.constructors.Representation,
					ConfigurationObjects : spiedAt.constructors.ConfigurationObjects,
					MetadataFactory : spiedAt.constructors.MetadataFactory,
					ConfigurationFactory : function a() {
					}
				}
			};
			that.configurationEditor = new spiedAt.constructors.ConfigurationEditor("apf1972-tempId", inject);
		};
		//noinspection JSUnusedLocalSymbols,JSLint
		this.instance = new ModelerCoreInstance({
			serviceRoot : "/serviceRoot"
		}, {
			instances : {
				component : { getMetadata : function() {
					return {
						getManifest : function() { return {}; }
					};
				}}
			},
			probe : fnProbe
		});
		assert.notEqual(that.configurationEditor, undefined, "exists");
		var category1 = that.configurationEditor.createCategoryWithId({
			labelKey : "localTextReference1"
		}, "category1");
		var stepId = that.configurationEditor.createStep(category1);
		assert.equal(stepId, that.configurationEditor.getStep(stepId).getId(), "a sample: editor operative");
	});
	QUnit.test("ConfigurationObjects can be created", function(assert) {
		assert.expect(3);
		var that = this;
		var fnProbe = function(spiedAt) {
			var inject = {
				instances : {
					messageHandler : spiedAt.messageHandler
				},
				constructors : {
					Hashtable : spiedAt.constructors.Hashtable,
					Step : spiedAt.constructors.Step,
					ElementContainer : spiedAt.constructors.ElementContainer,
					Representation : spiedAt.constructors.Representation
				}
			};
			that.configurationObjects = new spiedAt.constructors.ConfigurationObjects(inject);
			that.annotationHandler = spiedAt.annotationHandler;
		};
		//noinspection JSUnusedLocalSymbols,JSLint
		this.instance = new ModelerCoreInstance({
			serviceRoot : "/serviceRoot"
		}, {
			instances : {
				component : { getMetadata : function() {
					return {
						getManifest : function() { return {}; }
					};
				}}
			},
			probe : fnProbe
		});
		assert.notEqual(that.configurationObjects, undefined, "exists");
		assert.equal(that.configurationObjects.validateCategory({}), undefined, "a sample: operative");
		assert.ok(typeof that.annotationHandler.getAnnotationsForService === 'function', "then annotation handler is detected");
	});
	QUnit.module("M: Tests for getUnusedTextKeys - GIVEN prepared and isolated modeler core instance", {
		beforeEach : function() {
			var that = this;
			this.messageHandler = new sap.apf.core.MessageHandler();
			this.applicationId = "AppA";
			this.spyGetTextKeysFromAllConfigurations = {
				called : false,
				applicationId : null,
				callback : null
			};
			this.configurationObjects = function() {
				this.getTextKeysFromAllConfigurations = function(applicationId, callback) {
					that.spyGetTextKeysFromAllConfigurations.called = true;
					that.spyGetTextKeysFromAllConfigurations.applicationId = applicationId;
					that.spyGetTextKeysFromAllConfigurations.callback = callback;
				};
			};
			var ConfigurationHandler = function() {
				this.getTextPool = function() {
					return {
						getTextKeys : function() {
							return [ "textKey3", "textKey4", "textKey5" ];
						}
					};
				};
			};
			this.GetConfigurationHandler = function() {
				return new ConfigurationHandler();
			};
			this.inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return {}; }
						};
					}}
				},
				constructors : {
					ConfigurationObjects : this.configurationObjects,
					PersistenceProxy : function() {
					}
				},
				functions : {
					loadConfigurationHandler : this.loadConfigurationHandler
				}
			};
			this.instance = new ModelerCoreInstance(this.persistenceConfiguration, this.inject);
			this.spyGetConfigurationHandler = {
				called : false,
				applicationId : null,
				callback : null
			};
			this.instance.getConfigurationHandler = function(applicationId, callback) {
				that.spyGetConfigurationHandler.called = true;
				that.spyGetConfigurationHandler.applicationId = applicationId;
				that.spyGetConfigurationHandler.callback = callback;
			};
			this.spyCallbackAfterGetUnusedTextKeys = {
				called : false,
				unusedTextKeys : null,
				messageObject : null
			};
			this.callbackAfterGetUnusedTextKeys = function(unusedTextKeys, messageObject) {
				that.spyCallbackAfterGetUnusedTextKeys.called = true;
				that.spyCallbackAfterGetUnusedTextKeys.unusedTextKeys = unusedTextKeys;
				that.spyCallbackAfterGetUnusedTextKeys.messageObject = messageObject;
			};
			this.GetTextKeysFromAllConfigurations = function() {
				var resultValue = new sap.apf.utils.Hashtable(that.messageHandler);
				resultValue.setItem("textKey1", {});
				resultValue.setItem("textKey2", {});
				resultValue.setItem("textKey3", {});
				return resultValue;
			};
			this.resetSpies = function(onlyCalled) {
				if (onlyCalled) {
					that.spyGetTextKeysFromAllConfigurations.called = false;
					that.spyGetConfigurationHandler.called = false;
					that.spyCallbackAfterGetUnusedTextKeys.called = false;
					return;
				}
				that.spyGetTextKeysFromAllConfigurations = {
					called : false,
					applicationId : null,
					callback : null
				};
				that.spyGetConfigurationHandler = {
					called : false,
					applicationId : null,
					callback : null
				};
				that.spyCallbackAfterGetUnusedTextKeys = {
					called : false,
					unusedTextKeys : null,
					messageObject : null
				};
			};
		}
	});
	QUnit.test("Examine getUnusedTextKeys for All Possible Callback Return Combinations", function(assert) {
		assert.expect(122);
		var that = this;
		for(var i = 0; i < 8; i++) { // build all valid combinations of server callback return and fail sequences
			var firstCalled, secondCalled, firstFails, secondFails, next;
			next = i;
			firstFails = !!(next % 2);
			next = next >> 1;
			secondFails = !!(next % 2);
			next = next >> 1;
			if (next % 2) {
				firstCalled = "GetTextKeysFromAllConfigurations";
				secondCalled = "GetConfigurationHandler";
			} else {
				firstCalled = "GetConfigurationHandler";
				secondCalled = "GetTextKeysFromAllConfigurations";
			}
			assert.ok(true, "<<<<<< firstCalled : " + firstCalled + "(fails:" + firstFails + ") // secondCalled : " + secondCalled + "(fails:" + secondFails + ") >>>>>>");
			// getUnusedTextKeys
			this.instance.getUnusedTextKeys(this.applicationId, this.callbackAfterGetUnusedTextKeys); // <<< CUT
			assert.ok(true, ">>> WHEN getUnusedTextKeys ");
			assert.ok(that.spyGetTextKeysFromAllConfigurations.called, "THEN getTextKeysFromAllConfigurations is called");
			assert.equal(that.spyGetTextKeysFromAllConfigurations.applicationId, that.applicationId, "THEN getTextKeysFromAllConfigurations is called for the right application");
			assert.ok(that.spyGetTextKeysFromAllConfigurations.callback, "THEN getTextKeysFromAllConfigurations is called with a callback function");
			assert.ok(that.spyGetConfigurationHandler.called, "THEN getConfigurationHandler is called");
			assert.equal(that.spyGetConfigurationHandler.applicationId, that.applicationId, "THEN getConfigurationHandler is called for the right application");
			assert.ok(that.spyGetConfigurationHandler.callback, "THEN getConfigurationHandler is called with a callback function");
			assert.ok(!that.spyCallbackAfterGetUnusedTextKeys.called, "THEN callbackAfterGetUnusedTextKeys is not called");
			//callback 1 returns
			that.resetSpies(true);
			assert.ok(true, ">>> let " + firstCalled + " return first (with error message: " + firstFails + ")");
			if (!firstFails) {
				that["spy" + firstCalled].callback(that[firstCalled](), undefined); // <<< CUT
				assert.ok(!that.spyGetTextKeysFromAllConfigurations.called && !that.spyGetConfigurationHandler.called && !that.spyCallbackAfterGetUnusedTextKeys.called, "THEN no callback is called");
			} else {
				var error1 = {
					errorMessage : "Error from " + firstCalled
				};
				that["spy" + firstCalled].callback(undefined, error1);// <<< CUT
				assert.ok(!that.spyGetTextKeysFromAllConfigurations.called && !that.spyGetConfigurationHandler.called && that.spyCallbackAfterGetUnusedTextKeys.called, "THEN one callback, callback AfterGetUnusedTextKeys, is called");
				assert.equal(that.spyCallbackAfterGetUnusedTextKeys.messageObject, error1, "THEN correct messageObject is returned");
				assert.ok(!that.spyCallbackAfterGetUnusedTextKeys.unusedTextKeys, "THEN no unusedTextKeys are returned");
			}
			//callback 2 returns
			that.resetSpies(true);
			assert.ok(true, ">>> let " + secondCalled + " return second (with error message: " + secondFails + ")");
			if (!secondFails) {
				that["spy" + secondCalled].callback(that[secondCalled](), undefined); // <<< CUT
				if (!firstFails) {
					assert.ok(!that.spyGetTextKeysFromAllConfigurations.called && !that.spyGetConfigurationHandler.called && that.spyCallbackAfterGetUnusedTextKeys.called, "THEN one callback, callback AfterGetUnusedTextKeys, is called");
					//result can be checked
					assert.equal(that.spyCallbackAfterGetUnusedTextKeys.unusedTextKeys.length, 2, "THEN two unused text keys are returned");
					assert.notEqual(that.spyCallbackAfterGetUnusedTextKeys.unusedTextKeys.indexOf("textKey4"), -1, "First unused text key was found");
					assert.notEqual(that.spyCallbackAfterGetUnusedTextKeys.unusedTextKeys.indexOf("textKey5"), -1, "First unused text key was found");
				} else {
					assert.ok(!that.spyGetTextKeysFromAllConfigurations.called && !that.spyGetConfigurationHandler.called && !that.spyCallbackAfterGetUnusedTextKeys.called, "THEN no callback is called, because " + firstCalled + " already failed");
				}
			} else {
				var error2 = {
					errorMessage : "Error from " + secondCalled
				};
				that["spy" + secondCalled].callback(undefined, error2); // <<< CUT
				if (!firstFails) {
					assert.ok(!that.spyGetTextKeysFromAllConfigurations.called && !that.spyGetConfigurationHandler.called && that.spyCallbackAfterGetUnusedTextKeys.called, "THEN one callback, callback AfterGetUnusedTextKeys, is called");
					assert.equal(that.spyCallbackAfterGetUnusedTextKeys.messageObject, error2, "THEN correct messageObject is returned");
					assert.ok(!that.spyCallbackAfterGetUnusedTextKeys.unusedTextKeys, "THEN no unusedTextKeys are returned");
				} else {
					assert.ok(!that.spyGetTextKeysFromAllConfigurations.called && !that.spyGetConfigurationHandler.called && !that.spyCallbackAfterGetUnusedTextKeys.called, "THEN no callback is called, because " + firstCalled + "already failed");
				}
			}
			//complete reset of spies
			this.resetSpies(false);
		}
	});
	QUnit.module("M: Value help functions for semantic objects of the Modeler Core", {
		beforeEach : function() {
			var that = this;
			that.countOdataCalls = 0;
			var persistenceConfiguration = {
				serviceRoot : "/serviceRoot"
			};
			this.instance = new ModelerCoreInstance(persistenceConfiguration, {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return {}; }
						};
					}}
				},
				constructors : {
					SessionHandler : SessionHandlerStubbedAjax
				},
				functions : {
					odataRequestWrapper : function(oInject, oRequest, fnSuccess, fnError) {
						that.countOdataCalls++;
						if (oRequest.method === "GET" && oRequest.requestUri === "/sap/opu/odata/UI2/INTEROP/SemanticObjects?$format=json&$select=id,text" && oRequest.isSemanticObjectRequest) {
							if(!that.oDataError){

								setTimeout(function(){
									fnSuccess({

										results : that.generateSemanticObjectList(4)
									}, undefined);
								}, 1);
							} else {
								setTimeout(function(){
									fnError();
								}, 1);
							}
						}
					}
				}
			});
		},
		generateSemanticObjectList : function(counter) {
			var i;
			var semanticObjects = [];
			var semanticObject;
			for(i = 0; i < counter; i++) {
				semanticObject = {
					id : "semanticObject" + i,
					text : "semanticObject" + i + "Text"
				};
				semanticObjects.push(semanticObject);
			}
			return semanticObjects;
		}
	});
	QUnit.test("getAllAvailableSemanticObjects", function(assert) {
		var done = assert.async();
		var that = this;
		var counter = 0;
		function assertSemanticObjectsAvailable(semanticObjects, messageObject) {
			counter++;
			assert.equal(messageObject, undefined);
			var expectedSemanticObjects = that.generateSemanticObjectList(4);
			assert.deepEqual(semanticObjects, expectedSemanticObjects, "Proper list of available semantic objects is returned in callback function");
			if(counter === 3){
				assert.equal(that.countOdataCalls, 1, "Results have been cached on multiple access");
				done();
			}
		}
		this.instance.getAllAvailableSemanticObjects(assertSemanticObjectsAvailable);
		this.instance.getAllAvailableSemanticObjects(assertSemanticObjectsAvailable);
		setTimeout(function(){
			that.instance.getAllAvailableSemanticObjects(assertSemanticObjectsAvailable);
		}, 10);
	});
	QUnit.test("getAllAvailableSemanticObjects in error case", function(assert) {
		var done = assert.async();
		this.oDataError = true;
		var that = this;
		var counter = 0;
		function assertError(semanticObjects, messageObject) {
			counter++;
			assert.deepEqual(semanticObjects, [], "No SemanticObjects returned");
			assert.equal(messageObject, undefined, "Then message object is not created");
			if(counter === 3){
				assert.equal(that.countOdataCalls, 1, "Error has been cached on multiple access");
				done();
			}
		}
		this.instance.getAllAvailableSemanticObjects(assertError);
		this.instance.getAllAvailableSemanticObjects(assertError);
		setTimeout(function(){
			that.instance.getAllAvailableSemanticObjects(assertError);
		}, 10);
	});
	QUnit.module("M: Value help functions for semantic actions of the Modeler Core", {
		beforeEach : function() {
			var that = this;
			that.countOdataCalls = 0;
			ushellHelper.setup();
			var persistenceConfiguration = {
				serviceRoot : "/serviceRoot"
			};
			this.instance = new ModelerCoreInstance(persistenceConfiguration, {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return {}; }
						};
					}}
				},
				constructors : {
					SessionHandler : SessionHandlerStubbedAjax
				},
				functions : {
					odataRequestWrapper : function(oInject, oRequest, fnSuccess, fnError) {
						that.countOdataCalls++;
						if (oRequest.method === "GET" && oRequest.requestUri === "/sap/opu/odata/UI2/INTEROP/SemanticObjects?$format=json&$select=id,text" && oRequest.isSemanticObjectRequest) {
							fnSuccess({
								results : that.generateSemanticObjectList(4)
							}, undefined);
						}
					}
				}
			});
		},
		generateSemanticObjectList : function(counter) {
			var i;
			var semanticObjects = [];
			var semanticObject;
			for(i = 0; i < counter; i++) {
				semanticObject = {
					id : "semanticObject" + i,
					text : "semanticObject" + i + "Text"
				};
				semanticObjects.push(semanticObject);
			}
			return semanticObjects;
		},
		afterEach : function() {
			ushellHelper.teardown();
		}
	});
	QUnit.test("WHEN calling FUNCTION getSemanticActions", function(assert) {
		var done = assert.async();
		this.instance.getSemanticActions("semanticObject2").done(function(actions) {
			assert.equal(actions.semanticActions[0].id, "action1", "THEN First action is correct");
			assert.equal(actions.semanticActions[1].id, "actionWithParam", "THEN second action is correct");
		});
		this.instance.getSemanticActions("semanticObject2").done(function(actions) {
			assert.equal(actions.semanticActions[0].id, "action1", "THEN First action is correct");
			assert.equal(actions.semanticActions[1].id, "actionWithParam", "THEN second action is correct");
			assert.equal(sap.ushell.numberOfCallsForGetSemanticObjectLinks, 1, "THEN results are cached");
			done();
		});
	});
	QUnit.module("M: Error handling in value help functions for semantic actions of the Modeler Core", {
		beforeEach : function() {
			var that = this;
			ushellHelper.setup();
			var persistenceConfiguration = {
				serviceRoot : "/serviceRoot"
			};
			this.instance = new ModelerCoreInstance(persistenceConfiguration, {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return {}; }
						};
					}}
				},
				constructors : {
					SessionHandler : SessionHandlerStubbedAjax
				},
				functions : {
					odataRequestWrapper : function(oInject, oRequest, fnSuccess, fnError) {
						that.countOdataCalls++;
						if (oRequest.method === "GET" && oRequest.requestUri === "/sap/opu/odata/UI2/INTEROP/SemanticObjects?$format=json&$select=id,text" && oRequest.isSemanticObjectRequest) {
							fnError({
								status : 400
							});
						}
					}
				}
			});
		},
		afterEach : function() {
			ushellHelper.teardown();
		}
	});
	QUnit.test("WHEN calling FUNCTION getSemanticActions", function(assert) {
		var done = assert.async();
		this.instance.getSemanticActions("semanticObject2").done(function(actions) {
			assert.equal(actions.semanticActions.length, 2, "THEN return two semantic actions defined in ushellHelper.js --> getLinks()");
			assert.equal(actions.semanticObject.id, "semanticObject2", "THEN return the semantic object the function was called with");
		});
		this.instance.getSemanticActions({
			att1 : "",
			att2 : ""
		}).done(function(actions) {
			assert.ok(false, "THEN message 11042 is not raised");
			done();
		}).fail(function(messageObject) {
			assert.equal(messageObject.getCode(), 11042, "THEN message 11042 is raised");
			done();
		});
	});
	QUnit.module("M: navigation to generic runtime",{
		beforeEach : function () {
			var persistenceConfiguration = {};
			ushellHelper.setup();
			this.instance = new ModelerCoreInstance(persistenceConfiguration, {
				constructors : {
					StartParameter : StartParameterDouble
				},
				functions : {
					getNavigationTargetForGenericRuntime : function () {
						return { semanticObject : 'FioriApplication', action : 'executeApfConfigurationS4HANA' };
					}
				}
			});
		},
		afterEach: function () {
			ushellHelper.teardown();
		}
	});
	QUnit.test("When calling Function navigateToGenericRuntime", function(assert){
		var applicationId = '51235123';
		var configurationId = '52312323';
		var expectedHref = {
				target : {
					 semanticObject : 'FioriApplication',
					 action : 'executeApfConfigurationS4HANA'
				},
				params : {}
		};
		expectedHref.params['sap-apf-configuration-id'] = applicationId + '.' + configurationId;

		function navigationMethod(url){
			assert.equal(url.search('#FioriApplication-executeAPFConfigurationS4HANA') > -1 , true, "Then URL for navigation is correctly given");
			assert.deepEqual(sap.ushell.hrefConfiguration, expectedHref, "Then Navigation HRef is correctly given");
		}
		this.instance.navigateToGenericRuntime(applicationId, configurationId, navigationMethod);
	});
	QUnit.module("M: navigation to static runtime",{
		beforeEach : function (assert) {
			var persistenceConfiguration = {};
			this.instance = new ModelerCoreInstance(persistenceConfiguration, {
				exits : {
					getRuntimeUrl : function (applicationId, configurationId) {
						assert.deepEqual(applicationId, '51235123', "Correct applicationId given");
						assert.deepEqual(configurationId, '52312323', "Correct configurationId given");
						return 'www.abc.de';
					}
				}
			});
		},
		afterEach: function () {
			ushellHelper.teardown();
		}
	});
	QUnit.test("Calling Function navigateToGenericRuntime with static runtimeUrl", function(assert){
		var applicationId = '51235123';
		var configurationId = '52312323';
		function navigationMethod(url){
			assert.deepEqual(url, 'www.abc.de', "Static URL for navigation is correctly given");
		}
		this.instance.navigateToGenericRuntime(applicationId, configurationId, navigationMethod);
	});

	QUnit.module("Supply of manifest for startparameter", {
	});
	QUnit.test("WHEN instance with manifest is created", function(assert) {
		assert.expect(1);
		var inject = {
			instances : {
				component : { getMetadata : function() {
					return {
						getManifest : function() { return {}; }
					};
				}}
			},
			constructors : {
				StartParameter : function(component, manifests) {
					this.getSapSystem = function() { return undefined; };
					assert.ok(manifests.manifest && manifests.baseManifest, "THEN manifest and base manifest is handed over to start parameter instance");
				}
			}
		};
		createInstance(inject);
	});
	QUnit.module("Catalog Service", {
	});
	QUnit.test("WHEN instance with manifest is created", function(assert) {
		assert.expect(1);
		var inject = {
			instances : {
				component : { getMetadata : function() {
					return {
						getManifest : function() { return {}; }
					};
				}}
			},
			functions: {
				getCatalogServiceUri : function() { return "expectedServiceRoot"; }
			},
			constructors : {
				StartParameter : function(component, manifests) {
					this.getSapSystem = function() { return undefined; };
				}
			}
		};
		var instance = createInstance(inject);
		assert.equal(instance.getCatalogServiceUri(), "expectedServiceRoot", "THEN the expected catalog service root from injected function is returned" );
	});
	QUnit.module("Inject of AJAX", {
	});
	QUnit.test("WHEN ajax has been injected", function(assert){
		var inject = {
			instances : {
				component : { getMetadata : function() {
					return {
						getManifest : function() { return {}; }
					};
				}}
			},
			functions: {
				ajax : function(conf) {
					var deferred = jQuery.Deferred();
					assert.equal(conf.url, "/path/to/url", "THEN injected ajax is called");
					deferred.resolve("answer from injected ajax");
					return deferred.promise();
				}
			},
			constructors : {
				StartParameter : function(component, manifests) {
					this.getSapSystem = function() { return undefined; };
				}
			}
		};
		var instance = createInstance(inject);
		instance.ajax({
			url : "/path/to/url",
			success : function(answer) {
				assert.equal(answer, "answer from injected ajax", "THEN success from injected ajax has been called");
			}});

	});
	QUnit.test("WHEN sap-system is set and AJAX is called", function(assert){
		var inject = {
			instances : {
				component : { getMetadata : function() {
					return {
						getManifest : function() { return {}; }
					};
				}}
			},
			functions: {
				ajax : function(conf) {
					var deferred = jQuery.Deferred();
					assert.equal(conf.url, "/path/to/url;o=myERP", "THEN origin is included in URL");
					deferred.resolve("answer from injected ajax");
					return deferred.promise();
				}
			},
			constructors : {
				StartParameter : function(component, manifests) {
					this.getSapSystem = function() { return "myERP"; };
				}
			}
		};
		var instance = createInstance(inject);
		instance.ajax({
			url : "/path/to/url",
			success : function(answer) {
				assert.equal(answer, "answer from injected ajax", "THEN success from injected ajax has been called");
			}});

	});
	QUnit.module("Inject of ODATA request");
	QUnit.test("WHEN ODATA request is injected", function(assert){
		var expectedResult = "expected Result";
		assert.expect(3);
		var myOdataRequest = function(oInject, oRequest, fnSuccess, fnError, oBatchHandler) {
			assert.ok(oInject.instances.datajs, "THEN datajs is injected");
			assert.ok(oInject.functions.getSapSystem, "THEN function getSapSystem is injected");
			return fnSuccess(expectedResult);
		};
		var inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return {}; }
						};
					}}
				},
				functions: {
					odataRequestWrapper : myOdataRequest
				}
		};
		var instance = createInstance(inject);
		function assertWrapperWasCalled(result) {
			assert.equal(result, expectedResult, "THEN the result is returned from injected odata request");
		}
		instance.odataRequest({}, assertWrapperWasCalled);
	});
	QUnit.module("Proper injects");
	QUnit.test("Inject for the metadata factory", function(assert){
		var MetadataFactorySpy = function(inject) {
			assert.ok(inject.constructors.EntityTypeMetadata, "THEN EntityTypeMetadata constructor is injected");
			assert.ok(inject.constructors.Hashtable, "THEN Hashtable constructor is injected");
			assert.ok(inject.constructors.Metadata, "THEN Metadata constructor is injected");
			assert.ok(inject.constructors.MetadataFacade, "THEN Metadata Facade constructor is injected");
			assert.ok(inject.constructors.MetadataProperty, "THEN MetadataProperty constructor is injected");
			assert.ok(inject.functions.getServiceDocuments, "THEN getServiceDocuments is injected");
			assert.ok(inject.functions.getSapSystem, "THEN getSapSystem is injected");
			assert.ok(inject.instances.messageHandler, "THEN message handler is injected");
			assert.ok(inject.instances.coreApi, "THEN core api is injected");
			assert.ok(inject.instances.annotationHandler, "THEN annotation handler is injected");
			assert.equal(inject.deactivateFatalError, true, "THEN deactivate fatal error is set");
		};
		var inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return {}; }
						};
					}}
				},
				constructors: {
					MetadataFactory : MetadataFactorySpy
				}
		};
		createInstance(inject);
	});
	QUnit.test("Inject for the annotation handler", function(assert){
		var AnnotationHandlerSpy = function(inject) {
			assert.ok(inject.functions.getComponentNameFromManifest, "THEN getComponentNameFromManifest is injected");
			assert.ok(inject.functions.getODataPath, "THEN getODataPath is injected");
			assert.ok(inject.functions.getBaseURLOfComponent, "THEN getBaseURLOfComponent is injected");
			assert.ok(inject.functions.addRelativeToAbsoluteURL, "THEN addRelativeToAbsoluteURL is injected");
			assert.ok(inject.functions.getSapSystem, "THEN getSapSystem is injected");
		};
		var inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return {}; }
						};
					}}
				},
				constructors: {
					AnnotationHandler : AnnotationHandlerSpy
				}
		};
		createInstance(inject);
	});
	QUnit.test("Inject for the proxyTextHandlerForLocalTexts", function(assert){
		var ProxyTextHandlerForLocalTexts = function(inject) {
			assert.ok(inject.instances.messageHandler, "THEN messageHandler is injected");
		};
		var inject = {
			instances : {
				component : { getMetadata : function() {
						return {
							getManifest : function() { return {}; }
						};
					}}
			},
			constructors: {
				ProxyTextHandlerForLocalTexts : ProxyTextHandlerForLocalTexts
			}
		};
		createInstance(inject);
	});
	QUnit.test("Inject of constructor FileExists", function(assert){
		var FileExists = function(inject) {
			assert.ok(inject.functions.getSapSystem, "THEN getSapSystem is injected into FileExists");
		};
		var inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return {}; }
						};
					}}
				},
				constructors: {
					FileExists : FileExists
				}
		};
		createInstance(inject);
	});
	QUnit.module("Instantiation of Persistence Proxy", {
		beforeEach: function() {
			this.spyCloudFoundryProxy = sinon.spy(sap.apf.cloudFoundry.modelerProxy, "ModelerProxy");
			this.spyOdataProxy = sinon.spy(sap.apf.core, "OdataProxy");
			this.spyLayeredRepositoryProxy = sinon.spy(sap.apf.core, "LayeredRepositoryProxy");
		},
		afterEach: function() {
			this.spyCloudFoundryProxy.restore();
			this.spyOdataProxy.restore();
			this.spyLayeredRepositoryProxy.restore();
		}
	});
	QUnit.test("Injection of AjaxHandler and isUsingCloudFoundry is true", function(assert){
		assert.expect(2);
		var ProxyStub = function() {
		};
		var AjaxHandlerStub = function(inject) {
			assert.ok(inject.instances.messageHandler instanceof sap.apf.core.MessageHandler, "THEN messageHandler has been injected");
			assert.ok(typeof inject.functions.coreAjax === 'function', "THEN function has been injected for ajax");
		};
		var inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return { type: "manifestOfComponent" }; }
						};
					}}
				},
				constructors: {
					PersistenceProxy : ProxyStub,
					AjaxHandler : AjaxHandlerStub
				},
				functions: {
					isUsingCloudFoundryProxy : function() { return true; }
				}
		};
		createInstance(inject);
	});
	QUnit.test("Injection of Persistence Proxy", function(assert){
		assert.expect(4);
		var ProxyStub = function(serviceConfiguration, inject) {
			assert.strictEqual(inject.manifests.manifest.type, "manifestOfComponent", "THEN manifest from the component is injected");
			assert.ok(inject.instances.coreApi, "THEN core api is injected");
			assert.ok(inject.instances.messageHandler, "THEN message handler is injected");
			assert.ok(serviceConfiguration, "THEN service configuration is injected");
		};
		var inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return { type: "manifestOfComponent" }; }
						};
					}}
				},
				constructors: {
					PersistenceProxy : ProxyStub
				}
		};
		createInstance(inject);
	});
	QUnit.test("Injection of function isUsingCloudFoundryProxy returning TRUE, so that cloud foundry modeler proxy shall be used", function(assert){
		assert.expect(8);
		var inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return manifestForCloudFoundryProxy; }
						};
					}}
				},
				functions: {
					isUsingCloudFoundryProxy : function() { return true; }
				}
		};
		createInstance(inject);
		assert.strictEqual(this.spyCloudFoundryProxy.callCount, 1, "THEN cloud foundry modeler proxy has been created");
		var proxyInject = this.spyCloudFoundryProxy.getCall(0).args[1];
		assert.ok(proxyInject.instances.messageHandler, "THEN message handler has been injected");
		assert.ok(proxyInject.instances.coreApi, "THEN core api has been injected");
		assert.ok(proxyInject.instances.ajaxHandler instanceof sap.apf.cloudFoundry.AjaxHandler, "THEN ajax handler has been injected");
		assert.ok(proxyInject.instances.proxyTextHandlerForLocalTexts, "THEN proxy text handler has been injected");
		assert.deepEqual(proxyInject.manifests.manifest, manifestForCloudFoundryProxy, "THEN manifest has been injected");
		assert.strictEqual(this.spyOdataProxy.callCount, 0, "THEN odata proxy was NOT created");
		assert.strictEqual(this.spyLayeredRepositoryProxy.callCount, 0, "THEN layered repository proxy was NOT created");
	});
	QUnit.test("Inject of function isUsingCloudFoundryProxy returning FALSE, so that cloud foundry modeler proxy shall NOT be used", function(assert){
		assert.expect(7);
		var inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return { type: "manifestOfComponent" }; }
						};
					}}
				},
				functions: {
					isUsingCloudFoundryProxy : function() { return false; }
				}
		};
		createInstance(inject);
		assert.strictEqual(this.spyCloudFoundryProxy.callCount, 0, "THEN cloud foundry modeler proxy has NOT been created");
		assert.strictEqual(this.spyOdataProxy.callCount, 1, "THEN odata proxy has been created");
		var injection = this.spyOdataProxy.getCall(0).args[1];
		assert.ok(injection.instances.messageHandler, "THEN message handler has been injected");
		assert.ok(injection.instances.coreApi, "THEN core api has been injected");
		assert.strictEqual(injection.manifests.manifest.type, "manifestOfComponent", "THEN manifest has been injected");
		var persistenceConfig = this.spyOdataProxy.getCall(0).args[0];
		assert.ok(persistenceConfig, "THEN persistence configuration has been injected");
		assert.strictEqual(this.spyLayeredRepositoryProxy.callCount, 0, "THEN layered repository proxy was NOT created");
	});
	QUnit.test("Injection of Persistence Proxy wins over injection of function isUsingCloudFoundryProxy", function(assert){
		assert.expect(5);

		var ProxyStub = function(serviceConfiguration, inject) {
			assert.ok(true, "THEN injected persistence proxy is created");
			assert.ok(inject.instances.ajaxHandler instanceof sap.apf.cloudFoundry.AjaxHandler, "THEN ajax handler has been injected");
		};
		var inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return { type: "manifestOfComponent" }; }
						};
					}}
				},
				functions: {
					isUsingCloudFoundryProxy : function() { return true; }
				},
				constructors: {
					PersistenceProxy : ProxyStub
				}
		};
		createInstance(inject);
		assert.strictEqual(this.spyCloudFoundryProxy.callCount, 0, "THEN cloud foundry modeler proxy has NOT been created");
		assert.strictEqual(this.spyOdataProxy.callCount, 0, "THEN odata proxy has NOT been created");
		assert.strictEqual(this.spyLayeredRepositoryProxy.callCount, 0, "THEN layered repository proxy was NOT created");
	});
	QUnit.test("Injection of manifest setting activateLrep = true", function(assert){
		assert.expect(3);

		var inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return { "sap.apf" : { activateLrep : true } }; }
						};
					}}
				},
				functions: {
					isUsingCloudFoundryProxy : function() { return false; }
				}
		};
		createInstance(inject);
		assert.strictEqual(this.spyCloudFoundryProxy.callCount, 0, "THEN cloud foundry modeler proxy has NOT been created");
		assert.strictEqual(this.spyOdataProxy.callCount, 0, "THEN odata proxy has NOT been created");
		assert.strictEqual(this.spyLayeredRepositoryProxy.callCount, 1, "THEN layered repository proxy was created");
	});
	QUnit.test("Injection of function isUsingCloudFoundryProxy returning true wins over manifest setting activateLrep = true", function(assert){
		assert.expect(3);
		var manifest = jQuery.extend(true, {}, manifestForCloudFoundryProxy, { "sap.apf" : { activateLrep : true }});
		var inject = {
				instances : {
					component : { getMetadata : function() {
						return {
							getManifest : function() { return manifest; }
						};
					}}
				},
				functions: {
					isUsingCloudFoundryProxy : function() { return true; }
				}
		};
		createInstance(inject);
		assert.strictEqual(this.spyCloudFoundryProxy.callCount, 1, "THEN cloud foundry modeler proxy has been created");
		assert.strictEqual(this.spyOdataProxy.callCount, 0, "THEN odata proxy has NOT been created");
		assert.strictEqual(this.spyLayeredRepositoryProxy.callCount, 0, "THEN layered repository proxy was NOT created");
	});
	QUnit.module("Functions isVendorContentAvailable and showSemanticObject");
	QUnit.test("WHEN isUsingCloudFoundryProxy returns true and exit hasVendorContent does not exist", function(assert){
		var inject = {
				instances : {
					component : {
						getMetadata : function() {
							return {
								getManifest : function() { return manifestForCloudFoundryProxy; }
							};
						}
					}
				},
				functions: {
					isUsingCloudFoundryProxy : function() { return true; }
				}
		};
		var instance = createInstance(inject);
		assert.strictEqual(instance.isVendorContentAvailable(), false, "THEN vendor content can NOT be imported");
		assert.strictEqual(instance.showSemanticObject(), false, "THEN semantic object shall NOT be shown");
	});
	QUnit.test("WHEN isUsingCloudFoundryProxy returns true and exit hasVendorContent returns true", function(assert){
		var inject = {
				instances : {
					component : {
						getMetadata : function() {
							return {
								getManifest : function() { return manifestForCloudFoundryProxy; }
							};
						}
					}
				},
				functions: {
					isUsingCloudFoundryProxy : function() { return true; }
				},
				exits: {
					hasVendorContent : function() { return true; }
				}
		};
		var instance = createInstance(inject);
		assert.strictEqual(instance.isVendorContentAvailable(), true, "THEN vendor content can be imported");
		assert.strictEqual(instance.showSemanticObject(), false, "THEN semantic object shall NOT be shown");
	});
	QUnit.test("WHEN isUsingCloudFoundryProxy returns true and exit hasVendorContent returns false", function(assert){
		var inject = {
				instances : {
					component : {
						getMetadata : function() {
							return {
								getManifest : function() { return manifestForCloudFoundryProxy; }
							};
						}
					}
				},
				functions: {
					isUsingCloudFoundryProxy : function() { return true; }
				},
				exits: {
					hasVendorContent : function() { return false; }
				}
		};
		var instance = createInstance(inject);
		assert.strictEqual(instance.isVendorContentAvailable(), false, "THEN vendor content can NOT be imported");
		assert.strictEqual(instance.showSemanticObject(), false, "THEN semantic object shall NOT be shown");
	});
	QUnit.test("WHEN isUsingCloudFoundryProxy returns true AND layered repository proxy is active", function(assert){
		var manifest = jQuery.extend(true, manifestForCloudFoundryProxy, { "sap.apf" : { activateLrep : true }});
		var inject = {
				instances : {
					component : {
						getMetadata : function() {
							return {
								getManifest : function() { return manifest; }
							};
						}
					}
				},
				functions: {
					isUsingCloudFoundryProxy : function() { return true; }
				}
		};
		var instance = createInstance(inject);
		assert.strictEqual(instance.isVendorContentAvailable(), true, "THEN vendor content can be imported");
		assert.strictEqual(instance.showSemanticObject(), false, "THEN semantic object shall NOT be shown");
	});
	QUnit.test("WHEN isUsingCloudFoundryProxy returns false AND layered repository is NOT active", function(assert){
		var vendorContentSpy = sinon.spy();
		var inject = {
				instances : {
					component : {
						getMetadata : function() {
							return {
								getManifest : function() { return { "sap.apf" : { activateLrep : false } }; }
							};
						}
					}
				},
				exit: {
					hasVendorContent: vendorContentSpy
				},
				functions: {
					isUsingCloudFoundryProxy : function() { return false; }
				}
		};
		var instance = createInstance(inject);
		assert.strictEqual(instance.isVendorContentAvailable(), false, "THEN vendor content is NOT available");
		assert.strictEqual(vendorContentSpy.called, false, "THEN exit hasVendorContent was not called");
		assert.strictEqual(instance.showSemanticObject(), true, "THEN semantic object shall be shown");
	});
	QUnit.test("WHEN layered repository is active", function(assert){
		var vendorContentSpy = sinon.spy();
		var inject = {
				instances : {
					component : {
						getMetadata : function() {
							return {
								getManifest : function() { return { "sap.apf" : { activateLrep : true } }; }
							};
						}
					}
				},
				exit: {
					hasVendorContent: vendorContentSpy
				}
		};
		var instance = createInstance(inject);
		assert.strictEqual(instance.isVendorContentAvailable(), true, "THEN vendor content is available");
		assert.strictEqual(vendorContentSpy.called, false, "THEN exit hasVendorContent was not called");
		assert.strictEqual(instance.showSemanticObject(), false, "THEN semantic object shall NOT be shown");
	});
	QUnit.test("WHEN layered repository is NOT active AND cloud foundry proxy is NOT active", function(assert){
		var vendorContentSpy = sinon.spy();
		var inject = {
				instances : {
					component : {
						getMetadata : function() {
							return {
								getManifest : function() { return {}; }
							};
						}
					}
				},
				exit: {
					hasVendorContent: vendorContentSpy
				}
		};
		var instance = createInstance(inject);
		assert.strictEqual(instance.isVendorContentAvailable(), false, "THEN vendor content is NOT available");
		assert.strictEqual(vendorContentSpy.called, false, "THEN exit hasVendorContent was not called");
		assert.strictEqual(instance.showSemanticObject(), true, "THEN semantic object shall be shown");
	});
	QUnit.module("Function isUsingCloudFoundryProxy");
	QUnit.test("WHEN injection returns true", function(assert) {
		var instance = new ModelerCoreInstance({}, {
			constructors : {
				PersistenceProxy : ODataProxy
			},
			functions : {
				isUsingCloudFoundryProxy : function() {
					return true;
				}
			}
		});
		assert.strictEqual(instance.isUsingCloudFoundryProxy(), true, "THEN isUsingCloudFoundryProxy returns true");
	});
	QUnit.test("WHEN injection returns false", function(assert) {
		var instance = new ModelerCoreInstance({}, {
			functions : {
				isUsingCloudFoundryProxy : function() {
					return false;
				}
			}
		});
		assert.strictEqual(instance.isUsingCloudFoundryProxy(), false, "THEN isUsingCloudFoundryProxy returns false");
	});
	QUnit.test("WHEN injection is not defined", function(assert) {
		var instance = new ModelerCoreInstance({}, {
			functions : {}
		});
		assert.strictEqual(instance.isUsingCloudFoundryProxy(), false, "THEN isUsingCloudFoundryProxy returns false");
	});
	QUnit.test("WHEN functions is not defined", function(assert) {
		var instance = new ModelerCoreInstance({}, {});
		assert.strictEqual(instance.isUsingCloudFoundryProxy(), false, "THEN isUsingCloudFoundryProxy returns false");
	});
	QUnit.test("WHEN inject is not defined", function(assert) {
		var instance = new ModelerCoreInstance({}, undefined);
		assert.strictEqual(instance.isUsingCloudFoundryProxy(), false, "THEN isUsingCloudFoundryProxy returns false");
	});
	QUnit.module("Function getGenericExit");
	QUnit.test("WHEN exit function is defined", function(assert) {
		var exit = function() {};
		var instance = new ModelerCoreInstance({}, {
			exits : {
				testExit : exit
			}
		});
		assert.strictEqual(instance.getGenericExit("testExit"), exit, "THEN getGenericExit returns the exit function");
	});
	QUnit.test("WHEN exit function is not defined", function(assert) {
		var instance = new ModelerCoreInstance({}, {
			exits : {}
		});
		assert.strictEqual(instance.getGenericExit("testExit"), undefined, "THEN getGenericExit returns undefined");
	});
	QUnit.test("WHEN exits is not defined", function(assert) {
		var instance = new ModelerCoreInstance({}, {});
		assert.strictEqual(instance.getGenericExit("testExit"), undefined, "THEN getGenericExit returns undefined");
	});
	QUnit.test("WHEN inject is not defined", function(assert) {
		var instance = new ModelerCoreInstance({}, undefined);
		assert.strictEqual(instance.getGenericExit("testExit"), undefined, "THEN getGenericExit returns undefined");
	});

	QUnit.module("Function getComponent: Given a core instance and its injection object");
	QUnit.test("WHEN component is defined by injection from ModelerComponent", function(assert) {
		var ComponentStub = {
			getMetadata: function() {
				return {
					getManifest: function() {}
				};
			}
		};
		var instance = new ModelerCoreInstance({}, {
			instances: {
				component: ComponentStub
			}
		});
		assert.strictEqual(instance.getComponent(), ComponentStub, "THEN getComponent returns the (injected) component.");
	});
	QUnit.test("WHEN component is not defined by injection from ModelerComponent", function(assert) {
		var instance = new ModelerCoreInstance({}, {
			instances: {}
		});
		assert.strictEqual(instance.getComponent(), undefined, "THEN getComponent returns undefined.");
	});
	QUnit.test("WHEN instances are not injected", function(assert) {
		var instance = new ModelerCoreInstance({}, {});
		assert.strictEqual(instance.getComponent(), undefined, "THEN getComponent returns undefined.");
	});
	QUnit.test("WHEN inject are not defined", function(assert) {
		var instance = new ModelerCoreInstance({}, undefined);
		assert.strictEqual(instance.getComponent(), undefined, "THEN getComponent returns undefined.");
	});
});