/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2016 SAP SE. All rights reserved
 */

sap.ui.define("sap.apf.modeler.ui.tStep.qunit", [
	"sap/apf/testhelper/modelerUIHelper"
], function(modelerUIHelper) {
	'use strict';

	var oModelerInstance, oStepView, oTextPool, spyOnGetText, spyOnSetTextOfTextPool, spyOnConfigEditorSetIsUnsaved;
	var oInputControl = new sap.m.Input({
		showSuggestion : true,
		suggestionItems : {
			path : '/Objects',
			template : new sap.ui.core.Item({
				key : '{key}',
				text : '{name}'
			})
		}
	});
	function _getModelForFilterProperties() {
		return {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			} ]
		};
	}
	function _createEvent(sValue) {
		return {
			getSource : function() {
				return oInputControl;
			},
			getParameter : function(parameterName) {
				if (parameterName === "suggestValue") {
					return "step";
				}
			}
		};
	}
	function _stepPropertyMetadataHandlerStub() {
		return {
			getEntityTypeMetadataAsPromise : function() {
				return sap.apf.utils.createPromise({
					getPropertyMetadata : function(){
						return [];
					}
				});
			},
			hasTextPropertyOfDimension : function(object, property) {
				if (property === "property3") {
					return false;
				}
				return true;
			},
			getDefaultLabel : function(entityTypeMetadata, oText) {
				return oText;
			},
			getProperties : function() {
				return [ "property2", "property3", "property4" ];
			},
			getPropertyMetadata : function(entityTypeMetadata, sPropertyName) {
				return [ {
					"hierarchy-node-for" : sPropertyName
				} ];
			},
			getFilterMappingEntityTypeMetadataAsPromise : function() {
				return sap.apf.utils.createPromise({
					getPropertyMetadata : function(){
						return [];
					}
				});
			}
		};
	}
	function _instantiateView(sId, assert, bIsHierarchicalStep) {
		var oStepController = new sap.ui.controller("sap.apf.modeler.ui.controller.step");
		var spyOnInit = sinon.spy(oStepController, "onInit");
		var setDetailDataSpy = sinon.spy(oStepController, "setDetailData");
		sinon.stub(sap.apf.modeler.ui.utils, "StepPropertyMetadataHandler", _stepPropertyMetadataHandlerStub);
		var oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.step",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oStepController,
			viewData : {
				updateSelectedNode : oModelerInstance.updateSelectedNode,
				updateTitleAndBreadCrumb : oModelerInstance.updateTitleAndBreadCrumb,
				updateTree : oModelerInstance.updateTree,
				getNavigationTargetName : oModelerInstance.getNavigationTargetName,
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oCoreApi : oModelerInstance.modelerCore,
				oTitleBreadCrumbController : {
					byId : function(sText) {
						return {
							setText : function(sFormTitle) {
								return sFormTitle;
							}
						};
					}
				},
				oParams : {
					name : "step",
					bIsHierarchicalStep : bIsHierarchicalStep,
					arguments : {
						configId : oModelerInstance.tempUnsavedConfigId,
						categoryId : oModelerInstance.categoryIdUnsaved,
						stepId : sId
					}
				}
			}
		});
		assert.strictEqual(spyOnInit.calledOnce, true, "then step onInit function is called and view is initialized");
		assert.strictEqual(setDetailDataSpy.calledOnce, true, "then step  setDetailData function is called");
		return oView;
	}
	function _placeViewAt(oStepView) {
		var divToPlaceStep = document.createElement("div");
		divToPlaceStep.setAttribute('id', 'contentOfStep');
		document.body.appendChild(divToPlaceStep);
		oStepView.placeAt("contentOfStep");
		sap.ui.getCore().applyChanges();
	}
	function _commonAssertsOnInitialization(assert) {
		var oDataForCategoryAssignments = {
			"Objects" : [ {
				CategoryId : "Category-1",
				CategoryTitle : "test category A"
			}, {
				CategoryId : "Category-2",
				CategoryTitle : "test category B"
			} ]
		};
		//asserts
		assert.ok(oStepView, "then step view exists");
		assert.ok(oStepView.byId("idStepCornerTextView"), "then Step Corner text View is instantiated");
		assert.ok(oStepView.byId("idStepRequestView"), "then Step Request View is instantiated");
		assert.ok(oStepView.byId("idStepFilterMappingView"), "then Step Filter Mapping View is instantiated");
		assert.strictEqual(spyOnGetText.calledWith("stepBasicData"), true, "then basic data section label is set correctly");
		//Step title asserts
		assert.strictEqual(spyOnGetText.calledWith("stepTitle"), true, "then label for step title is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("newStep"), true, "then placeholder for step title is set correctly");
		assert.strictEqual(oStepView.byId("idStepTitleLabel").getRequired(), true, "then step title label is set required");
		//Step long title asserts
		assert.strictEqual(spyOnGetText.calledWith("stepLongTitle"), true, "then label for step long title is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("stepLongTitle"), true, "then placeholder for step long  is set correctly");
		//Category Assignment asserts
		assert.strictEqual(spyOnGetText.calledWith("categoryAssignments"), true, "then label for category assignments is set correctly");
		assert.strictEqual(oStepView.byId("idCategoryTitleLabel").getRequired(), true, "then category assignment label is set required");
		assert.deepEqual(oStepView.byId("idCategorySelect").getModel().getData(), oDataForCategoryAssignments, "then model for category assignments is set");
		//Navigation Target label Asserts
		assert.strictEqual(spyOnGetText.calledWith("navigationTargetAssignments"), true, "then label of object header of Navigation target is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("globalNavigationTarget"), true, "then label for global navigation targets is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("stepSpecificNavTargets"), true, "then label for step specific navigation targets is set correctly");
		//Request and Filter Mapping Section label Asserts
		assert.strictEqual(spyOnGetText.calledWith("dataRequest"), true, "then label of object header for data request section is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("filterMap"), true, "then label of filter mapping object header is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("filterMapKeepSource"), true, "then label for keep target filter property same as selectable property checkbox is set correctly");
		//Data Reduction label asserts
		assert.strictEqual(spyOnGetText.calledWith("dataReduction"), true, "then label of object header for data reduction section is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("dataReductionType"), true, "then label of radio group for data reduction type is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("noDataReduction"), true, "then label for No data reduction option is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("topN"), true, "then label for topN option is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("recordNumber"), true, "then label for number of topN records is set correctly");
		//optional hierarchical property
		assert.strictEqual(oStepView.byId("idStepRequestView").byId("idOptionalPropertyLabel").getVisible(), false, "then hierarchical property lable is not visible");
		assert.strictEqual(oStepView.byId("idStepRequestView").byId("idOptionalPropertyLabel").getVisible(), false, "then hierarchical property is not visible");
	}
	function _commonSpiesInBeforeEach(oModelerInstance) {
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		oTextPool = oModelerInstance.configurationHandler.getTextPool();
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
		spyOnSetTextOfTextPool = sinon.spy(oTextPool, "setTextAsPromise");
	}
	function _commonCleanUpsInAfterEach() {
		sap.apf.modeler.ui.utils.StepPropertyMetadataHandler.restore();
		oModelerInstance.modelerCore.getText.restore();
		oTextPool.setTextAsPromise.restore();
		oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
		modelerUIHelper.destroyModelerInstance();
		oModelerInstance.reset();
		oStepView.destroy();
	}
	QUnit.module("Test for a step which is new", {
		beforeEach : function(assert) {
			var done = assert.async();
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance);
				oStepView = _instantiateView("newStep0", assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When step view is initialized", function(assert) {
		// arrange
		_placeViewAt(oStepView);
		//asserts
		_commonAssertsOnInitialization(assert);
		assert.strictEqual(oStepView.byId("idStepTitle").getValue(), "", "then value of step title is displayed");
		assert.strictEqual(oStepView.byId("idStepLongTitle").getValue(), "", "then value of step long title is displayed");
		assert.deepEqual(oStepView.byId("idCategorySelect").getSelectedKeys(), [ oModelerInstance.categoryIdUnsaved ], "then category is assigned to the step");
		//data reduction asserts
		assert.strictEqual(oStepView.byId("idDataReductionRadioGroup").getEnabled(), false, "then data reduction radio group is not enabled");
		assert.strictEqual(oStepView.byId("idDataReductionRadioGroup").getSelectedButton(), oStepView.byId("idNoDataReduction"), "then No Data reduction radio button is selected");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getValue(), "", "then topN record value is set to empty");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getValueState(), "None", "then value state for topN input is set to None");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsLabel").getVisible(), false, "then label for topN is not visible");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getVisible(), false, "then input for entering topN value is not visible");
		// filter mapping
		assert.strictEqual(oStepView.byId("idStepFilterMappingVBox").getVisible(), false, "then filter mapping section is not visible for a new step since there is no selectable filter property available");
		//navigation target asserts
		assert.deepEqual(oStepView.byId("idStepSpecificCombo").getSelectedKeys(), [], "then no navigation targets are displayed since this is a new step");
		assert.deepEqual(oStepView.byId("idGlobalCombo").getSelectedKeys(), [ oModelerInstance.firstNavigationTargetId ], "then global navigation targets are displayed");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfStep'));
	});
	QUnit.module("Test for an existing step with filter mapping", {
		beforeEach : function(assert) {
			var done = assert.async();
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance);
				oStepView = _instantiateView(oModelerInstance.stepIdUnsavedWithFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When step view is initialized", function(assert) {
		// arrange
		_placeViewAt(oStepView);
		//assert
		_commonAssertsOnInitialization(assert);
		assert.strictEqual(oStepView.byId("idStepTitle").getValue(), "step B", "then value of step title is displayed");
		assert.strictEqual(oStepView.byId("idStepLongTitle").getValue(), "", "then value of step long title is empty");
		assert.deepEqual(oStepView.byId("idCategorySelect").getSelectedKeys(), [ oModelerInstance.categoryIdUnsaved, oModelerInstance.categoryIdUnsaved2 ], "then model for category assignments is set");
		//data reduction asserts
		assert.strictEqual(oStepView.byId("idDataReductionRadioGroup").getEnabled(), true, "then data reduction radio group is enabled");
		assert.strictEqual(oStepView.byId("idDataReductionRadioGroup").getSelectedButton(), oStepView.byId("idNoDataReduction"), "then No Data reduction radio button is selected");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getValue(), "", "then topN record value is set to empty");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getValueState(), "None", "then value state for topN input is set to None");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsLabel").getVisible(), false, "then label for topN is not visible");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getVisible(), false, "then input for entering topN value is not visible");
		//filter mapping section asserts
		assert.strictEqual(oStepView.byId("idStepFilterMappingVBox").getVisible(), true, "then filter mapping section is visible since there is selectable filter property available");
		assert.strictEqual(oStepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "then target filter property is kept same as selectable property");
		//navigation target asserts
		assert.deepEqual(oStepView.byId("idStepSpecificCombo").getSelectedKeys(), [ oModelerInstance.secondNavigationTargetId ], "then step specific navigation targets are displayed");
		assert.deepEqual(oStepView.byId("idGlobalCombo").getSelectedKeys(), [ oModelerInstance.firstNavigationTargetId ], "then global navigation targets are displayed");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfStep'));
	});
	QUnit.test("When step is in valid state fetch getValidationState", function(assert) {
		assert.strictEqual(oStepView.getController().getValidationState(), true, "then step is in valid state");
	});
	QUnit.test("When step is not in valid state fetch getValidationState", function(assert) {
		//act
		oStepView.byId("idStepTitle").setValue("");
		//assert
		assert.strictEqual(oStepView.getController().getValidationState(), false, "then step is not in valid state");
	});
	QUnit.test("When step view data has to be reset then", function(assert) {
		//arrange
		var spyOnGetStep = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getStep");
		var spyFireEvent = sinon.spy(oStepView, "fireEvent");
		//act
		oStepView.getController().updateSubViewInstancesOnReset(oStepView.getViewData().oConfigurationEditor);
		//assert
		assert.strictEqual(spyOnGetStep.calledOnce, true, "then step object is fetched after reset");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.UPDATESUBVIEWINSTANCESONRESET), true,
				"then sub views stepRequest,stepFilterMapping,stepCornerText are updated with new instances of editor and step objects");
	});
	QUnit.test("When step view is destroyed", function(assert) {
		//arrange
		var spyDestroyOfStepCornerTextView = sinon.spy(oStepView.byId("idStepCornerTextView"), "destroy");
		var spyDestroyOfStepRequestView = sinon.spy(oStepView.byId("idStepRequestView"), "destroy");
		var spyDestroyOfStepFilterMappingView = sinon.spy(oStepView.byId("idStepFilterMappingView"), "destroy");
		//act
		oStepView.destroy();
		//assert
		assert.strictEqual(spyDestroyOfStepCornerTextView.calledOnce, true, "then destroy is called on corner text view");
		assert.strictEqual(spyDestroyOfStepRequestView.calledOnce, true, "then destroy is called on step request view");
		assert.strictEqual(spyDestroyOfStepFilterMappingView.calledOnce, true, "then destroy is called on step filter mapping view");
	});
	QUnit.test("When step title is changed", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_TITLE;
		var spyOnStepSetTitleId = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setTitleId");
		var spyOnUpdateTree = sinon.spy(oStepView.getViewData(), "updateTree");
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(oStepView.getViewData(), "updateTitleAndBreadCrumb");
		//action
		oStepView.byId("idStepTitle").setValue("Updated Step Title");
		oStepView.getController().handleChangeForStepTitle();
		//assert
		assert.strictEqual(spyOnSetTextOfTextPool.calledWith("Updated Step Title", oTranslationFormat), true, "then setText is called for change of step title");
		assert.strictEqual(spyOnStepSetTitleId.calledWith("Updated Step Title"), true, "then setLabelKey is called on change of step title");
		assert.strictEqual(spyOnUpdateTree.calledOnce, true, "then the step title is updated in all categories in tree");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith(oStepView.getViewData().oCoreApi.getText("step") + ": " + "Updated Step Title"), true, "then the title and breadcrumb is updated");
		assert.strictEqual(oModelerInstance.unsavedStepWithFilterMapping.getTitleId(), "Updated Step Title", "then the step title is set to the step object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When step title is changed to empty", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_TITLE;
		var spyOnStepSetTitleId = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setTitleId");
		var spyOnUpdateTree = sinon.spy(oStepView.getViewData(), "updateTree");
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(oStepView.getViewData(), "updateTitleAndBreadCrumb");
		//action
		oStepView.byId("idStepTitle").setValue("");
		oStepView.getController().handleChangeForStepTitle();
		//assert
		assert.strictEqual(spyOnSetTextOfTextPool.calledWith("", oTranslationFormat), false, "then setText is called for change of step title");
		assert.strictEqual(spyOnStepSetTitleId.calledWith(""), false, "then setLabelKey is not called on change of step title");
		assert.strictEqual(spyOnUpdateTree.calledOnce, false, "then the step title is not updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledOnce, false, "then the title and breadcrumb is not updated");
		assert.strictEqual(oModelerInstance.unsavedStepWithFilterMapping.getTitleId(), "step B", "then the step title is not set to the step object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When suggestions are triggered for step title", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_TITLE;
		var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oTextPool);
		var oSuggestionTextHandlerStub = sinon.stub(sap.apf.modeler.ui.utils, "SuggestionTextHandler", function() {
			return oSuggestionTextHandler;
		});
		var spyOnManageSuggestionTexts = sinon.spy(oSuggestionTextHandler, "manageSuggestionTexts");
		var oEvt = _createEvent("stepTitle");
		//act 
		oStepView.getController().handleChangeForStepTitle();
		oStepView.getController().handleSuggestionsForStepTitle(oEvt);
		//assert
		assert.strictEqual(spyOnManageSuggestionTexts.calledOnce, true, "then suggestions are fetched from SuggestionTextHandler");
		assert.strictEqual(spyOnManageSuggestionTexts.calledWith(oEvt, oTranslationFormat), true, "then suggestions are fetched from SuggestionTextHandler for the correct event and translation format");
		//clean up
		spyOnManageSuggestionTexts.restore();
		oSuggestionTextHandlerStub.restore();
	});
	QUnit.test("When step long title is changed", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_LONG_TITLE;
		var spyOnStepSetLongTitleId = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setLongTitleId");
		//action
		oStepView.byId("idStepLongTitle").setValue("Updated Step Long Title");
		oStepView.getController().handleChangeForStepLongTitle();
		//assert
		assert.strictEqual(spyOnSetTextOfTextPool.calledWith("Updated Step Long Title", oTranslationFormat), true, "then setText is called for change of step long title");
		assert.strictEqual(spyOnStepSetLongTitleId.calledWith("Updated Step Long Title"), true, "then setLabelKey is called on change of step long title");
		assert.strictEqual(oModelerInstance.unsavedStepWithFilterMapping.getLongTitleId(), "Updated Step Long Title", "then the step long title is set to the step object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When step long title is changed to empty", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_LONG_TITLE;
		var spyOnStepSetLongTitleId = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setLongTitleId");
		//action
		oStepView.byId("idStepLongTitle").setValue("");
		oStepView.getController().handleChangeForStepLongTitle();
		//assert
		assert.strictEqual(spyOnSetTextOfTextPool.calledWith("", oTranslationFormat), true, "then setText is called for change of step long title");
		assert.strictEqual(spyOnStepSetLongTitleId.calledWith(""), true, "then setLabelKey is called on change of step long title to empty");
		assert.strictEqual(oModelerInstance.unsavedStepWithFilterMapping.getLongTitleId(), "", "then the step long title is set as empty");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When suggestions are triggered for step title", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_LONG_TITLE;
		var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oTextPool);
		var oSuggestionTextHandlerStub = sinon.stub(sap.apf.modeler.ui.utils, "SuggestionTextHandler", function() {
			return oSuggestionTextHandler;
		});
		var spyOnManageSuggestionTexts = sinon.spy(oSuggestionTextHandler, "manageSuggestionTexts");
		var oEvt = _createEvent("stepLongTitle");
		//act 
		oStepView.getController().handleChangeForStepLongTitle();
		oStepView.getController().handleSuggestionsForStepLongTitle(oEvt);
		//assert
		assert.strictEqual(spyOnManageSuggestionTexts.calledOnce, true, "then suggestions are fetched from SuggestionTextHandler");
		assert.strictEqual(spyOnManageSuggestionTexts.calledWith(oEvt, oTranslationFormat), true, "then suggestions are fetched from SuggestionTextHandler for the correct event and translation format");
		//clean up
		spyOnManageSuggestionTexts.restore();
		oSuggestionTextHandlerStub.restore();
	});
	QUnit.test("When category assignments of step is changed", function(assert) {
		//arrange
		var spyOnConfigEditorAddCategoryStepAssignment = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "addCategoryStepAssignment");
		var spyOnConfigEditorRemoveCategoryStepAssignment = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "removeCategoryStepAssignment");
		//action
		oStepView.byId("idCategorySelect").removeSelectedKeys([ oModelerInstance.categoryIdUnsaved2 ]);
		oStepView.getController().handleChangeForCategory();
		//assert
		assert.deepEqual(oStepView.byId("idCategorySelect").getSelectedKeys(), [ oModelerInstance.categoryIdUnsaved ], "Category 2 is removed for the existing step");
		assert.strictEqual(spyOnConfigEditorRemoveCategoryStepAssignment.calledOnce, true, "Category 2 is removed from the step object");
		assert.strictEqual(spyOnConfigEditorRemoveCategoryStepAssignment.calledWith(oModelerInstance.categoryIdUnsaved2, oModelerInstance.stepIdUnsavedWithFilterMapping), true, "Category 2 is removed from the step object");
		//action
		oStepView.byId("idCategorySelect").setSelectedKeys([ oModelerInstance.categoryIdUnsaved, oModelerInstance.categoryIdUnsaved2 ]);
		oStepView.getController().handleChangeForCategory();
		//assert
		assert.deepEqual(oStepView.byId("idCategorySelect").getSelectedKeys(), [ oModelerInstance.categoryIdUnsaved, oModelerInstance.categoryIdUnsaved2 ], "Multiple categories are set for existing step");
		assert.strictEqual(spyOnConfigEditorAddCategoryStepAssignment.calledThrice, true, "Category 2 is added to the the step object");
		assert.strictEqual(spyOnConfigEditorAddCategoryStepAssignment.calledWith(oModelerInstance.categoryIdUnsaved2, oModelerInstance.stepIdUnsavedWithFilterMapping), true, "Category 2 is added to the step object");
	});
	QUnit.test("When data reduction type for step is changed to 'No Data Reduction' type ", function(assert) {
		//arrange
		var spyOnResetTopN = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "resetTopN");
		//action
		oStepView.byId("idDataReductionRadioGroup").setSelectedButton(oStepView.byId("idNoDataReduction"));
		oStepView.getController().handleChangeForDataReductionType();
		//assert
		assert.strictEqual(spyOnResetTopN.calledOnce, true, "then topN values are resetted on the step object");
		assert.strictEqual(oStepView.byId("idDataReductionRadioGroup").getSelectedButton(), oStepView.byId("idNoDataReduction"), "then No data reduction type button is selected");
		assert.strictEqual(oStepView.byId("idDataReductionRadioGroup").getEnabled(), true, "then data reduction radio group is enabled");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getValue(), "", "then record field for entering topN value is cleared");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getValueState(), "None", "then value state of record field value is set to None");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsLabel").getVisible(), false, "then label for topN is not visible");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getVisible(), false, "then input to enter topN value is not visible");
		assert.strictEqual(oStepView.byId("idSortLayout").getItems().length, 0, "then sort layout is empty");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When data reduction type for step is changed to 'topN' ", function(assert) {
		//action
		oStepView.byId("idDataReductionRadioGroup").setSelectedButton(oStepView.byId("idTopN"));
		oStepView.getController().handleChangeForDataReductionType();
		//assert
		assert.strictEqual(oStepView.byId("idNumberOfRecordsLabel").getVisible(), true, "then label for topN is visible");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getVisible(), true, "then input to enter topN value is visible");
		assert.strictEqual(oStepView.byId("idSortLayout").getItems().length, 1, "then sort layout is empty");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When input record for 'topN' is changed and a valid value is entered", function(assert) {
		//arrange
		var spyOnSetTopNValue = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setTopNValue");
		var spyOnSetSortProperties = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setTopNSortProperties");
		var oEvent = {
			getSource : function() {
				return oStepView.getController().byId("idNumberOfRecordsValue");
			}
		};
		oStepView.getController().byId("idNumberOfRecordsValue").setValue("100");
		//action
		oStepView.getController().handleValidationForNumberOfRecords(oEvent);
		oStepView.getController().handleChangeForNoOfRecords(oEvent);
		//assert
		assert.strictEqual(spyOnSetTopNValue.calledOnce, true, "then topN value is set on the step object");
		assert.strictEqual(spyOnSetSortProperties.calledOnce, false, "then sort properties are not set on the step object");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getValueState(), "None", "then value state of the input is set to None");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledTwice, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When input record for 'topN' is changed to decimal value", function(assert) {
		//arrange
		var spyOnSetTopNValue = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setTopNValue");
		var spyOnSetSortProperties = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setTopNSortProperties");
		var oEvent = {
			getSource : function() {
				return oStepView.getController().byId("idNumberOfRecordsValue");
			}
		};
		oStepView.getController().byId("idNumberOfRecordsValue").setValue("100.5");
		//action
		oStepView.getController().handleValidationForNumberOfRecords(oEvent);
		oStepView.getController().handleChangeForNoOfRecords(oEvent);
		//assert
		assert.strictEqual(spyOnSetTopNValue.calledOnce, false, "then topN value is not set on the step object");
		assert.strictEqual(spyOnSetSortProperties.calledOnce, false, "then sort properties are not set on the step object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When input record for 'topN' is changed to exponential value ", function(assert) {
		//arrange
		var spyOnSetTopNValue = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setTopNValue");
		var spyOnSetSortProperties = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setTopNSortProperties");
		var oEvent = {
			getSource : function() {
				return oStepView.getController().byId("idNumberOfRecordsValue");
			}
		};
		oStepView.getController().byId("idNumberOfRecordsValue").setValue("2e3");
		//action
		oStepView.getController().handleValidationForNumberOfRecords(oEvent);
		oStepView.getController().handleChangeForNoOfRecords(oEvent);
		//assert
		assert.strictEqual(spyOnSetTopNValue.calledOnce, false, "then topN value is not set on the step object");
		assert.strictEqual(spyOnSetSortProperties.calledOnce, false, "then sort properties are not set on the step object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When value of checkbox for keeping target filter property same as selectable property is changed", function(assert) {
		//arrange
		var spyOnSetFilterMappingKeepSource = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setFilterMappingKeepSource");
		//action
		oStepView.byId("idFilterKeepSourceCheckBox").setSelected(true);
		oStepView.getController().handleFilterMapKeepSource();
		//assert
		assert.strictEqual(spyOnSetFilterMappingKeepSource.calledOnce, true, "then setFilterMappingKeepSource value is set on the step object");
		assert.strictEqual(spyOnSetFilterMappingKeepSource.calledWith(true), true, "then target filter property is kept same as selectable property");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When step specific navigation target is changed", function(assert) {
		//arrange
		var spyOnRemoveNavigationTarget = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "removeNavigationTarget");
		var spyOnAddNavigationTarget = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "addNavigationTarget");
		//action
		oStepView.byId("idStepSpecificCombo").setSelectedKeys([ oModelerInstance.thirdNavigationTargetId ]);
		oStepView.getController().handleChangeForStepSpecificNavTargets();
		//assert
		setTimeout(function(){
		assert.strictEqual(spyOnRemoveNavigationTarget.calledWith(oModelerInstance.secondNavigationTargetId), true, "then previously assigned navigation target is removed from the step");
		assert.strictEqual(spyOnAddNavigationTarget.calledWith(oModelerInstance.thirdNavigationTargetId), true, "then newly selected navigation target is added to the step");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		},1);
	});
	QUnit.module("Test for an existing step with an already set top-N value", {
		beforeEach : function(assert) {
			var done = assert.async();
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance);
				oStepView = _instantiateView(oModelerInstance.stepIdUnsavedWithoutFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When step view is initialized", function(assert) {
		// arrange
		_placeViewAt(oStepView);
		//assert
		_commonAssertsOnInitialization(assert);
		assert.strictEqual(oStepView.byId("idStepTitle").getValue(), "step A", "then value of step title is displayed");
		assert.strictEqual(oStepView.byId("idStepLongTitle").getValue(), "step A long title", "then value of step long title is displayed");
		assert.deepEqual(oStepView.byId("idCategorySelect").getSelectedKeys(), [ oModelerInstance.categoryIdUnsaved ], "then model for category assignments is set");
		//data reduction asserts
		assert.strictEqual(oStepView.byId("idDataReductionRadioGroup").getEnabled(), true, "then data reduction radio group is enabled");
		assert.strictEqual(oStepView.byId("idDataReductionRadioGroup").getSelectedButton(), oStepView.byId("idTopN"), "then topN radio button is selected");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getValue(), "100", "then topN record value is set to empty");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getValueState(), "None", "then value state for topN input is set to None");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsLabel").getVisible(), true, "then label for topN is visible");
		assert.strictEqual(oStepView.byId("idNumberOfRecordsValue").getVisible(), true, "then input for entering topN value is visible");
		assert.strictEqual(oStepView.byId("idSortLayout").getItems().length, 1, "then sort layout has one sort property set");
		//filter mapping section asserts
		assert.strictEqual(oStepView.byId("idStepFilterMappingVBox").getVisible(), true, "then filter mapping section is visible since there is selectable filter property available");
		assert.strictEqual(oStepView.byId("idFilterKeepSourceCheckBox").getSelected(), false, "then target filter property is not the same as selectable property");
		//navigation target asserts
		assert.deepEqual(oStepView.byId("idStepSpecificCombo").getSelectedKeys(), [], "then step specific navigation targets are displayed");
		assert.deepEqual(oStepView.byId("idGlobalCombo").getSelectedKeys(), [ oModelerInstance.firstNavigationTargetId ], "then global navigation targets are displayed");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfStep'));
	});
	QUnit.module("When a new hierarchical step without filter is created", {
		beforeEach : function(assert) {
			var done = assert.async();
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance);
				oStepView = _instantiateView("newStep1", assert, true);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When hierarchical step view is initialized", function(assert) {
		// arrange
		_placeViewAt(oStepView);
		//asserts
		assert.strictEqual(oStepView.byId("idStepTitle").getValue(), "", "then value of step title is displayed");
		assert.strictEqual(oStepView.byId("idStepLongTitle").getValue(), "", "then value of step long title is displayed");
		assert.deepEqual(oStepView.byId("idCategorySelect").getSelectedKeys(), [ oModelerInstance.categoryIdUnsaved ], "then category is assigned to the step");
		//data reduction asserts
		assert.strictEqual(oStepView.byId("idDataReductionForm").getVisible(), false, "then Data reduction section is not visible");
		//optional hierarchical property
		assert.strictEqual(oStepView.byId("idStepRequestView").byId("idOptionalPropertyLabel").getVisible(), true, "then hierarchical property is visible");
		assert.strictEqual(oStepView.byId("idStepRequestView").byId("idOptionalProperty").getVisible(), true, "then hierarchical property is visible");
		assert.strictEqual(oStepView.byId("idStepRequestView").byId("idOptionalRequestField").getSelectedKey(), "None", "then hierarchical property filter property is set to none");
		assert.deepEqual(oStepView.byId("idStepRequestView").byId("idOptionalRequestField").getModel().getData(), _getModelForFilterProperties(), "then hierarchical property filter property model is set with none");
		//navigation target asserts
		assert.deepEqual(oStepView.byId("idGlobalCombo").getSelectedKeys(), [ oModelerInstance.firstNavigationTargetId ], "then global navigation targets are displayed");
	});
	QUnit.test("When step title is changed", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_TITLE;
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(oStepView.getViewData(), "updateTitleAndBreadCrumb");
		//action
		oStepView.byId("idStepTitle").setValue("step B");
		oStepView.getController().handleChangeForStepTitle();
		//assert
		assert.strictEqual(spyOnSetTextOfTextPool.calledWith("step B", oTranslationFormat), true, "then setText is called for change of step title");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith(oStepView.getViewData().oCoreApi.getText("hierarchicalStepTitle") + ": " + "step B"), true, "then the title and breadcrumb is updated");
		assert.strictEqual(oModelerInstance.unsavedStepWithFilterMapping.getTitleId(), "step B", "then the step title is set to the step object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.module("When an existing hierarchical step without required filter is loaded", {
		beforeEach : function(assert) {
			var done = assert.async();
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance);
				oStepView = _instantiateView(oModelerInstance.firstHierarchicalStepId, assert, true);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When existing hierarchical step view is initialized", function(assert) {
		// arrange
		_placeViewAt(oStepView);
		//asserts
		assert.strictEqual(oStepView.byId("idStepTitle").getValue(), "Hierarchical Step", "then value of step title is displayed");
		assert.strictEqual(oStepView.byId("idStepLongTitle").getValue(), "Hierarchical Step long title", "then value of step long title is displayed");
		assert.deepEqual(oStepView.byId("idCategorySelect").getSelectedKeys(), [ oModelerInstance.categoryIdUnsaved ], "then category is assigned to the step");
		//data reduction asserts
		assert.strictEqual(oStepView.byId("idDataReductionForm").getVisible(), false, "then Data reduction section is not visible");
		//optional hierarchical property
		assert.strictEqual(oStepView.byId("idStepRequestView").byId("idOptionalPropertyLabel").getVisible(), true, "then hierarchical property is visible");
		assert.strictEqual(oStepView.byId("idStepRequestView").byId("idOptionalProperty").getVisible(), true, "then hierarchical property is visible");
		//filter mapping section asserts
		assert.strictEqual(oStepView.byId("idStepFilterMappingVBox").getVisible(), false, "then filter mapping section is not visible since there is no selectable filter property available");
		//navigation target asserts
		assert.deepEqual(oStepView.byId("idGlobalCombo").getSelectedKeys(), [ oModelerInstance.firstNavigationTargetId ], "then global navigation targets are displayed");
	});
	QUnit.module("When an existing hierarchical step with required filter is loaded", {
		beforeEach : function(assert) {
			var done = assert.async();
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance);
				oStepView = _instantiateView(oModelerInstance.hierarchicalStepWithFilterId, assert, true);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When existing hierarchical step (with filter) view is initialized", function(assert) {
		// arrange
		_placeViewAt(oStepView);
		//asserts
		assert.strictEqual(oStepView.byId("idStepTitle").getValue(), "Hierarchical Step With required property", "then value of step title is displayed");
		assert.strictEqual(oStepView.byId("idStepLongTitle").getValue(), "Hierarchical Step long title With required property", "then value of step long title is displayed");
		assert.deepEqual(oStepView.byId("idCategorySelect").getSelectedKeys(), [ oModelerInstance.categoryIdUnsaved ], "then category is assigned to the step");
		//data reduction asserts
		assert.strictEqual(oStepView.byId("idDataReductionForm").getVisible(), false, "then Data reduction section is not visible");
		//optional hierarchical property
		assert.strictEqual(oStepView.byId("idStepRequestView").byId("idOptionalPropertyLabel").getVisible(), true, "then hierarchical property is visible");
		assert.strictEqual(oStepView.byId("idStepRequestView").byId("idOptionalProperty").getVisible(), true, "then hierarchical property is visible");
		//filter mapping section asserts
		assert.strictEqual(oStepView.byId("idStepFilterMappingVBox").getVisible(), true, "then filter mapping section is visible since there is selectable filter property available");
		//navigation target asserts
		assert.deepEqual(oStepView.byId("idGlobalCombo").getSelectedKeys(), [ oModelerInstance.firstNavigationTargetId ], "then global navigation targets are displayed");
	});
});
