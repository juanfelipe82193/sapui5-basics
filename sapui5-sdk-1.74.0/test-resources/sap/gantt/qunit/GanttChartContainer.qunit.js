/*global QUnit */
sap.ui.define([
	"sap/gantt/GanttChartContainer",
	"sap/gantt/legend/LegendContainer",
	"sap/gantt/GanttChartBase",
	"sap/ui/qunit/QUnitUtils"
], function (GanttChartContainer, LegendContainer, GanttChartBase, qutils) {
	"use strict";

	//use dummy ganttchart object to replace the real ganttchart. Because this qunit only needs to cover the ganttchartcontainer
	var DummyGanttChart = GanttChartBase.extend("sap.gantt.DummyGanttChart", {
		metadata: {
			properties: {
				enableCursorLine: { type: "boolean" },
				enableNowLine: { type: "boolean" },
				enableVerticalLine: { type: "boolean" },
				enableAdhocLine: { type: "boolean" }
			}
		}
	});
	DummyGanttChart.prototype.attachHorizontalScroll = function () { };
	DummyGanttChart.prototype.detachHorizontalScroll = function () { };
	DummyGanttChart.prototype.detachVerticalScroll = function () { };
	DummyGanttChart.prototype.attachVerticalScroll = function () { };
	DummyGanttChart.prototype.setSelectionPanelSize = function () { };
	DummyGanttChart.prototype.attachSplitterResize = function () { };
	DummyGanttChart.prototype.detachSplitterResize = function () { };
	DummyGanttChart.prototype.attachGanttChartSwitchRequested = function () { };
	DummyGanttChart.prototype.detachGanttChartSwitchRequested = function () { };
	DummyGanttChart.prototype.attachChartDragEnter = function () { };
	DummyGanttChart.prototype.detachChartDragEnter = function () { };
	DummyGanttChart.prototype.attachChartDragLeave = function () { };
	DummyGanttChart.prototype.detachChartDragLeave = function () { };
	DummyGanttChart.prototype.attachShapeDragEnd = function () { };
	DummyGanttChart.prototype.detachShapeDragEnd = function () { };
	DummyGanttChart.prototype.attachTreeTableToggleEvent = function () { };
	DummyGanttChart.prototype.detachTreeTableToggleEvent = function () { };
	DummyGanttChart.prototype.selectShapes = function () { return true; };
	DummyGanttChart.prototype.deselectShapes = function () { return true; };
	DummyGanttChart.prototype.selectRelationships = function () { return true; };
	DummyGanttChart.prototype.deselectRelationships = function () { return true; };
	DummyGanttChart.prototype.selectRows = function () { return true; };
	DummyGanttChart.prototype.deselectRows = function () { return true; };
	DummyGanttChart.prototype.selectRowsAndShapes = function () { return true; };
	DummyGanttChart.prototype.getSelectedShapes = function () { return ["shape0"]; };
	DummyGanttChart.prototype.getSelectedRows = function () { return ["row0"]; };
	DummyGanttChart.prototype.getSelectedRelationships = function () { return ["r0"]; };
	DummyGanttChart.prototype.getAllSelections = function () {
		return { rows: ["row0"], shapes: ["shape0"], relationships: ["r0"] };
	};
	DummyGanttChart.prototype.setTimeZoomRate = function () { };
	DummyGanttChart.prototype.jumpToPosition = function () { };
	DummyGanttChart.prototype.setDraggingData = function () { };
	DummyGanttChart.prototype.handleExpandChartChange = function () { };
	DummyGanttChart.prototype.notifySourceChange = function () { };
	DummyGanttChart.prototype.getHierarchyKey = function () { };
	DummyGanttChart.prototype.getAxisTimeStrategy = function () {
		return {
			setZoomLevel: function () {

			},
			setZoomLevels: function () {

			},
			reset: function () {

			},
			updateStopInfo: function () {

			},
			getZoomLevel: function () {

			},
			getTimeLineOption: function () {

			},
			setTimeLineOption: function () {

			},
			getVisibleHorizon: function () {

			},
			_setVisibleHorizon: function () {

			},
			_updateZoomControlType: function () {

			}
		};
	};
	DummyGanttChart.prototype.setTimePopoverData = function () { };

	QUnit.module("Test GanttChartContainer toolbar and legend", {
		beforeEach: function () {
			this.oGanttChartContainer = new GanttChartContainer();
			this.oLegendContainer = new LegendContainer({
				width: "300px",
				height: "250px",
				legendSections: [new sap.m.Page({
					title: "Message",
					content: [new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Row,
						alignItems: sap.m.FlexAlignItems.Center,
						items: [new sap.m.CheckBox({
							selected: true
						}), new sap.ui.core.Icon({
							src: "sap-icon://message-error",
							size: "15px",
							color: "red",
							width: "25px"
						}), new sap.m.Label({
							text: "Error"
						})]
					})]
				})
				]
			});
			this.oGanttChart0 = new sap.gantt.DummyGanttChart();
			this.oGanttChart1 = new sap.gantt.DummyGanttChart();
		},
		afterEach: function () {
			this.oLegendContainer.destroy();
			this.oGanttChart0.destroy();
			this.oGanttChart1.destroy();
			this.oGanttChartContainer.destroy();
		}
	});

	QUnit.test("Test GanttChartContainer toolbar", function (assert) {
		this.oCustomToolbarItem0 = new sap.m.Button({
			icon: "sap-icon://share",
			text: "Share"
		});
		this.oCustomToolbarItem1 = new sap.m.Button({
			icon: "sap-icon://print",
			text: "Print"
		});
		this.oGanttChartContainer.insertCustomToolbarItem(this.oCustomToolbarItem0);
		assert.strictEqual(this.oGanttChartContainer._oToolbar.getAllToolbarItems()[0].getText(), "Share", "Insert custom toolbar item");
		assert.strictEqual(this.oGanttChartContainer.getCustomToolbarItems().length, 1, "There is one custom toolbar item");
		this.oGanttChartContainer.addCustomToolbarItem(this.oCustomToolbarItem1);
		assert.strictEqual(this.oGanttChartContainer._oToolbar.getAllToolbarItems()[1].getText(), "Print", "Add custom toolbar item");
		assert.strictEqual(this.oGanttChartContainer.getCustomToolbarItems().length, 2, "There are two custom toolbar items");
		this.oGanttChartContainer.removeCustomToolbarItem(this.oCustomToolbarItem0);
		assert.strictEqual(this.oGanttChartContainer._oToolbar.getAllToolbarItems()[0].getText(), "Print", "Remove custom toolbar item");
		assert.strictEqual(this.oGanttChartContainer.getCustomToolbarItems().length, 1, "There is one custom toolbar item");
		this.oGanttChartContainer.removeAllCustomToolbarItems();
		assert.strictEqual(this.oGanttChartContainer._oToolbar._aCustomItems.length, 0, "remove all custom toolbar item");
		assert.strictEqual(this.oGanttChartContainer.getCustomToolbarItems().length, 0, "There is no custom toolbar item");

		this.oGanttChartContainer.insertGanttChart(this.oGanttChart0, 0);
		this.oGanttChartContainer.addGanttChart(this.oGanttChart1);

		this.oEvent = new sap.ui.base.Event(sap.gantt.config.SETTING_ITEM_ENABLE_NOW_LINE_KEY, this.oGanttChartContainer._oToolbar, [{ id: sap.gantt.config.SETTING_ITEM_ENABLE_NOW_LINE_KEY, value: false }]);
		this.oGanttChartContainer._onToolbarSettingsChange(this.oEvent);
		assert.strictEqual(this.oGanttChartContainer.getEnableNowLine(), false, "Enable now line");
		this.oEvent = new sap.ui.base.Event(sap.gantt.config.SETTING_ITEM_ENABLE_CURSOR_LINE_KEY, this.oGanttChartContainer._oToolbar, [{ id: sap.gantt.config.SETTING_ITEM_ENABLE_CURSOR_LINE_KEY, value: false }]);
		this.oGanttChartContainer._onToolbarSettingsChange(this.oEvent);
		assert.strictEqual(this.oGanttChartContainer.getEnableCursorLine(), false, "Enable cursor line");
		this.oEvent = new sap.ui.base.Event(sap.gantt.config.SETTING_ITEM_ENABLE_VERTICAL_LINE_KEY, this.oGanttChartContainer._oToolbar, [{ id: sap.gantt.config.SETTING_ITEM_ENABLE_VERTICAL_LINE_KEY, value: false }]);
		this.oGanttChartContainer._onToolbarSettingsChange(this.oEvent);
		assert.strictEqual(this.oGanttChartContainer.getEnableVerticalLine(), false, "Enable vertical line");
		this.oEvent = new sap.ui.base.Event(sap.gantt.config.SETTING_ITEM_ENABLE_ADHOC_LINE_KEY, this.oGanttChartContainer._oToolbar, [{ id: sap.gantt.config.SETTING_ITEM_ENABLE_ADHOC_LINE_KEY, value: false }]);
		this.oGanttChartContainer._onToolbarSettingsChange(this.oEvent);
		assert.strictEqual(this.oGanttChartContainer.getEnableAdhocLine(), false, "Enable Adhoc line");
		this.oEvent = new sap.ui.base.Event(sap.gantt.config.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC_KEY, this.oGanttChartContainer._oToolbar, [{ id: sap.gantt.config.SETTING_ITEM_ENABLE_TIME_SCROLL_SYNC_KEY, value: false }]);
		this.oGanttChartContainer._onToolbarSettingsChange(this.oEvent);
		assert.strictEqual(this.oGanttChartContainer.getEnableTimeScrollSync(), false, "Enable time scroll sync");
	});

	QUnit.test("Test GanttChartContainer legend", function (assert) {
		this.oGanttChartContainer.setLegendContainer(this.oLegendContainer);
		assert.deepEqual(this.oGanttChartContainer.getAggregation("legendContainer"), this.oLegendContainer, "Set legend container");
	});

	QUnit.module("Test GanttChartContainer set get and events", {
		beforeEach: function () {
			this.oGanttChart0 = new sap.gantt.DummyGanttChart();
			this.oGanttChart0._oSplitter = new sap.ui.layout.Splitter({
				width: "100%",
				height: "100%",
				orientation: sap.ui.core.Orientation.Horizontal
			});
			this.oGanttChart1 = new sap.gantt.DummyGanttChart();
			this.oGanttChart1._oSplitter = new sap.ui.layout.Splitter({
				width: "100%",
				height: "100%",
				orientation: sap.ui.core.Orientation.Vertical
			});
			this.oGanttChartContainer = new sap.gantt.GanttChartContainer({ ganttCharts: [this.oGanttChart0, this.oGanttChart1] });
		},
		afterEach: function () {
			this.oGanttChartContainer.destroy();
		}
	});

	QUnit.test("Test GanttChartContainer set and get", function (assert) {
		this.oModes = [new sap.gantt.config.Mode({ key: "A", text: "Activity" }),
		new sap.gantt.config.Mode({ key: "D", text: "Document" })];
		this.oGanttChartContainer.setModes(this.oModes);
		assert.deepEqual(this.oGanttChartContainer.getModes(this.oModes), this.oModes, "Set modes");
		this.oGanttChartContainer.setSliderStep(12);
		assert.strictEqual(this.oGanttChartContainer.getSliderStep(), 12, "Set slider step");
		this.aToolbarSchemesConfig = [
			new sap.gantt.config.ToolbarScheme({
				key: "GLOBAL_TOOLBAR",
				sourceSelect: new sap.gantt.config.ToolbarGroup({
					position: "L1",
					overflowPriority: sap.m.OverflowToolbarPriority.High
				}),
				layout: new sap.gantt.config.LayoutGroup({
					position: "L2",
					overflowPriority: sap.m.OverflowToolbarPriority.Low,
					enableRichStyle: false
				}),
				customToolbarItems: new sap.gantt.config.ToolbarGroup({
					position: "L3",
					overflowPriority: sap.m.OverflowToolbarPriority.High
				}),
				expandChart: new sap.gantt.config.ExpandChartGroup({
					position: "L4",
					overflowPriority: sap.m.OverflowToolbarPriority.Low,
					showArrowText: true,
					expandCharts: [
						new sap.gantt.config.ExpandChart({
							isExpand: true,
							icon: "sap-icon://line-charts",//"sap-icon://expand",
							tooltip: "Show Utilization.",
							chartSchemeKeys: ["ulc_main"]
						}),
						new sap.gantt.config.ExpandChart({
							isExpand: false,
							icon: "sap-icon://line-charts",//"sap-icon://collapse",
							tooltip: "Hide Utilization.",
							chartSchemeKeys: ["ulc_main"]
						}),
						new sap.gantt.config.ExpandChart({
							isExpand: true,
							icon: "sap-icon://along-stacked-chart", //"sap-icon://arrow-bottom",
							tooltip: "Show Detail.",
							chartSchemeKeys: ["ac_expand_overlap", "ubc_expand_hr"]
						}),
						new sap.gantt.config.ExpandChart({
							isExpand: false,
							icon: "sap-icon://along-stacked-chart", //"sap-icon://arrow-top",
							tooltip: "Hide Detail.",
							chartSchemeKeys: ["ac_expand_overlap", "ubc_expand_hr"]
						})
					]
				}),
				timeZoom: new sap.gantt.config.TimeZoomGroup({
					position: "R3",
					//showZoomSlider: false,
					overflowPriority: sap.m.OverflowToolbarPriority.NeverOverflow,
					zoomControlType: sap.gantt.config.ZoomControlType.SliderWithButtons
				}),
				legend: new sap.gantt.config.ToolbarGroup({
					position: "R2",
					overflowPriority: sap.m.OverflowToolbarPriority.Low
				}),
				settings: new sap.gantt.config.SettingGroup({
					position: "R1",
					overflowPriority: sap.m.OverflowToolbarPriority.Low,
					items: sap.gantt.config.DEFAULT_TOOLBAR_SETTING_ITEMS.concat(new sap.gantt.config.SettingItem({
						key: "CUST_SETTING1",
						checked: true,
						displayText: "Customized Setting 1",
						tooltip: "Narrow Down"
					}))
				})
			}),
			new sap.gantt.config.ToolbarScheme({
				key: "LOCAL_TOOLBAR",
				sourceSelect: new sap.gantt.config.ToolbarGroup({
					position: "L1",
					overflowPriority: sap.m.OverflowToolbarPriority.High
				}),
				customToolbarItems: new sap.gantt.config.ToolbarGroup({
					position: "L3",
					overflowPriority: sap.m.OverflowToolbarPriority.High
				}),
				expandTree: new sap.gantt.config.ToolbarGroup({
					position: "L2",
					overflowPriority: sap.m.OverflowToolbarPriority.Low
				}),
				mode: new sap.gantt.config.ModeGroup({
					position: "R1",
					overflowPriority: sap.m.OverflowToolbarPriority.Low,
					modeKeys: ["A", "D"]
				})
			})
		];
		this.oGanttChartContainer.setToolbarSchemes(this.aToolbarSchemesConfig);
		assert.deepEqual(this.oGanttChartContainer._oToolbarSchemeConfigMap["LOCAL_TOOLBAR"], this.aToolbarSchemesConfig[1], "Set toolbar schemes");
		this.aHierarchiesConfig = [];
		this.aHierarchiesConfig.push(new sap.gantt.config.Hierarchy({
			key: "TOL",
			text: "Freight Order",
			toolbarSchemeKey: "LOCAL_TOOLBAR",
			activeModeKey: "D"
		}));
		this.aHierarchiesConfig.push(new sap.gantt.config.Hierarchy({
			key: "TRUCK",
			text: "Truck",
			toolbarSchemeKey: "LOCAL_TOOLBAR",
			activeModeKey: "A"
		}));
		this.oGanttChartContainer.setHierarchies(this.aHierarchiesConfig);
		assert.deepEqual(this.oGanttChartContainer._oHierarchyConfigMap["TRUCK"], this.aHierarchiesConfig[1], "Set hierarchies");
		this.aContainerLayouts = [
			new sap.gantt.config.ContainerLayout({
				key: "d1",
				text: "Single: Resources",
				toolbarSchemeKey: "GLOBAL_TOOLBAR",
				ganttChartLayouts: [new sap.gantt.config.GanttChartLayout({
					activeModeKey: "D",
					hierarchyKey: "RESOURCES"
				})]
			}),
			new sap.gantt.config.ContainerLayout({
				key: "d2",
				text: "Dual: Resources & Orders",
				toolbarSchemeKey: "GLOBAL_TOOLBAR",
				ganttChartLayouts: [new sap.gantt.config.GanttChartLayout({
					activeModeKey: "A",
					hierarchyKey: "RESOURCES"
				}), new sap.gantt.config.GanttChartLayout({
					activeModeKey: "D",
					hierarchyKey: "TOL"
				})]
			}),
			new sap.gantt.config.ContainerLayout({
				key: "d3",
				text: "Single: Freight Order",
				toolbarSchemeKey: "GLOBAL_TOOLBAR",
				ganttChartLayouts: [new sap.gantt.config.GanttChartLayout({
					activeModeKey: "D",
					hierarchyKey: "TOL"
				})]
			})
		];
		this.oGanttChartContainer.setContainerLayouts(this.aContainerLayouts);
		assert.deepEqual(this.oGanttChartContainer._oContainerLayoutConfigMap["d2"], this.aContainerLayouts[1], "Set container layouts");
		this.oGanttChartContainer.setContainerLayoutKey("d2");
		assert.strictEqual(this.oGanttChartContainer.getContainerLayoutKey(), "d2", "Set container layout key");

		assert.strictEqual(this.oGanttChartContainer.selectShapes(0), true, "Select shapes");
		assert.strictEqual(this.oGanttChartContainer.selectShapes(3), true, "Select shapes");
		assert.strictEqual(this.oGanttChartContainer.deselectShapes(0), true, "Deselect shapes");
		assert.strictEqual(this.oGanttChartContainer.deselectShapes(3), true, "Deselect shapes");
		assert.strictEqual(this.oGanttChartContainer.selectRows(0), true, "Select rows");
		assert.strictEqual(this.oGanttChartContainer.selectRows(3), true, "Select rows");
		assert.strictEqual(this.oGanttChartContainer.deselectRows(0), true, "Deselect rows");
		assert.strictEqual(this.oGanttChartContainer.deselectRows(3), true, "Deselect rows");
		assert.strictEqual(this.oGanttChartContainer.selectRelationships(0), true, "Select relationships");
		assert.strictEqual(this.oGanttChartContainer.selectRelationships(3), true, "Select relationships");
		assert.strictEqual(this.oGanttChartContainer.deselectRelationships(0), true, "Deselect relationships");
		assert.strictEqual(this.oGanttChartContainer.deselectRelationships(3), true, "Deselect relationships");
		assert.strictEqual(this.oGanttChartContainer.selectRowsAndShapes(0), true, "Select rows and shapes");
		assert.strictEqual(this.oGanttChartContainer.selectRowsAndShapes(3), true, "Select rows and shapes");
		assert.deepEqual(this.oGanttChartContainer.getSelectedShapes(0), [{ "ganttChartIndex": 0, "selectedShapes": ["shape0"] }], "Get selected shapes");
		assert.deepEqual(this.oGanttChartContainer.getSelectedShapes(3), [{ "ganttChartIndex": 0, "selectedShapes": ["shape0"] }, { "ganttChartIndex": 1, "selectedShapes": ["shape0"] }], "Get selected shapes");
		assert.deepEqual(this.oGanttChartContainer.getSelectedRows(0), [{ "ganttChartIndex": 0, "selectedRows": ["row0"] }], "Get selected rows");
		assert.deepEqual(this.oGanttChartContainer.getSelectedRows(3), [{ "ganttChartIndex": 0, "selectedRows": ["row0"] }, { "ganttChartIndex": 1, "selectedRows": ["row0"] }], "Get selected rows");
		assert.deepEqual(this.oGanttChartContainer.getSelectedRelationships(0), [{ "ganttChartIndex": 0, "selectedRelationships": ["r0"] }], "Get selected relationships");
		assert.deepEqual(this.oGanttChartContainer.getSelectedRelationships(3), [{ "ganttChartIndex": 0, "selectedRelationships": ["r0"] }, { "ganttChartIndex": 1, "selectedRelationships": ["r0"] }], "Get selected relationships");
		assert.deepEqual(this.oGanttChartContainer.getAllSelections(0),
			[{ "ganttChartIndex": 0, "allSelection": { rows: ["row0"], shapes: ["shape0"], relationships: ["r0"] } }],
			"Get all selections");
		assert.deepEqual(this.oGanttChartContainer.getAllSelections(3),
			[{ "ganttChartIndex": 0, "allSelection": { rows: ["row0"], shapes: ["shape0"], relationships: ["r0"] } },
			{ "ganttChartIndex": 1, "allSelection": { rows: ["row0"], shapes: ["shape0"], relationships: ["r0"] } }],
			"Get all selections");

		this.oGanttChartContainer.onBeforeRendering();
		assert.ok(true, "on before rendering");
		this.oGanttChartContainer._detachToolbarEvents();
		assert.ok(true, "detach toolbar events");
		this.oEvent = new sap.ui.base.Event("zoomStopChange", this.oGanttChartContainer._oToolbar, { zoomRate: 1 });
		this.oGanttChartContainer._onToolbarZoomStopChange(this.oEvent);
		assert.ok(true, "zoom rate change");
		this.oGanttChartContainer._onToolbarExpandChartChange(this.oEvent);
		assert.ok(true, "expand chart change");
		this.oEvent = new sap.ui.base.Event("sourceChange", this.oGanttChartContainer._oToolbar, { id: "d3" });
		this.oGanttChartContainer._onToolbarSourceChange(this.oEvent);
		assert.strictEqual(this.oGanttChartContainer.getContainerLayoutKey(), "d3", "source change");
		this.oEvent = new sap.ui.base.Event("layoutChange", this.oGanttChartContainer._oToolbar, { id: "orientation", value: sap.ui.core.Orientation.Horizontal });
		this.oGanttChartContainer._onToolbarLayoutChange(this.oEvent);
		assert.strictEqual(this.oGanttChartContainer._oSplitter.getOrientation(), sap.ui.core.Orientation.Horizontal, "Switch orientation");
		this.oEvent = new sap.ui.base.Event("addGanttChart", this.oGanttChartContainer._oToolbar, { id: "add", value: { hierarchyKey: "TOL" } });
		this.oGanttChartContainer._onToolbarLayoutChange(this.oEvent);
		assert.ok(true, "add gantt chart");
		this.oEvent = new sap.ui.base.Event("lessGanttChart", this.oGanttChartContainer._oToolbar, { id: "less", value: { hierarchyKey: "TOL", ganttChartIndex: 0 } });
		this.oGanttChartContainer._onToolbarLayoutChange(this.oEvent);
		assert.ok(true, "less gantt chart");
		this.oEvent = new sap.ui.base.Event("dnd", this.oGanttChartContainer.getGanttCharts()[0], { draggingSource: "shape" });
		this.oGanttChartContainer._onChartDragLeave(this.oEvent);
		assert.strictEqual(this.oGanttChartContainer._oDraggingSource, "shape", "drage leave");
		this.oEvent = new sap.ui.base.Event("dnd", this.oGanttChartContainer.getGanttCharts()[0], { draggingSource: undefined });
		this.oGanttChartContainer._onChartDragLeave(this.oEvent);
		assert.strictEqual(this.oGanttChartContainer._oDraggingSource, undefined, "drage leave");
		this.oOriginEvent = new sap.ui.base.Event("dnd", this.oGanttChartContainer.getGanttCharts()[0], { button: 0, buttons: 1 });
		this.oEvent = new sap.ui.base.Event("dnd", this.oGanttChartContainer.getGanttCharts()[0], { originEvent: this.oOriginEvent });
		this.oGanttChartContainer._onChartDragEnter(this.oEvent);
		assert.strictEqual(this.oGanttChartContainer._oDraggingSource, undefined, "drage enter");
		this.oGanttChartContainer._oDraggingSource = "shape";
		this.oOriginEvent = new sap.ui.base.Event("dnd", this.oGanttChartContainer.getGanttCharts()[0], { button: 0, buttons: 1 });
		this.oOriginEvent.button = 0;
		this.oOriginEvent.buttons = 1;
		this.oEvent = new sap.ui.base.Event("dnd", this.oGanttChartContainer.getGanttCharts()[0], { originEvent: this.oOriginEvent, button: 0, buttons: 1 });
		this.oGanttChartContainer._onChartDragEnter(this.oEvent);
		assert.strictEqual(this.oGanttChartContainer._oDraggingSource, undefined, "drage enter");
		this.oEvent = new sap.ui.base.Event("_zoomControlTypeChange", this.oGanttChartContainer._oToolbar, { zoomControlType: sap.gantt.config.ZoomControlType.Select });
		this.oGanttChartContainer._onToolbarZoomControlTypeChange(this.oEvent);
		assert.ok(true, "zoom control type change");

		this.oGanttChartContainer.removeGanttChart(0);
		assert.strictEqual(this.oGanttChartContainer.getGanttCharts().length, 1, "Remove gantt chart");
		this.oGanttChartContainer.removeAllGanttCharts();
		assert.strictEqual(this.oGanttChartContainer.getGanttCharts().length, 0, "Remove all gantt charts");
		assert.strictEqual(this.oGanttChartContainer.getToolbarSchemeKey(), "GLOBAL_TOOLBAR", "Get toolbar scheme key");
	});

});
