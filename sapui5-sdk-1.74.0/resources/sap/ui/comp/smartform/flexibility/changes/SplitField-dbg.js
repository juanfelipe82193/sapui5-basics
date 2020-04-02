/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([],
		function() {
	"use strict";

	/**
	 * Change handler for splitting smart form group elements (representing one or more fields).
	 *
	 * @alias sap.ui.comp.smartform.flexibility.changes.SplitField
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental Since 1.46
	 */
	var SplitField = {};

	/**
	 * Split a smart form group element incl. more value controls.
	 *
	 * @param {sap.ui.fl.Change} oChange Change wrapper object with instructions to be applied on the control map
	 * @param {sap.ui.comp.smartform.SmartForm|Element} oControl Smartform control that matches the change selector for applying the change
	 * @param {object} mPropertyBag - Map of properties
	 * @param {sap.ui.core.util.reflection.BaseTreeModifier} mPropertyBag.modifier - Modifier for the controls
	 * @param {sap.ui.core.UIComponent} mPropertyBag.appComponent - Component in which the change should be applied
	 * @param {object} mPropertyBag.view - View object or xml element representing an ui5 view
	 * @return {boolean} true - if change could be applied
	 *
	 * @public
	 */
	SplitField.applyChange = function(oChange, oControl, mPropertyBag) {
		var oChangeDefinition = oChange.getDefinition();
		var oModifier = mPropertyBag.modifier;
		var oAppComponent = mPropertyBag.appComponent;
		var oView = mPropertyBag.view;
		var oSourceControl = oModifier.bySelector(oChangeDefinition.content.sourceSelector, oAppComponent, oView);
		var sLabelText;
		var sNewId;
		var oNewGroupElement;
		var vLabel;
		var fnSortFields = function(a, b) {
			if (a.index > b.index) {
				return 1;
			} else if (a.index < b.index) {
				return -1;
			}
		};

		var oParent = oModifier.bySelector(oChangeDefinition.content.parentSelector, oAppComponent, oView);
		var aNewElementIds = oChangeDefinition.content.newElementIds.slice();
		var aFields = oModifier.getAggregation(oSourceControl, "elements");
		var iLabelElementIndex = oModifier.getProperty(oSourceControl, "elementForLabel");
		var aGroupElements = oModifier.getAggregation(oParent, "groupElements");
		var iControlIndex = aGroupElements.indexOf(oSourceControl);

		vLabel = oModifier.getProperty(oSourceControl, "label");
		if (vLabel && (typeof vLabel !== "string")){
			sLabelText = oModifier.getProperty(vLabel, "text");
		} else {
			sLabelText = vLabel;
		}

		var aSplittedFields = [];

		for (var i = 0, n = aFields.length; i < n; i++) {
			if (i !== iLabelElementIndex) {

				// create groupElement with new element ID
				sNewId = aNewElementIds.pop();
				oNewGroupElement = oModifier.createControl("sap.ui.comp.smartform.GroupElement",
					mPropertyBag.appComponent, oView, sNewId);

				// remove field from combined groupElement
				aSplittedFields.push({
					groupElementSelector: oModifier.getSelector(oNewGroupElement, oAppComponent),
					index: i
				});
				oModifier.removeAggregation(oSourceControl, "elements", aFields[i]);

				// insert field to groupElement
				oModifier.insertAggregation(oNewGroupElement, "elements", aFields[i], 0, oView);
				oModifier.insertAggregation(oParent, "groupElements", oNewGroupElement, iControlIndex + i, oView);

				// set label of groupElement
				vLabel = oModifier.getProperty(oNewGroupElement, "label");
				if (vLabel && (typeof vLabel !== "string")){
					oModifier.setProperty(vLabel, "text", sLabelText);
				} else {
					oModifier.setProperty(oNewGroupElement, "label", sLabelText);
				}
			} else {
				aSplittedFields.push({
					groupElementSelector: oModifier.getSelector(oSourceControl, oAppComponent),
					index: i
				});
				if (iLabelElementIndex !== 0) {
					oModifier.setProperty(oSourceControl, "elementForLabel", 0);
				}
				oModifier.removeAggregation(oSourceControl, "elements", aFields[i]);
				oModifier.insertAggregation(oSourceControl, "elements", aFields[i], 0, oView);

				// set label to combined groupElement
				vLabel = oModifier.getProperty(oSourceControl, "label");
				if (vLabel && (typeof vLabel !== "string")){
					oModifier.setProperty(vLabel, "text", sLabelText);
				} else {
					oModifier.setProperty(oSourceControl, "label", sLabelText);
				}

			}
		}
		oChange.setRevertData({
			sourceControlSelector: oChangeDefinition.content.sourceSelector,
			labelText: sLabelText,
			splittedFields: aSplittedFields.sort(fnSortFields)
		});

		return true;

	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {sap.ui.fl.Change} oChange change wrapper object to be completed
	 * @param {object} oSpecificChangeInfo - specific change info containing parentId
	 * @param {object} mPropertyBag - map of properties
	 *
	 * @public
	 */
	SplitField.completeChangeContent = function(oChange, oSpecificChangeInfo, mPropertyBag) {
		var oModifier = mPropertyBag.modifier;
		var oAppComponent = mPropertyBag.appComponent;
		var oChangeDefinition = oChange.getDefinition();

		if (oSpecificChangeInfo.newElementIds) {
			oChangeDefinition.content.newElementIds = oSpecificChangeInfo.newElementIds.slice(0, -1);
		} else {
			throw new Error("oSpecificChangeInfo.newElementIds attribute required");
		}

		if (oSpecificChangeInfo.sourceControlId) {
			oChangeDefinition.content.sourceSelector = oModifier.getSelector(oSpecificChangeInfo.sourceControlId, oAppComponent);
			oChange.addDependentControl(oSpecificChangeInfo.sourceControlId, "sourceControl", mPropertyBag);

		} else {
			throw new Error("oSpecificChangeInfo.sourceControlId attribute required");
		}

		if (oSpecificChangeInfo.parentId) {
			oChangeDefinition.content.parentSelector = oModifier.getSelector(oSpecificChangeInfo.parentId, oAppComponent);
			oChange.addDependentControl(oSpecificChangeInfo.parentId, "parent", mPropertyBag);
		} else {
			throw new Error("oSpecificChangeInfo.parentId attribute required");
		}
	};

	/**
	 * Reverts the applied change
	 *
	 * @param {sap.ui.fl.Change} oChange Change wrapper object with instructions to be applied to the control map
	 * @param {sap.ui.comp.smartform.SmartForm|Element} oControl Smartform control that matches the change selector for applying the change
	 * @param {object} mPropertyBag Property bag containing the modifier, the appComponent and the view
	 * @param {object} mPropertyBag.modifier Modifier for the controls
	 * @param {object} mPropertyBag.appComponent Component in which the change should be applied
	 * @param {object} mPropertyBag.view Application view
	 * @returns {boolean} True if successful
	 * @public
	 */
	SplitField.revertChange = function(oChange, oControl, mPropertyBag) {
		var oView = mPropertyBag.view;
		var oModifier = mPropertyBag.modifier;
		var oAppComponent = mPropertyBag.appComponent;
		var mRevertData = oChange.getRevertData();
		var aSplittedFields = mRevertData.splittedFields;
		var oSourceControl = oModifier.bySelector(mRevertData.sourceControlSelector, oAppComponent, oView);
		var oGroupElement,
			oField;

		for (var i = 0, n = aSplittedFields.length; i < n; i++) {
			oGroupElement = oModifier.bySelector(aSplittedFields[i].groupElementSelector, oAppComponent, oView);
			oField = oModifier.getAggregation(oGroupElement, "elements")[0];
			oModifier.removeAggregation(oGroupElement, "elements", oField);
			oModifier.insertAggregation(oSourceControl, "elements", oField, aSplittedFields[i].index, oView);
			if (oGroupElement !== oSourceControl) {
				oModifier.destroy(oGroupElement);
			}
		}
		var vLabel = oModifier.getProperty(oSourceControl, "label");
		if (vLabel && (typeof vLabel !== "string")){
			oModifier.setProperty(vLabel, "text", mRevertData.labelText);
		} else {
			oModifier.setProperty(oSourceControl, "label", mRevertData.labelText);
		}

		oChange.resetRevertData();

		return true;
	};

	return SplitField;
},
/* bExport= */true);
