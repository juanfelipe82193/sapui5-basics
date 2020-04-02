sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/networkgraph/layout/TwoColumnsLayout"
], function (Controller, JSONModel, TwoColumnsLayout) {

	return Controller.extend("sap.suite.ui.commons.sample.NetworkGraphTwoColumns.NetworkGraph", {
		onInit: function () {
			var oGraph = this.byId("graph"),
				sModuleName = "sap.suite.ui.commons.sample.NetworkGraphTwoColumns",
				oModel = new JSONModel(jQuery.sap.getModulePath(sModuleName, "/graph.json"));

			oModel.setSizeLimit(Number.MAX_SAFE_INTEGER);
			this.getView().setModel(oModel);
			oGraph.setLayoutAlgorithm(new TwoColumnsLayout());
		}
	});
});