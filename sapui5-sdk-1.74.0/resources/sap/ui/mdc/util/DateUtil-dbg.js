/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
		'sap/ui/core/library',
		'sap/ui/core/date/UniversalDate',
		'sap/base/util/merge'
	],
	function(
			coreLibrary,
			UniversalDate,
			merge
	) {
		"use strict";

		var CalendarType = coreLibrary.CalendarType;

		/**
		 * Utility function for Date conversion
		 *
		 * @author SAP SE
		 * @private
		 * @since 1.74.0
		 * @alias sap.ui.mdc.util.DateUtil
		 */
		var DateUtil = function() {};

		/**
		 * Converts a data type specific date to a UniversalDate.
		 *
		 * @param {any} vDate Date
		 * @param {sap.ui.model.SimpleType} oType Data type
		 * @return {sap.ui.core.date.UniversalDate} UniversalDate
		 * @public
		 * @since 1.74.0
		 */
		DateUtil.typeToUniversalDate = function(vDate, oType) {

			var sDate = this.typeToString(vDate, oType, "yyyyMMdd");
			var iYear = parseInt(sDate.slice(0,4));
			var iMonth = parseInt(sDate.slice(4,6)) - 1;
			var iDate = parseInt(sDate.slice(6,8));
			var oUniversalDate = new UniversalDate(UniversalDate.UTC(iYear, iMonth, iDate));

			return oUniversalDate;

		};

		/**
		 * Converts a UniversalDate to data type specific date.
		 *
		 * @param {sap.ui.core.date.UniversalDate} oDate UniversalDate
		 * @param {sap.ui.model.SimpleType} oType Data type
		 * @return {any} type specific date
		 * @public
		 * @since 1.74.0
		 */
		DateUtil.universalDateToType = function(oDate, oType) {

			var iYear = oDate.getUTCFullYear();
			var iMonth = oDate.getUTCMonth() + 1;
			var iDate = oDate.getUTCDate();
			var sDate = iYear.toString() + ((iMonth < 10) ? "0" : "") + iMonth.toString() + iDate.toString();
			var vDate = this.stringToType(sDate, oType, "yyyyMMdd");

			return vDate;

		};

		/**
		 * "Clones" a given data type to use a given pattern.
		 *
		 * @param {sap.ui.model.SimpleType} oType Data type
		 * @param {string} sPattern Pattern based on Unicode LDML Date Format notation. {@link http://unicode.org/reports/tr35/#Date_Field_Symbol_Table}
		 * @return {sap.ui.model.SimpleType} nes data type
		 * @public
		 * @since 1.74.0
		 */
		DateUtil.createInternalType = function(oType, sPattern) {

			var Type = sap.ui.require(oType.getMetadata().getName().replace(/\./g, "/")); // type is already loaded because instance is provided
			var oConstraints = merge({}, oType.oConstraints);
			var oFormatOptions = merge({}, oType.oFormatOptions);

			if (oFormatOptions.style) {
				delete oFormatOptions.style;
			}
			oFormatOptions.pattern = sPattern;
			oFormatOptions.calendarType = CalendarType.Gregorian;

			if (oConstraints && oConstraints.isDateOnly) {
				// TODO, better solution for sap.ui.model.odata.type.Date
				delete oConstraints.isDateOnly;
				oConstraints.displayFormat = "Date";
			}
			if (oType.bV4) {
				// TODO: better solution for sap.ui.model.odata.type.DateTimeOffset V4 mode
				if (!oConstraints) {
					oConstraints = {};
				}
				oConstraints.V4 = true;
			}

			return new Type(oFormatOptions, oConstraints);

		};

		/**
		 * Converts a data type specific date to a string using a given pattern.
		 *
		 * @param {any} vDate Date
		 * @param {sap.ui.model.SimpleType} oType Data type
		 * @param {string} sPattern Pattern based on Unicode LDML Date Format notation. {@link http://unicode.org/reports/tr35/#Date_Field_Symbol_Table}
		 * @return {string} Date as String
		 * @public
		 * @since 1.74.0
		 */
		DateUtil.typeToString = function(vDate, oType, sPattern) {

			var oInternalType = this.createInternalType(oType, sPattern);
			var sDate = oInternalType.formatValue(vDate, "string");
			return sDate;

		};

		/**
		 * Converts a string based date to a Type using a given pattern.
		 *
		 * @param {string} sDate Date
		 * @param {sap.ui.model.SimpleType} oType Data type
		 * @param {string} sPattern Pattern based on Unicode LDML Date Format notation. {@link http://unicode.org/reports/tr35/#Date_Field_Symbol_Table}
		 * @return {any} Date for type
		 * @public
		 * @since 1.74.0
		 */
		DateUtil.stringToType = function(sDate, oType, sPattern) {

			var oInternalType = this.createInternalType(oType, sPattern);
			var vDate = oInternalType.parseValue(sDate, "string");
			return vDate;

		};

		return DateUtil;
	}, /* bExport= */ true);
