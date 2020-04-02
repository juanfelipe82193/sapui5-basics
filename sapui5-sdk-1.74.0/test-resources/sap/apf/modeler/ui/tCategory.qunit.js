/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP AG. All rights reserved
*/
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function() {
	'use strict';
	var oModelerInstance, categoryView, getCategoryStepAssignmentsSpy, oTextPool, spyOnGetOfTextPool, spyOnSetTextOfTextPool, spyOnUpdateSelectedNode, setCategorySpy, setIsUnsavedSpy;
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
	function _createEvent() {
		return {
			getSource : function() {
				return oInputControl;
			},
			getParameter : function(parameterName) {
				if (parameterName === "suggestValue") {
					return "ca";
				}
			}
		};
	}
	function _instantiateView(sId, assert) {
		var oCategoryController = new sap.ui.controller("sap.apf.modeler.ui.controller.category");
		var spyOnInit = sinon.spy(oCategoryController, "onInit");
		var setDetailDataSpy = sinon.spy(oCategoryController, "setDetailData");
		var oView = sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.category",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oCategoryController,
			viewData : {
				updateConfigTree : oModelerInstance.updateConfigTree,
				updateSelectedNode : oModelerInstance.updateSelectedNode,
				updateTree : oModelerInstance.updateTree,
				updateTitleAndBreadCrumb : oModelerInstance.updateTitleAndBreadCrumb,
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oApplicationHandler : oModelerInstance.applicationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				getText : oModelerInstance.modelerCore.getText,
				oParams : {
					name : "category",
					arguments : {
						configId : oModelerInstance.tempUnsavedConfigId,
						categoryId : sId
					}
				}
			}
		});
		assert.strictEqual(spyOnInit.calledOnce, true, "then facet filter onInit function is called and view is initialized");
		assert.strictEqual(setDetailDataSpy.calledOnce, true, "then category setDetailData function is called");
		return oView;
	}
	QUnit.module("Category Unit Tests - Existing category", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;//Modeler instance from callback
				oTextPool = oModelerInstance.configurationHandler.getTextPool();
				getCategoryStepAssignmentsSpy = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getCategoryStepAssignments");
				spyOnUpdateSelectedNode = sinon.spy(oModelerInstance, "updateSelectedNode");
				spyOnGetOfTextPool = sinon.spy(oTextPool, "get");
				spyOnSetTextOfTextPool = sinon.spy(oTextPool, "setTextAsPromise");
				setCategorySpy = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setCategory");
				setIsUnsavedSpy = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
				categoryView = _instantiateView(oModelerInstance.categoryIdUnsaved, assert);
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			// clean ups
			oTextPool.get.restore();
			oTextPool.setTextAsPromise.restore();
			oModelerInstance.updateSelectedNode.restore();
			oModelerInstance.configurationEditorForUnsavedConfig.setCategory.restore();
			oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
			oModelerInstance.configurationEditorForUnsavedConfig.getCategoryStepAssignments.restore();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			categoryView.destroy();
		}
	});
	QUnit.test("When Category view is loaded", function(assert) {
		// arrange
		var divToPlaceCategory = document.createElement("div");
		divToPlaceCategory.setAttribute('id', 'contentOfCategory');
		document.body.appendChild(divToPlaceCategory);
		categoryView.placeAt("contentOfCategory");
		sap.ui.getCore().applyChanges();
		// assertion
		assert.ok(categoryView, "then, Category view exists");
		assert.strictEqual(spyOnGetOfTextPool.calledTwice, true, "then label for category is fetched from text pool");
		assert.strictEqual(spyOnGetOfTextPool.calledWith("test category A"), true, "then label is 'test category A'");
		assert.strictEqual(categoryView.byId("idCategoryTitle").getValue(), "test category A", "then, Category title is set");
		assert.strictEqual(getCategoryStepAssignmentsSpy.calledOnce, true, "then, number of steps under specific category is calculated");
		assert.strictEqual(spyOnSetTextOfTextPool.called, false, "then setText is called for change of label as no label was changed");
		assert.strictEqual(spyOnUpdateSelectedNode.called, false, "then the tree node is not updated");
		assert.strictEqual(categoryView.byId("idTotalSteps").getValue(), "5", "then number of steps is set for unsaved category");
		document.body.removeChild(document.getElementById('contentOfCategory'));
	});
	QUnit.test("When editing the category title", function(assert) {
		// arrange
		var breadCrumbSpy = sinon.spy(categoryView.getViewData(), "updateTitleAndBreadCrumb");
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.CATEGORY_TITLE;
		// act
		categoryView.byId("idCategoryTitle").setValue("test category A edited");
		var oCategoryInfoForChange = {
			name : "test category A edited",
			id : oModelerInstance.categoryIdUnsaved
		};
		categoryView.getController().handleChangeDetailValue();
		// assertion
		assert.strictEqual(categoryView.byId("idCategoryTitle").getValue(), "test category A edited", "then, Category title is edited and set for edited category");
		assert.strictEqual(setCategorySpy.calledOnce, true, "then, edited category is updated in model");
		assert.strictEqual(breadCrumbSpy.calledOnce, true, "then, Bread Crumb updated with editied category name");
		assert.strictEqual(setIsUnsavedSpy.calledOnce, true, "then, save button has been enabled in footer");
		assert.strictEqual(spyOnSetTextOfTextPool.calledWith("test category A edited", oTranslationFormat), true, "then setText is called for change of label");
		assert.strictEqual(categoryView.getController().getValidationState(), true, "then, the validation state is fetched while mandatory field is filled");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oCategoryInfoForChange), true, "then the tree node is updated");
	});
	QUnit.test("When clearing the category title", function(assert) {
		// arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.CATEGORY_TITLE;
		// act
		categoryView.byId("idCategoryTitle").setValue("");
		categoryView.getController().handleChangeDetailValue();
		// assertion
		assert.strictEqual(categoryView.byId("idCategoryTitle").getValue(), "", "then, Edited empty category title is not set for category");//Empty string is set in input control(UI) but not as category title
		assert.strictEqual(setCategorySpy.called, false, "then, category is not set in the model");
		assert.strictEqual(setIsUnsavedSpy.calledOnce, true, "then, save button has been enabled in footer");
		assert.strictEqual(spyOnSetTextOfTextPool.calledWith("", oTranslationFormat), false, "then setText is not called for change of label");
		assert.strictEqual(categoryView.getController().getValidationState(), false, "then, the validation state is not fetched while mandatory field is empty");
		assert.strictEqual(spyOnUpdateSelectedNode.called, false, "then the tree node is not updated");
	});
	QUnit.test("When Category view data has to be reset", function(assert) {
		//arrange
		var spyOnGetCategory = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getCategory");
		//action
		categoryView.getController().updateSubViewInstancesOnReset(categoryView.getViewData().oConfigurationEditor);
		//assert
		assert.strictEqual(spyOnGetCategory.calledOnce, true, "then Category object is fetched after reset");
		//cleanup
		oModelerInstance.configurationEditorForUnsavedConfig.getCategory.restore();
	});
	QUnit.test("When suggestions are triggered for categoryTitle", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.CATEGORY_TITLE;
		var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oTextPool);
		var oSuggestionTextHandlerStub = sinon.stub(sap.apf.modeler.ui.utils, "SuggestionTextHandler", function() {
			return oSuggestionTextHandler;
		});
		var spyOnManageSuggestionTexts = sinon.spy(oSuggestionTextHandler, "manageSuggestionTexts");
		var oEvt = _createEvent();
		//act 
		categoryView.getController().handleChangeDetailValue();
		categoryView.getController().handleSuggestions(oEvt);
		//assert
		assert.strictEqual(spyOnManageSuggestionTexts.calledOnce, true, "then suggestions are fetched from SuggestionTextHandler");
		assert.strictEqual(spyOnManageSuggestionTexts.calledWith(oEvt, oTranslationFormat), true, "then suggestions are fetched from SuggestionTextHandler for the correct event and translation format");
		//clean up
		spyOnManageSuggestionTexts.restore();
		oSuggestionTextHandlerStub.restore();
	});
	QUnit.module("Category Unit Tests - New category", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;//Modeler instance from callback
				oTextPool = oModelerInstance.configurationHandler.getTextPool();
				getCategoryStepAssignmentsSpy = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getCategoryStepAssignments");
				spyOnUpdateSelectedNode = sinon.spy(oModelerInstance, "updateSelectedNode");
				spyOnGetOfTextPool = sinon.spy(oTextPool, "get");
				spyOnSetTextOfTextPool = sinon.spy(oTextPool, "setTextAsPromise");
				categoryView = _instantiateView("newCategory0", assert);
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			oTextPool.get.restore();
			oTextPool.setTextAsPromise.restore();
			oModelerInstance.updateSelectedNode.restore();
			oModelerInstance.configurationEditorForUnsavedConfig.getCategoryStepAssignments.restore();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		}
	});
	QUnit.test("When Category view is loaded", function(assert) {
		// arrange
		var divToPlaceCategory = document.createElement("div");
		divToPlaceCategory.setAttribute('id', 'contentOfCategory');
		document.body.appendChild(divToPlaceCategory);
		categoryView.placeAt("contentOfCategory");
		sap.ui.getCore().applyChanges();
		//assertion
		assert.ok(categoryView, "then, Category view exists");
		assert.strictEqual(spyOnGetOfTextPool.called, false, "then label for category is not fetched from text pool");
		assert.strictEqual(categoryView.byId("idCategoryTitle").getValue(), "", "then, Category title is not set for new category after setting the data");
		assert.strictEqual(getCategoryStepAssignmentsSpy.calledOnce, true, "then, number of steps under specific category is calculated");
		assert.strictEqual(categoryView.byId("idTotalSteps").getValue(), "0", "then, Number of steps is not set for new category after setting the data");
		assert.strictEqual(spyOnSetTextOfTextPool.called, false, "then setText is not called for change of label");
		assert.strictEqual(spyOnUpdateSelectedNode.calledOnce, true, "then the tree node is updated"); //spyOnUpdateSelectedNode.calledWith
		document.body.removeChild(document.getElementById('contentOfCategory'));
	});
	QUnit.test("When editing the category title", function(assert) {
		// arrange
		var oCategoryViewData = categoryView.getViewData();
		setIsUnsavedSpy = sinon.spy(oCategoryViewData.oConfigurationEditor, "setIsUnsaved");
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.CATEGORY_TITLE;
		var breadCrumbSpy = sinon.spy(oCategoryViewData, "updateTitleAndBreadCrumb");
		setCategorySpy = sinon.spy(oCategoryViewData.oConfigurationEditor, "setCategory");
		// act
		categoryView.byId("idCategoryTitle").setValue("test new category");
		categoryView.getController().handleChangeDetailValue();
		// assertion
		assert.strictEqual(categoryView.byId("idCategoryTitle").getValue(), "test new category", "then, Category title is set for new category after adding the title");
		assert.strictEqual(setIsUnsavedSpy.calledOnce, true, "then, save button has been enabled in footer");
		assert.strictEqual(breadCrumbSpy.calledOnce, true, "then, Category title is has been updated in bread crumb");
		assert.strictEqual(setCategorySpy.calledOnce, true, "then, setCategory is called");
		assert.strictEqual(spyOnSetTextOfTextPool.calledWith("test new category", oTranslationFormat), true, "then setText is called for change of label");
		assert.strictEqual(spyOnUpdateSelectedNode.calledTwice, true, "then the tree node is updated");
		// clean ups
		oCategoryViewData.oConfigurationEditor.setCategory.restore();
		oCategoryViewData.oConfigurationEditor.setIsUnsaved.restore();
	});
}());