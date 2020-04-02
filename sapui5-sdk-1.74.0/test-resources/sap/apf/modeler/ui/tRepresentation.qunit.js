/*Global sap, jQuery*/

/**
 * @typedef {Object} jQuery
 * @property {Object} sap
 * @property {Function} sap.require
 * @property {Function} sap.declare
 * @property {Function} sap.registerModulePath
 * @property {Function} sap.registerModulePath
 *
 * @typedef {Object} QUnit
 * @property {Function} module
 * @property {Function} test
 *
 * @typedef {Object} sinon
 * @property {Function} spy
 * @property {Function} stub
 * @property {Function} args
 *
 * @typedef {Object} assert
 * @property {Function} ok
 * @property {Function} deepEqual
 * @property {Function} strictEqual
 * @property {Function} notStrictEqual
 * @property {Function} getCall
 * @property {Function} calledWith
 *
 */

sap.ui.define('sap.apf.modeler.ui.tRepresentation', [
	"sap/apf/modeler/ui/utils/representationBasicDataHandler",
	"sap/apf/modeler/ui/utils/viewValidator",
	"sap/apf/modeler/ui/utils/sortDataHandler",
	"sap/apf/modeler/ui/utils/stepPropertyMetadataHandler",
	'sap/apf/modeler/ui/utils/constants',
	"sap/apf/modeler/ui/controller/representation.controller",
	"sap/apf/modeler/core/representation",
	"sap/apf/modeler/core/elementContainer",
	"sap/apf/ui/utils/representationTypesHandler",
	"sap/apf/core/representationTypes",
	"sap/apf/utils/hashtable",
	'sap/apf/utils/utils',
	"sap/apf/testhelper/modelerUIHelper",
	"sap/ui/thirdparty/sinon"
], function(RepresentationBasicDataHandler, ViewValidator, SortDataHandler, StepPropertyMetadataHandler,
			ModelerConstants, UiControllerRepresentation,
			ModelerCoreRepresentation, ElementContainer,
			RepresentationTypesHandler, RepresentationTypes,
			Hashtable, utilsUtils, modelerUIHelper,
			sinon
){
	'use strict';
	/*BEGIN_COMPATIBILITY*/
	jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
	/*END_COMPATIBILITY*/

	var spyOnConfigEditorSetIsUnsaved,
		spyOnGetText,
		spyOnEditorsGetStep,
		spyOnStepGetRepresentation,
		spyOnGetDimensions,
		spyOnGetMeasures,
		spyOnGetProperties,
		spyOnGetLabelDisplayOption,
		spyOnSetLabelDisplayOption,
		spyOnGetSelectProperties,
		spyOnGetOrderbySpecifications,
		spyOnRemoveOrderbySpec,
		spyOnGetTextPool,
		spyOnGetRepresentationType,
		spyOnSetRepresentationType,
		spyOnSetAlternateRepresentationType,
		spyOnGetCategoriesForStep,
		spyOnUpdateTitleAndBreadCrumb,
		spyOnUpdateSelectedNode,
		spyOnAddDimension,
		spyOnSetDimensionKind,
		spyOnAddMeasure,
		spyOnSetMeasureKind,
		spyOnStepGetHierarchicalRep,
		spyOnStepGetHierarchicalRepresentation,
		spyOnSetHierarchyPropertyLabelDisplayOption,
		spyOnGetHierarchyNodeIdAsPromise,
		spyOnGetHierarchyPropertyLabelDisplayOption,
		spyOnInstantiateBasicData,
		spyOnIsChartTypeSimilar;
	function _commonSpiesInBeforeEach(oRepresentation, oModelerInstance) {
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnGetHierarchyNodeIdAsPromise = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getHierarchyNodeIdAsPromise");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
		spyOnEditorsGetStep = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getStep");
		spyOnStepGetRepresentation = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "getRepresentation");
		spyOnGetDimensions = sinon.spy(oRepresentation, "getDimensions");
		spyOnGetMeasures = sinon.spy(oRepresentation, "getMeasures");
		spyOnGetProperties = sinon.spy(oRepresentation, "getProperties");
		spyOnGetLabelDisplayOption = sinon.spy(oRepresentation, "getLabelDisplayOption");
		spyOnSetLabelDisplayOption = sinon.spy(oRepresentation, "setLabelDisplayOption");
		spyOnStepGetHierarchicalRep = sinon.spy(oModelerInstance.firstHierarchicalStep.getRepresentations()[1], "getHierarchyProperty");
		spyOnGetSelectProperties = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "getSelectProperties");
		spyOnGetOrderbySpecifications = sinon.spy(oRepresentation, "getOrderbySpecifications");
		spyOnRemoveOrderbySpec = sinon.spy(oRepresentation, "removeOrderbySpec");
		spyOnGetTextPool = sinon.spy(oModelerInstance.configurationHandler, "getTextPool");
		spyOnGetRepresentationType = sinon.spy(oRepresentation, "getRepresentationType");
		spyOnSetRepresentationType = sinon.spy(oRepresentation, "setRepresentationType");
		spyOnSetAlternateRepresentationType = sinon.spy(oRepresentation, "setAlternateRepresentationType");
		spyOnGetCategoriesForStep = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getCategoriesForStep");
		spyOnUpdateTitleAndBreadCrumb = sinon.spy(oModelerInstance, "updateTitleAndBreadCrumb");
		spyOnUpdateSelectedNode = sinon.spy(oModelerInstance, "updateSelectedNode");
		spyOnAddDimension = sinon.spy(oRepresentation, "addDimension");
		spyOnSetDimensionKind = sinon.spy(oRepresentation, "setDimensionKind");
		spyOnAddMeasure = sinon.spy(oRepresentation, "addMeasure");
		spyOnSetMeasureKind = sinon.spy(oRepresentation, "setMeasureKind");
		spyOnInstantiateBasicData = sinon.spy(RepresentationBasicDataHandler.prototype, "instantiateBasicDataAsPromise");
		spyOnIsChartTypeSimilar = sinon.spy(RepresentationTypesHandler.prototype, "isChartTypeSimilar");
	}
	function _commonCleanUpsInAfterEach(testEnv) {
		sap.apf.modeler.ui.utils.StepPropertyMetadataHandler.restore();
		testEnv.oRepresentationView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		testEnv.oRepresentationView.getViewData().oConfigurationEditor.getHierarchyNodeIdAsPromise.restore();
		modelerUIHelper.destroyModelerInstance();
		spyOnGetText.restore();
		spyOnEditorsGetStep.restore();
		spyOnStepGetHierarchicalRep.restore();
		spyOnGetTextPool.restore();
		spyOnGetCategoriesForStep.restore();
		spyOnUpdateTitleAndBreadCrumb.restore();
		spyOnUpdateSelectedNode.restore();
		spyOnInstantiateBasicData.restore();
		spyOnIsChartTypeSimilar.restore();
		testEnv.oModelerInstance.reset();
		testEnv.oRepresentationView.destroy();
	}
	function _getCommonPropertyMetadata() {
		var metadata;
		return {
			getPropertyMetadata : function(sPropertyName) {
				if (sPropertyName === "property2" || sPropertyName === "property3") {
					metadata = {
						"aggregation-role" : "dimension",
						"dataType" : {
							"maxLength" : "10",
							"type" : "Edm.String"
						},
						"label" : sPropertyName, // the label should be different for all the properties
						"name" : "Dimension",
						"text" : sPropertyName + "Text"
					};
					return metadata;
				}
				if (sPropertyName === "property1" || sPropertyName === "property4") {
					metadata = {
						"aggregation-role" : "measure",
						"dataType" : {
							"maxLength" : "10",
							"type" : "Edm.String"
						},
						"name" : "Measure" + sPropertyName
					};
					return metadata;
				}
				return undefined;
			}
		};
	}
	function _fnGetConsumableProperties() {
		var deferred = jQuery.Deferred();
		deferred.resolve({
			available : [],
			consumable : []
		});
		return deferred.promise();
	}
	function doStubStepPropertyMetadataHandler(context, isHierarchicalStep) {
		// The following set a spy on the GLOBAL constructor, which is called somewhere else.
		// Hence, currently, the global namespace variable cannot be removed.
		// TODO: the AMD module shall return an object containing the constructor, and put a stub on that one.
		sinon.stub(sap.apf.modeler.ui.utils, "StepPropertyMetadataHandler", function() {
			return {
				meta : "data",
				oStep : {
					getTopN : function() {
						return 10;
					},
					getService : function() {
						return "testService1";
					},
					getEntitySet : function() {
						return "entitySet1";
					},
					getHierarchyProperty : function() {
						return "property1";
					},
					getConsumablePropertiesForRepresentation : _fnGetConsumableProperties,
					getConsumableSortPropertiesForRepresentation : _fnGetConsumableProperties,
					getConsumablePropertiesForTopN : _fnGetConsumableProperties,
					getType : function() {
						return isHierarchicalStep ? "hierarchicalStep" : "step";
					}
				},
				getStepType : function() {
					return isHierarchicalStep ? "hierarchicalStep" : "step";
				},
				getRepresentationTypesArray : function() {
					return isHierarchicalStep ? _getModelForTreeTableRepresentation().Objects : _getModelForRepresentation().Objects;
				},
				getEntityTypeMetadataAsPromise : function() {
					return utilsUtils.createPromise({});
				},
				getPropertyMetadata : _getCommonPropertyMetadata,
				hasTextPropertyOfDimension : function(object, property) {
					return (property !== "property3");
				},
				getDimensionsProperties : function() {
					return context.aDimensions || ["property2", "property3" ];
				},
				getDefaultLabel : function(entityMetadata, oText) {
					return oText;
				},
				getMeasures : function() {
					return context.aMeasures || ["property4"];
				},
				getProperties : function() {
					return ["property2", "property3", "property4"];
				},
				getHierarchicalProperty : function() {
					return "property1";
				}
			};
		});
	}
	function _instantiateView(context, assert, isHierarchicalStep) {
		var oFooterBar = new sap.m.Bar();
		var oRepresentationController = new UiControllerRepresentation();
		var sRepresentationType = context.oRepresentation ? context.oRepresentation.getId() : "newRepresentation1";
		doStubStepPropertyMetadataHandler(context, isHierarchicalStep);
		var oParentStep = isHierarchicalStep ? context.oModelerInstance.firstHierarchicalStep : context.oModelerInstance.unsavedStepWithoutFilterMapping;
		var oParentStepId = isHierarchicalStep ? context.oModelerInstance.firstHierarchicalStepId : context.oModelerInstance.stepIdUnsavedWithoutFilterMapping;
		var oView = sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.representation",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oRepresentationController,
			viewData : {
				updateConfigTree : context.oModelerInstance.updateConfigTree,
				updateSelectedNode : context.oModelerInstance.updateSelectedNode,
				updateTree : context.oModelerInstance.updateTree,
				updateTitleAndBreadCrumb : context.oModelerInstance.updateTitleAndBreadCrumb,
				oParentStep : oParentStep,
				oCoreApi : context.oModelerInstance.modelerCore,
				oConfigurationEditor : context.oModelerInstance.configurationEditorForUnsavedConfig,
				oConfigurationHandler : context.oModelerInstance.configurationHandler,
				oApplicationHandler : context.oModelerInstance.applicationHandler,
				getRepresentationTypes : context.oModelerInstance.configurationEditorForUnsavedConfig.getRepresentationTypes,
				oFooter : oFooterBar,
				oParams : {
					name : "representation",
					arguments : {
						configId : context.oModelerInstance.tempUnsavedConfigId,
						categoryId : context.oModelerInstance.categoryIdUnsaved,
						stepId : oParentStepId,
						representationId : sRepresentationType
					}
				}
			}
		});
		return oView;
	}
	function _getModelForTreeTableRepresentation() {
		return {
			"Objects" : [ {
				"key" : "TreeTableRepresentation",
				"name" : "Tree Table Representation"
			} ]
		};
	}
	function _getModelForRepresentation() {
		return {
			"Objects" : [ {
				"key" : "ColumnChart",
				"name" : "Column Chart"
			}, {
				"key" : "BarChart",
				"name" : "Bar Chart"
			}, {
				"key" : "LineChart",
				"name" : "Line Chart"
			}, {
				"key" : "LineChartWithTwoVerticalAxes",
				"name" : "Line Chart with Two Vertical Axes"
			}, {
				"key" : "LineChartWithTimeAxis",
				"name" : "Line Chart with Time Axis"
			}, {
				"key" : "PieChart",
				"name" : "Pie Chart"
			}, {
				"key" : "ScatterPlotChart",
				"name" : "Scatterplot Chart"
			}, {
				"key" : "BubbleChart",
				"name" : "Bubble Chart"
			}, {
				"key" : "StackedColumnChart",
				"name" : "Stacked Column Chart"
			}, {
				"key" : "StackedBarChart",
				"name" : "Stacked Bar Chart"
			}, {
				"key" : "PercentageStackedColumnChart",
				"name" : "Percentage Stacked Column Chart"
			}, {
				"key" : "PercentageStackedBarChart",
				"name" : "Percentage Stacked Bar Chart"
			}, {
				"key" : "HeatmapChart",
				"name" : "Heatmap Chart"
			}, {
				"key" : "TableRepresentation",
				"name" : "Table Representation"
			} ]
		};
	}
	function _getModelForChartTypeValueHelp(nDimensions, nMeasures){
		function findRepresentation(aRepTypes, sChartType){
			var result = null;
			aRepTypes.forEach(function(repType){
				if (repType["key"] === sChartType){
					result = repType;
				}
			});
			return result;
		}
		var oModel = _getModelForRepresentation();
		var aInvalidRepresentations = [];
		if (nMeasures === 0){
			aInvalidRepresentations = ["ColumnChart","BarChart", "LineChart","LineChartWithTwoVerticalAxes","LineChartWithTimeAxis","PieChart","ScatterPlotChart","BubbleChart","StackedColumnChart","StackedBarChart","PercentageStackedColumnChart","PercentageStackedBarChart","HeatmapChart"];
		} else if (nMeasures === 1){
			if (nDimensions === 0){
				aInvalidRepresentations = ["LineChart","LineChartWithTwoVerticalAxes","LineChartWithTimeAxis","ScatterPlotChart","BubbleChart","HeatmapChart"];
			} else if (nDimensions >= 1){
				aInvalidRepresentations = ["LineChartWithTwoVerticalAxes","ScatterPlotChart","BubbleChart"];
			}
		} else if (nMeasures === 2){
			if (nDimensions === 0){
				aInvalidRepresentations = ["LineChart","LineChartWithTwoVerticalAxes","LineChartWithTimeAxis","BubbleChart","HeatmapChart"];
			} else if (nDimensions >= 1){
				aInvalidRepresentations = ["BubbleChart"];
			}
		} else if (nMeasures >= 3){
			if (nDimensions === 0){
				aInvalidRepresentations = ["LineChart","LineChartWithTwoVerticalAxes","LineChartWithTimeAxis","HeatmapChart"];
			}
		}
		aInvalidRepresentations.forEach(function(sInvalidRepresentation){
			findRepresentation(oModel.Objects, sInvalidRepresentation).name = "* "
				+ findRepresentation(oModel.Objects, sInvalidRepresentation).name;
		});
		return oModel;
	}
	function _commonAsserts(assert, oRepresentationView, spyOnGetText, spyOnEditorsGetStep, spyOnStepGetRepresentation, representationController, isTreeTableRepresentation, modelerInstance) {
		//arrange
		var oModelForRepresentationEntity = isTreeTableRepresentation ? _getModelForTreeTableRepresentation() : _getModelForChartTypeValueHelp(2, 1);
		//assert for representation view
		assert.ok(oRepresentationView, "Representation view is available");
		// asserts for labels
		assert.strictEqual(spyOnGetText.calledWith("visualization"), true, "then label for visualization is set");
		assert.strictEqual(spyOnGetText.calledWith("chartType"), true, "then label for chart type is set");
		assert.strictEqual(spyOnGetText.calledWith("basicData"), true, "then label for basic data is set");
		assert.strictEqual(spyOnGetText.calledWith("sorting"), true, "then label for sorting is set");
		//asserts for step object
		assert.strictEqual(spyOnEditorsGetStep.callCount, 1, "then step object is called only once");
		assert.strictEqual(spyOnEditorsGetStep.calledWith(oRepresentationView.getViewData().oParentStep.getId()), true, "then step object exists");
		//asserts for representation object
		var isGetRepresentationeCalled = isTreeTableRepresentation ? false : true;
		assert.strictEqual(spyOnStepGetRepresentation.called, isGetRepresentationeCalled, "then get representation is called based on representation type");
		//assert for instantiate corner texts
		assert.ok(representationController.byId("idCornerTextsVBox"), "then corner text VBox is available");
		//asserts for chart type
		assert.ok(oRepresentationView.byId("idChartType"), "then chart type box exists");
		assert.ok(oRepresentationView.byId("idChartTypeLabel"), "then chart type label box exists");
		// asserts for chart types dropdown
		assert.deepEqual(representationController.byId("idChartType").getModel().getData(), oModelForRepresentationEntity, "then the correct model is set for the chart type dropdown");
		assert.deepEqual(representationController.byId("idChartType").getValueStateText(), modelerInstance.modelerCore.getText("modeler.ui.representation.invalidChartTypeError"), "Then the chart type selection has the correct value state text");
	}
	function _checkAvailablityOfPreviewButton(assert, spyOnGetText, oRepresentationView, representationController) {
		//asserts for insert preview button
		assert.strictEqual(representationController.byId("idPreviewButton").getVisible(), true, "then preview button is shown for representation type which is not treetable");
		assert.strictEqual(spyOnGetText.calledWith("preview"), true, "then preview button label is called and available");
		assert.strictEqual(oRepresentationView.getViewData().oFooter.getContentRight().length, 1, "then preview button is available on the footer bar");
	}
	function _checkAvailablityOfPreviewButtonForTreeTable(assert, spyOnGetText, oRepresentationView, representationController) {
		//asserts for insert preview button
		assert.strictEqual(representationController.byId("idPreviewButton"), undefined, "then preview button is not shown for treetable representation type");
		assert.strictEqual(spyOnGetText.calledWith("preview"), false, "then preview button label is not called");
		assert.strictEqual(oRepresentationView.getViewData().oFooter.getContentRight().length, 0, "then preview button is not available on the footer bar");
	}
	function _commonTestOnExit(assert, oRepresentationView, representationController) {
		//arrange
		var spyOnDestroyItems = sinon.spy(representationController.byId("idCornerTextsVBox"), "destroyItems");
		//action
		representationController.onExit();
		//asserts
		assert.strictEqual(oRepresentationView.getViewData().oFooter.getContentRight().length, 0, "Preview button not available on the footer bar");
		assert.strictEqual(spyOnDestroyItems.callCount, 1, "then corner text VBox is not available");
	}
	function _createEvent(oChartType) {
		return {
			getParameter : function() {
				var selectedItem = {};
				selectedItem.getKey = function() {
					return oChartType;
				};
				return selectedItem;
			}
		};
	}
	function _getRepresentationInfo(sRepresentationType, sRepresentation, oView) {
		if (sRepresentationType === "BubbleChart"){
			return {
				id : oView.getViewData().oParentStep.getId() + "-" + sRepresentation,
				icon : "sap-icon://bubble-chart",
				name : "Bubble Chart"
			};
		} else if (sRepresentationType === "PieChart"){
			return {
				id : oView.getViewData().oParentStep.getId() + "-" + sRepresentation,
				icon : "sap-icon://pie-chart",
				name : "Pie Chart"
			};
		}
		return undefined;
	}
	QUnit.module("Given a Representation with field validation requirements", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance; //Modeler instance from callback
				that.getValidationStateStub = sinon.stub(ViewValidator.prototype, "getValidationState", function(){
					return that.bValidationState;
				});
				done();
			});
		},
		afterEach : function() {
			sap.apf.modeler.ui.utils.StepPropertyMetadataHandler.restore();
			this.getValidationStateStub.restore();
		}
	});
	QUnit.test("When validating Chart Type Selection and all mandatory fields are filled", function(assert){
		var done = assert.async();
		var that = this;
		this.bValidationState = true;
		this.oRepresentationView = _instantiateView(this, assert, false);
		this.oRepresentationView.getController().promiseControllerIsCreated.then(function(){
			setTimeout(function(){
				assert.strictEqual(that.oRepresentationView.byId("idChartType").getValueState(), sap.ui.core.ValueState.None, "then chartType selection control value state is set as default onInit");
				that.bValidationState = false;
				that.oRepresentationView.getController().handleChangeForChartType(_createEvent("BubbleChart"));
				setTimeout(function(){
					assert.strictEqual(that.oRepresentationView.byId("idChartType").getValueState(), sap.ui.core.ValueState.Error, "then chartType selection control value state is set to error on handleChangeforChartType");
					done();
				}, 1000);
			}, 1000);
		});
	});
	QUnit.test("When validating Chart Type Selection and not all mandatory fields are filled", function(assert){
		var that = this;
		var done = assert.async();
		that.bValidationState = false;
		that.oRepresentationView = _instantiateView(that, assert, undefined);
		assert.ok(that.oRepresentationView.getController().promiseControllerIsCreated, "Then oRepresentationView.getController().promiseControllerIsCreated is defined");
		that.oRepresentationView.getController().promiseControllerIsCreated.then(function(){
			setTimeout(function(){
				assert.strictEqual(that.oRepresentationView.byId("idChartType").getValueState(), sap.ui.core.ValueState.Error, "then chartType selection control value state is set as default onInit");
				that.bValidationState = true;
				that.oRepresentationView.getController().handleChangeForChartType(_createEvent("BubbleChart"));
				setTimeout(function(){
					assert.strictEqual(that.oRepresentationView.byId("idChartType").getValueState(), sap.ui.core.ValueState.None, "then chartType selection control value state is set as default on handleChangeforChartType");
					done();
				}, 1000);
			}, 1000);
		});
	});
	QUnit.test("When getValidationState is called and all mandatory fields are filled", function(assert){
		var done = assert.async();
		this.bValidationState = true;
		this.oRepresentationView = _instantiateView(this, assert, false);
		this.oRepresentationView.getController().promiseControllerIsCreated.then(function(){
			assert.strictEqual(this.oRepresentationView.getController().getValidationState(), true, "then getValidationState() returns the result from the viewValidator onInit");
			done();
		}.bind(this));
	});
	QUnit.test("When getValidationState is called and not all mandatory fields are filled", function(assert){
		var done = assert.async();
		this.bValidationState = false;
		this.oRepresentationView = _instantiateView(this, assert, false);
		this.oRepresentationView.getController().promiseControllerIsCreated.then(function(){
			assert.strictEqual(this.oRepresentationView.getController().getValidationState(), false, "then getValidationState() returns the result from the viewValidator onInit");
			done();
		}.bind(this));
	});
	QUnit.module("Given an existing Column Chart Representation", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();//Stop the tests until modeler instance is got
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance; //Modeler instance from callback
				that.oRepresentation = that.oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0];
				_commonSpiesInBeforeEach(that.oRepresentation, that.oModelerInstance);
				that.oRepresentationView = _instantiateView(that, assert);
				that.representationController = that.oRepresentationView.getController();
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach(this);
		}
	});
	QUnit.test("When Representation is initialized", function(assert) {
		//arrange
		var oModelForRepresentationEntity = _getModelForChartTypeValueHelp(2, 1);
		var oCoreApi = this.representationController.getView().getViewData().oCoreApi;
		assert.strictEqual(this.representationController.oViewValidator.oView, this.oRepresentationView, "ViewValidator correctly instantiated");
		assert.strictEqual(spyOnStepGetRepresentation.calledWith(this.oRepresentationView.getViewData().oParentStep.getId() + "-Representation-1"), true, "then  representation exists ");
		//common asserts for when representation is initialization
		_commonAsserts(assert, this.oRepresentationView, spyOnGetText, spyOnEditorsGetStep, spyOnStepGetRepresentation, this.representationController, undefined, this.oModelerInstance);
		_checkAvailablityOfPreviewButton(assert, spyOnGetText, this.oRepresentationView, this.representationController);
		//asserts for perform Compatibility For Label DisplayOption
		assert.strictEqual(spyOnGetDimensions.called, true, "then get dimensions is called");
		assert.strictEqual(spyOnGetMeasures.callCount, 4, "then get measures is called four times");
		assert.strictEqual(spyOnGetProperties.called, false, "then get properties is not called");
		assert.strictEqual(spyOnGetLabelDisplayOption.calledWith("property2"), true, "then get label display option is called");
		assert.strictEqual(spyOnSetLabelDisplayOption.calledWith("property1", "keyAndText"), true, "then set label display option is called and label is set");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		//asserts for heal representation data
		assert.strictEqual(spyOnGetSelectProperties.called, false, "then select properties is not called");
		//asserts for heal representation sort data 
		assert.strictEqual(spyOnGetOrderbySpecifications.callCount, 1, "then get order by specifications is called once");
		//asserts for set chart type
		assert.ok(oCoreApi.getRepresentationTypes()[0].metadata, "then representation type metadata is present");
		assert.deepEqual(this.representationController.byId("idChartType").getModel().getData(), oModelForRepresentationEntity, "then model for chart type is set");
		assert.strictEqual(this.oRepresentationView.byId("idChartType").getSelectedKey(), "ColumnChart", "then column chart is the selected key");
		assert.ok(spyOnGetTextPool.callCount >= 5, "then get text pool is called >= 5 times");
	});
	QUnit.test("observe viewData while instantiation of propertyType sub views ", function(assert){
		var propertyTypeView = this.representationController.byId("idBasicDataLayout").getItems()[0].getContent()[0].getItems()[0];
		var viewData = propertyTypeView.getViewData();
		assert.strictEqual(viewData.oViewValidator, this.representationController.oViewValidator, "ViewValidator passed to the created propertyType");
		assert.deepEqual(viewData.oPropertyTypeData, {
			bMandatory: false,
			sContext: "xAxis",
			sProperty : "property2"
		}, "Property Type data correctly passed to propertyType");
	});
	QUnit.test("When representation type is switched to Bubble Chart", function(assert) {
		//arrange
		var spyOnFireEvent = sinon.spy(this.oRepresentationView, "fireEvent");
		spyOnAddDimension.reset();
		spyOnSetDimensionKind.reset();
		spyOnSetLabelDisplayOption.reset();
		//action
		this.representationController.handleChangeForChartType(_createEvent("BubbleChart"));
		//asserts for update Representation Type
		assert.strictEqual(spyOnGetText.calledWith("BubbleChart"), true, "then selected chart type text is called");
		assert.strictEqual(spyOnSetRepresentationType.calledWith("BubbleChart"), true, "then representation type is set to Bubble Chart");
		assert.strictEqual(spyOnSetAlternateRepresentationType.calledWith("TableRepresentation"), true, "then Table Representation is set as an alternate representation type");
		//asserts for update Tree Node
		assert.strictEqual(spyOnGetCategoriesForStep.calledWith(this.oRepresentationView.getViewData().oParentStep.getId()), true, "then getCategoriesForStep() is called");
		//asserts for update Bread Crumb
		assert.strictEqual(spyOnGetText.calledWith("representation"), true, "then text is available for new chart type");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("Representation: Bubble Chart"), true, "then title and bread crumb is updated");
		//asserts for update Selected Node
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(_getRepresentationInfo("BubbleChart", "Representation-1", this.oRepresentationView)), true, "then selected node is updated");
		//asserts for checking whether the old and new chart are similar or not
		assert.strictEqual(spyOnIsChartTypeSimilar.callCount, 1, "Then check was made for similar chart types");
		assert.deepEqual(spyOnIsChartTypeSimilar.args, [["ColumnChart", "BubbleChart"]], "Then check was made between Column Chart and Bubble Chart");
		assert.strictEqual(spyOnFireEvent.calledWith(ModelerConstants.events.REMOVEALLPROPERTIESFROMPARENTOBJECT), true, "then remove all properties when chart type is changed");
		//asserts for default state of representation
		assert.strictEqual(spyOnInstantiateBasicData.callCount, 2, "Then instantiateBasicDataAsPromise() was called for Representation view");
		assert.strictEqual(spyOnAddDimension.callCount, 0, "Then addDimension() was not called for the handleChangeForChartType");
		assert.strictEqual(spyOnSetLabelDisplayOption.callCount, 0, "then setLabelDisplayOption() is not called");
		assert.strictEqual(spyOnSetDimensionKind.callCount, 0, "Then setDimensionKind() was not called for the handleChangeForChartType");
		assert.strictEqual(spyOnAddMeasure.calledWith("property4"), true, "then add measure is called");
		assert.strictEqual(spyOnAddMeasure.callCount, 1, "then addMeasure() is called for each required measure");
		assert.strictEqual(spyOnSetMeasureKind.calledWith("property4", "xAxis"), true, "then setMeasureKind() is called with the correct parameters");
		assert.strictEqual(spyOnSetMeasureKind.callCount, 1, "then setMeasureKind() is called for each added measure");
		//assert for fire event
		assert.strictEqual(spyOnFireEvent.calledWith(ModelerConstants.events.representation.SETCHARTICON), true, "then setChartIcon() is fired when chart type is changed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 4, "then configuration editor is set to unsaved");
	});
	QUnit.test("When representation type is switched to PieChart", function(assert) {
		//arrange
		var spyOnFireEvent = sinon.spy(this.oRepresentationView, "fireEvent");
		spyOnAddDimension.reset();
		spyOnSetDimensionKind.reset();
		spyOnSetLabelDisplayOption.reset();
		//action
		this.representationController.handleChangeForChartType(_createEvent("PieChart"));
		//asserts for update Representation Type
		assert.strictEqual(spyOnGetText.calledWith("PieChart"), true, "then selected chart type text is called");
		assert.strictEqual(spyOnSetRepresentationType.calledWith("PieChart"), true, "then representation type is set");
		assert.strictEqual(spyOnSetAlternateRepresentationType.calledWith("TableRepresentation"), true, "then Table Representation is set as an alternate representation type");
		//asserts for update Tree Node
		assert.strictEqual(spyOnGetCategoriesForStep.calledWith(this.oRepresentationView.getViewData().oParentStep.getId()), true, "then getCategoriesForStep() is called");
		//asserts for update Bread Crumb 
		assert.strictEqual(spyOnGetText.calledWith("representation"), true, "then text is available for new chart type");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("Representation: Pie Chart"), true, "then title and bread crumb is updated");
		//asserts for update Selected Node 
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(_getRepresentationInfo("PieChart", "Representation-1", this.oRepresentationView)), true, "then selected node is updated");
		//asserts for checking whether the old and new chart are similar or not
		assert.strictEqual(spyOnIsChartTypeSimilar.callCount, 1, "Then check was made for similar chart types");
		assert.deepEqual(spyOnIsChartTypeSimilar.args, [["ColumnChart", "PieChart"]], "Then check was made between Column Chart and Pie Chart");
		assert.strictEqual(spyOnFireEvent.calledWith(ModelerConstants.events.REMOVEALLPROPERTIESFROMPARENTOBJECT), true, "then remove all properties when chart type is changed");
		//asserts for default state of representation
		assert.strictEqual(spyOnInstantiateBasicData.callCount, 2, "Then instantiateBasicDataAsPromise() was called for Representation view");
		assert.strictEqual(spyOnAddDimension.callCount, 1, "Then addDimension() was not called for the handleChangeForChartType");	
		assert.strictEqual(spyOnSetLabelDisplayOption.calledWith("property2", "keyAndText"), true, "then setLabelDisplayOption() is called");
		assert.strictEqual(spyOnSetDimensionKind.callCount, 1, "Then setDimensionKind() was called in the handleChangeForChartType");
		assert.strictEqual(spyOnAddMeasure.calledWith("property4"), true, "then add measure is called");
		assert.strictEqual(spyOnAddMeasure.callCount, 1, "then addMeasure() is called once");
		assert.strictEqual(spyOnSetMeasureKind.calledWith("property4", "sectorSize"), true, "then setMeasureKind() is called with the correct parameters");
		assert.strictEqual(spyOnSetMeasureKind.callCount, 1, "then setMeasureKind() is called");
		//assert for fire event
		assert.strictEqual(spyOnFireEvent.calledWith(ModelerConstants.events.representation.SETCHARTICON), true, "then setChartIcon() is fired when chart type is changed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 4, "then configuration editor is set to unsaved");
	});
	QUnit.test("Test handlePreviewButtonPress for representation ColumnChart", function(assert) {
		//action
		this.representationController.handlePreviewButtonPress();
		var oPreviewContentView = this.representationController.byId("idPreviewContentView");
		//asserts
		assert.ok(oPreviewContentView, "then preview content view is available for view");
		assert.strictEqual(oPreviewContentView.byId("idPreviewContentDialog").isOpen(), true, "then preview content dialog is open");
		oPreviewContentView.byId("idPreviewContentDialog").destroy();
		assert.strictEqual(oPreviewContentView.byId("idPreviewContentDialog"), undefined, "then preview content dialog is not available");
	});
	QUnit.test("Test onExit for representation", function(assert) {
		_commonTestOnExit(assert, this.oRepresentationView, this.representationController);
	});
	QUnit.module("Given an existing Representation with a set labelDisplayOption", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();//Stop the tests until modeler instance is got
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance; //Modeler instance from callback
				that.oRepresentation = that.oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0];
				that.oRepresentation.setLabelDisplayOption("property3", "keyAndText");
				_commonSpiesInBeforeEach(that.oRepresentation, that.oModelerInstance);
				that.oRepresentationView = _instantiateView(that, assert);
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach(this);
		}
	});
	QUnit.test("When LabelDisplayOption should not be overwritten", function(assert) {
		//see BCP: 1680337639 - LabelDisplayOption was automatically changed from keyAndText to Text when the text property is no longer available
		assert.strictEqual(spyOnSetLabelDisplayOption.calledWith("property3", "key"), false, "then set label display option is not overwritten automatically");
	});
	QUnit.module("Given a new Representation", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();//Stop the tests until modeler instance is got
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance; //Modeler instance from callback
				spyOnGetText = sinon.spy(that.oModelerInstance.modelerCore, "getText");
				spyOnConfigEditorSetIsUnsaved = sinon.spy(that.oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
				that.oRepresentationView = _instantiateView(that, assert);
				that.representationController = that.oRepresentationView.getController();
				done();//Start the test once modeler instance is got and setup is done
			});
			that.oRepresentation = null;
		},
		afterEach : function() {
			sap.apf.modeler.ui.utils.StepPropertyMetadataHandler.restore();
			modelerUIHelper.destroyModelerInstance();
			spyOnGetText.restore();
			spyOnConfigEditorSetIsUnsaved.restore();
			this.oModelerInstance.reset();
			this.oRepresentationView.destroy();
		}
	});
	QUnit.test("When Representation is initialized", function(assert) {
		//arrange
		var oModelForRepresentationEntity = _getModelForChartTypeValueHelp(1, 1);
		var oCoreApi = this.representationController.getView().getViewData().oCoreApi;
		//asserts for representation
		assert.strictEqual(spyOnGetText.calledWith("visualization"), true, "then label for visualization is set");
		assert.strictEqual(spyOnGetText.calledWith("chartType"), true, "then label for chart type is set");
		assert.strictEqual(spyOnGetText.calledWith("basicData"), true, "then label for basic data is set");
		assert.strictEqual(spyOnGetText.calledWith("sorting"), true, "then label for sorting is set");
		assert.ok(this.oRepresentationView, "Representation view is available");
		assert.ok(this.representationController.byId("idCornerTextsVBox"), "then corner text VBox is available");
		assert.ok(oCoreApi.getRepresentationTypes()[0].metadata, "then representation type metadata is present");
		assert.ok(this.oRepresentationView.byId("idChartType"), "then chart type box exists");
		assert.ok(this.oRepresentationView.byId("idChartTypeLabel"), "then chart type label box exists");
		assert.deepEqual(this.representationController.byId("idChartType").getModel().getData(), oModelForRepresentationEntity, "then model for chart type is set");
		assert.strictEqual(this.oRepresentationView.byId("idChartType").getSelectedKey(), "ColumnChart", "then column chart is the selected key");
		//asserts for insert preview button
		assert.ok(this.representationController.byId("idPreviewButton"), "then preview button is available");
		assert.strictEqual(this.oRepresentationView.getViewData().oFooter.getContentRight().length, 1, "then preview button is available on the footer bar");
	});
	QUnit.test("When Representation preview button already available", function(assert) {
		//assert
		assert.ok(this.representationController.byId("idPreviewButton"), "then preview button is available before trying to create new");
		assert.strictEqual(this.oRepresentationView.getViewData().oFooter.getContentRight().length, 1, "then preview button is available on the footer bar before trying to create new");
		//action
		this.oRepresentationView.getController().setDetailData();
		//asserts
		assert.strictEqual(this.oRepresentationView.getViewData().oFooter.getContentRight().length, 1, "then only one preview button is available on the footer bar");
	});
	QUnit.test("Test handleChangeForChartType for representation Bubble Chart", function(assert) {
		//arrange
		var aStepCategories = this.oModelerInstance.configurationEditorForUnsavedConfig.getCategoriesForStep(this.oRepresentationView.getViewData().oParentStep.getId());
		//action
		this.representationController.handleChangeForChartType(_createEvent("BubbleChart"));
		sap.ui.getCore().applyChanges();
		//asserts
		assert.ok(this.oRepresentationView.byId("idChartType"), "then chart type box exists");
		assert.ok(this.oRepresentationView.byId("idChartTypeLabel"), "then chart type label box exists");
		assert.ok(this.representationController.byId("idCornerTextsVBox"), "then corner text VBox is available");
		assert.ok(this.representationController.byId("idPreviewButton"), "then preview button is available");
		assert.equal(aStepCategories.length, 1, "then the step of representation is only assigned to one category");
		assert.equal(this.oRepresentationView.getViewData().oFooter.getContentRight().length, 1, "then preview button is available on the footer bar");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("Test handleChangeForChartType for Table representation", function(assert) {
		//arrange
		var aStepCategories = this.oModelerInstance.configurationEditorForUnsavedConfig.getCategoriesForStep(this.oRepresentationView.getViewData().oParentStep.getId());
		//action
		this.representationController.handleChangeForChartType(_createEvent("TableRepresentation"));
		sap.ui.getCore().applyChanges();
		//asserts
		assert.ok(this.oRepresentationView.byId("idChartType"), "then chart type box exists");
		assert.ok(this.oRepresentationView.byId("idChartTypeLabel"), "then chart type label box exists");
		assert.ok(this.representationController.byId("idCornerTextsVBox"), "then corner text VBox is available");
		assert.ok(this.representationController.byId("idPreviewButton"), "then preview button is available");
		assert.equal(aStepCategories.length, 1, "then the step of representation is only assigned to one category");
		assert.equal(this.oRepresentationView.getViewData().oFooter.getContentRight().length, 1, "then preview button is available on the footer bar");
	});
	QUnit.test("Test handlePreviewButtonPress for representation", function(assert) {
		//action
		this.representationController.handlePreviewButtonPress();
		//arrange
		var oPreviewContentView = this.representationController.byId("idPreviewContentView");
		//asserts
		assert.ok(oPreviewContentView, "then preview content view is available for view");
		assert.strictEqual(oPreviewContentView.byId("idPreviewContentDialog").isOpen(), true, "then preview content dialog is open");
		oPreviewContentView.byId("idPreviewContentDialog").destroy();
		assert.strictEqual(oPreviewContentView.byId("idPreviewContentDialog"), undefined, "then preview content dialog is not available");
	});
	QUnit.test("Test onExit for representation", function(assert) {
		_commonTestOnExit(assert, this.oRepresentationView, this.representationController);
	});
	QUnit.module("Given a Table Representation", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			var that = this;
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance; //Modeler instance from callback
				that.oRepresentation = that.oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[2];
				_commonSpiesInBeforeEach(that.oRepresentation, that.oModelerInstance);
				that.oRepresentationView = _instantiateView(that, assert);
				that.representationController = that.oRepresentationView.getController();
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function(assert) {
			var done = assert.async();
			setTimeout(function() { // tidy up only after async setting of valueState by representation.controller happened
				_commonCleanUpsInAfterEach(this);
				done();
			}.bind(this), 1000);
		}
	});
	QUnit.test("when table representation is initialized ", function(assert) {
		//common asserts when representation is initialized
		_commonAsserts(assert, this.oRepresentationView, spyOnGetText, spyOnEditorsGetStep, spyOnStepGetRepresentation, this.representationController, undefined, this.oModelerInstance);
		_checkAvailablityOfPreviewButton(assert, spyOnGetText, this.oRepresentationView, this.representationController);
		assert.strictEqual(this.oRepresentation.getProperties().length, 1, "then one column is present in the table");
		//asserts for representation object 
		assert.strictEqual(spyOnGetTextPool.callCount, 2, "then text pool is called twice");
		assert.strictEqual(spyOnStepGetRepresentation.callCount, 1, "then get representation is called only once");
		assert.strictEqual(spyOnStepGetRepresentation.calledWith(this.oRepresentationView.getViewData().oParentStep.getId() + "-Representation-3"), true, "then  representation exists ");
		//asserts for properties
		assert.strictEqual(spyOnGetDimensions.called, true, "then get dimensions is called");
		assert.strictEqual(spyOnGetMeasures.called, true, "then get measures is called");
		assert.strictEqual(this.oRepresentation.getRepresentationType(), "TableRepresentation", "then representation is table representation");
		//asserts for heal representation sort data 
		assert.strictEqual(spyOnGetOrderbySpecifications.callCount, 1, "then get order by specifications is called once");
		assert.strictEqual(spyOnRemoveOrderbySpec.calledWith("property3"), false, "then remove order by specifications is not called and the property is available for sort data");
	});
	QUnit.test("When representation type is switched to Bubble Chart", function(assert) {
		//arrange
		var spyOnFireEvent = sinon.spy(this.oRepresentationView, "fireEvent");
		//action
		spyOnAddDimension.reset();
		spyOnSetLabelDisplayOption.reset();
		spyOnSetDimensionKind.reset();
		this.representationController.handleChangeForChartType(_createEvent("BubbleChart"));
		//asserts for update Representation Type
		assert.strictEqual(spyOnGetText.calledWith("BubbleChart"), true, "then selected chart type text is called");
		assert.strictEqual(spyOnSetRepresentationType.calledWith("BubbleChart"), true, "then representation type is set to Bubble Chart");
		assert.strictEqual(spyOnSetAlternateRepresentationType.calledWith("TableRepresentation"), true, "then Table Representation is set as an alternate representation type");
		//asserts for update Tree Node
		assert.strictEqual(spyOnGetCategoriesForStep.calledWith(this.oRepresentationView.getViewData().oParentStep.getId()), true, "then getCategoriesForStep() is called");
		//asserts for update Bread Crumb 
		assert.strictEqual(spyOnGetText.calledWith("representation"), true, "then text is available for new chart type");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("Representation: Bubble Chart"), true, "then title and bread crumb is updated");
		//asserts for update Selected Node 
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(_getRepresentationInfo("BubbleChart", "Representation-3", this.oRepresentationView)), true, "then selected node is updated");
		//asserts for checking whether the old and new chart are similar or not
		assert.strictEqual(spyOnIsChartTypeSimilar.callCount, 1, "Then isChartTypeSimilar() was called");
		assert.deepEqual(spyOnIsChartTypeSimilar.args, [["TableRepresentation", "BubbleChart"]], "Then check was made between Table representation and Bubble Chart");
		assert.strictEqual(spyOnFireEvent.calledWith(ModelerConstants.events.REMOVEALLPROPERTIESFROMPARENTOBJECT), true, "then remove all properties when chart type is changed");
		//asserts for default state of representation
		assert.strictEqual(spyOnInstantiateBasicData.callCount, 2, "Then instantiateBasicDataAsPromise() was called for Representation view");
		assert.strictEqual(spyOnAddDimension.callCount, 0, "Then addDimension() was not called for the handleChangeForChartType");
		assert.strictEqual(spyOnSetLabelDisplayOption.callCount, 0, "then setLabelDisplayOption() is not called");
		assert.strictEqual(spyOnSetDimensionKind.callCount, 0, "Then setDimensionKind() was not called for the handleChangeForChartType");
		assert.strictEqual(spyOnAddMeasure.calledWith("property4"), true, "then addMeasure() is called");
		assert.strictEqual(spyOnAddMeasure.callCount, 1, "then addMeasure() is called for each required measure");
		assert.strictEqual(spyOnSetMeasureKind.calledWith("property4", "xAxis"), true, "then setMeasureKind() is called with the correct parameters");
		assert.strictEqual(spyOnSetMeasureKind.callCount, 1, "then setMeasureKind() is called for each added measure");
		//assert for fire event
		assert.strictEqual(spyOnFireEvent.calledWith(ModelerConstants.events.representation.SETCHARTICON), true, "then setChartIcon() is fired when chart type is changed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
	});
	QUnit.test("When representation type is switched to PieChart", function(assert) {
		var spyOnFireEvent = sinon.spy(this.oRepresentationView, "fireEvent");
		//action
		spyOnAddDimension.reset();
		spyOnSetLabelDisplayOption.reset();
		spyOnSetDimensionKind.reset();
		this.representationController.handleChangeForChartType(_createEvent("PieChart"));
		//asserts for update Representation Type
		assert.strictEqual(spyOnGetText.calledWith("PieChart"), true, "then selected chart type text is called");
		assert.strictEqual(spyOnSetAlternateRepresentationType.calledWith("TableRepresentation"), true, "then Table Representation is set as an alternate representation type");
		//asserts for update Tree Node
		assert.strictEqual(spyOnGetCategoriesForStep.calledWith(this.oRepresentationView.getViewData().oParentStep.getId()), true, "then getCategoriesForStep() is called");
		//asserts for update Bread Crumb 
		assert.strictEqual(spyOnGetText.calledWith("representation"), true, "then text is available for new chart type");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("Representation: Pie Chart"), true, "then title and bread crumb is updated");
		//asserts for update Selected Node 
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(_getRepresentationInfo("PieChart", "Representation-3", this.oRepresentationView)), true, "then selected node is updated");
		//asserts for checking whether the old and new chart are similar or not
		assert.strictEqual(spyOnIsChartTypeSimilar.callCount, 1, "Then isChartTypeSimilar() was called");
		assert.deepEqual(spyOnIsChartTypeSimilar.args, [["TableRepresentation", "PieChart"]], "Then check was made between Table representation and Pie Chart");
		assert.strictEqual(spyOnFireEvent.calledWith(ModelerConstants.events.REMOVEALLPROPERTIESFROMPARENTOBJECT), true, "then remove all properties when chart type is changed");
		//asserts for default state of representation
		assert.strictEqual(spyOnInstantiateBasicData.callCount, 2, "Then instantiateBasicDataAsPromise() was called for Representation view");
		assert.strictEqual(spyOnAddDimension.callCount, 1, "Then addDimension() was not called for the handleChangeForChartType");	
		assert.strictEqual(spyOnSetLabelDisplayOption.calledWith("property2", "keyAndText"), true, "then setLabelDisplayOption() is called");
		assert.strictEqual(spyOnSetDimensionKind.callCount, 1, "Then setDimensionKind() was called in the handleChangeForChartType");
		assert.strictEqual(spyOnAddMeasure.calledWith("property4"), true, "then add measure is called");
		assert.strictEqual(spyOnAddMeasure.callCount, 1, "then addMeasure() is called once");
		assert.strictEqual(spyOnSetMeasureKind.calledWith("property4", "sectorSize"), true, "then setMeasureKind() is called with the correct parameters");
		assert.strictEqual(spyOnSetMeasureKind.callCount, 1, "then setMeasureKind() is called");
		//assert for fire event
		assert.strictEqual(spyOnFireEvent.calledWith(ModelerConstants.events.representation.SETCHARTICON), true, "then setChartIcon() is fired when chart type is changed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
	});
	QUnit.test("Test handlePreviewButtonPress for table representation", function(assert) {
		//action
		this.representationController.handlePreviewButtonPress();
		//arrange
		var oPreviewContentView = this.representationController.byId("idPreviewContentView");
		//asserts
		assert.ok(oPreviewContentView, "then preview content view is available for view");
		assert.strictEqual(oPreviewContentView.byId("idPreviewContentDialog").isOpen(), true, "then preview content dialog is open");
		oPreviewContentView.byId("idPreviewContentDialog").destroy();
		assert.strictEqual(oPreviewContentView.byId("idPreviewContentDialog"), undefined, "then preview content dialog is not available");
	});
	QUnit.test("Test onExit for representation", function(assert) {
		_commonTestOnExit(assert, this.oRepresentationView, this.representationController);
	});
	QUnit.module("Given a Table Representation with an old configuration", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();//Stop the tests until modeler instance is got
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance; //Modeler instance from callback
				that.oRepresentation = that.oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[3];
				_commonSpiesInBeforeEach(that.oRepresentation, that.oModelerInstance);
				that.oRepresentationView = _instantiateView(that, assert);
				that.representationController = that.oRepresentationView.getController();
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function(assert) {
			var done = assert.async();
			setTimeout(function() { // tidy up only after async setting of valueState by representation.controller happened
				_commonCleanUpsInAfterEach(this);
				done();
			}.bind(this), 1000);
		}
	});
	QUnit.test("when table representation is initialized ", function(assert) {
		//common asserts when representation is initialized
		_commonAsserts(assert, this.oRepresentationView, spyOnGetText, spyOnEditorsGetStep, spyOnStepGetRepresentation, this.representationController, undefined, this.oModelerInstance);
		_checkAvailablityOfPreviewButton(assert, spyOnGetText, this.oRepresentationView, this.representationController);
		//asserts for representation object 
		assert.strictEqual(spyOnGetTextPool.callCount, 2, "then text pool is called twice");
		assert.strictEqual(spyOnStepGetRepresentation.callCount, 1, "then get representation is called only once");
		assert.strictEqual(spyOnStepGetRepresentation.calledWith(this.oRepresentationView.getViewData().oParentStep.getId() + "-Representation-4"), true, "then  representation exists ");
		//asserts for properties
		assert.strictEqual(spyOnGetProperties.called, true, "then get properties is called");
		assert.strictEqual(this.oRepresentation.getRepresentationType(), "TableRepresentation", "then representation is table representation");
		//asserts for heal representation sort data 
		assert.strictEqual(spyOnGetOrderbySpecifications.callCount, 1, "then get order by specifications is called once");
	});
	QUnit.module("When tree table representation is initilized with display options label as text", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();//Stop the tests until modeler instance is got
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance; //Modeler instance from callback
				spyOnStepGetHierarchicalRepresentation = sinon.spy(that.oModelerInstance.firstHierarchicalStep, "getRepresentation");
				spyOnSetHierarchyPropertyLabelDisplayOption = sinon.spy(that.oModelerInstance.firstHierarchicalStep.getRepresentations()[1], "setHierarchyPropertyLabelDisplayOption");
				that.oRepresentation = that.oModelerInstance.firstHierarchicalStep.getRepresentations()[1];
				_commonSpiesInBeforeEach(that.oRepresentation, that.oModelerInstance);
				that.oRepresentationView = _instantiateView(that, assert, true);
				that.representationController = that.oRepresentationView.getController();
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach(this);
			spyOnStepGetHierarchicalRepresentation.restore();
			spyOnSetHierarchyPropertyLabelDisplayOption.restore();
		}
	});
	QUnit.test("when tree table representation is initialized", function(assert) {
		//common asserts when representation is initialized
		_commonAsserts(assert, this.oRepresentationView, spyOnGetText, spyOnEditorsGetStep, spyOnStepGetRepresentation, this.representationController, true, this.oModelerInstance);
		_checkAvailablityOfPreviewButtonForTreeTable(assert, spyOnGetText, this.oRepresentationView, this.representationController);
		//asserts for representation object 
		assert.strictEqual(spyOnGetTextPool.callCount, 3, "then text pool is called thrice");
		assert.strictEqual(spyOnStepGetHierarchicalRepresentation.called, true, "then get representation is called");
		assert.strictEqual(spyOnStepGetHierarchicalRepresentation.calledWith(this.oRepresentationView.getViewData().oParentStep.getId() + "-Representation-2"), true, "then  representation exists ");
		//asserts for hierarchical property and other property column
		assert.strictEqual(spyOnStepGetHierarchicalRep.called, true, "then get hierarchical property is called");
		assert.strictEqual(this.oRepresentation.getRepresentationType(), "TreeTableRepresentation", "then representation is tree table representation");
		assert.strictEqual(this.oRepresentation.getHierarchyProperty(), this.oRepresentationView.getViewData().oParentStep.getHierarchyProperty(), "then correct hierarchical property is set to the representation");
		assert.strictEqual(spyOnSetHierarchyPropertyLabelDisplayOption.callCount, 1, "then setHierarchyPropertyLabelDisplayOption is called");
		assert.strictEqual(spyOnGetHierarchyNodeIdAsPromise.called, true, "then getHierarchyNodeIdAsPromise is called to get the node id of hierarchical property");
		assert.strictEqual(spyOnGetHierarchyNodeIdAsPromise.calledWith("testService1", "entitySet1", "property1"), true, "then getHierarchyNodeIdAsPromise is called to get the node id of hierarchical property");
		assert.strictEqual(spyOnSetHierarchyPropertyLabelDisplayOption.calledWith("text"), true, "then HierarchyProperty LabelDisplayOption is set as text");
	});
	QUnit.module("When tree table representation is initialized with display options label as key", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();//Stop the tests until modeler instance is got
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance; //Modeler instance from callback
				spyOnStepGetHierarchicalRepresentation = sinon.spy(that.oModelerInstance.firstHierarchicalStep, "getRepresentation");
				spyOnSetHierarchyPropertyLabelDisplayOption = sinon.spy(that.oModelerInstance.firstHierarchicalStep.getRepresentations()[2], "setHierarchyPropertyLabelDisplayOption");
				spyOnGetHierarchyPropertyLabelDisplayOption = sinon.spy(that.oModelerInstance.firstHierarchicalStep.getRepresentations()[2], "getHierarchyPropertyLabelDisplayOption");
				that.oRepresentation = that.oModelerInstance.firstHierarchicalStep.getRepresentations()[2];
				_commonSpiesInBeforeEach(that.oRepresentation, that.oModelerInstance);
				spyOnStepGetHierarchicalRep.restore();
				spyOnStepGetHierarchicalRep = sinon.spy(that.oModelerInstance.firstHierarchicalStep.getRepresentations()[2], "getHierarchyProperty");
				that.oRepresentationView = _instantiateView(that, assert, true);
				that.representationController = that.oRepresentationView.getController();
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach(this);
			spyOnStepGetHierarchicalRepresentation.restore();
			spyOnSetHierarchyPropertyLabelDisplayOption.restore();
			spyOnGetHierarchyPropertyLabelDisplayOption.restore();
		}
	});
	QUnit.test("when tree table representation is initialized ", function(assert) {
		//common asserts when representation is initialized
		_commonAsserts(assert, this.oRepresentationView, spyOnGetText, spyOnEditorsGetStep, spyOnStepGetRepresentation, this.representationController, true, this.oModelerInstance);
		_checkAvailablityOfPreviewButtonForTreeTable(assert, spyOnGetText, this.oRepresentationView, this.representationController);
		//asserts for representation object 
		assert.strictEqual(spyOnGetTextPool.callCount, 3, "then text pool is called thrice");
		assert.strictEqual(spyOnStepGetHierarchicalRepresentation.called, true, "then get representation is called");
		assert.strictEqual(spyOnStepGetHierarchicalRepresentation.calledWith(this.oRepresentationView.getViewData().oParentStep.getId() + "-Representation-3"), true, "then  representation exists ");
		//asserts for hierarchical property and other property column
		assert.strictEqual(spyOnStepGetHierarchicalRep.called, true, "then get hierarchical property is called");
		assert.strictEqual(this.oRepresentation.getRepresentationType(), "TreeTableRepresentation", "then representation is tree table representation");
		assert.strictEqual(this.oRepresentation.getHierarchyProperty(), this.oRepresentationView.getViewData().oParentStep.getHierarchyProperty(), "then correct hierarchical property is set to the representation");
		assert.strictEqual(spyOnGetHierarchyPropertyLabelDisplayOption.called, true, "then setHierarchyPropertyLabelDisplayOption is set already as key");
		assert.strictEqual(spyOnGetHierarchyPropertyLabelDisplayOption(), "key", "then HierarchyProperty LabelDisplayOption is set as key");
	});
	QUnit.module("Test for handleChangeForChartType from different types of chart(pie) to similar chart(column) ", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();//Stop the tests until modeler instance is got
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance; //Modeler instance from callback
				that.oRepresentation = that.oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[1];
				_commonSpiesInBeforeEach(that.oRepresentation, that.oModelerInstance);
				that.oRepresentationView = _instantiateView(that, assert);
				that.representationController = that.oRepresentationView.getController();
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach(this);
		}
	});
	QUnit.test("Test handleChangeForChartType for representation Column Chart", function(assert) {
		//arrange
		var spyOnFireEvent = sinon.spy(this.oRepresentationView, "fireEvent");
		//action
		this.representationController.handleChangeForChartType(_createEvent("ColumnChart"));
		//asserts for update Representation Type
		assert.strictEqual(spyOnGetText.calledWith("ColumnChart"), true, "then selected chart type text is called");
		assert.strictEqual(spyOnGetRepresentationType.called, true, "then get representation type is called");
		assert.strictEqual(spyOnSetRepresentationType.calledWith("ColumnChart"), true, "then representation type is set");
		assert.strictEqual(spyOnSetAlternateRepresentationType.calledWith("TableRepresentation"), true, "then set alternate representation type is called");
		//asserts for update Tree Node
		assert.strictEqual(spyOnGetCategoriesForStep.calledWith(this.oRepresentationView.getViewData().oParentStep.getId()), true, "then get categories for step is called");
		assert.strictEqual(spyOnGetRepresentationType.called, true, "then  representation type is present");
		//asserts for update Bread Crumb 
		assert.strictEqual(spyOnGetText.calledWith("representation"), true, "then text is available for new chart type");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("Representation: Column Chart"), true, "then title and bread crumb is updated");
		//asserts for update Selected Node 
		assert.strictEqual(spyOnUpdateSelectedNode.called, true, "then selected node is updated");
		//asserts for checking whether the old and new chart are similar or not
		assert.strictEqual(spyOnFireEvent.calledWith(ModelerConstants.events.REMOVEALLPROPERTIESFROMPARENTOBJECT), true, "then remove all properties when chart type is changed");
		//asserts for default state of representation
		assert.strictEqual(spyOnAddDimension.calledWith("property2"), true, "then add dimension is called");
		assert.strictEqual(spyOnAddDimension.callCount, 2, "then add dimension is called twice");
		assert.strictEqual(spyOnSetLabelDisplayOption.calledWith("property2", "keyAndText"), true, "then set label display option is called");
		assert.strictEqual(spyOnSetDimensionKind.calledWith("property2", "xAxis"), true, "then set dimension kind is called");
		assert.strictEqual(spyOnSetDimensionKind.callCount, 2, "then set dimension kind is called twice");
		assert.strictEqual(spyOnAddMeasure.calledWith("property4"), true, "then add measure is called");
		assert.strictEqual(spyOnAddMeasure.callCount, 2, "then add measure is called twice");
		assert.strictEqual(spyOnSetMeasureKind.calledWith("property4", "yAxis"), true, "then set measure kind is called");
		assert.strictEqual(spyOnSetMeasureKind.callCount, 2, "then set measure kind is called once");
		//assert for fire event
		assert.strictEqual(spyOnFireEvent.calledWith(ModelerConstants.events.representation.SETCHARTICON), true, "then setChartIcon is fired when chart type is changed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
	});
	QUnit.module("Test for handleChangeForChartType from same type of charts(Column to Line)", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();//Stop the tests until modeler instance is got
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance; //Modeler instance from callback
				that.oRepresentation = that.oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0];
				_commonSpiesInBeforeEach(that.oRepresentation, that.oModelerInstance);
				that.oRepresentationView = _instantiateView(that, assert);
				that.representationController = that.oRepresentationView.getController();
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach(this);
		}
	});
	QUnit.test("Test handleChangeForChartType for representation Line Chart", function(assert) {
		//arrange
		var spyOnFireEvent = sinon.spy(this.oRepresentationView, "fireEvent");
		//action
		this.representationController.handleChangeForChartType(_createEvent("LineChart"));
		//asserts for update Representation Type
		assert.strictEqual(spyOnGetText.calledWith("LineChart"), true, "then selected chart type text is called");
		assert.strictEqual(spyOnGetRepresentationType.called, true, "then get representation type is called");
		assert.strictEqual(spyOnSetRepresentationType.calledWith("LineChart"), true, "then representation type is set");
		assert.strictEqual(spyOnSetAlternateRepresentationType.calledWith("TableRepresentation"), true, "then set alternate representation type is called");
		//asserts for update Tree Node
		assert.strictEqual(spyOnGetCategoriesForStep.calledWith(this.oRepresentationView.getViewData().oParentStep.getId()), true, "then get categories for step is called");
		assert.strictEqual(spyOnGetRepresentationType.called, true, "then  representation type is present");
		//asserts for update Bread Crumb
		assert.strictEqual(spyOnGetText.calledWith("representation"), true, "then text is available for new chart type");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("Representation: Line Chart"), true, "then title and bread crumb is updated");
		//asserts for update Selected Node
		assert.strictEqual(spyOnUpdateSelectedNode.called, true, "then selected node is updated");
		//asserts for checking whether the old and new chart are similar or not
		assert.notStrictEqual(spyOnFireEvent.calledWith(ModelerConstants.events.REMOVEALLPROPERTIESFROMPARENTOBJECT), true, "then dont remove all properties since chart type is similar");
		assert.strictEqual(spyOnFireEvent.calledWith(ModelerConstants.events.representation.SETCHARTICON), true, "then setChartIcon is fired when chart type is changed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
	});
	QUnit.module("Given a new Representation with no dimensions or measures", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();//Stop the tests until modeler instance is got
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance; //Modeler instance from callback
				done();//Start the test once modeler instance is got and setup is done
			});
			this.oRepresentation = null;
		},
		afterEach : function() {
			modelerUIHelper.destroyModelerInstance();
			this.oModelerInstance.reset();
			if (this.oRepresentationView){
				sap.apf.modeler.ui.utils.StepPropertyMetadataHandler.restore();
				this.oRepresentationView.destroy();
			}
		}
	});
	function execTestSpec(assert, testEnv, testSpec){
		var done = assert.async();
		testEnv.aDimensions = testSpec.dimensions;
		testEnv.aMeasures = testSpec.measures;
		testEnv.oRepresentationView = _instantiateView(testEnv, assert);
		assert.ok(testEnv.oRepresentationView.getController().promiseControllerIsCreated, "Then oRepresentationView.getController().promiseControllerIsCreated is defined");
		testEnv.oRepresentationView.getController().promiseControllerIsCreated.then(function(){
			var representationController = testEnv.oRepresentationView.getController();
			//arrange
			var oModelForRepresentationEntity = _getModelForChartTypeValueHelp(testEnv.aDimensions.length, testEnv.aMeasures.length);
			assert.deepEqual(representationController.byId("idChartType").getModel().getData(), oModelForRepresentationEntity, testSpec.text + " then model for chart type is set");
			assert.strictEqual(testEnv.oRepresentationView.byId("idChartType").getSelectedKey(), "ColumnChart", testSpec.text + " then column chart is the selected key");
			done();
		});
	}
	QUnit.test("When creating the Representation view, initialized with 0 measure and 0 dimension", function(assert) {
		execTestSpec(assert, this, {
			dimensions: [],
			measures: [],
			text: "Combination: [] x []"
		});
	});
	QUnit.test("When creating the Representation view, initialized with 0 measure and 1 dimension", function(assert) {
		execTestSpec(assert, this, {
				dimensions: ["property2"],
				measures: [],
				text: "Combination: 1 x []"
		});
	});
	QUnit.test("When creating the Representation view, initialized with 1 measure and 0 dimension", function(assert) {
		execTestSpec(assert, this, {
				dimensions: [],
				measures: ["property4"],
				text: "Combination: [] x 1"
		});
	});
	QUnit.test("When creating the Representation view, initialized with 1 measure and 1 dimension", function(assert) {
		execTestSpec(assert, this, {
				dimensions: ["property2"],
				measures: ["property4"],
				text: "Combination: 1 x 1"
		});
	});
	QUnit.test("When Representation is initialized with two measure properties and 0 dimensions", function(assert) {
		execTestSpec(assert, this, {
			dimensions: [],
			measures: ["property4", "property5"],
			text: "Combination: 1 x 1"
		});
	});
	QUnit.test("When Representation is initialized with two measure properties and one or more dimension properties", function(assert) {
		execTestSpec(assert, this, {
			dimensions: ["property2"],
			measures: ["property4", "property5"],
			text: "Combination: 1 x 1"
		});
	});
	QUnit.test("When Representation is initialized with three or more measure properties and no dimensions", function(assert) {
		execTestSpec(assert, this, {
			dimensions: [],
			measures: ["property4", "property5", "property6"],
			text: "Combination: 1 x 1"
		});
	});
	QUnit.test("When Representation is initialized with one or more dimension properties and three or more measure properties", function(assert) {
		execTestSpec(assert, this, {
			dimensions: ["property2"],
			measures: ["property4", "property5", "property6"],
			text: "Combination: 1 x 1"
		});
	});
	QUnit.module("Given the list of APF representation types and a getText stub", {
		beforeEach : function(assert) {
			var that = this;
			this.resolvedText = "hugo";
			this.aRepresentationTypes = RepresentationTypes();
			this.coreApi = {
					getText: function(key, aNames) {
						return that.resolvedText;
					}
			};
			this.representationController = new UiControllerRepresentation();
			this.spyGetText = sinon.spy(this.coreApi, "getText");
		},
		afterEach : function() {
			this.spyGetText.restore();
		}
	});
	QUnit.test("When calling _getAnnotatedChartTypes with empty array of chart types", function(assert) {
		var aChartTypeModel = [];
		// act
		var result = this.representationController._getAnnotatedChartTypes(this.aRepresentationTypes, aChartTypeModel, [], [], this.coreApi);
		// proving the induction anchor
		assert.strictEqual(result.length, 0, "returns the empty array");
	});
	QUnit.test("When calling _getAnnotatedChartTypes with single chart type which gets annotated", function(assert) {
		var aChartTypeModel = [{
			"key" : "ColumnChart",
			"name" : "Column Chart Name"
		}];
		// act
		var result = this.representationController._getAnnotatedChartTypes(this.aRepresentationTypes, aChartTypeModel, [], [], this.coreApi);
		// proving the induction n-1->n, and that the proper input/output contract
		assert.strictEqual(result.length, aChartTypeModel.length, "then it returns a changed model which is array of equal size");
		assert.strictEqual(result[result.length - 1].key, aChartTypeModel[aChartTypeModel.length - 1].key,
			"the n-th element is an object and has a member 'key' and the key is unchanged");
		assert.notStrictEqual(result[result.length - 1].name, undefined,
			"the n-th element has a member 'name'");
		assert.strictEqual(result[result.length - 1].name, this.resolvedText,
			"The n-th element receives in member 'name' the value of getText which is the annotation");
		assert.strictEqual( this.coreApi.getText.callCount, aChartTypeModel.length,
			"getText is called for each chart type that shall be annotated");
		assert.strictEqual( this.coreApi.getText.getCall(0).args[0], "modeler.ui.representation.invalidChartTypes", "with correct text key");
		assert.strictEqual( this.coreApi.getText.getCall(0).args[1][0], aChartTypeModel[aChartTypeModel.length - 1].name, "with chart type key");
	});
	QUnit.test("When calling _getAnnotatedChartTypes with any single chart type such that it does not get annotated", function(assert) {
		var aChartTypeModel = [{
			"key" : "ColumnChart",
			"name" : "Column Chart Name"
		}];
		// act
		var result = this.representationController._getAnnotatedChartTypes(this.aRepresentationTypes, aChartTypeModel,
			["a"], ["b","c","d"], this.coreApi);
		// proving the induction n-1->n, and that the proper input/output contract
		assert.strictEqual(result.length, aChartTypeModel.length, "then it returns a changed model which is array of equal size");
		assert.strictEqual(result[result.length - 1].key, aChartTypeModel[aChartTypeModel.length - 1].key,
			"the n-th element is an object and has a member 'key' and the key is unchanged");
		assert.notStrictEqual(result[result.length - 1].name, undefined,
			"the n-th element has a member 'name'");
		assert.strictEqual(result[result.length - 1].name, aChartTypeModel[aChartTypeModel.length - 1].name,
			"The n-th element in member 'name' has the unchanged value without annotation");
		assert.strictEqual( this.coreApi.getText.callCount, 0,
			"getText is not called");
	});
	function getAnnotationConditionsForCharts(){
		return {
			measuresEQ0 : ["ColumnChart","BarChart", "LineChart","LineChartWithTwoVerticalAxes","LineChartWithTimeAxis",
				"PieChart","ScatterPlotChart","BubbleChart","StackedColumnChart","StackedBarChart","PercentageStackedColumnChart",
				"PercentageStackedBarChart","HeatmapChart"],
			measuresEQ1AndDimensionsEQ0 : ["LineChart","LineChartWithTwoVerticalAxes","LineChartWithTimeAxis","ScatterPlotChart",
				"BubbleChart","HeatmapChart"],
			measuresEQ1AndDimensionsGE1 : ["LineChartWithTwoVerticalAxes","ScatterPlotChart","BubbleChart"],
			measuresEQ2AndDimensionsEQ0 : ["LineChart","LineChartWithTwoVerticalAxes","LineChartWithTimeAxis","BubbleChart","HeatmapChart"],
			measuresEQ2AndDimensionsGE1 : ["BubbleChart"],
			measuresEQ3AndDimensionsEQ0 : ["LineChart","LineChartWithTwoVerticalAxes","LineChartWithTimeAxis","HeatmapChart"],
			measuresAndDimensionsInSufficientCombination : []
		};
	}
	QUnit.module("Given the list of APF representation types", {
		beforeEach : function(assert) {
			var aRepresentationTypes = RepresentationTypes();
			var coreApi = {
				getText: function(key, aNames) {
					return "";
				}
			};
			var aChartTypeModel = _getModelForRepresentation().Objects;
			var representationController = new UiControllerRepresentation();
			this.combinedTest = function(parameters) {
				// act
				var result = representationController._getAnnotatedChartTypes(aRepresentationTypes, aChartTypeModel,
					parameters.dimensions, parameters.measures, coreApi);
				// proving: annotating through get text, using the correct text key.
				assert.strictEqual(result.length, aChartTypeModel.length, "all chart types are returned, and result is an array");
				assert.ok(result.length > parameters.expectedAnnotatedElements.length, "the table representation is never annotated");
				assert.strictEqual( coreApi.getText.callCount, parameters.expectedAnnotatedElements.length, "getText is called for each chart type that shall be annotated");
			};
			this.spyGetText = sinon.spy(coreApi, "getText");
		},
		afterEach : function() {
			this.spyGetText.restore();
		}
	});
	QUnit.test("When no properties are assigned", function(assert) {
		this.combinedTest({
			dimensions : [],
			measures : [],
			expectedAnnotatedElements: getAnnotationConditionsForCharts().measuresEQ0
		});
	});
	QUnit.test("When one or more dimension properties are assigned", function(assert) {
		this.combinedTest({
			dimensions : ["property2"],
			measures : [],
			expectedAnnotatedElements: getAnnotationConditionsForCharts().measuresEQ0
		});
	});
	QUnit.test("When one measure property is assigned", function(assert) {
		this.combinedTest({
			dimensions : [],
			measures : ["property4"],
			expectedAnnotatedElements: getAnnotationConditionsForCharts().measuresEQ1AndDimensionsEQ0
		});
	});
	QUnit.test("When one or more dimension properties and one measure property are assigned", function(assert) {
		this.combinedTest({
			dimensions : ["property2"],
			measures : ["property4"],
			expectedAnnotatedElements: getAnnotationConditionsForCharts().measuresEQ1AndDimensionsGE1
		});
	});
	QUnit.test("When two measure properties are assigned", function(assert) {
		this.combinedTest({
			dimensions : [],
			measures : ["property4", "property5"],
			expectedAnnotatedElements: getAnnotationConditionsForCharts().measuresEQ2AndDimensionsEQ0
		});
	});
	QUnit.test("When one or more dimension properties and two measure properties are assigned", function(assert) {
		this.combinedTest({
			dimensions : ["property2"],
			measures : ["property4", "property5"],
			expectedAnnotatedElements: getAnnotationConditionsForCharts().measuresEQ2AndDimensionsGE1
		});
	});
	QUnit.test("When three or more measure properties are assigned", function(assert) {
		this.combinedTest({
			dimensions : [],
			measures : ["property4", "property5", "property6"],
			expectedAnnotatedElements: getAnnotationConditionsForCharts().measuresEQ3AndDimensionsEQ0
		});
	});
	QUnit.test("When one or more dimension properties and three or more measure properties are assigned", function(assert) {
		this.combinedTest({
			dimensions : ["property2"],
			measures : ["property4", "property5", "property6"],
			expectedAnnotatedElements: getAnnotationConditionsForCharts().measuresAndDimensionsInSufficientCombination
		});
	});
	QUnit.module("Async handling of RepresentationBasicDataHandler", {
		beforeEach : function() {
			sinon.config = {
				useFakeTimers : false
			}; //because of setTimout usage
			var validationState = true;
			this.representationBasicDataHandlerStub = sinon.stub(RepresentationBasicDataHandler.prototype, "instantiateBasicDataAsPromise", function(){
				var deferred = jQuery.Deferred();
				setTimeout(function(){
					validationState = false;
					deferred.resolve();
				},1);
				return deferred;
			});
			this.resetValidationState = function(){
				this.oView.getController().byId("idChartType").setValueState("None");
				validationState = true;
			};
			this.validationStateStub = sinon.stub(ViewValidator.prototype, "getValidationState", function(){
				return validationState;
			});
			var coreApi = {
				getRepresentationTypes : function(){
					return new RepresentationTypes();
				},
				getText : function(textKey){
					return textKey;
				},
				getEntityTypeMetadataAsPromise : function(){
					return jQuery.Deferred().resolve();
				}
			};
			var oRepresentation = {
				getId : function(){
					return "RepresentationId";
				},
				getRepresentationType : function(){
					return "ColumnChart";
				},
				setRepresentationType : function(){},
				setAlternateRepresentationType : function(){},
				getDimensions : function(){
					return [];
				},
				getMeasures : function(){
					return [];
				},
				getOrderbySpecifications: function(){
					return [];
				},
				getRightUpperCornerTextKey: function(){},
				getRightLowerCornerTextKey: function(){},
				getLeftUpperCornerTextKey: function(){},
				getLeftLowerCornerTextKey: function(){}
			};
			var oParentStep = {
				getId : function() {
					return "StepId";
				},
				createRepresentation : function(){
					return oRepresentation;
				},
				getType : function(){
					return "Step";
				},
				getService: function(){},
				getEntitySet: function(){},
				getSelectProperties: function(){
					return [];
				},
				getConsumablePropertiesForRepresentation : function(){
					return jQuery.Deferred().resolve({
						consumable: [],
						available: []
					});
				},
				getConsumableSortPropertiesForRepresentation: function(){
					return jQuery.Deferred().resolve({
						consumable: [],
						available: []
					});
				},
				getTopN: function(){},
				getRightUpperCornerTextKey: function(){},
				getRightLowerCornerTextKey: function(){},
				getLeftUpperCornerTextKey: function(){},
				getLeftLowerCornerTextKey: function(){}
			};
			var oConfigurationEditor = {
				getStep : function(){
					return oParentStep;
				},
				getCategoriesForStep : function(){
					return [];
				},
				setIsUnsaved : function(){}
			};
			this.oView = sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.representation",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : {
					updateTitleAndBreadCrumb : function(){},
					updateTree : function(){},
					oCoreApi : coreApi,
					oConfigurationEditor : oConfigurationEditor,
					oConfigurationHandler : {
						getTextPool : function(){}
					},
					oFooter : {
						addContentRight: function(){}
					},
					oParams : {
						arguments : {
							stepId : "StepId"
						}
					}
				}
			});
		},
		afterEach : function(){
			this.representationBasicDataHandlerStub.restore();
			this.validationStateStub.restore();
		}
	});
	QUnit.test("Validation state in set Chart Type (initialization)", function(assert) {
		var done = assert.async();
		var oController = this.oView.getController();
		oController.promiseControllerIsCreated.then(function(){
			setTimeout(function(){
				assert.strictEqual(oController.byId("idChartType").getValueState(), "Error", "Then the validation state is set after the basic representation data is instantiated compeltely");
				done();
			}, 1000);
		});
	});
	// QUnit.test("Validation when switching chart type", function(assert) {  FIXME (race condition)
	// 	var done = assert.async();
	// 	var that = this;
	// 	var oController = this.oView.getController();
	// 	oController.promiseControllerIsCreated.then(function(){
	// 		setTimeout(function(){
	// 			assert.strictEqual(oController.byId("idChartType").getValueState(), "Error", "Initialization was correct");
	// 			that.resetValidationState(); //ValidationState was already set after startup, we reset it so we can test the validation state after the chartSwitch
	// 			oController.handleChangeForChartType(_createEvent("BubbleChart"));
	// 			setTimeout(function(){
	// 				assert.strictEqual(oController.byId("idChartType").getValueState(), "Error", "Then the validation state is set after the basic representation data is instantiated compeltely");
	// 				done();
	// 			}, 1000);
	// 		}, 1000);
	// 	});
	// });
	// QUnit.test("Validation when switching chart type to similar chart Type", function(assert) { FIXME
	// 	var done = assert.async();
	// 	var that = this;
	// 	var oController = this.oView.getController();
	// 	oController.promiseControllerIsCreated.then(function(){
	// 		setTimeout(function(){
	// 			assert.strictEqual(oController.byId("idChartType").getValueState(), "Error", "Initialization was correct");
	// 			that.resetValidationState(); //ValidationState was already set after startup, we reset it so we can test the validation state after the chartSwitch
	// 			oController.handleChangeForChartType(_createEvent("BarChart"));
	// 			setTimeout(function(){
	// 				assert.strictEqual(oController.byId("idChartType").getValueState(), "Error", "Then the validation state is set after the basic representation data is instantiated compeltely");
	// 				done();
	// 			}, 1000);
	// 		}, 1000);
	// 	}.bind(this));
	// });
	QUnit.module("Defaulting in representation", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			this.representationBasicDataHandlerStub = sinon.stub(RepresentationBasicDataHandler.prototype, "instantiateBasicDataAsPromise", function(){
				return Promise.resolve();
			});//TestModule is not handling representationBasicdataHandler
			this.sortDataHandlerStub = sinon.stub(SortDataHandler.prototype, "instantiateRepresentationSortData", function(){});//TestModule is not handling sortDataHandler
			var coreApi = {
				getRepresentationTypes : function(){
					return new RepresentationTypes();
				},
				getText : function(textKey){
					return textKey;
				},
				getEntityTypeMetadataAsPromise : function(){
					return jQuery.Deferred().resolve({
						getPropertyMetadata : function(property){
							return {
								"aggregation-role" : property.indexOf("Dimension") > -1 ? "dimension" : "measure"
							};
						}
					});
				}
			};
			this.oRepresentation = new ModelerCoreRepresentation("representationId", {
				constructors : {
					ElementContainer : ElementContainer,
					Hashtable : Hashtable
				},
				instances : {
					messageHandler : {
						check : function(){}
					}
				}
			});
			var oParentStep = {
				getId : function() {
					return "StepId";
				},
				getRepresentation : function(){}, //no return value, because we always want to create a new representation
				createRepresentation : function(){
					return that.oRepresentation;
				},
				getType : function(){
					return "Step";
				},
				getService: function(){},
				getEntitySet: function(){},
				getSelectProperties: function(){
					return ["Dimension1", "Dimension2", "Measure1", "Measure2"];
				},
				getTopN: function(){},
				getRightUpperCornerTextKey: function(){},
				getRightLowerCornerTextKey: function(){},
				getLeftUpperCornerTextKey: function(){},
				getLeftLowerCornerTextKey: function(){}
			};
			var oConfigurationEditor = {
				getStep : function(){
					return oParentStep;
				},
				getCategoriesForStep : function(){
					return [];
				},
				setIsUnsaved : function(){}
			};
			this.oView = sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.representation",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : {
					updateTree : function(){},
					oCoreApi : coreApi,
					oConfigurationEditor : oConfigurationEditor,
					oConfigurationHandler : {
						getTextPool : function(){}
					},
					oFooter : {
						addContentRight: function(){}
					},
					oParams : {
						arguments : {
							stepId : "StepId",
							representationId : "RepresentationId"
						}
					},
					updateTitleAndBreadCrumb : function(){}
				}
			});
			this.oController = this.oView.getController();
			this.oController.promiseControllerIsCreated.then(function(){
				done();
			});
		},
		afterEach: function() {
			this.representationBasicDataHandlerStub.restore();
			this.sortDataHandlerStub.restore();
		}
	});
	QUnit.test("Initialization", function(assert) {
		assert.deepEqual(this.oRepresentation.getDimensions(), ["Dimension1"], "Core representation has correct dimension defaulted");
		assert.deepEqual(this.oRepresentation.getDimensionKind("Dimension1"), "xAxis", "Dimension has correct kind");
		assert.deepEqual(this.oRepresentation.getMeasures(), ["Measure1"], "Core representation has correct measure defaulted");
		assert.deepEqual(this.oRepresentation.getMeasureKind("Measure1"), "yAxis", "Measure has correct kind");
	});
	QUnit.test("Representation is switched to combination chart", function(assert) {
		this.oController.handleChangeForChartType(_createEvent("CombinationChart"));
		assert.deepEqual(this.oRepresentation.getDimensions(), ["Dimension1"], "Core representation has correct dimension defaulted");
		assert.deepEqual(this.oRepresentation.getDimensionKind("Dimension1"), "xAxis", "Dimension has correct kind");
		assert.deepEqual(this.oRepresentation.getMeasures(), ["Measure1", "Measure2"], "Core representation has correct measures defaulted");
		assert.deepEqual(this.oRepresentation.getMeasureKind("Measure1"), "yAxis", "Measure1 has correct kind");
		assert.deepEqual(this.oRepresentation.getMeasureKind("Measure2"), "yAxis", "Measure2 has correct kind");
	});
	QUnit.test("Representation is switched to heatmap chart", function(assert) {
		this.oController.handleChangeForChartType(_createEvent("HeatmapChart"));
		assert.deepEqual(this.oRepresentation.getDimensions(), ["Dimension1", "Dimension2"], "Core representation has correct dimensions defaulted");
		assert.deepEqual(this.oRepresentation.getDimensionKind("Dimension1"), "xAxis", "Dimension1 has correct kind");
		assert.deepEqual(this.oRepresentation.getDimensionKind("Dimension2"), "xAxis2", "Dimension2 has correct kind");
		assert.deepEqual(this.oRepresentation.getMeasures(), ["Measure1"], "Core representation has correct measure defaulted");
		assert.deepEqual(this.oRepresentation.getMeasureKind("Measure1"), "sectorColor", "Measure1 has correct kind");
	});
});