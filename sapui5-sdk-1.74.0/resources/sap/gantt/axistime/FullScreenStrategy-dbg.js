/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/library",
	"sap/ui/core/Element",
	"sap/base/util/ObjectPath",
	"./AxisTimeStrategyBase",
	"../misc/Utility",
	"../misc/Format"
], function (
	library,
	Element,
	ObjectPath,
	AxisTimeStrategyBase,
	Utility,
	Format
) {
	"use strict";

	sap.gantt.axistime.FullScreenTimeLineOptions = library.config.DEFAULT_TIME_ZOOM_STRATEGY;

	/**
	 * Creates and initializes a FullScreenStrategy.
	 *
	 * @param {string} [sId] ID for the new AxisTimeStrategy, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new AxisTimeStrategy
	 *
	 * @class
	 * FullScreenStrategy
	 *
	 * <p>
	 * A zoom strategy that sets the value of <code>totalHorizon</code> to the value of <code>visibleHorizon</code>.
	 * When this strategy is implemented, <code>visibleHorizon</code> is fixed. Because of this, when you scroll the
	 * splitter to expand or shrink the chart area, the value of <code>visibleHorizon</code> remains intact, which makes
	 * shapes look larger or smaller accordingly. Moreover, the horizontal scroll bar never appears and the zoom control
	 * is deactivated.
	 * </p>
	 *
	 * @extends sap.gantt.axistime.AxisTimeStrategyBase
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.axistime.FullScreenStrategy
	 */
	var FullScreenStrategy = AxisTimeStrategyBase.extend("sap.gantt.axistime.FullScreenStrategy");

	FullScreenStrategy.prototype.init = function () {
		this.setProperty("coarsestTimeLineOption", sap.gantt.axistime.FullScreenTimeLineOptions["1month"], true);
		this.setProperty("finestTimeLineOption", sap.gantt.axistime.FullScreenTimeLineOptions["5min"], true);
		this.setProperty("timeLineOptions", sap.gantt.axistime.FullScreenTimeLineOptions, true);
		this.setProperty("timeLineOption", sap.gantt.axistime.FullScreenTimeLineOptions["4day"], true);
		this.setProperty("zoomLevel", 0, true);
		this.setProperty("zoomLevels", 0, true);
		this.setProperty("mouseWheelZoomType", sap.gantt.MouseWheelZoomType.None, true);
	};

	FullScreenStrategy.prototype.applySettings = function (mSettings) {
		mSettings = mSettings || {};
		this.checkFirstDayOfWeek(mSettings);
		Element.prototype.applySettings.call(this, mSettings);
		this.calZoomBase();
		return this;
	};

	/**
	 * Do not allow to enable time period zoom, because this kind of zoom strategy does not support any type of zoom
	 * @override
	 */
	FullScreenStrategy.prototype.isTimePeriodZoomEnabled = function () {
		return false;
	};

	/**
	 * Do not allow to set zoom type, because this kind of zoom strategy does not support any type of zoom
	 * @param {sap.gantt.MouseWheelZoomType} sMouseWheelZoomType zoom type to be set
	 * @return {object} the FullScreenStrategy instance itself
	 * @override
	 */
	FullScreenStrategy.prototype.setMouseWheelZoomType = function (sMouseWheelZoomType) {
		jQuery.sap.log.warning("FullScreenStrategy does not support zoom, its zoom type is None and can not be set",
				null,
				"FullScreenStrategy.prototype.setMouseWheelZoomType()");
		return this;
	};

	FullScreenStrategy.prototype.setVisibleHorizon = function (oVisibleHorizon) {
		this.setVisibleHorizonWithReason(oVisibleHorizon, "visibleHorizonUpdated");
		return this;
	};

	FullScreenStrategy.prototype.setTotalHorizon = function (oTotalHorizon) {
		var oCurrentTH = this.getTotalHorizon();
		if (oCurrentTH === oTotalHorizon || (oCurrentTH && oCurrentTH.equals(oTotalHorizon))) {
			return;
		}
		this.setAggregation("totalHorizon", oTotalHorizon);
	};

	FullScreenStrategy.prototype.setVisibleHorizonWithReason = function (oVisibleHorizon, sReasonCode, oOriginEvent) {
		// in Full Screen case, the total horizon and visible horizon will always be the same.
		if (!this.getTotalHorizon() || !this.getTotalHorizon().equals(oVisibleHorizon)) {
			this.setTotalHorizon(oVisibleHorizon.clone());
		}
		var oLastVisibleHorizon = this.getVisibleHorizon();
		if (oLastVisibleHorizon) {
			oLastVisibleHorizon = oLastVisibleHorizon.clone();
		}
		AxisTimeStrategyBase.prototype._setVisibleHorizon.call(this, oVisibleHorizon);
		if (oLastVisibleHorizon) {
			this.fireRedrawRequest(true, sReasonCode, oLastVisibleHorizon, oOriginEvent);
		}
		return this;
	};

	FullScreenStrategy.prototype.syncContext = function (nClientWidth) {
		var bAxisTimeNeedChange = false;

		var oRetVal = {
			axisTimeChanged : false
		};

		var fSuitableRate = this._calSuitableRateByChartWidth(nClientWidth);

		if (fSuitableRate !== undefined) {
			var fLastRate = this._oZoom.rate || -1;

			this._oZoom.rate = fSuitableRate;
			this.getParent().getAxisTime().setZoomRate(this._oZoom.rate); // parent Gantt creates AxisTime if it does not exist

			bAxisTimeNeedChange = !Utility.floatEqual(fLastRate, this._oZoom.rate);
			if (bAxisTimeNeedChange) {
				oRetVal.axisTimeChanged = true;
			}
		}

		this._updateTimeLineOption();
		return oRetVal;
	};

	FullScreenStrategy.prototype._calSuitableRateByChartWidth = function (nClientWidth) {
		var oInitHorizon = this.getVisibleHorizon(),
			fSuitableRate;

		// calculate suitable zoom rate by init horizon against svg container width
		if (oInitHorizon && oInitHorizon.getStartTime() && oInitHorizon.getEndTime()) {
			var fSuitableScale = this.calZoomScaleByDate(
				Format.abapTimestampToDate(oInitHorizon.getStartTime()),
				Format.abapTimestampToDate(oInitHorizon.getEndTime()),
				nClientWidth);
			fSuitableRate = this._oZoom.base.scale / fSuitableScale;
		}

		return fSuitableRate;
	};

	FullScreenStrategy.prototype._updateTimeLineOption = function(){
		var startTime = Format.getTimeStampFormatter().parse("20000101000000"),
		iCurrentTickKey,
		i,
		oTimeLineOptions = this.getTimeLineOptions(),
		oTimeLineOption = this.getProperty("timeLineOption");

		var oAxisTime = this.getAxisTime();
		if (oAxisTime) {
			var start = oAxisTime.timeToView(startTime);

			for (i in oTimeLineOptions) {
				var interval = oTimeLineOptions[i].innerInterval;
				var end = oAxisTime.timeToView(ObjectPath.get(interval.unit).offset(startTime, interval.span));
				var r = Math.abs(Math.ceil((end - start)));
				if (r >= interval.range) {
					iCurrentTickKey = i;
					break;
				}
			}
			oTimeLineOption = iCurrentTickKey ? oTimeLineOptions[iCurrentTickKey] : oTimeLineOptions[i];
			this.setProperty("timeLineOption", oTimeLineOption, true);
		}
	};

	return FullScreenStrategy;
}, true);
