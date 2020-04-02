/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(function(){
	'use strict';
	var representationHandler = function(oRepresentation, oRepresentationTypeHandler, oTextReader) {
		this.oRepresentation = oRepresentation;
		this.oRepresentationTypeHandler = oRepresentationTypeHandler;
		this.oTextReader = oTextReader;
	};
	function getKindDefinition(aKindDefinitions, sKind){
		var oKindDefinition;
		aKindDefinitions.forEach(function(oKind){
			if(oKind.kind === sKind){
				oKindDefinition = oKind;
			}
		});
		return oKindDefinition;
	}
	function _formPropertiesToBeCreated(aAggregationRoleKinds, aSupportedPropertiesKinds, aAllProperties, sMethodNametoFetchKind, oTextReader) {
		var aPropertiesToBeCreated = [], bKindSet;
		aSupportedPropertiesKinds.forEach(function(sKind) {
			var oKindDefinition = getKindDefinition(aAggregationRoleKinds, sKind);
			var numberOfMandatoryFields = oKindDefinition.min;
			bKindSet = false;
			aAllProperties.forEach(function(sProperty) {
				if (sMethodNametoFetchKind === undefined || (sMethodNametoFetchKind && sMethodNametoFetchKind(sProperty) === sKind)) {
					aPropertiesToBeCreated.push({
						sProperty : sProperty,
						sContext : sKind,
						bMandatory : numberOfMandatoryFields > 0 ? true : false
					});
					bKindSet = true;
					numberOfMandatoryFields--;
				}
			});
			while (!bKindSet || numberOfMandatoryFields > 0) { // if either no Property has been assigned at all, or not enough properties to fill the mandatory fields
				var sDefaultPropertyValue = numberOfMandatoryFields > 0 ? "" : oTextReader("none");
				aPropertiesToBeCreated.push({
					sProperty : sDefaultPropertyValue,
					sContext : sKind,
					bMandatory : numberOfMandatoryFields > 0 ? true : false
				});
				bKindSet = true;
				numberOfMandatoryFields--;
			}
		});
		return aPropertiesToBeCreated;
	}
	function _findRepresentation(aRepTypes, sRepTypeId){
		var result;
		aRepTypes.forEach(function(repType){
			if (repType["id"] === sRepTypeId){
				result = repType;
			}
		});
		return result;
	}
	representationHandler.prototype.formPropertiesToBeCreated = function(aAggregationRoleKinds, aSupportedPropertiesKinds, aAllProperties, sMethodNametoFetchKind){
		return _formPropertiesToBeCreated(aAggregationRoleKinds, aSupportedPropertiesKinds, aAllProperties, sMethodNametoFetchKind, this.oTextReader);
	};
	representationHandler.prototype.getActualDimensions = function() {
		var sRepresentationType = this.oRepresentation.getRepresentationType();
		var oRepresentationType = _findRepresentation(this.oRepresentationTypeHandler.aRepresentationTypes, sRepresentationType);
		var aAllDimensions = this.oRepresentation.getDimensions();
		var aSupportedDimensionKinds = this.oRepresentationTypeHandler.getKindsForDimensionPropertyType(sRepresentationType);
		return this.formPropertiesToBeCreated(oRepresentationType.metadata.dimensions.supportedKinds, aSupportedDimensionKinds, aAllDimensions, this.oRepresentation.getDimensionKind);
	};
	representationHandler.prototype.getActualLegends = function() {
		var sRepresentationType = this.oRepresentation.getRepresentationType();
		var oRepresentationType = _findRepresentation(this.oRepresentationTypeHandler.aRepresentationTypes, sRepresentationType);
		var aAllDimensions = this.oRepresentation.getDimensions();
		var aSupportedLegendKinds = this.oRepresentationTypeHandler.getKindsForLegendPropertyType(sRepresentationType);
		return this.formPropertiesToBeCreated(oRepresentationType.metadata.dimensions.supportedKinds, aSupportedLegendKinds, aAllDimensions, this.oRepresentation.getDimensionKind);
	};
	representationHandler.prototype.getActualMeasures = function() {
		var sRepresentationType = this.oRepresentation.getRepresentationType();
		var oRepresentationType = _findRepresentation(this.oRepresentationTypeHandler.aRepresentationTypes, sRepresentationType);
		var aAllMeasures = this.oRepresentation.getMeasures();
		var aSupportedMeasureKinds = this.oRepresentationTypeHandler.getKindsForMeasurePropertyType(sRepresentationType);
		return this.formPropertiesToBeCreated(oRepresentationType.metadata.measures.supportedKinds, aSupportedMeasureKinds, aAllMeasures, this.oRepresentation.getMeasureKind);
	};
	representationHandler.prototype.getActualProperties = function() {
		var sRepresentationType = this.oRepresentation.getRepresentationType();
		var oRepresentationType = _findRepresentation(this.oRepresentationTypeHandler.aRepresentationTypes, sRepresentationType);
		var aAllProperties = this.oRepresentation.getProperties();
		var aSupportedPropertyKind = this.oRepresentationTypeHandler.getKindsForPropertyType(sRepresentationType);
		return this.formPropertiesToBeCreated(oRepresentationType.metadata.properties.supportedKinds, aSupportedPropertyKind, aAllProperties, this.oRepresentation.getPropertyKind);
	};
	representationHandler.prototype.getHierarchicalProperty = function() {
		var sRepresentationType = this.oRepresentation.getRepresentationType();
		var oRepresentationType = _findRepresentation(this.oRepresentationTypeHandler.aRepresentationTypes, sRepresentationType);
		var aAllProperties = [];
		aAllProperties.push(this.oRepresentation.getHierarchyProperty());
		var aSupportedPropertyKind = this.oRepresentationTypeHandler.getKindsForHierarchicalPropertyType(sRepresentationType);
		return this.formPropertiesToBeCreated(oRepresentationType.metadata.hierarchicalColumn.supportedKinds, aSupportedPropertyKind, aAllProperties, undefined);
	};
	return representationHandler;
}, true /* GLOBAL_EXPORT*/ );