/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap*/
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.textManipulator");
jQuery.sap.require('sap.apf.utils.utils');
sap.ui.define([
	'sap/apf/modeler/ui/utils/constants',
	'sap/apf/modeler/ui/utils/optionsValueModelBuilder',
	'sap/apf/modeler/ui/utils/nullObjectChecker'
], function(ModelerConstants, optionsValueModelBuilder, nullObjectChecker) {
	"use strict";

	var oTextManipulator = sap.apf.modeler.ui.utils.textManipulator;
	var oConstants = ModelerConstants.events;
	var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.REPRESENTATION_LABEL;
	function _setDisplayTextForProperty(oController) {
		var sRepresentationType = oController.oRepresentation.getRepresentationType();
		var sKind = oController.getView().getViewData().oPropertyTypeData.sContext;
		var sPropertyText = oController.getView().getViewData().oRepresentationTypeHandler.getLabelsForChartType(oController.oTextReader, sRepresentationType, sKind);
		oController.byId("idPropertyTypeLabel").setText(sPropertyText);
		oController.byId("idPropertyTypeLabel").setTooltip(sPropertyText);
	}
	function _setInvisibleTexts(oController) {
		if (sap.ui.Device.browser.msie && sap.ui.Device.browser.version >= 11){
			oController.byId("idAriaPropertyForBasicDataGroup").setText(oController.oTextReader("basicData"));
		}
		oController.byId("idAriaPropertyForAdd").setText(oController.oTextReader("ariaTextForAddIcon"));
		oController.byId("idAriaPropertyForDelete").setText(oController.oTextReader("ariaTextForDeleteIcon"));
	}

	/**
	 * Sets the model, which triggers re-rendering of the PropertyType control.
	 * @param {PropertyType} oController
	 * @returns {Promise}
	 * @private
	 */
	function _setPropertyModelAsPromise(oController) {
		var oModelForProperties;
		var deferred = jQuery.Deferred();
		var oView = oController.byId("idPropertyType"); // access the view with id inside to parent
		oController.getAllPropertiesAsPromise().then(function(oResponse) {
			oModelForProperties = optionsValueModelBuilder.convert(oResponse.aAllProperties); // create a JSON model
			oView.setModel(oModelForProperties);
			oView.setSelectedKey(oResponse.sSelectedKey);
			deferred.resolve();
		});
		return deferred.promise();
	}
	function _setDisplayTextForPropertyLabel(oController) {
		var sPropertyName = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(ModelerConstants.texts.NOTAVAILABLE));
		var sTextForLabel = oController.getPropertyTextLabelKey(sPropertyName) ? oController.oTextReader("label") : oController.oTextReader("label") + " (" + oController.oTextReader("default") + ")";
		oController.byId("idPropertyLabel").setText(sTextForLabel);
		oController.byId("idPropertyLabel").setTooltip(sTextForLabel);
	}

	/**
	 * Set the label text for a property by calling setValue.
	 * @param {PropertyType} oController
	 * @private
	 */
	function _setPropertyLabelText(oController) {
		var sPropertyLabelText;
		var sPropertyName = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(ModelerConstants.texts.NOTAVAILABLE));
		var sPropertyLabelKey = oController.getPropertyTextLabelKey(sPropertyName);
		if (nullObjectChecker.checkIsNotUndefined(sPropertyLabelKey)) {
			sPropertyLabelText = oController.getView().getViewData().oConfigurationHandler.getTextPool().get(sPropertyLabelKey).TextElementDescription;
			oController.byId("idPropertyLabelText").setValue(sPropertyLabelText);
		} else {
			oController.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().then(function(entityTypeMetadata) {
				var labelText = oController.oStepPropertyMetadataHandler.getDefaultLabel(entityTypeMetadata, sPropertyName);
				oController.byId("idPropertyLabelText").setValue(labelText);
			});
		}
	}
	function _setDisplayTooltipForAddAndRemoveIcons(oController) {
		oController.byId("idAddPropertyIcon").setTooltip(oController.oTextReader("addButton"));
		oController.byId("idRemovePropertyIcon").setTooltip(oController.oTextReader("deleteButton"));
	}
	function _setVisibilityForAddAndRemoveIcons(oController) {
		var sPropertyType = oController.getView().getViewData().sPropertyType;
		var sKind = oController.getView().getViewData().oPropertyTypeData.sContext;
		var bShowAddIcon = oController.oRepresentationTypeHandler.isAdditionToBeEnabled(oController.oRepresentation.getRepresentationType(), sPropertyType, sKind);
		var bShowRemoveIcon = bShowAddIcon;
		var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
		var nIndex = oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
		if (nIndex === 0) {
			bShowRemoveIcon = false;
		} else if (nIndex > 0) {
			var oPreviousPropertyView = oPropertyTypeState.getViewAt(nIndex - 1);
			var sPreviousRowKind = oPreviousPropertyView.getViewData().oPropertyTypeData.sContext;
			if (sKind !== sPreviousRowKind) {
				bShowRemoveIcon = false;
			}
		}
		oController.byId("idAddPropertyIcon").setVisible(bShowAddIcon);
		oController.byId("idRemovePropertyIcon").setVisible(bShowRemoveIcon);
	}
	function _attachEvent(oController) {
		oController.byId("idAddPropertyIcon").attachEvent(oConstants.SETFOCUSONADDICON, oController.setFocusOnAddRemoveIcons.bind(oController));
	}

	var constructor = sap.ui.core.mvc.Controller.extend("sap.apf.modeler.ui.controller.propertyType", {
		_apfName : "propertyType",
		oConfigurationEditor : {},
		oRepresentation : {}, // the configuration object: sap.apf.modeler.core.representation
		oStepPropertyMetadataHandler : {},
		oRepresentationTypeHandler : {},
		oTextReader : {},
		oTextPool : {},
		initPromise : null,
		onInit : function() {
			var oController = this;
			oController.initPromise = new jQuery.Deferred();
			oController.oConfigurationEditor = oController.getView().getViewData().oConfigurationEditor;
			// a configuration object for representation
			oController.oRepresentation = oController.getView().getViewData().oParentObject;
			oController.oStepPropertyMetadataHandler = oController.getView().getViewData().oStepPropertyMetadataHandler;
			oController.oRepresentationTypeHandler = oController.getView().getViewData().oRepresentationTypeHandler;
			oController.oTextReader = oController.getView().getViewData().oCoreApi.getText;
			oController.oTextPool = oController.getView().getViewData().oTextPool;
			if (oController.getView().getViewData().oPropertyTypeData.bMandatory){
				oController.getView().getViewData().oViewValidator.addField(oController.byId("idPropertyType").getId());
				oController.byId("idPropertyTypeLabel").setRequired(true);
			}
			_setPropertyModelAsPromise(oController).then(function() {
				oController.setDetailData().then(function() {
					oController.initPromise.resolve();
				});
			});
		},
		onAfterRendering : function() {
			var oController = this;
			oController.initPromise.then(function() {
				oController.enableDisableLabelDisplayOptionTypeAsPromise().then(function() {
					oController.byId("idAddPropertyIcon").fireEvent(oConstants.SETFOCUSONADDICON);
				});
			});
		},
		/**
		 * Using setLabelDisplayOptionTypeAsPromise (of the subclass) it calls the method setModel() of a PropertyType view and hence triggers a view refresh.
		 * @returns {Promise}
		 */
		setDetailData : function() {
			var deferred = jQuery.Deferred();
			var oController = this;
			oController.setLabelDisplayOptionTypeAsPromise(optionsValueModelBuilder).then(function() {
				if (!oController.byId("idPropertyType")) {
					deferred.resolve();
					return;
				}
				_setPropertyLabelText(oController);
				_setInvisibleTexts(oController);
				_setDisplayTextForPropertyLabel(oController);
				_setDisplayTextForProperty(oController);
				_setDisplayTooltipForAddAndRemoveIcons(oController);
				_setVisibilityForAddAndRemoveIcons(oController);
				deferred.resolve();
			});
			return deferred.promise();
		},
		/**
		 * Called when a user changes the selection of a property.
		 * It is the UI event handler registered on the PropertyTypeView.
		 * Delegates by event the update of PropertyType value state to the method PropertyTypeHandler.updatePropertyValueState
		 * @param {{getParameters: Function}} event : parameters.id, parameters.selectedItem
		 * @returns {Promise}
		 */
		handleChangeForPropertyTypeAsPromise : function(event) {
			var oController = this;
			var deferred = jQuery.Deferred();
			var sSelectedPropertyName = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(ModelerConstants.texts.NOTAVAILABLE));
			var oPropertyOrchestration = oController.getView().getViewData().oPropertyOrchestration;
			var viewId = oController.getView().getId();
			var isSwapCase;
			var dependentRow = null;
			if (oPropertyOrchestration){
				isSwapCase = oPropertyOrchestration.isSwapCase(viewId, sSelectedPropertyName);
				dependentRow = oPropertyOrchestration.getPropertyTypeRowByPropertyName(sSelectedPropertyName);
				oPropertyOrchestration.updateAllSelectControlsForPropertyType(viewId, sSelectedPropertyName).then(function(){
					var dependentController;
					oController.updateRepresentationAndView().then(function() {
						if (isSwapCase){
							dependentController = dependentRow.oView.getController();
							dependentController.updateRepresentationAndView().then(function() {
								oController.oConfigurationEditor.setIsUnsaved();
								deferred.resolve();
							});
						} else {
							oController.oConfigurationEditor.setIsUnsaved();
							deferred.resolve();
						}
					});
				});
			} else {
				oController.forceFailSinceOrchestrationIsMissing(); // shall throw when entered, safeguard that Orchestration is set == test.
				deferred.resolve()
			}
			return deferred.promise();
		},
		/**
		 * Encapsulate the change of the PropertyType view, its data (setDetailData), labels and LabelOptions.
		 * Also encapsulate the change of the property in the representation object in the editor.
		 * @return {Promise}
		 */
		updateRepresentationAndView : function(){
			var oController = this;
			return new Promise(function(resolve){
				oController.updateOfConfigurationObjectAsPromise().then(function() {
					oController.setDetailData();
					oController.enableDisableLabelDisplayOptionTypeAsPromise().then(function(){
						resolve();
					});
				});
			});
		},
		handleChangeForLabelDisplayOptionType : function() {
			var oController = this;
			var sLabelDisplayOption = oController.byId("idLabelDisplayOptionType").getSelectedKey();
			oController.changeLabelDisplayOption(sLabelDisplayOption);
			oController.oConfigurationEditor.setIsUnsaved();
		},
		/**
		 * A UI Handler, only called when label text becomes changed from default (technical property name) to user input of a name.
		 * Used in view.xml.
		 * It changes the label of the input control: "default" text is initially shown, off after a change.
		 * It sets and changes the input field value, for example after a swap this value would change for the dependent property.
		 * Calls setPropertyTextLabelKey which updates the configuration-representation object.
		 */
		handleChangeForLabelText : function() {
			var oController = this, sLabelTextKey;
			var sLabelText = oController.byId("idPropertyLabelText").getValue();
			var sPropertyName = oTextManipulator.removePrefixText(oController.byId("idPropertyType").getSelectedKey(), oController.oTextReader(ModelerConstants.texts.NOTAVAILABLE));
			if (sLabelText.trim().length === 0) {
				sLabelTextKey = undefined;
				oController.setPropertyTextLabelKey(sPropertyName, sLabelTextKey);  // update of the config object
				_setDisplayTextForPropertyLabel(oController);
				_setPropertyLabelText(oController);
				oController.oConfigurationEditor.setIsUnsaved();
			} else {
				oController.getView().getViewData().oConfigurationHandler.getTextPool().setTextAsPromise(sLabelText, oTranslationFormat).then(function(sLabelTextKey) {
					oController.setPropertyTextLabelKey(sPropertyName, sLabelTextKey);
					_setDisplayTextForPropertyLabel(oController);
					_setPropertyLabelText(oController);
					oController.oConfigurationEditor.setIsUnsaved();
				});
			}
		},
		setFocusOnAddRemoveIcons : function() {
			var oController = this;
			oController.byId("idAddPropertyIcon").focus();
		},
		/**
		 * Handles the UI event that adds a new PropertyType (+ Icon) in case of Dimensions and Measures
		 * SortProperty Rows are handled by handlePressOfAddPropertyIcon() from sortPropertyType.js
		 */
		handlePressOfAddPropertyIcon : function() {
			var oController = this;
			var oView = oController.getView();
			var oPropertyTypeOrchestration = oView.getViewData().oPropertyOrchestration; // can be undefined, @see _shallAddPropertyBeHandled
			var itemsFromSelectControl = oController.byId("idPropertyType").getItems();
			var selectedKeyInSelectControl = oController.byId("idPropertyType").getSelectedKey();
			var noneValueFromTextReader = oController.oTextReader("none");
			if(this._shallAddPropertyBeHandled(itemsFromSelectControl, selectedKeyInSelectControl, noneValueFromTextReader, oPropertyTypeOrchestration)) {
				_attachEvent(oController);
				oController.getView().fireEvent(ModelerConstants.events.ADDPROPERTY, {
					"oSourceView" : oView
				});
				oController.oConfigurationEditor.setIsUnsaved();
			}
		},
		/**
		 * Handles the UI event that removes a new SortProperty (+ Icon).
		 * @return {Promise}
		 */
		handlePressOfRemovePropertyIcon : function() {
			var oController = this;
			var oViewData = oController.getView().getViewData();
			var oPropertyTypeState = oViewData.oPropertyTypeState;
			var nIndex = oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
			if (nIndex > 0) {
				var oPreviousPropertyView = oPropertyTypeState.getViewAt(nIndex - 1);
				_attachEvent(oPreviousPropertyView.getController());
			}
			var oPropertyOrchestration = oViewData.oPropertyOrchestration;
			oPropertyOrchestration.removePropertyTypeReference(oController.getView().getId());
			return oController.updateRepresentationAndView().then(function() {
				oPropertyOrchestration.updateAllSelectControlsForPropertyType();
				oViewData.oPropertyTypeHandlerBackLink.handlePressOfRemove({
					oSourceView: oController.getView()
				});
				oController.oConfigurationEditor.setIsUnsaved();
				oController.getView().destroy();
			});
		},
		/**
		 * Responsible to change the property in the representation object. Which is done by removing the array of properties and recreating them,
		 * except for the updated element which is completely rebuilt.
		 * oPropertyOrchestration provides the complete state of the rows.
		 * @returns {Promise}
		 */
		updateOfConfigurationObjectAsPromise : function() {
			var oController = this;
			return new Promise(function(resolve) {
				var aPropertiesInformation = [];
				if (oController.getView().getViewData().oPropertyOrchestration) {
					aPropertiesInformation = oController.getView().getViewData().oPropertyOrchestration.getPropertyInformationList();
					oController.updatePropertiesInConfiguration(aPropertiesInformation);
				} else {
					oController.forceFailSinceOrchestrationIsMissing(); // shall throw when entered, safeguard that Orchestration is set == test.
				}
				resolve();
			});
		},
		/**
		 * Handler for suggestions, that is value help. The handler indirectly uses setModel, which triggers re-rendering.
		 * @param oEvent
		 */
		handleSuggestions : function(oEvent) {
			var oController = this;
			var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oController.oTextPool);
			oSuggestionTextHandler.manageSuggestionTexts(oEvent, oTranslationFormat);
		},
		getSelectedProperty : function() {
			var oController = this;
			var oPropertyTypeState = oController.getView().getViewData().oPropertyTypeState;
			var aCurrentSortPropertiesState = oPropertyTypeState.getPropertyValueState();
			var nCurrentViewIndex = oPropertyTypeState.indexOfPropertyTypeViewId(oController.getView().getId());
			return aCurrentSortPropertiesState[nCurrentViewIndex];
		},
		removeAllItemsFromDropDownList : function() {
			var oController = this;
			var valueHelp = oController.byId("idPropertyType");
			valueHelp.getItems().forEach(function(oItem) {
				valueHelp.removeItem(oItem);
			});
		},
		/**
		 * Building a new dropDownList.
		 * "not-available" can occur in the selected position but never in the drop down itself.
		 * Only add "None" in case of aggregationRole === dimension && !mandatory
		 * @param {string[]} aConsumableProperties - List of consumable property names from the step level
		 * @param {string[]} aAvailableProperties - List of available property names from the step level
		 * @param {string} selectedProperty - Key of a property
		 * @param {boolean} bMandatory - Whether the property type is mandatory or not (if Non-Mandatory and aggregation Role is Dimension, "None" is added)
		 * @param {string} aggregationRole - describes the aggregationRole of the corresponding control (see sap.apf.modeler.ui.utils.CONSTANTS.aggregationRoles)
		 */
		setItemsOfDropDownList : function(aConsumableProperties, aAvailableProperties, selectedProperty, bMandatory, aggregationRole) {
			function contains(list, item){
				return list.indexOf(item) !== -1;
			}
			var oController = this;
			var valueHelpView = oController.byId("idPropertyType");
			var propertiesForDropDown = [];
			var isSelectedPropertyNone = (selectedProperty === oController.oTextReader("none"));

			// Add None for non-mandatory Dimensions only
			if (!bMandatory &&
				aggregationRole === ModelerConstants.aggregationRoles.DIMENSION) {
				valueHelpView.addItem(new sap.ui.core.Item({
					key: oController.oTextReader("none"),
					text: oController.oTextReader("none")
				}));
			}
			if (aggregationRole === ModelerConstants.aggregationRoles.MEASURE){
				propertiesForDropDown = JSON.parse(JSON.stringify(aAvailableProperties));
			} else {
				propertiesForDropDown = JSON.parse(JSON.stringify(aConsumableProperties));
			}
			// Add selected Key to DropDown if not already existing
			if (!contains(propertiesForDropDown, selectedProperty) && !isSelectedPropertyNone){
				propertiesForDropDown.unshift(selectedProperty);
			}
			propertiesForDropDown.forEach(function(sValue) {
				var unprefixedKey = sValue;
				if (!contains(aAvailableProperties, sValue) && !isSelectedPropertyNone && sValue !== ""){
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
		/**
		 * Updates properties in the configuration-representation object of type sap.apf.modeler.core.representation
		 * @param {{sProperty: string, sKind: string, sTextLabelKey: string, sLabelDisplayOption: string}[] | {sProperty: string, sKind: string, sTextLabelKey: string}[]} aPropertiesInformation
		 */
		updatePropertiesInConfiguration : function(aPropertiesInformation) {
		},
		/**
		 * Creates information object for new property selection
		 * @param {string} sSelectedPropertyName - newly selected property
		 * @return {jQuery.Deferred}
		 */
		createNewPropertyInfoAsPromise : function(sSelectedPropertyName) {
			return sap.apf.utils.createPromise();
		},
		setPropertyInParentObject : function() {
		},
		/**
		 * Stub, overwritten by subclass
		 * @param optionsValueModelBuilder
		 * @returns {Promise}
		 */
		setLabelDisplayOptionTypeAsPromise : function(optionsValueModelBuilder) {
			return sap.apf.utils.createPromise();
		},
		getAllPropertiesAsPromise : function() {
			return sap.apf.utils.createPromise();
		},
		getPropertyTextLabelKey : function(sPropertyName) {
		},
		/**
		 * Updates the configuration-representation object after a change on the input control for the property label.
		 * Implemented in subclasses, facade pattern mapping method names.
		 * @param {string} sPropertyName
		 * @param {string} sLabelTextKey
		 */
		setPropertyTextLabelKey : function(sPropertyName, sLabelTextKey) {
		},
		enableDisableLabelDisplayOptionTypeAsPromise : function() {
			return sap.apf.utils.createPromise();
		},
		removePropertyFromParentObject : function() {
		},
		addPropertyAsPromise : function() {
			return sap.apf.utils.createPromise();
		},
		changeLabelDisplayOption : function(sLabelDisplayOption) {
		},
		/**
		 * This method decides whether the add property shall be handled based on the number of available properties in select control and selected key in select control.
		 * In case of MEASURE propertyTypeOrchestration must be provided and the decision is based on the number of selectControls (for this aggregationRole) and all selectable
		 * Properties (those that are in the dropDown list of the select control)
		 *
		 * If "None" is selected in the select control and there is only one remaining selectable property then it should't
		 * be possible to create a new line (for property selection), and thus this method returns false in this case.
		 * Also when there are no properties left for selection (selected property is always excluded), then return false.
		 * @param {[{mProperties : {key:string}}]} itemsFromSelectControl - contains the properties that can be selected in select control (that are available in drop down)
		 * @param {string | undefined} selectedKeyInSelectControl - contains the selected key in the select control
		 * @param {string} noneValueFromTextReader - contains the "None" value from the TextReader
		 * @param {sap.apf.modeler.ui.utils.propertyTypeOrchestration.PropertyTypeOrchestration} [propertyTypeOrchestration] - Must be provided in case of AggregationRole = Measure to prevent too many Property Rows from being added
		 * @returns {boolean} true indicates that handlePressOfAddPropertyIcon shall be continued, false indicates that handlePressOfAddPropertyIcon shall not be continued
		 * @private
		 */
		_shallAddPropertyBeHandled : function(itemsFromSelectControl, selectedKeyInSelectControl, noneValueFromTextReader, propertyTypeOrchestration) {
			var itemsWithoutNone = itemsFromSelectControl.filter(function(item){
				return item.mProperties.key !== noneValueFromTextReader; // filter any "None" Properties
			});
			if(propertyTypeOrchestration && propertyTypeOrchestration.getAggregationRole() === ModelerConstants.aggregationRoles.MEASURE ){
				var numberOfSelectControls = propertyTypeOrchestration._getPropertyTypeRows().length;
				return (numberOfSelectControls < itemsWithoutNone.length); // Special logic for measures only
			}
			if(itemsFromSelectControl.length === 0 || !selectedKeyInSelectControl){
				return false;
			}
			var itemsWithoutNoneAndWithoutSelected = itemsWithoutNone.filter(function (item) {
				return item.mProperties.key !== selectedKeyInSelectControl;  // filter the already selected property
			});
			var isNoneSelected = (selectedKeyInSelectControl === noneValueFromTextReader);
			if(itemsWithoutNoneAndWithoutSelected.length < 2 && isNoneSelected){
				return false;
			} else if (itemsWithoutNoneAndWithoutSelected.length < 1 && !isNoneSelected){
				return false;
			}
			return true;
		}
	});
	return constructor;
}, true /*GLOBAL_EXPORT*/);
