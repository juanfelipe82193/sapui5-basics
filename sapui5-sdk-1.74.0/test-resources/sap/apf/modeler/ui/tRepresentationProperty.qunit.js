/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tRepresentationProperty');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	'use strict';
	var oRepPropertyView, oModelerInstance, spyOnGetText, spyOnSetText, spyOnGetPropertyTextLabelKey, spyOnSetPropertyTextLabelKey, spyOnGetRepresentationType, spyOnConfigEditorSetIsUnsaved, spyOnSetPropertyKind, spyOnAddProperty, spyOnRemoveProperty, oModelForPropertyType;
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
	function _placeViewAt(oRepPropertyView) {
		var divToPlaceRepProperty = document.createElement("div");
		divToPlaceRepProperty.setAttribute('id', 'contentOfFF');
		document.body.appendChild(divToPlaceRepProperty);
		oRepPropertyView.placeAt("contentOfFF");
		sap.ui.getCore().applyChanges();
	}
	function _commonSpiesInBeforeEach(isHierarchicalStep) {
		var oStep = isHierarchicalStep ? oModelerInstance.firstHierarchicalStep : oModelerInstance.unsavedStepWithoutFilterMapping;
		var oRepresentation = isHierarchicalStep ? oStep.getRepresentations()[0] : oStep.getRepresentations()[2];
		spyOnGetRepresentationType = sinon.spy(oRepresentation, "getRepresentationType");
		spyOnAddProperty = sinon.spy(oRepresentation, "addProperty");
		spyOnSetPropertyKind = sinon.spy(oRepresentation, "setPropertyKind");
		spyOnGetPropertyTextLabelKey = sinon.spy(oRepresentation, "getPropertyTextLabelKey");
		spyOnSetPropertyTextLabelKey = sinon.spy(oRepresentation, "setPropertyTextLabelKey");
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnSetText = sinon.spy(oModelerInstance.configurationHandler.getTextPool(), "setTextAsPromise");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
		spyOnRemoveProperty = sinon.spy(oRepresentation, "removeProperty");
	}
	function _instantiateView (sId, assert, oStep, isHierarchicalStep, context) {
		var oPropertiesController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationProperty");
		var spyOnInit = sinon.spy(oPropertiesController, "onInit");
		context.spyHandlePressOfAddPropertyIcon = sinon.spy(oPropertiesController, "handlePressOfAddPropertyIcon");
		var oStepPropertyMetadataTypeHandlerStub = {
			getProperties : function(entityTypeMetadata) {
				return isHierarchicalStep ? [ "nonHierarchicalproperty1", "nonHierarchicalproperty2" ] : [ "property1", "property2", "property3" ];
			},
			getDefaultLabel : function(entityTypeMetadata, oText) {
				assert.equal(entityTypeMetadata.type, "myEntityTypeMetadataStub", "Correct parameter hand over");
				return oText;
			},
			hasTextPropertyOfDimension : function(entityTypeMetadata, sProperty) {
				assert.equal(entityTypeMetadata.type, "myEntityTypeMetadataStub", "Correct parameter hand over");
				var bHasTextProperty;
				if (sProperty === "property1") {
					bHasTextProperty = true;
				} else {
					bHasTextProperty = false;
				}
				return bHasTextProperty;
			},
			oStep : oStep,
			getEntityTypeMetadataAsPromise : function() {
				return sap.apf.utils.createPromise({
					type : "myEntityTypeMetadataStub"
				});
			},
			getStepType : function() {
				return isHierarchicalStep ? "hierarchicalStep" : "step";
			}
		};
		var oRepresentationTypeHandlerStub = {
			getLabelsForChartType : function() {
				return "Property for Column";
			},
			isAdditionToBeEnabled : function() {
				return true;
			}
		};
		var oPropertyTypeStateStub = {
			getPropertyValueState : function() {
				return isHierarchicalStep ? [ "None", "nonHierarchicalproperty1", "nonHierarchicalproperty2" ] : [ "property1" ];
			},
			indexOfPropertyTypeViewId : function() {
				return 0;
			}
		};
		var oPropertyTypeData = {
			sProperty : isHierarchicalStep ? "none" : "property1",
			sContext : "column"
		};
		oRepPropertyView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.propertyType",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oPropertiesController,
			viewData : {
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oParentObject : sId,
				oStepPropertyMetadataHandler : oStepPropertyMetadataTypeHandlerStub,
				oRepresentationTypeHandler : oRepresentationTypeHandlerStub,
				oCoreApi : oModelerInstance.modelerCore,
				oPropertyTypeState : oPropertyTypeStateStub,
				oPropertyTypeData : oPropertyTypeData,
				sPropertyType : sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes.PROPERTY
			}
		});
		oRepPropertyView.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		assert.strictEqual(spyOnInit.calledOnce, true, "then proprty type onInit function is called and view is initialized");
		return oRepPropertyView;
	}
	function _commonTestForSetDetailData(assert, sProperty) {
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property2",
				"name" : "property2"
			}, {
				"key" : "property3",
				"name" : "property3"
			} ]
		};
		assert.ok(oRepPropertyView, "then property view is available");
		//asserts for property label
		assert.strictEqual(spyOnGetPropertyTextLabelKey.called, true, "then property text label is available");
		assert.ok(oRepPropertyView.byId("idPropertyLabel").getText(), "then default label is set");
		assert.strictEqual(oRepPropertyView.byId("idPropertyLabelText").getValue(), sProperty, "then value for property label text input box is set as " + sProperty);
		assert.strictEqual(spyOnGetRepresentationType.called, true, "then representation type is found");
		//asserts for invisible text
		assert.strictEqual(spyOnGetText.calledWith("ariaTextForAddIcon"), true, "then invisible text for add icon is set");
		assert.strictEqual(spyOnGetText.calledWith("ariaTextForDeleteIcon"), true, "then invisible text for remove icon is set");
		//asserts for labels
		assert.strictEqual(spyOnGetText.calledWith("label"), true, "then label is set");
		assert.strictEqual(spyOnGetText.calledWith("default"), true, "then default label is set");
		assert.ok(oRepPropertyView.byId("idPropertyTypeLabel").getText(), "then property type label is populated");
		// asserts for add/remove
		assert.strictEqual(spyOnGetText.calledWith("addButton"), true, "then tooltip for add icon is set");
		assert.strictEqual(spyOnGetText.calledWith("deleteButton"), true, "then tooltip for remove icon is set");
		assert.ok(oRepPropertyView.byId("idAddPropertyIcon"), "then add icon to add property is available");
		assert.strictEqual(oRepPropertyView.byId("idAddPropertyIcon").getVisible(), true, "then add icon to add property is visible");
		assert.ok(oRepPropertyView.byId("idRemovePropertyIcon"), "then remove icon to remove property is available");
	}
	function _commonCleanUpsInAfterEach() {
		oRepPropertyView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oRepPropertyView.getViewData().oConfigurationHandler.getTextPool().setTextAsPromise.restore();
		spyOnGetRepresentationType.restore();
		spyOnGetPropertyTextLabelKey.restore();
		spyOnSetPropertyTextLabelKey.restore();
		spyOnAddProperty.restore();
		spyOnSetPropertyKind.restore();
		spyOnConfigEditorSetIsUnsaved.restore();
		spyOnRemoveProperty.restore();
		spyOnGetText.restore();
		oModelerInstance.reset();
		oRepPropertyView.destroy();
	}
	var oModelForPropertyTypeHierarchicalStep = {
		"Objects" : [ {
			"key" : "None",
			"name" : "None"
		}, {
			"key" : "nonHierarchicalproperty1",
			"name" : "nonHierarchicalproperty1"
		}, {
			"key" : "nonHierarchicalproperty2",
			"name" : "nonHierarchicalproperty2"
		} ]
	};
	QUnit.module("For a Representation with property type of Property", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property2", "property3" ],
						consumable : [ "property1", "property2", "property3" ]
					});
					return deferred.promise();
				});
				oRepPropertyView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[2], assert, oModelerInstance.unsavedStepWithoutFilterMapping, undefined, that);
				that.stubbedPropertyOrchestration = {
					getPropertyInformationList: function(){
						return [{
							sProperty: "property2",
							sKind: 'yAxis',
							sTextLabelKey: undefined,
							sLabelDisplayOption: undefined
						}];
					},
					isSwapCase: function(){
						return false;
					},
					getPropertyTypeRow: function(){
						return {
							propertyRowInformation: {
								sProperty: "property2"
							}
						}
					},
					getPropertyTypeRowByPropertyName: function(){
						return {
							propertyRowInformation: {
								sProperty: "property2"
							}
						}
					},
					updateAllSelectControlsForPropertyType: function() {
						return new Promise(function(resolve){
							resolve();
						});
					},
					getAggregationRole: function(){
						return null; // @see _mapPropertyType2AggregationRole()
					},
					_getPropertyTypeRows: function(){
						return [{
							propertyRowInformation: {
								sProperty: "property2"
							}
						}];
					},
					removePropertyTypeReference: function(){}
				};
				oRepPropertyView.getViewData().oPropertyOrchestration = that.stubbedPropertyOrchestration;
				that.noneValue = oRepPropertyView.getController().oTextReader("none");
				that.propertyOne = "property1";
				that.propertyTwo = "property2";
				that.twoPropertiesAndNone = [
					{
						"mProperties": {
							"key": that.noneValue,
							"name": that.noneValue
						}
					}, {
						"mProperties": {
							"key": that.propertyOne,
							"name": that.propertyOne
						}
					}, {
						"mProperties": {
							"key": that.propertyTwo,
							"name": that.propertyTwo
						}
					}];
				that.noneProperty = {
						"mProperties": {
							"key": that.noneValue,
							"name": that.noneValue
						}
					};
				that.propertyHugo = {
						"mProperties": {
							"key": that.propertyOne,
							"name": that.propertyOne
						}
					};
				that.propertyOtto = {
						"mProperties": {
							"key": that.propertyTwo,
							"name": that.propertyTwo
						}
					};
				that.stubGetItems;
				that.stubGetSelectedKey;
				that.stub_shallAddPropertyBeHandled;
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
			this.spyHandlePressOfAddPropertyIcon.restore();
			if(this.stubGetItems){
				this.stubGetItems.restore();
			}
			if(this.stubGetSelectedKey) {
				this.stubGetSelectedKey.restore();
			}
			if(this.stub_shallAddPropertyBeHandled){
				this.stub_shallAddPropertyBeHandled.restore();
			}
		}
	});
	QUnit.test("When Property view is initialized", function(assert) {
		_commonTestForSetDetailData(assert, "property1");
		assert.strictEqual(oRepPropertyView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as property1");
		assert.deepEqual(oRepPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepPropertyView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove property is not visible");
	});
	QUnit.test("When property type is changed", function(assert) {
		var done = assert.async();
		//arrange
		var propertyInformationList = [{
			sProperty: "property2",
			sKind: 'column',
			sTextLabelKey: undefined,
			sLabelDisplayOption: undefined
		}];
		this.stubbedPropertyOrchestration.getPropertyInformationList =  function(){
			return propertyInformationList;
		};
		oRepPropertyView.getViewData().oPropertyTypeState.getPropertyValueState = function() {
			return [ "property2" ];
		};
		var spy_getPropertyInformationList = sinon.spy(this.stubbedPropertyOrchestration, "getPropertyInformationList");
		var spy_updatePropertiesInConfiguration = sinon.spy(oRepPropertyView.getController(), "updatePropertiesInConfiguration");
		//action
		oRepPropertyView.byId("idPropertyType").setSelectedKey("property2");
		oRepPropertyView.getController().handleChangeForPropertyTypeAsPromise().then(function(){
			// THEN
			_commonTestForSetDetailData(assert, "property2");
			assert.strictEqual(oRepPropertyView.byId("idPropertyType").getSelectedKey(), "property2", "then value for property type is set as property2");
			assert.deepEqual(oRepPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
			assert.strictEqual(oRepPropertyView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove property is not visible");
			assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
			assert.strictEqual(spy_getPropertyInformationList.callCount, 1, "then getPropertyInformationList is called");
			assert.strictEqual(spy_updatePropertiesInConfiguration.callCount, 1, "then updatePropertiesInConfiguration is called");
			assert.strictEqual(spy_updatePropertiesInConfiguration.getCall(0).args[0], propertyInformationList, "then updatePropertiesInConfiguration is called with the expected parameters");
			assert.strictEqual(spyOnAddProperty.calledOnce, true, "then add property is called for property2");
			assert.strictEqual(spyOnAddProperty.getCall(0).args[0], "property2", "then add property is called with property2");
			assert.strictEqual(spyOnSetPropertyKind.calledOnce, true, "then SetPropertyKind is called for property2");
			assert.strictEqual(spyOnSetPropertyKind.calledWith("property2", "column"), true, "then SetPropertyKind is called with property2");
			assert.strictEqual(spyOnSetPropertyTextLabelKey.calledOnce, true, "then SetPropertyTextLabelKey is called for property2");
			assert.strictEqual(spyOnSetPropertyTextLabelKey.calledWith("property2", undefined), true, "then SetPropertyTextLabelKey is called with property2");
			spy_getPropertyInformationList.restore();
			spy_updatePropertiesInConfiguration.restore();
			done();
		});
	});
	QUnit.test("When label for property changed from default to new label", function(assert) {
		//action
		oRepPropertyView.byId("idPropertyLabelText").setValue("new label");
		oRepPropertyView.getController().handleChangeForLabelText();
		//assert
		assert.strictEqual(oRepPropertyView.byId("idPropertyLabelText").getValue(), "new label", "then property label text is changed to new label");
		assert.strictEqual(spyOnSetPropertyTextLabelKey.calledOnce, true, "then property label key is set in core");
		assert.strictEqual(spyOnSetPropertyTextLabelKey.calledWith("property1", "new label"), true, "then property label key is changes as new label");
		assert.strictEqual(spyOnSetText.calledOnce, true, "then api to set new label is called");
		assert.strictEqual(spyOnSetText.calledWith("new label", {
			TextElementType : "XTIT",
			MaximumLength : 80
		}), true, "then label value as new label is set");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When label for property changed from default to null", function(assert) {
		//action
		oRepPropertyView.byId("idPropertyLabelText").setValue("");
		oRepPropertyView.getController().handleChangeForLabelText();
		//assert
		assert.strictEqual(oRepPropertyView.byId("idPropertyLabelText").getValue(), "property1", "then property label text is still property4");
		assert.strictEqual(spyOnSetPropertyTextLabelKey.calledOnce, true, "then property label key is set in core");
		assert.strictEqual(spyOnSetPropertyTextLabelKey.calledWith("property1", undefined), true, "then property label key is not changed");
		assert.strictEqual(spyOnSetText.called, false, "then api to set new label is not called");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When suggestions are triggered for property label text", function(assert) {
		//arrangement
		var oEvent = _createEvent();
		var oTextPool = oModelerInstance.configurationHandler.getTextPool();
		var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oTextPool);
		sinon.stub(sap.apf.modeler.ui.utils, "SuggestionTextHandler", function() {
			return oSuggestionTextHandler;
		});
		var spyOnManageSuggestionTexts = sinon.spy(oSuggestionTextHandler, "manageSuggestionTexts");
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.REPRESENTATION_LABEL;
		//action
		oRepPropertyView.getController().handleChangeForLabelText();
		oRepPropertyView.getController().handleSuggestions(oEvent);
		//assert
		assert.strictEqual(spyOnManageSuggestionTexts.calledOnce, true, "then suggestions are fetched from SuggestionTextHandler");
		assert.strictEqual(spyOnManageSuggestionTexts.calledWith(oEvent, oTranslationFormat), true, "then suggestions are fetched from SuggestionTextHandler for the correct event");
		//clean ups
		spyOnManageSuggestionTexts.restore();
	});
	QUnit.test("When add icon of property is pressed", function(assert) {
		//arrange
		var propertyInformationList = [{
			sProperty: "property1",
			sKind: 'column',
			sTextLabelKey: undefined,
			sLabelDisplayOption: undefined
		}];
		this.stubbedPropertyOrchestration.getPropertyInformationList =  function(){
			return propertyInformationList;
		};
		var spyFireEvent = sinon.spy(oRepPropertyView, "fireEvent");
		var spyFireEventOnFocusOfAdd = sinon.spy(oRepPropertyView.byId("idAddPropertyIcon"), "fireEvent");
		oRepPropertyView.getViewData().oPropertyTypeState.getViewAt = function() {
			return oRepPropertyView;
		};
		var returnValueForGetItems = [
			{"mProperties": {
					"key": "property1",
					"name": "property1"
				}},
			{"mProperties": {
					"key": "property2",
					"name": "property2"
				}},
			{"mProperties": {
					"key": "property3",
					"name": "property3"
				}}
		];
		this.stubGetItems = sinon.stub(oRepPropertyView.getController().byId("idPropertyType"), "getItems", function () {
			return returnValueForGetItems;
		});
		//action
		oRepPropertyView.byId("idAddPropertyIcon").firePress();
		_placeViewAt(oRepPropertyView);
		oRepPropertyView.getController().setNextPropertyInParentObject();
		//assert
		_commonTestForSetDetailData(assert, "property1");
		assert.strictEqual(oRepPropertyView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as property1");
		assert.deepEqual(oRepPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.ADDPROPERTY), true, "then ADDPROPERTY event is fired");
		assert.strictEqual(spyFireEventOnFocusOfAdd.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.SETFOCUSONADDICON), true, "then SETFOCUSONADDICON event is fired");
		assert.strictEqual(spyOnAddProperty.calledOnce, true, "then property is added");
		assert.strictEqual(spyOnAddProperty.getCall(0).args[0], "property1", "then new property property1 is added");
		assert.strictEqual(spyOnSetPropertyKind.calledOnce, true, "then kind for property is set");
		assert.strictEqual(spyOnSetPropertyKind.getCall(0).args[0], "property1", "then kind for property is set as column");
		assert.strictEqual(spyOnSetPropertyKind.getCall(0).args[1], "column", "then kind for property is set as column");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When add icon of property is pressed", function(assert) {
		//arrange
		var propertyInformationList = [{
			sProperty: "property1",
			sKind: 'column',
			sTextLabelKey: undefined,
			sLabelDisplayOption: undefined
		},{
			sProperty: "property2",
			sKind: 'column',
			sTextLabelKey: undefined,
			sLabelDisplayOption: undefined
		}];
		this.stubbedPropertyOrchestration.getPropertyInformationList =  function(){
			return propertyInformationList;
		};
		var spyFireEvent = sinon.spy(oRepPropertyView, "fireEvent");
		var spyFireEventOnFocusOfAdd = sinon.spy(oRepPropertyView.byId("idAddPropertyIcon"), "fireEvent");
		oRepPropertyView.getViewData().oPropertyTypeState.getViewAt = function() {
			return oRepPropertyView;
		};
		oRepPropertyView.getViewData().oPropertyTypeState.getPropertyValueState = function() {
			return [ "property1", "property2" ];
		};
		var returnValueForGetItems = [
			{"mProperties": {
				"key": "property1",
				"name": "property1"
			}},
			{"mProperties": {
				"key": "property2",
				"name": "property2"
			}},
			{"mProperties": {
				"key": "property3",
				"name": "property3"
			}}
		];
		this.stubGetItems = sinon.stub(oRepPropertyView.getController().byId("idPropertyType"), "getItems", function () {
			return returnValueForGetItems;
		});
		//action
		oRepPropertyView.byId("idAddPropertyIcon").firePress();
		_placeViewAt(oRepPropertyView);
		oRepPropertyView.getController().setNextPropertyInParentObject();
		//assert
		_commonTestForSetDetailData(assert, "property1");
		assert.strictEqual(oRepPropertyView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as property1");
		assert.deepEqual(oRepPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.ADDPROPERTY), true, "then ADDPROPERTY event is fired");
		assert.strictEqual(spyFireEventOnFocusOfAdd.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.SETFOCUSONADDICON), true, "then SETFOCUSONADDICON event is fired");
		assert.strictEqual(spyOnAddProperty.callCount, 2, "then add property is called twice");
		assert.strictEqual(spyOnAddProperty.getCall(0).args[0], "property1", "then new property property1 is added");
		assert.strictEqual(spyOnAddProperty.getCall(1).args[0], "property2", "then new property property1 is added");
		assert.strictEqual(spyOnSetPropertyKind.callCount, 2, "then kind for property is called twice");
		assert.strictEqual(spyOnSetPropertyKind.getCall(0).args[0], "property1", "then kind for property is set as column");
		assert.strictEqual(spyOnSetPropertyKind.getCall(0).args[1], "column", "then kind for property is set as column");
		assert.strictEqual(spyOnSetPropertyKind.getCall(1).args[0], "property2", "then kind for property is set as column");
		assert.strictEqual(spyOnSetPropertyKind.getCall(1).args[1], "column", "then kind for property is set as column");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
	});
	QUnit.test("When add icon of property is pressed (handlePressOfAddPropertyIcon is called) and oPropertyOrchestration exists", function (assert) {
		//arrange
		var oPropertyOrchestrationReference = {};
		oRepPropertyView.getViewData().oPropertyOrchestration = oPropertyOrchestrationReference;
		var expectedCallParameters = [
			this.twoPropertiesAndNone,
			this.propertyOne,
			this.noneValue,
			oPropertyOrchestrationReference // propertyTypeOrchestration, @see _shallAddPropertyBeHandled() in propertyType.js
		];
		expectedCallParameters.forEach(function (value) {
			assert.notStrictEqual(value, undefined, "Then expected parameter is not undefined");
		});
		this.stub_shallAddPropertyBeHandled = sinon.stub(oRepPropertyView.getController(), "_shallAddPropertyBeHandled"); // "stub" instead of "spy" is needed for subsequent tests
		this.stubGetSelectedKey = sinon.stub(oRepPropertyView.getController().byId("idPropertyType"), "getSelectedKey", function () {
			return expectedCallParameters[1];
		});
		this.stubGetItems = sinon.stub(oRepPropertyView.getController().byId("idPropertyType"), "getItems", function () {
			return this.twoPropertiesAndNone;
		}.bind(this));
		//act
		oRepPropertyView.byId("idAddPropertyIcon").firePress(); // system under test
		//verify
		assert.strictEqual(this.stub_shallAddPropertyBeHandled.callCount, 1, "Then _shallAddPropertyBeHandled is called once");
		assert.deepEqual(this.stub_shallAddPropertyBeHandled.getCall(0).args, expectedCallParameters, "Then _shallAddPropertyBeHandled is called with the expected parameters");
		assert.strictEqual(this.stub_shallAddPropertyBeHandled.getCall(0).args[4], expectedCallParameters[4], "Then _shallAddPropertyBeHandled is called with the expected oPropertyOrchestrationReference");
	});
	QUnit.test("When _shallAddPropertyBeHandled returns true", function (assert) {
		// arrange
		var spyFireEvent = sinon.spy(oRepPropertyView, "fireEvent");
		this.stub_shallAddPropertyBeHandled = sinon.stub(oRepPropertyView.getController(), "_shallAddPropertyBeHandled", function () {
			return true;
		});
		// act
		oRepPropertyView.byId("idAddPropertyIcon").firePress(); // system under test
		// verify
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.ADDPROPERTY), true, "then ADDPROPERTY event is fired for further processing the pressing of add property icon");
	});
	QUnit.test("When _shallAddPropertyBeHandled returns false", function (assert) {
		// arrange
		var spyFireEvent = sinon.spy(oRepPropertyView, "fireEvent");
		this.stub_shallAddPropertyBeHandled = sinon.stub(oRepPropertyView.getController(), "_shallAddPropertyBeHandled", function () {
			return false;
		});
		// act
		oRepPropertyView.byId("idAddPropertyIcon").firePress(); // system under test
		// verify
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.ADDPROPERTY), false, "then ADDPROPERTY event is not fired and the pressing of add property icon is not processed");
	});

	function assertInductionAnchor(assert, _shallAddPropertyBeHandled, itemsFromSelectControl, selectedKeyInSelectControl, noneValueFromTextReader, expectedMethodReturnValue){
		assert.strictEqual(_shallAddPropertyBeHandled(itemsFromSelectControl, selectedKeyInSelectControl, noneValueFromTextReader), expectedMethodReturnValue, "Then " + JSON.stringify(itemsFromSelectControl) + ", " + selectedKeyInSelectControl + " -> " + expectedMethodReturnValue);
	}
	QUnit.test("When _shallAddPropertyBeHandled is called for non-MEASURE", function (assert) {
		// arrange
		var listInductionAnchor = [
				[[], undefined, false],
				[[this.noneProperty], this.noneValue, false],
				[[this.noneProperty, this.propertyHugo], this.noneValue, false],
				[[this.noneProperty, this.propertyHugo], this.propertyOne, false],
				[[this.noneProperty, this.propertyHugo, this.propertyOtto], this.propertyOne, true], // at least one property that is neither selected nor "None" -> true
				[[this.noneProperty, this.propertyHugo, this.propertyOtto], this.noneValue, true], // at least one property that is neither selected nor "None" -> true
				[[this.propertyHugo], this.propertyOne, false],
				[[this.noneProperty, this.propertyHugo, this.propertyHugo], this.propertyOne, false],
				[[this.noneProperty, this.propertyHugo, this.propertyHugo, this.propertyOtto], this.propertyOne, true]
		];
		listInductionAnchor.forEach(function (line) {
			assertInductionAnchor(assert, oRepPropertyView.getController()._shallAddPropertyBeHandled, line[0], line[1], this.noneValue, line[2]);
		}.bind(this));
	});

	QUnit.test("When _shallAddPropertyBeHandled is called in case of aggregationRole = MEASURE", function(assert) {
		// arrange
		var that = this;
		assert.expect(11); // two more asserts in QUnit.module()
		var propertyTypeOrchestration = function() {
			var self = this;
			this.stubbedRowLength = 0;
			this._getPropertyTypeRows = function() {
				return {
					length: self.stubbedRowLength
				};
			};
			this.getAggregationRole = function() {
				return sap.apf.modeler.ui.utils.CONSTANTS.aggregationRoles.MEASURE;
			}
		};
		var orchestrationObject = new propertyTypeOrchestration();
		var testCases = [
			{
				itemsFromSelectControl : [],
				numberOfSelectControls: 1, // any
				expectedResult: false
			}, {
				itemsFromSelectControl : [this.propertyHugo],
				numberOfSelectControls: 0,
				expectedResult: true
			}, {
				itemsFromSelectControl : [this.noneProperty],
				numberOfSelectControls: 1,
				expectedResult: false
			}, {
				itemsFromSelectControl : [this.propertyHugo],
				numberOfSelectControls: 1,
				expectedResult: false
			}, {
				itemsFromSelectControl : [this.noneProperty, this.propertyHugo],
				numberOfSelectControls: 1,
				expectedResult: false
			}, {
				itemsFromSelectControl : [this.noneProperty, this.propertyHugo, this.propertyOtto],
				numberOfSelectControls: 1,
				expectedResult: true
			}, {
				itemsFromSelectControl : [this.noneProperty, this.propertyHugo, this.propertyOtto],
				numberOfSelectControls: 2,
				expectedResult: false
			}, {
				itemsFromSelectControl : [this.propertyHugo, this.propertyOtto],
				numberOfSelectControls: 1,
				expectedResult: true
			}, {
				itemsFromSelectControl : [this.propertyHugo, this.propertyOtto],
				numberOfSelectControls: 2,
				expectedResult: false
			}
		];
		testCases.forEach(function(testCase) {
			// arrange
			orchestrationObject.stubbedRowLength = testCase.numberOfSelectControls;
			// act
			var result = oRepPropertyView.getController()._shallAddPropertyBeHandled(testCase.itemsFromSelectControl, undefined, that.noneValue, orchestrationObject);
			// verify
			assert.strictEqual(result, testCase.expectedResult, "Then " + JSON.stringify(testCase.itemsFromSelectControl) + ", No. of select controls: " + testCase.numberOfSelectControls + " -> " + testCase.expectedResult);
		});
	});
	QUnit.test("When removing property which present exactly once", function(assert) {
		//action
		oRepPropertyView.getController().removePropertyFromParentObject();
		//assert
		assert.strictEqual(spyOnRemoveProperty.calledOnce, true, "then property is removed");
		assert.strictEqual(spyOnRemoveProperty.calledWith("property1"), true, "then property 'property1' is removed");
	});
	QUnit.module("Reduced Value help for property propertytype", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property2", "property3" ],
						consumable : [ "property1", "property2", "property3" ]
					});
					return deferred.promise();
				});
				oRepPropertyView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[2], assert, oModelerInstance.unsavedStepWithoutFilterMapping, undefined, that);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When no properties are used", function(assert) {
		_commonTestForSetDetailData(assert, "property1");
		assert.strictEqual(oRepPropertyView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as property2");
		assert.deepEqual(oRepPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.module("Reduced Value help for property propertytype", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property2", "property3" ],
						consumable : []
					});
					return deferred.promise();
				});
				oRepPropertyView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[2], assert, oModelerInstance.unsavedStepWithoutFilterMapping, undefined, that);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When all properties are already used", function(assert) {
		_commonTestForSetDetailData(assert, "property1");
		assert.strictEqual(oRepPropertyView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as property2");
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			} ]
		};
		assert.deepEqual(oRepPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.module("Reduced Value help for property property type", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property2", "property3" ],
						consumable : [ "property2", "property3" ]
					});
					return deferred.promise();
				});
				oRepPropertyView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[2], assert, oModelerInstance.unsavedStepWithoutFilterMapping, undefined, that);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When already selected property is not available in metadata", function(assert) {
		//assume property1 is not available in metadata
		_commonTestForSetDetailData(assert, "property1");
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "property2",
				"name" : "property2"
			}, {
				"key" : "property3",
				"name" : "property3"
			}, {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			} ]
		};
		assert.strictEqual(oRepPropertyView.byId("idPropertyType").getSelectedKey(), "Not Available: property1", "then value for property type is set as NotAvailable:property2");
		assert.deepEqual(oRepPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.test("When already selected property is removed as a select property from step level", function(assert) {
		//assume property1 is removed as select property from step level
		_commonTestForSetDetailData(assert, "property1");
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "property2",
				"name" : "property2"
			}, {
				"key" : "property3",
				"name" : "property3"
			}, {
				"key" : "Not Available: property1",
				"name" : "Not Available: property1"
			} ]
		};
		assert.strictEqual(oRepPropertyView.byId("idPropertyType").getSelectedKey(), "Not Available: property1", "then value for property type is set as NotAvailable:property2");
		assert.deepEqual(oRepPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.module("Treetable representation with property type property", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(true);
				sinon.stub(oModelerInstance.firstHierarchicalStep, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "nonHierarchicalproperty1", "nonHierarchicalproperty2" ],
						consumable : [ "nonHierarchicalproperty1", "nonHierarchicalproperty2" ]
					});
					return deferred.promise();
				});
				oRepPropertyView = _instantiateView(oModelerInstance.firstHierarchicalStep.getRepresentations()[0], assert, oModelerInstance.firstHierarchicalStep, true, that);
				that.stubbedPropertyOrchestration = {
					getPropertyInformationList: function(){
						return [];
					},
					isSwapCase: function(){
						return false;
					},
					getPropertyTypeRow: function(){
						return {
							propertyRowInformation: {
								sProperty: "property2"
							}
						}
					},
					getPropertyTypeRowByPropertyName: function(){
						return {
							propertyRowInformation: {
								sProperty: "property2"
							}
						}
					},
					updateAllSelectControlsForPropertyType: function() {
						return new Promise(function(resolve){
							resolve();
						});
					},
					getAggregationRole: function(){
						return null; // @see _mapPropertyType2AggregationRole()
					},
					_getPropertyTypeRows: function(){
						return [{
							propertyRowInformation: {
								sProperty: "property2"
							}
						}];
					}
				};
				oRepPropertyView.getViewData().oPropertyOrchestration = that.stubbedPropertyOrchestration;
				done();
			});
		},
		afterEach : function() {
			oModelerInstance.firstHierarchicalStep.getConsumablePropertiesForRepresentation.restore();
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When hierarchy Property view is initialized", function(assert) {
		assert.strictEqual(oRepPropertyView.byId("idPropertyType").getSelectedKey(), "None", "then none is selected by default");
		assert.deepEqual(oRepPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyTypeHierarchicalStep, "then model for property type is set");
	});
	QUnit.test("When add icon of property is pressed for hierarchical step", function(assert) {
		//arrange
		var propertyInformationList = [{
			sProperty: "nonHierarchicalproperty1",
			sKind: 'column',
			sTextLabelKey: undefined,
			sLabelDisplayOption: undefined
		},{
			sProperty: "nonHierarchicalproperty2",
			sKind: 'column',
			sTextLabelKey: undefined,
			sLabelDisplayOption: undefined
		}];
		this.stubbedPropertyOrchestration.getPropertyInformationList =  function(){
			return propertyInformationList;
		};
		var spyFireEvent = sinon.spy(oRepPropertyView, "fireEvent");
		var spyFireEventOnFocusOfAdd = sinon.spy(oRepPropertyView.byId("idAddPropertyIcon"), "fireEvent");
		oRepPropertyView.getViewData().oPropertyTypeState.getViewAt = function() {
			return oRepPropertyView;
		};
		//action
		oRepPropertyView.byId("idAddPropertyIcon").firePress();
		_placeViewAt(oRepPropertyView);
		oRepPropertyView.getController().setNextPropertyInParentObject();
		//assert
		assert.strictEqual(oRepPropertyView.byId("idPropertyType").getSelectedKey(), "None", "then value for property type is set as None");
		assert.deepEqual(oRepPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyTypeHierarchicalStep, "then model for property type is set");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.ADDPROPERTY), true, "then ADDPROPERTY event is fired");
		assert.strictEqual(spyFireEventOnFocusOfAdd.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.SETFOCUSONADDICON), true, "then SETFOCUSONADDICON event is fired");
		assert.strictEqual(spyOnAddProperty.callCount, 2, "then property is added");
		assert.strictEqual(spyOnAddProperty.getCall(0).args[0], "nonHierarchicalproperty1", "then new property nonHierarchicalproperty1 is added");
		assert.strictEqual(spyOnAddProperty.getCall(1).args[0], "nonHierarchicalproperty2", "then new property nonHierarchicalproperty2 is added");
		assert.strictEqual(spyOnSetPropertyKind.callCount, 2, "then kind for property is set");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
	});
	function browserTestsCommonSetup(assert, context, browserName, browserVersion){
		var done = assert.async();
		if (browserVersion){
			sap.ui.Device.browser.version = browserVersion;
		}
		if (browserName === "ie"){
			sap.ui.Device.browser.msie = true;
		} else {
			sap.ui.Device.browser.msie = false;
		}
		sap.ui.Device.browser.name = browserName;
		oRepPropertyView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[2], assert, oModelerInstance.unsavedStepWithoutFilterMapping, undefined, context);
		oRepPropertyView.loaded().then(function(){
			assert.strictEqual(oRepPropertyView.byId("idPropertyTypeForm").getAriaLabelledBy()[0], oRepPropertyView.byId("idAriaPropertyForBasicDataGroup").getId(), "then property type form is labeled correctly");
			done();
		});
		return oRepPropertyView;
	}
	QUnit.module("Browser specific functionality", {
		beforeEach : function(assert){
			var done = assert.async();
			this.oBrowserSettings = jQuery.extend(true, {}, sap.ui.Device.browser);
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property2", "property3" ],
						consumable : [ "property1", "property2", "property3" ]
					});
					return deferred.promise();
				});
				done();
			});
		},
		afterEach : function(){
			sap.ui.Device.browser = this.oBrowserSettings;
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When Property view is initialized on Internet Explorer 11", function(assert) {
		oRepPropertyView = browserTestsCommonSetup(assert, this, "ie", 11);
		assert.strictEqual(oRepPropertyView.byId("idAriaPropertyForBasicDataGroup").getText(), "Basic Data", "then text for aria label is set correctly");
	});
	QUnit.test("When Property view is initialized on Internet Explorer version below 11 (IE10)", function(assert) {
		oRepPropertyView = browserTestsCommonSetup(assert, this, "ie", 10);
		assert.strictEqual(oRepPropertyView.byId("idAriaPropertyForBasicDataGroup").getText(), "", "then text for aria label is not set");
	});
	QUnit.test("When Property view is initialized on Internet Explorer version below 11 (IE10.1)", function(assert) {
		oRepPropertyView = browserTestsCommonSetup(assert, this, "ie", 10.1);
		assert.strictEqual(oRepPropertyView.byId("idAriaPropertyForBasicDataGroup").getText(), "", "then text for aria label is not set");
	});
	QUnit.test("When Property view is initialized on Google Chrome", function(assert) {
		oRepPropertyView = browserTestsCommonSetup(assert, this, "cr");
		assert.strictEqual(oRepPropertyView.byId("idAriaPropertyForBasicDataGroup").getText(), "", "then text for aria label is not set");
	});
	QUnit.test("When Property view is initialized on Mozilla Firefox", function(assert) {
		oRepPropertyView = browserTestsCommonSetup(assert, this, "ff");
		assert.strictEqual(oRepPropertyView.byId("idAriaPropertyForBasicDataGroup").getText(), "", "then text for aria label is not set");
	});
	QUnit.test("When Property view is initialized on Edge Browser", function(assert) {
		oRepPropertyView = browserTestsCommonSetup(assert, this, "ed");
		assert.strictEqual(oRepPropertyView.byId("idAriaPropertyForBasicDataGroup").getText(), "", "then text for aria label is not set");
	});
	QUnit.test("When Property view is initialized on Safari", function(assert) {
		oRepPropertyView = browserTestsCommonSetup(assert, this, "sf");
		assert.strictEqual(oRepPropertyView.byId("idAriaPropertyForBasicDataGroup").getText(), "", "then text for aria label is not set");
	});
	QUnit.test("When Property view is initialized on Android Browser", function(assert) {
		oRepPropertyView = browserTestsCommonSetup(assert, this, "an");
		assert.strictEqual(oRepPropertyView.byId("idAriaPropertyForBasicDataGroup").getText(), "", "then text for aria label is not set");
	});
}());