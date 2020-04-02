/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.charts.CombinedChart.
jQuery.sap.declare("sap.ca.ui.charts.CombinedChart");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.ca.ui.charts.Chart");


/**
 * Constructor for a new charts/CombinedChart.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Allows you to create a chart using vertical bars and lines to represent the data
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
 * @name sap.ca.ui.charts.CombinedChart
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ca.ui.charts.Chart.extend("sap.ca.ui.charts.CombinedChart", /** @lends sap.ca.ui.charts.CombinedChart.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * Data of the Chart
		 */
		data : {type : "any", group : "Data", defaultValue : null},

		/**
		 * Shapes for the internal viz chart primary axis
		 */
		primaryAxis : {type : "any", group : "Appearance", defaultValue : null},

		/**
		 * Shapes for the internal viz chart second axis
		 */
		secondAxis : {type : "any", group : "Appearance", defaultValue : null}
	},
	aggregations : {

		/**
		 * scroll area that contains the graph plot
		 */
		scrollArea : {type : "sap.m.ScrollContainer", multiple : false}
	}
}});


sap.ca.ui.charts.CombinedChart.prototype.init = function () {
    sap.ca.ui.charts.Chart.prototype.init.apply(this);
    this.setChartType("Combination");
};

sap.ca.ui.charts.CombinedChart.prototype._getChartSettings = function () {
    var chartSettings = sap.ca.ui.charts.Chart.prototype._getChartSettings.call(this);
    if (typeof chartSettings.plotArea === "undefined") {
        chartSettings.plotArea = {};
    }
    if( this.getPrimaryAxis() != null  ){
        if (typeof chartSettings.plotArea.dataShape === "undefined") {
            chartSettings.plotArea.dataShape = {};
        }
        chartSettings.plotArea.dataShape.primaryAxis = this.getPrimaryAxis();
    }
    if( this.getSecondAxis() != null  ){
        if (typeof chartSettings.plotArea.dataShape === "undefined") {
            chartSettings.plotArea.dataShape = {};
        }
        chartSettings.plotArea.dataShape.secondAxis = this.getSecondAxis();
    } // Line settings
    chartSettings.plotArea.line = {
        marker: {
            visible: true,
            size: this._getMarkerSize()
        }
    };
    return chartSettings;
};

sap.ca.ui.charts.CombinedChart.prototype.setData = function (oData) {
    this._oInternalVizChart.setModel(oData);
};

sap.ca.ui.charts.CombinedChart.prototype.getScrollArea = function () {
    return this.getAggregation("internalContent");
};

sap.ca.ui.charts.CombinedChart.prototype.setScrollArea = function (oScrollArea) {
    jQuery.sap.log.warning("Usage of deprecated feature, please use instead : this.setAggregation('internalContent')");
};






