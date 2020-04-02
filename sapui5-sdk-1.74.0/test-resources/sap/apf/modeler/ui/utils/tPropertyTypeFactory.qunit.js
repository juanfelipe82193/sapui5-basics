jQuery.sap.require('sap.apf.utils.utils');
sap.ui.define([
	'sap/apf/modeler/ui/utils/constants',
	'sap/apf/modeler/ui/utils/propertyTypeFactory'
], function(ModelerConstants, mPropertyTypeFactory) {
	'use strict';
	var oViewData;
	function _fnReturnEmptyArray() {
		return [];
	}
	function _doNothing() {
	}
	function _fnGetConsumableProperties() {
		var deferred = jQuery.Deferred();
		deferred.resolve({
			available : [],
			consumable : []
		});
		return deferred.promise();
	}
	oViewData = {
		oConfigurationEditor : {
			getAllPropertiesOfEntitySet : _doNothing
		},
		oCoreApi : {
			getText : _doNothing
		},
		oConfigurationHandler : {
			getTextPool : function() {
				var oFunctions = {};
				oFunctions.getTextsByTypeAndLength = _fnReturnEmptyArray;
				return oFunctions;
			}
		},
		oParentObject : {
			getLabelDisplayOption : _doNothing,
			getDimensionTextLabelKey : _doNothing,
			getMeasureTextLabelKey : _doNothing,
			getPropertyTextLabelKey : _doNothing,
			getRepresentationType : _doNothing,
			getHierarchyPropertyLabelDisplayOption : _doNothing,
			getService : _doNothing,
			getEntitySet : _doNothing,
			getId : _doNothing,
			getConsumablePropertiesForTopN : _fnGetConsumableProperties,
			getHierarchyPropertyTextLabelKey : _doNothing,
			setHierarchyPropertyTextLabelKey : _doNothing,
			setMeasureDisplayOption : _doNothing
		},
		oRepresentationTypeHandler : {
			getLabelsForChartType : _doNothing,
			isAdditionToBeEnabled : _doNothing,
			isCombinationChart : function(){return false;}
		},
		oRepresentationHandler : {},
		oStepPropertyMetadataHandler : {
			getDimensionsProperties : _fnReturnEmptyArray,
			getMeasures : _fnReturnEmptyArray,
			getDefaultLabel : _doNothing,
			getProperties : _fnReturnEmptyArray,
			oStep : {
				getTopN : function() {
					return {
						top : 10,
						orderby : _fnReturnEmptyArray
					};
				},
				getService : function() {
					return "testService1";
				},
				getEntitySet : function() {
					return "entitySet1";
				},
				getHierarchyProperty : function() {
					return "property1";
				},
				getConsumablePropertiesForRepresentation : _fnGetConsumableProperties,
				getConsumableSortPropertiesForRepresentation : _fnGetConsumableProperties,
				getConsumablePropertiesForTopN : _fnGetConsumableProperties
			},
			getEntityTypeMetadataAsPromise : function() {
				return sap.apf.utils.createPromise({});
			},
			getStepType : function() {
				return oViewData.isHierarchicalStep ? "hierarchicalStep" : "step";
			}
		},
		oPropertyTypeState : {
			getPropertyValueState : _fnReturnEmptyArray,
			indexOfPropertyTypeViewId : function() {
				return 0;
			}
		},
		oPropertyTypeData : {
			sProperty : "",
			sContext : ""
		}
	};
	QUnit.module("Property type state", {
		beforeEach : function(assert) {
		}
	});
	QUnit.test('When creating views of types dimension and legend', function(assert) {
		//arrange
		var oDimensionView, oLegendView;
		oViewData.sPropertyType = ModelerConstants.propertyTypes.DIMENSION;
		//action
		oDimensionView = mPropertyTypeFactory.createPropertyTypeView(oViewData, "sViewIdDimension");
		//assert
		assert.strictEqual(oDimensionView.getId(), "sViewIdDimension", 'then dimension view exists');
		//arrange
		oViewData.sPropertyType = ModelerConstants.propertyTypes.LEGEND;
		//action
		oLegendView = mPropertyTypeFactory.createPropertyTypeView(oViewData, "sViewIdLegend");
		//assert
		assert.strictEqual(oLegendView.getId(), "sViewIdLegend", 'then legend view exists');
	});
	QUnit.test('When creating view of type measure', function(assert) {
		//arrange
		var oMeasureView;
		oViewData.sPropertyType = ModelerConstants.propertyTypes.MEASURE;
		//action
		oMeasureView = mPropertyTypeFactory.createPropertyTypeView(oViewData, "sViewIdMeasure");
		//assert
		assert.strictEqual(oMeasureView.getId(), "sViewIdMeasure", 'then measure view exists');
	});
	QUnit.test('When creating view of type property', function(assert) {
		//arrange
		var oPropertyView;
		oViewData.sPropertyType = ModelerConstants.propertyTypes.PROPERTY;
		//action
		oPropertyView = mPropertyTypeFactory.createPropertyTypeView(oViewData, "sViewIdProperty");
		//assert
		assert.strictEqual(oPropertyView.getId(), "sViewIdProperty", 'then property view exists');
	});
	QUnit.test('When creating view of type representation sort', function(assert) {
		//arrange
		var oRepresentationSortView;
		oViewData.sPropertyType = ModelerConstants.propertyTypes.REPRESENTATIONSORT;
		//action
		oRepresentationSortView = mPropertyTypeFactory.createPropertyTypeView(oViewData, "sViewIdRepresentationSort");
		//assert
		assert.strictEqual(oRepresentationSortView.getId(), "sViewIdRepresentationSort", 'then representation sort view exists');
	});
	QUnit.test('When creating view of type step sort', function(assert) {
		//arrange
		var oStepSortView;
		oViewData.sPropertyType = ModelerConstants.propertyTypes.STEPSORT;
		//action
		oStepSortView = mPropertyTypeFactory.createPropertyTypeView(oViewData, "sViewIdStepSort");
		//assert
		assert.strictEqual(oStepSortView.getId(), "sViewIdStepSort", 'then step sort view exists');
	});
	QUnit.test('When creating view of type hierarchical column', function(assert) {
		//arrange
		var oStepSortView;
		oViewData.sPropertyType = ModelerConstants.propertyTypes.HIERARCHIALCOLUMN;
		oViewData.isHierarchicalStep = true;
		//action
		oStepSortView = mPropertyTypeFactory.createPropertyTypeView(oViewData, "sViewIdHierarchicalProperty");
		//assert
		assert.strictEqual(oStepSortView.getId(), "sViewIdHierarchicalProperty", 'then hierarchical property view exists');
	});
	QUnit.test('When creating view of type which doesnt exist', function(assert) {
		//arrange
		var oDefaultView;
		oViewData.sPropertyType = undefined;
		//action
		oDefaultView = mPropertyTypeFactory.createPropertyTypeView(oViewData, "sViewId");
		//assert
		assert.strictEqual(oDefaultView, undefined, 'then view is not created');
	});
});