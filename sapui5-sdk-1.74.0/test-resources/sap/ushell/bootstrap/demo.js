// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's bootstrap code for standalone demos.
 *
 * @version 1.74.0
 */
(function () {
    "use strict";
    /*global jQuery, sap, window */

    window['sap-ui-config'] = {
        "xx-bootTask": function (fnCallback) {
            var oUi5ComponentLoaderConfig;

            jQuery.sap.registerModulePath("sap.ushell.shells.demo", ".");

            // TODO: quick fix for search adapter test data
            jQuery.sap.registerModulePath("sap.ushell.adapters.local.searchResults", "./searchResults");

            //Load configuration for fiori demo
            var urlParams = window.getUrlParams()["demoConfig"];
            var demoConfig = decodeURIComponent(urlParams || "fioriDemoConfig");

            jQuery.sap.require("sap.ushell.shells.demo." + demoConfig.split("#")[0]);

            // by default we disable the core-ext-light loading for the sandbox
            oUi5ComponentLoaderConfig = jQuery.sap.getObject("services.Ui5ComponentLoader.config",
                0, window["sap-ushell-config"]);
            if (!oUi5ComponentLoaderConfig.hasOwnProperty("amendedLoading")) {
                oUi5ComponentLoaderConfig.amendedLoading = false;
            }

            // tell SAPUI5 that this boot task is done once the container has loaded
            sap.ui.require(["sap/ushell/services/Container"], function () {
                sap.ushell.bootstrap("local").done(fnCallback);
            });
        }
    };
}());
