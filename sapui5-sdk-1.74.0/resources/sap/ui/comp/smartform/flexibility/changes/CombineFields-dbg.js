/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/fl/changeHandler/Base",
	"sap/ui/comp/smartform/flexibility/changes/RenameField"
], function(
	Base,
	RenameField
) {
	"use strict";

	/**
	 * Change handler for combining smart form group elements (representing one or more fields).
	 *
	 * @alias sap.ui.comp.smartform.flexibility.changes.CombineFields
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental Since 1.46
	 */
	var CombineFields = { };

	CombineFields._evaluateElementForIndex = function(oModifier, aGroupElements) {
		var iMandatoryField = -1;
		var aSingleFields = [];

		var bMandatory = aGroupElements.some(function (oGroupElement) {
			aSingleFields = oModifier.getAggregation(oGroupElement, "fields");
			return aSingleFields.some(function (oSingleField) {
				iMandatoryField++;
				return oModifier.getProperty(oSingleField, "mandatory");
			});
		});

		if (bMandatory) {
			return iMandatoryField;
		}
		return -1;
	};

	/**
	 * Gets label property on a passed GroupElement.
	 * If this logic changes, also adapt the CombineFields change handler!
	 *
	 * @param {sap.ui.core.Control|Element} oControl Control that matches the change selector for reverting the change
	 * @param {sap.ui.core.util.reflection.BaseTreeModifier} oModifier - modifier for the controls
	 * @param {string} sPropertyName - Label property name
	 * @returns {string} sPrevious - Previously set value
	 * @private
	 */
	CombineFields._getPreviousLabelPropertyOnControl = function(oControl, oModifier, sPropertyName) {
		var vLabel = oModifier.getProperty(oControl, sPropertyName);

		if (vLabel && (typeof vLabel !== "string")) {
			sPropertyName = "text";
			oControl = vLabel;
		}

		var sPrevious = oModifier.getPropertyBindingOrProperty(oControl, sPropertyName);
		return sPrevious ? sPrevious : "$$Handled_Internally$$";
	};

	/**
	 * Combines content from other smart group elements into the selected group element
	 *
	 * @param {sap.ui.fl.Change} oChange change wrapper object with instructions to be applied on the control map
	 * @param {sap.ui.comp.smartform.SmartForm|Element} oControl smartform control that matches the change selector for applying the change
	 * @param {object} mPropertyBag - map of properties
	 * @param {sap.ui.core.util.reflection.BaseTreeModifier} mPropertyBag.modifier - modifier for the controls
	 * @param {sap.ui.core.UIComponent} mPropertyBag.appComponent - component in which the change should be applied
	 * @param {object} mPropertyBag.view - view object or xml element representing an ui5 view
	 * @return {boolean} true - if change could be applied
	 *
	 * @public
	 */
	CombineFields.applyChange = function(oChange, oControl, mPropertyBag) {
		var oChangeDefinition = oChange.getDefinition();
		var oModifier = mPropertyBag.modifier;
		var oAppComponent = mPropertyBag.appComponent;
		var oView =  mPropertyBag.view;
		var oSourceControl = oModifier.bySelector(oChangeDefinition.content.sourceSelector, oAppComponent, oView);
		var aLabelText = [];
		var sPreviousLabel;
		var oText;


		var aGroupElements = oChangeDefinition.content.combineFieldSelectors.map(function (oCombineFieldSelector) {
			return oModifier.bySelector(oCombineFieldSelector, oAppComponent, oView);
		});

		var mRevertData = this._collectRevertDataForElements(oModifier, aGroupElements, oAppComponent);

		var iMandatoryFieldIndex = this._evaluateElementForIndex(oModifier, aGroupElements);
		if (iMandatoryFieldIndex > 0) {
			oModifier.setProperty(oSourceControl, "elementForLabel", iMandatoryFieldIndex);
		}
		var bIsRtl = sap.ui.getCore().getConfiguration().getRTL();

		aGroupElements.forEach(function(oGroupElement, i){
			var oParent;
			var aSingleFields = [];

			var sLabel = "fieldLabel" + i.toString();
			oText = oChangeDefinition.texts[sLabel];
			if (oText && oText.value !== sPreviousLabel && oText.value.length > 0) {
				bIsRtl ? aLabelText.unshift(oText.value) : aLabelText.push(oText.value);
				sPreviousLabel = oText.value;
			}

			aSingleFields = oModifier.getAggregation(aGroupElements[i], "elements");

			if (aGroupElements[i] !== oSourceControl) {
				for (var k = 0, m = aSingleFields.length; k < m; k++) {
					oModifier.removeAggregation(aGroupElements[i], "elements", aSingleFields[k]);
					oModifier.insertAggregation(oSourceControl, "elements", aSingleFields[k], i + k, oView);
				}
				oParent = oModifier.getParent(aGroupElements[i]);
				oModifier.removeAggregation(oParent, "groupElements", aGroupElements[i]);
				// The removed GroupElement must be destroyed when the app is closed, therefore it must be
				// placed in another aggregation (the "dependents" aggregation is invisible)
				oModifier.insertAggregation(oParent, "dependents", aGroupElements[i], 0, oView);
			}
		});

		// This is effectively a rename on a GroupElement, so the logic has to be as complex as in the rename change handler
		// -> If this logic changes in the rename change handler, adapt here as well! (and vice-versa)
		RenameField.setLabelPropertyOnControl(oSourceControl, aLabelText.join("/"), oModifier, "label");

		oChange.setRevertData(mRevertData);
	};

	CombineFields._collectRevertDataForElements = function(oModifier, aGroupElements, oAppComponent){
		var mRevertData = {
			elementStates : []
		};

		var iFieldIndex = 0;
		var iLastFieldIndex = 0;

		aGroupElements.forEach(function(oElement) {
			var aSingleFields = oModifier.getAggregation(oElement, "elements");
			var oParent = oModifier.getParent(oElement);

			iLastFieldIndex = iFieldIndex + aSingleFields.length - 1;

			// Save the fields' indices because we can't ensure that they will have stable ids
			// GroupElement1 = fields 0 to 1; GroupElement2 = fields 2 to 3; etc...
			mRevertData.elementStates.push({
				groupElementSelector: oModifier.getSelector(oModifier.getId(oElement), oAppComponent),
				parentSelector : oModifier.getSelector(oModifier.getId(oParent), oAppComponent),
				groupElementIndex : oModifier.getAggregation(oParent, "groupElements").indexOf(oElement),
				firstFieldIndex : iFieldIndex,
				lastFieldIndex: iLastFieldIndex,
				label: this._getPreviousLabelPropertyOnControl(oElement, oModifier, "label"),
				elementForLabel: oModifier.getProperty(oElement, "elementForLabel")
			});

			iFieldIndex = iLastFieldIndex + 1;
		}.bind(this));

		return mRevertData;
	};

	/**
	 * Reverts applied change
	 *
	 * @param {sap.ui.fl.Change} oChange change wrapper object with instructions to be applied on the control map
	 * @param {sap.ui.comp.smartform.SmartForm} oSmartForm - SmartForm that matches the change selector for applying the change
	 * @param {object} mPropertyBag - Property bag containing the modifier and the view
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 * @param {object} mPropertyBag.view - application view
	 * @return {boolean} True if successful
	 * @public
	 */
	CombineFields.revertChange = function(oChange, oSmartForm, mPropertyBag){
		var mRevertData = oChange.getRevertData();
		var oModifier = mPropertyBag.modifier;
		var oAppComponent = mPropertyBag.appComponent;
		var aFields = [];

		mRevertData.elementStates.forEach(function(mElementState) {
			var oParent = mPropertyBag.modifier.bySelector(mElementState.parentSelector, oAppComponent);
			var oGroupElement = mPropertyBag.modifier.bySelector(mElementState.groupElementSelector, oAppComponent);
			if (oModifier.getAggregation(oParent, "groupElements").indexOf(oGroupElement) === -1) {
				// Removed group elements are placed in the "dependents" aggregation, so here they must be cleaned up
				oModifier.removeAggregation(oParent, "dependents", oGroupElement);
				oModifier.insertAggregation(oParent, "groupElements", oGroupElement, mElementState.groupElementIndex);
			} else {
				// Collect all fields and remove them from the combined groupelement
				aFields = oModifier.getAggregation(oGroupElement, "elements");
				oModifier.removeAllAggregation(oGroupElement, "elements");
			}
		});

		mRevertData.elementStates.forEach(function(mElementState) {
			var oGroupElement = mPropertyBag.modifier.bySelector(mElementState.groupElementSelector, oAppComponent);
			for (var i = mElementState.firstFieldIndex; i <= mElementState.lastFieldIndex; i++){
				// add the current field to the end of the aggregation
				oModifier.insertAggregation(oGroupElement, "elements", aFields[i], aFields.length);
			}
			// Label handling - if originally the label was set by a smartfield, this has to be the case after the revert as well
			// -> Set the label property to "undefined" + set the proper elementForLabel = SmartField will set the label
			var sPreviousLabel = mElementState.label;
			if (sPreviousLabel === "$$Handled_Internally$$") {
				sPreviousLabel = undefined;
				var oElementForLabel = oModifier.getAggregation(oGroupElement, "fields")[mElementState.elementForLabel];
				oModifier.setProperty(oElementForLabel, "textLabel", undefined);
			}
			oModifier.setProperty(oGroupElement, "elementForLabel", mElementState.elementForLabel);
			RenameField.setLabelPropertyOnControl(oGroupElement, sPreviousLabel, oModifier, "label");
		});

		oChange.resetRevertData();
	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {sap.ui.fl.Change} oChange change wrapper object to be completed
	 * @param {object} oSpecificChangeInfo - specific info object
	 * @param {object} oSpecificChangeInfo.combineElementIds ids of selected fields
	 *                                                     to be combined
	 * @param {object} mPropertyBag - map of properties
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 *
	 * @public
	 */
	CombineFields.completeChangeContent = function(oChange, oSpecificChangeInfo, mPropertyBag) {
		var oModifier = mPropertyBag.modifier;
		var oView = mPropertyBag.view;
		var oAppComponent = mPropertyBag.appComponent;
		var oChangeDefinition = oChange.getDefinition();

		var aCombineFieldIds = oSpecificChangeInfo.combineElementIds;
		if (aCombineFieldIds && aCombineFieldIds.length >= 2) {
			oChangeDefinition.content.combineFieldSelectors = aCombineFieldIds.map(function(sCombineFieldId) {
				return oModifier.getSelector(sCombineFieldId, oAppComponent);
			});
			oChange.addDependentControl(aCombineFieldIds, "combinedFields", mPropertyBag);
		} else {
			throw new Error("oSpecificChangeInfo.combineElementIds attribute required");
		}

		if (oSpecificChangeInfo.sourceControlId) {
			oChangeDefinition.content.sourceSelector = oModifier.getSelector(oSpecificChangeInfo.sourceControlId, oAppComponent);
			oChange.addDependentControl(oSpecificChangeInfo.sourceControlId, "sourceControl", mPropertyBag);
		} else {
			throw new Error("oSpecificChangeInfo.sourceControlId attribute required");
		}

		var sText;
		var sFieldLabel;
		var oGroupElement;
		for (var i = 0; i < oChangeDefinition.content.combineFieldSelectors.length; i++) {
			var mSelector = oChangeDefinition.content.combineFieldSelectors[i];
			oGroupElement = oModifier.bySelector(mSelector, oAppComponent, oView);
			sText = oGroupElement.getLabelText();
			if (sText) {
				sFieldLabel = "fieldLabel" + i;
				Base.setTextInChange(oChangeDefinition, sFieldLabel, sText, "XFLD");
			}
		}
	};

	return CombineFields;
},
/* bExport= */true);
