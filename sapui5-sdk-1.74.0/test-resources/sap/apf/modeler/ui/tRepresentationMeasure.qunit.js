/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tRepresentationMeasure');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require("sap.apf.utils.utils");
sap.ui.define(["sap/apf/ui/utils/representationTypesHandler"], function(RepresentationTypesHandler){
	'use strict';
	var oModelerInstance, oRepMeasureView, spyOnConfigEditorSetIsUnsaved, spyOnSetMeasureKind, spyOnGetRepresentationType, spyOnAddMeasure, spyOnGetMeasureTextLabelKey, spyOnGetText, spyOnSetText, spyOnSetMeasureTextLabelKey, spyOnRemoveMeasure, oModelForPropertyType;
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
	function _placeViewAt(oRepMeasureView) {
		var divToPlaceRepMeasure = document.createElement("div");
		divToPlaceRepMeasure.setAttribute('id', 'contentOfFF');
		document.body.appendChild(divToPlaceRepMeasure);
		oRepMeasureView.placeAt("contentOfFF");
		sap.ui.getCore().applyChanges();
	}
	function _commonSpiesInBeforeEach() {
		spyOnGetRepresentationType = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "getRepresentationType");
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnAddMeasure = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "addMeasure");
		spyOnSetMeasureKind = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "setMeasureKind");
		spyOnGetMeasureTextLabelKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "getMeasureTextLabelKey");
		spyOnSetMeasureTextLabelKey = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "setMeasureTextLabelKey");
		spyOnRemoveMeasure = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], "removeMeasure");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
		spyOnSetText = sinon.spy(oModelerInstance.configurationHandler.getTextPool(), "setTextAsPromise");
	}
	function _instantiateView(sId, assert, oStep) {
		var oMeasuresController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationMeasure");
		var spyOnInit = sinon.spy(oMeasuresController, "onInit");
		var oStepPropertyMetadataTypeHandlerStub = {
			getMeasures : function(entityTypeMetadata) {
				assert.equal(entityTypeMetadata.type, "myEntityTypeMetadataStub", "Correct parameter hand over");
				return [ "property4", "property2", "property1" ];
			},
			getDefaultLabel : function(entityTypeMetadata, oText) {
				assert.equal(entityTypeMetadata.type, "myEntityTypeMetadataStub", "Correct parameter hand over");
				return oText;
			},
			hasTextPropertyOfDimension : function(entityTypeMetadata, sProperty) {
				assert.equal(entityTypeMetadata.type, "myEntityTypeMetadataStub", "Correct parameter hand over");
				var bHasTextProperty;
				if (sProperty === "property4") {
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
					"aggregation-role" : "measure",
					"dataType" : {
						"maxLength" : "10",
						"type" : "Edm.String"
					},
					"name" : "Measure" + sPropertyName
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
				return "Measure for Vertical Axis";
			},
			isAdditionToBeEnabled : function() {
				return true;
			},
			isCombinationChart  : function(){
				return false;
			}
		};
		var oPropertyTypeStateStub = {
			getPropertyValueState : function() {
				return [ "property4" ];
			},
			indexOfPropertyTypeViewId : function() {
				return 0;
			}
		};
		oRepMeasureView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.propertyType",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oMeasuresController,
			viewData : {
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oParentObject : sId,
				oStepPropertyMetadataHandler : oStepPropertyMetadataTypeHandlerStub,
				oRepresentationTypeHandler : oRepresentationTypeHandlerStub,
				oCoreApi : oModelerInstance.modelerCore,
				oPropertyTypeState : oPropertyTypeStateStub,
				oPropertyTypeData : {
					sProperty : "property4",
					sContext : "yAxis"
				},
				sPropertyType : sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes.MEASURE
			}
		});
		oRepMeasureView.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		assert.strictEqual(spyOnInit.calledOnce, true, "then proprty type onInit function is called and view is initialized");
		return oRepMeasureView;
	}
	function _commonCleanUpsInAfterEach() {
		oRepMeasureView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oRepMeasureView.getViewData().oConfigurationHandler.getTextPool().setTextAsPromise.restore();
		spyOnGetText.restore();
		oModelerInstance.reset();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oRepMeasureView.destroy();
	}
	function _commonTestForSetDetailData(assert, sProperty) {
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "property4",
				"name" : "property4"
			}, {
				"key" : "property2",
				"name" : "property2"
			}, {
				"key" : "property1",
				"name" : "property1"
			} ]
		};
		assert.ok(oRepMeasureView, "then property view is available");
		//asserts for property label
		assert.strictEqual(spyOnGetMeasureTextLabelKey.called, true, "then measure text label is available");
		assert.ok(oRepMeasureView.byId("idPropertyLabel").getText(), "then default label is set");
		assert.strictEqual(oRepMeasureView.byId("idPropertyLabelText").getValue(), sProperty, "then value for property label text input box is set as " + sProperty);
		assert.strictEqual(spyOnGetRepresentationType.called, true, "then representation type is found");
		//asserts for invisible text
		assert.strictEqual(spyOnGetText.calledWith("ariaTextForAddIcon"), true, "then invisible text for add icon is set");
		assert.strictEqual(spyOnGetText.calledWith("ariaTextForDeleteIcon"), true, "then invisible text for remove icon is set");
		//asserts for labels
		assert.strictEqual(spyOnGetText.calledWith("label"), true, "then label is set");
		assert.strictEqual(spyOnGetText.calledWith("default"), true, "then default label is set");
		assert.ok(oRepMeasureView.byId("idPropertyTypeLabel").getText(), "then property type label is populated");
		// asserts for add/remove
		assert.strictEqual(spyOnGetText.calledWith("addButton"), true, "then tooltip for add icon is set");
		assert.strictEqual(spyOnGetText.calledWith("deleteButton"), true, "then tooltip for remove icon is set");
		assert.ok(oRepMeasureView.byId("idAddPropertyIcon"), "then add icon to add measure is available");
		assert.strictEqual(oRepMeasureView.byId("idAddPropertyIcon").getVisible(), true, "then add icon to add measure is visible");
		assert.ok(oRepMeasureView.byId("idRemovePropertyIcon"), "then remove icon to remove measure is available");
	}
	QUnit.module("For a Representation with property type of Measure", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property4", "property2", "property1" ],
						consumable : [ "property4", "property2", "property1" ]
					});
					return deferred.promise();
				});
				oRepMeasureView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, oModelerInstance.unsavedStepWithoutFilterMapping);
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
						return sap.apf.modeler.ui.utils.CONSTANTS.aggregationRoles.MEASURE;
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
				oRepMeasureView.getViewData().oPropertyOrchestration = that.stubbedPropertyOrchestration;
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When Property view is initialized", function(assert) {
		_commonTestForSetDetailData(assert, "property4");
		assert.strictEqual(oRepMeasureView.byId("idPropertyType").getSelectedKey(), "property4", "then value for property type is set as property4");
		assert.deepEqual(oRepMeasureView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepMeasureView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove measure is not visible");
	});
	QUnit.test("When property type is changed", function(assert) {
		var done = assert.async();
		//arrange
		oRepMeasureView.getViewData().oPropertyTypeState.getPropertyValueState = function() {
			return [ "property2" ];
		};
		//action
		oRepMeasureView.byId("idPropertyType").setSelectedKey("property2");
		oRepMeasureView.getController().handleChangeForPropertyTypeAsPromise().then(function () {
			//asserts
			_commonTestForSetDetailData(assert, "property2");
			assert.strictEqual(oRepMeasureView.byId("idPropertyType").getSelectedKey(), "property2", "then value for property type is set as property2");
			assert.deepEqual(oRepMeasureView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
			assert.strictEqual(oRepMeasureView.byId("idRemovePropertyIcon").getVisible(), false, "then remove icon to remove measure is not visible");
			assert.strictEqual(spyOnAddMeasure.callCount, 1, "then add measure is called");
			assert.strictEqual(spyOnAddMeasure.getCall(0).args[0], "property2", "and is called with 'property2'");
			assert.strictEqual(spyOnSetMeasureKind.calledOnce, true, "then SetMeasureKind is called for property2");
			assert.strictEqual(spyOnSetMeasureKind.calledWith("property2", "yAxis"), true, "then SetMeasureKind is called with correct parametr");
			assert.strictEqual(spyOnSetMeasureTextLabelKey.calledOnce, true, "then SetMeasureTextLabelKey is called for property2");
			assert.strictEqual(spyOnSetMeasureTextLabelKey.calledWith("property2", undefined), true, "then SetMeasureTextLabelKey is called with correct parametr");
			assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
			done();
		});
	});
	QUnit.test("When label for measure changed from default to new label", function(assert) {
		//action
		oRepMeasureView.byId("idPropertyLabelText").setValue("new label");
		oRepMeasureView.getController().handleChangeForLabelText();
		//assert
		assert.strictEqual(oRepMeasureView.byId("idPropertyLabelText").getValue(), "new label", "then property label text is changed to new label");
		assert.strictEqual(spyOnSetMeasureTextLabelKey.calledOnce, true, "then property label key is set in core");
		assert.strictEqual(spyOnSetMeasureTextLabelKey.calledWith("property4", "new label"), true, "then property label key is changes as new label");
		assert.strictEqual(spyOnSetText.calledOnce, true, "then api to set new label is called");
		assert.strictEqual(spyOnSetText.calledWith("new label", {
			TextElementType : "XTIT",
			MaximumLength : 80
		}), true, "then label value as new label is set");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When label for measure changed from default to null", function(assert) {
		//action
		oRepMeasureView.byId("idPropertyLabelText").setValue("");
		oRepMeasureView.getController().handleChangeForLabelText();
		//assert
		assert.strictEqual(oRepMeasureView.byId("idPropertyLabelText").getValue(), "property4", "then property label text is still property4");
		assert.strictEqual(spyOnSetMeasureTextLabelKey.calledOnce, true, "then method to set property label key is called");
		assert.strictEqual(spyOnSetMeasureTextLabelKey.calledWith("property4", undefined), true, "then property label key is not changed");
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
		oRepMeasureView.getController().handleChangeForLabelText();
		oRepMeasureView.getController().handleSuggestions(oEvent);
		//assert
		assert.strictEqual(spyOnManageSuggestionTexts.calledOnce, true, "then suggestions are fetched from SuggestionTextHandler");
		assert.strictEqual(spyOnManageSuggestionTexts.calledWith(oEvent, oTranslationFormat), true, "then suggestions are fetched from SuggestionTextHandler for the correct event");
		//clean ups
		spyOnManageSuggestionTexts.restore();
	});
	QUnit.test("When add icon of measure is pressed", function(assert) {
		//arrange
		this.stubbedPropertyOrchestration.getPropertyInformationList =  function(){
			return [{
				sProperty: "property4",
				sKind: 'yAxis',
				sTextLabelKey: undefined,
				sLabelDisplayOption: undefined
			}];
		};
		var spyFireEvent = sinon.spy(oRepMeasureView, "fireEvent");
		var spyFireEventOnFocusOfAdd = sinon.spy(oRepMeasureView.byId("idAddPropertyIcon"), "fireEvent");
		oRepMeasureView.getViewData().oPropertyTypeState.getViewAt = function() {
			return oRepMeasureView;
		};
		//action
		oRepMeasureView.byId("idAddPropertyIcon").firePress();
		_placeViewAt(oRepMeasureView);
		oRepMeasureView.getController().setNextPropertyInParentObject();
		//assert
		_commonTestForSetDetailData(assert, "property4");
		assert.strictEqual(oRepMeasureView.byId("idPropertyType").getSelectedKey(), "property4", "then value for property type is set as property4");
		assert.deepEqual(oRepMeasureView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.ADDPROPERTY), true, "then ADDPROPERTY event is fired");
		assert.strictEqual(spyFireEventOnFocusOfAdd.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.SETFOCUSONADDICON), true, "then SETFOCUSONADDICON event is fired");
		assert.strictEqual(spyOnAddMeasure.calledOnce, true, "then measure for new property is added");
		assert.strictEqual(spyOnAddMeasure.getCall(0).args[0], "property4", "then measure for new property property4 is added");
		assert.strictEqual(spyOnSetMeasureKind.calledOnce, true, "then kind for measure is set");
		assert.strictEqual(spyOnSetMeasureKind.calledWith("property4", "yAxis"), true, "then kind for measure is set as yAxis");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When add icon of measure is pressed - when already one measure exists", function(assert) {
		//arrange
		this.stubbedPropertyOrchestration.getPropertyInformationList =  function(){
			return [{
				sProperty: "property4",
				sKind: 'yAxis'
			},{
				sProperty: "property1",
				sKind: 'yAxis'
			}];
		};
		var spyFireEvent = sinon.spy(oRepMeasureView, "fireEvent");
		var spyFireEventOnFocusOfAdd = sinon.spy(oRepMeasureView.byId("idAddPropertyIcon"), "fireEvent");
		oRepMeasureView.getViewData().oPropertyTypeState.getViewAt = function() {
			return oRepMeasureView;
		};
		oRepMeasureView.getViewData().oPropertyTypeState.getPropertyValueState = function() {
			return [ "property4","property1" ];
		};
		//action
		oRepMeasureView.byId("idAddPropertyIcon").firePress();
		_placeViewAt(oRepMeasureView);
		oRepMeasureView.getController().setNextPropertyInParentObject();
		//assert
		_commonTestForSetDetailData(assert, "property4");
		assert.strictEqual(oRepMeasureView.byId("idPropertyType").getSelectedKey(), "property4", "then value for property type is set as property4");
		assert.deepEqual(oRepMeasureView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.ADDPROPERTY), true, "then ADDPROPERTY event is fired");
		assert.strictEqual(spyFireEventOnFocusOfAdd.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.SETFOCUSONADDICON), true, "then SETFOCUSONADDICON event is fired");
		assert.strictEqual(spyOnAddMeasure.calledTwice, true, "then measure for new property is added");
		assert.strictEqual(spyOnAddMeasure.calledWith("property4"), true, "then measure for new property property4 is added");
		assert.strictEqual(spyOnAddMeasure.calledWith("property1"), true, "then measure for new property property1 is added");
		assert.strictEqual(spyOnSetMeasureKind.calledTwice, true, "then kind for measure is set");
		assert.strictEqual(spyOnSetMeasureKind.calledWith("property4", "yAxis"), true, "then kind for measure is set as yAxis");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When removing property which present exactly once", function(assert) {
		//action
		oRepMeasureView.getController().removePropertyFromParentObject();
		//assert
		assert.strictEqual(spyOnRemoveMeasure.calledOnce, true, "then measure property is removed");
		assert.strictEqual(spyOnRemoveMeasure.calledWith("property4"), true, "then measure property 'property4' is removed");
	});
	QUnit.module("Reduced Value help for measure property type", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0]);
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property4", "property2", "property1" ],
						consumable : [ "property4", "property2", "property1" ]
					});
					return deferred.promise();
				});
				oRepMeasureView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, oModelerInstance.unsavedStepWithoutFilterMapping);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When no properties are used as measures", function(assert) {
		_commonTestForSetDetailData(assert, "property4");
		assert.strictEqual(oRepMeasureView.byId("idPropertyType").getSelectedKey(), "property4", "then value for property type is set as property4");
		assert.deepEqual(oRepMeasureView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.module("Reduced Value help for measure property type", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0]);
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property4", "property2", "property1" ],
						consumable : []
					});
					return deferred.promise();
				});
				oRepMeasureView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, oModelerInstance.unsavedStepWithoutFilterMapping);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When all properties are already added as dimension", function(assert) {
		_commonTestForSetDetailData(assert, "property4");
		assert.strictEqual(oRepMeasureView.byId("idPropertyType").getSelectedKey(), "property4", "then value for property type is set as property4");
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "property4",
				"name" : "property4"
			} ]
		};
		assert.deepEqual(oRepMeasureView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.module("Reduced Value help for measure property type", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0]);
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property2", "property1" ],
						consumable : [ "property2", "property1" ]
					});
					return deferred.promise();
				});
				oRepMeasureView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, oModelerInstance.unsavedStepWithoutFilterMapping);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When already selected measure is not available in metadata", function(assert) {
		//assume property4 is not available in metadata
		_commonTestForSetDetailData(assert, "property4");
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "property2",
				"name" : "property2"
			}, {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "Not Available: property4",
				"name" : "Not Available: property4"
			} ]
		};
		assert.strictEqual(oRepMeasureView.byId("idPropertyType").getSelectedKey(), "Not Available: property4", "then value for property type is set as NotAvailable:property4");
		assert.deepEqual(oRepMeasureView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.test("When already selected dimension is removed as a select property from step level", function(assert) {
		//assume property4 is removed as select property from step level
		_commonTestForSetDetailData(assert, "property4");
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "property2",
				"name" : "property2"
			}, {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "Not Available: property4",
				"name" : "Not Available: property4"
			} ]
		};
		assert.strictEqual(oRepMeasureView.byId("idPropertyType").getSelectedKey(), "Not Available: property4", "then value for property type is set as NotAvailable:property4");
		assert.deepEqual(oRepMeasureView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.module("Show measure display options for combinationCharts", {
		beforeEach : function(assert) {
			this.viewData = {
				oCoreApi : {
					getText : function(key){
						return "ApfText: " + key;
					}
				},
				oPropertyTypeData : {
					bMandatory : false,
					sProperty : "PropertyB"
				},
				oPropertyTypeState : {
					getPropertyValueState : function(){
						return {
							0 : "PropertyB"
						};
					},
					indexOfPropertyTypeViewId : function(){
						return 0;
					}
				},
				oStepPropertyMetadataHandler : {
					oStep : {
						getConsumablePropertiesForRepresentation : function(){
							return jQuery.Deferred().resolve({
								consumable : ["PropertyA"],
								available : ["PropertyA", "PropertyB"]
							});
						}
					},
					getEntityTypeMetadataAsPromise : function(){
						return jQuery.Deferred().resolve();
					},
					getPropertyMetadata : function(){
						return {};
					}
				},
				oParentObject : {
					getMeasureKind : function(property){
						assert.strictEqual(property, "PropertyB", "Correct property handed over to getMeasureKind");
						return "yAxis";
					},
					measureOption : undefined,
					getId : function(){
						return "id";
					},
					getMeasureTextLabelKey : function(){
						return "measureTextKey";
					},
					getRepresentationType : function(){
						return "DualStackedCombinationChart";
					},
					getMeasureDisplayOption : function(property){
						assert.strictEqual(property, "PropertyB", "Correct property handed over to getMeasureOption");
						return this.measureOption;
					},
					setMeasureDisplayOption : function(property, option){
						assert.strictEqual(property, "PropertyB", "Correct property handed over to setMeasureOption");
						this.measureOption = option;
					}
				},
				oConfigurationEditor : {
					setIsUnsaved : function(){}
				},
				oConfigurationHandler : {
					getTextPool : function(){
						return {
							get : function(key){
								return {
									TextElementDescription : "UserText : " + key
								};
							}
						};
					}
				},
				oViewValidator : {
					addField : function(){}
				},
				sPropertyType : "measures",
				oRepresentationTypeHandler : new RepresentationTypesHandler()
			};
			this.setIsUnsavedSpy = sinon.spy(this.viewData.oConfigurationEditor, "setIsUnsaved");
			this.representationMeasureController = sap.ui.controller("sap.apf.modeler.ui.controller.representationMeasure");
		},
		instantiateView : function(){
			this.view = sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.propertyType",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : this.viewData,
				controller : this.representationMeasureController
			}).placeAt("testArea");
			sap.ui.getCore().applyChanges();
			return this.view;
		},
		assertCommonDisplayOptionType : function(assert){
			assert.strictEqual(this.view.byId("idLabelDisplayOptionType").getVisible(), true, "DisplayOption is visible");
			assert.strictEqual(this.view.byId("idLabelDisplayOptionType").bIsDestroyed, undefined, "DisplayOption is not destroyed");
			assert.strictEqual(this.view.byId("idPropertyTypeLayout").getSpan(), "L2 M2 S2", "Span of layout is not adjusted");

			assert.strictEqual(this.view.byId("idLabelDisplayOptionType").getItems().length, 2, "DisplayOption has 2 options");
			assert.strictEqual(this.view.byId("idLabelDisplayOptionType").getItems()[0].getKey(), "line", "DisplayOption has option line");
			assert.strictEqual(this.view.byId("idLabelDisplayOptionType").getItems()[0].getText(), "ApfText: line", "Option line has correct text");
			assert.strictEqual(this.view.byId("idLabelDisplayOptionType").getItems()[1].getKey(), "bar", "DisplayOption has option bar");
			assert.strictEqual(this.view.byId("idLabelDisplayOptionType").getItems()[1].getText(), "ApfText: column", "Option bar has correct text");
		},
		afterEach : function(){
			this.setIsUnsavedSpy.restore();
			this.view.destroy();
		}
	});
	QUnit.test("Display Option for non-CombinationChart", function(assert) {
		var isCombinationChartStub = sinon.stub(this.viewData.oRepresentationTypeHandler, "isCombinationChart", function(){
			return false;
		});
		var view = this.instantiateView();
		assert.strictEqual(view.byId("idLabelDisplayOptionType"), undefined, "DisplayOption is destroyed");
		assert.strictEqual(view.byId("idPropertyTypeLayout").getSpan(), "L4 M4 S4", "Span of layout is adjusted");

		isCombinationChartStub.restore();
	});
	QUnit.test("Display Option for CombinationChart when measure is mandatory", function(assert) {
		this.viewData.oPropertyTypeData.bMandatory = true;
		var view = this.instantiateView();

		this.assertCommonDisplayOptionType(assert);
		assert.strictEqual(view.byId("idLabelDisplayOptionType").getSelectedKey(), "bar", "Bar option is selected as default");
		assert.strictEqual(this.viewData.oParentObject.measureOption, "bar", "Bar option is set to the representation model");
	});
	QUnit.test("Display Option for CombinationChart when measure is not mandatory", function(assert) {
		var view = this.instantiateView();

		this.assertCommonDisplayOptionType(assert);
		assert.strictEqual(view.byId("idLabelDisplayOptionType").getSelectedKey(), "line", "Line option is selected as default");
		assert.strictEqual(this.viewData.oParentObject.measureOption, "line", "Line option is set to the representation model");
	});
	QUnit.test("When Display option is already set in the configuration to bar", function(assert) {
		this.viewData.oParentObject.measureOption = "bar";
		var view = this.instantiateView();
		this.assertCommonDisplayOptionType(assert);
		assert.strictEqual(view.byId("idLabelDisplayOptionType").getSelectedKey(), "bar", "Bar option is selected");
		assert.strictEqual(this.viewData.oParentObject.measureOption, "bar", "Bar option is set to the representation model");
	});
	QUnit.test("When Display option is already set in the configuration to line", function(assert) {
		this.viewData.oParentObject.measureOption = "line";
		var view = this.instantiateView();
		this.assertCommonDisplayOptionType(assert);
		assert.strictEqual(view.byId("idLabelDisplayOptionType").getSelectedKey(), "line", "Line option is selected");
		assert.strictEqual(this.viewData.oParentObject.measureOption, "line", "Line option is set to the representation model");
	});
	QUnit.test("When Display option is already set but chart is not a combination chart (representation switch)", function(assert) {
		this.viewData.oParentObject.measureOption = "line";
		var isCombinationChartStub = sinon.stub(this.viewData.oRepresentationTypeHandler, "isCombinationChart", function(){
			return false;
		});
		this.instantiateView();
		assert.strictEqual(this.viewData.oParentObject.measureOption, undefined, "MeasureOptions is removed in the configuration");
		isCombinationChartStub.restore();
	});
	QUnit.test("When Display option is changed from line to bar", function(assert) {
		this.viewData.oParentObject.measureOption = "line";
		var view = this.instantiateView();
		this.assertCommonDisplayOptionType(assert);
		view.byId("idLabelDisplayOptionType").setSelectedKey("bar");
		view.byId("idLabelDisplayOptionType").fireChange({
			selectedItem : view.byId("idLabelDisplayOptionType").getItemByKey("bar")
		});
		assert.strictEqual(view.byId("idLabelDisplayOptionType").getSelectedKey(), "bar", "Bar option is selected");
		assert.strictEqual(this.viewData.oParentObject.measureOption, "bar", "Bar option is set to the representation model");
		assert.strictEqual(this.setIsUnsavedSpy.callCount, 1, "Configuration editor is set to unsaved");
	});
	QUnit.test("When Display option is changed from bar to line", function(assert) {
		this.viewData.oParentObject.measureOption = "bar";
		var view = this.instantiateView();
		this.assertCommonDisplayOptionType(assert);
		view.byId("idLabelDisplayOptionType").setSelectedKey("line");
		view.byId("idLabelDisplayOptionType").fireChange({
			selectedItem : view.byId("idLabelDisplayOptionType").getItemByKey("line")
		});
		assert.strictEqual(view.byId("idLabelDisplayOptionType").getSelectedKey(), "line", "Line option is selected");
		assert.strictEqual(this.viewData.oParentObject.measureOption, "line", "Line option is set to the representation model");
		assert.strictEqual(this.setIsUnsavedSpy.callCount, 1, "Configuration editor is set to unsaved");
	});
	QUnit.module("DisplayMeasureOption when adding a property", {
		beforeEach : function(assert) {
			this.representationMeasureController = sap.ui.controller("sap.apf.modeler.ui.controller.representationMeasure");
			this.representationMeasureController.oRepresentation = {
				measure : {
					name : "Property",
					kind : "yAxis",
					textLabelKey : "PropertyLabelKey",
					measureDisplayOption : "bar"
				},
				getMeasureKind : function (property){
					assert.strictEqual(this.measure.name, property, "Correct property handed over to getMeasureKind");
					return this.measure.kind;
				},
				getMeasureTextLabelKey : function (property){
					assert.strictEqual(this.measure.name, property, "Correct property handed over to getMeasureTextLabelKey");
					return this.measure.textLabelKey;
				},
				getMeasureDisplayOption : function (property){
					assert.strictEqual(this.measure.name, property, "Correct property handed over to getMeasureDisplayOption");
					return this.measure.measureDisplayOption;
				},
				getMeasures : function(){
					return [this.measure.name];
				},
				removeMeasure : function (property){
					assert.strictEqual(this.measure.name, property, "Correct property handed over to removeMeasure");
					this.measure = {};
				},
				addMeasure : function(property){
					this.measure.name = property;
				},
				setMeasureKind : function (property, kind){
					assert.strictEqual(this.measure.name, property, "Correct property handed over to setMeasureKind");
					this.measure.kind = kind;
				},
				setMeasureTextLabelKey : function (property, textLabelKey){
					assert.strictEqual(this.measure.name, property, "Correct property handed over to setMeasureTextLabelKey");
					this.measure.textLabelKey = textLabelKey;
				},
				setMeasureDisplayOption : function(property, measureDisplayOption){
					assert.strictEqual(this.measure.name, property, "Correct property handed over to setMeasureDisplayOption");
					this.measure.measureDisplayOption = measureDisplayOption;
				}
			};
		}
	});
	QUnit.test("updateProperties", function(assert) {
		var givenCurrentPropertiesInformation = {
			sProperty : "Property",
			sKind : "yAxis",
			sTextLabelKey : "PropertyLabelKey",
			sMeasureDisplayOption : "bar"
		};
		this.representationMeasureController.updatePropertiesInConfiguration([givenCurrentPropertiesInformation]);
		var expectedMeasure = {
			name : "Property",
			kind : "yAxis",
			textLabelKey : "PropertyLabelKey",
			measureDisplayOption : "bar"
		};
		assert.deepEqual(this.representationMeasureController.oRepresentation.measure, expectedMeasure, "After updating the measure property is still correctly set to the core object");
	});
});