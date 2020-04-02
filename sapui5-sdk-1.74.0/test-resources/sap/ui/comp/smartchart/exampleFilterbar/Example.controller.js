sap.ui.define([
	'sap/base/Log',
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageBox',
	'sap/m/MessageToast'
], function(Log, Controller, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("test.sap.ui.comp.smartchart.Example", {

		onInit: function() {
			// handle selection details actions
			this.byId("smartChart01").attachSelectionDetailsActionPress(function(oEvent) {
				MessageToast.show(oEvent.getParameter("action").getText() + " is pressed" + "\n " + oEvent.getParameter("itemContexts").length + " items selected" + "\n level is: " + oEvent.getParameter("level"));
				//Example for getting binding context object
				//oEvent.getParameter("itemContexts");
			});
			// log chart data change event on console
			this.byId("smartChart01").attachChartDataChanged(function(oEvent){
				Log.info(oEvent.getParameter("changeTypes"));
			});
		},

		onNavigate: function(oEvent) {
			var oParameters = oEvent.getParameters();
			if (oParameters.text === "Homepage") {
				return;
			}
			MessageBox.show(oParameters.text + " has been pressed", {
				icon: MessageBox.Icon.INFORMATION,
				title: "SmartChart demo",
				actions: [
					MessageBox.Action.OK
				]
			});
		}

	});
});
