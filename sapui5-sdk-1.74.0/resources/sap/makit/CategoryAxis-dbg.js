/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides element sap.makit.CategoryAxis.
sap.ui.define([
	"./library",
	"./Axis"
], function(makitLibrary, Axis) {
	"use strict";

	// shortcut for sap.makit.SortOrder
	var SortOrder = makitLibrary.SortOrder;


	/**
	 * Constructor for a new CategoryAxis.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Contains the properties of the Category's Axis.
	 * @extends sap.makit.Axis
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.CategoryAxis
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CategoryAxis = Axis.extend("sap.makit.CategoryAxis", /** @lends sap.makit.CategoryAxis.prototype */ { metadata : {

		deprecated : true,
		library : "sap.makit",
		properties : {

			/**
			 * Sort order of the chart
			 */
			sortOrder : {type : "sap.makit.SortOrder", group : "Misc", defaultValue : SortOrder.None},

			/**
			 * Whether to always display the last label on the axis regardless of the automatic resize
			 */
			displayLastLabel : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * Specify whether to display all the category values when there are multiple category data regions.
			 */
			displayAll : {type : "boolean", group : "Misc", defaultValue : true}
		}
	}});

	CategoryAxis.prototype.init = function(){
		this.setShowGrid(false);
		this.setShowPrimaryLine(true);
	};

	return CategoryAxis;
});
