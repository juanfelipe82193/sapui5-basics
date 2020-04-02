sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/misc/Format"
], function (Controller, JSONModel, Format) {
	"use strict";

	return Controller.extend("sap.gantt.sample.GanttChart2Shapes.Gantt", {
		onInit: function () {
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/gantt/sample/GanttChart2Shapes/data.json"));
			this.getView().setModel(oModel);
		},
		fnTimeConverter: function (sTimestamp) {
			return Format.abapTimestampToDate(sTimestamp);
		},
		fnPrefixImg: function (sSrc) {
			return  sap.ui.require.toUrl("sap/gantt/sample/GanttChart2Shapes") + "/" + sSrc;
		},
		fnBuildApiUrl: function (sSufix) {
			var aParts = window.location.href.split("#");
			if (aParts.length !== 2) {
				return "/" + sSufix;
			} else {
				return aParts[0] + "#/api/" + sSufix;
			}
		}
	});
});
