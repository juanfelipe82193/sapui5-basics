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
	 * Change handler for adding a toolbar action.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.AddToolbarActionButton
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var AddToolbarActionButton = {};
	var LINEITEM = "com.sap.vocabularies.UI.v1.LineItem";
	var DATAFIELDFORACTION = "com.sap.vocabularies.UI.v1.DataFieldForAction";
	var IMPORTANCE = "com.sap.vocabularies.UI.v1.Importance";
	var IMPORTANCEHIGH = "com.sap.vocabularies.UI.v1.ImportanceType/High";

	AddToolbarActionButton.applyChange = function (oChange, oControl, mPropertyBag) {
		var oDefinition = oChange.getDefinition();
		if (!oDefinition.transferred) {
			var sParentElementId = oChange.getContent().customChanges[0].parentElementId;
			var oParentSelector = oChange.getContent().customChanges[0].oParentSelector;
			var oParentElement = mPropertyBag.modifier.bySelector(oParentSelector);
			var sNewFunctionImport = oChange.getContent().newFunctionImport;
			var sNewButtonId = "action::" + sNewFunctionImport.replace("/", "::");
			var sNewButtonIdPrefix = sParentElementId.substring(0, sParentElementId.lastIndexOf("--"));
			sNewButtonId = sNewButtonIdPrefix + sNewButtonId;
			var oNewButton = new sap.m.Button(sNewButtonId, {text: 'New Action'});
			oNewButton.addCustomData(new sap.ui.core.CustomData({
				"key": "Action",
				"value": sNewFunctionImport
			}));
			if (sParentElementId.indexOf("--template::ListReport::TableToolbar") > -1) {
				oParentElement.insertContent(oNewButton, oChange.getContent().customChanges[0].targetIndex);
			} else {
				oParentElement.getHeaderToolbar().insertContent(oNewButton, oChange.getContent().customChanges[0].targetIndex);
			}
		}
	};

	AddToolbarActionButton.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	AddToolbarActionButton.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag);
		var oSelectedElement = mPropertyBag.modifier.bySelector(oSpecificChangeInfo.selector.id, mPropertyBag.appComponent);
		var oParentElement = oSelectedElement.getParent();
		var oParentSelector = mPropertyBag.modifier.getSelector(oParentElement.getId(), mPropertyBag.appComponent);
		var oComponent = Utils.getComponent(oSelectedElement);
		var sEntityType = Utils.getODataEntitySet(oComponent).entityType;
		var oEntityType = oMetaModel.getODataEntityType(sEntityType);
		var aLineItem = oEntityType[LINEITEM];
		var aLineItemOld = aLineItem.slice();
		var aButtons = [];
		if (oSelectedElement.getParent().getId().indexOf("--template::ListReport::TableToolbar") > -1) {
			aButtons = oSelectedElement.getParent().getContent();
		} else {
			aButtons = oSelectedElement.getContent();
		}

		// put the line item at the right position in the annotations
		var iIndex = -1;
		aButtons.some(function(oEntry, i) {
			if (oEntry.getId && oEntry.getId() === oSpecificChangeInfo.selector.id) {
				iIndex = i;
				return true;
			}
		});
		var lineItemTargetIndex = -1;

		for (var i = iIndex + 1; i < aButtons.length; i++) {
			lineItemTargetIndex = Utils.getLineItemRecordIndexForButton(aButtons[i], aLineItem);
			if (lineItemTargetIndex >= 0) {
				break;
			}
		}
		if (lineItemTargetIndex === -1) {
			lineItemTargetIndex = aLineItem.length;
		}

		var oNewAction = {
				Label: {
					String: "My new Action"
				},
				Action: {
					String: oSpecificChangeInfo.content.newFunctionImport
				},
				RecordType: DATAFIELDFORACTION
		};
		oNewAction[IMPORTANCE] = {
				EnumMember: IMPORTANCEHIGH
		};
		aLineItem.splice(lineItemTargetIndex, 0, oNewAction);

		var mContent = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aLineItem, aLineItemOld, LINEITEM);
		mContent.targetIndex = iIndex + 1;
		mContent.parentElementId = oParentElement.getId();
		mContent.oParentSelector = oParentSelector;
		var mChanges = AnnotationChangeUtils.createCustomChanges(mContent);
		deepExtend(oChange.getContent(), mChanges);
	};
	return AddToolbarActionButton;
},
/* bExport= */true);
