// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.elements.modeljs
 */
sap.ui.require([
    "sap/ushell/components/applicationIntegration/elements/model",
    "sap/ui/core/Control",
    "sap/ushell/test/utils",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/components/HeaderManager",
    'sap/ui/Device'
], function (oModel, Control, oTestUtils, Config, EventHub, HeaderManager, Device) {
    "use strict";

    var oAppSttMod,
        oBasecustomShellState = {
            "currentState": {
                "stateName": "app",
                "headEndItems" : [],
                "headItems" : [],
                "paneContent" : [],
                "actions" : ["ContactSupportBtn", "EndUserFeedbackBtn"],
                // "actions" : ["aboutBtn"],
                "floatingActions" : [],
                "subHeader" : [],
                "toolAreaItems" : [],
                "RightFloatingContainerItems": [],
                "application": {},
                "showRightFloatingContainer": undefined,
                "headerHeading": undefined,
                "centralAreaElement": null
            }
        },
        oBaseExpectedModelData = {
            "currentState": {
                "RightFloatingContainerItems": [],
                "actions": [
                    "openCatalogBtn",
                    "userSettingsBtn",
                    "ContactSupportBtn",
                    "EndUserFeedbackBtn"
                ],
                "floatingActions": [],
                "floatingContainerContent": [],
                "paneContent": [],
                "showCatalog": false,
                "showCurtain": false,
                "showPane": false,
                "showRecentActivity": true,
                "showRightFloatingContainer": true,
                "stateName": "home",
                "subHeader": [],
                "toolAreaItems": [],
                "toolAreaVisible": false,
                "search": ""
            },
            "options": [],
            "currentViewPortState": "Center",
            "enableNotifications": false,
            "enableNotificationsUI": false,
            "enableBackGroundShapes": true,
            "isPhoneWidth": false,
            "notificationsCount": 0,
            "searchAvailable": false,
            "searchFiltering": true,
            "searchTerm": "",
            "shellAppTitleData": {
                "currentViewInPopover": "navigationMenu",
                "enabled": false,
                "showCatalogsApps": false,
                "showExternalProvidersApps": false,
                "showGroupsApps": false
            },
            "showEndUserFeedback": false,
            "userImage": {
                "account": "sap-icon://account",
                "personPlaceHolder": "sap-icon://person-placeholder"
            },
            "userPreferences": {
                "entries": [],
                "profiling": [],
                "activeEntryPath": null,
                "dialogTitle": "Settings",
                "isDetailedEntryMode": false
            },
            "userStatusUserEnabled": true
        };

    /* global QUnit sinon */

    QUnit.module("Creation", {
        before: function () {
            HeaderManager.init();
        },
        after: function () {
            HeaderManager.destroy();
        }
    });

    QUnit.test("getModel returns undefined when the renderer is not available", function (assert) {
        // Arrange
        var oOriginalContainer = sap.ushell.Container;
        sap.ushell.Container = {
            getRenderer: sinon.stub()
        };

        // Act
        var oShellModel = oModel.getModel();

        // Assert
        assert.strictEqual(
            oShellModel,
            undefined,
            "model is undefined"
        );

        // Restore
        sap.ushell.Container = oOriginalContainer;
    });

    QUnit.test("elements model can be created, operated and destroyed twice", function (assert) {
        var bThrows = false;
        try {
            oModel.init({} , {
                extendedShellStates: {},
                oCheckPoints: {},
                aTriggers: [],
                customShellState: oBasecustomShellState
            });
            oModel.switchState("minimal");
            oModel.destroy();
            oModel.init({} , {
                extendedShellStates: {},
                oCheckPoints: {},
                aTriggers: [],
                customShellState: oBasecustomShellState
            });
            oModel.switchState("minimal");
            oModel.destroy();
        } catch (e) {
            bThrows = true;
        }

        assert.strictEqual(
            bThrows,
            false,
            "no exception raised over multiple init/destroy operations"
        );
    });

    [
        /*
         * When the shell starts in lean mode (right click on tile > open new
         * tab) there is no back button displayed, and this is expected.
         *
         * However, there is a feature that adds a back button to the shell
         * header after the next navigation is done inplace.
         *
         * This is done through a trigger that, once registered, waits on a
         * hash change, and displays the back button.
         *
         * This test makes sure that the trigger is registered when starting
         * in lean mode.
         */
        {
            testDescription: "initialized in lean mode",
            oConfig: { appState: "lean" },
            expectedRegisterTriggersCallCount: 1,
            expectedTriggerNameRegistered: "onAddFirstAction"
        },
        {
            testDescription: "initialized in default mode",
            oConfig: {},
            expectedRegisterTriggersCallCount: 0
        }
    ].forEach(function (oFixture) {
        QUnit.test("elements model registers lean shell triggers when " + oFixture.testDescription, function (assert) {
            sinon.stub(oModel, "switchState");
            sinon.stub(oModel, "_registerTriggers");

            oModel.init(oFixture.oConfig, {
                extendedShellStates: {},
                oCheckPoints: {},
                aTriggers: [],
                customShellState: oBasecustomShellState
            });

            assert.strictEqual(
                oModel._registerTriggers.callCount,
                oFixture.expectedRegisterTriggersCallCount, // because the initial state is "lean"
                "_registerTriggers was called the expected number of times"
            );

            var bOneCallMadeAsExpected = oModel._registerTriggers.callCount === oFixture.expectedRegisterTriggersCallCount
                && oModel._registerTriggers.callCount === 1;

            if (bOneCallMadeAsExpected) {
                var aRegisteredTriggers = oModel._registerTriggers.getCall(0).args[0];
                assert.strictEqual(aRegisteredTriggers.length, 1, "only one trigger was registered");

                if (aRegisteredTriggers.length === 1) {
                    assert.strictEqual(
                        aRegisteredTriggers[0].sName,
                        oFixture.expectedTriggerNameRegistered,
                        "the expected trigger was registered"
                    );
                }
            }

            oModel.switchState.restore();
            oModel._registerTriggers.restore();

            oModel.destroy();
        });
    });


    QUnit.module("Managed queue", {
        beforeEach : function () {
            this.oElement = new Control("elementId");

            oModel.init({} , {
                extendedShellStates: {},
                oCheckPoints: {},
                aTriggers: [],
                customShellState: oBasecustomShellState
            });
            oModel.addElementToManagedQueue(this.oElement);
        },
        afterEach : function () {
            this.oElement.destroy();
            oModel.destroy();
        }
    });

    QUnit.test("On destroy a managed element is destroyed", function (assert) {
        var oElementDestroySpy;

        oElementDestroySpy = sinon.spy(this.oElement, "destroy");
        oModel._destroyManageQueue();

        assert.ok(oElementDestroySpy.calledOnce, "The element has been destroyed.");
    });

    QUnit.test("On destroy a managed element is removed from the list of managed elements", function (assert) {
        oModel._destroyManageQueue();

        assert.equal(oModel._getManagedElements()["elementId"], null, "The element has been removed from the list.");
    });


    var oDeviceStub;

    QUnit.module("Model data", {
        before: function () {
            //make test independent of the screen size
            oDeviceStub = sinon.stub(Device.media, "getCurrentRange").returns({
                name: "Desktop"
            });
            HeaderManager.init();
        },
        beforeEach: function () {
            oAppSttMod = oBasecustomShellState;
            oModel.init({} , {
                extendedShellStates: {},
                oCheckPoints: {},
                aTriggers: [],
                customShellState: oAppSttMod
            });
        },
        afterEach: function () {
            oModel.destroy();
        },
        after: function () {
            oDeviceStub.restore();
            HeaderManager.destroy();
        }
    });

    [
        {
            testDescription: "only init is called",
            fnAfterInit: function () {
                oModel.switchState("home");
            },
            expectedModelData: oTestUtils.overrideObject(oBaseExpectedModelData, {
                "/currentState/search": ""
            })
        },
        {
            testDescription: "switching to embedded-home state",
            fnAfterInit: function () {
                var aActions = oAppSttMod.currentState.actions;
                oAppSttMod.currentState.actions = aActions.concat("aboutBtn");
                oModel.switchState("embedded-home");
            },
            expectedModelData: oTestUtils.overrideObject(oBaseExpectedModelData, {
                "/currentState/actions": ["ContactSupportBtn", "EndUserFeedbackBtn", "aboutBtn"],
                "/currentState/stateName": "embedded-home"
            })
        },
        {
            testDescription: "switching to state",
            fnAfterInit: function () {
                oAppSttMod.currentState.actions = [];
                oModel.switchState("merged-home");
            },
            expectedModelData: oTestUtils.overrideObject(oBaseExpectedModelData, {
                "/currentState/actions": [],
                "/currentState/stateName": "merged-home"
            })
        },
        {
            testDescription: "switching to blank state",
            fnAfterInit: function () {
                oModel.switchState("blank");
            },
            expectedModelData: oTestUtils.overrideObject(oBaseExpectedModelData, {
                "/currentState/stateName": "blank",
                "/currentState/actions": []
            })
        },
        {
            testDescription: "switching to app state",
            fnAfterInit: function () {
                oAppSttMod.currentState.actions = [
                    "ContactSupportBtn",
                    "EndUserFeedbackBtn",
                    "aboutBtn"
                ];
                oModel.switchState("app");
            },
            expectedModelData: oTestUtils.overrideObject(oBaseExpectedModelData, {
                "/currentState/stateName": "app",
                "/currentState/actions": [
                    "openCatalogBtn",
                    "userSettingsBtn",
                    "ContactSupportBtn",
                    "EndUserFeedbackBtn",
                    "aboutBtn"
                ],
                "/currentState/search": ""
            })
        },
        {
            testDescription: "switching to standalone state",
            fnAfterInit: function () {
                oModel.switchState("standalone");
            },
            expectedModelData: oTestUtils.overrideObject(oBaseExpectedModelData, {
                "/currentState/stateName": "standalone",
                "/currentState/actions": [
                    "ContactSupportBtn",
                    "EndUserFeedbackBtn",
                    "aboutBtn"
                ]
            })
        },
        {
            testDescription: "switching to home state",
            fnAfterInit: function () {
                oAppSttMod.currentState.actions = [
                    "ContactSupportBtn",
                    "EndUserFeedbackBtn"
                ];
                oModel.switchState("home");
            },
            expectedModelData: oTestUtils.overrideObject(oBaseExpectedModelData, {
                "/currentState/stateName": "home",
                "/currentState/actions": [
                    "openCatalogBtn",
                    "userSettingsBtn",
                    "ContactSupportBtn",
                    "EndUserFeedbackBtn"
                ],
                "/currentState/search": "",
                "/currentState/showRecentActivity": true
            })
        },
        {
            testDescription: "switching to minimal state",
            fnAfterInit: function () {
                oAppSttMod.currentState.actions = [
                    "ContactSupportBtn",
                    "EndUserFeedbackBtn",
                    "aboutBtn"
                ];
                oModel.switchState("minimal");
            },
            expectedModelData: oTestUtils.overrideObject(oBaseExpectedModelData, {
                "/currentState/stateName": "minimal",
                "/currentState/actions": [
                    "openCatalogBtn",
                    "userSettingsBtn",
                    "ContactSupportBtn",
                    "EndUserFeedbackBtn",
                    "aboutBtn"
                ]
            })
        },
        {
            testDescription: "switching to embedded state",
            fnAfterInit: function () {
                oModel.switchState("embedded");
            },
            expectedModelData: oTestUtils.overrideObject(oBaseExpectedModelData, {
                "/currentState/stateName": "embedded",
                "/currentState/actions": [
                    "ContactSupportBtn",
                    "EndUserFeedbackBtn",
                    "aboutBtn"
                ]
            })
        },
        {
            testDescription: "switching to embedded-home state",
            fnAfterInit: function () {
                oModel.switchState("embedded-home");
            },
            expectedModelData: oTestUtils.overrideObject(oBaseExpectedModelData, {
                "/currentState/stateName": "embedded-home",
                "/currentState/actions": [
                    "ContactSupportBtn",
                    "EndUserFeedbackBtn",
                    "aboutBtn"
                ]
            })
        },
        {
            testDescription: "switching to lean state",
            fnAfterInit: function () {
                oModel.switchState("lean");
            },
            expectedModelData: oTestUtils.overrideObject(oBaseExpectedModelData, {
                "/currentState/stateName": "lean",
                "/currentState/actions": [
                    "ContactSupportBtn",
                    "EndUserFeedbackBtn",
                    "aboutBtn"
                ],
                "/currentState/search": "",
                "/currentState/showRecentActivity": false
            })
        }
    ].forEach(function (oFixture) {

        QUnit.test("getModel: returns the right model-relevant data when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();

            oFixture.fnAfterInit();

            Config.once("/core/shell/model").do(function (oModelData) {

                assert.deepEqual(
                    oModelData,
                    oFixture.expectedModelData,
                    "got the expected data"
                );

                fnDone();
            });

        });
    });

QUnit.module("Model data Fiori 3", {
        before: function () {
            HeaderManager.init();
        },
        beforeEach: function () {
            oAppSttMod = oBasecustomShellState;
            oModel.init({} , {
                extendedShellStates: {},
                oCheckPoints: {},
                aTriggers: [],
                customShellState: oAppSttMod
            });
        },
        afterEach: function () {
            oModel.destroy();
        },
        after: function () {
            HeaderManager.destroy();
        }
    });
[
    {
        testDescription: "switching to app state with action button",
        fnAfterInit: function () {
            oAppSttMod.currentState.actions = [
                "ContactSupportBtn",
                "applicationActionBtn",
                "EndUserFeedbackBtn",
                "aboutBtn"
            ];
            oModel.switchState("app");
        },
        expectedModelData: oTestUtils.overrideObject(oBaseExpectedModelData, {
            "/currentState/stateName": "app",
            "/currentState/actions": [
                "openCatalogBtn",
                "userSettingsBtn",
                "ContactSupportBtn",
                "EndUserFeedbackBtn",
                "applicationActionBtn",
                "aboutBtn"
            ],
            "/currentState/search": ""
        })
    }
].forEach(function (oFixture) {

    QUnit.test("getModel: returns the right model-relevant data when " + oFixture.testDescription, function (assert) {
        var fnDone = assert.async();

        oFixture.fnAfterInit();

        Config.once("/core/shell/model").do(function (oModelData) {

            assert.deepEqual(
                oModelData,
                oFixture.expectedModelData,
                "got the expected data"
            );
            fnDone();
        });

    });
});



    function mockModel (oModel) {
        var aStubsToRestore = [];

        aStubsToRestore.push(sinon.stub(oModel, "addHeaderItem"));
        aStubsToRestore.push(sinon.stub(window, "addEventListener"));
        aStubsToRestore.push(sinon.stub(window, "removeEventListener"));
        aStubsToRestore.push(sinon.stub(oModel, "createTriggersOnBaseStates"));

        var oFakeAppRenderedOffable = sinon.stub();
        var oFakeAppRenderedDoable = sinon.stub().returns({
            off: oFakeAppRenderedOffable
        });
        sinon.stub(EventHub, "on").returns({
            do: oFakeAppRenderedDoable
        });

        aStubsToRestore.push(EventHub.on);

        return {
            stubs: {
                model: oModel,
                fakeAppRenderedOffable: oFakeAppRenderedOffable,
                fakeAppRenderedDoable: oFakeAppRenderedDoable
            },
            restore: function () {
                oModel.destroy();
                aStubsToRestore.forEach(function (oStub) { oStub.restore(); });
            }
        };
    }

    QUnit.module("Create Default Triggers", {
        beforeEach: function () {
            oAppSttMod = oBasecustomShellState;
            oModel.init({}, {
                extendedShellStates: {},
                oCheckPoints: {},
                aTriggers: [],
                customShellState: oBasecustomShellState
            });
            this.oMockedModelEnv = mockModel(oModel);

            EventHub._reset();
        },
        afterEach: function () {
            this.oMockedModelEnv.restore();
        }
    });

    QUnit.test("Registers triggers on the expected states", function (assert) {
        // Act
        var oModel = this.oMockedModelEnv.stubs.model;
        oModel.createDefaultTriggers("anything");

        // Assert
        var iNumCreateTriggersCalls = oModel.createTriggersOnBaseStates.callCount;
        assert.strictEqual(iNumCreateTriggersCalls, 2,
            "createTriggersOnBaseStates was called the expected number of times");

        if (iNumCreateTriggersCalls !== 2) {
            return;
        }

        var aExpectedCallResults = [
            {
                triggerName: "onAddFirstAction",
                registeredOnStates: ["blank", "blank-home"]
            },
            {
                triggerName: "onAddFirstAction",
                registeredOnStates: ["lean", "lean-home"]
            }
        ];

        aExpectedCallResults.forEach(function (oExpected, iIdx) {
            var oCall = oModel.createTriggersOnBaseStates.getCall(iIdx);
            var aRegisteredTriggers = oCall.args[0];
            var aRegisteredStates = oCall.args[1];

            assert.strictEqual(aRegisteredTriggers.length, 1, "only one trigger was registered on call " + iIdx);
            assert.strictEqual(aRegisteredTriggers[0].sName, oExpected.triggerName, "the expected trigger name was registered on call " + iIdx);
            assert.deepEqual(aRegisteredStates, oExpected.registeredOnStates, "the triggers were registered on the expected states");
        });
    });

    QUnit.test("Register method for lean shell trigger works as expected", function (assert) {
        /*
         * In previous test we have tested that triggers are registered on the
         * expected states. This test checks the triggers for lean shell are behaving
         * as expected.
         */
        // Arrange
        var oModel = this.oMockedModelEnv.stubs.model;
        oModel.createDefaultTriggers("anything"); // cause triggers to be registered
        var oFakeAppRenderedDoable = this.oMockedModelEnv.stubs.fakeAppRenderedDoable;

        var aRegisteredTriggers = oModel.createTriggersOnBaseStates.getCall(1).args[0];
        var oLeanShellTrigger = aRegisteredTriggers[0];

        // Act
        oLeanShellTrigger.fnRegister();

        // Assert
        assert.strictEqual(window.addEventListener.callCount, 1, "addEventListener was called once");
        if (window.addEventListener.callCount !== 1) {
            return;
        }

        assert.strictEqual(window.addEventListener.getCall(0).args[0], "hashchange",
            "addEventListener was called with the expected first argument");

        assert.strictEqual(typeof window.addEventListener.getCall(0).args[1], "function",
            "addEventListener was called with a function as the second argument");

        assert.strictEqual(EventHub.on.callCount, 1, "EventHub.on was called one time");
        assert.strictEqual(EventHub.on.args[0][0], "AppRendered", "EventHub.on was called with the expected argument");
        aRegisteredTriggers = oModel.createTriggersOnBaseStates.getCall(1).args[0];
        oLeanShellTrigger = aRegisteredTriggers[0];
        aRegisteredTriggers = oModel.createTriggersOnBaseStates.getCall(1).args[0];
        oLeanShellTrigger = aRegisteredTriggers[0];
        assert.strictEqual(oFakeAppRenderedDoable.callCount, 1, "do was called on the AppRendered doable");
    });

    QUnit.test("Cross application navigation 'register' trigger for lean shell", function (assert) {
        // Arrange
        var oModel = this.oMockedModelEnv.stubs.model;
        oModel.createDefaultTriggers("anything"); // cause triggers to be registered
        var oFakeAppRenderedDoable = this.oMockedModelEnv.stubs.fakeAppRenderedDoable;

        var aRegisteredTriggers = oModel.createTriggersOnBaseStates.getCall(1).args[0];
        var oLeanShellTrigger = aRegisteredTriggers[0];

        // Act
        oLeanShellTrigger.fnRegister();

        // Assert
        var fnOnAppRenderedCallback = oFakeAppRenderedDoable.getCall(0).args[0];
        assert.strictEqual(oModel.addHeaderItem.callCount, 0,
            "no back button added to the header since the model was initialized");

        fnOnAppRenderedCallback();
        assert.strictEqual(oModel.addHeaderItem.callCount, 0,
            "no back button added to the header when the first app renders");

        fnOnAppRenderedCallback();
        assert.strictEqual(oModel.addHeaderItem.callCount, 1,
            "back button added to the header when the second app renders");

        fnOnAppRenderedCallback();
        assert.strictEqual(oModel.addHeaderItem.callCount, 2,
            "back button added again to the header when the first (or another) app (re)renders");
    });

    QUnit.test("Cross application navigation 'unregister' trigger for lean shell (when register was not called)", function (assert) {
        // Arrange
        var oModel = this.oMockedModelEnv.stubs.model;
        oModel.createDefaultTriggers("anything"); // cause triggers to be registered
        var oFakeAppRenderedOffable = this.oMockedModelEnv.stubs.fakeAppRenderedOffable;

        var aRegisteredTriggers = oModel.createTriggersOnBaseStates.getCall(1).args[0];
        var oLeanShellTrigger = aRegisteredTriggers[0];

        // Act
        oLeanShellTrigger.fnUnRegister();

        // Assert
        assert.strictEqual(window.removeEventListener.callCount, 1,
            "removeEventListener was called once");
        if (window.removeEventListener.callCount !== 1) {
            return;
        }

        assert.strictEqual(window.removeEventListener.getCall(0).args[0], "hashchange",
            "removeEventListener was called on the 'hashchange' event");
        assert.strictEqual(oFakeAppRenderedOffable.callCount, 0,
            ".off() was not called on the app rendered doable (because on was not called first via fnRegister)");
    });

    QUnit.test("Cross application navigation 'unregister' trigger for lean shell (after register was called)", function (assert) {
        // Arrange
        var oModel = this.oMockedModelEnv.stubs.model;
        oModel.createDefaultTriggers("anything"); // cause triggers to be registered
        var oFakeAppRenderedOffable = this.oMockedModelEnv.stubs.fakeAppRenderedOffable;

        var aRegisteredTriggers = oModel.createTriggersOnBaseStates.getCall(1).args[0];
        var oLeanShellTrigger = aRegisteredTriggers[0];

        // Act
        oLeanShellTrigger.fnRegister();  // note: register first
        oLeanShellTrigger.fnUnRegister();

        // Assert
        assert.strictEqual(window.removeEventListener.callCount, 1,
            "removeEventListener was called once");
        if (window.removeEventListener.callCount !== 1) {
            return;
        }

        assert.strictEqual(window.removeEventListener.getCall(0).args[0], "hashchange",
            "removeEventListener was called on the 'hashchange' event");
        assert.strictEqual(oFakeAppRenderedOffable.callCount, 1,
            ".off() was called on the app rendered doable (because 'on' was previously called via fnRegister)");
    });

});
