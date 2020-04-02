/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	["sap/base/Log", "sap/ui/model/odata/v4/AnnotationHelper", "sap/fe/macros/CommonHelper"],
	function(Log, ODataModelAnnotationHelper, CommonHelper) {
		"use strict";

		var AnnotationHelper = {
			/* this helper can be activated to debug template processing
			 debug: function (oContext) {
			 //debugger;
			 },
			 */

			getP13nMode: function(oViewData, sAnnotationPath) {
				var aPersonalization = [],
					bVariantManagement =
						oViewData.variantManagement &&
						(oViewData.variantManagement === "Page" || oViewData.variantManagement === "Control"),
					personalization = true; // by default enabled

				if (
					oViewData.controlConfiguration &&
					oViewData.controlConfiguration[sAnnotationPath] &&
					oViewData.controlConfiguration[sAnnotationPath]["tableSettings"] &&
					(oViewData.controlConfiguration[sAnnotationPath]["tableSettings"]["personalization"] ||
						oViewData.controlConfiguration[sAnnotationPath]["tableSettings"]["personalization"] === false)
				) {
					// personalization object or a global false is specified in the manifest so use this one
					personalization = oViewData.controlConfiguration[sAnnotationPath]["tableSettings"]["personalization"];
				}

				if (bVariantManagement && personalization) {
					if (personalization === true) {
						// full personalization scope
						return "Sort,Column";
					} else if (typeof personalization === "object") {
						if (personalization.column) {
							aPersonalization.push("Column");
						}
						if (personalization.sort) {
							aPersonalization.push("Sort");
						}
						return aPersonalization.join(",");
					}
				}
				return undefined;
			},

			getSelectionMode: function(oViewData, sAnnotationPath, bInEditModeOnly, bDeletable, oVisualization) {
				// {= CORE.checkForActions(${visualizationPath>}) ? 'Multi' : !(${targetCollection>@Org.OData.Capabilities.V1.DeleteRestrictions/Deletable} === false) ? (${collection>$kind} === 'EntitySet' ? 'Multi' : '{= ${ui>/editable} === \'Editable\' ? \'Multi\' : \'None\'}') : 'None'}
				var sSelectionMode =
					(oViewData.controlConfiguration &&
						oViewData.controlConfiguration[sAnnotationPath] &&
						oViewData.controlConfiguration[sAnnotationPath]["tableSettings"] &&
						oViewData.controlConfiguration[sAnnotationPath]["tableSettings"]["selectionMode"]) ||
					"Multi"; // default is Multi

				if (this.checkForActions(oVisualization)) {
					return sSelectionMode;
				} else if (bDeletable) {
					if (bInEditModeOnly) {
						return "{= ${ui>/editable} === 'Editable' ? '" + sSelectionMode + "' : 'None'}";
					} else {
						return sSelectionMode;
					}
				}

				return "None";
			},

			getPresentationContext: function(oEntitySet) {
				var sPath = oEntitySet.getPath();
				var oPresentationVariant = oEntitySet.getObject(sPath + "/@com.sap.vocabularies.UI.v1.PresentationVariant");
				if (oPresentationVariant && oPresentationVariant.Visualizations) {
					return sPath + "/@com.sap.vocabularies.UI.v1.PresentationVariant";
				} else {
					return sPath + "/@com.sap.vocabularies.UI.v1.LineItem";
				}
			},

			/**
			 * Returns an expression for the Table cheveron press for Navigation
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param {object} oNavigation Object containing Navigation (Display or Detail Structure)
			 * @param {string} sNavigationOrCollectionPath Collection Name or Navigation Path
			 * @param {Object} oDraft Object containing Draft Root or Draft Node for a Draft service and for others will be undefined
			 * @returns {string} expression for Navigation press, undefined otherwise
			 * @private
			 * @sap-restricted
			 **/
			getTableChevronPressExpression: function (oNavigation, sNavigationOrCollectionPath, oDraft) {
				var sNavigationTarget, oNavigationOutBound;	
				if (oNavigation) {
					oNavigationOutBound = oNavigation[sNavigationOrCollectionPath];
					if (oNavigationOutBound && oNavigationOutBound["display"] && oNavigationOutBound["display"]["target"]) {
						sNavigationTarget = oNavigation[sNavigationOrCollectionPath]["display"]["target"];
						return '.handlers.onChevronPressNavigateOutBound( $controller ,\'' + sNavigationTarget + '\', ${$parameters>bindingContext})';
					} else if (oNavigationOutBound && oNavigationOutBound["detail"] && oNavigationOutBound["detail"]["outbound"]) {
						sNavigationTarget = oNavigation[sNavigationOrCollectionPath]["detail"]["outbound"];
						return '.handlers.onChevronPressNavigateOutBound( $controller ,\'' + sNavigationTarget + '\', ${$parameters>bindingContext})';
					} else if (oNavigationOutBound && oNavigationOutBound["detail"] && oNavigationOutBound["detail"]["route"]) {
						return '.routing.navigateForwardToContext(${$parameters>bindingContext}, { targetPath: \'' + sNavigationOrCollectionPath + '\', editable : ' + (oDraft ? '!${$parameters>bindingContext}.getProperty(\'IsActiveEntity\')' : 'undefined') + '})';
					} else {
						return undefined;
					}
				} else {
					return undefined;
				}
			},

			/**
			 * Returns an expression for the Table cheveron Visiblity
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param {object} oNavigation Object containing Navigation (Display or Detail Structure)
			 * @param {string} sNavigationOrCollectionPath Collection Name or Navigation Path
			 * @returns {string} expression for Cheveron Visiblity 
			 * @private
			 * @sap-restricted
			 **/
			getTableRowActionExpression: function (oNavigation, sNavigationOrCollectionPath) {
				if (oNavigation) {
					var oNavigationOutBound = oNavigation[sNavigationOrCollectionPath];
					if ((oNavigationOutBound && oNavigationOutBound["display"] && oNavigationOutBound["display"]['target']) ||
						(oNavigationOutBound && oNavigationOutBound["detail"] && oNavigationOutBound["detail"]['outbound'])) {
						return '{= !${localUI>/sessionOn} ? [\'Navigation\'] : undefined}';
					} else if (oNavigationOutBound && oNavigationOutBound["detail"]["route"]) {
						return 'Navigation';
					}
				} else {
					return undefined;
				}
			},


			getTargetContext: function(oTarget) {
				var sTarget = oTarget.getObject(oTarget.getPath()),
					sNavigationPath = ODataModelAnnotationHelper.getNavigationPath(oTarget.getPath());
				return sNavigationPath + "/" + sTarget;
			},

			getFormContext: function(oTarget) {
				var sAnnotationPath = oTarget.getObject(),
					sNavigationPath = ODataModelAnnotationHelper.getNavigationPath(sAnnotationPath),
					sSourceType,
					sTargetType;
				if (sNavigationPath) {
					sSourceType = ODataModelAnnotationHelper.getNavigationPath(oTarget.getPath());
					sTargetType = oTarget.getModel().getObject(sSourceType + "/" + sNavigationPath + "/@sapui.name");
					return "/" + sTargetType + sAnnotationPath.replace(sNavigationPath, "");
				}
				return oTarget.getPath();
			},

			getNavigationContext: function(oContext) {
				return ODataModelAnnotationHelper.getNavigationPath(oContext.getPath());
			},

			replaceSpecialCharsInId: function(sId) {
				if (sId.indexOf(" ") >= 0) {
					Log.error(
						"Annotation Helper: Spaces are not allowed in ID parts. Please check the annotations, probably something is wrong there."
					);
				}
				return sId
					.replace(/@/g, "")
					.replace(/\//g, "::")
					.replace(/#/g, "::");
			},
			createBindingForDraftAdminBlock: function(oMetaModel, sEntityType, sFormatter) {
				var sPath = "/" + sEntityType + "/DraftAdministrativeData/";
				return oMetaModel.requestObject(sPath).then(function(oDADEntityType) {
					var sBinding = "{parts: [{path: 'InProcessByUser'}, " + "{path: 'LastChangedByUser'} ";
					if (oDADEntityType.InProcessByUserDescription) {
						sBinding += " ,{path: 'InProcessByUserDescription'}";
					}
					if (oDADEntityType.LastChangedByUserDescription) {
						sBinding += ", {path: 'LastChangedByUserDescription'}";
					}
					sBinding += "], formatter: '.editFlow." + sFormatter + "'}";
					return sBinding;
				});
			},
			getBindingForDraftAdminBlockInline: function(iContext, sEntityType) {
				return AnnotationHelper.createBindingForDraftAdminBlock(iContext.getModel(), sEntityType, "formatDraftOwnerTextInline");
			},
			getBindingForDraftAdminBlockInPopover: function(iContext, sEntityType) {
				return AnnotationHelper.createBindingForDraftAdminBlock(iContext.getModel(), sEntityType, "formatDraftOwnerTextInPopover");
			},
			checkForActions: function(aLineItems) {
				var oLineItem;
				for (var i = 0; i < aLineItems.length; i++) {
					oLineItem = aLineItems[i];
					if (
						(oLineItem["$Type"] === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
							(oLineItem["$Type"] === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" &&
								(oLineItem.RequiresContext &&
									(oLineItem.RequiresContext === true || oLineItem.RequiresContext.Bool === "true")))) &&
						!(oLineItem.Inline && oLineItem.Inline.Bool !== "true")
					) {
						return true;
					}
				}
				return false;
			},
			hasDeterminingActions: function(oEntityType) {
				var oDataFields = oEntityType["@com.sap.vocabularies.UI.v1.LineItem"];
				for (var i in oDataFields) {
					if (oDataFields[i].$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && oDataFields[i].Determining === true) {
						return true;
					}
				}
				return false;
			},

			/**
			 * checks if the navigation collection is insertable
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.getNavigationInsertableRestrictions
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param {string} sCurrentCollectionName The name of the navigation collection
			 * @param {array} aRestrictedProperties array of RestrictedProperties of NavigationRestrictions of the root collection
			 * @param {boolean} bInsertable Insertable value of the navigation collection
			 * @returns {string} expression if insertable or insertable path, false otherwise
			 * @private
			 * @sap-restricted
			 **/
			getNavigationInsertableRestrictions: function(sCurrentCollectionName, aRestrictedProperties, bInsertable) {
				// If insertable = true via NavigationRestriction of root collection, navigation collection is insertable
				// If NOT insertable via NavigationRestriction of root collection, navigation collection is NOT insertable
				// If insertable property is undefined for the NavigationRestrictions of the root collection,
				// 	then insertable property of the navigation collection is considered.
				// 	If insertable = true, navigation collection is insertable
				// 	If insertable = false, navigation collection is NOT insertable
				// If Insertable is undefined via navigation restriction of root collection
				// 	and Insertable is undefined at navigation collection,
				// 	then navigation collection is insertable.
				var i, oNavigationProperty;
				for (i in aRestrictedProperties) {
					oNavigationProperty = aRestrictedProperties[i];
					if (
						oNavigationProperty.NavigationProperty.$NavigationPropertyPath === sCurrentCollectionName &&
						oNavigationProperty.InsertRestrictions
					) {
						if (oNavigationProperty.InsertRestrictions.Insertable && oNavigationProperty.InsertRestrictions.Insertable.$Path) {
							return (
								"{= %{" +
								oNavigationProperty.InsertRestrictions.Insertable.$Path +
								"} ? ${ui>/editable} === 'Editable'  : false }"
							);
						}
						return oNavigationProperty.InsertRestrictions.Insertable ? "{= ${ui>/editable} === 'Editable' }" : false;
					}
				}
				if (bInsertable && bInsertable.$Path) {
					return "{= ${" + sCurrentCollectionName + "/" + bInsertable.$Path + "}" + " && ${ui>/editable} === 'Editable'}";
				}
				return "{= " + (bInsertable !== false) + " && ${ui>/editable} === 'Editable'}";
			},
			/**
			 * checks if the navigation collection is deletable
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.isNavigationPropertyDeletable
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param {string} sCurrentCollectionName The name of the navigation collection
			 * @param {array} aRestrictedProperties array of RestrictedProperties of NavigationRestrictions of the root collection
			 * @param {boolean} bDeletable Deletable value of the navigation collection
			 * @returns {boolean} true if deletable, false otherwise
			 * @private
			 * @sap-restricted
			 **/
			isNavigationPropertyDeletable: function(sCurrentCollectionName, aRestrictedProperties, bDeletable) {
				var i, oNavigationProperty;
				for (i in aRestrictedProperties) {
					oNavigationProperty = aRestrictedProperties[i];
					if (
						oNavigationProperty.NavigationProperty.$NavigationPropertyPath === sCurrentCollectionName &&
						oNavigationProperty.DeleteRestrictions
					) {
						return oNavigationProperty.DeleteRestrictions.Deletable;
					}
				}
				if (bDeletable && bDeletable.$Path) {
					return "{= ${" + sCurrentCollectionName + "/" + bDeletable.$Path + "}" + " && ${ui>/editable} === 'Editable'}";
				}
				return "{= " + (bDeletable !== false) + " && ${ui>/editable} === 'Editable'}";
			},
			/**
			 * checks if the footer is visible or not
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.showFooter
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param {array} aDataFields array of DataFields in the identification
			 * @param {boolean} bConsiderEditable boolean value to check whether the edit mode binding is required or not
			 * @returns {string} expression if all the actions are ui.hidden, true otherwise
			 * @private
			 * @sap-restricted
			 **/
			showFooter: function(aDataFields, bConsiderEditable) {
				var sHiddenExpression = "";
				var sSemiHiddenExpression;
				var aHiddenActionPath = [];

				for (var i in aDataFields) {
					var oDataField = aDataFields[i];
					if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && oDataField.Determining === true) {
						if (!oDataField["@com.sap.vocabularies.UI.v1.Hidden"]) {
							return true;
						} else if (oDataField["@com.sap.vocabularies.UI.v1.Hidden"].$Path) {
							if (aHiddenActionPath.indexOf(oDataField["@com.sap.vocabularies.UI.v1.Hidden"].$Path) === -1) {
								aHiddenActionPath.push(oDataField["@com.sap.vocabularies.UI.v1.Hidden"].$Path);
							}
						}
					}
				}

				if (aHiddenActionPath.length) {
					for (var index in aHiddenActionPath) {
						if (aHiddenActionPath[index]) {
							sSemiHiddenExpression = "(%{" + aHiddenActionPath[index] + "} === true ? false : true )";
						}
						if (index == aHiddenActionPath.length - 1) {
							sHiddenExpression = sHiddenExpression + sSemiHiddenExpression;
						} else {
							sHiddenExpression = sHiddenExpression + sSemiHiddenExpression + "||";
						}
					}
					return (
						"{= " +
						sHiddenExpression +
						(bConsiderEditable ? " || ${ui>/editable} === 'Editable' " : " ") +
						"|| ${localUI>/showMessageFooter} === true}"
					);
				} else {
					return (
						"{= " + (bConsiderEditable ? "${ui>/editable} === 'Editable' || " : "") + "${localUI>/showMessageFooter} === true}"
					);
				}
			},
			/**
			 * Returns the metamodel path correctly for bound actions. For unbound actions,
			 * incorrect path is returned but during templating it is ignored.
			 * e.g. for bound action someNameSpace.SomeBoundAction of entity set SomeEntitySet,
			 * the string "/SomeEntitySet/someNameSpace.SomeBoundAction" is returned.
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.getActionContext
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param {object} oAction - context object for the action
			 * @returns {string} - Correct metamodel path for bound and incorrect path for unbound actions
			 * @private
			 * @sap-restricted
			 **/
			getActionContext: function(oAction) {
				return CommonHelper.getActionPath(oAction, true);
			},
			/**
			 * Returns the metamodel path correctly for overloaded bound actions. For unbound actions,
			 * incorrect path is returned but during templating it is ignored.
			 * e.g. for bound action someNameSpace.SomeBoundAction of entity set SomeEntitySet,
			 * the string "/SomeEntitySet/someNameSpace.SomeBoundAction/@$ui5.overload/0" is returned.
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.getPathToBoundActionOverload
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param {object} oAction - context object for the action
			 * @returns {string} - Correct metamodel path for bound action overload and incorrect path for unbound actions
			 * @private
			 * @sap-restricted
			 **/
			getPathToBoundActionOverload: function(oAction) {
				var sPath = CommonHelper.getActionPath(oAction, true);
				return sPath + "/@$ui5.overload/0";
			},
			getTableVisualizationPath: function(oVisualizations) {
				var i, oVisualization, sAnnotationPath;
				var aVisualizations = oVisualizations.getObject("");
				for (i in aVisualizations) {
					oVisualization = aVisualizations[i];
					sAnnotationPath = oVisualization.$AnnotationPath;
					if (sAnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.LineItem") > -1) {
						return oVisualizations.getPath() + "/" + i;
					}
				}
			}
		};

		AnnotationHelper.getBindingForDraftAdminBlockInline.requiresIContext = true;
		AnnotationHelper.getBindingForDraftAdminBlockInPopover.requiresIContext = true;
		return AnnotationHelper;
	},
	true
);
