/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
jQuery.sap.require("sap.apf.modeler.ui.utils.optionsValueModelBuilder");
jQuery.sap.require("sap.apf.modeler.ui.utils.staticValuesBuilder");
jQuery.sap.require('sap.apf.modeler.ui.utils.constants');
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	"use strict";

	var propertiesSelectionControlNameConst = 'idSortProperty';
	var sortDirectionControlNameConst = 'idSortDirection';
	var optionsValueModelBuilder = sap.apf.modeler.ui.utils.optionsValueModelBuilder;
	var oTextManipulator = sap.apf.modeler.ui.utils.textManipulator;
	var oConstants = sap.apf.modeler.ui.utils.CONSTANTS.events;
	function _setDisplayText(oController) {
		oController.byId("idSortLabel").setText(oController.oTextReader("sortingField"));
		oController.byId("idSortLabel").setTooltip(oController.oTextReader("sortingField"));
		oController.byId("idSortDirectionLabel").setText(oController.oTextReader("direction"));
		oController.byId("idSortDirectionLabel").setTooltip(oController.oTextReader("direction"));
		oController.byId("idAddPropertyIcon").setTooltip(oController.oTextReader("addButton"));
		oController.byId("idRemovePropertyIcon").setTooltip(oController.oTextReader("deleteButton"));
	}
	function _setInvisibleTexts(oController) {
		if (sap.ui.Device.browser.msie && sap.ui.Device.browser.version >= 11){
			oController.byId("idAriaPropertyForSortGroup").setText(oController.oTextReader("sorting"));
		}
		oController.byId("idAriaPropertyForAdd").setText(oController.oTextReader("ariaTextForAddIcon"));
		oController.byId("idAriaPropertyForDelete").setText(oController.oTextReader("ariaTextForDeleteIcon"));
	}

	/**
	 * Sets all properties as list items of then value help control.
	 * @param {sap.apf.modeler.ui.controller.sortPropertyType} oController - of this class
	 * @private
	 */
	function _setSortProperty(oController) {
		var element = oController.byId(propertiesSelectionControlNameConst);
		oController.getAllPropertiesAsPromise().done(function(oResponse) { // by subclass representationSortPropertyType
			var oModelForProperties = optionsValueModelBuilder.convert(oResponse.aAllProperties);
			element.setModel(oModelForProperties);
			element.setSelectedKey(oResponse.sSelectedKey);
		});
	}
	/**
	 * Sets the sorting direction (ascending, descending), the values (translated) are proposed by the class sap.apf.modeler.ui.utils.StaticValuesBuilder.
	 * @param {sap.apf.modeler.ui.controller.sortPropertyType} oController - of this class
	 * @private
	 */
	function _setSortDirection(oController) {
		var element = oController.byId(sortDirectionControlNameConst);
		var staticValuesBuilder = new sap.apf.modeler.ui.utils.StaticValuesBuilder(oController.oTextReader, optionsValueModelBuilder);
		var oModelForSortDirections = staticValuesBuilder.getSortDirections();
		element.setModel(oModelForSortDirections);
		element.setSelectedKey(oController.getView().getViewData().oPropertyTypeData.sContext);
	}
	function _setVisibilityForAddAndRemoveIcons(oController) {
		var bShowAddIcon = true, bShowRemoveIcon = true;
		var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
		if (oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId()) === 0) {
			bShowRemoveIcon = false;
		}
		oController.byId("idAddPropertyIcon").setVisible(bShowAddIcon);
		oController.byId("idRemovePropertyIcon").setVisible(bShowRemoveIcon);
	}

	/**
	 * Accessibility.
	 * @param oController - this class
	 * @private
	 */
	function _attachEvent(oController) {
		oController.byId("idAddPropertyIcon").attachEvent(oConstants.SETFOCUSONADDICON, oController.setFocusOnAddRemoveIcons.bind(oController));
	}

	/**
	 * Common parent class for sorting in the step page and in the representation page.
	 * @constructor
	 */
	sap.ui.core.mvc.Controller.extend("sap.apf.modeler.ui.controller.sortPropertyType", {
		oConfigurationEditor : {},
		oParentObject : {},
		oStepPropertyMetadataHandler : {},
		oTextReader : {},
		// Called on initialization of the sub view and set the static texts and data for all controls in sub view
		onInit : function() {
			var oController = this;
			oController.oConfigurationEditor = oController.getView().getViewData().oConfigurationEditor;
			oController.oParentObject = oController.getView().getViewData().oParentObject;
			oController.oStepPropertyMetadataHandler = oController.getView().getViewData().oStepPropertyMetadataHandler;
			oController.oTextReader = oController.getView().getViewData().oCoreApi.getText;
			oController.setDetailData();
		},
		onAfterRendering : function() {
			var oController = this;
			oController.byId("idAddPropertyIcon").fireEvent(oConstants.SETFOCUSONADDICON);
		},
		// Called on initialization of the view to set data on fields of sub view
		setDetailData : function() {
			var oController = this;
			_setDisplayText(oController);
			_setInvisibleTexts(oController);
			_setSortProperty(oController);
			_setSortDirection(oController);
			_setVisibilityForAddAndRemoveIcons(oController);
			oController.disableView();
		},
		/**
		 * Method handles the UI event for change of property selection (@see sortPropertyType.view.xml).
		 */
		handleChangeForSortProperty : function(event) {
			var oController = this;
			var sSelectedPropertyName = oTextManipulator.removePrefixText(oController.byId(propertiesSelectionControlNameConst)
				.getSelectedKey(), oController.oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
			var oPropertyOrchestration = oController.getView().getViewData().oPropertyOrchestration;
			var sViewId = oController.getView().getId();

			return new Promise(function(resolve){
				oController.getView().fireEvent(oConstants.UPDATEPROPERTYVALUESTATE, { // dispatch to propertyTypeHandler, update propertyTypeState
					"sProperty" : sSelectedPropertyName
				});
				oPropertyOrchestration.updatePropertyTypeRow(sViewId, sSelectedPropertyName);
				oPropertyOrchestration.updateAllSelectControlsForPropertyType().then(function(){
					oController.updateOfConfigurationObject();
					oController.oConfigurationEditor.setIsUnsaved();
					resolve();
				});
			}); // the promise shall be used for unit tests.
		},
		/**
		 * Method handles the UI event for change of sort direction (@see sortPropertyType.view.xml).
		 * Note that the orchestration object needs not to be updated since the sorting direction will reside in the view.
		 * It will be fetched from the view e.g. when writing to the configuration object.
		 */
		handleChangeForSortDirection : function() {
			var oController = this;
			oController.updateOfConfigurationObject();
			oController.oConfigurationEditor.setIsUnsaved();
		},
		setFocusOnAddRemoveIcons : function() {
			var oController = this;
			oController.byId("idAddPropertyIcon").focus();
		},
		/**
		 * Handles the UI event that adds a new SortProperty (+ Icon).
		 */
		handlePressOfAddPropertyIcon : function() {
			var oController = this;
			_attachEvent(oController);
			oController.addPropertyAsPromise(); // updates 1st: the orchestration by adding a row, 2nd: the configuration, 3rd: all views.
		},
		/**
		 * Handles the UI event that removes a new SortProperty (+ Icon).
		 */
		handlePressOfRemovePropertyIcon : function() {
			var oController = this;
			var oViewData = oController.getView().getViewData();
			return new Promise(function(resolve){
				oController.getView().fireEvent(oConstants.FOCUSONREMOVE);
				var oPropertyOrchestration = oViewData.oPropertyOrchestration;
				oPropertyOrchestration.removePropertyTypeReference(oController.getView().getId());
				oPropertyOrchestration.updateAllSelectControlsForPropertyType().then(function(){
					oController.updateOfConfigurationObject();
					oViewData.oPropertyTypeHandlerBackLink.handlePressOfRemove({
						oSourceView: oController.getView()
					});
					oController.oConfigurationEditor.setIsUnsaved();
					oController.getView().destroy();
					resolve();
				});
			});
		},
		/**
		 * Updates the configuration object, which depending of the subclass is a step or a representation.
		 * The selected properties are taken from the orchestration object, "None" rows are filtered out.
		 * The direction is taken from the view object row.
		 */
		updateOfConfigurationObject : function() {
			var oController = this;
			var oPropertyOrchestration = oController.getView().getViewData().oPropertyOrchestration;
			var sortPropertyInformationList = oPropertyOrchestration.getSortPropertyInformationList(sortDirectionControlNameConst);
			oController.updateOfConfigurationObjectOfSubclass(sortPropertyInformationList);
		},
		/**
		 * Used in subclass.
		 * @returns {Object[]} - return array of property value state.
		 */
		getSelectedSortProperty : function() {
			var oController = this;
			var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
			var aCurrentSortPropertiesState = oPropertyTypeState.getPropertyValueState();
			var nCurrentViewIndex = oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
			return aCurrentSortPropertiesState[nCurrentViewIndex];
		},
		removeAllItemsFromDropDownList : function() {
			var oController = this;
			var valueHelp = oController.byId(propertiesSelectionControlNameConst);
			valueHelp.getItems().forEach(function(oItem) {
				valueHelp.removeItem(oItem);
			});
		},
		/**
		 * Method is called by the Orchestration logic and sets the drop down list.
		 * @param {string[]} aConsumableProperties
		 * @param {string[]} aAvailableProperties
		 * @param {string} selectedProperty
		 */
		setItemsOfDropDownList : function(aConsumableProperties, aAvailableProperties, selectedProperty) {
			function contains(list, item){
				return list.indexOf(item) !== -1;
			}
			var oController = this;
			var valueHelpView = oController.byId(propertiesSelectionControlNameConst);
			var isSelectedPropertyNone = (selectedProperty === oController.oTextReader("none"));
			var propertiesForDropDown = JSON.parse(JSON.stringify(aConsumableProperties));
			valueHelpView.addItem(new sap.ui.core.Item({
				key: oController.oTextReader("none"),
				text: oController.oTextReader("none")
			}));
			// when selected property is not available === not consumable && not-none: add selected key to dropDown if not already existing.
			if (!contains(propertiesForDropDown, selectedProperty) && !isSelectedPropertyNone){
				propertiesForDropDown.unshift(selectedProperty);
			}
			propertiesForDropDown = propertiesForDropDown.filter(function(item){
				return item !== oController.oTextReader("none");
			});
			propertiesForDropDown.forEach(function(sValue) {
				var unprefixedKey = sValue;
				if (!contains(aAvailableProperties, sValue) && !isSelectedPropertyNone){
					sValue = oTextManipulator.addPrefixText([ sValue ], oController.oTextReader)[0]; // Adds Not Available
				}
				var oItem = new sap.ui.core.Item({
					key : sValue,
					text : sValue
				});
				valueHelpView.addItem(oItem);
				if (unprefixedKey === selectedProperty){
					selectedProperty = sValue;
				}
			});
			valueHelpView.setSelectedKey(selectedProperty);
		},
		// Stubs to be implemented in sub views depending on sub view logic
		updateOfConfigurationObjectOfSubclass : function(aSortPropertiesInformation) {
		},
		getOrderBy : function() {
		},
		setNextPropertyInParentObject : function() {
		},
		removePropertyFromParentObject : function() {
		},
		disableView : function() {
		},
		addPropertyAsPromise : function() {
			return sap.apf.utils.createPromise();
		}
	});
}());
