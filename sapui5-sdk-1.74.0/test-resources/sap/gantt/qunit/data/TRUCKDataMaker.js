sap.ui.define(["./DataMaker"], function (DataMaker) {
	"use strict";

	function TRUCKDataMaker(sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil) {
		DataMaker.call(this, sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil);
	}
	TRUCKDataMaker.prototype = new DataMaker();

	TRUCKDataMaker.prototype.makeData = function () {

		this._createHierarchyResource({ id: "root", type: "root" });
		this.addToolbarSchemeToHierarchy({
			"type": "1",
			"text": "Truck 1"
		});
		this.addToolbarSchemeToHierarchy({
			"type": "1",
			"text": "Truck 2"
		});
		this.addToolbarSchemeToHierarchy({
			"type": "5",
			"buttons": [
				{
					"icon": "sap-icon://flight",
					"text": "Flight"
				},
				{
					"icon": "sap-icon://taxi",
					"text": "Taxi"
				}
			]
		});
		this.addRow("root", "truck_0", {
			"text": "truck01_0",
			"plate": "EF20110",
			"plate_expire": "20200819000000",
			"id": "0000",
			"type": "01",
			"selected": false
		});
		this.addRowNode("truck_0", "truck_0_order_0", "order", {
			"startTime": "20140920000000",
			"endTime": "20141012000000",
			"status": 2,
			"type": "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("truck_0", "truck_0_activity", "activity", 2, 1, {
			"startTime": "20140920000000",
			"endTime": "20140922000000",
			"status": 2,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "truck_01", {
			"text": "truck01_1",
			"plate": "EF20112",
			"plate_expire": "20201219000000",
			"id": "0001",
			"type": "01",
			"selected": false
		});
		this.addRowNode("truck_01", "truck_01_order_0", "order", {
			"startTime": "20140929000000",
			"endTime": "20141012000000",
			"status": 1,
			"type": "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("truck_01", "truck_01_activity", "activity", 1, 3, {
			"startTime": "20140929000000",
			"endTime": "20140931000000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "truck_02", {
			"text": "truck01_2",
			"plate": "EF21110",
			"plate_expire": "20211409000000",
			"id": "0002",
			"type": "01",
			"selected": false
		});
		this.addRowNode("truck_02", "truck_02_order_0", "order", {
			"startTime": "20140927000000",
			"endTime": "20141009000000",
			"status": 1,
			"type": "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("truck_02", "truck_02_activity", "activity", 1, 3, {
			"startTime": "20140927000000",
			"endTime": "20140929000000",
			"status": 1,
			"type": 3,
			"tooltip": "Activity"
		});
		this.addRow("root", "truck_03", {
			"text": "truck01_3",
			"plate": "EF20115",
			"plate_expire": "20151109000000",
			"id": "0003",
			"type": "01",
			"selected": false
		});
		this.addRowNode("truck_03", "truck_03_order_0", "order", {
			"startTime": "20140930000000",
			"endTime": "20141015000000",
			"status": 0,
			"type": "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("truck_03", "truck_03_activity", "activity", 1, 2, {
			"startTime": "20140930000000",
			"endTime": "20141012000000",
			"status": 2,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "truck_04", {
			"text": "truck01_4",
			"plate": "EG20110",
			"plate_expire": "20180518000000",
			"id": "0004",
			"type": "01",
			"selected": false
		});
		this.addRowNode("truck_04", "truck_04_order_0", "order", {
			"startTime": "20141010000000",
			"endTime": "20141024000000",
			"status": 0,
			"type": "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("truck_04", "truck_04_activity", "activity", 1, 4, {
			"startTime": "20141010000000",
			"endTime": "20141012000000",
			"status": 0,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "truck_05", {
			"text": "truck01_5",
			"plate": "EF23110",
			"plate_expire": "20300706000000",
			"id": "0005",
			"type": "01",
			"selected": false
		});
		this.addRowNode("truck_05", "truck_05_order_0", "order", {
			"startTime": "20141014000000",
			"endTime": "20141026000000",
			"status": 1,
			"type": "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("truck_05", "truck_05_activity", "activity", 2, 3, {
			"startTime": "20141014000000",
			"endTime": "20141015000000",
			"status": 1,
			"type": 0,
			"tooltip": "Activity"
		});
		this.addRow("root", "truck_06", {
			"text": "truck01_6",
			"plate": "EF20117",
			"plate_expire": "20151023000000",
			"id": "0006",
			"type": "01",
			"selected": false
		});
		this.addRowNode("truck_06", "truck_06_order_0", "order", {
			"startTime": "20140925000000",
			"endTime": "20141016000000",
			"status": 1,
			"type": "TOL",
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("truck_06", "truck_06_activity", "activity", 2, 5, {
			"startTime": "20140925020000",
			"endTime": "20140925100000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "truck_07", {
			"text": "truck01_7",
			"plate": "EF20120",
			"plate_expire": "20210305000000",
			"id": "0007",
			"type": "01",
			"selected": false
		});
		this.addRowNode("truck_07", "truck_07_order_0", "order", {
			"startTime": "20140922000000",
			"endTime": "20141016000000",
			"status": 1,
			"type": "TOL",
			"id": 8,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("truck_07", "truck_07_activity", "activity", 1, 6, {
			"startTime": "20140922020000",
			"endTime": "20140923020000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "truck_08", {
			"text": "truck01_8",
			"plate": "EF20120",
			"plate_expire": "20210305000000",
			"id": "0008",
			"type": "01",
			"selected": false
		});
		this.addRowNode("truck_08", "truck_08_order_0", "order", {
			"startTime": "20140922000000",
			"endTime": "20141016000000",
			"status": 1,
			"type": "TOL",
			"id": 9,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("truck_08", "truck_08_activity", "activity", 1, 5, {
			"startTime": "20140922020000",
			"endTime": "20140923020000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "truck_09", {
			"text": "truck01_9",
			"plate": "EF20120",
			"plate_expire": "20210305000000",
			"id": "0009",
			"type": "01",
			"selected": false
		});
		this.addRowNode("truck_09", "truck_09_order_0", "order", {
			"startTime": "20140922000000",
			"endTime": "20141016000000",
			"status": 1,
			"type": "TOL",
			"id": 10,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("truck_09", "truck_09_activity", "activity", 3, 3, {
			"startTime": "20140922020000",
			"endTime": "20140923020000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "truck_10", {
			"text": "truck01_10",
			"plate": "EF20120",
			"plate_expire": "20210305000000",
			"id": "00010",
			"type": "01",
			"selected": false
		});
		this.addRowNode("truck_10", "truck_10_order_0", "order", {
			"startTime": "20140922000000",
			"endTime": "20141016000000",
			"status": 1,
			"type": "TOL",
			"id": 11,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("truck_10", "truck_10_activity", "activity", 2, 3, {
			"startTime": "20140922020000",
			"endTime": "20140923020000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addRow("root", "truck_11", {
			"text": "truck01_11",
			"plate": "EF20120",
			"plate_expire": "20210305000000",
			"id": "00011",
			"type": "01",
			"selected": false
		});
		this.addRowNode("truck_11", "truck_11_order_0", "order", {
			"startTime": "20140922000000",
			"endTime": "20141016000000",
			"status": 1,
			"type": "TOL",
			"id": 12,
			"tooltip": "TOL Order"
		});
		this.addRowNodeByGroup("truck_11", "truck_11_activity", "activity", 1, 6, {
			"startTime": "20140922020000",
			"endTime": "20140923020000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		this.addCalendarToHierarchy("twoDaysAWeek", 20, {
			"startTime": "20140920000000",
			"endTime": "20141012000000"
		});
		this.addRowNode("truck_0", "truck_0_nwt", "nwt", { id: "twoDaysAWeek" });
		this.addRowNode("truck_02", "truck_02_nwt", "nwt", { id: "twoDaysAWeek" });
		this.addRowNode("truck_03", "truck_03_nwt", "nwt", { id: "twoDaysAWeek" });
		this.addRowNode("truck_05", "truck_05_nwt", "nwt", { id: "twoDaysAWeek" });
		this.addRowNode("truck_07", "truck_07_nwt", "nwt", { id: "twoDaysAWeek" });
		return this;

	};

	return TRUCKDataMaker;
}, true);
