/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.utils.formatter');
jQuery.sap.require("sap.apf.ui.representations.utils.chartDataSetHelper");
jQuery.sap.require("sap.apf.ui.representations.utils.representationFilterHandler");
jQuery.sap.require("sap.apf.ui.representations.utils.timeAxisDateConverter");
jQuery.sap.require('sap.apf.utils.utils');
/**
 * @class representation base class constructor.
 * @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
 * @returns chart object
 */
sap.ui.define([
	"sap/m/Text",
	"sap/apf/core/constants",
	"sap/ui/layout/HorizontalLayout",
	"sap/apf/ui/representations/utils/vizFrameSelectionHandler"
], function(Text, coreConstants, HorizontalLayout, VizFrameSelectionHandler){
	'use strict';
	var idCounter = 0;
	function _getNameOrLabelOfProperty(oRepresentation, requiredFilterLabel) {
		if (!requiredFilterLabel) {
			return undefined;
		}
		var oMetaData = oRepresentation.getMetaData();
		if (!oMetaData) {
			return null;
		}
		var oPropertyMetaData = oMetaData.getPropertyMetadata(requiredFilterLabel);
		if (!oPropertyMetaData) {
			return null;
		}
		var sFilterLabel = oPropertyMetaData.label || oPropertyMetaData.name;
		return sFilterLabel !== undefined ? sFilterLabel : null;
	}
	var BaseUI5ChartRepresentation = function(oApi, oParameters) {
		this.oMessageObject = "";
		this.aDataResponse = undefined;
		this.dataset = {};
		this.parameter = oParameters;
		this.orderby = oParameters.orderby;
		this.measures = oParameters.measures;
		this.alternateRepresentation = oParameters.alternateRepresentationType;
		this.requiredFilters = oParameters.requiredFilters;
		this.oVizFrameSelectionHandler = new VizFrameSelectionHandler.constructor(this.parameter, oApi);
		this.oTimeAxisDateConverter = new sap.apf.ui.representations.utils.TimeAxisDateConverter();
		this.oRepresentationFilterHandler = new sap.apf.ui.representations.utils.RepresentationFilterHandler(oApi, this.parameter, this.oTimeAxisDateConverter);
		this.chartInstance = {};
		this.chartParam = "";
		this.thumbnailChartParam = "";
		this.oApi = oApi;
		this.axisType = sap.apf.ui.utils.CONSTANTS.axisTypes.AXIS;
		this.topN = oParameters.top;
		this.apfId = ++idCounter;
	};
	BaseUI5ChartRepresentation.prototype = {
		/**
		* @method getParameter
		* @description returns the constructor arguments which will be used to create toggle representation.
		*/
		getParameter : function() {
			return this.parameter;
		},
		/**
		* @method setData
		* @param aDataResponse  Response from oData service
		* @param metadata Metadata of the oData service
		* @description Fetches the data from oData service and updates the selection if present
		* Handles data with multiple dimensions .
		*/
		setData : function(aDataResponse, metadata) {
			if (this.bIsAlternateView && this.toggleInstance && jQuery.isFunction(this.toggleInstance.setData)) {
				this.toggleInstance.setData(aDataResponse, metadata);
			} else {
				this.formatter = new sap.apf.ui.utils.formatter({
					getEventCallback : this.oApi.getEventCallback.bind(this.oApi),
					getTextNotHtmlEncoded : this.oApi.getTextNotHtmlEncoded,
					getExits : this.oApi.getExits()
				}, metadata, aDataResponse);
				this.oRepresentationFilterHandler.setMetadataAndDataResponse(metadata, aDataResponse);
				this.oRepresentationFilterHandler.validateFiltersWithDataset();
				// initialize chartdata set helper
				this.oChartDataSetHelper = new sap.apf.ui.representations.utils.ChartDataSetHelper(this.formatter, this.oTimeAxisDateConverter);
				this.oChartDataSetHelper.createFlattenDataSet(this.parameter, metadata, aDataResponse, this.oApi);
				if(this.chartType === sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.SCATTERPLOT || this.chartType === sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.BUBBLE){
					this.oChartDataSetHelper.addUnusedDimensionsToChartContext(metadata, aDataResponse);
				}
				this.aDataResponse = aDataResponse || [];
				this.metadata = metadata;
				if (!this.metadata) {
					this.oMessageObject = this.oApi.createMessageObject({
						code : "6004",
						aParameters : [ this.oApi.getTextNotHtmlEncoded("step") ]
					});
					this.oApi.putMessage(this.oMessageObject);
				}
			}
		},
		/**
		* @method attachSelectionAndFormatValue
		* @description formats the measure values for the chart and also attaches all the selection events for the chart
		*/
		attachSelectionAndFormatValue : function(oStepTitle) {
			var self = this;
			if (!oStepTitle) {
				this.oMessageObject = this.oApi.createMessageObject({
					code : "6002",
					aParameters : [ "title", this.oApi.getTextNotHtmlEncoded("step") ]
				});
				this.oApi.putMessage(this.oMessageObject);
			}
			if (!this.aDataResponse || this.aDataResponse.length === 0) {
				this.oMessageObject = this.oApi.createMessageObject({
					code : "6000",
					aParameters : [ oStepTitle ]
				});
				this.oApi.putMessage(this.oMessageObject);
			}
			/**
			* @method attachSelectData
			* @param event which is triggered on selection of data on chart
			* @description Adding selection to the chart based on the selected indices provided
			*/
			this.fnHandleSelection = this.handleSelection.bind(self);
			this.chart.attachSelectData(this.fnHandleSelection);
			/**
			* @method attachDeselectData
			* @param event handler on deselect of data
			* @description For deselect of data from the chart on user event
			*/
			this.fnHandleDeselection = this.handleDeselection.bind(self);
			this.chart.attachDeselectData(this.fnHandleDeselection);
		},
		/**
		* @method getFormatStringForMeasure
		* @param [measure] - a measure
		* @description gets the format string for axis label and tooltip
		* @return sFormatString , has the format string and also a boolean which indicated whether all the measure unit semantic are same or not
		*             sFormatString ="#,#0.0"
		*/
		getFormatStringForMeasure : function(measure) {
			var sFormatString = this.formatter.getFormatString(measure); // get the format string
			return sFormatString;
		},
		getFormatStringForMeasureTooltip : function(measure) {
			var sFormatStringTooltip = this.formatter.getFormatStringTooltip(measure); // get the format string for measure tooltip
			return sFormatStringTooltip;
		},
		getSelectionFilterLabel : function() {
			var sRequiredFilter = this.getParameter().requiredFilters[0];
			var sSelectedDimension = this.getSelectedFilterPropertyLabel(sRequiredFilter);
			if (this.getParameter().requiredFilterOptions && this.getParameter().requiredFilterOptions.fieldDesc) {
				sSelectedDimension = this.oApi.getTextNotHtmlEncoded(this.getParameter().requiredFilterOptions.fieldDesc);
			}
			return sSelectedDimension;
		},
		getSelectedFilterPropertyLabel : function(sRequiredFilter) {
			return _getNameOrLabelOfProperty(this, sRequiredFilter);
		},
		/**
		* @method getIsAllMeasureSameUnit
		* @description checks if all the measures have same unit semantic and sets a boolean accordingly
		* @retun bAllMeasuresSameUnit - boolean to indicate if all the measures have same unit semantic.
		 * This boolean is used to set the formatting to y axis only when all the measures have same unit (e.g. clustered column chart),
		* otherwise the formatting will not be applied to y axis.
		*/
		getIsAllMeasureSameUnit : function() {
			var bAllMeasuresSameUnit = true;
			var self = this;
			var firstMeasureUnitSemantic = this.metadata.getPropertyMetadata(this.measures[0].fieldName).unit ? this.metadata.getPropertyMetadata(this.metadata.getPropertyMetadata(this.measures[0].fieldName).unit).semantics : undefined;
			var measureUnitSemantic;
			this.measures.forEach(function(measure, index) {
				measureUnitSemantic = self.metadata.getPropertyMetadata(self.measures[index].fieldName).unit ? self.metadata.getPropertyMetadata(self.metadata.getPropertyMetadata(measure.fieldName).unit).semantics : undefined;
				if (bAllMeasuresSameUnit && firstMeasureUnitSemantic !== undefined && measureUnitSemantic && (firstMeasureUnitSemantic !== measureUnitSemantic)) {
					bAllMeasuresSameUnit = false; // bAllMeasuresSameUnit boolean is used to find out if there are measures with different unit semantics
				}
			});
			return bAllMeasuresSameUnit;
		},
		/**
		*@method createThumbnailLayout
		*@description creates a layout for Thumbnail for the current chart type and also shows "no data" in the thumbnail if data is not there 
		 */
		createThumbnailLayout : function() {
			if (!this.thumbnailChart) {
				return;
			}
			this.thumbnailLayout = new HorizontalLayout().addStyleClass('thumbnailLayout');
			this.thumbnailLayout.removeAllContent();
			if (this.aDataResponse !== undefined && this.aDataResponse.length !== 0) {
				this.thumbnailChart.setModel(this.oModel);
				this.thumbnailLayout.addContent(this.thumbnailChart);
				this.thumbnailChart.removeStyleClass('thumbnailNoData');
			} else {
				var noDataText = new Text({
					text : this.oApi.getTextNotHtmlEncoded("noDataText")
				}).addStyleClass('noDataText');
				this.thumbnailLayout.addContent(noDataText);
				this.thumbnailLayout.addContent(this.thumbnailChart);
				this.thumbnailChart.addStyleClass('thumbnailNoData');
			}
		},
		/**
		* @method getAlternateRepresentation
		* @description returns the alternate representation of current step (i.e. list representation for the charts)
		*/
		getAlternateRepresentation : function() {
			return this.alternateRepresentation;
		},
		/**
		* @description returns meta data for representation type
		*/
		getMetaData : function() {
			return this.metadata;
		},
		/**
		* @description returns data for representation type
		*/
		getData : function() {
			return this.aDataResponse;
		},
		/**
		* @method getRequestOptions
		* @description provide optional filter properties for odata request URL such as pagging, sorting etc
		*/
		getRequestOptions : function(bFilterChanged) {
			if (this.bIsAlternateView && this.toggleInstance && jQuery.isFunction(this.toggleInstance.getRequestOptions)) {
				return this.toggleInstance.getRequestOptions(bFilterChanged, this.bIsAlternateView);
			}
			var oOptions = {
				paging : {},
				orderby : []
			};
			if (this.orderby && this.orderby.length) {
				var aOrderbyProps = this.orderby.map(function(oOrderby) {
					return {
						property : oOrderby.property,
						ascending : oOrderby.ascending
					};
				});
				oOptions.orderby = aOrderbyProps;
			}
			if (this.topN && this.topN > 0) {
				oOptions.paging.top = this.topN;
			}
			return oOptions;
		},
		/**
		* @method createDataset
		* @description Intantiates the dataset to be consumed by the chart
		*/
		createDataset : function() {
			this.dataset = this.oChartDataSetHelper.getFlattenDataSet();
			this.oModel = this.oChartDataSetHelper.getModel();
		},
		/**
		* @method drawSelectionOnMainChart
		* @description Draws the selection on main chart when chart is loaded
		*/
		drawSelectionOnMainChart : function() {
			var aFilterValues = this.oRepresentationFilterHandler.getFilterValues();
			if (aFilterValues.length > 0) {
				var aSelections = this.oVizFrameSelectionHandler.getSelectionInfoFromFilter(aFilterValues, this.aDataResponse);
				this.setSelectionOnMainChart(aSelections);
			}
		},
		/**
		* @method drawSelectionOnThumbnailChart
		* @description Draws the selection on the thumbnail chart  when chart is loaded
		*/
		drawSelectionOnThumbnailChart : function() {
			var aFilterValues = this.oRepresentationFilterHandler.getFilterValues();
			if (aFilterValues.length > 0) {
				var aSelections = this.oVizFrameSelectionHandler.getSelectionInfoFromFilter(aFilterValues, this.aDataResponse);
				this.setSelectionOnThumbnailChart(aSelections, false);
			}
		},
		/**
		* @method handleSelection
		* @param event parameter with the selection data
		* @description  plots the selections made on the chart
		*/
		handleSelection : function(event) {
			this.manageSelectionsOnChart(event, false, this.parameter);
			this.chart.attachEvent("setFocusOnSelectedLinkEvent", this.chart.setFocusOnSelectLink);
		},
		/**
		* @method handleDeselection
		* @param event parameter with the deselection data
		* @description  de-selects the selected datapoints on the chart
		*/
		handleDeselection : function(event) {
			this.manageSelectionsOnChart(event, true, this.parameter);
			this.chart.attachEvent("setFocusOnSelectedLinkEvent", this.chart.setFocusOnSelectLink);
		},
		/**
		* @method getSelections
		* @description This method helps in determining the selection count, text and id of selected data of a representation
		* @returns the filter selections of the current representation.
		*/
		getSelections : function() {
			return this.oRepresentationFilterHandler.getDisplayInfoForFilters(this.metadata, this.oModel.getData().data);
		},
		/**
		* @method getSortedSelections
		* @description calls getSelections and sorts the values ascending to internal value (id)
		* @returns the filter selections of the current representation.
		*/
		getSortedSelections : function() {
			var labelDisplayOption;
			var selections = this.getSelections();
			if (!selections || selections.length === 0) {
				return [];
			}
			var parameter = this.getParameter();
			if(parameter.requiredFilterOptions && parameter.requiredFilterOptions.labelDisplayOption){
				labelDisplayOption = parameter.requiredFilterOptions.labelDisplayOption;
			}
			var requiredFilterProperty = this.getParameter().requiredFilters[0];
			var propertyMetadata = this.metadata.getPropertyMetadata(requiredFilterProperty);
			switch (labelDisplayOption) {
				case coreConstants.representationMetadata.labelDisplayOptions.TEXT:
					return sap.apf.utils.sortByProperty(selections, "text", this.metadata.getPropertyMetadata(propertyMetadata.text));
				case coreConstants.representationMetadata.labelDisplayOptions.KEY_AND_TEXT:
					return sap.apf.utils.sortByProperty(selections, "text");
				default:
					return sap.apf.utils.sortByProperty(selections, "id", propertyMetadata);
			}
		},
		getSelectionCount : function() {
			return this.oRepresentationFilterHandler.getFilterValues().length;
		},
		/**
		* @method removeAllSelection
		* @description removes all Selection from Chart
		*/
		removeAllSelection : function() {
			this.setSelectionOnThumbnailChart([], false);
			this.setSelectionOnMainChart([], true);
		},
		/**
		* @method getFilterMethodType
		* @description This method helps in determining which method has to be used for the filter retrieval from a representation.
		* @returns {sap.apf.constants.filterMethodTypes} The filter method type the representation supports
		*/
		getFilterMethodType : function() {
			return sap.apf.core.constants.filterMethodTypes.filter; // returns the filter method type the representation supports
		},
		getFilter : function() {
			this.filter = this.oRepresentationFilterHandler.createFilterFromSelectedValues();
			return this.filter;
		},
		/**
		* @method setFilter
		* @param {sap.apf.utils.Filter} oFilter
		* @description sets the initial filter to the representation. The filter holds the values of the start filter of the path.
		*/
		setFilter : function(oFilter) {
			this.filter = oFilter;
		},
		/**
		* @method adoptSelection
		* @param {object} oSourceRepresentation Source representation implementing the representationInterface.
		* @description Called on representation by binding when a representation type is set.
		*/
		adoptSelection : function(oSourceRepresentation) {
			if (oSourceRepresentation && oSourceRepresentation.getFilter) {
				var afilterValues = oSourceRepresentation.getFilter().getInternalFilter().getFilterTerms().map(function(term) {
					return term.getValue();
				});
				this.oRepresentationFilterHandler.updateFilterFromSelection(afilterValues);
			}
		},
		/**
		* @method serialize
		* @description Getter for Serialized data for a representation
		* @returns selectionObject
		*/
		serialize : function() {
			var orderby = this.parameter.orderby;
			if (this.toggleInstance) {
				orderby = this.toggleInstance.orderby;
			}
			return {
				oFilter : this.oRepresentationFilterHandler.getFilterValues(),
				bIsAlternateView : this.bIsAlternateView,
				orderby : orderby
			};
		},
		/**
		* @method deserialize
		* @description This method uses selection object from serialized data and sets the selection to representation
		*/
		deserialize : function(oSerializable) {
			this.oRepresentationFilterHandler.updateFilterFromSelection(oSerializable.oFilter);
			this.bIsAlternateView = oSerializable.bIsAlternateView;
			if (this.bIsAlternateView) {
				this.toggleInstance = this.oApi.getUiApi().getStepContainer().getController().createToggleRepresentationInstance(this, oSerializable.orderby);
			}
		},
		getPrintContent : function() {
		},
		onChartSwitch : function() {
		},
		/**
		* @method destroy
		* @description Destroying instances
		*/
		destroy : function() {
			this.dataset = null;
			if (this.formatter) {
				this.formatter = null;
			}
			if (this.oRepresentationFilterHandler) {
				this.oRepresentationFilterHandler.aFilterValues = [];
				this.oRepresentationFilterHandler = null;
			}
			if (this.chart) {
				this.chart.detachSelectData(this.fnHandleSelection);
				this.fnHandleSelection = null;
				this.chart.detachDeselectData(this.fnHandleDeselection);
				this.fnHandleDeselection = null;
				this.chart.destroy();
				this.chart = null;
			}
			if (this.thumbnailChart) {
				this.thumbnailChart.destroy();
				this.thumbnailChart = null;
			}
			if (this.thumbnailLayout) {
				this.thumbnailLayout.removeAllContent();
			}
		}
	};
	return BaseUI5ChartRepresentation;
}, true /* Global_Export*/);