// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell"s container adapter for the Common Data Model (CDM) platform.
 *
 * @version 1.74.0
 */
/**
 * @namespace Default namespace for Unified Shell adapters for the Common Data Model (CDM) platform.
 *
 * @name sap.ushell.adapters.cdm
 * @see sap.ushell.adapters.cdm.ContainerAdapter
 * @since 1.48.0
 * @private
 */
sap.ui.define([
    "sap/ushell/utils",
    "sap/ushell/User",
    "sap/ushell/System",
    "sap/ui/thirdparty/URI",
    "sap/base/Log",
    "sap/ui/thirdparty/jquery"
], function (
    oUtils,
    User,
    System,
    URI,
    Log,
    jQuery
) {

    "use strict";

    var oLogger = Log.getLogger("sap/ushell/adapters/cdm/ContainerAdapter", Log.Level.INFO);

    /**
     * This method MUST be called by the Unified Shell"s container only, others MUST call
     * <code>sap.ushell.services.initializeContainer("cdm")</code>.
     * Constructs a new instance of the container adapter for the Common Data Model (CDM) platform.
     *
     * @param {sap.ushell.System} oSystem
     *     the logon system (alias, platform, base URL)
     *
     * @class The Unified Shell's container adapter which does the bootstrap for the Common Data Model (CDM) platform.
     *
     * @constructor
     * @see sap.ushell.services.initializeContainer
     * @since 1.48.0
     * @private
     */
    var ContainerAdapter = function (oInitialSystem, sParameter, oProperties) {
        var S_LOGOUT_URL_DEFAULT = "/sap/public/bc/icf/logoff",
            sLogoutUrl = getLogoffUrl(oProperties.config, S_LOGOUT_URL_DEFAULT),
            oUser = createUser(oProperties.config),
            oSystem = createSystem(oInitialSystem, oProperties.config),
            oSessionKeepAliveConfig = getSessionKeepAliveConfig(oProperties.config);

        function getLogoffUrl (oConfig, sDefaultLogoffUrl) {
            if (oConfig.systemProperties && oConfig.systemProperties.logoutUrl) {
                return oConfig.systemProperties.logoutUrl;
            }

            return sDefaultLogoffUrl;
        }

        function createUser (oConfig) {
            var oUserSettings,
                oUserProfile = oConfig.userProfile;

            if (oUserProfile) {
                oUserSettings = createUserSettingsAsExpectedByUser(
                    oUserProfile.defaults,
                    oConfig.userProfilePersonalization,
                    oUserProfile.metadata
                );
            }

            return new User(oUserSettings || getNewUserSettingsWithDefaults());
        }

        function createSystem (oOldSystem, oConfig) {
            var oSystemProperties = oConfig.systemProperties,
                sAlias = oOldSystem.getAlias(),
                sPlatform = oOldSystem.getPlatform(),
                sBaseUrl = oOldSystem.getBaseUrl(),
                sSID,
                sClient;

            if (oSystemProperties) {
                sAlias = oSystemProperties.alias || sAlias;
                sPlatform = oSystemProperties.platform || sPlatform;
                sSID = oSystemProperties.SID;
                sClient = oSystemProperties.client;
            }

            return new System({
                alias: sAlias,
                platform: sPlatform,
                baseUrl: sBaseUrl,
                system: sSID,
                client: sClient
            });
        }

        /**
         * sap.ushell.User expects an object with user settings. This looks different than in
         * oProperties.config.userProfile as the interface expects the structure as the ABAP
         * start_up service returned it.
         *
         * @param {object} oDefaults
         * @param {object} oPersonalization
         * @param {object} oUserMetaData
         * @returns {object} UserSettings
         *
         * @private
         */
        function createUserSettingsAsExpectedByUser (oDefaults, oPersonalization, oUserMetaData) {
            var oUserSettings = jQuery.extend(getNewUserSettingsWithDefaults(), oDefaults, oPersonalization);

            oUserSettings.bootTheme = oUserSettings.bootTheme || {
                theme: oUserSettings.theme,
                root: ""
            };

            // ... remove redundant theme properties
            delete oUserSettings.theme;
            if (oUserMetaData) {
                // set edit modes
                if (oUserMetaData.editablePropterties) {
                    oUserSettings.setThemePermitted = oUserMetaData.editablePropterties.indexOf("theme") > -1;
                    oUserSettings.setAccessibilityPermitted = oUserMetaData.editablePropterties.indexOf("accessibility") > -1;
                    oUserSettings.setContentDensityPermitted = oUserMetaData.editablePropterties.indexOf("contentDensity") > -1;
                }
                if (oUserMetaData.ranges) {
                    oUserSettings.ranges = oUserMetaData.ranges;
                }
            }
            return oUserSettings;
        }

        /**
         * Returns an object with default settings as sap.ushell.Container expects it.
         * @returns {object}
         *   The user settings defaults within a new object
         * @private
         */
        function getNewUserSettingsWithDefaults () {
            return {
                setThemePermitted: false,
                setAccessibilityPermitted: false,
                setContentDensityPermitted: false
            };
        }

        /**
         * Validates and extracts the sessionKeepAlive configuration from the adapter configuration
         *
         * @param {object} oAdapterConfig the adapter config
         * @returns {object} the extracted sessionKeepAlive config or <code>null</code> if invalid of undefined
         */
        function getSessionKeepAliveConfig (oAdapterConfig) {
            var oConfig = oAdapterConfig && oAdapterConfig.systemProperties
                && oAdapterConfig.systemProperties.sessionKeepAlive;

            if (!oConfig) {
                return null;
            }

            if (!oConfig.url) {
                oLogger.error("Mandatory parameter 'url' missing in 'sessionKeepAlive' configuration.");
                return null;
            }

            if (oConfig.method !== "HEAD" && oConfig.method !== "GET") {
                oConfig.method = "HEAD";
            }

            return oConfig;
        }

        /**
         * Returns the logout URL.
         *
         * @returns {string}
         *  The logout URL as configured.
         *
         * @private
         */
        this._getLogoutUrl = function () {
            return sLogoutUrl;
        };

        /**
         * Sets the given sLocation as window.document.location in order to force a redirect
         *
         * @param {string} sLocation
         * @private
         */
        this._setDocumentLocation = function (sLocation) {
            document.location = sLocation;
        };

        /**
         * Returns the logon system.
         *
         * @returns {sap.ushell.System}
         *     object providing information about the system where the container is logged in
         *
         * @since 1.48.0
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
         * @since 1.48.0
         */
        this.getUser = function () {
            return oUser;
        };

        /**
         * Does the bootstrap for the Common Data Model (CDM) platform (and loads the container's configuration).
         *
         * @returns {jQuery.Promise}
         *     a promise that is resolved once the bootstrap is done
         *
         * @since 1.48.0
         */
        this.load = function () {
            // nothing to do here, as the configuration is already loaded via the cdm bootstrap.
            return jQuery.when();
        };

        /**
         * Returns the current URL. Mainly defined to ease testability.
         *
         * @returns {string}
         *    the URL displayed currently in the address bar
         *
         * @private
         */
        this.getCurrentUrl = function () {
            return window.location.href;
        };

        /**
         * Logs out the current user from this adapter's systems backend system.
         *
         * @param {boolean} bLogonSystem
         *      <code>true</code> if this system is the logon system
         * @returns {jQuery.Deferred}
         *      a <code>jQuery.Deferred</code> object's promise to be resolved when logout is
         *      finished, even when it failed
         * @since 1.48.0
         */
        this.logout = function (bLogonSystem) {
            var sFullLogOffUrl;

            if (!bLogonSystem) {
                // this is the logout from a non-logon system
                throw new Error("Not implemented");
            }

            // This is the logout from the logon system (FES).
            if (oUtils.hasNativeLogoutCapability()) {
                sFullLogOffUrl = (new URI(this._getLogoutUrl()))
                        .absoluteTo(this.getCurrentUrl())
                        .search("") // NOTE: remove query parameters
                        .toString();
                oUtils.getPrivateEpcm().doLogOff(sFullLogOffUrl);
            } else {
                // Do a redirect to the corresponding logout URL
                this.logoutRedirect();
            }

            return jQuery.when();
        };

        /**
         * Does necessary url adjustments and triggers the technical
         * redirect to the logoff page
         *
         * @since 1.48.0
         * @private
         */
        this.logoutRedirect = function () {
            // adjust the URL, e. g. by applying sap-client or base URL
            var sCurrentLogout = oSystem.adjustUrl(this._getLogoutUrl());
            this._setDocumentLocation(sCurrentLogout);
        };

        /**
         * Sends a request in order to extend server session
         * and prevent server session time out before client session time.
         * <p>
         * Reads the URL and HTTP method from the bootstrap configuration.
         *
         * @since 1.66.0
         */
        this.sessionKeepAlive = function () {

            if (!oSessionKeepAliveConfig) {
                return;
            }

            var oXHR = new XMLHttpRequest();
            oXHR.open(oSessionKeepAliveConfig.method, oSessionKeepAliveConfig.url, /*async=*/true);

            oXHR.onreadystatechange = function () {
                if (this.readyState === /*DONE*/4) {
                   oLogger.debug("Server session was extended");
                }
            };

            oXHR.send();
        };

        /**
         * Accessor for the sessionKeepAlive configuration. Only exposed for tests.
         *
         * @returns {object} - the validated sessionKeepAlive config
         *
         * @private
         */
        this._getSessionKeepAliveConfig = function () {
            return oSessionKeepAliveConfig;
        };
    };
    return ContainerAdapter;

}, /* bExport= */ true);
