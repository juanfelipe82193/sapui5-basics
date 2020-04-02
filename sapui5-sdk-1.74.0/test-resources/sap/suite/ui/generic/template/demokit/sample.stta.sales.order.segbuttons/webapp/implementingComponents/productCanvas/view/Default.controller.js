sap.ui.controller("ManageSalesOrderWithSegButtons.implementingComponents.productCanvas.view.Default", {
	onInit: function() {
		var oComponent = this.getOwnerComponent();
		var oComponentModel = oComponent.getComponentModel();
		oComponentModel.setProperty("/View", this.getView());
	},
	onClick: function(oEvent) {
		var oComponent = this.getOwnerComponent();
		var oComponentModel = oComponent.getComponentModel();
		var oExtensionAPI = oComponentModel.getProperty("/oExtensionAPI");
		oExtensionAPI.refreshAncestors();
	},
	onPress: function(oEvent) {
		var oComponent = this.getOwnerComponent();
		var oComponentModel = oComponent.getComponentModel();
		var oNavigationController = oComponentModel.getProperty("/navigationController");
		oNavigationController.navigateInternal();
	},
	onSave: function(oEvent) {
		var oComponent = this.getOwnerComponent();
		var oComponentModel = oComponent.getComponentModel();
		var oExtensionAPI = oComponentModel.getProperty("/oExtensionAPI");
		oExtensionAPI.onCustomStateChange();
	},
	onIconTabBarPressed: function (oEvent) {
		console.log(oEvent.getParameter("item").getId() + " pressed");
	}
});
