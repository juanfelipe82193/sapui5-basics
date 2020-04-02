// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview
 * This module <code>sap.ushell_abap.bootstrap.evo.abap.configure.ushell</code>
 * returns a function which creates and returns a JSON object holding the
 * configuration of the SAP Fiori Launchpad (FLP) being served from an SAP
 * NetWeaver front-end server.
 *
 * The FLP configuration returned reflects the configuration on the SAP
 * front-end server (aka start-up configuration), the personalization of the
 * current user and URL parameter settings.
 *
 * It furthermore calculates if FLP pages get activated and if needed sets up
 * the configuration environment to run these.
 *
 * @version 1.74.0
 */
sap.ui.define([
    "./abap.constants",
    "sap/ushell/bootstrap/common/common.configure.ushell",
    "sap/base/util/ObjectPath",
    "sap/base/Log"
], function (oAbapConstants, fnConfigureUshellCommon, ObjectPath, Log) {
    "use strict";

    function logServerSideMessages (config) {
        var sComponent = "sap/ushell_abap/bootstrap/evo/abap.configure.ushell";
        var aMessages = config.messages;
        if (aMessages && aMessages.length > 0) {
            for (var i = 0; i < aMessages.length; i += 1) {
                if (aMessages[i].severity === "error") {
                    Log.error(aMessages[i].text, null, sComponent);
                } else if (aMessages[i].severity === "warning") {
                    Log.warning(aMessages[i].text, null, sComponent);
                }
            }
        }
    }

    function addContainerStartupConfig (config) {
        if (config.startupConfig) {
            var oContainerAdapter = ObjectPath.create("services.Container.adapter", config);
            oContainerAdapter.config = config.startupConfig;
        }
    }

    /**
     * Activates FLP spaces (based on pages and sections therein)
     * or the classical home page mode (based on app groups)
     * by setting the configuration switch <code>config.ushell.spaces.enabled</code> .
     *
     * For the decision it's first checked if the user is allowed to configure spaces mode
     * (<code>config.ushell.spaces.configurable</code>) and if so, uses the user setting
     * (<code>config.startupConfig.userProfile.SPACES_ENABLEMENT</code>).
     * If there's no permission, the admin's configuration passed from the back end is kept.
     *
     * @param {object} config FLP Configuration passed from back end
     */
    function setSpacesOrHomepageMode (config) {

        // Check if user is allowed to configure FLP spaces or homepage mode, and if so consider it
        var bSpacesConfigurableByUser = ObjectPath.get("ushell.spaces.configurable", config);
        if (bSpacesConfigurableByUser) {

            // Check if spaces have been activated by the user
            var aUserProfile = ObjectPath.get("startupConfig.userProfile", config) || [];
            var oSpacesProfile = aUserProfile.filter(function (property) {
                return property.id === "SPACES_ENABLEMENT";
            })[0];
            var sSpacesEnabledByUser = oSpacesProfile && oSpacesProfile.value;

            // If the user hasn't chosen any setting yet the personalization is undefined
            // and the admin setting isn't overwritten
            if (sSpacesEnabledByUser === "true") {
                ObjectPath.set("ushell.spaces.enabled", true, config);
            } else if (sSpacesEnabledByUser === "false") {
                ObjectPath.set("ushell.spaces.enabled", false, config);
            }
        }
    }

    function adaptConfigForFLPPages (config) {
        var oCDMAdapterConfig = ObjectPath.create("services.CommonDataModel.adapter", config);
        oCDMAdapterConfig.module = "sap.ushell.adapters.cdm.PagesCommonDataModelAdapter";
        ObjectPath.set("renderers.fiori2.componentData.config.enablePersonalization", false, config);
    }

    /**
     * Creates and returns a JSON configuration to run the SAP Fiori Launchpad (FLP)
     * using a SAP NetWeaver system as the front-end server.
     *
     * The configuration takes into account:
     * - A default configuration from <code>sap.ushell_abap.bootstrap.evo.abap.constants</code>
     * - The configuration stored in meta tags of the html document,
     *   which includes the start-up configuration
     *   and the personalization of the current user
     *   passed by the front-end server
     *   (see <code>sap.ushell.bootstrap.common.configure.ushell</code>)
     * - Configuration input handed over via URL parameters
     *
     * Furthermore, this module calculates whether FLP spaces are enabled,
     * and if needed then sets up the configuration environment to run these.
     * See configuration parameter <code>ushell.spaces.enabled</code>.
     *
     * @returns {object}
     *    JSON object representing the configuration to run the SAP Fiori
     *    Launchpad
     *
     * @since 1.58.0
     * @private
     */
    function configureUshell () {

        // Use default configuration
        var oConfig = fnConfigureUshellCommon(oAbapConstants);

        // Write any warnings and errors related to server-side config to console.
        logServerSideMessages(oConfig);

        // Add start_up configuration if provided by server (formerly retrieved by separate round trip to start_up service)
        addContainerStartupConfig(oConfig);

        // Set FLP spaces or homepage mode (ushell.spaces.enabled)
        // depending on global and user configuration retrieved from the back end
        setSpacesOrHomepageMode(oConfig);

        // Use CDM adapters in case the user views a sap ushell page
        if (ObjectPath.get("ushell.spaces.enabled", oConfig)) {
            adaptConfigForFLPPages(oConfig);
        }

        return oConfig;
    }

    // Return function to configure the SAP Fiori Launchpad
    return configureUshell;
});