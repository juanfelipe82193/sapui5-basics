sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/gantt/AdhocLine",
	"sap/gantt/misc/Format",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/ListLegend",
	"sap/gantt/simple/ListLegendItem",
	"sap/gantt/simple/DimensionLegend",
	"sap/gantt/simple/LegendColumnConfig",
	"sap/gantt/simple/LegendRowConfig"
], function(Controller, JSONModel, MockServer, ODataModel, AdhocLine, Format, BaseRectangle, ListLegend, ListLegendItem, DimensionLegend, LegendColumnConfig, LegendRowConfig) {
	"use strict";

	return Controller.extend("sap.gantt.simple.test.Controller", {

		onInit : function() {
			var sServiceUrl = "http://my.test.service.com/";
			var oMockServer = new MockServer({
				rootUri : sServiceUrl
			});

			oMockServer.simulate("odata/metadata.xml", {
				sMockdataBaseUrl : "odata/",
				bGenerateMissingMockData : false
			});

			oMockServer.start();
			var oDataModel = new ODataModel(sServiceUrl, {
				useBatch: true,
				refreshAfterChange: false
			});

			oDataModel.setDefaultBindingMode("TwoWay");
			this.getView().setModel(oDataModel, "data");

			var oLegendModel = new JSONModel();
			oLegendModel.loadData("json/Legend.json");
			this.getView().setModel(oLegendModel, "legend");

			this.oGanttChartRef = null;
		},

		onGanttSettingsChanged: function(oEvent) {
			var oContainer = this.getView().byId("container");
			var oSelectedItem = oEvent.getParameter("item"),
				sPropertyName = oSelectedItem.getParent().getKey(),
				sPropertyValue = oSelectedItem.getText();

			oContainer.getGanttCharts().forEach(function(oGanttWithTable) {
				if (sPropertyName === "rowSelectionBehavior") {
					oGanttWithTable.getTable().setSelectionBehavior(sPropertyValue);
				} else if (sPropertyName === "shapeSelectionMode") {
					oGanttWithTable.setShapeSelectionMode(sPropertyValue);
				} else {
					oGanttWithTable.setProperty(sPropertyName, sPropertyValue);
				}
			});
		},

		toggleExpandChartOnRow: function(oEvent) {
			var oItem = oEvent.getParameter("item"),
				oRow = oEvent.getParameter("row"),
				oGantt = this.getView().byId("gantt1");

			var bExpand = oItem.data("expand") === "true";
			if (bExpand) {
				oGantt.expand("task_to_step", oRow.getIndex());
			} else {
				oGantt.collapse("task_to_step", oRow.getIndex());
			}
		},

		handleExpandShape: function(oEvent) {
			var oSourceButton = oEvent.getSource();
			if (oSourceButton.getId().endsWith("ulcExpandBtn")) {
				var oGantt2 = this.getView().byId("gantt2");
				oGantt2.expand("project_to_ulc", oGantt2.getTable().getSelectedIndex());
			} else {
				var oGantt1 = this.getView().byId("gantt1");
				oGantt1.expand("task_to_step", oGantt1.getTable().getSelectedIndex());
			}
		},

		handleCollapseShape: function(oEvent) {
			var oSourceButton = oEvent.getSource();

			if (oSourceButton.getId().endsWith("ulcCollapseBtn")) {
				var oGantt2 = this.getView().byId("gantt2");
				oGantt2.collapse("project_to_ulc", oGantt2.getTable().getSelectedIndex());
			} else {
				var oGantt1 = this.getView().byId("gantt1");
				oGantt1.collapse("task_to_step", oGantt1.getTable().getSelectedIndex());
			}
		},

		handleAdhocLineTimeChange: function(oEvent) {
			var oGantt = this.getView().byId("gantt2");
			oGantt.addAdhocLine(new AdhocLine({
				stroke: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
				strokeWidth: 2,
				strokeDasharray: "5, 1",
				timeStamp: oEvent.getParameter("value"),
				description: "Adhoc line description"
			}));
		},

		handleTableReorderDrop: function(oEvent) {
			var oDraggedRow = oEvent.getParameter("draggedControl"),
				iDraggedRowIndex = oDraggedRow.getIndex();

			var oTable = oEvent.getSource().getParent(),
				oBinding = oTable.getBinding();

			var oRemovedContext = oBinding.removeContext(oTable.getContextByIndex(iDraggedRowIndex));

			var oNewContext = oTable.getContextByIndex(0);
			oBinding.addContexts(oNewContext, oRemovedContext);
		},

		onShapeMouseEnter: function(oEvent) {
			this.handleMouseEnterLeave(oEvent, true);
		},
		onShapeMouseLeave: function(oEvent) {
			this.handleMouseEnterLeave(oEvent, false);
		},

		handleMouseEnterLeave: function(oEvent, bEnter) {
			var oPlaceHolder = new sap.m.Label();
			var oPopup = new sap.ui.core.Popup(oPlaceHolder, false, true, false);

			if (!this.oPopover) {
				this.oPopover = sap.ui.xmlfragment("sap.gantt.simple.test.view.QuickViewPopover", this);
				var oQuickViewModel = new JSONModel();
				this.oPopover.setModel(oQuickViewModel);
				this.getView().addDependent(this.oPopover);
			}
			if (bEnter) {
				var oShape = oEvent.getParameter("shape"),
					mData = {
						id: oShape.getId(),
						startTime: oShape.getTime(),
						endTime: oShape.getEndTime()
					};
				this.oPopover.getModel().setData(mData);

				var eDock = sap.ui.core.Popup.Dock;
				var iPageX = oEvent.getParameter("pageX"),
					iPageY = oEvent.getParameter("pageY");
				var sOffset = (parseInt(iPageX, 10) + 1) + " " + (parseInt(iPageY, 10) + 1);
				oPopup.open(0, eDock.BeginTop, eDock.LeftTop, null , sOffset);
				this.oPopover.openBy(oPlaceHolder);
			} else if (oPopup !== undefined){
				this.oPopover.close();
				oPopup.close(0);
			}
		},

		onShapeContextMenu: function(oEvent) {
			var oController = this; // eslint-disable-line consistent-this
			var oShape = oEvent.getParameter("shape"),
				oRow   = oEvent.getParameter("rowSettings"),
				iPageX = oEvent.getParameter("pageX"),
				iPageY = oEvent.getParameter("pageY");
			var eDock = sap.ui.core.Popup.Dock;
			var sOffset = (iPageX + 1) + " " + (iPageY + 1);

			var oMenu;
			if (oShape) {
				oMenu = new sap.ui.unified.Menu({
					items:[
						new sap.ui.unified.MenuItem({
							text: "Delete",
							icon: "sap-icon://delete"
						}),
						new sap.ui.unified.MenuItem({
							text: "View",
							icon: "sap-icon://checklist"
						})
					],
					itemSelect: function(oEvent2) {
						var oItem = oEvent2.getParameter("item");
						if (oItem.getText() === "Delete") {
							var oRowBindingContext = oRow.getBindingContext("data");
							if (oShape.getScheme() === "task_to_step") {
								oController.removeStepFromModel(oShape.getShapeId());
							} else {
								oController.removeTaskFromModel(oRowBindingContext, oRow.getRowId(), oShape.getShapeId());
							}
						}
					}
				});
				oMenu.open(true, jQuery.sap.byId(oShape.getId()), eDock.BeginTop, eDock.LeftTop, null, sOffset);
			} else if (oEvent.getParameter("row")){
				oMenu = new sap.ui.unified.Menu({
					items:[
						new sap.ui.unified.MenuItem({
							text: "Show Document",
							icon: "sap-icon://detail-view"
						})
					],
					itemSelect: function(oEvent2) {
						sap.m.MessageToast.show("Context Menu on Row: " + oRow.getId());
					}
				});
				oMenu.open(true, jQuery.sap.byId(oRow.getId()), eDock.BeginTop, eDock.LeftTop, null, sOffset);
			} else {
				sap.m.MessageToast.show("Context Menu on Empty Row");
			}
		},

		removeTaskFromModel: function(oRowContext, sRowId, sTaskId) {
			var oController = this; // eslint-disable-line consistent-this
			var oDataModel = this.getView().getModel("data");
			var mParameters = {
				context: oRowContext,
				success: function(oData) {
					sap.m.MessageToast.show("Task is deleted");
					oController.reloadRowContext(sRowId);
				}
			};
			oDataModel.remove("/Tasks('" + sTaskId + "')", mParameters);
		},

		removeStepFromModel: function(sStepId) {
			var oDataModel = this.getView().getModel("data");
			var mParameters = {
				success: function(oData) {
					sap.m.MessageToast.show("Step is deleted");
				}
			};
			oDataModel.remove("/Steps('" + sStepId + "')", mParameters);
		},

		reloadRowContext: function(sRowId) {
			var oDataModel = this.getView().getModel("data");
			// sound like a workaround to prevent UI flicker
			oDataModel.read("/ProjectElems('" + sRowId + "')", {
				urlParameters: {
					"$expand": "ProjectTasks"
				}
			});
		},

		handleShapeDrop: function(oEvent) {
			var oShape = oEvent.getParameter("shape"),
				oRow =  oEvent.getParameter("droppedRow");

			var iDroppedTimeInMs = oEvent.getParameter("cursorDateTime").getTime();
			var oDataModel = oShape.getModel("data");
			if (oShape) {
				// shape could be null
				sap.m.MessageToast.show("Drag shape: " + oShape.getShapeId() + " Then dropped on Row: " + oRow.getIndex());
				var oStartDate = oShape.getTime();
				var oEndDate = oShape.getEndTime();


				var oGantt = oEvent.getSource();
				if (oGantt.getGhostAlignment() === "End") {
					var iOldEndTimeInMs = oEndDate.getTime();
					oShape.setEndTime(new Date(iDroppedTimeInMs));
					oShape.setTime(new Date(iDroppedTimeInMs - (iOldEndTimeInMs - oStartDate.getTime())));
				} else if (oGantt.getGhostAlignment() === "Start") {
					var iDelta = iDroppedTimeInMs - oStartDate.getTime();
					oShape.setTime(new Date(oStartDate.getTime() + iDelta));
					oShape.setEndTime(new Date(oEndDate.getTime() + iDelta));
				} else if (oGantt.getGhostAlignment() === "None") {
					var oNewStartDate = oEvent.getParameter("newDateTime");
					var iWidthInMs = oEndDate.getTime() - oStartDate.getTime();
					oShape.setTime(oNewStartDate);
					oShape.setEndTime(new Date(oNewStartDate.getTime() + iWidthInMs));
				}
			} else {
				var aAllShapeUid = oEvent.getParameter("sourceShapesUid"),
					sLastShapeUid = aAllShapeUid[aAllShapeUid.length - 1];
				var shapeId = sap.gantt.misc.Utility.getIdByUid(sLastShapeUid, false);
				oDataModel.update("/Tasks('" + shapeId + "')", {
					"StartDate": new Date(iDroppedTimeInMs),
					"EndDate": new Date(iDroppedTimeInMs + 2 * 24 * 3600 * 1000),
					"Explanation": "Drag & Dropped"
				});
				oDataModel.submitChanges();
			}
		},
		handleShapeDoubleClick: function(oEvent) {
			var oShape = oEvent.getParameter("shape"),
				oRow =  oEvent.getParameter("row");
			if (oShape) {
				sap.m.MessageToast.show("double click on shape: " + oShape.getShapeId());
			} else if (oRow) {
				sap.m.MessageToast.show("double click on Row: " + oRow.getIndex());
			}
		},

		onShapeResize: function(oEvent) {
			var aNewTime = oEvent.getParameter("newTime"),
				oShape = oEvent.getParameter("shape");
			oShape.setEndTime(aNewTime[1]);
			var aSteps = oShape.getSteps();
			if (aSteps.length > 0) {
				aSteps[aSteps.length - 1].setEndTime(aNewTime[1]);
			}
		},

		toggleTableVisibility: function(oEvent) {
			this.getView().byId("container").getGanttCharts().forEach(function(oGantt) {
				oGantt.setSelectionPanelSize(oGantt.getSelectionPanelSize() === "0px" ? "30%" : "0px");
			});
		},

		toggleGanttVisibility: function(oEvent) {
			var oContainer = this.getView().byId("container");
			var bPressed = oEvent.getParameter("pressed");
			var iContainerWidth = jQuery(oContainer.getDomRef()).width();
			var sSize = bPressed ? (iContainerWidth - 16) + "px" : "30%";
			oContainer.getGanttCharts().forEach(function(oGantt) {
				oGantt.setSelectionPanelSize(sSize);
			});
		},

		toggleResizeOrientation: function(oEvent) {
			var Orientation = sap.ui.core.Orientation;
			var oContainer = this.getView().byId("container");
			var sNewOrientation = oContainer.getLayoutOrientation() === Orientation.Horizontal ? Orientation.Vertical : Orientation.Horizontal;
			var sIcon = "sap-icon://resize-" + sNewOrientation.toLowerCase();
			oEvent.getSource().setIcon(sIcon);

			oContainer.setLayoutOrientation(sNewOrientation);
		},

		toggleDensity: function(oEvent) {
			// close all expand chart before toogle density, only for testing purpose
			jQuery("a.sapGanttExpandClose").trigger("click");
			jQuery("#content")
				.removeClass(oEvent.getSource().getItems().map(function(oItem){ return oItem.getKey(); }).join(" "))
				.addClass(oEvent.getParameter("item").getKey());
			this.getView().byId("container").invalidate();
		},

		toggleSetting: function(oEvent) {
			var oButton = oEvent.getSource();
			var oToolbar = oButton.getParent();

			var bEnableSetting = oToolbar.getEnableSetting();
			oToolbar.setEnableSetting(!bEnableSetting);
			oButton.setText(bEnableSetting ? "Show Setting" : "Hide Setting");
		},

		switchRowSettings: function(oEvent) {
			var oTable = oEvent.getSource().getParent().getParent();
			var oRowSettings = sap.ui.xmlfragment("sap.gantt.simple.test.view." + oEvent.getParameter("item").getKey(), this);
			oTable.setRowSettingsTemplate(oRowSettings);
		},

		onGanttsChange: function(oEvent) {
			var sAddButtonText = "Add Gantt",
				sRemoveButtonText = "Remove Gantt";
			var oContainer = this.getView().byId("container");
			var bShallAdd = oEvent.getSource().getText() === sAddButtonText;

			if (bShallAdd && this.oGanttChartRef) {
				oContainer.insertGanttChart(this.oGanttChartRef, 1);
				this.oGanttChartRef = null;
				oEvent.getSource().setText(sRemoveButtonText);
			} else {
				this.oGanttChartRef = oContainer.removeGanttChart(1);
				oEvent.getSource().setText(sAddButtonText);
			}
		},

		onTableRowSelectionChange: function(oEvent) {
			var bHasSelection = oEvent.getSource().getSelectedIndices().length > 0;
			var oView = this.getView();
			oView.byId("expandBtn").setEnabled(bHasSelection);
			oView.byId("collapseBtn").setEnabled(bHasSelection);
			oView.byId("addTaskBtn").setEnabled(bHasSelection);
		},

		onTableRowSelectionChange2: function(oEvent) {
			var bHasSelection = oEvent.getSource().getSelectedIndices().length > 0;
			var oView = this.getView();
			oView.byId("ulcExpandBtn").setEnabled(bHasSelection);
			oView.byId("ulcCollapseBtn").setEnabled(bHasSelection);
		},

		onPressAddTask: function(oEvent) {
			var oGantt = this.getView().byId("gantt1"),
				oHorizon =  oGantt.getAxisTimeStrategy().getVisibleHorizon();
			if (!this.oAddTaskPopover) {
				this.oAddTaskPopover = sap.ui.xmlfragment("sap.gantt.simple.test.view.AddTask", this);
				var oModel = new JSONModel();
				this.oAddTaskPopover.setModel(oModel, "time");
				// this.oAddTaskPopover.bindElement("/ProductCollection/0");
				this.getView().addDependent(this._oPopover);
			}

			this.oAddTaskPopover.getModel("time").setData({
				StartDate: null,
				EndDate: null,
				TaskDesc: "Task Description Placeholder",
				VisibleStartDate: Format.abapTimestampToDate(oHorizon.getStartTime()),
				VisibleEndDate: Format.abapTimestampToDate(oHorizon.getEndTime())
			});

			this.oAddTaskPopover.openBy(oEvent.getSource());
		},

		addTask: function(oEvent) {
			var oController = this; // eslint-disable-line consistent-this
			var oDataModel = this.getView().getModel("data");
			var oTaskData = this.oAddTaskPopover.getModel("time").getData();
			var oGantt = this.getView().byId("gantt1"),
				oTable = oGantt.getTable(),
				sSelectedRowId = oTable.getRows()[oTable.getSelectedIndex()].getAggregation("_settings").getRowId();

			var mParameters = {
				context: oTable.getContextByIndex(oTable.getSelectedIndex()),
				success: function(oData) {
					sap.m.MessageToast.show("Task is created");
					oController.reloadRowContext(sSelectedRowId);
				},
				error: function(oError) {
					sap.m.MessageToast.show("Fail to create task");
				},
				refreshAfterChange: false
			};

			oDataModel.create("ProjectTasks", {
				TaskID: jQuery.sap.uid(),
				ProjectElemID: sSelectedRowId,
				StartDate: oTaskData.StartDate,
				EndDate: oTaskData.EndDate,
				TaskDesc: oTaskData.TaskDesc
			}, mParameters);

			oDataModel.submitChanges();
		},

		markShapeAsSelected: function(oEvent) {
			var oRow = oEvent.getParameter("row").getAggregation("_settings");
			var oEalierStart = null;
			oRow.getProjects().forEach(function(oShape) {
				oEalierStart = oShape.getChevron().getTime();
				oShape.setSelected(true, true);
			});
			this.getView().byId("gantt2").getAxisTimeStrategy().setVisibleHorizon(new sap.gantt.config.TimeHorizon({
				startTime: new Date(oEalierStart.getTime() - 24 * 60 * 60 * 1000) // minus one day to leave some spaces
			}));
		},

		onListLegendItemInteractiveChange: function(oEvent) {
			var oGantt1 = this.getView().byId("gantt1"),
				aRowSettings = oGantt1.getTable().getRows().map(function(oRow){ return oRow.getAggregation("_settings"); });
			var bChecked = oEvent.getParameter("value"),
				sLegendName = oEvent.getParameter("legendName");

			var fnToggleGroupShape = function(oRowSettings, bChecked) {
				oRowSettings.getTasks().forEach(function(oShape){
					if (bChecked) {
						oShape.setOpacity(1);
						oShape.setSelectable(true);
					} else {
						oShape.setOpacity(0);
						oShape.setSelectable(false);
					}
				});
			};

			var fnToggleCalendar = function(oRowSettings, bChecked) {
				oRowSettings.getCalendars().forEach(function(oShape){
					if (bChecked) {
						oShape.setOpacity(1);
					} else {
						oShape.setOpacity(0);
					}
				});
			};

			aRowSettings.forEach(function(oRowSettings) {
				if (sLegendName === "calendar") {
					fnToggleCalendar(oRowSettings, bChecked);
				} else {
					fnToggleGroupShape(oRowSettings, bChecked);
				}
			});
		},

		stepShapeColorFormatter: function(sStatus) {
			return sStatus === "finished" ? '#99D101' : (sStatus === "blocked" ? '#FF0000' : '#CAC7BA');// eslint-disable-line no-nested-ternary
		},

		legendFactory: function(sId, oContext) {
			var oScheme = oContext.getProperty();
			switch (oScheme.type) {
				case "list":
					var aItems = oScheme.legendItems.map(function(currentValue,index,arr){
						return new ListLegendItem({
							legendName: currentValue.LegendName,
							interactive: currentValue.Checked,
							shape: new BaseRectangle({
								title: currentValue.LegendName,
								fill: currentValue.Fill,
								showTitle: false
							}),
							interactiveChange: this.onListLegendItemInteractiveChange.bind(this) // bind the context to Controller
						});
					}, this);
					return new ListLegend({
						title: oScheme.SectionName,
						items: aItems
					});
				case "dimension":
					var that = this;
					var aLegendRowConfigs = oScheme.LegendRowConfigs.map(function(c){
						return new LegendRowConfig(c);
					});

					return new DimensionLegend({
						title: oScheme.SectionName,
						columnConfigs: [
							new LegendColumnConfig({
								text: "Planned",
								fill: "white"
							}),
							new LegendColumnConfig({
								text: "In Execution",
								fillFactory: function (sShapeId){
									switch (sShapeId) {
										case "conceptShape":
											return that.getView().byId("pattern_slash_orange").getRefString();
										case "designShape":
											return that.getView().byId("pattern_slash_blue").getRefString();
										case "validationShape":
											return that.getView().byId("pattern_slash_green").getRefString();
										default:
											return "";
									}
								}
							}),
							new LegendColumnConfig({
								text: "Executed",
								fillFactory: function(sShapeId) {
									switch (sShapeId) {
										case "conceptShape":
											return "@sapUiChart2";
										case "designShape":
											return "@sapUiChart1";
										case "validationShape":
											return "@sapUiChart3";
										default:
											return "";
									}
								}
							})],
						rowConfigs: aLegendRowConfigs
					});
				default:
					return null;
			}
		}

	});
});
