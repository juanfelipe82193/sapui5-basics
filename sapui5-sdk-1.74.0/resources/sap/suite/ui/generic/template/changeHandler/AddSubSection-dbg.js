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
	 * Change handler for Adding a subsection..
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.Add SubSection **
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var AddSubSection = {};

	AddSubSection.applyChange = function(oChange, oControl, mPropertyBag) {
	};

	AddSubSection.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	AddSubSection.completeChangeContent = function(oChange, oSpecificChangeInfo, mPropertyBag) {
		var sOwningElementId = oSpecificChangeInfo.parentId || oSpecificChangeInfo.selector.id;
		var oRelevantOwningElement =  mPropertyBag.modifier.bySelector(sOwningElementId, mPropertyBag.appComponent);
		var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag);
		var sEntityType = "";
		var oEntityType = {};
		var aAnnotations = [];
		var aAnnotationsOld = [];
		var sAnnotation = "";
		var oTemplData = Utils.getTemplatingInfo(oRelevantOwningElement);
		if (oTemplData && oTemplData.target && oTemplData.annotation) {
			sEntityType = oTemplData.target;
			oEntityType = oMetaModel.getODataEntityType(sEntityType);
			sAnnotation = oTemplData.annotation;
			aAnnotations = oEntityType[sAnnotation];
		}
		aAnnotationsOld = JSON.parse(JSON.stringify(aAnnotations));
		var sFieldGroupTerm =  Utils.fnAddSubSection(oRelevantOwningElement, aAnnotations, oSpecificChangeInfo.index);
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
					      "RecordType": "com.sap.vocabularies.UI.v1.DataField"
					    }
					  ],
					  "RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
					};
		var mContent = {
			customChanges: []
		};
		var oFacetsTermChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aAnnotations, aAnnotationsOld, sAnnotation);
		var oFieldGroupTermChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, oFieldGroup[sFieldGroupTerm], {}, sFieldGroupTerm);
		mContent.customChanges.push(oFacetsTermChange);
		mContent.customChanges.push(oFieldGroupTermChange);
		deepExtend(oChange.getContent(), mContent);
	};

	return AddSubSection;
},
/* bExport= */true);
