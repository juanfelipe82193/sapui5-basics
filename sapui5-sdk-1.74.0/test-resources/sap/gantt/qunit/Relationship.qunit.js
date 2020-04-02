/*global QUnit */
sap.ui.define([
	"sap/gantt/shape/ext/rls/Relationship"
], function (Relationship) {
	"use strict";
	QUnit.test("Relationship Class", function (assert) {
		var idSet = {};
		idSet.id = "container_cheader";
		idSet.pId = "container_header";
		var relationship = new Relationship();


		var ff = 0;
		var fs = 1;
		var sf = 2;
		var ss = 3;
		var k = 10;

		var convert = function (data) {
			var object = [];
			for (var i = 0; i < data.length;) {
				object[object.length] = { "x": data[i++], "y": data[i++] };
			}
			return object;
		};
		/*
		 * test case for activities with same start time/end time.
		 */
		var equalStartEndTimeObjects = {// two activities with same start time/end time.
			"start": {
				"x1": 10,
				"y1": 50,
				"fromObjectInfo": {
					"rowHeight": 27,
					"y": 27
				},
				"x2": 30,
				"y2": 50
			},
			"end": {
				"x1": 10,
				"y1": 100,
				"height": 15,
				"x2": 30,
				"y2": 100
			}
		};

		assert.deepEqual(relationship._calculateLineCoordinate(true, ff, equalStartEndTimeObjects.start.x2, equalStartEndTimeObjects.end.x2,
			equalStartEndTimeObjects.start.y2, equalStartEndTimeObjects.end.y2,
			equalStartEndTimeObjects.start.fromObjectInfo, equalStartEndTimeObjects.end.height),
			convert([30, 50, 30 + k, 50, 30 + k, 100, 30, 100]),
			"Finish-Finish relationship for equal start and end time");

		assert.deepEqual(relationship._calculateLineCoordinate(true, fs, equalStartEndTimeObjects.start.x2, equalStartEndTimeObjects.end.x1,
			equalStartEndTimeObjects.start.y2, equalStartEndTimeObjects.end.y1,
			equalStartEndTimeObjects.start.fromObjectInfo, equalStartEndTimeObjects.end.height),
			convert([30, 50, 30 + k, 50, 30 + k, 54, 10 - k, 54, 10 - k, 100, 10, 100]),
			"Finish-start relationship for equal start and end time");

		assert.deepEqual(relationship._calculateLineCoordinate(true, sf, equalStartEndTimeObjects.start.x1, equalStartEndTimeObjects.end.x2,
			equalStartEndTimeObjects.start.y1, equalStartEndTimeObjects.end.y2,
			equalStartEndTimeObjects.start.fromObjectInfo, equalStartEndTimeObjects.end.height),
			convert([10, 50, 10 - k, 50, 10 - k, 54, 30 + k, 54, 30 + k, 100, 30, 100]),
			"start-Finish relationship for equal start and end time");

		assert.deepEqual(relationship._calculateLineCoordinate(true, ss, equalStartEndTimeObjects.start.x1, equalStartEndTimeObjects.end.x1,
			equalStartEndTimeObjects.start.y1, equalStartEndTimeObjects.end.y1,
			equalStartEndTimeObjects.start.fromObjectInfo, equalStartEndTimeObjects.end.height),
			convert([10, 50, 10 - k, 50, 10 - k, 100, 10, 100]),
			"start-start relationship for equal start and end time");
		/*
		* test cases for activities with consequtive timeframe.
		*/
		var Objects = {
			"start": {
				"x1": 10,
				"y1": 50,
				"fromObjectInfo": {
					"rowHeight": 27,
					"y": 27
				},
				"x2": 30,
				"y2": 50
			},
			"end": {
				"x1": 30,
				"y1": 100,
				"height": 15,
				"x2": 50,
				"y2": 100
			}
		};

		assert.deepEqual(relationship._calculateLineCoordinate(true, ff, Objects.start.x2, Objects.end.x2,
			Objects.start.y2, Objects.end.y2,
			Objects.start.fromObjectInfo, Objects.end.height),
			convert([30, 50, 50 + k, 50, 50 + k, 100, 50, 100]),
			"Finish-Finish relationship for consequtive activities");

		assert.deepEqual(relationship._calculateLineCoordinate(false, fs, Objects.start.x2, Objects.end.x1,
			Objects.start.y2, Objects.end.y1,
			Objects.start.fromObjectInfo, Objects.end.height),
			convert([30, 50, 30 + k, 50, 30 + k, 54, 30 - k, 54, 30 - k, 100, 30, 100]),
			"Finish-start relationship for consequtive activities in 'S' shape");

		assert.deepEqual(relationship._calculateLineCoordinate(true, fs, Objects.start.x2, Objects.end.x1,
			Objects.start.y2, Objects.end.y1,
			Objects.start.fromObjectInfo, Objects.end.height),
			convert([30, 50, 30, 50, 30, 90.5]),
			"Finish-start relationship for consequtive activities in 'L' shape");

		assert.deepEqual(relationship._calculateLineCoordinate(true, sf, Objects.start.x1, Objects.end.x2,
			Objects.start.y1, Objects.end.y2,
			Objects.start.fromObjectInfo, Objects.end.height),
			convert([10, 50, 10 - k, 50, 10 - k, 54, 50 + k, 54, 50 + k, 100, 50, 100]),
			"start-Finish relationship for consequtive activities");

		assert.deepEqual(relationship._calculateLineCoordinate(true, ss, Objects.start.x1, Objects.end.x1,
			Objects.start.y1, Objects.end.y1,
			Objects.start.fromObjectInfo, Objects.end.height),
			convert([10, 50, 10 - k, 50, 10 - k, 100, 30, 100]),
			"start-start relationship for consequtive activities");

	});

});
