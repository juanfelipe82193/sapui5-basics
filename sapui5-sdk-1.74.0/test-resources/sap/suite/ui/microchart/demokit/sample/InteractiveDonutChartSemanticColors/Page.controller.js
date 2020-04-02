sap.ui.define(['sap/m/MessageToast', 'sap/ui/core/mvc/Controller'],
	function (MessageToast, Controller) {
	"use strict";

	var PageController = Controller.extend("sap.suite.ui.microchart.sample.InteractiveDonutChartSemanticColors.Page", {

		/**
		 * Creates a message for a press event on the chart
		 *
		 * @private
		 */
		press: function (oEvent) {
			MessageToast.show("The Interactive Donut Chart is pressed.");
		},

		/**
		 * Creates a message for a selection change event on the chart
		 *
		 * @private
		 */
		onSelectionChanged: function (oEvent) {
			var oSegment = oEvent.getParameter("segment");
			MessageToast.show("The selection changed: " + oSegment.getLabel() + " " + ((oSegment.getSelected()) ? "selected" : "not selected"));
		}
	});

	return PageController;

});
