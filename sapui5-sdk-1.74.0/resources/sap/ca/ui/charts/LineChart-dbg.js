/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.charts.LineChart.
jQuery.sap.declare("sap.ca.ui.charts.LineChart");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.ca.ui.charts.Chart");


/**
 * Constructor for a new charts/LineChart.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Line Chart for the Fiori Project
 * @extends sap.ca.ui.charts.Chart
 *
 * @constructor
 * @public
 * @since 1.0.0
 * @deprecated Since version 1.24. 
 * 
 * Sap.ca charts have been replaced with sap.viz and vizFrame in 1.24.
 * The UI5 control "sap.viz.ui5.controls.VizFrame" serves as a single point of entry for all the new charts.
 * Now that 1.24 is available you are asked to use sap.viz charts and the VizFrame instead!
 * This control will not be supported anymore from 1.24.
 * @name sap.ca.ui.charts.LineChart
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ca.ui.charts.Chart.extend("sap.ca.ui.charts.LineChart", /** @lends sap.ca.ui.charts.LineChart.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * The title to display on the chart
		 * @deprecated Since version 1.0.0. 
		 * This is a copy of the 'title' property, do not use as it will be removed in a future release.
		 */
		chartTitle : {type : "string", group : "Data", defaultValue : 'Line Chart', deprecated: true},

		/**
		 * The data format string to use to display the data labels on the graph, this is an array of arrays of Format String following the 'sap.viz.ui5.Line' documentation
		 */
		dataLabelFormat : {type : "any", group : "Appearance", defaultValue : '#0'},

		/**
		 * The minimum size (width for a line chart) that a point has to be, so as to be able to touch on a mobile device, only applies if the chart width is not set
		 * @deprecated Since version 1.0.0. 
		 * Please use the 'dataLabelFormatter' property, do not use as it will be removed in a future release.
		 */
		minTouchSize : {type : "string", group : "Behavior", defaultValue : '48px', deprecated: true},

		/**
		 * The minimum size (width for a line chart) that a point has to be, so as to be able to touch on a mobile device, only applies if the chart width is not set
		 * @deprecated Since version 1.0.0. 
		 * Please use the 'minShapeSize' property, do not use as it will be removed in a future release.
		 */
		minTouchWidth : {type : "string", group : "Behavior", defaultValue : '48px', deprecated: true},

		/**
		 * Show the data label value on the chart
		 * @deprecated Since version 1.0.0. 
		 * This is a copy of the 'showDataLabel' property, do not use as it will be removed in a future release.
		 */
		showLabel : {type : "boolean", group : "Appearance", defaultValue : true, deprecated: true},

		/**
		 * Show the chart scroll context, (the preview of the whole chart as a small image when scrolling)
		 * @deprecated Since version 1.0.0. 
		 * Feature does not work correctly yet.
		 */
		showScrollContext : {type : "boolean", group : "Appearance", defaultValue : false, deprecated: true},

		/**
		 * Allow the Dataset for the chart to be set, includes the dimensions, and measures, any data binding is removed, this will disable the chart scroll context view,
		 * use the dataset settings if you want the
		 * scroll context to work
		 * @deprecated Since version 1.0.0. 
		 * This is a copy of the 'dataset' property, do not use as it will be removed in a future release.
		 */
		chartDataset : {type : "any", group : "Data", defaultValue : null, deprecated: true},

		/**
		 * Allow the Dataset for the chart to be set by providing the settings for the dataset creation, (internally two datasets are created, one for the main chart and
		 * one
		 * for the scroll context)
		 * @deprecated Since version 1.0.0. 
		 * This is property is not needed any more, do not use as it will be removed in a future release.
		 */
		datasetSettings : {type : "any", group : "Data", defaultValue : null, deprecated: true},

		/**
		 * Allow the Dataset for the chart to be set by providing the settings for the dataset creation, (internally two datasets are created, one for the main chart and
		 * one for the scroll context)
		 * @deprecated Since version 1.0.0. 
		 * This is a copy of the 'datasetSettings' property, do not use as it will be removed in a future release.
		 */
		chartDatasetSettings : {type : "any", group : "Data", defaultValue : null, deprecated: true},

		/**
		 * Allow the data path for binding the model to the dimensions and measures to be set
		 * @deprecated Since version 1.0.0. 
		 * Please use the binding on 'dataset', do not use as it will be removed in a future release.
		 */
		dataPath : {type : "string", group : "Data", defaultValue : null, deprecated: true},

		/**
		 * Allow the chart data to be set, that is the measure and dimension values
		 * @deprecated Since version 1.0.0. 
		 * Please use the binding on 'dataset', do not use as it will be removed in a future release.
		 */
		data : {type : "any", group : "Data", defaultValue : null, deprecated: true},

		/**
		 * Allow the chart data to be set, that is the measure and dimension values
		 * @deprecated Since version 1.0.0. 
		 * This is a copy of the 'data' property, do not use as it will be removed in a future release.
		 */
		chartBusinessData : {type : "any", group : "Data", defaultValue : null, deprecated: true},

		/**
		 * Use a delayed resize event to cause the chart to render when navigated to after resize when in the background
		 * @deprecated Since version 1.0.0. 
		 * Do not use as it will be removed in a future release.
		 */
		useDelayedResize : {type : "boolean", group : "Behavior", defaultValue : false, deprecated: true}
	},
	aggregations : {

		/**
		 * The vertical layout
		 * @deprecated Since version 1.0.0. 
		 * Do not use as it will be removed in a future release.
		 */
		vertical : {type : "sap.m.VBox", multiple : false, deprecated: true}
	},
	events : {

		/**
		 * Event fired when the details button is pressed on the selected Datapoint Popover
		 * @deprecated Since version 1.0.0. 
		 * Do not use as it will be removed in a future release.
		 */
		onDetailsSelected : {deprecated: true}
	}
}});

sap.ca.ui.charts.LineChart.prototype.init = function() {
    sap.ca.ui.charts.Chart.prototype.init.apply(this);
    this.setChartType("Line");
};
/* Deprecated Aggregations */
sap.ca.ui.charts.LineChart.prototype.setVertical = function( args ){
    jQuery.sap.log.warning("Vertical aggregation is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getVertical = function() {
    jQuery.sap.log.warning("Vertical aggregation is deprecated");
    return null;
};
/* Deprecated events */
sap.ca.ui.charts.LineChart.prototype.attachOnDetailsSelected = function(){
    jQuery.sap.log.warning("onDetailsSelected event is deprecated");
};
/* Deprecated properties */
sap.ca.ui.charts.LineChart.prototype.setUseDelayedResize = function( args ){
    jQuery.sap.log.warning("UseDelayedResize property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getUseDelayedResize = function() {
    jQuery.sap.log.warning("UseDelayedResize property is deprecated");
    return null;
};

sap.ca.ui.charts.LineChart.prototype.setChartBusinessData = function( args ){
    jQuery.sap.log.warning("ChartBusinessData property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getChartBusinessData = function() {
    jQuery.sap.log.warning("ChartBusinessData property is deprecated");
    return null;
};

sap.ca.ui.charts.LineChart.prototype.setData = function( args ){
    jQuery.sap.log.warning("Data property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getData = function() {
    jQuery.sap.log.warning("Data property is deprecated");
    return null;
};


sap.ca.ui.charts.LineChart.prototype.setDataPath = function( args ){
    jQuery.sap.log.warning("DataPath property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getDataPath = function() {
    jQuery.sap.log.warning("DataPath property is deprecated");
    return null;
};


sap.ca.ui.charts.LineChart.prototype.setChartDatasetSettings = function( args ){
    jQuery.sap.log.warning("ChartDatasetSettings property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getChartDatasetSettings = function() {
    jQuery.sap.log.warning("ChartDatasetSettings property is deprecated");
    return null;
};


sap.ca.ui.charts.LineChart.prototype.setDatasetSettings = function( args ){
    jQuery.sap.log.warning("DatasetSettings property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getDatasetSettings = function() {
    jQuery.sap.log.warning("DatasetSettings property is deprecated");
    return null;
};

sap.ca.ui.charts.LineChart.prototype.setChartDataset = function( args ){
    jQuery.sap.log.warning("ChartDataset property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getChartDataset = function() {
    jQuery.sap.log.warning("ChartDataset property is deprecated");
    return null;
};

sap.ca.ui.charts.LineChart.prototype.setShowScrollContext = function( args ){
    jQuery.sap.log.warning("Vertical property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getVertical = function() {
    jQuery.sap.log.warning("Vertical property is deprecated");
    return null;
};

sap.ca.ui.charts.LineChart.prototype.setShowLabel = function( args ){
    jQuery.sap.log.warning("ShowLabel property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getShowLabel = function() {
    jQuery.sap.log.warning("ShowLabel property is deprecated");
    return null;
};

sap.ca.ui.charts.LineChart.prototype.setMinTouchWidth = function( args ){
    jQuery.sap.log.warning("MinTouchWidth property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getMinTouchWidth = function() {
    jQuery.sap.log.warning("MinTouchWidth property is deprecated");
    return null;
};

sap.ca.ui.charts.LineChart.prototype.setMinTouchSize = function( args ){
    jQuery.sap.log.warning("MinTouchSize property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getMinTouchSize = function() {
    jQuery.sap.log.warning("MinTouchSize property is deprecated");
    return null;
};

sap.ca.ui.charts.LineChart.prototype.setDataLabelFormat = function( args ){
    jQuery.sap.log.warning("DataLabelFormat property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getDataLabelFormat = function() {
    jQuery.sap.log.warning("DataLabelFormat property is deprecated");
    return null;
};

sap.ca.ui.charts.LineChart.prototype.setChartTitle = function( args ){
    jQuery.sap.log.warning("ChartTitle property is deprecated");
};
sap.ca.ui.charts.LineChart.prototype.getChartTitle = function() {
    jQuery.sap.log.warning("ChartTitle property is deprecated");
    return null;
};