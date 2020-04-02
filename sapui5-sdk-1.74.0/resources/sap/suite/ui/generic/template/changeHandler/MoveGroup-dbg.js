/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
		"sap/suite/ui/generic/template/changeHandler/generic/MoveElements",
		"sap/base/util/isEmptyObject"
	], function (
	Utils,
	AnnotationChangeUtils,
	MoveElements,
	isEmptyObject
	) {
		"use strict";

		/**
		 * Change handler for moving a field group.
		 *
		 * @alias sap.suite.ui.generic.template.changeHandler.MoveGroup
		 * @author SAP SE
		 * @version 1.74.0
		 * @experimental
		 */
		var MoveGroup = {},
			FACETS = "com.sap.vocabularies.UI.v1.Facets",
			FIELDGROUP = "com.sap.vocabularies.UI.v1.FieldGroup",
			IDENTIFICATION = "com.sap.vocabularies.UI.v1.Identification";

		MoveGroup.applyChange = function (oChange, oControl, mPropertyBag) {
			if (!isEmptyObject(oChange.getContent().movedElements)) {
				MoveElements.applyChange(oChange, oControl, mPropertyBag);
			}
		};

		MoveGroup.revertChange = function (oChange, oControl, mPropertyBag) {
			//write revert change logic
		};

		MoveGroup.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
			var sMovedElementId = oSpecificChangeInfo.movedElements[0].id,
				sGroupId = sMovedElementId.split("--")[1];
			sGroupId = sGroupId.substring(0, sGroupId.lastIndexOf("::"));
			if (sGroupId.indexOf(FIELDGROUP) === 0 || sGroupId.indexOf(IDENTIFICATION) === 0) {
				sGroupId = "@" + sGroupId.replace("::", "#");
			} else {
				sGroupId = sGroupId.replace("::", "/@").replace("::", "#");
			}
			var oGroup = mPropertyBag.modifier.bySelector(sMovedElementId, mPropertyBag.appComponent),
				aFacets = AnnotationChangeUtils.getExistingAnnotationsOfEntityType(oGroup, FACETS),
				oGroupInfo = Utils.getSmartFormGroupInfo(sGroupId, aFacets);
			oSpecificChangeInfo.custom = {};
			oSpecificChangeInfo.custom.fieldGroup = FIELDGROUP;
			oSpecificChangeInfo.custom.identification = IDENTIFICATION;
			oSpecificChangeInfo.custom.annotation = FACETS;
			oSpecificChangeInfo.custom.elements = oGroupInfo.aForm;
			oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getIndexFromInstanceMetadataPath;
			MoveElements.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
		};

		return MoveGroup;
	},
	/* bExport= */true);
