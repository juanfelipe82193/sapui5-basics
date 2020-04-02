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
 * @class lineChartWithTwoVerticalAxes constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
	"use strict";
	function lineChartWithTwoVerticalAxes(oApi, oParameters) {
		BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = utilsConstants.representationTypes.LINE_CHART_WITH_TWO_VERTICAL_AXES;
		this.chartType = utilsConstants.vizFrameChartTypes.LINE_CHART_WITH_TWO_VERTICAL_AXES;
		//this.setVizPropsForSpecificRepresentation(vizProperties);
		this._addDefaultKind();
	}
	lineChartWithTwoVerticalAxes.prototype = Object.create(BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to lineChartWithTwoVerticalAxes
	lineChartWithTwoVerticalAxes.prototype.constructor = lineChartWithTwoVerticalAxes;
	/**
	 * @private
	 * @method _addDefaultKind
	 * @description reads the oParameters for chart and modifies it by including a default kind
	 * in case the "kind" property is not defined in dimension/measures
	 */
	lineChartWithTwoVerticalAxes.prototype._addDefaultKind = function() {
		this.parameter.measures.forEach(function(measure, index) {
			if (measure.kind === undefined) {//handle the scenario where the kind is not available
				measure.kind = index === 0 ? coreConstants.representationMetadata.kind.YAXIS : coreConstants.representationMetadata.kind.YAXIS2;
			}
		});
		this.parameter.dimensions.forEach(function(dimension, index) {
			if (dimension.kind === undefined) {//handle the scenario where the kind is not available
				dimension.kind = index === 0 ? coreConstants.representationMetadata.kind.XAXIS : coreConstants.representationMetadata.kind.LEGEND;
			}
		});
	};
	/**
	 * @method setVizPropsForSpecificRepresentation
	 * @description sets the vizProperies specific to the representation on main chart
	 */
	lineChartWithTwoVerticalAxes.prototype.setVizPropsForSpecificRepresentation = function() {
		var self = this;
		this.chart.attachEventOnce('renderComplete', function() {
			var oPrimMaxValue, oSecMinValue;
			if (!this.chart) {
				return;
			}
			if (!oPrimMaxValue) {
				oPrimMaxValue = self.chart.getVizProperties().plotArea.primaryScale.autoMaxValue;
			}
			if (!oSecMinValue) {
				oSecMinValue = self.chart.getVizProperties().plotArea.secondaryScale.autoMaxValue;
			}
			self.chart.setVizProperties({
				plotArea : {
					primaryScale : {
						fixedRange : true,
						maxValue : oPrimMaxValue
					},
					secondaryScale : {
						fixedRange : true,
						maxValue : oSecMinValue
					}
				}
			});
			_setScalePropertiesForThumbnailChart(self, oPrimMaxValue, oSecMinValue);
		});
		self.chart.setVizProperties({
			valueAxis2 : {
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
	function _setScalePropertiesForThumbnailChart(self, oPrimMaxValue, oSecMinValue) {
		if (!self.thumbnailChart) {
			return;
		}
		self.thumbnailChart.setVizProperties({
			plotArea : {
				primaryScale : {
					fixedRange : true,
					maxValue : oPrimMaxValue
				},
				secondaryScale : {
					fixedRange : true,
					maxValue : oSecMinValue
				}
			}
		});
	}
	/**
	* @method setVizPropsForSpecificRepresentation
	* @description sets the vizProperies specific to the representation on thumbnail chart
	*/
	lineChartWithTwoVerticalAxes.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
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
	lineChartWithTwoVerticalAxes.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = coreConstants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.XAXIS:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.CATEGORYAXIS;
				break;
			case oSupportedTypes.YAXIS:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.VALUEAXIS;
				break;
			case oSupportedTypes.YAXIS2:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.VALUEAXIS2;
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
	sap.apf.ui.representations.lineChartWithTwoVerticalAxes = lineChartWithTwoVerticalAxes;
	/*END_COMPATIBILITY*/
	return lineChartWithTwoVerticalAxes;
}, true /*Global_Export*/);