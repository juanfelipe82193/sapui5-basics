sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/misc/Format",
	"sap/ui/core/Fragment",
	"sap/gantt/library",
	"sap/ui/core/theming/Parameters"
], function (Controller, JSONModel, Format, Fragment, library, Parameters) {
	"use strict";

	return Controller.extend("sap.gantt.sample.GanttChartStandardShapes.Gantt", {
		onInit: function () {
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/gantt/sample/GanttChartStandardShapes/data.json"));
			this.getView().setModel(oModel);
		},
		fnTimeConverter: function (sTimestamp) {
			return Format.abapTimestampToDate(sTimestamp);
		},
		changeColor: function () {
			if (this._oDialog) {
				this._oDialog.open();
			} else {
				Fragment.load({
					name: "sap.gantt.sample.GanttChartStandardShapes.ColorDialog",
					controller: this
				}).then(function (oDialog) {
					this._oDialog = oDialog;
					this.getView().addDependent(oDialog);
					oDialog.setModel(new JSONModel({
						colors: library.palette.SemanticColors.concat(library.palette.LegendColors).concat(library.palette.AccentColors).map(function (c) {return {color: c};})
					}), "colors");
					oDialog.open();
				}.bind(this));
			}
		},
		colorToHex: function (sColor) {
			return Parameters.get(sColor);
		},
		handleColorSelected: function (oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			var sColor = oItem.data("color");
			this.getView().getModel().setProperty("/color", sColor);
		}
	});
});
