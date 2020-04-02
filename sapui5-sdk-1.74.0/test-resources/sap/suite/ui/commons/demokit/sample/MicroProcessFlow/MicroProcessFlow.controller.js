sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
	var oPageController = Controller.extend("sap.suite.ui.commons.sample.MicroProcessFlow.MicroProcessFlow", {
		onInit: function () {
		},
		itemPress: function() {
			MessageBox.information("Item clicked.");
		}
	});
	return oPageController;
});
