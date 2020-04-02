// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.bootstrap._SchedulingAgent.logger
 */
sap.ui.require([
    "sap/ushell/bootstrap/_SchedulingAgent/logger",
    "sap/base/util/now"
], function (logger, fnNow) {
    "use strict";

    /* global sinon, QUnit */

    /* eslint-disable no-console */
    if (typeof console.table !== "function") {
        console.table = function () {};
    }
    /* eslint-enable no-console */

    QUnit.module("logger", {
        beforeEach: function () {
            logger.clearHistory();
            logger.verboseOn();
        }
    });

    QUnit.test("The logger is succesfully loaded.", function (assert) {

        // Assert
        assert.ok(typeof logger === "object", "logger loaded");
    });

    QUnit.test("The logger has a history array.", function (assert) {

        // Assert
        var bModuleIsobject = Array.isArray(logger.getHistory());
        assert.ok(bModuleIsobject, "History exists.");
    });

    QUnit.test("isVerboseOn() reports true after startup.", function (assert) {
        assert.strictEqual(logger.isVerboseOn(), true, "After startup verbose logging is enabled.");
    });

    QUnit.test("verboseOn() enables verbose logging, state.isVerboseOn() detects it.", function (assert) {
        // Act
        var bVerboseEnabled = logger.verboseOn();

        // Assert
        assert.strictEqual(bVerboseEnabled, true, "state.verboseOn() reports true.");
        assert.strictEqual(logger.isVerboseOn(), true, "state.isVerboseOn() returns true then.");
    });

    QUnit.test("verboseOff() disables verbose logging, state.isVerboseOn() detects it.", function (assert) {
        // Act
        var bVerboseEnabled = logger.verboseOff();

        // Assert
        assert.strictEqual(bVerboseEnabled, true, "state.verboseOff() returns true.");
        assert.strictEqual(logger.isVerboseOn(), false, "state.isVerboseOn() returns false then.");
    });

    QUnit.test("getHistory() returns an array object.", function (assert) {
        // Act
        var aHistory = logger.getHistory();

        // Assert
        assert.ok(Array.isArray(aHistory), "The history is an array.");
        assert.strictEqual(aHistory.length, 0, "The history is empty after startup.");
    });

    QUnit.test("logStatus() logs the state when verbose is on.", function (assert) {
        // Act
        logger.logStatus({
            time: fnNow(), // Date.now() is sometimes less accurate
            type: "Step",
            id: "Step 2",
            status: "DONE",
            parameter: null,
            remark: "The one and only",
            byModule: "flpScheduler"
        });

        // Assert
        assert.strictEqual(logger.getHistory().length, 1, "There's one entry in the status history.");
        assert.strictEqual(logger.getHistory()[0].remark, "The one and only", "The status has been taken over into the history as expected.");

    });

    QUnit.test("logStatus() doesn't log a state when verbose is off.", function (assert) {
        // Arrange
        logger.verboseOff();

        // Act
        logger.logStatus({
            time: fnNow(), // Date.now() is sometimes less accurate
            type: "Step",
            id: "Step 2",
            status: "DONE",
            parameter: null,
            remark: "The one and only",
            byModule: "flpScheduler"
        });

        // Assert
        assert.strictEqual(logger.getHistory().length, 0, "There's no entry in the status history.");
    });

    QUnit.test("logWarning() logs the state when verbose is on.", function (assert) {
        // Act
        logger.logWarning({
            time: fnNow(), // Date.now() is sometimes less accurate
            type: "Step",
            id: "Step 2",
            status: "WARNING",
            parameter: null,
            remark: "Something myserious happened!",
            byModule: "flpScheduler"
        });

        // Assert
        assert.strictEqual(logger.getHistory().length, 1, "There's one entry in the status history.");
    });

    QUnit.test("logWarning() doesn't log a state when verbose is off.", function (assert) {
        // Arrange
        logger.verboseOff();

        // Act
        logger.logWarning({
            time: fnNow(), // Date.now() is sometimes less accurate
            type: "Step",
            id: "Step 2",
            status: "WARNING",
            parameter: null,
            remark: "Something myserious happened!",
            byModule: "flpScheduler"
        });

        // Assert
        assert.strictEqual(logger.getHistory().length, 0, "There's no entry in the status history.");
    });

    QUnit.test("logError() logs a state even if verbose logging is disabled.", function (assert) {
        // Arrange
        logger.verboseOff();

        // Act
        logger.logError({
            time: fnNow(),
            type: "STEP",
            id: "Step 1",
            status: "CONFIG_ERROR",
            parameter: null,
            remark: "Check the stuff",
            byModule: "flpScheduler"
        });
        // Assert
        assert.strictEqual(logger.dumpHistory().length, 1, "The state has not been logged.");
        assert.strictEqual(logger.dumpHistory()[0].status, "CONFIG_ERROR", "The error has been logged.");
    });

    QUnit.test("A status gets properly formatted as string when logging as info, error or warning.", function (assert) {
        // Arrange
        var oLoggerStateToStringSpy = sinon.spy(logger, "stateToString");
        var oStatus = {
                time: fnNow(), // Date.now() is sometimes less accurate
                type: "Step",
                id: "Step 2",
                status: "WARNING/ERROR/INFO",
                parameter: 42,
                remark: "Something happened!",
                byModule: "flpScheduler"
        };

        // Act
        logger.logStatus(oStatus);
        logger.logWarning(oStatus);
        logger.logError(oStatus);

        // Assert
        assert.strictEqual(oLoggerStateToStringSpy.returnValues[0],
            "FLP Bootstrap Scheduling Agent :: Step 'Step 2' /WARNING/ERROR/INFO/ : Something happened!",
            "The state has been converted into a string representation properly."
        );
        assert.strictEqual(oLoggerStateToStringSpy.returnValues.length, 3,
            "SAPUI5 logging happens when logging a status, an error or a warning."
        );

        // Cleanup
        oLoggerStateToStringSpy.restore();
    });

    QUnit.test("dumpHistory() dumps the status written before.", function (assert) {
        // Arrange
        logger.logStatus({
            time: fnNow(),
            type: "STEP",
            id: "Step 1",
            status: "DONE",
            parameter: null,
            remark: "The one and only",
            byModule: "flpScheduler"
        });
        logger.logStatus({
            time: fnNow(),
            type: "BLOCK",
            id: "Block A",
            status: "DONE",
            parameter: 42,
            remark: "Hurra",
            byModule: "flpScheduler"
        });

        // Act
        var aDump = logger.dumpHistory();
        var aDumpForStep1 = logger.dumpHistory("Step 1");

        // Assert
        assert.strictEqual(aDump.length, 2, "2 status logged: Dump without filter logs 2 entries.");
        assert.strictEqual(aDumpForStep1.length, 1, "Dump with filter 'Step 1' has 1 entry as expected.");
        assert.strictEqual(logger.getHistory().length, 2, "2 status have been registered in the history.");
    });

    QUnit.test("clearHistory() clears the history completely.", function (assert) {
        // Arrange
        logger.logStatus({
            time: fnNow(),
            type: "STEP",
            id: "Step 1",
            status: "DONE",
            parameter: null,
            remark: "The one and only",
            byModule: "flpScheduler"
        });
        logger.logStatus({
            time: fnNow(),
            type: "BLOCK",
            id: "Block A",
            status: "DONE",
            parameter: 42,
            remark: "Hurra",
            byModule: "flpScheduler"
        });
        var noOfEntriesToBeDeleted = logger.getHistory().length;

        // Act
        logger.clearHistory();

        // Assert
        assert.strictEqual(logger.getHistory().length, 0, "When logger.clearHistory() has been executed, all 2 entries in the history are gone.");
        assert.strictEqual(noOfEntriesToBeDeleted, 2, "2 entries have been deleted as expected");
    });

});
