/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control LinearRowField.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"sap/ui/commons/Image",
	"sap/ui/commons/Label",
	"sap/ui/commons/TextView",
	"./LinearRowFieldRenderer"
], function(landviszLibrary, Control, Image, Label, TextView, LinearRowFieldRenderer) {
	"use strict";

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;


	/**
	 * Constructor for a new internal/LinearRowField.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A control to render linear row fields in data container region of a system
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.internal.LinearRowField
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var LinearRowField = Control.extend("sap.landvisz.internal.LinearRowField", /** @lends sap.landvisz.internal.LinearRowField.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * text to be displayed in the row field
			 */
			label : {type : "string", group : "Data", defaultValue : null},

			/**
			 * value to be displayed in the row field
			 */
			value : {type : "string", group : "Data", defaultValue : null},

			/**
			 * rendering size of system
			 */
			renderingSize : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : EntityCSSSize.Regular},

			/**
			 * text of the icon dislayed in the row field
			 */
			iconType : {type : "string", group : "Data", defaultValue : null},

			/**
			 * title of the icon displayed in the row field
			 */
			iconTitle : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Image source of the icon on right
			 */
			rightIconSrc : {type : "string", group : "Data", defaultValue : null},

			/**
			 * source from which two or more systems are dependent
			 */
			linkSource : {type : "string", group : "Data", defaultValue : null},

			/**
			 * tool tip for the right icon
			 */
			rightIconTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * determines if the product version are valid/invalid
			 */
			invalidName : {type : "boolean", group : "Identification", defaultValue : null}
		}
	}});

	LinearRowField.prototype.init = function() {
		this.initializationDone = false;
		this.iconType && this.iconType.destroy();
		this.totalWidth =0;
	};

	LinearRowField.prototype.exit = function() {

		this.oLinearRowFieldLabel && this.oLinearRowFieldLabel.destroy();
		this.oLinearRowFieldValue && this.oLinearRowFieldValue.destroy();
		this.seperatorLbl && this.seperatorLbl.destroy();
	};

	LinearRowField.prototype.initControls = function() {
		var oNavigationAreaID = this.getId();
		if (!this.oLinearRowFieldLabel)
			this.oLinearRowFieldLabel = new Label(oNavigationAreaID
					+ "-CLVConLabel");
		if (!this.oLinearRowFieldValue)
			this.oLinearRowFieldValue = new TextView(
					oNavigationAreaID + "-CLVConValue");
		if (!this.seperatorLbl)
			this.seperatorLbl = new TextView(oNavigationAreaID
					+ "-CLVConSeperator");
		// Identification Region Qualifier Icon
		this.iconType && this.iconType.destroy();
		this.iconType = new Image(oNavigationAreaID
				+ "-CLVDataTypeImg");

		if (!this.rightIcon)
			this.rightIcon = new Image(oNavigationAreaID
					+ "-rightImg");
		this.entityMaximized;

	};

	LinearRowField.prototype.onmouseenter = function(oEvent) {
		oEvent.stopImmediatePropagation();

	};
	LinearRowField.prototype.onmouseleave = function(oEvent) {
		oEvent.stopImmediatePropagation();

	};

	return LinearRowField;

});
