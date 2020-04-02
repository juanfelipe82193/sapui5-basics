/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require("sap.apf.modeler.ui.controller.requestOptions");
jQuery.sap.require("sap.apf.modeler.ui.utils.displayOptionsValueBuilder");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
sap.ui.define([
	"sap/apf/modeler/ui/controller/requestOptions",
	"sap/apf/modeler/ui/utils/textManipulator"
], function(BaseController, textManipulator) {
	"use strict";
	var optionsValueModelBuilder = sap.apf.modeler.ui.utils.optionsValueModelBuilder;
	var nullObjectChecker = sap.apf.modeler.ui.utils.nullObjectChecker;
	var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.STEPFILTERPROPERTY_LABEL;
	function _setDisplayTextForFilterPropertyLabel(oController) {
		var oTextReader = oController.getView().getViewData().oTextReader;
		var sTextForLabel = oController.oParentObject.getFilterPropertyLabelKey() ? oTextReader("label") : oTextReader("label") + " (" + oTextReader("default") + ")";
		oController.byId("idOptionalSelectedPropertyLabel").setText(sTextForLabel);
		oController.byId("idOptionalSelectedPropertyLabel").setTooltip(sTextForLabel);
	}
	function _setFilterPropertyLabelTextAsPromise(oController) {
		var deferred = jQuery.Deferred();
		var sPropertyLabelText;
		var sPropertyLabelKey = oController.oParentObject.getFilterPropertyLabelKey();
		if (!oController.getSource() || !oController.getEntity()) {
			return deferred.resolve();
		}
		if (nullObjectChecker.checkIsNotUndefined(sPropertyLabelKey)) {
			sPropertyLabelText = oController.getView().getViewData().oConfigurationHandler.getTextPool().get(sPropertyLabelKey).TextElementDescription;
			oController.byId("idOptionalSelectedPropertyLabelText").setValue(sPropertyLabelText);
			return deferred.resolve();
		}
		oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
			var sPropertyName = oController.oParentObject.getFilterProperties()[0];
			if (oController.oParentObject.getType() === "hierarchicalStep" && sPropertyName) {
				sPropertyName = oController.oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sPropertyName)["hierarchy-node-for"];
			}
			if (sPropertyName) {
				sPropertyLabelText = oController.oStepPropertyMetadataHandler.getDefaultLabel(entityTypeMetadata, sPropertyName);
			}
			oController.byId("idOptionalSelectedPropertyLabelText").setValue(sPropertyLabelText);
			deferred.resolve();
		});
		return deferred;
	}
	function _setMarginToFilterProperty(oController) {
		oController.byId("idOptionalRequestFieldLabel").addStyleClass("filterPropertyLable");
		oController.byId("idOptionalRequestField").addStyleClass("filterProperty");
		oController.byId("idOptionalLabelDisplayOptionType").addStyleClass("filterProperty");
	}
	return BaseController.extend("sap.apf.modeler.ui.controller.stepRequest", {
		setLabelDisplayOptionTypeAsPromise : function(optionsValueModelBuilder) {
			var deferred = jQuery.Deferred();
			var displayOptionsValueBuilder, oLabelDisplayOptions, oModelForDisplayText, sPropertyName, sLabelDisplayOption, oController = this, aLabelDisplayOptionWithPrefix = [];
			var oTextReader = oController.getView().getViewData().oTextReader;
			displayOptionsValueBuilder = new sap.apf.modeler.ui.utils.DisplayOptionsValueBuilder(oTextReader, optionsValueModelBuilder);
			oModelForDisplayText = displayOptionsValueBuilder.getLabelDisplayOptions();
			oLabelDisplayOptions = sap.apf.core.constants.representationMetadata.labelDisplayOptions;
			sPropertyName = textManipulator.removePrefixText(oController.byId("idOptionalRequestField").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			_setDisplayTextForFilterPropertyLabel(oController);
			_setFilterPropertyLabelTextAsPromise(oController).done(function(){
				oController.byId("idOptionalLabelDisplayOptionType").setEnabled(true);
				if (sPropertyName === oTextReader("none")) {
					oController.byId("idOptionalLabelDisplayOptionType").setModel(oModelForDisplayText);
					oController.byId("idOptionalLabelDisplayOptionType").setEnabled(false);
					return deferred.promise();
				}
				sLabelDisplayOption = oController.oParentObject.getFilterPropertyLabelDisplayOption();
				oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {
					if ((sLabelDisplayOption === oLabelDisplayOptions.KEY_AND_TEXT || sLabelDisplayOption === oLabelDisplayOptions.TEXT) && !oController.oStepPropertyMetadataHandler.hasTextPropertyOfDimension(oEntityTypeMetadata, sPropertyName)) {
						oModelForDisplayText = displayOptionsValueBuilder.getValidatedLabelDisplayOptions();
						aLabelDisplayOptionWithPrefix = textManipulator.addPrefixText([ sLabelDisplayOption ], oTextReader);
						sLabelDisplayOption = aLabelDisplayOptionWithPrefix[0];
					}
					oController.byId("idOptionalLabelDisplayOptionType").setModel(oModelForDisplayText);
					oController.byId("idOptionalLabelDisplayOptionType").setSelectedKey(sLabelDisplayOption);
					deferred.resolve();
				});
			});
			return deferred.promise();
		},
		enableDisableLabelDisplayOptionTypeAsPromise : function() {
			var itemIndex, oController = this;
			var deferred = jQuery.Deferred();
			var oTextReader = oController.getView().getViewData().oTextReader;
			var oDisplayLabelOption = oController.byId("idOptionalLabelDisplayOptionType");
			var sPropertyName = textManipulator.removePrefixText(oController.byId("idOptionalRequestField").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
				var bIsTextPropertyPresent = oController.oStepPropertyMetadataHandler.hasTextPropertyOfDimension(entityTypeMetadata, sPropertyName);
				for(itemIndex = 0; itemIndex < oDisplayLabelOption.getItems().length; itemIndex++) {
					oDisplayLabelOption.getItems()[itemIndex].setEnabled(true);
					if (itemIndex > 0 && !bIsTextPropertyPresent) {
						oDisplayLabelOption.getItems()[itemIndex].setEnabled(false);
					}
				}
				deferred.resolve();
			});
			return deferred.promise();
		},
		// Sets visibility of select box to true for selectable property 
		onBeforeRendering : function() {
			var oController = this;
			oController.byId("idOptionalRequestFieldLabel").setVisible(true);
			oController.byId("idOptionalRequestField").setVisible(true);
			oController.byId("idOptionalLabelDisplayOptionType").setVisible(true);
			oController.byId("idOptionalSelectedPropertyLabel").setVisible(true);
			oController.byId("idOptionalSelectedPropertyLabelText").setVisible(true);
		},
		onAfterRendering : function() {
			var oController = this;
			oController.addOrRemoveMandatoryFieldsAndRequiredFlag(true);
			_setMarginToFilterProperty(oController);
		},
		setDisplayText : function() {
			var oController = this;
			var oTextReader = oController.getView().getViewData().oTextReader;
			oController.byId("idSourceLabel").setText(oTextReader("source"));
			oController.byId("idEntityLabel").setText(oTextReader("entity"));
			oController.byId("idSelectPropertiesLabel").setText(oTextReader("selectProperties"));
			oController.byId("idOptionalRequestFieldLabel").setText(oTextReader("requiredFilters"));
		},
		setOptionalRequestFieldProperty : function() {
			var oController = this;
			var aProperties, aSelectedProperties, bIsFilterPropertyExist, oModelForFilterProperties, aNoneProperty, aValidatedValues = [];
			var aFilterProperties = oController.oParentObject.getFilterProperties();
			aNoneProperty = [ oController.getView().getViewData().oTextReader("none") ];
			aProperties = oController.byId("idSelectProperties").getSelectedKeys();
			aSelectedProperties = oController.oParentObject.getSelectProperties();
			aSelectedProperties.forEach(function(property) {
				if (property === aFilterProperties[0]) {
					bIsFilterPropertyExist = true;
				}
			});
			if (!bIsFilterPropertyExist && aFilterProperties.length > 0) {
				oController.removeOptionalRequestFieldProperty(aFilterProperties);
				aFilterProperties = oController.oParentObject.getFilterProperties();
			}
			//setModel on the select box
			oModelForFilterProperties = optionsValueModelBuilder.convert(aNoneProperty.concat(aProperties));
			oController.byId("idOptionalRequestField").setModel(oModelForFilterProperties);
			oController.byId("idOptionalRequestField").setSelectedKey(aNoneProperty[0]);// Default state - None should be selected - For New/when select properties are not present select None
			//Validate selected values
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aFilterProperties)) {
				aValidatedValues = oController.validateSelectedValues(oController, aFilterProperties, aProperties);
				aFilterProperties = aValidatedValues.aSelectedValues;
				oController.byId("idOptionalRequestField").setSelectedKey(aFilterProperties[0]);
			}
		},
		addOrRemoveMandatoryFieldsAndRequiredFlag : function(bRequired) {
			var oController = this;
			if (bRequired === false) {
				return;
			}
			oController.byId("idSourceLabel").setRequired(bRequired);
			oController.byId("idEntityLabel").setRequired(bRequired);
			oController.byId("idSelectPropertiesLabel").setRequired(bRequired);
			oController.viewValidator.addFields([ "idSource", "idEntity", "idSelectProperties" ]);
		},
		fireRelevantEvents : function(oEvt) {
			var oController = this, sFilterProperty, bShowFilterMappingLayout;
			if (oEvt.getSource() !== oController.byId("idOptionalRequestField")) {
				sFilterProperty = [ textManipulator.removePrefixText(oController.byId("idOptionalRequestField").getSelectedKey(), oController.getView().getViewData().oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE)) ];
				if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sFilterProperty)) {
					oController.updateOptionalRequestFieldProperty(sFilterProperty);
				}
				if (oController.getSelectProperties().length === 0) {
					oController.oParentObject.resetTopN();
				}
				oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETDATAREDUCTIONSECTION);
			}
			if (oEvt.getSource() === oController.byId("idOptionalProperty")) {
				oController.setOptionalRequestFieldProperty();
			}
			bShowFilterMappingLayout = (oController.byId("idOptionalRequestField").getSelectedKey() !== oController.getView().getViewData().oTextReader("none")) ? true : false;
			oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.SETVISIBILITYOFFILTERMAPPINGFIELDS, {
				"bShowFilterMappingLayout" : bShowFilterMappingLayout
			});
			oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.step.UPDATEFILTERMAPPINGFIELDS);
		},
		getSource : function() {
			return this.oParentObject.getService();
		},
		getAllEntitiesAsPromise : function(sSource) {
			return this.oConfigurationEditor.getAllEntitySetsOfServiceAsPromise(sSource);
		},
		getEntity : function() {
			return this.oParentObject.getEntitySet();
		},
		getAllEntitySetPropertiesAsPromise : function(sSource, sEntitySet) {
			return this.oConfigurationEditor.getAllPropertiesOfEntitySetAsPromise(sSource, sEntitySet);
		},
		changeLabelDisplayOption : function(sLabelDisplayOption) {
			var oController = this;
			oController.oParentObject.setFilterPropertyLabelDisplayOption(sLabelDisplayOption);
		},
		changeOptionalSelectedPropertyLabelText : function(sLabelText) {
			var oController = this;
			if (sLabelText.trim().length === 0) {
				oController.oParentObject.setFilterPropertyLabelKey(undefined);
				_setDisplayTextForFilterPropertyLabel(oController);
				_setFilterPropertyLabelTextAsPromise(oController);
				return;
			}
			oController.getView().getViewData().oConfigurationHandler.getTextPool().setTextAsPromise(sLabelText, oTranslationFormat).done(function(sLabelTextKey) {
				oController.oParentObject.setFilterPropertyLabelKey(sLabelTextKey);
				_setDisplayTextForFilterPropertyLabel(oController);
				_setFilterPropertyLabelTextAsPromise(oController);
			});
		},
		resetEntityAndProperties : function() {
			var oController = this;
			oController.clearEntity();
			oController.byId("idEntity").setModel(null);
			oController.byId("idEntity").setSelectedKey(undefined);
			oController.clearSelectProperties();
			oController.byId("idSelectProperties").setModel(null);
			oController.byId("idSelectProperties").setSelectedKeys([]);
			oController.byId("idOptionalRequestField").setModel(null);
			oController.byId("idOptionalRequestField").setSelectedKey(undefined);
		},
		clearSource : function() {
			var oController = this;
			oController.oParentObject.setService(undefined);
			oController.clearEntity();
		},
		clearEntity : function() {
			var oController = this;
			oController.oParentObject.setEntitySet(undefined);
			oController.clearSelectProperties();
		},
		clearSelectProperties : function() {
			var oController = this;
			var aOldSelProp = oController.oParentObject.getSelectProperties();
			aOldSelProp.forEach(function(property) {
				oController.oParentObject.removeSelectProperty(property);
			});
			oController.clearOptionalRequestFieldProperty();
		},
		clearOptionalRequestFieldProperty : function() {
			var oController = this;
			var aOldSelProp = oController.oParentObject.getFilterProperties();
			aOldSelProp.forEach(function(property) {
				oController.oParentObject.removeFilterProperty(property);
			});
		},
		removeSelectProperties : function(aProperties) {
			var oController = this;
			aProperties.forEach(function(property) {
				oController.oParentObject.removeSelectProperty(property);
			});
		},
		removeOptionalRequestFieldProperty : function(aProperties) {
			var oController = this;
			aProperties.forEach(function(property) {
				oController.oParentObject.removeFilterProperty(property);
			});
		},
		updateSource : function(sSource) {
			var oController = this;
			oController.oParentObject.setService(sSource);
		},
		updateEntity : function(sEntity) {
			var oController = this;
			oController.oParentObject.setEntitySet(sEntity);
		},
		updateSelectProperties : function(aSelectProperties) {
			var oController = this;
			oController.removeSelectProperties(oController.oParentObject.getSelectProperties());
			aSelectProperties.forEach(function(property) {
				oController.oParentObject.addSelectProperty(property);
			});
		},
		updateOptionalRequestFieldProperty : function(aFilterProperties) {
			var oController = this;
			var sLabelKey = oController.oParentObject.getFilterPropertyLabelKey();
			var sDisplayOption = oController.oParentObject.getFilterPropertyLabelDisplayOption();
			var sFilterProp = oController.oParentObject.getFilterProperties();
			oController.removeOptionalRequestFieldProperty(oController.oParentObject.getFilterProperties());
			aFilterProperties.forEach(function(property) {
				if (property !== oController.getView().getViewData().oTextReader("none")) {
					oController.oParentObject.addFilterProperty(property);
					if (property === sFilterProp[0]) {
						oController.oParentObject.setFilterPropertyLabelKey(sLabelKey);
						oController.oParentObject.setFilterPropertyLabelDisplayOption(sDisplayOption);
					}
				}
			});
		},
		getSelectProperties : function() {
			var oController = this;
			return oController.oParentObject.getSelectProperties();
		},
		getOptionalRequestFieldProperty : function() {
			var oController = this;
			return oController.oParentObject.getFilterProperties();
		},
		getValidationState : function() {
			var oController = this;
			return oController.viewValidator.getValidationState();
		}
	});
});
