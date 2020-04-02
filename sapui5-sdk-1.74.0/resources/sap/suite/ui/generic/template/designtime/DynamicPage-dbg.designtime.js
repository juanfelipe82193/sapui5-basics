sap.ui.define([
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/base/util/deepExtend",
		"sap/suite/ui/generic/template/designtime/library.designtime"
	],
	function(DesigntimeUtils, deepExtend) {
		"use strict";

		var DynamicPageDesigntime = {};

		/**
		 * Defines the valid control properties for sap.f.DynamicPage
		 *
		 * @param {sap.f.DynamicPage} oDynamicPage - Dynamic Page
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		DynamicPageDesigntime.getControlProperties = function(oDynamicPage) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oDynamicPage);
			var oPropertiesWhiteList = {
				//Control Properties:
				fitContent: {
					ignore: false
				}
			};

			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		/**
		 * Gets the propagated and redefined designtime for a sap.f.DynamicPage element, as presented in a list report.
		 *
		 * @param {object} oElement The current UI element which must me sap.f.DynamicPage
		 * @returns {object} designtime metadata, with embedded functions
		 * @public
		 */
		DynamicPageDesigntime.getDesigntime = function (oElement) {
			var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();

			return {
				name: {
					singular:  function() {
						return oResourceBundle.getText("FE_DYNAMIC_PAGE");
					}
				},
				properties: function(oElement) {
					return DynamicPageDesigntime.getControlProperties(oElement);
				},
				aggregations: {
					footer: {
						propagateRelevantContainer: true,
						propagateMetadata: function (oElement) {
							if (oElement.getMetadata().getElementName() === "sap.m.OverflowToolbar") {
								return {
									name: {
										singular: function () {
											return oResourceBundle.getText("FE_FOOTER_TOOLBAR");
										}
									},
									properties: function (oElement) {
										return DesigntimeUtils.ignoreAllProperties(oElement);
									},
									aggregations: {
										content: {
											propagateRelevantContainer: true,
											propagateMetadata: function (oElement) {
												switch (oElement.getMetadata().getElementName()) {
													case "sap.m.ToolbarSpacer":
														return {
															actions: null
														};
												}
											}
										}
									}
								};
							}
						}
					}
				}
			};
		};

		return DynamicPageDesigntime;
	});
