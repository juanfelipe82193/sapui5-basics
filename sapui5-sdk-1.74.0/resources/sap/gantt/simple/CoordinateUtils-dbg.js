/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(['jquery.sap.global', "sap/ui/Device"], function(jQuery, Device) {
	"use strict";

	// private, holder for the cursor postion
	var mXy = {};

	/**
	 * Class for CoordinateUtils.
	 *
	 * @class Utility functionality to work with SVG coordination, e.g. find x position of cursor
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @private
	 * @static
	 * @alias sap.gantt.simple.CoordinateUtils
	 */

	var CoordinateUtils = {

		xPosOfEvent : function(oEvent) {
			return Device.browser.edge ? oEvent.clientX : oEvent.pageX;
		},

		xPosOfSvgElement : function(oEvent, $svg) {
			return this.xPosOfEvent(oEvent) - ($svg.offset().left || oEvent.offsetX);
		},

		getEventSVGPoint : function(oSVGNode, oEvent){
			var oClickPoint = oSVGNode.createSVGPoint();

			oClickPoint.x = this.xPosOfEvent(oEvent);
			oClickPoint.y = oEvent.pageY || oEvent.clientY;
			oClickPoint = oClickPoint.matrixTransform(oSVGNode.getScreenCTM().inverse());
			oClickPoint.svgId = oSVGNode.id;
			return oClickPoint;
		},

		getSvgScreenPoint : function(oSVGNode, oEvent){
			var oClickPoint = oSVGNode.createSVGPoint();

			oClickPoint.x = this.xPosOfEvent(oEvent);
			oClickPoint.y = oEvent.pageY || oEvent.clientY;
			oClickPoint = oClickPoint.matrixTransform(oSVGNode.getScreenCTM());
			oClickPoint.svgId = oSVGNode.id;
			return oClickPoint;
		},

		getEventPosition : function(oEvent) {
			return { pageX: this.xPosOfEvent(oEvent), pageY: oEvent.pageY};
		},

		updateCursorPosition : function(oEvent) {
			mXy = {
				pageX: oEvent.pageX,
				pageY: oEvent.pageY,
				clientX: oEvent.clientX,
				clientY: oEvent.clientY
			};
		},

		getLatestCursorPosition : function() {
			return mXy;
		},

		/**
		 * get the topmost DOM element under the cursor
		 */
		getCursorElement : function () {
			var elem = document.elementFromPoint(mXy.clientX, mXy.clientY);
			return jQuery(elem).control(0);
		}
	};

	return CoordinateUtils;
}, /* bExport= */true);
