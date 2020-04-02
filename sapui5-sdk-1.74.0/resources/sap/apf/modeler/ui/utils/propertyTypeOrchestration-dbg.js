/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define([
	'sap/apf/modeler/ui/utils/constants'
],function(ModelerConstants) {
	'use strict';

	/**
	 * Role: Provide value help list with property names each instance of the PropertyType class.
	 * 	Each instance is identified by an ID. The ID is used here to associate the value list, the selected value,
	 * 	and addition metadata.
	 * @name sap.apf.modeler.ui.utils.propertyTypeOrchestration#PropertyTypeOrchestration
	 * @constructor
	 */
	function PropertyTypeOrchestration(){
		var propertyTypeRows = [];
		this._getPropertyTypeRows = function(){ // public for test design
			return propertyTypeRows;
		};
		this.getPropertyTypeRow = function(sViewId){
			return propertyTypeRows.filter(function(singleRow){
				return (singleRow.controlId === sViewId);
			})[0]; // only one result expected
		};
		this.getPropertyTypeRowByPropertyName = function(sPropertyName){
			return propertyTypeRows.filter(function(singleRow){
				return (singleRow.propertyRowInformation.sProperty === sPropertyName);
			})[0]; // only one result expected
		};
		this.getSelectedProperties = function () {
			var selectedProperties = [];
			this._getPropertyTypeRows().forEach(function (singleRow) {
				selectedProperties.push(singleRow.propertyRowInformation.sProperty);
			});
			return selectedProperties;
		};
		/**
		 * Changes the selected property.
		 * @param {string} sViewId
		 * @param {string} selectedProperty
		 */
		this.updatePropertyTypeRow = function(sViewId, selectedProperty){
			this.getPropertyTypeRow(sViewId).propertyRowInformation.sProperty = selectedProperty;
		};
		/**
		 * This function returns the aggregationRole of the type (sap.apf.modeler.ui.utils.constants.propertyTypes) of the managed rows.
		 * @return {sap.apf.modeler.ui.utils.constants.aggregationRoles}
		 */
		this.getAggregationRole = function(){
			if (propertyTypeRows.length === 0){
				return null;
			}
			return module._mapPropertyType2AggregationRole(propertyTypeRows[0].sPropertyType); // [0]: all rows have the same type
		};
		/**
		 * Returns an Array of PropertyInformation objects extracted from the current rows managed by this class.
		 * The method is intended for directly updating all properties of an configuration-representation object.
		 * Then, it is mandatory that all corresponding rows of teh Orchestration object have been updated before calling this method.
		 * For example, in the case of a swap 2 rows must have been updated beforehand.
		 * @return {{sProperty: string, sKind: string, sTextLabelKey: string, sLabelDisplayOption: string}[]}
		 */
		this.getPropertyInformationList = function () {
			var that = this;
			var propertyInformation = [];
			this._getPropertyTypeRows().forEach(function (row) {
				var sProperty = row.propertyRowInformation.sProperty;
				var sTextLabelKey;
				switch (that._getPropertyTypeRows()[0].sPropertyType){
					case ModelerConstants.propertyTypes.DIMENSION:
					case ModelerConstants.propertyTypes.LEGEND:
						sTextLabelKey = row.oView.oViewData.oRepresentationHandler.oRepresentation.getDimensionTextLabelKey(sProperty);
						break;
					case ModelerConstants.propertyTypes.MEASURE:
						sTextLabelKey = row.oView.oViewData.oRepresentationHandler.oRepresentation.getMeasureTextLabelKey(sProperty);
						break;
					case ModelerConstants.propertyTypes.PROPERTY:
						sTextLabelKey = row.oView.oViewData.oRepresentationHandler.oRepresentation.getPropertyTextLabelKey(sProperty);
						break;
					case ModelerConstants.propertyTypes.HIERARCHIALCOLUMN:
						sTextLabelKey = row.oView.oViewData.oRepresentationHandler.oRepresentation.getHierarchyPropertyTextLabelKey(sProperty);
						break;
					default:
						// it is: ModelerConstants.propertyTypes.REPRESENTATIONSORT || ModelerConstants.propertyTypes.STEPSORT
						sTextLabelKey = null;
						break;
				}
				if (sProperty !== row.oView.getController().oTextReader("none")) {
					propertyInformation.push({
						sProperty: sProperty,
						sKind: row.propertyRowInformation.sContext,
						sTextLabelKey: sTextLabelKey,
						sLabelDisplayOption: row.oView.oViewData.oRepresentationHandler.oRepresentation.getLabelDisplayOption(sProperty), // undefined in the case of measures
						sMeasureDisplayOption: row.oView.oViewData.oRepresentationHandler.oRepresentation.getMeasureDisplayOption(sProperty)
					});
				}
			});
			return propertyInformation;
		};
		/**
		 * Returns an Array of SortPropertyInformation objects extracted from the current rows managed by this class.
		 * Excludes "none" rows.
		 * The method is intended for directly updating all properties of an configuration-representation object.
		 * Then, the rows should have been updated before calling this method.
		 * @return {{property: string, ascending: boolean}[]}
		 */
		this.getSortPropertyInformationList = function(sortDirectionControlNameConst) {
			return this._getPropertyTypeRows().filter(function(row){
				var sProperty = row.propertyRowInformation.sProperty;
				return (sProperty !== row.oView.getController().oTextReader("none"));
			}).map(function(row){
				return {
					property : row.propertyRowInformation.sProperty,
					ascending: row.oView.getController().byId(sortDirectionControlNameConst).getSelectedKey() === "true" ? true : false
				};
			});
		};
		/**
		 * Registers the Control and its view, and its selected property (by key "sProperty").
		 * @param {String} controlId - view ID of control (for class propertyType or sortPropertyType)
		 * @param {{sProperty: string, sContext: string, bMandatory: boolean}} propertyRowInformation which represents the selected property in the referenced control.
		 * @param {sap.apf.modeler.ui.utils.constants.propertyTypes} sPropertyType - e.g. Measures, Dimensions, Legends, ..
		 * @param {sap.ui.View} oView
		 */
		this.addPropertyTypeReference = function(controlId, propertyRowInformation, sPropertyType, oView){
			propertyTypeRows.push({
				controlId : controlId,
				propertyRowInformation : propertyRowInformation,
				sPropertyType : sPropertyType,
				oView : oView
			});
		};
		this.removePropertyTypeReference = function(controlId){
			propertyTypeRows.forEach(function(singleRow, index){
				if(singleRow.controlId === controlId){
					propertyTypeRows.splice(index, 1);
				}
			});
		};
		/**
		 * Updates by _updateDropDownOfAControl all rows managed by the class.
		 * @private
		 * @return {Promise}
		 */
		this.updateAllDropDownsAsPromise = function(){
			return new Promise(function(resolve){
				_resolveUpdateOfAllControls(resolve);
			});
		};
		function _resolveUpdateOfAllControls(resolveOuter){
			var listOfPromises = [];
			propertyTypeRows.forEach(function(oRow){
				listOfPromises.push(module._updateDropDownOfAControl(oRow));
			});
			Promise.all(listOfPromises).then(function() {
				resolveOuter();
			});
		}
		/**
		 * Update internal state of registered instances of PropertyType.
		 * In case the parameters are passed, an update would be made to the respective property type row control with the new value.
		 * @param {String} [sViewId] - The view id of the property type row control to be updated
		 * @param {String} [selectedProperty] - the value with which the property type row control will be updated
		 * @return {Promise}
		 */
		this.updateAllSelectControlsForPropertyType = function(sViewId, selectedProperty){
			var that = this;
			return new Promise(function(resolve) {
				if (sViewId && selectedProperty) {
					if (that.isSwapCase(sViewId, selectedProperty)) {
						that._swapPropertiesBetweenControls(sViewId, selectedProperty).then(function() {
							_resolveUpdateOfAllControls(resolve);
						});
					} else {
						that.updatePropertyTypeRow(sViewId, selectedProperty);
						_resolveUpdateOfAllControls(resolve);
					}
				} else {
					_resolveUpdateOfAllControls(resolve);
				}
			});
		};
		/**
		 * Before a call to updateAllSelectControlsForPropertyType, this method can determine whether a property is already selected.
		 * The method is designed for detecting the case of a swap of two properties.
		 * @param {String} sSelectedPropertyName
		 * @return {Boolean}
		 */
		this.isSwapCase = function (sViewId, sSelectedPropertyName){
			return (module._mapPropertyType2AggregationRole(this.getPropertyTypeRow(sViewId).sPropertyType) === ModelerConstants.aggregationRoles.MEASURE
				&& module._isPropertyAlreadySelected(this.getSelectedProperties(), sSelectedPropertyName));
		};
		/**
		 * This method swaps the Properties of two PropertyTypeRows A and B.
		 * A is the PropertyTypeRow where the swap is triggered from (where a new selection is made).
		 * B is the PropertyTypeRow that contains the in A newly selected Property.
		 *
		 * @param {string} viewId - The viewId of the view of PropertyTypeRow A
		 * @param {string} newProperty - The in PropertyTypeRow A newly selected Property
		 * @return {Promise}
		 */
		this._swapPropertiesBetweenControls = function(viewId, newProperty){
			var context = this;
			return new Promise(function(resolve){
				var propertyTypeRowA = context.getPropertyTypeRow(viewId);
				var propertyTypeRowB;
				var sOldProperty = propertyTypeRowA.propertyRowInformation.sProperty;

				// retrieve PropertyTypeRowB to swap the property with
				context._getPropertyTypeRows().forEach(function(row){
					if (row.propertyRowInformation.sProperty === newProperty){
						propertyTypeRowB = context.getPropertyTypeRow(row.controlId);
					}
				});

				// swap properties
				propertyTypeRowB.propertyRowInformation.sProperty = sOldProperty;
				propertyTypeRowA.propertyRowInformation.sProperty = newProperty;
				// Set Label, etc. for B (A is already set by UI event handler for change of selection)
				context.updateAllDropDownsAsPromise().then(function(){
					propertyTypeRowB.oView.getController().setDetailData();
					resolve();
				});
			});
		};
	}

	var module = {
		/**
		 * Re-Build the drop down control of the PropertyType including the selected item.
		 * @param {Object} oPropertyTypeRow - object type @see sap.apf.modeler.ui.utils.PropertyTypeOrchestration#addPropertyTypeReference
		 */
		_updateDropDownOfAControl: function(oPropertyTypeRow) {
			var promise = new Promise(function(resolve){
				var aggregationRole = module._mapPropertyType2AggregationRole(oPropertyTypeRow.sPropertyType);
				var oViewData = oPropertyTypeRow.oView.getViewData();
				var oPropertyTypeOrchestration = oPropertyTypeRow.oView.getViewData().oPropertyOrchestration;
				var oStepPropertyMetadataHandler = oViewData.oStepPropertyMetadataHandler;
				var parentConfigObjId = oViewData.oParentObject.getId();
				var selectedPropertyKey = oPropertyTypeRow.propertyRowInformation.sProperty;
				var isSelectedPropertyMandatory = oPropertyTypeRow.propertyRowInformation.bMandatory;
				// hierarchical steps only allow sorting on measures
				var oStep = oStepPropertyMetadataHandler.oStep;
				var isHierarchicalStep = oStep.getType() === "hierarchicalStep";
				if (isHierarchicalStep && oPropertyTypeRow.sPropertyType === ModelerConstants.propertyTypes.REPRESENTATIONSORT){
					aggregationRole = ModelerConstants.aggregationRoles.MEASURE;
				}
				module.getConsumableAndAvailablePropertiesAsPromise(parentConfigObjId, aggregationRole, oStepPropertyMetadataHandler)
					.then(function(updatedFilteredProperties) {
						var oController = oPropertyTypeRow.oView.getController();
						oController.removeAllItemsFromDropDownList();
						var selectedProperties = oPropertyTypeOrchestration.getSelectedProperties();
						// Every available property that is not selected is consumable
						var consumableProperties = module._relativeComplement(updatedFilteredProperties.available, selectedProperties);
						oController.setItemsOfDropDownList(consumableProperties, updatedFilteredProperties.available, selectedPropertyKey, isSelectedPropertyMandatory, aggregationRole);
						resolve();
					});
			});
			return promise;
		},
		/**
		 * First maps the selected key such that the result string reflects the property's availability (in the metadata).
		 * Second, it includes the mapped key in a list of selected keys.
		 * @param {String[]} aProperties
		 * @param {String} sSelectedKey
		 * @param {Object} oController
		 * @param {{available: Object}} aAvailable
		 * @param {Function} addPrefixText
		 * @returns {{aAllProperties: {String[]}, sSelectedKey: String}}
		 * @private
		 */
		getPropertyListAndSelectedKey: function(aProperties, sSelectedKey, oController, aAvailable, addPrefixText){
			function contains(list, item){
				return list.indexOf(item) !== -1;
			}
			function applyAvailability(sSelectedKey, aAvailable){
				// if sSelectedKey is not available, then sSelectedKey is assigned to be its prefixed "non-available" version.
				return contains(aAvailable.available, sSelectedKey)
					? sSelectedKey
					: addPrefixText([ sSelectedKey ], oController.oTextReader)[0];
			}
			function givenKeyIsNotNone(sSelectedKey){
				return sSelectedKey !== oController.oTextReader("none") && sSelectedKey !== undefined;
			}
			var aSelectableProperties = JSON.parse(JSON.stringify(aProperties));
			var sSelectedKeyWithAvailability = applyAvailability(sSelectedKey, aAvailable);
			if (givenKeyIsNotNone(sSelectedKey) && !contains(aProperties, sSelectedKey)) {
				aSelectableProperties = aProperties.concat(sSelectedKeyWithAvailability);
			}
			if (!oController.oView.oViewData.oPropertyTypeData.bMandatory){
				aSelectableProperties.splice(0, 0, oController.oTextReader("none"));
			}
			return {
				aAllProperties : aSelectableProperties,
				sSelectedKey : sSelectedKeyWithAvailability
			};
		},
		_mapPropertyType2AggregationRole: function(sPropertyType) {
			switch (sPropertyType) {
				case ModelerConstants.propertyTypes.DIMENSION:
				case ModelerConstants.propertyTypes.LEGEND:
					return ModelerConstants.aggregationRoles.DIMENSION;
				case ModelerConstants.propertyTypes.MEASURE:
					return ModelerConstants.aggregationRoles.MEASURE;
				default:
					return null;
			}
		},
		/**
		 * Get all consumable property names from the step configuration, which is accessible by the id of the representation controller.
		 * @name sap.apf.modeler.ui.utils.propertyTypeOrchestration#getConsumableAndAvailablePropertiesAsPromise
		 * @param {string} parentConfigObjId - used to identify either a representation configuration obj or a step object.
		 * @param {string} desiredAggregationRole enum: oConstants.aggregationRoles.MEASURE/DIMENSION/LEGEND
		 * @param {object} oStepPropertyMetadataHandler - controller of StepPropertyMetadataHandler
		 * @returns {Promise}
		 */
		getConsumableAndAvailablePropertiesAsPromise: function (parentConfigObjId, desiredAggregationRole, oStepPropertyMetadataHandler) {
			var promise = new Promise(function(resolve){
				oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().then(function(entityTypeMetadata) {
					var oStep = oStepPropertyMetadataHandler.oStep;
					oStep.getConsumablePropertiesForRepresentation(parentConfigObjId).then(function(consumableAndAvailableProperties) {
						var aFilteredConsumable = consumableAndAvailableProperties.consumable.filter(
							function(sProperty){
								var oMetadata = oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty);
								return (!desiredAggregationRole || oMetadata && oMetadata["aggregation-role"] === desiredAggregationRole);
							}
						);
						var aFilteredAvailable = consumableAndAvailableProperties.available.filter(
							function(sProperty){
								var oMetadata = oStepPropertyMetadataHandler.getPropertyMetadata(entityTypeMetadata, sProperty);
								return (!desiredAggregationRole || oMetadata && oMetadata["aggregation-role"] === desiredAggregationRole);
							}
						);
						resolve({
							available: aFilteredAvailable,
							consumable: aFilteredConsumable
						});
					});
				});
			});
			return promise;
		},
		/**
		 * This function returns the relative complement of the parameters "a" and "b".
		 * return a\b
		 *
		 * @param {string[]} a - array from which all item from "b" shall be removed from
		 * @param {string[]} b - items that shall be subtracted from "a"
		 * @returns {string[]}
		 * @private
		 */
		_relativeComplement : function(a, b){
			var filteredArray = JSON.parse(JSON.stringify(a)); // deep copy to not interfere with the original objects
			b.forEach(function (valueToBeRemoved) {
				filteredArray = filteredArray.filter(function (valueFromA) {
					return valueFromA !== valueToBeRemoved;
				});
			});
			return filteredArray;
		},
		/**
		 * This function checks if the property we would like to select is already selected in another control within a
		 * propertyTypeRow belonging to this orchestration object.
		 *
		 * @param {string[]} aSelectedProperties - list of properties already selected in all controls
		 * @param {string} sProperty - new property to be selected in the control
		 * @returns {boolean}
		 * @private
		 */
		_isPropertyAlreadySelected : function (aSelectedProperties, sProperty){
			function contains(list, item){
				return list.indexOf(item) !== -1;
			}
			return contains(aSelectedProperties, sProperty);
		},
		PropertyTypeOrchestration: PropertyTypeOrchestration
	};
	return module;
});
