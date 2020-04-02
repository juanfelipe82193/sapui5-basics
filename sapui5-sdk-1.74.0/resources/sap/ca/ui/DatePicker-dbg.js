/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.DatePicker.
jQuery.sap.declare("sap.ca.ui.DatePicker");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.m.InputBase");


/**
 * Constructor for a new DatePicker.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Allows end users to interact with dates.
 * Entries can directly be written in, or selected from a calendar pad.
 * @extends sap.m.InputBase
 *
 * @constructor
 * @public
 * @deprecated Since version 1.22. 
 * This control has been made available in sap.m.
 * Please use the sap.m.DatePicker instead!
 * This control will not be supported anymore.
 * @name sap.ca.ui.DatePicker
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.m.InputBase.extend("sap.ca.ui.DatePicker", /** @lends sap.ca.ui.DatePicker.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * This property is used to offset the first day of the week (0 = sunday). Returns int, default
		 * 0
		 */
		firstDayOffset : {type : "int", group : "Data", defaultValue : 0},

		/**
		 * This is a date string formatted as per the format for the control. If there is no valid input
		 * for the control, this value will be null.
		 */
		dateValue : {type : "string", group : "Misc", defaultValue : null}
	}
}});


/**
 * returns selected date as a Date object
 *
 * @name sap.ca.ui.DatePicker#getDate
 * @function
 * @type object
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


jQuery.sap.require("sap.me.Calendar");
jQuery.sap.require("sap.ca.ui.utils.resourcebundle");
jQuery.sap.require("sap.ca.ui.model.type.Date");

sap.ca.ui.DatePicker.prototype.init = function() {
	if (sap.m.InputBase.prototype.init) {
		sap.m.InputBase.prototype.init.apply(this, arguments);
	}

	this.dateObj = null;

	// initialize the calendar
	this._oCalendar = new sap.me.Calendar({
		firstDayOffset : this.getFirstDayOffset(),
		tapOnDate : jQuery.proxy(function(oEvent) {
			if (!this._dateType) {
				this._setUpDateType();
			}

			var dateTapped = oEvent.getParameters().date;
			this.dateObj = new Date(dateTapped);
			var tempString = this._dateType.formatValue(dateTapped, "string");
			this.setDateValue(tempString);

			//this.setValue(tempString);
			this.setProperty("value", tempString);
			this._lastValue = tempString;
			this.fireChange(false);
			this._closeCalendar();
		}, this)
	});

	this._oCalendar.setEnableMultiselection(false);
	this._oCalendar.setDayHeight(45);

	//Cancel button 
	this._datePickerCancelBtn = new sap.m.Button({
		text : sap.ca.ui.utils.resourcebundle.getText("dialog.cancel"),
		width : "100%",
		press : jQuery.proxy(function() {
			this._closeCalendar();
		}, this)
	});

	if (jQuery.device.is.phone ) {
		//	   initialize the Dialog for phone & Tablet
		this._oDatePickerDialogMobile = new sap.m.Dialog({
			title : sap.ca.ui.utils.resourcebundle.getText("datepicker.title"),
			leftButton : this._datePickerCancelBtn,
			stretchOnPhone : true,
			content : [ this._oCalendar ]
		});
	} else {
		//		initialize the Popover for desktop	
		this._oDatePickerPopoverDesktop = new sap.m.ResponsivePopover({
			title : sap.ca.ui.utils.resourcebundle.getText("datepicker.title"),
			placement : sap.m.PlacementType.Auto,
			enableScrolling : false,
			contentWidth: "20rem",
			contentHeight: "390px",
			content : [ this._oCalendar ]
		});

	}
	this.addStyleClass("sapCaUiDatePicker");
};


sap.ca.ui.DatePicker.prototype._setUpDateType = function () {
	var needsDateType = true;

	var oBindingInfo = this.getBindingInfo("value");
	if (oBindingInfo) {
		var oBindingType = oBindingInfo.type;

		if (oBindingType && (oBindingType instanceof sap.ca.ui.model.type.Date)) {
			this._dateType = oBindingType;
			needsDateType = false;
		}
	}

	if (needsDateType) {
		this._dateType = new sap.ca.ui.model.type.Date();
	}
};

sap.ca.ui.DatePicker.prototype.setValue = function(sNewValue) {
	if (sNewValue != this.getValue()) {
		this.dateObj = null;
	}
	// CSS 0120031469 0000220400 2014
	sap.m.InputBase.prototype.setValue.call(this, sNewValue);
};

sap.ca.ui.DatePicker.prototype.setFirstDayOffset = function(iFirstDayOffset){
	this._oCalendar.setProperty("firstDayOffset", iFirstDayOffset, true);
	this.setProperty("firstDayOffset", iFirstDayOffset);
};

sap.ca.ui.DatePicker.prototype.fireChange = function(bUpdateDateObj) {
	if (!this._dateType) {
		this._setUpDateType();
	}

	var currentInput = this.getValue();

	var tempDate = this._validateDate(currentInput);

	if (bUpdateDateObj || bUpdateDateObj === undefined) {
		this.dateObj = tempDate;
	}

	this.setDateValue(tempDate);

	var dateYYYYMMDD = null;

	if (tempDate) {
		dateYYYYMMDD = this._toDateStringYYYYMMDD(tempDate);
	}

	this.fireEvent("change", {newValue:currentInput,
							  newYyyymmdd:dateYYYYMMDD,
							  invalidValue: tempDate ? false : true});
	return this;
};

sap.ca.ui.DatePicker.prototype.exit = function() {
	if (sap.m.InputBase.prototype.exit) {
		sap.m.InputBase.prototype.exit.apply(this);
	}
	if (this._oDatePickerPopoverDesktop) {
		this._oDatePickerPopoverDesktop.destroy();
	}
	if (this._oDatePickerDialogMobile) {
		this._oDatePickerDialogMobile.destroy();
	}
	if (this._datePickerCancelBtn){
		this._datePickerCancelBtn.destroy();
	}
	if (this._oCalendarIcon){
		this._oCalendarIcon.destroy();
	}
   };

sap.ca.ui.DatePicker.prototype._closeCalendar = function() {
	if (jQuery.device.is.phone ) {
		this._oDatePickerDialogMobile.close();
	} else {
		this._oDatePickerPopoverDesktop.close();
	}
};

sap.ca.ui.DatePicker.prototype._getCalendarIcon = function() {
	if (!this._oCalendarIcon) {
		var u = sap.ui.core.IconPool.getIconURI("appointment-2");
		this._oCalendarIcon = sap.ui.core.IconPool.createControlByURI({
			id : this.getId() + "__ci",
			src : u,
			press : jQuery.proxy(this._calendarIconPress, this)
		});
		this._oCalendarIcon.addStyleClass("sapMInputValHelpInner").addStyleClass("sapCaUiGreyIcon");
	}
	if (this.getEnabled() && this.getEditable()) {
		return this._oCalendarIcon;
	}

	return null;
};

sap.ca.ui.DatePicker.prototype._calendarIconPress = function() {
	if (this.getEditable()) {
		if (!this._dateType) {
			this._setUpDateType();
		}

		var currentInput = this.getValue();
		var tempDate = this._validateDate(currentInput);
		this.setProperty("dateValue", tempDate, true);

		if (tempDate) { // fix CSS 0004983964 2013 by removing && !this.dateObj)
			this.dateObj = tempDate;
		}

		if (tempDate) {
			this._oCalendar.toggleDatesSelection(this._oCalendar.getSelectedDates(),false);
			this._oCalendar.setCurrentDate(this.dateObj);
			this._oCalendar.toggleDatesSelection([this.dateObj],true);
		} else {
			this._oCalendar.toggleDatesSelection(this._oCalendar.getSelectedDates(),false);
		}

		if (jQuery.device.is.phone) {
			this._oDatePickerDialogMobile.open();
		} else {
			this._oDatePickerPopoverDesktop.openBy(this._oCalendarIcon);
		}
	}
};


// Date Validation Routines

sap.ca.ui.DatePicker.prototype._validateDate = function(inputString) {
	if (!inputString) {
		return inputString;
	}

	var tempString = null;

	try {
		tempString = this._dateType.parseValue(inputString, "string");
	} catch (err) {
	}

	return tempString;
};

sap.ca.ui.DatePicker.prototype._toDateStringYYYYMMDD = function(dateString) {
	var tempDate = new Date(dateString);
	var yearComponent = "" + tempDate.getFullYear();
	var monthComponent = "" + (tempDate.getMonth() + 1);
	var dayComponent = "" + tempDate.getDate();

	while (yearComponent.length < 4) {
		yearComponent = "0" + yearComponent;
	}

	while (monthComponent.length < 2) {
		monthComponent = "0" + monthComponent;
	}

	while (dayComponent.length < 2) {
		dayComponent = "0" + dayComponent;
	}

	return yearComponent + monthComponent + dayComponent;
};

sap.ca.ui.DatePicker.prototype.getDate = function() {
	return this.dateObj;
};
