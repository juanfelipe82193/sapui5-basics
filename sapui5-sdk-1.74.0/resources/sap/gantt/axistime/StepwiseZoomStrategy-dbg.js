/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/library",
	"sap/base/util/ObjectPath",
	"./AxisTimeStrategyBase",
	"../misc/Format"
],function(library, ObjectPath, AxisTimeStrategyBase, Format) {
	"use strict";

	var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.gantt");

	var TimeUnit = library.config.TimeUnit;

	sap.gantt.axistime.StepwiseTimeLineOptions = {
		"FiveMinutes": {
			text: oRb.getText("SWZS_FIVE_MINUTES"),
			innerInterval: {
				unit: TimeUnit.minute,
				span: 5,
				range: 32 //2rem
			},
			largeInterval: {
				unit: TimeUnit.hour,
				span: 1,
				//first label e.g.: 9AM / July 12, 2016; others e.g.: "10AM"
				pattern: "ha / MMMM dd, yyyy "
			},
			smallInterval: {
				unit: TimeUnit.minute,
				span: 5,
				//e.g. 00, 05, ...55
				pattern: "mm "
			}
		},
		"FifteenMinutes": {
			text: oRb.getText("SWZS_FIFTEEN_MINUTES"),
			innerInterval: {
				unit: TimeUnit.minute,
				span: 15,
				range: 48
			},
			largeInterval: {
				unit: TimeUnit.hour,
				span: 1,
				//first label e.g.: 9AM / July 12, 2016; others e.g.: "10AM"
				pattern: "ha / MMMM dd, yyyy "
			},
			smallInterval: {
				unit: TimeUnit.minute,
				span: 15,
				pattern: "mm "
			}
		},
		"Hour": {
			text: oRb.getText("SWZS_HOUR"),
			innerInterval: {
				unit: TimeUnit.hour,
				span: 1,
				range: 48
			},
			largeInterval: {
				unit: TimeUnit.day,
				span: 1,
				//first label e.g. July 12, 2016; others e.g. July 13
				pattern: "MMMM dd, yyyy "
			},
			smallInterval: {
				unit: TimeUnit.hour,
				span: 1,
				pattern: "HH:mm "
			}
		},
		"SixHours": {
			text: oRb.getText("SWZS_SIX_HOURS"),
			innerInterval: {
				unit: TimeUnit.hour,
				span: 6,
				range: 64
			},
			largeInterval: {
				unit: TimeUnit.day,
				span: 1,
				//first label e.g. July 12, 2016; others e.g. July 13
				pattern: "MMMM dd, yyyy "
			},
			smallInterval: {
				unit: TimeUnit.hour,
				span: 6,
				pattern: "HH:mm "
			}
		},
		"DayDate": {
			text: oRb.getText("SWZS_DATE_1"),
			innerInterval: {
				unit: TimeUnit.day,
				span: 1,
				range: 64
			},
			largeInterval: {
				unit: TimeUnit.week,
				span: 1,
				//first label e.g.: Jan 2015, Week 04; others e.g. Feb, Mar...
				pattern: oRb.getText("SWZS_DATE_PATTERN", ["LLL yyyy, '", "' ww  "])
			},
			smallInterval: {
				unit: TimeUnit.day,
				span: 1,
				//e.g. Mon 22, Tue 23
				pattern: sap.ui.getCore().getConfiguration().getRTL() ? "dd EEE " : "EEE dd "
			}
		},
		"Date": {
			text: oRb.getText("SWZS_DATE_2"),
			innerInterval: {
				unit: TimeUnit.day,
				span: 1,
				range: 32
			},
			largeInterval: {
				unit: TimeUnit.week,
				span: 1,
				//first label e.g.: Jan 2015, Week 04; others e.g. Feb, Mar...
				pattern: oRb.getText("SWZS_DATE_PATTERN", ["LLL yyyy, '", "' ww  "])
			},
			smallInterval: {
				unit: TimeUnit.day,
				span: 1,
				pattern: "dd "
			}
		},
		"CWWeek": {
			text: oRb.getText("SWZS_WEEK_1"),
			innerInterval: {
				unit: TimeUnit.week,
				span: 1,
				range: 56
			},
			largeInterval: {
				unit: TimeUnit.month,
				span: 1,
				//first label: Jan 2015, others: Feb, Mar...
				pattern: "LLL yyyy "
			},
			smallInterval: {
				unit: TimeUnit.week,
				span: 1,
				//e.g. CW 01, CW 02...
				pattern: "'" + oRb.getText("SWZS_CW") + "' ww  "
			}
		},
		"WeekOfYear": {
			text: oRb.getText("SWZS_WEEK_2"),
			innerInterval: {
				unit: TimeUnit.week,
				span: 1,
				range: 32
			},
			largeInterval: {
				unit: TimeUnit.month,
				span: 1,
				//first label: Jan 2015, others: Feb, Mar...
				pattern: "LLL yyyy "
			},
			smallInterval: {
				unit: TimeUnit.week,
				span: 1,
				//e.g. 01, 02..., 53
				pattern: "ww "
			}
		},
		"Month": {
			text: oRb.getText("SWZS_MONTH"),
			innerInterval: {
				unit: TimeUnit.day,
				span: 30,
				range: 48
			},
			largeInterval: {
				unit: TimeUnit.month,
				span: 3,
				pattern: "yyyy QQQ "
			},
			smallInterval: {
				unit: TimeUnit.month,
				span: 1,
				pattern: "LLL "
			}
		},
		"Quarter": {
			text: oRb.getText("SWZS_QUARTER"),
			innerInterval: {
				unit: TimeUnit.day,
				span: 90,
				range: 48
			},
			largeInterval: {
				unit: TimeUnit.year,
				span: 1,
				//first label: 2015, Q1, others Q2, Q3, Q4, 2016 Q1, Q2...
				pattern: "yyyy "
			},
			smallInterval: {
				unit: TimeUnit.month,
				span: 3,
				pattern: "QQQ "
			}
		},
		"Year": {
			text: oRb.getText("SWZS_YEAR"),
			innerInterval: {
				unit: TimeUnit.day,
				span: 360,
				range: 48
			},
			largeInterval: {
				unit: TimeUnit.year,
				span: 5,
				pattern: "yyyy "
			},
			smallInterval: {
				unit: TimeUnit.year,
				span: 1,
				pattern: "yyyy "
			}
		}
	};

	var StepwiseTimeLineOptions = sap.gantt.axistime.StepwiseTimeLineOptions;

	/**
	 * Constructor for a new StepwiseZoomStrategy.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The class allows you to define a zoom strategy whose time line options are stepwise, i.e. the width of each time line option
	 * is pre-defined and won't be changed during zooming.
	 * @extends sap.gantt.axistime.AxisTimeStrategyBase
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.axistime.StepwiseZoomStrategy
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var StepwiseZoomStrategy = AxisTimeStrategyBase.extend("sap.gantt.axistime.StepwiseZoomStrategy", {
		metadata: {
			library : "sap.gantt"
		}
	});

	/**
	 * Initializes member variables which are needed later on.
	 *
	 * @private
	 */
	StepwiseZoomStrategy.prototype.init = function() {
		//private variables
		this._oTotalHorizonBeforeExtension = null;
		this._sZoomControlType = sap.gantt.config.ZoomControlType.Select;
		this._aTimeLineOptions = null;
		//set initial TotalHorizon
		this._calculatedTotalHorizon = null;
		this.bAxisTimeChanged = false;
		this.iLastZoomLevel = -1;
		//set default values for the properties from parent class
		var oTimeLineOption = StepwiseTimeLineOptions.DayDate;
		this.setProperty("timeLineOption", oTimeLineOption, true);
		this.setProperty("timeLineOptions", StepwiseTimeLineOptions, true);
		this.setProperty("mouseWheelZoomType", sap.gantt.MouseWheelZoomType.Stepwise, true);
		//set unused properties to null
		this.setProperty("finestTimeLineOption", null, true);
		this.setProperty("coarsestTimeLineOption", null, true);
		// this.setProperty("zoomLevels", 0, true);
		this._aZoomRate = new Array(11);
	};

	StepwiseZoomStrategy.prototype.applySettings = function () {
		AxisTimeStrategyBase.prototype.applySettings.apply(this, arguments);
		this._updateZoomRateArray();
		this._updateTimeLineOptions();
		this.setInitialProperties();

		return this;
	};

	StepwiseZoomStrategy.prototype.setInitialProperties = function () {
		this.setProperty("zoomLevels", this._getCountOfTimeLineOptions(), true);
		//Considering timeLineOption
		if (this._getIndexOfTimeLineOption(this.getTimeLineOption()) === -1){
			this.setTimeLineOption(this._aTimeLineOptions[this._getCountOfTimeLineOptions() / 2]);
		}
	};

	StepwiseZoomStrategy.prototype.createAxisTime = function (oLocale) {
		AxisTimeStrategyBase.prototype.createAxisTime.apply(this, arguments);
		this.setZoomLevel(this._getIndexOfTimeLineOption(this.getTimeLineOption(), this.getTimeLineOptions()));
		this._Locale = oLocale;
		return this;
	};

	/**
	 * Sets the visible horizon of StepwiseZoomStrategy.
	 * Don't use this method to set visible horizon because its value is determined by zoomLevel or timeLineoption.
	 *
	 * @param {object} oVisibleHorizon visible horizon of StepwiseZoomStrategy
	 * @public
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setVisibleHorizon = function (oVisibleHorizon) {
		this.setVisibleHorizonWithReason(oVisibleHorizon, "visibleHorizonUpdated");
		return this;
	};

	StepwiseZoomStrategy.prototype.setVisibleHorizonWithReason = function (oVisibleHorizon, sReasonCode, oOriginEvent) {
		//redraw will call syncContent(), in there rate will be updated
		var oLastVisibleHorizon = this.getVisibleHorizon();
		if (oLastVisibleHorizon) {
			oLastVisibleHorizon = oLastVisibleHorizon.clone();
		}
		AxisTimeStrategyBase.prototype._setVisibleHorizon.apply(this, arguments);
		this.fireRedrawRequest(false, sReasonCode, oLastVisibleHorizon, oOriginEvent);
		return this;
	};
	/**
	 * Sets the total horizon of StepwiseZoomStrategy. The time range and view range of this.getAxisTime() will also be updated, the rate will remain unchanged.
	 *
	 * @param {object} oTotalHorizon total horizon of StepwiseZoomStrategy
	 * @public
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setTotalHorizon = function (oTotalHorizon) {
		//redraw will call syncContent(), in there rate will be updated
		AxisTimeStrategyBase.prototype.setTotalHorizon.apply(this, arguments);
		this._setCalculatedTotalHorizon(oTotalHorizon);
		if (this.getAxisTime()) {
			this.fireRedrawRequest(true, "totalHorizonUpdated");
		}
		return this;
	};

	StepwiseZoomStrategy.prototype._setCalculatedTotalHorizon = function (oHorizon) {

		if (oHorizon) {
			if (this._calculatedTotalHorizon) {
				this._calculatedTotalHorizon.setStartTime(oHorizon.getStartTime(), true);
				this._calculatedTotalHorizon.setEndTime(oHorizon.getEndTime(), true);
			} else {
					this._calculatedTotalHorizon = new sap.gantt.config.TimeHorizon({
							startTime: oHorizon.getStartTime(),
							endTime: oHorizon.getEndTime()
					});
			}

			this._updateTimeRangeAndViewRange(oHorizon);
		}

		return this;
	};

	StepwiseZoomStrategy.prototype._updateTimeRangeAndViewRange = function (oHorizon) {
		var oAxisTime = this.getAxisTime();
		if (oAxisTime && oHorizon) {
			//update time range
			oAxisTime.setTimeRange([Format.getTimeStampFormatter().parse(oHorizon.getStartTime()),
									Format.getTimeStampFormatter().parse(oHorizon.getEndTime())]);
			var oHorizonStartTime = Format.getTimeStampFormatter().parse(oHorizon.getStartTime());
			var oHorizonEndTime = Format.getTimeStampFormatter().parse(oHorizon.getEndTime());
			var nHorizonTimeRange = oHorizonEndTime.valueOf() - oHorizonStartTime.valueOf();
			var oTimeLineOption = this.getTimeLineOption();
			var nUnitTimeRange = ObjectPath.get(oTimeLineOption.innerInterval.unit)
									.offset(oHorizonStartTime, oTimeLineOption.innerInterval.span).valueOf() - oHorizonStartTime.valueOf();
			//update view range
			oAxisTime.setViewRange([0, Math.ceil((nHorizonTimeRange * oTimeLineOption.innerInterval.range / nUnitTimeRange) / this._aZoomRate[this.getZoomLevel()])]);
		}
		return this;
	};

	StepwiseZoomStrategy.prototype._getCalculatedTotalHorizon = function() {
		if (!this._calculatedTotalHorizon || !this._calculatedTotalHorizon.getStartTime() || !this._calculatedTotalHorizon.getEndTime()) {
			this._setCalculatedTotalHorizon(this.getAggregation("totalHorizon"));
		}
		return this._calculatedTotalHorizon;
	};

	/**
	 * Return total horizon time. The value will be changed according to zoom level, and is not same as the value user set.
	 *
	 * @public
	 * @returns {sap.gantt.config.TimeHorizon}
	 */
	StepwiseZoomStrategy.prototype.getTotalHorizon = function() {
		return this._getCalculatedTotalHorizon();
	};

	/**
	 * Don't use this method to set zoomLevels because its value is determined by timeLineOptions.
	 * The account of entities in timeLineOptions is zoomLevels.
	 *
	 * @param {int} iZoomLevels zoom levels of StepwiseZoomStrategy
	 * @public
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setZoomLevels = function (iZoomLevels) {
		return this;
	};

	/**
	 * Sets the zoom level of StepwiseZoomStrategy.
	 * This method also does below things:
	 * 1. Reverts the total horizon to the one before auto extension.
	 * 2. Extends total horizon if it cannot fulfill the whole visible area according to the current zoom level.
	 * 3. Updates visible horizon and still keeps the same middle date.
	 *
	 * @param {int} iZoomLevel zoom level of StepwiseZoomStrategy
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setZoomLevel = function (iZoomLevel) {
		if (iZoomLevel >= 0) {
			this.iLastZoomLevel = this.getZoomLevel();
			this.setProperty("zoomLevel", iZoomLevel, true);
			this.setProperty("timeLineOption", this._getTimeLineOptionByIndex(iZoomLevel), true);

			if (this._aZoomRate[iZoomLevel] && this.getGanttVisibleWidth()) {
				var oNewVisibleHorizon = this._updateVisibleHorizon(this.getGanttVisibleWidth());
				this.setVisibleHorizon(oNewVisibleHorizon);
			}
		}
		return this;
	};

	StepwiseZoomStrategy.prototype.setTimeLineOption = function (oTimeLineOption) {
		this.setProperty("timeLineOption", oTimeLineOption, true);
		this.setZoomLevel(this._getIndexOfTimeLineOption(oTimeLineOption));
	};

	/**
	 * Don't use this method to set coarsestTimeLineOption because its value is determined by timeLineOptions.
	 * The last entry of timeLineOptions is coarsestTimeLineOption.
	 *
	 * @param {object} oTimeLineOption coarsest time line option of StepwiseZoomStrategy
	 * @public
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setCoarsestTimeLineOption = function (oTimeLineOption) {
		return this;
	};

	/**
	 * Don't use this method to set finestTimeLineOption because its value is determined by timeLineOptions.
	 * The first entry of timeLineOptions is finestTimeLineOption.
	 *
	 * @param {object} oTimeLineOption finest time line option of StepwiseZoomStrategy
	 * @public
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setFinestTimeLineOption = function (oTimeLineOption) {
		return this;
	};

	/**
	 * Sets the time line options of StepwiseZoomStrategy.
	 *
	 * @param {object} oTimeLineOptions time line options of StepwiseZoomStrategy
	 * @public
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.setTimeLineOptions = function (oTimeLineOptions) {
		AxisTimeStrategyBase.prototype.setTimeLineOptions.apply(this, arguments);
		this._updateZoomRateArray();
		this._updateTimeLineOptions();
		return this;
	};

	StepwiseZoomStrategy.prototype._updateVisibleHorizon = function (nClientWidth) {

		if (!nClientWidth){
			var iWidthOfTotalHorizon = this._getWidthOfTotalHorizon();
			this._extendTotalHorizon(iWidthOfTotalHorizon);
		} else {
			this._extendTotalHorizon(nClientWidth);
		}

		var oAxisTime = this.getAxisTime();
		if (oAxisTime) {
			oAxisTime.setZoomRate(this._aZoomRate[this.getZoomLevel()]);

			//Calculate the new visible horizon and still keep the same middle date.
			var oVisibleHorizon = this.getVisibleHorizon();
			var dMiddleOfVisibleHorizon = this.calMiddleDate(Format.getTimeStampFormatter().parse(oVisibleHorizon.getStartTime()),
					Format.getTimeStampFormatter().parse(oVisibleHorizon.getEndTime()));
			var oNewVisibleHorizon = this.calVisibleHorizonByRate(this._aZoomRate[this.getZoomLevel()], dMiddleOfVisibleHorizon);
			AxisTimeStrategyBase.prototype._setVisibleHorizon.call(this, oNewVisibleHorizon);

			return oNewVisibleHorizon;
		}
	};
	/**
	 * Sets the nWidth of StepwiseZoomStrategy.
	 *
	 * This function is overwritten due to the StepwiseZoomStrategy sync logic.
	 * This is because sync will determine whether to change the time axis depending on whether the ganttVisibleWidth is changed.
	 * If the visible width is updated in this function which called by GanttChartWithTable,
	 * StepwiseZoomStrategy will never change the time axis.
	 *
	 * @param {int} nWidth of StepwiseZoomStrategy
	 * @private
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.updateGanttVisibleWidth = function (nWidth) {
		return this;
	};

	StepwiseZoomStrategy.prototype.isTimePeriodZoomEnabled = function () {
		return false;
	};

	StepwiseZoomStrategy.prototype.syncContext = function (nClientWidth) {
		var oRetVal = {
			zoomLevel : undefined,
			axisTimeChanged : false
		};
		if (nClientWidth !== this.getGanttVisibleWidth()) {
			this._updateVisibleHorizon(nClientWidth);
			oRetVal.axisTimeChanged = true;
			AxisTimeStrategyBase.prototype.updateGanttVisibleWidth.apply(this, arguments);

		} else if (this.iLastZoomLevel === this.getZoomLevel()) {
			oRetVal.axisTimeChanged  = false;

		} else {
			oRetVal.axisTimeChanged  = true;
			this.iLastZoomLevel = this.getZoomLevel();
		}

		oRetVal.zoomLevel = this.getZoomLevel();
		return oRetVal;
	};

	/**
	 * @private
	 */
	StepwiseZoomStrategy.prototype._updateZoomRateArray = function () {
		if (this._oZoom) {
			var oTimeLineOptions = this.getTimeLineOptions();
			this._aZoomRate = [];

			if (oTimeLineOptions) {
				var i;
				if (this._sZoomControlType !== sap.gantt.config.ZoomControlType.Select){
					i = this._getCountOfTimeLineOptions();
					for (var j in oTimeLineOptions) {
						i--;
						this._aZoomRate[i] = this._oZoom.base.scale / this.calZoomScale(
								oTimeLineOptions[j].innerInterval.unit,
								oTimeLineOptions[j].innerInterval.span,
								oTimeLineOptions[j].innerInterval.range
						);
					}
				} else {
					i = 0;
					for (var n in oTimeLineOptions) {
						this._aZoomRate[i] = this._oZoom.base.scale / this.calZoomScale(
								oTimeLineOptions[n].innerInterval.unit,
								oTimeLineOptions[n].innerInterval.span,
								oTimeLineOptions[n].innerInterval.range
						);
						i++;
					}
				}
			} else {
				this._aZoomRate[0] = 1;
			}

		}
	};

	StepwiseZoomStrategy.prototype._updateTimeLineOptions = function () {
		var oTimeLineOptions = this.getTimeLineOptions();
		this._aTimeLineOptions = [];

		if (oTimeLineOptions) {
			for (var i in oTimeLineOptions) {
				this._aTimeLineOptions.push(oTimeLineOptions[i]);
			}
			if (this._sZoomControlType !== sap.gantt.config.ZoomControlType.Select){
				this._aTimeLineOptions = this._aTimeLineOptions.reverse();
			}
		}
	};

	/**
	 * This method does below things:
	 * 1. Sets time line option according to the stop info object.
	 * 2. Sets zoom level according to the stop info object. The setter of zoom level does some additional things.
	 *
	 * @param {object} oStopInfo Zoom stop information, which contains the parameters <code>key</code> and <code>text</code>.
	 * @protected
	 * @returns {sap.gantt.axistime.StepwiseZoomStrategy} for chaining
	 */
	StepwiseZoomStrategy.prototype.updateStopInfo = function (oStopInfo) {
		this.setZoomLevel(oStopInfo.index);
		return this;
	};

	/**
	 * Returns index of the given time line option from given time line options or this.timeLineOptions.
	 *
	 * @param {object} oTimeLineOption time line option object
	 * @param {object} oTimeLineOptions time line options
	 * @private
	 * @returns {int} index of the given time line option from given time line options or this.timeLineOptions
	 */
	StepwiseZoomStrategy.prototype._getIndexOfTimeLineOption = function (oTimeLineOption, oTimeLineOptions) {
		var oOptions = oTimeLineOptions;
		if (!oOptions) {
			oOptions = this.getTimeLineOptions();
		}
		if (!this._aTimeLineOptions) {
			this._updateTimeLineOptions();
		}
		for (var i = 0, len = this._aTimeLineOptions.length; i < len; i++){
			if (this._aTimeLineOptions[i] == oTimeLineOption){
				return i;
			}
		}
		return -1;
	};

	/**
	 * Returns time line option by the given index.
	 *
	 * @param {int} iIndex index of time line option
	 * @private
	 * @returns {object} the time line option from this.timeLineOptions
	 */
	StepwiseZoomStrategy.prototype._getTimeLineOptionByIndex = function (iIndex) {
		if (!this._aTimeLineOptions) {
			this._updateTimeLineOptions();
		}
		if (iIndex < this._aTimeLineOptions.length){
			return this._aTimeLineOptions[iIndex];
		} else {
			return null;
		}
	};

	/**
	 * @private
	 * @returns {int} width of the total horizon
	 */
	StepwiseZoomStrategy.prototype._getWidthOfTotalHorizon = function(){
		var oCalculatedTotalHorizon = this._getCalculatedTotalHorizon();
		var startTime = Format.getTimeStampFormatter().parse(oCalculatedTotalHorizon.getStartTime());
		var endTime = Format.getTimeStampFormatter().parse(oCalculatedTotalHorizon.getEndTime());
		var oAxisTime = this.getAxisTime();
		var start = oAxisTime.timeToView(startTime);
		var end = oAxisTime.timeToView(endTime);
		return Math.abs(end - start);
	};

	/**
	 * @param {int} nClientWidth the width of the visible area
	 * @private
	 */
	StepwiseZoomStrategy.prototype._extendTotalHorizon = function(nClientWidth){
		var oCalculatedTotalHorizon = this._getCalculatedTotalHorizon();
		var nTimeSpanDelta = 0;
		if (this._oZoom && this._oZoom.base && this._oZoom.base.scale !== undefined ){
			var oCalculatedTotalHorizonStartTime = Format.abapTimestampToDate(oCalculatedTotalHorizon.getStartTime());
			var oCalculatedTotalHorizonEndTime = Format.abapTimestampToDate(oCalculatedTotalHorizon.getEndTime());
			var nCurrentTimeSpan = oCalculatedTotalHorizonEndTime.getTime() - oCalculatedTotalHorizonStartTime.getTime();
			//Calculate new time span according to specified zoom rate
			var nZoomRate = this._aZoomRate[this.getZoomLevel()];
			var nScale = this._oZoom.base.scale / nZoomRate;
			var nNewTimeSpan = nClientWidth * nScale;
			nTimeSpanDelta = nNewTimeSpan - nCurrentTimeSpan;
			oCalculatedTotalHorizon = this._calTotalHorizon(nTimeSpanDelta, nNewTimeSpan);
			this._setCalculatedTotalHorizon(oCalculatedTotalHorizon);
		}

	};

	StepwiseZoomStrategy.prototype._calTotalHorizon = function(nTimeSpanDelta, nNewTimeSpan) {
		var oCalculatedTotalHorizon = this._getCalculatedTotalHorizon();
		if (nTimeSpanDelta !== 0) {
			var nInitialTotalHorizonStartTimeInMs = Format.abapTimestampToDate(this.getAggregation("totalHorizon").getStartTime()).getTime();
			var nInitialTotalHorizonEndTimeInMs = Format.abapTimestampToDate(this.getAggregation("totalHorizon").getEndTime()).getTime();
			var nMidInitialTotalHorizon = (nInitialTotalHorizonStartTimeInMs + nInitialTotalHorizonEndTimeInMs) / 2;
			var nNewTotalHorizonStartTimeInMs,
				nNewTotalHorizonEndTimeInMs;
			if ( nTimeSpanDelta > 0 ){
				//when delta is positive, that means the total horizon is narrower than the new time span
				//drag to make the chart wider, current horizon is not enough to fulfill the client
				nNewTotalHorizonStartTimeInMs = nMidInitialTotalHorizon - nNewTimeSpan / 2;
				nNewTotalHorizonEndTimeInMs = nMidInitialTotalHorizon + nNewTimeSpan / 2;
			} else {
				//if zoom in or drag to make chart narrower, the new horizon is smaller than the last horizon but bigger than the initial horizon
				//otherwise, scroll bar already exists, set initial horizon
				nNewTotalHorizonStartTimeInMs = Format.abapTimestampToDate(oCalculatedTotalHorizon.getStartTime()).getTime() - nTimeSpanDelta / 2;
				nNewTotalHorizonEndTimeInMs = Format.abapTimestampToDate(oCalculatedTotalHorizon.getEndTime()).getTime() + nTimeSpanDelta / 2;
				if (nNewTotalHorizonStartTimeInMs > nInitialTotalHorizonStartTimeInMs){
					nNewTotalHorizonStartTimeInMs = nInitialTotalHorizonStartTimeInMs;
				}
				if (nNewTotalHorizonEndTimeInMs < nInitialTotalHorizonEndTimeInMs){
					nNewTotalHorizonEndTimeInMs = nInitialTotalHorizonEndTimeInMs;
				}
			}
			var oNewStartTime = new Date();
			oNewStartTime.setTime(nNewTotalHorizonStartTimeInMs);
			var oNewEndTime = new Date();
			oNewEndTime.setTime(nNewTotalHorizonEndTimeInMs);
			return new sap.gantt.config.TimeHorizon({
				startTime: oNewStartTime,
				endTime: oNewEndTime
			});
		}
		return oCalculatedTotalHorizon;
	};

	StepwiseZoomStrategy.prototype._updateZoomControlType = function (sZoomControlType) {
		if (sZoomControlType) {
			AxisTimeStrategyBase.prototype._updateZoomControlType.apply(this, arguments);
			this._sZoomControlType = sZoomControlType;
			this._updateZoomRateArray();
			this._updateTimeLineOptions();

			this.setZoomLevel(this._getIndexOfTimeLineOption(this.getTimeLineOption(), this.getTimeLineOptions()));

		}
	};

	StepwiseZoomStrategy.prototype._getCountOfTimeLineOptions = function () {
		return Object.keys(this.getTimeLineOptions()).length;
	};

	return StepwiseZoomStrategy;
}, true);
