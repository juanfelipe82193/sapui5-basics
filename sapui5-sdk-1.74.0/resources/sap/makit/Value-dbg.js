/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides element sap.makit.Value.
sap.ui.define([
	"./library",
	"sap/ui/core/Element"
], function(makitLibrary, Element) {
	"use strict";


	/**
	 * Constructor for a new Value.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Represents the Value data region of the Chart.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.Value
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Value = Element.extend("sap.makit.Value", /** @lends sap.makit.Value.prototype */ { metadata : {

		deprecated : true,
		library : "sap.makit",
		properties : {

			/**
			 * The user should map the column on this property. The expression allows more advanced column mapping. Instead of just specifying the column name (e.g. revenueValue), the user can use SAP expression language e.g. Assuming the user has a revenueValue column and an operatingCost column, the user can specify the following expression:
			 * "revenueValue - operatingCost"
			 * the resulting value displayed in the chart will be the arithmatic operation result on these two columns.
			 */
			expression : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * The text label representing this Value (on value bubble or table's header)
			 */
			displayName : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Number formatting for the value. Accepted values:
			 * number
			 * currency
			 * percent
			 * roundedN - where N represents number of decimal places e.g. rounded4
			 */
			format : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Comma separated locales for specifiying values in different locale. The locale will be mapped in the same order as the series data.
			 * e.g. zh-CH, en-US, de-DE
			 * The first zh-CH will be applied to the value of the first series, en-US will be applied to the second series.
			 * Currently will only work with 'currency' format.
			 * Supported locales:
			 * en, zh, de, fr, es, ru, ja, pt and their more specific variations such as en-CA, es-AR, zh-HK, etc.
			 */
			locale : {type : "string", group : "Misc", defaultValue : null}
		}
	}});

	return Value;
});
