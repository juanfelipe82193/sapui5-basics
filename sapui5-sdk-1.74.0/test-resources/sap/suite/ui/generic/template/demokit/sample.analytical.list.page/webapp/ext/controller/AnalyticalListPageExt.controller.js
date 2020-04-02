sap.ui.define("analytics2.ext.controller.AnalyticalListPageExt",[
	"sap/base/Log",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/ResponsivePopover"
], function(Log, Button, Text, ResponsivePopover) {
	"use strict"

	return {
		onInitSmartFilterBarExtension: function(oEvent) {
			// the custom field in the filter bar might have to be
			// bound to a custom data model
			// if a value change in the field shall trigger a follow
			// up action, this method is the place to define and
			// bind an event handler to the field
			// Example:
			var oSmartFilterBar = oEvent.getSource();
			oSmartFilterBar.getControlByKey("CustomFilters").attachSelectionChange(function(oChangeEvent){
				//code
			},this);
			Log.info("onInitSmartFilterBarExtension initialized");
		},
		onBeforeRebindTableExtension: function(oEvent) {
			// Both chart and table have same data and by default behavior of AnalyticalBinding, chart selection refreshes and selection is lost after table rebind
			// Adding below code to make table point to a different entitySet so that the above mentioned bug is fixed
			//var oSmartTable = this.byId("table");
			//oSmartTable.setEntitySet("ZCOSTCENTERCOSTSQUERY0021");
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
		onBeforeRebindFilterableKPIExtension: function(oSelectionVariant, sEntityType) {
			Log.info("onBeforeRebindFilterableKPIExtension called!");
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
		onGlobalActionButtonClicked: function(oEvent) {
			var oRb = this.getView().getModel("@i18n").getResourceBundle();
			var closeButton = new Button({
				text: oRb.getText("CLOSE"),
				press: function(oEvent) {
					oPopover.close();
				}
			});
			var textContent = new Text({
				text: oRb.getText("GLOBAL_BUTTON_MESSAGE")
			});
			var oPopover = new ResponsivePopover({
				title: oRb.getText("GLOBAL_ACTION_BUTTON"),
				content: [textContent],
				ariaLabelledBy: [textContent],
				placement: "Bottom"
			});
			oPopover.setEndButton(closeButton);
			oPopover.addStyleClass("sapUiContentPadding");
			oPopover.openBy(oEvent.getSource());
		},	
		onClearFilterExtension: function(oEvent) {
			// Logic for clearing extended filters
			if ( this.byId("alr_customFilterCombobox") ) {
				this.byId("alr_customFilterCombobox").setSelectedKey(null);
			}
		},	
		onClickActionA_standard: function(oEvent) {
			Log.info("standard event");
		},	
		onClickActionB_requiresSelection: function(oEvent) {
			var contexts = this.extensionAPI.getSelectedContexts();
			Log.info(contexts.length);
		},	
		onClickActionC_determining: function(oEvent) {
			Log.info("Determining button called");	
		},	
		onClickActionD_common: function(oEvent) {
			Log.info("Common button called!");
		},	
		onClickActionE_tableOnly: function(oEvent) {
			Log.info("Table only button called!");
		},	
		onClickActionF_chartOnly: function(oEvent) {
			Log.info("Chart only button called!");
		},
		onClickActionG_addCustomAppState: function(oEvent) {
			this.extensionAPI.onCustomAppStateChange();
		},
		onListNavigationExtension: function(oEvent) {
			var oNavigationController = this.extensionAPI.getNavigationController();
			var oBindingContext = oEvent.getSource().getBindingContext();
			var oObject = oBindingContext.getObject();
			// for notebooks we trigger external navigation for all others we use internal navigation
			if (oObject.CostCenter == "300-1000") {
				oNavigationController.navigateExternal("ActualCostsKPIDetails");
			} else {
				// return false to trigger the default internal navigation
				return false;
			}
			// return true is necessary to prevent further default navigation
			return true;
		},
		onSaveAsTileExtension: function(oShareInfo) {
			Log.info("onSaveAsTileExtension called!");
			//to create static tile
			oShareInfo.serviceURL = "";
		},
		modifyStartupExtension: function (oStartupObject) {
			var oSelectionVariant = oStartupObject.selectionVariant;
			if (oSelectionVariant.getSelectOption("CustomerCountry") && oSelectionVariant.getSelectOption("CustomerCountry")["0"].Low === "AR") {
				oSelectionVariant.addSelectOption("ControllingArea", "I", "EQ", "US01");
				oSelectionVariant.addSelectOption("CostElement", "I", "EQ", "400020");
			}
		}
	};
});