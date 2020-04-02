/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./TitlePropagator", "./BaseShape", "./RenderUtils", "./GanttUtils", "../misc/Format"
], function (TitlePropagator, BaseShape, RenderUtils, GanttUtils, Format) {
	"use strict";

	/**
	 * Creates and initializes a new BaseRectangle class.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * BaseRectangle represent a basic shape that creates rectangles, defined by corner positions, width and height.
	 * The rectangle may have their corners rounded.
	 *
	 * @extends sap.gantt.simple.BaseShape
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseRectangle
	 */
	var BaseRectangle = BaseShape.extend("sap.gantt.simple.BaseRectangle", {
		metadata: {
			properties: {
				/**
				 * x defines a x-axis coordinate in the user coordinate system
				 */
				x: {type: "sap.gantt.SVGLength"},

				/**
				 * defines a y-axis coordinate in the user coordinate system
				 */
				y: {type: "sap.gantt.SVGLength"},

				/**
				 * width defines the horizontal length of the rectangle.
				 * Most of time it's calculated by properties <code>time</code> and <code>endTime</code> automatically
				 */
				width: {type: "sap.gantt.SVGLength"},

				/**
				 * height defines the vertical length of the rectangle.
				 *
				 * By default, the system automatically generates the shape height according to the base row height. You can set the height yourself by using the setter method. However, it cannot exceed the row height.
				 */
				height: {type: "sap.gantt.SVGLength", defaultValue: "auto"},

				/**
				 * rx defines a radius on the x-axis.
				 */
				rx: {type: "sap.gantt.SVGLength", group: "Appearance", defaultValue: 0},

				/**
				 * ry defines a radius on the y-axis.
				 */
				ry: {type: "sap.gantt.SVGLength", group: "Appearance", defaultValue: 0}
			}
		}
	});

	var mAttributes = ["x", "y", "width", "height", "style", "rx", "ry", "filter", "opacity", "transform"];

	TitlePropagator.call(BaseRectangle.prototype, true);// add title and showTitle property, showTitle default is true

	/**
	 * Gets the value of property <code>x</code>.
	 *
	 * <p>
	 * x coordinate of the top-left corner of the rectangle.
	 *
	 * Usually applications do not set this value. This getter carries out the calculation using property <code>time</code> as a base.
	 * </p>
	 *
	 * @return {number} Value of property <code>x</code>.
	 * @public
	 */
	BaseRectangle.prototype.getX = function () {
		return GanttUtils.getValueX(this);
	};

	/**
	 * Gets the value of property <code>y</code>.
	 *
	 * y coordinate of the top-left corner of the rectangle.
	 *
	 * Usually applications do not set this value. This getter carries out the calculation based on the row height
	 * and uses <code>height</code> value to position the rectangle in the row center.
	 *
	 * @return {number} Value of property <code>y</code>.
	 * @public
	 */
	BaseRectangle.prototype.getY = function () {
		var y = this.getProperty("y");
		if (y === null || y === undefined) {
			// get default y, always align shape centrally
			y = this.getRowYCenter() - (this.getHeight() / 2);
		}
		return y;
	};

	/**
	 * Gets the value of property <code>width</code>.
	 *
	 * Width of the rectangle.
	 *
	 * Usually applications do not set this value. This getter carries out the calculation using properties <code>time</code> and
	 * <code>endTime</code>
	 *
	 * @return {number} Value of property <code>width</code>.
	 * @public
	 */
	BaseRectangle.prototype.getWidth = function () {
		var iWidth = this.getProperty("width");
		if (iWidth !== null && iWidth !== undefined) { return iWidth; }

		var oAxisTime = this.getAxisTime();
		if (oAxisTime == null) { return 0; }

		var nRetVal,
			startTime = oAxisTime.timeToView(Format.abapTimestampToDate(this.getTime())),
			endTime = oAxisTime.timeToView(Format.abapTimestampToDate(this.getEndTime()));

		//if nRetVal is not numeric, return itself
		if (!jQuery.isNumeric(startTime) || !jQuery.isNumeric(endTime)) {
			return 0;
		}

		nRetVal = Math.abs(endTime - startTime);

		// set minimum width 1 to at least make the shape visible
		nRetVal = nRetVal <= 0 ? 1 : nRetVal;

		return nRetVal;
	};

	/**
	 * Gets the value of property <code>height</code>.
	 *
	 * If property height set to "auto", then the height is automatically calculated based on the row height.
	 *
	 * @return {number} Value of property <code>width</code>.
	 * @public
	 */
	BaseRectangle.prototype.getHeight = function() {
		var vHeight = this.getProperty("height");

		if (vHeight === "auto") {
			// Greatest Common Factor 0.625
			return parseFloat(this._iBaseRowHeight * 0.625, 10);
		}

		if (vHeight === "inherit") {
			return this._iBaseRowHeight;
		}

		return vHeight;
	};

	BaseRectangle.prototype.getStyle = function() {
		var sInheritedStyle = BaseShape.prototype.getStyle.apply(this, arguments);
		var oStyles = {
			"fill": this.determineValueColor(this.getFill()),
			"stroke-dasharray": this.getStrokeDasharray(),
			"fill-opacity": this.getFillOpacity(),
			"stroke-opacity": this.getStrokeOpacity()
		};
		return sInheritedStyle + this.getInlineStyle(oStyles);
	};

	BaseRectangle.prototype._isValid = function () {
		var x = this.getX();
		return x !== undefined && x !== null;
	};

	BaseRectangle.prototype.renderElement = function (oRm, oElement) {
		if (!this._isValid()) {
			return;
		}

		oRm.write("<rect");
		this.writeElementData(oRm);
		oRm.writeClasses(this);

		RenderUtils.renderAttributes(oRm, oElement, mAttributes);

		oRm.write(">");
		RenderUtils.renderTooltip(oRm, oElement);
		oRm.write("</rect>");

		// if title had been set, then display in middle of the rectangle
		if (this.getShowTitle()) {
			RenderUtils.renderElementTitle(oRm, oElement);
		}

		BaseShape.prototype.renderElement.apply(this, arguments);
	};

	BaseRectangle.prototype.getShapeAnchors = function () {
		return {
			head: {
				x: this.getX(),
				y: this.getRowYCenter(),
				dx: 0,
				dy: this.getHeight() / 2
			},
			tail: {
				x: this.getX() + this.getWidth(),
				y: this.getRowYCenter(),
				dx: 0,
				dy: this.getHeight() / 2
			}
		};
	};

	return BaseRectangle;
}, true);
