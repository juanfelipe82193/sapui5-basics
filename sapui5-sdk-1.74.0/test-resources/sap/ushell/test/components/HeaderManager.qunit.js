// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.HeaderManager
 */
sap.ui.require([
    "sap/ushell/components/HeaderManager",
    "sap/ui/Device",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/ushell/components/applicationIntegration/elements/model"
], function (HeaderManager, Device, AppLifeCycle, EventHub, Config, oElementsModel) {
    "use strict";

    /* global QUnit sinon Promise */

    function waitConfigChange (sPath) {
        return new Promise(function (fnDone) {
            Config.once(sPath).do(fnDone);
        });
    }

    QUnit.module("sap.ushell.components.HeaderManager", {
        beforeEach: function () {
            Config.emit("/core/shell/model/currentState/stateName", "home");
        },
        afterEach: function () {
        }
    });

    [
        {

            testDescription: "smoke test",
            oDeltas: {
                stateA: {
                    extraProperty: true
                },
                stateB: {
                    optionB: ["A", "B"]
                }
            },
            oDefaults: {
                optionA: [true],
                optionB: false,
                optionC: "string"
            },
            expectedBaseHeaderState: {
                stateA: {
                    extraProperty: true,
                    optionA: [true],
                    optionB: false,
                    optionC: "string"
                },
                stateB: {
                    optionA: [true],
                    optionB: ["A", "B"],
                    optionC: "string"
                }
            }
        }
    ].forEach(
        function (oFixture) {
            QUnit.test(
                "_generateBaseHeaderState:", function (assert) {
                    var oActualResult = HeaderManager._generateBaseHeaderState(
                        oFixture.oDeltas,
                        oFixture.oDefaults
                    );
                    assert.deepEqual(
                        oActualResult,
                        oFixture.expectedBaseHeaderState,
                        "got the expected base header state"
                    );
                }
            );
        }
    );

    function _generateHeaderState (headItems, headEndItems) {
        return {
            headItems: headItems || [],
            headEndItems: headEndItems || [],
            headerVisible: true,
            showLogo: true,
            application: {},
            centralAreaElement: null,
            ShellAppTitleState: undefined,
            rootIntent: "",
            title: ""
        };
    }

    [
        {
            name: "change state update /core/shellHeader",
            oHeaderState: {
                "foo": _generateHeaderState(),
                "baz": _generateHeaderState(["item1"])
            },
            stateName: "baz",
            oExpectedCurrentState: _generateHeaderState(["item1"])
        }
    ].forEach(function (oTestCase) {
        QUnit.test("recalculateState: " + name, function (assert) {
            HeaderManager._resetBaseStates(oTestCase.oHeaderState);
            HeaderManager.switchState(oTestCase.stateName);
            HeaderManager.recalculateState();
            assert.deepEqual(Config.last("/core/shellHeader"), oTestCase.oExpectedCurrentState, "Current state is correct");
        });
    });

    QUnit.test("Current state is keep during the recalculate the state", function (assert) {
        HeaderManager._resetBaseStates({
            "foo": _generateHeaderState(["item1"]),
            "bar": _generateHeaderState(["item2"]),
        },);
        HeaderManager.switchState("foo");
        HeaderManager.updateStates({
            propertyName: "headItems",
            value: ["customItem"],
            aStates: undefined,
            bCurrentState: true,
            bDoNotPropagate: false
        });
        HeaderManager.recalculateState();
        assert.deepEqual(Config.last("/core/shellHeader/headItems"), ["item1", "customItem"] , "headItems is correct");

        HeaderManager.switchState("bar");
        HeaderManager.recalculateState();
        assert.deepEqual(Config.last("/core/shellHeader/headItems"), ["item2"] , "headItems is correct after switch state");

        HeaderManager.switchState("foo");
        HeaderManager.recalculateState();
        assert.deepEqual(Config.last("/core/shellHeader/headItems"), ["item1"] , "headItems is correct after switch state");
    });

    [
        {
            name: "Update the base and current state",
            oHeaderState: {
                home: _generateHeaderState(["item1"]),
                app: _generateHeaderState(["item1"]),
                "lean-home": _generateHeaderState(),
                "blank-home": _generateHeaderState()
            },
            oEvent: {
                propertyName: "headEndItems",
                value: ["NotificationsCountButton"],
                aStates: [
                    "home"
                ],
                bCurrentState: false,
                bDoNotPropagate: false

            },
            oExpectedBaseState: {
                home: _generateHeaderState(["item1"],["NotificationsCountButton"]),
                app: _generateHeaderState(["item1"], []),
                "lean-home": _generateHeaderState([], ["NotificationsCountButton"]),
                "blank-home": _generateHeaderState([], ["NotificationsCountButton"])
            }
        }
    ].forEach(function (oTestCase) {
        QUnit.test("update states: " + name, function (assert) {
            var oByIdStub = sinon.stub(sap.ui.getCore(), "byId");
            oTestCase.oEvent.value.forEach(function (sId) {
                oByIdStub.withArgs(sId).returns({id: sId});
            });
            HeaderManager._resetBaseStates(oTestCase.oHeaderState);
            HeaderManager.updateStates(oTestCase.oEvent);
            Object.keys(oTestCase.oExpectedBaseState).forEach(function (sStateName) {
                assert.deepEqual(HeaderManager._getBaseState(sStateName), oTestCase.oExpectedBaseState[sStateName], "Base state: " + sStateName + " is correct");
            });
            oByIdStub.restore();
            assert.ok(Config.last("/core/shellHeader")[oTestCase.oEvent.propertyName].indexOf(oTestCase.oEvent.value[0]) > -1, "The current state was updated");
        });
    });


    QUnit.test("test_movingOfFLpActionsToShellHeaderInModel", function (assert) {
        var oConfig = {
            moveContactSupportActionToShellHeader: true,
            moveEditHomePageActionToShellHeader: true,
            moveGiveFeedbackActionToShellHeader: true,
            moveAppFinderActionToShellHeader: true,
            moveUserSettingsActionToShellHeader: true
        };

        var oInitialStates = HeaderManager._createInitialState(oConfig);
        ["home","app","minimal","standalone","embedded","embedded-home","lean"].forEach(function (sState) {
            var aHeadEndItems = oInitialStates[sState]["headEndItems"];
            assert.ok(aHeadEndItems.indexOf("ContactSupportBtn") != -1 && aHeadEndItems.indexOf("EndUserFeedbackBtn") != -1, 'moveContactSupportActionToShellHeader to shell header ');
        });
    });

    QUnit.test("update centralAreaElement property for all states", function (assert) {
        var fnDone = assert.async();
        var oEventPayload = {
            id: "testId"
        };
        HeaderManager.init();
        EventHub.emit("setHeaderCentralAreaElement", oEventPayload);
        setTimeout(function () {
            ["home","app","minimal","standalone","embedded","embedded-home","lean"].forEach(function (sState) {
                assert.equal(HeaderManager._getBaseStateMember(sState, "centralAreaElement"), oEventPayload.id, 'centralAreaElement set correctly for state: ' + sState);
            });
            HeaderManager.destroy();
            fnDone();
        }, 10);
    });

    QUnit.test("update centralAreaElement property only for home state", function (assert) {
        var fnDone = assert.async();
        var oEventPayload = {
            id: "testId",
            states: ["home"],
            bDoNotPropagate: true
        };
        HeaderManager.init();
        EventHub.emit("setHeaderCentralAreaElement", oEventPayload);
        setTimeout(function () {
            assert.equal(HeaderManager._getBaseStateMember("home", "centralAreaElement"),  oEventPayload.id, 'centralAreaElement set correctly for "home" state');
            ["app","minimal","standalone","embedded","embedded-home","lean"].forEach(function (sState) {
                assert.equal(HeaderManager._getBaseStateMember(sState, "centralAreaElement"), null, 'centralAreaElement should not be set for state: ' + sState);
            });
            HeaderManager.destroy();
            fnDone();
        }, 10);
    });

    QUnit.test("test validateShowLogo", function (assert) {
        var done = assert.async();
        var isShowLogo;
        HeaderManager.init();

        var fnWaitConfigChange = waitConfigChange.bind(null, "/core/shellHeader");

        fnWaitConfigChange().then(function () {
            return HeaderManager.recalculateState();
        }).then(fnWaitConfigChange).then(function () {
            HeaderManager.validateShowLogo();
        }).then(fnWaitConfigChange).then(function () {
            isShowLogo = Config.last("/core/shellHeader/showLogo");
            assert.ok(isShowLogo, 'Verify Logo exist on desktop');
        }).then(function () {
            HeaderManager.validateShowLogo('Phone');
        }).then(fnWaitConfigChange).then(function () {
            isShowLogo = Config.last("/core/shellHeader/showLogo");
            assert.ok(!isShowLogo, 'Verify Logo does not exist on mobile phone');
        }).then(function () {
            // Simulate selected state of the MeArea
            Config.emit("/core/shell/model/currentViewPortState", "LeftCenter");
            HeaderManager.validateShowLogo('Phone');
        }).then(fnWaitConfigChange).then(function () {
            isShowLogo = Config.last("/core/shellHeader/showLogo");
            assert.ok(isShowLogo, 'Verify Logo exist on mobile phone when me area selected');
            HeaderManager.destroy();
            done();
        });
    });

    QUnit.test("handleEndItemsOverflow:", function (assert) {
        [
            {
                sTestDesciption: "Device: Phone, ShellHeaderEndItems: 0",
                aEndItems: [],
                name: "Phone",
                bExpectedEndItemsUpdated: false,
                aExpectedEndItems: []
            },
            {
                sTestDesciption: "Device: Phone, ShellHeaderEndItems: 1",
                aEndItems: [
                    "ActionModeBtn"
                ],
                name: "Phone",
                bExpectedEndItemsUpdated: false,
                aExpectedEndItems: [
                    "ActionModeBtn"
                ]
            },
            {
                sTestDesciption: "Device: Phone, ShellHeaderEndItems: 2",
                aEndItems: [
                    "ActionModeBtn",
                    "openCatalogBtn"
                ],
                name: "Phone",
                bExpectedEndItemsUpdated: false,
                aExpectedEndItems: [
                    "ActionModeBtn",
                    "openCatalogBtn"
                ]
            },
            {
                sTestDesciption: "Device: Phone, ShellHeaderEndItems: 2, NotificationsCountButton: true",
                aEndItems: [
                    "ActionModeBtn",
                    "NotificationsCountButton"
                ],
                name: "Phone",
                bExpectedEndItemsUpdated: false,
                aExpectedEndItems: [
                    "ActionModeBtn",
                    "NotificationsCountButton"
                ]
            },
            {
                sTestDesciption: "Device: Phone, ShellHeaderEndItems: 2, meAreaHeaderButton: true",
                aEndItems: [
                    "ActionModeBtn",
                    "meAreaHeaderButton"
                ],
                name: "Phone",
                bExpectedEndItemsUpdated: false,
                aExpectedEndItems: [
                    "ActionModeBtn",
                    "meAreaHeaderButton"
                ]
            },
            {
                sTestDesciption: "Device: Phone, ShellHeaderEndItems: 3, meAreaHeaderButton: true",
                aEndItems: [
                    "ActionModeBtn",
                    "openCatalogBtn",
                    "meAreaHeaderButton"
                ],
                name: "Phone",
                bExpectedEndItemsUpdated: true,
                aExpectedEndItems: [
                    "ActionModeBtn",
                    "openCatalogBtn",
                    "endItemsOverflowBtn",
                    "meAreaHeaderButton"
                ]
            },
            {
                sTestDesciption: "Device: Desktop, ShellHeaderEndItems: 3, meAreaHeaderButton: true",
                aEndItems: [
                    "ActionModeBtn",
                    "openCatalogBtn",
                    "meAreaHeaderButton"
                ],
                name: "Desktop",
                bExpectedEndItemsUpdated: false,
                aExpectedEndItems: [
                    "ActionModeBtn",
                    "openCatalogBtn",
                    "meAreaHeaderButton"
                ]
            }
        ].forEach(function (oFixture) {
            // Arrange
            HeaderManager.init();

            var aResult = oFixture.aEndItems,
                bEndItemsUpdated = false,
                fnGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                    byId: function (sId) {
                        if (sId === "endItemsOverflowBtn") {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }),
                fnConfigEmiStub = sinon.stub(Config, "emit", function (sPath, aEndItems) {
                    if (sPath === "/core/shellHeader/headEndItems") {
                        bEndItemsUpdated = true;
                        aResult = aEndItems;
                    }
                }),
                fnConfigLastStub = sinon.stub(Config, "last", function (sPath) {
                    if (sPath === "/core/shellHeader/headEndItems") {
                        return aResult;
                    }

                    if (sPath === "/core/shell/model/currentState/stateName") {
                        return "home";
                    }

                    if (sPath === "/core/shellHeader") {
                        return {
                            application: {},
                            centralAreaElement: null,
                            headEndItems: aResult,
                            headItems: [],
                            headerVisible: true,
                            showLogo: false,
                            title: ""
                        };
                    }
                });

            // Act
            HeaderManager.handleEndItemsOverflow(oFixture);

            // Assert
            assert.strictEqual(bEndItemsUpdated, oFixture.bExpectedEndItemsUpdated, "EndItems have (not) been updated when " + oFixture.sTestDesciption);
            assert.deepEqual(aResult, oFixture.aExpectedEndItems, "EndItems are as expected when " + oFixture.sTestDesciption);

            fnGetCoreStub.restore();
            fnConfigEmiStub.restore();
            fnConfigLastStub.restore();
        });
    });

});
