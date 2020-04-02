/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/modeler/ui/utils/constants"
], function(modelerUiConstants){
	'use strict';
	var StepPropertyMetadataHandler = function(oCoreApi, oStep) {
		this.oCoreApi = oCoreApi;
		this.oStep = oStep;
	};
	function _filterPropertiesByAggRole(entityTypeMetadata, oStepPropertyMetadataHandler, sAggRoleToBeFiltered) {
		var aProperties = [], sAggRole;
		var aSelectProperties = oStepPropertyMetadataHandler.oStep.getSelectProperties();
		aSelectProperties.forEach(function(sProperty) {
			if (oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)) {
				sAggRole = oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty)["aggregation-role"];
				if (sAggRole === sAggRoleToBeFiltered) {
					aProperties.push(sProperty);
				}
			}
		});
		return aProperties;
	}
	StepPropertyMetadataHandler.prototype.getEntityTypeMetadataAsPromise = function() {
		var sAbsolutePathToServiceDocument = this.oStep.getService();
		var sEntitySet = this.oStep.getEntitySet();
		return this.oCoreApi.getEntityTypeMetadataAsPromise(sAbsolutePathToServiceDocument, sEntitySet);
	};
	StepPropertyMetadataHandler.prototype.getFilterMappingEntityTypeMetadataAsPromise = function(sAbsolutePathToServiceDocument, sEntitySet) {
		return this.oCoreApi.getEntityTypeMetadataAsPromise(sAbsolutePathToServiceDocument, sEntitySet);
	};
	StepPropertyMetadataHandler.prototype.getDimensionsProperties = function(entityTypeMetadata) {
		return _filterPropertiesByAggRole(entityTypeMetadata, this, modelerUiConstants.aggregationRoles.DIMENSION);
	};
	StepPropertyMetadataHandler.prototype.getMeasures = function(entityTypeMetadata) {
		return _filterPropertiesByAggRole(entityTypeMetadata, this, modelerUiConstants.aggregationRoles.MEASURE);
	};
	StepPropertyMetadataHandler.prototype.getProperties = function() {
		return this.oStep.getSelectProperties();
	};
	StepPropertyMetadataHandler.prototype.getHierarchicalProperty = function() {
		return this.oStep.getHierarchyProperty();
	};
	StepPropertyMetadataHandler.prototype.getPropertyMetadata = function(entityTypeMetadata, sProperty) {
		if (!entityTypeMetadata) {
			return undefined;
		}
		return entityTypeMetadata.getPropertyMetadata(sProperty);
	};
	StepPropertyMetadataHandler.prototype.getDefaultLabel = function(entityTypeMetadata, sProperty) {
		var oStepPropertyMetadataHandler = this;
		var oPropertyMetadata = oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty);
		if (!oPropertyMetadata) {
			return "";
		}
		return oPropertyMetadata.label || oPropertyMetadata.name;
	};
	StepPropertyMetadataHandler.prototype.hasTextPropertyOfDimension = function(entityTypeMetadata, dimension) {
		var isPresent = false, aSelectProperties, oStepPropertyMetadataHandler = this;
		var oDimensionMetadata = oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, dimension);
		if (!oDimensionMetadata) {
			return isPresent;
		}
		if (oDimensionMetadata.text) {
			aSelectProperties = this.oStep.getSelectProperties();
			isPresent = aSelectProperties.indexOf(oDimensionMetadata.text) === -1 ? false : true;
		}
		return isPresent;
	};
	StepPropertyMetadataHandler.prototype.getRepresentationTypesArray = function() {
		var aValidRepresentationTypes = [], oStepPropMetadaHandler = this;
		if (oStepPropMetadaHandler.oStep.getType() === "hierarchicalStep") {
			aValidRepresentationTypes.push({
				key : "TreeTableRepresentation",
				name : oStepPropMetadaHandler.oCoreApi.getText("TreeTableRepresentation")
			});
		} else {
			oStepPropMetadaHandler.oCoreApi.getRepresentationTypes().forEach(function(oRepresentationType) {
				if (oRepresentationType.metadata) {
					if (oRepresentationType.id !== "TreeTableRepresentation") {
						aValidRepresentationTypes.push({
							key : oRepresentationType.id,
							name : oStepPropMetadaHandler.oCoreApi.getText(oRepresentationType.label.key)
						});
					}
				}
			});
		}
		return aValidRepresentationTypes;
	};
	StepPropertyMetadataHandler.prototype.getStepType = function() {
		return this.oStep.getType();
	};
	sap.apf.modeler.ui.utils.StepPropertyMetadataHandler = StepPropertyMetadataHandler;
	return StepPropertyMetadataHandler;
}, true /*GLOBAL_EXPORT*/);