/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require("sap.apf.modeler.ui.controller.requestOptions");
jQuery.sap.require("sap.apf.modeler.ui.utils.displayOptionsValueBuilder");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
(function() {
	"use strict";
	var nullObjectChecker = sap.apf.modeler.ui.utils.nullObjectChecker;
	var textManipulator = sap.apf.modeler.ui.utils.textManipulator;
	var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.STEPFILTERPROPERTY_LABEL;

	function _setDisplayTextForFilterMappingTargetPropertyLabel(oController) {
		var oTextReader = oController.getView().getViewData().oTextReader;
		var sTextForLabel = oController.oParentObject.getFilterMappingTargetPropertyLabelKey() ? oTextReader("label") : oTextReader("label") + " (" + oTextReader("default") + ")";
		oController.byId("idOptionalSelectedPropertyLabel").setText(sTextForLabel);
		oController.byId("idOptionalSelectedPropertyLabel").setTooltip(sTextForLabel);
	}
	function _setFilterMappingTargetPropertyLabelText(oController) {
		var sSource = oController.getSource();
		var sEntitySet = oController.getEntity();
		var sPropertyLabelText;
		var sPropertyLabelKey = oController.oParentObject.getFilterMappingTargetPropertyLabelKey();
		if (sSource === undefined || sEntitySet === undefined){
			return;
		}
		if (nullObjectChecker.checkIsNotUndefined(sPropertyLabelKey)) {
			sPropertyLabelText = oController.getView().getViewData().oConfigurationHandler.getTextPool().get(sPropertyLabelKey).TextElementDescription;
			oController.byId("idOptionalSelectedPropertyLabelText").setValue(sPropertyLabelText);
			return;
		}
		oController.oStepPropertyMetadataHandler.getFilterMappingEntityTypeMetadataAsPromise(sSource, sEntitySet).done(function(entityTypeMetadata) {
			var sPropertyName = oController.oParentObject.getFilterMappingTargetProperties()[0];
			if (sPropertyName) {
				sPropertyLabelText = oController.oStepPropertyMetadataHandler.getDefaultLabel(entityTypeMetadata, sPropertyName);
			}
			oController.byId("idOptionalSelectedPropertyLabelText").setValue(sPropertyLabelText);
		});
	}
	function _setMarginToFilterProperty(oController) {
		oController.byId("idOptionalRequestFieldLabel").addStyleClass("filterPropertyLable");
		oController.byId("idOptionalRequestField").addStyleClass("filterProperty");
		oController.byId("idOptionalLabelDisplayOptionType").addStyleClass("filterProperty");
	}
	sap.apf.modeler.ui.controller.requestOptions.extend("sap.apf.modeler.ui.controller.stepFilterMapping", {
		setLabelDisplayOptionTypeAsPromise : function(optionsValueModelBuilder) {
			var deferred = jQuery.Deferred();
			var oController = this;
			var sSource = oController.getSource();
			var sEntitySet = oController.getEntity();
			var aLabelDisplayOptionWithPrefix = [];
			var oTextReader = oController.getView().getViewData().oTextReader;
			var displayOptionsValueBuilder = new sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder(oTextReader, optionsValueModelBuilder);
			var oModelForDisplayText = displayOptionsValueBuilder.getLabelDisplayOptions();
			var oLabelDisplayOptions = sap.apf.core.constants.representationMetadata.labelDisplayOptions;
			var sPropertyName = textManipulator.removePrefixText(oController.byId("idOptionalRequestField").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			_setDisplayTextForFilterMappingTargetPropertyLabel(oController);
			_setFilterMappingTargetPropertyLabelText(oController);
			oController.byId("idOptionalLabelDisplayOptionType").setEnabled(true);
			if (!sPropertyName) {
				oController.byId("idOptionalLabelDisplayOptionType").setModel(oModelForDisplayText);
				oController.byId("idOptionalLabelDisplayOptionType").setEnabled(false);
				return deferred.promise();
			}
			var sLabelDisplayOption = oController.oParentObject.getFilterMappingTargetPropertyLabelDisplayOption();
			oController.oStepPropertyMetadataHandler.getFilterMappingEntityTypeMetadataAsPromise(sSource, sEntitySet).done(function(oEntityTypeMetadata) {
				if ((sLabelDisplayOption === oLabelDisplayOptions.KEY_AND_TEXT || sLabelDisplayOption === oLabelDisplayOptions.TEXT) && !oEntityTypeMetadata.getPropertyMetadata(sPropertyName).text){
					oModelForDisplayText = displayOptionsValueBuilder.getValidatedLabelDisplayOptions(); //populate text with "not available"
					aLabelDisplayOptionWithPrefix = textManipulator.addPrefixText([ sLabelDisplayOption ], oTextReader);
					sLabelDisplayOption = aLabelDisplayOptionWithPrefix[0]; 
				}
				oController.byId("idOptionalLabelDisplayOptionType").setModel(oModelForDisplayText);
				oController.byId("idOptionalLabelDisplayOptionType").setSelectedKey(sLabelDisplayOption);
				deferred.resolve();
			});
			return deferred.promise();
		},
		enableDisableLabelDisplayOptionTypeAsPromise : function() {
			var oController = this;
			var sSource = oController.getSource();
			var sEntitySet = oController.getEntity();
			var deferred = jQuery.Deferred();
			var oTextReader = oController.getView().getViewData().oTextReader;
			var oDisplayLabelOption = oController.byId("idOptionalLabelDisplayOptionType");
			var sPropertyName = textManipulator.removePrefixText(oController.byId("idOptionalRequestField").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			oController.oStepPropertyMetadataHandler.getFilterMappingEntityTypeMetadataAsPromise(sSource, sEntitySet).done(function(entityTypeMetadata) {
				var bIsTextPropertyPresent = entityTypeMetadata.getPropertyMetadata(sPropertyName).text;
				oDisplayLabelOption.getItems().forEach(function(item){
					item.setEnabled(true);
					if (item.getKey() !== "key" && !bIsTextPropertyPresent) {
						item.setEnabled(false);
					}
				});
				deferred.resolve();
			});
			return deferred.promise();
		},
		changeLabelDisplayOption : function(sLabelDisplayOption) {
			var oController = this;
			oController.oParentObject.setFilterMappingTargetPropertyLabelDisplayOption(sLabelDisplayOption);
		},
		changeOptionalSelectedPropertyLabelText : function(sLabelText) {
			var oController = this;
			if (sLabelText.trim().length === 0) {
				oController.oParentObject.setFilterMappingTargetPropertyLabelKey(undefined);
				_setDisplayTextForFilterMappingTargetPropertyLabel(oController);
				_setFilterMappingTargetPropertyLabelText(oController);
				return;
			}
			oController.getView().getViewData().oConfigurationHandler.getTextPool().setTextAsPromise(sLabelText, oTranslationFormat).done(function(sLabelTextKey) {
				oController.oParentObject.setFilterMappingTargetPropertyLabelKey(sLabelTextKey);
				_setDisplayTextForFilterMappingTargetPropertyLabel(oController);
				_setFilterMappingTargetPropertyLabelText(oController);
			});
		},
		// Hide multicombox for target filter properties and insert select box instead
		onBeforeRendering : function() {
			var oController = this;
			oController.byId("idSelectPropertiesLabel").setVisible(false);
			oController.byId("idSelectProperties").setVisible(false);
			oController.byId("idOptionalRequestFieldLabel").setVisible(true);
			oController.byId("idOptionalRequestField").setVisible(true);
			oController.byId("idOptionalLabelDisplayOptionType").setVisible(true);
			oController.byId("idOptionalRequestField").setForceSelection(false);
			oController.byId("idOptionalSelectedPropertyLabel").setVisible(true);
			oController.byId("idOptionalSelectedPropertyLabelText").setVisible(true);
		},
		onAfterRendering : function() {
			_setMarginToFilterProperty(this);
		},
		getIdOfPropertiesControl : function() {
			return "idOptionalRequestField";
		},
		getIdOfPropertyLabel : function() {
			return "idOptionalRequestFieldLabel";
		},
		setSelectedKeysForProperties : function(aProperties) {
			var oController = this;
			//If we give undefined or [] as selectedkey, previous selected key is retained.So clearSelection is required. 
			if (aProperties.length !== 0) {
				oController.byId("idOptionalRequestField").setSelectedKey(aProperties[0]);
			} else {
				oController.byId("idOptionalRequestField").clearSelection();
			}
		},
		getSelectedKeysForProperties : function() {
			var oController = this, sSelectedKey, aSelectedKey;
			var oTextReader = oController.getView().getViewData().oTextReader;
			sSelectedKey = textManipulator.removePrefixText(oController.byId("idOptionalRequestField").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			aSelectedKey = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSelectedKey) ? [ sSelectedKey ] : [];
			return aSelectedKey;
		},
		setDisplayText : function() {
			var oController = this;
			var oTextReader = oController.getView().getViewData().oTextReader;
			oController.byId("idSourceLabel").setText(oTextReader("source"));
			oController.byId("idEntityLabel").setText(oTextReader("entity"));
			oController.byId("idOptionalRequestFieldLabel").setText(oTextReader("targetProperty"));
		},
		resetEntityAndProperties : function() {
			var oController = this;
			oController.clearEntity();
			oController.byId("idEntity").setModel(null);
			oController.byId("idEntity").setSelectedKey(undefined);
			oController.clearSelectProperties();
			oController.byId("idOptionalRequestField").setModel(null);
			oController.byId("idOptionalRequestField").setSelectedKey(undefined);
		},
		resetFilterMappingFields : function() {
			var oController = this;
			oController.clearSource();
			oController.byId("idSource").setValue("");
			oController.resetEntityAndProperties();
			oController.addOrRemoveMandatoryFieldsAndRequiredFlag(false);
		},
		updateFilterMappingFields : function() {
			var oController = this, sSource, sEntity, sEntitySet, sSelectProperty, aSelectProperties;
			var oTextReader = oController.getView().getViewData().oTextReader;
			sSource = oController.byId("idSource").getValue().trim();
			oController.oConfigurationEditor.setIsUnsaved();
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSource)) {
				oController.getAllEntitiesAsPromise(sSource).done(function(entities){
					if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(entities)) {
						oController.resetEntityAndProperties();
						return;
					}
					oController.setDetailData();
					//set entity
					sEntity = textManipulator.removePrefixText(oController.byId("idEntity").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
					sEntitySet = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sEntity) ? sEntity : undefined;
					oController.updateEntity(sEntitySet);
					//set properties
					sSelectProperty = textManipulator.removePrefixText(oController.byId("idOptionalRequestField").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
					aSelectProperties = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSelectProperty) ? [ sSelectProperty ] : [];
					oController.updateSelectProperties(aSelectProperties);
				});
			}
		},
		getSource : function() {
			var oController = this;
			return oController.oParentObject.getFilterMappingService();
		},
		getAllEntitiesAsPromise : function(sSource) {
			var oController = this;
			return oController.oConfigurationEditor.getAllEntitySetsOfServiceWithGivenPropertiesAsPromise(sSource, oController.oParentObject.getFilterProperties());
		},
		getEntity : function() {
			var oController = this;
			return oController.oParentObject.getFilterMappingEntitySet();
		},
		getAllEntitySetPropertiesAsPromise : function(sSource, sEntitySet) {
			var oController = this;
			return oController.oConfigurationEditor.getAllPropertiesOfEntitySetAsPromise(sSource, sEntitySet);
		},
		clearSource : function() {
			var oController = this;
			oController.oParentObject.setFilterMappingService(undefined);
			oController.clearEntity();
		},
		clearEntity : function() {
			var oController = this;
			oController.oParentObject.setFilterMappingEntitySet(undefined);
			oController.clearSelectProperties();
		},
		clearSelectProperties : function() {
			var oController = this;
			var aOldSelProp = oController.oParentObject.getFilterMappingTargetProperties();
			aOldSelProp.forEach(function(property) {
				oController.oParentObject.removeFilterMappingTargetProperty(property);
			});
			oController.byId("idOptionalSelectedPropertyLabelText").setValue("");
		},
		removeSelectProperties : function(aProperties) {
			var oController = this;
			aProperties.forEach(function(property) {
				oController.oParentObject.removeFilterMappingTargetProperty(property);
			});
		},
		updateSource : function(sSource) {
			var oController = this;
			oController.oParentObject.setFilterMappingService(sSource);
		},
		updateEntity : function(sEntity) {
			var oController = this;
			oController.oParentObject.setFilterMappingEntitySet(sEntity);
		},
		updateSelectProperties : function(aSelectProperties) {
			var oController = this;
			oController.removeSelectProperties(oController.oParentObject.getFilterMappingTargetProperties());
			aSelectProperties.forEach(function(property) {
				oController.oParentObject.addFilterMappingTargetProperty(property);
			});
		},
		updateOptionalRequestFieldProperty : function(aFilterProperties) {
			var oController = this;
			oController.updateSelectProperties(aFilterProperties);
		},
		getSelectProperties : function() {
			var oController = this;
			return oController.oParentObject.getFilterMappingTargetProperties();
		},
		getValidationState : function() {
			var oController = this;
			return oController.viewValidator.getValidationState();
		}
	});
}());