/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control NestedRowField.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"sap/ui/commons/Image",
	"sap/ui/commons/Label",
	"sap/ui/commons/TextView",
	"./NestedRowFieldRenderer"
], function(landviszLibrary, Control, Image, Label, TextView, NestedRowFieldRenderer) {
	"use strict";

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	/**
	 * Constructor for a new internal/NestedRowField.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A control to render nester row fields in a control
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.internal.NestedRowField
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var NestedRowField = Control.extend("sap.landvisz.internal.NestedRowField", /** @lends sap.landvisz.internal.NestedRowField.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * label for data in a row field
			 */
			label : {type : "string", group : "Data", defaultValue : null},

			/**
			 * value of the data in a row field
			 */
			values : {type : "string[]", group : "Data", defaultValue : null},

			/**
			 * rendering size of the control
			 */
			renderingSize : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : EntityCSSSize.Regular},

			/**
			 * titlte of the icon rendered in the nested row field
			 */
			iconTitle : {type : "string", group : "Data", defaultValue : null},

			/**
			 * determines the type of landscape object
			 */
			type : {type : "string", group : "Identification", defaultValue : null},

			/**
			 * determines the type of value
			 */
			valueType : {type : "string", group : "Identification", defaultValue : null},

			/**
			 * Image source of the icon on right
			 */
			rightIconSrc : {type : "string", group : "Data", defaultValue : null},

			/**
			 * source from which two or more systems are dependent
			 */
			linkSource : {type : "string", group : "Data", defaultValue : null}
		},
		aggregations : {

			/**
			 * Rows aggregation in a label
			 */
			linearRows : {type : "sap.landvisz.internal.LinearRowField", multiple : true, singularName : "linearRow"}
		}
	}});

	NestedRowField.prototype.init = function() {
		this.initializationDone = false;
	};

	NestedRowField.prototype.exit = function() {

		this.oNestedRowFieldLabel && this.oNestedRowFieldLabel.destroy();
		this.oNestedRowFieldValue && this.oNestedRowFieldValue.destroy();
		this.iconType && this.iconType.destroy();
		this.iconValue && this.iconValue.destroy();
	};

	NestedRowField.prototype.initControls = function() {
		var oNavigationAreaID = this.getId();
		if (!this.oNestedRowFieldLabel)
			this.oNestedRowFieldLabel = new Label(oNavigationAreaID
					+ "-CLVConNestedLabel");
		if (!this.oNestedRowFieldValue)
			this.oNestedRowFieldValue = new TextView(
					oNavigationAreaID + "-CLVConNestedValue");
		if (!this.iconLabel)
			this.iconLabel = new Image(oNavigationAreaID
					+ "-CLVDataLabelImg");
		if (!this.iconValue)
			this.iconValue = new Image(oNavigationAreaID
					+ "-CLVDataValueImg");
	};

	return NestedRowField;

});
