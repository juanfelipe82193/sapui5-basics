/*
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/model/CompositeType",
	"sap/ui/comp/util/FormatUtil",
	"sap/ui/model/ParseException",
	"sap/ui/model/ValidateException",
	"sap/base/util/isPlainObject",
	"sap/base/assert"
], function(
	coreLibrary,
	CompositeType,
	FormatUtil,
	ParseException,
	ValidateException,
	isPlainObject,
	assert
) {
	"use strict";

	var TextArrangement = CompositeType.extend("sap.ui.comp.smartfield.type.TextArrangement", {
		constructor: function(oFormatOptions, oConstraints, oSettings) {
			this.getPrimaryType().call(this, oFormatOptions, oConstraints);
			CompositeType.call(this, oFormatOptions, oConstraints);
			this.init(oFormatOptions, oConstraints, oSettings);
			assert(oSettings.keyField !== undefined, "Missing value for the keyField. - " + this.getName());
			assert(oSettings.descriptionField !== undefined, "Missing value for the descriptionField. - " + this.getName());
		},

		metadata: {
			"abstract": true
		}
	});

	TextArrangement.prototype.init = function(oFormatOptions, oConstraints, oSettings) {
		this.sName = "TextArrangement";
		this.bParseWithValues = true;
		this.async = true;

		var oDefaultFormatOptions = {
			textArrangement: "idOnly"
		};

		var oDefaultSettings = {
			onBeforeValidateValue: function() {}
		};

		this.oSettings = Object.assign(oDefaultSettings, oSettings);
		this.oFormatOptions = Object.assign(oDefaultFormatOptions, oFormatOptions);

		this.fnParser = this.getValidator({
			textArrangement: this.oFormatOptions.textArrangement,
			prefix: "parse"
		});

		this.fnValidator = this.getValidator({
			textArrangement: this.oFormatOptions.textArrangement,
			prefix: "validate"
		});

		this.sDescription = undefined;
	};

	TextArrangement.prototype.parseValue = function(vValue, sSourceType, aCurrentValues) {
		var sTextArrangement = this.oFormatOptions.textArrangement;

		if (vValue === "" || (sTextArrangement === "idOnly")) {
			return this.parseIDOnly(vValue, sSourceType);
		}

		return this.fnParser(vValue, sSourceType, aCurrentValues, this.oFormatOptions, this.oSettings);
	};

	TextArrangement.prototype.parseIDOnly = function(vValue, sSourceType) {
		vValue = this.getPrimaryType().prototype.parseValue.call(this, vValue, sSourceType);
		return [vValue, undefined];
	};

	TextArrangement.prototype.parseIDAndDescription = function(vValue, sSourceType, aCurrentValues, oFormatOptions) {
		var rTextArrangementFormat = /.*\s\(.*\)/i;

		// if the value format is "ID (description)" or "description (ID)"
		if (rTextArrangementFormat.test(vValue)) {
			var rSeparator = /\s\(/gi;

			// raise a parse exception if the delimiter used to separate the ID from the description
			// is duplicated (delimiter collision problem)
			if (vValue.match(rSeparator).length > 1) {
				throw new ParseException(this.getResourceBundleText("SMARTFIELD_NOT_FOUND"));
			}

			var aValues = TextArrangement.splitIDAndDescription(vValue, {
				separator: rSeparator,
				textArrangement: oFormatOptions.textArrangement
			});

			vValue = aValues[0];
			this.sDescription = aValues[1];
		} else {
			this.sDescription = undefined;
		}

		return this.parseIDOnly(vValue, sSourceType);
	};

	TextArrangement.prototype.parseDescriptionOnly = function(vValue, sSourceType, aCurrentValues, oFormatOptions, oSettings) {

		return new Promise(function(fnResolve, fnReject) {

			function handleSuccess(aData) {
				var sID,
					sKeyField = oSettings.keyField,
					sDescriptionField = oSettings.descriptionField;

				// filtering in the text/description field first as the textArrangement format option is set to "descriptionOnly"
				var aIDs = filterValuesByKey(vValue, {
					key: sDescriptionField,
					value: sKeyField,
					data: aData
				});

				var aIDsLength = aIDs.length;

				if (aIDsLength === 1) {
					sID = this.getPrimaryType().prototype.parseValue.call(this, aIDs[0], sSourceType);
					this.sDescription = vValue;
					fnResolve([sID, undefined]);
					return;
				}

				// if no IDs were found in the text/description field, filtering the key field
				if (aIDsLength === 0) {

					aIDs = filterValuesByKey(vValue, {
						key: sKeyField,
						value: sDescriptionField,
						data: aData
					});

					aIDsLength = aIDs.length;
				}

				if (aIDsLength === 0) {
					fnReject(new ValidateException(this.getResourceBundleText("SMARTFIELD_NOT_FOUND")));
					return;
				}

				// duplicate IDs were found
				if (aIDsLength > 1) {
					fnReject(new ValidateException(this.getResourceBundleText("SMARTFIELD_DUPLICATE_VALUES")));
					return;
				}

				sID = this.getPrimaryType().prototype.parseValue.call(this, vValue, sSourceType);
				this.sDescription = aIDs[0];
				fnResolve([sID, undefined]);
			}

			function handleException() {
				fnReject(new ValidateException());
			}

			var oOnBeforeValidateValueSettings = {
				filterFields: this.getFilterFields(),
				success: handleSuccess.bind(this),
				error: handleException
			};

			this.onBeforeValidateValue(vValue, oOnBeforeValidateValueSettings);
		}.bind(this));
	};

	TextArrangement.prototype.validateValue = function(aValues) {
		this.validateIDOnly(aValues);
		var vID = aValues[0];

		// prevent a request to be sent when the ID value is "" (empty)
		if (vID === null) {
			return;
		}

		// prevent a request to be sent when the description is known
		if (this.oFormatOptions.textArrangement === "descriptionOnly") {
			this.validateDescriptionOnly(aValues, this.oSettings);
			return;
		}

		return new Promise(function(fnResolve, fnReject) {

			function handleSuccess(aData) {
				var oSettings = Object.assign({}, this.oSettings, {
					data: aData,
					reject: fnReject
				});

				var bValidValue = this.fnValidator(aValues, oSettings);

				if (bValidValue) {
					fnResolve(aValues);
				}
			}

			function handleException() {
				fnReject(new ValidateException());
			}

			var oOnBeforeValidateValueSettings = {
				filterFields: this.getFilterFields(),
				success: handleSuccess.bind(this),
				error: handleException
			};

			this.onBeforeValidateValue(vID, oOnBeforeValidateValueSettings);
		}.bind(this));
	};

	TextArrangement.prototype.validateIDOnly = function(aValue) {
		this.getPrimaryType().prototype.validateValue.call(this, aValue[0]);
	};

	TextArrangement.prototype.validateIDAndDescription = function(aValues, oSettings) {

		// filter for description given the ID
		var aDescription = filterValuesByKey(aValues[0], {
			key: oSettings.keyField,
			value: oSettings.descriptionField,
			data: oSettings.data
		});

		var fnReject = oSettings.reject;

		// if no description is found
		if (aDescription.length === 0) {
			fnReject(new ValidateException(this.getResourceBundleText("SMARTFIELD_NOT_FOUND")));
			return false;
		}

		// more descriptions were found for the same ID
		if (aDescription.length > 1) {
			fnReject(new ValidateException(this.getResourceBundleText("SMARTFIELD_DUPLICATE_VALUES")));
			return false;
		}

		var sDescription = aDescription[0];

		if ((this.sDescription !== undefined) && (sDescription !== this.sDescription)) {
			fnReject(new ValidateException(this.getResourceBundleText("SMARTFIELD_NOT_FOUND")));
			return false;
		}

		this.sDescription = sDescription;
		return true;
	};

	TextArrangement.prototype.validateDescriptionOnly = function(aValues, oSettings) {};

	TextArrangement.prototype.formatValue = function(aValues, sTargetType) {
		var sKey = this.getPrimaryType().prototype.formatValue.call(this, aValues[0], sTargetType);

		if (sKey === "") {
			return sKey;
		}

		var vDescription = aValues[1];

		// in case the binding path is invalid/empty
		if (isPlainObject(vDescription)) {
			vDescription = "";
		}

		return FormatUtil.getFormattedExpressionFromDisplayBehaviour(this.oFormatOptions.textArrangement, sKey, vDescription);
	};

	TextArrangement.prototype.destroy = function() {
		this.oFormatOptions = null;
		this.oSettings = null;
		this.fnParser = null;
		this.fnValidator = null;
		this.sDescription = "";
	};

	TextArrangement.prototype.getName = function() {
		return "sap.ui.comp.smartfield.type.TextArrangement";
	};

	TextArrangement.prototype.onBeforeValidateValue = function(vValue, mSettings) {
		this.oSettings.onBeforeValidateValue(vValue, mSettings);
	};

	TextArrangement.prototype.getResourceBundleText = function(sKey, aParams) {
		return coreLibrary.getLibraryResourceBundle("sap.ui.comp").getText(sKey, aParams);
	};

	/**
	 * Gets the primary type of this object.
	 *
	 * @returns {sap.ui.model.odata.type.ODataType} The data type used for parsing, validation and formatting
	 * @protected
	 * @abstract
	 */
	TextArrangement.prototype.getPrimaryType = function() {};

	TextArrangement.prototype.getValidator = function(mSettings) {

		switch (mSettings.textArrangement) {

			case "idAndDescription":
			case "descriptionAndId":
				return this[mSettings.prefix + "IDAndDescription"];

			case "descriptionOnly":
				return this[mSettings.prefix + "DescriptionOnly"];

			default:
				return this[mSettings.prefix + "IDOnly"];
		}
	};

	TextArrangement.prototype.getFilterFields = function(vValue) {
		return ["keyField", "descriptionField"];
	};

	function filterValuesByKey(sKey, mSettings) {
		var aValues = [];

		mSettings.data.forEach(function(mData, iIndex, aData) {
			if (mData[mSettings.key] === sKey) {
				aValues.push(mData[mSettings.value]);
			}
		});

		return aValues;
	}

	TextArrangement.splitIDAndDescription = function(vValue, mSettings) {
		var aValues = mSettings.separator.exec(vValue), // note: if the match fails, it returns null
			iIndex = aValues["index"];

		switch (mSettings.textArrangement) {

			case "idAndDescription":
				return [
					vValue.slice(0, iIndex /* index of the first separator */),
					vValue.slice(iIndex /* index of the first separator */ + 2, -1)
				];

			case "descriptionAndId":
				return [
					vValue.slice(iIndex /* index of the first separator */ + 2, -1),
					vValue.slice(0, iIndex /* index of the first separator */)
				];

			default:
				return ["", ""];
		}
	};

	return TextArrangement;
});
