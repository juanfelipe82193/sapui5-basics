sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/base/util/deepExtend"
	], function(
	Utils,
	AnnotationChangeUtils,
	deepExtend
) {
	"use strict";

	/**
	 * Change handler for adding a section.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.AddSection **
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var AddSection = {};

	var COLLECTION_FACET = "com.sap.vocabularies.UI.v1.CollectionFacet";
	var FACETS = "com.sap.vocabularies.UI.v1.Facets";
	var DATAFIELD = "com.sap.vocabularies.UI.v1.DataField";
	var FIELDGROUP_TYPE = "com.sap.vocabularies.UI.v1.FieldGroupType";
	var REFERENCE_FACET = "com.sap.vocabularies.UI.v1.ReferenceFacet";

	AddSection.applyChange = function (oChange, oControl, mPropertyBag) {
		//write apply change logic
	};

	AddSection.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	AddSection.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var iSelectedSectionIndex, iNewSectionAnnotationIndex;
		var oPageLayout = mPropertyBag.modifier.bySelector(oSpecificChangeInfo.parentId, mPropertyBag.appComponent);
		var aUiSections = oPageLayout.getSections();
		var aFacets = AnnotationChangeUtils.getExistingAnnotationsOfEntityType(oPageLayout, FACETS);
		if (aUiSections.length === oSpecificChangeInfo.index) {
			iNewSectionAnnotationIndex = aFacets.length;
		} else if (oSpecificChangeInfo.index === 0) {
			// Add action at parent (ObjectPageLayout) container
			iNewSectionAnnotationIndex = 0;
		} else {
			iSelectedSectionIndex = Utils.getIndexFromInstanceMetadataPath(aUiSections[oSpecificChangeInfo.index - 1]);
			iNewSectionAnnotationIndex = iSelectedSectionIndex + 1;
		}
		var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag);
		var aOldFacets = aFacets.slice();

		var sEntityType = Utils.getODataEntitySet(Utils.getComponent(oPageLayout)).entityType;
		var oEntityType = oMetaModel.getODataEntityType(sEntityType);
		var sFieldGroupTerm = Utils.createFieldGroupTerm(oEntityType);
		var oFieldGroup = {};
		oFieldGroup[sFieldGroupTerm] = {
			"Data": [
			{
				"Label": {
					"String": "New Field"
				},
				"Value": {
					"Path": ""
				},
				"RecordType": DATAFIELD
			}
				],
			"RecordType": FIELDGROUP_TYPE
		};

		var oNewReferenceFacet = {
			"Label": {
				"String": "New Group"
				},
			"Target": {
				"AnnotationPath": "@" + sFieldGroupTerm
				},
			"RecordType": REFERENCE_FACET
		};

		var oNewCollectionFacet = {
			"Label": {
				"String": "New Section"
			},
			"ID": {
				"String":oSpecificChangeInfo.newControlId.split("--")[1]
			},
			"Facets":[oNewReferenceFacet],
			"RecordType": COLLECTION_FACET
		};

		aFacets.splice(iNewSectionAnnotationIndex, 0, oNewCollectionFacet);

		var mContent = {
			customChanges: []
		};

		var oFacetsTermChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aFacets, aOldFacets, FACETS);
		var oFieldGroupTermChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, oFieldGroup[sFieldGroupTerm], {}, sFieldGroupTerm);
		mContent.customChanges.push(oFacetsTermChange);
		mContent.customChanges.push(oFieldGroupTermChange);
		deepExtend(oChange.getContent(), mContent);
	};

	return AddSection;
},
/* bExport= */true);
