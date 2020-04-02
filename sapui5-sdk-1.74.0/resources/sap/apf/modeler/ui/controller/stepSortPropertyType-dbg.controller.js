/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
jQuery.sap.require("sap.apf.modeler.ui.controller.sortPropertyType");
(function() {
	"use strict";
	sap.apf.modeler.ui.controller.sortPropertyType.extend("sap.apf.modeler.ui.controller.stepSortPropertyType", {
		onBeforeRendering : function() {
			var oController = this;
			oController.byId("idGridSortLabel").setSpan("L4 M4 S4");
			oController.byId("idGridSortProperty").setSpan("L2 M2 S2");
			oController.byId("idGridSortDirectionLabel").setSpan("L2 M2 S2");
			oController.byId("idGridSortDirection").setSpan("L2 M2 S2");
			oController.byId("idGridIconLayout").setSpan("L2 M2 S2");
		},
		updateOfConfigurationObjectOfSubclass : function(aSortPropertiesInformation) {
			var oController = this;
			oController.oParentObject.setTopNSortProperties(aSortPropertiesInformation);
		},
		getAllPropertiesAsPromise : function() {
			var oController = this, aAllProperties, sSelectedKey, aPropertiesWithSelectedKey;
			var oTextManipulator = sap.apf.modeler.ui.utils.textManipulator;
			var deferred = jQuery.Deferred();
			oController.oParentObject.getConsumablePropertiesForTopN().done(function(oResponse) {
				aAllProperties = oResponse.consumable;
				sSelectedKey = oController.getSelectedSortProperty();
				if (sSelectedKey !== undefined) {
					aPropertiesWithSelectedKey = aAllProperties.indexOf(sSelectedKey) !== -1 ? aAllProperties : aAllProperties.concat(sSelectedKey);
					aAllProperties = oResponse.available.indexOf(sSelectedKey) !== -1 ? aPropertiesWithSelectedKey : aAllProperties.concat(oTextManipulator.addPrefixText([ sSelectedKey ], oController.oTextReader));
					sSelectedKey = oResponse.available.indexOf(sSelectedKey) !== -1 ? sSelectedKey : oTextManipulator.addPrefixText([ sSelectedKey ], oController.oTextReader)[0];
				}
				deferred.resolve({
					aAllProperties : aAllProperties,
					sSelectedKey : sSelectedKey
				});
			});
			return deferred.promise();
		},
		getOrderBy : function() {
			var oController = this;
			return oController.oParentObject.getTopN().orderby;
		},
		setNextPropertyInParentObject : function() {
			var oController = this;
			oController.updateOfConfigurationObject();
			oController.byId("idSortDirection").setSelectedKey("true");
		},
		removePropertyFromParentObject : function() {
			var oController = this;
			oController.updateOfConfigurationObject();
		},
		addPropertyAsPromise : function() {
			var oController = this;
			var deferred = jQuery.Deferred();
			var oConstants = sap.apf.modeler.ui.utils.CONSTANTS.events;
			oController.oParentObject.getConsumablePropertiesForTopN().done(function(oResponse) {
				oController.getView().fireEvent(oConstants.ADDPROPERTY, {
					"oSourceView" : oController.getView(),
					"sProperty" : oResponse.consumable[0],
					"sContext" : oController.getView().getViewData().oPropertyTypeData.sContext
				});
				oController.oConfigurationEditor.setIsUnsaved();
				deferred.resolve();
			});
			return deferred.promise();
		}
	});
}());
