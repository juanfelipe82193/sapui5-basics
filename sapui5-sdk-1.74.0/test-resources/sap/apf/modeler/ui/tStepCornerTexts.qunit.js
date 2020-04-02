/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tStepCornerTexts');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function() {
	'use strict';
	var oStepCornerTextsView, oModelerInstance, spyOnGetText, oInputControl;
	var originalSetTimeout = setTimeout;
	
	function _createEvent(oCustomDataSetterMethodName) {
		return {
			getSource : function() {
				oInputControl = new sap.m.Input({
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
		var oStepCornerTextsController = new sap.ui.controller("sap.apf.modeler.ui.controller.stepCornerTexts");
		var spyOnInit = sinon.spy(oStepCornerTextsController, "onInit");
		oStepCornerTextsView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.cornerTexts",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oStepCornerTextsController,
			viewData : {
				oTextReader : oModelerInstance.modelerCore.getText,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oTextPool : oModelerInstance.configurationHandler.getTextPool(),
				oParentObject : oParentObject
			}
		});
		assert.strictEqual(spyOnInit.calledOnce, true, "then step corner texts onInit function is called and view is initialized");
		return oStepCornerTextsView;
	}
	function _commonAssertsOnInitialization(assert) {
		//assert
		assert.ok(oStepCornerTextsView, "then step corner texts view is available");
		//display text asserts
		assert.strictEqual(spyOnGetText.called, true, "then getText function is called to set texts on UI");
		assert.strictEqual(spyOnGetText.calledWith("cornerTextLabel"), true, "then header for the corner text section is set");
		assert.strictEqual(spyOnGetText.calledWith("leftTop"), true, "then placeholder for left upper corner text input is set");
		assert.strictEqual(spyOnGetText.calledWith("rightTop"), true, "then placeholder for right upper corner text input is set");
		assert.strictEqual(spyOnGetText.calledWith("leftBottom"), true, "then placeholder for left lower corner text input is set");
		assert.strictEqual(spyOnGetText.calledWith("rightBottom"), true, "then placeholder for right lower corner text input is set");
		//corner texts getter method name asserts
		assert.strictEqual(oStepCornerTextsView.byId("idLeftUpper").getCustomData()[1].getValue(), "getLeftUpperCornerTextKey", "then method name to get left upper corner text key is retrieved from custom data");
		assert.strictEqual(oStepCornerTextsView.byId("idRightUpper").getCustomData()[1].getValue(), "getRightUpperCornerTextKey", "then method name to get right upper corner text key is retrieved from custom data");
		assert.strictEqual(oStepCornerTextsView.byId("idLeftLower").getCustomData()[1].getValue(), "getLeftLowerCornerTextKey", "then method name to get left lower corner text key is retrieved from custom data");
		assert.strictEqual(oStepCornerTextsView.byId("idRightLower").getCustomData()[1].getValue(), "getRightLowerCornerTextKey", "then method name to get right lower corner text key is retrieved from custom data");
		//asserts on chart icon
		assert.strictEqual(oStepCornerTextsView.byId("idChartIcon").getSrc(), "sap-icon://line-chart", "then chart icon is set correctly");
		assert.strictEqual(oStepCornerTextsView.byId("idChartIcon").aCustomStyleClasses[0], "stepChartIcon", "then style class for the chart icon is set correctly");
	}
	function _commonCleanUpsInAfterEach() {
		spyOnGetText.restore();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oModelerInstance.reset();
		oStepCornerTextsView.destroy();
	}
	QUnit.module("For an already saved step", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
				oStepCornerTextsView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When step corner texts view is initialized", function(assert) {
		_commonAssertsOnInitialization(assert);
		//corner text asserts
		assert.strictEqual(oStepCornerTextsView.byId("idLeftUpper").getValue(), "", "then corner text is empty since no value was saved earlier");
		assert.strictEqual(oStepCornerTextsView.byId("idRightUpper").getValue(), "Right top corner", "then saved corner text is retrieved and set correctly for right upper corner");
		assert.strictEqual(oStepCornerTextsView.byId("idLeftLower").getValue(), "Left bottom corner", "then saved corner text is retrieved and set correctly for left lower corner");
		assert.strictEqual(oStepCornerTextsView.byId("idRightLower").getValue(), "Right bottom corner", "then saved corner text is retrieved and set correctly for right lower corner");
	});
	QUnit.test("When left upper corner text is changed", function(assert) {
		var done = assert.async();
		var textHasBeenResolved = jQuery.Deferred();
		//arrange
		var spyOnConfigEditorSetIsUnsaved = sinon.spy(oStepCornerTextsView.getViewData().oConfigurationEditor, "setIsUnsaved");
		var spySetLeftUpperCornerTextKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "setLeftUpperCornerTextKey");

		var textPool = oModelerInstance.configurationHandler.getTextPool();
		var stubSetTextAsPromise = sinon.stub(textPool, "setTextAsPromise", function(sTitle){
				var deferred = jQuery.Deferred();
				
				originalSetTimeout(function() {
					deferred.resolve(sTitle);
					textHasBeenResolved.resolve();
				}, 1);
				return deferred.promise();
		});
		
		//act 
		oStepCornerTextsView.byId("idLeftUpper").fireChange();
		sap.ui.getCore().applyChanges();
		
		textHasBeenResolved.done(function(){
			//assert
			assert.strictEqual(oStepCornerTextsView.byId("idLeftUpper").getCustomData()[0].getValue(), "setLeftUpperCornerTextKey", "then method name to set left upper corner text key is retrieved from custom data");
			assert.strictEqual(spySetLeftUpperCornerTextKey.calledOnce, true, "then setLeftUpperCornerTextKey is called on step object");
			assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set as unsaved");
			//clean up
			oStepCornerTextsView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
			oModelerInstance.unsavedStepWithoutFilterMapping.setLeftUpperCornerTextKey.restore();
			stubSetTextAsPromise.restore();
			done();
		});
	
	});
	QUnit.test("When right upper corner text is changed", function(assert) {
		var done = assert.async();
		var textHasBeenResolved = jQuery.Deferred();
		//arrange
		var spyOnConfigEditorSetIsUnsaved = sinon.spy(oStepCornerTextsView.getViewData().oConfigurationEditor, "setIsUnsaved");
		var spySetRightUpperCornerTextKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "setRightUpperCornerTextKey");
		var textPool = oModelerInstance.configurationHandler.getTextPool();
		var stubSetTextAsPromise = sinon.stub(textPool, "setTextAsPromise", function(sTitle){
			var deferred = jQuery.Deferred();

			originalSetTimeout(function() {
				deferred.resolve(sTitle);
				textHasBeenResolved.resolve();
			}, 1);
			return deferred.promise();
		});
		//act 
		oStepCornerTextsView.byId("idRightUpper").fireChange();
		sap.ui.getCore().applyChanges();
		textHasBeenResolved.done(function(){
			//assert
			assert.strictEqual(oStepCornerTextsView.byId("idRightUpper").getCustomData()[0].getValue(), "setRightUpperCornerTextKey", "then method name to set right upper corner text key is retrieved from custom data");
			assert.strictEqual(spySetRightUpperCornerTextKey.calledOnce, true, "then setRightUpperCornerTextKey is called on step object");
			assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set as unsaved");
			//clean up
			oStepCornerTextsView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
			oModelerInstance.unsavedStepWithoutFilterMapping.setRightUpperCornerTextKey.restore();
			stubSetTextAsPromise.restore();
			done();
		});
	});
	QUnit.test("When left lower corner text is changed", function(assert) {
		//arrange
		var spyOnConfigEditorSetIsUnsaved = sinon.spy(oStepCornerTextsView.getViewData().oConfigurationEditor, "setIsUnsaved");
		var spySetLeftLowerCornerTextKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "setLeftLowerCornerTextKey");
		//act 
		oStepCornerTextsView.byId("idLeftLower").fireChange();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(oStepCornerTextsView.byId("idLeftLower").getCustomData()[0].getValue(), "setLeftLowerCornerTextKey", "then method name to set left lower corner text key is retrieved from custom data");
		assert.strictEqual(spySetLeftLowerCornerTextKey.calledOnce, true, "then setLeftLowerCornerTextKey is called on step object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set as unsaved");
		//clean up
		oStepCornerTextsView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oModelerInstance.unsavedStepWithoutFilterMapping.setLeftLowerCornerTextKey.restore();
	});
	QUnit.test("When right lower corner text is changed", function(assert) {
		//arrange
		var spyOnConfigEditorSetIsUnsaved = sinon.spy(oStepCornerTextsView.getViewData().oConfigurationEditor, "setIsUnsaved");
		var spySetRightLowerCornerTextKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "setRightLowerCornerTextKey");
		//act 
		oStepCornerTextsView.byId("idRightLower").fireChange();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(oStepCornerTextsView.byId("idRightLower").getCustomData()[0].getValue(), "setRightLowerCornerTextKey", "then method name to set right lower corner text key is retrieved from custom data");
		assert.strictEqual(spySetRightLowerCornerTextKey.calledOnce, true, "then setRightLowerCornerTextKey is called on step object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set as unsaved");
		//clean up
		oStepCornerTextsView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oModelerInstance.unsavedStepWithoutFilterMapping.setRightLowerCornerTextKey.restore();
	});
	QUnit.test("When suggestions are triggered for right lower corner text", function(assert) {
		//arrange
		var oTextPool = oModelerInstance.configurationHandler.getTextPool();
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_CORNER_TEXT;
		var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oTextPool);
		var oSuggestionTextHandlerStub = sinon.stub(sap.apf.modeler.ui.utils, "SuggestionTextHandler", function() {
			return oSuggestionTextHandler;
		});
		var spyOnManageSuggestionTexts = sinon.spy(oSuggestionTextHandler, "manageSuggestionTexts");
		var oEvt = _createEvent("setRightLowerCornerTextKey");
		//act 
		oStepCornerTextsView.getController().handleChangeForCornerText(oEvt);
		oStepCornerTextsView.getController().handleSuggestions(oEvt);
		//assert
		assert.strictEqual(spyOnManageSuggestionTexts.calledOnce, true, "then suggestions are fetched from SuggestionTextHandler");
		assert.strictEqual(spyOnManageSuggestionTexts.calledWith(oEvt, oTranslationFormat), true, "then suggestions are fetched from SuggestionTextHandler for the correct event and translation format");
		//clean up
		spyOnManageSuggestionTexts.restore();
		oSuggestionTextHandlerStub.restore();
	});
	QUnit.module("For a new step", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
				oStepCornerTextsView = _instantiateView(oModelerInstance.unsavedStepWithFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When step corner texts view is initialized", function(assert) {
		_commonAssertsOnInitialization(assert);
		assert.strictEqual(oStepCornerTextsView.byId("idLeftUpper").getValue(), "", "then left upper corner text is empty for a new step");
		assert.strictEqual(oStepCornerTextsView.byId("idRightUpper").getValue(), "", "then right upper corner text is empty for a new step");
		assert.strictEqual(oStepCornerTextsView.byId("idLeftLower").getValue(), "", "then left lower corner text is empty for a new step");
		assert.strictEqual(oStepCornerTextsView.byId("idRightLower").getValue(), "", "then right lower corner text is empty for a new step");
	});
}());