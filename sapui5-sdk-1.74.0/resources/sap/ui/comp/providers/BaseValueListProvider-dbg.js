/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
// -----------------------------------------------------------------------------
// Retrieves the metadata necessary for a value list from the OData metadata
// -----------------------------------------------------------------------------
sap.ui.define([
	'sap/ui/thirdparty/jquery',
	'sap/ui/comp/library',
	'sap/ui/base/EventProvider',
	'sap/ui/comp/odata/ODataType',
	'sap/ui/comp/odata/MetadataAnalyser',
	'sap/ui/comp/util/FormatUtil',
	'sap/ui/comp/util/DateTimeUtil',
	'sap/base/Log'
], function(jQuery, library, EventProvider, ODataType, MetadataAnalyser, FormatUtil, DateTimeUtil, Log) { //
	"use strict";

	// shortcut for sap.ui.comp.smartfilterbar.DisplayBehaviour
	var DisplayBehaviour = library.smartfilterbar.DisplayBehaviour;

	// shortcut to sap.ui.comp.ANALYTICAL_PARAMETER_PREFIX
	var ANALYTICAL_PARAMETER_PREFIX = library.ANALYTICAL_PARAMETER_PREFIX;

	/**
	 * Retrieves the data for a collection from the OData metadata to bind to a given control/aggregation
	 * @constructor
	 * @param {map} mParams - map containing the control,aggregation,annotation and the oODataModel
	 * @param {string} mParams.fieldName - property name
	 * @param {object} mParams.control - control instance which get the valuehelp
	 * @param {object} mParams.model - the oData model of the control which provides additional metadata
	 * @param {object} mParams.filterModel - ??????
	 * @param {object} mParams.filterProvider - optional. In case of SmartField it does not exist
	 * @param {string} mParams.displayFormat - Represents the display format of the range values. With the <code>displayFormat</code> value "UpperCase", the entered value of the range (condition) is converted to uppercase letters.
	 * @param {object} [mParams.dateFormatSettings] - formatOptions for Date types which are created internal
	 * @param {object} mParams.fieldViewMetadata  - metadata object of the field. will be used to access other metadata like maxLength of the field
	 * @param {boolean} mParams.resolveInOutParams - handle inOutParameter (default true)
	 * @param {sap.ui.comp.smartfield.DisplayBehaviour} mParams.displayBehaviour - specified how the value will be displayed (idOnly, descriptionAndId, ...)
	 * @param {boolean} mParams.loadAnnotation - when true, fullyQualifiedFieldName and metadataAnalyser is required and annotation will be loaded async
	 * @param {string} mParams.fullyQualifiedFieldName
	 * @param {object} mParams.metadataAnalyser
	 * @param {object} mParams.annotation - annotations object for the field (used when loadAnnotation is false)
	 * @param {array} mParams.additionalAnnotations	- array of collective Search annotations for the ValueHelpDialog (should be moved into ValueHelpProvider)
	 * @param {string} mParams.type - type enum "string", "date", "time", "datetime", "numc", "numeric"
	 * @param {string} mParams.maxLength - type constrain maxLength of the field
	 * @protected
	 * @author SAP SE
	 */
	var BaseValueListProvider = EventProvider.extend("sap.ui.comp.providers.BaseValueListProvider", {
		constructor: function(mParams) {
			EventProvider.call(this);
			this.sFieldName = mParams.fieldName;
			this.oControl = mParams.control;
			this.oODataModel = mParams.model;
			this.oFilterModel = mParams.filterModel;
			this.oFilterProvider = mParams.filterProvider;
			this.sDisplayFormat = mParams.displayFormat;
			this._oDateFormatSettings = mParams.dateFormatSettings;
			if (!this._oDateFormatSettings) {
				this._oDateFormatSettings = {};
			}
			// Default to UTC true if nothing is provided --> as sap:display-format="Date" should be used without a timezone
			if (!this._oDateFormatSettings.hasOwnProperty("UTC")) {
				this._oDateFormatSettings["UTC"] = true;
			}

			this._fieldViewMetadata = mParams.fieldViewMetadata;
			this.sValueListEntitySetName = null;

			// Default resolution of InOut params when used in standard OData scenarios
			this.bResolveInOutParams = (mParams.resolveInOutParams === false) ? false : true;
			// The configured display behaviour
			this.sDisplayBehaviour = mParams.displayBehaviour;
			// the calculated display behaviour for DDLB
			this.sDDLBDisplayBehaviour = this.sDisplayBehaviour;
			if (!this.sDDLBDisplayBehaviour || this.sDDLBDisplayBehaviour === DisplayBehaviour.auto) {
				this.sDDLBDisplayBehaviour = this.oFilterProvider ? this.oFilterProvider.sDefaultDropDownDisplayBehaviour : DisplayBehaviour.descriptionOnly;
			}

			this._sType = mParams.type;
			this._sMaxLength = mParams.maxLength;

			// If the property if part of a complex type this would be filled
			this.sPropertyTypePath = "";
			if (this.bResolveInOutParams && !this.oFilterModel && !this.oFilterProvider) {
				this._resolvePropertyPath();
			}


			if (mParams.loadAnnotation && mParams.fullyQualifiedFieldName) {
				this._oMetadataAnalyser = mParams.metadataAnalyser;
				this._sFullyQualifiedFieldName = mParams.fullyQualifiedFieldName;
				this._attachAnnotationLoadOnRender();
			} else {
				if (mParams.loadAnnotation) {
					Log.error("BaseValueListProvider", "loadAnnotation is true, but no fullyQualifiedFieldName set for field '" + (this._sFullyQualifiedFieldName || this.sFieldName) + "'! Please check your annotations");
				}
				this._onAnnotationLoad({
					primaryValueListAnnotation: mParams.annotation,
					additionalAnnotations: mParams.additionalAnnotations
				});
			}

		}
	});

	/**
	 * Attach to control render events to trigger load
	 * @private
	 */
	BaseValueListProvider.prototype._attachAnnotationLoadOnRender = function() {
		/**
		 * Delay the fetch of valuelist metadata until the control is being rendered!
		 */
		this.oBeforeRenderingEventDelegate = {
			onBeforeRendering: function() {
				this.oControl.removeEventDelegate(this.oBeforeRenderingEventDelegate, this);
				delete this.oBeforeRenderingEventDelegate;

				if (!this._bValueListRequested) {

					if (this.bInitialised) {
						if (this._onMetadataInitialised && this.sAggregationName && !this.bTypeAheadEnabled && this.oControl.$()) {
							this._onMetadataInitialised();
						}
					} else {
						this._loadAnnotation();
					}

				}
			}
		};
		this.oControl.addEventDelegate(this.oBeforeRenderingEventDelegate, this);
	};

	/**
	 * Ensure the metadata is loaded. In case the metadata are not yet loaded, the load will be initiated.<br>
	 * <b>Note:</b>the request for metadata is triggered asynchronously.
	 * @private
	 */
	BaseValueListProvider.prototype.loadAnnotation = function() {
		if (this.oBeforeRenderingEventDelegate) {
			this.oControl.removeEventDelegate(this.oBeforeRenderingEventDelegate, this);
			delete this.oBeforeRenderingEventDelegate;
		}

		if (this.oAfterRenderingEventDelegate) {
			this.oControl.removeEventDelegate(this.oAfterRenderingEventDelegate, this);
			delete this.oAfterRenderingEventDelegate;
		}

		this._loadAnnotation();
	};

	/**
	 * Load the annotation from ODataModel
	 * @private
	 */
	BaseValueListProvider.prototype._loadAnnotation = function() {

		if (!this._bValueListRequested) {

			this._bValueListRequested = true;

			if (!this._oMetadataAnalyser) {
				this._oMetadataAnalyser = new MetadataAnalyser(this.oODataModel);
				this._bCleanupMetadataAnalyser = true;
			}

			this._oMetadataAnalyser.getValueListAnnotationLazy(this._sFullyQualifiedFieldName).then(this._onAnnotationLoad.bind(this), function(oError) {
				this._oError = oError;
				this.bInitialised = true;
				Log.debug(oError);
			}.bind(this));
		}
	};

	/**
	 * Attaches event handler <code>fnFunction</code> to the <code>valueListChanged</code> event.<br>
	 * This event is relevant only while setting data back (OUT parameters) to the ODataModel
	 * @param {function} fnFunction the function to call when the event occurs
	 * @param {object} [oListener] object on which to call the given function
	 * @public
	 * @since 1.32.0
	 */
	BaseValueListProvider.prototype.attachValueListChanged = function(fnFunction, oListener) {
		this.attachEvent("valueListChanged", fnFunction, oListener);
	};

	/**
	 * Detaches event handler <code>fnFunction</code> from the <code>valueListChanged</code> event.<br>
	 * This event is relevant only while setting data back (OUT parameters) to the ODataModel
	 * @param {function} fnFunction the function to call when the event occurs
	 * @param {object} [oListener] object on which to call the given function
	 * @public
	 * @since 1.32.0
	 */
	BaseValueListProvider.prototype.detachValueListChanged = function(fnFunction, oListener) {
		this.detachEvent("valueListChanged", fnFunction, oListener);
	};

	/**
	 * Called once valuelist annotation is loaded!
	 * @private
	 * @param {Object} mValueList - value list annotation from metadata
	 */
	BaseValueListProvider.prototype._onAnnotationLoad = function(mValueList) {
		this.oPrimaryValueListAnnotation = mValueList.primaryValueListAnnotation;
		this.additionalAnnotations = mValueList.additionalAnnotations;
		this._resolveAnnotationData(this.oPrimaryValueListAnnotation);
		this.bInitialised = true;
		this._setupRecommendations();
		if (this._onMetadataInitialised && this.sAggregationName && !this.bTypeAheadEnabled && this.oControl.$()) {
			this._onMetadataInitialised();
		}
	};

	/**
	 * Resolve the path from control's binding info to find out if the property is part of a ComplexType. (This is valid only for ODataModel In/Out
	 * parameter handling)
	 * @private
	 */
	BaseValueListProvider.prototype._resolvePropertyPath = function() {
		var oBindingInfo = this.oControl.getBindingInfo("value"), sPath, sProperty, aPaths;
		if (oBindingInfo && oBindingInfo.parts) {
			sPath = oBindingInfo.parts[0] ? oBindingInfo.parts[0].path : "";
		}
		if (sPath) {
			aPaths = sPath.split("/");
			if (aPaths.length > 1) {
				sProperty = aPaths[aPaths.length - 1];
				this.sPropertyTypePath = sPath.replace("/" + sProperty, "");
			}
		}
	};

	/**
	 * Resolve the annotation data and recalculate the required metadata
	 * @param {Object} oAnnotation - the selected annotation which needs to be processed
	 * @private
	 */
	BaseValueListProvider.prototype._resolveAnnotationData = function(oAnnotation) {
		var iLen = 0, i = 0, aCols, oField;
		if (this.oODataModel && oAnnotation) {
			this.bSupportBasicSearch = oAnnotation.isSearchSupported;
			this.sValueListTitle = oAnnotation.valueListTitle || oAnnotation.qualifier;
			this.sKey = oAnnotation.keyField;
			this._aKeys = oAnnotation.keys;
			this.sValueListEntitySetName = oAnnotation.valueListEntitySetName;
			this.mInParams = oAnnotation.inParams;
			this.mOutParams = oAnnotation.outParams;

			// the calculated display behaviour for tokens
			this.sTokenDisplayBehaviour = this.sDisplayBehaviour;
			if (!this.sTokenDisplayBehaviour || this.sTokenDisplayBehaviour === DisplayBehaviour.auto) {
				this.sTokenDisplayBehaviour = this.oFilterProvider ? this.oFilterProvider.sDefaultTokenDisplayBehaviour : DisplayBehaviour.descriptionAndId;
			}

			// fallback to idOnly if no description is present for tokens
			if (!oAnnotation.descriptionField) {
				this.sTokenDisplayBehaviour = DisplayBehaviour.idOnly;
			}

			this.sDescription = oAnnotation.descriptionField || this.sKey; // fall back to key if there is no description

			if (this.sValueListEntitySetName && this.sKey) {
				// Get the Columns information (all fields on the UI)
				this._aCols = [];
				this.aSelect = [];
				aCols = oAnnotation.valueListFields;
				iLen = aCols.length;
				for (i = 0; i < iLen; i++) {
					oField = aCols[i];

					if (oField.visible) {
						this._aCols.push(this._getColumnConfigFromField(oField));
					}
					// Request data for fields regardless of visibility (since it could be needed for OUT param handling)!
					this.aSelect.push(oField.name);
				}
				if (oAnnotation.descriptionField) {
					this.aSelect.push(oAnnotation.descriptionField);
				}
			} else {
				if (!this.sKey) {
					Log.error("BaseValueListProvider", "key for ValueListEntitySetName '" + this.sValueListEntitySetName + "' missing! Please check your annotations");
				}
			}
		}
	};

	BaseValueListProvider.prototype._getColumnConfigFromField = function (oField) {
		var sType = null,
			oType = null,
			oConstraints,
			oFormatOptions;

		if (oField.type === "Edm.Boolean") {
			sType = "boolean";
		} else if (oField.type === "Edm.DateTime" && oField.displayFormat === "Date") {
			sType = "date";
			oFormatOptions = this._oDateFormatSettings;
			oConstraints = {
				displayFormat: "Date"
			};
		} else if (oField.type === "Edm.Decimal") {
			sType = "decimal";
			oConstraints = {
				precision: oField.precision,
				scale: oField.scale
			};
		} else if (oField.type === "Edm.String") {
			if (oField.isCalendarDate) {
				sType = "stringdate";
			} else {
				sType = "string";
			}
		}

		oType = ODataType.getType(oField.type, oFormatOptions, oConstraints, oField.isCalendarDate);

		return {
			label: oField.fieldLabel,
			tooltip: oField.quickInfo || oField.fieldLabel,
			type: sType,
			oType: oType,
			width: FormatUtil.getWidth(oField, 15),
			template: oField.name,
			sort: oField.sortable ? oField.name : undefined,
			sorted: oField.sortable && oField.name === this.sKey,
			sortOrder: "Ascending" // sap.ui.table.SortOrder.Ascending
		};
	};

	BaseValueListProvider.prototype._getFilterData = function() {
		var oData, oFilterData = {};

		if (this.oFilterProvider && this.oFilterProvider._oSmartFilter) {
			oData = this.oFilterProvider._oSmartFilter.getFilterData();

			if (this.sFieldName && (this.sFieldName.indexOf(ANALYTICAL_PARAMETER_PREFIX) === 0)) {

				Object.keys(oData).forEach(function(sName) {
					var name = sName.split(ANALYTICAL_PARAMETER_PREFIX);
					oFilterData[name[name.length - 1]] = oData[sName];
				});

				return oFilterData;
			}

		}

		return oData;
	};

	BaseValueListProvider.prototype._setFilterData = function(mFilterOutputData) {
		var oData = mFilterOutputData, oFilterData = {};

		if (this.oFilterProvider) {

			if (this.sFieldName && (this.sFieldName.indexOf(ANALYTICAL_PARAMETER_PREFIX) === 0)) {

				Object.keys(mFilterOutputData).forEach(function(sName) {
					oFilterData[ANALYTICAL_PARAMETER_PREFIX + sName] = mFilterOutputData[sName];
				});

				oData = oFilterData;
			}

			this.oFilterProvider.setFilterData(oData);
		}
	};

	BaseValueListProvider.prototype._adaptEdmDateTimePropertyValue = function(sValueListFieldName, sValue) {

		var sRetValue = sValue;

		if (sValue instanceof Date && this.oPrimaryValueListAnnotation && this.oPrimaryValueListAnnotation.fields) {
			var oProperty = null;

			this.oPrimaryValueListAnnotation.fields.some(function(oProp) {
				if (oProp.name === sValueListFieldName) {
					oProperty = oProp;
				}

				return oProperty !== null;
			});

			if (oProperty && oProperty.type === "Edm.DateTime" && oProperty.displayFormat === "Date") {
				sRetValue = DateTimeUtil.utcToLocal(sValue);
			}
		}

		return sRetValue;
	};

	/**
	 * Called by the control when needed, to get input data for filtering
	 * @private
	 */
	BaseValueListProvider.prototype._calculateFilterInputData = function() {
		var sLocalFieldName, sValueListFieldName, oData = null, oBindingContext;
		// Search view can be switched for collective search help; reset the mFilterInputData in that case.
		delete this.mFilterInputData;
		// Check if the SmartFilter is present and try to get data for only visible fields from SmartFilter
		// else use the filterModel to get data
		if (this.oFilterProvider && this.oFilterProvider._oSmartFilter) {
			oData = this._getFilterData();
		} else if (this.oFilterModel) {
			oData = this.oFilterModel.getData();
		}

		if (this.mInParams && oData) {
			this.mFilterInputData = {};
			this.aFilterField = [];
			for (sLocalFieldName in this.mInParams) {
				if (sLocalFieldName) {
					sValueListFieldName = this.mInParams[sLocalFieldName];
					// Adapt the name so that it matches the FilterProvider's format for fields behind NavProps (see FilterProvider.prototype._getFieldName())
					sValueListFieldName = sValueListFieldName.replace("/", ".");
					if (sValueListFieldName !== this.sKey) {
						// Only set IN parameter data if it is non empty
						if (oData[sLocalFieldName]) {
							this.mFilterInputData[sValueListFieldName] = oData[sLocalFieldName];

							if (typeof this.mFilterInputData[sValueListFieldName] === "object") {
								if (this.mFilterInputData[sValueListFieldName].ranges && this.mFilterInputData[sValueListFieldName].ranges.length > 0) {
									//In case of ranges as inParams map the keyField of the source range to the new keyField name
									for (var i = 0; i < this.mFilterInputData[sValueListFieldName].ranges.length; i++) {
										this.mFilterInputData[sValueListFieldName].ranges[i].keyField = sValueListFieldName;
									}
								}
							}
							this.aFilterField.push(sValueListFieldName);
						}
					}
				}
			}

		} else if (this.oODataModel && this.bResolveInOutParams) {
			oBindingContext = this.oControl.getBindingContext();
			if (this.mInParams && oBindingContext) {
				this.mFilterInputData = {};
				this.aFilterField = [];
				for (sLocalFieldName in this.mInParams) {
					if (sLocalFieldName) {
						sValueListFieldName = this.mInParams[sLocalFieldName];
						// Adapt the name so that it matches the FilterProvider's format for fields behind NavProps (see FilterProvider.prototype._getFieldName())
						sValueListFieldName = sValueListFieldName.replace("/", ".");
						if (sValueListFieldName !== this.sKey) {

							var sPathToResolve = this.sPropertyTypePath ? this.sPropertyTypePath + "/" + sLocalFieldName : sLocalFieldName;
							var sValue = oBindingContext.getProperty(sPathToResolve);
							// Only set IN parameter data if it is non empty
							if (sValue) {

								sValue = this._adaptEdmDateTimePropertyValue(sValueListFieldName, sValue);

								this.mFilterInputData[sValueListFieldName] = sValue;
								this.aFilterField.push(sValueListFieldName);
							}
						}
					}
				}
			}
		}

	};

	/**
	 * Called when data needs to be set back to the SmartFilter from ValueHelp/suggest
	 * @param {Array} aData - array of row data that has be set back
	 * @private
	 */
	BaseValueListProvider.prototype._calculateAndSetFilterOutputData = function(aData) {
		var sLocalFieldName, sValueListFieldName, mFilterOutputData = null, oData, oExistingData, oNewData, i, fFilterItemDuplicates, fFilterRangeDuplicates, fFilterItemInRangesDuplicates;
		if (this.mOutParams && aData && (this.oFilterProvider || this.oFilterModel)) {
			mFilterOutputData = {};

			fFilterItemDuplicates = function(oItem) {
				return oItem.key === oNewData.key;
			};

			fFilterRangeDuplicates = function(oRange) {
				if (oNewData.value1 instanceof Date && oRange.value1 instanceof Date) {
					return oRange.operation === "EQ" && oNewData.value1.getTime() === oRange.value1.getTime();
				}
				return oRange.operation === "EQ" && oNewData.value1 === oRange.value1;
			};

			fFilterItemInRangesDuplicates = function(oRange) {
				return oRange.operation === "EQ" && oNewData.key === oRange.value1;
			};

			for (sLocalFieldName in this.mOutParams) {
				if (sLocalFieldName) {

					//BCP: 1980107623
					var oFieldViewMetadata = this.oFilterProvider && this.oFilterProvider._getFieldMetadata(sLocalFieldName);

					sValueListFieldName = this.mOutParams[sLocalFieldName];
					if (sValueListFieldName !== this.sKey) {
						oExistingData = null;
						i = aData.length;
						while (i--) {
							oData = aData[i];
							// Only set Out parameter data if it exists in the passed data
							if (oData[sValueListFieldName]) {
								var oValue = oData[sValueListFieldName];

								var bAddAsRange = oFieldViewMetadata && (oFieldViewMetadata.type === "Edm.DateTime" || !oFieldViewMetadata.hasValueListAnnotation);

								if (bAddAsRange) {
									//BCP: 1980107623
									// we check if the type is DateTime and UTC==true and correct the time part.
									if (oFieldViewMetadata.type === "Edm.DateTime" && this._oDateFormatSettings.UTC == true) {
										// update the time to 00:00:00 GMT +-x
										oValue = DateTimeUtil.utcToLocal(oValue);
									}

									// date outParameter must be added to the ranges array of the FilterProvider model
									oNewData = {
										"exclude": false,
										"operation": "EQ",
										"keyField": sLocalFieldName,
										"value1": oValue,
										"value2": null
									};

								} else {
									// normal outParameter of type string are stored/added in the items array of the FilterProvider model
									oNewData = {
										key: oValue
									};
								}

								if (!mFilterOutputData[sLocalFieldName]) {
									// Get Existing filter data
									if (!oExistingData && this.oFilterModel) {
										oExistingData = this.oFilterModel.getData();
									}
									// if existing data already contains the property as a multi-value --> amend to it
									if (oExistingData && oExistingData[sLocalFieldName] && oExistingData[sLocalFieldName].items) {
										mFilterOutputData[sLocalFieldName] = oExistingData[sLocalFieldName];

										if (!mFilterOutputData[sLocalFieldName].ranges) {
											// make sure an empty ranges array exist
											mFilterOutputData[sLocalFieldName].ranges = [];
										}
									} else {
										mFilterOutputData[sLocalFieldName] = {
											items: [],
											ranges: []
										};
									}
								}

								var oFieldData = mFilterOutputData[sLocalFieldName];
								if (bAddAsRange) {
									// only for string type outParameters the values should be stored into the items array.

									// For all other types (which do not provide a VHD with Select from Table) we have to add this a ranges into the filterProvider
									// we currently do this only for DateTime type. It would be better to change the if into
									// if (!(oFieldViewMetadata && oFieldViewMetadata.type === "Edm.String")) ...
									if (oFieldData.ranges.filter(fFilterRangeDuplicates).length <= 0) {
										//In case the target Filterfield for the property is of type singleValue we can add it as ranges element. The parseFilterData of the filterProvider will handle it and store it as a direct value
										// oFieldData = oNewData.value1;
										oFieldData.ranges.push(oNewData);
									}
								} else 	// Check for duplicates before adding new data in items
									if (oFieldData.items.filter(fFilterItemDuplicates).length <= 0) {
										// Check for duplicates - check if the item key exist as ranges with EQ operation (avoid range tokens with the same values as the item.key)
										//BCP: 1970226608
										if (!oFieldData.ranges || oFieldData.ranges.filter(fFilterItemInRangesDuplicates).length <= 0) {
											//In case the target Filterfield for the property is of type singleValue we can add it as items element. The parseFilterData of the filterProvider will handle it and store it as a direct value
											// oFieldData = oNewData.key;

											//TODO if the target FilterField does not provide a ValueHelp list the outParameter should be added as a range (see the above hasValueListAnnotation)
											oFieldData.items.push(oNewData);
										}
									}

							}
						}
					}
				}
			}

			if (mFilterOutputData) {
				// Use API from FilterProvider if it exists
				if (this.oFilterProvider) {
					this._setFilterData(mFilterOutputData);
					// this.oFilterProvider.setFilterData(mFilterOutputData);

					if (!jQuery.isEmptyObject(mFilterOutputData)) {
						this.fireEvent("valueListChanged", {
							"changes": Object.keys(mFilterOutputData)
						});
					}
				} else if (this.oFilterModel) {
					// try to merge data into the filter model
					this.oFilterModel.setData(mFilterOutputData, true);
				}
			}
		} else if (this.oODataModel && this.bResolveInOutParams) {
			// ODataModel --> assume only 1 value can be set back!
			this._calculateAndSetODataModelOutputData(aData[0]);
		}
	};

	/**
	 * Called when data needs to be set back to the Model (ODataModel) from ValueHelp/suggest
	 * @param {Object} oData - the row data that needs to be set back
	 * @private
	 */
	BaseValueListProvider.prototype._calculateAndSetODataModelOutputData = function(oData) {
		var oBindingContext, sLocalFieldName, sValueListFieldName, sPathToResolve, oValue, mChangedFields = {};
		if (oData && this.mOutParams) {
			oBindingContext = this.oControl.getBindingContext();
			for (sLocalFieldName in this.mOutParams) {
				if (sLocalFieldName) {
					sValueListFieldName = this.mOutParams[sLocalFieldName];
					if (sValueListFieldName !== this.sKey) {
						oValue = oData[sValueListFieldName];
						mChangedFields[sLocalFieldName] = oValue;

						sPathToResolve = this.sPropertyTypePath ? this.sPropertyTypePath + "/" + sLocalFieldName : sLocalFieldName;
						this.oODataModel.setProperty(sPathToResolve, oValue, oBindingContext, true);
					}
				}
			}
			if (mChangedFields && !jQuery.isEmptyObject(mChangedFields)) {
				this.fireEvent("valueListChanged", {
					"changes": mChangedFields
				});
			}
		}
	};

	BaseValueListProvider.prototype._setupRecommendations = function () {
	};

	/**
	 * Destroys the object
	 */
	BaseValueListProvider.prototype.destroy = function() {
		EventProvider.prototype.destroy.apply(this, arguments);
		if (this._bCleanupMetadataAnalyser && this._oMetadataAnalyser) {
			this._oMetadataAnalyser.destroy();
		}
		this._oMetadataAnalyser = null;

		//remove delegates from control if it still exist
		//BCP: 1880658667
		if (this.oBeforeRenderingEventDelegate) {
			this.oControl.removeEventDelegate(this.oBeforeRenderingEventDelegate);
			delete this.oBeforeRenderingEventDelegate;
		}
		if (this.oAfterRenderingEventDelegate) {
			this.oControl.removeEventDelegate(this.oAfterRenderingEventDelegate);
			delete this.oAfterRenderingEventDelegate;
		}

		this.oControl = null;
		this.sFieldName = null;
		this.mFilterInputData = null;
		this.aFilterField = null;
		this.sValueListEntitySetName = null;
		this.oODataModel = null;
		this.oFilterModel = null;
		this.oFilterProvider = null;
		this.oPrimaryValueListAnnotation = null;
		this.additionalAnnotations = null;
		this.sDisplayFormat = null;
		this.bSupportBasicSearch = null;
		this.bInitialised = null;
		this._oError = null;
		this.sValueListTitle = null;
		this.sKey = null;
		this._aKeys = null;
		this.mInParams = null;
		this.mOutParams = null;
		this.sDescription = null;
		this.aSelect = null;
		this._aCols = null;
		this.sDDLBDisplayBehaviour = null;
		this.sTokenDisplayBehaviour = null;
		this._oDateFormatSettings = null;
		this._fieldViewMetadata = null;

		this.bIsDestroyed = true;
	};

	return BaseValueListProvider;

});
