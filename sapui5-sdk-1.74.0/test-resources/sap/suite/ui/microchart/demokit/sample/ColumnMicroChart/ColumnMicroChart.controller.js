sap.ui.define(['sap/m/MessageToast', 'sap/ui/core/mvc/Controller'],
	function (MessageToast, Controller){
	"use strict";

	var PageController = Controller.extend("sap.suite.ui.microchart.sample.ColumnMicroChart.ColumnMicroChart", {

		press: function (oEvent) {
			MessageToast.show("The column micro chart is pressed.");
		}

	});

	return PageController;

});