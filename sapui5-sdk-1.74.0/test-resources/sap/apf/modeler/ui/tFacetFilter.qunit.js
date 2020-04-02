/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2016 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tFacetFilter');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	'use strict';
	var oModelerInstance, oFacetFilterView, oTextPool;
	var spyOnGetFilterablePropertiesAndParametersAsPromise, spyOnGetOfTextPool, spyOnFFGetProperty, spyOnFFGetLabelKey, spyOnFFIsMultiSelection, spyOnFFVisibility, spyOnFFGetPreselectionFn, spyOnFFGetPreselectionDefaults, spyOnFFGetUseVHRAsFRR, spyOnSetValueList;
	var spyOnSetTextOfTextPool, spyOnConfigEditorSetIsUnsaved, spyOnGetText;
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
	function _eventCreation(value) {
		return {
			getParameter : function() {
				return value;
			}
		};
	}
	
	function _createEvent() {
		return {
			getSource : function() {
				return oInputControl;
			},
			getParameter : function(parameterName) {
				if (parameterName === "suggestValue") {
					return "ff";
				}
			}
		};
	}
	function _instantiateView(sId, assert) {
		var oFacetFilterController = new sap.ui.controller("sap.apf.modeler.ui.controller.facetFilter");
		var spyOnInit = sinon.spy(oFacetFilterController, "onInit");
		var setDetailDataSpy = sinon.spy(oFacetFilterController, "setDetailData");
		var oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.facetFilter",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oFacetFilterController,
			viewData : {
				updateSelectedNode : oModelerInstance.updateSelectedNode,
				updateTitleAndBreadCrumb : oModelerInstance.updateTitleAndBreadCrumb,
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				getText : oModelerInstance.modelerCore.getText,
				oParams : {
					name : "facetFilter",
					arguments : {
						configId : oModelerInstance.tempUnsavedConfigId,
						categoryId : oModelerInstance.categoryIdUnsaved,
						facetFilterId : sId
					}
				}
			}
		});
		assert.strictEqual(spyOnInit.calledOnce, true, "then facet filter onInit function is called and view is initialized");
		assert.strictEqual(setDetailDataSpy.calledOnce, true, "then facet filter setDetailData function is called");
		return oView;
	}
	function _assertsForOnLoadOfNewFacetFilter(assert, label, property) {
		var oDataForProperty = _dataForProperty();
		//assert
		assert.ok(oFacetFilterView, "then facet filter view exists");
		assert.ok(oFacetFilterView.byId("idVHRView"), "then VHR View is instantiated");
		assert.ok(oFacetFilterView.byId("idFRRView"), "then FRR View is instantiated");
		assert.strictEqual(oFacetFilterView.byId("idLabel").getValue(), label, "then label for facet filter is displayed");
		assert.strictEqual(oFacetFilterView.byId("idFFLabel").getRequired(), true, "then facet filter label is set required");
		assert.strictEqual(oFacetFilterView.byId("idFFProperty").getSelectedKey(), property, "then property for facet filter is displayed");
		assert.deepEqual(oFacetFilterView.byId("idFFProperty").getModel().getData(), oDataForProperty, "then model data for property for facet filter is set");
		assert.strictEqual(oFacetFilterView.byId("idFFPropertyLabel").getRequired(), true, "then facet filter label is set required");
		assert.strictEqual(spyOnGetFilterablePropertiesAndParametersAsPromise.calledOnce, true, "then all known properties are fetched");
	}
	function _assertsForPreSelectionDefault(assert, isFixedValue, fixedValue) {
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getValue(), fixedValue, "then facet filter preselection defaults is set to " + fixedValue);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), isFixedValue, "then facet filter preselection defaults text box visiblility is " + isFixedValue);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), isFixedValue, "then facet filter preselection defaults label visibility is " + isFixedValue);
	}
	function _assertsForPreSelectionFunction(assert, isFunction, functionValue) {
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunction").getValue(), functionValue, "then facet filter preselection function is set to " + functionValue);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunction").getVisible(), isFunction, "then facet filter preselection function text box visibility is" + isFunction);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getVisible(), isFunction, "then facet filter preselection function label visiblitity is" + isFunction);
	}
	function _assertsForValueHelpRequest(assert, isVHRFieldInserted, isValueHelpRequest) {
		var texttoAssertVHRFieldVisiblility = isVHRFieldInserted ? "then VHR view is inserted in FF view" : "then VHR view is removed from FF view";
		assert.strictEqual(oFacetFilterView.byId("idVHRVBox").indexOfItem(oFacetFilterView.byId("idVHRView")), isVHRFieldInserted, texttoAssertVHRFieldVisiblility);
	}
	function _assertsForConfigListIfValues(assert, valueHelpOption, isConfigListOfValue) {
		assert.strictEqual(oFacetFilterView.byId("idValueHelpRadioGroup").getSelectedButton(), valueHelpOption, "then value help of facet filter is set to " + valueHelpOption.getText());
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesLabel").getVisible(), isConfigListOfValue, "then config list label visibility is " + isConfigListOfValue);
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getVisible(), isConfigListOfValue, "then config list multi input field visibility is " + isConfigListOfValue);
		assert.deepEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens(), [], "then config list multi input field is []");
	}
	function _assertsForUseVHRASFRR(assert, isVHRAsFRRVisible, isVHRAsFRRSelected) {
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), isVHRAsFRRSelected, "then facet filter use same as VHR selected is" + isVHRAsFRRSelected);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBoxLabel").getVisible(), isVHRAsFRRVisible, "then VHR as FRR check box label visibility is " + isVHRAsFRRVisible);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getVisible(), isVHRAsFRRVisible, "then use VHR as FRR check box visiblility is " + isVHRAsFRRVisible);
	}
	function _assertsToCheckVisibility(assert) {
		assert.strictEqual(spyOnFFVisibility.called, true, "then isVisible is called");
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter is set to visible");
		assert.strictEqual(spyOnGetText.calledWith("valueHelp"), true, "then value help title is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idValueHelp").getVisible(), true, "then value help radio group is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idFFForm1").getVisible(), true, "then form is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idVHRVBox").indexOfItem(oFacetFilterView.byId("idVHRView")), -1, "then VHR view is inserted to FF view");
		assert.strictEqual(oFacetFilterView.byId("idFRRVBox").indexOfItem(oFacetFilterView.byId("idFRRView")), 0, "then FRRR view is inserted to FF view");
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
	}
	function _assertsOfCommonVisibleOrInVisiblefilters(assert, isSelectionVisible, isPreSelectionVisible) {
		assert.strictEqual(oFacetFilterView.byId("idSelectionMode").getVisible(), isSelectionVisible, "then selection mode radio group visibility is " + isSelectionVisible);
		assert.strictEqual(oFacetFilterView.byId("idSelectionModeLabel").getVisible(), isSelectionVisible, "then selection mode radio group label visibility is " + isSelectionVisible);
		assert.strictEqual(oFacetFilterView.byId("idSelectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idMultiSelectionMode"), "then facet filter is set to multi selection");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeLabel").getVisible(), isPreSelectionVisible, "then PreselectionMode title visibiltiy is " + isPreSelectionVisible);
		assert.strictEqual(oFacetFilterView.getController().byId("idPreselectionMode").getVisible(), isPreSelectionVisible, "then preselection mode radio group visibility is " + isPreSelectionVisible);
	}
	function _assertsForInvisiblefilters(assert, VHRAndFormvisibility, isFRRVisible) {
		var textForAssertFRRVisibility = isFRRVisible ? "then FRR view is insterted in FF view" : "then FRR view is removed from FF view";
		assert.strictEqual(oFacetFilterView.byId("idFFForm1").getVisible(), VHRAndFormvisibility, "then form visibility is " + VHRAndFormvisibility);
		assert.strictEqual(oFacetFilterView.byId("idFRRVBox").indexOfItem(oFacetFilterView.byId("idFRRView")), isFRRVisible, textForAssertFRRVisibility);
	}
	function _assertsForOnLoadOfFacetFilter(assert, isMultiSelection, multiSelectionMode) {
		var testForAssertMultiSelectionMode = isMultiSelection ? "then facet filter is changed to multiple selection" : "then facet filter is changed to single selection";
		_assertsForOnLoadOfNewFacetFilter(assert, "label1", "property2");
		assert.strictEqual(spyOnFFGetLabelKey.called, true, "then label for facet filter is fetched");
		assert.strictEqual(spyOnGetOfTextPool.called, true, "then label for facet filter is fetched from text pool");
		assert.strictEqual(spyOnGetOfTextPool.calledWith("label1"), true, "then label for facet filter is 'label1'");
		assert.strictEqual(spyOnFFGetProperty.called, true, "then property for facet filter is fetched");
		assert.strictEqual(spyOnFFIsMultiSelection.called, true, "then selection mode for facet filter is fetched");
		assert.strictEqual(oFacetFilterView.byId("idSelectionModeRadioGroup").getSelectedButton(), multiSelectionMode, "then facet filter is set to " + multiSelectionMode.getText());
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.isMultiSelection(), isMultiSelection, testForAssertMultiSelectionMode);
		assert.strictEqual(spyOnFFVisibility.called, true, "then visibilty mode for facet filter is fetched");
	}
	function _commonTestOnChangeOfPreselectionModeToNone(assert) {
		//arrangement
		var spyOnSetNoneSelection = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setNoneSelection");
		var spyOnRemovePreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionDefaults");
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idNoneSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForPreSelectionDefault(assert, false, "");
		assert.strictEqual(spyOnRemovePreselectionDefaults.calledOnce, true, "then remove preselection defaults is called");
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then remove preselection function is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getAutomaticSelection(), false, "then, automatic selection is removed");
		assert.strictEqual(spyOnSetNoneSelection.calledOnce, true, "then, none is set for preselection mode");
		assert.strictEqual(spyOnSetNoneSelection.calledWith(true), true, "then, none of preselection mode is set as true");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	}
	function _commonTestOnChangeOfPreSelectionToAutomatic(assert) {
		var spyOnRemovePreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionDefaults");
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		var spyOnSetAutomaticSelection = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setAutomaticSelection");
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(spyOnSetAutomaticSelection.calledOnce, true, "then, automatic selection is set");
		assert.strictEqual(spyOnSetAutomaticSelection.calledWith(true), true, "then, automatic selection is called with argument as true");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getAutomaticSelection(), true, "then, automatic selection is applied");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getNoneSelection(), false, "then, preselection mode none is removed");
		assert.strictEqual(spyOnRemovePreselectionDefaults.calledOnce, true, "then remove preselection defaults is called");
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then remove preselection function is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [], "then preselection defaults is empty");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	}
	function _commonTestForPreSelectionDefaultInvisibleToVisibleFilter(assert) {
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
	}
	function _commonTestForPreselectionAutomaticValueInvisibleToVisibleFilter(assert, idForPreselectionMode) {
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, true, 0);
		assert.strictEqual(spyOnGetText.calledWith("valueHelp"), true, "then value help title invisibility is false" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, true, true);
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId(idForPreselectionMode), "then " + oFacetFilterView.byId(idForPreselectionMode).getText()
				+ " is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
	}
	function _commonTestForInvisibleFilters(assert, idForPreselectionMode) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId(idForPreselectionMode), "then " + oFacetFilterView.byId(idForPreselectionMode).getText()
				+ " is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	}
	function _commonTestForInvisibleToVisibleFilterWithDefaultFunction(assert) {
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
	}
	function _commonTestForChangeOfPreSelectionToAutomaticForInvisibleFilter(assert) {
		_commonTestOnChangeOfPreSelectionToAutomatic(assert);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title is set to invisible");
		assert.strictEqual(oFacetFilterView.byId("idValueHelp").getVisible(), false, "then value help radio group is not visible");
	}
	function _commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance) {
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		oTextPool = oModelerInstance.configurationHandler.getTextPool();
		spyOnSetValueList = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setValueList");
		spyOnSetTextOfTextPool = sinon.spy(oTextPool, "setTextAsPromise");
		spyOnGetOfTextPool = sinon.spy(oTextPool, "get");
		spyOnFFGetProperty = sinon.spy(oModelerInstance.facetFilterUnsaved2, "getProperty");
		spyOnFFGetLabelKey = sinon.spy(oModelerInstance.facetFilterUnsaved2, "getLabelKey");
		spyOnFFIsMultiSelection = sinon.spy(oModelerInstance.facetFilterUnsaved2, "isMultiSelection");
		spyOnFFGetUseVHRAsFRR = sinon.spy(oModelerInstance.facetFilterUnsaved, "getUseSameRequestForValueHelpAndFilterResolution");
		spyOnFFVisibility = sinon.spy(oModelerInstance.facetFilterUnsaved2, "isVisible");
		spyOnGetFilterablePropertiesAndParametersAsPromise = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getFilterablePropertiesAndParametersAsPromise");
		spyOnFFGetPreselectionFn = sinon.spy(oModelerInstance.facetFilterUnsaved2, "getPreselectionFunction");
		spyOnFFGetPreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "getPreselectionDefaults");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
	}
	function _commonCleanUpsInAfterEach() {
		oTextPool.get.restore();
		oTextPool.setTextAsPromise.restore();
		oModelerInstance.configurationEditorForUnsavedConfig.getFilterablePropertiesAndParametersAsPromise.restore();
		oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
		oModelerInstance.modelerCore.getText.restore();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oModelerInstance.reset();
		oFacetFilterView.destroy();
	}
	function _placeViewAt(oFacetFilterView) {
		var divToPlaceFacetFilter = document.createElement("div");
		divToPlaceFacetFilter.setAttribute('id', 'contentOfFF');
		document.body.appendChild(divToPlaceFacetFilter);
		oFacetFilterView.placeAt("contentOfFF");
		sap.ui.getCore().applyChanges();
	}
	function _dataForProperty() {
		return {
			"Objects" : [ {
				key : "property1",
				name : "property1"
			}, {
				key : "property2",
				name : "property2"
			}, {
				key : "property3",
				name : "property3"
			}, {
				key : "property4",
				name : "property4"
			} ]
		};
	}
	QUnit.module("Test for a facet filter which is new", {
		// Facet filter new state has multiselection, Automatic value for default value and none for value help selected by default
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
				oTextPool = oModelerInstance.configurationHandler.getTextPool();
				spyOnGetFilterablePropertiesAndParametersAsPromise = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getFilterablePropertiesAndParametersAsPromise");
				oFacetFilterView = _instantiateView("newFilter0", assert);
				done();
			});
		},
		afterEach : function() {
			oModelerInstance.configurationEditorForUnsavedConfig.getFilterablePropertiesAndParametersAsPromise.restore();
			oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			oModelerInstance.reset();
			oFacetFilterView.destroy();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		// arrange
		_placeViewAt(oFacetFilterView);
		// assert 
		_assertsForOnLoadOfNewFacetFilter(assert, "", "");
		assert.strictEqual(oFacetFilterView.byId("idLabel").getPlaceholder(), oFacetFilterView.getViewData().getText("newFacetFilter"), "then place holder for new facet filter is set");
		assert.strictEqual(oFacetFilterView.byId("idSelectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idMultiSelectionMode"), "then facet filter is set to multiselect");
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idNoneSelection"), "then none is selected as preselection mode by default");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When preselection mode is none and value help changed from none to value help request", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is none and value help changed from none to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from none to automatic selections and value help is none", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForPreSelectionDefault(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then preselection mode changed from none to automatic selection");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from none to fixed values and value help is none", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults label field is required ");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from none to function and value help is none", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		_commonTestForInvisibleFilters(assert, "idNoneSelection");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		//arrange
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForOnLoadOfNewFacetFilter(assert, "", "");
		assert.strictEqual(oFacetFilterView.byId("idSelectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idMultiSelectionMode"), "then facet filter is set to multiselect");
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idNoneSelection"), "then none is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
	});
	QUnit.module("Test for a facet filter is visible, multiple selection, has preselection mode as none and value help as none ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getNoneSelection(), true, "then check to see if none for preselection is set by default");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idNoneSelection"), "then none is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is none and value help changed from none to value help request", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is none and value help changed from none to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from none to automatic selections and value help is none", function(assert) {
		_commonTestOnChangeOfPreSelectionToAutomatic(assert);
	});
	QUnit.test("When preselection mode is changed from none to fixed values and value help is none", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection changed from automatic values to fixed values");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults label field is required ");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from none to function and value help is none", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		_commonTestForInvisibleFilters(assert, "idNoneSelection");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForPreselectionAutomaticValueInvisibleToVisibleFilter(assert, "idNoneSelection");
	});
	QUnit.module("Test for a facet filter is visible, multiple selection, has automatic values and value help as Value help request ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setAutomaticSelection(true);
				oModelerInstance.facetFilterUnsaved2.setServiceOfValueHelp("testService1");
				oModelerInstance.facetFilterUnsaved2.setEntitySetOfValueHelp("entitySet1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property3");
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		// assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		_assertsForUseVHRASFRR(assert, true, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is automatic values and value help changed from value help request to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is automatic values and value help changed from value help request to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from automatic selection to none and value help is value help request", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from automatic values to fixed values and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults label field is required ");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from automatic values to function and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is automatic values, value help is value help request and use same as VHR checkbox is selected", function(assert) {
		//arrange
		var spyOnFFSetUseVHRAsFRR = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setUseSameRequestForValueHelpAndFilterResolution");
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idUseVHRAsFRRCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForUseVHRAsFRRCheckBox();
		//assert
		assert.strictEqual(spyOnFFSetUseVHRAsFRR.calledWith(true), true, "then setUseSameRequestForValueHelpAndFilterResolution is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getUseSameRequestForValueHelpAndFilterResolution(), true, "then use same as VHR is set to true");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.USESAMEASVHR), true, "then useSameAsVHREvent is fired when use same as VHR is selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when use same as VHR is selected");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		//arrange
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
	});
	QUnit.module("Test for a facet filter is visible, multiple selection, has automatic values and value help as Configuration list of values ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setAutomaticSelection(true);
				oModelerInstance.facetFilterUnsaved2.setValueList([ "token1" ]);
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpRadioGroup").getSelectedButton(), oFacetFilterView.byId("idConfigListOfValues"), "then value help of facet filter is set to configuration list of values");
		assert.strictEqual(oFacetFilterView.byId("idVHRVBox").indexOfItem(oFacetFilterView.byId("idVHRView")), -1, "then VHR view is not in FF view");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesLabel").getVisible(), true, "then config list label is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getVisible(), true, "then config list multi input field is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0].getText(), "token1", "then config value list is set with value 'token1'");
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When facet filter's configuration value list is set with values", function(assert) {
		// action
		_placeViewAt(oFacetFilterView);
		oFacetFilterView.byId("idConfigListOfValuesMultiInput").setValue("token2");
		oFacetFilterView.getController().handleChangeForConfigListOfValues(_eventCreation("token2"));
		//assert
		assert.strictEqual(spyOnSetValueList.called, true, "then the function to set config value list is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getValueList()[0], "token1", "then config value list is set with array of first value as'token1'");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getValueList()[1], "token2", "then config value list is set with array of second value as 'token2'");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens().length, 2, "then config list multi input field is set with 2 tokens");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0].getText(), "token1", "then config list multi input field's first value is 'token1'");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[1].getText(), "token2", "then config list multi input field's second value is 'token2'");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When facet filter's configured value list is emptied", function(assert) {
		//action
		_placeViewAt(oFacetFilterView);
		var token1 = oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0];
		oFacetFilterView.byId("idConfigListOfValuesMultiInput").removeToken(token1);
		//assert
		assert.strictEqual(spyOnSetValueList.calledWith([]), true, "then ValueList is set with empty");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getValueList(), [], "then configured list of values is changed and set to empty");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When preselection mode is automatic values and value help changed from configuration list of values to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is automatic values and value help changed from Configuration list of values to value help request", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from automatic selection to none and value help is configuration list of values", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from automatic values to fixed values and value help is configuration list of values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults label field is required ");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from automatic values to function and value help is configuration list of values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		_commonTestForInvisibleFilters(assert, "idAutomaticSelection");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForPreselectionAutomaticValueInvisibleToVisibleFilter(assert, "idAutomaticSelection");
	});
	QUnit.module("Test for a facet filter is visible, multiple selection, has fixed values and value help as none ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setPreselectionDefaults([ "1000", "3000" ]);
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[1].getText(), "3000", "then facet filter preselection defaults is set to 3000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is fixed values and adding more than one default value", function(assert) {
		//arrange
		_placeViewAt(oFacetFilterView);
		var spyOnFFSetPreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setPreselectionDefaults");
		var spyOnRemovePreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionDefaults");
		//action
		oFacetFilterView.getController().handleChangeForPreselectionDefaults(_eventCreation("2000"));
		//assert
		assert.strictEqual(oFacetFilterView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		assert.strictEqual(spyOnRemovePreselectionDefaults.called, false, "then removePreselectionDefaults is not called");
		assert.strictEqual(spyOnFFSetPreselectionDefaults.called, true, "then setPreselectionDefaults is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [ "1000", "3000", "2000" ], "then preselection defaults is added with more than one value as its a multiple selection");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getValueState(), sap.ui.core.ValueState.None, "No warning displayed when trying to add more than one value");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When preselection mode is fixed values and removing the default value", function(assert) {
		//arrange
		_placeViewAt(oFacetFilterView);
		var spyOnFFSetPreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setPreselectionDefaults");
		//action
		var token1 = oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0];
		var token2 = oFacetFilterView.byId("idPreselectionDefaults").getTokens()[1];
		oFacetFilterView.byId("idPreselectionDefaults").removeToken(token1);
		oFacetFilterView.byId("idPreselectionDefaults").removeToken(token2);
		//assert
		assert.strictEqual(spyOnFFSetPreselectionDefaults.called, true, "then setPreselectionDefaults is called to set to empty array");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [], "then preselection defaults is changed and set to empty");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When facet filters selection mode is changed from multiple to single selection", function(assert) {
		//arrange
		var spyOnFFSetMultiSelection = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setMultiSelection");
		var spyOnFFSetPreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setPreselectionDefaults");
		//action
		oFacetFilterView.byId("idSelectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idSingleSelectionMode"));
		oFacetFilterView.getController().handleChangeForSelectionMode();
		//assert
		assert.strictEqual(spyOnFFSetMultiSelection.calledWith(false), true, "then selection mode is set to single");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults label is set to required");
		assert.strictEqual(spyOnFFSetPreselectionDefaults.calledWith([ "1000" ]), true, "then setPreselectionDefaults is called with 1000");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [ "1000" ], "then preselection defaults is changed to 1000 and 2000 is removed");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getValueState(), sap.ui.core.ValueState.Warning, "Warning displayed when trying to add more than one value");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens().length, 1, "then preselection defaults is set with one value");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then preselection defaults is changed to 1000 and displayed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is fixed values and value help changed from none to value help request", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is fixed values and value help changed from none to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to none and value help is none", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from fixed values to automatic values and value help is none", function(assert) {
		//arrange
		var spyOnRemovePreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionDefaults");
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		var spyOnSetAutomaticSelection = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setAutomaticSelection");
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(spyOnSetAutomaticSelection.calledOnce, true, "then, automatic selection is set");
		assert.strictEqual(spyOnSetAutomaticSelection.calledWith(true), true, "then, automatic selection is called with argument as true");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getAutomaticSelection(), true, "then, automatic selection is applied");
		assert.strictEqual(spyOnRemovePreselectionDefaults.calledOnce, true, "then remove preselection defaults is called");
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then remove preselection function is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [], "then preselection defaults is empty");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to function and value help is none", function(assert) {
		//arrange
		var spyOnRemovePreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionDefaults");
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(spyOnRemovePreselectionDefaults.calledOnce, true, "then remove preselection defaults is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [], "then preselection defaults is empty");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.getController().byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.getController().byId("idFixedValue"), "then fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection deafult is set with token value 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection default is visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection default label is visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		//arrange
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[1].getText(), "3000", "then facet filter preselection defaults is set to 3000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter is set to visible");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
	});
	QUnit.module("Test for a facet filter is visible, multiple selection, has fixed values and value help as Value help request ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setPreselectionDefaults([ "1000" ]);
				oModelerInstance.facetFilterUnsaved2.setServiceOfValueHelp("testService1");
				oModelerInstance.facetFilterUnsaved2.setEntitySetOfValueHelp("entitySet1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property3");
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		_assertsForUseVHRASFRR(assert, true, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is fixed values and value help changed from value help request to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is fixed values and value help changed from value help request to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to none and value help is value help request", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from fixed values to automatic value values and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to function and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is fixed values, value help is value help request and use same as VHR checkbox is selected", function(assert) {
		//arrange
		var spyOnFFSetUseVHRAsFRR = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setUseSameRequestForValueHelpAndFilterResolution");
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idUseVHRAsFRRCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForUseVHRAsFRRCheckBox();
		//assert
		assert.strictEqual(spyOnFFSetUseVHRAsFRR.calledWith(true), true, "then setUseSameRequestForValueHelpAndFilterResolution is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getUseSameRequestForValueHelpAndFilterResolution(), true, "then use same as VHR is set to true");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.USESAMEASVHR), true, "then useSameAsVHREvent is fired when use same as VHR is selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when use same as VHR is selected");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.getController().byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.getController().byId("idFixedValue"), "then fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForPreSelectionDefaultInvisibleToVisibleFilter(assert);
	});
	QUnit.module("Test for a facet filter is visible, multiple selection, has fixed values and value help as Value help request, use VHR as FRR is selected ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setUseSameRequestForValueHelpAndFilterResolution(true);
				oModelerInstance.facetFilterUnsaved2.setPreselectionDefaults([ "1000" ]);
				oModelerInstance.facetFilterUnsaved2.setServiceOfValueHelp("testService1");
				oModelerInstance.facetFilterUnsaved2.setEntitySetOfValueHelp("entitySet1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property3");
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(oFacetFilterView.byId("idFRRVBox").indexOfItem(oFacetFilterView.byId("idFRRView")), 0, "then FRRR view is removed from FF view");
		_assertsForUseVHRASFRR(assert, true, true);
		assert.strictEqual(oModelerInstance.facetFilterUnsaved.getUseSameRequestForValueHelpAndFilterResolution(), true, "then FRR uses the same service as VHR");
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, true, "then use VHR as FRR is set");
	});
	QUnit.test("When preselection mode is fixed values and value help changed from value help request to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is fixed values and value help changed from value help request to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to none and value help is value help request", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from fixed values to automatic value values and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to function and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is fixed values, value help is value help request and use same as VHR checkbox is un selected", function(assert) {
		//arrange
		var spyOnFFSetUseVHRAsFRR = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setUseSameRequestForValueHelpAndFilterResolution");
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idUseVHRAsFRRCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForUseVHRAsFRRCheckBox();
		//assert
		assert.strictEqual(spyOnFFSetUseVHRAsFRR.calledWith(false), true, "then setUseSameRequestForValueHelpAndFilterResolution is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getUseSameRequestForValueHelpAndFilterResolution(), false, "then use same as VHR is set to true");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.USESAMEASVHR), true, "then useSameAsVHREvent is fired when use same as VHR is selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when use same as VHR is selected");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.getController().byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.getController().byId("idFixedValue"), "then fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForPreSelectionDefaultInvisibleToVisibleFilter(assert);
	});
	QUnit.module("Test for a facet filter is visible, multiple selection, has fixed values and value help as Configuration list of values ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setPreselectionDefaults([ "1000" ]);
				oModelerInstance.facetFilterUnsaved2.setValueList([ "token1" ]);
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpRadioGroup").getSelectedButton(), oFacetFilterView.byId("idConfigListOfValues"), "then value help of facet filter is set to configuration list of values");
		assert.strictEqual(oFacetFilterView.byId("idVHRVBox").indexOfItem(oFacetFilterView.byId("idVHRView")), -1, "then VHR view is not in FF view");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesLabel").getVisible(), true, "then config list label is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getVisible(), true, "then config list multi input field is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0].getText(), "token1", "then config value list is set with value 'token1'");
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is fixed values and value help is configuration list of values and changing the value of config list of values", function(assert) {
		// action
		_placeViewAt(oFacetFilterView);
		oFacetFilterView.byId("idConfigListOfValuesMultiInput").setValue("token2");
		oFacetFilterView.getController().handleChangeForConfigListOfValues(_eventCreation("token2"));
		//assert
		assert.strictEqual(spyOnSetValueList.called, true, "then the function to set config value list is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getValueList()[0], "token1", "then config value list is set with array of first value as'token1'");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getValueList()[1], "token2", "then config value list is set with array of second value as 'token2'");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens().length, 2, "then config list multi input field is set with 2 tokens");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0].getText(), "token1", "then config list multi input field's first value is 'token1'");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[1].getText(), "token2", "then config list multi input field's second value is 'token2'");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When preselection mode is fixed values and value help is configuration list of values and removing the config list of values", function(assert) {
		//action
		_placeViewAt(oFacetFilterView);
		var token1 = oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0];
		oFacetFilterView.byId("idConfigListOfValuesMultiInput").removeToken(token1);
		//assert
		assert.strictEqual(spyOnSetValueList.calledWith([]), true, "then setValueList is  called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved.getValueList(), [], "then configured list of values is changed and set to empty");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When preselection mode is fixed values and value help changed from configuration list of values to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is fixed values and value help changed from Configuration list of values to value help request", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to none and value help is configuration list of values", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from fixed values to automatic values and value help is configuration list of values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to function and value help is configuration list of values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.getController().byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.getController().byId("idFixedValue"), "then automatic value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForPreSelectionDefaultInvisibleToVisibleFilter(assert);
	});
	QUnit.module("Test for a facet filter is visible, multiple selection, has function and value help as none ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setPreselectionFunction("testFunction");
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		assert.strictEqual(spyOnFFGetPreselectionDefaults.called, false, "then check to see if preselection default for facet filter is not available");
		assert.strictEqual(spyOnFFGetPreselectionFn.called, true, "then check to see if preselection function for facet filter is available");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is function and value of function is changed", function(assert) {
		//arrange
		var spyOnFFSetPreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setPreselectionFunction");
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		//action
		oFacetFilterView.byId("idPreselectionFunction").setValue("testFunction2");
		oFacetFilterView.getController().handleChangeForPreselectionFunction();
		//assert
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then removePreselectionFunction is called");
		assert.strictEqual(spyOnFFSetPreselectionFunction.calledOnce, true, "then setPreselectionFunction is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionFunction(), "testFunction2", "then preselection function is changed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is function and value of function is changed to empty", function(assert) {
		//arrange
		var spyOnFFSetPreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setPreselectionFunction");
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		//action
		oFacetFilterView.byId("idPreselectionFunction").setValue("");
		oFacetFilterView.getController().handleChangeForPreselectionFunction();
		//assert
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then removePreselectionFunction is called");
		assert.strictEqual(spyOnFFSetPreselectionFunction.calledOnce, false, "then setPreselectionFunction is not called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionFunction(), undefined, "then preselection function is changed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is function and value help changed from none to value help request", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is function value help changed from none to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to none and value help is none", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from function to automatic values and value help is none", function(assert) {
		//arrange
		var spyOnRemovePreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionDefaults");
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		var spyOnSetAutomaticSelection = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setAutomaticSelection");
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(spyOnSetAutomaticSelection.calledOnce, true, "then, automatic selection is set");
		assert.strictEqual(spyOnSetAutomaticSelection.calledWith(true), true, "then, automatic selection is called with argument as true");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getAutomaticSelection(), true, "then, automatic selection is applied");
		assert.strictEqual(spyOnRemovePreselectionDefaults.calledOnce, true, "then remove preselection defaults is called");
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then remove preselection function is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [], "then preselection defaults is empty");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to fixed values and value help is none", function(assert) {
		//arrange
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then remove preselection defaults is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionFunction(), undefined, "then preselection defaults is empty");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults fixed value field is required");
		_assertsForPreSelectionDefault(assert, true, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForInvisibleToVisibleFilterWithDefaultFunction(assert);
	});
	QUnit.module("Test for a facet filter is visible, multiple selection, has function and value help as Value help request ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setPreselectionFunction("testFunction");
				oModelerInstance.facetFilterUnsaved2.setServiceOfValueHelp("testService1");
				oModelerInstance.facetFilterUnsaved2.setEntitySetOfValueHelp("entitySet1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property3");
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		assert.strictEqual(spyOnFFGetPreselectionDefaults.called, false, "then check to see if preselection default for facet filter is not available");
		assert.strictEqual(spyOnFFGetPreselectionFn.called, true, "then check to see if preselection function for facet filter is available");
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		_assertsForUseVHRASFRR(assert, true, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is function and value help changed from value help request to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is function and value help changed from value help request to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to none and value help is value help request", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from function to automatic value values and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to fixed values and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults fixed value field is required");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is function, value help is value help request and use same as VHR checkbox is selected", function(assert) {
		//arrange
		var spyOnFFSetUseVHRAsFRR = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setUseSameRequestForValueHelpAndFilterResolution");
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idUseVHRAsFRRCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForUseVHRAsFRRCheckBox();
		//assert
		assert.strictEqual(spyOnFFSetUseVHRAsFRR.calledWith(true), true, "then setUseSameRequestForValueHelpAndFilterResolution is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getUseSameRequestForValueHelpAndFilterResolution(), true, "then use same as VHR is set to true");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.USESAMEASVHR), true, "then useSameAsVHREvent is fired when use same as VHR is selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when use same as VHR is selected");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForInvisibleToVisibleFilterWithDefaultFunction(assert);
	});
	QUnit.module("Test for a facet filter is visible, multiple selection, has function and value help as Configuration list of values ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setPreselectionFunction("testFunction");
				oModelerInstance.facetFilterUnsaved2.setValueList([ "token1" ]);
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		_assertsForOnLoadOfNewFacetFilter(assert, "label1", "property2");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		assert.strictEqual(spyOnFFGetPreselectionDefaults.called, false, "then check to see if preselection default for facet filter is not available");
		assert.strictEqual(spyOnFFGetPreselectionFn.called, true, "then check to see if preselection function for facet filter is available");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpRadioGroup").getSelectedButton(), oFacetFilterView.byId("idConfigListOfValues"), "then value help of facet filter is set to configuration list of values");
		assert.strictEqual(oFacetFilterView.byId("idVHRVBox").indexOfItem(oFacetFilterView.byId("idVHRView")), -1, "then VHR view is not in FF view");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesLabel").getVisible(), true, "then config list label is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getVisible(), true, "then config list multi input field is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0].getText(), "token1", "then config value list is set with value 'token1'");
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is function and value help changed from configuration list of values to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is function and value help changed from Configuration list of values to value help request", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to none and value help is configuration list of values", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from function to automatic values and value help is configuration list of values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to fixed value and value help is configuration list of values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults fixed value field is required");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForInvisibleToVisibleFilterWithDefaultFunction(assert);
	});
	QUnit.module("Test for a facet filter is visible, single selection, has preselection mode as none and value help as none ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(false);
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, false, oFacetFilterView.byId("idSingleSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getNoneSelection(), true, "then check to see if none for preselection is set by default");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idNoneSelection"), "then none is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When label of facet filter is changed", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.FACETFILTER_LABEL;
		var spyOnFFSetLabelKey = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setLabelKey");
		var spyOnUpdateSelectedNode = sinon.spy(oFacetFilterView.getViewData(), "updateSelectedNode");
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(oFacetFilterView.getViewData(), "updateTitleAndBreadCrumb");
		var oFacetFilterInfoForChange = {
			name : "label2",
			id : oModelerInstance.facetFilterIdUnsaved2
		};
		//action
		oFacetFilterView.byId("idLabel").setValue("label2");
		oFacetFilterView.getController().handleChangeForLabel();
		//assert
		assert.strictEqual(spyOnSetTextOfTextPool.calledWith("label2", oTranslationFormat), true, "then setText is called for change of label");
		assert.strictEqual(spyOnFFSetLabelKey.calledWith("label2"), true, "then setLabelKey is called on change of label");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oFacetFilterInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith(oFacetFilterView.getViewData().getText("facetFilter") + ": " + "label2"), true, "then the title and breadcrumb is updated");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getLabelKey(), "label2", "then the label is set to the facet filter object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When label of facet filter is changed to empty", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.FACETFILTER_LABEL;
		var spyOnFFSetLabelKey = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setLabelKey");
		var spyOnUpdateSelectedNode = sinon.spy(oFacetFilterView.getViewData(), "updateSelectedNode");
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(oFacetFilterView.getViewData(), "updateTitleAndBreadCrumb");
		//action
		oFacetFilterView.byId("idLabel").setValue("");
		oFacetFilterView.getController().handleChangeForLabel();
		//assert
		assert.strictEqual(spyOnSetTextOfTextPool.calledWith("", oTranslationFormat), false, "then setText is not called for change of label");
		assert.strictEqual(spyOnFFSetLabelKey.calledWith(""), false, "then setLabelKey is not called on change of label");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getLabelKey(), "label1", "then the empty label is not set to the facet filter object");
		assert.strictEqual(spyOnUpdateSelectedNode.calledOnce, false, "then the tree node is not updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledOnce, false, "then the title and breadcrumb is not updated");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When suggestions are triggered for label of facet filter", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.FACETFILTER_LABEL;
		var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oTextPool);
		var oSuggestionTextHandlerStub = sinon.stub(sap.apf.modeler.ui.utils, "SuggestionTextHandler", function() {
			return oSuggestionTextHandler;
		});
		var spyOnManageSuggestionTexts = sinon.spy(oSuggestionTextHandler, "manageSuggestionTexts");
		var oEvt = _createEvent();
		//act 
		oFacetFilterView.getController().handleChangeForLabel();
		oFacetFilterView.getController().handleSuggestions(oEvt);
		//assert
		assert.strictEqual(spyOnManageSuggestionTexts.calledOnce, true, "then suggestions are fetched from SuggestionTextHandler");
		assert.strictEqual(spyOnManageSuggestionTexts.calledWith(oEvt, oTranslationFormat), true, "then suggestions are fetched from SuggestionTextHandler for the correct event and translation format");
		//clean up
		spyOnManageSuggestionTexts.restore();
		oSuggestionTextHandlerStub.restore();
	});
	QUnit.test("When property of facet filter is changed", function(assert) {
		//arrange
		var spyOnFFSetProperty = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setProperty");
		//action
		oFacetFilterView.byId("idFFProperty").setSelectedKey("property1");
		oFacetFilterView.getController().handleChangeForProperty();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(spyOnFFSetProperty.calledWith("property1"), true, "then setProperty is called on change of property");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getProperty(), "property1", "then the property is set to the facet filter object");
	});
	QUnit.test("When property of facet filter is changed to empty", function(assert) {
		//arrange
		var spyOnFFSetProperty = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setProperty");
		//action
		oFacetFilterView.byId("idFFProperty").setSelectedKey("");
		oFacetFilterView.getController().handleChangeForProperty();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(spyOnFFSetProperty.calledWith(""), false, "then setProperty is not called on change of property");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getProperty(), "property2", "then the empty property is not set to the facet filter object");
	});
	QUnit.test("When preselection mode is none and value help changed from none to value help request", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from none to automatic selections and value help is none", function(assert) {
		_commonTestOnChangeOfPreSelectionToAutomatic(assert);
	});
	QUnit.test("When preselection mode is none and value help changed from none to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from none to fixed values and value help is none", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection changed from automatic values to fixed values");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults label field is required ");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from none to function and value help is none", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is in valid state fetch getValidationState", function(assert) {
		//assert
		assert.strictEqual(oFacetFilterView.getController().getValidationState(), true, "then facet filter is in valid state");
	});
	QUnit.test("When facet filter is not in valid state fetch getValidationState", function(assert) {
		//action
		oFacetFilterView.byId("idLabel").setValue("");
		//assert
		assert.strictEqual(oFacetFilterView.getController().getValidationState(), false, "then facet filter is not in valid state");
	});
	QUnit.test("When facet filter view data has to be reset then", function(assert) {
		//arrange
		var spyOnGetFacetFilter = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getFacetFilter");
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.getController().updateSubViewInstancesOnReset(oFacetFilterView.getViewData().oConfigurationEditor);
		//assert
		assert.strictEqual(spyOnGetFacetFilter.calledOnce, true, "then facet filter object is fetched after reset");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.UPDATESUBVIEWINSTANCESONRESET), true, "then sub views VHR and FRR are updated with new instances of editor and facet filter objects");
	});
	QUnit.test("When facet filter view is destroyed", function(assert) {
		//arrangement
		var spyDestroyOfVHRView = sinon.spy(oFacetFilterView.byId("idVHRView"), "destroy");
		var spyDestroyOfFRRView = sinon.spy(oFacetFilterView.byId("idFRRView"), "destroy");
		//action
		oFacetFilterView.destroy();
		//assert
		assert.strictEqual(spyDestroyOfVHRView.calledOnce, true, "then destroy is called on VHR view");
		assert.strictEqual(spyDestroyOfFRRView.calledOnce, true, "then destroy is called on FRR view");
	});
	QUnit.test("When facet filters selection mode is changed from single to multiple selection", function(assert) {
		//arrange
		var spyOnFFSetMultiSelection = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setMultiSelection");
		//action
		oFacetFilterView.byId("idSelectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idMultiSelectionMode"));
		oFacetFilterView.getController().handleChangeForSelectionMode();
		//assert
		assert.strictEqual(spyOnFFSetMultiSelection.calledWith(true), true, "then selection mode is set to single");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		_commonTestForInvisibleFilters(assert, "idNoneSelection");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForPreselectionAutomaticValueInvisibleToVisibleFilter(assert, "idNoneSelection");
	});
	QUnit.module("Test for a facet filter is visible, single selection, has automatic values and value help as none ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(false);
				oModelerInstance.facetFilterUnsaved2.setAutomaticSelection(true);
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, false, oFacetFilterView.byId("idSingleSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getAutomaticSelection(), true, "then check to see if automatic selection is set by default");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is automatic values and value help changed from none to value help request", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is automatic values and value help changed from none to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from automatic values to fixed values and value help is none", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection changed from automatic values to fixed values");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults label field is required ");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from automatic values to function and value help is none", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		_commonTestForInvisibleFilters(assert, "idAutomaticSelection");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForPreselectionAutomaticValueInvisibleToVisibleFilter(assert, "idAutomaticSelection");
	});
	QUnit.module("Test for a facet filter is visible, single selection, has automatic values and value help as Value help request ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(false);
				oModelerInstance.facetFilterUnsaved2.setAutomaticSelection(true);
				oModelerInstance.facetFilterUnsaved2.setServiceOfValueHelp("testService1");
				oModelerInstance.facetFilterUnsaved2.setEntitySetOfValueHelp("entitySet1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property3");
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, false, oFacetFilterView.byId("idSingleSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		_assertsForUseVHRASFRR(assert, true, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is automatic values and value help changed from value help request to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is automatic values and value help changed from value help request to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from automatic selection to none and value help is value help request", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from automatic values to fixed values and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults label field is required ");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from automatic values to function and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is automatic values, value help is value help request and use same as VHR checkbox is selected", function(assert) {
		//arrange
		var spyOnFFSetUseVHRAsFRR = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setUseSameRequestForValueHelpAndFilterResolution");
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idUseVHRAsFRRCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForUseVHRAsFRRCheckBox();
		//assert
		assert.strictEqual(spyOnFFSetUseVHRAsFRR.calledWith(true), true, "then setUseSameRequestForValueHelpAndFilterResolution is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getUseSameRequestForValueHelpAndFilterResolution(), true, "then use same as VHR is set to true");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.USESAMEASVHR), true, "then useSameAsVHREvent is fired when use same as VHR is selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when use same as VHR is selected");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		_commonTestForInvisibleFilters(assert, "idAutomaticSelection");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForPreselectionAutomaticValueInvisibleToVisibleFilter(assert, "idAutomaticSelection");
	});
	QUnit.module("Test for a facet filter is visible, single selection, has automatic values and value help as Configuration list of values ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(false);
				oModelerInstance.facetFilterUnsaved2.setAutomaticSelection(true);
				oModelerInstance.facetFilterUnsaved2.setValueList([ "token1" ]);
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, false, oFacetFilterView.byId("idSingleSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpRadioGroup").getSelectedButton(), oFacetFilterView.byId("idConfigListOfValues"), "then value help of facet filter is set to configuration list of values");
		assert.strictEqual(oFacetFilterView.byId("idVHRVBox").indexOfItem(oFacetFilterView.byId("idVHRView")), -1, "then VHR view is not in FF view");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesLabel").getVisible(), true, "then config list label is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getVisible(), true, "then config list multi input field is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0].getText(), "token1", "then config value list is set with value 'token1'");
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When facet filter's configuration value list is set with values", function(assert) {
		// action
		_placeViewAt(oFacetFilterView);
		oFacetFilterView.byId("idConfigListOfValuesMultiInput").setValue("token2");
		oFacetFilterView.getController().handleChangeForConfigListOfValues(_eventCreation("token2"));
		//assert
		assert.strictEqual(spyOnSetValueList.called, true, "then the function to set config value list is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getValueList()[0], "token1", "then config value list is set with array of first value as'token1'");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getValueList()[1], "token2", "then config value list is set with array of second value as 'token2'");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens().length, 2, "then config list multi input field is set with 2 tokens");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0].getText(), "token1", "then config list multi input field's first value is 'token1'");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[1].getText(), "token2", "then config list multi input field's second value is 'token2'");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When facet filter's configured value list is emptied", function(assert) {
		//action
		_placeViewAt(oFacetFilterView);
		var token1 = oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0];
		oFacetFilterView.byId("idConfigListOfValuesMultiInput").removeToken(token1);
		//assert
		assert.strictEqual(spyOnSetValueList.calledWith([]), true, "then setValueList is  called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getValueList(), [], "then configured list of values is changed and set to empty");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When preselection mode is automatic values and value help changed from configuration list of values to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is automatic values and value help changed from Configuration list of values to value help request", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to none and value help is configuration list of values", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from automatic values to fixed values and value help is configuration list of values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults label field is required ");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from automatic values to function and value help is configuration list of values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		_commonTestForInvisibleFilters(assert, "idAutomaticSelection");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForPreselectionAutomaticValueInvisibleToVisibleFilter(assert, "idAutomaticSelection");
	});
	QUnit.module("Test for a facet filter is visible, single selection, has fixed values and value help as none ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(false);
				oModelerInstance.facetFilterUnsaved2.setPreselectionDefaults([ "1000" ]);
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, false, oFacetFilterView.byId("idSingleSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is fixed values and adding more than one default value", function(assert) {
		//arrange
		_placeViewAt(oFacetFilterView);
		var spyOnFFSetPreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setPreselectionDefaults");
		var spyOnRemovePreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionDefaults");
		//action
		oFacetFilterView.getController().handleChangeForPreselectionDefaults(_eventCreation("A"));
		//assert
		assert.strictEqual(spyOnRemovePreselectionDefaults.called, false, "then removePreselectionDefaults is not called");
		assert.strictEqual(spyOnFFSetPreselectionDefaults.called, false, "then setPreselectionDefaults is not called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [ "1000" ], "then preselection defaults is not changed to new value as its a single selection");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getValueState(), sap.ui.core.ValueState.Warning, "Warning displayed when trying to add more than one value");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When preselection mode is fixed values and changing the default value", function(assert) {
		//arrange
		_placeViewAt(oFacetFilterView);
		var spyOnFFSetPreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setPreselectionDefaults");
		var spyOnRemovePreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionDefaults");
		//action
		var token1 = oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0];
		oFacetFilterView.byId("idPreselectionDefaults").removeToken(token1);
		oFacetFilterView.getController().handleChangeForPreselectionDefaults(_eventCreation("A"));
		//assert
		assert.strictEqual(spyOnRemovePreselectionDefaults.called, false, "then removePreselectionDefaults is not called");
		assert.strictEqual(spyOnFFSetPreselectionDefaults.called, true, "then setPreselectionDefaults is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [ "A" ], "then preselection defaults is changed to A");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getValueState(), sap.ui.core.ValueState.None, "No Warning displayed when trying to change the default value");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When preselection mode is fixed values and value help changed from none to value help request", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is fixed values and value help changed from none to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to none and value help is none", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from fixed values to automatic values and value help is none", function(assert) {
		//arrange
		var spyOnRemovePreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionDefaults");
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		var spyOnSetAutomaticSelection = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setAutomaticSelection");
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(spyOnSetAutomaticSelection.calledOnce, true, "then, automatic selection is set");
		assert.strictEqual(spyOnSetAutomaticSelection.calledWith(true), true, "then, automatic selection is called with argument as true");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getAutomaticSelection(), true, "then, automatic selection is applied");
		assert.strictEqual(spyOnRemovePreselectionDefaults.calledOnce, true, "then remove preselection defaults is called");
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then remove preselection function is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [], "then preselection defaults is empty");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to function and value help is none", function(assert) {
		//arrange
		var spyOnRemovePreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionDefaults");
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(spyOnRemovePreselectionDefaults.calledOnce, true, "then remove preselection defaults is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [], "then preselection defaults is empty");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to function and facet filter view is reset after any mandatory fields not filled pop up", function(assert) {
		//arrange
		var oRestoredConfigEditor;
		oFacetFilterView.getViewData().oConfigurationHandler.memorizeConfiguration(oModelerInstance.tempUnsavedConfigId);
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [], "then preselection defaults is empty before reset");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function label field is required before reset");
		//action
		oRestoredConfigEditor = oFacetFilterView.getViewData().oConfigurationHandler.restoreMemorizedConfiguration(oModelerInstance.tempUnsavedConfigId);
		oFacetFilterView.getController().updateSubViewInstancesOnReset(oRestoredConfigEditor);
		oFacetFilterView.getController().setDetailData();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection defaults is selected in preselection mode after reset");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection deafult is set to 1000 after reset");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection default is set to visible after reset");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection default label is set to visible after reset");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then facet filter preselection default label is set to required after reset");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.getController().byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.getController().byId("idFixedValue"), "then fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection deafult is set with token value 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection default is visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection default label is visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		//arrange
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, true, 0);
		assert.strictEqual(spyOnGetText.calledWith("valueHelp"), true, "then value help title invisibility is false" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, true, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter is set to visible");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
	});
	QUnit.module("Test for a facet filter is visible, single selection, has fixed values and value help as Value help request ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(false);
				oModelerInstance.facetFilterUnsaved2.setPreselectionDefaults([ "1000" ]);
				oModelerInstance.facetFilterUnsaved2.setServiceOfValueHelp("testService1");
				oModelerInstance.facetFilterUnsaved2.setEntitySetOfValueHelp("entitySet1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property3");
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, false, oFacetFilterView.byId("idSingleSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		_assertsForUseVHRASFRR(assert, true, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is fixed values and value help changed from value help request to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is fixed values and value help changed from value help request to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to none and value help is value help request", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from fixed values to automatic value values and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to function and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is fixed values, value help is value help request and use same as VHR checkbox is selected", function(assert) {
		//arrange
		var spyOnFFSetUseVHRAsFRR = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setUseSameRequestForValueHelpAndFilterResolution");
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idUseVHRAsFRRCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForUseVHRAsFRRCheckBox();
		//assert
		assert.strictEqual(spyOnFFSetUseVHRAsFRR.calledWith(true), true, "then setUseSameRequestForValueHelpAndFilterResolution is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getUseSameRequestForValueHelpAndFilterResolution(), true, "then use same as VHR is set to true");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when use same as VHR is selected");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is fixed values, value help is value help request and use same as VHR checkbox is selected", function(assert) {
		//arrange
		var spyOnFFSetUseVHRAsFRR = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setUseSameRequestForValueHelpAndFilterResolution");
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idUseVHRAsFRRCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForUseVHRAsFRRCheckBox();
		//assert
		assert.strictEqual(spyOnFFSetUseVHRAsFRR.calledWith(true), true, "then setUseSameRequestForValueHelpAndFilterResolution is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getUseSameRequestForValueHelpAndFilterResolution(), true, "then use same as VHR is set to true");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.USESAMEASVHR), true, "then useSameAsVHREvent is fired when use same as VHR is selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when use same as VHR is selected");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.getController().byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.getController().byId("idFixedValue"), "then fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		//arrange
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		// action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, true, 0);
		assert.strictEqual(spyOnGetText.calledWith("valueHelp"), true, "then value help title invisibility is false" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, true, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter is set to visible");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
	});
	QUnit.module("Test for a facet filter is visible, single selection, has fixed values and value help as Configuration list of values ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(false);
				oModelerInstance.facetFilterUnsaved2.setPreselectionDefaults([ "1000" ]);
				oModelerInstance.facetFilterUnsaved2.setValueList([ "token1" ]);
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, false, oFacetFilterView.byId("idSingleSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpRadioGroup").getSelectedButton(), oFacetFilterView.byId("idConfigListOfValues"), "then value help of facet filter is set to configuration list of values");
		assert.strictEqual(oFacetFilterView.byId("idVHRVBox").indexOfItem(oFacetFilterView.byId("idVHRView")), -1, "then VHR view is not in FF view");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesLabel").getVisible(), true, "then config list label is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getVisible(), true, "then config list multi input field is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0].getText(), "token1", "then config value list is set with value 'token1'");
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is fixed values and value help is configuration list of values and changing the value of config list of values", function(assert) {
		// action
		_placeViewAt(oFacetFilterView);
		oFacetFilterView.byId("idConfigListOfValuesMultiInput").setValue("token2");
		oFacetFilterView.getController().handleChangeForConfigListOfValues(_eventCreation("token2"));
		//assert
		assert.strictEqual(spyOnSetValueList.called, true, "then the function to set config value list is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getValueList()[0], "token1", "then config value list is set with array of first value as'token1'");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getValueList()[1], "token2", "then config value list is set with array of second value as 'token2'");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens().length, 2, "then config list multi input field is set with 2 tokens");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0].getText(), "token1", "then config list multi input field's first value is 'token1'");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[1].getText(), "token2", "then config list multi input field's second value is 'token2'");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When preselection mode is fixed values and value help is configuration list of values and removing the config list of values", function(assert) {
		//action
		_placeViewAt(oFacetFilterView);
		var token1 = oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0];
		oFacetFilterView.byId("idConfigListOfValuesMultiInput").removeToken(token1);
		//assert
		assert.strictEqual(spyOnSetValueList.calledWith([]), true, "then setValueList is  called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved.getValueList(), [], "then configured list of values is changed and set to empty");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfFF'));
	});
	QUnit.test("When preselection mode is fixed values and value help changed from configuration list of values to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is fixed values and value help changed from Configuration list of values to value help request", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to none and value help is configuration list of values", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from fixed values to automatic values and value help is configuration list of values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from fixed values to function and value help is configuration list of values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.getController().byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.getController().byId("idFixedValue"), "then automatic value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		//arrange
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, true, 0);
		assert.strictEqual(spyOnGetText.calledWith("valueHelp"), true, "then value help title invisibility is false" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, true, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter is set to visible");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
	});
	QUnit.module("Test for a facet filter is visible, single selection, has function and value help as none ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(false);
				oModelerInstance.facetFilterUnsaved2.setPreselectionFunction("testFunction");
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, false, oFacetFilterView.byId("idSingleSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		assert.strictEqual(spyOnFFGetPreselectionDefaults.called, false, "then check to see if preselection default for facet filter is not available");
		assert.strictEqual(spyOnFFGetPreselectionFn.called, true, "then check to see if preselection function for facet filter is available");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is function and value of function is changed", function(assert) {
		//arrange
		var spyOnFFSetPreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setPreselectionFunction");
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		//action
		oFacetFilterView.byId("idPreselectionFunction").setValue("testFunction2");
		oFacetFilterView.getController().handleChangeForPreselectionFunction();
		//assert
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then removePreselectionFunction is called");
		assert.strictEqual(spyOnFFSetPreselectionFunction.calledOnce, true, "then setPreselectionFunction is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionFunction(), "testFunction2", "then preselection function is changed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is function and value of function is changed to empty", function(assert) {
		//arrange
		var spyOnFFSetPreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setPreselectionFunction");
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		//action
		oFacetFilterView.byId("idPreselectionFunction").setValue("");
		oFacetFilterView.getController().handleChangeForPreselectionFunction();
		//assert
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then removePreselectionFunction is called");
		assert.strictEqual(spyOnFFSetPreselectionFunction.calledOnce, false, "then setPreselectionFunction is not called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionFunction(), undefined, "then preselection function is changed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is function and value help changed from none to value help request", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is function and value help changed from none to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to none and value help is none", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from function to automatic values and value help is none", function(assert) {
		//arrange
		var spyOnRemovePreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionDefaults");
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		var spyOnSetAutomaticSelection = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setAutomaticSelection");
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(spyOnSetAutomaticSelection.calledOnce, true, "then, automatic selection is set");
		assert.strictEqual(spyOnSetAutomaticSelection.calledWith(true), true, "then, automatic selection is called with argument as true");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getAutomaticSelection(), true, "then, automatic selection is applied");
		assert.strictEqual(spyOnRemovePreselectionDefaults.calledOnce, true, "then remove preselection defaults is called");
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then remove preselection function is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [], "then preselection defaults is empty");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to fixed values and value help is none", function(assert) {
		//arrange
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then remove preselection defaults is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionFunction(), undefined, "then preselection defaults is empty");
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults fixed value field is required");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForInvisibleToVisibleFilterWithDefaultFunction(assert);
	});
	QUnit.module("Test for a facet filter is visible, single selection, has function and value help as Value help request ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(false);
				oModelerInstance.facetFilterUnsaved2.setPreselectionFunction("testFunction");
				oModelerInstance.facetFilterUnsaved2.setServiceOfValueHelp("testService1");
				oModelerInstance.facetFilterUnsaved2.setEntitySetOfValueHelp("entitySet1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property1");
				oModelerInstance.facetFilterUnsaved2.addSelectPropertyOfValueHelp("property3");
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, false, oFacetFilterView.byId("idSingleSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		assert.strictEqual(spyOnFFGetPreselectionDefaults.called, false, "then check to see if preselection default for facet filter is not available");
		assert.strictEqual(spyOnFFGetPreselectionFn.called, true, "then check to see if preselection function for facet filter is available");
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		_assertsForUseVHRASFRR(assert, true, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is function and value help changed from value help request to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to none and value help is configuration list of values", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is function and value help changed from value help request to Configuration list of values", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idConfigListOfValues"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idConfigListOfValues"), true);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to automatic value values and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to fixed values and value help is value help request", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults fixed value field is required");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is function, value help is value help request and use same as VHR checkbox is selected", function(assert) {
		//arrange
		var spyOnFFSetUseVHRAsFRR = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setUseSameRequestForValueHelpAndFilterResolution");
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idUseVHRAsFRRCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForUseVHRAsFRRCheckBox();
		//assert
		assert.strictEqual(spyOnFFSetUseVHRAsFRR.calledWith(true), true, "then setUseSameRequestForValueHelpAndFilterResolution is called");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getUseSameRequestForValueHelpAndFilterResolution(), true, "then use same as VHR is set to true");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.USESAMEASVHR), true, "then useSameAsVHREvent is fired when use same as VHR is selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when use same as VHR is selected");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForInvisibleToVisibleFilterWithDefaultFunction(assert);
	});
	QUnit.module("Test for a facet filter is visible, single selection, has function and value help as Configuration list of values ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(false);
				oModelerInstance.facetFilterUnsaved2.setPreselectionFunction("testFunction");
				oModelerInstance.facetFilterUnsaved2.setValueList([ "token1" ]);
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, false, oFacetFilterView.byId("idSingleSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), false, "then facet filter visibility is false");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		assert.strictEqual(spyOnFFGetPreselectionDefaults.called, false, "then check to see if preselection default for facet filter is not available");
		assert.strictEqual(spyOnFFGetPreselectionFn.called, true, "then check to see if preselection function for facet filter is available");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpRadioGroup").getSelectedButton(), oFacetFilterView.byId("idConfigListOfValues"), "then value help of facet filter is set to configuration list of values");
		assert.strictEqual(oFacetFilterView.byId("idVHRVBox").indexOfItem(oFacetFilterView.byId("idVHRView")), -1, "then VHR view is not in FF view");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesLabel").getVisible(), true, "then config list label is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getVisible(), true, "then config list multi input field is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idConfigListOfValuesMultiInput").getTokens()[0].getText(), "token1", "then config value list is set with value 'token1'");
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(spyOnFFGetUseVHRAsFRR.called, false, "then use VHR as FRR is not set");
	});
	QUnit.test("When preselection mode is function and value help changed from configuration list of values to none", function(assert) {
		//action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idVHNone"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, false, false);
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is function and value help changed from Configuration list of values to value help request", function(assert) {
		// action
		oFacetFilterView.byId("idValueHelpRadioGroup").setSelectedButton(oFacetFilterView.byId("idValueHelpRequest"));
		oFacetFilterView.getController().handleChangeForValueHelpOption();
		//assert
		_assertsForUseVHRASFRR(assert, true, false);
		_assertsForValueHelpRequest(assert, 0, true);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idValueHelpRequest"), false);
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to none and value help is configuration list of values", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from function to automatic values and value help is configuration list of values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idAutomaticSelection"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to fixed value and value help is configuration list of values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults fixed value field is required");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oFacetFilterView, "fireEvent");
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(true);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsForInvisiblefilters(assert, false, -1);
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title invisibility is true" );
		_assertsOfCommonVisibleOrInVisiblefilters(assert, false, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		assert.strictEqual(oFacetFilterView.byId("idUseVHRAsFRRCheckBox").getSelected(), false, "then use same as VHR checkbox is not selected");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.ENABLEDISABLEFRRFIELDS), true, "then enableDisableFRRFieldsEvent is fired when facet filter is invisible");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.DONOTSHOWATRUNTIME), true, "then doNotShowAtRuntimeEvent is fired when facet filter is invisible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to invisible and changed to visible", function(assert) {
		_commonTestForInvisibleToVisibleFilterWithDefaultFunction(assert);
	});
	QUnit.module("Test for a facet filter is invisible and has preselection mode as none", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setInvisible();
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), true, "then facet filter visibility is true");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getNoneSelection(), true, "then check to see if none is set by default for preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idNoneSelection"), "then none is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title is set to invisible");
		assert.strictEqual(oFacetFilterView.byId("idValueHelp").getVisible(), false, "then value help radio group is not visible");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(oFacetFilterView.byId("idFRRVBox").indexOfItem(oFacetFilterView.byId("idFRRView")), -1, "then FRR view is removed from FF view");
	});
	QUnit.test("When preselection mode is changed from none to automatic selection", function(assert) {
		_commonTestForChangeOfPreSelectionToAutomaticForInvisibleFilter(assert);
	});
	QUnit.test("When preselection mode is changed from none to fixed values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults label field is required ");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title is set to invisible");
		assert.strictEqual(oFacetFilterView.byId("idValueHelp").getVisible(), false, "then value help radio group is not visible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from none to function", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title is set to invisible");
		assert.strictEqual(oFacetFilterView.byId("idValueHelp").getVisible(), false, "then value help radio group is not visible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to visible", function(assert) {
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsToCheckVisibility(assert);
		_assertsOfCommonVisibleOrInVisiblefilters(assert, true, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idNoneSelection"), "then none is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.module("Test for a facet filter is invisible and has automatic values", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setAutomaticSelection(true);
				oModelerInstance.facetFilterUnsaved2.setInvisible();
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), true, "then facet filter visibility is true");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getAutomaticSelection(), true, "then check to see if automatic selection is set by default");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title is set to invisible");
		assert.strictEqual(oFacetFilterView.byId("idValueHelp").getVisible(), false, "then value help radio group is not visible");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(oFacetFilterView.byId("idFRRVBox").indexOfItem(oFacetFilterView.byId("idFRRView")), -1, "then FRR view is removed from FF view");
	});
	QUnit.test("When preselection mode is changed from automatic selection to none", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from automatic values to fixed values", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		_assertsForPreSelectionFunction(assert, false, "");
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults label field is required ");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title is set to invisible");
		assert.strictEqual(oFacetFilterView.byId("idValueHelp").getVisible(), false, "then value help radio group is not visible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from automatic values to function", function(assert) {
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title is set to invisible");
		assert.strictEqual(oFacetFilterView.byId("idValueHelp").getVisible(), false, "then value help radio group is not visible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to visible", function(assert) {
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsToCheckVisibility(assert);
		_assertsOfCommonVisibleOrInVisiblefilters(assert, true, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idAutomaticSelection"), "then automatic selection is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.module("Test for a facet filter is invisible and has fixed values", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setPreselectionDefaults([ "1000" ]);
				oModelerInstance.facetFilterUnsaved2.setInvisible();
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), true, "then facet filter visibility is true");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getAutomaticSelection(), false, "then check to see if automatic selection is not set");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title is set to invisible");
		assert.strictEqual(oFacetFilterView.byId("idValueHelp").getVisible(), false, "then value help radio group is not visible");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(oFacetFilterView.byId("idFRRVBox").indexOfItem(oFacetFilterView.byId("idFRRView")), -1, "then FRR view is removed from FF view");
	});
	QUnit.test("When preselection mode is changed from fixed values to none", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from fixed values to automatic values", function(assert) {
		_commonTestForChangeOfPreSelectionToAutomaticForInvisibleFilter(assert);
	});
	QUnit.test("When preselection mode is changed from fixed values to function and value help is none", function(assert) {
		//arrange
		var spyOnRemovePreselectionDefaults = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionDefaults");
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFunction"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(spyOnRemovePreselectionDefaults.calledOnce, true, "then remove preselection defaults is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionDefaults(), [], "then preselection defaults is empty");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionFunctionLabel").getRequired(), true, "then preselection defaults function field is required");
		assert.strictEqual(oFacetFilterView.byId("idValueHelp").getVisible(), false, "then value help radio group is not visible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When facet filter is set to visible", function(assert) {
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsToCheckVisibility(assert);
		_assertsOfCommonVisibleOrInVisiblefilters(assert, true, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFixedValue"), "then preselection fixed value is selected in preselection mode");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getTokens()[0].getText(), "1000", "then facet filter preselection defaults is set to 1000");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaults").getVisible(), true, "then facet filter preselection defaults is set to visible");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getVisible(), true, "then facet filter preselection defaults label is set to visible");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.module("Test for a facet filter is invisible and has function", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesWhileOnLoadOfFacetFilter(oModelerInstance);
				oModelerInstance.facetFilterUnsaved2.setMultiSelection(true);
				oModelerInstance.facetFilterUnsaved2.setPreselectionFunction("testFunction");
				oModelerInstance.facetFilterUnsaved2.setInvisible();
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized", function(assert) {
		//assert
		_assertsForOnLoadOfFacetFilter(assert, true, oFacetFilterView.byId("idMultiSelectionMode"));
		assert.strictEqual(oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").getSelected(), true, "then facet filter visibility is true");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getAutomaticSelection(), false, "then check to see if automatic selection is set by default");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		assert.strictEqual(spyOnFFGetPreselectionFn.called, true, "then check to see if preselection function for facet filter is available");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title is set to invisible");
		assert.strictEqual(oFacetFilterView.byId("idValueHelp").getVisible(), false, "then value help radio group is not visible");
		_assertsForValueHelpRequest(assert, -1, false);
		_assertsForConfigListIfValues(assert, oFacetFilterView.byId("idVHNone"), false);
		_assertsForUseVHRASFRR(assert, false, false);
		assert.strictEqual(oFacetFilterView.byId("idFRRVBox").indexOfItem(oFacetFilterView.byId("idFRRView")), -1, "then FRR view is removed from FF view");
	});
	QUnit.test("When preselection mode is changed from function to none", function(assert) {
		_commonTestOnChangeOfPreselectionModeToNone(assert);
	});
	QUnit.test("When preselection mode is changed from function to fixed values", function(assert) {
		//arrange
		var spyOnRemovePreselectionFunction = sinon.spy(oModelerInstance.facetFilterUnsaved2, "removePreselectionFunction");
		//action
		oFacetFilterView.byId("idPreselectionModeRadioGroup").setSelectedButton(oFacetFilterView.byId("idFixedValue"));
		oFacetFilterView.getController().handleChangeForPreselectionMode();
		//assert
		assert.strictEqual(spyOnRemovePreselectionFunction.calledOnce, true, "then remove preselection defaults is called");
		assert.deepEqual(oModelerInstance.facetFilterUnsaved2.getPreselectionFunction(), undefined, "then preselection defaults is empty");
		_assertsForPreSelectionDefault(assert, true, "");
		assert.strictEqual(oFacetFilterView.byId("idPreselectionDefaultsLabel").getRequired(), true, "then preselection defaults fixed value field is required");
		_assertsForPreSelectionFunction(assert, false, "");
		assert.strictEqual(oFacetFilterView.byId("idValueHelpTitle").getText(), "", "then value help title is set to invisible");
		assert.strictEqual(oFacetFilterView.byId("idValueHelp").getVisible(), false, "then value help radio group is not visible");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When preselection mode is changed from function to automatic values", function(assert) {
		_commonTestForChangeOfPreSelectionToAutomaticForInvisibleFilter(assert);
	});
	QUnit.test("When facet filter is set to visible", function(assert) {
		//action
		oFacetFilterView.byId("idDoNotShowAtRuntimeCheckBox").setSelected(false);
		oFacetFilterView.getController().handleChangeForVisibilityAtRuntime();
		//assert
		_assertsToCheckVisibility(assert);
		_assertsOfCommonVisibleOrInVisiblefilters(assert, true, true);
		assert.strictEqual(oFacetFilterView.byId("idPreselectionModeRadioGroup").getSelectedButton(), oFacetFilterView.byId("idFunction"), "then function is selected as preselection mode");
		_assertsForPreSelectionDefault(assert, false, "");
		_assertsForPreSelectionFunction(assert, true, "testFunction");
		assert.strictEqual(spyOnFFGetPreselectionFn.called, true, "then check to see if preselection function for facet filter is available");
	});
	QUnit.module("Test for an existing facet filter property - Validate previously selected properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
				//Stub getFilterablePropertiesAndParametersAsPromise with invalid property values Eg-Due to metadata changes the values are no more available
				spyOnGetFilterablePropertiesAndParametersAsPromise = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getFilterablePropertiesAndParametersAsPromise", function() {
					return sap.apf.utils.createPromise([ "property1", "property3", "property4" ]);
				});
				oFacetFilterView = _instantiateView(oModelerInstance.facetFilterIdUnsaved2, assert);
				done();
			});
		},
		afterEach : function() {
			oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
			oModelerInstance.configurationEditorForUnsavedConfig.getFilterablePropertiesAndParametersAsPromise.restore();
			oFacetFilterView.destroy();
		}
	});
	QUnit.test("When facet filter is initialized and previously selected property does not exist anymore in the available properties", function(assert) {
		//arrange
		var oDataForValidInvalidProperties = {
			"Objects" : [ {
				key : "Not Available: property2",
				name : "Not Available: property2"
			}, {
				key : "property1",
				name : "property1"
			}, {
				key : "property3",
				name : "property3"
			}, {
				key : "property4",
				name : "property4"
			} ]
		};
		//assert
		assert.strictEqual(oFacetFilterView.byId("idFFProperty").getSelectedKey(), "Not Available: property2", "then property for facet filter is displayed which is invalid sinec its not available");
		assert.deepEqual(oFacetFilterView.byId("idFFProperty").getModel().getData(), oDataForValidInvalidProperties, "then model data for property for facet filter is set");
		assert.strictEqual(oFacetFilterView.byId("idFFPropertyLabel").getRequired(), true, "then facet filter label is set required");
		assert.strictEqual(spyOnGetFilterablePropertiesAndParametersAsPromise.calledOnce, true, "then all known properties are fetched");
	});
	QUnit.test("When property of facet filter is changed to a currently not available property", function(assert) {
		//arrange
		var spyOnFFSetProperty = sinon.spy(oModelerInstance.facetFilterUnsaved2, "setProperty");
		//action
		oFacetFilterView.byId("idFFProperty").setSelectedKey("Not Available: property1");
		oFacetFilterView.getController().handleChangeForProperty();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(spyOnFFSetProperty.calledWith("property1"), true, "then setProperty is called on change of property after removing the prefix text");
		assert.strictEqual(oModelerInstance.facetFilterUnsaved2.getProperty(), "property1", "then the property is set to the facet filter object");
	});
}());