sap.ui.define([], function(){
	"use strict";

	function DataMaker(sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil) {
		this._hierarchyId = sHierarchyId;
		this._data = {};
		this._cacheParentNode = {};
		this._cacheNode = {};
		this._baseTime = new Date();
		this._timePattern = oTimePattern;
		this._interval = oInterval;
		this._calendarPattern = oCalendarPattern;
		this._util = oUtil;
	}

	DataMaker.prototype.makeData = function () {

		var root = {
				"id" : "root",
				"type" : "root"
			};
		this._createHierarchyResource(root);
		var rowInfoChildNum010 = {
			"text" : "row_0",
			"icon" : "sap-icon://message-error",
			"icon2": "sap-icon://status-positive",
			"url": "GanttChart.html",
			"id" : "0000",
			"subType" : "02",
			"type" : "01",
			"selected" : true,
			"startDate" : "20150919000000",
			"endDate": "20150919000000",
			"status" : "created",
			"mode" : "01,02,03",
			"style" : "critical"
		};

		this.addRow("root", "01_0", rowInfoChildNum010);
		this.addRowNode("01_0", "01_0_pointer", "pointer", {
			"time": "20151004000000",
			"tooltip": "cursor"
		});
		this.addRowNode("01_0", "01_0_hex", "hex", {
            "time": "20151018000000"
          });
		this.addRowNode("01_0", "01_0_line", "line", {
            "time": "20151019000000",
            "time2": "20151021000000"
          });
		this.addRowNode("01_0", "01_0_calendar", "nwt", {id: "twoDaysAWeek"});
		this.addRowNode("01_0", "01_0_order", "order", {
			"startTime" : "20150919000000",
			"endTime" : "20151012000000",
			"status" : 2,
			"type" : "TOL",
			"tooltip": "TOL Order"
		}, true, "middle");
		this.addRowNodeByGroup("01_0", "01_0_activity", "activity", 2, 3, {
			"startTime" : "20150919000000",
			"endTime" : "20150922000000",
			"status" : 2,
			"type" : 1,
			"tooltip": "Activity"
		});
		var rowInfoChildNum0101 = {
			"text" : "child_row_01",
			"icon" : "sap-icon://message-error",
			"id" : "00001",
			"type" : "02",
			"selected" : true,
			"startDate" : "20151012000000",
			"status" : "created",
			"mode" : "03,04"
		};
		this.addRow("01_0", "01_0_child_0", rowInfoChildNum0101);
		this.addRowNode("01_0_child_0", "01_0_child_0_order", "order", {
			"startTime" : "20150919000000",
			"endTime" : "20151012000000",
			"status" : 2,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("01_0_child_0", "01_0_child_0_activity", "activity", 1, 2, {
			"startTime" : "20150919000000",
			"endTime" : "20150921000000",
			"status" : 2,
			"type" : 1,
			"tooltip": "Activity"
		});
		var rowInfoChildNum011 = {
			"text" : "row_1",
			"icon" : "sap-icon://message-error",
			"url" : "GanttChart.html",
			"id" : "0001",
			"subType" : "02",
			"type" : "01",
			"locked" : true,
			"selected" : false,
			"startDate" : "20150923000000",
			"status" : "created",
			"mode" : "02"
		};
		this.addRow("root", "01_1", rowInfoChildNum011);
		this.addRowNode("01_1", "01_1_curve", "curve", {
            "time": "20151025000000",
            "endTime": "20151027000000"
          });
		this.addRowNode("01_1", "01_1_circle", "circle", {
            "time": "20151025000000"
          });
		this.addRowNode("01_1", "01_1_circle1", "circle", {
            "time": "20151026000000"
          });
		this.addRowNode("01_1", "01_1_circle2", "circle", {
            "time": "20151027000000"
          });
		this.addRowNode("01_1", "01_1_iconfont", "iconfont", {
			"time": "20151005110000",
			"iconfontName": "alert",
			"tooltip": "alert icon"
		});
		this.addRowNode("01_1", "01_1_calendar", "nwt", {id: "threeDaysAWeek"});
		this.addRowNode("01_1", "01_1_pointer", "pointer", {
			"time": "20150927000000",
			"tooltip": "cursor"
		});
		this.addRowNode("01_1", "01_1_order", "order", {
			"startTime" : "20150921000000",
			"endTime" : "20151022000000",
			"status" : 1,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("01_1", "01_1_activity", "activity", 3, 1, {
		"startTime" : "20150921000000",
			"endTime" : "20150928000000",
			"status" : 1,
			"type" : 1,
			"tooltip": "Activity"
		});

		var rowInfoChildNum0110 = {
			"text" : "child_row_01",
			"icon" : "sap-icon://message-error",
			"id" : "00011",
			"type" : "02",
			"selected" : false,
			"startDate" : "20150930000000",
			"status" : "released",
			"mode" : "01,03"
		};
		this.addRow("01_1", "01_1_child_0", rowInfoChildNum0110);
		this.addRowNode("01_1_child_0", "01_1_child_0_order", "order", {
			"startTime" : "20150929000000",
			"endTime" : "20151020000000",
			"status" : 1,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("01_1_child_0", "01_1_child_0_activity", "activity", 1, 3, {
			"startTime" : "20150929000000",
			"endTime" : "20150931000000",
			"status" : 1,
			"type" : 1,
			"tooltip": "Activity"
		});
		var rowInfoChildNum0111 = {
			"text" : "child_row_02",
			"icon" : "sap-icon://message-error",
			"id" : "00012",
			"type" : "04",
			"selected" : true,
			"status" : "released",
			"mode" : "01"
		};
		this.addRow("01_1", "01_1_child_01", rowInfoChildNum0111);
		this.addRowNode("01_1_child_01", "01_1_child_01_calendar", "nwt", {id: "oneDayAWeek"});
		this.addRowNode("01_1_child_01", "01_1_child_01_order", "order", {
			"startTime" : "20150924000000",
			"endTime" : "20150930000000",
			"status" : 1,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("01_1_child_01", "01_1_child_01_activity", "activity", 3, 1, {
			"startTime" : "20150924000000",
			"endTime" : "20150926000000",
			"status" : 1,
			"type" : 1,
			"tooltip": "Activity"
		});

		var rowInfoChildNum012 = {
			"text" : "row_2",
			"icon" : "sap-icon://message-error",
			"url" : "GanttChart.html",
			"id" : "0002",
			"type" : "01",
			"subType" : "01",
			"selected" : true,
			"startDate" : "20151009000000",
			"endDate" : "20151009000000",
			"status" : "completed",
			"mode" : "04",
			"style" : "notimportant"
		};
		this.addRow("root", "01_2", rowInfoChildNum012);
		this.addRowNode("01_2", "01_2_order", "order", {
			"startTime" : "20150927000000",
			"endTime" : "20151009000000",
			"status" : 1,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("01_2", "01_2_activity", "activity", 1, 6, {
			"startTime" : "20150927000000",
			"endTime" : "20150929000000",
			"status" : 1,
			"type" : 3,
			"tooltip": "Activity"
		});
		this.addRowNode("01_2", "01_2_milestone_0", "milestone", {
			"text" : "UIF: User Interface Freeze (Development Close)",
			"time" : "20151006000000",
			"tooltip": "UIF milestone"
		});
		this.addRowNode("01_2", "01_2_milestone_01", "milestone", {
			"text" : "ECC: Emergency Correction Close",
			"time" : "20151016000000",
			"tooltip": "ECC milestone"
		});
		this.addRowNode("01_2", "01_2_milestone_02", "milestone", {
			"text" : "RTC: Release to Customer",
			"time" : "20151020000000",
			"tooltip": "RTC milestone"
		});

		var rowInfoChildNum013 = {
			"text" : "row_3",
			"icon" : "sap-icon://message-error",
			"url" : "GanttChart.html",
			"locked" : true,
			"id" : "0003",
			"type" : "01",
			"subType" : "02",
			"selected" : false,
			"startDate" : "20151003000000",
			"status" : "canceled",
			"mode" : "01,04"
		};
		this.addRow("root", "01_3", rowInfoChildNum013);
		this.addRowNode("01_3", "01_3_pline", "pline", {
            "time": "20151018000000",
            "tooltip": "constraint"
          });
		this.addRowNode("01_3", "01_3_constraint", "constraint", {
			"time" : "20151011000000",
			"tooltip": "constraint"
		});
		this.addRowNode("01_3", "01_3_order", "order", {
			"startTime" : "20150930000000",
			"endTime" : "20151015000000",
			"status" : 0,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("01_3", "01_3_activity", "activity", 1, 2, {
			"startTime" : "20150930000000",
			"endTime" : "20151009000000",
			"status" : 2,
			"type" : 1,
			"tooltip": "Activity"
		});

		var rowInfoChildNum0130 = {
			"text" : "child_row_01",
			"icon" : "sap-icon://message-error",
			"id" : "00031",
			"type" : "04",
			"selected" : false,
			"status" : "canceled",
			"mode" : "01,02,03"
		};

		this.addRow("01_3", "01_3_child_0", rowInfoChildNum0130);
		this.addRowNode("01_3_child_0", "01_3_child_0_order", "order", {
			"startTime" : "20150930000000",
			"endTime" : "20151015000000",
			"status" : 0,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("01_3_child_0", "01_3_child_0_activity", "activity", 2, 1, {
			"startTime" : "20150930000000",
			"endTime" : "20151003000000",
			"status" : 2,
			"type" : 1,
			"tooltip": "Activity"
		});

		var rowInfoChildNum01300 = {
			"text" : "grandson_row_01",
			"icon" : "sap-icon://message-error",
			"id" : "000311",
			"type" : "05",
			"selected" : false,
			"status" : "released",
			"mode" : "03"
		};
		this.addRow("01_3_child_0", "01_3_child_0_child_0", rowInfoChildNum01300);
		this.addRowNode("01_3_child_0_child_0", "01_3_child_0_child_0_order", "order", {
			"startTime" : "20150931000000",
			"endTime" : "20151015000000",
			"status" : 0,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});

		this.addRowNodeByGroup("01_3_child_0_child_0", "01_3_child_0_child_0_activity", "activity", 1, 2, {
			"startTime" : "20150931000000",
			"endTime" : "20151012000000",
			"status" : 2,
			"type" : 1,
			"tooltip": "Activity"
		});

		var rowInfoChildNum0131 = {
			"text" : "child_row_02",
			"icon" : "sap-icon://message-error",
			"id" : "00032",
			"type" : "02",
			"selected" : false,
			"startDate" : "20151015000000",
			"status" : "created"
		};
		this.addRow("01_3", "01_3_child_01", rowInfoChildNum0131);
		this.addRowNode("01_3_child_01", "01_3_child_01_order", "order", {
			"startTime" : "20150928000000",
			"endTime" : "20151015000000",
			"status" : 0,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("01_3_child_01", "01_3_child_01_activity", "activity", 1, 3, {
			"startTime" : "20150928000000",
			"endTime" : "20151002000000",
			"status" : 2,
			"type" : 1,
			"tooltip": "Activity"
		});

		var rowInfoChildNum014 = {
			"text" : "row_4",
			"icon" : "sap-icon://message-error",
			"url" : "GanttChart.html",
			"id" : "0004",
			"locked" : true,
			"type" : "01",
			"subType" : "01",
			"selected" : true,
			"startDate" : "20150922000000",
			"status" : "completed",
			"mode" : "02"
		};

		this.addRow("root", "01_4", rowInfoChildNum014);
		this.addRowNode("01_4", "01_4_constraint_0", "constraint", {
			"time" : "20150927000000",
			"tooltip": "constraint"
		});
		this.addRowNode("01_4", "01_4_constraint_1", "constraint", {
			"time" : "20151003000000",
			"tooltip": "constraint"
		});
		this.addRowNode("01_4", "01_4_center_0", "center", {
			"time" : "20151010000000",
			"tooltip": "pentangle"
		});
		this.addRowNode("01_4", "01_4_center_1", "center", {
			"time" : "20151013000000",
			"tooltip": "pentangle"
		});
		this.addRowNode("01_4", "01_4_order", "order", {
			"startTime" : "20150920000000",
			"endTime" : "20151009000000",
			"status" : 0,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("01_4", "01_4_activity", "activity", 1, 3, {
			"startTime" : "20150920000000",
			"endTime" : "20150926000000",
			"status" : 0,
			"type" : 1,
			"tooltip": "Activity"
		});

		var rowInfoChildNum015 = {
			"uuid" : "01_5",
			"text" : "row_5",
			"icon" : "sap-icon://message-error",
			"url" : "GanttChart.html",
			"id" : "0005",
			"type" : "01",
			"subType" : "01",
			"selected" : false,
			"mode" : "01,02,03",
			"status" : "canceled"
		};

		this.addRow("root", "01_5", rowInfoChildNum015);
		this.addRowNode("01_5", "01_5_warning", "warning", {
			"iconName" : "warning",
			"time" : "20150925000000",
			"tooltip": "warning..."
		});
		this.addRowNode("01_5", "01_5_order", "order", {
			"startTime" : "20150922000000",
			"endTime" : "20150928000000",
			"status" : 1,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("01_5", "01_5_activity", "activity", 1, 2, {
			"startTime" : "20150922000000",
			"endTime" : "20150925000000",
			"status" : 1,
			"type" : 0,
			"tooltip": "Activity"
		});

		var rowInfoChildNum016 = {
			"text" : "row_6",
			"icon" : "sap-icon://message-error",
			"url" : "GanttChart.html",
			"id" : "0006",
			"type" : "01",
			"subType" : "01",
			"selected" : false,
			"startDate" : "20151026000000",
			"status" : "released",
			"mode" : "01,04"
		};

		this.addRow("root", "01_6", rowInfoChildNum016);
		this.addRowNode("01_6", "01_6_warning_0", "warning", {
			"iconName" : "hand",
			"time" : "20150926000000",
			"tooltip": "warning..."
		});
		this.addRowNode("01_6", "01_6_warning_1", "warning", {
			"iconName" : "warning_m",
			"time" : "20151003000000",
			"tooltip": "warning..."
		});
		this.addRowNode("01_6", "01_6_warning_2", "warning", {
			"iconName" : "warning",
			"time" : "20151007000000",
			"tooltip": "warning..."
		});
		this.addRowNode("01_6", "01_6_order", "order", {
			"startTime" : "20150925000000",
			"endTime" : "20151026000000",
			"status" : 1,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("01_6", "01_6_activity", "activity", 1, 5, {
			"startTime" : "20150925020000",
			"endTime" : "20150928010000",
			"status" : 1,
			"type" : 1,
			"tooltip": "Activity"
		});

		var rowInfoChildNum017 = {
			"text" : "row_7",
			"icon" : "sap-icon://message-error",
			"url" : "GanttChart.html",
			"id" : "0007",
			"type" : "01",
			"subType" : "01",
			"selected" : false,
			"status" : "created",
			"mode" : "01,02,03"
		};

		this.addRow("root", "01_7", rowInfoChildNum017);
		this.addRowNode("01_7", "01_7_order", "order", {
			"startTime" : "20150922000000",
			"endTime" : "20150930000000",
			"status" : 1,
			"type" : "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("01_7", "01_7_activity", "activity", 1, 5, {
			"startTime" : "20150922020000",
			"endTime" : "20150923020000",
			"status" : 1,
			"type" : 1,
			"tooltip": "Activity"
		});

		this.addToolbarSchemeToHierarchy({
			"type" : "1",
			"text" : "Resource 1"
		});
		this.addToolbarSchemeToHierarchy({
			"type" : "1",
			"text" : "Resource 2"
		});
		this.addToolbarSchemeToHierarchy({
			"type" : "5",
			"buttons" : [ {
				"icon" : "sap-icon://microphone",
				"text" : "Micro"
			}, {
				"icon" : "sap-icon://video",
				"text" : "Video"
			} ]
		});

		var oCalendarInfo01 = {
			"startTime" : "20150905000000",
			"endTime" : "20150906240000"
		};
		this.addCalendarToHierarchy("twoDaysAWeek", 14, oCalendarInfo01);
		var oCalendarInfo02 = {
			"startTime" : "20150905000000",
			"endTime" : "20150905240000"
		};
		this.addCalendarToHierarchy("oneDayAWeek", 14, oCalendarInfo02);
		var oCalendarInfo03 = {
			"startTime" : "20150905000000",
			"endTime" : "20150907240000"
		};
		this.addCalendarToHierarchy("threeDaysAWeek", 14, oCalendarInfo03);
		return this;

	};

	//if no oCalendarInfo, use baseTime
	//oCalendarInfo can have both actual time or bias time
	DataMaker.prototype.addCalendarToHierarchy = function(sCalendarId, nNodeNumber, oCalendarInfo) {

		var bKnownCalendar = false;
		var oCalendarNode;

		if (!this._data.calendar) {
			this._data.calendar = [];
		}
		if (this._getCalendar(sCalendarId)) {
			oCalendarNode = this._getCalendar(sCalendarId);
			bKnownCalendar = true;
		} else {
			oCalendarNode = {id: sCalendarId, data: []};
		}
		if (oCalendarInfo) {
			if (typeof oCalendarInfo.startTime === "number") {
				this._adjustTime(oCalendarInfo, "default");
			}
		} else {
			oCalendarInfo = this._produceDefaultNode();
			oCalendarInfo.endTime = this._getTimeByBias(this._abapTsToDate(oCalendarInfo.startTime), 1);
		}
		var aGroup = [];
		for (var i = 0; i < nNodeNumber; i++) {
			var oTempObject = this._clone(oCalendarInfo);
			if (i == 0) {
				aGroup.push(oTempObject);
			} else {
				var oLastTime = this._abapTsToDate(aGroup[aGroup.length - 1].endTime);
				this._resetDateOfNode(oTempObject, this._calendarPattern[sCalendarId], oLastTime, "default");
				aGroup.push(oTempObject);
			}
		}
		oCalendarNode.data = oCalendarNode.data.concat(aGroup);
		if (!bKnownCalendar) {
			this._data.calendar.push(oCalendarNode);
		}
		return oCalendarNode;

	};

	//add toolbar scheme to hierarchy
	DataMaker.prototype.addToolbarSchemeToHierarchy = function(oToolbarScheme) {

		if (!this._data.toolbarScheme){
			this._data.toolbarScheme = [];
		}
		this._data.toolbarScheme.push(oToolbarScheme);
		return oToolbarScheme;

	};

	//add property to hierarchy
	DataMaker.prototype.addPropertyToHierarchy = function(sHierarchyId, sProperty, oPropertyObject) {

		if (this._dataGroup && this._dataGroup[sHierarchyId] && oPropertyObject) {
			this._dataGroup[sHierarchyId][sProperty] = oPropertyObject;

			return oPropertyObject;
		} else {
			return null;
		}

	};

	DataMaker.prototype.setBaseTimeByYear = function(nYear, nMonth, nDay, nHour, nMinute, nSecond) {
		this._baseTime = new Date(nYear, nMonth, nDay, nHour, nMinute, nSecond);
	};

	DataMaker.prototype.setBaseTime = function(sBaseTime) {
		this._baseTime = this._abapTsToDate(sBaseTime);
	};

	//add a row to current hierarchy
	DataMaker.prototype.addRow = function(sParentRowUUID, sRowUUID, oRowInfo){

		var oParentNode = this._searchObjectByUUID(sParentRowUUID);
		oRowInfo.uuid = sRowUUID;
		if (!oParentNode.children){
			oParentNode.children = [];
		}
		oParentNode.children.push(oRowInfo);
		return oRowInfo;

	};

	//add a row node to current hierarchy
	//if has sTimeIntervalMode, help reset time of node, else do nothing
	DataMaker.prototype.addRowNode = function(sTargetRowUUID, sNodeInfoUUID, sType, oNodeInfo, sTimeIntervalMode){

		var oTargetRow = this._searchObjectByUUID(sTargetRowUUID);
		if (sNodeInfoUUID !== undefined) {
			oNodeInfo.uuid = sNodeInfoUUID;
		}
		if (!oTargetRow[sType]) {
			oTargetRow[sType] = [];
		}
		oNodeInfo = this._genRowNode(oTargetRow, sType, oNodeInfo, sTimeIntervalMode);
		oTargetRow[sType].push(oNodeInfo);
		return oNodeInfo;

	};

	//if have oNodeInfo, loop oNodeInfo for group
	//if not, produce default data
	DataMaker.prototype.addRowNodeByGroup = function(sTargetRowUUID, sNodeInfoUUID, sType, nGroupNumber, nObjectPerGroup, oNodeInfo) {

		var oTargetRow = this._searchObjectByUUID(sTargetRowUUID);
		if (!oTargetRow[sType]) {
			oTargetRow[sType] = [];
		}
		switch (sType) {
			case "activity":
				var aAct = this._produceDefaultGroup(sNodeInfoUUID, sType, nGroupNumber, nObjectPerGroup, oNodeInfo);
				oTargetRow[sType] = oTargetRow[sType].concat(aAct);
				this._genDifferentTypeOfActivity(aAct);
				this._genDifferentUtilOfActivity(aAct);
				break;
			default:
				oTargetRow[sType] = oTargetRow[sType].concat(this._produceDefaultGroup(sNodeInfoUUID, sType, nGroupNumber, nObjectPerGroup, oNodeInfo));
				break;
		}
		return oTargetRow[sType];

	};

	DataMaker.prototype._createHierarchyResource = function(oRootInfo){

		this._data.root = oRootInfo;
		this._data.hierarchyKey = this._hierarchyId;
		return this._data;

	};

	//generate row node
	DataMaker.prototype._genRowNode = function(oTargetRow, sType, oNodeInfo, sTimeIntervalMode) {

		var lastNode = {};
		var oTempObject = this._clone(oNodeInfo);
		if (typeof sTimeIntervalMode === "string") {
			this._adjustTime(oTempObject, sType);
			if (oTargetRow[sType].length > 0) {
				lastNode = oTargetRow[sType][oTargetRow[sType].length - 1];
			} else {
				lastNode[this._timePattern[sType][1]] = oTempObject[this._timePattern[sType][0]] || this._dateToAbapTs(this._baseTime);
			}
			if (this._interval[sTimeIntervalMode] == 0 || this._interval[sTimeIntervalMode]) {
				this._resetDateOfNode(oTempObject, this._interval[sTimeIntervalMode], this._abapTsToDate(lastNode[this._timePattern[sType][1]]), sType);
			} else { //no valid mode supplied, default mode middle
				this._resetDateOfNode(oTempObject, this._interval["middle"], this._abapTsToDate(lastNode[this._timePattern[sType][1]]), sType);
			}
		}
		return oTempObject;

	};

	//use startTime,endTime
	DataMaker.prototype._produceDefaultGroup = function(sNodeInfoUUID, sType, nGroupNumber, nObjectPerGroup, oObjectInfo) {

		if (!oObjectInfo) {
			switch (sType) {
				case "activity":
					oObjectInfo = this._produceDefaultActNode();
					break;
				case "order":
					oObjectInfo = this._produceDefaultOrderNode();
					break;
				default:
					oObjectInfo = this._produceDefaultNode();
					break;
			}
		}
		return this._genDataGroup(sNodeInfoUUID, oObjectInfo, nGroupNumber, nObjectPerGroup, sType);

	};

	//generate data group, use timepattern to determin how to get time
	DataMaker.prototype._genDataGroup = function (sNodeInfoUUID, oObjectInfo, nGroupNumber, nObjectPerGroup, sTimePattern) {

		var aGroup = [];
		var interval = 0;
		var oTempObject = {};
		var nLength = oObjectInfo.length || 0;
		for (var i = 0; i < nGroupNumber; i++) {
			for (var j = 0; j < nObjectPerGroup; j++) {
				if (j == 0) {
					interval = 5;
				} else {
					interval = 0;
				}
				if (i == 0 && j == 0) {
					if (jQuery.isArray(oObjectInfo)) {
						oTempObject = this._clone(oObjectInfo[0]);
					} else {
						oTempObject = this._clone(oObjectInfo);
					}
					oTempObject.uuid = sNodeInfoUUID + "-" + (i + j);
					this._adjustTime(oTempObject, sTimePattern);
					aGroup.push(oTempObject);
				} else {
					var oLastTime;
					if (jQuery.isArray(oObjectInfo) && oObjectInfo.length != 1) {
						if (nObjectPerGroup == 1) {
							oTempObject = this._clone(oObjectInfo[i % nLength]);
						} else {
							oTempObject = this._clone(oObjectInfo[(i * j + j) % nLength]);
						}
						this._adjustTime(oTempObject, sTimePattern);
						var nDeviation = (i * j + j) % nLength == 0 ? nLength : (i * j + j) % nLength;
						if (aGroup[aGroup.length - 1 - nDeviation]) {
							oLastTime = this._abapTsToDate(aGroup[aGroup.length - 1 - nDeviation][this._timePattern[sTimePattern][1] || this._timePattern[sTimePattern][0]]);
						} else {
							oLastTime = this._abapTsToDate(oTempObject[this._timePattern[sTimePattern][1] || this._timePattern[sTimePattern][0]]);
						}
					} else if (jQuery.isArray(oObjectInfo) && oObjectInfo.length == 1) {
						oTempObject = this._clone(oObjectInfo[0]);
						this._adjustTime(oTempObject, sTimePattern);
						oLastTime = this._abapTsToDate(aGroup[aGroup.length - 1][this._timePattern[sTimePattern][1] || this._timePattern[sTimePattern][0]]);
					} else {
						oTempObject = this._clone(oObjectInfo);
						this._adjustTime(oTempObject, sTimePattern);
						oLastTime = this._abapTsToDate(aGroup[aGroup.length - 1][this._timePattern[sTimePattern][1] || this._timePattern[sTimePattern][0]]);
					}

					oTempObject.uuid = sNodeInfoUUID + "-" + (i + j);
					this._resetDateOfNode(oTempObject, interval, oLastTime, sTimePattern);
					aGroup.push(oTempObject);
				}
			}
		}
		return aGroup;

	};

	DataMaker.prototype._produceDefaultNode = function(startTime, nLength) {

		var oDefaultNode = {};
		var length = typeof nLength === "number" ? nLength : 5;
		if (startTime) {
			if (typeof startTime === "number") {
				oDefaultNode.startTime = this._getTimeByBias(this._baseTime, startTime);
			} else {
				oDefaultNode.startTime = startTime;
			}
		} else {
			oDefaultNode.startTime = this._dateToAbapTs(this._baseTime);
			this._baseTime = this._abapTsToDate(this._getTimeByBias(this._baseTime, length));
		}
		oDefaultNode.endTime = this._getTimeByBias(this._abapTsToDate(oDefaultNode.startTime), length);
		return oDefaultNode;

	};

	DataMaker.prototype._produceDefaultOrderNode = function(startTime, nLength) {

		var oDefaultOrderNode = {};
		var length = typeof nLength === "number" ? nLength : 5;
		if (startTime) {
			if (typeof startTime === "number") {
				oDefaultOrderNode.startTime = this._getTimeByBias(this._baseTime, startTime);
			} else {
				oDefaultOrderNode.startTime = startTime;
			}
		} else {
			oDefaultOrderNode.startTime = this._dateToAbapTs(this._baseTime);
			this._baseTime = this._abapTsToDate(this._getTimeByBias(this._baseTime, length));
		}
		oDefaultOrderNode.endTime = this._getTimeByBias(this._abapTsToDate(oDefaultOrderNode.startTime), length);
		oDefaultOrderNode.type = "TOL";
		oDefaultOrderNode.status = 1;
		oDefaultOrderNode.tooltip = "TOL Order";
		return oDefaultOrderNode;

	};

	DataMaker.prototype._produceDefaultActNode = function(startTime, nLength) {

		var oDefaultActNode = {};
		var length = typeof nLength === "number" ? nLength : 5;
		if (startTime) {
			if (typeof startTime === "number") {
				oDefaultActNode.startTime = this._getTimeByBias(this._baseTime, startTime);
			} else {
				oDefaultActNode.startTime = startTime;
			}
		} else {
			oDefaultActNode.startTime = this._dateToAbapTs(this._baseTime);
			this._baseTime = this._abapTsToDate(this._getTimeByBias(this._baseTime, length));
		}
		oDefaultActNode.endTime = this._getTimeByBias(this._abapTsToDate(oDefaultActNode.startTime), length);
		oDefaultActNode.type = "0";
		oDefaultActNode.status = 1;
		oDefaultActNode.util = 50;
		oDefaultActNode.tooltip = "Activity";
		return oDefaultActNode;

	};

	DataMaker.prototype._clone = function(oObject) {

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

	//get Calendar that already exists, undefined if no
	DataMaker.prototype._getCalendar = function(sCalendarId) {

		if (this._data.calendar) {
			for (var i = 0; i < this._data.calendar.length; i++) {
				if (this._data.calendar[i].id === sCalendarId) {
					return this._data.calendar[i];
				}
			}
		}

	};

	DataMaker.prototype._genDifferentTypeOfActivity = function(aActivity) {
		if (jQuery.isArray(aActivity)) {
			for (var i = 0; i < aActivity.length; i++) {
				aActivity[i].type = i % 5;
			}
		}
	};

	DataMaker.prototype._genDifferentUtilOfActivity = function(aActivity) {
		if (jQuery.isArray(aActivity)) {
			for (var i = 0; i < aActivity.length; i++) {
				aActivity[i].util = this._util[i % 5];
			}
		}
	};

	//reset date, maintain the length of the object
	DataMaker.prototype._resetDateOfNode = function(oObjectInfo, interval, oLastTime, sTimePattern) {

		if (this._timePattern[sTimePattern][1]) {
			if (oObjectInfo[this._timePattern[sTimePattern][0]] && oObjectInfo[this._timePattern[sTimePattern][1]]) {
				var timeDiff = this._getTimeDiff(oObjectInfo[this._timePattern[sTimePattern][1]], oObjectInfo[this._timePattern[sTimePattern][0]]);
				oObjectInfo[this._timePattern[sTimePattern][0]] = this._getTimeByBias(oLastTime, interval);
				oObjectInfo[this._timePattern[sTimePattern][1]] = this._getTimeByBias(this._abapTsToDate(oObjectInfo[this._timePattern[sTimePattern][0]]), timeDiff);
			} else {
				oObjectInfo[this._timePattern[sTimePattern][0]] = this._getTimeByBias(oLastTime, interval);
				oObjectInfo[this._timePattern[sTimePattern][1]] = this._getTimeByBias(this._abapTsToDate(oObjectInfo[this._timePattern[sTimePattern][0]]), 5);
			}
		} else {
			oObjectInfo[this._timePattern[sTimePattern][0]] = this._getTimeByBias(oLastTime, interval);
		}

	};

	//adjust time if is a bias number
	DataMaker.prototype._adjustTime = function(oObjectInfo, sTimePattern) {

		if (oObjectInfo[this._timePattern[sTimePattern][0]]) {
			if (typeof oObjectInfo[this._timePattern[sTimePattern][0]] === "number") {
				oObjectInfo[this._timePattern[sTimePattern][0]] = this._getTimeByBias(this._baseTime, oObjectInfo[this._timePattern[sTimePattern][0]]);
				this._baseTime = this._abapTsToDate(oObjectInfo[this._timePattern[sTimePattern][0]]);
			}
		}
		if (oObjectInfo[this._timePattern[sTimePattern][1]]) {
			if (typeof oObjectInfo[this._timePattern[sTimePattern][1]] === "number") {
				oObjectInfo[this._timePattern[sTimePattern][1]] = this._getTimeByBias(this._baseTime, oObjectInfo[this._timePattern[sTimePattern][1]]);
				this._baseTime = this._abapTsToDate(oObjectInfo[this._timePattern[sTimePattern][1]]);
			}
		}

	};

	DataMaker.prototype._getTimeByBias = function (date, dayBias){
		var oDate = new Date(date.getTime());
		oDate.setTime(oDate.getTime() + dayBias * 24 * 60 * 60 * 1000);
		return this._dateToAbapTs(oDate);
	};

	DataMaker.prototype._getTimeDiff = function (dateNow, dateDiff) {
		 return (this._abapTsToDate(dateNow).getTime() - this._abapTsToDate(dateDiff).getTime()) / (24 * 60 * 60 * 1000);
	};

	DataMaker.prototype._dateToAbapTs = function (date) {
		return "" + date.getFullYear() +
			(date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) +
			(date.getDate() < 10 ? "0" : "") + date.getDate() +
			(date.getHours() < 10 ? "0" : "") + date.getHours() +
			(date.getMinutes() < 10 ? "0" : "") + date.getMinutes() +
			(date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
	};

	DataMaker.prototype._abapTsToDate = function (ts) {
		if (typeof ts === "string" && ts.length >= 6) {
			return new Date(ts.substr(0, 4),
				parseInt(ts.substr(4, 2), 0) - 1,
				ts.substr(6, 2),
				ts.substr(8, 2),
				ts.substr(10, 2),
				ts.substr(12, 2));
		}
		return null;
	};

	DataMaker.prototype._searchObjectByUUID = function(sUUID){

		if (sUUID === "root"){
			return this._data.root;
		}
		if (this._cacheNode.uuid === sUUID){
			return this._cacheNode;
		} else {
			if (!this._data){
				return null;
			}
			return this._searchNode(this._data.root, sUUID);
		}

	};

	DataMaker.prototype._searchNode = function(oNode, sUUID){

		var node;
		if (oNode.uuid || oNode.type === "root"){
			if (oNode.uuid === sUUID){
				this._cacheNode = oNode;
				return oNode;
			} else {
				for (var propertyName in oNode){
					node =  this._searchNode(oNode[propertyName], sUUID);
					if (node){
						this._cacheParentNode = oNode;
						this._cacheNode = node;
						return node;
					}
				}
			}
		} else if (oNode instanceof Array ){
			for (var i = 0; i < oNode.length; i++){
				node =  this._searchNode(oNode[i], sUUID);
				if (node){
					this._cacheParentNode = oNode[i];
					this._cacheNode = node;
					return node;
				}
			}
		} else {
			return null;
		}

	};

	return DataMaker;
}, true);
