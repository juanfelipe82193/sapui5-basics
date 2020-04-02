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
	 * Change handler for revealing a toolbar action.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.RevealToolbarActionButton
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */

	var RevealToolbarActionButton = {};

	var LINEITEM = "com.sap.vocabularies.UI.v1.LineItem";
	var DATAFIELDFORACTION = "com.sap.vocabularies.UI.v1.DataFieldForAction";
	var DATAFIELDFORINTENTBASEDNAVIGATION = "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
	var IMPORTANCE = "com.sap.vocabularies.UI.v1.Importance";
	var IMPORTANCEHIGH = "com.sap.vocabularies.UI.v1.ImportanceType/High";

	RevealToolbarActionButton.applyChange = function (oChange, oControl, mPropertyBag) {
		var oSelector = oChange.getContent().customChanges[0].oSelector;
		var oElement = mPropertyBag.modifier.bySelector(oSelector);
		// do whatever the original change does
		UnhideControl.applyChange(oChange, oElement, mPropertyBag);
	};

	RevealToolbarActionButton.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	RevealToolbarActionButton.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var sElementId = oSpecificChangeInfo.revealedElementId;
		var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag);

		// get path/property of removed button
		var oButton = mPropertyBag.modifier.bySelector(sElementId, mPropertyBag.appComponent);
		var oSelector = mPropertyBag.modifier.getSelector(sElementId, mPropertyBag.appComponent);
		var aButtons = oButton.getParent().getAggregation("content");
		var oComponent = Utils.getComponent(oButton);
		var sEntityType = Utils.getODataEntitySet(oComponent).entityType;
		var oEntityType = oMetaModel.getODataEntityType(sEntityType);
		var aLineItem = oEntityType[LINEITEM];
		var aLineItemOld = aLineItem.slice();

		// put the line item at the right position in the annotations (relevant only in case the button
		// is revealed on the original position, otherwise the right position can't be determined here,
		// but within the move that follows the reveal)
		var iIndex = -1;
		aButtons.some(function(oEntry, i) {
			if (oEntry.getId() && oEntry.getId() === sElementId) {
				iIndex = i;
				return true;
			}
		});

		var oCustomData = Utils.getCustomDataObject(oButton);
		if (oCustomData) {
			var lineItemTargetIndex = -1;
			if (oCustomData.Type === DATAFIELDFORACTION || oCustomData.Type === DATAFIELDFORINTENTBASEDNAVIGATION) {
				if (iIndex + 1 < aButtons.length) {
					iIndex++;
					lineItemTargetIndex = Utils.getLineItemRecordIndexForButton(aButtons[iIndex], aLineItem);
				} else {
					lineItemTargetIndex = aLineItem.length;
				}
			}
			if ((oCustomData.Type === DATAFIELDFORACTION
				|| oCustomData.Type === DATAFIELDFORINTENTBASEDNAVIGATION)
				&& lineItemTargetIndex < 0){
				lineItemTargetIndex = 0;
			}
		}

		// do whatever the original change does
		UnhideControl.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
		var mContent = {};
		if (lineItemTargetIndex >= 0) {
			var oLineItem = {
					Label: {
						String: oCustomData.Label
					},
					Action: {
						String: oCustomData.Action
					},
					RecordType: oCustomData.Type
			};
			oLineItem[IMPORTANCE] = {
					EnumMember: IMPORTANCEHIGH
			};
			aLineItem.splice(lineItemTargetIndex, 0, oLineItem);
			mContent = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aLineItem, aLineItemOld, LINEITEM);
		}
		mContent.revealedElementId = sElementId;
		mContent.oSelector = oSelector;
		var mChanges = AnnotationChangeUtils.createCustomChanges(mContent);
		deepExtend(oChange.getContent(), mChanges);

		Utils.isReveal = true;
	};

	return RevealToolbarActionButton;
},
/* bExport= */true);
