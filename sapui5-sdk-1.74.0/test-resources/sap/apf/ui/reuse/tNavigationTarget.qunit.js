//BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfUiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerStubbedAjax");
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.require('sap.apf.utils.navigationHandler');
jQuery.sap.require('sap.apf.utils.utils');
(function() {
	"use strict";
	function doNothing() {
	}
	QUnit.module("Navigation target unit tests", {
		beforeEach : function(assert) {
			var self = this;
			sap.apf.integration.withDoubles.helper.saveConstructors();
			var done = assert.async();
			var ResourcePathHandlerStubbed = function(inject){
				sap.apf.core.ResourcePathHandler.call(this, inject);
				this.getConfigurationProperties = function() {
					var appConfig = {
							appName : "sap-working-capital-analysis"
					};
					return sap.apf.utils.createPromise(appConfig);
				};
			};
			var inject = {
					constructors : {
						SessionHandler : sap.apf.testhelper.doubles.SessionHandlerStubbedAjax,
						ResourcePathHandler : ResourcePathHandlerStubbed
					}
			};
			sap.apf.testhelper.doubles.createUiApiAsPromise(undefined, undefined, inject).done(function(api){
				self.oGlobalApi = api;
				self.navTargetsWithoutStepSpecific = {
						global : [ {
							id : "NavigationTarget-1",
							semanticObject : "FioriApplication",
							action : "analyzeKPIDetails",
							text : "Analyze KPI Details"
						}, {
							id : "NavigationTarget-2",
							semanticObject : "APFI2ANav",
							action : "launchNavTarget",
							text : "Detailed Analysis"
						} ],
						stepSpecific : []
				};
				self.navTargetsWithoutStepSpecificAndCustomisedTitle = {
						global : [ {
							id : "NavigationTarget-2",
							semanticObject : "FioriApplication",
							action : "analyzeKPIDetails",
							text : "Analyze KPI Details",
							title : {
								key : "14948378644464830936530713146940",
								kind : "text",
								type : "label"
							}
						}],
						stepSpecific : []
				};
				self.navTargetsWithStepSpecific = {
						global : [ {
							id : "NavigationTarget-1",
							semanticObject : "FioriApplication",
							action : "analyzeKPIDetails",
							text : "Analyze KPI Details"
						}, {
							id : "NavigationTarget-2",
							semanticObject : "APFI2ANav",
							action : "launchNavTarget",
							text : "Detailed Analysis"
						} ],
						stepSpecific : [ {
							id : "NavigationTarget-3",
							semanticObject : "FioriApplication",
							action : "analyzeKPIDetails",
							text : "Analyze KPI Details"
						}, {
							id : "NavigationTarget-4",
							semanticObject : "APFI2ANav",
							action : "launchNavTarget",
							text : "Detailed Analysis"
						} ]
				};
				var stubGetTextEncoded = function(x) {
					return x;
				};
				
				var stubGetNotificationBar = function() {
					var layout = new sap.ui.layout.VerticalLayout();
					layout.getController = function() {
						return {
							showMessage : doNothing
						};
					};
					return layout;
				};
				var stubStepContainer = function() {
					return new sap.ui.layout.VerticalLayout();
				};
				var stubAnalysisPath = function() {
					return new sap.ui.layout.VerticalLayout();
				};
				
				sinon.stub(self.oGlobalApi.oCoreApi, 'getTextNotHtmlEncoded', stubGetTextEncoded);
				sinon.stub(self.oGlobalApi.oUiApi, 'getNotificationBar', stubGetNotificationBar);
				sinon.stub(self.oGlobalApi.oUiApi, 'getStepContainer', stubStepContainer);
				sinon.stub(self.oGlobalApi.oUiApi, 'getAnalysisPath', stubAnalysisPath);
				var getNavigationTargetsStub = new sinon.stub();
				var oDeferredFirstCall = new jQuery.Deferred();
				oDeferredFirstCall.resolve(self.navTargetsWithoutStepSpecific);
				var oDeferredSecondCall = new jQuery.Deferred();
				oDeferredSecondCall.resolve(self.navTargetsWithStepSpecific);
				var oDeferredThirdCall = new jQuery.Deferred();
				oDeferredThirdCall.resolve(self.navTargetsWithoutStepSpecificAndCustomisedTitle);
				getNavigationTargetsStub.onFirstCall().returns(oDeferredFirstCall.promise());
				getNavigationTargetsStub.onSecondCall().returns(oDeferredSecondCall.promise());
				getNavigationTargetsStub.onThirdCall().returns(oDeferredThirdCall.promise());
				self.layoutView = self.oGlobalApi.oUiApi.getLayoutView();
				self.layoutController = self.layoutView.getController();
				self.oNavigationHandler = self.layoutView.getViewData().oNavigationHandler;
				self.oNavigationHandler.getNavigationTargets = getNavigationTargetsStub;
				self.selectedNavTarget = "";
				self.navigateToAppSpy = function(selectedNavTarget) {
					self.selectedNavTarget = selectedNavTarget;
				};
				self.spyNavigateToApp = sinon.spy(self.navigateToAppSpy);
				sinon.stub(self.oNavigationHandler, "navigateToApp", self.spyNavigateToApp);
				done();
			});

		},
		afterEach : function() {
			this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
			this.oGlobalApi.oUiApi.getNotificationBar.restore();
			this.oGlobalApi.oUiApi.getStepContainer.restore();
			this.oGlobalApi.oUiApi.getAnalysisPath.restore();
			this.oNavigationHandler.navigateToApp.restore();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("Populate open in popover and navigate", function(assert) {
		//Global navigation target test
		this.layoutController.openInBtn.firePress();
		assert.deepEqual(this.layoutController.oNavListPopover.getContent()[0].getModel().getData().navTargets, this.navTargetsWithoutStepSpecific.global, "Open in pop over is populated with global navigation target actions");
		this.layoutController.oNavListPopover.getContent()[0].getItems()[0].firePress();
		assert.equal(this.selectedNavTarget, "NavigationTarget-1", "Global Navigation target is selected from the open in popover");
		assert.ok(this.spyNavigateToApp.called === true, "Navigated to selected global navigation target");
		//Step specific target test
		this.layoutController.openInBtn.firePress();
		var stepSpecificList = this.layoutController.oNavListPopover.getContent()[0].getModel().getData().navTargets;
		var globalList = this.layoutController.oNavListPopover.getContent()[2].getModel().getData().navTargets;
		var list = {
				global : globalList,
				stepSpecific : stepSpecificList
		};
		assert.deepEqual(list, this.navTargetsWithStepSpecific, "Open in pop over is populated with step specific and global navigation target actions");
		this.layoutController.oNavListPopover.getContent()[0].getItems()[0].firePress();
		assert.equal(this.selectedNavTarget, "NavigationTarget-3", "Step specific Navigation target is selected from the open in popover");
		assert.ok(this.spyNavigateToApp.called === true, "Navigated to selected step specific navigation target");
		//global navigation target with user defined title
		this.layoutController.openInBtn.firePress();
		var globalListWithCustomTitle = this.layoutController.oNavListPopover.getContent()[0].getModel().getData().navTargets;
		var listWithCustomTitle = {
				global : globalListWithCustomTitle,
				stepSpecific : []
		};
		this.layoutController.oNavListPopover.getContent()[0].getItems()[0].firePress();
		assert.equal(this.selectedNavTarget, "NavigationTarget-2", "Global Navigation target is selected from the open in popover");
		assert.deepEqual(listWithCustomTitle, this.navTargetsWithoutStepSpecificAndCustomisedTitle, "Open in pop over is populated with step specific and global navigation target actions with user defined title");
	});
}());