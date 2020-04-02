/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
*/
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/ui/fl/changeHandler/UnhideControl",
	"sap/base/util/deepExtend"
], function(
	Utils,
	AnnotationChangeUtils,
	UnhideControl,
	deepExtend
) {
	"use strict";

	/**
	 * Change handler for revealing an element.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.RevealElements
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var RevealElement = {};

	RevealElement.applyChange = function (oChange, oControl, mPropertyBag) {
		var oSelector = oChange.getContent().customChanges[0].oSelector;
		var oElement = mPropertyBag.modifier.bySelector(oSelector);
		// do whatever the original change does
		UnhideControl.applyChange(oChange, oElement, mPropertyBag);
	};

	RevealElement.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var sRevealedElementId = oSpecificChangeInfo.revealedElementId;
		var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag);
		var oRevealedElement = mPropertyBag.modifier.bySelector(sRevealedElementId, mPropertyBag.appComponent);
		var oSelector = mPropertyBag.modifier.getSelector(sRevealedElementId, mPropertyBag.appComponent);
		var aParentAggregationElements = oRevealedElement.getParent().getAggregation(oRevealedElement.sParentAggregationName);
		/**
		 *  get relevant element
		 *  example - smart filter bar: get control configuration element based on the removed vertical layout (label/field)
		 */
		var oRelevantRevealedElement = oSpecificChangeInfo.custom.fnGetRelevantElement ? oSpecificChangeInfo.custom.fnGetRelevantElement(oRevealedElement) : oRevealedElement;
		var sEntityType = "";
		var oEntityType = {};
		var aAnnotations = [];
		var aAnnotationsOld = [];
		var sAnnotation = "";
		var oTemplData = Utils.getTemplatingInfo(oRelevantRevealedElement);
		if (oTemplData && oTemplData.target && oTemplData.annotation) {
			sEntityType = oTemplData.target;
			oEntityType = oMetaModel.getODataEntityType(sEntityType);
			sAnnotation = oTemplData.annotation;
			aAnnotations = oEntityType[sAnnotation];
		} else {
			// no instance-specific metadata exist => data comes from the calling change handler
			sEntityType = Utils.getEntityType(oRelevantRevealedElement);
			oEntityType = oMetaModel.getODataEntityType(sEntityType);
			sAnnotation = oSpecificChangeInfo.custom.annotation;
			aAnnotations = oEntityType[sAnnotation];
		}
		aAnnotationsOld = aAnnotations.slice();

		// put the element on the right position in the annotations (relevant only in case the element
		// is revealed on the original position, otherwise the right position can't be determined here,
		// but within the move that follows the reveal)
		var i, iIndex = -1;
		for (i = 0; i < aParentAggregationElements.length; i++) {
			if (aParentAggregationElements[i].getId() && aParentAggregationElements[i].getId() === sRevealedElementId) {
				iIndex = i ;
				break;
			}
		}
		var iAnnotationTargetIndex = -1;
		if (iIndex + 1 < aParentAggregationElements.length) {
			iIndex++;
			iAnnotationTargetIndex = oSpecificChangeInfo.custom.fnGetAnnotationIndex(aParentAggregationElements[iIndex], aAnnotations);
		} else {
			iAnnotationTargetIndex = aAnnotations.length;
		}

		if (iAnnotationTargetIndex < 0) {
			iAnnotationTargetIndex = 0;
		}
		// add annotations
		if (oSpecificChangeInfo.custom.oRevealedAnnotationTerm) {
			aAnnotations.splice(iAnnotationTargetIndex, 0, oSpecificChangeInfo.custom.oRevealedAnnotationTerm);
			// do whatever the original change does
			UnhideControl.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);

			var mContent = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aAnnotations, aAnnotationsOld, sAnnotation);
			mContent.revealedElementId = sRevealedElementId;
			mContent.oSelector = oSelector;
			var mChanges = AnnotationChangeUtils.createCustomChanges(mContent);

			deepExtend(oChange.getContent(), mChanges);
		}

		Utils.isReveal = true;
	};

	return RevealElement;
},
/* bExport= */true);
