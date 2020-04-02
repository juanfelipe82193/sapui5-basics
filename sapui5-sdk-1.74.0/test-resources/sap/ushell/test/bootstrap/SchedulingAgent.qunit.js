// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.bootstrap.SchedulingAgent
 */
sap.ui.require([
    "sap/ushell/bootstrap/SchedulingAgent",
    "sap/ushell/bootstrap/_SchedulingAgent/FLPScheduler",
    "sap/ushell/bootstrap/_SchedulingAgent/EventProcessor",
    "sap/ushell/bootstrap/_SchedulingAgent/FLPLoader",
    "sap/ushell/bootstrap/_SchedulingAgent/state",
    "sap/ushell/bootstrap/_SchedulingAgent/logger",
    "sap/ushell/EventHub"
], function (
    ControlUnit,
    FLPScheduler,
    EventProcessor,
    FLPLoader,
    state,
    logger,
    EventHub
) {
    "use strict";

    /* global sap, sinon, QUnit */

    QUnit.module("Basic Structure", {
        afterEach: function () {
        }
    });

    QUnit.test("The agent is succesfully loaded", function (assert) {
        assert.strictEqual(typeof ControlUnit, "object", "Agent module loaded.");
    });

    QUnit.test("The Control Unit has has a promise tracker", function (assert) {
        assert.strictEqual(typeof ControlUnit.oComponentsLoading, "object", "Current State exists.");
    });


    // Control Unit methods
    QUnit.module("API - Control Unit Interface", {
        beforeEach: function () {
            this.oSchedulerInitStub = sinon.stub(FLPScheduler, "initializeSchedule");
            this.oEventProcessorStub = sinon.stub(EventProcessor, "initializeStepDoneListener").returns({});
            this.oSetForModule = sinon.stub(state, "setForModule").returns({});
            this.oEventreceivedStub = sinon.stub(ControlUnit, "eventReceived").returns({});
            this.oClearStateStub = sinon.stub(state, "clear").returns({});
            this.oClearHistoryStub = sinon.stub(logger, "clearHistory").returns({});
        },
        afterEach: function () {
            this.oSchedulerInitStub.restore();
            this.oEventProcessorStub.restore();
            this.oSetForModule.restore();
            this.oEventreceivedStub.restore();
            this.oClearStateStub.restore();
            this.oClearHistoryStub.restore();
        }

    });

    QUnit.test("_initialize updates its own state", function (assert) {
        var done = assert.async();
        var oPromise = Promise.resolve(true);
        this.oSchedulerInitStub.returns(oPromise);


        ControlUnit._initialize();

        oPromise.then(function () {
            assert.ok(this.oSetForModule.called, "The Agent called the internal state.");
            assert.ok(this.oSetForModule.calledWith(state.id.module.schedulingAgent.id, state.id.module.schedulingAgent.Initializing), "The Agent set the state to initializing.");
            done();
        }.bind(this));
    });

    QUnit.test("_initialize starts the scheduler", function (assert) {
        var done = assert.async();
        var oPromise = Promise.resolve(true);
        this.oSchedulerInitStub.returns(oPromise);


        ControlUnit._initialize();

        oPromise.then(function () {
            assert.ok(this.oSchedulerInitStub.calledOnce, "The Agent initializes the scheduler");
            done();
        }.bind(this));
    });

    QUnit.test("In case of configuration error, update the state and return", function (assert) {
        var done = assert.async();
        var oPromise = Promise.resolve(false);
        this.oSchedulerInitStub.returns(oPromise);

        ControlUnit._initialize();

        oPromise.then(function () {
            assert.ok(this.oSetForModule.called, "The Agent called the internal state.");
            assert.ok(this.oSetForModule.calledWith(state.id.module.schedulingAgent.id, state.id.module.schedulingAgent.FatalError), "The Agent set the state to Error.");
            assert.notOk(this.oEventreceivedStub.calledOnce, "Flow stopped.");
            done();
        }.bind(this));
    });

    QUnit.test("_initialize starts the EventProcessor", function (assert) {
        var done = assert.async();
        var oPromise = Promise.resolve(true);
        this.oSchedulerInitStub.returns(oPromise);

        ControlUnit._initialize();

        oPromise.then(function () {
            assert.ok(this.oEventProcessorStub.calledOnce, "EventProcessor started");
            done();
        }.bind(this));
    });

    QUnit.test("_initialize clears the state", function (assert) {
        var done = assert.async();
        var oPromise = Promise.resolve(true);
        this.oSchedulerInitStub.returns(oPromise);

        ControlUnit._initialize();

        oPromise.then(function () {
            assert.ok(this.oClearStateStub.calledOnce, "State cleared.");
            done();
        }.bind(this));
    });

    QUnit.test("_initialize clears the history", function (assert) {
        var done = assert.async();
        var oPromise = Promise.resolve(true);
        this.oSchedulerInitStub.returns(oPromise);

        ControlUnit._initialize();

        oPromise.then(function () {
            assert.ok(this.oClearHistoryStub.calledOnce, "History cleared.");
            done();
        }.bind(this));
    });

    QUnit.test("_initialize sets itself to ready, once initialization is done", function (assert) {
        var done = assert.async();
        var oPromise = Promise.resolve(true);
        this.oSchedulerInitStub.returns(oPromise);

        ControlUnit._initialize();

        oPromise.then(function () {
            assert.ok(this.oSetForModule.called, "The Agent called the internal state.");
            assert.ok(this.oSetForModule.calledWith(state.id.module.schedulingAgent.id, state.id.module.schedulingAgent.Initialized), "The Agent set the state to initialized.");
            done();
        }.bind(this));
    });

    QUnit.test("_initialize starts the loading flow", function (assert) {
        var done = assert.async();
        var oPromise = Promise.resolve(true);
        this.oSchedulerInitStub.returns(oPromise);
        this.oEventreceivedStub.returns(undefined);

        ControlUnit._initialize();

        oPromise.then(function () {
            assert.ok(this.oEventreceivedStub.calledOnce, "eventReceived called.");
            done();
        }.bind(this));
    });

    // Logging
    QUnit.test("dumpState logs the internal state", function (assert) {
        var oStateDumpSpy = sinon.stub(state, "dump");

        ControlUnit.dumpState();

        assert.ok(oStateDumpSpy.calledOnce, "Internal State logged to console.");

        oStateDumpSpy.restore();
    });

    QUnit.test("dumpHistory logs the whole history", function (assert) {
        var oLoggerDumpSpy = sinon.stub(logger, "dumpHistory");

        ControlUnit.dumpHistory();

        assert.ok(oLoggerDumpSpy.calledOnce, "History logged to console.");

        oLoggerDumpSpy.restore();
    });

    QUnit.test("dumpSchedule logs the current schedulep", function (assert) {
        var oSchedulerDumpSpy = sinon.stub(FLPScheduler, "dumpSchedule");

        ControlUnit.dumpSchedule();

        assert.ok(oSchedulerDumpSpy.calledOnce, "Schedule logged to console.");

        oSchedulerDumpSpy.restore();
    });

    QUnit.test("dumpAll logs all available logs to the console", function (assert) {
        var oStateDumpSpy = sinon.stub(state, "dump");
        var oLoggerDumpSpy = sinon.stub(logger, "dumpHistory");
        var oSchedulerDumpSpy = sinon.stub(FLPScheduler, "dumpSchedule");

        ControlUnit.dumpAll();

        assert.ok(oSchedulerDumpSpy.calledOnce, "Schedule logged to console.");
        assert.ok(oLoggerDumpSpy.calledOnce, "History logged to console.");
        assert.ok(oStateDumpSpy.calledOnce, "Internal State logged to console.");

        oSchedulerDumpSpy.restore();
        oLoggerDumpSpy.restore();
        oStateDumpSpy.restore();
    });

    // Preparing a step
    QUnit.module("_processStepConfiguration", {
        beforeEach: function () {
            this.oStep = {
                sStatus: "Step",
                oContent: {
                    LoadingStep: "bliblablup"
                },
                oConfig: {
                    "loadingMode": "byEvent",
                    "byEvent": {
                        "eventName": "loadMessagePopover",
                        "eventData": {}
                    },
                    "Dependencies": ["RendererExtensions"]
                }
            };
        },
        afterEach: function () {
            this.oStep = null;
        }
    });

    QUnit.test("Returns an object with the correct fields", function (assert) {
        var oStepConfig = ControlUnit._processStepConfiguration(this.oStep);

        assert.strictEqual(typeof oStepConfig, "object", "Returned an object.");
        assert.strictEqual(typeof oStepConfig.sStepName, "string", "sStepName is a string.");
        assert.strictEqual(typeof oStepConfig.sStepType, "string", "sStepType is a string.");
        assert.strictEqual(typeof oStepConfig.oData, "object", "oData is an object.");
        assert.strictEqual(typeof oStepConfig.bConfigOk, "boolean", "ConfigOk is a boolean.");
    });

    QUnit.test("Returns an event listener object for 'continueOnEvent'", function (assert) {
        this.oStep.oConfig = {
            "loadingMode": "continueOnEvent",
            "continueOnEvent": {
                "eventName": "RendererExtensionsPluginLoaded"
            },
            "userCanTrigger": false,
            "canBeInterrupted": false
        };

        var oStepConfig = ControlUnit._processStepConfiguration(this.oStep);

        assert.ok(oStepConfig.bConfigOk, "Configuration validated.");
        assert.strictEqual(oStepConfig.sStepType, "continueOnEvent", "Type of step is continueOnEvent.");
        assert.strictEqual(oStepConfig.sStepName, "bliblablup", "Step Name is correct.");
        assert.strictEqual(oStepConfig.oData.eventName, "RendererExtensionsPluginLoaded", "EventName is correct.");
        assert.strictEqual(oStepConfig.oData.stepName, "bliblablup", "Step name is correct.");
    });

    QUnit.test("Returns an event loader object for 'byEvent'", function (assert) {
        this.oStep.oConfig = {
            "loadingMode": "byEvent",
            "byEvent": {
                "eventName": "loadMessagePopover",
                "eventData": "blu"
            },
            "Dependencies": ["RendererExtensions"]
        };


        var oStepConfig = ControlUnit._processStepConfiguration(this.oStep);

        assert.ok(oStepConfig.bConfigOk, "Configuration validated.");
        assert.strictEqual(oStepConfig.sStepType, "byEvent", "Type of step is byEvent.");
        assert.strictEqual(oStepConfig.sStepName, "bliblablup", "Step Name is correct.");
        assert.strictEqual(oStepConfig.oData.eventName, "loadMessagePopover", "EventName is correct.");
        assert.strictEqual(oStepConfig.oData.eventData.data, "blu", "Event data is correct.");
        assert.strictEqual(oStepConfig.oData.eventData.stepName, "bliblablup", "Step name passed to the event.");
    });

    QUnit.test("Returns an event loader object for 'byComponentCreate'", function (assert) {
        this.oStep.oConfig = {
            "loadingMode": "byComponentCreate",
            "byComponentCreate": {
                "enabled": true,
                "ui5ComponentOptions": {
                    "name": "sap.ushell.components.shell.ShellElements"
                },
                "url": "sap/ushell/components/shell/ShellElements"
            },
            "Dependencies": ["CoreExtLight"],
            "userCanTrigger": false,
            "canBeInterrupted": false
        };

        var oStepConfig = ControlUnit._processStepConfiguration(this.oStep);

        assert.ok(oStepConfig.bConfigOk, "Configuration validated.");
        assert.strictEqual(oStepConfig.sStepType, "byComponentCreate", "Type of step is byComponentCreate.");
        assert.strictEqual(oStepConfig.sStepName, "bliblablup", "Step Name is correct.");
        assert.deepEqual(oStepConfig.oData, { name: "sap.ushell.components.shell.ShellElements" }, "Component name is correct.");
    });

    QUnit.test("Returns an event loader object for 'waitInMs'", function (assert) {
        this.oStep.oConfig = {
            "loadingMode": "waitInMs",
            "waitInMs": {
                "waitingTime": 3000
            },
            "mandatoryFLPstates": ["app"],
            "Dependencies": ["CoreExtLight"],
            "userCanTrigger": false,
            "canBeInterrupted": false
        };

        var oStepConfig = ControlUnit._processStepConfiguration(this.oStep);

        assert.ok(oStepConfig.bConfigOk, "Configuration validated.");
        assert.strictEqual(oStepConfig.sStepType, "waitInMs", "Type of step is waitInMs.");
        assert.strictEqual(oStepConfig.sStepName, "bliblablup", "Step Name is correct.");
        assert.strictEqual(oStepConfig.oData.sStepName, "bliblablup", "Step name is correct.");
        assert.strictEqual(oStepConfig.oData.iWaitingTime, 3000, "Waiting time is correct.");
    });

    QUnit.test("Returns an event loader object for 'byRequire'", function (assert) {
        this.oStep.oConfig = {
            "loadingMode": "byRequire",
            "byRequire": {
                "path": "sap/ushell/components/shell/ShellElements"
            },
            "Dependencies": ["CoreExtLight"],
            "userCanTrigger": false,
            "canBeInterrupted": false
        };

        var oStepConfig = ControlUnit._processStepConfiguration(this.oStep);

        assert.ok(oStepConfig.bConfigOk, "Configuration validated.");
        assert.strictEqual(oStepConfig.sStepType, "byRequire", "Type of step is byRequire.");
        assert.strictEqual(oStepConfig.sStepName, "bliblablup", "Step Name is correct.");
        assert.strictEqual(oStepConfig.oData.sPath, "sap/ushell/components/shell/ShellElements", "Component name is correct.");
        assert.strictEqual(oStepConfig.oData.sStepName, "bliblablup", "Step Name is correct.");
    });

    // Handling of the steps.
    QUnit.module("eventReceived", {
        beforeEach: function () {
            this.oSchedulerNextStep = sinon.stub(FLPScheduler, "getNextLoadingStep");
            this.oEventProcessorStub = sinon.stub(EventProcessor, "listenToEvent");
            this.oEventProcessorEnd = sinon.stub(EventProcessor, "unregisterStepDoneListener");
            this.oLoadByEventStub = sinon.stub(FLPLoader, "loadComponentByEvent");
            this.oLoadByCreateStub = sinon.stub(FLPLoader, "loadComponentByComponentCreate");
            this.oLoadByRequireStub = sinon.stub(FLPLoader, "loadComponentByRequire");
            this.oSetForStep = sinon.stub(state, "setForLoadingStep");
            this.oSetForModule = sinon.stub(state, "setForModule");
            this.oStep = {
                sStatus: "step",
                oConfig: {},
                oContent: {
                    LoadingStep: "dumdidum"
                }
            };
        },
        afterEach: function () {
            this.oSchedulerNextStep.restore();
            this.oEventProcessorStub.restore();
            this.oEventProcessorEnd.restore();
            this.oLoadByEventStub.restore();
            this.oLoadByCreateStub.restore();
            this.oLoadByRequireStub.restore();
            this.oSetForStep.restore();
            this.oSetForModule.restore();
        }

    });

    QUnit.test("An event processor call triggers a call for the next step", function (assert) {
        this.oSchedulerNextStep.returns({sStatus: "done"});

        ControlUnit.eventReceived();

        assert.ok(this.oSchedulerNextStep.calledOnce, "NextStep called after an event was received.");
        assert.ok(this.oSetForModule.calledWith(state.id.module.schedulingAgent.id, state.id.module.schedulingAgent.Working), "The Agent set the state to GetStep.");
    });

    QUnit.test("If the step is an error, update state and end the scheduler", function (assert) {
        this.oStep.sStatus = "error";

        this.oSchedulerNextStep.returns(this.oStep);

        ControlUnit.eventReceived();

        assert.ok(this.oSetForModule.calledWith(state.id.module.schedulingAgent.id, state.id.module.schedulingAgent.FatalError), "The Agent set the state to Error.");
        assert.ok(this.oEventProcessorEnd.called, "The Agent turned off the EventProcessor.");
    });

    QUnit.test("If the step calls to wait, do nothing", function (assert) { // how do I test this???
        this.oStep.sStatus = "wait";

        this.oSchedulerNextStep.returns(this.oStep);

        ControlUnit.eventReceived();

        assert.ok(this.oSetForModule.calledWith(state.id.module.schedulingAgent.id, state.id.module.schedulingAgent.Waiting), "The Agent set the state to Waiting.");
    });

    QUnit.test("If the step reports the scheduling done, update the state and finish", function (assert) {
        this.oStep.sStatus = "done";

        this.oSchedulerNextStep.returns(this.oStep);

        ControlUnit.eventReceived();

        assert.ok(this.oSetForModule.calledWith(state.id.module.schedulingAgent.id, state.id.module.schedulingAgent.Done), "The Agent finished execution.");
        assert.ok(this.oEventProcessorEnd.called, "The Agent turned off the EventProcessor.");
    });

    QUnit.test("If the step configuration is faulty, update state", function (assert) {
        var oStepConfig = {
            sStepType: "continueOnEvent",
            sStepName: "myDuperStep",
            oData: {
                eventName: "mySuperEvent",
                stepName: "myDuperStep"
            },
            bConfigOk: false // so true
        };

        var oProcessConfigStub = sinon.stub(ControlUnit, "_processStepConfiguration").returns(oStepConfig);
        this.oSchedulerNextStep.onFirstCall().returns(this.oStep);
        // To jump out of the main loop
        this.oSchedulerNextStep.onSecondCall().returns({sStatus: "wait"});

        ControlUnit.eventReceived();

        assert.ok(this.oSetForStep.calledWith("myDuperStep", state.id.loadingStep.Abort), "Step updated to aborted.");
        assert.ok(this.oSetForStep.calledWith("myDuperStep", state.id.loadingStep.Skipped), "The Agent set the step to done.");
        assert.ok(this.oSetForModule.calledWith(state.id.module.schedulingAgent.id, state.id.module.schedulingAgent.FatalError), "The Agent set the state to Error.");
        oProcessConfigStub.restore();

    });

    QUnit.test("If the step is continueOnEvent, call the EventProcessor", function (assert) {
        // Arrange
        this.oStep.sStatus = "step";
        var oStepConfig = {
            sStepType: "continueOnEvent",
            sStepName: "myDuperStep",
            oData: {
                eventName: "mySuperEvent",
                stepName: "myDuperStep"
            },
            bConfigOk: true // so true
        };
        var oProcessConfigStub = sinon.stub(ControlUnit, "_processStepConfiguration").returns(oStepConfig);
        this.oSchedulerNextStep.onCall(0).returns(this.oStep);
        // need to break the Agent's loop!
        this.oSchedulerNextStep.onCall(1).returns({sStatus: "done"});

        // Act
        ControlUnit.eventReceived();

        // Assert
        assert.ok(this.oEventProcessorStub.calledOnce, "The EventProcessor was called.");
        assert.ok(this.oEventProcessorStub.calledWith(oStepConfig.oData), "Event Processor called with the correct object.");
        assert.ok(this.oSetForStep.calledWith("myDuperStep", state.id.loadingStep.InProgress, "mySuperEvent"), "Step updated to in progress.");
        oProcessConfigStub.restore();
    });

    QUnit.test("If the step is byEvent, call the FLPLoader", function (assert) {
        // Arrange
        this.oStep.sStatus = "step";
        var oStepConfig = {
            sStepType: "byEvent",
            sStepName: "myDuperStep",
            oData: {
                eventName: "mySuperEvent",
                eventData: {
                    data: "myDuperSuperData",
                    stepName: "myDuperStep"
                }
            },
            bConfigOk: true // so true
        };
        var oProcessConfigStub = sinon.stub(ControlUnit, "_processStepConfiguration").returns(oStepConfig);
        this.oSchedulerNextStep.returns(this.oStep);
        // need to break the Agent's loop!
        this.oSchedulerNextStep.onCall(1).returns({sStatus: "done"});

        // Act
        ControlUnit.eventReceived();

        // Assert
        assert.ok(this.oLoadByEventStub.calledOnce, "The FLP loader was called.");
        assert.ok(this.oLoadByEventStub.calledWith(oStepConfig.oData), "FLP loader called with the correct object.");
        assert.ok(this.oSetForStep.calledWith("myDuperStep", state.id.loadingStep.InProgress, oStepConfig.oData), "Step updated to in progress.");

        oProcessConfigStub.restore();
    });

    QUnit.test("If the step is waitInMs, call the FLPLoader", function (assert) {
        // Arrange
        this.oStep.sStatus = "step";
        var oStepConfig = {
            sStepType: "waitInMs",
            sStepName: "under Pressure",
            oData: {
                iWaitingTime: 3000,
                sStepName: "under Pressure"
            },
            bConfigOk: true // still so true
        };

        var oProcessConfigStub = sinon.stub(ControlUnit, "_processStepConfiguration").returns(oStepConfig);
        var oWaitInMsStub = sinon.stub(FLPLoader, "waitInMs").returns(undefined);

        this.oSchedulerNextStep.returns(this.oStep);
        // need to break the Agent's loop!
        this.oSchedulerNextStep.onCall(1).returns({sStatus: "done"});

        // Act
        ControlUnit.eventReceived();

        // Assert
        assert.ok(oWaitInMsStub.calledOnce, "The FLP loader was called.");
        assert.ok(oWaitInMsStub.calledWith(oStepConfig.oData), "FLP loader called with the correct object.");
        assert.ok(this.oSetForStep.calledWith("under Pressure", state.id.loadingStep.InProgress, oStepConfig.oData.iWaitingTime+"ms"), "Step updated to in progress.");

        oProcessConfigStub.restore();
    });

    QUnit.test("If the step is byComponentCreate, resolving the promise finishes the step loading and emits stepdone", function (assert) {
        // Arrange
        var done = assert.async();
        this.oStep.sStatus = "step";
        var oStepConfig = {
            sStepType: "byComponentCreate",
            sStepName: "myDuperStep",
            oData: "sap.ui.my.duper.component",
            bConfigOk: true // so true
        };
        var oDoneStep = {
            sStatus: "done",
            oConfig: {},
            oContent: {
                LoadingStep: "dumdidum"
            }
        };
        var oPromise = Promise.resolve();
        assert.expect(7);
        var oProcessConfigStub = sinon.stub(ControlUnit, "_processStepConfiguration").returns(oStepConfig);
        var oEventHubSpy = sinon.spy(EventHub, "emit");
        this.oSchedulerNextStep.onCall(0).returns(this.oStep);
        // we stop the loading after the first call
        this.oSchedulerNextStep.onCall(1).returns(oDoneStep);
        this.oLoadByCreateStub.returns(oPromise);
        // need to break the Agent's loop!
        this.oSchedulerNextStep.onCall(1).returns({sStatus: "done"});

        // Act
        ControlUnit.eventReceived();

        // Assert
        assert.ok(this.oLoadByCreateStub.calledOnce, "The FLP loader was called.");
        assert.ok(this.oLoadByCreateStub.calledWith("sap.ui.my.duper.component"), "FLP loader called with the correct object.");
        assert.ok(this.oSetForStep.calledWith("myDuperStep", state.id.loadingStep.InProgress, oStepConfig.oData), "Step updated to in progress.");
        assert.ok(ControlUnit.oComponentsLoading.myDuperStep === oPromise, "Promise was stored.");

        oPromise.then(function () {
            assert.ok(oEventHubSpy.calledWith("StepDone"), "The step done event was triggred");
            // internal state
            assert.ok(this.oSetForStep.calledWith("myDuperStep", state.id.loadingStep.InProgress), "Loading step updated.");
            // deleted
            assert.ok(ControlUnit.oComponentsLoading.myDuperStep === undefined, "Promise was erased.");

            delete ControlUnit.oComponentsLoading.myDuperStep;
            oProcessConfigStub.restore();
            oEventHubSpy.restore();
            done();
       }.bind(this));
    });

    QUnit.test("If the step is byComponentCreate, rejecting the promise finishes the step loading and emits stepfailed", function (assert) {
        // Arrange
        var done = assert.async();
        this.oStep.sStatus = "step";
        var oStepConfig = {
            sStepType: "byComponentCreate",
            sStepName: "myDuperStep",
            oData: "sap.ui.my.duper.component",
            bConfigOk: true // so true
        };
        var oDoneStep = {
            sStatus: "done",
            oConfig: {},
            oContent: {
                LoadingStep: "dumdidum"
            }
        };
        var oPromise = Promise.reject();
        assert.expect(7);
        var oProcessConfigStub = sinon.stub(ControlUnit, "_processStepConfiguration").returns(oStepConfig);
        var oEventHubSpy = sinon.spy(EventHub, "emit");
        this.oSchedulerNextStep.onCall(0).returns(this.oStep);
        // we stop the loading after the first call
        this.oSchedulerNextStep.onCall(1).returns(oDoneStep);
        this.oLoadByCreateStub.returns(oPromise);
        // need to break the Agent's loop!
        this.oSchedulerNextStep.onCall(1).returns({sStatus: "done"});

        // Act
        ControlUnit.eventReceived();

        // Assert
        assert.ok(this.oLoadByCreateStub.calledOnce, "The FLP loader was called.");
        assert.ok(this.oLoadByCreateStub.calledWith("sap.ui.my.duper.component"), "FLP loader called with the correct object.");
        assert.ok(this.oSetForStep.calledWith("myDuperStep", state.id.loadingStep.InProgress, oStepConfig.oData), "Step updated to in progress.");
        assert.ok(ControlUnit.oComponentsLoading.myDuperStep === oPromise, "Promise was stored.");

        oPromise.then(function () {}, function () {
            assert.ok(oEventHubSpy.calledWith("StepFailed"), "The step done event was triggred");
            // internal state
            assert.ok(this.oSetForStep.calledWith("myDuperStep", state.id.loadingStep.FatalError), "Loading step updated.");
            // deleted
            assert.ok(ControlUnit.oComponentsLoading.myDuperStep === undefined, "Promise was erased.");

            delete ControlUnit.oComponentsLoading.myDuperStep;
            oProcessConfigStub.restore();
            oEventHubSpy.restore();
            done();
       }.bind(this));
    });

    QUnit.test("If the step is byRequire, resolving the promise finishes the step loading and emits stepdone", function (assert) {
        // Arrange
        var done = assert.async();
        this.oStep.sStatus = "step";
        var oStepConfig = {
            sStepType: "byRequire",
            sStepName: "myDuperStep",
            oData: {
                sPath: "sap.ui.my.duper.component",
                sStepName: "myDuperStep"
            },
            bConfigOk: true // so true
        };
        var oDoneStep = {
            sStatus: "done",
            oConfig: {},
            oContent: {
                LoadingStep: "dumdidum"
            }
        };
        var oPromise = Promise.resolve();
        assert.expect(7);
        var oProcessConfigStub = sinon.stub(ControlUnit, "_processStepConfiguration").returns(oStepConfig);
        var oEventHubSpy = sinon.spy(EventHub, "emit");
        this.oSchedulerNextStep.onCall(0).returns(this.oStep);
        // we stop the loading after the first call
        this.oSchedulerNextStep.onCall(1).returns(oDoneStep);
        this.oLoadByRequireStub.returns(oPromise);
        // need to break the Agent's loop!
        this.oSchedulerNextStep.onCall(1).returns({sStatus: "done"});

        // Act
        ControlUnit.eventReceived();

        // Assert
        assert.ok(this.oLoadByRequireStub.calledOnce, "The FLP loader was called.");
        assert.ok(this.oLoadByRequireStub.calledWith("sap.ui.my.duper.component"), "FLP loader called with the correct object.");
        assert.ok(this.oSetForStep.calledWith("myDuperStep", state.id.loadingStep.InProgress, oStepConfig.oData.sPath), "Step updated to in progress.");
        assert.ok(ControlUnit.oPathsLoading.myDuperStep === oPromise, "Promise was stored.");

        oPromise.then(function () {
            assert.ok(oEventHubSpy.calledWith("StepDone"), "The step done event was triggred");
            // internal state
            assert.ok(this.oSetForStep.calledWith("myDuperStep", state.id.loadingStep.InProgress), "Loading step updated.");
            // deleted
            assert.ok(ControlUnit.oPathsLoading.myDuperStep === undefined, "Promise was erased.");

            delete ControlUnit.oPathsLoading.myDuperStep;
            oProcessConfigStub.restore();
            oEventHubSpy.restore();
            done();
       }.bind(this));
    });

    QUnit.test("If the step is byRequire, rejecting the promise finishes the step loading and emits stepfailed", function (assert) {
        // Arrange
        var done = assert.async();
        this.oStep.sStatus = "step";
        var oStepConfig = {
            sStepType: "byRequire",
            sStepName: "myDuperStep",
            oData: {
                sPath: "sap.ui.my.duper.component",
                sStepName: "myDuperStep"
            },
            bConfigOk: true // so true
        };
        var oDoneStep = {
            sStatus: "done",
            oConfig: {},
            oContent: {
                LoadingStep: "dumdidum"
            }
        };
        var oPromise = Promise.reject();
        assert.expect(7);
        var oProcessConfigStub = sinon.stub(ControlUnit, "_processStepConfiguration").returns(oStepConfig);
        var oEventHubSpy = sinon.spy(EventHub, "emit");
        this.oSchedulerNextStep.onCall(0).returns(this.oStep);
        // we stop the loading after the first call
        this.oSchedulerNextStep.onCall(1).returns(oDoneStep);
        this.oLoadByRequireStub.returns(oPromise);
        // need to break the Agent's loop!
        this.oSchedulerNextStep.onCall(1).returns({sStatus: "done"});

        // Act
        ControlUnit.eventReceived();

        // Assert
        assert.ok(this.oLoadByRequireStub.calledOnce, "The FLP loader was called.");
        assert.ok(this.oLoadByRequireStub.calledWith("sap.ui.my.duper.component"), "FLP loader called with the correct object.");
        assert.ok(this.oSetForStep.calledWith("myDuperStep", state.id.loadingStep.InProgress, oStepConfig.oData.sPath), "Step updated to in progress.");
        assert.ok(ControlUnit.oPathsLoading.myDuperStep === oPromise, "Promise was stored.");

        oPromise.then(function () {}, function () {
            assert.ok(oEventHubSpy.calledWith("StepFailed"), "The step done event was triggred");
            // internal state
            assert.ok(this.oSetForStep.calledWith("myDuperStep", state.id.loadingStep.FatalError), "Loading step updated.");
            // deleted
            assert.ok(ControlUnit.oComponentsLoading.myDuperStep === undefined, "Promise was erased.");

            delete ControlUnit.oComponentsLoading.myDuperStep;
            oProcessConfigStub.restore();
            oEventHubSpy.restore();
            done();
       }.bind(this));
    });
});
