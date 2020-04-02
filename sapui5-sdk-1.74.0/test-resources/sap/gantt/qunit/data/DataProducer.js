sap.ui.define([
	"./DataMaker",
	"./TOLDataMaker",
	"./RESOURCESDataMaker",
	"./TRUCKDataMaker",
	"./TRUCKULCDataMaker",
	"./HRDataMaker",
	"./TRUCKNOTOOLBARDataMaker",
	"./RELDataMaker"
], function(
	DataMaker,
	TOLDataMaker,
	RESOURCESDataMaker,
	TRUCKDataMaker,
	TRUCKULCDataMaker,
	HRDataMaker,
	TRUCKNOTOOLBARDataMaker,
	RELDataMaker
){

	"use strict";
	function DataProducer(){
		this._dataGroup = {};
		this._timePattern = {
				"sap_hierarchy": {
					"default": ["startTime", "endTime"],
					"order": ["startTime", "endTime"],
					"activity": ["startTime", "endTime"],
					"pointer": ["time"],
					"hex": ["time"],
					"line": ["time", "time2"],
					"curve": ["time", "endTime"],
					"circle": ["time"],
					"milestone": ["time"],
					"constraint": ["time"],
					"pline": ["time"],
					"center": ["time"],
					"warning": ["time"]
				},
				"TOL": {
					"default": ["startTime", "endTime"],
					"order": ["startTime", "endTime"],
					"activity": ["startTime", "endTime"]
				},
				"TRUCK": {
					"default": ["startTime", "endTime"],
					"order": ["startTime", "endTime"],
					"activity": ["startTime", "endTime"]
				},
				"TRUCK_ULC": {
					"default": ["startTime", "endTime"],
					"activity": ["startTime", "endTime"],
					"order": ["startTime", "endTime"],
					"tooltip": ["from", "to"],
					"values": ["from", "to"]
				},
				"RESOURCES": {
					"default": ["startTime", "endTime"],
					"activity": ["startTime", "endTime"],
					"order": ["startTime", "endTime"],
					"tooltip": ["from", "to"],
					"values": ["from", "to"]
				},
				"HR": {
					"ubc_tooltip": ["start_date", "end_date"],
					"period": ["start_date"]
				},
				"TRUCK_WITHOUT_TOOLBAR": {
					"default": ["startTime", "endTime"],
					"order": ["startTime", "endTime"],
					"activity": ["startTime", "endTime"]
				},
				"REL": {
					"default": ["startTime", "endTime"],
					"activity": ["startTime", "endTime"],
					"task": ["startTime", "endTime"],
					"phase": ["startTime", "endTime"]
				}
		};
		this._interval = {
			"null": 0,
			"small": 0.5,
			"middle": 2,
			"large": 5
		};
		this._calendarPattern = {
			"oneDayAWeek": 7,
			"twoDaysAWeek": 3.5,
			"threeDaysAWeek": 2.4,
			"fourDaysAWeek": 1.75,
			"fiveDaysAWeek": 1.4,
			"sixDaysAWeek": 1.2,
			"sevenDaysAWeek": 1
		};
		this._util = [0, 50, 70, 90, 95];
		this._dataMaker = {};
	}

	DataProducer.prototype.produceData = function(sHierarchyId) {

		var oMakedData = {};
		if (!sHierarchyId) {
			if (!this._dataGroup["sap_hierarchy"]) {
				this._dataMaker = new DataMaker("sap_hierarchy", this._timePattern["sap_hierarchy"], this._interval, this._calendarPattern, this._util);
				oMakedData = this._dataMaker.makeData();
				this._dataGroup["sap_hierarchy"] = oMakedData._data;
			}
		} else {
			oMakedData = this._getDataMaker(sHierarchyId).makeData();
			this._dataGroup[sHierarchyId] = this._dataGroup[sHierarchyId] || oMakedData._data;
		}
		return oMakedData;

	};

	DataProducer.prototype._getDataMaker = function (sHierarchyId) {

		var oDataMaker = {};
		switch (sHierarchyId) {
		case "TOL":
			oDataMaker = new TOLDataMaker(sHierarchyId, this._timePattern[sHierarchyId], this._interval, this._calendarPattern, this._util);
			oDataMaker._data.adhocLineLayer = sap.gantt.AdhocLineLayer.Top;
			break;
		case "RESOURCES":
			oDataMaker = new RESOURCESDataMaker(sHierarchyId, this._timePattern[sHierarchyId], this._interval, this._calendarPattern, this._util);
			oDataMaker._data.adhocLineLayer = sap.gantt.AdhocLineLayer.Bottom;
			break;
		case "TRUCK":
			oDataMaker = new TRUCKDataMaker(sHierarchyId, this._timePattern[sHierarchyId], this._interval, this._calendarPattern, this._util);
			break;
		case "TRUCK_ULC":
			oDataMaker = new TRUCKULCDataMaker(sHierarchyId, this._timePattern[sHierarchyId], this._interval, this._calendarPattern, this._util);
			break;
		case "HR":
			oDataMaker = new HRDataMaker(sHierarchyId, this._timePattern[sHierarchyId], this._interval, this._calendarPattern, this._util);
			break;
		case "TRUCK_WITHOUT_TOOLBAR":
			oDataMaker = new TRUCKNOTOOLBARDataMaker(sHierarchyId, this._timePattern[sHierarchyId], this._interval, this._calendarPattern, this._util);
			break;
		case "REL":
			oDataMaker = new RELDataMaker(sHierarchyId, this._timePattern[sHierarchyId], this._interval, this._calendarPattern, this._util);
			break;
		default:
			oDataMaker = new DataMaker("sap_hierarchy", this._timePattern["sap_hierarchy"], this._interval, this._calendarPattern, this._util);
			break;
		}
		return oDataMaker;

	};

	DataProducer.prototype.getData = function(sHierarchyId){

		if (this._dataGroup && this._dataGroup[sHierarchyId]){
			return this._clone(this._dataGroup[sHierarchyId]);
		} else {
			return null;
		}

	};

	DataProducer.prototype._clone = function(oObject) {

		if (typeof oObject !== "object"){
			return oObject;
		}
		var oClone = {};
		if (oObject.constructor == Array){
			oClone = [];
		}
		for (var i in oObject){
			oClone[i] = this._clone(oObject[i]);
		}
		return oClone;

	};

	return DataProducer;
}, true);
