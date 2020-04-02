/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/modeler/ui/utils/constants",
	"sap/apf/modeler/ui/utils/propertyTypeOrchestration"
], function(modelerUiConstants, propertyTypeOrchestration){
	'use strict';

	/**
	 * Creates a PropertyTypeHandler, which itself manages a group of PropertyTypes.
	 * @param {object} oRepresentationView @see sap.apf.modeler.view.representation and @see sap.apf.modeler.ui.controller.representation
	 * @param {object} oStepPropertyMetadataHandler @see sap.apf.modeler.ui.utils.StepPropertyMetadataHandler
	 * @param {object} oRepresentationHandler @see sap.apf.modeler.ui.utils.representationHandler
	 * @param {object} oViewValidator @see sap.apf.modeler.ui.utils.viewValidator
	 * @constructor
	 */
	function RepresentationBasicDataHandler(oRepresentationView, oStepPropertyMetadataHandler, oRepresentationHandler, oViewValidator) {
		this.oRepresentationView = oRepresentationView;
		this.oRepresentation = oRepresentationHandler.oRepresentation;
		this.oStepPropertyMetadataHandler = oStepPropertyMetadataHandler;
		this.oRepresentationTypeHandler = oRepresentationHandler.oRepresentationTypeHandler;
		this.oRepresentationHandler = oRepresentationHandler;
		this.nCounter = 0;
		this.oViewValidator = oViewValidator;
		this.propertyTypeHandlerPromises = [];
	}

	/**
	 * Creates a PropertyTypeHandler which aggregates all PropertyTypes for a given sPropertyType (e.g. all rows for measures).
	 * @param {RepresentationBasicDataHandler} oRepresentationBasicDataHandler
	 * @param {sap.apf.modeler.ui.utils.constants.propertyTypes} sPropertyType : measures, dimensions, legends
	 * @param {{sContext:string, sProperty:string, bMandatory:boolean}[]} aPropertyTypeHandlersToBeCreated : property information, members: sContext (xAxis, yAxis, legend, ..), sProperty: String (property name), bMandatory: boolean
	 * @param {PropertyTypeOrchestration} oPropertyOrchestration
	 * @private
	 */
	RepresentationBasicDataHandler.prototype._prepareCommonView = function(oRepresentationBasicDataHandler, sPropertyType, aPropertyTypeHandlersToBeCreated, oPropertyOrchestration) {
		var oView, 
			oViewData = {}, 
			oViewDataForPropertyType = {};
		if (aPropertyTypeHandlersToBeCreated.length === 0) {
			return;
		}
		oViewDataForPropertyType.oConfigurationEditor = oRepresentationBasicDataHandler.oRepresentationView.getViewData().oConfigurationEditor;
		oViewDataForPropertyType.oParentObject = oRepresentationBasicDataHandler.oRepresentation;
		oViewDataForPropertyType.oCoreApi = oRepresentationBasicDataHandler.oRepresentationView.getViewData().oCoreApi;
		oViewDataForPropertyType.oConfigurationHandler = oRepresentationBasicDataHandler.oRepresentationView.getViewData().oConfigurationHandler;
		oViewDataForPropertyType.oRepresentationTypeHandler = oRepresentationBasicDataHandler.oRepresentationTypeHandler;
		oViewDataForPropertyType.oRepresentationHandler = oRepresentationBasicDataHandler.oRepresentationHandler;
		oViewDataForPropertyType.oStepPropertyMetadataHandler = oRepresentationBasicDataHandler.oStepPropertyMetadataHandler;
		oViewDataForPropertyType.sPropertyType = sPropertyType;
		oViewDataForPropertyType.oBasicDataLayout = oRepresentationBasicDataHandler.oRepresentationView.getController().byId("idBasicDataLayout");
		oViewDataForPropertyType.oTextPool = oRepresentationBasicDataHandler.oRepresentationView.getViewData().oConfigurationHandler.getTextPool();
		oViewDataForPropertyType.oViewValidator = oRepresentationBasicDataHandler.oViewValidator;
		oViewData.oViewDataForPropertyType = oViewDataForPropertyType;
		oViewData.aPropertiesToBeCreated = aPropertyTypeHandlersToBeCreated;
		oViewData.oPropertyOrchestration = oPropertyOrchestration;
		oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.propertyTypeHandler",
			type : sap.ui.core.mvc.ViewType.XML,
			id : oRepresentationBasicDataHandler.oRepresentationView.getController().createId("id" + sPropertyType),
			viewData : oViewData
		});
		oRepresentationBasicDataHandler.oRepresentationView.getController().byId("idBasicDataLayout").insertItem(oView, oRepresentationBasicDataHandler.nCounter);
		oRepresentationBasicDataHandler.nCounter++;
		oRepresentationBasicDataHandler.oRepresentationView.attachEvent(modelerUiConstants.events.REMOVEALLPROPERTIESFROMPARENTOBJECT, 
				oView.getController().handleRemoveOfProperty.bind(oView.getController()));
		oRepresentationBasicDataHandler.propertyTypeHandlerPromises.push(oView.getController().initPromise);
	};
	function _instantiateDimensionView(oRepresentationBasicDataHandler, oPropertyOrchestration) {
		oRepresentationBasicDataHandler._prepareCommonView(oRepresentationBasicDataHandler, modelerUiConstants.propertyTypes.DIMENSION, oRepresentationBasicDataHandler.oRepresentationHandler.getActualDimensions(), oPropertyOrchestration); //getActualDimensions() returns a list of default dimensions for the form, not all selected properties qualifying as dimensions
	}
	function _instantiateLegendView(oRepresentationBasicDataHandler, oPropertyOrchestration) {
		oRepresentationBasicDataHandler._prepareCommonView(oRepresentationBasicDataHandler, modelerUiConstants.propertyTypes.LEGEND, oRepresentationBasicDataHandler.oRepresentationHandler.getActualLegends(), oPropertyOrchestration);
	}
	function _instantiateMeasureView(oRepresentationBasicDataHandler, oPropertyOrchestration) {
		oRepresentationBasicDataHandler._prepareCommonView(oRepresentationBasicDataHandler, modelerUiConstants.propertyTypes.MEASURE, oRepresentationBasicDataHandler.oRepresentationHandler.getActualMeasures(), oPropertyOrchestration);
	}
	function _instantiatePropertyView(oRepresentationBasicDataHandler, oPropertyOrchestration) {
		oRepresentationBasicDataHandler._prepareCommonView(oRepresentationBasicDataHandler, modelerUiConstants.propertyTypes.PROPERTY, oRepresentationBasicDataHandler.oRepresentationHandler.getActualProperties(), oPropertyOrchestration);
	}
	function _instantiateHierarchicalPropertyView(oRepresentationBasicDataHandler, oPropertyOrchestration) {
		oRepresentationBasicDataHandler._prepareCommonView(oRepresentationBasicDataHandler, modelerUiConstants.propertyTypes.HIERARCHIALCOLUMN, oRepresentationBasicDataHandler.oRepresentationHandler.getHierarchicalProperty(), oPropertyOrchestration);
	}
	RepresentationBasicDataHandler.prototype.instantiateBasicDataAsPromise = function() {
		var basicDataHandler = this;
		var representationId = basicDataHandler.oRepresentation.getId();
		var promiseMetadataAndConfigurationLoaded = jQuery.Deferred();
		this.propertyTypeHandlerPromises.push(promiseMetadataAndConfigurationLoaded);
		propertyTypeOrchestration.getConsumableAndAvailablePropertiesAsPromise(representationId, modelerUiConstants.aggregationRoles.DIMENSION, basicDataHandler.oStepPropertyMetadataHandler)
			.then(function(aDimensionsAndLegends){
				propertyTypeOrchestration.getConsumableAndAvailablePropertiesAsPromise(representationId, modelerUiConstants.aggregationRoles.MEASURE, basicDataHandler.oStepPropertyMetadataHandler)
					.then(function(aMeasures){
						var oPropertyOrchestrationMeasures;
						var oPropertyOrchestrationDimensionsLegends;
						var oPropertyOrchestrationProperties;
						basicDataHandler.destroyBasicData();
						if (basicDataHandler.oRepresentation.getRepresentationType() === "TreeTableRepresentation") {
							oPropertyOrchestrationProperties = new propertyTypeOrchestration.PropertyTypeOrchestration();
							_instantiateHierarchicalPropertyView(basicDataHandler, oPropertyOrchestrationProperties);
							_instantiatePropertyView(basicDataHandler, oPropertyOrchestrationProperties);
						} else if (basicDataHandler.oRepresentation.getRepresentationType() === "TableRepresentation" ) {
							oPropertyOrchestrationProperties = new propertyTypeOrchestration.PropertyTypeOrchestration();
							_instantiatePropertyView(basicDataHandler, oPropertyOrchestrationProperties);
						} else {
							oPropertyOrchestrationDimensionsLegends = new propertyTypeOrchestration.PropertyTypeOrchestration();
							_instantiateDimensionView(basicDataHandler, oPropertyOrchestrationDimensionsLegends);
							_instantiateLegendView(basicDataHandler, oPropertyOrchestrationDimensionsLegends);
							oPropertyOrchestrationMeasures = new propertyTypeOrchestration.PropertyTypeOrchestration();
							_instantiateMeasureView(basicDataHandler, oPropertyOrchestrationMeasures);
						}
						promiseMetadataAndConfigurationLoaded.resolve();
					});
			});
		return jQuery.when.apply(jQuery, this.propertyTypeHandlerPromises);
	};
	RepresentationBasicDataHandler.prototype.destroyBasicData = function() {
		this.oViewValidator.clearFields();
		this.nCounter = 0;
		this.oRepresentationView.getController().byId("idBasicDataLayout").destroyItems();
	};
	return RepresentationBasicDataHandler;
});