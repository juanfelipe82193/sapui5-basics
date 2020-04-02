sap.ui.define(["./DataMaker"], function (DataMaker) {
	"use strict";

	function TRUCKNOTOOLBARDataMaker(sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil) {
		DataMaker.call(this, sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil);
	}
	TRUCKNOTOOLBARDataMaker.prototype = new DataMaker();

	TRUCKNOTOOLBARDataMaker.prototype.makeData = function () {

		this._createHierarchyResource({ id: "root", type: "root" });
		this.addRow("root", "truck_0", {
			"text": "truck01_0",
			"plate": "HC11111",
			"plate_expire": "20200819000000",
			"id": "0000",
			"type": "01",
			"subType": "01",
			"selected": false
		});
		this.addRowNode("truck_0", "truck_0_order", "order", {
			"startTime": "20140919000000",
			"endTime": "20141012000000",
			"status": 2,
			"type": "TOL",
			"tooltip": "Order - First",
			"id": "order1",
			"selected": false
		});
		this.addRowNodeByGroup("truck_0", "truck_0_activity", "activity", 1, 3, {
			"startTime": "20140919000000",
			"endTime": "20140921000000",
			"status": 2,
			"type": 1,
			"tooltip": "Activity - First"
		});
		this.addRow("truck_0", "truck_0_0", {
			"uuid": "sub_01_0_1",
			"name": "Ethan",
			"id": "00001",
			"type": "04",
			"selected": false
		});
		this.addRowNode("truck_0_0", "truck_0_0_order", "order", {
			"startTime": "20140929000000",
			"endTime": "20141012000000",
			"status": 2,
			"type": "TOL",
			"id": 2,
			"tooltip": "Order",
			"description": "This is a long description [1]. This is a long description [2]. This is a long description [3]. This is a long description [4]. This is a long description [5]."
		});
		this.addRowNodeByGroup("truck_0_0", "truck_0_0_activity", "activity", 2, 2, {
			"startTime": "20140929000000",
			"endTime": "20140930000000",
			"status": 2,
			"tooltip": "Activity",
			"type": 1
		});
		this.addRow("root", "truck_01", {
			"text": "truck01_1",
			"plate": "HA12345",
			"plate_expire": "20201219000000",
			"id": "0001",
			"type": "02",
			"subType": "02",
			"selected": false
		});
		this.addRowNode("truck_01", "truck_01_order", "order", {
			"startTime": "20140921000000",
			"endTime": "20141022000000",
			"status": 1,
			"type": "TOL",
			"tooltip": "Order",
			"id": 3
		});
		this.addRowNodeByGroup("truck_01", "truck_01_activity", "activity", 2, 3, {
			"startTime": "20140921000000",
			"endTime": "20140923000000",
			"status": 1,
			"type": 1,
			"util": 60,
			"tooltip": "Activity - First\nSecond row of tooltip"
		});
		this.addRow("truck_01", "truck_01_0", {
			"text": "sub_01_1_1",
			"plate": "G54321",
			"plate_expire": "20211409000000",
			"id": "00011",
			"type": "02",
			"selected": false
		});
		this.addRowNode("truck_01_0", "truck_01_0_order", "order", {
			"startTime": "20140929000000",
			"endTime": "20141020000000",
			"status": 1,
			"type": "TOL",
			"tooltip": "Order",
			"id": 4
		});
		this.addRowNodeByGroup("truck_01_0", "truck_01_0_activity", "activity", 2, 2, {
			"startTime": "20140929000000",
			"endTime": "20140931000000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity",
			"util": 23
		});
		this.addRow("truck_01", "truck_01_1", {
			"text": "sub_01_1_2",
			"name": "Patric",
			"id": "00012",
			"type": "04",
			"selected": false
		});
		this.addRowNode("truck_01_1", "truck_01_1_order", "order", {
			"startTime": "20140924000000",
			"endTime": "20140930000000",
			"status": 1,
			"type": "TOL",
			"tooltip": "Order",
			"id": 5
		});
		this.addRowNodeByGroup("truck_01_1", "truck_01_1_activity", "activity", 1, 3, {
			"startTime": "20140924000000",
			"endTime": "20140926000000",
			"status": 1,
			"tooltip": "Activity",
			"type": 1
		});
		this.addRow("root", "truck_02", {
			"text": "01_2",
			"plate": "SJ29384",
			"plate_expire": "20211409000000",
			"id": "0002",
			"type": "01",
			"subType": "01",
			"selected": false
		});
		this.addRowNode("truck_02", "truck_02_order", "order", {
			"startTime": "20140927000000",
			"endTime": "20141009000000",
			"status": 1,
			"type": "TOL",
			"tooltip": "Order",
			"id": 6
		});
		this.addRowNodeByGroup("truck_02", "truck_02_activity", "activity", 2, 2, {
			"startTime": "20140927000000",
			"endTime": "20140929000000",
			"status": 1,
			"type": 3,
			"tooltip": "中文提示\n详细说明。。。\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n."
		});
		this.addRow("root", "truck_03", {
			"text": "01_3",
			"plate": "HC29986",
			"plate_expire": "20151109000000",
			"id": "0003",
			"type": "01",
			"subType": "02",
			"selected": false
		});
		this.addRowNode("truck_03", "truck_03_order", "order", {
			"startTime": "20140930000000",
			"endTime": "20141015000000",
			"status": 0,
			"type": "TOL",
			"tooltip": "Order",
			"id": 7
		});
		this.addRowNodeByGroup("truck_03", "truck_03_activity", "activity", 1, 2, {
			"startTime": "20140930000000",
			"endTime": "20141002000000",
			"status": 2,
			"tooltip": "Activity",
			"type": 1
		});
		this.addRow("truck_03", "truck_03_0", {
			"text": "sub_01_3_1",
			"name": "Martin",
			"id": "00031",
			"type": "04",
			"selected": false
		});
		this.addRowNode("truck_03_0", "truck_03_0_order", "order", {
			"startTime": "20140930000000",
			"endTime": "20141015000000",
			"status": 0,
			"type": "TOL",
			"tooltip": "Order",
			"id": 8
		});
		this.addRowNodeByGroup("truck_03_0", "truck_03_0_activity", 1, 5, {
			"startTime": "20140930000000",
			"endTime": "20141003000000",
			"status": 2,
			"type": 1
		});
		this.addRow("truck_03_0", "truck_03_0_0", {
			"text": "sub_sub_01_3_1",
			"name": "Martin 2",
			"id": "000311",
			"type": "04",
			"selected": false
		});
		this.addRowNode("truck_03_0_0", "truck_03_0_0_order", "order", {
			"startTime": "20140931000000",
			"endTime": "20141015000000",
			"status": 0,
			"type": "TOL",
			"tooltip": "Order",
			"id": 9
		});
		this.addRowNodeByGroup("truck_03_0_0", "truck_03_0_0_activity", "activity", {
			"startTime": "20140931000000",
			"endTime": "20141012000000",
			"status": 2,
			"tooltip": "Activity",
			"type": 1
		});
		this.addRow("truck_03_0", "truck_03_0_1", {
			"text": "sub_01_3_2",
			"plate": "LU-98376",
			"id": "00032",
			"type": "02",
			"selected": false
		});
		this.addRowNode("truck_03_0_1", "truck_03_0_1_order", "order", {
			"startTime": "20140928000000",
			"endTime": "20141015000000",
			"status": 0,
			"type": "TOL",
			"tooltip": "Order",
			"id": 10
		});
		this.addRowNodeByGroup("truck_03_0_1", "truck_03_0_1_activity", "activity", {
			"startTime": "20140928000000",
			"endTime": "20141002000000",
			"status": 2,
			"type": 1
		});
		this.addRow("root", "truck_04", {
			"text": "01_4",
			"plate": "HE-98763",
			"plate_expire": "20180518000000",
			"id": "0004",
			"type": "01",
			"subType": "01",
			"selected": false
		});
		this.addRowNode("truck_04", "truck_04_order", "order", {
			"startTime": "20140920000000",
			"endTime": "20141009000000",
			"status": 0,
			"type": "TOL",
			"tooltip": "Order",
			"id": 11
		});
		this.addRowNodeByGroup("truck_04", "truck_04_activity", "activity", 1, 5, {
			"startTime": "20140920000000",
			"endTime": "20140922000000",
			"status": 0,
			"tooltip": "Activity",
			"type": 1
		});
		this.addRow("root", "truck_05", {
			"text": "01_5",
			"plate": "J-A00000",
			"plate_expire": "20300706000000",
			"id": "0005",
			"type": "01",
			"subType": "01",
			"selected": false
		});
		this.addRowNode("truck_05", "truck_05_order", "order", {
			"startTime": "20140922000000",
			"endTime": "20140928000000",
			"status": 1,
			"type": "TOL",
			"tooltip": "Order",
			"id": 12
		});
		this.addRowNodeByGroup("truck_05", "truck_05_activity", "activity", 2, 2, {
			"startTime": "20140922000000",
			"endTime": "20140925000000",
			"status": 1,
			"type": 0,
			"tooltip": "Activity",
			"util": 87
		});
		this.addRow("truck_05", "truck_05_0", {
			"text": "sub_01_5_1",
			"name": "Robin_1",
			"id": "00051",
			"type": "03",
			"selected": false
		});
		this.addRowNode("truck_05_0", "truck_05_0_order", "order", {
			"startTime": "20140930000000",
			"endTime": "20141015000000",
			"status": 0,
			"type": "TOL",
			"tooltip": "Order",
			"id": 51
		});
		this.addRowNodeByGroup("truck_05_0", "truck_05_0_activity", "activity", 1, 4, {
			"startTime": "20140930000000",
			"endTime": "20141003000000",
			"status": 2,
			"tooltip": "Activity",
			"type": 1
		});
		this.addRow("truck_05_0", "truck_05_0_0", {
			"text": "sub_sub_01_5_1",
			"name": "Robin_2",
			"id": "000511",
			"type": "04",
			"selected": false
		});
		this.addRowNode("truck_05_0_0", "truck_05_0_0_order", "order", {
			"startTime": "20140931000000",
			"endTime": "20141015000000",
			"status": 0,
			"type": "TOL",
			"tooltip": "Order",
			"id": 9
		});
		this.addRowNodeByGroup("truck_05_0_0", "truck_05_0_0_activity", "activity", 1, 3, {
			"startTime": "20140931000000",
			"endTime": "20141012000000",
			"status": 2,
			"tooltip": "Activity",
			"type": 1
		});
		this.addRow("truck_05_0", "truck_05_0_1", {
			"text": "sub_01_5_2",
			"plate": "HA-87652",
			"plate_expire": "20300706000000",
			"id": "00052",
			"type": "02",
			"selected": false
		});
		this.addRowNode("truck_05_0_1", "truck_05_0_1_order", "order", {
			"startTime": "20140928000000",
			"endTime": "20141015000000",
			"status": 0,
			"type": "TOL",
			"tooltip": "Order",
			"id": 10
		});
		this.addRowNodeByGroup("truck_05_0_1", "truck_05_0_1_activity", "activity", 2, 3, {
			"startTime": "20140928000000",
			"endTime": "20141002000000",
			"status": 2,
			"tooltip": "Activity",
			"type": 1
		});
		this.addRow("root", "truck_06", {
			"text": "01_6",
			"plate": "Y-827663",
			"id": "0006",
			"type": "01",
			"subType": "01",
			"selected": false
		});
		this.addRowNode("truck_06", "truck_06_order", "order", {
			"startTime": "20140925000000",
			"endTime": "20141026000000",
			"status": 1,
			"type": "TOL",
			"tooltip": "Order",
			"id": 13
		});
		this.addRowNodeByGroup("truck_06", "truck_06_activity", "activity", 2, 2, {
			"startTime": "20140925020000",
			"endTime": "20140928010000",
			"status": 1,
			"tooltip": "Activity",
			"type": 1
		});
		this.addRow("root", "truck_07", {
			"text": "01_7",
			"plate": "W-977662",
			"plate_expire": "20300706000000",
			"id": "0007",
			"type": "01",
			"subType": "01",
			"selected": false
		});
		this.addRowNode("truck_07", "truck_07_order", "order", {
			"startTime": "20140922000000",
			"endTime": "20140930000000",
			"status": 1,
			"type": "TOL",
			"tooltip": "Order",
			"id": 14
		});
		this.addRowNodeByGroup("truck_07", "truck_07_activity", "activity", 1, 5, {
			"startTime": "20140922020000",
			"endTime": "20140923020000",
			"status": 1,
			"tooltip": "Activity",
			"type": 1
		});
		return this;

	};

	return TRUCKNOTOOLBARDataMaker;
}, true);
