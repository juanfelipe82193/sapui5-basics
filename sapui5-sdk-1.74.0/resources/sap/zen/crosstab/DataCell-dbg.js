/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */

// Provides control sap.zen.crosstab.DataCell.
jQuery.sap.declare("sap.zen.crosstab.DataCell");
jQuery.sap.require("sap.zen.crosstab.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new DataCell.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Add your documentation for the new DataCell
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @name sap.zen.crosstab.DataCell
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.zen.crosstab.DataCell", /** @lends sap.zen.crosstab.DataCell.prototype */ { metadata : {

	library : "sap.zen.crosstab",
	properties : {

		/**
		 */
		text : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		area : {type : "object", group : "Misc", defaultValue : null},

		/**
		 */
		row : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		col : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		tableRow : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		tableCol : {type : "int", group : "Misc", defaultValue : null}
	}
}});


/**
 *
 * @name sap.zen.crosstab.DataCell#addStyle
 * @function
 * @param {string} sSStyle
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

///**
// * This file defines behavior for the control, 
// */
jQuery.sap.require("sap.zen.crosstab.CellStyleHandler");
jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");
jQuery.sap.require("sap.zen.crosstab.utils.Utils");

sap.zen.crosstab.DataCell.prototype.init = function () {
	"use strict";
	this.aStyles = [];
	this.bLoading = false;
	this.bIsEntryEnabled = false;
	this.sUnit = "";
	this.sPassiveCellType = sap.zen.crosstab.rendering.RenderingConstants.PASSIVE_CELL_TYPE_NORMAL;
	this.iNumberOfLineBreaks = 0;
};

sap.zen.crosstab.DataCell.prototype.getCellType = function() {
	return sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_CELL;
};

sap.zen.crosstab.DataCell.prototype.isHeaderCell = function() {
	return false;
};

sap.zen.crosstab.DataCell.prototype.getCssClassNames = function (bIsIE8, bIsRtl, bIsMsIE) {
	return sap.zen.crosstab.CellStyleHandler.getCssClasses(this.aStyles, bIsIE8, bIsRtl, bIsMsIE);
};

sap.zen.crosstab.DataCell.prototype.getStyleIdList = function () {
	return this.aStyles;
};

sap.zen.crosstab.DataCell.prototype.setStyleIdList = function (aNewStyles) {
	this.aStyles = aNewStyles;
};

sap.zen.crosstab.DataCell.prototype.addStyle = function (sStyle) {
	var iStyleId = sap.zen.crosstab.CellStyleHandler.getStyleId(sStyle,
			sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_CELL);
	if (this.aStyles.indexOf(iStyleId) === -1) {
		this.aStyles.push(iStyleId);
	}
};

sap.zen.crosstab.DataCell.prototype.removeStyle = function (sStyle) {
	var iStyleId = sap.zen.crosstab.CellStyleHandler.getStyleId(sStyle,
			sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_CELL);
	var iIndex = this.aStyles.indexOf(iStyleId);
	if (iIndex !== -1) {
		this.aStyles.splice(iIndex, 1);
	}
};

sap.zen.crosstab.DataCell.prototype.hasStyle = function (sStyle) {
	var iStyleId = sap.zen.crosstab.CellStyleHandler.getStyleId(sStyle,
			sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_CELL);
	var iIndex = this.aStyles.indexOf(iStyleId);
	if (iIndex === -1) {
		return false;
	} else {
		return true;
	}
};

sap.zen.crosstab.DataCell.prototype.getColSpan = function () {
	return 1;
};

sap.zen.crosstab.DataCell.prototype.getRowSpan = function () {
	return 1;
};

sap.zen.crosstab.DataCell.prototype.getEffectiveColSpan = function () {
	return 1;
};

sap.zen.crosstab.DataCell.prototype.getEffectiveRowSpan = function () {
	return 1;
};

sap.zen.crosstab.DataCell.prototype.isLoading = function () {
	return this.bLoading;
};

sap.zen.crosstab.DataCell.prototype.setLoading = function (bLoading) {
	this.bLoading = bLoading;
};

sap.zen.crosstab.DataCell.prototype.isSelectable = function () {
	return false;
};

sap.zen.crosstab.DataCell.prototype.getUnescapedText = function () {
	return sap.zen.crosstab.utils.Utils.unEscapeDisplayString(this.getText());
};

sap.zen.crosstab.DataCell.prototype.setEntryEnabled = function (bIsEntryEnabled) {
	this.bIsEntryEnabled = bIsEntryEnabled;
};

sap.zen.crosstab.DataCell.prototype.isEntryEnabled = function () {
	return this.bIsEntryEnabled;
};

sap.zen.crosstab.DataCell.prototype.setUnit = function (sUnit) {
	this.sUnit = sUnit;
};

sap.zen.crosstab.DataCell.prototype.getUnit = function () {
	return this.sUnit;
};

sap.zen.crosstab.DataCell.prototype.getPassiveCellType = function () {
	return this.sPassiveCellType;
};

sap.zen.crosstab.DataCell.prototype.setPassiveCellType = function (sPCellType) {
	this.sPassiveCellType = sPCellType;
};

sap.zen.crosstab.DataCell.prototype.setNumberOfLineBreaks = function (iNumberOfLineBreaks) {
	this.iNumberOfLineBreaks = iNumberOfLineBreaks;
};

sap.zen.crosstab.DataCell.prototype.getNumberOfLineBreaks = function () {
	return this.iNumberOfLineBreaks;
};