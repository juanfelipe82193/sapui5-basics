// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's container adapter for the HANA platform.
 *
 * @version 1.74.0
 */
/**
 * @namespace Default namespace for Unified Shell adapters for the HANA platform. They can usually
 * be placed directly into this namespace, e.g.
 * <code>sap.ushell_abap.adapters.hana.ContainerAdapter</code>.
 *
 * @name sap.ushell_abap.adapters.hana
 * @see sap.ushell_abap.adapters.hana.ContainerAdapter
 * @since 1.11.0
 * @private
 */
sap.ui.define([
    "sap/ui2/srvc/utils",
    "sap/ushell/System",
    "sap/ushell/User",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log"
], function (utils, System, User, jQuery, Log) {
    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.services.initializeContainer("hana")</code>.
     * Constructs a new instance of the container adapter for the HANA platform.
     *
     * @param {sap.ushell.System} oSystem
     *     the logon system (alias, platform, base URL)
     *
     * @class The Unified Shell's container adapter which does the bootstrap for the HANA platform.
     *
     * @constructor
     * @see sap.ushell.services.initializeContainer
     * @since 1.11.0
     * @private
     */
    return function (oSystem) {
        var oUser;

        /**
         * Returns the logon system.
         *
         * @returns {sap.ushell.System}
         *     object providing information about the system where the container is logged in
         *
         * @since 1.11.0
         */
        this.getSystem = function () {
            return oSystem;
        };

        /**
         * Returns the logged-in user.
         *
         * @returns {sap.ushell.User}
         *      object providing information about the logged-in user
         *
         * @since 1.11.0
         */
        this.getUser = function () {
            return oUser;
        };

        /**
         * Does the bootstrap for the HANA platform (and loads the container's configuration).
         *
         * @returns {jQuery.Promise}
         *     a promise that is resolved once the bootstrap is done
         *
         * @since 1.11.0
         */
//        this.load = function () {
//        };

        /**
         * Logs out the current user from this adapter's systems backend system.
         *
         * @returns {jQuery.Deferred}
         *      a <code>jQuery.Deferred</code> object's promise to be resolved when logout is
         *      finished, even when it failed
         * @since 1.11.0
         */
        this.logout = function () {
            var oDeferred = new jQuery.Deferred();

            jQuery.ajax({
                type: "HEAD",
                url: oSystem.adjustUrl("/sap/hana/xs/formLogin/token.xsjs"),
                headers: {
                    "X-CSRF-Token": "Fetch"
                },
                success: function (oData, oStatus, oXhr) {
                    jQuery.ajax({
                        type: "POST",
                        url: oSystem.adjustUrl("/sap/hana/xs/formLogin/logout.xscfunc"),
                        headers: {
                            "X-CSRF-Token": oXhr.getResponseHeader("X-CSRF-Token")
                        },
                        success: function () {
                            Log.info("HANA system logged out: " + oSystem.getAlias(),
                                null, "sap.ushell_abap.adapters.hana.ContainerAdapter");
                            oDeferred.resolve();
                        },
                        error: function () {
                            Log.error("Logging out HANA system failed: "
                                + oSystem.getAlias(), null,
                                "sap.ushell_abap.adapters.hana.ContainerAdapter");
                            oDeferred.resolve();
                        }
                    });
                },
                error: function () {
                    Log.error("Fetching X-CSRF-Token failed: " + oSystem.getAlias(),
                        null, "sap.ushell_abap.adapters.hana.ContainerAdapter");
                    oDeferred.resolve();
                }
            });
            return oDeferred.promise();
        };
    };
}, true /* bExport */);