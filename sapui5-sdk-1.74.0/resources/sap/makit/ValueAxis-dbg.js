/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides element sap.makit.ValueAxis.
sap.ui.define([
	"./library",
	"./Axis"
], function(makitLibrary, Axis) {
	"use strict";


	/**
	 * Constructor for a new ValueAxis.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Contains the properties of the Value's Axis.
	 * @extends sap.makit.Axis
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.ValueAxis
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ValueAxis = Axis.extend("sap.makit.ValueAxis", /** @lends sap.makit.ValueAxis.prototype */ { metadata : {

		deprecated : true,
		library : "sap.makit",
		properties : {

			/**
			 * Highest displayed value on the Value Axis (this value will be automatically adjusted to nearest major tick value depending on the value's range). Set to empty string to switch back to automatic calculation.
			 */
			min : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Highest displayed value on the Value Axis (this value will be automatically adjusted to nearest major tick value depending on the value's range)
			 */
			max : {type : "string", group : "Misc", defaultValue : null}
		}
	}});

	ValueAxis.prototype.init = function(){
		this.setShowGrid(true);
		this.setShowPrimaryLine(false);
	};

	return ValueAxis;
});
