sap.ui.define([
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/base/util/deepExtend",
		"sap/suite/ui/generic/template/designtime/library.designtime"
	],
	function(DesigntimeUtils, deepExtend) {
		"use strict";

		var SmartTableDesigntime = {};

		/**
		 * Defines the valid control properties for a smart table of the list report
		 *
		 * @param {sap.ui.comp.smarttable.SmartTable} oSmartTable - Smart Table
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		SmartTableDesigntime.getSmartTableProperties = function(oSmartTable) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oSmartTable);
			var oPropertiesWhiteList = {
				//Control Properties:
				useExportToExcel: { ignore: false },
				enableAutoBinding: { ignore: false }
			};

			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		/**
		 * Gets the propagated and redefined designtime for a sap.m.SmartTable element, as presented in a list report.
		 *
		 * @param {object} oElement The current UI element which must me sap.m.Table
		 * @returns {object} designtime metadata, with embedded functions
		 * @public
		 */
		SmartTableDesigntime.getDesigntime = function (oElement) {
			var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();

			return {
				name: {
					singular: function () {
						return oResourceBundle.getText("FE_SMARTTABLE");
					}
				},
				aggregations: {
					"semanticKeyAdditionalControl": {
						ignore: true
					}
				},
				properties: SmartTableDesigntime.getSmartTableProperties(oElement),
				annotations: {
					phoneNumber: {ignore: true},   // defined in Column.designtime
					emailAddress: {ignore: true},   // defined in Column.designtime
					sortable: {ignore: true},			//defined in back-end (BO)
					filterable: {ignore: true},		//defined in back-end (BO)
					columnLabelOnProperty: {ignore: true},	// defined in Column.designtime
					columnVisible: {ignore: true},		// defined in Column.designtime
					columnCurrencyCode: {ignore: true},	// defined in Column.designtime
					columnUnitOfMeasure: {ignore: true},	// defined in Column.designtime
					columnUpperCase: {ignore: true},		// defined in Column.designtime
					columnImportance: {ignore: true},		// defined in Column.designtime
					columnDataField: {ignore: true},		// defined in Column.designtime
					columnText: {ignore: true},			// not used
					textArrangement: {ignore: true},		// defined in Column.designtime
					columnIsImageURL: {ignore: true},		// defined in Column.designtime
					columnDataFieldWithUrl: {ignore: true},	// defined in Column.designtime
					columnCriticality: {ignore: true},	// is property
					columnCriticalityRepresentationType: {ignore: true}, // is property
					columnCalendarDate: {ignore: true},  // defined in Column.designtime
					lineItem: {ignore: true},				//defined on aggregation level
					semanticKey: {ignore: true},			//defined in back-end (BO)
					semanticObject: {ignore: true},		//defined in back-end (BO)
					dataFieldDefault: {ignore: true}, //target = property
					headerLabel: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "HeaderInfo",
						target: ["EntityType"],
						whiteList: {
							properties: ["TypeNamePlural"],
							mandatory: ["TypeNamePlural"]
						},

						appliesTo: ["SmartTable/header"],
						links: {
							developer: [{
								href: "/topic/f9962074132a43db9e1381291f8f3af8.html",
								text: function () {
									return oResourceBundle.getText("FE_SDK_GUIDE_ST_HEADER");
								}
							}],
							guidelines: []
						},
						group: ["Appearance"]
					},
					presentationVariant: {ignore: true}
					/* presentationVariant: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "PresentationVariant",
						target: ["EntityType"],
						appliesTo: ["SmartTable/customData/TemplateSortOrder"],
						links: {
							developer: [{
								href: "/topic/11d5a0c51e88414ca8d0a87407956f49.html",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_SORT_ORDER");
								}
							},{
								href: "/api/sap.ui.comp.smarttable.SmartTable/annotations/PresentationVariant",
								text: function() {
									return oResourceBundle.getText("FE_API_SMART_TABLE_ANNOTATIONS");
								}
							}],
							guidelines: []
						},
						group: ["Appearance"]
					} */
				}
			};
		};

		return SmartTableDesigntime;
	});
