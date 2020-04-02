sap.ui.define(['sap/m/MessageToast', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel'],
	function (MessageToast, Controller, JSONModel) {
	"use strict";

	var PageController = Controller.extend("sap.suite.ui.microchart.sample.LineMicroChartGenericTile.Page", {
		onInit: function () {
			// set mock data
			var sPath = jQuery.sap.getModulePath("sap.suite.ui.microchart.sample.LineMicroChartGenericTile", "/SampleData.json");
			var oModel = new JSONModel(sPath);
			this.getView().setModel(oModel);
		},

		press: function (oEvent) {
			MessageToast.show("The Generic Tile has been pressed.");
		}
	});

	return PageController;

});
