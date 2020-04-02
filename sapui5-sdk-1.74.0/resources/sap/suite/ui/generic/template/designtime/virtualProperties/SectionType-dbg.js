sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
	"sap/base/util/extend",
	"sap/base/util/isEmptyObject"
], function(Utils, AnnotationChangeUtils, DesigntimeUtils, extend, isEmptyObject) {
	"use strict";

	var SectionType = {};

	var FIELDGROUP = "com.sap.vocabularies.UI.v1.FieldGroup";
	var FACETS = "com.sap.vocabularies.UI.v1.Facets";
	var LINEITEM = "com.sap.vocabularies.UI.v1.LineItem";
	var CHART = "com.sap.vocabularies.UI.v1.Chart";
	var COLLECTION_FACET = "com.sap.vocabularies.UI.v1.CollectionFacet";
	var REFERENCE_FACET = "com.sap.vocabularies.UI.v1.ReferenceFacet";
	var IDENTIFICATION = "com.sap.vocabularies.UI.v1.Identification";
	var DATAFIELD = "com.sap.vocabularies.UI.v1.DataField";
	var FIELDGROUP_TYPE = "com.sap.vocabularies.UI.v1.FieldGroupType";
	var CONTACT = "com.sap.vocabularies.Communication.v1.Contact";
	var ADDRESS = "com.sap.vocabularies.Communication.v1.Address";

	var SECTIONTYPE_FORM = "SmartForm";
	var SECTIONTYPE_TABLE = "SmartTable";
	var SECTIONTYPE_CHART = "SmartChart";
	var SECTIONTYPE_CONTACT = "Contact";
	var SECTIONTYPE_ADDRESS = "Address";

	/**
	 * Create a new section object.
	 *
	 * @param {object} oOldSectionRecord Old record of the collection with its content
	 * @param {string} sFieldGroupTerm Name of the new field group
	 * @returns {object} The new section record
	 * @public
	 */
	SectionType.createNewSection = function(oOldSectionRecord, sFieldGroupTerm) {
		var oNewCollectionFacet, oNewReferenceFacetTemplate = {
			"Label": {
				"String": "New Group"
			},
			"ID": {},
			"Target": {},
			"RecordType": REFERENCE_FACET
		};
		if (sFieldGroupTerm) {
			oNewReferenceFacetTemplate.Target.AnnotationPath = "@" + sFieldGroupTerm;
			oNewCollectionFacet = {
				"ID": {},
				"Label": {},
				"Facets": [oNewReferenceFacetTemplate],
				"RecordType": COLLECTION_FACET
			};
		}
		var oNewFacet = sFieldGroupTerm ? oNewCollectionFacet : oNewReferenceFacetTemplate;
		for (var sProperty in oOldSectionRecord) {
			if (sProperty !== "RecordType" && sProperty !== "Target" && sProperty !== "Facets" && oNewFacet[sProperty]) {
				extend(oNewFacet[sProperty], oOldSectionRecord[sProperty]);
			}
			if (isEmptyObject(oNewFacet[sProperty])) {
				delete oNewFacet[sProperty];
			}
		}
		return oNewFacet;
	};

	/**
	 * Retrieves a list of possible values of the section type property, e.g. for filling a drop-down in the UI.
	 *
	 * @param {object} oElement The UI5 element (in overlay mode)
	 * @returns {object} An object comprising the values (as a technical key) and their labels (displayName)
	 * @public
	 */
	SectionType.getSectionTypeValues = function() {
		var oValues = {
			SmartForm: {
				displayName: "Smart Form"
			},
			SmartTable: {
				displayName: "Smart Table"
			},
			SmartChart: {
				displayName: "Smart Chart"
			},
			Contact: {
				displayName: "Contact"
			},
			Address: {
				displayName: "Address"
			}
		};
		return oValues;
	};

	/**
	 * Retrieves the current value of the section type property for a given section from
	 * various annotations.
	 *
	 * @param {object} oElement The UI5 element (in overlay mode)
	 * @returns {string} The technical key of the section type property,
	 * as comprised in the list of possible values.
	 *
	 * @public
	 */
	SectionType.getSectionType = function(oSection) {
		var i, oFacet;
		var oEntityType = Utils.getODataEntityType(Utils.getComponent(oSection));
		var aFacets = oEntityType[FACETS];

		var sSectionId = oSection.getId();
		sSectionId = sSectionId.split("--")[1];
		if (sSectionId) {
			sSectionId = sSectionId.substring(0, sSectionId.lastIndexOf("::"));

			var iFacetIndex = DesigntimeUtils.getFacetIndexFromID(sSectionId, aFacets);
			if (iFacetIndex === undefined) {
				return;
			}

			oFacet = aFacets[iFacetIndex];
			if (oFacet.RecordType === COLLECTION_FACET) {
				var aNestedFacets = oFacet.Facets;
				var bFormsOnly, bTablesOnly, sCollectionType;

				for (i = 0; i < aNestedFacets.length; i++) {
					if (aNestedFacets[i].RecordType === COLLECTION_FACET) {
						// Logic for handling subsections to be added here.
						return;
					}
					if (aNestedFacets[i].Target.AnnotationPath.indexOf(FIELDGROUP) > -1 || aNestedFacets[i].Target.AnnotationPath.indexOf(
						IDENTIFICATION) > -1) {
						bFormsOnly = true;
					} else if (aNestedFacets[i].Target.AnnotationPath.indexOf(LINEITEM) > -1) {
						bTablesOnly = true;
					}
				}
				if (bFormsOnly && bTablesOnly) {
					sCollectionType = "invalid";
				} else {
					sCollectionType = bFormsOnly ? SECTIONTYPE_FORM : SECTIONTYPE_TABLE;
				}
				return sCollectionType;
			} else {
				if (oFacet.Target && (oFacet.Target.AnnotationPath.indexOf(FIELDGROUP) > -1 || oFacet.Target.AnnotationPath.indexOf(IDENTIFICATION) >
					-1)) {
					return SECTIONTYPE_FORM;
				}
				if (oFacet.Target && oFacet.Target.AnnotationPath.indexOf(LINEITEM) > -1) {
					return SECTIONTYPE_TABLE;
				}
				if (oFacet.Target && oFacet.Target.AnnotationPath.indexOf(CHART) > -1) {
					return SECTIONTYPE_CHART;
				}
				if (oFacet.Target && oFacet.Target.AnnotationPath.indexOf(CONTACT) > -1) {
					return SECTIONTYPE_CONTACT;
				}
				if (oFacet.Target && oFacet.Target.AnnotationPath.indexOf(ADDRESS) > -1) {
					return SECTIONTYPE_ADDRESS;
				}
			}
		}
	};

	/**
	 * Updates the value of the section type property for a given section by updating
	 * different annotations
	 *
	 * @param {object} oSection The section element (in overlay mode)
	 * @param {string} sValue The new value for the sectionType
	 * @param {object} oChange The UI Change (of Run-Time Adaptation)
	 *
	 * @returns{object} The change content, comprising old and new values of the sectionType
	 * @public
	 */
	SectionType.setSectionType = function(oSection, sValue, oChange) {
		var iFacetIndex,
			sRecordType,
			sOldValue = SectionType.getSectionType(oSection);

		oChange.noRefreshOnChange = true;
		oChange.delayRefresh = false;

		if (sOldValue === sValue) {
			return;
		}

		oChange.refreshPropertiesPane = true;

		switch (sValue) {

			case SECTIONTYPE_FORM:
				sRecordType = FIELDGROUP;
				break;
			case SECTIONTYPE_TABLE:
				sRecordType = LINEITEM;
				break;
			case SECTIONTYPE_CHART:
				sRecordType = CHART;
				break;
			case SECTIONTYPE_CONTACT:
				sRecordType = CONTACT;
				break;
			case SECTIONTYPE_ADDRESS:
				sRecordType = ADDRESS;
				break;
			default:
				break;
		}
		if (!sRecordType) {
			return;
		}

		var oEntityType = Utils.getODataEntityType(Utils.getComponent(oSection));
		var aOldFacets = oEntityType[FACETS];
		aOldFacets.splice();

		var sOldSectionId = oSection.getId().split("--")[1];
		sOldSectionId = sOldSectionId.substring(0, sOldSectionId.lastIndexOf("::"));

		iFacetIndex = DesigntimeUtils.getFacetIndexFromID(sOldSectionId, aOldFacets);

		if (iFacetIndex === undefined) {
			return;
		}

		var oOldSectionRecord = aOldFacets[iFacetIndex];
		var aNewFacets = [],
			aCustomChanges = [],
			oFieldGroup = {},
			sFieldGroupTerm;
		var sTarget = Utils.getEntityType(Utils.getComponent(oSection));

		aNewFacets.push.apply(aNewFacets, aOldFacets);
		if (sValue === SECTIONTYPE_FORM) {
			sFieldGroupTerm = Utils.createFieldGroupTerm(oEntityType);
			oFieldGroup[sFieldGroupTerm] = {
				"Data": [{
					"RecordType": DATAFIELD
				}],
				"RecordType": FIELDGROUP_TYPE
			};

		}
		var oNewSection = SectionType.createNewSection(oOldSectionRecord, sFieldGroupTerm);
		if (sValue === SECTIONTYPE_FORM && !(oNewSection.ID && oNewSection.ID.String)) {
			oNewSection.ID = {
				"String": sValue + iFacetIndex
			};
		}
		aNewFacets.splice(iFacetIndex, 1, oNewSection);

		var oFacetsChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, aNewFacets, aOldFacets, FACETS);
		var oFieldGroupChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oFieldGroup[sFieldGroupTerm], {},
			sFieldGroupTerm);
		aCustomChanges.push(oFacetsChange);
		aCustomChanges.push(oFieldGroupChange);
		return aCustomChanges;
	};

	return SectionType;

});
