/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/comp/smartmultiedit/Container"
], function (Log, JsControlTreeModifier, Container) {
	"use strict";

	/**
	 * Change handler for adding a smart form group element (representing one or more fields).
	 *
	 * @alias sap.ui.fl.changeHandler.AddFields
	 * @author SAP SE
	 * @version 1.74.0
	 */
	var AddMultiEditFields = {};

	/**
	 * Adds a smart form group element including one or more value controls.
	 *
	 * @param {sap.ui.fl.Change} oChange Change wrapper object with instructions to be applied on the control map.
	 * @param {sap.ui.comp.smartform.Group|Element} oGroup Group control or xml element that matches the change selector for applying the change.
	 * @param {object} mPropertyBag Property bag.
	 * @param {sap.ui.core.util.reflection.BaseTreeModifier} mPropertyBag.modifier Modifier for the controls.
	 * @param {sap.ui.core.UIComponent} mPropertyBag.appComponent Component in which the change should be applied.
	 * @param {object} mPropertyBag.view View object or xml element representing an ui5 view.
	 * @return {boolean} True if successfully added.
	 * @public
	 */
	AddMultiEditFields.applyChange = function (oChange, oGroup, mPropertyBag) {
		var oChangeDefinition = oChange.getDefinition();

		if (this._checkChangeDefinition(oChangeDefinition)) {
			var oModifier = mPropertyBag.modifier,
				oFieldSelector = oChangeDefinition.content.field.selector,
				sFieldId = oChangeDefinition.content.field.id,
				iInsertIndex = oChangeDefinition.content.field.index,
				sJsType = oChangeDefinition.content.field.jsType,
				sPropertyName = oChangeDefinition.content.field.propertyName,
				oEntitySet = oChangeDefinition.content.field.entitySet;

			var oGroupElement = oModifier.createControl("sap.ui.comp.smartform.GroupElement", mPropertyBag.appComponent, mPropertyBag.view, oFieldSelector || sFieldId);
			var oField = this._createGroupElementField(oModifier, mPropertyBag.view, oGroupElement, sJsType, sPropertyName, oEntitySet, mPropertyBag.appComponent);
			oModifier.insertAggregation(oGroup, "groupElements", oGroupElement, iInsertIndex, mPropertyBag.view);

			// Index the new sap.ui.comp.smartmultiedit.Field in its sap.ui.comp.smartmultiedit.Container
			var oContainer = this._getContainerFromGroup(oGroup);
			if (oContainer) {
				oContainer.indexField(oField);
			}

			oChange.setRevertData(oModifier.getSelector(oGroupElement, mPropertyBag.appComponent));

			return true;
		} else {
			Log.error("Change doesn't contain sufficient information to be applied: " + this._getChangeInfo(oChangeDefinition));
			// however subsequent changes should be applied
		}
	};

	/**
	 * Adds a smart form group element incl. one or more value controls.
	 *
	 * @param {sap.ui.fl.Change} oChange change wrapper object with instructions to be applied on the control map
	 * @param {sap.ui.comp.smartform.Group|Element} oGroup group control or xml element that matches the change selector for applying the change
	 * @param {object} mPropertyBag Property bag
	 * @return {boolean} true if successfully reverted
	 * @public
	 */
	AddMultiEditFields.revertChange = function (oChange, oGroup, mPropertyBag) {
		var oChangeDefinition = oChange.getDefinition(),
			oSelector = oChange.getRevertData();

		if (oSelector) {
			var sSelectorId = oSelector.idIsLocal ? mPropertyBag.appComponent.getId() + oSelector.id : oSelector.id;
			var oGroupElement = sap.ui.getCore().byId(sSelectorId);

			if (oGroupElement) {
				mPropertyBag.modifier.removeAggregation(oGroup, "groupElements", oGroupElement);

				// Refresh the indexing of sap.ui.comp.smartmultiedit.Fields in its sap.ui.comp.smartmultiedit.Container
				var oContainer = this._getContainerFromGroup(oGroup);
				if (oContainer) {
					oContainer._refreshFields();
				}

				oChange.resetRevertData();

				return true;
			} else {
				Log.error(
					"Change could not be reverted because selector '" + sSelectorId + "' did not find any control: " +
					this._getChangeInfo(oChangeDefinition)
				);
			}
		} else {
			Log.error(
				"Change doesn't contain sufficient information to be reverted. Most Likely the Change didn't go through applyChange: " +
				this._getChangeInfo(oChangeDefinition)
			);
		}
	};

	/**
	 * Completes the change by adding change handler specific content.
	 *
	 * @param {sap.ui.fl.Change} oChange Change wrapper object to be completed.
	 * @param {object} oSpecificChangeInfo Specific change info with attributes "fieldLabel", the field label to be included in the change,
	 * "fieldValue", the value for the control that displays the value, "valueProperty", the control property
	 * that holds the field value, "newControlId", the control ID for the control to be added and "jsType", the
	 * JavaScript control for the field value. Alternative new format is index, label, newControlId and bindingPath,
	 * which will result in a new SmartField being added and bound.
	 * @param {object} mPropertyBag Property bag
	 *
	 * @public
	 */
	AddMultiEditFields.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var oAppComponent = mPropertyBag.appComponent;
		var oChangeDefinition = oChange.getDefinition();

		if (!oChangeDefinition.content) {
			oChangeDefinition.content = {};
		}
		if (!oChangeDefinition.content.field) {
			oChangeDefinition.content.field = {};
		}
		if (oSpecificChangeInfo.bindingPath) {
			oChangeDefinition.content.field.propertyName = oSpecificChangeInfo.bindingPath;
		} else {
			throw new Error("oSpecificChangeInfo.bindingPath or bindingPath attribute required");
		}
		if (oSpecificChangeInfo.newControlId) {
			oChangeDefinition.content.field.selector = JsControlTreeModifier.getSelector(oSpecificChangeInfo.newControlId, oAppComponent);
		} else {
			throw new Error("oSpecificChangeInfo.newControlId attribute required");
		}
		if (oSpecificChangeInfo.jsTypes) {
			oChangeDefinition.content.field.jsType = oSpecificChangeInfo.jsType;
		} else if (oSpecificChangeInfo.bindingPath) {
			oChangeDefinition.content.field.jsType = "sap.ui.comp.smartmultiedit.Field";
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
	 * Checks whether the change definition contains sufficient information to be applied.
	 * @param {object} oChangeDefinition Change definition.
	 * @returns {boolean} true if change definition contains sufficient information to be applied.
	 * @private
	 */
	AddMultiEditFields._checkChangeDefinition = function (oChangeDefinition) {
		var bContentPresent = oChangeDefinition.content,
			bMandatoryContentPresent = false;

		if (bContentPresent) {
			bMandatoryContentPresent = oChangeDefinition.content.field
				&& (oChangeDefinition.content.field.selector || oChangeDefinition.content.field.id)
				&& oChangeDefinition.content.field.jsType
				&& oChangeDefinition.content.field.propertyName;
		}

		return bContentPresent && bMandatoryContentPresent;
	};

	/**
	 * Helper function to create a Field in a GroupElement aggregation.
	 * @param {sap.ui.core.util.reflection.BaseTreeModifier} oModifier Modifier for the controls.
	 * @param {sap.ui.core.mvc.View} oView View object or xml element representing an ui5 view.
	 * @param {sap.ui.comp.smartform.GroupElement} oGroupElement GroupElement control which will receive the new Field.
	 * @param {string} sJsType JS type of the Field to be created.
	 * @param {string} sPropertyName Property name to be set on the new Field.
	 * @param {string} sEntitySet Entity Set to be set on the New Field.
	 * @param {sap.ui.core.UIComponent} oAppComponent Component in which the change should be applied.
	 * @returns {sap.ui.core.Control} Created Field.
	 * @private
	 */
	AddMultiEditFields._createGroupElementField = function (oModifier, oView, oGroupElement, sJsType, sPropertyName, sEntitySet, oAppComponent) {
		var oValueControl = oModifier.createControl(sJsType, oAppComponent, oView);

		oModifier.setProperty(oValueControl, "propertyName", sPropertyName);
		if (sEntitySet) {
			oModifier.setProperty(oValueControl, "entitySet", sEntitySet);
		}
		oModifier.insertAggregation(oGroupElement, "elements", oValueControl, 0, oView, true);

		return oValueControl;
	};

	/**
	 * Getter for SmartForm Group's Container.
	 * @param {sap.ui.comp.smartform.Group} oGroup Instance of SmartForm Group.
	 * @returns {sap.ui.comp.smartmultiedit.Container} Instance of the Container or undefined.
	 * @private
	 */
	AddMultiEditFields._getContainerFromGroup = function (oGroup) {
		if (oGroup && typeof oGroup.getParent === "function" && typeof oGroup.getParent().getParent === "function" &&
			typeof oGroup.getParent().getParent().getParent === "function") {
			var oContainer = oGroup.getParent().getParent().getParent();
			if (oContainer instanceof Container) {
				return oContainer;
			}
		}
	};

	/**
	 * Getter for change info string to be used for logging.
	 * @param {object} oChangeDefinition Change definition.
	 * @returns {string} Change definition information as a string.
	 * @private
	 */
	AddMultiEditFields._getChangeInfo = function (oChangeDefinition) {
		return "[" + oChangeDefinition.layer + "]" + oChangeDefinition.namespace + "/" + oChangeDefinition.fileName + "." + oChangeDefinition.fileType;
	};

	return AddMultiEditFields;
}, true);
