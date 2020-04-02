/*
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/model/SimpleType",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/model/odata/type/Boolean",
	"sap/ui/comp/smartfield/type/Double",
	"sap/ui/comp/smartfield/type/DateTime",
	"sap/ui/comp/odata/type/StringDate",
	"sap/ui/comp/odata/type/FiscalDate",
	"sap/ui/comp/smartfield/type/DateTimeOffset",
	"sap/ui/comp/smartfield/type/Decimal",
	"sap/ui/comp/smartfield/type/Int16",
	"sap/ui/comp/smartfield/type/Int32",
	"sap/ui/comp/smartfield/type/Int64",
	"sap/ui/comp/smartfield/type/Byte",
	"sap/ui/comp/smartfield/type/SByte",
	"sap/ui/comp/smartfield/type/String",
	"sap/ui/comp/smartfield/type/TextArrangementString",
	"sap/ui/comp/smartfield/type/TextArrangementGuid",
	"sap/ui/comp/smartfield/type/AbapBool",
	"sap/ui/comp/smartfield/type/Currency",
	"sap/ui/comp/smartfield/type/Time",
	"sap/ui/comp/smartfield/type/Guid",
	"sap/ui/comp/odata/MetadataAnalyser",
	"sap/ui/comp/odata/FiscalMetadata"
], function(
	SimpleType,
	NumberFormat,
	BooleanType,
	DoubleType,
	DateTimeType,
	StringDateType,
	FiscalDateType,
	DateTimeOffsetType,
	DecimalType,
	Int16Type,
	Int32Type,
	Int64Type,
	ByteType,
	SByteType,
	StringType,
	TextArrangementStringType,
	TextArrangementGuidType,
	AbapBoolean,
	CurrencyType,
	TimeType,
	GuidType,
	MetadataAnalyser,
	FiscalMetadata) {
	"use strict";

	/**
	 * Utility class to create OData types based on OData metadata.
	 *
	 * @param {string} oParent The <code>SmartField</code> instance
	 *
	 * @class
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @private
	 * @since 1.28.0
	 * @alias sap.ui.comp.smartfield.ODataTypes
	 */
	var ODataTypes = function(oParent) {
		this._oParent = oParent;
	};

	/**
	 * Returns an instance of a sub-class of <code>sap.ui.model.Type</code> depending on the OData property's EDM type.
	 *
	 * @param {object} oProperty A OData metadata property
	 * @param {object} [mFormatOptions] Formatting options
	 * @param {object} [mConstraints] Constraints options
	 * @param {object} [mSettings] Additional settings
	 * @returns {sap.ui.model.Type} An instance of a sub-class of <code>sap.ui.model.odata.type.ODataType</code>.
	 * @private
	 */
	ODataTypes.prototype.getType = function(oProperty, mFormatOptions, mConstraints, mSettings) {
		mSettings = mSettings || {};
		var oBinding = this._oParent.getBindingInfo("value"),
			oType = oBinding && oBinding.type,

			// if the composite setting is set to true, and the provided type is not a composite type,
			// then convert the simple type to a composite type
			bTypeConversionRequired = mSettings.composite && (oType instanceof SimpleType);

		// create the binding type only if it was not provided externally
		if (oType && !bTypeConversionRequired) {
			return decorateType(oType);
		}

		// select the type by EDM type.
		if (oProperty && oProperty.property && oProperty.property.type) {

			if (!oType) {
				mConstraints = this.getConstraints(oProperty.property, mConstraints);
			}

			switch (oProperty.property.type) {
				case "Edm.Boolean":
					return new BooleanType(mFormatOptions, mConstraints);
				case "Edm.Double":
					return new DoubleType(mFormatOptions, mConstraints);
				case "Edm.Decimal":
				case "Edm.Single":
					return new DecimalType(mFormatOptions, this._getDecimalConstraints(oProperty, mConstraints));
				case "Edm.Int16":
					return new Int16Type(mFormatOptions, mConstraints);
				case "Edm.Int32":
					return new Int32Type(mFormatOptions, mConstraints);
				case "Edm.Int64":
					return new Int64Type(mFormatOptions, mConstraints);
				case "Edm.Byte":
					return new ByteType(mFormatOptions, mConstraints);
				case "Edm.SByte":
					return new SByteType(mFormatOptions, mConstraints);
				case "Edm.DateTimeOffset":
					return new DateTimeOffsetType(mFormatOptions, mConstraints);
				case "Edm.DateTime":
					return new DateTimeType(mFormatOptions, this._getDateTimeConstraints(oProperty, mConstraints));
				case "Edm.String":

					if (this.isCalendarDate(oProperty)) {
						return new StringDateType(mFormatOptions);
					}
					var sFiscalAnotationType = FiscalMetadata.getFiscalAnotationType(oProperty.property);
					if (sFiscalAnotationType) {
						return new FiscalDateType(mFormatOptions, mConstraints, {
							anotationType:  sFiscalAnotationType
						});
					}

					if (!oType) {
						mConstraints = this._getStringConstraints(oProperty);
					}

					if (mSettings.composite) {
						mFormatOptions = Object.assign({}, mFormatOptions, this._getTextArrangementFormatOptions());
						return new TextArrangementStringType(mFormatOptions, mConstraints, this._getTextArrangementOptions(mSettings));
					}

					return new StringType(mFormatOptions, mConstraints);
				case "Edm.Time":
					return new TimeType(mFormatOptions, mConstraints);
				case "Edm.Guid":

					if (mSettings.composite) {
						mFormatOptions = Object.assign({}, mFormatOptions, this._getTextArrangementFormatOptions());
						return new TextArrangementGuidType(mFormatOptions, mConstraints, this._getTextArrangementOptions(mSettings));
					}

					return new GuidType(mFormatOptions, mConstraints);
				default:
					return null;
			}
		}

		return null;
	};

	/**
	 * Decorates the provided data type object <code>oType</code> to support extra validation features specific
	 * to the <code>SmartField</code> control.
	 * For example, when the <code>mandatory</code> and <code>clientSideMandatoryCheck</code> control properties
	 * are set to <code>true</code>, the control should prevent nulled/empty values to be stored in the binding.
	 *
	 * <code>Note:</code> The extra responsibilities are added to the data type object dynamically at run-time
	 * without affecting the behavior of other objects from the same class. (aka. Decorator Pattern).
	 * @param {sap.ui.model.odata.type.ODataType} oType The type to be decorated
	 * @returns {sap.ui.model.odata.type.ODataType} The decorated data type object.
	 * @since 1.62
	 */
	function decorateType(oType) {
		var fnParseValue = oType.parseValue,
			fnDestroy = oType.destroy;

		oType.parseValue = function(sValue, sSourceType) {
			var vParsedValue = fnParseValue.apply(this, arguments);

			if (typeof this.oFieldControl === "function") {
				this.oFieldControl(sValue, sSourceType);
			}

			return vParsedValue;
		};

		oType.destroy = function() {
			fnDestroy.apply(this, arguments);
			this.oFieldControl = null;
		};

		return oType;
	}

	ODataTypes.prototype.getConstraints = function(oProperty, mConstraints) {
		return Object.assign({}, mConstraints, {
			nullable: MetadataAnalyser.isNullable(oProperty)
		});
	};

	/**
	 * Calculates the constraints for <code>Edm.DateTime</code>.
	 *
	 * @param {object} oProperty the definition of a property of an OData entity.
	 * @param {object} mConstraints optional constraints.
	 * @returns {object} the constraints.
	 * @private
	 */
	ODataTypes.prototype._getDateTimeConstraints = function(oProperty, mConstraints) {
		var oConstraints = {}, n;

		if ((oProperty.property["sap:display-format"] === "Date") || this.isCalendarDate(oProperty)) {
			oConstraints = {
				displayFormat: "Date"
			};
		}

		// constraints from control have priority.
		for (n in mConstraints) {
			oConstraints[n] = mConstraints[n];
		}

		return oConstraints;
	};

	/**
	 * Computes the highest possible number of permitted input characters that the user
	 * can enter into the text input field.
	 *
	 * The value can be configured in the <code>maxLength</code> attribute of the Entity
	 * Data Model (EDM) property to which the control's <code>value</code>
	 * property is bound.
	 * Alternatively it can be configured in the <code>SmartField</code> control's
	 * <code>maxLength</code> property.
	 * If both are available, the lowest value of the two is returned.
	 *
	 * @param {object} oProp The EDM property from which to take the <code>maxLength</code>
	 * @param {object} oBind The <code>value</code> binding of the <code>SmartField</code> control
	 * @returns {int} The maximum possible number of permitted input characters that the user can
	 * enter into the text input field. <code>0</code> means the feature is switched off.
	 * @protected
	 */
	ODataTypes.prototype.getMaxLength = function(oProp, oBind) {
		var aVals = [], iVal, iResult = 0;

		// is a max length available from binding.
		if (oBind && oBind.constraints) {

			if (oBind.constraints.maxLength && oBind.constraints.maxLength > -1) {
				aVals.push(oBind.constraints.maxLength);
			}
		}

		// is a max length available from binding type.
		if (oBind && oBind.type && oBind.type.oConstraints) {

			if (oBind.type.oConstraints.maxLength && oBind.type.oConstraints.maxLength > -1) {
				aVals.push(oBind.type.oConstraints.maxLength);
			}
		}

		// is a max length available from oData property.
		if (oProp && oProp.property && oProp.property.maxLength) {
			var iProp = parseInt(oProp.property.maxLength);

			if (iProp > -1) {
				aVals.push(iProp);
			}
		}

		// maxLength available from SmartField control property
		var iField = this._oParent.getMaxLength();

		if (iField > 0) {
			aVals.push(iField);
		}

		// now search for the minimum value larger than 0.
		// no value specified, return 0.
		var len = aVals.length;

		while (len--) {
			iVal = aVals[len];

			if (iVal > 0) {

				if (iResult > 0) {

					if (iVal < iResult) {
						iResult = iVal;
					}
				} else {
					iResult = iVal;
				}
			}
		}

		return iResult;
	};

	/**
	 * Calculates the constraints for a numeric Edm.Type, with optional <code>scale</code> and <code>precision</code> attributes of the OData
	 * property set.
	 *
	 * @param {object} oProperty the definition of a property of an OData entity.
	 * @returns {map} the constraints.
	 * @private
	 */
	ODataTypes.prototype._getDecimalConstraints = function(oProperty, mConstraints) {
		mConstraints = mConstraints || {};

		if (oProperty.property.precision) {
			mConstraints.precision = parseInt(oProperty.property.precision);
		}

		if (oProperty.property.scale) {
			mConstraints.scale = parseInt(oProperty.property.scale);
		}

		return mConstraints;
	};

	ODataTypes.prototype._getTextArrangementFormatOptions = function() {
		return {
			textArrangement: this._oParent.getControlFactory()._getDisplayBehaviourConfiguration()
		};
	};

	/**
	 * Calculates the constraints for a property of type <code>Edm.String</code>.
	 *
	 * @param {object} oProperty the definition of a property of an OData entity
	 * @returns {object} The constraints
	 */
	ODataTypes.prototype._getStringConstraints = function(oProperty, mConstraints) {
		mConstraints = mConstraints || {};
		var oBindingInfo = this._oParent.getBindingInfo("value"),
			iMaxLength = this.getMaxLength(oProperty, oBindingInfo),
			oEquals;

		// get the constrains: equals
		if (oBindingInfo && oBindingInfo.type && oBindingInfo.type.oConstraints) {
			if (oBindingInfo.type.oConstraints.equals) {
				oEquals = oBindingInfo.type.oConstraints.equals;
			}
		}

		// create the return value
		if (iMaxLength > 0 || oEquals) {

			if (iMaxLength > 0) {
				mConstraints.maxLength = iMaxLength;
			}

			if (oEquals) {
				mConstraints.equals = oEquals;
			}
		}

		if (MetadataAnalyser.isDigitSequence(oProperty.property)) {
			mConstraints.isDigitSequence = true;
		}

		return mConstraints;
	};

	ODataTypes.prototype._getTextArrangementOptions = function(oMetadata) {
		var oTextArrangementDelegate = this._oParent.getControlFactory().oTextArrangementDelegate;

		return {
			keyField: oMetadata.keyField,
			descriptionField: oMetadata.descriptionField,
			onBeforeValidateValue: oTextArrangementDelegate.onBeforeValidateValue.bind(oTextArrangementDelegate)
		};
	};

	/**
	 * Calculates the value of the properties <code>@com.sap.vocabularies.Common.v1.IsCalendarDate</code> annotation.
	 *
	 * @param {object} oProperty the property from which to take the <code>@com.sap.vocabularies.Common.v1.IsCalendarDate</code>
	 * annotation.
	 * @returns {boolean} <code>true</code> if the property reflects a calendar date, <code>false</code>
	 * @protected
	 */
	ODataTypes.prototype.isCalendarDate = function(oProperty) {
		var oCalendarDate = oProperty.property["com.sap.vocabularies.Common.v1.IsCalendarDate"];

		if (oCalendarDate && oCalendarDate.Bool) {
			return oCalendarDate.Bool ? oCalendarDate.Bool !== "false" : true;
		}

		return false;
	};

	/**
	 * Gets the formatter function for displaying a unit of measure.
	 *
	 * @param {object} oProperty The definition of a property of an OData entity
	 * @param {object} [mSettings] Additional settings
	 * @param {boolean} [mSettings.currency=false] Indicates whether the formatter actually refers to a currency or just
	 * unit-of-measure
	 * @param {boolean} [mSettings.mask=false] Indicates whether the value returned by the formatter function needs to
	 * be masked. For example, usage as password
	 * @returns {function} Formatter function for displaying a unit of measure
	 * @protected
	 */
	ODataTypes.prototype.getDisplayFormatter = function(oProperty, mSettings) {
		mSettings = mSettings || {};

		if (mSettings.currency) {
			return this.getCurrencyDisplayFormatter(mSettings);
		}

		return this.getUOMDisplayFormatter(oProperty);
	};

	/**
	 * Gets the formatter function for displaying a currency.
	 *
	 * @param {object} [mSettings] Additional settings
	 * @param {boolean} [mSettings.currency=false] Indicates whether the formatter actually refers to a currency or just
	 * unit-of-measure
	 * @param {boolean} [mSettings.mask=false] Indicates whether the value returned by the formatter function needs to
	 * be masked. For example, usage as password
	 * @returns {function} Formatter function for displaying a currency
	 * @protected
	 */
	ODataTypes.prototype.getCurrencyDisplayFormatter = function(mSettings) {
		var oFormat = NumberFormat.getCurrencyInstance({
			showMeasure: false
		});

		return function(oAmount, sCurrency) {
			var sValue,
				iCurrencyDigits,
				iPadding;

			if (!oAmount || !sCurrency || sCurrency === "*") {
				return "";
			}

			if (!mSettings.currency) {
				sValue = oAmount += "\u2008";
				return sValue;
			}

			iCurrencyDigits = oFormat.oLocaleData.getCurrencyDigits(sCurrency);
			sValue = oFormat.format(oAmount, sCurrency);

			if (iCurrencyDigits === 0) {
				sValue += "\u2008";
			}

			iPadding = 3 - iCurrencyDigits;

			if (iPadding) {
				sValue = sValue.padEnd(sValue.length + iPadding, "\u2007");
			} else {
				sValue += "\u2007";
			}

			if (mSettings.mask) {
				return ODataTypes.maskValue(sValue);
			}

			return sValue;
		};
	};

	/**
	 * Returns formatter function for displaying a measure.
	 *
	 * @param {object} oProperty The definition of a property of an OData entity
	 * @returns {function} Formatter function for displaying a unit of measure
	 * @protected
	 */
	ODataTypes.prototype.getUOMDisplayFormatter = function(oProperty) {
		var oFormatOptions = {};

		if (oProperty.scale) {
			oFormatOptions.minFractionDigits = oFormatOptions.maxFractionDigits = parseInt(oProperty.scale);
		}

		if (oProperty.precision) {
			oFormatOptions.precision = parseInt(oProperty.precision);
		}

		var oFormat = NumberFormat.getFloatInstance(oFormatOptions);

		return function(vMeasure, sUnit) {

			if ((vMeasure == null) /* null or undefined */ || !sUnit || (sUnit === "*")) {
				return "";
			}

			if (isNaN(parseFloat(vMeasure))) {
				return vMeasure.toString() + "\u2008";
			}

			return oFormat.format(vMeasure, sUnit) + "\u2008";
		};
	};

	ODataTypes.maskValue = function(sText) {

		if (sText) {
			return sText.replace(new RegExp(".", "igm"), "*");
		}

		return sText;
	};

	/**
	 * Creates a new currency type instance and returns it.
	 *
	 * @param {object} oProperty the OData property to use for constraint calculation, e.g. precision and scale.
	 * @returns {sap.ui.comp.smartfield.type.Currency} A new currency type instance
	 * @protected
	 */
	ODataTypes.prototype.getCurrencyType = function(oProperty) {

		if (oProperty) {
			var oDecimalConstraints = this._getDecimalConstraints(oProperty),
				oConstraints = this.getConstraints(oProperty.property, oDecimalConstraints),
				oFormatOptions = getCurrencyFormatOptions(oConstraints),
				oCurrencyConstraints = getCurrencyConstraints(oDecimalConstraints);

			return new CurrencyType(oFormatOptions, this.getConstraints(oProperty.property, oCurrencyConstraints));
		}

		return null;
	};

	function getCurrencyFormatOptions(oConstraints) {
		var vEmptyString = oConstraints.nullable ? null : 0;

		return {
			showMeasure: false,
			parseAsString: true,
			emptyString: vEmptyString,
			precision: oConstraints.precision
		};
	}

	function getCurrencyConstraints(oConstraints) {
		return {
			precision: oConstraints.precision,
			scale: oConstraints.scale
		};
	}

	/**
	 * Creates a new ABAP Boolean type instance.
	 *
	 * @returns {sap.ui.comp.smartfield.type.AbapBool} The new instance.
	 * @protected
	 */
	ODataTypes.prototype.getAbapBoolean = function() {
		return new AbapBoolean();
	};

	/**
	 * Frees all resources claimed during the life-time of this instance.
	 *
	 * @protected
	 */
	ODataTypes.prototype.destroy = function() {
		this._oParent = null;
	};

	return ODataTypes;
}, true);
