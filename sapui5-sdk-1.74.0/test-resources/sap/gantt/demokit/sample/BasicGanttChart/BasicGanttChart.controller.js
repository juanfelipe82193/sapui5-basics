sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/def/cal/Calendar",
	"sap/gantt/def/cal/CalendarDefs",
	"sap/gantt/def/cal/TimeInterval",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/shape/Group",
	"sap/gantt/shape/Rectangle",
	"sap/gantt/shape/SelectedShape",
	"sap/gantt/shape/ext/Diamond",
	"sap/gantt/shape/ext/Triangle",
	"sap/m/MessageToast",
	"sap/ui/table/plugins/MultiSelectionPlugin",
	"sap/gantt/shape/ext/rls/Relationship",
	"sap/gantt/shape/cal/Calendar"
], function (
	jQuery,
	Controller,
	JSONModel,
	Calendar,
	CalendarDefs,
	TimeInterval,
	TimeHorizon,
	ProportionZoomStrategy,
	Group,
	Rectangle,
	SelectedShape,
	Diamond,
	Triangle,
	MessageToast,
	MultiSelectionPlugin) {
	"use strict";
	var oDarkThemes = {
		"sap_hcb": true,
		"sap_fiori_3_dark": true,
		"sap_fiori_3_hcb" : true,
		"sap_belize_hcb": true
	};

	return Controller.extend("sap.gantt.sample.BasicGanttChart.BasicGanttChart", {
		onInit: function () {

			var oGanttChartContainer = this.getView().byId("GanttChartContainer");
			var oGanttChartWithTable = oGanttChartContainer.getGanttCharts()[0];
			var sPath = jQuery.sap.getModulePath("sap.gantt.sample.BasicGanttChart", "/data.json");
			this._oModel = new JSONModel();
			var that = this;
			jQuery.ajax({
				url: sPath
			}).then(function (data) {
				that._oModel.setData(data);
				// configuration of GanttChartContainer
				oGanttChartContainer.setModel(that._oModel, "test");
				oGanttChartContainer.setLegendContainer(that._createLegendContainer());
				oGanttChartContainer.setToolbarSchemes(that._createToolbarSchemes());
				oGanttChartContainer.setContainerLayouts(that._createContainerLayouts());
				oGanttChartContainer.setContainerLayoutKey("sap.gantt.sample.gantt_layout");
				oGanttChartContainer.addCustomToolbarItem(that._createCustomToolbar());

				// configuration of GanttChartWithTable
				oGanttChartWithTable.bindAggregation("rows",
					{
						path: "test>/root",
						parameters: {
							arrayNames: ["children"]
						}
					}
				);
				oGanttChartWithTable.bindAggregation("relationships",
					{
						path: "test>/root/relationship"
					}
				);
				oGanttChartWithTable.setCalendarDef(new CalendarDefs({
						defs: {
							path: "test>/root/calendar",
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
				);

				oGanttChartWithTable.setAxisTimeStrategy(that._createZoomStrategy());
				oGanttChartWithTable.setShapeDataNames(["top", "order", "milestone", "constraint", "relationship", "nwt", "nwtForWeekends"]);
				oGanttChartWithTable.setShapes(that._configShape());
				var oSelectionPlugin = new MultiSelectionPlugin();
				oGanttChartWithTable.getAggregation("_chart").getAggregation("_treeTable").addPlugin(oSelectionPlugin);
				oGanttChartWithTable.getAggregation("_selectionPanel").addPlugin(oSelectionPlugin);
				oGanttChartWithTable.setSelectionMode(sap.gantt.SelectionMode.Multiple);
			});
		},

		onExit: function () {
			if (this._oSettingsGroup) {
				this._oSettingsGroup.destroy();
			}
		},

		onAfterRendering: function () {
			setTimeout(function () {
				var oGanttChartContainer = this.getView().byId("GanttChartContainer");
				var oGanttChartWithTable = oGanttChartContainer.getGanttCharts()[0];
				oGanttChartWithTable.jumpToPosition(new Date("2015-01-01"));
			}.bind(this), 1000);
		},

		/*
		 * Create CustomToolbar
		 * @private
		 * @returns {Object} oToolbar
		 */
		_createCustomToolbar: function () {
			return new sap.m.Toolbar({
				content: [
					new sap.m.Link({
						text: "Create Task",
						press: this.createTask.bind(this)
					}),
					new sap.m.ToolbarSpacer({width: "10px"}),
					new sap.m.Link({
						text: "Delete Task",
						press: this.deleteTask.bind(this)
					}),
					new sap.m.ToolbarSpacer({width: "10px"}),
					new sap.m.ToolbarSeparator()
				]
			});
		},

		/*
		 * Create ToolbarSchemes
		 * @private
		 * @returns {Array} aToolbarSchemes
		 */
		_createToolbarSchemes: function () {
			this._oSettingsGroup = new sap.gantt.config.SettingGroup({
				id: "settingsGroup",
				position: "R1",
				overflowPriority: sap.m.OverflowToolbarPriority.Low,
				items: sap.gantt.config.DEFAULT_TOOLBAR_SETTING_ITEMS
			});
			return [
				new sap.gantt.config.ToolbarScheme({
					key: "GLOBAL_TOOLBAR",
					customToolbarItems: new sap.gantt.config.ToolbarGroup({
						position: "R2",
						overflowPriority: sap.m.OverflowToolbarPriority.High
					}),
					timeZoom: new sap.gantt.config.ToolbarGroup({
						position: "R4",
						overflowPriority: sap.m.OverflowToolbarPriority.NeverOverflow
					}),
					legend: new sap.gantt.config.ToolbarGroup({
						position: "R3",
						overflowPriority: sap.m.OverflowToolbarPriority.Low
					}),
					settings: this._oSettingsGroup,
					toolbarDesign: sap.m.ToolbarDesign.Transparent
				}),
				new sap.gantt.config.ToolbarScheme({
					key: "LOCAL_TOOLBAR"
				})
			];
		},

		/*
		 * Create ContainerLayouts
		 * @private
		 * @returns {Array} aContainerLayouts
		 */
		_createContainerLayouts: function () {
			return [
				new sap.gantt.config.ContainerLayout({
					key: "sap.gantt.sample.gantt_layout",
					text: "Gantt Layout",
					toolbarSchemeKey: "GLOBAL_TOOLBAR"
				})
			];
		},

		/*
		 * Create Legend
		 * @private
		 * @returns {Object} oLegend
		 */
		_createLegendContainer: function () {
			var sSumTaskColor = "#FAC364";
			var sTasksColor = "#5CBAE5";
			var sRelColor = "#848F94";
			var sTheme = sap.ui.getCore().getConfiguration().getTheme();
			var sTextColor = oDarkThemes[sTheme] === true ? "white" : "";
			var oLegend = new sap.gantt.legend.LegendContainer({
				legendSections: [
					new sap.m.Page({
						title: "Tasks",
						content: [
							new sap.ui.core.HTML({
								content: "<div width='100%' height='50%' style='margin-top: 25px'><svg width='180px' height='60px'><g>" +
									"<g style='display: block;'>" +
									"<g><rect x='" + (sap.ui.getCore().getConfiguration().getRTL() ? "155" : "25") + "' y='2' width='20' height='20' fill=" + sSumTaskColor + " style='stroke: " + sSumTaskColor + "; stroke-width: 2px;'></rect>" +
									"<text x='" + (sap.ui.getCore().getConfiguration().getRTL() ? "125" : "55") + "' y='16' font-size='0.875rem' fill=" + sTextColor + ">Summary task</text></g>" +
									"<g><rect x='" + (sap.ui.getCore().getConfiguration().getRTL() ? "155" : "25") + "' y='32' width='20' height='20' fill=" + sTasksColor + " style='stroke: " + sTasksColor + "; stroke-width: 2px;'></rect>" +
									"<text x='" + (sap.ui.getCore().getConfiguration().getRTL() ? "125" : "55") + "' y='46' font-size='0.875rem' fill=" + sTextColor + ">Task</text></g>" +
									"</g></g></svg></div>"
							})
						]
					}),
					new sap.m.Page({
						title: "Relationships",
						content: [
							new sap.ui.core.HTML({
								content: "<div width='100%' height='50%' style='margin-top: 25px'><svg width='180px' height='25px'><g>" +
									"<g style='display: block;'>" +
									"<g><rect x='" + (sap.ui.getCore().getConfiguration().getRTL() ? "155" : "25") + "' y='8' width='20' height='1' fill=" + sRelColor + " style='stroke: " + sRelColor + "; stroke-width: 1px;'></rect>" +
									"<text x='" + (sap.ui.getCore().getConfiguration().getRTL() ? "125" : "55") + "' y='12.5' font-size='0.875rem' fill=" + sTextColor + ">Relationship</text></g>" +
									"</g></g></svg></div>"
							})
						]
					})
				]
			});

			return oLegend;
		},

		/*
		 * Configuration of Shape.
		 * @private
		 * @returns {Array} aShapes
		 */
		_configShape: function () {
			var aShapes = [];

			//
			Group.extend("sap.gantt.sample.RectangleGroup", {
				getRLSAnchors: function (oRawData, oObjectInfo) {
					var shapes = this.getShapes();
					var rectangleShapeClass;
					var _x, _y;

					for (var i in shapes) {
						if (shapes[i] instanceof sap.gantt.shape.Rectangle) {
							rectangleShapeClass = shapes[i];
						}
					}

					_x = rectangleShapeClass.getX(oRawData);
					_y = rectangleShapeClass.getY(oRawData, oObjectInfo) + rectangleShapeClass.getHeight() / 2;

					return {
						startPoint: {
							x: _x,
							y: _y,
							height: rectangleShapeClass.getHeight(oRawData)
						},
						endPoint: {
							x: _x + rectangleShapeClass.getWidth(oRawData),
							y: _y,
							height: rectangleShapeClass.getHeight(oRawData)
						}
					};
				}
			});

			Rectangle.extend("sap.gantt.sample.shapeRectangle", {
				getFill: function (oRawData) {
					switch (oRawData.level) {
						case "1":
							return "#FAC364";
						default:
							return "#5CBAE5";
					}
				}
			});

			SelectedShape.extend("sap.gantt.sample.selectRectange", {
				getStroke: function (oRowData) {
					switch (oRowData.level) {
						case "1":
							return "#B57506";
						default:
							return "#156589";
					}
				},
				getStrokeWidth: function () {
					return 2;
				}
			});

			Diamond.extend("sap.gantt.sample.Milestone");

			Triangle.extend("sap.gantt.sample.Constraint");

			var oTopShape = new sap.gantt.config.Shape({
				key: "top",
				shapeDataName: "order",
				shapeClassName: "sap.gantt.sample.shapeRectangle",
				selectedClassName: "sap.gantt.sample.selectRectange",
				level: 5,
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					height: 20,
					isDuration: true,
					enableDnD: true
				}
			});

			var oOrderShape = new sap.gantt.config.Shape({
				key: "order",
				shapeDataName: "order",
				shapeClassName: "sap.gantt.sample.RectangleGroup",
				selectedClassName: "sap.gantt.sample.selectRectange",
				level: 5,
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					height: 20,
					isDuration: true,
					enableDnD: true
				},
				groupAggregation: [
					new sap.gantt.config.Shape({
						shapeClassName: "sap.gantt.sample.shapeRectangle",
						selectedClassName: "sap.gantt.sample.selectRectange",
						shapeProperties: {
							time: "{startTime}",
							endTime: "{endTime}",
							title: "{tooltip}",
							height: 20,
							isDuration: true,
							enableDnD: true
						}
					})
				]
			});
			// define a milestone config
			var oDiamondConfig = new sap.gantt.config.Shape({
				key: "diamond",
				shapeClassName: "sap.gantt.sample.Milestone",
				shapeDataName: "milestone",
				level: 5,
				shapeProperties: {
					time: "{endTime}",
					strokeWidth: 2,
					title: "{tooltip}",
					verticalDiagonal: 18,
					horizontalDiagonal: 18,
					yBias: -1,
					fill: "#666666"
				}
			});
			// define a constraint config
			var oTriangleConfig = new sap.gantt.config.Shape({
				key: "triangle",
				shapeClassName: "sap.gantt.sample.Constraint",
				shapeDataName: "constraint",
				level: 5,
				shapeProperties: {
					time: "{time}",
					strokeWidth: 1,
					title: "{tooltip}",
					fill: "#666666",
					rotationAngle: "{ratationAngle}",
					base: 6,
					height: 6,
					distanceOfyAxisHeight: 3,
					yBias: 7
				}
			});

			var oRelShape = new sap.gantt.config.Shape({
				key: "relationship",
				shapeDataName: "relationship",
				level: 30,
				shapeClassName: "sap.gantt.shape.ext.rls.Relationship",
				shapeProperties: {
					isDuration: false,
					lShapeforTypeFS: true,
					showStart: false,
					showEnd: true,
					stroke: "#848F94",
					strokeWidth: 1,
					type: "{relation_type}",
					fromObjectPath: "{fromObjectPath}",
					toObjectPath: "{toObjectPath}",
					fromDataId: "{fromDataId}",
					toDataId: "{toDataId}",
					fromShapeId: "{fromShapeId}",
					toShapeId: "{toShapeId}",
					title: "{tooltip}",
					id: "{guid}"
				}
			});

			var oCalendarConfig = new sap.gantt.config.Shape({
				key: "nwt",
				shapeClassName: "sap.gantt.shape.cal.Calendar",
				shapeDataName: "nwt",
				level: 32,
				shapeProperties: {
					calendarName: "{id}"
				}
			});

			var oCalendarConfigForWeekends = new sap.gantt.config.Shape({
				key: "nwtForWeekends",
				shapeClassName: "sap.gantt.shape.cal.Calendar",
				shapeDataName: "nwtForWeekends",
				level: 32,
				shapeProperties: {
					calendarName: "{id}"
				}
			});

			aShapes = [oTopShape, oOrderShape, oDiamondConfig, oTriangleConfig, oRelShape, oCalendarConfig, oCalendarConfigForWeekends];

			return aShapes;
		},

		/*
		 * Handle Date Change.
		 * @public
		 * @param {Object} event
		 * @returns undefined
		 */
		handleDateChange: function (event) {
			var oDatePicker = event.getSource();
			var aCells = oDatePicker.getParent().getCells();

			if (oDatePicker === oDatePicker.getParent().getCells()[1]) {
				this._checkDate(aCells[1], aCells[2], true);
			} else {
				this._checkDate(aCells[1], aCells[2], false);
			}
		},

		/*
		 * Check Date.
		 * @private
		 * @param {Object} startCell, {Object} endCell, {Boolean} bIsChangeStart
		 * @returns undefined
		 */
		_checkDate: function (startCell, endCell, bIsChangeStart) {
			if (bIsChangeStart === undefined) {
				jQuery.sap.log.error("bIsChangeStart is not defined!");
				return;
			}

			if (startCell.getValue() > endCell.getValue()) {
				this._showNotAllowedMsg();
				if (bIsChangeStart) {
					startCell.setValue(endCell.getValue());
				} else {
					endCell.setValue(startCell.getValue());
				}
			}
		},

		/*
		 * Show "Not Allowed" message.
		 * @private
		 * @returns undefined
		 */
		_showNotAllowedMsg: function () {
			MessageToast.show("Not allowed");
		},

		/*
		 * Handle event of shapeDragEnd
		 * @public
		 * @param {Object} [oEvent] event context
		 * @returns {Boolean} if Drag and Drop succeed
		 */
		handleShapeDragEnd: function (oEvent) {
			var oParam = oEvent.getParameters();
			var aSourceShapeData = oParam.sourceShapeData;
			var oSourceShapeData = aSourceShapeData[0].shapeData;
			var sSourceId = aSourceShapeData[0].objectInfo.id;
			var oTargetData = oParam.targetData;

			//change the form of date from millis to timestamp
			var sTarStartTime = sap.gantt.misc.Format.dateToAbapTimestamp(new Date(oTargetData.mouseTimestamp.startTime));
			var sTarEndTime = sap.gantt.misc.Format.dateToAbapTimestamp(new Date(oTargetData.mouseTimestamp.endTime));

			if (!oTargetData.objectInfo) {
				this._showNotAllowedMsg();
				return false;
			}

			var sTargetId = oTargetData.objectInfo.id;

			if (this._checkDropSameRow(sSourceId, sTargetId) && this._selectOnlyOneRow(aSourceShapeData)) {
				//oSourceShapeData is a reference, so we only need to change startTime and endTime, then reset data model
				oSourceShapeData.startTime = sTarStartTime;
				oSourceShapeData.endTime = sTarEndTime;
				var oModelData = this._oModel.getData();
				this._oModel.setData(oModelData);
				return true;
			} else {
				this._showNotAllowedMsg();
				return false;
			}
		},

		/*
		 * Check if drop the selected task to the same row
		 * @private
		 * @param {String} [sSourceId] source id
		 * @param {String} [sTargetId] target id
		 * @returns {Boolean} if drop the selected task in the same row
		 */
		_checkDropSameRow: function (sSourceId, sTargetId) {
			if (sSourceId === sTargetId) {
				return true;
			} else {
				return false;
			}
		},

		/*
		 * Check if only select one row of chart
		 * @private
		 * @param {Array} [aSourceShapeData] array of source data
		 * @returns {Boolean} if only select one row of chart
		 */
		_selectOnlyOneRow: function (aSourceShapeData) {
			if (aSourceShapeData.length === 1) {
				return true;
			} else {
				return false;
			}
		},

		/*
		 * Create Zoom Strategy
		 * @private
		 * @returns {Object} oZoomStrategy
		 */
		_createZoomStrategy: function () {
			var oTimeLineOptions = {
				"1day": {
					innerInterval: {
						unit: sap.gantt.config.TimeUnit.day,
						span: 1,
						range: 90
					},
					largeInterval: {
						unit: sap.gantt.config.TimeUnit.week,
						span: 1,
						pattern: "LLL yyyy,'Week' ww"
					},
					smallInterval: {
						unit: sap.gantt.config.TimeUnit.day,
						span: 1,
						pattern: "EEE dd"
					}
				},
				"1week": {
					innerInterval: {
						unit: sap.gantt.config.TimeUnit.week,
						span: 1,
						range: 90
					},
					largeInterval: {
						unit: sap.gantt.config.TimeUnit.month,
						span: 1,
						pattern: "LLLL yyyy"
					},
					smallInterval: {
						unit: sap.gantt.config.TimeUnit.week,
						span: 1,
						pattern: "'CW' w"
					}
				},
				"1month": {
					innerInterval: {
						unit: sap.gantt.config.TimeUnit.month,
						span: 1,
						range: 90
					},
					largeInterval: {
						unit: sap.gantt.config.TimeUnit.month,
						span: 3,
						pattern: "yyyy, QQQ"
					},
					smallInterval: {
						unit: sap.gantt.config.TimeUnit.month,
						span: 1,
						pattern: "LLL"
					}
				},
				"1quarter": {
					innerInterval: {
						unit: sap.gantt.config.TimeUnit.month,
						span: 3,
						range: 90
					},
					largeInterval: {
						unit: sap.gantt.config.TimeUnit.year,
						span: 1,
						pattern: "yyyy"
					},
					smallInterval: {
						unit: sap.gantt.config.TimeUnit.month,
						span: 3,
						pattern: "QQQ"
					}
				},
				"1year": {
					innerInterval: {
						unit: sap.gantt.config.TimeUnit.year,
						span: 1,
						range: 90
					},
					largeInterval: {
						unit: sap.gantt.config.TimeUnit.year,
						span: 10,
						pattern: "yyyy"
					},
					smallInterval: {
						unit: sap.gantt.config.TimeUnit.year,
						span: 1,
						pattern: "yyyy"
					}
				}
			};

			return new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: "20131228000000",
					endTime: "20170101000000"
				}),
				visibleHorizon: new TimeHorizon({
					startTime: "20161001000000",
					endTime: "20161201000000"
				}),
				timeLineOptions: oTimeLineOptions,
				timeLineOption: oTimeLineOptions["1week"],
				coarsestTimeLineOption: oTimeLineOptions["1year"],
				finestTimeLineOption: oTimeLineOptions["1day"]
			});
		},

		/*
		 * Create task
		 * @public
		 * @returns undefined
		 */
		createTask: function () {
			var oGanttChartContainer = this.getView().byId("GanttChartContainer");
			var aSelectedRows = oGanttChartContainer.getSelectedRows(0)[0].selectedRows;

			if (this._checkSelectedRow(aSelectedRows)) {
				this._addRows(aSelectedRows);
			}
			var aIds = [];
			for (var i = 0; i < aSelectedRows.length; i++) {
				aIds.push(aSelectedRows[i].id);
			}
			setTimeout(function () {
				oGanttChartContainer.deselectRows(0);
				oGanttChartContainer.selectRows(0, aIds);//reselect rows
			}, 300);
		},

		/*
		 * Check if one or more rows selected
		 * @public
		 * @param {Array} [aSelectedRows] array contain selected rows
		 * @returns {Boolean} if one or more tasks selected
		 */
		_checkSelectedRow: function (aSelectedRows) {
			if (aSelectedRows.length >= 1) {
				return true;
			} else {
				MessageToast.show("Plase select one or more rows");
				return false;
			}
		},

		/*
		 * Add one or more rows
		 * @public
		 * @param {Array} [aSelectedRows] array contain selected rows
		 * @returns undefined
		 */
		_addRows: function (aSelectedRows) {
			var oModelData = this._oModel.getData(); //data in model
			var aTreeData = oModelData.root.children; //data of root level

			for (var i = 0, len = aSelectedRows.length; i < len; i++) {
				var sId = aSelectedRows[i].id;
				this._addRow(aTreeData, sId);
			}

			this._oModel.setData(oModelData); //update data of model
		},

		/*
		 * Add one row
		 * @public
		 * @param {Array} [aTreeNodes] array contain selected rows
		 * @param {String} [sId] id of selected row
		 * @returns undefined
		 */
		_addRow: function (aTreeNodes, sId) {
			if (!aTreeNodes || !aTreeNodes.length) {
				return;
			}

			for (var i = 0, len = aTreeNodes.length; i < len; i++) {
				var oNode = aTreeNodes[i];
				var aChildNodes = oNode.children;

				//find object of corresponding sId and add a new object
				if (oNode.id === sId) {
					var oNewNode = jQuery.extend(true, {}, oNode);//deep copy oNode
					oNewNode.id = oNode.id + " - Copy" + Math.floor((Math.random() * 1000) + 1);
					oNewNode.name = oNode.name + " - Copy";
					oNewNode.order[0].id = oNewNode.order[0].id + " - Copy" + Math.floor((Math.random() * 1000) + 1);
					aTreeNodes.splice(i + 1, 0, oNewNode);
					return;
				}

				if (aChildNodes && aChildNodes.length > 0) {
					this._addRow(aChildNodes, sId);
				}
			}
		},

		/*
		 * Delete task
		 * @public
		 * @returns undefined
		 */
		deleteTask: function () {
			var oGanttChartContainer = this.getView().byId("GanttChartContainer");
			var aSelectedRows = oGanttChartContainer.getSelectedRows(1)[0].selectedRows;

			if (this._checkSelectedRow(aSelectedRows)) {
				this._deleteRows(aSelectedRows);
				this._clearSelection();
			}
		},

		/*
		 * Clear Selection
		 * @private
		 *@returns undefined
		 */
		_clearSelection: function () {
			var oGanttChartContainer = this.getView().byId("GanttChartContainer");

			oGanttChartContainer.deselectRows(oGanttChartContainer.getSelectedRows(0));
		},

		/*
		 * Delete one or more rows
		 * @public
		 * @param {Array} [aSelectedRows] array contain selected rows
		 * @returns undefined
		 */
		_deleteRows: function (aSelectedRows) {
			var oModelData = this._oModel.getData(); //data in model
			var aTreeData = oModelData.root.children; //data of root level

			for (var i = 0, len = aSelectedRows.length; i < len; i++) {
				var sId = aSelectedRows[i].id;
				this._deleteRow(aTreeData, sId);
			}

			this._oModel.setData(oModelData); //update data of model
		},

		/*
		 * Delete one row
		 * @public
		 * @param {Array} [aTreeNodes] array contain selected rows
		 * @param {String} [sId] id of selected row
		 * @returns undefined
		 */
		_deleteRow: function (aTreeNodes, sId) {
			if (!aTreeNodes || !aTreeNodes.length) {
				return;
			}

			for (var i = 0, len = aTreeNodes.length; i < len; i++) {
				var oNode = aTreeNodes[i];
				var aChildNodes = oNode.children;

				//find object of corresponding sId and delete it
				if (oNode.id === sId) {
					aTreeNodes.splice(i, 1);
					return;
				}

				if (aChildNodes && aChildNodes.length > 0) {
					this._deleteRow(aChildNodes, sId);
				}
			}
		}
	});
});
