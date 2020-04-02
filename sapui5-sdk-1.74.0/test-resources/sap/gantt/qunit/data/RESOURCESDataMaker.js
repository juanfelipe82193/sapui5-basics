sap.ui.define(["./DataMaker"], function (DataMaker) {
	"use strict";

	function RESOURCESDataMaker(sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil) {
		DataMaker.call(this, sHierarchyId, oTimePattern, oInterval, oCalendarPattern, oUtil);
	}
	RESOURCESDataMaker.prototype = new DataMaker();

	RESOURCESDataMaker.prototype.makeData = function () {

		this._createHierarchyResource({
			id: "root", type: "root",
			children: [
				{ uuid: "01_0", id: "0000", type: "01", plate: "沪C11111" },
				{ uuid: "01_1", id: "0001", type: "02", plate: "沪W12141" },
				{ uuid: "01_2", id: "0002", type: "01", plate: "沪W12141", children: [{ uuid: "sub_01_2_1", id: "0003", type: "02", plate: "苏E11111" }] },
				{ uuid: "01_3", id: "0004", type: "01", plate: "沪W12141", children: [{ uuid: "sub_01_3_1", id: "0005", type: "02", plate: "苏E111122" }, { uuid: "sub_01_3_2", id: "0006", type: "04", name: "KK" }] },
				{ uuid: "01_4", id: "0007", type: "01", plate: "沪W12141" }
			]
		});
		var oToolbarScheme1 = {
			"type": "1",
			"text": "Sort",
			"eventId": "MODEL_SORT"
		};
		this.addToolbarSchemeToHierarchy(oToolbarScheme1);
		var oToolbarScheme2 = {
			"type": "5",
			"eventId": "Selections",
			"buttons": [
				{
					"eventId": "None",
					"text": "Selection Change",
					"tooltip": "Selection Change"
				},
				{
					"eventId": "SEL_SHAPES",
					"text": "Select a Shape",
					"tooltip": "Select a Shape"
				},
				{
					"eventId": "GET_SEL_SHAPES",
					"text": "Get Selected Shapes",
					"tooltip": "Get Selected Shapes"
				},
				{
					"type": "1",
					"eventId": "RESET_SHAPE_SEL",
					"text": "Reset Shape Selection",
					"tooltip": "Reset Shape Selection"
				},
				{
					"eventId": "SEL_ROWS",
					"text": "Select Rows",
					"tooltip": "Select Rows"
				},
				{
					"eventId": "GET_SEL_ROWS",
					"text": "Get Selected Rows",
					"tooltip": "Get Selected Rows"
				},
				{
					"eventId": "RES_ROW_SEL",
					"text": "Reset Row Selection",
					"tooltip": "Reset Row Selection"
				}
			]
		};
		this.addToolbarSchemeToHierarchy(oToolbarScheme2);
		var oToolbarScheme3 = {
			"type": "1",
			"text": "Filter",
			"eventId": "MODEL_FILTER"
		};
		this.addToolbarSchemeToHierarchy(oToolbarScheme3);
		//use DataProducer to create data for overlap shapes
		this.addOverlapToRow("01_0", 3, "shortage", "20151216050037");
		this.addOverlapToRow("01_1", 2, "shortage", "20151223050037");
		this.addOverlapToRow("01_2", 2, "shortage", "20151227050037");
		this.addOverlapToRow("sub_01_2_1", 2, "shortage", "20151231050037");
		this.addOverlapToRow("01_3", 2, "shortage", "20160108050037");
		this.addOverlapToRow("sub_01_3_1", 2, "shortage", "20160116050037");
		this.addOverlapToRow("sub_01_3_2", 2, "shortage", "20160124050037");
		this.addOverlapToRow("01_4", 2, "shortage", "20160131050037");

		this.addRowNode("01_0", "01_0_order_0", "order", {
			"startTime": "20140920000000",
			"endTime": "20141012000000",
			"status": 2,
			"type": "TOL",
			"id": "order1",
			"tooltip": "TOL Order"
		});
		var ulcAct100 = this.addRowNode("01_0", "01_0_activity_0", "activity", {
			"startTime": "20140920000000",
			"endTime": "20140926000000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		var ulcAct101 = this.addRowNode("01_0", "01_0_activity_1", "activity", {
			"startTime": "20140926000000",
			"endTime": "20141006000000",
			"status": 1,
			"type": 0,
			"util": 70,
			"util_volume": 111,
			"util_mass": 98,
			"tooltip": "Activity"
		});
		var ulcAct102 = this.addRowNode("01_0", "01_0_activity_2", "activity", {
			"startTime": "20141006000000",
			"endTime": "20141012000000",
			"status": 2,
			"type": 2,
			"tooltip": "Activity"
		});
		//create data for ulc
		this.addRowNode("01_0", "root-ulc_01_0", "ulc", { "rowIndex": 1 });
		this.addRowNode("root-ulc_01_0", "order_01_0", "order", {});
		this.addRowNode("order_01_0", "order-util-volume_01_0", "util", { dimension: "util_volume" });
		this.addULCToNode("order-util-volume_01_0", "order-util-volume_01_0-data", "values", [ulcAct100, ulcAct101, ulcAct102], "util_volume");
		this.addRowNode("order_01_0", "order-util-mass_01_0", "util", { dimension: "util_mass" });
		this.addULCToNode("order-util-mass_01_0", "order-util-mass_01_0-data", "values", [ulcAct100, ulcAct101, ulcAct102], "util_mass");
		this.addRowNode("01_1", "01_1_order_0", "order", {
			"startTime": "20140916000000",
			"endTime": "20141012000000",
			"status": 2,
			"type": "TOL",
			"id": 1,
			"tooltip": "TOL Order",
			"description": "This is a long description [1]. This is a long description [2]. This is a long description [3]. This is a long description [4]. This is a long description [5]. This is a long description [6]. This is a long description [7]. This is a long description [8]."
		});
		var ulcAct110 = this.addRowNode("01_1", "01_1_activity_0", "activity", {
			"startTime": "20140916000000",
			"endTime": "20140918000000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity",
			"description": "This is a long description [1]. This is a long description [2]. This is a long description [3]. This is a long description [4]. This is a long description [5]. This is a long description [6]. This is a long description [7]. This is a long description [8]."
		});
		var ulcAct111 = this.addRowNode("01_1", "01_1_activity_1", "activity", {
			"startTime": "20140918000000",
			"endTime": "20140930000000",
			"status": 1,
			"type": 0,
			"util": 70,
			"util_volume": 90,
			"util_mass": 98,
			"tooltip": "Activity"
		});
		var ulcAct112 = this.addRowNode("01_1", "01_1_activity_2", "activity", {
			"startTime": "20140930000000",
			"endTime": "20141002000000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		var ulcAct113 = this.addRowNode("01_1", "01_1_activity_3", "activity", {
			"startTime": "20141002000000",
			"endTime": "20141010000000",
			"status": 2,
			"type": 0,
			"util": 70,
			"util_volume": 120,
			"util_mass": 100,
			"tooltip": "Activity"
		});
		var ulcAct114 = this.addRowNode("01_1", "01_1_activity_4", "activity", {
			"startTime": "20141010000000",
			"endTime": "20141012000000",
			"status": 0,
			"type": 2,
			"tooltip": "Activity"
		});
		this.addRowNode("01_1", "root-ulc_01_1", "ulc", { "rowIndex": 1 });
		this.addRowNode("root-ulc_01_1", "order_01_1", "order", {});
		this.addRowNode("order_01_1", "order-util-volume_01_1", "util", { dimension: "util_volume" });
		this.addULCToNode("order-util-volume_01_1", "order-util-volume_01_1-data", "values", [ulcAct110, ulcAct111, ulcAct112, ulcAct113, ulcAct114], "util_volume");
		this.addRowNode("order_01_1", "order-util-mass_01_1", "util", { dimension: "util_mass" });
		this.addULCToNode("order-util-mass_01_1", "order-util-mass_01_1-data", "values", [ulcAct110, ulcAct111, ulcAct112, ulcAct113, ulcAct114], "util_mass");

		//Relationship of main row to expand row
		this.addRowNode("root", "relationship-1", "relationships", {
			"fromDataId": "0000",
			"fromObjectPath": "0000",
			"fromShapeId": "ActivityKey",

			"toDataId": "0000",
			"toObjectPath": "0000",
			"toExpandRowIndex": 3,
			"toShapeId": "activity_greedy",

			"relation_type": 3,
			"tooltip": "Start-to-Start",
			"style": 0,
			"stroke": "#000000",
			"id": "rls001"
		});
		//Relationship of main row to expand row
		this.addRowNode("root", "relationship-2", "relationships", {
			"fromDataId": "0000",
			"fromObjectPath": "0000",
			"fromShapeId": "ActivityKey",

			"toDataId": "0000",
			"toObjectPath": "0000",
			"toExpandRowIndex": 2,
			"toShapeId": "activity_greedy",

			"relation_type": 0,
			"tooltip": "Finish-to-Finish",
			"style": 0,
			"stroke": "#000000",
			"id": "rls002"
		});
		//Relationship of main row to main row
		this.addRowNode("root", "relationship-3", "relationships", {
			"fromDataId": "0000",
			"fromObjectPath": "0000",
			"fromShapeId": "ActivityKey",

			"toDataId": "0001",
			"toObjectPath": "0001",
			"toShapeId": "ActivityKey",

			"relation_type": 3,
			"tooltip": "Start-to-Start",
			"style": 0,
			"stroke": "#000000",
			"id": "rls003"
		});
		//Relationship of expand row to expand row
		this.addRowNode("root", "relationship-4", "relationships", {
			"fromDataId": "0000",
			"fromObjectPath": "0000",
			"fromExpandRowIndex": 2,
			"fromShapeId": "activity_greedy",

			"toDataId": "0000",
			"toObjectPath": "0000",
			"toExpandRowIndex": 3,
			"toShapeId": "activity_greedy",

			"relation_type": 2,
			"tooltip": "Start-to-Finish",
			"style": 0,
			"stroke": "#000000",
			"id": "rls004"
		});
		//Relationship of expand row to expand row
		this.addRowNode("root", "relationship-5", "relationships", {
			"fromDataId": "0000",
			"fromObjectPath": "0000",
			"fromExpandRowIndex": 3,
			"fromShapeId": "activity_greedy",

			"toDataId": "0000",
			"toObjectPath": "0000",
			"toExpandRowIndex": 4,
			"toShapeId": "activity_greedy",

			"relation_type": 1,
			"tooltip": "Finish-to-Start",
			"style": 0,
			"stroke": "#000000",
			"id": "rls005"
		});

		this.addRowNode("01_2", "01_2_order_0", "order", {
			"startTime": "20141016000000",
			"endTime": "20141102000000",
			"status": 2,
			"type": "TOL",
			"id": 1,
			"tooltip": "TOL Order"
		});
		var ulcAct120 = this.addRowNode("01_2", "01_2_activity_0", "activity", {
			"startTime": "20141016000000",
			"endTime": "20141018000000",
			"status": 2,
			"type": 1,
			"tooltip": "Activity"
		});
		var ulcAct121 = this.addRowNode("01_2", "01_2_activity_1", "activity", {
			"startTime": "20141018000000",
			"endTime": "20141030000000",
			"status": 0,
			"type": 0,
			"util": 70,
			"util_volume": 91,
			"util_mass": 78,
			"tooltip": "Activity"
		});
		var ulcAct122 = this.addRowNode("01_2", "01_2_activity_2", "activity", {
			"startTime": "20141030000000",
			"endTime": "20141102000000",
			"status": 0,
			"type": 2,
			"tooltip": "Activity"
		});
		this.addRowNode("01_2", "root-ulc_01_2", "ulc", { "rowIndex": 1 });
		this.addRowNode("root-ulc_01_2", "order_01_2", "order", {});
		this.addRowNode("order_01_2", "order-util-volume_01_2", "util", { dimension: "util_volume" });
		this.addULCToNode("order-util-volume_01_2", "order-util-volume_01_2-data", "values", [ulcAct120, ulcAct121, ulcAct122], "util_volume");
		this.addRowNode("order_01_2", "order-util-mass_01_2", "util", { dimension: "util_mass" });
		this.addULCToNode("order-util-mass_01_2", "order-util-mass_01_2-data", "values", [ulcAct120, ulcAct121, ulcAct122], "util_mass");
		this.addRowNode("sub_01_2_1", "sub_01_2_1_order_0", "order", {
			"startTime": "20140916080000",
			"endTime": "20141002023000",
			"status": 2,
			"type": "TOL",
			"id": 1,
			"tooltip": "TOL Order"
		});
		var ulcActsub110 = this.addRowNode("sub_01_2_1", "sub_01_2_1_activity_0", "activity", {
			"startTime": "20140916080000",
			"endTime": "20140918120000",
			"status": 2,
			"type": 1,
			"tooltip": "Activity very long 111111111111111111111111111111111111111111111111111111111111111111111111"
		});
		var ulcActsub111 = this.addRowNode("sub_01_2_1", "sub_01_2_1_activity_1", "activity", {
			"startTime": "20140918200000",
			"endTime": "20140930016000",
			"status": 2,
			"type": 0,
			"util": 70,
			"util_volume": 99,
			"util_mass": 90,
			"tooltip": "Activity"
		});
		var ulcActsub112 = this.addRowNode("sub_01_2_1", "sub_01_2_1_activity_2", "activity", {
			"startTime": "20140930200000",
			"endTime": "20141002230000",
			"status": 0,
			"type": 2,
			"tooltip": "Activity"
		});
		this.addRowNode("sub_01_2_1", "root-ulc_sub_01_2_1", "ulc", { "rowIndex": 1 });
		this.addRowNode("root-ulc_sub_01_2_1", "order_sub_01_2_1", "order", {});
		this.addRowNode("order_sub_01_2_1", "order-util-volume_sub_01_2_1", "util", { dimension: "util_volume" });
		this.addULCToNode("order-util-volume_sub_01_2_1", "order-util-volume_sub_01_2_1-data", "values", [ulcActsub110, ulcActsub111, ulcActsub112], "util_volume");
		this.addRowNode("order_sub_01_2_1", "order-util-mass_sub_01_2_1", "util", { dimension: "util_mass" });
		this.addULCToNode("order-util-mass_sub_01_2_1", "order-util-mass_sub_01_2_1-data", "values", [ulcActsub110, ulcActsub111, ulcActsub112], "util_mass");
		this.addRowNode("01_3", "01_3_order_0", "order", {
			"startTime": "20140918000000",
			"endTime": "20141012000000",
			"status": 2,
			"type": "TOL",
			"id": 1,
			"tooltip": "TOL Order"
		});
		var ulcAct130 = this.addRowNode("01_3", "01_3_activity_0", "activity", {
			"startTime": "20140918000000",
			"endTime": "20140922000000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		var ulcAct131 = this.addRowNode("01_3", "01_3_activity_1", "activity", {
			"startTime": "20140922000000",
			"endTime": "20141005000000",
			"status": 1,
			"type": 0,
			"util": 70,
			"util_volume": 101,
			"util_mass": 88.88,
			"tooltip": "Activity"
		});
		var ulcAct132 = this.addRowNode("01_3", "01_3_activity_2", "activity", {
			"startTime": "20141005000000",
			"endTime": "20141012000000",
			"status": 2,
			"type": 2,
			"tooltip": "Activity"
		});
		this.addRowNode("01_3", "root-ulc_01_3", "ulc", { "rowIndex": 1 });
		this.addRowNode("root-ulc_01_3", "order_01_3", "order", {});
		this.addRowNode("order_01_3", "order-util-volume_01_3", "util", { dimension: "util_volume" });
		this.addULCToNode("order-util-volume_01_3", "order-util-volume_01_3-data", "values", [ulcAct130, ulcAct131, ulcAct132], "util_volume");
		this.addRowNode("order_01_3", "order-util-mass_01_3", "util", { dimension: "util_mass" });
		this.addULCToNode("order-util-mass_01_3", "order-util-mass_01_3-data", "values", [ulcAct130, ulcAct131, ulcAct132], "util_mass");
		this.addRowNode("sub_01_3_1", "sub_01_3_1_order_0", "order", {
			"startTime": "20140916000000",
			"endTime": "20141002000000",
			"status": 2,
			"type": "TOL",
			"id": 1,
			"tooltip": "TOL Order"
		});
		var ulcActsub120 = this.addRowNode("sub_01_3_1", "sub_01_3_1_activity_0", "activity", {
			"startTime": "20140916000000",
			"endTime": "20140918000000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		var ulcActsub121 = this.addRowNode("sub_01_3_1", "sub_01_3_1_activity_1", "activity", {
			"startTime": "20140918000000",
			"endTime": "20140930000000",
			"status": 1,
			"type": 0,
			"util": 99,
			"util_volume": 99,
			"util_mass": 79,
			"tooltip": "Activity"
		});
		var ulcActsub122 = this.addRowNode("sub_01_3_1", "sub_01_3_1_activity_2", "activity", {
			"startTime": "20140930000000",
			"endTime": "20141002000000",
			"status": 1,
			"type": 2,
			"tooltip": "Activity very long 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
		});
		this.addRowNode("sub_01_3_1", "root-ulc_sub_01_3_1", "ulc", { "rowIndex": 1 });
		this.addRowNode("root-ulc_sub_01_3_1", "order_sub_01_3_1", "order", {});
		this.addRowNode("order_sub_01_3_1", "order-util-volume_sub_01_3_1", "util", { dimension: "util_volume" });
		this.addULCToNode("order-util-volume_sub_01_3_1", "order-util-volume_sub_01_3_1-data", "values", [ulcActsub120, ulcActsub121, ulcActsub122], "util_volume");
		this.addRowNode("order_sub_01_3_1", "order-util-mass_sub_01_3_1", "util", { dimension: "util_mass" });
		this.addULCToNode("order-util-mass_sub_01_3_1", "order-util-mass_sub_01_3_1-data", "values", [ulcActsub120, ulcActsub121, ulcActsub122], "util_mass");
		this.addRowNode("01_4", "01_4_order_0", "order", {
			"startTime": "20141002000000",
			"endTime": "20141024000000",
			"status": 2,
			"type": "TOL",
			"id": 1,
			"tooltip": "TOL Order"
		});
		var ulcAct140 = this.addRowNode("01_4", "01_4_activity_0", "activity", {
			"startTime": "20141002000000",
			"endTime": "20141005000000",
			"status": 1,
			"type": 1,
			"tooltip": "Activity"
		});
		var ulcAct141 = this.addRowNode("01_4", "01_4_activity_1", "activity", {
			"startTime": "20141005000000",
			"endTime": "20141020000000",
			"status": 1,
			"type": 0,
			"util": 30,
			"util_volume": 25,
			"util_mass": 30,
			"tooltip": "Activity"
		});
		var ulcAct142 = this.addRowNode("01_4", "01_4_activity_2", "activity", {
			"startTime": "20141020000000",
			"endTime": "20141024000000",
			"status": 2,
			"type": 2,
			"tooltip": "Activity"
		});
		this.addRowNode("01_4", "root-ulc_01_4", "ulc", { "rowIndex": 1 });
		this.addRowNode("root-ulc_01_4", "order_01_4", "order", {});
		this.addRowNode("order_01_4", "order-util-volume_01_4", "util", { dimension: "util_volume" });
		this.addULCToNode("order-util-volume_01_4", "order-util-volume_01_4-data", "values", [ulcAct140, ulcAct141, ulcAct142], "util_volume");
		this.addRowNode("order_01_4", "order-util-mass_01_4", "util", { dimension: "util_mass" });
		this.addULCToNode("order-util-mass_01_4", "rorder-util-mass_01_4-data", "values", [ulcAct140, ulcAct141, ulcAct142], "util_mass");
		this.addCalendarToHierarchy("twoDaysAWeek", 5);
		this._data.calendar[0].data.push({ "startTime": "20141004000000", "endTime": "20141006000000" });
		this._data.calendar[0].data.push({ "startTime": "20141011000000", "endTime": "20141013000000" });
		this._data.calendar[0].data.push({ "startTime": "20141018000000", "endTime": "20141020000000" });
		this._data.calendar[0].data.push({ "startTime": "20141025000000", "endTime": "20141027000000" });
		this._data.calendar[0].data.push({ "startTime": "20141101000000", "endTime": "20141103000000" });
		this.addRowNode("01_0", "01_0_nwt", "nwt", { id: "twoDaysAWeek" });
		this.addRowNode("01_1", "01_1_nwt", "nwt", { id: "twoDaysAWeek" });
		this.addRowNode("01_2", "01_2_nwt", "nwt", { id: "twoDaysAWeek" });
		this.addRowNode("01_3", "01_3_nwt", "nwt", { id: "twoDaysAWeek" });
		this.addRowNode("01_4", "01_4_nwt", "nwt", { id: "twoDaysAWeek" });
		return this;

	};

	//produce overlap
	//type can be meet, shortage and surplus
	RESOURCESDataMaker.prototype.addOverlapToRow = function (sTargetRowUUID, nOverlapLineNumber, sOverlapType, sStartTime) {
		var oBaseOrder = this._produceDefaultOrderNode(sStartTime);
		var oBaseAct = this._produceDefaultActNode(oBaseOrder.startTime, 5);
		var oBaseOrder2 = this._produceDefaultOrderNode(this._getTimeByBias(this._abapTsToDate(oBaseOrder.endTime), 10), 5);
		var oBaseAct2 = this._produceDefaultActNode(oBaseOrder2.startTime, 5);
		oBaseAct.util = this._util[Math.ceil(Math.random() * 4)];
		oBaseAct2.util = this._util[Math.ceil(Math.random() * 4)];
		var aOrderGreedy = [];
		var aActGreedy = [];
		oBaseOrder.rowIndex = 1;
		oBaseAct.rowIndex = 1;
		oBaseOrder2.rowIndex = 1;
		oBaseAct2.rowIndex = 1;
		this.addRowNode(sTargetRowUUID, "overlap-order-base-0", "order", oBaseOrder);
		this.addRowNode(sTargetRowUUID, "overlap-activity-base-0", "activity", oBaseAct);
		this.addRowNode(sTargetRowUUID, "overlap-order-base-1", "order", oBaseOrder2);
		this.addRowNode(sTargetRowUUID, "overlap-activity-base-1", "activity", oBaseAct2);
		aOrderGreedy.push(oBaseOrder);
		aActGreedy.push(oBaseAct);
		aOrderGreedy.push(oBaseOrder2);
		aActGreedy.push(oBaseAct2);
		for (var i = 0; i < nOverlapLineNumber; i++) {
			var oOverlapOrder = {};
			var oOverlapAct = {};
			var oOverlapOrder2 = {};
			var oOverlapAct2 = {};
			if (i == 0) {
				oOverlapOrder = this._produceDefaultOrderNode(this._getTimeByBias(this._abapTsToDate(oBaseOrder.endTime), -2));
				oOverlapAct = this._produceDefaultActNode(oOverlapOrder.startTime, 5);
				oOverlapOrder2 = this._produceDefaultOrderNode(this._getTimeByBias(this._abapTsToDate(oBaseOrder2.endTime), -2));
				oOverlapAct2 = this._produceDefaultActNode(oOverlapOrder2.startTime, 5);
			} else {
				oOverlapOrder = this._produceDefaultOrderNode(this._getTimeByBias(this._abapTsToDate(oBaseOrder.endTime), -2), 2);
				oOverlapAct = this._produceDefaultActNode(oOverlapOrder.startTime, 2);
				oOverlapOrder2 = this._produceDefaultOrderNode(this._getTimeByBias(this._abapTsToDate(oBaseOrder2.endTime), -2), 2);
				oOverlapAct2 = this._produceDefaultActNode(oOverlapOrder2.startTime, 2);
			}
			oOverlapOrder.rowIndex = i + 2;
			oOverlapAct.rowIndex = i + 2;
			oOverlapOrder2.rowIndex = i + 2;
			oOverlapAct2.rowIndex = i + 2;
			oOverlapAct.type = (i + 1) % 5;
			oOverlapAct2.type = (i + 1) % 5;
			aOrderGreedy.push(oOverlapOrder);
			aActGreedy.push(oOverlapAct);
			aOrderGreedy.push(oOverlapOrder2);
			aActGreedy.push(oOverlapAct2);
			this.addRowNode(sTargetRowUUID, "overlap-order-" + i + "-0", "order", oOverlapOrder);
			this.addRowNode(sTargetRowUUID, "overlap-activity-" + i + "-0", "activity", oOverlapAct);
			this.addRowNode(sTargetRowUUID, "overlap-order-" + i + "-1", "order", oOverlapOrder2);
			this.addRowNode(sTargetRowUUID, "overlap-activity-" + i + "-1", "activity", oOverlapAct2);
		}
		var oOverlap = {
			"id": "overlap-Line0",
			"start": this._abapTsToDate(aOrderGreedy[2].startTime).getTime(),
			"start_date": aOrderGreedy[2].startTime,
			"width": this._abapTsToDate(aOrderGreedy[0].endTime).getTime() - this._abapTsToDate(aOrderGreedy[2].startTime).getTime()
		};
		var oOverlap2 = {
			"id": "overlap-Line1",
			"start": this._abapTsToDate(aOrderGreedy[3].startTime).getTime(),
			"start_date": aOrderGreedy[3].startTime,
			"width": this._abapTsToDate(aOrderGreedy[1].endTime).getTime() - this._abapTsToDate(aOrderGreedy[3].startTime).getTime()
		};
		this.addRowNode(sTargetRowUUID, "overlap-order-overlap-" + sOverlapType, "order_overlap_" + sOverlapType, oOverlap);
		this.addRowNode(sTargetRowUUID, "overlap-order-overlap-" + sOverlapType, "order_overlap_" + sOverlapType, oOverlap2);
		this._addGreedy(sTargetRowUUID, "order", aOrderGreedy);
		this._addGreedy(sTargetRowUUID, "activity", aActGreedy);

	};

	RESOURCESDataMaker.prototype.addULCToNode = function (sTargetRowUUID, sNodeInfoUUID, sType, oNodeInfo, sULCType) {

		var oTargetRow = this._searchObjectByUUID(sTargetRowUUID);
		if (!oTargetRow[sType]) {
			oTargetRow[sType] = [];
		}
		var oValuesGroup = this._produceULCGroup(sNodeInfoUUID, sType, oNodeInfo, sULCType);
		oTargetRow[sType] = oTargetRow[sType].concat(oValuesGroup);
		var oParent = this._searchParentByUUID(sTargetRowUUID);
		var oTooltip = this._addTooltipToULCOrder(oParent, oValuesGroup, oTargetRow.dimension);
		oParent = this._searchParentByUUID(oParent.uuid);
		this._addTooltipToULC(oParent, oTooltip);
		return oTargetRow[sType];

	};

	//add greedy to overlap
	RESOURCESDataMaker.prototype._addGreedy = function (sTargetRowUUID, sType, aGreedy) {
		if (jQuery.isArray(aGreedy)) {
			for (var i = 0; i < aGreedy.length; i++) {
				this.addRowNode(sTargetRowUUID, "overlap-" + sType + "-greedy" + i, sType + "_greedy", aGreedy[i]);
			}
		}
	};

	RESOURCESDataMaker.prototype._produceULCGroup = function (sNodeInfoUUID, sType, oObjectInfo, sULCType) {

		var aGroup = [];
		for (var i = 0; i < oObjectInfo.length; i++) {
			var aULCNode = [];
			if (oObjectInfo.length == 1) {
				aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, 0));
				aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i][sULCType] || 0));
			} else {
				if (i == 0) {
					if (oObjectInfo[i].type == 1) {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, oObjectInfo[i][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i + 1][sULCType] || 0));
					} else if (oObjectInfo[i].type == 2) {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, oObjectInfo[i][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i + 1][sULCType] || 0));
					} else {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i + 1].startTime, oObjectInfo[i][sULCType] || 0));
					}
				} else if (i == oObjectInfo.length - 1) {
					if (oObjectInfo[i].type == 1) {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, oObjectInfo[i - 1][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i][sULCType] || 0));
					} else if (oObjectInfo[i].type == 2) {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, oObjectInfo[i - 1][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i][sULCType] || 0));
					} else {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, oObjectInfo[i - 1][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i][sULCType] || 0));
					}
				} else {
					if (oObjectInfo[i].type == 1 || oObjectInfo[i].type == 2) {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i - 1].endTime, oObjectInfo[i].startTime, oObjectInfo[i - 1][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].startTime, oObjectInfo[i].startTime, oObjectInfo[i - 1][sULCType] || 0));
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i].endTime, oObjectInfo[i].endTime, oObjectInfo[i + 1][sULCType] || 0));
					} else {
						aULCNode.push(this._produceDefaultULCValuesNode(oObjectInfo[i - 1].endTime, oObjectInfo[i].endTime, oObjectInfo[i][sULCType] || 0));
					}
				}
			}
			aGroup = aGroup.concat(aULCNode);
		}
		aGroup[0].firstOne = true;
		aGroup[aGroup.length - 1].lastOne = true;
		return aGroup;

	};

	RESOURCESDataMaker.prototype._addTooltipToULCOrder = function (oOrderRow, oValuesGroup, sDimension) {

		var aGroup = [];
		var oTooltip = {};
		var aTemp = [];
		var bHasTooltip = true;
		if (!oOrderRow.tooltip) {
			oOrderRow.tooltip = [];
			bHasTooltip = false;
		}
		for (var i = 0; i < oValuesGroup.length; i++) {
			if (oValuesGroup[i].from == oValuesGroup[i].to) {
				aTemp.push(oValuesGroup[i]);
			}
		}
		for (var i = 1; i < aTemp.length; i++) {
			oTooltip = this._clone(oTooltip);
			if (!bHasTooltip) {
				oTooltip = this._produceULCTooltipNode(aTemp[i - 1].from, aTemp[i].to);
			} else {
				oTooltip = oOrderRow.tooltip[i - 1];
			}
			if (aTemp[i].value == aTemp[i - 1].value) {
				oTooltip[sDimension] = {};
				oTooltip[sDimension].value = aTemp[i].value;
			} else {
				oTooltip[sDimension] = {};
				oTooltip[sDimension].previous = aTemp[i - 1].value;
				oTooltip[sDimension].next = aTemp[i].value;
			}
			aGroup.push(oTooltip);
			if (!bHasTooltip) {
				oOrderRow.tooltip.push(oTooltip);
			}
		}
		aGroup[0].firstOne = true;
		aGroup[aGroup.length - 1].lastOne = true;
		return aGroup;
	};

	RESOURCESDataMaker.prototype._addTooltipToULC = function (oULCRow, oValuesGroup) {

		if (!oULCRow.tooltip) {
			oULCRow.tooltip = [];
			for (var i = 0; i < oValuesGroup.length; i++) {
				oULCRow.tooltip.push(this._clone(oValuesGroup[i]));
			}
		} else {
			for (var j = 0; j < oValuesGroup.length; j++) {
				oULCRow.tooltip[j] = this._clone(oValuesGroup[j]);
			}
		}

	};

	RESOURCESDataMaker.prototype._produceDefaultULCValuesNode = function (sStartTime, sEndTime, sValue) {

		var oDefaultULCValuesNode = {};
		oDefaultULCValuesNode.from = sStartTime;
		oDefaultULCValuesNode.to = sEndTime;
		oDefaultULCValuesNode.value = parseFloat(sValue);
		return oDefaultULCValuesNode;

	};

	RESOURCESDataMaker.prototype._produceULCTooltipNode = function (sFromTime, sToTime) {

		var oULCTooltipNode = {};
		oULCTooltipNode.from = sFromTime;
		oULCTooltipNode.to = sToTime;
		return oULCTooltipNode;

	};

	RESOURCESDataMaker.prototype._searchParentByUUID = function (sUUID) {

		if (sUUID === "root") {
			return null;
		} else {
			return this._searchParentNode(this._data.root, null, sUUID);
		}

	};

	RESOURCESDataMaker.prototype._searchParentNode = function (oNode, oParent, sUUID) {

		var node;
		if (oNode.uuid || oNode.type === "root") {
			if (oNode.uuid === sUUID) {
				return oParent;
			} else {
				for (var propertyName in oNode) {
					node = this._searchParentNode(oNode[propertyName], oNode, sUUID);
					if (node) {
						return node;
					}
				}
			}
		} else if (oNode instanceof Array) {
			for (var i = 0; i < oNode.length; i++) {
				node = this._searchParentNode(oNode[i], oParent, sUUID);
				if (node) {
					return node;
				}
			}
		} else {
			return null;
		}
	};

	return RESOURCESDataMaker;
}, true);
