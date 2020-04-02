// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Integration tests for SchedulingAgent
 */
sap.ui.require([
    "sap/ushell/bootstrap/SchedulingAgent",
    "sap/ushell/bootstrap/_SchedulingAgent/state",
    "sap/base/util/LoaderExtensions",
    "sap/ushell/EventHub",
    "sap/ui/core/Component",
    "sap/base/util/LoaderExtensions",
    "sap/ushell/Config"
], function (
    SchedulingAgent,
    DeepState,
    LoaderExtensions,
    EventHub,
    Component,
    Loader,
    Config
) {
    "use strict";

    /* global sap, sinon, QUnit */

    var oLoadingConfigurationMock = {
        OrderOfLoadingBlocks: [
            "AfterLoadPluginsCall",
            "FLPPlugins"
        ],
        LoadingBlocks: {
            AfterLoadPluginsCall: {
                LoadingSteps: [
                    {
                        LoadingStep: "StartScheduler",
                        canBeLoadedAsync: false
                    },
                    {
                        LoadingStep: "LoadRendererExtensions",
                        canBeLoadedAsync: false
                    },
                    {
                        LoadingStep: "MessagePopoverInit",
                        canBeLoadedAsync: true
                    },
                    {
                        LoadingStep: "UsageAnalytics",
                        canBeLoadedAsync: true
                    }
                ],
                maxWaitInMs: 3000
            },
            FLPPlugins: {
                LoadingSteps: [
                    {
                        LoadingStep: "ConditionalWaitForAppLoading",
                        canBeLoadedAsync: false
                    },
                    {
                        LoadingStep: "Notifications",
                        canBeLoadedAsync: false
                    },
                    {
                        LoadingStep: "UserImage",
                        canBeLoadedAsync: false
                    },
                    {
                        LoadingStep: "Search",
                        canBeLoadedAsync: false
                    },
                    {
                        LoadingStep: "MeArea",
                        canBeLoadedAsync: false
                    },
                    {
                        LoadingStep: "ShellComplete",
                        canBeLoadedAsync: true
                    }
                ],
                maxWaitInMs: 0
            }
        }
    };

    var oStepConfigurationMock = {
        StartScheduler: {
            loadingMode: "continueOnEvent",
            continueOnEvent: {
                eventName: "startScheduler"
            },
            userCanTrigger: false,
            canBeInterrupted: false
        },
        LoadRendererExtensions: {
            loadingMode: "byEvent",
            byEvent: {
                eventName: "loadRendererExtensions",
                eventData: ""
            },
            Dependencies: []
        },
        MessagePopoverInit: {
            loadingMode: "byEvent",
            byEvent: {
                eventName: "initMessagePopover",
                eventData: ""
            },
            Dependencies: [
                "LoadRendererExtensions"
            ]
        },
        UsageAnalytics: {
            loadingMode: "byEvent",
            byEvent: {
                eventName: "loadUsageAnalytics",
                eventData: ""
            },
            Dependencies: [
                "LoadRendererExtensions"
            ]
        },
        Notifications: {
            loadingMode: "byComponentCreate",
            excludedFLPStates: [
                "lean",
                "lean-home"
            ],
            byComponentCreate: {
                enabled: true,
                ui5ComponentOptions: {
                    name: "sap.ushell.components.shell.Notifications"
                },
                url: "sap/ushell/components/shell/Notifications"
            },
            configSwitch: {
                path: "/core/shell/model/enableNotifications",
                assertionValue: true
            },
            userCanTrigger: false,
            canBeInterrupted: false
        },
        MeArea: {
            loadingMode: "byComponentCreate",
            byComponentCreate: {
                enabled: true,
                ui5ComponentOptions: {
                    name: "sap.ushell.components.shell.MeArea.fiori3"
                },
                url: "sap/ushell/components/shell/MeArea/fiori3"
            },
            userCanTrigger: false,
            canBeInterrupted: false
        },
        UserImage: {
            loadingMode: "byComponentCreate",
            byComponentCreate: {
                enabled: true,
                ui5ComponentOptions: {
                    name: "sap.ushell.components.shell.UserImage"
                },
                url: "sap/ushell/components/shell/UserImage"
            },
            userCanTrigger: false,
            canBeInterrupted: false
        },
        Search: {
            loadingMode: "byComponentCreate",
            excludedFLPStates: [
                "lean",
                "lean-home"
            ],
            byComponentCreate: {
                enabled: true,
                ui5ComponentOptions: {
                    name: "sap.ushell.components.shell.Search"
                },
                url: "sap/ushell/components/shell/Search"
            },
            userCanTrigger: false,
            canBeInterrupted: false
        },
        ShellComplete: {
            loadingMode: "byEvent",
            byEvent: {
                eventName: "ShellComplete",
                eventData: ""
            }
        },
        ConditionalWaitForAppLoading: {
            loadingMode: "waitInMs",
            waitInMs: {
                waitingTime: 42
            },
            mandatoryFLPStates: [
                "app"
            ]
        }
    };

    var LOADING_CONFIG_PATH = "sap/ushell/bootstrap/_SchedulingAgent/LoadingConfiguration.json";
    var STEP_CONFIG_PATH = "sap/ushell/bootstrap/_SchedulingAgent/StepConfiguration.json";

    QUnit.module("Configuration validation", {

    });

    QUnit.test("Validate step dependencies", function (assert) {
        var done = assert.async();
        var pStepConfig = LoaderExtensions.loadResource(STEP_CONFIG_PATH, {async: true});
        var bDependencyDefined = false;
        var sStep;

        pStepConfig.then(function (oStepConfig) {
            Object.keys(oStepConfig).forEach(function (sKey) {
                if (oStepConfig[sKey].Dependencies) {
                    for (var i = 0; i < oStepConfig[sKey].Dependencies.length; i++) {
                        sStep = oStepConfig[sKey].Dependencies[i];
                        bDependencyDefined = !!oStepConfig[sStep];
                        assert.ok(bDependencyDefined, "Step \"" + sKey + "\"'s dependency " + sStep + " is defined.");
                    }
                }
            });
            done();
        });
    });

    QUnit.test("Validate blocks' and steps' definitions", function (assert) {
        var done = assert.async();
        var pStepConfig = LoaderExtensions.loadResource(STEP_CONFIG_PATH, {async: true});
        var pLoadingConfig = LoaderExtensions.loadResource(LOADING_CONFIG_PATH, {async: true});
        var bBlockDefined = false;
        var bStepDefined = false;
        var sStep;

        Promise.all([pStepConfig, pLoadingConfig]).then(function (values) {
            var oStepConfig = values[0];
            var oLoadingConfig = values[1];
            oLoadingConfig.OrderOfLoadingBlocks.forEach(function (sLoadingBlock) {
                bBlockDefined = !!oLoadingConfig.LoadingBlocks[sLoadingBlock];
                assert.ok(bBlockDefined, "Block \"" + sLoadingBlock + "\" is defined.");
                for (var i = 0; i < oLoadingConfig.LoadingBlocks[sLoadingBlock].LoadingSteps.length; i++) {
                    sStep = oLoadingConfig.LoadingBlocks[sLoadingBlock].LoadingSteps[i].LoadingStep;
                    bStepDefined = !!oStepConfig[sStep];
                    assert.ok(bStepDefined, "Block's \"" + sLoadingBlock + "\" step \"" + sStep + "\" is defined.");
                }
            });
            done();
        });
    });

    QUnit.test("Validate step definitions", function (assert) {
        var done = assert.async();
        var pStepConfig = LoaderExtensions.loadResource(STEP_CONFIG_PATH, {async: true});
        var bStepDefined = false;
        var bFieldDefined = false;
        var oStep;

        pStepConfig.then(function (oStepConfig) {
            Object.keys(oStepConfig).forEach(function (sKey) {
                oStep = oStepConfig[sKey];
                switch (oStep.loadingMode) {
                    case "continueOnEvent":
                        bStepDefined = typeof oStep.continueOnEvent.eventName === "string";
                        assert.ok(bStepDefined, "Step \"" + sKey + "\" has an event name.");
                        break;
                    case "byEvent":
                        bStepDefined = typeof oStep.byEvent.eventName === "string";
                        assert.ok(bStepDefined, "Step \"" + sKey + "\" has an event name.");
                        break;
                    case "byComponentCreate":
                        bFieldDefined = typeof oStep.byComponentCreate.enabled === "boolean";
                        assert.ok(bFieldDefined, "Step \"" + sKey + "\" has an enabled field.");
                        bStepDefined = bFieldDefined;
                        bFieldDefined = typeof oStep.byComponentCreate.ui5ComponentOptions.name === "string";
                        assert.ok(bFieldDefined, "Step \"" + sKey + "\" has a component name.");
                        bStepDefined = bStepDefined && bFieldDefined;
                        bFieldDefined = typeof oStep.byComponentCreate.ui5ComponentOptions.manifest === "boolean";
                        assert.ok(bFieldDefined, "Step \"" + sKey + "\" has a manifest flag.");
                        bFieldDefined = typeof oStep.byComponentCreate.url === "string";
                        assert.ok(bFieldDefined, "Step \"" + sKey + "\" has a url.");
                        break;
                    case "byRequire":
                        bStepDefined = typeof oStep.byRequire.path === "string";
                        assert.ok(bStepDefined, "Step \"" + sKey + "\" has a path field.");
                        break;
                    case "waitInMs":
                        bStepDefined = typeof oStep.waitInMs.waitingTime === "number" && oStep.waitInMs.waitingTime >= 0;
                        assert.ok(bStepDefined, "Step \"" + sKey + "\" has a waiting time");
                        break;
                    default:
                        bStepDefined = false;
                }
                assert.ok(bStepDefined, "Step \"" + sKey + "\" configuration is correct");
            });
            done();
        });
    });

    QUnit.module("Integration Test", {
        beforeEach: function () {
            // Config values for the different stubs.
            // Change them in the tests accordingly.
            this.oConfigurationMock = {
                FLPState: {
                    sStateName: "home"
                },
                Notifications: {
                    bComponentCreated: true,
                    iLoadingTime: 0,
                    bEnabledByConfig: true
                },
                MeArea: {
                    bComponentCreated: true,
                    iLoadingTime: 0
                },
                Search: {
                    bComponentCreated: true,
                    iLoadingTime: 0
                },
                UserImage: {
                    bComponentCreated: true,
                    iLoadingTime: 0
                },
                StepsToBeDone: {
                    LoadRendererExtensions: true,
                    MessagePopoverInit: true,
                    UsageAnalytics: true,
                    WarmupPlugins: true,
                    ShellComplete: true
                }
            };

            this.oTestLoadingConfig = JSON.parse(JSON.stringify(oLoadingConfigurationMock));
            this.oTestStepConfig = JSON.parse(JSON.stringify(oStepConfigurationMock));

            this.oComponentCreateStub = sinon.stub(Component, "create").callsFake(function (componentPath) {
                var bResolvePromise = false;
                // We want to be able to make the promises to resolve in a different order in some tests
                var iTimeOut = 0;
                return new Promise(function (resolve, reject) {
                    switch (componentPath.name) {
                        case "sap.ushell.components.shell.UserImage":
                            bResolvePromise = this.oConfigurationMock.UserImage.bComponentCreated;
                            iTimeOut = this.oConfigurationMock.UserImage.iLoadingTime;
                            break;
                        case "sap.ushell.components.shell.Search":
                            bResolvePromise = this.oConfigurationMock.Search.bComponentCreated;
                            iTimeOut = this.oConfigurationMock.Search.iLoadingTime;
                            break;
                        case "sap.ushell.components.shell.MeArea.fiori3":
                            bResolvePromise = this.oConfigurationMock.MeArea.bComponentCreated;
                            iTimeOut = this.oConfigurationMock.MeArea.iLoadingTime;
                            break;
                        case "sap.ushell.components.shell.Notifications":
                            bResolvePromise = this.oConfigurationMock.Notifications.bComponentCreated;
                            iTimeOut = this.oConfigurationMock.Notifications.iLoadingTime;
                            break;
                        default:
                            break;
                    }
                    if (bResolvePromise) {
                        setTimeout(resolve, iTimeOut);
                    } else {
                        setTimeout(reject, iTimeOut);
                    }
                }.bind(this));

            }.bind(this));

            this.oConfigStub = sinon.stub(Config, "last").callsFake(function (path) {
                if (path === "/core/shell/model/enableNotifications") {
                    return this.oConfigurationMock.Notifications.bEnabledByConfig;
                }
                if (path === "/core/shell/model/currentState/stateName") {
                    return this.oConfigurationMock.FLPState.sStateName;
                }
                return false;
            }.bind(this));

            this.aDoables = Object.keys(oStepConfigurationMock).reduce(function (aArray, sKey) {
                var oStep = oStepConfigurationMock[sKey];
                if (oStep.loadingMode === "byEvent") {
                    aArray.push(EventHub.once(oStep.byEvent.eventName).do(function () {
                        if (this.oConfigurationMock.StepsToBeDone[sKey]) {
                            EventHub.emit("StepDone", sKey);
                        } else {
                            EventHub.emit("StepFailed", sKey);
                        }
                    }.bind(this)));
                }
                return aArray;
            }.bind(this), []);

            this.oLoadResourceStub = sinon.stub(LoaderExtensions, "loadResource").callsFake(function (configPath) {
                return new Promise(function (resolve, reject) {
                    if (configPath === "sap/ushell/bootstrap/_SchedulingAgent/LoadingConfiguration.json") {
                        resolve(this.oTestLoadingConfig);
                    } else if (configPath === "sap/ushell/bootstrap/_SchedulingAgent/StepConfiguration.json") {
                        resolve(this.oTestStepConfig);
                    } else {
                        reject();
                    }
                }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
            this.oComponentCreateStub.restore();
            this.oConfigStub.restore();
            this.oLoadResourceStub.restore();
            this.aDoables.forEach(function (doable) {
                doable.off();
            });
            EventHub._reset();
        }
    });

    QUnit.test("The agent is successfully loaded", function (assert) {
        var bModuleIsobject = typeof SchedulingAgent === "object";
        assert.ok(bModuleIsobject, "Agent module loaded.");
    });

    QUnit.test("Default loading", function (assert) {
        var done = assert.async();

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                assert.strictEqual(DeepState.oState.ofLoadingBlock.AfterLoadPluginsCall.status, "BLOCK_DONE", "AfterLoadPluginsCall block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.LoadRendererExtensions.status, "STEP_DONE", "Renderer Extensions loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MessagePopoverInit.status, "STEP_DONE", "Message Popover Init loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UsageAnalytics.status, "STEP_DONE", "Usage analytics loaded.");

                assert.strictEqual(DeepState.oState.ofLoadingBlock.FLPPlugins.status, "BLOCK_DONE", "FLPPlugins block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ConditionalWaitForAppLoading.status, "STEP_SKIPPED", "Conditional timeout skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Notifications.status, "STEP_DONE", "Notifications loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserImage.status, "STEP_DONE", "UserImage loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Search.status, "STEP_DONE", "Search loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MeArea.status, "STEP_DONE", "MeArea loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ShellComplete.status, "STEP_DONE", "ShellComplete triggered.");
                done();
            });
        });
    });

    QUnit.test("MeArea not loaded", function (assert) {
        var done = assert.async();

        this.oConfigurationMock.MeArea.bComponentCreated = false;

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                assert.strictEqual(DeepState.oState.ofLoadingBlock.AfterLoadPluginsCall.status, "BLOCK_DONE", "AfterLoadPluginsCall block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.LoadRendererExtensions.status, "STEP_DONE", "Renderer Extensions loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MessagePopoverInit.status, "STEP_DONE", "Message Popover Init loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UsageAnalytics.status, "STEP_DONE", "Usage analytics loaded.");

                assert.strictEqual(DeepState.oState.ofLoadingBlock.FLPPlugins.status, "BLOCK_DONE", "FLPPlugins block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ConditionalWaitForAppLoading.status, "STEP_SKIPPED", "Conditional timeout skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Notifications.status, "STEP_DONE", "Notifications loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserImage.status, "STEP_DONE", "UserImage loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Search.status, "STEP_DONE", "Search loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MeArea.status, "STEP_SKIPPED", "MeArea skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ShellComplete.status, "STEP_DONE", "ShellComplete triggered.");
                done();
            });
        });
    });


    QUnit.test("MeArea & Search not loaded", function (assert) {
        var done = assert.async();

        this.oConfigurationMock.MeArea.bComponentCreated = false;
        this.oConfigurationMock.Search.bComponentCreated = false;

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                assert.strictEqual(DeepState.oState.ofLoadingBlock.AfterLoadPluginsCall.status, "BLOCK_DONE", "AfterLoadPluginsCall block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.LoadRendererExtensions.status, "STEP_DONE", "Renderer Extensions loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MessagePopoverInit.status, "STEP_DONE", "Message Popover Init loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UsageAnalytics.status, "STEP_DONE", "Usage analytics loaded.");

                assert.strictEqual(DeepState.oState.ofLoadingBlock.FLPPlugins.status, "BLOCK_DONE", "FLPPlugins block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ConditionalWaitForAppLoading.status, "STEP_SKIPPED", "Conditional timeout skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Notifications.status, "STEP_DONE", "Notifications loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserImage.status, "STEP_DONE", "UserImage loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Search.status, "STEP_SKIPPED", "Search skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MeArea.status, "STEP_SKIPPED", "MeArea skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ShellComplete.status, "STEP_DONE", "ShellComplete triggered.");
                done();
            });
        });
    });

    QUnit.test("FLP in lean state", function (assert) {
        var done = assert.async();

        this.oConfigurationMock.FLPState.sStateName = "lean";

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                assert.strictEqual(DeepState.oState.ofLoadingBlock.AfterLoadPluginsCall.status, "BLOCK_DONE", "AfterLoadPluginsCall block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.LoadRendererExtensions.status, "STEP_DONE", "Renderer Extensions loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MessagePopoverInit.status, "STEP_DONE", "Message Popover Init loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UsageAnalytics.status, "STEP_DONE", "Usage analytics loaded.");

                assert.strictEqual(DeepState.oState.ofLoadingBlock.FLPPlugins.status, "BLOCK_DONE", "FLPPlugins block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ConditionalWaitForAppLoading.status, "STEP_SKIPPED", "Conditional timeout skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Notifications.status, "STEP_SKIPPED", "Notifications skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserImage.status, "STEP_DONE", "UserImage loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Search.status, "STEP_SKIPPED", "Search skipped.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MeArea.status, "STEP_DONE", "MeArea loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ShellComplete.status, "STEP_DONE", "ShellComplete triggered.");
                done();
            });
        });
    });

    QUnit.test("FLP in app state", function (assert) {
        var done = assert.async();

        this.oConfigurationMock.FLPState.sStateName = "app";

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                assert.strictEqual(DeepState.oState.ofLoadingBlock.AfterLoadPluginsCall.status, "BLOCK_DONE", "AfterLoadPluginsCall block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.LoadRendererExtensions.status, "STEP_DONE", "Renderer Extensions loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MessagePopoverInit.status, "STEP_DONE", "Message Popover Init started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UsageAnalytics.status, "STEP_DONE", "Usage analytics loaded.");

                assert.strictEqual(DeepState.oState.ofLoadingBlock.FLPPlugins.status, "BLOCK_DONE", "FLPPlugins block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ConditionalWaitForAppLoading.status, "STEP_DONE", "Conditional timeout loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Notifications.status, "STEP_DONE", "Notifications loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserImage.status, "STEP_DONE", "UserImage loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Search.status, "STEP_DONE", "Search loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MeArea.status, "STEP_DONE", "MeArea loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ShellComplete.status, "STEP_DONE", "ShellComplete triggered.");
                done();
            });
        });
    });

    QUnit.test("A step dependency wasn't resolved", function (assert) {
        var done = assert.async();

        this.oConfigurationMock.StepsToBeDone.LoadRendererExtensions = false;

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                assert.strictEqual(DeepState.oState.ofLoadingBlock.AfterLoadPluginsCall.status, "BLOCK_ABORTED", "AfterLoadPluginsCall block loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.LoadRendererExtensions.status, "STEP_SKIPPED", "Renderer Extensions loaded.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MessagePopoverInit.status, "STEP_ABORTED", "Message Popover Init aborted.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UsageAnalytics, undefined, "Usage analytics not started.");

                assert.strictEqual(DeepState.oState.ofLoadingBlock.FLPPlugins, undefined, "FLPPlugins block not started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ConditionalWaitForAppLoading, undefined, "Conditional timeout not started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Notifications, undefined, "Notifications not started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.UserImage, undefined, "UserImage not started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.Search, undefined, "Search not started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.MeArea, undefined, "MeArea not started.");
                assert.strictEqual(DeepState.oState.ofLoadingStep.ShellComplete, undefined, "ShellComplete not triggered.");

                // Technical assertions:
                assert.strictEqual(Object.keys(DeepState.oState.ofLoadingStep).length, 3, "Three steps had their state set.");
                assert.strictEqual(Object.keys(DeepState.oState.ofLoadingBlock).length, 1, "Only one block had its state set.");
                done();
            });
        });
    });

    QUnit.test("Two blocks are loaded concurrently", function (assert) {
        var done = assert.async();
        assert.expect(10);

        this.oTestLoadingConfig.LoadingBlocks.AfterLoadPluginsCall.bCanBeLoadedConcurrently = true;

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                // Get all steps ordered by loading time:
                var aSortedSteps = Object.keys(DeepState.oState.ofLoadingStep).reduce(function (acc, sKey) {
                    var oStepStatus = DeepState.oState.ofLoadingStep[sKey];
                    oStepStatus.sStepName = sKey;
                    acc.push(oStepStatus);
                    return acc;
                }, []);
                aSortedSteps.sort(function (a, b) {
                    return a.time - b.time;
                });

                // we expect the steps of both blocks to be loaded alternately:
                // First one step from AfterLoadPluginsCall, followed by a step
                // from FLPPlugins and so on.
                // The only exception is ConditionalWaitForAppLoading, which is not loaded,
                // just skipped (and immediately set to that state), while the StartScheduler
                // is started first but loaded later due to Async loading! (hence the unexpected order)
                var aExpectedLoadOrder = [
                    "ConditionalWaitForAppLoading",
                    "StartScheduler",
                    "Notifications",
                    "LoadRendererExtensions",
                    "UserImage",
                    "MessagePopoverInit",
                    "UsageAnalytics",
                    "Search",
                    "MeArea",
                    "ShellComplete"
                ];

                // check the order of loading
                for (var i = 0; i < aExpectedLoadOrder.length; i++) {
                    var sCurrentStep = aExpectedLoadOrder[i];
                    assert.strictEqual(sCurrentStep, aSortedSteps[i].sStepName, "Step "+ sCurrentStep +" loaded in position " + i);
                }
                done();
            });
        });
    });

    QUnit.test("Blocks are loaded sequentially if bCanBeLoadedConcurrently is false", function (assert) {
        var done = assert.async();
        assert.expect(10);

        this.oTestLoadingConfig.LoadingBlocks.AfterLoadPluginsCall.bCanBeLoadedConcurrently = false;

        SchedulingAgent._initialize();

        EventHub.emit("startScheduler");

        EventHub.wait("FLPLoadingDone").then(function () {
            EventHub.once("FLPLoadingDone").do(function () {
                // Get all steps ordered by loading time:
                var aSortedSteps = Object.keys(DeepState.oState.ofLoadingStep).map(function (sKey) {
                    var oStepStatus = DeepState.oState.ofLoadingStep[sKey];
                    oStepStatus.sStepName = sKey;
                    return oStepStatus;
                }, []);
                aSortedSteps.sort(function (a, b) {
                    return a.time - b.time;
                });

                var aExpectedLoadOrder = [
                    "StartScheduler",
                    "LoadRendererExtensions",
                    "MessagePopoverInit",
                    "UsageAnalytics",
                    "ConditionalWaitForAppLoading",
                    "Notifications",
                    "UserImage",
                    "Search",
                    "MeArea",
                    "ShellComplete"
                ];

                for (var i = 0; i < aExpectedLoadOrder.length; i++) {
                    var sCurrentStep = aExpectedLoadOrder[i];
                    assert.strictEqual(sCurrentStep, aSortedSteps[i].sStepName, "Step "+ sCurrentStep +" loaded in position " + i);
                }
                done();
            });
        });
    });

    QUnit.skip("Block dependency not working", function (assert) {
        // Out of scope, will be implemented at a later point
    });

});
