sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/networkgraph/Node"
], function (Controller, JSONModel, Node) {
	var oPageController = Controller.extend("sap.suite.ui.commons.sample.NetworkGraphCustomRendering.NetworkGraph", {
		onInit: function () {
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.suite.ui.commons.sample.NetworkGraphCustomRendering", "/graph.json"));
			this.getView().setModel(oModel);

			var oSettingsModel = new JSONModel({
				renderType: "Svg"
			});

			this.getView().setModel(oSettingsModel, "settings");
		}
	});
	return oPageController;
});
