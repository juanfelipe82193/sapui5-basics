/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'sap/ui/mdc/library',
	'sap/ui/base/ManagedObjectObserver',
	'sap/ui/mdc/field/FieldBase',
	'sap/ui/mdc/field/FieldBaseRenderer',
	'sap/ui/mdc/condition/Condition',
	'sap/ui/mdc/condition/FilterOperatorUtil',
	'sap/ui/mdc/util/BaseType',
	'sap/base/util/deepEqual',
	'sap/base/util/merge',
	'sap/ui/model/BindingMode'
], function(
		library,
		ManagedObjectObserver,
		FieldBase,
		FieldBaseRenderer,
		Condition,
		FilterOperatorUtil,
		BaseType,
		deepEqual,
		merge,
		BindingMode
	) {
	"use strict";

	var FieldDisplay = library.FieldDisplay;

	/**
	 * Constructor for a new Field.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A Field can be used to bind its value to data of certain data type. Based on the data type settings, a default
	 * visualization is done by the Field.
	 *
	 * @extends sap.ui.mdc.field.FieldBase
	 * @implements sap.ui.core.IFormContent
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @alias sap.ui.mdc.Field
	 * @author SAP SE
	 * @version 1.74.0
	 * @since 1.54.0
	 *
	 * @private
	 * @experimental
	 */
	var Field = FieldBase.extend("sap.ui.mdc.Field", /* @lends sap.ui.mdc.Field.prototype */ {
		metadata: {
			library: "sap.ui.mdc",
			properties: {
				/**
				 * The value of the field
				 *
				 */
				value: {
					type: "any",
					defaultValue: null
				},

				/**
				 * the additional value of the field.
				 *
				 * Depending on the dataType this could be an description.
				 */
				additionalValue: {
					type: "any",
					defaultValue: null
				}
			},
			events: {
				/**
				 * This event is fired when the value property of the field is changed
				 *
				 * <b>Note</b> This event is only triggered if the used content control has a change event
				 */
				change: {
					parameters: {

						/**
						 * The new <code>value</code> of the <code>control</code>.
						 */
						value: { type: "string" },

						/**
						 * Flag indicates if the entered <code>value</code> is valid.
						 */
						valid: { type: "boolean" },

						/**
						 * Returns a Promise for the change. The Promise will return the value if it is resolved.
						 * If the change event is syncronous the promise is already resolved. But if it is asyncrounous
						 * it will be resolved after the value is updated.
						 *
						 * The Field should be set to busy during the parsing to prevent user input.
						 * As there might to be a whole group needs to be busy this cannot be done automatically.
						 *
						 * @since 1.69.0
						 */
						promise: { type: "Promise" }
					}
				}
			},
			defaultProperty: "value"
		},
		renderer: FieldBaseRenderer
	});

	Field.prototype.init = function() {

		this._vValue = null; // to compare with default values
		this._vAdditionalValue = null;

		FieldBase.prototype.init.apply(this, arguments);

		this.setMaxConditions(1);

		this._oObserver.observe(this, {
			properties: ["value", "additionalValue"]
		});

	};

	Field.prototype.exit = function() {

		FieldBase.prototype.exit.apply(this, arguments);

		if (this._iConditionUpdateTimer) {
			clearTimeout(this._iConditionUpdateTimer);
			delete this._iConditionUpdateTimer;
		}

	};

	Field.prototype.bindProperty = function(sName, oBindingInfo) {

		if (sName === "value" && !oBindingInfo.formatter) { // not if a formatter is used, as this needs to be executed
			oBindingInfo.targetType = "raw"; // provide internal value to inner control
			if (!this._oDataType && oBindingInfo.type) {
				this._oDataType = oBindingInfo.type;
			}
		}

		FieldBase.prototype.bindProperty.apply(this, arguments);

	};

	Field.prototype._handleModelContextChange = function(oEvent) {

		FieldBase.prototype._handleModelContextChange.apply(this, arguments);

		if (!this._oDataType) {
			var oBinding = this.getBinding("value");
			if (oBinding) {
				this._oDataType = oBinding.getType();
			}
		}

	};

	Field.prototype._initDataType = function() {

		FieldBase.prototype._initDataType.apply(this, arguments);

		var oBinding = this.getBinding("value");
		if (oBinding) {
			this._oDataType = oBinding.getType();
		}

	};

	/**
	 * This property must not be set for the <code>Field</code>
	 *
	 * @param {int} iMaxConditions only 1 condition allowed in <code>Field</code>
	 * @returns {sap.ui.mdc.Field} <code>this</code> to allow method chaining.
	 * @private
	 */
	Field.prototype.setMaxConditions = function(iMaxConditions) {

		if (iMaxConditions !== 1) {
			throw new Error("Only one condition allowed for Field " + this);
		}

		return this.setProperty("maxConditions", iMaxConditions, true);

	};

	Field.prototype._observeChanges = function(oChanges) {

		FieldBase.prototype._observeChanges.apply(this, arguments);

		if (oChanges.name === "value") {
			var vValue = _adjustValue.call(this, oChanges.current, oChanges.old);
			if (this._vAdditionalValue !== null && _checkAdditionalValueOneWay.call(this) && !_compareValues.call(this, vValue, this._vValue, true)) {
				// additionalValue is bound OneWay. Value is changed from outside, not from Field user input.
				// -> use model value for additionalValue. (Only use internal additionalValue if set by user input.)
				this._vAdditionalValue = this.getAdditionalValue();
			}
			this._vValue = vValue;
			_initializeType.call(this, oChanges.current);
			_triggerConditionUpdate.call(this);
		}

		if (oChanges.name === "additionalValue") {
			this._vAdditionalValue = oChanges.current;
			_triggerConditionUpdate.call(this);
		}

		if (oChanges.name === "conditions") {
			// keep value/additionalValue and conditions in sync
			// (value must be updated if conditions are changed in async parsing too, so not in change event)
			_updateValue.call(this, oChanges.current);
		}

	};

	function _getValue() {

		// as on update value and additional value are set both, but properties can only be handled one after the other
		// store here to have them independent of the order.
		return this._vValue;

	}

	function _getAdditionalValue() {

		// as on update value and additional value are set both, but properties can only be handled one after the other
		// store here to have them independent of the order.
		return this._vAdditionalValue;

	}

	function _triggerConditionUpdate() {

		if (!this._oDelegate) {
			// wait until delegate is loaded
			this._oDelegatePromise.then(function() {_triggerConditionUpdate.call(this);}.bind(this));
			return;
		}

		if (this.getDisplay() === FieldDisplay.Value) {
			// only value displayed -> no need to wait
			_updateCondition.call(this, _getValue.call(this), _getAdditionalValue.call(this));
		} else if (!this._iConditionUpdateTimer) {
			// call async. to update condition once if value and additionalValue set at same time
			this._iConditionUpdateTimer = setTimeout(function() {
				_updateCondition.call(this, _getValue.call(this), _getAdditionalValue.call(this));
				this._iConditionUpdateTimer = undefined;
			}.bind(this), 0);
		}

	}

	function _updateCondition(vValue, vAdditionalValue) {

		var aConditions = this.getConditions();
		if (this._checkValueInitial(vValue) && !vAdditionalValue) {
			// if empty -> no condition
			if (aConditions.length > 0) {
				this.setConditions([]);
			}
		} else {
			var vOldValue = aConditions[0] && aConditions[0].values[0];
			var sOldAdditionalValue = aConditions[0] && aConditions[0].values[1] ? aConditions[0].values[1] : null; // to compare with default value
			if (!aConditions[0] || aConditions[0].operator !== "EEQ" || !_compareValues.call(this, vOldValue, vValue) ||
					sOldAdditionalValue !== vAdditionalValue) {
				// update conditions only if changed (keep out-parameter)
				var oCondition = Condition.createItemCondition(vValue, vAdditionalValue);
				this.setConditions([oCondition]);
			}
		}

	}

	function _adjustValue(vValue, vOldValue) {

		var sDataType = this._oDataType ? this._oDataType.getMetadata().getName() : this.getDataType(); // as type must not exist now

		if (vValue && vOldValue && (sDataType === "sap.ui.model.odata.type.Unit" || sDataType === "sap.ui.model.odata.type.Currency")
				&& !vValue[2] && vOldValue[2] !== undefined) {
			// if no unit table was provided use the old one.
			// As we cannot be sure that inner control is already rendered and dataType.formatValue was calles with unit table.
			vValue = merge([], vValue); // do not change original array.
			vValue[2] = vOldValue[2];
		}

		return vValue;

	}

	function _compareValues(vValue1, vValue2, bUpdateCheck) {

		var bEqual = vValue1 === vValue2;
		var sDataType = this._oDataType ? this._oDataType.getMetadata().getName() : this.getDataType(); // as type must not exist now

		if (!bEqual && this._oDelegate.getBaseType(this._oPayload, sDataType) === BaseType.Unit && Array.isArray(vValue1) && Array.isArray(vValue2)) {
			// in unit type the unit table is in there setting the value but not after parsing
			// units must be set at least once. so if not set compare too
			var vNumber1 = vValue1[0];
			var vUnit1 = vValue1[1];
			var vCustomUnit1 = vValue1.length >= 3 ? vValue1[2] : null; // if no custom units are given handle it like null
			var vNumber2 = vValue2[0];
			var vUnit2 = vValue2[1];
			var vCustomUnit2 = vValue2.length >= 3 ? vValue2[2] : null; // if no custom units are given handle it like null
			// null and undefined are handled different in Unit type, so don't handle it as equal
			if (vNumber1 === vNumber2 && vUnit1 === vUnit2
					&& (((this._bUnitSet || bUpdateCheck) && (!vCustomUnit1 || !vCustomUnit2)) || deepEqual(vCustomUnit1, vCustomUnit2))) {
				bEqual = true;
			}
			if ((vCustomUnit1 || vCustomUnit2) && !bUpdateCheck) {
				this._bUnitSet = true;
			}
		}

		return bEqual;

	}

	function _initializeType(vValue) {

		if (!this._bTypeInitialized) {
			if (!this._oDelegate) {
				// wait until delegate is loaded
				this._oDelegatePromise.then(function() {_initializeType.call(this, vValue);}.bind(this));
				return;
			}

			var oBinding = this.getBinding("value");
			var oDataType = oBinding && oBinding.getType(); // use type from binding, not internal (might be a different one)
			this._oTypeInitialization = this._oDelegate.initializeTypeFromBinding(this._oPayload, oDataType, vValue);
			this._bTypeInitialized = this._oTypeInitialization.bTypeInitialized;
		}

	}

	Field.prototype._fireChange = function(aConditions, bValid, vWrongValue, oPromise) {

		var vValue;

		if (aConditions) { // even if empty and error is returned, only in async case it is really empty
			if (bValid) {
				vValue = this._getResultForPromise(aConditions);
			} else {
				vValue = vWrongValue;
			}
		}

		this.fireChange({ value: vValue, valid: bValid, promise: oPromise }); // TODO: format value in change event to external format?

	};

	Field.prototype._getResultForPromise = function(aConditions) {

		var vValue;
		if (aConditions.length === 0 && this._oDataType) {
			// parse "" to get type specific initial value
			vValue = this._oDataType.parseValue("", "string", []); // we need the empty array when the type is Unit
		} else if (aConditions.length === 1) {
			vValue = aConditions[0].values[0];
		}

		return vValue;

	};

	function _updateValue(aConditions) {

		if (!this._oDelegate) {
			// wait until delegate is loaded
			this._oDelegatePromise.then(function() {_updateValue.call(this, aConditions);}.bind(this));
			return;
		}

		var vValue = null; // use default of property for empty to avoid updates from null to undefined
		var vAdditionalValue = null; // use default of property for empty to avoid updates from null to undefined
		var vOldValue = this.getValue();
		var vOldAdditionalValue = this.getAdditionalValue();

		if (aConditions.length === 0 && vOldValue === null && vOldAdditionalValue === null) {
			// Field initialized from setter -> cannot have a condition -> no update needed
			return;
		}

		vValue = this._getResultForPromise(aConditions);
		if (aConditions.length === 0 && !vOldAdditionalValue) {
			vAdditionalValue = vOldAdditionalValue; // to not update old initial value
		} else if (aConditions.length === 1 && aConditions[0].values.length > 1) {
			vAdditionalValue = aConditions[0].values[1];
		}

		// save internal as observer is called for each property and so might have the old value in getProperty.
		this._vValue = vValue;
		this._vAdditionalValue = vAdditionalValue;

		if (!_compareValues.call(this, vValue, vOldValue, true)) {
			// to run not in V4 update issues if data not already loaded
			this.setProperty("value", vValue, true);
		}
		if (vAdditionalValue !== vOldAdditionalValue && !_checkAdditionalValueOneWay.call(this)) {
			// to run not in V4 update issues if data not already loaded
			// do not update property in OneWay mode to keep in sync with model
			this.setProperty("additionalValue", vAdditionalValue, true);
		}

	}

	Field.prototype._getOperators = function() {

		return ["EEQ"];

	};

	function _checkAdditionalValueOneWay() {

		var oBinding = this.getBinding("additionalValue");

		if (oBinding && oBinding.getBindingMode() === BindingMode.OneWay) {
			return true;
		}

		return false;

	}
	/**
	 * Sets conditions to the property <code>conditions</code>.
	 *
	 * Do not use the <code>conditions</code> property, use the <code>value</code> property instead.
	 *
	 * @param {object[]} aConditions conditions to be set
	 * @return {sap.ui.mdc.Field} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @name sap.ui.mdc.Field#setConditions
	 * @function
	 */

	/**
	 * Gets conditions of the property <code>conditions</code>.
	 *
	 * Do not use the <code>conditions</code> property, use the <code>value</code> property instead.
	 *
	 * @return {object[]} conditions of the field
	 * @private
	 * @name sap.ui.mdc.Field#getConditions
	 * @function
	 */

	/**
	 * The type of the data handles by the field. this type is used to parse, format and validate the value.
	 *
	 * <b>Note:</b> If the <code>value</code> property is bound to a model using a type this type is used.
	 * In this case the value of the <code>dataType</code> property is ignored
	 *
	 * @param {string} sDataType dataType to be set
	 * @return {sap.ui.mdc.Field} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @name sap.ui.mdc.Field#setDataType
	 * @function
	 */

	/**
	 * The constraints of the type specified in <code>dataType</code>
	 *
	 * <b>Note:</b> If the <code>value</code> property is bound to a model using a type this type is used.
	 * In this case the value of the <code>dataType</code> property and <code>dataTypeConstraints</code> property is ignored
	 *
	 * @param {string} oDataTypeConstraints Constraints to be set
	 * @return {sap.ui.mdc.Field} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @name sap.ui.mdc.Field#setDataTypeConstraints
	 * @function
	 */

	/**
	 * The format options of the type specified in <code>dataType</code>
	 *
	 * <b>Note:</b> If the <code>value</code> property is bound to a model using a type this type is used.
	 * In this case the value of the <code>dataType</code> property and <code>dataTypeFormatOptions</code> property is ignored
	 *
	 * @param {string} oDataTypeFormatOptions FormatOptions to be set
	 * @return {sap.ui.mdc.Field} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @name sap.ui.mdc.Field#setDataTypeFormatOptions
	 * @function
	 */

	return Field;

});
