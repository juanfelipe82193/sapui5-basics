/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the filterbar and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define([
	"sap/ui/mdc/FilterBarDelegate",  "sap/ui/mdc/library", 'sap/base/util/merge', 'sap/ui/mdc/FilterField', 'sap/ui/mdc/field/FieldBaseDelegate', 'sap/ui/mdc/condition/FilterOperatorUtil', 'sap/ui/mdc/condition/Operator', "sap/ui/model/FilterOperator", "sap/ui/model/Filter", 'sap/ui/mdc/util/IdentifierUtil'
	], function (FilterBarDelegate, mdcLib, merge, FilterField, FieldBaseDelegate, FilterOperatorUtil, Operator, ModelOperator, Filter, IdentifierUtil) {
	"use strict";

	/**
	 * Helper class for sap.ui.mdc.FilterBar.
	 * <h3><b>Note:</b></h3>
	 * The class is experimental and the API/behaviour is not finalized and hence this should not be used for productive usage.
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.60
	 * @alias sap.ui.mdc.odata.v4.FilterBarDelegate
	 */
	var ODataFilterBarDelegate = Object.assign({}, FilterBarDelegate);

	// TO DO
	var mDefaultTypeForEdmType = {
		"Edm.Boolean": "Bool",
		"Edm.Byte": "Int",
		"Edm.DateTime": "Date",
		"Edm.DateTimeOffset": "DateTimeOffset",
		"Edm.Decimal": "Decimal",
		"Edm.Double": "Float",
		"Edm.Float": "Float",
		"Edm.Guid": "Guid",
		"Edm.Int16": "Int",
		"Edm.Int32": "Int",
		"Edm.Int64": "Int",
		"Edm.SByte": "Int",
		"Edm.Single": "Float",
		"Edm.String": "String",
		"Edm.Time": "TimeOfDay"
	};

	var aVisitedEntityTypes = [];



	ODataFilterBarDelegate._fetchPropertiesByMetadata = function(oFilterBar, mPropertyBag) {

		var oDelegate, sModelName, sCollectionName, oModel;

		if (mPropertyBag) {
			var oModifier = mPropertyBag.modifier;

			oDelegate = oModifier.getProperty(oFilterBar, "delegate");

			sModelName =  oDelegate.payload.modelName === null ? undefined : oDelegate.payload.modelName;
			sCollectionName = oDelegate.payload.collectionName;
			oModel = mPropertyBag.appComponent.getModel(sModelName);

		} else {

			oDelegate = oFilterBar.getProperty("delegate");

			sModelName =  oDelegate.payload.modelName === null ? undefined : oDelegate.payload.modelName;
			sCollectionName = oDelegate.payload.collectionName;
			oModel = oFilterBar.getModel(sModelName);
		}

		var oObj = {
				getDelegate: function() {
					return {
						payload : {
							modelName : sModelName,
							collectionName: sCollectionName
						}
					};
				},

				getModel : function (s) {
					return oModel;
				}
		};

		return this.fetchProperties(oObj);
	};


	ODataFilterBarDelegate._isMultiValue = function(sFilterExpression) {
		var bIsMultiValue = true;

		//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression

		switch (sFilterExpression) {
			case "SearchExpression":
			case "SingleRange":
			case "SingleValue": bIsMultiValue = false; break;
			default: break;
		}

		return bIsMultiValue;
	};

	ODataFilterBarDelegate._ensureSingleRangeEQOperators = function() {
		var oOperator;
		if (!FilterOperatorUtil.getOperator("SINGLE_RANGE_EQ")) {
			oOperator = merge({}, FilterOperatorUtil.getOperator("EQ"));
			oOperator.name = "SINGLE_RANGE_EQ";
			oOperator.getModelFilter = function(oCondition, sFieldPath) {
				return new Filter({ filters: [new Filter(sFieldPath, ModelOperator.GE, oCondition.values[0]),
											  new Filter(sFieldPath, ModelOperator.LE, oCondition.values[0])],
										and: true});
			};

			FilterOperatorUtil.addOperator(oOperator);
		}

		if (!FilterOperatorUtil.getOperator("SINGLE_RANGE_EEQ")) {
			oOperator = merge({}, FilterOperatorUtil.getOperator("EEQ"));
			oOperator.name = "SINGLE_RANGE_EEQ";
			oOperator.getModelFilter = function(oCondition, sFieldPath) {
				return new Filter({ filters: [new Filter(sFieldPath, ModelOperator.GE, oCondition.values[0]),
											  new Filter(sFieldPath, ModelOperator.LE, oCondition.values[0])],
										and: true});
			};

			FilterOperatorUtil.addOperator(oOperator);
		}
	};

	ODataFilterBarDelegate._ensureMultiRangeBTEXOperator = function() {
		if (!FilterOperatorUtil.getOperator("MULTI_RANGE_BTEX")) {
			var oOperator = merge({}, FilterOperatorUtil.getOperator("BT"));
			oOperator.name = "MULTI_RANGE_BTEX";
			oOperator.getModelFilter = function(oCondition, sFieldPath) {
				return new Filter({ filters:[new Filter(sFieldPath, ModelOperator.GT, oCondition.values[0]),
											 new Filter(sFieldPath, ModelOperator.LT, oCondition.values[1])],
										and: true});
			};

			FilterOperatorUtil.addOperator(oOperator);
		}
	};

	ODataFilterBarDelegate._getFilterOperators = function(sFilterExpression) {
		var sOperators = null, aOperators = null;

		switch (sFilterExpression) {
			case "SingleValue":
			case "MultiValue": sOperators = "EQ,EEQ"; break;

			case "SingleRange": sOperators = "SINGLE_RANGE_EQ,SINGLE_RANGE_EEQ,LE,GE"; this._ensureSingleRangeEQOperators(); break;
			case "MultiRange":  sOperators = "EQ,LE,LT,GE,GT,BT,MULTI_RANGE_BTEX"; this._ensureMultiRangeBTEXOperator(); break;

			case "SearchExpression":             sOperators = "StartsWith,EndsWith,Contains"; break;
		    case "MultiRangeOrSearchExpression": sOperators = "StartsWith,EndsWith,Contains,EQ,EEQ,LE,LT,GE,GT,BT,MULTI_RANGE_BTEX"; this._ensureMultiRangeBTEXOperator(); break;
			default: break;
		}

		if (sOperators) {
			aOperators = sOperators.split(',');
		}

		return aOperators;
	};

	ODataFilterBarDelegate._createFilterField = function(oProperty, oFilterBar, mPropertyBag) {
		var oModifier = mPropertyBag.modifier;
		var sName = oProperty.path || oProperty.name;
		var oSelector = {};

		if (oFilterBar.getId) {
			oSelector.id = oFilterBar.getId();
		} else {
			oSelector.id = oFilterBar.id;
		}
		var sSelectorId = oModifier.getControlIdBySelector(oSelector, mPropertyBag.appComponent);
		var sId = sSelectorId +  "--filter--" + IdentifierUtil.replace(sName);

		return oModifier.createControl("sap.ui.mdc.FilterField", mPropertyBag.appComponent, mPropertyBag.view, sId, {
			dataType: oProperty.type,
			conditions: "{$filters>/conditions/" + sName + '}',
			required: oProperty.required,
			label: oProperty.label,
			maxConditions: oProperty.maxConditions
		}, true).then(function(oFilterField) {

			if (oProperty.fieldHelp) {
				var sFieldHelp = oProperty.fieldHelp;
				if (mPropertyBag.view.getId) {
					sFieldHelp = mPropertyBag.view.getId() + "--" + oProperty.fieldHelp;
				}
				//oModifier.setProperty(oFilterField, "fieldHelp", sFieldHelp);
				oModifier.setAssociation(oFilterField, "fieldHelp", sFieldHelp);
			}

			if (oProperty.filterOperators) {
				oModifier.setProperty(oFilterField, "operators", oProperty.filterOperators);
			}

			if (oProperty.tooltip) {
				oModifier.setProperty(oFilterField, "tooltip", oProperty.tooltip);
			}

			var oConstraints = oProperty.constraints;
			if (oConstraints) {
				oModifier.setProperty(oFilterField, "dataTypeConstraints", oConstraints);
			}
			var oFormatOptions = oProperty.formatOptions;
			if (oFormatOptions) {
				oModifier.setProperty(oFilterField, "dataTypeFormatOptions", oFormatOptions);
			}

			return oFilterField;
		});
	};

	ODataFilterBarDelegate._createFilter = function(sPropertyName, oFilterBar, mPropertyBag) {
		return this._fetchPropertiesByMetadata(oFilterBar, mPropertyBag).then(function(aProperties) {
			var oPropertyInfo = aProperties.find(function(oCurrentProperty) {
				return ((oCurrentProperty.path === sPropertyName) || (oCurrentProperty.name === sPropertyName));
			});
			if (!oPropertyInfo) {
				return null;
			}
			return Promise.resolve(this._createFilterField(oPropertyInfo, oFilterBar, mPropertyBag));
		}.bind(this));
	};

	ODataFilterBarDelegate.beforeAddFilterFlex = function(sPropertyName, oFilterBar, mPropertyBag) {
		return Promise.resolve(this._createFilter(sPropertyName, oFilterBar, mPropertyBag));
	};

	/**
	 * Can be used to trigger any necessary follow-up steps on removal of filter items. The returned boolean value inside the Promise can be used to
	 * prevent default follow-up behaviour of Flex.
	 *
	 * @param {sap.ui.mdc.FilterField} oFilterField The mdc.FilterField that was removed
	 * @param {sap.ui.mdc.FilterBar} oFilterBar - the instance of filter bar
	 * @param {Object} mPropertyBag Instance of property bag from Flex change API
	 * @returns {Promise} Promise that resolves with true/false to allow/prevent default behavour of the change
	 */
	ODataFilterBarDelegate.afterRemoveFilterFlex =  function(oFilterField, oFilterBar, mPropertyBag) {
		// return true within the Promise for default behaviour
		return Promise.resolve(true);
	};

	ODataFilterBarDelegate._getFieldGroupsByFilterFacetsAnnotation = function (oMetaModel, sEntitySet) {

	};

	ODataFilterBarDelegate._fetchProperties = function (oMetaModel, sEntitySet, aProperties, sNavigationPropertyName) {
		var oObj, oAnnotation, oEntitySet, oEntityType, sEntitySetPath;
		var aNonFilterableProps = [], aRequiredProps = [], aSelectionFields = [], mAllowedExpressions = {}, mNavigationProperties = {};
		var sGroup, sGroupLabel, sEntityName;

		sEntitySetPath = '/' + sEntitySet;

		sEntityName = oMetaModel.getObject(sEntitySetPath + "/@sapui.name");

		oEntitySet = oMetaModel.getObject(sEntitySetPath);
		if (oEntitySet && oEntitySet.$NavigationPropertyBinding) {
			mNavigationProperties = oEntitySet.$NavigationPropertyBinding;
		}

		sGroup = sEntityName;
		sGroupLabel = oMetaModel.getObject(sEntitySetPath + '/' + "@com.sap.vocabularies.Common.v1.Label");
		if (!sGroupLabel ) { ///}&& sNavigationPropertyName) {
			sGroupLabel = sGroup;
		}

		oAnnotation = oMetaModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.FilterRestrictions");
		if (oAnnotation) {

			if (oAnnotation.NonFilterableProperties) {
				oAnnotation.NonFilterableProperties.every(function (oProperty) {
					//return property.$NavigationPropertyPath === sContextPath || property.$PropertyPath === sContextPath;
					aNonFilterableProps.push(oProperty.$PropertyPath);
					return true;
				});
			}

			if (oAnnotation.RequiredProperties) {
				oAnnotation.RequiredProperties.every(function (oProperty) {
					//return property.$NavigationPropertyPath === sContextPath || property.$PropertyPath === sContextPath;
					aRequiredProps.push(oProperty.$PropertyPath);
					return true;
				});
			}

			if (oAnnotation.FilterExpressionRestrictions) {
				oAnnotation.FilterExpressionRestrictions.every(function (oProperty) {
					mAllowedExpressions[oProperty.Property.$PropertyPath] = oProperty.AllowedExpressions;

					//https://github.com/oasis-tcs/odata-vocabularies/blob/master/vocabularies/Org.OData.Capabilities.V1.md#FilterExpressionType
					//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
					return true;
				});
			}
		}

		oAnnotation = oMetaModel.getObject(sEntitySetPath + "/" + "@com.sap.vocabularies.UI.v1.SelectionFields");
		if (oAnnotation) {
			oAnnotation.every(function (oProperty) {
				aSelectionFields.push(oProperty.$PropertyPath);
				return true;
			});
		}

		oAnnotation = ODataFilterBarDelegate._getFieldGroupsByFilterFacetsAnnotation(oMetaModel, sEntitySetPath);
		if (oAnnotation) {
			//
		}


		var bHiddenFilter, oFilterDefaultValue, sLabel, sTooltip, sValue, bRequired, bVisibleInFilterBar, oFilterDefaultValueAnnotation, oProperty, oConstraints, bIsDigitalSequence;

		oEntityType = oMetaModel.getObject(sEntitySetPath + "/");
		for (var sKey in oEntityType) {
			oObj = oEntityType[sKey];
			if (oObj) {
				if (oObj.$kind === "Property") {

					if (aNonFilterableProps.indexOf(sKey) >= 0) {
						continue;
					}

					if (oMetaModel.getObject(sEntitySetPath + "/" + sKey + "@com.sap.vocabularies.UI.v1.Hidden")) {
						continue;
					}

					bHiddenFilter = false;
					if (oMetaModel.getObject(sEntitySetPath + "/" + sKey + "@com.sap.vocabularies.UI.v1.HiddenFilter")) {
						bHiddenFilter = true;
					}

					bIsDigitalSequence = false;
					if (oMetaModel.getObject(sEntitySetPath + "/" + sKey + "@com.sap.vocabularies.Common.v1.IsDigitSequence")) {
						bIsDigitalSequence = true;
					}

					oFilterDefaultValue = null;
					oFilterDefaultValueAnnotation = oMetaModel.getObject(sEntitySetPath + "/" + sKey + "@com.sap.vocabularies.Common.v1.FilterDefaultValue");
					if (oFilterDefaultValueAnnotation) {
						sValue = oFilterDefaultValueAnnotation["$" + mDefaultTypeForEdmType[oObj.$Type]];
						switch (oObj.$Type) {
							case "Edm.DateTimeOffset": oFilterDefaultValue = sValue; break;
							default: oFilterDefaultValue = sValue;
						}
					}


					bRequired = (aRequiredProps.indexOf(sKey) >= 0) ? true : false;
					bVisibleInFilterBar = (aSelectionFields.indexOf(sKey) >= 0) ? true : false;

					sLabel = oMetaModel.getObject(sEntitySetPath + "/" + sKey + "@com.sap.vocabularies.Common.v1.Label") || sKey;
					sTooltip = oMetaModel.getObject(sEntitySetPath + "/" + sKey + "@com.sap.vocabularies.Common.v1.QuickInfo") || null;

					if (oObj.$MaxLength || oObj.$Precision || oObj.$Scale || bIsDigitalSequence) {
						oConstraints = {};
						if (oObj.$MaxLength) {
							oConstraints.maxLength = oObj.$MaxLength;
						}
						if (oObj.$Precision) {
							oConstraints.precision = oObj.$Precision;
						}
						if (oObj.$Scale) {
							oConstraints.scale = oObj.$Scale;
						}
						if (bIsDigitalSequence) {
							oConstraints.isDigitSequence = bIsDigitalSequence;
						}
					} else {
						oConstraints = null;
					}


					oProperty = {
							name: sKey,
							group: sGroup,
							label: sLabel,
							tooltip: sTooltip,
							type: FieldBaseDelegate.getDataTypeClass(oObj.$Type),
							required: bRequired,
							hiddenFilter: bHiddenFilter,
							visible: bVisibleInFilterBar
					};
					if (oConstraints) {
						oProperty.constraints = oConstraints;
					}

					if (oFilterDefaultValue) {
						oProperty.defaultFilterConditions = [{ fieldPath: sKey, operator: "EQ", values: [oFilterDefaultValue] }];
					}

					if (mAllowedExpressions[sKey]) {
						var aOperators =  this._getFilterOperators(mAllowedExpressions[sKey]);
						if (aOperators) {
							oProperty.filterOperators = aOperators;
						}
					}

					oProperty.maxConditions = this._isMultiValue(mAllowedExpressions[sKey]) ? -1 : 1;

					if (sNavigationPropertyName) {
						oProperty.path = sNavigationPropertyName + "/" + sKey;
					}

					if (sGroupLabel) {
						oProperty.groupLabel = sGroupLabel || null;
					}

					aProperties.push(oProperty);
				} else if ((oObj.$kind === "NavigationProperty") && (!oObj.$isCollection) && (aVisitedEntityTypes.indexOf(sEntityName) === -1)) {

					aVisitedEntityTypes.push(sEntityName);
					var sNavigationPropertySet = mNavigationProperties[sKey];
					if (sNavigationPropertySet) {
						ODataFilterBarDelegate._fetchProperties(oMetaModel, sNavigationPropertySet, aProperties, sKey);
					}
				}
			}
		}
	};

	/**
	 * Fetches the relevant metadata for a given payload and returns property info array.
	 * @param {object} oFilterBar - the instance of filter bar
	 * @returns {Promise} once resolved an array of property info is returned
	 */
	ODataFilterBarDelegate.fetchProperties = function (oFilterBar) {


		if (this._aProperties) {
			Promise.resolve(this._aProperties);
		}

		var sModelName = oFilterBar.getDelegate().payload.modelName;
		var sEntitySet = oFilterBar.getDelegate().payload.collectionName;

		var oModel = oFilterBar.getModel(sModelName === null ? undefined : sModelName);

		return new Promise(function (resolve, reject) {

				var oMetaModel, aProperties = [];

				if (!oModel || !sEntitySet) {
					reject("model or entity set name not available");
					return;
				}

				oMetaModel = oModel.getMetaModel();
				if (!oMetaModel) {
					reject("metadata model not available");
				} else {
					aVisitedEntityTypes = [];
					this._fetchProperties(oMetaModel, sEntitySet, aProperties);

					this._aProperties = aProperties;
					resolve(aProperties);
				}
		}.bind(this));
	};


	return ODataFilterBarDelegate;
});