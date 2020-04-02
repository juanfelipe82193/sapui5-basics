sap.ui.define(["./DataMaker"], function(DataMaker){
	"use strict";

	function RELDataMaker(sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil) {
		DataMaker.call(this, sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil);
	}

	RELDataMaker.prototype = new DataMaker();

	RELDataMaker.prototype.makeData = function () {

		this._createHierarchyResource({ id: "root", type: "root" });
		this.addToolbarSchemeToHierarchy({
			"type": "1",
			"eventId": "SET_MODE",
			"tooltip": "Change Selection Mode",
			"text": "SingleMode"
		});
		this.addToolbarSchemeToHierarchy({
			"type": "1",
			"eventId": "SEL_RLS",
			"tooltip": "Select Relationships",
			"text": "Select Relationships"
		});
		this.addToolbarSchemeToHierarchy({
			"type": "1",
			"eventId": "GET_SEL_RLS",
			"tooltip": "Get Selected Relationships",
			"text": "Get Selected Relationships"
		});
		this.addToolbarSchemeToHierarchy({
			"type": "1",
			"eventId": "RESET_RSL_SEL",
			"tooltip": "Reset Relationship Selection",
			"text": "Reset Relationship Selection"
		});
		this.addToolbarSchemeToHierarchy({
			"type": "5",
			"buttons": [
				{
					"icon": "sap-icon://print",
					"text": "Print"
				},
				{
					"icon": "sap-icon://share",
					"text": "Share"
				}
			]
		});
		this.addRow("root", "relationship_0", {
			"text": "TC_Relationship_Display",
			"status": 1,
			"type": "TOL",
			"id": "0048",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.20"
		});
		this.addRowNode("relationship_0", "relationship_0_phase", "phase", {
			"startTime": "20150101000000",
			"endTime": "20150120000000",
			"status": 1,
			"tooltip": "Project Header",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_0", {
			"text": "Task 1",
			"status": 1,
			"id": "0049",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_0", "relationship_0_0_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 1",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_01", {
			"text": "Task 2",
			"status": 1,
			"id": "0050",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_01", "relationship_0_01_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 2",
			"type": 1
		});
		this.addRow("relationship_0_01", "relationship_0_01_0", {
			"text": "Task 1.1",
			"status": 1,
			"id": "0057",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.10"
		});
		this.addRowNode("relationship_0_01_0", "relationship_0_01_0_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150110000000",
			"status": 1,
			"tooltip": "Task 1.1",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_02", {
			"text": "Task 3",
			"status": 1,
			"id": "0051",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_02", "relationship_0_02_activity_1", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"id": "0051-1",
			"status": 1,
			"tooltip": "Task 3 rls 1",
			"type": 1
		});
		this.addRowNode("relationship_0_02", "relationship_0_02_activity_2", "activity", {
			"startTime": "20150106000000",
			"endTime": "20150110000000",
			"id": "0051-2",
			"status": 1,
			"tooltip": "Task 3 rls 2",
			"type": 1
		});
		this.addRowNode("relationship_0_02", "relationship_0_02_activity_3", "activity", {
			"startTime": "20150112000000",
			"endTime": "20150115000000",
			"id": "0051-3",
			"status": 1,
			"tooltip": "Task 3 rls 3",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_03", {
			"text": "Task 4",
			"status": 1,
			"id": "0052",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.05",
			"endTime": "2015.01.09"
		});
		this.addRowNode("relationship_0_03", "relationship_0_03_activity", "activity", {
			"startTime": "20150105000000",
			"endTime": "20150109000000",
			"status": 1,
			"tooltip": "Task 4",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_04", {
			"text": "Task 5",
			"status": 1,
			"id": "0053",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_04", "relationship_0_04_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 5",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_05", {
			"text": "Task 6",
			"status": 1,
			"id": "0054",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_05", "relationship_0_05_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 6",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_06", {
			"text": "Task 7",
			"status": 1,
			"id": "0055",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_06", "relationship_0_06_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 7",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_07", {
			"text": "Task 8",
			"status": 1,
			"id": "0056",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_07", "relationship_0_07_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 8.1",
			"type": 1
		});
		this.addRowNode("relationship_0_07", "relationship_0_07_task", "task", {
			"startTime": "20150111000000",
			"endTime": "20150115000000",
			"status": 1,
			"tooltip": "Task 8.2",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_08", {
			"text": "Task 9",
			"status": 1,
			"id": "0058",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_08", "relationship_0_08_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 9",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_09", {
			"text": "Task 10",
			"status": 1,
			"id": "0059",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_09", "relationship_0_09_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 10",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_1", {
			"text": "Task 11",
			"status": 1,
			"id": "0149",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_1", "relationship_0_1_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 11",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_11", {
			"text": "Task 12",
			"status": 1,
			"id": "0150",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_11", "relationship_0_11_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 12",
			"type": 1
		});
		this.addRow("relationship_0_11", "relationship_0_11_0", {
			"text": "Task 11.1",
			"status": 1,
			"id": "0157",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.10"
		});
		this.addRowNode("relationship_0_11_0", "relationship_0_11_0_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150110000000",
			"status": 1,
			"tooltip": "Task 11.1",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_12", {
			"text": "Task 13",
			"status": 1,
			"id": "0151",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_12", "relationship_0_12_activity_1", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"id": "0151-1",
			"status": 1,
			"tooltip": "Task 13 rls 1",
			"type": 1
		});
		this.addRowNode("relationship_0_12", "relationship_0_12_activity_2", "activity", {
			"startTime": "20150106000000",
			"endTime": "20150110000000",
			"id": "0151-2",
			"status": 1,
			"tooltip": "Task 13 rls 2",
			"type": 1
		});
		this.addRowNode("relationship_0_12", "relationship_0_12_activity_3", "activity", {
			"startTime": "20150112000000",
			"endTime": "20150115000000",
			"id": "0151-3",
			"status": 1,
			"tooltip": "Task 13 rls 3",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_13", {
			"text": "Task 14",
			"status": 1,
			"id": "0152",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.05",
			"endTime": "2015.01.09"
		});
		this.addRowNode("relationship_0_13", "relationship_0_13_activity", "activity", {
			"startTime": "20150105000000",
			"endTime": "20150109000000",
			"status": 1,
			"tooltip": "Task 14",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_14", {
			"text": "Task 15",
			"status": 1,
			"id": "0153",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_04", "relationship_0_04_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 15",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_15", {
			"text": "Task 16",
			"status": 1,
			"id": "0154",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_15", "relationship_0_15_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 16",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_16", {
			"text": "Task 17",
			"status": 1,
			"id": "0155",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_16", "relationship_0_16_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 17",
			"type": 1
		});
		this.addRow("relationship_0", "relationship_0_17", {
			"text": "Task 18",
			"status": 1,
			"id": "0156",
			"type": "TOL",
			"selected": false,
			"startTime": "2015.01.01",
			"endTime": "2015.01.05"
		});
		this.addRowNode("relationship_0_17", "relationship_0_17_activity", "activity", {
			"startTime": "20150101000000",
			"endTime": "20150105000000",
			"status": 1,
			"tooltip": "Task 18.1",
			"type": 1
		});
		this.addRowNode("relationship_0_17", "relationship_0_17_task", "task", {
			"startTime": "20150111000000",
			"endTime": "20150115000000",
			"status": 1,
			"tooltip": "Task 18.2",
			"type": 1
		});
		this.addRowNode("root", "relationships_0", "relationships", {
			"fromDataId": "0049",
			"fromObjectPath": "0049",
			"toDataId": "0050",
			"toObjectPath": "0050",
			"relation_type": 0,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Finish",
			"id": "rls000"
		});
		this.addRowNode("root", "relationships_0", "relationships", {
			"fromDataId": "0049",
			"fromObjectPath": "0049",
			"toDataId": "0053",
			"toObjectPath": "0053",
			"relation_type": 0,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Finish",
			"id": "rls100"
		});
		this.addRowNode("root", "relationships_01", "relationships", {
			"fromDataId": "0050",
			"fromObjectPath": "0050",
			"toDataId": "0051-1",
			"toObjectPath": "0051",
			"relation_type": 0,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Finish",
			"id": "rls001"
		});
		this.addRowNode("root", "relationships_02", "relationships", {
			"fromDataId": "0051",
			"fromObjectPath": "0051",
			"toDataId": "0052",
			"toObjectPath": "0052",
			"relation_type": 1,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Start",
			"id": "rls002"
		});
		this.addRowNode("root", "relationships_03", "relationships", {
			"fromDataId": "0053",
			"fromObjectPath": "0053",
			"toDataId": "0054",
			"toObjectPath": "0054",
			"relation_type": 2,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Start-to-Finish",
			"id": "rls003"
		});
		this.addRowNode("root", "relationships_04", "relationships", {
			"fromDataId": "0055",
			"fromObjectPath": "0055",
			"toDataId": "0056",
			"toObjectPath": "0056",
			"relation_type": 3,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Start-to-Start",
			"id": "rls004"
		});
		this.addRowNode("root", "relationships_05", "relationships", {
			"fromDataId": "0057",
			"fromObjectPath": "0057",
			"toDataId": "0050",
			"toObjectPath": "0050",
			"relation_type": 1,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Start",
			"id": "rls005"
		});
		this.addRowNode("root", "relationships_06", "relationships", {
			"fromDataId": "0057",
			"fromObjectPath": "0057",
			"toDataId": "0049",
			"toObjectPath": "0049",
			"relation_type": 1,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Start",
			"id": "rls006"
		});
		this.addRowNode("root", "relationships_07", "relationships", {
			"fromDataId": "0056",
			"fromObjectPath": "0056",
			"toDataId": "0056",
			"toObjectPath": "0056",
			"relation_type": 1,
			"fromShapeId": "ActivityKey",
			"toShapeId": "task",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Start",
			"id": "rls007"
		});
		this.addRowNode("root", "relationships_08", "relationships", {
			"fromDataId": "0051-2",
			"fromObjectPath": "0051",
			"toDataId": "0051-3",
			"toObjectPath": "0051",
			"relation_type": 1,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Start",
			"id": "rls008"
		});
		this.addRowNode("root", "relationships_09", "relationships", {
			"fromDataId": "0051-1",
			"fromObjectPath": "0051",
			"toDataId": "0051-2",
			"toObjectPath": "0051",
			"relation_type": 1,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Start",
			"id": "rls009"
		});
		return this;
	};

	return RELDataMaker;
}, true);
