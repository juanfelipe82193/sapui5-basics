// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.AccessKeysHandler
 */
sap.ui.require([
    "sap/ushell/components/ComponentKeysHandler",
    "sap/ushell/renderers/fiori2/AccessKeysHandler",
    "sap/ushell/services/Container",
    "sap/ushell/components/homepage/Component",
    "sap/ui/thirdparty/hasher",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/resources"
], function (
    ComponentKeysHandler,
    AccessKeysHandler,
    Container,
    Component,
    hasher,
    JSONModel,
    Config,
    resources
) {
    "use strict";

    /* global QUnit sinon module test ok asyncTest strictEqual start */

    // init must be only called once over all the tests
    sap.ushell.renderers.fiori2.AccessKeysHandler.init(new JSONModel({
        searchAvailable: false
    }));
    sinon.stub(sap.ushell.renderers.fiori2.AccessKeysHandler, "init");

    module("sap.ushell.renderers.fiori2.AccessKeysHandler", {
        setup: function () { },
        // This method is called after each test. Add every restoration code here.
        teardown: function () { }
    });

    test("create a new instance of AccessKeysHandler Class", function () {
        var instance = sap.ushell.renderers.fiori2.AccessKeysHandler;

        ok(instance,
            "create a new instance");
    });

    test("check AccessKeysHandler Class init flags values", function () {
        var instance = sap.ushell.renderers.fiori2.AccessKeysHandler;

        ok(instance.bFocusOnShell === true,
            "flag init value should be true");
        ok(instance.bFocusPassedToExternalHandlerFirstTime === true,
            "flag init value should be true");
        ok(instance.isFocusHandledByAnotherHandler === false,
            "flag init value should be false");
    });

    asyncTest("move focus to inner application", function () {
        var fnCallbackAppKeysHandler = sinon.spy(),
            getHashStub = sinon.stub(hasher, "getHash").returns("shell-home");

        // register inner application keys handler
        sap.ushell.renderers.fiori2.AccessKeysHandler.registerAppKeysHandler(fnCallbackAppKeysHandler);
        // Trigger the F6 key event to move keys handling to inner application
        var F6keyCode = 117;
        var oEvent;
        // IE doesn't support creating the KeyboardEvent object with a the "new" constructor, hence if this will fail, it will be created
        // using the document object- https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
        // This KeyboardEvent has a constructor, so checking for its ecsitaance will not solve this, hence, only solution found is try-catch
        try {
            oEvent = new KeyboardEvent('keydown');
        } catch (err) {
            var IEevent = document.createEvent("KeyboardEvent");
            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/initKeyboardEvent
            IEevent.initKeyboardEvent("keydown", false, false, null, 0, 0, 0, 0, false);
            oEvent = IEevent;
        }

        oEvent.oEventkeyCode = F6keyCode;
        // Set flag to false because the focus moves to the application responsibility
        sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
        document.dispatchEvent(oEvent);

        setTimeout(function () {
            start();
            ok(fnCallbackAppKeysHandler.calledOnce,
                "Application's keys handler function was not executed");
            getHashStub.restore();
        }, 100);
    });

    test("check focus back to shell flags validity", function () {
        var instance = sap.ushell.renderers.fiori2.AccessKeysHandler;

        // Set flag to false because the focus moves to the application responsibility
        sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;

        // Move focus back to shell
        var F6keyCode = 117,
            oEvent = jQuery.Event("keydown", { keyCode: F6keyCode, shiftKey: true });

        sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);

        ok(instance.bFocusOnShell === true,
            "flag value should be true");
    });

    test("test reset handlres after navigating to another application", function () {
        var instance = sap.ushell.renderers.fiori2.AccessKeysHandler,
            fnCallbackAppKeysHandler = sinon.spy(),
            currentKeysHandler = null,
            hasherGetHashStub = sinon.stub(hasher, "getHash").returns("some-app");

        // register inner application keys handler
        instance.registerAppKeysHandler(fnCallbackAppKeysHandler);

        currentKeysHandler = instance.getAppKeysHandler();
        ok(currentKeysHandler !== null,
            "currently there is a registered keys handler");

        // this function will be called once 'appOpend' event will be fired
        hasherGetHashStub.returns("another-app");
        instance.appOpenedHandler();
        currentKeysHandler = instance.getAppKeysHandler();
        ok(currentKeysHandler === null,
            "currently there is no registered keys handler");

        instance = null;
        hasherGetHashStub.restore();
    });

    test("handleShortcuts:", function () {
        [
            {
                sTestDescription: "ALT was pressed",
                oEvent: { altKey: true },
                bExpectedHandleAltShortcutKeys: true,
                bExpectedHandleCtrlShortcutKeys: false
            }, {
                sTestDescription: "CTRL was pressed",
                oEvent: { ctrlKey: true },
                bExpectedHandleAltShortcutKeys: false,
                bExpectedHandleCtrlShortcutKeys: true
            }, {
                sTestDescription: "CMD + SHIFT + F was pressed",
                oEvent: {
                    metaKey: true,
                    shiftKey: true,
                    keyCode: 70,
                    preventDefault: function () { }
                },
                bExpectedHandleAltShortcutKeys: false,
                bExpectedHandleCtrlShortcutKeys: false
            }
        ].forEach(function (oFixture) {
            // Arrange
            var oAccessKeysHandler = sap.ushell.renderers.fiori2.AccessKeysHandler,
                fnHandleAltShortcutKeysStub = sinon.stub(oAccessKeysHandler, "_handleAltShortcutKeys"),
                fnHandleCtrlShortcutKeysStub = sinon.stub(oAccessKeysHandler, "_handleCtrlShortcutKeys"),
                bTempMacintosh = sap.ui.Device.os.macintosh;

            sap.ui.Device.os.macintosh = true;

            // Act
            oAccessKeysHandler.handleShortcuts(oFixture.oEvent);

            // Assert
            strictEqual(fnHandleAltShortcutKeysStub.called, oFixture.bExpectedHandleAltShortcutKeys,
                "_handleAltShortcutKeys was (not) called when ");
            strictEqual(fnHandleCtrlShortcutKeysStub.called, oFixture.bExpectedHandleCtrlShortcutKeys,
                "_handleCtrlShortcutKeys was (not) called when ");

            fnHandleAltShortcutKeysStub.restore();
            fnHandleCtrlShortcutKeysStub.restore();

            sap.ui.Device.os.macintosh = bTempMacintosh;
        });
    });

    test("_handleAltShortcutKeys:", function (assert) {
        [
            {
                sTestDescription: "ALT + A was pressed",
                oEvent: { keyCode: 65 },
                bAdvancedShellActions: true,
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: true,
                bExpectedFocusItemInOverflowPopover: false
            },
            {
                sTestDescription: "ALT + A was pressed, but bAdvancedShellActions is false",
                oEvent: { keyCode: 65 },
                bAdvancedShellActions: false,
                bExpectedBlockBrowserDefault: false,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + A was pressed and moveAppFinderToShellHeader is true",
                oEvent: { keyCode: 65 },
                bAdvancedShellActions: true,
                bMoveAppFinderActionToShellHeader: true,
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: true
            }, {
                sTestDescription: "ALT + B was pressed (hotkey not in use)",
                oEvent: { keyCode: 66 },
                bExpectedBlockBrowserDefault: false,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + F was pressed",
                oEvent: { keyCode: 70 },
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + H was pressed",
                oEvent: { keyCode: 72 },
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + M was pressed",
                oEvent: { keyCode: 77 },
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + N was pressed",
                oEvent: { keyCode: 78 },
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + S was pressed",
                oEvent: { keyCode: 83 },
                bAdvancedShellActions: true,
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: true,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + s was pressed, but bAdvancedShellActions is false",
                oEvent: { keyCode: 83 },
                bAdvancedShellActions: false,
                bExpectedBlockBrowserDefault: false,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + S was pressed and moveUserSettingsActionToShellHeader is true",
                oEvent: { keyCode: 83 },
                bAdvancedShellActions: true,
                bMoveUserSettingsActionToShellHeader: true,
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: true
            }
        ].forEach(function (oFixture) {
            // Arrange
            var done = assert.async();
            var oAccessKeysHandler = sap.ushell.renderers.fiori2.AccessKeysHandler,
                fnBlockBrowserDefaultStub = sinon.spy(oAccessKeysHandler, "_blockBrowserDefault"),
                fnGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                    byId: function (sId) {
                        if (sId === "shell-header") {
                            return {
                                getHomeUri: function () {
                                    return "#Shell-home";
                                }
                            };
                        }
                        return {
                            isOpen: function () {
                                return true;
                            }
                        };
                    }
                });

            if (!sap.ushell.Container) {
                sap.ushell.Container = {
                    getRenderer: function () {
                        return {
                            getShellConfig: function () {
                                return {
                                    moveAppFinderActionToShellHeader: oFixture.bMoveAppFinderActionToShellHeader,
                                    moveUserSettingsActionToShellHeader: oFixture.bMoveUserSettingsActionToShellHeader
                                };
                            }
                        };
                    }
                };
            }

            // Act
            oAccessKeysHandler._handleAltShortcutKeys(oFixture.oEvent, oFixture.bAdvancedShellActions);

            // Assert
            window.setTimeout(function () {
                strictEqual(fnBlockBrowserDefaultStub.called, oFixture.bExpectedBlockBrowserDefault,
                    "Default Event prevented when " + oFixture.sTestDescription);

                delete sap.ushell.Container;
                done();
            }, 0);

            fnBlockBrowserDefaultStub.restore();
            fnGetCoreStub.restore();
        });
    });

    test("_handleCtrlShortcutKeys:", function () {
        [
            {
                sTestDescription: "CTRL + SHIFT + F was pressed",
                oEvent: { keyCode: 70, shiftKey: true, preventDefault: function () {}, stopPropagation: function () {} },
                bExpectedSettingsButtonPressed: false,
                bExpectedDoneButtonPressed: false,
                bExpectedHandleAccessOverviewKey: false
            }, {
                sTestDescription: "CTRL + F was pressed (hotkey not in use)",
                oEvent: { keyCode: 70, preventDefault: function () {}, stopPropagation: function () {} },
                bExpectedSettingsButtonPressed: false,
                bExpectedDoneButtonPressed: false,
                bExpectedHandleAccessOverviewKey: false
            }, {
                sTestDescription: "CTRL + COMMA was pressed",
                oEvent: { keyCode: 188, preventDefault: function () {}, stopPropagation: function () {} },
                bExpectedSettingsButtonPressed: false,
                bExpectedDoneButtonPressed: false,
                bExpectedHandleAccessOverviewKey: false
            }, {
                sTestDescription: "CTRL + COMMA was pressed",
                oEvent: { keyCode: 188, preventDefault: function () {}, stopPropagation: function () {} },
                bAdvancedShellActions: true,
                bExpectedSettingsButtonPressed: true,
                bExpectedDoneButtonPressed: false,
                bExpectedHandleAccessOverviewKey: false
            }, {
                sTestDescription: "CTRL + F1 was pressed",
                oEvent: { keyCode: 112, preventDefault: function () {}, stopPropagation: function () {} },
                bExpectedSettingsButtonPressed: false,
                bExpectedDoneButtonPressed: false,
                bExpectedHandleAccessOverviewKey: true
            }, {
                sTestDescription: "CTRL + S was pressed",
                oEvent: {
                    keyCode: 83,
                    preventDefault: function () { }
                },
                bExpectedSettingsButtonPressed: false,
                bExpectedDoneButtonPressed: false,
                bExpectedHandleAccessOverviewKey: false
            }, {
                sTestDescription: "CTRL + Enter was pressed",
                oEvent: { keyCode: 13, preventDefault: function () {}, stopPropagation: function () {} },
                bExpectedSettingsButtonPressed: false,
                bExpectedDoneButtonPressed: true,
                bExpectedHandleAccessOverviewKey: false
            }
        ].forEach(function (oFixture) {
            // Arrange
            var oAccessKeysHandler = sap.ushell.renderers.fiori2.AccessKeysHandler,
                fnHandleAccessOverviewKeyStub = sinon.stub(oAccessKeysHandler, "_handleAccessOverviewKey"),
                bSettingsButtonPressed = false,
                bDoneButtonPressed = false,
                fnGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                    byId: function (sId) {
                        if (sId === "userSettingsBtn") {
                            return {
                                firePress: function () {
                                    bSettingsButtonPressed = true;
                                }
                            };
                        } else if (sId === "sapUshellDashboardFooterDoneBtn") {
                            return {
                                getDomRef: function () {
                                    return {};
                                },
                                firePress: function () {
                                    bDoneButtonPressed = true;
                                }
                            };
                        }
                    }
                });

            // Act
            oAccessKeysHandler._handleCtrlShortcutKeys(oFixture.oEvent, oFixture.bAdvancedShellActions);

            // Assert
            strictEqual(fnHandleAccessOverviewKeyStub.called, oFixture.bExpectedHandleAccessOverviewKey,
                "AccessOverview Dialog was (not) created when ");
            strictEqual(bSettingsButtonPressed, oFixture.bExpectedSettingsButtonPressed,
                "Settings Dialog was (not) created when ");
            strictEqual(bDoneButtonPressed, oFixture.bExpectedDoneButtonPressed,
                "Done button was (not) pressed when ");
            fnHandleAccessOverviewKeyStub.restore();
            fnGetCoreStub.restore();
        });
    });

    test("check that on mobile and tablet we do not have accessibility", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.createRenderer("fiori2", true).then(function () {
                var ComponentKeysHandlerInit = sinon.stub(ComponentKeysHandler, "init");

                sap.ui.Device.system.phone = true;
                var oHomepageComponent = new Component({
                    componentData: {
                        properties: {},
                        config: {}
                    }
                });
                ok(!ComponentKeysHandlerInit.called, "Keys handler init was not called in phone mode");

                oHomepageComponent.destroy();

                sap.ui.Device.system.phone = false;
                sap.ui.Device.system.tablet = true;
                oHomepageComponent = new Component({
                    componentData: {
                        properties: {},
                        config: {}
                    }
                });

                ok(!ComponentKeysHandlerInit.called, "Keys handler init was not called in tablet mode");

                oHomepageComponent.destroy();
                ComponentKeysHandlerInit.restore();
                done();
            });
        });
    });

    test("suppress F1 help on CTRL + F1 in Internet Explorer", function (assert) {
        var oAccessKeysHandler = sap.ushell.renderers.fiori2.AccessKeysHandler,
            isInternetExplorer = sap.ui.Device.browser.msie,
            oCancelHelpEventSpy,
            oHelpEvent1,
            oHelpEvent2;

        oAccessKeysHandler.aShortcutsDescriptions = [];

        if (!isInternetExplorer) {
            sap.ui.Device.browser.msie = true;
        }

        oCancelHelpEventSpy = sinon.spy(oAccessKeysHandler, "_cancelHelpEvent");

        // simulate CTRL + F1
        oAccessKeysHandler._handleAccessOverviewKey();

        if (isInternetExplorer) {
            oHelpEvent1 = document.createEvent("Event");
            oHelpEvent1.initEvent("help", true, true);
            oHelpEvent2 = document.createEvent("Event");
            oHelpEvent2.initEvent("help", true, true);
        } else {
            oHelpEvent1 = new Event("help", { bubbles: true, cancelable: true });
            oHelpEvent2 = new Event("help", { bubbles: true, cancelable: true });
        }

        // the help event is triggered together with CTRL + F1 in Internet Explorer
        document.dispatchEvent(oHelpEvent1);
        assert.strictEqual(oCancelHelpEventSpy.callCount, 1,
            "The help cancelling event handler was called for CTRL + F1");

        // the second help event is for F1 without CTRL
        document.dispatchEvent(oHelpEvent2);
        assert.strictEqual(oCancelHelpEventSpy.callCount, 1,
            "The help cancelling event handler was not called for F1");

        if (!isInternetExplorer) {
            // this cannot be tested in Internet Explorer as the original event is not changed here
            assert.strictEqual(oHelpEvent1.defaultPrevented, true,
                "For CTRL + F1 the help event was cancelled");
            assert.strictEqual(oHelpEvent2.defaultPrevented, false,
                "For F1 the help event was not cancelled");

            // cleanup: this attribute only exists in Internet Explorer
            delete sap.ui.Device.browser.msie;
        }
        oCancelHelpEventSpy.restore();
        sap.ui.getCore().byId("hotKeysGlossary").destroy();
    });

    QUnit.module("_handleAccessOverviewKey method", {
        beforeEach: function () {
            this.oGetTextSpy = sinon.spy(resources.i18n, "getText");
            this.oNotificationConfigStub = sinon.stub(Config, "last");
            this.oAccessKeysHandler = sap.ushell.renderers.fiori2.AccessKeysHandler;
            this.bOldSearchAvailable = this.oAccessKeysHandler.oModel.getProperty("/searchAvailable");
            this.bOldPersonalization = this.oAccessKeysHandler.oModel.getProperty("/personalization");

            this.oNotificationConfigStub.returns(true);
            this.oAccessKeysHandler.oModel.setProperty("/searchAvailable", true);
            this.oAccessKeysHandler.oModel.setProperty("/personalization", true);

            this.oBody = window.document.getElementsByTagName("body")[0];
            this.oShellHeader = window.document.createElement("div");

            this.oShellHeader.setAttribute("id", "shell-header");
            this.oBody.appendChild(this.oShellHeader);

            this.fnDialog = function () {
                return sap.ui.getCore().byId("hotKeysGlossary");
            };
        },
        afterEach: function () {
            this.oGetTextSpy.restore();
            this.oNotificationConfigStub.restore();
            this.oAccessKeysHandler.oModel.setProperty("/searchAvailable", this.bOldSearchAvailable);
            this.oAccessKeysHandler.oModel.setProperty("/personalization", this.bOldPersonalization);

            this.fnDialog().destroy();
            this.oBody.removeChild(this.oShellHeader);
        }
    });

    QUnit.test("Check short keys dialog is creating successfully with every shortcut available", function (assert) {
        // Arrange

        // Act
        this.oAccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 1, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeySaveEditing").callCount, 1, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with notifications disabled", function (assert) {
        // Arrange
        this.oNotificationConfigStub.returns(false);

        // Act
        this.oAccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 1, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 0, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeySaveEditing").callCount, 1, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with personalization disabled", function (assert) {
        // Arrange
        this.oAccessKeysHandler.oModel.setProperty("/personalization", false);

        // Act
        this.oAccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 0, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeySaveEditing").callCount, 0, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with search unavailable", function (assert) {
        // Arrange
        this.oAccessKeysHandler.oModel.setProperty("/searchAvailable", false);

        // Act
        this.oAccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 1, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 0, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeySaveEditing").callCount, 1, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 0, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with advancedShellActions unavailable", function (assert) {
        // Arrange

        // Act
        this.oAccessKeysHandler._handleAccessOverviewKey(false);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 0, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 0, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 0, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeySaveEditing").callCount, 1, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with every flag on false", function (assert) {
        // Arrange
        this.oAccessKeysHandler.oModel.setProperty("/searchAvailable", false);
        this.oAccessKeysHandler.oModel.setProperty("/personalization", false);
        this.oNotificationConfigStub.returns(false);

        // Act
        this.oAccessKeysHandler._handleAccessOverviewKey(false);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 0, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 0, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 0, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 0, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 0, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeySaveEditing").callCount, 0, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 0, "The focus search field text was requested.");
    });
});