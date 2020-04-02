sap.ui.define(['sap/m/MessageToast', 'sap/ui/core/mvc/Controller'],
	function (MessageToast, Controller){
	"use strict";

	var PageController = Controller.extend("sap.suite.ui.microchart.sample.InteractiveLineChartSemanticColors.Page", {

		press: function (oEvent) {
			MessageToast.show("The interactive line chart is pressed.");
		},

		selectionChanged: function (oEvent) {
			var oPoint = oEvent.getParameter("point");
			MessageToast.show("The selection changed: " + oPoint.getLabel() + " " + ((oPoint.getSelected()) ? "selected" : "deselected"));
		}
	});

	return PageController;

});
