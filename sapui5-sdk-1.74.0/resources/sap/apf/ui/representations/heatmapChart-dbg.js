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
 * @class heatMapChart constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
	"use strict";
	function HeatmapChart(oApi, oParameters) {
		BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = utilsConstants.representationTypes.HEATMAP_CHART;
		this.chartType = utilsConstants.vizFrameChartTypes.HEATMAP;
		this._addDefaultKind();
	}
	HeatmapChart.prototype = Object.create(BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to heatMapChart
	HeatmapChart.prototype.constructor = HeatmapChart;
	/**
	 * @private
	 * @method _addDefaultKind
	 * @description reads the oParameters for chart and modifies it by including a default feedItem id 
	 * in case the "kind" property is not defined in dimension/measures
	 * it adds kind only for minimum required parameters
	 */
	HeatmapChart.prototype._addDefaultKind = function() {
		this.parameter.measures.forEach(function(measure) {
			if (measure.kind === undefined) {//handle the scenario where the kind is not available
				measure.kind = coreConstants.representationMetadata.kind.SECTORCOLOR;
			}
		});
		this.parameter.dimensions.forEach(function(dimension, index) {
			if (dimension.kind === undefined) {//handle the scenario where the kind is not available
				dimension.kind = index === 0 ? coreConstants.representationMetadata.kind.XAXIS : coreConstants.representationMetadata.kind.XAXIS2;
			}
		});
	};
	/**
	 * @method setVizPropsForSpecificRepresentation
	 * @description sets the vizProperies specific to the representation on main chart
	 */
	HeatmapChart.prototype.setVizPropsForSpecificRepresentation = function() {
		this.chart.setVizProperties({
			categoryAxis2 : {
				visible : true,
				title : {
					visible : true
				},
				label : {
					visible : true
				}
			}
		});
	};
	/**
	* @method setVizPropsForSpecificRepresentation
	* @description sets the vizProperies specific to the representation on thumbnail chart
	*/
	HeatmapChart.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
		if (!this.thumbnailChart) {
			return;
		}
		this.thumbnailChart.setVizProperties({
			categoryAxis2 : {
				visible : false,
				title : {
					visible : false
				}
			}
		});
	};
	HeatmapChart.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = coreConstants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.XAXIS:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.CATEGORYAXIS;
				break;
			case oSupportedTypes.XAXIS2:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.CATEGORYAXIS2;
				break;
			case oSupportedTypes.SECTORCOLOR:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.COLOR;
				break;
			default:
				break;
		}
		return axisfeedItemId;
	};
	/*BEGIN_COMPATIBILITY*/
	sap.apf.ui.representations.heatmapChart = HeatmapChart;
	/*END_COMPATIBILITY*/
	return HeatmapChart;
}, true /*Global_Export*/);