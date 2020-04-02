// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

(function () {
    "use strict";

    /* global module, ok, test, sinon */

    jQuery.sap.require("sap.ushell.CanvasShapesManager");

    var oCanvasShapesManager;

    module("sap.ushell.CanvasShapes", {
        setup: function () {
            oCanvasShapesManager = sap.ushell.CanvasShapesManager;
        },
        // This method is called after each test. Add every restoration code here.
        teardown: function () { }
    });

    test("Point sanity test", function () {
        var point = oCanvasShapesManager.getPoint(5, 6);
        ok(point.x === 5, "The expected x value is 5");
        ok(point.y === 6, "The expected y value is 6");
    });

    test("Point.getDistance test", function () {
        var point = oCanvasShapesManager.getPoint(5, 6),
            distanceToNegativePoint = point.getDistance(oCanvasShapesManager.getPoint(-7, -8)),
            distanceToPositivePoint = point.getDistance(oCanvasShapesManager.getPoint(7, 8)),
            distanceToNegativeFractionPoint = point.getDistance(oCanvasShapesManager.getPoint(-7.5, -8.9)),
            distanceToPositiveFractionPoint = point.getDistance(oCanvasShapesManager.getPoint(7.5, 8.9));

        ok(distanceToNegativePoint === 18, "The expected value is 18");
        ok(distanceToPositivePoint === 2, "The expected value is 2");
        ok(distanceToNegativeFractionPoint === 19, "The expected value is 19");
        ok(distanceToPositiveFractionPoint === 3, "The expected value is The expected value is 3");
    });

    test("Point.getSegment test", function () {
        var point = oCanvasShapesManager.getPoint(0, 0),
            firstQuarter = point.getSegment(oCanvasShapesManager.getPoint(1, 1)),
            secondQuarter = point.getSegment(oCanvasShapesManager.getPoint(1, -1)),
            thirdQuarter = point.getSegment(oCanvasShapesManager.getPoint(-1, -1)),
            fourthQuarter = point.getSegment(oCanvasShapesManager.getPoint(-1, 1));

        ok(firstQuarter === 1, "The expected value is 1");
        ok(secondQuarter === 2, "The expected value is 2");
        ok(thirdQuarter === 3, "The expected value is 3");
        ok(fourthQuarter === 4, "The expected value is 4");
    });

    test("Point.offset test", function () {
        var point = oCanvasShapesManager.getPoint(0, 0);

        point.offset(-1, -1);
        ok(point.x === -1, "");
        ok(point.y === -1, "");

        point.offset(1, 1);
        ok(point.x === 0, "");
        ok(point.y === 0, "");
    });

    test("_generateRandomAmorphousShapeValues test", function () {
        var values = oCanvasShapesManager._generateRandomAmorphousShapeValues();

        ok(values.edge0.xOffSet < 401 && values.edge0.xOffSet > 199, "Actual value " + values.edge0.xOffSet);
        ok(values.edge0.yOffSet < -199 && values.edge0.yOffSet > -401, "Actual value " + values.edge0.yOffSet);
        ok(values.edge1.xOffSet < 401 && values.edge1.xOffSet > 199, "Actual value " + values.edge1.xOffSet);
        ok(values.edge1.yOffSet < -199 && values.edge1.yOffSet > -401, "Actual value " + values.edge1.yOffSet);
    });

    test("makeAmorphousShape test", function () {
        var squarePoints = oCanvasShapesManager._getSquarePoints(10, oCanvasShapesManager.getPoint(0, 0)),
            bezierCurves = oCanvasShapesManager._calculatebezierCurves(10, squarePoints),
            shape = { bezierCurves: bezierCurves, centerPoint: "" },
            result = oCanvasShapesManager.makeAmorphousShape(shape, 0, 3, 3, 0, 0);

        ok(result.bezierCurves[0].controlPoint1.x === 13 && result.bezierCurves[0].controlPoint1.y === -2, "result should be (13,-2), result is: ("
            + result.bezierCurves[0].controlPoint1.x + "," + result.bezierCurves[0].controlPoint1.y + ")");
        ok(result.bezierCurves[3].controlPoint2.x === 7 && result.bezierCurves[3].controlPoint2.y === 2, "result should be (7,2), result is: ("
            + result.bezierCurves[3].controlPoint2.x + "," + result.bezierCurves[3].controlPoint2.y + ")");

        squarePoints = oCanvasShapesManager._getSquarePoints(10, oCanvasShapesManager.getPoint(0, 0));
        bezierCurves = oCanvasShapesManager._calculatebezierCurves(10, squarePoints);
        shape = { bezierCurves: bezierCurves, centerPoint: "" };
        result = oCanvasShapesManager.makeAmorphousShape(shape, 1, 3, 3, 0, 0);
        ok(result.bezierCurves[0].controlPoint2.x === 8 && result.bezierCurves[0].controlPoint2.y === -7, "result should be (8,-7), result is: ("
            + result.bezierCurves[0].controlPoint2.x + "," + result.bezierCurves[0].controlPoint2.y + ")");
        ok(result.bezierCurves[1].controlPoint1.x === -8 && result.bezierCurves[1].controlPoint1.y === -13, "result should be (-8,-13), result is: ("
            + result.bezierCurves[1].controlPoint1.x + "," + result.bezierCurves[1].controlPoint1.y + ")");
    });

    test("_rotatePoints test", function () {
        var result = oCanvasShapesManager._rotatePoints(5, 5, oCanvasShapesManager.getPoint(0, 0), oCanvasShapesManager.getPoint(0, 0));
        ok(result[0].x === 5 && result[0].y == 5, "result should be (5,5), result is: (" + result[0].x + "," + result[0].y + ")");
        ok(result[1].x === -5 && result[1].y == -5, "result should be (-5,-5), result is: (" + result[0].x + "," + result[0].y + ")");

        result = oCanvasShapesManager._rotatePoints(-5, -5, oCanvasShapesManager.getPoint(0, 0), oCanvasShapesManager.getPoint(0, 0));
        ok(result[0].x === -5 && result[0].y == -5, "result should be (-5,-5), result is: (" + result[0].x + "," + result[0].y + ")");
        ok(result[1].x === 5 && result[1].y == 5, "result should be (5,5), result is: (" + result[0].x + "," + result[0].y + ")");
    });

    test("_getSquarePoints test", function () {
        var squarePoints = oCanvasShapesManager._getSquarePoints(10, oCanvasShapesManager.getPoint(0, 0));
        ok(squarePoints[0].x === 10 && squarePoints[0].y === 0, "values should be: (10,0), instead we got(" + squarePoints[0].x + "," + squarePoints[0].y + ")");
        ok(squarePoints[1].x === 0 && squarePoints[1].y === -10, "values should be: (0,-10), instead we got(" + squarePoints[1].x + "," + squarePoints[1].y + ")");
        ok(squarePoints[2].x === -10 && squarePoints[2].y === 0, "values should be: (-10,0), instead we got(" + squarePoints[2].x + "," + squarePoints[2].y + ")");
        ok(squarePoints[3].x === 0 && squarePoints[3].y === 10, "values should be: (0,10), instead we got(" + squarePoints[3].x + "," + squarePoints[3].y + ")");
    });

    test("_getRandomInt test", function () {
        var num = oCanvasShapesManager._getRandomInt(0, 1);
        ok(num <= 1 && num >= 0, "num should be in range 0-1, num value is:" + num);

        num = oCanvasShapesManager._getRandomInt(5, 10);
        ok(num <= 10 && num >= 5, "num should be in range 5-10, num value is:" + num);
    });

    test("_calculatebezierCurves test", function () {
        var radius = 10,
            squarePoints = oCanvasShapesManager._getSquarePoints(10, oCanvasShapesManager.getPoint(0, 0)),
            result = oCanvasShapesManager._calculatebezierCurves(radius, squarePoints);

        ok(result[0].controlPoint1.x === 10 && result[0].controlPoint1.y === -5, "values should be: (10,-5), instead we got(" + result[0].controlPoint1.x + "," + result[0].controlPoint1.y + ")");
        ok(result[0].controlPoint2.x === 5 && result[0].controlPoint2.y === -10, "values should be: (5,-10), instead we got(" + result[0].controlPoint2.x + "," + result[0].controlPoint2.y + ")");
        ok(result[1].controlPoint1.x === -5 && result[1].controlPoint1.y === -10, "values should be: (-5,-10), instead we got(" + result[1].controlPoint1.x + "," + result[1].controlPoint1.y + ")");
        ok(result[1].controlPoint2.x === -10 && result[1].controlPoint2.y === -5, "values should be: (-10,-5), instead we got(" + result[1].controlPoint2.x + "," + result[1].controlPoint2.y + ")");
        ok(result[2].controlPoint1.x === -10 && result[2].controlPoint1.y === 5, "values should be: (-10,5), instead we got(" + result[2].controlPoint1.x + "," + result[2].controlPoint1.y + ")");
        ok(result[2].controlPoint2.x === -5 && result[2].controlPoint2.y === 10, "values should be: (-5,10), instead we got(" + result[2].controlPoint2.x + "," + result[2].controlPoint2.y + ")");
        ok(result[3].controlPoint1.x === 5 && result[3].controlPoint1.y === 10, "values should be: (5,10), instead we got(" + result[3].controlPoint1.x + "," + result[3].controlPoint1.y + ")");
        ok(result[3].controlPoint2.x === 10 && result[3].controlPoint2.y === 5, "values should be: (10,5), instead we got(" + result[3].controlPoint2.x + "," + result[3].controlPoint2.y + ")");
    });

    test("Shapes drawn only when a color was supplied", function () {
        var mathFloorSpy = sinon.spy(Math, "floor"),
            jQueryBackup = jQuery;

        jQuery = function () {
            return [{
                getContext: function () {
                    return {
                        clearRect: function () { },
                        beginPath: function () { },
                        moveTo: function () { },
                        bezierCurveTo: function () { },
                        closePath: function () { },
                        fill: function () { }
                    };
                }
            }];
        };

        var coreThemingMock = sap.ui.core.theming = { Parameters: { get: function () { return "#ffffff"; } } };

        oCanvasShapesManager.drawShapes();
        ok(mathFloorSpy.called, "Shapes drawn when color supplied");

        coreThemingMock.Parameters.get = function () { return undefined; };
        mathFloorSpy.reset();

        oCanvasShapesManager.drawShapes();
        ok(mathFloorSpy.notCalled, "Shapes not drawn when color undefined");

        mathFloorSpy.restore();
        jQuery = jQueryBackup;
        coreThemingMock = {};
    });
}());
