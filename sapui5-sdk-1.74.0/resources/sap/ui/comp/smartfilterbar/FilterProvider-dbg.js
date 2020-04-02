/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// -----------------------------------------------------------------------------
// Generates the data-model required for SmartFilter using SAP-Annotations metadata
// -----------------------------------------------------------------------------
sap.ui.define([
	'sap/ui/comp/util/DateTimeUtil', 'sap/ui/comp/util/FilterUtil', 'sap/m/DateTimePicker', 'sap/m/Select', 'sap/ui/core/Item', 'sap/m/ComboBox', 'sap/m/DatePicker', 'sap/m/DateRangeSelection', 'sap/m/TimePicker', 'sap/m/Input', 'sap/m/MultiComboBox', 'sap/ui/comp/smartfilterbar/SFBMultiInput', 'sap/m/SearchField', 'sap/m/Token', 'sap/ui/comp/odata/MetadataAnalyser', 'sap/ui/comp/odata/FiscalMetadata', 'sap/ui/comp/providers/ValueHelpProvider', 'sap/ui/comp/providers/ValueListProvider', 'sap/ui/model/Filter', 'sap/ui/model/json/JSONModel', 'sap/ui/comp/odata/ODataType', 'sap/ui/comp/util/FormatUtil', 'sap/ui/base/EventProvider', 'sap/ui/comp/util/IdentifierUtil', 'sap/ui/comp/providers/TokenParser', 'sap/ui/core/format/DateFormat', 'sap/ui/comp/library', 'sap/ui/core/library', 'sap/ui/model/analytics/odata4analytics', 'sap/ui/model/FilterOperator', "sap/base/Log", "sap/base/util/UriParameters", "sap/base/security/encodeURL", "sap/base/util/merge"
], function(DateTimeUtil, FilterUtil, DateTimePicker, Select, Item, ComboBox, DatePicker, DateRangeSelection, TimePicker, Input, MultiComboBox, MultiInput, SearchField, Token, MetadataAnalyser, FiscalMetadata, ValueHelpProvider, ValueListProvider, Filter, JSONModel, ODataType, FormatUtil, EventProvider, IdentifierUtil, TokenParser, DateFormat, library, coreLibrary, odata4analytics, FilterOperator, Log, UriParameters, encodeURL, merge) {
	"use strict";

	// shortcut for sap.ui.comp.smartfilterbar.ControlType
	var ControlType = library.smartfilterbar.ControlType;

	// shortcut for sap.ui.comp.smartfilterbar.DisplayBehaviour
	var DisplayBehaviour = library.smartfilterbar.DisplayBehaviour;

	// shortcut for sap.ui.comp.smartfilterbar.FilterType
	var FilterType = library.smartfilterbar.FilterType;

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	// shortcut for sap.ui.comp.valuehelpdialog.ValueHelpRangeOperation
	var ValueHelpRangeOperation = library.valuehelpdialog.ValueHelpRangeOperation;

	// shortcut to sap.ui.comp.smartfilterbar.MandatoryType
	var MandatoryType = library.smartfilterbar.MandatoryType;

	/**
	 * Constructs a class to generate the view/datamodel metadata for the SmartFilterBar from the SAP-Annotations metadata
	 * @constructor
	 * @experimental This module is only for internal/experimental use!
	 * @public
	 * @param {object} mPropertyBag - PropertyBag having members model, serviceUrl, entityType, additionalConfiguration
	 * @author SAP
	 */
	var FilterProvider = function(mPropertyBag) {
		if (!ValueListProvider) {
			ValueListProvider = sap.ui.require("sap/ui/comp/providers/ValueListProvider"); // because of cycle in define
		}
		if (!ValueHelpProvider) {
			ValueHelpProvider = sap.ui.require("sap/ui/comp/providers/ValueHelpProvider"); // because of cycle in define (via SmartFilterBar)
		}

		this._bInitialized = false;
		this._bPending = true;
		this._bConsiderAnalyticalParameters = false;
		this._bAttachInitializedDone = false;
		this._sDeferredGroupId;
		if (mPropertyBag) {
			this._oParentODataModel = mPropertyBag.model;
			this._sServiceURL = mPropertyBag.serviceUrl;
			this._sBasicSearchFieldName = mPropertyBag.basicSearchFieldName;
			this._isBasicSearchEnabled = mPropertyBag.enableBasicSearch;
			this._bUseContainsAsDefault = mPropertyBag.useContainsAsDefaultFilter === "true";
			this.sEntityType = mPropertyBag.entityType;
			this.sEntitySet = mPropertyBag.entitySet;
			this._isRunningInValueHelpDialog = mPropertyBag.isRunningInValueHelpDialog;
			this._oAdditionalConfiguration = mPropertyBag.additionalConfiguration;
			this.sDefaultDropDownDisplayBehaviour = mPropertyBag.defaultDropDownDisplayBehaviour;
			this.sDefaultTokenDisplayBehaviour = mPropertyBag.defaultTokenDisplayBehaviour;
			if (typeof mPropertyBag.dateFormatSettings === "string") {
				try {
					this._oDateFormatSettings = mPropertyBag.dateFormatSettings ? JSON.parse(mPropertyBag.dateFormatSettings) : undefined;
				} catch (ex) {
					// Invalid dateformat provided!
				}
			} else {
				this._oDateFormatSettings = mPropertyBag.dateFormatSettings;
			}
			if (!this._oDateFormatSettings) {
				this._oDateFormatSettings = {};
			}
			// Default to UTC true if nothing is provided --> as sap:display-format="Date" should be used without a timezone
			if (!this._oDateFormatSettings.hasOwnProperty("UTC")) {
				this._oDateFormatSettings["UTC"] = true;
			}

			// Used for IN param handling (visible field)
			// TODO: CleanUp - a better handling
			this._oSmartFilter = mPropertyBag.smartFilter;

			this._bConsiderAnalyticalParameters = mPropertyBag.considerAnalyticalParameters;
			this._bUseDateRangeType = mPropertyBag.useDateRangeType;
			this._bConsiderSelectionVariants = mPropertyBag.considerSelectionVariants;

			this._aConsiderNavigations = mPropertyBag.considerNavigations;
		}
		this.sFilterModelName = FilterProvider.FILTER_MODEL_NAME;
		this._sBasicFilterAreaID = FilterProvider.BASIC_FILTER_AREA_ID;
		this._aAnalyticalParameters = [];
		this._aFilterBarViewMetadata = [];
		this._aFilterBarFieldNames = [];
		this._aFilterBarMultiValueFieldMetadata = [];
		this._aFilterBarStringDateFieldNames = [];
		this._aFilterBarDateFieldNames = [];
		this._aFilterBarTimeFieldNames = [];
		this._aFilterBarTimeIntervalFieldNames = [];
		this._aFilterBarDateTimeMultiValueFieldNames = [];
		this._aFilterBarStringFieldNames = [];
		this._aFilterBarDateTimeFieldNames = [];
		// Array of FieldGroups from FieldGroup annotations
		this._aFieldGroupAnnotation = [];
		this._oMetadataAnalyser = new MetadataAnalyser(this._oParentODataModel || this._sServiceURL);
		// Initialise the model early so this can already be passed to the necessary helper classes --> Ex: BaseValueListProvider
		this.oModel = new JSONModel();

		this._aValueListProvider = [];
		this._aValueHelpDialogProvider = [];
		this._mTokenHandler = {};
		this._mConditionTypeFields = {};
		this._aSelectionVariants = [];

		this._oParameterization = null;
		this._oNonAnaParameterization = null;

		this._aPromises = [];

	};

	FilterProvider.FILTER_MODEL_NAME = "fi1t3rM0d31";
	FilterProvider.BASIC_FILTER_AREA_ID = "_BASIC";
	FilterProvider.BASIC_SEARCH_FIELD_ID = "_BASIC_SEARCH_FIELD";
	FilterProvider.CUSTOM_FIELDS_MODEL_PROPERTY = "_CUSTOM";
	FilterProvider.FIELD_NAME_REGEX = /\./g;

	/**
	 * Static function to generate a FilterProvider promise.
	 * @param {map} mPropertyBag Settings
	 * @returns {Promise} which will be fulfilled, once the FilterProvider is initialized
	 * @private
	 */
	FilterProvider._createFilterProvider = function(mPropertyBag) {
		var oFilterProvider = new FilterProvider(mPropertyBag);
		return oFilterProvider._intialiseMetadata();
	};

	/**
	 * Initialises the necessary filter metadata and model
	 * @private
	 */
	FilterProvider.prototype._intialiseMetadata = function() {
		var iGroupLen, iFieldLen, oSelectionFields, oODataFilterGroup, aODataFilterGroups, i, j, oODataFilterField, oFieldMetadata, oGroupMetadata, aCustomFilterField, aCustomGroup;

		this._aPromises = [];
		// first, create a Basic Area Group (groupId/groupName shall be "_BASIC")
		this._aFilterBarViewMetadata.push({
			groupName: this._sBasicFilterAreaID,
			index: 0, // should be the 1st group on the UI
			fields: []
		});
		// try to calculate entitySet using entityType, when no entitySet is provided
		if (!this.sEntitySet && this.sEntityType) {
			this.sEntitySet = this._oMetadataAnalyser.getEntitySetNameFromEntityTypeName(this.sEntityType);
		}
		// Calculate the entityType from entitySet, if not entityType is provided

		this.sEntityType = this._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.sEntitySet);

		aODataFilterGroups = this._oMetadataAnalyser.getAllFilterableFieldsByEntitySetName(this.sEntitySet, this._bConsiderAnalyticalParameters, this._aConsiderNavigations);
		if (aODataFilterGroups) {
			// update TextArrangement
			this._updateDisplayBehaviour();

			// Get the array of FieldGroup annotations
			this._aFieldGroupAnnotation = this._oMetadataAnalyser.getFieldGroupsByFilterFacetsAnnotation(this.sEntityType);

			// Get the SemanticFields annotation
			oSelectionFields = this._oMetadataAnalyser.getSelectionFieldsAnnotation(this.sEntityType);
			if (oSelectionFields && oSelectionFields.selectionFields) {
				this._aSelectionFields = oSelectionFields.selectionFields;
			}

			// Create groups based on FieldGroup annotation
			if (this._aFieldGroupAnnotation) {
				iGroupLen = this._aFieldGroupAnnotation.length;
				for (i = 0; i < iGroupLen; i++) {
					// Create metadata for group
					oODataFilterGroup = this._aFieldGroupAnnotation[i];
					oGroupMetadata = this._createGroupMetadata(oODataFilterGroup);
					oGroupMetadata.index = this._aFilterBarViewMetadata.length; // Set the index to maintain the order
					this._aFilterBarViewMetadata.push(oGroupMetadata);
				}
			}

			// Create groups and fields based on entity metadata
			iGroupLen = aODataFilterGroups.length;
			for (i = 0; i < iGroupLen; i++) {
				// Create metadata for group
				oODataFilterGroup = aODataFilterGroups[i];
				iFieldLen = oODataFilterGroup.fields.length;
				oGroupMetadata = this._createGroupMetadata(oODataFilterGroup);
				this._aFilterBarViewMetadata.push(oGroupMetadata);

				// Create metadata for fields
				for (j = 0; j < iFieldLen; j++) {
					oODataFilterField = oODataFilterGroup.fields[j];
					// Check if field is not a Primitive type --> only generate metadata for primitive/simple type fields
					if (oODataFilterField.type.indexOf("Edm.") === 0) {

						oFieldMetadata = this._createFieldMetadata(oODataFilterField);
						oGroupMetadata.fields.push(oFieldMetadata);
						this._aFilterBarFieldNames.push(oFieldMetadata.fieldName);
					}
				}
			}
		}

		// custom groups
		aCustomGroup = this._getAdditionalConfigurationForCustomGroups(aODataFilterGroups);
		iGroupLen = aCustomGroup.length;
		for (j = 0; j < iGroupLen; j++) {
			oGroupMetadata = this._createGroupMetadataForCustomGroup(aCustomGroup[j]);
			if (oGroupMetadata) {
				this._aFilterBarViewMetadata.push(oGroupMetadata);
			}
		}

		// custom filter fields
		aCustomFilterField = this._getAdditionalConfigurationForCustomFilterFields();
		iFieldLen = aCustomFilterField.length;
		for (j = 0; j < iFieldLen; j++) {
			oFieldMetadata = this._createFieldMetadataForCustomFilterFields(aCustomFilterField[j]);
			if (oFieldMetadata) {
				this._aFilterBarViewMetadata[0].fields.push(oFieldMetadata);
			}
		}

		// Basic search
		if (this._hasBasicSearch()) {
			oFieldMetadata = this._createBasicSearchFieldMetadata();
			this._aFilterBarViewMetadata[0].fields.push(oFieldMetadata);
		}

		// parameters
		if (!this._isRunningInValueHelpDialog) {
			this._createParameters();
		}

		return new Promise(function(fResolve) {
			Promise.all(this._aPromises).then(function() {

				// Selection Variants
				if (this._bConsiderSelectionVariants) {
					this._createSelectionVariants();
				}

				this._applyGroupId();
				this._applyIndexes();

				this._createInitialModel(true);
				this._initializeConditionTypeFields();
				this.setPending(this.isPending());

				this._bInitialized = true;

				fResolve(this);
			}.bind(this));
		}.bind(this));

	};

	FilterProvider.prototype._createSelectionVariants = function() {
		// Get the SelectionVariant annotation
		this._aSelectionVariants = this._oMetadataAnalyser.getSelectionVariantAnnotationList(this.sEntityType);
	};

	FilterProvider.prototype._createParameters = function() {

		if (this._oMetadataAnalyser.isSemanticAggregation(this.sEntityType)) {
			if (this._bConsiderAnalyticalParameters) {

				var fAnalyticalModel = sap.ui.require("sap/ui/model/analytics/odata4analytics");
				if (fAnalyticalModel) {
					this._createAnalyticalParameters(fAnalyticalModel);
				} else {
					var oPromise = new Promise(function(fResolve) {
						sap.ui.require([
							"sap/ui/model/analytics/odata4analytics"
						], function(fAnalyticalModel) {
							this._createAnalyticalParameters(fAnalyticalModel);
							fResolve();
						}.bind(this));
					}.bind(this));

					this._aPromises.push(oPromise);
				}
			}
		} else {
			this._createNonAnalyticalParameters();
		}
	};

	FilterProvider.prototype._createAnalyticalParameters = function(fAnalyticalModel) {
		this._oParameterization = this._getAnalyticParameterization(fAnalyticalModel);
		this._createAnalyticParameters(this._oParameterization);
	};

	FilterProvider.prototype._getAnalyticParameterization = function(AnalyticalModel) {
		var o4AnaModel, oQueryResult;
		try {
			o4AnaModel = new AnalyticalModel.Model(new AnalyticalModel.Model.ReferenceByModel(this._oParentODataModel));
		} catch (e) {
			throw "Failed to instantiate analytical extensions for given OData model: " + e.message;
		}

		// Will find the necessary entry point to work with the parameter set
		oQueryResult = o4AnaModel && o4AnaModel.findQueryResultByName(this.sEntitySet);
		return (oQueryResult && oQueryResult.getParameterization());
	};


	FilterProvider.prototype._createNonAnalyticalParameters = function() {

		if (this.sEntitySet) {
			this._oNonAnaParameterization = this._oMetadataAnalyser.getParametersByEntitySetName(this.sEntitySet);
			if (this._oNonAnaParameterization) {
				this._createParametersByEntitySetName(this._oNonAnaParameterization.entitySetName, this._oNonAnaParameterization.parameters);
			}
		}
	};

	FilterProvider.prototype.attachPendingChange = function(fn) {
		if (!this._oEventProvider) {
			this._oEventProvider = new EventProvider();
		}
		this._oEventProvider.attachEvent("PendingChange", fn);
	};

	FilterProvider.prototype.detachPendingChange = function(fn) {
		if (this._oEventProvider) {
			this._oEventProvider.detachEvent("PendingChange", fn);
		}
	};

	FilterProvider.prototype.setPending = function(bValue) {
		var bChanged = this._bPending !== bValue;
		this._bPending = bValue;
		if (bChanged && this._oEventProvider) {
			var mParameters = {};
			mParameters.pending = bValue;
			this._oEventProvider.fireEvent("PendingChange", mParameters);
		}
	};

	FilterProvider.prototype.isPending = function() {
		if (!this._bInitialized) {
			return true;
		}
		for ( var n in this._mConditionTypeFields) {
			if (this._mConditionTypeFields[n].conditionType.isPending()) {
				return true;
			}
		}
		return false;
	};

	/**
	 * Updates the displayBehaviour from TextArrangment annotation, if necessary
	 * @private
	 */
	FilterProvider.prototype._updateDisplayBehaviour = function() {
		this._sTextArrangementDisplayBehaviour = this._oMetadataAnalyser.getTextArrangementValue(this.sEntityType);
		if (!this.sDefaultDropDownDisplayBehaviour) {
			if (this._sTextArrangementDisplayBehaviour) {
				this.sDefaultDropDownDisplayBehaviour = this._sTextArrangementDisplayBehaviour;
			} else {
				this.sDefaultDropDownDisplayBehaviour = DisplayBehaviour.descriptionOnly;
			}
		}
		if (!this.sDefaultTokenDisplayBehaviour) {
			if (this._sTextArrangementDisplayBehaviour) {
				this.sDefaultTokenDisplayBehaviour = this._sTextArrangementDisplayBehaviour;
			} else {
				this.sDefaultTokenDisplayBehaviour = DisplayBehaviour.descriptionAndId;
			}
		}
	};

	/**
	 * Returns a flag indicating whether a field for the basic search shall be rendered or not
	 * @returns {boolean} Flag
	 * @private
	 */
	FilterProvider.prototype._hasBasicSearch = function() {
		return this._isBasicSearchEnabled;
	};

	/**
	 * Looks for custom filter fields from the additional configuration which have a name which is not known in the ODATA metadata
	 * @returns {Array} Array containing the the control configuration of the additional filter fields
	 * @private
	 */
	FilterProvider.prototype._getAdditionalConfigurationForCustomFilterFields = function() {
		var aControlConfiguration, length, i, aResult;

		// get additional control configuration
		if (!this._oAdditionalConfiguration) {
			return [];
		}
		aControlConfiguration = this._oAdditionalConfiguration.getControlConfiguration();

		// check if fields from OData metadata exist
		if (!this._aFilterBarFieldNames || !this._aFilterBarFieldNames.length) {
			return aControlConfiguration;
		}

		aResult = [];
		length = aControlConfiguration.length;
		for (i = 0; i < length; i++) {
			// filter field for control configuration could not be found in OData metadata...this is a custom filter field!
			if (this._aFilterBarFieldNames.indexOf(aControlConfiguration[i].key) < 0) {
				aResult.push(aControlConfiguration[i]);
			}
		}
		return aResult;
	};

	/**
	 * Looks for custom groups from the additional configuration which have a name which is not known in the ODATA metadata
	 * @param {object} aODataFilterGroups - groups from the ODATA metadata
	 * @returns {Array} Array containing the the group configuration of the custom groups
	 * @private
	 */
	FilterProvider.prototype._getAdditionalConfigurationForCustomGroups = function(aODataFilterGroups) {
		var aGroupConfiguration, length, nODataGroupsLength, i, aResult, j, bFound, sGroupName;

		// get additional group configuration
		if (!this._oAdditionalConfiguration) {
			return [];
		}
		aGroupConfiguration = this._oAdditionalConfiguration.getGroupConfiguration();

		// get groups from OData metadata
		if (!aODataFilterGroups || !aODataFilterGroups.length) {
			return aGroupConfiguration;
		}

		aResult = [];
		nODataGroupsLength = aODataFilterGroups.length;
		length = aGroupConfiguration.length;
		for (i = 0; i < length; i++) {
			bFound = false;
			for (j = 0; j < nODataGroupsLength; j++) {
				sGroupName = aODataFilterGroups[j].groupName || aODataFilterGroups[j].groupEntitySetName;
				if (sGroupName === aGroupConfiguration[i].key) {
					bFound = true;
					break;
				}
			}
			if (!bFound) { // group from group configuration could not be found in OData metadata...this is a custom group!
				aResult.push(aGroupConfiguration[i]);
			}
		}

		return aResult;
	};

	/**
	 * Initialises the necessary filter metadata and model
	 * @param {object} oJSONData - The JSON data from the model
	 * @param {object} oFilterFieldMetadata - The metadata for the filter field
	 * @param {boolean} bUseDefaultValues - whether default values from configuration shall be used
	 * @private
	 */
	FilterProvider.prototype._createInitialModelForField = function(oJSONData, oFilterFieldMetadata, bUseDefaultValues) {
		var bIsDateTimeType = false, aDefaultFilterValues, oDefaultFilterValue, bHasDefaultFilterValue = false, bIsRangeField = false, sLowValue = null, sHighValue = null, iLength, oItem = null, aItems = [], aRanges = [];
		// Model will no be created for custom filter fields..
		if (!oFilterFieldMetadata || oFilterFieldMetadata.isCustomFilterField) {
			return;
		}
		if (oFilterFieldMetadata.filterRestriction !== FilterType.multiple) {
			bIsRangeField = true;
		}

		if ((oFilterFieldMetadata.filterType === "date") || (oFilterFieldMetadata.filterType === "time") || (oFilterFieldMetadata.filterType === "datetime")) {
			bIsDateTimeType = true;
		}

		if (bUseDefaultValues) {
			// Get the array of default filter values
			aDefaultFilterValues = oFilterFieldMetadata.defaultFilterValues;
			bHasDefaultFilterValue = aDefaultFilterValues && aDefaultFilterValues.length;

			// if (!bHasDefaultFilterValue && oFilterFieldMetadata.defaultFilterValue || oFilterFieldMetadata.defaultPropertyValue) {
			if (!bHasDefaultFilterValue) {

				if (oFilterFieldMetadata.defaultPropertyValue && oFilterFieldMetadata.isParameter) {

					oDefaultFilterValue = oFilterFieldMetadata.defaultPropertyValue;

					if (oFilterFieldMetadata.filterType === "numeric") {
						oDefaultFilterValue = this._getType(oFilterFieldMetadata).parseValue(oDefaultFilterValue, "string");
					}

					aDefaultFilterValues = [
						{
							low: oDefaultFilterValue
						}
					];

					bHasDefaultFilterValue = true;

				} else if (oFilterFieldMetadata.defaultFilterValue) {

					oDefaultFilterValue = oFilterFieldMetadata.defaultFilterValue;
					aDefaultFilterValues = [
						{
							low: oDefaultFilterValue,
							high: oDefaultFilterValue,
							operator: "EQ",
							sign: "I"
						}
					];

					bHasDefaultFilterValue = true;
				}
			}

		}
		if (oFilterFieldMetadata.filterRestriction === FilterType.single) {
			// If there is a default filter value use only the low value of 1st one --> single filter scenario!
			if (bHasDefaultFilterValue) {
				oDefaultFilterValue = aDefaultFilterValues[0];
				sLowValue = bIsDateTimeType ? this._createDateTimeValue(oFilterFieldMetadata, oDefaultFilterValue.low) : oDefaultFilterValue.low;
			}

			oJSONData[oFilterFieldMetadata.fieldName] = sLowValue;

		} else if (oFilterFieldMetadata.filterRestriction === FilterType.interval && oFilterFieldMetadata.type !== "Edm.Time") {
			// If there is a default filter value use both low and high, but only of the 1st one --> interval filter scenario!
			if (bHasDefaultFilterValue) {
				oDefaultFilterValue = aDefaultFilterValues[0];
				sLowValue = bIsDateTimeType ? this._createDateTimeValue(oFilterFieldMetadata, oDefaultFilterValue.low) : oDefaultFilterValue.low;
				sHighValue = bIsDateTimeType ? this._createDateTimeValue(oFilterFieldMetadata, oDefaultFilterValue.high) : oDefaultFilterValue.high;
			}

			oJSONData[oFilterFieldMetadata.fieldName] = {
				low: sLowValue,
				high: sHighValue
			};
		} else {
			// If there is a default filter value use all the low values as keys --> multiple/range
			if (bHasDefaultFilterValue) {
				iLength = aDefaultFilterValues.length;
				while (iLength--) {
					oDefaultFilterValue = aDefaultFilterValues[iLength];
					if (bIsRangeField) {
						oItem = {
							"exclude": oDefaultFilterValue.sign === "E",
							// Convert "CP" from Configuration to "Contains"
							"operation": oDefaultFilterValue.operator === "CP" ? "Contains" : oDefaultFilterValue.operator,
							"keyField": oFilterFieldMetadata.fieldName,
							"value1": bIsDateTimeType ? this._createDateTimeValue(oFilterFieldMetadata, oDefaultFilterValue.low) : oDefaultFilterValue.low,
							"value2": bIsDateTimeType ? null : oDefaultFilterValue.high
						};

						if ((oFilterFieldMetadata.filterType === "time") && oDefaultFilterValue.high) {
							oItem.value2 = new Date(oDefaultFilterValue.high);
						}

					} else {
						oItem = {
							key: bIsDateTimeType ? this._createDateTimeValue(oFilterFieldMetadata, oDefaultFilterValue.low) : oDefaultFilterValue.low,
							text: bIsDateTimeType ? "" : oDefaultFilterValue.low
						};
					}

					aItems.push(oItem);
				}
			}
			// Add this to the local multi-value field array
			this._aFilterBarMultiValueFieldMetadata.push(oFilterFieldMetadata);
			// Update the model
			oJSONData[oFilterFieldMetadata.fieldName] = {
				value: null
			};
			if (bIsRangeField) {
				aRanges = aItems.slice(0);
				aItems = [];
				oJSONData[oFilterFieldMetadata.fieldName].ranges = aRanges;
			}
			oJSONData[oFilterFieldMetadata.fieldName].items = aItems;

			// Update the corresponding control with array value
			this._updateMultiValueControl(oFilterFieldMetadata.control, aItems, aRanges);
		}
	};

	FilterProvider.prototype._createDateTimeValue = function(oFilterFieldMetadata, sValue) {

		switch (oFilterFieldMetadata.type) {
			case "Edm.Time":
				if (sValue.indexOf("PT") === 0) {
					return this._getTime(sValue);
				} else {
					Log.error("Default value for " + oFilterFieldMetadata.fieldName + " could not be parsed.");
				}
				break;

			case "Edm.DateTime":
				// The expected format is yyyy-mm-dd[Thh:mm:ss[.mmm][Z]
				// Problem is that the DateTime type always handle the oValue with UTC true.
				// We ignore the time part and set it to "T00:00:00.000" (in the next version we will add Z)
				// Result is a Date object with "Wed Jan 1 2019 00:00:00 GMT+0100"
				if (typeof sValue == "string" && oFilterFieldMetadata.displayFormat && oFilterFieldMetadata.displayFormat.toLowerCase() == "date") {
					var aParts = sValue.split('T');
					sValue = aParts[0] + "T00:00:00";
					return new Date(sValue);
				} else {
					Log.error("Default value for " + oFilterFieldMetadata.fieldName + " could not be parsed.");
				}
				break;

			case "Edm.DateTimeOffset":
				return new Date(sValue);

			default:
				Log.error("Default value for " + oFilterFieldMetadata.fieldName + " could not be parsed.");
		}
	};

	/**
	 * Initialises the JSON model for filter fields
	 * @param {boolean} bUseDefaultValues - whether default values from configuration shall be used
	 * @private
	 */
	FilterProvider.prototype._createInitialModel = function(bUseDefaultValues) {
		var oJSONData, iGroupLength, iFieldLength, oGroup, j, i;
		oJSONData = {};
		this._bCreatingInitialModel = true;
		// This will now be recreated if required
		this._aFilterBarMultiValueFieldMetadata = [];
		if (this._aFilterBarViewMetadata) {
			iGroupLength = this._aFilterBarViewMetadata.length;
			for (i = 0; i < iGroupLength; i++) {
				oGroup = this._aFilterBarViewMetadata[i];
				iFieldLength = oGroup.fields.length;
				for (j = 0; j < iFieldLength; j++) {
					this._createInitialModelForField(oJSONData, oGroup.fields[j], bUseDefaultValues);
				}
			}
		}

		// set the initial model for analytical parameters
		if (this._aAnalyticalParameters) {
			iFieldLength = this._aAnalyticalParameters.length;
			for (j = 0; j < iFieldLength; j++) {
				this._createInitialModelForField(oJSONData, this._aAnalyticalParameters[j], bUseDefaultValues);
			}
		}

		this.oModel.setData(oJSONData);
		if (!bUseDefaultValues) {
			this._clearConditionTypeFields();
		}
		this._updateConditionTypeFields();
		this._bCreatingInitialModel = false;
	};

	/**
	 * Updates the multi-value control with initial/filter data
	 * @param {Object} oControl - the control to be updated
	 * @param {Array} aItems = the array of key, text values to be set in the control
	 * @param {Array} aRanges = the array of range values to be set in the control
	 * @param {Object} oFilterFieldMetadata = filter field metadata
	 * @private
	 */
	FilterProvider.prototype._updateMultiValueControl = function(oControl, aItems, aRanges, oFilterFieldMetadata) {
		var i = 0, aTokens = null, oToken = null, oRange = null, sText = null, aKeys = null, value1, value2, oType;
		// MultiComboBox and MultiInput fields cannot be bound, since the tokens are created internally and do not support 2 way binding
		// In case the model is reset/set initially, set the tokens manually through this
		if (oControl && aItems) {
			i = aItems.length;
			if (oControl instanceof MultiInput) {
				aTokens = [];
				while (i--) {
					sText = aItems[i].text || aItems[i].key;
					var oToken = new Token();
					oToken.setKey(aItems[i].key);
					oToken.setText(sText);
					oToken.setTooltip(sText);

					aTokens.push(oToken);
				}
				if (aRanges) {
					i = aRanges.length;
					while (i--) {
						oRange = aRanges[i];

						if ((oRange.value1 === "" || oRange.value1 === null) && (oRange.operation === FilterOperator.EQ)) {
							oRange.operation = ValueHelpRangeOperation.Empty;
							oRange.tokenText = FormatUtil.getFormattedRangeText(oRange.operation, null, null, oRange.exclude);

							// For dates we have to ensure value1 is null - no check needed as it works for strings also
							oRange.value1 = null;
						}

						if (oRange.tokenText) {
							sText = oRange.tokenText;
						} else {
							value1 = oRange.value1;
							value2 = oRange.value2;
							if (oFilterFieldMetadata) {

								var aDateTypes = [
									"date", "datetime", "time"
								];
								if (aDateTypes.indexOf(oFilterFieldMetadata.filterType) > -1) {

									oType = this._getType(oFilterFieldMetadata);
									if (oType) {

										// For DateTime we can use the oType to format the value, because we have ensured that UTC=false
										if (value1) {
											if (oFilterFieldMetadata.filterType === "time") {
												value1 = DateTimeUtil.dateToEdmTime(DateTimeUtil.localToUtc(value1));
											}
											value1 = oType.formatValue(value1, "string");
										}

										if (value2) {
											if (oFilterFieldMetadata.filterType === "time") {
												value2 = DateTimeUtil.dateToEdmTime(DateTimeUtil.localToUtc(value2));
											}
											value2 = oType.formatValue(value2, "string");
										}
									}

								} else if ((oFilterFieldMetadata.filterType === "numeric") || (oFilterFieldMetadata.filterType === "boolean")) {

									oType = this._getType(oFilterFieldMetadata);
									if (oType) {
										if (value1 !== "" && (value1 !== undefined)) {
											value1 = oType.formatValue(value1, "string");
										}

										if (value2 !== "" && (value2 !== undefined)) {
											value2 = oType.formatValue(value2, "string");
										}
									}

								} else {

									var bFormatAsDate = oFilterFieldMetadata.isCalendarDate || oFilterFieldMetadata.isFiscalDate || ((value1 instanceof Date) || (value2 instanceof Date));

									if (bFormatAsDate) {

										oType = this._getType(oFilterFieldMetadata);
										if (value1) {
											value1 = oType.formatValue(value1, "string");
										}
										if (value2) {
											value2 = oType.formatValue(value2, "string");
										}

									}
								}
							}

							sText = FormatUtil.getFormattedRangeText(oRange.operation, value1, value2, oRange.exclude);
						}
						oToken = new Token();
						oToken.setText(sText);
						oToken.setTooltip(sText);
						oToken.data("range", oRange);
						aTokens.push(oToken);
					}
				}
				oControl.setTokens(aTokens);
				oControl.fireTokenUpdate();
			}

			if (oControl instanceof MultiComboBox) {
				aKeys = [];
				while (i--) {
					aKeys.push(aItems[i].key);
				}
				oControl.setSelectedKeys(aKeys);
			}
		}
	};

	/**
	 * Updates the view metadata by applying index of groups and fields from the additional configuration.
	 * @private
	 */
	FilterProvider.prototype._applyIndexes = function() {
		var groupLength, i;

		if (!this._aFilterBarViewMetadata) {
			return;
		}

		// sort groups by index
		this._aFilterBarViewMetadata = this._sortByIndex(this._aFilterBarViewMetadata);

		groupLength = this._aFilterBarViewMetadata.length;
		for (i = 0; i < groupLength; i++) {
			// sort fields of a group by index
			if (this._aFilterBarViewMetadata[i].fields) {
				this._aFilterBarViewMetadata[i].fields = this._sortByIndex(this._aFilterBarViewMetadata[i].fields);
			}
		}
	};

	/**
	 * Returns a new Array containing all Elements from the incoming Array and the order was changed considering the indexes
	 * @param {Array} aArray - Array of objects having an index property
	 * @returns {Array} sorted array
	 * @private
	 */
	FilterProvider.prototype._sortByIndex = function(aArray) {
		var aFieldsHavingAnIndex, i, length, aResult, iIndex, oField;
		if (!aArray || !aArray.length) {
			return aArray;
		}
		aResult = [];
		aFieldsHavingAnIndex = [];
		length = aArray.length;
		for (i = 0; i < length; i++) {
			oField = aArray[i];
			iIndex = oField.index;
			if (iIndex >= 0) {
				aFieldsHavingAnIndex.push(oField);
			} else {
				aResult.push(oField); // add fields having no index to result...
			}
		}
		length = aFieldsHavingAnIndex.length;
		if (length) {
			// Sort fields having an index
			aFieldsHavingAnIndex = aFieldsHavingAnIndex.sort(function(field1, field2) {
				return field1.index - field2.index;
			});
			// Check if fields without index exist, if not, use the sorted indexed fields array as result
			if (!aResult.length) {
				aResult = aFieldsHavingAnIndex;
			} else {
				// add fields having an index at the right location (if possible) in result array
				for (i = 0; i < length; i++) {
					oField = aFieldsHavingAnIndex[i];
					if (oField.index >= aResult.length) {
						aResult.push(oField);
					} else {
						aResult.splice(oField.index, 0, oField);
					}
				}
			}
		}
		return aResult;
	};

	/**
	 * Updates the view metadata by applying the groupId from the additional configuration.
	 * @private
	 */
	FilterProvider.prototype._applyGroupId = function() {
		var groupLength, i, fieldLength, j, oField, oNewParentGroup, k;
		groupLength = this._aFilterBarViewMetadata.length;

		for (i = 0; i < groupLength; i++) {
			if (!this._aFilterBarViewMetadata[i].fields) { // if there are no fields...
				continue;
			}
			fieldLength = this._aFilterBarViewMetadata[i].fields.length;
			for (j = 0; j < fieldLength; j++) {
				oField = this._aFilterBarViewMetadata[i].fields[j];
				if (oField && oField.groupId && oField.groupId !== this._aFilterBarViewMetadata[i].groupName) {
					// Find new parent group
					oNewParentGroup = undefined;
					for (k = 0; k < groupLength; k++) {
						if (this._aFilterBarViewMetadata[k].groupName === oField.groupId) {
							oNewParentGroup = this._aFilterBarViewMetadata[k];
							break;
						}
					}

					// Move field to new parent group
					if (oNewParentGroup) {
						this._aFilterBarViewMetadata[i].fields.splice(j, 1);
						j--;
						fieldLength--;
						oNewParentGroup.fields = oNewParentGroup.fields || [];
						oNewParentGroup.fields.push(oField);
					}
				}
			}
		}
	};

	/**
	 * Creates an id for a filter control based on its field view metadata.
	 * @param {Object} oFieldViewMetadata - resolved filter view data with OData metadata and control configuration
	 * @returns {String} Id of a control used inside the SmartFilterBar
	 * @private
	 */
	FilterProvider.prototype._createFilterControlId = function(oFieldViewMetadata) {
		var sFilterBarName = this._oSmartFilter ? this._oSmartFilter.getId() : "unit-test";
		var sGroupId = IdentifierUtil.replace(oFieldViewMetadata.groupId || "");
		var sName = IdentifierUtil.replace(oFieldViewMetadata.fieldName);

		return sFilterBarName + "-filterItemControl" + sGroupId + "-" + sName;
	};

	/**
	 * Creates a group based on the OData metadata
	 * @private
	 * @param {object} oODataFilterBarGroup - OData metadata for group
	 * @returns {object} view metadata for group
	 */
	FilterProvider.prototype._createGroupMetadata = function(oODataFilterBarGroup) {
		var oGroupMetadata, oGroupConfiguration = null, sGroupName;

		sGroupName = oODataFilterBarGroup.groupName || oODataFilterBarGroup.groupEntitySetName;

		if (this._oAdditionalConfiguration) {
			// Get additional configuration for groups
			oGroupConfiguration = this._oAdditionalConfiguration.getGroupConfigurationByKey(sGroupName);
		}

		oGroupMetadata = {};
		oGroupMetadata.groupName = sGroupName;
		oGroupMetadata.groupLabel = this._getGroupLabel(oODataFilterBarGroup, oGroupConfiguration); // if label is specified in additional
		// configuration,
		// pick this
		// one
		oGroupMetadata.fields = [];
		oGroupMetadata.index = this._getGroupIndex(oGroupConfiguration);

		return oGroupMetadata;
	};

	/**
	 * Creates a group based on the additional configuration (GroupConfiguration)
	 * @private
	 * @param {object} oGroupConfiguration - OData metadata for group
	 * @returns {object} view metadata for group
	 */
	FilterProvider.prototype._createGroupMetadataForCustomGroup = function(oGroupConfiguration) {
		var oGroupMetadata;

		oGroupMetadata = {};
		oGroupMetadata.groupName = oGroupConfiguration.key;
		oGroupMetadata.groupLabel = oGroupConfiguration.label;
		// one
		oGroupMetadata.fields = [];
		oGroupMetadata.index = this._getGroupIndex(oGroupConfiguration);

		return oGroupMetadata;
	};

	FilterProvider.prototype._getTime = function(sValue) {
		var oFormat = DateFormat.getTimeInstance({
			pattern: "'PT'hh'H'mm'M'ss'S'"
		});

		return oFormat.parse(sValue);
	};

	FilterProvider.prototype._checkMetadataDefaultValue = function(oFieldViewMetadata) {
		var sDefaultValue = oFieldViewMetadata.defaultFilterValue || oFieldViewMetadata.defaultPropertyValue;

		if (sDefaultValue) {

			try {
				if ((oFieldViewMetadata.type === "Edm.Time") && (sDefaultValue.indexOf("PT") === 0)) {
					this._getTime(sDefaultValue);
				} else {
					this._getType(oFieldViewMetadata);
				}

			} catch (ex) {
				oFieldViewMetadata.defaultPropertyValue = null;
				oFieldViewMetadata.defaultFilterValue = null;
				Log.error("default value for " + oFieldViewMetadata.fieldName + " could not be parsed.");
			}
		}
	};

	FilterProvider.prototype._getType = function(oFieldViewMetadata) {
		var oType, oFormatOptions = {}, oConstraints = {}, oSettings = {};

		if (oFieldViewMetadata.ui5Type) {
			return oFieldViewMetadata.ui5Type;
		}

		// Set constraints from metadata
		if (oFieldViewMetadata.precision || oFieldViewMetadata.scale) {
			oConstraints.precision = oFieldViewMetadata.precision;
			oConstraints.scale = oFieldViewMetadata.scale;
		}
		if (oFieldViewMetadata.maxLength) {
			oConstraints.maxLength = oFieldViewMetadata.maxLength;
		}
		if (oFieldViewMetadata.displayFormat) {
			oConstraints.displayFormat = oFieldViewMetadata.displayFormat;
		}
		if (oFieldViewMetadata.isDigitSequence) {
			oConstraints.isDigitSequence = oFieldViewMetadata.isDigitSequence;
		}

		if (oFieldViewMetadata.isCalendarDate) {
			oSettings.isCalendarDate = true;
		}

		if (oFieldViewMetadata.isFiscalDate && oFieldViewMetadata.fiscalType) {
			oSettings.isFiscalDate = true;
			oSettings.fiscalType = oFieldViewMetadata.fiscalType;
		}

		// Set Format options from metadata (only for date type for now)
		if ((oFieldViewMetadata.filterType === "date") || (oFieldViewMetadata.filterType === "time") || (oFieldViewMetadata.filterType === "datetime") || oFieldViewMetadata.isCalendarDate) {
			oFormatOptions = Object.assign({}, this._oDateFormatSettings, {
				UTC: false
			});
		}

		oType = ODataType.getType(oFieldViewMetadata.type, oFormatOptions, oConstraints, oSettings);

		return oType;
	};

	/**
	 * Sets display format to the given control based on the display format object taking care of the proper precedence
	 * from the oDateFormatSettings object.
	 * @param {object} oControl
	 * @param {object} oDateFormatSettings
	 * @private
	 */
	FilterProvider.prototype._setControlDisplayFormat = function (oControl, oDateFormatSettings) {
		var sDateFormat;

		if (!oDateFormatSettings) {
			return;
		}

		// We take "style" with precedence over "pattern"
		sDateFormat = oDateFormatSettings.style || oDateFormatSettings.pattern;
		if (!sDateFormat) {
			return;
		}

		oControl.setDisplayFormat(sDateFormat);
	};

	/**
	 * Creates the control instance based on the OData Metadata and additional configuration
	 * @param {Object} oFieldViewMetadata - resolved filter view data with OData metadata and control configuration
	 * @returns {Object} an instance of the control to be used in the SmartFilterBar
	 * @private
	 */
	FilterProvider.prototype._createControl = function(oFieldViewMetadata) {
		var oControl, oType, bIsInterval = false, iMaxLength, fClearModel;

		// if a custom control is specified, use it
		if (oFieldViewMetadata.customControl) {
			return oFieldViewMetadata.customControl;
		}

		oType = this._getType(oFieldViewMetadata);

		oControl = new oFieldViewMetadata.fControlConstructor(this._createFilterControlId(oFieldViewMetadata));
		if (oFieldViewMetadata.fControlConstructor === DateRangeSelection) {

			this._setControlDisplayFormat(oControl, this._oDateFormatSettings);

			if (oFieldViewMetadata.isCalendarDate) {
				oControl.bindProperty("dateValue", {
					path: this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/low",
					type: oType
				});

				oControl.bindProperty("secondDateValue", {
					path: this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/high",
					type: oType
				});
			} else {
				oControl.bindProperty("dateValue", this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/low");
				oControl.bindProperty("secondDateValue", this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/high");
			}
		} else if ((oFieldViewMetadata.fControlConstructor === ComboBox) || (oFieldViewMetadata.fControlConstructor === Select)) {
			if (oControl.setForceSelection) {
				oControl.setForceSelection(true);
			}
			if (oFieldViewMetadata.fControlConstructor === Select) {
				oControl.addItem(new Item({
					key: "",
					text: ""
				}));
				oControl.addItem(new Item({
					key: false,
					text: oType.formatValue(false, "string")
				}));
				oControl.addItem(new Item({
					key: true,
					text: oType.formatValue(true, "string")
				}));

			} else {
				this._associateValueList(oControl, "items", oFieldViewMetadata);

				// Listen to the selection change and update the model accordingly
				oControl.attachSelectionChange(function() {
					// Do nothing while the data is being created/updated!
					if (this._bUpdatingFilterData || this._bCreatingInitialModel) {
						return;
					}
					// Manually trigger the change event on sapUI5 control since it doesn't do this internally on selectionChange!
					oControl.fireChange({
						filterChangeReason: oFieldViewMetadata.fieldName,
						value: ""
					});
				}.bind(this));
			}

			oControl.bindProperty('selectedKey', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName);
		} else if (oFieldViewMetadata.fControlConstructor === MultiComboBox) {
			this._associateValueList(oControl, "items", oFieldViewMetadata);
			// Listen to the selection change and update the model accordingly
			oControl.attachSelectionChange(function(oEvt) {
				// Do nothing while the data is being created/updated!
				if (this._bUpdatingFilterData || this._bCreatingInitialModel) {
					return;
				}
				var oCtrl = oEvt.getSource(), aSelectedItems = null, aKeys = [], iLength;
				aSelectedItems = oCtrl.getSelectedItems();
				if (aSelectedItems) {
					iLength = aSelectedItems.length;
					while (iLength--) {
						aKeys.push({
							key: aSelectedItems[iLength].getKey(),
							text: aSelectedItems[iLength].getText()
						});
					}
				}
				if (this.oModel) {
					this.oModel.setProperty("/" + oFieldViewMetadata.fieldName + "/items", aKeys);
				}
				// Manually trigger the change event on sapUI5 control since it doesn't do this internally on selectionChange!
				oCtrl.fireChange({
					filterChangeReason: oFieldViewMetadata.fieldName,
					value: ""
				});
			}.bind(this));
			oControl.bindProperty("value", this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/value");
		} else if (oFieldViewMetadata.fControlConstructor === MultiInput) {
			if (oFieldViewMetadata.controlType === ControlType.date || oFieldViewMetadata.type === "Edm.Time" || oFieldViewMetadata.type === "Edm.DateTimeOffset") {
				oControl.setValueHelpOnly(true);
				if (oFieldViewMetadata.filterRestriction === FilterType.interval) {
					this._associateValueHelpDialog(oControl, oFieldViewMetadata, false, false);
				} else {
					this._associateValueHelpDialog(oControl, oFieldViewMetadata, true, true);
				}
			} else {
				if (oFieldViewMetadata.hasValueHelpDialog) {
					this._associateValueHelpDialog(oControl, oFieldViewMetadata, oFieldViewMetadata.filterRestriction !== FilterType.multiple, true);
				} else {
					oControl.setShowValueHelp(false);
				}

				oControl.bindProperty("value", {
					path: this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/value",
					type: oType
				});
			}

			this._handleMultiInput(oControl, oFieldViewMetadata, oType);
		} else if (oFieldViewMetadata.fControlConstructor === Input) {
			if (oFieldViewMetadata.filterRestriction === FilterType.interval) {
				bIsInterval = true;
				// we assume the interval values shall be split by "-"; so bind only to low and resolve this later while creating the filters
				oControl.bindProperty("value", this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/low");

				if (!this.oResourceBundle) {
					this.oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
				}
				if (!this.sIntervalPlaceholder) {
					this.sIntervalPlaceholder = this.oResourceBundle.getText("INTERVAL_PLACEHOLDER_TEXT");
				}
				oControl.setPlaceholder(this.sIntervalPlaceholder);
			} else {
				oControl.bindProperty('value', {
					path: this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName,
					type: oType
				});
			}
			if (oFieldViewMetadata.hasValueHelpDialog) {
				oControl.setShowValueHelp(true);
				this._associateValueHelpDialog(oControl, oFieldViewMetadata, false, false);
			}
		} else if (oFieldViewMetadata.isCalendarDate) {
			this._setControlDisplayFormat(oControl, this._oDateFormatSettings);

			oControl.bindProperty("dateValue", {
				path: this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName,
				type: oType
			});
		} else if (oFieldViewMetadata.fControlConstructor === DatePicker) {
			oControl.bindProperty("dateValue", this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName);

			this._setControlDisplayFormat(oControl, this._oDateFormatSettings);
		} else if (oFieldViewMetadata.fControlConstructor === TimePicker || oFieldViewMetadata.fControlConstructor === DateTimePicker) {
			oControl.bindProperty("dateValue", this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName);

			if (this._oDateFormatSettings && this._oDateFormatSettings.style) {
				oControl.setDisplayFormat(this._oDateFormatSettings.style);
			}
		}

		if (oControl instanceof DatePicker) {
			// Error handling for DatePicker controls!
			oControl.attachChange(function(oEvent) {
				var bValid = oEvent.getParameter("valid");
				// Clear mandatory empty error state flag
				oControl.data("__mandatoryEmpty", null);
				if (bValid) {
					// If value is valid clear value state
					oControl.setValueState(ValueState.None);
					oControl.setValueStateText();
				} else {
					// Parse string value to a date object (for DateRangeSelection, array of date objects).
					// This value will be checked against min/max date of the control.
					// The code will be removed when Date controls implement a parameter to tell what is the reason for
					// invalid state of the control
					var vParsedValue = oControl._parseValue(oEvent.getParameter("newValue")),
						aSelectedDateRange = this._getSelectedDateRange(vParsedValue);

					// If value is invalid set value state as error
					oControl.setValueState(ValueState.Error);

					if (aSelectedDateRange[0] && aSelectedDateRange[1]) {
						var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp"),
							sErrorText = this._getDateFieldOutOfRangeErrorText(oControl, aSelectedDateRange, oType, oRb);

						oControl.setValueStateText(sErrorText);
					} else if (oType) {
						try {
							oType.parseValue("foo", "string");
						} catch (oEx) {
							// If value is invalid --> set value state text from exception message
							oControl.setValueStateText(oEx.message);
						}
					}
				}
			}.bind(this));
		}

		if (oFieldViewMetadata.hasTypeAhead) {
			oControl.setShowSuggestion(true);
			oControl.setFilterSuggests(false);
			this._associateValueList(oControl, "suggestionRows", oFieldViewMetadata, true);
		}

		// Convert typed in values to UpperCase for displayFormat = UpperCase
		if ((oFieldViewMetadata.displayFormat === "UpperCase") && (oFieldViewMetadata.controlType !== ControlType.dropDownList) && oControl.attachChange && oControl.getValue && oControl.setValue) {

			oControl.attachChange(function(oEvent) {
				var sValue = oControl.getValue();
				if (sValue) {
					oControl.setValue(sValue.toUpperCase());
				}
			});

			if (this._mTokenHandler[oControl.getId()] && this._mTokenHandler[oControl.getId()].parser) {
				var oTokenParser = this._mTokenHandler[oControl.getId()].parser;
				oTokenParser.getKeyFields()[0].displayFormat = oFieldViewMetadata.displayFormat;
			}
		}

		// Additional handling for Input and MultiInput
		if (oControl instanceof Input) {
			// MaxLength handling
			if (oFieldViewMetadata.maxLength) {
				iMaxLength = parseInt(oFieldViewMetadata.maxLength);
				if (!isNaN(iMaxLength)) {
					if (this._mTokenHandler[oControl.getId()] && this._mTokenHandler[oControl.getId()].parser) {
						var oTokenParser = this._mTokenHandler[oControl.getId()].parser;
						oTokenParser.getKeyFields()[0].maxLength = iMaxLength;
					} else {
						// Set MaxLength for fields without any ValueListAnnotation and non intervals and no TokenParser
						if (!oFieldViewMetadata.hasValueListAnnotation && !bIsInterval) {
							oControl.setMaxLength(iMaxLength);
						}
					}
				}
			}

			if (oFieldViewMetadata.isFiscalDate) {
				oControl.setPlaceholder(oType.formatter.getPattern());
			}
		}

		// Special handling when users clears the value or enters an invalid one
		fClearModel = function(oEvent) {
			var oException = oEvent.getParameter("exception");
			var oExceptionControl = oEvent.getParameter("element");
			if (oControl && oExceptionControl && (oControl.getId() === oExceptionControl.getId())) {
				if (oException) {
					if (oControl.setValueStateText) {
						oControl.setValueStateText(oException.message);
					}
				}
				if (oControl.setValueState) {
					oControl.setValueState(ValueState.Error);
				}
				// Clear mandatory empty error state flag
				oControl.data("__mandatoryEmpty", null);
			}
		};
		oControl.attachParseError(fClearModel);
		oControl.attachFormatError(fClearModel);
		oControl.attachValidationError(fClearModel);
		oControl.attachValidationSuccess(function(oEvent) {
			var oValidationControl = oEvent.getParameter("element");
			if (oControl && oValidationControl && (oControl.getId() === oValidationControl.getId())) {
				if (oControl.setValueState) {
					oControl.setValueState(ValueState.None);
				}
				if (oControl.setValueStateText) {
					oControl.setValueStateText();
				}
				// Clear mandatory empty error state flag
				oControl.data("__mandatoryEmpty", null);
				// Clear the ValidationText set during validation request
				delete oControl.__sValidationText;
			}
		});

		return oControl;
	};

	/**
	 * Creates the control instance based on the OData Metadata and additional configuration
	 * @param {Object} oFieldViewMetadata - view metadata for the filter field
	 * @returns {function} the constructor function of the control
	 * @private
	 */
	FilterProvider.prototype._getControlConstructor = function(oFieldViewMetadata, sParamPrefix) {
		// default to input
		var fControlConstructor = Input, bFilterRestrictionSingle, bFilterRestrictionInterval, sPrefixedFieldName;

		sPrefixedFieldName = sParamPrefix ? sParamPrefix + oFieldViewMetadata.fieldName : oFieldViewMetadata.fieldName;

		// if a custom control is specified, use it
		if (oFieldViewMetadata.isCustomFilterField) {
			fControlConstructor = undefined;
		} else {
			bFilterRestrictionSingle = (oFieldViewMetadata.filterRestriction === FilterType.single);
			bFilterRestrictionInterval = (oFieldViewMetadata.filterRestriction === FilterType.interval);

			if (oFieldViewMetadata.controlType === ControlType.date) {
				// If Date controls are being used --> force the displayFormat to be Date
				oFieldViewMetadata.displayFormat = "Date";
				if (bFilterRestrictionSingle) {
					fControlConstructor = DatePicker;
				} else {
					fControlConstructor = bFilterRestrictionInterval ? DateRangeSelection : MultiInput;
				}
				if (oFieldViewMetadata.isCalendarDate) {
					this._aFilterBarStringDateFieldNames.push(sPrefixedFieldName); // Date fields need special handling to always store Date objects
				} else {
					this._aFilterBarDateFieldNames.push(sPrefixedFieldName); // Date fields need special handling to always store Date objects
				}
				if (oFieldViewMetadata.filterRestriction === FilterType.multiple) {
					this._aFilterBarDateTimeMultiValueFieldNames.push(sPrefixedFieldName);
				}
			} else if (oFieldViewMetadata.controlType === ControlType.dropDownList) {
				if (bFilterRestrictionSingle) {
					fControlConstructor = this._isBooleanWithFixedValuedButWithoutValueListAnnotation(oFieldViewMetadata) ? Select : ComboBox;
				} else {
					fControlConstructor = MultiComboBox;
				}

				// Filter Restriction is defaulted to auto, reset it to multiple if it is a MultiComboBox
				if (!bFilterRestrictionSingle) {
					oFieldViewMetadata.filterRestriction = FilterType.multiple;
				}
			} else if (oFieldViewMetadata.type === "Edm.Time") {
				if (bFilterRestrictionSingle) {
					fControlConstructor = TimePicker;
				} else {
					fControlConstructor = MultiInput;
				}
				this._aFilterBarTimeFieldNames.push(sPrefixedFieldName); // Time fields need special handling to send back time values
				if (bFilterRestrictionInterval) {
					this._aFilterBarTimeIntervalFieldNames.push(sPrefixedFieldName);
				} else if (oFieldViewMetadata.filterRestriction === FilterType.multiple) {
					this._aFilterBarDateTimeMultiValueFieldNames.push(sPrefixedFieldName);
				}
			} else if (!bFilterRestrictionInterval && oFieldViewMetadata.controlType === ControlType.dateTimePicker) {
				if (bFilterRestrictionSingle) {
					fControlConstructor = DateTimePicker;
				} else {
					fControlConstructor = MultiInput;
				}

				this._aFilterBarDateTimeFieldNames.push(sPrefixedFieldName); // DateTime fields need special handling to send back time values
				if (oFieldViewMetadata.filterRestriction === FilterType.multiple) {
					this._aFilterBarDateTimeMultiValueFieldNames.push(sPrefixedFieldName);
				}
			} else if (bFilterRestrictionInterval && oFieldViewMetadata.type === "Edm.DateTimeOffset") {
				this._aFilterBarDateTimeFieldNames.push(sPrefixedFieldName);
			} else if (!bFilterRestrictionSingle && !bFilterRestrictionInterval) {
				fControlConstructor = MultiInput;
			}
		}
		return fControlConstructor;
	};

	FilterProvider.prototype._handleTokenUpdate = function (oEvt, oData) {
		var aRemovedTokens,
			oControl = oData.control,
			oFieldViewMetadata = oData.fieldViewMetadata,
			aTokens,
			aItems = [],
			iLength,
			oToken,
			oRangeData,
			aRanges = [],
			sBindingPath = "/" + oFieldViewMetadata.fieldName;

		// Do nothing while the data is being created/updated
		if (this._bUpdatingFilterData || this._bCreatingInitialModel) {
			return;
		}

		aRemovedTokens = oEvt && oEvt.getParameter("removedTokens");
		aTokens = oControl.getTokens();
		if (aRemovedTokens) {
			aTokens = aTokens.filter(function (oToken) {
				// Filter out if there are any removed tokens - no need to do it for the add operation
				return aRemovedTokens.indexOf(oToken) === -1;
			});
		}

		if (aTokens) {
			iLength = aTokens.length;
			while (iLength--) {
				oToken = aTokens[iLength];
				oRangeData = oToken.data("range");
				// Check if token is a range token
				if (oRangeData) {
					oRangeData.tokenText = oToken.getText();

					if (oRangeData && (oToken.getKey().indexOf("range_") === 0)) {
						if (oFieldViewMetadata.type === "Edm.Time") {
							if (oRangeData.value1 && oRangeData.value1.ms) {
								oRangeData.value1 = DateTimeUtil.utcToLocal(DateTimeUtil.edmTimeToDate(oRangeData.value1));
							}
							if (oRangeData.value2 && oRangeData.value2.ms) {
								oRangeData.value2 = DateTimeUtil.utcToLocal(DateTimeUtil.edmTimeToDate(oRangeData.value2));
							}
						}
					}

					aRanges.push(oRangeData);
				} else {
					// Items array
					aItems.push({
						key: oToken.getKey(),
						text: oToken.getText()
					});
				}
			}
		}

		if (this.oModel) {
			this.oModel.setProperty(sBindingPath + "/items", aItems);
			this.oModel.setProperty(sBindingPath + "/ranges", aRanges);
		}

		if (oControl.__bValidatingToken) {
			delete oControl.__bValidatingToken;
		}

		// Manually trigger the change event on sapUI5 control since it doesn't do this internally on setValue!
		oControl.fireChange({
			filterChangeReason: oFieldViewMetadata.fieldName,
			value: ""
		});
	};

	/**
	 * handles MultiInput specific changes
	 * @param {object} oControl - The control
	 * @param {object} oFieldViewMetadata - The metadata merged from OData metadata and additional control configuration
	 * @param {object} oType - odata type of the current field
	 * @private
	 */
	FilterProvider.prototype._handleMultiInput = function(oControl, oFieldViewMetadata, oType) {

		oControl.attachTokenUpdate({
			control: oControl,
			fieldViewMetadata: oFieldViewMetadata
		}, this._handleTokenUpdate, this);

		var oDateValue, bDateFormat = ((oFieldViewMetadata.type === "Edm.DateTime" && oFieldViewMetadata.displayFormat === "Date"));

		// Copy/Paste for multi values can work property only for String fields
		if (oFieldViewMetadata.hasValueListAnnotation || (oFieldViewMetadata.type === "Edm.String") || bDateFormat) {
			// Handle internal _validateOnPaste event from MultiInput
			oControl.attachEvent("_validateOnPaste", function(oEvent) {
				var aTexts = oEvent.getParameter("texts"), oProperty, iLength, sText, sTokenText, aRanges;
				iLength = aTexts ? aTexts.length : 0;
				// When more than 1 text exists .. directly add it on the Input without any validation!
				if (iLength > 1) {
					// prevent the default behaviour --> (validation will not be done in the MultiInput)
					oEvent.preventDefault();
					// Get relevant property
					oProperty = this.oModel.getProperty("/" + oFieldViewMetadata.fieldName);
					// get existing ranges, if any
					aRanges = oProperty.ranges || [];
					// first clear the value on the MultiInput
					oControl.setValue("");
					// _updateMultiValue uses a reverse while to add tokens; use a reverse while here as well to make the tokens appear in same order
					// as pasted
					while (iLength--) {
						sText = aTexts[iLength];
						if (sText) {
							sTokenText = null;

							if (bDateFormat) {
								oDateValue = this._getDateValue(sText, oType);
								if (isNaN(oDateValue.getDate())) {
									continue;
								} else {
									sTokenText = sText;
									sText = oDateValue;
								}
							}

							// Add text to ranges
							aRanges.push({
								"exclude": false,
								"operation": "EQ",
								"keyField": oFieldViewMetadata.fieldName,
								"value1": sText,
								"value2": null,
								"tokenText": sTokenText

							});
						}
					}
					// Set the updated ranges back to the model
					this.oModel.setProperty("/" + oFieldViewMetadata.fieldName + "/ranges", aRanges);

					// trigger update on the control
					this._updateMultiValueControl(oControl, oProperty.items, aRanges, oFieldViewMetadata);
				}
			}.bind(this));
		}
	};

	/**
	 * Associates the control with a ValueHelp Dialog using the details retrieved from the metadata (annotation)
	 * @param {object} oControl - The control
	 * @param {object} oFieldViewMetadata - The metadata merged from OData metadata and additional control configuration
	 * @param {boolean} bSupportRanges - Specify if the ValueHelpDialog supports ranges
	 * @param {boolean} bSupportMultiselect - Specify if the ValueHelpDialog supports multi select
	 * @private
	 */
	FilterProvider.prototype._associateValueHelpDialog = function(oControl, oFieldViewMetadata, bSupportRanges, bSupportMultiselect) {
		var mParams = {
			fieldName: oFieldViewMetadata.fieldName,
			control: oControl,
			model: this._oParentODataModel,
			filterModel: this.oModel,
			filterProvider: this,
			dateFormatSettings: this._oDateFormatSettings,
			fieldViewMetadata: oFieldViewMetadata,
			displayFormat: oFieldViewMetadata.displayFormat,
			displayBehaviour: oFieldViewMetadata.displayBehaviour,
			loadAnnotation: oFieldViewMetadata.hasValueListAnnotation,
			fullyQualifiedFieldName: oFieldViewMetadata.fullName,
			metadataAnalyser: this._oMetadataAnalyser,

			preventInitialDataFetchInValueHelpDialog: oFieldViewMetadata.preventInitialDataFetchInValueHelpDialog,
			// title: this._determineFieldLabel(oFieldViewMetadata), //oFieldViewMetadata.label,
			supportMultiSelect: bSupportMultiselect,
			supportRanges: bSupportRanges,
			isSingleIntervalRange: oFieldViewMetadata.filterRestriction === FilterType.interval,
			isUnrestrictedFilter: oFieldViewMetadata.filterRestriction !== FilterType.multiple,
			type: oFieldViewMetadata.filterType,
			maxLength: oFieldViewMetadata.maxLength,
			scale: oFieldViewMetadata.scale,
			precision: oFieldViewMetadata.precision
		};

		if (oFieldViewMetadata.isCalendarDate) {
			mParams.oType = this._getType(oFieldViewMetadata);
		}

		var oValueHelpProvider = new ValueHelpProvider(mParams);

		oValueHelpProvider.attachValueListChanged(function(oEvent) {
			if (this._oSmartFilter) {
				this._oSmartFilter.fireFilterChange(oEvent);
				this._oSmartFilter.validateMandatoryFields();
			}
		}.bind(this));

		if (oFieldViewMetadata.visibleInAdvancedArea || (oFieldViewMetadata.groupId === FilterProvider.BASIC_FILTER_AREA_ID)) {
			oValueHelpProvider.loadAnnotation();
		}

		this._aValueHelpDialogProvider.push(oValueHelpProvider);

		if (bSupportRanges && oControl.addValidator) {
			var oTokenParser = new TokenParser();
			oTokenParser.addKeyField({
				key: oFieldViewMetadata.fieldName,
				label: oFieldViewMetadata.label,
				type: oFieldViewMetadata.filterType,
				oType: oFieldViewMetadata.ui5Type
			});
			if (oFieldViewMetadata.filterType === "numeric") {
				oTokenParser.setDefaultOperation("EQ");
			}
			oTokenParser.associateInput(oControl);
			this._mTokenHandler[oControl.getId()] = {
				parser: oTokenParser
			};

		}
	};

	FilterProvider.prototype._determineFieldLabel = function(oFieldViewMetadata) {
		var oFilterItem, sLabel = oFieldViewMetadata.label;
		if (this._oSmartFilter && this._oSmartFilter.determineFilterItemByName) {
			oFilterItem = this._oSmartFilter.determineFilterItemByName(oFieldViewMetadata.name);
			if (oFilterItem) {
				sLabel = oFilterItem.getLabel();
			}
		}

		return sLabel;
	};

	/**
	 * Associates the control with a ValueList using the details retrieved from the metadata (annotation)
	 * @param {object} oControl - The control
	 * @param {string} sAggregation - The aggregation in the control to bind to
	 * @param {object} oFieldViewMetadata - The metadata merged from OData metadata and additional control configuration
	 * @param {boolean} bHasTypeAhead - Indicates whether the control also supports TypeAhead aka Suggest
	 * @private
	 */
	FilterProvider.prototype._associateValueList = function(oControl, sAggregation, oFieldViewMetadata, bHasTypeAhead) {
		var oValueListProvider;

		if (this._oSmartFilter && !this._bAttachInitializedDone && new UriParameters(window.location.href).get("sap-ui-comp-filterbar-data-defer")) {
			var oParentODataModel = this._oParentODataModel;
			this._sDeferredGroupId = "sapUiCompFilterBarData";
			var aDeferredGroups = oParentODataModel.getDeferredGroups ? this._oParentODataModel.getDeferredGroups() : null;
			// note: sap.ui.model.odata.ODataModel does not support deferredGroups
			if (aDeferredGroups !== null) {
				aDeferredGroups.push(this._sDeferredGroupId);
				oParentODataModel.setDeferredGroups(aDeferredGroups);
				var fn = function() {
					oParentODataModel.submitChanges({
						groupId: this._sDeferredGroupId
					});
					// after initial filterItems, we revert back to normal - not deferred - operation
					var aDeferredGroups = oParentODataModel.getDeferredGroups().filter(function(item) {
						return item !== this._sDeferredGroupId;
					}.bind(this));
					oParentODataModel.setDeferredGroups(aDeferredGroups);
					delete this._sDeferredGroupId;
					this._oSmartFilter.detachInitialized(fn);
				}.bind(this);
				this._oSmartFilter.attachInitialized(fn);
				this._bAttachInitializedDone = true;
			}
		}

		if (oFieldViewMetadata.hasValueListAnnotation) {
			oValueListProvider = new ValueListProvider({
				fieldName: oFieldViewMetadata.fieldName,
				control: oControl,
				model: this._oParentODataModel,
				filterModel: this.oModel,
				filterProvider: this,
				displayFormat: oFieldViewMetadata.displayFormat,
				dateFormatSettings: this._oDateFormatSettings,
				fieldViewMetadata: oFieldViewMetadata,
				// resolveInOutParams
				displayBehaviour: oFieldViewMetadata.displayBehaviour,
				loadAnnotation: true,
				fullyQualifiedFieldName: oFieldViewMetadata.fullName,
				metadataAnalyser: this._oMetadataAnalyser,
				// annotation
				// additionalAnnotations
				type: oFieldViewMetadata.filterType,

				//ValueListProvider
				aggregation: sAggregation,
				typeAheadEnabled: bHasTypeAhead,
				// enableShowTableSuggestionValueHelp
				// dropdownItemKeyType;
				deferredGroupId: this._sDeferredGroupId,
				context: "SmartFilterBar"
			});

			oValueListProvider.attachValueListChanged(function(oEvent) {
				if (this._oSmartFilter) {
					this._oSmartFilter.fireFilterChange(oEvent);
					this._oSmartFilter.validateMandatoryFields();
				}
			}.bind(this));

			if (oFieldViewMetadata.visibleInAdvancedArea || (oFieldViewMetadata.groupId === FilterProvider.BASIC_FILTER_AREA_ID)) {
				oValueListProvider.loadAnnotation();
			}

			this._aValueListProvider.push(oValueListProvider);
		} else if (this._mTokenHandler[oControl.getId()] && this._mTokenHandler[oControl.getId()].parser) {
			this._mTokenHandler[oControl.getId()].parser.setDefaultOperation("EQ");
		}
	};

	FilterProvider.prototype._createAnalyticParameters = function(oParameterization) {
		// Determine all parameters
		var oEntitySet, aParameterNames;

		if (oParameterization) {
			aParameterNames = oParameterization.getAllParameterNames();
			oEntitySet = oParameterization.getEntitySet();

			if (oEntitySet) {
				this._createParametersByEntitySetName(oEntitySet.getQName(), aParameterNames);
			}
		}
	};

	FilterProvider.prototype._createParametersByEntitySetName = function(sEntitySetName, aParameterNames) {

		var oParameterMetadata, aParameterMetadataOData = this._oMetadataAnalyser.getFieldsByEntitySetName(sEntitySetName);

		for (var i = 0; i < aParameterMetadataOData.length; i++) {

			if (aParameterNames.indexOf(aParameterMetadataOData[i].name) >= 0) {
				oParameterMetadata = this._createAnalyticParameterMetadata(aParameterMetadataOData[i]);

				if (oParameterMetadata && oParameterMetadata.visible) {

					// non-analytical parameters with a custom control will be ignored
					if (this._oNonAnaParameterization && oParameterMetadata.isCustomFilterField) {
						continue;
					}

					this._aAnalyticalParameters.push(oParameterMetadata);
				}
			}
		}
	};

	FilterProvider.prototype._createAnalyticParameterMetadata = function(oParameterMetadataOData) {

		var oFieldMetadata, sParamPrefix = library.ANALYTICAL_PARAMETER_PREFIX;

		oParameterMetadataOData.filterRestriction = "single-value";

		oFieldMetadata = this._createFieldMetadata(oParameterMetadataOData, sParamPrefix);
		if (oFieldMetadata) {
			oFieldMetadata.fieldName = sParamPrefix + oParameterMetadataOData.name;
			oFieldMetadata.isMandatory = true;
			oFieldMetadata.isParameter = true;
			oFieldMetadata.visibleInAdvancedArea = true;
		} else {
			Log.error("_createAnalyticParameterMetadata issue with property: " + oParameterMetadataOData.name);
		}

		return oFieldMetadata;
	};

	/**
	 * Returns a list of analytical paramaters
	 * @returns {array} List of names of analytical paramaters. Array can be empty, if none exists.
	 * @protected
	 */
	FilterProvider.prototype.getAnalyticParameters = function() {
		return this._aAnalyticalParameters;
	};

	/**
	 * Returns selection variants
	 * @returns {array} of SelectionVariant annotations.
	 * @protected
	 */
	FilterProvider.prototype.getSelectionVariants = function() {
		return this._aSelectionVariants;
	};

	/**
	 * Returns the binding paths for the analytic paramaters
	 * @returns {string} Binding path of the analytical paramaters
	 * @protected
	 */
	FilterProvider.prototype.getAnalyticBindingPath = function() {
		var oValues, aParamNames = [], aParameters = this.getAnalyticParameters();

		aParameters.forEach(function(oParam) {
			aParamNames.push(oParam.fieldName);
		});

		oValues = this.getFilledFilterData(aParamNames);

		if (this._oParameterization) {
			return this._createAnalyticBindingPath(aParameters, oValues);
		} else {
			return this._createNonAnalyticBindingPath(aParameters, oValues);
		}
	};

	/**
	 * Constructs binding information for analytical parameters.
	 * @param {array} aParameters with analytical parameters and the corresponding values
	 * @param {object} oValues of the analytic parameters
	 * @returns {string} Paths information
	 * @private
	 */
	FilterProvider.prototype._createAnalyticBindingPath = function(aParameters, oValues) {
		var sValue, sPath = "", oParamRequest;
		oParamRequest = this._getParameterizationRequest(this._oParameterization);
		if (oParamRequest) {
			aParameters.forEach(function(oParam) {
				sValue = oValues[oParam.fieldName];
				if (!sValue) {
					sValue = "";
				} else if (oParam.type === "Edm.Time" && sValue instanceof Date) {
					if (this._oDateFormatSettings && !this._oDateFormatSettings.UTC) {
						sValue = DateTimeUtil.utcToLocal(sValue);
					}
					sValue = DateTimeUtil.localToUtc(sValue);
					sValue = {
						__edmType: "Edm.Time",
						ms: sValue.valueOf()
					};
				} else if ((oParam.type !== "Edm.DateTimeOffset") && this._oDateFormatSettings && this._oDateFormatSettings.UTC && sValue instanceof Date) {
					sValue = DateTimeUtil.localToUtc(sValue);
				}

				oParamRequest.setParameterValue(oParam.name, sValue);
			}.bind(this));

			sPath = oParamRequest.getURIToParameterizationEntry() + '/' + this._oParameterization.getNavigationPropertyToQueryResult();
		}

		return sPath;
	};

	FilterProvider.prototype._createNonAnalyticBindingPath = function(aParameters, oValues) {
		var sValue, sPath = "", sPeriod = "";
		if (this._oNonAnaParameterization) {
			sPath = "/" + this._oNonAnaParameterization.entitySetName + '(';
			aParameters.forEach(function(oParam) {

				sValue = oValues[oParam.fieldName];
				if (!sValue) {
					sValue = "";
				} else if (oParam.type === "Edm.Time" && sValue instanceof Date) {
					sValue = DateTimeUtil.localToUtc(sValue);
					sValue = {
						__edmType: "Edm.Time",
						ms: sValue.valueOf()
					};
				} else if ((oParam.type !== "Edm.DateTimeOffset") && this._oDateFormatSettings && this._oDateFormatSettings.UTC && sValue instanceof Date) {
					sValue = DateTimeUtil.localToUtc(sValue);
				}

				sPath += (sPeriod + oParam.name + "=" + encodeURL(this._oParentODataModel.formatValue(sValue, oParam.type)));
				sPeriod = ",";

			}.bind(this));

			sPath += (")/" + this._oNonAnaParameterization.navPropertyName);

		}

		return sPath;
	};

	FilterProvider.prototype._getParameterizationRequest = function() {
		return this._oParameterization ? new odata4analytics.ParameterizationRequest(this._oParameterization) : null;
	};

	FilterProvider.prototype._constructContextUrl = function(oDataModel, sEntitySetName) {
		// TODO: replace with piblic API, once available
		var sServerUrl = oDataModel._getServerUrl();
		if (sServerUrl && (sServerUrl.lastIndexOf('/') === (sServerUrl.length - 1))) {
			sServerUrl = sServerUrl.substr(0, sServerUrl.length - 1);
		}

		return sServerUrl + oDataModel.sServiceUrl + "/$metadata#" + sEntitySetName;
	};

	/**
	 * Returns the filter context url
	 * @returns {string} name of the entity type.
	 * @protected
	 */
	FilterProvider.prototype.getFilterContextUrl = function() {
		var oEntitySet, sContextUrl = null;

		if (this._oParentODataModel && this._oParentODataModel.isA("sap.ui.model.odata.v2.ODataModel") && this._oParentODataModel.getMetaModel()) {
			oEntitySet = this._oParentODataModel.getMetaModel().getODataEntitySet(this.sEntitySet);
			if (oEntitySet) {
				sContextUrl = this._constructContextUrl(this._oParentODataModel, oEntitySet.name);
			}
		}

		return sContextUrl;
	};

	/**
	 * Returns the parameter context url
	 * @returns {string} name of the entity type.
	 * @protected
	 */
	FilterProvider.prototype.getParameterContextUrl = function() {
		var sEntitySetName, sContextUrl = null;

		if (this._oParentODataModel && this._oParentODataModel.isA("sap.ui.model.odata.v2.ODataModel") && this._oParentODataModel.getMetaModel()) {
			if (this._oParameterization && this._oParameterization.getEntitySet()) {
				sEntitySetName = this._oParameterization.getEntitySet().getQName();
			} else if (this._oNonAnaParameterization) {
				sEntitySetName = this._oNonAnaParameterization.entitySetName;
			}
			if (sEntitySetName) {
				sContextUrl = this._constructContextUrl(this._oParentODataModel, sEntitySetName);
			}
		}

		return sContextUrl;
	};

	/**
	 * Calculates additional flags and attributes for a field e.g. whether TypeAhead is switched on
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @returns {Object} the field metadata
	 * @private
	 */
	FilterProvider.prototype._createFieldMetadata = function(oFilterFieldODataMetadata, sParamPrefix) {
		var oFieldViewMetadata, oControlConfiguration, oPromise;

		oFilterFieldODataMetadata.fieldName = this._getFieldName(oFilterFieldODataMetadata);
		oFilterFieldODataMetadata.fieldNameOData = oFilterFieldODataMetadata.fieldName.replace(FilterProvider.FIELD_NAME_REGEX, "/");

		// Get Additional configuration
		oControlConfiguration = this._oAdditionalConfiguration ? this._oAdditionalConfiguration.getControlConfigurationByKey(oFilterFieldODataMetadata.fieldName) : null;

		oFieldViewMetadata = Object.assign({}, oFilterFieldODataMetadata);

		oFieldViewMetadata.filterRestriction = this._getFilterRestriction(oFilterFieldODataMetadata, oControlConfiguration);
		this._updateValueListMetadata(oFieldViewMetadata, oFilterFieldODataMetadata);
		oFieldViewMetadata.hasValueHelpDialog = this._hasValueHelpDialog(oFieldViewMetadata, oControlConfiguration);
		oFieldViewMetadata.preventInitialDataFetchInValueHelpDialog = oControlConfiguration ? oControlConfiguration.preventInitialDataFetchInValueHelpDialog : true;
		oFieldViewMetadata.controlType = this._getControlType(oFieldViewMetadata, oControlConfiguration);
		// Use configured displayBehaviour, only if it is defined!
		if (oControlConfiguration && oControlConfiguration.displayBehaviour && oControlConfiguration.displayBehaviour !== "auto") {
			oFieldViewMetadata.displayBehaviour = oControlConfiguration.displayBehaviour;
		}
		oFieldViewMetadata.isCustomFilterField = !!(oControlConfiguration && oControlConfiguration.customControl);
		oFieldViewMetadata.visibleInAdvancedArea = !!(oControlConfiguration && oControlConfiguration.visibleInAdvancedArea);
		oFieldViewMetadata.label = this._getLabel(oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.isMandatory = this._isMandatory(oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.width = this._getWidth(oControlConfiguration);
		oFieldViewMetadata.isVisible = this._isVisible(oControlConfiguration);
		oFieldViewMetadata.groupId = this._getGroupID(oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.index = this._getIndex(oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.fControlConstructor = this._getControlConstructor(oFieldViewMetadata, sParamPrefix);
		oFieldViewMetadata.isFiscalDate = FiscalMetadata.isFiscalValue(oFieldViewMetadata);
		oFieldViewMetadata.fiscalType = FiscalMetadata.getFiscalAnotationType(oFieldViewMetadata);
		if (oFieldViewMetadata.isFiscalDate) {
			FiscalMetadata.updateViewMetadata(oFieldViewMetadata);
		}
		oFieldViewMetadata.filterType = this._getFilterType(oFieldViewMetadata);
		oFieldViewMetadata.hasTypeAhead = this._hasTypeAhead(oFieldViewMetadata, oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.customControl = oControlConfiguration ? oControlConfiguration.customControl : undefined;

		oFieldViewMetadata.ui5Type = this._getType(oFieldViewMetadata);
		if (oFieldViewMetadata.ui5Type && oFieldViewMetadata.ui5Type.isA("sap.ui.model.odata.type.DateTime")) {
			// in case of a DateTime type we set the UTC to false. Otherwise a formatValue with our Date values will return the wrong date.
			oFieldViewMetadata.ui5Type.formatValue(new Date(), "string");
			oFieldViewMetadata.ui5Type.oFormat.oFormatOptions.UTC = false;
		}

		oFieldViewMetadata.fCreateControl = function(oFieldMetadata) {
			var oData, oFilterData;
			oFieldMetadata.control = this._createControl(oFieldMetadata);
			oData = this.oModel.getData();
			oFilterData = oData[oFieldMetadata.fieldName];
			if (oFilterData) {
				this._updateMultiValueControl(oFieldMetadata.control, oFilterData.items, oFilterData.ranges, oFieldMetadata);
			}
		}.bind(this);

		this._applyWidth(oFieldViewMetadata);

		oFieldViewMetadata.defaultFilterValues = oControlConfiguration ? oControlConfiguration.defaultFilterValues : undefined;

		if (oFieldViewMetadata.type === "Edm.String") {
			this._aFilterBarStringFieldNames.push(oFieldViewMetadata.fieldName);
		}
		oFieldViewMetadata.conditionType = null;
		var oConditionType = oControlConfiguration ? oControlConfiguration.conditionType : null;
		if (!oConditionType && this._bUseDateRangeType && (oFieldViewMetadata.fControlConstructor === DateRangeSelection)) {
			oConditionType = "sap.ui.comp.config.condition.DateRangeType";
		}

		if (oConditionType) {
			var sConditionType = "";
			if (typeof oConditionType === "object") {
				sConditionType = oConditionType.module;
				delete oConditionType.module;
			} else {
				sConditionType = oConditionType;
				oConditionType = null;
			}
			try {
				sConditionType = sConditionType.replace(/\./g, "/");

				var fConditionTypeRequire = sap.ui.require(sConditionType);
				if (fConditionTypeRequire) {
					this._enhanceConditionTypeInfo(fConditionTypeRequire, sConditionType, oConditionType, oFieldViewMetadata);

				} else {
					oPromise = new Promise(function(fResolve) {
						sap.ui.require([
							sConditionType
						], function(fConditionTypeRequire) {
							this._enhanceConditionTypeInfo(fConditionTypeRequire, sConditionType, oConditionType, oFieldViewMetadata);
							fResolve();
						}.bind(this));
					}.bind(this));

					this._aPromises.push(oPromise);
				}

			} catch (ex) {
				Log.error("Module " + sConditionType + " could not be loaded");
			}
		} else {
			this._checkMetadataDefaultValue(oFieldViewMetadata);
		}

		return oFieldViewMetadata;

	};

	FilterProvider.prototype._requireConditionType = function(sConditionType, oConditionType, oFieldViewMetadata) {

		var sConditionType = sConditionType.replace(/\./g, "/");

		var fConditionTypeRequire = sap.ui.require(sConditionType);
		if (fConditionTypeRequire) {
			this._enhanceConditionTypeInfo(fConditionTypeRequire, sConditionType, oConditionType, oFieldViewMetadata);
		} else {
			sap.ui.require([
				sConditionType
			], function(fConditionTypeRequire) {
				this._enhanceConditionTypeInfo(fConditionTypeRequire, sConditionType, oConditionType, oFieldViewMetadata);
			}.bind(this));
		}
	};

	FilterProvider.prototype._enhanceConditionTypeInfo = function(fConditionTypeRequire, sConditionType, oConditionType, oFieldViewMetadata) {
		var oConditionTypeClass = fConditionTypeRequire;
		oFieldViewMetadata.conditionType = new oConditionTypeClass(oFieldViewMetadata.fieldName, this, oFieldViewMetadata);
		this._mConditionTypeFields[oFieldViewMetadata.fieldName] = oFieldViewMetadata;

		if (oConditionType && !this._bUseDateRangeType) {
			oFieldViewMetadata.conditionType.applySettings(oConditionType);
		}

		this._checkMetadataDefaultValue(oFieldViewMetadata);
	};

	/**
	 * Returns the filterType of the field based on metadata, else undefined
	 * @param {object} oField - ViewMetadata for the filter field
	 * @returns {string} the filter type for the field
	 * @private
	 */
	FilterProvider.prototype._getFilterType = function(oField) {
		return FormatUtil._getFilterType(oField);
	};

	/**
	 * Update the metadata for ValueList annotation
	 * @param {Object} oFieldViewMetadata - view metadata for the filter field
	 * @param {object} oFieldODataMetadata - OData metadata for the filter field
	 * @private
	 */
	FilterProvider.prototype._updateValueListMetadata = function(oFieldViewMetadata, oFieldODataMetadata) {

		// First check for "sap:value-list" annotation
		oFieldViewMetadata.hasValueListAnnotation = oFieldODataMetadata["sap:value-list"] !== undefined;
		if (oFieldViewMetadata.hasValueListAnnotation) {
			oFieldViewMetadata.hasFixedValues = oFieldODataMetadata["sap:value-list"] === "fixed-values";
		} else if (oFieldODataMetadata["com.sap.vocabularies.Common.v1.ValueList"]) {
			// Then check for "com.sap.vocabularies.Common.v1.ValueList" and retrieve the semantics
			oFieldViewMetadata.hasValueListAnnotation = true;
			oFieldViewMetadata.hasFixedValues = this._oMetadataAnalyser.getValueListSemantics(oFieldODataMetadata["com.sap.vocabularies.Common.v1.ValueList"]) === "fixed-values";
			if (!oFieldViewMetadata.hasFixedValues) {
				oFieldViewMetadata.hasFixedValues = MetadataAnalyser.isValueListWithFixedValues(oFieldODataMetadata);
			}
		}
	};

	/**
	 * Creates the metadata for the basic search field. The basic search is supposed to be used in the ValuehelpDialog
	 * @returns {object} the field metadata
	 * @private
	 */
	FilterProvider.prototype._createBasicSearchFieldMetadata = function() {
		var oFieldViewMetadata;
		var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");

		oFieldViewMetadata = {};
		oFieldViewMetadata.filterRestriction = FilterType.single;
		oFieldViewMetadata.name = FilterProvider.BASIC_SEARCH_FIELD_ID;
		oFieldViewMetadata.fieldName = FilterProvider.BASIC_SEARCH_FIELD_ID;
		oFieldViewMetadata.label = undefined;
		oFieldViewMetadata.isMandatory = false;
		oFieldViewMetadata.isVisible = true;
		oFieldViewMetadata.groupId = FilterProvider.BASIC_FILTER_AREA_ID;
		oFieldViewMetadata.index = -1; // index of Basic Search field is irrelevant!
		oFieldViewMetadata.control = new SearchField(this._oSmartFilter.getId() + "-btnBasicSearch", {
			showSearchButton: true
		});

		if (!this._isRunningInValueHelpDialog) {
			oFieldViewMetadata.control.setPlaceholder(oRb.getText("FILTER_BAR_BSEARCH_PLACE_HOLDER"));
		}

		oFieldViewMetadata.control.bindProperty('value', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName);

		return oFieldViewMetadata;
	};

	/**
	 * If a width is specified in the additional configuration, it will be applied to the control
	 * @param {Object} oFieldViewMetadata - view metadata for the filter field
	 * @private
	 */
	FilterProvider.prototype._applyWidth = function(oFieldViewMetadata) {

		if (oFieldViewMetadata && oFieldViewMetadata.width && oFieldViewMetadata.control && oFieldViewMetadata.control.setWidth && (typeof oFieldViewMetadata.control.setWidth === 'function')) {
			oFieldViewMetadata.control.setWidth(oFieldViewMetadata.width);
		}
	};

	/**
	 * Calculates additional flags and attributes for a field e.g. whether TypeAhead is switched on
	 * @param {Object} oControlConfiguration - the control configuration for the field
	 * @returns {Object} the field metadata
	 * @private
	 */
	FilterProvider.prototype._createFieldMetadataForCustomFilterFields = function(oControlConfiguration) {
		var oFieldViewMetadata;

		// Custom filter fields are required to have a custom control
		if (!oControlConfiguration || !oControlConfiguration.customControl) {
			return undefined;
		}

		oFieldViewMetadata = {};
		oFieldViewMetadata.name = oControlConfiguration.key;
		oFieldViewMetadata.fieldName = oControlConfiguration.key;
		oFieldViewMetadata.label = oControlConfiguration.label;
		oFieldViewMetadata.visibleInAdvancedArea = !!(oControlConfiguration && oControlConfiguration.visibleInAdvancedArea);
		oFieldViewMetadata.isVisible = this._isVisible(oControlConfiguration);
		oFieldViewMetadata.groupId = oControlConfiguration.groupId;
		oFieldViewMetadata.isMandatory = this._isMandatory(undefined, oControlConfiguration);
		oFieldViewMetadata.index = oControlConfiguration.index;
		oFieldViewMetadata.width = this._getWidth(oControlConfiguration);
		oFieldViewMetadata.control = oControlConfiguration.customControl;
		oFieldViewMetadata.isCustomFilterField = true;
		this._applyWidth(oFieldViewMetadata);

		return oFieldViewMetadata;
	};

	/**
	 * Extends the filter metadata with fieldName attribute which has the entity name for associations
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @returns {string} the field name
	 * @private
	 */
	FilterProvider.prototype._getFieldName = function(oFilterFieldODataMetadata) {
		if (!oFilterFieldODataMetadata.parentPropertyName) {
			return oFilterFieldODataMetadata.name;
		} else {
			return oFilterFieldODataMetadata.parentPropertyName + "." + oFilterFieldODataMetadata.name;
		}
	};

	/**
	 * Returns a flag indicating whether the field supports the value help dialog, or not
	 * @param {Object} oFieldViewMetadata - view metadata for the filter field
	 * @param {Object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {boolean} whether valuehelp is supported by the field
	 * @private
	 */
	FilterProvider.prototype._hasValueHelpDialog = function(oFieldViewMetadata, oControlConfiguration) {
		var bValueHelpDialog = true;

		if (oControlConfiguration) {
			if (oControlConfiguration.controlType === ControlType.dropDownList) {
				bValueHelpDialog = false;
			} else if (oControlConfiguration.hasValueHelpDialog !== true) {
				bValueHelpDialog = false;
			}
		}
		if (oFieldViewMetadata && !oFieldViewMetadata.hasValueListAnnotation) {
			if (oFieldViewMetadata.filterRestriction === FilterType.single || oFieldViewMetadata.filterRestriction === FilterType.multiple) {
				bValueHelpDialog = false;
			}
		}

		return bValueHelpDialog;
	};

	/**
	 * Returns a flag indicating whether the field is visible, or not
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {boolean} whether the field is visible
	 * @private
	 */
	FilterProvider.prototype._isVisible = function(oControlConfiguration) {
		if (oControlConfiguration && oControlConfiguration.isVisible === false) {
			return false;
		}

		return true;
	};

	/**
	 * Returns the width from the control configuration. Undefined if there is no width specified
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {string} - width of the filter field
	 * @private
	 */
	FilterProvider.prototype._getWidth = function(oControlConfiguration) {
		if (oControlConfiguration && oControlConfiguration.width) {
			return oControlConfiguration.width;
		}

		return undefined;
	};

	/**
	 * Returns a flag indicating whether the field is required/mandatory, or not
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {boolean} whether the field is mandatory
	 * @private
	 */
	FilterProvider.prototype._isMandatory = function(oFilterFieldODataMetadata, oControlConfiguration) {
		if (oControlConfiguration && oControlConfiguration.mandatory !== MandatoryType.auto) {
			return oControlConfiguration.mandatory === MandatoryType.mandatory;
		}
		if (oFilterFieldODataMetadata) {
			return oFilterFieldODataMetadata.requiredFilterField;
		}
		return false;
	};

	/**
	 * Returns the effective filter restriction. Possible values can be found in this enum: sap.ui.comp.smartfilterbar.FilterType
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns {string} sFilterRestriction; the effective filter restriction
	 */
	FilterProvider.prototype._getFilterRestriction = function(oFilterFieldODataMetadata, oControlConfiguration) {
		var sFilterRestriction;

		if (oControlConfiguration && oControlConfiguration.filterType && oControlConfiguration.filterType !== FilterType.auto) {
			sFilterRestriction = oControlConfiguration.filterType;
		} else if (oFilterFieldODataMetadata.filterRestriction === "single-value") {
			sFilterRestriction = FilterType.single;
		} else if (oFilterFieldODataMetadata.filterRestriction === "multi-value") {
			sFilterRestriction = FilterType.multiple;
		} else if (oFilterFieldODataMetadata.filterRestriction === "interval") {
			sFilterRestriction = FilterType.interval;
		} else {
			sFilterRestriction = FilterType.auto;
		}

		return sFilterRestriction;
	};

	/**
	 * Returns the effective control type. Control types can be found in enum: sap.ui.comp.smartfilterbar.ControlType
	 * @param {object} oFieldViewMetadata - view metadata for the filter field
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns {string} sControlType; the effective control type
	 */
	FilterProvider.prototype._getControlType = function(oFieldViewMetadata, oControlConfiguration) {
		var sControlType;

		if (oControlConfiguration && oControlConfiguration.controlType && oControlConfiguration.controlType !== ControlType.auto) {
			sControlType = oControlConfiguration.controlType;
		} else if (oFieldViewMetadata.type === "Edm.DateTime" && oFieldViewMetadata.displayFormat === "Date" || oFieldViewMetadata.isCalendarDate) {
			sControlType = ControlType.date;
		} else if (oFieldViewMetadata.type === "Edm.DateTimeOffset") {
			sControlType = ControlType.dateTimePicker;
		} else if (oFieldViewMetadata.hasValueListAnnotation && oFieldViewMetadata.hasFixedValues) {
			sControlType = ControlType.dropDownList;
		} else if (this._isBooleanWithFixedValuedButWithoutValueListAnnotation(oFieldViewMetadata)) {
			sControlType = ControlType.dropDownList;
		} else {
			sControlType = ControlType.input;
		}
		return sControlType;
	};

	FilterProvider.prototype._isBooleanWithFixedValuedButWithoutValueListAnnotation = function(oFieldViewMetadata) {
		if (oFieldViewMetadata.type === "Edm.Boolean" && !oFieldViewMetadata.hasFixedValues && !oFieldViewMetadata.hasValueListAnnotation && (oFieldViewMetadata.filterRestriction === "single")) {
			return true;
		}

		return false;
	};

	/**
	 * Returns the id of the parent group for a filter field from the additional configuration
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {Object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns {string} groupId; the groupId for the configuration
	 */
	FilterProvider.prototype._getGroupID = function(oFilterFieldODataMetadata, oControlConfiguration) {
		if (oControlConfiguration && oControlConfiguration.groupId) {
			return oControlConfiguration.groupId;
		} else if (oFilterFieldODataMetadata && (oFilterFieldODataMetadata.requiredFilterField || (this._aSelectionFields && this._aSelectionFields.indexOf(oFilterFieldODataMetadata.fieldNameOData) > -1))) {
			return this._sBasicFilterAreaID;
		}
		return this._getGroupIDFromFieldGroup(oFilterFieldODataMetadata);
	};

	/**
	 * Returns the id (if found) of the parent group for a filter field from the FieldGroup annotation
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @private
	 * @returns {string} groupId; the groupId for the field (if found)
	 */
	FilterProvider.prototype._getGroupIDFromFieldGroup = function(oFilterFieldODataMetadata) {
		var iLen = 0, oFieldGroupAnnotation = null, sGroupName;
		if (oFilterFieldODataMetadata && this._aFieldGroupAnnotation && this._aFieldGroupAnnotation.length) {
			iLen = this._aFieldGroupAnnotation.length;
			// Loop through the FieldGroup annotation list and check if the field is found somewhere
			while (iLen--) {
				oFieldGroupAnnotation = this._aFieldGroupAnnotation[iLen];
				if (oFieldGroupAnnotation && oFieldGroupAnnotation.fields && oFieldGroupAnnotation.fields.indexOf(oFilterFieldODataMetadata.fieldNameOData) > -1) {
					sGroupName = oFieldGroupAnnotation.groupName;
					break;
				}
			}
		}
		return sGroupName;
	};

	/**
	 * Returns the label of the filter field. OData metadata and additional configuration are used for this
	 * @param {Object} oFilterFieldODataMetadata - OData metadata
	 * @param {Object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns {string} label for the filter field
	 */
	FilterProvider.prototype._getLabel = function(oFilterFieldODataMetadata, oControlConfiguration) {

		if (oControlConfiguration && oControlConfiguration.label) {
			return oControlConfiguration.label;
		}
		return this._getLabelFromFieldGroup(oFilterFieldODataMetadata) || oFilterFieldODataMetadata.fieldLabel || oFilterFieldODataMetadata.fieldName;
	};

	/**
	 * Returns the label (if found) of the filter field from the FieldGroup annotation
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @private
	 * @returns {string} label; undefined if field is no part of field group annotation
	 */
	FilterProvider.prototype._getLabelFromFieldGroup = function(oFilterFieldODataMetadata) {
		var iLen = 0, oFieldGroupAnnotation = null, sLabel;
		if (oFilterFieldODataMetadata && this._aFieldGroupAnnotation && this._aFieldGroupAnnotation.length) {
			iLen = this._aFieldGroupAnnotation.length;
			// Loop through the FieldGroup annotation list and check if the field is found somewhere
			while (iLen--) {
				oFieldGroupAnnotation = this._aFieldGroupAnnotation[iLen];
				if (oFieldGroupAnnotation && oFieldGroupAnnotation.fields && oFieldGroupAnnotation.fields.indexOf(oFilterFieldODataMetadata.fieldNameOData) > -1) {
					sLabel = oFieldGroupAnnotation.labels[oFilterFieldODataMetadata.fieldNameOData];
					break;
				}
			}
		}
		return sLabel;
	};

	/**
	 * Returns the index for a filter field from the additional configuration -or- based on FieldGroup annotation
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {Object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns {int} index; undefined if index is not specified in additional configuration
	 */
	FilterProvider.prototype._getIndex = function(oFilterFieldODataMetadata, oControlConfiguration) {
		if (oControlConfiguration && (oControlConfiguration.index >= 0)) {
			return oControlConfiguration.index;
		} else if (this._aSelectionFields && this._aSelectionFields.indexOf(oFilterFieldODataMetadata.fieldNameOData) > -1) {
			return this._aSelectionFields.indexOf(oFilterFieldODataMetadata.fieldNameOData);
		}
		return this._getIndexFromFieldGroup(oFilterFieldODataMetadata);
	};

	/**
	 * Returns the index (if found) of the filter field from the FieldGroup annotation
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @private
	 * @returns {int} index; undefined if field is no part of field group annotation
	 */
	FilterProvider.prototype._getIndexFromFieldGroup = function(oFilterFieldODataMetadata) {
		var iLen = 0, oFieldGroupAnnotation = null, iIndex;
		if (oFilterFieldODataMetadata && this._aFieldGroupAnnotation && this._aFieldGroupAnnotation.length) {
			iLen = this._aFieldGroupAnnotation.length;
			// Loop through the FieldGroup annotation list and check if the field is found somewhere
			while (iLen--) {
				oFieldGroupAnnotation = this._aFieldGroupAnnotation[iLen];
				if (oFieldGroupAnnotation && oFieldGroupAnnotation.fields) {
					iIndex = oFieldGroupAnnotation.fields.indexOf(oFilterFieldODataMetadata.fieldNameOData);
					if (iIndex > -1) {
						break;
					}
					iIndex = undefined;
				}
			}
		}
		return iIndex;
	};

	/**
	 * Returns the index for a filter group from the additional configuration
	 * @param {Object} oGroupConfiguration - Additional configuration for this filter group
	 * @private
	 * @returns {int} index; undefined if index is not specified in additional configuration
	 */
	FilterProvider.prototype._getGroupIndex = function(oGroupConfiguration) {
		if (oGroupConfiguration && (oGroupConfiguration.index || oGroupConfiguration.index === 0)) {
			return oGroupConfiguration.index;
		}
	};

	/**
	 * Returns the label for a filter group from the additional configuration
	 * @param {Object} oFilterGroupODataMetadata - OData metadata for the filter group
	 * @param {Object} oGroupConfiguration - Additional configuration for this filter group
	 * @private
	 * @returns {int} index; undefined if label is not specified in additional configuration
	 */
	FilterProvider.prototype._getGroupLabel = function(oFilterGroupODataMetadata, oGroupConfiguration) {
		if (oGroupConfiguration && oGroupConfiguration.label) {
			return oGroupConfiguration.label;
		}
		return oFilterGroupODataMetadata.groupLabel || oFilterGroupODataMetadata.groupName || oFilterGroupODataMetadata.groupEntitySetName;
	};

	/**
	 * Returns a flag indicating whether the field supports TypeAhead (aka. Suggest), or not
	 * @param {Object} oFieldViewMetadata - view metadata for the filter field
	 * @param {Object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {Object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {boolean} whether type ahead can be enabled for the field
	 * @private
	 */
	FilterProvider.prototype._hasTypeAhead = function(oFieldViewMetadata, oFilterFieldODataMetadata, oControlConfiguration) {
		var bHasTypeAhead;

		bHasTypeAhead = true;
		if (oControlConfiguration) {
			bHasTypeAhead = oControlConfiguration.hasTypeAhead;
		} else if (oFilterFieldODataMetadata.type !== "Edm.String") {
			return false;
		}
		// Disable type ahead for anything other than Input/MultiInput
		if (!(oFieldViewMetadata.fControlConstructor === Input || oFieldViewMetadata.fControlConstructor === MultiInput)) {
			return false;
		}

		return bHasTypeAhead;
	};

	/**
	 * Get the model
	 * @returns {Object} the model
	 * @public
	 */
	FilterProvider.prototype.getModel = function() {
		return this.oModel;
	};

	/**
	 * Get the view metadata for filter fields
	 * @returns {Array} array of filter field view metadata
	 * @public
	 */
	FilterProvider.prototype.getFilterBarViewMetadata = function() {
		return this._aFilterBarViewMetadata;
	};

	/**
	 * Get the list of value help provideres
	 * @returns {Array} array of value help provideres
	 * @private
	 */
	FilterProvider.prototype.getAssociatedValueHelpProviders = function() {
		return this._aValueHelpDialogProvider;
	};

	/**
	 * Get the list of value list provideres
	 * @returns {Array} array of value list provideres
	 * @private
	 */
	FilterProvider.prototype.getAssociatedValueListProviders = function() {
		return this._aValueListProvider;
	};

	/**
	 * Returns an parameter object which can be used to restrict the query result from OData. This function is required only for the basic search.
	 * @returns {object} object containing OData query parameters
	 * @public
	 */
	FilterProvider.prototype.getParameters = function() {
		var oParameter, sBasicSearchText = null;

		if (this.oModel) {
			sBasicSearchText = this.oModel.getProperty("/" + FilterProvider.BASIC_SEARCH_FIELD_ID);
		}

		if (this._sBasicSearchFieldName || sBasicSearchText) {
			oParameter = {
				custom: {}
			};

			if (this._sBasicSearchFieldName) {
				oParameter.custom["search-focus"] = this._sBasicSearchFieldName;
			}

			oParameter.custom["search"] = sBasicSearchText || "";
		}
		return oParameter;
	};

	/**
	 * Returns an array of filters that can be used to restrict the query result from OData
	 * @param {Array} aFieldNames - the names of the fields whose values should be returned (Ex: visible fields)
	 * @returns {Array} array of filters if any
	 * @public
	 */
	FilterProvider.prototype.getFilters = function(aFieldNames) {
		var oData = null;
		if (this.oModel) {
			oData = this.oModel.getData();
		}

		return FilterProvider.generateFilters(aFieldNames, oData, {
			dateSettings: this._oDateFormatSettings,
			useContainsAsDefault: this._bUseContainsAsDefault,
			stringFields: this._aFilterBarStringFieldNames,
			timeFields: this._aFilterBarTimeFieldNames,
			dateTimeOffsetValueFields: this._aFilterBarDateTimeFieldNames,
			viewMetadataData: this._aFilterBarViewMetadata
		});
	};

	/**
	 * Returns the data currently set in the filter data model
	 * @returns {object} the json data in the FilterBar
	 * @public
	 */
	FilterProvider.prototype.getFilterData = function() {
		return this.oModel ? this.oModel.getData() : null;
	};

	/**
	 * Returns the data currently set in the filter data model as string
	 * @returns {string} the string json data in the FilterBar
	 * @public
	 */
	FilterProvider.prototype.getFilterDataAsString = function() {
		return this.oModel ? this.oModel.getJSON() : null;
	};

	/**
	 * Returns the filled data currently set in the filter data model
	 * @param {Array} aFieldNames - the names of the fields whose values should be returned (Ex: visible fields)
	 * @returns {object} the json data in the FilterBar
	 * @public
	 */
	FilterProvider.prototype.getFilledFilterData = function(aFieldNames) {
		var oData, oFilledData = {}, iFieldLength, sField, oValue;
		oData = this.oModel ? this.oModel.getData() : null;
		if (oData && aFieldNames) {
			iFieldLength = aFieldNames.length;
			while (iFieldLength--) {
				sField = aFieldNames[iFieldLength];
				if (sField && sField !== FilterProvider.BASIC_SEARCH_FIELD_ID) {
					oValue = oData[sField];
					if (oValue && oValue.hasOwnProperty("low")) {// interval
						if (oValue.low) {
							oFilledData[sField] = oValue;
						}
					} else if (oValue && oValue.hasOwnProperty("items")) {// unrestricted/multi-value
						if (oValue.value && typeof oValue.value === "string") {
							oValue.value = oValue.value.trim();
						}
						if (oValue.items.length || (oValue.ranges && oValue.ranges.length) || oValue.value || (typeof oValue.value === "boolean") ) {
							oFilledData[sField] = oValue;
						}
					} else if (oValue) { // Single Value
						if (typeof oValue === "string") {
							oValue = oValue.trim();
						}
						if (oValue) {
							oFilledData[sField] = oValue;
						}
					}
				}
				// Finally fill the Custom data if it exists
				if (iFieldLength === 0) {
					sField = FilterProvider.CUSTOM_FIELDS_MODEL_PROPERTY;
					oValue = oData[sField];
					if (oValue) {
						oFilledData[sField] = oValue;
					}
				}
			}
		}
		// Always return a copy of the original data, since some objects may be referenced elsewhere and could get destroyed (or removed) during
		// usage!
		return merge({}, oFilledData);
	};

	/**
	 * Returns the filled data currently set in the filter data model as string
	 * @param {Array} aFieldNames - the names of the fields whose values should be returned (Ex: visible fields)
	 * @returns {string} the string json data in the FilterBar
	 * @public
	 */
	FilterProvider.prototype.getFilledFilterDataAsString = function(aFieldNames) {
		return JSON.stringify(this.getFilledFilterData(aFieldNames));
	};

	/**
	 * Sets the data in the filter data model
	 * @param {object} oJson - the json data in the FilterBar
	 * @param {boolean} bReplace - Replace existing filter data
	 * @public
	 */
	FilterProvider.prototype.setFilterData = function(oJson, bReplace) {
		var oData = null, aFieldNames = null, sKey = null;
		if (this.oModel && oJson) {
			// Set flag to indicate data is being updated
			this._bUpdatingFilterData = true;

			try {
				if (bReplace) {
					this._createInitialModel(false);
				}
				oData = this._parseFilterData(oJson, bReplace);
				if (oData) {
					this.oModel.setData(oData, true);
					aFieldNames = [];
					var sFieldName = arguments[2];
					if (sFieldName) {
						aFieldNames.push(sFieldName);
					}
					for (sKey in oData) {
						aFieldNames.push(sKey);
					}
					this._handleFilterDataUpdate(aFieldNames);
				}
			} finally {

				// Reset data update flag
				this._bUpdatingFilterData = false;
			}
		}
	};

	/**
	 * Sets the data in the filter data model as string
	 * @param {string} sJson - the json data in the FilterBar
	 * @param {boolean} bReplace - Replace existing filter data
	 * @public
	 */
	FilterProvider.prototype.setFilterDataAsString = function(sJson, bReplace) {
		if (sJson) {
			this.setFilterData(JSON.parse(sJson), bReplace);
		}
	};

	/**
	 * Parse the filter data to handle some formats and not consider all formats
	 * @param {Object} oJson = the filter data input
	 * @param {boolean} bReplace - whether the data shall be replaced instead of merged
	 * @returns {Object} the parsed filter data
	 * @private
	 */
	FilterProvider.prototype._parseFilterData = function(oJson, bReplace) {
		return FilterProvider.parseFilterData(this.oModel.getData(), oJson, {
			stringDateFields: this._aFilterBarStringDateFieldNames,
			dateFields: this._aFilterBarDateFieldNames,
			timeFields: this._aFilterBarTimeFieldNames,
			timeIntervalFields: this._aFilterBarTimeIntervalFieldNames,
			dateTimeMultiValueFields: this._aFilterBarDateTimeMultiValueFieldNames,
			conditionTypeFields: this._mConditionTypeFields,
			dateTimeOffsetValueFields: this._aFilterBarDateTimeFieldNames,
			viewMetadataData: this._aFilterBarViewMetadata,
			filterProvider: this
		}, bReplace);
	};

	/**
	 * Called once the FilterData is set via SetFilterData. Handles control update for non binding controls (multi-value)
	 * @param {Array} aFieldNames - Array containing name of updated fields
	 * @private
	 */
	FilterProvider.prototype._handleFilterDataUpdate = function(aFieldNames) {
		var i = 0, oFilterFieldMetadata, oData, oFilterData;
		if (this._aFilterBarMultiValueFieldMetadata) {
			i = this._aFilterBarMultiValueFieldMetadata.length;
			while (i--) {
				if (!oData) {
					oData = this.oModel.getData();
				}
				if (oData) {
					oFilterFieldMetadata = this._aFilterBarMultiValueFieldMetadata[i];
					// Only update the value if the field was changed in the handleDataUpate
					if (aFieldNames.indexOf(oFilterFieldMetadata.fieldName) > -1) {
						oFilterData = oData[oFilterFieldMetadata.fieldName];
						if (oFilterData) {
							this._updateMultiValueControl(oFilterFieldMetadata.control, oFilterData.items, oFilterData.ranges, oFilterFieldMetadata);
						}
					}
				}
			}
			this._updateConditionTypeFields();
		}
	};

	/**
	 * Clears the model
	 * @public
	 */
	FilterProvider.prototype.clear = function() {
		this._createInitialModel(false);
	};

	/**
	 * Resets the model
	 * @public
	 */
	FilterProvider.prototype.reset = function() {
		this._createInitialModel(true);
	};

	/**
	 * Updates the conditionType fields after changes to other fields and initially
	 * @private
	 */
	FilterProvider.prototype._initializeConditionTypeFields = function() {
		var handlePendingChange = function(oEvent) {
			this.setPending(this.isPending());
		}.bind(this);
		for ( var n in this._mConditionTypeFields) {
			this._mConditionTypeFields[n].conditionType.initialize(this.oModel.getData()[n]);
			if (this._mConditionTypeFields[n].conditionType.getAsync()) {
				this._mConditionTypeFields[n].conditionType.attachPendingChange(handlePendingChange);
			}
		}
	};

	/**
	 * Updates the conditionType fields after changes to other fields and initially
	 * @private
	 */
	FilterProvider.prototype._updateConditionTypeFields = function() {
		var oldData = this._oldData;
		var newData = this.oModel.getData();
		this._oldData = merge({}, newData);

		if (oldData !== undefined) {
			// check which fields have a changed filter model
			var aUpdateFields = [], n;
			for (n in newData) {
				var sNewData = JSON.stringify(newData[n]);
				var sOldData = JSON.stringify(oldData[n]);
				if (sNewData !== sOldData) {
					aUpdateFields.push(n);
				}
			}

			if (aUpdateFields.length > 0) {
				// only if we found changed fields we call providerDataUpdated with the changed fields
				for (n in this._mConditionTypeFields) {
					this._mConditionTypeFields[n].conditionType.providerDataUpdated(aUpdateFields, newData);
				}
			}
		}
	};

	/**
	 * Clears the conditionType fields
	 * @private
	 */
	FilterProvider.prototype._clearConditionTypeFields = function() {
		var newData = this.oModel.getData();
		for ( var n in this._mConditionTypeFields) {
			this._mConditionTypeFields[n].conditionType.initialize(newData[n]);
		}
	};

	FilterProvider.prototype._validateConditionTypeFields = function() {
		var bInvalid = false;
		for ( var n in this._mConditionTypeFields) {
			var bValid = this._mConditionTypeFields[n].conditionType.validate();
			if (!bValid && !bInvalid) {
				bInvalid = true;
			}
		}
		return bInvalid;
	};

	// provide the static function FilterProvider._getFieldMetadata as private prototype to avoid cyclic references problem between FilterProvider and BaseValueListProvider
	FilterProvider.prototype._getFieldMetadata = function(sFieldName) {
		return FilterProvider._getFieldMetadata(this.getFilterBarViewMetadata(), sFieldName);
	};

	FilterProvider._getFieldMetadata = function(aViewMedatada, sFieldName) {
		var oFieldMetadata = null;
		aViewMedatada.some(function(oGroup) {
			if (oGroup && oGroup.fields) {
				oGroup.fields.some(function(oField) {
					if (oField && oField.fieldName === sFieldName) {
						oFieldMetadata = oField;
					}
					return oFieldMetadata !== null;
				});
			}

			return oFieldMetadata !== null;
		});

		return oFieldMetadata;
	};

	FilterProvider.prototype._getSelectedDateRange = function (vSelectedRange) {
		if (!Array.isArray(vSelectedRange)) {
			vSelectedRange = [vSelectedRange, vSelectedRange];
		}

		return vSelectedRange;
	};

	FilterProvider.prototype._getDateFieldOutOfRangeErrorText = function (oControl, aSelectedDateRange, oType, oRb) {
		var oMinDate = oControl.getMinDate() || oControl._oMinDate,
			oMaxDate = oControl.getMaxDate() || oControl._oMaxDate;

		if (aSelectedDateRange[0].getTime() < oMinDate.getTime()) {
			return oRb.getText("FILTER_BAR_DATE_FIELD_MIN_DATE_ERROR", [oType.formatValue(oMinDate, "string")]);
		}

		if (aSelectedDateRange[1].getTime() > oMaxDate.getTime()) {
			return oRb.getText("FILTER_BAR_DATE_FIELD_MAX_DATE_ERROR", [oType.formatValue(oMaxDate, "string")]);
		}
	};

	// TODO: Move this to a Util
	/**
	 * Static function to generate filter array from the given field name array and Json data object
	 * @param {Array} aFieldNames - array of field names
	 * @param {Object} oData - the json object data
	 * @param {Object} mSettings - optional settings used while creating filters
	 * @returns {Array} array of sap.ui.model.Filter
	 * @private
	 */
	FilterProvider.generateFilters = function(aFieldNames, oData, mSettings) {
		var aFilters = [],
			aArrayFilters = null,
			oExcludeFilters = null,
			aExcludeFilters = null,
			sField = null,
			sMatch = FilterProvider.FIELD_NAME_REGEX,
			oValue = null,
			oValue1,
			oValue2,
			aValue = null,
			iLen = 0,
			iFieldLength = 0,
			oDateFormatSettings,
			bEnableUseContainsAsDefault,
			aStringFields,
			aTimeFields,
			bUseContains,
			bIsTimeField,
			aDateTimeOffsetFields,
			bIsDateTimeOffsetField,
			oFieldMetadata,
			aViewMetadata = [],
			oRange,
			aFilterArrReference,
			sOperation;

		if (mSettings) {
			oDateFormatSettings = mSettings.dateSettings;
			bEnableUseContainsAsDefault = mSettings.useContainsAsDefault;
			aStringFields = mSettings.stringFields;
			aTimeFields = mSettings.timeFields;
			aDateTimeOffsetFields = mSettings.dateTimeOffsetValueFields;
			aViewMetadata = mSettings.viewMetadataData || [];
		}
		if (aFieldNames && oData) {
			iFieldLength = aFieldNames.length;
			while (iFieldLength--) {
				bIsTimeField = false;
				bIsDateTimeOffsetField = false;
				sField = aFieldNames[iFieldLength];

				oFieldMetadata = FilterProvider._getFieldMetadata(aViewMetadata, sField);

				// BCP: 1970554351 In case existing filter field is converted to a custom control but there is still
				// filter data for it coming from Variant Management - we do not generate filters for it.
				if (oFieldMetadata && oFieldMetadata.isCustomFilterField) {
					continue;
				}

				if (sField && sField !== FilterProvider.BASIC_SEARCH_FIELD_ID) {
					aValue = null;
					bUseContains = false;
					if (bEnableUseContainsAsDefault && aStringFields) {
						if (aStringFields.indexOf(sField) > -1) {
							bUseContains = true;
						}
					} else if (aTimeFields && aTimeFields.indexOf(sField) > -1) {
						bIsTimeField = true;
					} else if (aDateTimeOffsetFields && aDateTimeOffsetFields.indexOf(sField) > -1) {
						bIsDateTimeOffsetField = true;
					}
					oValue = oData[sField];
					// Replace all "." with "/" to convert to proper paths
					sField = sField.replace(sMatch, "/");
					if (oValue && oValue.hasOwnProperty("low")) {// The data in the model corresponds to low and high Objects
						if (oValue.low && oValue.high) {
							oValue1 = oValue.low;
							oValue2 = oValue.high;
							if (!bIsDateTimeOffsetField && oDateFormatSettings && oDateFormatSettings.UTC && oValue1 instanceof Date && oValue2 instanceof Date) {
								oValue1 = DateTimeUtil.localToUtc(oValue1);
								oValue2 = DateTimeUtil.localToUtc(oValue2);
							}
							oValue1 = FilterProvider.adaptTime(oValue1, oFieldMetadata);
							oValue2 = FilterProvider.adaptTime(oValue2, oFieldMetadata);
							aFilters.push(new Filter(sField, FilterOperator.BT, oValue1, oValue2));
						} else if (oValue.low) {
							if (oValue.low instanceof Date) {
								// We do not have an interval value --> Use typed in value as a single value date filter
								oValue1 = oValue.low;
								if (!bIsDateTimeOffsetField && oDateFormatSettings && oDateFormatSettings.UTC) {
									oValue1 = DateTimeUtil.localToUtc(oValue1);
								}
								oValue1 = FilterProvider.adaptTime(oValue1, oFieldMetadata);
								aFilters.push(new Filter(sField, FilterOperator.EQ, oValue1));
							} else if (typeof oValue.low === "string") {

								if (bIsDateTimeOffsetField && oFieldMetadata) {
									aValue = FormatUtil.parseDateTimeOffsetInterval(oValue.low);

									aValue[0] = oFieldMetadata.ui5Type.parseValue(aValue[0], "string");
									if (aValue.length === 2) {
										aValue[1] = oFieldMetadata.ui5Type.parseValue(aValue[1], "string");
									}
								} else {
									// since we bind non date interval values only to low; resolve this by splitting "-" into an interval
									aValue = FormatUtil.parseFilterNumericIntervalData(oValue.low);
								}

								if (aValue && aValue.length === 2) {
									oValue[0] = FilterProvider.adaptTime(oValue[0], oFieldMetadata);
									oValue[1] = FilterProvider.adaptTime(oValue[1], oFieldMetadata);
									aFilters.push(new Filter(sField, FilterOperator.BT, aValue[0], aValue[1]));
								} else if (aValue && aValue.length === 1) {
									oValue[0] = FilterProvider.adaptTime(oValue[0], oFieldMetadata);
									aFilters.push(new Filter(sField, FilterOperator.EQ, aValue[0]));
								} else {
									// We do not have an interval value --> Use typed in value as a single value filter
									aFilters.push(new Filter(sField, bUseContains ? FilterOperator.Contains : FilterOperator.EQ, oValue.low));
								}
							}
						}
					} else if (oValue && oValue.hasOwnProperty("items")) {// The data in the model corresponds to multi-value/range with a typed in
						// value
						aArrayFilters = [];
						aExcludeFilters = [];
						oExcludeFilters = null;
						if (oValue && oValue.hasOwnProperty("ranges")) { // Check if the data is for an unrestricted filter
							aValue = oValue.ranges;
							iLen = aValue.length;
							// Range Filters
							while (iLen--) {
								oRange = aValue[iLen];
								oValue1 = oRange.value1;
								oValue2 = oRange.value2;
								if (bIsTimeField) {
									if (oValue1 instanceof Date) {
										oValue1 = FormatUtil.getEdmTimeFromDate(oValue1);
									}
									if (oValue2 instanceof Date) {
										oValue2 = FormatUtil.getEdmTimeFromDate(oValue2);
									}
								} else if (oFieldMetadata && oFieldMetadata.isCalendarDate) {
									if (oValue1 instanceof Date) {
										oValue1 = oFieldMetadata.ui5Type.parseValue(oValue1);
									}
									if (oValue2 instanceof Date) {
										oValue2 = oFieldMetadata.ui5Type.parseValue(oValue2);
									}
								} else if (!bIsDateTimeOffsetField && oDateFormatSettings && oDateFormatSettings.UTC) {// Check if Date values have
									// to be converted to UTC
									if (oValue1 instanceof Date) {
										oValue1 = DateTimeUtil.localToUtc(oValue1);
									}
									if (oValue2 instanceof Date) {
										oValue2 = DateTimeUtil.localToUtc(oValue2);
									}
								}
								oValue1 = FilterProvider.adaptTime(oValue1, oFieldMetadata);
								oValue2 = FilterProvider.adaptTime(oValue2, oFieldMetadata);

								aFilterArrReference = (oRange.exclude ? aExcludeFilters : aArrayFilters);
								if (oRange.operation === ValueHelpRangeOperation.Empty) {

									if (oFieldMetadata && ["Edm.DateTime", "Edm.DateTimeOffset"].indexOf(oFieldMetadata.type) > -1) {
										aFilterArrReference.push(new Filter(sField, oRange.exclude ? FilterOperator.NE : FilterOperator.EQ, null));
									} else {
										aFilterArrReference.push(FilterProvider._getStringEmptyFilter(sField, oFieldMetadata, oRange.exclude));
									}

								} else {
									if (oRange.operation !== FilterOperator.BT && oRange.operation !== FilterOperator.NB) {
										// TODO: We should remove this in the future but currently we are blocked by SmartMultiInput unit test
										oValue2 = undefined;
									}

									sOperation = oRange.exclude ? FilterUtil.getTransformedExcludeOperation(oRange.operation) : oRange.operation;
									aFilterArrReference.push(new Filter(sField, sOperation, oValue1, oValue2));
								}

							}
							if (aExcludeFilters.length) {
								oExcludeFilters = new Filter(aExcludeFilters, true);
							}
						}
						aValue = oValue.items;
						iLen = aValue.length;
						// Item filters
						while (iLen--) {
							aArrayFilters.push(new Filter(sField, FilterOperator.EQ, aValue[iLen].key));
						}

						// MCB considers only tokens
						// if (oFieldMetadata && ((oFieldMetadata.fControlConstructor !== MultiComboBox) || (oFieldMetadata.hiddenFilter))) {
							// Only ignore "", null and undefined values
							if (oValue.value || oValue.value === 0 || oValue.value === false) {
								if (typeof oValue.value === "string") {
									oValue.value = oValue.value.trim();
								}
								aArrayFilters.push(new Filter(sField, bUseContains ? FilterOperator.Contains : FilterOperator.EQ, oValue.value));
							}
						// }

						// OR the array values while creating the filter
						if (aArrayFilters.length) {
							// If Exclude and array (inlcude) filters exists --> use AND between them before pushing to the filter array
							if (oExcludeFilters) {
								aFilters.push(new Filter([
									new Filter(aArrayFilters, false), oExcludeFilters
								], true));
							} else {
								aFilters.push(new Filter(aArrayFilters, false));
							}
						} else if (oExcludeFilters) {
							// Only exclude filters exists --> add to the filter array
							aFilters.push(oExcludeFilters);
						}
					} else if (oValue || oValue === 0 || oValue === false) {// Single Value
						// Only ignore "", null and undefined values
						if (typeof oValue === "string") {
							oValue = oValue.trim();
						}
						if (oValue && oValue instanceof Date) {
							if (bIsTimeField) {
								oValue = FormatUtil.getEdmTimeFromDate(oValue);
							} else if (!bIsDateTimeOffsetField && oDateFormatSettings && oDateFormatSettings.UTC) {
								oValue = DateTimeUtil.localToUtc(oValue);
							}
						}
						if (oValue || oValue === 0 || oValue === false) {
							oValue = FilterProvider.adaptTime(oValue, oFieldMetadata);
							aFilters.push(new Filter(sField, bUseContains ? FilterOperator.Contains : FilterOperator.EQ, oValue));
						}
					}
				}
			}
		}
		// AND the top level filter attributes if there is more than 1
		return (aFilters.length > 1) ? [
			new Filter(aFilters, true)
		] : aFilters;
	};

	/**
	 * Creates a string empty filter based on field configuration.
	 * @param {string} sField - the name of the field
	 * @param {object} oFieldMetadata - field metadata object
	 * @param {boolean} [bExclude=false] - Is this exclude or include operation
	 * @returns {sap.ui.model.Filter} - The generated filter
	 * @private
	 */
	FilterProvider._getStringEmptyFilter = function (sField, oFieldMetadata, bExclude) {
		var sOperation = bExclude ? FilterOperator.NE : FilterOperator.EQ;

		if (oFieldMetadata && oFieldMetadata.nullable === "false") {
			// For non-nullable fields we add only empty string filter
			return new Filter(sField, sOperation, "");
		} else {
			return new Filter({
				and: !!bExclude,
				filters: [
					new Filter(sField, sOperation, ""),
					new Filter(sField, sOperation, null)
				]
			});
		}
	};

	/**
	 * Static function to parse and convert json data to be set into the data of the filter model (JsonModel.oData) into proper format
	 * @private
	 * @param {Object} oData - The data from the datamodel
	 * @param {Object} oInputJson - the json object data that needs to be convered/parsed
	 * @param {Object} mSettings - settings used while for parsing filter data
	 * @param {boolean} bReplace - whether the data shall be replaced instead of merged
	 * @returns {Object} The resolved/parsed/converted data that can be set into the model
	 */
	FilterProvider.parseFilterData = function(oData, oInputJson, mSettings, bReplace) {
		var oResolvedData = {}, mConditionTypeFields = null, sField = null, oValue = null, oNewValue, oJson, i, iLen, oRange, aFilterBarStringDateFieldNames, aFilterBarDateFieldNames, aFilterBarTimeFieldNames, aFilterBarTimeIntervalFieldNames, aFilterBarDateTimeMultiValueFieldNames, aDateTimeOffsetValueFields, aViewMetadata, oFieldMetadata, oFilterProvider;
		if (mSettings) {
			aFilterBarStringDateFieldNames = mSettings.stringDateFields;
			aFilterBarDateFieldNames = mSettings.dateFields;
			aFilterBarTimeFieldNames = mSettings.timeFields;
			aFilterBarTimeIntervalFieldNames = mSettings.timeIntervalFields;
			aFilterBarDateTimeMultiValueFieldNames = mSettings.dateTimeMultiValueFields;
			mConditionTypeFields = mSettings.conditionTypeFields || {};
			aDateTimeOffsetValueFields = mSettings.dateTimeOffsetValueFields;
			aViewMetadata = mSettings.viewMetadataData || [];
			oFilterProvider = mSettings.filterProvider || null;
		}

		if (!aFilterBarStringDateFieldNames) {
			aFilterBarStringDateFieldNames = [];
		}

		if (!aFilterBarDateFieldNames) {
			aFilterBarDateFieldNames = [];
		}
		if (!aFilterBarTimeFieldNames) {
			aFilterBarTimeFieldNames = [];
		}
		if (!aFilterBarTimeIntervalFieldNames) {
			aFilterBarTimeIntervalFieldNames = [];
		}
		if (!aFilterBarDateTimeMultiValueFieldNames) {
			aFilterBarDateTimeMultiValueFieldNames = [];
		}
		if (!aDateTimeOffsetValueFields) {
			aDateTimeOffsetValueFields = [];
		}

		if (oData && oInputJson) {
			oJson = Object.assign({}, oInputJson, true);
			for (sField in oJson) {

				oFieldMetadata = FilterProvider._getFieldMetadata(aViewMetadata, sField);

				if (oData.hasOwnProperty(sField) && sField !== FilterProvider.CUSTOM_FIELDS_MODEL_PROPERTY) {
					oValue = oData[sField];
					oNewValue = oJson[sField];
					if (sField in mConditionTypeFields) {
						if (oNewValue && (("conditionTypeInfo" in oNewValue) || (!("conditionTypeInfo" in oNewValue) && oNewValue.ranges))) {
							// only if there is a saved conditionTypeInfo
							mConditionTypeFields[sField].conditionType.initialize(oNewValue);
						}
					} else if (oValue && oValue.hasOwnProperty("low")) {// interval
						oResolvedData[sField] = oNewValue;
						if (oNewValue) {
							if ((oNewValue.low || oNewValue.low === 0) && (oNewValue.high || oNewValue.high === 0)) {

								if ((aFilterBarDateFieldNames.indexOf(sField) > -1) || (aFilterBarTimeFieldNames.indexOf(sField) > -1)) {
									// oResolvedData[sField] = oNewValue;
									if (!(oNewValue.low instanceof Date)) { // Date needs to be set as a Date Object always!
										oResolvedData[sField].low = new Date(oNewValue.low);
									}
									if (!(oNewValue.high instanceof Date)) {// Date needs to be set as a Date Object always!
										oResolvedData[sField].high = new Date(oNewValue.high);
									}

									// DTOffset Handling
								} else if (oFilterProvider && oFieldMetadata && (aDateTimeOffsetValueFields.indexOf(sField) > -1)) {
									oResolvedData[sField].low = oFieldMetadata.ui5Type.formatValue(oNewValue.low, "string") + '-' + oFieldMetadata.ui5Type.formatValue(oNewValue.high, "string");
									oResolvedData[sField].high = null;

									// non date intervals
								} else if (aFilterBarStringDateFieldNames.indexOf(sField) === -1) {
									oResolvedData[sField].low = oNewValue.low + '-' + oNewValue.high;
									oResolvedData[sField].high = null;
								}
							} else if ((oNewValue.low || (oNewValue.low === 0) || oNewValue.value) && !oNewValue.high) {
								if (!oNewValue.low && oNewValue.value) {
									oNewValue.low = oNewValue.value;
								}
								if (((aFilterBarDateFieldNames.indexOf(sField) > -1) || (aFilterBarTimeFieldNames.indexOf(sField) > -1) || (aDateTimeOffsetValueFields.indexOf(sField) > -1)) && !(oNewValue.low instanceof Date)) {
									oResolvedData[sField].low = new Date(oNewValue.low);
								} else {
									oResolvedData[sField].low = oNewValue.low;
								}
								oResolvedData[sField].high = null;
							}
						}
					} else if (oValue && oValue.hasOwnProperty("items")) {// unrestricted/multi-value
						if (oNewValue && (oNewValue.items || oNewValue.ranges)) {
							if (oNewValue.ranges && oNewValue.ranges.length) {
								// Interval Edm.Time fields
								if (aFilterBarTimeIntervalFieldNames.indexOf(sField) > -1) {
									iLen = oNewValue.ranges.length;
									for (i = 0; i < iLen; i++) {
										oRange = oNewValue.ranges[i];
										if (!oRange.exclude && (oRange.operation === "EQ" || oRange.operation === "BT")) {
											break;
										}
										oRange = null;
									}
									if (oRange) {
										// String input but date expected
										if (oRange.value1 && typeof oRange.value1 === "string") {
											oRange.value1 = new Date(oRange.value1);
										}
										if (oRange.value2 && typeof oRange.value2 === "string") {
											oRange.value2 = new Date(oRange.value2);
										}
										// Create range data
										oResolvedData[sField] = {
											ranges: [
												oRange
											],
											items: [],
											value: ""
										};
									}
									// continue with next field as no further actions is necessary
									continue;
								} else if (aFilterBarDateFieldNames.indexOf(sField) > -1 || aFilterBarTimeFieldNames.indexOf(sField) > -1 || aDateTimeOffsetValueFields.indexOf(sField) > -1) {
									// Unrestricted Date/Time field
									iLen = oNewValue.ranges.length;
									for (i = 0; i < iLen; i++) {
										oRange = oNewValue.ranges[i];
										// String input but date expected
										if (oRange.value1 && typeof oRange.value1 === "string") {
											oRange.value1 = new Date(oRange.value1);
										}
										if (oRange.value2 && typeof oRange.value2 === "string") {
											oRange.value2 = new Date(oRange.value2);
										}
									}
// } else if ((oNewValue.ranges.length === 1) && (oNewValue.ranges[0].operation === "EQ") && !oNewValue.ranges[0].value1 && (typeof
// oNewValue.ranges[0].value1 === "string")) {
// // BCP: 1770464128
// continue;

								} else if (oFieldMetadata && oFieldMetadata.isCalendarDate) {

									iLen = oNewValue.ranges.length;
									for (i = 0; i < iLen; i++) {
										oRange = oNewValue.ranges[i];
										// String input but date expected
										if (oRange.value1 && (typeof oRange.value1 === "string") && !oRange.value1.match(/([1-9][0-9]{3,}|0[0-9]{3})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])/)) {
											oRange.value1 = oFieldMetadata.ui5Type.parseValue(new Date(oRange.value1), "date");
										}
										if (oRange.value2 && (typeof oRange.value2 === "string") && !oRange.value2.match(/([1-9][0-9]{3,}|0[0-9]{3})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])/)) {
											oRange.value2 = oFieldMetadata.ui5Type.parseValue(new Date(oRange.value2), "date");
										}
									}
								} else if (oFieldMetadata && oFieldMetadata.filterType === "boolean") {
									iLen = oNewValue.ranges.length;
									for (i = 0; i < iLen; i++) {
										oRange = oNewValue.ranges[i];
										if (oRange.hasOwnProperty("value1")) {
											if (typeof oRange.value1 === "string") {
												oRange.value1 = (oRange.value1 === "true");
											}
										}
										if (oRange.hasOwnProperty("value2")) {
											if (typeof oRange.value2 === "string") {
												oRange.value2 = (oRange.value2 === "true");
											}
										}
									}
								}
							}
							oResolvedData[sField] = oNewValue;

							if (!bReplace && oResolvedData[sField].ranges) {
								for (i = 0; i < oResolvedData[sField].ranges.length; i++) {
									oResolvedData[sField].ranges[i].tokenText = null;
								}
							}

						} else if (typeof oNewValue === "string" || typeof oNewValue === "number" || oNewValue instanceof Date) { // Single Value
							// Unrestricted/multi-value Date field
							if (oNewValue && (aFilterBarDateFieldNames.indexOf(sField) > -1 || aFilterBarTimeFieldNames.indexOf(sField) > -1)) {
								if (typeof oNewValue === "string") {// String input but date expected
									oNewValue = new Date(oNewValue);
								}
								// Create Date range data
								oResolvedData[sField] = {
									ranges: [
										{
											"exclude": false,
											"operation": "EQ",
											"keyField": sField,
											"value1": oNewValue,
											"value2": null
										}
									],
									items: [],
									value: ""
								};
							} else {
								oResolvedData[sField] = {
									value: oNewValue,
									items: []
								};
							}
						}
					} else {// single value
						oResolvedData[sField] = null; // Default to null!
						// Single Date, string, boolean, number value
						if (typeof oNewValue === "string" || typeof oNewValue === "boolean" || typeof oNewValue === "number" || oNewValue instanceof Date) {
							// String input but date expected!
							if (typeof oNewValue === "string" && (aFilterBarDateFieldNames.indexOf(sField) > -1 || aFilterBarTimeFieldNames.indexOf(sField) > -1 || aDateTimeOffsetValueFields.indexOf(sField) > -1)) {
								oResolvedData[sField] = new Date(oNewValue);
							} else {
								oResolvedData[sField] = oNewValue;
							}
						} else if (oNewValue && (oNewValue.value || oNewValue.value === 0 || oNewValue.value === false)) { // Use the types in value
							// from multiValue if any
							oResolvedData[sField] = oNewValue.value;
						} else if (oNewValue && oNewValue.items && oNewValue.items.length) { // use the 1st value in items array if any
							oResolvedData[sField] = oNewValue.items[0].key;
						} else if (oNewValue && oNewValue.ranges && oNewValue.ranges.length) { // use the 1st value in ranges array if any
							iLen = oNewValue.ranges.length;
							for (i = 0; i < iLen; i++) {
								oRange = oNewValue.ranges[i];
								if (!oRange.exclude && oRange.operation === "EQ") {
									break;
								}
								oRange = null;
							}
							if (oRange && oRange.value1) {
								// String input but date expected!
								if (typeof oRange.value1 === "string" && (aFilterBarDateFieldNames.indexOf(sField) > -1 || aFilterBarTimeFieldNames.indexOf(sField) > -1 || aDateTimeOffsetValueFields.indexOf(sField) > -1)) {
									oResolvedData[sField] = new Date(oRange.value1);
								} else {
									oResolvedData[sField] = oRange.value1;
								}
							}
						}
					}
				} else if (bReplace || sField === FilterProvider.CUSTOM_FIELDS_MODEL_PROPERTY) {
					// Value is for _CUSTOM -> add it as it is
					oResolvedData[sField] = oJson[sField];
				}
			}
		}
		return oResolvedData;
	};

	/**
	 * Static function that adapts the time part of a date according to
	 * the field metadata
	 * @private
	 * @param {Date} oDate The date object
	 * @param {Object} oMetadata The field metadata
	 * @returns {Date} The adapted date object
	 */
	FilterProvider.adaptTime = function(oDate, oMetadata) {
		var iPrecision;
		// If oDate is not instanceof oDate or metadata is not available, just return the date
		if (!(oDate instanceof Date) || !oMetadata) {
			return oDate;
		}
		// If displayFormat is Date, set to 0:00 UTC
		if (oMetadata.displayFormat === "Date") {
			return DateTimeUtil.normalizeDate(oDate, true);
		}
		// If precision is defined, adapt milliseconds to precision
		iPrecision = parseInt(oMetadata.precision);
		return DateTimeUtil.adaptPrecision(oDate, iPrecision);
	};

	/**
	 * Destroys the object
	 * @public
	 */
	FilterProvider.prototype.destroy = function() {
		var fDestroy = function(aArray) {
			var i;
			if (aArray) {
				i = aArray.length;
				while (i--) {
					aArray[i].destroy();
				}
			}
		};

		this._oParentODataModel = null;
		this._aAnalyticalParameters = null;
		this._aFilterBarViewMetadata = null;
		this._oParameterization = null;
		this._oNonAnaParameterization = null;
		this._aFilterBarFieldNames = null;
		this._aFilterBarStringDateFieldNames = null;
		this._aFilterBarDateFieldNames = null;
		this._aFilterBarTimeFieldNames = null;
		this._aFilterBarTimeIntervalFieldNames = null;
		this._aFilterBarDateTimeMultiValueFieldNames = null;
		this._aFilterBarStringFieldNames = null;
		this._aFilterBarMultiValueFieldMetadata = null;

		this._aFilterBarDateTimeFieldNames = null;

		this._aFieldGroupAnnotation = null;
		this._aSelectionFields = null;
		this._aSelectionVariants = null;

		if (this._oMetadataAnalyser && this._oMetadataAnalyser.destroy) {
			this._oMetadataAnalyser.destroy();
		}
		this._oMetadataAnalyser = null;

		fDestroy(this._aValueHelpDialogProvider);
		this._aValueHelpDialogProvider = null;

		fDestroy(this._aValueListProvider);
		this._aValueListProvider = null;

		if (this._mTokenHandler) {
			for ( var sHandlerId in this._mTokenHandler) {
				var oHandler = this._mTokenHandler[sHandlerId];
				if (oHandler.parser) {
					oHandler.parser.destroy();
					oHandler.parser = null;
				}
			}
			delete this._mTokenHandler;
		}

		this.oResourceBundle = null;
		this.sIntervalPlaceholder = null;
		this.sDefaultDropDownDisplayBehaviour = null;
		this.sDefaultTokenDisplayBehaviour = null;
		this._oSmartFilter = null;

		if (this._oEventProvider) {
			if (this._oEventProvider.destroy) {
				this._oEventProvider.destroy();
			}
			this._oEventProvider = null;
		}

		for ( var n in this._mConditionTypeFields) {
			this._mConditionTypeFields[n].conditionType.destroy();
		}
		this._mConditionTypeFields = null;

		if (this.oModel) {
			this.oModel.destroy();
			this.oModel = null;
		}

		this._aPromises = [];
		this.bIsDestroyed = true;
	};

	return FilterProvider;

}, /* bExport= */true);
