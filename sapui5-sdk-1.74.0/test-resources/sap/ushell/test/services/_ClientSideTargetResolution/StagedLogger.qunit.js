// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for ClientSideTargetResolution's Stage
 */
sap.ui.require([
    "sap/ushell/services/_ClientSideTargetResolution/StagedLogger",
    "sap/ushell/services/_ClientSideTargetResolution/Utils",
    "sap/ushell/test/utils"
], function (oStagedLogger, oUtils, oTestUtils) {
    "use strict";

    /* global sinon QUnit */

    var Q = QUnit;

    var _uuid = 0;

    function getBeginParams() {
        return {
            logId: ++_uuid,
            title: "Grow a tree",
            stages: [
               "STAGE1: Buy seeds",
               "STAGE2: Plant seeds",
               "STAGE3: Water",
               "STAGE4: Wait"
            ],
            moduleName: "the.module.name"
        };
    }

    Q.module("InboundIndex", {
        setup: function () {
            // just sanity check container is always destroyed before a test
            // starts...
            var oLogs = oStagedLogger._getLogs();
            if (Object.prototype.toString.apply(oLogs) === "[object Object]" &&
                Object.keys(oLogs).length > 0) {

                throw new Error("Test does not destroy all logs created by the StagedLogger");
            }

            jQuery.sap.log.setLevel(
                jQuery.sap.log.Level.DEBUG
            );

            sinon.stub(jQuery.sap.log, "debug");
        },
        teardown: function () {
            oTestUtils.restoreSpies(
                jQuery.sap.log.debug
            );
        }
    });

    Q.test("begin: throws no exceptions", 1, function (assert) {
        oStagedLogger.begin(getBeginParams); // updates _uuid

        assert.strictEqual(Object.prototype.toString.call(oStagedLogger._getLogs()),
            "[object Object]", "creates an internal object");

        // cleanup
        oStagedLogger.end(function () { return { logId: _uuid }; });
    });


    Object.keys(jQuery.sap.log.Level)
        .filter(function (sLevel) { return ["DEBUG", "TRACE", "ALL"].indexOf(sLevel) === -1 })
        .forEach(function (sLevel) {

            Q.test("begin: ignores call when log level is " + sLevel, 1, function (assert) {
                jQuery.sap.log.setLevel(
                    jQuery.sap.log.Level[sLevel]
                );

                oStagedLogger.begin(getBeginParams); // updates _uuid

                assert.deepEqual(oStagedLogger._getLogs(), {}, "does not create any logs");

                // cleanup
                oStagedLogger.end(function () { return { logId: _uuid }; });
            });
        });

    Object.keys(jQuery.sap.log.Level)
        .filter(function (sLevel) { return ["DEBUG", "TRACE", "ALL"].indexOf(sLevel) >= 0 })
        .forEach(function (sLevel) {

            Q.test("begin: constructs logger when log level is " + sLevel, 1, function (assert) {
                jQuery.sap.log.setLevel(
                    jQuery.sap.log.Level[sLevel]
                );

                oStagedLogger.begin(getBeginParams);

                assert.strictEqual(Object.keys(oStagedLogger._getLogs()).length, 1, "creates log entry");

                // cleanup
                oStagedLogger.end(function () { return { logId: _uuid }; });
            });
        });

    Q.test("end: destroys logger", 1, function (assert) {
        oStagedLogger.begin(getBeginParams); // updates _uuid

        oStagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(oStagedLogger._getLogs(), {},
            "sets internal object to null");
    });

    Q.test("end: causes jQuery.sap.log.debug to be called", 2, function (assert) {
        oStagedLogger.begin(getBeginParams); // updates _uuid

        oStagedLogger.end(function () { return { logId: _uuid }; });

        assert.strictEqual(
            jQuery.sap.log.debug.callCount,
            1,
            "there was one call to jQuery.sap.log.debug"
        );

        assert.deepEqual(
            jQuery.sap.log.debug.getCall(0).args,
            [
                "[REPORT #" + _uuid + "] Grow a tree",
                "\n" + [
                "STAGE1: Buy seeds"
                ,"-----------------"
                ,""
                ,"STAGE2: Plant seeds"
                ,"-------------------"
                ,""
                ,"STAGE3: Water"
                ,"-------------"
                ,""
                ,"STAGE4: Wait"
                ,"------------"].join("\n") + "\n",
                "the.module.name"
            ],
            "logged the expected message"
        );
    });

    Q.test("log: adds logging to the correct stage", 1, function (assert) {
        oStagedLogger.begin(getBeginParams);
        oStagedLogger.log(function () {
            return {
                logId: _uuid,
                stage: 2,
                line: "Hello"
            };
        });
        oStagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(
            jQuery.sap.log.debug.getCall(0).args,
            [
                "[REPORT #" + _uuid + "] Grow a tree",
                "\n" + [
                "STAGE1: Buy seeds"
                ,"-----------------"
                ,""
                ,"STAGE2: Plant seeds"
                ,"-------------------"
                ,"Hello"
                ,""
                ,"STAGE3: Water"
                ,"-------------"
                ,""
                ,"STAGE4: Wait"
                ,"------------"].join("\n") + "\n",
                "the.module.name"
            ],
            "logged the expected message"
        );
    });

    Q.test("log: adds logging with prefix to the correct stage", 1, function (assert) {
        oStagedLogger.begin(getBeginParams);
        oStagedLogger.log(function () {
            return {
                logId: _uuid,
                stage: 3,
                line: "Hello",
                prefix: "-"
            };
        });
        oStagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(
            jQuery.sap.log.debug.getCall(0).args,
            [
                "[REPORT #" + _uuid + "] Grow a tree",
                "\n" + [
                "STAGE1: Buy seeds"
                ,"-----------------"
                ,""
                ,"STAGE2: Plant seeds"
                ,"-------------------"
                ,""
                ,"STAGE3: Water"
                ,"-------------"
                ,"- Hello"
                ,""
                ,"STAGE4: Wait"
                ,"------------"].join("\n") + "\n",
                "the.module.name"
            ],
            "logged the expected message"
        );
    });

    Q.test("log: adds logging of multiple lines to the correct stage", function (assert) {
        oStagedLogger.begin(getBeginParams);
        oStagedLogger.log(function () {
            return {
                logId: _uuid,
                stage: 4,
                lines: [
                  "Line 1",
                  "Line 2",
                  "Line 3",
                  "Line 4"
                ]
            };
        });
        oStagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(
            jQuery.sap.log.debug.getCall(0).args,
            [
                "[REPORT #" + _uuid + "] Grow a tree",
                "\n" + [
                    "STAGE1: Buy seeds"
                    ,"-----------------"
                    ,""
                    ,"STAGE2: Plant seeds"
                    ,"-------------------"
                    ,""
                    ,"STAGE3: Water"
                    ,"-------------"
                    ,""
                    ,"STAGE4: Wait"
                    ,"------------"
                    ,"Line 1"
                    ,"Line 2"
                    ,"Line 3"
                    ,"Line 4"
                ].join("\n") + "\n",
                "the.module.name"
            ],
            "logged the expected message"
        );
    });

    Q.test("log: adds logging of multiple lines with prefix to the correct stage", function (assert) {
        oStagedLogger.begin(getBeginParams);
        oStagedLogger.log(function () {
            return {
                logId: _uuid,
                stage: 1,
                prefix: "-",
                lines: [
                  "Line 1",
                  "Line 2",
                  "Line 3",
                  "Line 4"
                ]
            };
        });
        oStagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(
            jQuery.sap.log.debug.getCall(0).args,
            [
                "[REPORT #" + _uuid + "] Grow a tree",
                "\n" + [
                    "STAGE1: Buy seeds"
                    ,"-----------------"
                    ,"- Line 1"
                    ,"- Line 2"
                    ,"- Line 3"
                    ,"- Line 4"
                    ,""
                    ,"STAGE2: Plant seeds"
                    ,"-------------------"
                    ,""
                    ,"STAGE3: Water"
                    ,"-------------"
                    ,""
                    ,"STAGE4: Wait"
                    ,"------------"
                ].join("\n") + "\n",
                "the.module.name"
            ],
            "logged the expected message"
        );
    });

    Q.test("log: numbers up and combines lines with prefix", 1, function (assert) {
        oStagedLogger.begin(getBeginParams);
        oStagedLogger.log(function () {
            return {
                logId: _uuid,
                stage: 1,
                prefix: ".",
                number: true,
                lines: [
                  "Line 1",
                  "Line 2",
                  "Line 3",
                  "Line 4"
                ]
            };
        });
        oStagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(
            jQuery.sap.log.debug.getCall(0).args,
            [
                "[REPORT #" + _uuid + "] Grow a tree",
                "\n" + [
                    "STAGE1: Buy seeds"
                    ,"-----------------"
                    ,"1. Line 1"
                    ,"2. Line 2"
                    ,"3. Line 3"
                    ,"4. Line 4"
                    ,""
                    ,"STAGE2: Plant seeds"
                    ,"-------------------"
                    ,""
                    ,"STAGE3: Water"
                    ,"-------------"
                    ,""
                    ,"STAGE4: Wait"
                    ,"------------"
                ].join("\n") + "\n",
                "the.module.name"
            ],
            "logged the expected message"
        );
    });

    Q.test("log: adds logging correctly when 'line', 'lines' and 'prefix' are given", function (assert) {
        oStagedLogger.begin(getBeginParams);
        oStagedLogger.log(function () {
            return {
                logId: _uuid,
                stage: 1,
                prefix: "-",
                line: "Some log line",
                lines: [
                  "Line 1",
                  "Line 2",
                  "Line 3",
                  "Line 4"
                ]
            };
        });
        oStagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(
            jQuery.sap.log.debug.getCall(0).args,
            [
                "[REPORT #" + _uuid + "] Grow a tree",
                "\n" + [
                    "STAGE1: Buy seeds"
                    ,"-----------------"
                    ,"Some log line"
                    ," - Line 1"
                    ," - Line 2"
                    ," - Line 3"
                    ," - Line 4"
                    ,""
                    ,"STAGE2: Plant seeds"
                    ,"-------------------"
                    ,""
                    ,"STAGE3: Water"
                    ,"-------------"
                    ,""
                    ,"STAGE4: Wait"
                    ,"------------"
                ].join("\n") + "\n",
                "the.module.name"
            ],
            "logged the expected message"
        );
    });

    Q.test("log: multiple logs at the same time", function (assert) {
        var iLog1Id,
            iLog2Id;

        oStagedLogger.begin(getBeginParams);
        iLog1Id = _uuid;

        oStagedLogger.begin(getBeginParams);
        iLog2Id = _uuid;

        oStagedLogger.log(function () {
            return {
                logId: iLog1Id,
                stage: 1,
                prefix: "-",
                line: "First log",
                lines: [
                  "Line 1",
                  "Line 2"
                ]
            };
        });

        oStagedLogger.log(function () {
            return {
                logId: iLog2Id,
                stage: 2,
                prefix: "-",
                line: "Second log",
                lines: [
                  "Line 3",
                  "Line 4"
                ]
            };
        });
        oStagedLogger.end(function () { return { logId: iLog2Id }; });  // log 2 ends first
        oStagedLogger.end(function () { return { logId: iLog1Id }; });

        assert.deepEqual(
            jQuery.sap.log.debug.getCall(0).args,
            [
                "[REPORT #" + iLog2Id + "] Grow a tree", // log 2 is logged first
                "\n" + [
                    "STAGE1: Buy seeds"
                    ,"-----------------"
                    ,""
                    ,"STAGE2: Plant seeds"
                    ,"-------------------"
                    ,"Second log"
                    ," - Line 3"
                    ," - Line 4"
                    ,""
                    ,"STAGE3: Water"
                    ,"-------------"
                    ,""
                    ,"STAGE4: Wait"
                    ,"------------"
                ].join("\n") + "\n",
                "the.module.name"
            ],
            "logged the expected message"
        );

        assert.deepEqual(
            jQuery.sap.log.debug.getCall(1).args,
            [
                "[REPORT #" + iLog1Id + "] Grow a tree", // log 2 is logged first
                "\n" + [
                    "STAGE1: Buy seeds"
                    ,"-----------------"
                    ,"First log"
                    ," - Line 1"
                    ," - Line 2"
                    ,""
                    ,"STAGE2: Plant seeds"
                    ,"-------------------"
                    ,""
                    ,"STAGE3: Water"
                    ,"-------------"
                    ,""
                    ,"STAGE4: Wait"
                    ,"------------"
                ].join("\n") + "\n",
                "the.module.name"
            ],
            "logged the expected message"
        );


    });
});
