/*/
 * Created on 23.11.2018.
 * Copyright(c) 2018-2019 SAP SE
 */
/*global sap */

sap.ui.define([
	'sap/apf/core/instance',
	'sap/apf/core/utils/filter',
	'sap/apf/ui/utils/constants',
	'sap/apf/ui/reuse/controller/carousel.controller',
	'sap/apf/ui/reuse/view/carousel.view',
	'sap/apf/ui/reuse/controller/stepGallery.controller',
	'sap/apf/ui/reuse/view/stepGallery.view',
	'sap/apf/ui/reuse/controller/analysisPath.controller',
	'sap/apf/ui/reuse/view/analysisPath.view',
	'sap/apf/ui/fixture/coreInstance',
	'sap/apf/ui/fixture/stub.view',
	'sap/ui/core/mvc/JSView',
	'sap/m/CustomListItem',
	'sap/apf/ui/utils/wrappedChartWithCornerTexts',
	'sap/base/Log',
	'sap/ui/thirdparty/sinon'
], function(CoreInstance, CoreFilter, UtilsConstants,
			CarouselController, CarouselView,       // referenced implicitly when creating view
			StepGalleryController, StepGalleryView, // referenced implicitly when creating view
			AnalysisPathController, AnalysisPathView,
			Fixture, _viewStub /*load*/,
			MvcJSView, CustomListItem, WrappedChartWithCornerTexts, sapLog, sinon) {
	'use strict';

	function simulateCorePathLength3 (that, activeStep) {
		simulateCorePathLengthN(that, activeStep, 3)
	}

	/**
	 * Generate 1..3 steps, "a", "b", and "c".
	 * Stub core.getSteps() and core.getActiveStep().
	 * Then call addStepTest n times, each call generates a new step and then calls Carousel.updateCustomListView.
	 * @param that
	 * @param [activeStep]
	 * @param [nSteps] 1, 2, or 3.
	 */
	function simulateCorePathLengthN (that, activeStep, nSteps) {
		nSteps = nSteps <= 3 ? nSteps : 3;
		// now simulate the core logic for the active step
		that.spy.getSteps = sinon.stub(that.carouselView.oCoreApi, "getSteps", function () {
			return ["a", "b", "c"].slice(0, nSteps);
		});
		that.spy.getActiveStep = sinon.stub(that.carouselView.oCoreApi, "getActiveStep", function () {
			return activeStep;
		});
		var i;
		for (i = 0; i < nSteps; ++i) {
			addTestStep(that, undefined, {id: i+1});
		}
		//spies
		that.spy.coreSetActiveStep = sinon.stub(that.carouselView.oCoreApi, "setActiveStep", function () {});
	}

	function generateStep (that, parameter) {
		parameter = parameter || {};
		parameter.bIsAlternateView = parameter.bIsAlternateView || false; // default
		var id = parameter.id || 42
		var generatedStepsCnt = that.generatedSteps.length + 1;
		var oRepr = {
			type: "" + generatedStepsCnt,
			bIsAlternateView: parameter.bIsAlternateView,
			_createAndAddFeedItemBasedOnId: function () {},
			createDataset: function () {},
			oModel: "updated model " + generatedStepsCnt
		};
		that["representation_" + generatedStepsCnt] = oRepr;
		var oStep = {
			id : id,
			getSelectedRepresentation: function () {
				return oRepr;
			},
			getSelectedRepresentationInfo: function () {},
			_testExtension: {
				representation: oRepr
			}
		};
		that["step_" + generatedStepsCnt] = oStep;
		that.generatedSteps.push(oStep);
		return oStep;
	}

	/**
	 * test convenience. Bookkeeping of steps happens in that.generatedStepsCnt and that.generatedSteps.
	 * @param {Object} that test context
	 * @param {sap.apf.core.step} [step] optional. If undefined, then a step is generated.
	 * @returns {ap.apf.core.step}
	 */
	function addTestStep (that, step, parameter) {
		parameter = parameter || {};
		that.generatedSteps = that.generatedSteps || [];
		step = step || generateStep(that, parameter);
		var at = that.carouselView.getCustomItemList().length;
		that.carouselController.updateCustomListView(step, at, null); // bStepChanged does not matter
		return step;
	}

	/**
	 * Description of the test.
	 * Objectives: show that updates in the core result in updates of the analysis path in the CustomListControl.
	 * In detail show the updates for add, move, delete events in the analysis path.
	 * Also, shows the update for a selection change of the displayed chart via a selection on the path,
	 * and changes of the representation in the main chart.
	 *
	 * The carousel displays the path list.
	 * It handles the event of the selection of a step in the path list, @see onListItemPressed.
	 * This establishes a control flow from the carousel to the UI instance (oUiAPI).
	 *
	 * AddStep Button
	 *   The event handler is in class stepGallery.fragment.js.
	 *   It calls stepGallery.controller.onStepPress which calls checkAddStep (returns promise).
	 *   Its resolver calls oCore.createStep with a callback callBackForUpdatePathAndSetLastStepAsActive. And this is the only occurrence in sap.apf.ui.
	 *   callBackForUpdatePathAndSetLastStepAsActive in turn calls AnalysisPath.controller.
	 *   The callback is the update method, which is tested below. It also means that adding to the path (customItemList)
	 *   happens in the method updateCustomListView of the Carousel.
	 *
	 * Change of chart selection or change of representation:
	 *        control flow from class analysisPath.controller to the carousel.controller.updateCustomListView and setSelectionsOnThumbnail.
	 *
	 * The modules:
	 * 1st prove that the StepGallery event handler call core.createStep with a specific callback (update) method.
	 * 2nd prove that the createStep calls its callback when specific promises are resolved.
	 * 3rd prove that specific update methods of the AnalysisPath.controller enforce an update of the list view.
	 * 4th prove updates to the CustomListView by:
	 *      1) add step,
	 *      2) update step,
	 *      3) update selection in chart,
	 *      4) change of representation.
	 *      5) delete/remove step.
	 *      6) change of selection in path.
	 */

	function consistentDoubleBookkeeping (assert, that) {
		assert.strictEqual(that.carouselView.getCustomItemList().length,
			that.carouselController._relateChartsToItems.length, "THEN custom item list and related chart list are in sync");
	}

	QUnit.module("Context createStep - Given a stubbed core instance and a step gallery controller", {
		beforeEach: function (assert) {
			var that = this;
			var done = assert.async();
			that.spy = {};

			that.inject = Fixture.createInjectForCore(that);
			that.oCoreInstance = new CoreInstance.constructor(that.inject);
			// coreProbe has been executed here.
			that.coreReferences.configurationFactory.getConfigurationById = Fixture.getConfigurationById;
			that.coreReferences.coreApi.getCategories = function () {
				return [];
			};
			that.coreReferences.coreApi.getTextNotHtmlEncoded = function () {
				return "hugo-text";
			};
			that.coreReferences.coreApi.getStepTemplates = function () {
				return [];
			};
			that.callback = function () {
				return "42";
			};
			MvcJSView.create({
				type: sap.ui.core.mvc.ViewType.JS,
				viewName: "sap.apf.ui.fixture.stub",
				controller: sap.ui.controller("sap.apf.ui.reuse.controller.stepGallery"),
				id: "sap.apf.ui.fixture.stub-ID",
				viewData: {
					oCoreApi: that.coreReferences.coreApi,
					uiApi: {
						getElementsGalleryData: function () {
							return {
								GalleryElements: []
							};
						},
						getAnalysisPath: function () {
							return {
								getController: function () {
									return {
										callBackForUpdatePathAndSetLastStepAsActive: that.callback,
										refresh: function () {
										}
									};
								}
							}
						}
					}
				}
			}).then(function (oView) {
				that.view = oView;
				done();
			});
		},
		afterEach: function () {
			var that = this;
			Object.keys(that.spy).forEach(function (name) {
				that.spy[name].restore();
			});
			that.view.destroy();
		}
	});
	QUnit.test("When calling stepGallery.controller.onStepPress", function (assert) {
		/** When pressing the addStep button created in the carousel.view,
		 * then the openHierarchicalSelectDialog of the stepGallery.controller is called.
		 * When finally pressing ok this dialog will call stepGallery.controller.onStepPress.
		 * The test proves that onStepPress calls coreApi.createStep.
		 */
		var that = this;
		assert.expect(3);
		//prepare
		var sStepId = "step1"; // id of configuration.json
		that.spy.createStep = sinon.stub(that.coreReferences.coreApi, "createStep", function () {});
		//act
		var controller = that.view.getController();
		controller.oHierchicalSelectDialog = {
			close: function () {
			}
		};
		controller.onStepPress(sStepId, undefined);
		// check
		assert.strictEqual(that.spy.createStep.callCount, 1, "THEN createStep is called");
		assert.strictEqual(that.spy.createStep.getCall(0).args[0], sStepId, "THEN 1st param is the stepId");
		assert.strictEqual(that.spy.createStep.getCall(0).args[1](), that.callback(),
			"THEN createStep is called with the callBackForUpdatePathAndSetLastStepAsActive");
	});

	QUnit.module("Context createStep - Given a stubbed core instance", {
		beforeEach: function () {
			var that = this;
			that.spy = {};

			that.getMetadataDeferred = jQuery.Deferred();

			function getMetadata () {
				return that.getMetadataDeferred.promise();
			}

			that.cumulativeStartFilterDeferred = jQuery.Deferred();

			function getCumulativeFilter () {
				return that.cumulativeStartFilterDeferred.promise();
			}

			that.getSmartFilterBarConfigurationDeferred = jQuery.Deferred();

			function getSmartFilterBarConfiguration () {
				return that.getSmartFilterBarConfigurationDeferred.promise();
			}

			that.inject = Fixture.createInjectForCore(that);
			that.oCoreInstance = new CoreInstance.constructor(that.inject);
			// coreProbe has been executed here.
			that.oCoreInstance.createRepresentation = Fixture.createRepresentation;
			that.coreReferences.configurationFactory.getConfigurationById = Fixture.getConfigurationById;
			that.coreReferences.configurationFactory.getSmartFilterBarConfiguration = getSmartFilterBarConfiguration;
			that.coreReferences.coreApi.getCumulativeFilter = getCumulativeFilter;
			that.coreReferences.coreApi.getMetadata = getMetadata;
		},
		afterEach: function () {
			var that = this;
			Object.keys(that.spy).forEach(function (name) {
				that.spy[name].restore();
			});
		}
	});

	QUnit.test("when calling core.createStep", function (assert) {
		// When StepGallery.onStepPress THEN core.createStep is being called,
		// AND THEN its callback === analysisPathController.callBackForUpdatePathAndSetLastStepAsActive.
		// This test proves that the callback is called when dependent promises are resolved.
		assert.expect(1);
		var done = assert.async();
		var that = this;
		var sStepId = "step1"; // id in configuration.json
		var fnStepProcessedCallback = function (obj) {
			// check
			assert.notStrictEqual(obj, undefined, "THEN the callback is called when all promises have been resolved.");
			done();
		};
		//act
		that.oCoreInstance.createStep(sStepId, fnStepProcessedCallback);

		// arrange
		// resolved those promises on which the exec of the callback depends
		that.getMetadataDeferred.resolve({
			origin: "getMetadata"
		});
		var cumulativeStartFilter = new CoreFilter(Fixture.createMessageHandler());
		that.cumulativeStartFilterDeferred.resolve(cumulativeStartFilter);
		that.getSmartFilterBarConfigurationDeferred.resolve(null); // required: null which indicates no SFB configured
	});

	QUnit.module("Context createStep - Given an analysisPathController with a stubbed view", {
		// create a mocked view with the controller of class AnalysisPath.controller.
		beforeEach: function (assert) {
			var that = this;
			var done = assert.async();
			that.spy = {};
			that.coreApi = {
				iam: "coreApi",
				getSteps: function () {
					return [];
				}
			};
			var mocked = {
				updateCustomListView: function () {}
			};
			that.spy.updateCustomListView = sinon.spy(mocked, 'updateCustomListView');
			MvcJSView.create({
				type: sap.ui.core.mvc.ViewType.JS,
				viewName: "sap.apf.ui.fixture.stub",
				controller: sap.ui.controller("sap.apf.ui.reuse.controller.analysisPath"),
				id: "sap.apf.ui.fixture.stub-ID",
				viewData: {
					oCoreApi: that.coreApi,
					uiApi: {
						iam: "uiApi",
						getLayoutView: function () {
							return {
								setBusy: function () {}
							}
						}
					}
				},
				async: true
			}).then(function (oView) {
				that.analysisPathView = oView;
				that.analysisPathController = oView.getController();
				that.spy.updateCurrentStep = sinon.stub(that.analysisPathController, 'updateCurrentStep');
				oView.getCarouselView = function () {
					return {
						getController: function () {
							return mocked;
						}
					}
				};
				done();
			});
		},
		afterEach: function () {
			var that = this;
			that.analysisPathView.destroy();
			Object.keys(that.spy).forEach(function (name) {
				that.spy[name].restore();
			});
		}
	});
	QUnit.test("After setup", function (assert) {
		//act
		//check
		assert.notStrictEqual(this.analysisPathView, undefined, "THEN no setup error happened");
	});
	QUnit.test("When calling callBackForUpdatePath", function (assert) {
		var oRepr = {
			type: "hugo",
			chart: {}
		};
		var oStep = {
			getSelectedRepresentation: function () {
				return oRepr;
			}
		};
		//act
		this.analysisPathController.callBackForUpdatePath(oStep, "otto");
		//check
		assert.strictEqual(this.spy.updateCurrentStep.callCount, 1, "THEN updateCurrentStep is called");
		assert.strictEqual(this.spy.updateCustomListView.callCount, 1, "THEN Carousel.controller.updateCustomListView is called");
		assert.strictEqual(this.spy.updateCustomListView.getCall(0).args[0], oStep, "THEN param 1 is the current step");
		assert.strictEqual(this.spy.updateCustomListView.getCall(0).args[1], -1, "THEN param 2 is its index");
		assert.strictEqual(this.spy.updateCustomListView.getCall(0).args[2], "otto", "THEN param 3 is bStepChanged");
	});
	QUnit.test("When calling callBackForUpdatePathAndSetLastStepAsActive", function (assert) {
		// This test specifies the case when the very first step is added (index===-1).
		var oRepr = {
			type: "hugo",
			chart: {}
		};
		var oStep = {
			getSelectedRepresentation: function () {
				return oRepr;
			},
			getSelectedRepresentationInfo: function () {}
		};
		//act
		this.analysisPathController.callBackForUpdatePathAndSetLastStepAsActive(oStep, "anna");
		//check
		assert.strictEqual(this.spy.updateCurrentStep.callCount, 1, "THEN updateCurrentStep is called");
		assert.strictEqual(this.spy.updateCustomListView.callCount, 1, "THEN Carousel.l.updateCustomListView is called");
		assert.strictEqual(this.spy.updateCustomListView.getCall(0).args[0], oStep, "THEN param 1 is the current step");
		assert.strictEqual(this.spy.updateCustomListView.getCall(0).args[1], -1, "THEN param 2 is its index");
		assert.strictEqual(this.spy.updateCustomListView.getCall(0).args[2], "anna", "THEN param 3 is bStepChanged");
	});

	QUnit.module("Given a stubbed Carousel and a coreApi", {
		// Prove that the carousel.controller.updateCustomListView adds a step to the custom list control
		beforeEach: function (assert) {
			var done = assert.async();
			var that = this;
			that.spy = {};
			that.generatedSteps = that.generatedSteps || [];
			that.inject = Fixture.createInjectForCore(that);
			that.oCoreInstance = new CoreInstance.constructor(that.inject);
			// coreProbe has been executed here.
			that.oCoreInstance.getSmartFilterBarConfigurationAsPromise = function () {
				var deferred = jQuery.Deferred();
				deferred.resolve(null); // null required
				return deferred;
			};
			that.coreReferences.coreApi.getTextNotHtmlEncoded = function () {
				return "hugo-text";
			};
			that.someView1 = {
				view: "some VBox"
			};
			that.someChart1 = {
				destroyDataset: function () {},
				removeAllFeeds: function () {},
				destroyFeeds: function () {},
				vizUpdate: function () {},
				setModel: function () {},
				removeStyleClass: function () {},
				addStyleClass: function () {},
				getModel: function () {
					return {
						getData: function () {
							return {
								data: []
							}
						}
					}
				}
			};
			that.callBackForUpdatePath = function () {
				return "callBackForUpdatePath";
			};
			that.someChart2 = jQuery.extend(true, {}, that.someChart1);
			that.someChartN = jQuery.extend(true, {}, that.someChart1);
			that.analysisPathController = {
				refresh: function () {},
				callBackForUpdatePath: that.callBackForUpdatePath
			};
			MvcJSView.create({
				id: "idViewStubbedCarousel",
				viewName: "sap.apf.ui.reuse.view.carousel",
				type: sap.ui.core.mvc.ViewType.JS,
				viewData: {
					oInject: {
						oCoreApi: that.coreReferences.coreApi,
						uiApi: {
							getStepGallery: function () {
							},
							getStepContainer: function () {//for test delete
								return {
									getId: function () {return "hugo";},
									getController: function () {return {};}
								};
							},
							getAnalysisPath: function () {//for test delete
								return {
									getController: function () {
										return that.analysisPathController;
									}
								};
							},
							getLayoutView: function () {//for test delete
								return {
									getController: function () {
										return {
											enableDisableOpenIn: function () {}
										}
									}
								};
							},
							selectionChanged: function () {
								return;
							}
						}
					}
				}
			})
				.then(function (oView) {
					that.carouselView = oView;
					that.carouselView.useMainChart = false;
					that.carouselController = that.carouselView.getController();
					//stub
					that.spy.getClonedChart = sinon.stub(WrappedChartWithCornerTexts, "getClonedChart", function (step) {
						if (step.id === 1) {
							return that.someChart1;
						}
						if (step.id === 2) {
							return that.someChart2;
						}
						return that.someChartN;
					});
					that.spy.createCustomListItem = sinon.stub(that.carouselView, "createCustomListItem", function () {
						var oCustomListItem = new CustomListItem({});
						return oCustomListItem;
					});
					that.spy._setHighlightingOfActiveStep = sinon.stub(that.carouselController, "_setHighlightingOfActiveStep", function () {});
					that.spy.update1CustomItemChartWhenChange = sinon.stub(that.carouselController, "update1CustomItemChartWhenChange", function () {});
					that.spy.WrappedChartWithCornerTexts = sinon.stub(WrappedChartWithCornerTexts, "constructor", function () {
						this.oThumbnailVLayout = {
							removeStyleClass : function () {},
							addStyleClass : function () {}
						};
						this.oItemVerticalLayout = that.someView1;
						this.setHighlighted = function() {};
						this.setNonHighlighted = function() {};
						this.getContent = function() {};
					});
					that.spy.setSelectionsOnThumbnail = sinon.stub(that.carouselController, "setSelectionsOnThumbnail", function () {});
					that.spy._setSelectionsOnThumbnailAndEnforceRendering = sinon.stub(that.carouselController, "_setSelectionsOnThumbnailAndEnforceRendering", function () {});
					that.spy._destroyItemAndChart = sinon.stub(that.carouselController, "_destroyItemAndChart", function () {});
					that.spy._pruneRelateChartsToItems = sinon.stub(that.carouselController, "_pruneRelateChartsToItems", function(){});
					//spy
					that.spy.removeStep = sinon.spy(that.carouselController, "removeStep");
					that.spy.setActiveStepAfterRemove = sinon.spy(that.carouselController, "setActiveStepAfterRemove");
					that.spy.deleteFromBookkeeping = sinon.spy(that.carouselController, "deleteFromBookkeeping");
					that.spy.removeCustomItem = sinon.spy(that.carouselView, "removeCustomItem");
					that.spy.addCustomListItem = sinon.spy(that.carouselView, "addCustomListItem");
					that.spy.callBackForUpdatePath = sinon.spy(that.analysisPathController, "callBackForUpdatePath");
					that.spy.isChangeOfRepresentation = sinon.spy(that.carouselController, "isChangeOfRepresentation");
					that.spy._replaceChangedRepresentation = sinon.spy(that.carouselController, "_replaceChangedRepresentation");
					that.spy._removeHighlightingOfAnyStep = sinon.spy(that.carouselController, "_removeHighlightingOfAnyStep");
					that.spy._createRelation = sinon.spy(that.carouselController, "_createRelation");
					that.spy.createIconThumbnail = sinon.spy(WrappedChartWithCornerTexts, "createIconThumbnail");
					that.spy._setBusyOnCustomListItem = sinon.spy(that.carouselController, "_setBusyOnCustomListItem");
					//
					done();
				}).catch(function (error) {
				that.setUpError = error.toString();
				sapLog.error("*** TEST: MvcJSView.create: : " + error);
				done();
			});
		},
		afterEach: function () {
			var that = this;
			var subView;
			Object.keys(that.spy).forEach(function (name) {
				that.spy[name].restore();
			});
			subView = sap.ui.getCore().byId('idViewStubbedCarousel--idAddAnalysisStepButtonInFooter');
			if (subView) {
				subView.destroy();
			}
			subView = sap.ui.getCore().byId('idViewStubbedCarousel--idTestPathButtonInFooter');
			if (subView) {
				subView.destroy();
			}
			subView = sap.ui.getCore().byId('idViewStubbedCarousel--idDeleteStepButtonInFooter');
			if (subView) {
				subView.destroy();
			}
			subView = sap.ui.getCore().byId('idViewStubbedCarousel--idMoveStepUpButtonInFooter');
			if (subView) {
				subView.destroy();
			}
			subView = sap.ui.getCore().byId('idViewStubbedCarousel--idMoveStepDownButtonInFooter');
			if (subView) {
				subView.destroy();
			}
			if (that.carouselView) {
				that.carouselView.destroy();
			}
		}
	});
	QUnit.test("When creating carousel.view", function (assert) {
		var that = this;
		//act
		var result = that.carouselView.getCustomItemList();
		//check
		assert.strictEqual(this.setUpError, undefined, "THEN no setup error happened");
		assert.deepEqual(result, [], "THEN getCustomItemList returns an empty item list");
		consistentDoubleBookkeeping(assert, that);
	});
	QUnit.test('When calling updateCustomListView', function (assert) {
		// prove that the busy state is turned off
		assert.expect(3);
		var that = this;
		// prepare
		that.chartType = "hugo type";
		var oRepr = {
			type: that.chartType,
			chart: {},
			bIsAlternateView: true // replacement is iconic
		};
		var oStep = {
			getSelectedRepresentation: function () {
				return oRepr;
			},
			getSelectedRepresentationInfo: function () {}
		};
		that.spy.isChangeOfRepresentation.restore();
		that.spy.isChangeOfRepresentation = sinon.stub(that.carouselController, "isChangeOfRepresentation", function () {
			return false;
		});
		var oCustomListItem = {
			setBusy: function () {}
		};
		that.carouselController._relateChartsToItems[0] = {
			customListItem: oCustomListItem
		};
		that.spy.getSteps = sinon.stub(that.carouselView.oCoreApi, 'getSteps', function () {
			return ['a']
		});
		//act
		that.carouselController.updateCustomListView(oStep, 0, false);
		//check
		assert.strictEqual(that.spy._setBusyOnCustomListItem.callCount, 1, 'THEN custom list item is set busy');
		assert.strictEqual(that.spy._setBusyOnCustomListItem.getCall(0).args[0], that.carouselController._relateChartsToItems[0], 'AND set busy at 1st step');
		assert.strictEqual(that.spy._setBusyOnCustomListItem.getCall(0).args[1], false, 'AND set busy === false');
	});
	QUnit.test("When calling updateCustomListView while adding step", function (assert) {
		assert.expect(8);
		var that = this;
		// prepare
		that.spy.createCustomListItem.restore();
		that.spy.createCustomListItem = sinon.stub(that.carouselView, "createCustomListItem", function () {
			var oCustomListItem = new CustomListItem({});
			return oCustomListItem;
		});
		//act
		addTestStep(that, that.step_1);
		//check
		assert.strictEqual(that.spy.getClonedChart.callCount, 1, "THEN _getClonedChart is called");
		assert.strictEqual(that.spy.getClonedChart.getCall(0).args[0], that.step_1, "THEN the step is passed");
		assert.strictEqual(that.spy.createCustomListItem.callCount, 1, "THEN a new custom list item is created");
		assert.strictEqual(that.spy._createRelation.callCount, 1, "THEN a new customListItem is created");
		assert.strictEqual(that.carouselView.getCustomItemList().length, 1, "THEN the size of the item list is increased by 1");
		assert.strictEqual(that.spy._removeHighlightingOfAnyStep.called, true, "THEN all other steps are not highlighted");
		assert.strictEqual(that.spy._removeHighlightingOfAnyStep.getCall(0).args[0], -1, "AND no steps were exclude");
		consistentDoubleBookkeeping(assert, that);
	});
	QUnit.test("When calling updateCustomListView for an existing step with update (bStepChanged===true)", function (assert) {
		var that = this;
		// prepare
		addTestStep(that, that.step_1);
		that.spy.getClonedChart.reset();
		that.spy.addCustomListItem.reset();
		//act
		that.carouselController.updateCustomListView(that.step_1, 0, true);
		//check
		assert.strictEqual(that.spy.getClonedChart.callCount, 0, "THEN not called");
		assert.strictEqual(that.spy.addCustomListItem.callCount, 0, "THEN not called");
		assert.strictEqual(that.carouselView.getCustomItemList().length, 1, "THEN the size of the item list remains 1");
		assert.strictEqual(that.spy.update1CustomItemChartWhenChange.callCount, 1, "THEN update by update1CustomItemChartWhenChange");
		assert.strictEqual(that.spy.setSelectionsOnThumbnail.callCount, 0, "THEN no selection change");
		consistentDoubleBookkeeping(assert, that);
	});
	QUnit.test("When calling updateCustomListView: change of selection but no change of step", function (assert) {
		var that = this;
		// prepare
		that.spy.insertItem = sinon.spy(that.carouselView, "insertCustomItem");
		addTestStep(that, that.step_1);
		that.spy.getClonedChart.reset();
		that.spy.addCustomListItem.reset();
		//act
		that.carouselController.updateCustomListView(that.step_1, 0, false);
		//check
		assert.strictEqual(that.spy.getClonedChart.callCount, 0, "THEN nothing is added");
		assert.strictEqual(that.spy.addCustomListItem.callCount, 0, "THEN nothing is added");
		assert.strictEqual(that.spy.removeCustomItem.callCount, 0, "THEN nothing replaced");
		assert.strictEqual(that.spy.insertItem.callCount, 0, "THEN nothing replaced");
		assert.strictEqual(that.spy._setSelectionsOnThumbnailAndEnforceRendering.called, true, "THEN selections are updated on the chart referenced in the custom list control");
		assert.strictEqual(that.spy.update1CustomItemChartWhenChange.callCount, 0, "THEN no update (update1CustomItemChartWhenChange)");
		consistentDoubleBookkeeping(assert, that);
	});
	QUnit.test("When calling updateCustomListView: change of representation for an existing step", function (assert) {
		// prove that isChangeOfRepresentation === true and THEN _replaceChangedRepresentation is called
		// prove if _replaceChangedRepresentation is called THEN item is removed and update inserted.
		var that = this;
		// prepare
		that.spy.insertItem = sinon.spy(that.carouselView, "insertCustomItem");
		addTestStep(that);  // that.step_1
		var stepWithChangedType = generateStep(that); // simulates that the representation of step_1 changed
		that.spy.addCustomListItem.reset();
		that.spy.update1CustomItemChartWhenChange.restore();
		//act
		that.carouselController.updateCustomListView(stepWithChangedType, 0, true);
		//check
		assert.strictEqual(that.spy.addCustomListItem.callCount, 0, "THEN addCustomListItem not called");
		assert.strictEqual(that.carouselView.getCustomItemList().length, 1, "THEN the size of the item list remains the same");
		assert.strictEqual(that.spy.isChangeOfRepresentation.callCount, 1, "THEN isChangeOfRepresentation called");
		assert.strictEqual(that.spy.isChangeOfRepresentation.getCall(0).returnValue, true, "AND isChangeOfRepresentation return true");
		assert.strictEqual(that.spy._replaceChangedRepresentation.callCount, 1, "THEN _replaceChangedRepresentation called");
		assert.strictEqual(that.spy.removeCustomItem.callCount, 1, "THEN the item is removed");
		assert.strictEqual(that.spy.removeCustomItem.getCall(0).args[0], 0, "THEN it is removed at its position index 0");
		assert.strictEqual(that.spy.insertItem.callCount, 1, "THEN a new item with the selected representation is inserted");
		assert.strictEqual(that.spy.insertItem.getCall(0).args[1], 0, "AND it is inserted at its old position: index 0");
		consistentDoubleBookkeeping(assert, that);
	});
	QUnit.test("When calling updateCustomListView: no change of representation", function (assert) {
		// prove that isChangeOfRepresentation === false and THEN _replaceChangedRepresentation not called
		var that = this;
		// prepare
		that.spy.insertItem = sinon.spy(that.carouselView, "insertCustomItem");
		var step = addTestStep(that);  // that.step_1
		that.spy.update1CustomItemChartWhenChange.restore();
		//act
		that.carouselController.updateCustomListView(step, 0, true);
		//check
		assert.strictEqual(that.carouselView.getCustomItemList().length, 1, "THEN the size of the item list remains the same");
		assert.strictEqual(that.spy.isChangeOfRepresentation.callCount, 1, "THEN isChangeOfRepresentation called");
		assert.strictEqual(that.spy.isChangeOfRepresentation.getCall(0).returnValue, false, "AND isChangeOfRepresentation return false");
		assert.strictEqual(that.spy._replaceChangedRepresentation.callCount, 0, "AND _replaceChangedRepresentation not called");
		consistentDoubleBookkeeping(assert, that);
	});
	QUnit.test("When calling updateCustomListView: change to an alternate representation", function (assert) {
		// prove that isChangeOfRepresentation === true and THEN _replaceChangedRepresentation is called
		var that = this;
		// prepare
		that.spy.insertItem = sinon.spy(that.carouselView, "insertCustomItem");
		var step = addTestStep(that);  // that.step_1
		step._testExtension.representation.bIsAlternateView = true; // change representation
		that.spy.update1CustomItemChartWhenChange.restore();
		//act
		that.carouselController.updateCustomListView(step, 0, true);
		//check
		assert.strictEqual(that.carouselView.getCustomItemList().length, 1, "THEN the size of the item list remains the same");
		assert.strictEqual(that.spy.isChangeOfRepresentation.callCount, 1, "THEN isChangeOfRepresentation called");
		assert.strictEqual(that.spy.isChangeOfRepresentation.getCall(0).returnValue, true, "AND isChangeOfRepresentation return true");
		assert.strictEqual(that.spy._replaceChangedRepresentation.callCount, 1, "THEN _replaceChangedRepresentation called");
		consistentDoubleBookkeeping(assert, that);
	});
	QUnit.test("When calling updateCustomListView: change from an alternate representation", function (assert) {
		// prove that isChangeOfRepresentation === true and THEN _replaceChangedRepresentation is called
		var that = this;
		// prepare
		that.spy.insertItem = sinon.spy(that.carouselView, "insertCustomItem");
		var step = addTestStep(that, null, { bIsAlternateView: true });  // step with alternate repr
		step._testExtension.representation.bIsAlternateView = false; // change representation
		that.spy.update1CustomItemChartWhenChange.restore();
		//act
		that.carouselController.updateCustomListView(step, 0, true);
		//check
		assert.strictEqual(that.carouselView.getCustomItemList().length, 1, "THEN the size of the item list remains the same");
		assert.strictEqual(that.spy.isChangeOfRepresentation.callCount, 1, "THEN isChangeOfRepresentation called");
		assert.strictEqual(that.spy.isChangeOfRepresentation.getCall(0).returnValue, true, "AND isChangeOfRepresentation return true");
		assert.strictEqual(that.spy._replaceChangedRepresentation.callCount, 1, "THEN _replaceChangedRepresentation called");
		consistentDoubleBookkeeping(assert, that);
	});
	QUnit.test("When calling update1CustomItemChartWhenChange", function (assert) {
		// prove that setModel of the chart of step2 is called with the model of the (selected) representation of step2.
		// further prove that the feed update on the chart is called.
		var that = this;
		var indexOfUpdate = 1;
		simulateCorePathLengthN(that, "b", 2);
		that.spy._setSelectionsOnThumbnailAndEnforceRendering.reset();
		that.spy.setModel = sinon.spy(that.someChart2, "setModel");
		that.step_2.id = 2;
		that.spy.update1CustomItemChartWhenChange.restore();
		// act
		that.carouselController.update1CustomItemChartWhenChange(that.step_2, indexOfUpdate);//step2 has a model
		// check
		assert.strictEqual(that.spy._setSelectionsOnThumbnailAndEnforceRendering.callCount, 1, "THEN _setSelectionsOnThumbnailAndEnforceRendering is called");
		assert.strictEqual(that.spy._setSelectionsOnThumbnailAndEnforceRendering.callCount, 1, "THEN _setSelectionsOnThumbnailAndEnforceRendering is called");
		assert.strictEqual(that.spy._setSelectionsOnThumbnailAndEnforceRendering.getCall(0).args[0], that.step_2, "AND param 0 is the associated chart");
		assert.strictEqual(that.spy.setModel.callCount, 1, "THEN setModel is called");
		assert.strictEqual(that.spy.setModel.getCall(0).args[0], that.representation_2.oModel, "AND setModel is called with the associated model");
		assert.notStrictEqual(that.spy.setModel.getCall(0).args[0], that.representation_1.oModel, "AND it is not the other model");
	});
	QUnit.test("_replaceChangedRepresentation when changing from chart to icon", function (assert) {
		// show the transition from a chart to the icon by replacement of the custom item
		assert.expect(8);
		// prep
		var that = this;
		that.carouselController.getView().useMainChart = false; // use corner text style
		that.clonedChart = {
			detachSelectData: function () {},
			detachDeselectData: function () {},
			setWidth: function () {},
			setHeight: function () {},
			id: "42",
			getModel : function() {
				return {
					getData : function() {
						return [];
					}
				}
			}
		};
		var chart = {
			clone: function () { // stub for _getClonedChart()
				return that.clonedChart;
			}
		};
		that.chartType = "hugo type";
		var oRepr = {
			type: that.chartType,
			chart: chart,
			bIsAlternateView: true // replacement is iconic
		};
		var oStep = {
			getSelectedRepresentation: function () {
				return oRepr;
			},
			getSelectedRepresentationInfo: function () {}
		};
		that.spy.createIconThumbnail.restore();
		that.spy.createIconThumbnail = sinon.stub(WrappedChartWithCornerTexts, "createIconThumbnail", function () {
			return {}
		})
		that.spy.isIconDisplayed = sinon.stub(WrappedChartWithCornerTexts, "isIconDisplayed", function(){
			return true;
		});
		that.spy.getClonedChart.restore(); //original
		that.spy.getClonedChart = sinon.spy(WrappedChartWithCornerTexts, "getClonedChart");
		that.spy.createCustomListItem.restore();
		that.spy.createCustomListItem = sinon.stub(that.carouselController.getView(), "createCustomListItem", function () {
			return {};
		});
		that.spy.insertCustomItem = sinon.stub(that.carouselController.getView(), "insertCustomItem", function () {});
		that.carouselController._relateChartsToItems[0] = {//simulate the current thumbnail is iconic
			identity: 4711
		}
		// act
		that.carouselController._replaceChangedRepresentation(oStep, 0);
		// check
		var rel = that.carouselController._relateChartsToItems[0];
		assert.strictEqual(that.carouselController._relateChartsToItems.length, 1, "THEN bookkeeping contains no new element");
		assert.strictEqual(rel.oChart, null, "THEN the chart for icons === null");
		assert.strictEqual(rel.bIsAlternateView, true, "THEN bIsAlternateView indicates an  icon");
		assert.strictEqual(rel.identity, undefined, "THEN the relation has been overwritten");
		assert.strictEqual(rel.typeOfChart, that.chartType, "THEN the chart type is carried over, still");
		assert.notStrictEqual(that.spy.isIconDisplayed.callCount, 0, "AND isIconDisplayed called at least once");
		assert.strictEqual(that.spy.createIconThumbnail.callCount, 1, "AND createIconThumbnail called");
		assert.strictEqual(that.spy.getClonedChart.callCount, 1, "AND _getClonedChart called");
	});
	QUnit.test("_replaceChangedRepresentation when changing from icon to chart", function (assert) {
		// show the transition from icon to chart
		assert.expect(8);
		// prep
		var that = this;
		that.carouselController.getView().useMainChart = false; // use corner text style
		that.clonedChart = {
			detachSelectData: function () {},
			detachDeselectData: function () {},
			setWidth: function () {},
			setHeight: function () {},
			id: "42"
		};
		var chart = {
			clone: function () { // stub for _getClonedChart()
				return that.clonedChart;
			}
		};
		that.chartType = "hugo type";
		var oRepr = {
			type: that.chartType,
			chart: chart,
			bIsAlternateView: false // replacement not iconic
		};
		var oStep = {
			getSelectedRepresentation: function () {
				return oRepr;
			}
		};
		that.spy.getClonedChart.restore(); //original
		that.spy.getClonedChart = sinon.spy(WrappedChartWithCornerTexts, "getClonedChart");
		that.spy.isIconDisplayed = sinon.spy(WrappedChartWithCornerTexts, "isIconDisplayed");
		that.spy.createCustomListItem.restore();
		that.spy.createCustomListItem = sinon.stub(that.carouselController.getView(), "createCustomListItem", function () {
			return {};
		});
		that.spy.insertCustomItem = sinon.stub(that.carouselController.getView(), "insertCustomItem", function () {});
		that.carouselController._relateChartsToItems[0] = {//simulate the current thumbnail is iconic
			identity: 4711
		}
		// act
		that.carouselController._replaceChangedRepresentation(oStep, 0);
		// check
		var rel = that.carouselController._relateChartsToItems[0];
		assert.strictEqual(that.carouselController._relateChartsToItems.length, 1, "THEN bookkeeping contains no new element");
		assert.strictEqual(rel.oChart, that.clonedChart, "THEN bookkeeping contains cloned chart");
		assert.strictEqual(rel.bIsAlternateView, false, "THEN bIsAlternateView indicates chart not icon");
		assert.strictEqual(rel.identity, undefined, "THEN the relation has been overwritten");
		assert.strictEqual(rel.typeOfChart, that.chartType, "THEN the chart type is carried over from the chart");
		assert.notStrictEqual(that.spy.isIconDisplayed.callCount, 0, "AND isIconDisplayed called at least once");
		assert.strictEqual(that.spy.createIconThumbnail.callCount, 0, "AND createIconThumbnail is not called");
		assert.strictEqual(that.spy.getClonedChart.callCount, 1, "AND _getClonedChart called");
	});
	QUnit.test("When calling _replaceChangedRepresentation", function (assert) {
		// prove: when switching from an iconic thumbnail to a chart, then the internal bookkeeping is correct
		assert.expect(6);
		// prep
		var that = this;
		that.carouselController.getView().useMainChart = false; // use corner text style
		var expectedIsAlternative = "iconic";
		var oRepr = {
			type: "hugo",
			bIsAlternateView: expectedIsAlternative
		};
		that.spy.isIconDisplayed = sinon.spy(WrappedChartWithCornerTexts, "isIconDisplayed");
		var oStep = {
			getSelectedRepresentation: function () {
				return oRepr;
			}
		};
		var expectedChart = {};
		var expectedCustomItem = {};
		var expectedThumbnailVLayout = {};
		var expectedItemVerticalLayout = {};
		that.spy.getClonedChart.restore();
		that.spy.getClonedChart = sinon.stub(WrappedChartWithCornerTexts, "getClonedChart", function () {
			return expectedChart;
		});
		that.spy.WrappedChartWithCornerTexts.restore();
		that.spy.WrappedChartWithCornerTexts = sinon.stub(WrappedChartWithCornerTexts, "constructor", function () {
			this.oThumbnailVLayout = expectedThumbnailVLayout;
			this.oItemVerticalLayout = expectedItemVerticalLayout;
			this.setHighlighted = function(){};
			this.setNonHighlighted = function(){};
			this.getContent = function(){};
		});
		that.spy.createCustomListItem.restore();
		that.spy.createCustomListItem = sinon.stub(that.carouselController.getView(), "createCustomListItem", function () {
			return expectedCustomItem;
		});
		that.spy.insertCustomItem = sinon.stub(that.carouselController.getView(), "insertCustomItem", function () {});
		that.carouselController._relateChartsToItems[0] = {
			oChart: null,
			bIsAlternateView: false,
			identity: 42
		}
		// act
		that.carouselController._replaceChangedRepresentation(oStep, 0);
		// check
		var rel = that.carouselController._relateChartsToItems[0];
		assert.notStrictEqual(rel.identity, 42, "THEN bookkeeping contains new object");
		assert.strictEqual(rel.oChart, expectedChart, "THEN bookkeeping of chart is ok");
		assert.strictEqual(rel.wrappedChartWithCornerTexts.oThumbnailVLayout, expectedThumbnailVLayout, "THEN bookkeeping of constructed boxes is ok");
		assert.strictEqual(rel.wrappedChartWithCornerTexts.oItemVerticalLayout, expectedItemVerticalLayout, "THEN bookkeeping of constructed boxes is ok");
		assert.strictEqual(rel.bIsAlternateView, expectedIsAlternative, "THEN bookkeeping of bIsAlternateView is ok");
		assert.strictEqual(rel.customListItem, expectedCustomItem, "THEN bookkeeping of expectedCustomItem is ok");
	});
	QUnit.test("When calling _getIndexOfCustomItem with existing sId)", function (assert) {
		// prove that it returns the correct index.
		var that = this;
		// prepare
		that.spy.getCustomItemList = sinon.stub(that.carouselView, "getCustomItemList", function () {
			return [{ sId: "1" }, { sId: "2" }, { sId: "hugo" }];
		});
		var expectedResult = 2;
		//act
		var result = that.carouselController._getIndexOfCustomItem("hugo");
		//check
		assert.strictEqual(result, expectedResult, "THEN index is " + expectedResult);
	});
	QUnit.test("When calling _getIndexOfCustomItem with non-existing sId)", function (assert) {
		// prove that it returns the correct index.
		var that = this;
		// prepare
		that.spy.getCustomItemList = sinon.stub(that.carouselView, "getCustomItemList", function () {
			return [{ sId: "1" }, { sId: "2" }, { sId: "hugo" }];
		});
		var expectedResult = -1;
		//act
		var result = that.carouselController._getIndexOfCustomItem("otto");
		//check
		assert.strictEqual(result, expectedResult, "THEN index is " + expectedResult);
	});
	QUnit.test("When calling deleteCustomListItem (delete the last step)", function (assert) {
		// prove that the core.removeStep is called with the correct callback which is: callBackForUpdatePath
		assert.expect(7);
		var that = this;
		// prepare
		simulateCorePathLength3(that, "c");
		var removeId = "c";
		var expectedStep = "c";
		var removeId = 2;
		var relation = this.carouselController._relateChartsToItems[removeId];
		that.carouselView.getCustomItemList()[removeId].sId = removeId;
		that.spy.coreRemoveStep = sinon.stub(that.coreReferences.coreApi, "removeStep", function () {}); // isolate
		//act
		that.carouselController.deleteCustomListItem(removeId);
		//check
		assert.strictEqual(that.spy.coreRemoveStep.callCount, 1, "THEN core.coreRemoveStep is called");
		assert.strictEqual(that.spy.coreRemoveStep.getCall(0).args[0], expectedStep,
			"AND it removes the active step which is the most recently added 'c'");
		assert.strictEqual(that.carouselView.getCustomItemList().length, 2, "AND one item has been removed");
		// simulate the callback call by coreRemoveStep since core.coreRemoveStep is suppressed (stubbed empty).
		that.spy.coreRemoveStep.getCall(0).args[1](); // call back
		assert.strictEqual(that.spy.callBackForUpdatePath.callCount, 1, "THEN param 1 of coreRemoveStep is callBackForUpdatePath");
		assert.strictEqual(that.spy._destroyItemAndChart.callCount, 1, "THEN chart and its custom item are destroyed");
		assert.strictEqual(that.spy._destroyItemAndChart.getCall(0).args[0], relation, "AND the relation of the removed step is used for destroy");
		consistentDoubleBookkeeping(assert, that);
	});
	QUnit.test("When calling deleteCustomListItem)", function (assert) {
		// prove that Carousel.removeStep is called and that the bookkeeping on the 2 lists is called consistently.
		var that = this;
		// prepare
		simulateCorePathLength3(that, "c");
		that.spy.coreRemoveStep = sinon.stub(that.coreReferences.coreApi, "removeStep", function () {}); // isolate
		that.spy.getCustomItemList = sinon.stub(that.carouselView, "getCustomItemList", function () {
			return [{ sId: "1" }, { sId: "2" }, { sId: "hugo" }];
		});
		var indexOfRemoval = 2;
		//act
		that.carouselController.deleteCustomListItem("hugo");
		//check
		assert.strictEqual(that.spy.removeStep.callCount, 1, "THEN carousel.removeStep is called");
		assert.strictEqual(that.spy.removeStep.getCall(0).args[0], indexOfRemoval, "THEN param0 is the step index to be removed (index===2)");
		assert.strictEqual(that.spy.removeCustomItem.callCount, 1, "THEN carousel.removeCustomItem is called");
		assert.strictEqual(that.spy.removeCustomItem.getCall(0).args[0], indexOfRemoval, "THEN the item is removed on index===2");
		assert.strictEqual(that.spy.deleteFromBookkeeping.callCount, 1, "THEN carousel.deleteFromBookkeeping is called");
		assert.strictEqual(that.spy.deleteFromBookkeeping.getCall(0).args[0], indexOfRemoval, "THEN the item is removed on index===2");
	});
	QUnit.test("When calling deleteCustomListItem and deleting the 1st step which is active)", function (assert) {
		// prove that Carousel.removeStep is called and that the bookkeeping on the 2 lists is called consistently.
		assert.expect(8);
		var that = this;
		// prepare
		simulateCorePathLength3(that, "a");
		that.spy.coreRemoveStep = sinon.stub(that.coreReferences.coreApi, "removeStep", function () {}); // isolate
		that.spy.getCustomItemList = sinon.stub(that.carouselView, "getCustomItemList", function () {
			return [{ sId: "hugo" }, { sId: "2" }, { sId: "3" }]
		});
		var expectedIndexOfRemoval = 0;
		//act
		that.carouselController.deleteCustomListItem("hugo");
		//check
		assert.strictEqual(that.spy.removeStep.callCount, 1, "THEN carousel.removeStep is called");
		assert.strictEqual(that.spy.removeStep.getCall(0).args[0], expectedIndexOfRemoval, "THEN param0 is the step index to be removed ");
		assert.strictEqual(that.spy.removeCustomItem.callCount, 1, "THEN carousel.removeCustomItem is called");
		assert.strictEqual(that.spy.removeCustomItem.getCall(0).args[0], expectedIndexOfRemoval, "THEN the item is removed on index===0");
		assert.strictEqual(that.spy.deleteFromBookkeeping.callCount, 1, "THEN carousel.deleteFromBookkeeping is called");
		assert.strictEqual(that.spy.deleteFromBookkeeping.getCall(0).args[0], expectedIndexOfRemoval, "THEN the item is removed on index===0");
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 1, "THEN the first step is set to active");
		assert.strictEqual(that.spy.coreSetActiveStep.getCall(0).args[0], "b", "AND it is the 2nd step");
	});
	QUnit.test("When calling deleteCustomListItem and deleting the 2nd active step of two (s-a)", function (assert) {
		// prove that Carousel.removeStep is called and that the bookkeeping on the 2 lists is called consistently.
		var that = this;
		// prepare
		simulateCorePathLengthN(that, "b", 2);
		that.spy._setHighlightingOfActiveStep.reset(); // since addStep also uses it.
		that.spy.coreRemoveStep = sinon.stub(that.coreReferences.coreApi, "removeStep", function () {}); // isolate
		that.spy.getCustomItemList = sinon.stub(that.carouselView, "getCustomItemList", function () {
			return [{ sId: "a" }, { sId: "bbb" }]
		});
		var expectedIndexOfRemoval = 1;
		var expectedActiveStep = "a";
		var expectedActiveIndex = 0;
		//act
		that.carouselController.deleteCustomListItem("bbb");
		//check
		assert.strictEqual(that.spy.removeStep.callCount, 1, "THEN carousel.removeStep is called");
		assert.strictEqual(that.spy.removeStep.getCall(0).args[0], expectedIndexOfRemoval, "THEN param0 is the step index to be removed ");
		assert.strictEqual(that.spy.removeCustomItem.callCount, 1, "THEN carousel.removeCustomItem is called");
		assert.strictEqual(that.spy.removeCustomItem.getCall(0).args[0], expectedIndexOfRemoval, "THEN the item is removed on index===0");
		assert.strictEqual(that.spy.deleteFromBookkeeping.callCount, 1, "THEN carousel.deleteFromBookkeeping is called");
		assert.strictEqual(that.spy.deleteFromBookkeeping.getCall(0).args[0], expectedIndexOfRemoval, "THEN the item is removed on index===0");
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 1, "THEN the first step is set to active");
		assert.strictEqual(that.spy.coreSetActiveStep.getCall(0).args[0], expectedActiveStep, "AND it is the 1st step");

		assert.strictEqual(that.spy._setHighlightingOfActiveStep.called, true, "THEN a step is set to active");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.getCall(0).args[0], expectedActiveIndex, "AND it is the 1st step");
	});
	/*
	* test cases:
	* a-s-s remove 1st: 2nd gets active.
	* a-s-s remove 2nd: 1st is not changed.
	* a remove lst: nothing set active
	* s-s-a remove 3rd: 2nd gets active
	 */
	QUnit.test("When calling removeStep - remove an active first step (a-s-s)", function (assert) {
		var that = this;
		// prepare
		simulateCorePathLength3(that, "a", 1);
		that.spy._setHighlightingOfActiveStep.reset(); // since addStep also uses it.
		that.spy.coreRemoveStep = sinon.stub(that.coreReferences.coreApi, "removeStep", function () {}); // isolate
		var indexOfRemoval = 0;
		var expectedIndexOfActive = 0;
		//act
		that.carouselController.removeStep(indexOfRemoval);
		//check
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 1, "THEN the active step is changed");
		assert.strictEqual(that.spy.setActiveStepAfterRemove.callCount, 1, "THEN setActiveStepAfterRemove is called");
		assert.strictEqual(that.spy.setActiveStepAfterRemove.getCall(0).args[0], expectedIndexOfActive, "AND param0 is expectedIndex=0");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.called, true, "THEN the active step is highlighted");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.getCall(0).args[0], expectedIndexOfActive, "THEN the active step is highlighted");
	});
	QUnit.test("When calling removeStep - remove an active last step (s-s-a)", function (assert) {
		var that = this;
		// prepare
		simulateCorePathLength3(that, "c");
		that.spy._setHighlightingOfActiveStep.reset(); // since addStep also uses it.
		that.spy.coreRemoveStep = sinon.stub(that.coreReferences.coreApi, "removeStep", function () {}); // isolate
		var indexOfRemoval = 2;
		var expectedIndexOfActive = 1;
		//act
		that.carouselController.removeStep(indexOfRemoval);
		//check
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 1, "THEN the active step is changed");
		assert.strictEqual(that.spy.setActiveStepAfterRemove.callCount, 1, "THEN setActiveStepAfterRemove is called");
		assert.strictEqual(that.spy.setActiveStepAfterRemove.getCall(0).args[0], 2, "AND param0 is expectedIndex=1");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.called, true, "THEN the active step is highlighted");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.getCall(0).args[0], expectedIndexOfActive, "THEN set the 2nd as highlighted");
	});
	QUnit.test("When calling removeStep - remove some non-active step (a-s-s)", function (assert) {
		var that = this;
		// prepare
		simulateCorePathLength3(that, "a");
		that.spy._setHighlightingOfActiveStep.reset(); // since addStep also uses it.
		that.spy.coreRemoveStep = sinon.stub(that.coreReferences.coreApi, "removeStep", function () {}); // isolate
		var indexOfRemoval = 1;
		//act
		that.carouselController.removeStep(indexOfRemoval);
		//check
		assert.strictEqual(that.spy.setActiveStepAfterRemove.callCount, 0, "THEN setActiveStepAfterRemove is not called");
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 0, "THEN the active step remains unchanged");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.callCount, 0, "THEN the active step remains highlighted");
	});
	QUnit.test("When calling removeStep - remove the only active step (a)", function (assert) {
		var that = this;
		// prepare
		simulateCorePathLengthN(that, "a", 1);
		that.spy._setHighlightingOfActiveStep.reset(); // since addStep also uses it.
		that.spy.coreRemoveStep = sinon.stub(that.coreReferences.coreApi, "removeStep", function () {}); // isolate
		var indexOfRemoval = 0;
		//act
		that.carouselController.removeStep(indexOfRemoval);
		//check
		assert.strictEqual(that.spy.setActiveStepAfterRemove.callCount, 0, "THEN there is no active step");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.callCount, 0, "THEN nothing to highlighted");
	});
	QUnit.test("When calling setActiveStepAfterRemove for an index > 0, case remove some non-active", function (assert) {
		// case (s-s-a): prove that when removing a non active step the active step and its highlighting remains unchanged.
		var that = this;
		var active = "c";
		simulateCorePathLength3(that, active);
		that.spy._setHighlightingOfActiveStep.reset(); // since addStep also uses it.
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 0, "PRE-COND: core.setActiveStep is not yet called");
		// act
		that.carouselController.setActiveStepAfterRemove(1);
		that.carouselController.setActiveStepAfterRemove(0);
		// check
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 0, "THEN no call to core.setActiveStep");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.callCount, 0, "THEN no highlighting is set");
	});
	QUnit.test("When calling setActiveStepAfterRemove for an index > 0, case 1: index===length-1", function (assert) {
		// case (s-s-a): removed the last of many steps
		var that = this;
		var active = "c";
		simulateCorePathLength3(that, active);
		var indexOfRemoval = 2;
		that.spy._setHighlightingOfActiveStep.reset(); // since addStep also uses it.
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 0, "PRE-COND: core.setActiveStep is not yet called");
		// act
		that.carouselController.setActiveStepAfterRemove(indexOfRemoval);
		var expectedActiveStep = "b";
		var expectedIndexOfActive = 1;
		// check
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 1, "THEN core.setActiveStep is called");
		assert.strictEqual(that.spy.coreSetActiveStep.getCall(0).args[0], expectedActiveStep, "AND set the 2nd step active");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.called, true, "THEN the active step is highlighted");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.getCall(0).args[0], expectedIndexOfActive, "THEN set the 2nd as highlighted");
	});
	QUnit.test("When calling setActiveStepAfterRemove for an index > 0, case 1: 0<index<length-1", function (assert) {
		// case 2 (s-a-s): not the last and not the first, but the one before the last step (the 2nd), and the 2nd is active.
		var that = this;
		var indexOfRemoval = 1;
		var active = "b";
		simulateCorePathLength3(that, active);
		that.spy._setHighlightingOfActiveStep.reset(); // since addStep also uses it.
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 0, "PRE-COND: core.setActiveStep is not yet called");
		var expectedActiveStep = "c";
		var expectedIndexOfActive = 1;
		// act
		that.carouselController.setActiveStepAfterRemove(indexOfRemoval);
		// check
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 1, "THEN core.setActiveStep is called");
		assert.strictEqual(that.spy.coreSetActiveStep.getCall(0).args[0], expectedActiveStep, "AND set the 3rd step as active");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.called, true, "THEN set highlighted");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.getCall(0).args[0], expectedIndexOfActive, "THEN set the 2nd as highlighted");
	});
	QUnit.test("When calling setActiveStepAfterRemove for an index ===0", function (assert) {
		// case 2 (a-s): the first steps is removed and active, of 2 steps
		var that = this;
		var indexOfRemoval = 0;
		var active = "a";
		simulateCorePathLengthN(that, active, 2);
		that.spy._setHighlightingOfActiveStep.reset(); // since addStep also uses it.
		var expectedActiveStep = "b";
		var expectedIndexOfActive = 0;
		// act
		that.carouselController.setActiveStepAfterRemove(indexOfRemoval);
		// check
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 1, "THEN core.setActiveStep is called");
		assert.strictEqual(that.spy.coreSetActiveStep.getCall(0).args[0], expectedActiveStep, "AND set the 3rd step as active");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.called, true, "THEN set highlighted");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.getCall(0).args[0], expectedIndexOfActive, "THEN set the 2nd as highlighted");
	});
	QUnit.test("When calling setActiveStepAfterRemove for an index ===0", function (assert) {
		// case 2 (a-s): the first steps is removed and active, of 2 steps
		var that = this;
		var indexOfRemoval = 0;
		var active = "a";
		simulateCorePathLengthN(that, active, 2);
		that.spy._setHighlightingOfActiveStep.reset(); // since addStep also uses it.
		var expectedActiveStep = "b";
		var expectedIndexOfActive = 0;
		// act
		that.carouselController.setActiveStepAfterRemove(indexOfRemoval);
		// check
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 1, "THEN core.setActiveStep is called");
		assert.strictEqual(that.spy.coreSetActiveStep.getCall(0).args[0], expectedActiveStep, "AND set the 3rd step as active");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.called, true, "THEN set highlighted");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.getCall(0).args[0], expectedIndexOfActive, "THEN set the 2nd as highlighted");
	});
	QUnit.test("When calling setActiveStepAfterRemove for index === 0", function (assert) {
		// case (s-a): remove the last and active
		var that = this;
		var indexOfRemoval = 1;
		var active = "b";
		simulateCorePathLengthN(that, active, 2);
		that.spy._setHighlightingOfActiveStep.reset(); // since addStep also uses it.
		var expectedActiveStep = "a";
		var expectedIndexOfActive = 0;
		// act
		that.carouselController.setActiveStepAfterRemove(indexOfRemoval);
		// check
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 1, "THEN core.setActiveStep is called");
		assert.strictEqual(that.spy.coreSetActiveStep.getCall(0).args[0], expectedActiveStep, "AND and set the 2nd step to active");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.called, true, "THEN set highlighted");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.getCall(0).args[0], expectedIndexOfActive, "THEN set the 2nd as highlighted");
	});
	QUnit.test("When calling setActiveStepAfterRemove and index of active and removed are not equal", function (assert) {
		// Prove that the setActiveStep is not called.
		var that = this;
		var indexOfRemoval = 1;
		var active = "a";
		simulateCorePathLength3(that, active);
		// act
		that.carouselController.setActiveStepAfterRemove(indexOfRemoval);
		// check
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 0, "THEN core.setActiveStep is not called");
	});
	QUnit.test("When calling onListItemPressed (change of selection in path)", function(assert) {
		assert.expect(3);
	//prep
		var that = this;
		var selStepIndex = 0;
		var selectId = "hugo";
		var event = {
			getParameters : function(){
				return {
					id: selectId
				}
			}
		};
		that.spy._getIndexOfCustomItem = sinon.spy(that.carouselController, "_getIndexOfCustomItem");
		this.spy.changeActiveStep = sinon.stub(this.carouselController, "changeActiveStep", function(){});
		this.spy.getCustomItemList = sinon.stub(this.carouselView, "getCustomItemList", function(){
			return [{
				sId : selectId // interface contract
			}];
		});
	//act
		that.carouselController.listItemPressed(event);
	//check
		assert.strictEqual(that.spy._getIndexOfCustomItem.callCount, 1, "THEN carousel._getIndexOfCustomItem is called");
		assert.strictEqual(this.spy.changeActiveStep.callCount, 1, "Then changeActiveStep called");
		assert.strictEqual(this.spy.changeActiveStep.getCall(0).args[0], selStepIndex, "Then changeActiveStep called");
	});
	QUnit.test("When calling changeActiveStep", function(assert) {
		assert.expect(6);
		// prove that the correct step is determined and calls go to core-instance: setActiveStep and UI-instance: selectionChanged
		var that = this;
		// prepare
		simulateCorePathLength3(that, "c"); // stubs core.getSteps() : ["a","b","c"]
		var selStepIndex = 1;
		var selectedStep = that.carouselController.oCoreApi.getSteps()[selStepIndex];

		that.spy.selectionChanged = sinon.spy(that.carouselController.oUiApi, "selectionChanged");
		that.spy._setHighlightingOfActiveStep.reset();
		//act
		that.carouselController.changeActiveStep(selStepIndex);
		//check
		assert.strictEqual(that.spy.coreSetActiveStep.callCount, 1, "THEN core.setActiveStep is called");
		assert.strictEqual(that.spy.coreSetActiveStep.getCall(0).args[0], selectedStep, "THEN param0 is the correct step");
		assert.strictEqual(that.spy.selectionChanged.callCount, 1, "THEN UiApi.selectionChanged is called");
		assert.strictEqual(that.spy.selectionChanged.getCall(0).args[0], false, "AND param0 is false");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.callCount, 1, "AND the highlighting is set");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.getCall(0).args[0], selStepIndex, "AND the selected step is highlighted");
	});
	QUnit.test("When calling _moveStep - move from pos 0 to 0", function(assert) {
		// prove that sap.apf.core.moveStepToPosition is not called, neither its callback.
		var that = this;
		// prepare
		simulateCorePathLength3(that, "a");
		that.spy.callBackForUpdatePath = sinon.spy(that, "callBackForUpdatePath");
		that.spy.moveStepToPosition = sinon.stub(that.coreReferences.coreApi, "moveStepToPosition",
			function(step, targetIndex, callBackForUpdatePath){
				callBackForUpdatePath();
		}); // isolate
		var indexFrom = 1;
		var indexTo = 1;
		//act
		that.carouselController._moveStep(indexFrom, indexTo, indexTo);
		//check
		assert.strictEqual(that.spy.moveStepToPosition.callCount, 0, "THEN core.moveStepToPosition is not called");
		assert.strictEqual(that.spy.callBackForUpdatePath.callCount, 0, "THEN callBackForUpdatePath is not called");
		consistentDoubleBookkeeping(assert, that);
	});
	QUnit.test("When calling _moveStep - move from pos 0 to 1", function(assert) {
		// prove that sap.apf.core.moveStepToPosition is called, and that analysisPath.callBackForUpdatePath is passed as a callback.
		var that = this;
		var resultOfCallback;
		// prepare
		simulateCorePathLength3(that, "a");
		that.spy.moveStepToPosition = sinon.stub(that.coreReferences.coreApi, "moveStepToPosition",
			function(step, targetIndex, callBackForUpdatePath){
				resultOfCallback = callBackForUpdatePath();
			}); // isolate
		var indexFrom = 0;
		var indexTo = 1;
		//act
		that.carouselController._moveStep(indexFrom, indexTo, indexTo);
		//check
		assert.strictEqual(that.spy.moveStepToPosition.callCount, 1, "THEN core.moveStepToPosition is called");
		assert.strictEqual(resultOfCallback, "callBackForUpdatePath", "THEN callBackForUpdatePath is called");
		consistentDoubleBookkeeping(assert, that);
	});
	QUnit.test("When calling handleMove - move down the 1st step", function(assert) {
		// prove that carousel._moveStep is called.
		var that = this;
		// prepare
		simulateCorePathLength3(that, "a"); // given step at index is active
		that.spy._moveStep = sinon.stub(that.carouselController, "_moveStep", function(){}); // isolate
		//act
		that.carouselController.handleMove({down : true});
		//check
		assert.strictEqual(that.spy._moveStep.callCount, 1, "THEN core._moveStep is called");
		assert.strictEqual(that.spy._moveStep.getCall(0).args[0], 0, "THEN source index is 0");
		assert.strictEqual(that.spy._moveStep.getCall(0).args[1], 1, "THEN target index is 1");
	});
	QUnit.test("When calling handleMove - move down the last step", function(assert) {
		// prove that no move happens
		var that = this;
		// prepare
		simulateCorePathLength3(that, "c"); // given step at index is active
		that.spy._moveStep = sinon.stub(that.carouselController, "_moveStep", function(){}); // isolate
		//act
		that.carouselController.handleMove({down : true});
		//check
		assert.strictEqual(that.spy._moveStep.callCount, 0, "THEN core._moveStep is not called");
	});
	QUnit.test("When calling handleMove - move up the 2nd step", function(assert) {
		// prove that carousel._moveStep is called.
		var that = this;
		// prepare
		simulateCorePathLength3(that, "b"); // given step at index is active
		that.spy._moveStep = sinon.stub(that.carouselController, "_moveStep", function(){}); // isolate
		//act
		that.carouselController.handleMove({});
		//check
		assert.strictEqual(that.spy._moveStep.callCount, 1, "THEN core._moveStep is called");
		assert.strictEqual(that.spy._moveStep.getCall(0).args[0], 1, "THEN source index is 1");
		assert.strictEqual(that.spy._moveStep.getCall(0).args[1], 0, "THEN target index is 0");
	});
	QUnit.test("When calling handleMove - move up the 1st step", function(assert) {
		// prove that no move happens
		var that = this;
		// prepare
		simulateCorePathLength3(that, "a"); // given step at index is active
		that.spy._moveStep = sinon.stub(that.carouselController, "_moveStep", function(){}); // isolate
		//act
		that.carouselController.handleMove({down : false}); // this is a valid parameter as well
		//check
		assert.strictEqual(that.spy._moveStep.callCount, 0, "THEN core._moveStep is not called");
	});
	QUnit.test("When calling handleMove - move up in an empty path", function(assert) {
		// prove that no move happens
		var that = this;
		// prepare
		that.spy._moveStep = sinon.stub(that.carouselController, "_moveStep", function(){}); // isolate
		//act
		that.carouselController.handleMove({down : false}); // this is a valid parameter as well
		//check
		assert.strictEqual(that.spy._moveStep.callCount, 0, "THEN core._moveStep is not called");
	});
	QUnit.test("When calling handleMove - move down in an empty path", function(assert) {
		// prove that no move happens
		var that = this;
		// prepare
		that.spy._moveStep = sinon.stub(that.carouselController, "_moveStep", function(){}); // isolate
		//act
		that.carouselController.handleMove({down : true});
		//check
		assert.strictEqual(that.spy._moveStep.callCount, 0, "THEN core._moveStep is not called");
	});
	QUnit.test("When calling isIconDisplayed - table", function(assert) {// fixme move to test wich provides a representation
		assert.expect(1);
		//prep
		var oRepr = {
			type: UtilsConstants.representationTypes.TABLE_REPRESENTATION
		};
		//act
		var result = WrappedChartWithCornerTexts.isIconDisplayed(oRepr);
		//check
		assert.strictEqual(result, true, "THEN returns true");
	});
	QUnit.test("When calling isIconDisplayed - tree table", function(assert) {
		assert.expect(1);
		//prep
		var oRepr = {
			type: UtilsConstants.representationTypes.TREE_TABLE_REPRESENTATION
		};
		//act
		var result = WrappedChartWithCornerTexts.isIconDisplayed(oRepr);
		//check
		assert.strictEqual(result, true, "THEN returns true");
	});
	QUnit.test("When calling isIconDisplayed - alternative representation/table", function(assert) {
		assert.expect(1);
		//prep
		simulateCorePathLengthN (this, "a", 1);
		var oRepr = {
			type : UtilsConstants.representationTypes.COLUMN_CHART,
			bIsAlternateView : true
		}
		//act
		var result = WrappedChartWithCornerTexts.isIconDisplayed(oRepr);
		//check
		assert.strictEqual(result, true, "THEN returns true");
	});
	QUnit.test("When calling isIconDisplayed - any other representation (chart)", function(assert) {
		var oRepr = {
			type: UtilsConstants.representationTypes.COLUMN_CHART,
			bIsAlternateView: false
		};
		//act
		var result = WrappedChartWithCornerTexts.isIconDisplayed(oRepr);
		//check
		assert.strictEqual(result, false, "THEN returns false");
	});
	QUnit.test("When calling isTreeTable - any chart type", function(assert) {
		var oRepr = {
			type: UtilsConstants.representationTypes.COLUMN_CHART,
			bIsAlternateView: true // intentionally, shall not influence the result
		};
		//act
		var result = WrappedChartWithCornerTexts.isTreeTable(oRepr);
		//check
		assert.strictEqual(result, false, "THEN returns false");
	});
	QUnit.test("When calling isTreeTable - treeTable type", function(assert) {
		var oRepr = {
			type: UtilsConstants.representationTypes.TREE_TABLE_REPRESENTATION,
			bIsAlternateView: false
		};
		//act
		var result = WrappedChartWithCornerTexts.isTreeTable(oRepr);
		//check
		assert.strictEqual(result, true, "THEN returns true");
	});
	QUnit.test("When calling createIconThumbnail - treeTable type", function(assert) {
		var oRepr = {
			type: UtilsConstants.representationTypes.TREE_TABLE_REPRESENTATION,
			bIsAlternateView: false
		};
		//act
		var result = WrappedChartWithCornerTexts.createIconThumbnail(oRepr);
		//check
		assert.strictEqual(result.getSrc(), "sap-icon://tree", "THEN returns a tree icon");
	});
	QUnit.test("When calling createIconThumbnail - table type", function(assert) {
		var oRepr = {
			type: UtilsConstants.representationTypes.TABLE_REPRESENTATION,
			bIsAlternateView: false
		};
		//act
		var result = WrappedChartWithCornerTexts.createIconThumbnail(oRepr);
		//check
		assert.strictEqual(result.getSrc(), "sap-icon://table-chart", "THEN returns a table-chart icon");
	});
	QUnit.test("When calling getClonedChart - table type", function(assert) {
		var oRepr = {
			type: UtilsConstants.representationTypes.TABLE_REPRESENTATION
		};
		var oStep = {
			getSelectedRepresentation : function(){
				return oRepr;
			}
		};
		this.spy.getClonedChart.restore();
		//act
		var result = WrappedChartWithCornerTexts.getClonedChart(oStep);
		//check
		assert.strictEqual(result.getSrc(), "sap-icon://table-chart", "THEN returns a table-chart icon");
	});
	QUnit.test("When calling getClonedChart - chart type", function(assert) {
		var clone = {};
		var originalChart = {
			clone : function () {
				return clone;
			}
		};
		var oRepr = {
			type: UtilsConstants.representationTypes.COLUMN_CHART,
			getChartForCustomListItem : function() {
				return originalChart;
			},
			chart4CustomItemList : originalChart
		};
		var oStep = {
			getSelectedRepresentation : function(){
				return oRepr;
			}
		};
		this.spy.getClonedChart.restore();
		//act
		var result = WrappedChartWithCornerTexts.getClonedChart(oStep);
		//check
		assert.strictEqual(result, clone, "THEN returns a table-chart icon");
	});
	QUnit.test("Given createRelation When calling setBusyFromIndex", function (assert) {
		assert.expect(3);
		//prep
		var that = this;
		that.spy.getClonedChart.restore();
		that.spy.getClonedChart = sinon.stub(WrappedChartWithCornerTexts, "getClonedChart", function(){
			return { id : "42" };
		});
		that.fnSetBusy = sinon.stub();
		that.spy.createCustomListItem.restore();
		that.spy.createCustomListItem = sinon.stub(that.carouselController.getView(), "createCustomListItem", function(){
			return {
				setBusy : that.fnSetBusy
			};
		});
		var oRepr = {
			type: "hugo"
		};
		var oStep = {
			getSelectedRepresentation: function () {
				return oRepr;
			}
		};
		var relation = that.carouselController._createRelation(oStep); // build bookkeeping relation by prod code
		this.carouselController._relateChartsToItems.push(relation);
		//act
		that.carouselController.setBusyFromIndex(0); // uses bookkeping relation
		//check
		assert.strictEqual(that.spy._setBusyOnCustomListItem.callCount, 1, "THEN set busy called");
		assert.strictEqual(that.spy._setBusyOnCustomListItem.getCall(0).args[0], relation, 'AND set busy at 1st step');
		assert.strictEqual(that.spy._setBusyOnCustomListItem.getCall(0).args[1], true, 'AND set busy === true');
	});
	QUnit.test("When calling _destroyItemAndChart", function (assert) {
		assert.expect(2);
		var that = this;
	//prep
		var relation = {
			oChart : {
				destroy : function(){}
			},
			customListItem : {
				destroy : function(){}
			}
		};
		that.spy.destroyChart = sinon.spy(relation.oChart, "destroy");
		that.spy.destroyItem = sinon.spy(relation.customListItem, "destroy");
		that.spy._destroyItemAndChart.restore();
		that.spy._destroyItemAndChart = sinon.spy(that.carouselController, "_destroyItemAndChart");
	//act
		that.carouselController._destroyItemAndChart(relation)
	//check
		assert.strictEqual(that.spy.destroyChart.callCount, 1, 'THEN chart is destroyed');
		assert.strictEqual(that.spy.destroyItem.callCount, 1, 'THEN item is destroyed');
	});
	QUnit.test("Given a main chart - When calling _getClonedChart", function (assert) {
		// Prove that when a step's main chart exists it is used for the clone. This is the case when the step is active.
		// Otherwise, prove that the thumbnail chart is used and cloned.
	// prep
		var that = this;
		var clone = {
			detachSelectData: sinon.spy(),
			detachDeselectData: sinon.spy()
		};
		var chart = {
			clone : function(){
				return clone;
			}
		};
		var oRepr = {
			type: "hugo",
			chart : chart,
			fnHandleSelection: function(){}
		};
		var oStep = {
			getSelectedRepresentation: function () {
				return oRepr;
			}
		};
		that.spy.getClonedChart.restore();
		that.spy.chartClone = sinon.spy(chart, "clone");
	//act
		WrappedChartWithCornerTexts.getClonedChart(oStep);
	//check
		assert.strictEqual(that.spy.chartClone.callCount, 1, "THEN the chart is cloned");
		assert.strictEqual(clone.detachSelectData.callCount, 1, "THEN detachSelectData is removed from the clone");
		assert.strictEqual(clone.detachDeselectData.callCount, 1, "THEN detachDeselectData is removed from the clone");
	});
	QUnit.test("Given no main chart is available - When calling _getClonedChart", function (assert) {
		// prove that the alternative chart is used and cloned.
	// prep
		assert.expect(1);
		var that = this;
		var clone = {
			detachSelectData: sinon.spy(),
			detachDeselectData: sinon.spy()
		};
		var someChart = {
			clone : function(){
				return clone;
			},
			sId : "sid42"
		};
		var oRepr = {
			getChartForCustomListItem : function() {
				return someChart;
			},
			chart4CustomItemList : someChart
		};
		var oStep = {
			getSelectedRepresentation: function () {
				return oRepr;
			}
		};
		that.spy.getClonedChart.restore();
		that.spy.chartClone = sinon.spy(someChart, "clone");
	//act
		WrappedChartWithCornerTexts.getClonedChart(oStep);
	//check
		assert.strictEqual(that.spy.chartClone.callCount, 1, "THEN the chart is cloned");
	});
	QUnit.test("Given an iconic chart - When calling _getClonedChart", function (assert) {
		// prove that the thumbnail chart is used and cloned.
		assert.expect(3);
	// prep
		var that = this;
		var clone = {
			detachSelectData: sinon.spy(),
			detachDeselectData: sinon.spy()
		};
		var someChart = {
			clone : function(){
				return clone;
			}
		};
		var oRepr = {
			thumbnailChart: someChart,
			chart: someChart
		};
		var oStep = {
			getSelectedRepresentation: function() {
				return oRepr;
			}
		};
		that.spy.getClonedChart.restore();
		that.spy.chartClone = sinon.spy(someChart, "clone");
		that.spy.isIconDisplayed = sinon.stub(WrappedChartWithCornerTexts, "isIconDisplayed", function() {
			return true; // stub that it is iconic
		});
		that.spy.createIconThumbnail.restore();
		that.spy.createIconThumbnail = sinon.stub(WrappedChartWithCornerTexts, "createIconThumbnail", function(){
			return {};
		});
	//act
		WrappedChartWithCornerTexts.getClonedChart(oStep);
	//check
		assert.strictEqual(that.spy.chartClone.called, false, "THEN the chart is not cloned");
		assert.strictEqual(that.spy.isIconDisplayed.callCount, 1, "THEN isIconDisplayed is checked");
		assert.strictEqual(that.spy.createIconThumbnail.callCount, 1, "THEN a thumbnail chart is created");
	});
	QUnit.test("Given more steps than custom items, When calling updateCustomListView", function (assert) {
		// prove that superfluous custom items will be removed.
		var that = this;
		//prepare
		var nIndex = 0;
		var oRepr = {
			type : "42"
		};
		var oStep = {
			getSelectedRepresentation : function () {
				return oRepr;
			}
		};
		simulateCorePathLengthN(that, "a", 1);
		that.carouselController._relateChartsToItems[nIndex].typeOfChart = oRepr.type;
		this.carouselController._relateChartsToItems.push("hugo");
		this.carouselController._relateChartsToItems.push("mara");
		that.spy._setSelectionsOnThumbnailAndEnforceRendering.restore();
		that.spy._setSelectionsOnThumbnailAndEnforceRendering = sinon.stub(that.carouselController,
			"_setSelectionsOnThumbnailAndEnforceRendering", function(){});
		that.spy._pruneRelateChartsToItems.restore();
		//act
		that.carouselController.updateCustomListView(oStep, 0, false);
		//check
		assert.strictEqual(that.carouselController._relateChartsToItems.length, that.coreReferences.coreApi.getSteps().length, "THEN bookkeeping and path have the same length");
	});
	QUnit.test("GIVEN an open path setting WHEN calling updateCustomListView", function(assert) {
		// prove that any step added in a position before the active step will not be highlighted
	//prep
		var that = this;
		var oRepr = {
		};
		var oStep = {
			getSelectedRepresentation: function () {
				return oRepr;
			}
		};
		var posOfAddedStep = this.carouselController._relateChartsToItems.length ; // condition to call _addStepAsCustomItem
		var bStepChanged = true;
		var posOfActiveStep = posOfAddedStep + 1;
		that.spy._addStepAsCustomItem = sinon.stub(that.carouselController, "_addStepAsCustomItem", function(){
		});
		that.spy.getActiveStepIndex = sinon.stub(that.carouselController, "getActiveStepIndex", function(){
			return posOfActiveStep; // the index of the active step must be higher
		});
		// there are no steps yet
	//act
		that.carouselController.updateCustomListView(oStep, posOfAddedStep, bStepChanged);
	//check
		assert.strictEqual(that.spy._addStepAsCustomItem.callCount, 1, "THEN add a step");
		assert.strictEqual(that.spy._setSelectionsOnThumbnailAndEnforceRendering.callCount, 1, "THEN set selections which is important for openPath");
		assert.strictEqual(that.spy._removeHighlightingOfAnyStep.callCount, 1, "THEN remove all highlights");
		assert.strictEqual(that.spy._removeHighlightingOfAnyStep.getCall(0).args[0], posOfActiveStep, "AND exclude the active step");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.callCount, 0, "AND no active step set");
	})
	QUnit.test("GIVEN open path or add step WHEN calling updateCustomListView", function(assert) {
		// prove that the step added in the active step position will be highlighted, and others not.
	// prep
		var that = this;
		var oRepr = {
		};
		var oStep = {
			getSelectedRepresentation: function () {
				return oRepr;
			}
		};
		var posOfAddedStep = this.carouselController._relateChartsToItems.length ; // condition to call _addStepAsCustomItem
		var bStepChanged = true;
		var posOfActiveStep = posOfAddedStep; // condition adding an active step and highlighting it
		that.spy._addStepAsCustomItem = sinon.stub(that.carouselController, "_addStepAsCustomItem", function(){
		});
		that.spy.getActiveStepIndex = sinon.stub(that.carouselController, "getActiveStepIndex", function(){
			return posOfActiveStep; // the index of the active step must be higher
		});
		// there are no steps yet
		//act
		that.carouselController.updateCustomListView(oStep, posOfAddedStep, bStepChanged);
		//check
		assert.strictEqual(that.spy._addStepAsCustomItem.callCount, 1, "THEN add a step");
		assert.strictEqual(that.spy._setSelectionsOnThumbnailAndEnforceRendering.callCount, 1, "THEN set selections which is important for openPath");
		assert.strictEqual(that.spy._removeHighlightingOfAnyStep.callCount, 1, "THEN remove all highlights");
		assert.strictEqual(that.spy._removeHighlightingOfAnyStep.getCall(0).args[0], posOfActiveStep, "AND exclude the active step");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.callCount, 1, "AND no active step set");
		assert.strictEqual(that.spy._setHighlightingOfActiveStep.getCall(0).args[0], posOfActiveStep, "AND highlight the active step");
	})
	QUnit.test("GIVEN navigateToStep or listItemPressed - When calling _removeHighlightingOfActiveStep", function(assert) {
		// prove that highlighting is set along a reference contract
	//prop
		var inxOfOldActiveStep = 0;
		var oRelation = {
			wrappedChartWithCornerTexts : {
				oThumbnailVLayout : {
					removeStyleClass : function(){},
					addStyleClass : function () {}
				},
				setHighlighted : function(){},
				setNonHighlighted : function () {}
			}
		};
		this.carouselController._relateChartsToItems = [ oRelation, {} ];
		this.spy.getActiveStepIndex = sinon.stub(this.carouselController, "getActiveStepIndex", function(){
			return inxOfOldActiveStep;
		});
		this.spy._setHighlightingOfActiveStep.restore();
		this.spy.setHighlighted = sinon.spy(oRelation.wrappedChartWithCornerTexts, "setHighlighted");
		this.spy.setNonHighlighted = sinon.spy(oRelation.wrappedChartWithCornerTexts, "setNonHighlighted");
	// act
		this.carouselController._removeHighlightingOfActiveStep();
	//check
		assert.strictEqual(this.spy.setNonHighlighted.callCount, 1, "Then setNonHighlighted is called");
	});
	QUnit.test("GIVEN navigateToStep or listItemPressed - When calling _removeHighlightingOfAnyStep", function(assert) {
		// prove that highlighting is set along a reference contract
		//prop
		var excludedIndex = 1;
		var oRelation = {
			wrappedChartWithCornerTexts : {
				oThumbnailVLayout : {
					removeStyleClass : function(){},
					addStyleClass : function () {}
				},
				setHighlighted : function(){},
				setNonHighlighted : function () {}
			}
		};
		this.carouselController._relateChartsToItems = [ oRelation, {}, oRelation ];
		this.carouselController._relateChartsToItems[excludedIndex] = null;
		this.spy._setHighlightingOfActiveStep.restore();
		this.spy.setHighlighted = sinon.spy(oRelation.wrappedChartWithCornerTexts, "setHighlighted");
		this.spy.setNonHighlighted = sinon.spy(oRelation.wrappedChartWithCornerTexts, "setNonHighlighted");
		// act
		this.carouselController._removeHighlightingOfAnyStep(excludedIndex);
		//check
		assert.strictEqual(this.spy.setNonHighlighted.callCount, 2, "Then setNonHighlighted is called");
	});
	QUnit.test("GIVEN navigateToStep or listItemPressed - When calling _setHighlightingOfActiveStep", function(assert) {
		// prove that highlighting is set along a reference contract
		//prop
		var inxOfActiveStep = 1;
		var oRelation = {
			wrappedChartWithCornerTexts : {
				oThumbnailVLayout : {
					removeStyleClass : function(){},
					addStyleClass : function () {}
				},
				setHighlighted : function(){},
				setNonHighlighted : function () {}
			}
		};
		this.spy._setHighlightingOfActiveStep.restore();
		this.carouselController._relateChartsToItems = [ {}, oRelation, {} ];
		this.spy.setHighlighted = sinon.spy(oRelation.wrappedChartWithCornerTexts, "setHighlighted");
		this.spy.setNonHighlighted = sinon.spy(oRelation.wrappedChartWithCornerTexts, "setNonHighlighted");
		// act
		this.carouselController._setHighlightingOfActiveStep(inxOfActiveStep);
		//check
		assert.strictEqual(this.spy.setHighlighted.callCount, 1, "Then setHighlighted is called");
	});
	QUnit.test("GIVEN new WrappedChartWithCornerTexts - When calling setHighlighted", function(assert) {
		// prove that the methods handle the styles correctly
		// prop
		var contractHighlightStyle = WrappedChartWithCornerTexts.activeBoxStyleName;
		var contractNonHighlightStyle = WrappedChartWithCornerTexts.inactiveBoxStyleName;
		var oStep = {
			id : "42",
			getSelectedRepresentationInfo : function () {
				return {
					title: "hugo",
					oStepTexts: {
						leftLower : "1",
						rightLower : "2",
						leftUpper : "3",
						rightUpper : "4"
					}
				}
			}
		};
		var oClonedChart = {
			setHeight: function(){},
			setWidth: function(){}
		};
		this.spy.WrappedChartWithCornerTexts.restore();
		var wrappedChartWithCornerTexts = new WrappedChartWithCornerTexts.constructor(this.carouselController, oStep, oClonedChart);
		this.spy.addStyleClass = sinon.stub(wrappedChartWithCornerTexts.oThumbnailVLayout, "addStyleClass", function(){});
		this.spy.removeStyleClass = sinon.stub(wrappedChartWithCornerTexts.oThumbnailVLayout, "removeStyleClass", function(){});
		// act
		wrappedChartWithCornerTexts.setHighlighted();
		//check
		assert.strictEqual(this.spy.removeStyleClass.callCount, 1, "Then style removed");
		assert.strictEqual(this.spy.removeStyleClass.getCall(0).args[0], contractNonHighlightStyle, "AND style for non-highlight is used");
		assert.strictEqual(this.spy.addStyleClass.callCount, 1, "Then style added");
		assert.strictEqual(this.spy.addStyleClass.getCall(0).args[0], contractHighlightStyle, "AND style for highlight is used");
		assert.strictEqual(wrappedChartWithCornerTexts.isHighlighted(), true, "THEN the active step is set highlighted");
	});
	QUnit.test("GIVEN new WrappedChartWithCornerTexts - When calling setNonHighlighted", function(assert) {
		// prove that the methods handle the styles correctly
		// prop
		var contractHighlightStyle = WrappedChartWithCornerTexts.activeBoxStyleName;
		var contractNonHighlightStyle = WrappedChartWithCornerTexts.inactiveBoxStyleName;
		var oStep = {
			id : "42",
			getSelectedRepresentationInfo : function () {
				return {
					title: "hugo",
					oStepTexts: {
						leftLower : "1",
						rightLower : "2",
						leftUpper : "3",
						rightUpper : "4"
					}
				}
			}
		};
		var oClonedChart = {
			setHeight: function(){},
			setWidth: function(){}
		};
		this.spy.WrappedChartWithCornerTexts.restore();
		var wrappedChartWithCornerTexts = new WrappedChartWithCornerTexts.constructor(this.carouselController, oStep, oClonedChart);
		this.spy.addStyleClass = sinon.stub(wrappedChartWithCornerTexts.oThumbnailVLayout, "addStyleClass", function(){});
		this.spy.removeStyleClass = sinon.stub(wrappedChartWithCornerTexts.oThumbnailVLayout, "removeStyleClass", function(){});
		// act
		wrappedChartWithCornerTexts.setNonHighlighted();
		//check
		assert.strictEqual(this.spy.removeStyleClass.callCount, 1, "Then style removed");
		assert.strictEqual(this.spy.removeStyleClass.getCall(0).args[0], contractHighlightStyle, "AND style for highlight is used");
		assert.strictEqual(this.spy.addStyleClass.callCount, 1, "Then style added");
		assert.strictEqual(this.spy.addStyleClass.getCall(0).args[0], contractNonHighlightStyle, "AND style for non-highlight is used");
		assert.strictEqual(wrappedChartWithCornerTexts.isHighlighted(), false, "THEN the active step is not set highlighted");
	});
	QUnit.test("Given an iconic step When calling _createRelation", function(assert) {
		// prove that for iconic custom list items the chart in the bookkeeping is null, and the chart is cloned. Further see test on getClonedChart
		assert.expect(3);
		var that = this;
		//prep
		var oRepr = {
		};
		var oStep = {
			getSelectedRepresentation : function() {
				return oRepr;
			}
		};
		that.spy.isIconDisplayed = sinon.stub(WrappedChartWithCornerTexts, "isIconDisplayed", function(){
			return true;
		});
		//act
		var oRelation = that.carouselController._createRelation(oStep);
		//check
		assert.strictEqual(that.spy.isIconDisplayed.called, true, "THEN the stubbed isIconDisplayed is called");
		assert.strictEqual(that.spy.getClonedChart.callCount, 1, "AND the _getClonedChart is called");
		assert.strictEqual(oRelation.oChart, null, "THEN the chart in the relation is null");
	});
	QUnit.test("Given a chart When calling _createRelation", function(assert) {
		// prove that for charts in the relation in bookkeeping contains the clone.
		assert.expect(3);
		var that = this;
		//prep
		var clone = {};
		var oRepr = {
		};
		var oStep = {
			getSelectedRepresentation : function() {
				return oRepr;
			}
		};
		that.spy.getClonedChart.restore();
		that.spy.getClonedChart = sinon.stub(WrappedChartWithCornerTexts, "getClonedChart", function(){
			return clone;
		});
		that.spy.isIconDisplayed = sinon.stub(WrappedChartWithCornerTexts, "isIconDisplayed", function(){
			return false;
		});
		//act
		var oRelation = that.carouselController._createRelation(oStep);
		//check
		assert.strictEqual(that.spy.isIconDisplayed.called, true, "THEN the stubbed isIconDisplayed is called");
		assert.strictEqual(that.spy.getClonedChart.callCount, 1, "AND the _getClonedChart is called");
		assert.strictEqual(oRelation.oChart, clone, "THEN the chart in the relation is the clone");
	});
});
