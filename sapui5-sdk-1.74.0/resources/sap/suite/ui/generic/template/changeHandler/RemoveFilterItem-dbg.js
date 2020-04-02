/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/generic/RemoveElement",
	"sap/ui/fl/changeHandler/HideControl"
], function(
	Utils,
	RemoveElement,
	HideControl
) {
	"use strict";
	/**
	 * Change handler for removing a filter item.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.RemoveFilterItem
	 * @author SAP SE
	 * @version 1.74.0
	 */

	var RemoveFilterItem = {};

	RemoveFilterItem.applyChange = function (oChange, oControl, mPropertyBag) {
		var oSelector = oChange.getContent().customChanges[0].oSelector;
		//get the parent element
		var oElement = mPropertyBag.modifier.bySelector(oSelector).getParent();
		if (oElement) {
			//destroy the element
			oElement.destroy();
		}
	};

	RemoveFilterItem.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	RemoveFilterItem.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.fnGetRelevantElement = Utils.getSmartFilterBarControlConfiguration;
		oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getRecordIndexForSelectionField;
		oSpecificChangeInfo.custom.fnGetElementSelector = Utils.getRemoveElementSelector;
		RemoveElement.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	return RemoveFilterItem;
},
/* bExport= */true);
