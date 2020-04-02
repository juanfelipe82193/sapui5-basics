/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides element sap.makit.Category.
sap.ui.define([
	"./library",
	"sap/ui/core/Element"
], function(makitLibrary, Element) {
	"use strict";


	/**
	 * Constructor for a new Category.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Represents the Category data region of the Chart.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.Category
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Category = Element.extend("sap.makit.Category", /** @lends sap.makit.Category.prototype */ { metadata : {

		deprecated : true,
		library : "sap.makit",
		properties : {

			/**
			 * Specify the name of the column to be mapped to the Category Axis's value.
			 */
			column : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * The text label representing this Category(on value bubble or table's header)
			 */
			displayName : {type : "string", group : "Misc", defaultValue : null},

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

	return Category;
});
