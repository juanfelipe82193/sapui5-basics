/*global sap,jQuery sinon, OData */
jQuery.sap.require("sap.apf.Component");
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.ushellHelper');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require('sap.apf.testhelper.doubles.request');
jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerStubbedAjax');
jQuery.sap.require('sap.apf.testhelper.stub.ajaxStub');
jQuery.sap.require('sap.apf.testhelper.stub.textResourceHandlerStub');
(function() {
	'use strict';
	var sapApfAppConfigPath = "/pathOfNoInterest/applicationConfiguration.json"; // stubJQueryAjax stubs any path matching "applicationConfiguration.json"
	var sapApfAppConfigPathOfComponent = "/pathOfNoInterestHugo/hugo/applicationConfiguration.json"; // stubJQueryAjax stubs any path matching "applicationConfiguration.json"
	var sapApfAppConfigPathDefault = "/pathOfNoInterestDefault/default/applicationConfiguration.json";
	var sapApfAppConfigPathFacetFilter = "/pathOfNoInterestDefault/applicationConfigurationFacetFilter.json";
	var fnConsoleAssert = window.console.assert;
	// Used to suppress many error messages about missing texts for keys.
	function consoleAssertReplacement(bResult, sMessage){
		if (!bResult && sMessage && !sMessage.includes("could not find any translatable text for key")){
			if (!bResult && sMessage && !sMessage.includes(".properties")) {
				fnConsoleAssert(bResult, sMessage);
			}
		}
	}
	function defineApiSpies(testModule, apiReferences) {
		testModule.spyCoreApiLoadApplicationConfig = sinon.spy(apiReferences.coreApi, "loadApplicationConfig");
		testModule.spyUiCreateApplicationLayout = sinon.spy(apiReferences.uiApi, "createApplicationLayout");
		testModule.spyGetLayoutView = sinon.spy(apiReferences.uiApi, "getLayoutView");
		testModule.spyUiHandleStartup = sinon.spy(apiReferences.uiApi, "handleStartup");
		testModule.spyNavigationHandlerCheckMode = sinon.spy(apiReferences.navigationHandler, "checkMode");
	}
	/**
	 * @description Creates a component inheriting from sap.apf.Component where its api instance is stubbed, using the "probe" concept.
	 * @param {object} testModule reference to the test's "this".
	 * @param {Function} [createContent] The createContent function of the Component. The default is an empty function.
	 * @param {object} [startParameters] optional component's start parameters. Value undefined is allowed.
	 * @param {object} [loadApplPathForComponent] The path/filename of the application configuration which will be loaded by the Component,
	 *              unless overridden by the start parameter 'sap-apf-app-config-path'.
	 * @returns {sap.apf.Component} the created component
	 */
	function createApplicationComponentWithStubbedApiAsPromise(testModule, createContentF, startParameters, loadApplPathForComponent) {
		var deferred = jQuery.Deferred();
		sap.apf.applComponentWithStubbedApi = sap.apf.applComponentWithStubbedApi || {};
		function onAfterStartApfCallback() {
			deferred.resolve(component);
		}
		/** Consumer Component build like DSO app for testing backward compatibility.
		 * Here, the parent call to sap.Component.init is replaced by a copy of that code in order to inject a probe */
		sap.apf.Component.extend("sap.apf.applComponentWithStubbedApi.Component", {
			metadata : {
				"name" : "Component",
				"version" : "0.0.0"
			},
			init : function() {
				var oReferences;
				var injectConstructors = {
					probe : function ApiProbe(apiReferences) { // a constructor for getting access to inner references of the api instance.
						oReferences = apiReferences;
						defineApiSpies(testModule, apiReferences); // a method defining sinon spies on inner references.
					},
					constructors: {
						ExternalContext: function() {
							this.getCombinedContext = function() {
								if (testModule.xappStateFilter && testModule.filterFromSmartBusiness) {
									var combinedFilter = new sap.apf.core.utils.Filter(testModule.messageHandler);
									combinedFilter.addAnd(testModule.xappStateFilter).addAnd(testModule.filterFromSmartBusiness);
									return jQuery.Deferred().resolve(combinedFilter);
								}
								if (testModule.xappStateFilter) {
									return jQuery.Deferred().resolve(testModule.xappStateFilter);
								}
								if (testModule.filterFromSmartBusiness) {
									return jQuery.Deferred().resolve(testModule.filterFromSmartBusiness);
								}
								return jQuery.Deferred().resolve(new sap.apf.core.utils.Filter(testModule.messageHandler));
							};
						},
						Request: sap.apf.testhelper.doubles.Request,
						Metadata: sap.apf.testhelper.doubles.Metadata,
						MessageHandler: function(){
							this.activateOnErrorHandling = function(){ return true;};
							this.setLifeTimePhaseStartup = function(){};
							this.loadConfig = function(){};
							this.setMessageCallback = function(){};
							this.setTextResourceHandler = function(){};
							this.check = function(){};
							this.isOwnException = function(){ return false;};
							this.putMessage = function(obj){
								if (obj !== undefined){
									window.console.error(obj);
								}
							};
							this.createMessageObject = function(msg){
								if (msg.code !== "3001"){
									return msg;
								}
								return undefined; // redundant msg "missing text for key"
							};
							this.setLifeTimePhaseRunning = function(){};
						}
					}
				};
				this.getProbeReferences = function() {
					return oReferences;
				};
				this.oApi = new sap.apf.Api(this, injectConstructors);
				// After new ... the probe references are set.
				sap.apf.Component.prototype.init.apply(this, arguments);
				this.oApi.setCallbackAfterApfStartup(onAfterStartApfCallback);
			},
			createContent : function() {
				if (createContentF) {
					createContentF(this);
				}
			}
		});
		var oComponentParameter = {
			componentData : {
				startupParameters : (startParameters || {
					startupParameters : {}
				})
			}
		};
		var component = new sap.apf.applComponentWithStubbedApi.Component(oComponentParameter);
		return deferred.promise();
	}
	/**
	 * Creates a component whose createContent is structurally equal to the fin.ar.DSO application.
	 * @param testModule
	 * @param startParameters
	 * @param loadApplPathForComponent
	 * @returns {sap.apf.Component}
	 */
	function createComponentLikeDSOAsPromise(testModule, startParameters, loadApplPathForComponent) {
		function createContent(component) {
			// Phase 1
			if (!loadApplPathForComponent) {
				loadApplPathForComponent = sapApfAppConfigPathDefault; // default path stubbed by  AJAX
			}
			component.getApi().loadApplicationConfig(loadApplPathForComponent);
			// Phase 2
			return sap.apf.Component.prototype.createContent.apply(component, arguments);
		}
		return createApplicationComponentWithStubbedApiAsPromise(testModule, createContent, startParameters, loadApplPathForComponent);
	}
	QUnit.module("Component creation -- tests the test setup ", {
		beforeEach : function() {
			this.spy = {};
			this.spy.assert = sinon.stub(console, "assert", consoleAssertReplacement);
			sap.apf.testhelper.stub.stubJQueryAjax();
			sap.apf.testhelper.ushellHelper.setup();
		},
		afterEach : function() {
			this.spy.assert.restore();
			sap.apf.testhelper.ushellHelper.teardown();
			jQuery.ajax.restore();
			if(sap.ui.getCore().byId('stepList')){
				sap.ui.getCore().byId('stepList').destroy();
			}
		}
	});
	QUnit.test("API is stubbed and probe transfers the  references", function(assert) {
		var done = assert.async();
		createComponentLikeDSOAsPromise(this).done(function(component) {
			assert.notStrictEqual(component.getProbeReferences(), undefined, "probe successfully created");
			assert.notStrictEqual(component.getProbeReferences().coreApi, undefined);
			assert.notStrictEqual(component.getProbeReferences().uiApi, undefined);
			assert.notStrictEqual(component.getProbeReferences().component, undefined);
			assert.notStrictEqual(component.getProbeReferences().serializationMediator, undefined);
			done();
		});
	});
	QUnit.test("load application configuration THEN with default. This test also proves that the stubbed API instance is constructed, not the default of apf.Component.init", function(assert) {
		assert.expect(1);
		var done = assert.async();
		createComponentLikeDSOAsPromise(this).done(function() {
			assert.equal(this.spyCoreApiLoadApplicationConfig.getCall(0).args[0], sapApfAppConfigPathDefault);
			done();
		}.bind(this));
	});
	QUnit.test("api instance is defined", function(assert) {
		assert.expect(1);
		var done = assert.async();
		createComponentLikeDSOAsPromise(this).done(function(component) {
			assert.ok(component.getApi() !== undefined, "Api successfully created");
			done();
		});
	});
	QUnit.module("Startup, test api without Component -- test locking against multiple execution. ", {
		beforeEach : function() {
			var that = this;
			this.spy = {};
			this.spy.assert = sinon.stub(console, "assert", consoleAssertReplacement);
			sap.apf.testhelper.stub.stubJQueryAjax();
			this.oReferences = null;
			var injectConstructors = {
				probe : function ApiProbe(references) {
					that.oReferences = references;
				}
			};
			this.getMetadata = function() {
				var Metadata = function() {
					this.getComponentName = function() {
						return "comp1";
					};
					this.getAllProperties = function() {
						return sap.apf.utils.createPromise([]);
					};
				};
				return new Metadata();
			};
			this.oApi = new sap.apf.Api(this, injectConstructors);
			// After new ... the references are set.
			this.spyLoadApplicationConfig = sinon.spy(this.oApi, "loadApplicationConfig");
			this.coreApiLoadSpy = sinon.spy(this.oReferences.coreApi, "loadApplicationConfig");
			this.AnalyticalConfigSpy = sinon.spy(this.oReferences.coreApi.getStartParameterFacade(), "getAnalyticalConfigurationId");
			this.layoutViewSpy = sinon.spy(this.oReferences.uiApi, "getLayoutView");
		},
		afterEach : function() {
			this.spy.assert.restore();
			jQuery.ajax.restore();
			this.oApi.loadApplicationConfig.restore();
			this.oReferences.coreApi.loadApplicationConfig.restore();
			this.AnalyticalConfigSpy.restore();
			this.layoutViewSpy.restore();
			this.spyLoadApplicationConfig.restore();
		}
	});
	QUnit.test("WHEN calling loadApplicationConfig twice THEN the second call is blocked", function(assert) {
		assert.expect(9);
		this.oApi.loadApplicationConfig(sapApfAppConfigPath);
		assert.equal(this.spyLoadApplicationConfig.callCount, 1, "loadApplicationConfig called on API");
		assert.equal(this.spyLoadApplicationConfig.getCall(0).args[0], sapApfAppConfigPath, "loadApplicationConfig has correct path");
		assert.equal(this.coreApiLoadSpy.callCount, 1, "loadApplicationConfig called on core API");
		assert.equal(this.coreApiLoadSpy.getCall(0).args[0], sapApfAppConfigPath, "loadApplicationConfig on coreApi has correct path");
		assert.equal(this.AnalyticalConfigSpy.callCount, 1, "by indirect method: loadApplicationConfig call by exited immediately");
		var callCount = this.spyLoadApplicationConfig.callCount;
		this.oApi.loadApplicationConfig(sapApfAppConfigPathOfComponent);
		assert.equal(this.spyLoadApplicationConfig.callCount, callCount + 1, "loadApplicationConfig called again on API");
		assert.equal(this.spyLoadApplicationConfig.getCall(callCount).args[0], sapApfAppConfigPathOfComponent, "loadApplicationConfig has correct path"); // callCount less 1 as array index.
		assert.equal(this.coreApiLoadSpy.callCount, callCount + 1, "loadApplicationConfig called again on core API");
		assert.equal(this.AnalyticalConfigSpy.callCount, callCount, "by indirect method: further call blocked");
	});
	QUnit.module("Component startup -- Forward Navigation", {
		beforeEach : function() {
			this.spy = {};
			this.spy.assert = sinon.stub(console, "assert", consoleAssertReplacement);
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			sap.apf.testhelper.stub.stubJQueryAjax();
			sap.apf.testhelper.ushellHelper.setup();
			function getAllProperties() {
				return sap.apf.utils.createPromise([]);
			}
			// this.spy.getAllProperties = sinon.stub(sap.apf.testhelper.doubles.Metadata.prototype, "getAllProperties", getAllProperties);
			sap.apf.testhelper.doubles.Metadata.prototype.getAllProperties = sinon.stub();
			sap.apf.testhelper.doubles.Metadata.prototype.getAllProperties.returns(getAllProperties());
			this.filterFromFacetFilterConfiguration = new sap.apf.core.utils.Filter(this.messageHandler, "CompanyCode", sap.apf.core.constants.FilterOperators.EQ, "1000");
		},
		addFilterToXappState : function() {
			this.xappStateFilter = new sap.apf.core.utils.Filter(this.messageHandler, "Customer", sap.apf.core.constants.FilterOperators.EQ, "SAP");
		},
		addSmartBusinessEvaluation : function() {
			this.filterFromSmartBusiness = new sap.apf.core.utils.Filter(this.messageHandler, "Smart", sap.apf.core.constants.FilterOperators.EQ, "Business");
		},
		afterEach : function() {
			this.spy.assert.restore();
			jQuery.ajax.restore();
			sap.apf.testhelper.doubles.Metadata.prototype.getAllProperties = undefined;
			sap.apf.testhelper.ushellHelper.teardown();
			if(sap.ui.getCore().byId('stepList')){
				sap.ui.getCore().byId('stepList').destroy();
			}
		}
	});
	QUnit.test("Consumption of filter from xapp-state", function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.addFilterToXappState();
		createComponentLikeDSOAsPromise(this).done(function(component) {
			var oApi = component.getApi();
			oApi.createStep("stepTemplate1", function() {
			});
			var spyFirstStepUpdate = sinon.spy(oApi.getSteps()[0], "update");
			oApi.updatePath(callbackUpdate.bind(this));
			function callbackUpdate() {
				assert.equal(spyFirstStepUpdate.getCall(0).args[0].toUrlParam(), this.xappStateFilter.toUrlParam(), "First step received filter from xapp-state");
				done();
			}
		}.bind(this));
	});
	QUnit.test("Consumption of filter from Facet Filter", function(assert) {
		assert.expect(1);
		var done = assert.async();
		createComponentLikeDSOAsPromise(this, undefined, sapApfAppConfigPathFacetFilter).done(function(component) {
			var oApi = component.getApi();
			oApi.createStep("stepTemplate1", function() {
			});
			var spyFirstStepUpdate = sinon.spy(oApi.getSteps()[0], "update");
			oApi.updatePath(callbackUpdate.bind(this));
			function callbackUpdate() {
				assert.equal(spyFirstStepUpdate.getCall(0).args[0].toUrlParam(), '((CompanyCode%20eq%20%271000%27))', "First step received filter from xapp-state and FacetFilter");
				done();
			}
		});
	});
	QUnit.test("Consumption of filter from SmartBusiness", function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.addSmartBusinessEvaluation();
		createComponentLikeDSOAsPromise(this, {
			evaluationId : "SmartBusiness"
		}).done(function(component) {
			var oApi = component.getApi();
			oApi.createStep("stepTemplate1", function() {
			});
			var spyFirstStepUpdate = sinon.spy(oApi.getSteps()[0], "update");
			oApi.updatePath(callbackUpdate.bind(this));
			function callbackUpdate() {
				assert.equal(spyFirstStepUpdate.getCall(0).args[0].toUrlParam(), this.filterFromSmartBusiness.toUrlParam(), "First step received filter from SmartBusiness");
				done();
			}
		}.bind(this));
	});
	QUnit.test("Consumption of filter from xapp-state, Facet Filter and SmartBusiness", function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.addFilterToXappState();
		this.addSmartBusinessEvaluation();
		var expectedFilter = new sap.apf.core.utils.Filter(this.messageHandler);
		expectedFilter.addAnd(this.filterFromSmartBusiness).addAnd(this.xappStateFilter).addAnd(this.filterFromFacetFilterConfiguration);
		createComponentLikeDSOAsPromise(this, {
			evaluationId : "SmartBusiness"
		}, sapApfAppConfigPathFacetFilter).done(
				function(component) {
					var oApi = component.getApi();
					oApi.createStep("stepTemplate1", function() {
					});
					var spyFirstStepUpdate = sinon.spy(oApi.getSteps()[0], "update");
					oApi.updatePath(callbackUpdate.bind(this));
					function callbackUpdate() {
						assert.equal(spyFirstStepUpdate.getCall(0).args[0].toUrlParam(), '(((Smart%20eq%20%27Business%27)%20and%20(Customer%20eq%20%27SAP%27))%20and%20(CompanyCode%20eq%20%271000%27))',
								"First step received filter from xapp-state, FacetFilter and SmartBusiness");
						done();
					}
				}.bind(this));
	});
	//   QUnit.module("Component startup -- Backward Navigation", {
	//        beforeEach: function(){
	//        	this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
	//
	//        	sap.apf.testhelper.stub.stubJQueryAjax();
	//            sap.apf.testhelper.ushellHelper.setup();
	//            
	//            sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
	//            sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew; //Ask Klaus
	//            
	//            this.fnRequest = sap.apf.core.Request;
	//            sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
	//            
	//            this.fnMetadata = sap.apf.core.Metadata;
	//            sap.apf.core.Metadata = sap.apf.testhelper.doubles.Metadata;
	//            
	//            this.hashChanger = sap.ui.core.routing.HashChanger;
	//        	sap.ui.core.routing.HashChanger = {
	//        			getInstance : function(){
	//        				return {
	//        					getHash : function(){
	//        						return "sap-iapp-state=123456ABcd";
	//        					}, 
	//        					replaceHash : function(){
	//        						return;
	//        					}
	//        				};
	//        			} 
	//        	};
	//        	
	//        	var iAppStateExpression = {
	//        			name: "FilterFromIappState",
	//        			operator: sap.apf.core.constants.FilterOperators.EQ,
	//        			value: "12345"
	//        	};
	//        	this.filterFromIappState = new sap.apf.utils.Filter(this.messageHandler);
	//        	this.filterFromIappState.getTopAnd().addExpression(iAppStateExpression);
	//        	
	//        	sap.ushell.sapApfState = {
	//        			path : {
	//        				steps : [],  
	//        				indicesOfActiveSteps : []
	//        			},        				
	//        			context : this.filterFromIappState.serialize()
	//        	};
	//        },
	//        afterEach: function(){
	//            jQuery.ajax.restore();
	//            sap.apf.testhelper.ushellHelper.teardown();
	//            sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
	//            sap.apf.core.Request = this.fnRequest;
	//            sap.apf.core.Metadata = this.fnMetadata;
	//            sap.ui.core.routing.HashChanger = this.hashChanger;
	//        }
	//    });
	//
	//    QUnit.test("Consumption of filter from iapp-state", function(assert){
	//    	assert.expect(1);
	//		  
	//		var component = createComponentLikeDSO(this);
	//		var oApi = component.getApi();
	//		
	//		oApi.createStep("stepTemplate1", function(){});
	//		var spyFirstStepUpdate = sinon.spy(oApi.getSteps()[0], "update");
	//	
	//		oApi.updatePath(callbackUpdate.bind(this));
	//		 
	//		function callbackUpdate(){
	//			assert.equal(spyFirstStepUpdate.getCall(0).args[0].toUrlParam(), this.filterFromIappState.getInternalFilter().toUrlParam(), "First step received filter from iapp-state");
	//		}
	//    });
	QUnit.module("Component startup -- sequence of operations", {
		beforeEach : function() {
			this.spy = {};
			this.spy.assert = sinon.stub(console, "assert", consoleAssertReplacement);
			sap.apf.testhelper.stub.stubJQueryAjax();
			sap.apf.testhelper.ushellHelper.setup();
		},
		afterEach : function() {

			this.spy.assert.restore();
			sap.apf.testhelper.ushellHelper.teardown();
			jQuery.ajax.restore();
			if(sap.ui.getCore().byId('stepList')){
				sap.ui.getCore().byId('stepList').destroy();
			}
		}
	});
	QUnit.test("WHEN calling createApplicationLayout twice THEN the second call is blocked", function(assert) {
		assert.expect(4);
		var done = assert.async();
		createComponentLikeDSOAsPromise(this, {
			'sap-apf-app-config-path' : [ sapApfAppConfigPath ]
		}, sapApfAppConfigPathOfComponent).done(function(component) {
			var oApi = component.getApi();
			assert.equal(this.spyUiCreateApplicationLayout.called, true, "called by createContent / startApf");
				assert.equal(this.spyGetLayoutView.callCount, 3, "called by createContent and handleStartUp in Ui instance");
			var layout2 = oApi.createApplicationLayout();
			assert.equal(this.spyGetLayoutView.callCount, 3, "test objective");
			assert.notStrictEqual(layout2, undefined, "layout already created by very first call of createApplicationLayout is simply returned");
			done();
		}.bind(this));
	});
	QUnit.test("WHEN creating DSO like Component with startParameter THEN loadApplicationConfig comes first", function(assert) {
		assert.expect(2);
		var done = assert.async();
		createComponentLikeDSOAsPromise(this, {
			'sap-apf-app-config-path' : [ sapApfAppConfigPath ]
		}, sapApfAppConfigPathOfComponent).done(function() {
			assert.ok(this.spyUiCreateApplicationLayout.calledAfter(this.spyCoreApiLoadApplicationConfig), "LoadApplicationConfig shall always exec before CreateApplicationLayout ");
			assert.ok(this.spyUiHandleStartup.calledAfter(this.spyCoreApiLoadApplicationConfig), "LoadApplicationConfig shall always exec before uiInstance.handleStartup ");
			done();
		}.bind(this));
	});
	QUnit.test("WHEN creating DSO like Component without startParameter THEN loadApplicationConfig comes first (same sequence as with startParam)", function(assert) {
		assert.expect(2);
		var done = assert.async();
		createComponentLikeDSOAsPromise(this).done(function() {
			assert.ok(this.spyUiCreateApplicationLayout.calledAfter(this.spyCoreApiLoadApplicationConfig), "LoadApplicationConfig shall always exec before CreateApplicationLayout ");
			assert.ok(this.spyUiHandleStartup.calledAfter(this.spyCoreApiLoadApplicationConfig), "LoadApplicationConfig shall always exec before uiInstance.handleStartup ");
			done();
		}.bind(this));
	});
	QUnit.test("WHEN creating DSO like Component with a start parameter THEN loadApplicationConfig is called with that start parameter", function(assert) {
		assert.expect(2);
		var done = assert.async();
		createComponentLikeDSOAsPromise(this, {
			'sap-apf-app-config-path' : [ sapApfAppConfigPath ]
		}, sapApfAppConfigPathOfComponent).done(function() {
			assert.equal(this.spyCoreApiLoadApplicationConfig.getCall(0).args[0], sapApfAppConfigPath, "load config on start param runs first");
			assert.equal(this.spyCoreApiLoadApplicationConfig.getCall(1).args[0], sapApfAppConfigPathOfComponent, "load config of appl component runs second");
			done();
		}.bind(this));
	});
	QUnit.test("WHEN creating DSO like Component without start parameter THEN the loadApplicationConfig of the application Component is called", function(assert) {
		assert.expect(2);
		var done = assert.async();
		createComponentLikeDSOAsPromise(this, undefined, sapApfAppConfigPathOfComponent).done(function() {
			assert.equal(this.spyCoreApiLoadApplicationConfig.getCall(0).args[0], sapApfAppConfigPathOfComponent, "WHEN no start parameter THEN component path must be taken");
			assert.ok(this.spyCoreApiLoadApplicationConfig.callCount >= 1, "further call (but blocked, see prior tests above)");
			done();
		}.bind(this));
	});
	QUnit.test("handleStartup receives navigationMode forward via promise", function(assert) {
		assert.expect(1);
		var done = assert.async();
		createComponentLikeDSOAsPromise(this).done(function() {
			this.spyUiHandleStartup.getCall(0).args[0].done(function(mode) {
				assert.ok(mode.navigationMode === 'forward', "navigation mode is forward");
			});
			done();
		}.bind(this));
	});
	QUnit.test("Navigation handler checkMode is called during startup", function(assert) {
		assert.expect(1);
		var done = assert.async();
		createComponentLikeDSOAsPromise(this).done(function() {
			assert.ok(this.spyNavigationHandlerCheckMode.calledOnce, "Method is called");
			done();
		}.bind(this));
	});
}());
