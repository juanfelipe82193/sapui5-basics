/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/rta/command/FlexCommand",
	"sap/ui/fl/FlexControllerFactory",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/fl/Utils",
	"sap/base/util/merge",
	"sap/base/util/extend"
], function(
	FlexCommand,
	FlexControllerFactory,
	JsControlTreeModifier,
	flUtils,
	merge,
	extend
) {
	"use strict";

	/**
	 * Special command for Annotation property changes, as used by VisualEditor. Workaround for unstable IDs.
	 * Similar to sap/ui/rta/command/Property.js, (still) using the same change type.
	 * Not yet registered at the CommandFactory, this command needs to be requested explicitly.
	 *
	 * @class
	 * @extends sap.ui.rta.command.FlexCommand
	 * @author SAP SE
	 * @version 1.74.0
	 * @constructor
	 * @private
	 * @alias sap.suite.ui.generic.template.changeHandler.util.AnnotationPropertyCommand
	 * @experimental This class is experimental and provides only limited functionality. Also the API might be
	 *               changed in future.
	 */
	var AnnotationPropertyCommand = FlexCommand.extend("sap.suite.ui.generic.template.changeHandler.util.AnnotationPropertyCommand", {
		metadata : {
			library : "sap.suite.ui.generic.template",
			properties : {
				propertyName : {
					type : "string"
				},
				newValue : {
					type : "any"
				},
				semanticMeaning : {
					type : "string"
				},
				changeType : {
					type : "string",
					defaultValue : "propertyChange"
				}
			},
			associations : {},
			events : {}
		}
	});

	/**
	 * This method converts command constructor parameters into change specific data.
	 * Identical with _getChangeSpecificData of sap/ui/rta/command/Property.js
	 *
	 * @return {object} Returns the <code>SpecificChangeInfo</code> for change handler
	 * @private
	 */
	AnnotationPropertyCommand.prototype._getChangeSpecificData = function() {
		var oElement = this.getElement();

		return {
			changeType : this.getChangeType(),
			selector : {
				id : this.getElementId(),
				type : oElement.getMetadata().getName()
			},
			content : {
				property : this.getPropertyName(),
				newValue : this.getNewValue(),
				semantic : this.getSemanticMeaning()
			}
		};
	};

	/** Function for determining the selector later used to apply a change for a given control.
	 * The function differs between local IDs generated starting with 1.40 and the global IDs generated in previous versions.
	 * Workaround: redefines getSelector of sap/ui/core/util/reflection/BaseTreeModifier.js in order to work with unstable IDs
	 *
	 * @param {sap.ui.base.ManagedObject | Element | string} vControl control or ID string for which the selector should be determined
	 * @param {sap.ui.core.Component} oAppComponent oAppComponent application component, needed only if vControl is a string or XML Node
	 * @param {object} mAdditionalSelectorInformation additional mapped data which is added to the selector
	 * @returns {object} oSelector
	 * @returns {string} oSelector.id ID used for determination of the flexibility target
	 * @returns {boolean} oSelector.idIsLocal flag if the selector.id has to be concatenated with the application component ID
	 * while applying the change.
	 * @throws {Error} in case no control could be determined an error is thrown
	 * @public
	 */
	AnnotationPropertyCommand.getSelector = function (vControl, oAppComponent, mAdditionalSelectorInformation) {
		var sControlId = vControl;
		if (typeof sControlId !== "string") {
			sControlId = (vControl) ? this.getId(vControl) : undefined;
		} else if (!oAppComponent) {
			throw new Error("App Component instance needed to get a selector from string ID");
		}

		if (mAdditionalSelectorInformation && (mAdditionalSelectorInformation.id || mAdditionalSelectorInformation.idIsLocal)) {
			throw new Error("A selector of control with the ID '" + sControlId + "' was requested, " +
				"but core properties were overwritten by the additionally passed information.");
		}

		var oSelector = extend({}, mAdditionalSelectorInformation, {
			id: "",
			idIsLocal: false
		});
		oSelector.id = sControlId;

		return oSelector;
	};

	/**
	 * Create a change.
	 * Workaround: redefines createChange of src/sap/ui/fl/FlexController.js in order to run with unstable Ids
	 *
	 * @param {object} oChangeSpecificData - property bag (nvp) holding the change information (see sap.ui.fl.Change#createInitialFileContent)
	 * The property "oPropertyBag.packageName" is set to $TMP and internally since flex changes are always local when they are created.
	 * @param {sap.ui.core.Control | map} oControl - control for which the change will be added
	 * @param {string} oControl.id - id of the control in case a map has been used to specify the control
	 * @param {sap.ui.core.Component} oControl.appComponent - Application Component of the control at runtime in case a map has been used
	 * @param {string} oControl.controlType - control type of the control in case a map has been used
	 * @returns {sap.ui.fl.Change} the created change
	 * @public
	 */
	AnnotationPropertyCommand.createChange = function (oChangeSpecificData, oControl) {
		var oChange, ChangeHandler;

		if (!oControl) {
			throw new Error("A flexibility change cannot be created without a targeted control.");
		}

		var sControlId = oControl.id || oControl.getId();

		if (!oChangeSpecificData.selector) {
			oChangeSpecificData.selector = {};
		}
		var oAppComponent = oControl.appComponent || flUtils.getAppComponentForControl(oControl);
		if (!oAppComponent) {
			throw new Error("No Application Component found - to offer flexibility the control with the id '" + sControlId + "' has to have a valid relation to its owning application component.");
		}
		// differentiate between controls containing the component id as a prefix and others
		// get local Id for control at root component and use it as selector id
		extend(oChangeSpecificData.selector, AnnotationPropertyCommand.getSelector(sControlId, oAppComponent));

		var oFlexController = FlexControllerFactory.createForControl(oAppComponent);
		oChange = oFlexController.createBaseChange(oChangeSpecificData, oAppComponent);

		// for getting the change handler the control type and the change type are needed
		var sControlType = oControl.controlType || flUtils.getControlType(oControl);
		if (!sControlType) {
			throw new Error("No control type found - the change handler can not be retrieved.");
		}

		ChangeHandler = oFlexController._getChangeHandler(oChange, sControlType, oControl, JsControlTreeModifier);
		if (ChangeHandler) {
			ChangeHandler.completeChangeContent(oChange, oChangeSpecificData, {
				modifier: JsControlTreeModifier,
				appComponent: oAppComponent
			});
		} else {
			throw new Error("Change handler could not be retrieved for change " + JSON.stringify(oChangeSpecificData) + ".");
		}

		return oChange;
	};

	/**
	 * Create a Flex change from a given Change Specific Data.
	 * (This method can be reused to retrieve an Undo Change)
	 * Workaround: redefines _createChangeFromData of sap/ui/rta/command/FlexCommand.js in order to run with unstable Ids
	 *
	 * @param {object} mChangeSpecificData Map containing change specific data
	 * @param {object} mFlexSettings Map containing flex settings
	 * @param {string} sVariantManagementReference Reference to the variant management
	 * @returns {object} Returns the change object
	 * @private
	 */
	AnnotationPropertyCommand.prototype._createChangeFromData = function(mChangeSpecificData, mFlexSettings, sVariantManagementReference) {
		if (mFlexSettings) {
			mChangeSpecificData = merge({}, mChangeSpecificData, mFlexSettings);
		}
		mChangeSpecificData.jsOnly = this.getJsOnly();
		var oModel = this.getAppComponent().getModel("$FlexVariants");
		var sVariantReference;
		if (oModel && sVariantManagementReference) {
			sVariantReference = oModel.getCurrentVariantReference(sVariantManagementReference);
		}
		var mVariantObj = {
			"variantManagementReference": sVariantManagementReference,
			"variantReference": sVariantReference
		};
		if (sVariantReference) {
			mChangeSpecificData = extend({}, mChangeSpecificData, mVariantObj);
		}
		var oChange = AnnotationPropertyCommand.createChange(mChangeSpecificData, this._validateControlForChange(mFlexSettings));
		if (mFlexSettings && mFlexSettings.originalSelector) {
			oChange.getDefinition().selector = AnnotationPropertyCommand.getSelector(this.getSelector().id, this.getSelector().appComponent);
			oChange.setContent(extend({}, oChange.getContent(), mFlexSettings.content));
		}
		return oChange;
	};


	return AnnotationPropertyCommand;

}, /* bExport= */true);
