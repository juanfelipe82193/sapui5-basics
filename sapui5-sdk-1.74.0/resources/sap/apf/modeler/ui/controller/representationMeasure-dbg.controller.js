/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
sap.ui.define([
	"sap/apf/modeler/ui/controller/propertyType",
	"sap/apf/modeler/ui/utils/displayOptionsValueBuilder",
	"sap/apf/modeler/ui/utils/textManipulator",
	"sap/apf/core/constants"
], function(BaseController, DisplayOptionsValueBuilder, textManipulator, constants) {
	"use strict";
	/* BEGIN_COMPATIBILITY */
	DisplayOptionsValueBuilder = DisplayOptionsValueBuilder || sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder;
	/* END_COMPATIBILITY */
	var oTextManipulator = sap.apf.modeler.ui.utils.textManipulator;
	BaseController.extend("sap.apf.modeler.ui.controller.representationMeasure", {
		setLabelDisplayOptionTypeAsPromise : function(optionsValueModelBuilder){
			var oController = this;
			var sPropertyName = oController.getView().getViewData().oPropertyTypeData.sProperty;
			if (!oController.oRepresentationTypeHandler.isCombinationChart(oController.oRepresentation.getRepresentationType())) {
				if(oController.byId("idLabelDisplayOptionType")){
					oController.byId("idLabelDisplayOptionType").destroy();
					oController.byId("idPropertyTypeLayout").setSpan("L4 M4 S4");
					oController.oRepresentation.setMeasureDisplayOption(sPropertyName, undefined);
				}
			} else {
				var displayOptionsValueBuilder = new DisplayOptionsValueBuilder(oController.oTextReader, optionsValueModelBuilder);
				var oModelForDisplayOptions = displayOptionsValueBuilder.getMeasureDisplayOptions();
				oController.byId("idLabelDisplayOptionType").setModel(oModelForDisplayOptions);
				var measureOption = oController.oRepresentation.getMeasureDisplayOption(sPropertyName);
				if(!measureOption){
					var defaultOption = oController.getView().getViewData().oPropertyTypeData.bMandatory ? constants.representationMetadata.measureDisplayOptions.BAR : constants.representationMetadata.measureDisplayOptions.LINE;
					oController.byId("idLabelDisplayOptionType").setSelectedKey(defaultOption);
					oController.oRepresentation.setMeasureDisplayOption(sPropertyName, defaultOption);
				} else {
					oController.byId("idLabelDisplayOptionType").setSelectedKey(measureOption);
				}
			}
			return jQuery.Deferred().resolve();
		},
		changeLabelDisplayOption : function(newMeasureDisplayOption){
			var oController = this;
			var sPropertyName = oController.getView().getViewData().oPropertyTypeData.sProperty;
			oController.oRepresentation.setMeasureDisplayOption(sPropertyName, newMeasureDisplayOption);
		},
		getAllPropertiesAsPromise : function() {
			var oController = this, aAllProperties, sSelectedKey, aPropertiesWithSelectedKey, sAggRole, aMeasures = [];
			var oStep = oController.oStepPropertyMetadataHandler.oStep;
			var oConstants = sap.apf.modeler.ui.utils.CONSTANTS;
			var deferred = jQuery.Deferred();
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				oStep.getConsumablePropertiesForRepresentation(oController.oRepresentation.getId()).done(function(oResponse) {
					aAllProperties = oResponse.consumable;
					aAllProperties.forEach(function(sProperty) {
						if (oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)) {
							sAggRole = oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)["aggregation-role"];
							if (sAggRole === oConstants.aggregationRoles.MEASURE) {
								aMeasures.push(sProperty);
							}
						}
					});
					sSelectedKey = oController.getSelectedProperty();
					if (sSelectedKey !== undefined) {
						aPropertiesWithSelectedKey = aMeasures.indexOf(sSelectedKey) !== -1 ? aMeasures : aMeasures.concat(sSelectedKey);
						aMeasures = oResponse.available.indexOf(sSelectedKey) !== -1 ? aPropertiesWithSelectedKey : aMeasures.concat(oTextManipulator.addPrefixText([ sSelectedKey ], oController.oTextReader));
						sSelectedKey = oResponse.available.indexOf(sSelectedKey) !== -1 ? sSelectedKey : oTextManipulator.addPrefixText([ sSelectedKey ], oController.oTextReader)[0];
					}
					deferred.resolve({
						aAllProperties : aMeasures,
						sSelectedKey : sSelectedKey
					});
				});
			});
			return deferred.promise();
		},
		getPropertyTextLabelKey : function(sPropertyName) {
			var oController = this;
			return oController.oRepresentation.getMeasureTextLabelKey(sPropertyName);
		},
		updatePropertiesInConfiguration : function(aPropertiesInformation) {
			var oController = this;
			oController.oRepresentation.getMeasures().forEach(function(sMeasure) {
				oController.oRepresentation.removeMeasure(sMeasure);
			});
			aPropertiesInformation.forEach(function(oPropertiesInformation) {
				oController.oRepresentation.addMeasure(oPropertiesInformation.sProperty);
				oController.oRepresentation.setMeasureKind(oPropertiesInformation.sProperty, oPropertiesInformation.sKind);
				oController.oRepresentation.setMeasureTextLabelKey(oPropertiesInformation.sProperty, oPropertiesInformation.sTextLabelKey);
				oController.oRepresentation.setMeasureDisplayOption(oPropertiesInformation.sProperty, oPropertiesInformation.sMeasureDisplayOption);
			});
		},
		createNewPropertyInfoAsPromise : function(sNewProperty) {
			var oController = this, oNewPropertyInfo = {};
			oNewPropertyInfo.sProperty = sNewProperty;
			oNewPropertyInfo.sKind = oController.getView().getViewData().oPropertyTypeData.sContext;
			oNewPropertyInfo.sTextLabelKey = undefined;
			return sap.apf.utils.createPromise(oNewPropertyInfo);
		},
		/**
		 * Updates the configuration-representation object after a change on the input control for the property label.
		 * Implemented in subclasses, facade pattern mapping method names.
		 * @param {string} sPropertyName
		 * @param {string} sLabelTextKey
		 */
		setPropertyTextLabelKey : function(sPropertyName, sLabelTextKey) {
			var oController = this;
			oController.oRepresentation.setMeasureTextLabelKey(sPropertyName, sLabelTextKey);
		},
		setNextPropertyInParentObject : function() {
			var oController = this;
			oController.updateOfConfigurationObjectAsPromise().then(function() {
				oController.setDetailData();
			});
		},
		removePropertyFromParentObject : function() {
			var oController = this;
			oController.oRepresentation.removeMeasure(oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)));
		},
		addPropertyAsPromise : function() {
			var deferred = jQuery.Deferred();
			var oController = this, sAggRole, aMeasures = [];
			var oStep = oController.oStepPropertyMetadataHandler.oStep;
			var oConstants = sap.apf.modeler.ui.utils.CONSTANTS;
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				oStep.getConsumablePropertiesForRepresentation(oController.oRepresentation.getId()).done(function(oResponse) {
					oResponse.consumable.forEach(function(sProperty) {
						if (oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)) {
							sAggRole = oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)["aggregation-role"];
							if (sAggRole === oConstants.aggregationRoles.MEASURE) {
								aMeasures.push(sProperty);
							}
						}
					});
					oController.getView().fireEvent(oConstants.events.ADDPROPERTY, {
						"sProperty" : aMeasures[0],
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
