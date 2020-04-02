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
	 * Change handler for adding a footer action button.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.AddFooterActionButton
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var AddFooterActionButton = {};
	var IDENTIFICATION = "com.sap.vocabularies.UI.v1.Identification";
	var DATAFIELDFORACTION = "com.sap.vocabularies.UI.v1.DataFieldForAction";

	AddFooterActionButton.applyChange = function (oChange, oControl, mPropertyBag) {
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
			if (sParentElementId.indexOf("--template::ObjectPage::FooterToolbar") > -1) {
				oParentElement.insertContent(oNewButton, oChange.getContent().customChanges[0].targetIndex);
			} else {
				oParentElement.getFooter().insertContent(oNewButton, oChange.getContent().customChanges[0].targetIndex);
			}
		}
	};

	AddFooterActionButton.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	AddFooterActionButton.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var oSelectedElement = mPropertyBag.modifier.bySelector(oSpecificChangeInfo.selector.id, mPropertyBag.appComponent);
		var oParentElement = oSelectedElement.getParent();
		var oParentSelector = mPropertyBag.modifier.getSelector(oParentElement.getId(), mPropertyBag.appComponent);
		var oComponent = Utils.getComponent(oSelectedElement);
		var oEntityType = Utils.getODataEntityType(oComponent);
		var sEntityType = oEntityType.entityType;
		var aIdentification = oEntityType[IDENTIFICATION];
		var aIdentificationOld = aIdentification.slice();
		var aButtons;

		if (oSelectedElement.getId().indexOf("::Determining") > -1) {
			aButtons = oSelectedElement.getParent().getContent();
		} else {
			aButtons = oSelectedElement.getContent();
		}

		var iIndex = -1;
		aButtons.some(function(oEntry, i) {
			if (oEntry.getId && oEntry.getId() === oSpecificChangeInfo.selector.id) {
				iIndex = i;
				return true;
			}
		});
		var iIdentificationTargetIndex = -1;

		iIdentificationTargetIndex = Utils.getIndexFromInstanceMetadataPath(aButtons[iIndex]);
		iIdentificationTargetIndex++;

		var oNewAction = {
				Label: {
					String: "My new Action"
				},
				Action: {
					String: oSpecificChangeInfo.content.newFunctionImport
				},
				RecordType: DATAFIELDFORACTION,
				Determining: {
					Bool: "true"
				}
		};

		aIdentification.splice(iIdentificationTargetIndex, 0, oNewAction);

		var mContent = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aIdentification, aIdentificationOld, IDENTIFICATION);
		mContent.targetIndex = iIndex + 1;
		mContent.parentElementId = oParentElement.getId();
		mContent.oParentSelector = oParentSelector;
		var mChanges = AnnotationChangeUtils.createCustomChanges(mContent);
		deepExtend(oChange.getContent(), mChanges);
	};
	return AddFooterActionButton;
},
/* bExport= */true);
