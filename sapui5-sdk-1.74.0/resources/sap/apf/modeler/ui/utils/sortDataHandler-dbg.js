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
	var SortDataHandler = function(oParentView, oParentObject, oStepPropertyMetadataHandler, oTextReader) {
		this.oParentView = oParentView;
		this.oStepPropertyMetadataHandler = oStepPropertyMetadataHandler;
		this.oParentObject = oParentObject;
		this.oTextReader = oTextReader;
	};
	function createProperTypeHandlerView(oSortDataHandler, sTypeOfPropertyType, aPropertiesToBeCreated) {
		var oView;
		var oPropertyOrchestration = new propertyTypeOrchestration.PropertyTypeOrchestration();
		var oViewDataForPropertyType = {
			oConfigurationEditor : oSortDataHandler.oParentView.getViewData().oConfigurationEditor,
			oParentObject : oSortDataHandler.oParentObject,
			oCoreApi : oSortDataHandler.oParentView.getViewData().oCoreApi,
			oConfigurationHandler : oSortDataHandler.oParentView.getViewData().oConfigurationHandler,
			oStepPropertyMetadataHandler : oSortDataHandler.oStepPropertyMetadataHandler,
			sPropertyType : sTypeOfPropertyType
		};
		var oViewData = {
			oViewDataForPropertyType : oViewDataForPropertyType,
			aPropertiesToBeCreated : aPropertiesToBeCreated,
			oPropertyOrchestration : oPropertyOrchestration
		};
		oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.propertyTypeHandler",
			type : sap.ui.core.mvc.ViewType.XML,
			id : oSortDataHandler.oParentView.getController().createId("id" + sTypeOfPropertyType),
			viewData : oViewData
		});
		oSortDataHandler.oParentView.getController().byId("idSortLayout").insertItem(oView);
		oSortDataHandler.oParentView.attachEvent(modelerUiConstants.events.step.SETTOPNPROPERTIES, oView.getController().handleSettingTopNProperties.bind(oView.getController()));
	}
	function _prepareRowsToBeCreated(aSortProperties) {
		var aPropertiesToBeCreated = [];
		aSortProperties.forEach(function(oSortProperty) {
			aPropertiesToBeCreated.push({
				sProperty : oSortProperty.property,
				sContext : oSortProperty.ascending ? "true" : "false"
			});
		});
		return aPropertiesToBeCreated;
	}
	/**
	 * Method creates rows for sorting in the representation page.
	 */
	SortDataHandler.prototype.instantiateRepresentationSortData = function() {
		var rowsToBeCreated = _prepareRowsToBeCreated(this.oParentObject.getOrderbySpecifications());
		if (rowsToBeCreated.length === 0) {
			rowsToBeCreated = [ {
				sProperty : this.oTextReader("none"),
				sContext : "true"
			} ];
		}
		createProperTypeHandlerView(this, modelerUiConstants.propertyTypes.REPRESENTATIONSORT, rowsToBeCreated);
	};
	/**
	 * Method creates rows for sorting in the step page.
	 * The available properties are the properties of the step.
	 */
	SortDataHandler.prototype.instantiateStepSortData = function() {
		var rowsToBeCreated;
		this.destroySortData();
		if (this.oParentObject.getTopN() && this.oParentObject.getTopN().orderby.length !== 0) {
			rowsToBeCreated = _prepareRowsToBeCreated(this.oParentObject.getTopN().orderby);
		} else {
			rowsToBeCreated = [{
				sProperty : this.oStepPropertyMetadataHandler.getProperties()[0], // default
				sContext : "true"
			}];
		}
		createProperTypeHandlerView(this, modelerUiConstants.propertyTypes.STEPSORT, rowsToBeCreated);
	};
	SortDataHandler.prototype.destroySortData = function() {
		this.oParentView.getController().byId("idSortLayout").destroyItems();
	};
	return SortDataHandler;
}, true /*GLOBAL_EXPORT*/);
