/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Core",
	"./BaseShape",
	"./GanttUtils"
], function (
	Core,
	BaseShape,
	GanttUtils) {
	"use strict";

	/**
	 * Creates and initializes a new BaseText class.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * BaseText defines a graphics element consisting of text.
	 *
	 * @extends sap.gantt.simple.BaseShape
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseText
	 */
	var BaseText = BaseShape.extend("sap.gantt.simple.BaseText", /** @lends sap.gantt.simple.BaseText.prototype */ {
		metadata: {
			properties: {

				/**
				 * Text content
				 */
				text: {type: "string"},

				/**
				 * x-axis coordinate
				 */
				x: {type: "float"},

				/**
				 * y-axis coordinate
				 */
				y: {type: "float"},

				/**
				 * The fontSize property refers to the size of the font
				 */
				fontSize: {type: "int", defaultValue: 13},

				/**
				 * This property is used to align (start-, middle- or end-alignment) a string of text relative to a given point
				 */
				textAnchor: {type: "string", defaultValue: "start"},

				/**
				 * This property indicates which font family will be used to render the text, specified as a prioritized list of font family names and/or generic family names
				 */
				fontFamily: {type: "string", defaultValue: "Arial"},

				/**
				 * The width to start truncate the text. If the value is omit, the text is truncated base on it's parent width
				 */
				truncateWidth: {type: "float"},

				/**
				 * Flag to show the ellipsis symbol.
				 */
				showEllipsis: {type: "boolean", defaultValue: true}
			}
		}
	});

	var mAttributes = ["x", "y", "text-anchor", "style", "filter", "transform"];

	/**
	 * Gets current value of property <code>x</code>.
	 * <p>
	 * x coordinate of the bottom-left corner of the text.
	 *
	 * Usually applications do not set this value. This getter carries out the calculation using property <code>time</code> from itself or it's parent that has method <code>getTime</code>.
	 * If you override the default value calculated by the getter, the alignment of the center is not guaranteed.
	 * </p>
	 *
	 * @return {number} Value of property <code>x</code>.
	 * @public
	 */
	BaseText.prototype.getX = function () {
		var iX = GanttUtils.getValueX(this);
		if (isNaN(iX) && this.getParent() && this.getParent().getTime) {
			iX = GanttUtils.getValueX(this.getParent());
		}
		return iX;
	};

	/**
	 * Gets current value of property <code>y</code>.
	 *
	 * <p>
	 * y coordinate of the bottom-left corner of the text.
	 *
	 * Usually applications do not set this value. This getter carries out the calculation using parameter <code>RowYCenter</code>
	 * and property <code>fontSize</code> to align the center of the row rectangle along the y axis.
	 * If you override the default value calculated by the getter, the alignment of the center is not guaranteed.
	 * </p>
	 * @return {number} Value of property <code>y</code>.
	 * @public
	 */
	BaseText.prototype.getY = function () {
		var vValue = this.getProperty("y");
		if (vValue !== null && vValue !== undefined) {
			return vValue;
		}
		return this.getRowYCenter() + this.getFontSize() / 2;
	};

	/**
	 * Get the BaseText style string
	 *
	 * @return {string} BaseText styles
	 * @protected
	 */
	BaseText.prototype.getStyle = function() {
		var sInheritedStyle = BaseShape.prototype.getStyle.apply(this, arguments);
		var oStyles = {
			"font-size": this.getFontSize() + "px",
			"fill": this.determineValueColor(this.getFill()),
			"font-family": this.getFontFamily()
		};
		return sInheritedStyle + this.getInlineStyle(oStyles);
	};

	/**
	 * Renders the text with RenderManager
	 *
	 * @param {sap.ui.core.RenderManager} oRm A shared RenderManager for GanttChart control
	 * @param {sap.gantt.simple.BaseText} oElement BaseText to be rendered
	 * @public
	 */
	BaseText.prototype.renderElement = function(oRm, oElement) {
		oRm.write("<text");
		this.writeElementData(oRm);
		oRm.writeClasses(this);
		// to break cyclic dependency
		var RenderUtils = sap.gantt.simple.RenderUtils;
		RenderUtils.renderAttributes(oRm, oElement, mAttributes);
		oRm.write(">");

		RenderUtils.renderTooltip(oRm, oElement);

		this.writeTruncatedText(oRm, oElement);
		// oRm.write(oElement.getText());
		oRm.write("</text>");
	};

	/**
	 * Render truncated text with RenderManager
	 *
	 * @param {sap.ui.core.RenderManager} oRm A shared RenderManager for GanttChart control
	 * @param {sap.gantt.simple.BaseText} oElement BaseText to be rendered
	 * @private
	 */
	BaseText.prototype.writeTruncatedText = function(oRm, oElement) {
		var sText = oElement.getText(),
			bTruncatedWidthDefined = this.getTruncateWidth() != null;
		if (bTruncatedWidthDefined) {
			// user had defined truncated width, try to truncate text based on the width
			var oResult = this._truncateText(sText);
			this.renderEllipsisIfNecessary(oRm, oResult);
		} else {
			oRm.write(sText);
		}
	};

	/**
	 * Gets the value of property <code>truncateWidth</code>.
	 *
	 * <p>
	 * Truncating width. Default value -1 indicates truncating function is not activated. To enable truncating, specifies a truncate width. If text length
	 * exceeds truncate width, text is truncated automatically. This method will return the minimum between property <code>truncateWidth</code> and it's parent's width
	 * caculated by time range.
	 * </p>
	 * @return {number} Value of property <code>truncateWidth</code>.
	 * @public
	 */
	BaseText.prototype.getTruncateWidth = function() {
		var iOriginalWidth = this.getProperty("truncateWidth");

		var oParent = this.getParent();
		if (oParent && oParent.isA("sap.gantt.simple.BaseShape")) {
			var iParentWidth = 0;
			if (oParent.getWidth) {
				iParentWidth = oParent.getWidth();
			} else {
				iParentWidth = Math.abs(this.getXByTime(oParent.getEndTime()) - this.getXByTime(oParent.getTime()));
			}

			if (iParentWidth < iOriginalWidth) {
				return iParentWidth;
			}
		}

		return iOriginalWidth;
	};

	/**
	 * Render text with ellipsis if necessary
	 *
	 * @private
	 * @param {sap.ui.core.RenderManager} oRm A shared RenderManager for GanttChart control
	 * @param {object} oResult Result to be rendered.
	 */
	BaseText.prototype.renderEllipsisIfNecessary = function(oRm, oResult) {
		if (oResult.ellipsis) {
			var bRTL = Core.getConfiguration().getRTL();
			if (bRTL) {
				oRm.write("..." + oResult.truncatedText);
			} else {
				oRm.write(oResult.truncatedText + "...");
			}
		} else {
			oRm.write(oResult.truncatedText);
		}
	};

	/**
	 * Truncate text if necessary
	 *
	 * @param {string} sSourceText Text to display
	 * @private
	 * @return {object} truncate result for rendering
	 */
	BaseText.prototype._truncateText = function(sSourceText) {
		var oResult = this._processTextForTruncation(sSourceText);

		oResult = oResult || {
			ellipsis: false,
			truncatedText: sSourceText
		};

		return oResult;
	};

	/**
	 * Process text for truncating
	 *
	 * @param {string} sSourceText Text to display
	 * @return {object} Truncate result for rendering
	 */
	BaseText.prototype._processTextForTruncation = function(sSourceText) {
		var iTruncateWidth = this.getTruncateWidth(),
			iEllipsisWidth = this.measureTextWidth("..."),
			iTextTotalLength = this.measureTextWidth(sSourceText);

		if (iTextTotalLength > iTruncateWidth) { // truncate needed
			var iTargetWidth,
				bShowEllipsis;

			if (this.getShowEllipsis() && iEllipsisWidth < iTruncateWidth) { // ellipsis enabled
				bShowEllipsis = true;
				iTargetWidth = iTruncateWidth - iEllipsisWidth;
			} else { // ellipsis disabled
				bShowEllipsis = false;
				iTargetWidth = iTruncateWidth;
			}

			// truncate
			var iNumberOfChar = this._geNumberOfTruncatedCharacters(iTextTotalLength, iTargetWidth, sSourceText);

			var sTruncatedText = sSourceText.slice(0, iNumberOfChar).trim();

			return {
				ellipsis: bShowEllipsis,
				truncatedText: sTruncatedText
			};
		}
		return null;
	};

	/**
	 * Gets the value of property <code>textAnchor</code>.
	 *
	 * @return {string} Value of property <code>textAnchor</code>.
	 * @public
	 */
	BaseText.prototype.getTextAnchor = function() {
		var sOriginalTextAnchor = this.getProperty("textAnchor");
		var bRTL = Core.getConfiguration().getRTL();
		if (bRTL) {
			if (sOriginalTextAnchor === "start") {
				return "end";
			} else if (sOriginalTextAnchor === "end") {
				return "start";
			}
		}
		return sOriginalTextAnchor;
	};

	/**
	 * Calculate the number of text letters that can fit in the target length.
	 *
	 * First do a estimation based on the pixels each letter takes in screen and the target length,
	 * And compare three potential values (example: estimatedCount -1, estimatedCount, estimatedCount + 1) with the target length,
	 * IF one of the estimated values fit, then return
	 * ELSE do a binary search to find the most suitable number of text letters that can fit in the target length
	 *
	 * @param {number} iTextTotalLength Total length of the text
	 * @param {number} iTargetLength Truncated width of the text
	 * @param {string} sText Text to display
	 * @return {number} Number of characters that should be kept
	 * @private
	 */
	BaseText.prototype._geNumberOfTruncatedCharacters = function (iTextTotalLength, iTargetLength, sText) {
		var nCount = 0;
		if (iTextTotalLength > iTargetLength) {
			if (iTargetLength > 0 && sText.length > 0) {
				nCount = Math.round(iTargetLength / Math.ceil(iTextTotalLength / sText.length));
				while (true) { // eslint-disable-line no-constant-condition
					if (nCount < 0) { break; }
					var nLen1 = this.measureTextWidth(sText.slice(0, nCount));
					var nLen2 = this.measureTextWidth(sText.slice(0, nCount + 1));

					if (nLen1 > iTargetLength) { nCount--; continue; }
					if (nLen2 < iTargetLength) { nCount++; continue; }

					break;
				}
			}
		} else {
			return sText ? sText.length : 0;
		}
		return (nCount >= 0 && nCount <= sText.length) ? nCount : 0;
	};

	/**
	 * Measure the text length even text haven't been rendered.
	 *
	 * @private
	 *
	 * @param {string} txt Text to display
	 * @returns {Number} display width of the text
	 */
	BaseText.prototype.measureTextWidth = function(txt) {
		return GanttUtils.getShapeTextWidth(txt, this.getFontSize(), this.getFontFamily());
	};

	return BaseText;
}, true);
