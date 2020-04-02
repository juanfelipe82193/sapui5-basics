/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element"], function(Element){
	"use strict";

	/**
	 * Constructor for a new Utilization Dimension
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Used for creating a utilization dimension for the {@link sap.gantt.simple.UtilizationLineChart}
	 * It's derived from the {@link sap.ui.core.Element}
	 *
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.UtilizationDimension
	 */
	var UtilizationDimension = Element.extend("sap.gantt.simple.UtilizationDimension", {
		metadata: {
			properties: {

				/**
				 * The name of the utilization dimension, e.g. Total Weight
				 */
				name: {type: "string"},

				/**
				 * Sets the dimension color
				 */
				dimensionColor: {type: "sap.gantt.ValueSVGPaintServer"}
			},
			defaultAggregation: "periods",
			aggregations:{

				/**
				 * Aggregation of periods are used to display the utilization line.
				 *
				 * The periods have to be in chronological order, you must ensure that it's sorted by <code>from</code>,
				 * otherwise the ULC can't ben display correctly.
				 */
				periods: {type: "sap.gantt.simple.UtilizationPeriod"}
			}
		}
	});

	return UtilizationDimension;
}, /**bExport*/true);
