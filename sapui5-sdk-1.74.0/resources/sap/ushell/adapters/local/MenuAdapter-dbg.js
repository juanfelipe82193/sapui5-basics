// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview MenuAdapter for the local platform.
 */

sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/base/Log"
], function (ObjectPath, Log) {
    "use strict";

    /**
    * Constructs a new instance of the MenuAdapter for the local
    * platform
    *
    * @constructor
    * @since 1.72.0
    *
    * @param {object} system The system information. In a local environment this is not used
    * @param {string} parameter The Adapter parameter
    * @param {object} adapterConfiguration The Adapter configuration
    * @param {boolean} adapterConfiguration.enabled Determines if the menu should be enabled
    * @param {string} adapterConfiguration.menuDataUrl Path to the JSON file which contains all the menu entries
    *
    * @private
    */
    var MenuAdapter = function (system, parameter, adapterConfiguration) {
        this._oAdapterConfig = ObjectPath.get("config", adapterConfiguration);
    };

    MenuAdapter.prototype.isMenuEnabled = function () {
        return Promise.resolve(!!this._oAdapterConfig.enabled);
    };

    MenuAdapter.prototype.getMenuEntries = function () {
        var sMenuDataURL = this._oAdapterConfig.menuDataUrl;

        return new Promise(function (resolve, reject) {
            if (!sMenuDataURL) {
                Log.error("No menuDataUrl specified in the adapter configuration.", null, "sap.ushell.adapters.local.MenuAdapter");
                reject("No menuDataUrl specified in the adapter configuration.");
                return;
            }

            jQuery.ajax({
                type: "GET",
                dataType: "json",
                url: sMenuDataURL
            }).done(function (oResponseData) {
                resolve(oResponseData);
            }).fail(function (oError) {
                Log.error(oError.responseText);
                reject("Menu entries were requested but could not be loaded from JSON file: " + sMenuDataURL);
            });
        });
    };

    return MenuAdapter;
}, true);