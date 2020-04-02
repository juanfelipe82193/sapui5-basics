/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides element sap.makit.Series.
sap.ui.define([
	"./library",
	"sap/ui/core/Element"
], function(makitLibrary, Element) {
	"use strict";


	/**
	 * Constructor for a new Series.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Represents the Series data region of the Chart.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.Series
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Series = Element.extend("sap.makit.Series", /** @lends sap.makit.Series.prototype */ { metadata : {

		deprecated : true,
		library : "sap.makit",
		properties : {

			/**
			 * The name of the column that will be mapped to the chart's Series value
			 */
			column : {type : "string", group : "Data", defaultValue : null},

			/**
			 * The displayed name of the Series
			 */
			displayName : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * Number formatting for the value. Accepted values:
			 * number
			 * currency
			 * percent
			 * roundedN - where N represents number of decimal places e.g. rounded4
			 */
			format : {type : "string", group : "Misc", defaultValue : null}
		}
	}});

	return Series;
});