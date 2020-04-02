// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/resources"
], function (jQuery, resources) {
    "use strict";

    sap.ui.controller("sap.ushell.components.shell.UserSettings.UsageAnalyticsSelector", {
        onInit: function () {
            this.oUser = sap.ushell.Container.getUser();
            this.switchStateValue = this.oUser.getTrackUsageAnalytics();
            this.getView().oSwitchButton.setState(this.switchStateValue);
        },

        getContent: function () {
            var that = this,
                deferred = jQuery.Deferred();

            deferred.resolve(that.getView());
            return deferred.promise();
        },

        getValue: function () {
            var deferred = jQuery.Deferred(),
                i18n = resources.i18n;
            deferred.resolve(this.switchStateValue ? i18n.getText("trackingEnabled") : i18n.getText("trackingDisabled"));
            return deferred.promise();
        },

        onSave: function () {
            var currentUserTracking = this.getView().oSwitchButton.getState();
            this.switchStateValue = currentUserTracking;
            return sap.ushell.Container.getService("UsageAnalytics").setTrackUsageAnalytics(currentUserTracking);
        },

        onCancel: function () {
            this.getView().oSwitchButton.setState(this.switchStateValue);
        }
    });
}, /* bExport= */ true);
