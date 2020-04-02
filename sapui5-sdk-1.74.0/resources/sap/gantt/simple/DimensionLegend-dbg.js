/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(["sap/ui/core/Control", "sap/gantt/library"], function(Control, library) {
	"use strict";

	/**
	 * Creates and initializes a new Dimension Legend class.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Dimension Legend provides a template for two-dimension legends. This template defines the representation (shape,
	 * pattern, and color) of individual legend items and their corresponding meanings in both dimensions.
	 *
	 * Consider that you need to create a legend where legend items represent both the type and status of an object.
	 * In this case, you can configure column to indicate object statuses and row to indicate object types.
	 * Assume that valid object types are "Freight Order", "Freight Unit", and "Trailer Unit"; valid object statuses are
	 * "Executed", "In Execution", "Fixed", "Planned", and “Unplanned”. You will have a three by four two-dimension legend
	 * containing twelve legend items. Each them represents an object in a specific type and a specific status. For
	 * example, a red square stands for executed freight orders.
	 *
	 * @extends sap.ui.core.Control
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.DimensionLegend
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DimensionLegend = Control.extend("sap.gantt.simple.DimensionLegend",
	{
		metadata: {

			library: "sap.gantt",
			properties: {
				/**
				 *  Title of Legend Page & text of navigation list item (if not set it will be empty)
				 */
				title: {type: "string", group: "Data", defaultValue: null}
			},
			aggregations: {

				/**
				 * Legend column configuration
				 */
				columnConfigs: {
					type: "sap.gantt.simple.LegendColumnConfig",
					multiple: true,
					singularName: "columnConfig"
				},

				/**
				 * Legend row configuration
				 */
				rowConfigs: {
					type: "sap.gantt.simple.LegendRowConfig",
					multiple: true,
					singularName: "rowConfig"
				}
			},
			events: {}
		}
	});

	return DimensionLegend;

});
