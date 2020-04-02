/*global QUnit */
sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/gantt/def/cal/CalendarDefs",
	"sap/gantt/def/cal/Calendar",
	"sap/gantt/def/cal/TimeInterval",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/test/shape/RectangleGroup",
	"sap/gantt/shape/Rectangle",
	"sap/gantt/shape/Text",
	"sap/gantt/shape/cal/Calendar"
], function(MockServer, CalendarDefs, Calendar, TimeInterval){
	"use strict";

	var sServiceUrl = "http://my.test.service.com/";
	var sURLPrefix = sap.ui.require.toUrl("sap/gantt/qunit");

	var oMockServer = new MockServer({
		rootUri : sServiceUrl
	});
	oMockServer.simulate(sURLPrefix + "/data/odata/metadata.xml", {
		sMockdataBaseUrl : sURLPrefix + "/data/odata/",
		bGenerateMissingMockData : true
	});

	oMockServer.start();
	// create data model
	var oDataModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl);

	var aChartSchemesConfig = [
		new sap.gantt.config.ChartScheme({
		key: "ac_main",
			rowSpan: 1,
			shapeKeys: ["workingTime", "task"]
		}),
		new sap.gantt.config.ChartScheme({
			key: "ac_expand_overlap",
			name: "Overlaps",
			icon: "./image/overlap.png",
			rowSpan: 1,
			shapeKeys: ["resource_greedy"],
			rowIndexName: "OverlapRowIndex"
		})
	];

	var aObjectTypesConfig = [
		new sap.gantt.config.ObjectType({
			key: "TYPE_01",
			description: "Project elements and resource overlaps",
			mainChartSchemeKey: "ac_main",
			expandedChartSchemeKeys: ["ac_expand_overlap"]
		})
	];

	// create configuration model
	var oDateType = new sap.ui.model.type.Date({pattern: "dd.MM.yyyy"});
	var aShapeConfig = [new sap.gantt.config.Shape({
		key: "task",
		shapeDataName: "Task",
		modeKeys: ["D"],
		level: 10,
		shapeClassName: "sap.gantt.test.shape.RectangleGroup",
		shapeProperties: {
			time: "{StartDate}",
			endTime: "{EndDate}",
			isDuration: true
		},
		groupAggregation: [new sap.gantt.config.Shape({
			shapeClassName: "sap.gantt.shape.Rectangle",
			shapeProperties: {
				time: "{StartDate}",
				endTime: "{EndDate}",
				fill: "orange",
				isDuration: true
			}
		}), new sap.gantt.config.Shape({
			shapeClassName: "sap.gantt.shape.Text",
			shapeProperties: {
				time: "{StartDate}",
				text: "{Explanation}",
				yBias: 0,
				xBias: -15,
				textAnchor: "end",
				fill:"black",
				isDuration: false
			}
		})]
	}),new sap.gantt.config.Shape({
		key: "workingTime",
		shapeClassName: "sap.gantt.shape.cal.Calendar",
		shapeDataName: "WorkingTime",
		level: 30,
		shapeProperties: {
			calendarName: "{calendarName}",
			height: 33,
			isDuration: false
		}
	}), new sap.gantt.config.Shape({
		key: "resource_greedy",
		shapeDataName: "ResourceGreedy",
		level: 20,
		shapeClassName: "sap.gantt.shape.Rectangle",
		shapeProperties: {
			time: "{StartDate}",
			endTime: "{EndDate}",
			fill: "green",
			isDuration: true
		}
	})
	];

	// instantiate GanttChartWithTable
	var oGantt = new sap.gantt.GanttChartWithTable({
		columns: [new sap.ui.table.Column({
			label: "Explanation",
			sortProperty: "Explanation",
			filterProperty: "Explanation",
			template: new sap.m.Label({
				text: {
					path: "Explanation",
					model: "data"
				}
			})
		}), new sap.ui.table.Column({
			label: "Start Date",
			sortProperty: "StartDate",
			filterProperty: "StartDate",
			filterType: oDateType,
			template: new sap.m.Label({
				text: {
					path: "StartDate",
					model: "data",
					type: oDateType
				}
			})
		})],
		timeAxis: new sap.gantt.config.TimeAxis({
			planHorizon: new sap.gantt.config.TimeHorizon({
				startTime: "20140628000000",
				endTime: "20170101000000"
			}),
			initHorizon: new sap.gantt.config.TimeHorizon({
				startTime: "20150101000000",
				endTime: "20150315000000"
			})
		}),
		chartSchemes: aChartSchemesConfig,
		objectTypes: aObjectTypesConfig,
		shapes: aShapeConfig,
		shapeDataNames:[{name: "Task", idName : "Tid"}, {name: "WorkingTime", idName: "WtId"}, {name: "ResourceGreedy", idName: "ResGreedyId"}],
		rows: {
			path: "data>/ProjectElmSet",
			parameters: {
				treeAnnotationProperties: {
					hierarchyLevelFor: "Level",
					hierarchyParentNodeFor: "SuperiorGuid",
					hierarchyNodeFor: "Guid",
					hierarchyDrillStateFor: "DrillDownState"
				},
				expand: "Task, WorkingTime, ResourceGreedy",
				gantt:{
					rowIdName : "PEid"
				}
			}
		},
		calendarDef: new CalendarDefs({
			defs: {
				path: "data>/CalendarSet",
				parameters: {
					expand: "CalendarInterval"
				},
				template: new Calendar({
					key: "{data>name}",
					timeIntervals: {
						path: "data>CalendarInterval",
						templateShareable: true,
						template: new TimeInterval({
							startTime: "{data>StartDate}",
							endTime: "{data>EndDate}"
						})
					}
				})
			}
		})
	});

	oGantt.setModel(oDataModel, "data");
	oGantt.placeAt("qunit-fixture");
	sap.ui.getCore().applyChanges();

	// qutils.delayTestStart(2000);
	QUnit.module("Test Gantt Chart using oData, rendering with specified Id and Type", {
		afterEach: function() {
			oGantt.destroy();
		}
	});

	QUnit.test("Test row id,type names, and id names of shapes", function(assert) {

		var done = assert.async();
		setTimeout(function(){
			//"Test method _getConfiguredRowKeys"
			var oRowKeys = oGantt._getConfiguredRowKeys();
			assert.ok(oRowKeys != null, "Id and Type for row data is configured");
			assert.equal(oRowKeys.rowIdName, "PEid", "Id name for row data is 'PEid'");
			assert.equal(oRowKeys.rowTypeName, "type", "Type name for row data is 'type'");

			//"Test method getRowIdName"
			assert.equal(oGantt.getRowIdName(), "PEid", "Id name for row data is 'PEid'");
			//"Test method getRowTypeName"
			assert.equal(oGantt.getRowTypeName(), "type", "Type name for row data is 'type'");
			//"Test id and type of row data"
			oGantt.selectRows(["0"], false);
			assert.ok(oGantt.getSelectedRows().length == 1, "One row is selected");
			var oRowItem = oGantt.getSelectedRows()[0];
			assert.equal(oRowItem.id, oRowItem.data[oGantt.getRowIdName()], "The row id is correctly handled");
			assert.equal(oRowItem.type, oRowItem.data[oGantt.getRowTypeName()], "The row type is correctly handled");

			//"Test data id names of [Task, ResourceGreedy, WorkingTime]"
			oGantt.selectRows(["0"], false);
			var aSelectedRow = oGantt.getSelectedRows();
			var oTaskItem = aSelectedRow[0].data["Task"][0];
			assert.equal(oTaskItem.__id__, oTaskItem["Tid"], "The id for Task is correctly handled");

			var oWorkingTimeItem = aSelectedRow[0].data["WorkingTime"][0];
			assert.equal(oWorkingTimeItem.__id__, oWorkingTimeItem["WtId"], "The id for WorkingTime is correctly handled");
			var oResGreedyItem = aSelectedRow[0].data["ResourceGreedy"][0];
			assert.equal(oResGreedyItem.__id__, oResGreedyItem["ResGreedyId"], "The id for ResourceGreedy is correctly handled");

			//"Test rowIndex of expand chart scheme [ac_expand_overlap]"
			var aAllRowData = oGantt._oGanttChart.getAllRowData();
			assert.ok(aAllRowData && aAllRowData.length == 2, "Two main rows are displayed correctly");

			//open the overlap expand charts of the first row
			oGantt.handleExpandChartChange(true,["ac_expand_overlap"],[0]);
			aAllRowData = oGantt._oGanttChart.getAllRowData();
			assert.ok(aAllRowData && aAllRowData.length == 6, "Four expaned rows for overlap scheme are displayed correctly");

			done();
		}, 2000);
	});
}, false);
