sap.ui.define(["sap/ui/fl/changeHandler/ChangeHandlerMediator",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"./library.designtime" // provides designtime i18n model
	],
	function(ChangeHandlerMediator, Utils, DesigntimeUtils) {
		"use strict";
		var HEADERINFO = "com.sap.vocabularies.UI.v1.HeaderInfo";
		var addHeaderActionButtonSettingsHandler = function(oTargetButton, mPropertyBag) {
			var aActions = [];
			if (oTargetButton.getParent().getId().indexOf("--template::ObjectPage::ObjectPageHeader") > -1) {
				aActions = oTargetButton.getParent().getActions();
			} else {
				aActions = oTargetButton.getActions();
			}
			var sChangeHandler = "addHeaderActionButton";
			return DesigntimeUtils.addSettingsHandler(oTargetButton, mPropertyBag, aActions, sChangeHandler);
		};

		var oObjectPageDynamicHeaderTitleDesigntime = {

			/*************************************************************************************************
			 * Retrieves the propagated and redefined designtime for a dynamic header title of the object page
			 *
			 * @param {object} oElement The SAPUI5 element instance
			 * @returns {object} The designtime metadata containing embedded functions
			 * @public
			 */
			getDesigntime: function (oElement) {
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
							return oResourceBundle.getText("FE_OBJECT_PAGE_DYNAMIC_HEADER_TITLE");
						}
					},
					properties: function(oElement) {
						return DesigntimeUtils.ignoreAllProperties(oElement);
					},
					actions: {
						settings: {
							name: "Add Action Button",
							handler: addHeaderActionButtonSettingsHandler,
							icon: "sap-icon://add"
						},
						remove: null
					},
					aggregations: {
						actions:{
							actions:{
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
							appliesTo: ["ObjectPageDynamicHeaderTitle"]
						}
					}
				};
			}
		};
		return oObjectPageDynamicHeaderTitleDesigntime;
});
