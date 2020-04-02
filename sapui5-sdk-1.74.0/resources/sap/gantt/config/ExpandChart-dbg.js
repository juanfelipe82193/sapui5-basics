/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'sap/ui/core/Element'
], function (Element) {
	"use strict";
	/**
	 * Creates and initializes a new expand chart
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Defines the expand chart which is used by {@link sap.gantt.config.ExpandChartGroup}.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.config.ExpandChart
	 */
	var ExpandChart = Element.extend("sap.gantt.config.ExpandChart", /** @lends sap.gantt.config.ExpandChart.prototype */ {

		metadata: {
			properties: {
				/**
				 * URL of the icon of the expand chart
				 */
				icon: {type: "sap.ui.core.URI", defaultValue: null},

				/**
				 * Specifies whether the action is to expand or to collapse a row in the chart.
				 */
				isExpand: {type: "boolean", defaultValue: null},

				/**
				 * Array of key of {@link sap.gantt.config.ChartScheme}
				 */
				chartSchemeKeys: {type: "string[]", defaultValue: []}
			}
		}
	});

	return ExpandChart;
}, true);
