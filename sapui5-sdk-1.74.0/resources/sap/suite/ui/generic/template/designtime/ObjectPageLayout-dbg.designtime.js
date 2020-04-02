sap.ui.define([
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/base/util/deepExtend",
		"sap/suite/ui/generic/template/designtime/library.designtime"
	],
	function(DesigntimeUtils, deepExtend) {
		"use strict";

		var ObjectPageLayout = {};

		/**
		 * Defines the valid control properties for an object page layout
		 *
		 * @param {sap.uxap.ObjectPageLayout} oLayout - Object page layout
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		ObjectPageLayout.getObjectPageLayoutProperties = function(oLayout) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oLayout);
			var oPropertiesWhiteList = {
				//Control Properties:
				showHeaderContent: { ignore: false },
				showAnchorBar: { ignore: false },
				useIconTabBar: { ignore: false },
				alwaysShowContentHeader: { ignore: false }
			};

			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		/**
		 * Defines the valid control properties for an HBox
		 *
		 * @param {sap.m.HBox} oHBox - Horizontal box
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		ObjectPageLayout.getHBoxProperties = function(oHBox) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oHBox);
			var oPropertiesWhiteList = {
				//Control Properties:
				visible: { ignore: false }
			};

			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		/**
		 * Retrieves the propagated and redefined designtime for a sap.uxap.ObjectPageLayout element
		 *
		 * @param {sap.uxap.ObjectPagelayout} oElement The SAP UI5 element representing the object page layout
		 * @returns {object} The designtime metadata containing embedded functions
		 * @public
		 */
		ObjectPageLayout.getDesigntime = function (oElement) {
			var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();

			return {
				name: {
					singular: function() {
						return oResourceBundle.getText("FE_OBJECT_PAGE_LAYOUT");
					}
				},
				properties: function(oElement) {
					return ObjectPageLayout.getObjectPageLayoutProperties(oElement);
				},
				aggregations: {
					_headerContent: {
						ignore: false
					},
					headerContent: {
						ignore: true
					},
					headerTitle: {
						ignore: false,
						aggregations: {
							navigationBar: {
								ignore: false
							}
						},
						propagateMetadata: function (oElement) {
							if (oElement.getMetadata().getElementName() === "sap.m.Bar") {
								return {
									aggregations: {
										contentRight: {
											propagateMetadata: function (oElement) {
												switch (oElement.getMetadata().getElementName()) {
													case "sap.m.HBox":
														return {
															actions: {},
															properties: function(oElement) {
																return ObjectPageLayout.getHBoxProperties(oElement);
															}
														};
												}
											}
										}
									}
								};
							}
						}

					},
					sections: {
						actions: {
							move: "moveSection",
							createContainer: {
								changeType: "addSection",
								changeOnRelevantContainer: true,
								getCreatedContainerId: function (sNewControlID) {
								return sNewControlID;
								}
							}
						},
					beforeMove : function (ObjectPageLayout) {
								//This function is overridden to make move action for section work.
								//Otherwise ObjectPageLayout.designtime of control layer breaks.
							}},

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
				},
				scrollContainers: [{
					domRef: "> .sapUxAPObjectPageWrapper",
					aggregations: ["sections", "_headerContent"]
					}, {
					domRef: function (oElement) {
					return oElement.$("vertSB-sb").get(0);
					}
				}]
			};
		};

		return ObjectPageLayout;
	});
