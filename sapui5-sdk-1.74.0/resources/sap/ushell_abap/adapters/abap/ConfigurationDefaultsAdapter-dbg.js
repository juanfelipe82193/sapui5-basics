// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The ConfigurationDefaults adapter for the ABAP platform.
 *
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ushell_abap/bootstrap/evo/abap.constants",
    "sap/base/util/deepClone"
], function (oAbapConstants, fnDeepClone) {
    "use strict";

    /**
     *
     * @returns {sap.ushell_abap.adapters.abap.ConfigurationDefaultsAdapter}
     * @private
     */
    return function () {

        /**
         * @returns {Promise} Resolved promise contains all default configuration for abap platform
         */
        this.getDefaultConfig = function () {
            return Promise.resolve(fnDeepClone(oAbapConstants.defaultUshellConfig));
        };
    };
}, true /* bExport */);