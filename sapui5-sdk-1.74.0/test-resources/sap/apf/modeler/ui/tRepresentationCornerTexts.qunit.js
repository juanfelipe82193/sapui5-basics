/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tRepresentationCornerTexts');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function() {
	'use strict';
	var oRepCornerTextsView, oModelerInstance, spyOnGetText, oInputControl;
	function _createEvent(oCustomDataSetterMethodName) {
		return {
			getSource : function() {
				oInputControl = new sap.m.Input({
					value : "Updated corner text",
					showSuggestion : true,
					suggestionItems : {
						path : '/Objects',
						template : new sap.ui.core.Item({
							key : '{key}',
							text : '{name}'
						})
					}
				});
				var customData = new sap.ui.core.CustomData({
					value : oCustomDataSetterMethodName
				});
				oInputControl.addCustomData(customData);
				return oInputControl;
			},
			getParameter : function(parameterName) {
				if (parameterName === "suggestValue") {
					return "Up";
				}
			}
		};
	}
	function _instantiateView(oParentObject, assert) {
		var oRepCornerTextsController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationCornerTexts");
		var spyOnInit = sinon.spy(oRepCornerTextsController, "onInit");
		oRepCornerTextsView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.cornerTexts",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oRepCornerTextsController,
			viewData : {
				oTextReader : oModelerInstance.modelerCore.getText,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oTextPool : oModelerInstance.configurationHandler.getTextPool(),
				oParentObject : oParentObject,
				oParentStep : oModelerInstance.unsavedStepWithoutFilterMapping,
				oRepresentationTypeHandler : {
					getPictureOfRepresentationType : function() {
						return "sap-icon://column-chart";
					}
				}
			}
		});
		assert.strictEqual(spyOnInit.calledOnce, true, "then representation corner texts onInit function is called and view is initialized");
		return oRepCornerTextsView;
	}
	function _commonAssertsOnInitialization(assert) {
		//assert
		assert.ok(oRepCornerTextsView, "then representation corner texts view is available");
		//display text asserts
		assert.strictEqual(spyOnGetText.called, true, "then getText function is called to set texts on UI");
		assert.strictEqual(spyOnGetText.calledWith("cornerTextLabel"), true, "then header for the corner text section is set");
		assert.strictEqual(spyOnGetText.calledWith("leftTop"), true, "then placeholder for left upper corner text input is set");
		assert.strictEqual(spyOnGetText.calledWith("rightTop"), true, "then placeholder for right upper corner text input is set");
		assert.strictEqual(spyOnGetText.calledWith("leftBottom"), true, "then placeholder for left lower corner text input is set");
		assert.strictEqual(spyOnGetText.calledWith("rightBottom"), true, "then placeholder for right lower corner text input is set");
		//corner texts getter method name asserts
		assert.strictEqual(oRepCornerTextsView.byId("idLeftUpper").getCustomData()[1].getValue(), "getLeftUpperCornerTextKey", "then method name to get left upper corner text key is retrieved from custom data");
		assert.strictEqual(oRepCornerTextsView.byId("idRightUpper").getCustomData()[1].getValue(), "getRightUpperCornerTextKey", "then method name to get right upper corner text key is retrieved from custom data");
		assert.strictEqual(oRepCornerTextsView.byId("idLeftLower").getCustomData()[1].getValue(), "getLeftLowerCornerTextKey", "then method name to get left lower corner text key is retrieved from custom data");
		assert.strictEqual(oRepCornerTextsView.byId("idRightLower").getCustomData()[1].getValue(), "getRightLowerCornerTextKey", "then method name to get right lower corner text key is retrieved from custom data");
		//asserts on chart icon
		assert.strictEqual(oRepCornerTextsView.byId("idChartIcon").getSrc(), "sap-icon://column-chart", "then chart icon is set correctly");
		assert.strictEqual(oRepCornerTextsView.byId("idChartIcon").aCustomStyleClasses[0], "repChartIcon", "then style class for the chart icon is set correctly");
	}
	function _commonCleanUpsInAfterEach() {
		spyOnGetText.restore();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oModelerInstance.reset();
		oRepCornerTextsView.destroy();
	}
	QUnit.module("For an already saved representation, when corner texts from step are available and few corner text on representation are available", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
				oRepCornerTextsView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When representation corner texts view is initialized", function(assert) {
		//asserts
		_commonAssertsOnInitialization(assert);
		//corner text asserts
		assert.strictEqual(oRepCornerTextsView.byId("idLeftUpper").getValue(), "Left top corner from rep", "then corner text from rep is set and it overrided the step corner text");
		assert.strictEqual(oRepCornerTextsView.byId("idRightUpper").getValue(), "Right top corner from rep", "then corner text from rep is set and it overrided the step corner text");
		assert.strictEqual(oRepCornerTextsView.byId("idLeftLower").getValue(), "Left bottom corner from rep", "then corner text from rep is set and it overrided the step corner text");
		assert.strictEqual(oRepCornerTextsView.byId("idRightLower").getValue(), "Right bottom corner", "then corner text from step is set and as there was no corner text from representation");
	});
	QUnit.test("When left upper corner text is changed", function(assert) {
		//arrange
		var spyOnConfigEditorSetIsUnsaved = sinon.spy(oRepCornerTextsView.getViewData().oConfigurationEditor, "setIsUnsaved");
		var spySetLeftUpperCornerTextKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "setLeftUpperCornerTextKey");
		//act 
		oRepCornerTextsView.byId("idLeftUpper").fireChange();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(oRepCornerTextsView.byId("idLeftUpper").getCustomData()[0].getValue(), "setLeftUpperCornerTextKey", "then method name to set left upper corner text key is retrieved from custom data");
		assert.strictEqual(spySetLeftUpperCornerTextKey.calledOnce, true, "then setLeftUpperCornerTextKey is called on representation object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set as unsaved");
		//clean up
		oRepCornerTextsView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0].setLeftUpperCornerTextKey.restore();
	});
	QUnit.test("When right upper corner text is changed", function(assert) {
		//arrange
		var spyOnConfigEditorSetIsUnsaved = sinon.spy(oRepCornerTextsView.getViewData().oConfigurationEditor, "setIsUnsaved");
		var spySetRightUpperCornerTextKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "setRightUpperCornerTextKey");
		//act 
		oRepCornerTextsView.byId("idRightUpper").fireChange();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(oRepCornerTextsView.byId("idRightUpper").getCustomData()[0].getValue(), "setRightUpperCornerTextKey", "then method name to set right upper corner text key is retrieved from custom data");
		assert.strictEqual(spySetRightUpperCornerTextKey.calledOnce, true, "then setRightUpperCornerTextKey is called on representation object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set as unsaved");
		//clean up
		oRepCornerTextsView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0].setRightUpperCornerTextKey.restore();
	});
	QUnit.test("When left lower corner text is changed", function(assert) {
		//arrange
		var spyOnConfigEditorSetIsUnsaved = sinon.spy(oRepCornerTextsView.getViewData().oConfigurationEditor, "setIsUnsaved");
		var spySetLeftLowerCornerTextKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "setLeftLowerCornerTextKey");
		//act 
		oRepCornerTextsView.byId("idLeftLower").fireChange();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(oRepCornerTextsView.byId("idLeftLower").getCustomData()[0].getValue(), "setLeftLowerCornerTextKey", "then method name to set left lower corner text key is retrieved from custom data");
		assert.strictEqual(spySetLeftLowerCornerTextKey.calledOnce, true, "then setLeftLowerCornerTextKey is called on representation object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set as unsaved");
		//clean up
		oRepCornerTextsView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0].setLeftLowerCornerTextKey.restore();
	});
	QUnit.test("When right lower corner text is changed", function(assert) {
		//arrange
		var spyOnConfigEditorSetIsUnsaved = sinon.spy(oRepCornerTextsView.getViewData().oConfigurationEditor, "setIsUnsaved");
		var spySetRightLowerCornerTextKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "setRightLowerCornerTextKey");
		//act 
		oRepCornerTextsView.byId("idRightLower").fireChange();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(oRepCornerTextsView.byId("idRightLower").getCustomData()[0].getValue(), "setRightLowerCornerTextKey", "then method name to set right lower corner text key is retrieved from custom data");
		assert.strictEqual(spySetRightLowerCornerTextKey.calledOnce, true, "then setRightLowerCornerTextKey is called on representation object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set as unsaved");
		//clean up
		oRepCornerTextsView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0].setRightLowerCornerTextKey.restore();
	});
	QUnit.test("When suggestions are triggered for right lower corner text", function(assert) {
		//arrange
		var oTextPool = oModelerInstance.configurationHandler.getTextPool();
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.REPRESENTATION_CORNER_TEXT;
		var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oTextPool);
		var oSuggestionTextHandlerStub = sinon.stub(sap.apf.modeler.ui.utils, "SuggestionTextHandler", function() {
			return oSuggestionTextHandler;
		});
		var spyOnManageSuggestionTexts = sinon.spy(oSuggestionTextHandler, "manageSuggestionTexts");
		var oEvt = _createEvent("setRightLowerCornerTextKey");
		//act 
		oRepCornerTextsView.getController().handleChangeForCornerText(oEvt);
		oRepCornerTextsView.getController().handleSuggestions(oEvt);
		//assert
		assert.strictEqual(spyOnManageSuggestionTexts.calledOnce, true, "then suggestions are fetched from SuggestionTextHandler");
		assert.strictEqual(spyOnManageSuggestionTexts.calledWith(oEvt, oTranslationFormat), true, "then suggestions are fetched from SuggestionTextHandler for the correct event and translation format");
		//clean up
		spyOnManageSuggestionTexts.restore();
		oSuggestionTextHandlerStub.restore();
	});
	QUnit.module("For a new representation, when few corner texts from step are available", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
				oRepCornerTextsView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[1], assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When representation corner texts view is initialized", function(assert) {
		_commonAssertsOnInitialization(assert);
		assert.strictEqual(oRepCornerTextsView.byId("idLeftUpper").getValue(), "", "then left upper corner text is empty since step also did not have any corner texts");
		assert.strictEqual(oRepCornerTextsView.byId("idRightUpper").getValue(), "Right top corner", "then corner text from step is set");
		assert.strictEqual(oRepCornerTextsView.byId("idLeftLower").getValue(), "Left bottom corner", "then corner text from step is set");
		assert.strictEqual(oRepCornerTextsView.byId("idRightLower").getValue(), "Right bottom corner", "then corner text from step is set");
	});
}());