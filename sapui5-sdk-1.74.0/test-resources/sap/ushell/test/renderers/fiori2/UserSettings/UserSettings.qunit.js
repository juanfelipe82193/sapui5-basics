// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for UserSettings
 */
sap.ui.require([
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/components/shell/UserSettings/UserSettings.controller",
    "sap/ushell/EventHub",
    "sap/ushell/ui/utils"
], function (JSONModel, AppLifeCycle, UserSettingsController, EventHub, utils) {
    "use strict";
    /* global QUnit sinon */

    var oUserSettingsController = new UserSettingsController();

    var TempVariables = {};

    QUnit.module("UserSettings.controller", {
		beforeEach: function () {
			TempVariables.fnGetView = sinon.stub(oUserSettingsController, "getView").returns({
                byId: function () {
                    return {
                        addDetailPage: function () {},
                        addEventDelegate: function () {},
                        close: function () {
                            TempVariables.closed = true;
                        },
                        getItems: function () {
                            return TempVariables.aEntries;
                        },
                        getMode: function () {
                            return TempVariables.sMode;
                        },
                        hideMaster: function () {
                            TempVariables.bMasterHidden = true;
                        },
                        isMasterShown: function () {
                            return TempVariables.bIsMasterShown;
                        },
                        open: function () {
                            TempVariables.opened = true;
                        },
                        _oDetailNav: {
                            setAutoFocus: function () {}
                        },
                        removeSelections: function (bValue) {
                            TempVariables.bRemovedSelection = bValue;
                        },
                        setSelectedItem: function (oEntry) {
                            TempVariables.bEntrySelected = true;
                        },
                        setVisible: function (bValue) {
                            TempVariables.bNavButtonVisible = bValue;
                        },
                        showMaster: function () {
                            TempVariables.bMasterHidden = false;
                        },
                        toDetail: function (sId) {
                            TempVariables.sToDetail = sId;
                        },
                        toMaster: function () {
                            TempVariables.bToMaster = true;
                        },
                        setMode: function (sMode) {
                            TempVariables.sMode = sMode;
                        }
                    };
                },
                getModel: function () {
                    return {
                        getData: function () {
                            return {
                                entries: TempVariables.aEntries
                            };
                        },
                        getProperty: function () {
                            return TempVariables.vProperty;
                        },
                        setProperty: function () {}
                    };
                }
            });
		},
		afterEach: function () {
			TempVariables.fnGetView.restore();
            TempVariables = {};
		}
    });

    QUnit.test("onInit", function (assert) {
        // Arrange
        var fnEventHubOn = sinon.stub(EventHub, "on").returns({
                do: function () {}
            });

        // Act
        oUserSettingsController.onInit();

        // Assert
        assert.strictEqual(fnEventHubOn.called, true, "Event was created");
        assert.strictEqual(fnEventHubOn.args[0][0], "openUserSettings", "Event has the correct name");

        fnEventHubOn.restore();
    });

    QUnit.test("onExit", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var fnOpenUserSettings = sinon.stub(oUserSettingsController, "openUserSettings");

        // Act
        oUserSettingsController.onInit();
        oUserSettingsController.onExit();
        EventHub.emit("openUserSettings", Date.now());

        // Assert
        EventHub.on("openUserSettings").do(function () {
            // callCount is one, as this is async and its called in the test below once.
            assert.strictEqual(fnOpenUserSettings.callCount, 1, "Event doable was turned off.");

            fnOpenUserSettings.restore();
            fnDone();
        });
    });

    QUnit.test("openUserSettings", function (assert) {
        // Arrange
        // Act
        oUserSettingsController.openUserSettings();

        // Assert
        assert.strictEqual(TempVariables.opened, true, "User Settings Dialog was opened.");
    });

    QUnit.test("_afterClose", function (assert) {
        // Arrange
        var fnResetChangedProperties = sinon.stub();
        var oFakeButton = window.document.createElement("div", { id: "meAreaHeaderButton" }),
            oBody = window.document.getElementsByTagName("body")[0];

        oFakeButton.setAttribute("id", "meAreaHeaderButton");
        oFakeButton.setAttribute("tabindex", "0");
        oBody.appendChild(oFakeButton);

        sap.ushell.Container = {
            getUser: sinon.stub().returns({
                resetChangedProperties: fnResetChangedProperties
            })
        };

        // Act
        oUserSettingsController._afterClose();

        // Assert
        assert.strictEqual(fnResetChangedProperties.called, true, "Changed Properties have been reset.");
        assert.strictEqual(window.document.activeElement, oFakeButton, "set focus back on mearea");

        oBody.removeChild(oFakeButton);
        sap.ushell.Container = undefined;
    });

    QUnit.test("_createDetailPage", function (assert) {
        [
            {
                sTestDescription: "a normal entry is given",
                sEntryId: "normalEntry",
                sTitle: "Normal Setting",
                oContent: {
                    getId: function () {
                        return "contentId1";
                    }
                },
                sExpectedTitle: "Normal Setting"
            },
            {
                sTestDescription: "the user account entry is given and a user image is provided",
                sEntryId: "userAccountEntry",
                sTitle: "User Account",
                bUserImage: true,
                sUserName: "Default User",
                oContent: {
                    getId: function () {
                        return "contentId2";
                    }
                },
                sExpectedTitle: "Default User"
            },
            {
                sTestDescription: "the user account entry is given and no user image is present",
                sEntryId: "userAccountEntry",
                sTitle: "User Account",
                bUserImage: false,
                sUserName: "Default User",
                oContent: {
                    getId: function () {
                        return "contentId3";
                    }
                },
                sExpectedTitle: "Default User"
            }
        ].forEach(function (oFixture) {
            // Arrange
            sap.ushell.Container = {
                getUser: function () {
                    return {
                        getImage: function () {
                            return oFixture.bUserImage;
                        },
                        attachOnSetImage: function () {},
                        getFullName: function () {
                            return oFixture.sUserName;
                        }
                    };
                }
            };

            // Act
            var sResult = oUserSettingsController._createDetailPage(oFixture.sEntryId, oFixture.sTitle, oFixture.oContent);

            // Assert
            var oPage = sap.ui.getCore().byId(sResult);
            assert.strictEqual(sResult, "detail" + oFixture.oContent.getId(), "The returned id is correct when " + oFixture.sTestDescription);
            assert.strictEqual(oPage.getMetadata().getElementName(), "sap.m.Page", "The Page was correctly created when " + oFixture.sTestDescription);
            assert.strictEqual(oPage.getContent()[0].getTitle(), oFixture.sExpectedTitle, "The ObjectHeader has the corrct title when " + oFixture.sTestDescription);
            if (oFixture.sEntryId === "userAccountEntry") {
                assert.strictEqual(oPage.getContent()[0].getIcon(), "sap-icon://person-placeholder", "The ObjectHeader has the corrct icon when " + oFixture.sTestDescription);
            }

            sap.ushell.Container = undefined;
        });
    });

    QUnit.test("_createEntryContent", function (assert) {
        [
            {
                sTestDescription: "the content promise is rejected.",
                oEntry: {
                    entryHelpID: "someId",
                    contentFunc: function () {
                        return jQuery.Deferred().reject();
                    }
                },
                sExpectedId: "detailsomeId"
            },
            {
                sTestDescription: "the content promise is not a sap.ui.Control.",
                oEntry: {
                    entryHelpID: "someOtherId",
                    contentFunc: function () {
                        return jQuery.Deferred().resolve("this");
                    }
                },
                sExpectedId: "detailsomeOtherId"
            },
            {
                sTestDescription: "the content promise is a sap.ui.core.Control.",
                oEntry: {
                    entryHelpID: "anotherId",
                    contentFunc: function () {
                        return jQuery.Deferred().resolve(new sap.ui.core.Control("dummyControl"));
                    }
                },
                sExpectedId: "detaildummyControl"
            },
            {
                sTestDescription: "the valueArgument promise is a rejected.",
                oEntry: {
                    entryHelpID: "exampleId",
                    valueArgument: function () {
                        return jQuery.Deferred().reject();
                    }
                },
                sExpectedId: "detailexampleId"
            },
            {
                sTestDescription: "the valueArgument promise is a string.",
                oEntry: {
                    entryHelpID: "testId",
                    valueArgument: function () {
                        return jQuery.Deferred().resolve("someValue");
                    }
                },
                sExpectedId: "detailtestId"
            }
        ].forEach(function (oFixture) {
            // Arrange
            var fnDone = assert.async();

            // Act
            var oPromise = oUserSettingsController._createEntryContent(oFixture.oEntry);

            // Assert
            oPromise.then(function (sId) {
                assert.strictEqual(sId, oFixture.sExpectedId, "The returned id is correct when " + oFixture.sTestDescription);
                fnDone();
            });
        });
    });

    QUnit.test("_dialogCancelButtonHandler", function (assert) {
        // Arrange
        var fnHandleSettingsDialogClose = sinon.stub(oUserSettingsController, "_handleSettingsDialogClose"),
            fnOnCancel = sinon.stub();

        TempVariables.aEntries = [
            {
                onCancel: fnOnCancel
            },
            {
                onCancel: fnOnCancel
            },
            {
                onCancel: fnOnCancel
            }
        ];

        // Act
        oUserSettingsController._dialogCancelButtonHandler();

        // Assert
        assert.strictEqual(fnOnCancel.callCount, 3, "All Cancel functions have been exectued.");
        assert.strictEqual(fnHandleSettingsDialogClose.called, true, "Closed the User Settings Dialog gracefully.");

        fnHandleSettingsDialogClose.restore();
    });

    QUnit.test("_emitEntryOpened", function (assert) {
        var aUserSettingsEntriesToSave = [
                false,
                false,
                true,
                false
            ],
            sEntryPath = "model/path/1",
            fnEventHubEmit = sinon.stub(EventHub, "emit"),
            fnEventHubLast = sinon.stub(EventHub, "last").returns(aUserSettingsEntriesToSave);

        // Act
        oUserSettingsController._emitEntryOpened(sEntryPath);

        // Assert
        var aExpectedArray = [
            false,
            true,
            true,
            false
        ];
        assert.strictEqual(fnEventHubEmit.called, true, "Event was send");
        assert.strictEqual(fnEventHubEmit.args[0][0], "UserSettingsOpened", "Event name is correct");
        assert.deepEqual(fnEventHubEmit.args[0][1], aExpectedArray, "Event parameter is correct");

        fnEventHubLast.restore();
        fnEventHubEmit.restore();
    });

    QUnit.test("_getEntryIcon", function (assert) {
        [
            {
                sTestDescription: "account icon is given",
                sEntryIcon: "sap-icon://account",
                sUserImage: "userImageUri",
                sExpectedUri: "userImageUri"
            },
            {
                sTestDescription: "account icon is given but no user image is provided",
                sEntryIcon: "sap-icon://account",
                sExpectedUri: "sap-icon://account"
            },
            {
                sTestDescription: "normal icon is given",
                sEntryIcon: "sap-icon://documents",
                sUserImage: "userImageUri",
                sExpectedUri: "sap-icon://documents"
            },
            {
                sTestDescription: "no icon is given",
                sUserImage: "userImageUri",
                sExpectedUri: "sap-icon://action-settings"
            }
        ].forEach(function (oFixture) {
            // Arrange
            // Act
            var sResult = oUserSettingsController._getEntryIcon(oFixture.sEntryIcon, oFixture.sUserImage);

            // Assert
            assert.strictEqual(sResult, oFixture.sExpectedUri, "Correct uri was returned when " + oFixture.sTestDescription);
        });
    });

    QUnit.test("_getEntryVisible", function (assert) {
        [
            {
                sTestDescription: "a setting has visbible undefined and defaultvisible undefined",
                sTitle: "Some Setting",
                bExpectedVisibility: true
            },
            {
                sTestDescription: "a setting has visbible undefined and defaultvisible false",
                bDefaultVisibility: false,
                sTitle: "Some Setting",
                bExpectedVisibility: false
            },
            {
                sTestDescription: "a setting has visbible undefined and defaultvisible true",
                bDefaultVisibility: true,
                sTitle: "Some Setting",
                bExpectedVisibility: true
            },
            {
                sTestDescription: "a setting has visbible false and defaultvisible undefined",
                bVisibility: false,
                sTitle: "Some Setting",
                bExpectedVisibility: false
            },
            {
                sTestDescription: "a setting has visbible false and defaultvisible false",
                bVisibility: false,
                bDefaultVisibility: false,
                sTitle: "Some Setting",
                bExpectedVisibility: false
            },
            {
                sTestDescription: "a setting has visbible false and defaultvisible true",
                bVisibility: false,
                bDefaultVisibility: true,
                sTitle: "Some Setting",
                bExpectedVisibility: false
            },
            {
                sTestDescription: "a setting has visbible true and defaultvisible undefined",
                bVisibility: true,
                sTitle: "Some Setting",
                bExpectedVisibility: true
            },
            {
                sTestDescription: "a setting has visbible true and defaultvisible false",
                bVisibility: true,
                bDefaultVisibility: false,
                sTitle: "Some Setting",
                bExpectedVisibility: true
            },
            {
                sTestDescription: "a setting has visbible true and defaultvisible true",
                bVisibility: true,
                bDefaultVisibility: true,
                sTitle: "Some Setting",
                bExpectedVisibility: true
            },
            {
                sTestDescription: "User Profiling setting has no profiling entries",
                sTitle: "User Profiling",
                bExpectedVisibility: false
            },
            {
                sTestDescription: "User Profiling setting has only the usageAnalytics profiling entry",
                sTitle: "User Profiling",
                aProfilingEntries: [
                    {
                        entryHelpID: "usageAnalytics"
                    }
                ],
                bExpectedVisibility: false
            },
            {
                sTestDescription: "User Profiling setting has multiple profiling entries",
                sTitle: "User Profiling",
                aProfilingEntries: [
                    {
                        entryHelpID: "usageAnalytics"
                    },
                    {
                        entryHelpID: "dummyEntry"
                    }
                ],
                bExpectedVisibility: true
            }
        ].forEach(function (oFixture) {
            // Arrange
            TempVariables.vProperty = oFixture.aProfilingEntries;
            sap.ushell.Container = {
                getService: function () {
                    return {
                        systemEnabled: function () {
                            return true;
                        },
                        isSetUsageAnalyticsPermitted: function () {
                            return false;
                        }
                    };
                }
            };
            // Act
            var bResult = oUserSettingsController._getEntryVisible(oFixture.bVisibility, oFixture.bDefaultVisibility, oFixture.sTitle);

            // Assert
            assert.strictEqual(bResult, oFixture.bExpectedVisibility, "the correct visibiltiy value was returned when " + oFixture.sTestDescription);

            sap.ushell.Container = undefined;
        });
    });

    QUnit.test("_handleNavButton", function (assert) {
        [
            {
                sTestDescription: "Master Page is shown",
                bIsMasterShown: true,
                bExpectedVisibility: false
            },
            {
                sTestDescription: "Master Page is not shown",
                bIsMasterShown: false,
                bExpectedVisibility: true
            }
        ].forEach(function (oFixture) {
            // Arrange
            TempVariables.bNavButtonVisible = undefined;
            TempVariables.bIsMasterShown = oFixture.bIsMasterShown;

            // Act
            oUserSettingsController._handleNavButton();

            // Assert
            assert.strictEqual(TempVariables.bNavButtonVisible, oFixture.bExpectedVisibility, "Backbutton is (not) shown when " + oFixture.sTestDescription);
        });
    });

    QUnit.test("_handleSettingsDialogClose", function (assert) {
        // Act
        oUserSettingsController._handleSettingsDialogClose();

        // Assert
        assert.strictEqual(TempVariables.bToMaster, true, "navigated back to master");
        assert.strictEqual(TempVariables.bRemovedSelection, true, "remove selection from list");
        assert.strictEqual(TempVariables.closed, true, "dialog was closed");
    });

    QUnit.test("_handleSettingsSave", function (assert) {
        [
            {
                sTestDescription: "the utility function resolves",
                oPromise: jQuery.Deferred().resolve(),
                bExpectedVisibility: false,
                bIsSettingDialogClosed: true,
                bShouldRefreshBrowser: false
            },
            {
                sTestDescription: "the utility function rejects",
                oPromise: jQuery.Deferred().reject([]),
                bExpectedVisibility: true,
                bIsSettingDialogClosed: false,
                bShouldRefreshBrowser: false
            },
            {
                sTestDescription: "the utility function resolves",
                oPromise: jQuery.Deferred().resolve({
                    refresh: true
                }),
                bExpectedVisibility: true,
                bIsSettingDialogClosed: true,
                bShouldRefreshBrowser: true
            }
        ].forEach(function (oFixture) {
            // Arrange
            var fnDone = assert.async();
            var fnGetElementsModel = sinon.stub(AppLifeCycle, "getElementsModel").returns({
                    getModel: function () {
                        return {
                            getProperty: function () { return true; },
                            setProperty: function () {}
                        };
                    }
                }),
                fnSaveUserPreferenceEntries = sinon.stub(utils, "saveUserPreferenceEntries").returns(oFixture.oPromise),
                fnHandleSettingsDialogClose = sinon.stub(oUserSettingsController, "_handleSettingsDialogClose");
            var oRefreshBrowserStub = sinon.stub(oUserSettingsController, "_refreshBrowser");

            // Act
            oUserSettingsController._handleSettingsSave();

            setTimeout(function () {
                // Assert
                assert.strictEqual(fnSaveUserPreferenceEntries.called, true, "saveUserPreferenceEntries was called when " + oFixture.sTestDescription);
                assert.strictEqual(fnHandleSettingsDialogClose.called, oFixture.bIsSettingDialogClosed, "User Settings Dialog is handled correctly when " + oFixture.sTestDescription);
                assert.strictEqual(oRefreshBrowserStub.called, oFixture.bShouldRefreshBrowser, "FLP is refreshed after" + oFixture.sTestDescription);
                var oMessageDialog = jQuery(".sapMMessageDialog");

                if (oMessageDialog && oMessageDialog.length) {
                    oMessageDialog.control(0).destroy();
                }

                fnDone();
            }, 0);

            fnGetElementsModel.restore();
            fnSaveUserPreferenceEntries.restore();
            fnHandleSettingsDialogClose.restore();
            oRefreshBrowserStub.restore();
        });
    });

    QUnit.test("_itemPress", function (assert) {
        // Arrange
        var sSelectedItem = "selectedItem",
            sEventId = "select",
            oEvent = {
                getSource: function () {
                    return {
                        getSelectedItem: function () {
                            return sSelectedItem;
                        }
                    };
                },
                getId: function () {
                    return sEventId;
                }
            },
            fnToDetail = sinon.stub(oUserSettingsController, "_toDetail");

        // Act
        oUserSettingsController._itemPress(oEvent);

        // Assert
        assert.strictEqual(fnToDetail.called, true, "When a item is pressed, the User Settings Dialog tries to navigate to the Detail Page.");
        assert.strictEqual(fnToDetail.args[0][0], sSelectedItem, "1. Parameter is correct");
        assert.strictEqual(fnToDetail.args[0][1], sEventId, "2. Parameter is correct");
        fnToDetail.restore();
    });

    QUnit.test("_keyDown", function (assert) {
        // Arrange
        var oEvent = {
                keyCode: 27
            },
            fnDialogCancelButtonHandler = sinon.stub(oUserSettingsController, "_dialogCancelButtonHandler");

        // Act
        oUserSettingsController._keyDown(oEvent);

        // Assert
        assert.strictEqual(fnDialogCancelButtonHandler.called, true, "When ESC is pressed the User Settings Dialog closes gracefully.");

        fnDialogCancelButtonHandler.restore();
    });

    QUnit.test("_listAfterRendering", function (assert) {
        [
            {
                sTestDescription: "no settings are available",
                aEntries: [],
                bExpectedEntryValueResult: false,
                bExpectedEntrySelected: false,
                bExpectedToDetail: false,
                bExpectedFocus: false
            },
            {
                sTestDescription: "a few settings are available",
                aEntries: [
                    {
                        getBindingContext: function () {
                            return {
                                getPath: function () { return "some/path"; }
                            };
                        },
                        getDomRef: function () {
                            return {
                                focus: function () { TempVariables.bFocusSet = true; }
                            };
                        }
                    },
                    {
                        getBindingContext: function () {
                            return {
                                getPath: function () { return "some-other/path"; }
                            };
                        },
                        getDomRef: function () {
                            return {
                                focus: function () { TempVariables.bFocusSet = true; }
                            };
                        }
                    }
                ],
                bExpectedEntryValueResult: true,
                bExpectedEntrySelected: true,
                bExpectedToDetail: true,
                bExpectedFocus: true
            }
        ].forEach(function (oFixture) {
            // Arrange
            TempVariables.aEntries = oFixture.aEntries;
            TempVariables.bEntrySelected = false;
            TempVariables.bFocusSet = false;

            var fnSetEntryValueResult = sinon.stub(oUserSettingsController, "_setEntryValueResult"),
                fnToDetail = sinon.stub(oUserSettingsController, "_toDetail");

            // Act
            oUserSettingsController._listAfterRendering();

            // Assert
            assert.strictEqual(fnSetEntryValueResult.called, oFixture.bExpectedEntryValueResult, "_setEntryValueResult was (not) called when " + oFixture.sTestDescription);
            assert.strictEqual(fnToDetail.called, oFixture.bExpectedToDetail, "_toDetail was (not) called when " + oFixture.sTestDescription);
            assert.strictEqual(TempVariables.bEntrySelected, oFixture.bExpectedEntrySelected, "An Entry was (not) selected when " + oFixture.sTestDescription);
            assert.strictEqual(TempVariables.bFocusSet, oFixture.bExpectedFocus, "The Focus was (not) set when " + oFixture.sTestDescription);

            fnSetEntryValueResult.restore();
            fnToDetail.restore();
        });
    });

    QUnit.test("_navBackButtonPressHandler", function (assert) {
        [
            {
                sTestDescription: "a few settings are available",
                bIsMasterShown: true,
                bExpectedMasterHidden: true,
                bExpectedPressed: false
            },
            {
                sTestDescription: "a few settings are available",
                bIsMasterShown: false,
                bExpectedMasterHidden: false,
                bExpectedPressed: true
            }
        ].forEach(function (oFixture) {
            // Arrange
            TempVariables.bIsMasterShown = oFixture.bIsMasterShown;

            var bPressed,
                oEvent = {
                    getSource: function () {
                        return {
                            setPressed: function (bValue) {
                                bPressed = bValue;
                            },
                            setTooltip: function () {}
                        };
                    }
                };

            // Act
            oUserSettingsController._navBackButtonPressHandler(oEvent);

            // Assert
            assert.strictEqual(TempVariables.bMasterHidden, oFixture.bExpectedMasterHidden, "Master was shown/hidden when " + oFixture.sTestDescription);
            assert.strictEqual(bPressed, oFixture.bExpectedPressed, "NavBackButton is (not) pressed when " + oFixture.sTestDescription);
        });
    });

    QUnit.test("_navToDetail", function (assert) {
        // Arrange
        var fnEventHubEmit = sinon.stub(EventHub, "emit"),
            fnHandleNavButton = sinon.stub(oUserSettingsController, "_handleNavButton"),
            fnEmitEntryOpened = sinon.stub(oUserSettingsController, "_emitEntryOpened");

        TempVariables.sMode = "ShowHideMode";
        TempVariables.bMasterHidden = false;

        // Act
        oUserSettingsController._navToDetail("someId", "select", "some/path");

        // Assert
        assert.strictEqual(TempVariables.sToDetail, "someId", "The correct detail page is called.");
        assert.strictEqual(fnEventHubEmit.called, true, "An event was emited.");
        assert.strictEqual(TempVariables.bMasterHidden, true, "The master was hidden.");
        assert.strictEqual(fnHandleNavButton.called, true, "_handleNavButton was called.");
        assert.strictEqual(fnEmitEntryOpened.called, true, "_emitEntryOpened was called.");
        assert.strictEqual(fnEmitEntryOpened.args[0][0], "some/path", "_emitEntryOpened has the correct arguments.");

        fnEventHubEmit.restore();
        fnHandleNavButton.restore();
        fnEmitEntryOpened.restore();
    });

    QUnit.test("_setEntryValueResult", function (assert) {
        [
            {
                sTestDescription: "valueArgument is a function that has no visible value",
                oEntry: {
                    valueArgument: function () {
                        return jQuery.Deferred().resolve({ displayText: "test" });
                    }
                },
                bExpectedValueResult: "test",
                bExpectedVisibility: true
            },
            {
                sTestDescription: "valueArgument is a function that has a visible value",
                oEntry: {
                    valueArgument: function () {
                        return jQuery.Deferred().resolve({
                            displayText: "test2",
                            value: false
                        });
                    }
                },
                bExpectedValueResult: "test2",
                bExpectedVisibility: false
            },
            {
                sTestDescription: "valueArgument is a function that has a default visible value",
                oEntry: {
                    valueArgument: function () {
                        return jQuery.Deferred().resolve("test3");
                    },
                    defaultVisibility: true
                },
                bExpectedValueResult: "test3",
                bExpectedVisibility: true
            },
            {
                sTestDescription: "valueArgument is a function that returns the value false",
                oEntry: {
                    valueArgument: function () {
                        return jQuery.Deferred().resolve(false);
                    },
                    defaultVisibility: true
                },
                bExpectedValueResult: false,
                bExpectedVisibility: true
            },
            {
                sTestDescription: "valueArgument is a function that returns undefined",
                oEntry: {
                    valueArgument: function () {
                        return jQuery.Deferred().resolve();
                    },
                    defaultVisibility: true
                },
                bExpectedValueResult: " ",
                bExpectedVisibility: true
            },
            {
                sTestDescription: "valueArgument is a value",
                oEntry: {
                    valueArgument: "test4"
                },
                bExpectedValueResult: "test4",
                bExpectedVisibility: undefined
            },
            {
                sTestDescription: "valueArgument is a function that rejects",
                oEntry: {
                    valueArgument: function () {
                        return jQuery.Deferred().reject();
                    }
                },
                bExpectedValueResult: "Could not load data",
                bExpectedVisibility: undefined
            },
            {
                sTestDescription: "valueArgument is undefined",
                oEntry: {},
                bExpectedValueResult: "Could not load data",
                bExpectedVisibility: undefined
            }
        ].forEach(function (oFixture) {
            // Arrange
            TempVariables.fnGetView.restore();

            var oFakeModel = new JSONModel({
                entries: [
                    oFixture.oEntry
                ]
            });

            var fnGetView = sinon.stub(oUserSettingsController, "getView").returns({
                getModel: function () {
                    return oFakeModel;
                }
            });

            // Act
            oUserSettingsController._setEntryValueResult("/entries/0");

            // Assert
            assert.strictEqual(oFakeModel.getProperty("/entries/0/valueResult"), oFixture.bExpectedValueResult, "The correct valueResult was returned when " + oFixture.sTestDescription);
            assert.strictEqual(oFakeModel.getProperty("/entries/0/visible"), oFixture.bExpectedVisibility, "The correct visible value was set when " + oFixture.sTestDescription);

            fnGetView.restore();
        });
    });

    QUnit.test("_toDetail", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var fnCreateEntryContent = sinon.stub(oUserSettingsController, "_createEntryContent").returns(Promise.resolve("somePageId")),
            fnNavToDetail = sinon.stub(oUserSettingsController, "_navToDetail"),
            oSelectedItem = {
                getBindingContext: function () {
                    return {
                        getPath: function () { return "some/path"; }
                    };
                }
            };

        // Act
        oUserSettingsController._toDetail(oSelectedItem, "select");

        // Assert
        assert.strictEqual(fnCreateEntryContent.called, true, "_createEntryContent was called.");

        fnCreateEntryContent.restore();

        window.setTimeout(function () {
            assert.strictEqual(fnNavToDetail.called, true, "_navToDetail was called.");
            assert.strictEqual(fnNavToDetail.args[0][0], "somePageId", "1. paramter of call to _navToDetail was correct.");
            assert.strictEqual(fnNavToDetail.args[0][1], "select", "2. paramter of call to _navToDetail was correct.");
            assert.strictEqual(fnNavToDetail.args[0][2], "some/path", "3. paramter of call to _navToDetail was correct.");
            fnDone();

            fnNavToDetail.restore();
        }, 0);
    });
});