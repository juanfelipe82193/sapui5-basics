/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/base/ManagedObject",
	"sap/m/Token",
	'sap/ui/comp/util/FormatUtil'
],
	function(library, ManagedObject, Token, FormatUtil) {
		"use strict";

		// shortcut for sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation
		var ValueHelpRangeOperation = library.valuehelpdialog.ValueHelpRangeOperation;

		/**
		 * Constructs a class to parse condition values and create token elements inside a MultiInput field
		 *
		 * @constructor
		 * @experimental This module is only for internal/experimental use!
		 * @private
		 * @param {object} sDefaultOperation - default operation for the token parsing
		 * @author Peter Harbusch
		 */
		var TokenParser = function(sDefaultOperation) {
			this._sDefaultOperation = sDefaultOperation;

			this._aKeyFields = [];

			this._mTypeOperations = {
				"default": ["EQ", "BT", "LT", "LE", "GT", "GE", "NE", "NB", "NOTLT", "NOTLE", "NOTGT", "NOTGE"],
				"string": [
					"Empty",
					"ExcludeEmpty",
					"Contains",
					"EQ",
					"BT",
					"StartsWith",
					"EndsWith",
					"LT",
					"LE",
					"GT",
					"GE",
					"NE",
					"NotContains",
					"NotStartsWith",
					"NotEndsWith",
					"NB",
					"NOTLT",
					"NOTLE",
					"NOTGT",
					"NOTGE"
				],
				"date": [
					"Empty",
					"ExcludeEmpty",
					"EQ",
					"BT",
					"LT",
					"LE",
					"GT",
					"GE",
					"NE",
					"NB",
					"NOTLT",
					"NOTLE",
					"NOTGT",
					"NOTGE"
				],
				"time": ["EQ", "BT", "LT", "LE", "GT", "GE", "NE", "NB", "NOTLT", "NOTLE", "NOTGT", "NOTGE"],
				"numeric": ["EQ", "BT", "LT", "LE", "GT", "GE", "NE", "NB", "NOTLT", "NOTLE", "NOTGT", "NOTGE"],
				"numc": [
					"Contains",
					"EQ",
					"BT",
					"EndsWith",
					"LT",
					"LE",
					"GT",
					"GE",
					"NotContains",
					"NE",
					"NB",
					"NotEndsWith",
					"NOTLT",
					"NOTLE",
					"NOTGT",
					"NOTGE"
				],
				"boolean": ["EQ"]
			};

			this._init();
		};

		/**
		 * initialize all operations
		 *
		 * @private
		 */
		TokenParser.prototype._init = function() {
			var sEmptyTokenText = FormatUtil.getFormattedRangeText(ValueHelpRangeOperation.Empty, null, null, false),
				sExcludeEmptyTokenText = FormatUtil.getFormattedRangeText(ValueHelpRangeOperation.Empty, null, null, true),
				sExcludeEmptyTokenRegexp = sExcludeEmptyTokenText.replace("(", "\\(").replace(")", "\\)"),
				parseBT = function(sText) {
					var aValues = this.re.exec(sText),
						sValue1 = aValues[1],
						sValue2 = aValues[2];

					if (aValues) {
						// the regex for the between operator is returning two groups (.+) with the matching value.
						if (sValue1 && sValue1.trim) { sValue1 = sValue1.trim(); }
						if (sValue2 && sValue2.trim) { sValue2 = sValue2.trim(); }
						return [sValue1, sValue2];
					}
					return  [];
				};

			this.createOperation("Empty", sEmptyTokenText, new RegExp("^" + sEmptyTokenText + "$", "i"), sEmptyTokenText, function(sText) {
				return [];
			});
			this.createOperation("BT", "foo...bar", /^([^!].*)\.\.\.(.+)$/, "$0...$1", parseBT);
			this.createOperation("EQ", "=foo", /^\=(.+)$/, "=$0");
			this.createOperation("Contains", "*foo*", /^\*(.+)\*$/, "*$0*");
			this.createOperation("StartsWith", "foo*", /^([^\*!].*)\*$/, "$0*");
			this.createOperation("EndsWith", "*foo", /^\*(.*[^\*])$/, "*$0");
			this.createOperation("LT", "< foo", /^\<([^\=].*)$/, "<$0");
			this.createOperation("LE", "<=foo", /^\<\=(.+)$/, "<=$0");
			this.createOperation("GT", "> foo", /^\>([^\=].*)$/, ">$0");
			this.createOperation("GE", ">=foo", /^>=(.+)$/, ">=$0");

			// Exclude operations
			this.createOperation("ExcludeEmpty", sExcludeEmptyTokenText, new RegExp("^" + sExcludeEmptyTokenRegexp + "$", "i"), sExcludeEmptyTokenText, function(sText) {
				return [];
			}).exclude = true;
			this.createOperation("NB", "!foo...bar", /^![(]?(.+)\.\.\.([^)]+)[)]?$/, "!($0...$1)", parseBT).exclude = true;
			this.createOperation("NE", "!=foo", /^![(]?=(.+?)[)]?$/, "!(=$0)").exclude = true;
			this.createOperation("NotContains", "!*foo*", /^![(]?\*(.+)\*[)]?$/, "!(*$0*)").exclude = true;
			this.createOperation("NotStartsWith", "!foo*", /^![(]?([^\\*].*)\*[)]?$/, "!($0*)").exclude = true;
			this.createOperation("NotEndsWith", "!*foo", /^![(]?\*([^\*)]*)[)]?$/, "!(*$0)").exclude = true;
			this.createOperation("NOTLT", "!<foo", /^![(]?<([^=].*?)[)]?$/, "!(<$0)").exclude = true;
			this.createOperation("NOTLE", "!<=foo", /^![(]?<=(.+?)[)]?$/, "!(<=$0)").exclude = true;
			this.createOperation("NOTGT", "!>foo", /^![(]?>([^=].*?)[)]?$/, "!(>$0)").exclude = true;
			this.createOperation("NOTGE", "!>=foo", /^![(]?>=(.+?)[)]?$/, "!(>=$0)").exclude = true;
		};

		TokenParser.prototype.destroy = function() {
			if (this._oInput) {
				this._oInput.removeValidator(this._validator);
				if (this._aOrgValidators && this._aOrgValidators.length > 0) {
					this._oInput.addValidator(this._aOrgValidators);
				}
				this._oInput = null;
			}
			this._aOrgValidators = null;
			this._aKeyFields = null;
			this._mTypeOperations = null;
		};

		/**
		 * Specifies the default operation for the token parser
		 *
		 * @param {string} sOperationKey - the key of the default operation
		 * @public
		 */
		TokenParser.prototype.setDefaultOperation = function(sOperationKey) {
			this._sDefaultOperation = sOperationKey;
		};

		/**
		 * returns the default operation for the token parser
		 *
		 * @returns {string} the default operation key
		 * @public
		 */
		TokenParser.prototype.getDefaultOperation = function() {
			return this._sDefaultOperation;
		};

		/**
		 * returns the map of all operations
		 *
		 * @returns {map}
		 * @public
		 */
		TokenParser.prototype.getOperations = function() {
			return this._mOperations;
		};

		/**
		 * returns a specific operation
		 *
		 * @param {string} sOperationKey - the key of the operation
		 * @returns {object}
		 * @public
		 */
		TokenParser.prototype.getOperation = function(sOperationKey) {
			return this._mOperations && this._mOperations[sOperationKey];
		};

		/**
		 * returns the KeyField by label
		 *
		 * @param {string} sLabel - the label of the keyfield
		 * @private
		 */
		TokenParser.prototype._getKeyFieldByLabel = function(sLabel) {
			var keyField;
			this._aKeyFields.some(function(oKeyField) {
				if (oKeyField.label.toUpperCase() === sLabel.toUpperCase()) {
					keyField = oKeyField;
				}
			}, this);
			return keyField;
		};

		TokenParser.prototype.addKeyField = function(oKeyField) {
			this._aKeyFields.push(oKeyField);
		};

		TokenParser.prototype.getKeyFields = function() {
			return this._aKeyFields;
		};

		TokenParser.prototype.addTypeOperations = function(sType, aOperations) {
			this._mTypeOperations[sType] = aOperations;
		};

		TokenParser.prototype.removeTypeOperations = function(sType) {
			delete this._mTypeOperations[sType];
		};

		TokenParser.prototype.getTypeOperations = function(sType) {
			return this._mTypeOperations[sType] || this._mTypeOperations["default"];
		};

		/**
		 * create a new operation for the parser
		 *
		 * @param {string} sOperationKey - operation key
		 * @param {string} sExample - shown as  help text in  suggest
		 * @param {RegExp} regEx
		 * @param {string} sTemplate - template for formatter which will be shown as token text
		 * @param {function} [fParse] - parser callback function
		 * @public
		 */
		TokenParser.prototype.createOperation = function(sOperationKey, sExample, regEx, sTemplate, fParse) {
			if (!this._mOperations) {
				this._mOperations = {};
			}

			this._mOperations[sOperationKey] = {
				key: sOperationKey,
				example: sExample,
				re: regEx,
				template: sTemplate,
				exclude: false,
				parser: this,
				match: function(sText, oKeyField) {
					var result = this.re.exec(sText);
					if (result) {
						var aValues = this.parse(sText);
						if (oKeyField) {
							aValues.forEach(function(sValue) {
								if (oKeyField.hasOwnProperty("maxLength") && oKeyField.maxLength >= 0 && sValue.length > oKeyField.maxLength) {
									result = null;
								}
								if (oKeyField.oType) {
									try {
										sValue = oKeyField.oType.parseValue(sValue, "string");
										oKeyField.oType.validateValue(sValue);
									} catch (err) {
										result = null;
									}
								}
							}, this);
						}
					}
					return result;
				},
				parse: fParse || function(sText) {
					var aValues = this.re.exec(sText);
					if (aValues) {
						// regex uses one or two groups (.+) which returns the matching value.
						// most of the operators only use one group and the value of this is returns as aValues[1]. Only the NE operator has two groups and only one is filled.
						var sValue = aValues[1] || aValues[2];
						if (sValue && sValue.trim) {
							sValue = sValue.trim();
						}
						return [sValue];
					}
					return [];
				},
				getFilledTemplate: function(sText, oKeyField) {
					var aValues = this.parse(sText);
					var sValues = [];
					var sTokenText = "";
					for (var i = 0; i < aValues.length; i++) {
						sValues[i] = this.formatValue(aValues[i], false, oKeyField);
					}
					sTokenText = TokenParser._templateReplace(this.template, sValues);
					return sTokenText;
				},
				getConditionData: function(sText, oKeyField) {
					var range = {};
					range.exclude = this.exclude;
					if (this.exclude) {
						range.operation = {
							"ExcludeEmpty": "Empty",
							"NOTLT": "LT",
							"NOTLE": "LE",
							"NOTGT": "GT",
							"NOTGE": "GE",
							"NotContains": "Contains",
							"NotStartsWith": "StartsWith",
							"NotEndsWith": "EndsWith",
							"NB": "BT"
						}[this.key];

						if (!range.operation) {
							range.operation = this.key;
						}
					} else {
						range.operation = this.key;
					}

					var aValues = this.parse(sText);
					for (var i = 0; i < aValues.length; i++) {
						range["value" + (i + 1)] = this.formatValue(aValues[i], true, oKeyField);
					}

					return range;
				},
				formatValue: function(sValue, bParseOnly, oKeyField) {
					if (!oKeyField) {
						return sValue;
					}

					if (oKeyField.hasOwnProperty("maxLength")) {
						if (oKeyField.maxLength >= 0) {
							sValue = sValue.substring(0, oKeyField.maxLength);
						}
					}

					if (oKeyField.displayFormat) {
						if (oKeyField.displayFormat === "UpperCase") {
							sValue = sValue.toUpperCase();
						}
					}

					if (oKeyField.oType) {
						try {
							sValue = oKeyField.oType.parseValue(sValue, "string");
							oKeyField.oType.validateValue(sValue);
						} catch (err) {
							return "ERROR";
						}
						if (!bParseOnly) {
							sValue = oKeyField.oType.formatValue(sValue, "string");
						}
					}

					return sValue;
				}
			};

			return this._mOperations[sOperationKey];
		};

		/**
		 * remove an operation of the parser
		 *
		 * @param {string} sOperationKey - key of the operation which will be removed
		 * @public
		 */
		TokenParser.prototype.removeOperation = function(sOperationKey) {
			delete this._mOperations[sOperationKey];
		};

		/**
		 * remove all operations of the parser
		 *
		 * @public
		 */
		TokenParser.prototype.removeAllOperations = function() {
			var aOperationKeys = Object.keys(this._mOperations);
			aOperationKeys.forEach(function(operationKey) {
				delete this._mOperations[operationKey];
			}, this);
		};

		/**
		 * returns the translated name of the operation
		 *
		 * @param {string} sType - type of the field
		 * @param {object} oOperation
		 * @param {string} sResourceBundle - name of the resource bundle
		 * @returns {string} translated name
		 * @public
		 */
		TokenParser.prototype.getTranslatedText = function(sType, oOperation, sResourceBundle) {
			var sTextKey = oOperation.key;

			sType = sType !== "default" ? "_" + sType.toUpperCase() + "_" : "";

			if (sType === "_STRING_" || sType === "_BOOLEAN_" || sType === "_NUMC_") {
				sType = "";
			}
			if (sType === "_TIME_") {
				sType = "_DATE_";
			}

			if (!sResourceBundle) {
				sResourceBundle = "sap.m";
			}

			sTextKey = "CONDITIONPANEL_OPTION" + sType + sTextKey;
			var sText = sap.ui.getCore().getLibraryResourceBundle(sResourceBundle).getText(sTextKey) || sTextKey;
			if (sText.startsWith("CONDITIONPANEL_OPTION")) {
				// when for the specified type the resource does not exist use the normal string resource text
				sTextKey = "CONDITIONPANEL_OPTION" + oOperation.key;
				sText = sap.ui.getCore().getLibraryResourceBundle(sResourceBundle).getText(sTextKey);
			}

			return sText;
		};

		/**
		 * associates an multiInput control with the token parser. The function is adding a validator to the multiInput and creates tokens when the input is matching to an operation
		 *
		 * @param {control} oInput - multiInput control
		 * @public
		 */
		TokenParser.prototype.associateInput = function(oInput) {
			this._oInput = oInput;

			//get the existing validators. We call this in our new added validator
			this._aOrgValidators = this._oInput._tokenizer ? this._oInput._tokenizer._aTokenValidators.slice() : [];

			this._oInput.removeAllValidators();
			this._oInput.addValidator(this._validator.bind(this));
		};

		TokenParser.prototype._validator = function(args) {
			//queue the validator calls
			if (this._aOrgValidators) {
				var oToken;

				this._aOrgValidators.some(function(fValidator) {
					oToken = fValidator(args);
					return oToken;
				}, this);

				if (oToken) {
					return oToken;
				}
			}

			if (args.text) {
				return this._onValidate(args.text);
			}

			return null;
		};

		/**
		 * fills the template string placeholder $0, $1 with the values from the aValues array and returns a formatted text for the specified condition
		 * @private
		 * @param {string} sTemplate the template which should be filled
		 * @param {string[]} aValues value array for the template placeholder
		 * @returns {string} the filled template text
		 */
		TokenParser._templateReplace = function(sTemplate, aValues) {
			return sTemplate.replace(/\$\d/g, function(sMatch) { return aValues[parseInt(sMatch.substr(1))]; });
		};

		/**
		 * called from the multiInput validator
		 *
		 * @param {string} sText - the entered text which should be parsed and validated
		 * @private
		 */
		TokenParser.prototype._onValidate = function(sText) {
			var oKeyField = this._aKeyFields.length > 0 ? this._aKeyFields[0] : null;

			// Ticket 1780396542
			if (this._oInput._getIsSuggestionPopupOpen && this._oInput._getIsSuggestionPopupOpen() &&
				this._oInput._oSuggestionTable && this._oInput._oSuggestionTable.getSelectedItem()) {
				//avoid the validation handling when the suggest list is open and the user has clicked on a suggest item.
				return null;
			}

			if (oKeyField) {
				var akeyFieldMaches = /^\w+\:\s/.exec(sText);
				if (akeyFieldMaches) {
					var sKeyLabel = akeyFieldMaches[0];
					oKeyField = this._getKeyFieldByLabel(sKeyLabel.slice(0, sKeyLabel.indexOf(":")));
					if (oKeyField) {
						sText = sText.slice(akeyFieldMaches[0].length).trim();
					}
				}
			}

			var type = oKeyField && oKeyField.type || "default";
			var aTypeOperations = this.getTypeOperations(type);

			var fCheck = function(oOperation, sText) {
				if (oOperation.match(sText, oKeyField)) {
					var range = oOperation.getConditionData(sText, oKeyField);
					range.keyField = oKeyField ? oKeyField.key : null;

					//if maxLength is set to 1 we have to ignore the Contains, StartsWith or EndsWith operations
					if (oKeyField.hasOwnProperty("maxLength") && oKeyField.maxLength === 1) {
						if (["Contains", "EndsWith", "StartsWith"].indexOf(oOperation.key) !== -1) {
							return;
						}
					}

					//for numc type the and operation Contains or EndsWith, we remove the leading zeros via the formatValue call
					if (type === "numc") {
						if (["Contains", "EndsWith"].indexOf(oOperation.key) !== -1) {
							range.value1 = oKeyField.oType.formatValue(range.value1, "string");
						}
					}

					var sTokenText = (oKeyField && oKeyField.label && this._aKeyFields.length > 1 ? oKeyField.label + ": " : "") + oOperation.getFilledTemplate(sText, oKeyField);
					sTokenText = ManagedObject.escapeSettingsValue(sTokenText);
					return new Token({ text: sTokenText, tooltip: sTokenText }).data("range", range);
				}
				return null;
			}.bind(this);

			var token;
			if (aTypeOperations.some(function(operationKey) {
					token = fCheck(this._mOperations[operationKey], sText);
					return token;
				}, this)) {
				return token;
			}

			// check for default operation
			//var sDefaultOperation = "EQ";
			if (this._sDefaultOperation && this._mOperations[this._sDefaultOperation]) {
				sText = TokenParser._templateReplace(this._mOperations[this._sDefaultOperation].template, [sText]);
				return fCheck(this._mOperations[this._sDefaultOperation], sText);
			}

			return null;
		};

		return TokenParser;
	}, true);
