sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"opensap/myapp/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, MessageToast, formatter, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("opensap.myapp.controller.App", {

		formatter: formatter,

		onShowHello: function () {
			// read msg from i18n model
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel("helloPanel").getProperty("/recipient/name");
			var sMsg = oBundle.getText("helloMsg", [sRecipient]);

			// show message
			MessageToast.show(sMsg);
		},

		onFilterProducts: function (oEvent) {

			// Build filter array
			var aFilter = [],
				sQuery = oEvent.getParameter("query"),
				// Retrieve list control
				oList = this.getView().byId("invoiceList"),
				// get binding for aggregation 'items'
				oBinding = oList.getBinding("items");

			if (sQuery) {
				aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			}
			// Apply filter, an empty filter array simply removes the filter
			// Which will make all entries visible again
			oBinding.filter(aFilter);
		},

		onItemSelected: function (oEvent) {
			var oSelectedItem, oContext, sPath, oPanel;

			oSelectedItem = oEvent.getParameter("listItem");
			oContext = oSelectedItem.getBindingContext();
			sPath = oContext.getPath();
			oPanel = this.byId("productDetailsPanel");
			oPanel.bindElement({
				path: sPath
			});
			oPanel.setVisible(true);
		}
	});
});