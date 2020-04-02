/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */

// Provides control sap.zen.crosstab.HeaderCell.
jQuery.sap.declare("sap.zen.crosstab.HeaderCell");
jQuery.sap.require("sap.zen.crosstab.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new HeaderCell.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Add your documentation for the new HeaderCell
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @name sap.zen.crosstab.HeaderCell
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.zen.crosstab.HeaderCell", /** @lends sap.zen.crosstab.HeaderCell.prototype */ { metadata : {

	library : "sap.zen.crosstab",
	properties : {

		/**
		 */
		rowSpan : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		colSpan : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		text : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		formatter : {type : "object", group : "Misc", defaultValue : null},

		/**
		 */
		mergeKey : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		sort : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		sortAction : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		area : {type : "object", group : "Misc", defaultValue : null},

		/**
		 */
		effectiveColSpan : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		effectiveRowSpan : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		row : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		col : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		level : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		drillState : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		hierarchyAction : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		hierarchyTooltip : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		htmlIE8RowSpan : {type : "int", group : "Misc", defaultValue : 1},

		/**
		 */
		sortTextIndex : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		tableRow : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		tableCol : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		alignment : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		memberId : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		parentMemberId : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		nodeAlignment : {type : "string", group : "Misc", defaultValue : null}
	}
}});


/**
 *
 * @name sap.zen.crosstab.HeaderCell#addStyle
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

sap.zen.crosstab.HeaderCell.prototype.init = function () {
	"use strict";
	this.aStyles = [];
	this.bLoading = false;
	this.bSelectable = false;
	this.bIsResult = false;
	this.bIsMobileResize = false;
	this.sUnit = "";
	this.bIsEntryEnabled = false;
	this.sPassiveCellType = sap.zen.crosstab.rendering.RenderingConstants.PASSIVE_CELL_TYPE_NORMAL;
	this.iNumberOfLineBreaks = 0;
	this.sScalingAxis = null;
	this.bIsPivotCell = false;
	this.bIsSplitPivotCell = false;
	this.bIsRevertDrop = false;
};

sap.zen.crosstab.HeaderCell.prototype.getCellType = function() {
	return sap.zen.crosstab.rendering.RenderingConstants.TYPE_HEADER_CELL;
};

sap.zen.crosstab.HeaderCell.prototype.isHeaderCell = function() {
	return true;
};

sap.zen.crosstab.HeaderCell.prototype.getCssClassNames = function (bIsIE8, bIsRtl, bIsMsIE) {
	return sap.zen.crosstab.CellStyleHandler.getCssClasses(this.aStyles, bIsIE8, bIsRtl, bIsMsIE);
};

sap.zen.crosstab.HeaderCell.prototype.getStyleIdList = function () {
	return this.aStyles;
};

sap.zen.crosstab.HeaderCell.prototype.setStyleIdList = function (aNewStyles) {
	this.aStyles = aNewStyles;
};

sap.zen.crosstab.HeaderCell.prototype.addStyle = function (sStyle) {
	var iStyleId = sap.zen.crosstab.CellStyleHandler.getStyleId(sStyle,
			sap.zen.crosstab.rendering.RenderingConstants.TYPE_HEADER_CELL);
	if (this.aStyles.indexOf(iStyleId) === -1) {
		this.aStyles.push(iStyleId);
	}
};

sap.zen.crosstab.HeaderCell.prototype.removeStyle = function (sStyle) {
	var iStyleId = sap.zen.crosstab.CellStyleHandler.getStyleId(sStyle,
			sap.zen.crosstab.rendering.RenderingConstants.TYPE_HEADER_CELL);
	var iIndex = this.aStyles.indexOf(iStyleId);
	if (iIndex !== -1) {
		this.aStyles.splice(iIndex, 1);
	}
};

sap.zen.crosstab.HeaderCell.prototype.hasStyle = function (sStyle) {
	var iStyleId = sap.zen.crosstab.CellStyleHandler.getStyleId(sStyle,
			sap.zen.crosstab.rendering.RenderingConstants.TYPE_HEADER_CELL);
	var iIndex = this.aStyles.indexOf(iStyleId);
	if (iIndex === -1) {
		return false;
	} else {
		return true;
	}
};

sap.zen.crosstab.HeaderCell.prototype.isLoading = function () {
	return this.bLoading;
};

sap.zen.crosstab.HeaderCell.prototype.setLoading = function (bLoading) {
	this.bLoading = bLoading;
};

sap.zen.crosstab.HeaderCell.prototype.isSelectable = function () {
	return this.bSelectable;
};

sap.zen.crosstab.HeaderCell.prototype.setSelectable = function (bSelectable) {
	this.bSelectable = bSelectable;
};

sap.zen.crosstab.HeaderCell.prototype.setResult = function (bIsResult) {
	this.bIsResult = bIsResult;
};

sap.zen.crosstab.HeaderCell.prototype.isResult = function () {
	return this.bIsResult;
};

sap.zen.crosstab.HeaderCell.prototype.getUnescapedText = function () {
	return sap.zen.crosstab.utils.Utils.unEscapeDisplayString(this.getText());
};

sap.zen.crosstab.HeaderCell.prototype.isMobileResize = function () {
	return this.bIsMobileResize;
};

sap.zen.crosstab.HeaderCell.prototype.setMobileResize = function (pbMobileResize) {
	this.bIsMobileResize = pbMobileResize;
};

sap.zen.crosstab.HeaderCell.prototype.setEntryEnabled = function (bIsEntryEnabled) {
	this.bIsEntryEnabled = bIsEntryEnabled;
};

sap.zen.crosstab.HeaderCell.prototype.isEntryEnabled = function () {
	return this.bIsEntryEnabled;
};

sap.zen.crosstab.HeaderCell.prototype.setUnit = function (sUnit) {
	this.sUnit = sUnit;
};

sap.zen.crosstab.HeaderCell.prototype.getUnit = function () {
	return this.sUnit;
};

sap.zen.crosstab.HeaderCell.prototype.getPassiveCellType = function () {
	return this.sPassiveCellType;
};

sap.zen.crosstab.HeaderCell.prototype.setPassiveCellType = function (sPCellType) {
	this.sPassiveCellType = sPCellType;
};

sap.zen.crosstab.HeaderCell.prototype.setNumberOfLineBreaks = function (iNumberOfLineBreaks) {
	this.iNumberOfLineBreaks = iNumberOfLineBreaks;
};

sap.zen.crosstab.HeaderCell.prototype.getNumberOfLineBreaks = function () {
	return this.iNumberOfLineBreaks;
};

sap.zen.crosstab.HeaderCell.prototype.getScalingAxis = function() {
	return this.sScalingAxis;
};

sap.zen.crosstab.HeaderCell.prototype.setScalingAxis = function(sScalingAxis) {
	this.sScalingAxis = sScalingAxis;
};

sap.zen.crosstab.HeaderCell.prototype.isPivotCell = function() {
	return this.bIsPivotCell;
};

sap.zen.crosstab.HeaderCell.prototype.setPivotCell = function(bIsPivotCell) {
	this.bIsPivotCell = bIsPivotCell;
};

sap.zen.crosstab.HeaderCell.prototype.isSplitPivotCell = function() {
	return this.bIsSplitPivotCell;
};

sap.zen.crosstab.HeaderCell.prototype.setSplitPivotCell = function(bIsSplitPivotCell) {
	this.bIsSplitPivotCell = bIsSplitPivotCell;
};

sap.zen.crosstab.HeaderCell.prototype.isRevertDrop = function() {
	return this.bIsRevertDrop;
};

sap.zen.crosstab.HeaderCell.prototype.setRevertDrop = function(bIsRevertDrop) {
	this.bIsRevertDrop = bIsRevertDrop;
};

sap.zen.crosstab.HeaderCell.prototype.getFormattedText = function() {
	var lText = this.getText();
	
	var oArea = this.getArea();
	var fRenderCallback = oArea.getRenderCellCallback();
	if (fRenderCallback) {
		var oCallbackResult = fRenderCallback(new sap.zen.crosstab.IHeaderCell(oControl));
		lText = oCallbackResult.renderText;
	}
	
	var oFormatter = this.getFormatter();
	if (oFormatter) {
		lText = oFormatter.format(lText);
	}

	return lText;
};
