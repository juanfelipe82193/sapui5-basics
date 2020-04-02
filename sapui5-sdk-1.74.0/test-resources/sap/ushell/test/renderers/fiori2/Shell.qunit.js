// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global QUnit, sinon, hasher*/

/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.Shell
 */
QUnit.config.autostart = false;

sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ui/Device",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/ui/model/json/JSONModel",
    "sap/m/BusyDialog",
    "sap/ushell/components/applicationIntegration/Storage",
    "sap/ushell/components/applicationIntegration/relatedServices/RelatedServices",
    "sap/ui/core/routing/History",
    "sap/ushell/components/HeaderManager",
    "sap/ushell/bootstrap/SchedulingAgent",
    "sap/ui/core/library",
    "sap/ushell/ApplicationType",
    "sap/base/util/UriParameters",
    "sap/ushell/services/Container",
    "sap/ushell/services/Message"
], function (
    testUtils,
    Device,
    AppLifeCycle,
    EventHub,
    Config,
    JSONModel,
    BusyDialog,
    Storage,
    RelatedServices,
    Ui5History,
    HeaderManager,
    SchedulingAgent,
    library,
    ApplicationType,
    UriParameters
    // Container
    // Message
) {
    "use strict";

    var Ui5HistoryDirection = library.routing.HistoryDirection;

    QUnit.config.reorder = false;
    QUnit.start();

    var fnGetCoreRTLStub;

    function createMockedView(oShellModel) {
        return {
            createPostCoreExtControls: sinon.stub(),
            getViewData: sinon.stub().returns({ shellModel: oShellModel }),
            setModel: sinon.stub(),
            oShellHeader: { setModel: sinon.stub() }
        };
    }

    function waitConfigChange(sPath) {
        return new Promise(function (fnDone) { Config.once(sPath).do(fnDone); });
    }

    function isAlreadyStubbed(oObject, sMethodName) {
        // sinon adds displayName property to the method when stubbing
        return (oObject[sMethodName] && oObject[sMethodName].displayName) === sMethodName;
    }

    function stubHashChangeHandler() {
        // In the Shell-view there is a 6 seconds setTimeout that triggers the HashChangeHandler#handle method.
        // This method makes use of objects that have been deleted, before the 6 seconds,
        // when the test is over (sap.ushell.Container for example).
        // If we don't stub the handle method, an error appears after QUnit is done with a successful test execution...

        // 1. require in advance to be able to stub, but after bootstrap (see where this method is called),
        //    as it needs sap.ushell.Container to exist
        jQuery.sap.require("sap.ushell.renderers.fiori2.search.HashChangeHandler");

        // 2. stub method only one time and leave stubbed, because it's important that the logic does not trigger after the setTimeout
        if (!isAlreadyStubbed(sap.ushell.renderers.fiori2.search.HashChangeHandler, "handle")) {
            sinon.stub(sap.ushell.renderers.fiori2.search.HashChangeHandler, "handle");
        }
    }

    var oController;

    QUnit.module("sap.ushell.renderers.fiori2.Shell - Fiori 2.0 Configuration ON", {
        beforeEach: function (assert) {
            var done = assert.async();
            window["sap-ushell-config"] = {};
            window["sap-ushell-config"].renderers = { fiori2: { componentData: { config: { enableNotificationsUI: true } } } };

            sap.ushell.bootstrap("local").then(function () {
                stubHashChangeHandler();
                var oService = sap.ushell.Container.getService("ShellNavigation");
                this.oInitStub = sinon.stub(oService, "init");

                jQuery.sap.declare("sap.ushell.components.container.ApplicationContainer");
                sap.ushell.components.container.ApplicationContainer = function () { };

                oController = new sap.ui.controller("sap.ushell.renderers.fiori2.Shell");
                var oShellModel = Config.createModel("/core/shell/model", JSONModel);
                oController.getView = sinon.stub().returns(createMockedView(oShellModel));
                var oApplicationModel = AppLifeCycle.shellElements().model();
                HeaderManager.init({}, oApplicationModel);
                oController.initShellModel({}, oApplicationModel);
                oController.history = new sap.ushell.renderers.fiori2.History();
                oController.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");

                this.oBusyDialogOpenStub = sinon.stub(BusyDialog.prototype, "open");
                done();
            }.bind(this));
        },
        afterEach: function (assert) {
            var done = assert.async();

            sap.ushell.Container.getServiceAsync("ShellNavigation").then(function () {
                delete sap.ushell.Container;

                if (oController) {
                    testUtils.restoreSpies(oController._isColdStart);
                    oController.destroy();
                }

                this.oBusyDialogOpenStub.restore();
                this.oBusyDialogOpenStub = null;

                EventHub._reset();

                done();
            }.bind(this));
        }
    });

    QUnit.test("test Shell back button on RTL", function (assert) {
        var done = assert.async(),
            getConfigurationStub = sinon.stub(sap.ui.getCore().getConfiguration(), "getRTL").returns(true),
            oRenderer = sap.ushell.Container.createRenderer("fiori2");

        EventHub.once("RendererLoaded").do(function () {
            var oHomeBtn = sap.ui.getCore().byId("backBtn");

            assert.ok(oHomeBtn.getIcon().indexOf("feeder-arrow") > 0, "Home Button should be with Right Orientation when RTL is ON");

            getConfigurationStub.restore();
            oRenderer.destroy();

            done();
        });
    });

    QUnit.test("test _getAppContainer called with shell UI service", function (assert) {
        var done = assert.async(),
            oRenderer = sap.ushell.Container.createRenderer("fiori2"),
            oResolvedNavigationTarget = { url: "http://xxx.yyy" };

        EventHub.once("RendererLoaded").do(function () {
            sinon.stub(AppLifeCycle.getShellUIService(), "getInterface").returns({ method: "implementation" });

            var oApplicationContainer = AppLifeCycle.getAppContainer("application-Action-toappnavsample-component", oResolvedNavigationTarget, false);

            assert.deepEqual(oResolvedNavigationTarget.shellUIService, { method: "implementation" }, "shellUIService was added to the resolved navigation target");

            oApplicationContainer.destroy();
            oRenderer.destroy();
            done();
        });
    });

    [{
        testDescription: "isColdStart is true",
        bIsColdStart: true,
        expectedTargetNavigationMode: "explace"
    }, {
        testDescription: "isColdStart is false",
        bIsColdStart: false,
        expectedTargetNavigationMode: "inplace"
    }].forEach(function (oFixture) {
        QUnit.test("test _getAppContainer creates application container with the expected target nav mode when " + oFixture.testDescription, function (assert) {
            var done = assert.async(),
                oRenderer = sap.ushell.Container.createRenderer("fiori2");

            EventHub.once("RendererLoaded").do(function () {
                var oController = sap.ui.getCore().byId("mainShell").getController(),
                    oResolvedNavigationTarget = { url: "http://xxx.yyy" };

                sinon.stub(oController, "_isColdStart").returns(oFixture.bIsColdStart);

                var oApplicationContainer = AppLifeCycle.getAppContainer("application-Action-toappnavsample-component", oResolvedNavigationTarget, oFixture.bIsColdStart);

                assert.deepEqual(oResolvedNavigationTarget.targetNavigationMode, oFixture.expectedTargetNavigationMode,
                    "the expected target navmdoe was passed to the application container");

                oApplicationContainer.destroy();
                oRenderer.destroy();
                done();
            });
        });
    });

    QUnit.test("test _reorderUserPrefEntries", function (assert) {
        var entries = [{ entryHelpID: "test1" }, { entryHelpID: "test2" }, { entryHelpID: "test3" }, { entryHelpID: "test4" }],
            originalEntries = entries.slice(),
            reorderedEntries = oController._reorderUserPrefEntries(entries);
        assert.deepEqual(originalEntries, reorderedEntries, "Entries array shouldn't change if no flpSettings entry and no themes entry");

        entries = [{ entryHelpID: "test1" }, { entryHelpID: "themes" }, { entryHelpID: "test3" }, { entryHelpID: "test4" }];
        originalEntries = entries.slice();
        reorderedEntries = oController._reorderUserPrefEntries(entries);
        assert.deepEqual(originalEntries, reorderedEntries, "Entries array shouldn't change if no flpSettings entry");

        entries = [{ entryHelpID: "test1" }, { entryHelpID: "test2" }, { entryHelpID: "flpSettingsEntry" }, { entryHelpID: "test4" }];
        originalEntries = entries.slice();
        reorderedEntries = oController._reorderUserPrefEntries(entries);
        assert.deepEqual(originalEntries, reorderedEntries, "Entries array shouldn't change if no themes entry");

        entries = [{ entryHelpID: "test1" }, { entryHelpID: "themes" }, { entryHelpID: "test3" }, { entryHelpID: "flpSettingsEntry" }];
        originalEntries = entries.slice();
        reorderedEntries = oController._reorderUserPrefEntries(entries);
        assert.strictEqual(reorderedEntries[0].entryHelpID, "test1", "test1 entry didn't move");
        assert.strictEqual(reorderedEntries[1].entryHelpID, "themes", "themes entry didn't move");
        assert.strictEqual(reorderedEntries[2].entryHelpID, "flpSettingsEntry", "flpSettings entry moved to be right after themes entry");
        assert.strictEqual(reorderedEntries[3].entryHelpID, "test3", "test3 entry moved to be after flpSettings entry");
    });

    QUnit.test("test _activateFloatingUIActions", function (assert) {
        var done = assert.async(),
            oRenderer = sap.ushell.Container.createRenderer("fiori2");
        EventHub.once("RendererLoaded").do(function () {
            var oController = sap.ui.getCore().byId("mainShell").getController(),
                enableFunction = sinon.spy(),
                disableFunction = sinon.spy();
            oController.oFloatingUIActions = { enable: enableFunction, disable: disableFunction };
            oController._activateFloatingUIActions(500);
            assert.strictEqual(enableFunction.callCount, 1, " enable function should be called once");
            assert.strictEqual(disableFunction.callCount, 0, "disable function should not be callled");
            enableFunction.reset();
            disableFunction.reset();
            oController._activateFloatingUIActions(400);
            assert.strictEqual(disableFunction.callCount, 1, " disable function should be called once");
            assert.strictEqual(enableFunction.callCount, 0, "enable function should not be callled");
            enableFunction.reset();
            disableFunction.reset();
            oRenderer.destroy();
            done();
        });
    });

    QUnit.test("test_allowupToThreeFlpActionsInShellHeader", function (assert) {
        var done = assert.async(),
            sapUshellConfig = {
                "enablePersonalization": true,
                "moveGiveFeedbackActionToShellHeader": true,
                "moveAppFinderActionToShellHeader": true,
                "moveUserSettingsActionToShellHeader": true,
                "moveContactSupportActionToShellHeader": true,
                "moveEditHomePageActionToShellHeader": true
            },
            oRenderer = sap.ushell.Container.createRenderer("fiori2");

        EventHub.once("RendererLoaded").do(function () {
            var oController = sap.ui.getCore().byId("mainShell").getController();

            oController.getView()._allowUpToThreeActionInShellHeader(sapUshellConfig);

            assert.strictEqual(sapUshellConfig.moveContactSupportActionToShellHeader, false, "moveContactSupportActionToShellHeader should be set to false ");
            assert.strictEqual(sapUshellConfig.moveEditHomePageActionToShellHeader, false, "moveEditHomePageActionToShellHeader should be set to false ");
            assert.strictEqual(sapUshellConfig.moveGiveFeedbackActionToShellHeader, true, "moveGiveFeedbackActionToShellHeader should be set to true ");
            assert.strictEqual(sapUshellConfig.moveAppFinderActionToShellHeader, true, "moveAppFinderActionToShellHeader should be set to true ");
            assert.strictEqual(sapUshellConfig.moveUserSettingsActionToShellHeader, true, "moveUserSettingsActionToShellHeader should be set to true ");

            oRenderer.destroy();
            done();
        });
    });

    QUnit.test("test_movingOfFLpActionsToShellHeaderInModel", function (assert) {
        var done = assert.async(),
            oRenderer = sap.ushell.Container.createRenderer("fiori2");

        EventHub.once("RendererLoaded").do(function () {
            var oController = sap.ushell.Container.getRenderer("fiori2").getShellController(),
                oConfig = {
                    moveContactSupportActionToShellHeader: true,
                    moveEditHomePageActionToShellHeader: true,
                    moveGiveFeedbackActionToShellHeader: true,
                    moveAppFinderActionToShellHeader: true,
                    moveUserSettingsActionToShellHeader: true
                },
                oApplicationModel = AppLifeCycle.shellElements().model();
            HeaderManager.init(oConfig, oApplicationModel);
            oController.initShellModel(oConfig, oApplicationModel);

            var oElementsModel = sap.ushell.components.applicationIntegration.AppLifeCycle.getElementsModel(),
                aStates = oElementsModel.getAllStatesInDelta();

            aStates.forEach(function (sState) {
                var aDeltaActions = oElementsModel.getCustomStateDeltaMember(sState, "actions"),
                    aBaseStateActions = oElementsModel.getBaseStateMember(sState, "actions"),
                    aBaseStateHeadEndItems = HeaderManager._getBaseStateMember(sState, "headEndItems");

                assert.ok(aDeltaActions.indexOf("ContactSupportBtn") === -1 && aBaseStateActions.indexOf("ContactSupportBtn") === -1, "ContactSupportBtn removed from custom actions for state: " + sState);
                assert.ok(aDeltaActions.indexOf("EndUserFeedbackBtn") === -1 && aBaseStateActions.indexOf("EndUserFeedbackBtn") === -1, "EndUserFeedbackBtn removed from actions for state: " + sState);
                assert.ok(aBaseStateHeadEndItems.indexOf("ContactSupportBtn") != -1 && aBaseStateHeadEndItems.indexOf("EndUserFeedbackBtn") != -1, "moveContactSupportActionToShellHeader to shell header ");
            });

            oRenderer.destroy();
            done();
        });
    });

    QUnit.test("Test floating container docking functionality for Desktop devices", function (assert) {
        oController.getModel().setProperty("/enableSAPCopilotWindowDocking", true);
        var oGetCurrentRangeStub = sinon.stub(Device.media, "getCurrentRange").returns({ name: "Desktop" }),
            xPositionRightDock = jQuery(window).width() - 63,
            xPositionLeftDock = 63,
            xPositionUnDock = 100,
            rightDockingClassName = "sapUshellShellDisplayDockingAreaRight",
            leftDockingClassName = "sapUshellShellDisplayDockingAreaLeft",
            cfg = {
                moveX: xPositionRightDock,
                clone: { parentElement: jQuery("<div id=\"parentElementTest\">") }
            };

        jQuery(document.body).append(cfg.clone.parentElement);

        var oOpenDockingAreaSpy = sinon.spy(oController, "_openDockingArea"),
            oCloseDockingAreaSpy = sinon.spy(oController, "_closeDockingArea"),
            oIsDockingAreaOpenSpy = sinon.spy(oController, "_isDockingAreaOpen");

        oController._doDock(cfg);
        assert.strictEqual(oOpenDockingAreaSpy.callCount, 1, "_openDockingArea called once when docking floating container to the right");
        assert.strictEqual(cfg.docked.dockPos, "right", "cfg object docPos property was set to be right - this is done in _openDockingArea function");
        assert.strictEqual(cfg.docked.setIsDockingAreaOpen, true, "cfg object setIsDockingAreaOpen property was set to be true - this is done in _openDockingArea function");
        assert.strictEqual(cfg.clone.parentElement.children()[0].className, rightDockingClassName, "Parent element contain the right docking element");

        oOpenDockingAreaSpy.reset();

        // test left docking
        // clear the cfg parentElement childrens
        // IE does not support Element.remove()
        var parentElementTest = document.getElementById("parentElementTest");
        if (parentElementTest.remove) {
            parentElementTest.remove();
        } else {
            parentElementTest.parentNode.removeChild(parentElementTest);
        }

        cfg.clone.parentElement = null;
        cfg.clone.parentElement = jQuery("<div id=\"parentElementTest\">");
        jQuery(document.body).append(cfg.clone.parentElement);

        cfg.moveX = xPositionLeftDock;
        oController._doDock(cfg);
        assert.strictEqual(oOpenDockingAreaSpy.callCount, 1, "_openDockingArea called once when docking floating container to the left");
        assert.strictEqual(cfg.docked.dockPos, "left", "cfg object docPos property was set to be left - this is done in _openDockingArea function");
        assert.strictEqual(cfg.docked.setIsDockingAreaOpen, true, "cfg object setIsDockingAreaOpen property was set to be true - this is done in _openDockingArea function");
        assert.strictEqual(cfg.clone.parentElement.children()[0].className, leftDockingClassName, "Parent element contain the left docking element");

        // test undock

        // clear the cfg parentElement childrens
        // IE does not support Element.remove()
        parentElementTest = document.getElementById("parentElementTest");
        if (parentElementTest.remove) {
            parentElementTest.remove();
        } else {
            parentElementTest.parentNode.removeChild(parentElementTest);
        }

        cfg.clone.parentElement = null;
        cfg.clone.parentElement = jQuery("<div id=\"parentElementTest\">");
        jQuery(document.body).append(cfg.clone.parentElement);

        // then dock it
        cfg.moveX = xPositionLeftDock;
        oController._doDock(cfg);
        oIsDockingAreaOpenSpy.reset();

        // now un-dock it
        cfg.moveX = xPositionUnDock;
        oController._doDock(cfg);
        assert.strictEqual(oCloseDockingAreaSpy.callCount, 1, "_closeDockingArea called once when floating container is being un docked");
        assert.strictEqual(oIsDockingAreaOpenSpy.callCount, 1, "_isDockingAreaOpen called once when floating container is being un docked");

        // IE does not support Element.remove()
        parentElementTest = document.getElementById("parentElementTest");
        if (parentElementTest.remove) {
            parentElementTest.remove();
        } else {
            parentElementTest.parentNode.removeChild(parentElementTest);
        }

        oOpenDockingAreaSpy.restore();
        oCloseDockingAreaSpy.restore();
        oIsDockingAreaOpenSpy.restore();
        oGetCurrentRangeStub.restore();
    });

    QUnit.test("Test floating container docking functionality in RTL for Desktop devices", function (assert) {
        var oGetCurrentRangeStub = sinon.stub(Device.media, "getCurrentRange").returns({ name: "Desktop" });
        fnGetCoreRTLStub = sap.ui.getCore().getConfiguration().getRTL;
        var oGetRtlStub = sinon.stub(sap.ui.getCore().getConfiguration(), "getRTL").returns(true);
        oController.getModel().setProperty("/enableSAPCopilotWindowDocking", true);

        var xPositionRightDock = jQuery(window).width() - 63,
            xPositionLeftDock = 63,
            xPositionUnDock = 100,
            rightDockingClassName = "sapUshellShellDisplayDockingAreaRight",
            leftDockingClassName = "sapUshellShellDisplayDockingAreaLeft",
            cfg = {
                moveX: xPositionRightDock,
                clone: { parentElement: jQuery("<div id=\"parentElementTest\">") }
            };

        jQuery(document.body).append(cfg.clone.parentElement);

        // test right docking
        var oOpenDockingAreaSpy = sinon.spy(oController, "_openDockingArea"),
            oCloseDockingAreaSpy = sinon.spy(oController, "_closeDockingArea"),
            oIsDockingAreaOpenSpy = sinon.spy(oController, "_isDockingAreaOpen");

        oController._doDock(cfg);
        assert.strictEqual(oOpenDockingAreaSpy.callCount, 1, "_openDockingArea called once when docking floating container to the right");
        assert.strictEqual(cfg.docked.dockPos, "right", "cfg object docPos property was set to be right - this is done in _openDockingArea function");
        assert.strictEqual(cfg.docked.setIsDockingAreaOpen, true, "cfg object setIsDockingAreaOpen property was set to be true - this is done in _openDockingArea function");
        assert.strictEqual(cfg.clone.parentElement.children()[0].className, leftDockingClassName, "Parent element contain the left docking element since this RTL");

        oOpenDockingAreaSpy.reset();

        // test left docking
        // clear the cfg parentElement childrens
        // IE does not support Element.remove()
        var parentElementTest = document.getElementById("parentElementTest");
        if (parentElementTest.remove) {
            parentElementTest.remove();
        } else {
            parentElementTest.parentNode.removeChild(parentElementTest);
        }

        cfg.clone.parentElement = null;
        cfg.clone.parentElement = jQuery("<div id=\"parentElementTest\">");
        jQuery(document.body).append(cfg.clone.parentElement);

        cfg.moveX = xPositionLeftDock;
        oController._doDock(cfg);
        assert.strictEqual(oOpenDockingAreaSpy.callCount, 1, "_openDockingArea called once when docking floating container to the left");
        assert.strictEqual(cfg.docked.dockPos, "left", "cfg object docPos property was set to be left - this is done in _openDockingArea function");
        assert.strictEqual(cfg.docked.setIsDockingAreaOpen, true, "cfg object setIsDockingAreaOpen property was set to be true - this is done in _openDockingArea function");
        assert.strictEqual(cfg.clone.parentElement.children()[0].className, rightDockingClassName, "Parent element contain the right docking element since this RTL");

        // test undock

        // clear the cfg parentElement childrens
        // IE does not support Element.remove()
        parentElementTest = document.getElementById("parentElementTest");
        if (parentElementTest.remove) {
            parentElementTest.remove();
        } else {
            parentElementTest.parentNode.removeChild(parentElementTest);
        }

        cfg.clone.parentElement = null;
        cfg.clone.parentElement = jQuery("<div id=\"parentElementTest\">");
        jQuery(document.body).append(cfg.clone.parentElement);

        // then dock it
        cfg.moveX = xPositionLeftDock;
        oController._doDock(cfg);
        oIsDockingAreaOpenSpy.reset();

        // now un-dock it
        cfg.moveX = xPositionUnDock;
        oController._doDock(cfg);
        assert.strictEqual(oCloseDockingAreaSpy.callCount, 1, "_closeDockingArea called once when floating container is being un-docked");
        assert.strictEqual(oIsDockingAreaOpenSpy.callCount, 1, "_isDockingAreaOpen called once when floating container is being un-docked");

        // IE does not support Element.remove()
        parentElementTest = document.getElementById("parentElementTest");
        if (parentElementTest.remove) {
            parentElementTest.remove();
        } else {
            parentElementTest.parentNode.removeChild(parentElementTest);
        }

        oOpenDockingAreaSpy.restore();
        oCloseDockingAreaSpy.restore();
        oGetCurrentRangeStub.restore();
        oGetRtlStub.restore();
    });

    QUnit.module("sap.ushell.renderers.fiori2.Shell", {
        beforeEach: function (assert) {
            var done = assert.async();
            window.location.hash = "";

            sap.ushell.bootstrap("local").then(function () {
                var oShellModel;

                stubHashChangeHandler();

                jQuery.sap.flpmeasure = {
                    end: function () { },
                    start: function () { }
                };

                jQuery.sap.declare("sap.ushell.components.container.ApplicationContainer");
                sap.ushell.components.container.ApplicationContainer = function (sId) {
                    return {
                        addEventDelegate: function () { },
                        addStyleClass: function () { },
                        getActive: function () { },
                        setActive: function () { },
                        getId: function () { return sId; },
                        toggleStyleClass: function () { }
                    };
                };

                sap.m.BusyDialog.prototype.open = function () { };

                oController = new sap.ui.controller("sap.ushell.renderers.fiori2.Shell");

                oController.bEnableHashChange = true;
                oShellModel = Config.createModel("/core/shell/model", JSONModel);
                oController.getView = sinon.stub().returns(createMockedView(oShellModel));
                var oApplicationModel = AppLifeCycle.shellElements().model();
                HeaderManager.init({}, oApplicationModel);
                oController.initShellModel({}, oApplicationModel);
                oController.history = new sap.ushell.renderers.fiori2.History();
                oController.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");
                sinon.stub(sap.ushell.services.AppConfiguration, "setCurrentApplication");

                sinon.stub(oController, "delayedMessageError"); // prevent showing error popup

                done();
            });
        },
        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            testUtils.restoreSpies(
                sap.ui.getCore().attachThemeChanged,
                sap.ui.component.load,
                sap.ushell.utils.appendUserIdToUrl,
                sap.ushell.utils.getPrivateEpcm,
                sap.ushell.utils.isNativeWebGuiNavigation,
                window.hasher.replaceHash,
                sap.ushell.services.AppConfiguration.setCurrentApplication,
                sap.ushell.services.AppConfiguration._processKey,
                AppLifeCycle.isAppInCache,
                AppLifeCycle.handleControl
            );
            window.location.hash = "";

            if (fnGetCoreRTLStub) {
                sap.ui.getCore().getConfiguration().getRTL = fnGetCoreRTLStub;
            }

            if (oController._openAppInNewWindow) {
                testUtils.restoreSpies(oController._openAppInNewWindow);
            }

            delete sap.ushell.Container;
            oController.destroy();
            HeaderManager.destroy();

            EventHub._reset();
        }
    });

    var sBasicShellHash = "#hash",
        sShellHashNavResCtx = "#navResCtx",
        sOldShellHash = "#oldHash",
        sOldAppPart = "oldAppPart",
        sAppPart = "AppPart";

    QUnit.test("#_applicationIsStatefulType", function (assert) {
        [{
            description: "When an application type is marked as stateful, BUT a container for the stateful type does NOT exist it returns true",
            oStatefulApplicationContainer: { "XZY-TYPE": null },
            output: { expected: true },
            input: { sApplicationType: "XZY-TYPE" }
        }, {
            description: "When an application type is marked as stateful, AND a container for the stateful type does exist it returns true",
            oStatefulApplicationContainer: { "XZY-TYPE": {} },
            output: { expected: true },
            input: { sApplicationType: "XZY-TYPE" }
        }, {
            description: "When an application type is NOT marked as stateful it returns false",
            oStatefulApplicationContainer: {},
            output: { expected: false },
            input: { sApplicationType: "XZY-TYPE" }
        }].forEach(function (oFixture) {
            // Arrange
            AppLifeCycle.setStatefulApplicationContainer(oFixture.oStatefulApplicationContainer);

            // Act & Assert
            assert.equal(
                AppLifeCycle.applicationIsStatefulType(oFixture.input.sApplicationType),
                oFixture.output.expected,
                oFixture.description
            );
        });
    });

    QUnit.test("#_getStatefulContainer", function (assert) {
        [{
            description: "When an application type is marked as stateful, it returns the current state of the container",
            oStatefulApplicationContainer: { "XZY-TYPE": null },
            output: { expected: null },
            input: { sApplicationType: "XZY-TYPE" }
        }].forEach(function (oFixture) {
            // Arrange
            AppLifeCycle.setStatefulApplicationContainer(oFixture.oStatefulApplicationContainer);

            // Act & Assert
            assert.equal(
                AppLifeCycle.getStatefulContainer(oFixture.input.sApplicationType),
                oFixture.output.expected,
                oFixture.description
            );
        });
    });

    QUnit.test("#_setStatefulContainer", function (assert) {
        [{
            description: "Sets the state of the container to the value passed",
            oStatefulApplicationContainer: { "XZY-TYPE": {} },
            output: { expected: null },
            input: {
                sApplicationType: "XZY-TYPE",
                oApplicationContainer: null
            }
        }].forEach(function (oFixture) {
            AppLifeCycle.setStatefulApplicationContainer(oFixture.oStatefulApplicationContainer);

            // Act
            AppLifeCycle.setStatefulContainer(oFixture.input.sApplicationType, oFixture.input.oApplicationContainer);

            // Assert
            assert.equal(
                AppLifeCycle.getStatefulContainer(oFixture.input.sApplicationType),
                oFixture.output.expected,
                oFixture.description
            );
        });
    });

    QUnit.test("#_statefulContainerForTypeExists", function (assert) {
        [{
            description: "When an application type is marked as stateful, BUT a container for the stateful type does NOT exist it returns false",
            oStatefulApplicationContainer: { "XZY-TYPE": null },
            output: { expected: false },
            input: { sApplicationType: "XZY-TYPE" }
        }, {
            description: "When an application type is marked as stateful, AND a container for the stateful type does exist it returns true",
            oStatefulApplicationContainer: { "XZY-TYPE": {} },
            output: { expected: true },
            input: { sApplicationType: "XZY-TYPE" }
        }, {
            description: "When an application type is NOT marked as stateful it returns false",
            oStatefulApplicationContainer: {},
            output: { expected: false },
            input: { sApplicationType: "XZY-TYPE" }
        }].forEach(function (oFixture) {
            // Arrange
            AppLifeCycle.setStatefulApplicationContainer(oFixture.oStatefulApplicationContainer);

            // Act & Assert
            assert.equal(
                AppLifeCycle.statefulContainerForTypeExists(oFixture.input.sApplicationType),
                oFixture.output.expected,
                oFixture.description
            );
        });
    });

    [{
        description: "GUI stateful container is configured",
        oConfiguration: { GUI: true },
        expectedConfiguration: { TR: null }
    }, {
        description: "GUI stateful container is not configured explicitly",
        oConfiguration: { GUI: false },
        expectedConfiguration: {}
    }, {
        description: "WDA stateful container is configured",
        oConfiguration: { WDA: true },
        expectedConfiguration: {} // we do not allow other application types
    }, {
        description: "TR stateful container is configured",
        oConfiguration: { TR: true },
        expectedConfiguration: {} // we do not allow TR, correct option is GUI
    }].forEach(function (oFixture) {
        QUnit.test("#_parseStatefulContainerConfiguration", function (assert) {
            var oParsedConfiguration;

            AppLifeCycle.parseStatefulContainerConfiguration(oFixture.oConfiguration);
            oParsedConfiguration = AppLifeCycle.getStatefulApplicationContainer();
            assert.deepEqual(oParsedConfiguration, oFixture.expectedConfiguration, "the configuration is parsed as expected");
        });
    });

    QUnit.test("test handleNavMenuTitleVisibility", function (assert) {
        var done = assert.async(),
            oTestMediaRange = { name: "Phone" },
            oDeviceMediaStub = sinon.stub(sap.ui.Device.media, "getCurrentRange").returns(oTestMediaRange),
            isShowNavMenuTitle,
            orientationOrig = sap.ui.Device.orientation;

        oController.oExtensionShellStates = {};

        AppLifeCycle.init("home", oController.oViewPortContainer, "shell-home", false, { ownerComponent: "test" });

        var fnWaitConfigChange = waitConfigChange.bind(null, "/core/shellHeader");

        fnWaitConfigChange()
            .then(function () {
                AppLifeCycle.switchViewState("home");
            })
            .then(fnWaitConfigChange)
            .then(function () {
                oController.handleNavMenuTitleVisibility(oTestMediaRange);
            })
            .then(fnWaitConfigChange)
            .then(function () {
                isShowNavMenuTitle = Config.last("/core/shellHeader/application").showNavMenuTitle;
                assert.ok(isShowNavMenuTitle, "Verify Navigation Menu Title exist on phone");
            })
            .then(function () {
                oTestMediaRange.name = "Tablet";
                sap.ui.Device.orientation = { landscape: false, portrait: true };
                oController.handleNavMenuTitleVisibility(oTestMediaRange);
            })
            .then(fnWaitConfigChange)
            .then(function () {
                isShowNavMenuTitle = Config.last("/core/shellHeader/application").showNavMenuTitle;
                assert.ok(isShowNavMenuTitle, "Verify Navigation Menu Title does exist on tablet in portrait mode");
            })
            .then(function () {
                oTestMediaRange.name = "Desktop";
                sap.ui.Device.orientation = { landscape: true, portrait: false };
                oController.handleNavMenuTitleVisibility(oTestMediaRange);
            })
            .then(fnWaitConfigChange)
            .then(function () {
                isShowNavMenuTitle = Config.last("/core/shellHeader/application").showNavMenuTitle;
                assert.ok(!isShowNavMenuTitle, "Verify Navigation Menu Title does not exist on tablet in landscape mode or desktop");
                oDeviceMediaStub.restore();
                sap.ui.Device.orientation = orientationOrig;
                done();
            });
    });

    QUnit.test("test fixShellHash", function (assert) {
        var done = assert.async(),
            oRenderer = sap.ushell.Container.createRenderer("fiori2");
        EventHub.once("RendererLoaded").do(function () {
            var hash = oController.fixShellHash("");
            assert.strictEqual(hash, "#", "Test fix empty has");
            hash = oController.fixShellHash("test");
            assert.strictEqual(hash, "#test", "Test adding # prefix");
            hash = oController.fixShellHash("#");
            assert.strictEqual(hash, "#", "Test hash equal #");
            hash = oController.fixShellHash("#test");
            assert.strictEqual(hash, "#test", "Test no fix required");
            oRenderer.destroy();
            done();
        });
    });

    // QUnit.test("test togglePane", function (assert) {
    //     assert.expect(0);
    //     var done = assert.async();
    //     var oRenderer = sap.ushell.Container.createRenderer("fiori2");
    //     EventHub.once("RendererLoaded").do(function () {
    //         oRenderer.destroy();
    //         done();
    //     });
    // });

    /**
     * Test the behavior of doHashChange with cold start promise.
     */
    [{
        testDescription: "sap-ushell-async-libs-promise-directstart does not exist",
        bDirectStartPromiseLoadsComponent: false,
        bInjectPromiseInWindow: false,
        bIsUi5Target: true,
        expectedResolveHashFragmentCalls: 1,
        expectedResolvedHashFragment: { url: "/from/service", ui5ComponentName: "fake.ui5.component" },
        expectedLoadComponentCalls: 1
    }, {
        testDescription: "sap-ushell-async-libs-promise-directstart exists with ui5 target direct started",
        bDirectStartPromiseLoadsComponent: true, // ui5 component loaded early
        bInjectPromiseInWindow: true,
        bIsUi5Target: true,
        expectedResolveHashFragmentCalls: 0,
        expectedResolvedHashFragment: {
            url: "/from/promise",
            ui5ComponentName: "fake.ui5.component",
            componentHandle: { "fake": "componentHandle" }
        },
        expectedLoadComponentCalls: 0
    }, {
        testDescription: "sap-ushell-async-libs-promise-directstart exists with non-ui5 target direct started",
        bDirectStartPromiseLoadsComponent: false, // non-ui5 target
        bInjectPromiseInWindow: true,
        bIsUi5Target: false,
        expectedResolveHashFragmentCalls: 0,
        expectedResolvedHashFragment: { url: "/from/promise" }, // takes resolved hash fragment from promise
        expectedLoadComponentCalls: 0 // Ui5ComponentLoader is NOT called for non-ui5 targets (would ignore it,
        // but we avoid stopping the current app's router in that case
    }].forEach(function (oFixture) {
        QUnit.test("doHashChange loads application component correctly when " + oFixture.testDescription, function (assert) {
            var done = assert.async(),
                oNTRSResolveHashFragmentStub = sinon.stub(),
                isAppInCacheStub,
                oCreateComponentPromise = new jQuery.Deferred().resolve(oFixture.expectedResolvedHashFragment).promise(),
                fnCreateComponentStub = sinon.stub().returns(oCreateComponentPromise),
                oResolvedHashFragment = {};

            if (oFixture.bIsUi5Target) {
                oResolvedHashFragment.ui5ComponentName = "fake.ui5.component";
            }

            // if component is loaded, the resolved hash fragment contains a componentHandle property
            if (oFixture.bDirectStartPromiseLoadsComponent) {
                oResolvedHashFragment.componentHandle = { fake: "componentHandle" };
                isAppInCacheStub = sinon.stub(AppLifeCycle, "isAppInCache").returns(true);
            }

            oController._loadCoreExt = sinon.spy();
            oController.history = sinon.spy();

            // Expose _resolveHashFragment promise to trigger the tests
            var fnOriginalResolveHashFragment = oController._resolveHashFragment,
                oResolveHashFragmentPromise;

            oController._resolveHashFragment = function () {
                oResolveHashFragmentPromise = fnOriginalResolveHashFragment.apply(oController, arguments);
                return oResolveHashFragmentPromise;
            };

            sinon.stub(sap.ushell.Container, "getService");
            sap.ushell.Container.getService.withArgs("NavTargetResolution").returns({
                resolveHashFragment: oNTRSResolveHashFragmentStub.returns(
                    new jQuery.Deferred()
                        .resolve(jQuery.extend({ url: "/from/service" }, oResolvedHashFragment))
                        .promise()
                )
            });
            sap.ushell.Container.getService.withArgs("URLParsing").returns({ parseShellHash: sinon.stub() });
            sap.ushell.Container.getService.withArgs("Ui5ComponentLoader").returns({ createComponent: fnCreateComponentStub });

            oController.history.hashChange = sinon.spy();
            oController.history.getHistoryLength = sinon.stub().returns(0);
            oController.navigate = sinon.spy();
            oController.oCoreExtLoadingDeferred = new jQuery.Deferred().resolve();

            // simulate direct start promise in window
            var oOriginalDirectStartPromise = window["sap-ushell-async-libs-promise-directstart"];
            if (oFixture.bInjectPromiseInWindow) {
                window["sap-ushell-async-libs-promise-directstart"] = new Promise(function (resolve) {
                    resolve({ resolvedHashFragment: jQuery.extend({ url: "/from/promise" }, oResolvedHashFragment) });
                });
            } else {
                window["sap-ushell-async-libs-promise-directstart"] = undefined;
            }

            oController._initiateApplication = function () {
                if (isAppInCacheStub) {
                    isAppInCacheStub.restore();
                }
                assert.strictEqual(fnCreateComponentStub.getCalls().length,
                    oFixture.expectedLoadComponentCalls,
                    "Ui5ComponentLoader.loadComponent was called " + oFixture.expectedLoadComponentCalls + " times");
                restore();
            };

            function restore() {
                oController._resolveHashFragment = fnOriginalResolveHashFragment;
                if (sap.ushell.Container.getService.restore) {
                    sap.ushell.Container.getService.restore();
                    window["sap-ushell-async-libs-promise-directstart"] = oOriginalDirectStartPromise;
                    done();
                }
            }

            oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);

            oResolveHashFragmentPromise // promise from _resolveHashFragment not resolveHashFragment
                .fail(function () {
                    assert.ok(false, "_resolveHashFragment promise was resolved");
                })
                .done(function (oGotResolvedHashFragment) {
                    assert.ok(true, "_resolveHashFragment promise was resolved");

                    var iGotCalls = oNTRSResolveHashFragmentStub.getCalls().length;

                    assert.strictEqual(iGotCalls, oFixture.expectedResolveHashFragmentCalls,
                        "NavTargetResolution#resolveHashFragment method was called " + oFixture.expectedResolveHashFragmentCalls + " times");

                    assert.deepEqual(oGotResolvedHashFragment, oFixture.expectedResolvedHashFragment,
                        "_resolveHashFragment resolved to the expected hash fragment");
                })
                .always(function () {
                    if (!oFixture.bDirectStartPromiseLoadsComponent && oFixture.bIsUi5Target) {
                        assert.strictEqual(
                            sap.ushell.services.AppConfiguration.setCurrentApplication.callCount,
                            1,
                            "setCurrentApplication was called"
                        );
                    }
                    if (oFixture.expectedLoadComponentCalls === 0) {
                        restore();
                    }
                });
        });
    });

    /**
     * Test the behavior of doHashChange with with different previous state.
     * Note that the new window is started without component creation and newWindow starting.
     */
    [{
        testDescription: "align to newWindow : start direct",
        bDirectStartPromiseLoadsComponent: false,
        bInjectPromiseInWindow: false,
        bIsUi5Target: true,
        alignedNavigationMode: "newWindow",
        expectedResolveHashFragmentCalls: 1,
        expectedOpenAppInNewWindowCalls: 1,
        expectedResolvedHashFragment: {
            url: "/from/service",
            sFixedShellHash: "#hash",
            ui5ComponentName: "fake.ui5.component",
            navigationMode: "newWindow"
        },
        expectedLoadComponentCalls: 0,
        applicationIsStatefulTypeCallCount: 0,
        getControlCallCount: 0,
        removeCenterViewPortCallCount: 0,
        expectedRemoteStart: true
    }, {
        testDescription: "align to embedded, start direct",
        bDirectStartPromiseLoadsComponent: false,
        bInjectPromiseInWindow: false,
        bIsUi5Target: true,
        alignedNavigationMode: "embedded",
        expectedResolveHashFragmentCalls: 1,
        expectedOpenAppInNewWindowCalls: 0,
        expectedResolvedHashFragment: { url: "/from/service", ui5ComponentName: "fake.ui5.component", navigationMode: "embedded" },
        expectedLoadComponentCalls: 1,
        applicationIsStatefulTypeCallCount: 1,
        getControlCallCount: 1,
        removeCenterViewPortCallCount: 1,
        expectedRemoteStart: true
    }].forEach(function (oFixture) {
        QUnit.test("doHashChange loads application component correctly when " + oFixture.testDescription, function (assert) {
            var done = assert.async();

            // Hash change is enabled at the beginning of this test
            oController._setEnableHashChange(true);

            var oTargetViewPortControl, oViewPortContainer,
                oNTRSResolveHashFragmentStub = sinon.stub(),
                oCreateComponentPromise = new jQuery.Deferred().resolve(oFixture.expectedResolvedHashFragment).promise(),
                fnCreateComponentStub = sinon.stub().returns(oCreateComponentPromise),
                oResolvedHashFragment = {};

            if (oFixture.bIsUi5Target) {
                oResolvedHashFragment.ui5ComponentName = "fake.ui5.component";
            }

            // if component is loaded, the resolved hash fragment contains a componentHandle property
            if (oFixture.bDirectStartPromiseLoadsComponent) {
                oResolvedHashFragment.componentHandle = { fake: "componentHandle" };
            }

            oController._loadCoreExt = sinon.spy();
            oController.history = sinon.spy();

            oViewPortContainer = { removeCenterViewPort: sinon.spy() };

            AppLifeCycle.init("home", oViewPortContainer, "shell-home", false, { ownerComponent: "test" });
            oTargetViewPortControl = {
                getId: sinon.stub().returns("app-id"),
                destroy: sinon.spy()
            };
            oController.oViewPortContainer = oViewPortContainer;
            AppLifeCycle.applicationIsStatefulType = sinon.spy();
            var getControlStub = sinon.stub(AppLifeCycle, "getControl").returns(oTargetViewPortControl);

            oController._calculateNavigationMode = function (a, oResolutionResult) {
                oResolutionResult.navigationMode = oFixture.alignedNavigationMode;
                return oResolutionResult;
            };
            // Expose _resolveHashFragment promise to trigger the tests
            var fnOriginalResolveHashFragment = oController._resolveHashFragment,
                oResolveHashFragmentDeferred = new jQuery.Deferred(),
                oResolveHashFragmentPromise = oResolveHashFragmentDeferred.promise();

            oController._resolveHashFragment = function () {
                var oPromise = fnOriginalResolveHashFragment.apply(oController, arguments);

                oPromise
                    .done(oResolveHashFragmentDeferred.resolve.bind(oResolveHashFragmentDeferred))
                    .fail(oResolveHashFragmentDeferred.reject.bind(oResolveHashFragmentDeferred));

                return oPromise;
            };

            var openAppInNewWindowAndRestore = sinon.stub(oController, "_openAppInNewWindowAndRestore");
            sinon.stub(sap.ushell.Container, "getService");
            sap.ushell.Container.getService.withArgs("NavTargetResolution").returns({
                resolveHashFragment: oNTRSResolveHashFragmentStub.returns(
                    new jQuery.Deferred().resolve(jQuery.extend({ url: "/from/service" }, oResolvedHashFragment)).promise()
                )
            });
            sap.ushell.Container.getService.withArgs("URLParsing").returns({ parseShellHash: sinon.stub() });
            sap.ushell.Container.getService.withArgs("Ui5ComponentLoader").returns({ createComponent: fnCreateComponentStub });

            oController.history.hashChange = sinon.spy();
            oController.history.getHistoryLength = sinon.stub().returns(0);
            oController.navigate = sinon.spy();
            oController.oCoreExtLoadingDeferred = new jQuery.Deferred().resolve();

            // Final checks and restore the state
            function finish() {
                assert.strictEqual(fnCreateComponentStub.getCalls().length, oFixture.expectedLoadComponentCalls,
                    "Ui5ComponentLoader.loadComponent was called " + oFixture.expectedLoadComponentCalls + " times");

                assert.strictEqual(openAppInNewWindowAndRestore.getCalls().length, oFixture.expectedOpenAppInNewWindowCalls,
                    "_openAppInNewWindowAndRestore was called " + oFixture.expectedOpenAppInNewWindowCalls + " times");

                oController._resolveHashFragment = fnOriginalResolveHashFragment;
                oController._initiateApplication = fnInitiateApplication;
                sap.ushell.Container.getService.restore();
                window["sap-ushell-async-libs-promise-directstart"] = oOriginalDirectStartPromise;
                done();
            }

            var fnInitiateApplication = oController._initiateApplication;
            oController._initiateApplication = finish;

            // simulate direct start promise in window
            var oOriginalDirectStartPromise = window["sap-ushell-async-libs-promise-directstart"];
            if (oFixture.bInjectPromiseInWindow) {
                window["sap-ushell-async-libs-promise-directstart"] = new Promise(function (resolve) {
                    resolve({ resolvedHashFragment: jQuery.extend({ url: "/from/promise" }, oResolvedHashFragment) });
                });
            } else {
                window["sap-ushell-async-libs-promise-directstart"] = undefined;
            }

            oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);

            oResolveHashFragmentPromise // promise from _resolveHashFragment not resolveHashFragment
                .fail(function () {
                    assert.ok(false, "_resolveHashFragment promise was resolved");
                })
                .done(function (oGotResolvedHashFragment) {
                    assert.ok(true, "_resolveHashFragment promise was resolved");

                    var iGotCalls = oNTRSResolveHashFragmentStub.getCalls().length;

                    assert.strictEqual(iGotCalls, oFixture.expectedResolveHashFragmentCalls,
                        "NavTargetResolution#resolveHashFragment method was called " + oFixture.expectedResolveHashFragmentCalls + " times");

                    assert.deepEqual(oGotResolvedHashFragment, oFixture.expectedResolvedHashFragment,
                        "_resolveHashFragment resolved to the expected hash fragment");

                    getControlStub.restore();
                })
                .always(function () {
                    assert.strictEqual(sap.ushell.services.AppConfiguration.setCurrentApplication.callCount, 1,
                        "setCurrentApplication was called");
                    if (oFixture.expectedLoadComponentCalls === 0) {
                        finish();
                    }
                });
        });
    });

    /**
     * Test the behavior of _calculateNavigationMode with with different previous state
     * Note that the new window is started without component creation and newWindow starting
     */
    [{
        testDescription: "native navigation",
        sUi5HistoryDirection: Ui5HistoryDirection.Unknown,
        isNative: true,
        oParsedShellHash: {},
        isColdStart: false,
        sCurrentLocationHash: "#AA-bb?def=jjj",
        oResolutionResult: { url: "/from/service", ui5ComponentName: "fake.ui5.component", navigationMode: "newWindowThenEmbedded" },
        expectedResolvedHashFragment: { url: "/from/service", ui5ComponentName: "fake.ui5.component", navigationMode: "newWindow" }
    }, {
        testDescription: "non-native navigation coldstart",
        sUi5HistoryDirection: Ui5HistoryDirection.Unknown,
        isNative: true,
        oParsedShellHash: {},
        isColdStart: true,
        sCurrentLocationHash: "#AA-bb?def=jjj",
        oResolutionResult: { url: "/from/service", ui5ComponentName: "fake.ui5.component", navigationMode: "newWindowThenEmbedded" },
        expectedResolvedHashFragment: { url: "/from/service", ui5ComponentName: "fake.ui5.component", navigationMode: "embedded" }
    }, {
        testDescription: "non-native navigation with inner-app route",
        sUi5HistoryDirection: Ui5HistoryDirection.Unknown,
        isNative: false,
        isColdStart: false,
        oParsedShellHash: {},
        sCurrentLocationHash: "#AA-bb?def=jjj&some/inner/app%20route",
        oResolutionResult: { url: "/from/service", ui5ComponentName: "fake.ui5.component", navigationMode: "newWindowThenEmbedded" },
        expectedResolvedHashFragment: { url: "#AA-bb?def=jjj&some/inner/app%20route", ui5ComponentName: "fake.ui5.component", navigationMode: "newWindow" }
    }, {
        testDescription: "undefined",
        sUi5HistoryDirection: Ui5HistoryDirection.Unknown,
        isNative: false,
        isColdStart: false,
        oParsedShellHash: {},
        sCurrentLocationHash: "#AA-bb?def=jjj",
        oResolutionResult: undefined,
        expectedResolvedHashFragment: undefined
    }, {
        testDescription: "back navigation",
        sUi5HistoryDirection: Ui5HistoryDirection.Backwards,
        isNative: false,
        isColdStart: false,
        oParsedShellHash: {},
        sCurrentLocationHash: "#AA-bb?def=jjj",
        oResolutionResult: {
            url: "/from/service",
            ui5ComponentName: "fake.ui5.component",
            navigationMode: "newWindowThenEmbedded"
        },
        expectedResolvedHashFragment: {
            "navigationMode": "embedded",
            "ui5ComponentName": "fake.ui5.component",
            "url": "/from/service"
        }
    }].forEach(function (oFixture) {
        QUnit.test("calculateNavigationMode when " + oFixture.testDescription, function (assert) {
            var oGetInstanceStub = sinon.stub(Ui5History, "getInstance").returns({
                getDirection: function () {
                    return oFixture.sUi5HistoryDirection;
                }
            });
            sinon.stub(sap.ushell.utils, "isNativeWebGuiNavigation").returns(oFixture.isNative);
            // no need to restore stubs on controller, because every test creates a new instance
            sinon.stub(oController, "_isColdStart").returns(oFixture.isColdStart);
            sinon.stub(oController, "_getCurrentLocationHash").returns(oFixture.sCurrentLocationHash);
            var res = oController._calculateNavigationMode(oFixture.oParsedShellHash, oFixture.oResolutionResult);
            assert.deepEqual(res, oFixture.expectedResolvedHashFragment, "correct result");
            oGetInstanceStub.restore();
        });
    });

    /**
     * Test the behavior of doHashChange with and without navResCtx
     */
    QUnit.test("test doHashChange and navResCtx", function (assert) {
        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        oController.history = sinon.spy();
        oController.history.hashChange = sinon.spy();
        oController.history.getHistoryLength = sinon.stub();
        oController.history.getHistoryLength.returns(0);
        oController.navigate = sinon.spy();
        oController.oCoreExtLoadingDeferred = new jQuery.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();
        var oResolvedHashFragmentResult = {
            additionalInformation: "additionalInformation",
            url: "url",
            applicationType: "applicationType",
            navigationMode: "navigationMode"
        };
        var oResolvedHashFragment2 = {
            additionalInformation: ["additionalInformation2"],
            url: ["url2"],
            applicationType: ["applicationType2"],
            navigationMode: ["navigationMode2"]
        };
        var dfdA = new jQuery.Deferred(),
            resolveHashFragmentStub;

        // Test doHashChange (by spying the calls to history.hashChange and navigate) without navResCtx

        // In this case (no navResCtx) we don't need function _resolveHashFragment to run,
        // we just need it to return a deferred.promise object that later will be resolved (hence, we use stub on _resolveHashFragment)
        resolveHashFragmentStub = sinon.stub(oController, "_resolveHashFragment");
        resolveHashFragmentStub.returns(dfdA.promise());

        oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);
        assert.strictEqual(oController.history.hashChange.callCount, 1, "No hash parsed yet (!navResCtx) and dfdA is resolved - Hash changed was called");
        assert.ok(oController.history.hashChange.args[0][0] === "#hash" && oController.history.hashChange.args[0][1] === "#oldHash", "history.hashChange was called with #hash and #oldHash");

        dfdA.resolve(oResolvedHashFragmentResult, { a: "aa" });
        dfdA.done(function () {
            assert.strictEqual(oController.navigate.callCount, 1, "navigate was called once");
            assert.strictEqual(oController.navigate.args[0][3].navigationMode, "navigationMode", "navigate was called with the correct navigationMode");
        });

        // Test doHashChange (by spying the calls to history.hashChange and navigate) with contextRaw = "navResCtx"

        // In this case (navResCtx exists) we need function _resolveHashFragment to run, and inside it - we need the function parseShellHash
        // of the service URLParsing to return contextRaw="navResCtx" and param object (hence, we don't use stub on _resolveHashFragment)
        oController._resolveHashFragment.restore();

        sinon.stub(sap.ushell.Container, "getService");
        sap.ushell.Container.getService.withArgs("URLParsing").returns({
            parseShellHash: function () {
                return {
                    semanticObject: undefined,
                    action: undefined,
                    contextRaw: "navResCtx",
                    params: oResolvedHashFragment2
                };
            }
        });
        sap.ushell.Container.getService.withArgs("Ui5ComponentLoader").returns({
            createComponent: sinon.stub().returns(new jQuery.Deferred().resolve({}).promise())
        });

        oController.doHashChange(sShellHashNavResCtx, sAppPart, sOldShellHash, sOldAppPart, null);
        assert.strictEqual(oController.navigate.callCount, 2, "Test hash parsed - navigate was called for the 2nd time");
        assert.strictEqual(oController.navigate.args[1][3].navigationMode, "navigationMode2", "navigate was called with the correct navigationMode");
    });

    /**
     * Test the behavior of doHashChange with and without navResCtx
     */
    QUnit.test("test doHashChange with trampolin app", function (assert) {
        var done = assert.async();
        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        oController.history = sinon.spy();
        oController.history.hashChange = sinon.spy();
        oController.history.getHistoryLength = sinon.stub();
        oController.history.pop = sinon.stub();
        oController.history.getHistoryLength.returns(0);
        oController.oCoreExtLoadingDeferred = new jQuery.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();
        var oResolvedHashFragmentResult = {
            additionalInformation: "additionalInformation",
            url: "url",
            applicationType: "UI5",
            navigationMode: "embedded"
        };

        sinon.stub(sap.ushell.Container, "getService");
        sap.ushell.Container.getService.withArgs("URLParsing").returns({
            parseShellHash: function () {
                return {
                    semanticObject: "Abc",
                    action: "def",
                    params: undefined
                };
            }
        });

        var oShellNavigationFake = { toExternal: sinon.spy() };
        sap.ushell.Container.getService.withArgs("ShellNavigation").returns(oShellNavigationFake);
        var oComponent = {
            navigationRedirect: function () { return new jQuery.Deferred().resolve("#RedirectMe-here").promise(); },
            destroy: function () { }
        };
        var oHandle = { getInstance: function () { return oComponent; } };
        sinon.spy(oController, "_usesNavigationRedirect");

        oResolvedHashFragmentResult.componentHandle = oHandle;
        oResolvedHashFragmentResult.navigationMode = "embedded";
        // act
        oController.navigate("Abc-def", "Abc-def", {}, oResolvedHashFragmentResult);

        assert.strictEqual(oController._usesNavigationRedirect.callCount, 1, "redirect test called");
        assert.strictEqual(oShellNavigationFake.toExternal.callCount, 1, "called ");
        assert.deepEqual(oShellNavigationFake.toExternal.args[0][0], { target: { shellHash: "#RedirectMe-here" } }, " toExternal called with args");
        assert.strictEqual(oShellNavigationFake.toExternal.args[0][1], undefined, " toExternal called with args");
        assert.strictEqual(oShellNavigationFake.toExternal.args[0][2], false, "toExternal called with args");
        assert.strictEqual(oController.history.pop.callCount, 1, "history pop was called once");

        done();
    });

    QUnit.test("_resolveHashFragment: forces the root intent to 'embedded' navigationMode", function (assert) {
        var done = assert.async();
        sinon.stub(oController, "_getConfig").returns({ rootIntent: "Root-intent" });

        var oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
        oGetServiceStub
            .withArgs("NavTargetResolution").returns({ // a fake service
                resolveHashFragment: sinon.stub().returns(
                    new jQuery.Deferred().resolve({ navigationMode: "newWindowThenEmbedded" }).promise()
                )
            })
            .withArgs("URLParsing").returns({ // a fake service
                parseShellHash: sinon.stub().returns({
                    semanticObject: "Root", // test against hardcoded value
                    action: "intent",
                    params: {}
                })
            });
        oGetServiceStub.throws("a service was requested in _resolveHashFragment other than URLParsing, NavTargetResolution." +
            " Please mock additional services in this test accordingly to fix");

        oController._resolveHashFragment("#Root-intent")
            .done(function (oResolvedHashFragment) {
                assert.ok(true, "promise was resolved");
                assert.strictEqual(oResolvedHashFragment.navigationMode, "embedded",
                    "promise was resolved to the expected navigation mode");
            })
            .fail(function () { assert.ok(false, "promise was resolved"); })
            .always(done);
    });

    QUnit.test("_resolveHashFragment: align navigation mode and navigate directly", function (assert) {
        var done = assert.async();
        sinon.stub(oController, "_getConfig").returns({ rootIntent: "Root-intent" });

        var oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
        oGetServiceStub
            .withArgs("NavTargetResolution").returns({ // a fake service
                resolveHashFragment: sinon.stub().returns(
                    new jQuery.Deferred().resolve({ navigationMode: "newWindowThenEmbedded" }).promise()
                )
            })
            .withArgs("URLParsing").returns({ // a fake service
                parseShellHash: sinon.stub().returns({
                    semanticObject: "Root", // test against hardcoded value
                    action: "intent",
                    params: {}
                })
            });
        oGetServiceStub.throws("a service was requested in _resolveHashFragment other than URLParsing, NavTargetResolution." +
            " Please mock additional services in this test accordingly to fix");
        sinon.stub(oController, "_calculateNavigationMode", function (oResolutionResult) {
            oResolutionResult.navigationMode = "newWindow";
        });
        var openAppInNewWindowAndRestore = sinon.stub(oController, "_openAppInNewWindowAndRestore");
        oController._resolveHashFragment("#Root-intent")
            .done(function (oResolvedHashFragment) {
                assert.ok(true, "promise was resolved");
                assert.strictEqual(oResolvedHashFragment.navigationMode, "embedded",
                    "promise was resolved to the expected navigation mode");
                assert.strictEqual(openAppInNewWindowAndRestore.called, false, "open in new app called");
            })
            .fail(function () { assert.ok(false, "promise was resolved"); })
            .always(done);
    });

    [{
        sNavigationMode: "newWindowThenEmbedded",
        expectedEpcmNavigationMode: 1
    }, {
        sNavigationMode: "embedded",
        expectedEpcmNavigationMode: 0
    }, {
        sNavigationMode: "newWindow",
        expectedEpcmNavigationMode: 1
    }, {
        sNavigationMode: "replace",
        expectedEpcmNavigationMode: 0
    }, {
        sNavigationMode: "unknown",
        expectedEpcmNavigationMode: 0 // default
    }].forEach(function (oFixture) {
        QUnit.test("_openAppInNewWindowAndRestore: call of epcm with navigaton mode: " + oFixture.sNavigationMode, function (assert) {
            // prepare mock stupbs
            sinon.stub(sap.ushell.utils, "isNativeWebGuiNavigation").returns(true);
            sinon.stub(sap.ushell.utils, "appendUserIdToUrl", function (dummy, sUrl) {
                return sUrl + "?" + dummy + "=1";
            });

            var oNavigate = sinon.stub();

            sinon.stub(sap.ushell.utils, "getPrivateEpcm").returns({
                doNavigate: oNavigate,
                getNwbcFeatureBits: function () { return 4; }
            });

            var oNavTargetResolutionResolvedHash = {
                additionalInformation: "additionalInformation",
                url: "url",
                applicationType: "applicationType",
                navigationMode: oFixture.sNavigationMode
            };

            // prepare measure stubs
            sinon.stub(oController.history, "pop");
            sinon.stub(oController, "_windowHistoryBack");
            sinon.stub(oController, "_openAppNewWindow");

            // test
            oController._openAppInNewWindowAndRestore(oNavTargetResolutionResolvedHash);

            assert.strictEqual(oNavigate.called, true, " openAppNewWindow called");
            assert.strictEqual(/url\?sap-user=1&sap-shell=FLP.*/.test(oNavigate.args[0][0]), true, "correct url");
            assert.strictEqual(oNavigate.args[0][1], oFixture.expectedEpcmNavigationMode, "correct navigation mode passed to EPCM");
            assert.strictEqual(oController._openAppNewWindow.called, false, "openAppNewWindow not called");
            assert.ok(oController.history.pop.called, "history pop called");
        });
    });

    QUnit.test("_openAppInNewWindowAndRestore: Test Fallback: utils.isNativeWebGuiNavigation: true || oResolvedHashFragment.nativeNWBCNavigation: true", function (assert) {
        // prepare mock stubs
        var oIsNativeWebGuiNavigationStub = sinon.stub(sap.ushell.utils, "isNativeWebGuiNavigation");
        oIsNativeWebGuiNavigationStub.returns(true);
        var oAppendUserIdToUrlStub = sinon.stub(sap.ushell.utils, "appendUserIdToUrl");
        var oAppendSapShellParamStub = sinon.stub(sap.ushell.utils, "appendSapShellParam");
        var oHasNavigationModeCapabilityStub = sinon.stub(sap.ushell.utils, "hasNavigationModeCapability");

        var oNavigate = sinon.stub();
        var oGetPrivateEpcmStub = sinon.stub(sap.ushell.utils, "getPrivateEpcm");
        oGetPrivateEpcmStub.returns({
            doNavigate: oNavigate
        });

        var oNavTargetResolutionResolvedHash = {
            navigationMode: "newWindowThenEmbedded",
            nativeNWBCNavigation: true
        };

        // prepare measure stubs
        var oPopStub = sinon.stub(oController.history, "pop");
        var oWindowHistoryBackStub = sinon.stub(oController, "_windowHistoryBack");
        var oOpenAppNewWindowStub = sinon.stub(oController, "_openAppNewWindow");

        // test
        oController._openAppInNewWindowAndRestore(oNavTargetResolutionResolvedHash);

        assert.strictEqual(oAppendUserIdToUrlStub.called, true, "appendUserIdToUrl was correctly called");
        assert.strictEqual(oOpenAppNewWindowStub.called, false, "private openAppNewWindow was correctly called");

        //cleanup
        oIsNativeWebGuiNavigationStub.restore();
        oAppendUserIdToUrlStub.restore();
        oAppendSapShellParamStub.restore();
        oHasNavigationModeCapabilityStub.restore();
        oGetPrivateEpcmStub.restore();
        oPopStub.restore();
        oWindowHistoryBackStub.restore();
        oOpenAppNewWindowStub.restore();
    });

    QUnit.test("_openAppInNewWindowAndRestore: Test Fallback: utils.isNativeWebGuiNavigation: true || oResolvedHashFragment.nativeNWBCNavigation: false", function (assert) {
        // prepare mock stubs
        var oIsNativeWebGuiNavigationStub = sinon.stub(sap.ushell.utils, "isNativeWebGuiNavigation");
        oIsNativeWebGuiNavigationStub.returns(true);
        var oAppendUserIdToUrlStub = sinon.stub(sap.ushell.utils, "appendUserIdToUrl");
        var oAppendSapShellParamStub = sinon.stub(sap.ushell.utils, "appendSapShellParam");
        var oHasNavigationModeCapabilityStub = sinon.stub(sap.ushell.utils, "hasNavigationModeCapability");

        var oNavigate = sinon.stub();
        var oGetPrivateEpcmStub = sinon.stub(sap.ushell.utils, "getPrivateEpcm");
        oGetPrivateEpcmStub.returns({
            doNavigate: oNavigate
        });

        var oNavTargetResolutionResolvedHash = {
            navigationMode: "newWindowThenEmbedded",
            nativeNWBCNavigation: false
        };

        // prepare measure stubs
        var oPopStub = sinon.stub(oController.history, "pop");
        var oWindowHistoryBackStub = sinon.stub(oController, "_windowHistoryBack");
        var oOpenAppNewWindowStub = sinon.stub(oController, "_openAppNewWindow");

        // test
        oController._openAppInNewWindowAndRestore(oNavTargetResolutionResolvedHash);

        assert.strictEqual(oAppendUserIdToUrlStub.called, true, "appendUserIdToUrl was correctly called");
        assert.strictEqual(oOpenAppNewWindowStub.called, false, "private openAppNewWindow was correctly called");

        //cleanup
        oIsNativeWebGuiNavigationStub.restore();
        oAppendUserIdToUrlStub.restore();
        oAppendSapShellParamStub.restore();
        oHasNavigationModeCapabilityStub.restore();
        oGetPrivateEpcmStub.restore();
        oPopStub.restore();
        oWindowHistoryBackStub.restore();
        oOpenAppNewWindowStub.restore();
    });

    QUnit.test("_openAppInNewWindowAndRestore: Test Fallback: utils.isNativeWebGuiNavigation: false || oResolvedHashFragment.nativeNWBCNavigation: true", function (assert) {
        // prepare mock stubs
        var oIsNativeWebGuiNavigationStub = sinon.stub(sap.ushell.utils, "isNativeWebGuiNavigation");
        oIsNativeWebGuiNavigationStub.returns(false);
        var oAppendUserIdToUrlStub = sinon.stub(sap.ushell.utils, "appendUserIdToUrl");
        var oAppendSapShellParamStub = sinon.stub(sap.ushell.utils, "appendSapShellParam");
        var oHasNavigationModeCapabilityStub = sinon.stub(sap.ushell.utils, "hasNavigationModeCapability");

        var oNavigate = sinon.stub();
        var oGetPrivateEpcmStub = sinon.stub(sap.ushell.utils, "getPrivateEpcm");
        oGetPrivateEpcmStub.returns({
            doNavigate: oNavigate
        });

        var oNavTargetResolutionResolvedHash = {
            navigationMode: "newWindowThenEmbedded",
            nativeNWBCNavigation: true
        };

        // prepare measure stubs
        var oPopStub = sinon.stub(oController.history, "pop");
        var oWindowHistoryBackStub = sinon.stub(oController, "_windowHistoryBack");
        var oOpenAppNewWindowStub = sinon.stub(oController, "_openAppNewWindow");

        // test
        oController._openAppInNewWindowAndRestore(oNavTargetResolutionResolvedHash);

        assert.strictEqual(oAppendUserIdToUrlStub.called, true, "appendUserIdToUrl was correctly called");
        assert.strictEqual(oOpenAppNewWindowStub.called, false, "private openAppNewWindow was correctly called");

        //cleanup
        oIsNativeWebGuiNavigationStub.restore();
        oAppendUserIdToUrlStub.restore();
        oAppendSapShellParamStub.restore();
        oHasNavigationModeCapabilityStub.restore();
        oGetPrivateEpcmStub.restore();
        oPopStub.restore();
        oWindowHistoryBackStub.restore();
        oOpenAppNewWindowStub.restore();
    });

    QUnit.test("_openAppInNewWindowAndRestore: Test Fallback: utils.isNativeWebGuiNavigation: false || oResolvedHashFragment.nativeNWBCNavigation: false", function (assert) {
        // prepare mock stubs
        var oIsNativeWebGuiNavigationStub = sinon.stub(sap.ushell.utils, "isNativeWebGuiNavigation");
        oIsNativeWebGuiNavigationStub.returns(false);
        var oAppendUserIdToUrlStub = sinon.stub(sap.ushell.utils, "appendUserIdToUrl");
        var oAppendSapShellParamStub = sinon.stub(sap.ushell.utils, "appendSapShellParam");
        var oHasNavigationModeCapabilityStub = sinon.stub(sap.ushell.utils, "hasNavigationModeCapability");

        var oNavigate = sinon.stub();
        var oGetPrivateEpcmStub = sinon.stub(sap.ushell.utils, "getPrivateEpcm");
        oGetPrivateEpcmStub.returns({
            doNavigate: oNavigate
        });

        var oNavTargetResolutionResolvedHash = {
            navigationMode: "newWindowThenEmbedded",
            nativeNWBCNavigation: false
        };

        // prepare measure stubs
        var oPopStub = sinon.stub(oController.history, "pop");
        var oWindowHistoryBackStub = sinon.stub(oController, "_windowHistoryBack");
        var oOpenAppNewWindowStub = sinon.stub(oController, "_openAppNewWindow");

        // test
        oController._openAppInNewWindowAndRestore(oNavTargetResolutionResolvedHash);

        assert.strictEqual(oAppendUserIdToUrlStub.called, false, "appendUserIdToUrl was correctly called");
        assert.strictEqual(oOpenAppNewWindowStub.called, true, "private openAppNewWindow was correctly called");

        //cleanup
        oIsNativeWebGuiNavigationStub.restore();
        oAppendUserIdToUrlStub.restore();
        oAppendSapShellParamStub.restore();
        oHasNavigationModeCapabilityStub.restore();
        oGetPrivateEpcmStub.restore();
        oPopStub.restore();
        oWindowHistoryBackStub.restore();
        oOpenAppNewWindowStub.restore();
    });

    QUnit.test("Test fallback to Shell-home if history exist & previous url is not valid navigation", function (assert) {
        var reportErrorStub = sinon.stub(oController, "reportError"),
            getUriParametersStub = sinon.stub(UriParameters.prototype, "get").returns({
                get: function (/*str*/) { return true; }
            }),
            setHashStub = sinon.stub(hasher, "setHash");

        oController.hashChangeFailure(1, null, null, null);
        assert.strictEqual(setHashStub.callCount, 1, "Attached navigateBack function is used");

        reportErrorStub.restore();
        getUriParametersStub.restore();
        setHashStub.restore();
    });

    [{
        testDescription: "message is an object",
        vMessage: {
            title: "the title",
            message: "the message (translated)",
            technicalMessage: "the technical message (in english)"
        },
        vErrorDetails: "error details (translated)",
        expectedCallCount: 1,
        expectedCallArgs: [
            sap.ushell.services.Message.Type.ERROR,
            "the message (translated)",
            {
                title: "the title",
                details: "error details (translated)"
            }
        ]
    }, {
        testDescription: "message is an object and details is an object",
        vMessage: {
            title: "the title",
            message: "the message (translated)",
            technicalMessage: "the technical message (in english)"
        },
        vErrorDetails: {
            info: "error details (translated)",
            technicalMessage: "important debugging stuff"
        },
        expectedCallCount: 1,
        expectedCallArgs: [
            sap.ushell.services.Message.Type.ERROR,
            "the message (translated)",
            {
                title: "the title",
                details: {
                    info: "error details (translated)",
                    technicalMessage: "important debugging stuff"
                }
            }
        ]
    }, {
        testDescription: "message is not an object",
        vMessage: "error message",
        vErrorDetails: "error details",
        expectedCallCount: 0
    }].forEach(function (oFixture) {
        QUnit.test("hashChangeFailure calls #show method as expected when " + oFixture.testDescription, function (assert) {
            // Arrange
            var iSomeHistoryLenght = 0,
                sSomeComponent = "some.component",
                bEnableHashChange = false,
                oStubSetHash = sinon.stub(window.hasher, "setHash"),
                oMessageServiceShowStub = sinon.stub(),
                oGetServiceStub = sinon.stub(sap.ushell.Container, "getService"),
                oFakeMessageService = { show: oMessageServiceShowStub };

            oGetServiceStub.withArgs("Message").returns(oFakeMessageService);

            // Act
            oController.hashChangeFailure(iSomeHistoryLenght, oFixture.vMessage, oFixture.vErrorDetails, sSomeComponent, bEnableHashChange);

            // Assert
            assert.strictEqual(oMessageServiceShowStub.callCount, oFixture.expectedCallCount, "Message service #show was called one time");
            if (oFixture.expectedCallArgs) {
                assert.deepEqual(
                    oMessageServiceShowStub.getCall(0).args,
                    oFixture.expectedCallArgs,
                    "the #show method was called with the expected arguments"
                );
            }

            oStubSetHash.restore();
            oGetServiceStub.restore();
        });
    });

    /**
     * Test the behaviour of doHashChange with parseError or resolveHashFragment failure.
     */
    QUnit.test("test doHashChange failure flow", function (assert) {
        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        oController.history = sinon.spy();
        oController.history.hashChange = sinon.spy();
        oController.history.getHistoryLength = sinon.stub();
        oController.history.getHistoryLength.returns(0);
        oController.navigate = sinon.spy();
        oController.oCoreExtLoadingDeferred = new jQuery.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();
        oController._setEnableHashChange(true);

        var parseShellHashMock = sinon.stub(),
            resolveHashFragmentStub = sinon.stub(oController, "_resolveHashFragment"),
            dfdA = new jQuery.Deferred(),
            dfdB = new jQuery.Deferred(),
            oParseError;

        sap.ushell.Container.getService = sinon.stub().returns({
            parseShellHash: parseShellHashMock,
            show: function () { }
        });

        sinon.spy(oController, "hashChangeFailure");

        oParseError = { message: "error" };
        oController.reportError = sinon.spy();

        // Test doHashChange with parseError and history = 0
        oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, oParseError);
        assert.strictEqual(oController.hashChangeFailure.callCount, 1, "Parse Error (with no history) - hashChangeFailure called");
        assert.strictEqual(hasher.getHash(), "", "Parse Error (with no history) - Hash set to empty string");

        // Test doHashChange with parseError and history > 0
        oController.history.getHistoryLength.returns(1);
        oController._windowHistoryBack = sinon.spy();
        oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, oParseError);
        assert.strictEqual(oController.hashChangeFailure.callCount, 2, "Parse Error (with history) - hashChangeFailure called for the 2nd time");
        assert.strictEqual(oController._windowHistoryBack.callCount, 1, "Parse Error (with history) - windowHistoryBack called once");

        // Test doHashChange when resolveHashFragment fails (no parse error, no navResCtx, history = 0)
        oController.history.getHistoryLength.returns(0);
        dfdA = new jQuery.Deferred();
        resolveHashFragmentStub.restore();
        resolveHashFragmentStub = sinon.stub(oController, "_resolveHashFragment");
        resolveHashFragmentStub.returns(dfdA.promise());

        oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);
        dfdA.reject();
        dfdA.fail(function () {
            assert.strictEqual(hasher.getHash(), "", "Test doHashChange with failure in resolveHashFragment. Without navResCtx and history = 0");
        });

        // Test doHashChange when resolveHashFragment fails (no parse error, no navResCtx, history > 0)
        oController.history.getHistoryLength.returns(1);

        resolveHashFragmentStub.restore();
        resolveHashFragmentStub = sinon.stub(oController, "_resolveHashFragment");
        resolveHashFragmentStub.returns(dfdB.promise());
        oController.doHashChange(sBasicShellHash, sAppPart, sOldShellHash, sOldAppPart, null);
        dfdB.reject();
        dfdB.fail(function () {
            assert.strictEqual(oController._windowHistoryBack.callCount, 2, "Test doHashChange with failure in resolveHashFragment. Without navResCtx, and history > 0");
        });
        resolveHashFragmentStub.restore();
    });

    QUnit.test("test NWBC navigation:  direct open new window with original intent", function (assert) {
        var done = assert.async(),
            sTargetUrl = "https://some.base.name.corp:12345/sap/bc/ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?sap-client=000&sap-language=EN&sap-ie=edge&sap-theme=sap_bluecrystal&sap-shell=FLP1.34.1-NWBC",
            oResolvedHashFragment = {
                applicationType: "NWBC",
                url: sTargetUrl,
                additionalInformation: "",
                navigationMode: "newWindowThenEmbedded",
                "sap-system": "U1Y_000"
            },
            oMetadata = {},
            oParsedShellHash = {
                semanticObject: "Action",
                action: "test",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: {} // note, no sap-system propagated in parameter
            },
            sFixedShellHash = "#Action-test?sap-system=U1Y_000",
            sCurrentLocationHash = sFixedShellHash,
            navSpy;

        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        sinon.stub(oController, "_openAppNewWindow").returns();
        sinon.stub(oController, "_windowHistoryBack").returns();
        sinon.stub(oController, "_changeWindowLocation").returns();
        sinon.stub(oController, "_handleEmbeddedNavMode").returns();
        sinon.stub(oController, "_getCurrentLocationHash").returns(sCurrentLocationHash);
        oController.oCoreExtLoadingDeferred = new jQuery.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=false.
        // The result should be one (new) call to navigate with navigationMode=newWindow
        sinon.stub(oController, "_isColdStart").returns(false);
        navSpy = sinon.spy(oController, "navigate");

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);

        assert.strictEqual(navSpy.callCount, 1, "Function navigate called twice");
        assert.strictEqual(oResolvedHashFragment.url, sCurrentLocationHash, "aligned url ok");
        assert.strictEqual(oResolvedHashFragment.navigationMode, "newWindow", "aligned Navigation mode ok");
        oController.navigate.restore();
        oController._isColdStart.restore();
        done();
    });

    QUnit.test("test WDA navigation fallback", function (assert) {
        var sVeryLongUrl = "https://some.base.name.corp:12345/sap/bc/ui2/nwbc/~canvas;window=app/wda/FAC_GL_ACCOUNT/?sap-client=500&sap-wd-configId=FAC_GL_ACCOUNT_AC&sap-ie=EDGE&WDUIGUIDELINE=FIORI&%2fERP%2fCATEGORY=ACT01&%2fERP%2fCHRTACCT=INT&%2fERP%2fCOMPCODE=0001&%2fERP%2fCO_AREA=0001&%2fERP%2fLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2fERP%2fP_0CURRENCY03=EUR&BSA_VARIABLE_%2fERP%2fP_0FISCVARNT01=K3&BSA_VARIABLE_%2fERP%2fP_0FISCYEAR01=2015&BSA_VARIABLE_%2fERP%2fP_CATEGORY=ACT01&BSA_VARIABLE_%2fERP%2fP_CHRTACCT01=INT&BSA_VARIABLE_%2fERP%2fP_CO_AREA01=0001&BSA_VARIABLE_%2fERP%2fP_LEDGER01=0L&BSA_VARIABLE_%2fERP%2fS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G&sap-language=EN&sap-client=902&sap-language=EN",
            oResolvedHashFragment = {
                applicationType: "NWBC",
                url: sVeryLongUrl,
                additionalInformation: "",
                navigationMode: "newWindowThenEmbedded"
            },
            oMetadata = {},
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: { "/ERP/CATEGORY": ["ACT01"] },
                semanticObject: "semanticObject"
            },
            sFixedShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G",
            sCurrentLocationHash = sFixedShellHash,
            navSpy;

        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        sinon.stub(oController, "_openAppNewWindow").returns();
        sinon.stub(oController, "_windowHistoryBack").returns();
        sinon.stub(oController, "_changeWindowLocation").returns();
        sinon.stub(oController, "_handleEmbeddedNavMode").returns();
        sinon.stub(oController, "_getCurrentLocationHash").returns(sCurrentLocationHash);
        oController.oCoreExtLoadingDeferred = new jQuery.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=false.
        // The result should be one (new) call to navigate with navigationMode=newWindow
        sinon.stub(oController, "_isColdStart").returns(false);
        navSpy = sinon.spy(oController, "navigate");
        // act
        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);

        assert.strictEqual(oResolvedHashFragment.url, sCurrentLocationHash, "target window hash ok");
        assert.strictEqual(oResolvedHashFragment.navigationMode, "newWindow");
        assert.strictEqual(navSpy.callCount, 1, "Function navigate called twice");
    });

    QUnit.test("navigate: ShellNavigation._bIsInitialNaivgation is set to false when navigation mode is embeded and is not cold start", function (assert) {
        var oResolvedHashFragment = {
            applicationType: "NWBC",
            additionalInformation: "",
            navigationMode: "embedded"
        };
        var oMetadata = {},
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: { "/ERP/CATEGORY": ["ACT01"] },
                semanticObject: "semanticObject"
            },
            sFixedShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G";

        sinon.stub(oController, "_isColdStart").returns(false);
        sinon.stub(oController, "_usesNavigationRedirect").returns({ then: function () { } });

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.ok(!oController.oShellNavigation.isInitialNavigation(), "ShellNavigation._bIsInitialNaivgation was set to false");
    });

    QUnit.test("navigate: ShellNavigation._bIsInitialNaivgation is set to false when history entry is not replaced", function (assert) {
        var oResolvedHashFragment = {
            applicationType: "NWBC",
            additionalInformation: "",
            navigationMode: "embedded"
        };
        var oMetadata = {},
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: { "/ERP/CATEGORY": ["ACT01"] },
                semanticObject: "semanticObject"
            },
            sFixedShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G";

        oController._wasHistoryEntryReplaced = false;
        sinon.stub(oController, "_usesNavigationRedirect").returns({
            then: function () { }
        });

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.ok(!oController.oShellNavigation.isInitialNavigation(), "ShellNavigation._bIsInitialNaivgation was set to false");
    });

    QUnit.test("navigate: ShellNavigation._bIsInitialNaivgation is set to false when navigation mode is replace", function (assert) {
        var oResolvedHashFragment = {
            applicationType: "NWBC",
            additionalInformation: "",
            navigationMode: "replace"
        };
        var oMetadata = {},
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: { "/ERP/CATEGORY": ["ACT01"] },
                semanticObject: "semanticObject"
            },
            sFixedShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G";

        sinon.stub(oController, "_isColdStart").returns(false);
        sinon.stub(oController, "_changeWindowLocation").returns();

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.ok(!oController.oShellNavigation.isInitialNavigation(), "ShellNavigation._bIsInitialNaivgation was not changed");
    });

    QUnit.test("navigate: ShellNavigation._bIsInitialNaivgation is not changed when navigation mode is newWindow", function (assert) {
        var oResolvedHashFragment = {
            applicationType: "NWBC",
            additionalInformation: "",
            navigationMode: "newWindow"
        };
        var oMetadata = {},
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: { "/ERP/CATEGORY": ["ACT01"] },
                semanticObject: "semanticObject"
            },
            bInitIsInitialNavigation = oController.oShellNavigation.isInitialNavigation(),
            sFixedShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G";

        sinon.stub(oController, "_isColdStart").returns(false);
        sinon.stub(oController, "_changeWindowLocation").returns();
        sinon.stub(oController, "_openAppInNewWindowAndRestore").returns();

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.equal(oController.oShellNavigation.isInitialNavigation(), bInitIsInitialNavigation, "ShellNavigation._bIsInitialNaivgation was not changed");
    });

    QUnit.test("navigate: ShellNavigation._bIsInitialNaivgation is not changed when navigation mode is null and is not cold start", function (assert) {
        var oResolvedHashFragment = {
            applicationType: "NWBC",
            additionalInformation: "",
            navigationMode: null
        };
        var oMetadata = {},
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: { "/ERP/CATEGORY": ["ACT01"] },
                semanticObject: "semanticObject"
            },
            sFixedShellHash = "#GLAccount-manage?%2FERP%2FCATEGORY=ACT01&%2FERP%2FCHRTACCT=INT&%2FERP%2FCOMPCODE=0001&%2FERP%2FCO_AREA=0001&%2FERP%2FLEDGER=0L&0CURRENCY=EUR&0FISCVARNT=K3&0FISCYEAR=K32015&0MANDT=500&BSA_VARIABLE_%2FERP%2FP_0CURRENCY03=EUR&BSA_VARIABLE_%2FERP%2FP_0FISCVARNT01=K3&BSA_VARIABLE_%2FERP%2FP_0FISCYEAR01=2015&BSA_VARIABLE_%2FERP%2FP_CATEGORY=ACT01&BSA_VARIABLE_%2FERP%2FP_CHRTACCT01=INT&BSA_VARIABLE_%2FERP%2FP_CO_AREA01=0001&BSA_VARIABLE_%2FERP%2FP_LEDGER01=0L&BSA_VARIABLE_%2FERP%2FS_COMPCODE01=0001&BSA_VARIABLE_0SYMANDT=500&ChartOfAccounts=INT&CompanyCode=0001&Currency=EUR&sap-xapp-state=ASTFFDW8OLVYUYO016MJRGDLFN2ZLC8I8RIJXZ5G",
            bInitIsInitialNavigation = oController.oShellNavigation.isInitialNavigation();

        sinon.stub(oController, "_isColdStart").returns(false);

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.equal(oController.oShellNavigation.isInitialNavigation(), bInitIsInitialNavigation, "ShellNavigation._bIsInitialNaivgation was not changed");
    });

    QUnit.test("_initiateApplication: ShellNavigation._bIsInitialNaivgation is changed to initial value when an error arises", function (assert) {
        var bInitIsInitialNavigation = oController.oShellNavigation.isInitialNavigation();

        sinon.stub(oController, "navigate").throws("Error");
        oController.oShellNavigation.isInitialNavigation(!bInitIsInitialNavigation);
        oController._initiateApplication();
        assert.equal(oController.oShellNavigation.isInitialNavigation(), bInitIsInitialNavigation, "ShellNavigation._bIsInitialNaivgation was restored");
    });

    QUnit.test("test _loadCoreExtNonUI5 navigation ", function (assert) {
        var loadExtSpy = sinon.spy(oController, "_loadCoreExt");

        oController._loadCoreExtNonUI5({ applicationType: "TR" });
        assert.strictEqual(loadExtSpy.called, true, "_loadCoreExt for TR application was called");
        loadExtSpy.restore();
    });

    QUnit.test("test not supported type navigation ", function (assert) {
        var loadExtSpy = sinon.spy(oController, "_loadCoreExt");

        oController._loadCoreExtNonUI5({ applicationType: "SAPUI5" });
        assert.strictEqual(loadExtSpy.called, false, "_loadCoreExt for UI5 application was not called");
        loadExtSpy.restore();
    });

    QUnit.test("test NWBC navigation ", function (assert) {
        var loadExtSpy = sinon.spy(oController, "_loadCoreExt");

        oController._loadCoreExtNonUI5({ applicationType: "NWBC" });
        assert.strictEqual(loadExtSpy.called, true, "_loadCoreExt for NWBC application was called");
        loadExtSpy.restore();
    });

    QUnit.test("test WDA navigation ", function (assert) {
        var done = assert.async(),
            sNotLongUrl = "https://some.base.name.corp:12345/sap/bc/ui2/nwbc/~canvas;window=app/wda/FAC_GL_ACCOUNT/?sap-client=500&sap-wd-configId=FAC_GL_ACCOUNT_AC&sap-ie=EDGE&WDUIGUIDELINE=FIORI&%2fERP%2fCATEGORY=ACT01&%2fERP%2fCHRTACCT=INT&sap-client=902&sap-language=EN",
            oResolvedHashFragment = {
                applicationType: "NWBC",
                url: sNotLongUrl,
                additionalInformation: "",
                navigationMode: "newWindowThenEmbedded"
            },
            oMetadata = {},
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: { "/ERP/CATEGORY": ["ACT01"] },
                semanticObject: "semanticObject"
            },
            sFixedShellHash = "#semanticObject-action?",
            sCurrentLocationHash = sFixedShellHash,
            navSpy;

        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        sinon.stub(oController, "_openAppNewWindow").returns();
        sinon.stub(oController, "_windowHistoryBack").returns();
        sinon.stub(oController, "_changeWindowLocation").returns();
        sinon.stub(oController, "_handleEmbeddedNavMode").returns();
        sinon.stub(oController, "_getCurrentLocationHash").returns(sCurrentLocationHash);
        oController.oCoreExtLoadingDeferred = new jQuery.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=true.
        // The result should be one (new) call to navigate with navigationMode=embedded
        sinon.stub(oController, "_isColdStart").returns(false);
        navSpy = sinon.spy(oController, "navigate");

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);

        assert.strictEqual(navSpy.callCount, 1, "Function navigate called twice");
        assert.strictEqual(oResolvedHashFragment.url, "#semanticObject-action?", "The URL was replaced");
        oController.navigate.restore();
        oController._isColdStart.restore();
        done();
    });

    /**
     * Test the correctness of navigation mode as it is changed in function navigate:
     *
     * navigation mode = newWindowThenEmbedded:
     *   If coldStart = true  => Call navigate once with "embedded";
     *   If coldStart = false => Call navigate once with "newWindow" for opening the app;
     *   If history.backwards => Call navigate once with "embedded".
     *
     * navigation mode = newWindow:
     *   If coldStart = true => call navigate once with "replace";
     *   If coldStart = false => call _openAppNewWindow and _windowHistoryBack.
     */
    QUnit.test("test navigate - navigationMode change", function (assert) {
        var oResolvedHashFragmentParam,
            oResolvedHashFragment = {
                applicationType: "NWBC",
                url: "http://www.sap.com/index.html",
                additionalInformation: "",
                navigationMode: "newWindowThenEmbedded"
            },
            oMetadata = {},
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: {},
                semanticObject: "semanticObject"
            },
            sFixedShellHash = "semanticObject-action",
            oOpenAppNewWindowStub,
            oWindowHistoryBackStub,
            oChangeWindowLocationStub,
            oHandleEmbeddedNavModeStub,
            oIsColdStartStub,
            navSpy,
            bOriginalBackwards;

        oController._loadCoreExt = sinon.spy();
        oController._requireCoreExt = sinon.spy();
        oOpenAppNewWindowStub = sinon.stub(oController, "_openAppNewWindow").returns();
        oWindowHistoryBackStub = sinon.stub(oController, "_windowHistoryBack").returns();
        oChangeWindowLocationStub = sinon.stub(oController, "_changeWindowLocation").returns();
        oHandleEmbeddedNavModeStub = sinon.stub(oController, "_handleEmbeddedNavMode").returns(Promise.resolve());
        oController.oCoreExtLoadingDeferred = new jQuery.Deferred();
        oController.oCoreExtLoadingDeferred.resolve();

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=true.
        // The result should be one (new) call to navigate with navigationMode=embedded
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(true);
        navSpy = sinon.spy(oController, "navigate");
        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.strictEqual(navSpy.callCount, 1, "Function navigate called twice");
        assert.strictEqual(oResolvedHashFragment.navigationMode, "embedded", "Navigate called with navigationMode=embedded");

        oController.navigate.restore();
        oController._isColdStart.restore();

        // Prepare for next test. Make sure history.backwards=false won't cause the next test to succeed.
        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(undefined);
        oController.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");

        oResolvedHashFragment = {
            applicationType: "NWBC",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded"
        };

        bOriginalBackwards = oController.history.backwards;
        oController.history.backwards = false; // NOTE
        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.strictEqual(navSpy.callCount, 1, "Navigate called twice");
        assert.notStrictEqual(oResolvedHashFragment.navigationMode, "embedded", "Navigate called with other navigationMode than embedded");

        oController.navigate.restore();
        oController._isColdStart.restore();
        oController.history.backwards = bOriginalBackwards;

        // Test the behaviour when navigationMode is newWindowThenEmbedded and history.backwards=true.
        // The result should be one (new) call to navigate with navigationMode=embedded
        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(undefined);
        oController.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");

        oResolvedHashFragment = {
            applicationType: "NWBC",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded"
        };

        // simulate newWindowThenEmbedded url once navigated to
        bOriginalBackwards = oController.history.backwards;
        oController.history.backwards = true;

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.strictEqual(navSpy.callCount, 1, "Navigate called twice");

        oController.navigate.restore();
        oController._isColdStart.restore();
        oController.history.backwards = bOriginalBackwards;

        // Test the behaviour when navigationMode is newWindowThenEmbedded and coldStart=false.
        // The result should be one (new) call to navigate with navigationMode=newWindow
        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(false);
        oController.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");

        oResolvedHashFragment = {
            applicationType: "NWBC",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindowThenEmbedded"
        };

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.strictEqual(navSpy.callCount, 1, "Navigate called twice");
        oResolvedHashFragmentParam = oResolvedHashFragment;
        assert.strictEqual(oResolvedHashFragmentParam.navigationMode, "newWindow", "Navigate called with navigationMode=newWindow");

        oController.navigate.restore();
        oController._isColdStart.restore();

        // Test the behaviour when navigationMode is newWindow and coldStart=true.
        // The result should be one (new) call to navigate with navigationMode=embedded
        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(true);

        oResolvedHashFragment = {
            applicationType: "XXX",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindow"
        };

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.strictEqual(navSpy.callCount, 1, "Navigate called twice");
        oResolvedHashFragmentParam = oResolvedHashFragment;
        assert.strictEqual(oResolvedHashFragmentParam.navigationMode, "replace", "Navigate called with navigationMode=replace");

        oController.navigate.restore();
        oController._isColdStart.restore();
        oController._windowHistoryBack.restore();
        oController._openAppNewWindow.restore();

        // Test the behaviour when navigationMode is newWindow and coldStart=false.
        // The result: _openAppNewWindow and _windowHistoryBack are called
        oController._windowHistoryBack = sinon.spy();
        oController._openAppNewWindow = sinon.spy();
        oController.history.pop = sinon.spy();

        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(false);

        // Arrange
        var oMockComponent = { destroy: sinon.stub() },
            oMockComponentHandle = { getInstance: function () { return oMockComponent; } };

        oResolvedHashFragment = {
            applicationType: "XXX",
            url: "http://www.sap.com/index.html",
            additionalInformation: "",
            navigationMode: "newWindow",
            componentHandle: oMockComponentHandle
        };

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.strictEqual(navSpy.callCount, 1, "navigate called once");
        assert.strictEqual(oController._openAppNewWindow.callCount, 1, "_openAppNewWindow called once");
        assert.strictEqual(oController._windowHistoryBack.callCount, 1, "_windowHistoryBack called once");
        assert.strictEqual(oController.history.pop.callCount, 1, "History pop is called once");

        oIsColdStartStub.restore();
        oController.navigate.restore();
        oOpenAppNewWindowStub.restore();
        oWindowHistoryBackStub.restore();
        oChangeWindowLocationStub.restore();
        oHandleEmbeddedNavModeStub.restore();

        // Test the behaviour when resolveHashFragment resolves to undefined (no coldstart case)
        oController._windowHistoryBack = sinon.spy();
        oController._openAppNewWindow = sinon.spy();
        oController.history.pop = sinon.spy();
        sinon.stub(window.hasher, "setHash");

        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(false);

        oResolvedHashFragment = undefined;

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.strictEqual(oMockComponent.destroy.callCount, 1, "destroy called");
        assert.strictEqual(navSpy.callCount, 1, "navigate called once");
        assert.strictEqual(oController._openAppNewWindow.callCount, 0, "_openAppNewWindow was not called");
        assert.strictEqual(oController._windowHistoryBack.callCount, 1, "_windowHistoryBack called once");
        assert.strictEqual(oController.history.pop.callCount, 1, "History pop is called once");
        assert.strictEqual(window.hasher.setHash.callCount, 0, "window.hasher.setHash was not called");

        oIsColdStartStub.restore();
        oController.navigate.restore();
        oOpenAppNewWindowStub.restore();
        oWindowHistoryBackStub.restore();
        oChangeWindowLocationStub.restore();
        oHandleEmbeddedNavModeStub.restore();
        window.hasher.setHash.restore();

        // Test the behaviour when resolveHashFragment resolves to undefined (coldstart case)
        oController._windowHistoryBack = sinon.spy();
        oController._openAppNewWindow = sinon.spy();
        oController.history.pop = sinon.spy();
        sinon.stub(window.hasher, "setHash");

        navSpy = sinon.spy(oController, "navigate");
        oIsColdStartStub = sinon.stub(oController, "_isColdStart").returns(true);

        oResolvedHashFragment = undefined;

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
        assert.strictEqual(navSpy.callCount, 1, "navigate called once");
        assert.strictEqual(oController._openAppNewWindow.callCount, 0, "_openAppNewWindow was not called");
        assert.strictEqual(oController._windowHistoryBack.callCount, 0, "_windowHistoryBack was not called");
        assert.strictEqual(oController.history.pop.callCount, 0, "History pop was not called");
        assert.strictEqual(window.hasher.setHash.callCount, 1, "window.hasher.setHash was called once");

        oIsColdStartStub.restore();
        oController.navigate.restore();
        oOpenAppNewWindowStub.restore();
        oWindowHistoryBackStub.restore();
        oChangeWindowLocationStub.restore();
        oHandleEmbeddedNavModeStub.restore();
        window.hasher.setHash.restore();
    });

    [{
        testDescription: "expanded url is opened in a new window",
        // input
        bIsColdStart: true, // NOTE: coldstart
        oParsedShellHash: {
            "semanticObject": "Action",
            "action": "toWdaProductDetails",
            "contextRaw": "navResCtx",
            "params": {
                "additionalInformation": [""],
                "applicationType": ["NWBC"],
                "navigationMode": ["newWindowThenEmbedded"],
                "original_intent": ["#Action-toWdaProductDetails?productId=HT-1010"],
                "productId": ["HT-1010"],
                "title": ["undefined"]
            }
        },
        oMetadata: {},
        oResolvedHashFragment: {
            additionalInformation: "",
            applicationType: "NWBC",
            navigationMode: "newWindowThenEmbedded",
            text: "undefined"
        },
        expectedCalledWith: { // undefined -> expect no call
            changeWindowLocation: undefined,
            windowHistoryBack: undefined,
            hasherReplaceHash: "#Action-toWdaProductDetails?productId=HT-1010"
        }
    }, {
        testDescription: "intent to external url is navigated from the same window",
        // input
        bIsColdStart: false,
        oParsedShellHash: {
            semanticObject: "Action",
            action: "toAbsoluteUrl",
            contextRaw: undefined,
            params: Object,
            appSpecificRoute: undefined
        },
        sFixedShellHash: "#Action-toAbsoluteUrl",
        oMetadata: {},
        oResolvedHashFragment: {
            applicationType: "URL",
            additionalInformation: "",
            text: "toAbsoluteUrl",
            navigationMode: "newWindow"
        },
        expectedCalledWith: { // undefined -> expect no call
            changeWindowLocation: undefined,
            windowHistoryBack: 1,
            hasherReplaceHash: undefined
        }
    }, {
        testDescription: "intent to external url is pasted in a new window",
        // input
        bIsColdStart: true, // NOTE: simulating coldstart
        oParsedShellHash: {
            semanticObject: "Action",
            action: "toAbsoluteUrl",
            contextRaw: undefined,
            params: Object,
            appSpecificRoute: undefined
        },
        sFixedShellHash: "#Action-toAbsoluteUrl",
        oMetadata: {},
        oResolvedHashFragment: {
            applicationType: "URL",
            additionalInformation: "",
            text: "toAbsoluteUrl",
            url: "http://test",
            navigationMode: "newWindow"
        },
        expectedCalledWith: { // undefined -> expect no call
            changeWindowLocation: "http://test",
            windowHistoryBack: undefined,
            hasherReplaceHash: undefined
        }
    }].forEach(function (oFixture) {
        QUnit.test("test navigate - restores url to correct hash after navigation occurs when " + oFixture.testDescription, function (assert) {
            var bCWLCall,
                bWHBCall,
                bHRHCall;

            sinon.stub(sap.ushell.utils, "isNativeWebGuiNavigation").returns(false);

            sinon.stub(oController, "_openAppNewWindow");
            sinon.stub(oController, "_windowHistoryBack");
            sinon.stub(oController, "hashChangeFailure");
            sinon.stub(oController, "_changeWindowLocation");
            sinon.stub(oController, "_handleEmbeddedNavMode").returns(Promise.resolve());
            sinon.stub(oController, "_isColdStart").returns(oFixture.bIsColdStart);
            sinon.stub(window.hasher, "replaceHash");

            sinon.spy(oController, "navigate");

            // Act
            oController.navigate(
                oFixture.oParsedShellHash,
                oFixture.sFixedShellHash,
                oFixture.oMetadata,
                oFixture.oResolvedHashFragment
            );

            // Assert
            assert.strictEqual(oController.hashChangeFailure.called, false, "hashChangeFailure was not called");

            bCWLCall = (typeof oFixture.expectedCalledWith.changeWindowLocation !== "undefined");
            assert.strictEqual(oController._changeWindowLocation.called, bCWLCall,
                "_changeWindowLocation was " + (bCWLCall ? "" : "not") + " called");

            if (bCWLCall) {
                assert.deepEqual(oController._changeWindowLocation.getCall(0).args[0],
                    oFixture.expectedCalledWith.changeWindowLocation,
                    "_changeWindowLocation was called with the expected parameter");
            }

            bWHBCall = (typeof oFixture.expectedCalledWith.windowHistoryBack !== "undefined");
            assert.strictEqual(oController._windowHistoryBack.called, bWHBCall,
                "_windowHistoryBack was " + (bWHBCall ? "" : "not") + " called");

            if (bWHBCall) {
                assert.deepEqual(oController._windowHistoryBack.getCall(0).args[0],
                    oFixture.expectedCalledWith.windowHistoryBack,
                    "_windowHistoryBack was called with the expected parameter");
            }

            bHRHCall = (typeof oFixture.expectedCalledWith.hasherReplaceHash !== "undefined");
            assert.strictEqual(window.hasher.replaceHash.called, bHRHCall,
                "window.hasher.replaceHash was " + (bHRHCall ? "" : "not") + " called");

            if (bHRHCall) {
                assert.deepEqual(window.hasher.replaceHash.getCall(0).args[0],
                    oFixture.expectedCalledWith.hasherReplaceHash,
                    "window.hasher.replaceHash was called with the expected parameter");
            }

            window.hasher.replaceHash.restore();
            // no need to restore oController stubs/spies as a new instance of oController will be created with the next test (see setup)
        });
    });

    QUnit.test("test getLogonProvider api", function (assert) {
        var attachThemeChangedStub = sinon.stub(sap.ui.getCore(), "attachThemeChanged"),
            sapUshellConfig = window["sap-ushell-config"],
            shellView,
            iframe,
            logonProvider,
            done = assert.async();

        sapUshellConfig.renderers = { fiori2: { componentData: { config: { rootIntent: "Shell-home" } } } };
        window["sap-ushell-config"] = sapUshellConfig;
        sap.ushell.Container.createRenderer("fiori2");

        EventHub.once("RendererLoaded").do(function () {
            shellView = sap.ui.getCore().byId("mainShell");
            iframe = shellView.createIFrameDialog();

            assert.strictEqual(iframe.getAttribute("id"), "SAMLDialogFrame", "Verify SAML logon iframe ID is samlLogonFrame");
            assert.strictEqual(iframe.nodeName, "IFRAME", "Verify SAML logon frame nodeName is an IFRAME");
            assert.strictEqual(iframe.getAttribute("src"), "", "Verify SAML logon frame src is empty");

            // Check function functions well (skipping on DOM checks or CSS classes exitance..)
            shellView.showIFrameDialog();
            shellView.destroyIFrameDialog();

            // Test API create, show and destroy must be exposed for UI5 services:
            logonProvider = oController._getLogonFrameProvider();
            assert.strictEqual(typeof logonProvider.create, "function", "Verify that oController._getLogonFrameProvider().create() exists");
            assert.strictEqual(typeof logonProvider.show, "function", "Verify that oController._getLogonFrameProvider().show() exists");
            assert.strictEqual(typeof logonProvider.destroy, "function", "Verify that oController._getLogonFrameProvider().destroy() exists");
            shellView.destroy();
            attachThemeChangedStub.restore();

            done();
        });
    });

    /**
     * Test the correctness of the state, in "embedded" navMode.
     * The state is maniulated by the calls to switchViewState in _handleEmbeddedNavMode:
     *   If applicationType = "NWBC" => state = "minimal";
     *   If applicationType = "TR" => state = "minimal";
     *   If sFixedShellHash = "#" => state = "home";
     *   If non of the above => state = "app".
     */
    [
        { sApplicationType: "NWBC" },
        { sApplicationType: "TR" }
    ].forEach(function (oFixture) {
        QUnit.test("test navigate - switching view state", function (assert) {
            var switchViewStateSpy,
                oResolvedHashFragment = {
                    applicationType: oFixture.sApplicationType,
                    url: "XXX",
                    additionalInformation: "",
                    navigationMode: "embedded"
                },
                oMetadata = {},
                oParsedShellHash = {
                    action: "action",
                    appSpecificRoute: undefined,
                    contextRaw: undefined,
                    params: {},
                    semanticObject: "semanticObject"
                },
                oInnerControl = {
                    setActive: function () { },
                    getActive: function () { },
                    getId: function () { return null; }
                },
                sFixedShellHash = "semanticObject-action",
                oGetWrappedApplicationStub;

            oController.initShellUIService();
            oController.oViewPortContainer = {
                removeCenterViewPort:
                    function () { return null; },
                setInitialCenterViewPort:
                    function () { return null; },
                navTo:
                    function () { return null; },
                switchState:
                    function () { return null; },
                getViewPortControl:
                    function () { return null; },
                addCenterViewPort:
                    function () { return null; }
            };

            AppLifeCycle.init("home", oController.oViewPortContainer, "shell-home", false, { ownerComponent: "test" });

            oController._loadCoreExt = sinon.spy();
            oController._requireCoreExt = sinon.spy();
            oGetWrappedApplicationStub = sinon.stub(oController, "getWrappedApplicationWithMoreStrictnessInIntention").returns(oInnerControl);
            switchViewStateSpy = sinon.spy(AppLifeCycle, "switchViewState");
            oController.oCoreExtLoadingDeferred = new jQuery.Deferred();
            oController.oCoreExtLoadingDeferred.resolve();

            oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
            assert.strictEqual(AppLifeCycle.switchViewState.callCount, 1, "switchViewState called");
            assert.strictEqual(AppLifeCycle.switchViewState.args[0][0], "minimal", "switching to state minimal");

            oResolvedHashFragment = {
                applicationType: "Whatever",
                url: "AnyUrl",
                additionalInformation: "",
                navigationMode: "embedded"
            };
            oController.navigate(oParsedShellHash, "#", oMetadata, oResolvedHashFragment);
            assert.strictEqual(AppLifeCycle.switchViewState.callCount, 2, "switchViewState called");
            assert.strictEqual(AppLifeCycle.switchViewState.args[1][0], "home", "switching to state home");

            oController.navigate(oParsedShellHash, "XX", oMetadata, oResolvedHashFragment);
            assert.strictEqual(AppLifeCycle.switchViewState.callCount, 3, "switchViewState called");
            assert.strictEqual(AppLifeCycle.switchViewState.args[2][0], "app", "switching to state app");

            switchViewStateSpy.restore();
            oGetWrappedApplicationStub.restore();
        });
    });

    (function () {
        function createStubsForHandleEmbeddedNavMode(oController, oActiveStatefulContainers, sNavigateToContainer) {
            var oResolvedHashFragment = {
                applicationType: sNavigateToContainer,
                url: "XXX",
                additionalInformation: "",
                navigationMode: "embedded"
            };

            var oMetadata = {},
                oParsedShellHash = {
                    action: "action",
                    appSpecificRoute: undefined,
                    contextRaw: undefined,
                    params: {},
                    semanticObject: "semanticObject"
                },
                sFixedShellHash = "semanticObject-action";

            function createApplicationContainer(bIsActive) {
                return {
                    _getIFrame: function () {
                        return { contentWindow: { postMessage: function () { } } };
                    },
                    getId: function () { return null; },
                    setActive: sinon.stub(),
                    getActive: sinon.stub().returns(bIsActive),
                    destroy: sinon.spy(),
                    setNewApplicationContext: sinon.stub().returns(Promise.resolve()),
                    toggleStyleClass: sinon.stub()
                };
            }

            AppLifeCycle.setStatefulApplicationContainer(Object.keys(oActiveStatefulContainers || {}).reduce(function (oContainers, sTechnology) {
                var oApplicationContainerInnerControl = createApplicationContainer(oActiveStatefulContainers[sTechnology]);
                oContainers[sTechnology] = oApplicationContainerInnerControl;
                return oContainers;
            }, {}));

            var switchViewStateSpy,
                oNavigateToInnerControl =
                    AppLifeCycle.getStatefulApplicationContainer()[sNavigateToContainer]
                    || createApplicationContainer(true /* bIsActive */);

            oController.initShellUIService();

            oController.oViewPortContainer = {
                setInitialCenterViewPort: function () { return null; },
                navTo: sinon.spy(),
                switchState: sinon.spy(),
                getViewPortControl: sinon.spy(),
                addCenterViewPort: sinon.spy(),
                removeCenterViewPort: sinon.spy()
            };

            AppLifeCycle.removeControl = sinon.spy();
            oController._loadCoreExt = sinon.spy();
            oController._requireCoreExt = sinon.spy();

            var oGetWrappedApplicationStub = sinon.stub(oController, "getWrappedApplicationWithMoreStrictnessInIntention").returns(oNavigateToInnerControl);

            switchViewStateSpy = sinon.spy(AppLifeCycle, "switchViewState");
            oController.oCoreExtLoadingDeferred = new jQuery.Deferred();
            oController.oCoreExtLoadingDeferred.resolve();
            AppLifeCycle.getControl = sinon.stub().returns(oNavigateToInnerControl);

            switchViewStateSpy.restore();

            return {
                sFixedShellHash: sFixedShellHash,
                oParsedShellHash: oParsedShellHash,
                oMetadata: oMetadata,
                oResolvedHashFragment: oResolvedHashFragment,
                oInnerControl: oNavigateToInnerControl,
                oGetWrappedApplicationStub: oGetWrappedApplicationStub
            };
        }

        function restoreStubs(oStubs) {
            oStubs.oGetWrappedApplicationStub.restore();
        }

        [{
            testDescription: "two persistent containers exist",
            oActiveStatefulContainers: {
                "WDA": true, // isActive?
                "TR": false
            },
            sNavigateToContainer: "TR",
            expectedVal: {
                "WDA": { recNumber: 0, recCount: 1 },
                "TR": { recNumber: 1, recCount: 2 }
            },
            expectedActiveAfterNavigation: {
                "WDA": false,
                "TR": true
            }
        }].forEach(function (oFixture) {
            QUnit.test("#_handleEmbeddedNavMode sets active containers as expected, when " + oFixture.testDescription, function (assert) {
                var oStubs = createStubsForHandleEmbeddedNavMode(
                    oController,
                    oFixture.oActiveStatefulContainers,
                    oFixture.sNavigateToContainer
                ),
                    done = assert.async();

                var oParsedShellHash = oStubs.oParsedShellHash,
                    oMetadata = oStubs.oMetadata,
                    oResolvedHashFragment = oStubs.oResolvedHashFragment,
                    sFixedShellHash = oStubs.sFixedShellHash;

                AppLifeCycle.init("home", oController.oViewPortContainer, "shell-home", false, { ownerComponent: "test" });
                oController._handleEmbeddedNavMode(sFixedShellHash, oParsedShellHash, oMetadata, oResolvedHashFragment).then(function () {
                    Object.keys(AppLifeCycle.getStatefulApplicationContainer()).forEach(function (sTechnology) {
                        // all the stateful container should be updated when an embedded navigation occurs
                        assert.strictEqual(
                            AppLifeCycle.getStatefulApplicationContainer()[sTechnology].setActive.callCount,
                            oFixture.expectedVal[sTechnology].recCount,
                            "setActive was called the expected number of times on " + sTechnology + " container"
                        );

                        // if active: setActive(true)
                        // if inactive: setActive(false)
                        assert.strictEqual(
                            AppLifeCycle.getStatefulApplicationContainer()[sTechnology].setActive.getCall(oFixture.expectedVal[sTechnology].recNumber).args[0],
                            oFixture.expectedActiveAfterNavigation[sTechnology],
                            "setActive was called with 'true' on " + sTechnology + " container"
                        );
                    });
                    restoreStubs(oStubs);
                    done();
                });
            });
        });

        [{
            callCount: 2,
            testDescription: "#_handleEmbeddedNavMode when `bReuseAnExistingAppSession` is set to `true`",
            oActiveStatefulContainers: { "TR": true /* isActive? */ },
            bReuseAnExistingAppSession: true,
            sNavigateToContainer: "TR"
        }, {
            callCount: 1,
            testDescription: "#_handleEmbeddedNavMode when `bReuseAnExistingAppSession` is set to `false`",
            oActiveStatefulContainers: {}, // no active containers
            bReuseAnExistingAppSession: false,
            sNavigateToContainer: "URL"
        }].forEach(function (oFixture) {
            QUnit.test(oFixture.testDescription, function (assert) {
                // little sanity
                if (oFixture.bReuseAnExistingAppSession && Object.keys(oFixture.oActiveStatefulContainers).length === 0) {
                    throw new Error("Fixture should specify entries in oActiveStatefulContainers if bReuseAnExistingAppSession is set to true");
                }
                if (!oFixture.bReuseAnExistingAppSession && Object.keys(oFixture.oActiveStatefulContainers).length > 0) {
                    throw new Error("Fixture should not specify entries in oActiveStatefulContainers if bReuseAnExistingAppSession is set to false");
                }

                var reuseApplicationContainerStub = sinon.spy(AppLifeCycle, "reuseApplicationContainer"),
                    done = assert.async(),
                    oStubs = createStubsForHandleEmbeddedNavMode(
                        oController,
                        oFixture.oActiveStatefulContainers,
                        oFixture.sNavigateToContainer
                    ),
                    oParsedShellHash = oStubs.oParsedShellHash,
                    oMetadata = oStubs.oMetadata,
                    oResolvedHashFragment = oStubs.oResolvedHashFragment,
                    oInnerControl = oStubs.oInnerControl,
                    sFixedShellHash = oStubs.sFixedShellHash;

                oController._handleEmbeddedNavMode(sFixedShellHash, oParsedShellHash, oMetadata, oResolvedHashFragment).then(function () {
                    if (oFixture.bReuseAnExistingAppSession) {
                        assert.equal(
                            oInnerControl.setNewApplicationContext.calledOnce,
                            true,
                            "Existing session is considered and is requested to set a new application context"
                        );
                        assert.equal(
                            oInnerControl.setNewApplicationContext.args[0][0],
                            oResolvedHashFragment.applicationType,
                            "setNewApplicationContext is called with the application type as argument"
                        );
                        assert.equal(
                            oInnerControl.setNewApplicationContext.args[0][1],
                            oResolvedHashFragment.url,
                            "setNewApplicationContext is called with the url of the expected new context as argument"
                        );
                    } else {
                        assert.equal(
                            oInnerControl.setNewApplicationContext.called,
                            false,
                            "Session reuse is not required and NO request is sent to create a new context under an existing session"
                        );
                        assert.equal(
                            AppLifeCycle.reuseApplicationContainer.calledOnce,
                            false,
                            "oInnerControl.destroy is called"
                        );
                    }

                    assert.strictEqual(
                        oInnerControl.setActive.callCount,
                        oFixture.callCount,
                        "setActive is called once"
                    );

                    if (oInnerControl.setActive.callCount === 1) {
                        assert.strictEqual(
                            oInnerControl.setActive.getCall(0).args[0],
                            true,
                            "setActive is called with true as its first argument"
                        );
                    }
                    reuseApplicationContainerStub.restore();
                    restoreStubs(oStubs);
                    done();
                });
            });
        });
    })();

    QUnit.test("test navigate - full width", function (assert) {
        var oResolvedHashFragment = {
            applicationType: "Whatever",
            url: "AnyUrl",
            navigationMode: "embedded",
            additionalInformation: "",
            fullWidth: true
        };
        var oMetadata = {},
            done = assert.async(),
            oInnerControl = {
                getId: function () { return null; },
                setActive: sinon.stub(),
                getActive: sinon.stub().returns(true)
            },
            oGetWrappedApplicationStub,
            semanticObject = "semanticObject",
            oParsedShellHash = {
                action: "action",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: {},
                semanticObject: semanticObject
            },
            sFixedShellHash = "semanticObject-action";

        oController.oViewPortContainer = {
            addCenterViewPort: sinon.spy(),
            getViewPortControl: sinon.spy(),
            navTo: sinon.spy(),
            switchState: sinon.spy()
        };

        oGetWrappedApplicationStub = sinon.stub(oController, "getWrappedApplicationWithMoreStrictnessInIntention").returns(oInnerControl);

        oController.oExtensionShellStates = { "home": {} };

        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment).then(function () {
            assert.strictEqual(oController.getWrappedApplicationWithMoreStrictnessInIntention.args[0][5], true, "open application in full width mode");

            oResolvedHashFragment = {
                applicationType: "Whatever",
                url: "AnyUrl",
                additionalInformation: "",
                navigationMode: "embedded",
                fullWidth: false
            };
            oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment).then(function () {
                assert.strictEqual(oController.getWrappedApplicationWithMoreStrictnessInIntention.args[1][5], false, "open application not in full width mode");
                oGetWrappedApplicationStub.restore();
                done();
            });
        });
    });

    QUnit.test("test navigate - check sAppId", function (assert) {
        var oResolvedHashFragment = {
                additionalInformation: "aaa",
                applicationType: "URL",
                fullWidth: undefined,
                url: "http://xxx.yyy",
                navigationMode: "embedded",
                text: "bla bla"
            },
            done = assert.async(),
            oParsedShellHash = {
                action: "bbb",
                url: "http://xxx.yyy",
                appSpecificRoute: undefined,
                contextRaw: undefined,
                params: {},
                semanticObject: "aaa"
            },
            oMetadata = {},
            sFixedShellHash = "aaa-bbb";

        oController.oViewPortContainer = {
            getViewPortControl: function (/*inner*/) { },
            addCenterViewPort: function (inner) {
                assert.strictEqual(inner.getId(), "application-aaa-bbb", "validate sAppId");
            },
            navTo: function () { },
            switchState: function () { }
        };

        oController.oExtensionShellStates = { "home": {} };
        oController.initShellUIService();
        oController.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment).then(function () {
            assert.strictEqual(AppLifeCycle.getViewPortContainer().addCenterViewPort.args[0][0].sId, "application-aaa-bbb", "validate sAppId");
            done();
        });
    });

    QUnit.test("_getCurrentAppRouter: ", function (assert) {
        [{
            sTestDescription: "an AppRouter exists",
            bAppRouterExists: true,
            bExpectedGetRouterCalled: true
        }, {
            sTestDescription: "an AppRouter does not exist",
            bAppRouterExists: false,
            bExpectedGetRouterCalled: false
        }].forEach(function (oFixture) {
            // Arrange
            var bGetRouterCalled = false,
                fnGetServiceStub = sinon.stub(sap.ushell.Container, "getService").returns({
                    getCurrentApplication: function () {
                        return oFixture.bAppRouterExists && {
                            componentInstance: {
                                getRouter: function () { bGetRouterCalled = true; }
                            }
                        };
                    }
                });

            // Act
            oController._getCurrentAppRouter();

            // Assert
            assert.strictEqual(bGetRouterCalled, oFixture.bExpectedGetRouterCalled, "router was (not) returned " + oFixture.sTestDescription);

            fnGetServiceStub.restore();
        });
    });

    QUnit.test("_disableSourceAppRouter: ", function (assert) {
        [{
            sTestDescription: "the Hash does not change (inner app link)",
            sNewHash: "#Action-toAppNavSample&/View1/",
            sOldHash: "#Action-toAppNavSample",
            bAppRouterExists: true,
            bExpectedStopCalled: false
        }, {
            sTestDescription: "the Hash does not change (inner app link), but no AppRouter is given",
            sNewHash: "#Action-toAppNavSample&/View1/",
            sOldHash: "#Action-toAppNavSample",
            bAppRouterExists: false,
            bExpectedStopCalled: false
        }, {
            sTestDescription: "the Hash changes (cross application)",
            sNewHash: "#Action-toAppNavSample2",
            sOldHash: "#Action-toAppNavSample",
            bAppRouterExists: true,
            bExpectedStopCalled: true
        }, {
            sTestDescription: "the Hash changes (cross application), but no AppRouter is given",
            sNewHash: "#Action-toAppNavSample2",
            sOldHash: "#Action-toAppNavSample",
            bAppRouterExists: false,
            bExpectedStopCalled: false
        }, {
            sTestDescription: "an empty parameter is not removed",
            sNewHash: "#Action-toAppNavSample?p1=v1&p2=v2&=some/value",
            sOldHash: "#Action-toAppNavSample?p1=v1&p2=v2",
            bAppRouterExists: true,
            bExpectedStopCalled: true
        }, {
            sTestDescription: "a parameter is changed",
            sNewHash: "#Action-toAppNavSample?p1=v1&p2=v2&p3=some/value",
            sOldHash: "#Action-toAppNavSample?p1=v1&p2=v2",
            bAppRouterExists: true,
            bExpectedStopCalled: true
        }, {
            sTestDescription: "a parameter is changed, but no AppRouter is given",
            sNewHash: "#Action-toAppNavSample?p1=v1&p2=v2&p3=some/value",
            sOldHash: "#Action-toAppNavSample?p1=v1&p2=v2",
            bAppRouterExists: false,
            bExpectedStopCalled: false
        }].forEach(function (oFixture) {
            // Arrange
            var bStopCalled = false,
                fnGetCurrentAppRouterStub = sinon.stub(oController, "_getCurrentAppRouter");

            if (oFixture.bAppRouterExists) {
                fnGetCurrentAppRouterStub.returns({
                    stop: function () { bStopCalled = true; }
                });
            }

            // Act
            oController._disableSourceAppRouter(oFixture.sNewHash, oFixture.sOldHash);

            // Assert
            assert.strictEqual(bStopCalled, oFixture.bExpectedStopCalled, "router was (not) stopped when " + oFixture.sTestDescription);

            fnGetCurrentAppRouterStub.restore();
        });
    });

    QUnit.test("_resumeAppRouterIgnoringCurrentHash: ", function (assert) {
        [{
            sTestDescription: "an AppRouter exists",
            bAppRouterExists: true,
            bExpectedInitializeCalled: true
        }, {
            sTestDescription: "an AppRouter does not exist",
            bAppRouterExists: false,
            bExpectedInitializeCalled: false
        }].forEach(function (oFixture) {
            // Arrange
            var bInitializeCalled = false,
                fnGetCurrentAppRouterStub = sinon.stub(oController, "_getCurrentAppRouter");

            if (oFixture.bAppRouterExists) {
                fnGetCurrentAppRouterStub.returns({
                    initialize: function () { bInitializeCalled = true; }
                });
            }

            // Act
            oController._resumeAppRouterIgnoringCurrentHash();

            // Assert
            assert.strictEqual(bInitializeCalled, oFixture.bExpectedInitializeCalled, "router was (not) initialized when " + oFixture.sTestDescription);

            fnGetCurrentAppRouterStub.restore();
        });
    });

    [{
        testDescription: "user confirms data loss popup",
        testIsDirty: true,
        testUi5HistoryStateOffset: 0,
        bConfirmDirtyFlagPopup: true,
        expectedDirtyFlagReset: true,
        expectedHandlerResult: "Continue",
        expectedHistoryBackCalls: 0,
        expectedHistoryForwardCalls: 0
    }, {
        testDescription: "user cancels data loss popup after forward navigation direction",
        testIsDirty: true,
        testUi5HistoryStateOffset: 1,
        bConfirmDirtyFlagPopup: false,
        expectedDirtyFlagReset: false,
        expectedHandlerResult: "Custom",
        expectedHistoryBackCalls: 1, // restore via history back
        expectedHistoryForwardCalls: 0
    }, {
        testDescription: "user cancels data loss popup after new entry navigation direction",
        testIsDirty: true,
        testUi5HistoryStateOffset: undefined,
        bConfirmDirtyFlagPopup: false,
        expectedDirtyFlagReset: false,
        expectedHandlerResult: "Custom",
        expectedHistoryBackCalls: 1, // restore via history back
        expectedHistoryForwardCalls: 0
    }, {
        testDescription: "user cancels data loss popup after backwards navigation direction",
        testIsDirty: true,
        testUi5HistoryStateOffset: -1,
        bConfirmDirtyFlagPopup: false,
        expectedDirtyFlagReset: false,
        expectedHandlerResult: "Custom",
        expectedHistoryBackCalls: 0,
        expectedHistoryForwardCalls: 1 // restore via set hash
    }, {
        testDescription: "user cancels data loss popup after unknown navigation direction + shell navigation reports last navigation was made via setHash",
        testIsDirty: true,
        testUi5HistoryStateOffset: undefined,
        bConfirmDirtyFlagPopup: false,
        bLastNavigationReplacedHistoryEntry: false,
        expectedDirtyFlagReset: false,
        expectedHandlerResult: "Custom",
        expectedHistoryBackCalls: 1,
        expectedHistoryForwardCalls: 0
    }, {
        testDescription: "user cancels data loss popup after unknown navigation direction + shell navigation reports last navigation was made via replaceHash",
        testIsDirty: true,
        testUi5HistoryStateOffset: undefined,
        bConfirmDirtyFlagPopup: false,
        bLastNavigationReplacedHistoryEntry: true,
        expectedDirtyFlagReset: false,
        expectedHandlerResult: {
            "hash": "old-hash",
            "status": "Custom"
        },
        expectedHistoryBackCalls: 0,
        expectedHistoryForwardCalls: 0
    }].forEach(function (oFixture) {
        QUnit.test("test data loss navigation handler when " + oFixture.testDescription, function (assert) {
            // Arrange
            var getDirtyFlag = sinon.stub(sap.ushell.Container, "getDirtyFlag").returns(oFixture.testIsDirty),
                setDirtyFlag = sinon.stub(sap.ushell.Container, "setDirtyFlag"),
                historyGo = sinon.stub(window.history, "go"),
                fOrigConfirm = window.confirm;

            window.confirm = sinon.stub().returns(oFixture.bConfirmDirtyFlagPopup);

            var oUi5HistoryStateOffsetStub = sinon.stub();
            oUi5HistoryStateOffsetStub.returns(oFixture.testUi5HistoryStateOffset);
            sinon.stub(Ui5History, "getInstance").returns({
                getHistoryStateOffset: oUi5HistoryStateOffsetStub
            });
            sinon.stub(Storage, "get"); // called during destroy, if this test runs individually
            sinon.stub(oController.oShellNavigation, "wasHistoryEntryReplaced").returns(oFixture.bLastNavigationReplacedHistoryEntry);

            // Act
            var oNavigationHandlerResult = oController.handleDataLoss("new-hash", "old-hash");

            // Assert
            if (oFixture.expectedDirtyFlagReset) {
                assert.strictEqual(setDirtyFlag.callCount, 1, "setDirtyFlag was called");
                assert.deepEqual(setDirtyFlag.getCall(0).args[0], false, "setDirtyFlag was called with 'false'");
                assert.strictEqual(oController._getPreviousPageDirty(), true, "Verify that the dirty flag of previous page is true");
            } else {
                assert.strictEqual(setDirtyFlag.callCount, 0, "setDirtyFlag was not called");
                assert.strictEqual(oController._getPreviousPageDirty(), false, "Verify that the dirty flag of previous page is true");
            }

            if (oFixture.expectedHistoryBackCalls) {
                assert.strictEqual(historyGo.callCount, oFixture.expectedHistoryBackCalls, "window.history.go was called the expected number of times");
                assert.ok(historyGo.getCall(0).args[0] < 0, "window.history.go is called with negative number for backwards navigation");
            } else if (oFixture.expectedHistoryForwardCalls) {
                assert.strictEqual(historyGo.callCount, oFixture.expectedHistoryForwardCalls, "window.history.go was called the expected number of times");
                assert.ok(historyGo.getCall(0).args[0] > 0, "window.history.go is called with positive number for forwards navigation");
            } else {
                assert.strictEqual(historyGo.callCount, 0, "window.history.go was called the expected number of times");
            }
            assert.deepEqual(oNavigationHandlerResult, oFixture.expectedHandlerResult, "navigation handler returned expected result");

            if (oFixture.bConfirmDirtyFlagPopup) {
                assert.strictEqual(oUi5HistoryStateOffsetStub.callCount, 0, "UI5 History API was called as expected");
            } else {
                assert.strictEqual(oUi5HistoryStateOffsetStub.callCount, 1, "UI5 History API was called as expected");
            }

            // Restore
            oController.onExit();

            window.confirm = fOrigConfirm;
            getDirtyFlag.restore();
            setDirtyFlag.restore();
            historyGo.restore();
            oController._setPreviousPageDirty(false);
            Ui5History.getInstance.restore();

            Storage.get.restore();
        });
    });

    QUnit.module("sap.ushell.renderers.fiori2.Shell (Part 2)", {
        beforeEach: function (assert) {
            var done = assert.async();
            window.location.hash = "";
            window["sap-ushell-config"] = {};
            window["sap-ushell-config"].renderers = { fiori2: { componentData: { config: { rootIntent: "Shell-home" } } } };

            sap.ushell.bootstrap("local").then(function () {
                var oShellModel;

                stubHashChangeHandler();

                jQuery.sap.declare("sap.ushell.components.container.ApplicationContainer");
                sap.ushell.components.container.ApplicationContainer = function () { };
                sap.m.BusyDialog.prototype.open = function () { };

                oController = new sap.ui.controller("sap.ushell.renderers.fiori2.Shell");
                oShellModel = Config.createModel("/core/shell/model", JSONModel);
                oController.getView = sinon.stub().returns(createMockedView(oShellModel));
                var oApplicationModel = AppLifeCycle.shellElements().model();
                HeaderManager.init({}, oApplicationModel);
                oController.initShellModel({}, oApplicationModel);
                oController.history = new sap.ushell.renderers.fiori2.History();

                AppLifeCycle.init("home", oController.oViewPortContainer, "shell-home", false, { ownerComponent: "test" });
                oController.oStatefulApplicationContainer = {};
                sap.ushell.Container.getService("PluginManager").getRegisteredPlugins = function () { return { RendererExtensions: { init: true } }; };

                var fnGetServiceOrig = sap.ushell.Container.getService;

                oController.initShellUIService();
                sinon.stub(sap.ushell.Container, "getService", function (sService) {
                    if (sService === "ShellNavigation") {
                        return { toExternal: sinon.stub() };
                    }
                    return fnGetServiceOrig.call(sap.ushell.Container, sService);
                });

                done();
            });
        },
        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            testUtils.restoreSpies(
                sap.ui.getCore().attachThemeChanged,
                sap.ui.component.load,
                sap.ushell.utils.appendUserIdToUrl,
                sap.ushell.utils.getPrivateEpcm,
                sap.ushell.utils.isNativeWebGuiNavigation,
                sap.ushell.Container.getService
            );
            window.location.hash = "";
            delete sap.ushell.Container;
            oController.destroy();
            HeaderManager.destroy();
        }
    });

    QUnit.test("test ShellUIService event provider", function (assert) {
        AppLifeCycle.switchViewState("app");

        assert.notStrictEqual(AppLifeCycle.getAppMeta().getIsHierarchyChanged(), true, "onHierarchyChange was not called on init");
        assert.notStrictEqual(oController.isTitleChanged, true, "onTitleChange was not called on init");
        assert.notStrictEqual(AppLifeCycle.getAppMeta().getIsRelatedAppsChanged(), true, "onRelatedAppsChange was not called on init");
        assert.notStrictEqual(oController.isBackNavigationChanged, true, "onBackNavigationChange was not called on init");

        AppLifeCycle.getShellUIService().getInterface().setHierarchy();
        AppLifeCycle.getShellUIService().getInterface().setTitle();
        AppLifeCycle.getShellUIService().getInterface().setRelatedApps();
        AppLifeCycle.getShellUIService().getInterface().setBackNavigation();

        assert.strictEqual(AppLifeCycle.getAppMeta().getIsHierarchyChanged(), true, "onHierarchyChange was called");
        assert.strictEqual(AppLifeCycle.getAppMeta().getIsTitleChanged(), true, "onTitleChange was called");
        assert.strictEqual(AppLifeCycle.getAppMeta().getIsRelatedAppsChanged(), true, "onRelatedAppsChange was called");
        assert.strictEqual(AppLifeCycle.getBackNavigationChanged(), true, "onBackNavigationChange was called");
    });

    QUnit.test("test ShellUIService back navigation handler", function (assert) {
        var publishStub = sinon.stub(sap.ui.getCore().getEventBus(), "publish"),
            publishExternalStub = sinon.stub(sap.ushell.renderers.fiori2.utils, "publishExternalEvent"),
            getWrappedApplicationWithMoreStrictnessInIntentionStub = sinon.stub(oController, "getWrappedApplicationWithMoreStrictnessInIntention").returns({
                getId: function () { },
                getActive: sinon.stub(),
                setActive: sinon.stub()
            }),
            oBackNavigationStub = sinon.stub(RelatedServices, "_historyBackNavigation");

        oController.oViewPortContainer = {
            navTo: function () { },
            switchState: function () { },
            getViewPortControl: function () { }
        };
        AppLifeCycle.init("home", oController.oViewPortContainer, "shell-home", false, { ownerComponent: "test" });
        AppLifeCycle.setStatefulApplicationContainer({});

        var fnBackNavigation = sinon.spy();
        AppLifeCycle.getShellUIService().getInterface().setBackNavigation(fnBackNavigation);
        oController._navBack();

        assert.strictEqual(fnBackNavigation.callCount, 1, "Custom navigation handler should be called");

        oController.resetShellUIServiceHandlers();
        oController.onAppAfterRendering();
        oController._navBack();

        assert.strictEqual(fnBackNavigation.callCount, 1, "Custom navigation handler should not be called the second time");

        AppLifeCycle.getShellUIService().getInterface().setBackNavigation(fnBackNavigation);
        oController._handleEmbeddedNavMode("#", {}, {}, {
            url: "http://xxx.yyy"
        });

        oController._navBack();

        assert.strictEqual(fnBackNavigation.callCount, 1, "Custom navigation handler should not be called after navigating to home");

        publishExternalStub.restore();
        publishStub.restore();
        oBackNavigationStub.restore();
        getWrappedApplicationWithMoreStrictnessInIntentionStub.restore();
    });

    QUnit.test("test ShellUIService changes model on app state", function (assert) {
        var done = assert.async(),
            homeHierarcy, homeTitle, homeRelatedApps,
            fnWaitConfigChange = waitConfigChange.bind(null, "/core/shellHeader"),
            sTitle = "App title",
            oHeirarchy = [{
                icon: "sap-icon://nav-back",
                title: "App1",
                intent: "#App1"
            }],
            oRelatedApps = [{
                icon: "sap-icon://documents",
                title: "Related App 1",
                intent: "#Action-todefaultapp"
            }],
            oExpectedHeirarchy = [{
                icon: "sap-icon://nav-back",
                title: "App1",
                intent: "#App1"
            }, {
                icon: "sap-icon://home",
                title: "Home",
                intent: "#Shell-home"
            }];

        fnWaitConfigChange()
            .then(function () { AppLifeCycle.switchViewState("app"); })
            .then(fnWaitConfigChange)
            .then(function () {
                AppLifeCycle.init("app", undefined, "Shell-home", false, { ownerComponent: "test" });
                AppLifeCycle.switchViewState("app");
            })
            .then(fnWaitConfigChange)
            .then(function () {
                AppLifeCycle.getShellUIService().setHierarchy(oHeirarchy);
                AppLifeCycle.getShellUIService().setTitle(sTitle);
                AppLifeCycle.getShellUIService().setRelatedApps(oRelatedApps);
            })
            .then(fnWaitConfigChange)
            .then(function () {
                assert.deepEqual(Config.last("/core/shellHeader/application").hierarchy, oExpectedHeirarchy, "oHierarchy was updated in the model properly");
                assert.deepEqual(Config.last("/core/shellHeader/application").title, sTitle, "title was updated in the model properly");
                assert.deepEqual(Config.last("/core/shellHeader/application").relatedApps, oRelatedApps, "oRelatedApps was updated in the model properly");

                homeHierarcy = oController.getModel().getProperty("/states/home/application/hierarchy");
                homeTitle = oController.getModel().getProperty("/states/home/application/title");
                homeRelatedApps = oController.getModel().getProperty("/states/home/application/relatedApps");

                assert.ok(!homeHierarcy || homeHierarcy.length === 0, "oHierarchy was not updated in the home state model");
                assert.ok(!homeTitle || homeTitle.length === 0, "title was not updated in the home state model");
                assert.ok(!homeRelatedApps || homeRelatedApps.length === 0, "oRelatedApps was not updated in the home state model");

                done();
            });
    });

    QUnit.test("test ShellUIService changes model on home state", function (assert) {
        var done = assert.async(),
            sTitle = "App title",
            oHeirarchy = [{
                icon: "sap-icon://nav-back",
                title: "App1",
                intent: "#App1"
            }],
            oRelatedApps = [{
                icon: "sap-icon://documents",
                title: "Related App 1",
                intent: "#Action-todefaultapp"
            }],
            fnWaitConfigChange = waitConfigChange.bind(null, "/core/shellHeader");
        fnWaitConfigChange()
            .then(function () { AppLifeCycle.switchViewState("home"); })
            .then(fnWaitConfigChange)
            .then(function () {
                AppLifeCycle.getShellUIService().setHierarchy(oHeirarchy);
                AppLifeCycle.getShellUIService().setTitle(sTitle);
                AppLifeCycle.getShellUIService().setRelatedApps(oRelatedApps);
            })
            .then(fnWaitConfigChange)
            .then(function () {
                assert.deepEqual(Config.last("/core/shellHeader/application").hierarchy, oHeirarchy, "oHierarchy was updated in the model properly");
                assert.deepEqual(Config.last("/core/shellHeader/application").title, sTitle, "title was updated in the model properly");
                assert.deepEqual(Config.last("/core/shellHeader/application").relatedApps, oRelatedApps, "oRelatedApps was updated in the model properly");
                done();
            });
    });

    /**
     * Test the trampolin app decision fucntion.
     */
    [
        { description: "noComponent", noComponent: true, expectedResult: "fail" },
        { description: "noFunction", noFunction: true, expectedResult: "fail" },
        { description: "returns promise, resolves", promise: true, resolve: "#Abc-def", expectedResult: "ok" },
        { description: "returns promise, rejects", promise: true, expectedResult: "fail" },
        { description: "returns undefined", promise: false, expectedResult: "fail" }
    ].forEach(function (oFixture) {
        QUnit.test("_usesNavigationRedirect decision with nav redirect" + oFixture.description, function (assert) {
            var done = assert.async(),
                oNavResResult,
                oComponent = { destroy: sinon.spy() };
            if (oFixture.promise) {
                oNavResResult = new jQuery.Deferred();
            }
            if (!oFixture.noFunction) {
                oComponent.navigationRedirect = function () { return oNavResResult; };
            }
            var oHandle = {
                getInstance: function () {
                    return oFixture.noComponent ? undefined : oComponent;
                }
            };
            sinon.stub(oController.history, "pop");
            // act
            var res = oController._usesNavigationRedirect(oHandle);
            // check
            res.done(function (/*res*/) {
                assert.strictEqual(oFixture.expectedResult, "ok", "promise ok");
                assert.strictEqual(oComponent.destroy.called, true, "component was destroyed");
                assert.strictEqual(oController.history.pop.callCount, 1, "history pop was called once");
                done();
            }).fail(function () {
                assert.strictEqual(oFixture.expectedResult, "fail", "promise ok");
                done();
            });
            if (oFixture.promise) {
                if (oFixture.resolve) {
                    oNavResResult.resolve(oFixture.resolve);
                } else {
                    oNavResResult.reject();
                }
            }
            assert.ok(true, "got to end");
        });
    });

    QUnit.module("Scheduling tests", {
        beforeEach: function (assert) {
            EventHub._reset();
            var done = assert.async();
            window.location.hash = "";
            window["sap-ushell-config"] = { renderers: { fiori2: { componentData: { config: { rootIntent: "Shell-home" } } } } };

            sap.ushell.bootstrap("local").then(function () {
                this.oController = new sap.ui.controller("sap.ushell.renderers.fiori2.Shell");
                this.oDoables = this.oController._registerAndCreateEventHubDoables();
                done();
            }.bind(this));
        },
        afterEach: function () {
            delete sap.ushell.Container;
            this.oController.destroy();
        }
    });

    QUnit.test("_onCoreResourcesComplementLoaded starts the Scheduling Agent", function (assert) {
        var oSchedulingAgentStub = sinon.stub(SchedulingAgent, "_initialize").returns(),
            done = assert.async();

        EventHub.emit("CoreResourcesComplementLoaded");
        EventHub.wait("CoreResourcesComplementLoaded").then(function () {
            EventHub.once("CoreResourcesComplementLoaded").do(function () {
                assert.ok(oSchedulingAgentStub.called, "The Scheduling Agent was initialized");
                EventHub.once("startScheduler").do(function () {
                    assert.ok(true, "The Scheduling Agent was started");
                    oSchedulingAgentStub.restore();
                    done();
                });
            });
        });
    });

    QUnit.test("The event loadRendererExtensions triggers the loading of the Renderer Plugins", function (assert) {
        var done = assert.async(),
            oPluginManagerStub = {
                loadPlugins: function () {
                    return { always: function (handler) { handler(); } };
                }
            },
            oPromise = Promise.resolve(oPluginManagerStub),
            oGetServiceAsyncStub = sinon.stub(sap.ushell.Container, "getServiceAsync").returns(oPromise);

        EventHub.emit("loadRendererExtensions", { stepName: "myDupiStep" });
        EventHub.wait("loadRendererExtensions").then(function () {
            EventHub.once("StepDone").do(function (eventData) {
                assert.ok(true, "StepDone was emitted");
                assert.strictEqual(eventData, "myDupiStep", "StepDone was emitted with the correct step name.");
                oGetServiceAsyncStub.restore();
                done();
            });
        });
    });

    QUnit.test("The event loadUsageAnalytics triggers the loading of the Usage Analytics", function (assert) {
        var done = assert.async(),
            oPromise = Promise.resolve({ init: function () { } }),
            oGetServiceAsyncStub = sinon.stub(sap.ushell.Container, "getServiceAsync").returns(oPromise);
        EventHub.emit("loadUsageAnalytics", { stepName: "myDupiStep" });
        EventHub.wait("loadUsageAnalytics").then(function () {
            EventHub.once("StepDone").do(function (eventData) {
                assert.ok(true, "StepDone was emitted");
                assert.strictEqual(eventData, "myDupiStep", "StepDone was emitted with the correct step name.");
                oGetServiceAsyncStub.restore();
                done();
            });
        });
    });

    QUnit.test("Usage Analytics triggers a StepFailed if the promise is rejected.", function (assert) {
        var done = assert.async(),
            oPromise = Promise.reject(),
            oGetServiceAsyncStub = sinon.stub(sap.ushell.Container, "getServiceAsync").returns(oPromise);
        EventHub.emit("loadUsageAnalytics", { stepName: "myDupiStep" });
        EventHub.wait("loadUsageAnalytics").then(function () {
            EventHub.once("StepFailed").do(function (eventData) {
                assert.ok(true, "StepFailed was emitted");
                assert.strictEqual(eventData, "myDupiStep", "StepFailed was emitted with the correct step name.");
                oGetServiceAsyncStub.restore();
                done();
            });
        });
    });

    QUnit.test("The event loadWarmupPlugins triggers the loading of the warmup plugins", function (assert) {
        var done = assert.async(),
            oPluginManagerStub = {
                loadPlugins: function () {
                    return { always: function (handler) { handler(); } };
                }
            },
            oPromise = Promise.resolve(oPluginManagerStub),
            oGetServiceAsyncStub = sinon.stub(sap.ushell.Container, "getServiceAsync").returns(oPromise);

        EventHub.emit("loadWarmupPlugins", { stepName: "myDupiStep" });
        EventHub.wait("loadWarmupPlugins").then(function () {
            EventHub.once("StepDone").do(function (eventData) {
                assert.ok(true, "StepDone was emitted");
                assert.strictEqual(eventData, "myDupiStep", "StepDone was emitted with the correct step name.");
                oGetServiceAsyncStub.restore();
                done();
            });
        });
    });

    QUnit.module("sap.ushell.renderers.fiori2.Shell.controller onAppOpened", {
        beforeEach: function () {
            this.sAppHash = "testAppHash";
            this.oResolvedHashFragment = {};
            this.oController = new sap.ui.controller("sap.ushell.renderers.fiori2.Shell");

            sap.ushell.Container = {
                getServiceAsync: sinon.stub(),
                getService: sinon.stub()
            };

            this.oSetVisibleStub = sinon.stub();

            this.oByIdStub = sinon.stub(sap.ui.getCore(), "byId").returns({
                setVisible: this.oSetVisibleStub
            });

            this.oController.oShellNavigation = { hashChanger: { getAppHash: function () { } } };
            this.getAppHashStub = sinon.stub(this.oController.oShellNavigation.hashChanger, "getAppHash");
            this.oStub = sinon.stub(this.oController, "logOpenAppAction");
        },
        afterEach: function () {
            this.oByIdStub.restore();
            delete sap.ushell.Container;
            this.oController.destroy();
        }
    });

    QUnit.test("Creates a correct sAppPart if getAppHash returns non-empty string", function (assert) {
        // Arrange
        this.getAppHashStub.returns("#test");

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);

        assert.strictEqual(this.oStub.callCount, 1, "The function logOpenAppAction has been called once.");
        assert.strictEqual(this.oStub.firstCall.args[0], this.oResolvedHashFragment, "The function logOpenAppAction has been called with the correct second parameter.");
        assert.strictEqual(this.oStub.firstCall.args[1], "&/#test", "The function logOpenAppAction has been called with the correct third parameter.");
    });

    QUnit.test("creates correct sAppPart if getAppHash returns empty string", function (assert) {
        // Arrange
        this.getAppHashStub.returns("");

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);

        // Assert
        assert.strictEqual(this.oStub.callCount, 1, "The function logOpenAppAction has been called once.");
        assert.strictEqual(this.oStub.firstCall.args[0], this.oResolvedHashFragment, "The function logOpenAppAction has been called with the correct second parameter.");
        assert.strictEqual(this.oStub.firstCall.args[1], null, "The function logOpenAppAction has been called with the correct third parameter.");
    });

    QUnit.test("creates correct sAppPart if getAppHash returns null", function (assert) {
        // Arrange
        this.getAppHashStub.returns(null);

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);

        // Assert
        assert.strictEqual(this.oStub.callCount, 1, "The function logOpenAppAction has been called once.");
        assert.strictEqual(this.oStub.firstCall.args[0], this.oResolvedHashFragment, "The function logOpenAppAction has been called with the correct second parameter.");
        assert.strictEqual(this.oStub.firstCall.args[1], null, "The function logOpenAppAction has been called with the correct third parameter.");
    });

    QUnit.test("sets visible to false on the MenuBar component", function (assert) {
        // Arrange
        this.getAppHashStub.returns(null);

        // Act
        this.oController.onAppOpened("sChannelIdTest", "sEventIdTest", this.oResolvedHashFragment);

        // Assert
        assert.strictEqual(this.oByIdStub.callCount, 1 , "The function sap.ui.getCore().byId has been called once");
        assert.strictEqual(this.oByIdStub.firstCall.args[0], "menuBarComponentContainer", "The function sap.ui.getCore().byId has been called with the correct parameter");
        assert.strictEqual(this.oSetVisibleStub.callCount, 1, "The function setVisible has been called once");
        assert.strictEqual(this.oSetVisibleStub.firstCall.args[0], false, "The function setVisible has been called with the correct parameter");
    });

    QUnit.module("sap.ushell.renderers.fiori2.Shell.controller doHashChange", {
        beforeEach: function (/*assert*/) {
            var oURLParsingStub = { parseShellHash: sinon.stub().returns() },
                oGetServiceAsyncPromise = jQuery.Deferred().resolve(oURLParsingStub).promise(),
                oDfd;

            this.sFixedShellHash = "#test";
            this.sAppHash = "testAppHash";
            this.oResolvedHashFragment = {
                url: "/some/target/url",
                applicationType: ApplicationType.URL.type,
                text: "App View"
            };
            this.oParsedShellHash = { test: "oParsedShellHash" };
            this.oMetadata = { test: "oMetadata" };
            this.sOldShellHash = "#oldHash";
            this.sOldAppPart = "oldAppPart";
            this.oController = new sap.ui.controller("sap.ushell.renderers.fiori2.Shell");
            this.oController.bEnableHashChange = true;
            this.oShellModel = Config.createModel("/core/shell/model", JSONModel);
            this.oController.getView = sinon.stub().returns(createMockedView(this.oShellModel));
            var oApplicationModel = AppLifeCycle.shellElements().model();
            HeaderManager.init({}, oApplicationModel);
            this.oController.initShellModel({}, oApplicationModel);
            this.oController.getModel().setProperty("/enableTrackingActivity", true);
            this.oController.history = {
                getHistoryLength: sinon.stub().returns(0),
                hashChange: sinon.stub(),
                pop: sinon.stub()
            };

            oDfd = new jQuery.Deferred().resolve(this.oResolvedHashFragment, this.oParsedShellHash).promise();

            sap.ushell.Container = {
                getServiceAsync: sinon.stub().withArgs("URLParsing").returns(oGetServiceAsyncPromise),
                getService: sinon.stub().withArgs("URLParsing").returns(oURLParsingStub)
            };

            sinon.stub(AppLifeCycle, "getInMemoryInstance").returns({ isInstanceSupported: true });
            sinon.stub(this.oController, "fixShellHash").returns(this.sFixedShellHash);
            sinon.stub(this.oController, "_resolveHashFragment").returns(oDfd);

            this.oController.oShellNavigation = {
                hashChanger: { getAppHash: function () { } },
                wasHistoryEntryReplaced: function () { },
                resetHistoryEntryReplaced: function () { },
                isInitialNavigation: function () { return false; }
            };

            this.getAppHashStub = sinon.stub(this.oController.oShellNavigation.hashChanger, "getAppHash");

            sinon.stub(AppLifeCycle, "handleControl");
            sinon.stub(AppLifeCycle, "isAppInCache");
            sinon.stub(sap.ushell.services.AppConfiguration, "_processKey").returns("Shell-search is started inplace");
            sinon.stub(sap.ushell.services.AppConfiguration, "addActivity");
            sinon.stub(this.oController, "_getConfig").returns({
                enableRecentActivity: true,
                enableRecentActivityLogging: true
            });
            sinon.stub(this.oController, "_openAppNewWindow"); // prevents new window is opened
            sinon.stub(this.oController, "_windowHistoryBack"); // prevents back navigation during test

            this.oController.oNavigationHistoryMonitor = { reset: sinon.stub() };

            /*
             * AppConfiguration memoized metadata about the current application.
             * We need to simulate here that each test is uniquely saved in the app configuration service memory.
             * Therefore we mock _processKey, which is the function responsible to extract the key to use for the memoization.
             * By mocking in this way we ensure uniqueness of this key.
             */
            sinon.stub(this.oController, "_calculateNavigationMode").returns(this.oResolvedHashFragment);
            sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata").returns(this.oMetadata);

            this.oNavigateSpy = sinon.stub(this.oController, "navigate");
            this.oLogOpenAppActionSpy = sinon.spy(this.oController, "logOpenAppAction");
            this.oOpenAppInNewWindowAndRestoreSpy = sinon.spy(this.oController, "_openAppInNewWindowAndRestore");
        },
        afterEach: function () {
            this.oNavigateSpy.restore();
            this.oLogOpenAppActionSpy.restore();
            this.oOpenAppInNewWindowAndRestoreSpy.restore();
            this.oController.fixShellHash.restore();
            this.oController.oShellNavigation.hashChanger.getAppHash.restore();
            this.oController._resolveHashFragment.restore();

            delete sap.ushell.Container;
            this.oController.destroy();
            AppLifeCycle.getInMemoryInstance.restore();
            AppLifeCycle.handleControl.restore();
            AppLifeCycle.isAppInCache.restore();
            sap.ushell.services.AppConfiguration._processKey.restore();
            sap.ushell.services.AppConfiguration.getMetadata.restore();
            sap.ushell.services.AppConfiguration.addActivity.restore();
        }
    });

    // Test doHashChange: calls correct methods for embedded applications
    [{
        testDescription: "Shell-search is started inplace",
        sInternalNavigationMode: "embedded",
        sText: "App View",
        sHashFragment: "#Action-search"
    }, {
        testDescription: "Shell-search is started inplace",
        sInternalNavigationMode: "embedded",
        sText: "App View",
        sHashFragment: "#Action-search",
        sAppPart: "&/top=20"
    }].forEach(function (oFixture) {
        QUnit.test("doHashChange embedded when " + oFixture.testDescription, function (assert) {
            this.oResolvedHashFragment.navigationMode = oFixture.sInternalNavigationMode;
            this.oController.doHashChange(
                oFixture.sHashFragment,
                oFixture.sAppPart,
                this.sOldShellHash,
                this.sOldAppPart,
                null
            );
            assert.strictEqual(
                this.oNavigateSpy.withArgs(
                    this.oParsedShellHash,
                    this.sFixedShellHash,
                    this.oMetadata,
                    this.oResolvedHashFragment).calledOnce,
                true
            );
        });
    });

    // Test doHashChange: calls correct methods for ex-place applications (newWindow)
    [{
        testDescription: "Application with invalid hash is started in a new window",
        sInternalNavigationMode: "newWindow",
        sHashFragment: "#hash?p1=v1",
        sText: "Application Title from Target Mapping"
    }, {
        testDescription: "Application with a valid hash is started in a new window",
        sInternalNavigationMode: "newWindow",
        sText: null,
        sHashFragment: "#Object-action?p1=v1&p2=v2"
    }].forEach(function (oFixture) {
        QUnit.test("doHashChange new window when " + oFixture.testDescription, function (assert) {
            this.oResolvedHashFragment.navigationMode = oFixture.sInternalNavigationMode;
            this.oController.doHashChange(
                oFixture.sHashFragment,
                oFixture.sAppPart,
                this.sOldShellHash,
                this.sOldAppPart,
                null
            );
            assert.strictEqual(this.oLogOpenAppActionSpy.withArgs(this.oResolvedHashFragment, oFixture.sAppPart).calledOnce, true);
            assert.strictEqual(this.oOpenAppInNewWindowAndRestoreSpy.withArgs(this.oResolvedHashFragment).calledOnce, true);
        });
    });
});
