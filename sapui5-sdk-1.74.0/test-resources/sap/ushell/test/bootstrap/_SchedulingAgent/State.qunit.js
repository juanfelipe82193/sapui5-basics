// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.bootstrap._SchedulingAgent.state
 */
sap.ui.require([
    "sap/ushell/bootstrap/_SchedulingAgent/state",
    "sap/ushell/bootstrap/_SchedulingAgent/logger"
], function (state, logger) {
    "use strict";

    /* global QUnit */

    /* eslint-disable no-console */
    if (typeof console.table !== "function") {
        console.table = function () {
        };
    }
    /* eslint-enable no-console */

    QUnit.module("Internal State - Basic functionality", {});

    QUnit.test("The Internal State is succesfully loaded", function (assert) {
        var bModuleIsobject = typeof state === "object";
        assert.ok(bModuleIsobject, "Internal State loaded.");
    });

    QUnit.test("The Internal State stores a time stamp", function (assert) {
        var bModuleIsobject = typeof state.iStartingTime === "number";
        assert.ok(bModuleIsobject, "Internal State loaded.");
    });

    QUnit.test("dump() returns the state", function (assert) {
        // Arrange
        state.setForModule(state.id.module.schedulingAgent.id, state.id.module.schedulingAgent.WokeUp);

        // Act
        var oStateDump = state.dump();

        // Assert
        var oStateDumpModuleStatus = oStateDump.ofModule[state.id.module.schedulingAgent.id].status;
        assert.strictEqual(oStateDumpModuleStatus, state.id.module.schedulingAgent.WokeUp, "And it's correct.");
    });

    QUnit.module("Internal state - Initialization", {});

    QUnit.test("After loading the state of the state module has been set properly", function (assert) {
        // Assert
        assert.strictEqual(state.id.module.state.id, "state", "The module ID has been registered.");
        assert.strictEqual(state.id.module.state.Available, "AVAILABLE", "The module status AVAILABLE has been registered.");
        assert.strictEqual(state.oState.ofModule[state.id.module.state.id].status, state.id.module.state.Available, "The modul state for module INTERNAL_STATE has been set to AVAILABLE.");
        assert.strictEqual(typeof state.oState.ofModule[state.id.module.state.id].time === "number", true, "The module status has a time stamp.");
    });

    QUnit.module("Internal State - Elementary access", {});

    QUnit.test(
        "setForLoadingBlock() sets the block state, getForLoadingBlock() reads it",
        function (assert) {
            // Act
            state.setForLoadingBlock("BLOCK_A", "LOADING", undefined, "Hello", "FLP_SCHEDULER");

            // Assert
            var oState = state.getForLoadingBlock("BLOCK_A");
            assert.strictEqual(oState.status, "LOADING", "The status which has been set, is retrieved correctly.");
            assert.strictEqual(oState.remark, "Hello", "The remark which has been set, is retrieved correctly.");
            assert.strictEqual(oState.byModule, "FLP_SCHEDULER", "The module which set the status, is retrieved correctly.");
            assert.strictEqual(oState.time, state.oState.ofLoadingBlock.BLOCK_A.time, "The time stamp has been set.");
        }
    );

    QUnit.test(
        "setForLoadingStep() sets the step state, getForLoadingStep() reads it",
        function (assert) {
            // Act
            state.setForLoadingStep("STEP_A", "DONE", 42, "Hurra", "FLP_LOADER");

            // Assert
            var oState = state.getForLoadingStep("STEP_A");
            assert.strictEqual(oState.status, "DONE", "The status which has been set, is retrieved correctly.");

            assert.strictEqual(oState.remark, "Hurra", "The remark which has been set, is retrieved correctly.");
            assert.strictEqual(oState.byModule, "FLP_LOADER", "The module which set the status, is retrieved correctly.");
            assert.strictEqual(oState.parameter, 42, "The parameters which have been set, are retrieved correctly.");
            assert.strictEqual(oState.time, state.oState.ofLoadingStep.STEP_A.time, "The time stamp has been set.");

            // ... and finally check logging visually in the development tools
            var stateCopy = state.dump();
            assert.strictEqual(stateCopy.ofLoadingStep.STEP_A.time, oState.time, "The time stamp in the stateCopy is correct.");
            logger.dumpHistory();
        }
    );

    QUnit.test("setForModule() sets the module state, getForModule() reads it", function (assert) {
        // Act
        state.setForModule(state.id.module.state.id, state.id.module.state.Initializing, "Hello Bootstrap Scheduling Agent");

        // Assert
        var oState = state.getForModule(
            state.id.module.state.id
        );
        assert.strictEqual(oState.status, state.id.module.state.Initializing, "The status which has been set, is retrieved correctly.");
        assert.strictEqual(oState.remark, "Hello Bootstrap Scheduling Agent", "The status which has been set, is retrieved correctly.");
        assert.strictEqual(oState.time, state.oState.ofModule[state.id.module.state.id].time, "The time stamp has been set.");
    });

    QUnit.test("state.dump available", function (assert) {
        var bFunctionExists = typeof state.dump === "function";
        assert.ok(bFunctionExists, "Function exists.");
    });

    QUnit.test("state.clear clears the internal state", function (assert) {
        // Fill the state with data
        state.setForModule(state.id.module.state.id, state.id.module.state.Initializing, "Hello Bootstrap Scheduling Agent");
        state.setForLoadingBlock("BLOCK_A", "LOADING", undefined, "Hello", "FLP_SCHEDULER");
        state.setForLoadingStep("STEP_A", "DONE", 42, "Hurra", "FLP_LOADER");

        // Act
        state.clear();

        // Assert
        assert.deepEqual(state.oState.ofLoadingBlock, {}, "Loading blocks' state is empty");
        assert.deepEqual(state.oState.ofLoadingStep, {}, "Loading steps' state is empty");
        assert.deepEqual(state.oState.ofModule, {}, "Module's state is empty");
    });

    QUnit.module("Internal State - Convenience functions", {});

    QUnit.test("isBlockLoaded() returns the expected result, if the block is unknown", function (assert) {
        // Act
        var bResult = state.isBlockLoaded("UNKNOWN");

        // Act and assert
        assert.strictEqual(bResult, false, "An unknown block has not been loaded.");
    });

    QUnit.test("isBlockLoaded() returns the expected result, if the block is known and has status BLOCK_DONE", function (assert) {
        // Arrange
        state.setForLoadingBlock("BLOCK_A", state.id.loadingBlock.Done, 42, "Hurra", state.id.module.flpLoader.id);

        // Act
        var bResult = state.isBlockLoaded("BLOCK_A");

        // Assert
        assert.strictEqual(bResult, true, "A known block was loaded.");
    });

    QUnit.test("isBlockWaitingForDependencies() returns the expected result.", function (assert) {
        // Arrange
        state.setForLoadingBlock("BLOCK_A", state.id.loadingBlock.WaitingForDependencies);

        // Act and assert
        assert.strictEqual(state.isBlockWaitingForDependencies("BLOCK_A"), true, "Waiting for Dependencies.");
        assert.strictEqual(state.isBlockLoading("BLOCK_A"), false, "Loading not in progress.");
        assert.strictEqual(state.isBlockLoaded("BLOCK_A"), false, "Loading is not yet done.");
        assert.strictEqual(state.isBlockLoadingAborted("BLOCK_A"), false, "Loading has not been aborted.");
        assert.strictEqual(state.hasBlockLoadingTimedOut("BLOCK_A"), false, "Loading has not timed out.");
        assert.strictEqual(state.getForLoadingBlock("BLOCK_A").byModule, undefined, "Originator info has not been set");
    });

    QUnit.test("isBlockLoading() returns the expected result", function (assert) {
        // Arrange
        state.setForLoadingBlock("BLOCK_A", state.id.loadingBlock.InProgress);

        // Act and assert
        assert.strictEqual(state.isBlockLoading("BLOCK_A"), true, "Loading not in progress.");
        assert.strictEqual(state.isBlockLoaded("BLOCK_A"), false, "Loading is not yet done.");
        assert.strictEqual(state.isBlockLoadingAborted("BLOCK_A"), false, "Loading has not been aborted.");
        assert.strictEqual(state.hasBlockLoadingTimedOut("BLOCK_A"), false, "Loading has not timed out.");
        assert.strictEqual(state.getForLoadingBlock("BLOCK_A").byModule, undefined, "Originator info is undefined.");
    });

    QUnit.test("isBlockLoading(), isBlockLoaded(), isBlockLoadingAborted(), isBlockLoadingTimedOut() return FALSE if the block is unknown", function (assert) {
        // Act and assert
        assert.strictEqual(state.isBlockLoading("UNKNOWN"), false, "Loading not in progress.");
        assert.strictEqual(state.isBlockLoaded("UNKNOWN"), false, "Loading is not yet done.");
        assert.strictEqual(state.isBlockLoadingAborted("UNKNOWN"), false, "Loading has not been aborted.");
        assert.strictEqual(state.hasBlockLoadingTimedOut("UNKNOWN"), false, "Loading has not timed out.");
    });

    QUnit.test("isBlockLoaded() returns the expected result if the block is known", function (assert) {
        // Arrange
        state.setForLoadingBlock("BLOCK_A", state.id.loadingBlock.Done);

        // Act and assert
        assert.strictEqual(state.isBlockLoading("BLOCK_A"), false, "Loading not in progress.");
        assert.strictEqual(state.isBlockLoaded("BLOCK_A"), true, "Loading is done.");
        assert.strictEqual(state.isBlockLoadingAborted("BLOCK_A"), false, "Loading has not been aborted.");
        assert.strictEqual(state.hasBlockLoadingTimedOut("BLOCK_A"), false, "Loading has not timed out.");
    });

    // Step loading
    QUnit.test("isStepLoaded() returns the expected result, if the step is unknown", function (assert) {
        // Act and assert
        assert.strictEqual(state.isStepLoaded("UNKNOWN"), false, "An unknown step has not been loaded.");
    });

    QUnit.test("isStepLoaded() returns the expected result, if the step is known and has status STEP_LOADED", function (assert) {
        // Arrange
        state.setForLoadingStep("STEP_1", state.id.loadingStep.Done, 42, "Hurra");

        // Act
        var bResult = state.isStepLoaded("STEP_1");

        // Assert
        assert.strictEqual(bResult, true, "An known step has been loaded.");
    });

    QUnit.test("stepWaitingForDependencies() returns the expected result.", function (assert) {
        // Arrange
        state.setForLoadingStep("STEP_1", state.id.loadingStep.WaitingForDependencies, undefined, undefined, state.id.module.flpScheduler.id);

        // Act and assert
        assert.strictEqual(state.isStepWaitingForDependencies("STEP_1"), true, "Waiting for Dependencies.");
        assert.strictEqual(state.isStepLoading("STEP_1"), false, "Loading not in progress.");
        assert.strictEqual(state.isStepLoaded("STEP_1"), false, "Loading is not yet done.");
        assert.strictEqual(state.isStepSkipped("STEP_1"), false, "Loading has not been skipped.");
        assert.strictEqual(state.isStepLoadingAborted("STEP_1"), false, "Loading has not been aborted.");
        assert.strictEqual(state.getForLoadingStep("STEP_1").byModule, state.id.module.flpScheduler.id, "Status has been set by scheduler.");
    });

    QUnit.test("stepLoadingStarted() returns the expected result if the step is known", function (assert) {
        // Arrange
        state.setForLoadingStep("STEP_1", state.id.loadingStep.InProgress);

        // Act and assert
        assert.strictEqual(state.isStepWaitingForDependencies("STEP_1"), false, "Not Waiting for Dependencies.");
        assert.strictEqual(state.isStepLoading("STEP_1"), true, "Loading is in progress.");
        assert.strictEqual(state.isStepLoaded("STEP_1"), false, "Loading is not yet done.");
        assert.strictEqual(state.isStepSkipped("STEP_1"), false, "Loading has not been skipped.");
        assert.strictEqual(state.isStepLoadingAborted("STEP_1"), false, "Loading has not been aborted.");
    });

    QUnit.test("stepLoadingStarted(), stepLoadingDone(), stepLoadingAborted(), stepLoadingTimedOut(), stepSkipped() return FALSE if the step is unknown", function (assert) {
        // Act and assert
        assert.strictEqual(state.isStepWaitingForDependencies("STEP_1"), false, "Not Waiting for Dependencies.");
        assert.strictEqual(state.isStepLoading("UNKNOWN"), false, "Loading not in progress.");
        assert.strictEqual(state.isStepLoaded("UNKNOWN"), false, "Loading is not yet done.");
        assert.strictEqual(state.isStepSkipped("UNKNOWN"), false, "Loading has not been skipped.");
        assert.strictEqual(state.isStepLoadingAborted("UNKNOWN"), false, "Loading has not been aborted.");
    });

    QUnit.test("stepLoadingDone() returns the expected result if the step is known", function (assert) {
        // Arrange
        state.setForLoadingStep("STEP_1", state.id.loadingStep.Done);

        // Act and assert
        assert.strictEqual(state.isStepLoading("STEP_1"), false, "Loading not in progress.");
        assert.strictEqual(state.isStepLoaded("STEP_1"), true, "Loading is not yet done.");
        assert.strictEqual(state.isStepSkipped("STEP_1"), false, "Loading has not been skipped.");
        assert.strictEqual(state.isStepLoadingAborted("STEP_1"), false, "Loading has not been aborted.");
    });

    // Module state
    QUnit.test("isAgentIdle() returns the expected result", function (assert) {
        // Arrange
        state.setForModule("schedulingAgent", "IDLE");

        // Act and assert
        assert.strictEqual(state.isAgentIdle(), true, "Agent is idle.");
        assert.strictEqual(state.isAgentWaiting(), false, "Agent is not waiting.");
        assert.strictEqual(state.agentWokeUp(), false, "Agent was not wakened.");
    });

    QUnit.test("isAgentIsWaiting() returns the expected result", function (assert) {
        // Arrange
        state.setForModule(state.id.module.schedulingAgent.id, state.id.module.schedulingAgent.Waiting);

        // Act and assert
        assert.strictEqual(state.isAgentIdle(), false, "Agent is not idle.");
        assert.strictEqual(state.isAgentWaiting(), true, "Agent is waiting.");
        assert.strictEqual(state.agentWokeUp(), false, "Agent was not wakened.");
    });

    QUnit.test("agentWokeUp() returns the expected result", function (assert) {
        // Arrange
        state.setForModule(state.id.module.schedulingAgent.id, state.id.module.schedulingAgent.WokeUp);

        // Act and assert
        assert.strictEqual(state.isAgentIdle(), false, "Agent is not idle.");
        assert.strictEqual(state.isAgentWaiting(), false, "Agent is not waiting.");
        assert.strictEqual(state.agentWokeUp(), true, "Agent woke up.");
    });
});
