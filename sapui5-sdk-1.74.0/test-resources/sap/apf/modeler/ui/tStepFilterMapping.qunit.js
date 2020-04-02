/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tStepFilterMapping');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.modeler.ui.utils.stepPropertyMetadataHandler");
jQuery.sap.require("sap.apf.testhelper.doubles.messageHandler");
jQuery.sap.require("sap.apf.modeler.core.step");
(function() {
	'use strict';
	var oStepFilterMappingView;
	var spyOnGetText;
	var spyOnGetFilterMappingService;
	var spyOnGetAllPropertiesOfEntitySet;
	var spyOnGetFilterMappingEntitySet;
	var spyOnGetAllEntitySetsOfServiceWithGivenProperties;
	var spyOnGetFilterMappingTargetProperties;
	var spyOnConfigEditorRegisterService;
	var spyOnSetFilterMappingService;
	var spyOnSetFilterMappingEntitySet;
	var spyOnAddFilterMappingTargetProperty;
	var spyOnConfigEditorSetIsUnsaved;
	var spyOnRemoveFilterMappingTargetProperty;
	var oModelerInstance;

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
	function _doNothing() {
		return "";
	}
	function _createEvent() {
		return {
			getSource : function() {
				return oInputControl;
			},
			getParameter : function(parameterName) {
				if (parameterName === "suggestValue") {
					return "test";
				}
			}
		};
	}
	function _commonSpiesInBeforeEach() {
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnConfigEditorRegisterService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "registerServiceAsPromise");
		spyOnGetAllEntitySetsOfServiceWithGivenProperties = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsOfServiceWithGivenPropertiesAsPromise");
		spyOnGetAllPropertiesOfEntitySet = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllPropertiesOfEntitySetAsPromise");
		spyOnGetFilterMappingService = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "getFilterMappingService");
		spyOnGetFilterMappingEntitySet = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "getFilterMappingEntitySet");
		spyOnGetFilterMappingTargetProperties = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "getFilterMappingTargetProperties");
		spyOnSetFilterMappingService = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setFilterMappingService");
		spyOnSetFilterMappingEntitySet = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "setFilterMappingEntitySet");
		spyOnAddFilterMappingTargetProperty = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "addFilterMappingTargetProperty");
		spyOnRemoveFilterMappingTargetProperty = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping, "removeFilterMappingTargetProperty");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
	}
	function _commonCleanUpsInAfterEach() {
		oStepFilterMappingView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oStepFilterMappingView.getViewData().oConfigurationEditor.registerServiceAsPromise.restore();
		oStepFilterMappingView.getViewData().oConfigurationEditor.getAllEntitySetsOfServiceWithGivenPropertiesAsPromise.restore();
		oStepFilterMappingView.getViewData().oConfigurationEditor.getAllPropertiesOfEntitySetAsPromise.restore();
		spyOnGetText.restore();
		oModelerInstance.reset();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oStepFilterMappingView.destroy();
	}
	function _instantiateView(oStep, assert) {
		var oStepFilterMappingController = new sap.ui.controller("sap.apf.modeler.ui.controller.stepFilterMapping");
		var spyOnInit = sinon.spy(oStepFilterMappingController, "onInit");
		oStepFilterMappingView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.requestOptions",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oStepFilterMappingController,
			viewData : {
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oTextReader : oModelerInstance.modelerCore.getText,
				oParentObject : oStep,
				getCalatogServiceUri : _doNothing,
				oStepPropertyMetadataHandler : {
					getFilterMappingEntityTypeMetadataAsPromise : function(){
						return  jQuery.Deferred().resolve({
							getPropertyMetadata : function(propertyName){
								return {};
							}
						});
					},
					getDefaultLabel : function(entityTypeMetadata, oText) {
						return oText;
					}
				}
			}
		});
		assert.strictEqual(spyOnInit.calledOnce, true, "then request options onInit function is called and view is initialized");
		return oStepFilterMappingView;
	}
	QUnit.module("For a step with existing filter mapping service", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				oStepFilterMappingView = _instantiateView(oModelerInstance.unsavedStepWithFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When updateFilterMappingFields is called", function(assert) {
		var oController = oStepFilterMappingView.getController();
		oController.updateFilterMappingFields();
		assert.strictEqual(oController.byId("idSource").getValue(), "testService4", "then step filter mapping source field is populated");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet10", "then step filter mapping entity field is populated");
		assert.deepEqual(oController.byId("idOptionalRequestField").getSelectedKey(), "property1", "then step filter mapping selected properties field are populated");
	});
	QUnit.test("When stepFilterMapping view is initialized", function(assert) {
		//arrange
		var oController = oStepFilterMappingView.getController();
		var oModelForEntity = {
			"Objects" : [ {
				"key" : "entitySet10",
				"name" : "entitySet10"
			}, {
				"key" : "entitySet4",
				"name" : "entitySet4"
			} ]
		};
		var oModelForProperty = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property3",
				"name" : "property3"
			}, {
				"key" : "property13",
				"name" : "property13"
			} ]
		};
		//assert
		assert.ok(oStepFilterMappingView, "then stepFilterMapping view is available");
		// source section asserts
		assert.strictEqual(spyOnGetFilterMappingService.callCount, 4, "then service for step filter mapping is retrieved from the step object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then step filter mapping source label is populated");
		assert.strictEqual(spyOnGetText.calledWith("source"), true, "then step filter mapping source label is set correctly");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService4", "then step filter mapping source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetFilterMappingEntitySet.callCount, 4, "then step filter mapping entity set is retrieved from the step object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then step filter mapping entity label is populated");
		assert.strictEqual(spyOnGetText.calledWith("entity"), true, "then step filter mapping entity label is set correctly");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then step filter mapping entity label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet10", "then step filter mapping entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then step filter mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.calledWith(oStepFilterMappingView.byId("idSource").getValue(), oModelerInstance.unsavedStepWithFilterMapping.getFilterProperties()), true,
				"then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetFilterMappingTargetProperties.calledTwice, true, "then step filter mapping select properties are got from the step object");
		assert.strictEqual(spyOnGetText.calledWith("targetProperty"), true, "then step filter mapping select properties label is populated");
		assert.strictEqual(oController.byId("idOptionalRequestFieldLabel").getRequired(), true, "then step filter mapping select properties label field is set as required");
		assert.deepEqual(oController.byId("idOptionalRequestField").getSelectedKey(), "property1", "then step filter mapping selected properties field are populated");
		assert.deepEqual(oController.byId("idOptionalRequestField").getModel().getData(), oModelForProperty, "then step filter mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oStepFilterMappingView.byId("idSource").getValue(), oController.byId("idEntity").getSelectedKey()), true,
				"then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source is changed and there are no common entities between new and old source", function(assert) {
		//arrangement
		var oModelForEntity = {
			"Objects" : [ {
				"key" : "Not Available: entitySet10",
				"name" : "Not Available: entitySet10"
			}, {
				"key" : "entitySet9",
				"name" : "entitySet9"
			} ]
		};
		var oModelForProperty = {
			"Objects" : [ {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			} ]
		};
		//action
		oStepFilterMappingView.byId("idSource").setValue("testService3");
		oStepFilterMappingView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepFilterMappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService3"), true, "then step filter mapping service is checked for registration");
		oStepFilterMappingView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService3").done(function(result){
			assert.strictEqual(result, true, "then step filter mapping service is valid service");	
		});
		
		assert.strictEqual(spyOnSetFilterMappingService.calledWith("testService3"), true, "then setService is called on step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingService(), "testService3", "then service of step filter mapping is changed");
		//for entity set
		assert.strictEqual(spyOnSetFilterMappingEntitySet.calledWith("entitySet10"), true, "then setFilterMappingEntitySet is called the step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet10", "then entity set of step filter mapping is changed");
		assert.strictEqual(oStepFilterMappingView.byId("idEntity").getSelectedKey(), "Not Available: entitySet10", "then step filter mapping entity field is populated");
		assert.deepEqual(oStepFilterMappingView.byId("idEntity").getModel().getData(), oModelForEntity, "then step filter mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.calledWith(oStepFilterMappingView.byId("idSource").getValue(), oModelerInstance.unsavedStepWithFilterMapping.getFilterProperties()), true,
				"then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnAddFilterMappingTargetProperty.calledWith("property1"), true, "then addFilterMappingProperty is called on  step object");
		assert.deepEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1" ], "then select properties of step filter mapping is changed");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property1", "then step filter mapping selected properties field are populated");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getModel().getData(), oModelForProperty, "then step filter mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
	});
	QUnit.test("When source is changed and there are few common entities between new and old source excluding previous selected entity", function(assert) {
		//arrangement
		var oModelForEntity = {
			"Objects" : [ {
				"key" : "Not Available: entitySet10",
				"name" : "Not Available: entitySet10"
			}, {
				"key" : "entitySet3",
				"name" : "entitySet3"
			}, {
				"key" : "entitySet4",
				"name" : "entitySet4"
			} ]
		};
		var oModelForProperty = {
			"Objects" : [ {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			} ]
		};
		//action
		oStepFilterMappingView.byId("idSource").setValue("testService5");
		oStepFilterMappingView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepFilterMappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService5"), true, "then step filter mapping service is checked for registration");
		oStepFilterMappingView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService5").done(function(result){
			assert.strictEqual(result, true, "then step filter mapping service is valid service");
		});
		
		assert.strictEqual(spyOnSetFilterMappingService.calledWith("testService5"), true, "then setService is called on step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingService(), "testService5", "then service of step filter mapping is changed");
		//for entity set
		assert.strictEqual(spyOnSetFilterMappingEntitySet.calledWith("entitySet10"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet10", "then entity set of step filter mapping is changed");
		assert.strictEqual(oStepFilterMappingView.byId("idEntity").getSelectedKey(), "Not Available: entitySet10", "then step filter mapping entity field is populated");
		assert.deepEqual(oStepFilterMappingView.byId("idEntity").getModel().getData(), oModelForEntity, "then step filter mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.calledWith(oStepFilterMappingView.byId("idSource").getValue(), oModelerInstance.unsavedStepWithFilterMapping.getFilterProperties()), true,
				"then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnRemoveFilterMappingTargetProperty.calledWith("property1"), true, "then exisiting select property of step filter mapping is removed");
		assert.deepEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1" ], "then select properties of step filter mapping is changed");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property1", "then step filter mapping selected properties field are populated");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getModel().getData(), oModelForProperty, "then step filter mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oStepFilterMappingView.byId("idSource").getValue(), "entitySet10"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source is changed and there are few common entities between new and old source including previous selected entity", function(assert) {
		//arrangement
		var oModelForEntity = {
			"Objects" : [ {
				"key" : "entitySet1",
				"name" : "entitySet1"
			}, {
				"key" : "entitySet9",
				"name" : "entitySet9"
			}, {
				"key" : "entitySet10",
				"name" : "entitySet10"
			} ]
		};
		var oModelForProperty = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property3",
				"name" : "property3"
			}, {
				"key" : "property13",
				"name" : "property13"
			} ]
		};
		//action
		oStepFilterMappingView.byId("idSource").setValue("testService6");
		oStepFilterMappingView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepFilterMappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService6"), true, "then step filter mapping service is checked for registration");
		oStepFilterMappingView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService6").done(function(result){
			assert.strictEqual(result, true, "then step filter mapping service is valid service");
		});
		assert.strictEqual(spyOnSetFilterMappingService.calledWith("testService6"), true, "then setService is called on step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingService(), "testService6", "then service of step filter mapping is changed");
		//for entity set
		assert.strictEqual(spyOnSetFilterMappingEntitySet.calledWith("entitySet10"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet10", "then entity set of step filter mapping is changed");
		assert.strictEqual(oStepFilterMappingView.byId("idEntity").getSelectedKey(), "entitySet10", "then step filter mapping entity field is populated");
		assert.deepEqual(oStepFilterMappingView.byId("idEntity").getModel().getData(), oModelForEntity, "then step filter mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.calledWith(oStepFilterMappingView.byId("idSource").getValue(), oModelerInstance.unsavedStepWithFilterMapping.getFilterProperties()), true,
				"then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnAddFilterMappingTargetProperty.calledWith("property1"), true, "then select property is added");
		assert.deepEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1" ], "then select properties of step filter mapping is changed");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getSelectedKey(), "property1", "then step filter mapping selected properties field are populated");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getModel().getData(), oModelForProperty, "then step filter mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oStepFilterMappingView.byId("idSource").getValue(), oStepFilterMappingView.byId("idEntity").getSelectedKey()), true,
				"then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source selected from value help in the input field", function(assert) {
		//action
		oStepFilterMappingView.byId("idSource").fireValueHelpRequest();
		sap.ui.getCore().applyChanges();
		var oSelectDialog = oStepFilterMappingView.byId("idCatalogServiceView").byId("idGatewayCatalogListDialog");
		//assert
		assert.ok(oSelectDialog, "Select dialog exists after firing value help request");
		assert.strictEqual(spyOnGetText.calledWith("selectService"), true, "Exisitng select dialog is the Gateway select service dialog");
		//cleanups
		oSelectDialog.destroy();
	});
	QUnit.test("When source is cleared", function(assert) {
		//action
		oStepFilterMappingView.byId("idSource").setValue("");
		oStepFilterMappingView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepFilterMappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith(""), false, "then empty step filter mapping service is not checked for registration");
		assert.strictEqual(spyOnSetFilterMappingService.calledWith(undefined), true, "then setService is called on step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingService(), undefined, "then service of step filter mapping is changed");
		//for entity set
		assert.strictEqual(spyOnSetFilterMappingEntitySet.calledWith(undefined), true, "then setFilterMappingEntitySet is called the step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "", "then entity set of step filter mapping is changed");
		assert.strictEqual(oStepFilterMappingView.byId("idEntity").getSelectedKey(), "", "then step filter mapping entity set field is populated");
		assert.strictEqual(oStepFilterMappingView.getController().byId("idEntityLabel").getRequired(), false, "then step filter mapping entity label field is set as not required");
		assert.deepEqual(oStepFilterMappingView.byId("idEntity").getModel(), undefined, "then step filter mapping entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveFilterMappingTargetProperty.calledWith("property1"), true, "then exisiting select property of step filter mapping is removed");
		assert.deepEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [], "then select properties of step filter mapping is changed");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getSelectedKey(), "", "then step filter mapping selected properties field are populated");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getModel(), undefined, "then step filter mapping selected properties field model is set");
		assert.strictEqual(oStepFilterMappingView.getController().byId("idOptionalRequestFieldLabel").getRequired(), false, "then step filter mapping target properties label field is set as not required");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), true, "then all selected properties are not fetched for the empty service and entity");
	});
	QUnit.test("When source is changed to an invalid service", function(assert) {
		//action
		oStepFilterMappingView.byId("idSource").setValue("test1");
		oStepFilterMappingView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepFilterMappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("test1"), true, "then step filter mapping service is checked for registration");
		oStepFilterMappingView.getViewData().oConfigurationEditor.registerServiceAsPromise("test11").done(function(result){
			assert.strictEqual(result, undefined, "then step filter mapping service is an invalid service");
		});
		assert.strictEqual(spyOnSetFilterMappingService.calledWith(undefined), true, "then setService is called on step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingService(), undefined, "then service of step filter mapping is changed");
		//for entity set
		assert.strictEqual(spyOnSetFilterMappingEntitySet.calledWith(undefined), true, "then setFilterMappingEntitySet is called on the step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "", "then entity set of step filter mapping is changed");
		assert.strictEqual(oStepFilterMappingView.byId("idEntity").getSelectedKey(), "", "then step filter mapping entity set field is populated");
		assert.strictEqual(oStepFilterMappingView.getController().byId("idEntityLabel").getRequired(), false, "then step filter mapping entity label field is set as not required");
		assert.deepEqual(oStepFilterMappingView.byId("idEntity").getModel(), undefined, "then step filter mapping entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveFilterMappingTargetProperty.calledWith("property1"), true, "then exisiting select property of step filter mapping is removed");
		assert.deepEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [], "then select properties of step filter mapping is changed");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getSelectedKey(), "", "then step filter mapping selected properties field are populated");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getModel(), undefined, "then step filter mapping selected properties field model is set");
		assert.strictEqual(oStepFilterMappingView.getController().byId("idOptionalRequestFieldLabel").getRequired(), false, "then step filter mapping select properties label field is set as not required");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), false, "then all selected properties are not fetched for the empty service and entity");
	});
	QUnit.test("When entity set is changed and there are no common properties between new and old", function(assert) {
		//arrangement
		var oModelForProperty = {
			"Objects" : [ {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "property5",
				"name" : "property5"
			}, {
				"key" : "property6",
				"name" : "property6"
			}, {
				"key" : "property7",
				"name" : "property7"
			} ]
		};
		//action
		oStepFilterMappingView.byId("idEntity").setSelectedKey("entitySet12");
		oStepFilterMappingView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepFilterMappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetFilterMappingEntitySet.calledWith("entitySet12"), true, "then setFilterMappingEntitySet is called the step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet12", "then entity set of step filter mapping is changed");
		assert.strictEqual(oStepFilterMappingView.byId("idEntity").getSelectedKey(), "entitySet12", "then step filter mapping entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveFilterMappingTargetProperty.calledWith("property1"), true, "then exisiting select property of step filter mapping is removed");
		assert.deepEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1" ], "then select properties of step filter mapping is changed");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property1", "then step filter mapping selected properties field are populated");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getModel().getData(), oModelForProperty, "then step filter mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService4", "entitySet12"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When entity set is changed and there are few common properties between new and old excluding previously selected properties", function(assert) {
		//arrangement
		var oModelForProperty = {
			"Objects" : [ {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "property3",
				"name" : "property3"
			}, {
				"key" : "property9",
				"name" : "property9"
			} ]
		};
		//action
		oStepFilterMappingView.byId("idEntity").setSelectedKey("entitySet5");
		oStepFilterMappingView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepFilterMappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetFilterMappingEntitySet.calledWith("entitySet5"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet5", "then entity set of step filter mapping is changed");
		assert.strictEqual(oStepFilterMappingView.byId("idEntity").getSelectedKey(), "entitySet5", "then step filter mapping entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveFilterMappingTargetProperty.calledWith("property1"), true, "then exisiting select property of step filter mapping is removed");
		assert.deepEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1" ], "then select properties of step filter mapping is changed");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property1", "then step filter mapping selected properties field are populated");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getModel().getData(), oModelForProperty, "then step filter mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService4", "entitySet5"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When entity set is changed and there are few common properties between new and old including previously selected properties", function(assert) {
		//arrangement
		var oModelForProperty = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property2",
				"name" : "property2"
			}, {
				"key" : "property6",
				"name" : "property6"
			}, {
				"key" : "property8",
				"name" : "property8"
			} ]
		};
		//action
		oStepFilterMappingView.byId("idEntity").setSelectedKey("entitySet4");
		oStepFilterMappingView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepFilterMappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetFilterMappingEntitySet.calledWith("entitySet4"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet4", "then entity set of step filter mapping is changed");
		assert.strictEqual(oStepFilterMappingView.byId("idEntity").getSelectedKey(), "entitySet4", "then step filter mapping entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveFilterMappingTargetProperty.calledWith("property1"), true, "then exisiting select property of step filter mapping is removed");
		assert.deepEqual(spyOnAddFilterMappingTargetProperty.calledWith("property1"), true, "then select property of step filter mapping is added");
		assert.deepEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1" ], "then select properties of step filter mapping is changed");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getSelectedKey(), "property1", "then step filter mapping selected properties field are populated");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getModel().getData(), oModelForProperty, "then step filter mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService4", "entitySet4"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When select property is changed", function(assert) {
		//action
		oStepFilterMappingView.byId("idOptionalRequestField").setSelectedKey("property13");
		oStepFilterMappingView.getController().handleChangeForSelectProperty();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepFilterMappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.strictEqual(spyOnRemoveFilterMappingTargetProperty.calledWith("property1"), true, "then exisiting select property of step filter mapping is removed");
		assert.strictEqual(spyOnAddFilterMappingTargetProperty.calledWith("property13"), true, "then addFilterMappingPropertyis called the step object");
		assert.deepEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property13" ], "then select properties of step filter mapping is changed");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getSelectedKey(), "property13", "then step filter mapping selected properties field are populated");
	});
	QUnit.test("Fetching validation state while view is valid", function(assert) {
		//assert
		assert.strictEqual(oStepFilterMappingView.getController().getValidationState(), true, "then stepFilterMapping view is in valid state");
	});
	QUnit.test("Fetching validation state while view is not valid", function(assert) {
		//action
		oStepFilterMappingView.byId("idOptionalRequestField").clearSelection();
		//assert
		assert.strictEqual(oStepFilterMappingView.getController().getValidationState(), false, "then stepFilterMapping view is not in valid state");
	});
	QUnit.test("When source displays suggestion items", function(assert) {
		//arrangement
		var sourceInputControl = oStepFilterMappingView.byId("idSource");
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
	QUnit.test("When select property label displays suggestion items", function(assert) {
		//arrangement
		var suggestionsModelData = {
			Objects : [{
				key : "TIME",
				name : "TIME"
			},{
				key : "CUSTOMER",
				name : "CUSTOMER"
			}]
		};
		//action
		var selectPropertyLabel = oStepFilterMappingView.byId("idOptionalSelectedPropertyLabelText");
		var oEventParameters = {
			suggestValue : "Cus"
		};
		selectPropertyLabel.fireSuggest(oEventParameters);
		assert.deepEqual(selectPropertyLabel.getModel().getData(), suggestionsModelData, "Model filled with all possible suggestionsItems");
		assert.strictEqual(selectPropertyLabel.getSuggestionItems().length, 1, "SuggestItems from model filtered");
		assert.strictEqual(selectPropertyLabel.getSuggestionItems()[0].getText(), "CUSTOMER", "SuggestionItems correctly filtered");
	});
	QUnit.module("For a step with existing filter mapping service - Validate previously selected entity sets", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				spyOnGetAllEntitySetsOfServiceWithGivenProperties.restore();
				//Stub getAllEntitySetsOfService with an invalid entity set.Eg-Due to metadata changes the previously selected entity set is no more available
				spyOnGetAllEntitySetsOfServiceWithGivenProperties = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsOfServiceWithGivenPropertiesAsPromise", function() {
					return sap.apf.utils.createPromise([ "entitySet2", "entitySet3", "entitySet4" ]); //entitySet10 is no more available
				});
				oStepFilterMappingView = _instantiateView(oModelerInstance.unsavedStepWithFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When step is initialized and previously selected entity set does not exist anymore in the available entity sets", function(assert) {
		//arrange
		var oViewData = oStepFilterMappingView.getViewData();
		var oController = oStepFilterMappingView.getController();
		var oModelForEntity = {
			"Objects" : [ {
				"key" : "Not Available: entitySet10",
				"name" : "Not Available: entitySet10"
			}, {
				"key" : "entitySet2",
				"name" : "entitySet2"
			}, {
				"key" : "entitySet3",
				"name" : "entitySet3"
			}, {
				"key" : "entitySet4",
				"name" : "entitySet4"
			} ]
		};
		var oModelForProperty = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property3",
				"name" : "property3"
			}, {
				"key" : "property13",
				"name" : "property13"
			} ]
		};
		//assert
		assert.ok(oStepFilterMappingView, "then step filter mapping view is available");
		// source section asserts
		assert.strictEqual(spyOnGetFilterMappingService.callCount, 4, "then step filter mapping entity set is got from the step object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then step step filter mapping source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService4", "then step step filter mapping source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetFilterMappingEntitySet.callCount, 4, "then step filter mapping entity set is got from the step object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then step filter mapping entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then step filter mapping entity label field is set as required");
		assert.strictEqual(oStepFilterMappingView.byId("idEntity").getSelectedKey(), "Not Available: entitySet10", "then previously selected entity set is displayed which is invalid since its not available");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then step filter mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.calledWith(oStepFilterMappingView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetFilterMappingTargetProperties.calledTwice, true, "then step filter mapping select properties are got from the step object");
		assert.strictEqual(oController.byId("idOptionalRequestFieldLabel").getText(), oViewData.oTextReader("targetProperty"), "then step filter mapping select properties label is populated");
		assert.strictEqual(oController.byId("idOptionalRequestFieldLabel").getRequired(), true, "then step filter mapping select properties label field is set as required");
		assert.deepEqual(oController.byId("idOptionalRequestField").getSelectedKey(), "property1", "then step filter mapping selected properties field are populated");
		assert.deepEqual(oController.byId("idOptionalRequestField").getModel().getData(), oModelForProperty, "then step filter mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oStepFilterMappingView.byId("idSource").getValue(), "entitySet10"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When entity set of step is changed to a currently not available entity set", function(assert) {
		//action
		oStepFilterMappingView.byId("idEntity").setSelectedKey("Not Available: entitySet10");
		oStepFilterMappingView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepFilterMappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetFilterMappingEntitySet.calledWith("entitySet10"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet10", "then entity set of step filter mapping is changed");
		assert.strictEqual(oStepFilterMappingView.byId("idEntity").getSelectedKey(), "Not Available: entitySet10", "then step filter mapping entity field is populated");
		//for select properties
		assert.strictEqual(spyOnAddFilterMappingTargetProperty.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the step object");
		assert.deepEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1" ], "then select properties of step filter mapping is changed");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getSelectedKey(), "property1", "then step filter mapping selected properties field are populated");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService4", "entitySet10"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.module("For a step with existing existing filter mapping service - Validate previously selected properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				spyOnGetAllPropertiesOfEntitySet.restore();
				spyOnGetAllPropertiesOfEntitySet = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getAllPropertiesOfEntitySetAsPromise");
				spyOnGetAllPropertiesOfEntitySet.withArgs("testService4", "entitySet10").returns(sap.apf.utils.createPromise([ "property3", "property13" ]));
				spyOnGetAllPropertiesOfEntitySet.withArgs("testService4", "entitySet12").returns(sap.apf.utils.createPromise([ "property5", "property6", "property7" ]));
				spyOnGetAllPropertiesOfEntitySet.withArgs("testService4", "entitySet4").returns(sap.apf.utils.createPromise([ "property1", "property2", "property6", "property8" ]));
				spyOnGetAllPropertiesOfEntitySet.withArgs("testService4", "entitySet5").returns(sap.apf.utils.createPromise([ "property3", "property9" ]));
				oStepFilterMappingView = _instantiateView(oModelerInstance.unsavedStepWithFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When step filter mapping view is initialized", function(assert) {
		//arrange
		var oViewData = oStepFilterMappingView.getViewData();
		var oController = oStepFilterMappingView.getController();
		var oModelForEntity = {
			Objects : [ {
				"key" : "Not Available: entitySet10",
				"name" : "Not Available: entitySet10"
			}, {
				"key" : "entitySet4",
				"name" : "entitySet4"
			} ]
		};
		var oModelForProperties = {
			"Objects" : [ {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "property3",
				"name" : "property3"
			}, {
				"key" : "property13",
				"name" : "property13"
			} ]
		};
		//assert
		assert.ok(oStepFilterMappingView, "then step filter mapping view is available");
		// source section asserts
		assert.strictEqual(spyOnGetFilterMappingService.callCount, 4, "then filter mapping entity set is got from the step object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then step filter mapping source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService4", "then step filter mapping source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetFilterMappingEntitySet.callCount, 4, "then filter mapping entity set is got from the step object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then filter mapping entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then filter mapping entity label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "Not Available: entitySet10", "then filter mapping entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then filter mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfServiceWithGivenProperties.calledWith(oStepFilterMappingView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetFilterMappingTargetProperties.calledTwice, true, "then filter mapping select properties are got from the step object");
		assert.strictEqual(oController.byId("idOptionalRequestFieldLabel").getText(), oViewData.oTextReader("targetProperty"), "then filter mapping select properties label is populated");
		assert.strictEqual(oController.byId("idOptionalRequestFieldLabel").getRequired(), true, "then filter mapping select properties label field is set as required");
		assert.deepEqual(oController.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property1", "then filter mapping selected properties field are populated");
		assert.deepEqual(oController.byId("idOptionalRequestField").getModel().getData(), oModelForProperties, "then filter mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oStepFilterMappingView.byId("idSource").getValue(), "entitySet10"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When select property is changed - a not available property is selected", function(assert) {
		//action
		oStepFilterMappingView.byId("idOptionalRequestField").setSelectedKey("Not Available: property1");
		oStepFilterMappingView.getController().handleChangeForOptionalRequestField();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepFilterMappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.strictEqual(spyOnAddFilterMappingTargetProperty.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the step object");
		assert.deepEqual(oStepFilterMappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1" ], "then select properties of filter mapping is changed");
		assert.deepEqual(oStepFilterMappingView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property1", "then filter mapping selected properties field are populated");
	});
	function commonSetupHelper (context, targetProperties, displayOption, labelKey, serviceNotDefined, entitySetNotDefined){
		context.oStep = commonStepSetup(targetProperties, labelKey, displayOption, serviceNotDefined, entitySetNotDefined);
		context.oStepFilterMappingController = new sap.ui.controller("sap.apf.modeler.ui.controller.stepFilterMapping");
		context.oStepFilterMappingView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.requestOptions",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : context.oStepFilterMappingController,
			viewData : {
				oConfigurationHandler : {
					getTextPool : function (){
						return {
							get : function(labelKey){
								var label = labelKey.slice(8); //labelKey is textKey:label
								return {
									TextElementDescription : label
								};
							},
							setTextAsPromise : function (label){
								return jQuery.Deferred().resolve("textKey:" + label);
							}
						};
					}
				},
				oConfigurationEditor : {
					getAllPropertiesOfEntitySetAsPromise : function(){
						return jQuery.Deferred().resolve([]);
					},
					setIsUnsaved : function(){
						context.isUnsaved = true;
					},
					getAllEntitySetsOfServiceWithGivenPropertiesAsPromise : function (){
						return jQuery.Deferred().resolve([]);
					}
				},
				oStepPropertyMetadataHandler : {
					getFilterMappingEntityTypeMetadataAsPromise : function (){
						return  jQuery.Deferred().resolve({
							getPropertyMetadata : function(propertyName){
								if (propertyName === "propertyWithText"){
									return {
										text : "textProperty"
									};
								}
								return {};
							}
						});
					},
					getDefaultLabel : function(entityTypeMetadata, oText) {
						return oText;
					}
				},
				oTextReader : function(id){
					if (id === "notavailableText"){
						return "NotAvailable";
					}
					if (id === "label"){
						return "Label";
					}
					if (id === "default"){
						return "Default";
					}
					return "text : " + id;
				},
				oParentObject : context.oStep,
				getCalatogServiceUri : _doNothing
			}
		});
		context.oStepFilterMappingView.placeAt("testarea");
		sap.ui.getCore().applyChanges();
	}
	function commonStepSetup (targetProps, labelKey, displayOption, serviceNotDefined, entitySetNotDefined) {
		var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
		var inject = {
			instances : {
				messageHandler : messageHandler
			},
			constructors : {
				Hashtable : sap.apf.utils.Hashtable,
				Step : sap.apf.modeler.core.Step,
				ElementContainer : sap.apf.modeler.core.ElementContainer,
				Representation : sap.apf.modeler.core.Representation
			}
		};
		var step = new sap.apf.modeler.core.Step('xyz', inject);
		if (!serviceNotDefined){
			step.setFilterMappingService("testService");
		}
		if (!entitySetNotDefined){
			step.setFilterMappingEntitySet("testEntitySet");
		}
		if (targetProps !== undefined){
			targetProps.forEach(function (prop){
				step.addFilterMappingTargetProperty(prop);
			});
		}
		if (labelKey !== undefined){
			step.setFilterMappingTargetPropertyLabelKey(labelKey);
		}
		if (displayOption !== undefined){
			step.setFilterMappingTargetPropertyLabelDisplayOption(displayOption);
		}
		return step;
	}
	QUnit.module("For a step with existing filter mapping service: Filter Mapping Target Property display options", {
		commonSetup : function(assert, targetProperties, displayOption, labelKey, serviceNotDefined, entitySetNotDefined){
			commonSetupHelper(this, targetProperties, displayOption, labelKey, serviceNotDefined, entitySetNotDefined);
			var displayOptionsElement = this.oStepFilterMappingView.byId("idOptionalLabelDisplayOptionType");
			assert.strictEqual(displayOptionsElement.getVisible(), true, "Target display option is visible");
			assert.strictEqual(displayOptionsElement.getItems().length, 3, "Target display option list contains all items");
		},
		afterEach : function(){
			this.oStepFilterMappingView.destroy();
		}
	});
	function testDefaultUIState(assert, context, textElementDisabled){
		var displayOptionsElement = context.oStepFilterMappingView.byId("idOptionalLabelDisplayOptionType");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getKey(), "key", "Selected item in list is Key");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getText(), "text : key", "Selected item in list is Key");
		assert.strictEqual(displayOptionsElement.getItemAt(0), displayOptionsElement.getSelectedItem(), "First item in list in the key item");
		assert.strictEqual(displayOptionsElement.getItemAt(1).getKey(), "text", "Second item in list is the text item");
		assert.strictEqual(displayOptionsElement.getItemAt(1).getText(), "text : text", "Second item in list is the text item");
		assert.strictEqual(displayOptionsElement.getItemAt(1).getEnabled(), textElementDisabled, "Second item in list is correctly enabled/disabled");
		assert.strictEqual(displayOptionsElement.getItemAt(2).getKey(), "keyAndText", "Third item in list is the key and text item");
		assert.strictEqual(displayOptionsElement.getItemAt(2).getText(), "text : keyAndText", "Third item in list is the key and text item");
		assert.strictEqual(displayOptionsElement.getItemAt(2).getEnabled(), textElementDisabled, "Third item in list is correctly enabled/disabled");
	}
	QUnit.test("When Service is not defined", function(assert){
		this.commonSetup(assert, [], undefined, undefined, true);
		testDefaultUIState(assert, this, true);
		var displayOptionsElement = this.oStepFilterMappingView.byId("idOptionalLabelDisplayOptionType");
		assert.strictEqual(displayOptionsElement.getEnabled(), false, "then the display options list is disabled");
	});
	QUnit.test("When Entity Set is not defined", function(assert){
		this.commonSetup(assert, [], undefined, undefined, undefined, true);
		testDefaultUIState(assert, this, true);
		var displayOptionsElement = this.oStepFilterMappingView.byId("idOptionalLabelDisplayOptionType");
		assert.strictEqual(displayOptionsElement.getEnabled(), false, "then the display options list is disabled");
	});
	QUnit.test("When Target Property is empty", function(assert){
		this.commonSetup(assert, []);
		testDefaultUIState(assert, this, true);
		var displayOptionsElement = this.oStepFilterMappingView.byId("idOptionalLabelDisplayOptionType");
		assert.strictEqual(displayOptionsElement.getEnabled(), false, "then the display options list is disabled");
	});
	QUnit.test("Target Property is not empty and has no text property", function(assert){
		this.commonSetup(assert, ["propertyWithoutText"]);
		testDefaultUIState(assert, this, false);
	});
	QUnit.test("Target Property has no text property but text was selected as label display option", function(assert){
		this.commonSetup(assert, ["propertyWithoutText"], "text");
		var displayOptionsElement = this.oStepFilterMappingView.byId("idOptionalLabelDisplayOptionType");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getKey(), "NotAvailable: text", "Selected item in list is text with not available prefix");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getText(), "NotAvailable: text : text", "Selected item in list is text with not available prefix");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getEnabled(), false, "Selected item in list is disabled");
	});
	QUnit.test("Target Property has no text property but key and text was selected as label display option", function(assert){
		this.commonSetup(assert, ["propertyWithoutText"], "keyAndText");
		var displayOptionsElement = this.oStepFilterMappingView.byId("idOptionalLabelDisplayOptionType");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getKey(), "NotAvailable: keyAndText", "Selected item in list is key and text with not available prefix");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getText(), "NotAvailable: text : keyAndText", "Selected item in list is key and text with not available prefix");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getEnabled(), false, "Selected item in list is disabled");
	});
	QUnit.test("Target Property is not empty and has text property", function(assert){
		this.commonSetup(assert, ["propertyWithText"]);
		var displayOptionsElement = this.oStepFilterMappingView.byId("idOptionalLabelDisplayOptionType");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getKey(), "key", "Selected item in list is Key");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getText(), "text : key", "Selected item in list is Key");
		assert.strictEqual(displayOptionsElement.getItemAt(0), displayOptionsElement.getSelectedItem(), "First item in list in the key item");
		assert.strictEqual(displayOptionsElement.getItemAt(1).getKey(), "text", "Second item in list is the text item");
		assert.strictEqual(displayOptionsElement.getItemAt(1).getText(), "text : text", "Second item in list is the text item");
		assert.strictEqual(displayOptionsElement.getItemAt(1).getEnabled(), true, "Second item in list is enabled");
		assert.strictEqual(displayOptionsElement.getItemAt(2).getKey(), "keyAndText", "Third item in list is the key and text item");
		assert.strictEqual(displayOptionsElement.getItemAt(2).getText(), "text : keyAndText", "Third item in list is the key and text item");
		assert.strictEqual(displayOptionsElement.getItemAt(2).getEnabled(), true, "Third item in list is enabled");
	});
	QUnit.test("Target Property has text property and text was selected as label display option", function(assert){
		this.commonSetup(assert, ["propertyWithText"], "text");
		var displayOptionsElement = this.oStepFilterMappingView.byId("idOptionalLabelDisplayOptionType");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getKey(), "text", "Selected item in list is text");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getText(), "text : text", "Selected item in list is text");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getEnabled(), true, "Selected item in list is enabled");
	});
	QUnit.test("Target Property has text property and key and text was selected as label display option", function(assert){
		this.commonSetup(assert, ["propertyWithText"], "keyAndText");
		var displayOptionsElement = this.oStepFilterMappingView.byId("idOptionalLabelDisplayOptionType");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getKey(), "keyAndText", "Selected item in list is key and text");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getText(), "text : keyAndText", "Selected item in list is key and text");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getEnabled(), true, "Selected item in list is enabled");
	});
	QUnit.test("Target Property has text property and label display option changed from key and text to key", function(assert){
		this.commonSetup(assert, ["propertyWithText"], "keyAndText");
		var displayOptionsElement = this.oStepFilterMappingView.byId("idOptionalLabelDisplayOptionType");
		displayOptionsElement.setSelectedKey("key");
		displayOptionsElement.fireChange({
			selectedItem : displayOptionsElement.getItemByKey("key")
		});
		assert.strictEqual(displayOptionsElement.getSelectedItem().getKey(), "key", "Selected item in list is key");
		assert.strictEqual(displayOptionsElement.getSelectedItem().getText(), "text : key", "Selected item in list is key");
		assert.strictEqual(this.oStep.getFilterMappingTargetPropertyLabelDisplayOption(), "key", "label display option in model changed to key");
		assert.strictEqual(this.isUnsaved, true, "configuration is set to unsaved state");
	});
	QUnit.module("For a step with existing filter mapping service: Filter Mapping Target Property label field", {
		commonSetup : function(assert, targetProperties, labelKey, displayOption, serviceNotDefined, entitySetNotDefined) {
			commonSetupHelper(this, targetProperties, labelKey, displayOption, serviceNotDefined, entitySetNotDefined);
		},
		afterEach : function() {
			this.oStepFilterMappingView.destroy();
		}
	});
	QUnit.test("When Service is undefined", function(assert){
		this.commonSetup(assert, [], undefined, undefined, true);
		var labelTextElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabelText");
		var labelElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabel");
		var targetPropertyElement = this.oStepFilterMappingView.byId("idOptionalRequestField");
		targetPropertyElement.clearSelection();
		this.oStepFilterMappingView.getController().handleChangeForSelectProperty();

		assert.strictEqual(labelTextElement.getEnabled(), true, "then Target Property label is enabled");
		assert.strictEqual(labelTextElement.getValue(), "", "then property label key is not set");
		assert.strictEqual(labelElement.getText(), "Label (Default)", "then property label text is set to default");
		assert.strictEqual(this.oStep.getFilterMappingTargetPropertyLabelKey(), undefined, "Then step has no filter Property label key");
	});
	QUnit.test("When Entity Set is undefined", function(assert){
		this.commonSetup(assert, [], undefined, undefined, undefined, true);
		var labelTextElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabelText");
		var labelElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabel");
		var targetPropertyElement = this.oStepFilterMappingView.byId("idOptionalRequestField");
		targetPropertyElement.clearSelection();
		this.oStepFilterMappingView.getController().handleChangeForSelectProperty();

		assert.strictEqual(labelTextElement.getEnabled(), true, "then Target Property label is enabled");
		assert.strictEqual(labelTextElement.getValue(), "", "then property label key is not set");
		assert.strictEqual(labelElement.getText(), "Label (Default)", "then property label text is set to default");
		assert.strictEqual(this.oStep.getFilterMappingTargetPropertyLabelKey(), undefined, "Then step has no filter Property label key");
	});
	QUnit.test("When Target Property is not set", function(assert){
		this.commonSetup(assert, []);
		var labelTextElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabelText");
		var labelElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabel");
		var targetPropertyElement = this.oStepFilterMappingView.byId("idOptionalRequestField");
		targetPropertyElement.clearSelection();
		this.oStepFilterMappingView.getController().handleChangeForSelectProperty();

		assert.strictEqual(labelTextElement.getEnabled(), true, "then Target Property label is enabled");
		assert.strictEqual(labelTextElement.getValue(), "", "then property label key is not set");
		assert.strictEqual(labelElement.getText(), "Label (Default)", "then property label text is set to default");
		assert.strictEqual(this.oStep.getFilterMappingTargetPropertyLabelKey(), undefined, "Then step has no filter Property label key");
	});
	QUnit.test("When Target Property is set", function(assert){
		this.commonSetup(assert, ["property"]);
		var labelTextElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabelText");
		var labelElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabel");

		assert.strictEqual(labelTextElement.getEnabled(), true, "then Target Property label is enabled");
		assert.strictEqual(labelTextElement.getValue(), "property", "then property label key is set");
		assert.strictEqual(labelElement.getText(), "Label (Default)", "then property label text is set to default");
		assert.strictEqual(this.oStep.getFilterMappingTargetPropertyLabelKey(), undefined, "Then step has no filter Property label key");
	});
	QUnit.test("When Target Property is set and label text is changed", function(assert){
		this.commonSetup(assert, ["property"], "labelText1");
		var labelTextElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabelText");
		var labelElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabel");
		labelTextElement.setValue("labelText2");
		this.oStepFilterMappingView.getController().handleChangeForOptionalSelectedPropertyLabelText();

		assert.strictEqual(labelTextElement.getEnabled(), true, "then Target Property label is enabled");
		assert.strictEqual(labelTextElement.getValue(), "labelText2", "then property label key is changed");
		assert.strictEqual(labelElement.getText(), "Label", "then property label text is set to label");
		assert.strictEqual(this.oStep.getFilterMappingTargetPropertyLabelKey(), "textKey:labelText2", "Then step has corerect filter Property label key");
		assert.strictEqual(this.isUnsaved, true, "configuration is set to unsaved state");
	});
	QUnit.test("When Target Property is changed", function(assert){
		this.commonSetup(assert, ["property1"], "property1", "key");
		var labelTextElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabelText");
		var labelElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabel");
		var targetPropertyElement = this.oStepFilterMappingView.byId("idOptionalRequestField");
		targetPropertyElement.setSelectedKey("property13");
		this.oStepFilterMappingView.getController().handleChangeForSelectProperty();

		assert.strictEqual(targetPropertyElement.getSelectedKey(), "property13", "then old target property is removed and new target property is added");
		assert.strictEqual(labelTextElement.getEnabled(), true, "then Target Property label is enabled");
		assert.strictEqual(labelTextElement.getValue(), "property13", "then property label key is changed");
		assert.strictEqual(labelElement.getText(), "Label (Default)", "then property label text is set to default");
		assert.strictEqual(this.oStep.getFilterMappingTargetPropertyLabelKey(), undefined, "Then step has no filter Property label key");
		assert.strictEqual(this.isUnsaved, true, "configuration is set to unsaved state");
	});
	QUnit.test("When Source is cleared", function(assert){
		this.commonSetup(assert);
		var labelTextElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabelText");
		var labelElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabel");
		var sourceElement = this.oStepFilterMappingView.byId("idSource");
		sourceElement.setValue("");
		this.oStepFilterMappingView.getController().handleChangeForSourceAsPromise(_createEvent(sourceElement));

		assert.strictEqual(labelTextElement.getEnabled(), true, "then Target Property label is enabled");
		assert.strictEqual(labelTextElement.getValue(), "", "then property label key is cleared");
		assert.strictEqual(labelElement.getText(), "Label (Default)", "then property label text is set to default");
		assert.strictEqual(this.oStep.getFilterMappingTargetPropertyLabelKey(), undefined, "Then step has no filter Property label key");
		assert.strictEqual(this.isUnsaved, true, "configuration is set to unsaved state");
	});
	QUnit.test("When EntitySet is changed", function(assert){
		this.commonSetup(assert, ["property"]);
		var labelTextElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabelText");
		var labelElement = this.oStepFilterMappingView.byId("idOptionalSelectedPropertyLabel");
		var sourceElement = this.oStepFilterMappingView.byId("idEntity");
		sourceElement.setValue("EntitySet");
		this.oStepFilterMappingView.getController().handleChangeForEntity(_createEvent(sourceElement));
		
		assert.strictEqual(labelTextElement.getEnabled(), true, "then Target Property label is enabled");
		assert.strictEqual(labelTextElement.getValue(), "property", "then property label key is still filled");
		assert.strictEqual(labelElement.getText(), "Label (Default)", "then property label text is set to default");
		assert.strictEqual(this.oStep.getFilterMappingTargetPropertyLabelKey(), undefined, "Then step has no filter Property label key");
		assert.strictEqual(this.isUnsaved, true, "configuration is set to unsaved state");
	});
}());