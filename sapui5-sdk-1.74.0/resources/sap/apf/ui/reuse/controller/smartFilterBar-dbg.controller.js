/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
/**
* @class smartFilterBar
* @memberOf sap.apf.ui.reuse.controller
* @name smartFilterBar
* @description controller for smartFilterBar view
*/

sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/ODataUtils',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/model/odata/CountMode'
], function(BaseController, ODataUtils, ODataModel, CountMode) {
	'use strict';

	return BaseController.extend("sap.apf.ui.reuse.controller.smartFilterBar", {
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#onInit
		 * @description Called on initialization of the view
		 * */
		onInit : function() {
			var oController = this;
			var sServiceForSFB = oController.getView().getViewData().oSmartFilterBarConfiguration.service;
			var annotationUris = oController.getView().getViewData().oCoreApi.getAnnotationsForService(sServiceForSFB);
			var parameterSet = {
				annotationURI : annotationUris,
				json : true
			};
			if (annotationUris && annotationUris.length > 0) {
				parameterSet.loadAnnotationsJoined = true;
			}
			var sapSystem = oController.getView().getViewData().oCoreApi.getStartParameterFacade().getSapSystem();
			if (sapSystem) {
				sServiceForSFB = ODataUtils.setOrigin(sServiceForSFB, { force : true, alias : sapSystem});
			}
			var oModel = new ODataModel(sServiceForSFB, parameterSet);
			oModel.getMetaModel().loaded().then(function(){
				oController.getView().getViewData().oCoreApi.getMetadata(sServiceForSFB).done(function(metadata){
					if(metadata.getAllEntitySetsExceptParameterEntitySets().indexOf(oController.getView().getViewData().oSmartFilterBarConfiguration.entitySet) < 0 ){
						oController.getView().getViewData().oCoreApi.putMessage(oController.getView().getViewData().oCoreApi.createMessageObject({
							code: "5053",
							aParameters: [oController.getView().getViewData().oSmartFilterBarConfiguration.entitySet, sServiceForSFB]}));
					}
					oModel.setDefaultCountMode(CountMode.None);
					oController.byId("idAPFSmartFilterBar").setModel(oModel);
				});
			});
			oModel.attachMetadataFailed(function(){
				oController.getView().getViewData().oCoreApi.putMessage(oController.getView().getViewData().oCoreApi.createMessageObject({
					code: "5052",
					aParameters: [sServiceForSFB]}));
			});
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#afterInitialization
		 * @description Called on initialize event of the Smart Filter Bar
		 */
		afterInitialization: function(){
			this.setFilterData();
			this.validateFilters();
			this.registerSFBInstanceWithCore();
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#registerSFBInstanceWithCore
		 * @description Registers the sfb instance in the core, so the startup can continue
		 * */
		registerSFBInstanceWithCore : function() {
			var oController = this;
			oController.getView().getViewData().oCoreApi.registerSmartFilterBarInstance(oController.byId("idAPFSmartFilterBar"));
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#handlePressOfGoButton
		 * @description Called on search event(press of Go Button) of the Smart Filter Bar
		 * */
		handlePressOfGoButton : function() {
			var oController = this;
			var oSmartFilterBar = this.byId("idAPFSmartFilterBar");
			if(!oSmartFilterBar._apfOpenPath && oController.getView().getViewData().oCoreApi.getActiveStep()){
				oController.getView().getViewData().oUiApi.selectionChanged(true);
			}
			delete oSmartFilterBar._apfOpenPath;
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#setFilterData
		 * @description Checks if the navigation filter does not pass default variant key
		 * */
		setFilterData: function(){
			var oController = this;
			var oSmartFilterBar = this.byId("idAPFSmartFilterBar");
			var navApfExists = oController.getView().getViewData().oCoreApi.getStartParameterFacade().getAnalyticalConfigurationId();
            var navXappExists = oController.getView().getViewData().oCoreApi.getStartParameterFacade().getXappStateId(); 
            var oUistate = oSmartFilterBar.getUiState();
            var mproperties = oSmartFilterBar.mProperties;
            oSmartFilterBar.setUiState(oUistate,mproperties);
            //oSmartFilterBar.setFilterData();
            if((navApfExists !== undefined) || (navXappExists !== "null"))
	        {
            	var defaultKey = oSmartFilterBar.getVariantManagement().STANDARDVARIANTKEY;
	            oSmartFilterBar.getVariantManagement().setCurrentVariantId(defaultKey); 
	        }
		},
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.reuse.controller.smartFilterBar#handleFilterChange
		 * @description Checks if the filter bar is in a valid state (all mandatory filters are filled)
		 * */
		validateFilters: function(){
			var oSmartFilterBar = this.byId("idAPFSmartFilterBar");
			var valid = oSmartFilterBar.validateMandatoryFields();
			this.getView().getViewData().oUiApi.getAddAnalysisStepButton().setEnabled(valid);
			this.getView().getViewData().oUiApi.getAddAnalysisStepButton().rerender();
		}
	});
});