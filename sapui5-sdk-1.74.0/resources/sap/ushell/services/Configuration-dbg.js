// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's Configuration service enables Components of any kind to consume parts of Configuration
 *    provided by the shell. It allows to attach on updates and receive the current values
 *
 *
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ushell/Config"
], function (Config) {

    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("Configuration")</code>.
     * Constructs a new Configuration service.
     *
     * @name sap.ushell.services.Configuration
     *
     * @constructor
     * @since 1.64.0
     * @see sap.ushell.services.Container#getService
     * @public
     */
    function Configuration () {

        /**
         * Allows to attach to any value change of the sizeBehavior configuration for homepage parts.
         * Once attached the callback will also be called for the last change to the property.
         * So this can be used as well to receive the current value and all later value changes in one call.
         *
         * Please ensure to detach from the registry calling .detach on the retuned object e.g. in the destroy function
         * of your component or controller
         *
         * Make sure that you do not attach twice with the same function as otherwise a detach
         * cannot be performed later
         *
         * @param {function} fnCallback  the function to be called once the property changes
         *
         * @returns {object} detach handler - call detach() to detach from further updates
         *
         * @public
         * @alias  sap.ushell.services.Configuration#attachSizeBehaviorUpdate
         */
        this.attachSizeBehaviorUpdate = function (fnCallback) {
            var oDoable = Config.on("/core/home/sizeBehavior");
            oDoable.do(fnCallback);
            return {
                detach: oDoable.off
            };
        };
    }
    Configuration.hasNoAdapter = true;
    return Configuration;
}, false /* bExport*/);