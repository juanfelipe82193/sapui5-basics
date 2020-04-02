/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
/*global sap*/

sap.ui.define([
	"sap/apf/modeler/ui/controller/representationDimension.controller",
	"sap/apf/modeler/ui/utils/textManipulator"
], function(BaseController, textManipulator) {
	"use strict";
	return BaseController.extend("sap.apf.modeler.ui.controller.representationLegend", {
		getAllPropertiesAsPromise : function() {
			var oController = this, aAllProperties, sSelectedKey, aPropertiesWithSelectedKey, sAggRole, aDimensions = [];
			var oStep = oController.oStepPropertyMetadataHandler.oStep;
			var oConstants = sap.apf.modeler.ui.utils.CONSTANTS;
			var deferred = jQuery.Deferred();
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				oStep.getConsumablePropertiesForRepresentation(oController.oRepresentation.getId()).done(function(oResponse) {
					aAllProperties = oResponse.consumable;
					aAllProperties.forEach(function(sProperty) {
						if (oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)) {
							sAggRole = oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)["aggregation-role"];
							if (sAggRole === oConstants.aggregationRoles.DIMENSION) {
								aDimensions.push(sProperty);
							}
						}
					});
					sSelectedKey = oController.getSelectedProperty();
					if (sSelectedKey !== oController.oTextReader("none") && sSelectedKey !== undefined) {
						aPropertiesWithSelectedKey = aDimensions.indexOf(sSelectedKey) !== -1 ? aDimensions : aDimensions.concat(sSelectedKey);
						aDimensions = oResponse.available.indexOf(sSelectedKey) !== -1 ? aPropertiesWithSelectedKey : aDimensions.concat(textManipulator.addPrefixText([ sSelectedKey ], oController.oTextReader));
						sSelectedKey = oResponse.available.indexOf(sSelectedKey) !== -1 ? sSelectedKey : textManipulator.addPrefixText([ sSelectedKey ], oController.oTextReader)[0];
					}
					aDimensions.splice(0, 0, oController.oTextReader("none"));
					deferred.resolve({
						aAllProperties : aDimensions,
						sSelectedKey : sSelectedKey
					});
				});
			});
			return deferred.promise();
		},
		removeProperties : function() {
			var oController = this;
			oController.getView().getViewData().oRepresentationHandler.getActualLegends().forEach(function(sPropertyData) {
				oController.oRepresentation.removeDimension(sPropertyData.sProperty);
			});
		},
		enableDisableLabelDisplayOptionTypeAsPromise : function() {
			var deferred = jQuery.Deferred();
			var itemIndex, oController = this;
			var displayLabelOptionBox = oController.byId("idLabelDisplayOptionType");
			var sPropertyName = textManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				var bIsTextPropertyPresent = oController.oStepPropertyMetadataHandler.hasTextPropertyOfDimension(entityTypeMetadata, sPropertyName);
				if (sPropertyName === oController.oTextReader("none")) {
					displayLabelOptionBox.setEnabled(false);
					deferred.resolve();
					return;
				}
				displayLabelOptionBox.setEnabled(true);
				for(itemIndex = 0; itemIndex < displayLabelOptionBox.getItems().length; itemIndex++) {
					displayLabelOptionBox.getItems()[itemIndex].setEnabled(true);
					if (itemIndex > 0 && !bIsTextPropertyPresent) {
						displayLabelOptionBox.getItems()[itemIndex].setEnabled(false);
					}
				}
				deferred.resolve();
			});
			return deferred.promise();
		},
		addPropertyAsPromise : function() {
			var deferred = jQuery.Deferred();
			var oController = this, sAggRole, aDimensions = [];
			var oStep = oController.oStepPropertyMetadataHandler.oStep;
			var oConstants = sap.apf.modeler.ui.utils.CONSTANTS;
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				oStep.getConsumablePropertiesForRepresentation(oController.oRepresentation.getId()).done(function(oResponse) {
					oResponse.consumable.forEach(function(sProperty) {
						if (oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)) {
							sAggRole = oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)["aggregation-role"];
							if (sAggRole === oConstants.aggregationRoles.DIMENSION) {
								aDimensions.push(sProperty);
							}
						}
					});
					oController.getView().fireEvent(oConstants.events.ADDPROPERTY, {
						"sProperty" : aDimensions[0],
						"sContext" : oController.getView().getViewData().oPropertyTypeData.sContext
					});
					oController.oConfigurationEditor.setIsUnsaved();
					deferred.resolve();
				});
			});
			return deferred.promise();
		}
	});
});
