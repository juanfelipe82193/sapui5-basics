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
 * @class lineChartWithTimeAxis constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
	"use strict";
	function lineChartWithTimeAxis(oApi, oParameters) {
		BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = utilsConstants.representationTypes.LINE_CHART_WITH_TIME_AXIS;
		this.chartType = utilsConstants.vizFrameChartTypes.LINE_CHART_WITH_TIME_AXIS;
		this.setDateType();
		this._addDefaultKind();
	}
	lineChartWithTimeAxis.prototype = Object.create(BaseVizFrameChartRepresentation.prototype);
	//Set the "constructor" property to refer to lineChartWithTimeAxis
	lineChartWithTimeAxis.prototype.constructor = lineChartWithTimeAxis;
	lineChartWithTimeAxis.prototype.setDateType = function() {
		var i;
		for(i = 0; i < this.parameter.dimensions.length; i++) {
			if (this.parameter.dimensions[i].kind === coreConstants.representationMetadata.kind.XAXIS) {
				this.parameter.dimensions[i].dataType = "date";
			}
		}
	};
	/**
	 * @method _addDefaultKind
	* @description reads the oParameters for chart and modifies it by including a default feedItem id 
	 * in case the "kind" property is not defined in dimension/measures
	*/
	lineChartWithTimeAxis.prototype._addDefaultKind = function() {
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
	 * @method setVizPropsForSpecificRepresentation
	 * @description sets the vizProperies specific to the representation on main chart
	 */
	lineChartWithTimeAxis.prototype.setVizPropsForSpecificRepresentation = function(metadata) {
		var i;
		this.chart.setVizProperties({
			timeAxis : {
				visible : true,
				title : {
					visible : true
				},
				label : {
					visible : true
				}
			},
			plotArea : {
				window : {
					start : "firstDataPoint",
					end : "lastDataPoint"
				}
			}
		});
		if(metadata){
			for(i = 0; i < this.parameter.dimensions.length; i++) {
				if (this.parameter.dimensions[i].kind === coreConstants.representationMetadata.kind.XAXIS) {
					var propertyMetadata = metadata.getPropertyMetadata(this.parameter.dimensions[i].fieldName);
					if (sap.apf.utils.isPropertyTypeWithDateSemantics(propertyMetadata)) {
						this.chart.setVizProperties({
							general : {
								showAsUTC : true
							}
						});
					}
				}
			}
		}
	};
	/**
	* @method setVizPropsForSpecificRepresentation
	* @description sets the vizProperies specific to the representation on thumbnail chart
	*/
	lineChartWithTimeAxis.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
		if (!this.thumbnailChart) {
			return;
		}
		this.thumbnailChart.setVizProperties({
			timeAxis : {
				visible : false,
				title : {
					visible : false
				}
			},
			plotArea : {
				window : {
					start : "firstDataPoint",
					end : "lastDataPoint"
				}
			}
		});
	};
	lineChartWithTimeAxis.prototype.getAxisFeedItemId = function(sKind) {
		var oSupportedTypes = coreConstants.representationMetadata.kind;
		var axisfeedItemId;
		switch (sKind) {
			case oSupportedTypes.XAXIS:
				axisfeedItemId = coreConstants.vizFrame.feedItemTypes.TIMEAXIS;
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
	sap.apf.ui.representations.lineChartWithTimeAxis = lineChartWithTimeAxis;
	/*END_COMPATIBILITY*/
	return lineChartWithTimeAxis;
		},true );