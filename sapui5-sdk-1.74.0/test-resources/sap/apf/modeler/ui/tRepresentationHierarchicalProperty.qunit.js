/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tRepresentationHierarchicalProperty');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	'use strict';
	var oRepHierarchyPropertyView, oModelerInstance, spyOnGetText, spyOnSetText, spyOnSetHierarchyPropertyTextLabelKey, spyOnGetHierarchyPropertyTextLabelKey, spyOnGetRepresentationType, spyOnConfigEditorSetIsUnsaved, spyOnSetPropertyKind, spyOnAddProperty, spyOnRemoveProperty, oModelForPropertyType, spyOnGetHierarchyPropertyLabelDisplayOption, spyOnSetHierarchyPropertyLabelDisplayOption, spyOnGetHierarchyNodeIdAsPromise;
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
	function _commonSpiesInBeforeEach() {
		spyOnGetRepresentationType = sinon.spy(oModelerInstance.firstHierarchicalStep.getRepresentations()[0], "getRepresentationType");
		spyOnGetHierarchyPropertyTextLabelKey = sinon.spy(oModelerInstance.firstHierarchicalStep.getRepresentations()[0], "getHierarchyPropertyTextLabelKey");
		spyOnSetHierarchyPropertyTextLabelKey = sinon.spy(oModelerInstance.firstHierarchicalStep.getRepresentations()[0], "setHierarchyPropertyTextLabelKey");
		spyOnAddProperty = sinon.spy(oModelerInstance.firstHierarchicalStep.getRepresentations()[0], "addProperty");
		spyOnSetPropertyKind = sinon.spy(oModelerInstance.firstHierarchicalStep.getRepresentations()[0], "setPropertyKind");
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnGetHierarchyNodeIdAsPromise = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getHierarchyNodeIdAsPromise");
		spyOnSetText = sinon.spy(oModelerInstance.configurationHandler.getTextPool(), "setTextAsPromise");
		spyOnGetHierarchyPropertyLabelDisplayOption = sinon.spy(oModelerInstance.firstHierarchicalStep.getRepresentations()[0], "getHierarchyPropertyLabelDisplayOption");
		spyOnSetHierarchyPropertyLabelDisplayOption = sinon.spy(oModelerInstance.firstHierarchicalStep.getRepresentations()[0], "setHierarchyPropertyLabelDisplayOption");
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
		spyOnRemoveProperty = sinon.spy(oModelerInstance.firstHierarchicalStep.getRepresentations()[0], "removeProperty");
	}
	function _instantiateView(sId, assert, oStep) {
		var oPropertiesController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationHierarchyProperty");
		var spyOnInit = sinon.spy(oPropertiesController, "onInit");
		var oStepPropertyMetadataTypeHandlerStub = {
			getProperties : function(entityTypeMetadata) {
				return [ "hierarchicalproperty1" ];
			},
			getHierarchicalProperty : function() {
				return "hierarchicalproperty1";
			},
			getDefaultLabel : function(entityTypeMetadata, oText) {
				assert.equal(entityTypeMetadata.type, "myEntityTypeMetadataStub", "Correct parameter hand over");
				return oText;
			},
			hasTextPropertyOfDimension : function(entityTypeMetadata, sProperty) {
				assert.equal(entityTypeMetadata.type, "myEntityTypeMetadataStub", "Correct parameter hand over");
				var bHasTextProperty;
				if (sProperty === "hierarchicalproperty1") {
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
			}
		};
		var oRepresentationTypeHandlerStub = {
			getLabelsForChartType : function() {
				return "Hierarchical Property for Column";
			},
			isAdditionToBeEnabled : function() {
				return true;
			}
		};
		var oPropertyTypeStateStub = {
			getPropertyValueState : function() {
				return [ "hierarchicalproperty1" ];
			},
			indexOfPropertyTypeViewId : function() {
				return 0;
			}
		};
		oRepHierarchyPropertyView = new sap.ui.view({
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
				oPropertyTypeData : {
					sProperty : "hierarchicalproperty1",
					sContext : "hierarchicalColumn"
				},
				sPropertyType : sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes.HIERARCHIALCOLUMN
			}
		});
		oRepHierarchyPropertyView.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		assert.strictEqual(spyOnInit.calledOnce, true, "then proprty type onInit function is called and view is initialized");
		return oRepHierarchyPropertyView;
	}
	function _commonTestForSetDetailData(assert, sProperty) {
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "hierarchicalproperty1",
				"name" : "hierarchicalproperty1"
			} ]
		};
		assert.ok(oRepHierarchyPropertyView, "then property view is available");
		//hierarchical property is disabled
		assert.strictEqual(oRepHierarchyPropertyView.byId("idPropertyType").getEnabled(), false, "then hierarchical property is disabled");
		//asserts for property label
		assert.strictEqual(spyOnGetHierarchyPropertyTextLabelKey.called, true, "then property text label is available");
		assert.ok(oRepHierarchyPropertyView.byId("idPropertyLabel").getText(), "then default label is set");
		assert.strictEqual(oRepHierarchyPropertyView.byId("idPropertyLabelText").getValue(), sProperty, "then value for property label text input box is set as " + sProperty);
		assert.strictEqual(spyOnGetRepresentationType.called, true, "then representation type is found");
		//asserts for labels
		assert.strictEqual(spyOnGetText.calledWith("label"), true, "then label is set");
		assert.ok(oRepHierarchyPropertyView.byId("idPropertyTypeLabel").getText(), "then property type label is populated");
	}
	function _commonCleanUpsInAfterEach() {
		oModelerInstance.firstHierarchicalStep.getConsumablePropertiesForRepresentation.restore();
		oRepHierarchyPropertyView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oRepHierarchyPropertyView.getViewData().oConfigurationEditor.getHierarchyNodeIdAsPromise.restore();
		oRepHierarchyPropertyView.getViewData().oConfigurationHandler.getTextPool().setTextAsPromise.restore();
		spyOnGetText.restore();
		spyOnGetRepresentationType.restore();
		spyOnGetHierarchyPropertyTextLabelKey.restore();
		spyOnSetHierarchyPropertyTextLabelKey.restore();
		spyOnGetHierarchyPropertyLabelDisplayOption.restore();
		spyOnSetHierarchyPropertyLabelDisplayOption.restore();
		spyOnAddProperty.restore();
		spyOnSetPropertyKind.restore();
		spyOnConfigEditorSetIsUnsaved.restore();
		spyOnRemoveProperty.restore();
		oModelerInstance.reset();
		oRepHierarchyPropertyView.destroy();
	}
	QUnit.module("For a Representation with property type of hierarchical Property with display option text", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				sinon.stub(oModelerInstance.firstHierarchicalStep, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "hierarchicalproperty1", "hierarchicalproperty2" ],
						consumable : [ "hierarchicalproperty1", "hierarchicalproperty2" ]
					});
					return deferred.promise();
				});
				oRepHierarchyPropertyView = _instantiateView(oModelerInstance.firstHierarchicalStep.getRepresentations()[0], assert, oModelerInstance.firstHierarchicalStep);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When hierarchy Property view is initialized", function(assert) {
		_commonTestForSetDetailData(assert, "hierarchicalproperty1");
		assert.strictEqual(oRepHierarchyPropertyView.byId("idLabelDisplayOptionType").getSelectedKey(), "text", "then label display option for property is selected as text");
		assert.strictEqual(oRepHierarchyPropertyView.byId("idLabelDisplayOptionType").getItems()[0].getEnabled(), true, "display option type label key is enabled");
		assert.strictEqual(oRepHierarchyPropertyView.byId("idLabelDisplayOptionType").getItems()[1].getEnabled(), true, "display option type label text is enabled");
		assert.strictEqual(spyOnGetHierarchyPropertyLabelDisplayOption.calledOnce, true, "then GetHierarchyPropertyLabelDisplayOption is called for hierarchicalproperty1");
		assert.strictEqual(spyOnGetHierarchyPropertyLabelDisplayOption(), "text", "then GetHierarchyProperty LabelDisplayOption is text");
		assert.strictEqual(oRepHierarchyPropertyView.byId("idPropertyType").getSelectedKey(), "hierarchicalproperty1", "then value for property type is set as hierarchicalproperty1");
		assert.deepEqual(oRepHierarchyPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepHierarchyPropertyView.byId("idPropertyType").getEnabled(), false, "then the hierarchy property dropdown is disabled");
	});
	QUnit.test("When Label Display Option Type is changed", function(assert) {
		//action
		oRepHierarchyPropertyView.byId("idLabelDisplayOptionType").setSelectedKey("key");
		oRepHierarchyPropertyView.getController().handleChangeForLabelDisplayOptionType();
		//assert
		assert.strictEqual(oRepHierarchyPropertyView.byId("idLabelDisplayOptionType").getSelectedKey(), "key", "then label display option for dimension is selected as key and text");
		assert.strictEqual(spyOnSetHierarchyPropertyLabelDisplayOption.calledOnce, true, "then label display option is changed");
		assert.strictEqual(spyOnSetHierarchyPropertyLabelDisplayOption.calledWith("key"), true, "then label display option is changed to key in core");
		assert.strictEqual(spyOnGetHierarchyNodeIdAsPromise.called, true, "then getHierarchyNodeIdAsPromise is called to get the node id of hierarchical property");
		assert.strictEqual(spyOnGetHierarchyNodeIdAsPromise.calledWith("hierarchicalService1", "hierarchicalEntitySet1", "hierarchicalproperty1"), true, "then getHierarchyNodeIdAsPromise is called to get the node id of hierarchical property");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When label for hierarchy property is changed from default to new label", function(assert) {
		//action
		oRepHierarchyPropertyView.byId("idPropertyLabelText").setValue("new label");
		oRepHierarchyPropertyView.getController().handleChangeForLabelText();
		//assert 
		assert.strictEqual(oRepHierarchyPropertyView.byId("idPropertyLabelText").getValue(), "new label", "then property label text is changed to new label");
		assert.strictEqual(spyOnGetHierarchyPropertyTextLabelKey.called, true, "then property label key is set in core");
		assert.strictEqual(spyOnSetHierarchyPropertyTextLabelKey.calledWith("new label"), true, "then property label key is changes as new label");
		assert.strictEqual(spyOnSetText.calledOnce, true, "then api to set new label is called");
		assert.strictEqual(spyOnSetText.calledWith("new label", {
			TextElementType : "XTIT",
			MaximumLength : 80
		}), true, "then label value as new label is set");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When label for hierarchy property changed from default to null", function(assert) {
		//action
		oRepHierarchyPropertyView.byId("idPropertyLabelText").setValue("");
		oRepHierarchyPropertyView.getController().handleChangeForLabelText();
		//assert
		assert.strictEqual(oRepHierarchyPropertyView.byId("idPropertyLabelText").getValue(), "hierarchicalproperty1", "then property label text is still property4");
		assert.strictEqual(spyOnGetHierarchyPropertyTextLabelKey.called, true, "then property label key is set in core");
		assert.strictEqual(spyOnSetHierarchyPropertyTextLabelKey.calledWith(undefined), true, "then property label key is not changed");
		assert.strictEqual(spyOnSetText.called, false, "then api to set new label is not called");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
	});
	QUnit.test("When suggestions are triggered for hierarchy property label text", function(assert) {
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
		oRepHierarchyPropertyView.getController().handleChangeForLabelText();
		oRepHierarchyPropertyView.getController().handleSuggestions(oEvent);
		//assert
		assert.strictEqual(spyOnManageSuggestionTexts.calledOnce, true, "then suggestions are fetched from SuggestionTextHandler");
		assert.strictEqual(spyOnManageSuggestionTexts.calledWith(oEvent, oTranslationFormat), true, "then suggestions are fetched from SuggestionTextHandler for the correct event");
		//clean ups
		spyOnManageSuggestionTexts.restore();
	});
	QUnit.module("For a Representation with property type of hierarchical Property with display option key", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach();
				spyOnGetHierarchyPropertyTextLabelKey.restore();	
				spyOnGetRepresentationType.restore();
				spyOnGetHierarchyPropertyLabelDisplayOption.restore();
				spyOnGetRepresentationType = sinon.spy(oModelerInstance.firstHierarchicalStep.getRepresentations()[2], "getRepresentationType");
				spyOnGetHierarchyPropertyTextLabelKey = sinon.spy(oModelerInstance.firstHierarchicalStep.getRepresentations()[2], "getHierarchyPropertyTextLabelKey");
				spyOnGetHierarchyPropertyLabelDisplayOption = sinon.spy(oModelerInstance.firstHierarchicalStep.getRepresentations()[2], "getHierarchyPropertyLabelDisplayOption");
				sinon.stub(oModelerInstance.firstHierarchicalStep, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "hierarchicalproperty1", "hierarchicalproperty2" ],
						consumable : [ "hierarchicalproperty1", "hierarchicalproperty2" ]
					});
					return deferred.promise();
				});
				oRepHierarchyPropertyView = _instantiateView(oModelerInstance.firstHierarchicalStep.getRepresentations()[2], assert, oModelerInstance.firstHierarchicalStep);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When hierarchy Property view is initialized", function(assert) {
		_commonTestForSetDetailData(assert, "hierarchicalproperty1");
		assert.strictEqual(oRepHierarchyPropertyView.byId("idLabelDisplayOptionType").getSelectedKey(), "key", "then label display option for property is selected as key");
		assert.strictEqual(oRepHierarchyPropertyView.byId("idLabelDisplayOptionType").getItems()[0].getEnabled(), true, "display option type label key is enabled");
		assert.strictEqual(spyOnGetHierarchyPropertyLabelDisplayOption.calledOnce, true, "then GetHierarchyPropertyLabelDisplayOption is called for hierarchicalproperty1");
		assert.strictEqual(spyOnGetHierarchyPropertyLabelDisplayOption(), "key", "then GetHierarchyProperty LabelDisplayOption is text");
		assert.strictEqual(oRepHierarchyPropertyView.byId("idPropertyType").getSelectedKey(), "hierarchicalproperty1", "then value for property type is set as hierarchicalproperty1");
		assert.deepEqual(oRepHierarchyPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
		assert.strictEqual(oRepHierarchyPropertyView.byId("idPropertyType").getEnabled(), false, "then the hierarchy property dropdown is disabled");
	});
	QUnit.module("Not available in hierarchical properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.firstHierarchicalStep.getRepresentations()[0]);
				sinon.stub(oModelerInstance.firstHierarchicalStep, "getConsumablePropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "hierarchicalproperty2" ],
						consumable : [ "hierarchicalproperty2" ]
					});
					return deferred.promise();
				});
				oRepHierarchyPropertyView = _instantiateView(oModelerInstance.firstHierarchicalStep.getRepresentations()[0], assert, oModelerInstance.firstHierarchicalStep);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test("When already selected property is not available in metadata", function(assert) {
		//assume hierarchicalproperty1 is not available in metadata
		_commonTestForSetDetailData(assert, "hierarchicalproperty1");
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "Not Available: hierarchicalproperty1",
				"name" : "Not Available: hierarchicalproperty1"
			} ]
		};
		assert.strictEqual(oRepHierarchyPropertyView.byId("idPropertyType").getSelectedKey(), "Not Available: hierarchicalproperty1", "then value for property type is set as NotAvailable:property2");
		assert.deepEqual(oRepHierarchyPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
	QUnit.test("When already selected property is removed as a select property from step level", function(assert) {
		//assume hierarchicalproperty1 is removed as select property from step level
		_commonTestForSetDetailData(assert, "hierarchicalproperty1");
		oModelForPropertyType = {
			"Objects" : [ {
				"key" : "Not Available: hierarchicalproperty1",
				"name" : "Not Available: hierarchicalproperty1"
			} ]
		};
		assert.strictEqual(oRepHierarchyPropertyView.byId("idPropertyType").getSelectedKey(), "Not Available: hierarchicalproperty1", "then value for property type is set as NotAvailable:property2");
		assert.deepEqual(oRepHierarchyPropertyView.byId("idPropertyType").getModel().getData(), oModelForPropertyType, "then model for property type is set");
	});
}());