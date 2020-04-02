/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */


(function () {
    "use strict";
    var testName = "matrixTests";
    var testFunc = function (assert) {
        var matrixUtilities = sap.ui.vtm.MatrixUtilities;
        var matrix = [1, -1, -1, -1, 0, -1, 0, 0.799332542251485, 1, 0, 0.545954442371593, -1, -1]
        var inverted = matrixUtilities.invert(matrix);

        assert.ok(matrixUtilities.isValid(matrix, false) === true);
        assert.ok(matrixUtilities.isValid(matrix, true) === true);

        assert.ok(matrixUtilities.areEqual(matrix, inverted) === false);

        var matrix1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        var m4x4 = matrixUtilities.to4x4Matrix(matrix1);
        var expected = [[4, 5, 6, 0], [7, 8, 9, 0], [10, 11, 12, 0], [1, 2, 3, 13]];

        assert.ok(JSON.stringify(m4x4) === JSON.stringify(expected));

        var m13 = matrixUtilities.from4x4Matrix(m4x4);
        assert.ok(JSON.stringify(m13) === JSON.stringify(matrix1));

        var vsmMatrixStr = matrixUtilities.toVsmMatrixString(matrix1);
        expected = "4 5 6 7 8 9 10 11 12 1 2 3 13";
        assert.ok(vsmMatrixStr === expected);
        assert.ok(matrixUtilities.areEqual(matrix1, matrixUtilities.fromVsmMatrixString(vsmMatrixStr)));

        var vitMatrix = matrixUtilities.toVkMatrix(matrix1);
        expected = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
        assert.ok(matrixUtilities.areEqual(vitMatrix, expected));
    };

    if (QUnit.config.autostart !== false) {
        QUnit.config.autostart = false;
        QUnit.test(testName, testFunc);
        QUnit.start();
    } else {
        QUnit.test(testName, testFunc);
    }
})();