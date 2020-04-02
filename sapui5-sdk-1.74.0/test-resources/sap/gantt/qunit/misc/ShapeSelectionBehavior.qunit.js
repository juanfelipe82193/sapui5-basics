/*global QUnit */
sap.ui.define([
	"sap/gantt/misc/ShapeSelectionModel",
	"sap/ui/qunit/QUnitUtils"
], function(ShapeSelectionModel, qutils) {
	"use strict";

	var oData = {
		"root": {
			"children": [
				{
					"status": 2,
					"id": "0000",
					"type": "TOL",
					"startTime": "2014.09.20",
					"endTime": "2014.09.23",
					"order": [
						{
							"startTime": "20140920000000",
							"endTime": "20140923000000",
							"status": 2,
							"type": "TOL",
							"id": "order1"
						}
					],
					"activity": [
						{
							"startTime": "20140920000000",
							"endTime": "20140921000000",
							"status": 2,
							"type": 1,
							"id": "activity1"
						},
						{
							"startTime": "20140921000000",
							"endTime": "20140923000000",
							"status": 2,
							"type": 0,
							"id": 2
						}
					]
				},
				{
					"status": 2,
					"id": "0001",
					"type": "TOL",
					"startTime": "2014.09.29",
					"endTime": "2014.10.12",
					"order": [
						{
							"startTime": "20140929000000",
							"endTime": "20141012000000",
							"status": 1,
							"type": "TOL",
							"id": "order2"
						}
					],
					"activity": [
						{
							"startTime": "20140929000000",
							"endTime": "20140931000000",
							"status": 1,
							"type": 1,
							"id": 3
						},
						{
							"startTime": "20140931000000",
							"endTime": "20141009000000",
							"status": 1,
							"type": 0,
							"id": 4
						},
						{
							"startTime": "20141009000000",
							"endTime": "20141012000000",
							"status": 1,
							"type": 2,
							"id": 5
						}
					]
				},
				{
					"status": 1,
					"id": "0002",
					"type": "TOL",
					"startTime": "2014.09.27",
					"endTime": "2014.10.09",
					"order": [
						{
							"startTime": "20140927000000",
							"endTime": "20141009000000",
							"status": 1,
							"type": "TOL",
							"id": 3
						}
					],
					"activity": [
						{
							"startTime": "20140927000000",
							"endTime": "20140929000000",
							"status": 1,
							"type": 3,
							"id": 6
						},
						{
							"startTime": "20140929000000",
							"endTime": "20141008000000",
							"status": 1,
							"type": 0,
							"id": 7
						},
						{
							"startTime": "20141008000000",
							"endTime": "20141009000000",
							"status": 1,
							"type": 4,
							"id": 8
						}
					]
				},
				{
					"status": 2,
					"id": "0003",
					"type": "TOL",
					"startTime": "2014.09.30",
					"endTime": "2014.10.15",
					"order": [
						{
							"startTime": "20140930000000",
							"endTime": "20141015000000",
							"status": 0,
							"type": "TOL",
							"id": 4
						}
					],
					"activity": [
						{
							"startTime": "20140930000000",
							"endTime": "20141012000000",
							"status": 2,
							"type": 1,
							"id": 9
						},
						{
							"startTime": "20141012000000",
							"endTime": "20141015000000",
							"status": 2,
							"type": 0,
							"id": 10
						}
					]
				},
				{
					"status": 2,
					"end_loc_id": "WDF",
					"id": "0004",
					"type": "TOL",
					"startTime": "2014.10.05",
					"endTime": "2014.10.25",
					"order": [
						{
							"startTime": "20141005000000",
							"endTime": "20141025000000",
							"status": 0,
							"type": "TOL",
							"id": 5
						}
					],
					"activity": [
						{
							"startTime": "20141005000000",
							"endTime": "20141007000000",
							"status": 0,
							"type": 1,
							"id": 11
						},
						{
							"startTime": "20141007000000",
							"endTime": "20141017000000",
							"status": 0,
							"type": 0,
							"id": 12
						},
						{
							"startTime": "20141017000000",
							"endTime": "20141023000000",
							"status": 0,
							"type": 0,
							"id": 13
						},
						{
							"startTime": "20141023000000",
							"endTime": "20141025000000",
							"status": 0,
							"type": 2,
							"id": 14
						}
					]
				},
				{
					"status": 1,
					"id": "0005",
					"type": "TOL",
					"startTime": "2014.09.24",
					"endTime": "2014.10.18",
					"order": [
						{
							"startTime": "20140924000000",
							"endTime": "20141018000000",
							"status": 1,
							"type": "TOL",
							"id": 6
						}
					],
					"activity": [
						{
							"startTime": "20140924000000",
							"endTime": "20140925000000",
							"status": 1,
							"type": 0,
							"id": 15
						},
						{
							"startTime": "20140925000000",
							"endTime": "20141018000000",
							"status": 1,
							"type": 1,
							"id": 16
						}
					]
				},
				{
					"status": 2,
					"id": "0006",
					"type": "TOL",
					"startTime": "2014.09.25",
					"endTime": "2014.10.26",
					"order": [
						{
							"startTime": "20140925000000",
							"endTime": "20141026000000",
							"status": 1,
							"type": "TOL",
							"id": 7
						}
					],
					"activity": [
						{
							"startTime": "20140925020000",
							"endTime": "20140926010000",
							"status": 1,
							"type": 1,
							"id": 17
						},
						{
							"startTime": "20140926070000",
							"endTime": "20141024000000",
							"status": 1,
							"type": 0,
							"id": 18
						},
						{
							"startTime": "20141024010000",
							"endTime": "20141026000000",
							"status": 1,
							"type": 2,
							"id": 19
						}
					]
				},
				{
					"status": 0,
					"id": "0007",
					"type": "TOL",
					"startTime": "2014.09.22",
					"endTime": "2014.09.26",
					"order": [
						{
							"startTime": "20140922000000",
							"endTime": "20140926000000",
							"status": 1,
							"type": "TOL",
							"id": 8
						}
					],
					"activity": [
						{
							"startTime": "20140922020000",
							"endTime": "20140923020000",
							"status": 1,
							"type": 1,
							"id": 20
						},
						{
							"startTime": "20140923030000",
							"endTime": "20140924000000",
							"status": 1,
							"type": 3,
							"id": 21
						},
						{
							"startTime": "20140924000000",
							"endTime": "20140924080000",
							"status": 1,
							"type": 0,
							"id": 22
						},
						{
							"startTime": "20140924130000",
							"endTime": "20140925000000",
							"status": 1,
							"type": 4,
							"id": 23
						},
						{
							"startTime": "20140925000000",
							"endTime": "20140926000000",
							"status": 1,
							"type": 2,
							"id": 24
						}
					]
				}
			]
		},
		"hierarchyKey": "TOL"
	};
	var oGanttChart = sap.ui.jsfragment("sap.gantt.qunit.misc.GanttChart", this);
	oGanttChart.getModel("test").setData(oData);
	// here I have to put the gantt into content, because qunit-fixture prevent all events
	jQuery("#content").css({
		height: "300px"
	});
	oGanttChart.placeAt("content");
	sap.ui.getCore().applyChanges();

	var oVisibleUpdatedData = {
		"3": {
			"startTime": "20140928000000",
			"endTime": "20140931000000",
			"status": 1,
			"type": 1,
			"id": "3"
		},
		"4": {
			"startTime": "20141001000000",
			"endTime": "20141008000000",
			"status": 1,
			"type": 0,
			"id": "4"
		},
		"5": {
			"startTime": "20141009000000",
			"endTime": "20141013000000",
			"status": 1,
			"type": 2,
			"id": "5"
		}
	};

	var fnUpdateActivity345StartEndTime = function () {
		var activities = [
			oVisibleUpdatedData["3"],
			oVisibleUpdatedData["4"],
			oVisibleUpdatedData["5"]
		];
		oData.root.children[1].activity = activities;
		oGanttChart.getModel("test").setData(oData);
		sap.ui.getCore().applyChanges();
	};

	var fnAssertStartEndTimeEquals = function (aShapeId, oUpdatedData, callback, assert) {
		var oActivityShape = oGanttChart.getShapeInstance("ActivityKey"),
			oSelectedShape = oActivityShape.getSelectedShape(),
			sClassName = oSelectedShape.getId();

		var fnSelectedDatumOf = function (sShapeId) {
			var aSelectedShapeDatum = jQuery("path." + sClassName).map(function (i, dom) {
				return d3.select(dom).datum();
			});
			var aResult = aSelectedShapeDatum.filter(function (i, oDatum) {
				return oDatum.id == sShapeId;
			}) || [];
			return aResult[0] || {};
		};

		var done = assert.async();
		setTimeout(function () {
			aShapeId.forEach(function (sShapeId) {
				assert.equal(oUpdatedData[sShapeId].startTime, fnSelectedDatumOf(sShapeId).startTime, "shape " + sShapeId + " startTime is latest");
				assert.equal(oUpdatedData[sShapeId].endTime, fnSelectedDatumOf(sShapeId).endTime, "shape " + sShapeId + " endTime is latest");
			});
			callback();
			done();
		}, 100);
	};

	QUnit.module("shape selection behavior");

	QUnit.test("selected shape binded datum is latest", function (assert) {
		var aShapeId = ["3", "4", "5"];
		oGanttChart.selectShapes(aShapeId);
			fnUpdateActivity345StartEndTime();
			fnAssertStartEndTimeEquals(aShapeId, oVisibleUpdatedData, function () {
				oGanttChart.deselectShapes(aShapeId);
			}, assert);
	});
});
