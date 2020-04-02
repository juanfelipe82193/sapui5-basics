/*
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

/**
 * Base class for factory implementations that create controls that are hosted by <code>sap.ui.comp.smartfield.SmartField</code>.
 *
 * @name sap.ui.comp.smartfield.ControlFactoryBase
 * @author SAP SE
 * @version 1.74.0
 * @private
 * @since 1.28.0
 */
sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/core/library",
	"sap/ui/comp/library",
	"sap/ui/model/BindingMode",
	"sap/ui/comp/util/FormatUtil",
	"sap/ui/comp/providers/ValueHelpProvider",
	"sap/ui/comp/providers/ValueListProvider",
	"sap/ui/comp/smartfield/BindingUtil",
	"sap/m/HBox",
	"sap/base/Log",
	"sap/base/strings/capitalize"
], function(
	BaseObject,
	coreLibrary,
	library,
	BindingMode,
	FormatUtil,
	ValueHelpProvider,
	ValueListProvider,
	BindingUtil,
	HBox,
	Log,
	capitalize
) {
	"use strict";

	// shortcut for sap.ui.comp.smartfield.ControlContextType
	var ControlContextType = library.smartfield.ControlContextType;

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	/**
	 * @private
	 * @constructor
	 * @param {sap.ui.model.Model} oModel the model currently used
	 * @param {sap.ui.core.Control} oParent the parent control
	 */
	var ControlFactoryBase = BaseObject.extend("sap.ui.comp.smartfield.ControlFactoryBase", {
		constructor: function(oModel, oParent) {
			BaseObject.apply(this, arguments);
			this.sName = "ControlFactoryBase";
			this._oModel = oModel;
			this._oParent = oParent;
			this._oBinding = new BindingUtil();
			this._aProviders = [];
			this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
		}
	});

	/**
	 * Creates a control instance.
	 *
	 * @param {boolean} bBlockSmartLinkCreation if <code>true</code>, a <code>SmartLink</code> will not be created
	 * @returns {sap.ui.core.Control} the new control instance or <code>null</code>, if no control could be determined
	 * @public
	 */
	ControlFactoryBase.prototype.createControl = function(bBlockSmartLinkCreation) {
		var sMethod,
			oControl;

		sMethod = this._getCreator(bBlockSmartLinkCreation);

		if (sMethod) {
			oControl = this[sMethod]();

			this._addAriaLabelledBy(oControl);

			if (oControl && oControl.onCreate) {
				this[oControl.onCreate](oControl.control, oControl.params);
			}
		}

		return oControl;
	};

	ControlFactoryBase.prototype._addAriaLabelledBy = function(oControl) {
		var oTargetControl;

		if ((this._oParent.getControlContext() === ControlContextType.None) || (this._oParent.getControlContext() === ControlContextType.Form) || (this._oParent.getControlContext() === ControlContextType.SmartFormGrid)) {

			if (oControl) {
				oTargetControl = oControl.control;

				if (oTargetControl instanceof HBox) {

					if (oTargetControl.getItems().length > 0) {
						oTargetControl = oTargetControl.getItems()[0];
					}
				}
			}

			if (oTargetControl && oTargetControl.addAriaLabelledBy && this._oParent.getAriaLabelledBy().length > 0) {
				oTargetControl.removeAllAriaLabelledBy();
				this._oParent.getAriaLabelledBy().forEach(function(vAriaLabelledBy) {
					oTargetControl.addAriaLabelledBy(vAriaLabelledBy);
				});
			}
		}
	};

	/**
	 * Adds validations to the given control.
	 *
	 * @param {sap.ui.core.Control} oControl the given control
	 * @param {string} sMethod an optional method name of a method to be invoked on the parent smart field to notify it of the current state
	 * @public
	 */
	ControlFactoryBase.prototype.addValidations = function(oControl, sMethod) {
		var fState,
			fError,
			that = this;

		fState = function(sState, oEvent) {
			var sMessage,
				oException,
				oSource = oEvent.getSource();

			if (oSource) {

				if (oSource.setValueState) {
					oSource.setValueState(sState);
				}

				oException = oEvent.getParameter("exception");

				if (oException) {
					sMessage = oException.message;
				}

				// check also for an event parameter called message.
				if (!sMessage) {
					sMessage = oEvent.getParameter("message");
				}

				if (oSource.setValueStateText) {
					oSource.setValueStateText(sMessage);
				}
			}

			if (sMethod) {
				that._oParent[sMethod](sState === ValueState.Error);
			}
		};

		fError = function(oEvent) {
			fState(ValueState.Error, oEvent);
		};

		// attach to the errors.
		oControl.attachFormatError(fError);
		oControl.attachParseError(fError);
		oControl.attachValidationError(fError);
		oControl.attachValidationSuccess(function(oEvent) {
			fState(ValueState.None, oEvent);
		});
	};

	/**
	 * Gets the display behaviour from the configuration
	 *
	 * @param {string} sDefaultDisplayMode determines the default display mode
	 * @returns {string} Display behaviour or <code>null</code>
	 * @private
	 */
	ControlFactoryBase.prototype._getDisplayBehaviourConfiguration = function(sDefaultDisplayMode) {
		var sDisplay = null;

		// check the configuration for display behavior.
		var oConfig = this._oParent.getConfiguration();

		if (oConfig) {
			sDisplay = oConfig.getDisplayBehaviour();
		}

		if (!sDisplay && this._oMetaData && this._oMetaData.entityType) {
			sDisplay = this._oHelper.oAnnotation.getTextArrangement(this._oMetaData.property.property, this._oMetaData.entityType);
		}

		if (!sDisplay) {
			sDisplay = this._oParent.data(sDefaultDisplayMode);
		}

		return sDisplay;
	};

	/**
	 * Gets the value of the <code>preventInitialDataFetchInVHDialog</code> from the configuration
	 *
	 * @returns {boolean} whether initial data fetch in value help dialog is demanded
	 * @private
	 */
	ControlFactoryBase.prototype._getPreventInitialDataFetchInVHDialog = function() {
		var oConfig = this._oParent.getConfiguration();
		return oConfig ? oConfig.getPreventInitialDataFetchInValueHelpDialog() : true;
	};

	/**
	 * Format a value according to the display behaviour settings
	 *
	 * @param {string} sDefaultDisplayMode determines the default display mode
	 * @param {string} sKey the main value
	 * @param {string} sDescription dependent value
	 * @returns {string} relevant displayBehaviour option or <code>null</code>
	 * @private
	 */
	ControlFactoryBase.prototype._formatDisplayBehaviour = function(sDefaultDisplayMode, sKey, sDescription) {
		var sDisplay = this._getDisplayBehaviourConfiguration(sDefaultDisplayMode);

		if (sDefaultDisplayMode === "defaultCheckBoxDisplayBehaviour") {
			return this._getFormattedExpressionFromDisplayBehaviour(sDisplay, sKey);
		}

		if (sDefaultDisplayMode === "defaultComboBoxReadOnlyDisplayBehaviour" && !sDisplay) {
			sDisplay = "descriptionAndId";
		}

		return FormatUtil.getFormattedExpressionFromDisplayBehaviour(sDisplay || "idOnly", sKey, sDescription);
	};

	ControlFactoryBase.prototype._getFormattedExpressionFromDisplayBehaviour = function(sDisplay, bValue) {
		var sKey = "";

		switch (sDisplay) {

			case "OnOff":
				sKey = bValue ? "SMARTFIELD_CB_ON" : "SMARTFIELD_CB_OFF";
				break;

			case "TrueFalse":
				sKey = bValue ? "SMARTFIELD_CB_TRUE" : "SMARTFIELD_CB_FALSE";
				break;

			// case "YesNo": sKey = bValue ? "SMARTFIELD_CB_YES" : "SMARTFIELD_CB_NO"; break;
			default:
				sKey = bValue ? "SMARTFIELD_CB_YES" : "SMARTFIELD_CB_NO";
				break;
		}

		return this._oRb.getText(sKey);
	};

	ControlFactoryBase.prototype.shouldCreateValueHelpForControl = function(oControl) {

		if (!oControl) {
			return false;
		}

		var oParent = this._oParent;
		return oParent && ((oParent.getMode() === "edit") || (oControl.getMetadata().getName() === "sap.ui.comp.smartfield.DisplayComboBox"));
	};

	ControlFactoryBase.prototype.getDropdownItemKeyType = function() {};
	ControlFactoryBase.prototype.getValueStateBindingInfoForRecommendationStateAnnotation = function() {};

	/**
	 * Checks whether an annotation for value help exists and adds type-ahead and value help.
	 *
	 * @param {object} mSettings Object with other options.
	 * @param {sap.ui.core.Control} mSettings.control The new control.
	 * @param {object} mSettings.edmProperty The Entity Data Model (EDM) property to which the <code>value</code> property of the
	 * <code>SmartField</code> control is bound.
	 * @param {object} mSettings.valueHelp The value help configuration.
	 * @param {object} mSettings.valueHelp.annotation The value help annotation.
	 * @param {string} mSettings.valueHelp.aggregation The aggregation to attach the value list to.
	 * @param {boolean} mSettings.valueHelp.noDialog If set to <code>true</code>, the creation of a value help dialog is omitted.
	 * @param {boolean} mSettings.valueHelp.noTypeAhead If set to <code>true</code>, the type ahead functionality is omitted.
	 * @param {string} [mSettings.valueHelp.displayBehaviour] This parameter is forwarded to value help providers. Default value is taken from "defaultDropDownDisplayBehaviour".
	 * @param {string} mSettings.valueHelp.dialogtitle A title for the value help dialog.
	 * @param {sap.ui.model.odata.ODataModel} mSettings.model The OData model instance object currently used.
	 * @param {function} [mSettings.onValueListChange] Event handler for change event of value list provider and value help provider.
	 * @protected
	 */
	ControlFactoryBase.prototype.createValueHelp = function(mSettings) {
		var oEdmProperty = mSettings.edmProperty,
			oValueHelp = mSettings.valueHelp;

		if (oValueHelp.annotation && (oEdmProperty["sap:value-list"] || oEdmProperty["com.sap.vocabularies.Common.v1.ValueList"])) {

			// check the configuration for display behavior.
			var sDisplay = oValueHelp.displayBehaviour || this._getDisplayBehaviourConfiguration("defaultDropDownDisplayBehaviour"),
				oDateFormatSettings = this._oParent.data("dateFormatSettings"),
				bPreventInitialDataFetchInVHDialog = this._getPreventInitialDataFetchInVHDialog();

			if (typeof oDateFormatSettings === "string") {
				try {
					oDateFormatSettings = JSON.parse(oDateFormatSettings);
				} catch (ex) {
					// Invalid date format settings provided, Ignore!
				}
			}

			// check what is the content of oValueHelp.annotation - path or annotation object
			var oAnnotation,
				sAnnotationPath;

			if (typeof oValueHelp.annotation === "string") {
				sAnnotationPath = oValueHelp.annotation;
			} else if (oValueHelp && typeof oValueHelp.annotation === "object") {
				oAnnotation = oValueHelp.analyser.getValueListAnnotationForFunctionImport({
					"": oValueHelp.annotation
				}, oEdmProperty.name).primaryValueListAnnotation;
			}

			var oControl = mSettings.control,
				oModel = mSettings.model,
				fnOnValueListChange = mSettings.onValueListChange;

			if (!oValueHelp.noDialog) {

				if (oControl.setFilterSuggests) {
					oControl.setFilterSuggests(false);
				}

				var oValueHelpDlg = new ValueHelpProvider({
					fieldName: oEdmProperty.name,
					control: oControl,
					model: oModel,
					dateFormatSettings: oDateFormatSettings,
					displayBehaviour: sDisplay,
					// fieldViewMetadata: oEdmProperty,
					loadAnnotation: true,
					fullyQualifiedFieldName: sAnnotationPath,
					metadataAnalyser: oValueHelp.analyser,
					annotation: oAnnotation,

					title: oValueHelp.dialogtitle,
					preventInitialDataFetchInValueHelpDialog: bPreventInitialDataFetchInVHDialog,
					supportMultiSelect: !!oValueHelp.supportMultiSelect,
					supportRanges: !!oValueHelp.supportRanges,
					takeOverInputValue: true,
					type: oValueHelp.type,
					maxLength: oEdmProperty.maxLength
				});

				if (fnOnValueListChange) {
					oValueHelpDlg.attachValueListChanged(fnOnValueListChange);
				}

				this._aProviders.push(oValueHelpDlg);

				if (oControl.setShowValueHelp) {
					oControl.setShowValueHelp(true);
				}
			}

			// Create ValueListProvider only for ComboBox etc and Inputs with showSuggest = true
			if (!oValueHelp.noTypeAhead || !oControl.isA("sap.m.Input")) {
				var oValueList = new ValueListProvider({
					control: oControl,
					model: oModel,
					dateFormatSettings: oDateFormatSettings,
					displayBehaviour: sDisplay,
					fieldViewMetadata: oEdmProperty,
					recommendationListEnabled: true,
					loadAnnotation: true,
					fullyQualifiedFieldName: sAnnotationPath,
					metadataAnalyser: oValueHelp.analyser,
					annotation: oAnnotation,

					aggregation: oValueHelp.aggregation,
					typeAheadEnabled: !oValueHelp.noTypeAhead,
					dropdownItemKeyType: this.getDropdownItemKeyType(oControl),
					maxLength: oEdmProperty.maxLength
				});

				if (!oValueHelp.noTypeAhead) {

					if (oControl.setShowSuggestion) {
						oControl.setShowSuggestion(true);
					}
				}

				if (fnOnValueListChange) {
					oValueList.attachValueListChanged(fnOnValueListChange);
				}

				this._aProviders.push(oValueList);
			}
		}
	};

	/**
	 * Returns a binding for a given attribute, if no binding is specified a fixed value or <code>null</code>, which is deduced from the
	 * information maintained on the parent.
	 *
	 * @param {string} sName the name of the attribute
	 * @returns {object} binding for a given attribute, if no binding is specified a fixed value or <code>null</code>.
	 * @public
	 */
	ControlFactoryBase.prototype.getAttribute = function(sName) {
		var oInfo = this._oParent.getBindingInfo(sName);

		if (oInfo) {
			return this._oBinding.toBindingPath(oInfo);
		}

		return this._oParent["get" + sName.substring(0, 1).toUpperCase() + sName.substring(1)]();
	};

	ControlFactoryBase.prototype.getCustomDataConfiguration = function() {
		var oCustomData = this._oParent.data("configdata");
		return oCustomData && oCustomData.configdata ? oCustomData.configdata : null;
	};

	/**
	 * Returns the standard attributes used during creation of a control.
	 *
	 * @param {string} sAttribute the "leading" attribute, can be <code>null</code>.
	 * @param {object} oTypeInfo optional type information.
	 * @param {map} mNames the names of the attributes to be set.
	 * @param {object} oEvent the optional description of an event to register to and raise the <code>change</code> event on the
	 *        <code>SmartField</code>.
	 * @param {string} oEvent.event the name of an event to register to and raise the <code>change</code> event on the <code>SmartField</code>.
	 * @param {string} oEvent.parameter the name of a parameter to send with the <code>change</code> event on the <code>SmartField</code>.
	 * @returns {map} the standard attributes used during creation of a control.
	 * @public
	 */
	ControlFactoryBase.prototype.createAttributes = function(sAttribute, oTypeInfo, mNames, oEvent) {
		var that = this,
			mAttributes = {};

		// check the standard attributes, whether they are bound or not.
		for (var sPropertyName in mNames) {

			if (mNames.hasOwnProperty(sPropertyName)) {
				var oBindingInfo = this._oParent.getBindingInfo(sPropertyName);

				if (oBindingInfo) {
					mAttributes[sPropertyName] = this._oBinding.toBinding(oBindingInfo);
				} else if ((sPropertyName === "valueState") && this._oParent.isPropertyInitial("valueState")) {
					oBindingInfo = this.getValueStateBindingInfoForRecommendationStateAnnotation();

					if (oBindingInfo) {
						mAttributes[sPropertyName] = oBindingInfo;
					} else {
						mAttributes[sPropertyName] = this._oParent["get" + capitalize(sPropertyName)]();
					}
				} else {
					mAttributes[sPropertyName] = this._oParent["get" + capitalize(sPropertyName)]();
				}
			}
		}

		// map the value binding of the parent smart field to the child control's attribute.
		if (sAttribute) {
			mAttributes[sAttribute] = {
				model: this._oMetaData.model,
				path: this._oMetaData.path,
				type: oTypeInfo ? this._oTypes.getType(oTypeInfo) : null,
				mode: this._oParent.getBindingMode("value")
			};

			var oCustomDataConfiguration = this.getCustomDataConfiguration();

			if (oCustomDataConfiguration && oCustomDataConfiguration.currency) {
				mAttributes[sAttribute].mode = BindingMode.OneWay;
			}
		}

		// prepare the event that triggers the parent smart field's change event.
		if (oEvent) {
			mAttributes[oEvent.event] = function(oControlEvent) {
				try {
					var mParametersOfInnerControl = oControlEvent.getParameters();
					var mParameters = {
						value: mParametersOfInnerControl[oEvent.parameter],
						newValue: mParametersOfInnerControl[oEvent.parameter]
					};

					that._oParent.fireChange(mParameters);
				} catch (ex) {
					Log.warning(ex);
				}
			};
		}

		return mAttributes;
	};

	/**
	 * Maps the bindings for the given attributes and collects.
	 *
	 * @param {map} mAttributes the standard attributes used during creation of a control.
	 * @param {map} mNames the names of the attributes to be mapped.
	 * @public
	 */
	ControlFactoryBase.prototype.mapBindings = function(mAttributes, mNames) {
		var n,
			oInfo;

		for (n in mNames) {
			oInfo = this._oParent.getBindingInfo(n);

			if (oInfo) {
				mAttributes[mNames[n]] = this._oBinding.toBinding(oInfo);
			} else {
				mAttributes[mNames[n]] = this._oParent["get" + n.substring(0, 1).toUpperCase() + n.substring(1)]();
			}
		}
	};

	/**
	 * Gets the format settings given the <code>sFormat</code>.
	 *
	 * @param {string} sFormat The key identifying the format
	 * @returns {object} The format settings if available otherwise <code>null</code>
	 * @protected
	 */
	ControlFactoryBase.prototype.getFormatSettings = function(sFormat) {
		var mFormat = null,
			aCustom,
			oCustom,
			len;

		if (sFormat) {

			// check the simple data
			mFormat = this._oParent.data(sFormat);

			// check the custom data as fall-back.
			if (!mFormat) {
				aCustom = this._oParent.getCustomData();

				if (aCustom) {
					len = aCustom.length;

					while (len--) {
						oCustom = aCustom[len];

						if (oCustom.getKey() === sFormat) {
							mFormat = oCustom.getValue();
							break;
						}
					}
				}
			}

			// if we have a format, try to apply it.
			if (mFormat && typeof (mFormat) === "string") {
				try {
					mFormat = JSON.parse(mFormat);
				} catch (ex) {
					return null;
				}
			}
		}

		return mFormat;
	};

	ControlFactoryBase.prototype.destroyValueHelp = function() {
		this._aProviders.forEach(function(oProvider) {
			oProvider.destroy();
		});

		this._aProviders = [];
	};

	ControlFactoryBase.prototype.destroy = function() {
		this.destroyValueHelp();

		if (this._oBinding) {
			this._oBinding.destroy();
		}

		this._oBinding = null;
		this._oParent = null;
		this._oModel = null;
		this._oRb = null;
	};

	return ControlFactoryBase;
}, true);
