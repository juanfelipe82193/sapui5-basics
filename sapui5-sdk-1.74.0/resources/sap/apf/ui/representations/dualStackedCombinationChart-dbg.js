/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");
sap.ui.define([
	"sap/apf/core/constants",
	"sap/apf/ui/utils/constants"
], function(constants, uiConstants){
	"use strict";
	/**
	 * @class DualStackedCombinationChart constructor.
	 * @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
	 * @returns chart object
	 */
	var DualStackedCombinationChart = function(oApi, oParameters) {
		sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = uiConstants.representationTypes.DUAL_STACKED_COMBINATION_CHART;
		this.chartType = uiConstants.vizFrameChartTypes.DUAL_STACKED_COMBINATION;
	};
	DualStackedCombinationChart.prototype = Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);
	DualStackedCombinationChart.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = constants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.XAXIS:
				axisfeedItemId = constants.vizFrame.feedItemTypes.CATEGORYAXIS;
				break;
			case oSupportedTypes.LEGEND:
				axisfeedItemId = constants.vizFrame.feedItemTypes.COLOR;
				break;
			case oSupportedTypes.YAXIS:
				axisfeedItemId = constants.vizFrame.feedItemTypes.VALUEAXIS;
				break;
			case oSupportedTypes.YAXIS2:
				axisfeedItemId = constants.vizFrame.feedItemTypes.VALUEAXIS2;
				break;
			default:
				break;
		}
		return axisfeedItemId;
	};
	/**
	* @method setVizPropsForSpecificRepresentation
	* @description sets the vizProperies specific to the representation on thumbnail chart
	*/
	DualStackedCombinationChart.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
		if (!this.thumbnailChart) {
			return;
		}
		this.thumbnailChart.setVizProperties({
			valueAxis2 : {
				visible : false,
				title : {
					visible : false
				}
			}
		});
	};
	sap.apf.ui.representations.dualStackedCombinationChart = DualStackedCombinationChart;
	return DualStackedCombinationChart;
}, true /*Global_Export*/);