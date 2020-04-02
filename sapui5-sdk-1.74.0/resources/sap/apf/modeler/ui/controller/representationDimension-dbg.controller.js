/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define([
	'sap/apf/modeler/ui/utils/constants',
	"sap/apf/core/constants",
	"sap/apf/modeler/ui/controller/propertyType",
	"sap/apf/modeler/ui/utils/displayOptionsValueBuilder",
	"sap/apf/modeler/ui/utils/textManipulator",
	"sap/apf/modeler/ui/utils/propertyTypeOrchestration"
], function(ModelerConstants, constants, BaseController, DisplayOptionsValueBuilder, textManipulator, MPropertyTypeOrchestration) {
	"use strict";
	/* BEGIN_COMPATIBILITY */
	constants = constants || sap.apf.core.constants;
	DisplayOptionsValueBuilder = DisplayOptionsValueBuilder || sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder;
	/* END_COMPATIBILITY */
	var oRepnMetadataConstants = constants.representationMetadata;

	return BaseController.extend("sap.apf.modeler.ui.controller.representationDimension", {
		_apfName : "representationDimension",
		/**
		 * Sets the input field and its value help for display options (key, text, key + text).
		 * Sets the model which triggers re-render.
		 * @param optionsValueModelBuilder
		 * @returns {*}
		 */
		setLabelDisplayOptionTypeAsPromise : function(optionsValueModelBuilder) {
			var oController = this;
			// Note: oRepresentation is set in the parent class PropertyType and points to the representation configuration object
			// and not the representation.controller.
			var deferred = jQuery.Deferred();
			var aLabelDisplayOptionWithPrefix = [];
			var displayOptionsValueBuilder = new DisplayOptionsValueBuilder(oController.oTextReader, optionsValueModelBuilder);
			var oLabelDisplayOptions = constants.representationMetadata.labelDisplayOptions;
			var sPropertyName = textManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(ModelerConstants.texts.NOTAVAILABLE));
			var sLabelDisplayOption = oController.oRepresentation.getLabelDisplayOption(sPropertyName);
			var oModelForDisplayText = displayOptionsValueBuilder.getLabelDisplayOptions();
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {
				if ((sLabelDisplayOption === oLabelDisplayOptions.KEY_AND_TEXT || sLabelDisplayOption === oLabelDisplayOptions.TEXT) && !oController.oStepPropertyMetadataHandler.hasTextPropertyOfDimension(oEntityTypeMetadata, sPropertyName)) {
					oModelForDisplayText = displayOptionsValueBuilder.getValidatedLabelDisplayOptions();
					aLabelDisplayOptionWithPrefix = textManipulator.addPrefixText([ sLabelDisplayOption ], oController.oTextReader);
					sLabelDisplayOption = aLabelDisplayOptionWithPrefix[0];
				}
				oController.byId("idLabelDisplayOptionType").setModel(oModelForDisplayText);
				oController.byId("idLabelDisplayOptionType").setSelectedKey(sLabelDisplayOption);
				deferred.resolve();
			});
			return deferred.promise();
		},
		getAllPropertiesAsPromise : function() {
			var oController = this;
			var oStep = oController.oStepPropertyMetadataHandler.oStep;
			var deferred = jQuery.Deferred();
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				var aDimensions = [];
				oStep.getConsumablePropertiesForRepresentation(oController.oRepresentation.getId()).done(function(oResponse) {
					var aAllProperties = oResponse.consumable;
					aAllProperties.forEach(function(sProperty) {
						var sAggRole;
						if (oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)) {
							sAggRole = oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)["aggregation-role"];
							if (sAggRole === ModelerConstants.aggregationRoles.DIMENSION) {
								aDimensions.push(sProperty);
							}
						}
					});
					var sSelectedKey = oController.getSelectedProperty();
					deferred.resolve(MPropertyTypeOrchestration.getPropertyListAndSelectedKey(
						aDimensions, sSelectedKey, oController, oResponse, textManipulator.addPrefixText));
				});
			});
			return deferred.promise();
		},
		getPropertyTextLabelKey : function(sPropertyName) {
			var oController = this;
			return oController.oRepresentation.getDimensionTextLabelKey(sPropertyName);
		},
		removeProperties : function() {
			var oController = this;
			oController.getView().getViewData().oRepresentationHandler.getActualDimensions().forEach(function(sPropertyData) {
				oController.oRepresentation.removeDimension(sPropertyData.sProperty);
			});
		},
		/**
		 * Updates properties in the configuration object of type sap.apf.modeler.core.representation
		 * @param aPropertiesInformation
		 */
		updatePropertiesInConfiguration : function(aPropertiesInformation) {
			var oController = this;
			oController.removeProperties();
			aPropertiesInformation.forEach(function(oPropertiesInformation) {
				oController.oRepresentation.addDimension(oPropertiesInformation.sProperty);
				oController.oRepresentation.setDimensionKind(oPropertiesInformation.sProperty, oPropertiesInformation.sKind);
				oController.oRepresentation.setLabelDisplayOption(oPropertiesInformation.sProperty, oPropertiesInformation.sLabelDisplayOption);
				oController.oRepresentation.setDimensionTextLabelKey(oPropertiesInformation.sProperty, oPropertiesInformation.sTextLabelKey);
			});
		},
		createNewPropertyInfoAsPromise : function(sNewProperty) {
			var deferred = jQuery.Deferred();
			var oController = this,
				oNewPropertyInfo = {};
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				var bIsTextPropertyPresent = oController.oStepPropertyMetadataHandler.hasTextPropertyOfDimension(entityTypeMetadata, sNewProperty);
				oNewPropertyInfo.sProperty = sNewProperty;
				oNewPropertyInfo.sKind = oController.getView().getViewData().oPropertyTypeData.sContext;
				oNewPropertyInfo.sLabelDisplayOption = bIsTextPropertyPresent ? oRepnMetadataConstants.labelDisplayOptions.KEY_AND_TEXT : oRepnMetadataConstants.labelDisplayOptions.KEY;
				oNewPropertyInfo.sTextLabelKey = undefined;
				deferred.resolve(oNewPropertyInfo);
			});
			return deferred.promise();
		},
		setPropertyTextLabelKey : function(sPropertyName, sLabelTextKey) {
			var oController = this;
			oController.oRepresentation.setDimensionTextLabelKey(sPropertyName, sLabelTextKey);
		},
		setNextPropertyInParentObject : function() {
			var oController = this;
			oController.updateOfConfigurationObjectAsPromise().then(function() {
				oController.setDetailData();
			});
		},
		enableDisableLabelDisplayOptionTypeAsPromise : function() {
			var itemIndex, oController = this;
			var deferred = jQuery.Deferred();
			var displayLabelOptionBox = oController.byId("idLabelDisplayOptionType");
			var sPropertyName = textManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(ModelerConstants.texts.NOTAVAILABLE));
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				var bIsTextPropertyPresent = oController.oStepPropertyMetadataHandler.hasTextPropertyOfDimension(entityTypeMetadata, sPropertyName);
				if (sPropertyName === oController.oTextReader("none")) {
					displayLabelOptionBox.setEnabled(false);
					deferred.resolve();
				} else {
					displayLabelOptionBox.setEnabled(true);
					for(itemIndex = 0; itemIndex < displayLabelOptionBox.getItems().length; itemIndex++) {
						displayLabelOptionBox.getItems()[itemIndex].setEnabled(true);
						if (itemIndex > 0 && !bIsTextPropertyPresent) {
							displayLabelOptionBox.getItems()[itemIndex].setEnabled(false);
						}
					}
					deferred.resolve();
				}
			});
			return deferred.promise();
		},
		changeLabelDisplayOption : function(sLabelDisplayOption){
			var oController = this;
			var sProperty = textManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(ModelerConstants.texts.NOTAVAILABLE));
			oController.oRepresentation.setLabelDisplayOption(sProperty, sLabelDisplayOption);
		},
		removePropertyFromParentObject : function() {
			var oController = this;
			oController.oRepresentation.removeDimension(textManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(ModelerConstants.texts.NOTAVAILABLE)));
		},
		addPropertyAsPromise : function() {
			var deferred = jQuery.Deferred();
			var oController = this, sAggRole, aDimensions = [];
			var oStep = oController.oStepPropertyMetadataHandler.oStep;
			//var oPropertyTypeOrchestration = oController.getView().getViewData().oPropertyOrchestration;
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				oStep.getConsumablePropertiesForRepresentation(oController.oRepresentation.getId()).done(function(oResponse) {
					oResponse.consumable.forEach(function(sProperty) {
						if (oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)) {
							sAggRole = oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)["aggregation-role"];
							if (sAggRole === ModelerConstants.aggregationRoles.DIMENSION) {
								aDimensions.push(sProperty);
							}
						}
					});
					oController.getView().fireEvent(ModelerConstants.events.ADDPROPERTY, {
						"sProperty" : aDimensions[0],
						"sContext" : oController.getView().getViewData().oPropertyTypeData.sContext,
						"bMandatory" : oController.getView().getViewData().oPropertyTypeData.bMandatory
					});
					oController.oConfigurationEditor.setIsUnsaved();
					deferred.resolve();
				});
			});
			return deferred.promise();
		}
	});
});
