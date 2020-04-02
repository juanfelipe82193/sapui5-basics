/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	'sap/apf/modeler/ui/controller/facetFilterFRR.controller',
	'sap/apf/modeler/ui/controller/requestOptions',
	'sap/apf/modeler/ui/utils/constants',
	'sap/apf/testhelper/modelerUIHelper'
	], function(FacetFilterController, RequestOptions, modelerConstants, modelerUIHelper) {
	'use strict';

	var oFRRView, spyOnGetText, spyOnGetServiceOfFilterResolution, spyOnGetAllPropertiesOfEntitySet, spyOnGetEntitySetOfFilterResolution, spyOnGetAllEntitySetsOfService, spyOnGetSelectPropOfFilterResolution, spyOnConfigEditorRegisterService, spyOnSetServiceOfFilterResolution, spyOnSetEntitySetOfFilterResolution, spyOnAddSelectPropertyOfFilterResolution, spyOnConfigEditorSetIsUnsaved, spyOnRemoveSelectPropForValueHelp, oModelerInstance;
	function _doNothing() {
		return "";
	}
	function _commonSpiesInBeforeEach() {
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnConfigEditorRegisterService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "registerServiceAsPromise");
		spyOnGetAllEntitySetsOfService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsOfServiceAsPromise");
		spyOnGetAllPropertiesOfEntitySet = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllPropertiesOfEntitySetAsPromise");
		spyOnGetServiceOfFilterResolution = sinon.spy(oModelerInstance.facetFilterUnsaved, "getServiceOfFilterResolution");
		spyOnGetEntitySetOfFilterResolution = sinon.spy(oModelerInstance.facetFilterUnsaved, "getEntitySetOfFilterResolution");
		spyOnGetSelectPropOfFilterResolution = sinon.spy(oModelerInstance.facetFilterUnsaved, "getSelectPropertiesOfFilterResolution");
		spyOnSetServiceOfFilterResolution = sinon.spy(oModelerInstance.facetFilterUnsaved, "setServiceOfFilterResolution");
		spyOnSetEntitySetOfFilterResolution = sinon.spy(oModelerInstance.facetFilterUnsaved, "setEntitySetOfFilterResolution");
		spyOnAddSelectPropertyOfFilterResolution = sinon.spy(oModelerInstance.facetFilterUnsaved, "addSelectPropertyOfFilterResolution");
		spyOnRemoveSelectPropForValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "removeSelectPropertyOfFilterResolution");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
		oModelerInstance.facetFilterUnsaved.setUseSameRequestForValueHelpAndFilterResolution(false);
	}
	function _commonCleanUpsInAfterEach() {
		oFRRView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oFRRView.getViewData().oConfigurationEditor.registerServiceAsPromise.restore();
		oFRRView.getViewData().oConfigurationEditor.getAllPropertiesOfEntitySetAsPromise.restore();
		oFRRView.getViewData().oConfigurationEditor.getAllEntitySetsOfServiceAsPromise.restore();
		spyOnGetText.restore();
		modelerUIHelper.destroyModelerInstance();
		oModelerInstance.reset();
		oFRRView.destroy();
	}
	/* overwrite controller definitions */
	function _instantiateView(sId, assert) {
		var oFRRController = new sap.ui.controller("sap.apf.modeler.ui.controller.facetFilterFRR");
		var spyOnInit = sinon.spy(oFRRController, "onInit");
		oFRRView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.requestOptions",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oFRRController,
			viewData : {
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oTextReader : oModelerInstance.modelerCore.getText,
				oParentObject : sId,
				getCalatogServiceUri : _doNothing
			}
		});
		assert.strictEqual(spyOnInit.calledOnce, true, "then request options onInit function is called and view is initialized");
		return oFRRView;
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
	QUnit.module("For a facet filter with existing FRR", {
		beforeEach : function(assert) {
			var done = assert.async();
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				oFRRView = _instantiateView(oModelerInstance.facetFilterUnsaved, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When FRR view is initialized", function(assert) {
		//arrange
		var oViewData = oFRRView.getViewData();
		var oController = oFRRView.getController();
		var oModelForVHREntity = _getModelForEntity();
		var oModelForVHRSelect = _getModelForProperties();
		//assert
		assert.ok(oFRRView, "then FRR view is available");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfFilterResolution.calledOnce, true, "then filter resolution entity set is got from the facet filter object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then filter resolution source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then filter resolution source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetEntitySetOfFilterResolution.calledOnce, true, "then filter resolution entity set is got from the facet filter object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then filter resolution entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then filter resolution entity label field is set as required");
	
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet1", "then filter resolution entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForVHREntity, "then filter resolution entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oFRRView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectPropOfFilterResolution.calledOnce, true, "then filter resolution select properties are got from the facet filter object");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getText(), oViewData.oTextReader("vhSelectProperties"), "then filter resolution select properties label is populated");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getRequired(), true, "then filter resolution select properties label field is set as required");
		assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then filter resolution selected properties field are populated");
		assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelForVHRSelect, "then filter resolution selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oFRRView.byId("idSource").getValue(), oController.byId("idEntity").getSelectedKey()), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source is changed and there are no common entities between new and old source", function(assert) {
		//arrangement
		var oModelForVHREntity = {
			"Objects" : [ {
				"key" : "Not Available: entitySet1",
				"name" : "Not Available: entitySet1"
			}, {
				"key" : "entitySet9",
				"name" : "entitySet9"
			} ]
		};
		var oModelForVHRSelect = {
			"Objects" : [ {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			} ]
		};
		var spyFireEvent = sinon.spy(oFRRView, "fireEvent");
		//action
		oFRRView.byId("idSource").setValue("testService3");
		oFRRView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyFireEvent.calledWith(modelerConstants.events.facetFilter.UPDATEPROPERTIES), true, "then updateFFProperties is fired");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService3"), true, "then filter resolution service is checked for registration");
		oFRRView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService3").done(function(result){
			assert.strictEqual(result, true, "then filter resolution service is valid service");
		});
		
		assert.strictEqual(spyOnSetServiceOfFilterResolution.calledWith("testService3"), true, "then setServiceOfFilterResolution is called on facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getServiceOfFilterResolution(), "testService3", "then service of filter resolution is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith("entitySet1"), true, "then setEntitySetOfFilterResolution is called the facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "entitySet1", "then entity set of filter resolution is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then filter resolution entity field is populated");
		assert.deepEqual(oFRRView.byId("idEntity").getModel().getData(), oModelForVHREntity, "then filter resolution entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService3"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property1"), true, "then addSelectPropertyOfFilterResolution is called the facet filter object");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of filter resolution is removed");
		setTimeout(function(){
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [ "property1", "property3" ], "then select properties of filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "Not Available: property3" ], "then filter resolution selected properties field are populated");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getModel().getData(), oModelForVHRSelect, "then filter resolution selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService3", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
	},1);
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
		oFRRView.byId("idSource").setValue("testService5");
		oFRRView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService5"), true, "then FF filter resolution service is checked for registration");
		oFRRView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService5").done(function(result){
			assert.strictEqual(result, true, "then FF filter resolution service is valid service");	
		});
		
		assert.strictEqual(spyOnSetServiceOfFilterResolution.calledWith("testService5"), true, "then setService is called on step object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getServiceOfFilterResolution(), "testService5", "then service of FF filter resolution is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith("entitySet1"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "entitySet1", "then entity set of FF filter resolution is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then FF filter resolution entity field is populated");
		assert.deepEqual(oFRRView.byId("idEntity").getModel().getData(), oModelForEntity, "then FF filter resolution entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService5"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of FF filter resolution is removed");
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of FF filter resolution is removed");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [ "property1", "property3" ], "then select properties of FF filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "Not Available: property3" ], "then FF filter resolution selected properties field are populated");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then FF filter resolution selected properties field model is set");
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
		oFRRView.byId("idSource").setValue("testService6");
		oFRRView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService6"), true, "then FF filter resolution service is checked for registration");
		oFRRView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService6").done(function(result){
			assert.strictEqual(result, true, "then FF filter resolution service is valid service");
		});
		
		assert.strictEqual(spyOnSetServiceOfFilterResolution.calledWith("testService6"), true, "then setService is called on step object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getServiceOfFilterResolution(), "testService6", "then service of FF filter resolution is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith("entitySet1"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "entitySet1", "then entity set of FF filter resolution is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "entitySet1", "then FF filter resolution entity field is populated");
		assert.deepEqual(oFRRView.byId("idEntity").getModel().getData(), oModelForEntity, "then FF filter resolution entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService6"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property1"), true, "then select property is added");
		assert.strictEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property3"), true, "then select property is added");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [ "property1", "property3" ], "then select properties of FF filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then FF filter resolution selected properties field are populated");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then FF filter resolution selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService6", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source selected from value help in the input field", function(assert) {
		//action
		oFRRView.byId("idSource").fireValueHelpRequest();
		sap.ui.getCore().applyChanges();
		var oSelectDialog = oFRRView.byId("idCatalogServiceView").byId("idGatewayCatalogListDialog");
		//assert
		assert.ok(oSelectDialog, "Select dialog exists after firing value help request");
		assert.strictEqual(spyOnGetText.calledWith("selectService"), true, "Exisitng select dialog is the Gateway select service dialog");
		//cleanups
		oSelectDialog.destroy();
	});
	QUnit.test("When source is cleared", function(assert) {
		//action
		oFRRView.byId("idSource").setValue("");
		oFRRView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith(""), false, "then empty filter resolution service is not checked for registration");
		assert.strictEqual(spyOnSetServiceOfFilterResolution.calledWith(undefined), true, "then setServiceOfFilterResolution is called on facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getServiceOfFilterResolution(), undefined, "then service of filter resolution is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith(undefined), true, "then setEntitySetOfFilterResolution is called the facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "", "then entity set of filter resolution is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "", "then filter resolution entity set field is populated");
		assert.strictEqual(oFRRView.getController().byId("idEntityLabel").getRequired(), false, "then filter resolution entity label field is set as not required");
		assert.deepEqual(oFRRView.byId("idEntity").getModel(), undefined, "then filter resolution entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [], "then select properties of filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [], "then filter resolution selected properties field are populated");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getModel(), undefined, "then filter resolution selected properties field model is set");
		assert.strictEqual(oFRRView.getController().byId("idSelectPropertiesLabel").getRequired(), false, "then filter resolution select properties label field is set as not required");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), true, "then all selected properties are not fetched for the empty service and entity");
	});
	QUnit.test("When source is changed to an invalid service", function(assert) {
		//action
		oFRRView.byId("idSource").setValue("test1");
		oFRRView.getController().handleChangeForSourceAsPromise();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("test1"), true, "then filter resolution service is checked for registration");
		oFRRView.getViewData().oConfigurationEditor.registerServiceAsPromise("test11").done(function(result){
			assert.strictEqual(result, undefined, "then filter resolution service is an invalid service");	
		});
		
		assert.strictEqual(spyOnSetServiceOfFilterResolution.calledWith(undefined), true, "then setServiceOfFilterResolution is called on facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getServiceOfFilterResolution(), undefined, "then service of filter resolution is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith(undefined), true, "then setEntitySetOfFilterResolution is called the facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "", "then entity set of filter resolution is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "", "then filter resolution entity set field is populated");
		assert.strictEqual(oFRRView.getController().byId("idEntityLabel").getRequired(), false, "then filter resolution entity label field is set as not required");
		assert.deepEqual(oFRRView.byId("idEntity").getModel(), undefined, "then filter resolution entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [], "then select properties of filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [], "then filter resolution selected properties field are populated");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getModel(), undefined, "then filter resolution selected properties field model is set");
		assert.strictEqual(oFRRView.getController().byId("idSelectPropertiesLabel").getRequired(), false, "then filter resolution select properties label field is set as not required");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), false, "then all selected properties are not fetched for the empty service and entity");
	});
	QUnit.test("When entity set is changed and there are no common properties between new and old", function(assert) {
		//arrangement
		var oModelForVHRSelect = {
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
		oFRRView.byId("idEntity").setSelectedKey("entitySet2");
		oFRRView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith("entitySet2"), true, "then setEntitySetOfFilterResolution is called the facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "entitySet2", "then entity set of filter resolution is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "entitySet2", "then filter resolution entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [ "property1", "property3" ], "then select properties of filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "Not Available: property3" ], "then filter resolution selected properties field are populated");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getModel().getData(), oModelForVHRSelect, "then filter resolution selected properties field model is set");
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
		oFRRView.byId("idEntity").setSelectedKey("entitySet13");
		oFRRView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith("entitySet13"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "entitySet13", "then entity set of FF filter resolution is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "entitySet13", "then FF filter resolution entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of FF filter resolution is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of FF filter resolution is removed");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [ "property1", "property3" ], "then select properties of FF filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "Not Available: property3" ], "then FF filter resolution selected properties field are populated");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then FF filter resolution selected properties field model is set");
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
		oFRRView.byId("idEntity").setSelectedKey("entitySet5");
		oFRRView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith("entitySet5"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "entitySet5", "then entity set of FF filter resolution is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "entitySet5", "then FF filter resolution entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of FF filter resolution is removed");
		assert.deepEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property3"), true, "then select property of FF filter resolution is added");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [ "property1", "property3" ], "then select properties of FF filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "property3" ], "then FF filter resolution selected properties field are populated");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then FF filter resolution selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet5"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When select property is changed", function(assert) {
		//action
		oFRRView.byId("idSelectProperties").setSelectedKeys([ "property1", "property4" ]);
		oFRRView.getController().handleChangeForSelectProperty();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of filter resolution is removed");
		setTimeout(function(){
		assert.strictEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property1"), true, "then addSelectPropertyOfFilterResolution is called the facet filter object");
		assert.strictEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property4"), true, "then addSelectPropertyOfFilterResolution is called the facet filter object");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [ "property1", "property4" ], "then select properties of filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property4" ], "then filter resolution selected properties field are populated");
		},1);
		});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrangement
		oFRRView.getViewData().oParentObject.setInvisible();
		//action
		oFRRView.getController().clearFRRFields();
		//assert
		assert.strictEqual(oFRRView.getViewData().oParentObject.getServiceOfFilterResolution(), undefined, "then filter resolution source is cleared");
		assert.strictEqual(oFRRView.byId("idSource").getValue(), "", "then filter resolution source field is cleared");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), undefined, "then filter resolution entity set is cleared");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "", "then filter resolution entity field is cleared");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [], "then filter resolution select properties are cleared");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [], "then filter resolution select properties field is cleared");
		//cleanup
		oFRRView.getViewData().oParentObject.setVisible();
	});
	QUnit.test("When facet filter is set to use same as VHR", function(assert) {
		//arrangement
		oFRRView.getViewData().oParentObject.setUseSameRequestForValueHelpAndFilterResolution(true);
		//action
		oFRRView.getController().handleCopy();
		//assert
		assert.strictEqual(oFRRView.byId("idSource").getValue(), "testService1", "then filter resolution source field is set");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "entitySet1", "then filter resolution entity field is set");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then filter resolution select properties field is set");
	});
	QUnit.test("When facet filter is set to use same as VHR", function(assert) {
		//arrangement
		oFRRView.getViewData().oParentObject.setUseSameRequestForValueHelpAndFilterResolution(true);
		//action
		oFRRView.getController().enableOrDisableView();
		//assert
		assert.strictEqual(oFRRView.byId("idSource").getEnabled(), false, "then filter resolution source field is not enabled");
		assert.strictEqual(oFRRView.byId("idEntity").getEnabled(), false, "then filter resolution entity field is not enabled");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getEnabled(), false, "then filter resolution select properties field is not enabled");
	});
	QUnit.test("When facet filter is set to use same as VHR", function(assert) {
		//action
		oFRRView.getController().enableOrDisableView();
		//assert
		assert.strictEqual(oFRRView.byId("idSource").getEnabled(), true, "then filter resolution source field is enabled");
		assert.strictEqual(oFRRView.byId("idEntity").getEnabled(), true, "then filter resolution entity field is enabled");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getEnabled(), true, "then filter resolution select properties field is enabled");
	});
	QUnit.test("Fetching validation state while view is valid", function(assert) {
		//assert
		assert.strictEqual(oFRRView.getController().getValidationState(), true, "then FRR view is in valid state");
	});
	QUnit.test("Fetching validation state while view is not valid", function(assert) {
		//action
		oFRRView.byId("idSelectProperties").setSelectedKeys([]);
		//assert
		setTimeout(function(){
		assert.strictEqual(oFRRView.getController().getValidationState(), false, "then FRR view is not in valid state");
		},1);
		});
	QUnit.test("When source displays suggestion items", function(assert) {
		//arrangement
		var sourceInputControl = oFRRView.byId("idSource");
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
	QUnit.module("For a facet filter with existing FRR - Validate previously selected entity sets", {
		beforeEach : function(assert) {
			var done = assert.async();
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				spyOnGetAllEntitySetsOfService.restore();
				//Stub getAllEntitySetsOfService with an invalid entity set.Eg-Due to metadata changes the previously selected entity set is no more available
				spyOnGetAllEntitySetsOfService = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsOfServiceAsPromise", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve([ "entitySet2", "entitySet3", "entitySet4" ]); //entitySet1 is no more available
					return deferred.promise();
				});
				oFRRView = _instantiateView(oModelerInstance.facetFilterUnsaved, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When facet filter is initialized and previously selected entity set does not exist anymore in the available entity sets", function(assert) {
		//arrange
		var oViewData = oFRRView.getViewData();
		var oController = oFRRView.getController();
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
		assert.ok(oFRRView, "then FRR view is available");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfFilterResolution.calledOnce, true, "then FRR entity set is got from the facet filter object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then facet filter FRR source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then facet filter FRR source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetEntitySetOfFilterResolution.calledOnce, true, "then FRR entity set is got from the facet filter object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then FRR entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then FRR entity label field is set as required");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then previously selected entity set is displayed which is invalid since its not available");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then FRR entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oFRRView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectPropOfFilterResolution.calledOnce, true, "then FRR select properties are got from the facet filter object");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getText(), oViewData.oTextReader("vhSelectProperties"), "then FRR select properties label is populated");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getRequired(), true, "then FRR select properties label field is set as required");
		assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then FRR selected properties field are populated");
		assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then FRR selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oFRRView.byId("idSource").getValue(), "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When entity set of facet filter is changed to a currently not available entity set", function(assert) {
		//action
		oFRRView.byId("idEntity").setSelectedKey("Not Available: entitySet1");
		oFRRView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith("entitySet1"), true, "then EntitySet is called on the facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "entitySet1", "then entity set of FRR is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then FRR entity field is populated");
		//for select properties
		assert.strictEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property1"), true, "then addSelectPropertyOfFilterResolution is called the facet filter object");
		assert.strictEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property3"), true, "then addSelectPropertyOfFilterResolution is called the facet filter object");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [ "property1", "property3" ], "then select properties of FRR is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then FRR selected properties field are populated");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.module("For a facet filter with existing FRR - Validate previously selected properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				spyOnGetAllPropertiesOfEntitySet.restore();
				spyOnGetAllPropertiesOfEntitySet = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getAllPropertiesOfEntitySetAsPromise", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve([ "property1", "property2", "property4", "property1Text", "property3Text" ]); //property 3 is not available due to change in metadata
					return deferred.promise();
				});
				oFRRView = _instantiateView(oModelerInstance.facetFilterUnsaved, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When FRR view is initialized", function(assert) {
		//arrange
		var oViewData = oFRRView.getViewData();
		var oController = oFRRView.getController();
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
		assert.ok(oFRRView, "then FRR view is available");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfFilterResolution.calledOnce, true, "then filter resolution entity set is got from the facet filter object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then facet filter filter resolution source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then facet filter filter resolution source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetEntitySetOfFilterResolution.calledOnce, true, "then filter resolution entity set is got from the facet filter object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then filter resolution entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then filter resolution entity label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet1", "then filter resolution entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then filter resolution entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oFRRView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectPropOfFilterResolution.calledOnce, true, "then filter resolution select properties are got from the facet filter object");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getText(), oViewData.oTextReader("vhSelectProperties"), "then filter resolution select properties label is populated");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getRequired(), true, "then filter resolution select properties label field is set as required");
		assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property3", "property1" ], "then filter resolution selected properties field are populated");
		assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelForProperties, "then filter resolution selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oFRRView.byId("idSource").getValue(), oController.byId("idEntity").getSelectedKey()), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When select property is changed - a not available property is selected", function(assert) {
		//action
		oFRRView.byId("idSelectProperties").setSelectedKeys([ "Not Available: property3", "property1" ]);
		oFRRView.getController().handleChangeForSelectProperty();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.strictEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property3"), true, "then addSelectPropertiesOfValueHelp is called the facet filter object");
		assert.strictEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the facet filter object");
		setTimeout(function(){
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [ "property3", "property1" ], "then select properties of filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property3", "property1" ], "then filter resolution selected properties field are populated");
		},1);
		});
});
