sap.ui.define(['sap/m/MessageToast', 'sap/ui/core/mvc/Controller'],
	function (MessageToast, Controller){
	"use strict";

	var PageController = Controller.extend("sap.suite.ui.microchart.sample.InteractiveBarChart.Page", {

		press: function (oEvent) {
			MessageToast.show("The interactive bar chart is pressed.");
		},

		selectionChanged: function (oEvent) {
			var oBar = oEvent.getParameter("bar");
			MessageToast.show("The selection changed: " + oBar.getLabel() + " " + ((oBar.getSelected()) ? "selected" : "deselected"));
		}
	});

	return PageController;

});