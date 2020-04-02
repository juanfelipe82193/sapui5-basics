/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tRepresentationDimension');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
sap.ui.define([
	"sap/apf/modeler/ui/utils/textPoolHelper",
	'sap/apf/utils/utils'
], function(textPoolHelperModule, utilsModule){
	'use strict';
	var oModelerInstance, oRepDimensionView, spyOnGetDimensionTextLabelKey, spyOnGetRepresentationType, spyOnSetLabelDisplayOption, spyOnConfigEditorSetIsUnsaved, spyOnSetDimensionTextLabelKey, spyOnAddDimension, spyOnSetDimensionKind, spyOnRemoveDimension, spyOnGetText, spyOnGetLabelDisplayOption, spyOnSetText, oModelForPropertyType;
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
	function _placeViewAt(oRepDimensionView) {
		var divToPlaceRepDimension = document.createElement("div");
		divToPlaceRepDimension.setAttribute('id', 'contentOfFF');
		document.body.appendChild(divToPlaceRepDimension);
		oRepDimensionView.placeAt("contentOfFF");
		sap.ui.getCore().applyChanges();
	}
	function _commonSpiesInBeforeEach(oRepresentation) {
		spyOnGetRepresentationType = sinon.spy(oRepresentation, "getRepresentationType");
		spyOnSetLabelDisplayOption = sinon.spy(oRepresentation, "setLabelDisplayOption");
		spyOnGetDimensionTextLabelKey = sinon.spy(oRepresentation, "getDimensionTextLabelKey");
		spyOnSetDimensionTextLabelKey = sinon.spy(oRepresentation, "setDimensionTextLabelKey");
		spyOnAddDimension = sinon.spy(oRepresentation, "addDimension");
		spyOnRemoveDimension = sinon.spy(oRepresentation, "removeDimension");
		spyOnSetDimensionKind = sinon.spy(oRepresentation, "setDimensionKind");
		spyOnGetLabelDisplayOption = sinon.spy(oRepresentation, "getLabelDisplayOption");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnSetText = sinon.spy(oModelerInstance.configurationHandler.getTextPool(), "setTextAsPromise");
	}
	function _instantiateView(sId, assert, sProperty, oStep, bMandatory, sContext) {
		var aValidatorFields = [];
		var oDimensionsController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationDimension");
		var spyOnInit = sinon.spy(oDimensionsController, "onInit");
		var oStepPropertyMetadataTypeHandlerStub = {
			getDimensionsProperties : function(entityTypeMetadata) {
				assert.equal(entityTypeMetadata.type, "myEntityTypeMetadataStub", "Correct parameter hand over");
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
				return "Dimension for Horizontal Axis / Display";
			},
			isAdditionToBeEnabled : function() {
				return true;
			}
		};
		var oRepresentationHandlerStub = {
			getActualDimensions : function() {
				return [ {
					sContext : sContext ? sContext : "xAxis",
					sProperty : sProperty,
					bMandatory : bMandatory
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
		var oViewValidatorStub = {
			addField : function(id){
				aValidatorFields.push(id);
			}
		};
		oRepDimensionView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.propertyType",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oDimensionsController,
			viewData : {
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oParentObject : sId,
				oStepPropertyMetadataHandler : oStepPropertyMetadataTypeHandlerStub,
				oRepresentationTypeHandler : oRepresentationTypeHandlerStub,
				oCoreApi : oModelerInstance.modelerCore,
				oRepresentationHandler : oRepresentationHandlerStub,
				oViewValidator : oViewValidatorStub,
				oPropertyTypeState : oPropertyTypeStateStub,
				oPropertyTypeData : {
					sProperty : sProperty,
					sContext : sContext ? sContext : "xAxis",
					bMandatory : bMandatory
				},
				sPropertyType : sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes.DIMENSION
			}
		});
		oRepDimensionView.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		assert.strictEqual(spyOnInit.callCount, 1, "then proprty type onInit function is called and view is initialized");
		return oRepDimensionView;
	}
	function _commonCleanUpsInAfterEach() {
		oRepDimensionView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oRepDimensionView.getViewData().oConfigurationHandler.getTextPool().setTextAsPromise.restore();
		spyOnGetText.restore();
		oModelerInstance.reset();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oRepDimensionView.destroy();
	}
	function _commonTestForSetDetailData(assert, sProperty, bIsTextPropertyPresent, bMandatory, sContext) {
		var sLblDisplayOptionKeyAndTextKey = bIsTextPropertyPresent ? "keyAndText" : "Not Available: keyAndText";
		var sLblDisplayOptionKeyAndTextName = bIsTextPropertyPresent ? "Key and Text" : "Not Available: Key and Text";
		var sLblDisplayOptionTextKey = bIsTextPropertyPresent ? "text" : "Not Available: text";
		var sLblDisplayOptionTextName = bIsTextPropertyPresent ? "Text" : "Not Available: Text";
		var oModelForDisplayOptionType = {
			"Objects" : [ {
				"key" : "key",
				"name" : "Key"
			}, {
				"key" : sLblDisplayOptionTextKey,
				"name" : sLblDisplayOptionTextName
			}, {
				"key" : sLblDisplayOptionKeyAndTextKey,
				"name" : sLblDisplayOptionKeyAndTextName
			} ]
		};
		if (bMandatory){
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
		} else {
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
		}
		assert.ok(oRepDimensionView, "then property view is available");
		// asserts for label display option
		assert.deepEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getModel().getData(), oModelForDisplayOptionType, "then label display options model is set");
		assert.strictEqual(spyOnGetLabelDisplayOption.calledWith(sProperty), true, "then label for display option type is set as " + sProperty);
		//asserts for property label
		assert.strictEqual(spyOnGetDimensionTextLabelKey.called, true, "then dimension text label is available");
		assert.ok(oRepDimensionView.byId("idPropertyLabel").getText(), "then default label is set");
		assert.strictEqual(oRepDimensionView.byId("idPropertyLabelText").getValue(), sProperty, "then value for property label text input box is set as " + sProperty);
		assert.strictEqual(spyOnGetRepresentationType.called, true, "then representation type is found");
		//asserts for invisible text
		assert.strictEqual(spyOnGetText.calledWith("ariaTextForAddIcon"), true, "then invisible text for add icon is set");
		assert.strictEqual(spyOnGetText.calledWith("ariaTextForDeleteIcon"), true, "then invisible text for remove icon is set");
		//asserts for labels
		assert.strictEqual(spyOnGetText.calledWith("label"), true, "then label is set");
		assert.strictEqual(spyOnGetText.calledWith("default"), true, "then default label is set");
		assert.ok(oRepDimensionView.byId("idPropertyTypeLabel").getText(), "then property type label is populated");
		// asserts for add/remove
		assert.strictEqual(spyOnGetText.calledWith("addButton"), true, "then tooltip for add icon is set");
		assert.strictEqual(spyOnGetText.calledWith("deleteButton"), true, "then tooltip for remove icon is set");
		assert.ok(oRepDimensionView.byId("idAddPropertyIcon"), "then add icon to add dimension is available");
		assert.strictEqual(oRepDimensionView.byId("idAddPropertyIcon").getVisible(), true, "then add icon to add dimension is visible");
		assert.ok(oRepDimensionView.byId("idRemovePropertyIcon"), "then remove icon to remove dimension is available");
	}
	QUnit.module("For a Representation with mandatory property type of Dimension", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0]);
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property2", "property3" ],
						consumable : [ "property1", "property2", "property3" ]
					});
					return deferred.promise();
				});
				oRepDimensionView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, "property1", oModelerInstance.unsavedStepWithoutFilterMapping, true);
				that.stubbedPropertyInfo = [{
					sProperty: "property1",
					sKind: "xAxis",
					sLabelDisplayOption: "keyAndText"
				},{
					sProperty: "property2",
					sKind: "xAxis",
					sLabelDisplayOption: "key"
				}];
				var stubbedPropertyOrchestration = {
					getPropertyInformationList: function(){
						return that.stubbedPropertyInfo;
					},
					isSwapCase: function(){
						return false;
					},
					getPropertyTypeRow: function(){
						return {
							propertyRowInformation: {
								sProperty: "hugo"
							}
						}
					},
					getPropertyTypeRowByPropertyName: function(){
						return {
							propertyRowInformation: {
								sProperty: "otto"
							}
						}
					},
					updateAllSelectControlsForPropertyType: function() {
						return new Promise(function(resolve){
							resolve();
						});
					},
					getAggregationRole: function() {
						return sap.apf.modeler.ui.utils.CONSTANTS.aggregationRoles.DIMENSION;
					},
					removePropertyTypeReference: function(){}
				};
				oRepDimensionView.getViewData().oPropertyOrchestration = stubbedPropertyOrchestration;
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When mandatory Property view is initialized", function(assert) {
		_commonTestForSetDetailData(assert, "property1", true, true);
		assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as property1");
		assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getSelectedKey(), "key", "then label display option for dimension is selected as key");
		assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getItems()[1].getEnabled(), true, "display option type label is enabled");
		assert.strictEqual(oRepDimensionView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove dimension is not visible");
	});
	QUnit.test("When mandatory dimension property type is changed", function(assert) {
		var done = assert.async();
		//arrange
		oRepDimensionView.getViewData().oPropertyTypeState.getPropertyValueState = function() {
			return [ "property2" ];
		};
		//action
		oRepDimensionView.byId("idPropertyType").setSelectedKey("property2");
		oRepDimensionView.getController().handleChangeForPropertyTypeAsPromise().then(function () {
			//asserts
			_commonTestForSetDetailData(assert, "property2", true, true);
			assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "property2", "then value for property type is set as : property2");
			assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
			assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getSelectedKey(), "key", "then label display option for dimension is selected as key");
			assert.strictEqual(oRepDimensionView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove dimension is not visible");
			assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getItems()[1].getEnabled(), false, "display option type label is disabled");
			assert.strictEqual(spyOnAddDimension.callCount, 2, "then add dimension is called for property 1 and property2");
			assert.strictEqual(spyOnAddDimension.getCall(0).args[0], "property1", "then add dimension is called with property1");
			assert.strictEqual(spyOnAddDimension.getCall(1).args[0], "property2", "then add dimension is called with property2");
			assert.strictEqual(spyOnSetDimensionKind.callCount, 2, "then SetDimensionKind is called for property1 and property2");
			assert.strictEqual(spyOnSetDimensionKind.calledWith("property2", "xAxis"), true, "then SetDimensionKind is called with correct parameter");
			assert.strictEqual(spyOnSetLabelDisplayOption.callCount, 2, "then SetLabelDisplayOption is called for property 1 and property2");
			assert.strictEqual(spyOnSetLabelDisplayOption.calledWith("property1", "keyAndText"), true, "then SetLabelDisplayOption call 1 is called with correct parameter");
			assert.strictEqual(spyOnSetLabelDisplayOption.calledWith("property2", "key"), true, "then SetLabelDisplayOption call 2 is called with correct parameter");
			assert.strictEqual(spyOnSetDimensionTextLabelKey.callCount, 2, "then SetDimensionTextLabelKey is called for property 1 and property2");
			assert.strictEqual(spyOnSetDimensionTextLabelKey.calledWith("property2", undefined), true, "then SetDimensionTextLabelKey is called with correct parameter");
			assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
			done();
		});
	});
	QUnit.test("When Label Display Option Type is changed for mandatory dimension property", function(assert) {
		//action
		oRepDimensionView.byId("idLabelDisplayOptionType").setSelectedKey("key and text");
		oRepDimensionView.getController().handleChangeForLabelDisplayOptionType();
		//assert
		assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getSelectedKey(), "key and text", "then label display option for dimension is selected as key and text");
		assert.strictEqual(spyOnSetLabelDisplayOption.callCount, 1, "then label display option is changed");
		assert.strictEqual(spyOnSetLabelDisplayOption.calledWith("property1", "key and text"), true, "then label display option is changed in core");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
	});
	QUnit.test("When label for mandatory dimension changed from default to new label", function(assert) {
		//action
		oRepDimensionView.byId("idPropertyLabelText").setValue("new label");
		oRepDimensionView.getController().handleChangeForLabelText();
		//assert
		assert.strictEqual(oRepDimensionView.byId("idPropertyLabelText").getValue(), "new label", "then property label text is changed to new label");
		assert.strictEqual(spyOnSetDimensionTextLabelKey.callCount, 1, "then property label key is set in core");
		assert.strictEqual(spyOnSetDimensionTextLabelKey.calledWith("property1", "new label"), true, "then property label key is changes as new label");
		assert.strictEqual(spyOnSetText.callCount, 1, "then api to set new label is called");
		assert.strictEqual(spyOnSetText.calledWith("new label", {
			TextElementType : "XTIT",
			MaximumLength : 80
		}), true, "then label value as new label is set");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
	});
	QUnit.test("When label for mandatory dimension changed from default to null", function(assert) {
		//action
		oRepDimensionView.byId("idPropertyLabelText").setValue("");
		oRepDimensionView.getController().handleChangeForLabelText();
		//assert
		assert.strictEqual(oRepDimensionView.byId("idPropertyLabelText").getValue(), "property1", "then property label text is still property1");
		assert.strictEqual(spyOnSetDimensionTextLabelKey.callCount, 1, "then property label key is set in core");
		assert.strictEqual(spyOnSetDimensionTextLabelKey.calledWith("property1", undefined), true, "then property label key is not changed");
		assert.strictEqual(spyOnSetText.called, false, "then api to set new label is not called");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
	});
	QUnit.test("When suggestions are triggered for mandatory property label text", function(assert) {
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
		oRepDimensionView.getController().handleChangeForLabelText();
		oRepDimensionView.getController().handleSuggestions(oEvent);
		//assert
		assert.strictEqual(spyOnManageSuggestionTexts.callCount, 1, "then suggestions are fetched from SuggestionTextHandler");
		assert.strictEqual(spyOnManageSuggestionTexts.calledWith(oEvent, oTranslationFormat), true, "then suggestions are fetched from SuggestionTextHandler for the correct event");
		//clean ups
		spyOnManageSuggestionTexts.restore();
	});
	QUnit.test("When add icon of mandatory dimension is pressed", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oRepDimensionView, "fireEvent");
		var spyFireEventOnFocusOfAdd = sinon.spy(oRepDimensionView.byId("idAddPropertyIcon"), "fireEvent");
		oRepDimensionView.getViewData().oPropertyTypeState.getViewAt = function() {
			return oRepDimensionView;
		};
		//action
		oRepDimensionView.byId("idAddPropertyIcon").firePress();
		_placeViewAt(oRepDimensionView);
		oRepDimensionView.getController().setNextPropertyInParentObject();
		//assert
		_commonTestForSetDetailData(assert, "property1", true, true);
		assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as: property1");
		assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getSelectedKey(), "key", "then label display option for dimension is selected as: " + "keyAndText");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.ADDPROPERTY), true, "then ADDPROPERTY event is fired");
		assert.strictEqual(spyFireEventOnFocusOfAdd.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.SETFOCUSONADDICON), true, "then SETFOCUSONADDICON event is fired");
		assert.strictEqual(spyOnAddDimension.callCount, 2, "then dimension for new property is added");
		assert.strictEqual(spyOnAddDimension.getCall(0).args[0], "property1", "then dimension for new property property1 is added");
		assert.strictEqual(spyOnSetDimensionKind.callCount, 2, "then kind for dimension is set");
		assert.strictEqual(spyOnSetDimensionKind.calledWith("property1", "xAxis"), true, "then kind for dimension is set as xAxis");
		assert.strictEqual(spyOnSetLabelDisplayOption.callCount, 2, "label display option for dimension is set");
		assert.strictEqual(spyOnSetLabelDisplayOption.getCall(0).args[0], this.stubbedPropertyInfo[0].sProperty, "label display option for dimension is set as in stubbedPropertyInfo[0]");
		assert.strictEqual(spyOnSetLabelDisplayOption.getCall(0).args[1], this.stubbedPropertyInfo[0].sLabelDisplayOption, "label display option for dimension is set as in stubbedPropertyInfo[0]");
		assert.strictEqual(spyOnSetLabelDisplayOption.getCall(1).args[0], this.stubbedPropertyInfo[1].sProperty, "label display option for dimension is set as in stubbedPropertyInfo[1]");
		assert.strictEqual(spyOnSetLabelDisplayOption.getCall(1).args[1], this.stubbedPropertyInfo[1].sLabelDisplayOption, "label display option for dimension is set as in stubbedPropertyInfo[1]");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
	});
	QUnit.test("When add icon of mandatory dimension is pressed - when already one dimension exists", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oRepDimensionView, "fireEvent");
		var spyFireEventOnFocusOfAdd = sinon.spy(oRepDimensionView.byId("idAddPropertyIcon"), "fireEvent");
		oRepDimensionView.getViewData().oPropertyTypeState.getViewAt = function() {
			return oRepDimensionView;
		};
		oRepDimensionView.getViewData().oPropertyTypeState.getPropertyValueState = function() {
			return [ "property1", "property2" ];
		};
		//action
		oRepDimensionView.byId("idAddPropertyIcon").firePress();
		_placeViewAt(oRepDimensionView);
		oRepDimensionView.getController().setNextPropertyInParentObject();
		//assert
		_commonTestForSetDetailData(assert, "property1", true, true);
		assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as :property1");
		assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getSelectedKey(), "key", "then label display option for dimension is selected as: " + "keyAndText");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.ADDPROPERTY), true, "then ADDPROPERTY event is fired");
		assert.strictEqual(spyFireEventOnFocusOfAdd.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.SETFOCUSONADDICON), true, "then SETFOCUSONADDICON event is fired");
		assert.strictEqual(spyOnAddDimension.callCount, 2, "then dimension for new property is added");
		assert.strictEqual(spyOnSetLabelDisplayOption.callCount, 2, "label display option for dimension is set");
		assert.strictEqual(spyOnSetDimensionKind.callCount, 2, "then kind for dimension is set");
		assert.strictEqual(spyOnAddDimension.getCall(0).args[0], "property1", "then dimension for new property property1 is added");
		assert.strictEqual(spyOnAddDimension.getCall(1).args[0], "property2", "then dimension for new property property2 is added");
		assert.strictEqual(spyOnSetDimensionKind.calledWith("property1", "xAxis"), true, "then kind for dimension is set as xAxis");
		assert.strictEqual(spyOnSetDimensionKind.calledWith("property2", "xAxis"), true, "then kind for dimension is set as xAxis");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
	});
	QUnit.test("When removing mandatory property which present exactly once", function(assert) {
		//action
		oRepDimensionView.getController().removePropertyFromParentObject();
		//assert
		assert.strictEqual(spyOnRemoveDimension.callCount, 1, "then dimension property is removed");
		assert.strictEqual(spyOnRemoveDimension.getCall(0).args[0], "property1", "then dimension property 'property1' is removed");
	});
	QUnit.module("For a Representation with non-mandatory property type of Dimension, in a legend context", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0]);
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property2", "property3" ],
						consumable : [ "property1", "property2", "property3" ]
					});
					return deferred.promise();
				});
				oRepDimensionView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, "property1", oModelerInstance.unsavedStepWithoutFilterMapping, false, "legend");
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When non-mandatory Property view is initialized for a legend context", function(assert) {
		_commonTestForSetDetailData(assert, "property1", true, false, "legend");
		assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as property1");
		assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getSelectedKey(), "key", "then label display option for dimension is selected as key");
		assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getItems()[1].getEnabled(), true, "display option type label is enabled");
		assert.strictEqual(oRepDimensionView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove dimension is not visible");
	});
	QUnit.module("For a Representation with non-mandatory property type of Dimension", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0]);
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property2", "property3" ],
						consumable : [ "property1", "property2", "property3" ]
					});
					return deferred.promise();
				});
				oRepDimensionView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, "property1", oModelerInstance.unsavedStepWithoutFilterMapping, false);
				var stubbedPropertyOrchestration = {
					getPropertyInformationList: function(){
						return [];
					},
					isSwapCase: function(){
						return false;
					},
					getPropertyTypeRow: function(){
						return {
							propertyRowInformation: {
								sProperty: "hugo"
							}
						}
					},
					getPropertyTypeRowByPropertyName: function(){
						return {
							propertyRowInformation: {
								sProperty: "otto"
							}
						}
					},
					updateAllSelectControlsForPropertyType: function() {
						return new Promise(function(resolve){
							resolve();
						});
					},
					removePropertyTypeReference: function(){}
				};
				oRepDimensionView.getViewData().oPropertyOrchestration = stubbedPropertyOrchestration;

				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When non-mandatory Property view is initialized", function(assert) {
		_commonTestForSetDetailData(assert, "property1", true, false);
		assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as property1");
		assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getSelectedKey(), "key", "then label display option for dimension is selected as key");
		assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getItems()[1].getEnabled(), true, "display option type label is enabled");
		assert.strictEqual(oRepDimensionView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove dimension is not visible");
	});
	QUnit.test("When non-mandatory dimension property type is changed to None", function(assert) {
		var done = assert.async();
		//arrange
		oRepDimensionView.getViewData().oPropertyTypeState.getPropertyValueState = function() {
			return [ "None" ];
		};
		//action
		oRepDimensionView.byId("idPropertyType").setSelectedKey("None");
		oRepDimensionView.getController().handleChangeForPropertyTypeAsPromise().then(function () {
			//asserts
			_commonTestForSetDetailData(assert, "None", true, false);
			assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "None", "then value for property type is set as : None");
			assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
			assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getEnabled(), false, "display option type label is not enabled");
			assert.strictEqual(oRepDimensionView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove dimension is not visible");
			done();
		});
	});
	QUnit.module("For a Representation with non-mandatory property type of Dimension set to None", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0]);
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property2", "property3" ],
						consumable : [ "property1", "property2", "property3" ]
					});
					return deferred.promise();
				});
				oRepDimensionView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, "None", oModelerInstance.unsavedStepWithoutFilterMapping, false);
				var stubbedPropertyOrchestration = {
					getPropertyInformationList: function(){
						return [{
							sProperty: "property1",
							sKind: "xAxis",
							sLabelDisplayOption: "keyAndText"
						}];
					},
					isSwapCase: function(){
						return false;
					},
					getPropertyTypeRow: function(){
						return {
							propertyRowInformation: {
								sProperty: "hugo"
							}
						}
					},
					getPropertyTypeRowByPropertyName: function(){
						return {
							propertyRowInformation: {
								sProperty: "otto"
							}
						}
					},
					updateAllSelectControlsForPropertyType: function() {
						return new Promise(function(resolve){
							resolve();
						});
					},
					removePropertyTypeReference: function(){}
				};
				oRepDimensionView.getViewData().oPropertyOrchestration = stubbedPropertyOrchestration;
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When non-mandatory Property view is initialized", function(assert) {
		_commonTestForSetDetailData(assert, "None", true, false);
		assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "None", "then value for property type is set as None");
		assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getEnabled(), false, "display option type label is not enabled");
		assert.strictEqual(oRepDimensionView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove dimension is not visible");
	});
	QUnit.test("When non-mandatory dimension property type is changed to property1", function(assert) {
		var done = assert.async();
		//arrange
		oRepDimensionView.getViewData().oPropertyTypeState.getPropertyValueState = function() {
			return [ "property1" ];
		};
		//action
		oRepDimensionView.byId("idPropertyType").setSelectedKey("property1");
		oRepDimensionView.getController().handleChangeForPropertyTypeAsPromise().then(function () {
			//asserts
			_commonTestForSetDetailData(assert, "property1", true, false);
			assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "property1", "then value for property type is set as : property1");
			assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
			assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getSelectedKey(), "keyAndText", "then label display option for dimension is selected as key and text");
			assert.strictEqual(oRepDimensionView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove dimension is not visible");
			assert.strictEqual(spyOnAddDimension.callCount, 1, "then add dimension is called for property2");
			assert.strictEqual(spyOnAddDimension.getCall(0).args[0], "property1", "then add dimension is called with property1");
			assert.strictEqual(spyOnSetDimensionKind.callCount, 1, "then SetDimensionKind is called for property1");
			assert.strictEqual(spyOnSetDimensionKind.calledWith("property1", "xAxis"), true, "then SetDimensionKind is called with correct parameter");
			assert.strictEqual(spyOnSetLabelDisplayOption.callCount, 1, "then SetLabelDisplayOption is called for property1");
			assert.strictEqual(spyOnSetLabelDisplayOption.calledWith("property1", "keyAndText"), true, "then SetLabelDisplayOption is called with correct parameter");
			assert.strictEqual(spyOnSetDimensionTextLabelKey.callCount, 1, "then SetDimensionTextLabelKey is called for property1");
			assert.strictEqual(spyOnSetDimensionTextLabelKey.calledWith("property1", undefined), true, "then SetDimensionTextLabelKey is called with correct parameter");
			assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set to unsaved");
			done();
		});
	});
	QUnit.module("For a Representation with property type of mandatory Dimension and when text property is removed from the step level", {
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
				oRepDimensionView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[1], assert, "property2", oModelerInstance.unsavedStepWithoutFilterMapping, true);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When mandatory Property view is initialized", function(assert) {
		_commonTestForSetDetailData(assert, "property2", false, true);
		assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "property2", "then value for property type is set as property2");
		assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getSelectedKey(), "Not Available: keyAndText", "then label display option for dimension is selected as keyAndText");
		assert.strictEqual(oRepDimensionView.byId("idLabelDisplayOptionType").getItems()[0].getEnabled(), true, "then only label display option type of key is enabled");
		assert.strictEqual(oRepDimensionView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove dimension is not visible");
	});
	QUnit.module("Reduced Value help for dimension property type", {
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
				oRepDimensionView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[1], assert, "property2", oModelerInstance.unsavedStepWithoutFilterMapping, true);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When no properties are used as dimensions", function(assert) {
		_commonTestForSetDetailData(assert, "property2", false, true);
		assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "property2", "then value for property type is set as property2");
		assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.module("Reduced Value help for dimension property type", {
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
				oRepDimensionView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[1], assert, "property2", oModelerInstance.unsavedStepWithoutFilterMapping, true);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When all properties are already added as dimension", function(assert) {
		_commonTestForSetDetailData(assert, "property2", false, true);
		assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "property2", "then value for property type is set as property2");
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "property2",
				"name" : "property2"
			} ]
		};
		assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.module("Reduced Value help for dimension property type", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[1]);
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property3" ],
						consumable : [ "property1", "property3" ]
					});
					return deferred.promise();
				});
				oRepDimensionView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[1], assert, "property2", oModelerInstance.unsavedStepWithoutFilterMapping, true);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When already selected dimension is not available in metadata", function(assert) {
		//assume property2 is not available in metadata
		_commonTestForSetDetailData(assert, "property2", false);
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property3",
				"name" : "property3"
			}, {
				"key" : "Not Available: property2",
				"name" : "Not Available: property2"
			} ]
		};
		assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "Not Available: property2", "then value for property type is set as NotAvailable:property2");
		assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.test("When already selected dimension is removed as a select property from step level", function(assert) {
		//assume property2 is removed as select property from step level
		_commonTestForSetDetailData(assert, "property2", false);
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property3",
				"name" : "property3"
			}, {
				"key" : "Not Available: property2",
				"name" : "Not Available: property2"
			} ]
		};
		assert.strictEqual(oRepDimensionView.byId("idPropertyType").getSelectedKey(), "Not Available: property2", "then value for property type is set as NotAvailable:property2");
		assert.deepEqual(oRepDimensionView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
});