// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.SessionHandler
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/resources",
    "sap/ushell/services/Container",
    "sap/ushell/SessionHandler",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ui/util/Storage",
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ushell/Config"
], function (Resources, Container, SessionHandler, AppLifeCycle, Storage, Log, ObjectPath, Config) {
    "use strict";

    var oSessionHandlerConfig = {
            sessionTimeoutIntervalInMinutes: 30,
            sessionTimeoutReminderInMinutes: 5,
            enableAutomaticSignout: false,
            keepSessionAlivePopupText: "XXX The session is about to expoire",
            pageReloadPopupText: "XXX The session was terminated, please reload"
        },
        oSessionHandlerConfigNoReminder = {
            sessionTimeoutIntervalInMinutes: 30,
            sessionTimeoutReminderInMinutes: 0,
            enableAutomaticSignout: false
        };

    QUnit.start();

    QUnit.module("init", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oRegisterLogoutStub = sinon.stub();
            this.oPutTimestampInStorageStub = sinon.stub(this.oSessionHandler, "putTimestampInStorage");
            this.oPutContinueWorkingVisibilityInStorageStub = sinon.stub(this.oSessionHandler, "putContinueWorkingVisibilityInStorage");
            this.oRegisterCommHandlerStub = sinon.stub(this.oSessionHandler, "registerCommHandlers");
            this.oAttachUserEventsStub = sinon.stub(this.oSessionHandler, "attachUserEvents");
            this.oInitSessionTimeoutStub = sinon.stub(this.oSessionHandler, "initSessionTimeout");
            this.oInitTileRequestTimout = sinon.stub(this.oSessionHandler, "initTileRequestTimeout");

            ObjectPath.set("sap.ushell.Container.registerLogout", this.oRegisterLogoutStub);
        },
        afterEach: function () {
            this.oPutTimestampInStorageStub.restore();
            this.oPutContinueWorkingVisibilityInStorageStub.restore();
            this.oRegisterCommHandlerStub.restore();
            this.oAttachUserEventsStub.restore();
            this.oInitSessionTimeoutStub.restore();
            this.oInitTileRequestTimout.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Test if all setup functions are called as expected", function (assert) {
        // Arrange
        var oConfig = {
            sessionTimeoutIntervalInMinutes: 30,
            sessionTimeoutTileStopRefreshIntervalInMinutes: 15
        };
        // Act
        this.oSessionHandler.init(oConfig);
        // Assert
        assert.ok(this.oRegisterLogoutStub.calledOnce, "registerLogout was called");
        assert.ok(this.oPutTimestampInStorageStub.calledOnce, "putTimestampInStorage was called");
        assert.ok(this.oPutContinueWorkingVisibilityInStorageStub.calledOnce, "putContinueWorkingVisibilityInStorageStub was called");
        assert.ok(this.oRegisterCommHandlerStub.calledOnce, "registerCommHandlerStub was called");
        assert.ok(this.oAttachUserEventsStub.calledOnce, "attachUserEventsStub was called");
        assert.ok(this.oInitSessionTimeoutStub.calledOnce, "initSessionTimeoutStub was called");
        assert.ok(this.oInitTileRequestTimout.calledOnce, "initTileRequestTimout was called");
    });

    QUnit.test("Test if all setup functions are called as expected except the disabled timeout types", function (assert) {
        // Arrange
        var oConfig = {
            sessionTimeoutReminderInMinutes: -1,
            sessionTimeoutTileStopRefreshIntervalInMinutes: -1
        };
        // Act
        this.oSessionHandler.init(oConfig);
        // Assert
        assert.ok(this.oRegisterLogoutStub.calledOnce, "registerLogout was called");
        assert.ok(this.oPutTimestampInStorageStub.calledOnce, "putTimestampInStorage was called");
        assert.ok(this.oPutContinueWorkingVisibilityInStorageStub.calledOnce, "putContinueWorkingVisibilityInStorageStub was called");
        assert.ok(this.oRegisterCommHandlerStub.calledOnce, "registerCommHandlerStub was called");
        assert.ok(this.oAttachUserEventsStub.calledOnce, "attachUserEventsStub was called");
        assert.ok(this.oInitSessionTimeoutStub.notCalled, "initSessionTimeoutStub was not called");
        assert.ok(this.oInitTileRequestTimout.notCalled, "initTileRequestTimout was not called");
    });

    QUnit.module("initSessionTimeout", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oMeasureStartStub = sinon.stub(jQuery.sap.measure, "start");
            this.oMeasureEndStub = sinon.stub(jQuery.sap.measure, "end");
            this.oModelStub = {
                setProperty: sinon.stub()
            };
            this.oSessionHandler.oModel = this.oModelStub;
            this.oNotifyServerStub = sinon.stub(this.oSessionHandler, "notifyServer");
            this.oNotifyUserInactivityStub = sinon.stub(this.oSessionHandler, "notifyUserInactivity");
        },
        afterEach: function () {
            this.oMeasureStartStub.restore();
            this.oMeasureEndStub.restore();
            this.oNotifyServerStub.restore();
            this.oNotifyUserInactivityStub.restore();
        }
    });

    QUnit.test("Test if all setup functions for the session timeout feature are called as expected", function (assert) {
        // Arrange
        var oConfig = {
            enableAutomaticSignout: true,
            sessionTimeoutReminderInMinutes: 20
        };
        this.oSessionHandler.config = oConfig;
        // Act
        this.oSessionHandler.initSessionTimeout();
        // Assert
        assert.ok(this.oMeasureStartStub.calledOnce, "jQuery.sap.measure.start was called");
        assert.ok(this.oMeasureEndStub.calledOnce, "jQuery.sap.measure.end was called");
        assert.ok(this.oNotifyServerStub.calledOnce, "notifyServer was called");
        assert.ok(this.oNotifyUserInactivityStub.calledOnce, "notifyUserInactivity was called");
        assert.ok(this.oModelStub.setProperty.calledOnce, "oModel.setProperty was called");
    });

    QUnit.test("Test if enableAutomaticSignout and sessionTimeoutReminderInMinutes default values are set", function (assert) {
        // Arrange
        var oConfig = {},
            oExpectedConfig = {
                enableAutomaticSignout: false,
                sessionTimeoutReminderInMinutes: 0
            };
        this.oSessionHandler.config = oConfig;
        // Act
        this.oSessionHandler.initSessionTimeout();
        // Assert
        assert.ok(this.oMeasureStartStub.calledOnce, "jQuery.sap.measure.start was called");
        assert.ok(this.oMeasureEndStub.calledOnce, "jQuery.sap.measure.end was called");
        assert.ok(this.oNotifyServerStub.calledOnce, "notifyServer was called");
        assert.ok(this.oNotifyUserInactivityStub.calledOnce, "notifyUserInactivity was called");
        assert.ok(this.oModelStub.setProperty.calledOnce, "oModel.setProperty was called");
        assert.deepEqual(this.oSessionHandler.config, oExpectedConfig, "default config values were set");
    });

    QUnit.module("initTileRequestTimeout", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oMeasureStartStub = sinon.stub(jQuery.sap.measure, "start");
            this.oMeasureEndStub = sinon.stub(jQuery.sap.measure, "end");
            this.checkStopBackendRequestRemainingTimeStub = sinon.stub(this.oSessionHandler, "checkStopBackendRequestRemainingTime");
        },
        afterEach: function () {
            this.oMeasureStartStub.restore();
            this.oMeasureEndStub.restore();
            this.checkStopBackendRequestRemainingTimeStub.restore();
        }
    });

    QUnit.test("Test if all setup functions for the tile request timeout feature are called as expected", function (assert) {
        // Arrange
        var oConfig = {
            sessionTimeoutTileStopRefreshIntervalInMinutes: 15
        };
        this.oSessionHandler.config = oConfig;
        // Act
        this.oSessionHandler.initTileRequestTimeout();
        // Assert
        assert.ok(this.oMeasureStartStub.calledOnce, "jQuery.sap.measure.start was called");
        assert.ok(this.oMeasureEndStub.calledOnce, "jQuery.sap.measure.end was called");
        assert.ok(this.checkStopBackendRequestRemainingTimeStub.calledOnce, "checkStopBackendRequestRemainingTime was called");
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "bBackendRequestsActive was initialised");
    });

    QUnit.module("checkStopBackendRequestRemainingTime", {
        beforeEach: function () {
            this.oFakeClock = sinon.useFakeTimers();
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oGetCurrentDateStub = sinon.stub(this.oSessionHandler, "_getCurrentDate").returns(new Date());
            this.oGetTimestampFromStorageStub = sinon.stub(this.oSessionHandler, "getTimestampFromStorage");
            this.oSetTileRequestsActiveStub = sinon.stub(this.oSessionHandler, "_setConnectionActive");
            this.oCheckTileStopRequestRemainingTimeSpy = sinon.spy(this.oSessionHandler, "checkStopBackendRequestRemainingTime");
        },
        afterEach: function () {
            this.oFakeClock.restore();
            this.oGetCurrentDateStub.restore();
            this.oGetTimestampFromStorageStub.restore();
            this.oSetTileRequestsActiveStub.restore();
            this.oCheckTileStopRequestRemainingTimeSpy.restore();
        }
    });

    QUnit.test("Test if checkStopBackendRequestRemainingTime is called in the expected interval", function (assert) {
        // Arrange
        var oConfig = {
                sessionTimeoutTileStopRefreshIntervalInMinutes: 15
            },
            oDateFromTenMinutesAgo = new Date(),
            oDateFromTwentyMinutesAgo = new Date();

        oDateFromTenMinutesAgo.setMinutes(oDateFromTenMinutesAgo.getMinutes() - 10);
        oDateFromTwentyMinutesAgo.setMinutes(oDateFromTwentyMinutesAgo.getMinutes() - 20);
        this.oSessionHandler.config = oConfig;
        this.oGetTimestampFromStorageStub.returns(oDateFromTenMinutesAgo);
        // Act & Assert
        // Initial call
        this.oSessionHandler.checkStopBackendRequestRemainingTime();
        assert.ok(this.oCheckTileStopRequestRemainingTimeSpy.calledOnce, "checkStopBackendRequestRemainingTime was not called more than once immediately");
        assert.ok(this.oSetTileRequestsActiveStub.notCalled, "_setConnectionActive was not called before the expected time has passed");
        // Advance 5 minutes to trigger the interval and pretend user was inactive for twenty minutes
        this.oGetTimestampFromStorageStub.returns(oDateFromTwentyMinutesAgo);
        this.oFakeClock.tick(5 * 60 * 1000);
        assert.ok(this.oCheckTileStopRequestRemainingTimeSpy.calledTwice, "checkStopBackendRequestRemainingTime was called a second time after the expected time has passed");
        assert.ok(this.oSetTileRequestsActiveStub.calledOnce, "_setConnectionActive was called after the expected amount of time has passed");
    });

    QUnit.module("_setConnectionActive", {
        beforeEach: function () {
            this.oConfigLastStub = sinon.stub(Config, "last");
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oCheckTileStopRequestRemainingTimeStub = sinon.stub(this.oSessionHandler, "checkStopBackendRequestRemainingTime");
            this.oSetTileVisibleOnHomepageStub = sinon.stub(this.oSessionHandler, "_setTilesVisibleOnHomepage");
            this.oSetTileInvisibleOnHomepageStub = sinon.stub(this.oSessionHandler, "_setTilesInvisibleOnHomepage");

            // EventBus
            this.oPublishStub = sinon.stub();
            this.oGetEventBusStub = sinon.stub().returns({
                publish: this.oPublishStub
            });
            this.oGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                getEventBus: this.oGetEventBusStub
            });

        },
        afterEach: function () {
            this.oConfigLastStub.restore();
            this.oCheckTileStopRequestRemainingTimeStub.restore();
            this.oSetTileVisibleOnHomepageStub.restore();
            this.oSetTileInvisibleOnHomepageStub.restore();
            this.oGetCoreStub.restore();
        }
    });

    QUnit.test("Test if checkTileStopRequestRemainingTime is called asynchronously if parameter true was provided", function (assert) {
        // Arrange
        var oFakeClock = sinon.useFakeTimers();
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        oFakeClock.tick(100);
        assert.ok(this.oCheckTileStopRequestRemainingTimeStub.calledOnce, "checkTileStopRequstRemainingTime was called after a few ms have passed.");
        oFakeClock.restore();
    });

    QUnit.test("Confirm no event is raised if communication to front-end server is already enabled as desired", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = true;
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        assert.strictEqual(this.oPublishStub.callCount, 0, "No event was published.");
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "SessionHandler.bBackendRequestsActive has the expected value.");
    });

    QUnit.test("Confirm no event is raised if communication to front-end server is already disabled as desired", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = false;
        // Act
        this.oSessionHandler._setConnectionActive(false);
        // Assert
        assert.strictEqual(this.oPublishStub.callCount, 0, "No event was published.");
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, false, "SessionHandler.bBackendRequestsActive has the expected value.");
    });

    QUnit.test("Confirm an event is raised if communication to front-end server isn't yet disabled as desired", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = true;
        // Act
        this.oSessionHandler._setConnectionActive(false);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, false, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.strictEqual(this.oPublishStub.callCount, 1, "One event was published.");
        assert.deepEqual(this.oPublishStub.getCall(0).args, ["launchpad", "setConnectionToServer", { "active": false }], "Arguments as expected.");
    });

    QUnit.test("Confirm an event is raised if communication to front-end server isn't yet enabled as desired", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = false;
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.strictEqual(this.oPublishStub.callCount, 1, "One event was published.");
        assert.deepEqual(this.oPublishStub.getCall(0).args, ["launchpad", "setConnectionToServer", { "active": true }], "Arguments as expected.");
    });

    QUnit.test("Confirm _setTilesInvisibleOnHomepage is called when parameter false was provided in classical homepage mode", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = true;
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);
        // Act
        this.oSessionHandler._setConnectionActive(false);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, false, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.ok(this.oSetTileInvisibleOnHomepageStub.calledOnce, "_setTilesInvisibleOnHomepage was called once.");
    });

    QUnit.test("Confirm _setTilesVisibleOnHomepage is called when parameter true was provided in classical homepage mode", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = false;
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.ok(this.oSetTileVisibleOnHomepageStub.calledOnce, "_setTilesVisibleOnHomepage was called once.");
    });

    QUnit.test("Confirm _setTilesVisible/InvisibleOnHomepage is not called when in FLP spaces mode if parameter is true", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = false;
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.ok(this.oSetTileVisibleOnHomepageStub.notCalled, "_setTilesVisibleOnHomepage was not called.");
        assert.ok(this.oSetTileInvisibleOnHomepageStub.notCalled, "_setTilesInvisibleOnHomepage was not called.");
    });

    QUnit.test("Confirm _setTilesVisible/InvisibleOnHomepage is not called when in FLP spaces mode if parameter is false", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = true;
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
        // Act
        this.oSessionHandler._setConnectionActive(false);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, false, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.ok(this.oSetTileVisibleOnHomepageStub.notCalled, "_setTilesVisibleOnHomepage was not called.");
        assert.ok(this.oSetTileInvisibleOnHomepageStub.notCalled, "_setTilesInvisibleOnHomepage was not called.");
    });


    QUnit.module("_setTileVisible", {
        beforeEach: function () {
            var that = this;
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oUtilsStub = {
                handleTilesVisibility: sinon.stub()
            };
            this.oRequireStub = sinon.stub(sap.ui, "require").callsFake(function (modules, callback) {
                var aLoadedModules = [];
                if (Array.isArray(modules)) {
                    modules.forEach(function (module) {
                        switch (module) {
                            case "sap/ushell/utils":
                                aLoadedModules.push(that.oUtilsStub);
                                break;
                            default:
                                break;
                        }
                    });
                }
                callback.apply(null, aLoadedModules);
            });
        },
        afterEach: function () {
            this.oRequireStub.restore();
        }
    });

    QUnit.test("Test if sap.ushell.utils.handleTilesVisibility is called", function (assert) {
        // Arrange
        // Act
        this.oSessionHandler._setTilesVisibleOnHomepage();
        // Assert
        assert.ok(this.oUtilsStub.handleTilesVisibility.calledOnce, "sap.ushell.utils.handleTilesVisibility was called");
    });

    QUnit.module("_setTilesInvisibleOnHomepage", {
        beforeEach: function () {
            var that = this;
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            // LaunchPageService
            this.oGetGroupsStub = sinon.stub().resolves([{
                groupTiles: ["tile1", "tile2"]
            }, {
                groupTiles: ["tile3", "tile4"]
            }]);
            this.oGetGroupTilesStub = sinon.stub().callsFake(function (group) {
                return group.groupTiles;
            });
            this.oSetTileVisibleStub = sinon.stub();
            this.oGetServiceAsyncStub = sinon.stub().callsFake(function (service) {
                if (service === "LaunchPage") {
                    return Promise.resolve({
                        getGroups: that.oGetGroupsStub,
                        getGroupTiles: that.oGetGroupTilesStub,
                        setTileVisible: that.oSetTileVisibleStub
                    });
                }
                return null;
            });
            ObjectPath.set("sap.ushell.Container.getServiceAsync", this.oGetServiceAsyncStub);
            // EventBus
            this.oPublishStub = sinon.stub();
            this.oGetEventBusStub = sinon.stub().returns({
                publish: this.oPublishStub
            });
            this.oGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                getEventBus: this.oGetEventBusStub
            });
        },
        afterEach: function () {
            this.oGetCoreStub.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Test if tiles are set invisible as expected", function (assert) {
        // Arrange
        var done = assert.async(),
            aExpectedPublishParameters = ["launchpad", "visibleTilesChanged", []];
        // Act
        var oSetTilesInvisiblePromise = this.oSessionHandler._setTilesInvisibleOnHomepage();
        // Assert
        oSetTilesInvisiblePromise.then(function () {
            assert.ok(this.oGetServiceAsyncStub.calledOnce, "getServiceAsync was called");
            assert.ok(this.oGetGroupsStub.calledOnce, "LaunchPageService.getGroups was called");
            assert.ok(this.oGetGroupTilesStub.calledTwice, "LaunchPageService.getGroupTiles was called twice");
            assert.strictEqual(this.oSetTileVisibleStub.callCount, 4, "LaunchPageService.setTileVisible was called four times as expected");
            assert.ok(this.oGetCoreStub.calledOnce, "getCore was called");
            assert.ok(this.oGetEventBusStub.calledOnce, "getEventBus was called");
            assert.deepEqual(this.oPublishStub.firstCall.args, aExpectedPublishParameters, "publish was called with expected arguments");
            done();
        }.bind(this));
    });


    QUnit.module("sap.ushell.SessionHandler", {
        beforeEach: function (assert) {
            var done = assert.async();
            sap.ushell.bootstrap("local").then(done);
         },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Test function notifyUserInactivity", function (assert) {
        var oSessionHandler = new SessionHandler(AppLifeCycle),
            iReminderIntervalInMinutes = oSessionHandlerConfig.sessionTimeoutIntervalInMinutes - oSessionHandlerConfig.sessionTimeoutReminderInMinutes,
            dBaseDate = new Date(),
            dDate1 = new Date(dBaseDate.getTime()),
            dDate2 = new Date(dBaseDate.getTime()),
            oCurrentDateStub,
            oGetTimestampFromStorageStub,
            bContinueWorkingDialogVisibilityStub,
            oCreateContinueWorkingDialogStub,
            putContinueWorkingDialogStub,
            oOpenDialogSpy = sinon.spy(),
            oOrigSetTimeout = window.setTimeout;

        dDate1.setMinutes(dBaseDate.getMinutes() + iReminderIntervalInMinutes - 10);
        dDate2.setMinutes(dBaseDate.getMinutes() + iReminderIntervalInMinutes + 2);

        oGetTimestampFromStorageStub = sinon.stub(oSessionHandler, "getTimestampFromStorage").returns(dBaseDate.toString());
        bContinueWorkingDialogVisibilityStub = sinon.stub(oSessionHandler, "getContinueWorkingVisibilityFromStorage").returns("false");
        putContinueWorkingDialogStub = sinon.stub(oSessionHandler, "putContinueWorkingVisibilityInStorage");



        oSessionHandler.config = oSessionHandlerConfig;
        window.setTimeout = sinon.spy();

        // Use-case 1: the time since the last action is smaller then reminderIntervalInMinutes
        oCurrentDateStub = sinon.stub(oSessionHandler, "_getCurrentDate").returns(dDate1);

        oSessionHandler.notifyUserInactivity();

        assert.ok(window.setTimeout.calledOnce === true, "setTimout called once when timeSinceLastActionInMinutes < reminderIntervalInMinutes");

        // Use-case 2: the time since the last action bigger then reminderIntervalInMinutes
        oCurrentDateStub.restore();
        oCurrentDateStub = sinon.stub(oSessionHandler, "_getCurrentDate").returns(dDate2);
        oSessionHandler.detachUserEvents = sinon.spy();
        oSessionHandler.handleSessionRemainingTime = sinon.spy();
        oCreateContinueWorkingDialogStub = sinon.stub(oSessionHandler, "createContinueWorkingDialog").returns({
            open: oOpenDialogSpy
        });

        oSessionHandler.notifyUserInactivity();

        assert.ok(window.setTimeout.calledOnce === true, "setTimout NOT called when timeSinceLastActionInMinutes > reminderIntervalInMinutes");
        assert.ok(oSessionHandler.detachUserEvents.calledOnce === true, "detachUserEvents called when timeSinceLastActionInMinutes > reminderIntervalInMinutes");
        assert.ok(oSessionHandler.handleSessionRemainingTime.calledOnce === true, "handleSessionRemainingTime called when timeSinceLastActionInMinutes > reminderIntervalInMinutes");
        assert.ok(oSessionHandler.handleSessionRemainingTime.args[0][0] === oSessionHandlerConfig.sessionTimeoutReminderInMinutes * 60, "handleSessionRemainingTime called with correct number of seconds");
        assert.ok(oOpenDialogSpy.calledOnce === true, "ContinueWorkingDialog opened when timeSinceLastActionInMinutes > reminderIntervalInMinutes");
        assert.ok(putContinueWorkingDialogStub.calledOnce, "putContinueWorkingDialogStub should be called once");
        assert.strictEqual(putContinueWorkingDialogStub.firstCall.args[0], null, "localStorage item showContinueWorkingDialog was reseted");

        oCurrentDateStub.restore();
        oGetTimestampFromStorageStub.restore();
        oCreateContinueWorkingDialogStub.restore();
        putContinueWorkingDialogStub.restore();
        bContinueWorkingDialogVisibilityStub.restore();
        window.setTimeout = oOrigSetTimeout;
    });

    QUnit.test("Test function notifyUserInactivity when Reminder off", function (assert) {
        var oSessionHandler = new SessionHandler(AppLifeCycle),
            iReminderIntervalInMinutes = oSessionHandlerConfigNoReminder.sessionTimeoutIntervalInMinutes - oSessionHandlerConfigNoReminder.sessionTimeoutReminderInMinutes,
            dBaseDate = new Date(),
            dDate1 = new Date(dBaseDate.getTime()),
            dDate2 = new Date(dBaseDate.getTime()),
            oCurrentDateStub,
            oGetTimestampFromStorageStub,
            oSessionTimeOutDialogStub,
            oOpenDialogSpy = sinon.spy(),
            oOrigSetTimeout = window.setTimeout,
            oCreateContinueWorkingDialogStub;

        dDate1.setMinutes(dBaseDate.getMinutes() + iReminderIntervalInMinutes - 10);
        dDate2.setMinutes(dBaseDate.getMinutes() + iReminderIntervalInMinutes + 2);

        oGetTimestampFromStorageStub = sinon.stub(oSessionHandler, "getTimestampFromStorage").returns(dBaseDate.toString());

        oSessionHandler.config = oSessionHandlerConfigNoReminder;

        oSessionTimeOutDialogStub = sinon.stub(oSessionHandler, "createSessionExpiredDialog").returns({
            open: oOpenDialogSpy
        });
        oCreateContinueWorkingDialogStub = sinon.stub(oSessionHandler, "createContinueWorkingDialog").returns({
            open: oOpenDialogSpy
        });

        window.setTimeout = sinon.spy();

        // Use-case 1: the time since the last action is smaller then reminderIntervalInMinutes
        oCurrentDateStub = sinon.stub(oSessionHandler, "_getCurrentDate").returns(dDate1);

        oSessionHandler.notifyUserInactivity();

        assert.ok(window.setTimeout.calledOnce, "setTimout should called when reminderIntervalInMinutes = 0 and the user has activity");
        assert.strictEqual(oSessionTimeOutDialogStub.callCount, 0, "createSessionExpiredDialog should not be called");
        assert.strictEqual(oOpenDialogSpy.callCount, 0, "sessionExpiredDialog should not be called");


        // Use-case 2: the time since the last action bigger then reminderIntervalInMinutes
        oCurrentDateStub.restore();
        oCurrentDateStub = sinon.stub(oSessionHandler, "_getCurrentDate").returns(dDate2);
        oSessionHandler.detachUserEvents = sinon.spy();
        oSessionHandler.handleSessionRemainingTime = sinon.spy();


        oSessionHandler.notifyUserInactivity();


        assert.ok(window.setTimeout.calledOnce, "setTimout should not called when reminderIntervalInMinutes = 0 and the interval is over");
        assert.ok(oSessionTimeOutDialogStub.calledOnce, "createSessionExpiredDialog should be called once");
        assert.ok(oOpenDialogSpy.calledOnce, "sessionExpiredDialog should be opened once");
        assert.strictEqual(oCreateContinueWorkingDialogStub.callCount, 0, "Continue Working Dialog should not called and open when reminderIntervalInMinutes = 0");
        assert.strictEqual(oSessionHandler.detachUserEvents.callCount, 0, "Continue Working Dialog should not called and open when reminderIntervalInMinutes = 0");
        assert.strictEqual(oSessionHandler.handleSessionRemainingTime.callCount, 0, "handleSessionRemainingTime should not called when reminderIntervalInMinutes = 0");

        oCurrentDateStub.restore();
        oGetTimestampFromStorageStub.restore();
        oCreateContinueWorkingDialogStub.restore();
        window.setTimeout = oOrigSetTimeout;
    });


    QUnit.test("Test function notifyServer", function (assert) {
        var oSessionHandler = new SessionHandler(AppLifeCycle),
            dBaseDate = new Date(),
            dDate1 = new Date(dBaseDate.getTime()),
            dDate2 = new Date(dBaseDate.getTime()),
            oGetTimestampFromStorageStub,
            oPostMessageToIframeStub,
            oCurrentDateStub,
            oOrigSetTimeout = window.setTimeout,
            oOrigContainerKeepAlive = sap.ushell.Container.sessionKeepAlive;


        dDate1.setMinutes(dBaseDate.getMinutes() + oSessionHandlerConfig.sessionTimeoutIntervalInMinutes - 2);
        dDate2.setMinutes(dBaseDate.getMinutes() + oSessionHandlerConfig.sessionTimeoutIntervalInMinutes + 2);

        oGetTimestampFromStorageStub = sinon.stub(oSessionHandler, "getTimestampFromStorage").returns(dBaseDate.toString());
        oPostMessageToIframeStub = sinon.stub(AppLifeCycle, "postMessageToIframeApp").returns();

        oSessionHandler.config = oSessionHandlerConfig;
        window.setTimeout = sinon.spy();
        sap.ushell.Container.sessionKeepAlive = sinon.spy();

        // Use-case 1: the time since the last action is smaller then sessionTimeoutIntervalInMinutes
        oCurrentDateStub = sinon.stub(oSessionHandler, "_getCurrentDate").returns(dDate1);

        oSessionHandler.notifyServer();

        assert.ok(sap.ushell.Container.sessionKeepAlive.calledOnce === true, "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> sap.ushell.Container.sessionKeepAlive called once");
        assert.ok(window.setTimeout.calledOnce === true, "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> setTimeout called");
        assert.ok(window.setTimeout.args[0][1] === oSessionHandlerConfig.sessionTimeoutIntervalInMinutes * 60 * 1000, "setTimeout called in order to wait another sessionTimeoutIntervalInMinutes interval");

        // Use-case 2: the time since the last action is bigger then sessionTimeoutIntervalInMinutes
        oCurrentDateStub.restore();
        oCurrentDateStub = sinon.stub(oSessionHandler, "_getCurrentDate").returns(dDate2);

        oSessionHandler.notifyServer();
        assert.ok(sap.ushell.Container.sessionKeepAlive.calledOnce === true, "Time from last user action is bigger than sessionTimeoutIntervalInMinutes -> sap.ushell.Container.sessionKeepAlive is not called");
        assert.ok(window.setTimeout.calledTwice === true, "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> setTimeout called");
        assert.ok(window.setTimeout.args[0][1] === oSessionHandlerConfig.sessionTimeoutIntervalInMinutes * 60 * 1000, "setTimeout called in order to wait another sessionTimeoutIntervalInMinutes interval");

        oGetTimestampFromStorageStub.restore();
        oPostMessageToIframeStub.restore();
        oCurrentDateStub.restore();
        window.setTimeout = oOrigSetTimeout;
        sap.ushell.Container.sessionKeepAlive = oOrigContainerKeepAlive;
    });

    QUnit.test("Test function handleSessionRemainingTime", function (assert) {
        var oSessionHandler = new SessionHandler(AppLifeCycle),
            oSetModelPropertySpy = sinon.spy(),
            oCloseKeepAliveDialogSpy = sinon.spy(),
            oSessionExpiredDialogOpenSpy = sinon.spy(),
            oEventBusPublishStub,
            putContinueWorkingDialogStub,
            bContinueWorkingDialogVisibilityStub,
            oExpiredDialogStub;

        oSessionHandler.oSessionKeepAliveDialog = {
            close: oCloseKeepAliveDialogSpy
        };

        oExpiredDialogStub = sinon.stub(oSessionHandler, "createSessionExpiredDialog").returns({
            open: oSessionExpiredDialogOpenSpy
        });
        oSessionHandler.oModel = {
            setProperty: oSetModelPropertySpy
        };

        oSessionHandler.config = oSessionHandlerConfig;

        oSessionHandler.logout = sinon.spy();
        oEventBusPublishStub = sinon.stub(sap.ui.getCore().getEventBus(), "publish").returns({});

        bContinueWorkingDialogVisibilityStub = sinon.stub(oSessionHandler, "getContinueWorkingVisibilityFromStorage").returns("false");
        putContinueWorkingDialogStub = sinon.stub(oSessionHandler, "putContinueWorkingVisibilityInStorage");

        oSessionHandler.handleSessionRemainingTime(30);
        assert.ok(oSetModelPropertySpy.calledOnce === true, "Session remaining time not 0 - the Model is updated");
        assert.ok(oSetModelPropertySpy.args[0][0] === "/SessionRemainingTimeInSeconds", "Session remaining time not 0 - the Model is updated");
        assert.ok(oSetModelPropertySpy.args[0][1] === 29, "Session remaining time not 0 - a second is rediced, and the Model is updated");

        oSessionHandler.config = {
                enableAutomaticSignout: false
        };
        oSessionHandler.handleSessionRemainingTime(0);
        assert.ok(oEventBusPublishStub.calledOnce === true, "Session remaining time is 0 - not in kiosk mode - sessionTimeout event published");
        assert.ok(oEventBusPublishStub.args[0][1] === "sessionTimeout", "Session remaining time is 0 - not in kiosk mode - sessionTimeout event published");
        assert.ok(oCloseKeepAliveDialogSpy.calledOnce === true, "Session remaining time is 0 - not in kiosk mode - KeepAlive dialog closed");
        assert.ok(oSessionHandler.logout.notCalled === true, "Session remaining time is 0 - not in kiosk mode - logout not called");
        assert.ok(oSessionExpiredDialogOpenSpy.calledOnce === true, "Session remaining time is 0 - not in kiosk mode - sessionTimeout dialog opened");

        oSessionHandler.config.enableAutomaticSignout = true;
        oSessionHandler.handleSessionRemainingTime(0);
        assert.ok(oEventBusPublishStub.calledTwice === true, "Session remaining time is 0 - kiosk mode - Event published once");
        assert.ok(oEventBusPublishStub.args[0][1] === "sessionTimeout", "Session remaining time is 0 - kiosk mode - sessionTimeout was published");
        assert.ok(oCloseKeepAliveDialogSpy.calledTwice === true, "Session remaining time is 0 - kiosk mode - KeepAlive dialog closed");
        assert.ok(oSessionHandler.logout.calledOnce === true, "Session remaining time is 0 - kiosk mode - logout called");
        assert.ok(oSessionExpiredDialogOpenSpy.calledOnce === true, "Session remaining time is 0 - kiosk mode - SessionExpiredDialog NOT opened");

        putContinueWorkingDialogStub.restore();
        bContinueWorkingDialogVisibilityStub.restore();
        oExpiredDialogStub.restore();
    });

    QUnit.test("Test function continueWorkingButtonPressHandler", function (assert) {
        var oSessionHandler = new SessionHandler(AppLifeCycle),
            oKeepAliveDialogCloseSpy = sinon.spy(),
            oCurrentDateStub,
            oPostMessageToIframeApp;

        oPostMessageToIframeApp = sinon.stub(AppLifeCycle, "postMessageToIframeApp");
        oSessionHandler.attachUserEvents = sinon.spy();
        oSessionHandler.notifyUserInactivity = sinon.spy();
        oSessionHandler.oSessionKeepAliveDialog = {
            close: oKeepAliveDialogCloseSpy
        };
        oCurrentDateStub = sinon.stub(oSessionHandler, "_getCurrentDate").returns("CurrentDate");
        oSessionHandler.continueWorkingButtonPressHandler();

        assert.ok(oSessionHandler.notifyUserInactivity.calledOnce === true, "notifyUserInactivity called once");
        assert.ok(oSessionHandler.getTimestampFromStorage() === "CurrentDate", "Correct date is stored in LocalStorage");
        assert.ok(oSessionHandler.attachUserEvents.calledOnce === true, "attachUserEvents called");
        assert.ok(oSessionHandler.getContinueWorkingVisibilityFromStorage() === false, "localStorage item showContinueWorkingDialog has the value false");

        oCurrentDateStub.restore();
        oPostMessageToIframeApp.restore();
    });

    QUnit.module("getLocalStorage", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oIsLocalStorageSupportedStub = sinon.stub(this.oSessionHandler, "_isLocalStorageSupported");
        },
        afterEach: function () {
            this.oIsLocalStorageSupportedStub.restore();
        }
    });

    QUnit.test("creates a new instance of sap.ui.util.Storage, checks if it is supported by the browser and saves the reference for later use", function (assert) {
        // Arrange
        var oResult,
            oResultOfSecondCall;
        this.oIsLocalStorageSupportedStub.returns(true);
        // Act
        oResult = this.oSessionHandler.getLocalStorage();
        oResultOfSecondCall = this.oSessionHandler.getLocalStorage();
        // Assert
        assert.ok(oResult instanceof Storage, "Returns an instance of sap.ui.util.Storage");
        assert.strictEqual(oResult, oResultOfSecondCall, "Returns the same instance of sap.ui.util.Storage when calling getLocalStorage two times");
    });

    QUnit.test("does not try to create multiple instances of sap.ui.util.Storage when the browser does not support localStorage", function (assert) {
        // Arrange
        var oResult,
            oResultOfSecondCall;
        this.oIsLocalStorageSupportedStub.returns(false);
        // Act
        oResult = this.oSessionHandler.getLocalStorage();
        oResultOfSecondCall = this.oSessionHandler.getLocalStorage();
        // Assert
        assert.strictEqual(oResult, false, "returns an false in case _isLocalStorageSupported fails");
        assert.strictEqual(oResultOfSecondCall, false, "returns false for further calls of _isLocalStorageSupported");
        assert.ok(this.oIsLocalStorageSupportedStub.calledOnce, "_isLocalStorageSupported was only called once");
    });

    QUnit.module("_isLocalStorageSupported", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oFakeStorage = {
                isSupported: sinon.stub()
            };
        }
    });

    QUnit.test("returns true if localStorage is supported", function (assert) {
        // Arrange
        var bResult;
        this.oFakeStorage.isSupported.returns(true);
        // Act
        bResult = this.oSessionHandler._isLocalStorageSupported(this.oFakeStorage);
        // Assert
        assert.ok(bResult, "expected result was returned");
    });

    QUnit.test("returns false and logs a warning if sap.ui.util.Storage reports it is not supported", function (assert) {
        // Arrange
        var oWarningStub = sinon.stub(Log, "warning"),
            bResult;
        this.oFakeStorage.isSupported.returns(false);
        // Act
        bResult = this.oSessionHandler._isLocalStorageSupported(this.oFakeStorage);
        // Assert
        assert.notOk(bResult, "expected result was returned");
        assert.ok(oWarningStub.calledOnce, "warning was logged");
        oWarningStub.restore();
    });

    QUnit.test("returns false and logs a warning if localStorage is not supported by the browser", function (assert) {
        // Arrange
        var oWarningStub = sinon.stub(Log, "warning"),
            bResult;
        // Act
        bResult = this.oSessionHandler._isLocalStorageSupported({}); // sap.ui.util.Storage.isSupported will throw an exception in this case so lets make it throw!
        // Assert
        assert.notOk(bResult, "expected result was returned");
        assert.ok(oWarningStub.calledOnce, "warning was logged");
        oWarningStub.restore();
    });
});
