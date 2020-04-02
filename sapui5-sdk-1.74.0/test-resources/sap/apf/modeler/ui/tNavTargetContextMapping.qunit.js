/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tNavTargetContextMapping');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	'use strict';
	var oNavTargetContextmappingView, spyOnGetText, spyOnGetFilterMappingService, spyOnGetAllPropertiesOfEntitySet, spyOngetFilterMappingEntitySet, spyOnGetAllEntitySetsOfService, spyOnGetSelectPropOfFilterResolution, spyOnConfigEditorRegisterService, spyOnsetFilterMappingService, spyOnsetFilterMappingEntitySet, spyOnConfigEditorSetIsUnsaved, oModelerInstance;
	function _doNothing() {
		return "";
	}
	function _commonSpiesInBeforeEach() {
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnConfigEditorRegisterService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "registerServiceAsPromise");
		spyOnGetAllEntitySetsOfService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsOfServiceAsPromise");
		spyOnGetAllPropertiesOfEntitySet = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllPropertiesOfEntitySetAsPromise");
		spyOnGetFilterMappingService = sinon.spy(oModelerInstance.firstNavigationtarget, "getFilterMappingService");
		spyOngetFilterMappingEntitySet = sinon.spy(oModelerInstance.firstNavigationtarget, "getFilterMappingEntitySet");
		spyOnGetSelectPropOfFilterResolution = sinon.spy(oModelerInstance.firstNavigationtarget, "getFilterMappingTargetProperties");
		spyOnsetFilterMappingService = sinon.spy(oModelerInstance.firstNavigationtarget, "setFilterMappingService");
		spyOnsetFilterMappingEntitySet = sinon.spy(oModelerInstance.firstNavigationtarget, "setFilterMappingEntitySet");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
	}
	function _commonCleanUpsInAfterEach() {
		oNavTargetContextmappingView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oNavTargetContextmappingView.getViewData().oConfigurationEditor.registerServiceAsPromise.restore();
		oNavTargetContextmappingView.getViewData().oConfigurationEditor.getAllEntitySetsOfServiceAsPromise.restore();
		oNavTargetContextmappingView.getViewData().oConfigurationEditor.getAllPropertiesOfEntitySetAsPromise.restore();
		spyOnGetText.restore();
		oModelerInstance.reset();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oNavTargetContextmappingView.destroy();
	}
	function _instantiateView(sId, assert) {
		var oNavTargetContextmappingController = new sap.ui.controller("sap.apf.modeler.ui.controller.navTargetContextMapping");
		var spyOnInit = sinon.spy(oNavTargetContextmappingController, "onInit");
		var oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.requestOptions",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oNavTargetContextmappingController,
			viewData : {
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oTextReader : oModelerInstance.modelerCore.getText,
				oParentObject : sId,
				getCalatogServiceUri : _doNothing
			}
		});
		assert.strictEqual(spyOnInit.calledOnce, true, "then navTargetContextMapping onInit function is called and view is initialized");
		return oView;
	}
	function _getModelForEntity() {
		return {
			"Objects" : [ {
				"key" : "entitySet1",
				"name" : "entitySet1"
			}, {
				"key" : "entitySet2",
				"name" : "entitySet2"
			}, {
				"key" : "entitySet3",
				"name" : "entitySet3"
			}, {
				"key" : "entitySet4",
				"name" : "entitySet4"
			}, {
				"key" : "entitySet5",
				"name" : "entitySet5"
			}, {
				"key" : "entitySet11",
				"name" : "entitySet11"
			}, {
				"key" : "entitySet6",
				"name" : "entitySet6"
			}, {
				"key" : "entitySet7",
				"name" : "entitySet7"
			}, {
				"key" : "entitySet13",
				"name" : "entitySet13"
			} ]
		};
	}
	function _getModelForProperties() {
		return {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property2",
				"name" : "property2"
			}, {
				"key" : "property3",
				"name" : "property3"
			}, {
				"key" : "property4",
				"name" : "property4"
			}, {
				"key" : "property1Text",
				"name" : "property1Text"
			}, {
				"key" : "property3Text",
				"name" : "property3Text"
			} ]
		};
	}
	QUnit.module("For a navigation target with existing context mapping service", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				oNavTargetContextmappingView = _instantiateView(oModelerInstance.firstNavigationtarget, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When navTargetContextMapping view is initialized", function(assert) {
		//arrange
		var oViewData = oNavTargetContextmappingView.getViewData();
		var oController = oNavTargetContextmappingView.getController();
		var oModelForEntity = _getModelForEntity();
		var oModelForProperties = _getModelForProperties();
		//assert
		assert.ok(oNavTargetContextmappingView, "then navTargetContextMapping view is available");
		// source section asserts
		assert.strictEqual(spyOnGetFilterMappingService.calledOnce, true, "then context mapping entity set is got from the navigation target object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then navigation target context mapping source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then navigation target context mapping source field is populated");
		// entity section asserts
		assert.strictEqual(spyOngetFilterMappingEntitySet.calledOnce, true, "then context mapping entity set is got from the navigation target object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then context mapping entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then context mapping entity label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet1", "then context mapping entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then context mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oNavTargetContextmappingView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectPropOfFilterResolution.calledOnce, true, "then context mapping select properties are got from the navigation target object");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getVisible(), false,"then context mapping select properties is invisible");
		assert.deepEqual(oController.byId("idSelectProperties").getVisible(), false, "then context mapping selected properties field is invislbe");
		assert.strictEqual(oController.byId("idOptionalPropertyLabel").getVisible(), true,"then context mapping request property label is visible");
		assert.deepEqual(oController.byId("idOptionalProperty").getVisible(), true, "then context mapping request property is visible");
		assert.strictEqual(oController.byId("idOptionalPropertyLabel").getText(), oViewData.oTextReader("mappedProperty"), "then context mapping request property label is populated");
		assert.strictEqual(oController.byId("idOptionalPropertyLabel").getRequired(), true, "then context mapping select properties label field is set as required");
		assert.deepEqual(oController.byId("idOptionalProperty").getSelectedKey(), "property1" , "then context mapping selected property field is populated with first target property");
		assert.deepEqual(oController.byId("idOptionalProperty").getModel().getData(), oModelForProperties, "then context mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oNavTargetContextmappingView.byId("idSource").getValue(), oController.byId("idEntity").getSelectedKey()), true,
				"then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source is changed and there are no common entities between new and old source", function(assert) {
		//arrangement
		var oModelForEntity = {
			"Objects" : [ {
				"key" : "Not Available: entitySet1",
				"name" : "Not Available: entitySet1"
			}, {
				"key" : "entitySet9",
				"name" : "entitySet9"
			} ]
		};
		var oModelForProperties = {
			"Objects" : [ {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			} ]
		};
		//action
		oNavTargetContextmappingView.byId("idSource").setValue("testService3");
		oNavTargetContextmappingView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService3"), true, "then context mapping service is checked for registration");
		oNavTargetContextmappingView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService3").done(function(result){
			assert.strictEqual(result, true, "then context mapping service is valid service");		
		});
	
		assert.strictEqual(spyOnsetFilterMappingService.calledWith("testService3"), true, "then setFilterMappingService is called on navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingService(), "testService3", "then service of context mapping is changed");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith("entitySet1"), true, "then setFilterMappingEntitySet is called the navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet1", "then entity set of context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then context mapping entity field is populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idEntity").getModel().getData(), oModelForEntity, "then context mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService3"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1", "property3" ], "then select properties of context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getSelectedKey(), "Not Available: property1", "then context mapping selected property field is populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getModel().getData(), oModelForProperties, "then context mapping selected property field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService3", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source is changed and there are few common entities between new and old source excluding previous selected entity", function(assert) {
		//arrangement
		var oModelForEntity = {
			"Objects" : [ {
				"key" : "Not Available: entitySet1",
				"name" : "Not Available: entitySet1"
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
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			} ]
		};
		//action
		oNavTargetContextmappingView.byId("idSource").setValue("testService5");
		oNavTargetContextmappingView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService5"), true, "then nav target context mapping service is checked for registration");
		oNavTargetContextmappingView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService5").done(function(result){
			assert.strictEqual(result, true, "then nav target context mapping service is valid service");
		});
		
		assert.strictEqual(spyOnsetFilterMappingService.calledWith("testService5"), true, "then setService is called on step object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingService(), "testService5", "then service of nav target context mapping is changed");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith("entitySet1"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet1", "then entity set of nav target context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then nav target context mapping entity field is populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idEntity").getModel().getData(), oModelForEntity, "then nav target context mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService5"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1", "property3" ], "then select properties of nav target context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getSelectedKey(), "Not Available: property1", "then nav target context mapping selected property field is populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getModel().getData(), oModelForProperty, "then nav target context mapping selected property field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService5", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
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
		var oModelForProperty = _getModelForProperties();
		//action
		oNavTargetContextmappingView.byId("idSource").setValue("testService6");
		oNavTargetContextmappingView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService6"), true, "then nav target context mapping service is checked for registration");
		oNavTargetContextmappingView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService6").done(function(result){
			assert.strictEqual(result, true, "then nav target context mapping service is valid service");	
		});
		
		assert.strictEqual(spyOnsetFilterMappingService.calledWith("testService6"), true, "then setService is called on step object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingService(), "testService6", "then service of nav target context mapping is changed");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith("entitySet1"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet1", "then entity set of nav target context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "entitySet1", "then nav target context mapping entity field is populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idEntity").getModel().getData(), oModelForEntity, "then nav target context mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService6"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1", "property3" ], "then select properties of nav target context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getSelectedKey(), "property1", "then nav target context mapping selected property field is populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getModel().getData(), oModelForProperty, "then nav target context mapping selected property field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService6", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source selected from value help in the input field", function(assert) {
		//action
		oNavTargetContextmappingView.byId("idSource").fireValueHelpRequest();
		sap.ui.getCore().applyChanges();
		var oSelectDialog = oNavTargetContextmappingView.byId("idCatalogServiceView").byId("idGatewayCatalogListDialog");
		//assert
		assert.ok(oSelectDialog, "Select dialog exists after firing value help request");
		assert.strictEqual(spyOnGetText.calledWith("selectService"), true, "Exisitng select dialog is the Gateway select service dialog");
		//cleanups
		oSelectDialog.destroy();
	});
	QUnit.test("When source is cleared", function(assert) {
		//action
		oNavTargetContextmappingView.byId("idSource").setValue("");
		oNavTargetContextmappingView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith(""), false, "then empty context mapping service is not checked for registration");
		assert.strictEqual(spyOnsetFilterMappingService.calledWith(undefined), true, "then setFilterMappingService is called on navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingService(), undefined, "then service of context mapping is changed");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith(undefined), true, "then setFilterMappingEntitySet is called the navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "", "then entity set of context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "", "then context mapping entity set field is populated");
		assert.strictEqual(oNavTargetContextmappingView.getController().byId("idEntityLabel").getRequired(), false, "then context mapping entity label field is set as not required");
		assert.deepEqual(oNavTargetContextmappingView.byId("idEntity").getModel(), undefined, "then context mapping entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [], "then select properties of context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getSelectedKey(), "", "then context mapping selected property field is populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getModel(), undefined, "then context mapping selected property field model is set");
		assert.strictEqual(oNavTargetContextmappingView.getController().byId("idOptionalPropertyLabel").getRequired(), false, "then context mapping select property label field is set as not required");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), true, "then all selected properties are not fetched for the empty service and entity");
	});
	QUnit.test("When source is changed to an invalid service", function(assert) {
		//action
		oNavTargetContextmappingView.byId("idSource").setValue("test1");
		oNavTargetContextmappingView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("test1"), true, "then context mapping service is checked for registration");
		oNavTargetContextmappingView.getViewData().oConfigurationEditor.registerServiceAsPromise("test11").done(function(result){
			assert.strictEqual(result, undefined, "then context mapping service is an invalid service");	
		});
		
		assert.strictEqual(spyOnsetFilterMappingService.calledWith(undefined), true, "then setFilterMappingService is called on navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingService(), undefined, "then service of context mapping is changed");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith(undefined), true, "then setFilterMappingEntitySet is called the navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "", "then entity set of context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "", "then context mapping entity set field is populated");
		assert.strictEqual(oNavTargetContextmappingView.getController().byId("idEntityLabel").getRequired(), false, "then context mapping entity label field is set as not required");
		assert.deepEqual(oNavTargetContextmappingView.byId("idEntity").getModel(), undefined, "then context mapping entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [], "then select properties of context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getSelectedKey(), "", "then context mapping selected property field is populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getModel(), undefined, "then context mapping selected property field model is set");
		assert.strictEqual(oNavTargetContextmappingView.getController().byId("idOptionalPropertyLabel").getRequired(), false, "then context mapping select property label field is set as not required");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), false, "then all selected properties are not fetched for the empty service and entity");
	});
	QUnit.test("When entity set is changed and there are no common properties between new and old", function(assert) {
		//arrangement
		var oModelForProperties = {
			"Objects" : [ {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
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
		oNavTargetContextmappingView.byId("idEntity").setSelectedKey("entitySet2");
		oNavTargetContextmappingView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith("entitySet2"), true, "then setFilterMappingEntitySet is called the navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet2", "then entity set of context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "entitySet2", "then context mapping entity field is populated");
		//for select properties
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1", "property3" ], "then select properties of context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getSelectedKey(), "Not Available: property1", "then context mapping selected property field is populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getModel().getData(), oModelForProperties, "then context mapping selected property field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet2"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When entity set is changed and there are few common properties between new and old excluding previously selected properties", function(assert) {
		//arrangement
		var oModelForProperty = {
			"Objects" : [ {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			}, {
				"key" : "property2",
				"name" : "property2"
			}, {
				"key" : "property4",
				"name" : "property4"
			}, {
				"key" : "property11",
				"name" : "property11"
			} ]
		};
		//action
		oNavTargetContextmappingView.byId("idEntity").setSelectedKey("entitySet13");
		oNavTargetContextmappingView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith("entitySet13"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet13", "then entity set of nav target context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "entitySet13", "then nav target context mapping entity field is populated");
		//for select properties
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1", "property3" ], "then select properties of nav target context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getSelectedKey(), "Not Available: property1", "then nav target context mapping selected property field is populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getModel().getData(), oModelForProperty, "then nav target context mapping selected property field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet13"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When entity set is changed and there are few common properties between new and old including previously selected properties", function(assert) {
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
		oNavTargetContextmappingView.byId("idEntity").setSelectedKey("entitySet5");
		oNavTargetContextmappingView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith("entitySet5"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet5", "then entity set of nav target context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "entitySet5", "then nav target context mapping entity field is populated");
		//for select properties
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1", "property3" ], "then select properties of nav target context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getSelectedKey(), "Not Available: property1", "then nav target context mapping selected property field is populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getModel().getData(), oModelForProperty, "then nav target context mapping selected property field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet5"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When select property is changed", function(assert) {
		//action
		oNavTargetContextmappingView.byId("idOptionalProperty").setSelectedKey("property4");
		oNavTargetContextmappingView.getController().handleChangeForOptionalProperty();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property4" ], "then select properties of context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getSelectedKey(), "property4", "then context mapping selected property field is populated");
	});
	QUnit.test("Fetching validation state while view is valid", function(assert) {
		//assert
		assert.strictEqual(oNavTargetContextmappingView.getController().getValidationState(), true, "then navTargetContextMapping view is in valid state");
	});
	QUnit.test("Fetching validation state while view is not valid", function(assert) {
		var optionalProperty = oNavTargetContextmappingView.byId("idOptionalProperty");
		optionalProperty.setForceSelection(false);
		//action
		optionalProperty.setSelectedKey(undefined);
		//assert
		assert.strictEqual(oNavTargetContextmappingView.getController().getValidationState(), false, "then navTargetContextMapping view is not in valid state");
	});
	QUnit.test("When source displays suggestion items", function(assert) {
		//arrangement
		var sourceInputControl = oNavTargetContextmappingView.byId("idSource");
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
	QUnit.module("For a navigation target with existing context mapping service - Validate previously selected entity sets", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				spyOnGetAllEntitySetsOfService.restore();
				//Stub getAllEntitySetsOfService with an invalid entity set.Eg-Due to metadata changes the previously selected entity set is no more available
				spyOnGetAllEntitySetsOfService = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsOfServiceAsPromise", function() {
					return sap.apf.utils.createPromise([ "entitySet2", "entitySet3", "entitySet4" ]); //entitySet1 is no more available
				});
				oNavTargetContextmappingView = _instantiateView(oModelerInstance.firstNavigationtarget, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When navigation target is initialized and previously selected entity set does not exist anymore in the available entity sets", function(assert) {
		//arrange
		var oViewData = oNavTargetContextmappingView.getViewData();
		var oController = oNavTargetContextmappingView.getController();
		var oModelForEntity = {
			"Objects" : [ {
				"key" : "Not Available: entitySet1",
				"name" : "Not Available: entitySet1"
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
		var oModelForProperties = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property2",
				"name" : "property2"
			}, {
				"key" : "property3",
				"name" : "property3"
			}, {
				"key" : "property4",
				"name" : "property4"
			}, {
				"key" : "property1Text",
				"name" : "property1Text"
			}, {
				"key" : "property3Text",
				"name" : "property3Text"
			} ]
		};
		//assert
		assert.ok(oNavTargetContextmappingView, "then navTargetContextMapping view is available");
		// source section asserts
		assert.strictEqual(spyOnGetFilterMappingService.calledOnce, true, "then context mapping entity set is got from the navigation target object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then navigation target context mapping source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then navigation target context mapping source field is populated");
		// entity section asserts
		assert.strictEqual(spyOngetFilterMappingEntitySet.calledOnce, true, "then context mapping entity set is got from the navigation target object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then context mapping entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then context mapping entity label field is set as required");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then previously selected entity set is displayed which is invalid since its not available");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then context mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oNavTargetContextmappingView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectPropOfFilterResolution.calledOnce, true, "then context mapping select properties are got from the navigation target object");
		assert.strictEqual(oController.byId("idOptionalPropertyLabel").getText(), oViewData.oTextReader("mappedProperty"), "then context mapping select properties label is populated");
		assert.strictEqual(oController.byId("idOptionalPropertyLabel").getRequired(), true, "then context mapping select properties label field is set as required");
		assert.deepEqual(oController.byId("idOptionalProperty").getSelectedKey(), "property1", "then context mapping selected property field is populated");
		assert.deepEqual(oController.byId("idOptionalProperty").getModel().getData(), oModelForProperties, "then context mapping selected property field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oNavTargetContextmappingView.byId("idSource").getValue(), "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When entity set of navigation target is changed to a currently not available entity set", function(assert) {
		//action
		oNavTargetContextmappingView.byId("idEntity").setSelectedKey("Not Available: entitySet1");
		oNavTargetContextmappingView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith("entitySet1"), true, "then setFilterMappingEntitySet is called the navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet1", "then entity set of context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then context mapping entity field is populated");
		//for select properties
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1", "property3" ], "then select properties of context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getSelectedKey(), "property1", "then context mapping selected properties field are populated");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.module("For a navigation target with existing context mapping service - Validate previously selected properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				spyOnGetAllPropertiesOfEntitySet.restore();
				spyOnGetAllPropertiesOfEntitySet = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getAllPropertiesOfEntitySetAsPromise", function() {
					return sap.apf.utils.createPromise([ "property1", "property2", "property4", "property1Text", "property3Text" ]); //property 3 is not available due to change in metadata
				});
				oNavTargetContextmappingView = _instantiateView(oModelerInstance.firstNavigationtarget, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When navTargetContextMapping view is initialized", function(assert) {
		//arrange
		var oViewData = oNavTargetContextmappingView.getViewData();
		var oController = oNavTargetContextmappingView.getController();
		var oModelForEntity = _getModelForEntity();
		var aProperties = _getModelForProperties().Objects;
		aProperties.splice(2, 1);
		aProperties.splice(0, 0, {
			"key" : "Not Available: property3",
			"name" : "Not Available: property3"
		});
		var oModelForProperties = {
			"Objects" : aProperties
		};
		//assert
		assert.ok(oNavTargetContextmappingView, "then navTargetContextMapping view is available");
		// source section asserts
		assert.strictEqual(spyOnGetFilterMappingService.calledOnce, true, "then context mapping entity set is got from the navigation target object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then navigation target context mapping source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then navigation target context mapping source field is populated");
		// entity section asserts
		assert.strictEqual(spyOngetFilterMappingEntitySet.calledOnce, true, "then context mapping entity set is got from the navigation target object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then context mapping entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then context mapping entity label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet1", "then context mapping entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then context mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oNavTargetContextmappingView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectPropOfFilterResolution.calledOnce, true, "then context mapping select properties are got from the navigation target object");
		assert.strictEqual(oController.byId("idOptionalPropertyLabel").getText(), oViewData.oTextReader("mappedProperty"), "then context mapping select properties label is populated");
		assert.strictEqual(oController.byId("idOptionalPropertyLabel").getRequired(), true, "then context mapping select properties label field is set as required");
		assert.deepEqual(oController.byId("idOptionalProperty").getSelectedKey(), "Not Available: property3", "then context mapping selected property field is populated");
		assert.deepEqual(oController.byId("idOptionalProperty").getModel().getData(), oModelForProperties, "then context mapping selected property field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oNavTargetContextmappingView.byId("idSource").getValue(), oController.byId("idEntity").getSelectedKey()), true,
				"then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When select property is changed - a not available property is selected", function(assert) {
		//action
		oNavTargetContextmappingView.byId("idOptionalProperty").setSelectedKey("Not Available: property3");
		oNavTargetContextmappingView.getController().handleChangeForOptionalProperty();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property3"], "then select properties of context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idOptionalProperty").getSelectedKey(), "Not Available: property3", "then context mapping selected properties field are populated");
	});
}());