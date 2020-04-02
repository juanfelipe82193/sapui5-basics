sap.ui.define(["./DataMaker"], function (DataMaker) {
	"use strict";

	function TOLDataMaker(sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil) {
		DataMaker.call(this, sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil);
	}
	TOLDataMaker.prototype = new DataMaker();

	TOLDataMaker.prototype.makeData = function () {

		this._createHierarchyResource({ id: "root", type: "root" });
		this.addToolbarSchemeToHierarchy({
			"type": "1",
			"text": "Order 1"
		});
		this.addToolbarSchemeToHierarchy({
			"type": "1",
			"text": "Order 2"
		});
		this.addToolbarSchemeToHierarchy({
			"type": "5",
			"eventId": "Selections",
			"buttons": [
				{
					"eventId": "None",
					"text": "Selection Change",
					"tooltip": "Selection Change"
				},
				{
					"eventId": "SEL_SHAPES_ROW",
					"text": "Select Shapes in Row",
					"tooltip": "Select Shapes in Row"
				},
				{
					"eventId": "GET_SEL_SHAPES",
					"text": "Get Selected Shapes",
					"tooltip": "Get Selected Shapes"
				},
				{
					"eventId": "SEL_RLS",
					"text": "Select Relationships",
					"tooltip": "Select Relationships"
				},
				{
					"eventId": "GET_SEL_RLS",
					"text": "Get Selected Relationships",
					"tooltip": "Get Selected Relationships"
				},
				{
					"eventId": "RESET_RSL_SEL",
					"text": "Reset Relationship Selection",
					"tooltip": "Reset Relationship Selection"
				}
			]
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
		this.addRow("root", "order_0", {
			"uuid": "01_0",
			"status": 2,
			"start_loc_id": "WDF",
			"end_loc_id": "BERLIN",
			"id": "0000",
			"type": "TOL",
			"selected": false,
			"startTime": "2014.09.20",
			"endTime": "2014.09.23"
		});
		this.addRowNode("order_0", "order_0_order_0", "order", {
			"startTime": "20140920000000",
			"endTime": "20140923000000",
			"status": 2,
			"type": "TOL",
			"id": "order1",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("order_0", "order_0_activity", "activity", 3, 3, {
			"startTime": "20140920000000",
			"endTime": "20140921000000",
			"status": 2,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "order_01", {
			"uuid": "01_1",
			"status": 2,
			"start_loc_id": "PARIS",
			"end_loc_id": "LISBON",
			"id": "0001",
			"type": "TOL",
			"selected": false,
			"startTime": "2014.09.29",
			"endTime": "2014.10.12"
		});
		this.addRowNode("order_01", "order_01_order", "order", {
			"startTime": "20140929000000",
			"endTime": "20141012000000",
			"status": 1,
			"type": "TOL",
			"id": "order2",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("order_01", "order_01_activity", "activity", 1, 3, {
			"startTime": "20140929000000",
			"endTime": "20140931000000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "order_02", {
			"uuid": "01_2",
			"status": 1,
			"start_loc_id": "WDF",
			"end_loc_id": "BERLIN",
			"id": "0002",
			"type": "TOL",
			"selected": false,
			"startTime": "2014.09.27",
			"endTime": "2014.10.09"
		});
		this.addRowNode("order_02", "order_02_order_0", "order", {
			"startTime": "20140927000000",
			"endTime": "20141009000000",
			"status": 1,
			"type": "TOL",
			"id": 3
		});
		this.addRowNodeByGroup("order_02", "order_02_activity", "activity", 2, 3, {
			"startTime": "20140927000000",
			"endTime": "20140929000000",
			"status": 1,
			"type": 3,
			"tooltip": "Activity"
		});
		this.addRow("root", "order_03", {
			"uuid": "01_3",
			"status": 2,
			"start_loc_id": "MOSCOW",
			"end_loc_id": "PARIS",
			"id": "0003",
			"type": "TOL",
			"selected": false,
			"startTime": "2014.09.30",
			"endTime": "2014.10.15"
		});
		this.addRowNode("order_03", "order_03_order_0", "order", {
			"startTime": "20140930000000",
			"endTime": "20141015000000",
			"status": 0,
			"type": "TOL",
			"id": 4,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("order_03", "order_03_activity", "activity", 1, 5, {
			"startTime": "20140930000000",
			"endTime": "20141012000000",
			"status": 2,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "order_04", {
			"uuid": "01_4",
			"status": 2,
			"start_loc_id": "BERLIN",
			"end_loc_id": "WDF",
			"id": "0004",
			"type": "TOL",
			"selected": false,
			"startTime": "2014.10.05",
			"endTime": "2014.10.25"
		});
		this.addRowNode("order_04", "order_04_order_0", "order", {
			"startTime": "20141005000000",
			"endTime": "20141025000000",
			"status": 0,
			"type": "TOL",
			"id": 5,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("order_04", "order_04_activity", "activity", 3, 2, {
			"startTime": "20141005000000",
			"endTime": "20141007000000",
			"status": 0,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "order_05", {
			"uuid": "01_5",
			"status": 1,
			"start_loc_id": "WDF",
			"end_loc_id": "LISBON",
			"id": "0005",
			"type": "TOL",
			"selected": false,
			"startTime": "2014.09.24",
			"endTime": "2014.10.18"
		});
		this.addRowNode("order_05", "order_05_order_0", "order", {
			"startTime": "20140924000000",
			"endTime": "20141018000000",
			"status": 1,
			"type": "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("order_05", "order_05_activity", "activity", 1, 2, {
			"startTime": "20140924000000",
			"endTime": "20140925000000",
			"status": 1,
			"type": 0,
			"tooltip": "Activity"
		});
		this.addRow("root", "order_06", {
			"uuid": "01_6",
			"status": 2,
			"start_loc_id": "BERLIN",
			"end_loc_id": "WDF",
			"id": "0006",
			"type": "TOL",
			"selected": false,
			"startTime": "2014.09.25",
			"endTime": "2014.10.26"
		});
		this.addRowNode("order_06", "order_06_order_0", "order", {
			"startTime": "20140925000000",
			"endTime": "20141026000000",
			"status": 1,
			"type": "TOL",
			"id": 7,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("order_06", "order_06_activity", "activity", 3, 1, {
			"startTime": "20140925020000",
			"endTime": "20140926010000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "order_07", {
			"uuid": "01_7",
			"status": 0,
			"start_loc_id": "PARIS",
			"end_loc_id": "FRANKFURT",
			"id": "0007",
			"type": "TOL",
			"selected": false,
			"startTime": "2014.09.22",
			"endTime": "2014.09.26"
		});
		this.addRowNode("order_07", "order_07_0", "order", {
			"startTime": "20140922000000",
			"endTime": "20140926000000",
			"status": 1,
			"type": "TOL",
			"id": 8,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("order_07", "order_07_activity", "activity", {
			"startTime": "20140922020000",
			"endTime": "20140923020000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "order_08", {
			"uuid": "01_8",
			"status": 2,
			"start_loc_id": "BERLIN",
			"end_loc_id": "WDF",
			"id": "0008",
			"type": "TOL",
			"selected": false,
			"startTime": "2014.09.25",
			"endTime": "2014.10.26"
		});
		this.addRowNode("order_08", "order_08_order_0", "order", {
			"startTime": "20140925000000",
			"endTime": "20141026000000",
			"status": 1,
			"type": "TOL",
			"id": 9,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("order_08", "order_08_activity", "activity", 1, 3, {
			"startTime": "20140925020000",
			"endTime": "20140926010000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "order_09", {
			"uuid": "01_9",
			"status": 2,
			"start_loc_id": "BERLIN",
			"end_loc_id": "WDF",
			"id": "0009",
			"type": "TOL",
			"selected": false,
			"startTime": "2014.09.25",
			"endTime": "2014.10.26"
		});
		this.addRowNode("order_09", "order_09_order_0", "order", {
			"startTime": "20140925000000",
			"endTime": "20141026000000",
			"status": 1,
			"type": "TOL",
			"id": 10,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("order_09", "order_09_activity", "activity", 3, 3, {
			"startTime": "20140925020000",
			"endTime": "20140926010000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "order_10", {
			"uuid": "01_10",
			"status": 2,
			"start_loc_id": "BERLIN",
			"end_loc_id": "WDF",
			"id": "00010",
			"type": "TOL",
			"selected": false,
			"startTime": "2014.09.25",
			"endTime": "2014.10.26"
		});
		this.addRowNode("order_10", "order_10_order_0", "order", {
			"startTime": "20140925000000",
			"endTime": "20141026000000",
			"status": 1,
			"type": "TOL",
			"id": 11,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("order_10", "order_10_activity", "activity", 2, 3, {
			"startTime": "20140925020000",
			"endTime": "20140926010000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "order_11", {
			"uuid": "01_11",
			"status": 2,
			"start_loc_id": "BERLIN",
			"end_loc_id": "WDF",
			"id": "00011",
			"type": "TOL",
			"selected": false,
			"startTime": "2014.09.25",
			"endTime": "2014.10.26"
		});
		this.addRowNode("order_11", "order_11_order_0", "order", {
			"startTime": "20140925000000",
			"endTime": "20141026000000",
			"status": 1,
			"type": "TOL",
			"id": 12,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("order_11", "order_11_activity", "activity", 1, 5, {
			"startTime": "20140925020000",
			"endTime": "20140926010000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRowNode("root", "relationship_0", "relationships", {
			"fromDataId": "0000",
			"fromObjectPath": "0000",
			"toDataId": "0001",
			"toObjectPath": "0001",
			"relation_type": 1,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Start",
			"id": "rls001"
		});
		this.addRowNode("root", "relationship-1", "relationships", {
			"fromDataId": "0000",
			"fromObjectPath": "0000",
			"toDataId": "0002",
			"toObjectPath": "0002",
			"relation_type": 1,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Start",
			"id": "rls002"
		});
		this.addRowNode("root", "relationship-1", "relationships", {
			"fromDataId": "0002",
			"fromObjectPath": "0002",
			"toDataId": "0003",
			"toObjectPath": "0003",
			"relation_type": 1,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Start",
			"id": "rls003"
		});
		this.addRowNode("root", "relationship-1", "relationships", {
			"fromDataId": "0002",
			"fromObjectPath": "0002",
			"toDataId": "0004",
			"toObjectPath": "0004",
			"relation_type": 1,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Start",
			"id": "rls004"
		});
		this.addRowNode("root", "relationship-1", "relationships", {
			"fromDataId": "0007",
			"fromObjectPath": "0007",
			"toDataId": "0008",
			"toObjectPath": "0008",
			"relation_type": 3,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Start-to-Start",
			"id": "rls005"
		});
		this.addRowNode("root", "relationship-1", "relationships", {
			"fromDataId": "0000",
			"fromObjectPath": "0000",
			"toDataId": "00011",
			"toObjectPath": "00011",
			"relation_type": 1,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Start",
			"id": "rls006"
		});
		return this;

	};

	return TOLDataMaker;
}, true);
