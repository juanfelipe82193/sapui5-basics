// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery"
], function (jQuery) {
    "use strict";

    sap.ui.controller("sap.ushell.components.shell.UserSettings.UserProfiling", {
        onInit: function () {
            this.isContentLoaded = true;
        },

        onCancel: function () {
            var aProfilingEntries = this.getView().getModel().getProperty("/userPreferences/profiling"),
                oProfilingEntry,
                index;

            for (index = 0; index < aProfilingEntries.length; index++) {
                oProfilingEntry = aProfilingEntries[index];
                if (oProfilingEntry.onCancel) {
                    oProfilingEntry.onCancel();
                }
            }
        },

        getValue: function () {
            var deferred = jQuery.Deferred();
            var profilingEntries = this.getView().getModel().getProperty("/userPreferences/profiling");
            //remove usage analytics entry if its not enabled
            profilingEntries.forEach(function (entry, index) {
                if (entry.entryHelpID === "usageAnalytics") {
                    if (!sap.ushell.Container.getService("UsageAnalytics").systemEnabled() ||
                        !sap.ushell.Container.getService("UsageAnalytics").isSetUsageAnalyticsPermitted()) {
                        profilingEntries.splice(index, 1);
                    }
                }
            }, this);

            if (profilingEntries !== undefined && profilingEntries.length > 0) {
                deferred.resolve({
                    value: 1,
                    displayText: " "
                });
            } else {
                deferred.resolve({
                    value: 0,
                    displayText: " "
                });
            }
            return deferred.promise();
        },

        onSave: function () {
            var oResultDeferred = jQuery.Deferred(),
                aProfilingEntries = this.getView().getModel().getProperty("/userPreferences/profiling"),
                oWhenPromise,
                aPromiseArray = [],
                iTotalPromisesCount = 0,
                iSuccessCount = 0,
                iFailureCount = 0,
                aFailureMsgArr = [],
                oTempPromise,
                saveDoneFunc = function () {
                    iSuccessCount++;
                    oResultDeferred.notify();
                },
                saveFailFunc = function (err) {
                    aFailureMsgArr.push({
                        entry: "currEntryTitle",
                        message: err
                    });
                    iFailureCount++;
                    oResultDeferred.notify();
                };

            aProfilingEntries.forEach(function (item) {
                oTempPromise = item.onSave();
                oTempPromise.done(saveDoneFunc);
                oTempPromise.fail(saveFailFunc);
                aPromiseArray.push(oTempPromise);
                iTotalPromisesCount++;
            });

            oWhenPromise = jQuery.when.apply(null, aPromiseArray);

            oWhenPromise.done(function () {
                oResultDeferred.resolve();
            });

            oResultDeferred.progress(function () {
                if (iFailureCount > 0 && (iFailureCount + iSuccessCount === iTotalPromisesCount)) {
                    oResultDeferred.reject("At least one save action failed");
                }
            });

            return oResultDeferred.promise();
        },

        getContent: function () {
            var that = this,
                deferred = jQuery.Deferred(),
                aProfilingEntries = this.getView().getModel().getProperty("/userPreferences/profiling");

            aProfilingEntries.forEach(function (item) {
                var contentPromise = item.contentFunc();
                contentPromise.done(function (result) {
                    that.getView().profilingContent.addItem(result);
                });
            });

            deferred.resolve(that.getView());
            return deferred.promise();
        }
    });
});
