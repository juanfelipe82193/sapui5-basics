/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/* global jQuery, sap */
sap.ui.define([
	'sap/viz/ui5/controls/VizFrame',
	'sap/viz/ui5/controls/common/feeds/FeedItem',
	'sap/apf/ui/representations/BaseUI5ChartRepresentation',
	'sap/apf/ui/representations/utils/vizFrameSelectionHandler',
	'sap/apf/ui/utils/representationTypesHandler',
	'sap/apf/ui/utils/constants',
	'sap/apf/core/constants',
	'sap/apf/utils/trace'
], function(VizFrame, FeedItem, BaseUI5ChartRepresentation, VizFrameSelectionHandler, RepresentationTypesHandler,
			UiUtilsConstants, CoreConstants, trace){
	'use strict';

	var logSeparator4Event = " ************************************** ";

	var BaseVizFrameChartRepresentation = function(oApi, oParameters) {
		BaseUI5ChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.oApi = oApi;
	};
	BaseVizFrameChartRepresentation.prototype = Object.create(BaseUI5ChartRepresentation.prototype);
	//Set the "constructor" property to refer to BaseUI5ChartRepresentation
	BaseVizFrameChartRepresentation.prototype.constructor = BaseVizFrameChartRepresentation;
	BaseVizFrameChartRepresentation.prototype.destroy = function() {
		if (this.chart) {
			this.chart.destroyDataset();
			this.chart.destroyFeeds();
			this.chart.detachRenderComplete(this.fnDrawSelectionOnMainChart);
			this.fnDrawSelectionOnMainChart = null;
		}
		if (this.thumbnailChart) {
			this.thumbnailChart.destroyDataset();
			this.thumbnailChart.destroyFeeds();
			this.thumbnailChart.detachRenderComplete(this.fnDrawSelectionOnThumbnailChart);
			this.fnDrawSelectionOnThumbnailChart = null;
		}
		BaseUI5ChartRepresentation.prototype.destroy.call(this);
	};
	/**
	 * @method getMeasures
	 * @return the measures for a chart
	 */
	BaseVizFrameChartRepresentation.prototype.getMeasures = function() {
		return this.measures;
	};
	/**
	 * A variant of getMainContent which does not attach handlers and also does not set the main chart on the representation.
	 * It caches the created chart in a member of the representation.
	 * This function must not be called after getMainContent has been called normally since it would reset this.chart for the main chart.
	 * Assumption: analysisPath calls getMainContent first, and then it skips getChartForCustomListItem.
	 * getChartForCustomListItem will be called only if this.chart is not defined. This is the case in openPath when getMainContent is
	 * called for the active step only. For all other steps, getChartForCustomListItem creates a substitute chart.
	 * Whenever one of those steps gets active later, it then uses its main chart for the custom list item, and not the substitute.
	 */
	BaseVizFrameChartRepresentation.prototype.getChartForCustomListItem = function() {
		trace.logCall("getChartForCustomListItem");
		if (!this.chart4CustomItemList) {
			var chart4CIL = this.getMainContent("#chartForCustomListItem#", null, null, "isCreate4CIL");
			this.chart = undefined;
			this.title = undefined;
			this.chart4CustomItemList = chart4CIL;
		}
		trace.logReturn("getChartForCustomListItem", " return=", this.chart4CustomItemList);
		return this.chart4CustomItemList;
	};
		/**
	 * @method getMainContent
	 * @param oStepTitle title of the main chart
	 * @param width width of the main chart
	 * @param height height of the main chart
	 * @description Draws the main chart into the chart area, which is a side effect.
	 * Further, when this.chart === undefined, this.chart set to a newly created chart.
	 * The method eventually returns the chart (VizFrame).
	 */
	BaseVizFrameChartRepresentation.prototype.getMainContent = function(oStepTitle, width, height, creationMode) {
		trace.logCall("BaseVizFrame.getMainContent", " apfId=", this.apfId, ", creationMode" + creationMode);
		var isCreate4CIL = (creationMode === "isCreate4CIL");
		var self = this;
		var superClass = this;
		var chartHeight = (height || 725) + "px";
		var chartWidth = width || 1000;
		chartWidth = chartWidth + "px";
		this.title = oStepTitle;
		this.createDataset();  // sets oRepr.dataSet and oRepr.oModel
		if (!this.chart) { //If chart instance does not yet exist create a new instance, once per representation.
			this.chart = new VizFrame({
				vizType : this.chartType,//comes from specific representation
				dataset : this.dataset,
				width : chartWidth,
				height : chartHeight,
				uiConfig : {
					applicationSet : "fiori"
				}
			});
			trace.log("", " *** new VizFrame ***", oStepTitle, ", chartType=" + this.chartType, ", chart=", this.chart);
			this.setVizPropertiesOnChart(this.metadata);
			if (this.metadata) { //if metadata is available, do the formatting for measures
				this._createAndAddFeedItemBasedOnId(this.chart);
				if (this.measures.length !== 0){
					var oMeasureWithFormatString = {};
					var sFormatStringForTooltip;
					this.measures.forEach(function(measure) {
						var sFormatString = superClass.getFormatStringForMeasure(measure); // get the format string for each measure
						sFormatStringForTooltip = superClass.getFormatStringForMeasureTooltip(measure);
						oMeasureWithFormatString.measure = measure;
						oMeasureWithFormatString.formatString = sFormatString; // associate the format string with each measure
						self.setFormatStringOnChart(oMeasureWithFormatString);
					});
					this.setFormatString("tooltip", sFormatStringForTooltip); //tooltip is not a feedItem Id, formatting has to be applied explicitly
					if (this.handleCustomFormattingOnChart) { //call the sub class formatting 
						this.handleCustomFormattingOnChart();
					}
				}
			}
			if (!isCreate4CIL) {
				// Event is triggered on when the chart is initialized. Draws the selection.
				this.fnDrawSelectionOnMainChart = this.drawSelectionOnMainChart.bind(self);
				this.chart.attachRenderComplete(this.fnDrawSelectionOnMainChart);
				superClass.attachSelectionAndFormatValue.call(this, oStepTitle); // call the base class attachSelectionAndFormatValue
			}
		} else {//If chart instance exists only update dataset, feeds and model
			if (width) {
				this.chart.setWidth(chartWidth);
			}
			if (height) {
				this.chart.setHeight(chartHeight);
			}
			this.chart.destroyDataset();
			this.chart.removeAllFeeds();
			this.chart.destroyFeeds();
			this.chart.vizUpdate({
				'data' : this.dataset
			});
			this._createAndAddFeedItemBasedOnId(this.chart);
		}
		this.chart.setModel(this.oModel);
		trace.logReturn("BaseVizFrame.getMainContent");
		return this.chart;
	};
	/**
	* @method setVizPropertiesOnChart
	* @description sets the vizProperties common to all charts
	*/
	BaseVizFrameChartRepresentation.prototype.setVizPropertiesOnChart = function(metadata) {
		var oInteraction = {
			behaviorType : null
		};
		if (this.parameter.requiredFilters.length === 0) {
			oInteraction = {
				selectability : {
					axisLabelSelection : false,
					legendSelection : false,
					plotLassoSelection : false,
					plotStdSelection : false
				},
				enableHover : false,
				noninteractiveMode : false,
				behaviorType : null
			};
		}
		this.chart.setVizProperties({
			title : {
				visible : true,
				text : this.title
			},
			interaction : oInteraction,
			categoryAxis : {
				visible : true,
				title : {
					visible : true
				},
				label : {
					visible : true
				}
			},
			valueAxis : {
				visible : true,
				title : {
					visible : true
				},
				label : {
					visible : true
				}
			},
			legend : {
				visible : true,
				title : {
					visible : true
				},
				isScrollable : true
			},
			plotArea : {
				window : {
					start : null
				},
				dataLabel: {
					visible : false,
					unitFormatType : "measureFormatter",
					hideWhenOverlap : true
				}
			},
			tooltip : {
				visible : true,
				label : {
					visible : true
				}
			},
			general : {
				groupData : false
			}
		});
		this.setVizPropsForSpecificRepresentation();//sets the vizProperties specific to the chart
		var representationTypesHandler = new RepresentationTypesHandler();
		if(representationTypesHandler.isCombinationChart(this.type)){
			this.chart.setVizProperties(this.getVizPropertiesForCombinationCharts(representationTypesHandler));
		}
	};
	/**
	 * Method returns specific vizProeprties for combination charts
	 * This is to set the measureOptions to the chart (if measures should be shown as line or bar
	 * @private
	 * @returns {Object} Object which can be set as VizProperties
	 */
	BaseVizFrameChartRepresentation.prototype.getVizPropertiesForCombinationCharts = function(representationTypesHandler) {
		var primaryAxisOptions = [];
		var secondaryAxisOptions = [];
		this.measures.forEach(function(measure){
			if(!measure.measureDisplayOption){
				return;
			}
			if(measure.kind === representationTypesHandler.getKindsForMeasurePropertyType(this.type)[0]){
				primaryAxisOptions.push(measure.measureDisplayOption);
			}
			if(measure.kind === representationTypesHandler.getKindsForMeasurePropertyType(this.type)[1]){
				secondaryAxisOptions.push(measure.measureDisplayOption);
			}
		}.bind(this));
		var vizPropertiesForCombinedChart = {
			plotArea : {
				dataShape : {}
			}
		};
		if(primaryAxisOptions.length > 0){
			vizPropertiesForCombinedChart.plotArea.dataShape.primaryAxis = primaryAxisOptions;
		}
		if(secondaryAxisOptions.length > 0){
			vizPropertiesForCombinedChart.plotArea.dataShape.secondaryAxis = secondaryAxisOptions;
		}
		return vizPropertiesForCombinedChart;
	};
	BaseVizFrameChartRepresentation.prototype.setVizPropsForSpecificRepresentation = function() {
	};
	/**
	 * A method determining the properties for bubble and scatter charts. Shared code for subclasses.
	 * @private
	 * @param {Object[]} dimensions Array of dimensions.
	 * @returns {Object} Object consumed by UI5 charts.
	 */
	BaseVizFrameChartRepresentation._setVizPropsForBubbleAndScatter = function(dimensions, bIsMainChart) {
		trace.log("_setVizPropsForBubbleAndScatter", ", dimensions", dimensions);
		var oChartProps = {
			valueAxis2 : {
				visible : bIsMainChart,
				title : {
					visible : bIsMainChart
				}
			},
			sizeLegend : {
				visible : bIsMainChart
			},
			plotArea : {
				adjustScale : true
			}
		};
		if (!bIsMainChart){
			oChartProps.plotArea.markerSize = 4;
			oChartProps.plotArea.marker = {
				visible : true,
				size : 4
			};
		} else {
			oChartProps.valueAxis2.label = {
				visible : true
			};
		}
		var iColorDimensions = 0;
		var iShapeDimensions = 0;
		dimensions.forEach(function(dimension) {
			if (dimension.kind === CoreConstants.representationMetadata.kind.REGIONCOLOR){
				iColorDimensions++;
			} else if (dimension.kind === CoreConstants.representationMetadata.kind.REGIONSHAPE){
				iShapeDimensions++;
			}
		});
		if (iColorDimensions > 0){
			oChartProps.plotArea.colorDepth = iColorDimensions;
		}
		if (iShapeDimensions > 0){
			oChartProps.plotArea.shapeDepth = iShapeDimensions;
		}
		return oChartProps;
	};
	/**
	* @method setFormatStringOnChart
	* @param {oMeasureFormatString}- 
	*              oMeasureFormatString : {
	*              measure : measure1,
	*              formatString : formatString
	              }
	* @description reads the boolean to indicate if all the measures have same unit semantic
	* and based on the axisFeedItemId from measures applies the formatting to the xAxis,yAxis,tooltip or sizeLegend
	*/
	BaseVizFrameChartRepresentation.prototype.setFormatStringOnChart = function(oMeasureFormatString) {
		var sFormatString = oMeasureFormatString.formatString;
		var sChartPropertyName = oMeasureFormatString.measure.axisfeedItemId;
		this.setFormatString(sChartPropertyName, sFormatString); //based on the feedItem Id , set the format string on the chart
	};
	/**
	 * @method setFormatString
	 * @param sChartPropertyName ,chart property on which property has to be applied (e.g. xAxis, yAxis, tooltip) 
	 * @param sFormatString , the format string which has to be set for yAxis, xAxis or tooltip 
	 * @description sets the format string for axis label and tooltip
	 */
	BaseVizFrameChartRepresentation.prototype.setFormatString = function(sChartPropertyName, formatString) {
		var superClass = this;
		var bIsAllMeasureSameUnit = superClass.getIsAllMeasureSameUnit();
		switch (sChartPropertyName) {
			case CoreConstants.vizFrame.feedItemTypes.VALUEAXIS:
				if (bIsAllMeasureSameUnit) { //apply the formatting only when all the measures have same unit semantic
					this.chart.setVizProperties({
						valueAxis : {
							label : {
								formatString : formatString
							}
						}
					});
				}
				break;
			case CoreConstants.vizFrame.feedItemTypes.VALUEAXIS2:
				if (bIsAllMeasureSameUnit) { //apply the formatting only when all the measures have same unit semantic
					this.chart.setVizProperties({
						valueAxis2 : {
							label : {
								formatString : formatString
							}
						}
					});
				}
				break;
			case CoreConstants.vizFrame.feedItemTypes.CATEGORYAXIS:
				this.chart.setVizProperties({
					categoryAxis : {
						label : {
							formatString : formatString
						}
					}
				});
				break;
			case CoreConstants.vizFrame.feedItemTypes.BUBBLEWIDTH:
				this.chart.setVizProperties({
					sizeLegend : {
						formatString : formatString
					}
				});
				break;
			case "tooltip":
				this.chart.setVizProperties({
					tooltip : {//takes one value unlike viz, in case of multiple measures which value should it be?
						formatString : formatString
					}
				});
				break;
			default:
				break;
		}
	};
	/**
	* @private
	* @function
	* @method _createAndAddFeedItemBasedOnId
	* @param {oChart}- instance of the chart
	* @description creates and adds the feedItem for dimensions/measures of a chart	
	*/
	BaseVizFrameChartRepresentation.prototype._createAndAddFeedItemBasedOnId = function(oChart) {
		var sameFeedItemMeasureGroup = this._createFeedItemGroup(this.parameter.measures); // create feedItem for all the measures
		this._addFeedItemsToChart(oChart, sameFeedItemMeasureGroup, "Measure"); // add measure feedItem to the chart	
		var sameFeedItemDimensionGroup = this._createFeedItemGroup(this.parameter.dimensions); // create feedItem for all the dimensions
		this._addFeedItemsToChart(oChart, sameFeedItemDimensionGroup, "Dimension"); // add dimension feedItem to the chart
	};
	/**
	* @private
	* @function
	* @method _createFeedItemGroup
	* @param [aDataToBeGrouped] - dimensions/measures for a chart, which have to be grouped based on the feedItem id assigned
	* @description reads the feedItem id from each dimension/measure
	*         
	*          e.g. dimensions = [{
	*				name : dimension.name,
	*				value : '{' + dimension.value + '}',
	*				axisfeedItemId : "categoryAxis"
	*			}];
	*
	*and groups the dimensions/measures based on the axisfeedItemId , 
	*@return sameFeedItemGroup - associative array for all the feedItems available in the dimensions/measures
	*
	*          e.g. sameFeedItemGroup = {
	*                                valueAxis : [{measure1},{measure2}],
	*                                categoryAxis : {{dimension1},{dimension2}]
	*                               }	
	*/
	BaseVizFrameChartRepresentation.prototype._createFeedItemGroup = function(aDataToBeGrouped) {
		var self = this;
		var sameFeedItemGroup = {};
		aDataToBeGrouped.forEach(function(data) { // group all the dimensions/measures based on the feedItem id
			data.axisfeedItemId = self.getAxisFeedItemId(data.kind);
			var feedItemList = sameFeedItemGroup[data.axisfeedItemId];
			if (feedItemList) { //if the group name exist for one feedItem id, push the data in that group
				var bFieldAlreadyExists = feedItemList.some(function(oData) {
					return oData.identity === data.identity;
				});
				if (!bFieldAlreadyExists) {
					feedItemList.push(data);
				}
			} else { //else create a new group name for the feedItem id and push the data into it
				sameFeedItemGroup[data.axisfeedItemId] = [ data ];
			}
		});
		return sameFeedItemGroup;
	};
	/**
	 * @private
	 * @function
	 * @name manageSelectionsOnChart
	 * @param event parameter with the selection or deselection data
	 * @param bIsCalledFromDeselection indicates if the method is called to select or deselect the data points
	 * @param oParameter chart parameter (dimensions, measures, ..)
	 */
	BaseVizFrameChartRepresentation.prototype.manageSelectionsOnChart = function(event, bIsCalledFromDeselection, oParameter) {
		trace.logCall("BaseVizFrame.manageSelectionsOnChart", logSeparator4Event,
			", is deselection", bIsCalledFromDeselection, ", oParameter: ", oParameter);
		var oVizFrameSelectionHandler = new VizFrameSelectionHandler.constructor(oParameter, this.oApi);
		var aSelectionInChart = this.chart.vizSelection();
		var oSelectedPointsFromSelection = oVizFrameSelectionHandler.getSelectionInfoFromEvent(event, bIsCalledFromDeselection, aSelectionInChart);

		this.setSelectionOnMainChart(oSelectedPointsFromSelection.dataPointsFromSelection, bIsCalledFromDeselection);
		this.setSelectionOnThumbnailChart(oSelectedPointsFromSelection.dataPointsFromSelection, bIsCalledFromDeselection);
		if (this.oRepresentationFilterHandler.getIfSelectedFilterChanged(oSelectedPointsFromSelection.aUniqueFilterValueFromChart)) {
			trace.logCall("...manageSelectionsOnChart, selected filter changed", ", aUniqueFilterValueFromChart: ", oSelectedPointsFromSelection.aUniqueFilterValueFromChart);
			this.oRepresentationFilterHandler.updateFilterFromSelection(oSelectedPointsFromSelection.aUniqueFilterValueFromChart);
			this.oApi.selectionChanged(false);
		}
		trace.logReturn("BaseVizFrame.manageSelectionsOnChart");
	};
	/**
	* @private
	* @function
	* @name _addFeedItemsToChart
	* @param {oChart}- instance of the chart
	* @param {oGroupedData}- associative array which has all the dimensions and measures grouped based on the feedItem Id
	* 
	*     oGroupedData = {
	*                     valueAxis : [{measure1},{measure2}],
	*                     categoryAxis : {{dimension1},{dimension2}]
	*                    }
	*
	*@param sFeedItemType- type of the feedItem (dimension/measure)
	*
	*@description creates an object which has the id and the values required for a feedItem
	*           oFeedItem = {
	*                         feedItemId : "categoryAxis" or "valueAxis" etc
	*                         value : [value1,value2]
	*                       }
	* 
	*creates chart feedItem and adds it to the vizFrame charts
	*/
	BaseVizFrameChartRepresentation.prototype._addFeedItemsToChart = function(oChart, oGroupedData, sFeedItemType) {
		for( var key in oGroupedData) { //loop through all the groups
			var oFeedItem = {};
			var aFeedItemValue = [];
			var i = 0;
			for(i in oGroupedData[key]) { //loop through all the measures/dimensions of one group
				aFeedItemValue.push(oGroupedData[key][i].identity); //push all the measure/dimension identity which has same feedIem id to an array
				oFeedItem.feedItemId = oGroupedData[key][0].axisfeedItemId; //assign one id to each feedItem object (all the id will be same in one group) 
			}
			oFeedItem.value = aFeedItemValue; //assign the values to each feedItem object
			var chartFeedItem = new FeedItem({
				uid : oFeedItem.feedItemId,
				type : sFeedItemType,
				values : oFeedItem.value
			});
			oChart.addFeed(chartFeedItem);
		}
	};
	/**
	* @method setVizPropertiesOnThumbnailChart
	* @description sets the vizProperties common to all charts(thumbnail)
	*/
	BaseVizFrameChartRepresentation.prototype.setVizPropertiesOnThumbnailChart = function() {
		if (!this.thumbnailChart) {
			return;
		}
		this.thumbnailChart.setVizProperties({
			title : {
				visible : false
			},
			categoryAxis : {
				visible : false,
				title : {
					visible : false
				}
			},
			valueAxis : {
				visible : false,
				title : {
					visible : false
				}
			},
			legend : {
				visible : false,
				title : {
					visible : false
				}
			},
			tooltip : {
				visible : false
			},
			interaction : {
				selectability : {
					axisLabelSelection : false,
					legendSelection : false,
					plotLassoSelection : false,
					plotStdSelection : false
				},
				enableHover : false,
				noninteractiveMode : true
			},
			background : {
				visible : false
			},
			general : {
				layout : {
					padding : 0
				},
				groupData : false
			},
			plotArea : {
				window : {
					start : null
				},
				gridline : {
					visible : false
				},
				dataLabel : {
					visible : false
				},
				seriesStyle : {
					rules : [ {
						properties : {
							width : 1
						}
					} ]
				}
			}
		});
		this.setVizPropsOfThumbnailForSpecificRepresentation();//sets the vizProperties specific to the chart
		var representationTypesHandler = new RepresentationTypesHandler();
		if(representationTypesHandler.isCombinationChart(this.type)){
			this.thumbnailChart.setVizProperties(this.getVizPropertiesForCombinationCharts(representationTypesHandler));
		}
	};
	BaseVizFrameChartRepresentation.prototype.setVizPropsOfThumbnailForSpecificRepresentation = function() {
	};
	/**
	 * @method setSelectionOnMainChart
	 * @param aSelection array of selected objects
	 * @param bIsDeselection
	 * @description sets the Selection on main Chart
	 */
	BaseVizFrameChartRepresentation.prototype.setSelectionOnMainChart = function(aSelection, bIsDeselection) {
		trace.log("BaseVizFrame.setSelectionOnMainChart", ", aSelection=", aSelection,
			" apfId=", this.apfId, ", bIsDeselection=" + bIsDeselection, "chart.sId" + this.chart.sId);
		this.chart.vizSelection(aSelection, {
			clearSelection : bIsDeselection
		});
	};
	/**
	 * @method setSelectionOnThumbnailChart
	 * @param array of selected objects
	 * @description sets the Selection on thumbnail Chart
	 */
	BaseVizFrameChartRepresentation.prototype.setSelectionOnThumbnailChart = function(aSelection, bIsDeselection) {
		trace.log("BaseVizFrame.setSelectionOnThumbnailChart", ", aSelection=", aSelection,
			" apfId=", this.apfId, ", bIsDeselection=" + bIsDeselection, "thumbnailChart.sId" + (!this.thumbnailChart) ? "-" : this.thumbnailChart.sId);
		if (this.thumbnailChart) {
			this.thumbnailChart.vizSelection(aSelection, {
				clearSelection : bIsDeselection
			});
		}
	};
	BaseVizFrameChartRepresentation.prototype.getAxisFeedItemId = function(sKind) {
	};
	/* 
	 * If the chart is vizframe clone the chart. Limitation with clone in viz frame as it does only shallow clone, Viz type and viz properties need to be set again
	 * Therefore we read existing viz properties set in the original chart and set in on the cloned chart
	 */
	BaseVizFrameChartRepresentation.prototype.getPrintContent = function(oStepTitle) {
		var oRepresentation, vizType = this.chartType, vizProperties = {}, aSelectionOnChart, oPrintObject;
		var oOriginalChart = this.getMainContent(oStepTitle);
		vizProperties = oOriginalChart.getVizProperties();
		oRepresentation = oOriginalChart.clone();
		oRepresentation.setVizType(vizType);
		oRepresentation.setVizProperties(vizProperties);
		oRepresentation.setWidth("1000px");
		oRepresentation.setHeight("600px");
		this.createDataset();
		oRepresentation.setDataset(this.dataset);
		oRepresentation.setModel(this.oModel);
		aSelectionOnChart = this.chart.vizSelection();
		//attachRenderComplete() because drawing selection takes time
		oRepresentation.attachRenderComplete(function() {
			oRepresentation.vizSelection(aSelectionOnChart);
		});
		oPrintObject = {
			oRepresentation : oRepresentation
		};
		return oPrintObject;
	};
	return BaseVizFrameChartRepresentation;
}, true /*Global_Export*/);