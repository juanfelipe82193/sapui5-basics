/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides the base implementation for all model implementations
sap.ui.define([
	'sap/ui/model/SimpleType',
	'sap/ui/model/FormatException',
	'sap/ui/model/ParseException',
	'sap/ui/model/ValidateException',
	'sap/ui/model/type/String',
	'sap/ui/mdc/library',
	'sap/ui/mdc/condition/FilterOperatorUtil',
	'sap/ui/mdc/condition/Condition',
	'sap/ui/mdc/util/BaseType',
	'sap/base/util/merge'
],
	function(
		SimpleType,
		FormatException,
		ParseException,
		ValidateException,
		StringType,
		library,
		FilterOperatorUtil,
		Condition,
		BaseType,
		merge
		) {
	"use strict";

	var FieldDisplay = library.FieldDisplay;

	/**
	 * Constructor for a Condition type.
	 *
	 * @class
	 * This class represents condition types.
	 *
	 * @extends sap.ui.model.SimpleType
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @private
	 * @param {object} [oFormatOptions] formatting options.
	 * @param {sap.ui.model.Type} [oFormatOptions.valueType] Type of the value of the condition (used for formatting and parsing)
	 * @param {string[]} [oFormatOptions.operators] possible operators to be used in the condition
	 * @param {string} [oFormatOptions.display] DisplayFormat
	 * @param {string} [oFormatOptions.fieldHelpID] FieldHelp to determine key and description // TODO: async request????
	 * @param {boolean} [oFormatOptions.hideOperator] If set only the value of the condition is shown, no operator //TODO
	 * @param {int} [oFormatOptions.maxConditions] Maximal allowed conditions
	 * @param {object} [oFormatOptions.bindingContext] bindingContext of field. Used to get key or description from value help using in/out-parametes. (In table value help might be connected to different row)
	 * @param {sap.ui.model.Type} [oFormatOptions.originalDateType] Type used on field. E.g. for date types internally an other type is used to have different formatOptions
	 * @param {boolean} [oFormatOptions.isUnit] If set the type is used for the unit part of a field
	 * @param {function} [oFormatOptions.getConditions] Function to get the existing conditions of the field. only used it isUnit is set. TODO: better solution
	 * @param {function} [oFormatOptions.asyncParsing] Callback-function to tell the Field the parsing is asynchronously.
	 * @param {object} [oFormatOptions.navigateCondition] Condition of keyboard navigation. If this is filled no real parsing is needed as the condition is already determined. Just return it
	 * @param {object} [oFormatOptions.delegate] Field delegate to handle model specific logic
	 * @param {object} [oConstraints] value constraints.
	 * @alias sap.ui.mdc.field.ConditionType
	 * @since 1.62.0
	 */
	var ConditionType = SimpleType.extend("sap.ui.mdc.field.ConditionType", /** @lends sap.ui.mdc.field.ConditionType.prototype */ {

		constructor : function (oFormatOptions, oConstraints) {
			SimpleType.apply(this, arguments);
			this.sName = "Condition";
			this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
		}

	});

	ConditionType.prototype.destroy = function() {

		SimpleType.prototype.destroy.apply(this, arguments);

		if (this._oDefaultType) {
			this._oDefaultType.destroy();
			delete this._oDefaultType;
		}

		this._bDestroyed = true;

	};

	ConditionType.prototype.formatValue = function(oCondition, sInternalType) {

		if (oCondition == undefined || oCondition == null || this._bDestroyed) { // if destroyed do nothing
			return null;
		}

		if (typeof oCondition !== "object" || !oCondition.operator || !oCondition.values ||
				!Array.isArray(oCondition.values)) {
			throw new FormatException("No valid condition provided");
		}

		if (!sInternalType) {
			sInternalType = "string";
		}

		var oType = _getValueType.call(this);
		var oOriginalDateType = _getOriginalDateType.call(this);
		var aOperators = _getOperators.call(this);
		var bIsUnit = this.oFormatOptions.isUnit;

		_attachCurrentValueAtType.call(this, oCondition, oOriginalDateType); // use original condition

		if (bIsUnit) {
			// only use unit in condition
			oCondition = merge({}, oCondition);
			if (oCondition.values[0] && Array.isArray(oCondition.values[0])) {
				oCondition.values[0] = oCondition.values[0][1];
			}
			if (oCondition.operator !== "EQ" && oCondition.operator !== "EEQ") {
				// in the moment only single value supported
				oCondition.operator = "EQ";
				if (oCondition.values[1]) {
					oCondition.values.splice(1,1);
				}
			}
		}

		_attachCurrentValueAtType.call(this, oCondition, oType);

		switch (this.getPrimitiveType(sInternalType)) {
			case "string":
			case "any":
				if (oCondition.operator === "EQ" && (FilterOperatorUtil.onlyEEQ(aOperators) || _getBaseType.call(this, oType) === "boolean")) {
					// use EEQ to display description
					oCondition = merge({}, oCondition); // do not manipulate original object
					oCondition.operator = "EEQ";
				}

				var sDisplay = _getDisplay.call(this);
				var oFieldHelp = _getFieldHelp.call(this);

				if (oCondition.operator === "EEQ" && sDisplay !== FieldDisplay.Value && !oCondition.values[1] && oFieldHelp) {
					// handle sync case and async case similar
					var fnError = function(oException) {
						if (oException instanceof FormatException && !oFieldHelp.getValidateInput()) {
							// if "invalid" input is allowed don't fire an exception
							return oCondition;
						} else {
							throw oException;
						}
					};

					var fnSuccess = function(vDescription) {
						// if FieldHelp returns no or empty condition but throws no error just go ahead
						oCondition = merge({}, oCondition); // do not manipulate original object
						if (vDescription && typeof vDescription === "object") {
							oCondition = _mapResultToCondition.call(this, oCondition, vDescription);
						} else if (oCondition.values.length === 1) {
							oCondition.values.push(vDescription);
						} else {
							oCondition.values[1] = vDescription;
						}
						return oCondition;
					};

					var oBindingContext = this.oFormatOptions.bindingContext;
					var vDescription;

					try {
						vDescription = oFieldHelp.getTextForKey(oCondition.values[0], oCondition.inParameters, oCondition.outParameters, oBindingContext);
					} catch (oException) {
						return fnError.call(this, oException);
					}
					if (vDescription instanceof Promise) {
						// description needs to be requested -> return if it is resolved
						return vDescription.then(function(vDescription) {
							oCondition = fnSuccess.call(this, vDescription);
							return _formatToString.call(this, oCondition);
						}.bind(this)).catch(function(oException) {
							oCondition = fnError.call(this, oException);
							return _formatToString.call(this, oCondition);
						}.bind(this));
					} else {
						oCondition = fnSuccess.call(this, vDescription);
					}
				}

				return _formatToString.call(this, oCondition);
			default:
				// operators can only be formatted to string. But other controls (like Slider) might just use the value
				if (oType && oCondition.values.length >= 1) {
					return oType.formatValue(oCondition.values[0], sInternalType);
				}

				throw new FormatException("Don't know how to format Condition to " + sInternalType);
		}

	};

	function _formatToString(oCondition) {

		var sDisplay = _getDisplay.call(this);
		var oType = _getValueType.call(this);

		if (this.oFormatOptions.hideOperator && oCondition.values.length >= 1) {
			return oType.formatValue(oCondition.values[0], "string");
		}

		var oOperator = FilterOperatorUtil.getOperator(oCondition.operator);
		return oOperator.format(oCondition.values, oCondition, oType, sDisplay);

	}

	ConditionType.prototype.parseValue = function(vValue, sInternalType) {

		if (this._bDestroyed) { // if destroyed do nothing
			return null;
		}

		if (!sInternalType) {
			sInternalType = "string";
		} else if (sInternalType === "any" && typeof vValue === "string") {
			sInternalType = "string";
		}

		var oNavigateCondition = this.oFormatOptions.navigateCondition;
		if (oNavigateCondition) {
			// condition already known from navigation. Just check if it is really the same as the input.
			var vOutput = this.formatValue(oNavigateCondition, sInternalType);
			if (vOutput === vValue) {
				return merge({}, oNavigateCondition); // use copy
			}
		}

		var sDisplay = _getDisplay.call(this);
		var oFieldHelp = _getFieldHelp.call(this);
		var oType = _getValueType.call(this);
		var oOriginalDateType = _getOriginalDateType.call(this);
		var aOperators = _getOperators.call(this);
		var bIsUnit = this.oFormatOptions.isUnit;
		var sDefaultOperator;

		if (vValue === null || vValue === undefined || (vValue === "" && !oFieldHelp)) { // check if "" is a key in FieldHelp
			if (!_isCompositeType.call(this, oType) && !bIsUnit) {
				return null; // TODO: for all types???
			}
		}

		_initCurrentValueAtType.call(this, oType);
		_initCurrentValueAtType.call(this, oOriginalDateType);

		switch (this.getPrimitiveType(sInternalType)) {
			case "string":
				var sValue = vValue;
				var oOperator;
				var bCheckForDefault = false;

				if (FilterOperatorUtil.onlyEEQ(aOperators)) {
					oOperator = FilterOperatorUtil.getEEQOperator();

					if (!oOperator.test(vValue, oType)) {
						sValue = "==" + vValue; // TODO better way to parse
					}
				} else {
					var aMatchingOperators = FilterOperatorUtil.getMatchingOperators(aOperators, sValue);

					// use default operator if nothing found
					if (aMatchingOperators.length === 0) {
						if (oFieldHelp && !_isCompositeType.call(this, oType)) {
							// try first to use EEQ and find it in FieldHelp. If not found try later with default operator
							oOperator = FilterOperatorUtil.getEEQOperator();

							if (!oOperator.test(vValue, oType)) {
								sValue = "==" + vValue; // TODO better way to parse
							}
							bCheckForDefault = true;
						} else {
							// use default operation
							oOperator = FilterOperatorUtil.getDefaultOperator(_getBaseType.call(this, oType));
							sValue = oOperator ? oOperator.format([vValue]) : vValue;
						}
					} else {
						oOperator = aMatchingOperators[0]; // TODO: multiple matches?
					}
				}

				if (oOperator) {
					var oCondition;
					try {
						oCondition = oOperator.getCondition(sValue, oType, sDisplay);
					} catch (oException) {
						if (oException instanceof ParseException && oOriginalDateType) {
							// As internal yyyy-MM-dd is used as pattern for dates (times similar) the
							// parse exception might contain this as pattern. The user should see the pattern thats shown
							// So try to parse date with the original type to get parseException with right pattern.
							oOriginalDateType.parseValue(vValue, "string", oOriginalDateType._aCurrentValue);
						}
						throw oException;
					}

					if (!oCondition) {
						throw new ParseException("Cannot parse value " + vValue); // use original value in message
					}

					// TODO better logic
					if (!_isCompositeType.call(this, oType)) {
						if (oOperator.name === "EEQ" && oFieldHelp) {
							if (oCondition.values[0] !== null && oCondition.values[0] !== undefined) {
								// as description can be wrong, get it always
								oCondition = _parseDetermineDescription.call(this, oCondition, oType, oFieldHelp, bCheckForDefault, aOperators, vValue, sDisplay);
								if (oCondition instanceof Promise) {
									return _fnReturnPromise.call(this, oCondition);
								}
							} else if (oCondition.values[1] !== null && oCondition.values[1] !== undefined) {
								// only description entered -> determine key
								oCondition = _parseDetermineKey.call(this, oCondition, oType, oFieldHelp, true, bCheckForDefault, aOperators, vValue, sDisplay);
								if (oCondition instanceof Promise) {
									return _fnReturnPromise.call(this, oCondition);
								}
							} else if (vValue === "") {
								// empty value entered and no value help used for check -> no condition
								oCondition = null;
							}
						} else if (vValue === "") {
							// empty value entered and no value help exist -> no condition
							oCondition = null;
						}
					}

					return _finishParseFromString.call(this, oCondition, oType);
				}

				throw new ParseException("Cannot parse value " + vValue); // use original value in message

			default:
				// operators can only be formatted from string. But other controls (like Slider) might just use the value
				if (oType) {
					// TODO: other operator?
					if (FilterOperatorUtil.onlyEEQ(aOperators)) {
						sDefaultOperator = "EEQ";
					} else {
						sDefaultOperator = FilterOperatorUtil.getDefaultOperator(_getBaseType.call(this, oType)).name;
					}
					return Condition.createCondition(sDefaultOperator, [oType.parseValue(vValue, sInternalType)]);
				}
				throw new ParseException("Don't know how to parse Condition from " + sInternalType);
		}

	};

	function _finishParseFromString(oCondition, oType) {

		var bIsUnit = this.oFormatOptions.isUnit;
		var oOriginalDateType = _getOriginalDateType.call(this);
		var sUnit = null; // default for empty unit

		if (bIsUnit) {
			var vMeasure;
			if (oOriginalDateType._aCurrentValue) {
				vMeasure = oOriginalDateType._aCurrentValue[0];
			}

			if (oCondition) {
				if (oCondition.operator !== "EEQ" && oCondition.operator !== "EQ") {
					throw new ParseException("unsupported operator");
				}
				sUnit = oCondition.values[0]; // use key of unit
				oCondition.values = [[vMeasure, sUnit], undefined];
			} else {
				// create a condition if no unit is entered
				oCondition = Condition.createCondition("EEQ", [[vMeasure, null], undefined]);
			}
			_attachCurrentValueAtType.call(this, oCondition, oOriginalDateType);
		} else if (oCondition) {
			var sName = oType.getMetadata().getName();
			var oDelegate = this.oFormatOptions.delegate;
			var oPayload = this.oFormatOptions.payload;
			if (oDelegate && oDelegate.getBaseType(oPayload, sName) === BaseType.Unit &&
					!oCondition.values[0][1] && oType._aCurrentValue) {
				// TODO: if no unit provided use last one
				sUnit = oType._aCurrentValue[1] ? oType._aCurrentValue[1] : null; // if no unit set null
				oCondition.values[0][1] = sUnit;
				if (oCondition.operator === "BT") {
					oCondition.values[1][1] = sUnit;
				}
			}

			_attachCurrentValueAtType.call(this, oCondition, oType);
			_attachCurrentValueAtType.call(this, oCondition, oOriginalDateType);
		}

		return oCondition;

	}

	function _parseDetermineDescription(oCondition, oType, oFieldHelp, bCheckForDefault, aOperators, vValue, sDisplay) {

		var vDescription;

		// handle sync case and async case similar
		var fnError = function(oException) {
			if (oException && !(oException instanceof ParseException) && !(oException instanceof FormatException) && !(oException instanceof ValidateException)) {// FormatException could also occur
				// unknown error -> just raise it
				throw oException;
			}
			if (sDisplay === FieldDisplay.Value) {
				if (bCheckForDefault) {
					return _parseUseDefaultOperator.call(this, oType, aOperators, vValue, sDisplay);
				} else if (!oFieldHelp.getValidateInput()) {
					return _returnUserInput.call(this, oType, aOperators, vValue, sDisplay);
				} else {
					throw new ParseException(oException.message); // to have ParseException
				}
			} else {
				// Maybe Description entered -> try to determine key
				oCondition.values[1] = oCondition.values[0];
				oCondition.values[0] = null;
				return _parseDetermineKey.call(this, oCondition, oType, oFieldHelp, false, bCheckForDefault, aOperators, vValue, sDisplay);
			}
		};

		var fnSuccess = function(vDescription) {
			if (vDescription) {
				if (typeof vDescription === "object") {
					oCondition = _mapResultToCondition.call(this, oCondition, vDescription);
				} else {
					oCondition.values[1] = vDescription;
				}
			} else {
				if (vValue === "") {
					// no empty key -> no condition
					oCondition = null;
				} else {
					// FieldHelp might not fire an exception if nothing found -> but handle this as error
					oCondition = fnError.call(this, new ParseException(this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST", [vValue])));// use original value in message
				}
			}
			return oCondition;
		};

		// validate key. Check only if it fits to type -> otherwise it could not be a valid key
		try {
			oType.validateValue(oCondition.values[0]);
			// as description can be wrong, get it always
			var oBindingContext = this.oFormatOptions.bindingContext;
			vDescription = oFieldHelp.getTextForKey(oCondition.values[0], undefined, undefined, oBindingContext);
		} catch (oException) {
			return fnError.call(this, oException);
		}

		if (vDescription instanceof Promise) {
			// description needs to be requested -> return if it is resolved
			return vDescription.then(function(vDescription) {
				oCondition = fnSuccess.call(this, vDescription);
				return _finishParseFromString.call(this, oCondition, oType);
			}.bind(this)).catch(function(oException) {
				oCondition = fnError.call(this, oException);
				return _finishParseFromString.call(this, oCondition, oType);
			}.bind(this));
		} else {
			return fnSuccess.call(this, vDescription);
		}

	}

	function _parseDetermineKey(oCondition, oType, oFieldHelp, bCheckDescription, bCheckForDefault, aOperators, vValue, sDisplay) {

		// description entered -> determine key

		if (oCondition.values[1] === "") {
			// nothing entered -> directly check for empty key
			return _parseNoKeyFound.call(this, oCondition, oType, oFieldHelp, bCheckDescription, bCheckForDefault, aOperators, vValue, sDisplay, undefined);
		}

		// handle sync case and async case similar
		var fnError = function(oException) {
			if (oException && !(oException instanceof ParseException) && !(oException instanceof FormatException)) { // FormatException could also occur
				// unknown error -> just raise it
				throw oException;
			}
			// only try to find description if nothing is found. If more than one key is found fire exception
			if (oException._bNotUnique) { // TODO: better solution?
				if (!oFieldHelp.getValidateInput()) {
					return _returnUserInput.call(this, oType, aOperators, vValue, sDisplay);
				} else {
					throw oException;
				}
			} else {
				return _parseNoKeyFound.call(this, oCondition, oType, oFieldHelp, bCheckDescription, bCheckForDefault, aOperators, vValue, sDisplay, oException);
			}
		};

		var fnSuccess = function(vKey) {
			if (vKey === null || vKey === undefined) {
				// no key found (FieldHelp might not fire an exception in this case)
				return _parseNoKeyFound.call(this, oCondition, oType, oFieldHelp, bCheckDescription, bCheckForDefault, aOperators, vValue, sDisplay, undefined);
			}
			if (vKey && typeof vKey === "object") {
				oCondition = _mapResultToCondition.call(this, oCondition, vKey);
			} else {
				oCondition.values[0] = vKey;
			}
			return oCondition;
		};

		var oBindingContext = this.oFormatOptions.bindingContext;
		var vKey;
		try {
			vKey = oFieldHelp.getKeyForText(oCondition.values[1], oBindingContext);
		} catch (oException) {
			return fnError.call(this, oException);
		}

		if (vKey instanceof Promise) {
			// key needs to be requested -> return if it is resolved
			return vKey.then(function(vKey) {
				oCondition = fnSuccess.call(this, vKey);
				return bCheckDescription ? _finishParseFromString.call(this, oCondition, oType) : oCondition; // if called from _parseDetermineDescription _finishParseFromString is called there
			}.bind(this)).catch(function(oException) {
				oCondition = fnError.call(this, oException);
				return bCheckDescription ? _finishParseFromString.call(this, oCondition, oType) : oCondition; // if called from _parseDetermineDescription _finishParseFromString is called there
			}.bind(this));
		} else {
			return fnSuccess.call(this, vKey);
		}

	}

	function _parseNoKeyFound(oCondition, oType, oFieldHelp, bCheckDescription, bCheckForDefault, aOperators, vValue, sDisplay, oException) {

		var vDescription = null;

		// handle sync case and async case similar
		var fnError = function(oException) {
			if (oException && !(oException instanceof ParseException) && !(oException instanceof FormatException)) { // FormatException could also occur
				// unknown error -> just raise it
				throw oException;
			}
			oCondition.values[1] = null;
			if (bCheckForDefault) {
				return _parseUseDefaultOperator.call(this, oType, aOperators, vValue, sDisplay);
			} else if (!oFieldHelp.getValidateInput()) {
				return _returnUserInput.call(this, oType, aOperators, vValue, sDisplay);
			}
			throw new ParseException(oException.message); // to have ParseException
		};

		var fnSuccess = function(vDescription) {
			if (vDescription) {
				if (typeof vDescription === "object") {
					oCondition = _mapResultToCondition.call(this, oCondition, vDescription);
				} else {
					oCondition.values[1] = vDescription;
				}
			} else {
				if (vValue === "") {
					// no empty key -> no condition
					oCondition = null;
				} else {
					// FieldHelp might not fire an exception if nothing found -> but handle this as error
					oCondition = fnError.call(this, oException || new ParseException(this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST", [vValue])));// use original value in message
				}
			}
			return oCondition;
		};

		// parse and validate description into key. Check only if it fits to type -> otherwise it could not be a valid key
		try {
			oCondition.values[0] = oType.parseValue(oCondition.values[1], "string");
			oType.validateValue(oCondition.values[0]);
		} catch (oMyException) {
			//invalid key
			bCheckDescription = false;
		}

		if (bCheckDescription) {
			// Maybe key is entered -> get Description
			var oBindingContext = this.oFormatOptions.bindingContext;

			try {
				vDescription = oFieldHelp.getTextForKey(oCondition.values[0], undefined, undefined, oBindingContext);
			} catch (oMyException) {
				return fnError.call(this, oMyException);
			}

			if (vDescription instanceof Promise) {
				// description needs to be requested -> return if it is resolved
				return vDescription.then(function(vDescription) {
					return fnSuccess.call(this, vDescription);
				}.bind(this)).catch(function(oException) {
					return fnError.call(this, oException);
				}.bind(this));
			}
		} else if (oException) {
			// error occurred before and no key check
			return fnError.call(this, oException);
		}

		return fnSuccess.call(this, vDescription);

	}

	function _parseUseDefaultOperator(oType, aOperators, vValue, sDisplay) {

		var oOperator = FilterOperatorUtil.getDefaultOperator(_getBaseType.call(this, oType));
		var sValue = oOperator ? oOperator.format([vValue]) : vValue;
		var oCondition = oOperator.getCondition(sValue, oType, sDisplay);

		return oCondition;

	}

	function _returnUserInput(oType, aOperators, vValue, sDisplay) {

		// Field accepts values that are not found -> must be checked by caller
		// if user input fits to the type, let the caller validate it
		var sOperator;
		if (FilterOperatorUtil.onlyEEQ(aOperators)) {
			sOperator = "EEQ";
		} else {
			// use EQ operator as EEQ is only for values from help.
			if (vValue.startsWith("==")) {
				sOperator = "EEQ";
				vValue = vValue.slice(2);
			} else if (vValue.startsWith("=")) {
				sOperator = "EQ";
				vValue = vValue.slice(1);
			}
		}
		var sValue = oType.parseValue(vValue, "string");
		var oCondition = Condition.createCondition(sOperator, [sValue]);
		return oCondition;

	}

	ConditionType.prototype.validateValue = function(oCondition) {

		var oType = _getValueType.call(this);
		var aOperators = _getOperators.call(this);
		var bIsUnit = this.oFormatOptions.isUnit;

		if (oCondition === undefined || this._bDestroyed) { // if destroyed do nothing
			return null;
		} else if (oCondition === null) {
			// check if type allows to be null
			if (FilterOperatorUtil.onlyEEQ(aOperators)) {
				// TODO: also for FilterField case?
				try {
					if (oType._sParsedEmptyString === "") { //TODO: find solution for all types
						// empty string is parsed as empty string, so validate for this
						oType.validateValue("");
					} else {
						oType.validateValue(null);
					}
				} catch (oError) {
					if (oError instanceof ValidateException) {
						throw oError;
					} else {
						//validation breaks with runtime error -> just ignore
						//TODO: is this the right way?
						return null;
					}
				}
			}
			return null;
		}

		if (typeof oCondition !== "object" || !oCondition.operator || !oCondition.values ||
				!Array.isArray(oCondition.values)) {
			throw new ValidateException(this._oResourceBundle.getText("field.VALUE_NOT_VALID"));
		}

		var oOperator = FilterOperatorUtil.getOperator(oCondition.operator, aOperators);

		if (bIsUnit) {
			// only use unit in condition
			oCondition = merge({}, oCondition);
			if (oCondition.values[0] && Array.isArray(oCondition.values[0])) {
				oCondition.values[0] = oCondition.values[0][1];
			}
			oOperator = FilterOperatorUtil.getEEQOperator(); // as only EEQ is allowd for unit
		}

		oOperator.validate(oCondition.values, oType);

	};

	function _getDisplay() {

		var sDisplay = this.oFormatOptions.display;
		if (!sDisplay) {
			sDisplay = FieldDisplay.Value;
		}

		return sDisplay;

	}

	function _getValueType() {

		var oType = this.oFormatOptions.valueType;
		if (!oType) {
			// no type provided -> use string type as default
			if (!this._oDefaultType) {
				this._oDefaultType = new StringType();
			}
			oType = this._oDefaultType;
		}

		return oType;

	}

	function _getOriginalDateType() {

		return this.oFormatOptions.originalDateType;

	}

	function _getOperators() {

		var aOperators = this.oFormatOptions.operators;
		if (!aOperators || aOperators.length === 0) {
			aOperators = FilterOperatorUtil.getOperatorsForType(BaseType.String); // TODO: check for type
		}

		return aOperators;

	}

	function _getFieldHelp() {

		var sID = this.oFormatOptions.fieldHelpID;
		if (sID) {
			return sap.ui.getCore().byId(sID);
		}

		return null;

	}

	function _isCompositeType(oType) {

		return oType && oType.isA("sap.ui.model.CompositeType");

	}

	function _attachCurrentValueAtType(oCondition, oType) {

		if (_isCompositeType.call(this, oType) && oCondition && oCondition.values[0]) {
				oType._aCurrentValue = oCondition.values[0];
		}

	}

	function _initCurrentValueAtType(oType) {

		if (_isCompositeType.call(this, oType) && !oType._aCurrentValue) {
				oType._aCurrentValue = [];
		}

	}

	function _mapResultToCondition(oCondition, oResult) {

		oCondition.values = [oResult.key, oResult.description];

		if (oResult.inParameters) {
			oCondition.inParameters = oResult.inParameters;
		}
		if (oResult.outParameters) {
			oCondition.outParameters = oResult.outParameters;
		}

		return oCondition;

	}

	function _fnReturnPromise(oPromise) {

		if (this.oFormatOptions.asyncParsing) {
			this.oFormatOptions.asyncParsing(oPromise);
		}

		return oPromise;

	}

	function _getBaseType(oType) {

		var sType = oType.getMetadata().getName();
		var oFormatOptions = oType.oFormatOptions;
		var oConstraints = oType.oConstraints;
		var oDelegate = this.oFormatOptions.delegate;
		var oPayload = this.oFormatOptions.payload;
		var sBaseType = oDelegate ? oDelegate.getBaseType(oPayload, sType, oFormatOptions, oConstraints) : BaseType.String;

		if (sBaseType === BaseType.Unit) {
			sBaseType = BaseType.Numeric;
		}

		return sBaseType;

	}

	return ConditionType;

});
