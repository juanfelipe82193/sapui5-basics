/*!
 * @copyright@
 */
sap.ui.define(["sap/base/Log", "sap/fe/macros/CommonHelper", "sap/fe/navigation/SelectionVariant"], function(
	Log,
	CommonHelper,
	SelectionVariant
) {
	"use strict";

	var NavigationHelper = {
		/**
		 * Removes sensitive data from the navigation context
		 * @param {Object} oContext mandatory context
		 * @param {Object} oData optional selection variant or data map
		 * @return {Object} mPureData selection variant or data map
		 **/
		removeSensitiveData: function(oContext, oData) {
			if (!oContext) {
				// context is mandatory
				Log.error("Context is required");
				return;
			}
			var aPropertyNames = [],
				bIsSelectionVariant,
				mPureData,
				oContextData = oContext.getObject(),
				oMetaModel = oContext.getModel().getMetaModel(),
				sEntitySet = CommonHelper.getTargetCollection(oContext),
				fnIsSensitiveData = function(sProp, esName, mData) {
					var aPropertyAnnotations;
					esName = esName || sEntitySet;
					mData = mData || oContextData;
					aPropertyAnnotations = oMetaModel.getObject(esName + "/" + sProp + "@");
					if (aPropertyAnnotations) {
						if (
							aPropertyAnnotations["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] ||
							aPropertyAnnotations["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"] ||
							aPropertyAnnotations["@com.sap.vocabularies.Analytics.v1.Measure"]
						) {
							return true;
						} else if (aPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"]) {
							var oFieldControl = aPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"];
							if (oFieldControl["$EnumMember"] && oFieldControl["$EnumMember"].split("/")[1] === "Inapplicable") {
								return true;
							} else if (oFieldControl["$Path"]) {
								var oFieldControlPath = oFieldControl["$Path"],
									aParts = oFieldControlPath.split("/");
								// sensitive data is removed only if the path has already been resolved.
								if (aParts.length > 1) {
									return mData[aParts[0]] && mData[aParts[0]][aParts[1]] && mData[aParts[0]][aParts[1]] === 0;
								} else {
									return mData[oFieldControlPath] === 0;
								}
							}
						}
					}
					return false;
				};

			if (oData) {
				mPureData = oData;
				if (oData.getMetadata && oData.getMetadata().getName() === "sap.fe.navigation.SelectionVariant") {
					bIsSelectionVariant = true;
					aPropertyNames = oData.getPropertyNames() || [];
				} else if (oData instanceof Object) {
					aPropertyNames = Object.keys(oData) || [];
				} else {
					Log.error("Unsupported format - Sensitive data not removed. Pass a SelectionVariant or data map");
				}
			} else {
				aPropertyNames = Object.keys(oContextData) || [];
				mPureData = JSON.parse(JSON.stringify(oContextData));
			}

			aPropertyNames.forEach(function(sProperty) {
				// properties of the entity set
				if (!(oContextData[sProperty] instanceof Object)) {
					if (fnIsSensitiveData(sProperty)) {
						if (bIsSelectionVariant) {
							mPureData.removeSelectOption(sProperty);
						} else {
							delete mPureData[sProperty];
						}
					}
				} else {
					//handle properties of the navigation entity
					// only one level of navigation property is supported
					var esName = "/" + oMetaModel.getObject(sEntitySet + "/$NavigationPropertyBinding/" + sProperty),
						oNavigationEntityData = bIsSelectionVariant
							? JSON.parse(oData.getSelectOption(sProperty)[0].Low)
							: mPureData[sProperty],
						aProps = Object.keys(oNavigationEntityData),
						bIsSensitiveData = false;
					// remove all sensitive properties from the navigation data
					aProps.forEach(function(sProp) {
						if (fnIsSensitiveData(sProp, esName, oNavigationEntityData)) {
							bIsSensitiveData = true;
							delete oNavigationEntityData[sProp];
						}
					});
					if (bIsSensitiveData) {
						if (bIsSelectionVariant) {
							// remove the current low value having the sensitive data
							// then set the value with the non-sensitive data
							// this has to be followed to avoid SelectionVariant.PARAMETER_SELOPT_COLLISION error
							mPureData.removeSelectOption(sProperty);
							mPureData.addSelectOption(sProperty, "I", "EQ", JSON.stringify(oNavigationEntityData));
						} else {
							// reset data of navigation property with the non-sensitive data
							mPureData[sProperty] = oNavigationEntityData;
						}
					}
				}
			});
			return mPureData;
		},
		/**
		 * Combines the given parameters and selection variant into a new selection variant containing properties from both, with the parameters
		 * overriding existing properties in the selection variant. The new selection variant does not contain any parameters. All parameters are
		 * merged into select options. The output of this function, converted to a JSON string, can be used for the
		 * {@link #.navigate NavigationHandler.navigate} method.
		 * @param {object} mSemanticAttributes Object containing key/value pairs
		 * @param {string} sSelectionVariant The selection variant in string format as provided by the SmartFilterBar control
		 * @param {int} [iSuppressionBehavior=sap.ui.generic.app.navigation.service.SuppressionBehavior.standard] Indicates whether semantic
		 *        attributes with special values (see {@link sap.ui.generic.app.navigation.service.SuppressionBehavior suppression behavior}) must be
		 *        suppressed before they are combined with the selection variant; several
		 *        {@link sap.ui.generic.app.navigation.service.SuppressionBehavior suppression behaviors} can be combined with the bitwise OR operator
		 *        (|)
		 * @returns {object} Instance of {@link sap.ui.generic.app.navigation.service.SelectionVariant}
		 * @public
		 * @example <code>
		 * var mSemanticAttributes = { "Customer" : "C0001" };
		 * var sSelectionVariant = oSmartFilterBar.getDataSuiteFormat();
		 * var oNavigationHandler = new sap.ui.generic.app.navigation.service.NavigationHandler(oController);
		 * var sNavigationSelectionVariant = oNavigationHandler.mixAttributesAndSelectionVariant(mSemanticAttributes, sSelectionVariant).toJSONString();
		 * // Optionally, you can specify one or several suppression behaviors. Several suppression behaviors are combined with the bitwise OR operator, e.g.
		 * // var iSuppressionBehavior = sap.ui.generic.app.navigation.service.SuppressionBehavior.raiseErrorOnNull | sap.ui.generic.app.navigation.service.SuppressionBehavior.raiseErrorOnUndefined;
		 * // var sNavigationSelectionVariant = oNavigationHandler.mixAttributesAndSelectionVariant(mSemanticAttributes, sSelectionVariant, iSuppressionBehavior).toJSONString();
		 *
		 * oNavigationHandler.navigate("SalesOrder", "create", sNavigationSelectionVariant);
		 * </code>
		 */
		mixAttributesAndSelectionVariant: function(mSemanticAttributes, sSelectionVariant) {
			var oSelectionVariant = new SelectionVariant(sSelectionVariant);
			var oNewSelVariant = new SelectionVariant();

			if (oSelectionVariant.getFilterContextUrl()) {
				oNewSelVariant.setFilterContextUrl(oSelectionVariant.getFilterContextUrl());
			}
			if (oSelectionVariant.getParameterContextUrl()) {
				oNewSelVariant.setParameterContextUrl(oSelectionVariant.getParameterContextUrl());
			}

			// add all semantic attributes to the mixed selection variant
			for (var sPropertyName in mSemanticAttributes) {
				if (mSemanticAttributes.hasOwnProperty(sPropertyName)) {
					// A value of a semantic attribute may not be a string, but can be e.g. a date.
					// Since the selection variant accepts only a string, we have to convert it in dependence of the type.
					var vSemanticAttributeValue = mSemanticAttributes[sPropertyName];

					if (jQuery.type(vSemanticAttributeValue) === "array" || jQuery.type(vSemanticAttributeValue) === "object") {
						vSemanticAttributeValue = JSON.stringify(vSemanticAttributeValue);
					} else if (jQuery.type(vSemanticAttributeValue) === "date") {
						// use the same conversion method for dates as the SmartFilterBar: toJSON()
						vSemanticAttributeValue = vSemanticAttributeValue.toJSON();
					} else if (jQuery.type(vSemanticAttributeValue) === "number" || jQuery.type(vSemanticAttributeValue) === "boolean") {
						vSemanticAttributeValue = vSemanticAttributeValue.toString();
					}

					if (vSemanticAttributeValue === "") {
						Log.info("Semantic attribute " + sPropertyName + " is an empty string and is being ignored.");
						continue;
					}

					if (vSemanticAttributeValue === null) {
						Log.warning("Semantic attribute " + sPropertyName + " is null and ignored for mix in to selection variant");
						continue; // ignore!
					}

					if (vSemanticAttributeValue === undefined) {
						Log.warning("Semantic attribute " + sPropertyName + " is undefined and ignored for mix in to selection variant");
						continue;
					}

					if (jQuery.type(vSemanticAttributeValue) === "string") {
						oNewSelVariant.addSelectOption(sPropertyName, "I", "EQ", vSemanticAttributeValue);
					} else {
						throw "NavigationHandler.INVALID_INPUT";
					}
				}
			}

			// add parameters that are not part of the oNewSelVariant yet
			var aParameters = oSelectionVariant.getParameterNames();
			for (var i = 0; i < aParameters.length; i++) {
				if (!oNewSelVariant.getSelectOption(aParameters[i])) {
					oNewSelVariant.addSelectOption(aParameters[i], "I", "EQ", oSelectionVariant.getParameter(aParameters[i]));
				}
			}

			// add selOptions that are not part of the oNewSelVariant yet
			var aSelOptionNames = oSelectionVariant.getSelectOptionsPropertyNames();
			for (i = 0; i < aSelOptionNames.length; i++) {
				if (!oNewSelVariant.getSelectOption(aSelOptionNames[i])) {
					var aSelectOption = oSelectionVariant.getSelectOption(aSelOptionNames[i]);
					// add every range in the current select option
					for (var j = 0; j < aSelectOption.length; j++) {
						oNewSelVariant.addSelectOption(
							aSelOptionNames[i],
							aSelectOption[j].Sign,
							aSelectOption[j].Option,
							aSelectOption[j].Low,
							aSelectOption[j].High
						);
					}
				}
			}

			return oNewSelVariant;
		},
		/**
		 * Method to add condtions to SelectionVariant.
		 * @param {object} Instance of {@link sap.ui.generic.app.navigation.service.SelectionVariant} SelectionVariant to be used.
		 * @param {object} Conditons to be added to the SelectionVariant
		 * @returns {object} Instance of {@link sap.ui.generic.app.navigation.service.SelectionVariant} SelectionVariant with the conditions.
		 * @public
		 * @example <code>
		 * </code>
		 **/
		addConditionsToSelectionVariant: function(oSelectionVariant, mConditions) {
			// var oSelectionVariant = new SelectionVariant(sSelectionVariant ? sSelectionVariant : "");
			// To Convert the condition to a selectOption
			var fnCreateSelectOption = function(oCondition) {
				var sLow = oCondition.values[0],
					sHigh = oCondition.values[1],
					oSelectOption = {
						Sign: "I"
					};

				switch (oCondition.operator) {
					case "Contains":
						oSelectOption.Option = "CP";
						oSelectOption.Low = "*" + sLow + "*";
						break;
					case "StartsWith":
						oSelectOption.Option = "CP";
						oSelectOption.Low = sLow + "*";
						break;
					case "EndsWith":
						oSelectOption.Option = "CP";
						oSelectOption.Low = "*" + sLow;
						break;
					case "Empty":
						oSelectOption.Option = "EQ";
						oSelectOption.Low = "";
						break;
					case "EEQ":
					case "EQ":
					case "BT":
					case "LE":
					case "GE":
					case "GT":
					case "LT":
						oSelectOption.Option = oCondition.operator === "EEQ" ? "EQ" : oCondition.operator;
						oSelectOption.Low = sLow;
						break;
					default:
						Log.error("Opertation is not supported '" + oCondition.operator + "'");
						return;
				}
				if (oCondition.operator === "BT") {
					oSelectOption.High = sHigh;
				}

				return oSelectOption;
			};

			// Loop through all properties with conditions
			for (var sPropertyName in mConditions) {
				if (mConditions.hasOwnProperty(sPropertyName) && mConditions[sPropertyName].length) {
					// Create selectOptions for the array of condiitons of the property.
					var aSelectOptions = mConditions[sPropertyName].map(fnCreateSelectOption);
					oSelectionVariant.massAddSelectOption(sPropertyName, aSelectOptions);
				}
			}

			return oSelectionVariant;
		}
	};

	return NavigationHelper;
});
