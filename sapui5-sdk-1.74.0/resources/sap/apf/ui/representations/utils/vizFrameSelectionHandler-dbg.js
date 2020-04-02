/*!

 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP SE. All rights reserved
 */
/* globals sap */
sap.ui.define([
	"sap/apf/ui/representations/utils/chartDataSetHelper"
	], function(ChartDataSetHelper ) {
	'use strict';

	function VizFrameSelectionHandler(oParameter, oApi) {
		this.oParameter = oParameter;
		this.oApi = oApi;
	}

	var selectionHandlerPrototype = VizFrameSelectionHandler.prototype;
	selectionHandlerPrototype.constructor = VizFrameSelectionHandler;

	var local = {
		isFilterMatch : function (parameters) {
			var filterValue = parameters.filterValue;
			var dataRow = parameters.dataRow;
			var sRequiredProperty = parameters.sRequiredProperty;
			var fieldForOriginalValue = parameters.fieldForOriginalValue;
			// in the following happens a type cast from Date to string.
			return (filterValue == dataRow[sRequiredProperty] || filterValue == dataRow[fieldForOriginalValue]);
		},
		determine1Selection : function (parameters){
			var dataRow = parameters.dataRow;
			var sRequiredProperty = parameters.sRequiredProperty;
			var aDataPoint = parameters.aDataPoint;
			if (local.isFilterMatch(parameters)) {
				var selectionData = {
					data : {}
				};
				selectionData.data[sRequiredProperty] = dataRow[sRequiredProperty];
				aDataPoint.push(selectionData);
			}
		}
	};

	function _createDataPointsFromSelectionEvent(sRequiredProperty, aSelectedDataPoint) {
		var dataPointsFromSelection = [];
		aSelectedDataPoint.forEach(function(item) {
			var selectionData = {
				data : {}
			};
			selectionData.data[sRequiredProperty] = item.data ? item.data[sRequiredProperty] : item;
			dataPointsFromSelection.push(selectionData);
		});
		return dataPointsFromSelection;
	}

	function _getUniqueFilters(aFilterValues) {
		return aFilterValues.filter(function(item, nIndex, array) {
			return array.indexOf(item) === nIndex;
		});
	}
	/**
	* @param oCurrentSelectionEvent - selection event from the chart
	* @param bIsCalledFromDeselection - boolean to check if the call is from deselection event 
	* @param aChartSelections - all the available (previous) selection on chart
	* @description finds all the data rows in the data response based on the selection/deselection made on the chart (series, category selection)
	* @returns  {{dataPointsFromSelection, aUniqueFilterValueFromChart}}
	*  - all the data point with the value of filter in selection event, array of unique filters from the selection event
	*
	**/
	selectionHandlerPrototype.getSelectionInfoFromEvent = function(oCurrentSelectionEvent, bIsCalledFromDeselection, aChartSelections) {
		var dataPointsFromSelection, aExclusiveFilters, oSelectionHandlerInstance = this;
		var sRequiredProperty = oSelectionHandlerInstance.oParameter.requiredFilters[0];
		var aCurrentFilterFromEvent = oCurrentSelectionEvent.mParameters.data.map(function(selection) {
			return selection.data[sRequiredProperty];
		});
		var aPreviousFiltersFromChart = aChartSelections.map(function(selection) {
			return selection.data[sRequiredProperty];
		});
		if (bIsCalledFromDeselection) { //remove the filters from existing list if deselection
			aExclusiveFilters = _getUniqueFilters(aPreviousFiltersFromChart).filter(function(item) {
				return aCurrentFilterFromEvent.indexOf(item) === -1;
			});
		} else {//add the filters in existing list if selection
			aExclusiveFilters = _getUniqueFilters(aCurrentFilterFromEvent.concat(aPreviousFiltersFromChart));
		}
		dataPointsFromSelection = _createDataPointsFromSelectionEvent(sRequiredProperty, aExclusiveFilters);
		return {
			dataPointsFromSelection : dataPointsFromSelection,
			aUniqueFilterValueFromChart : aExclusiveFilters
		};
	};
	/**
	 * @description finds all the data rows with the given filters.
	 * @param aFilters - filter values from a chart
	 * @param aDataResponse - the data response of a chart
	 * @param {sap.apf.ui.representations.utils.TimeAxisDateConverter} oTimeAxisDateConverter
	 * @returns aDataPoint - these data points are used to highlight the data points on the chart after it is rendered (used while loading a saved path with selection).
	**/
	selectionHandlerPrototype.getSelectionInfoFromFilter = function(aFilters, aDataResponse, oTimeAxisDateConverter) {
		var aDataPoint = [];
		var sRequiredProperty = this.oParameter.requiredFilters[0];
		var fieldForOriginalValue = sap.apf.ui.representations.utils.ChartDataSetHelper.getFieldNameForOriginalContentOfProperty(sRequiredProperty);
		if (sRequiredProperty) {
			aDataResponse.forEach(function (dataRow) {
				aFilters.forEach(function (filterValue) {
					local.determine1Selection({
						dataRow: dataRow,
						filterValue: filterValue,
						sRequiredProperty: sRequiredProperty,
						aDataPoint: aDataPoint,
						fieldForOriginalValue: fieldForOriginalValue
					});
				});
			});
		}
		return aDataPoint;
	}

	/**
	 * @description Shall be used in unit tests only, not allowed for productive usage.
	 * @returns {{isFilterMatch: (function(*): boolean), determine1Selection: determine1Selection}}
	 * @private
	 */
	function _getLocal(){
		return local;
	}

	/*BEGIN_COMPATIBILITY*/
	sap.apf.ui.representations.utils.VizFrameSelectionHandler = VizFrameSelectionHandler;
	/*END_COMPATIBILITY*/

	return {
		constructor: VizFrameSelectionHandler,
		_getLocal : _getLocal
	};
}, true /*GLOBAL_EXPORT*/);