/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/base/Log",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/ui/base/ManagedObject",
		"sap/base/util/JSTokenizer",
		"sap/base/util/merge",
		"sap/base/strings/formatMessage"
	],
	function(Log, ODataModelAnnotationHelper, ManagedObject, JSTokenizer, merge, formatMessage) {
		"use strict";

		/*
	 This class contains annotation helpers that might be used from several templates or controls
	 */

		var AnnotationHelper = {
			buildExpressionForProgressIndicatorPercentValue: function(oInterface, dataPoint, mUoM) {
				var sPercentValueExpression = "0";
				var sExpressionTemplate;
				var oModel = oInterface.getModel(1);
				var sPath = oInterface.getPath(1);
				var oBindingContext = oModel.createBindingContext(sPath);

				if (dataPoint.Value && dataPoint.Value.$Path) {
					// Value is mandatory and it must be a path
					var valuePath = sap.ui.model.odata.v4.AnnotationHelper.value(dataPoint.Value, { context: oBindingContext });
					var sValue = "$" + valuePath; // Value is expected to be always a path. ${Property}
					var sTarget;
					if (dataPoint.TargetValue) {
						// Target can be a path or Edm Primitive Type
						sTarget = sap.ui.model.odata.v4.AnnotationHelper.value(dataPoint.TargetValue, { context: oBindingContext });
						if (dataPoint.TargetValue.$Path) {
							sTarget = "$" + sTarget;
						}
					}
					// The expression consists of the following parts:
					// 1) When UoM is '%' then percent = value (target is ignored), and check for boundaries (value > 100 and value < 0).
					// 2) When UoM is not '%' (or is not provided) then percent = value / target * 100, check for division by zero and boundaries:
					// percent > 100 (value > target) and percent < 0 (value < 0)
					// Where 0 is Value, 1 is Target, 2 is UoM
					var sExpressionForUoMPercent = "(({0} > 100) ? 100 : (({0} < 0) ? 0 : ({0} * 1)))";
					var sExpressionForUoMNotPercent = "(({1} > 0) ? (({0} > {1}) ? 100 : (({0} < 0) ? 0 : ({0} / {1} * 100))) : 0)";
					if (mUoM) {
						mUoM = "'" + mUoM + "'";
						sExpressionTemplate =
							"'{'= ({2} === ''%'') ? " + sExpressionForUoMPercent + " : " + sExpressionForUoMNotPercent + " '}'";
						sPercentValueExpression = formatMessage(sExpressionTemplate, [sValue, sTarget, mUoM]);
					} else {
						sExpressionTemplate = "'{'= " + sExpressionForUoMNotPercent + " '}'";
						sPercentValueExpression = formatMessage(sExpressionTemplate, [sValue, sTarget]);
					}
				}
				return sPercentValueExpression;
			},

			buildExpressionForProgressIndicatorDisplayValue: function(oInterface, dataPoint, mUoM) {
				var oModel = oInterface.getModel(1);
				var sPath = oInterface.getPath(1);
				var oBindingContext = oModel.createBindingContext(sPath);
				var aParts = [];
				aParts.push(sap.ui.model.odata.v4.AnnotationHelper.value(dataPoint.Value, { context: oBindingContext }));
				aParts.push(sap.ui.model.odata.v4.AnnotationHelper.value(dataPoint.TargetValue, { context: oBindingContext }));
				aParts.push(mUoM);
				var sDisplayValue = AnnotationHelper.formatDisplayValue(aParts);
				return sDisplayValue;
			},

			/**
			 * This function is meant to run at runtime, so the control and resource bundle can be available
			 * @function
			 * @private
			 * @parameter {string} sValue A string containing the value
			 * @parameter {string} sTarget A string containing the target value
			 * @parameter {string} sUoM A string containing the unit of measure
			 * @returns {string} A string containing the text that will be used in the display value of the Progress Indicator
			 */
			formatDisplayValue: function(aParts) {
				var sDisplayValue = "",
					sValue = aParts[0],
					sTarget = aParts[1],
					sUoM = aParts[2];

				if (sValue) {
					return sap.ui
						.getCore()
						.getLibraryResourceBundle("sap.fe.templates", true)
						.then(function(oResourceBundle) {
							if (sUoM) {
								if (sUoM === "%") {
									// uom.String && uom.String === '%'
									sDisplayValue = oResourceBundle.getText("PROGRESS_INDICATOR_DISPLAY_VALUE_UOM_IS_PERCENT", [sValue]);
								} else {
									// (uom.String and not '%') or uom.Path
									if (sTarget) {
										sDisplayValue = oResourceBundle.getText("PROGRESS_INDICATOR_DISPLAY_VALUE_UOM_IS_NOT_PERCENT", [
											sValue,
											sTarget,
											sUoM
										]);
									} else {
										sDisplayValue = oResourceBundle.getText(
											"PROGRESS_INDICATOR_DISPLAY_VALUE_UOM_IS_NOT_PERCENT_NO_TARGET_VALUE",
											[sValue, sUoM]
										);
									}
								}
							} else {
								if (sTarget) {
									sDisplayValue = oResourceBundle.getText("PROGRESS_INDICATOR_DISPLAY_VALUE_NO_UOM", [sValue, sTarget]);
								} else {
									sDisplayValue = sValue;
								}
							}
							return sDisplayValue;
						});
				} else {
					// Cannot do anything
					Log.warning("Value property is mandatory, the default (empty string) will be returned");
				}
			},

			buildExpressionForCriticality: function(dataPoint) {
				var sFormatCriticalityExpression = sap.ui.core.ValueState.None;
				var sExpressionTemplate;
				var oCriticalityProperty = dataPoint.Criticality;

				if (oCriticalityProperty) {
					sExpressionTemplate =
						"'{'= ({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Negative'') || ({0} === ''1'') || ({0} === 1) ? ''" +
						sap.ui.core.ValueState.Error +
						"'' : " +
						"({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Critical'') || ({0} === ''2'') || ({0} === 2) ? ''" +
						sap.ui.core.ValueState.Warning +
						"'' : " +
						"({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Positive'') || ({0} === ''3'') || ({0} === 3) ? ''" +
						sap.ui.core.ValueState.Success +
						"'' : " +
						"''" +
						sap.ui.core.ValueState.None +
						"'' '}'";
					if (oCriticalityProperty.$Path) {
						var sCriticalitySimplePath = "${" + oCriticalityProperty.$Path + "}";
						sFormatCriticalityExpression = formatMessage(sExpressionTemplate, sCriticalitySimplePath);
					} else if (oCriticalityProperty.$EnumMember) {
						var sCriticality = "'" + oCriticalityProperty.$EnumMember + "'";
						sFormatCriticalityExpression = formatMessage(sExpressionTemplate, sCriticality);
					} else {
						Log.warning("Case not supported, returning the default sap.ui.core.ValueState.None");
					}
				} else {
					// Any other cases are not valid, the default value of 'None' will be returned
					Log.warning("Case not supported, returning the default sap.ui.core.ValueState.None");
				}

				return sFormatCriticalityExpression;
			},
			buildRatingIndicatorSubtitleExpression: function(oContext, mSampleSize) {
				if (mSampleSize) {
					return sap.fe.templates.ObjectPage.AnnotationHelper.formatRatingIndicatorSubTitle(
						sap.ui.model.odata.v4.AnnotationHelper.value(mSampleSize, { context: oContext })
					);
				}
			},
			// returns the text for the Rating Indicator Subtitle (e.g. '7 reviews')
			formatRatingIndicatorSubTitle: function(iSampleSizeValue) {
				if (iSampleSizeValue) {
					return sap.ui
						.getCore()
						.getLibraryResourceBundle("sap.fe.templates", true)
						.then(function(oResourceBundle) {
							var sSubTitleLabel =
								iSampleSizeValue > 1
									? oResourceBundle.getText("RATING_INDICATOR_SUBTITLE_LABEL_PLURAL")
									: oResourceBundle.getText("RATING_INDICATOR_SUBTITLE_LABEL");
							return oResourceBundle.getText("RATING_INDICATOR_SUBTITLE", [iSampleSizeValue, sSubTitleLabel]);
						});
				}
			},

			getBindingPathForForm: function(sPath) {
				var sNavigationPath = sap.ui.model.odata.v4.AnnotationHelper.getNavigationPath(sPath);
				return "{path:'" + sNavigationPath + "'}";
			},

			getElementBinding: function(sPath) {
				var sNavigationPath = sap.ui.model.odata.v4.AnnotationHelper.getNavigationPath(sPath);
				if (sNavigationPath) {
					return "{path:'" + sNavigationPath + "'}";
				} else {
					//no navigation property needs empty object
					return "{path: ''}";
				}
			},
			/**
			 * Function to get the visibility for the Edit/Delete button in the object page/sub-object page.
			 * @param {Object} [oRawValue] The value from the expression.
			 * @param {Number} [viewLevel] view level to differenciate between object page and sub-object page[Only passed in case of Delete]
			 * @param {Object} [oDeleteHidden] The value from the expression.
			 * @returns {String} Returns expression binding or boolean value based on vRawValue, viewLevel
			 */
			getDeleteButtonVisibility: function(oRawValue, viewLevel, oDeleteHidden) {
				if (viewLevel > 1) {
					if (oDeleteHidden) {
						return "{= !$" + oDeleteHidden + " && (${ui>/editable} === 'Editable')}";
					}
					if (oRawValue) {
						return "{= $" + oRawValue + " && (${ui>/editable} === 'Editable')}";
					} else {
						return "{= (${ui>/editable} === 'Editable')}";
					}
				} else if (oDeleteHidden) {
					return "{= !$" + oDeleteHidden + " && !(${ui>/editable} === 'Editable')}";
				} else if (oRawValue) {
					return "{= $" + oRawValue + " && !(${ui>/editable} === 'Editable')}";
				} else {
					return "{= !(${ui>/editable} === 'Editable')}";
				}
			},

			/**
			 * Function to get the EditAction from the Entityset based on Draft or sticky based application.
			 * @param {Object} [oEntitySet] The value from the expression.
			 * @returns {String} Returns expression binding or boolean value based on vRawValue & oDraftNode
			 */
			getEditAction: function(oEntitySet) {
				var sPath = oEntitySet.getPath(),
					oAnnotations = oEntitySet.getObject(sPath + "@");
				var bDraftRoot = oAnnotations.hasOwnProperty("@com.sap.vocabularies.Common.v1.DraftRoot");
				var bStickySession = oAnnotations.hasOwnProperty("@com.sap.vocabularies.Session.v1.StickySessionSupported");
				var sActionName;
				if (bDraftRoot) {
					sActionName = oEntitySet.getObject(sPath + "@com.sap.vocabularies.Common.v1.DraftRoot/EditAction");
				} else if (bStickySession) {
					sActionName = oEntitySet.getObject(sPath + "@com.sap.vocabularies.Session.v1.StickySessionSupported/EditAction");
				}
				return !sActionName ? sActionName : sPath + "/" + sActionName;
			},

			getLinkEntityType: function(oContext) {
				// TODO : The oContext is the context points to the metaContext stored in viewData model. This is done to extract the metaContext created for the links.
				//        Don't know if this is the right approach. Probably, need to find a better way to do this.
				return oContext.getObject();
			},

			/**
			 * Function to get the expression binding for text of the breadcrumb link
			 * @param: oInteface : Interface to get model and path.
			 * @param: oTitle :  Annotation at {EntityType}/$Type@com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value.
			 * @param: sTypeName : Annotation at {EntityType}/$Type@com.sap.vocabularies.UI.v1.HeaderInfo/TypeName.
			 * @returns: Expression binding for the text of breadcrumb link
			 */
			formatTextForBreadcrumbs: function(oInterface, oTitle, sTypeName) {
				var oModel = oInterface.getInterface(1).getModel();
				var sPath = oInterface.getInterface(1).getPath();
				var oBindingContext = oModel.createBindingContext(sPath);
				var sBindingTitle = sap.ui.model.odata.v4.AnnotationHelper.value(oTitle, { context: oBindingContext });

				if (oTitle && sTypeName && sBindingTitle.indexOf("{") === -1) {
					var sBinding,
						sTypeNameEscaped = sTypeName.replace(/'/g, "\\'");
					sBinding = "{= $" + sBindingTitle + " ? $" + sBindingTitle + " : '" + sTypeNameEscaped + "' }";
					return sBinding;
				} else {
					// in case of a complex binding of the title we do not introduce our default text fallback
					if (!sBindingTitle) {
						// string "[[no title]]" should never been shown in UI therefore no transaltion needed
						return sTypeName || "[[no title]]";
					}
					return sBindingTitle;
				}
			},
			isDeepFacetHierarchy: function(oFacet) {
				if (oFacet.Facets) {
					for (var i = 0; i < oFacet.Facets.length; i++) {
						if (oFacet.Facets[i].$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
							return true;
						}
					}
				}
				return false;
			},
			getDataFieldCollection: function(oTarget) {
				var sPath = oTarget.getPath();
				var sTarget = oTarget.getObject(sPath),
					sNavigationPath = ODataModelAnnotationHelper.getNavigationPath(sPath);
				return sNavigationPath + "/" + sTarget + (sTarget.indexOf("com.sap.vocabularies.UI.v1.FieldGroup") > -1 ? "/Data" : "");
			},
			isReadOnlyFromStaticAnnotations: function(oAnnotations, oFieldControl) {
				var bComputed, bImmutable, bReadOnly;
				if (oAnnotations["@Org.OData.Core.V1.Computed"]) {
					bComputed = oAnnotations["@Org.OData.Core.V1.Computed"].Bool
						? oAnnotations["@Org.OData.Core.V1.Computed"].Bool == "true"
						: true;
				}
				if (oAnnotations["@Org.OData.Core.V1.Immutable"]) {
					bImmutable = oAnnotations["@Org.OData.Core.V1.Immutable"].Bool
						? oAnnotations["@Org.OData.Core.V1.Immutable"].Bool == "true"
						: true;
				}
				bReadOnly = bComputed || bImmutable;

				if (oFieldControl) {
					bReadOnly = bReadOnly || oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly";
				}
				if (bReadOnly) {
					return false;
				} else {
					return true;
				}
			},
			buildExpressionForTitle: function(oHeaderInfo) {
				var sTitleBinding = "";
				if (oHeaderInfo && oHeaderInfo.Title){
					sTitleBinding = "{= ${ui>/createMode} ";
					var sHeaderInfoTitleValue;
					if (typeof oHeaderInfo.Title.Value === "object") {
						sHeaderInfoTitleValue = "${" + oHeaderInfo.Title.Value.$Path + "}";
					} else {
						// Primitive
						sHeaderInfoTitleValue = "'" + oHeaderInfo.Title.Value + "'";
					}
					if (oHeaderInfo.TypeName){
						sTitleBinding = sTitleBinding + "&& (" + sHeaderInfoTitleValue + " === '' || " + sHeaderInfoTitleValue + " === undefined || " + sHeaderInfoTitleValue + " === null)";
						sTitleBinding = sTitleBinding + " ? ${sap.fe.i18n>DEFAULT_OBJECT_PAGE_HEADER_TITLE} + '  ' + '" + oHeaderInfo.TypeName + "' : "   + sHeaderInfoTitleValue  + "}";
					} else {
						sTitleBinding = sTitleBinding + " ? ${sap.fe.i18n>DEFAULT_OBJECT_PAGE_HEADER_TITLE_NO_HEADER_INFO} : " +  sHeaderInfoTitleValue + "}";
					}
				}
				return sTitleBinding;
			},
			isReadOnlyFromDynamicAnnotations: function(oFieldControl) {
				var sIsFieldControlPathReadOnly;
				if (oFieldControl) {
					if (ManagedObject.bindingParser(oFieldControl)) {
						sIsFieldControlPathReadOnly = "$" + oFieldControl + " === '1'";
					}
				}
				if (sIsFieldControlPathReadOnly) {
					return "{= " + sIsFieldControlPathReadOnly + "? false : true }";
				} else {
					return true;
				}
			},
			hasDeterminingActions: function(oEntityType) {
				var oIdentification = oEntityType["@com.sap.vocabularies.UI.v1.Identification"];
				for (var i in oIdentification) {
					if (
						oIdentification[i].$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
						oIdentification[i].Determining === true
					) {
						return true;
					}
				}
				return false;
			},
			doesFacetOnlyContainForms: function(aFacets) {
				if (aFacets) {
					var fnCheckCollectionFacet = function(oFacet) {
						return (
							oFacet.Target &&
							oFacet.Target.$AnnotationPath &&
							oFacet.Target.$AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.FieldGroup") < 0 &&
							oFacet.Target.$AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.Identification") < 0 &&
							oFacet.Target.$AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.DataPoint") < 0 &&
							oFacet.Target.$AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.StatusInfo") < 0
						);
					};
					return !aFacets.some(fnCheckCollectionFacet);
				}
				return false;
			},
			getBindingWithoutMeasure: function(sBinding) {
				var oBinding = JSTokenizer.parseJS(sBinding, 0).result,
					oFormatOptions = {
						showMeasure: false
					};
				oBinding = merge(oBinding, {
					formatOptions: oFormatOptions
				});
				return JSON.stringify(oBinding);
			}
		};
		AnnotationHelper.buildExpressionForProgressIndicatorPercentValue.requiresIContext = true;
		AnnotationHelper.formatTextForBreadcrumbs.requiresIContext = true;
		AnnotationHelper.buildExpressionForProgressIndicatorDisplayValue.requiresIContext = true;
		AnnotationHelper.buildRatingIndicatorSubtitleExpression.requiresIContext = true;
		return AnnotationHelper;
	},
	true
);
