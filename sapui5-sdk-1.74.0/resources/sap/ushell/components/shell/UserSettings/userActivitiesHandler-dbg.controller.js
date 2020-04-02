// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/ui/core/Component",
    "sap/ushell/resources"
], function (
    AppLifeCycle,
    Config,
    jQuery,
    Log,
    Component,
    resources
) {
    "use strict";

    sap.ui.controller("sap.ushell.components.shell.UserSettings.userActivitiesHandler", {
        onInit: function () {
            this.oModel = AppLifeCycle.getElementsModel().getModel();
            this.isTrackingEnable = this.oModel.getProperty("/enableTrackingActivity") !== undefined ? this.oModel.getProperty("/enableTrackingActivity") : true;
            this.currentTrackingMode = this.isTrackingEnable;
            this.oView.trackUserActivitySwitch.setState(this.isTrackingEnable);
        },

        getContent: function () {
            var oDfd = jQuery.Deferred();
            oDfd.resolve(this.getView());
            return oDfd.promise();
        },

        getValue: function () {
            return jQuery.Deferred().resolve(" ");
        },

        onCancel: function () {
            var oDfd = jQuery.Deferred();
            if (this.currentTrackingMode !== this.isTrackingEnable) {
                this.isTrackingEnable = !this.isTrackingEnable;
                this.oView.trackUserActivitySwitch.setState(this.isTrackingEnable);
            }
            oDfd.resolve();
            return oDfd.promise();
        },

        onSave: function () {
            var oDfd = jQuery.Deferred();
            if (this.currentTrackingMode !== this.isTrackingEnable) {
                this.oModel.setProperty("/enableTrackingActivity", this.isTrackingEnable);
                this.writeUserActivityModeToPersonalization(this.isTrackingEnable);
                this.currentTrackingMode = this.isTrackingEnable;
                Config.emit("/core/shell/model/enableTrackingActivity", this.isTrackingEnable);
            }
            oDfd.resolve();
            return oDfd.promise();
        },

        writeUserActivityModeToPersonalization: function (isTrackingEnable) {
            var oDeferred,
                oPromise;

            try {
                oPromise = this._getPersonalizer().setPersData(isTrackingEnable);
            } catch (err) {
                Log.error("Personalization service does not work:");
                Log.error(err.name + ": " + err.message);
                oDeferred = new jQuery.Deferred();
                oDeferred.reject(err);
                oPromise = oDeferred.promise();
            }
            return oPromise;
        },

        _getPersonalizer: function () {
            var oPersonalizationService = sap.ushell.Container.getService("Personalization"),
                oComponent = Component.getOwnerComponentFor(this),
                oScope = {
                    keyCategory: oPersonalizationService.constants.keyCategory.FIXED_KEY,
                    writeFrequency: oPersonalizationService.constants.writeFrequency.LOW,
                    clientStorageAllowed: true
                },
                oPersId = {
                    container: "flp.settings.FlpSettings",
                    item: "userActivitesTracking"
                };

            return oPersonalizationService.getPersonalizer(oPersId, oScope, oComponent);
        },

        _handleCleanHistory: function () {
            sap.ushell.Container.getServiceAsync("UserRecents").then(function (oService) {
                oService.clearRecentActivities();
                showSaveMessageToast();

                function showSaveMessageToast () {
                    sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
                        var message = resources.i18n.getText("savedChanges");

                        MessageToast.show(message, {
                            duration: 3000,
                            width: "15em",
                            my: "center bottom",
                            at: "center bottom",
                            of: window,
                            offset: "0 -50",
                            collision: "fit fit"
                        });
                    });
                }
            });
        },

        _handleTrackUserActivitySwitch: function (isVisible) {
            this.isTrackingEnable = isVisible;
        }
    });
});
