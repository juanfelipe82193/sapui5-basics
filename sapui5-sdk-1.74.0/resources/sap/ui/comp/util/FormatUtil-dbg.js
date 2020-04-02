/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// --------------------------------------------------------------------------------
// Utility class used by smart controls for formatting related operations
// --------------------------------------------------------------------------------
sap.ui.define([
	"sap/ui/core/format/NumberFormat", "sap/ui/core/format/DateFormat", "sap/m/P13nConditionPanel", "sap/ui/comp/odata/ODataType"
], function(NumberFormat, DateFormat, P13nConditionPanel, ODataType) {
	"use strict";

	/**
	 * Utility class used by smart controls for formatting related operations
	 *
	 * @private
	 * @experimental This module is only for internal/experimental use!
	 */
	var FormatUtil = {
		/**
		 * Static function that returns a formatted expression based on the displayBehaviour. Fallback is to return the Id (sId)
		 *
		 * @param {string} sDisplayBehaviour - the display behaviour (e.g. as defined in: sap.ui.comp.smartfilterbar.DisplayBehaviour)
		 * @param {string} sId - the Id field value
		 * @param {string} sDescription - the Description field value
		 * @returns {string} the formatted string value based on the displayBehaviour
		 * @private
		 */
		getFormattedExpressionFromDisplayBehaviour: function(sDisplayBehaviour, sId, sDescription) {
			return FormatUtil.getFormatterFunctionFromDisplayBehaviour(sDisplayBehaviour)(sId, sDescription);
		},
		/**
		 * Static function that returns a formatter function based on the displayBehaviour. The returned function always expects sId and sDescription
		 * as parameters.
		 *
		 * @param {string} sDisplayBehaviour - the display behaviour (e.g. as defined in: sap.ui.comp.smartfilterbar.DisplayBehaviour)
		 * @returns {function} a static formatter function based on the displayBehaviour
		 * @private
		 */
		getFormatterFunctionFromDisplayBehaviour: function(sDisplayBehaviour) {
			switch (sDisplayBehaviour) {
				case "descriptionAndId":
					return FormatUtil._getTextFormatterForDescriptionAndId;
				case "idAndDescription":
					return FormatUtil._getTextFormatterForIdAndDescription;
				case "descriptionOnly":
					return FormatUtil._getTextFormatterForDescriptionOnly;
					// idOnly and fallback to Id in case nothing was specified
				default:
					return FormatUtil._getTextFormatterForIdOnly;
			}
		},
		_processText: function(oTexts, bPreventProcessing) {
			if (bPreventProcessing) {
				return oTexts;
			}
			return oTexts.secondText ? oTexts.firstText + " (" + oTexts.secondText + ")" : oTexts.firstText;
		},
		_getTextFormatterForDescriptionAndId: function(sId, sDescription, bPreventProcessing) {
			return FormatUtil._processText({
				firstText: sDescription ? sDescription : sId,
				secondText: sDescription ? sId : undefined
			}, bPreventProcessing);
		},
		_getTextFormatterForIdAndDescription: function(sId, sDescription, bPreventProcessing) {
			return FormatUtil._processText({
				firstText: sId,
				secondText: sDescription ? sDescription : undefined
			}, bPreventProcessing);
		},
		_getTextFormatterForDescriptionOnly: function(sId, sDescription, bPreventProcessing) {
			return FormatUtil._processText({
				firstText: sDescription,
				secondText: undefined
			}, bPreventProcessing);
		},
		_getTextFormatterForIdOnly: function(sId, sDescription, bPreventProcessing) {
			return FormatUtil._processText({
				firstText: sId,
				secondText: undefined
			}, bPreventProcessing);
		},
		/**
		 * Static function that returns an object with first and second text values based on the displayBehaviour. Fallback is to return the Id (sId)
		 *
		 * @param {string} sDisplayBehaviour The display behaviour (e.g. as defined in: sap.ui.comp.smartfilterbar.DisplayBehaviour)
		 * @param {string | null} sId The ID field value
		 * @param {string} sDescription The Description field value
		 * @returns {object} Object with first and second text values based on the <code>sDisplayBehaviour</code>
		 * @private
		 */
		getTextsFromDisplayBehaviour: function(sDisplayBehaviour, sId, sDescription) {
			return FormatUtil.getFormatterFunctionFromDisplayBehaviour(sDisplayBehaviour)(sId, sDescription, true);
		},

		/**
		 * creates and returns a formatted text for the specified range
		 *
		 * @private
		 * @param {string} sOperation the operation type sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation
		 * @param {string} sValue1 value of the first range field
		 * @param {string} sValue2 value of the second range field
		 * @param {boolean} bExclude indicates if the range is an Exclude range
		 * @returns {string} the range token text
		 */
		getFormattedRangeText: function(sOperation, sValue1, sValue2, bExclude) {
			return P13nConditionPanel.getFormatedConditionText(sOperation, sValue1, sValue2, bExclude);
		},
		_initialiseCurrencyFormatter: function() {
			// create number formatter instance
			if (!FormatUtil._oCurrencyFormatter) {
				FormatUtil._oCurrencyFormatter = NumberFormat.getCurrencyInstance({
					showMeasure: false
				});
			}
			if (!FormatUtil._MAX_CURRENCY_DIGITS) {
				FormatUtil._MAX_CURRENCY_DIGITS = 3;
			}
			FormatUtil._initialiseSpaceChars();
		},
		_initialiseSpaceChars: function() {
			// initialise SPACE chars the 1st time
			if (!FormatUtil._FIGURE_SPACE || !FormatUtil._PUNCTUATION_SPACE) {
				// Whitespace characters to align values
				FormatUtil._FIGURE_SPACE = '\u2007';
				FormatUtil._PUNCTUATION_SPACE = '\u2008';
			}
		},
		/**
		 * creates and returns an Amount Currency formatter, for formatting amount with spaces
		 *
		 * @private
		 * @returns {function} a formatter function accepting raw value of amount and currency
		 */
		getAmountCurrencyFormatter: function() {
			FormatUtil._initialiseCurrencyFormatter();
			if (!FormatUtil._fAmountCurrencyFormatter) {
				FormatUtil._fAmountCurrencyFormatter = function(oAmount, sCurrency) {
					// Adapted logic from sap.ui.unified.Currency to implement basic padding for some currencies (Ex: JPY)
					var sValue, iCurrencyDigits, iPadding;
					if (oAmount === undefined || oAmount === null || sCurrency === "*") {
						return "";
					}
					// Get the formatted numeric value
					sValue = FormatUtil._oCurrencyFormatter.format(oAmount, sCurrency);

					// Get the currency digits
					iCurrencyDigits = FormatUtil._oCurrencyFormatter.oLocaleData.getCurrencyDigits(sCurrency);

					// Add padding for decimal "."
					if (iCurrencyDigits === 0) {
						sValue += FormatUtil._PUNCTUATION_SPACE;
					}
					// Calculate and set padding for missing currency digits
					iPadding = FormatUtil._MAX_CURRENCY_DIGITS - iCurrencyDigits;
					if (iPadding) {
						sValue = sValue.padEnd(sValue.length + iPadding, FormatUtil._FIGURE_SPACE);
					}
					return sValue;
				};
			}
			return FormatUtil._fAmountCurrencyFormatter;
		},
		/**
		 * creates and returns a Currency symbol formatter
		 *
		 * @private
		 * @returns {function} a formatter function accepting currency value
		 */
		getCurrencySymbolFormatter: function() {
			FormatUtil._initialiseCurrencyFormatter();
			if (!FormatUtil._fCurrencySymbolFormatter) {
				// Formatter function for currency symbol conversion
				FormatUtil._fCurrencySymbolFormatter = function(sCurrency) {
					if (!sCurrency || sCurrency === "*") {
						return "";
					}
					return FormatUtil._oCurrencyFormatter.oLocaleData.getCurrencySymbol(sCurrency);
				};
			}
			return FormatUtil._fCurrencySymbolFormatter;
		},
		/**
		 * creates and returns a Measure Unit formatter, for formatting measure values with spaces
		 *
		 * @private
		 * @returns {function} a formatter function accepting strings for value and unit (unit is not used currently)
		 */
		getMeasureUnitFormatter: function() {
			FormatUtil._initialiseSpaceChars();
			if (!FormatUtil._fMeasureFormatter) {
				// Formatter function for value part of measure
				FormatUtil._fMeasureFormatter = function(sValue, sUnit) {
					if (sValue === undefined || sValue === null || sUnit === "*") {
						return "";
					}
					return sValue + FormatUtil._FIGURE_SPACE;
				};
			}
			return FormatUtil._fMeasureFormatter;
		},
		/**
		 * creates and returns an inline Measure Unit formatter, for formatting measure and unit values separated by a space
		 *
		 * @private
		 * @returns {function} a formatter function accepting strings for value and unit
		 */
		getInlineMeasureUnitFormatter: function() {
			FormatUtil._initialiseSpaceChars();
			if (!FormatUtil._fInlineMeasureFormatter) {
				// Formatter function for inline value and unit (measure)
				FormatUtil._fInlineMeasureFormatter = function(sValue, sUnit) {
					if (sValue === undefined || sValue === null || sUnit === "*") {
						return "";
					}
					if (!sUnit) {
						return sValue;
					}
					return sValue + FormatUtil._FIGURE_SPACE + sUnit;
				};
			}
			return FormatUtil._fInlineMeasureFormatter;
		},
		/**
		 * creates and returns an inline Amount Currency formatter, for formatting amount and currency values separated by a space
		 *
		 * @private
		 * @returns {function} a formatter function accepting strings for amount and currency
		 */
		getInlineAmountFormatter: function() {
			FormatUtil._initialiseCurrencyFormatter();
			if (!FormatUtil._fInlineAmountFormatter) {
				FormatUtil._fInlineAmountFormatter = function(oAmount, sCurrency) {
					var sValue;
					if (oAmount === undefined || oAmount === null || sCurrency === "*") {
						return "";
					}
					// Get the formatted numeric value
					sValue = FormatUtil._oCurrencyFormatter.format(oAmount, sCurrency);

					return sValue + FormatUtil._FIGURE_SPACE + sCurrency;
				};
			}
			return FormatUtil._fInlineAmountFormatter;
		},
		/**
		 * Creates and returns an inline formatter for grouping, based on the field metadata
		 *
		 * @private
		 * @param {Object} oFieldMetadata OData metadata for the table field
		 * @param {boolean} bDisableDescription Optional flag to be used when description cannot be supported (e.g. AnalyticalBinding)
		 * @returns {function} a formatter function
		 */
		getInlineGroupFormatterFunction: function(oFieldMetadata, bDisableDescription) {
			var fnInternalFormatter, bRelevantStringType = oFieldMetadata.type === "Edm.String" && !oFieldMetadata.isCalendarDate && !oFieldMetadata.isDigitSequence;
			if (oFieldMetadata.unit) {
				if (oFieldMetadata.isCurrencyField) {
					return FormatUtil.getInlineAmountFormatter();
				} else {
					fnInternalFormatter = FormatUtil.getInlineMeasureUnitFormatter();
					return function(oValue, sUnit) {
						var sValue = oValue;
						if (oFieldMetadata.modelType) {
							sValue = oFieldMetadata.modelType.formatValue(oValue, "string");
						}
						return fnInternalFormatter(sValue, sUnit);
					};
				}
			} else if (!bDisableDescription && bRelevantStringType && oFieldMetadata.description) {
				return FormatUtil.getFormatterFunctionFromDisplayBehaviour(oFieldMetadata.displayBehaviour);
			} else if (oFieldMetadata.modelType) {
				return function(oValue) {
					return oFieldMetadata.modelType.formatValue(oValue, "string");
				};
			}
		},
		/**
		 * Returns the width from the metadata attributes. min-width if there is no width specified
		 *
		 * @param {object} oField - OData metadata for the table field
		 * @param {Number} iMax - The max width (optional, default 30)
		 * @param {Number} iMin - The min width (optional, default 3)
		 * @returns {string} - width of the filter field in em
		 * @private
		 */
		getWidth: function(oField, iMax, iMin) {
			var sWidth = oField.maxLength || oField.precision, iWidth;
			if (!iMax) {
				iMax = 30;
			}
			if (!iMin) {
				iMin = 3;
			}
			// Force set the width to 9em for date fields
			if (oField.type === "Edm.DateTime" && oField.displayFormat === "Date" || oField.isCalendarDate) {
				sWidth = "9em";
			} else if (sWidth) {
				// Use Max width for description&Id and descriptionOnly use-case to accommodate description texts better on the UI
				if (oField.type === "Edm.String" && oField.description && oField.displayBehaviour && (oField.displayBehaviour === "descriptionAndId" || oField.displayBehaviour === "descriptionOnly")) {
					sWidth = "Max";
				}

				// Use max width if "Max" is set in the metadata or above
				if (sWidth === "Max") {
					sWidth = iMax + "";
				}
				iWidth = parseInt(sWidth);
				if (!isNaN(iWidth)) {
					// Add additional .75 em (~12px) to avoid showing ellipsis in some cases!
					iWidth += 0.75;
					// use a max initial width of 30em (default)
					if (iWidth > iMax) {
						iWidth = iMax;
					} else if (iWidth < iMin) {
						// use a min width of 3em (default)
						iWidth = iMin;
					}
					sWidth = iWidth + "em";
				} else {
					// if NaN reset the width so min width would be used
					sWidth = null;
				}
			}
			if (!sWidth) {
				// For Boolean fields - Use min width as the fallabck, in case no width could be derived.
				if (oField.type === "Edm.Boolean") {
					sWidth = iMin + "em";
				} else {
					// use the max width as the fallback width of the column, if no width can be derived
					sWidth = iMax + "em";
				}
			}
			return sWidth;
		},
		/**
		 * Returns Time in 'PT'HH'H'mm'M'ss'S' format (as expected by Edm.Time fields)
		 *
		 * @private
		 * @param {Object} oDate - The input date object
		 * @returns {string} The time in 'PT'HH'H'mm'M'ss'S' format
		 */
		getEdmTimeFromDate: function(oDate) {
			if (!FormatUtil._oTimeFormat) {
				FormatUtil._oTimeFormat = DateFormat.getTimeInstance({
					pattern: "'PT'HH'H'mm'M'ss'S'"
				});
			}
			return FormatUtil._oTimeFormat.format(oDate);
		},
		/**
		 * Static function to parse the value of numeric interval field
		 *
		 * @private
		 * @param {string} oValue of interval
		 * @returns {array} containing low and high values of the passed interval
		 */
		parseFilterNumericIntervalData: function(oValue) {
			var aResult = [], aRegResult = oValue.match(RegExp("^(-?[^-]*)-(-?[^-]*)$"));

			if (aRegResult && aRegResult.length >= 2) {
				aResult.push(aRegResult[1]);
				aResult.push(aRegResult[2]);
			}

			return aResult;
		},

		parseDateTimeOffsetInterval: function(sValue) {
			var aValues = sValue.split('-'), aRetValues = [
				sValue
			], nIdx = 0;

			if ((aValues.length % 2) === 0) {

				aRetValues = [];

				for (var i = 0; i < aValues.length / 2; i++) {
					nIdx = sValue.indexOf('-', ++nIdx);
				}

				aRetValues.push(sValue.substr(0, nIdx).replace(/\s+/g, ''));
				aRetValues.push(sValue.substr(nIdx + 1).replace(/\s+/g, ''));

			}

			return aRetValues;
		},

		/**
		 * Returns the filterType (needed by p13n handling) of the field based on metadata, else undefined
		 *
		 * @param {object} oField - OData metadata for the field
		 * @returns {string} the filter type for the field as expected by p13n filter/condition handling
		 * @private
		 */
		_getFilterType: function(oField) {
			if (oField.isFiscalDate) {
				return "date";
			} else if (oField.isDigitSequence) {
				return "numc";
			} else if (ODataType.isNumeric(oField.type)) {
				return "numeric";
			} else if (oField.type === "Edm.DateTime" && oField.displayFormat === "Date") {
				return "date";
			} else if (oField.type === "Edm.DateTimeOffset") {
				return "datetime";
			} else if (oField.type === "Edm.String") {
				if (oField.isCalendarDate) {
					return "stringdate";
				}
				return "string";
			} else if (oField.type === "Edm.Boolean") {
				return "boolean";
			} else if (oField.type === "Edm.Time") {
				return "time";
			}
			return undefined;
		}
	};

	return FormatUtil;

}, /* bExport= */true);
