/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define(["sap/ui/fl/changeHandler/BaseRename", "sap/base/Log"], function(BaseRename, Log) {
	"use strict";

	var PROPERTY_NAME = "label";
	var CHANGE_PROPERTY_NAME = "groupLabel";
	var TT_TYPE = "XFLD";

	/**
	 * Change handler for renaming a SmartForm group.
	 * @constructor
	 * @alias sap.ui.fl.changeHandler.RenameGroup
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental Since 1.27.0
	 */
	var RenameGroup = BaseRename.createRenameChangeHandler({
		propertyName : PROPERTY_NAME,
		changePropertyName : CHANGE_PROPERTY_NAME,
		translationTextType : TT_TYPE
	});

	/**
	 * Renames a Group.
	 *
	 * @param {sap.ui.fl.Change} oChange change wrapper object with instructions to be applied on the control map
	 * @param {sap.ui.core.Control|Element} oControl Control that matches the change selector for applying the change
	 * @param {object} mPropertyBag property bag
	 * @param {sap.ui.core.util.reflection.BaseTreeModifier} mPropertyBag.modifier - modifier for the controls
	 * @param {sap.ui.core.UIComponent} mPropertyBag.appComponent - component in which the change should be applied
	 * @param {object} mPropertyBag.view - view object or xml element representing an ui5 view
	 * @returns {boolean} true if successful
	 * @public
	 */
	RenameGroup.applyChange = function(oChange, oControl, mPropertyBag) {
		var oChangeDefinition = oChange.getDefinition();
		var sText = oChangeDefinition.texts[CHANGE_PROPERTY_NAME];
		var sValue = sText.value;

		if (oChangeDefinition.texts && sText && typeof (sValue) === "string") {
			var vOldValue = this.setLabelOrTitleOnControl(oControl, sValue, mPropertyBag.modifier, PROPERTY_NAME);
			oChange.setRevertData(vOldValue);
			return true;
		} else {
			Log.error("Change does not contain sufficient information to be applied: [" + oChangeDefinition.layer + "]" + oChangeDefinition.namespace + "/" + oChangeDefinition.fileName + "." + oChangeDefinition.fileType);
		}
	};

	/**
	 * Reverts a rename change on a Group.
	 *
	 * @param {sap.ui.fl.Change} oChange change wrapper object applied on the control
	 * @param {sap.ui.core.Control|Element} oControl Control that matches the change selector for reverting the change
	 * @param {object} mPropertyBag property bag
	 * @param {sap.ui.core.util.reflection.BaseTreeModifier} mPropertyBag.modifier - modifier for the controls
	 * @param {sap.ui.core.UIComponent} mPropertyBag.appComponent - component in which the change should be reverted
	 * @param {object} mPropertyBag.view - view object or xml element representing an ui5 view
	 * @returns {boolean} true if successful
	 * @public
	 */
	RenameGroup.revertChange = function(oChange, oControl, mPropertyBag) {
		var vOldValue = oChange.getRevertData();
		if (vOldValue || vOldValue === "") {
			this.setLabelOrTitleOnControl(oControl, vOldValue, mPropertyBag.modifier, PROPERTY_NAME);
			oChange.resetRevertData();
			return true;
		} else {
			Log.error("Change doesn't contain sufficient information to be reverted. Most Likely the Change didn't go through applyChange.");
		}
	};

	RenameGroup.setLabelOrTitleOnControl = function(oControl, sValue, oModifier, sPropertyName) {
		var sLabel = oModifier.getProperty(oControl, sPropertyName);
		var vTitle = oModifier.getAggregation(oControl, "title");

		if (!sLabel && vTitle) {
			if (typeof vTitle === "string") {
				sPropertyName = "title";
			} else {
				// label can also be a Title
				sPropertyName = "text";
				oControl = vTitle;
			}
		}

		var vOldValue = oModifier.getPropertyBindingOrProperty(oControl, sPropertyName);
		oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, sValue);
		return vOldValue;
	};
	return RenameGroup;
},
/* bExport= */true);