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
	 * Change handler for revealing a filter item.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.RevealFilterItem
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var RevealFilterItem = {};
	var SELECTIONFIELDS = "com.sap.vocabularies.UI.v1.SelectionFields";

	RevealFilterItem.applyChange = function (oChange, oControl, mPropertyBag) {
		var oParentSelector = oChange.getContent().customChanges[0].oParentSelector;
		var oElement = mPropertyBag.modifier.bySelector(oParentSelector);
		// do whatever the original change does
		UnhideControl.applyChange(oChange, oElement, mPropertyBag);
	};

	RevealFilterItem.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	RevealFilterItem.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var sElementId = oSpecificChangeInfo.revealedElementId;
		var oParentSelector = mPropertyBag.modifier.getSelector(sElementId, mPropertyBag.appComponent);
		var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag);
		// get path/property of removed button
		var oVerticalLayout = mPropertyBag.modifier.bySelector(sElementId, mPropertyBag.appComponent);
		var aVerticalLayouts = oVerticalLayout.getParent().getAggregation("content");
		var sEntityType = oVerticalLayout.getParent().getParent().getEntityType();
		var oEntityType = oMetaModel.getODataEntityType(sEntityType);
		var aSelectionFields = oEntityType[SELECTIONFIELDS];
		var aSelectionFieldsOld = aSelectionFields.slice();
		// put the selection field at the right position in the annotations (relevant only in case the button
		// is revealed on the original position, otherwise the right position can't be determined here,
		// but within the move that follows the reveal)
		var iIndex = -1;
		aVerticalLayouts.some(function(oEntry, i) {
			if (oEntry.getId() && oEntry.getId() === sElementId) {
				iIndex = i;
				return true;
			}
		});
		var selectionFieldTargetIndex = -1;
		var oTemplData = Utils.getTemplatingInfo(Utils.getSmartFilterBarControlConfiguration(oVerticalLayout));
		if (oTemplData.annotation === SELECTIONFIELDS) {
			if (iIndex + 1 < aVerticalLayouts.length) {
				iIndex++;
				selectionFieldTargetIndex = Utils.getRecordIndexForSelectionField(aVerticalLayouts[iIndex]);
			} else {
				selectionFieldTargetIndex = aSelectionFields.length;
			}
		}

		var mContent = {};
		if (oTemplData.annotation === SELECTIONFIELDS && selectionFieldTargetIndex < 0){
			selectionFieldTargetIndex = 0;
		}
		if (selectionFieldTargetIndex >= 0) {
			var oSelectionField = {
					PropertyPath: oTemplData.value
			};
			aSelectionFields.splice(selectionFieldTargetIndex, 0, oSelectionField);
			mContent = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aSelectionFields, aSelectionFieldsOld, SELECTIONFIELDS);
		}
		// do whatever the original change does
		UnhideControl.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
		mContent.revealedElementId = sElementId;
		mContent.oParentSelector = oParentSelector;
		var mChanges = AnnotationChangeUtils.createCustomChanges(mContent);
		deepExtend(oChange.getContent(), mChanges);
		Utils.isReveal = true;
	};
	return RevealFilterItem;
},
/* bExport= */true);
