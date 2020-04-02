sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/misc/Format",
	"sap/ui/core/theming/Parameters"
], function (Controller, JSONModel, Format, Parameters) {
	"use strict";

	return Controller.extend("sap.gantt.sample.GanttChart2Calendar.Gantt", {
		onInit: function () {
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/gantt/sample/GanttChart2Calendar/data.json"));
			this.getView().setModel(oModel);
		},
		fnTimeConverter: function (sTimestamp) {
			return Format.abapTimestampToDate(sTimestamp);
		},
		fnLessValueConvert: function (sValue) {
			return Parameters.get(sValue);
		}
	});
});
