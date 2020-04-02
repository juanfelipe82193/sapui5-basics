/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
*/
sap.ui.define([
		"sap/ui/model/FilterOperator",
		"sap/ui/model/Filter",
		"sap/ui/model/ValidateException",
		"sap/base/Log",
		"sap/base/util/merge",
		"./Operator",
		"sap/ui/mdc/util/BaseType"
	],

	function(
		ModelOperator,
		Filter,
		ValidateException,
		Log,
		merge,
		Operator,
		BaseType
	) {
		"use strict";

		/**
		 *
		 * @class Utilities to handle operators of conditions
		 * @extends sap.ui.base.Object
		 *
		 * @author SAP SE
		 * @version 1.74.0
		 * @since 1.73.0
		 * @alias sap.ui.mdc.condition.FilterOperatorUtil
		 *
		 * @private
		 * @experimental
		 * @sap-restricted
		 */
		var FilterOperatorUtil = function() {};

		FilterOperatorUtil._mOperators = {
			strictEqual: new Operator({
				name: "EEQ",
				showInSuggest: false, // to hide in DefineConditionPanel; TODO: better solution
				filterOperator: ModelOperator.EQ,
				tokenParse: "^==([\\s\\S]*)$", // to allow line breaks
				tokenFormat: "$1 ($0)",
				valueTypes: ["self", null],
				longText: "EEQ",
				displayFormats: {
					DescriptionValue: "$1 ($0)",
					ValueDescription: "$0 ($1)",
					Description: "$1",
					Value: "$0"
				},
				format: function(aValues, oCondition, oType, sDisplayFormat) {
					sDisplayFormat = sDisplayFormat || "DescriptionValue";
					var iCount = this.valueTypes.length;
					var sTokenText = this.displayFormats[sDisplayFormat];

					if (!aValues[1]) {
						sTokenText = this.displayFormats["Value"];
						iCount = 1;
					}

					for (var i = 0; i < iCount; i++) {
						var sReplace, vValue = aValues[i];

						if (vValue === null || vValue === undefined) { // support boolean
							vValue = "";
						}

						if (i == 0 && oType && (typeof oType.formatValue === "function")) {
							// only the first value can be formatted. second value is the description string
							sReplace = oType.formatValue(vValue, "string");
						} else {
							sReplace = vValue;
						}

						sTokenText = sReplace == null ? null : sTokenText.replace(new RegExp("\\$" + i, "g"), sReplace);
					}

					return sTokenText;
				},
				parse: function(sText, oType, sDisplayFormat) {
					sDisplayFormat = sDisplayFormat || "DescriptionValue";
					var aMatch = sText.match(this.tokenParseRegExp);
					var aResult; // might remain undefined - if no match
					if (aMatch) {
						try {
							var sValue = aMatch[1];
							aResult = this.splitText(sValue, sDisplayFormat);

							if (aResult.length > 0) {
								aResult[0] = this._parseValue(aResult[0], oType);
							}
						} catch (err) {
							// Error
							Log.warning(err.message);
							throw err;
						}
					}
					return aResult; // currently returns empty array for operators without values, undefined for no match
				},
				splitText: function(sText, sDisplayFormat) { // TODO: function available only for EEQ operator? - to be reused from field for suggestion
					sDisplayFormat = sDisplayFormat || "DescriptionValue";
					var sTokenText = this.displayFormats[sDisplayFormat];
					var iKeyIndex = sTokenText.indexOf("$0");
					var iDescriptionIndex = sTokenText.indexOf("$1");
					var sKey;
					var sDescription;

					if (iKeyIndex >= 0 && iDescriptionIndex >= 0) {
						// split string
						if (sText.lastIndexOf("(") > 0 && (sText.lastIndexOf(")") === sText.length - 1 || sText.lastIndexOf(")") === -1)) {
							var iEnd = sText.length;
							if (sText[iEnd - 1] === ")") {
								iEnd--;
							}
							var sText1 = sText.substring(0, sText.lastIndexOf("("));
							if (sText1[sText1.length - 1] === " ") {
								sText1 = sText1.substring(0, sText1.length - 1);
							}
							var sText2 = sText.substring(sText.lastIndexOf("(") + 1, iEnd);
							if (iKeyIndex < iDescriptionIndex) {
								sKey = sText1;
								sDescription = sText2;
							} else {
								sKey = sText2;
								sDescription = sText1;
							}
						} else if (iKeyIndex < iDescriptionIndex) {
							sKey = sText;
						} else {
							sDescription = sText;
						}
					} else if (iKeyIndex >= 0) {
						// use as key
						sKey = sText;
					} else {
						// use as description
						sDescription = sText;
					}

					return [sKey, sDescription];
				},
				isEmpty: function(oCondition, oType) {
					var isEmpty = false;
					var v = oCondition.values[0];
					if (v === null || v === undefined || v === "") { // empty has to use the oType information
						isEmpty = true;
					}
					return isEmpty;
				}
			}),
			equal: new Operator({
				name: "EQ",
				filterOperator: ModelOperator.EQ,
				tokenParse: "^=([^=].*)$",
				tokenFormat: "=$0",
				valueTypes: ["self"]
			}),
			between: new Operator({
				name: "BT",
				filterOperator: ModelOperator.BT,
				tokenParse: "^([^!].*)\\.\\.\\.(.+)$", // TODO: does this work?? At least also matches crap like ".....". I guess validation of value types needs to get rid of those.
				tokenFormat: "$0...$1",
				valueTypes: ["self", "self"],
				validate: function(aValues, oType) {
					// in Between 2 Values must be defined
					// TODO: check if one greater than the other?
					if (aValues.length < 2) {
						throw new ValidateException("Between must have two values");
					}
					if (aValues[0] === aValues[1]) {
						throw new ValidateException("Between must have two different values");
					}

					Operator.prototype.validate.apply(this, [aValues, oType]);
				}
			}),
			betweenExclBoundaries: new Operator({
				name: "BTEX",
				filterOperator: ModelOperator.BT,
				tokenParse: "^([^!].*)\\.\\.(.+)$", // TODO: does this work?? At least also matches crap like ".....". I guess validation of value types needs to get rid of those.
				tokenFormat: "$0..$1",
				valueTypes: ["self", "self"],
				getModelFilter: function(oCondition, sFieldPath) {
					return new Filter({ filters: [new Filter(sFieldPath, ModelOperator.GT, oCondition.values[0]),
												  new Filter(sFieldPath, ModelOperator.LT, oCondition.values[1])],
										and: true});
				},
				validate: function(aValues, oType) {
					// in Between 2 Values must be defined
					// TODO: check if one greater than the other?
					if (aValues.length < 2) {
						throw new ValidateException("Between must have two values");
					}
					if (aValues[0] === aValues[1]) {
						throw new ValidateException("Between must have two different values");
					}

					Operator.prototype.validate.apply(this, [aValues, oType]);
				}
			}),
			notBetween: new Operator({
				name: "NOTBT",
				filterOperator: ModelOperator.NB,
				tokenParse: "^!(.+)\\.\\.\\.(.+)$",
				tokenFormat: "!($0...$1)",
				valueTypes: ["self", "self"],
				exclude: true,
				validate: function(aValues, oType) {
					// in Between 2 Values must be defined
					// TODO: check if one greater than the other?
					if (aValues.length < 2) {
						throw new ValidateException("NotBetween must have two values");
					}
					if (aValues[0] === aValues[1]) {
						throw new ValidateException("NotBetween must have two different values");
					}

					Operator.prototype.validate.apply(this, [aValues, oType]);
				}
			}),
			notBetweenExclBoundaries: new Operator({
				name: "NOTBTEX",
				filterOperator: ModelOperator.NB,
				tokenParse: "^!(.+)\\.\\.(.+)$",
				tokenFormat: "!($0..$1)",
				valueTypes: ["self", "self"],
				exclude: true,
				getModelFilter: function(oCondition, sFieldPath) {
					return new Filter({ filters: [new Filter(sFieldPath, ModelOperator.LE, oCondition.values[0]),
												  new Filter(sFieldPath, ModelOperator.GE, oCondition.values[1])],
										and: false});
				},
				validate: function(aValues, oType) {
					// in Between 2 Values must be defined
					// TODO: check if one greater than the other?
					if (aValues.length < 2) {
						throw new ValidateException("NotBetween must have two values");
					}
					if (aValues[0] === aValues[1]) {
						throw new ValidateException("NotBetween must have two different values");
					}

					Operator.prototype.validate.apply(this, [aValues, oType]);
				}
			}),
			lowerThan: new Operator({
				name: "LT",
				filterOperator: ModelOperator.LT,
				tokenParse: "^<([^=].*)$",
				tokenFormat: "<$0",
				valueTypes: ["self"]
			}),
			notLowerThan: new Operator({
				name: "NOTLT",
				filterOperator: ModelOperator.GE,
				tokenParse: "^!<([^=].*)$",
				tokenFormat: "!(<$0)",
				valueTypes: ["self"],
				exclude: true
			}),
			greaterThan: new Operator({
				name: "GT",
				filterOperator: ModelOperator.GT,
				tokenParse: "^>([^=].*)$",
				tokenFormat: ">$0",
				valueTypes: ["self"]
			}),
			notGreaterThan: new Operator({
				name: "NOTGT",
				filterOperator: ModelOperator.LE,
				tokenParse: "^!>([^=].*)$",
				tokenFormat: "!(>$0)",
				valueTypes: ["self"],
				exclude: true
			}),
			lessEqual: new Operator({
				name: "LE",
				filterOperator: ModelOperator.LE,
				tokenParse: "^<=(.+)$",
				tokenFormat: "<=$0",
				valueTypes: ["self"]
			}),
			notLessEqual: new Operator({
				name: "NOTLE",
				filterOperator: ModelOperator.GT,
				tokenParse: "^!<=(.+)$",
				tokenFormat: "!(<=$0)",
				valueTypes: ["self"],
				exclude: true
			}),
			greaterEqual: new Operator({
				name: "GE",
				filterOperator: ModelOperator.GE,
				tokenParse: "^>=(.+)$",
				tokenFormat: ">=$0",
				valueTypes: ["self"]
			}),
			notGreaterEqual: new Operator({
				name: "NOTGE",
				filterOperator: ModelOperator.LT,
				tokenParse: "^!>=(.+)$",
				tokenFormat: "!(>=$0)",
				valueTypes: ["self"],
				exclude: true
			}),
			startsWith: new Operator({
				name: "StartsWith",
				filterOperator: ModelOperator.StartsWith,
				tokenParse: "^([^!\\*]+.*)\\*$",
				tokenFormat: "$0*",
				valueTypes: ["self"]
			}),
			notStartsWith: new Operator({
				name: "NotStartsWith",
				filterOperator: ModelOperator.NotStartsWith,
				tokenParse: "^!([^\\*].*)\\*$",
				tokenFormat: "!($0*)",
				valueTypes: ["self"],
				exclude: true
			}),
			endsWith: new Operator({
				name: "EndsWith",
				filterOperator: ModelOperator.EndsWith,
				tokenParse: "^\\*(.*[^\\*])$",
				tokenFormat: "*$0",
				valueTypes: ["self"]
			}),
			notEndsWith: new Operator({
				name: "NotEndsWith",
				filterOperator: ModelOperator.NotEndsWith,
				tokenParse: "^!\\*(.*[^\\*])$",
				tokenFormat: "!(*$0)",
				valueTypes: ["self"],
				exclude: true
			}),
			contains: new Operator({
				name: "Contains",
				filterOperator: ModelOperator.Contains,
				tokenParse: "^\\*(.*)\\*$",
				tokenFormat: "*$0*",
				valueTypes: ["self"]
			}),
			notContains: new Operator({
				name: "NotContains",
				filterOperator: ModelOperator.NotContains,
				tokenParse: "^!\\*(.*)\\*$",
				tokenFormat: "!(*$0*)",
				valueTypes: ["self"],
				exclude: true
			}),
			notEqual: new Operator({
				name: "NE",
				filterOperator: ModelOperator.NE,
				tokenParse: "^!=(.+)$",
				tokenFormat: "!(=$0)",
				valueTypes: ["self"],
				exclude: true
			}),
			empty: new Operator({
				name: "Empty",
				filterOperator: ModelOperator.EQ,
				tokenParse: "^<#tokenText#>$",
				tokenFormat: "<#tokenText#>",
				valueTypes: [],
				getModelFilter: function(oCondition, sFieldPath, aOperators) {
					var oOperator = FilterOperatorUtil.getOperator(oCondition.operator, aOperators);
					//TODO Type specific handling of empty is missing
					// if (Type == "date") {
					// 	return new Filter({ path: sFieldPath, operator: oOperator.filterOperator, value1: null });
					// } else {
					// 	if (isNullable) {
					// 		return new Filter({ filters: [new Filter(sFieldPath, ModelOperator.EQ, ""),
					// 									  new Filter(sFieldPath, ModelOperator.EQ, null)],
					// 							and: false});
					// 	} else {
							return new Filter({ path: sFieldPath, operator: oOperator.filterOperator, value1: "" });
					// 	}
					// }
				}
			}),
			notEmpty: new Operator({
				name: "NotEmpty",
				filterOperator: ModelOperator.NE,
				tokenParse: "^!<#tokenText#>$",
				tokenFormat: "!(<#tokenText#>)",
				valueTypes: [],
				exclude: true,
				getModelFilter: function(oCondition, sFieldPath, aOperators) {
					var oOperator = FilterOperatorUtil.getOperator(oCondition.operator, aOperators);
					//TODO Type specific handling of empty is missing
					// if (Type == "date") {
					// 	return new Filter({ path: sFieldPath, operator: oOperator.filterOperator, value1: null });
					// } else {
					// 	if (isNullable) {
					// 		return new Filter({ filters: [new Filter(sFieldPath, ModelOperator.EQ, ""),
					// 									  new Filter(sFieldPath, ModelOperator.EQ, null)],
					// 							and: false});
					// 	} else {
						return new Filter({ path: sFieldPath, operator: oOperator.filterOperator, value1: "" });
					// 	}
					// }
				}
			})
		};

		FilterOperatorUtil._mDefaultOpsForType = {}; // defines default operators for types

		/**
		 * Adds an operator to the list of known operators
		 *
		 * @param {sap.ui.mdc.condition.Operator} oOperator operator
		 *
		 * @public
		 */
		FilterOperatorUtil.addOperator = function(oOperator) {

			FilterOperatorUtil._mOperators[oOperator.name] = oOperator; // TODO: use semantic name?

		};

		/**
		 * Adds an operator to the list of known operators
		 *
		 * @param {sap.ui.mdc.util.BaseType} sType basic type
		 * @param {sap.ui.mdc.condition.Operator[]} aOperators operators
		 * @param {sap.ui.mdc.condition.Operator} oDefaultOperator default operator
		 *
		 * @public
		 */
		FilterOperatorUtil.setOperatorsForType = function(sType, aOperators, oDefaultOperator) {

			FilterOperatorUtil._mDefaultOpsForType[sType] = {
					operators: aOperators
			};

			if (oDefaultOperator) {
				FilterOperatorUtil._mDefaultOpsForType[sType].defaultOperator = oDefaultOperator;
			}

		};

		FilterOperatorUtil.setOperatorsForType(
			BaseType.String,
			[
				FilterOperatorUtil._mOperators.strictEqual,

				FilterOperatorUtil._mOperators.contains,
				FilterOperatorUtil._mOperators.equal,
				FilterOperatorUtil._mOperators.between,
				//FilterOperatorUtil._mOperators.betweenExclBoundaries,
				FilterOperatorUtil._mOperators.startsWith,
				FilterOperatorUtil._mOperators.endsWith,
				FilterOperatorUtil._mOperators.empty,
				FilterOperatorUtil._mOperators.lessEqual,
				FilterOperatorUtil._mOperators.lowerThan,
				FilterOperatorUtil._mOperators.greaterEqual,
				FilterOperatorUtil._mOperators.greaterThan,

				FilterOperatorUtil._mOperators.notContains,
				FilterOperatorUtil._mOperators.notEqual,
				FilterOperatorUtil._mOperators.notBetween,
				//FilterOperatorUtil._mOperators.notBetweenExclBoundaries,
				FilterOperatorUtil._mOperators.notStartsWith,
				FilterOperatorUtil._mOperators.notEndsWith,
				FilterOperatorUtil._mOperators.notEmpty,
				FilterOperatorUtil._mOperators.notLessEqual,
				FilterOperatorUtil._mOperators.notLowerThan,
				FilterOperatorUtil._mOperators.notGreaterEqual,
				FilterOperatorUtil._mOperators.notGreaterThan
			],
			FilterOperatorUtil._mOperators.contains
		);
		FilterOperatorUtil.setOperatorsForType(
			BaseType.Date,
			[
				FilterOperatorUtil._mOperators.strictEqual, // TODO: needed or provide option to format without "=" on EQ

				FilterOperatorUtil._mOperators.equal,
				FilterOperatorUtil._mOperators.between,
				FilterOperatorUtil._mOperators.lessEqual,
				FilterOperatorUtil._mOperators.lowerThan,
				FilterOperatorUtil._mOperators.greaterEqual,
				FilterOperatorUtil._mOperators.greaterThan,

				FilterOperatorUtil._mOperators.notEqual,
				FilterOperatorUtil._mOperators.notBetween,
				FilterOperatorUtil._mOperators.notLessEqual,
				FilterOperatorUtil._mOperators.notLowerThan,
				FilterOperatorUtil._mOperators.notGreaterEqual,
				FilterOperatorUtil._mOperators.notGreaterThan
			]
		);
		FilterOperatorUtil.setOperatorsForType(
			BaseType.DateTime,
			[
				FilterOperatorUtil._mOperators.strictEqual, // TODO: needed or provide option to format without "=" on EQ

				FilterOperatorUtil._mOperators.equal,
				FilterOperatorUtil._mOperators.between,
				FilterOperatorUtil._mOperators.lessEqual,
				FilterOperatorUtil._mOperators.lowerThan,
				FilterOperatorUtil._mOperators.greaterEqual,
				FilterOperatorUtil._mOperators.greaterThan,

				FilterOperatorUtil._mOperators.notEqual,
				FilterOperatorUtil._mOperators.notBetween,
				FilterOperatorUtil._mOperators.notLessEqual,
				FilterOperatorUtil._mOperators.notLowerThan,
				FilterOperatorUtil._mOperators.notGreaterEqual,
				FilterOperatorUtil._mOperators.notGreaterThan
			]
		);
		FilterOperatorUtil.setOperatorsForType(
			BaseType.Numeric,
			[
				FilterOperatorUtil._mOperators.strictEqual, // TODO: needed or provide option to format without "=" on EQ

				FilterOperatorUtil._mOperators.equal,
				FilterOperatorUtil._mOperators.between,
				FilterOperatorUtil._mOperators.lessEqual,
				FilterOperatorUtil._mOperators.lowerThan,
				FilterOperatorUtil._mOperators.greaterEqual,
				FilterOperatorUtil._mOperators.greaterThan,

				FilterOperatorUtil._mOperators.notEqual,
				FilterOperatorUtil._mOperators.notBetween,
				FilterOperatorUtil._mOperators.notLessEqual,
				FilterOperatorUtil._mOperators.notLowerThan,
				FilterOperatorUtil._mOperators.notGreaterEqual,
				FilterOperatorUtil._mOperators.notGreaterThan
			]
		);
		FilterOperatorUtil.setOperatorsForType(
			BaseType.Time,
			[
				FilterOperatorUtil._mOperators.strictEqual, // TODO: needed or provide option to format without "=" on EQ

				FilterOperatorUtil._mOperators.equal,
				FilterOperatorUtil._mOperators.between,
				FilterOperatorUtil._mOperators.lessEqual,
				FilterOperatorUtil._mOperators.lowerThan,
				FilterOperatorUtil._mOperators.greaterEqual,
				FilterOperatorUtil._mOperators.greaterThan,

				FilterOperatorUtil._mOperators.notEqual,
				FilterOperatorUtil._mOperators.notBetween,
				FilterOperatorUtil._mOperators.notLessEqual,
				FilterOperatorUtil._mOperators.notLowerThan,
				FilterOperatorUtil._mOperators.notGreaterEqual,
				FilterOperatorUtil._mOperators.notGreaterThan
			]
		);
		FilterOperatorUtil.setOperatorsForType(
			BaseType.Boolean,
			[
				 FilterOperatorUtil._mOperators.equal,
				 FilterOperatorUtil._mOperators.strictEqual, // TODO: needed or provide option to format without "=" on EQ
				 FilterOperatorUtil._mOperators.notEqual
			]
		);

		/**
		 * Returns all available default operators for the given type.
		 *
		 * @param {sap.ui.mdc.util.BaseType} sType basic type
		 * @return {string[]} an array with the supported filter operators
		 *
		 * @public
		 */
		FilterOperatorUtil.getOperatorsForType = function(sType) {

			var aOperators = [];

			for (var i = 0; i < FilterOperatorUtil._mDefaultOpsForType[sType].operators.length; i++) {
				aOperators.push(FilterOperatorUtil._mDefaultOpsForType[sType].operators[i].name);

			}

			return aOperators;

		};

		/**
		 * Returns the default operator for the given base type
		 *
		 * @param {sap.ui.mdc.util.BaseType} sType basic type
		 * @return {sap.ui.mdc.condition.Operator} the default filter operator for the given type
		 *
		 * @public
		 */
		FilterOperatorUtil.getDefaultOperator = function(sType) {

			return FilterOperatorUtil._mDefaultOpsForType[sType].defaultOperator || FilterOperatorUtil._mOperators.equal;

		};


		/**
		 * Returns the possible operators for the given base type and (if given) value.
		 *
		 * @param {string[]} aOperators list of all supported operators
		 * @param {string} [sValue] the value entered so far
		 * @return {sap.ui.mdc.condition.Operator[]} the operator objects suitable to the given input string, considering the given type
		 *
		 * @public
		 */
		FilterOperatorUtil.getMatchingOperators = function(aOperators, sValue) {

			var aMyOperators = [];

			for (var i = 0; i < aOperators.length; i++) {
				var oOperator = this.getOperator(aOperators[i]);
				if (oOperator) {
					aMyOperators.push(oOperator);
				}
			}

			return _getMatchingOperators.call(this, aMyOperators, sValue);

		};


		/**
		 * Returns those of the given operators which match the given value
		 *
		 * @param {sap.ui.mdc.condition.Operator[]} aOperators the operators which should be checked for matching; must be valid for the current type: this function only checks the operator against values
		 * @param {string} sValue the value to check the operators with
		 * @return {sap.ui.mdc.condition.Operator[]} the operator objects suitable to the given input string
		 *
		 * @private
		 */
		function _getMatchingOperators(aOperators, sValue) {
			// TODO: sType will be needed for checking the value content:   "=5" matches the EQ operator, but should only match when type is e.g. number, not for e.g. boolean
			var aResult = [];

			for (var i = 0; i < aOperators.length; i++) {
				var oOperator = aOperators[i];
				if (oOperator && oOperator.test && oOperator.test(sValue)) {
					aResult.push(oOperator);
				}
			}

			return aResult;

		}

		/**
		 * Returns the operator object for the given operator name
		 * @param {string} sOperator the name of the operator
		 * @returns {sap.ui.mdc.condition.Operator} the operator object, or undefined if the operator with the requested name does not exist
		 */
		FilterOperatorUtil.getOperator = function(sOperator) {

			for (var sName in FilterOperatorUtil._mOperators) {
				var oOperator = FilterOperatorUtil._mOperators[sName];
				if ( oOperator.name === sOperator) {
					return oOperator;
				}
			}

			// TODO: Fallback from EEQ to EQ -> clarify if needed or EEQ could be added to dates or Field can handle EQ
			if (sOperator === "EEQ") {
				return FilterOperatorUtil._mOperators.equal;
			}

			// TODO: Fallback from EQ to EEQ -> clarify if Field can handle EQ
			if (sOperator === "EQ") {
				return FilterOperatorUtil._mOperators.strictEqual;
			}

			Log.error("Operator " + sOperator + " not in supported operators.", "FilterOperatorUtil");

			return undefined;

		};

		/**
		 * Returns the EEQ operator object
		 *
		 * needed for Field
		 * @returns {sap.ui.mdc.condition.Operator} the operator object
		 */
		FilterOperatorUtil.getEEQOperator = function() {

			return FilterOperatorUtil._mOperators.strictEqual;

		};

		/**
		 * Checks if only EEQ is supported -> Field case
		 *
		 * @param {string[]} aOperators array with the supported filter operators
		 * @returns {boolean} true if only EEQ is supported
		 */
		FilterOperatorUtil.onlyEEQ = function(aOperators) {

			if (aOperators.length === 1 && aOperators[0] === "EEQ") {
				return true;
			} else {
				return false;
			}

		};

		/**
		 * Checks if conditions are empty
		 *
		 * @param {object[]} aConditions conditions
		 */
		FilterOperatorUtil.checkConditionsEmpty = function(aConditions) {

			if (!Array.isArray(aConditions)) {
				aConditions = [aConditions];
			}

			aConditions.forEach(function(oCondition) {
				var oOperator = this.getOperator(oCondition.operator);
				if (oOperator) {
					oCondition.isEmpty = oOperator.isEmpty(oCondition);
				}
			}.bind(this));

		};

		/**
		 * updates the value range to have the right number of entries
		 *
		 * @param {object[]} aConditions conditions
		 */
		FilterOperatorUtil.updateConditionsValues = function(aConditions) {

			if (!Array.isArray(aConditions)) {
				aConditions = [aConditions];
			}

			aConditions.forEach(function(oCondition) {
				var oOperator = this.getOperator(oCondition.operator);

				//update the values array length
				if (oOperator && oCondition.operator !== "EEQ") {
					while (oCondition.values.length != oOperator.valueTypes.length) {
						if (oCondition.values.length < oOperator.valueTypes.length) {
							oCondition.values.push(null);
						}
						if (oCondition.values.length > oOperator.valueTypes.length) {
							oCondition.values = oCondition.values.slice(0, oCondition.values.length - 1);
						}
					}
				}
			}.bind(this));

		};

		return FilterOperatorUtil;

}, /* bExport= */ true);
