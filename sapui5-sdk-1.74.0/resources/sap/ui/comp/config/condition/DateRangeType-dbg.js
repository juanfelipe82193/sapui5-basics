/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides sap.ui.comp.config.condition.DateRangeType.
sap.ui.define([
	"sap/ui/thirdparty/jquery",
	'sap/ui/comp/config/condition/Type',
	'sap/ui/Device',
	'sap/ui/core/library',
	'sap/m/library',
	'sap/m/Input',
	'sap/m/DatePicker',
	'sap/m/Text',
	'sap/m/Select',
	'sap/ui/core/ListItem',
	'sap/m/Label',
	'sap/ui/core/date/UniversalDate',
	'sap/ui/core/format/DateFormat',
	'sap/ui/core/Locale',
	'sap/ui/core/LocaleData',
	'sap/ui/model/type/Integer',
	'sap/ui/model/Sorter',
	'sap/ui/model/Filter',
	"sap/base/Log",
	"sap/ui/core/date/UniversalDateUtils",
	// jQuery Plugin "cursorPos"
	"sap/ui/dom/jquery/cursorPos"
], function(
	jQuery,
	Type,
	Device,
	coreLibrary,
	mLibrary,
	Input,
	DatePicker,
	Text,
	Select,
	ListItem,
	Label,
	UniversalDate,
	DateFormat,
	Locale,
	LocaleData,
	Integer,
	modelSorter,
	modelFilter,
	Log,
	UniversalDateUtils
) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	// shortcut for sap.m.PlacementType
	var PlacementType = mLibrary.PlacementType;

	var ResponsivePopover;
	var VBox;
	var Button;

	var NullableInteger = Integer.extend("sap.ui.model.type.NullableInteger", {
		parseValue: function(oValue, sInternalType) {
			if (this.getPrimitiveType(sInternalType) == "string") {
				if (oValue === "") {
					return null;
				}
			}

			return Integer.prototype.parseValue.apply(this, arguments);
		}
	});


	var DateRangeType = Type.extend("sap.ui.comp.config.condition.DateRangeType", /** @lends "sap.ui.comp.config.condition.DateRangeType.prototype */ {

		constructor: function(sFieldName, oFilterProvider, oFieldViewMetadata) {
			Type.apply(this, [
				sFieldName, oFilterProvider, oFieldViewMetadata
			]);
			this.oDateFormat = oFilterProvider && oFilterProvider._oDateFormatSettings ? oFilterProvider._oDateFormatSettings : {
				UTC: true
			};

			this._bIgnoreTime = false;
			this._maxIntValue = 10000; // max int value for "LAST/NEXT X DAYS/MONTH...." operators
			this.bMandatory = this.oFieldMetadata ? this.oFieldMetadata.isMandatory : false;
		}
	});

	DateRangeType.prototype.applySettings = function(oSettings) {
		Type.prototype.applySettings.apply(this, arguments);

		if (oSettings && oSettings.ignoreTime) {
			this._bIgnoreTime = oSettings.ignoreTime;
		}
	};


	/**
	 * Sets and returns the given date with the start time 00:00:00.000 UTC
	 *
	 * @param {UniversalDate} oDate the date
	 * @returns {UniversalDate} the given date with the start time 00:00:00.000 UTC
	 */
	DateRangeType.setStartTime = function(oDate) {
		oDate = DateRangeType.toUniversalDate(oDate);
		return UniversalDateUtils.resetStartTime(oDate);
	};

	/**
	 * Sets and returns the day and set time to 23:59:59[:999] (milliseconds depending on given precision)
	 *
	 * @param {UniversalDate} oDate the date
	 * @param {boolean} bIgnoreTime If false the time will be set to 00:00:00 otherwise 23:59:59
	 * @returns {UniversalDate} the given date with the end time 23:59:59.999 UTC
	 */
	DateRangeType.setEndTime = function(oDate, bIgnoreTime) {
		oDate = DateRangeType.toUniversalDate(oDate);
		if (!bIgnoreTime) {
			return UniversalDateUtils.resetEndTime(oDate);
		} else {
			return UniversalDateUtils.resetStartTime(oDate);
		}
	};

	/**
	 * Converts oDate into an UniversalDate instance
	 *
	 * @param {object} [oDate] the date
	 * @returns {UniversalDate} the given date as UniversalDate
	 */
	DateRangeType.toUniversalDate = function(oDate) {
		if (oDate instanceof Date) {
			return new UniversalDate(oDate);
		}
		if (!oDate) {
			return new UniversalDate();
		}
		if (!(oDate instanceof UniversalDate)) {
			return DateRangeType.toUniversalDate(new Date(oDate));
		}

		return oDate;
	};

	/**
	 * Returns the weeks start date of a given universal date based on the locale and format settings
	 */
	DateRangeType.getWeekStartDate = function(oUniversalDate) {
		return UniversalDateUtils.getWeekStartDate(oUniversalDate);
	};

	/**
	 * Returns the month start date of a given universal date
	 */
	DateRangeType.getMonthStartDate = function(oUniversalDate) {
		return UniversalDateUtils.getMonthStartDate(oUniversalDate);
	};

	/**
	 * Returns the quarter start date of a given universal date
	 */
	DateRangeType.getQuarterStartDate = function(oUniversalDate) {
		return UniversalDateUtils.getQuarterStartDate(oUniversalDate);
	};

	/**
	 * Returns the years start date of a given universal date. If no date is given, today is used.
	 *
	 * @param {sap.ui.core.date.UniversalDate} [oUniversalDate] the universal date
	 * @returns the years start date of a given universal date.
	 * @public
	 */
	DateRangeType.getYearStartDate = function(oUniversalDate) {
		return UniversalDateUtils.getYearStartDate(oUniversalDate);
	};

	/**
	 * Returns an array of a date range based on the given universal date If no date is given, today is used.
	 *
	 * @param {int} iValue positive and negative values to calculate the date range
	 * @param {string} sType defines the range that the iValue refers to ("DAY","WEEK","MONTH","QUARTER","YEAR")
	 * @param {sap.ui.core.date.UniversalDate} [oUniversalDate] the universal date
	 * @param {boolean} bCalcBaseStartDate calculate start date even if Date is provided
	 * @param {boolean} bIgnoreCurrentInterval If iValue > 0 the start date is the begin of the next interval
	 * @returns {sap.ui.core.date.UniversalDate[]} array with 2 values where [0] is the start and [1] is the end date for the range
	 * @public
	 */
	DateRangeType.getDateRange = function(iValue, sType, oUniversalDate, bCalcBaseStartDate, bIgnoreCurrentInterval) {
		if (oUniversalDate === true) {
			bCalcBaseStartDate = true;
			oUniversalDate = null;
		}
		if (!oUniversalDate) {
			oUniversalDate = new UniversalDate();
		} else {
			oUniversalDate = new UniversalDate( oUniversalDate);
		}

		if (bCalcBaseStartDate) {
			switch (sType) {
			case "DAY":
				break;
			case "WEEK":
				oUniversalDate = UniversalDateUtils.getWeekStartDate(oUniversalDate);
				break;
			case "MONTH":
				oUniversalDate = UniversalDateUtils.getMonthStartDate(oUniversalDate);
				break;
			case "QUARTER":
				oUniversalDate = UniversalDateUtils.getQuarterStartDate(oUniversalDate);
				break;
			case "YEAR":
				oUniversalDate = UniversalDateUtils.getYearStartDate(oUniversalDate);
				break;
			}
		}

		if (!bIgnoreCurrentInterval && iValue > 0) {

			if (iValue !== 0 && !isNaN(iValue)) {
				var offset = -1;
				switch (sType) {
					case "DAY":
					oUniversalDate.setDate(oUniversalDate.getDate() + offset);
					break;
				case "WEEK":
					oUniversalDate.setDate(oUniversalDate.getDate() + (offset * 7));
					break;
				case "MONTH":
					oUniversalDate.setMonth(oUniversalDate.getMonth() + offset);
					break;
				case "QUARTER":
					oUniversalDate.setMonth(oUniversalDate.getMonth() + (offset * 3));
					break;
				case "YEAR":
					oUniversalDate.setFullYear(oUniversalDate.getFullYear() + offset);
					break;
				}
			}
		}

		return UniversalDateUtils.getRange(iValue, sType, oUniversalDate, false);
	};

	DateRangeType.getTextField = function(oInstance, bExpression) {
		var sId = Type._createStableId(oInstance, "text");

		if (oInstance._oOperationSelect) {
			var aLabels = oInstance._oOperationSelect.getAriaLabelledBy();
			var bFound = false;
			for (var i = 0; i < aLabels.length; i++) {
				if (sId === aLabels[i]) {
					bFound = true;
					break;
				}
			}

			if (!bFound) {
				oInstance._oOperationSelect.addAriaLabelledBy(sId);
			}
		}

		if (bExpression) {
			return new Text(sId, {
				text: "{path: '$smartEntityFilter>value1', type:'sap.ui.model.type.Date', formatOptions:" + JSON.stringify({
					style: oInstance.oDateFormat.style,
					pattern: oInstance.oDateFormat.pattern
				}) + "} - {path: '$smartEntityFilter>value2', type:'sap.ui.model.type.Date', formatOptions:" + JSON.stringify({
					style: oInstance.oDateFormat.style,
					pattern: oInstance.oDateFormat.pattern
				}) + "}"
			});
		} else {
			return new Text(sId, {
				text: {
					path: '$smartEntityFilter>value1',
					type: 'sap.ui.model.type.Date',
					formatOptions: {
						style: oInstance.oDateFormat.style,
						pattern: oInstance.oDateFormat.pattern
					}
				}
			});
		}

	};

	DateRangeType.getIntField = function(oInstance) {
		return new Input(Type._createStableId(oInstance, "field"), {
			ariaLabelledBy: oInstance._oOperationSelect || null,
			value: {
				path: "$smartEntityFilter>value1",
				type: new NullableInteger({}, { minimum: 0, maximum: oInstance._maxIntValue })
			},
			textAlign: "End",
			//type: "Number",
			width: "100%"
		});
	};

	DateRangeType.ControlFactory = function(oInstance, aResult, oOperation) {
		if (oOperation.type === "range") {
			var oControl = DateRangeType.getTextField(oInstance, oOperation.display !== "start");
			oControl.addStyleClass("sapUiCompFilterBarCTPaddingTop");
			aResult.push(oControl);
			return;
		}
		if (oOperation.type === "int") {
			var oControl = DateRangeType.getIntField(oInstance);
			aResult.push(oControl);
			if (oOperation.descriptionTextKeys) {
				oControl.setFieldWidth("auto");
				oControl.bindProperty("description", {
					path: "$smartEntityFilter>value1",
					type: "sap.ui.model.type.Integer",
					formatter: function() {
						var sTextKey = oOperation.descriptionTextKeys[0];
						var sTextMulti = oOperation.descriptionTextKeys[1];
						if (this.getBinding("description").getValue() === 1) {
							return Type.getTranslatedText(sTextKey);
						} else {
							return Type.getTranslatedText(sTextMulti || sTextKey);
						}
					}
				});
			}
		}
	};

	DateRangeType._defaultOnChangeHandler = function(sValue, oInstance) {
		//console.log("---> onChange :" + sValue);
		if (sValue.toLowerCase() === this.languageText.toLowerCase()) {
			oInstance.oModel.setProperty("/condition/operation", this.key);
			oInstance.oModel.setProperty("inputstate", "NONE", oInstance.getContext());

			if (this.category.indexOf("FIXED") !== 0) {
				//oInstance._toggleOpen();
				oInstance.oModel.setProperty("inputstate", "ERROR", oInstance.getContext());
			}

			return true;
		}
		return false;
	};

	DateRangeType._IntOnChangeHandler = function(sValue, oInstance) {
		if (this.basicLanguageText.indexOf("{0}") >= 0) {
			var rx = new RegExp(this.basicLanguageText.replace("+", "\\+").replace("{0}", "([a-zA-Z0-9_]+)") + "$", 'i');
			if (sValue.match(rx)) {
				var sValue = sValue.match(rx)[1];
				if (sValue) {
					var iValue = parseInt(sValue);

					if (!isNaN(iValue) && iValue <= oInstance._maxIntValue) {
						oInstance.oModel.setProperty("/condition/operation", this.key);
						oInstance.oModel.setProperty("/condition/value1", iValue);
						oInstance.oModel.setProperty("inputstate", "NONE", oInstance.getContext());
					} else {
						oInstance.oModel.setProperty("inputstate", "ERROR", oInstance.getContext());
					}
					return true;
				}
			}
		}
		return false;
	};

	DateRangeType._DateOnChangeHandler = function(sValue, oInstance) {
		if (sValue.toLowerCase().indexOf(this.languageText.toLowerCase()) === 0) {
			var s = sValue.slice(this.languageText.length);
			if (s.length > 0 && s[0] === " ") {
				s = s.trim();
				if (s[0] === "(" && s[s.length - 1] === ")") {
					s = s.slice(1, s.length - 1);
				}

				var oDateFormatter = oInstance._getDateFormatter(true);
				var oDate = oDateFormatter.parse(s);

				if (oDate) {
					oInstance.oModel.setProperty("/condition/operation", this.key);
					oInstance.oModel.setProperty("/condition/value1", oDate);
					oInstance.oModel.setProperty("inputstate", "NONE", oInstance.getContext());
				} else {
					oInstance.oModel.setProperty("inputstate", "ERROR", oInstance.getContext());
				}

				return true;
			}
		}
		return false;
	};

	DateRangeType._DateRangeOnChangeHandler = function(sValue, oInstance) {
		if (sValue.toLowerCase().indexOf(this.languageText.toLowerCase()) === 0) {
			var s = sValue.slice(this.languageText.length).trim();
			if (s[0] === "(" && s[s.length - 1] === ")") {
				s = s.slice(1, s.length - 1);
			}
			var sValue1 = s.split("-")[0];
			var sValue2 = s.split("-")[1];

			var oDateFormatter = oInstance._getDateFormatter(true);
			var oDate1 = oDateFormatter.parse(sValue1);
			var oDate2 = oDateFormatter.parse(sValue2);

			if (oDate1 && oDate2) {
				oInstance.oModel.setProperty("/condition/operation", this.key);
				oInstance.oModel.setProperty("/condition/value1", oDate1);
				oInstance.oModel.setProperty("/condition/value2", oDate2);
				oInstance.oModel.setProperty("inputstate", "NONE", oInstance.getContext());
			} else {
				oInstance.oModel.setProperty("inputstate", "ERROR", oInstance.getContext());
			}

			return true;
		}
		return false;
	};

	DateRangeType._MonthOnChangeHandler = function(sValue, oInstance) {
		var sMonth;
		var bResult = false;

		if (sValue.toLowerCase().indexOf(this.languageText.toLowerCase()) === 0) {
			sMonth = sValue.slice(this.languageText.length).trim();
			if (sMonth.indexOf("(") == 0) {
				sMonth = sMonth.slice(1);
				sMonth = sMonth.slice(0, sMonth.length - 1);
			}
			bResult = true;
		} else {
			sMonth = sValue;
		}

		var aMonth = this.getValueList();
		var iMonthIndex = -1;
		aMonth.some(function(oItem, index) {
			var bResult = oItem.text.toLowerCase() === sMonth.toLowerCase();
			if (bResult) {
				iMonthIndex = index;
			}
			return bResult;
		});

		if (iMonthIndex > -1) {
			oInstance.oModel.setProperty("/condition/operation", this.key);
			oInstance.oModel.setProperty("/condition/value1", iMonthIndex);
			oInstance.oModel.setProperty("inputstate", "NONE", oInstance.getContext());
			return true;
		} else {
			if (bResult) {
				oInstance.oModel.setProperty("inputstate", "ERROR", oInstance.getContext());
			}
			return bResult;
		}
	};

	DateRangeType._DefaultFilterSuggestItem = function(sValue, oItem, oInstance) {
		var bMatch = false;
		if (this.languageText.toLowerCase().startsWith(sValue.toLowerCase())) {
			bMatch = true;
		} else {
			var aWords = this.languageText.split(" ");
			for (var i = 0; i < aWords.length; i++) {
				var sWord = aWords[i];
				if (sWord.toLowerCase().startsWith(sValue.toLowerCase())) {
					bMatch = true;
				}
			}
		}

		oItem.setAdditionalText(this.textValue);
		oItem.setText(this.languageText);
		return bMatch;
	};

	DateRangeType._HideFilterSuggestItem = function(sValue, oItem, oInstance) {
		return false;
	};

	DateRangeType._IntFilterSuggestItem = function(sValue, oItem, oInstance) {
		var xPos = this.basicLanguageText.indexOf("{0}");
		var sPart1;
		var sPart2;
		if (xPos >= 0) {
			sPart1 = this.basicLanguageText.slice(0, xPos).trim();
			sPart2 = this.basicLanguageText.slice(xPos + 3).trim();
		}

		var aParts = sValue.split(" ");
		if (aParts.length < 1 || aParts.length > 3) {
			return false;
		}
		var bMatch = false;
		var sNumber;
		var isValidNumber = function(sValue) {
			return !!sValue.match(/(?!(0))(^[0-9]+$)/) && parseInt(sValue) > 0;
		};

		if (sPart1.toLowerCase().startsWith(aParts[0].toLowerCase())) {
			// starts with the first word
			if (aParts[1]) {
				if (isValidNumber(aParts[1])) {
					// second part is number
					sNumber = aParts[1];
					if (aParts[2]) {
						if (sPart2.toLowerCase().startsWith(aParts[2].toLowerCase())) {
							bMatch = true;
						}
					} else {
						bMatch = true;
					}
				}
			} else {
				// only first part -> OK
				bMatch = true;
			}
		} else if (isValidNumber(aParts[0]) && aParts.length < 3) {
			// starts with number
			sNumber = aParts[0];
			if (aParts[1]) {
				if (sPart2.toLowerCase().startsWith(aParts[1].toLowerCase())) {
					bMatch = true;
				}
			} else {
				// only number -> OK
				bMatch = true;
			}
		} else if (sPart2.toLowerCase().startsWith(aParts[0].toLowerCase()) && aParts.length == 1) {
			// starts with last word
			bMatch = true;
		}

		if (bMatch && sNumber) {
			var sType;
			switch (this.category) {
				case "DYNAMIC.DATE.INT":
					sType = "DAY";
					break;
				case "DYNAMIC.WEEK.INT":
					sType = "WEEK";
					break;
				case "DYNAMIC.MONTH.INT":
					sType = "MONTH";
					break;
				case "DYNAMIC.QUARTER.INT":
					sType = "QUARTER";
					break;
				case "DYNAMIC.YEAR.INT":
					sType = "YEAR";
					break;

				default:
					sType = "DAY";
					break;
			}

			var iNumber = parseInt(sNumber),
				bFlag = true;

			if (iNumber > oInstance._maxIntValue) {
				bMatch = false;
			}

			if (this.key.startsWith("LAST")) {
				iNumber = iNumber * -1;
				bFlag = false;
			}

			var aDates;
			if (this.getDateRange) {
				var oRange = this.getDateRange({ operation: this.key, value1: iNumber });
				aDates = [oRange.value1, oRange.value2];

			} else {
				aDates = DateRangeType.getDateRange(iNumber, sType, true, bFlag, bFlag);
			}
			var oDateFormatter = oInstance._getDateFormatter(true);
			if (Math.abs(iNumber) === 1 && this.singulareBasicLanguageText) {
				oItem.setText(this.singulareBasicLanguageText);
				if (sType !== "DAY") {
					oItem.setAdditionalText(oDateFormatter.format(aDates[0]) + " - " + oDateFormatter.format(aDates[1]));
				} else {
					oItem.setAdditionalText(oDateFormatter.format(aDates[0]));
				}
			} else {
				oItem.setText(oInstance._fillNumberToText(this.basicLanguageText, sNumber));
				oItem.setAdditionalText(oDateFormatter.format(aDates[0]) + " - " + oDateFormatter.format(aDates[1]));
			}
			oItem._value1 = parseInt(sNumber);
		} else {
			oItem.setAdditionalText(null);
			oItem.setText(this.languageText);
			oItem._value1 = null;
		}
		return bMatch;
	};

	DateRangeType._DateFilterSuggestItem = function(sValue, oItem, oInstance) {
		var oDateFormatter = oInstance._getDateFormatter(true);
		var oDate = oDateFormatter.parse(sValue);

		if (oDate) {
			oItem.setText(this.languageText + " (" + oDateFormatter.format(oDate) + ")");
			oItem._value1 = oDate;
			return true;
		} else {
			oItem.setText(this.languageText);
			oItem._value1 = null;
			return false;
		}
	};

	DateRangeType._DateRangeFilterSuggestItem = function(sValue, oItem, oInstance) {
		var oDateFormatter = oInstance._getDateFormatter(true);
		var oDate1, oDate2;
		var sDelimiter = "-";
		var bValid = false;

		var aDates = sValue.split(sDelimiter);
		if (aDates.length === 2) {
			// if delimiter only appears once in value (not part of date pattern) remove " " to be more flexible for input
			if (aDates[0].slice(aDates[0].length - 1, aDates[0].length) == " ") {
				aDates[0] = aDates[0].slice(0, aDates[0].length - 1);
			}
			if (aDates[1].slice(0, 1) == " ") {
				aDates[1] = aDates[1].slice(1);
			}
		} else {
			aDates = sValue.split(" " + sDelimiter + " "); // Delimiter appears more than once -> try with separators
		}
		if (aDates.length < 2) {
			// no delimiter found -> maybe only " " is used
			var aDates2 = sValue.split(" ");
			if (aDates2.length === 2) {
				aDates = aDates2;
			}
		}

		if (aDates.length >= 1 && aDates.length <= 2) {
			oDate1 = oDateFormatter.parse(aDates[0]);
			if (oDate1) {
				oItem._value1 = oDate1;
				if (aDates.length == 2 && aDates[1] === "") {
					// second date empty - just ignore
					aDates.splice(1, 1);
				}
				if (aDates.length == 2) {
					oDate2 = oDateFormatter.parse(aDates[1]);
					if (oDate2) {
						// start and end date
						oItem._value2 = oDate2;
						bValid = true;
						oItem.setText(this.languageText + " (" + oDateFormatter.format(oDate1) + " " + sDelimiter + " " + oDateFormatter.format(oDate2) + ")");
					}
				} else {
					// only start date
					bValid = true;
					oItem.setText(this.languageText + " (" + oDateFormatter.format(oDate1) + " " + sDelimiter + ")");
				}
			}
		}
		if (!bValid) {
			oItem.setText(this.languageText);
			oItem._value1 = null;
			oItem._value2 = null;
		}

		return bValid;
	};

	DateRangeType._MonthFilterSuggestItem = function(sValue, oItem, oInstance) {
		var bMonthFound = false;
		oItem._value1 = null;
		var aMonths = this.getValueList();
		for (var i = 0; i < aMonths.length; i++) {
			var oMonth = aMonths[i];
			bMonthFound = oMonth.text.toLowerCase().startsWith(sValue.toLowerCase());
			if (bMonthFound) {
				oItem.setText(this.languageText + " (" + oMonth.text + ")");
				oItem._value1 = i;
				break;
			}
		}
		return bMonthFound;
	};

	DateRangeType._DefaultOnItemSelected = function(sValue, oItem, oInstance) {

		oInstance.oModel.setProperty("/condition/operation", this.key);
		if ("value1" in this) {
			oInstance.oModel.setProperty("/condition/value1", oItem._value1);
		}
		if ("value2" in this) {
			oInstance.oModel.setProperty("/condition/value2", oItem._value2);
		}
		oInstance.oModel.setProperty("inputstate", "NONE", oInstance.getContext());
		oInstance._bSuggestItemSelected = true;

	};

	DateRangeType._IntOnItemSelected = function(sValue, oItem, oInstance) {

		var iNumber = oItem._value1;

		oInstance.oModel.setProperty("/condition/operation", this.key);
		oInstance.oModel.setProperty("/condition/value1", iNumber);
		oInstance.oModel.setProperty("inputstate", "NONE", oInstance.getContext());
		oInstance._bSuggestItemSelected = true;
	};


	DateRangeType.getFixedRangeOperation = function(sKey, sTextKey, sCategory, aDefaults, fnFilterSuggestItem, iOrder) {
		return {
			key: sKey,
			textKey: sTextKey,
			category: sCategory,
			order: iOrder || 100,
			defaultValues: aDefaults || null,
			type: "range",
			display: "range",
			//onChange: DateRangeType._defaultOnChangeHandler,
			filterSuggestItem: fnFilterSuggestItem || DateRangeType._DefaultFilterSuggestItem,
			onItemSelected: DateRangeType._DefaultOnItemSelected,
			getControls: DateRangeType.ControlFactory
		};
	};

	/**
	 * function to create a new operation for a dynamic int value with a single int value.
	 *
	 * @public
	 * @since 1.60.0
	 * @param {string} sKey unique key for the new operation
	 * @param {string} sTextKey text for the new operation
	 * @param {string} sSingularTextKey singular text for the new operation
	 * @param {string} sCategory category of the operation
	 * @param {int} iDefault the default int value for the operation
	 * @param {string[]} aDescriptionTextKeys array of two descriptions text (multiple/singular text)
	 * @param {int} iOrder the order value of the new operation in the operations list
	 *
	 * @returns {object} object for the new created operation. The getDateRange on this object must be implemented.
	 */
	DateRangeType.createSingleIntRangeOperation = function(sKey, sTextKey, sSingularTextKey, sCategory, iDefault, aDescriptionTextKeys, iOrder) {
		return {
			key: sKey,
			textKey: sTextKey,
			singularTextKey: sSingularTextKey,
			category: sCategory,
			order: iOrder,
			defaultValues: [iDefault],
			value1: null,
			type: "int",
			descriptionTextKeys: aDescriptionTextKeys,

			onChange: DateRangeType._IntOnChangeHandler,
			filterSuggestItem: DateRangeType._IntFilterSuggestItem,
			onItemSelected: DateRangeType._IntOnItemSelected,
			getControls: DateRangeType.ControlFactory,

			/**
			 * function to determine the date values that are used in the filter request.
			 *
			 * Normally the returned values are based on the conditions value1 and value2.
			 *
			 * @public
			 * @since 1.60.0
			 * @param {object} oCondition current DateRange condition (operation, value1, value2)
			 * @param {string} oCondition.operation Name of the custom operation
			 * @param {any} oCondition.value1 value of a condition
			 * @param {any} oCondition.value2 second value of a condition (if exist)
			 *
			 * @returns {any[] | null} object with operation and value1, value2 or null if value is not set.
			 */
			//getDateRange: function(oCondition) { return null; },

			/**
			 * initialize the operator.
			 * @private
			 * @since 1.60.0
			 * @param {object} oCondition current DateRange condition (operation, value1, value2)
			 * @returns {any[] | null} array of values
			 */
			_getInitialValues: function(oCondition) {
				return [oCondition.value1, oCondition.value2];
			}
		};
	};

	/**
	 * Supported operations of the DateRangeType
	 */
	DateRangeType.Operations = {
		DATERANGE: {
			key: "DATERANGE",
			textKey: "CONDITION_DATERANGETYPE_DATERANGE",
			category: "DYNAMIC.DATERANGE",
			order: 2,
			defaultOperation: true,
			defaultValues: [
				null, null
			],
			value1: null,
			value2: null,
			onChange: DateRangeType._DateRangeOnChangeHandler,
			filterSuggestItem: DateRangeType._DateRangeFilterSuggestItem,
			onItemSelected: DateRangeType._DefaultOnItemSelected,
			getControls: function(oInstance, aResult) {
				var oLabel = new Label({ text: Type.getTranslatedText("CONDITION_DATERANGETYPE_DATERANGE_LABELFROM") });
				oLabel.addStyleClass("sapUiCompFilterBarCTPaddingTop");
				aResult.push(oLabel);

				var oControlFrom = new DatePicker(Type._createStableId(oInstance, "field1"), {
					dateValue: { path: "$smartEntityFilter>value1" },
					maxDate: { path: "$smartEntityFilter>value2" },
					displayFormat: oInstance.oDateFormat.style || oInstance.oDateFormat.pattern || "",
					change: function(oEvent) {
						var bValid = oEvent.getParameter("valid");
						oControlFrom.setValueState(bValid ? ValueState.None : ValueState.Error);
					}
				});
				oLabel.setLabelFor(oControlFrom);
				aResult.push(oControlFrom);

				oLabel = new Label({ text: Type.getTranslatedText("CONDITION_DATERANGETYPE_DATERANGE_LABELTO") });
				oLabel.addStyleClass("sapUiCompFilterBarCTPaddingTop");
				aResult.push(oLabel);

				var oControlTo = new DatePicker(Type._createStableId(oInstance, "field2"), {
					//ariaLabelledBy: oInstance._oOperationSelect || null,
					dateValue: { path: "$smartEntityFilter>value2" },
					minDate: { path: "$smartEntityFilter>value1" },
					displayFormat: oInstance.oDateFormat.style || oInstance.oDateFormat.pattern || "",
					change: function(oEvent) {
						var bValid = oEvent.getParameter("valid");
						oControlTo.setValueState(bValid ? ValueState.None : ValueState.Error);
					}
				});
				oLabel.setLabelFor(oControlTo);
				aResult.push(oControlTo);
			}
		},
		DATE: {
			key: "DATE",
			textKey: "CONDITION_DATERANGETYPE_DATE",
			category: "DYNAMIC.DATE",
			order: 0,
			defaultValues: [
				null
			],
			value1: null,
			onChange: DateRangeType._DateOnChangeHandler,
			filterSuggestItem: DateRangeType._DateFilterSuggestItem,
			onItemSelected: DateRangeType._DefaultOnItemSelected,
			getControls: function(oInstance, aResult) {
				var oControl = new DatePicker(Type._createStableId(oInstance, "field"), {
					ariaLabelledBy: oInstance._oOperationSelect || null,
					dateValue: { path: "$smartEntityFilter>value1" },
					displayFormat: oInstance.oDateFormat.style || oInstance.oDateFormat.pattern || "",
					change: function(oEvent) {
						var bValid = oEvent.getParameter("valid");

						if (bValid) {
							this.getModel("$smartEntityFilter").setProperty("inputstate", "NONE", this.getModel("$smartEntityFilter").getContext("/"));
						} else {
							this.getModel("$smartEntityFilter").setProperty("inputstate", "ERROR", this.getModel("$smartEntityFilter").getContext("/"));
							//TODO remove the old value1 from model
						}
					}
				});
				aResult.push(oControl);
			}
		},
		FROM: {
			key: "FROM",
			textKey: "CONDITION_DATERANGETYPE_FROM",
			category: "DYNAMIC.DATE",
			order: 0,
			defaultValues: [
				null
			],
			value1: null,
			onChange: DateRangeType._DateOnChangeHandler,
			filterSuggestItem: DateRangeType._DateFilterSuggestItem,
			onItemSelected: DateRangeType._DefaultOnItemSelected,
			getControls: function(oInstance, aResult) {
				var oControl = new DatePicker(Type._createStableId(oInstance, "field"), {
					ariaLabelledBy: oInstance._oOperationSelect || null,
					dateValue: { path: "$smartEntityFilter>value1" },
					displayFormat: oInstance.oDateFormat.style || oInstance.oDateFormat.pattern || "",
					change: function(oEvent) {
						var bValid = oEvent.getParameter("valid");

						if (bValid) {
							this.getModel("$smartEntityFilter").setProperty("inputstate", "NONE", this.getModel("$smartEntityFilter").getContext("/"));
						} else {
							this.getModel("$smartEntityFilter").setProperty("inputstate", "ERROR", this.getModel("$smartEntityFilter").getContext("/"));
							//TODO remove the old value1 from model
						}
					}
				});
				aResult.push(oControl);
			}
		},
		TO: {
			key: "TO",
			textKey: "CONDITION_DATERANGETYPE_TO",
			category: "DYNAMIC.DATE",
			order: 1,
			defaultValues: [
				null
			],
			value1: null,
			onChange: DateRangeType._DateOnChangeHandler,
			filterSuggestItem: DateRangeType._DateFilterSuggestItem,
			onItemSelected: DateRangeType._DefaultOnItemSelected,
			getControls: function(oInstance, aResult, oOperation) {
				var oControl = new DatePicker(Type._createStableId(oInstance, "field"), {
					ariaLabelledBy: oInstance._oOperationSelect || null,
					dateValue: { path: "$smartEntityFilter>value1" },
					displayFormat: oInstance.oDateFormat.style || oInstance.oDateFormat.pattern || "",
					change: function(oEvent) {
						var bValid = oEvent.getParameter("valid");

						if (bValid) {
							this.getModel("$smartEntityFilter").setProperty("inputstate", "NONE", this.getModel("$smartEntityFilter").getContext("/"));
						} else {
							this.getModel("$smartEntityFilter").setProperty("inputstate", "ERROR", this.getModel("$smartEntityFilter").getContext("/"));
							//TODO remove the old value1 from model
						}
					}
				});
				aResult.push(oControl);
			}
		},
		LASTDAYS: DateRangeType.createSingleIntRangeOperation(
			"LASTDAYS",
			"CONDITION_DATERANGETYPE_LASTDAYS",
			"CONDITION_DATERANGETYPE_YESTERDAY",
			"DYNAMIC.DATE.INT", 1, ["CONDITION_DATERANGETYPE_SINGLE_DAY", "CONDITION_DATERANGETYPE_MULTIPLE_DAYS"],
			4
		),
		LASTWEEKS: DateRangeType.createSingleIntRangeOperation(
			"LASTWEEKS",
			"CONDITION_DATERANGETYPE_LASTWEEKS",
			"CONDITION_DATERANGETYPE_LASTWEEK",
			"DYNAMIC.WEEK.INT",
			1, ["CONDITION_DATERANGETYPE_SINGLE_WEEK", "CONDITION_DATERANGETYPE_MULTIPLE_WEEKS"],
			8
		),
		LASTMONTHS: {
			key: "LASTMONTHS",
			textKey: "CONDITION_DATERANGETYPE_LASTMONTHS",
			singularTextKey: "CONDITION_DATERANGETYPE_LASTMONTH",
			category: "DYNAMIC.MONTH.INT",
			order: 14,
			defaultValues: [
				1
			],
			value1: null,
			type: "int",
			descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_MONTH", "CONDITION_DATERANGETYPE_MULTIPLE_MONTHS"],
			onChange: DateRangeType._IntOnChangeHandler,
			filterSuggestItem: DateRangeType._IntFilterSuggestItem,
			onItemSelected: DateRangeType._IntOnItemSelected,
			getControls: DateRangeType.ControlFactory
		},
		LASTQUARTERS: {
			key: "LASTQUARTERS",
			textKey: "CONDITION_DATERANGETYPE_LASTQUARTERS",
			singularTextKey: "CONDITION_DATERANGETYPE_LASTQUARTER",
			category: "DYNAMIC.QUARTER.INT",
			order: 19,
			defaultValues: [
				1
			],
			value1: null,
			type: "int",
			descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_QUARTER", "CONDITION_DATERANGETYPE_MULTIPLE_QUARTERS"],
			onChange: DateRangeType._IntOnChangeHandler,
			filterSuggestItem: DateRangeType._IntFilterSuggestItem,
			onItemSelected: DateRangeType._IntOnItemSelected,
			getControls: DateRangeType.ControlFactory
		},
		LASTYEARS: {
			key: "LASTYEARS",
			textKey: "CONDITION_DATERANGETYPE_LASTYEARS",
			singularTextKey: "CONDITION_DATERANGETYPE_LASTYEAR",
			category: "DYNAMIC.YEAR.INT",
			order: 28,
			defaultValues: [
				1
			],
			value1: null,
			type: "int",
			descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_YEAR", "CONDITION_DATERANGETYPE_MULTIPLE_YEARS"],
			onChange: DateRangeType._IntOnChangeHandler,
			filterSuggestItem: DateRangeType._IntFilterSuggestItem,
			onItemSelected: DateRangeType._IntOnItemSelected,
			getControls: DateRangeType.ControlFactory
		},
		NEXTDAYS: {
			key: "NEXTDAYS",
			textKey: "CONDITION_DATERANGETYPE_NEXTDAYS",
			singularTextKey: "CONDITION_DATERANGETYPE_TOMORROW",
			category: "DYNAMIC.DATE.INT",
			order: 5,
			defaultValues: [
				1
			],
			value1: null,
			type: "int",
			descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_DAY", "CONDITION_DATERANGETYPE_MULTIPLE_DAYS"],
			onChange: DateRangeType._IntOnChangeHandler,
			filterSuggestItem: DateRangeType._IntFilterSuggestItem,
			onItemSelected: DateRangeType._IntOnItemSelected,
			getControls: DateRangeType.ControlFactory
		},
		NEXTWEEKS: {
			key: "NEXTWEEKS",
			textKey: "CONDITION_DATERANGETYPE_NEXTWEEKS",
			singularTextKey: "CONDITION_DATERANGETYPE_NEXTWEEK",
			category: "DYNAMIC.WEEK.INT",
			order: 10,
			defaultValues: [
				1
			],
			value1: null,
			type: "int",
			descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_WEEK", "CONDITION_DATERANGETYPE_MULTIPLE_WEEKS"],
			onChange: DateRangeType._IntOnChangeHandler,
			filterSuggestItem: DateRangeType._IntFilterSuggestItem,
			onItemSelected: DateRangeType._IntOnItemSelected,
			getControls: DateRangeType.ControlFactory
		},
		NEXTMONTHS: {
			key: "NEXTMONTHS",
			textKey: "CONDITION_DATERANGETYPE_NEXTMONTHS",
			singularTextKey: "CONDITION_DATERANGETYPE_NEXTMONTH",
			category: "DYNAMIC.MONTH.INT",
			order: 16,
			defaultValues: [
				1
			],
			value1: null,
			type: "int",
			descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_MONTH", "CONDITION_DATERANGETYPE_MULTIPLE_MONTHS"],
			onChange: DateRangeType._IntOnChangeHandler,
			filterSuggestItem: DateRangeType._IntFilterSuggestItem,
			onItemSelected: DateRangeType._IntOnItemSelected,
			getControls: DateRangeType.ControlFactory
		},
		NEXTQUARTERS: {
			key: "NEXTQUARTERS",
			textKey: "CONDITION_DATERANGETYPE_NEXTQUARTERS",
			singularTextKey: "CONDITION_DATERANGETYPE_NEXTQUARTER",
			category: "DYNAMIC.QUARTER.INT",
			order: 21,
			defaultValues: [
				1
			],
			value1: null,
			type: "int",
			descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_QUARTER", "CONDITION_DATERANGETYPE_MULTIPLE_QUARTERS"],
			onChange: DateRangeType._IntOnChangeHandler,
			filterSuggestItem: DateRangeType._IntFilterSuggestItem,
			onItemSelected: DateRangeType._IntOnItemSelected,
			getControls: DateRangeType.ControlFactory
		},
		NEXTYEARS: {
			key: "NEXTYEARS",
			textKey: "CONDITION_DATERANGETYPE_NEXTYEARS",
			singularTextKey: "CONDITION_DATERANGETYPE_NEXTYEAR",
			category: "DYNAMIC.YEAR.INT",
			order: 30,
			defaultValues: [
				1
			],
			value1: null,
			type: "int",
			descriptionTextKeys: ["CONDITION_DATERANGETYPE_SINGLE_YEAR", "CONDITION_DATERANGETYPE_MULTIPLE_YEARS"],
			onChange: DateRangeType._IntOnChangeHandler,
			filterSuggestItem: DateRangeType._IntFilterSuggestItem,
			onItemSelected: DateRangeType._IntOnItemSelected,
			getControls: DateRangeType.ControlFactory
		},
		SPECIFICMONTH: {
			key: "SPECIFICMONTH",
			textKey: "CONDITION_DATERANGETYPE_SPECIFICMONTH",
			category: "DYNAMIC.MONTH",
			order: 11,
			defaultValues: function() {
				var oDate = new UniversalDate();
				return [
					oDate.getMonth()
				];
			},
			value1: null,
			onChange: DateRangeType._MonthOnChangeHandler,
			onItemSelected: DateRangeType._DefaultOnItemSelected,
			filterSuggestItem: DateRangeType._MonthFilterSuggestItem,
			getControls: function(oInstance, aResult, oOperation) {
				var oSelect = new Select(Type._createStableId(oInstance, "field"), {
					ariaLabelledBy: oInstance._oOperationSelect || null,
					width: "100%",
					selectedKey: {
						path: "$smartEntityFilter>value1",
						type: "sap.ui.model.type.Integer"
					}
				});
				oSelect.bindAggregation("items", {
					path: "$smartEntityFilter>/currentoperation/valueList",
					template: new ListItem({
						text: {
							path: "$smartEntityFilter>text"
						},
						key: {
							path: "$smartEntityFilter>key"
						}
					}),
					templateShareable: false
				});
				aResult.push(oSelect);
			},
			getValueList: function() {
				var oDate = new UniversalDate(),
					aMonths = [],
					oFormatter = DateFormat.getDateInstance({
						pattern: "LLLL"
					});
				oDate.setDate(15);
				oDate.setMonth(0);
				for (var i = 0; i < 12; i++) {
					aMonths.push({
						text: oFormatter.format(oDate),
						key: i
					});
					oDate.setMonth(oDate.getMonth() + 1);
				}
				return aMonths;
			}
		},
		YESTERDAY: {
			key: "YESTERDAY",
			textKey: "CONDITION_DATERANGETYPE_YESTERDAY",
			category: "FIXED.DATE",
			order: 3.1,
			defaultValues: function() {
				return UniversalDateUtils.ranges.yesterday();
			},
			type: "range",
			display: "start",
			onChange: DateRangeType._defaultOnChangeHandler,
			onItemSelected: DateRangeType._DefaultOnItemSelected,
			getControls: DateRangeType.ControlFactory
		},
		TODAY: {
			key: "TODAY",
			textKey: "CONDITION_DATERANGETYPE_TODAY",
			category: "FIXED.DATE",
			order: 3,
			defaultValues: function() {
				return UniversalDateUtils.ranges.today();
			},
			type: "range",
			display: "start",
			onChange: DateRangeType._defaultOnChangeHandler,
			onItemSelected: DateRangeType._DefaultOnItemSelected,
			getControls: DateRangeType.ControlFactory
		},
		TOMORROW: {
			key: "TOMORROW",
			textKey: "CONDITION_DATERANGETYPE_TOMORROW",
			category: "FIXED.DATE",
			order: 3.2,
			defaultValues: function() {
				var aDateRange = UniversalDateUtils.ranges.tomorrow();
				return aDateRange;
			},
			type: "range",
			display: "start",
			onChange: DateRangeType._defaultOnChangeHandler,
			onItemSelected: DateRangeType._DefaultOnItemSelected,
			getControls: DateRangeType.ControlFactory
		},
		THISWEEK: DateRangeType.getFixedRangeOperation("THISWEEK", "CONDITION_DATERANGETYPE_THISWEEK", "FIXED.WEEK", function() {
			return UniversalDateUtils.ranges.currentWeek();
		}, DateRangeType._DefaultFilterSuggestItem, 6),
		LASTWEEK: DateRangeType.getFixedRangeOperation("LASTWEEK", "CONDITION_DATERANGETYPE_LASTWEEK", "FIXED.WEEK", function() {
			return UniversalDateUtils.ranges.lastWeek();
		}, DateRangeType._DefaultFilterSuggestItem, 7),
		LAST2WEEKS: DateRangeType.getFixedRangeOperation("LAST2WEEKS", "CONDITION_DATERANGETYPE_LAST2WEEKS", "FIXED.WEEK", function() {
			return UniversalDateUtils.ranges.lastWeeks(-2);
		}, DateRangeType._HideFilterSuggestItem, -1),
		LAST3WEEKS: DateRangeType.getFixedRangeOperation("LAST3WEEKS", "CONDITION_DATERANGETYPE_LAST3WEEKS", "FIXED.WEEK", function() {
			return UniversalDateUtils.ranges.lastWeeks(-3);
		}, DateRangeType._HideFilterSuggestItem, -1),
		LAST4WEEKS: DateRangeType.getFixedRangeOperation("LAST4WEEKS", "CONDITION_DATERANGETYPE_LAST4WEEKS", "FIXED.WEEK", function() {
			return UniversalDateUtils.ranges.lastWeeks(-4);
		}, DateRangeType._HideFilterSuggestItem, -1),
		LAST5WEEKS: DateRangeType.getFixedRangeOperation("LAST5WEEKS", "CONDITION_DATERANGETYPE_LAST5WEEKS", "FIXED.WEEK", function() {
			return UniversalDateUtils.ranges.lastWeeks(-5);
		}, DateRangeType._HideFilterSuggestItem, -1),
		NEXTWEEK: DateRangeType.getFixedRangeOperation("NEXTWEEK", "CONDITION_DATERANGETYPE_NEXTWEEK", "FIXED.WEEK", function() {
			return UniversalDateUtils.ranges.nextWeek();
		}, DateRangeType._DefaultFilterSuggestItem, 9),
		NEXT2WEEKS: DateRangeType.getFixedRangeOperation("NEXT2WEEKS", "CONDITION_DATERANGETYPE_NEXT2WEEKS", "FIXED.WEEK", function() {
			return UniversalDateUtils.ranges.nextWeeks(2);
		}, DateRangeType._HideFilterSuggestItem, -1),
		NEXT3WEEKS: DateRangeType.getFixedRangeOperation("NEXT3WEEKS", "CONDITION_DATERANGETYPE_NEXT3WEEKS", "FIXED.WEEK", function() {
			return  UniversalDateUtils.ranges.nextWeeks(3);
		}, DateRangeType._HideFilterSuggestItem, -1),
		NEXT4WEEKS: DateRangeType.getFixedRangeOperation("NEXT4WEEKS", "CONDITION_DATERANGETYPE_NEXT4WEEKS", "FIXED.WEEK", function() {
			return UniversalDateUtils.ranges.nextWeeks(4);
		}, DateRangeType._HideFilterSuggestItem, -1),
		NEXT5WEEKS: DateRangeType.getFixedRangeOperation("NEXT5WEEKS", "CONDITION_DATERANGETYPE_NEXT5WEEKS", "FIXED.WEEK", function() {
			return UniversalDateUtils.ranges.nextWeeks(5);
		}, DateRangeType._HideFilterSuggestItem, -1),

		THISMONTH: DateRangeType.getFixedRangeOperation("THISMONTH", "CONDITION_DATERANGETYPE_THISMONTH", "FIXED.MONTH", function() {
			return UniversalDateUtils.ranges.currentMonth();
		}, DateRangeType._DefaultFilterSuggestItem, 12),
		LASTMONTH: DateRangeType.getFixedRangeOperation("LASTMONTH", "CONDITION_DATERANGETYPE_LASTMONTH", "FIXED.MONTH", function() {
			return UniversalDateUtils.ranges.lastMonth();
		}, DateRangeType._DefaultFilterSuggestItem, 13),
		NEXTMONTH: DateRangeType.getFixedRangeOperation("NEXTMONTH", "CONDITION_DATERANGETYPE_NEXTMONTH", "FIXED.MONTH", function() {
			return UniversalDateUtils.ranges.nextMonth();
		}, DateRangeType._DefaultFilterSuggestItem, 15),

		THISQUARTER: DateRangeType.getFixedRangeOperation("THISQUARTER", "CONDITION_DATERANGETYPE_THISQUARTER", "FIXED.QUARTER", function() {
			return UniversalDateUtils.ranges.currentQuarter();
		}, DateRangeType._DefaultFilterSuggestItem, 17),
		LASTQUARTER: DateRangeType.getFixedRangeOperation("LASTQUARTER", "CONDITION_DATERANGETYPE_LASTQUARTER", "FIXED.QUARTER", function() {
			return UniversalDateUtils.ranges.lastQuarter();
		}, DateRangeType._DefaultFilterSuggestItem, 18),
		NEXTQUARTER: DateRangeType.getFixedRangeOperation("NEXTQUARTER", "CONDITION_DATERANGETYPE_NEXTQUARTER", "FIXED.QUARTER", function() {
			return UniversalDateUtils.ranges.nextQuarter();
		}, DateRangeType._DefaultFilterSuggestItem, 20),

		YEARTODATE: DateRangeType.getFixedRangeOperation("YEARTODATE", "CONDITION_DATERANGETYPE_YEARTODATE", "FIXED.YEAR", function() {
			return UniversalDateUtils.ranges.yearToDate();
		}, DateRangeType._DefaultFilterSuggestItem, 31),

		THISYEAR: DateRangeType.getFixedRangeOperation("THISYEAR", "CONDITION_DATERANGETYPE_THISYEAR", "FIXED.YEAR", function() {
			return UniversalDateUtils.ranges.currentYear();
		}, DateRangeType._DefaultFilterSuggestItem, 26),
		LASTYEAR: DateRangeType.getFixedRangeOperation("LASTYEAR", "CONDITION_DATERANGETYPE_LASTYEAR", "FIXED.YEAR", function() {
			return UniversalDateUtils.ranges.lastYear();
		}, DateRangeType._DefaultFilterSuggestItem, 27),
		NEXTYEAR: DateRangeType.getFixedRangeOperation("NEXTYEAR", "CONDITION_DATERANGETYPE_NEXTYEAR", "FIXED.YEAR", function() {
			return UniversalDateUtils.ranges.nextYear();
		}, DateRangeType._DefaultFilterSuggestItem, 29),

		QUARTER1: DateRangeType.getFixedRangeOperation("QUARTER1", "CONDITION_DATERANGETYPE_QUARTER1", "FIXED.QUARTER", function() {
			return UniversalDateUtils.ranges.quarter(1);
		}, DateRangeType._DefaultFilterSuggestItem, 22),
		QUARTER2: DateRangeType.getFixedRangeOperation("QUARTER2", "CONDITION_DATERANGETYPE_QUARTER2", "FIXED.QUARTER", function() {
			return UniversalDateUtils.ranges.quarter(2);
		}, DateRangeType._DefaultFilterSuggestItem, 23),
		QUARTER3: DateRangeType.getFixedRangeOperation("QUARTER3", "CONDITION_DATERANGETYPE_QUARTER3", "FIXED.QUARTER", function() {
			return UniversalDateUtils.ranges.quarter(3);
		}, DateRangeType._DefaultFilterSuggestItem, 24),
		QUARTER4: DateRangeType.getFixedRangeOperation("QUARTER4", "CONDITION_DATERANGETYPE_QUARTER4", "FIXED.QUARTER", function() {
			return UniversalDateUtils.ranges.quarter(4);
		}, DateRangeType._DefaultFilterSuggestItem, 25)
	};

	/**
	 * Returns the controls to be used for the given operation
	 *
	 * @param {object} oOperation the current operation of the condition type
	 * @returns [sap.ui.core.Control] Array of controls to be used to visualize the condition types operation
	 * @protected
	 */
	DateRangeType.prototype.getControls = function(oOperation) {
		var aControls = [];
		if (!oOperation) {
			return;
		}
		oOperation.getControls(this, aControls, oOperation);
		return aControls;
	};


	/**
	 * Property setter for the ignoreTime
	 *
	 * @param {boolean} bIgnoreTime new value of this property
	 * @public
	 */
	DateRangeType.prototype.setIgnoreTime = function(bIgnoreTime) {
		this._bIgnoreTime = bIgnoreTime;
	};

	/**
	 * Gets current value of property ignoreTime.
	 * When the value is true, the returned range enddate has a time stamp of 00:00:00. The default for the time stamp is 23:59:59:999
	 *
	 * Default value is false.
	 *
	 * @returns {boolean} of controls to be used to visualize the condition types operation
	 * @public
	 */
	Type.prototype.getIgnoreTime = function(bIgnoreTime) {
		return this._bIgnoreTime;
	};

	/**
	 * Returns the default values for the given operation
	 *
	 * @param {object} oOperation the current operation of the condition type
	 * @returns [object] Array of default values to be used for the operation
	 * @protected
	 */
	DateRangeType.prototype.getDefaultValues = function(oOperation) {
		if (!oOperation) {
			return [];
		}
		var aDefaultValues = oOperation.defaultValues || [];
		if (typeof aDefaultValues === "function") {
			aDefaultValues = oOperation.defaultValues();
		}
		var oCondition = this.getCondition(),
			oValue1 = aDefaultValues[0] || null,
			oValue2 = aDefaultValues[1] || null;
		if (oOperation.key === "DATERANGE" && oCondition && oCondition.value1 && oCondition.value2) {
			//Default fallback to a date range if value1 and value2 are already provided as dates
			oValue1 = oCondition.value1.oDate || oCondition.value1;
			oValue2 = oCondition.value2.oDate || oCondition.value2;
		} else {
			// make sure that both values are of type UniversalDate
			if (oValue1 instanceof Date) {
				oValue1 = new UniversalDate(oValue1);
			}
			if (oValue2 instanceof Date) {
				oValue2 = new UniversalDate(oValue2);
			}
		}

		return [
			oValue1, oValue2
		];
	};

	DateRangeType.prototype.getOperations = function() {
		var aOperations = [];
		for (var n in DateRangeType.Operations) {
			var oOperation = DateRangeType.Operations[n];
			if (this._filterOperation(oOperation)) {
				aOperations.push(oOperation);
			}
		}
		return aOperations;
	};

	DateRangeType.prototype._updateOperation = function(oOperation) {
		Type.prototype._updateOperation.apply(this, [oOperation]);

		if (oOperation.languageText && !oOperation.basicLanguageText) {
			oOperation.basicLanguageText = oOperation.languageText;
			if (!oOperation.singulareBasicLanguageText && oOperation.singularTextKey) {
				oOperation.singulareBasicLanguageText = this.getTranslatedText(oOperation.singularTextKey);
			}
			oOperation.languageText = this._fillNumberToText(oOperation.languageText);
		}

		if (oOperation.display) {
			var aDefaultValues = this.getDefaultValues(oOperation);
			var oDateFormatter = this._getDateFormatter(false);

			if (oOperation.display === "start") {
				oOperation.textValue = oDateFormatter.format(aDefaultValues[0].oDate);
			} else if (oOperation.display === "range" && aDefaultValues && aDefaultValues[0] && aDefaultValues[1]) {
				// in some cases (when you toggle between variants which use async app operations) the aDefaultValues can be empty or the values null
				// BCP 002075129500003647642017
				oOperation.textValue = oDateFormatter.format(aDefaultValues[0].oDate) + " - " + oDateFormatter.format(aDefaultValues[1].oDate);
			}
		}

		oOperation.suggestText = oOperation.languageText;
	};

	DateRangeType.prototype.updateOperations = function() {
		var aOperations = this.getOperations();
		for (var i = 0; i < aOperations.length; i++) {
			this._updateOperation(aOperations[i]);
		}
		return this.oModel.setProperty("operations", aOperations, this.getContext(), true);
	};

	DateRangeType.prototype.isValidCondition = function() {
		var oCondition = this.getCondition(),
			oOperation = this.getOperation(oCondition.operation);
		if (oOperation && oCondition && oCondition.key && oCondition.operation) {
			if ("value1" in oOperation && "value2" in oOperation) {
				return "value1" in oCondition && oCondition.value1 !== null && "value2" in oCondition && oCondition.value2 !== null;
			} else if ("value1" in oOperation) {
				return "value1" in oCondition && oCondition.value1 !== null;
			} else if ("value2" in oOperation) {
				return "value2" in oCondition && oCondition.value2 !== null;
			} else if (!("value1" in oOperation) && !("value2" in oOperation)) {
				return true;
			}
		}
		return false;
	};

	// TODO: check if it can be removed. Possibly here, yes, but possibly not in Type, for compat reasons
	DateRangeType.prototype.providerDataUpdated = function(aUpdatedFieldNames, oData) {
	};

	DateRangeType.prototype.initialize = function(oJson) {
		Type.prototype.initialize.apply(this, [oJson]);
		this.oModel.suspend();
		var oOrgJson = Object.assign({}, oJson, true);

		var sCalendarType = (new UniversalDate()).getCalendarType();
		if (!oJson.conditionTypeInfo) {
			if (oJson.ranges && oJson.ranges.length == 1) {
				// if no conditionTypeInfo exist but one ranges item we restore the date range as DATERANGE operation. This is required for a better deserialize handling of DataSuite format.
				var sOperation = "DATERANGE";
				if (oJson.ranges[0].operation === "GE") {
					//if the range operation is GE we map it on the FROM DateRangeType operation
					sOperation = "FROM";
				}
				if (oJson.ranges[0].operation === "LE") {
					//if the range operation is LE we map it on the TO DateRangeType operation
					sOperation = "TO";
				}
				oJson.conditionTypeInfo = {
					name: this.getName(),
					data: {
						key: this.sFieldName,
						operation: sOperation,
						value1: oJson.ranges[0].value1,
						value2: oJson.ranges[0].value2,
						calendarType: sCalendarType
					}
				};
			} else {
				var oDefaultOperation = this.getDefaultOperation(),
					sKey = oDefaultOperation ? oDefaultOperation.key : "";
				oJson.conditionTypeInfo = {
					name: this.getName(),
					data: {
						key: this.sFieldName,
						operation: sKey,
						calendarType: sCalendarType
					}
				};
			}
		}
		if (oJson.conditionTypeInfo) {
			oJson = oJson.conditionTypeInfo;
		}
		if (oJson.name && oJson.data) {
			if (oJson.name !== this.getName()) {

				Log.debug("ConditionType " + this.getName() + " tries to deserialize data from " + oJson.name);
			}
			oJson = oJson.data;
		}
		if (!oJson.operation) {
			return;
		}


		// map not supported operations like NEXT2WEEKS to NEXTWEEKS with value1=2
		if (this.getOperation(oJson.operation) && this.getOperation(oJson.operation).order < 0) {
			var index = ["LAST2WEEKS", "LAST3WEEKS", "LAST4WEEKS", "LAST5WEEKS"].indexOf(oJson.operation);
			if (index >= 0) {
				oJson.operation = "LASTWEEKS";
				oJson.value1 = index + 2;
			}
			index = ["NEXT2WEEKS", "NEXT3WEEKS", "NEXT4WEEKS", "NEXT5WEEKS"].indexOf(oJson.operation);
			if (index >= 0) {
				oJson.operation = "NEXTWEEKS";
				oJson.value1 = index + 2;
			}
		}

		var oOperation = this.getOperation(oJson.operation);
		if (!oOperation) {
			// if no operation is found and the Type is async we wait for PendingChange
			if (this.getAsync()) {

				this.setPending(true);

				var that = this,
					fnHandler = function(oEvent) {
						if (oEvent.getParameter("pending") === false) {
							that.oFilterProvider.detachPendingChange(fnHandler);
							that.initialize(oOrgJson);
						}
					};
				this.oFilterProvider.attachPendingChange(fnHandler);

				this.oModel.resume();
				return;
			}
			//TODO if not async we could use the DefaultOperation????
		}

		var aValues;
		// handle transform from calendar type differences
		if (sCalendarType !== oJson.calendarType && (oJson.calendarType === "Islamic" || sCalendarType === "Islamic") && oJson.operation === "SPECIFICMONTH") {
			oJson.operation = "DATERANGE";
			var iValue = parseInt(oJson.value1),
				oDate = UniversalDate.getInstance(new Date(), oJson.calendarType);
			oDate.setMonth(iValue);
			oDate = UniversalDateUtils.getMonthStartDate(oDate);
			aValues = UniversalDateUtils.getRange(0, "MONTH", oDate);
			oJson.value1 = aValues[0].oDate.toISOString();
			oJson.value2 = aValues[1].oDate.toISOString();
		}

		var oProperty = this.getConditionContext().getObject();

		oProperty.operation = oJson.operation;
		oProperty.key = oJson.key;
		oProperty.value1 = null;
		oProperty.value2 = null;
		if (oJson.operation === "DATERANGE") {
			if (typeof oJson.value1 === "string") {
				oJson.value1 = oJson.value1 === "" ? null : (new UniversalDate(oJson.value1)).oDate;
			}
			if (typeof oJson.value2 === "string") {
				oJson.value2 = oJson.value2 === "" ? null : (new UniversalDate(oJson.value2)).oDate;
			}
			oProperty.value1 = oJson.value1;
			oProperty.value2 = oJson.value2;
		} else if (["DATE", "FROM", "TO"].indexOf(oJson.operation) !== -1) {
			if (typeof oJson.value1 === "string") {
				oJson.value1 = oJson.value1 === "" ? null : (new UniversalDate(oJson.value1)).oDate;
			}
			oProperty.value1 = oJson.value1;
		} else if ([
				"LASTDAYS", "LASTWEEKS", "LASTMONTHS", "LASTQUARTERS", "LASTYEARS", "NEXTDAYS", "NEXTWEEKS", "NEXTMONTHS", "NEXTQUARTERS", "NEXTYEARS"
			].indexOf(oJson.operation) > -1) {
			oProperty.value1 = oJson.value1;
		} else if (oJson.operation === "SPECIFICMONTH") {
			oProperty.value1 = oJson.value1 + "";
		} else {
			oOperation = this.getOperation(oJson.operation);
			aValues = oOperation && oOperation._getInitialValues ? oOperation._getInitialValues(oJson) : null;
			if (!aValues) {
				aValues = this.getDefaultValues(oOperation);
			}
			oProperty.value1 = aValues[0];
			oProperty.value2 = aValues[1];
		}

		// ignore some model change events, so that we not overwrite the values by some defaultValues
		this.bIgnoreBindingChange = true;
		this.oModel.resume();
		delete this.bIgnoreBindingChange;

		this.serialize(true, false);
	};

	DateRangeType.prototype.serialize = function(bUpdateProviderSyncron, bFireFilterChange) {
		var oJson = {},
			oCondition = this.getCondition();
		if (!oCondition.operation) {
			return null;
		}
		var oOperation = this.getOperation(oCondition.operation);
		if (!oOperation || !("value1" in oOperation)) {
			oCondition.value1 = null;
		}
		if (!oOperation || !("value2" in oOperation)) {
			oCondition.value2 = null;
		}
		oCondition.calendarType = (new UniversalDate()).getCalendarType();
		oJson.conditionTypeInfo = {
			name: this.getName(),
			data: oCondition
		};

		if (this.iChangeTimer) {
			clearTimeout(this.iChangeTimer);
			delete this.iChangeTimer;
		}

		if (bUpdateProviderSyncron) {
			this._updateProvider(oJson, true, bFireFilterChange);
		} else {
			this.iChangeTimer = setTimeout(this._updateProvider.bind(this, oJson, false, bFireFilterChange), 1);
		}

		return oJson;
	};


	DateRangeType.prototype._updateProvider = function(oJson, bSync, bFireFilterChange) {
		//this.validate(false);
		oJson.ranges = this.getFilterRanges();
		oJson.items = [];
		var bSetCursor = false;
		var iCursorPos = 0;
		var iSelectionStart = 0;
		var iSelectionEnd = 0;

		//  update the formattedText and the inputstate which we display in the input field
		if (this.oModel.getData().currentoperation.languageText) {
			var oData = this.oModel.getData();
			var sFormattedText = oData.currentoperation.languageText;

			if (oData.currentoperation.basicLanguageText.indexOf("{0}") >= 0) {
				if (oJson.conditionTypeInfo.data.value1 != null && oJson.conditionTypeInfo.data.value1 != "") {
					if (oJson.conditionTypeInfo.data.value1 === 1 && oData.currentoperation.singulareBasicLanguageText) {
						sFormattedText = oData.currentoperation.singulareBasicLanguageText;
						//sFormattedText = this._fillNumberToText(sFormattedText, oJson.conditionTypeInfo.data.value1);
					} else {
						sFormattedText = this._fillNumberToText(oData.currentoperation.basicLanguageText, oJson.conditionTypeInfo.data.value1);
					}
					this.oModel.setProperty("inputstate", "NONE", this.getContext());
				} else if (this._bSuggestItemSelected) {
					sFormattedText = this._fillNumberToText(oData.currentoperation.basicLanguageText);
					var xPos = oData.currentoperation.basicLanguageText.indexOf("{0}");
					iCursorPos = xPos + 1;
					iSelectionStart = xPos;
					iSelectionEnd = xPos + 1;
					bSetCursor = true;
				} else {
					sFormattedText = "";
					this.oModel.setProperty("inputstate", "NONE", this.getContext());
				}
			} else if (oData.currentoperation.textValue) {
				sFormattedText = oData.currentoperation.languageText + " (" + oData.currentoperation.textValue + ")";
				this.oModel.setProperty("inputstate", "NONE", this.getContext());
			} else {
				if (oJson.conditionTypeInfo.data.value1 !== null && oJson.conditionTypeInfo.data.value1 !== "") {
					var v1 = oJson.conditionTypeInfo.data.value1;
					var v2 = oJson.conditionTypeInfo.data.value2;
					var sValue;
					if (typeof v1 === "number" && oData.currentoperation.valueList) {
						// in case of number access the month from  the value List array
						sValue = oData.currentoperation.valueList[v1].text;
					} else if (v1 instanceof Date) {
						var oDateFormatter = this._getDateFormatter(false);
						if (oJson.conditionTypeInfo.data.operation !== "DATERANGE" && (v1 && !v2)) {
							sValue = oDateFormatter.format(v1);
						} else if (oJson.conditionTypeInfo.data.operation === "DATERANGE" && v1 && v2) {
							//TODO replace "-" by Delimiter
							sValue = oDateFormatter.format(v1) + " - " + oDateFormatter.format(v2);
						} else if (oJson.conditionTypeInfo.data.operation === "DATERANGE" && v1 && !v2 && !(this._oPopup && this._oPopup.isOpen())) {
							//TODO replace "-" by Delimiter
							sValue = oDateFormatter.format(v1) + " - ";
							bSetCursor = true;
						} else {
							sValue = "";
						}
					} else {
						sValue = oJson.conditionTypeInfo.data.value1;
					}

					if (sValue) {
						sFormattedText = oData.currentoperation.languageText + " (" + sValue + ")";
						iCursorPos = sFormattedText.length - 1;
						this.oModel.setProperty("inputstate", "NONE", this.getContext());
					} else {
						sFormattedText = "";
					}
				} else {
					// not a valid condition
					sFormattedText = "";
				}
			}
			this._bSuggestItemSelected = false;
			this.oModel.setProperty("/formattedText", sFormattedText);

			if (bSetCursor && !(this._oPopup && this._oPopup.isOpen())) {
				// set cursor to placeholder
				this._oInput.$("inner").cursorPos(iCursorPos);
				if (iSelectionStart < iSelectionEnd) {
					this._oInput.selectText(iSelectionStart, iSelectionEnd);
				}
				this._oInput._lastValue = ""; // to recheck by focusout again as it might be an invalid value
			}
		}

		if (this.oFilterProvider) {
			this.oFilterProvider.oModel.setProperty("/" + this.sFieldName, oJson);
			this.oFilterProvider.setFilterData({}, false, this.sFieldName);

			if (bFireFilterChange && this.oFilterProvider._oSmartFilter) {
				//call the fireFilterChange syncron
				this.oFilterProvider._oSmartFilter.fireFilterChange();
			}
		}
	};

	DateRangeType.prototype.getFilterRanges = function() {
		var oCondition = this.getCondition(),
			aValues = [],
			oRange;

		if (oCondition.operation === "LASTDAYS") {
			aValues = UniversalDateUtils.ranges.lastDays(oCondition.value1);
			oCondition.value1 = aValues[0];
			oCondition.value2 = aValues[1];
		} else if (oCondition.operation === "LASTWEEKS") {
			aValues = UniversalDateUtils.ranges.lastWeeks(oCondition.value1);
			oCondition.value1 = aValues[0];
			oCondition.value2 = aValues[1];
		} else if (oCondition.operation === "LASTMONTHS") {
			aValues = UniversalDateUtils.ranges.lastMonths(oCondition.value1);
			oCondition.value1 = aValues[0];
			oCondition.value2 = aValues[1];
		} else if (oCondition.operation === "LASTQUARTERS") {
			aValues = UniversalDateUtils.ranges.lastQuarters(oCondition.value1);
			oCondition.value1 = aValues[0];
			oCondition.value2 = aValues[1];
		} else if (oCondition.operation === "LASTYEARS") {
			aValues = UniversalDateUtils.ranges.lastYears(oCondition.value1);
			oCondition.value1 = aValues[0];
			oCondition.value2 = aValues[1];
		} else if (oCondition.operation === "NEXTDAYS") {
			aValues = UniversalDateUtils.ranges.nextDays(oCondition.value1);
			oCondition.value1 = aValues[0];
			oCondition.value2 = aValues[1];
		} else if (oCondition.operation === "NEXTWEEKS") {
			aValues = UniversalDateUtils.ranges.nextWeeks(oCondition.value1);
			oCondition.value1 = aValues[0];
			oCondition.value2 = aValues[1];
		} else if (oCondition.operation === "NEXTMONTHS") {
			aValues = UniversalDateUtils.ranges.nextMonths(oCondition.value1);
			oCondition.value1 = aValues[0];
			oCondition.value2 = aValues[1];
		} else if (oCondition.operation === "NEXTQUARTERS") {
			aValues = UniversalDateUtils.ranges.nextQuarters(oCondition.value1);
			oCondition.value1 = aValues[0];
			oCondition.value2 = aValues[1];
		} else if (oCondition.operation === "NEXTYEARS") {
			aValues = UniversalDateUtils.ranges.nextYears(oCondition.value1);
			oCondition.value1 = aValues[0];
			oCondition.value2 = aValues[1];
		} else if (oCondition.operation === "SPECIFICMONTH") {
			var iValue = parseInt(oCondition.value1),
				oDate = new UniversalDate();
			oDate.setMonth(iValue);
			oDate = UniversalDateUtils.getMonthStartDate(oDate);
			aValues =  UniversalDateUtils.getRange(0, "MONTH", oDate);
			oCondition.value1 = aValues[0];
			oCondition.value2 = aValues[1];
		} else {
			// Dynamic Int Operation handling
			var oOperation = this.getOperation(oCondition.operation);
			if (oOperation && oOperation.getDateRange) {
				oRange = oOperation.getDateRange(oCondition);
				if (!oRange) {
					return [];
				}
				oCondition.value1 = oRange && oRange.value1 ? oRange.value1 : null;
				oCondition.value2 = oRange && oRange.value2 ? oRange.value2 : null;
			}
		}

		if (oCondition.value1 instanceof UniversalDate) {
			oCondition.value1 = oCondition.value1.oDate;
		}
		if (oCondition.value2 instanceof UniversalDate) {
			oCondition.value2 = oCondition.value2.oDate;
		}

		if (oCondition.operation === "DATE") {
			if (!(this.isValidCondition() && oCondition.value1)) {
				return [];
			}
			oCondition.operation = "BT";
			oCondition.value2 = oCondition.value1;

			// ensure the day and set time to beginning of day
			oCondition.value1 = DateRangeType.setStartTime(oCondition.value1).oDate;
			// include the day and set time to 23:59:59[:999] (milliseconds depending on given precision)
			oCondition.value2 = DateRangeType.setEndTime(oCondition.value2, this._bIgnoreTime, this._Precision).oDate;
		} else if (oCondition.operation === "FROM") {
			if (!(this.isValidCondition() && oCondition.value1)) {
				return [];
			}
			oCondition.operation = "GE";
			delete oCondition.value2;
		} else if (oCondition.operation === "TO") {
			if (!(this.isValidCondition() && oCondition.value1)) {
				return [];
			}
			oCondition.operation = "LE";
			delete oCondition.value2;

			// include the day and set time to 23:59:59[:999] (milliseconds depending on given precision)
			oCondition.value1 = DateRangeType.setEndTime(oCondition.value1, this._bIgnoreTime).oDate;
		} else {
			if (oRange) {
				oCondition.operation = oRange.operation;

				// ensure the day and set time to beginning of day
				oCondition.value1 = oCondition.value1 ? DateRangeType.setStartTime(oCondition.value1).oDate : null;

				// include the day and set time to 23:59:59[:999] (milliseconds depending on given precision)
				oCondition.value2 = oCondition.value2 ? DateRangeType.setEndTime(oCondition.value2, this._bIgnoreTime).oDate : null;
			} else {
				if (!(this.isValidCondition() && oCondition.value1 && oCondition.value2)) {
					return [];
				}
				oCondition.operation = "BT";

				// ensure the day and set time to beginning of day
				oCondition.value1 = DateRangeType.setStartTime(oCondition.value1).oDate;

				// include the day and set time to 23:59:59[:999] (milliseconds depending on given precision)
				oCondition.value2 = DateRangeType.setEndTime(oCondition.value2, this._bIgnoreTime).oDate;
			}
		}

		oCondition.exclude = false;
		oCondition.keyField = oCondition.key;
		delete oCondition.key;

		return [
			oCondition
		];
	};

	DateRangeType.prototype.getTokenText = function() {
		return "";
	};

	DateRangeType.prototype.getName = function() {
		return this.getMetadata().getName();
	};

	DateRangeType.prototype.getType = function() {
		return "Edm.Date";
	};

	DateRangeType.prototype._bindValueState = function(oControl) {
		oControl.bindProperty("valueState", {
			path: "$smartEntityFilter>inputstate",
			formatter: function() {
				if (this.getBinding("valueState").getValue() === "ERROR") {
					return ValueState.Error;
				} else {
					return ValueState.None;
				}
			}
		});
	};

	DateRangeType.prototype.initializeFilterItem = function() {
		this._oInput = new Input(Type._createStableId(this), {
			value: "{$smartEntityFilter>formattedText}",
			//tooltip: "{$smartEntityFilter>formattedText}",
			showValueHelp: true,
			showSuggestion: true,
			maxSuggestionWidth: "auto",
			valueHelpRequest: this._toggleOpen.bind(this)
		});

		//TODO overwrite the default highlight function and not hightligh values in the addtionalValue column
		this._oInput._highlightListText = function() {
			var i,
				label,
				labels = this._oList.$().find('.sapMDLILabel, .sapMSLITitleOnly');

			for (i = 0; i < labels.length; i++) {
				label = labels[i];
				label.innerHTML = this._createHighlightedText(label);
			}
		};

		// Test: if we can open the suggest list via CTRL+SPACE
		// this._oInput.onkeydown = function(oEvent) {

		// 	if (oEvent.keyCode == jQuery.sap.KeyCodes.SPACE && oEvent.ctrlKey) {
		// 		oEvent.preventDefault();
		// 		this._triggerSuggest(" ");
		// 	}

		// 	sap.m.Input.prototype.onkeydown.apply( this, arguments );
		// };

		this._bindValueState(this._oInput);

		this._oInput.bindAggregation("suggestionItems", {
			path: "$smartEntityFilter>operations",
			sorter: new modelSorter("order", false, false),
			filters: new modelFilter("order", function(oValue) {
				return oValue !== undefined && oValue > -1;
			}),
			template: new ListItem({
				key: {
					path: "$smartEntityFilter>key"
				}
			}),
			templateShareable: false
		});

		this._oInput.setFilterFunction(function(sValue, oItem) {
			if (this._oPopup && this._oPopup.isOpen()) {
				return false;
			}

			var oOperation = this.getOperation(oItem.getKey());

			sValue = sValue.trim();
			if (sValue === "?") {
				// make all operations visible which can be selected and not do open the _oPopup
				DateRangeType._DefaultFilterSuggestItem.call(oOperation, sValue, oItem, this);
				return oOperation.category !== "DYNAMIC.DATERANGE" && oOperation.category !== "DYNAMIC.DATE";
			}

			if (oOperation.filterSuggestItem) {
				return oOperation.filterSuggestItem(sValue, oItem, this);
			} else {
				// default filtering
				return DateRangeType._DefaultFilterSuggestItem.call(oOperation, sValue, oItem, this);
			}
		}.bind(this));

		this._oInput.attachSuggestionItemSelected(function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			if (!oItem) {
				return;
			}
			var sOperation = oItem.getKey();
			var oOperation = this.getOperation(sOperation);
			var sValue = oEvent.oSource.getValue().trim();

			if (oOperation.onItemSelected) {
				oOperation.onItemSelected(sValue, oItem, this);
				return;
			} else {
				DateRangeType._DefaultOnItemSelected.call(oOperation, sValue, oItem, this);
			}
		}.bind(this));

		this._oInput.attachChange(function(oEvent) {
			var sValue = oEvent.getParameter("value");
			if (sValue) {
				var aOperarations = this.getOperations();
				var bHandled = aOperarations.some(function(oOperation) {
					if (oOperation.onChange) {
						return oOperation.onChange(sValue, this);
					} else {
						return DateRangeType._defaultOnChangeHandler.call(oOperation, sValue, this);
					}
				}, this);

				if (!bHandled) {
					this.oModel.setProperty("inputstate", "ERROR", this.getContext());
				}
			} else {
				// field is blanked/empty

				this.setCondition({
					key: this.sFieldName,
					operation: "FROM",
					value1: null,
					value2: null
				});

				this.oModel.setProperty("inputstate", "NONE", this.getContext());
			}
		}.bind(this));

		this._oInput.attachBrowserEvent("focusin", function(oEvent) {
			if (jQuery(oEvent.target).hasClass("sapMInputBaseInner") && this._oPopup && this._oPopup.isOpen()) {
				this._oPopup.close();
			}
		}.bind(this));

		this._oInput.setBindingContext(this.getContext(), "$smartEntityFilter");

		this._oInput.setModel(this.getModel(), "$smartEntityFilter");
		//this.bIgnoreBindingChange = true;
		this.bFireFilterChange = false;
		this.getModel().checkUpdate(true);
		this.bFireFilterChange = true;
		//this.bIgnoreBindingChange = false;

		return this._oInput;
	};

	DateRangeType.prototype._toggleOpen = function(oEvent) {
		//		var sOperation = this.oModel.getProperty("operation", this.oConditionContext);
		//		var oOperation = this.getOperation(sOperation);
		//		var bOpenSuggest = false;
		//		if (oOperation.category.indexOf("DYNAMIC") < 0) {
		//			bOpenSuggest = true;
		//		}

		//		if ((this.oInput.getValue() === "" || bOpenSuggest) && oEvent) {
		//			this.oInput.setFilterFunction(function() { return true; } );
		//			//this.oInput._oSuggestionPopup.open();
		//			var sOrgValue = this.oInput.getValue(" ");
		//			this.oInput.setValue(" ");
		//			this.oInput._triggerSuggest(" ");
		//			setTimeout(function(){
		//				this.oInput.setFilterFunction();
		//				this.oInput.setValue(sOrgValue);
		//			}.bind(this), 500);
		//			return;
		//		}

		// create popover
		if (!this._oPopup) {
			if ((!ResponsivePopover || !VBox || (Device.system.phone && !Button)) && !this._bPopoverRequested) {
				ResponsivePopover = sap.ui.require("sap/m/ResponsivePopover");
				VBox = sap.ui.require("sap/m/VBox");
				if (Device.system.phone) {
					Button = sap.ui.require("sap/m/Button");
					if (!ResponsivePopover || !VBox || !Button) {
						sap.ui.require(["sap/m/ResponsivePopover",
								"sap/m/VBox",
								"sap/m/Button"
							],
							_PopoverLoaded.bind(this));
						this._bPopoverRequested = true;
					}
				} else if (!ResponsivePopover || !VBox) {
					sap.ui.require(["sap/m/ResponsivePopover",
							"sap/m/VBox"
						],
						_PopoverLoaded.bind(this));
					this._bPopoverRequested = true;
				}
			}

			if (!ResponsivePopover || !VBox || (Device.system.phone && !Button)) {
				return;
			}

			this._oPopupLayout = new VBox();
			this._oPopupLayout.addStyleClass("sapUiCompDateRangeType");
			this._initializeFilterItemPopoverContent(this._oPopupLayout);

			this._oPopup = new ResponsivePopover({
				showCloseButton: false,
				showArrow: true,
				showHeader: false,
				horizontalScrolling: false,
				//				title: "{$smartEntityFilter>/currentoperation/languageText}",
				placement: PlacementType.VerticalPreferedBottom,
				//				beginButton: new Button({
				//					text: "Ok",
				//					press: function(oEvent){
				//						this._oPopup.close();
				//					}.bind(this)
				//				}),
				//				endButton: new Button({
				//					text: "Cancel",
				//					press: function(oEvent){
				//						this._oPopup.close();
				//					}.bind(this)
				//				}),
				content: this._oPopupLayout,
				contentWidth: "18rem",
				afterClose: function() {
					if (this.oFilterProvider._oSmartFilter.getLiveMode()) {
						var SmartFilterBar = sap.ui.require("sap/ui/comp/smartfilterbar/SmartFilterBar"); // can be a sync reqest as only happens if instance exist
						this.oFilterProvider._oSmartFilter.triggerSearch(SmartFilterBar.LIVE_MODE_INTERVAL);
					}
				}.bind(this)
			});

			this._oPopup.addAriaLabelledBy(this._oOperationLabel);

			if (Device.system.phone) {
				// One phone we have to provide at lease a close button
				this._oPopup.setBeginButton(new Button({
					text: Type.getTranslatedText("CONDITION_DATERANGETYPE_POPOVER_CLOSEBUTTON"),
					type: "Emphasized",
					press: function(oEvent) {
						this._oPopup.close();
					}.bind(this)
				}));
			}

			sap.ui.getCore().getMessageManager().registerObject(this._oPopup, true);
			this._oPopup.setModel(this.getModel(), "$smartEntityFilter");
			this._oPopup._oControl.oPopup.setAutoCloseAreas([this._oInput.getDomRef()]);
		}

		if (!this._oPopup.isOpen()) {
			this._oPopup.openBy(this._oInput._getValueHelpIcon());
		} else {
			this._oPopup.close();
		}
	};

	function _PopoverLoaded(fnResponsivePopover, fnVBox, fnButton) {

		ResponsivePopover = fnResponsivePopover;
		VBox = fnVBox;
		Button = fnButton;
		this._bPopoverRequested = false;

		if (!this._bIsBeingDestroyed) {
			this._toggleOpen();
		}

	}

	DateRangeType.prototype._getDateFormatter = function(bStrict) {
		var oFormatSettings = {
			style: this.oDateFormat.style,
			pattern: this.oDateFormat.pattern,
			strictParsing: bStrict
		};

		if (JSON.stringify(oFormatSettings) !== this._sFormatSettings) {
			this._sFormatSettings = JSON.stringify(oFormatSettings);
			this._oDateFormatter = DateFormat.getInstance(oFormatSettings);
		}
		return this._oDateFormatter;
	};

	DateRangeType.prototype._fillNumberToText = function(sText, iNumber) {
		var sNumber = "X";
		if (iNumber) {
			sNumber = String(iNumber);
		}
		return sText.replace("{0}", sNumber);
	};

	DateRangeType.prototype.destroy = function() {
		if (this.iChangeTimer) {
			clearTimeout(this.iChangeTimer);
			delete this.iChangeTimer;
		}
		if (this._oPopup) {
			sap.ui.getCore().getMessageManager().unregisterObject(this._oPopup);
			this._oPopup.destroy();
		}
		Type.prototype.destroy.apply(this, arguments);
	};

	return DateRangeType;
});
