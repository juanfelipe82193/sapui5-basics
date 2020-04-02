// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.bootstrap._SchedulingAgent.FLPScheduler
 */
sap.ui.require([
    "sap/ushell/bootstrap/_SchedulingAgent/FLPScheduler",
    "sap/ushell/bootstrap/_SchedulingAgent/state",
    "sap/base/util/LoaderExtensions",
    "sap/ushell/Config"
], function (
    FLPScheduler,
    state,
    LoaderExtensions,
    Config
) {
    "use strict";

    /* global sap, sinon, QUnit */

    var LOADING_CONFIG_PATH = "sap/ushell/bootstrap/_SchedulingAgent/LoadingConfiguration.json";
    var STEP_CONFIG_PATH = "sap/ushell/bootstrap/_SchedulingAgent/StepConfiguration.json";

    // update this if changed on the productive file
    var oStatesDefinitions = {
        loaded: "loaded",
        wait: "wait",
        step: "step",
        error: "error",
        blockDone: "blockDone",
        start: "state",
        done: "done",
        skipped: "skipped"
    };

    var oStepConfig = {
        "RendererExtensions": {
            "loadingMode": "continueOnEvent",
            "continueOnEvent": {
                "eventName": "RendererExtensionsPluginLoaded"
            },
            "userCanTrigger": false,
            "canBeInterrupted": false
        },
        "MessagePopOver": {
            "loadingMode": "byEvent",
            "byEvent": {
                "eventName": "loadMessagePopover",
                "eventData": ""
            },
            "Dependencies": ["RendererExtensions"]
        },
        "ShellElements": {
            "loadingMode": "byComponentCreate",
            "byComponentCreate": {
                "enabled": true,
                "ui5ComponentName": "sap.ushell.components.shell.ShellElements",
                "url": "sap/ushell/components/shell/ShellElements"
            },
            "Dependencies": [],
            "userCanTrigger": false,
            "canBeInterrupted": false
        },
        "Notifications": {
            "loadingMode": "byComponentCreate",
            "excludedFLPStates": ["lean", "lean-home"],
            "byComponentCreate": {
                "enabled": true,
                "ui5ComponentName": "sap.ushell.components.shell.Notifications",
                "url": "sap/ushell/components/shell/Notifications"
            },
            "Dependencies": [],
            "userCanTrigger": false,
            "canBeInterrupted": false
        },
        "MeArea": {
            "loadingMode": "byComponentCreate",
            "byComponentCreate": {
                "enabled": true,
                "ui5ComponentName": "sap.ushell.components.shell.MeArea",
                "url": "sap/ushell/components/shell/MeArea"
            },
            "Dependencies": [],
            "userCanTrigger": false,
            "canBeInterrupted": false
        },
        "UserImage": {
            "loadingMode": "byComponentCreate",
            "byComponentCreate": {
                "enabled": true,
                "ui5ComponentName": "sap.ushell.components.shell.UserImage",
                "url": "sap/ushell/components/shell/UserImage"
            },
            "Dependencies": [],
            "userCanTrigger": false,
            "canBeInterrupted": false
        },
        "Search": {
            "loadingMode": "byComponentCreate",
            "excludedFLPStates": ["lean", "lean-home"],
            "byComponentCreate": {
                "enabled": true,
                "ui5ComponentName": "sap.ushell.components.shell.Search",
                "url": "sap/ushell/components/shell/Search"
            },
            "Dependencies": [],
            "userCanTrigger": false,
            "canBeInterrupted": false
        },
        "ShellComplete": {
            "loadingMode": "byEvent",
            "byEvent": {
                "eventName": "ShellComplete",
                "eventData": ""
            },
            "Dependencies": []
        }
    };
    var oLoadingConfig = {

        "OrderOfLoadingBlocks": [
            "FLPPlugins"
        ],
        "LoadingBlocks": {
            "FLPPlugins": {
                "LoadingSteps": [
                    {
                        "LoadingStep": "ShellElements",
                        "canBeLoadedAsync": false
                    },
                    {
                        "LoadingStep": "Notifications",
                        "canBeLoadedAsync": false
                    },
                    {
                        "LoadingStep": "UserImage",
                        "canBeLoadedAsync": false
                    },
                    {
                        "LoadingStep": "Search",
                        "canBeLoadedAsync": false
                    },
                    {
                        "LoadingStep": "MeArea",
                        "canBeLoadedAsync": false
                    },
                    {
                        "LoadingStep": "ShellComplete",
                        "canBeLoadedAsync": false
                    }
                ],
                "maxWaitInMs": 0
            },
            "AfterLoadPluginsCall": {
                "LoadingSteps": [
                    {
                        "LoadingStep": "RendererExtensions",
                        "canBeLoadedAsync": false
                    },
                    {
                        "LoadingStep": "MessagePopOver",
                        "canBeLoadedAsync": true
                    }
                ],
                "maxWaitInMs": 3000
            }
        }
    };

    QUnit.module("Basic functionality", {
    });

    QUnit.test("The FLP Scheduler is succesfully loaded", function (assert) {
        assert.strictEqual(typeof FLPScheduler, "object", "FLP Scheduler loaded.");
    });

    QUnit.test("The FLP Scheduler has a Schedule object", function (assert) {
        assert.strictEqual(typeof FLPScheduler.oSchedule, "object", "FLPScheduler.oSchedule exists.");
    });

    QUnit.test("Schedule object contains the correct indices", function (assert) {
        assert.strictEqual(FLPScheduler.oSchedule.iBlockIndex, 0, "Block index set correctly.");
    });

    QUnit.test("The FLP Scheduler has a loading Queue", function (assert) {
        assert.ok(Array.isArray(FLPScheduler.oSchedule.aBlocksLoading), "FLPScheduler.oSchedule.aBlocksLoading exists.");
    });

    // FLPScheduler methods
    QUnit.module("API - FLPScheduler Interface", {
    });

    QUnit.test("FLPScheduler.dumpSchedule available", function (assert) {
        var bFunctionExists = typeof FLPScheduler.dumpSchedule === "function";
        assert.ok(bFunctionExists, "Method FLPScheduler.dumpSchedule exists.");
    });


    // initializeSchedule
    QUnit.module("API - initializeSchedule", {
        beforeEach: function () {
            this.oLoaderStub = sinon.stub(LoaderExtensions, "loadResource");
            this.oLoaderStub.withArgs(LOADING_CONFIG_PATH).returns(oLoadingConfig);
            this.oLoaderStub.withArgs(STEP_CONFIG_PATH).returns(oStepConfig);
            this.oSetForModuleSpy = sinon.spy(state, "setForModule");
        },
        afterEach: function () {
            this.oLoaderStub.restore();
            this.oSetForModuleSpy.restore();
            FLPScheduler.oSchedule = {
                iBlockIndex: 0,
                iStepIndex: 0,
                aBlocksLoading: []
            };
        }
    });
    // validators

    // _validateConfig
    QUnit.test("_validateConfig returns false if no object passed", function (assert) {

        var bConfigOk = FLPScheduler._validateConfig();
        assert.notOk(bConfigOk, "_validateConfig returns false when no object is passed.");
    });

    QUnit.test("_validateConfig returns false if only one argument passed", function (assert) {

        var bConfigOk = FLPScheduler._validateConfig({});
        assert.notOk(bConfigOk, "_validateConfig returns false when no object is passed.");
    });

    QUnit.test("_validateConfig returns false if object has no field OrderOfLoadingBlocks", function (assert) {

        var bConfigOk = FLPScheduler._validateConfig({}, {});
        assert.notOk(bConfigOk, "_validateConfig returns false if no field OrderOfLoadingBlocks present.");
    });

    QUnit.test("_validateConfig returns false if object has no field LoadingBlocks", function (assert) {

        var bConfigOk = FLPScheduler._validateConfig({OrderOfLoadingBlocks: {}}, {});
        assert.notOk(bConfigOk, "LoadingBlocks is not present.");
    });

    QUnit.test("_validateConfig returns false if OrderOfLoadingBlocks is not an array", function (assert) {

        var bConfigOk = FLPScheduler._validateConfig({OrderOfLoadingBlocks: {}}, {});
        assert.notOk(bConfigOk, "OrderOfLoadingBlocks is not an array.");
    });

    QUnit.test("_validateConfig returns false if OrderOfLoadingBlocks is empty", function (assert) {

        var bConfigOk = FLPScheduler._validateConfig({OrderOfLoadingBlocks: [], LoadingBlocks: {}}, {});
        assert.notOk(bConfigOk, "OrderOfLoadingBlocks is empty.");
    });

    QUnit.test("_validateConfig returns false if OrderOfLoadingBlocks contains undefined blocks", function (assert) {
        var oTestObject = {
            OrderOfLoadingBlocks: ["Bla", "Bli", "Blup"],
            LoadingBlocks: {
                Bla: {},
                Bli: {}
            }
        };
        var bConfigOk = FLPScheduler._validateConfig(oTestObject, {});
        assert.notOk(bConfigOk, "OrderOfLoadingBlocks is empty.");
    });

    QUnit.test("_validateConfig returns false if a Blocks contains an undefined step", function (assert) {
        var oTestObject = {
            OrderOfLoadingBlocks: ["Bla", "Bli", "Blup"],
            LoadingBlocks: {
                Bla: {
                    LoadingSteps: [
                        {LoadingStep: "Search"}
                    ]
                },
                Bli: {
                    LoadingSteps: [
                        {LoadingStep: "MeArea"}
                    ]
                },
                Blup: {
                    LoadingSteps: [
                        {LoadingStep: "YouArea"}
                    ]
                }
            }
        };
        var bConfigOk = FLPScheduler._validateConfig(oTestObject, oStepConfig);
        assert.notOk(bConfigOk, "There are undefined steps.");
    });

    QUnit.test("_validateConfig returns true if configuration is correct", function (assert) {
        var bConfigOk = FLPScheduler._validateConfig(oLoadingConfig, oStepConfig);
        assert.ok(bConfigOk, "Configuration was validated.");
    });

    QUnit.test("initializeSchedule returns true if a correct configuration is passed", function (assert) {
        var done = assert.async();

        FLPScheduler.initializeSchedule().then(function (bConfigOk) {
            assert.ok(bConfigOk, "Correct configuration.");
            assert.ok(this.oSetForModuleSpy.called, "The Agent called the internal state.");
            assert.ok(this.oSetForModuleSpy.calledWith(state.id.module.flpScheduler.id, state.id.module.flpScheduler.Initialized), "The Agent set the state to initialized.");
            done();
        }.bind(this));
    });

    QUnit.test("initializeSchedule stores the block configuration correctly", function (assert) {
        var done = assert.async();

        FLPScheduler.initializeSchedule().then(function (bConfigOk) {
            assert.ok(bConfigOk, "initializeSchedule returns succesfully.");
            assert.strictEqual(typeof FLPScheduler.oSchedule.oBlocks, "object", "There is a block configuration.");
            assert.strictEqual(FLPScheduler.oSchedule.oBlocks, oLoadingConfig.LoadingBlocks, "The correct block configuration was saved.");
            done();
        });
    });

    QUnit.test("initializeSchedule stores the step configuration correctly", function (assert) {
        var done = assert.async();

        FLPScheduler.initializeSchedule().then(function (bConfigOk) {
            assert.ok(bConfigOk, "initializeSchedule returns succesfully.");
            assert.strictEqual(FLPScheduler.oSchedule.oSteps, oStepConfig, "The correct step configuration was saved.");
            done();
        });
    });

    QUnit.test("initializeSchedule stores the group schedule correctly", function (assert) {
        var done = assert.async();

        FLPScheduler.initializeSchedule().then(function (bConfigOk) {
            assert.ok(bConfigOk, "initializeSchedule returns succesfully.");
            assert.strictEqual(FLPScheduler.oSchedule.aBlockOrder, oLoadingConfig.OrderOfLoadingBlocks, "The group schedule was saved.");
            done();
        });
    });

    // getNextLoadingStep methods
    QUnit.module("API - getNextLoadingStep", {
        beforeEach: function () {
            //this.oGetLoadingScheduleStub = sinon.stub(FLPScheduler, "_getLoadingSchedule").returns(oLoadingConfig);
            this.oIsBlockLoadedStub = sinon.stub(state, "isBlockLoaded");
            this.oIsStepLoadedStub = sinon.stub(state, "isStepLoaded");
            this.oIsStepLoadingStub = sinon.stub(state, "isStepLoading");
            // Stubs for the setters.
            this.oSetForLoadingStep = sinon.stub(state, "setForLoadingStep");
            this.oSetForLoadingBlock = sinon.stub(state, "setForLoadingBlock");
            this.oSetForModuleSpy = sinon.spy(state, "setForModule");

            FLPScheduler.oSchedule = {
                iBlockIndex: 0,
                iStepIndex: 0,
                aBlocksLoading: [],
                oBlocks: JSON.parse(JSON.stringify(oLoadingConfig.LoadingBlocks)),
                oSteps: JSON.parse(JSON.stringify(oStepConfig)),
                aBlockOrder: JSON.parse(JSON.stringify(oLoadingConfig.OrderOfLoadingBlocks))
            };
        },
        afterEach: function () {
            this.oIsBlockLoadedStub.restore();
            this.oIsStepLoadedStub.restore();
            this.oIsStepLoadingStub.restore();
            this.oSetForLoadingStep.restore();
            this.oSetForLoadingBlock.restore();
            this.oSetForModuleSpy.restore();
            FLPScheduler.oSchedule = {
                iBlockIndex: 0,
                iStepIndex: 0,
                aBlocksLoading: []
            };
        }
    });

    QUnit.test("Return an object with a status", function (assert) {
        // Act
        var oStatus = FLPScheduler.getNextLoadingStep();

        // Assert
        assert.strictEqual(typeof oStatus, "object", "A status object was returned.");
        assert.strictEqual(typeof oStatus.sStatus, "string", "The status object has a status field containing a string.");
    });

    QUnit.test("Initialize the queue if empty", function (assert) {
        // Arrange
        var sBlockToLoad = oLoadingConfig.OrderOfLoadingBlocks[0];
        // Act
        FLPScheduler.getNextLoadingStep();

        // Assert
        assert.strictEqual(FLPScheduler.oSchedule.aBlocksLoading[0], sBlockToLoad, "The queue was initialized.");
        assert.strictEqual(FLPScheduler.oSchedule.oBlocks[sBlockToLoad].iStepIndex, 0, "The first block was initialized.");
        assert.strictEqual(FLPScheduler.oSchedule.iBlockIndex, 1, "The block index was updated.");
        assert.ok(Array.isArray(FLPScheduler.oSchedule.oBlocks[sBlockToLoad].aAsyncStepsLoading), "The async queue was initialized.");
        assert.ok(this.oSetForLoadingBlock.called, "The Agent called the internal state.");
        assert.ok(this.oSetForLoadingBlock.calledWith(sBlockToLoad, state.id.loadingBlock.Prepared), "The Agent set the state of the block to prepared.");
    });

    QUnit.test("If queue is empty and all groups loaded, loading done", function (assert) {

        // change the Group index
        FLPScheduler.oSchedule.iBlockIndex = 1;

        // Act
        var oStatus = FLPScheduler.getNextLoadingStep();

        var bStatusDone = oStatus.sStatus === oStatesDefinitions.done;
        // Assert
        assert.ok(bStatusDone, "Status 'done' returned.");
    });

    QUnit.test("Check if the current step is loaded", function (assert) {
        // Act
        FLPScheduler.getNextLoadingStep();

        // Assert
        assert.ok(this.oIsStepLoadedStub.calledOnce, "Status of current step was checked.");
        assert.ok(this.oIsStepLoadedStub.calledWith("ShellElements"), "Status of current step was checked with correct parameters.");
    });

    QUnit.test("Return a waiting state if a step is not yet loaded", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.returns(false);
        this.oIsStepLoadingStub.returns(true);

        // Act
        var oStatus = FLPScheduler.getNextLoadingStep();

        // Assert
        assert.strictEqual(oStatus.sStatus, oStatesDefinitions.wait, "Status set to wait.");
    });

    QUnit.test("Return next step if current step loaded", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.returns(true);
        this.oIsStepLoadingStub.returns(false);

        // Act
        var oStatus = FLPScheduler.getNextLoadingStep();

        // Assert
        assert.strictEqual(oStatus.sStatus, oStatesDefinitions.step, "A step was returned.");
        assert.strictEqual(oStatus.oContent.LoadingStep, "Notifications", "The correct next step was returned.");
    });

    QUnit.test("If a step is done and the last of the Block, update loading status", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.returns(true);
        this.oIsStepLoadingStub.returns(false);

        FLPScheduler.oSchedule.oBlocks.FLPPlugins.iStepIndex = 5;
        FLPScheduler.oSchedule.oBlocks.FLPPlugins.aAsyncStepsLoading = [];
        FLPScheduler.oSchedule.oBlocks.AfterLoadPluginsCall.aAsyncStepsLoading = [];
        FLPScheduler.oSchedule.oBlocks.AfterLoadPluginsCall.iStepIndex = 0;
        FLPScheduler.oSchedule.aBlocksLoading = ["FLPPlugins", "AfterLoadPluginsCall"];

        // Act
        FLPScheduler.getNextLoadingStep();

        // Assert
        assert.strictEqual(FLPScheduler.oSchedule.aBlocksLoading.indexOf("FLPPlugins"), -1, "The block was removed from the queue.");
    });

    QUnit.test("If a step is done and the last of the Block, load the next block and return the first step", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.onFirstCall().returns(true);
        this.oIsStepLoadedStub.onSecondCall().returns(false);
        this.oIsStepLoadingStub.returns(false);
        FLPScheduler.oSchedule.aBlockOrder = ["FLPPlugins", "AfterLoadPluginsCall"];
        FLPScheduler.oSchedule.iBlockIndex = 1;

        FLPScheduler.oSchedule.oBlocks.FLPPlugins.iStepIndex = 5;
        FLPScheduler.oSchedule.oBlocks.FLPPlugins.aAsyncStepsLoading = [];
        FLPScheduler.oSchedule.aBlocksLoading = ["FLPPlugins"];

        // Act
        var oFirstStep = FLPScheduler.getNextLoadingStep();
        var oSecondStep= FLPScheduler.getNextLoadingStep();

        // Assert
        assert.strictEqual(oFirstStep.sStatus, oStatesDefinitions.blockDone, "First block signaled as done.");
        assert.strictEqual(FLPScheduler.oSchedule.iBlockIndex, 2, "The block index was updated.");
        assert.strictEqual(oSecondStep.oContent.LoadingStep, oLoadingConfig.LoadingBlocks.AfterLoadPluginsCall.LoadingSteps[0].LoadingStep, "The next block was initialized.");
    });

    QUnit.test("If a block is non-blocking, set the next one on the queue", function (assert) {
        // Arrange
        var aBlocksToLoad = ["FLPPlugins", "AfterLoadPluginsCall"];
        FLPScheduler.oSchedule.oBlocks.FLPPlugins.bCanBeLoadedConcurrently = true;
        FLPScheduler.oSchedule.aBlockOrder = aBlocksToLoad;
        this.oIsStepLoadingStub.onFirstCall().returns(false);
        this.oIsStepLoadingStub.onSecondCall().returns(true);

        // Act
        var oFirstStep = FLPScheduler.getNextLoadingStep(); // Should start the first block
        var oSecondStep = FLPScheduler.getNextLoadingStep(); // Should start the second block

        // Assert
        assert.strictEqual(FLPScheduler.oSchedule.aBlocksLoading[0], aBlocksToLoad[0], "The first block is on the loading queue.");
        assert.strictEqual(FLPScheduler.oSchedule.oBlocks[aBlocksToLoad[0]].iStepIndex, 0, "The first block was initialized.");
        assert.ok(Array.isArray(FLPScheduler.oSchedule.oBlocks[aBlocksToLoad[0]].aAsyncStepsLoading), "The first block's async queue was initialized.");
        assert.ok(this.oSetForLoadingBlock.calledWith(aBlocksToLoad[0], state.id.loadingBlock.Prepared), "The Agent set the state of the first block to prepared.");
        assert.strictEqual(oFirstStep.oContent.LoadingStep, oLoadingConfig.LoadingBlocks.FLPPlugins.LoadingSteps[0].LoadingStep, "The first step was returned.");

        assert.strictEqual(FLPScheduler.oSchedule.aBlocksLoading[1], aBlocksToLoad[1], "The second block is on the loading queue.");
        assert.strictEqual(FLPScheduler.oSchedule.oBlocks[aBlocksToLoad[1]].iStepIndex, 0, "The second block was initialized.");
        assert.ok(Array.isArray(FLPScheduler.oSchedule.oBlocks[aBlocksToLoad[1]].aAsyncStepsLoading), "The second block's async queue was initialized.");
        assert.ok(this.oSetForLoadingBlock.calledWith(aBlocksToLoad[1], state.id.loadingBlock.Prepared), "The Agent set the state of the second block to prepared.");
        assert.strictEqual(oSecondStep.oContent.LoadingStep, oLoadingConfig.LoadingBlocks.AfterLoadPluginsCall.LoadingSteps[0].LoadingStep, "The first step was returned.");
    });

    QUnit.test("If a block cannot be loaded concurrently, do not load the next one", function (assert) {
        // Arrange
        var aBlocksToLoad = ["FLPPlugins", "AfterLoadPluginsCall"];
        FLPScheduler.oSchedule.oBlocks.FLPPlugins.bCanBeLoadedConcurrently = false;
        FLPScheduler.oSchedule.aBlockOrder = aBlocksToLoad;
        this.oIsStepLoadingStub.onFirstCall().returns(false);
        this.oIsStepLoadingStub.onSecondCall().returns(true);

        // Act
        var oFirstStep = FLPScheduler.getNextLoadingStep(); // Should start the first block
        FLPScheduler.getNextLoadingStep(); // Should NOT start the second block

        // Assert
        assert.strictEqual(FLPScheduler.oSchedule.aBlocksLoading.length, 1, "Only one block was set on the loading queue.");
        assert.strictEqual(FLPScheduler.oSchedule.aBlocksLoading[0], aBlocksToLoad[0], "The first block is on the loading queue.");
        assert.strictEqual(FLPScheduler.oSchedule.oBlocks[aBlocksToLoad[0]].iStepIndex, 0, "The first block was initialized.");
        assert.ok(Array.isArray(FLPScheduler.oSchedule.oBlocks[aBlocksToLoad[0]].aAsyncStepsLoading), "The first block's async queue was initialized.");
        assert.ok(this.oSetForLoadingBlock.calledWith(aBlocksToLoad[0], state.id.loadingBlock.Prepared), "The Agent set the state of the first block to prepared.");
        assert.strictEqual(oFirstStep.oContent.LoadingStep, oLoadingConfig.LoadingBlocks.FLPPlugins.LoadingSteps[0].LoadingStep, "The first step was returned.");
    });

    QUnit.test("Non-Async mode: calling twice for a new step will return a step and a wait", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.returns(false);

        // Act
        var oStatusFirstCall = FLPScheduler.getNextLoadingStep();
        this.oIsStepLoadingStub.returns(true);
        var oStatusSecondCall = FLPScheduler.getNextLoadingStep();

        // Assert
        assert.strictEqual(oStatusFirstCall.sStatus, oStatesDefinitions.step, "First call returns a step.");
        assert.strictEqual(oStatusFirstCall.oContent.LoadingStep, "ShellElements", "First call returns the expected step.");
        assert.strictEqual(oStatusSecondCall.sStatus, oStatesDefinitions.wait, "Second call returns a wait.");
    });

    QUnit.test("Async mode: Async steps are added to the block's async queue", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.returns(false);
        // Set the first two steps to async loading
        FLPScheduler.oSchedule.oBlocks.FLPPlugins.LoadingSteps[0].canBeLoadedAsync = true;
        FLPScheduler.oSchedule.oBlocks.FLPPlugins.LoadingSteps[1].canBeLoadedAsync = true;

        // Act
        FLPScheduler.getNextLoadingStep();
        this.oIsStepLoadingStub.returns(true);
        FLPScheduler.getNextLoadingStep();

        assert.strictEqual(FLPScheduler.oSchedule.oBlocks.FLPPlugins.aAsyncStepsLoading[0], "ShellElements", "First step in the queue is correct");
        assert.strictEqual(FLPScheduler.oSchedule.oBlocks.FLPPlugins.aAsyncStepsLoading[1], "Notifications", "Second step in the queue is correct.");
    });

    QUnit.test("Async mode: A loaded Async step is removed from the queue", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.onFirstCall().returns(true);
        this.oIsStepLoadedStub.onSecondCall().returns(false);
        FLPScheduler.oSchedule.oBlocks.FLPPlugins.LoadingSteps[0].canBeLoadedAsync = true;
        FLPScheduler.oSchedule.oBlocks.FLPPlugins.LoadingSteps[1].canBeLoadedAsync = true;

        // Act
        FLPScheduler.getNextLoadingStep();

        assert.strictEqual(FLPScheduler.oSchedule.oBlocks.FLPPlugins.aAsyncStepsLoading[0], "Notifications", "First step in the queue is correct");
        assert.strictEqual(FLPScheduler.oSchedule.oBlocks.FLPPlugins.aAsyncStepsLoading.length, 1, "Queue contains only one element.");
    });

    QUnit.test("Async mode: calling thrice for a new step will return two (async) steps and a wait", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.returns(false);
        // Set the first two steps to async loading
        FLPScheduler.oSchedule.oBlocks.FLPPlugins.LoadingSteps[0].canBeLoadedAsync = true;

        // Act
        var oStatusFirstCall = FLPScheduler.getNextLoadingStep();
        this.oIsStepLoadingStub.returns(true);
        var oStatusSecondCall = FLPScheduler.getNextLoadingStep();
        var oStatusThirdCall = FLPScheduler.getNextLoadingStep();

        // Assert
        assert.strictEqual(oStatusFirstCall.sStatus, oStatesDefinitions.step, "First call returns a step.");
        assert.strictEqual(oStatusFirstCall.oContent.LoadingStep, "ShellElements", "First call returns the expected step.");
        assert.strictEqual(oStatusSecondCall.sStatus, oStatesDefinitions.step, "Second call returns a step.");
        assert.strictEqual(oStatusSecondCall.oContent.LoadingStep, "Notifications", "Second call returns the expected step.");
        assert.strictEqual(oStatusThirdCall.sStatus, oStatesDefinitions.wait, "Third call returns a wait.");
    });

    QUnit.test("Async mode: The last async step of a Block won't trigger the next block", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.onFirstCall().returns(true);
        this.oIsStepLoadedStub.onSecondCall().returns(false);

        FLPScheduler.oSchedule.oBlocks.FLPPlugins.LoadingSteps[5].canBeLoadedAsync = true;
        FLPScheduler.oSchedule.oBlocks.FLPPlugins.iStepIndex = 4;
        FLPScheduler.oSchedule.oBlocks.FLPPlugins.aAsyncStepsLoading = [];
        FLPScheduler.oSchedule.aBlocksLoading = ["FLPPlugins"];

        // Act
        var oStatusFirstCall = FLPScheduler.getNextLoadingStep();
        this.oIsStepLoadingStub.returns(true);
        var oStatusSecondCall = FLPScheduler.getNextLoadingStep();

        // Assert
        assert.strictEqual(oStatusFirstCall.sStatus, oStatesDefinitions.step, "First call returns a step.");
        assert.strictEqual(oStatusFirstCall.oContent.LoadingStep, "ShellComplete", "First call returns the expected step.");
        assert.strictEqual(oStatusSecondCall.sStatus, oStatesDefinitions.wait, "Second call returns a wait.");

        FLPScheduler.oSchedule.oBlocks.FLPPlugins.LoadingSteps[5].canBeLoadedAsync = false;

    });

    QUnit.test("Async mode: sync loading carries on, independently of async loading", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.onCall(0).returns(false); // First call, async step loaded
        this.oIsStepLoadingStub.onCall(0).returns(false);
        this.oIsStepLoadedStub.onCall(1).returns(false); // Second call, async control
        this.oIsStepLoadingStub.onCall(1).returns(true);
        this.oIsStepLoadedStub.onCall(2).returns(false); // Third call, first sync step
        this.oIsStepLoadingStub.onCall(2).returns(true);
        this.oIsStepLoadedStub.onCall(3).returns(false); // Async control
        this.oIsStepLoadingStub.onCall(3).returns(true);
        this.oIsStepLoadedStub.onCall(4).returns(true); // First sync control
        this.oIsStepLoadingStub.onCall(4).returns(false);


        // Set the first two steps to async loading
        FLPScheduler.oSchedule.oBlocks.FLPPlugins.LoadingSteps[0].canBeLoadedAsync = true;

        // Act
        var oStatusFirstCall = FLPScheduler.getNextLoadingStep();
        this.oIsStepLoadingStub.returns(true);
        var oStatusSecondCall = FLPScheduler.getNextLoadingStep();
        var oStatusThirdCall = FLPScheduler.getNextLoadingStep();

        // Assert
        assert.strictEqual(oStatusFirstCall.sStatus, oStatesDefinitions.step, "First call returns a step.");
        assert.strictEqual(oStatusFirstCall.oContent.LoadingStep, "ShellElements", "First call returns the expected step.");
        assert.strictEqual(oStatusSecondCall.sStatus, oStatesDefinitions.step, "Second call returns a step.");
        assert.strictEqual(oStatusSecondCall.oContent.LoadingStep, "Notifications", "Second call returns the expected _sync_ step.");
        assert.strictEqual(oStatusThirdCall.sStatus, oStatesDefinitions.step, "Third call returns a step.");
        assert.strictEqual(oStatusThirdCall.oContent.LoadingStep, "UserImage", "Third call returns the expected _sync_ step.");
    });

    QUnit.test("Dependencies: Check if the dependencies are loaded", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.returns(false);
        FLPScheduler.oSchedule.oBlocks.aSuperBlock = {
            LoadingSteps: [
                    {
                        LoadingStep: "MessagePopOver",
                        "canBeLoadedAsync": false
                    }
            ]
        };
        FLPScheduler.oSchedule.aBlockOrder = ["aSuperBlock"];

        // Act
        FLPScheduler.getNextLoadingStep();

        assert.ok(this.oIsStepLoadedStub.calledWith("RendererExtensions"), "The dependency was checked.");
    });

    QUnit.test("Dependencies: Return a wait if waiting for a dependency", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.returns(false);
        this.oIsStepLoadingStub.onCall(0).returns(false);
        this.oIsStepLoadingStub.onCall(1).returns(true);
        FLPScheduler.oSchedule.oBlocks.aSuperBlock = {
            LoadingSteps: [
                    {
                        LoadingStep: "MessagePopOver",
                        "canBeLoadedAsync": false
                    },
                    {
                        LoadingStep: "Notifications",
                        "canBeLoadedAsync": false
                    }
            ]
        };
        FLPScheduler.oSchedule.aBlockOrder = ["aSuperBlock"];

        // Act
        var oStatusFirstCall = FLPScheduler.getNextLoadingStep();

        assert.strictEqual(oStatusFirstCall.sStatus, oStatesDefinitions.wait, "Wait was returned.");
        assert.ok(this.oSetForLoadingStep.called, "The Agent called the internal state.");
        assert.ok(this.oSetForLoadingStep.calledWith("MessagePopOver", state.id.loadingStep.WaitingForDependencies), "The Agent set the state of the step to waiting.");
    });

    QUnit.test("Dependencies: Return an error if dependencies cannot be resolved", function (assert) {
        // Arrange
        this.oIsStepLoadedStub.returns(false);

        // Arrange
        this.oIsStepLoadedStub.returns(false);
        FLPScheduler.oSchedule.oBlocks.aSuperBlock = {
            LoadingSteps: [
                    {
                        LoadingStep: "MessagePopOver",
                        "canBeLoadedAsync": false
                    }
            ]
        };
        FLPScheduler.oSchedule.aBlockOrder = ["aSuperBlock"];

        // Act
        var oStatusFirstCall = FLPScheduler.getNextLoadingStep();

        assert.strictEqual(oStatusFirstCall.sStatus, oStatesDefinitions.error, "An error was returned.");
        assert.ok(this.oSetForLoadingBlock.called, "The Agent called the internal state.");
        assert.ok(this.oSetForLoadingBlock.calledWith("aSuperBlock", state.id.loadingBlock.Aborted), "The Agent set the state of the block to aborted.");
        assert.ok(this.oSetForLoadingStep.called, "The Agent called the internal state.");
        assert.ok(this.oSetForLoadingStep.calledWith("MessagePopOver", state.id.loadingStep.Aborted), "The Agent set the state of the step to aborted.");
        assert.ok(this.oSetForModuleSpy.called, "The Agent called the internal state.");
        assert.ok(this.oSetForModuleSpy.calledWith(state.id.module.flpScheduler.id, state.id.module.flpScheduler.LoadingAborted), "The Agent set its state to aborted.");
    });

    QUnit.module("API - getNextLoadingStep - Helper functions", {
        beforeEach: function () {
            this.oIsBlockLoadedStub = sinon.stub(state, "isBlockLoaded");
            this.oIsStepLoadedStub = sinon.stub(state, "isStepLoaded");
            this.oIsStepLoadingStub = sinon.stub(state, "isStepLoading");
            this.oSetForLoadingStep = sinon.stub(state, "setForLoadingStep");
            this.oSetForLoadingBlock = sinon.stub(state, "setForLoadingBlock");
            this.oSetForModuleSpy = sinon.spy(state, "setForModule");
            this.oConfigStub = sinon.stub(Config, "last");

            FLPScheduler.oSchedule = {
                iBlockIndex: 0,
                iStepIndex: 0,
                aBlocksLoading: [],
                oBlocks: JSON.parse(JSON.stringify(oLoadingConfig.LoadingBlocks)),
                oSteps: JSON.parse(JSON.stringify(oStepConfig)),
                aBlockOrder: JSON.parse(JSON.stringify(oLoadingConfig.OrderOfLoadingBlocks))
            };
        },
        afterEach: function () {
            this.oIsBlockLoadedStub.restore();
            this.oIsStepLoadedStub.restore();
            this.oIsStepLoadingStub.restore();
            this.oSetForLoadingStep.restore();
            this.oSetForLoadingBlock.restore();
            this.oSetForModuleSpy.restore();
            this.oConfigStub.restore();
            FLPScheduler.oSchedule = {
                iBlockIndex: 0,
                iStepIndex: 0,
                aBlocksLoading: []
            };
        }
    });

    QUnit.test("_startLoadingBlock returns true if all blocks have been loaded", function (assert) {
        FLPScheduler.oSchedule.iBlockIndex = FLPScheduler.oSchedule.aBlockOrder.length;

        var bLoadingdone = FLPScheduler._startLoadingBlock();

        assert.ok(bLoadingdone, "True was returned.");
    });

    QUnit.test("_startLoadingBlock correctly initializes the next available block", function (assert) {
        var sFirstBlock = FLPScheduler.oSchedule.aBlockOrder[0];

        var bLoadingdone = FLPScheduler._startLoadingBlock();

        assert.notOk(bLoadingdone, "False was returned.");
        assert.strictEqual(FLPScheduler.oSchedule.aBlocksLoading[0], sFirstBlock, "The first block is on the loading queue.");
        assert.strictEqual(FLPScheduler.oSchedule.oBlocks[sFirstBlock].iStepIndex, 0, "The first block was initialized.");
        assert.strictEqual(FLPScheduler.oSchedule.iBlockIndex, 1, "Block index was updated.");
        assert.ok(Array.isArray(FLPScheduler.oSchedule.oBlocks[sFirstBlock].aAsyncStepsLoading), "The first block's async queue was initialized.");
    });

    QUnit.test("_loadingIsEnabled returns true if no excluded states defined", function (assert) {

        this.oConfigStub.returns("lean");
        var oStepNoConfig = {
            oConfig: {}
        };

        var oStepConfigEmpty = {
            oConfig: {
                excludedFLPStates: []
            }
        };

        var bFirstResponse = FLPScheduler._loadingIsEnabled(oStepNoConfig);
        var bSecondResponse = FLPScheduler._loadingIsEnabled(oStepConfigEmpty);

        assert.ok(bFirstResponse, "No FLPStates config: no need to skip.");
        assert.ok(bSecondResponse, "Empty FLPStates config: no need to skip.");
    });

    QUnit.test("_loadingIsEnabled queries sap/ushell/config for the current state if needed", function (assert) {

        this.oConfigStub.returns("lean");
        var oStep = {oConfig: oStepConfig.Notifications};

        FLPScheduler._loadingIsEnabled(oStep);

        assert.ok(this.oConfigStub.calledWith("/core/shell/model/currentState/stateName"), "FLP State checked.");
    });

    QUnit.test("_loadingIsEnabled returns true if no mandatory states defined", function (assert) {

        this.oConfigStub.returns("lean");
        var oStepNoConfig = {
            oConfig: {}
        };

        var oStepConfigEmpty = {
            oConfig: {
                mandatoryFLPStates: []
            }
        };

        var bFirstResponse = FLPScheduler._loadingIsEnabled(oStepNoConfig);
        var bSecondResponse = FLPScheduler._loadingIsEnabled(oStepConfigEmpty);

        assert.ok(bFirstResponse, "No mandatory state config: no need to skip.");
        assert.ok(bSecondResponse, "Empty mandatory state config: no need to skip.");
    });

    QUnit.test("_loadingIsEnabled returns false if the FLP state is excluded in its config, true otherwise", function (assert) {

        this.oConfigStub.onFirstCall().returns("lean");
        this.oConfigStub.onSecondCall().returns("lean-home");
        this.oConfigStub.onThirdCall().returns("over-the-rainbow");
        var oStep = {oConfig: oStepConfig.Notifications};

        var bFirstResponse = FLPScheduler._loadingIsEnabled(oStep);
        var bSecondResponse = FLPScheduler._loadingIsEnabled(oStep);
        var bThirdResponse = FLPScheduler._loadingIsEnabled(oStep);

        assert.notOk(bFirstResponse, "Notifications can't be loaded in lean mode.");
        assert.notOk(bSecondResponse, "Notifications can't be loaded in lean-home mode.");
        assert.ok(bThirdResponse, "Notifications can be loaded in other modes.");
    });

    QUnit.test("_loadingIsEnabled queries sap/ushell/config for an enabling switch if needed", function (assert) {

        this.oConfigStub.returns(false);

        var oStep = {
            oConfig: {
                configSwitch: {
                    path: "bla/bli/blup/enabled",
                    assertionValue: true
                }
            }
        };

        FLPScheduler._loadingIsEnabled(oStep);

        assert.ok(this.oConfigStub.calledWith("bla/bli/blup/enabled"), "Switch checked.");
    });

    QUnit.test("_loadingIsEnabled applies the configSwitch value (assertionValue === true)", function (assert) {

        this.oConfigStub.onFirstCall().returns(false);
        this.oConfigStub.onSecondCall().returns(true);

        var oStep = {
            oConfig: {
                configSwitch: {
                    path: "bla/bli/blup/enabled",
                    assertionValue: true
                }
            }
        };

        var bFirstCall = FLPScheduler._loadingIsEnabled(oStep);
        var bSecondCall = FLPScheduler._loadingIsEnabled(oStep);

        assert.notOk(bFirstCall, "Switch applied correctly.");
        assert.ok(bSecondCall, "Switch applied correctly.");
    });

    QUnit.test("_loadingIsEnabled applies the configSwitch value (assertionValue === false)", function (assert) {

        this.oConfigStub.onFirstCall().returns(false);
        this.oConfigStub.onSecondCall().returns(true);

        var oStep = {
            oConfig: {
                configSwitch: {
                    path: "bla/bli/blup/enabled",
                    assertionValue: false
                }
            }
        };

        var bFirstCall = FLPScheduler._loadingIsEnabled(oStep);
        var bSecondCall = FLPScheduler._loadingIsEnabled(oStep);

        assert.ok(bFirstCall, "Switch applied correctly.");
        assert.notOk(bSecondCall, "Switch applied correctly.");
    });

    QUnit.test("_loadingIsEnabled applies the configSwitch value (assertionValue is a String)", function (assert) {

        this.oConfigStub.onFirstCall().returns("Hey, load me!");
        this.oConfigStub.onSecondCall().returns("Hey, it's me!");
        this.oConfigStub.onThirdCall().returns(true);

        var oStep = {
            oConfig: {
                configSwitch: {
                    path: "bla/bli/blup/enabled",
                    assertionValue: "Hey, load me!"
                }
            }
        };

        var bFirstCall = FLPScheduler._loadingIsEnabled(oStep);
        var bSecondCall = FLPScheduler._loadingIsEnabled(oStep);
        var bThirdCall = FLPScheduler._loadingIsEnabled(oStep);

        assert.ok(bFirstCall, "Switch applied correctly.");
        assert.notOk(bSecondCall, "Switch applied correctly.");
        assert.notOk(bThirdCall, "Switch applied correctly.");
    });

    QUnit.test("_loadingIsEnabled returns true if the FLP state is mandatory, false otherwise", function (assert) {

        this.oConfigStub.onFirstCall().returns("lean");
        this.oConfigStub.onSecondCall().returns("lean-home");
        this.oConfigStub.onThirdCall().returns("over-the-rainbow");
        var oStep = {
            oConfig: {
                mandatoryFLPStates: ["over-the-rainbow"]
            }
        };
        var bFirstResponse = FLPScheduler._loadingIsEnabled(oStep);
        var bSecondResponse = FLPScheduler._loadingIsEnabled(oStep);
        var bThirdResponse = FLPScheduler._loadingIsEnabled(oStep);

        assert.notOk(bFirstResponse, "No mandatory loading in lean mode.");
        assert.notOk(bSecondResponse, "No mandatory loading in lean-home mode.");
        assert.ok(bThirdResponse, "Mandatory loading triggered.");
        assert.ok(this.oConfigStub.calledThrice, "The FLP state was checked three times");
    });

    QUnit.test("_loadingIsEnabled returns false for an excluded state and a false config value", function (assert) {

        this.oConfigStub.onFirstCall().returns("lean");
        this.oConfigStub.onSecondCall().returns(false);

        var oStep = {
            oConfig: {
                excludedFLPStates: ["lean"],
                configSwitch: {
                    path: "bla/bli/blup/enabled",
                    assertionValue: true
                }
            }
        };

        var bResult = FLPScheduler._loadingIsEnabled(oStep);

        assert.notOk(bResult, "Excluded State + False config.");
    });

    QUnit.test("_loadingIsEnabled returns false for a non-excluded state and a false config value", function (assert) {

        this.oConfigStub.onFirstCall().returns("over-the-rainbow");
        this.oConfigStub.onSecondCall().returns(false);

        var oStep = {
            oConfig: {
                excludedFLPStates: ["lean"],
                configSwitch: {
                    path: "bla/bli/blup/enabled",
                    assertionValue: true
                }
            }
        };

        var bResult = FLPScheduler._loadingIsEnabled(oStep);

        assert.notOk(bResult, "Non-Excluded State + False config.");
    });

    QUnit.test("_loadingIsEnabled returns false for an excluded state and a true config value", function (assert) {

        this.oConfigStub.onFirstCall().returns("lean");
        this.oConfigStub.onSecondCall().returns(true);

        var oStep = {
            oConfig: {
                excludedFLPStates: ["lean"],
                configSwitch: {
                    path: "bla/bli/blup/enabled",
                    assertionValue: true
                }
            }
        };

        var bResult = FLPScheduler._loadingIsEnabled(oStep);

        assert.notOk(bResult, "Excluded State + True config.");
    });

    QUnit.test("_loadingIsEnabled returns true for a non-excluded state and a true config value", function (assert) {

        this.oConfigStub.onFirstCall().returns("over-the-rainbow");
        this.oConfigStub.onSecondCall().returns(true);

        var oStep = {
            oConfig: {
                excludedFLPStates: ["lean"],
                configSwitch: {
                    path: "bla/bli/blup/enabled",
                    assertionValue: true
                }
            }
        };

        var bResult = FLPScheduler._loadingIsEnabled(oStep);

        assert.ok(bResult, "Non-Excluded State + True config.");
    });

    QUnit.test("_prepareStepForLoading returns a 'skip' object, if _loadingIsEnabled returns false", function (assert) {

        var oLoadingEnabledStub = sinon.stub(FLPScheduler, "_loadingIsEnabled").returns(false);

        var sBlockName = "FLPPlugins";
        var oCurrentBlock = FLPScheduler.oSchedule.oBlocks[sBlockName];
        var iStepIndex = 0;

        var oStep = FLPScheduler._prepareStepForLoading(oCurrentBlock, sBlockName, iStepIndex);

        assert.strictEqual(oStep.sStatus, oStatesDefinitions.skipped, "A skip step was returned.");
        assert.ok(this.oSetForLoadingStep.calledWith("ShellElements", state.id.loadingStep.Skipped), "The Agent set the state of the step to skipped.");
        oLoadingEnabledStub.restore();
    });

    QUnit.test("_prepareStepForLoading updates the step index if a step needs to be skipped", function (assert) {

        var oLoadingEnabledStub = sinon.stub(FLPScheduler, "_loadingIsEnabled").returns(false);

        var sBlockName = "FLPPlugins";
        var oCurrentBlock = FLPScheduler.oSchedule.oBlocks[sBlockName];
        var iStepIndex = 1;

        var oStep = FLPScheduler._prepareStepForLoading(oCurrentBlock, sBlockName, iStepIndex);

        assert.strictEqual(oStep.sStatus, oStatesDefinitions.skipped, "A skip step was returned.");
        assert.strictEqual(oCurrentBlock.iStepIndex, 1, "The step index was correctly updated.");
        oLoadingEnabledStub.restore();
    });
});
