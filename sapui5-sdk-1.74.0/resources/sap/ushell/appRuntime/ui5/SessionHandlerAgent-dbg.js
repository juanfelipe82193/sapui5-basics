// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/appRuntime/ui5/AppRuntimePostMessageAPI",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ui/thirdparty/jquery"
], function (AppRuntimePostMessageAPI, AppRuntimeService, jQuery) {
    "use strict";

    function SessionHandlerAgent () {

        this.init = function () {

            var that = this;

            //register for logout event from the shell
            AppRuntimePostMessageAPI.registerCommunicationHandler("sap.ushell.sessionHandler", {
                oInboundActions: {
                    "logout": {
                        executeServiceCallFn: function (oMessageData) {
                            return that.handleLogoutEvent(oMessageData);
                        }
                    },
                    "extendSessionEvent": {
                        executeServiceCallFn: function (oMessageData) {
                            return that.handleExtendSessionEvent(oMessageData);
                        }
                    }
                }
            });

            this.attachUserEvents();
            this.userActivityHandler();
        };

        this.handleLogoutEvent = function () {
            //send logout to the app
            var oDeferred = new jQuery.Deferred();

            this.detachUserEvents();
            sap.ushell.Container.logout().then(function () {
                return oDeferred.resolve().promise();
            });

            return oDeferred.promise();
        };

        this.handleExtendSessionEvent = function () {
            //send extend session  to the app
            sap.ushell.Container.sessionKeepAlive();
            return new jQuery.Deferred().resolve().promise();
        };

        this.attachUserEvents = function () {
            jQuery(document).on("mousedown.sessionTimeout mousemove.sessionTimeout", this.userActivityHandler.bind(this));
            jQuery(document).on("keyup.sessionTimeout", this.userActivityHandler.bind(this));
            jQuery(document).on("touchstart.sessionTimeout", this.userActivityHandler.bind(this));
        };

        this.detachUserEvents = function () {
            jQuery(document).off("mousedown.sessionTimeout mousemove.sessionTimeout");
            jQuery(document).off("keydown.sessionTimeout");
            jQuery(document).off("touchstart.sessionTimeout");
        };

        this.userActivityHandler = function (oEventData) {
            if (this.oUserActivityTimer !== undefined) {
                return;
            }

            var that = this;
            this.oUserActivityTimer = setTimeout(function () {

                //send notify extend session to the Shell
                AppRuntimeService.sendMessageToOuterShell( "sap.ushell.sessionHandler.notifyUserActive", {});

                that.oUserActivityTimer = undefined;

            }, 1000);
        };
    }

    var sessionHandlerAgent = new SessionHandlerAgent();
    return sessionHandlerAgent;
});
