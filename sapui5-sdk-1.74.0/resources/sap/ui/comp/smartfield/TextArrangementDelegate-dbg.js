/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/base/Object",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/base/assert"
], function(
	compLibrary,
	BaseObject,
	Filter,
	FilterOperator,
	assert
) {
	"use strict";

	var TextInEditModeSource = compLibrary.smartfield.TextInEditModeSource;

	var TextArrangementDelegate = BaseObject.extend("sap.ui.comp.smartfield.TextArrangementDelegate", /** @lends sap.ui.comp.smartfield.TextArrangementDelegate.prototype */ {
		constructor: function(oFactory) {
			BaseObject.apply(this, arguments);
			this.oFactory = oFactory;
			this.oSmartField = oFactory._oParent;
			this.bValidMetadata = false;
			this.sBindingContextPath = "";
		}
	});

	TextArrangementDelegate.prototype.setValue = function(sValue, sOldValue) {
		var oSmartField = this.oSmartField,
			oControl = oSmartField._oControl;

		// In edit mode, if the textInEditModeSource property is set to TextInEditModeSource.NavigationProperty or
		// to TextInEditModeSource.ValueList, a composite binding is used for the hosted inner control (usually a sap.m.Input).
		// So, calling .setValue() on the SmartField control, would not update all model properties of the hosted inner
		// control.
		if (this.bValidMetadata && (sValue !== sOldValue) && oControl) {
			var oInnerControl = oControl[oControl.current],
				oBinding = oInnerControl && oInnerControl.getBinding("value");

			if (!oBinding) {
				return;
			}

			// This bModelUpdate flag indicates whether the .setValue() mutator method is called by the framework
			// due to a property binding change e.g.: by calling .updateProperty("value")
			var bModelUpdate = oSmartField.isPropertyBeingUpdatedByModel("value");

			switch (oSmartField.getTextInEditModeSource()) {
				case TextInEditModeSource.NavigationProperty:
					var bDescriptionForValueLoaded = !!oSmartField.getModel().getData(oBinding.getBindings()[1].getPath(), oSmartField.getBindingContext(), true);

					if ((bModelUpdate && !bDescriptionForValueLoaded) || !bModelUpdate) {
						oInnerControl.setValue(sValue);
					}

					return;

				case TextInEditModeSource.ValueList:

					if (!bModelUpdate) {
						oInnerControl.setValue(sValue);
					}

					return;

				// no default
			}
		}
	};

	TextArrangementDelegate.getPaths = function(sTextInEditModeSource, oMetadata) {

		switch (sTextInEditModeSource) {
			case TextInEditModeSource.NavigationProperty:
				var oNavigationPropertyMetadata = oMetadata.annotations.text;

				return {
					keyField: oNavigationPropertyMetadata.entityType.key.propertyRef[0].name,
					descriptionField: oNavigationPropertyMetadata.property.typePath,
					entitySetName: oNavigationPropertyMetadata.entitySet.name
				};

			case TextInEditModeSource.ValueList:
				var oValueListAnnotation = oMetadata.property.valueListAnnotation;

				return {
					keyField: oValueListAnnotation.keyField,
					descriptionField: oValueListAnnotation.descriptionField,
					entitySetName: oMetadata.property.valueListEntitySet.name
				};

			// no default
		}
	};

	TextArrangementDelegate.prototype.getBindingInfo = function(oSettings) {
		var oSmartField = this.oSmartField,
			oFactory = this.oFactory,
			oType = oSettings && oSettings.type,
			oMetadata = oFactory._oMetaData;

		if (!oType) {
			var oBindingInfo = oSmartField.getBindingInfo("value");
			oType = (oBindingInfo && oBindingInfo.type) || {};
			var mTextArrangementBindingPaths = TextArrangementDelegate.getPaths(oSmartField.getTextInEditModeSource(), oMetadata);

			oType = oFactory._oTypes.getType(oMetadata.property, oType.oFormatOptions, oType.oConstraints, {
				composite: true,
				keyField: mTextArrangementBindingPaths.keyField,
				descriptionField: mTextArrangementBindingPaths.descriptionField
			});
		}

		var sTextAnnotationPropertyPath = this.getTextAnnotationPropertyPath();

		// BCP: 1970338535 - Special case where we can't calculate the description binding path so we have to use
		// not existing one to prevent issues having an empty binding path.
		if (sTextAnnotationPropertyPath === "") {
			sTextAnnotationPropertyPath = "__$$SmartFieldNotExistingBindingPath";
		}

		return {
			model: oMetadata.model,
			type: oType,
			parts: [
				{
					path: oMetadata.path
				},
				{
					path: sTextAnnotationPropertyPath
				}
			]
		};
	};

	TextArrangementDelegate.prototype.getTextAnnotationPropertyPath = function(oSettings) {
		oSettings = oSettings || {};
		var sTextInEditModeSource = oSettings.textInEditModeSource || this.oSmartField.getTextInEditModeSource(),
			oFactory = this.oFactory,
			oMetadata = oFactory._oMetaData;

		switch (sTextInEditModeSource) {
			case TextInEditModeSource.NavigationProperty:
				var oTextAnnotation = oSettings.textAnnotation || oMetadata.annotations.text;
				return oFactory._oHelper.getTextAnnotationPropertyPath(oTextAnnotation);

			case TextInEditModeSource.ValueList:
				var oEdmValueListKeyProperty = oSettings.edmValueListKeyProperty || oMetadata.property.valueListKeyProperty,
					sBindingContextPath = oSettings.bindingContextPath || this.sBindingContextPath;

				// return the absolute path to the value list entity property e.g.: /VL_SH_H_CATEGORY('PR')/LTXT
				return oFactory._oHelper.getAbsolutePropertyPathToValueListEntity({
					property: oEdmValueListKeyProperty,
					bindingContextPath: sBindingContextPath
				});

			case TextInEditModeSource.None:
				return "";

			default:
				return "";
		}
	};

	TextArrangementDelegate.prototype.checkRequiredMetadata = function(sTextInEditModeSource) {
		var oFactory = this.oFactory,
			oMetadata = oFactory._oMetaData;

		switch (sTextInEditModeSource) {
			case TextInEditModeSource.None:
				return false;

			case TextInEditModeSource.NavigationProperty:
				var oNavigationPropertyMetadata = oMetadata.annotations.text,
					oEntityTypeOfNavigationProperty;

				if (oNavigationPropertyMetadata) {
					oEntityTypeOfNavigationProperty = oNavigationPropertyMetadata.entityType;
				}

				var oCheckNavigationPropertyMetadata = {
					propertyName: oMetadata.property.property.name,
					entityType: oMetadata.entityType,
					entityTypeOfNavigationProperty: oEntityTypeOfNavigationProperty,
					textAnnotation: oMetadata.property.property["com.sap.vocabularies.Common.v1.Text"]
				};

				return oFactory._oHelper.checkNavigationPropertyRequiredMetadata(oCheckNavigationPropertyMetadata);

			case TextInEditModeSource.ValueList:

				var oValueListMetadata = {
					propertyName: oMetadata.property.property.name,
					entityType: oMetadata.entityType,
					valueListAnnotation: oMetadata.property.valueListAnnotation
				};

				return oFactory._oHelper.checkValueListRequiredMetadataForTextArrangment(oValueListMetadata);

			default:
				return false;
		 }
	};

	TextArrangementDelegate.prototype.onBeforeValidateValue = function(sValue, oSettings) {
		var oSmartField = this.oSmartField;

		// Prevent unnecessary requests to be sent and validation errors to be displayed,
		// if the binding context is not set
		if (!oSmartField.getBindingContext()) { // note: the binding context can be null or undefined
			return;
		}

		var fnOnFetchSuccess = this.onFetchIDAndDescriptionCollectionSuccess.bind(this, {
			success: oSettings.success
		});

		var fnOnFetchError = this.onFetchIDAndDescriptionCollectionError.bind(this, {
			error: oSettings.error
		});

		var oFetchSettings = {
			value: sValue,
			success: fnOnFetchSuccess,
			error: fnOnFetchError,
			filterFields: oSettings.filterFields
		};

		this.fetchIDAndDescriptionCollection(oFetchSettings);
		var oInputField = oSmartField._oControl.edit;

		if (oInputField) {
			oInputField.setBusyIndicatorDelay(300);
			oInputField.setBusy(true);
		}
	};

	TextArrangementDelegate.prototype.fetchIDAndDescriptionCollectionIfRequired = function() {
		var oSmartField = this.oSmartField;

		if (oSmartField.getTextInEditModeSource() === TextInEditModeSource.ValueList) {
			var INNER_CONTROL_VALUE_PROP_MAP = "value",
				vValue = oSmartField.getBinding(INNER_CONTROL_VALUE_PROP_MAP).getValue(),
				bUndefinedOrEmptyValue = (vValue == null) || (vValue === "");

			if (!bUndefinedOrEmptyValue) {
				var aFilterFields = ["keyField"];

				var oSuccessSettings = {
					value: vValue,
					oldValue: vValue,
					updateBusyIndicator: false,
					initialRendering: true
				};

				this.fetchIDAndDescriptionCollection({
					value: vValue,
					filterFields: aFilterFields,
					success: this.onFetchIDAndDescriptionCollectionSuccess.bind(this, oSuccessSettings)
				});
			}
		}
	};

	TextArrangementDelegate.prototype.fetchIDAndDescriptionCollection = function(oSettings) {
		var vValue = oSettings.value;

		// whether the variable vValue is null or undefined or "" (empty)
		if ((vValue == null) || (vValue === "")) {
			return;
		}

		var oSmartField = this.oSmartField,
			oInputField = oSmartField._oControl.edit,
			oInputBindingInfo = oInputField && oInputField.getBindingInfo("value"),
			bValueBeingUpdatedByMutator = !!(oInputBindingInfo && oInputBindingInfo.skipPropertyUpdate),
			bValueBeingUpdatedByModel = oSmartField.isPropertyBeingUpdatedByModel("value");

		if (bValueBeingUpdatedByMutator && !bValueBeingUpdatedByModel) {
			oInputField.attachEventOnce("change", function onTextInputFieldChange(oControlEvent) {
				var bValueValidated = !!oControlEvent.getParameter("validated");

				// When the value is selected from the providers (ValueHelpDialog or suggestion list),
				// it is already validated.
				if (bValueValidated) {
					oSettings.filterFields = ["keyField"];
				}

				this.readODataModel(oSettings);
			}, this);
		} else {

			if (bValueBeingUpdatedByModel) {
				oSettings.filterFields = ["keyField"];
			}

			this.readODataModel(oSettings);
		}
	};

	TextArrangementDelegate.prototype.readODataModel = function(oSettings) {
		var oSmartField = this.oSmartField,
			sTextInEditModeSource = oSmartField.getTextInEditModeSource(),
			oMetadata = oSmartField.getControlFactory().getMetaData(),
			mTextArrangementPaths = TextArrangementDelegate.getPaths(sTextInEditModeSource, oMetadata),
			sKeyField = mTextArrangementPaths.keyField,
			sDescriptionField = mTextArrangementPaths.descriptionField;

		var oFiltersSettings = {
			keyFieldPath: sKeyField,
			descriptionFieldPath: sDescriptionField,
			aFilterFields: oSettings.filterFields
		};

		var aFilters = this.getFilters(oSettings.value, oFiltersSettings);

		var mUrlParameters = {
			"$select": sKeyField + "," + sDescriptionField,
			"$top": 2
		};

		var sPath = "/" + mTextArrangementPaths.entitySetName;

		var oDataModelReadSettings = {
			filters: aFilters,
			urlParameters: mUrlParameters,
			success: oSettings.success,
			error: oSettings.error
		};

		var oODataModel = oSmartField.getModel();
		oODataModel.read(sPath, oDataModelReadSettings);
	};

	TextArrangementDelegate.prototype.onFetchIDAndDescriptionCollectionSuccess = function(oSettings, oData, oResponse) {
		oSettings = Object.assign({ updateBusyIndicator: true }, oSettings);

		var oSmartField = this.oSmartField,
			oInputField = oSmartField._oControl.edit,
			oBinding = oInputField && oInputField.getBinding("value");

		if (oBinding && oSettings.updateBusyIndicator) {

			// restore the busy and busy indicator delay states to the initial value
			oInputField.setBusyIndicatorDelay(0);
			oInputField.setBusy(false);
		}

		if (typeof oSettings.success === "function") {
			oSettings.success(oData.results);
		}

		if (oBinding) {

			var updateDescriptionBindingPath = function() {
				var oODataModel = oSmartField.getModel();
				assert(Array.isArray(oData.results), " - " + this.getMetadata().getName());

				if (oODataModel) {
					var vBindingContextPath = oODataModel.getKey(oData.results[0]);

					if (typeof vBindingContextPath === "string") {
						this.sBindingContextPath = "/" + vBindingContextPath;
						this.bindPropertyForValueList("value", oInputField);
					}
				}
			};

			if (oSettings.initialRendering) {
				updateDescriptionBindingPath.call(this);
			}

			oInputField.attachEventOnce("validationSuccess", updateDescriptionBindingPath, this);
		}
	};

	TextArrangementDelegate.prototype.onFetchIDAndDescriptionCollectionError = function(oSettings, oError) {
		var oInputField = this.oSmartField._oControl.edit;

		if (oInputField) {

			// restore the busy and busy indicator delay states to the initial value
			oInputField.setBusyIndicatorDelay(0);
			oInputField.setBusy(false);
		}

		if (typeof oSettings.error === "function") {
			oSettings.error();
		}
	};

	TextArrangementDelegate.prototype.bindPropertyForValueList = function(sProperty, oInputField) {
		var oSmartField = this.oSmartField;

		if (oSmartField.getTextInEditModeSource() === TextInEditModeSource.ValueList) {
			var oBinding = oInputField && oInputField.getBinding(sProperty);

			if (this.oFactory && oBinding) {
				oInputField.bindProperty(sProperty, this.getBindingInfo({
					type: oBinding.getType()
				}));
			}
		}
	};

	TextArrangementDelegate.prototype.getFilters = function(vValue, oSettings) {
		this.destroyFilters();
		var aFilterFields = oSettings.aFilterFields;

		if (aFilterFields.length === 1) {

			switch (aFilterFields[0]) {
				case "keyField":
					this.oIDFilter = getIDFilter(vValue, oSettings);
					return [this.oIDFilter];

				case "descriptionField":
					this.oDescriptionFilter = getDescriptionFilter(vValue, oSettings);
					return [this.oDescriptionFilter];

				// no default
			}
		}

		this.oIDFilter = getIDFilter(vValue, oSettings);
		this.oDescriptionFilter = getDescriptionFilter(vValue, oSettings);

		this.oFilters = new Filter({
			and: false,
			filters: [
				this.oIDFilter,
				this.oDescriptionFilter
			]
		});

		return [ this.oFilters ];
	};

	function getIDFilter(vValue, oSettings) {
		return new Filter({
			value1: vValue,
			path: oSettings.keyFieldPath,
			operator: FilterOperator.EQ
		});
	}

	 function getDescriptionFilter(vValue, oSettings) {
		return new Filter({
			value1: vValue,
			path: oSettings.descriptionFieldPath,
			operator: FilterOperator.Contains
		});
	}

	TextArrangementDelegate.prototype.destroyFilters = function() {

		if (this.oIDFilter) {
			this.oIDFilter.destroy();
			this.oIDFilter = null;
		}

		if (this.oDescriptionFilter) {
			this.oDescriptionFilter.destroy();
			this.oDescriptionFilter = null;
		}

		if (this.oFilters) {
			this.oFilters.destroy();
			this.oFilters = null;
		}
	};

	TextArrangementDelegate.prototype.destroy = function() {
		this.oSmartField = null;
		this.bValidMetadata = false;
		this.sBindingContextPath = "";
		this.destroyFilters();
	};

	return TextArrangementDelegate;
});
