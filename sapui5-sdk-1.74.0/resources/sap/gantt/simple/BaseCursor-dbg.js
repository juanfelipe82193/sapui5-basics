/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BaseRectangle", "./BasePath", "./RenderUtils"
], function(BaseRectangle, BasePath, RenderUtils) {
	"use strict";

	/**
	 * Creates and initializes a new Cursor class.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings of the new control
	 *
	 * @class
	 * This class usually represents a transient shape
	 *
	 * @extends sap.gantt.simple.BaseRectangle
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseCursor
	 */
	var BaseCursor = BaseRectangle.extend("sap.gantt.simple.BaseCursor", /** @lends sap.gantt.simple.BaseCursor.prototype */ {
		metadata: {
			properties: {
				/**
				 * The horizontal length of a cursor. This property influences generated value <code>d</code>.
				 */
				length: {
					type: "float",
					defaultValue: 10
				},

				/**
				 * The vertical size minus the point size of a cursor. This property influences generated value <code>d</code>.
				 */
				width: {
					type: "float",
					defaultValue: 5
				},

				/**
				 * The point size of a cursor. This property influences generated value <code>d</code>.
				 */
				pointHeight: {
					type: "float",
					defaultValue: 5
				}
			}
		}
	});

	/**
	 * Gets the value of property <code>d</code>.
	 *
	 * @return {string} attribute <code>d</code> value for Cursor
	 * @private
	 */
	BaseCursor.prototype.getD = function() {
		var sD;
		var nPointHeight = this.getPointHeight();
		var nWidth = this.getWidth();
		var nLength = this.getLength();
		var nHalflength = nLength / 2;

		var aCenter = this._getCenter();

		if (this._isPropertiesValid(nPointHeight, nWidth, nLength,nHalflength)) {
			sD = ["M " , aCenter.join(" ") ,
				" m " , -nHalflength , " " , -(nWidth + nPointHeight) / 2 ,
				" l " , nLength , " 0 l 0 " , nWidth , " l -" , nHalflength ,
				" " , nPointHeight , " l -" , nHalflength , " -" , nPointHeight , " z"].join("");
		}

		if (RenderUtils.isValidD(sD)) {
			return sD;
		} else {
			jQuery.sap.log.warning("Cursor shape generated invalid d: " + sD);
			return null;
		}
	};

	BaseCursor.prototype._getCenter = function () {
		var nX = BaseRectangle.prototype.getX.apply(this, arguments);
		var nY = this.getRowYCenter();
		return [nX, nY];
	};

	BaseCursor.prototype._isPropertiesValid = function (nPointHeight, nWidth, nLength,nHalflength) {
		return jQuery.isNumeric(nPointHeight) &&
				jQuery.isNumeric(nWidth) &&
				jQuery.isNumeric(nLength) &&
				jQuery.isNumeric(nHalflength);
	};

	BaseCursor.prototype.renderElement = function () {
		if (this._isValid()) {
			BasePath.prototype.renderElement.apply(this, arguments);
		}
	};

	return BaseCursor;
}, true);
