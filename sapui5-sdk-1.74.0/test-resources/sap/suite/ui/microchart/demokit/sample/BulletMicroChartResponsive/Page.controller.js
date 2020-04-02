sap.ui.define([
		'sap/m/MessageToast',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	],
	function (MessageToast, Controller, JSONModel) {
		"use strict";

		var PageController = Controller.extend("sap.suite.ui.microchart.sample.BulletMicroChartResponsive.Page", {
			onInit: function() {
				this.oModel = new JSONModel({
					width: 168,
					height: 72
				});
				this.getView().setModel(this.oModel);
			},
			press: function (oEvent) {
				MessageToast.show("The bullet micro chart is pressed.");
			},
			onLarge: function() {
				this.oModel.setProperty("/width", 192);
				this.oModel.setProperty("/height", 94);
			},
			onMedium: function() {
				this.oModel.setProperty("/width", 168);
				this.oModel.setProperty("/height", 72);
			},
			onSmall: function() {
				this.oModel.setProperty("/width", 132);
				this.oModel.setProperty("/height", 56);
			},
			onExtraSmall: function() {
				this.oModel.setProperty("/width", 96);
				this.oModel.setProperty("/height", 18);
			},
			onTypeChange: function(oEvent) {
				var oChart = this.byId("bulletChart");

				switch (oEvent.getParameter("selectedIndex")) {
					default:
					case 0:
						oChart.setForecastValue();
						oChart.setMode("Actual");
						break;
					case 1:
						oChart.setForecastValue(140);
						oChart.setMode("Actual");
						break;
					case 2:
						oChart.setMode("Delta");
						break;
				}
			},
			onBorderSwitch: function(oEvent) {
				var bState = oEvent.getParameter("state"),
					oContainer = this.byId("chartContainer");

				if (bState) {
					oContainer.$().css("border", "1px solid #c5c5c5");
					oContainer.$().css("box-sizing", "content-box");
				} else {
					oContainer.$().css("border", "");
				}


			}
		});

		return PageController;

	});
