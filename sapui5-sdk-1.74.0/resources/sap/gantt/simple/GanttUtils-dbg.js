/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides helper sap.gantt.simple.GanttUtils
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Core",
	"sap/gantt/misc/Utility",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Locale"
], function(jQuery, Core, Utility, DateFormat, Locale) {
	"use strict";
	var oContextCache = {};
	var GanttUtils = {

		SHAPE_ID_DATASET_KEY          : "data-sap-gantt-shape-id",
		ROW_ID_DATASET_KEY            : "data-sap-gantt-row-id",
		CONNECTABLE_DATASET_KEY       : "data-sap-gantt-connectable",
		SELECT_FOR_DATASET_KEY        : "sap-gantt-select-for",
		SHAPE_CONNECT_FOR_DATASET_KEY : "sap-gantt-shape-connect-for",
		SHAPE_CONNECT_INDICATOR_WIDTH : 10,

		/**
		 * Try to find the in-row shape instance after rendering
		 */
		shapeElementById: function(sShapeId, sGanttSvgId) {
			var oGanttSvg = jQuery.sap.domById(sGanttSvgId),
				oShapeContainer = oGanttSvg.querySelector("g.sapGanttChartShapes");

			var aNodeList = oShapeContainer.querySelectorAll("[" + GanttUtils.SHAPE_ID_DATASET_KEY + "='" + sShapeId + "']");
			var oElementNode = aNodeList[0];
			if (oElementNode) {
				return jQuery(oElementNode).control(0);
			}

			return null;
		},

		getValueX: function(oShape) {
			var nTimeX;
			var oProp = oShape.getMetadata().getProperty("x");
			if (oProp) {
				nTimeX = oShape.getProperty(oProp.name);
				if (nTimeX !== null && nTimeX !== undefined) {
					return nTimeX;
				}
			}

			var bRTL = Core.getConfiguration().getRTL(),
				vTime = bRTL ? (oShape.getEndTime() || oShape.getTime()) : oShape.getTime();

			if (vTime) {
				nTimeX = oShape.getXByTime(vTime);
			}

			if (!jQuery.isNumeric(nTimeX)) {
				jQuery.sap.log.warning("couldn't convert timestamp to x with value: " + vTime);
			}

			return nTimeX;
		},

		/**
		 * get table row by background rect element
		 * @private
		 */
		getRowInstance: function(oEvent, oTable) {
			var iRowIndex = jQuery(oEvent.target).closest("rect.sapGanttBackgroundSVGRow").data("sapUiIndex");
			if (iRowIndex != null) {
				return oTable.getRows()[iRowIndex];
			}
		},

		/**
		 * Creates context for measuring size of the font and then the context is put
		 * in cache for later use. Every shape used to have its own 2d context,
		 * but IE11 could not handle that. That is why the 2d context is cached
		 * once for all shapes here.
		 * @param {number} iFontSize Size of font
		 * @param {string} sFontFamily Font family
		 * @returns {CanvasRenderingContext2D} 2d context
		 * @private
		 */
		_get2dContext: function(iFontSize, sFontFamily) {
			if (!oContextCache.context) {
				/* eslint-disable sap-no-element-creation */
				oContextCache.context
					= document.createElement('canvas').getContext("2d");
				/* eslint-enable sap-no-element-creation */
			}
			if (oContextCache.fontSize !== iFontSize
				|| oContextCache.fontFamily !== sFontFamily) {
				oContextCache.context.font = iFontSize + "px " + sFontFamily;
				oContextCache.fontSize = iFontSize;
				oContextCache.fontFamily = sFontFamily;
			}
			return oContextCache.context;
		},

		/**
		 * Returns width of the shape text
		 * @param {string} sText Text in the shape
		 * @param {number} iFontSize font size
		 * @param {string} sFontFamily Font family
		 * @returns {number} width of the shape text
		 * @private
		 */
		getShapeTextWidth: function(sText, iFontSize, sFontFamily) {
			return this._get2dContext(iFontSize, sFontFamily)
				.measureText(sText).width;
		},

		getSelectedTableRowSettings: function(oTable, iSelectedIndex) {
			var aAllRows = oTable.getRows(),
				iFirstVisibleRow = oTable.getFirstVisibleRow();

			if (aAllRows.length === 0) {
				// prevent error in below
				return null;
			}
			var iFirstRowIndex = aAllRows[0].getIndex();

			var iIndex = iSelectedIndex - iFirstVisibleRow;
			if (iFirstRowIndex !== iFirstVisibleRow) {
				// Case that variableRowHeight is enabled and table scroll to the bottom
				iIndex += Math.abs(iFirstRowIndex - iFirstVisibleRow);
			}

			var oRow = aAllRows[iIndex];

			return oRow.getAggregation("_settings");
		},

		updateGanttRows: function(oDelegator, aRowState, iIndex) {
			var oGantt = oDelegator.getParent().getParent();
			var $svg = jQuery.sap.byId(oGantt.getId() + "-svg"),
				$bgRects = $svg.find("rect.sapGanttBackgroundSVGRow");
			$bgRects.eq(iIndex).toggleClass("sapGanttBackgroundSVGRowSelected", !!aRowState[iIndex].selected);
			$bgRects.eq(iIndex).toggleClass("sapGanttBackgroundSVGRowHovered",  !!aRowState[iIndex].hovered);
		},

		/**
		 * Get shapes element with their Uids
		 *
		 * @param  {string} sContainerId        Gantt chart's dom id
		 * @param  {string[]} aShapeUid            Array of shape uid
		 * @return {object[]}                      Array of shape element
		 */
		getShapesWithUid : function (sContainerId, aShapeUid) {
			var fnElementFromShapeId = function(sShapeUid) {
				var oPart = Utility.parseUid(sShapeUid),
					sShapeId = oPart.shapeId;

				var selector = ["[id='", sContainerId, "']", " [" + GanttUtils.SHAPE_ID_DATASET_KEY + "='", sShapeId, "']"].join("");
				return jQuery(selector).control().filter(function(oElement){
					return oElement.getShapeUid() === sShapeUid;
				})[0];

			};
			var aElement = aShapeUid.map(fnElementFromShapeId);
			return aElement;
		},

		/**
		 * Get time formater by lower level of time axis.
		 * Keep the time unit to date if lower level of the time axis is bigger than or equal to date
		 *
		 * @param {object} oGantt  Gantt chart instance
		 *
		 * @return {object} Time formater
		 */
		getTimeFormaterBySmallInterval : function(oGantt) {
			var oAxisTimeStrategy = oGantt.getAxisTimeStrategy(),
				oSmallInterval = oAxisTimeStrategy.getTimeLineOption().smallInterval,
				oUnit = oSmallInterval.unit;

			var oCalendarType = oAxisTimeStrategy.getCalendarType(),
				oCoreLocale = oAxisTimeStrategy.getLocale() ? oAxisTimeStrategy.getLocale() :
					new Locale(Core.getConfiguration().getLanguage().toLowerCase());

			// keep the time unit to date if lower level of the time axis is bigger than or equal to date.
			var sFormat = "yyyyMMMddhhms";
			if (!(oUnit === sap.gantt.config.TimeUnit.minute || oUnit === sap.gantt.config.TimeUnit.hour)) {
				sFormat = "yyyyMMMdd";
			}

			var oFormatter = DateFormat.getDateTimeInstance({
				format: sFormat,
				style: oSmallInterval.style,
				calendarType: oCalendarType
			}, oSmallInterval.locale ? new Locale(oSmallInterval.locale) : oCoreLocale);

			return oFormatter;
		}
	};

	return GanttUtils;

}, /* bExport= */ true);
