/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BaseText", "./BaseRectangle", "./RenderUtils", "sap/ui/core/IconPool", "sap/ui/core/Core"
], function(BaseText, BaseRectangle, RenderUtils, IconPool, Core) {
	"use strict";

	/**
	 * Creates and initializes a new image class.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * BaseImage shape class using SVG tag 'text' for icon font image, and SVG tag 'image' for bitmap images.
	 *
	 * @extends sap.gantt.simple.BaseText
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseImage
	 */
	var BaseImage = BaseText.extend("sap.gantt.simple.BaseImage", /** @lends sap.gantt.simple.BaseImage.prototype */ {
		metadata: {
			properties: {
				/**
				 * Src of the image.
				 * If the image is represented by an icon font, then the src is sap-icon://task for instance
				 */
				src: { type: "sap.ui.core.URI", defaultValue: null },

				/**
				 * Width of the image.
				 */
				width: { type: "sap.gantt.SVGLength", defaultValue: 20 },

				/**
				 * Height of the image.
				 */
				height: { type: "sap.gantt.SVGLength", defaultValue: 20 }
			}
		}
	});
	var mImageAttributes = ["x", "y", "width", "height"];

	var RenderAs = {
		IconFont: "iconFont",
		Image: "bitImage"
	};

	BaseImage.prototype._needToRenderAs = function() {
		return IconPool.isIconURI(this.getSrc()) ? RenderAs.IconFont : RenderAs.Image;
	};

	/**
	 * Gets the value of property <code>text</code>. Only for icon font.
	 *
	 * <p>
	 * The text string of iconfont is read via {@link sap.ui.IconPool.getIconInfo} passing Name and CollectionName as parameters.
	 * To use the SAP openui5 predefined icons, don't set the property CollectionName.
	 * To use the icons in other collections, you need register first.
	 * For example, after calling function sap.ushell.iconfonts.registerFiori2IconFont, then you can use the icon collection with names "BusinessSuiteInAppSymbols", "Fiori2"...
	 * </p>
	 *
	 * @return {string} Value of property <code>text</code>.
	 * @private
	 */
	BaseImage.prototype.getText = function() {
		if (this._needToRenderAs() === RenderAs.IconFont) {
			var oIconInfo = IconPool.getIconInfo(this.getSrc());
			if (oIconInfo) {
				return oIconInfo.content;
			}
		} else {
			jQuery.sap.log.error("\"getText\" can not be invoked since it's not a icon font!", this);
		}
	};

	/**
	 * Gets the value of property <code>fontFamily</code>. Only for icon font.
	 *
	 * <p>
	 * Font family of Iconfont.
	 *</p>
	 *
	 * @return {string} Value of property <code>fontFamily</code>.
	 * @private
	 */
	BaseImage.prototype.getFontFamily = function() {
		if (this._needToRenderAs() === RenderAs.IconFont) {
			var oIconInfo = IconPool.getIconInfo(this.getSrc());
			if (oIconInfo) {
				return oIconInfo.fontFamily;
			}
		} else {
			jQuery.sap.log.error("\"getFontFamily\" can not be invoked since it's not a icon font!", this);
		}
	};

	BaseImage.prototype.getFontSize = function() {
		if (this._needToRenderAs() === RenderAs.IconFont) {
			return parseFloat(this.getHeight());
		} else {
			jQuery.sap.log.error("\"getFontSize\" can not be invoked since it's not a icon font!", this);
		}
	};

	/**
	 * Gets the current value of property <code>x</code>.
	 *
	 * <p>
	 * x coordinate of the image rectangle.
	 *
	 * Usually applications do not set this value. This getter carries out the calculation using property <code>time</code> as a base
	 * and makes some adjustments.
	 * </p>
	 *
	 * @return {number} Value of property <code>x</code>.
	 * @public
	 */
	BaseImage.prototype.getX = function() {
		var bRTL = Core.getConfiguration().getRTL();
		/**
		 * check if it's an image or a icon font
		 */
		if (this._needToRenderAs() === RenderAs.Image) {
			if (bRTL) {
				return BaseRectangle.prototype.getX.apply(this) - this.getWidth();
			}
			return BaseRectangle.prototype.getX.apply(this);
		} else if (this._needToRenderAs() === RenderAs.IconFont) {
			return BaseText.prototype.getX.apply(this);
		}
	};

	/**
	 * Gets the current value of property <code>y</code>.
	 *
	 * <p>
	 * y coordinate of the image rectangle.
	 *
	 * Usually applications do not set this value. This getter carries out the calculation using row context info
	 * and makes some adjustments to align the center of the row rectangle along the y axis.
	 * If you override the default value calculated by the getter, the alignment of the center is not guaranteed.
	 * </p>
	 *
	 * @return {number} Value of property <code>y</code>.
	 * @public
	 */
	BaseImage.prototype.getY = function() {
		if (this._needToRenderAs() === RenderAs.Image) {
			return BaseRectangle.prototype.getY.apply(this);
		} else if (this._needToRenderAs() === RenderAs.IconFont) {
			return BaseText.prototype.getY.apply(this);
		}
	};

	/**
	 * Render svg tag with render manager.
	 *
	 * <p>
	 * Render svg <code>image</code> tag and set the <code>href</code> attribute of the <code>image</code> tag with the <code>image</code> propery.
	 * </p>
	 * @param  {object} oRm      Render manager
	 * @param  {object} oElement Shape object
	 * @public
	 */
	BaseImage.prototype.renderElement = function(oRm, oElement) {
		if (this._needToRenderAs() === RenderAs.Image) {
			oRm.write("<image");
			this.writeElementData(oRm);
			oRm.writeClasses(this);
			RenderUtils.renderAttributes(oRm, oElement, mImageAttributes);
			oRm.writeAttribute("xlink:href", this.getProperty("src"));
			oRm.write(">");

			RenderUtils.renderTooltip(oRm, oElement);

			oRm.write("</image>");
		} else if (this._needToRenderAs() === RenderAs.IconFont) {
			BaseText.prototype.renderElement.apply(this, arguments);
		}
	};

	return BaseImage;
}, true);
