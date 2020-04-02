/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	'sap/apf/modeler/ui/utils/constants',
	'sap/apf/modeler/ui/utils/propertyTypeFactory',
	'sap/apf/modeler/ui/utils/nullObjectChecker',
	'sap/apf/modeler/ui/utils/propertyTypeState',
	"sap/apf/modeler/ui/utils/propertyTypeOrchestration"
	],
function(ModelerConstants, mPropertyTypeFactory, mNullObjectChecker, PropertyTypeState, propertyTypeOrchestration) {
	'use strict';

	function _attachEvents(oPropertyTypeHandlerController, oPropertyTypeView) {
		oPropertyTypeView.attachEvent(ModelerConstants.events.ADDPROPERTY, oPropertyTypeHandlerController.handlePressOfAdd.bind(oPropertyTypeHandlerController));
		oPropertyTypeView.attachEvent(ModelerConstants.events.REMOVEPROPERTY, oPropertyTypeHandlerController.handlePressOfRemove.bind(oPropertyTypeHandlerController));
		oPropertyTypeView.attachEvent(ModelerConstants.events.SETNEXTPROPERTYINPARENTOBJECT, oPropertyTypeView.getController().setNextPropertyInParentObject.bind(oPropertyTypeView.getController()));
		oPropertyTypeHandlerController.getView().attachEvent(ModelerConstants.events.SETNEXTPROPERTYINPARENTOBJECT, oPropertyTypeView.getController().setNextPropertyInParentObject.bind(oPropertyTypeView.getController()));
		oPropertyTypeView.attachEvent(ModelerConstants.events.REMOVECURRENTPROPERTYFROMPARENTOBJECT, oPropertyTypeView.getController().removePropertyFromParentObject.bind(oPropertyTypeView.getController()));
		oPropertyTypeView.attachEvent(ModelerConstants.events.REMOVEPROPERTYFROMPARENTOBJECT, oPropertyTypeView.getController().removePropertyFromParentObject.bind(oPropertyTypeView.getController()));
		oPropertyTypeView.attachEvent(ModelerConstants.events.UPDATEPROPERTYVALUESTATE, oPropertyTypeHandlerController.updatePropertyValueState.bind(oPropertyTypeHandlerController));
		oPropertyTypeView.attachEvent(ModelerConstants.events.FOCUSONREMOVE, oPropertyTypeHandlerController.handleFocusOnRemove.bind(oPropertyTypeHandlerController));
		oPropertyTypeView.attachEvent(ModelerConstants.events.SETFOCUSONREMOVEICON, oPropertyTypeView.getController().setFocusOnAddRemoveIcons.bind(oPropertyTypeView.getController()));
	}

	/**
	 * For each property create a PropertyType (a row with several selection fields).
	 * Those properties are determined via viewData in member "aPropertiesToBeCreated".
	 * @param {sap.apf.modeler.ui.controller.propertyTypeHandler} oController
	 * @param {sap.apf.modeler.ui.utils.propertyTypeOrchestration} oPropertyOrchestration
	 * @private
	 */
	function _instantiateSubViews(oController, oPropertyOrchestration) {
		var aPromises = [];
		var aPropertiesToBeCreated = oController.getView().getViewData().aPropertiesToBeCreated;
		aPropertiesToBeCreated.forEach(function(oPropertyInformation) {
			var oView = _createSubView(oController, oPropertyInformation, oController.nCounter, oPropertyOrchestration);
			aPromises.push(oView.getController().initPromise);
		});
		oController.initPromise = jQuery.when.apply(jQuery, aPromises); // wait for all row promises
	}

	/**
	 * Create a PropertyType View comprising of 1 or many input fields in one row with one field having a value help for a property name.
	 * @param {sap.apf.modeler.ui.controller.propertyTypeHandler} oController
	 * @param {{sProperty:string, sKind:string, sTextLabelKey:string, sLabelDisplayOption:string}} oPropertyInformation for a single property input row
	 * @param {number} nIndexOfNewView a counter id
	 * @param {sap.apf.modeler.ui.utils.propertyTypeOrchestration} oPropertyOrchestration
	 * @returns {sap.apf.modeler.ui.view.propertyType}
	 * @private
	 */
	function _createSubView(oController, oPropertyInformation, nIndexOfNewView, oPropertyOrchestration) {
		var oViewData = jQuery.extend(true, {}, oController.getView().getViewData().oViewDataForPropertyType);
		oViewData.oPropertyTypeState = oController.oPropertyTypeState;
		oViewData.oPropertyTypeData = oPropertyInformation;
		oViewData.oPropertyOrchestration = oPropertyOrchestration;
		oViewData.oPropertyTypeHandlerBackLink = oController; // backlink e.g. for synchronously removing and destroying the subView
		var sViewId = oController.createId("id" + oViewData.sPropertyType + "View" + oController.nCounter);
		oController.oPropertyTypeState.addPropertyAt(oPropertyInformation.sProperty, nIndexOfNewView);
		oController.oPropertyTypeState.addPropertyTypeViewIdAt(sViewId, nIndexOfNewView);
		var oView = mPropertyTypeFactory.createPropertyTypeView(oViewData, sViewId);
		if (oPropertyOrchestration){
			oPropertyOrchestration.addPropertyTypeReference(sViewId, oPropertyInformation, oViewData.sPropertyType, oView);
		}
		_attachEvents(oController, oView);
		oController.byId("idPropertyTypeVBox").insertItem(oView, nIndexOfNewView);
		oController.nCounter++; // create new view ID
		return oView;
	}

	/**
	 * Creates all rows for one logical group.
	 * A row comprises of input selection fields. Such groups are dimensions, legends, or measures.
	 * In addition, rows can e added or removed interactively.
	 * Responsibility:
	 * - manage the lifetime of its rows.
	 * - Handle all events of its group, including the property selection event on any property input field.
	 * @constructor
	 */
	var propertyTypeHandler = sap.ui.controller("sap.apf.modeler.ui.controller.propertyTypeHandler", {
		_apfName : "propertyTypeHandler",
		nCounter : 0,
		oPropertyTypeState : {},
		initPromise : undefined,
		oPropertyOrchestration: undefined,
		onInit : function() {
			var oController = this;
			oController.oPropertyOrchestration = oController.getView().getViewData().oPropertyOrchestration;
			oController.oPropertyTypeState = new PropertyTypeState();
			_instantiateSubViews(oController, oController.oPropertyOrchestration);
			if (oController.oPropertyOrchestration){
				oController.oPropertyOrchestration.updateAllSelectControlsForPropertyType();
			}
		},
		/**
		 * Adds a row.
		 * @param {object} oEvent
		 */
		handlePressOfAdd : function(oEvent) {
			var oController = this,
			oPropertyTypeData = {},
			oView;
			var oSourceView = oEvent.getParameter("oSourceView");
			var oPropertyOrchestration = oController.getView().getViewData().oPropertyOrchestration;
			var sPropertyType = oPropertyOrchestration.getPropertyTypeRow(oSourceView.getId()).sPropertyType;
			var aggregationRole = propertyTypeOrchestration._mapPropertyType2AggregationRole(sPropertyType);
			var nIndexOfNewView = oController.byId("idPropertyTypeVBox").indexOfItem(oSourceView) + 1;
			var representationId = oController.getView().getViewData().oViewDataForPropertyType.oParentObject.getId();
			var oStepPropertyMetadataHandler = oController.getView().getViewData().oViewDataForPropertyType.oStepPropertyMetadataHandler;
			// hierarchical steps only allow sorting on measures
			var oStep = oStepPropertyMetadataHandler.oStep;
			var isHierarchicalStep = oStep.getType() === "hierarchicalStep";
			if (isHierarchicalStep && sPropertyType === ModelerConstants.propertyTypes.REPRESENTATIONSORT){
				aggregationRole = ModelerConstants.aggregationRoles.MEASURE;
			}
			propertyTypeOrchestration.getConsumableAndAvailablePropertiesAsPromise(representationId, aggregationRole, oStepPropertyMetadataHandler)
				.then(function (oAvailableConsumableProperties) {
					var nonSelectedConsumableProperties = propertyTypeOrchestration._relativeComplement(oAvailableConsumableProperties.available, oPropertyOrchestration.getSelectedProperties());
					var defaultedValueToBeSet = nonSelectedConsumableProperties[0];
					oPropertyTypeData.sProperty = defaultedValueToBeSet;
					oPropertyTypeData.sContext = oPropertyOrchestration.getPropertyTypeRow(oSourceView.getId()).propertyRowInformation.sContext;
					if (mNullObjectChecker.checkIsNotUndefined(oPropertyTypeData.sProperty)) {
						oView = _createSubView(oController, oPropertyTypeData, nIndexOfNewView, oPropertyOrchestration);
						/* now the orchestration object is updated.
						 * update of configuration obj is independent of update of all views, so there is no need to return a promise here.
						 * Note: subclasses of SortPropertyType call updateOfConfigurationObject,
						 * subclasses of PropertyType call updateOfConfigurationObjectAsPromise, which includes a promise, but does not return it.
						*/
						oView.getController().setNextPropertyInParentObject(); // updates configuration dependent on subclass
					}
					return oPropertyOrchestration.updateAllSelectControlsForPropertyType();
			});
		},
		handleFocusOnRemove : function(oEvent) {
			var oController = this;
			var oVbox = oController.byId("idPropertyTypeVBox");
			var oSourceView = oEvent.getSource();
			var nIndexOfSourceView = oVbox.indexOfItem(oSourceView);
			var oFocusedView = oController.byId(oController.oPropertyTypeState.aPropertyTypeViewIds[nIndexOfSourceView - 1]);
			oFocusedView.fireEvent(ModelerConstants.events.SETFOCUSONREMOVEICON);
		},
		/**
		 * Role:
		 * 1) update the propertyTypeState (remove view and index from internal bookkeeping lists)
		 * 2) remove the item from its vBox.
		 * @param {Object} oEvent - transfers the source view
		 */
		handlePressOfRemove : function(oEvent) {
			var oController = this;
			var oSourceView = oEvent.oSourceView || oEvent.getSource();
			var oVbox = oController.byId("idPropertyTypeVBox");
			var nIndexOfSourceView = oVbox.indexOfItem(oSourceView);
			oController.oPropertyTypeState.removePropertyAt(nIndexOfSourceView);
			oController.oPropertyTypeState.removePropertyTypeViewIdAt(nIndexOfSourceView);
			oVbox.removeItem(oSourceView);
		},
		/**
		 * Updates the PropertyTypeState of this PropertyTypeHandler (a group of properties with same aggregation role like "dimension")
		 * @param oEvent
		 */
		updatePropertyValueState : function(oEvent) {
			var oController = this;
			var oSourceView = oEvent.getSource();
			var sCurrentProperty = oEvent.getParameter("sProperty");
			var nIndexOfSourceView = oController.byId("idPropertyTypeVBox").indexOfItem(oSourceView);
			oController.oPropertyTypeState.updatePropertyAt(sCurrentProperty, nIndexOfSourceView);
		},
		handleRemoveOfProperty : function() {
			var oController = this;
			var oVBox = oController.byId("idPropertyTypeVBox");
			if (mNullObjectChecker.checkIsNotUndefined(oVBox)) {
				oVBox.getItems().forEach(function(oPropertyTypeView) {
					oPropertyTypeView.fireEvent(ModelerConstants.events.REMOVEPROPERTYFROMPARENTOBJECT);
				});
			}
		},
		handleSettingTopNProperties : function() {
			var oController = this;
			oController.getView().fireEvent(ModelerConstants.events.SETNEXTPROPERTYINPARENTOBJECT);
		}
	});

	return propertyTypeHandler;
}, true /*GLOBAL_EXPORT*/);