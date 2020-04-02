/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Core",
	"./BaseRectangle",
	"./TitlePropagator",
	"./BasePath"
], function (Core, BaseRectangle, TitlePropagator, BasePath) {
	"use strict";

	/**
	 * Creates and initializes a Chevron object
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * A chevron is an inverted V-shaped pattern, it's a basic duration shape that requires two timestamps.
	 * You can use it to represent a task or project execution period.
	 *
	 * @extends sap.gantt.simple.BaseRectangle
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseChevron
	 */
	var BaseChevron = BaseRectangle.extend("sap.gantt.simple.BaseChevron", /** @lends sap.gantt.simple.BaseChevron.prototype */ {
		metadata: {
			properties: {
				/**
				 * The head width of the Chevron
				 */
				headWidth: { type: "sap.gantt.SVGLength", defaultValue: 10 },

				/**
				 * The tail width of the Chevron
				 */
				tailWidth: { type: "sap.gantt.SVGLength", defaultValue: 10 }
			}
		}
	});

	TitlePropagator.call(BaseChevron.prototype, false /**bDefault*/);

	/**
	 * The d attribute provides a path definition to be drawn.
	 *
	 * @return {string} Value of property d.
	 * @public
	 */
	BaseChevron.prototype.getD = function () {
		var bRTL = Core.getConfiguration().getRTL();

		var head = this.getHeadWidth(),
			tail = this.getTailWidth();

		var x = this.getX(),
			w = this.getWidth(),
			h = this.getHeight(),
			y = this.getRowYCenter();

		var concat = function () {
			var sResult = "";
			for (var iIdx = 0; iIdx < arguments.length; iIdx++) {
				sResult += arguments[iIdx] + " ";
			}
			return sResult;
		};

		if (!bRTL) {
			if (w - head < 0){
				// period too short
				return concat("M", x + w / 2, y, "l", -w / 2, -h / 2, "h", w / 2, "l", w / 2, h / 2, "l", -w / 2, h / 2, "h", -w / 2) + "Z";
			}
			return concat("M", x + tail, y, "l", -tail, -h / 2, "h", w - head, "l", head, h / 2, "l", -head, h / 2, "h", head - w) + "Z";
		} else {
			if (w - head < 0){
				// period too short
				return concat("M", x, y, "l", w / 2, -h / 2, "h", w / 2, "l", -w / 2, h / 2, "l", w / 2, h / 2, "h", -w / 2) + "Z";
			}
			return concat("M", x, y, "l", head, -h / 2, "h", w - head, "l", -tail, h / 2, "l", tail, h / 2, "h", head - w) + "Z";
		}
	};

	// Delegate the rendering to BasePath
	BaseChevron.prototype.renderElement = function () {
		if (this._isValid()) {
			BasePath.prototype.renderElement.apply(this, arguments);
		}
	};

	return BaseChevron;
}, true);
