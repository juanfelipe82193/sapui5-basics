/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(["sap/ui/core/Element"], function(Element) {
	"use strict";

	/**
	 * Constructor for LegendColumnConfig.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class
	 *
	 * Enable users to define properties for shapes in one vertical line(column), each LegendColumnConfig affects one column.
	 *
	 * @extends sap.ui.core.Element
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.LegendColumnConfig
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var LegendColumnConfig = Element.extend("sap.gantt.simple.LegendColumnConfig", /**@lends sap.gantt.simple.LegendColumnConfig */{
		metadata: {
			library: "sap.gantt",
			properties: {

				/**
				 * Once this property is set, shapes in one vertical line have the same fill color or fill pattern.
				 */
				fill: {
					type: "string"
				},

				text: {
					type: "string"
				},

				/**
				 * Factory function is used to determine the fill property for different shape classes defined in yDimension config.
				 * Shape name of the shape class is passed as a parameter to the function.
				 * The return value should be a color code.
				 */
				fillFactory: {
					type: "function"
				}
			}
		}
	});

	return LegendColumnConfig;
}, true);
