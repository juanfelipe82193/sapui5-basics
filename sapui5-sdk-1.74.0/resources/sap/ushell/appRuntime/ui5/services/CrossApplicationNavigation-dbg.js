// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/services/CrossApplicationNavigation",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/services/_AppState/AppState",
    "sap/ui/thirdparty/jquery"
], function (CrossApplicationNavigation, AppRuntimeService, AppStateAppState, jQuery) {
    "use strict";

    function CrossApplicationNavigationProxy (oContainerInterface, sParameters, oServiceConf) {
        CrossApplicationNavigation.call(this, oContainerInterface, sParameters, oServiceConf);


        //this.backToPreviousApp = function () {
        //No return value
        //Attempts to use the browser history to navigate to the previous app.
        this.backToPreviousApp = function () {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.CrossApplicationNavigation.backToPreviousApp"
            );
        };

        //this.expandCompactHash = function (sHashFragment) {
        //return oDeferred.promise
        //if sHashFragment is a compacted hash (sap-intent-param is present), in a hash, this function replaces it
        // into a long url with all parameters expanded
        this.expandCompactHash = function (sHashFragment) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.CrossApplicationNavigation.expandCompactHash",
                {
                    "sHashFragment": sHashFragment
                }
            );
        };

        //this.getDistinctSemanticObjects = function () {
        //return Deferred.promise (jQuery.Deferred.promise)
        //Returns a list of semantic objects of the intents the current user can navigate to.
        this.getDistinctSemanticObjects = function () {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.CrossApplicationNavigation.getDistinctSemanticObjects"
            );
        };

        //this.getLinks = function (vArgs) {
        //returns Deferred.promise (jQuery.Deferred.promise)
        //Resolves the given semantic object (or action) and business parameters to a list of links available to the user
        this.getLinks = function (vArgs) {
            if (Array.isArray(vArgs)) {
                vArgs.forEach(function (element) {
                    if (element[0]) {
                        delete element[0].ui5Component;
                    }
                });
            } else {
                delete vArgs.ui5Component;
            }

            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.CrossApplicationNavigation.getLinks", vArgs);
        };

        //this.getPrimaryIntent = function ( sSemanticObject, mParameters ) {
        //returns Deferred or aLinks(?) (jQuery.Deferred)
        //For a given semantic object, this method considers all actions associated
        // with the semantic object and returns the one tagged as a "primaryAction"
        this.getPrimaryIntent = function (sSemanticObject, mParameters) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.CrossApplicationNavigation.getPrimaryIntent",
                {
                    "sSemanticObject": sSemanticObject,
                    "mParameters": mParameters
                }
            );
        };

        //this.getSemanticObjectLinks = function (sSemanticObject, mParameters,
        //bIgnoreFormFactor, oComponent, sAppStateKey, bCompactIntents) {
        //returns oDeferred.promise (object?)
        //DEPRICATED
        //Resolves a given semantic object and business parameters to a list of links
        this.getSemanticObjectLinks = function (sSemanticObject, mParameters, bIgnoreFormFactor, oComponent,
                                                sAppStateKey, bCompactIntents) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks",
                {
                    "sSemanticObject": sSemanticObject,
                    "mParameters": mParameters,
                    "bIgnoreFormFactor": bIgnoreFormFactor,
                    "sAppStateKey": sAppStateKey,
                    "bCompactIntents": bCompactIntents
                }
            );
        };

        //this.historyBack = function (iSteps) {
        //No return value (window history back)
        //performs window.history.go() with number of steps
        this.historyBack = function (iSteps) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.CrossApplicationNavigation.historyBack",
                {
                    "iSteps": iSteps
                }
            );
        };

        //this.isIntentSupported = function (aIntents, oComponent) {
        //return oDeferred.promise - object
        //"Supported" means that navigation to the intent is possible
        this.isIntentSupported = function (aIntents, oComponent) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.CrossApplicationNavigation.isIntentSupported",
                {
                    "aIntents": aIntents
                }
            );
        };

        //this.isNavigationSupported = function (aIntents, oComponent) {
        //return oDeferred.promise - object
        //"Supported" means that a valid navigation target is configured for the user for the given device
        this.isNavigationSupported = function (aIntents, oComponent) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.CrossApplicationNavigation.isNavigationSupported",
                {
                    "aIntents": aIntents
                }
            );
        };

        //this.toExternal = function (oArgs, oComponent) {
        //No return value
        // Invocation will trigger an hash change and subsequent invocation of the application
        this.toExternal = function (oArgs, oComponent) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.CrossApplicationNavigation.toExternal", {
                    "oArgs": oArgs
                });
        };

        this.getAppState = function (oAppComponent, sAppStateKey) {
            var oDeferred = new jQuery.Deferred();

            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.CrossApplicationNavigation.getAppState", {
                    "sAppStateKey": sAppStateKey
                }).done(function (oState) {
                var oAppStateAppState = new AppStateAppState(
                    sap.ushell.Container.getService("AppState"),
                    oState._sKey,
                    oState._bModifiable,
                    oState._sData,
                    oState._sAppName,
                    oState._sACHComponent,
                    oState._bTransient);
                oDeferred.resolve(oAppStateAppState);
            });

            return oDeferred.promise();
        };
    }

    CrossApplicationNavigationProxy.prototype = Object.create(CrossApplicationNavigation.prototype);
    CrossApplicationNavigationProxy.hasNoAdapter = CrossApplicationNavigation.hasNoAdapter;

    return CrossApplicationNavigationProxy;
}, true);
