jQuery.sap.declare("AppScflTest.util.NumberFormatter");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
jQuery.sap.require("sap.ui.core.LocaleData");

sap.ui.base.Object.extend("AppScflTest.util.NumberFormatter", {});

AppScflTest.util.NumberFormatter.stringToNumeric = function(str) {
	// Regexp for detecting hexadecimal prefix => requires parseInt instead of
	// parseFloat
	var hexaDetect = /^\s*[\+-]?0[xX]/;
	if (hexaDetect.test(str)) {
		return parseInt(str, 16);
	} else {
		return parseFloat(str);
	}
};

AppScflTest.util.NumberFormatter.toNumeric = function(obj) {
	if ((obj === null) || (obj === undefined)) {
		return NaN;
	}
	var t = typeof obj;
	var result;
	switch (t) {
		case "number":
			result = obj;
			break;
		case "string":
			result = AppScflTest.util.NumberFormatter.stringToNumeric(obj);
			break;
		case "object":
			var v = obj.valueOf();
			if (typeof v === "number") {
				// Value object (e.g. Number)
				result = v;
			} else if (Array.isArray(obj)) {
				result = NaN;
			} else {
				result = AppScflTest.util.NumberFormatter.stringToNumeric(obj.toString());
			}
			break;
		default:
			result = NaN;
			break;
	}
	return result;
};

AppScflTest.util.NumberFormatter.isNumeric = function(obj) {
	return isFinite(AppScflTest.util.NumberFormatter.toNumeric(obj));
};

AppScflTest.util.NumberFormatter.getFormatOptions = function(options, lazy) {
	var formatOptions = {};
	var t = typeof options;
	switch (t) {
		case "number":
			if (lazy) {
				formatOptions.lazyDecimals = options;
			} else {
				formatOptions.decimals = options;
			}
			break;
		case "object":
			if (typeof options.locale === "string") {
				formatOptions.locale = new sap.ui.core.Locale(options.locale);
			} else {
				formatOptions.locale = options.locale;
			}
			formatOptions.decimals = options.decimals;
			formatOptions.rounding = options.rounding;
			formatOptions.lazy = options.lazy;
			formatOptions.lazyDecimals = options.lazyDecimals;
			formatOptions.lazyRounding = options.lazyRounding;
			break;
	}
	if (lazy !== undefined) {
		formatOptions.lazy = lazy;
	}
	if (!formatOptions.locale) {
		if (sap.ui.getCore().getConfiguration().getLanguage() == "ZH") {
			formatOptions.locale = new sap.ui.core.Locale("zh_CN");
		} else {
			formatOptions.locale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
		}
	}
	return formatOptions;
};

AppScflTest.util.NumberFormatter.roundNumber = function(number, options) {
	options = options || {};
	var roundedNumber;
	var fRounding, oDecimals;
	if (options.lazy) {
		fRounding = options.lazyRounding;
		oDecimals = options.lazyDecimals;
	} else {
		fRounding = options.rounding;
		oDecimals = options.decimals;
	}
	if (fRounding) {
		roundedNumber = fRounding(number);
	}
	// WARNING: oDecimals can be 0 => we cannot simply test (oDecimals)
	else if (oDecimals !== undefined) {
		var decimals;
		if (typeof oDecimals === "function") {
			decimals = oDecimals(number);
		} else {
			decimals = oDecimals;
		}
		roundedNumber = number.toFixed(decimals);
	} else {
		roundedNumber = number;
	}
	return roundedNumber;
};

// TODO: handle NaN and Infinity through "symbols-latn-infinity" and
// "symbols-latn-nan" properties
AppScflTest.util.NumberFormatter.formatNumber = function(number, options) {
	var numValue = AppScflTest.util.NumberFormatter.toNumeric(number);
	if (!isFinite(numValue)) {
		return "";
	}
	var formatOptions = AppScflTest.util.NumberFormatter.getFormatOptions(options);
	numValue = AppScflTest.util.NumberFormatter.roundNumber(numValue, formatOptions);
	var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({}, formatOptions.locale);
	return numberFormatter.format(numValue);
};

AppScflTest.util.NumberFormatter.getMagnitude = function(number) {
	// Currently, only supported multiples are { k, M, G, T }
	var _magnitudes = [ {
	    value : 1e3,
	    suffix : "Kilo"
	}, {
	    value : 1e6,
	    suffix : "Mega"
	}, {
	    value : 1e9,
	    suffix : "Giga"
	}, {
	    value : 1e12,
	    suffix : "Tera"
	}, {
	    value : 1e15,
	    suffix : "Peta"
	}, {
	    value : 1e18,
	    suffix : "Exa"
	}, {
	    value : 1e21,
	    suffix : "Zetta"
	}, {
	    value : 1e24,
	    suffix : "Yotta"
	} ];
	var num = (number >= 0 ? number : -number);
	for ( var idx = _magnitudes.length - 1; idx >= 0; --idx) {
		var mag = _magnitudes[idx];
		if (num >= mag.value) {
			return mag;
		}
	}
	return {
	    value : 1,
	    suffix : ""
	};
};

AppScflTest.util.NumberFormatter.lazyRoundNumber = function(number, options) {
	var numValue = AppScflTest.util.NumberFormatter.toNumeric(number);
	if (!isFinite(numValue)) {
		return "";
	}
	var result = "";
	if (Math.abs(numValue) < 1e6) {
		result = AppScflTest.util.NumberFormatter.formatNumber(numValue, options);
	} else {
		var formatOptions = AppScflTest.util.NumberFormatter.getFormatOptions(options, true);
		var shortDecimalFormat = sap.ui.core.LocaleData.getInstance(formatOptions.locale)._get("decimalFormat-short");
		if (!shortDecimalFormat) {
			var sdLocale = new sap.ui.core.Locale("en");
			shortDecimalFormat = sap.ui.core.LocaleData.getInstance(sdLocale)._get("decimalFormat-short");
		}

		var nomatch = true;
		if (shortDecimalFormat) {
			var magnitude = AppScflTest.util.NumberFormatter.getMagnitude(numValue).value;
			if (magnitude > 1e12) {
				magnitude = 1e12;
			}

			formatOptions.lazy = true;
			if (formatOptions.lazyDecimals === undefined) {
				formatOptions.lazyDecimals = 1;
			}

			var roundedValue = AppScflTest.util.NumberFormatter.roundNumber(numValue / magnitude, formatOptions);

			if ((magnitude < 1e12) && (Math.abs(roundedValue) >= 1000)) {
				// Rounding may induce a change of scale.
				magnitude = AppScflTest.util.NumberFormatter.getMagnitude(roundedValue * magnitude).value;
				roundedValue = AppScflTest.util.NumberFormatter.roundNumber(numValue / magnitude, formatOptions);
			}

			var shortFormat = shortDecimalFormat[magnitude.toString()];
			if (shortFormat) {
				result = AppScflTest.util.NumberFormatter.formatNumber(roundedValue, formatOptions);
				var suffix = shortFormat.substring(shortFormat.lastIndexOf("0") + 1);
				suffix = suffix.replace(/'.'/g, ".");
				result += suffix;
				nomatch = false;
			}
		}
		if (nomatch) {
			result = AppScflTest.util.NumberFormatter.formatNumber(numValue, options);
		}
	}
	return result;
};



