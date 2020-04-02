sap.ui.define([
		'sap/ui/model/json/JSONModel',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/Filter',
		'sap/ui/model/FilterOperator'
	], function (JSONModel, Controller, Ui5Filter, FilterOperator){
	"use strict";
	/**
	 *@class pathFilterDisplay
	 *@name pathFilterDisplay
	 *@memberOf sap.apf.ui.reuse.controller
	 *@description controller for step Gallery 
	 */
	return Controller.extend("sap.apf.ui.reuse.controller.pathFilterDisplay", {
		getCoreApi : function(){
			return this.getView().getViewData().oCoreApi;
		},
		onInit : function(){
			var data = this.getView().getViewData().pathFilterInformation;
			var oModel = new JSONModel(data);
			this.getView().setModel(oModel);
			if (sap.ui.Device.system.desktop) {
				this.getView().byId("pathFilterDisplayDialog").addStyleClass("sapUiSizeCompact");
			}
			this.getView().byId("pathFilterDisplayDialog").setContentWidth(jQuery(window).height() * 0.6 + "px");
			this.getView().byId("pathFilterDisplayDialog").setContentHeight(jQuery(window).height() * 0.6 + "px");

			this.getView().byId("stepPage").setTitle(this.getCoreApi().getTextNotHtmlEncoded("pathFilterDisplay-SelectedFilters"));
			this.getView().byId("pathFilterDisplayDialog").getEndButton().setText(this.getCoreApi().getTextNotHtmlEncoded("close"));
			this.getView().byId("pathFilterDisplayDialog").getBeginButton().setText(this.getCoreApi().getTextNotHtmlEncoded("closeAndNavigate"));
		},
		onStepPress : function(oEvent){
			this.getView().byId("pathFilterDisplayDialog").getBeginButton().setVisible(true);
			var navContainer = this.getView().byId("navContainer");
			var filterValuesPage = this.getView().byId("filterValuesPage");
			var oBindingContext = oEvent.getSource().getBindingContext();
			filterValuesPage.setBindingContext(oBindingContext);
			navContainer.to(filterValuesPage);
		},
		onCloseButton : function(){
			this.getView().byId("pathFilterDisplayDialog").close();
		},
		onClose : function(){
			this.getView().byId("pathFilterDisplayDialog").destroy();
			this.getView().destroy();
		},
		onSearch : function(oEvent){
			var sSearchValue = oEvent.getParameters().newValue;
			var oListForFiltering = this.getView().byId("navContainer").getCurrentPage().getContent()[0];//get the current page and the list in it
			var currentListBinding = oListForFiltering.getBinding("items");// update list binding
			var aFilters = [];
			if (sSearchValue) {
				aFilters.push(new Ui5Filter("text", FilterOperator.Contains, sSearchValue));
			}
			currentListBinding.filter(aFilters);
		},
		getDescriptionForStep : function(selectablePropertyLabel, filterValues){
			if(selectablePropertyLabel){
				if(filterValues && filterValues.length > 0){
					return selectablePropertyLabel + ", " + this.getCoreApi().getTextNotHtmlEncoded("amountSelected", [filterValues.length]);
				}
				return selectablePropertyLabel + ", " + this.getCoreApi().getTextNotHtmlEncoded("nothingSelected");
			}
			return this.getCoreApi().getTextNotHtmlEncoded("noSelectionPossible");
		},
		onBackPress : function() {
			this.getView().byId("pathFilterDisplayDialog").getBeginButton().setVisible(false);
			var navContainer = this.getView().byId("navContainer");
			navContainer.back();
		},
		onCloseAndNavigatePress : function(event) {
			var index = this.getView().byId("filterValuesPage").data("stepIndex");
			this.getView().getViewData().oUiApi.getAnalysisPath().getController().navigateToStep(index);
			this.getView().byId("pathFilterDisplayDialog").close();
		}
	});
});
