// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for common.load.script
 */
sap.ui.require([
    "sap/ushell/bootstrap/common/common.load.script"
], function (fnLoadScript) {

    /* global QUnit jQuery*/
    "use strict";

    var PATH_TO_SCRIPT = "../../../test/utils.js";

    var sScriptId;

    QUnit.module("common.load.script", {
        setup: function () {
        },
        teardown: function () {
            if (sScriptId) {
                jQuery("#" + sScriptId).remove();
            }
        }
    });

    [
        {
            testDescription: "The script should be loaded and promise should be relolved",
            scriptPath: PATH_TO_SCRIPT,
            expectedError: false
        },
        {
            testDescription: "The script should not be loaded, because link is not correct and promise should be rejected",
            scriptPath: "some/not/existing/link",
            expectedError: true
        }
    ].forEach(function (oFixture) {
        QUnit.test(oFixture.testDescription, function (assert) {
            var fnDone = assert.async();
            sScriptId = "promiseTest";
            // act
            fnLoadScript(oFixture.scriptPath, sScriptId)
            .then(function () {
                assert.ok(!oFixture.expectedError, "Promise should be resolved");
                fnDone();
            })
            .catch(function () {
                assert.ok(oFixture.expectedError, "Promise should be rejected");
                fnDone();
            });
        });
    });

    [
        {
            testDescription: "check src set correct",
            scriptPath: PATH_TO_SCRIPT,
            sAttributeToTest: "src",
            sResult: PATH_TO_SCRIPT
        },
        {
            testDescription: "check id set correct",
            scriptPath: PATH_TO_SCRIPT,
            sScriptId: "testId",
            sAttributeToTest: "id",
            sResult: "testId"
        },
        {
            testDescription: "check defer set correct",
            scriptPath: PATH_TO_SCRIPT,
            bDefer: true,
            sAttributeToTest: "defer",
            sResult: "defer"
        },
        {
            testDescription: "check defer does not set",
            scriptPath: PATH_TO_SCRIPT,
            bDefer: false,
            sAttributeToTest: "defer",
            sResult: undefined
        }
    ].forEach(function (oFixture) {
        QUnit.test(oFixture.testDescription, function (assert) {
            var fnDone = assert.async(),
                bDefer = oFixture.bDefer || false;
            sScriptId = oFixture.sScriptId || "scriptToRemove";
            // act
            fnLoadScript(oFixture.scriptPath, sScriptId, bDefer)
            .then(function () {
                assert.equal(jQuery("#" + sScriptId).attr(oFixture.sAttributeToTest), oFixture.sResult, oFixture.sAttributeToTest + " attribute should be equal: " + oFixture.sResult);
                fnDone();
            })
            .catch(function () {
                assert.ok(false, "Promise must be resolved");
                fnDone();
            });
        });
    });
});
