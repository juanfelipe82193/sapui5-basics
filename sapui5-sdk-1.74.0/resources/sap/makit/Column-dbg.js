/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides element sap.makit.Column.
sap.ui.define([
	"./library",
	"sap/ui/core/Element"
], function(makitLibrary, Element) {
	"use strict";


	/**
	 * Constructor for a new Column.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The data column of the Chart's data table
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.Column
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Column = Element.extend("sap.makit.Column", /** @lends sap.makit.Column.prototype */ { metadata : {

		deprecated : true,
		library : "sap.makit",
		properties : {

			/**
			 * The name representing the Column
			 */
			name : {type : "string", group : "Identification", defaultValue : null},

			/**
			 * The value mapped to this Column (User should map this using data binding)
			 */
			value : {type : "any", group : "Data", defaultValue : null},

			/**
			 * The data type of the Column:
			 * number
			 * string
			 * datetime
			 */
			type : {type : "string", group : "Misc", defaultValue : 'string'}
		}
	}});

	return Column;
});
