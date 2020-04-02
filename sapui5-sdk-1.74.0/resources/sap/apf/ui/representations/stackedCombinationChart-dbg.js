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
	 * @class StackedCombinationChart constructor.
	 * @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
	 * @returns chart object
	 */
	var StackedCombinationChart = function(oApi, oParameters) {
		sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = uiConstants.representationTypes.STACKED_COMBINATION_CHART;
		this.chartType = uiConstants.vizFrameChartTypes.STACKED_COMBINATION;
	};
	StackedCombinationChart.prototype = Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);
	StackedCombinationChart.prototype.getAxisFeedItemId = function(sKind) {
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
			default:
				break;
		}
		return axisfeedItemId;
	};
	sap.apf.ui.representations.stackedCombinationChart = StackedCombinationChart;
	return StackedCombinationChart;
}, true /*Global_Export*/);