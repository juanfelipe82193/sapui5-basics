sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
	"use strict";
	Controller.extend("ManageSalesOrderWithSegButtons.reuseComponents.tableTest.view.Default", {
	
		onItemPress: function(oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext();
			var oProduct = oBindingContext.getObject();
			var oComponentModel = oEvent.getSource().getModel("componentModel");
			var oExtensionAPI = oComponentModel.getProperty("/extensionApi");;
			var oNavigationController = oExtensionAPI.getNavigationController();
			var oNavigationData = {
				routeName: "to_Product"
			};
			oNavigationController.navigateInternal(oProduct.ProductID, oNavigationData);
		}
	});
});