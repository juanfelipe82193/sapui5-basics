sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/sample/GanttChartContainer/localService/mockserver",
	"sap/gantt/sample/GanttChartContainer/model/formatter"
], function(Controller, JSONModel, mockserver, formatter) {
	"use strict";


	return Controller.extend("sap.gantt.sample.GanttChartContainer.GanttChartContainer", {

		formatter: formatter,

		onInit: function(){

			var oDataModel = this.getView().getModel("data");
			var aDeferredGroups = oDataModel.getDeferredGroups();
			aDeferredGroups = aDeferredGroups.concat(["deferred"]);
			oDataModel.setDeferredGroups(aDeferredGroups);

			this.iNewFOCount = 0;
		},

		onShapeDrop: function(oEvent) {
			var oSourceGantt = oEvent.getSource();
			var oNewDateTime = oEvent.getParameter("newDateTime");
			var oDraggedShapeDates = oEvent.getParameter("draggedShapeDates");
			var sLastDraggedShapeUid = oEvent.getParameter("lastDraggedShapeUid");

			var oOldStartDateTime = oDraggedShapeDates[sLastDraggedShapeUid].time;
			var oOldEndDateTime = oDraggedShapeDates[sLastDraggedShapeUid].endTime;
			var iMoveWidthInMs = oNewDateTime.getTime() - oOldStartDateTime.getTime();
			if (oSourceGantt.getGhostAlignment() === sap.gantt.dragdrop.GhostAlignment.End) {
				iMoveWidthInMs = oNewDateTime.getTime() - oOldEndDateTime.getTime();
			}

			var getBindingContextPath = function (sShapeUid) {
				var oParsedUid = sap.gantt.misc.Utility.parseUid(sShapeUid);
				return oParsedUid.shapeDataName;
			};

			var oTargetRow = oEvent.getParameter("targetRow");
			var oTargetObject = oTargetRow.getBindingContext("data").getObject();
			var sTargetObjectType = oTargetObject.Type;

			var oDataModel = oSourceGantt.getModel("data");
			var that = this;

			Object.keys(oDraggedShapeDates).forEach(function (sShapeUid) {
				var sPath = getBindingContextPath(sShapeUid);
				var oOldDateTime = oDraggedShapeDates[sShapeUid].time;
				var oOldEndDateTime = oDraggedShapeDates[sShapeUid].endTime;
				var oNewDateTime = new Date(oOldDateTime.getTime() + iMoveWidthInMs);
				var oNewEndDateTime = new Date(oOldEndDateTime.getTime() + iMoveWidthInMs);

				var oData = oDataModel.getObject(sPath);

				var sType = oDataModel.getProperty(sPath + "/Type");

				if (sTargetObjectType == "Truck"){
					if (sType == "FO") {
						that.handleMoveFreightOrderToTruck(oNewDateTime, oNewEndDateTime, oTargetObject, sPath, oDataModel, iMoveWidthInMs);
					} else if (sType == "FU") {
						if (oData.PlanStatus == "unplanned"){
							that.handleMoveFreightUnitToTruck(oNewDateTime, oNewEndDateTime, oTargetObject, sPath, oDataModel);
						}
					}
				}
			});
		},

		handleMoveFreightUnitToTruck: function(oTime, oEndTime, oTargetObject, sPath, oModel){
			var oData = oModel.getObject(sPath);

			var sTargetResourceId = oTargetObject.ResourceID;
			this.iNewFOCount++;
			var sNewFOId = "$" + this.iNewFOCount;

			oData.ParentRequirementID = sNewFOId;
			oData.ResourceID = sTargetResourceId;
			oData.StartTime = oTime;
			oData.EndTime = oEndTime;
			oData.HierarchyLevel = 1;
			oData.PlanStatus = "planned";

			var oFreightOrderData = {
				"RequirementID"       : sNewFOId,
				"ResourceID"          : sTargetResourceId,
				"Type"                : "FO",
				"PlanStatus"          : "planned",
				"StartTime"           : oTime,
				"EndTime"             : oEndTime,
				"SourceLocation"      : oData.SourceLocation,
				"DestinationLocation" : oData.DestinationLocation,
				"ParentResourceID"    : sTargetResourceId,
				"ParentRequirementID" : null,
				"HierarchyLevel"      : 0,
				"DrillState"          : "expanded"
			};

			oModel.create("/Requirements", oFreightOrderData);

			var mParameters = {
				success: function(oData) {
					mockserver.refreshResource(oModel, sTargetResourceId);
				},
				refreshAfterChange : false
			};
			oModel.update(sPath, oData, mParameters);
		},

		handleMoveFreightOrderToTruck: function(oTime, oEndTime, oTargetObject, sPath, oModel, iMoveWidthInMs){
			var oData = oModel.getObject(sPath);
			var sCurrentResourceID = oData.ResourceID;
			var sTargetResourceID = oTargetObject.ResourceID;

			if (sCurrentResourceID !== sTargetResourceID){
				oData.StartTime = oTime;
				oData.EndTime = oEndTime;
				oData.PlanStatus = "planned";
				oData.ResourceID = sTargetResourceID;
				oData.ParentResourceID = sTargetResourceID;

				var mParameters = {
					success: function(oData) {
						oModel.read("/Resources('" + sTargetResourceID + "')", {
							urlParameters: {
								"$expand": "ResourceToRequirements"
							}
						});
					},
					refreshAfterChange : false
				};
				oModel.update(sPath, oData, mParameters);
			} else {
				oModel.setProperty(sPath + "/StartTime", oTime, true);
				oModel.setProperty(sPath + "/EndTime", oEndTime, true);
			}

			oModel.read('/Requirements', {
				success: function(oData){
					var aResult = oData.results;
					aResult.forEach(function(oNode){
						var sUnitPath = "/Requirements('" + oNode.RequirementID + "')";
						oModel.setProperty(sUnitPath + "/StartTime", oTime, true);
						oModel.setProperty(sUnitPath + "/EndTime", oEndTime, true);
					});

				},
				error: function(){

				},
				urlParameters: {
					"$filter": "ParentRequirementID eq " + oData.RequirementID
				}
			});


			oModel.read('/UtilizationItems', {
				success: function(oItemData){
					var aResult = oItemData.results;
					aResult.forEach(function(oItem){
						var sUnitPath = "/UtilizationItems('" + oItem.UtilItemID + "')";
						var oOldStartDateTime = oItem.StartTime;
						var oOldEndDateTime = oItem.EndTime;
						var oNewStartTime = new Date(oOldStartDateTime.getTime() + iMoveWidthInMs);
						var oNewEndTime = new Date(oOldEndDateTime.getTime() + iMoveWidthInMs);
						var oData = {
							StartTime: oNewStartTime,
							EndTime: oNewEndTime
						};

						oModel.update(sUnitPath, oData);
					});

				},
				error: function(){

				},
				urlParameters: {
					"$filter": "RootRequirementID eq " + oData.RequirementID
				}
			});

		},

		onLayoutChange: function(oEvent){
			var oGanttChartContainer = this.byId("container");
			oGanttChartContainer.removeAllGanttCharts();

			var sKey = oEvent.getParameter("selectedItem").getKey();
			switch (sKey) {
				case "ReqAndRes":
					var oOrderAndUnitGantt = this.getGanttInstance("FreightOrderAndFreightUnit");
					oGanttChartContainer.addGanttChart(oOrderAndUnitGantt);
					oGanttChartContainer.addGanttChart(this.getGanttInstance("Truck"));
					break;
				case "Resource":
					oGanttChartContainer.addGanttChart(this.getGanttInstance("Truck"));
					break;
				case "Requirement":
					var oRequirementGantt = this.getGanttInstance("FreightOrderAndFreightUnit");
					oGanttChartContainer.addGanttChart(oRequirementGantt);
					break;
				default:
					return;
			}
		},

		onHierarchyChange: function(oEvent){
			var oGanttChartContainer = this.byId("container");
			oGanttChartContainer.removeGanttChart(0);

			var sKey = oEvent.getParameter("selectedItem").getKey();
			var oGanttChartWithTable;

			switch (sKey) {
				case "FOFU":
					oGanttChartWithTable = this.getGanttInstance("FreightOrderAndFreightUnit");
					break;
				case "FO":
					oGanttChartWithTable = this.getGanttInstance("FreightOrder");
					break;
				case "FU":
					oGanttChartWithTable = this.getGanttInstance("FreightUnit");
					break;
				default:
					return;
			}
			oGanttChartContainer.insertGanttChart(oGanttChartWithTable, 0);
		},

		getGanttInstance: function(sId){
			var oView = this.getView();
			var oGantt = oView.byId(sId);
			if (!oGantt) {
				oGantt = sap.ui.xmlfragment(oView.getId(), "sap.gantt.sample.GanttChartContainer.view." + sId, this);
			}

			return oGantt;
		},

		_getOrderCreationDialog: function() {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sap.gantt.sample.GanttChartContainer.view.OrderCreate", this);
				this._oDialog.setModel(new JSONModel(), "order");

				this.getView().addDependent(this._oDialog);
			}

			return this._oDialog;
		},

		_getDetailPopover: function() {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("sap.gantt.sample.GanttChartContainer.view.DetailPopover", this);
				this._oPopover.setModel(new JSONModel(), "popover");

				this.getView().addDependent(this._oPopover);
			}

			return this._oPopover;
		},

		onCreate: function(oEvent){
			this._getOrderCreationDialog().open();
		},

		onConfirmCreateFreightOrder: function(oEvent){
			var oDataModel = this.getView().getModel("data");
			this.iNewFOCount++;
			var sNewFOId = "$" + this.iNewFOCount;
			var oOrderData = this._oDialog.getModel("order").getData();

			var oFreightOrderData = {
				"RequirementID"       : sNewFOId,
				"ResourceID"          : oOrderData.Truck,
				"Type"                : "FO",
				"PlanStatus"          : "planned",
				"StartTime"           : oOrderData.DepartureDate,
				"EndTime"             : oOrderData.ArriveDate ,
				"SourceLocation"      : oOrderData.SourceLocation,
				"DestinationLocation" : oOrderData.DestinationLocation,
				"ParentResourceID"    : oOrderData.Truck,
				"ParentRequirementID" : null,
				"HierarchyLevel"      : 0,
				"DrillState"          : "leaf"
			};

			var oController = this;
			var mParameters = {
				success: function(oData) {
					mockserver.refreshResource(oDataModel, oOrderData.Truck, function(){
						sap.m.MessageToast.show("Freight Order is created successfully");
						oController._getOrderCreationDialog().close();
					});
				},
				error: function(oData) {
					sap.m.MessageToast.show("Error when creating frieght order");
				},
				refreshAfterChange : false
			};
			oDataModel.create("/Requirements", oFreightOrderData, mParameters);
		},

		onDialogClose: function(){
			this._getOrderCreationDialog().close();
		},

		onDelete: function(oEvent){
			var oControl = oEvent.getSource();
			while (!(oControl instanceof sap.gantt.simple.GanttChartWithTable)){
				oControl = oControl.getParent();
			}
			var oDataModel = oControl.getModel("data");
			var aUid = oControl.getSelectedShapeUid();
			aUid.forEach(function(sShapeUid){
				var o = sap.gantt.misc.Utility.parseUid(sShapeUid);
				var sPath  = o.shapeDataName;
				var mParameters = {
					success: function() {
						sap.m.MessageToast.show("Freight Order is deleted");
					}
				};
				oDataModel.remove(sPath, mParameters);
			});
		},

		onOrderRescheduled: function(oEvent) {

			var oTableGantt = oEvent.getSource(),
				oDataModel = oTableGantt.getModel("data");

			var oShape = oEvent.getParameter("shape"),
				aNewTime = oEvent.getParameter("newTime"),
				sBindingPath = oShape.getBindingContext("data").getPath();

			oDataModel.setProperty(sBindingPath + "/StartTime", aNewTime[0], true);
			oDataModel.setProperty(sBindingPath + "/EndTime", aNewTime[1], true);
		},

		onShapeDoubleClick: function(oEvent) {
			var oShape = oEvent.getParameter("shape");

			if (oShape) {
				this._getDetailPopover().getModel("popover").setData({
					RequirementID       : oShape.getShapeId(),
					SourceLocation      : "Beijing",
					DestinationLocation : "Shanghai",
					DepartureDate       : oShape.getTime(),
					ArrivalDate         : oShape.getEndTime()
				});

				this._getDetailPopover().setOffsetX(oEvent.getParameter("popoverOffsetX")).openBy(oShape);
			}
		},

		onViewDocument: function(oEvent) {
			sap.m.MessageToast.show("Opening Document ...");
		},

		showUtilization: function(){
			var oGanttChartContainer = this.byId("container");
			var aGantts = oGanttChartContainer.getGanttCharts();
			aGantts.forEach(function(oGantt) {
				if (oGantt.getId().endsWith("Truck")) {
					oGantt.expand("truck_to_ulc", oGantt.getTable().getSelectedIndex());
				}
			});
		},

		hideUtilization: function(){
			var oGanttChartContainer = this.byId("container");
			var aGantts = oGanttChartContainer.getGanttCharts();
			aGantts.forEach(function(oGantt) {
				if (oGantt.getId().endsWith("Truck")) {
					oGantt.collapse("truck_to_ulc", oGantt.getTable().getSelectedIndex());
				}
			});
		},
		onLegendItemInteractiveChange: function(oEvent){
			sap.m.MessageToast.show("Legend Item interactive value changed on shape: " + oEvent.getParameter("legendName"));
		}
	});
});
