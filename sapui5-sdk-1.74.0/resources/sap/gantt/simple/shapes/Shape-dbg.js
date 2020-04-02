/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/simple/BaseShape",
	"sap/ui/thirdparty/jquery",
	"sap/gantt/misc/Format",
	"sap/ui/core/theming/Parameters"
], function (BaseShape, jQuery, Format, Parameters) {
	"use strict";

	var DEFAULT_ROW_PADDING = 12;

	/**
	 * Creates and initializes a new Shape class.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Base class for all standard shapes.
	 *
	 * This class provides the common used properties and methods useful for shape rendering. Use this class as a parent
	 * of your custom shape implementations.
	 *
	 * @extends sap.gantt.simple.BaseShape
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @abstract
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.shapes.Shape
	 * @since 1.69
	 */
	var Shape = BaseShape.extend("sap.gantt.simple.shapes.Shape", {
		metadata: {
			properties: {
				/**
				 * Color to be used for rendering the shape.
				 */
				color: {type : "sap.gantt.PaletteColor", defaultValue: "sapUiLegend6"},
				/**
				 * Height defines the vertical length of the shape.
				 *
				 * By default, the system automatically generates the shape height according to the base row height. You can set the height yourself by using the setter method. However, it cannot exceed the row height.
				 */
				height: {type: "sap.gantt.SVGLength", defaultValue: "auto"},
				/**
				 * The horizontal width of a shape. Auto will be converted to width calculated from <code>time</code> and <code>endTime</code>.
				 */
				width: {type: "sap.gantt.SVGLength", defaultValue: "auto"},
				/**
				 * The x position of the shapes start. Auto will be converted to position based on <code>time</code>.
				 */
				startX: {type: "sap.gantt.SVGLength", defaultValue: "auto"},
				/**
				 * This property is ignored.
				 * @deprecated
				 */
				fill: {type : "sap.gantt.ValueSVGPaintServer"},
				/**
				 * This property is ignored.
				 * @deprecated
				 */
				fillOpacity: {type: "float", defaultValue: 1.0},
				/**
				 * This property is ignored.
				 * @deprecated
				 */
				stroke: {type : "sap.gantt.ValueSVGPaintServer"},
				/**
				 * This property is ignored.
				 * @deprecated
				 */
				opacity: {type: "float", defaultValue: 1.0},
				/**
				 * All standard shapes are selectable.
				 * @deprecated
				 */
				selectable: {type: "boolean", defaultValue: true},
				/**
				 * All standard shapes are hoverable.
				 * @deprecated
				 */
				hoverable: {type: "boolean", defaultValue: true}
			}
		}
	});

	Shape.prototype.init = function () {
		BaseShape.prototype.init.call(this);
		this._bHover = false;
		this._bIgnoreHover = false;
	};

	Shape.prototype.getSelectable = function () {
		return true;
	};

	Shape.prototype.getHoverable = function () {
		return true;
	};

	/**
	 * Returns a row padding.
	 *
	 * @returns {number} Row padding.
	 * @public
	 */
	Shape.prototype.getRowPadding = function () {
		var vHeight = this.getHeight();
		if (vHeight === "auto" || vHeight === "inherit") {
			return DEFAULT_ROW_PADDING;
		} else {
			return 0;
		}
	};

	/**
	 * Converts height to pixel value.
	 *
	 * @returns {number} Height of the shape.
	 */
	Shape.prototype.getPixelHeight = function () {
		var vHeight = this.getHeight();

		if (vHeight === "auto" || vHeight === "inherit") {
			return this._iBaseRowHeight || 0;
		}

		return Number(vHeight);
	};

	/**
	 * Translates color to hex value.
	 *
	 * @returns {string} Color hex value.
	 * @public
	 */
	Shape.prototype.getTranslatedColor = function () {
		return Parameters.get(this.getColor());
	};

	/**
	 * Returns hex color for hover background.
	 *
	 * @returns {string} Hex value of a hover color.
	 * @public
	 */
	Shape.prototype.getHoverBackgroundColor = function () {
		return Parameters.get("sapUiButtonHoverBackground");
	};

	/**
	 * Returns hex color for hover stroke.
	 *
	 * @returns {string} Hex value of a hover color.
	 * @public
	 */
	Shape.prototype.getHoverColor = function () {
		return Parameters.get("sapUiButtonHoverBorderColor");
	};

	/**
	 * Returns hex color for selected shapes.
	 *
	 * @returns {string} Hex value of a selected shape color.
	 * @public
	 */
	Shape.prototype.getSelectedColor = function () {
		return Parameters.get("sapUiButtonActiveBackground");
	};

	/**
	 * Computes the width in pixels this shape has based on current zoom level and <code>time</code> and <code>endTime</code>.
	 *
	 * @returns {number} Number of pixels representing the with of current shape.
	 * @public
	 */
	Shape.prototype.getPixelWidth = function () {
		var vWidth = this.getWidth();
		if (vWidth !== "auto") {
			return Number(vWidth);
		}

		var oAxisTime = this.getAxisTime();
		if (!oAxisTime) {
			return 0;
		}

		var startTime = oAxisTime.timeToView(Format.abapTimestampToDate(this.getTime())),
			endTime = oAxisTime.timeToView(Format.abapTimestampToDate(this.getEndTime()));

		if (jQuery.isNumeric(startTime) && jQuery.isNumeric(endTime)) {
			return Math.abs(endTime - startTime);
		} else {
			return 0;
		}
	};

	/**
	 * Computes the x coordinate of the shape beginning.
	 *
	 * @returns {number} The x coordinate of the beginning in current zoom level.
	 * @public
	 */
	Shape.prototype.getXStart = function () {
		var vStartX = this.getProperty("startX");
		if (vStartX !== "auto") {
			return Number(vStartX);
		}
		var oAxisTime = this.getAxisTime();
		if (!oAxisTime) {
			return 0;
		}

		return Number(oAxisTime.timeToView(Format.abapTimestampToDate(this.getTime())));
	};

	/**
	 * Computes the x coordinate of the shape end.
	 *
	 * @returns {number} The x coordinate of the end in current zoom level.
	 * @public
	 */
	Shape.prototype.getXEnd = function () {
		if (this.getProperty("startX") !== "auto") {
			return this.getXStart() + this.getPixelWidth();
		}
		var oAxisTime = this.getAxisTime();
		if (!oAxisTime) {
			return 0;
		}

		return Number(oAxisTime.timeToView(Format.abapTimestampToDate(this.getEndTime())));
	};

	/**
	 * Renders element into the provided Render Manager.
	 *
	 * @public
	 * @abstract
	 * @param oRm Render Manager
	 */
	Shape.prototype.renderElement = function (oRm) {
		throw new Error("This function must be overridden in implementing classes.");
	};

	/**
	 * Renders the content of the shape.
	 *
	 * @public
	 * @abstract
	 * @param oRm Render Manager
	 */
	Shape.prototype.renderContent = function (oRm) {
		throw new Error("This function must be overridden in implementing classes.");
	};

	Shape.prototype.generateArcRadius = function (iFirstLen, iSecondLen) {
		return Math.min(3, Math.min(iFirstLen, iSecondLen));
	};

	/**
	 * Returns current hover state.
	 *
	 * @returns {boolean} <code>true</code> if the shape is in hover state, <code>false</code> otherwise.
	 * @public
	 */
	Shape.prototype.getHoverState = function () {
		return this._bHover;
	};

	/**
	 * @private
	 */
	Shape.prototype.hoverStateChange = function (bHover) {
		if (this.getHoverState() !== bHover && !this._bIgnoreHover) {
			this._bHover = bHover;
			this.rerenderShape();
		}
	};

	Shape.prototype.setSelected = function (oValue) {
		this.setProperty("selected", oValue, true);
		if (this.getHoverState()) {
			this._bHover = false;
			this._bIgnoreHover = true;
		}
		this.rerenderShape();
	};

	Shape.prototype.onmouseover = function (oEvent) {
		if (!this.getHoverable()) { return; }
		BaseShape.prototype.onmouseover.call(this, oEvent);
		this.hoverStateChange(true);
	};

	Shape.prototype.onmouseout = function (oEvent) {
		if (!this.getHoverable()) { return; }
		BaseShape.prototype.onmouseout.call(this, oEvent);
		this._bIgnoreHover = false;
		this.hoverStateChange(false);
	};

	Shape.prototype.rerenderShape = function () {
		var oDom = this.getDomRef();
		if (oDom) {
			var oRm = sap.ui.getCore().createRenderManager();
			this.renderContent(oRm);
			oRm.flush(oDom);
			oRm.destroy();
		} else {
			this.invalidate();
		}
	};

	return Shape;
});
