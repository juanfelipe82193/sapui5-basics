/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
*/
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/suite/ui/generic/template/lib/testableHelper",
	"sap/base/util/deepExtend"
], function(
	Utils,
	AnnotationChangeUtils,
	testableHelper,
	deepExtend
) {
	"use strict";

	/**
	 * Change handler for adding an element.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.AddElement
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var AddElement = {};
	var oElements = {
		SmartField : sap.ui.comp.smartfield.SmartField,
		GroupElement : sap.ui.comp.smartform.GroupElement,
		Group: sap.ui.comp.smartform.Group
	};

	/**
	 * Creates the element
	 *
	 * @param {object} [oControltoBeCreated] Map containing details about the control to be created
	 * @returns {object} Created element
	 * @private
	 */

	var fnCreateElement = function(oControlToBeCreated) {
		var oElement;
		if (oControlToBeCreated.hasOwnProperty("mSettings")) {
			oElement = new oElements[oControlToBeCreated.type](oControlToBeCreated.sId, oControlToBeCreated.mSettings);
		} else {
			oElement = new oElements[oControlToBeCreated.type](oControlToBeCreated.sId);
		}
		if (oControlToBeCreated.hasOwnProperty("fnTemplatingInfo")) {
			oControlToBeCreated.fnTemplatingInfo(oElement);
		}
		return oElement;
	};

	/**
	 * Adds the child element to the parent element
	 *
	 * @param {object} [oControltoBeCreated] Map containing details about the control to be created
	 * @param {object} [oRootElement] Root element is the parent of the element created from oControlsToBeAdded
	 * @returns {object} Parent element
	 * @private
	 */
	var fnAddElement = function(oControlsToBeAdded, oRootElement) {
		var oElement;
		if (!oControlsToBeAdded.oControl.oChild) {
			oElement = fnCreateElement(oControlsToBeAdded.oControl);
			return oElement;
		}
		oElement = fnAddElement(oControlsToBeAdded.oControl.oChild);
		var oParentElement = fnCreateElement(oControlsToBeAdded.oControl);
		var sInsertFunction = oControlsToBeAdded.oControl.oChild.oControl.insertFunction;
		var iTargetIndex = oControlsToBeAdded.oControl.oChild.oControl.iTargetIndex || 0;

		oParentElement[sInsertFunction](oElement, iTargetIndex);
		if (oRootElement) {
			sInsertFunction = oControlsToBeAdded.oControl.insertFunction;
			iTargetIndex = oControlsToBeAdded.oControl.iTargetIndex || 0;
			oRootElement[sInsertFunction](oParentElement, iTargetIndex);
			return oRootElement;
		}
		return oParentElement;
	};

	AddElement.applyChange = function (oChange, oControl, mPropertyBag, oControlsToBeAdded) {
		var oDefinition = oChange.getDefinition();
		if (!oDefinition.transferred && oControlsToBeAdded) {
			var oRootSelector = oChange.getContent().customChanges[0].oParentSelector;
			var oRootElement = mPropertyBag.modifier.bySelector(oRootSelector);
			fnAddElement(oControlsToBeAdded, oRootElement);
		}
	};

	AddElement.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var sOwningElementId = oSpecificChangeInfo.parentId || oSpecificChangeInfo.selector.id;
		var oOwningElement =  mPropertyBag.modifier.bySelector(sOwningElementId, mPropertyBag.appComponent);
		var oParentSelector = mPropertyBag.modifier.getSelector(sOwningElementId, mPropertyBag.appComponent);
		var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag);
		/**
		 *  get relevant element
		 *  example - smart filter bar: get control configuration element based on the added vertical layout (label/field)
		 */
		var oRelevantOwningElement = oSpecificChangeInfo.custom.fnGetRelevantElement ? oSpecificChangeInfo.custom.fnGetRelevantElement(oOwningElement) : oOwningElement;
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
		} else {
			// no instance-specific metadata exist => data comes from the calling change handler
			sEntityType = Utils.getEntityType(oRelevantOwningElement);
			oEntityType = oMetaModel.getODataEntityType(sEntityType);
			sAnnotation = oSpecificChangeInfo.custom.annotation;
			aAnnotations = oEntityType[sAnnotation];
		}
		aAnnotationsOld = JSON.parse(JSON.stringify(aAnnotations));

		if (oSpecificChangeInfo.custom.fnPerformSpecificAddAction) {
			// for special scenario like sub-sections
			oSpecificChangeInfo.custom.fnPerformSpecificAddAction(oOwningElement, aAnnotations);
		} else if (oSpecificChangeInfo.custom.fnGetAnnotationIndex) {
			var iAnnotationIndex = oSpecificChangeInfo.custom.fnGetAnnotationIndex(oOwningElement, aAnnotations);
			aAnnotations.splice(iAnnotationIndex, 0, oSpecificChangeInfo.custom.oAnnotationTermToBeAdded );
		} else {
			aAnnotations.splice(oSpecificChangeInfo.index, 0, oSpecificChangeInfo.custom.oAnnotationTermToBeAdded);
		}
		// do whatever the original change does (if concrete change handler is passed)
		if (oSpecificChangeInfo.custom.AddConcreteElement) {
			oSpecificChangeInfo.custom.AddConcreteElement.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
		}
		if (!oSpecificChangeInfo.custom.fnPerformSpecificAddAction) {
			var mContent = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aAnnotations, aAnnotationsOld, sAnnotation);
			mContent.parentId = oOwningElement.getId();
			mContent.oParentSelector = oParentSelector;
			var mChanges = AnnotationChangeUtils.createCustomChanges(mContent);
			deepExtend(oChange.getContent(), mChanges);
		}
	};
	fnAddElement = testableHelper.testableStatic(fnAddElement, "fnAddElement");
	fnCreateElement = testableHelper.testableStatic(fnCreateElement, "fnCreateElement");
	return AddElement;
},
/* bExport= */true);
