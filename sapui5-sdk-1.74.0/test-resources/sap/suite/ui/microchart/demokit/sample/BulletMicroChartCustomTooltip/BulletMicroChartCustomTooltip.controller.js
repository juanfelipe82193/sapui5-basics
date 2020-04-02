sap.ui.define(['sap/ui/model/json/JSONModel','sap/m/MessageToast', 'sap/ui/core/mvc/Controller'],
	function (JSONModel, MessageToast, Controller){
	"use strict";

	var PageController = Controller.extend("sap.suite.ui.microchart.sample.BulletMicroChartCustomTooltip.BulletMicroChartCustomTooltip", {

		onInit: function () {
			var oModel = new JSONModel({
				actualValue: 47,
				color: "Error",
				minValue: 0,
				maxValue: 60,
				forecastValue: 4,
				targetValue: 0,
				size: "L"
			});
			this.getView().setModel(oModel);

		},

		press: function (oEvent) {
			MessageToast.show("The bullet micro chart is pressed.");
		}

	});

	return PageController;

});
