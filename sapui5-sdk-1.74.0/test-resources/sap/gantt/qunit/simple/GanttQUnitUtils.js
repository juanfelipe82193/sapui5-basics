sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Column",
	"sap/m/Label",
	"sap/m/Text",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/Table",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/config/TimeHorizon"
], function(Core, GanttRowSettings, BaseRectangle, GanttChartWithTable, TreeTable, Column, Label, Text, JSONModel, Table,
            ProportionZoomStrategy, TimeHorizon){

	"use strict";
	var iNumberOfRows = 8;

	window.iNumberOfRows = iNumberOfRows;
	window.iNumberOfSubRows = 2;

/*
	+-------------------------------------------------------------+
	|  +--------------------+                                     |
	|  +--------------------+                                     |
	|  +---------+                                                |
	|  +---------+                                                |
	|             +---------+                                     |
	|             +---------+                                     |
	|                            +------------------------+       |
	|                            +------------------------+       |
	|                                                             |
	|                            +------------+                   |
	|                            +------------+                   |
	|                                          +----------+       |
	|                                          +----------+       |
	+-------------------------------------------------------------+
*/
	var fnCreateTestData = function(oVisibleHorizon, iNumberOfRows, iNumberOfSubRows, bCreateExpandData) {
		var oData = {rows: [], tree: {rows: []}};

		var Format = sap.gantt.misc.Format,
			iVisibleStartInMs = Format.abapTimestampToDate(oVisibleHorizon.getStartTime()).getTime(),
			iVisibleEndInMs = Format.abapTimestampToDate(oVisibleHorizon.getEndTime()).getTime();


		// 2 days interval
		var iIntervalInMs = 2 * 24 * 60 * 60 * 1000;
		var iTotalIntervalInMs = (iNumberOfRows - 1) * iIntervalInMs;
		var iDurationInMs = (iVisibleEndInMs - iVisibleStartInMs - iTotalIntervalInMs) / iNumberOfRows;

		var oRow, oSubRow;
		var iStartInMs = iVisibleStartInMs,
			iEndInMs = iStartInMs + iDurationInMs;
		for (var i = 0; i < iNumberOfRows; i++) {
			oRow = {
				"Id" : i,
				"Name": "Row_" + i,
				"StartDate": new Date(iStartInMs),
				"EndDate": new Date(iEndInMs)
			};

			if (bCreateExpandData) {
				// split the row duration into 3 parts, means the row represent 3 sub breaks
				var iNumOfPart = 3;
				var iPartInMs = Math.floor((iEndInMs - iStartInMs) / iNumOfPart);
				oRow.breaks = [];

				var iStartPartInMs = iStartInMs;
				for (var iPart = 0; iPart < iNumOfPart; iPart++) {
					oRow.breaks.push({
						"Id": oRow.Id + "_PART_" + iPart,
						"StartDate": new Date(iStartPartInMs),
						"EndDate": new Date(iStartPartInMs + iPartInMs)
					});
					iStartPartInMs += iPartInMs;
				}
			}

			oData.rows.push(jQuery.extend({}, oRow));

			var aSubRows = [];
			var oSubStart = new Date(iStartInMs);
			for (var j = 0; j < iNumberOfSubRows; j++) {
				oSubRow = {
					"Id": oRow["Id"] + "_SUB_" + j,
					"Name" : oRow["Name"] + "_SUB_" + j,
					"StartDate": oSubStart,
					"EndDate": new Date(oSubStart.getTime() + (iDurationInMs / iNumberOfSubRows))
				};
				oSubStart = new Date(oSubRow["EndDate"].getTime());
				aSubRows.push(oSubRow);
			}
			oRow.rows = aSubRows;
			oData.tree.rows.push(oRow);

			// the next row start time in millison seconds
			iStartInMs = iEndInMs + iIntervalInMs;
			iEndInMs = iStartInMs + iDurationInMs;
		}
		return oData;
	};

	var fnCreateDefaultShapeBindingSettings = function(){
		return new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "{Name}",
					fill: "#008FD3"
				})
			]
		});
	};

	var oGanttChart;
	var createGanttChart = function(bSkipPlaceAt, oRowSettingTemplate, bCreateExpandData) {
		oRowSettingTemplate = oRowSettingTemplate || fnCreateDefaultShapeBindingSettings();
		oGanttChart = new GanttChartWithTable("Fiori.Elements:ID.with.dots.to.test.jQuery.escaping", {
			table: new TreeTable({
				id: "table",
				visibleRowCountMode: "Auto",
				selectionMode: "Single",
				selectionBehavior: "Row",
				rows: {
					path: "/tree",
					parameters: {arrayNames: ["rows"]}
				},
				columns: [
					new Column({
						width: "250px",
						label: new Label({ text: "Name" }),
						template: new Text({ text: "{Name}", wrapping: false })
					}),
					new Column({
						width: "250px",
						label: new Label({ text: "Start Date" }),
						template: new Text({ text: "{StartDate}", wrapping: false })
					})
				],
				rowSettingsTemplate: oRowSettingTemplate
			})
		});

		window.oGanttChart = oGanttChart;

		var oModel = new JSONModel();

		oModel.setData(fnCreateTestData(sap.gantt.config.DEFAULT_INIT_HORIZON, window.iNumberOfRows, window.iNumberOfSubRows, !!bCreateExpandData));

		oGanttChart.setModel(oModel);

		if (!bSkipPlaceAt) {
			oGanttChart.placeAt("qunit-fixture");
			Core.applyChanges();
		}
		return oGanttChart;
	};

	var destroyGanttChart = function() {
		oGanttChart.destroy(true/**bSuppressInvalidate*/);
		oGanttChart = null;
	};

	function waitForGanttRendered(oGantt) {
		return oGantt.getInnerGantt().resolveWhenReady(true);
	}

	/**
	 * Creates a simple Gantt chart with one row and one provided shape.
	 * @param oShape Shape to render
	 * @param sStartTime Start time of view horizon
	 * @param sEndTime Ent time of view horizon
	 * @returns {*}
	 * @private
	 */
	function createSimpleGantt(oShape, sStartTime, sEndTime) {
		var oGantt = new GanttChartWithTable({
			id: "gantt",
			table: new Table({
				id: "table",
				columns: new Column({
					width: "250px",
					label: new Label({ text: "Text" }),
					template: "text"
				}),
				rows: {
					path: "/root"
				},
				rowSettingsTemplate: new GanttRowSettings({
					rowId: "{id}",
					shapes1: oShape
				})
			}),
			axisTimeStrategy: new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: sStartTime,
					endTime: sEndTime
				}),
				visibleHorizon: new TimeHorizon({
					startTime: sStartTime,
					endTime: sEndTime
				})
			})
		});
		oGantt.setModel(new JSONModel({
			root: [
				{
					id: "row1",
					text: "Row 1"
				}
			]
		}));
		return oGantt;
	}

	return {
		createGantt: createGanttChart,
		destroyGantt: destroyGanttChart,
		waitForGanttRendered: waitForGanttRendered,
		createSimpleGantt: createSimpleGantt
	};
});
