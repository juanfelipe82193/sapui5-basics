/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define([
	'sap/apf/modeler/ui/utils/constants'
], function(ModelerConstant) {
	'use strict';

	/**
	 * @constructor
	 */
	function constructor (){
	}
	sap.apf.modeler.ui.utils.PropertyTypeFactory = constructor;
	sap.apf.modeler.ui.utils.PropertyTypeFactory.prototype.constructor = sap.apf.modeler.ui.utils.PropertyTypeFactory;
	/**
	 * Creates a view of PropertyType of of one of its subclasses.
	 * @param oViewData
	 * @param sViewId
	 * @returns {*}
	 */
	function createPropertyTypeView(oViewData, sViewId) {
		var oView, oPropertyTypeController,
			sViewName = "sap.apf.modeler.ui.view.propertyType";
		switch (oViewData.sPropertyType) {
			case ModelerConstant.propertyTypes.DIMENSION:
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationDimension");
				break;
			case ModelerConstant.propertyTypes.MEASURE:
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationMeasure");
				break;
			case ModelerConstant.propertyTypes.LEGEND:
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationLegend");
				break;
			case ModelerConstant.propertyTypes.PROPERTY:
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationProperty");
				break;
			case ModelerConstant.propertyTypes.HIERARCHIALCOLUMN:
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationHierarchyProperty");
				break;
			case ModelerConstant.propertyTypes.REPRESENTATIONSORT:
				sViewName = "sap.apf.modeler.ui.view.sortPropertyType";
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationSortPropertyType");
				break;
			case ModelerConstant.propertyTypes.STEPSORT:
				sViewName = "sap.apf.modeler.ui.view.sortPropertyType";
				oPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.stepSortPropertyType");
				break;
			default:
				return undefined;
		}
		oView = new sap.ui.view({
			viewName : sViewName,
			type : sap.ui.core.mvc.ViewType.XML,
			id : sViewId,
			viewData : oViewData,
			controller : oPropertyTypeController
		});
		return oView;
	}
	sap.apf.modeler.ui.utils.PropertyTypeFactory.prototype.createPropertyTypeView = createPropertyTypeView;

	return { // expose as static method
		createPropertyTypeView: createPropertyTypeView
	};
}, true /*GLOBAL_EXPORT*/);