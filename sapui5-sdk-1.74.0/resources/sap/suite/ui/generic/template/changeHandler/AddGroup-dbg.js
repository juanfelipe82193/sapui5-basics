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
	 * Change handler for adding a field group.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.AddGroup
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var AddGroup = {};
	var FACETS = "com.sap.vocabularies.UI.v1.Facets";
	var DATAFIELD = "com.sap.vocabularies.UI.v1.DataField";
	var FIELDGROUP_TYPE = "com.sap.vocabularies.UI.v1.FieldGroupType";
	var REFERENCE_FACET = "com.sap.vocabularies.UI.v1.ReferenceFacet";

	AddGroup.applyChange = function (oChange, oControl, mPropertyBag) {
	};

	AddGroup.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	AddGroup.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var oSmartForm = sap.ui.getCore().byId(oSpecificChangeInfo.parentId);
		var sSmartFormId  = (oSpecificChangeInfo.parentId.split("--")[1]);
		sSmartFormId = sSmartFormId.substring(0, sSmartFormId.lastIndexOf("::")).replace("::","#");
		var aFacets = AnnotationChangeUtils.getExistingAnnotationsOfEntityType(oSmartForm, FACETS);

		var aOldFacets = JSON.parse(JSON.stringify(aFacets));
		var sEntityType = Utils.getODataEntitySet(Utils.getComponent(oSmartForm)).entityType;
		var oEntityType = Utils.getODataEntityType(oSmartForm);

		var sFieldGroupTerm = Utils.createFieldGroupTerm(oEntityType);

		var oCollectionFacet = Utils.getCollectionFacet(sSmartFormId, aFacets);
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
		if (oCollectionFacet && oCollectionFacet.Facets) {
			oCollectionFacet.Facets.splice(oSpecificChangeInfo.index, 0, oNewReferenceFacet);
			var mContent = {
				customChanges: []
			};
			var oFacetsTermChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aFacets, aOldFacets, FACETS);
			var oFieldGroupTermChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, oFieldGroup[sFieldGroupTerm], {}, sFieldGroupTerm);
			mContent.customChanges.push(oFacetsTermChange);
			mContent.customChanges.push(oFieldGroupTermChange);
			deepExtend(oChange.getContent(), mContent);
		}
	};

	return AddGroup;
},
/* bExport= */true);
