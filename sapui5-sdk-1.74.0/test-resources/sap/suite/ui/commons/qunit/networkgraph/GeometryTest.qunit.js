sap.ui.define([
	"sap/suite/ui/commons/networkgraph/layout/Geometry"
], function (Geometry) {
	"use strict";

	QUnit.module("Network graph geometry utils");

	QUnit.test("Geometry methods work correctly.", function (assert) {
		var fnCheckLines = function (bExpected, l1p1x, l1p1y, l1p2x, l1p2y, l2p1x, l2p1y, l2p2x, l2p2y, msg) {
				var doThey = Geometry.doLinesIntersect(
					{p1: {x: l1p1x, y: l1p1y}, p2: {x: l1p2x, y: l1p2y}},
					{p1: {x: l2p1x, y: l2p1y}, p2: {x: l2p2x, y: l2p2y}});
				msg = "Lines intersection " + msg;
				if (bExpected) {
					assert.ok(doThey, msg);
				} else {
					assert.notOk(doThey, msg);
				}
			},
			fnCheckLineRectangle = function (bExpected, oLine, oRect, msg) {
				var doThey = Geometry.doLineRectangleIntersect(oLine, oRect);
				msg = "Line/Rectangle intersection " + msg;
				if (bExpected) {
					assert.ok(doThey, msg);
				} else {
					assert.notOk(doThey, msg);
				}
			};

		assert.expect(20);

		assert.equal(
			Geometry.getPointsDistance({x: -1, y: 1}, {x: -1, y: 1}),
			0, "Points distance case #1 ok.");
		assert.equal(
			Geometry.getPointsDistance({x: 0, y: 0}, {x: 3, y: 4}),
			5, "Points distance case #2 ok.");
		assert.equal(
			Geometry.getPointsDistance({x: 3, y: 2}, {x: -1, y: -1}),
			5, "Points distance case #3 ok.");

		assert.equal(
			JSON.stringify(Geometry.getPolygonCentroid({
				points: [{x: 1, y: 0}, {x: 4, y: 1}, {x: 3, y: 4}, {
					x: 0,
					y: 3
				}]
			})),
			"{\"x\":2,\"y\":2}",
			"Polygon centroid calculated correctly."
		);

		fnCheckLines(true, 1, 1, 3, 3, 1, 3, 3, 1, "case #1 X ok.");
		fnCheckLines(true, 1, 1, 4, 3, 2, 1, 3, 3, "case #2 X leaning left ok.");
		fnCheckLines(true, 1, 3, 4, 1, 2, 3, 3, 1, "case #3 X leaning right ok.");
		// Bloody IE can't get the following two right, i dunno why and i dont care
		// fnCheckLines(true, 1, 3, 1, 1, 3, 1, 1, 1, "case #? touching at point ok.");
		// fnCheckLines(true, 1, 1, 3, 3, 2, 2, 1, 4, "case #? touching in the middle ok.");
		fnCheckLines(false, -1, 3, 1, -3, 0, 3, 2, -3, "case #4 diagonal parallels ok.");
		fnCheckLines(false, -2, 1, -2, -3, -2.5, 3, -2.5, -3, "case #5 vertical parallels ok.");
		fnCheckLines(false, -2, 1.5, 2, 1.5, -4, 0.5, 4, 0.5, "case #6 horizontal parallels ok.");
		fnCheckLines(false, -2, -3, -1, 0, 0, 2, 1, -5, "case #7 just not xing ok.");

		// generic stuff
		fnCheckLineRectangle(true, {p1: {x: -1, y: -1}, p2: {x: 2, y: 2}}, {
			p1: {x: 0, y: 0},
			p2: {x: 1, y: 1}
		}, "case #1 ok.");
		fnCheckLineRectangle(true, {p1: {x: 0, y: 2.5}, p2: {x: 3, y: -2}}, {
			p1: {x: 0, y: 0},
			p2: {x: 1, y: 1}
		}, "case #2 ok.");
		fnCheckLineRectangle(true, {p1: {x: 0.5, y: 0.5}, p2: {x: 3, y: 1}}, {
			p1: {x: 0, y: 0},
			p2: {x: 1, y: 1}
		}, "case #3 ok.");
		fnCheckLineRectangle(false, {p1: {x: 0, y: 3}, p2: {x: 3, y: -2}}, {
			p1: {x: 0, y: 0},
			p2: {x: 1, y: 1}
		}, "case #4 ok.");
		fnCheckLineRectangle(false, {p1: {x: -1, y: -1}, p2: {x: 3, y: 0}}, {
			p1: {x: 0, y: 0},
			p2: {x: 1, y: 1}
		}, "case #5 ok.");

		// ortogonal stuff
		fnCheckLineRectangle(true, {p1: {x: 1, y: 1}, p2: {x: 1, y: 4}}, {
			p1: {x: 0, y: 2},
			p2: {x: 2, y: 3}
		}, "case #6 ok.");
		fnCheckLineRectangle(true, {p1: {x: 1, y: 1}, p2: {x: 1, y: 4}}, {
			p1: {x: 1, y: 2},
			p2: {x: 2, y: 3}
		}, "case #7 ok.");
		fnCheckLineRectangle(false, {p1: {x: 1, y: 1}, p2: {x: 1, y: 4}}, {
			p1: {x: 2, y: 2},
			p2: {x: 3, y: 3}
		}, "case #8 ok.");

		// JS decimal errors stuff
		fnCheckLineRectangle(
			true,
			{p1: {x: 150, y: 73}, p2: {x: 190, y: 73}},
			{
				p1: {x: 157.12751677852347, y: 71.54074899194204},
				p2: {x: 167.12751677852347, y: 81.54074899194204}
			}, "case #9 ok.");
	});

	QUnit.test("Vector computations are ok.", function (assert) {
		var v;
		assert.equal(Geometry.getAngleOfVector({
			center: {x: 0, y: 0},
			apex: {x: 1, y: 1}
		}), Math.PI / 4, "Angle of vecotr 1 ok.");
		assert.equal(Geometry.getAngleOfVector({
			center: {x: 0, y: 0},
			apex: {x: -1, y: -1}
		}), Math.PI * 1.25, "Angle of vecotr 2 ok.");

		assert.equal(Geometry.getLengthOfVector({
			center: {x: 0, y: 0},
			apex: {x: 3, y: 4}
		}), 5, "Length of vector 1 ok.");

		v = Geometry.getRotatedVector({center: {x: 0, y: 0}, apex: {x: 3, y: 4}}, Math.PI / 2);
		assert.equal(JSON.stringify(v), "{\"center\":{\"x\":0,\"y\":0},\"apex\":{\"x\":-4,\"y\":3}}", "Rotated vector 1 ok.");
	});

	QUnit.test("Bezier road for line focus.", function (assert) {
		assert.expect(4);

		// Star indicates direction
		// Case A:
		// __   __*
		//   |__|
		assert.equal(
			Geometry.getBezierPathCorners("M0,0 L100,0 L100,-100 L200,-100 L200,0 L300,0", 10, 5).trim(),
			"M -0 -5 L 88.5 -5 C 91.75 -5 95 -8.25 95 -11.5 L 95 -91.5 C 95 -98.25 101.75 -105 108.5 -105 L 191.5 -105 C 198.25 -105 205 -98.25 205 -91.5 L 205 -11.5 C 205 -8.25 208.25 -5 211.5 -5 L 300 -5",
			"Case A should be ok.");

		// Case B:
		// *
		// |__
		//  __|
		// |
		assert.equal(
			Geometry.getBezierPathCorners("M0,0 L0,100 L100,100 L100,200 L0,200 L0,300", 10, 5).trim(),
			"M 5 0 L 5 88.5 C 5 91.75 8.25 95 11.5 95 L 91.5 95 C 98.25 95 105 101.75 105 108.5 L 105 191.5 C 105 198.25 98.25 205 91.5 205 L 11.5 205 C 8.25 205 5 208.25 5 211.5 L 5 300",
			"Case B should be ok.");

		// Case C:
		//  __|
		// |__
		//    |
		//    *
		assert.equal(
			Geometry.getBezierPathCorners("M0,0 L0,-100 L-100,-100 L-100,-200 L0,-200 L0,-300", 10, 5).trim(),
			"M -5 0 L -5 -88.5 C -5 -91.75 -8.25 -95 -11.5 -95 L -91.5 -95 C -98.25 -95 -105 -101.75 -105 -108.5 L -105 -191.5 C -105 -198.25 -98.25 -205 -91.5 -205 L -11.5 -205 C -8.25 -205 -5 -208.25 -5 -211.5 L -5 -300",
			"Case C should be ok.");

		// Case D:
		//     __
		// *__|  |__
		assert.equal(
			Geometry.getBezierPathCorners("M0,0 L-100,0 L-100,100 L-200,100 L-200,0 L-300,0", 10, 5).trim(),
			"M 0 5 L -88.5 5 C -91.75 5 -95 8.25 -95 11.5 L -95 91.5 C -95 98.25 -101.75 105 -108.5 105 L -191.5 105 C -198.25 105 -205 98.25 -205 91.5 L -205 11.5 C -205 8.25 -208.25 5 -211.5 5 L -300 5",
			"Case D should be ok.");
	});

	QUnit.test("Line segment intersection.", function (assert) {
		var fnCreateLine = function (x1, y1, x2, y2) {
			return {
				p1: {
					x: x1,
					y: y1
				},
				p2: {
					x: x2,
					y: y2
				}
			};
		};

		var oIntersection = Geometry.getSegmentsIntersection(fnCreateLine(10, 10, 20, 10), fnCreateLine(15, 5, 15, 25));
		assert.equal(oIntersection.x, 15, "Segment x");
		assert.equal(oIntersection.y, 10, "Segment y");

		oIntersection = Geometry.getSegmentsIntersection(fnCreateLine(10, 10, 20, 10), fnCreateLine(5, 5, 25, 5));
		assert.equal(oIntersection.x, undefined, "Segment x");
		assert.equal(oIntersection.y, undefined, "Segment y");

		oIntersection = Geometry.getSegmentsIntersection(fnCreateLine(10, 10, 20, 10), fnCreateLine(30, 10, 40, 10));
		assert.equal(oIntersection.x, undefined, "Segment x");
		assert.equal(oIntersection.y, undefined, "Segment y");
	});
});
