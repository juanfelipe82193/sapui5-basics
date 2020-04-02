sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
	"use strict";
	var oController = Controller.extend("STTA_MP.reuseComponents.tableTest.view.Default", {
	
		onInit: function() {
		},
		onBeforeRendering: function() {
		},
		onAfterRendering: function() {
		},
		onItemPress: function(oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext();
			var oComponentModel = oEvent.getSource().getModel("componentModel");
			var oExtensionAPI = oComponentModel.getProperty("/extensionApi");
			var sNavigationPath = oComponentModel.getProperty("/navigationProperty");
			var oNavigationController = oExtensionAPI.getNavigationController();
			var oNavigationData = {};
			oNavigationData["navigationProperty"]= sNavigationPath;
			oNavigationController.navigateInternal(oBindingContext, oNavigationData);
		}
	});
});