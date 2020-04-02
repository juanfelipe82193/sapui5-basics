/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare('sap.apf.ui.reuse.tSmartFilterBar');
jQuery.sap.require('sap.ui.comp.smartfilterbar.SmartFilterBar');
jQuery.sap.require("sap.ui.core.util.MockServer");
jQuery.sap.require('sap.apf.testhelper.createComponentAsPromise');
// FIXME timeout when faketimers === false (using sinon.qunit) in "When smart filter bar view is loaded AND sap-system is set"
(function() {
	'use strict';
	function _returnPersistenceKey() {
		return "testSFB";
	}
	function _doNothing() {
	}
	function _createCommonSetup(oSmartFilterBarConfiguration, stubs, context) {
		var oUiApi;
		var deferred = jQuery.Deferred();
		sap.apf.testhelper.createComponentAsPromise(context, { stubAjaxForResourcePaths : true }).done(function(){
			//setup for mock server to instantiate OData model for SFB
			context.oMockServer = new sap.ui.core.util.MockServer({
				rootUri : "/foo/"
			});
			var sUrl = "../../testhelper/mockServer/metadata/smartFilterBar.xml";
			context.oMockServer.simulate(sUrl, {
				'sMockdataBaseUrl' : "../../testhelper/mockServer/metadata/",
				'bGenerateMissingMockData' : true
			});
			context.oMockServerWithSapSystem = new sap.ui.core.util.MockServer({
				rootUri : "/foo;o=myERP/"
			});

			context.oMockServerWithSapSystem.simulate(sUrl, {
				'sMockdataBaseUrl' : "../../testhelper/mockServer/metadata/",
				'bGenerateMissingMockData' : true
			});
			var oViewData = {};
			//oCoreApi stub
			context.oCoreApi = {
					getSmartFilterBarPersistenceKey : _returnPersistenceKey,
					getAnnotationsForService : _doNothing,
					getNavigationTargets: _doNothing,
					registerSmartFilterBarInstance : _doNothing,
					createMessageObject : stubs && stubs.createMessageObjectStub || sinon.spy(),
					putMessage : _doNothing,
					getMetadata: function(){
						return jQuery.Deferred().resolve({
							getAllEntitySetsExceptParameterEntitySets: function(){
								return ["testEntitySet"];
							}
						});
					},
					getActiveStep: stubs && stubs.getActiveStep || function(){
						return "ActiveStep";
					},
					getStartParameterFacade : function() {
						return {
							getSapSystem : function() { return (context && context.expectedSapSystem) || undefined; },
							getAnalyticalConfigurationId : function() { return undefined} ,
							getXappStateId : function() { return undefined}
						};
					}
			};
			//oUiApi stub
			oUiApi = {
					selectionChanged : sinon.spy(),
					getAddAnalysisStepButton: function(){
						return {
							rerender: function(){
								context.addAnalysisStepButtonRerendered = true;
							},
							setEnabled: function(bool){
								context.addAnalysisStepButtonEnabled = bool;
							}
						};
					}
			};
			context.oMockServer.start();
			if (context && context.expectedSapSystem) {
				context.oMockServerWithSapSystem.start();
			}
			oViewData.oSmartFilterBarConfiguration = oSmartFilterBarConfiguration;
			oViewData.oCoreApi = context.oCoreApi;
			oViewData.oUiApi = oUiApi;
			context.spyOnGetSFBPersistenceKey = sinon.spy(context.oCoreApi, "getSmartFilterBarPersistenceKey");
			context.spyOnGetAnnotationsForService = sinon.spy(context.oCoreApi, "getAnnotationsForService");
			context.spyOnRegisterSmartFilterBarInstance = sinon.spy(context.oCoreApi, "registerSmartFilterBarInstance");
			context.oSmartFilterBarView = sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.smartFilterBar",
				type : sap.ui.core.mvc.ViewType.JS,
				viewData : oViewData
			});
			context.oApi.createApplicationLayout().getPages()[0].addContent(context.oSmartFilterBarView);
			deferred.resolve();
		});
		return deferred;
	}
	function _commonTeardown(context) {
		if(context.oSmartFilterBarView){
			context.oSmartFilterBarView.destroy();
		}
		if(context.oMockServer){
			context.oMockServer.stop();
		}
		if (context && context.expectedSapSystem && context.oMockServerWithSapSystem) {
			context.oMockServerWithSapSystem.stop();
		}
		if(sap.ui.getCore().byId("stepList")){
			sap.ui.getCore().byId("stepList").destroy(); // created by Carousel
		}
	}
	QUnit.module("Smart Filter Bar Tests", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			this.activeStep = "ActiveStep";
			var oSmartFilterBarConfiguration = {
				"type" : "smartFilterBar",
				"id" : "SmartFilterBar-1",
				"service" : "/foo",
				"entitySet" : "testEntitySet"
			};
			_createCommonSetup(oSmartFilterBarConfiguration, {
				getActiveStep: function(){
					return that.activeStep;
				}
			}, this).done(function(){
				var oSmartFilterBar = that.oSmartFilterBarView.byId("idAPFSmartFilterBar");
				oSmartFilterBar.attachInitialized(function() {
					done();
				});
			});
		},
		afterEach : function() {
			_commonTeardown(this);
		}
	});
	QUnit.test("When smart filter bar view is loaded", function(assert) {
		//arrange
		var oSmartFilterBar = this.oSmartFilterBarView.byId("idAPFSmartFilterBar");
		//assert
		assert.ok(oSmartFilterBar, "then smart filter bar view is created");
		assert.strictEqual(oSmartFilterBar.getModel().sServiceUrl, "/foo", "then oData model is created with service URL as /foo");
		assert.strictEqual(oSmartFilterBar.getEntitySet(), "testEntitySet", "then entity is set as wrongEntitySet");
		assert.strictEqual(oSmartFilterBar.getLiveMode(), true, "LiveMode enabled");
		assert.strictEqual(oSmartFilterBar.getUseDateRangeType(), true, "DateRangeType enabled");
		assert.strictEqual(this.spyOnGetSFBPersistenceKey.calledWith("SmartFilterBar-1"), true, "then persistence key is retrieved");
		assert.strictEqual(this.spyOnGetAnnotationsForService.calledWith("/foo"), true, "then annotations for service is retrieved");
		assert.strictEqual(this.oCoreApi.createMessageObject.called, false, "No Message created");
		assert.strictEqual(this.spyOnRegisterSmartFilterBarInstance.calledWith(oSmartFilterBar), true, "then smart filter bar is registered with core");
		assert.strictEqual(oSmartFilterBar.getConsiderAnalyticalParameters(), true, "THEN the switch considerAnalyticalParameters is activated");
		assert.strictEqual(oSmartFilterBar.getModel() instanceof sap.ui.model.odata.v2.ODataModel, true, "THEN model instance of v2 odata model");
		assert.strictEqual(oSmartFilterBar.getModel().getDefaultCountMode(), sap.ui.model.odata.CountMode.None, "THEN expected count mode");
	});
	QUnit.test("When smart filter Search is triggered after path update", function(assert) {
		//arrange
		var oSmartFilterBar = this.oSmartFilterBarView.byId("idAPFSmartFilterBar");
		oSmartFilterBar._apfOpenPath = true;
		//action
		oSmartFilterBar.fireSearch();
		//assert
		assert.strictEqual(this.oCoreApi.createMessageObject.called, false, "No Message created");
		assert.strictEqual(this.oSmartFilterBarView.getViewData().oUiApi.selectionChanged.callCount, 0, "selection changed event is not triggered with first search event");
		//action
		oSmartFilterBar.fireSearch();
		//assert
		assert.strictEqual(this.oCoreApi.createMessageObject.called, false, "No Message created");
		assert.strictEqual(this.oSmartFilterBarView.getViewData().oUiApi.selectionChanged.callCount, 1, "then selectionChanged event is now triggered with next search event");
	});
	QUnit.test("When smart filter Search is triggered", function(assert) {
		//arrange
		var oSmartFilterBar = this.oSmartFilterBarView.byId("idAPFSmartFilterBar");
		//action
		oSmartFilterBar.fireSearch();
		//assert
		assert.strictEqual(this.oCoreApi.createMessageObject.called, false, "No Message created");
		assert.ok(this.oSmartFilterBarView.getViewData().oUiApi.selectionChanged.calledOnce, "then selectionChanged event is triggered");
	});
	QUnit.test("When smart filter Search is triggered without active step", function(assert) {
		this.activeStep = undefined;
		//arrange
		var oSmartFilterBar = this.oSmartFilterBarView.byId("idAPFSmartFilterBar");
		//action
		oSmartFilterBar.fireSearch();
		//assert
		assert.strictEqual(this.oCoreApi.createMessageObject.called, false, "No Message created");
		assert.strictEqual(this.oSmartFilterBarView.getViewData().oUiApi.selectionChanged.called, false, "then selectionChanged event is not triggered");
	});
	QUnit.test("When smartFilterBar has not filled mandatory fields", function(assert){
		//arrange
		var oSmartFilterBar = this.oSmartFilterBarView.byId("idAPFSmartFilterBar");
		// Company filter is initially missing
		assert.strictEqual(this.addAnalysisStepButtonEnabled, false, "AddAnalysisStepButton is disabled");
		assert.strictEqual(this.addAnalysisStepButtonRerendered, true, "AddAnalysisStepButton is rerendered");
		delete this.addAnalysisStepButtonRerendered;
		//action add Company as Filter
		oSmartFilterBar.setFilterData({
			Company:{
				items: [{
					key: "CompanyA",
					text: "Company A"
				}]
			}
		});
		//assert
		assert.strictEqual(this.addAnalysisStepButtonEnabled, true, "AddAnalysisStepButton is enabled");
		assert.strictEqual(this.addAnalysisStepButtonRerendered, true, "AddAnalysisStepButton is rerendered");
		// action remove Company again
		oSmartFilterBar.setFilterData({
			Company:{
				items: []
			}
		});
		//assert
		assert.strictEqual(this.addAnalysisStepButtonEnabled, true, "AddAnalysisStepButton is enabled");
		assert.strictEqual(this.addAnalysisStepButtonRerendered, true, "AddAnalysisStepButton is rerendered");
	});
	QUnit.module("Smart Filter Bar with sap-system", {
		afterEach : function() {
			_commonTeardown(this);
		}
	});
	QUnit.test("When smart filter bar view is loaded AND sap-system is set", function(assert) {
		var context = this;
		assert.expect(1);
		var done = assert.async();
		this.activeStep = "ActiveStep";
		this.expectedSapSystem = "myERP";
	
		var oSmartFilterBarConfiguration = {
			"type" : "smartFilterBar",
			"id" : "SmartFilterBar-1",
			"service" : "/foo",
			"entitySet" : "testEntitySet"
		};

		_createCommonSetup(oSmartFilterBarConfiguration, {
			getActiveStep: function(){
				return context.activeStep;
			}
		}, this).done(function(){
			var oSmartFilterBar = context.oSmartFilterBarView.byId("idAPFSmartFilterBar");
			//assert
			oSmartFilterBar.attachInitialized(function(){
				assert.strictEqual(oSmartFilterBar.getModel().sServiceUrl, "/foo;o=myERP", "then oData model is created with service URL as /foo");
				done();
			});
		});
	});
	QUnit.module("Smart Filter Bar, Given non-existing service, thus no metadata", {
		afterEach : function() {
			_commonTeardown(this);
		}
	});
	QUnit.test("When smart filter bar is created AND service metadata access fails", function(assert) {
		var context = this;
		var done = assert.async();
		//arrange
		var oSmartFilterBarConfiguration = {
				"type" : "smartFilterBar",
				"id" : "SmartFilterBar-1",
				"service" : "/serviceNotExisting",
				"entitySet" : "testEntitySet"
		};
		_createCommonSetup(oSmartFilterBarConfiguration, {
			createMessageObjectStub : function(messageObject){
				var oSmartFilterBar = context.oSmartFilterBarView.byId("idAPFSmartFilterBar");
				assert.ok(oSmartFilterBar, "then smart filter bar view is created");
				assert.strictEqual(oSmartFilterBar.getModel(), undefined, "then no oDataModel is set to the SmartFilterBar");
				assert.deepEqual(messageObject, {
					code : "5052",
					aParameters : [ oSmartFilterBarConfiguration.service ]
				}, "Correct MessageObject created");
				done();
			}
		}, this);
	});
	QUnit.module("Smart Filter Bar Tests, Given service where some entity type does not exist in metadata", {
		beforeEach : function(assert) {
			var done = assert.async();
			var oSmartFilterBarConfiguration = {
					"type" : "smartFilterBar",
					"id" : "SmartFilterBar-1",
					"service" : "/foo",
					"entitySet" : "wrongEntitySet"
			};
			_createCommonSetup(oSmartFilterBarConfiguration, {}, this).done(function(){
				done();
			});
		},
		afterEach : function() {
			_commonTeardown(this);
		}
	});
	QUnit.test("WHEN Entity type does not exist", function(assert) {
		//arrange
		var oSmartFilterBar = this.oSmartFilterBarView.byId("idAPFSmartFilterBar");
		//assert
		assert.ok(oSmartFilterBar, "then smart filter bar view is created");
		oSmartFilterBar.attachInitialized(function() {
			assert.strictEqual(oSmartFilterBar.getModel().sServiceUrl, "/foo", "then oData model is created with service URL as /foo");
			assert.strictEqual(oSmartFilterBar.getEntitySet(), "wrongEntitySet", "then entity is set as wrongEntitySet");
			assert.strictEqual(this.oCoreApi.createMessageObject.calledWith({
				code : "5053",
				aParameters : [ "wrongEntitySet", "/foo" ]
			}), true, "then initialization failed");
		});
	});
}());
