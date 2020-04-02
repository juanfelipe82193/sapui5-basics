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
 * @class scatterPlotChart constructor.
* @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
* @returns chart object
 */
	"use strict";
	function scatterPlotChart(oApi, oParameters) {
		BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = utilsConstants.representationTypes.SCATTERPLOT_CHART;
		this.chartType = utilsConstants.vizFrameChartTypes.SCATTERPLOT;
		this._addDefaultKind();
	};
	scatterPlotChart.prototype = Object.create(BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to scatterPlotChart
	scatterPlotChart.prototype.constructor = scatterPlotChart;
	/**
	 * @method _addDefaultKind
	* @description reads the oParameters for chart and modifies it by including a default feedItem id 
	 * in case the "kind" property is not defined in dimension/measures
	*/
	scatterPlotChart.prototype._addDefaultKind = function() {
		this.parameter.measures.forEach(function(measure, index) {
			if (measure.kind === undefined) {//handle the scenario where the kind is not available
				measure.kind = index === 0 ? coreConstants.representationMetadata.kind.XAXIS : coreConstants.representationMetadata.kind.YAXIS;
			}
		});
		this.parameter.dimensions.forEach(function(dimension, index) {
			if (dimension.kind === undefined) {//handle the scenario where the kind is not available
				dimension.kind = index === 0 ? coreConstants.representationMetadata.kind.REGIONCOLOR : coreConstants.representationMetadata.kind.REGIONSHAPE;
			}
		});
	};
	/**
	 * @method setVizPropsForSpecificRepresentation
	 * @description sets the vizProperies specific to the representation on main chart
	 */
	scatterPlotChart.prototype.setVizPropsForSpecificRepresentation = function() {
		var oChartProps = BaseVizFrameChartRepresentation._setVizPropsForBubbleAndScatter(this.parameter.dimensions, true);
		this.chart.setVizProperties(oChartProps);
	};
	/**
	* @method setVizPropsForSpecificRepresentation
	* @description sets the vizProperies specific to the representation on thumbnail chart
	*/
	scatterPlotChart.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
		if (!this.thumbnailChart) {
			return;
		}
		var  oChartProps = BaseVizFrameChartRepresentation._setVizPropsForBubbleAndScatter(this.parameter.dimensions, false);
		this.thumbnailChart.setVizProperties(oChartProps);
	};
	scatterPlotChart.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = coreConstants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.XAXIS:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.VALUEAXIS;
				break;
			case oSupportedTypes.YAXIS:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.VALUEAXIS2;
				break;
			case oSupportedTypes.REGIONCOLOR:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.COLOR;
				break;
			case oSupportedTypes.REGIONSHAPE:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.SHAPE;
				break;
			default:
				break;
		}
		return axisfeedItemId;
	};
	/*BEGIN_COMPATIBILITY*/
	sap.apf.ui.representations.scatterPlotChart = scatterPlotChart;
	/*END_COMPATIBILITY*/
	return scatterPlotChart;
}, true /*Global_Export*/);