jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfCoreApi');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.testhelper.mockServer.wrapper');
jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.require("sap.apf.core.utils.checkForTimeout");
jQuery.sap.require("sap.apf.core.resourcePathHandler");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.utils.startParameter");
jQuery.sap.require("sap.apf.core.utils.fileExists");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	'use strict';
	var MessageHandler = function() {
		this.setup = function() {
			if (this.check.restore) {
				this.check.restore();
			}
			if (this.putMessage.restore) {
				this.putMessage.restore();
			}
			if (this.createMessageObject.restore) {
				this.createMessageObject.restore();
			}
			sinon.stub(this, "check", function(booleExpr, sMessage) {
				if (!booleExpr) {
					throw new Error(sMessage);
				}
				return true;
			});
			sinon.stub(this, "putMessage", function(oMessage) {
				throw new Error(oMessage);
			});
			sinon.stub(this, "createMessageObject", function(oConfig) {
				return new sap.apf.core.MessageObject(oConfig);
			});
		};
	};
	MessageHandler.prototype = new sap.apf.testhelper.interfaces.IfMessageHandler();
	MessageHandler.prototype.constructor = MessageHandler;

	function getDefaultApplicationConfiguration() {
		return {
				"applicationConfiguration" : {
					"type" : "applicationConfiguration",
					"appName" : "appName",
					"appTitle" : "appTitle",
					"analyticalConfigurationLocation" : "analytical.json",
					"applicationMessageDefinitionLocation" : "ZZZ2.json",
					"textResourceLocations" : {
						"applicationMessageTextBundle" : "zzz.properties",
						"apfUiTextBundle" : "qqq.properties",
						"applicationUiTextBundle" : "uuu.properties"
					},
					"persistence" : {
						"path" : {
							"service" : "/sap/hba/apps/reuse/apf/s/logic/path.xsjs"
						},
						"logicalSystem" : {
							"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
						}
					},
					"smartBusiness" : {
						"evaluations" : {
							"type" : "smartBusinessRequest",
							"id" : "smartBusinessRequest",
							"service" : "hugo-non-existing",
							"entityType" : "Evaluations"
						}
					}
				}
			};
	}
	function commonCoreSetup(oContext, inject) {
		oContext.oMessageHandler = new MessageHandler();

		oContext.corePromise = new jQuery.Deferred();
		oContext.oMessageHandler.setup();
		oContext.oMessageHandler.aaaDebug = "tResourcePathHandler";
		oContext.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
		oContext.coreApi.aaaDebug = "tResourcePathHandler";
		oContext.coreApi.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		oContext.coreApi.getStartParameterFacade = function() {
			return new sap.apf.utils.StartParameter();
		};
		oContext.coreApi.loadMessageConfiguration = function() {
		};
		oContext.coreApi.ajax = function(context) {
			((inject && inject.functions &&  inject.functions.ajax) || jQuery.ajax)(context);
		};
		oContext.spyloadAnalyticalConfiguration = sinon.stub(oContext.coreApi, "loadAnalyticalConfiguration", function() {
			return null;
		});
	}
	function commonSetup(oContext, inject) {
		commonCoreSetup(oContext, inject);
		var checkForTimeout = (inject && inject.functions && inject.functions.checkForTimeout) || sap.apf.core.utils.checkForTimeout;
		
		oContext.oInject = {
			instances: {
				messageHandler : oContext.oMessageHandler,
				coreApi : oContext.coreApi,
				fileExists : new ((inject && inject.constructors && inject.constructors.FileExists) || sap.apf.core.utils.FileExists)()
			},
			functions : {
				isUsingCloudFoundryProxy : function() {
					return false;
				},
				checkForTimeout : checkForTimeout,
				initTextResourceHandlerAsPromise : (inject && inject.functions &&  inject.functions.initTextResourceHandlerAsPromise) || sap.apf.utils.createPromise
			},
			corePromise : oContext.corePromise
		};
		oContext.resPathHandler = new sap.apf.core.ResourcePathHandler(oContext.oInject);
		//------------
		oContext.applConfigJSON = getDefaultApplicationConfiguration();
	}
	function commonTeardown(oContext) {
		oContext.spyloadAnalyticalConfiguration.restore();
	}
	QUnit.module('RPH - load and handle error in Ajax', {
		beforeEach : function(assert) {
			commonSetup(this);
		},
		afterEach : function(assert) {
			commonTeardown(this);
		}
	});
	QUnit.test("GIVEN coreApi.check() is stubbed WHEN check true THEN returns true", function(assert) {
		assert.ok(this.oInject.instances.messageHandler.check(true, "", 5));
	});
	QUnit.test("GIVEN coreApi.check() is stubbed WHEN check false THEN threw", function(assert) {
		assert.throws(function() {
			this.oInject.instances.messageHandler.check(false, "", 4711);
		});
		assert.ok(this.oMessageHandler.check.threw());
	});
	QUnit.test("GIVEN jQuery.ajax stubbed as error WHEN loadConfigFromFilePath() with invalid file name THEN putMessage() AND throws AND code===5068", function(assert) {
		var ajaxSpy = sinon.stub(jQuery, "ajax", function(oParam1) {
			oParam1.error("", "", "###test provoked error in configuration");
		});
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("PathToNotExistingConfiguration.json");
		});
		var spy = this.oMessageHandler.putMessage;
		assert.ok(spy.called, "putMessage");
		assert.ok(spy.threw(), "putMessage");
		var msg0 = spy.getCall(0).args[0];
		assert.equal(msg0.getCode(), 5068, "correct code");
		ajaxSpy.restore();
	});
	QUnit.module('RPH - load application configuration.json and check properties', {
		beforeEach : function(assert) {
			var that = this;
			commonSetup(this);
			this.ajaxSpy = sinon.stub(jQuery, "ajax", function(oParam1) {
				oParam1.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
			});
		},
		afterEach : function(assert) {
			this.ajaxSpy.restore();
			commonTeardown(this);
		}
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json WHEN loadConfigFromFilePath() is called with file name THEN parser returns correct properties", function(assert) {
		var spyFileExists = sinon.spy(this.oInject.instances.fileExists, "check");
		var spyCoreAjax = sinon.spy(this.coreApi, "ajax");
		this.resPathHandler.loadConfigFromFilePath("doesNotMatterSinceStubbed.json");
		var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageDefinitionLocation);
		var sExpectedPath = "ZZZ2.json";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of applicationMessageDefinitionLocation ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle);
		sExpectedPath = "zzz.properties";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of applicationMessageTextBundle ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.apfUiTextBundle);
		sExpectedPath = "qqq.properties";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of apfUiTextBundle ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
		sExpectedPath = "uuu.properties";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of applicationUiTextBundle ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.analyticalConfigurationLocation);
		sExpectedPath = "analytical.json";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of analyticalConfigurationLocation ");
		assert.equal(this.ajaxSpy.callCount, 7, "# ajax calls");
		assert.strictEqual(spyFileExists.callCount, 4, "# of calls to file exists");
		assert.deepEqual(spyFileExists.getCall(0).args, [ "ZZZ2.json", true], "THEN called with suppress sap system logic");
		assert.deepEqual(spyFileExists.getCall(1).args, [ "zzz.properties", true], "THEN called with suppress sap system logic");
		assert.deepEqual(spyFileExists.getCall(2).args, [ "uuu.properties", true], "THEN called with suppress sap system logic");
		assert.deepEqual(spyFileExists.getCall(3).args, [ "analytical.json", true], "THEN called with suppress sap system logic");
		assert.strictEqual(spyCoreAjax.callCount, 3, "THEN # of calls to core ajax");
		assert.deepEqual(spyCoreAjax.getCall(0).args[0].suppressSapSystem, true, "THEN called with suppress sap system logic");
		assert.deepEqual(spyCoreAjax.getCall(1).args[0].suppressSapSystem, true, "THEN called with suppress sap system logic");
		assert.deepEqual(spyCoreAjax.getCall(2).args[0].suppressSapSystem, true, "THEN called with suppress sap system logic");
		spyFileExists.restore();
		spyCoreAjax.restore();
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json WHEN loadConfigFromFilePath() is called twice THEN loads as called once", function(assert) {
		this.resPathHandler.loadConfigFromFilePath("doesNotMatterSinceStubbed.json");
		this.resPathHandler.loadConfigFromFilePath("doesNotMatterSinceStubbed.json");
		var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageDefinitionLocation);
		var sExpectedPath = "ZZZ2.json";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of applicationMessageDefinitionLocation ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle);
		sExpectedPath = "zzz.properties";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of applicationMessageTextBundle ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.apfUiTextBundle);
		sExpectedPath = "qqq.properties";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of apfUiTextBundle ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
		sExpectedPath = "uuu.properties";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of applicationUiTextBundle ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.analyticalConfigurationLocation);
		sExpectedPath = "analytical.json";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of analyticalConfigurationLocation ");
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json WHEN loadConfigFromFilePath() is called twice THEN file loaded only once", function(assert) {
		this.resPathHandler.loadConfigFromFilePath("doesNotMatterSinceStubbed.json");
		this.resPathHandler.loadConfigFromFilePath("doesNotMatterSinceStubbed.json");
		assert.equal(this.ajaxSpy.callCount, 7, "# ajax calls");
	});
	QUnit.module('RPH - load application configuration.json check defaults', {
		beforeEach : function(assert) {
			var that = this;
			var inject = {
					functions : {
						initTextResourceHandlerAsPromise : function() {
							assert.ok(true, "the text handler loading was called");
							return sap.apf.utils.createPromise();
						}
					}
			};
			commonSetup(this, inject);
			this.ajaxSpy = sinon.stub(jQuery, "ajax", function(oParam1) {
				if (oParam1.type !== "HEAD") {
					assert.equal(oParam1.async, true, "THEN ajax is called in asynchronous mode");

					setTimeout(function() {
						oParam1.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
					},1);
				} else {
					oParam1.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
				}
				
			});
		},
		afterEach : function(assert) {
			this.ajaxSpy.restore();
			commonTeardown(this);
		}
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json WHEN loadConfigFromFilePath() is called with file name THEN parser returns persistence config", function(assert) {
		assert.expect(5);
		var done = assert.async();
		var oPersistenceConfigurationExpected = jQuery.extend(true, {}, this.applConfigJSON.applicationConfiguration.persistence);
		oPersistenceConfigurationExpected.path.entitySet = sap.apf.core.constants.entitySets.analysisPath;
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		this.resPathHandler.getPersistenceConfiguration().done(function(oPersistenceConfiguration){
		assert.deepEqual(oPersistenceConfiguration, oPersistenceConfigurationExpected, "Persistence Configuration with default entity set for path");
			done();
		});
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json WHEN loadConfigFromFilePath() is called with file name THEN parser returns persistence config", function(assert) {
		assert.expect(5);
		var done = assert.async();
		this.applConfigJSON.applicationConfiguration.persistence.path.entitySet = "PathEntitySetFromConfig";
		var oPersistenceConfigurationExpected = jQuery.extend(true, {}, this.applConfigJSON.applicationConfiguration.persistence);
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		this.resPathHandler.getPersistenceConfiguration().done(function(oPersistenceConfiguration){
		assert.deepEqual(oPersistenceConfiguration, oPersistenceConfigurationExpected, "Persistence Configuration with entity set for path from application configuration");
			done();
		});
	});
	QUnit.module('RPH - load persistence in configuration.json', {
		beforeEach : function(assert) {
			var thisSetup = this;
			commonSetup(this);
			this.ajaxSpy = sinon.stub(jQuery, "ajax", function(requestSpec) {
				requestSpec.success.bind(thisSetup.resPathHandler, thisSetup.applConfigJSON, "", "")();
			});
		},
		afterEach : function(assert) {
			this.ajaxSpy.restore();
			commonTeardown(this);
		}
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json WHEN loadConfigFromFilePath() is called with file name THEN parser returns persistence config", function(assert) {
		var oPersistenceConfigurationExpected = jQuery.extend(true, {}, this.applConfigJSON.applicationConfiguration.persistence);
		oPersistenceConfigurationExpected.path.entitySet = sap.apf.core.constants.entitySets.analysisPath;
		this.resPathHandler.loadConfigFromFilePath("hugo.json"); //CUT
		this.resPathHandler.getPersistenceConfiguration().done(function(oPersistenceConfiguration){
			assert.deepEqual(oPersistenceConfiguration, oPersistenceConfigurationExpected, "Persistence Configuration with default entity set for path");
		});
		
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json WHEN loadConfigFromFilePath() is called with file name THEN parser returns persistence config", function(assert) {
		this.applConfigJSON.applicationConfiguration.persistence.path.entitySet = "PathEntitySetFromConfig";
		var oPersistenceConfigurationExpected = jQuery.extend(true, {}, this.applConfigJSON.applicationConfiguration.persistence);
		this.resPathHandler.loadConfigFromFilePath("hugo.json"); //CUT
		this.resPathHandler.getPersistenceConfiguration().done(function(oPersistenceConfiguration){
			assert.deepEqual(oPersistenceConfiguration, oPersistenceConfigurationExpected, "Persistence Configuration with entity set for path from application configuration");
		});	
	});
	QUnit.module('RPH - load application configuration json', {
		beforeEach : function(assert) {
			var that = this;
			commonSetup(this);
			function successStub(requestSpec, httpCode) { // avoid code copies
				requestSpec.success.bind(that.resPathHandler, {
					response : "hugo"
				}, httpCode, null)();
			}
			this.ajaxLoadApplConfigSpy = sinon.stub(jQuery, "ajax", function(requestSpec) {
				if (requestSpec.url.search("hugo.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
				} else {
					successStub(requestSpec, 200);
				}
			});
		},
		afterEach : function(assert) {
			this.ajaxLoadApplConfigSpy.restore();
			commonTeardown(this);
		}
	});
	QUnit.test("GIVEN ajax stub and stubbed config json WHEN loading the analytical config file THEN no putMessage AND no check is called AND loadAnalyticalConfiguration called", function(assert) {
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		assert.ok(this.ajaxLoadApplConfigSpy.called, "ajax called");
		assert.ok(this.spyloadAnalyticalConfiguration.calledOnce, "called loadAnalyticalConfiguration");
		assert.ok(!this.spyloadAnalyticalConfiguration.threw(), "!throws loadAnalyticalConfiguration");
		assert.ok(!this.oMessageHandler.putMessage.threw());
		assert.ok(!this.oMessageHandler.check.threw());
	});
	QUnit.module('RPH - load analytical json', {
		beforeEach : function(assert) {
			var that = this;
			commonSetup(this);
			function successStub(requestSpec, httpCode) { // avoid code copies
				requestSpec.success.bind(that.resPathHandler, {
					response : "hugo"
				}, httpCode, null)();
			}
			this.ajaxLoadApplConfigSpy = sinon.stub(jQuery, "ajax", function(requestSpec) {
				if (requestSpec.url.search("hugo.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
				} else if (requestSpec.url.search("hugo222.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
				} else if (requestSpec.url.search("hugo333.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
				} else if (requestSpec.url.search("hugo403.json") >= 0) {
					requestSpec.success.bind({},  "", 403, { status : 403 })();
				} else if (requestSpec.url.search("analytical.json") >= 0) {
					requestSpec.error.bind(that.resPathHandler, {
						response : "error"
					}, 404, "error")();
				} else if (requestSpec.url.search("analyticalWithName.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, {
						applicationTitle : {
							key : "TextGUID"
						}
					}, 200, "http:200")();
				} else if (requestSpec.url.search("doesExistButNullResponse.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, null, 200, "http:200")();
				} else if (requestSpec.url.search("doesExistButEmptyResponse.json") >= 0) { // analytical
					requestSpec.success.bind(that.resPathHandler, {}, 200, "http:200")();
				} else {
					successStub(requestSpec, 404);
				}
			});
			this.applConfigJSON = {
				"applicationConfiguration" : {
					"analyticalConfigurationLocation" : "analytical.json",
					"textResourceLocations" : {},
					"persistence" : {
						"path" : {
							"service" : "/sap/hba/apps/reuse/apf/s/logic/path.xsjs"
						},
						"logicalSystem" : {
							"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
						}
					},
					"smartBusiness" : {
						"evaluations" : {
							"type" : "smartBusinessRequest",
							"id" : "smartBusinessRequest",
							"service" : "hugo-non-existing",
							"entityType" : "Evaluations"
						}
					}
				}
			};
		},
		afterEach : function(assert) {
			this.ajaxLoadApplConfigSpy.restore();
			commonTeardown(this);
		}
	});
	QUnit.test("Get application title text key from config file", function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = 'analyticalWithName.json';
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		this.resPathHandler.getConfigurationProperties().done(function(configProperties){
		assert.equal(configProperties.appName, "TextGUID", "Correct text key from file retrieved");
		assert.equal(configProperties.appTitle, "TextGUID", "Correct text key from file retrieved");
			done();
		});
	});
	QUnit.test("WHEN application configuration is resolved", function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = 'analyticalWithName.json';
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		this.resPathHandler.getConfigurationProperties().done(function(configProperties){
			assert.equal(this.corePromise.state(), "resolved", "THEN core promise must also be resolved");
			done();
		}.bind(this));
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN analytical config file loading causes TIMEOUT THEN putMessage is called with a specific code", function(assert) {
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("hugo403.json");
		});
		assert.ok(this.ajaxLoadApplConfigSpy.called, "ajax called");
		assert.ok(!this.spyloadAnalyticalConfiguration.calledOnce, "NOT called loadAnalyticalConfiguration");
		assert.ok(!this.spyloadAnalyticalConfiguration.threw(), "NOT throws loadAnalyticalConfiguration");
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(!this.oMessageHandler.check.threw());
		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.equal(call0.args[0].getCode(), "5054", "Correct message code thrown");
	});

	QUnit.test("GIVEN ajax stub and applConfig.json WHEN analytical config file not exists (analytical.json) THEN putMessage is called with a specific code", function(assert) {
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("hugo.json");
		});
		assert.ok(this.ajaxLoadApplConfigSpy.called, "ajax called");
		assert.ok(!this.spyloadAnalyticalConfiguration.calledOnce, "NOT called loadAnalyticalConfiguration");
		assert.ok(!this.spyloadAnalyticalConfiguration.threw(), "NOT throws loadAnalyticalConfiguration");
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(!this.oMessageHandler.check.threw());
		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.ok(call0.args[0].getCode(), 5058, "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing applicationConfiguration THEN putMessage is called", function(assert) {
		this.applConfigJSON.applicationConfiguration = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo.json");
		});
		assert.ok(this.ajaxLoadApplConfigSpy.called, "ajax called");
		assert.ok(!this.spyloadAnalyticalConfiguration.calledOnce, "NOT called loadAnalyticalConfiguration");
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(!this.oMessageHandler.check.threw());
		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.equal(call0.args[0].getCode(), 5055, "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing textResourceLocations THEN putMessage is called with errorInMessageDefinition", function(assert) {
		this.applConfigJSON.applicationConfiguration.textResourceLocations = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo.json");
		});
		assert.ok(this.ajaxLoadApplConfigSpy.called, "ajax called");
		assert.ok(!this.spyloadAnalyticalConfiguration.calledOnce, "! called loadAnalyticalConfiguration");
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(!this.oMessageHandler.check.threw());
		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.equal(call0.args[0].getCode(), 5056, "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and files WHEN request to analytical file has no response THEN putMessage is called with error 5057", function(assert) {
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = "doesExistButNullResponse.json";
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo222.json");
		});
		assert.ok(this.ajaxLoadApplConfigSpy.called, "ajax called");
		assert.ok(!this.spyloadAnalyticalConfiguration.called, "NOT called loadAnalyticalConfiguration");
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(!this.oMessageHandler.check.threw());
		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.equal(call0.args[0].getCode(), 5057, "Correct message code thrown, code==" + call0.args[0].getCode());
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing persistence THEN putMessage is called with errorInAnalyticalConfig", function(assert) {
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = "doesExistButEmptyResponse.json";
		this.applConfigJSON.applicationConfiguration.persistence = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo333.json");
		});
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.equal(this.oMessageHandler.putMessage.getCall(0).args[0].getCode(), "5066", "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing persistence path THEN putMessage is called with errorInAnalyticalConfig", function(assert) {
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = "doesExistButEmptyResponse.json";
		this.applConfigJSON.applicationConfiguration.persistence.path = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo333.json");
		});
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.equal(this.oMessageHandler.putMessage.getCall(0).args[0].getCode(), "5066", "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing persistence service THEN putMessage is called with errorInAnalyticalConfig", function(assert) {
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = "doesExistButEmptyResponse.json";
		this.applConfigJSON.applicationConfiguration.persistence.path.service = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo333.json");
		});
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.equal(this.oMessageHandler.putMessage.getCall(0).args[0].getCode(), "5067", "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has logical system service 'null' THEN no putMessage is called with errorInAnalyticalConfig", function(assert) {
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = "doesExistButEmptyResponse.json";
		this.applConfigJSON.applicationConfiguration.persistence.logicalSystem.service = null;
		this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo333.json");
		assert.ok(!this.oMessageHandler.putMessage.threw(), "No putMessage called");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing persistence service THEN putMessage is called with missing analytical config", function(assert) {
		var that = this;
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = undefined;
		assert.throws(function() {
			that.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo333.json");
		});
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.equal(this.oMessageHandler.putMessage.getCall(0).args[0].getCode(), 5060, "Correct message code thrown");
		var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.analyticalConfigurationLocation);
		assert.ok(sPath.length === 0, "expected default ");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing entity set in smart business configuration of applicationConfiguration THEN putMessage is called", function(assert) {
		this.applConfigJSON.applicationConfiguration.smartBusiness.evaluations.entityType = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo.json");
		});

		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.equal(call0.args[0].getCode(), 5061, "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing type in smart business configuration of applicationConfiguration THEN putMessage is called", function(assert) {
		this.applConfigJSON.applicationConfiguration.smartBusiness.evaluations.type = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo.json");
		});

		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.equal(call0.args[0].getCode(), 5062, "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing service in smart business configuration of applicationConfiguration THEN putMessage is called", function(assert) {
		this.applConfigJSON.applicationConfiguration.smartBusiness.evaluations.service = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo.json");
		});

		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.equal(call0.args[0].getCode(), 5063, "Correct message code thrown");
	});

	QUnit.module('RPH - load SmartBusiness service root by appl configuration file', {
		beforeEach : function(assert) {
			var thisSetup = this;
			commonSetup(this);
			this.ajaxSpy = sinon.stub(jQuery, "ajax", function(requestSpec) {
				requestSpec.success.bind(thisSetup.resPathHandler, thisSetup.applConfigJSON, "", "")();
			});
		},
		afterEach : function(assert) {
			this.ajaxSpy.restore();
			commonTeardown(this);
		}
	});
	QUnit.test("GIVEN jQuery.ajax stubbed returning a json WHEN loadConfigFromFilePath() THEN parser returns Smart Business config input", function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		this.resPathHandler.getConfigurationProperties().done(function(oConfigurationProperties){
		assert.ok(this.applConfigJSON.applicationConfiguration.smartBusiness, "Smart Business configuration is available");
			assert.deepEqual(oConfigurationProperties.smartBusiness, this.applConfigJSON.applicationConfiguration.smartBusiness, "Smart Business Configuration as expected");
			done(); 
		}.bind(this));
	});
	QUnit.module('RPH - Load analytical configuration by mocked service ', {
		beforeEach : function(assert) {
			var that = this;
			sap.apf.testhelper.mockServer.activateModeler();
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			this.coreApi.getXsrfToken = function() {
				return sap.apf.utils.createPromise('otto');
			};
			this.coreApi.getStartParameterFacade = function() {
				return new sap.apf.utils.StartParameter();
			};
			this.coreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			this.coreApi.loadMessageConfiguration = function() {
			};
			this.coreApi.ajax = function(context) {
				jQuery.ajax(context);
			};
			this.coreApi.getEntityTypeMetadata = function() {
				var entityTypeMetadata = {
						getPropertyMetadata : function() {
							return {};
						}
					};
					return jQuery.Deferred().resolve(entityTypeMetadata);
			};
			this.coreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				var oInject = {
					instances: {
						datajs: OData
					},
					functions : {
						getSapSystem : function() {
							return undefined;
						}
					}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			this.coreApi.loadAnalyticalConfiguration = function(object) {
				that.loadedAnalyticalConfiguration = object;
			};
			this.coreApi.loadTextElements = function(textElements) {
				that.loadedTextElements = textElements;
			};
			this.corePromise = jQuery.Deferred();
			this.oInject = {
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.coreApi
				},
				functions : {
					isUsingCloudFoundryProxy : function() {
						return that.useCloudFoundryProxy || false;
					},
					checkForTimeout : sap.apf.core.utils.checkForTimeout,
					initTextResourceHandlerAsPromise : sap.apf.utils.createPromise
				},
				corePromise : this.corePromise
			};
			this.resPathHandler = new sap.apf.core.ResourcePathHandler(this.oInject);
			var originalAjax = jQuery.ajax;
			this.ajaxLoadApplConfigSpy = sinon.stub(jQuery, "ajax", function(requestSpec) {
				if (requestSpec.url.search("hugo.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
				} else {
					originalAjax(requestSpec);
				}
			});
			this.applConfigJSON = {
				"applicationConfiguration" : {
					"appName" : "key-from-appConfig-to-local-text-source",
					"appTitle" : "key-from-appConfig-to-local-text-source",
					"textResourceLocations" : {},
					"persistence" : {
						"path" : {
							"service" : "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata"
						},
						"logicalSystem" : {
							"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
						}
					}
				}
			};
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
			this.ajaxLoadApplConfigSpy.restore();
		}
	});
	QUnit.test("GIVEN URL parameter containing configuration ID WHEN loadAnalyticalConfiguration THEN mocked service is called", function(assert) {
		var done = assert.async();
		this.coreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return { configurationId : "ID_7891" };
				},
				getSapClient : function() {
					return undefined;
				},
				isLrepActive : function() {
					return false;
				}
			};
		};
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		var expectedConfig = {
			applicationTitle : {
				key : "TextKeyForConfigurationName"
			},
			categories : [ {
				type : 'category',
				id : 'category1',
				label : 'dummyLabel',
				steps : []
			} ]
		};

		this.corePromise.done(function(){
			assert.deepEqual(this.loadedAnalyticalConfiguration, expectedConfig, "Correct configuration loaded from service");
			assert.equal(this.loadedTextElements[0].TextElement, "ID_1", "Ressourcepath Handler called coreApi to load the texts");
			done();
		}.bind(this));
	});
	QUnit.test("GIVEN URL paramter containing invalid configuration ID WHEN loadAnalyticalConfiguration THEN throw fatal error", function(assert) {
		var done = assert.async();
		this.coreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return { configurationId : "invalidId" };
				},
				isLrepActive : function() {
					return false;
				}
			};
		};
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		this.corePromise.done(function(){
			assert.equal(this.oMessageHandler.spyResults.putMessage[1].code, "5022", "Correct Message Code");
			done();
		}.bind(this));
	});
	QUnit.test("Get application name text key from service", function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.coreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return { configurationId : "ID_7891" };
				},
				isLrepActive : function() {
					return false;
				}
			};
		};
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		this.resPathHandler.getConfigurationProperties().done(function(configProperties){
			assert.equal(configProperties.appTitle, "TextKeyForConfigurationName", "Correct text key from service retrieved");
			assert.equal(configProperties.appName, "TextKeyForConfigurationName", "Correct text key from service retrieved");
			done();
		});
	});
	QUnit.test("GIVEN configurationId and applicationId WHEN reading text and configuration from Lrep THEN text from mocked service is returned", function(assert) {
		assert.expect(2);
		var done = assert.async();
		this.coreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return { configurationId : "ID_7891",
							 applicationId : "ID_1234" };
				},
				isLrepActive : function() {
					return true;
				}
			};
		};
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		this.resPathHandler.getConfigurationProperties().done(function(configProperties){
			assert.equal(configProperties.appTitle, "TextKeyForConfigurationName", "Correct text key from service retrieved");
			assert.equal(configProperties.appName, "TextKeyForConfigurationName", "Correct text key from service retrieved");
			done();
		});
	});
	QUnit.module("Error handling during loading of application message configuration", {
		beforeEach : function() {
				this.messageHandler = new sap.apf.core.MessageHandler();
				this.messageHandler.loadConfig(sap.apf.core.messageDefinition);

				this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();

				this.coreApi.getUriGenerator = function() {
					return sap.apf.core.utils.uriGenerator;
				};
				this.coreApi.getStartParameterFacade = function() {
					return new sap.apf.utils.StartParameter();
				};
				this.coreApi.loadAnalyticalConfiguration = function() {
				};
				this.coreApi.loadMessageConfiguration = function() {
				};
				this.coreApi.ajax = function(requestSpec) {
					if (requestSpec.url.search("/path/to/config") > -1) {
						requestSpec.success(getDefaultApplicationConfiguration(), "", "");
					} else if (requestSpec.url.search("analytical.json") > -1) {
						requestSpec.success({ applicationTitle : "Conf"}, "", "");
					} else if (requestSpec.url.search("ZZZ2.json") > -1) {
						requestSpec.error({}, "error", "");
					} 
				};
				var FileAlwaysExists = function() {
					this.check = function() { return true; };
				};
				var inject = {
					instances: {
						messageHandler : this.messageHandler,
						coreApi : this.coreApi,
						fileExists : new FileAlwaysExists(),
						isUsingCloudFoundryProxy : function() {
							return  false;
						}
					},
					functions : {
						checkForTimeout : sap.apf.core.utils.checkForTimeout,
						isUsingCloudFoundryProxy : function() { return false; }
					}
				};
				this.resPathHandler = new sap.apf.core.ResourcePathHandler(inject);

		}
	});

	QUnit.test("WHEN application config is loaded and loading of application message config results in error", function(assert){

		function assertMessageCode(messageObject) {
			assert.equal(messageObject.getPrevious().getCode(), 5058, "THEN expected fatal message code");
		}
		this.messageHandler.setMessageCallback(assertMessageCode);
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/path/to/config");
		});
	});
	QUnit.module("Load application config without application message definition, application message texts, logical system ", {
		beforeEach : function(assert) {
			var that = this;
			this.originalAjax = jQuery.ajax;
			sap.apf.testhelper.adjustResourcePaths(this.originalAjax);
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			this.coreApi.getXsrfToken = function() {
				return sap.apf.utils.createPromise('otto');
			};
			this.coreApi.getStartParameterFacade = function() {
				return new sap.apf.utils.StartParameter();
			};
			this.coreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			this.coreApi.loadMessageConfiguration = function(conf, bResetRegistry) {
				if (bResetRegistry) {
					that.loadedApfMessageConfiguration = conf;
				} else {
					that.loadedApplicationMessageConfiguration = conf;
				}
			};
			this.coreApi.getEntityTypeMetadata = function() {
				var entityTypeMetadata = {
						getPropertyMetadata : function() {
							return {};
						}
					};
					return jQuery.Deferred().resolve(entityTypeMetadata);
			};
			this.coreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				var oInject = {
					instances: {
						datajs: OData
					},
					functions : {
						getSapSystem : function() {
							return undefined;
						}
					}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			this.coreApi.loadAnalyticalConfiguration = function(object) {
				that.loadedAnalyticalConfiguration = object;
			};
			this.coreApi.loadTextElements = function(textElements) {
				that.loadedTextElements = textElements;
			};
			this.coreApi.ajax = function(context) {
				jQuery.ajax(context);
			};
			this.corePromise = jQuery.Deferred();
			this.oInject = {
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.coreApi,
					fileExists : new sap.apf.core.utils.FileExists()
				},
				functions : {
					checkForTimeout : sap.apf.core.utils.checkForTimeout,
					initTextResourceHandlerAsPromise : sap.apf.utils.createPromise,
					isUsingCloudFoundryProxy : function() {
						return false;
					}
				},
				corePromise : this.corePromise
			};
			this.resPathHandler = new sap.apf.core.ResourcePathHandler(this.oInject);
		},
		afterEach : function(assert) {
			jQuery.ajax = this.originalAjax;
		}
	});
	QUnit.test("WHEN loadApplicationConfig is called", function(assert) {
		var done = assert.async();
		this.resPathHandler.loadConfigFromFilePath("/apf-test/test-resources/sap/apf/testhelper/config/minimalApplicationConfiguration.json");
		this.corePromise.done(function(){
			var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle);
			assert.equal(sPath, "", "THEN empty path for application Messages is still set");
			sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
			assert.ok(sPath.search("/sap/apf/resources/i18n/test_texts.properties") > -1, "THEN correct path for application UI texts is set");
			assert.equal(this.loadedAnalyticalConfiguration.steps.length, 7, "THEN analytical configuration with 7 steps has been loaded");
			assert.equal(this.loadedAnalyticalConfiguration.steps[0].id, "stepTemplate1", "THEN the first step has expected id");
			assert.equal(this.loadedApplicationMessageConfiguration, undefined, "THEN application message configuration has not been loaded");
			assert.equal(this.loadedApfMessageConfiguration.length > 50, true, "THEN the apf message configuration has been loaded");
			done();
		}.bind(this));
	});
	QUnit.module("Load application configuration directly", {
		beforeEach : function(assert) {
			var that = this;
			var SpyFileExists = function() {
				var fileExists = new sap.apf.core.utils.FileExists();
				that.headRequests = [];
				this.check = function (sUrl) {
					that.headRequests.push(sUrl);
					return fileExists.check(sUrl);
				};
			};
			this.fileExists = new SpyFileExists();
			this.originalAjax = jQuery.ajax;
			sap.apf.testhelper.adjustResourcePaths(this.originalAjax);
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			this.coreApi.getXsrfToken = function() {
				return sap.apf.utils.createPromise('otto');
			};
			this.coreApi.getStartParameterFacade = function() {
				return new sap.apf.utils.StartParameter();
			};
			this.coreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			this.coreApi.loadMessageConfiguration = function(conf, bResetRegistry) {
				if (bResetRegistry) {
					that.loadedApfMessageConfiguration = conf;
				} else {
					that.loadedApplicationMessageConfiguration = conf;
				}
			};
			this.coreApi.registerTextWithKey = function(key, text) {
				that.registeredText = { key : key, text : text };
			};
			this.coreApi.ajax = function(context) {
				jQuery.ajax(context);
			};
			this.coreApi.getEntityTypeMetadata = function() {
				var entityTypeMetadata = {
						getPropertyMetadata : function() {
							return {};
						}
					};
					return jQuery.Deferred().resolve(entityTypeMetadata);
			};
			this.coreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				var oInject = {
					instances: {
						datajs: OData
					},
					functions : {
						getSapSystem : function() {
							return undefined;
						}
					}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			this.coreApi.loadAnalyticalConfiguration = function(object) {
				that.loadedAnalyticalConfiguration = object;
			};
			this.coreApi.loadTextElements = function(textElements) {
				that.loadedTextElements = textElements;
			};
		},
		afterEach : function(assert) {
			jQuery.ajax = this.originalAjax;
		},
		loadManifestAndResourcePathHandler : function(bWithOutApfSection, bWithWrongAnalyticalConfiguration, bWithoutPathPersistence, bWithoutAnalyticalConfDataSource) {
			var manifest;
			var that = this;
			jQuery.ajax({
				url : "../testhelper/comp/manifest.json",
				dataType : "json",
				success : function(oData) {
					manifest = oData;
				},
				error : function(oJqXHR, sStatus, sError) {
					manifest = {};
				},
				async : false
			});

			if (bWithOutApfSection) {
				manifest["sap.apf"] = undefined;
			}
			if(bWithWrongAnalyticalConfiguration){
				manifest["sap.app"].dataSources.AnalyticalConfigurationLocation.uri = undefined;
			}
			if(bWithoutPathPersistence) {
				manifest["sap.app"].dataSources.PathPersistenceServiceRoot = undefined;
			}
			if (bWithoutAnalyticalConfDataSource) {
				manifest["sap.app"].dataSources.AnalyticalConfigurationLocation = undefined;
			}
			var baseManifest;
			jQuery.ajax({
				url : "../../../../resources/sap/apf/base/manifest.json",
				dataType : "json",
				success : function(oData) {
					baseManifest = oData;
				},
				error : function(oJqXHR, sStatus, sError) {
					baseManifest = {};
				},
				async : false
			});
			this.corePromise = jQuery.Deferred();
			this.oInject = {
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.coreApi,
					fileExists : this.fileExists
				},
				functions : {
					initTextResourceHandlerAsPromise : sap.apf.utils.createPromise,
					isUsingCloudFoundryProxy : function() {
						return that.usesCloudFoundryProxy || false;
					}
				},
				manifests : {
					manifest : manifest,
					baseManifest : baseManifest
				},
				corePromise : this.corePromise
			};
			this.resPathHandler = new sap.apf.core.ResourcePathHandler(this.oInject);
		}
	});
	QUnit.test("WHEN loadAnalyticalConfigurationAndRessources is called", function(assert) {
		assert.expect(8);
		var done = assert.async();
		this.loadManifestAndResourcePathHandler();
		this.corePromise.done(function(){
			
			var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
			var headRequestForAnalyticalConfigurationFound = false;
			var expectedPersistenceConfiguration = {
				logicalSystem : {
					service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
				},
				path : {
					service : "/sap/opu/odata/sap/BSANLY_APF_RUNTIME_SRV",
					entitySet : 'AnalysisPathQueryResults'
				}
			};

			assert.ok(this.fileExists.check(sPath), "THEN correct path for application UI texts is set");
			assert.equal(this.loadedAnalyticalConfiguration.steps.length, 7, "THEN analytical configuration with 7 steps has been loaded");
			assert.equal(this.loadedAnalyticalConfiguration.steps[0].id, "stepTemplate1", "THEN the first step has expected id");
			this.resPathHandler.getConfigurationProperties().done(function(configurationProperties){
				assert.equal(configurationProperties.defaultExchangeRateType, "M", "THEN the correct additional parameter is returned");
				assert.equal(configurationProperties.appName, this.registeredText.key, "THEN app title was registered properly");
			this.headRequests.forEach(function(url){
				assert.equal(url.search('/resources/sap/apf/resources/i18n/apfUi.properties'), -1, "no head request on apfUi.properties");
				headRequestForAnalyticalConfigurationFound = headRequestForAnalyticalConfigurationFound || url.search('/resources/config/sampleConfiguration.json') > -1;
			});
			assert.notOk(headRequestForAnalyticalConfigurationFound, "THEN no HEAD REQUEST on analytical configuration");
				this.resPathHandler.getPersistenceConfiguration().done(function(persistenceConfiguration){
					assert.deepEqual(persistenceConfiguration, expectedPersistenceConfiguration, "THEN the persistence configuration is set");
					done();
				});
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("WHEN manifest without apf section is loaded", function(assert) {
		this.loadManifestAndResourcePathHandler(true);
		var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
		assert.ok(this.fileExists.check(sPath), "THEN correct path for application UI texts is set");
		assert.ok(true, "No exception occurred");
	});
	QUnit.test("WHEN manifest without data source for analyticalConfigurationConfiguration is loaded", function(assert) {
		this.loadManifestAndResourcePathHandler(false, false, false, true);
		assert.equal(this.oMessageHandler.spyResults.putMessage[0].code, 5065, "Message with correct code put");
	});
	QUnit.test("WHEN manifest with missing path persistence is loaded", function(assert) {
		this.loadManifestAndResourcePathHandler(false, false, true);
		assert.equal(this.oMessageHandler.spyResults.putMessage[0].code, 5064, "Message with correct code put");
	});
	QUnit.test("WHEN manifest with missing path persistence is loaded AND isUsingCloudFoundryProxy returns true", function(assert) {
		var done = assert.async();
		this.usesCloudFoundryProxy = true;
		this.loadManifestAndResourcePathHandler(false, false, true);
		assert.ok(jQuery.isEmptyObject(this.oMessageHandler.spyResults), "THEN no Message");
		this.resPathHandler.getPersistenceConfiguration().done(function(config){
			assert.strictEqual(config.path.service, "", "THEN empty url is returned");
			done();
		});
	});
	QUnit.module("Timeout error when loading application message definition", {
		beforeEach : function() {
			var that = this;
			var checkForTimeout = function(xhr) {

				if (xhr.url === "ZZZ2.json") {
					return new sap.apf.core.MessageObject({
						code : "5021"
					});
				}
				return undefined;
			};
			var ajax = function(config) {

				if (config.url === "applicationConfig.json") {
					config.success(that.applConfigJSON, "success", { url : config.url });
				} else {
					config.success(that.applConfigJSON, "success", { url : config.url });
				}
			};
			var FileAlwaysExists = function() {
				this.check = function() {
					return true;	
				};
			};
			var inject = {
					functions : { 
						checkForTimeout : checkForTimeout,
						ajax : ajax,
						initTextResourceHandlerAsPromise : sap.apf.utils.createPromise,
						isUsingCloudFoundryProxy : function() {
							return false;
						}
					},
					constructors : {
						FileExists : FileAlwaysExists
					}
			};
			commonSetup(this, inject);
		},
		afterEach : function(assert) {
			commonTeardown(this);
		}
	});
	QUnit.test("WHEN timeout occurs at loading of application message definition file", function(assert){
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("applicationConfig.json");
		});
		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.equal(call0.args[0].getCode(), "5067", "THEN Correct message code thrown");
	});
}());
