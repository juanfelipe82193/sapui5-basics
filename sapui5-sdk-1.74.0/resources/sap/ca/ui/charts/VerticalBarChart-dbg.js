/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.charts.VerticalBarChart.
jQuery.sap.declare("sap.ca.ui.charts.VerticalBarChart");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.ca.ui.charts.Chart");


/**
 * Constructor for a new charts/VerticalBarChart.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Allows you to create a chart using vertical bars to represent the data
 * @extends sap.ca.ui.charts.Chart
 *
 * @constructor
 * @public
 * @deprecated Since version 1.24. 
 * 
 * Sap.ca charts have been replaced with sap.viz and vizFrame in 1.24.
 * The UI5 control "sap.viz.ui5.controls.VizFrame" serves as a single point of entry for all the new charts.
 * Now that 1.24 is available you are asked to use sap.viz charts and the VizFrame instead!
 * This control will not be supported anymore from 1.24.
 * @name sap.ca.ui.charts.VerticalBarChart
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ca.ui.charts.Chart.extend("sap.ca.ui.charts.VerticalBarChart", /** @lends sap.ca.ui.charts.VerticalBarChart.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * The data to be used by the chart
		 */
		data : {type : "object", group : "Data", defaultValue : null},

		/**
		 * The DOM ID where the chart will be added. Deprecated
		 */
		container : {type : "string", group : "Identification", defaultValue : 'chart'},

		/**
		 * Minimum shape size for touch enabled actions, default and minimum to 48px !
		 */
		barWidth : {type : "int", group : "Appearance", defaultValue : 48}
	},
	aggregations : {

		/**
		 * Deprecated aggregation. Left for compatibility purposes.
		 * @deprecated Since version 7.20.0. 
		 * This method is deprecated now.
		 */
		content : {type : "sap.ui.core.Control", multiple : true, singularName : "content", deprecated: true}, 

		/**
		 * The scroll container
		 * @deprecated Since version 7.20.0. 
		 * This method is deprecated now.
		 */
		scroll : {type : "sap.m.ScrollContainer", multiple : false, deprecated: true}, 

		/**
		 * The chart
		 * @deprecated Since version 7.20.0. 
		 * This method is deprecated now.
		 */
		verticalBarChart : {type : "sap.viz.ui5.Column", multiple : false, deprecated: true}, 

		/**
		 * The vertical layout
		 * @deprecated Since version 7.20.0. 
		 * This method is deprecated now.
		 */
		verticalArea : {type : "sap.m.VBox", multiple : false, deprecated: true}
	}
}});


/**
 * @name ap.ca.ui.charts.VerticalBarChart#init
 * @function
 */
sap.ca.ui.charts.VerticalBarChart.prototype.init = function() {
    sap.ca.ui.charts.Chart.prototype.init.apply(this);
    this.setChartType("Column");
};

sap.ca.ui.charts.VerticalBarChart.prototype.setData = function(oData){
    this._oInternalVizChart.setModel(oData);
};

sap.ca.ui.charts.VerticalBarChart.prototype.getContainer = function(){
    return this.getId();
};

sap.ca.ui.charts.VerticalBarChart.prototype.setContainer = function(sId){
    jQuery.sap.log.warning("Usage of deprecated feature, please use instead the generated ID : "+ this.getId());
};

sap.ca.ui.charts.VerticalBarChart.prototype.setBarWidth = function(iBarWidth){
    this.setProperty("minShapeSize", iBarWidth);
};

sap.ca.ui.charts.VerticalBarChart.prototype.getBarWidth = function(){
    return this.getProperty("minShapeSize");
};

sap.ca.ui.charts.VerticalBarChart.prototype.setContent = function(oContent){
    jQuery.sap.log.warning("Usage of deprecated feature, please use setAggregation('internalContent')");
};

sap.ca.ui.charts.VerticalBarChart.prototype.getContent = function(){
    jQuery.sap.log.warning("Usage of deprecated feature please use getAggregation('internalContent')");
    return null;
};

sap.ca.ui.charts.VerticalBarChart.prototype.setScroll = function(oScroll){
    jQuery.sap.log.warning("Usage of deprecated feature please use setAggregation('internalContent')");
};

sap.ca.ui.charts.VerticalBarChart.prototype.getScroll = function(){
    return this.getAggregation("internalContent");
};

sap.ca.ui.charts.VerticalBarChart.prototype.getVerticalBarChart = function(){
    return this.getAggregation("internalVizChart");
};

sap.ca.ui.charts.VerticalBarChart.prototype.setVerticalBarChart = function(oVerticalBarChart){
    this.setAggregation("internalVizChart", oVerticalBarChart);
};

sap.ca.ui.charts.VerticalBarChart.prototype.getVerticalArea = function(){
    jQuery.sap.log.warning("Usage of deprecated feature please use getAggregation('internalContent')");
    return null;
};

sap.ca.ui.charts.VerticalBarChart.prototype.setVerticalArea = function(oVerticalArea){
    jQuery.sap.log.warning("Usage of deprecated feature, please use setAggregation('internalContent')");
};
