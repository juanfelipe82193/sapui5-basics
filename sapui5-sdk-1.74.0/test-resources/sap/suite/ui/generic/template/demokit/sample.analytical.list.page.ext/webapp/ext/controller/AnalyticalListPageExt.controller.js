sap.ui.define("analytics4.ext.controller.AnalyticalListPageExt", [
	"sap/base/Log"
], function(Log) {
	"use strict";

	return {
		onInit: function(oEvent) {
			//getting the view will allow the developers to use the stableIds directly
			//otherwise Id construction has to be done with conjunction with app name , view , entity and stableIds etc.., 
			var oView = this.getView();
			//the below approach of applying custom CSS is not supported / advised by ALP
			var extensionViewToolbar = oView.byId("template::masterViewExtensionToolbar");
			if (extensionViewToolbar) {
				extensionViewToolbar.addStyleClass("masterViewExtensionToolbar");
			}
		},
		onInitSmartFilterBarExtension: function(oEvent) {
			// the custom field in the filter bar might have to be
			// bound to a custom data model
			// if a value change in the field shall trigger a follow
			// up action, this method is the place to define and
			// bind an event handler to the field
			// Example:
			var oSmartFilterBar;			
			oSmartFilterBar = oEvent.getSource();
			oSmartFilterBar.getControlByKey("CustomFilters").attachSelectionChange(function(oChangeEvent){
				//code
			},this);
			Log.info("onInitSmartFilterBarExtension initialized");
		},
		onAfterCustomModelCreation: function(oCustomModel) {
			//oCustomModel.setProperty("/required/master", true);// setting visibility -- default is true
			oCustomModel.setProperty("/icon/hybrid","sap-icon://Chart-Tree-Map" ); //sap-icon://chart-table-view
			oCustomModel.setProperty("/icon/master","sap-icon://map-2"); // default value is sap-icon://vertical-bar-chart-2
		},
		onBeforeRebindTableExtension: function(oEvent) {
			// usually the value of the custom field should have an
			// effect on the selected data in the table. So this is
			// the place to add a binding parameter depending on the
			// value in the custom field.
			Log.info("onBeforeRebindTableExtension called!");
		},	
		onBeforeRebindChartExtension: function(oEvent) {
			// usually the value of the custom field should have an
			// effect on the selected data in the chart. So this is
			// the place to add a binding parameter depending on the
			// value in the custom field.
			Log.info("onBeforeRebindChartExtension called!");
		},	
		getCustomAppStateDataExtension : function(oCustomData) {
			// the content of the custom field shall be stored in
			// the app state, so that it can be restored later again
			// e.g. after a back navigation. The developer has to
			// ensure, that the content of the field is stored in
			// the object that is returned by this method.
			// Example:		
			var oComboBox = this.byId("alr_customFilterCombobox");
			if (oComboBox){
				oCustomData.CustomPriceFilter = oComboBox.getSelectedKey();
			}
		},	
		restoreCustomAppStateDataExtension : function(oCustomData) {
			// in order to to restore the content of the custom
			// field in the filter bar e.g. after a back navigation,
			// an object with the content is handed over to this
			// method and the developer has to ensure, that the
			// content of the custom field is set accordingly
			// also, empty properties have to be set
			// Example:
			if ( oCustomData.CustomPriceFilter !== undefined ){
				if ( this.byId("alr_customFilterCombobox") ) {
					this.byId("alr_customFilterCombobox").setSelectedKey(oCustomData.CustomPriceFilter);
				}
			}
		},	
		onClearFilterExtension: function(oEvent) {
			// Logic for clearing extended filters
			if ( this.byId("alr_customFilterCombobox") ) {
				this.byId("alr_customFilterCombobox").setSelectedKey(null);
			}
		},	
		onBeforeRebindFilterableKPIExtension: function(oSelectionVariant, sEntityType) {
			Log.info("onBeforeRebindFilterableKPIExtension called!");
		}	
	};
});