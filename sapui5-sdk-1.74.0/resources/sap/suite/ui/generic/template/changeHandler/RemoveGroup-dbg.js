/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

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
	 * Change handler for removing a field group.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.RemoveGroup
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var RemoveGroup = {};
	var sRemovedElementId, oGroup;
	var FACETS = "com.sap.vocabularies.UI.v1.Facets";
	var FIELDGROUP = "com.sap.vocabularies.UI.v1.FieldGroup";
	var IDENTIFICATION = "com.sap.vocabularies.UI.v1.Identification";

	RemoveGroup.applyChange = function (oChange, oControl, mPropertyBag) {
		var oForm = mPropertyBag.modifier.getParent(oGroup);
		mPropertyBag.modifier.removeAggregation(oForm,"formContainers",oGroup);
	};

	RemoveGroup.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	RemoveGroup.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		sRemovedElementId = oSpecificChangeInfo.removedElement.id;
		oGroup = mPropertyBag.modifier.bySelector(sRemovedElementId, mPropertyBag.appComponent);
		var sEntityType = Utils.getODataEntitySet(Utils.getComponent(oGroup)).entityType;
		var aFacets = AnnotationChangeUtils.getExistingAnnotationsOfEntityType(oGroup, FACETS);
		var aOldFacets = JSON.parse(JSON.stringify(aFacets));

		// sGroupId corresponds to the ID/ AnnotationPath of the ReferenceFacet of the corresponding Group in SmartForm.
		var sGroupId = (sRemovedElementId.split("--")[1]);
		sGroupId = sGroupId.substring(0, sGroupId.lastIndexOf("::"));
		if (sGroupId.indexOf(FIELDGROUP) === 0 || sGroupId.indexOf(IDENTIFICATION) === 0) {
			sGroupId = "@" + sGroupId.replace("::", "#");
		} else {
			sGroupId = sGroupId.replace("::", "/@").replace("::", "#");
		}
		var oGroupInfo = Utils.getSmartFormGroupInfo(sGroupId, aFacets);

		if (oGroupInfo && oGroupInfo.oGroup && oGroupInfo.aForm) {
			oGroupInfo.aForm.splice(oGroupInfo.aForm.indexOf(oGroupInfo.oGroup), 1);
			var oTermChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aFacets, aOldFacets, FACETS);
			var mContent = AnnotationChangeUtils.createCustomChanges(oTermChange);
			deepExtend(oChange.getContent(), mContent);
		}
	};

	return RemoveGroup;
},
/* bExport= */true);
