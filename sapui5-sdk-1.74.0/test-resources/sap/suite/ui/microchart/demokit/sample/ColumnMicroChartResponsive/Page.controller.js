sap.ui.define([
		'sap/m/MessageToast',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	],
	function (MessageToast, Controller, JSONModel) {
		"use strict";

		var PageController = Controller.extend("sap.suite.ui.microchart.sample.ColumnMicroChartResponsive.Page", {
			onInit: function() {
				this.oModel = new JSONModel({
					width: 168,
					height: 72
				});
				this.getView().setModel(this.oModel);
			},
			press: function (oEvent) {
				MessageToast.show("The micro chart is pressed.");
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
			onColumnLabels: function(oEvent) {
				var oChart = this.byId("columnChart");

				oChart.setAllowColumnLabels(oEvent.getParameter("selected"));
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
