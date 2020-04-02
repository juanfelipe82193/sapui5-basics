/* 
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */

jQuery.sap.declare('sap.apf.withServer.tAnalyticalConfigurationWithLRep');
jQuery.sap.require('sap.apf.utils.utils');
jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.apf.modeler.Component');
jQuery.sap.require('sap.apf.modeler.core.instance');
jQuery.sap.require('sap.apf.core.layeredRepositoryProxy');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.core.utils.filter');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.helper');

jQuery.sap.require('sap.apf.internal.server.userData');

sap.apf.testhelper.injectURLParameters({
	"sap-client" : "928"
});
jQuery.sap.require('sap.apf.core.messageObject');

(function() {
	'use strict';

	function authenticate(connector, assert, furtherTask) {
		var done = assert.async();
		var promise = connector.send('/sap/bc/lrep/content/sap/apf/dt', "GET", {}, 
				{ username : sap.apf.internal.server.userData.lrep.user, password : sap.apf.internal.server.userData.lrep.password });
		promise.then(function() {
			if (furtherTask) {
				furtherTask(done);
			} else {
				done();
			}
		}, function error() {
			assert.ok(false, "Authentification failed");
			done();
		});
	}

	function createLayeredRepositoryProxy(context) {

		var coreApi = {};
		var injectForPersistenceProxy = {
			instances : {
				messageHandler : context.messageHandler,
				coreApi : coreApi
			}
		};
		context.proxy = new sap.apf.core.LayeredRepositoryProxy({}, injectForPersistenceProxy);
	}

	function commonSetup(context, assert) {
		var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		context.messageHandler = messageHandler;
		createLayeredRepositoryProxy(context);
		context.connector = context.proxy.getConnector();
		authenticate(context.connector, assert);
	}

	QUnit.module('Listing all Applications in Vendor Layer with LayeredRepositoryProxy', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
		}
	});

	QUnit.test("WHEN reading all applications in CUSTOMER layer", function(assert) {
		var done = assert.async();
		function callbackFromReadAllApplications(applications, metadata, messageObject) {
			assert.ok(applications && applications.length > 0, "list of applications is not empty");
			applications.forEach(function(application) {
				assert.ok(sap.apf.utils.isValidPseudoGuid(application.Application), application.Application + " application guid is returned in correct format");
				assert.ok(application.ApplicationName, application.ApplicationName + " as application Name is returned");
			});
			assert.equal(messageObject, undefined, "THEN no error occurred");
			done();
		}
		///sap/bc/lrep/content/sap/apf/dt/14404007058824102570773461751439/texts.properties
		this.proxy.readCollection('application', callbackFromReadAllApplications);
	});
	QUnit.module('Basic Tests with LayeredRepositoryProxy', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
		}
	});
	QUnit.test("Create Analytical Application, Configuration, Texts with Connector", function(assert) {
		var done = assert.async();
		var that = this;
		function callbackFromReadAllApplicationsAfterApplicationDelete(applications, metadata, messageObject) {
			var i = 0;
			for(i = 0; i < applications.length; i++) {
				if (applications[i] && applications[i].Application && applications[i].Application === that.expectedApplication) {
					assert.ok(false, "the deleted application still exists");
				}
			}
			assert.ok(true, "applications seems to be deleted truly");
			done();
		}
		function callbackFromDeleteApplication(metadata, messageObject) {
			assert.equal(messageObject, undefined, "THEN no error appeared when deleting the application " + that.expectedApplication);
			that.proxy.readCollection('application', callbackFromReadAllApplicationsAfterApplicationDelete);
		}
		function callbackFromReadAllApplications(applications, metadata, messageObject) {
			var i = 0;
			for(i = 0; i < applications.length; i++) {
				if (applications[i] && applications[i].Application && applications[i].Application === that.expectedApplication && applications[i].ApplicationName === "new Application Name") {
					assert.ok(true, "the created application with proper application name is found");
				}
			}
			that.proxy.remove("application", [ {
				name : "Application",
				value : that.expectedApplication
			} ], callbackFromDeleteApplication);
		}
		function readAllApplications() {
			that.proxy.readCollection('application', callbackFromReadAllApplications);
		}
		function callbackFromUpdateApplication(metadata, messageObject) {
			assert.equal(messageObject, undefined, "Then no error occurred at update the application");
			readAllApplications();
		}
		function updateApplication() {
			var config = {
				Application : that.expectedApplication,
				ApplicationName : "new Application Name",
				SemanticObject : ""
			};
			that.proxy.update("application", config, callbackFromUpdateApplication, [ {
				name : "Application",
				value : that.expectedApplication
			} ]);
		}
		function callbackFromDeleteConfiguration(metadata, messageObject) {
			assert.equal(messageObject, undefined, "THEN no error appeared at delete of configuration");
			updateApplication();
		}

		function callbackFromUpdateAnalyticalConfiguration(metadata, messageObject) {
			assert.equal(messageObject, undefined, "THEN no error appeared at update of configuration");	
			var filterApplication = new sap.apf.core.utils.Filter(that.messageHandler, 'Application', 'eq', that.expectedApplication);
			var filterLanguage = new sap.apf.core.utils.Filter(that.messageHandler, 'Language', 'eq', sap.apf.core.constants.developmentLanguage);
			filterLanguage.addAnd(filterApplication);
			var requestConfigurations = [];
			var selectList = [ "AnalyticalConfiguration", "AnalyticalConfigurationName", "Application", "CreatedByUser", "CreationUTCDateTime", "LastChangeUTCDateTime", "LastChangedByUser" ];
			requestConfigurations.push({
				entitySetName : "configuration",
				filter : filterApplication,
				selectList : selectList
			});
			requestConfigurations.push({
				entitySetName : 'texts',
				filter : filterLanguage
			});
			that.batchCallbackIsExecuted = false;	
			that.proxy.readCollectionsInBatch(requestConfigurations, callbackFromReadCollectionsInBatch); 
		}
		function callbackFromChangeRequestsInBatch(messageObject) {
			assert.equal(messageObject, undefined, "THEN no error occurred at change request in batch");
			that.proxy.remove("configuration", [ {
				name : "AnalyticalConfiguration",
				value : that.expectedAnalyticalConfiguration
			} ], callbackFromDeleteConfiguration, undefined, that.expectedApplication);
		}
		function callbackFromReadCollectionsInBatch(data, messageObject) {
			assert.equal(data.length, 2, 'THEN there are two datasets included in the collection');
			assert.equal(data[1].length, 3, 'THEN there are 3 texts  included in the second data set');
			var filterApplication = new sap.apf.core.utils.Filter(that.messageHandler, 'Application', 'eq', that.expectedApplication);
			var filterLanguage = new sap.apf.core.utils.Filter(that.messageHandler, 'Language', 'eq', sap.apf.core.constants.developmentLanguage);
			filterLanguage.addAnd(filterApplication);
			that.callbackOfReadCollectionWasCalled = false;
			that.proxy.readCollection("texts", function (result){
				
				var changeRequests = [];
				var texts = data[1];
				var i;
				for(i = 0; i < 3; i++) {
					texts[i].TextElementDescription += 'Changed';
					changeRequests.push({
						method : "POST",
						entitySetName : "texts",
						data : texts[i]
					});
				}
				that.proxy.doChangeOperationsInBatch(changeRequests, callbackFromChangeRequestsInBatch, that.expectedApplication);
			}, undefined, undefined, filterLanguage, false);

			
		}

		function updateAnalyticalConfiguration(config) {
			var data;
			config.Application = that.expectedApplication;
			function callbackFromCreate(result) {
				assert.ok(sap.apf.utils.isValidPseudoGuid(result.TextElement), "THEN GUID for text element is returned");
			}
			for(var i = 0; i < 3; i++) {
				data = {
					TextElement : "", //key should be filled automatically
					Language : sap.apf.core.constants.developmentLanguage,
					TextElementType : "YMSG",
					TextElementDescription : "myText" + i,
					MaximumLength : 10,
					Application : that.expectedApplication,
					TranslationHint : "Do it"
				};
				that.proxy.create('texts', data, callbackFromCreate);
			}
			that.proxy.update("configuration", config, callbackFromUpdateAnalyticalConfiguration, [ {
				name : "AnalyticalConfiguration",
				value : config.AnalyticalConfiguration
			} ]);
		}

		function callbackFromReadConfigurationTwice(configurationData, metadata, messageObject) {

			assert.ok(messageObject === undefined, "no error message");
			assert.equal(Object.getOwnPropertyNames(configurationData).length, 1, "THEN the correct number of properties are selected");
			assert.ok(configurationData.Application !== undefined, "THEN the correct property is returned");
			assert.equal(configurationData.Application, that.expectedApplication, 'THEN the correct application is returned');

			that.proxy.readEntity('configuration', function(configData) {
				updateAnalyticalConfiguration(configData);
			}, [ {
				value : that.expectedAnalyticalConfiguration
			} ], undefined, configurationData.Application);
		}
		function callbackFromReadEntityOfConfiguration(configurationData, metadata, messageObject) {
			assert.ok(messageObject === undefined, 'no error from Read Entity of Configuration');
			var expectedConfig = sap.apf.testhelper.config.getSampleConfiguration();
			assert.deepEqual(JSON.parse(configurationData.SerializedAnalyticalConfiguration).steps, expectedConfig.steps, 'THEN the correct serializedConfig is returned');

			that.proxy.readEntity('configuration', callbackFromReadConfigurationTwice, [ {
				value : that.expectedAnalyticalConfiguration
			} ], [ "Application" ],  that.expectedApplication);
		}
		function callbackFromCreateConfiguration(configurationData, metadata, messageObject) {
			that.expectedAnalyticalConfiguration = configurationData.AnalyticalConfiguration;
			assert.ok(sap.apf.utils.isValidPseudoGuid(configurationData.AnalyticalConfiguration), "THEN the Analytical Configuration Guid is returned");
			assert.equal(messageObject, undefined, "THEN no error appeared");
			that.proxy.readEntity('configuration', function (configurationData, metadata, messageObject) {
				that.callbackWasExecuted = true;
				callbackFromReadEntityOfConfiguration(configurationData, metadata, messageObject);
			}, [ {
				value : configurationData.AnalyticalConfiguration
			} ], undefined,  that.expectedApplication);
		}
		function createAnalyticalConfiguration(Application) {
			that.expectedApplication = Application;
			var analyticalConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
			var config = {
				AnalyticalConfigurationName : "niceConfiguration",
				Application : Application,
				SerializedAnalyticalConfiguration : JSON.stringify(analyticalConfiguration)
			};
			that.proxy.create("configuration", config, callbackFromCreateConfiguration);
		}
		function callbackFromCreateApplication(applicationData, metadata, messageObject) {
			assert.equal(applicationData.ApplicationName, "marvel", "THEN correct application name has been returned");
			assert.equal(messageObject, undefined, "THEN no error appeared");
			createAnalyticalConfiguration(applicationData.Application);
		}
		this.appObject = {
			ApplicationName : "marvel"
		};
		this.proxy.create("application", this.appObject, callbackFromCreateApplication);
	});

	QUnit.module('Reading VENDOR Layer', {
		beforeEach : function(assert) {
			commonSetup(this, assert);
		},
		afterEach : function (assert) {
			var that = this;
			this.appObject.value = this.Application;
			function callback (metadata, messageObject) {
				if(messageObject){
					assert.ok(false,"Error in teardown");
				}
				that.proxy.remove("application" , [that.appObject], function(){} , undefined, undefined, "VENDOR");
			}
			this.proxy.remove("application" , [this.appObject], callback , undefined, undefined, "CUSTOMER");
		}
	});

	QUnit.test("CREATE AND READ analytical Configuration in VENDOR LAYER and copy to CUSTOMER layer", function(assert){
		var that = this;
		var done = assert.async();

		function callbackFromUpdateAnalyticalConfigurationInCustomerLayer(data, metadata, messageObject) {

			assert.equal(messageObject, undefined, "THEN no error WHEN creating updating analytical configuration first time in customer layer");

			that.proxy.readEntity('configuration', function(data, metadata, messageObject) {
				var conf = JSON.parse(data.SerializedAnalyticalConfiguration);

				assert.equal(conf.analyticalConfigurationName, "CustomerModifiedConfiguration", "THEN the configuration is read" );
				assert.equal(messageObject, undefined, "THEN no error when reading the configuration from VENDOR LAYER with no layer specified");
				done();
			}, [ {
				value : that.expectedAnalyticalConfigurationId 
			} ], undefined,  that.Application, { layer : 'CUSTOMER'});

		}
		function updateAnalyticalConfigurationInCustomerLayer(applicationId, analyticalConfigurationId) {

			that.Application = applicationId;
			createLayeredRepositoryProxy(that);
			that.expectedAnalyticalConfigurationId = analyticalConfigurationId;
			var analyticalConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
			analyticalConfiguration.analyticalConfigurationName = "CustomerModifiedConfiguration";
			var config = {
					AnalyticalConfigurationName : "officialDsoConfiguration",
					Application : applicationId,
					AnalyticalConfiguration : analyticalConfigurationId,
					SerializedAnalyticalConfiguration : JSON.stringify(analyticalConfiguration)
				};

			that.proxy.update("configuration", config, callbackFromUpdateAnalyticalConfigurationInCustomerLayer, [ {
				name : "AnalyticalConfiguration",
				value : analyticalConfigurationId
			} ]);

		}
		function callbackFromCreateVendorConfiguration(configurationData, metadata, messageObject) {

			assert.equal(messageObject, undefined, "THEN no error appeared WHEN creating vendor configuration");
			assert.ok(configurationData && configurationData.AnalyticalConfiguration && sap.apf.utils.isValidPseudoGuid(configurationData.AnalyticalConfiguration), "THEN the Analytical Configuration Guid is returned");

			that.expectedAnalyticalConfiguration = configurationData.AnalyticalConfiguration;
			createLayeredRepositoryProxy(that);
			that.proxy.readEntity('configuration', function(data, metadata, messageObject) {
			    var conf = JSON.parse(data.SerializedAnalyticalConfiguration);

				assert.equal(conf.analyticalConfigurationName, "configForTesting", "THEN the configuration is read" );
				assert.equal(messageObject, undefined, "THEN no error when reading the configuration from VENDOR LAYER with no layer specified");
				updateAnalyticalConfigurationInCustomerLayer(that.Application, configurationData.AnalyticalConfiguration);
			}, [ {
				value : configurationData.AnalyticalConfiguration
			} ], undefined, that.Application, { layer : 'ALL'});

		}
		function callbackFromCreateVendorApplication(data, metadata, messageObject) {
			that.Application = data.Application;

			assert.equal(messageObject, undefined, "THEN no error appeared");
			var analyticalConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
			var config = {
				AnalyticalConfigurationName : "officialDsoConfiguration",
				Application : data.Application,
				SerializedAnalyticalConfiguration : JSON.stringify(analyticalConfiguration)
			};
			that.proxy.create("configuration", config, callbackFromCreateVendorConfiguration,  { layer : 'VENDOR'});
		}
		this.appObject = { ApplicationName : "OfficialDsoDelivery" };
		this.proxy.create("application", this.appObject, callbackFromCreateVendorApplication, { layer : 'VENDOR'});
	});
	QUnit.module("M: readALlConfigurationsFromVendorLayer()", {
		beforeEach: function (assert){
			commonSetup(this, assert);
		}
	});

	QUnit.test("readALlConfigurationsFromVendorLayer() with 1 configuration in Vendor Layer", function (assert){
		var done = assert.async();
		var that = this;
		function callbackAfterRemove(){
			done();
		}
		function callbackFromCreateVendorConfiguration(configurationData, metadata, messageObject) {
			var expectedValue = that.appObject.value + "." + configurationData.AnalyticalConfiguration;
			assert.equal(messageObject, undefined, "THEN no error appeared WHEN creating vendor configuration");
			assert.ok(configurationData && configurationData.AnalyticalConfiguration && sap.apf.utils.isValidPseudoGuid(configurationData.AnalyticalConfiguration), "THEN the Analytical Configuration Guid is returned");


			var promise = that.proxy.readAllConfigurationsFromVendorLayer();
			promise.then(function(data){
				var i, configurationFound;
				configurationFound = false;
				for (i = 0; i < data.length;i++) {
					if (data[i].value == expectedValue) {
						configurationFound = true;
						break;
					}
				}
				assert.ok(configurationFound, "THEN the correct configuration was read");
				that.proxy.remove("application" , [that.appObject], callbackAfterRemove, undefined, undefined, "VENDOR");
			});
		}
		function callbackFromCreateVendorApplication(data, metadata, messageObject) {
			that.appObject.value = data.Application;

			assert.equal(messageObject, undefined, "THEN no error appeared");
			var analyticalConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
			var config = {
				AnalyticalConfigurationName : "officialDsoConfiguration",
				Application : data.Application,
				SerializedAnalyticalConfiguration : JSON.stringify(analyticalConfiguration)
			};
			that.proxy.create("configuration", config, callbackFromCreateVendorConfiguration, { layer : 'VENDOR'});
		}
		this.appObject = { ApplicationName : "OfficialDsoDelivery" };
		this.proxy.create("application", this.appObject, callbackFromCreateVendorApplication, { layer : 'VENDOR'});
	});
	QUnit.test("readAllConfigurationsFromVendorLayer() with 1 configuration in VENDOR Layer and 1 in CUSTOMER layer", function (assert){
		var done = assert.async();
		var that = this;
		function callbackAfterRemove(){
			done();
		}
		function callbackAfterRemoveFromCustomerLayer(){
			that.proxy.remove("application" , [that.appObjectVendor], callbackAfterRemove, undefined, undefined, "VENDOR");
		}
		function callbackFromCreateCustomerConfiguration(configurationData, metadata, messageObject) {
			var expectedValue = that.appObjectVendor.value + "." + that.expectedConfigurationId;
			assert.equal(messageObject, undefined, "THEN no error appeared WHEN creating vendor configuration");
			assert.ok(configurationData && configurationData.AnalyticalConfiguration && sap.apf.utils.isValidPseudoGuid(configurationData.AnalyticalConfiguration), "THEN the Analytical Configuration Guid is returned");

			var promise = that.proxy.readAllConfigurationsFromVendorLayer();
			promise.then(function(data){
				var i, configurationFound;
				configurationFound = false;
				for (i = 0; i < data.length;i++) {
					if (data[i].value == expectedValue) {
						configurationFound = true;
						break;
					}
				}
				assert.ok(configurationFound, "THEN the correct configuration was read");
				that.proxy.remove("application" , [that.appObjectCustomer], callbackAfterRemoveFromCustomerLayer, undefined, undefined, "CUSTOMER");
			});
		}
		function callbackFromCreateCustomerApplication(data, metadata, messageObject) {
			that.appObjectCustomer.value = data.Application;

			assert.equal(messageObject, undefined, "THEN no error appeared");
			var analyticalConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
			var config = {
				AnalyticalConfigurationName : "officialDsoConfiguration",
				Application : data.Application,
				SerializedAnalyticalConfiguration : JSON.stringify(analyticalConfiguration)
			};
			that.proxy.create("configuration", config, callbackFromCreateCustomerConfiguration, { layer : 'CUSTOMER'});
		}
		function callbackFromCreateVendorConfiguration(configurationData, metadata, messageObject) {
			that.expectedConfigurationId = configurationData.AnalyticalConfiguration;
			that.appObjectCustomer = { ApplicationName : "OfficialDsoDelivery" };
			assert.equal(messageObject, undefined, "THEN no error appeared WHEN creating vendor configuration");
			assert.ok(configurationData && configurationData.AnalyticalConfiguration && sap.apf.utils.isValidPseudoGuid(configurationData.AnalyticalConfiguration), "THEN the Analytical Configuration Guid is returned");
			that.proxy.create("application", that.appObjectCustomer, callbackFromCreateCustomerApplication, { layer : 'CUSTOMER'});
		}
		function callbackFromCreateVendorApplication(data, metadata, messageObject) {
			that.appObjectVendor.value = data.Application;

			assert.equal(messageObject, undefined, "THEN no error appeared");
			var analyticalConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
			var config = {
				AnalyticalConfigurationName : "officialDsoConfiguration",
				Application : data.Application,
				SerializedAnalyticalConfiguration : JSON.stringify(analyticalConfiguration)
			};
			that.proxy.create("configuration", config, callbackFromCreateVendorConfiguration, { layer : 'VENDOR'});
		}
		this.appObjectVendor = { ApplicationName : "OfficialDsoDelivery" };
		this.proxy.create("application", this.appObjectVendor, callbackFromCreateVendorApplication, { layer : 'VENDOR'});
	});


	QUnit.module('Import Configuration from VENDOR layer', {
		beforeEach : function(assert) {
			var that = this;

			function prepareVendorConfiguration (done) {

				function callbackFromCreateVendorConfiguration(configurationData, metadata, messageObject) {

					assert.equal(messageObject, undefined, "THEN no error appeared WHEN creating vendor configuration");
					if (messageObject) {
						done();
						return;
					}
					assert.ok(configurationData && configurationData.AnalyticalConfiguration && sap.apf.utils.isValidPseudoGuid(configurationData.AnalyticalConfiguration), "THEN the Analytical Configuration Guid is returned");
					that.VendorAnalyticalConfiguration = configurationData.AnalyticalConfiguration;

					var filterApplication = new sap.apf.core.utils.Filter(that.messageHandler, 'Application', 'eq', that.VendorApplication);
					var filterLanguage = new sap.apf.core.utils.Filter(that.messageHandler, 'Language', 'eq', sap.apf.core.constants.developmentLanguage);
					filterLanguage.addAnd(filterApplication);

					that.proxy.readCollection("texts", function (result, metadata, messageObject){
						assert.equal(messageObject, undefined, "THEN the texts are available in VENDOR layer");
						done();
					}, undefined, undefined, filterLanguage, { layer : "VENDOR"});

				}
				function callbackFromCreateVendorApplication(data, metadata, messageObject) {
					that.VendorApplication = data.Application;

					assert.equal(messageObject, undefined, "THEN no error appeared");
					if (messageObject) {
						done();
						return;
					}
					var textPropertyFile = createTextPropertyFile(that.VendorApplication, that.messageHandler);
					var applicationNamespace = getApplicationNamespace(that.VendorApplication);
					var connector = that.proxy.getConnector();
					var promiseForUpdateTexts = connector.upsert(applicationNamespace, 'text', 'properties', "VENDOR", textPropertyFile, 'text/plain');
					promiseForUpdateTexts.then(function(result){
						assert.ok(true, "THEN texts have been created in VENDOR LAYER");
						var analyticalConfiguration = getConfigurationTestImport();
						analyticalConfiguration.configHeader.Application = that.VendorApplication;
						var config = {
							AnalyticalConfigurationName : "TestImportConf2",
							Application : that.VendorApplication,
							SerializedAnalyticalConfiguration : JSON.stringify(analyticalConfiguration)
						};
						that.proxy.create("configuration", config, callbackFromCreateVendorConfiguration, { layer : 'VENDOR'});
					}, function(error) {
						assert.ok(false, "Error when creating the texts file");
						done();
						return;
					});

				}

				that.appObject = { ApplicationName : "Test LREP Import" };
				that.proxy.create("application", that.appObject, callbackFromCreateVendorApplication, { layer : 'VENDOR'});
			}


			this.initProxy(this, assert);
			authenticate(that.proxy.getConnector(), assert, prepareVendorConfiguration);

		},
		initProxy : function(context, assert) {
				var assertNoMessages = function(messageObject) {
					if (messageObject.getCode() === "11013") {
						assert.ok(true, "THEN metadata of the loaded analytical configuration cannot be handled");
						return;
					}
					assert.ok(false, "THEN no error should occurr");
				};
				var Probe = function(instanceInternals) {
					context.proxy = instanceInternals.persistenceProxy;
					context.messageHandler = instanceInternals.messageHandler;
				};
				var persistenceServiceRoot = sap.apf.core.constants.modelerPersistenceServiceRoot;
				var persistenceConfiguration = {
					serviceRoot : persistenceServiceRoot,
					useLayeredRepositoryForAnalyticalConfiguration : true
				};
				var inject = {
					instances : {
						component : { 
							getMetadata : function() {
								return {
									getManifest : function () {
										return { 
											"sap.apf" : { 
												"activateLrep" : true 
											}
										};
									}
								};
							}
						}
					},
					probe : Probe
				};
				inject.constructors = {
						PersistenceProxy : sap.apf.core.LayeredRepositoryProxy
				};
				inject.functions = {
							getNavigationTargetForGenericRuntime : function() {
								return undefined;
							}
				};
				context.coreApi = new sap.apf.modeler.core.Instance(persistenceConfiguration, inject);
				context.coreApi.setCallbackForMessageHandling(assertNoMessages);
		},
		afterEach : function (assert) {
			var that = this;
			var done = assert.async();
			if (!this.VendorApplication) {
				done();
				return;
			}
			this.appObject.value = this.VendorApplication;
			function callback (metadata, messageObject) {
				if(messageObject){
					assert.ok(false,"Error in teardown");
				}
				that.proxy.remove("application" , [that.appObject], function(){ done();} , undefined, undefined, "VENDOR");
			}
			this.proxy.remove("application" , [this.appObject], callback , undefined, undefined, "CUSTOMER");
		}
	});

	QUnit.test("Import Configuration from VENDOR layer", function(assert) {
		var that = this;
		var done = assert.async();

		function callbackDetermineOverwrite(callbackOverwrite, callbackCreateNew) {
			callbackOverwrite();
		}

		function checkImportedConfiguration(configurationEditor) {
			var config = configurationEditor.serialize();
			var expectedConfiguration = getConfigurationTestImport();
			expectedConfiguration.configHeader.Application = that.VendorApplication;
			assert.deepEqual(config.requests, expectedConfiguration.requests, "No loss during import in request definitions");
			assert.deepEqual(config.steps, expectedConfiguration.steps, "No loss during import in step definitions");
			assert.deepEqual(config.bindings, expectedConfiguration.bindings, "No loss during import in binding definitions");
			assert.deepEqual(config.representations, expectedConfiguration.representations, "No loss during import in representation definitions");
			done();
		}
		function loadApplicationForConfigurationChecking(configurationHandler, messageObject) {
			assert.equal(messageObject, undefined, "THEN no error occurred WHEN retrieving configurationHandler");
			if (messageObject) {
				done();
				return;
			}
			configurationHandler.loadConfiguration(that.VendorAnalyticalConfiguration, checkImportedConfiguration);
		}
		function callbackImport(configurationId, metadata, messageObject) {

			assert.equal(messageObject, undefined, "THEN no error occurred at import");
			if (messageObject) {
				done();
				return;
			}
			assert.equal(configurationId, that.VendorAnalyticalConfiguration, "ConfigurationId remains stable, when Overwrite");
			that.coreApi.getConfigurationHandler(that.VendorApplication, loadApplicationForConfigurationChecking);
		}

		if (!that.VendorAnalyticalConfiguration) {
			assert.ok(false, "No Vendor Configuration could be created");
			done();
			return;
		}
		that.coreApi.importConfigurationFromVendorLayer(that.VendorApplication, that.VendorAnalyticalConfiguration, callbackDetermineOverwrite, callbackImport);

	});

	function createTextPropertyFile(applicationId, messageHandler) {
		var textString = getTextsForTestImport();
		var parseResult = sap.apf.utils.parseTextPropertyFile(textString, { instances : { messageHandler : messageHandler}});
		var textElements = parseResult.TextElements;
		var textsTable = new sap.apf.utils.Hashtable(messageHandler);
		textElements.forEach(function(textElement) {
			textElement.Application = applicationId;
			textsTable.setItem(textElement.TextElement, textElement);
		});
		var textPropertyFile = sap.apf.utils.renderHeaderOfTextPropertyFile(applicationId, messageHandler);
		textPropertyFile = textPropertyFile + sap.apf.utils.renderTextEntries(textsTable, messageHandler);
		return textPropertyFile;
	}
	function getApplicationNamespace(applicationGuid) {
		var namespace = 'sap/apf/dt';
		return namespace + '/' + applicationGuid;
	}
	function getConfigurationTestImport() {
		return {"analyticalConfigurationName":"TestImportConf2","applicationTitle":{"type":"label","kind":"text","key":"14404007358802557866033861478127"},"steps":[{"type":"step","description":"DSORevenueHappy","request":"request-for-Step-1","binding":"binding-for-Step-1","id":"Step-1","title":{"type":"label","kind":"text","key":"14404913776378186502053507753634"},"navigationTargets":[],"longTitle":{"type":"label","kind":"text","key":"14404011975456888236387314524050"},"thumbnail":{"type":"thumbnail","leftUpper":{"type":"label","kind":"text","key":"14404913841009841360140190847501"},"rightUpper":{"type":"label","kind":"text","key":"14404913492692611038081745207708"},"rightLower":{"type":"label","kind":"text","key":"14404913270962822518600854784659"}}},{"type":"step","description":"DSORevenue22","request":"request-for-Step-2","binding":"binding-for-Step-2","id":"Step-2","title":{"type":"label","kind":"text","key":"14404170229034409260021957359954"},"navigationTargets":[],"longTitle":{"type":"label","kind":"text","key":"14404175457543453990807683957287"},"thumbnail":{"type":"thumbnail","leftUpper":{"type":"label","kind":"text","key":"14404913335477989867015857412207"},"rightUpper":{"type":"label","kind":"text","key":"14404913270962822518600854784659"}}}],"requests":[{"type":"request","id":"request-for-Step-1","service":"/sap/hba/apps/wca/dso/s/odata/wca.xsodata","entitySet":"WCADSORevenueQuery","selectProperties":["CompanyCode","CompanyCodeName","CompanyCodeCountryName","ExchangeRateType","AmountInDisplayCurrency_E.CURRENCY","RevenueAmountInDisplayCrcy_E","ArrearsDaysSalesOutstanding"]},{"type":"request","id":"request-for-Step-2","service":"/sap/hba/apps/wca/dso/s/odata/wca.xsodata","entitySet":"WCADSORevenueQuery","selectProperties":["CompanyCode","CompanyCodeName","CompanyCodeCountryName","ExchangeRateType","AmountInDisplayCurrency_E.CURRENCY","RevenueAmountInDisplayCrcy_E","ArrearsDaysSalesOutstanding"]}],"bindings":[{"type":"binding","id":"binding-for-Step-1","stepDescription":"DSORevenueHappy", "requiredFilterOptions": undefined,"requiredFilters":["CompanyCode"],"representations":[{"id":"Step-1-Representation-1","representationTypeId":"ColumnChart","parameter":{"dimensions":[{"fieldName":"CompanyCode","kind":"xAxis"}],"measures":[{"fieldName":"RevenueAmountInDisplayCrcy_E","kind":"yAxis"}],"properties":[],"hierarchicalProperty":[{}],"alternateRepresentationTypeId":"TableRepresentation","width":{}},"thumbnail":{"type":"thumbnail","leftUpper":{"type":"label","kind":"text","key":"14404013842042719614115312451005"},"leftLower":{"type":"label","kind":"text","key":"14404013907541698727728737102470"},"rightUpper":{"type":"label","kind":"text","key":"14404913492692611038081745207708"},"rightLower":{"type":"label","kind":"text","key":"14404913270962822518600854784659"}}}]},{"type":"binding","id":"binding-for-Step-2","stepDescription":"DSORevenue22","requiredFilterOptions": undefined,"requiredFilters":["CompanyCode"],"representations":[{"id":"Step-2-Representation-1","representationTypeId":"ColumnChart","parameter":{"dimensions":[{"fieldName":"CompanyCode","kind":"xAxis"}],"measures":[{"fieldName":"RevenueAmountInDisplayCrcy_E","kind":"yAxis"}],"properties":[],"hierarchicalProperty":[{}],"alternateRepresentationTypeId":"TableRepresentation","width":{}},"thumbnail":{"type":"thumbnail","leftUpper":{"type":"label","kind":"text","key":"14404013842042719614115312451005"},"leftLower":{"type":"label","kind":"text","key":"14404013907541698727728737102470"}}}]}],"representationTypes":[],"categories":[{"type":"category","description":"CategoryAllStepsKlaus1","id":"Category-1","label":{"type":"label","kind":"text","key":"14404011532842924989543934972542"},"steps":[{"type":"step","id":"Step-1"},{"type":"step","id":"Step-2"}]}],"facetFilters":[],"navigationTargets":[],"configHeader":{"Application":"14404007058824102570773461751440","ApplicationName":"Klaus2","SemanticObject":"FioriApplication","AnalyticalConfiguration":"14404013463898798185547998056449","AnalyticalConfigurationName":"TestImportConf2","UI5Version":"1.33.0-SNAPSHOT","CreationUTCDateTime":"2015-08-24T12:03:27.6023410Z","LastChangeUTCDateTime":"2015-08-25T08:29:48.9405110Z"}};
	}
	function getTextsForTestImport() {
		return '#FIORI: insert Fiori-Id\n' +
			'# __ldi.translation.uuid=14404007-0588-2410-2570-773461751440\n'  +
			'#ApfApplicationId=14404007058824102570773461751440\n'  +
			'\n' +
			'#XTIT,60\n'  +
			'14404011532842924989543934972542=CategoryAllStepsKlaus1\n'  +
			'# LastChangeDate=2015/08/24 09:40:20\n' +
			'\n' +
			'#XTIT,200\n' +
			'14404011975456888236387314524050=DSORevenueLongText\n' +
			'# LastChangeDate=2015/08/24 09:40:20\n' +
			'\n' +
			'#XFLD,25\n' +
			'14404013842042719614115312451005=Rep1LeftUpper\n' +
			'# LastChangeDate=2015/08/24 09:40:20\n' +
			'\n' +
			'#XFLD,25\n'  +
			'14404013907541698727728737102470=Rep1LeftLowerChanged\n'  +
			'# LastChangeDate=2015/08/24 09:40:20\n'  +
			'\n' +
			'#XTIT,250\n'  +
			'14404007358802557866033861478127=ConfForImport1\n'  +
			'# LastChangeDate=2015/08/24 09:40:20\n'  +
			'\n' +
			'#XTIT,200\n'  +
			'14404175457543453990807683957287=DSORevenue2LongText\n'  +
			'# LastChangeDate=2015/08/24 14:00:02\n'  +
			'\n' +
			'#XTIT,100\n'  +
			'14404170229034409260021957359954=DSORevenue22\n'  +
			'# LastChangeDate=2015/08/24 14:00:02\n'  +
			'\n' +
			'#XFLD,25\n'  +
			'14404913270962822518600854784659=UpperRight\n'  +
			'# LastChangeDate=2015/11/23 16:37:24\n'  +
			'\n' +
			'#XFLD,25\n'  +
			'14404913335477989867015857412207=UpperLeft\n'  +
			'# LastChangeDate=2015/11/23 16:37:24\n'  +
			'\n' +
			'#XFLD,25\n'  +
			'14404913492692611038081745207708=LowerRight\n'  +
			'# LastChangeDate=2015/11/23 16:37:24\n'  +
			'\n' +
			'#XTIT,100\n'  +
			'14404913776378186502053507753634=DSORevenueHappy\n'  +
			'# LastChangeDate=2015/11/23 16:37:24\n'  +
			'\n' +
			'#XTIT,250\n'  +
			'14423209101851097838978191853389=Copy of  ConfForImport2\n'  +
			'# LastChangeDate=2015/11/23 16:37:24\n'  +
			'\n' +
			'#XFLD,25\n'  +
			'14404913841009841360140190847501=upperleft\n'  +
			'# LastChangeDate=2015/11/23 16:37:24\n'  +
			'\n' +
			'#XTIT,250\n'  +
			'14423209205636324816654084694304=ConfForImport2_Kopie\n'  +
			'# LastChangeDate=2015/11/23 16:37:24\n\n';
	}

	QUnit.module("M: clean up", {
		beforeEach: function (assert){
			commonSetup(this, assert);
		}
	});
	QUnit.test("remove",function(assert){
		var done = assert.async();
		var that = this;

		this.proxy.readCollection("application",callback,undefined,undefined,undefined, {layer:"VENDOR"});
		function callback(applications){
			applications.forEach(function(application){
				if(application.ApplicationName === "OfficialDsoDelivery" || application.ApplicationName === "marvel" || application.ApplicationName === "Test LREP Import"){
					that.proxy.remove("application" , [{value: application.Application}], function(){} , undefined, undefined, "VENDOR");
				}
			});
			assert.ok(5);
			done();
		}
	});

}());