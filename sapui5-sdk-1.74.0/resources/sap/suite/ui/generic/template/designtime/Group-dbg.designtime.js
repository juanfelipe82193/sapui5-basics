sap.ui.define(["sap/ui/fl/changeHandler/ChangeHandlerMediator",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/base/util/deepExtend",
		"./library.designtime" // provides designtime i18n model
	],
	function(ChangeHandlerMediator, Utils, DesigntimeUtils, deepExtend) {
		"use strict";
		var FACETS = "com.sap.vocabularies.UI.v1.Facets";

		var oGroupDesigntime = {

			/**
			 * Gets the propagated and redefined designtime for a smartform group on the object page
			 *
			 * @param {sap.ui.comp.smartform.Group} oElement The current UI element
			 * @param {boolean} bOnlyBasicData Indicator: Only fill name and set all properties ro read-only
			 * @returns {object} designtime metadata, with embedded functions
			 * @public
			 */
			getDesigntime: function (oElement, bOnlyBasicData) {
				var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();
				var oSmartFormGroupData = {
					name: {
						singular: function() {
							return oResourceBundle.getText("FE_GROUP");
						},
						plural: function() {
							return oResourceBundle.getText("FE_GROUPS");
						}
					},
					properties: function(oElement) {
						return DesigntimeUtils.ignoreAllProperties(oElement);
					},
					actions: null
				};

				if (bOnlyBasicData) {
					return oSmartFormGroupData;
				}

				var oExtendedSmartFormGroupData = {
					getCommonInstanceData: function(oElement) {
						var oTemplData = Utils.getTemplatingInfo(oElement);
						if (oTemplData && oTemplData.path) {
							var sTarget = oTemplData.target + '/' + oTemplData.path.substr(oTemplData.path.indexOf(FACETS));
							return {
								target: sTarget,
								annotation: oTemplData.annotation,
								qualifier: null
							};
						}
					},
					links: {
						developer: [{
								href: "/topic/facfea09018d4376acaceddb7e3f03b6",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_SECTIONS");
								}
							}
						]
					},

					aggregations: {
						formElements: {
							properties: function(oElement) {
								return DesigntimeUtils.ignoreAllProperties(oElement);
							},
							actions: {
								addODataProperty: function() {
									var oChangeHandlerSettingsPromise = ChangeHandlerMediator.getAddODataFieldSettings(oElement)
									.then(function(mChangeHandlerSettings) {
										if (mChangeHandlerSettings) {
											mChangeHandlerSettings.content.requiredLibraries = "";
										}
										return mChangeHandlerSettings;
									});
									return {
										changeType: "addGroupElement",
										changeOnRelevantContainer: true,
										changeHandlerSettings: oChangeHandlerSettingsPromise
									};
								},
								move: "moveGroupElement"
							}
						}
					},
					actions: {
						remove: {
							changeType: "removeGroup",
							changeOnRelevantContainer: true
						},
						rename: null
					},
					annotations: {
						referenceFacet: {
							namespace: "com.sap.vocabularies.UI.v1",
							annotation: "ReferenceFacet",
							whiteList: {
								properties: ["Target", "Label", "ID"],
								mandatory: ["Target"],
								expressionTypes: {
									Label: ["String"]
								}
							},
							links: {
								developer: [ {
									href:"/topic/facfea09018d4376acaceddb7e3f03b6.html",
									text: "Smart Form"
								}]
							},
							appliesTo: ["SmartForm/Groups"]
						}
					}
				};

				return deepExtend(oSmartFormGroupData, oExtendedSmartFormGroupData);
			}
		};
		return oGroupDesigntime;
});
