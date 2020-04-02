/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/base/Log",
	"sap/ui/fl/changeHandler/Base",
	"sap/ui/core/util/reflection/JsControlTreeModifier"
], function(Log, Base, JsControlTreeModifier) {
	"use strict";

	/**
	 * Change handler for adding a smart form group element (representing one or more fields).
	 *
	 * @alias sap.ui.fl.changeHandler.AddFields
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental Since 1.33.0
	 */
	var AddFields = {};

	/**
	 * Adds a smart form group element incl. one or more value controls
	 *
	 * @param {sap.ui.fl.Change} oChange Change wrapper object with instructions to be applied to the control map
	 * @param {sap.ui.comp.smartform.Group|Element} oGroup Group control or xml element that matches the change selector for applying the change
	 * @param {object} mPropertyBag - Property bag
	 * @param {sap.ui.core.util.reflection.BaseTreeModifier} mPropertyBag.modifier - Modifier for the controls
	 * @param {sap.ui.core.UIComponent} mPropertyBag.appComponent - Component in which the change should be applied
	 * @param {object} mPropertyBag.view - View object or xml element representing an ui5 view
	 * @return {boolean} True if successfully added
	 * @public
	 */
	AddFields.applyChange = function(oChange, oGroup, mPropertyBag) {
		var oChangeDefinition = oChange.getDefinition();
		var fnCheckChangeDefinition = function(oChangeDefinition) {
			var bContentPresent = oChangeDefinition.content;
			var bMandatoryContentPresent = false;

			if (bContentPresent) {
				bMandatoryContentPresent = oChangeDefinition.content.field && (oChangeDefinition.content.field.selector || oChangeDefinition.content.field.id) &&
					oChangeDefinition.content.field.jsTypes && oChangeDefinition.content.field.value && oChangeDefinition.content.field.valueProperty;
			}

			return  bContentPresent && bMandatoryContentPresent;
		};

		var oModifier = mPropertyBag.modifier;
		var oAppComponent = mPropertyBag.appComponent;
		var oView = mPropertyBag.view;
		if (fnCheckChangeDefinition(oChangeDefinition)) {

			var oFieldSelector = oChangeDefinition.content.field.selector;
			var sFieldId = oChangeDefinition.content.field.id;

			var insertIndex = oChangeDefinition.content.field.index;
			var oGroupElement;
			if (oModifier.bySelector(oFieldSelector || sFieldId, oAppComponent, oView)) {
				return Base.markAsNotApplicable("Control to be created already exists:" + oFieldSelector || sFieldId);
			}
			oGroupElement = oModifier.createControl("sap.ui.comp.smartform.GroupElement", oAppComponent, oView, oFieldSelector || sFieldId);

			if (!oFieldSelector) {
				oFieldSelector = oModifier.getSelector(sFieldId, oAppComponent);
			}
			oChange.setRevertData({newFieldSelector: oFieldSelector});

			for (var i = 0; i < oChangeDefinition.content.field.jsTypes.length; i++) {
				var sJsType = oChangeDefinition.content.field.jsTypes[i];
				var sPropertyName = oChangeDefinition.content.field.valueProperty[i];
				var oPropertyValue = oChangeDefinition.content.field.value[i];
				var oEntitySet = oChangeDefinition.content.field.entitySet;

				this.addElementIntoGroupElement(oModifier, oView, oGroupElement, sJsType, sPropertyName, oPropertyValue, oEntitySet, i, oAppComponent);
			}

			oModifier.insertAggregation(oGroup, "groupElements", oGroupElement, insertIndex);

			return true;

		} else {
			Log.error("Change does not contain sufficient information to be applied: [" + oChangeDefinition.layer + "]"
					+ oChangeDefinition.namespace + "/" + oChangeDefinition.fileName + "." + oChangeDefinition.fileType);
			// however subsequent changes should be applied
		}
	};

	AddFields.addElementIntoGroupElement = function(oModifier, oView, oGroupElement, sJsType, sPropertyName, oPropertyValue, sEntitySet, iIndex, oAppComponent) {
		var oValueControl;
		var sGroupElementId = oModifier.getId(oGroupElement);
		var sValueControlId = sGroupElementId + "-element" + iIndex;
		try {
			oValueControl = oModifier.createControl(sJsType, oAppComponent, oView, sValueControlId);
		} catch (oError) {
			return Base.markAsNotApplicable(oError && oError.message || "Control couldn't be created");
		}
		oModifier.bindProperty(oValueControl, sPropertyName, oPropertyValue);
		oModifier.setProperty(oValueControl, "expandNavigationProperties", true);

		oModifier.insertAggregation(oGroupElement, "elements", oValueControl, iIndex, oView, true);
		if (sEntitySet) {
			oModifier.setProperty(oValueControl, "entitySet", sEntitySet);
		}

	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {sap.ui.fl.Change} oChange change wrapper object to be completed
	 * @param {object} oSpecificChangeInfo with attributes "fieldLabel", the field label to be included in the change,
	 *          "fieldValue", the value for the control that displays the value, "valueProperty", the control property
	 *          that holds the field value, "newControlId", the control ID for the control to be added and "jsType", the
	 *          JavaScript control for the field value. Alternative new format is index, label, newControlId and bindingPath,
	 *          which will result in a new SmartField being added and bound.
	 *
	 * @public
	 */
	AddFields.completeChangeContent = function(oChange, oSpecificChangeInfo, mPropertyBag) {
		var oAppComponent = mPropertyBag.appComponent;
		var oChangeDefinition = oChange.getDefinition();

		if (!oChangeDefinition.content) {
			oChangeDefinition.content = {};
		}
		if (!oChangeDefinition.content.field) {
			oChangeDefinition.content.field = {};
		}
		if (oSpecificChangeInfo.fieldValues) {
			oChangeDefinition.content.field.value = oSpecificChangeInfo.fieldValues;
		} else if (oSpecificChangeInfo.bindingPath) {
			oChangeDefinition.content.field.value = [oSpecificChangeInfo.bindingPath];
		} else {
			throw new Error("oSpecificChangeInfo.fieldValue or bindingPath attribute required");
		}
		if (oSpecificChangeInfo.valueProperty) {
			oChangeDefinition.content.field.valueProperty = oSpecificChangeInfo.valueProperty;
		} else if (oSpecificChangeInfo.bindingPath) {
			oChangeDefinition.content.field.valueProperty = ["value"];
		} else {
			throw new Error("oSpecificChangeInfo.valueProperty or bindingPath attribute required");
		}
		if (oSpecificChangeInfo.newControlId) {
			oChangeDefinition.content.field.selector = JsControlTreeModifier.getSelector(oSpecificChangeInfo.newControlId, oAppComponent);
		} else {
			throw new Error("oSpecificChangeInfo.newControlId attribute required");
		}
		if (oSpecificChangeInfo.jsTypes) {
			oChangeDefinition.content.field.jsTypes = oSpecificChangeInfo.jsTypes;
		} else if (oSpecificChangeInfo.bindingPath) {
			oChangeDefinition.content.field.jsTypes = ["sap.ui.comp.smartfield.SmartField"];
		} else {
			throw new Error("oSpecificChangeInfo.jsTypes or bindingPath attribute required");
		}
		if (oSpecificChangeInfo.index === undefined) {
			throw new Error("oSpecificChangeInfo.index attribute required");
		} else {
			oChangeDefinition.content.field.index = oSpecificChangeInfo.index;
		}
		if (oSpecificChangeInfo.entitySet) {
			// an optional entity set can be configured
			oChangeDefinition.content.field.entitySet = oSpecificChangeInfo.entitySet;
		}

	};

	/**
	 * Reverts the applied change
	 *
	 * @param {sap.ui.fl.Change} oChange Change wrapper object with instructions to be applied to the control map
	 * @param {sap.ui.comp.smartform.Group|Element} oGroup Group control that matches the change selector for applying the change
	 * @param {object} mPropertyBag Property bag containing the modifier, the appComponent and the view
	 * @param {object} mPropertyBag.modifier Modifier for the controls
	 * @param {object} mPropertyBag.appComponent Component in which the change should be applied
	 * @param {object} mPropertyBag.view Application view
	 * @returns {boolean} True if successful
	 * @public
	 */
	AddFields.revertChange = function(oChange, oGroup, mPropertyBag) {
		var oAppComponent = mPropertyBag.appComponent;
		var oView = mPropertyBag.view;
		var oModifier = mPropertyBag.modifier;
		var mFieldSelector = oChange.getRevertData().newFieldSelector;

		var oGroupElement = oModifier.bySelector(mFieldSelector, oAppComponent, oView);
		oModifier.removeAggregation(oGroup, "groupElements", oGroupElement);
		oModifier.destroy(oGroupElement);
		oChange.resetRevertData();

		return true;
	};

	return AddFields;
},
/* bExport= */true);
