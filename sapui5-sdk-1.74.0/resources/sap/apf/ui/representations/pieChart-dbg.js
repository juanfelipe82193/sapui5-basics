/*!
* SAP APF Analysis Path Framework
*
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
sap.ui.define([
'sap/apf/ui/representations/BaseVizFrameChartRepresentation',
'sap/apf/core/constants',
'sap/apf/ui/utils/constants'], function(BaseVizFrameChartRepresentation, coreConstants, utilsConstants){

/**
 * @class pieChart constructor.
* @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
* @returns chart object
 */
	"use strict";
	    function PieChart(oApi, oParameters) {
		BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = utilsConstants.representationTypes.PIE_CHART;
		this.chartType = utilsConstants.vizFrameChartTypes.PIE;
		this._addDefaultKind();
	};
	PieChart.prototype = Object.create(BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to pieChart
	PieChart.prototype.constructor = PieChart;
	/**
	* @private 
	 * @method _addDefaultKind
	* @description reads the oParameters for chart and modifies it by including a default kind
	 * in case the "kind" property is not defined in dimension/measures
	*/
	PieChart.prototype._addDefaultKind = function() {
		this.parameter.measures.forEach(function(measure) {
			if (measure.kind === undefined) {//handle the scenario where the kind is not available
				measure.kind = coreConstants.representationMetadata.kind.SECTORSIZE;
			}
		});
		this.parameter.dimensions.forEach(function(dimension) {
			if (dimension.kind === undefined) {//handle the scenario where the kind is not available
				dimension.kind = coreConstants.representationMetadata.kind.SECTORCOLOR;
			}
		});
	};
	PieChart.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = coreConstants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.SECTORCOLOR:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.COLOR;
				break;
			case oSupportedTypes.SECTORSIZE:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.SIZE;
				break;
			default:
				break;
		}
		return axisfeedItemId;
	};
	/*BEGIN_COMPATIBILITY*/
	sap.apf.ui.representations.pieChart = PieChart;
	/*END_COMPATIBILITY*/
	return PieChart;
}, true /*Global_Export*/);