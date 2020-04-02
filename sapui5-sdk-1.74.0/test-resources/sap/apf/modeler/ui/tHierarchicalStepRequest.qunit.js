/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tHierarchicalStepRequest');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require('sap.apf.utils.utils');
(function() {
	'use strict';
	var oStepRequestController, oStepRequestView, spyOnGetText, spyOnGetService, oStepRequestViewWithNotAvailable, spyOnResetEntityAndProperties, spyOnSetHierarchyProperty, spyOnSetValidationStateForService, spyOnGetAllNonHierarchicalPropertiesOfEntitySet, spyOnGetHierarchyProperty, spyOnGetAllHierarchicalPropertiesOfEntitySet, spyOnGetEntitySet, spyOnGetAllHierarchicalEntitySetsOfServiceAsPromise, spyOnGetSelectProperties, spyOnConfigEditorRegisterService, spyOnSetService, spyOnSetEntitySet, spyOnAddSelectProperty, spyOnConfigEditorSetIsUnsaved, spyOnRemoveSelectProperty, spyOnAddFilterProperty, spyOnRemoveFilterProperty, spyOnGetFilterProperties, oModelerInstance, spyOnFireEvent;
	function _doNothing() {
		return "";
	}
	function _createEvent(value) {
		return {
			getSource : function() {
				return value;
			},
			getParameters : function() {
				return {
					selectedItem : {
						getKey : function() {
							return "hierarchicalproperty2";
						},
						getText : function() {
							return "hierarchicalproperty2";
						}
					}
				};
			}
		};
	}
	function _commonSpiesInBeforeEach() {
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnConfigEditorRegisterService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "registerServiceAsPromise");
		spyOnGetAllHierarchicalEntitySetsOfServiceAsPromise = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllHierarchicalEntitySetsOfServiceAsPromise");
		spyOnGetAllHierarchicalPropertiesOfEntitySet = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getHierarchicalPropertiesOfEntitySetAsPromise");
		spyOnGetAllNonHierarchicalPropertiesOfEntitySet = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getNonHierarchicalPropertiesOfEntitySet");
		spyOnGetService = sinon.spy(oModelerInstance.firstHierarchicalStep, "getService");
		spyOnGetEntitySet = sinon.spy(oModelerInstance.firstHierarchicalStep, "getEntitySet");
		spyOnGetHierarchyProperty = sinon.spy(oModelerInstance.firstHierarchicalStep, "getHierarchyProperty");
		spyOnSetHierarchyProperty = sinon.spy(oModelerInstance.firstHierarchicalStep, "setHierarchyProperty");
		spyOnGetSelectProperties = sinon.spy(oModelerInstance.firstHierarchicalStep, "getSelectProperties");
		spyOnGetFilterProperties = sinon.spy(oModelerInstance.firstHierarchicalStep, "getFilterProperties");
		spyOnSetService = sinon.spy(oModelerInstance.firstHierarchicalStep, "setService");
		spyOnSetEntitySet = sinon.spy(oModelerInstance.firstHierarchicalStep, "setEntitySet");
		spyOnAddSelectProperty = sinon.spy(oModelerInstance.firstHierarchicalStep, "addSelectProperty");
		spyOnRemoveSelectProperty = sinon.spy(oModelerInstance.firstHierarchicalStep, "removeSelectProperty");
		spyOnAddFilterProperty = sinon.spy(oModelerInstance.hierarchicalStepWithFilter, "addFilterProperty");
		spyOnRemoveFilterProperty = sinon.spy(oModelerInstance.hierarchicalStepWithFilter, "removeFilterProperty");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
	}
	function _commonCleanUpsInAfterEach() {
		spyOnConfigEditorSetIsUnsaved.restore();
		spyOnConfigEditorRegisterService.restore();
		spyOnGetAllHierarchicalEntitySetsOfServiceAsPromise.restore();
		spyOnGetAllHierarchicalPropertiesOfEntitySet.restore();
		spyOnGetAllNonHierarchicalPropertiesOfEntitySet.restore();
		spyOnGetService.restore();
		spyOnGetEntitySet.restore();
		spyOnGetHierarchyProperty.restore();
		spyOnSetHierarchyProperty.restore();
		spyOnGetSelectProperties.restore();
		spyOnGetFilterProperties.restore();
		spyOnSetService.restore();
		spyOnSetEntitySet.restore();
		spyOnAddSelectProperty.restore();
		spyOnAddFilterProperty.restore();
		spyOnRemoveSelectProperty.restore();
		spyOnRemoveFilterProperty.restore();
		spyOnGetText.restore();
		spyOnFireEvent.restore();
		oModelerInstance.reset();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oStepRequestView.destroy();
	}
	function _instantiateView(sId, assert) {
		var oStepRequestController = new sap.ui.controller("sap.apf.modeler.ui.controller.hierarchicalStepRequest");
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
			},
			getPropertyMetadata : function(entityTypeMetadata, sPropertyName) {
				return [ {
					"hierarchy-node-for" : sPropertyName
				} ];
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
	function _getModelForHierarchicalEntity() {
		return {
			"Objects" : [ {
				"key" : "hierarchicalEntitySet1",
				"name" : "hierarchicalEntitySet1"
			}, {
				"key" : "hierarchicalEntitySet2",
				"name" : "hierarchicalEntitySet2"
			} ]
		};
	}
	function _getModelForNotAvailableHierarchicalEntity() {
		return {
			"Objects" : [ {
				"key" : "Not Available: hierarchicalEntitySet1",
				"name" : "Not Available: hierarchicalEntitySet1"
			} ]
		};
	}
	function _getModelForHierarchicalProperty() {
		return {
			"Objects" : [ {
				"key" : "hierarchicalproperty1",
				"name" : "hierarchicalproperty1"
			}, {
				"key" : "hierarchicalproperty2",
				"name" : "hierarchicalproperty2"
			} ]
		};
	}
	function _getModelForNotAvailableHierarchicalProperty() {
		return {
			"Objects" : [ {
				"key" : "Not Available: hierarchicalproperty1",
				"name" : "Not Available: hierarchicalproperty1"
			} ]
		};
	}
	function _getModelForNonHierarchicalSelectProperties() {
		return {
			"Objects" : [ {
				"key" : "nonHierarchicalproperty1",
				"name" : "nonHierarchicalproperty1"
			}, {
				"key" : "nonHierarchicalproperty2",
				"name" : "nonHierarchicalproperty2"
			} ]
		};
	}
	function _getModelForNotAvailableNonHierarchicalSelectProperties() {
		return {
			"Objects" : [ {
				"key" : "Not Available: nonHierarchicalproperty1",
				"name" : "Not Available: nonHierarchicalproperty1"
			}, {
				"key" : "Not Available: nonHierarchicalproperty2",
				"name" : "Not Available: nonHierarchicalproperty2"
			} ]
		};
	}
	function _getModelForFilterProperties() {
		return {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "hierarchicalproperty1",
				"name" : "hierarchicalproperty1"
			} ]
		};
	}
	function _getModelForNotAvailableFilterProp() {
		return {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "Not Available: hierarchicalproperty1",
				"name" : "Not Available: hierarchicalproperty1"
			} ]
		};
	}
	function _getModelForFilterPropertiesAfterChange() {
		return {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "hierarchicalproperty2",
				"name" : "hierarchicalproperty2"
			} ]
		};
	}
	function _placeViewAt(oStepRequestView) {
		var divToPlaceStep = document.createElement("div");
		divToPlaceStep.setAttribute('id', 'contentOfStepRequest');
		document.body.appendChild(divToPlaceStep);
		oStepRequestView.placeAt("contentOfStepRequest");
		sap.ui.getCore().applyChanges();
	}
	function _commonAssertBeforeEach(assert, bHasRequiredFilter) {
		var sSelectableProeprty = bHasRequiredFilter ? "hierarchicalproperty1" : "None";
		//label for the request section
		assert.strictEqual(spyOnGetText.calledWith("source"), true, "then label of source is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("hierarchicalEntity"), true, "then label of hierarchical entity is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("hierarchicalProperty"), true, "then label of hierarchical Property is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("nonHierarchicalProperty"), true, "then label of non Hierarchical Property is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("requiredFilters"), true, "then label of required Filters is set correctly");
		//mandatory fields in the request section
		assert.strictEqual(oStepRequestView.byId("idEntityLabel").getRequired(), true, "then hierarchical entity label is set required");
		assert.strictEqual(oStepRequestView.byId("idOptionalPropertyLabel").getRequired(), true, "then hierarchical property label is set required");
		assert.strictEqual(oStepRequestView.byId("idSelectPropertiesLabel").getRequired(), false, "then non hierarchical property label is not set as required");
		assert.strictEqual(oStepRequestView.byId("idOptionalRequestFieldLabel").getRequired(), false, "then selectable property label is not set as required");
		//selected property as required filter
		assert.deepEqual(oStepRequestController.byId("idOptionalRequestField").getSelectedKey(), sSelectableProeprty, "then correct property is selected as required filter");
		//visibility of optional hierarchical property
		assert.strictEqual(oStepRequestView.byId("idOptionalPropertyLabel").getVisible(), true, "then hierarchical property lable is visible");
		assert.strictEqual(oStepRequestView.byId("idOptionalPropertyLabel").getVisible(), true, "then hierarchical property is visible");
	}
	QUnit.module("When request option is instantiated for a hierarchical step", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				oStepRequestView = _instantiateView(oModelerInstance.firstHierarchicalStep, assert);
				oStepRequestController = oStepRequestView.getController();
				spyOnResetEntityAndProperties = sinon.spy(oStepRequestController, "resetEntityAndProperties");
				done();
			});
		},
		afterEach : function() {
			spyOnResetEntityAndProperties.restore();
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When hierarchical step request is initialized", function(assert) {
		//arrange
		_placeViewAt(oStepRequestView);
		var oModelForHierarchicalEntity = _getModelForHierarchicalEntity();
		var oModelForHierarchicalProperty = _getModelForHierarchicalProperty();
		var oModelNonHierarchicalProperty = _getModelForNonHierarchicalSelectProperties();
		var oModelForFilterProperty = _getModelForFilterProperties();
		//assert
		_commonAssertBeforeEach(assert, false);
		assert.ok(oStepRequestView, "then stepRequest view is available");
		// source section asserts
		assert.strictEqual(spyOnGetService.called, true, "then service for step request is retrieved from the step object");
		assert.ok(oStepRequestController.byId("idSourceLabel").getText(), "then step request source label is populated");
		assert.strictEqual(spyOnGetText.calledWith("source"), true, "then step request source label is set correctly");
		assert.strictEqual(oStepRequestController.byId("idSource").getValue(), "hierarchicalService1", "then step request source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetEntitySet.called, true, "then step request hierarchical entity set is retrieved from the step object");
		assert.ok(oStepRequestController.byId("idEntityLabel").getText(), "then step request hierarchical entity label is populated");
		assert.strictEqual(spyOnGetText.calledWith("hierarchicalEntity"), true, "then step request hierarchical entity label is set correctly");
		assert.strictEqual(oStepRequestController.byId("idEntity").getSelectedKey(), "hierarchicalEntitySet1", "then step request entity hierarchical field is populated");
		assert.deepEqual(oStepRequestController.byId("idEntity").getModel().getData(), oModelForHierarchicalEntity, "then step request entity hierarchical field model is set");
		assert.strictEqual(spyOnGetAllHierarchicalEntitySetsOfServiceAsPromise.calledOnce, true, "then all hierarchical entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllHierarchicalEntitySetsOfServiceAsPromise.calledWith(oStepRequestView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// entity hierarchy property asserts
		assert.strictEqual(spyOnGetHierarchyProperty.called, true, "then step request hierarchical property is retrieved from the step object");
		assert.ok(oStepRequestController.byId("idOptionalPropertyLabel").getText(), "then step request hierarchical property label is populated");
		assert.strictEqual(spyOnGetText.calledWith("hierarchicalEntity"), true, "then step request hierarchical property label is set correctly");
		assert.strictEqual(oStepRequestController.byId("idOptionalProperty").getSelectedKey(), "hierarchicalproperty1", "then step request hierarchical property field is populated");
		assert.deepEqual(oStepRequestController.byId("idOptionalProperty").getModel().getData(), oModelForHierarchicalProperty, "then step request hierarchical property field model is set");
		assert.strictEqual(spyOnGetAllHierarchicalPropertiesOfEntitySet.called, true, "then all hierarchical propertiesare fetched for the service");
		assert.strictEqual(spyOnGetAllHierarchicalPropertiesOfEntitySet.calledWith(oStepRequestView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// non hierarchical select property section asserts
		assert.strictEqual(spyOnGetSelectProperties.called, true, "then step request select properties are got from the step object");
		assert.strictEqual(spyOnGetText.calledWith("nonHierarchicalProperty"), true, "then step request select properties label is populated");
		assert.deepEqual(oStepRequestController.byId("idSelectProperties").getSelectedKeys(), [ "nonHierarchicalproperty1", "nonHierarchicalproperty2" ], "then step request selected properties field are populated");
		assert.deepEqual(oStepRequestController.byId("idSelectProperties").getModel().getData(), oModelNonHierarchicalProperty, "then step request selected properties field model is set");
		assert.strictEqual(spyOnGetAllNonHierarchicalPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllNonHierarchicalPropertiesOfEntitySet.calledWith(oStepRequestView.byId("idSource").getValue(), oStepRequestController.byId("idEntity").getSelectedKey()), true,
				"then all selected properties are fetched for the correct service and entity");
		//selectable property assertions
		assert.strictEqual(spyOnGetFilterProperties.called, true, "then step request selectable properties are got from the step object");
		assert.strictEqual(spyOnGetText.calledWith("requiredFilters"), true, "then step request selectable properties label is populated");
		assert.deepEqual(oStepRequestController.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfStepRequest'));
	});
	QUnit.test("When getAllEntitiesAsPromise is called to retrieve all the hierarchical entities for the given service", function(assert) {
		//arrange
		var aExpectedhierarchicalEntity = [ "hierarchicalEntitySet1", "hierarchicalEntitySet2" ];
		//action
		oStepRequestView.getController().getAllEntitiesAsPromise("hierarchicalService1").done(function(aAllEntities) {
			//assert
			assert.deepEqual(aAllEntities, aExpectedhierarchicalEntity, "then correct entity sets are returned");
			assert.strictEqual(oStepRequestView.byId("idSource").getValueState(), sap.ui.core.ValueState.None, "then the value state of service input is None");
		});
	});
	QUnit.test("When getHierarchicalProperty is called to retrieve all the hierarchical properties for the given service and entity", function(assert) {
		//arrange
		var aExpectedHierarchicalProperties = [ "hierarchicalproperty1", "hierarchicalproperty2" ];
		//action
		oStepRequestView.getController().getHierarchicalProperty("hierarchicalService1", "hierarchicalEntitySet1").done(function(aAllHierarchicalProperties) {
			//assert
			assert.deepEqual(aAllHierarchicalProperties, aExpectedHierarchicalProperties, "then correct hierarchical properties are returned");
		});
	});
	QUnit.test("When getAllEntitySetPropertiesAsPromise is called to retrieve all the non hierarchical properties for the given service and entity", function(assert) {
		//arrange
		var aExpectedNonHierarchicalProperties = [ "nonHierarchicalproperty1", "nonHierarchicalproperty2" ];
		//action
		oStepRequestView.getController().getAllEntitySetPropertiesAsPromise("hierarchicalService1", "hierarchicalEntitySet1").done(function(aAllNonHierarchicalProperties) {
			//assert
			assert.deepEqual(aAllNonHierarchicalProperties, aExpectedNonHierarchicalProperties, "then correct non hierarchical properties are returned");
		});
	});
	QUnit.test("When hierarchical property is changed - the model for the selectable property is changed", function(assert) {
		//arrange
		var oModelForFilterProperty = _getModelForFilterProperties();
		var oModelForFilterPropertyAfterChange = _getModelForFilterPropertiesAfterChange();
		assert.deepEqual(oStepRequestController.byId("idOptionalRequestField").getModel().getData(), oModelForFilterProperty, "then step request selectable properties field model is set");
		assert.deepEqual(oStepRequestView.getController().getOptionalRequestFieldProperty(), [], "then no property is set as required property");
		assert.deepEqual(oStepRequestController.byId("idOptionalRequestField").getSelectedKey(), "None", "then None is selected as selectable property");
		//action
		oStepRequestView.byId("idOptionalProperty").setSelectedKey("hierarchicalproperty2");
		oStepRequestView.getController().handleChangeForOptionalProperty(_createEvent(oStepRequestView.byId("idOptionalProperty")));
		//assert
		assert.deepEqual(oStepRequestController.byId("idOptionalRequestField").getModel().getData(), oModelForFilterPropertyAfterChange, "then step request selectable properties field model is set after changing the value");
		assert.deepEqual(oStepRequestView.getController().getOptionalRequestFieldProperty(), [], "then none is set as required property since the model has changed");
		assert.deepEqual(oStepRequestController.byId("idOptionalRequestField").getSelectedKey(), "None", "then none is selected as selectable property");
		assert.strictEqual(spyOnSetHierarchyProperty.calledWith("hierarchicalproperty2"), true, "then setHierarchyProperty is called with correct value - hierarchicalproperty2");
	});
	QUnit.test("When selectable property is changed", function(assert) {
		//action
		oStepRequestView.byId("idOptionalProperty").setSelectedKey("hierarchicalproperty2");
		oStepRequestView.getController().handleChangeForOptionalProperty(_createEvent(oStepRequestView.byId("idOptionalProperty")));
		//assert
		assert.strictEqual(spyOnSetHierarchyProperty.calledWith("hierarchicalproperty2"), true, "then setHierarchyProperty is called with correct value - hierarchicalproperty2");
		assert.strictEqual(oStepRequestView.getController().getSelectedHierarchicalProperty(), "hierarchicalproperty2", "then correct value is set as hierarchy property");
	});
	QUnit.module("Handle change for source", {
		beforeEach : function(assert) {
			sinon.config = {
				useFakeTimers : false
			}; //because of setTimout usage
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				oModelerInstance.firstHierarchicalStep.setHierarchyProperty("");
				oStepRequestView = _instantiateView(oModelerInstance.firstHierarchicalStep, assert);
				oStepRequestController = oStepRequestView.getController();
				spyOnResetEntityAndProperties = sinon.spy(oStepRequestController, "resetEntityAndProperties");
				done();
			});
		},
		afterEach : function() {
			spyOnResetEntityAndProperties.restore();
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When a service which has hierarchical entity is entered", function(assert) {
		var done = assert.async();
		//arrange
		var sDefaultValidationState = {
			sValueState : sap.ui.core.ValueState.None,
			sValueStateText : ""
		};
		//action
		oStepRequestView.byId("idSource").setValue("hierarchicalService1");
		oStepRequestView.getController().handleChangeForSourceAsPromise(_createEvent(oStepRequestView.byId("idSource"))).done(function() {
			//assert
			oStepRequestView.getController().getAllEntitiesAsPromise("hierarchicalService1").done(function(aAllEntities) {
				assert.strictEqual(aAllEntities.length, 2, "then 2 entity set is returned");
				assert.strictEqual(spyOnSetValidationStateForService.called, true, "then setValidationStateForService is called with correct value");
				assert.strictEqual(oStepRequestView.byId("idSource").getValueState(), sDefaultValidationState.sValueState, "then the value state of service input is None");
				assert.strictEqual(oStepRequestView.byId("idSource").getValueStateText(), sDefaultValidationState.sValueStateText, "then no value state text is set to the service input");
				assert.strictEqual(oStepRequestController.byId("idOptionalProperty").getSelectedKey(), "hierarchicalproperty1", "then step request hierarchical property field is populated");
				assert.strictEqual(spyOnSetHierarchyProperty.calledWith("hierarchicalproperty1"), true, "then step request hierarchical property is set to the step object");
				done();
			});
		});
	});
	QUnit.test("When a service which does not have hierarchical entity is entered", function(assert) {
		//arrange
		var sValidationState = {
			sValueState : sap.ui.core.ValueState.Error,
			sValueStateText : "The service you have entered does not have an entity set with a hierarchy."
		};
		//action
		oStepRequestView.byId("idSource").setValue("hierarchicalService2");
		oStepRequestView.getController().handleChangeForSourceAsPromise(_createEvent(oStepRequestView.byId("idSource"))).done(function() {
			oStepRequestView.getController().getAllEntitiesAsPromise("hierarchicalService2").done(function(aAllEntities) {
				//assert
				assert.deepEqual(aAllEntities, [], "then no entity set is returned");
				assert.strictEqual(oStepRequestView.byId("idSource").getValueState(), sap.ui.core.ValueState.Error, "then the value state of service input is Error");
				assert.strictEqual(spyOnGetText.calledWith("hierarchicalServiceError"), true, "then error text for service is called");
				assert.strictEqual(spyOnSetValidationStateForService.calledWith(sValidationState), true, "then setValidationStateForService is called with correct value");
				assert.strictEqual(spyOnResetEntityAndProperties.called, true, "then resetEntityAndProperties is called");
			});
		});
	});
	QUnit.module("When request option is instantiated for a hierarchical step which has a required filter", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				oStepRequestView = _instantiateView(oModelerInstance.hierarchicalStepWithFilter, assert);
				oStepRequestController = oStepRequestView.getController();
				spyOnResetEntityAndProperties = sinon.spy(oStepRequestController, "resetEntityAndProperties");
				done();
			});
		},
		afterEach : function() {
			spyOnResetEntityAndProperties.restore();
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When hierarchical step request with required filter is initialized", function(assert) {
		//arrange
		_placeViewAt(oStepRequestView);
		//assert
		_commonAssertBeforeEach(assert, true);
		//cleanup
		document.body.removeChild(document.getElementById('contentOfStepRequest'));
	});
	QUnit.test("When selectable property is changed", function(assert) {
		//action
		oStepRequestView.byId("idOptionalRequestField").setSelectedKey("hierarchicalproperty2");
		assert.deepEqual(oStepRequestView.getController().getOptionalRequestFieldProperty(), [ "hierarchicalproperty1" ], "then hierarchicalproperty1 is set as required property initially");
		oStepRequestView.getController().handleChangeForOptionalRequestField(_createEvent(oStepRequestView.byId("idOptionalRequestField")));
		//assert 
		assert.strictEqual(spyOnAddFilterProperty.calledWith("hierarchicalproperty2"), true, "then addFilterProperty is called with correct value - hierarchicalproperty2");
		assert.strictEqual(spyOnRemoveFilterProperty.called, true, "then removeFilterProperty is called");
		assert.deepEqual(oStepRequestView.getController().getOptionalRequestFieldProperty(), [ "hierarchicalproperty2" ], "then hierarchicalproperty2 is set as required property after change");
	});
	QUnit.module("When the enetity, hierarchy property, non-hierarchy properties and selctable property are not available because of metadata unavailibility", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				spyOnGetAllHierarchicalEntitySetsOfServiceAsPromise = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getAllHierarchicalEntitySetsOfServiceAsPromise", function() {
					return sap.apf.utils.createPromise([]);
				});
				spyOnGetAllHierarchicalPropertiesOfEntitySet = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getHierarchicalPropertiesOfEntitySetAsPromise", function() {
					return sap.apf.utils.createPromise([]);
				});
				spyOnGetAllNonHierarchicalPropertiesOfEntitySet = sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getNonHierarchicalPropertiesOfEntitySet", function() {
					return sap.apf.utils.createPromise([]);
				});
				sinon.stub(oModelerInstance.configurationEditorForUnsavedConfig, "getHierarchyNodeIdAsPromise", function() {
					return sap.apf.utils.createPromise(null);
				});
				oStepRequestViewWithNotAvailable = _instantiateView(oModelerInstance.hierarchicalStepWithFilterForNotAvailable, assert);
				done();
			});
		},
		afterEach : function() {
			oStepRequestViewWithNotAvailable.destroy();
		}
	});
	QUnit.test("When hierarchical step request view is initialized with Not Available properties", function(assert) {
		//arrange
		var oViewData = oStepRequestViewWithNotAvailable.getViewData();
		var oController = oStepRequestViewWithNotAvailable.getController();
		var oModelForNotAvailableHierarchicalEntity = _getModelForNotAvailableHierarchicalEntity();
		var oModelForNotAvailableHierarchicalProperty = _getModelForNotAvailableHierarchicalProperty();
		var oModelNotAvailableNonHierarchicalProperty = _getModelForNotAvailableNonHierarchicalSelectProperties();
		var oModelForNotAvailableFilterProperty = _getModelForNotAvailableFilterProp();
		//assert
		assert.ok(oStepRequestViewWithNotAvailable, "then step request view is available");
		// source section asserts
		assert.ok(oController.byId("idSourceLabel").getText(), "then step request  source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "hierarchicalService1", "then step request  source field is populated");
		// entity section asserts
		assert.ok(oController.byId("idEntityLabel").getText(), "then  entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then  entity label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "Not Available: hierarchicalEntitySet1", "then  entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForNotAvailableHierarchicalEntity, "then  entity field model is set");
		//hierarchical property asserts
		assert.ok(oController.byId("idOptionalPropertyLabel").getText(), "then hierarchical property label is populated");
		assert.strictEqual(oController.byId("idOptionalPropertyLabel").getRequired(), true, "then  hierarchical property label field is set as required");
		assert.strictEqual(oController.byId("idOptionalProperty").getSelectedKey(), "Not Available: hierarchicalproperty1", "then  hierarchical property field is populated");
		assert.deepEqual(oController.byId("idOptionalProperty").getModel().getData(), oModelForNotAvailableHierarchicalProperty, "then  hierarchical property field model is set");
		//non hierarchical property asserts
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getText(), oViewData.oTextReader("nonHierarchicalProperty"), "then  select properties label is populated");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getRequired(), false, "then  select properties label field is set as not required");
		assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "Not Available: nonHierarchicalproperty1", "Not Available: nonHierarchicalproperty2" ], "then  selected properties field are populated");
		assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelNotAvailableNonHierarchicalProperty, "then  selected properties field model is set");
		//for selectable properties
		assert.deepEqual(oStepRequestViewWithNotAvailable.getViewData().oParentObject.getFilterProperties(), [ "hierarchicalproperty1" ], "then selectable properties of step request is changed");
		assert.deepEqual(oStepRequestViewWithNotAvailable.byId("idOptionalRequestField").getSelectedKey(), "Not Available: hierarchicalproperty1", "then step request selectable property is set");
		assert.deepEqual(oStepRequestViewWithNotAvailable.byId("idOptionalRequestField").getModel().getData(), oModelForNotAvailableFilterProperty, "then step request selectable properties field model is set");
	});
}());
