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
	 * Change handler for adding a header action button.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.AddHeaderActionButton
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var AddHeaderActionButton = {};
	var IDENTIFICATION = "com.sap.vocabularies.UI.v1.Identification";
	var DATAFIELDFORACTION = "com.sap.vocabularies.UI.v1.DataFieldForAction";
	var IMPORTANCE = "com.sap.vocabularies.UI.v1.Importance";
	var IMPORTANCEHIGH = "com.sap.vocabularies.UI.v1.ImportanceType/High";

	AddHeaderActionButton.applyChange = function (oChange, oControl, mPropertyBag) {
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
			if (sParentElementId.indexOf("objectPageHeader") > -1 || sParentElementId.indexOf("--template::ObjectPage::ObjectPageHeader") > -1) {
				oParentElement.insertAction(oNewButton, oChange.getContent().customChanges[0].targetIndex);
			} else {
				oParentElement = oParentElement.getHeaderTitle();
				oParentElement.insertAction(oNewButton, oChange.getContent().customChanges[0].targetIndex);
			}
		}
	};

	AddHeaderActionButton.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	AddHeaderActionButton.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		// have to change the variable name
		var oSelectedElement = mPropertyBag.modifier.bySelector(oSpecificChangeInfo.selector.id, mPropertyBag.appComponent);
		var oParentElement = oSelectedElement.getParent();
		var oParentSelector = mPropertyBag.modifier.getSelector(oParentElement.getId(), mPropertyBag.appComponent);
		var oComponent = Utils.getComponent(oSelectedElement);
		var oEntityType = Utils.getODataEntityType(oComponent);
		var sEntityType = oEntityType.entityType;
		var aIdentification = oEntityType[IDENTIFICATION];
		var aIdentificationOld = aIdentification.slice();
		var aButtons = [];

		if (oSelectedElement.getParent().getId().indexOf("--objectPageHeader") > -1 || oSelectedElement.getParent().getId().indexOf("--template::ObjectPage::ObjectPageHeader") > -1 ) {
			aButtons = oSelectedElement.getParent().getActions();
		} else {
			aButtons = oSelectedElement.getActions();
		}

		//put the button at the right position in the annotations
		var iIndex = -1, iEditIndex = -1, iDeleteIndex = -1, iRelatedAppsIndex = -1;
		aButtons.some(function(oEntry, i) {
			if (oEntry.getId && oEntry.getId() === oSpecificChangeInfo.selector.id) {
				iIndex = i;
			}
			if (oEntry.getId && oEntry.getId().indexOf("--edit") > 0) {
				iEditIndex = i;
			}
			if (oEntry.getId && oEntry.getId().indexOf("--delete") > 0) {
				iDeleteIndex = i;
			}
			if (oEntry.getId && oEntry.getId().indexOf("--relatedApps") > 0) {
				iRelatedAppsIndex = i;
				if (iIndex > 0) {
					return true;
				}
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
				RecordType: DATAFIELDFORACTION
		};

		if (iIndex < (iEditIndex || iDeleteIndex || iRelatedAppsIndex)) {
			oNewAction[IMPORTANCE] = {
				EnumMember: IMPORTANCEHIGH
			};
		}

		aIdentification.splice(iIdentificationTargetIndex, 0, oNewAction);

		var mContent = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aIdentification, aIdentificationOld, IDENTIFICATION);
		mContent.targetIndex = iIndex + 1;
		mContent.parentElementId = oParentElement.getId();
		mContent.oParentSelector = oParentSelector;
		var mChanges = AnnotationChangeUtils.createCustomChanges(mContent);
		deepExtend(oChange.getContent(), mChanges);
	};
	return AddHeaderActionButton;
},
/* bExport= */true);
