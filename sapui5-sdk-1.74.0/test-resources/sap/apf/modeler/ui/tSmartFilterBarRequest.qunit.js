/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tSmartFilterBarRequest');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	'use strict';
	var oSFBRequestView, smartFilterBarInstance,spyOnGetAllEntitySetsExceptParameterEntitySets, spyOnGetServiceOfSFB, 
	    spyOnGetEntitySetOfSFB, spyOnConfigEditorRegisterService, spyOnSetServiceOfSFB, spyOnSetEntitySetOfSFB, 
	    spyOnConfigEditorSetIsUnsaved, oModelerInstance;
	function _doNothing() {
		return "";
	}
	function _placeViewAt(oSFBView) {
		var divToPlaceSmartFilter = document.createElement("div");
		divToPlaceSmartFilter.setAttribute('id', 'contentOfSFB');
		document.body.appendChild(divToPlaceSmartFilter);
		oSFBView.placeAt("contentOfSFB");
		sap.ui.getCore().applyChanges();
	}
	function _instantiateView(assert) {
		var oView;
		var oSFBRequestController = new sap.ui.controller("sap.apf.modeler.ui.controller.smartFilterBarRequest");
		var spyOnInit = sinon.spy(oSFBRequestController, "onInit");
		var spyOnBeforeRender = sinon.spy(oSFBRequestController, "onBeforeRendering");
		var spyOnAfterRender = sinon.spy(oSFBRequestController, "onAfterRendering");
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnConfigEditorRegisterService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "registerServiceAsPromise");
		spyOnGetServiceOfSFB = sinon.spy(smartFilterBarInstance, "getService");
		spyOnGetEntitySetOfSFB = sinon.spy(smartFilterBarInstance, "getEntitySet");
		spyOnSetServiceOfSFB = sinon.spy(smartFilterBarInstance, "setService");
		spyOnSetEntitySetOfSFB = sinon.spy(smartFilterBarInstance, "setEntitySet");
		oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.requestOptions",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oSFBRequestController,
			viewData : {
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oTextReader : oModelerInstance.modelerCore.getText,
				oParentObject : smartFilterBarInstance,
				getCalatogServiceUri : _doNothing
			}
		});
		_placeViewAt(oView);
		assert.strictEqual(spyOnInit.calledOnce, true, "then request options onInit function is called and view is initialized");
		assert.strictEqual(spyOnBeforeRender.called, true, "then SFB request onBeforeRender function is called");
		assert.strictEqual(spyOnAfterRender.called, true, "then SFB request onAfterRender function is called");
		return oView;
	}
	function _destroyResources() {
		document.body.removeChild(document.getElementById('contentOfSFB'));
		oSFBRequestView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oSFBRequestView.getViewData().oConfigurationEditor.registerServiceAsPromise.restore();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oModelerInstance.reset();
		oSFBRequestView.destroy();
	}
	QUnit.module("For an existing smart filter", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				//create SFB
				oModelerInstance.configurationEditorForUnsavedConfig.setFilterOption({
					smartFilterBar : true
				});
				smartFilterBarInstance = oModelerInstance.configurationEditorForUnsavedConfig.getSmartFilterBar();
				smartFilterBarInstance.setService("testService1");
				smartFilterBarInstance.setEntitySet("entitySet1");
				spyOnGetAllEntitySetsExceptParameterEntitySets = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsExceptParameterEntitySets");
				oSFBRequestView = _instantiateView(assert);
				done();
			});
		},
		afterEach : function() {
			oSFBRequestView.getViewData().oConfigurationEditor.getAllEntitySetsExceptParameterEntitySets.restore();
			_destroyResources();
		}
	});
	QUnit.test("When SFB view is initialized", function(assert) {
		//arrange
		var oController = oSFBRequestView.getController();
		var oModelForSFBEntitySet = {
			"Objects" : [ {
				"key" : "entitySet1",
				"name" : "entitySet1"
			}, {
				"key" : "entitySet2",
				"name" : "entitySet2"
			} ]
		};
		//assert
		assert.ok(oSFBRequestView, "then SFB Request view is available");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfSFB.calledOnce, true, "then SFB service is got from the SFB object");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then SFB source field is populated");
		// entity type section asserts
		assert.strictEqual(spyOnGetEntitySetOfSFB.calledOnce, true, "then SFB entity type is got from the SFB object");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then SFB entity type label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet1", "then SFB entity types field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForSFBEntitySet, "then SFB entity types field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsExceptParameterEntitySets.calledOnce, true, "then all entity types are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsExceptParameterEntitySets.calledWith(oSFBRequestView.byId("idSource").getValue()), true, "then entity types are fetched for the correct service");
		// property visibility asserts
		assert.strictEqual(oSFBRequestView.byId("idSelectProperties").getVisible(), false, "then property box is not visible");
		assert.strictEqual(oSFBRequestView.byId("idSelectPropertiesLabel").getVisible(), false, "then property label is not visible");
	});
	QUnit.test("When source is changed", function(assert) {
		//arrangement
		var oModelForSFBEntitySet = {
			"Objects" : [ {
				"key" : "Not Available: entitySet1",
				"name" : "Not Available: entitySet1"
			}, {
				"key" : "entitySet3",
				"name" : "entitySet3"
			} ]
		};
		//action
		oSFBRequestView.byId("idSource").setValue("testService2");
		oSFBRequestView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oSFBRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService2"), true, "then SFB service is checked for registration");
		oSFBRequestView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService2").done(function(result){
			assert.strictEqual(result, true, "then SFB service is valid service");	
		});
		
		assert.strictEqual(spyOnSetServiceOfSFB.calledWith("testService2"), true, "then setService is called on smart filter bar object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getService(), "testService2", "then service of SFB is changed");
		//for entity type
		assert.strictEqual(spyOnSetEntitySetOfSFB.calledWith("entitySet1"), true, "then setEntitySet is called the smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getEntitySet(), "entitySet1", "then entity set of SFB is changed");
		assert.strictEqual(oSFBRequestView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then SFB entity field is populated");
		assert.deepEqual(oSFBRequestView.byId("idEntity").getModel().getData(), oModelForSFBEntitySet, "then SFB entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsExceptParameterEntitySets.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsExceptParameterEntitySets.calledWith("testService2"), true, "then entity types are fetched for the correct service");
	});
	QUnit.test("When source selected from value help in the input field", function(assert) {
		//action
		oSFBRequestView.byId("idSource").fireValueHelpRequest();
		sap.ui.getCore().applyChanges();
		var oSelectDialog = oSFBRequestView.byId("idCatalogServiceView").byId("idGatewayCatalogListDialog");
		//assert
		assert.ok(oSelectDialog, "Select dialog exists after firing value help request");
		assert.strictEqual(oSelectDialog.getTitle(), "Select Service", "Exisitng select dialog is the Gateway select service dialog");
		//cleanups
		oSelectDialog.destroy();
	});
	QUnit.test("When source is cleared", function(assert) {
		//action
		oSFBRequestView.byId("idSource").setValue("");
		oSFBRequestView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oSFBRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith(""), false, "then empty SFB service is not checked for registration");
		assert.strictEqual(spyOnSetServiceOfSFB.calledWith(undefined), true, "then setService is called on smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getService(), undefined, "then service of SFB is changed");
		//for entity type
		assert.strictEqual(spyOnSetEntitySetOfSFB.calledWith(undefined), true, "then setEntitysetOfSFB is called the smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getEntitySet(), "", "then entity set of SFB is changed");
		assert.strictEqual(oSFBRequestView.byId("idEntity").getSelectedKey(), "", "then SFB entity type field is populated");
		assert.strictEqual(oSFBRequestView.getController().byId("idEntityLabel").getRequired(), false, "then SFB entity type label field is set as not required");
		assert.deepEqual(oSFBRequestView.byId("idEntity").getModel(), undefined, "then SFB entity type field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsExceptParameterEntitySets.calledWith(""), false, "then entity types are not fetched for the empty service");
	});
	QUnit.test("When source is changed to an invalid service", function(assert) {
		//action
		oSFBRequestView.byId("idSource").setValue("test1");
		oSFBRequestView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oSFBRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("test1"), true, "then SFB service is checked for registration");
		oSFBRequestView.getViewData().oConfigurationEditor.registerServiceAsPromise("test11").done(function(result){
			assert.strictEqual(result, undefined, "then SFB service is an invalid service");
		});
		
		assert.strictEqual(spyOnSetServiceOfSFB.calledWith(undefined), true, "then setService is called on smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getService(), undefined, "then service of SFB is changed");
		//for entity type
		assert.strictEqual(spyOnSetEntitySetOfSFB.calledWith(undefined), true, "then setEntitySet is called the smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getEntitySet(), "", "then entity set of SFB is changed");
		assert.strictEqual(oSFBRequestView.byId("idEntity").getSelectedKey(), "", "then SFB entity set field is populated");
		assert.strictEqual(oSFBRequestView.getController().byId("idEntityLabel").getRequired(), false, "then SFB entity type label field is set as not required");
		assert.deepEqual(oSFBRequestView.byId("idEntity").getModel(), undefined, "then SFB entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsExceptParameterEntitySets.calledWith(""), false, "then entity types are not fetched for the empty service");
	});
	QUnit.test("When entity type is changed", function(assert) {
		//action
		oSFBRequestView.byId("idEntity").setSelectedKey("entitySet2");
		oSFBRequestView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oSFBRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity type
		assert.strictEqual(spyOnSetEntitySetOfSFB.calledWith("entitySet2"), true, "then setEntitySet is called the smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getEntitySet(), "entitySet2", "then entity type of SFB is changed");
		assert.strictEqual(oSFBRequestView.byId("idEntity").getSelectedKey(), "entitySet2", "then SFB entity type field is populated");
	});
	QUnit.test("Fetching validation state while view is valid", function(assert) {
		//assert
		assert.strictEqual(oSFBRequestView.getController().getValidationState(), true, "then SFB view is in valid state");
	});
	QUnit.test("Fetching validation state while view is not valid", function(assert) {
		//action
		oSFBRequestView.byId("idEntity").clearSelection();
		//assert
		assert.strictEqual(oSFBRequestView.getController().getValidationState(), false, "then SFB view is not in valid state");
	});
	QUnit.test("When source displays suggestion items", function(assert) {
		//arrangement
		var sourceInputControl = oSFBRequestView.byId("idSource");
		var oEventParameters = {
			suggestValue : "test"
		};
		var aExistingServices = oModelerInstance.configurationEditorForUnsavedConfig.getAllServices();
		//action
		sourceInputControl.fireSuggest(oEventParameters);
		aExistingServices.forEach(function(existingService, index){
			assert.deepEqual(sourceInputControl.getModel().getData().Objects[index].key, existingService, "Model filled with possible suggestionItem - key, index: " + index);
			assert.deepEqual(sourceInputControl.getModel().getData().Objects[index].name, existingService, "Model filled with possible suggestionItem - name, index: " + index);
		});
		assert.strictEqual(sourceInputControl.getSuggestionItems().length, 6, "SuggestItems from model filtered");
		assert.strictEqual(sourceInputControl.getSuggestionItems()[0].getText(), "testService1", "SuggestionItems correctly filtered");	
	});
	QUnit.module("For a smart filter with no service and entity type", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				//create SFB
				oModelerInstance.configurationEditorForUnsavedConfig.setFilterOption({
					smartFilterBar : true
				});
				smartFilterBarInstance = oModelerInstance.configurationEditorForUnsavedConfig.getSmartFilterBar();
				spyOnGetAllEntitySetsExceptParameterEntitySets = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsExceptParameterEntitySets");
				oSFBRequestView = _instantiateView(assert);
				done();
			});
		},
		afterEach : function() {
			oSFBRequestView.getViewData().oConfigurationEditor.getAllEntitySetsExceptParameterEntitySets.restore();
			_destroyResources();
		}
	});
	QUnit.test("When SFB view is initialized", function(assert) {
		//arrange
		var oController = oSFBRequestView.getController();
		//assert
		assert.ok(oSFBRequestView, "then SFB Request view is available");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfSFB.calledOnce, true, "then SFB service is got from the SFB object");
		assert.strictEqual(oController.byId("idSource").getValue(), "", "then SFB source field is populated");
		// entity type section asserts
		assert.strictEqual(spyOnGetEntitySetOfSFB.calledOnce, false, "then SFB entity set is not got from the SFB object");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), false, "then SFB entity type label field is not set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "", "then SFB entity types field is not populated");
		assert.deepEqual(oController.byId("idEntity").getModel(), undefined, "then SFB entity types field model is not set");
		assert.strictEqual(spyOnGetAllEntitySetsExceptParameterEntitySets.calledOnce, false, "then all entity types are not fetched for the empty service");
		assert.strictEqual(spyOnGetAllEntitySetsExceptParameterEntitySets.calledWith(oSFBRequestView.byId("idSource").getValue()), false, "then entity types are not fetched for the empty service");
		// property visibility asserts
		assert.strictEqual(oSFBRequestView.byId("idSelectProperties").getVisible(), false, "then property box is disabled");
		assert.strictEqual(oSFBRequestView.byId("idSelectPropertiesLabel").getVisible(), false, "then property label is disabled");
	});
	QUnit.module("For an existing Smart filter  - Validate previously selected entity sets", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				//create SFB
				oModelerInstance.configurationEditorForUnsavedConfig.setFilterOption({
					smartFilterBar : true
				});
				smartFilterBarInstance = oModelerInstance.configurationEditorForUnsavedConfig.getSmartFilterBar();
				smartFilterBarInstance.setService("testService1");
				smartFilterBarInstance.setEntitySet("entitySet1");
				//Stub getAllEntitySetsOfService with an invalid entity set.Eg-Due to metadata changes the previously selected entity set is no more available
				spyOnGetAllEntitySetsExceptParameterEntitySets = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsExceptParameterEntitySets", function() {
					return sap.apf.utils.createPromise([ "entitySet2" ]); //entitySet1 is no more available
				});
				oSFBRequestView = _instantiateView(assert);
				done();
			});
		},
		afterEach : function() {
			oSFBRequestView.getViewData().oConfigurationEditor.getAllEntitySetsExceptParameterEntitySets.restore();
			_destroyResources();
		}
	});
	QUnit.test("When SFB view is initialized and previously selected entity set does not exist anymore in the available entity sets", function(assert) {
		//arrange
		var oController = oSFBRequestView.getController();
		var oModelForSFBEntitySet = {
			"Objects" : [ {
				"key" : "Not Available: entitySet1",
				"name" : "Not Available: entitySet1"
			}, {
				"key" : "entitySet2",
				"name" : "entitySet2"
			} ]
		};
		//assert
		assert.ok(oSFBRequestView, "then SFB Request view is available");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfSFB.calledOnce, true, "then SFB service is got from the SFB object");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then SFB source field is populated");
		// entity type section asserts
		assert.strictEqual(spyOnGetEntitySetOfSFB.calledOnce, true, "then SFB entity set is got from the SFB object");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then SFB entity type label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then SFB entity types field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForSFBEntitySet, "then SFB entity types field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsExceptParameterEntitySets.calledOnce, true, "then all entity types are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsExceptParameterEntitySets.calledWith(oSFBRequestView.byId("idSource").getValue()), true, "then entity types are fetched for the correct service");
		// property visibility asserts
		assert.strictEqual(oSFBRequestView.byId("idSelectProperties").getVisible(), false, "then property box is not visible");
		assert.strictEqual(oSFBRequestView.byId("idSelectPropertiesLabel").getVisible(), false, "then property label is not visible");
	});
	QUnit.test("When source is changed and there are few common entity sets between new and previous source", function(assert) {
		//arrangement
		smartFilterBarInstance.setEntitySet("entitySet2");
		//arrangement
		var oModelForSFBEntitySet = {
			"Objects" : [ {
				"key" : "entitySet2",
				"name" : "entitySet2"
			} ]
		};
		//action
		oSFBRequestView.byId("idSource").setValue("testService3");
		oSFBRequestView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oSFBRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService3"), true, "then SFB service is checked for registration");
		oSFBRequestView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService3").done(function(result){
			assert.strictEqual(result, true, "then SFB service is valid service");	
		});
		
		assert.strictEqual(spyOnSetServiceOfSFB.calledWith("testService3"), true, "then setService is called on smart filter bar object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getService(), "testService3", "then service of SFB is changed");
		//for entity type
		assert.strictEqual(spyOnSetEntitySetOfSFB.calledWith("entitySet2"), true, "then setEntitySet is called the smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getEntitySet(), "entitySet2", "then entity set of SFB is changed");
		assert.strictEqual(oSFBRequestView.byId("idEntity").getSelectedKey(), "entitySet2", "then SFB entity field is populated");
		assert.deepEqual(oSFBRequestView.byId("idEntity").getModel().getData(), oModelForSFBEntitySet, "then SFB entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsExceptParameterEntitySets.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsExceptParameterEntitySets.calledWith("testService3"), true, "then entity types are fetched for the correct service");
	});
	QUnit.test("When entity set of facet filter is changed to a currently not available entity set", function(assert) {
		//action
		oSFBRequestView.byId("idEntity").setSelectedKey("Not Available: entitySet1");
		oSFBRequestView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oSFBRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfSFB.calledWith("entitySet1"), true, "then EntitySet1", "then entity set of FRR is changed");
		assert.strictEqual(oSFBRequestView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then FRR entity field is populated");
	});
}());
