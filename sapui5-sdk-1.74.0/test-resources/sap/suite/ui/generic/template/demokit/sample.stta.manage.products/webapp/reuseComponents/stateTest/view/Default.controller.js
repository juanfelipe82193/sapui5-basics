sap.ui.controller("STTA_MP.reuseComponents.stateTest.view.Default", {

	stateChanged: function(){
		var oComponentModel = this.getView().getModel("component");
		var oExtensionAPI = oComponentModel.getProperty("/api");
		oExtensionAPI.onCustomStateChange();                         
	}
});