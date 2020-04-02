// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/resources",
    "sap/ushell/Config",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/ui/model/json/JSONModel",
    "sap/m/VBox",
    "sap/ui/core/library",
    "sap/ushell/ui/launchpad/LoadingDialog",
    "sap/ui/thirdparty/jquery",
    "sap/ui/util/Storage",
    "sap/base/Log"
], function (
    oResources,
    Config,
    Dialog,
    Button,
    Text,
    JSONModel,
    VBox,
    coreLibrary,
    LoadingDialog,
    jQuery,
    Storage,
    Log
) {
    "use strict";

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    /**
     * Manages the timeout of an FLP session
     * - Announces user activity to the platform (via UShell container service)
     * - Maintains user activity data on local storage to support multi-browser-tab use cases
     * - Notifies the user once the session is about to end, and gets the option of extending the session.
     *
     * Configuration settings
     *   - sessionTimeoutIntervalInMinutes : Session timeout configured by platform
     *   - keepSessionAliveAlertTimeInMinutes : Time before session timeout to display session keep alive popup
     *   - enableAutomaticLogout : When true the session refresh window is ommited and an automatic logoff perrformed.
     *
     * @param {object} AppLifeCycle The AppLifeCycle service
     */
    var SessionHandler = function (AppLifeCycle) {
        var that = this;

        /**
         * Initialises the sessionHandler and triggers initialisation process of enabled timeout methods
         *
         * @param {object} oConfig The config of the SessionHandler
         * @private
         */
        this.init = function (oConfig) {
            this.config = oConfig;
            this.oModel = new JSONModel();

            sap.ushell.Container.registerLogout(this.logout);
            this.putTimestampInStorage(this._getCurrentDate());
            this.putContinueWorkingVisibilityInStorage(null);
            this.registerCommHandlers();
            this.attachUserEvents();

            if (oConfig.sessionTimeoutIntervalInMinutes > 0) {
                this.initSessionTimeout();
            }
            if (oConfig.sessionTimeoutTileStopRefreshIntervalInMinutes > 0) {
                this.initTileRequestTimeout();
            }
        };

        /**
         * Initialization of the sessionHandling logic
         * Steps:
         *   1. Creating the local storage entry for session handling
         *   2. Setting of the local storage property that maintains the time of the last activity
         *
         * @since 1.70.0
         * @private
         */
        this.initSessionTimeout = function () {
            jQuery.sap.measure.start("SessionTimeoutInit", "Inititialize Session Timeout", "FLP_SHELL");
            // Default is to show the session timeout message box and not doing automatic logout (kiosk mode)
            if (this.config.enableAutomaticSignout === undefined) {
                this.config.enableAutomaticSignout = false;
            }
            if (this.config.sessionTimeoutReminderInMinutes === undefined) {
                this.config.sessionTimeoutReminderInMinutes = 0;
            }
            this.oModel.setProperty("/SessionRemainingTimeInSeconds", this.config.sessionTimeoutReminderInMinutes * 60);
            this.counter = 0;
            this.oKeepAliveDialog = undefined;
            // Related to sessionTimeoutIntervalInMinutes (e.g., 30 minutes)
            // For updating the server
            this.notifyServer();
            this.notifyUserInactivity();
            jQuery.sap.measure.end("SessionTimeoutInit");
        };

        this.registerCommHandlers = function () {
            AppLifeCycle.registerShellCommunicationHandler({
                "sap.ushell.sessionHandler": {
                    oRequestCalls: {
                        "logout": {
                            isActiveOnly: false,
                            distributionType: ["URL"]
                        },
                        "extendSessionEvent": {
                            isActiveOnly: false,
                            distributionType: ["all"]
                        }
                    },
                    oServiceCalls: {
                        "notifyUserActive": {
                            executeServiceCallFn: function (/*oServiceParams*/) {
                                that.userActivityHandler();
                                return new jQuery.Deferred().resolve().promise();
                            }
                        }
                    }
                }
            });
        };

        this._getTimeSinceLastActionInMinutes = function () {
            var timeSinceLastActionInMiliSecond = this._getCurrentDate() - new Date(this.getTimestampFromStorage());
            var timeSinceLastActionInMinutes = timeSinceLastActionInMiliSecond / (1000 * 60);
            return timeSinceLastActionInMinutes;
        };

        this.notifyUserInactivity = function () {
            var timeSinceLastActionInMinutes = this._getTimeSinceLastActionInMinutes(); // e.g. 10 minutes
            var reminderIntervalInMinutes = this.config.sessionTimeoutIntervalInMinutes - this.config.sessionTimeoutReminderInMinutes; // e.g. 25
            // The goal is to measure 25 minutes from the last user action.
            // For example: if the last user action happened 15 min ago, then now we should wait another 10min (i.e., 25-15=10)
            if (timeSinceLastActionInMinutes < reminderIntervalInMinutes) {
                setTimeout(this.notifyUserInactivity.bind(this), (reminderIntervalInMinutes - timeSinceLastActionInMinutes) * 60 * 1000);
            } else if (this.config.sessionTimeoutReminderInMinutes > 0) {
                // reset the ContinueWorkingVisibility parameter in localstore, if user already click on "continue" button
                this.putContinueWorkingVisibilityInStorage(null);
                // show popup
                this.detachUserEvents();
                // Parameters: iRemainingTime, bRemainingTimeIsInMinutes, bStopTimer
                this.handleSessionRemainingTime(this.config.sessionTimeoutReminderInMinutes * 60, true);

                this.oContinueWorkingDialog = this.createContinueWorkingDialog();
                this.oContinueWorkingDialog.open();

                // "Dialog opened" event saved in localStorage
            } else {
                this.handleSessionOver();
            }
        };

        this.handleSessionOver = function () {
            clearTimeout(this.notifyServerTimer);
            sap.ui.getCore().getEventBus().publish("launchpad", "sessionTimeout");
            if (this.config.enableAutomaticSignout === true) {
                this.logout();
            } else {
                this.createSessionExpiredDialog().open();
            }
        };

        this.notifyServer = function () {
            var timeSinceLastActionInMiliSecond = this._getCurrentDate() - new Date(this.getTimestampFromStorage()),
                timeSinceLastActionInMinutes = timeSinceLastActionInMiliSecond / (1000 * 60);
            // Last user action happened during the last sessionTimeoutIntervalInMinutes (e.g., 30 min)
            if (timeSinceLastActionInMinutes <= this.config.sessionTimeoutIntervalInMinutes) {
                // call service keepAlive to prevent server session time out before client session time
                sap.ushell.Container.sessionKeepAlive();

                //send post to isolated
                AppLifeCycle.postMessageToIframeApp("sap.ushell.sessionHandler", "extendSessionEvent", {});
            } else {
                // No activity during last server session length - do nothing
            }
            this.notifyServerTimer = setTimeout(this.notifyServer.bind(this), this.config.sessionTimeoutIntervalInMinutes * 60 * 1000);
        };

        this.handleSessionRemainingTime = function (iRemainingTimeInSeconds) {
            // For the use-case of multiple tabs/window (same session):
            // If the user clicked the "Continue working" button in other tab/window -
            // then we should act as if the user clicked the button in the dialog in this tab/window
            // To avoid the fringe case where the popup is opened _before_ the user opens the
            // second tab (when no user activity is being tracked anymore in the first tab),
            // we need to also check the TimeSinceLastAction.
            var shouldContinueWorkingAppear = this.getContinueWorkingVisibilityFromStorage();
            var timeSinceLastActionInMinutes = this._getTimeSinceLastActionInMinutes();
            if (timeSinceLastActionInMinutes < this.config.sessionTimeoutIntervalInMinutes - this.config.sessionTimeoutReminderInMinutes) {
                // If there was activity in another tab, this change will force the current popup
                // to close and the user activity tracking to get back to normal.
                // We substract the reminder time to avoid the popup to be closed too early,
                // thus breaking the timeout.
                shouldContinueWorkingAppear = false;
            }
            if (shouldContinueWorkingAppear !== undefined && shouldContinueWorkingAppear === false
                && this.oContinueWorkingDialog && this.oContinueWorkingDialog.isOpen()) {
                this.continueWorkingButtonPressHandler();
            }
            if (iRemainingTimeInSeconds === 0) {
                // Timeout is finished, and the user didn't choose to continue working
                if (this.oSessionKeepAliveDialog) {
                    this.oSessionKeepAliveDialog.close();
                }
                this.handleSessionOver();
            } else {
                iRemainingTimeInSeconds = iRemainingTimeInSeconds - 1;
                this.oModel.setProperty("/SessionRemainingTimeInSeconds", iRemainingTimeInSeconds);
                this.remainingTimer = setTimeout(that.handleSessionRemainingTime.bind(that, iRemainingTimeInSeconds, false), 1000);
            }
        };

        /**
         * Initialises the tile request timeout
         *
         * @since 1.70.0
         * @private
         */
        this.initTileRequestTimeout = function () {
            jQuery.sap.measure.start("SessionTileStopRequestInit", "Initialize tile request timeout", "FLP_SHELL");
            this.checkStopBackendRequestRemainingTime();
            this.bBackendRequestsActive = true;
            jQuery.sap.measure.end("SessionTileStopRequestInit");
        };

        /**
         * Sets up a timer to cancel all recuring requests by the tiles on the homepage to allow the backend session to timeout
         *
         * @since 1.70.0
         * @private
         */
        this.checkStopBackendRequestRemainingTime = function () {
            var sTimeSinceLastActionInMilliSecond = this._getCurrentDate() - new Date(this.getTimestampFromStorage()),
                sTimeSinceLastActionInMinutes = sTimeSinceLastActionInMilliSecond / (1000 * 60),
                sReminderIntervalInMinutes = this.config.sessionTimeoutTileStopRefreshIntervalInMinutes,
                sRemainingMillisecondsUntilTimeout = (sReminderIntervalInMinutes - sTimeSinceLastActionInMinutes) * 60 * 1000;

            if (sTimeSinceLastActionInMinutes < sReminderIntervalInMinutes) {
                setTimeout(this.checkStopBackendRequestRemainingTime.bind(this), sRemainingMillisecondsUntilTimeout);
            } else if (sReminderIntervalInMinutes > 0) {
                this._setConnectionActive(false);
            }
        };

        /**
         * Closes or resumes all connections to the servers
         *
         * The implementation is triggered via event <code>'launchpad'/'setConnectionToServer'</code>.
         * For the classic home page mode however, the server connection of the tiles is controlled within this module explicitly.
         *
         * @param {boolean} active Determines if the connection should be closed or resumed
         *
         * @since 1.70.0
         * @private
         */
        this._setConnectionActive = function (active) {

            // Periodically check if an active server connection is to be turned off
            if (active) {
                setTimeout(this.checkStopBackendRequestRemainingTime.bind(this), 0);
            }

            // Return if nothing to do
            if (this.bBackendRequestsActive === active) {
                return;
            }

            // Raise event to enable or disable communication to servers
            sap.ui.getCore().getEventBus().publish("launchpad", "setConnectionToServer", { "active": active });

            // Set tiles visible/invisible explicitly for classical home page
            if (!Config.last("/core/spaces/enabled")) {
                if (active) {
                    this._setTilesVisibleOnHomepage();
                } else {
                    this._setTilesInvisibleOnHomepage();
                }
            }

            // Remember current state
            this.bBackendRequestsActive = active;
        };

        /**
         * Triggers the visibilty update for tiles on the homepage.
         *
         * @since 1.70.0
         * @private
         */
        this._setTilesVisibleOnHomepage = function () {
            sap.ui.require(["sap/ushell/utils"], function (oUtils) {
                oUtils.handleTilesVisibility();
            });
        };

        /**
         * Sets all tiles on the homepage to invisible.
         * This stops the automatically recurring requests of dynamic and, if the visibility contract was implemented, custom tiles.
         *
         * @returns {Promise} A promises which resolves once all tiles were set invisible
         *
         * @since 1.70.0
         * @private
         */
        this._setTilesInvisibleOnHomepage = function () {
            // Return a promise mainly to make it testable
            return new Promise(function (resolve, reject) {

                return sap.ushell.Container.getServiceAsync("LaunchPage").then(function (LaunchPageService) {
                    LaunchPageService.getGroups().then(function (aGroups) {
                        var oEventBus = sap.ui.getCore().getEventBus();
                        aGroups.forEach(function (oGroup) {
                            /* eslint-disable-next-line max-nested-callbacks */
                            LaunchPageService.getGroupTiles(oGroup).forEach(function (oGroupTile) {
                                LaunchPageService.setTileVisible(oGroupTile, false);
                            });
                        });

                        oEventBus.publish("launchpad", "visibleTilesChanged", []); // This will clear the active dynamic tile cache of DashboardLoadingManager
                        resolve();
                    });
                });
            });
        };

        /**
         * Instantiates and validates the support of the local storage, then returns an interface for it.
         * A reference to the storage is kept after a successful instantiation for later use.
         *
         * @returns {Object} The local Storage interface
         * @private
         */
        this.getLocalStorage = function () {
            if (this.oLocalStorage === undefined) {
                var oStorage = new Storage(this.config && this.config.sessionType || Storage.Type.local);
                if (this._isLocalStorageSupported(oStorage)) {
                    this.oLocalStorage = oStorage;
                } else {
                    this.oLocalStorage = false; // Let's not keep creating new instances. If it is failing once it is expected to fail every time this session
                }
            }

            return this.oLocalStorage;
        };

        /**
         * Checks if the local storage is supported by the browser
         *
         * @param {Object} storage The storage interface to be checked
         * @returns {boolean} The result of the check
         * @private
         */
        this._isLocalStorageSupported = function (storage) {
            var bIsSupported;
            try {
                bIsSupported = storage.isSupported();
            } catch (error) {
                bIsSupported = false;
            }

            if (!bIsSupported) {
                Log.warning("SessionHandler failed to instantiate the local storage handler. Might be disabled by the browser!");
            }

            return bIsSupported;
        };

        /* ----------------------------------------- User Dialog controls - begin ----------------------------------------- */

        /**
         * Creates and returns a dialog box that announces the user about the remaining time until session timeout
         * and allows the user to renew the session or (depends of configuration) to sign our immediately.
         * The Dialog box structure:
         *   - sap.m.Dialog
         *     - sap.m.VBox (Texts VBox)
         *        - sap.m.Text (Mandatory: Remaining time text)
         *        - sap.m.Text (Optional: Data lost reminder text)
         *     - sap.m.Button (Mandatory: Continue working button)
         *     - sap.m.Button (Optional: Sign Out button)
         *
         * @returns {Object} The session keep alive dialog
         */
        this.createContinueWorkingDialog = function () {
            this.oMessageVBox = new VBox();
            this.oSessionKeepAliveLabel = new Text({
                text: {
                    parts: ["/SessionRemainingTimeInSeconds"],
                    formatter: function (iSessionRemainingTimeInSeconds) {
                        var bIsTimeInMinutes = iSessionRemainingTimeInSeconds > 60,
                            sTimeUnits,
                            iSessionRemainingTime,
                            sMessage;

                        sTimeUnits = bIsTimeInMinutes ? oResources.i18n.getText("sessionTimeoutMessage_units_minutes") : oResources.i18n.getText("sessionTimeoutMessage_units_seconds");
                        iSessionRemainingTime = bIsTimeInMinutes ? Math.ceil(iSessionRemainingTimeInSeconds / 60) : iSessionRemainingTimeInSeconds;
                        if (that.config.enableAutomaticSignout) {
                            sMessage = oResources.i18n.getText("sessionTimeoutMessage_kioskMode_main", [iSessionRemainingTime, sTimeUnits]);
                        } else {
                            sMessage = oResources.i18n.getText("sessionTimeoutMessage_main", [iSessionRemainingTime, sTimeUnits]);
                        }
                        return sMessage;
                    }
                }
            });
            this.oMessageVBox.addItem(this.oSessionKeepAliveLabel);

            if (this.config.enableAutomaticSignout === false) {
                this.oLostDataReminder = new Text({
                    text: oResources.i18n.getText("sessionTimeoutMessage_unsavedData")
                });
                this.oMessageVBox.addItem(this.oLostDataReminder);
            }

            this.oSessionKeepAliveLabel.setModel(this.oModel);

            this.oSessionKeepAliveDialog = new Dialog("sapUshellKeepAliveDialog", {
                title: oResources.i18n.getText("sessionTimeoutMessage_title"),
                type: "Message",
                state: ValueState.Warning,
                content: this.oMessageVBox,
                beginButton: this.getContinueWorkingButton(),
                afterClose: function () {
                    this.oSessionKeepAliveDialog.destroy();
                }.bind(this)
            });

            if (this.config.enableAutomaticSignout === true) {
                this.oSignOutButton = new Button({
                    text: oResources.i18n.getText("logoutBtn_title"),
                    tooltip: oResources.i18n.getText("logoutBtn_tooltip"),
                    press: this.logout.bind(this)
                });
                this.oSessionKeepAliveDialog.setEndButton(this.oSignOutButton);
            }

            return this.oSessionKeepAliveDialog;
        };

        this.getContinueWorkingButton = function () {
            return new Button({
                text: oResources.i18n.getText("sessionTimeoutMessage_continue_button_title"),
                press: that.continueWorkingButtonPressHandler.bind(that)
            });
        };

        this.continueWorkingButtonPressHandler = function () {
            if (this.oSessionKeepAliveDialog) {
                this.oSessionKeepAliveDialog.close();
            }
            clearTimeout(this.remainingTimer);
            this.putTimestampInStorage(this._getCurrentDate());

            // Start new setTimeout
            this.notifyUserInactivity();

            // Listen to user events (i.e., keyboard and mouse) after they were detached when UserKeepAliveDialog UI was created
            this.attachUserEvents();
            // set Local storage param to false , so other tabs message boxes will be closed
            this.putContinueWorkingVisibilityInStorage(false);

            //send post to isolated
            AppLifeCycle.postMessageToIframeApp("sap.ushell.sessionHandler", "extendSessionEvent", {});
        };

        this.createSessionExpiredDialog = function () {
            this.oSessionExpiredDialog = new Dialog("sapUshellSessioTimedOutDialog", {
                title: oResources.i18n.getText("sessionExpiredMessage_title"),
                type: "Message",
                state: ValueState.Warning,
                content: new Text({ text: oResources.i18n.getText("sessionExpiredMessage_main") }),
                beginButton: this.getReloadButton(),
                afterClose: function () {
                    this.oSessionExpiredDialog.destroy();
                }.bind(this)
            });
            return this.oSessionExpiredDialog;
        };

        this.getReloadButton = function () {
            return new Button({
                text: oResources.i18n.getText("sessionExpiredMessage_reloadPage_button_title"),
                press: function () {
                    that.oSessionExpiredDialog.close();
                    location.reload();
                }
            });
        };

        /* ------------------------------------------ User Dialogs controls - end ------------------------------------------ */

        this.attachUserEvents = function () {
            jQuery(document).on("mousedown.sessionTimeout mousemove.sessionTimeout", this.userActivityHandler.bind(this));
            jQuery(document).on("keyup.sessionTimeout", this.userActivityHandler.bind(this));
            jQuery(document).on("touchstart.sessionTimeout", this.userActivityHandler.bind(this));
            sap.ushell.Container.getService("AppLifeCycle").attachAppLoaded({}, this.userActivityHandler, this);
        };

        this.detachUserEvents = function () {
            jQuery(document).off("mousedown.sessionTimeout mousemove.sessionTimeout");
            jQuery(document).off("keydown.sessionTimeout");
            jQuery(document).off("touchstart.sessionTimeout");
            sap.ushell.Container.getService("AppLifeCycle").detachAppLoaded(this.userActivityHandler, this);
        };

        this.putTimestampInStorage = function (tTimestamp) {
            jQuery.sap.measure.average("SessionTimeoutPutLocalStorage", "Put timestamp in local storage Average", "FLP_SHELL");
            var oLocalStorage = this.getLocalStorage();
            if (oLocalStorage) {
                oLocalStorage.put("lastActivityTime", tTimestamp);
                if (this.bBackendRequestsActive === false) {
                    this._setConnectionActive(true);
                }
            }
            jQuery.sap.measure.end("SessionTimeoutPutLocalStorage");
        };

        this.putContinueWorkingVisibilityInStorage = function (bVisible) {
            var oLocalStorage = this.getLocalStorage();
            if (oLocalStorage) {
                oLocalStorage.put("showContinueWorkingDialog", bVisible);
            }
        };

        this.getContinueWorkingVisibilityFromStorage = function () {
            var oLocalStorage = this.getLocalStorage();
            if (oLocalStorage) {
                return oLocalStorage.get("showContinueWorkingDialog");
            }
            return null;
        };

        this.getTimestampFromStorage = function () {
            var oLocalStorage = this.getLocalStorage();
            if (oLocalStorage) {
                return oLocalStorage.get("lastActivityTime");
            }
            return null;
        };

        this.userActivityHandler = function (/*oEventData*/) {
            if (this.oUserActivityTimer !== undefined) {
                return;
            }

            this.oUserActivityTimer = setTimeout(function () {
                that.putTimestampInStorage(that._getCurrentDate());
                that.oUserActivityTimer = undefined;
            }, 1000);
        };

        this._getCurrentDate = function () {
            return new Date();
        };

        /**
         * Handle the logout functionality:
         *   1. Detach mouse and keyboard event handlers
         *   2. Clear timeouts
         *   3. Show logout message
         *   4. Perform logout via sap.ushell.Container
         */
        this.logout = function () {
            var oLoading = new LoadingDialog({ text: "" });

            // post the logout event to isolated
            AppLifeCycle.postMessageToIframeApp("sap.ushell.sessionHandler", "logout", {}, true).then(function () {
                that.detachUserEvents();
                clearTimeout(that.oUserActivityTimer);
                clearTimeout(that.remainingTimer);
                clearTimeout(that.notifyServerTimer);
                oLoading.openLoadingScreen();
                oLoading.showAppInfo(oResources.i18n.getText("beforeLogoutMsg"), null);
                sap.ushell.Container.setDirtyFlag(false);
                sap.ushell.Container.defaultLogout();
            });
        };
    };

    return SessionHandler;
}, /* bExport= */ true);
