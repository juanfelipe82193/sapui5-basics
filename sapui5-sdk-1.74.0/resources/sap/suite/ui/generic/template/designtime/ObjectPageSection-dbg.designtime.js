sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/designtime/virtualProperties/SectionType",
		"sap/base/util/deepExtend",
		"./library.designtime" // provides designtime i18n model
	],
	function(Utils, AnnotationChangeUtils, DesigntimeUtils, SectionType, deepExtend) {
		"use strict";

		var FACETS = "com.sap.vocabularies.UI.v1.Facets";
		var COLLECTION_FACET = "com.sap.vocabularies.UI.v1.CollectionFacet";
		var REFERENCE_FACET = "com.sap.vocabularies.UI.v1.ReferenceFacet";
		var SECTIONTYPE_CONTACT = "Contact";
		var SECTIONTYPE_ADDRESS = "Address";

		var SectionDesigntime = {};

		/**
		 * Defines the valid control properties for an object page section
		 *
		 * @param {object} oSection - Object page section
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		SectionDesigntime.getSectionProperties = function(oSection) {

			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oSection),
				oPropertiesWhiteList =  {
				//Virtual Properties:
				sectionType: {
					name: "Section Type",
					virtual: true,
					ignore: false,
					type: "EnumType",
					possibleValues: SectionType.getSectionTypeValues(),
					get: function(oSection) {
						return SectionType.getSectionType(oSection);
					},
					set: function(oSection, sValue, oChange) {
						return SectionType.setSectionType(oSection, sValue, oChange);
					}
				}
			};
			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		/**
		 * Defines the valid control properties for a smart table of the list report
		 *
		 * @param {sap.ui.comp.smarttable.SmartTable} oSmartTable - Smart Table
		 * @returns {object} Object comprising all black or white-listed properties
		 */
		SectionDesigntime.getSmartTableProperties = function(oSmartTable) {
			var oPropertiesBlackList = DesigntimeUtils.ignoreAllProperties(oSmartTable);
			var oPropertiesWhiteList = {
				//Control Properties:
				useExportToExcel: { ignore: false }
			};

			return deepExtend({}, oPropertiesBlackList, oPropertiesWhiteList);
		};

		SectionDesigntime.getSectionAnnotationInfo = function(oSection) {
			var oEntityType = Utils.getODataEntityType(Utils.getComponent(oSection));
			var oFacet, aFacets = oEntityType[FACETS];
			var sSectionId = oSection.getId();
			sSectionId = sSectionId.split("--")[1];
			if (sSectionId) {
				sSectionId = sSectionId.substring(0, sSectionId.lastIndexOf("::"));
			}
			var iFacetIndex = DesigntimeUtils.getFacetIndexFromID(sSectionId, aFacets);
			if (iFacetIndex === undefined) {
				return;
			}
			oFacet = aFacets[iFacetIndex];
			var oFacetData = {};
			oFacetData.RecordType = oFacet.RecordType;
			oFacetData.AnnotationPath = oFacet.Target && oFacet.Target.AnnotationPath;
			return oFacetData;
		};

		/*************************************************************************************************
		 * Retrieves the propagated and redefined designtime for a sap.uxap.ObjectPageSection element
		 * as part of a Fiori element (strict scope)
		 *
		 * @param {sap.uxap.ObjectPageSection} oElement The SAPUI5 element instance
		 * @returns {object} The designtime metadata containing embedded functions
		 * @public
		 */
		SectionDesigntime.getDesigntime = function(oElement) {
			var oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();
			var oSectionData = {
				name: {
					singular: function() {
						return oResourceBundle.getText("FE_SECTION");
					},
					plural: function() {
						return oResourceBundle.getText("FE_SECTIONS");
					}
				},
				actions: {
					rename: null
				},
				properties: DesigntimeUtils.ignoreAllProperties(oElement)
			};
			var oTemplData = Utils.getTemplatingInfo(oElement);
			if (!oTemplData) {
				deepExtend(oSectionData, {
					actions: "not-adaptable"
				});
				return oSectionData;
			}

			var oExtendedSectionData = {

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
				aggregations: {
					subSections: {
						childNames: {
							plural: function() {
								return oResourceBundle.getText("FE_SUB_SECTIONS");
							},
							singular: function() {
								return oResourceBundle.getText("FE_SUB_SECTION");
							}
						},
						actions: {
							move: "moveSubSection",
							createContainer: {
								changeType: "addSubSection",
								isEnabled: true,
								changeOnRelevantContainer: true,
								getCreatedContainerId: function(sNewControlID) {
									return sNewControlID;
								}
							}
						}
					}
				},
				propagateRelevantContainer: true,
				propagateMetadata: function(oElement) {
					switch (oElement.getMetadata().getElementName()) {
					case "sap.m.ColumnListItem":
						return {
							properties: DesigntimeUtils.ignoreAllProperties(oElement),
							aggregations: {
								cells: {
									ignore: true
								}
							}
						};
					case "sap.ui.comp.smarttable.SmartTable":
						return {
							name: {
								singular: function() {
									return oResourceBundle.getText("FE_SECTION");
								}
							},
							properties:  SectionDesigntime.getSmartTableProperties(oElement),
							aggregations: {
								semanticKeyAdditionalControl: {
									ignore: true
								}
							}
						};
					}
				},
				properties: SectionDesigntime.getSectionProperties(oElement),
				links: {
					developer: [{
						href: "/api/sap.uxap.ObjectPageSection",
						text: function() {
							return oResourceBundle.getText("FE_SECTIONS");
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
						changeType: "removeSection",
						changeOnRelevantContainer: true
					}
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
							if (oRecord && oRecord.RecordType === REFERENCE_FACET) {
								var sSectionType = SectionType.getSectionType(oElement);
								return sSectionType === SECTIONTYPE_ADDRESS || sSectionType === SECTIONTYPE_CONTACT;
							} else {
								return true;
							}
						}.bind(this),
						appliesTo: ["ObjectPage/Sections"],
						group: ["Appearance"],
						links: {
							developer: [{
								href: "/topic/facfea09018d4376acaceddb7e3f03b6.html",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_SECTIONS");
								}
							}]
						}
					},
					referenceFacetContact: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "ReferenceFacet",
						defaultValue: null,
						whiteList: {
							properties: ["Target", "ID", "Label"],
							expressionTypes: {
								Label: ["String"]
							},
							mandatory: ["Target"]
						},
						ignore: function() {
							var oRecord = this.getSectionAnnotationInfo(oElement);
							if (oRecord && oRecord.RecordType === REFERENCE_FACET) {
								var sSectionType = SectionType.getSectionType(oElement);
								return sSectionType !== SECTIONTYPE_CONTACT;
							} else {
								return true;
							}
						}.bind(this),
						appliesTo: ["ObjectPage/Sections"],
						group: ["Appearance"],
						links: {
							developer: [{
								href: "/topic/a6a8c0c4849b483eb10e87f6fdf9383c.html",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_SECTIONS_CONTACT");
								}
							}]
						},
						refersTo: [{
							annotation: "contact",
							nullable: false,
							referredBy: "Target"
						}]
					},
					referenceFacetAddress: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "ReferenceFacet",
						defaultValue: null,
						whiteList: {
							properties: ["Target", "ID", "Label"],
							expressionTypes: {
								Label: ["String"]
							},
							mandatory: ["Target"]
						},
						ignore: function() {
							var oRecord = this.getSectionAnnotationInfo(oElement);
							if (oRecord && oRecord.RecordType === REFERENCE_FACET) {
								var sSectionType = SectionType.getSectionType(oElement);
								return sSectionType !== SECTIONTYPE_ADDRESS;
							} else {
								return true;
							}
						}.bind(this),
						appliesTo: ["ObjectPage/Sections"],
						group: ["Appearance"],
						links: {
							developer: [{
								href: "/topic/9eb3aaecc09b431ca27f97eb1ee5d861.html",
								text: function() {
									return oResourceBundle.getText("FE_SDK_GUIDE_SECTIONS_ADDRESS");
								}
							}]
						},
						refersTo: [{
							annotation: "address",
							nullable: false,
							referredBy: "Target"
						}]
					},
					contact: {
						namespace: "com.sap.vocabularies.Communication.v1",
						annotation: "Contact",
						ignore: function() {
							var oRecord = this.getSectionAnnotationInfo(oElement);
							if (oRecord && oRecord.RecordType === REFERENCE_FACET) {
								var sSectionType = SectionType.getSectionType(oElement);
								return sSectionType !== SECTIONTYPE_CONTACT;
							} else {
								return true;
							}
						}.bind(this),
						target: ["EntityType"],
						whiteList: {
							properties: [
								"fn", "n", "tel", "email", "photo", "title", "org", "role"
							],
							expressionTypes: {
								fn: ["Path"],
								photo: ["Path"],
								title: ["Path"],
								org: ["Path"],
								role: ["Path"]
							}
						},
						appliesTo: ["ObjectPage/Sections"]
					},
					address: {
						namespace: "com.sap.vocabularies.Communication.v1",
						annotation: "Address",
						ignore: function() {
							var oRecord = this.getSectionAnnotationInfo(oElement);
							if (oRecord && oRecord.RecordType === REFERENCE_FACET) {
								var sSectionType = SectionType.getSectionType(oElement);
								return sSectionType !== SECTIONTYPE_ADDRESS;
							} else {
								return true;
							}
						}.bind(this),
						target: ["EntityType"],
						appliesTo: ["ObjectPage/Sections"]
					},
					collectionFacet: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "CollectionFacet",
						defaultValue: null,
						ignore: function() {
							var oRecord = this.getSectionAnnotationInfo(oElement);
							if (oRecord) {
								return oRecord.RecordType !== COLLECTION_FACET;
							}
						}.bind(this),
						whiteList: {
							properties: ["Label", "ID"],
							expressionTypes: {
								Label: ["String"]
							}
						},
						appliesTo: ["ObjectPage/Sections"],
						group: ["Appearance"],
						links: {
							developer: [{
								href: "/topic/facfea09018d4376acaceddb7e3f03b6.html",
								text: "Defining and Adapting Sections"
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

			return deepExtend(oSectionData, oExtendedSectionData);
		};

		return SectionDesigntime;
	});
