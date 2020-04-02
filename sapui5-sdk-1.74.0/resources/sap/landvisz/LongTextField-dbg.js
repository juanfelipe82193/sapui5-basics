/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control sap.landvisz.LongTextField.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"sap/ui/commons/TextView",
	"./LongTextFieldRenderer"
], function(landviszLibrary, Control, TextView, LongTextFieldRenderer) {
	"use strict";


	/**
	 * Constructor for a new LongTextField.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Long text for a header
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.LongTextField
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var LongTextField = Control.extend("sap.landvisz.LongTextField", /** @lends sap.landvisz.LongTextField.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * Long text for a header
			 */
			text : {type : "string", group : "Data", defaultValue : null},

			/**
			 * rendering size of the data
			 */
			renderingSize : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : null}
		}
	}});

	LongTextField.prototype.init = function(){
	};


	LongTextField.prototype.exit = function() {

		this.oLinearRowFieldLabel && this.oLinearRowFieldLabel.destroy();
	};

	LongTextField.prototype.initControls = function() {

		var oNavigationAreaID = this.getId();

		if(!this.oLongText)
		this.oLongText = new TextView(oNavigationAreaID + "-CLVConValue");

	};

	return LongTextField;

});
