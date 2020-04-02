sap.ui.define([
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/base/util/deepExtend",
	    "./library.designtime"
	],
	function(DesigntimeUtils, deepExtend) {
		"use strict";

		var oSmartFormDesigntime = {
			/**
			 * Gets the propagated and redefined designtime for a smartform on the object page
			 *
			 * @param {sap.ui.comp.smartform} oElement The current UI element
			 * @param {boolean} bOnlyBasicData Indicator: Only fill name and set all properties ro read-only
			 * @returns {object} designtime metadata, with embedded functions
			 * @public
			 */
			getDesigntime: function (oElement, bOnlyBasicData) {
				var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();

				var oSmartFormData = {
					name: {
						singular: function() {
							return oResourceBundle.getText("FE_FORM");
						},
						plural: function() {
							return oResourceBundle.getText("FE_FORMS");
						}
					},
					properties: function(oElement) {
						return DesigntimeUtils.ignoreAllProperties(oElement);
					},
					actions: null,
					annotations: null
				};

				if (bOnlyBasicData) {
					return oSmartFormData;
				}

				var oExtendedSmartFormData = {
					actions: {
						rename: null
					},
					aggregations: {
						groups: {
							aggregations: {
								semanticObjectController: {
									ignore: true
								}
							},
							propagateRelevantContainer: true,
							propagateMetadata: function (oElement) {
								switch (oElement.getMetadata().getElementName()) {
									case "sap.ui.comp.smartfield.SmartLink":
										return {
											name: {
												singular: function() {
													return oResourceBundle.getText("FE_LINK");
												},
												plural: function() {
													return oResourceBundle.getText("FE_LINKS");
												}
											},
											properties: function(oElement) {
												return DesigntimeUtils.ignoreAllProperties(oElement);
											},
											annotations: {
												semanticObjectMapping: { ignore: true } //property annotations, not supported yet
											}

										};
								}
							},
							actions: {
								move: "moveGroup",
								createContainer: {
									changeType: "addGroup",
									isEnabled: true,
									changeOnRelevantContainer:true,
									getCreatedContainerId: function(sNewControlID) {
										return sNewControlID;
									}
								}
							},
							annotations: {}
						}
					}
				};

				return deepExtend(oSmartFormData, oExtendedSmartFormData);
			}
		};
		return oSmartFormDesigntime;
});
