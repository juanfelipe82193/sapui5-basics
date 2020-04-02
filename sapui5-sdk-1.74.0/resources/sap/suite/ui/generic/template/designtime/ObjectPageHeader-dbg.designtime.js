sap.ui.define([
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/base/util/deepExtend",
		"./library.designtime" // provides designtime i18n model
	],
	function(Utils, DesigntimeUtils, deepExtend) {
		"use strict";

		var ObjectPageHeaderDesigntime = {};
		var HEADERINFO = "com.sap.vocabularies.UI.v1.HeaderInfo";

		/**
		 * Defines the settings handler as the responsible change handler for the actin buttons of the object page header.
		 * @param {sap.m.Button} oTargetButton The new button
		 * @param [object} mPropertyBag Property of the given UI change
		 */
		ObjectPageHeaderDesigntime.addHeaderActionButtonSettingsHandler = function(oTargetButton, mPropertyBag) {
			var aActions = [];
			if (oTargetButton.getParent().getId().indexOf("--objectPageHeader") > -1) {
				aActions = oTargetButton.getParent().getActions();
			} else {
				aActions = oTargetButton.getActions();
			}
			var sChangeHandler = "addHeaderActionButton";
			return DesigntimeUtils.addSettingsHandler(oTargetButton, mPropertyBag, aActions, sChangeHandler);
		};

		/**
		 * Defines the valid control properties for an object page header
		 *
		 * @param {sap.uxap.ObjectPageHeader} oHeader - Object page header
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		ObjectPageHeaderDesigntime.getObjectHeaderProperties = function(oHeader) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oHeader);
			var oPropertiesWhiteList = {
				//Control Properties:
				objectImageShape: {
					ignore: false
				}
			};

			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		/**
		 * Defines the valid control properties for an HBox
		 *
		 * @param {sap.m.HBox} oHBox - Horizontal box
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		ObjectPageHeaderDesigntime.getHBoxProperties = function(oHBox) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oHBox);
			var oPropertiesWhiteList = {
				//Control Properties:
				visible: { ignore: false }
			};

			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		/********************************************************************************************
		 * Retrieves the propagated and redefined designtime for a sap.uxap.ObjectPageHeader element
		 *
		 * @param {sap.uxap.ObjectPageHeader} oElement The SAP UI5 element representing the object page header
		 * @returns {object} The designtime metadata containing embedded functions
		 * @public
		 */
		ObjectPageHeaderDesigntime.getDesigntime = function (oElement) {
			var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();

			return {
				getCommonInstanceData: function(oElement) {
					var sTarget,
						oTemplData = Utils.getTemplatingInfo(oElement);
					if (oTemplData) {
						var sEntityType = oTemplData.target;
						if (sEntityType) {
							sTarget = sEntityType + "/" + HEADERINFO;
						}
					}
					return {
						target: sTarget,
						annotation: HEADERINFO
					};
				},
				name: {
					singular: function() {
						return oResourceBundle.getText("FE_OBJECT_PAGE_HEADER");
					}
				},
				properties: function(oElement) {
					return ObjectPageHeaderDesigntime.getObjectHeaderProperties(oElement);
				},
				actions: {
					settings: {
						name: "Add Action Button",
						handler: ObjectPageHeaderDesigntime.addHeaderActionButtonSettingsHandler,
						icon: "sap-icon://add"
					}
				},
				aggregations: {
					actions: {
						properties: ObjectPageHeaderDesigntime.getHBoxProperties(oElement),
						actions: {
							move: function (oElement) {
								switch (oElement.getMetadata().getElementName()) {
									case "sap.uxap.ObjectPageHeaderActionButton":
										var oTemplData = Utils.getTemplatingInfo(oElement);
										var regEx = /.+(sap.suite.ui.generic.template.ObjectPage.view.Details::).+(?:--edit|--delete|--relatedApps|--template::Share|--template::NavigationUp|--template::NavigationDown|--fullScreen|--exitFullScreen|--closeColumn)$/;
										if (regEx.test(oElement.getId()) || !oTemplData) {
											return null;
										}
										return "moveHeaderAndFooterActionButton";
								}
							}
						}
					},
					navigationBar: {
						ignore: true
					}
				},
				annotations: {
					headerInfo: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "HeaderInfo",
						whiteList: {
							properties: ["Title", "Description", "ImageUrl", "TypeImageUrl", "TypeName", "Initials"],
							Title: {
								types: ["DataField"],
								properties: ["Value"]
							},
							Description: {
								types: ["DataField"],
								properties: ["Value"]
							}
						},
						appliesTo: ["ObjectPageHeader"]
					}
				}
			};
		};

		return ObjectPageHeaderDesigntime;
});
