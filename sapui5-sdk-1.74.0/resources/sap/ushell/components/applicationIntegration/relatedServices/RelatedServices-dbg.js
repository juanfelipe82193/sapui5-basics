// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview handle all the services for the different applications.
 * @version 1.74.0
 */
sap.ui.define([], function () {
    "use strict";

    function RelatedServices () {
        //handle the history service
        var fnBackNavigationHander;
        var oService = {};

        this._historyBackNavigation = function () {
            window.history.back();
        };

        this.navigateBack = function () {
            if (fnBackNavigationHander) {
                fnBackNavigationHander();
            } else {
                if (sap.ushell.Container.getService("CrossApplicationNavigation").isInitialNavigation()) {
                    // go back home
                    sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({ target: { shellHash: "#" }, writeHistory: false });
                    return;
                }
                this._historyBackNavigation();
            }
        };

        this.setNavigateBack = function (inFnBKImp) {
            fnBackNavigationHander = inFnBKImp;
            oService.backNavigationHander = fnBackNavigationHander;
        };

        this.resetNavigateBack = function () {
            fnBackNavigationHander = this._historyBackNavigation;
            oService.backNavigationHander = fnBackNavigationHander;
        };

        this.create = function () {
            fnBackNavigationHander = this._historyBackNavigation;
            oService = {
                backNavigationHander: fnBackNavigationHander
            };

            return oService;
        };


        this.restore = function (oInServices) {
            if (oInServices) {
                oService = oInServices;

                fnBackNavigationHander = oService.backNavigationHander;
            }
        };

        this.store = function (oServices) {
            //create a new instance of oService, so that the stored application related service will not be affected by the new application.
            oService = {
                backNavigationHander: this._historyBackNavigation
            };
        };


        this.destroy = function (oServices) {
            //handle destroy of the services
        };
    }


    return new RelatedServices();
}, /* bExport= */ true);
