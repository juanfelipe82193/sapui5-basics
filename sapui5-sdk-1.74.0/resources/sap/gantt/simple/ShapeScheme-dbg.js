/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/Element'], function (Element) {
	"use strict";

	/**
	 * Creates and initializes a new ShapeScheme class
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The ShapeScheme class will be defined as an aggregation on <code>sap.gantt.simple.GanttChartWithTable</code>
	 * It's used to determine the overall row height, the expandable shapes row height
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.ShapeScheme
	 */
	var ShapeScheme = Element.extend("sap.gantt.simple.ShapeScheme", /** @lends sap.gantt.config.ShapeScheme.prototype */ {
		metadata: {
			properties: {

				/**
				 * key of the shape scheme
				 */
				key: {type: "string", defaultValue: null},

				/**
				 * Whether the scheme apply on the shapes on the main row
				 */
				primary: {type: "boolean", defaultValue: false},

				/**
				 * row span of the shape scheme.
				 *
				 * If the shape scheme is <em>not</em> a primary scheme, you need to define how many rows (rowSpan) the expanded shape will take when rendering
				 */
				rowSpan: {type: "int", defaultValue: 1 }

			}
		}
	});

	return ShapeScheme;
}, true);
