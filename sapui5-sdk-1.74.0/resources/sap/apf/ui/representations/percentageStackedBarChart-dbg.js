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
 * @class stackColumn constructor.
 * @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
 * @returns chart object 
 */
	"use strict";
	function percentageStackedBarChart(oApi, oParameters) {
	    BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = utilsConstants.representationTypes.PERCENTAGE_STACKED_BAR_CHART;
		this.chartType = utilsConstants.vizFrameChartTypes.PERCENTAGE_STACKED_BAR;
		this._addDefaultKind();
	};
	percentageStackedBarChart.prototype = Object.create(BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to percentageStackedBarChart
	percentageStackedBarChart.prototype.constructor = percentageStackedBarChart;
	/**
	 * @private
	 * @method _addDefaultKind
	 * @description reads the oParameters for chart and modifies it by including a default kind
	 * in case the "kind" property is not defined in dimension/measures
	 */
	percentageStackedBarChart.prototype._addDefaultKind = function() {
		this.parameter.measures.forEach(function(measure) {
			if (measure.kind === undefined) {//handle the scenario where the kind is not available
				measure.kind = coreConstants.representationMetadata.kind.YAXIS;
			}
		});
		this.parameter.dimensions.forEach(function(dimension, index) {
			if (dimension.kind === undefined) {//handle the scenario where the kind is not available
				dimension.kind = index === 0 ? coreConstants.representationMetadata.kind.XAXIS : coreConstants.representationMetadata.kind.LEGEND;
			}
		});
	};
	/**
	 * @method handleCustomFormattingOnChart
	 * @description sets the custom format string
	 */
	percentageStackedBarChart.prototype.setFormatString = function() {
		//overriding the base class setFormatString, since percentage chart does not need the formatting for axis and tooltip
		return;
	};
	/**
	 * @private
	* @method _setVizPropsCommonToMainAndThumbnailCharts
	* @description since the property is same for main and thumbnail so for reusability purpose created this method
	*/
	function _setVizPropsCommonToMainAndThumbnailCharts(chart) {
		chart.setVizProperties({
			plotArea : {
				animation : {
					dataLoading : false,
					dataUpdating : false
				}
			}
		});
	}
	/**
	 * @method setVizPropsForSpecificRepresentation
	 * @description sets the vizProperies specific to the representation on main chart
	 */
	percentageStackedBarChart.prototype.setVizPropsForSpecificRepresentation = function() {
		_setVizPropsCommonToMainAndThumbnailCharts(this.chart);
	};
	/**
	* @method setVizPropsForSpecificRepresentation
	* @description sets the vizProperies specific to the representation on thumbnail chart
	*/
	percentageStackedBarChart.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
		if (!this.thumbnailChart) {
			return;
		}
		_setVizPropsCommonToMainAndThumbnailCharts(this.thumbnailChart);
	};
	percentageStackedBarChart.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = coreConstants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.XAXIS:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.CATEGORYAXIS;
				break;
			case oSupportedTypes.YAXIS:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.VALUEAXIS;
				break;
			case oSupportedTypes.LEGEND:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.COLOR;
				break;
			default:
				break;
		}
		return axisfeedItemId;
	};
	/*BEGIN_COMPATIBILITY*/
	sap.apf.ui.representations.percentageStackedBarChart = percentageStackedBarChart;
	/*END_COMPATIBILITY*/
	return percentageStackedBarChart;
}, true /*Global_Export*/);