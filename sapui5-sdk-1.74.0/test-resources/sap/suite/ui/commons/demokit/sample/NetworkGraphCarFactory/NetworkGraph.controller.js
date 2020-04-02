sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/suite/ui/commons/sample/NetworkGraphCarFactory/CustomLayout"
], function (Controller, CustomLayout) {
	var oPageController = Controller.extend("sap.suite.ui.commons.sample.NetworkGraphCarFactory.NetworkGraph", {
		onInit: function () {
			var oGraph = this.byId("graph");

			oGraph.setLayoutAlgorithm(new CustomLayout());
		}
	});
	return oPageController;
});