/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");
sap.ui.define([ "sap/apf/modeler/ui/controller/stepRequest.controller" ], function(BaseController) {
	"use strict";
	var textManipulator = sap.apf.modeler.ui.utils.textManipulator;
	var optionsValueModelBuilder = sap.apf.modeler.ui.utils.optionsValueModelBuilder;
	var nullObjectChecker = sap.apf.modeler.ui.utils.nullObjectChecker;
	return BaseController.extend("sap.apf.modeler.ui.controller.hierarchicalStepRequest", {
		// Sets visibility of select box to true for hierarchical and selectable property
		onBeforeRendering : function() {
			var oController = this;
			oController.byId("idOptionalPropertyLabel").setVisible(true);
			oController.byId("idOptionalProperty").setVisible(true);
			oController.byId("idOptionalRequestFieldLabel").setVisible(true);
			oController.byId("idOptionalRequestField").setVisible(true);
			oController.byId("idOptionalLabelDisplayOptionType").setVisible(true);
			oController.byId("idOptionalSelectedPropertyLabel").setVisible(true);
			oController.byId("idOptionalSelectedPropertyLabelText").setVisible(true);
		},
		setDisplayText : function() {
			var oController = this;
			var oTextReader = oController.getView().getViewData().oTextReader;
			oController.byId("idSourceLabel").setText(oTextReader("source"));
			oController.byId("idEntityLabel").setText(oTextReader("hierarchicalEntity"));
			oController.byId("idOptionalPropertyLabel").setText(oTextReader("hierarchicalProperty"));
			oController.byId("idSelectPropertiesLabel").setText(oTextReader("nonHierarchicalProperty"));
			oController.byId("idOptionalRequestFieldLabel").setText(oTextReader("requiredFilters"));
		},
		setOptionalHierarchicalProperty : function() {
			var oController = this;
			var deferred = jQuery.Deferred();
			var oModelForHierarchicalProperty, sSource, sHierarchicalEntitySet, aValidatedValues;
			sSource = oController.byId("idSource").getValue();
			sHierarchicalEntitySet = oController.byId("idEntity").getSelectedKey();
			// Default State
			oController.byId("idOptionalProperty").setModel(null);
			oController.byId("idOptionalProperty").clearSelection();
			if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSource)) {
				deferred.resolve();
				return deferred.promise();
			}
			oController.getHierarchicalProperty(sSource, sHierarchicalEntitySet).done(function(aAllHierarchicalEntitiesInPromise) {
				var sSelectedHierarchicalProperty = oController.getSelectedHierarchicalProperty();
				// Validate previously selected values
				if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSelectedHierarchicalProperty)) {
					aValidatedValues = oController.validateSelectedValues(oController, [ sSelectedHierarchicalProperty ], aAllHierarchicalEntitiesInPromise);
					aAllHierarchicalEntitiesInPromise = aValidatedValues.aValues;
					sSelectedHierarchicalProperty = aValidatedValues.aSelectedValues[0];
				}
				// setModel
				oModelForHierarchicalProperty = optionsValueModelBuilder.convert(aAllHierarchicalEntitiesInPromise);
				oController.byId("idOptionalProperty").setModel(oModelForHierarchicalProperty);
				// setSelectedKey as 0th entity -> in case new parent object(no entity available for new parent object)/ in case of change of source(if old entity is not present in the entities of new source)
				if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSelectedHierarchicalProperty) || aAllHierarchicalEntitiesInPromise.indexOf(sSelectedHierarchicalProperty) === -1) {
					sSelectedHierarchicalProperty = aAllHierarchicalEntitiesInPromise[0];
					if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSelectedHierarchicalProperty)) {
						oController.byId("idOptionalProperty").setSelectedKey(sSelectedHierarchicalProperty);
					}
					deferred.resolve();
				} else if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sSelectedHierarchicalProperty)) {
					oController.byId("idOptionalProperty").setSelectedKey(sSelectedHierarchicalProperty);
					deferred.resolve();
				}
			});
			return deferred.promise();
		},
		setOptionalRequestFieldProperty : function() {
			var oController = this;
			var aAllSelectableProperties, oModelForFilterProperties, sSelectedValue, aFilterProperties, aNoneProperty, aValidatedValues = [], sSource, sHierarchicalEntitySet, sHierarchicalProperty, oSelectableHierarchicalProperty;
			aNoneProperty = [ oController.getView().getViewData().oTextReader("none") ];
			sSource = oController.oParentObject.getService();
			sHierarchicalEntitySet = oController.oParentObject.getEntitySet();
			sHierarchicalProperty = oController.getSelectedHierarchicalProperty();
			aAllSelectableProperties = aNoneProperty;
			sSelectedValue = aNoneProperty[0];
			if (sSource && sHierarchicalEntitySet && sHierarchicalProperty) {
				oController.getHierarchyNodeIdAsPromise(sSource, sHierarchicalEntitySet, sHierarchicalProperty).done(function(sHierarchicalPropertyNode) {
					aFilterProperties = oController.oParentObject.getFilterProperties();
					//Validate selected values
					if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aFilterProperties)) {
						aValidatedValues = oController.validateSelectedValues(oController, aFilterProperties, [ sHierarchicalPropertyNode ]);
						aFilterProperties = aValidatedValues.aValues;
						sSelectedValue = aValidatedValues.aSelectedValues;
					}
					if (sHierarchicalPropertyNode) {
						oSelectableHierarchicalProperty = {
							key : sHierarchicalPropertyNode,
							name : sHierarchicalProperty
						};
						aAllSelectableProperties = aAllSelectableProperties.concat(oSelectableHierarchicalProperty);
					} else {
						aAllSelectableProperties = aAllSelectableProperties.concat(aFilterProperties);
					}
				});
			}
			//set the model
			oModelForFilterProperties = optionsValueModelBuilder.convert(aAllSelectableProperties);
			oController.byId("idOptionalRequestField").setModel(oModelForFilterProperties);
			oController.byId("idOptionalRequestField").setSelectedKey(sSelectedValue);
		},
		handleChangeForOptionalProperty : function(oEvt) {
			var oController = this;
			var oTextReader = oController.getView().getViewData().oTextReader;
			var sHierarchicalProperty = textManipulator.removePrefixText(oController.byId("idOptionalProperty").getSelectedKey(), oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			oController.updateHierarchicalProperty(sHierarchicalProperty);
			oController.clearOptionalRequestFieldProperty();
			oController.setOptionalRequestFieldProperty();
			oController.oConfigurationEditor.setIsUnsaved();
			oController.fireRelevantEvents(oEvt);
		},
		addOrRemoveMandatoryFieldsAndRequiredFlag : function(bRequired) {
			var oController = this;
			if (bRequired === false) {
				return;
			}
			oController.byId("idSourceLabel").setRequired(bRequired);
			oController.byId("idEntityLabel").setRequired(bRequired);
			oController.byId("idOptionalPropertyLabel").setRequired(bRequired);
			oController.viewValidator.addFields([ "idSource", "idEntity", "idOptionalProperty" ]);
		},
		getAllEntitiesAsPromise : function(sSource) {
			var oController = this;
			return oController.oConfigurationEditor.getAllHierarchicalEntitySetsOfServiceAsPromise(sSource);
		},
		getHierarchicalProperty : function(sSource, sEntitySet) {
			var oController = this;
			return oController.oConfigurationEditor.getHierarchicalPropertiesOfEntitySetAsPromise(sSource, sEntitySet);
		},
		getHierarchyNodeIdAsPromise : function(sSource, sEntitySet, hierarchicalProperty) {
			var oController = this;
			return oController.oConfigurationEditor.getHierarchyNodeIdAsPromise(sSource, sEntitySet, hierarchicalProperty);
		},
		getSelectedHierarchicalProperty : function() {
			var oController = this;
			return oController.oParentObject.getHierarchyProperty();
		},
		getAllEntitySetPropertiesAsPromise : function(sSource, sEntitySet) {
			var oController = this;
			return oController.oConfigurationEditor.getNonHierarchicalPropertiesOfEntitySet(sSource, sEntitySet);
		},
		resetEntityAndProperties : function() {
			var oController = this;
			oController.clearEntity();
			oController.byId("idEntity").setModel(null);
			oController.byId("idEntity").setSelectedKey(undefined);
			oController.clearHierarchicalProperty();
			oController.byId("idOptionalProperty").setModel(null);
			oController.byId("idOptionalProperty").setSelectedKey(undefined);
			oController.clearSelectProperties();
			oController.byId("idSelectProperties").setModel(null);
			oController.byId("idSelectProperties").setSelectedKeys([]);
		},
		clearHierarchicalProperty : function() {
			var oController = this;
			oController.oParentObject.setHierarchyProperty(undefined);
		},
		updateHierarchicalProperty : function(sHierarchicalProperty) {
			var oController = this;
			oController.clearHierarchicalProperty();
			oController.oParentObject.setHierarchyProperty(sHierarchicalProperty);
		}
	});
});
