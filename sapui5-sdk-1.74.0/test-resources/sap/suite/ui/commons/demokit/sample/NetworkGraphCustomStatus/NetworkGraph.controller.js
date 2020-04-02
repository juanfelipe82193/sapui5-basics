sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	var oPageController = Controller.extend("sap.suite.ui.commons.sample.NetworkGraphCustomStatus.NetworkGraph", {
		onInit: function () {
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.suite.ui.commons.sample.NetworkGraphCustomStatus", "/graph.json"));
			this.getView().setModel(oModel);
		}
	});
	return oPageController;
});
