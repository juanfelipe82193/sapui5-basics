/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.charts.StackedHorizontalBarChart.
jQuery.sap.declare("sap.ca.ui.charts.StackedHorizontalBarChart");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.ca.ui.charts.Chart");


/**
 * Constructor for a new charts/StackedHorizontalBarChart.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Stacked Horizontal Bar Chart wrapper around the viz StackedBarChart / MultipleStackedBarChart.
 * To be used in conjunction with the chart toolbar.
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
 * @name sap.ca.ui.charts.StackedHorizontalBarChart
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ca.ui.charts.Chart.extend("sap.ca.ui.charts.StackedHorizontalBarChart", /** @lends sap.ca.ui.charts.StackedHorizontalBarChart.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * Mapped to charType property.
		 * @deprecated Since version 1.16.3. 
		 * 
		 * type has been deprecated since 1.16.3. Please use the chartType instead.
		 */
		type : {type : "string", group : "Designtime", defaultValue : 'StackedBar', deprecated: true},

		/**
		 * Mapped to minShapeSize property.
		 * @deprecated Since version 1.16.3. 
		 * 
		 * minTouchSize has been deprecated since 1.16.3. Please use the minShapeSize instead.
		 */
		minTouchSize : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '48px', deprecated: true},

		/**
		 * Defines the formater string for the dataLabel value to be diaplyed on the bubble e.g [ [##]]
		 */
		dataLabelFormat : {type : "any", group : "Appearance", defaultValue : [["##"]]}
	},
	aggregations : {

		/**
		 * Deprecated aggregation. Left for compatibility purposes.
		 * @deprecated Since version 1.16.3. 
		 * 
		 * content has been deprecated since 1.16.3. The only visible content in the chart now is the internalVizChart.
		 */
		content : {type : "sap.ui.core.Control", multiple : true, singularName : "content", deprecated: true}
	}
}});

jQuery.sap.require("sap.ca.ui.charts.ChartType");

sap.ca.ui.charts.StackedHorizontalBarChart.prototype.setType = function (sValue) {
    var sChartType = "";
    switch (sValue) {
        case "viz/stacked_bar":
            sChartType = sap.ca.ui.charts.ChartType.StackedBar;
            break;
        case "viz/100_stacked_bar":
            sChartType = sap.ca.ui.charts.ChartType.StackedBar100;
            break;
        case "viz/dual_stacked_bar":
            sChartType = sap.ca.ui.charts.ChartType.DualStackedBar;
            break;
        case "viz/100_dual_stacked_bar":
            sChartType = sap.ca.ui.charts.ChartType.DualStackedBar100;
            break;

    }
    this.setProperty("chartType", sChartType);
    return this;
};

sap.ca.ui.charts.StackedHorizontalBarChart.prototype.getType = function () {
    return this.getChartType();
};

sap.ca.ui.charts.StackedHorizontalBarChart.prototype.setMinTouchSize = function (sValue) {
    this.setMinShapeSize(sValue);
    return this;
};

sap.ca.ui.charts.StackedHorizontalBarChart.prototype.getMinTouchSize = function () {
    return this.getMinShapeSize();
};


sap.ca.ui.charts.StackedHorizontalBarChart.prototype.setDataLabelFormat = function (oFormat) {
    jQuery.sap.log.warning("This method has been deprectated. Please use dataLabelFormatter");
};
