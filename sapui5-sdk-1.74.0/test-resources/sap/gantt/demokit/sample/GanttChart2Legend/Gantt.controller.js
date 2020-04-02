sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/misc/Format"
], function (Controller, JSONModel, Format) {
	"use strict";

	return Controller.extend("sap.gantt.sample.GanttChart2Legend.Gantt", {
		onInit: function () {
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/gantt/sample/GanttChart2Legend/data.json"));
			this.getView().setModel(oModel);
		},
		fnTimeConverter: function (sTimestamp) {
			return Format.abapTimestampToDate(sTimestamp);
		}
	});
});
