sap.ui.define([
		'sap/ui/core/mvc/Controller',
		'sap/ui/unified/Calendar',
		'sap/m/ResponsivePopover',
		'sap/ui/unified/DateRange',
		'sap/m/library',
		'sap/ui/core/format/DateFormat',
		'sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil'
	], function(Controller, Calendar, ResponsivePopover, DateRange, SapMLibrary, DateFormat, FilterUtil) {
	"use strict";

	var DatePickerController = Controller.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.DatePickerController", {});
	/**
	 * CreateMatchingConceptDatePicker creates a datepicker with pre filled from compact filter value entity set it's selections.
	 *
	 * @param {oControl, oChart}
	 * oControl - current element control
	 * oChart - chart
	 * @returns {void}
	 *
	 * @private
	 */
	sap.suite.ui.generic.template.AnalyticalListPage.controller.DatePickerController._createDatePicker = function (oControl, oChart) {
		if (!this._oPopoverDialog) {
			this._oCalendar = new Calendar({
				width: "100%",
				select: this._handleCalendarSelect.bind(this)
			});
			this._oPopoverDialog = new ResponsivePopover('',{
				placement: SapMLibrary.PlacementType.Bottom,
				showHeader: false,
				content: [this._oCalendar]
			});
		}
		this._oChart = oChart;
		//to sync compact filter date to visualfilter
		if (oChart.getDimensionFilter()) {
			this._setSelectedDate(oChart.getDimensionFilter());
		} else if (this._oOldDate) { //to sync empty date filter to visualfilter
			this._focusCurrentDate(this._oCalendar);
		}
		this._oPopoverDialog.openBy(oControl);
	};
	/**
	 * To get the selected date from calendar
	 *
	 * @param {void}
	 * @returns {Date object}
	 *
	 * @private
	 */
	sap.suite.ui.generic.template.AnalyticalListPage.controller.DatePickerController._getSelectedDate = function() {
		var aSelectedDates = this._oCalendar.getSelectedDates();
		var oDate;
		if (aSelectedDates.length > 0) {
			oDate = aSelectedDates[0].getStartDate();
		}
		return oDate;
	};
	/**
	 * To set the passed date to calendar
	 *
	 * @param {Date object}
	 * @returns {void}
	 *
	 * @private
	 */
	sap.suite.ui.generic.template.AnalyticalListPage.controller.DatePickerController._setSelectedDate = function(oDate) {
		if (!(oDate instanceof Date)) {
			var bIsStringDate = this._oChart._isStringDateType();
			if (bIsStringDate) {
				var oFormatter = DateFormat.getDateInstance({
					pattern: "yyyyMMdd"
				});
				oDate = oFormatter.parse(oDate);
			} else {
				oDate = new Date(oDate);
			}
		}
		var oDateVal = new DateRange({startDate: oDate});
		this._oCalendar.removeAllSelectedDates();
		this._oCalendar.addSelectedDate(oDateVal);
		this._oCalendar.focusDate(oDate);
		this._oOldDate = oDate;
	};
	/**
	 * To handle calendar selection and deselection(clear)
	 *
	 * @param {oEvent object}
	 * @returns {void}
	 *
	 * @private
	 */
	sap.suite.ui.generic.template.AnalyticalListPage.controller.DatePickerController._handleCalendarSelect = function (oEvent) {
		//if previous selected date and current selected date are same,clear the selection
		if (FilterUtil.getDateInMedium(this._oOldDate) === FilterUtil.getDateInMedium(oEvent.getSource().getSelectedDates()[0].getStartDate())) {
			this._focusCurrentDate(oEvent.getSource());
			this._oChart.setDimensionFilter(null);
		} else {
			var bIsStringDate = this._oChart._isStringDateType();
			this._oOldDate = this._getSelectedDate();
			if (bIsStringDate) {
				var oFormatter = DateFormat.getDateInstance({
					pattern: "yyyyMMdd"
				});
				var sDate = oFormatter.format(this._oOldDate);
				this._oChart.setDimensionFilter(sDate);
			} else {
				this._oChart.setDimensionFilter(this._oOldDate);
			}
		}
		this._oChart.fireFilterChange();
		this._oPopoverDialog.close();
	};
	/**
	 * To navigate to current date
	 *
	 * @param {oCalendar object}
	 * @returns {void}
	 *
	 * @private
	 */
	sap.suite.ui.generic.template.AnalyticalListPage.controller.DatePickerController._focusCurrentDate = function (oCalendar) {
		oCalendar.removeAllSelectedDates();
		this._oOldDate = undefined;
		this._oCalendar.focusDate(new Date());
	};

	return DatePickerController;

});
