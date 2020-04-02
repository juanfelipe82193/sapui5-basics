/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tRepresentationLegend');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require('sap.apf.utils.utils');
(function() {
	'use strict';
	var oRepLegendView, oModelerInstance, spyOnGetText, spyOnGetLabelDisplayOption, spyOnGetDimensionTextLabelKey, spyOnGetRepresentationType, spyOnConfigEditorSetIsUnsaved, spyOnSetLabelDisplayOption, spyOnSetDimensionTextLabelKey, spyOnSetText, spyOnAddDimension, spyOnRemoveDimension, spyOnSetDimensionKind, oModelForPropertyType;
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
	function _placeViewAt(oRepLegendView) {
		var divToPlaceRepLegend = document.createElement("div");
		divToPlaceRepLegend.setAttribute('id', 'contentOfFF');
		document.body.appendChild(divToPlaceRepLegend);
		oRepLegendView.placeAt("contentOfFF");
		sap.ui.getCore().applyChanges();
	}
	function _commonSpiesInBeforeEach() {
		spyOnGetLabelDisplayOption = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "getLabelDisplayOption");
		spyOnGetDimensionTextLabelKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "getDimensionTextLabelKey");
		spyOnGetRepresentationType = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "getRepresentationType");
		spyOnSetLabelDisplayOption = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "setLabelDisplayOption");
		spyOnSetDimensionTextLabelKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "setDimensionTextLabelKey");
		spyOnSetDimensionKind = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "setDimensionKind");
		spyOnAddDimension = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "addDimension");
		spyOnRemoveDimension = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "removeDimension");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
		spyOnSetText = sinon.spy(oModelerInstance.configurationHandler.getTextPool(), "setTextAsPromise");
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
	}
	function _instantiateView(sId, assert, sProperty, oStep) {
		new sap.ui.controller("sap.apf.modeler.ui.controller.representationDimension");
		var oLegendsController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationLegend");
		var spyOnInit = sinon.spy(oLegendsController, "onInit");
		var oStepPropertyMetadataTypeHandlerStub = {
			getDimensionsProperties : function() {
				return [ "property1", "property2", "property3" ];
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
			getPropertyMetadata : function(entityTypeMetadata, sPropertyName) {
				assert.equal(entityTypeMetadata.type, "myEntityTypeMetadataStub", "Correct parameter hand over");
				return {
					"aggregation-role" : "dimension",
					"dataType" : {
						"maxLength" : "10",
						"type" : "Edm.String"
					},
					"label" : "Dimension" + sPropertyName,
					"name" : "Dimension",
					"text" : sPropertyName + "Text"
				};
			},
			getEntityTypeMetadataAsPromise : function() {
				return sap.apf.utils.createPromise({
					type : "myEntityTypeMetadataStub"
				});
			}
		};
		var oRepresentationTypeHandlerStub = {
			getLabelsForChartType : function() {
				return "Dimension for Legend / Display";
			},
			isAdditionToBeEnabled : function() {
				return true;
			}
		};
		var oRepresentationHandlerStub = {
			getActualLegends : function() {
				return [ {
					sContext : "legend",
					sProperty : "property2"
				} ];
			}
		};
		var oPropertyTypeStateStub = {
			getPropertyValueState : function() {
				return [ sProperty ];
			},
			indexOfPropertyTypeViewId : function() {
				return 0;
			}
		};
		oRepLegendView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.propertyType",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oLegendsController,
			viewData : {
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oParentObject : sId,
				oStepPropertyMetadataHandler : oStepPropertyMetadataTypeHandlerStub,
				oRepresentationTypeHandler : oRepresentationTypeHandlerStub,
				oCoreApi : oModelerInstance.modelerCore,
				oRepresentationHandler : oRepresentationHandlerStub,
				oPropertyTypeState : oPropertyTypeStateStub,
				oPropertyTypeData : {
					sProperty : "property1",
					sContext : "legend"
				},
				sPropertyType : sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes.LEGEND
			}
		});
		oRepLegendView.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		assert.strictEqual(spyOnInit.calledOnce, true, "then proprty type onInit function is called and view is initialized");
		return oRepLegendView;
	}
	function _commonTestForSetDetailData(assert, sProperty, sDisplayOptionType) {
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
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
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
		assert.ok(oRepLegendView, "then property view is available");
		// asserts for label display option
		assert.strictEqual(oRepLegendView.byId("idLabelDisplayOptionType").getSelectedKey(), sDisplayOptionType, "then label display option for legend is selected as" + sDisplayOptionType);
		assert.deepEqual(oRepLegendView.byId("idLabelDisplayOptionType").getModel().getData(), oModelForDisplayOptionType, "then label display options model is set");
		assert.strictEqual(spyOnGetLabelDisplayOption.calledWith(sProperty), true, "then label for display option type is set as " + sProperty);
		//asserts for property label
		assert.strictEqual(spyOnGetDimensionTextLabelKey.called, true, "then legend text label is available");
		assert.ok(oRepLegendView.byId("idPropertyLabel").getText(), "then default label is set");
		assert.strictEqual(oRepLegendView.byId("idPropertyLabelText").getValue(), sProperty, "then value for property label text input box is set as " + sProperty);
		assert.strictEqual(spyOnGetRepresentationType.called, true, "then representation type is found");
		//asserts for invisible text
		assert.strictEqual(spyOnGetText.calledWith("ariaTextForAddIcon"), true, "then invisible text for add icon is set");
		assert.strictEqual(spyOnGetText.calledWith("ariaTextForDeleteIcon"), true, "then invisible text for remove icon is set");
		//asserts for labels
		assert.strictEqual(spyOnGetText.calledWith("label"), true, "then label is set");
		assert.strictEqual(spyOnGetText.calledWith("default"), true, "then default label is set");
		assert.ok(oRepLegendView.byId("idPropertyTypeLabel").getText(), "then property type label is populated");
		// asserts for add/remove
		assert.strictEqual(spyOnGetText.calledWith("addButton"), true, "then tooltip for add icon is set");
		assert.strictEqual(spyOnGetText.calledWith("deleteButton"), true, "then tooltip for remove icon is set");
		assert.ok(oRepLegendView.byId("idAddPropertyIcon"), "then add icon to add legend is available");
		assert.strictEqual(oRepLegendView.byId("idAddPropertyIcon").getVisible(), true, "then add icon to add legnd is visible");
		assert.ok(oRepLegendView.byId("idRemovePropertyIcon"), "then remove icon to remove legend is available");
	}
	function _commonCleanUpsInAfterEach() {
		oRepLegendView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oRepLegendView.getViewData().oCoreApi.getText.restore();
		oRepLegendView.getViewData().oConfigurationHandler.getTextPool().setTextAsPromise.restore();
		oModelerInstance.reset();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oRepLegendView.destroy();
	}
	QUnit.module("For a Representation with property type of Legend with property type as none", {
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
				oRepLegendView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, "None", oModelerInstance.unsavedStepWithoutFilterMapping);
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
				oRepLegendView.getViewData().oPropertyOrchestration = that.stubbedPropertyOrchestration;
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When Property view is initialized", function(assert) {
		_commonTestForSetDetailData(assert, "None", "key");
		assert.strictEqual(oRepLegendView.byId("idPropertyType").getSelectedKey(), "None", "then value for property type is set as None");
		assert.deepEqual(oRepLegendView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepLegendView.byId("idLabelDisplayOptionType").getEnabled(), false, "display option type label is not enabled");
		assert.strictEqual(oRepLegendView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove legend is not visible");
	});
	QUnit.test("When legend property type is changed", function(assert) {
		var done = assert.async();
		//arrange
		var propertyInformationList = [{
			sProperty: "property2",
			sKind: 'legend',
			sTextLabelKey: undefined,
			sLabelDisplayOption: "key"
		}];
		this.stubbedPropertyOrchestration.getPropertyInformationList =  function(){
			return propertyInformationList;
		};
		oRepLegendView.getViewData().oPropertyTypeState.getPropertyValueState = function() {
			return [ "property2" ];
		};
		var spy_getPropertyInformationList = sinon.spy(this.stubbedPropertyOrchestration, "getPropertyInformationList");
		var spy_updatePropertiesInConfiguration = sinon.spy(oRepLegendView.getController(), "updatePropertiesInConfiguration");
		// ACT
		oRepLegendView.byId("idPropertyType").setSelectedKey("property2");
		oRepLegendView.getController().handleChangeForPropertyTypeAsPromise().then(function(){
			// THEN
			_commonTestForSetDetailData(assert, "property2", "key");
			assert.strictEqual(oRepLegendView.byId("idPropertyType").getSelectedKey(), "property2", "then value for property type is set as property2");
			assert.deepEqual(oRepLegendView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
			assert.strictEqual(oRepLegendView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove legend is not visible");
			assert.strictEqual(oRepLegendView.byId("idLabelDisplayOptionType").getEnabled(), true, "display option type label is enabled");
			assert.strictEqual(spy_getPropertyInformationList.callCount, 1, "then getPropertyInformationList is called");
			assert.strictEqual(spy_updatePropertiesInConfiguration.callCount, 1, "then updatePropertiesInConfiguration is called");
			assert.strictEqual(spy_updatePropertiesInConfiguration.getCall(0).args[0], propertyInformationList, "then updatePropertiesInConfiguration is called with the expected parameters");
			assert.strictEqual(spyOnAddDimension.callCount, 1, "then add dimension is called for property2");
			assert.strictEqual(spyOnAddDimension.getCall(0).args[0], "property2", "then add dimension is called with property2");
			assert.strictEqual(spyOnSetDimensionKind.callCount, 1, "then SetDimensionKind is called for property2");
			assert.strictEqual(spyOnSetDimensionKind.calledWith("property2", "legend"), true, "then SetDimensionKind is called with correct parameter");
			assert.strictEqual(spyOnSetLabelDisplayOption.callCount, 1, "then SetLabelDisplayOption is called for property2");
			assert.strictEqual(spyOnSetLabelDisplayOption.calledWith("property2", "key"), true, "then SetLabelDisplayOption is called with correct parameter");
			assert.strictEqual(spyOnSetDimensionTextLabelKey.callCount, 1, "then SetDimensionTextLabelKey is called for property2");
			assert.strictEqual(spyOnSetDimensionTextLabelKey.calledWith("property2", undefined), true, "then SetDimensionTextLabelKey is called with correct parametr");
			assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
			spy_getPropertyInformationList.restore();
			spy_updatePropertiesInConfiguration.restore();
			done();
		});
	});
	QUnit.test("When legend property type is changed to none", function(assert) {
		var done = assert.async();
		//arrange
		var propertyInformationList = [];
		this.stubbedPropertyOrchestration.getPropertyInformationList =  function(){
			return propertyInformationList;
		};
		oRepLegendView.getViewData().oPropertyTypeState.getPropertyValueState = function() {
			return [ "None" ];
		};
		var spy_getPropertyInformationList = sinon.spy(this.stubbedPropertyOrchestration, "getPropertyInformationList");
		var spy_updatePropertiesInConfiguration = sinon.spy(oRepLegendView.getController(), "updatePropertiesInConfiguration");

		// ACT
		oRepLegendView.byId("idPropertyType").setSelectedKey("None");
		oRepLegendView.getController().handleChangeForPropertyTypeAsPromise().then(function(){
			// THEN
			_commonTestForSetDetailData(assert, "None", "key");
			assert.strictEqual(oRepLegendView.byId("idPropertyType").getSelectedKey(), "None", "then value for property type is set as None");
			assert.deepEqual(oRepLegendView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
			assert.strictEqual(oRepLegendView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove legend is not visible");
			assert.strictEqual(oRepLegendView.byId("idLabelDisplayOptionType").getEnabled(), false, "display option type label is disabled");
			assert.strictEqual(spy_getPropertyInformationList.callCount, 1, "then getPropertyInformationList is called");
			assert.strictEqual(spy_updatePropertiesInConfiguration.callCount, 1, "then updatePropertiesInConfiguration is called");
			assert.strictEqual(spy_updatePropertiesInConfiguration.getCall(0).args[0], propertyInformationList, "then updatePropertiesInConfiguration is called with the expected parameters");
			assert.strictEqual(spyOnAddDimension.called, false, "then add dimension is not called for none option");
			assert.strictEqual(spyOnSetLabelDisplayOption.callCount, 0, "then SetLabelDisplayOption not is called for property2");
			assert.strictEqual(spyOnSetDimensionTextLabelKey.callCount, 0, "then SetDimensionTextLabelKey is not called for property2");
			assert.strictEqual(spyOnSetDimensionKind.callCount, 0, "then SetDimensionKind is not called for property2");
			assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
			spy_getPropertyInformationList.restore();
			spy_updatePropertiesInConfiguration.restore();
			done();
		});
	});
	QUnit.test("When add icon of legend is pressed", function(assert) {
		//arrange
		var propertyInformationList = [{
			sProperty: "property1",
			sKind: 'legend',
			sTextLabelKey: undefined,
			sLabelDisplayOption: undefined
		}];
		this.stubbedPropertyOrchestration.getPropertyInformationList =  function(){
			return propertyInformationList;
		};
		var spyFireEvent = sinon.spy(oRepLegendView, "fireEvent");
		var spyFireEventOnFocusOfAdd = sinon.spy(oRepLegendView.byId("idAddPropertyIcon"), "fireEvent");
		oRepLegendView.getViewData().oPropertyTypeState.getPropertyValueState = function() {
			return [ "property1" ];
		};
		oRepLegendView.getViewData().oPropertyTypeState.getViewAt = function() {
			return oRepLegendView;
		};
		// ACT
		oRepLegendView.byId("idAddPropertyIcon").firePress();
		_placeViewAt(oRepLegendView);
		oRepLegendView.getController().setNextPropertyInParentObject();
		//assert
		_commonTestForSetDetailData(assert, "None", "key");
		assert.strictEqual(oRepLegendView.byId("idPropertyType").getSelectedKey(), "None", "then value for property type is set as None");
		assert.deepEqual(oRepLegendView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.ADDPROPERTY), true, "then ADDPROPERTY event is fired");
		assert.strictEqual(spyFireEventOnFocusOfAdd.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.SETFOCUSONADDICON), true, "then SETFOCUSONADDICON event is fired");
		assert.strictEqual(spyOnAddDimension.callCount, 1, "then legend for new property is added");
		assert.strictEqual(spyOnAddDimension.getCall(0).args[0], "property1", "then legend for new property property1 is added");
		assert.strictEqual(spyOnSetDimensionKind.callCount, 1, "then kind for legend is set");
		assert.strictEqual(spyOnSetDimensionKind.getCall(0).args[0], "property1", "then kind for legend is set as legend");
		assert.strictEqual(spyOnSetDimensionKind.getCall(0).args[1], "legend", "then kind for legend is set as legend");
		assert.strictEqual(spyOnSetLabelDisplayOption.callCount, 1, "label display option for legend is set");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
	});
	QUnit.test("When removing property which present exactly once", function(assert) {
		//action
		oRepLegendView.getController().removePropertyFromParentObject();
		//assert
		assert.strictEqual(spyOnRemoveDimension.calledOnce, true, "then legend property is removed");
		assert.strictEqual(spyOnRemoveDimension.calledWith("None"), true, "then legend property 'property1' is removed");
	});
	QUnit.module("For a Representation with property type of Legend with defined property type", {
		beforeEach : function(assert) {
			var done = assert.async();
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
				oRepLegendView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, "property1", oModelerInstance.unsavedStepWithoutFilterMapping);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When Property view is initialized", function(assert) {
		_commonTestForSetDetailData(assert, "property1", "key");
		assert.strictEqual(oRepLegendView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as property1");
		assert.deepEqual(oRepLegendView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepLegendView.byId("idLabelDisplayOptionType").getEnabled(), true, "display option type label is enabled");
		assert.strictEqual(oRepLegendView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove legend is not visible");
	});
	QUnit.test("When Label Display Option Type is changed", function(assert) {
		//arrange
		oRepLegendView.getViewData().oPropertyTypeState.getPropertyValueState = function() {
			return [ "property1" ];
		};
		//action
		oRepLegendView.byId("idLabelDisplayOptionType").setSelectedKey("key and text");
		oRepLegendView.getController().handleChangeForLabelDisplayOptionType();
		//assert
		assert.strictEqual(oRepLegendView.byId("idLabelDisplayOptionType").getSelectedKey(), "key and text", "then label display option for legend is selected as key and text");
		assert.strictEqual(spyOnSetLabelDisplayOption.calledOnce, true, "then label display option is changed");
		assert.strictEqual(spyOnSetLabelDisplayOption.calledWith("property1", "key and text"), true, "then label display option is changed in core");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When label for legend changed from default to new label", function(assert) {
		//action
		oRepLegendView.byId("idPropertyLabelText").setValue("new label");
		oRepLegendView.getController().handleChangeForLabelText();
		//assert
		assert.strictEqual(oRepLegendView.byId("idPropertyLabelText").getValue(), "new label", "then property label text is changed to new label");
		assert.strictEqual(spyOnSetDimensionTextLabelKey.calledOnce, true, "then property label key is set in core");
		assert.strictEqual(spyOnSetDimensionTextLabelKey.calledWith("property1", "new label"), true, "then property label key is changes as new label");
		assert.strictEqual(spyOnSetText.calledOnce, true, "then api to set new label is called");
		assert.strictEqual(spyOnSetText.calledWith("new label", {
			TextElementType : "XTIT",
			MaximumLength : 80
		}), true, "then label value as new label is set");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When label for legend changed from default to null", function(assert) {
		//action
		oRepLegendView.byId("idPropertyLabelText").setValue("");
		oRepLegendView.getController().handleChangeForLabelText();
		//assert
		assert.strictEqual(oRepLegendView.byId("idPropertyLabelText").getValue(), "property1", "then property label text is still property1");
		assert.strictEqual(spyOnSetDimensionTextLabelKey.calledOnce, true, "then property label key is set in core");
		assert.strictEqual(spyOnSetDimensionTextLabelKey.calledWith("property1", undefined), true, "then property label key is not changed");
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
		oRepLegendView.getController().handleChangeForLabelText();
		oRepLegendView.getController().handleSuggestions(oEvent);
		//assert
		assert.strictEqual(spyOnManageSuggestionTexts.calledOnce, true, "then suggestions are fetched from SuggestionTextHandler");
		assert.strictEqual(spyOnManageSuggestionTexts.calledWith(oEvent, oTranslationFormat), true, "then suggestions are fetched from SuggestionTextHandler for the correct event");
		//clean ups
		spyOnManageSuggestionTexts.restore();
	});
	QUnit.module("Reduced Value help for legend property type", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[1]);
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property2", "property3" ],
						consumable : [ "property1", "property2", "property3" ]
					});
					return deferred.promise();
				});
				oRepLegendView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, "property1", oModelerInstance.unsavedStepWithoutFilterMapping);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When no properties are used as dimensions", function(assert) {
		_commonTestForSetDetailData(assert, "property1", "key");
		assert.strictEqual(oRepLegendView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as property2");
		assert.deepEqual(oRepLegendView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.module("Reduced Value help for legend property type", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[1]);
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property2", "property3" ],
						consumable : []
					});
					return deferred.promise();
				});
				oRepLegendView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, "property1", oModelerInstance.unsavedStepWithoutFilterMapping);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When all properties are already added as dimension", function(assert) {
		_commonTestForSetDetailData(assert, "property1", "key");
		assert.strictEqual(oRepLegendView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as property2");
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "property1",
				"name" : "property1"
			} ]
		};
		assert.deepEqual(oRepLegendView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.module("Reduced Value help for legend property type", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[1]);
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property2", "property3" ],
						consumable : [ "property2", "property3" ]
					});
					return deferred.promise();
				});
				oRepLegendView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, "property1", oModelerInstance.unsavedStepWithoutFilterMapping);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When already selected dimension is not available in metadata", function(assert) {
		//assume property1 is not available in metadata
		_commonTestForSetDetailData(assert, "property1", "key");
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
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
		assert.strictEqual(oRepLegendView.byId("idPropertyType").getSelectedKey(), "Not Available: property1", "then value for property type is set as NotAvailable:property2");
		assert.deepEqual(oRepLegendView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.test("When already selected dimension is removed as a select property from step level", function(assert) {
		//assume property1 is removed as select property from step level
		_commonTestForSetDetailData(assert, "property1", "key");
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
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
		assert.strictEqual(oRepLegendView.byId("idPropertyType").getSelectedKey(), "Not Available: property1", "then value for property type is set as NotAvailable:property2");
		assert.deepEqual(oRepLegendView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
}());