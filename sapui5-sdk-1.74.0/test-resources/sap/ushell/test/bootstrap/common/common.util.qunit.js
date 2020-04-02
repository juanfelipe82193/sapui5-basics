// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for bootstrap common.util.js
 */
sap.ui.require([
    "sap/ushell/bootstrap/common/common.util"
], function (oUtil) {

    /* global QUnit */
    "use strict";

    QUnit.module("common.util", {
        setup: function () {
        },
        teardown: function () {
        }
    });

    [
        {
            testDescription: "add trailing slash when no slash at the end",
            input: "some/link",
            expectedResult: "some/link/"
        },
        {
            testDescription: "add trailing slash when slash at the end",
            input: "some/new/link/",
            expectedResult: "some/new/link/"
        },
        {
            testDescription: "return input when input is not string",
            input: undefined,
            expectedResult: undefined
        }
    ].forEach(function (oFixture) {
        QUnit.test("ensureTrailingSlash: " + oFixture.testDescription, function (assert) {
            var oResult;

            // act
            oResult = oUtil.ensureTrailingSlash(oFixture.input);

            // assert
            assert.equal(oResult, oFixture.expectedResult);
        });
    });
});
