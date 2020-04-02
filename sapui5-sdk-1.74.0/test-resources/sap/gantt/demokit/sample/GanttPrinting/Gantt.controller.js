sap.ui.require([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/gantt/axistime/StepwiseZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Column",
	"sap/m/Text",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseChevron",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/BaseDiamond",
	"sap/gantt/simple/BaseCursor",
	"sap/gantt/simple/BaseImage",
	"sap/gantt/simple/BasePath",
	"sap/gantt/misc/Format",
	"sap/ui/core/LocaleData",
	"sap/gantt/library",
	"sap/gantt/simple/ContainerToolbar",
	"sap/m/OverflowToolbarButton",
	"sap/gantt/simple/GanttPrinting"
], function (Controller, JSONModel, GanttChartWithTable, StepwiseZoomStrategy, TimeHorizon, TreeTable, Column, Text, GanttChartContainer,
			 GanttRowSettings, BaseRectangle, BaseChevron, BaseText, BaseDiamond, BaseCursor, BaseImage, BasePath, Format, LocaleData, GanttLibrary, ContainerToolbar, OverflowToolbarButton,
			 GanttPrinting) {
	"use strict";

	var TimeUnit = GanttLibrary.config.TimeUnit;
	var oLocaleData = LocaleData.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale());
	var sShortTimePattern = oLocaleData.getTimePattern("short");
	var sShortDatePattern = oLocaleData.getDatePattern("short");
	var sDayDatePattern = oLocaleData.getCustomDateTimePattern("EEEdd");
	var sCalendarWeekPattern = "'CW'" + oLocaleData.getCustomDateTimePattern("w");
	var sMonthPattern = oLocaleData.getCustomDateTimePattern("yyyMMM");

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
					pattern: sShortDatePattern
			},
			smallInterval: {
				unit: TimeUnit.hour,
					span: 1,
					pattern: sShortTimePattern
			}
		},
		"TwoHours": {
			innerInterval: {
				unit: TimeUnit.hour,
					span: 2,
					range: 90
			},
			largeInterval: {
				unit: TimeUnit.day,
					span: 1,
					pattern: sShortDatePattern
			},
			smallInterval: {
				unit: TimeUnit.hour,
					span: 2,
					pattern: sShortTimePattern
			}
		},
		"FourHours": {
			innerInterval: {
				unit: TimeUnit.hour,
					span: 4,
					range: 90
			},
			largeInterval: {
				unit: TimeUnit.day,
					span: 1,
					pattern: sShortDatePattern
			},
			smallInterval: {
				unit: TimeUnit.hour,
					span: 4,
					pattern: sShortTimePattern
			}
		},
		"SixHours": {
			innerInterval: {
				unit: TimeUnit.hour,
					span: 6,
					range: 90
			},
			largeInterval: {
				unit: TimeUnit.day,
					span: 1,
					pattern: sShortDatePattern
			},
			smallInterval: {
				unit: TimeUnit.hour,
					span: 6,
					pattern: sShortTimePattern
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
					pattern: sShortDatePattern
			},
			smallInterval: {
				unit: TimeUnit.hour,
					span: 12,
					pattern: sShortTimePattern
			}
		},
		"OneDay": {
			innerInterval: {
				unit: TimeUnit.day,
					span: 1,
					range: 90
			},
			largeInterval: {
				unit: TimeUnit.week,
					span: 1,
					pattern: sMonthPattern + ", " + sCalendarWeekPattern
			},
			smallInterval: {
				unit: TimeUnit.day,
					span: 1,
					pattern: sDayDatePattern
			}
		}
	};

	var oShape1 = {
		path: "rectangles",
			templateShareable: true,
			template: new BaseRectangle({
			time: {
				path: "startTime",
				formatter: Format.abapTimestampToDate
			},
			endTime: {
				path: "endTime",
				formatter: Format.abapTimestampToDate
			},
			fill: {
				path: "color"
			}
		})
	};

	var oShape2 = {
		path: "chevrons",
			templateShareable: true,
			template: new BaseChevron({
			time: {
				path: "startTime",
				formatter: Format.abapTimestampToDate
			},
			endTime: {
				path: "endTime",
				formatter: Format.abapTimestampToDate
			},
			fill: {
				path: "color"
			}
		})
	};

	var oShape3 = {
		path: "texts",
			templateShareable: true,
			template: new BaseText({
			time: {
				path: "startTime",
				formatter: Format.abapTimestampToDate
			},
			endTime: {
				path: "endTime",
				formatter: Format.abapTimestampToDate
			},
			text: "##### Testiiiiiiiing #######",
			fill: {
				path: "color"
			}

		})
	};

	var oShape4 = {
		path: "diamonds",
			templateShareable: true,
			template: new BaseDiamond({
			time: {
				path: "startTime",
				formatter: Format.abapTimestampToDate
			},
			endTime: {
				path: "endTime",
				formatter: Format.abapTimestampToDate
			},
			fill: {
				path: "color"
			}
		})
	};

	var oShape5 = {
		path: "images",
			templateShareable: true,
			template: new BaseImage({
			src: sap.ui.require.toUrl("sap/gantt/sample/GanttPrinting/sap.png"),
			time: {
				path: "startTime",
				formatter: Format.abapTimestampToDate
			},
			endTime: {
				path: "endTime",
				formatter: Format.abapTimestampToDate
			}
		})
	};

	return Controller.extend("sap.gantt.sample.GanttPrinting.Gantt", {
		onInit: function () {
			var oDateFrom = new Date();
			oDateFrom.setHours(0, 0, 0);
			oDateFrom.setDate(1);

			var oDateTo = new Date();
			oDateTo.setHours(0, 0, 0);
			oDateTo.setDate(1);
			oDateTo.setMonth(oDateTo.getMonth() + 2);

			var oStrategyDay = new StepwiseZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: oDateFrom,
					endTime: oDateTo
				}),
				visibleHorizon: new TimeHorizon({
					startTime: oDateFrom,
					endTime: new Date()
				}),
				timeLineOptions: oTimeLineOptions,
				zoomLevel: 4
			});
			var oGanttRowSettings = {
				rowId: "{id}",
				shapes1: oShape1,
				shapes2: oShape2,
				shapes3: oShape3,
				shapes4: oShape4,
				shapes5: oShape5
			};

			function createJSONData() {
				var oData = {
					root: {
						children: []
					}
				};

				function getRandomStartAndEndNumber(iMin, iMax) {
					var bLeapMonth = false;
					if (iMin > iMax) {
						iMax = iMax + 12; // add one year in months
						bLeapMonth = true;
					}

					var fGeneratedInRange1 = Math.random() * (iMax - iMin) + iMin,
						fGeneratedInRange2 = Math.random() * (iMax - iMin) + iMin;

					var iSmaller = Math.floor(Math.min(fGeneratedInRange1, fGeneratedInRange2)),
						iLarger = Math.floor(Math.max(fGeneratedInRange1, fGeneratedInRange2));

					return {
						start: iSmaller,
						end: bLeapMonth && iLarger > 11 ? iLarger - 12 : iLarger
					};
				}

				/* use more rectangles shapes */
				var aShapes = ["rectangle", "rectangle", "rectangle", "chevron", "text", "diamond", "image"];

				for (var i = 0; i < 80; i++) {
					var oShapeDateDays = getRandomStartAndEndNumber(1, 31);
					var oShapeDateMonths = getRandomStartAndEndNumber(oDateFrom.getMonth(), oDateTo.getMonth());

					var iRandShape = Math.floor(Math.random() * aShapes.length);

					var oNewShape = {
						id: i,
						name: "Row " + i,
						text: aShapes[iRandShape]
					};

					var oDateStartTime = new Date(),
						oDateEndTime = new Date();

					oDateStartTime.setDate(oShapeDateDays.start);
					oDateStartTime.setMonth(oShapeDateMonths.start);

					oDateEndTime.setDate(oShapeDateDays.end);
					oDateEndTime.setMonth(oShapeDateMonths.end);

					oNewShape[aShapes[iRandShape] + "s"] =
						[
							{
								id: "rect" + i,
								startTime: oDateStartTime,
								endTime: oDateEndTime,
								color: "#" + Math.floor(Math.random() * 16777215).toString(16)
							}
						];

					oData.root.children.push(oNewShape);
				}

				// add some nested rows
				oData.root.children[0].children = [
					{
						id: "00",
						name: "Row 00",
						text: "text",
						children: [
							{
								id: "0000",
								name: "Row 0000",
								text: "text"
							}
						]
					},
					{
						id: "000",
						name: "Row 000",
						text: "text"
					}
				];

				oData.root.children[1].children = [
					{
						id: "01",
						name: "Row 01",
						text: "text"
					}
				];

				oData.root.children[15].children = [
					{
						id: "015",
						name: "Row 015",
						text: "text"
					}
				];

				return oData;
			}

			var oModel = new JSONModel(createJSONData());
			this.getView().setModel(oModel);

			this.oGantt = new GanttChartWithTable({
				table: new TreeTable({
					selectionMode: "Single",
					visibleRowCountMode: "Auto",
					minAutoRowCount: 12,
					selectionBehavior: "RowSelector",
					rows: {
						path: "/root",
						parameters: {
							arrayNames: ["children"],
							numberOfExpandedLevels: 1
						}
					},
					columns: new Column({
						label: "Label",
						template: new Text({
							text: "{name}"
						})
					}),
					rowSettingsTemplate: new GanttRowSettings(
						oGanttRowSettings
					)
				}),
				axisTimeStrategy: oStrategyDay,
				height: "600px"
			});

			var oContainer = this.getView().byId("ganttContainer");
			oContainer.addGanttChart(this.oGantt);
		},
		onExportPDF: function () {
			var oGanttPrinting = new GanttPrinting({
				ganttChart: this.oGantt
			});

			oGanttPrinting.open();
		}
	});
});
