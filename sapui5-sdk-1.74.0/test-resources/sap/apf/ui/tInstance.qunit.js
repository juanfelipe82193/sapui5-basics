(function() {
	'use strict';
	jQuery.sap.declare('test.sap.apf.ui.tInstance');
	jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
	jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
	jQuery.sap.require('sap.apf.testhelper.doubles.navigationHandler');
	jQuery.sap.require("sap.apf.testhelper.helper");
	jQuery.sap.require('sap.apf.ui.instance');
	jQuery.sap.require("sap.m.MessageView");
	var oGlobalApi, oUiApi;
	/**
	 * @function
	 * @name sap.apf.ui.tInstance#doNothing
	 * @description Dummy function for stubbing unused methods
	 * */
	function doNothing() {
	}

	function createDummyView() {
		var dummyView = new sap.m.MessageView("idAPFSmartFilterBar");
		dummyView.byId = function() {
			return dummyView;
		};
		return dummyView;
	}
	// Function Needed for  "Facet Filter function Call Test"  Starts here....
	function getLabelForStartDate() {
		return {
			"type" : "label",
			"kind" : "text",
			"key" : "StartDate"
		};
	}
	function getPropertyNameForStartDate() {
		return "StartDate";
	}
	function getMultiSelectionForStartDate() {
		return false;
	}
	function getMetadataForStartDate() {
		var oDeferredMetadata = jQuery.Deferred();
		var oPropertyMetadata = {
			"name" : "StartDate",
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "8"
			},
			"label" : "Start Date",
			"aggregation-role" : "dimension",
			"isCalendarDate" : "true"
		};
		oDeferredMetadata.resolve(oPropertyMetadata);
		return oDeferredMetadata.promise();
	}
	function getValuesForStartDate() {
		var oDeferredValues = jQuery.Deferred();
		var aFilterValues = [ {
			"StartDate" : "20000101"
		}, {
			"StartDate" : "20000201"
		} ];
		var oNewPromiseForStartDateValues = jQuery.Deferred();
		oDeferredValues.resolve(aFilterValues, oNewPromiseForStartDateValues.promise());
		return oDeferredValues.promise();
	}
	function getTextEncodedStub(x) {
		return x;
	}
	/**
	 * @function
	 * @name sap.apf.ui.tInstance#getApplicationConfigPropertiesStub
	 * @description Stub for getApplicationConfigProperties
	 * @return appName
	 */
	function getApplicationConfigPropertiesStub() {
		return sap.apf.utils.createPromise({
			appName : "sap-working-capital-analysis"
		});
	}
	function getStartParameterFacadeStub() {
		return {
			getSteps : function() {
				var arr = [];
				arr.push("step1");
				return arr;
			}
		};
	}
	function getConfigurationFilter(bIsVisible) {
		var arr = [];
		var getSelectedValuesStubStartDate = sinon.stub();
		var oDeferredSelectedValuesStartDate = jQuery.Deferred();
		var aSelectedFilterValuesStartDate = [ "20000201" ];
		var oNewPromiseForStartDateSelectedValues = jQuery.Deferred();
		oDeferredSelectedValuesStartDate.resolve(aSelectedFilterValuesStartDate, oNewPromiseForStartDateSelectedValues.promise());
		//Different values returned based on the call count
		getSelectedValuesStubStartDate.onCall(0).returns(oDeferredSelectedValuesStartDate.promise());
		var obj = {
			isVisible : function() {
				return bIsVisible;
			},
			getLabel : getLabelForStartDate,
			getPropertyName : getPropertyNameForStartDate,
			isMultiSelection : getMultiSelectionForStartDate,
			getAliasNameIfExistsElsePropertyName : doNothing,
			getMetadata : getMetadataForStartDate,
			getValues : getValuesForStartDate,
			getSelectedValues : getSelectedValuesStubStartDate,
			setSelectedValues : doNothing,
			hasValueHelpRequest : function () {return true;}
		};
		arr.push(obj);
		return arr;
	}
	function _placeSubHeaderWithFilterAtDom(oSubHeaderWithFilter) {
		var divToPlaceTable = document.createElement("div");
		divToPlaceTable.setAttribute('id', 'contentOfFilter');
		document.body.appendChild(divToPlaceTable);
		oSubHeaderWithFilter.placeAt("contentOfFilter");
		sap.ui.getCore().applyChanges();
	}
	QUnit.module('UI API Tests', {
		beforeEach : function(assert) {
			var done = assert.async();
			var inject = {
				beforeStartupCallback : function() {
					sinon.stub(this.getProbe().coreApi, 'getTextNotHtmlEncoded', getTextEncodedStub);
					sinon.stub(this.getProbe().coreApi, 'getApplicationConfigProperties', getApplicationConfigPropertiesStub);
				},
				constructors : {
					NavigationHandler : sap.apf.testhelper.doubles.NavigationHandler
				},
				exits : {}
			};
			sap.apf.testhelper.doubles.createUiApiAsPromise(undefined, undefined, inject).done(function(api) {
				oGlobalApi = api;
				oUiApi = oGlobalApi.oUiApi;
				done();
			});
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			oGlobalApi.oCoreApi.getApplicationConfigProperties.restore();
			oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
			if (sap.ui.view.restore) {
				sap.ui.view.restore();
			}
		}
	});
	QUnit.test('When adding control in detailFooter', function(assert) {
		//arrangements
		var layout = oUiApi.getLayoutView();
		var oLabel = new sap.m.Label({
			text : "Label 1"
		});
		//action
		oUiApi.addDetailFooterContent(oLabel);
		var checkContentLeft = layout.byId("detailFooter").getContentLeft()[0];
		//assert
		assert.strictEqual(checkContentLeft, oLabel, "Then the control has loaded successfully");
	});
	QUnit.test('When adding control in MasterFooterContentRight', function(assert) {
		//arrangements
		var layout = oUiApi.getLayoutView();
		var oLabel = new sap.m.Label({
			text : "Label 1"
		});
		//action
		oUiApi.addMasterFooterContentRight(oLabel);
		var checkContentRight = layout.byId("masterFooter").getContentRight()[0];
		//assert
		assert.strictEqual(checkContentRight, oLabel, "Then the control has loaded successfully");
	});
	QUnit.test('When invoking  event callbacks', function(assert) {
		//action
		oUiApi.setEventCallback(sap.apf.core.constants.eventTypes.contextChanged, doNothing);
		var eventval = oUiApi.getEventCallback(sap.apf.core.constants.eventTypes.contextChanged);
		//assert
		assert.strictEqual(eventval, doNothing, "Then got the event callback successsfully");
	});
	QUnit.test('When  recreating application layout', function(assert) {
		//arrangements
		var done = assert.async();
		var spyLayoutView = sinon.spy(oUiApi, 'getLayoutView');
		//action
		oUiApi.createApplicationLayout().then(function(appname) {
			//assert
			assert.ok(appname instanceof sap.m.App, "Then application created successfully");
			assert.strictEqual(spyLayoutView.called, false, "Then the layout is not recreated again");
			done();
		});
	});
	QUnit.test('When calling destroy function', function(assert) {
		//arrangements
		var printHelper = oUiApi.getAnalysisPath().getToolbar().getController();
		var carousel = oUiApi.getAnalysisPath().getCarouselView();
		var stepContainer = oUiApi.stepContainer;
		var notificationBar = oUiApi.messageHandler;
		var layout = oUiApi.applicationLayout;
		var oFacetFilter = oUiApi.oFacetFilterView;
		var toolbarController = oUiApi.getAnalysisPath().getToolbar().getController();
		var stepGalleryController = oUiApi.getAnalysisPath().getCarouselView().getStepGallery().getController();
		var setpContainerController = oUiApi.getStepContainer().getController();
		//action
		oUiApi.destroy();
		//assert
		assert.strictEqual(printHelper.oPrintHelper, undefined, "Then oPrintHelper is destroyed");
		assert.strictEqual(stepContainer, undefined, "Then step container is destroyed");
		assert.strictEqual(notificationBar, undefined, "Then notification bar is destroyed");
		assert.strictEqual(layout, undefined, "Then application layout is destroyed");
		assert.strictEqual(oFacetFilter, undefined, "Then facetFilter is destroyed");
		assert.strictEqual(toolbarController.saveDialog, undefined, "Then saveDialog is destroyed");
		assert.strictEqual(toolbarController.newOpenDilog, undefined, "Then OpenDialog is destroyed");
		assert.strictEqual(toolbarController.newDialog, undefined, "Then NewDialog is destroyed");
		assert.strictEqual(toolbarController.delConfirmDialog, undefined, "Then DeleteConfirmationDialog is destroyed");
		assert.strictEqual(toolbarController.confirmDialog, undefined, "Then ConfirmationDialog is destroyed");
		assert.strictEqual(toolbarController.confrimLogoffDialog, undefined, "Then LogOffDialog is destroyed");
		assert.strictEqual(toolbarController.noPathAddedDialog, undefined, "Then NoPathAddedDialog is destroyed");
		assert.strictEqual(stepGalleryController.oHierchicalSelectDialog, undefined, "Then HierchicalDialog is destroyed");
		assert.strictEqual(setpContainerController.selectionDisplayDialog, undefined, "Then SelectionDialog is destroyed");
	});
	QUnit.test("WHEN calling handleStartup with old smart filter bar configuration - entity type defined", function(assert){
		var done = assert.async();
		assert.expect(2);
		function getSmartFilterBarConfigurationAsPromiseStub() {
			var config = {
					service : "/some/url",
					entityType : "entityType21"
			};
			return sap.apf.utils.createPromise(config);
		}

		function getMetadataStub(serviceUrl) {
			var metadata = {
					getEntitySetByEntityType : function(entityType) {
						assert.equal(entityType, "entityType21", "THEN metadata correctly handed over");
						return "entitySet21";
					}
			};
			return sap.apf.utils.createPromise(metadata);
		}

		function viewStub(configuration) {
			var expectedSmartFilterBarConfiguration = {
				service : "/some/url",
				entitySet : "entitySet21"
			};
			assert.deepEqual( configuration.viewData.oSmartFilterBarConfiguration, expectedSmartFilterBarConfiguration, "THEN filter configuration correctly handed over");
			var dummy = createDummyView();
			if (configuration.async) {
				return {
					loaded : function() {
						return Promise.resolve(dummy);
					}
				};
			}
			return dummy;
		}

		function prepareStubs() {
			sinon.stub(oGlobalApi.oCoreApi, "getMetadata", getMetadataStub);
			sinon.stub(oGlobalApi.oCoreApi, "getSmartFilterBarConfigurationAsPromise", getSmartFilterBarConfigurationAsPromiseStub);
			sinon.stub(sap.ui, "view", viewStub);
		}

		function restoreStubs() {
			oGlobalApi.oCoreApi.getMetadata.restore();
			oGlobalApi.oCoreApi.getSmartFilterBarConfigurationAsPromise.restore();
			sap.ui.view.restore();
		}

		prepareStubs();
		var startupPromise = sap.apf.utils.createPromise({ navigationMode : "none"});
		oUiApi.handleStartup(startupPromise);

		startupPromise.done(function(){
			restoreStubs();
			done();
		});
	});
	QUnit.test("WHEN calling handleStartup with smart filter bar configuration - set defined", function(assert){
		var done = assert.async();
		assert.expect(1);

		function getSmartFilterBarConfigurationAsPromiseStub() {
			var config = {
					service : "/some/url",
					entitySet : "entitySet21"
			};
			return sap.apf.utils.createPromise(config);
		}

		function viewStub(configuration) {
			var expectedSmartFilterBarConfiguration = {
				service : "/some/url",
				entitySet : "entitySet21"
			};
			assert.deepEqual( configuration.viewData.oSmartFilterBarConfiguration, expectedSmartFilterBarConfiguration, "THEN filter configuration correctly handed over");
			var dummy = createDummyView();
			if (configuration.async) {
				return {
					loaded : function() {
						return Promise.resolve(dummy);
					}
				};
			}
			return dummy;
		}

		function prepareStubs() {
			sinon.stub(oGlobalApi.oCoreApi, "getSmartFilterBarConfigurationAsPromise", getSmartFilterBarConfigurationAsPromiseStub);
			sinon.stub(sap.ui, "view", viewStub);
		}

		function restoreStubs() {
			oGlobalApi.oCoreApi.getSmartFilterBarConfigurationAsPromise.restore();
			sap.ui.view.restore();
		}

		prepareStubs();
		var startupPromise = sap.apf.utils.createPromise({ navigationMode : "none"});
		oUiApi.handleStartup(startupPromise);

		startupPromise.done(function(){
			restoreStubs();
			done();
		});
	});
	QUnit.test('When calling handleStartup with forward promise and Steps', function(assert) {
		//arrangements
		sinon.stub(oGlobalApi.oCoreApi, 'getStartParameterFacade', getStartParameterFacadeStub);
		var spyCreateFirstStep = sinon.spy(oGlobalApi.oCoreApi, 'createFirstStep');
		var deferred = jQuery.Deferred();
		deferred.resolve({
			navigationMode : "forward"
		});
		//action
		oUiApi.handleStartup(deferred.promise());
		var stepId = oGlobalApi.oCoreApi.getStartParameterFacade().getSteps()[0].stepId;
		var repId = oGlobalApi.oCoreApi.getStartParameterFacade().getSteps()[0].representationId;
		//assert
		assert.strictEqual(spyCreateFirstStep.getCall(0).args[0], stepId, "Then 1st  param is Step ID");
		assert.strictEqual(spyCreateFirstStep.getCall(0).args[1], repId, "Then 2nd  param is Representation ID");
		assert.ok(spyCreateFirstStep.getCall(0).args[2] instanceof Function, "Then 3rd param is callback");
		assert.strictEqual(spyCreateFirstStep.calledOnce, true, "Then the firststep has created successfully");
		oGlobalApi.oCoreApi.getStartParameterFacade.restore();
	});
	QUnit.test('When calling handleStartup in forward promise with No Steps', function(assert) {
		//arrangements
		var spyCreateFirstStep = sinon.spy(oGlobalApi.oCoreApi, 'createFirstStep');
		var deferred = jQuery.Deferred();
		deferred.resolve({
			navigationMode : "forward"
		});
		//action
		oUiApi.handleStartup(deferred.promise());
		//assert
		assert.strictEqual(spyCreateFirstStep.calledOnce, false, "Then no Step has created");
	});
	QUnit.test('When calling handleStartup with backward promise', function(assert) {
		//arrangements
		var spyUpdatePath = sinon.spy(oGlobalApi.oCoreApi, 'updatePath');
		var deferred = jQuery.Deferred();
		deferred.resolve({
			navigationMode : "backward"
		});
		//action
		oUiApi.handleStartup(deferred.promise());
		var analysispathname = oUiApi.getAnalysisPath();
		var titlename = analysispathname.oSavedPathName.getTitle();
		//assert
		assert.ok(spyUpdatePath.getCall(0).args[0] instanceof Function, "Then the param is callback");
		assert.strictEqual(spyUpdatePath.calledOnce, true, "Then the analysispath has updates successfully");
		assert.strictEqual(titlename, "unsaved", "Then the title for analysispath has set successfully");
	});
	QUnit.test('When drawing Facetfilter - no facet filter configured or all the facet filters are invisible', function(assert) {
		//action
		oGlobalApi.oUiApi.drawFacetFilter([]);
		var subHeaderval = oGlobalApi.oUiApi.getLayoutView().byId("subHeader");
		var facetfilterval = subHeaderval.getContent();
		//assert
		assert.strictEqual(facetfilterval.length, 0, "Then the facetfilter view is not added");
		assert.strictEqual(subHeaderval.getBusy(), false, "Then the subheader busy indicator is set to false");
	});
	QUnit.test('When drawing Facetfilter - visible facet filters are available', function(assert) {
		//arrange
		var done = assert.async();
		var aConfiguredFilters = getConfigurationFilter(true);
		var view = sap.ui.view({
			viewName : "sap.apf.ui.reuse.view.facetFilter",
			type : sap.ui.core.mvc.ViewType.JS,
			viewData : {
				oCoreApi : oGlobalApi.oCoreApi,
				oUiApi : oUiApi,
				aConfiguredFilters : aConfiguredFilters,
				oStartFilterHandler : sap.apf.utils.StartFilterHandler
			}
		});
		var facetFilter = view.byId("idAPFFacetFilter");
		sinon.stub(facetFilter, "addEventDelegate", function(oDelegate) {
			oDelegate.onAfterRendering();
			//action
			var subHeaderval = oGlobalApi.oUiApi.getLayoutView().byId("subHeader");
			var facetfilterval = subHeaderval.getContent();
			var facetFilterForPrint = oGlobalApi.oUiApi.getFacetFilterForPrint();
			_placeSubHeaderWithFilterAtDom(subHeaderval);
			//assert
			assert.strictEqual(facetfilterval.length, 1, "Then the facetfilterview has added successfully");
			assert.strictEqual(facetFilterForPrint.getLists().length, 1, "Then the facetfilterview is avilable for print");
			assert.strictEqual(subHeaderval.getBusy(), false, "Then the subheader busy indicator is set to false after rendering");
			//clear   //KS why clear here and not on the next test?
			document.body.removeChild(document.getElementById('contentOfFilter'));
			facetFilter.addEventDelegate.restore();
			done();
		});
		sinon.stub(sap.ui, "view", function(oConfiguration) {
			view.loaded = function() {
				return Promise.resolve(view);
			};
			return view;
		});
		//action
		oGlobalApi.oUiApi.drawFacetFilter(aConfiguredFilters);
	});

	QUnit.test('When drawing Smart Filter Bar with no control configuration', function(assert) {
		//arrange
		var subHeaderval = oGlobalApi.oUiApi.getLayoutView().byId("subHeader");
		//act
		oGlobalApi.oUiApi.drawSmartFilterBar(undefined);
		//assert
		assert.strictEqual(subHeaderval.getBusy(), false, "Then the subheader busy indicator is set to false");
	});
	QUnit.test('When getCustomFormatExit called', function(assert) {
		var oExit = oGlobalApi.oUiApi.getCustomFormatExit();
		var oExpectedExit = {};  //KS test is not sharp enough I would prefer a real custom format exit function
		assert.deepEqual(oExit, oExpectedExit, "then it should return the exit object supported for custom formatting");
	});
	QUnit.test("WHEN selection changed event and updatePathStub", function(assert){
		var done = assert.async();
		sinon.stub(oGlobalApi.oCoreApi, "updatePath", function(stepProcessedCallback, updatePathFinishedCallback){
			updatePathFinishedCallback();
			assert.ok(spy.calledOnce, "THEN enableDisableOpenIn was called to refresh navigation");
			spy.restore();
			done();
		});
		var layoutController = oGlobalApi.oUiApi.getLayoutView().getController();
		var spy = sinon.spy(layoutController, "enableDisableOpenIn");
		oGlobalApi.oUiApi.selectionChanged();
	});

	QUnit.module("Application Layout Creation", {
		beforeEach : function() {
			var self = this;
			var inject = {
				probe : function(probe) {
					self.instance = probe.uiApi;
				},
				constructors : {
					StartFilterHandler : function(injectStartFilterHandler) {
						self.onBeforeApfStartupPromise = injectStartFilterHandler.instances.onBeforeApfStartupPromise;
					},
					MessageHandler : function() {
						return {
							activateOnErrorHandling : function() {},
							setLifeTimePhaseStartup : function() {},
							loadConfig : function() {},
							setMessageCallback : function() {},
							setLifeTimePhaseRunning : function() {
								if (self.setLifeTimePhaseRunningCallback){
									self.setLifeTimePhaseRunningCallback();
								}
							},
							setTextResourceHandler : function() {},
							check : function() {}
						};
					}
				}
			};
			this.api = new sap.apf.Api(undefined, inject, undefined);
			var getStub = function() {
				return {
					loaded : function() {
						return Promise.resolve();
					}
				};
			};
			this.stubGetAnalysisPath = sinon.stub(this.instance, "getAnalysisPath", getStub);
			this.stubGetStepContainer = sinon.stub(this.instance, "getStepContainer", getStub);
			this.stubGetToolbar = sinon.stub(this.instance, "getToolbar", getStub);
			this.stubCreateCarouselSingleton = sinon.stub(this.instance, "createCarouselSingleton", getStub);
			this.stubGetStepGallery = sinon.stub(this.instance, "getStepGallery", getStub);
			this.stubGetPathGallery = sinon.stub(this.instance, "getPathGallery", getStub);
			this.stubGetDeleteAnalysisPath = sinon.stub(this.instance, "getDeleteAnalysisPath", getStub);
			this.stubGetLayoutView = sinon.stub(this.instance, "getLayoutView", getStub);
		},
		afterEach : function() {
			this.stubGetAnalysisPath.restore();
			this.stubGetStepContainer.restore();
			this.stubGetToolbar.restore();
			this.stubCreateCarouselSingleton.restore();
			this.stubGetStepGallery.restore();
			this.stubGetPathGallery.restore();
			this.stubGetDeleteAnalysisPath.restore();
			this.stubGetLayoutView.restore();
		}
	});
	QUnit.test("check at getStepGallery", function(assert) {
		var done = assert.async();
		this.stubGetStepGallery.restore();
		this.stubGetStepGallery = sinon.stub(this.instance, "getStepGallery", function() {
			assert.ok(this.stubCreateCarouselSingleton.notCalled, "createCarouselSingleton was not called");
			assert.ok(this.stubGetAnalysisPath.notCalled, "getAnalysisPath was not called");
			assert.ok(this.stubGetLayoutView.notCalled, "getLayoutView was not called");
			done();
		}.bind(this));
		this.instance.createApplicationLayout();
	});
	QUnit.test("check at getToolbar", function(assert) {
		var done = assert.async();
		this.stubGetToolbar.restore();
		this.stubGetToolbar = sinon.stub(this.instance, "getToolbar", function() {
			assert.ok(this.stubGetAnalysisPath.notCalled, "getAnalysisPath was not called");
			assert.ok(this.stubGetLayoutView.notCalled, "getLayoutView was not called");
			done();
		}.bind(this));
		this.instance.createApplicationLayout();
	});
	QUnit.test("check at getPathGallery", function(assert) {
		var done = assert.async();
		this.stubGetPathGallery.restore();
		this.stubGetPathGallery = sinon.stub(this.instance, "getPathGallery", function() {
			assert.ok(this.stubGetAnalysisPath.notCalled, "getAnalysisPath was not called");
			assert.ok(this.stubGetLayoutView.notCalled, "getLayoutView was not called");
			done();
		}.bind(this));
		this.instance.createApplicationLayout();
	});
	QUnit.test("check at getDeleteAnalysisPath", function(assert) {
		var done = assert.async();
		this.stubGetDeleteAnalysisPath.restore();
		this.stubGetDeleteAnalysisPath = sinon.stub(this.instance, "getDeleteAnalysisPath", function() {
			assert.ok(this.stubGetAnalysisPath.notCalled, "getAnalysisPath was not called");
			assert.ok(this.stubGetLayoutView.notCalled, "getLayoutView was not called");
			done();
		}.bind(this));
		this.instance.createApplicationLayout();
	});
	QUnit.test("check at getStepContainer", function(assert) {
		var done = assert.async();
		this.stubGetStepContainer.restore();
		this.stubGetStepContainer = sinon.stub(this.instance, "getStepContainer", function() {
			assert.ok(this.stubGetLayoutView.notCalled, "getLayoutView was not called");
			done();
		}.bind(this));
		this.instance.createApplicationLayout();
	});
	QUnit.test("check at createCarouselSingleton", function(assert) {
		var done = assert.async();
		this.stubCreateCarouselSingleton.restore();
		this.stubCreateCarouselSingleton = sinon.stub(this.instance, "createCarouselSingleton", function() {
			assert.ok(this.stubGetStepGallery.calledOnce, "getStepGallery was called once");
			assert.ok(this.stubGetAnalysisPath.notCalled, "getAnalysisPath was not called");
			assert.ok(this.stubGetLayoutView.notCalled, "getLayoutView was not called");
			done();
		}.bind(this));
		this.instance.createApplicationLayout();
	});
	QUnit.test("check at getAnalysisPath", function(assert) {
		var done = assert.async();
		this.stubGetAnalysisPath.restore();
		this.stubGetAnalysisPath = sinon.stub(this.instance, "getAnalysisPath", function() {
			assert.ok(this.stubGetToolbar.calledOnce, "getToolbar was called once");
			assert.ok(this.stubCreateCarouselSingleton.calledOnce, "createCarouselSingleton was called once");
			assert.ok(this.stubGetPathGallery.calledOnce, "getPathGallery was called once");
			assert.ok(this.stubGetDeleteAnalysisPath.calledOnce, "getDeleteAnalysisPath was called once");
			assert.ok(this.stubGetLayoutView.notCalled, "getLayoutView was not called");
			done();
		}.bind(this));
		this.instance.createApplicationLayout();
	});
	QUnit.test("check at getLayoutView", function(assert) {
		var done = assert.async();
		this.stubGetLayoutView.restore();
		this.stubGetLayoutView = sinon.stub(this.instance, "getLayoutView", function() {
			assert.ok(this.stubGetStepContainer.calledOnce, "getStepContainer was called once");
			assert.ok(this.stubGetAnalysisPath.calledOnce, "getAnalysisPath was called once");
			done();
		}.bind(this));
		this.instance.createApplicationLayout();
	});
}());
