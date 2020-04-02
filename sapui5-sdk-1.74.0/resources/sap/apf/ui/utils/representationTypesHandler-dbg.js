/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/modeler/ui/utils/labelForRepresentationTypes",
	"sap/apf/modeler/ui/utils/constants",
	"sap/apf/core/representationTypes"
], function(LabelForRepresentationTypes, modelerUiConstants, fnRepresentationTypes){
	'use strict';
	var RepresentationTypesHandler = function() {
		this.aRepresentationTypes = jQuery.extend(true, [], fnRepresentationTypes());
	};
	function _getSupportedDimensionOrLegendKinds(oRepresentationTypesHandler, sRepresentationType, defaultCount) {
		var aSupportedDimensionKinds = [], nIndexOfRepnType, aSupportedKinds;
		nIndexOfRepnType = oRepresentationTypesHandler.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return aSupportedDimensionKinds;
		}
		aSupportedKinds = oRepresentationTypesHandler.aRepresentationTypes[nIndexOfRepnType].metadata.dimensions.supportedKinds;
		aSupportedKinds.forEach(function(oSupportedKind) {
			if (oSupportedKind.defaultCount === defaultCount) {
				aSupportedDimensionKinds.push(oSupportedKind.kind);
			}
		});
		return aSupportedDimensionKinds;
	}
	function _isTableRepresentationType(sRepresentationType) {
		if (sRepresentationType === "TableRepresentation") {
			return true;
		}
		return false;
	}
	function _isTreeTableRepresentationType(sRepresentationType) {
		if (sRepresentationType === "TreeTableRepresentation") {
			return true;
		}
		return false;
	}
	RepresentationTypesHandler.prototype.getLabelsForChartType = function(oTextReader, sRepresentationType, sKind) {
		var oLabelForRepresentationTypes = new LabelForRepresentationTypes(oTextReader);
		return oLabelForRepresentationTypes.getLabelsForChartType(sRepresentationType, sKind);
	};
	RepresentationTypesHandler.prototype.indexOfRepresentationType = function(sRepresentationType) {
		var nIndex;
		for(nIndex = 0; nIndex < this.aRepresentationTypes.length; nIndex++) {
			if (this.aRepresentationTypes[nIndex].id === sRepresentationType) {
				return nIndex;
			}
		}
		return -1;
	};
	RepresentationTypesHandler.prototype.getConstructorOfRepresentationType = function(sRepresentationType) {
		var nIndexOfRepnType = this.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return null;
		}
		return this.aRepresentationTypes[nIndexOfRepnType].constructor;
	};
	RepresentationTypesHandler.prototype.getPictureOfRepresentationType = function(sRepresentationType) {
		var nIndexOfRepnType = this.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return null;
		}
		return this.aRepresentationTypes[nIndexOfRepnType].picture;
	};
	RepresentationTypesHandler.prototype.getKindsForDimensionPropertyType = function(sRepresentationType) {
		return _getSupportedDimensionOrLegendKinds(this, sRepresentationType, 1);
	};
	RepresentationTypesHandler.prototype.getKindsForLegendPropertyType = function(sRepresentationType) {
		return _getSupportedDimensionOrLegendKinds(this, sRepresentationType, 0);
	};
	RepresentationTypesHandler.prototype.getKindsForMeasurePropertyType = function(sRepresentationType) {
		var nIndexOfRepnType, aSupportedKinds = [];
		nIndexOfRepnType = this.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return aSupportedKinds;
		}
		aSupportedKinds = this.aRepresentationTypes[nIndexOfRepnType].metadata.measures.supportedKinds.map(function(oSupportedKind) {
			return oSupportedKind.kind;
		});
		return aSupportedKinds;
	};
	RepresentationTypesHandler.prototype.getKindsForPropertyType = function(sRepresentationType) {
		var nIndexOfRepnType, aSupportedKinds = [];
		nIndexOfRepnType = this.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return aSupportedKinds;
		}
		if (this.aRepresentationTypes[nIndexOfRepnType].metadata.properties) {
			aSupportedKinds = this.aRepresentationTypes[nIndexOfRepnType].metadata.properties.supportedKinds.map(function(oSupportedKind) {
				return oSupportedKind.kind;
			});
		}
		return aSupportedKinds;
	};
	RepresentationTypesHandler.prototype.getKindsForHierarchicalPropertyType = function(sRepresentationType) {
		var nIndexOfRepnType, aSupportedKinds = [];
		nIndexOfRepnType = this.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return aSupportedKinds;
		}
		if (this.aRepresentationTypes[nIndexOfRepnType].metadata.hierarchicalColumn) {
			aSupportedKinds = this.aRepresentationTypes[nIndexOfRepnType].metadata.hierarchicalColumn.supportedKinds.map(function(oSupportedKind) {
				return oSupportedKind.kind;
			});
		}
		return aSupportedKinds;
	};
	RepresentationTypesHandler.prototype.isChartTypeSimilar = function(sFirstRepresentationType, sSecondRepresentationType) {
		var aSimilarChartTypes = modelerUiConstants.similarChartTypes;
		return (aSimilarChartTypes.indexOf(sFirstRepresentationType) !== -1) && (aSimilarChartTypes.indexOf(sSecondRepresentationType) !== -1);
	};
	RepresentationTypesHandler.prototype.isAdditionToBeEnabled = function(sRepresentationType, sPropertyType, sKind) {
		var bEnableAddition = false;
		var oPropertyTypes = modelerUiConstants.propertyTypes;
		var nIndexOfRepnType = this.indexOfRepresentationType(sRepresentationType);
		if (nIndexOfRepnType === -1) {
			return bEnableAddition;
		}
		if (sPropertyType === oPropertyTypes.PROPERTY) {
			if (_isTableRepresentationType(sRepresentationType) || _isTreeTableRepresentationType(sRepresentationType)) {
				bEnableAddition = true;
			}
			return bEnableAddition;
		}
		if (sPropertyType === oPropertyTypes.LEGEND) {
			sPropertyType = oPropertyTypes.DIMENSION;
		}
		this.aRepresentationTypes[nIndexOfRepnType].metadata[sPropertyType].supportedKinds.forEach(function(oSupportedKind) {
			if (sKind === oSupportedKind.kind && oSupportedKind.max === "*") {
				bEnableAddition = true;
			}
		});
		return bEnableAddition;
	};
	RepresentationTypesHandler.prototype.isCombinationChart = function(sChartType) {
		var nIndexOfRepnType = this.indexOfRepresentationType(sChartType);
		if (nIndexOfRepnType === -1) {
			return false;
		}
		if(this.aRepresentationTypes[nIndexOfRepnType].isCombinationChart){
			return true;
		}
		return false;
	};
	RepresentationTypesHandler.prototype.getDefaultCountForRepresentationKind = function(sChartType, sKind){
		var nIndexOfRepnType = this.indexOfRepresentationType(sChartType);
		if (nIndexOfRepnType === -1) {
			return 0;
		}
		var representationTypeMetadata = this.aRepresentationTypes[nIndexOfRepnType].metadata;
		for(var axisType in representationTypeMetadata){
			for(var i = 0; i < representationTypeMetadata[axisType].supportedKinds.length; i++) {
				var possibleKind = representationTypeMetadata[axisType].supportedKinds[i];
				if(possibleKind.kind === sKind){
					return possibleKind.defaultCount;
				}
			}
		}
		return 0;
	};
	return RepresentationTypesHandler;
});