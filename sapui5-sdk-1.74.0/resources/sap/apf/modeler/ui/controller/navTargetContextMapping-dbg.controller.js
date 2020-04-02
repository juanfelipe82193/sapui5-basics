/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap*/
jQuery.sap.require("sap.apf.modeler.ui.controller.requestOptions");
(function() {
	"use strict";
	var textManipulator = sap.apf.modeler.ui.utils.textManipulator;
	sap.apf.modeler.ui.controller.requestOptions.extend("sap.apf.modeler.ui.controller.navTargetContextMapping", {
		setDisplayText : function() {
			var oController = this;
			var oTextReader = oController.getView().getViewData().oTextReader;
			oController.byId("idSourceLabel").setText(oTextReader("source"));
			oController.byId("idEntityLabel").setText(oTextReader("entity"));
			oController.byId("idSelectPropertiesLabel").setVisible(false);
			oController.byId("idSelectProperties").setVisible(false);
			oController.byId("idOptionalPropertyLabel").setVisible(true);
			oController.byId("idOptionalPropertyLabel").setText(oTextReader("mappedProperty"));
			oController.byId("idOptionalProperty").setVisible(true);
		},
		getSource : function() {
			var oController = this;
			return oController.oParentObject.getFilterMappingService();
		},
		getAllEntitiesAsPromise : function(sSource) {
			var oController = this;
			return oController.oConfigurationEditor.getAllEntitySetsOfServiceAsPromise(sSource);
		},
		getEntity : function() {
			var oController = this;
			return oController.oParentObject.getFilterMappingEntitySet();
		},
		getAllEntitySetPropertiesAsPromise : function(sSource, sEntitySet) {
			var oController = this;
			return oController.oConfigurationEditor.getAllPropertiesOfEntitySetAsPromise(sSource, sEntitySet);
		},
		clearSource : function() {
			var oController = this;
			oController.oParentObject.setFilterMappingService(undefined);
			oController.clearEntity();
		},
		clearEntity : function() {
			var oController = this;
			oController.oParentObject.setFilterMappingEntitySet(undefined);
			oController.clearSelectProperties();
		},
		clearSelectProperties : function() {
			var oController = this;
			var aOldSelProp = oController.oParentObject.getFilterMappingTargetProperties();
			aOldSelProp.forEach(function(property) {
				oController.oParentObject.removeFilterMappingTargetProperty(property);
			});
		},
		removeSelectProperties : function(aProperties) {
			var oController = this;
			aProperties.forEach(function(property) {
				oController.oParentObject.removeFilterMappingTargetProperty(property);
			});
		},
		updateSource : function(sSource) {
			var oController = this;
			oController.oParentObject.setFilterMappingService(sSource);
		},
		updateEntity : function(sEntity) {
			var oController = this;
			oController.oParentObject.setFilterMappingEntitySet(sEntity);
		},
		updateSelectProperties : function(aSelectProperties) {
			var oController = this;
			oController.clearSelectProperties();
			aSelectProperties.forEach(function(property) {
				oController.oParentObject.addFilterMappingTargetProperty(property);
			});
		},
		getSelectProperties : function() {
			var oController = this;
			return oController.oParentObject.getFilterMappingTargetProperties();
		},
		getValidationState : function() {
			var oController = this;
			return oController.viewValidator.getValidationState();
		},
		getIdOfPropertiesControl : function() {
			return "idOptionalProperty";
		},
		getIdOfPropertyLabel : function() {
			return "idOptionalPropertyLabel";
		},
		setSelectedKeysForProperties : function(aProperties){
			if(aProperties.length > 0 ){
				this.byId("idOptionalProperty").setSelectedKey(aProperties[0]);
			}
		},
		getSelectedKeysForProperties : function(){
			return this.oParentObject.getFilterMappingTargetProperties();
		},
		handleChangeForOptionalProperty : function(){
			var oController = this;
			var oTextReader = oController.getView().getViewData().oTextReader;
			var selectedProperty = this.byId("idOptionalProperty").getSelectedKey();
			selectedProperty = textManipulator.removePrefixText(selectedProperty, oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			oController.updateSelectProperties([selectedProperty]);
			oController.oConfigurationEditor.setIsUnsaved();
		}
	});
}());