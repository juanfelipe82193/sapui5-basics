sap.ui.define(['sap/m/MessageToast', 'sap/ui/core/mvc/Controller'],
	function(MessageToast, Controller){
	"use strict";

	var PageController = Controller.extend("sap.suite.ui.microchart.sample.ComparisonMicroChartInGenericTile.Page", {

		press: function (oEvent) {
			MessageToast.show("The GenericTile is pressed.");
		}

	});

	return PageController;

});