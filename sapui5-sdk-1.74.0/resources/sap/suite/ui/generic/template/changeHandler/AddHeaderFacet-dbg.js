/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/generic/AddElement",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/base/util/deepExtend"
], function(
	Utils,
	AddElement,
	AnnotationChangeUtils,
	deepExtend
) {
	"use strict";

	/**
	 * Change handler for adding a header facet.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.AddHeaderFacet
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var AddHeaderFacet = {};
	var HEADER_FACETS = "com.sap.vocabularies.UI.v1.HeaderFacets";
	var DATAFIELD = "com.sap.vocabularies.UI.v1.DataField";
	var FIELDGROUP_TYPE = "com.sap.vocabularies.UI.v1.FieldGroupType";
	var REFERENCE_FACET = "com.sap.vocabularies.UI.v1.ReferenceFacet";

	AddHeaderFacet.applyChange = function (oChange, oControl, mPropertyBag) {
	};

	AddHeaderFacet.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	AddHeaderFacet.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var oHeader = mPropertyBag.modifier.bySelector(oSpecificChangeInfo.parentId, mPropertyBag.appComponent);
		var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag);
		var sEntityType = Utils.getODataEntitySet(Utils.getComponent(oHeader)).entityType;
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
				"String": "New Header Facet"
				},
			"Target": {
				"AnnotationPath": "@" + sFieldGroupTerm
				},
			"RecordType": REFERENCE_FACET
		};
		var fnAddHeaderFacet = function (oHeader, aAnnotations) {
			var aAnnotationsOld = [], aUiHeaderFacets, iAnnotationIndex;
			aAnnotationsOld = JSON.parse(JSON.stringify(aAnnotations));
			var iUiIndex = oSpecificChangeInfo.index - 1;	// Index passed in oSpecificInfo is one greater than the actual UI index of the facet.

			aUiHeaderFacets = Utils.getUIHeaderFacets(oHeader);
			iAnnotationIndex = Utils.getHeaderFacetIndex(aUiHeaderFacets[iUiIndex], aAnnotations, aUiHeaderFacets, iUiIndex);

			aAnnotations.splice(iAnnotationIndex + 1, 0, oNewReferenceFacet);
			var mContent = {
				customChanges: []
			};
			var oHeaderFacetsTermChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aAnnotations, aAnnotationsOld, HEADER_FACETS);
			var oFieldGroupTermChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, oFieldGroup[sFieldGroupTerm], {}, sFieldGroupTerm);
			mContent.customChanges.push(oHeaderFacetsTermChange);
			mContent.customChanges.push(oFieldGroupTermChange);
			deepExtend(oChange.getContent(), mContent);
		};
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.annotation = HEADER_FACETS;
		oSpecificChangeInfo.custom.fnPerformSpecificAddAction = fnAddHeaderFacet;
		AddElement.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	return AddHeaderFacet;
},
/* bExport= */true);
