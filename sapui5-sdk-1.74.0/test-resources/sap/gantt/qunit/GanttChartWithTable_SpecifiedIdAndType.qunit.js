/*global QUnit */
sap.ui.define([
	"sap/gantt/def/cal/CalendarDefs",
	"sap/gantt/def/cal/Calendar",
	"sap/gantt/def/cal/TimeInterval",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/test/shape/OrderShape",
	"sap/gantt/test/shape/TopIndicator",
	"sap/gantt/test/shape/OverlapRectangle",
	"sap/gantt/test/shape/RectangleGroup",
	"sap/gantt/shape/cal/Calendar",
	"sap/gantt/shape/ext/ubc/UtilizationBarChart",
	"sap/gantt/shape/ext/ubc/UbcOverCapacityZonePolygon",
	"sap/gantt/shape/ext/ubc/UbcUnderCapacityZonePolygon",
	"sap/gantt/shape/ext/ubc/UbcShortageCapacityPolygon",
	"sap/gantt/shape/ext/ubc/UbcUsedPolygon",
	"sap/gantt/shape/ext/ubc/UbcBorderPath",
	"sap/gantt/shape/ext/ulc/UtilizationLineChart",
	"sap/gantt/shape/ext/ulc/UlcMiddleLine",
	"sap/gantt/shape/ext/ulc/UlcOverCapacityZoneRectangle",
	"sap/gantt/shape/ext/ulc/UlcDimension",
	"sap/gantt/shape/ext/ulc/UlcClipPath",
	"sap/gantt/shape/ext/ulc/UlcDimension",
	"sap/gantt/shape/ext/ulc/UlcClipingPath",
	"sap/gantt/shape/ext/ulc/UlcOverClipRectangle",
	"sap/gantt/shape/ext/ulc/UlcUnderClipRectangle",
	"sap/gantt/shape/ext/ulc/UlcBorderPath"
], function (CalendarDefs, Calendar, TimeInterval, qutils) {
	"use strict";

	// create configuration objects
	var oTimeAxisConfig = new sap.gantt.config.TimeAxis({
		planHorizon: new sap.gantt.config.TimeHorizon({
			startTime: "20150601000000",
			endTime: "20160627060610"
		}),
		initHorizon: new sap.gantt.config.TimeHorizon({
			startTime: "20151210120000",
			endTime: "20160112000000"
		}),
		granularity: "1week"
	});

	var aHierarchiesConfig = [];
	//resource hierarchy
	aHierarchiesConfig.push(new sap.gantt.config.Hierarchy({
		key: "RESOURCES_SPECIFIED_ID_TYPE",
		text: "Resources",
		activeModeKey: "D",
		columns: [new sap.gantt.config.HierarchyColumn({
			key: "h1",
			title: "Unique ID",
			contentType: "MASTER",
			sortAttribute: "uuid",
			filterAttribute: "uuid",
			attribute: "uuid"
		}), new sap.gantt.config.HierarchyColumn({
			key: "h2",
			title: "Plate / Name",
			contentType: "2",
			sortAttribute: "plate",
			filterAttribute: "plate",
			attribute: "plate"
		}), new sap.gantt.config.HierarchyColumn({
			key: "h3",
			title: "type",
			contentType: "2",
			sortAttribute: "Rtype",
			filterAttribute: "Rtype",
			attribute: "Rtype"
		})]
	}));

	var aChartSchemesConfig = [
		new sap.gantt.config.ChartScheme({
			key: "ac_main",
			rowSpan: 2,
			shapeKeys: ["order", "order_overlap_shortage", "ActivityKey", "activity_overlap", "calendar"]
		}), new sap.gantt.config.ChartScheme({
			key: "ubc_hr",
			rowSpan: 2,
			modeKey: "C",
			shapeKeys: ["ubc"]
		}), new sap.gantt.config.ChartScheme({
			key: "ulc_main",
			name: "Utilization",
			icon: "../image/utilization.png",
			rowSpan: 2,
			modeKey: "U",
			haveBackground: true,
			shapeKeys: ["ulc"],
			rowIndexName: "ulcRowIndex"
		}),
		new sap.gantt.config.ChartScheme({
			key: "ac_expand_overlap",
			name: "Overlaps",
			icon: "../image/overlap.png",
			rowSpan: 2,
			shapeKeys: ["order_greedy", "activity_greedy"],
			rowIndexName: "overlapRowIndex"
		})
	];

	var aObjectTypesConfig = [
		new sap.gantt.config.ObjectType({
			key: "01",
			description: "Truck",
			mainChartSchemeKey: "ac_main",
			expandedChartSchemeKeys: ["ulc_main", "ac_expand_overlap"]
		}), new sap.gantt.config.ObjectType({
			key: "02",
			description: "Trailer",
			mainChartSchemeKey: "ac_expand_overlap"
		}), new sap.gantt.config.ObjectType({
			key: "06",
			description: "Truck",
			mainChartSchemeKey: "ulc_main"
		}), new sap.gantt.config.ObjectType({
			key: "05",
			description: "Handling Resource",
			mainChartSchemeKey: "ubc_hr"
		})
	];

	var aShapeDataNames = [
		{ name: "activity", idName: "ActId" },
		{ name: "activity_overlap", idName: "ActOverlapId" },
		{ name: "activity_greedy", idName: "ActGreedyId" },
		{ name: "order", idName: "OrderId" },
		{ name: "order_greedy", idName: "OrderGreedyId" },
		{ name: "order_overlap_shortage", idName: "OrderOverlapId" },
		{ name: "ubc", idName: "ubcId" },
		{ name: "ulc", idName: "ulcId" },
		{ name: "nwt", idName: "nwtId" }];

	var aShapeConfig = [new sap.gantt.config.Shape({
		key: "calendar",
		shapeClassName: "sap.gantt.shape.cal.Calendar",
		shapeDataName: "nwt",
		level: 30,
		shapeProperties: {
			calendarName: "{nwtId}",
			height: 33,
			isDuration: false
		}
	}), new sap.gantt.config.Shape({
		key: "order",
		shapeDataName: "order",
		modeKeys: ["A"],
		level: 20,
		shapeClassName: "sap.gantt.test.shape.RectangleGroup",
		shapeProperties: {
			time: "{startTime}",
			endTime: "{endTime}",
			title: "{tooltip}",
			rx: 0,
			ry: 0,
			isDuration: true
		},
		groupAggregation: [new sap.gantt.config.Shape({
			shapeClassName: "sap.gantt.test.shape.OrderShape",
			shapeProperties: {
				time: "{startTime}",
				endTime: "{endTime}",
				title: "{tooltip}",
				rx: 0,
				ry: 0,
				isDuration: true
			}
		})]
	}), new sap.gantt.config.Shape({
		key: "order_greedy",
		shapeDataName: "order_greedy",
		modeKeys: ["A"],
		level: 20,
		shapeClassName: "sap.gantt.test.shape.OrderShape",
		shapeProperties: {
			time: "{startTime}",
			endTime: "{endTime}",
			title: "{tooltip}",
			rx: 0,
			ry: 0,
			isDuration: true
		}
	}), new sap.gantt.config.Shape({
		key: "ActivityKey",
		shapeDataName: "activity",
		modeKeys: ["D"],
		level: 10,
		shapeClassName: "sap.gantt.test.shape.RectangleGroup",
		shapeProperties: {
			time: "{startTime}",
			endTime: "{endTime}",
			rx: 0,
			ry: 0,
			isDuration: true,
			enableDnD: true
		},
		groupAggregation: [new sap.gantt.config.Shape({
			shapeClassName: "sap.gantt.test.shape.OrderShape",
			shapeProperties: {
				time: "{startTime}",
				endTime: "{endTime}",
				title: "{tooltip}",
				rx: 0,
				ry: 0,
				isDuration: true
			}
		}), new sap.gantt.config.Shape({
			shapeClassName: "sap.gantt.test.shape.TopIndicator",
			level: 8,
			shapeProperties: {
				time: "{startTime}",
				endTime: "{endTime}",
				yBias: 9,
				isDuration: true,
				height: 3,
				strokeWidth: 1,
				title: "{tooltip}"
			}
		})]
	}), new sap.gantt.config.Shape({
		key: "activity_greedy",
		shapeDataName: "activity_greedy",
		modeKeys: ["D", "C"],
		level: 10,
		shapeClassName: "sap.gantt.test.shape.OrderShape",
		shapeProperties: {
			time: "{startTime}",
			endTime: "{endTime}",
			title: "{tooltip}",
			rx: 0,
			ry: 0,
			isDuration: true,
			enableDnD: true
		}
	}), new sap.gantt.config.Shape({
		key: "order_overlap_shortage",
		shapeDataName: "order_overlap_shortage",
		modeKeys: ["A", "D"],
		level: 9,
		shapeClassName: "sap.gantt.test.shape.OverlapRectangle",
		shapeProperties: {
			time: "{startTime}",
			endTime: "{endTime}",
			rx: 0,
			ry: 0,
			isDuration: true,
			yBias: 7,
			strokeWidth: 1,
			fill: "red",
			stroke: "#FFF",
			height: 3
		}
	}), new sap.gantt.config.Shape({
		key: "activity_overlap",
		shapeDataName: "activity_overlap",
		modeKeys: ["A", "D"],
		level: 9,
		shapeClassName: "sap.gantt.test.shape.OverlapRectangle",
		shapeProperties: {
			time: "{startTime}",
			endTime: "{endTime}",
			rx: 0,
			ry: 0,
			isDuration: true,
			enableDnD: true
		}
	}), new sap.gantt.config.Shape({
		key: "ubc",
		shapeDataName: "ubc",
		modeKeys: ["C"],
		level: 10,
		shapeClassName: "sap.gantt.shape.ext.ubc.UtilizationBarChart",
		shapeProperties: {
			isBulk: true,
			arrayAttribute: "period",
			timeFilterAttribute: "start_date",
			endTimeFilterAttribute: "end_date"
		},
		groupAggregation: [new sap.gantt.config.Shape({
			shapeDataName: "ubc_capacity",
			shapeClassName: "sap.gantt.shape.ext.ubc.UbcOverCapacityZonePolygon",
			shapeProperties: {
				isBulk: true,
				fill: "url('#pattern_backslashFilled_gray')",
				stroke: "#CAC7BA",
				strokeWidth: 0.5
			}
		}), new sap.gantt.config.Shape({
			shapeDataName: "ubc_capacity",
			shapeClassName: "sap.gantt.shape.ext.ubc.UbcUnderCapacityZonePolygon",
			shapeProperties: {
				isBulk: true,
				fill: "#40d44c"
			}
		}), new sap.gantt.config.Shape({
			shapeDataName: "ubc_capacity",
			shapeClassName: "sap.gantt.shape.ext.ubc.UbcShortageCapacityPolygon",
			shapeProperties: {
				isBulk: true,
				fill: "#FF0000",
				stroke: "#CAC7BA"
			}
		}), new sap.gantt.config.Shape({
			shapeDataName: "ubc_capacity",
			shapeClassName: "sap.gantt.shape.ext.ubc.UbcUsedPolygon",
			shapeProperties: {
				isBulk: true,
				fill: "#CAC7BA"
			}
		}), new sap.gantt.config.Shape({
			shapeDataName: "ubc_capacity",
			shapeClassName: "sap.gantt.shape.ext.ubc.UbcBorderPath",
			shapeProperties: {
				isBulk: true,
				stroke: "blue",
				strokeWidth: 0.5
			}
		})]
	}), new sap.gantt.config.Shape({
		key: "ulc",
		shapeDataName: "ulc",
		modeKeys: ["U"],
		level: 10,
		shapeClassName: "sap.gantt.shape.ext.ulc.UtilizationLineChart",
		shapeProperties: {
			isBulk: true
		},
		groupAggregation: [new sap.gantt.config.Shape({
			shapeClassName: "sap.gantt.shape.ext.ulc.UlcMiddleLine",
			shapeProperties: {
				isBulk: true
			}
		}), new sap.gantt.config.Shape({
			shapeClassName: "sap.gantt.shape.ext.ulc.UlcOverCapacityZoneRectangle",
			shapeProperties: {
				isBulk: true,
				fill: "url('#pattern_backslash_grey')"
			}
		}), new sap.gantt.config.Shape({
			shapeDataName: "order",
			shapeClassName: "sap.gantt.shape.Group",
			shapeProperties: {
				isBulk: true
			},
			groupAggregation: [new sap.gantt.config.Shape({
				shapeDataName: "util",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcDimension",
				shapeProperties: {
					isBulk: true
				},
				groupAggregation: [new sap.gantt.config.Shape({
					shapeClassName: "sap.gantt.shape.ext.ulc.UlcClipPath",
					shapeProperties: {
						isBulk: true
					},
					clippathAggregation: [new sap.gantt.config.Shape({
						shapeClassName: "sap.gantt.shape.ext.ulc.UlcClipingPath",
						shapeProperties: {
							isBulk: true
						}
					})]
				}), new sap.gantt.config.Shape({
					shapeClassName: "sap.gantt.shape.ext.ulc.UlcOverClipRectangle",
					shapeProperties: {
						isBulk: true
					}
				}), new sap.gantt.config.Shape({
					shapeClassName: "sap.gantt.shape.ext.ulc.UlcUnderClipRectangle",
					shapeProperties: {
						isBulk: true
					}
				}), new sap.gantt.config.Shape({
					shapeClassName: "sap.gantt.shape.ext.ulc.UlcBorderPath",
					shapeProperties: {
						isBulk: true,
						utilizationCurves: {
							util_volume: {
								name: "Volume",
								color: "#30920D",
								ratioAttibute: "util_volume"
							},
							util_mass: {
								name: "Weight",
								color: "#30920D",
								ratioAttribute: "util_mass"
							}
						}
					}
				})]
			})]
		})]
	})];

	// create cell callback
	var CellCallback = function () { };
	CellCallback.prototype.createCellContent = function (oColumnConfig) {
		return new sap.m.Label({});
	};
	CellCallback.prototype.updateCellContent = function (oCellContent, oContext, sAttributeName, sObjectType, oColumnConfig) {
		if (sAttributeName !== undefined) {
			oCellContent.setText(oContext.getProperty(sAttributeName));
		}
	};

	// create test data model
	var oModel = new sap.ui.model.json.JSONModel();
	var sURLPrefix = sap.ui.require.toUrl("sap/gantt/qunit");
	oModel.loadData(sURLPrefix + "/data/hierarchy_resources_specified_id_type.json", null, false);

	function createGanttChart() {
		// instantiate GanttChartContainer
		var oGantt = new sap.gantt.GanttChartWithTable({
			timeAxis: oTimeAxisConfig,
			hierarchies: aHierarchiesConfig,
			chartSchemes: aChartSchemesConfig,
			objectTypes: aObjectTypesConfig,
			shapeDataNames: aShapeDataNames,
			shapes: aShapeConfig,
			hierarchyKey: "{test>/hierarchyKey}",
			cellCallback: new CellCallback(),
			rows: {
				path: "test>/root",
				parameters: {
					arrayNames: ["children"],
					gantt: { rowIdName: "Rid", rowTypeName: "Rtype" }
				}
			},
			relationships: {
				path: "test>root/relationships",
				parameters: {
					gantt: { rlsIdName: "relationship_id" }
				}
			},
			calendarDef: new CalendarDefs({
				defs: {
					path: "test>/calendar",
					template: new Calendar({
						key: "{test>id}",
						timeIntervals: {
							path: "test>data",
							templateShareable: true,
							template: new TimeInterval({
								startTime: "{test>startTime}",
								endTime: "{test>endTime}"
							})
						}
					})
				}
			})
		});
		oGantt.setModel(oModel, "test");
		oGantt.placeAt("qunit-fixture");
		return oGantt;
	}

	// qutils.delayTestStart();
	QUnit.module("Test Gantt Chart rendering with specified Id and Type", {
		beforeEach: function () {
			this.oGantt = createGanttChart();
		},
		afterEach: function () {
			this.oGantt.destroy();
			jQuery.sap.byId("qunit-fixture").removeClass("visible");
		}
	});

	QUnit.test("Test method _getConfiguredRowKeys", function (assert) {
		var oRowKeys = this.oGantt._getConfiguredRowKeys();
		assert.ok(oRowKeys != null, "Id and Type for row data is configured");
		assert.equal(oRowKeys.rowIdName, "Rid", "Id name for row data is 'Rid'");
		assert.equal(oRowKeys.rowTypeName, "Rtype", "Type name for row data is 'Rtype'");
	});

	QUnit.test("Test method getRowIdName", function (assert) {
		assert.equal(this.oGantt.getRowIdName(), "Rid", "Id name for row data is 'Rid'");
	});

	QUnit.test("Test method getRowTypeName", function (assert) {
		assert.equal(this.oGantt.getRowTypeName(), "Rtype", "Type name for row data is 'Rtype'");
	});

	QUnit.test("Test id and type of row data", function (assert) {
		this.oGantt.selectRows(["0000", "0001"], false);
		assert.ok(this.oGantt.getSelectedRows().length == 2, "Two rows are selected");
		var oRowItem = this.oGantt.getSelectedRows()[0];
		assert.equal(oRowItem.id, oRowItem.data[this.oGantt.getRowIdName()], "The row id is correctly handled");
		assert.equal(oRowItem.type, oRowItem.data[this.oGantt.getRowTypeName()], "The row type is correctly handled");
	});

	QUnit.test("Test data id names of [activiy, activity_greedy, activity_overlap, ulc, ubc]", function (assert) {
		this.oGantt.selectShapes(["activity0", "activity_greedy_0", "ulc01_2", "ubc_001", "act-overlap-Line0"]);
		var oSelectedShapes = this.oGantt.getSelectedShapes();
		assert.ok(oSelectedShapes != null, "Shapes are selected");
		var oActItem = oSelectedShapes["activity"][0].shapeData;
		assert.equal(oActItem.__id__, oActItem["ActId"], "The id for activity is correctly handled");
		var oActGreedyItem = oSelectedShapes["activity_greedy"][0].shapeData;
		assert.equal(oActGreedyItem.__id__, oActGreedyItem["ActGreedyId"], "The id for activity_greedy is correctly handled");
		var oActOverlapItem = oSelectedShapes["activity_overlap"][0].shapeData;
		assert.equal(oActOverlapItem.__id__, oActOverlapItem["ActOverlapId"], "The id for activity_overlap is correctly handled");
		var oUlcItem = oSelectedShapes["ulc"][0].shapeData;
		assert.equal(oUlcItem.__id__, oUlcItem["ulcId"], "The id for ulc is correctly handled");
		var oUbcItem = oSelectedShapes["ubc"][0].shapeData;
		assert.equal(oUbcItem.__id__, oUbcItem["ubcId"], "The id for ubc is correctly handled");
	});

	QUnit.test("Test data id names of [order, order_greedy, order_overlap_shortage, nwt]", function (assert) {
		this.oGantt.selectRows(["0000", "0001"], false);
		var aSelectedRow = this.oGantt.getSelectedRows();
		var orderItem = aSelectedRow[0].data["order"][0];
		assert.equal(orderItem.__id__, orderItem["OrderId"], "The id for order is correctly handled");
		var oOrderOverlapItem = aSelectedRow[0].data["order_overlap_shortage"][0];
		assert.equal(oOrderOverlapItem.__id__, oOrderOverlapItem["OrderOverlapId"], "The id for order_overlap_shortage is correctly handled");
		var oNwtItem = aSelectedRow[0].data["nwt"][0];
		assert.equal(oNwtItem.__id__, oNwtItem["nwtId"], "The id for nwt is correctly handled");
		var oOrderGreedyItem = aSelectedRow[1].data["order_greedy"][0];
		assert.equal(oOrderGreedyItem.__id__, oOrderGreedyItem["OrderGreedyId"], "The id for order_greedy is correctly handled");
	});

	QUnit.test("Test rowIndex of expand chart scheme [ulc_main, ac_expand_overlap]", function (assert) {
		var aAllRowData = this.oGantt._oGanttChart.getAllRowData();
		assert.ok(aAllRowData && aAllRowData.length == 4, "Four main rows are displayed correctly");

		//open the expand charts of the first row
		this.oGantt.handleExpandChartChange(true, ["ac_expand_overlap"], [0]);
		var isRowExpand = this.oGantt._oGanttChart._ifRowExpanded(0, ["ac_expand_overlap"]);
		assert.ok(isRowExpand == true, "Overlap expand chart is opened correctly");
		aAllRowData = this.oGantt._oGanttChart.getAllRowData();
		assert.ok(aAllRowData && aAllRowData.length == 8, "Four expaned rows for overlap scheme are also displayed correctly");

		//close the overlap expand chart
		this.oGantt.handleExpandChartChange(false, ["ac_expand_overlap"], [0]);
		isRowExpand = this.oGantt._oGanttChart._ifRowExpanded(0, ["ac_expand_overlap"]);
		assert.ok(isRowExpand == false, "Overlap expand chart is closed");

		//open ulc expand charts
		this.oGantt.handleExpandChartChange(true, ["ulc_main"], [0]);
		isRowExpand = this.oGantt._oGanttChart._ifRowExpanded(0, ["ulc_main"]);
		assert.ok(isRowExpand == true, "ULC expand chart is opened");
		aAllRowData = this.oGantt._oGanttChart.getAllRowData();
		assert.ok(aAllRowData && aAllRowData.length == 5, "One expaned row for ulc scheme is displayed correctly");
	});

	QUnit.test("Test method _getConfiguredRlsKeys", function (assert) {
		var oRlsKeys = this.oGantt._getConfiguredRlsKeys();
		assert.ok(oRlsKeys != null, "Relationship id is configured");
		assert.equal(oRlsKeys.rlsIdName, "relationship_id", "Relationship Id name is configured");
	});

	QUnit.test("Test method getRlsIdName", function (assert) {
		assert.equal(this.oGantt.getRlsIdName(), "relationship_id", "Relationship Id name is 'relationship_id'");
	});

}, false);
