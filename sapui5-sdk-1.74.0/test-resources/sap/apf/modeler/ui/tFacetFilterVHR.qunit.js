/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tFacetFilterVHR');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function() {
	'use strict';
	var oVHRView, spyOnGetText, spyOnGetServiceOfValueHelp, spyOnGetAlias, spyOnSetAlias, spyOnGetAllPropertiesOfEntitySet, spyOnGetEntitySetOfValueHelp, spyOnGetAllEntitySetsOfService, spyOnGetSelectPropOfValueHelp, spyOnConfigEditorRegisterService, spyOnSetServiceOfValueHelp, spyOnSetEntitySetOfValueHelp, spyOnAddSelectPropForValueHelp, spyOnConfigEditorSetIsUnsaved, spyOnRemoveSelectPropForValueHelp, oModelerInstance;
	function _doNothing() {
		return "";
	}
	function _eventCreation(value) {
		return {
			getSource : function() {
				return value;
			}
		};
	}
	function _commonSpiesInBeforeEach() {
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnConfigEditorRegisterService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "registerServiceAsPromise");
		spyOnGetAllPropertiesOfEntitySet = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllPropertiesOfEntitySetAsPromise");
		spyOnGetServiceOfValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "getServiceOfValueHelp");
		spyOnGetAlias = sinon.spy(oModelerInstance.facetFilterUnsaved, "getAlias");
		spyOnSetAlias = sinon.spy(oModelerInstance.facetFilterUnsaved, "setAlias");
		spyOnGetEntitySetOfValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "getEntitySetOfValueHelp");
		spyOnGetSelectPropOfValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "getSelectPropertiesOfValueHelp");
		spyOnSetServiceOfValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "setServiceOfValueHelp");
		spyOnSetEntitySetOfValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "setEntitySetOfValueHelp");
		spyOnAddSelectPropForValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "addSelectPropertyOfValueHelp");
		spyOnRemoveSelectPropForValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "removeSelectPropertyOfValueHelp");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
		spyOnGetAllEntitySetsOfService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsOfServiceAsPromise");
	}
	function _commonCleanUpsInAfterEach() {
		oVHRView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oVHRView.getViewData().oConfigurationEditor.registerServiceAsPromise.restore();
		oVHRView.getViewData().oConfigurationEditor.getAllPropertiesOfEntitySetAsPromise.restore();
		oVHRView.getViewData().oConfigurationEditor.getAllEntitySetsOfServiceAsPromise.restore();
		spyOnGetText.restore();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oModelerInstance.reset();
		oVHRView.destroy();
	}
	function _instantiateView(sId, assert) {
		// eslint-disable-next-line new-cap
		var oVHRController = new sap.ui.controller("sap.apf.modeler.ui.controller.facetFilterVHR");
		var spyOnInit = sinon.spy(oVHRController, "onInit");
		// eslint-disable-next-line new-cap
		oVHRView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.requestOptions",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oVHRController,
			viewData : {
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oTextReader : oModelerInstance.modelerCore.getText,
				oParentObject : sId,
				getCalatogServiceUri : _doNothing
			}
		});
		oVHRView.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		assert.strictEqual(spyOnInit.calledOnce, true, "then request options onInit function is called and view is initialized");
		return oVHRView;
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
	function _getModelForAlias() {
		return {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property3",
				"name" : "property3"
			} ]
		};
	}
	QUnit.module("For a Facetfilter with existing VHR", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				oVHRView = _instantiateView(oModelerInstance.facetFilterUnsaved, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When VHR view is initialized", function(assert) {
		//arrange
		var oViewData = oVHRView.getViewData();
		var oController = oVHRView.getController();
		var oModelForVHREntity = _getModelForEntity();
		var oModelForVHRSelect = _getModelForProperties();
		var oModelForVHRAlias = _getModelForAlias();
		//assert
		assert.ok(oVHRView, "then VHR view is available");
		// required fields asserts
		assert.strictEqual(oVHRView.getController().byId("idEntityLabel").getRequired(), true, "then value help entity label field is set as required");
		assert.strictEqual(oVHRView.getController().byId("idSelectPropertiesLabel").getRequired(), true, "then value help select properties label field is set as required");
		assert.strictEqual(oVHRView.getController().byId("idSourceLabel").getRequired(), true, "then value help service label field is set as required");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfValueHelp.calledOnce, true, "then value help entity set is got from the  object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then value help source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then value help source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetEntitySetOfValueHelp.calledOnce, true, "then value help entity set is got from the  object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then value help entity label is populated");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet1", "then value help entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForVHREntity, "then value help entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oVHRView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectPropOfValueHelp.calledOnce, true, "then value help select properties are got from the  object");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getText(), oViewData.oTextReader("vhSelectProperties"), "then value help select properties label is populated");
		assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then value help selected properties field are populated");
		assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelForVHRSelect, "then value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oVHRView.byId("idSource").getValue(), oController.byId("idEntity").getSelectedKey()), true, "then all selected properties are fetched for the correct service and entity");
		//alias assertions
		assert.strictEqual(spyOnGetAlias.calledOnce, true, "then value help alias got from the selected properties");
		assert.strictEqual(spyOnGetText.calledWith("ffAlias"), true, "then alias label is populated");
		assert.deepEqual(oController.byId("idOptionalRequestField").getSelectedKey(), "property3", "then alias field's selected property is populated");
		assert.deepEqual(oController.byId("idOptionalRequestField").getModel().getData(), oModelForVHRAlias, "then alias field model is set");
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
		var oModelForVHRAlias = {
			"Objects" : [ {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			} ]
		};
		var spyFireEvent = sinon.spy(oVHRView, "fireEvent");
		//action
		oVHRView.getController().handleChangeForSourceAsPromise(_eventCreation(oVHRView.byId("idSource").setValue("testService3")));
		//assert
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.facetFilter.UPDATEPROPERTIES), true, "then updateFFProperties is fired when source is changed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService3"), true, "then value help service is checked for registration");
		oVHRView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService3").done(function(result){
			assert.strictEqual(result, true, "then value help service is valid service");
		});
		
		assert.strictEqual(spyOnSetServiceOfValueHelp.calledWith("testService3"), true, "then setServiceOfValueHelp is called on  object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getServiceOfValueHelp(), "testService3", "then service of value help is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith("entitySet1"), true, "then setEntitySetOfValueHelp is called the  object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "entitySet1", "then entity set of value help is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then value help entity field is populated");
		assert.deepEqual(oVHRView.byId("idEntity").getModel().getData(), oModelForVHREntity, "then value help entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService3"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnAddSelectPropForValueHelp.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the  object");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then existing select property of value help is removed");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [ "property1", "property3" ], "then select properties of value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "Not Available: property3" ], "then value help selected properties field are populated");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getModel().getData(), oModelForVHRSelect, "then value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService3", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
		//for alias
		assert.deepEqual(spyOnSetAlias.calledWith(undefined), true, "then existing alias is removed since this property does not exist anymore in VHR alias items");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getAlias(), "property3", "then alias of VHR is changed to undefined");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then alias field selected key is not set");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getModel().getData(), oModelForVHRAlias, "then VHR alias field new model is set");
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
		oVHRView.getController().handleChangeForSourceAsPromise(_eventCreation(oVHRView.byId("idSource").setValue("testService5")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService5"), true, "then facet filter value help service is checked for registration");
		oVHRView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService5").done(function(result){
			assert.strictEqual(result, true, "then facet filter value help service is valid service");
		});
		
		assert.strictEqual(spyOnSetServiceOfValueHelp.calledWith("testService5"), true, "then setService is called on step object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getServiceOfValueHelp(), "testService5", "then service of facet filter value help is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith("entitySet1"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "entitySet1", "then entity set of facet filter value help is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then facet filter value help entity field is populated");
		assert.deepEqual(oVHRView.byId("idEntity").getModel().getData(), oModelForEntity, "then facet filter value help entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService5"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then existing select property of facet filter value help is removed");
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then existing select property of facet filter value help is removed");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [ "property1", "property3" ], "then select properties of facet filter value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "Not Available: property3" ], "then facet filter value help selected properties field are populated");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then facet filter value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService5", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
		//for alias
		assert.deepEqual(spyOnSetAlias.calledWith(undefined), true, "then existing alias is removed since this property does not exist anymore in VHR alias items");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getAlias(), "property3", "then alias of VHR is changed to undefined");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then alias field selected key is not set");
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
		var oModelForVHRAlias = _getModelForAlias();
		//action
		oVHRView.getController().handleChangeForSourceAsPromise(_eventCreation(oVHRView.byId("idSource").setValue("testService6")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService6"), true, "then facet filter value help service is checked for registration");
		oVHRView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService6").done(function(result){
			assert.strictEqual(result, true, "then facet filter value help service is valid service");
		});
		
		assert.strictEqual(spyOnSetServiceOfValueHelp.calledWith("testService6"), true, "then setService is called on step object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getServiceOfValueHelp(), "testService6", "then service of facet filter value help is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith("entitySet1"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "entitySet1", "then entity set of facet filter value help is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "entitySet1", "then facet filter value help entity field is populated");
		assert.deepEqual(oVHRView.byId("idEntity").getModel().getData(), oModelForEntity, "then facet filter value help entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService6"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnAddSelectPropForValueHelp.calledWith("property1"), true, "then select property is added");
		assert.strictEqual(spyOnAddSelectPropForValueHelp.calledWith("property3"), true, "then select property is added");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [ "property1", "property3" ], "then select properties of facet filter value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then facet filter value help selected properties field are populated");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then facet filter value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService6", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
		//for alias
		assert.deepEqual(oVHRView.getViewData().oParentObject.getAlias(), "property3", "then alias of VHR is property3");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "property3", "then alias field selected key is property3");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getModel().getData(), oModelForVHRAlias, "then VHR alias field new model is set");
	});
	QUnit.test("When source selected from value help in the input field", function(assert) {
		//action
		oVHRView.byId("idSource").fireValueHelpRequest();
		sap.ui.getCore().applyChanges();
		var oSelectDialog = oVHRView.byId("idCatalogServiceView").byId("idGatewayCatalogListDialog");
		//assert
		assert.ok(oSelectDialog, "Select dialog exists after firing value help request");
		assert.strictEqual(spyOnGetText.calledWith("selectService"), true, "The existing select dialog is the Gateway select service dialog");
		//cleanups
		oSelectDialog.destroy();
	});
	QUnit.test("When source is cleared", function(assert) {
		//action
		oVHRView.getController().handleChangeForSourceAsPromise(_eventCreation(oVHRView.byId("idSource").setValue("")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith(""), false, "then empty value help service is not checked for registration");
		assert.strictEqual(spyOnSetServiceOfValueHelp.calledWith(undefined), true, "then setServiceOfValueHelp is called on  object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getServiceOfValueHelp(), undefined, "then service of value help is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith(undefined), true, "then setEntitySetOfValueHelp is called the  object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "", "then entity set of value help is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "", "then value help entity set field is populated");
		assert.deepEqual(oVHRView.byId("idEntity").getModel(), undefined, "then value help entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then existing select property of value help is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then existing select property of value help is removed");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [], "then select properties of value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [], "then value help selected properties field are populated");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getModel(), undefined, "then value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), true, "then all selected properties are not fetched for the empty service and entity");
		//for alias
		assert.deepEqual(spyOnSetAlias.calledWith(undefined), true, "then existing alias is removed since this property does not exist anymore in VHR alias items");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getAlias(), undefined, "then alias of VHR is still undefined as no key is set to alias");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "", "then alias field selected key is null");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getModel(), undefined, "then VHR alias field new model is set to empty");
	});
	QUnit.test("When source is changed to an invalid service", function(assert) {
		//action
		oVHRView.getController().handleChangeForSourceAsPromise(_eventCreation(oVHRView.byId("idSource").setValue("test1")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("test1"), true, "then value help service is checked for registration");
		oVHRView.getViewData().oConfigurationEditor.registerServiceAsPromise("test11").done(function(result){
			assert.strictEqual(result, undefined, "then value help service is an invalid service");
		});
		
		assert.strictEqual(spyOnSetServiceOfValueHelp.calledWith(undefined), true, "then setServiceOfValueHelp is called on  object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getServiceOfValueHelp(), undefined, "then service of value help is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith(undefined), true, "then setEntitySetOfValueHelp is called the  object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "", "then entity set of value help is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "", "then value help entity set field is populated");
		assert.deepEqual(oVHRView.byId("idEntity").getModel(), undefined, "then value help entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then existing select property of value help is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then existing select property of value help is removed");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [], "then select properties of value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [], "then value help selected properties field are populated");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getModel(), undefined, "then value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), false, "then all selected properties are not fetched for the empty service and entity");
		//for alias
		assert.deepEqual(spyOnSetAlias.calledWith(undefined), true, "then existing alias is removed since this property does not exist anymore in VHR alias items");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getAlias(), undefined, "then alias of VHR is still undefined as no key is set to alias");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "", "then alias field selected key is null");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getModel(), undefined, "then VHR alias field new model is set to empty");
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
		oVHRView.getController().handleChangeForEntity(_eventCreation(oVHRView.byId("idEntity").setSelectedKey("entitySet2")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith("entitySet2"), true, "then setEntitySetOfValueHelp is called the  object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "entitySet2", "then entity set of value help is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "entitySet2", "then value help entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then existing select property of value help is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then existing select property of value help is removed");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [ "property1", "property3" ], "then select properties of value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "Not Available: property3" ], "then value help selected properties field are populated");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getModel().getData(), oModelForVHRSelect, "then value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet2"), true, "then all selected properties are fetched for the correct service and entity");
		//for alias
		assert.deepEqual(spyOnSetAlias.calledWith(undefined), true, "then existing alias is removed since this property does not exist anymore in VHR alias items");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getAlias(), "property3", "then alias of VHR is still undefined as no key is set to alias");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then alias field selected key is null");
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
		oVHRView.getController().handleChangeForEntity(_eventCreation(oVHRView.byId("idEntity").setSelectedKey("entitySet13")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith("entitySet13"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "entitySet13", "then entity set of facet filter value help is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "entitySet13", "then facet filter value help entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then existing select property of facet filter value help is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then existing select property of facet filter value help is removed");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [ "property1", "property3" ], "then select properties of facet filter value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "Not Available: property3" ], "then facet filter value help selected properties field are populated");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then facet filter value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet13"), true, "then all selected properties are fetched for the correct service and entity");
		//for alias
		assert.deepEqual(oVHRView.getViewData().oParentObject.getAlias(), "property3", "then alias of VHR is still undefined as no key is set to alias");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then alias field selected key is null");
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
		var oModelForVHRAlias = {
			"Objects" : [ {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "property3",
				"name" : "property3"
			} ]
		};
		//action
		oVHRView.getController().handleChangeForEntity(_eventCreation(oVHRView.byId("idEntity").setSelectedKey("entitySet5")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith("entitySet5"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "entitySet5", "then entity set of facet filter value help is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "entitySet5", "then facet filter value help entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then existing select property of facet filter value help is removed");
		assert.deepEqual(spyOnAddSelectPropForValueHelp.calledWith("property3"), true, "then select property of facet filter value help is added");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [ "property1", "property3" ], "then select properties of facet filter value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "property3" ], "then facet filter value help selected properties field are populated");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then facet filter value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet5"), true, "then all selected properties are fetched for the correct service and entity");
		//for alias
		assert.deepEqual(oVHRView.getViewData().oParentObject.getAlias(), "property3", "then alias of VHR is property3");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "property3", "then alias field selected key is property3");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getModel().getData(), oModelForVHRAlias, "then VHR alias field new model is set");
	});
	QUnit.test("When select property is changed", function(assert) {
		var oModelForVHRAlias = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property4",
				"name" : "property4"
			} ]
		};
		//action
		oVHRView.getController().handleChangeForSelectProperty(_eventCreation(oVHRView.byId("idSelectProperties").setSelectedKeys([ "property1", "property4" ])));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then existing select property of value help is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then existing select property of value help is removed");
		assert.strictEqual(spyOnAddSelectPropForValueHelp.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the  object");
		assert.strictEqual(spyOnAddSelectPropForValueHelp.calledWith("property4"), true, "then addSelectPropertiesOfValueHelp is called the  object");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [ "property1", "property4" ], "then select properties of value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property4" ], "then value help selected properties field are populated");
		//for alias
		assert.deepEqual(spyOnSetAlias.calledWith(undefined), true, "then existing alias is removed since this property does not exist anymore in VHR alias items");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getAlias(), "property3", "then alias of VHR is still undefined as no key is set to alias");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then alias field selected key is set");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getModel().getData(), oModelForVHRAlias, "then VHR alias field new model is set to empty");
	});
	QUnit.test("When  VHR is cleared", function(assert) {
		//action
		oVHRView.getController().clearVHRFields();
		//assert
		assert.strictEqual(oVHRView.getViewData().oParentObject.getServiceOfValueHelp(), undefined, "then value help source is cleared");
		assert.strictEqual(oVHRView.byId("idSource").getValue(), "", "then value help source field is cleared");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), undefined, "then value help entity set is cleared");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "", "then value help entity field is cleared");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [], "then value help select properties are cleared");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [], "then value help select properties field is cleared");
		assert.strictEqual(oVHRView.getController().byId("idEntityLabel").getRequired(), true, "then value help entity label field is still set to required");
		assert.strictEqual(oVHRView.getController().byId("idSelectPropertiesLabel").getRequired(), true, "then value help select properties label field is still set to required");
		assert.strictEqual(oVHRView.getController().byId("idSourceLabel").getRequired(), true, "then value help service label field is still set to required");
		//for alias
		assert.deepEqual(spyOnSetAlias.calledWith(undefined), true, "then existing alias is removed since this property does not exist anymore in VHR alias items");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getAlias(), undefined, "then alias of VHR is still undefined as no key is set to alias");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "", "then alias field selected key is null");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getModel(), undefined, "then VHR alias field new model is set to empty");
	});
	QUnit.test("Fetching validation state while view is valid", function(assert) {
		//assert
		assert.strictEqual(oVHRView.getController().getValidationState(), true, "then VHR view is in valid state");
	});
	QUnit.test("Fetching validation state while view is not valid", function(assert) {
		//action
		oVHRView.byId("idSelectProperties").setSelectedKeys([]);
		//assert
		assert.strictEqual(oVHRView.getController().getValidationState(), false, "then VHR view is not in valid state");
	});
	QUnit.test("When source displays suggestion items", function(assert) {
		//arrangement
		var sourceInputControl = oVHRView.byId("idSource");
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
	QUnit.module("For a Facet filter with existing VHR - Validate previously selected entity sets", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				spyOnGetAllEntitySetsOfService.restore();
				//Stub getAllEntitySetsOfService with an invalid entity set.Eg-Due to metadata changes the previously selected entity set is no more available
				spyOnGetAllEntitySetsOfService = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsOfServiceAsPromise", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve([ "entitySet2", "entitySet3", "entitySet4" ]); //entitySet1 is no more available
					return deferred.promise();
				});
				oVHRView = _instantiateView(oModelerInstance.facetFilterUnsaved, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When  is initialized and previously selected entity set does not exist anymore in the available entity sets", function(assert) {
		//arrange
		var oViewData = oVHRView.getViewData();
		var oController = oVHRView.getController();
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
		assert.ok(oVHRView, "then FRR view is available");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfValueHelp.calledOnce, true, "then FRR entity set is got from the  object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then  FRR source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then  FRR source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetEntitySetOfValueHelp.calledOnce, true, "then FRR entity set is got from the  object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then FRR entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then FRR entity label field is set as required");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then previously selected entity set is displayed which is invalid since its not available");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then FRR entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oVHRView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectPropOfValueHelp.calledOnce, true, "then FRR select properties are got from the  object");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getText(), oViewData.oTextReader("vhSelectProperties"), "then FRR select properties label is populated");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getRequired(), true, "then FRR select properties label field is set as required");
		assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then FRR selected properties field are populated");
		assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then FRR selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oVHRView.byId("idSource").getValue(), "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
		// alias asserts
		assert.strictEqual(spyOnGetAlias.calledOnce, true, "then value help alias got from the selected properties");
		assert.strictEqual(oController.byId("idOptionalRequestFieldLabel").getText(), oViewData.oTextReader("ffAlias"), "then VHR alias label is populated");
		assert.deepEqual(oController.byId("idOptionalRequestField").getSelectedKey(), "property3", "then VHR alias field is populated with value property3");
		assert.deepEqual(oController.byId("idOptionalRequestField").getModel().getData(), _getModelForAlias(), "then FRR selected properties field model is set");
	});
	QUnit.test("When entity set of VHR is changed to a currently not available entity set", function(assert) {
		//action
		oVHRView.getController().handleChangeForEntity(_eventCreation(oVHRView.byId("idEntity").setSelectedKey("Not Available: entitySet1")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith("entitySet1"), true, "then EntitySet is called on the  object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "entitySet1", "then entity set of FRR is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then FRR entity field is populated");
		//for select properties
		assert.strictEqual(spyOnAddSelectPropForValueHelp.calledWith("property1"), true, "then addSelectPropertyOfFilterResolution is called the  object");
		assert.strictEqual(spyOnAddSelectPropForValueHelp.calledWith("property3"), true, "then addSelectPropertyOfFilterResolution is called the  object");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [ "property1", "property3" ], "then select properties of FRR is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then FRR selected properties field are populated");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
		// alias asserts
		assert.strictEqual(oVHRView.byId("idOptionalRequestFieldLabel").getText(), oVHRView.getViewData().oTextReader("ffAlias"), "then VHR alias label is populated");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "property3", "then VHR alias field is populated with property3");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getModel().getData(), _getModelForAlias(), "then FRR selected properties field model is set");
	});
	QUnit.module("For a Facet filter with existing VHR - Validate previously selected properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				spyOnGetAllPropertiesOfEntitySet.restore();//getAllPropertiesOfEntitySet
				spyOnGetAllPropertiesOfEntitySet = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getAllPropertiesOfEntitySetAsPromise", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve([ "property1", "property2", "property4", "property1Text", "property3Text" ]); //property 3 is not available due to change in metadata
					return deferred.promise();
				});
				oVHRView = _instantiateView(oModelerInstance.facetFilterUnsaved, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When VHR view is initialized", function(assert) {
		//arrange
		var oViewData = oVHRView.getViewData();
		var oController = oVHRView.getController();
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
		var oModelForVHRAlias = {
			"Objects" : [ {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			}, {
				"key" : "property1",
				"name" : "property1"
			} ]
		};
		//assert
		assert.ok(oVHRView, "then VHR view is available");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfValueHelp.calledOnce, true, "then value help entity set is got from the facet filter object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then  value help source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then  value help source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetEntitySetOfValueHelp.calledOnce, true, "then value help entity set is got from the facet filter object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then value help entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then value help entity label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet1", "then value help entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then value help entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oVHRView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectPropOfValueHelp.calledOnce, true, "then value help select properties are got from the facet filter object");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getText(), oViewData.oTextReader("vhSelectProperties"), "then value help select properties label is populated");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getRequired(), true, "then value help select properties label field is set as required");
		assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property3", "property1" ], "then value help selected properties field are populated");
		assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelForProperties, "then value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oVHRView.byId("idSource").getValue(), oController.byId("idEntity").getSelectedKey()), true, "then all selected properties are fetched for the correct service and entity");
		// alias asserts
		assert.deepEqual(oController.getView().getViewData().oParentObject.getAlias(), "property3", "then alias of VHR is changed");
		assert.deepEqual(oController.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then VHR alias selected value is set");
		assert.deepEqual(oController.byId("idOptionalRequestField").getModel().getData(), oModelForVHRAlias, "then alias field model is set");
	});
	QUnit.test("When select property is changed - a not available property is selected", function(assert) {
		var oModelForFFAlias = {
			"Objects" : [ {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			}, {
				"key" : "property1",
				"name" : "property1"
			} ]
		};
		//action
		oVHRView.getController().handleChangeForSelectProperty(_eventCreation(oVHRView.byId("idSelectProperties").setSelectedKeys([ "Not Available: property3", "property1" ])));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.strictEqual(spyOnAddSelectPropForValueHelp.calledWith("property3"), true, "then addSelectPropertiesOfValueHelp is called the facet filter object");
		assert.strictEqual(spyOnAddSelectPropForValueHelp.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the facet filter object");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [ "property3", "property1" ], "then select properties of value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property3", "property1" ], "then value help selected properties field are populated");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getAlias(), "property3", "then VHR alias is still property3");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then VHR alias is shown as not available property3 ");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getModel().getData(), oModelForFFAlias, "then VHR alias field model is set");
	});
	QUnit.test("When select property is changed - a not available alias is selected", function(assert) {
		var oModelForFFAlias = {
			"Objects" : [ {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			}, {
				"key" : "property1",
				"name" : "property1"
			} ]
		};
		//action
		oVHRView.byId("idOptionalRequestField").setSelectedKey("Not Available: property3");
		oVHRView.getController().handleChangeForOptionalRequestField(_eventCreation(oVHRView.byId("idOptionalRequestField")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for selectable properties
		assert.deepEqual(oVHRView.getViewData().oParentObject.getAlias(), "property3", "then VHR alias value is changed");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then VHR alias field is set");
		assert.deepEqual(oVHRView.byId("idOptionalRequestField").getModel().getData(), oModelForFFAlias, "then VHR alias field model is set");
	});
}());
