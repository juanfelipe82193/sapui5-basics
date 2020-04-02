sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/base/util/deepExtend",
		"./library.designtime" // provides designtime i18n model
	],
	function(Utils, DesigntimeUtils, deepExtend) {
		"use strict";
		var FACETS = "com.sap.vocabularies.UI.v1.Facets";
		var COLLECTION_FACET = "com.sap.vocabularies.UI.v1.CollectionFacet";
		var REFERENCE_FACET = "com.sap.vocabularies.UI.v1.ReferenceFacet";

		var oSubSectionDesigntime = {

			/**
			 * Determines the target annotation information of a section
			 * @param {sap.uxap.ObjectPageSubSection} oSubSection Subsection of the object page
			 * @returns {object} The pre-filled facet data
			 */
			getSectionAnnotationInfo: function(oSubSection) {
				var oFacet = Utils.getTemplatingInfo(oSubSection) && Utils.getTemplatingInfo(oSubSection).annotationContext;
				var oFacetData = {};
				if (!oFacet){
					oFacetData.RecordType = REFERENCE_FACET;
					return oFacetData;
				}
				oFacetData.RecordType = oFacet.RecordType;
				oFacetData.AnnotationPath = oFacet.Target && oFacet.Target.AnnotationPath;
				return oFacetData;
			},

			/*************************************************************************************************
			 * Retrieves the propagated and redefined designtime for a sap.uxap.ObjectPageSubSection element
			 * as part of a Fiori element (strict scope)
			 *
			 * @param {sap.uxap.ObjectPageSubSection} oElement The SAPUI5 element instance
			 * @param {boolean} bOnlyBasicData Indicator: Only fill name and set all properties ro read-only
			 * @returns {object} The designtime metadata containing embedded functions
			 * @public
			 */
			getDesigntime: function(oElement, bOnlyBasicData) {
				var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();
				var oSubSectionData = {
					name: {
						singular: "Subsection"
					},
					properties: DesigntimeUtils.ignoreAllProperties(oElement)
				};
				if (bOnlyBasicData) {
					oSubSectionData.actions = "not-adaptable";
					return oSubSectionData;
				}

				var oExtendedSubSectionData = {
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
							href: "/api/sap.uxap.ObjectPageSubSection",
							text: function() {
								return oResourceBundle.getText("FE_SUB_SECTIONS");
							}
						}, {
							href: "/topic/facfea09018d4376acaceddb7e3f03b6",
							text: function() {
								return oResourceBundle.getText("FE_SDK_GUIDE_SECTIONS");
							}
						}]
					},
					actions: {
						remove: {
							changeType: "removeSubSection",
							changeOnRelevantContainer: true
						},
						rename: null,
						reveal: null
					},
					annotations: {
						referenceFacet: {
							namespace: "com.sap.vocabularies.UI.v1",
							annotation: "ReferenceFacet",
							defaultValue: null,
							whiteList: {
								properties: ["Target", "Label", "ID"],
								expressionTypes: {
									Label: ["String"]
								},
								mandatory: ["Target"]
							},
							ignore: function() {
								var oRecord = this.getSectionAnnotationInfo(oElement);
								return oRecord.RecordType !== REFERENCE_FACET;
							}.bind(this),
							group: ["Appearance"],
							appliesTo: ["ObjectPage/Subsections"],
							links: {
								developer: [{
									href: "/topic/facfea09018d4376acaceddb7e3f03b6.html",
									text: function() {
										return oResourceBundle.getText("FE_SDK_GUIDE_SECTIONS");
									}
								}]
							}
						},
						collectionFacet: {
							namespace: "com.sap.vocabularies.UI.v1",
							annotation: "CollectionFacet",
							defaultValue: null,
							ignore: function() {
								var oRecord = this.getSectionAnnotationInfo(oElement);
								return oRecord.RecordType !== COLLECTION_FACET;
							}.bind(this),
							whiteList: {
								properties: ["Label", "ID"],
								expressionTypes: {
									Label: ["String"]
								}
							},
							group: ["Appearance"],
							appliesTo: ["ObjectPage/Subsections"],
							links: {
								developer: [{
									href: "/topic/facfea09018d4376acaceddb7e3f03b6.html",
									text: function() {
										return oResourceBundle.getText("FE_SDK_GUIDE_SECTIONS");
									}
								}]
							}
						}
						/* Deactivated until VE can handle deep hierarchical annotations
						sectionChart: {
							namespace: "com.sap.vocabularies.UI.v1",
							annotation: "Chart",
							ignore: function() {
								var oRecord = this.getSectionAnnotationInfo(oElement);
								return !(oRecord.AnnotationPath && oRecord.AnnotationPath.indexOf(CHART) > -1) ;
							}.bind(this),
							target: ["ComplexType"],
							defaultValue: null,
							appliesTo: ["ObjectPage/Sections"],
							links: {
								developer: [{
									href: "/topic/653ed0f4f0d743dbb33ace4f68886c4e",
									text: "Adding a Smart Chart Facet"
								}]
							}
						}*/
					}
				};

				return deepExtend(oSubSectionData, oExtendedSubSectionData);
			}
		};
		return oSubSectionDesigntime;
	});
