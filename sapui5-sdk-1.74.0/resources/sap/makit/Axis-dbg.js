/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides element sap.makit.Axis.
sap.ui.define([
	"./library",
	"sap/ui/core/Element"
], function(makitLibrary, Element) {
	"use strict";


	/**
	 * Constructor for a new Axis.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Base element for the Axis object for the Chart.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.Axis
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Axis = Element.extend("sap.makit.Axis", /** @lends sap.makit.Axis.prototype */ { metadata : {

		deprecated : true,
		library : "sap.makit",
		properties : {

			/**
			 * Indicates whether to show label of the Axis by the primary line
			 */
			showLabel : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Indicates whether to show the primary line of the Axis on the chart area
			 */
			showPrimaryLine : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Indicates whether to show grid of the Axis in the chart area
			 */
			showGrid : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * The line thickness of the primary line
			 */
			thickness : {type : "float", group : "Appearance", defaultValue : 1},

			/**
			 * Color of the primary line. Accept the following format:
			 * standard name format: gray, red, black, etc
			 * hex format: #ff00ff
			 * rgb format: rgb(256, 0, 256)
			 */
			color : {type : "string", group : "Appearance", defaultValue : 'gray'}
		}
	}});

	return Axis;
});
