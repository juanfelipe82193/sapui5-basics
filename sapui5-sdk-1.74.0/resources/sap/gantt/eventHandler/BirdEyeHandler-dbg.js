sap.ui.define([
	"sap/ui/base/Object",
	"sap/gantt/misc/Format",
	"sap/gantt/config/TimeHorizon"
],
function (
	BaseObject,
	Format,
	TimeHorizon){
	"use strict";

	/**
	 * Constructor for a new BirdEye handler
	 *
	 * Initialize the handler and its two properties "_sStartTimeStamp", "_sEndTimeStamp" are the time range of shapes
	 * @class
	 * Defines the properties required for the initialization of bird eye operation
	 * @extends sap.ui.base.Object
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.gantt.eventHandler.BirdEyeHandler
	 */
	var BirdEyeHandler = BaseObject.extend("sap.gantt.eventHandler.BirdEyeHandler", {
		constructor : function (oChart) {
			BaseObject.call(this);
			this._oSourceChart = oChart;
			this._sStartTimeStamp = 0;
			this._sEndTimeStamp = 0;
		}
	});

	BirdEyeHandler.prototype.calculateLargestVisibleHorizon = function (aAllShapeInstances, bIgnoreBuffer) {
		if (!aAllShapeInstances || aAllShapeInstances.length === 0) {
			return null;
		}
		var that = this;
		for (var i = 0; i < aAllShapeInstances.length; i++) {
			var oShapeInstance = aAllShapeInstances[i];
			var aDataSet = oShapeInstance.dataSet;
			if (aDataSet && aDataSet.length > 0) {
				for (var j = 0; j < aDataSet.length; j++){
					that._collectShapeTimeRange(oShapeInstance, aDataSet[j]);
				}
			}
		}
		if (!this._sStartTimeStamp && !this._sEndTimeStamp) {
			return null;
		}
		var oStartDateTime = Format.abapTimestampToDate(this._sStartTimeStamp).getTime();
		var oEndDateTime = Format.abapTimestampToDate(this._sEndTimeStamp).getTime();

		var oStartDate = Format.abapTimestampToDate(this._sStartTimeStamp);
		var oEndDate = Format.abapTimestampToDate(this._sEndTimeStamp);

		if (!bIgnoreBuffer){
			//reserve 5 pixel buffer at the boundary time, to better show the shapes, instead of
			//giving user a feeling that the shapes are truncated.
			var nVisibleWidth = this._oSourceChart.getVisibleWidth();
			var timeRangePerPixel = (oEndDateTime - oStartDateTime) / nVisibleWidth;
			oStartDate = new Date(oStartDateTime - timeRangePerPixel * 5);
			oEndDate = new Date(oEndDateTime + timeRangePerPixel * 5);
		}

		var oVisibleHorizon = new TimeHorizon({
			startTime: oStartDate,
			endTime: oEndDate
		});
		this._sStartTimeStamp = 0;
		this._sEndTimeStamp = 0;
		return oVisibleHorizon;
	};

	BirdEyeHandler.prototype._collectShapeTimeRange = function (oShape, oData, sAttr, oRowInfo) {
		var that = this;
		if (oData) {
			var aShapeData = [];
			if (oData.shapeData) {// top shapes
				oRowInfo = oData.objectInfoRef;
				aShapeData = aShapeData.concat(oData.shapeData);
			} else if (sAttr && oData[sAttr]) {// aggregated shapes and special attribute is identified
				aShapeData = aShapeData.concat(oData[sAttr]);
			} else if (oData){ // inherigate parent data
				aShapeData = aShapeData.concat(oData);
			}
			//if the shape has a filterValidData method, filter valid data for the shape
			if (oShape.filterValidData && aShapeData.length > 0) {
				aShapeData = oShape.filterValidData(aShapeData, oRowInfo);
			}

			if (oShape.getTag() == "g" && aShapeData.length > 0) {
				var aAggregationShapes = oShape.getShapes();
				if (aAggregationShapes && aAggregationShapes.length > 0) {
					for (var i = 0; i < aAggregationShapes.length; i++) {
						for (var j = 0; j < aShapeData.length; j++){
							that._collectShapeTimeRange(aAggregationShapes[i], aShapeData[j], aAggregationShapes[i].mShapeConfig.getShapeDataName(), oRowInfo);
						}
					}
				}
			} else if (oShape.mShapeConfig.getCountInBirdEye()) {
				var bShapeHasRange = (oShape.getTime || oShape.getEndTime) ? true : false;
				if (aShapeData.length > 0 && bShapeHasRange) {
					aShapeData.forEach(function(oData){
						var startTime = oShape.getTime(oData, oRowInfo);
						var endTime = oShape.getEndTime(oData, oRowInfo);
						that._sStartTimeStamp = (startTime && (!that._sStartTimeStamp || startTime < that._sStartTimeStamp)) ? startTime : that._sStartTimeStamp;
						if (endTime) {
							that._sEndTimeStamp = (endTime && (!that._sEndTimeStamp || endTime > that._sEndTimeStamp)) ? endTime : that._sEndTimeStamp;
						} else { // for a non duration data
							that._sEndTimeStamp = (startTime && (!that._sEndTimeStamp || startTime > that._sEndTimeStamp)) ? startTime : that._sEndTimeStamp;
						}
					});
				}
			}
		}
	};

	BirdEyeHandler.prototype.doBirdEye = function (sBirdEyeRange, iRowIndex){
		if (this._oSourceChart) {
			var oGantt = this._oSourceChart;
			var oTargetVisibleHorizon = oGantt.getLargestHorizonByDataRange(sBirdEyeRange, iRowIndex);
			if (oTargetVisibleHorizon) {
				var oAxisTimeStrategy = oGantt.getAxisTimeStrategy();
				if (typeof oAxisTimeStrategy.setVisibleHorizon === "function") {
					oAxisTimeStrategy.setVisibleHorizon(oTargetVisibleHorizon);
				} else {
					oAxisTimeStrategy._setVisibleHorizon(oTargetVisibleHorizon);
				}
			}
		}
	};
	return BirdEyeHandler;
}, true);
