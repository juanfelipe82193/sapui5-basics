sap.ui.define([
	"sap/ui/comp/odata/MetadataAnalyser",
	"sap/ui/base/Object",
	"sap/ui/model/Context",
	"sap/suite/ui/generic/template/AnalyticalListPage/util/OperationCode",
	"sap/suite/ui/generic/template/AnalyticalListPage/util/V4Terms",
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/odata/AnnotationHelper",
	"sap/ui/events/KeyCodes"
	],  function(MetadataAnalyser, BaseObject, Context, OperationCode, V4Terms, DateFormat, ODataAnnotationHelper, KeyCodes) {
		"use strict";
		var FilterUtil = BaseObject.extend("sap.suite.ui.generic.template.AnalyticalListPage.util.FilterUtil");
		/**
		 * @private
		 * This function create a title by combining the label and id
		 * @param  {string} sDimValueDisplay the label field
		 * @param  {string} sDimValue the id field
		 * @return {string} the newly created title
		 */
		FilterUtil.createTitle = function (sDimValueDisplay, sDimValue) {
			var sTitle;
			if (!sDimValueDisplay) {
				return sDimValue;
			}
			if (sDimValue instanceof Date ) {
				return sDimValueDisplay;
			}
			//for donut chart
			if (sDimValueDisplay.indexOf(':') !== -1 ) {
				sDimValueDisplay = sDimValueDisplay.substring(0, sDimValueDisplay.indexOf(':'));
			}
			//if not already concatenated
			if (sDimValueDisplay.indexOf(sDimValue) === -1) {
				sTitle = sDimValueDisplay + " (" +  sDimValue + ")";
			} else {
				sTitle = sDimValueDisplay;
			}
			return sTitle;
		};
		/**
		 * This function updates the InvisibleText of the visual filter on the dialog. Since there are multiple
		 * buttons on the toolbar, here the tab access message is read out even in case of an overlay being applied.
		 *
		 * @param  {sap.m.VBox} oItem - The VBox object that holds the visual filter.
		 * @private
		 */
		FilterUtil._updateVisualFilterAria = function (oItem) {
			var oFilterItem = oItem.getItems()[2].getItems()[0];
			var sParentProperty = oFilterItem.getParentProperty();
			var oResourceBundle = oFilterItem.getModel("i18n").getResourceBundle();
			var sText = oResourceBundle.getText("VIS_FILTER_ITEM_ARIA");
			if (oFilterItem.getIsMandatory()) {
				sText += " " + oResourceBundle.getText("VIS_FILTER_MANDATORY_PROPERTY_ARIA", sParentProperty);
			}
			sText += " " + oResourceBundle.getText("VIS_FILTER_DIALOG_NAVIGATE_ARIA") + " " + oResourceBundle.getText("VIS_FILTER_ACCESS_FIELDS_ARIA");
			oItem.getItems()[3].setText(sText);
		};
		/**
		 * This function returns all mandatory filters for the valuehelp
		 * @param  {object} model instance
		 * @param  {string} valuehelp entity set
		 * @return {array} the mandatory filters for the valuehelp
		 */
		FilterUtil.getAllMandatoryFilters = function (model, entitySet) {
			var oMetadataAnalyser = new MetadataAnalyser(model);
			var entityTypePath = oMetadataAnalyser.getEntityTypeNameFromEntitySetName(entitySet);
			var allProps = oMetadataAnalyser.getFieldsByEntityTypeName(entityTypePath);
			var aFilters = [];
			for (var key in allProps) {
				var oDataProperty = allProps[key];
				if (oDataProperty.requiredFilterField) {
					aFilters.push(oDataProperty.name);
				}
			}
			return aFilters;
		};
		/**
		 * This function returns both IN mapped and unmapped mandatory filters in an object
		 * @param  {array} all mandatory filters for the valuehelp
		 * @param  {array} all IN parameters for the visual filter
		 * @return {object} the object with both IN mapped and unmapped mandatory filters
		 */
		FilterUtil.getAllMandatoryFiltersMapping = function (valuehelpAllMandatoryFilters, aInParameters) {
			var aFilters = [], aMissingFilters = [], bMissing = false;
			for (var i = 0; i < valuehelpAllMandatoryFilters.length; i++) {
				bMissing = true;
				for (var j = 0; j < aInParameters.length; j++) {
					if (valuehelpAllMandatoryFilters[i] === aInParameters[j].valueListProperty) {
						aFilters.push(aInParameters[j]);
						bMissing = false;
						break;
					}
				}
				if (bMissing) {
					aMissingFilters.push(valuehelpAllMandatoryFilters[i]);
				}
			}
			var valuehelpAllMandatoryFiltersMapped = {
				aMappedFilterList : aFilters, //array containing the names(localDataProperty and valueListProperty) of mandatory filters in the valuehelp entity set that have IN mapping
				aMappingMissingFilterList : aMissingFilters //array containing the names(valueListProperty) of mandatory filters in the valuehelp entity set that do not have IN mapping
			};
			return valuehelpAllMandatoryFiltersMapped;
		};
		/**
		 * This function checks whether mandatory filter has a SelectionVariant and returns true if it does, otherwise returns false
		 * @param  {array} SelectOptions array
		 * @param  {string} the mandatory filter string
		 * @return {boolean} boolean value based on whether SelectionVariant exists for the mandatory filter
		 */
		FilterUtil.checkFilterHasValueFromSelectionVariant = function (aSVOptions, sFilter) {
			return aSVOptions.some(function(fil) {
				if (fil.PropertyName.PropertyPath === sFilter) {
					return true;
				}
			});
		};
		/**
		 * This function checks whether mandatory filter has a value on smart filter bar and returns true if it does, otherwise returns false
		 * @param  {array} smart filter bar values array
		 * @param  {string} the mandatory filter string
		 * @return {boolean} boolean value based on whether smart filter bar value exists for the mandatory filter
		 */
		FilterUtil.checkFilterHasValueFromSmartFilterBar = function (aSFBValues, sFilter) {
			return aSFBValues.some(function(param) { //mandatory filters can be set in SFB
				if (param.getName() === sFilter) {
					return true;
				}
			});
		};
		/**
		 * This function checks whether mandatory filter has a value on smart filter bar and returns true if it does, otherwise returns false
		 * @param  {string} name of the mandatory filter in the valuehelp entity set
		 * @param  {string} name of the mandatory filter in the main entity set
		 * @param  {array} SelectOptions array
		 * @param  {object} SmartFilterBar object
		 * @return  {boolean} boolean value based on whether either SmartFilterBar or SelectionVariant has a value for the mandatory filter
		 */
		FilterUtil.checkFilterHasValueFromSelectionVariantOrSmartFilterBar = function (sFilter1, sFilter2, aSVOptions, oSmartFilterBar) {
			var bHasValue = aSVOptions && FilterUtil.checkFilterHasValueFromSelectionVariant(aSVOptions, sFilter1);
				if (!bHasValue) {
					bHasValue = FilterUtil.checkFilterHasValueFromSmartFilterBar(oSmartFilterBar.getFiltersWithValues(), sFilter2);
				}
			return bHasValue;
		};
		/*
		 * This function access nested object and returns the correct value if it exists, and undefined in all other cases
		 * @param  {object} nested object
		 * @param  {string} sNestedProperty the property string
		 * @return {object} return the required object if exist otherwise return undefined
		 */
		FilterUtil.readProperty = function(oObject, sNestedProperty) {
			var i = 0,
			oProperties = typeof sNestedProperty === 'string' ? sNestedProperty.split(".") : [];
			while (i < oProperties.length) {
				if (!oObject) {
					return undefined;
				}
				oObject = oObject[oProperties[i++]];
			}
			return oObject;
		};
		/**
		 * This function execute a function associated with an object and return the result if the function is exists, and undefined in all other cases
		 * @param  {object}   oObject       nested object
		 * @param  {string}   sFunctionName full name of the function
		 * @param  {array} oArgs         array of object as arguments to the function
		 * @return {object}                 return the result after executing the function if the function is exists, otherwise return undefined
		 */
		FilterUtil.executeFunction = function(oObject, sFunctionName, oArgs){
			var i = 0,
			oParent,
			oProperties = typeof sFunctionName === 'string' ? sFunctionName.split(".") : [];
			while (i < oProperties.length) {
				if (!oObject) {
					return undefined;
				}
				oParent = oObject;
				oObject = oObject[oProperties[i++]];
			}
			return typeof oObject === 'function' ? oObject.apply(oParent, oArgs) : undefined;
		};
		/**
		 * This function create a title from the operation code
		 * @param  {object} oFilterValueRange ranges
		 * @return {string} title
		 */
		FilterUtil.createTitleFromCode = function(oFilterValueRange) {
			var sValueA = FilterUtil.readProperty(oFilterValueRange, "value1"),
			sValueB = FilterUtil.readProperty(oFilterValueRange, "value2"),
			sOperation = FilterUtil.readProperty(oFilterValueRange, "operation"),
			sResult;
			if ( !sValueA || !sOperation || !OperationCode[sOperation]) {
				return undefined;
			}
			//if there's a range specified and operation is other than EQ eg : <,> ...
			if (sValueB && sOperation !== "EQ") {
				sResult = sValueA + OperationCode[sOperation].code + sValueB;
				//pre existing code. Need to check if required and to be removed
			} else if (OperationCode[sOperation].position === "last") {
				sResult = sValueA + OperationCode[sOperation].code;
				//pre existing code. Need to check if required and to be removed
			} else if (OperationCode[sOperation].position === "mid") {
				sResult = OperationCode[sOperation].code + sValueA + OperationCode[sOperation].code;
				// If there's a value present and Operation is "EQ", text is generated as below
			} else {
				sResult = OperationCode[sOperation].code + sValueA;
			}
			// This condition is when there's others selected.
			if (oFilterValueRange.exclude) {
				sResult = "!(" + sResult + ")";
			}
			return sResult;
		};

		/**
		 * Formatter to create Filters link text
		 * @param  {Object} oContext FilterData
		 * @return {string} Text for filters link
		 */
		FilterUtil.formatFiltersLink = function(oContext) {
			var i18n = this.getModel("i18n"),
			rb = i18n.getResourceBundle();
			var length = oContext ? oContext.length : 0;
			return (oContext && length) ? rb.getText("VISUAL_FILTER_FILTERS_WITH_COUNT", [length]) : rb.getText("VISUAL_FILTER_FILTERS");
		};
		/**
		 * [getBooleanValue  get the boolean value ]
		 * @param  {object} oValue   [Value]
		 * @param  {boolean} bDefault [default value ]
		 * @return {boolean}          [returns true/false based on the value]
		 */
		FilterUtil.getBooleanValue = function(oValue, bDefault){
			if (oValue && oValue.Bool) {
				if (oValue.Bool.toLowerCase() === "true") {
					return true;
				} else if (oValue.Bool.toLowerCase() === "false") {
					return false;
				}
			}
			return bDefault;
		};

		/**
		 * [getPrimitiveValue returns the value with respective type]
		 * @param  {object} oValue [description]
		 * @return {*}        [returns the primitive type]
		 */
		FilterUtil.getPrimitiveValue = function (oValue) {
			var value;

			if (oValue) {
				if (oValue.String ) {
					value = oValue.String;
				} else if (oValue.Bool) {
					value = FilterUtil.getBooleanValue(oValue);
				} else if (oValue.EnumMember){
					value = oValue.EnumMember.split("/")[1];
				} else {
					value = FilterUtil.getNumberValue(oValue);
				}
			}

			return value;
		};

		/**
		 * [getNumberValue parses the oValue into the number value based on the type ]
		 * @param  {object} oValue [value]
		 * @return {number}        [returns the value in the number format  ]
		 */
		FilterUtil.getNumberValue = function (oValue) {
		//Here the oValue obj always returns one key which is either of value present in the array.
			if (oValue) {
				var sVal = Object.keys(oValue)[0];
				return (oValue && sVal && ["String","Int","Decimal","Double","Single"].indexOf(sVal) !== -1 ) ? Number(oValue[sVal]) : undefined;
			}
		};

		/**
		 * [getPathOrPrimitiveValue returns the path of the oItem ]
		 * @param  {object} oModel [model name against which path to be verified]
		 * @param  {object} oItem     [oItem]
		 * @return {*}           [returns the path or its primitive Value]
		 */
		FilterUtil.getPathOrPrimitiveValue = function (oItem) {
			if (oItem) {
				return (oItem.Path) ? "{path:'" + oItem.Path + "'}" : FilterUtil.getPrimitiveValue(oItem);
			} else {
				return "";
			}
		};
		/**
		 * this method can be used to check if there has been change in the filters
		 * @param  {array/object} filter1
		 * @param  {array/object} filter2
		 * @return {boolean}
		 */
		FilterUtil.isFilterDiff = function(f1, f2) {
			if (Array.isArray(f1) != Array.isArray(f2)) {
				return true;
			}

			if (Array.isArray(f1)) {
				return this.isFilterListDiff(f1, f2);
			} else {
				return this.isFilterObjDiff(f1, f2);
			}
		};
		/**
		 * this method can be used to check if there has been change in the filters, when filter is of object type
		 * @param  {object} filter1
		 * @param  {object} filter2
		 * @return {boolean}
		 */
		FilterUtil.isFilterObjDiff = function(f1, f2) {
			if (!f1 || !f2) {
				return true;
			}
			for (var a in f1) {
				if (a == "aFilters") {
					if (this.isFilterListDiff(f1.aFilters, f2.aFilters)) {
						return true;
					}
				} else if (f1[a] != f2[a]) {
					return true;
				}
			}

			return false;
		};
		/**
		 * Function that returns a local date to UTC date
		 * @param {Object} oDate - The input local date object
		 * @returns {Object} The UTC offset date object
		 */
		FilterUtil.convertLocalDatetoUTCDate = function(oDate) {
			var oUTCDate = new Date(oDate.valueOf() + oDate.getTimezoneOffset() * 60 * 1000);
			//make sure to ignore time part
			return new Date(oUTCDate.setHours(0, 0, 0));
		};

		/**
		 * This method convert the date in to medium format
		 * @param  {Date} oDate [description]date object
		 * @return {string} date string in medium format
		 */
		FilterUtil.getDateInMedium = function(oDate) {
			return (oDate instanceof Date) ? DateFormat.getDateInstance({style : "medium"}).format(oDate) : undefined;
		};
		FilterUtil.getDateTimeInMedium = function(oDate) {
			return (oDate instanceof Date) ? DateFormat.getDateTimeInstance({style : "medium"}).format(oDate) : undefined;
		};
		/**
		 * This function check whether the current and default variant are equal or not
		 * @param  {object}  oState
		 * @return {boolean} return true if variants are equal
		 */
		FilterUtil.isDefaultVariantSelected = function(oState) {
			var oVariant = oState.oSmartFilterbar.getSmartVariant();
			return (oVariant && oVariant.getCurrentVariantId() === oVariant.getDefaultVariantKey());
		};
		/**
		 * this method can be used to check if there has been change in the filters, when filter is of array type.
		 * @param  {array} filter1
		 * @param  {array} filter2
		 * @return {boolean}
		 */
		FilterUtil.isFilterListDiff = function(fList1, fList2) {
			if (!fList1 || !fList2) {
				return true;
			}
			if (fList1.length != fList2.length) {
				return true;
			}

			for (var i = 0; i < fList1.length; i++) {
				var f1 = fList1[i];
				var f2 = fList2[i];

				if (this.isFilterObjDiff(f1, f2)) {
					return true;
				}
			}
			return false;
		};
		/**
		 * This method formats the Dimension Label as per Text Arrangement from Annotation.
		 * @param  {string} sDescription [description]Dimension Text Desciption
		 * @param  {string} sId [id]Dimention value
		 * @param  {string} sTextArragement [arrangement]Text Arrangement
		 * @return {string} formatted string with id and description
		 */
		FilterUtil.getTextArrangement = function(sDescription, sId, sTextArragement) {
			var sLabel,
			sDescOrIdOnly = sDescription ? sDescription : sId,
			sDescAndId = ( sDescription && sId ) ? sDescription + " (" + sId + ")" : sDescOrIdOnly;
			if ( sId !== "__IS_OTHER__" && sId !== "Other" ){  //Incase of Other in Donut Chart we need not to apply Text Arrangements
				switch ( sTextArragement ){
					//TextFirst Arrangement
					case sap.ui.comp.smartfilterbar.DisplayBehaviour.descriptionAndId : sLabel = sDescAndId;
					break;
					//TextOnly Arrangement
					case sap.ui.comp.smartfilterbar.DisplayBehaviour.descriptionOnly : sLabel = sDescription ? sDescription : "";
					break;
					//TextLast Arrangement
					case sap.ui.comp.smartfilterbar.DisplayBehaviour.idAndDescription : sLabel = ( sDescription && sId ) ? sId + " (" + sDescription + ")" : sDescOrIdOnly;
					break;
					//TextSeparate Arrangement
					case sap.ui.comp.smartfilterbar.DisplayBehaviour.idOnly : sLabel = sId ? sId : "";
					break;
					//Incase on Text Arrangemet Annotation not found then fallback to default arrangement i.e. descriptionAndId
					default : sLabel = sDescAndId;
					break;
				}
			} else {
				sLabel = sDescription;
			}
			return sLabel;
		};
		/**
		 * This method returns the value help tooltip.
		 * @param  {boolean} bIsVisible -  Boolean value that states whether value help is visible or not
		 * @param  {string} sDimenionField - Dimension field name
		 * @param  {object} rb - i18n model
		 * @param  {string} selectedItemsTooltip - Dimension of the chart
		 * @return {string} valueHelpTooltip - Value help tooltip
		 */
		FilterUtil.getTooltipForValueHelp = function (bIsValuehelp, sDimensionField, rb, count, bIsDatePicker) {
			var tooltipString = "";
			if (bIsDatePicker) {
				if (!count) {
					tooltipString = rb.getText("DP_WITHOUT_SELECTIONS", sDimensionField);
				} else {
					tooltipString = rb.getText("DP_SINGLE_SELECTED", [sDimensionField, count]);
				}
				return tooltipString;
			}
			//if no selections exist in chart
			if (!count) {
				tooltipString = bIsValuehelp ? rb.getText("VALUE_HELP", sDimensionField) : rb.getText("DROPDOWN_WITHOUT_SELECTIONS", sDimensionField);
			} else {
				//tooltip for dropdown with selections
				if (!bIsValuehelp) {
					tooltipString = rb.getText("DROPDOWN_WITH_SELECTIONS", [sDimensionField, count]);
				} else {
					//tooltip for value help with selections
					tooltipString = (count === 1) ? rb.getText("VH_SINGLE_SELECTED", [sDimensionField, count]) : rb.getText("VH_MULTI_SELECTED", [sDimensionField, count]);
				}

			}
			return tooltipString;
		};
		/**
		 * This method returns property name to be displayed on chart title/VH tooltip.
		 * @param  {object} model -  Model
		 * @param  {string} entitySet -  Entity set name
		 * @param  {string} propertyName - Dimension/Measure of the chart
		 * @return {string} propertyNameDisplay - Property name that has to be displayed
		 */
		FilterUtil.getPropertyNameDisplay = function (model, entitySet, propertyName, oAppI18nModel) {
			var oRB = oAppI18nModel ? oAppI18nModel.getResourceBundle() : undefined,
				oMetamodel = model.getMetaModel(),
				oEntityType = oMetamodel.getODataEntityType(oMetamodel.getODataEntitySet(entitySet).entityType),
				prop = oMetamodel.getODataProperty(oEntityType, propertyName);
			var sLabel = (prop["com.sap.vocabularies.Common.v1.Label"] && prop["com.sap.vocabularies.Common.v1.Label"].String) ? prop["com.sap.vocabularies.Common.v1.Label"].String : prop["sap:label"];
			if (sLabel) {
				if (sLabel.match(/{@i18n>.+}/gi) && oRB) {
					sLabel = oRB.getText(sLabel.substring(sLabel.indexOf(">") + 1, sLabel.length - 1));
				}
				return sLabel;
			} else {
				return propertyName;
			}
		};
		/**
		 * This method checks if a navigation property is present in the given entitySet
		 * @param  {object} model -  Model
		 * @param  {string} entitySet -  Entity set name
		 * @param  {string} navProperty - navigation property
		 * @return {bool}  - true/false.
		 */
		FilterUtil.IsNavigationProperty = function (model, entitySet, navProperty) {
			var oMetamodel = model.getMetaModel(),
				oEntityType = oMetamodel.getODataEntityType(oMetamodel.getODataEntitySet(entitySet).entityType);
			var navigationProperties = oEntityType['navigationProperty'];
			var bSuccess = false;
			if (navProperty.indexOf("/") !== -1) {
				for (var item = 0; item < navigationProperties.length; item++) {
					if (navigationProperties[item].name === navProperty.split("/")[0]) {
						bSuccess = true;
						break;
					}
				}
			}
			return bSuccess;
		};
		/**
		 * Function to get keys of navigation entity set
		 * @param  {object} MetaModel associated to the view
		 * @param  {string} simple entity set name (Ex: C_Budget_Analysis)
		 * @param  {string} navigation property of the entity type
		 * @return {array} || {null} navigation entity set keys array || null is no keys are found
		 */
		FilterUtil.getKeysForNavigationEntitySet = function (oMetaModel, sEntitySet, sNavProperty) {
			if (sNavProperty) {
				var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet),
				oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType),
				oAssociationEnd = oMetaModel.getODataAssociationEnd(oEntityType, sNavProperty),
				oNavigationEntityType = oMetaModel.getODataEntityType(oAssociationEnd.type),
				aNavigationEntityTypeKeys = this.readProperty(oNavigationEntityType, "key.propertyRef");
				//adding keys only for composite keys entity set. A temporary solution and have to be removed.
				if (aNavigationEntityTypeKeys && aNavigationEntityTypeKeys.length > 1) {
					return aNavigationEntityTypeKeys || null;
				} else {
					return null;
				}

			} else {
				return null;
			}
		};


		/**
		 * This method checks if a  property is non filterable in the given entitySet
		 * @param  {string} entitySet -  Entity set name
		 * @param  {string} propertyName - Dimension/Measure of the chart
		 * @return {bool}  - true/false.
		 */
		FilterUtil.isPropertyNonFilterable = function (sEntitySet, propertyName) {
			//return true if a property is non filterble
			if (!sEntitySet || !propertyName) {
				return false;
			}
			var filterRestrictions = sEntitySet[V4Terms.FilterRestrictions];
			var nonFilterable =  filterRestrictions && filterRestrictions.NonFilterableProperties;
			if (nonFilterable) {
				for (var i = 0; i < nonFilterable.length; i++) {
					if (nonFilterable[i].PropertyPath === propertyName) {
						return true;
					}
				}
			}
			return false;
		};
		/**
		 * Function to get select fields for the visual filter
		 * @param  {string} measure property of the visual filter
		 * @param  {string} dimension property of the visual filter
		 * @param  {string} sap:text property of the visual filter
		 * @param  {string} unit property of the visual filter
		 * @param  {array} Sort fields for the visual filter
		 * @param  {array} keys of the navigation entity set
		 * @return {array} select fields for the visual filter
		 */
		FilterUtil.getVisualFilterSelectFields = function (measureField, dimField, dimFieldDisplay, unitField, aSortFields, aNavigationPropertyKeys) {
			var aSelectFields = [measureField, dimField];
			if (dimField != dimFieldDisplay) {
				if (aSelectFields.indexOf(dimFieldDisplay) === -1) {
					aSelectFields.push(dimFieldDisplay);
				}
			}
			if (unitField) {
				if (aSelectFields.indexOf(unitField) === -1) {
					aSelectFields.push(unitField);
				}
			}

			if (aSortFields && Array.isArray(aSortFields)) {
				aSortFields.forEach(function(key) {
					if (aSelectFields.indexOf(key) === -1) {
						aSelectFields.push(key);
					}
				});
			}

			if (aNavigationPropertyKeys) {
				aNavigationPropertyKeys.forEach(function(key) {
					if (aSelectFields.indexOf(key.name) === -1) {
						aSelectFields.push(key.name);
					}
				});
			}
			return aSelectFields;
		};

		FilterUtil.getFilterDialogMode = function (oSmartFilterBar) {
			var bFilterDialogMode;
			if (oSmartFilterBar.isDialogOpen()) {
				var aContent = oSmartFilterBar.getFilterDialogContent();
				if (aContent && (aContent.length === 2)) {
					//If CF is visible
					if (aContent[0].getVisible()) {
						bFilterDialogMode = "compact";
					} else {
						bFilterDialogMode = "visual";
					}
				}
			}
			return bFilterDialogMode;
		};

		FilterUtil.getFilterMode = function (oModel) {
			return oModel.getProperty("/alp/filterMode");
		};

		FilterUtil.isVisualFilterLazyLoaded = function (oFilterItem) {
			if (!oFilterItem.getLazyLoadVisualFilter()) {
				return false;
			}
			//To check FilterDialog filtermode
			var oSmartFilterBar = sap.ui.getCore().byId(oFilterItem.getSmartFilterId());
			var bFilterDialogMode = this.getFilterDialogMode(oSmartFilterBar);
			if (bFilterDialogMode === "compact") {
				return true;
			} else if (bFilterDialogMode === "visual") {
				return false;
			}
			//To check FilterBar filtermode
			var bFilterBarMode = this.getFilterMode(oFilterItem.getModel("_templPriv"));
			if (bFilterBarMode === "compact") {
				return true;
			}
			return false;
		};

		FilterUtil.formatStringDate = function (oDimFieldDisplay, sDimField) {
			//sDimField will be undefined or "" for no sap:text
			if (!sDimField) {
				var oFormatter = DateFormat.getDateInstance({
					pattern: "yyyyMMdd"
				});
				if (oDimFieldDisplay !== "") {
					var oDate = oDimFieldDisplay && oFormatter.parse(oDimFieldDisplay);
					return FilterUtil.getDateInMedium(oDate);
				}
			}
			return oDimFieldDisplay;
		};

		FilterUtil.formatStringDateYearMonth = function (oDimFieldDisplay) {
			if (oDimFieldDisplay !== "") {
				var oFormatter = DateFormat.getDateTimeInstance({format: "YYYYMMM"});
				var a = oDimFieldDisplay;
				var b = "-";
				var position = 4;
				var output = [a.slice(0, position), b, a.slice(position)].join('');
				var oDate = new Date(output);
				return oFormatter.format(oDate);
			}
			return oDimFieldDisplay;
		};

		FilterUtil.getResolvedDimensionValue = function (sKeyValue) {
			return ((sKeyValue === null || sKeyValue === "") ? null : sKeyValue.toString());
		};

		FilterUtil.isPropertyHidden = function (entityProperty) {
			var bIsHidden = false;
			if (entityProperty) {
				var oHidden = entityProperty["com.sap.vocabularies.UI.v1.Hidden"];
				bIsHidden = oHidden ? oHidden.Bool === "true" : false;
			}
			return bIsHidden;
		};

		FilterUtil.resolveSelectOptionValue = function(oDummyContext, oRangeValue) {
			//If Low value or High Value for SelectOption Ranges is not defined, then return null
			//Else return the resolved value
			if (oRangeValue === undefined || oRangeValue === null) {
				return null;
			} else {
				return (ODataAnnotationHelper.format(oDummyContext, oRangeValue));
			}
		};

		FilterUtil.isInteger = function (propType) {
			return propType.toUpperCase().indexOf("EDM.INT") != -1 ? true : false;
		};
		FilterUtil.onKeyUpVisualFilter = function (oEvent) {
			if (oEvent.keyCode === KeyCodes.F4) {
				//get the Visual filter on which the action is performed
				//get the control which is focused
				var oFocusedControl = sap.ui.getCore().byId(oEvent.target.id),
				oButton, sRequiredButtonId;
				if (oFocusedControl) {
					var oControlType = oFocusedControl.getMetadata().getElementName();
					switch (oControlType) {
						case "sap.m.Button" :
							if (this.isF4Enabled) {
								oButton = oFocusedControl;
							}
							break;
						case "sap.m.HeaderContainerItemContainer" :
							var oVbox = oFocusedControl.getItem();
							if (oVbox) {
								sRequiredButtonId = oVbox.getId().replace("FilterItemContainer", "ValueHelpButton");
								oButton = this.getF4ButtonId(sRequiredButtonId);
							}
							break;
						case "sap.m.CustomListItem" :
							sRequiredButtonId = oFocusedControl.getId().replace("FilterItemContainer", "ValueHelpButton");
							oButton = this.getF4ButtonId(sRequiredButtonId);
							break;
						default: break;
					}
				} else {//Focussed element is the chart interaction area
					if (oEvent.target.id.length > 0) {
						sRequiredButtonId = oEvent.target.id.replace("FilterItemMicroChart", "ValueHelpButton");//Bar and Donut
					} else {
						sRequiredButtonId = oEvent.target.parentElement.id.replace("FilterItemMicroChart", "ValueHelpButton"); //Lines
					}
					sRequiredButtonId = sRequiredButtonId.slice(0, sRequiredButtonId.indexOf("-innerChart"));
					oButton = this.getF4ButtonId(sRequiredButtonId);
				}
				if (oButton && this.isF4Enabled(oButton)) {
					oButton.firePress();
				}
			}
		};
		FilterUtil.onKeyDownVisualFilter = function (oSmartFilterBar, oEvent) {
			if (oEvent.keyCode === KeyCodes.ENTER) {
				if (oEvent.ctrlKey || oEvent.metaKey) {
					oSmartFilterBar.search();
					oEvent.stopPropagation();
				}
			}
		};
		FilterUtil.getF4ButtonId = function(sId) {
			var oButton = sap.ui.getCore().byId(sId);
			return oButton;
		};
		FilterUtil.isF4Enabled = function(oButton) {
			if (oButton.data("isF4Enabled")) {
				if (oButton.getVisible() && oButton.getEnabled()) {
					return true;
				}
			}
			return false;
		};

	return FilterUtil;
}, true);
