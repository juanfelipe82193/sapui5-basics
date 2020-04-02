sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/misc/Format",
	"sap/gantt/library"
], function (Controller, JSONModel, Format, GanttLibrary) {
	"use strict";
	var TimeUnit = GanttLibrary.config.TimeUnit;

	var oTimeLineOptions = {
		"OneHour": {
			innerInterval: {
				unit: TimeUnit.hour,
				span: 1,
				range: 90
			},
			largeInterval: {
				unit: TimeUnit.day,
				span: 1,
				pattern: "dd.MM.YYYY"
			},
			smallInterval: {
				unit: TimeUnit.hour,
				span: 1,
				pattern: "HH:mm"
			}
		},
		"TwelveHours": {
			innerInterval: {
				unit: TimeUnit.hour,
				span: 12,
				range: 90
			},
			largeInterval: {
				unit: TimeUnit.day,
				span: 1,
				pattern: "dd.MM.YYYY"
			},
			smallInterval: {
				unit: TimeUnit.hour,
				span: 12,
				pattern: "HH:mm"
			}
		},
		"OneDay": {
			innerInterval: {
				unit: TimeUnit.day,
				span: 1,
				range: 90
			},
			largeInterval: {
				unit: TimeUnit.month,
				span: 1,
				pattern: "LLLL YYYY"
			},
			smallInterval: {
				unit: TimeUnit.day,
				span: 1,
				pattern: "dd"
			}
		},
		"OneMonth": {
			innerInterval: {
				unit: TimeUnit.month,
				span: 1,
				range: 90
			},
			largeInterval: {
				unit: TimeUnit.year,
				span: 1,
				format: "YYYY"
			},
			smallInterval: {
				unit: TimeUnit.month,
				span: 1,
				pattern: "LLL"
			}
		}
	};

	return Controller.extend("sap.gantt.sample.GanttChart2ZoomingStepWise.Gantt", {
		onInit: function () {
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/gantt/sample/GanttChart2ZoomingStepWise/data.json"));
			this.getView().setModel(oModel);

			var oZoomStrategy = this.getView().byId("zoomStrategy");
			oZoomStrategy.setTimeLineOptions(oTimeLineOptions);
			oZoomStrategy.setTimeLineOption(oTimeLineOptions["OneDay"]);
		},
		fnTimeConverter: function (sTimestamp) {
			return Format.abapTimestampToDate(sTimestamp);
		}
	});
});
