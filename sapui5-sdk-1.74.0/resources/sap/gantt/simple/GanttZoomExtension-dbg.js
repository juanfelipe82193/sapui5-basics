/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/events/KeyCodes",
	"sap/gantt/config/TimeHorizon",
	"./GanttExtension",
	"./CoordinateUtils",
	"./AggregationUtils"
],
	function(
		jQuery,
		KeyCodes,
		TimeHorizon,
		GanttExtension,
		CoordinateUtils,
		AggregationUtils
	) {
	"use strict";

	var aInterestedMouseEvents = [
		"mousedown", "mousemove", "mouseup", "wheel", "MozMousePixelScroll"
	];

	// This is an enum to store all the interested browser event in GanttZoomExtension
	var BrowserEvent = aInterestedMouseEvents.reduce(function(events, name){
		events[name] = name;
		return events;
	}, {});
	BrowserEvent.keydown    = "keydown";
	BrowserEvent.periodZoom = "periodZoom";


	// append namespace to the interested event for bind/unbind
	var sNameSpace = ".sapGanttZoom";
	var _fnAppendNamespace = function(sEvent) { return sEvent + sNameSpace; };
	aInterestedMouseEvents = aInterestedMouseEvents.map(_fnAppendNamespace);

	var PeriodZoomWithNS = BrowserEvent.periodZoom + sNameSpace;
	var KeyDownWithNS    = BrowserEvent.keydown + sNameSpace;

	// pseudo events for time period zoom
	var ZOOM_PSEUDO_EVENTS = {
		start:   "zoomStart",
		zooming: "zooming",
		end:     "zoomEnd"
	};

	var GanttZoomHelper = {
		dispatch: function(oEvent, mParam) {
			var oExtension = this._getZoomExtension(),
				originalEvent = oEvent.originalEvent || oEvent;

			// First check if mouse wheel zoom, which is trigger by combine shortcuts
			if (oExtension.isMouseWheelZoom(oEvent)) {
				var bSuppress = mParam && mParam.suppressSyncEvent;
				oExtension.performMouseWheelZooming(originalEvent, bSuppress);
				return;
			}
			// handle time period zooming step by step
			if (mParam && mParam.which) {
				originalEvent.which = mParam.which;
			}
			oExtension.performTimePeriodZooming(originalEvent);
		},

		addEventListeners: function(oGantt) {
			var oExtension = oGantt._getZoomExtension(),
				mDom = oExtension.getDomRefs(),
				oGanttSvg = mDom.ganttSvg,
				oGanttDom = mDom.gantt,
				oHeaderSvg = mDom.headerSvg;
			var fnBindEventToDom = function(sEventName, oDom) {
				jQuery(oDom).bind(sEventName, GanttZoomHelper.dispatch.bind(oGantt));
			};

			// before binding events, first clear all to prevent duplicate event registered
			GanttZoomHelper.removeEventListeners(oGantt);

			aInterestedMouseEvents.forEach(function(sEventName){
				fnBindEventToDom(sEventName, oGanttSvg);
				if (sEventName.startsWith(BrowserEvent.wheel) || sEventName.startsWith(BrowserEvent.MouseWheelZoomType)) {
					fnBindEventToDom(sEventName, oHeaderSvg);
				}
			});

			jQuery(oGanttDom).on(PeriodZoomWithNS, GanttZoomHelper.dispatch.bind(oGantt));

			jQuery(document).on(KeyDownWithNS, function(event){
				if (event.which === KeyCodes.Z || event.which === KeyCodes.ESCAPE) {
					jQuery(this).find(".sapGanttChartContentBody").trigger(PeriodZoomWithNS, {which: event.which});
				}
			});
		},
		removeEventListeners: function(oGantt) {
			var oExtension = oGantt._getZoomExtension(),
				mDom = oExtension.getDomRefs(),
				oGanttSvg = mDom.ganttSvg,
				oGanttDom = mDom.gantt,
				oHeaderSvg = mDom.headerSvg;
			jQuery(oGanttSvg).unbind(sNameSpace);
			jQuery(oHeaderSvg).unbind(sNameSpace);
			jQuery(oGanttDom).unbind(sNameSpace);
			jQuery(document).off(sNameSpace);

		}
	};

	var GanttZoomExtension = GanttExtension.extend("sap.gantt.GanttZoomExtension", {
		/**
		 * @override
		 * @inheritDoc
		 * @returns {string} The name of this extension.
		 */
		_init: function(oGantt, mSettings) {

			this.bTimePeriodZoomMode = false;
			this.oZoomStartTime = null;

			this.iMouseWheelZoomDelayedCallId = undefined;
			this.iLastMouseWheelZoomTimeInMs = 0;

			return "ZoomExtension";
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_attachEvents: function() {
			var oGantt = this.getGantt();
			GanttZoomHelper.removeEventListeners(oGantt);
			GanttZoomHelper.addEventListeners(oGantt);
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_detachEvents: function() {
			var oGantt = this.getGantt();
			GanttZoomHelper.removeEventListeners(oGantt);
		}
	});

	GanttZoomExtension.prototype.isMouseWheelZoom = function(oEvent) {
		var bAttempToZoom = oEvent.shiftKey && oEvent.ctrlKey && (oEvent.type === BrowserEvent.wheel || oEvent.type === BrowserEvent.MozMousePixelScroll);
		if (bAttempToZoom) {
			oEvent.preventDefault();
			oEvent.stopImmediatePropagation();
			oEvent.stopPropagation();
		}
		return bAttempToZoom;
	};

	GanttExtension.prototype.performMouseWheelZooming = function(oEvent, bSuppressSyncEvent) {
		var iScrollDelta     = this._getWheelScrollDelta(oEvent),
			iAnchorPositionX = this._getMousePositionX(oEvent);

		this.decideMouseWheelZoom(oEvent, iScrollDelta, iAnchorPositionX, bSuppressSyncEvent);
	};

	GanttZoomExtension.prototype._getWheelScrollDelta = function(oEvent) {
		//For IE, FF, CHROME, the scroll delta is all on 'deltaY', even with key 'shift', 'ctrl', 'alt', or 'shift+ctrl'
		var iScrollDelta = oEvent.deltaY || oEvent.deltaX;
		if (iScrollDelta === 0 || iScrollDelta === undefined) {
			iScrollDelta = oEvent.detail;
		}

		// in firefox. the deltaY is very small number, while the deltaMode is 1.
		// in Chrome, the deltaMode is 0 but with regular deltaY value
		var iDeltaFactor = oEvent.deltaMode === 1 ? 33 : 1;

		return iScrollDelta * iDeltaFactor;
	};

	GanttZoomExtension.prototype._getMousePositionX = function(oEvent) {
		return CoordinateUtils.xPosOfSvgElement(oEvent, jQuery(this.getDomRefs().ganttSvg));
	};

	GanttZoomExtension.prototype.decideMouseWheelZoom = function(oOriginEvent, iScrollDelta, iMousePositionX, bSuppressSyncEvent) {
		var oGantt = this.getGantt(),
			oZoomStrategy = oGantt.getAxisTimeStrategy();
		if (oZoomStrategy.getMouseWheelZoomType() === sap.gantt.MouseWheelZoomType.None) { return; }

		var bZoomIn = iScrollDelta < 0,
			bZoomOut = !bZoomIn;

		var iCurrentZoomLevel = oZoomStrategy.getZoomLevel(),
			iMaximalZoomLevel = oZoomStrategy.getZoomLevels() - 1;

		if ((bZoomOut && iCurrentZoomLevel > 0) || (bZoomIn && iCurrentZoomLevel < iMaximalZoomLevel)) {
			// this._toggleCursorLine(/**bShow*/false);

			// update the visible horizon by using a delayed mechanism to avoid too many updates
			// Mousewheel zoom triggers a zooming every 100ms, so the update requests fired with 100ms will be done once
			// Except: if it is firstly triggered, or the last delayed call is finished and the time elapsed since last call is long enough for the
			// whole re-draw to be finished, we do an immediate update instead of a delayed one
			var iTimeDelay = (!this.iMouseWheelZoomDelayedCallId && (Date.now() - this.iLastMouseWheelZoomTimeInMs > 100)) ? 0 : 100;
			if (iTimeDelay === 0) {
				this.onMouseWheelZooming(oOriginEvent, oZoomStrategy, iMousePositionX, iScrollDelta, bSuppressSyncEvent);
			} else {
				this.iMouseWheelZoomDelayedCallId = this.iMouseWheelZoomDelayedCallId
					|| jQuery.sap.delayedCall(iTimeDelay, this, this.onMouseWheelZooming, [oOriginEvent, oZoomStrategy, iMousePositionX, iScrollDelta, bSuppressSyncEvent]);
			}
		}
	};

	GanttZoomExtension.prototype.onMouseWheelZooming = function(oOriginEvent, oZoomStrategy, iMousePositionX, iScrollDelta, bSuppressSyncEvent) {
		this.iLastMouseWheelZoomTimeInMs = Date.now();

		var oTimeAtMousePosition = oZoomStrategy.getAxisTime().viewToTime(iMousePositionX);
		// update visible horizon according to different zoom granularity configured in zoom strategy
		oZoomStrategy.updateVisibleHorizonOnMouseWheelZoom(oTimeAtMousePosition, iScrollDelta, oOriginEvent, bSuppressSyncEvent);

		jQuery.sap.clearDelayedCall(this.iMouseWheelZoomDelayedCallId);
		delete this.iMouseWheelZoomDelayedCallId;
	};

	GanttZoomExtension.prototype.performTimePeriodZooming = function(oEvent) {
		var oPointerExtension = this.getGantt()._getPointerExtension();
		var bInSvg = oPointerExtension.isPointerInGanttChart();

		var oAxisTimeStrategy = this.getGantt().getAxisTimeStrategy();

		if (!oAxisTimeStrategy.isTimePeriodZoomEnabled()) { return; }

		/// Step 1: Only if user hover on Svg to trigger time period zoom
		if (bInSvg === false) { return; }

		/// Step 2: User press the shortcut key to turn on the zooming mode
		if (oEvent.type === BrowserEvent.periodZoom) {
			if (oEvent.which === KeyCodes.Z && oPointerExtension.isPointerInGanttChart()) {
				// if and only if mouse hover on SVG then press z then turn on/off zoom mode
				this.bTimePeriodZoomMode = !this.bTimePeriodZoomMode;
			}

			if (oEvent.which === KeyCodes.ESCAPE) {
				// turn off zoom mode whenever esc key is pressed
				this.bTimePeriodZoomMode = false;
			}

			// update cursor style immediately (not work if Chrome Dev tool is open)
			this.updateCursorStyle(this.bTimePeriodZoomMode);
		}

		/// Step 3: User press mouse to mark a position as starting point.
		if (oEvent.type === BrowserEvent.mousedown && oEvent.button === 0) {
			// left mouse is pressed

			if (this.bTimePeriodZoomMode) {

				this.handleZoomStart(oEvent);

				this._fireTimePeriodZoomEvent({
					type: ZOOM_PSEUDO_EVENTS.start,
					zoomStartTime: this.oZoomStartTime,
					zoomEndTime: null,
					originalEvent: oEvent
				});
			}
		}

		// Step 4: User keep moving mouse in Gantt to find a proper end position
		if (oEvent.type === BrowserEvent.mousemove && this.bTimePeriodZoomMode) {
			// update rectangle zooming area when mouse is moving
			var oEndTime = this.timeFromEvent(oEvent);
			this.handleZooming(oEvent);

			this._fireTimePeriodZoomEvent({
				type: ZOOM_PSEUDO_EVENTS.zooming,
				zoomStartTime: this.oZoomStartTime,
				zoomEndTime: oEndTime,
				originalEvent: oEvent
			});
		}

		// Step 5: User release the mouse to mark the position as end point
		if (oEvent.type === BrowserEvent.mouseup && this.bTimePeriodZoomMode) {
			// turn off time period zoom mode when mouse is released
			this.bTimePeriodZoomMode = false;
			var oEndTime = this.timeFromEvent(oEvent);
			this.handleZoomEnd(oEvent);

			this._fireTimePeriodZoomEvent({
				type: ZOOM_PSEUDO_EVENTS.end,
				zoomStartTime: this.oZoomStartTime,
				zoomEndTime: oEndTime,
				originalEvent: oEvent
			});
		}
	};

	GanttZoomExtension.prototype.timeFromEvent = function(oEvent) {
		var $svg = jQuery(this.getDomRefs().ganttSvg),
			iPostionX = CoordinateUtils.xPosOfSvgElement(oEvent, $svg);

		var oPointerExtension = this.getGantt()._getPointerExtension();
		iPostionX += oPointerExtension._getAutoScrollStep();

		return this.getGantt().getAxisTime().viewToTime(iPostionX);
	};

	GanttZoomExtension.prototype._fireTimePeriodZoomEvent = function(mParameters) {
		this.getGantt().fireEvent("_timePeriodZoomOperation", mParameters);
	};

	GanttZoomExtension.prototype.syncTimePeriodZoomOperation = function(oEvent, bTimeScrollSync, sOrientation) {
		var oOriginalEvent = oEvent.getParameter("originalEvent");
		var sType = oEvent.getParameter("type");
		switch (sType) {
			case ZOOM_PSEUDO_EVENTS.start:
				this.handleZoomStart(oOriginalEvent);
				break;
			case ZOOM_PSEUDO_EVENTS.zooming:
				this.handleZooming(oOriginalEvent);
				break;
			case ZOOM_PSEUDO_EVENTS.end:
				this.handleZoomEnd(oOriginalEvent, true);
				break;
			default:
				jQuery.sap.log.debug("unknown time period zoom type");
		}
	};

	GanttZoomExtension.prototype.handleZoomStart = function (oEvent){
		this.oZoomStartTime = this.timeFromEvent(oEvent);
		var iStartX = this.getGantt().getAxisTime().timeToView(this.oZoomStartTime);
		this.updateCursorStyle(this.bTimePeriodZoomMode);
		this.createZoomingRectangle(iStartX);
	};

	GanttZoomExtension.prototype.handleZooming = function(oEvent) {
		this._isZooming = true;
		var oStartTime = this.oZoomStartTime;
		var oEndTime = this.timeFromEvent(oEvent);
		var oAxisTime = this.getGantt().getAxisTime(),
			iStartX = oAxisTime.timeToView(oStartTime),
			iEndX = oAxisTime.timeToView(oEndTime);
		this.updateCursorStyle(this.bTimePeriodZoomMode);

		if (iEndX > iStartX){
			this.updateZoomingRectangle(iStartX, iEndX);
		} else {
			this.updateZoomingRectangle(iEndX, iStartX);
		}
	};

	GanttZoomExtension.prototype.isZoomingRectangleNotExisted = function() {
		var aSvgNode = d3.select(this.getDomRefs().ganttSvg);
		return aSvgNode.selectAll(".sapGanttChartTimePeriodZoomRectangle").size() === 0;
	};

	GanttZoomExtension.prototype.isTimeZooming = function() {
		return this._isZooming;
	};

	GanttZoomExtension.prototype._handleAutoScroll = function(oEvent) {
		if (this.isTimeZooming()) {
			if (this.isZoomingRectangleNotExisted()) {
				var oStartTime = this.oZoomStartTime;
				var oAxisTime = this.getGantt().getAxisTime(),
					iStartX = oAxisTime.timeToView(oStartTime);
				this.createZoomingRectangle(iStartX);
			}

			this.handleZooming(oEvent);
		}
	};

	GanttZoomExtension.prototype.handleZoomEnd = function(oEvent, bSyncCall) {
		this._isZooming = false;
		var oEndTime = this.timeFromEvent(oEvent);
		this.updateCursorStyle(this.bTimePeriodZoomMode);
		this.destroyZoomingRectangle();

		var oAxisTime = this.getGantt().getAxisTime(),
			iStartX = oAxisTime.timeToView(this.oZoomStartTime),
			iEndX = oAxisTime.timeToView(oEndTime);

		// Time period zoom only can be triggered when drag and drop than 5 px
		var iOperationIgnoreExtents = 5;
		if (Math.abs(iEndX - iStartX) > iOperationIgnoreExtents){

			var oStartTime = this.oZoomStartTime,
				oEndTime2  = oEndTime;

			if (oEndTime.getTime() < oStartTime.getTime()){
				var oTempTime = oStartTime;
				oStartTime = oEndTime;
				oEndTime2 = oTempTime;
			}

			var oTargetTimeHorizon = new TimeHorizon({
				startTime: oStartTime,
				endTime: oEndTime2
			});
			this.getGantt().syncVisibleHorizon(oTargetTimeHorizon, undefined, undefined, bSyncCall ? undefined : "timePeriodZooming");
		}
	};

	GanttZoomExtension.prototype.updateCursorStyle = function(bZoomMode) {
		var sCursorStyle = bZoomMode ? "crosshair" : "auto";
		this.getDomRefs().ganttSvg.style.cursor = sCursorStyle;
		this.getDomRefs().headerSvg.style.cursor = sCursorStyle;
	};

	GanttZoomExtension.prototype.createZoomingRectangle = function(xPosition) {
		var aSvgNode = d3.select(this.getDomRefs().ganttSvg);
		this.destroyZoomingRectangle();
		aSvgNode.append("rect")
			.classed("sapGanttChartTimePeriodZoomRectangle", true)
			.attr("x", xPosition)
			.attr("y", 0)
			.attr("height", jQuery(aSvgNode.node()).height());
	};

	GanttZoomExtension.prototype.updateZoomingRectangle = function (iStartPoint, iEndPoint) {
		var aSvgNode = d3.select(this.getDomRefs().ganttSvg);
		aSvgNode.selectAll(".sapGanttChartTimePeriodZoomRectangle")
				.attr("x", iStartPoint)
				.attr("width", iEndPoint - iStartPoint);
	};
	GanttZoomExtension.prototype.destroyZoomingRectangle = function () {
		var aSvgNode = d3.select(this.getDomRefs().ganttSvg);
		aSvgNode.selectAll(".sapGanttChartTimePeriodZoomRectangle").remove();
	};

	GanttZoomExtension.prototype.doBirdEye = function(iRowIndex) {
		var oGantt = this.getGantt();
		var oBirdEyeRange = this.calculateBirdEyeRange(iRowIndex);
		var oBirdEyeHorizon = new TimeHorizon(oBirdEyeRange);

		oGantt.getAxisTimeStrategy()._setVisibleHorizon(oBirdEyeHorizon);
	};

	GanttZoomExtension.prototype.calculateBirdEyeRange = function(iRowIndex) {
		var oGantt = this.getGantt();
		var oTable = oGantt.getTable();
		var aRows = oTable.getRows();

		var oHorizonRange;
		var oStartTime;
		var oEndTime;

		if (iRowIndex !== undefined){
			oHorizonRange = this._getBirdEyeRangeOnRow(iRowIndex);
			oStartTime = oHorizonRange.startTime;
			oEndTime = oHorizonRange.endTime;
		} else {
			for (var i = 0; i < aRows.length; i++){
				oHorizonRange = this._getBirdEyeRangeOnRow(i);
				if (oHorizonRange.startTime && oHorizonRange.endTime){
					var oResult = this._calculateBirdEyeTimeRange(oStartTime, oEndTime, oHorizonRange.startTime, oHorizonRange.endTime);
					oStartTime = oResult.startTime;
					oEndTime = oResult.endTime;
				}
			}

		}

		var oBirdEyeRange = {
			startTime: oStartTime,
			endTime: oEndTime
		};

		return oBirdEyeRange;
	};

	GanttZoomExtension.prototype._getBirdEyeRangeOnRow = function(iRowIndex) {
		var oGantt = this.getGantt();
		var oTable = oGantt.getTable();
		var oBindingInfo = oTable.getBindingInfo("rows"),
			sModelName = oBindingInfo && oBindingInfo.model;

		var aRows = oTable.getRows();
		var oRow = aRows[iRowIndex];
		var oRowContext = oRow.getBindingContext(sModelName);

		var oStartTime;
		var oEndTime;

		if (oRowContext){
			var oRowSettings = oRow.getAggregation("_settings");
			var aShapesInRow = [];

			aShapesInRow = this._getShapeInRow(oRowSettings, aShapesInRow);


			var that = this;
			aShapesInRow.forEach(function(oShape){
				if (oShape.getCountInBirdEye()){
					var oShapeStartTime = oShape.getTime();
					var oShapeEndTime = oShape.getEndTime();

					var oResult = that._calculateBirdEyeTimeRange(oStartTime, oEndTime, oShapeStartTime, oShapeEndTime);
					oStartTime = oResult.startTime;
					oEndTime = oResult.endTime;
				}
			});
		}

		if (oStartTime && oEndTime){
			var nVisibleWidth = oGantt.getVisibleWidth();
			var timeRangePerPixel = (oEndTime.getTime() - oStartTime.getTime()) / nVisibleWidth;
			oStartTime = new Date(oStartTime.getTime() - timeRangePerPixel * 5);
			oEndTime = new Date(oEndTime.getTime() + timeRangePerPixel * 5);
		}

		var oHorizonRange = {
			startTime: oStartTime,
			endTime: oEndTime
		};

		return oHorizonRange;
	};

	GanttZoomExtension.prototype._getShapeInRow = function(oElement, aShapesInRow){
		var mAggregations = AggregationUtils.getNonLazyAggregations(oElement);
		var that = this;
		Object.keys(mAggregations).forEach(function(sName){ // eslint-disable-line
			// get all binding aggregation instances and default to empty array
			var aAggregations = oElement.getAggregation(sName);
			if (aAggregations){
				aAggregations = jQuery.isArray(aAggregations) ? aAggregations : [aAggregations];

				if (aAggregations.length > 0) {
					aShapesInRow = aShapesInRow.concat(aAggregations);
					aAggregations.forEach(function(oAggregation){
						aShapesInRow = that._getShapeInRow(oAggregation, aShapesInRow);
					});
				}
			}

		}.bind(oElement));
		return aShapesInRow;
	};

	GanttZoomExtension.prototype._calculateBirdEyeTimeRange = function(oEarlyestStartTime, oLatestEndTime, oCurrentStartTime, oCurrentEndTime) {
		if (!oEarlyestStartTime || oCurrentStartTime.getTime() < oEarlyestStartTime.getTime()) {
			oEarlyestStartTime = oCurrentStartTime;
		}

		if (!oLatestEndTime || oLatestEndTime.getTime() < oCurrentEndTime.getTime()) {
			oLatestEndTime = oCurrentEndTime;
		}

		return {
			startTime: oEarlyestStartTime,
			endTime: oLatestEndTime
		};
	};
	return GanttZoomExtension;
});
