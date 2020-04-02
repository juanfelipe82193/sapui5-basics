sap.ui.define([
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/base/util/deepExtend",
		"./library.designtime" // provides designtime i18n model
	],
	function(Utils, DesigntimeUtils, deepExtend) {
		"use strict";

		var addHeaderActionButtonSettingsHandler = function(oTargetButton, mPropertyBag) {
			var aActions = oTargetButton.getParent().getActions();
			var sChangeHandler = "addHeaderActionButton";
			return DesigntimeUtils.addSettingsHandler(oTargetButton, mPropertyBag, aActions, sChangeHandler);
		};

		var oObjectPageHeaderActionButtonDesigntime = {

			/*************************************************************************************************
			 * Retrieves the propagated and redefined designtime for an action button of the object page header
			 *
			 * @param {object} oElement The SAPUI5 element instance
			 * @returns {object} The designtime metadata containing embedded functions
			 * @public
			 */
			getDesigntime: function (oElement) {
				var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();
				var oActionButtonData = {
					name: {
						singular: function() {
							return oResourceBundle.getText("FE_OBJECT_PAGE_HEADER_ACTION_BUTTON");
						}
					},
					properties: function(oElement) {
						return DesigntimeUtils.getButtonProperties(oElement);
					},
					actions: null
				};

				var regEx = /.+(sap.suite.ui.generic.template.ObjectPage.view.Details::).+(?:--edit|--delete|--relatedApps|--template::Share|--template::NavigationUp|--template::NavigationDown|--fullScreen|--exitFullScreen|--closeColumn)$/;
				var oTemplData = Utils.getTemplatingInfo(oElement);
				if (regEx.test(oElement.getId()) || !oTemplData) {
					return oActionButtonData;
				}

				var oExtendedActionButtonData = {
					getCommonInstanceData: function(oElement) {
						var oTemplData = Utils.getTemplatingInfo(oElement);
						if (oTemplData && oTemplData.path) {
							var sTarget = oTemplData.target + '/' + oTemplData.path.substr(oTemplData.path.indexOf("com.sap.vocabularies.UI.v1.Identification"));
							return {
								target: sTarget,
								annotation: oTemplData.annotation,
								qualifier: null
							};
						}
					},
					actions: {
						rename: null,
						reveal: null,
						remove: {
							changeType: "removeHeaderAndFooterActionButton",
							changeOnRelevantContainer: true
						},
						settings: {
							name: "Add Action Button",
							handler: addHeaderActionButtonSettingsHandler,
							icon: "sap-icon://add"
						}
					},
					links: {
						developer: [{
							href: "/topic/5fe439613f9c4e259015951594c423dc",
							text: function() {
								return oResourceBundle.getText("FE_SDK_GUIDE_HEADER_ACTIONS");
							}
						}]
					},
					annotations: {
						dataFieldForAction: {
							namespace: "com.sap.vocabularies.UI.v1",
							annotation: "DataFieldForAction",
							whiteList: {
								properties: ["Action", "Label", "Criticality", "InvocationGrouping"],
								mandatory: ["Action"],
								expressionTypes: {
									Action: ["String"],
									Label: ["String"],
									Criticality: ["Path"]
								}
							},
							ignore: function() {
								var oTempInfo = Utils.getTemplatingInfo(oElement);
								var oRecord = oTempInfo && oTempInfo.annotationContext;
								return !oRecord || oRecord.RecordType !== "com.sap.vocabularies.UI.v1.DataFieldForAction";
							},
							links: {
								developer: [{
									href: "/topic/5fe439613f9c4e259015951594c423dc",
									text: function() {
										return oResourceBundle.getText("FE_SDK_GUIDE_HEADER_ACTIONS");
									}
								}]
							}
						},
						importance: {
							namespace: "com.sap.vocabularies.UI.v1",
							annotation: "Importance",
							defaultValue: null,
							target: ["Record"],
							links: {
								developer: [{
									href: "/topic/5fe439613f9c4e259015951594c423dc",
									text: function() {
										return oResourceBundle.getText("FE_SDK_GUIDE_HEADER_ACTIONS");
									}
								}]
							}
						}
					}
				};

				return deepExtend(oActionButtonData, oExtendedActionButtonData);
			}
		};
		return oObjectPageHeaderActionButtonDesigntime;
});
