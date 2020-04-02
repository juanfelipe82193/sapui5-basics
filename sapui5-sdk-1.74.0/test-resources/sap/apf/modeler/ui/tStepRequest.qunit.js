/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tStepRequest');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require('sap.apf.utils.utils');
(function() {
	'use strict';
	var oStepRequestView, spyOnGetText, spyOnGetService, spyOnGetAllPropertiesOfEntitySet, spyOnSetValidationStateForService, spyOnGetEntitySet, spyOnGetAllEntitySetsOfService, spyOnGetSelectProperties, spyOnConfigEditorRegisterService, spyOnSetService, spyOnSetEntitySet, spyOnAddSelectProperty, spyOnConfigEditorSetIsUnsaved, spyOnRemoveSelectProperty, spyOnAddFilterProperty, spyOnRemoveFilterProperty, spyOnGetFilterProperties, oModelerInstance, spyOnFireEvent, spyOnGetFilterPropertyLabelKey, spyOnGetFilterPropertyLabeldisplayOption, spyOnSetFilterPropertyLabelKey, spyOnSetFilterPropertyLabeldisplayOption;
	function _doNothing() {
		return "";
	}
	function _createEvent(value) {
		return {
			getSource : function() {
				return value;
			}
		};
	}
	function _commonSpiesInBeforeEach() {
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnConfigEditorRegisterService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "registerServiceAsPromise");
		spyOnGetAllEntitySetsOfService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsOfServiceAsPromise");
		spyOnGetAllPropertiesOfEntitySet = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllPropertiesOfEntitySetAsPromise");
		spyOnGetService = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "getService");
		spyOnGetEntitySet = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "getEntitySet");
		spyOnGetSelectProperties = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "getSelectProperties");
		spyOnGetFilterProperties = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "getFilterProperties");
		spyOnGetFilterPropertyLabelKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "getFilterPropertyLabelKey");
		spyOnGetFilterPropertyLabeldisplayOption = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "getFilterPropertyLabelDisplayOption");
		spyOnSetFilterPropertyLabelKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "setFilterPropertyLabelKey");
		spyOnSetFilterPropertyLabeldisplayOption = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "setFilterPropertyLabelDisplayOption");
		spyOnSetService = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "setService");
		spyOnSetEntitySet = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "setEntitySet");
		spyOnAddSelectProperty = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "addSelectProperty");
		spyOnAddFilterProperty = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "addFilterProperty");
		spyOnRemoveSelectProperty = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "removeSelectProperty");
		spyOnRemoveFilterProperty = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "removeFilterProperty");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
	}
	function _commonCleanUpsInAfterEach() {
		oStepRequestView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oStepRequestView.getViewData().oConfigurationEditor.registerServiceAsPromise.restore();
		oStepRequestView.getViewData().oConfigurationEditor.getAllEntitySetsOfServiceAsPromise.restore();
		oStepRequestView.getViewData().oConfigurationEditor.getAllPropertiesOfEntitySetAsPromise.restore();
		spyOnGetText.restore();
		spyOnFireEvent.restore();
		oModelerInstance.reset();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oStepRequestView.destroy();
	}
	function _instantiateView(sId, assert) {
		var oStepRequestController = new sap.ui.controller("sap.apf.modeler.ui.controller.stepRequest");
		var spyOnInit = sinon.spy(oStepRequestController, "onInit");
		var oStepPropertyMetadataTypeHandlerStub = {
			hasTextPropertyOfDimension : function(entityTypeMetadata, sProperty) {
				var bHasTextProperty;
				if (sProperty === "property1") {
					bHasTextProperty = true;
				} else {
					bHasTextProperty = false;
				}
				return bHasTextProperty;
			},
			getDefaultLabel : function(entityTypeMetadata, oText) {
				return oText;
			},
			getEntityTypeMetadataAsPromise : function() {
				return sap.apf.utils.createPromise({
					type : "myEntityTypeMetadataStub"
				});
			}
		};
		spyOnSetValidationStateForService = sinon.spy(oStepRequestController, "setValidationStateForService");
		oStepRequestView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.requestOptions",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oStepRequestController,
			viewData : {
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oTextReader : oModelerInstance.modelerCore.getText,
				oParentObject : sId,
				getCalatogServiceUri : _doNothing,
				oStepPropertyMetadataHandler : oStepPropertyMetadataTypeHandlerStub
			}
		});
		spyOnFireEvent = sinon.spy(oStepRequestView, "fireEvent");
		assert.strictEqual(spyOnInit.calledOnce, true, "then request options onInit function is called and view is initialized");
		return oStepRequestView;
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
	function _getModelForSelectProperties() {
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
	function _getModelForFilterProperties() {
		return {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property3",
				"name" : "property3"
			} ]
		};
	}
	function _getModelForNotAvailableFilterProp() {
		return {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			}, {
				"key" : "property1",
				"name" : "property1"
			} ]
		};
	}
	QUnit.module("For an existing step", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				oStepRequestView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When stepRequest view is initialized",
			function(assert) {
				//arrange
				var oController = oStepRequestView.getController();
				var oModelForEntity = _getModelForEntity();
				var oModelForProperty = _getModelForSelectProperties();
				var oModelForFilterProperty = _getModelForFilterProperties();
				var sDefaultValidationState = {
					sValueState : sap.ui.core.ValueState.None,
					sValueStateText : ""
				};
				var oModelForDisplayOptionType = {
					"Objects" : [ {
						"key" : "key",
						"name" : "Key"
					}, {
						"key" : "text",
						"name" : "Text"
					}, {
						"key" : "keyAndText",
						"name" : "Key and Text"
					} ]
				};
				//assert
				assert.ok(oStepRequestView, "then stepRequest view is available");
				// source section asserts
				assert.strictEqual(spyOnGetService.calledTwice, true, "then service for step request is retrieved from the step object");
				assert.ok(oController.byId("idSourceLabel").getText(), "then step request source label is populated");
				assert.strictEqual(spyOnGetText.calledWith("source"), true, "then step request source label is set correctly");
				assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then step request source field is populated");
				assert.strictEqual(oStepRequestView.getController().byId("idSourceLabel").getRequired(), true, "then step request source label is set as required");
				assert.strictEqual(oStepRequestView.byId("idSource").getValueState(), sDefaultValidationState.sValueState, "then the value state of service input is None");
				assert.strictEqual(oStepRequestView.byId("idSource").getValueStateText(), sDefaultValidationState.sValueStateText, "then no value state text is set to the service input");
				assert.strictEqual(spyOnSetValidationStateForService.called, true, "then setValidationStateForService is called with correct value");
				// entity section asserts
				assert.strictEqual(spyOnGetEntitySet.calledTwice, true, "then step request entity set is retrieved from the step object");
				assert.ok(oController.byId("idEntityLabel").getText(), "then step request entity label is populated");
				assert.strictEqual(spyOnGetText.calledWith("entity"), true, "then step request entity label is set correctly");
				assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then step request entity label field is set as required");
				assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet1", "then step request entity field is populated");
				assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then step request entity field model is set");
				assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
				assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oStepRequestView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
				// select property section asserts
				assert.strictEqual(spyOnGetSelectProperties.calledTwice, true, "then step request select properties are got from the step object");
				assert.strictEqual(spyOnGetText.calledWith("selectProperties"), true, "then step request select properties label is populated");
				assert.strictEqual(oController.byId("idSelectPropertiesLabel").getRequired(), true, "then step request select properties label field is set as required");
				assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then step request selected properties field are populated");
				assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then step request selected properties field model is set");
				assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
				assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oStepRequestView.byId("idSource").getValue(), oController.byId("idEntity").getSelectedKey()), true,
						"then all selected properties are fetched for the correct service and entity");
				//selectable property assertions
				assert.strictEqual(spyOnGetFilterProperties.called, true, "then step request selectable properties are got from the step object");
				assert.deepEqual(oController.byId("idOptionalLabelDisplayOptionType").getModel().getData(), oModelForDisplayOptionType, "then label display options model is set");
				assert.strictEqual(spyOnGetFilterPropertyLabeldisplayOption.calledOnce, true, "then step request selectable property display options are got from the step object");
				assert.ok(oController.byId("idOptionalSelectedPropertyLabel").getText(), "then default label is set");
				assert.strictEqual(oController.byId("idOptionalSelectedPropertyLabelText").getValue(), "property3", "then value for property label text input box is set as property3");
				assert.strictEqual(spyOnGetFilterPropertyLabelKey.calledTwice, true, "then step request selectable property label key got from the step object");
				assert.strictEqual(spyOnGetText.calledWith("requiredFilters"), true, "then step request selectable properties label is populated");
				assert.deepEqual(oController.byId("idOptionalRequestField").getSelectedKey(), "property3", "then step request selectable properties field are populated");
				assert.deepEqual(oController.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
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
		var oModelForProperty = {
			"Objects" : [ {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			} ]
		};
		var oModelForFilterProperty = {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			} ]
		};
		//action
		oStepRequestView.byId("idSource").setValue("testService3");
		oStepRequestView.getController().handleChangeForSourceAsPromise(_createEvent(oStepRequestView.byId("idSource")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService3"), true, "then step request service is checked for registration");
		oStepRequestView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService3").done(function(result) {
			assert.strictEqual(result, true, "then step request service is valid service");
		});
		assert.strictEqual(spyOnSetService.calledWith("testService3"), true, "then setService is called on step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getService(), "testService3", "then service of step request is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySet.calledWith("entitySet1"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getEntitySet(), "entitySet1", "then entity set of step request is changed");
		assert.strictEqual(oStepRequestView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then step request entity field is populated");
		assert.deepEqual(oStepRequestView.byId("idEntity").getModel().getData(), oModelForEntity, "then step request entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService3"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnAddSelectProperty.calledWith("property1"), true, "then addSelectProperty is called the step object");
		assert.deepEqual(spyOnRemoveSelectProperty.calledWith("property3"), true, "then exisiting select property of step request is removed");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getSelectProperties(), [ "property1", "property3" ], "then select properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "Not Available: property3" ], "then step request selected properties field are populated");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then step request selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService3", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
		//for selectable properties
		assert.deepEqual(spyOnRemoveFilterProperty.calledWith("property3"), true, "then exisiting selectable property of step request is removed since this property does not exist anymore in selected properties");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [ "property3" ], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then step request selectable property is set to None");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
		//Fire events assertions
		assert.strictEqual(spyOnFireEvent.callCount, 3, "then three events are fired when source is changed");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETDATAREDUCTIONSECTION), true, "then event to set data reduction is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS), true, "then event to set visibility of filter mapping fields is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS), true, "then event to update the filter mapping fields is fired");
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
		var oModelForFilterProperty = {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			} ]
		};
		//action
		oStepRequestView.byId("idSource").setValue("testService5");
		oStepRequestView.getController().handleChangeForSourceAsPromise(_createEvent(oStepRequestView.byId("idSource")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService5"), true, "then step request service is checked for registration");
		oStepRequestView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService5").done(function(result) {
			assert.strictEqual(result, true, "then step request service is valid service");
		});
		assert.strictEqual(spyOnSetService.calledWith("testService5"), true, "then setService is called on step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getService(), "testService5", "then service of step request is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySet.calledWith("entitySet1"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getEntitySet(), "entitySet1", "then entity set of step request is not changed");
		assert.strictEqual(oStepRequestView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then step request entity field is populated");
		assert.deepEqual(oStepRequestView.byId("idEntity").getModel().getData(), oModelForEntity, "then step request entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService5"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectProperty.calledWith("property1"), true, "then exisiting select property of step request is removed");
		assert.strictEqual(spyOnRemoveSelectProperty.calledWith("property3"), true, "then exisiting select property of step request is removed");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getSelectProperties(), [ "property1", "property3" ], "then select properties of step request is not changed");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "Not Available: property3" ], "then step request selected properties field are populated");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then step request selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService5", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
		//for selectable properties
		assert.deepEqual(spyOnRemoveFilterProperty.calledWith("property3"), true, "then exisiting selectable property of step request is removed since this property does not exist anymore in selected properties");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [ "property3" ], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then step request selectable property is set to None");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
		//Fire events assertions
		assert.strictEqual(spyOnFireEvent.callCount, 3, "then three events are fired when source is changed");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETDATAREDUCTIONSECTION), true, "then event to set data reduction is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS), true, "then event to set visibility of filter mapping fields is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS), true, "then event to update the filter mapping fields is fired");
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
		var oModelForProperty = _getModelForSelectProperties();
		var oModelForFilterProperty = _getModelForFilterProperties();
		//action
		oStepRequestView.byId("idSource").setValue("testService6");
		oStepRequestView.getController().handleChangeForSourceAsPromise(_createEvent(oStepRequestView.byId("idSource")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService6"), true, "then step request service is checked for registration");
		oStepRequestView.getViewData().oConfigurationEditor.registerServiceAsPromise("testService6").done(function(result) {
			assert.strictEqual(result, true, "then step request service is valid service");
		});
		assert.strictEqual(spyOnSetService.calledWith("testService6"), true, "then setService is called on step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getService(), "testService6", "then service of step request is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySet.calledWith("entitySet1"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getEntitySet(), "entitySet1", "then entity set of step request is changed");
		assert.strictEqual(oStepRequestView.byId("idEntity").getSelectedKey(), "entitySet1", "then step request entity field is populated");
		assert.deepEqual(oStepRequestView.byId("idEntity").getModel().getData(), oModelForEntity, "then step request entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService6"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnAddSelectProperty.calledWith("property1"), true, "then select property is added");
		assert.strictEqual(spyOnAddSelectProperty.calledWith("property3"), true, "then select property is added");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getSelectProperties(), [ "property1", "property3" ], "then select properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then step request selected properties field are populated");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then step request selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService6", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
		//for selectable properties
		assert.deepEqual(spyOnAddFilterProperty.calledWith("property3"), true, "then selectable property is added");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [ "property3" ], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "property3", "then step request selectable property is set to None");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
		//Fire events assertions
		assert.strictEqual(spyOnFireEvent.callCount, 3, "then three events are fired when source is changed");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETDATAREDUCTIONSECTION), true, "then event to set data reduction is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS), true, "then event to set visibility of filter mapping fields is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS), true, "then event to update the filter mapping fields is fired");
	});
	QUnit.test("When source selected from value help in the input field", function(assert) {
		//action
		oStepRequestView.byId("idSource").fireValueHelpRequest();
		sap.ui.getCore().applyChanges();
		var oSelectDialog = oStepRequestView.byId("idCatalogServiceView").byId("idGatewayCatalogListDialog");
		//assert
		assert.ok(oSelectDialog, "Select dialog exists after firing value help request");
		assert.strictEqual(spyOnGetText.calledWith("selectService"), true, "Exisitng select dialog is the Gateway select service dialog");
		//cleanups
		oSelectDialog.destroy();
	});
	QUnit.test("When source is cleared", function(assert) {
		//action
		oStepRequestView.byId("idSource").setValue("");
		oStepRequestView.getController().handleChangeForSourceAsPromise(_createEvent(oStepRequestView.byId("idSource")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith(""), false, "then empty step request service is not checked for registration");
		assert.strictEqual(spyOnSetService.calledWith(undefined), true, "then setService is called on step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getService(), undefined, "then service of step request is changed");
		assert.strictEqual(oStepRequestView.getController().byId("idSourceLabel").getRequired(), true, "then step request source label is set as required");
		//for entity set
		assert.strictEqual(spyOnSetEntitySet.calledWith(undefined), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getEntitySet(), "", "then entity set of step request is changed");
		assert.strictEqual(oStepRequestView.byId("idEntity").getSelectedKey(), "", "then step request entity set field is populated");
		assert.strictEqual(oStepRequestView.getController().byId("idEntityLabel").getRequired(), true, "then step request entity label field is set as required");
		assert.deepEqual(oStepRequestView.byId("idEntity").getModel(), undefined, "then step request entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectProperty.calledWith("property1"), true, "then exisiting select property of step request is removed");
		assert.deepEqual(spyOnRemoveSelectProperty.calledWith("property3"), true, "then exisiting select property of step request is removed");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getSelectProperties(), [], "then select properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getSelectedKeys(), [], "then step request selected properties field are populated");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getModel(), undefined, "then step request selected properties field model is set");
		assert.strictEqual(oStepRequestView.getController().byId("idSelectPropertiesLabel").getRequired(), true, "then step request select properties label field is set as required");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), true, "then all selected properties are not fetched for the empty service and entity");
		//for selectable properties
		assert.deepEqual(spyOnRemoveFilterProperty.calledWith("property3"), true, "then exisiting selectable property of step request is removed since this property does not exist anymore in selected properties");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "None", "then step request selectable property is set to None");
		//Fire events assertions
		assert.strictEqual(spyOnFireEvent.callCount, 3, "then three events are fired when source is changed");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETDATAREDUCTIONSECTION), true, "then event to set data reduction is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS), true, "then event to set visibility of filter mapping fields is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS), true, "then event to update the filter mapping fields is fired");
	});
	QUnit.test("When source is changed to an invalid service", function(assert) {
		//action
		oStepRequestView.byId("idSource").setValue("test1");
		oStepRequestView.getController().handleChangeForSourceAsPromise(_createEvent(oStepRequestView.byId("idSource")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("test1"), true, "then step request service is checked for registration");
		oStepRequestView.getViewData().oConfigurationEditor.registerServiceAsPromise("test11").done(function(result) {
			assert.strictEqual(oStepRequestView.byId("idSource").getValueState(), sap.ui.core.ValueState.None, "then the value state of service input is None");
			assert.strictEqual(result, undefined, "then step request service is an invalid service");
		});
		assert.strictEqual(spyOnSetService.calledWith(undefined), true, "then setService is called on step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getService(), undefined, "then service of step request is changed");
		assert.strictEqual(oStepRequestView.getController().byId("idSourceLabel").getRequired(), true, "then step request source label is set as required");
		//for entity set
		assert.strictEqual(spyOnSetEntitySet.calledWith(undefined), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getEntitySet(), "", "then entity set of step request is changed");
		assert.strictEqual(oStepRequestView.byId("idEntity").getSelectedKey(), "", "then step request entity set field is populated");
		assert.strictEqual(oStepRequestView.getController().byId("idEntityLabel").getRequired(), true, "then step request entity label field is set as required");
		assert.deepEqual(oStepRequestView.byId("idEntity").getModel(), undefined, "then step request entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectProperty.calledWith("property1"), true, "then exisiting select property of step request is removed");
		assert.deepEqual(spyOnRemoveSelectProperty.calledWith("property3"), true, "then exisiting select property of step request is removed");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getSelectProperties(), [], "then select properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getSelectedKeys(), [], "then step request selected properties field are populated");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getModel(), undefined, "then step request selected properties field model is set");
		assert.strictEqual(oStepRequestView.getController().byId("idSelectPropertiesLabel").getRequired(), true, "then step request select properties label field is set as required");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), false, "then all selected properties are not fetched for the empty service and entity");
		//for selectable properties
		assert.deepEqual(spyOnRemoveFilterProperty.calledWith("property3"), true, "then exisiting selectable property of step request is removed since this property does not exist anymore in selected properties");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "None", "then step request selectable property is set to None");
		//Fire events assertions
		assert.strictEqual(spyOnFireEvent.callCount, 3, "then three events are fired when source is changed");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETDATAREDUCTIONSECTION), true, "then event to set data reduction is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS), true, "then event to set visibility of filter mapping fields is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS), true, "then event to update the filter mapping fields is fired");
	});
	QUnit.test("When entity set is changed and there are no common properties between new and old", function(assert) {
		//arrangement
		var oModelForProperty = {
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
		var oModelForFilterProperty = {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			} ]
		};
		//action
		oStepRequestView.byId("idEntity").setSelectedKey("entitySet2");
		oStepRequestView.getController().handleChangeForEntity(_createEvent(oStepRequestView.byId("idEntity")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySet.calledWith("entitySet2"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getEntitySet(), "entitySet2", "then entity set of step request is changed");
		assert.strictEqual(oStepRequestView.byId("idEntity").getSelectedKey(), "entitySet2", "then step request entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectProperty.calledWith("property1"), true, "then exisiting select property of step request is removed");
		assert.deepEqual(spyOnRemoveSelectProperty.calledWith("property3"), true, "then exisiting select property of step request is removed");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getSelectProperties(), [ "property1", "property3" ], "then select properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "Not Available: property3" ], "then step request selected properties field are populated");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then step request selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet2"), true, "then all selected properties are fetched for the correct service and entity");
		//for selectable properties
		assert.deepEqual(spyOnRemoveFilterProperty.calledWith("property3"), true, "then exisiting selectable property of step request is removed since this property does not exist anymore in selected properties");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [ "property3" ], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then step request selectable property is set");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
		//Fire events assertions
		assert.strictEqual(spyOnFireEvent.callCount, 3, "then three events are fired when source is changed");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETDATAREDUCTIONSECTION), true, "then event to set data reduction is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS), true, "then event to set visibility of filter mapping fields is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS), true, "then event to update the filter mapping fields is fired");
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
		var oModelForFilterProperty = {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			} ]
		};
		//action
		oStepRequestView.byId("idEntity").setSelectedKey("entitySet13");
		oStepRequestView.getController().handleChangeForEntity(_createEvent(oStepRequestView.byId("idEntity")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySet.calledWith("entitySet13"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getEntitySet(), "entitySet13", "then entity set of step request is changed");
		assert.strictEqual(oStepRequestView.byId("idEntity").getSelectedKey(), "entitySet13", "then step request entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectProperty.calledWith("property1"), true, "then exisiting select property of step request is removed");
		assert.deepEqual(spyOnRemoveSelectProperty.calledWith("property3"), true, "then exisiting select property of step request is removed");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getSelectProperties(), [ "property1", "property3" ], "then select properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "Not Available: property3" ], "then step request selected properties field are populated");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then step request selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet13"), true, "then all selected properties are fetched for the correct service and entity");
		//for selectable properties
		assert.deepEqual(spyOnRemoveFilterProperty.calledWith("property3"), true, "then selectable property is removed from the the step object");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [ "property3" ], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then step request selectable property is  changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
		//Fire events assertions
		assert.strictEqual(spyOnFireEvent.callCount, 3, "then three events are fired when source is changed");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETDATAREDUCTIONSECTION), true, "then event to set data reduction is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS), true, "then event to set visibility of filter mapping fields is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS), true, "then event to update the filter mapping fields is fired");
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
		var aFilterProperties = _getModelForFilterProperties().Objects;
		aFilterProperties.splice(1, 1);
		var oModelForFilterProperty = {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			}, {
				"key" : "property3",
				"name" : "property3"
			} ]
		};
		//action
		oStepRequestView.byId("idEntity").setSelectedKey("entitySet5");
		oStepRequestView.getController().handleChangeForEntity(_createEvent(oStepRequestView.byId("idEntity")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySet.calledWith("entitySet5"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getEntitySet(), "entitySet5", "then entity set of step request is changed");
		assert.strictEqual(oStepRequestView.byId("idEntity").getSelectedKey(), "entitySet5", "then step request entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectProperty.calledWith("property1"), true, "then exisiting select property of step request is removed");
		assert.deepEqual(spyOnAddSelectProperty.calledWith("property3"), true, "then select property of step request is added");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getSelectProperties(), [ "property1", "property3" ], "then select properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property1", "property3" ], "then step request selected properties field are populated");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then step request selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet5"), true, "then all selected properties are fetched for the correct service and entity");
		//for selectable properties
		assert.deepEqual(spyOnAddFilterProperty.calledWith("property3"), true, "then selectable property is added to the step object");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [ "property3" ], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "property3", "then step request selectable property is set correctly");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
		//Fire events assertions
		assert.strictEqual(spyOnFireEvent.callCount, 3, "then three events are fired when source is changed");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETDATAREDUCTIONSECTION), true, "then event to set data reduction is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS), true, "then event to set visibility of filter mapping fields is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS), true, "then event to update the filter mapping fields is fired");
	});
	QUnit.test("When select property is removed which is used as the filterable property", function(assert) {
		//arrange 
		var oModelForFilterProperty = {
			"Objects" : _getModelForFilterProperties().Objects.slice(0, 2)
		};
		//action
		oStepRequestView.byId("idSelectProperties").setSelectedKeys([ "property1" ]);
		oStepRequestView.getController().handleChangeForSelectProperty(_createEvent(oStepRequestView.byId("idSelectProperties")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectProperty.calledWith("property1"), true, "then exisiting select property of step request is removed");
		assert.deepEqual(spyOnRemoveSelectProperty.calledWith("property3"), true, "then exisiting select property of step request is removed");
		setTimeout(function(){
		assert.strictEqual(spyOnAddSelectProperty.calledWith("property1"), true, "then addSelectProperty is called the step object");
		assert.deepEqual(spyOnRemoveFilterProperty.calledWith("property3"), true, "then exisiting selectable property of step request is removed since this property does not exist anymore in selected properties");
		assert.deepEqual(spyOnGetText.calledWith("none"), true, "then exisiting selectable property is set to None");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getSelectProperties(), [ "property1" ], "then select properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getSelectedKeys(), [ "property1" ], "then step request selected properties field are populated");
		//for selectable properties
		assert.deepEqual(spyOnRemoveFilterProperty.calledWith("property3"), true, "then exisiting selectable property of step request is removed since this property does not exist anymore in selected properties");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [], "then selectable properties of step request is none");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "None", "then step request selectable property is set to None");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
		//Fire events assertions
		assert.strictEqual(spyOnFireEvent.callCount, 3, "then three events are fired when source is changed");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETDATAREDUCTIONSECTION), true, "then event to set data reduction is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS), true, "then event to set visibility of filter mapping fields is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS), true, "then event to update the filter mapping fields is fired");
		},1);	
		});
	QUnit.test("When selectable property is changed", function(assert) {
		//action
		oStepRequestView.byId("idOptionalRequestField").setSelectedKey("property1");
		oStepRequestView.getController().handleChangeForOptionalRequestField(_createEvent(oStepRequestView.byId("idOptionalRequestField")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for selectable properties
		assert.strictEqual(spyOnRemoveFilterProperty.calledWith("property3"), true, "then exisiting selectable property of step request is removed");
		assert.strictEqual(spyOnAddFilterProperty.calledWith("property1"), true, "then addFilterProperty is called the step object");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [ "property1" ], "then filter properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "property1", "then step request filter properties field are populated");
		assert.strictEqual(oStepRequestView.byId("idOptionalLabelDisplayOptionType").getSelectedKey(), "key", "then label display option for filter property is selected as key");
		assert.strictEqual(spyOnGetFilterPropertyLabeldisplayOption.called, true, "then step request selectable property display options are got from the step object");
		assert.ok(oStepRequestView.byId("idOptionalSelectedPropertyLabel").getText(), "then default label is set");
		assert.strictEqual(oStepRequestView.byId("idOptionalSelectedPropertyLabelText").getValue(), "property1", "then value for property label text input box is set as property1");
		assert.strictEqual(spyOnGetFilterPropertyLabelKey.called, true, "then step request selectable property label key got from the step object");
		//Fire events assertions
		assert.strictEqual(spyOnFireEvent.calledTwice, true, "then two events are fired when selectable property is changed");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS), true, "then event to set visibility of filter mapping fields is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS), true, "then event to update the filter mapping fields is fired");
	});
	QUnit.test("When selectable property is removed", function(assert) {
		//action
		oStepRequestView.byId("idOptionalRequestField").removeItem(oStepRequestView.byId("idOptionalRequestField").getItemByKey("property3"));
		oStepRequestView.getController().handleChangeForOptionalRequestField(_createEvent(oStepRequestView.byId("idOptionalRequestField")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for selectable properties
		assert.strictEqual(spyOnRemoveFilterProperty.calledWith("property3"), true, "then exisiting selectable property of step request is removed");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [], "then filter properties of step request is empty");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "None", "then step request filter properties field are populated as None");
		assert.strictEqual(oStepRequestView.byId("idOptionalLabelDisplayOptionType").getSelectedKey(), "", "then label display option for filter property is selected as empty");
		assert.strictEqual(spyOnGetFilterPropertyLabeldisplayOption.called, true, "then step request selectable property display options are got from the step object");
		assert.ok(oStepRequestView.byId("idOptionalSelectedPropertyLabel").getText(), "then default label is set");
		assert.strictEqual(oStepRequestView.byId("idOptionalSelectedPropertyLabelText").getValue(), "", "then value for property label text input box is set as empty");
		assert.strictEqual(oStepRequestView.byId("idOptionalLabelDisplayOptionType").getEnabled(), false, "key text dropdown for filter label display option is disabled");
		assert.strictEqual(spyOnGetFilterPropertyLabelKey.called, true, "then step request selectable property label key got from the step object");
		//Fire events assertions
		assert.strictEqual(spyOnFireEvent.calledTwice, true, "then two events are fired when selectable property is changed");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS), true, "then event to set visibility of filter mapping fields is fired");
		assert.strictEqual(spyOnFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS), true, "then event to update the filter mapping fields is fired");
	});
	QUnit.test("When filter property label display option is changed", function(assert) {
		//action
		oStepRequestView.byId("idOptionalLabelDisplayOptionType").setSelectedKey("Text");
		oStepRequestView.getController().handleChangeForOptionalLabelDisplayOptionType();
		//assert
		assert.strictEqual(oStepRequestView.byId("idOptionalLabelDisplayOptionType").getSelectedKey(), "Text", "then label display option for filter property is selected as Text");
		assert.strictEqual(spyOnSetFilterPropertyLabeldisplayOption.calledOnce, true, "then step request selectable property display options are got from the step object");
		assert.strictEqual(spyOnSetFilterPropertyLabeldisplayOption.calledWith("Text"), true, "then step request selectable property display options are got from the step object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When filter property label display option text is changed", function(assert) {
		//action
		oStepRequestView.byId("idOptionalSelectedPropertyLabelText").setValue("property1");
		oStepRequestView.getController().handleChangeForOptionalSelectedPropertyLabelText();
		//assert
		assert.strictEqual(oStepRequestView.byId("idOptionalSelectedPropertyLabel").getText(), "Label", "then label is set");
		assert.strictEqual(oStepRequestView.byId("idOptionalSelectedPropertyLabelText").getValue(), "property1", "then step request selectable property label text is set as property1");
		assert.strictEqual(oStepRequestView.byId("idOptionalLabelDisplayOptionType").getSelectedKey(), "key", "then label display option for filter property is selected as key");
		assert.strictEqual(spyOnSetFilterPropertyLabelKey.calledOnce, true, "then step request selectable property label text is set");
		assert.strictEqual(spyOnSetFilterPropertyLabelKey.calledWith("property1"), true, "then step request selectable property label text is set as property1");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When filter property label display option text is set to empty", function(assert) {
		//action
		oStepRequestView.byId("idOptionalSelectedPropertyLabelText").setValue("");
		oStepRequestView.getController().handleChangeForOptionalSelectedPropertyLabelText();
		//assert
		assert.strictEqual(oStepRequestView.byId("idOptionalSelectedPropertyLabel").getText(), "Label (Default)", "then default label is set");
		assert.strictEqual(oStepRequestView.byId("idOptionalSelectedPropertyLabelText").getValue(), "property3", "then step request selectable property label text is set as property3");
		assert.strictEqual(oStepRequestView.byId("idOptionalLabelDisplayOptionType").getSelectedKey(), "key", "then label display option for filter property is selected as key");
		assert.strictEqual(spyOnSetFilterPropertyLabelKey.calledOnce, true, "then step request selectable property label text is set");
		assert.strictEqual(spyOnSetFilterPropertyLabelKey.calledWith(undefined), true, "then step request selectable property label text is set as undefined");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("Fetching validation state while view is valid", function(assert) {
		//assert
		setTimeout(function(){
		assert.strictEqual(oStepRequestView.getController().getValidationState(), true, "then stepRequest view is in valid state");
		},1);
		});
	QUnit.test("Fetching validation state while view is not valid", function(assert) {
		//action
		oStepRequestView.byId("idSelectProperties").setSelectedKeys([]);
		//assert
		setTimeout(function(){
		assert.strictEqual(oStepRequestView.getController().getValidationState(), false, "then stepRequest view is not in valid state");
		},1);
		});
	QUnit.test("When source displays suggestion items", function(assert) {
		//arrangement
		var sourceInputControl = oStepRequestView.byId("idSource");
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
		var selectPropertyLabel = oStepRequestView.byId("idOptionalSelectedPropertyLabelText");
		var oEventParameters = {
			suggestValue : "Cus"
		};
		selectPropertyLabel.fireSuggest(oEventParameters);
		assert.deepEqual(selectPropertyLabel.getModel().getData(), suggestionsModelData, "Model filled with all possible suggestionsItems");
		assert.strictEqual(selectPropertyLabel.getSuggestionItems().length, 1, "SuggestItems from model filtered");
		assert.strictEqual(selectPropertyLabel.getSuggestionItems()[0].getText(), "CUSTOMER", "SuggestionItems correctly filtered");
	});
	QUnit.module("For an existing step - Validate previously selected entity sets", {
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
				oStepRequestView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When step is initialized and previously selected entity set does not exist anymore in the available entity sets", function(assert) {
		//arrange
		var oViewData = oStepRequestView.getViewData();
		var oController = oStepRequestView.getController();
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
		var oModelForDisplayOptionType = {
			"Objects" : [ {
				"key" : "key",
				"name" : "Key"
			}, {
				"key" : "text",
				"name" : "Text"
			}, {
				"key" : "keyAndText",
				"name" : "Key and Text"
			} ]
		};
		var oModelForProperty = _getModelForSelectProperties();
		var oModelForFilterProperty = _getModelForFilterProperties();
		//assert
		assert.ok(oStepRequestView, "then step request view is available");
		// source section asserts
		assert.strictEqual(spyOnGetService.calledTwice, true, "then step request entity set is got from the step object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then step step request source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then step step request source field is populated");
		assert.strictEqual(oStepRequestView.getController().byId("idSourceLabel").getRequired(), true, "then step request source label is set as required");
		// entity section asserts
		assert.strictEqual(spyOnGetEntitySet.calledTwice, true, "then step request entity set is got from the step object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then step request entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then step request entity label field is set as required");
		assert.strictEqual(oStepRequestView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then previously selected entity set is displayed which is invalid since its not available");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then step request entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oStepRequestView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectProperties.calledTwice, true, "then step request select properties are got from the step object");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getText(), oViewData.oTextReader("selectProperties"), "then step request select properties label is populated");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getRequired(), true, "then step request select properties label field is set as required");
		assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then step request selected properties field are populated");
		assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelForProperty, "then step request selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oStepRequestView.byId("idSource").getValue(), "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
		//selectable property assertions
		assert.strictEqual(spyOnGetFilterProperties.called, true, "then step request selectable properties are got from the step object");
		assert.deepEqual(oController.byId("idOptionalLabelDisplayOptionType").getModel().getData(), oModelForDisplayOptionType, "then label display options model is set");
		assert.strictEqual(spyOnGetFilterPropertyLabeldisplayOption.calledOnce, true, "then step request selectable property display options are got from the step object");
		assert.ok(oController.byId("idOptionalSelectedPropertyLabel").getText(), "then default label is set");
		assert.strictEqual(oController.byId("idOptionalSelectedPropertyLabelText").getValue(), "property3", "then value for property label text input box is set as property3");
		assert.strictEqual(spyOnGetFilterPropertyLabelKey.calledTwice, true, "then step request selectable property label key got from the step object");
		assert.strictEqual(spyOnGetText.calledWith("requiredFilters"), true, "then step request selectable properties label is populated");
		assert.deepEqual(oController.byId("idOptionalRequestField").getSelectedKey(), "property3", "then step request selectable properties field are populated");
		assert.deepEqual(oController.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
	});
	QUnit.test("When entity set of step is changed to a currently not available entity set", function(assert) {
		//arrange
		var oModelForFilterProperty = _getModelForFilterProperties();
		//action
		oStepRequestView.byId("idEntity").setSelectedKey("Not Available: entitySet1");
		oStepRequestView.getController().handleChangeForEntity(_createEvent(oStepRequestView.byId("idEntity")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySet.calledWith("entitySet1"), true, "then setEntitySet is called the step object");
		assert.strictEqual(oStepRequestView.getViewData().oParentObject.getEntitySet(), "entitySet1", "then entity set of step request is changed");
		assert.strictEqual(oStepRequestView.byId("idEntity").getSelectedKey(), "Not Available: entitySet1", "then step request entity field is populated");
		//for select properties
		assert.strictEqual(spyOnAddSelectProperty.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the step object");
		assert.strictEqual(spyOnAddSelectProperty.calledWith("property3"), true, "then addSelectPropertiesOfValueHelp is called the step object");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getSelectProperties(), [ "property1", "property3" ], "then select properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then step request selected properties field are populated");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet1"), true, "then all selected properties are fetched for the correct service and entity");
		//for selectable properties
		assert.deepEqual(spyOnAddFilterProperty.calledWith("property3"), true, "then filter property is added on the step object");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [ "property3" ], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "property3", "then step request selectable property is set");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
	});
	QUnit.module("For an existing step - Validate previously selected properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				spyOnGetAllPropertiesOfEntitySet.restore();
				spyOnGetAllPropertiesOfEntitySet = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getAllPropertiesOfEntitySetAsPromise", function() {
					return sap.apf.utils.createPromise([ "property1", "property2", "property4", "property1Text", "property3Text" ]); //property 3 is not available due to change in metadata
				});
				oStepRequestView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When step request view is initialized", function(assert) {
		//arrange
		var oViewData = oStepRequestView.getViewData();
		var oController = oStepRequestView.getController();
		var oModelForEntity = _getModelForEntity();
		var aProperties = _getModelForSelectProperties().Objects;
		aProperties.splice(2, 1);
		aProperties.splice(0, 0, {
			"key" : "Not Available: property3",
			"name" : "Not Available: property3"
		});
		var oModelForProperties = {
			"Objects" : aProperties
		};
		var oModelForFilterProperty = _getModelForNotAvailableFilterProp();
		//assert
		assert.ok(oStepRequestView, "then step request view is available");
		// source section asserts
		assert.strictEqual(spyOnGetService.calledTwice, true, "then entity set is got from the step request object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then step request  source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then step request  source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetEntitySet.calledTwice, true, "then  entity set is got from the step request object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then  entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then  entity label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet1", "then  entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForEntity, "then  entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oStepRequestView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectProperties.calledTwice, true, "then  select properties are got from the step request object");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getText(), oViewData.oTextReader("selectProperties"), "then  select properties label is populated");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getRequired(), true, "then  select properties label field is set as required");
		assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property3", "property1" ], "then  selected properties field are populated");
		assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelForProperties, "then  selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oStepRequestView.byId("idSource").getValue(), oController.byId("idEntity").getSelectedKey()), true,
				"then all selected properties are fetched for the correct service and entity");
		//for selectable properties
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [ "property3" ], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then step request selectable property is set");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
	});
	QUnit.test("When select property is changed - a not available property is selected", function(assert) {
		//arrange
		var oModelForFilterProperty = _getModelForNotAvailableFilterProp();
		//action
		oStepRequestView.byId("idSelectProperties").setSelectedKeys([ "Not Available: property3", "property1" ]);
		oStepRequestView.getController().handleChangeForSelectProperty(_createEvent(oStepRequestView.byId("idSelectProperties")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.strictEqual(spyOnAddSelectProperty.calledWith("property3"), true, "then addSelectPropertiesOfValueHelp is called the step request object");
		assert.strictEqual(spyOnAddSelectProperty.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the step request object");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getSelectProperties(), [ "property3", "property1" ], "then select properties of  is changed");
		assert.deepEqual(oStepRequestView.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: property3", "property1" ], "then  selected properties field are populated");
		//for selectable properties
		assert.deepEqual(spyOnAddFilterProperty.calledWith("property3"), true, "then filter property is added on the step object");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [ "property3" ], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then step request selectable property is set");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
	});
	QUnit.test("When selectable property (required filter) is changed - a not available filter property is selected", function(assert) {
		//arrange
		var oModelForFilterProperty = _getModelForNotAvailableFilterProp();
		//action
		oStepRequestView.byId("idOptionalRequestField").setSelectedKey("Not Available: property3");
		oStepRequestView.getController().handleChangeForOptionalRequestField(_createEvent(oStepRequestView.byId("idOptionalRequestField")));
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oStepRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for selectable properties
		assert.deepEqual(spyOnAddFilterProperty.calledWith("property3"), true, "then filter property is added on the step object");
		assert.deepEqual(oStepRequestView.getViewData().oParentObject.getFilterProperties(), [ "property3" ], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getSelectedKey(), "Not Available: property3", "then step request selectable property is set");
		assert.deepEqual(oStepRequestView.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
	});
	QUnit.module("Async loading of existing StepRequest", {
		beforeEach : function(assert) {
			var done = assert.async();
			var configurationHandler = {
				getTextPool : function(){
					return {};
				}
			};
			var configurationEditor = {
				getAllEntitySetsOfServiceAsPromise : function(service){
					if(service === "TestService"){
						return sap.apf.utils.createPromise(["EntitySet1", "EntitySet2"], 1);
					}
				},
				getAllPropertiesOfEntitySetAsPromise : function(service, entitySet){
					if(service === "TestService" && entitySet === "EntitySet2"){
						return sap.apf.utils.createPromise(["property1", "selectableProperty"], 1);
					}
				}
			};
			var stepObject = {
				getService : function(){
					return "TestService";
				},
				getEntitySet : function(){
					return "EntitySet2";
				},
				getFilterProperties : function(){
					return ["selectableProperty"];
				},
				getSelectProperties : function(){
					return ["property1", "selectableProperty"];
				},
				getFilterPropertyLabelKey : function(){}, //default
				getFilterPropertyLabelDisplayOption: function(){
					return "key";
				},
				getType : function(){} //not hierarchical step
			};
			var getText = function(textKey){
				return textKey;
			};
			var entityTypeMetadata = {};
			var stepPropertyMetadataHandler = {
				getEntityTypeMetadataAsPromise : function(){
					return sap.apf.utils.createPromise(entityTypeMetadata, 1);
				},
				getDefaultLabel : function(metadata, property){
					return property;
				},
				hasTextPropertyOfDimension : function(){
					return false;
				}
			};
			this.oStepRequestController = sap.ui.controller("sap.apf.modeler.ui.controller.stepRequest");
			sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.requestOptions",
				controller : this.oStepRequestController,
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : {
					oConfigurationHandler : configurationHandler,
					oConfigurationEditor : configurationEditor,
					oTextReader: getText,
					oParentObject : stepObject,
					oStepPropertyMetadataHandler : stepPropertyMetadataHandler
				},
				async: true
			}).loaded().then(function(oView){
				this.oStepRequestController.initPromise.done(function(){
					done();
				});
			}.bind(this));
		}
	});
	QUnit.test("When step request view is initialized", function(assert) {
		assert.strictEqual(this.oStepRequestController.byId("idSource").getValue(), "TestService", "Service field is populated with saved service");
		assert.strictEqual(this.oStepRequestController.byId("idEntity").getSelectedKey(), "EntitySet2", "EntitySet field has correct entitySet selected");
		assert.strictEqual(this.oStepRequestController.byId("idEntity").getSelectedItem().getText(), "EntitySet2", "EntitySet has correct text");
		assert.strictEqual(this.oStepRequestController.byId("idSelectProperties").getSelectedItems().length, 2, "2 properties are selected");
		assert.strictEqual(this.oStepRequestController.byId("idSelectProperties").getSelectedItems()[0].getKey(), "property1", "First Property is correct");
		assert.strictEqual(this.oStepRequestController.byId("idSelectProperties").getSelectedItems()[1].getKey(), "selectableProperty", "Second Property is correct");
		assert.strictEqual(this.oStepRequestController.byId("idOptionalRequestField").getSelectedKey(), "selectableProperty", "Correct selectable property set");
		assert.strictEqual(this.oStepRequestController.byId("idOptionalSelectedPropertyLabelText").getValue(), "selectableProperty", "Correct selectable property label(default)");
	});
}());
