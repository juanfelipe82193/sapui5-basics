/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.mockServer.wrapper');
jQuery.sap.require('sap.apf.testhelper.modelerHelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.modeler.core.instance");
jQuery.sap.require("sap.apf.core.instance");
jQuery.sap.require("sap.apf.utils.startParameter");
(function() {
	'use strict';
	//sap.apf.testhelper.watchExecutionOrder();
	var isMockServerActive = true;
	if (jQuery.sap.getUriParameters().get("responderOff") === "true") {
		isMockServerActive = false;
	}
	function getXsrfToken() {
		if (!isMockServerActive) {
			return this.authTestHelper.getXsrfToken();
		}
		return sap.apf.utils.createPromise("Dummy");
	}
	QUnit.module("M1: Buffered application handler", {
		beforeEach : function(assert) {
			this.modelerServicePath = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
			if (isMockServerActive) {
				sap.apf.testhelper.mockServer.activateModeler();
			} else {
				var done = assert.async();
				new sap.apf.testhelper.AuthTestHelper(done, function() {
					done();
				});
			}
		},
		afterEach : function() {
			if (isMockServerActive) {
				sap.apf.testhelper.mockServer.deactivate();
			}
		}
	});
	QUnit.test("T1: Subsequent calls return non-empty array", function(assert) {
		assert.expect(2);
		var done1 = assert.async();
		var hasReturned1st = false;
		var hasReturned2nd = false;
		var coreInstance = new sap.apf.modeler.core.Instance({
			serviceRoot : this.modelerServicePath
		});
		coreInstance.getApplicationHandler(callback1stInvocation);
		coreInstance.getApplicationHandler(callback2ndInvocation);
		function callback1stInvocation(applicationHandler) {
			assert.ok(applicationHandler.getList().length > 0, 'Data from async request response for 1st invocation');
			if (hasReturned2nd) {
				done1();
			} else {
				hasReturned1st = true;
			}
		}
		function callback2ndInvocation(applicationHandler) {
			assert.ok(applicationHandler.getList().length > 0, 'Data from async request response for 2nd invocation');
			if (hasReturned1st) {
				done1();
			} else {
				hasReturned2nd = true;
			}
		}
	});
	QUnit.test("T2: Subsequent calls return same instance", function(assert) {
		assert.expect(3);
		var done1 = assert.async();
		var coreInstance = new sap.apf.modeler.core.Instance({
			serviceRoot : this.modelerServicePath
		});
		var instance1stCall, instance2ndCall;
		var hasReturned1st = false;
		var hasReturned2nd = false;
		coreInstance.getApplicationHandler(callback1stInvocation);
		coreInstance.getApplicationHandler(callback2ndInvocation);
		function callback1stInvocation(applicationHandler) {
			instance1stCall = applicationHandler;
			if (hasReturned2nd) {
				assertIdenticalInstances();
				done1();
			} else {
				hasReturned1st = true;
			}
		}
		function callback2ndInvocation(applicationHandler) {
			instance2ndCall = applicationHandler;
			if (hasReturned1st) {
				assertIdenticalInstances();
				done1();
			} else {
				hasReturned2nd = true;
			}
		}
		function assertIdenticalInstances() {
			assert.ok(instance1stCall, 'Instance is not null');
			assert.ok(instance2ndCall, 'Instance is not null');
			assert.equal(instance1stCall, instance2ndCall, 'Same instance returned from both invocations');
		}
	});
	QUnit.module("M2: Configuration Modeler", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			this.modelerServicePath = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
			if (isMockServerActive) {
				sap.apf.testhelper.mockServer.activateModeler();
				sap.apf.testhelper.modelerHelper.createApplicationHandler(this, function(appHandler) {
					that.applicationHandler = appHandler;
					done();
				});
			} else {
				new sap.apf.testhelper.AuthTestHelper(done, function() {
					sap.apf.testhelper.modelerHelper.createApplicationHandler(this, function(appHandler) {
						this.applicationHandler = appHandler;
						done();
					}.bind(this), this.modelerServicePath);
				}.bind(this));
			}
		},
		afterEach : function(assert) {
			if (isMockServerActive) {
				sap.apf.testhelper.mockServer.deactivate();
			} else {
				sap.apf.testhelper.modelerHelper.removeApplication(this, assert);
			}
		},
		appA : {
			ApplicationName : "apf1972-appA",
			SemanticObject : "semObjA"
		}
	});
	QUnit.test("T1: Create application, create configuration, add category and save", function(assert) {
		var that = this;
		var configurationObject = {
				AnalyticalConfigurationName : "test config A"
		};
		var tempConfigId;
		var done = assert.async();
		//create and save an application
		this.applicationHandler.setAndSave(this.appA, function(id, metadata, messageObject) {
			assert.ok(that.applicationHandler.getApplication(id), "Apllication created");
			that.applicationCreatedForTest = id;
			//get configurationHandler
			that.modelerCore.getConfigurationHandler(id, function(configurationHandler, messageObject) {
				that.configurationHandler = configurationHandler;
				assert.equal(messageObject, undefined, "No error occurred when loading the configuration and texts");
				that.textPool = configurationHandler.getTextPool();
				assert.ok(that.textPool && that.textPool.getPersistentKey, "Textpool is a valid instance");
				//set header information for configuration
				tempConfigId = that.configurationHandler.setConfiguration(configurationObject);
				//get ConfigurationEditor 
				that.configurationHandler.loadConfiguration(tempConfigId, function(configurationEditor) {
					that.configurationEditor = configurationEditor;
					//add a category to configuration
					that.configurationEditor.setCategory({
						labelKey : "localTextReference1"
					});
					//save configuration
					that.configurationEditor.save(function(id, metadata, messageObject) {
						assert.notEqual(id, tempConfigId, "Temporary configuration id is replaced by server generated id");
						that.configurationHandler.loadConfiguration(id, function(editor) {
							assert.equal(that.configurationEditor, editor, "Same configuration editor instance returned");
						});
						assert.deepEqual(that.configurationHandler.getConfiguration(id), configurationObject, "Correct configuration header information returned");
						done();
					});
				});
			});
		});
	});
	QUnit.test("T2: Get configuration handler for not existing application", function(assert) {
		var done = assert.async();
		this.modelerCore.getConfigurationHandler("not existing", function(configurationHandler, messageObject) {
			assert.equal(configurationHandler.getList().length, 0, "No configurations expected");
			done();
		});
	});
	QUnit.test("T3: Delete temporary configuration", function(assert) {
		assert.expect(2);
		var done = assert.async();
		var that = this;
		var tempConfigId;
		var configObject = {
				AnalyticalConfigurationName : "test config A"
		};
		var configHandler;
		var configEditor;
		this.applicationHandler.setAndSave(this.appA, function(id, metadata, messageObject) {
			that.modelerCore.getConfigurationHandler(id, function(configurationHandler, messageObject) {
				configHandler = configurationHandler;
				tempConfigId = configHandler.setConfiguration(configObject);
				configHandler.loadConfiguration(tempConfigId, callbackLoadConfiguration);
			});
		});
		function callbackLoadConfiguration(configurationEditor) {
			configEditor = configurationEditor;
			configHandler.removeConfiguration(tempConfigId, callbackRemoveConfiguration);
		}
		function callbackRemoveConfiguration(id, metadata, messageObject) {
			assert.equal(configHandler.getList().length, 0, "Unsaved configuration removed from internal hashtable");
			configHandler.loadConfiguration(id, function(configurationEditor) {
				assert.notEqual(configurationEditor, configEditor, "Configuration editor instance removed in internal hashtable of configuration handler");
				done();
			});
		}
	});
	QUnit.test("T4: Delete saved configuration", function(assert) {
		assert.expect(2);
		var done = assert.async();
		var that = this;
		var appId;
		var tempConfigId;
		var configObject = {
				AnalyticalConfigurationName : "test config A"
		};
		var configHandler;
		this.applicationHandler.setAndSave(this.appA, function(id, metadata, messageObject) {
			appId = id;
			that.modelerCore.getConfigurationHandler(id, function(configurationHandler, messageObject) {
				configHandler = configurationHandler;
				tempConfigId = configHandler.setConfiguration(configObject);
				configHandler.loadConfiguration(tempConfigId, callbackLoadConfiguration);
			});
		});
		function callbackLoadConfiguration(configurationEditor) {
			configurationEditor.save(callbackSave);
		}
		function callbackSave(configurationId, metadata, messageObject) {
			configHandler.removeConfiguration(configurationId, callbackRemoveConfiguration);
		}
		function callbackRemoveConfiguration(id, metadata, messageObject) {
			assert.equal(configHandler.getList().length, 0, "Configuration removed from internal hashtable");
			//get new modeler instance to check, if configuration is deleted
			sap.apf.testhelper.modelerHelper.createApplicationHandler(that, function(appHandler) {
				that.modelerCore.getConfigurationHandler(appId, callbackNewModelerInstance);
			});
		}
		function callbackNewModelerInstance(configurationHandler, messageObject) {
			assert.equal(configurationHandler.getList().length, 0, "Configuration successfully removed from server");
			done();
		}
	});
	QUnit.test("T5: Delete not existing configuration ", function(assert) {
		assert.expect(1);
		var done = assert.async();
		var that = this;
		this.applicationHandler.setAndSave(this.appA, function(id, metadata, messageObject) {
			that.modelerCore.getConfigurationHandler(id, function(configurationHandler, messageObject) {
				configurationHandler.removeConfiguration("notExistingConfigId", callbackRemoveConfiguration);
			});
		});
		function callbackRemoveConfiguration(id, metadata, messageObject) {
			assert.equal(messageObject.getCode(), "11005", "Message object with proper code provided in callback");
			done();
		}
	});
	QUnit.test("T6: Remove an application containing no configuration", function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.applicationHandler.setAndSave(this.appA, callbackSetAndSave.bind(this));
		function callbackSetAndSave(id, metadata, messageObject) {
			this.applicationHandler.removeApplication(id, callbackRemoveApp);
		}
		function callbackRemoveApp(id, metadata, messageObject) {
			assert.ok(true, "Callback called and no deletion of configurations is triggered, as no lazyLoaderForConfigurationHandler is defined when only application exists");
			assert.equal(messageObject, undefined, "Callback parameter 'messageObject' is undefined");
			done();
		}
	});
	QUnit.test("T7: Call resetConfigurationHandler when no configurationHandler exists", function(assert) {
		assert.expect(1);
		this.modelerCore.resetConfigurationHandler();
		assert.ok(true, "Reset called without error");
	});
	
	QUnit.test("T8: Change name of config AND save config AND change name of config AND reset config", function(assert){

		var done = assert.async();
		var that = this;
		var configurationObject = {
				AnalyticalConfigurationName : "test config A"
		};
		var tempConfigId;
		//create and save an application
		this.applicationHandler.setAndSave(this.appA, function(id, metadata, messageObject) {
			assert.ok(that.applicationHandler.getApplication(id), "Apllication created");
			that.applicationCreatedForTest = id;
			//get configurationHandler
			that.modelerCore.getConfigurationHandler(id, function(configurationHandler, messageObject) {
				that.configurationHandler = configurationHandler;	
				//set header information for configuration
				tempConfigId = that.configurationHandler.setConfiguration(configurationObject);
				//get ConfigurationEditor 
				that.configurationHandler.loadConfiguration(tempConfigId, function(configurationEditor) {
					that.configurationEditor = configurationEditor;
					//add a category to configuration
					that.configurationEditor.setCategory({
						labelKey : "localTextReference1"
					});
					//save configuration
					that.configurationEditor.save(function(id, metadata, messageObject) {
						that.configurationHandler.loadConfiguration(id, function(configEditor) {
							//action 1 change name of config				
							that.configurationHandler.setConfiguration({
								AnalyticalConfigurationName : 'NewConfigName'
							}, id);
							//action 2: save analytical configuration
							configEditor.save(function(id, metadata, messageObject) {			
								that.configurationHandler.loadConfiguration(id, function(configEditor) {
									//action 3: change analytical config name again		
									that.configurationHandler.setConfiguration({
										AnalyticalConfigurationName : 'NewConfigNameChanged'
									}, id);
									that.configurationHandler.resetConfiguration(id);
									var config = configurationHandler.getList()[0];
									var configName = config.AnalyticalConfigurationName;
									assert.equal(configName, 'NewConfigName', "THEN changed and saved configuration name");
									done();
								});
							});
						});	
					});
				});
			});
		});
	});
	QUnit.module("M3: Configuration Modeler with test helper: Create and save configuration and reload with new configuration editor", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			this.modelerServicePath = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
			this.wcaServicePath = "/sap/hba/apps/wca/dso/s/odata/wca.xsodata";
			sap.apf.testhelper.modelerHelper.createConfigurationEditorWithSave(isMockServerActive, that, that.appA, callbackForSetup, callbackAfterSave);
			function callbackForSetup() {
				var deferred = jQuery.Deferred();
				that.configurationEditor.setApplicationTitle("testAppTitleKey");
				that.configurationEditor.setFilterOption({facetFilter : true});
				that.setupFacetFilter();
				that.setupTextsAndCategories().done(function(){
					that.setupSteps().done(function(){
						that.setupNavigationTarget();
						deferred.resolve();
					});	
				});
				return deferred.promise();
			}
			function callbackAfterSave() {
				that.configurationHandler.loadConfiguration(that.configurationIdCreatedByTest, function(configEditor) {
					that.editor = configEditor;
					done();
				});
			}
		},
		afterEach : function(assert) {
			if (isMockServerActive) {
				sap.apf.core.constants.developmentLanguage = '';
				sap.apf.testhelper.mockServer.deactivate();
			} else {
				sap.apf.testhelper.modelerHelper.removeApplication(this, assert);
			}
		},
		setupTextsAndCategories : function() {
			var deferred = jQuery.Deferred();
			var textPool = this.configurationHandler.getTextPool();
			textPool.setTextAsPromise("Do not do it", {
				TextElementType : "YMESG",
				MaximumLength : 21,
				TranslationHint : "Just Do it"
			}).done(function(textKey){
				this.categoryId = this.configurationEditor.setCategory({
					labelKey : textKey
				});
				deferred.resolve();
			}.bind(this));
			return deferred.promise();
		},
		setupSteps : function() {
			var deferred = jQuery.Deferred();
			var textPool = this.configurationHandler.getTextPool();
			textPool.setTextAsPromise("Step title 1", {
				TextElementType : "YMESG",
				MaximumLength : 42,
				TranslationHint : "This is a step title 1"
			}).done(function(textStepTitle1){
				this.rememberedStepTitle = textStepTitle1;
				textPool.setTextAsPromise("Step long title 1", {
					TextElementType : "YMESG",
					MaximumLength : 42,
					TranslationHint : "This is a step long title 1"
				}).done(function(textStepLongTitle1){
					textPool.setTextAsPromise("Step title 2", {
						TextElementType : "YMESG",
						MaximumLength : 42,
						TranslationHint : "This is a step title 2"
					}).done(function(textStepTitle2){
						textPool.setTextAsPromise("Step long title 2", {
							TextElementType : "YMESG",
							MaximumLength : 42,
							TranslationHint : "This is a step long title 2"
						}).done(function(textStepLongTitle2){
							var step, representationOne, representationTwo;
							this.firstStepId = this.configurationEditor.createStep(this.categoryId);
							step = this.configurationEditor.getStep(this.firstStepId);
							step.setService(this.wcaServicePath);
							step.setTitleId(textStepTitle1);
							step.setLongTitleId(textStepLongTitle1);
							representationOne = step.createRepresentation();
							representationOne.setRepresentationType('RepresentationTypeOneFirstStep');
							this.secondStepId = this.configurationEditor.createStep(this.categoryId);
							step = this.configurationEditor.getStep(this.secondStepId);
							step.setService(this.wcaServicePath);
							step.setTitleId(textStepTitle2);
							step.setLongTitleId(textStepLongTitle2);
							representationOne = step.createRepresentation();
							representationOne.setRepresentationType('RepresentationTypeOneSecondStep');
							representationTwo = step.createRepresentation();
							representationTwo.setRepresentationType('RepresentationTypeTwoSecondStep');
							deferred.resolve();
						}.bind(this));

					}.bind(this));

				}.bind(this));

			}.bind(this));
			return deferred.promise();
		},
		setupSmartFilterBar : function() {
			this.configurationEditor.setFilterOption({smartFilterBar : true});
			var smartFilterBar = this.configurationEditor.getSmartFilterBar();
			smartFilterBar.setService("/test/service");
			smartFilterBar.setEntitySet("entitySet");
		},
		setupFacetFilter : function() {
			this.facetFilterId = this.configurationEditor.createFacetFilter();
			var facetFilter = this.configurationEditor.getFacetFilter(this.facetFilterId);
			facetFilter.setServiceOfValueHelp(this.wcaServicePath);
			facetFilter.setServiceOfFilterResolution(this.wcaServicePath);
			facetFilter.setEntitySetOfValueHelp("entitySetForValueHelp");
			facetFilter.setEntitySetOfFilterResolution("entitySetForFilterResolution");
			facetFilter.addSelectPropertyOfValueHelp("selectPropertyForValueHelp1");
			facetFilter.addSelectPropertyOfValueHelp("selectPropertyForValueHelp2");
			facetFilter.addSelectPropertyOfFilterResolution("selectPropertyForFilterResolution3");
			facetFilter.addSelectPropertyOfFilterResolution("selectPropertyForFilterResolution4");
			facetFilter.setPreselectionFunction("preselectionFunction");
			facetFilter.setPreselectionDefaults([ "preselectionDefault1", "preselectionDefault2" ]);
			facetFilter.setLabelKey("labelKey");
			facetFilter.setProperty("property");
			facetFilter.setAlias("alias");
			facetFilter.setMultiSelection(true);
		},
		setupNavigationTarget : function() {
			var navigationTarget, step;
			this.navigationTargetId = this.configurationEditor.createNavigationTarget();
			navigationTarget = this.configurationEditor.getNavigationTarget(this.navigationTargetId);
			navigationTarget.setSemanticObject("SemanticObject170630");
			navigationTarget.setAction("Action170768");
			navigationTarget.setGlobal();
			this.navigationTargetIdTwo = this.configurationEditor.createNavigationTarget();
			navigationTarget = this.configurationEditor.getNavigationTarget(this.navigationTargetIdTwo);
			navigationTarget.setSemanticObject("SemanticObject170630Two");
			navigationTarget.setAction("Action170768Two");
			navigationTarget.setStepSpecific();
			step = this.configurationEditor.getStep(this.secondStepId);
			step.addNavigationTarget(this.navigationTargetIdTwo);
		},
		appA : {
			ApplicationName : "apf1972-appA",
			SemanticObject : "semObjA"
		}
	});
	QUnit.test("Get saved application title key", function(assert) {
		var done = assert.async();

		assert.equal(this.editor.getApplicationTitle(), "testAppTitleKey", "Saved application title key retrieved");
		assert.equal(this.editor.isSaved(), true, 'Loaded config has status saved');
		this.editor.setApplicationTitle('ChangedAfterLoad');
		assert.equal(this.editor.isSaved(), false, 'Title change leads to dirty editor');
		assert.equal(this.editor.getConfigurationName(), "test config A", 'Configuration name managed by configuration handler temporarily stored as configuration name inside editor');
		this.configurationHandler.setConfiguration({
			AnalyticalConfigurationName : 'test config A CHANGED'
		}, this.configurationIdCreatedByTest);
		this.editor.save(function() {
			assert.equal(this.editor.getConfigurationName(), "test config A CHANGED", 'Configuration name managed by configuration handler updated in temporary configuration editor storage');
			done();
		}.bind(this));
	});
	QUnit.test("T1: Open saved configuration with category and texts", function(assert) {
		var done = assert.async();
		assert.ok(this.editor.isSaved(), "Configuration editor content is saved after load from server");
		done();
	});
	QUnit.test("T2: Register service and get all services", function(assert) {
		assert.expect(3);
		var done = assert.async();
		this.configurationEditor.registerServiceAsPromise(this.wcaServicePath).done(function(result){
			assert.ok(result, "WCA service registered");
			this.configurationEditor.registerServiceAsPromise(this.modelerServicePath).done(function(result){
				assert.ok(result, "Modeler service registered");
				assert.deepEqual(this.configurationEditor.getAllServices(), [ this.wcaServicePath, this.modelerServicePath ], "Registered services returned");
				done();
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Register invalid service returns false", function(assert) {
		var done = assert.async();
		this.configurationEditor.registerServiceAsPromise("/sap/hba/apps/wca/dso/s/odata/invalidService.xsodata").done(function(result){
			assert.ok(!result, "Service not registered");
			done();
		});
	});
	QUnit.test("Register dso service, select entity set WCADSORevenueQuery and receive all properties", function(assert) {
		assert.expect(1);
		var done = assert.async();
		var entitySet = 'WCADSORevenueQuery';

		var expectedProperties = [ "GenID", "SAPClient", "CompanyCode", "CompanyCodeName", "CompanyCodeCountry", "CompanyCodeCountryName", "CompanyCodeCountryISOCode", "CompanyCodeCurrency", "SalesOrganization", "SalesOrganizationName",
		                           "DistributionChannel", "DistributionChannelName", "Division", "DivisionName", "SalesDistrict", "SalesDistrictName", "CustomerGroup", "CustomerGroupName", "Year", "Month", "YearMonth", "Customer", "CustomerName", "CustomerCountry",
		                           "CustomerCountryName", "CustomerCountryISOCode", "AcctsReceivableItemAgeInDays", "UpperBoundaryAgingGridDays", "LowerBoundaryAgingGridDays", "AgingGridText", "AgingGridMeasureInDays", "NetDueDays", "UpperBoundaryNetDueGridDays",
		                           "LowerBoundaryNetDueGridDays", "NetDueGridText", "NetDueGridMeasureInDays", "NetDueArrearsDays", "UprBndryNetDueArrearsGridDays", "LowrBndryNetDueArrearsGridDays", "NetDueArrearsGridText", "NetDueArrearsGridMsrInDays",
		                           "DisplayCurrency", "DisplayCurrencyShortName", "DisplayCurrencyDecimals", "ExchangeRateType", "AmountInDisplayCurrency_E.CURRENCY", "ClrgDaysWgtdAmtInDisplayCrcy_E.CURRENCY", "RevenueAmountInDisplayCrcy_E.CURRENCY",
		                           "NetDueDaysWgtdAmtInDisplCrcy_E.CURRENCY", "RevenueAmountInDisplayCrcy_E", "DaysSalesOutstanding", "BestPossibleDaysSalesOutstndng", "ArrearsDaysSalesOutstanding" ];

		this.configurationEditor.registerServiceAsPromise(this.wcaServicePath).done(function(){
			this.configurationEditor.getAllPropertiesOfEntitySetAsPromise(this.wcaServicePath, entitySet).done(function(result){
				assert.deepEqual(result, expectedProperties, "Entity set: " + entitySet + " of service " + this.wcaServicePath + " returns correct properties");
				done();
			});
		}.bind(this));
	});
	QUnit.test("T3: Get all entity sets of service and get all properties of entity set", function(assert) {
		assert.expect(2);
		var done = assert.async();
		var expectedEntitySets = [ "WCAClearedReceivableQuery", "WCADaysSalesOutstandingQuery", "WCADSORevenueQuery", "WCAIndirectDSOQuery", "WCAIndirectDSOHistoryQuery", "WCAReceivableHistoryQuery", "WCARevenueQuery", "WCAOpenReceivableQuery",
		                           "WCAReceivableQuery", "CompanyCodeQueryResults", "CurrencyQueryResults", "YearMonthQueryResults", "ExchangeRateQueryResults", "SAPClientQueryResults" ];
		var expectedProperties = [ "GenID", "Year", "Month", "IsLeapYear", "YearMonth", "MonthName", "Quarter", "HalfYear", "NumberOfDays", "StartDate", "EndDate", "StartDate_E", "EndDate_E" ];
		var serviceRoot = this.wcaServicePath;
		this.configurationEditor.registerServiceAsPromise(serviceRoot).done(function(){
			this.configurationEditor.getAllEntitySetsOfServiceAsPromise(serviceRoot).done(function(entitySets){
				assert.deepEqual(entitySets, expectedEntitySets, "Entity sets of service: " + serviceRoot + " retrieved");
				this.configurationEditor.getAllPropertiesOfEntitySetAsPromise(serviceRoot, "YearMonthQueryResults").done(function(entitySetProperties){
					assert.deepEqual(entitySetProperties, expectedProperties, "Properties of entity set YearMonthQueryResults retrieved");
					done();
				});
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("T4: Get all known properties of registered services", function(assert) {
		assert.expect(2);
		var done = assert.async();
		var serviceRoot1 = this.wcaServicePath;
		var serviceRoot2 = this.modelerServicePath;
		this.configurationEditor.registerServiceAsPromise(serviceRoot1);
		this.configurationEditor.registerServiceAsPromise(serviceRoot2);
		this.configurationEditor.getAllKnownPropertiesAsPromise().done(function(allKnownProperties){
			assert.ok(allKnownProperties.length > 100, "More then 100 known properties expected");
			assert.equal(allKnownProperties[0], "AmountInDisplayCurrency_E.CURRENCY", "First property " + allKnownProperties[0] + " is equal AmountInDisplayCurrency_E.CURRENCY");
			done();
		});
	});	
	QUnit.test("T5: Open saved configuration with category and texts", function(assert) {
		var done = assert.async();
		var textPool = this.configurationHandler.getTextPool();
		var textItem = textPool.get(this.editor.getCategory(this.categoryId).labelKey);
		var textElementDescription = textItem.TextElementDescription;
		assert.equal(textElementDescription, "Do not do it", "Get after set delivers the same value");
		if (!isMockServerActive) {
			assert.equal(textItem.TextElement.length, 32, "Text Guid expected");
		} else {
			assert.equal(textItem.TextElement.length > 1, true, "Text Guid in MockServer format expected");
		}
		done();
	});
	QUnit.test("T6: Open saved configuration with steps and representations", function(assert) {
		var done = assert.async();
		var step = this.editor.getStep(this.firstStepId);
		assert.equal(step.getService(), this.wcaServicePath, "Correct Service of the reloaded first step");
		var representations = step.getRepresentations();
		assert.equal(representations.length, 1, "Right number of representations for step 1");
		representations.forEach(function(representation, index) {
			switch (index) {
			case 0:
				assert.equal(representation.getRepresentationType(), 'RepresentationTypeOneFirstStep', "Right representation type returned  for first representation");
				break;
			}
		});
		step = this.editor.getStep(this.secondStepId);
		assert.equal(step.getService(), this.wcaServicePath, "Correct Service of the reloaded second step");
		representations = step.getRepresentations();
		assert.equal(representations.length, 2, "Right number of representations for step 2");
		representations.forEach(function(representation, index) {
			switch (index) {
			case 0:
				assert.equal(representation.getRepresentationType(), 'RepresentationTypeOneSecondStep', "Right representation type returned for first representation");
				break;
			case 1:
				assert.equal(representation.getRepresentationType(), 'RepresentationTypeTwoSecondStep', "Right representation type returned for second representation");
				break;
			}
		});
		done();
	});
	QUnit.test("Open saved configuration with filter option 'none'", function(assert) {
		assert.expect(1);
		if (isMockServerActive) {
			sap.apf.core.constants.developmentLanguage = '';
			sap.apf.testhelper.mockServer.deactivate();
		} else {
			sap.apf.testhelper.modelerHelper.removeApplication(this, assert);
		}

		var done = assert.async();
		var that = this;
		sap.apf.testhelper.modelerHelper.createConfigurationEditorWithSave(isMockServerActive, this, this.appA, callbackForSetup, callbackAfterSave);
		function callbackForSetup() {
			that.configurationEditor.setApplicationTitle("testAppTitleKey");
			that.configurationEditor.setFilterOption({none : true});
		}
		function callbackAfterSave() {
			that.configurationHandler.loadConfiguration(that.configurationIdCreatedByTest, function(configEditor) {
				assert.deepEqual(configEditor.getFilterOption(), {none : true}, "Correct filter option retrieved");
				done();
			});
		}
	});
	QUnit.test("Open saved configuration with filter option 'facetFilter' and no configured facet filter", function(assert) {
		assert.expect(1);
		if (isMockServerActive) {
			sap.apf.core.constants.developmentLanguage = '';
			sap.apf.testhelper.mockServer.deactivate();
		} else {
			sap.apf.testhelper.modelerHelper.removeApplication(this, assert);
		}

		var done = assert.async();
		var that = this;
		sap.apf.testhelper.modelerHelper.createConfigurationEditorWithSave(isMockServerActive, this, this.appA, callbackForSetup, callbackAfterSave);
		function callbackForSetup() {
			that.configurationEditor.setApplicationTitle("testAppTitleKey");
			that.configurationEditor.setFilterOption({facetFilter : true});
		}
		function callbackAfterSave() {
			that.configurationHandler.loadConfiguration(that.configurationIdCreatedByTest, function(configEditor) {
				assert.deepEqual(configEditor.getFilterOption(), {facetFilter : true}, "Correct filter option retrieved");
				done();
			});
		}
	});
	QUnit.test("Open saved configuration with smartFilterBar", function(assert) {
		assert.expect(3);
		if (isMockServerActive) {
			sap.apf.core.constants.developmentLanguage = '';
			sap.apf.testhelper.mockServer.deactivate();
		} else {
			sap.apf.testhelper.modelerHelper.removeApplication(this, assert);
		}

		var done = assert.async();
		var that = this;
		sap.apf.testhelper.modelerHelper.createConfigurationEditorWithSave(isMockServerActive, this, this.appA, callbackForSetup, callbackAfterSave);
		function callbackForSetup() {
			that.configurationEditor.setApplicationTitle("testAppTitleKey");
			that.setupSmartFilterBar();
		}
		function callbackAfterSave() {
			that.configurationHandler.loadConfiguration(that.configurationIdCreatedByTest, function(configEditor) {
				var smartFilterBar = configEditor.getSmartFilterBar();
				assert.equal(smartFilterBar.getService(), "/test/service", "SmartFilterBar service retrieved");
				assert.equal(smartFilterBar.getEntitySet(), "entitySet", "SmartFilterBar entity set retrieved");
				assert.deepEqual(configEditor.getFilterOption(), {smartFilterBar : true}, "Correct filter option retrieved");
				done();
			});
		}
	});
	QUnit.test("T7: Open saved configuration with facetfilter", function(assert) {
		var done = assert.async();
		var facetFilter = this.editor.getFacetFilter(this.facetFilterId);
		assert.equal(facetFilter.getId(), this.facetFilterId, "Correct id");
		assert.equal(facetFilter.getAlias(), "alias", "Correct alias");
		assert.equal(facetFilter.getProperty(), "property", "Correct property");
		assert.equal(facetFilter.isMultiSelection(), true, "Correct multiSelection");
		assert.equal(facetFilter.getPreselectionFunction(), undefined, "Correct preselectionFunction");
		assert.equal(facetFilter.getAutomaticSelection(), false, "Correct automatic selection setting");
		assert.deepEqual(facetFilter.getPreselectionDefaults(), [ "preselectionDefault1", "preselectionDefault2" ], "Correct preselectionDefaults");
		assert.equal(facetFilter.getLabelKey(), "labelKey", "Correct labelKey");
		// requests
		assert.equal(facetFilter.getServiceOfValueHelp(), this.wcaServicePath, "Correct serviceForValueHelp");
		assert.equal(facetFilter.getEntitySetOfValueHelp(), "entitySetForValueHelp", "Correct entitySetForValueHelp");
		assert.deepEqual(facetFilter.getSelectPropertiesOfValueHelp(), [ "selectPropertyForValueHelp1", "selectPropertyForValueHelp2" ], "Correct selectProperties for ValueHelp");
		assert.equal(facetFilter.getServiceOfFilterResolution(), this.wcaServicePath, "Correct serviceForFilterResolution");
		assert.equal(facetFilter.getEntitySetOfFilterResolution(), "entitySetForFilterResolution", "Correct entitySetForFilterResolution");
		assert.deepEqual(facetFilter.getSelectPropertiesOfFilterResolution(), [ "selectPropertyForFilterResolution3", "selectPropertyForFilterResolution4" ], "Correct selectProperties for FilterResolution");

		assert.deepEqual(this.editor.getFilterOption(), {facetFilter : true}, "Correct filter option retrieved");
		done();
	});
	QUnit.test("T8: Open saved configuration with navigationTarget", function(assert) {
		var done = assert.async();
		var navigationTarget, step;
		navigationTarget = this.editor.getNavigationTarget(this.navigationTargetId);
		step = this.editor.getStep(this.secondStepId);
		assert.equal(navigationTarget.getId(), this.navigationTargetId, "Correct id");
		assert.equal(navigationTarget.getSemanticObject(), "SemanticObject170630", "Correct semantic object");
		assert.equal(navigationTarget.getAction(), "Action170768", "Correct action");
		assert.ok(navigationTarget.isGlobal(), 'Global navigation target expected');
		assert.equal(step.getNavigationTargets()[0], this.navigationTargetIdTwo, "Correct navigation target ID assigned to 2nd step");
		done();
	});
	QUnit.test("T9: Open saved configuration in runtime and test, whether the steps and texts are available", function(assert) {
		var done = assert.async();
		var that = this;
		assert.expect(5);
		var configId = this.configurationIdCreatedByTest;
		var componentDouble = {
				getComponentData : function() {
					return {
						startupParameters : {
							'sap-apf-configuration-id' : [ configId ]
						}
					};
				}
		};
		var oStartParameter = new sap.apf.utils.StartParameter(componentDouble);
		var oMessageHandler = new sap.apf.core.MessageHandler();
		var corePromise = jQuery.Deferred();
		var oCoreApi = new sap.apf.core.Instance({
			instances: {
				messageHandler : oMessageHandler,
				startParameter : oStartParameter
			},
			functions: {
				getComponentName : function() { return "comp1"; }
			},
			corePromise : corePromise
		});
		var sUrl = sap.apf.testhelper.determineTestResourcePath() + "/modeler/integration/applicationConfig.json";
		oCoreApi.loadApplicationConfig(sUrl);

		//Promise is required to make sure to access the texts only after configuration is loaded
		oCoreApi.getApplicationConfigProperties().done(function(){
			var text = oCoreApi.getTextNotHtmlEncoded(that.rememberedStepTitle);
			assert.equal(text, "Step title 1", "Expected Step Title from Config");
			var stepTemplates = oCoreApi.getStepTemplates();
			assert.equal(stepTemplates.length, 2, "Two steps have been defined");
			assert.equal(stepTemplates[0].id, this.firstStepId, "Step template 1 available in configuration");
			assert.equal(stepTemplates[0].title.key, this.rememberedStepTitle, "First step has proper step title");
			assert.equal(stepTemplates[1].id, this.secondStepId, "Step template 2 available in configuration");
			done();
		}.bind(this));
	});
	QUnit.test("T10: GIVEN ConfigurationHandler used for reset", function(assert) {
		assert.expect(6);
		var done = assert.async();
		var that = this;
		function callbackAfterGetConfigHandler(configurationHandler, messageObject) {
			assert.ok(!messageObject, "WHEN loadConfigurationHandler after reset THEN no error messages");
			assert.equal(that.configurationHandler.getList().length, 1, "WHEN loadConfigurationHandler after reset THEN configuration handler has 1 configuration");
			assert.equal(configurationHandler.getApplicationId(), that.applicationCreatedForTest, "WHEN loadConfigurationHandler after reset THEN configuration handler belongs to the right application");
			done();
		}
		assert.equal(this.configurationHandler.getApplicationId(), this.applicationCreatedForTest, "Application Handler belongs to this.applicationCreatedForTest");
		assert.equal(this.configurationHandler.getList().length, 1, "Has one configuration");
		this.configurationHandler.setConfiguration({
			AnalyticalConfigurationName : "test config A"
		});
		assert.equal(this.configurationHandler.getList().length, 2, "One configuration was added but not saved");
		this.modelerCore.resetConfigurationHandler();
		this.modelerCore.getConfigurationHandler(this.applicationCreatedForTest, callbackAfterGetConfigHandler);
	});
	QUnit.test("T11: Change configuration name, save and reset ConfigurationHandler ", function(assert) {
		assert.expect(3);
		var done = assert.async();
		var that = this;
		function callbackAfterGetConfigHandler(configurationHandler, messageObject) {
			assert.ok(!messageObject, "WHEN loadConfigurationHandler after reset THEN no error messages");
			assert.equal(configurationHandler.getList().length, 1, "WHEN loadConfigurationHandler after reset THEN configuration handler has 1 configuration");
			assert.equal(configurationHandler.getList()[0].AnalyticalConfigurationName, "Changed Configuration Name", "Configuration name reset to saved configuration name");
			done();
		}
		this.configurationHandler.setConfiguration({
			AnalyticalConfigurationName : "Changed Configuration Name"
		}, that.configurationIdCreatedByTest);

		this.configurationHandler.loadConfiguration(that.configurationIdCreatedByTest, function(configurationEditor){
			configurationEditor.save(function(){
				that.configurationHandler.setConfiguration({
					AnalyticalConfigurationName : "Changed Configuration Name again"
				}, that.configurationIdCreatedByTest);
				that.modelerCore.resetConfigurationHandler();
				that.modelerCore.getConfigurationHandler(that.applicationCreatedForTest, callbackAfterGetConfigHandler);
			});
		});
	});
	QUnit.test("T12: Create configuration, change name, save and reset ConfigurationHandler ", function(assert) {
		assert.expect(2);
		var done = assert.async();
		var that = this;
		var tempConfigId;
		var configId;
		function callbackAfterGetConfigHandler(configurationHandler, messageObject) {
			assert.ok(!messageObject, "WHEN loadConfigurationHandler after reset THEN no error messages");
			assert.equal(configurationHandler.getConfiguration(configId).AnalyticalConfigurationName, "Configuration Name", "Configuration name reset to saved configuration name");
			done();
		}
		tempConfigId = this.configurationHandler.setConfiguration({
			AnalyticalConfigurationName : "Configuration Name"
		});

		this.configurationHandler.loadConfiguration(tempConfigId, function(configurationEditor){
			configurationEditor.save(function(configurationId){
				configId = configurationId;
				that.configurationHandler.setConfiguration({
					AnalyticalConfigurationName : "Changed Configuration Name"
				}, configId);
				that.modelerCore.resetConfigurationHandler();
				that.modelerCore.getConfigurationHandler(that.applicationCreatedForTest, callbackAfterGetConfigHandler);
			});
		});
	});

	QUnit.module("M4: Configuration Modeler with test helper: Create and save configuration, export configuration and texts to file", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			this.modelerServicePath = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
			this.wcaServicePath = "/sap/hba/apps/wca/dso/s/odata/wca.xsodata";
			this.messageHandler = new sap.apf.core.MessageHandler();
			this.coreApi = new sap.apf.core.Instance({
				instances: {
					messageHandler : this.messageHandler,
					startParameter : new sap.apf.utils.StartParameter()
				}
			});
			this.configFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.messageHandler,
					coreApi : this.coreApi
				}
			});
			sap.apf.testhelper.modelerHelper.createConfigurationEditorWithSave(isMockServerActive, that, that.appA, callbackForSetup, callbackAfterSave);
			if (isMockServerActive) {
				this.isValidGuid = sap.apf.utils.isValidGuid;
				sap.apf.utils.isValidGuid = function(guid) {
					return true;
				};
			}
			function callbackForSetup() {
				var deferred = jQuery.Deferred();
				that.setupFacetFilter();
				that.setupTextsAndCategories().done(function(){
					that.setupSteps().done(function(){
						that.setupNavigationTarget();
						deferred.resolve();
					});
				});

				return deferred.promise();
			}
			function callbackAfterSave() {
				that.configurationHandler.exportConfiguration(that.configurationIdCreatedByTest, function(configurationString) {
					that.parsedConfigString = JSON.parse(configurationString);
					that.exportedTexts = that.configurationHandler.exportTexts(that.configurationIdCreatedByTest);
					done();
				});
			}
		},
		afterEach : function(assert) {
			if (isMockServerActive) {
				sap.apf.core.constants.developmentLanguage = '';
				sap.apf.testhelper.mockServer.deactivate();
				sap.apf.utils.isValidGuid = this.isValidGuid;
			} else {
				sap.apf.testhelper.modelerHelper.removeApplication(this, assert);
			}
		},
		setupTextsAndCategories : function() {
			var textPool = this.configurationHandler.getTextPool();
			var deferred = jQuery.Deferred();
			textPool.setTextAsPromise("Do not do it", {
				TextElementType : "YMESG",
				MaximumLength : 21,
				TranslationHint : "Just Do it"
			}).done(function(textKey){
				this.categoryId = this.configurationEditor.setCategory({
					labelKey : textKey
				});
				deferred.resolve();
			}.bind(this));
			return deferred.promise();
		},
		setupSteps : function() {
			var deferred = jQuery.Deferred();
			var textPool = this.configurationHandler.getTextPool();
			var textStepTitle1 = textPool.setTextAsPromise("Step title 1", {
				TextElementType : "YMESG",
				MaximumLength : 42,
				TranslationHint : "This is a step title 1"
			});
			this.rememberedStepTitle = textStepTitle1;
			var textStepLongTitle1 = textPool.setTextAsPromise("Step long title 1", {
				TextElementType : "YMESG",
				MaximumLength : 42,
				TranslationHint : "This is a step long title 1"
			});
			var textStepTitle2 = textPool.setTextAsPromise("Step title 2", {
				TextElementType : "YMESG",
				MaximumLength : 42,
				TranslationHint : "This is a step title 2"
			});
			var textStepLongTitle2 = textPool.setTextAsPromise("Step long title 2", {
				TextElementType : "YMESG",
				MaximumLength : 42,
				TranslationHint : "This is a step long title 2"
			});
			var step, representationOne, representationTwo;
			this.firstStepId = this.configurationEditor.createStep(this.categoryId);
			step = this.configurationEditor.getStep(this.firstStepId);
			step.setService(this.wcaServicePath);
			step.setTitleId(textStepTitle1);
			step.setLongTitleId(textStepLongTitle1);
			representationOne = step.createRepresentation();
			representationOne.setRepresentationType('RepresentationTypeOneFirstStep');
			this.secondStepId = this.configurationEditor.createStep(this.categoryId);
			step = this.configurationEditor.getStep(this.secondStepId);
			step.setService(this.wcaServicePath);
			step.setTitleId(textStepTitle2);
			step.setLongTitleId(textStepLongTitle2);
			step.setFilterMappingService("filterMappingService");
			step.setFilterMappingEntitySet("filterMappingEntitySet");
			step.addFilterMappingTargetProperty("filterMappingTargetProperty1");
			step.addFilterMappingTargetProperty("filterMappingTargetProperty2");
			representationOne = step.createRepresentation();
			representationOne.setRepresentationType('RepresentationTypeOneSecondStep');
			representationTwo = step.createRepresentation();
			representationTwo.setRepresentationType('RepresentationTypeTwoSecondStep');
			deferred.resolve();
			return deferred.promise();
		},
		setupFacetFilter : function() {
			this.configurationEditor.setFilterOption({facetFilter : true});
			var textPool = this.configurationHandler.getTextPool();

			this.facetFilterId = this.configurationEditor.createFacetFilter();
			var facetFilter = this.configurationEditor.getFacetFilter(this.facetFilterId);
			facetFilter.setServiceOfValueHelp(this.wcaServicePath);
			facetFilter.setServiceOfFilterResolution(this.wcaServicePath);
			facetFilter.setEntitySetOfValueHelp("entitySetForValueHelp");
			facetFilter.setEntitySetOfFilterResolution("entitySetForFilterResolution");
			facetFilter.addSelectPropertyOfValueHelp("selectPropertyForValueHelp1");
			facetFilter.addSelectPropertyOfValueHelp("selectPropertyForValueHelp2");
			facetFilter.addSelectPropertyOfFilterResolution("selectPropertyForFilterResolution3");
			facetFilter.addSelectPropertyOfFilterResolution("selectPropertyForFilterResolution4");
			facetFilter.setPreselectionFunction("preselectionFunction");
			facetFilter.setPreselectionDefaults([ "preselectionDefault1", "preselectionDefault2" ]);
			textPool.setTextAsPromise("Facet filter label", {
				TextElementType : "YMESG",
				MaximumLength : 42,
				TranslationHint : "This is a facet filter label"
			}).done(function(labelKey){
				facetFilter.setLabelKey(labelKey);
				facetFilter.setProperty("property");
				facetFilter.setAlias("alias");
				facetFilter.setMultiSelection(true);
			});

		},
		setupNavigationTarget : function() {
			this.navigationTargetId = this.configurationEditor.createNavigationTarget();
			var navigationTarget = this.configurationEditor.getNavigationTarget(this.navigationTargetId);
			navigationTarget.setSemanticObject("SemanticObject170630");
			navigationTarget.setAction("Action170768");
		},
		appA : {
			ApplicationName : "apf1972-appA",
			SemanticObject : "semObjA"
		}
	});
	QUnit.test("T1: Export saved configuration and texts to file", function(assert) {
		var configuration = this.parsedConfigString;
		var done = assert.async();
		//Configuration serialized and ...
		assert.ok(configuration.bindings.length > 0, "Has bindings");
		assert.ok(configuration.categories.length > 0, "Has categories");
		assert.ok(configuration.steps.length > 0, "Has steps");
		assert.ok(configuration.requests.length > 0, "Has requests");
		assert.ok(configuration.facetFilters.length > 0, "Has facet filters");
		assert.ok(configuration.navigationTargets.length > 0, "Has navigation targets");
		assert.ok(configuration.representationTypes, "Has representation types");
		//configuration header added.
		assert.equal(configuration.configHeader.AnalyticalConfiguration, this.configurationIdCreatedByTest, "Right configuration ID");
		assert.equal(configuration.configHeader.AnalyticalConfigurationName, "test config A", "Right configuration name");
		assert.equal(configuration.configHeader.Application, this.applicationCreatedForTest, "Right application");
		assert.equal(configuration.configHeader.ApplicationName, this.appA.ApplicationName, "Right application");
		if (isMockServerActive) {
			assert.equal(configuration.configHeader.CreationUTCDateTime, null, "Right creation date");
			assert.equal(configuration.configHeader.LastChangeUTCDateTime, null, "Right change date");
		}
		assert.equal(configuration.configHeader.SemanticObject, this.appA.SemanticObject, "Right semantic object");
		assert.equal(configuration.configHeader.UI5Version, sap.ui.version, "Right UI5 version");
		var texts = this.exportedTexts;
		var expectedTextDescriptions = [ "Step long title 1", "Step long title 2", "Step title 1", "Step long title 2", "Do not do it" ];
		var bFound;
		for(var i = 0; i < 5; i++) {
			bFound = texts.search(expectedTextDescriptions[i]) > -1;
			assert.equal(bFound, true, "Text found in exported text file " + expectedTextDescriptions[i]);
		}
		done();
	});
	QUnit.test("T2: Export saved configuration to file and import to configuration factory", function(assert) {
		this.configFactory.loadConfig(this.parsedConfigString, true);
		assert.ok(true, "Load into ConfigurationFactory succeeded");
		assert.ok(this.configFactory.getStepTemplates().length > 0, "Step templates loaded");
		assert.ok(this.configFactory.getServiceDocuments().length > 0, "Service documents loaded");
		assert.ok(this.configFactory.getCategories().length > 0, "Categories loaded");
		assert.ok(this.configFactory.getFacetFilterConfigurations().length > 0, "Facet filter configurations loaded");
		assert.ok(this.configFactory.getNavigationTargets().length > 0, "Navigation target configurations loaded");
		var firstStepConfig = this.configFactory.getConfigurationById(this.firstStepId);
		assert.ok(firstStepConfig, "Configuration for first step returned");
		var firstStepRequest = this.configFactory.getConfigurationById(firstStepConfig.request);
		assert.ok(firstStepRequest, "Request for first step returned");
		var firstStepBinding = this.configFactory.getConfigurationById(firstStepConfig.binding);
		assert.ok(firstStepBinding, "Binding for first step returned");
		assert.ok(firstStepBinding.representations[0].id, "First step has a representation");

	});
	QUnit.test("T3: Import configuration - application id and configuration id does not exist", function(assert) {
		assert.expect(2);
		var done = assert.async();
		var that = this;
		var applicationOfThisTest = sap.apf.testhelper.generateGuidForTesting(); // Needs to be a "GUID": the server will check for /[0-9A-F]{32}/
		var configurationOfThisTest = sap.apf.testhelper.generateGuidForTesting(); // Needs to be a "GUID": the server will check for /[0-9A-F]{32}/
		that.parsedConfigString.configHeader.Application = applicationOfThisTest;
		that.parsedConfigString.configHeader.AnalyticalConfiguration = configurationOfThisTest;
		that.modelerCore.importConfiguration(JSON.stringify(that.parsedConfigString), undefined, callbackImport);
		function callbackImport(configuration, metadata, messageObject) {
			that.modelerCore.getApplicationHandler(function(appHandler) {
				var applications = appHandler.getList();
				var appCreated = false;
				applications.forEach(function(app) {
					if (app.Application === applicationOfThisTest) {
						appCreated = true;
					}
				});
				assert.ok(appCreated, "New application created");
				that.modelerCore.getConfigurationHandler(applicationOfThisTest, function(configHandler) {
					configHandler.loadConfiguration(configurationOfThisTest, function(configurationEditor) {
						assert.equal(configurationEditor.getSteps().length, 2, "Imported configuration successfully loaded in configurationEditor");
						that.applicationHandler.removeApplication(applicationOfThisTest, function() {
							done();
						});
					});
				});
			});
		}
	});
	QUnit.test("T4: Import configuration - application id exists, configuration id does not exist", function(assert) {
		assert.expect(4);
		var done = assert.async();
		var that = this;
		var numberOfApplications = this.applicationHandler.getList().length;
		var application = this.parsedConfigString.configHeader.Application;
		this.configId = sap.apf.testhelper.generateGuidForTesting(); // Needs to be a "GUID": the server will check for /[0-9A-F]{32}/
		this.parsedConfigString.configHeader.AnalyticalConfiguration = this.configId;
		this.modelerCore.importConfiguration(JSON.stringify(this.parsedConfigString), undefined, callbackImport);
		function callbackImport(configuration, metadata, messageObject) {
			that.modelerCore.getApplicationHandler(function(appHandler) {
				assert.equal(appHandler.getList().length, numberOfApplications, "No new application created");
				that.modelerCore.getConfigurationHandler(application, function(configHandler) {
					configHandler.exportConfiguration(configuration, callbackExportConfiguration);
				});
			});
		}
		function callbackExportConfiguration(configurationString) {
			assert.deepEqual(JSON.parse(configurationString), that.parsedConfigString, "exportConfiguration() returns same string as used for importConfiguration()");
			that.configurationHandler.loadConfiguration(that.configId, function(configurationEditor) {
				assert.equal(configurationEditor.getSteps().length, 2, "Imported configuration successfully loaded in configurationEditor");
				assert.equal(configurationEditor.getSteps()[1].getFilterMappingEntitySet(), "filterMappingEntitySet", "Correct filter mapping entity set returned");
				done();
			});
		}
	});
	QUnit.test("T5: Import configuration - application id and configuration id exists, overwrite configuration", function(assert) {
		assert.expect(3);
		var done = assert.async();
		var that = this;
		this.parsedConfigString.configHeader.AnalyticalConfigurationName = "Updated configuration";
		this.modelerCore.importConfiguration(JSON.stringify(this.parsedConfigString), callbackConfirmOverwrite, callbackImport);
		function callbackConfirmOverwrite(callbackOverwrite, callbackCreateNew) {
			callbackOverwrite();
		}
		function callbackImport(configuration, metadata, messageObject) {
			that.configurationHandler.exportConfiguration(configuration, callbackExportConfiguration);
		}
		function callbackExportConfiguration(configurationString) {
			var configuration = JSON.parse(configurationString);
			assert.equal(configuration.configHeader.AnalyticalConfiguration, that.parsedConfigString.configHeader.AnalyticalConfiguration, "Same configuration id");
			assert.equal(that.configurationHandler.getConfiguration(configuration.configHeader.AnalyticalConfiguration).AnalyticalConfigurationName, "Updated configuration", "Configuration name updated");
			that.configurationHandler.loadConfiguration(configuration.configHeader.AnalyticalConfiguration, function(configurationEditor) {
				assert.equal(configurationEditor.getSteps().length, 2, "Imported configuration successfully loaded in configurationEditor");
				done();
			});
		}
	});
	QUnit.test("T6: Import configuration - application id and configuration id exists, create new configuration", function(assert) {
		assert.expect(2);
		var done = assert.async();
		var that = this;
		this.modelerCore.importConfiguration(JSON.stringify(this.parsedConfigString), callbackConfirmOverwrite, callbackImport);
		function callbackConfirmOverwrite(callbackOverwrite, callbackCreateNew) {
			callbackCreateNew();
		}
		function callbackImport(configuration, metadata, messageObject) {
			that.configurationHandler.exportConfiguration(configuration, callbackExportConfiguration);
		}
		function callbackExportConfiguration(configurationString) {
			var configuration = JSON.parse(configurationString);
			assert.notEqual(configuration.configHeader.AnalyticalConfiguration, that.parsedConfigString.configHeader.AnalyticalConfiguration, "New configuration id created");
			that.configurationHandler.loadConfiguration(configuration.configHeader.AnalyticalConfiguration, function(configurationEditor) {
				assert.equal(configurationEditor.getSteps().length, 2, "Imported configuration successfully loaded in configurationEditor");
				done();
			});
		}
	});
	QUnit.test("T7: GIVEN Imported configuration with old representation IDs", function(assert) {
		assert.expect(3);
		var done = assert.async();
		var that = this;
		that.parsedConfigString.bindings[0].representations[0].id = "Step-1-Representation-99";
		that.parsedConfigString.bindings[1].representations[0].id = "Step-2-Representation-100";
		that.modelerCore.importConfiguration(JSON.stringify(that.parsedConfigString), callbackConfirmOverwrite, callbackImport);
		function callbackConfirmOverwrite(callbackOverwrite, callbackCreateNew) {
			callbackCreateNew();
		}
		function callbackImport(configuration, metadata, messageObject) {
			that.configurationHandler.loadConfiguration(configuration, callbackAfterLoadConfiguration);
		}
		function callbackAfterLoadConfiguration(configEditor) {
			var firstStepRepId = configEditor.getStep(configEditor.getSteps()[0].getId()).getRepresentations()[0].getId();
			var secondStepRepId = configEditor.getStep(configEditor.getSteps()[1].getId()).getRepresentations()[0].getId();
			assert.equal(firstStepRepId, "Step-1-Representation-99", "WHEN import THEN old representation Id  is NOT replaced by a new Id created by the numbering algorithm of the modeler");
			assert.equal(secondStepRepId, "Step-2-Representation-100", "WHEN import THEN old representation Id  is NOT replaced by a new Id created by the numbering algorithm of the modeler");
			var firstStepRepIdAfterCopyFirstStep = configEditor.getStep(configEditor.copyStep(configEditor.getSteps()[0].getId())).getRepresentations()[0].getId();
			assert.equal(firstStepRepIdAfterCopyFirstStep, "Step-3-Representation-99", "WHEN copy step THEN Id of the implicitly copied representation also keeps the OLD number");
			done();
		}
	});
	QUnit.module("M5: Import texts", {
		beforeEach : function(assert) {
			sap.apf.core.constants.developmentLanguage = 'NN';
			this.applicationId = "543EC63F05550175E10000000A445B6D";
			var translationUuid = "543ec63f-0555-0175-e100-00000a445b6d";
			this.propertyFileForImport = "#FIORI: insert Fiori-Id\n" + "# __ldi.translation.uuid=" + translationUuid + "\n" + "#ApfApplicationId=" + this.applicationId + "\n\n" + "#XLAB,15:Hint\n"
			+ "343EC63F05550175E10000000A445B6D=uniqueLabelText\n" + "# LastChangeDate=2014/10/07 15:56:42\n\n" + "#XTIT,30:Hint\n" + "143EC63F05550175E10000000A445B6D=TITLE1\n" + "# LastChangeDate=2014/10/07 16:30:22\n\n"
			+ "#XTIT,30:Hint\n" + "243EC63F05550175E10000000A445B6D=TITLE2\n" + "# LastChangeDate=2014/10/07 16:30:29\n\n";
			if (isMockServerActive) {
				sap.apf.testhelper.mockServer.activateModeler();
			} else {
				var done = assert.async();
				this.authTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
					done();
				});
			}
		},
		afterEach : function() {
			if (isMockServerActive) {
				sap.apf.core.constants.developmentLanguage = '';
				sap.apf.testhelper.mockServer.deactivate();
			}
		},
		doCreateApplication : function(applicationGuid, oMessageHandler, assert) {
			var deferred = jQuery.Deferred();
			var sServiceRoot = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
			var sEntityType = 'ApplicationQueryResults';
			var sUrl = sServiceRoot + '/' + sEntityType;

			getXsrfToken().done(function(sXsrfToken){
				var oPostObject = {
						Application : applicationGuid,
						ApplicationName : "ApplicationForTestingTextImport",
						SemanticObject : "aSemanticalObject"
				};
				var oRequest = {
						requestUri : sUrl,
						method : "POST",
						headers : {
							"x-csrf-token" : sXsrfToken
						},
						data : oPostObject,
						async : false
				};
				var oInject = {
						instances: {
							datajs: OData
						},
						functions : {
							getSapSystem : function() { return undefined; }
						}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, function(oData, oResponse) {
					if (!(oData && oData.Application && oData.Application === applicationGuid)) {
						assert.ok(false, "Creation of Application failed");
					}
					deferred.resolve();
				}, function(oError) {
					assert.ok(false, "Creation of Application failed");
					deferred.resolve();
				});
			});
			return deferred.promise();

		},
		doDeleteApplication : function(applicationGuid, oMessageHandler, assert) {
			var deferred = jQuery.Deferred();
			var sServiceRoot = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
			var sEntityType = 'ApplicationQueryResults';
			var sUrl = sServiceRoot + '/' + sEntityType;
			getXsrfToken().done(function(sXsrfToken){
				var oRequest = {
						requestUri : sUrl + "('" + applicationGuid + "')",
						method : "DELETE",
						headers : {
							"x-csrf-token" : sXsrfToken
						},
						async : false
				};
				var oInject = {
						instances: {
							datajs: OData
						},
						functions : {
							getSapSystem : function() { return undefined; }
						}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, function(oData, oResponse) {
					deferred.resolve();
				}, function(oError) {
					deferred.resolve();
				});
			});
			return deferred.promise();
		}
	});
	QUnit.test("T1: Import Textfile on Modeler Instance and do second import with additional entry", function(assert) {
		assert.expect(6);
		var done = assert.async();
		var that = this;
		function localPreparations() {
			var deferred = jQuery.Deferred();
			that.doDeleteApplication(that.applicationId, that.messageHandler).done(function(){

				that.doCreateApplication(that.applicationId, that.messageHandler, assert).done(function(){
					var persistenceConfiguration = {
							serviceRoot : "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata"
					};
					var inject = {
							probe : function(oProbe) {
								that.messageHandler = oProbe.messageHandler;
							}
					};
					that.modelerInstance = new sap.apf.modeler.core.Instance(persistenceConfiguration, inject);
					deferred.resolve();
				});
			});
			return deferred.promise();
		}
		function assertSecondImportedPropertyFileIsOk(messageObject) {
			if (messageObject) {
				assert.ok(false, "Text Import did not work");
				done();
			} else {
				that.modelerInstance.getConfigurationHandler(that.applicationId, function(configHandler) {
					var textPool = configHandler.getTextPool();
					var titleTextElement = textPool.get("243EC63F05550175E10000000A445B6D");
					assert.equal(titleTextElement.TextElementDescription, "TITLE2", "Old TextDescription as expected ");
					assert.equal(titleTextElement.TextElement, "243EC63F05550175E10000000A445B6D", "Old TextElement as expected");
					titleTextElement = textPool.get("246EC63F05550175E10000000A445B6D");
					assert.equal(titleTextElement.TextElementDescription, "TITLE3", "New TextDescription as expected ");
					assert.equal(titleTextElement.TextElement, "246EC63F05550175E10000000A445B6D", "New TextElement as expected");
					done();
				});
			}
		}
		function assertImportedPropertyFileIsOk(messageObject) {
			if (messageObject) {
				assert.ok(false, "Text Import did not work");
				done();
			} else {
				that.modelerInstance.getConfigurationHandler(that.applicationId, function(configHandler) {
					var textPool = configHandler.getTextPool();
					var titleTextElement = textPool.get("243EC63F05550175E10000000A445B6D");
					assert.equal(titleTextElement.TextElementDescription, "TITLE2", "TextDescription as expected ");
					assert.equal(titleTextElement.TextElement, "243EC63F05550175E10000000A445B6D", "TextElement as expected");
					var additionalEntry = "#XTIT,30:Hint\n" + "246EC63F05550175E10000000A445B6D=TITLE3\n" + "# LastChangeDate=2014/10/07 16:31:29\n\n";
					that.modelerInstance.importTexts(that.propertyFileForImport + additionalEntry, assertSecondImportedPropertyFileIsOk);
				});
			}
		}
		localPreparations().done(function(){
			that.modelerInstance.getApplicationHandler(function(appHandler) {
				that.applicationHandler = appHandler;
				that.modelerInstance.importTexts(that.propertyFileForImport, assertImportedPropertyFileIsOk);
			});
		});
	});
	QUnit.module("M6: Integration Test for Memorize", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			this.modelerServicePath = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
			this.wcaServicePath = "/sap/hba/apps/wca/dso/s/odata/wca.xsodata";
			sap.apf.testhelper.modelerHelper.createConfigurationEditorWithSave(isMockServerActive, that, that.appA, callbackForSetup, callbackAfterSave);
			function callbackForSetup() {
				var deferred = jQuery.Deferred();
				that.setupTextsAndCategories().done(function(){
					that.setupSteps().done(function(){
						deferred.resolve();
					});
				});
				return deferred.promise();
			}
			function callbackAfterSave() {
				done();
			}
			var injectForPersistenceProxy = {
					instances : {
						messageHandler : this.messageHandler,
						coreApi : this.modelerCore
					}
			};
			var injectForConfObjects = {
					instances : {
						persistenceProxy : new sap.apf.core.OdataProxy(this.persistenceConfiguration, injectForPersistenceProxy),
						messageHandler : this.messageHandler
					},
					constructors : {
						Hashtable : sap.apf.utils.Hashtable
					}
			};
			this.configurationObjects = new sap.apf.modeler.core.ConfigurationObjects(injectForConfObjects);
		},
		afterEach : function(assert) {
			if (isMockServerActive) {
				sap.apf.core.constants.developmentLanguage = '';
				sap.apf.testhelper.mockServer.deactivate();
			} else {
				sap.apf.testhelper.modelerHelper.removeApplication(this, assert);
			}
		},
		setupTextsAndCategories : function() {
			var deferred = jQuery.Deferred();
			this.addCategory(this.configurationEditor, 1).done(function(categoryId){
				this.categoryId = categoryId;
				deferred.resolve();
			}.bind(this));
			return deferred.promise();
		},
		setupSteps : function() {
			var deferred = jQuery.Deferred();
			this.addStep(this.configurationEditor, 1, this.categoryId).done(function(stepId){
				this.firstStepId = stepId;
				this.addStep(this.configurationEditor, 2, this.categoryId).done(function(stepId){
					this.secondStepId = stepId;
					deferred.resolve();
				}.bind(this));
			}.bind(this));
			return deferred.promise();
		},
		addCategory : function(configEditor, number) {
			var deferred = jQuery.Deferred();
			var textPool;
			textPool = this.configurationHandler.getTextPool();
			textPool.setTextAsPromise("Category " + number, {
				TextElementType : "YMESG",
				MaximumLength : 21,
				TranslationHint : "Translation Hint " + number
			}).done(function(textKey){
				var categoryAdded = configEditor.setCategory({
					labelKey : textKey
				});
				deferred.resolve(categoryAdded);
			});

			return deferred.promise();
		},
		addStep : function(configEditor, number, categoryId) {
			var textPool, stepAdded, step, representation;
			var deferred = jQuery.Deferred();
			stepAdded = configEditor.createStep(categoryId);
			step = configEditor.getStep(stepAdded);
			textPool = this.configurationHandler.getTextPool();
			textPool.setTextAsPromise("Step title " + number, {
				TextElementType : "YMESG",
				MaximumLength : 42,
				TranslationHint : "This is a step title " + number
			}).done(function(textStepTitle){
				textPool.setTextAsPromise("Step long title " + number, {
					TextElementType : "YMESG",
					MaximumLength : 42,
					TranslationHint : "This is a step long title " + number
				}).done(function(textStepLongTitle){

					textPool.setTextAsPromise("Step long title " + number, {
						TextElementType : "YMESG",
						MaximumLength : 42,
						TranslationHint : "This is a step long title " + number
					}).done(function(textStepLongTitle){
						//step.setService(this.wcaServicePath);
						step.setTitleId(textStepTitle);
						step.setLongTitleId(textStepLongTitle);
						representation = step.createRepresentation();
						representation.setRepresentationType('RepresentationTypeOneStep' + number);
						deferred.resolve(stepAdded);
					});
				});
			});

			return deferred.promise();
		},
		appA : {
			ApplicationName : "apf1972-appA",
			SemanticObject : "semObjA"
		}
	});
	QUnit.test("T1: GIVEN configuration for testing memorize, restoreMemorizedConfiguration and resetConfiguration", function(assert) {
		assert.expect(17);
		var done = assert.async();
		var that = this;

		that.addCategory(this.configurationEditor, 2).done(function(categoryAdded1){
			that.addStep(this.configurationEditor, 3, categoryAdded1).done(function(){
				this.configurationHandler.getConfiguration(this.configurationIdCreatedByTest).AnalyticalConfigurationName = "Changed Configuration";
				//Memorize configuration editor
				var configIdAfterMemorize = this.configurationHandler.memorizeConfiguration(this.configurationIdCreatedByTest);
				assert.equal(configIdAfterMemorize, this.configurationIdCreatedByTest, "WHEN memorizeConfiguration THEN the configuration Id remains the same");
				assert.equal(this.configurationEditor.getCategories().length, 2, "WHEN memorizeConfiguration THEN still two categories are returned");
				assert.equal(this.configurationEditor.getSteps().length, 3, "WHEN memorizeConfiguration THEN still three steps are returned");
				// ... add Category
				that.addCategory(this.configurationEditor, 3).done(function(categoryAdded2){
					// ... add Step
					that.addStep(this.configurationEditor, 4, categoryAdded2).done(function(){
						assert.equal(this.configurationEditor.getCategories().length, 3, "WHEN one category is added to memory THEN three categories are returned");
						assert.equal(this.configurationEditor.getSteps().length, 4, "WHEN one step is added to memory THEN four steps are returned");
						//Restore memorized configuration editor
						var configEditorAfterRestore = this.configurationHandler.restoreMemorizedConfiguration(this.configurationIdCreatedByTest);
						assert.notEqual(this.configurationEditor, configEditorAfterRestore, "WHEN restoreMemorizedConfiguration THEN a new configuration editor instance is returned");
						assert.equal(configEditorAfterRestore.getCategories().length, 2, "WHEN restoreMemorizedConfiguration THEN two categories are returned from new instance");
						assert.equal(configEditorAfterRestore.getSteps().length, 3, "WHEN restoreMemorizedConfiguration THEN three steps are returned from new instance");
						assert.equal(configEditorAfterRestore.getConfigurationName(), "Changed Configuration", "Configuration name in ConfigurationEditor successfully restored");
						assert.equal(this.configurationHandler.getConfiguration(this.configurationIdCreatedByTest).AnalyticalConfigurationName, "Changed Configuration", "Configuration name in ConfigurationHandler successfully restored");
						//Load configuration
						that.configurationHandler.loadConfiguration(this.configurationIdCreatedByTest, function(configEditor) {
							assert.equal(configEditor, configEditorAfterRestore, "WHEN loadConfiguration THEN the new configuration editor instance is returned");
							//Reset configuration
							var configIdAfterReset = that.configurationHandler.resetConfiguration(that.configurationIdCreatedByTest);
							assert.equal(configIdAfterReset, that.configurationIdCreatedByTest, "WHEN resetConfiguration THEN the configuration id is returned on success");
							//Load configuration
							that.configurationHandler.loadConfiguration(that.configurationIdCreatedByTest, function(configEditor) {
								var configEditorAfterResetConf = configEditor;
								assert.notEqual(configEditorAfterRestore, configEditorAfterResetConf, "WHEN resetConfiguration THEN a new configuration editor instance is returned");
								assert.equal(configEditorAfterResetConf.getCategories().length, 1, "WHEN resetConfiguration THEN one categories are returned from new instance");
								assert.equal(configEditorAfterResetConf.getSteps().length, 2, "WHEN resetConfiguration THEN two steps are returned from new instance");
								assert.equal(configEditorAfterResetConf.getConfigurationName(), "test config A", "Configuration name in ConfigurationEditor successfully reset");
								assert.equal(that.configurationHandler.getConfiguration(that.configurationIdCreatedByTest).AnalyticalConfigurationName, "test config A", "Configuration name in ConfigurationHandler successfully reset");
								done();
							});
						});
					}.bind(this));

				}.bind(this));	
			}.bind(this));
		}.bind(this));		
	});
	QUnit.module("M7: Integration Tests for Get Unused Text Ids", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			this.modelerServicePath = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
			this.wcaServicePath = "/sap/hba/apps/wca/dso/s/odata/wca.xsodata";
			sap.apf.testhelper.modelerHelper.createConfigurationEditorWithSave(isMockServerActive, that, that.appA, callbackForSetup, callbackAfterSave);
			function callbackForSetup() {
				var deferred = jQuery.Deferred();
				that.setupTextsAndCategories().done(function(){
					that.setupSteps().done(function(){
						deferred.resolve();
					});
				});
				return deferred.promise();
			}
			function callbackAfterSave() {
				that.configurationHandler.copyConfiguration(that.configurationIdCreatedByTest, function(configIdOfCopy) {
					that.configurationHandler.loadConfiguration(configIdOfCopy, function(configurationEditor) {
						that.addCategory(configurationEditor, 2).done(function(categoryId){
							that.categoryId2 = categoryId;
							that.addStep(configurationEditor, 3, that.categoryId2).done(function(stepId){
								that.thirdStepId = stepId;
								configurationEditor.save(function(configId, metaData, messageObject) {
									that.configurationIdCreatedByCopy = configId;
									done();
								});
							});
						});		
					});
				});
			}
			var injectForPersistenceProxy = {
					instances : {
						messageHandler : this.messageHandler,
						coreApi : this.modelerCore
					}
			};
			var injectForConfObjects = {
					constructors : {
						Hashtable : sap.apf.utils.Hashtable
					},
					instances : {
						persistenceProxy : new sap.apf.core.OdataProxy(this.persistenceConfiguration, injectForPersistenceProxy),
						messageHandler : this.messageHandler
					}
			};
			this.configurationObjects = new sap.apf.modeler.core.ConfigurationObjects(injectForConfObjects);
		},
		afterEach : function(assert) {
			if (isMockServerActive) {
				sap.apf.core.constants.developmentLanguage = '';
				sap.apf.testhelper.mockServer.deactivate();
			} else {
				sap.apf.testhelper.modelerHelper.removeApplication(this, assert);
			}
		},
		setupTextsAndCategories : function() {
			var deferred = jQuery.Deferred();

			this.addCategory(this.configurationEditor, 1).done(function(categoryId){
				this.categoryId1 = categoryId;
				deferred.resolve();
			}.bind(this));
			return deferred.promise();
		},
		setupSteps : function() {
			var deferred = jQuery.Deferred();
			this.addStep(this.configurationEditor, 1, this.categoryId1).done(function(stepId){
				this.firstStepId = stepId;
				this.addStep(this.configurationEditor, 2, this.categoryId1).done(function(stepId){
					this.secondStepId = stepId;
					deferred.resolve();
				}.bind(this));
			}.bind(this));
			return deferred.promise();
		},
		addCategory : function(configEditor, number) {
			var deferred = jQuery.Deferred();
			var textPool, categoryAdded;
			textPool = this.configurationHandler.getTextPool();
			textPool.setTextAsPromise("Category " + number, {
				TextElementType : "YMESG",
				MaximumLength : 21,
				TranslationHint : "Translation Hint " + number
			}).done(function(textKey){
				categoryAdded = configEditor.setCategory({
					labelKey : textKey
				});
				deferred.resolve(categoryAdded);
			});

			return deferred.promise();
		},
		addStep : function(configEditor, number, categoryId) {
			var textPool, stepAdded, step, representation;
			var deferred = jQuery.Deferred();
			stepAdded = configEditor.createStep(categoryId);
			step = configEditor.getStep(stepAdded);
			textPool = this.configurationHandler.getTextPool();
			textPool.setTextAsPromise("Step title " + number, {
				TextElementType : "YMESG",
				MaximumLength : 42,
				TranslationHint : "This is a step title " + number
			}).done(function(textStepTitle){
				textPool.setTextAsPromise("Step long title " + number, {
					TextElementType : "YMESG",
					MaximumLength : 42,
					TranslationHint : "This is a step long title " + number
				}).done(function(textStepLongTitle ){
					//step.setService(this.wcaServicePath);
					step.setTitleId(textStepTitle);
					step.setLongTitleId(textStepLongTitle);
					representation = step.createRepresentation();
					representation.setRepresentationType('RepresentationTypeOneStep' + number);
					deferred.resolve(stepAdded);
				});	
			});

			return deferred.promise();
		},
		appA : {
			ApplicationName : "apf1972-appA",
			SemanticObject : "semObjA"
		}
	});
	QUnit.test("T1: GIVEN Two saved configurations WHEN loadAllConfigurationObjects THEN two configuration objects with the right configuration Ids are returned", function(assert) {
		assert.expect(4);
		var done = assert.async();
		var that = this;
		function callback(result, metadata, messageObject) {
			assert.equal(result.length, 2, "Two configurations returned");
			assert.notEqual(result[0].AnalyticalConfiguration, result[1].AnalyticalConfiguration, "Configurations with different Ids returned");
			result.forEach(function(item) {
				assert.ok(item.AnalyticalConfiguration === that.configurationIdCreatedByTest || item.AnalyticalConfiguration === that.configurationIdCreatedByCopy, "Right configuration Ids are returned for both configurations");
			});
			done();
		}
		this.configurationObjects.loadAllConfigurations(this.applicationCreatedForTest, callback);
	});
	QUnit.test("T2: GIVEN Two saved configurations WHEN getTextKeysFromAllConfigurations ", function(assert) {
		assert.expect(1);
		var done = assert.async();
		function callback(textKeys, messageObject) {
			assert.equal(textKeys.getKeys().length, 8, "THEN the right number of text keys is returned");
			done();
		}
		this.configurationObjects.getTextKeysFromAllConfigurations(this.applicationCreatedForTest, callback);
	});
	QUnit.test("T3: GIVEN Two saved configurations with two unused text keys WHEN getUnusedTextKeys ", function(assert) {
		assert.expect(4);
		var done = assert.async();
		var that = this;
		var textPool = this.configurationHandler.getTextPool();
		textPool.setTextAsPromise("Unused text 1", {
			TextElementType : "YMESG",
			MaximumLength : 42,
			TranslationHint : "Translation hint for unused 1 "
		}).done(function(unusedKey1){
			textPool.setTextAsPromise("Unused text 2", {
				TextElementType : "YMESG",
				MaximumLength : 42,
				TranslationHint : "Translation hint for unused 2 "
			}).done(function(unusedKey2){
				var modelerInstance = new sap.apf.modeler.core.Instance(that.persistenceConfiguration);
				modelerInstance.getApplicationHandler(function(applicationHandler, messageObject) { // application handler needs to be initialized before    
					modelerInstance.getUnusedTextKeys(that.applicationCreatedForTest, function checkResult(unusedTextKeys, messageObject) {
						assert.ok(!messageObject, "THEN no message object is returned");
						assert.equal(unusedTextKeys.length, 2, "THEN two unused text keys are returned");
						assert.notEqual(unusedTextKeys.indexOf(unusedKey1), -1, "THEN unused text key 1 is returned");
						assert.notEqual(unusedTextKeys.indexOf(unusedKey2), -1, "THEN unused text key 2 is returned");
						done();
					});
				});
			});
		});
	});
	QUnit.module("Load configuration in configuration editor", {
		beforeEach : function(assert) {
			// this is a minimal configuration which has every possible request (each 2 times, except for smartFilterBar)
			this.config = {
				content : {
					applicationTitle : {
						key : "titleKey"
					},
					steps : [{
						title : {},
						id : "Step-1",
						request : "StepRequest1",
						binding : "binding",
						filterMapping : {
							requestForMappedFilter : "StepFilterMappingRequest",
							target : []
						}
					},{
						title : {},
						id : "Step-2",
						request : "StepRequest2",
						binding : "binding"
					}],
					categories : [],
					requests : [{
						id : "StepRequest1",
						service : "StepService1",
						selectProperties : []
					},{
						id : "StepRequest2",
						service : "StepService2",
						selectProperties : []
					},{
						id : "ValueHelpRequest1",
						service : "ValueHelpService1",
						selectProperties : []
					},{
						id : "FilterResolutionRequest1",
						service : "FilterResolutionService1",
						selectProperties : []
					},{
						id : "ValueHelpRequest2",
						service : "ValueHelpService2",
						selectProperties : []
					},{
						id : "FilterResolutionRequest2",
						service : "FilterResolutionService2",
						selectProperties : []
					},{
						id : "FilterMappingRequest1",
						service : "FilterMappingService1",
						selectProperties : []
					},{
						id : "FilterMappingRequest2",
						service : "FilterMappingService2",
						selectProperties : []
					},{
						id : "StepFilterMappingRequest",
						service : "StepFilterMappingService",
						selectProperties : []
					}],
					bindings : [{
						id : "binding",
						requiredFilters : [],
						representations : []
					}],
					facetFilters : [{
						id : "FacetFilter1",
						property : "property1",
						label : {},
						valueHelpRequest : "ValueHelpRequest1",
						filterResolutionRequest : "FilterResolutionRequest1"
					},{
						id : "FacetFilter2",
						property : "property2",
						label : {},
						valueHelpRequest : "ValueHelpRequest2",
						filterResolutionRequest : "FilterResolutionRequest2"
					}],
					smartFilterBar : {
						id : "SmartFilterBar-1",
						service : "SmartFilterBarService"
					},
					navigationTargets : [{
						id : "NavTarget1",
						filterMapping : {
							requestForMappedFilter : "FilterMappingRequest1",
							target : []
						}
					},{
						id : "NavTarget2",
						filterMapping : {
							requestForMappedFilter : "FilterMappingRequest2",
							target : []
						}
					}]
				}
			};
			var delays = [0, 0, 0, 0, 50, 0, 0, 0, 0, 0]; //one service is delayed
			var that = this;
			this.inject = {
				instances :{
					messageHandler : {
						check : function(){}
					},
					metadataFactory : {
						getMetadata : function(){
							var deferred = jQuery.Deferred();
							setTimeout(function(){
								deferred.resolve();
							}, delays[that.delayCounter]);
							that.delayCounter++;
							that.delayCounter = that.delayCounter % 10;
							return deferred;
						}
					}
				},
				constructors : {
					ConfigurationObjects : sap.apf.modeler.core.ConfigurationObjects,
					ConfigurationFactory : sap.apf.core.ConfigurationFactory,
					ElementContainer : sap.apf.modeler.core.ElementContainer,
					Hashtable : sap.apf.utils.Hashtable,
					RegistryProbe : sap.apf.modeler.core.RegistryWrapper,
					Step : sap.apf.modeler.core.Step,
					FacetFilter : sap.apf.modeler.core.FacetFilter,
					NavigationTarget : sap.apf.modeler.core.NavigationTarget,
					SmartFilterBar : sap.apf.modeler.core.SmartFilterBar
				}
			};
		}
	});
	QUnit.test("All Services finished registering after load", function(assert){
		// This test wants to make sure that the loading of the configuration waits for all services to be registered (metadata available)
		// Each time one service is delayed
		// To avoid the possibility to wait for just the one service (and let the test run green)
		// we change the delayed service each time we trigger executeTest
		var done = assert.async();
		var that = this;
		this.delayCounter = 0;
		executeTest();
		function executeTest(){
			var configEditor = new sap.apf.modeler.core.ConfigurationEditor(that.config, that.inject, function(){
				setTimeout(function(){
					var serviceList = configEditor.getAllServices();
					assert.ok(serviceList.indexOf("StepService1") > -1 ,"First StepService is registered");
					assert.ok(serviceList.indexOf("StepFilterMappingService") > -1 ,"StepFilterMapping service is registered");
					assert.ok(serviceList.indexOf("StepService2") > -1 ,"Second StepService is registered");
					assert.ok(serviceList.indexOf("ValueHelpService1") > -1 ,"Valuehelp of first FacetFilter is registered");
					assert.ok(serviceList.indexOf("FilterResolutionService1") > -1 ,"Filter resolution of first FacetFilter is registered");
					assert.ok(serviceList.indexOf("ValueHelpService2") > -1 ,"Valuehelp of second FacetFilter is registered");
					assert.ok(serviceList.indexOf("FilterResolutionService2") > -1 ,"Filter resolution of first FacetFilter is registered");
					assert.ok(serviceList.indexOf("FilterMappingService1") > -1 ,"First filter mapping request is registered");
					assert.ok(serviceList.indexOf("FilterMappingService2") > -1 ,"Second filter mapping request is registered");
					assert.ok(serviceList.indexOf("SmartFilterBarService") > -1 ,"SmartFilterBar request is registered");
					if(that.delayCounter === 9){
						done();
					} else {
						executeTest(that.delayCounter++);
					}
				}, 1);
			});
		}
	});
}());
