/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(["sap/ui/core/Element"], function(Element) {
	"use strict";

	/**
	 * Constructor for LegendRowConfig.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class
	 *
	 * Shapes in one horizontal line(row) share the same shape class and shape name. Each LegendRowConfig affects one row.
	 *
	 * @extends sap.ui.core.Element
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.LegendRowConfig
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var LegendRowConfig = Element.extend("sap.gantt.simple.LegendRowConfig", {
		metadata: {
			library: "sap.gantt",
			properties: {

				/**
				 * Specifies the shape class name of dimension legend row
				 * It's a full shape module name
				 */
				shapeClass: { type: "string" },

				/**
				 * Specifies the name of the dimension legend row
				 */
				shapeName: { type: "string" },

				/**
				 * Stroke of the legend row
				 */
				stroke: { type: "string" },

				/**
				 * The strokeWidth property is a presentation property defining the width of the stroke to be applied to the shape.
				 */
				strokeWidth: { type: "float" },

				/**
				 * The text content
				 */
				text: { type: "string" }
			}
		}
	});

	return LegendRowConfig;
}, true);
