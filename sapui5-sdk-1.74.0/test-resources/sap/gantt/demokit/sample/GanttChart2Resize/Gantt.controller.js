sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/misc/Format",
	"sap/gantt/misc/Utility",
	"sap/ui/core/theming/Parameters",
	"sap/m/MessageBox"
], function (Controller, JSONModel, Format, Utility, Parameters, MessageBox) {
	"use strict";

	return Controller.extend("sap.gantt.sample.GanttChart2Resize.Gantt", {
		onInit: function () {
			var oData = {
				root: {
					children: []
				}
			};
			for (var i = 0; i < 10; i++) {
				var oLine = {
					id: "line" + i,
					text: "Row " + (i + 1),
					shapes: [
						{
							id: "s" + i + "-1",
							title: "Shape " + (i + 1) + " - 1",
							startTime: Format.abapTimestampToDate("20181101090000"),
							endTime: Format.abapTimestampToDate("20181110090000")
						},
						{
							id: "s" + i + "-2",
							title: "Shape " + (i + 1) + " - 2",
							startTime: Format.abapTimestampToDate("20181111090000"),
							endTime: Format.abapTimestampToDate("20181127090000")
						}
					]
				};
				oData.root.children.push(oLine);
			}
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
			this.getView().byId("gantt").setShapeSelectionSettings({
				color: Parameters.get("sapUiChartPaletteQualitativeHue11"),
				strokeWidth: 2
			});
		},
		getRowById: function (sRowId) {
			var aRows = this.getView().getModel().getData().root.children;
			for (var i = 0; i < aRows.length; i++) {
				if (aRows[i].id === sRowId) {
					return aRows[i];
				}
			}
		},
		fnShapeDrop: function (oEvent) {
			var oDraggedShapeDates = oEvent.getParameter("draggedShapeDates"),
				oModel = this.getView().getModel(),
				sShapeId = oEvent.getParameter("lastDraggedShapeUid"),
				oShapeInfo = Utility.parseUid(sShapeId),
				sPath = oShapeInfo.shapeDataName,
				oNewDateTime = oEvent.getParameter("newDateTime"),
				oOldTimes = oDraggedShapeDates[sShapeId],
				iTimeDiff = oNewDateTime.getTime() - oOldTimes.time.getTime(),
				oTargetRow = oEvent.getParameter("targetRow"),
				oTargetShape = oEvent.getParameter("targetShape");
			oModel.setProperty(sPath + "/startTime", new Date(oOldTimes.time.getTime() + iTimeDiff));
			oModel.setProperty(sPath + "/endTime", new Date(oOldTimes.endTime.getTime() + iTimeDiff));
			if (oTargetRow || oTargetShape) {
				var oRow;
				if (oTargetRow) {
					if (oTargetRow.getBindingContext()) {
						oRow = oModel.getObject(oTargetRow.getBindingContext().getPath());
					} else {
						MessageBox.alert("Moving shapes to new rows is not supported by this sample.", {
							title: "Incorrect Operation"
						});
						return;
					}
				} else {
					oRow = oModel.getObject(oTargetShape.getParent().getBindingContext().getPath());
				}
				var oOriginalRow = this.getRowById(oShapeInfo.rowId);
				if (oOriginalRow.id !== oRow.id) {
					var iShapePos;
					for (iShapePos = 0; iShapePos < oOriginalRow.shapes.length; iShapePos++) {
						// TODO: Continue
					}
				}
			}
		},
		fnShapeResize: function (oEvent) {
			var oShape = oEvent.getParameter("shape"),
				aNewTimes = oEvent.getParameter("newTime");
			oShape.setTime(aNewTimes[0]);
			oShape.setEndTime(aNewTimes[1]);
		}
	});
});
