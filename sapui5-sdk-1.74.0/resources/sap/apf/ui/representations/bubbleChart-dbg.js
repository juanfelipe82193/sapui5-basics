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
 * @class columnChart constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
	"use strict";
	function BubbleChart(oApi, oParameters) {
		BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = utilsConstants.representationTypes.BUBBLE_CHART;
		this.chartType = utilsConstants.vizFrameChartTypes.BUBBLE;
		this._addDefaultKind();
	};
	BubbleChart.prototype = Object.create(BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to bubbleChart
	BubbleChart.prototype.constructor = BubbleChart;
	/**
	 * @private
	 * @method _addDefaultKind
	 * @description reads the oParameters for chart and modifies it by including a default kind
	 * in case the "kind" property is not defined in dimension/measures
	 */
	BubbleChart.prototype._addDefaultKind = function() {
		this.parameter.measures.forEach(function(measure, index) {
			if (measure.kind === undefined) {//handle the scenario where the kind is not available
				if (index === 0) {
					measure.kind = coreConstants.representationMetadata.kind.XAXIS;
				} else if (index === 1) {
					measure.kind = coreConstants.representationMetadata.kind.YAXIS;
				} else {
					measure.kind = coreConstants.representationMetadata.kind.BUBBLEWIDTH;
				}
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
	 * @description sets the vizProperties specific to the representation on main chart.
	 */
BubbleChart.prototype.setVizPropsForSpecificRepresentation = function() {
		var  oChartProps = BaseVizFrameChartRepresentation._setVizPropsForBubbleAndScatter(this.parameter.dimensions, true);
		this.chart.setVizProperties(oChartProps);
	};
	/**
	* @method setVizPropsForSpecificRepresentation
	* @description sets the vizProperties specific to the representation on thumbnail chart
	*/
	BubbleChart.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
		var  oChartProps = BaseVizFrameChartRepresentation._setVizPropsForBubbleAndScatter(this.parameter.dimensions, false);
		this.thumbnailChart.setVizProperties(oChartProps);
	};
	BubbleChart.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = coreConstants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.REGIONCOLOR:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.COLOR;
				break;
			case oSupportedTypes.REGIONSHAPE:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.SHAPE;
				break;
			case oSupportedTypes.XAXIS:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.VALUEAXIS;
				break;
			case oSupportedTypes.YAXIS:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.VALUEAXIS2;
				break;
			case oSupportedTypes.BUBBLEWIDTH:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.BUBBLEWIDTH;
				break;
			default:
				break;
		}
		return axisfeedItemId;
	};
	/*BEGIN_COMPATIBILITY*/
	sap.apf.ui.representations.bubbleChart = BubbleChart;
	/*END_COMPATIBILITY*/
	return BubbleChart;
}, true /*Global_Export*/);