sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Column",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/simple/BaseImage",
	"sap/gantt/simple/BaseCalendar",
	"sap/gantt/simple/Relationship",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/GanttRowSettings",

	"sap/gantt/def/cal/Calendar",
	"sap/gantt/def/cal/TimeInterval",
	"sap/gantt/def/cal/CalendarDefs",

	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt2/simple/PerfSetting",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, TreeTable, Column,
	GanttChartContainer, GanttChartWithTable, ContainerToolbar, BaseImage, BaseCalendar, Relationship, BaseRectangle, BaseText, GanttRowSettings,
	Calendar, TimeInterval, CalendarDefs, ProportionZoomStrategy, PerfSetting, Controller) {
		"use strict";

		GanttRowSettings = GanttRowSettings.extend("sap.gantt.simple.test.GanttRowSettings", {
			metadata: {
				aggregations: {
					tasks: { type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "task" },
					texts: { type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "text" },
					warnings: { type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "warning" },
					calendars: { type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "calander" },
					relationships: { type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "relationship" }
				}
			}
		});

		return Controller.extend("sap.gantt2.perf.controller.App", {
			onInit: function () {
				this.oGanttContainer = null;
				this.scenarioId = null;
				this.ALL_SCENARIOS = {
					"scenario1": {
						numberOfRow: 30,
						numberOfShape: 10,
						levelOfHierarchy: 3,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: false,
						showWarning: false,
						showText: false,
						showRelationship: true
					},
					"scenario2": {
						numberOfRow: 10,
						numberOfShape: 10,
						levelOfHierarchy: 4,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: false,
						showWarning: false,
						showText: false,
						showRelationship: true
					},
					"scenario3": {
						numberOfRow: 100,
						numberOfShape: 500,
						levelOfHierarchy: 1,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: true,
						showWarning: false,
						showText: true,
						showRelationship: false
					},
					"scenario4": {
						numberOfRow: 500,
						numberOfShape: 100,
						levelOfHierarchy: 1,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: true,
						showWarning: true,
						showText: true,
						showRelationship: false
					},
					"scenario5": {
						numberOfRow: 250,
						numberOfShape: 100,
						levelOfHierarchy: 1,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: true,
						showWarning: true,
						showText: true,
						showRelationship: true
					},
					"scenario6": {
						numberOfRow: 30000,
						numberOfShape: 10,
						levelOfHierarchy: 1,
						numberOfView: 1,
						includeToolbar: false,
						showCalendar: false,
						showWarning: false,
						showText: false,
						showRelationship: true
					}
				};
			},

			onScenarioChanged: function (oEvent) {
				var oItem = oEvent.getParameter("item");
				var oParent = oItem.getParent();
				var clearIcon = function (oParent) {
					oParent.getItems().forEach(function (oItem) { oItem.setIcon(""); });
				};
				clearIcon(oParent);
				oItem.setIcon("sap-icon://accept");
				this.scenatioId = oItem.getText();
				this.setInfoLabels(true);
			},

			setInfoLabels: function (bScenarioChanged) {
				var oHierarchiesInfoLabel = this.getView().byId("levelOfHierarchy");
				var oRowsInfoLabel = this.getView().byId("numberOfRow");
				var oShapesInfoLabel = this.getView().byId("numberOfShape");
				var oRelationshipsInfoLabel = this.getView().byId("numberOfRelationship");
				var oWarningsInfoLabel = this.getView().byId("showWarnings");
				var oCalendarsInfoLabel = this.getView().byId("showCalendars");
				var oTextsInfoLabel = this.getView().byId("showTexts");

				var oCustomizedHierachiesInput = this.getView().byId("customizedHierachies");
				var oCustomizedRowsInput = this.getView().byId("customizedRows");
				var oCustomizedShapesPerRowInput = this.getView().byId("customizedShapesPerRow");

				oHierarchiesInfoLabel.setText("hierarchies: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].levelOfHierarchy : parseInt(this.getView().byId("customizedHierachies").getValue(), 10)) + ",");
				oRowsInfoLabel.setText("rows: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].numberOfRow : parseInt(this.getView().byId("customizedRows").getValue(), 10)) + ",");
				oShapesInfoLabel.setText("shapes per row: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].numberOfShape : parseInt(this.getView().byId("customizedShapesPerRow").getValue(), 10)) + ",");
				oRelationshipsInfoLabel.setText("relationships: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].showRelationship : this.getView().byId("relationships").getSelected()) + ",");
				oWarningsInfoLabel.setText("warnings: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].showWarning : this.getView().byId("warnings").getSelected()) + ",");
				oCalendarsInfoLabel.setText("calendars: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].showCalendar : this.getView().byId("calendars").getSelected()) + ",");
				oTextsInfoLabel.setText("texts: " + (bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].showText : this.getView().byId("texts").getSelected()));

				oCustomizedHierachiesInput.setValue(bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].levelOfHierarchy : parseInt(this.getView().byId("customizedHierachies").getValue(), 10));
				oCustomizedRowsInput.setValue(bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].numberOfRow : parseInt(this.getView().byId("customizedRows").getValue(), 10));
				oCustomizedShapesPerRowInput.setValue(bScenarioChanged ? this.ALL_SCENARIOS[this.scenatioId].numberOfShape : parseInt(this.getView().byId("customizedShapesPerRow").getValue(), 10));

				if (bScenarioChanged) {
					this.getView().byId("relationships").setSelected(this.ALL_SCENARIOS[this.scenatioId].showRelationship);
					this.getView().byId("calendars").setSelected(this.ALL_SCENARIOS[this.scenatioId].showCalendar);
					this.getView().byId("warnings").setSelected(this.ALL_SCENARIOS[this.scenatioId].showWarning);
					this.getView().byId("texts").setSelected(this.ALL_SCENARIOS[this.scenatioId].showText);
				}

			},

			createModel: function () {
				var mSettings = Object.assign({}, this.ALL_SCENARIOS[this.scenatioId]);
				mSettings.showRelationship = this.getView().byId("relationships").getSelected();
				mSettings.showCalendar = this.getView().byId("calendars").getSelected();
				mSettings.showWarning = this.getView().byId("warnings").getSelected();
				mSettings.showText = this.getView().byId("texts").getSelected();
				mSettings.levelOfHierarchy = parseInt(this.getView().byId("customizedHierachies").getValue(), 10) || mSettings.levelOfHierarchy;
				mSettings.numberOfRow = parseInt(this.getView().byId("customizedRows").getValue(), 10) || mSettings.numberOfRow;
				mSettings.numberOfShape = parseInt(this.getView().byId("customizedShapesPerRow").getValue(), 10) || mSettings.numberOfShape;
				this.setInfoLabels();
				this.oPerfSetting = new PerfSetting(Object.assign({}, mSettings));
				var oData = this.oPerfSetting.generate();
				this.oModel = new JSONModel();
				this.oModel.setSizeLimit(1000000);
				this.oModel.setData(oData);
			},

			onAction: function (oEvent) {
				var status = oEvent.getSource().getText();
				if (status === "Create gantt") {
					this.insertGantt();
					this.bindJSON();
					oEvent.getSource().setText("Destroy");
				} else {
					this.removeGantt();
					oEvent.getSource().setText("Create gantt");
				}
			},

			bindJSON: function () {
				this.oGanttContainer.setModel(this.oModel, "data");
			},

			insertGantt: function () {
				this.createGanttChartContainer();
				var oPage = this.getView().byId("page");
				oPage.addContent(this.oGanttContainer);
			},

			removeGantt: function () {
				var oPage = this.getView().byId("page");
				oPage.removeContent(this.oGanttContainer);
			},

			createGanttChartContainer: function () {
				var bRls = this.oPerfSetting.getShowRelationship();
				var bWarning = this.oPerfSetting.getShowWarning();
				var bCalendar = this.oPerfSetting.getShowCalendar();
				var bText = this.oPerfSetting.getShowText();
				var mRowSettings = {
					rowId: "{data>ObjectID}",
					tasks: {
						path: "data>Tasks",
						template: new BaseRectangle({
							selectable: true,
							fill: "#0092D1",
							time: "{data>StartDate}",
							shapeId: "{data>TaskID}",
							endTime: "{data>EndDate}"
						}),
						templateShareable: true
					}
				};
				if (bRls) {
					mRowSettings.relationships = {
						path: "data>Relationships",
						template: new Relationship({
							selectable: true,
							type: "{data>RelationType}",
							shapeId: "{data>RelationID}",
							predecessor: "{data>PredecTaskID}",
							successor: "{data>SuccTaskID}"
						}),
						templateShareable: true
					};
				}
				if (bWarning) {
					mRowSettings.warnings = {
						path: "data>Warnings",
						template: new BaseImage({
							src: "{data>src}",
							time: "{data>time}"
						}),
						templateShareable: true
					};
				}
				if (bCalendar) {
					mRowSettings.calendars = {
						path: "data>/Calendars",
						template: new BaseCalendar({
							calendarName: "workingDays"
						}),
						templateShareable: true
					};
				}
				if (bText) {
					mRowSettings.texts = {
						path: "data>Texts",
						template: new BaseText({
							text: "{data>Content}",
							time: "{data>StartDate}",
							endTime: "{data>EndDate}"
						}),
						templateShareable: true
					};
				}
				var mRows = {
					path: "data>/root",
					parameters: {
						arrayNames: ["children"]
					}
				};

				var oTableGantt = new GanttChartWithTable({
					table: new TreeTable({
						visibleRowCountMode: "Auto",
						rowSettingsTemplate: new GanttRowSettings(mRowSettings),
						extension: new sap.m.OverflowToolbar({
							content: [
								new sap.m.Button({
									icon: "sap-icon://expand",
									press: function (oEvent) {
										var oTable = oTableGantt.getTable();
										var aSelectedRows = oTable.getSelectedIndices();
										oTable.expand(aSelectedRows);
									}
								}),
								new sap.m.Button({
									icon: "sap-icon://collapse",
									press: function (oEvent) {
										var oTable = oTableGantt.getTable();
										var aSelectedRows = oTable.getSelectedIndices();
										oTable.collapse(aSelectedRows);
									}
								})
							]
						}),
						columns: [
							new Column({
								width: "200px",
								sortProperty: "ObjectID",
								filterProperty: "ObjectID",
								label: new sap.m.Label({ text: "ObjectID" }),
								template: new sap.m.Text({ text: "{data>ObjectID}", wrapping: false })
							})
						],
						rows: mRows
					}),
					axisTimeStrategy: new ProportionZoomStrategy({
						totalHorizon: this.oPerfSetting.getTimeHorizon(),
						visibleHorizon: this.oPerfSetting.getTimeHorizon()
					})
				});
				if (bCalendar) {
					oTableGantt.setCalendarDef(new CalendarDefs({
						defs: {
							path: "data>/Calendars",
							template: new Calendar({
								key: "workingDays",
								timeIntervals: {
									path: "data>CalendarInterval",
									template: new TimeInterval({
										startTime: "{data>StartDate}",
										endTime: "{data>EndDate}"
									}),
									templateShareable: true
								}
							})
						}
					}));
				}
				this.oGanttContainer = new GanttChartContainer({
					ganttCharts: [oTableGantt],
					toolbar: new ContainerToolbar()
				});
			}

		});

	});
